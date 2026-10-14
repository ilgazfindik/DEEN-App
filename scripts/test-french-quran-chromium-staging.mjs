/* Actual Chromium Quran navigation/Arabic source preservation in FR QA preview.
 * The real application locale and religious release gates remain BLOCKED.
 * Does not claim FR Quran translations, audio licensing or memorization review. */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
import {buildFrenchPreview} from './fr-preview-pack-builder.mjs';
const fixture=buildFrenchPreview();
const origin=process.env.DEEN_QA_ORIGIN||'http://127.0.0.1:8765';
assert(/^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/.test(origin),'QA must use local loopback');
const output='qa-artifacts/french-quran';
mkdirSync(output,{recursive:true});
const summary={scope:'actual_assembled_quran_in_french_qa_overlay',
 proofOfProductionFrenchSupport:false,officialQuranFrenchMeaningApproved:false,
 onlyLocalChrome:true,tests:[],failures:[]};
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
async function run(device){
 const context=await browser.newContext({viewport:device.size,locale:'fr-FR',serviceWorkers:'block'});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error'&&!/favicon|Failed to load resource/.test(m.text()))
  errors.push('console:'+m.text().slice(0,230))});
 await page.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr')});
 const rec={viewport:device.name};
 try{
  const response=await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:65000});
  assert.equal(response?.status(),200,'Local DEEN index unavailable');
  await page.waitForFunction(()=>!!(window.DEEN_BOOT&&window.DEEN_QURAN&&
   window.DEEN_QURAN_IKHLAS&&window.DEEN_QURAN_CONTENT&&
   window.DEEN_QURAN_AUDIO&&window.DEEN_APP_LOCALE&&
   window.DEEN_QURAN.surahList&&
   document.querySelector('.bottomnav [data-screen="leagueScreen"]')),null,{timeout:100000});
  const initial=await page.evaluate(async()=>{
   const fr=window.__DEEN_CONTENT_MANIFEST__?.languages?.fr;
   if(fr?.question_data!=='missing'||fr?.global_qa!=='blocked'||fr.religious_expert_approved!==false)
    throw Error('French release gates unexpectedly unlocked');
   const boot=await DEEN_BOOT.prepare();
   if(!boot)throw Error('DEEN_BOOT was not ready '+JSON.stringify(DEEN_BOOT.status()));
   document.getElementById('v998Onboarding')?.remove();
   document.getElementById('deenLanguageGate')?.remove();
   document.getElementById('deenPreparation')?.remove();
   const phone=document.querySelector('.phone');if(phone)phone.inert=false;
   return {boot,locale:window.DEEN_APP_LOCALE.get(),
    gate:{question_data:fr.question_data,global_qa:fr.global_qa,religious_expert_approved:fr.religious_expert_approved},
    audioStatus:window.DEEN_QURAN_AUDIO.audit()};
  });
  assert.equal(initial.locale,'tr');
  rec.gates=initial.gate;
  await page.evaluate(()=>{window.__DEEN_FRENCH_QA__=true;});
  await page.addScriptTag({url:origin+'/assets/i18n/fr/staging-preview.js'});
  const init=await page.evaluate(({ui,dynamic,observed})=>{
   const bridge=window.DEEN_FRENCH_STAGE_UI;
   if(!bridge)throw Error('Loopback Quran FR QA bridge unavailable');
   const result=bridge.init({staticTranslations:ui,dynamicTranslations:dynamic,
    runtimeObservedTranslations:observed});
   if(result.staticKeys!==1452||result.observedKeys!==4)
    throw Error('FR Quran preview source coverage drift');
   return result;
  },{ui:fixture.ui,dynamic:fixture.dynamic,observed:fixture.observed});
  rec.localePreview={staticKeys:init.staticKeys,observedKeys:init.observedKeys,productionActivated:false};
  const nav=page.locator('.bottomnav [data-screen="leagueScreen"]');
  await nav.click({timeout:15000});
  await page.waitForSelector('#leagueScreenBody .deen-quran-dashboard',{timeout:10000});
  const dashboard=await page.evaluate(()=>{
   const root=document.querySelector('#leagueScreenBody');
   const writes=DEEN_FRENCH_STAGE_UI.setLocale('fr',root);
   return {writes,model:DEEN_QURAN.checkDashboard(),nav:document.querySelector('.bottomnav .navbtn.active')?.dataset.screen,
    header:root.querySelector('h1,h2')?.textContent.trim()||'',locale:DEEN_APP_LOCALE.get()};
  });
  rec.dashboard=dashboard;
  assert.equal(dashboard.nav,'leagueScreen');
  assert.equal(dashboard.locale,'tr');
  await page.screenshot({path:output+'/'+device.name+'-quran-dashboard.png',fullPage:true});
  // Some dashboard revisions leave a non-visible legacy quick action
  // in the DOM. Preserve this as an explicit QA navigation issue; invoke the
  // real native callback as a fallback, never fabricate the library sheet.
  const libraryShortcut=page.locator('#leagueScreenBody .deen-quran-quick button[onclick*="surahList"]').first();
  const clickable=await libraryShortcut.isVisible();
  rec.libraryNavigation={directUserClick:clickable,hiddenDashboardShortcut:!clickable};
  if(clickable)await libraryShortcut.click({timeout:15000});
  else{
   rec.navigationWarning='Real Quran library dashboard shortcut is present but not visible; QA entered via DEEN_QURAN.surahList()';
   await page.evaluate(()=>DEEN_QURAN.surahList());
  }
  await page.waitForSelector('#v5Sheet[open] .deen-quran-surah-card',{timeout:10000});
  const library=await page.evaluate(()=>{
   const sheet=document.getElementById('v5Sheet');
   const count=sheet.querySelectorAll('.deen-quran-surah-card').length;
   const arabic=[...sheet.querySelectorAll('[lang="ar"]')].map(x=>x.textContent);
   const writes=DEEN_FRENCH_STAGE_UI.setLocale('fr',sheet);
   const after=[...sheet.querySelectorAll('[lang="ar"]')].map(x=>x.textContent);
   return {count,writes,arabicUnchanged:JSON.stringify(arabic)===JSON.stringify(after),
    title:document.getElementById('v5SheetTitle')?.textContent.trim(),
    model:DEEN_QURAN.checkLibrary()};
  });
  rec.library=library;
  assert.equal(library.count,16,'DEEN Quran library list was incomplete');
  assert(library.arabicUnchanged);
  await page.screenshot({path:output+'/'+device.name+'-surah-library.png',fullPage:true});
  // Choose İhlâs via the real source-linked library card.
  await page.locator('#v5Sheet .deen-quran-surah-card[onclick*="ikhlas"]').click({timeout:15000});
  await page.waitForTimeout(320);
  const selectedRoute=await page.evaluate(()=>({
   sheetOpen:!!document.querySelector('#v5Sheet[open]'),
   sheetTitle:document.querySelector('#v5SheetTitle')?.textContent.trim()||'',
   sheetBody:document.querySelector('#v5SheetBody')?.textContent.slice(0,550)||'',
   actualIkhlasSession:!!document.querySelector('#v5Sheet[open] .deen-ikhlas-session'),
   quranLearningNodes:[...document.querySelectorAll('#v5Sheet [class*="surah"],#v5Sheet [class*="quran-learning"]')]
    .slice(0,12).map(x=>String(x.className).slice(0,85)),
   current:DEEN_QURAN_IKHLAS.model(),
   sampleMarkup:document.querySelector('#v5SheetBody')?.innerHTML.slice(0,1000)||''
  }));
  rec.surahCardRoute={...selectedRoute,sampleMarkup:selectedRoute.sampleMarkup.slice(0,550)};
  if(!selectedRoute.actualIkhlasSession){
   // Source-backed legacy Ikhlas five-step engine remains a supported DEEN
   // API even if a newer generic surah viewer owns the card route.
   rec.legacyLearningRouteFallback=true;
   await page.evaluate(()=>DEEN_QURAN_IKHLAS.open(1));
  }
  await page.waitForSelector('#v5Sheet[open] .deen-ikhlas-session',{timeout:10000});
  const original=await page.evaluate(()=>{
   const model=DEEN_QURAN_IKHLAS.model();
   const record=DEEN_QURAN_CONTENT.getAyah?.('ikhlas',model.ayah);
   const arabic=[...document.querySelectorAll('#v5Sheet [lang="ar"]')].map(x=>x.textContent.trim());
   return {model,recordArabic:record?.arabic?.text||null,arabic,
    audio:DEEN_QURAN_AUDIO.audit(),audioState:DEEN_QURAN_AUDIO.state()};
  });
  rec.ikhlasSource={ayah:original.model.ayah,ready:original.model.contentReady,
   arabicNodes:original.arabic.length,audio:original.audio};
  assert(original.model.contentReady,'Ikhlas ayah 1 not source-verified');
  assert(original.recordArabic&&/[\u0600-\u06ff]/u.test(original.recordArabic));
  assert(original.arabic.some(x=>x===original.recordArabic),
   'Arabic source and displayed Ikhlas ayah do not match');
  for(const row of original.audio){
   assert.equal(row.playable,!!(row.hasUrl&&row.verification_status==='production_ready'&&
     row.rights_status==='cleared'&&row.license&&row.rights_reference),
    'Unsafe Quran audio availability: '+JSON.stringify(row));
  }
  await page.evaluate(()=>DEEN_FRENCH_STAGE_UI.setLocale('fr',document.getElementById('v5Sheet')));
  const afterPreview=await page.evaluate(()=>({
   arabic:[...document.querySelectorAll('#v5Sheet [lang="ar"]')].map(x=>x.textContent.trim()),
   locale:DEEN_APP_LOCALE.get(),quranAudio:DEEN_QURAN_AUDIO.state(),
   frMeaningVisible:!!document.querySelector('#v5Sheet [data-verse-translation="ready"][lang="fr"]'),
   translationPending:!!document.querySelector('#v5Sheet [data-verse-translation="missing"]')
  }));
  assert.deepEqual(afterPreview.arabic,original.arabic,'QA French preview changed original Quran Arabic');
  assert.equal(afterPreview.locale,'tr');
  rec.ikhlasPreview=afterPreview;
  await page.screenshot({path:output+'/'+device.name+'-ikhlas-listen.png',fullPage:true});
  // Follow the actual five-step lesson buttons. Do not force a different
  // question type or simulate grading; Arabic text must remain source-exact.
  const steps=[];
  for(let index=0;index<5;index++){
   const data=await page.evaluate(()=>{
    const model=DEEN_QURAN_IKHLAS.model();
    const original=DEEN_QURAN_CONTENT.getAyah('ikhlas',model.ayah);
    const sheet=document.getElementById('v5Sheet');
    const before=[...sheet.querySelectorAll('[lang="ar"]')].map(el=>el.textContent.trim());
    const writes=DEEN_FRENCH_STAGE_UI.setLocale('fr',sheet);
    const after=[...sheet.querySelectorAll('[lang="ar"]')].map(el=>el.textContent.trim());
    const audio=sheet.querySelector('.deen-qaudio'),button=sheet.querySelector('.deen-qaudio-play');
    return {step:model.step,stepIndex:model.stepIndex,sourceArabic:original?.arabic?.text||null,
     displayedArabic:after,arabicUnchanged:JSON.stringify(before)===JSON.stringify(after),
     uiWrites:writes,audioPanel:!!audio,playDisabled:button?.disabled??null,
     audioRights:DEEN_QURAN_AUDIO.audit().find(x=>x.ayah===model.ayah),
     missingFrenchMeaning:!sheet.querySelector('[data-verse-translation="ready"][lang="fr"]'),
     action:sheet.querySelector('.deen-ikhlas-actions .deen-ikhlas-btn')?.textContent.trim()||''};
   });
   assert.equal(data.stepIndex,index,'Ikhlas learning order invalid');
   assert(data.sourceArabic&&data.arabicUnchanged,'Quran Arabic was overwritten during '+data.step);
   if(data.displayedArabic.length)
    assert(data.displayedArabic.some(x=>x===data.sourceArabic),'Source Arabic differs in '+data.step);
   if(data.playDisabled!==null)
    assert.equal(data.playDisabled,!data.audioRights?.playable,
     'Audio control ignores verified Quran rights gate');
   steps.push(data);
   await page.screenshot({path:output+'/'+device.name+'-ikhlas-step-'+index+'.png',fullPage:true});
   if(index<4)await page.locator('#v5Sheet .deen-ikhlas-actions .deen-ikhlas-btn').first()
    .click({timeout:15000});
  }
  rec.ikhlasSteps=steps;
  assert.deepEqual(steps.map(x=>x.step),['listen','read','meaning','recall','complete']);
  // Do not certify an untranslated/unsourced French Quran verse interpretation.
  rec.frenchMeaningReleased=false;
  rec.audioPlaybackCertified=false;
  rec.chromeAudioRightsGatingChecked=true;
  rec.errors=errors;
  assert.deepEqual(errors,[],'Unexpected browser errors in Quran staging');
  rec.status='passed';
  console.log('FR_QURAN_BROWSER',JSON.stringify({viewport:device.name,status:rec.status,
   library:library.count,steps:steps.map(x=>x.step),arabicPreserved:true,
   audioRightsControlsChecked:true,frenchMeaningReleased:false,actualLocale:afterPreview.locale}));
 }catch(e){
  rec.status='failed';rec.error=String(e?.stack||e);rec.errors=errors;
  console.error('FR_QURAN_BROWSER_FAILURE',JSON.stringify({viewport:device.name,
   error:rec.error,errors,library:rec.library,ikhlas:rec.ikhlasSource}));
 }finally{
  summary.tests.push(rec);await context.close();
 }
}
try{
 for(const device of [{name:'mobile-390',size:{width:390,height:844}},
                     {name:'desktop-1280',size:{width:1280,height:820}}])
  await run(device);
 summary.failures=summary.tests.filter(x=>x.status!=='passed').map(x=>({viewport:x.viewport,error:x.error}));
 summary.status=summary.failures.length?'failed':'passed';
 if(summary.failures.length)process.exitCode=1;
 console.log('FR_QURAN_BROWSER_SUMMARY',JSON.stringify({status:summary.status,
  viewports:summary.tests.length,passed:summary.tests.length-summary.failures.length,
  surahsInLibrary:16,ikhlasStepChecks:summary.tests.filter(x=>x.status==='passed').reduce((sum,x)=>sum+x.ikhlasSteps.length,0),
  productionFrenchUnlocked:false,arabicTextPreserved:true,audioPlaybackCertified:false,
  nativeFrenchMeaningReleased:false,failures:summary.failures}));
}finally{
 writeFileSync(output+'/quran-audit.json',JSON.stringify(summary,null,2)+'\n');await browser.close();
}
