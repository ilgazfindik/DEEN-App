/*
 * Genuine 'de' runtime bootstrap acceptance in an isolated local browser.
 * The test overrides the manifest IN MEMORY, at 127.0.0.1 only.
 * Production files, releases, audit approvals, and user accounts are untouched.
 * An alternate browser without this init script MUST remain blocked.
 */
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
const origin=process.env.DEEN_QA_ORIGIN||'http://127.0.0.1:8765';
const output=process.env.DEEN_QA_OUTPUT||'qa-artifacts/german-browser';
if(new URL(origin).hostname!=='127.0.0.1')throw Error('QA_PREVIEW_HOST_REQUIRED');
const fixture=JSON.parse(readFileSync(output+'/qa-preview-config.json','utf8'));
assert(fixture.qa_only&&fixture.production_untouched&&fixture.actual_german_approved===false);
assert.equal(fixture.parts.length,114);
mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report={scope:'TRUE_GERMAN_RUNTIME_LOCAL_ONLY',real_manifest_modified:false,
 synthetic_approval_only_in_browser_memory:true,locale:'de',production_release:false,errors:[]};
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
page.on('pageerror',e=>report.errors.push(String(e.stack||e)));
page.on('console',m=>{if(m.type()==='error')report.errors.push('console:'+m.text())});
try{
 await page.addInitScript(({preview})=>{
  if(location.hostname!=='127.0.0.1')throw Error('PREVIEW_HOST_NOT_LOCAL');
  let current;
  Object.defineProperty(window,'__DEEN_CONTENT_MANIFEST__',{
   configurable:true,enumerable:true,
   get(){return current},
   set(value){
    if(!value||value.languages?.de?.question_data!=='missing'||value.languages.de.global_qa!=='blocked')
     throw Error('PREVIEW_DID_NOT_START_FROM_BLOCKED_RELEASE');
    if(value.languages.de.religious_expert_approved!==false)
     throw Error('UNEXPECTED_RELEASE_APPROVAL');
    current=value;
    // Synthetic approval for this disposable browser ONLY: all source packs
    // still retain their literal expert_approved:false flags and SHA-256 checks.
    current.languages.de=structuredClone(preview);
    current.__deenSyntheticGermanQA=true;
   }
  });
 },{preview:fixture.preview_language_config});
 const response=await page.goto(origin+'/?previewLanguage=1',
  {waitUntil:'domcontentloaded',timeout:60000});
 assert.equal(response?.status(),200);
 await page.waitForSelector('#deenLanguageGate [data-locale="de"]',{timeout:90000});
 await page.locator('#deenLanguageGate [data-locale="de"]').click();
 await page.locator('#deenLanguageGate .deen-language-continue').click();
 await page.waitForFunction(()=>window.DEEN_APP_LOCALE?.get()==='de'&&
    window.DEEN_CONTENT_LOCALE?.available('de')&&
    window.__DEEN_CONTENT_MANIFEST__?.__deenSyntheticGermanQA===true,
  null,{timeout:100000});
 await page.waitForFunction(()=>typeof QUESTIONS!=='undefined'&&
    Array.isArray(QUESTIONS)&&QUESTIONS.length===1484,null,{timeout:90000});
 const ready=await page.evaluate(async()=>{
  if(typeof state==='undefined'||!state.settings)throw Error('Missing app state');
  // Skip only the personal-data onboarding sequence in this disposable E2E
  // profile, not language selection, actual content loading or validation.
  state.onboarded=true;
  state.settings.onboardingLanguageConfirmed=true;
  state.energy=30;
  const success=await window.DEEN_BOOT.prepare();
  return {success,phase:window.DEEN_BOOT.status().phase,
   error:window.DEEN_BOOT.status().error,
   locale:window.DEEN_APP_LOCALE.get(),doc_lang:document.documentElement.lang,
   config_injected:window.__DEEN_CONTENT_MANIFEST__.__deenSyntheticGermanQA,
   available:window.DEEN_CONTENT_LOCALE.available('de'),
   base:window.DEEN_CONTENT_LOCALE.inspectBank(window.DEEN_BASE_QUESTIONS,'de'),
   active:window.DEEN_CONTENT_LOCALE.inspectBank(QUESTIONS,'de'),
   arabic:document.querySelector('[lang="ar"]')?.textContent?.trim()||null};
 });
 report.boot={success:ready.success,phase:ready.phase,error:ready.error,
  locale:ready.locale,doc_lang:ready.doc_lang,
  available:ready.available,baseCount:ready.base.sourceCount,
  baseFailed:ready.base.failedIds.slice(0,18),
  activeCount:ready.active.sourceCount,activeFailed:ready.active.failedIds.slice(0,18)};
 assert.equal(ready.success,true,'Native German DEEN_BOOT.prepare was not ready');
 assert.equal(ready.phase,'ready');
 assert.equal(ready.locale,'de');
 assert.equal(ready.doc_lang,'de');
 assert.equal(ready.available,true);
 assert.equal(ready.base.sourceCount,1500);
 assert.equal(ready.active.sourceCount,1484);
 assert.deepEqual(ready.base.failedIds,[]);
 assert.deepEqual(ready.active.failedIds,[]);
 const stage=await page.evaluate(()=>{
  for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
  for(const id of ['v998Onboarding','deenPreparation','deenLanguageGate'])
   document.getElementById(id)?.remove();
  document.getElementById('energyModal')?.classList.remove('show');
  document.querySelector('.phone').inert=false;
  startStage('U01-S01');
  if(!session?.questions?.length)return {opened:false};
  const selectedIds=session.questions.map(q=>q.id);
  const initiallyLocalized=session.questions.filter(q=>q.__deenContentLocale==='de').length;
  // The stage translates lazily as each question enters the real renderer.
  const renders=[];
  for(let i=0;i<selectedIds.length;i++){
   session.index=i;
   renderQuestion();
   const question=session.questions[i];
   const source=question.__deenSourceQuestion;
   renders.push({index:i,id:question.id,type:question.activity_type,
    language:question.__deenContentLocale||null,
    localized:question.__deenContentLocale==='de',
    source_distinct:!!source&&source.question_tr!==question.question_tr,
    displayed_text:document.getElementById('questionText')?.textContent?.trim()||null,
    question:question.question_tr,answer:question.correct_answer,
    options:question.options_tr,pairs:question.pairs,items:question.items,
    order:question.correct_order});
  }
  session.index=0;renderQuestion();
  return {opened:true,selected_count:selectedIds.length,initially_localized:initiallyLocalized,
   renders,question_order_stable:selectedIds.every((id,i)=>session.questions[i]?.id===id),
   rendered:document.getElementById('questionText')?.textContent||null,
   answerLabels:[...document.querySelectorAll('#answerArea .option-label')]
    .map(el=>el.textContent?.trim())};
 });
 report.lesson=stage;
 assert.equal(stage.opened,true,'Stage did not open under German actual locale');
 assert.equal(stage.selected_count,12,'Unexpected active U01 lesson question count');
 assert.equal(stage.question_order_stable,true,'German rendering mutated lesson question order');
 assert.equal(stage.renders.length,12);
 assert(stage.renders.every(q=>q.localized),
  'The real lesson renderer failed to translate one or more questions: '+
  JSON.stringify(stage.renders.filter(q=>!q.localized).map(q=>q.id)));
 assert(stage.renders.every(q=>q.source_distinct),
  'German question content did not retain its original source');
 const normalizeSentence=s=>String(s||'')
  .replace(/_{2,}|[\u00a0]+/g,' ').replace(/\s+/g,' ').trim();
 const mismatched=stage.renders.filter(q=>
  normalizeSentence(q.displayed_text)!==normalizeSentence(q.question));
 assert.deepEqual(mismatched.map(q=>({id:q.id,rendered:q.displayed_text,expected:q.question})),[],
  'A rendered lesson question differs from verified German (blank slots normalized)');
 assert(stage.renders.filter(q=>Array.isArray(q.options)).every(q=>
  q.options.includes(q.answer)),'Rendered German answers did not contain the correct choice');
 await page.screenshot({path:output+'/true-locale-german-first-lesson.png',fullPage:true});
 const content=await page.evaluate(()=>{
  const source=window.DEEN_CONTENT_LOCALE.inspectBank(QUESTIONS,'de');
  return {locale:window.DEEN_APP_LOCALE.get(),
   source_count:source.sourceCount,failedIds:source.failedIds.slice(0,10),
   still_synthetic:window.__DEEN_CONTENT_MANIFEST__.__deenSyntheticGermanQA===true};
 });
 report.content=content;
 assert.deepEqual(content.failedIds,[]);
 // Apply the existing German UI staging adapter only inside the disposable
 // DE-language browser. Production still has no implicit DE DOM renderer.
 const chrome=await page.evaluate(async()=>{
  const files=['german-ui.staging.json','german-ui.lesson-flow.staging.json',
   'german-ui.premium-shop.staging.json','german-ui.quran-controls.staging.json',
   ...Array.from({length:8},(_,i)=>'german-ui.reference-batch-'+
    String(i+1).padStart(2,'0')+'.staging.json'),'german-ui.real-lesson.staging.json'];
  const json=async path=>{
   const res=await fetch('/assets/i18n/'+path,{cache:'no-store'});
   if(!res.ok)throw Error('German QA UI pack not served: '+path);
   return res.json();
  };
  const [packs,reference]=await Promise.all([
   Promise.all(files.map(json)),json('english-ui.draft.json')]);
  const {createGermanUIStagingRenderer}=await import(
   '/assets/i18n/german-ui.renderer.staging.mjs');
  const renderer=createGermanUIStagingRenderer({packs,
   englishReference:reference.translations});
  const root=document.querySelector('.phone');
  const arabicBefore=[...root.querySelectorAll('[lang="ar"]')]
   .map(x=>x.textContent).join('|');
  const answerBefore=document.getElementById('answerArea')?.innerHTML;
  const questionBefore=document.getElementById('questionText')?.textContent;
  const audit=renderer.render(root,{qaMode:true,locale:'de',documentRef:document});
  window.__DEEN_GERMAN_TRUE_LOCALE_UI_QA__=renderer;
  return {scanned:audit.scanned,writes:audit.writes,unresolved:audit.unresolved,
   current_locale:window.DEEN_APP_LOCALE.get(),
   arabic_unchanged:arabicBefore===
    [...root.querySelectorAll('[lang="ar"]')].map(x=>x.textContent).join('|'),
   graded_content_unchanged:answerBefore===document.getElementById('answerArea')?.innerHTML&&
    questionBefore===document.getElementById('questionText')?.textContent,
   release_enabled:window.__DEEN_CONTENT_MANIFEST__.languages.de
    .religious_expert_approved===true};
 });
 report.chrome=chrome;
 assert.equal(chrome.current_locale,'de');
 assert(chrome.scanned>100,'German app UI shell not scanned');
 assert.deepEqual(chrome.unresolved,[],'Turkish UI chrome remains in true German QA session');
 assert.equal(chrome.arabic_unchanged,true);
 assert.equal(chrome.graded_content_unchanged,true);
 assert.equal(chrome.release_enabled,false);
 await page.screenshot({path:output+'/true-locale-german-ui-staging.png',fullPage:true});

 assert.deepEqual(report.errors,[],'Browser threw errors during real German boot');
 report.status='passed';
 console.log(JSON.stringify(report,null,2));
}catch(e){report.status='failed';report.error=String(e.stack||e);
 console.error(JSON.stringify(report,null,2));process.exitCode=1;}
finally{
 writeFileSync(output+'/true-locale-report.json',JSON.stringify(report,null,2)+'\n');
 await page.close();await browser.close();
}
