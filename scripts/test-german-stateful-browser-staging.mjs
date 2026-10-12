/*
 * Browser-driven German locale gating and post-navigation QA.
 * Staging only: starts in Turkish, never enables German lessons or writes to main.
 * Renderer is applied explicitly in a disposable browser, not production boot.
 */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';

const origin=process.env.DEEN_QA_ORIGIN||'http://127.0.0.1:8765';
const output=process.env.DEEN_QA_OUTPUT||'qa-artifacts/german-browser';
mkdirSync(output,{recursive:true});
const report={schema_version:1,scope:'QA-only language gate and navigated tabs',
 staging_only:true,release_enabled:false,gate:null,tabs:[],errors:[]};
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
async function verifyGermanGate(){
 const page=await browser.newPage({viewport:{width:390,height:844}});
 page.on('pageerror',error=>report.errors.push('gate: '+String(error)));
 try{
  await page.goto(origin+'/?previewLanguage=1',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('#deenLanguageGate [data-locale="de"]',{timeout:90000});
  await page.locator('#deenLanguageGate [data-locale="de"]').click();
  assert.equal(await page.locator('#deenLanguageGate').getAttribute('lang'),'de');
  assert.equal(await page.locator('#deenLanguageGate .deen-language-continue').textContent(),'Weiter');
  await page.locator('#deenLanguageGate .deen-language-continue').click();
  await page.waitForFunction(()=>window.DEEN_APP_LOCALE?.get()==='de',{timeout:25000});
  await page.waitForFunction(()=>Boolean(window.DEEN_CONTENT_LOCALE?.available&&window.DEEN_BOOT?.prepare),null,{timeout:100000});
  const blocked=await page.evaluate(async()=>{
   const available=window.DEEN_CONTENT_LOCALE.available('de');
   const result=await window.DEEN_BOOT.prepare();
   const dialog=document.querySelector('#deenPreparation');
   return {available,prepare_result:result,phase:window.DEEN_BOOT.status().phase,
    locale:window.DEEN_APP_LOCALE.get(),startup:document.documentElement.dataset.deenStartup,
    heading:dialog?.querySelector('h1')?.textContent||null,
    detail:dialog?.querySelector('p')?.textContent||null,
    arabic_original:document.querySelector('[lang="ar"]')?.textContent||null};
  });
  assert.equal(blocked.available,false);
  assert.equal(blocked.prepare_result,false);
  assert.equal(blocked.phase,'blocked');
  assert.equal(blocked.locale,'de');
  assert.equal(blocked.startup,'blocked');
  assert.equal(blocked.heading,'Lektionen in dieser Sprache sind noch nicht verfügbar');
  assert(!/Bu dilde|henüz hazır|Öğrenmeye başlamak/.test(blocked.detail||''),
   'German unavailable-language explanation leaked Turkish');
  await page.screenshot({path:output+'/stateful-german-blocked.png',fullPage:true});
  return blocked;
 }finally{await page.close()}
}
async function auditNavTabs(){
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 page.on('pageerror',error=>report.errors.push('tabs: '+String(error)));
 await page.addInitScript(()=>{
  try{localStorage.setItem('deen_app_language_v1','tr')}catch(_){}
 });
 try{
  await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>Boolean(window.DEEN_APP_LOCALE&&window.DEEN_CONTENT_LOCALE
   &&document.querySelector('.bottomnav [data-screen="learnScreen"]')
   &&document.querySelector('#lesson .question-frame')),null,{timeout:100000});
  // A new-profile onboarding layer blocks taps. Remove it ONLY in this
  // disposable QA page to exercise the already assembled application's nav.
  // This deliberately does not test production onboarding completion.
  await page.evaluate(()=>{
   for(const id of ['v998Onboarding','deenPreparation','deenLanguageGate'])
    document.getElementById(id)?.remove();
   const phone=document.querySelector('.phone');phone.inert=false;
  });
  const init=await page.evaluate(async()=>{
   const files=['german-ui.staging.json','german-ui.lesson-flow.staging.json',
    'german-ui.premium-shop.staging.json','german-ui.quran-controls.staging.json',
    ...Array.from({length:8},(_,i)=>'german-ui.reference-batch-'+String(i+1).padStart(2,'0')+'.staging.json'),
    'german-ui.real-lesson.staging.json'];
   const read=async path=>{
    const response=await fetch('/assets/i18n/'+path,{cache:'no-store'});
    if(!response.ok)throw Error('German staging QA pack fetch: '+path+': '+response.status);
    return response.json();
   };
   const [packs,english]=await Promise.all([
    Promise.all(files.map(read)),read('english-ui.draft.json')]);
   const mod=await import('/assets/i18n/german-ui.renderer.staging.mjs');
   window.__DEEN_GERMAN_NAV_QA__=mod.createGermanUIStagingRenderer({
    packs,englishReference:english.translations});
   return {locale:window.DEEN_APP_LOCALE.get(),
    german_available:window.DEEN_CONTENT_LOCALE.available('de'),
    navs:[...document.querySelectorAll('.bottomnav [data-screen]')].map(x=>x.dataset.screen)};
  });
  assert.equal(init.locale,'tr');
  assert.equal(init.german_available,false);
  assert.deepEqual(init.navs.slice(0,4),['learnScreen','reviewScreen','leagueScreen','profileScreen']);
  for(const id of init.navs.slice(0,4)){
   const button=page.locator('.bottomnav [data-screen="'+id+'"]').first();
   await button.click({timeout:20000,force:true});
   await page.waitForTimeout(500);
   const state=await page.evaluate(target=>{
    const root=document.querySelector('.phone');
    const targetScreen=document.getElementById(target);
    const renderer=window.__DEEN_GERMAN_NAV_QA__;
    const originalArabic=[...document.querySelectorAll('[lang="ar"]')]
     .map(el=>el.textContent).join('|');
    const before={
     question:document.querySelector('#questionText')?.textContent,
     choices:document.querySelector('#answerArea')?.innerHTML,
     feedback:document.querySelector('#feedbackText')?.textContent};
    const audit=renderer.render(root,{qaMode:true,locale:'de',documentRef:document});
    const after={
     question:document.querySelector('#questionText')?.textContent,
     choices:document.querySelector('#answerArea')?.innerHTML,
     feedback:document.querySelector('#feedbackText')?.textContent};
    const arabicAfter=[...document.querySelectorAll('[lang="ar"]')]
     .map(el=>el.textContent).join('|');
    return {target,screen_active:targetScreen?.classList.contains('active')||false,
     screen_exists:!!targetScreen,selected_button:
      document.querySelector('.bottomnav .navbtn.active')?.dataset.screen||null,
     language:window.DEEN_APP_LOCALE.get(),german_available:window.DEEN_CONTENT_LOCALE.available('de'),
     scanned:audit.scanned,writes:audit.writes,unresolved:audit.unresolved,
     graded_content_unchanged:JSON.stringify(before)===JSON.stringify(after),
     arabic_unchanged:originalArabic===arabicAfter,
     dynamic_elements:targetScreen?.querySelectorAll('[data-deen-quran],button,[role="button"]').length||0,
     visible_heading:targetScreen?.querySelector('h1,h2,.page-title')?.textContent?.trim()||null};
   },id);
   report.tabs.push(state);
   assert(state.screen_exists,'Target screen is missing: '+id);
   assert.equal(state.language,'tr','QA navigation must not activate German runtime');
   assert.equal(state.german_available,false);
   assert.equal(state.graded_content_unchanged,true);
   assert.equal(state.arabic_unchanged,true);
   await page.screenshot({path:output+'/stateful-tab-'+id+'.png',fullPage:true});
  }
  return init;
 }finally{await page.close()}
}
try{
 report.gate=await verifyGermanGate();
 report.init=await auditNavTabs();
 assert.equal(report.tabs.length,4);
 assert.deepEqual(report.errors,[],'Browser errors during German staging navigation');
 report.status='passed';
 console.log(JSON.stringify(report,null,2));
}catch(error){
 report.status='failed';report.error=String(error?.stack||error);
 console.error(JSON.stringify(report,null,2));
 process.exitCode=1;
}finally{
 writeFileSync(output+'/stateful-report.json',JSON.stringify(report,null,2)+'\n');
 await browser.close();
}
