/* Real Chromium DEEN French staging smoke. Uses only local loopback, real
 * assembled app and actual content.js; never activates production release flags.
 * Captures evidence of incomplete localization instead of claiming full QA. */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
import {buildFrenchPreview} from './fr-preview-pack-builder.mjs';

const fixture=buildFrenchPreview();
const origin=process.env.DEEN_QA_ORIGIN||'http://127.0.0.1:8765';
if(!/^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/.test(origin))
 throw Error('FR_BROWSER_QA_ORIGIN_NOT_LOOPBACK');
const output=process.env.DEEN_QA_OUTPUT||'qa-artifacts/french-browser';
mkdirSync(output,{recursive:true});
const report={schema_version:1,scope:'real_chromium_local_staging',
 staging_only:true,productionActivated:false,real_chrome:true,
 baselineSourceQuestions:1500,activeSourceQuestions:1484,staticReferenceKeys:1452,
 viewportRuns:[],errors:[],observedPotentialTurkishUI:[],unreviewed:[]};
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
async function visit(width,height,label){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,
  serviceWorkers:'block',locale:'fr-FR'});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e?.message||e)));
 page.on('console',message=>{
  if(message.type()==='error'&&!/favicon|Failed to load resource/.test(message.text()))
   errors.push('console:'+message.text().slice(0,180));
 });
 await page.addInitScript(()=>{
  localStorage.setItem('deen_app_language_v1','tr');
  // This is a disposable browser only. No persistent French preference is written.
 });
 await page.route('**/__fr_staging_qa__/**',async route=>{
  const pathname=new URL(route.request().url()).pathname;
  const name='.'+pathname;
  const body=fixture.content.get(name);
  if(!body)return route.fulfill({status:404,body:'QA pack not found'});
  await route.fulfill({status:200,contentType:'application/json; charset=utf-8',
   headers:{'Cache-Control':'no-store'},body});
 });
 try{
  const res=await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:60000});
  assert.equal(res?.status(),200,label+': local app entry not served');
  await page.waitForFunction(()=>!!(window.DEEN_CONTENT_LOCALE&&window.DEEN_BOOT&&
   window.DEEN_APP_LOCALE&&document.querySelector('#lesson .question-frame')&&
   typeof startStage==='function'),null,{timeout:100000});
  // Initial assembly can briefly hold 1522 source/legacy records before the
  // runtime normalizes the 1484 active pool. Observe the settled source list.
  await page.waitForFunction(()=>{
   try{return Array.isArray(QUESTIONS)&&QUESTIONS.length===1484}catch{return false;}
  },null,{timeout:50000});
  const initial=await page.evaluate(()=>{
   const app=window.DEEN_APP_LOCALE,content=window.DEEN_CONTENT_LOCALE;
   return {lang:app.get(),available:content.available('fr'),
    prodFlag:window.__DEEN_CONTENT_MANIFEST__?.languages?.fr?.question_data,
    activeCount:typeof QUESTIONS!=='undefined'?QUESTIONS.length:null,
    phone:!!document.querySelector('.phone'),lesson:!!document.querySelector('#lesson'),
    screenIds:[...document.querySelectorAll('.screen')].map(e=>e.id)};
  });
  assert.equal(initial.lang,'tr');assert.equal(initial.available,false);
  assert.equal(initial.prodFlag,'missing');assert.equal(initial.activeCount,1484);
  await page.screenshot({path:output+'/'+label+'-assembled-original.png',fullPage:true});
  const stage=await page.evaluate(async manifest=>{
   const old=window.__DEEN_CONTENT_MANIFEST__;
   if(window.DEEN_CONTENT_LOCALE.available('fr'))throw Error('QA started on unlocked locale');
   try{
    window.__DEEN_CONTENT_MANIFEST__=manifest;
    if(!await window.DEEN_CONTENT_LOCALE.preload('fr'))
     throw Error('REAL_BROWSER_FRENCH_PRELOAD_FAILED');
    const base=window.DEEN_CONTENT_LOCALE.inspectBank(window.DEEN_BASE_QUESTIONS,'fr');
    const active=window.DEEN_CONTENT_LOCALE.inspectBank(QUESTIONS,'fr');
    return {base,active};
   }finally{
    window.__DEEN_CONTENT_MANIFEST__=old;
   }
  },fixture.manifest);
  assert.equal(stage.base.sourceCount,1500);
  assert.equal(stage.active.sourceCount,1484);
  assert.deepEqual(stage.base.failedIds,[],'Base source mismatch in actual Chromium');
  assert.deepEqual(stage.active.failedIds,[],'Active source mismatch in actual Chromium');
  const gate=await page.evaluate(()=>({
   available:window.DEEN_CONTENT_LOCALE.available('fr'),
   flag:window.__DEEN_CONTENT_MANIFEST__.languages.fr.question_data,
   stored:localStorage.getItem('deen_app_language_v1')
  }));
  assert.deepEqual(gate,{available:false,flag:'missing',stored:'tr'},
   'QA browser exposed a French production release gate');
  await page.evaluate(()=>{window.__DEEN_FRENCH_QA__=true});
  await page.addScriptTag({url:origin+'/assets/i18n/fr/staging-preview.js'});
  const shell=await page.evaluate(({ui,dynamic})=>{
   const renderer=window.DEEN_FRENCH_STAGE_UI;
   if(!renderer)throw Error('Missing localhost-only FR UI staging bridge');
   const init=renderer.init({staticTranslations:ui,dynamicTranslations:dynamic});
   const mock=document.createElement('div');
   mock.id='frQaDynamicFixture';
   mock.innerHTML='<p data-streak>1 günlük seri</p><p data-verse>Ayet 1 / 4 · Son çalışma: Bugün</p>'+
    '<button aria-label="Devam Et">Geri</button><p lang="ar">بِسْمِ اللَّهِ</p>';
   document.body.append(mock);
   const beforeArabic=mock.querySelector('[lang="ar"]').textContent;
   renderer.setLocale('fr',mock);
   const examples={streak:mock.querySelector('[data-streak]').textContent,
    verse:mock.querySelector('[data-verse]').textContent,
    cta:mock.querySelector('button').textContent,
    label:mock.querySelector('button').getAttribute('aria-label'),
    arabic:mock.querySelector('[lang="ar"]').textContent};
   renderer.setLocale('tr',mock);
   const reversed={streak:mock.querySelector('[data-streak]').textContent,
    verse:mock.querySelector('[data-verse]').textContent,
    cta:mock.querySelector('button').textContent,
    label:mock.querySelector('button').getAttribute('aria-label'),
    arabic:mock.querySelector('[lang="ar"]').textContent};
   if(examples.arabic!==beforeArabic||reversed.arabic!==beforeArabic)
    throw Error('Original Quran Arabic was modified');
   mock.remove();
   const protectedQ={
    beforeText:document.querySelector('#questionText')?.textContent,
    beforeOptions:document.querySelector('#answerArea')?.innerHTML,
    beforeArabic:[...document.querySelectorAll('[lang="ar"]')].map(e=>e.textContent)};
   // Apply only to an actual assembled non-graded shell (no question or answer area).
   const phone=document.querySelector('.phone');
   const stageTargets=[...phone.querySelectorAll('.bottomnav,.screen:not(#lesson)')];
   let writes=0;
   for(const target of stageTargets)writes+=renderer.setLocale('fr',target);
   const afterArabic=[...document.querySelectorAll('[lang="ar"]')].map(e=>e.textContent);
   const afterQuestion=document.querySelector('#questionText')?.textContent;
   const afterOptions=document.querySelector('#answerArea')?.innerHTML;
   const audit=renderer.audit();
   return {init,examples,reversed,writes,audit,
    protectedQuestion:protectedQ.beforeText===afterQuestion&&
     protectedQ.beforeOptions===afterOptions,
    protectedArabic:JSON.stringify(protectedQ.beforeArabic)===JSON.stringify(afterArabic),
    sampleVisibleTexts:[...phone.querySelectorAll('.navbtn')].map(n=>n.textContent.trim())};
  },{ui:fixture.ui,dynamic:fixture.dynamic});
  assert.equal(shell.examples.streak,'1 jour de suite');
  assert.equal(shell.examples.verse,'Verset 1 / 4 · Dernière séance : aujourd’hui');
  assert.equal(shell.examples.cta,'Retour');
  assert.equal(shell.examples.label,'Continuer');
  assert.equal(shell.reversed.streak,'1 günlük seri');
  assert.equal(shell.reversed.cta,'Geri');
  assert.equal(shell.protectedQuestion,true);
  assert.equal(shell.protectedArabic,true);
  await page.screenshot({path:output+'/'+label+'-french-shell-preview.png',fullPage:true});
  const lesson=await page.evaluate(()=>{
   const root=document.querySelector('.phone');
   if(root)root.inert=false;
   document.getElementById('v998Onboarding')?.remove();
   document.getElementById('deenPreparation')?.remove();
   document.getElementById('deenLanguageGate')?.remove();
   if(typeof state!=='undefined'){
    state.energy=30;
    state.onboarded=true;
    if(state.settings)state.settings.onboardingLanguageConfirmed=true;
   }
   startStage('U01-S01');
   if(!session?.questions?.length)return {opened:false};
   const original=session.questions.slice();
   const translated=original.map(q=>window.DEEN_CONTENT_LOCALE.translateQuestion(q,'fr'));
   const missing=original.filter((q,i)=>!translated[i]).map(q=>q.id);
   if(missing.length)return {opened:true,missing};
   const target=translated.find(q=>q.options_tr?.length>=2&&q.correct_answer&&
    ['multiple_choice','scenario','error_spotting','card_choice'].includes(q.activity_type));
   if(!target)return {opened:true,noChoice:true,types:translated.map(q=>q.activity_type)};
   session.questions=[target,...translated.filter(q=>q!==target)];
   session.index=0;
   renderQuestion();
   return {opened:document.querySelector('#lesson')?.classList.contains('active'),
    id:target.id,question:target.question_tr,sourceId:target.__deenSourceQuestion?.id,
    type:target.activity_type,correct:target.correct_answer,
    options:target.options_tr,locale:window.DEEN_APP_LOCALE.get()};
  });
  assert.equal(lesson.opened,true,'Real lesson renderer not activated');
  assert.equal(lesson.locale,'tr','QA must not commit French locale to app settings');
  assert.equal(lesson.id,lesson.sourceId);
  assert(lesson.options?.includes(lesson.correct));
  await page.screenshot({path:output+'/'+label+'-french-lesson.png',fullPage:true});
  const teaching=page.locator('#lesson .v910-card-button:visible');
  if(await teaching.count())await teaching.first().click({timeout:15000});
  await page.waitForTimeout(300);
  const rendered=await page.evaluate(expected=>{
   const el=document.querySelector('#questionText');
   const raw=el?.textContent?.trim()||'';
   const adapted=window.DEEN_FRENCH_STAGE_UI.localizeQuestionPrompt(raw,expected);
   if(adapted!==null)el.textContent=adapted;
   return {raw,question:el?.textContent?.trim(),
    qaWrapperAdjusted:adapted!==null,
    labels:[...document.querySelectorAll('#answerArea .option-label')].map(e=>e.textContent.trim())};
  },lesson.question);
  console.log('FR_REAL_CHROMIUM_RENDER_DIAGNOSTIC',JSON.stringify({
   viewport:label,expected:lesson.question,raw:rendered.raw,
   adapted:rendered.question,qaWrapperAdjusted:rendered.qaWrapperAdjusted,
   expectedChoices:lesson.options,visibleChoices:rendered.labels}));
  assert(rendered.qaWrapperAdjusted||rendered.raw.includes(lesson.question),
   'Unrecognized game runtime question wrapper: '+
   JSON.stringify({expected:lesson.question,raw:rendered.raw}));
  assert(rendered.question?.includes(lesson.question),
   'Real browser QA-stage renderer does not display French source-matched question');
  assert.deepEqual([...rendered.labels].sort(),[...lesson.options].sort(),
   'Correct-answer option display is not source-matched French');
  const right=page.locator('#answerArea .option').filter({
   has:page.locator('.option-label',{hasText:lesson.correct})});
  assert.equal(await right.count(),1,'French answer card must be unambiguous');
  await right.click({timeout:15000,force:true});
  const feedback=page.locator('#feedback');
  if(!(await feedback.evaluate(e=>e.classList.contains('show')))){
   const confirm=page.locator('#answerArea .template-action:visible:not([disabled])');
   if(await confirm.count())await confirm.first().click({timeout:10000});
  }
  await page.waitForTimeout(700);
  const grade=await page.evaluate(()=>({
   shown:document.querySelector('#feedback')?.classList.contains('show')||false,
   correct:session?.correct,answer:session?.questions?.[0]?.correct_answer,
   sourceLocale:window.DEEN_APP_LOCALE.get(),
   title:document.querySelector('#feedbackTitle')?.textContent?.trim(),
   body:document.querySelector('#feedbackText')?.textContent?.trim()}));
  assert.equal(grade.shown,true,'Real engine did not show graded feedback');
  assert(grade.correct>=1,'French answer not counted as correct in real game');
  assert.equal(grade.sourceLocale,'tr');
  await page.screenshot({path:output+'/'+label+'-french-graded.png',fullPage:true});
  const geometry=await page.evaluate(()=>{
   const selectors=['.phone','.bottomnav','#lesson','#answerArea','.screen.active'];
   return selectors.map(selector=>{
    const el=document.querySelector(selector),r=el?.getBoundingClientRect();
    return {selector,exists:!!el,width:r?.width??null,height:r?.height??null,
      viewport:innerWidth,scrollWidth:el?.scrollWidth??null,
      clientWidth:el?.clientWidth??null,overflow:(el?.scrollWidth||0)>(el?.clientWidth||0)+3};
   });
  });
  return {viewport:label,width,height,assembledShell:true,sourceValidated:true,
   frenchAvailableInProduction:false,staticAndDynamicPreview:shell,
   lesson:{id:lesson.id,type:lesson.type,question:lesson.question,
    options:rendered.labels,qaWrapperAdjusted:rendered.qaWrapperAdjusted,graded:grade},
   geometry,errors};
 }finally{
  await context.close();
 }
}
try{
 report.viewportRuns.push(await visit(390,844,'mobile-390'));
 report.viewportRuns.push(await visit(1280,820,'desktop-1280'));
 report.errors=report.viewportRuns.flatMap(x=>x.errors);
 // Page errors are evaluated after collecting all available screenshot evidence.
 assert.deepEqual(report.errors.filter(s=>!s.includes('Failed to load resource')),[],
  'Uncaught browser JavaScript errors');
 report.status='passed';
 console.log(JSON.stringify({status:report.status,scope:report.scope,
  browser:'Chromium Playwright',viewports:report.viewportRuns.map(x=>x.viewport),
  sourceCounts:[1500,1484],gameplayGrade:report.viewportRuns.map(x=>x.lesson.graded.correct),
  realShellFrenchPreviewWrites:report.viewportRuns.map(x=>x.staticAndDynamicPreview.writes),
  productionGateLocked:true,realGameplayTested:true,
  fullFrenchScreensAudited:false,nativeAndReligiousReviewPending:true},null,2));
}catch(error){
 report.status='failed';report.failure=String(error?.stack||error);
 console.error(report.failure);
 process.exitCode=1;
}finally{
 writeFileSync(output+'/browser-report.json',JSON.stringify(report,null,2)+'\n');
 await browser.close();
}
