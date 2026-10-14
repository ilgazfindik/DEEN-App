/* Isolated French U01 fill/matching gameplay in REAL Chromium. Each variant
 * runs in a fresh browser page with exactly one lesson render. No forced
 * hot-swapping of question types, grader mocks, or production locale changes. */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
import {buildFrenchPreview} from './fr-preview-pack-builder.mjs';
const fixtures=buildFrenchPreview();
const origin=process.env.DEEN_QA_ORIGIN||'http://127.0.0.1:8765';
assert(/^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/.test(origin));
const out='qa-artifacts/french-gameplay';
mkdirSync(out,{recursive:true});
const report={scope:'isolated-real-chromium-french-gameplay',productionReleased:false,
 verifiedByReligiousExpert:false,scenarios:[],failures:[]};
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const scenarios=[
 {name:'fill',id:'DEEN-U01-S01-P04'},
 {name:'matching',id:'DEEN-U01-S01-P02'}
];
async function scenario(cfg,device){
 const context=await browser.newContext({viewport:device.size,serviceWorkers:'block',locale:'fr-FR'});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push('pageerror:'+e.message));
 page.on('console',m=>{
  if(m.type()==='error'&&!/favicon|Failed to load resource/.test(m.text()))
   errors.push('console:'+m.text().slice(0,260));
 });
 await page.addInitScript(()=>{
  localStorage.setItem('deen_app_language_v1','tr');
 });
 await page.route('**/__fr_staging_qa__/**',route=>{
  const p='.'+new URL(route.request().url()).pathname;
  const body=fixtures.content.get(p);
  return route.fulfill({status:body?200:404,body:body??'missing staging pack',
   contentType:'application/json',headers:{'Cache-Control':'no-store'}});
 });
 const result={device:device.name,type:cfg.name,id:cfg.id};
 try{
  const response=await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:65000});
  assert.equal(response?.status(),200);
  await page.waitForFunction(()=>window.DEEN_CONTENT_LOCALE&&window.DEEN_BOOT&&
   typeof renderQuestion==='function'&&typeof STAGES!=='undefined'&&
   typeof QUESTIONS!=='undefined'&&QUESTIONS.length===1484,null,{timeout:100000});
  const contextReady=await page.evaluate(async({manifest,id})=>{
   const gate=window.DEEN_CONTENT_LOCALE;
   if(gate.available('fr')||window.__DEEN_CONTENT_MANIFEST__?.languages?.fr?.question_data!=='missing')
    throw Error('FRENCH_PRODUCTION_GATE_UNEXPECTEDLY_OPEN');
   const old=window.__DEEN_CONTENT_MANIFEST__;
   try{window.__DEEN_CONTENT_MANIFEST__=manifest;
    if(!await gate.preload('fr'))throw Error('QA_SOURCE_HASH_REJECTED');
   }finally{window.__DEEN_CONTENT_MANIFEST__=old;}
   const ok=await window.DEEN_BOOT.prepare();
   if(!ok)throw Error('DEEN_BOOT_PREPARE_FAILED '+JSON.stringify(window.DEEN_BOOT.status()));
   document.getElementById('v998Onboarding')?.remove();
   document.getElementById('deenLanguageGate')?.remove();
   document.getElementById('deenPreparation')?.remove();
   const phone=document.querySelector('.phone');if(phone)phone.inert=false;
   const q=QUESTIONS.find(x=>x.id===id);
   if(!q)throw Error('U01_SOURCE_QUESTION_NOT_ACTIVE '+id);
   const translated=gate.translateQuestion(q,'fr');
   if(!translated||translated.__deenSourceQuestion!==q||translated.id!==id)
    throw Error('INCORRECT_FR_SOURCE_VARIANT '+id);
   if(window.DEEN_APP_LOCALE.get()!=='tr'||gate.available('fr'))
    throw Error('QA_MODIFIED_PRODUCTION_LANGUAGE');
   const stage=STAGES.find(x=>x.id===q.stage_id);
   if(!stage)throw Error('SOURCE_STAGE_MISSING');
   // Mirrors DEEN's existing isolated-matching browser regression harness,
   // but all real option/match clicks still go through the original game engine.
   session={stage,questions:[translated],index:0,correct:0,combo:0,bestCombo:0,
    startedAt:Date.now(),v5responses:[]};
   document.querySelector('#lesson').classList.add('active');
   document.querySelector('#quizView').style.display='flex';
   resetResultView(false);
   renderQuestion();
   return {sourceId:q.id,translatedId:translated.id,activityType:translated.activity_type,
    correct:translated.correct_answer,pairs:translated.pairs,
    sourceExact:translated.__deenSourceQuestion===q,locale:window.DEEN_APP_LOCALE.get(),
    productionFlag:window.__DEEN_CONTENT_MANIFEST__.languages.fr.question_data};
  },{manifest:fixtures.manifest,id:cfg.id});
  Object.assign(result,{sourceExact:contextReady.sourceExact,
   activityType:contextReady.activityType,productionFlag:contextReady.productionFlag});
  assert.equal(contextReady.locale,'tr');
  assert.equal(contextReady.productionFlag,'missing');
  assert.equal(contextReady.activityType,cfg.name==='fill'?'fill_blank':'matching');
  const button=page.locator('#lesson .v910-overlay .v910-card-button:visible');
  if(await button.count())await button.first().click({timeout:12000});
  await page.waitForTimeout(250);
  const before=await page.evaluate(()=>({
   question:document.querySelector('#questionText')?.textContent.trim(),
   answerHTML:document.querySelector('#answerArea')?.innerHTML.slice(0,4000),
   freeze:window.DEEN_FILL_BLANK_MINIGAME?.check?.(),
   monitor:window.DEEN_FILL_FREEZE?.snapshot?.(),
   sessionQuestion:session?.questions?.[session?.index]?.question_tr,
   blankCount:(session?.questions?.[session?.index]?.question_tr?.match(/_{3,}/g)||[]).length,
   slotExists:!!document.querySelector('#lesson .v1040-fill-slot'),
   correct:session?.correct
  }));
  result.preClick={question:before.question,correct:before.correct,
   freeze:before.freeze,monitor:before.monitor,
   sessionQuestion:before.sessionQuestion,blankCount:before.blankCount,
   slotExists:before.slotExists,answerHTMLPreview:before.answerHTML.slice(0,2100)};
  await page.screenshot({path:out+'/'+device.name+'-'+cfg.name+'-initial.png',fullPage:true});
  if(cfg.name==='fill'){
   const correct=String(contextReady.correct);
   const chips=page.locator('#answerArea .v855-fill-chip');
   result.chipCount=await chips.count();
   // Actual click, NOT evaluation of completeQuestion / direct correct override.
   const chip=page.locator('#answerArea .v855-fill-chip').filter({hasText:correct});
   if(await chip.count()===1){
    await chip.click({timeout:15000});
   }else{
    // The current core09-v1041 renderer uses .v1040-fill-chip plus a distinct
    // submit button: selection is not grading.
    const alt=page.locator('#answerArea button[data-value="'+correct.replaceAll('"','\\"')+'"]');
    assert.equal(await alt.count(),1,'No single correct French fill chip');
    await alt.click({timeout:15000});
   }
   const check=page.locator('#answerArea .template-action:visible');
   await check.waitFor({state:'visible',timeout:10000});
   await page.waitForFunction(()=>!!document.querySelector('#answerArea .template-action:not(:disabled)'),
    null,{timeout:10000});
   result.selectedState=await page.evaluate(()=>({
    selected:[...document.querySelectorAll('#answerArea .fill-choice.selected')].map(e=>e.dataset.value),
    submitText:document.querySelector('#answerArea .template-action')?.textContent?.trim(),
    slotText:document.querySelector('#lesson .v1040-fill-slot')?.textContent?.trim(),
    monitor:window.DEEN_FILL_FREEZE?.snapshot?.()
   }));
   await check.click({timeout:15000});
  }else{
   const count=contextReady.pairs.length;
   assert(count>=2);
   for(let i=0;i<count;i++){
    await page.locator('#answerArea [data-side="left"][data-pair="'+i+'"]').click({timeout:15000});
    await page.locator('#answerArea [data-side="right"][data-pair="'+i+'"]').click({timeout:15000});
    await page.waitForTimeout(55);
   }
   result.matchPairs=count;
  }
  // Read grade through real session state: fill can auto-advance quickly.
  await page.waitForFunction(()=>session&&session.correct>=1,null,{timeout:9000});
  result.correct=await page.evaluate(()=>session.correct);
  result.feedback=await page.evaluate(()=>({
    visible:document.querySelector('#feedback')?.classList.contains('show')||false,
    title:document.querySelector('#feedbackTitle')?.textContent.trim(),
    stage:session?.stage?.id,
    currentIndex:session?.index,
    fill:window.DEEN_FILL_BLANK_MINIGAME?.check?.(),
    monitor:window.DEEN_FILL_FREEZE?.snapshot?.(),
    locale:window.DEEN_APP_LOCALE.get(),
    productionFlag:window.__DEEN_CONTENT_MANIFEST__.languages.fr.question_data
  }));
  assert(result.correct>=1,'Real gameplay did not grade French '+cfg.name+' correct');
  assert.equal(result.feedback.locale,'tr');
  assert.equal(result.feedback.productionFlag,'missing');
  await page.screenshot({path:out+'/'+device.name+'-'+cfg.name+'-graded.png',fullPage:true});
  result.errors=errors;
  assert.deepEqual(errors,[],'Unexpected console/page errors during normal '+cfg.name+' gameplay');
  result.status='passed';
  console.log('FR_ISOLATED_GAMEPLAY',JSON.stringify({device:result.device,type:result.type,
   id:result.id,status:result.status,correct:result.correct,
   feedback:result.feedback,errors:result.errors}));
 }catch(e){
  result.status='failed';result.failure=String(e?.stack||e);
  result.errors=errors;
  console.error('FR_ISOLATED_GAMEPLAY_FAILURE',JSON.stringify({device:device.name,type:cfg.name,
   failure:result.failure,errors,preClick:result.preClick}));
 }finally{
  report.scenarios.push(result);
  await context.close();
 }
}
try{
 for(const device of [{name:'mobile',size:{width:390,height:844}},
                     {name:'desktop',size:{width:1280,height:820}}])
  for(const cfg of scenarios)await scenario(cfg,device);
 report.failures=report.scenarios.filter(x=>x.status!=='passed').map(x=>({
  device:x.device,type:x.type,failure:x.failure,errors:x.errors}));
 report.status=report.failures.length?'failed':'passed';
 if(report.failures.length)process.exitCode=1;
 console.log('FR_ISOLATED_GAMEPLAY_SUMMARY',JSON.stringify({
  status:report.status,scenarios:report.scenarios.length,passed:report.scenarios.length-report.failures.length,
  failures:report.failures,productionUnlocked:false}));
}finally{
 writeFileSync(out+'/isolated-gameplay-report.json',JSON.stringify(report,null,2)+'\n');
 await browser.close();
}
