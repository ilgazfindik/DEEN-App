/*
 * German UI DOM adapter — STAGING / QA ONLY.
 * Not imported by index.html or boot.js; no app language or release flag is changed.
 * German source strings must match exactly: do not replace arbitrary substrings,
 * question answers, untranslated Quran meanings or Arabic recitation.
 */
import {formatGermanDynamicText} from './german-ui.dynamic.staging.mjs';

// Do not process graded/source-signature-dependent lesson content with a generic UI lookup.
// Only the question adapter, after source/answer verification, may translate these fields.
// Protect Quran meaning/recitation and listening exercise surfaces independently.
const SOURCE_SENSITIVE='#questionText,#answerArea,#feedbackText,#feedbackBody,#finalStrengths,#finalReview,.deen-qarena-option,.deen-qj2-option,.deen-qj2-fill-slot,[data-qj2-fill-slot],[data-qj2-drag-word],[data-deen-source-question],[data-deen-question-answer],[data-deen-quran-meaning],[data-quran-meaning],[data-ayah-meaning],.deen-ayah-translation,.deen-verse-meaning';
const EXCLUDED='script,style,noscript,code,textarea,svg,[contenteditable="true"],[data-deen-no-translate],[data-deen-quran-ayah],[lang="ar"],[dir="rtl"],.deen-ikhlas-arabic,.deen-mem-arabic,.deen-qj2-ar,.deen-qj2-option.ar,'+SOURCE_SENSITIVE;
const ATTRIBUTES=['aria-label','title','placeholder','alt'];
const TURKISH_SIGNALS=/[ığşçİĞŞÇ]|\b(?:devam|geri|soru|ders|ayet|sure|görev|yanlış|doğru|hatırla|öğren|aşama|ünite|namaz|abdest|rozet)\b/i;

export function createGermanUIStagingRenderer({packs,englishReference}={}){
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
 if(dictionary.size!==1451)throw Error('DE_STAGING_DICTIONARY_DRIFT:'+dictionary.size);
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
 function render(root,{locale='de',qaMode=false,documentRef=globalThis.document}={}){
  // Production must never invoke this renderer implicitly, even if DE is selected.
  if(qaMode!==true||locale!=='de'||!root||!documentRef?.createTreeWalker)
   throw Error('DE_GERMAN_UI_STAGING_PREVIEW_ONLY');
  const audit={mode:'staging-only',passes:++passes,writes:0,unresolved:new Set(),skipped:0,scanned:0};
  function convert(node,current,remember,set){
   let row=remember.get(node);
   if(!row||row.output!==current){row={source:current,output:current};remember.set(node,row)}
   audit.scanned++;
   const translated=translate(row.source);
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
   convert(node,node.nodeValue,originals,value=>{node.nodeValue=value});
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
  scope:'staging-only'});
}
