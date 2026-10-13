/* DEEN German production presentation. Source-guarded visual labels only.
 * Approval is verified before this module is imported. Question answers,
 * Quran Arabic, recitation and meanings are explicitly outside its scope. */
import {formatGermanDynamicText} from './german-ui.dynamic.staging.mjs';

// Do not process graded/source-signature-dependent lesson content with a generic UI lookup.
// Only the question adapter, after source/answer verification, may translate these fields.
// Protect Quran meaning/recitation and listening exercise surfaces independently.
const SOURCE_SENSITIVE='#questionText,#answerArea,#feedbackText,#feedbackBody,#finalStrengths,#finalReview,.deen-qarena-option,.deen-qj2-option,.deen-qj2-fill-slot,[data-qj2-fill-slot],[data-qj2-drag-word],[data-deen-source-question],[data-deen-question-answer],[data-deen-quran-meaning],[data-quran-meaning],[data-ayah-meaning],.deen-ayah-translation,.deen-verse-meaning';
const EXCLUDED='script,style,noscript,code,textarea,svg,[contenteditable="true"],[data-deen-no-translate],[data-deen-quran-ayah],[lang="ar"],[dir="rtl"],.deen-ikhlas-arabic,.deen-mem-arabic,.deen-qj2-ar,.deen-qj2-option.ar,'+SOURCE_SENSITIVE;
const ATTRIBUTES=['aria-label','title','placeholder','alt'];
const TURKISH_SIGNALS=/[ığşçİĞŞÇ]|\b(?:devam|geri|soru|ders|ayet|sure|görev|yanlış|doğru|hatırla|öğren|aşama|ünite|namaz|abdest|rozet|seviye)\b/i;

