/*
 * Real Chromium QA for the German staging renderer and assembled DEEN shell.
 * Runs against localhost in GitHub Actions, never modifies the live app.
 * Not a religious/native review or full lesson/Quran end-to-end approval.
 */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';

const ORIGIN=process.env.DEEN_QA_ORIGIN||'http://127.0.0.1:8765';
const OUTPUT=process.env.DEEN_QA_OUTPUT||'qa-artifacts/german-browser';
mkdirSync(OUTPUT,{recursive:true});
const report={schema_version:1,run:'German browser staging',scope:'preview-and-assembled-shell',
 staging_only:true,main_or_deploy_changed:false,viewport_results:[],real_shell:null};
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
async function preview(width,height,name){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror',e=>errors.push(String(e.message||e)));
 try{
  const response=await page.goto(ORIGIN+'/qa/german-ui-staging-preview.html',
    {waitUntil:'domcontentloaded',timeout:60000});
  assert.equal(response?.status(),200,'QA preview must be served by local HTTP');
  await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.includes('Matched reference keys:'),
    {timeout:45000});
  const initial=await page.evaluate(()=>{
   const wrapper=document.querySelector('#stagingFixture');
   return {
    status:document.querySelector('#status')?.textContent,
    onboarding:wrapper.querySelector('section:nth-child(1) .mock')?.innerText,
    quran:wrapper.querySelector('section:nth-child(4) .mock')?.innerText,
    arabic:wrapper.querySelector('[lang="ar"]')?.textContent,
    day:wrapper.querySelector('#lessonStreakMini')?.parentElement?.textContent,
    missing:document.querySelector('#unresolved')?.textContent,
    label:wrapper.querySelector('section:nth-child(1) input')?.getAttribute('aria-label'),
    lessonCTA:wrapper.querySelector('section:nth-child(3) button')?.textContent
   };
  });
  assert(initial.status?.includes('Matched reference keys: 1087 / 1087'));
  assert(initial.status?.includes('Catalog entries: 1452'));
  assert(initial.onboarding?.includes('Willkommen bei DEEN'), 'German welcome not rendered');
  assert(initial.quran?.includes('Al-Fātiha'), 'Sura heading not localized');
  assert(initial.arabic?.includes('بِسْمِ'), 'Original Quran Arabic must remain');
  assert(/7\s+Tage/.test(initial.day||''),'Plural streak label must read 7 Tage');
  assert(initial.missing?.includes('Bilinmeyen aşama metni'), 'Unknown Turkish text must be reported');
  assert(initial.label?.includes('Wie dürfen wir dich nennen?') || initial.label?.includes('Wie sollen wir dich nennen?'),
   'Accessible onboarding label not localized');
  assert.equal(initial.lessonCTA,'Prüfen');
  await page.screenshot({path:OUTPUT+'/'+name+'-initial.png',fullPage:true});
  await page.locator('#rerender').click();
  await page.waitForFunction(()=>/1\s+Tag\b/.test(document.querySelector('#lessonStreakMini')?.parentElement?.textContent||''));
  const rerender=await page.evaluate(()=>({
   day:document.querySelector('#lessonStreakMini')?.parentElement?.textContent,
   status:document.querySelector('#status')?.textContent
  }));
  assert(/1\s+Tag\b/.test(rerender.day));
  await page.locator('#reset').click();
  await page.waitForFunction(()=>/7\s+Tage/.test(document.querySelector('#lessonStreakMini')?.parentElement?.textContent||''));
  await page.screenshot({path:OUTPUT+'/'+name+'-reset.png',fullPage:true});
  assert.deepEqual(errors,[], 'Browser JS exception during German preview');
  return {viewport:name,width,height,preview_http:200,baseline:'1087/1087',dictionary:1452,
    german_welcome:true,quran_arabic_original:true,
    qa_unresolved_example:'Bilinmeyen aşama metni',streak_plural_and_singular:true,
    aria_localized:true,reset_passed:true,js_exceptions:0};
 }finally{await page.close()}
}
async function realShell(){
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror',e=>errors.push(String(e.message||e)));
 await page.addInitScript(()=>{
  try{localStorage.setItem('deen_app_language_v1','tr')}catch(_){}
 });
 try{
  const response=await page.goto(ORIGIN+'/',{waitUntil:'domcontentloaded',timeout:60000});
  assert.equal(response?.status(),200);
  await page.waitForFunction(()=>Boolean(window.DEEN_CONTENT_LOCALE && document.getElementById('lesson') &&
    document.getElementById('resultView') && window.DEEN_APP_LOCALE),null,{timeout:100000});
  const result=await page.evaluate(async()=>{
   const lang=window.DEEN_APP_LOCALE.get();
   const before={
    question:document.querySelector('#questionText')?.textContent,
    answers:document.querySelector('#answerArea')?.innerHTML,
    explanation:document.querySelector('#feedbackText')?.textContent
   };
   const sourceTitle=document.querySelector('#resultTitle')?.textContent?.trim();
   const files=[
    'german-ui.staging.json','german-ui.lesson-flow.staging.json','german-ui.premium-shop.staging.json',
    'german-ui.quran-controls.staging.json',
    ...Array.from({length:8},(_,i)=>'german-ui.reference-batch-'+String(i+1).padStart(2,'0')+'.staging.json'),
    'german-ui.real-lesson.staging.json'
   ];
   const load=async path=>{
    const resp=await fetch('/assets/i18n/'+path,{cache:'no-store'});
    if(!resp.ok)throw Error('Pack fetch failed: '+path+': '+resp.status);
    return resp.json();
   };
   const [packs,english]=await Promise.all([
    Promise.all(files.map(load)),
    fetch('/assets/i18n/english-ui.draft.json',{cache:'no-store'}).then(r=>r.json())
   ]);
   const {createGermanUIStagingRenderer}=await import('/assets/i18n/german-ui.renderer.staging.mjs');
   const renderer=createGermanUIStagingRenderer({packs,englishReference:english.translations});
   const audit=renderer.render(document.querySelector('#lesson'),{
    qaMode:true,locale:'de',documentRef:document
   });
   const after={
    question:document.querySelector('#questionText')?.textContent,
    answers:document.querySelector('#answerArea')?.innerHTML,
    explanation:document.querySelector('#feedbackText')?.textContent,
    title:document.querySelector('#resultTitle')?.textContent?.trim(),
    cta:document.querySelector('#resultContinueBtn')?.textContent?.trim()
   };
   const fullRoot=document.querySelector('.phone');
   if(!fullRoot)throw Error('Actual DEEN application phone root is missing');
   // Inventory all assembled tabs in this disposable QA browser, including hidden DOM.
   // This is deliberately *not* an assertion that all app workflows are translated.
   const allChrome=renderer.render(fullRoot,{qaMode:true,locale:'de',documentRef:document});
   const byScreen=[...document.querySelectorAll('.screen')].map(screen=>{
    const result=renderer.render(screen,{qaMode:true,locale:'de',documentRef:document});
    return {screen_id:screen.id||'(unnamed)',scanned:result.scanned,
     unresolved_count:result.unresolved.length,examples:result.unresolved.slice(0,25)};
   }).filter(record=>record.scanned>0);
   const gradedAfterWhole={
    question:document.querySelector('#questionText')?.textContent,
    answers:document.querySelector('#answerArea')?.innerHTML,
    explanation:document.querySelector('#feedbackText')?.textContent
   };
   const fullProtected=before.question===gradedAfterWhole.question &&
    before.answers===gradedAfterWhole.answers &&
    before.explanation===gradedAfterWhole.explanation;
   return {locale:lang,germanAvailable:window.DEEN_CONTENT_LOCALE.available('de'),
    full_shell_qa:{scanned:allChrome.scanned,writes:allChrome.writes,
     unresolved_count:allChrome.unresolved.length,unresolved:allChrome.unresolved.slice(0,100),
     screens:byScreen,graded_content_unchanged:fullProtected},
    startup:document.documentElement.dataset.deenStartup||'unknown',
    assembledLesson:Boolean(document.querySelector('#lesson .question-frame')),
    originalResultTitle:sourceTitle,unchangedGradedContent:
     before.question===after.question&&before.answers===after.answers&&
     before.explanation===after.explanation,
    after,audit,entries:renderer.stats().entries};
  });
  assert.equal(result.locale,'tr','This is an isolated QA run, not a German activation');
  assert.equal(result.germanAvailable,false,'German production must stay blocked');
  assert.equal(result.assembledLesson,true,'Real DEEN lesson DOM did not assemble');
  assert.equal(result.unchangedGradedContent,true,
   'Staging UI renderer must never mutate source-dependent question/answer content');
  assert.equal(result.entries,1452);
  assert(result.full_shell_qa.scanned>result.audit.scanned,
   'Whole-shell audit must scan more elements than lesson-only smoke');
  assert(result.full_shell_qa.graded_content_unchanged,
   'Whole-shell QA must not rewrite question/answer/explanation content');
  assert(Array.isArray(result.full_shell_qa.screens),
   'Named screen-level untranslated text inventories were not generated');
  assert.deepEqual(result.audit.unresolved,[], 'Real lesson shell has uncovered Turkish chrome labels');
  assert.equal(result.after.title,'Lektion abgeschlossen','Real result title not localized by QA');
  assert.equal(result.after.cta,'LERNREISE FORTSETZEN','Real result CTA not localized by QA');
  assert(result.audit.scanned>10,'Real lesson shell not scanned');
  assert(!errors.length,'Actual app threw browser errors: '+errors.slice(0,3).join(' | '));
  await page.screenshot({path:OUTPUT+'/actual-app-shell.png',fullPage:true});
  return {assembled_app_started:true,actual_locale:'tr',german_live_available:false,
    source_sensitive_content_unchanged:true,real_result_title:result.after.title,
    real_result_cta:result.after.cta,source_labels_scanned:result.audit.scanned,
    unresolved_real_shell:result.audit.unresolved,
    full_app_qa_inventory:result.full_shell_qa,
    protected_quran_or_answer_inputs:true,js_exceptions:errors.length};
 }finally{await page.close()}
}
try{
 report.viewport_results.push(await preview(390,844,'mobile'));
 report.viewport_results.push(await preview(1280,820,'desktop'));
 report.real_shell=await realShell();
 report.status='passed';
 console.log(JSON.stringify(report,null,2));
}catch(e){
 report.status='failed';report.error=String(e?.stack||e);
 console.error(JSON.stringify(report,null,2));
 process.exitCode=1;
}finally{
 writeFileSync(OUTPUT+'/report.json',JSON.stringify(report,null,2)+'\n');
 await browser.close();
}
