/* German game UI for the main app. Same status as the French layer: an unapproved draft
   (no expert, native-reviewer or rights sign-off). Quran meanings and Arabic recitation stay
   outside its scope; the approved-release bridge lives in de-review/german-ui.production.mjs. */
(()=>{
 'use strict';
 if(window.DEEN_APP_LOCALE?.get?.()!=='de')return;
 if(window.DEEN_GERMAN_UI)return;
 const BASE='./assets/i18n/de/';
 const UI_PACKS=['german-ui.staging.json','german-ui.lesson-flow.staging.json',
  'german-ui.premium-shop.staging.json','german-ui.quran-controls.staging.json',
  ...Array.from({length:8},(_,i)=>'german-ui.reference-batch-'+String(i+1).padStart(2,'0')+'.staging.json'),
  'german-ui.real-lesson.staging.json'];
 const LEAK_PACK='ui.leak-audit-2026-10.staging.json';

 // Pseudo-element labels cannot be reached by a text-node renderer.
 const css=document.createElement('style');css.id='deen-german-presentation-css';
 css.textContent=[
  ['.sequence-zone.empty::before','Wähle die Teile unten in der richtigen Reihenfolge'],
  ['.v710-builder-zone.empty::before','Ziehe Wörter hierher oder tippe sie an'],
  ['.lp-unlocking::after','NEUE LEKTION FREIGESCHALTET'],
  ['#profileScreenBody .v994-companion-avatar::after,html[lang="de"] #profileScreenBody .v997-companion-avatar::after','ändern'],
  ['.v852-card-grid .option::after,html[lang="de"] .v858-odd-card::after','TIPPEN'],
  ['.v852-card-grid .option.correct::after','RICHTIG ✓'],
  ['.v852-card-grid .option.wrong::after','NOCH EINMAL ANSEHEN'],
  ['.v853-match-card.selected::after','AUSGEWÄHLT'],
  ['.v855-fill-slot::before','IN DIE LÜCKE SETZEN'],
  ['.v858-odd-card.wrong-pick::after','NICHT DIESE'],
  ['.v858-odd-card.target::after','GEFUNDEN ✓'],
  ['.deen-reward-badge-missing::after','ABZEICHEN']
 ].map(([sel,text])=>'html[lang="de"] '+sel+'{content:'+JSON.stringify(text)+'!important}').join('\n')
  +'\nhtml[lang="de"] .v5-btn,html[lang="de"] .v5-list-title,html[lang="de"] .deen-language-card{overflow-wrap:anywhere;hyphens:auto}';
 document.head.append(css);

 const getJSON=async name=>{
  const response=await fetch(BASE+name+'?v='+encodeURIComponent(window.__DEEN_DEPLOY_ID__||''),{cache:'no-store'});
  if(!response.ok)throw Error('DE_UI_HTTP:'+name);
  return response.json();
 };
 // Leak-audit pack: exact keys plus {n}/{unit}/{topic} templates; it only fills gaps.
 function leakResolver(pack,resolveLabel){
  if(pack?.locale!=='de'||!pack.translations||pack.translation_count!==Object.keys(pack.translations).length)
   throw Error('DE_LEAK_PACK_SOURCE');
  const exact=new Map(),patterns=[];
  const esc=s=>s.replace(/[\^$.*+?()[\]{}|\\]/g,'\\$&');
  for(const [key,value] of Object.entries(pack.translations)){
   if(!/\{(?:n|unit|topic)\}/.test(key)){exact.set(key,value);continue}
   const fields=[];
   const re=new RegExp('^'+key.split(/(\{(?:n|unit|topic)\})/).map(part=>{
    const m=part.match(/^\{(n|unit|topic)\}$/);if(!m)return esc(part);
    fields.push(m[1]);return m[1]==='n'?'(\\d+)':'(.+?)';
   }).join('')+'$','u');
   patterns.push({re,fields,value});
  }
  return value=>{
   const trimmed=String(value).trim();if(!trimmed)return null;
   const hit=exact.get(trimmed);if(hit)return String(value).replace(trimmed,hit);
   for(const p of patterns){
    const m=p.re.exec(trimmed);if(!m)continue;
    let i=0,unknown=false;
    const out=p.value.replace(/\{(?:n|unit|topic)\}/g,()=>{
     const field=p.fields[i],v=m[++i];if(field==='n')return v;
     const label=resolveLabel(v);if(label)return label.trim();
     // Never leave a Turkish unit/stage title inside German text.
     if(/[ığşçöüİĞŞÇÖÜ]/.test(v))unknown=true;return v;
    });
    if(!unknown)return String(value).replace(trimmed,out);
   }
   return null;
  };
 }
 // The matching renderer assembles this heading from three nodes.
 function fixMatchingHeading(){
  const el=document.querySelector('#lesson .question-frame.v1013-match-ref .v9916-task-title');
  if(el&&el.textContent?.replace(/\s+/g,' ').trim()==='Eşleşen çiftleri bul'){
   el.replaceChildren(document.createTextNode('Finde die '));
   const accent=document.createElement('span');accent.className='v1013-mint';
   accent.textContent='passenden';el.append(accent,document.createTextNode(' Paare'));
  }
 }
 async function start(){
  const [packs,reference,leak,{createGermanUIStagingRenderer}]=await Promise.all([
   Promise.all(UI_PACKS.map(getJSON)),
   fetch('./assets/i18n/english-ui.draft.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('DE_UI_REFERENCE_HTTP');return r.json()}),
   getJSON(LEAK_PACK),
   import(BASE+'german-ui.renderer.staging.mjs')
  ]);
  let renderer=null;
  // Stage headers print unit titles in Turkish upper case ("İSLAM NEDİR?"); map them back to the reviewed title.
  const upper=new Map();
  for(const pack of packs)for(const [key,value] of Object.entries(pack.translations||{}))
   if(!upper.has(key.toLocaleUpperCase('tr')))upper.set(key.toLocaleUpperCase('tr'),value.toLocaleUpperCase('de'));
  const resolveLabel=text=>{const t=renderer?.translate(text);if(t&&t!==text)return t;return upper.get(String(text).trim())||null};
  const leakExtra=leakResolver(leak,resolveLabel);
  const extra=value=>leakExtra(value)??(upper.has(String(value).trim())?String(value).replace(String(value).trim(),upper.get(String(value).trim())):null);
  renderer=createGermanUIStagingRenderer({packs,englishReference:reference.translations,extraTranslate:extra});
  let busy=false,queued=false,latest=null,foundAfterMiss=null,observer;
  function render(){
   if(busy||window.DEEN_APP_LOCALE?.get()!=='de')return;
   busy=true;observer.disconnect();
   try{
    // qaMode marks the unapproved draft renderer; it never sets an approval flag.
    latest=renderer.render(document.body,{locale:'de',qaMode:true,documentRef:document});
    fixMatchingHeading();
    if(foundAfterMiss){
     let index=-1;try{index=session?.index}catch(_){}
     const title=document.getElementById('feedbackTitle');
     if(index!==foundAfterMiss)foundAfterMiss=null;
     else{
      if(title&&title.textContent!=='Gefunden – nicht beim ersten Versuch')title.textContent='Gefunden – nicht beim ersten Versuch';
      const body=document.getElementById('feedbackText'),next=body?.textContent.replace(/^Richtige Antwort: [^.]*\.\s*/,'');
      if(body&&next!==body.textContent)body.textContent=next;
     }
    }
   }finally{
    busy=false;observer.observe(document.body,{subtree:true,childList:true,characterData:true,
     attributes:true,attributeFilter:['aria-label','title','placeholder','alt']});
   }
  }
  function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;render()})}
  observer=new MutationObserver(rows=>{if(rows.length&&!busy)schedule()});
  document.addEventListener('deen:question-graded',event=>{
   if(window.DEEN_APP_LOCALE?.get()!=='de')return;
   const raw=event.detail?.question?.__deenSourceQuestion||event.detail?.question;
   const question=raw&&window.DEEN_CONTENT_LOCALE?.translateQuestion(raw,'de');
   if(!question||question.__deenContentLocale!=='de')return;
   const correct=event.detail?.correct===true;
   const answer=question.pairs?.length?question.pairs.map(x=>x.left+' → '+x.right).join(' · '):
    question.correct_order?.length?question.correct_order.join(' → '):question.correct_answer;
   if(!correct&&(typeof answer!=='string'||!answer.trim()))return;
   const title=document.getElementById('feedbackTitle');
   const text=document.getElementById('feedbackText')||document.getElementById('feedbackBody');
   if(title)title.textContent=correct?'Richtig!':'Gemeinsam verbessern';
   if(text){
    const intro=window.state?.learningProfile==='child'?'Kurz gesagt: ':window.state?.learningProfile==='teen'?'Zusammenfassung: ':'';
    text.textContent=(correct?'':'Richtige Antwort: '+answer+'. ')+intro+question.explanation_tr;
   }
   schedule();
  });
  // Odd-one-out: a find-after-miss is not clean, but the learner did find the target.
  document.addEventListener('deen:odd-one-out:complete',event=>{
   if(window.DEEN_APP_LOCALE?.get()!=='de'||event.detail?.correct!==false)return;
   try{foundAfterMiss=session?.index}catch(_){}
   const text=document.getElementById('feedbackText');
   if(text)text.textContent=text.textContent.replace(/^Richtige Antwort: [^.]*\.\s*/,'');
   schedule();
  });
  for(const name of ['deen:language-changed','deen:question-rendered','deen:ui-updated',
   'deen:navigated','deen:profile-rendered','deen:settings-rendered'])document.addEventListener(name,schedule);
  render();
  window.DEEN_GERMAN_UI=Object.freeze({render,translate:value=>renderer.translate(value),
   audit:()=>({...(latest||{}),stats:renderer.stats(),approved:false}),version:'de-game-ui-v1'});
 }
 const boot=()=>start().catch(error=>console.error('[DEEN German game UI]',error?.message||error));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