export function createGermanUIProductionRenderer({packs,englishReference}={}){
 if(!Array.isArray(packs)||packs.length!==13)throw Error('DE_STAGING_PACKS_INCOMPLETE');
 if(!englishReference||typeof englishReference!=='object')throw Error('DE_STAGING_SOURCE_REFERENCE_MISSING');
 const dictionary=new Map(),conflicts=[];
 for(const [index,pack] of packs.entries()){
  if(pack?.locale!=='de'||pack?.release_ready!==false||pack?.global_qa!=='blocked'||
      pack?.verified_by_religious_expert!==false||pack?.native_reviewer_approved!==false)
   throw Error('DE_STAGING_RELEASE_GUARD:'+index);
  if(index===12&&(pack.scope!=='actual_lesson_static_ui_staging'||pack.source_reference!=='release/v9.9.3-direct/segment-01.txt#lesson'))
   throw Error('DE_REAL_LESSON_SOURCE_IDENTITY');
  if(!pack.translations||pack.translation_count!==Object.keys(pack.translations).length)
   throw Error('DE_STAGING_COUNT:'+index);
  for(const [key,value] of Object.entries(pack.translations)){
   if(!key||typeof value!=='string'||!value.trim())throw Error('DE_STAGING_EMPTY_KEY:'+key);
   if(dictionary.has(key)&&dictionary.get(key)!==value)conflicts.push(key);
   else dictionary.set(key,value);
  }
 }
 if(conflicts.length)throw Error('DE_STAGING_CONFLICT:'+conflicts.join(','));
 if(dictionary.size!==1452)throw Error('DE_STAGING_DICTIONARY_DRIFT:'+dictionary.size);
 const sourceKeys=Object.keys(englishReference);
 if(sourceKeys.length!==1087||sourceKeys.some(key=>!dictionary.has(key)))throw Error('DE_STAGING_BASELINE_GAP');
 const originals=new WeakMap(),attributeOriginals=new WeakMap();
 let passes=0,writes=0;
 function translate(value){
  if(typeof value!=='string')return null;
  const trimmed=value.trim();if(!trimmed||/[\u0600-\u06ff]/u.test(trimmed))return null;
  const exact=dictionary.get(trimmed);
  if(exact&&exact!==trimmed)return value.replace(trimmed,exact);
  const dynamic=formatGermanDynamicText(value,{translateLabel:text=>dictionary.get(text)||null});
  return dynamic!==value?dynamic:null;
 }
 function eligible(el){
  if(!el||typeof el.closest!=='function')return true;
  return !el.closest(EXCLUDED);
 }
 function contextualStreakDay(source,element){
  if(typeof source!=='string'||source.trim()!=='gün')return null;
  // The shipped lesson header uses a *separate* #lessonStreakMini node.
  // Translating the isolated word as 'Tag' for every value would be wrong.
  const host=element?.closest?.('.lesson-chip.fire');
  const count=host?.querySelector?.('#lessonStreakMini')?.textContent?.trim();
  if(!/^(?:0|[1-9][0-9]*)$/.test(count||''))return null;
  return source.replace('gün',count==='1'?'Tag':'Tage');
 }
 function render(root,{locale='de',releaseAuthorized=false,documentRef=globalThis.document}={}){
  // Production must never invoke this renderer implicitly, even if DE is selected.
  if(releaseAuthorized!==true||locale!=='de'||!root||!documentRef?.createTreeWalker)
   throw Error('DE_GERMAN_UI_NOT_RELEASE_AUTHORIZED');
  const audit={mode:'release-gated',passes:++passes,writes:0,unresolved:new Set(),skipped:0,scanned:0};
  function convert(node,current,remember,set,contextual=null){
   let row=remember.get(node);
   if(!row||row.output!==current){row={source:current,output:current};remember.set(node,row)}
   audit.scanned++;
   const translated=contextual?.(row.source)??translate(row.source);
   if(translated===null){
    if(TURKISH_SIGNALS.test(row.source))audit.unresolved.add(row.source.trim());
    return;
   }
   if(current!==translated){set(translated);audit.writes++;writes++}
   row.output=translated;
  }
  const nf=documentRef.defaultView?.NodeFilter?.SHOW_TEXT??globalThis.NodeFilter?.SHOW_TEXT??4;
  const walker=documentRef.createTreeWalker(root,nf);let node;
  while((node=walker.nextNode())){
   if(!eligible(node.parentElement)){audit.skipped++;continue}
   convert(node,node.nodeValue,originals,value=>{node.nodeValue=value},source=>contextualStreakDay(source,node.parentElement));
  }
  for(const el of root.querySelectorAll?.('[aria-label],[title],[placeholder],[alt]')||[]){
   if(!eligible(el)){audit.skipped++;continue}
   let saved=attributeOriginals.get(el);if(!saved){saved=new Map();attributeOriginals.set(el,saved)}
   for(const attr of ATTRIBUTES)if(el.hasAttribute(attr)){
    const current=el.getAttribute(attr);
    const record={get:()=>saved.get(attr),set:(_,row)=>saved.set(attr,row)};
    convert(attr,current,record,value=>el.setAttribute(attr,value));
   }
  }
  return {mode:audit.mode,passes:audit.passes,writes:audit.writes,
   unresolved:[...audit.unresolved].sort(),skipped:audit.skipped,scanned:audit.scanned,
   cumulativeWrites:writes};
 }
 return Object.freeze({translate,render,stats:()=>({entries:dictionary.size,
  matchedReference:sourceKeys.filter(key=>dictionary.has(key)).length,passes,writes}),
  // Expose only the QA resolver. Do not expose a production activation action.
  scope:'release-gated'});
}


/* Approved-release bridge. This is NOT an approval mechanism. A human-reviewed
 * release manifest must contain every explicit signoff and SHA-256 of each
 * source pack before this code can run. Locale previews cannot set them. */
const UI_FILES=[
 'german-ui.staging.json','german-ui.lesson-flow.staging.json',
 'german-ui.premium-shop.staging.json','german-ui.quran-controls.staging.json',
 ...Array.from({length:8},(_,i)=>'german-ui.reference-batch-'+String(i+1).padStart(2,'0')+'.staging.json'),
 'german-ui.real-lesson.staging.json'
];
const HASH=/^[0-9a-f]{64}$/;
const SIGNOFFS=['religious_expert_approved','native_reviewer_approved',
 'rights_reviewed','ui_release_ready','quran_meanings_approved','production_bridge_ready'];
