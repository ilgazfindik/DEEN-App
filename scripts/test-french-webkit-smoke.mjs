/* Playwright WebKit is an engine smoke test, not a physical iOS/Safari QA signoff.
 * Runs against the original assembled app on loopback with disposable localStorage. */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {webkit} from 'playwright';
const origin=process.env.DEEN_QA_ORIGIN||'http://127.0.0.1:8765';
assert(/^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/.test(origin));
const out='qa-artifacts/french-webkit';
mkdirSync(out,{recursive:true});
const report={scope:'playwright_webkit_desktop_engine_mobile_viewport_smoke',
 physicalIOSDeviceTest:false,realFrenchLocaleEnabled:false,
 experiments:[],failures:[]};
const browser=await webkit.launch({headless:true});
try{
 for(const v of [
  {id:'webkit-mobile-390',width:390,height:844},
  {id:'webkit-desktop-1280',width:1280,height:820}
 ]){
  const context=await browser.newContext({viewport:{width:v.width,height:v.height},
   locale:'fr-FR',serviceWorkers:'block'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e.message)));
  const result={viewport:v.id};
  try{
   await page.addInitScript(()=>localStorage.setItem('deen_app_language_v1','tr'));
   const load=await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:65000});
   assert.equal(load?.status(),200);
   await page.waitForFunction(()=>typeof state==='object'&&typeof saveState==='function'&&
    window.DEEN_BOOT&&window.DEEN_APP_LOCALE&&window.DEEN_CONTENT_LOCALE,
    null,{timeout:95000});
   const pre=await page.evaluate(async()=>{
    const ready=await DEEN_BOOT.prepare();
    if(!ready)throw Error('WebKit app bootstrap failed');
    const fr=window.__DEEN_CONTENT_MANIFEST__.languages.fr;
    if(fr.question_data!=='missing'||fr.global_qa!=='blocked'||
       fr.religious_expert_approved!==false)
     throw Error('WebKit unexpectedly has a released French locale');
    if(DEEN_APP_LOCALE.get()!=='tr'||DEEN_CONTENT_LOCALE.available('fr'))
     throw Error('WebKit wrong initial app locale');
    // In DEEN, an onboarding user may choose a provisional interface
    // language. Content availability is enforced for an onboarded learner.
    // Exercise that production contract, as the Chromium P08 suite does.
    state.onboarded=true;
    state.settings=state.settings||{};
    state.settings.language='tr';
    state.settings.onboardingLanguageConfirmed=true;
    state.xp=241;state.completed=['U01-S01'];
    saveState();
    const blocked=await DEEN_BOOT.changeLanguage('fr');
    return {blocked,locale:DEEN_APP_LOCALE.get(),
     storedLocale:localStorage.getItem('deen_app_language_v1'),
     xp:state.xp,completed:[...state.completed],frenchAvailable:DEEN_CONTENT_LOCALE.available('fr')};
   });
   assert.equal(pre.blocked,false);
   assert.equal(pre.locale,'tr');
   assert.equal(pre.storedLocale,'tr');
   assert.equal(pre.frenchAvailable,false);
   assert.equal(pre.xp,241);
   assert.deepEqual(pre.completed,['U01-S01']);
   await page.reload({waitUntil:'domcontentloaded',timeout:65000});
   await page.waitForFunction(()=>typeof state==='object'&&window.DEEN_BOOT&&
    window.DEEN_APP_LOCALE?.get?.()==='tr',null,{timeout:95000});
   const after=await page.evaluate(()=>({
    xp:state.xp,completed:[...state.completed],locale:DEEN_APP_LOCALE.get(),
    persistedXP:JSON.parse(localStorage.getItem('deen_v4_1_state'))?.xp
   }));
   assert.equal(after.xp,241);
   assert.equal(after.persistedXP,241);
   assert.deepEqual(after.completed,['U01-S01']);
   assert.equal(after.locale,'tr');
   assert.deepEqual(errors,[],'Unexpected page errors in WebKit');
   Object.assign(result,{status:'passed',productionFrenchBlocked:true,
    persistencePreserved:true,engine:'webkit',physicalIOS:false,errors:[]});
   console.log('FR_WEBKIT_SMOKE '+JSON.stringify(result));
  }catch(e){
   Object.assign(result,{status:'failed',error:String(e?.stack||e),errors});
   console.error('FR_WEBKIT_FAILURE '+JSON.stringify(result));
  }finally{
   report.experiments.push(result);await context.close();
  }
 }
 report.failures=report.experiments.filter(x=>x.status!=='passed');
 report.status=report.failures.length?'failed':'passed';
 console.log('FR_WEBKIT_SUMMARY '+JSON.stringify({status:report.status,
  passed:report.experiments.length-report.failures.length,
  viewports:report.experiments.length,productionFrenchUnlocked:false,
  physicalIOSCertified:false}));
 if(report.failures.length)process.exitCode=1;
}finally{
 writeFileSync(out+'/web-kit-smoke.json',JSON.stringify(report,null,2)+'\n');
 await browser.close();
}
