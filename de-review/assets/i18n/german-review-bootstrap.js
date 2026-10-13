/* Public DEEN German REVIEW build only: never promoted to main app or used for release approvals. */
(()=>{'use strict';
 const PATH='/DEEN-App/de-review/';
 if(location.hostname!=='ilgazfindik.github.io'||!location.pathname.startsWith(PATH)||!window.__DEEN_REVIEW_ISOLATED__)return;
 const reviewCSS=document.createElement('style');
 reviewCSS.id='deen-german-review-visual-fixes';
 reviewCSS.textContent=`
 #lesson .question-frame.v1013-match-ref .v9916-task-title{
   font-size:clamp(18px,4.6vw,22px)!important;
   line-height:1.17!important;letter-spacing:-.3px!important;
   white-space:normal!important;overflow-wrap:normal!important;
   max-width:100%!important;
 }
 #lesson .question-frame.v1013-match-ref .v1013-match-subtitle{
   max-width:100%!important;line-height:1.5!important;
 }
 html[lang="de"] .phone *,html[lang="de"] #resultView{
   scrollbar-width:thin;
   scrollbar-color:#35636a transparent;
 }
 html[lang="de"] .phone *::-webkit-scrollbar,
 html[lang="de"] #resultView::-webkit-scrollbar{width:6px;height:6px}
 html[lang="de"] .phone *::-webkit-scrollbar-track,
 html[lang="de"] #resultView::-webkit-scrollbar-track{background:transparent}
 html[lang="de"] .phone *::-webkit-scrollbar-thumb,
 html[lang="de"] #resultView::-webkit-scrollbar-thumb{
   background:#35636a;border-radius:8px
 }
 `;
 document.head.append(reviewCSS);
 // This heading is assembled from THREE nodes by the matching renderer; it
 // cannot be localized by translating each fragment independently.
 function fixMatchingHeading(){
  const el=document.querySelector('#lesson .question-frame.v1013-match-ref .v9916-task-title');
  if(el&&el.textContent?.replace(/\s+/g,' ').trim()==='Eşleşen çiftleri bul'){
   el.replaceChildren(document.createTextNode('Finde die '));
   const accent=document.createElement('span');accent.className='v1013-mint';
   accent.textContent='passenden';el.append(accent,document.createTextNode(' Paare'));
  }
 }
 const UI_PACKS=['german-ui.staging.json','german-ui.lesson-flow.staging.json',
  'german-ui.premium-shop.staging.json','german-ui.quran-controls.staging.json',
  ...Array.from({length:8},(_,i)=>'german-ui.reference-batch-'+String(i+1).padStart(2,'0')+'.staging.json'),
  'german-ui.real-lesson.staging.json'];
 function banner(){
  if(!document.body||document.getElementById('deenGermanReviewWarning'))return;
  const box=document.createElement('aside');
  box.id='deenGermanReviewWarning';
  box.dataset.deenNoTranslate='1';
  box.setAttribute('role','note');
  box.style.cssText='position:fixed;top:calc(env(safe-area-inset-top) + 5px);right:calc(env(safe-area-inset-right) + 6px);z-index:2147483647;pointer-events:none;max-width:min(115px,28vw);padding:4px 6px;border:1px solid #cca65b;background:rgba(20,30,34,.96);color:#ffe2a0;border-radius:8px;box-shadow:0 5px 16px #0008;font:700 9px/1.2 system-ui;text-align:center';
  box.textContent='DE · TESTVERSION / TASLAK — uzman onayı yok';
  document.body.append(box);
 }
 async function start(){
  banner();
  if(window.DEEN_APP_LOCALE?.get()!=='de')return;
  if(!window.__DEEN_CONTENT_MANIFEST__?.__deenSyntheticGermanQA||
    window.__DEEN_CONTENT_MANIFEST__?.languages?.de?.religious_expert_approved!==false)
   throw Error('DE_REVIEW_MUST_USE_UNAPPROVED_IN_MEMORY_MANIFEST');
  const getJSON=async name=>{
   const response=await fetch('./assets/i18n/'+name,{cache:'no-store'});
   if(!response.ok)throw Error('DE_REVIEW_UI_PACK_HTTP:'+name);
   return response.json();
  };
  const [packs,reference,{createGermanUIStagingRenderer}]=await Promise.all([
   Promise.all(UI_PACKS.map(getJSON)),
   getJSON('english-ui.draft.json'),
   import('./german-ui.renderer.staging.mjs')
  ]);
  const renderer=createGermanUIStagingRenderer({packs,englishReference:reference.translations});
  let busy=false,queued=false,latest=null,observer;
  function render(){
   if(busy||window.DEEN_APP_LOCALE?.get()!=='de')return;
   busy=true;observer.disconnect();
   try{
    banner();
    latest=renderer.render(document.body,{locale:'de',qaMode:true,documentRef:document});
    fixMatchingHeading();
   }finally{
    busy=false;observer.observe(document.body,{subtree:true,childList:true,characterData:true,
     attributes:true,attributeFilter:['aria-label','title','placeholder','alt']});
   }
  }
  function schedule(){
   if(queued)return;queued=true;
   queueMicrotask(()=>{queued=false;render()});
  }
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
   if(text)text.textContent=(correct?'':'Richtige Antwort: '+answer+'. ')+question.explanation_tr;
   schedule();
  });
  for(const event of ['deen:language-changed','deen:question-rendered','deen:ui-updated',
   'deen:navigated','deen:profile-rendered','deen:settings-rendered'])
    document.addEventListener(event,schedule);
  render();
  window.DEEN_GERMAN_REVIEW=Object.freeze({audit:()=>({...(latest||{}),
   released:false,approvals:false,read_only_presentation:true}),render});
 }
 function boot(){
  banner();
  start().catch(error=>{
   console.error('[DEEN German review UI]',error);
   const message=document.createElement('p');
   message.dataset.deenNoTranslate='1';
   message.setAttribute('role','alert');
   message.style.cssText='position:fixed;bottom:10px;left:10px;right:10px;z-index:2147483647;background:#3b131b;color:white;padding:10px;border-radius:10px;font:12px system-ui';
   message.textContent='Almanca arayüz testi açılamadı: '+String(error.message||error);
   document.body?.append(message);
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
 else boot();
})();