export function germanReleaseAuthorized(manifest){
 const c=manifest?.languages?.de;
 return !!c&&c.entry==='complete'&&c.question_data==='complete'&&c.global_qa==='passed'
  &&SIGNOFFS.every(k=>c[k]===true)
  &&Array.isArray(c.parts)&&c.parts.length===114
  &&c.parts.every(p=>typeof p.path==='string'&&HASH.test(p.sha256||'')&&p.count>0)
  &&Array.isArray(c.ui_parts)&&c.ui_parts.length===UI_FILES.length
  &&UI_FILES.every((file,i)=>c.ui_parts[i]?.path==='./assets/i18n/'+file
    &&HASH.test(c.ui_parts[i]?.sha256||''))
  &&HASH.test(c.ui_reference_sha256||'')
  &&HASH.test(c.production_bridge_sha256||'')
  &&HASH.test(c.quran_meanings_sha256||'');
}
const hex=bytes=>[...new Uint8Array(bytes)].map(v=>v.toString(16).padStart(2,'0')).join('');
async function verifiedJSON(path,sha,build){
 if(!path.startsWith('./assets/i18n/')||!HASH.test(sha))throw Error('DE_UI_SOURCE_NOT_PINNED');
 const response=await fetch(path+'?build='+encodeURIComponent(build),{cache:'no-store'});
 if(!response.ok)throw Error('DE_UI_HTTP:'+response.status+':'+path);
 const text=await response.text();
 const digest=hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)));
 if(digest!==sha)throw Error('DE_UI_HASH:'+path);
 return JSON.parse(text);
}
export async function installGermanProductionUI({manifest=window.__DEEN_CONTENT_MANIFEST__,
 documentRef=document,win=window}={}){
 if(!germanReleaseAuthorized(manifest))throw Error('DE_GERMAN_RELEASE_APPROVAL_REQUIRED');
 if(win.DEEN_APP_LOCALE?.get()!=='de'||documentRef.documentElement.lang!=='de')
  throw Error('DE_GERMAN_LOCALE_MISMATCH');
 const c=manifest.languages.de,build=win.__DEEN_DEPLOY_ID__||'';
 // Only source-pinned exact dictionaries are eligible for the production renderer.
 const [packs,reference]=await Promise.all([
  Promise.all(c.ui_parts.map(p=>verifiedJSON(p.path,p.sha256,build))),
  verifiedJSON('./assets/i18n/english-ui.draft.json',c.ui_reference_sha256,build)
 ]);
 const renderer=createGermanUIProductionRenderer({packs,englishReference:reference.translations});
 const observer=new win.MutationObserver(records=>{if(records.length&&!busy)schedule()});
 let queued=false,busy=false,feedbackCount=0,passes=0,lastAudit=null;
 function localize(){
  if(busy||win.DEEN_APP_LOCALE?.get()!=='de')return;
  busy=true;observer.disconnect();
  try{
   lastAudit=renderer.render(documentRef.body,{locale:'de',
    releaseAuthorized:true,documentRef});passes++;
  }finally{
   busy=false;
   observer.observe(documentRef.body,{subtree:true,childList:true,characterData:true,
    attributes:true,attributeFilter:['aria-label','title','placeholder','alt']});
  }
 }
 function schedule(){
  if(queued)return;queued=true;
  queueMicrotask(()=>{queued=false;localize()});
 }
 function onGraded(event){
  if(win.DEEN_APP_LOCALE?.get()!=='de')return;
  const question=event.detail?.question;
  const source=question?.__deenSourceQuestion||question;
  const translated=win.DEEN_CONTENT_LOCALE?.translateQuestion(source,'de');
  if(!translated||translated.__deenContentLocale!=='de')return;
  const correct=event.detail?.correct===true;
  const answer=translated.pairs?.length?
   translated.pairs.map(p=>p.left+' → '+p.right).join(' · '):
   translated.correct_order?.length?translated.correct_order.join(' → '):
   translated.correct_answer;
  if(!correct&&(typeof answer!=='string'||!answer.trim()))return;
  const title=documentRef.getElementById('feedbackTitle');
  const body=documentRef.getElementById('feedbackText')||documentRef.getElementById('feedbackBody');
  if(title)title.textContent=correct?'Richtig!':'Gemeinsam verbessern';
  if(body){
   const intro=win.state?.learningProfile==='child'?'Kurz gesagt: ':
    win.state?.learningProfile==='teen'?'Zusammenfassung: ':'';
   body.textContent=(correct?'':'Richtige Antwort: '+answer+'. ')+intro+translated.explanation_tr;
   feedbackCount++;
  }
  schedule();
 }
 documentRef.addEventListener('deen:question-graded',onGraded);
 for(const name of ['deen:language-changed','deen:question-rendered','deen:ui-updated',
   'deen:navigated','deen:profile-rendered','deen:settings-rendered'])
  documentRef.addEventListener(name,schedule);
 localize();
 const api=Object.freeze({localize,stats:()=>({passes,feedbackCount,...renderer.stats(),
  unresolved:lastAudit?.unresolved||[]}),scope:'review-gated-production'});
 win.DEEN_GERMAN_UI=api;
 return api;
}
