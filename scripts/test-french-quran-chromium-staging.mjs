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
  const init=await page.evaluate(({ui,dynamic,observed,quranUi,quranDynamic})=>{
   const bridge=window.DEEN_FRENCH_STAGE_UI;
   if(!bridge)throw Error('Loopback Quran FR QA bridge unavailable');
   const result=bridge.init({staticTranslations:ui,dynamicTranslations:dynamic,
    runtimeObservedTranslations:observed,
    quranStaticTranslations:quranUi,quranDynamicTranslations:quranDynamic});
   if(result.staticKeys!==1452||result.observedKeys!==4||
     result.quranStaticDraftKeys!==54||result.quranDynamicDraftKeys!==15)
    throw Error('FR Quran preview source coverage drift');
   return result;
  },{ui:fixture.ui,dynamic:fixture.dynamic,observed:fixture.observed,
     quranUi:fixture.quranUi,quranDynamic:fixture.quranDynamic});
  rec.localePreview={staticKeys:init.staticKeys,observedKeys:init.observedKeys,
   quranStaticDraftKeys:init.quranStaticDraftKeys,quranDynamicDraftKeys:init.quranDynamicDraftKeys,
   productionActivated:false};
  // Check both staged Quran label categories through the same bridge used in
  // the assembled Chrome tab. This is interface-only, never a Quran meaning.
  const quranUiExamples=await page.evaluate(()=>{
   const bridge=DEEN_FRENCH_STAGE_UI;
   return {
    library:bridge.translate('Sure Kütüphanesi','fr'),
    ikhlas:bridge.translate('İhlâs Suresi','fr'),
    surahIndex:bridge.translate('1. sure · 7 ayet · Şu an buradasın','fr'),
    completed:bridge.translate('0 / 7 ayet tamamlandı','fr'),
    unstarted:bridge.translate('BAŞLANMADI','fr'),
    bayyina:bridge.translate('Beyyine Suresi','fr'),
    listening:bridge.translate('Hoparlöre dokun: Ayet 1 kaydını dinle.','fr'),
    ayahIndex:bridge.translate('İhlâs · Ayet 1/4','fr'),
    fatiha:bridge.translate('Fâtiha Suresi','fr'),
    verse:bridge.translate('Ayet 1 / 7 · Son çalışma: Henüz çalışma yok','fr'),
    oneAyah:bridge.translate('0 / 1 ayet','fr'),
    sevenAyahs:bridge.translate('2 / 7 ayet','fr'),
    personalReview:bridge.translate('24 riskli ayetten kişisel tur','fr'),
    journey:bridge.translate('İhlâs Yolculuğu','fr'),
    learning:bridge.translate('0/4 ayet öğrenildi','fr'),
    listeningStep:bridge.translate('2 · OKU','fr'),
    level:bridge.translate('SEVİYE 0','fr'),
    recurrence:bridge.translate('Mevcut günlük görevler: 0/1 tamamlandı · 1 tekrar bekliyor','fr')
   };
  });
  assert.deepEqual(quranUiExamples,{
   library:'Bibliothèque des sourates',
   ikhlas:'Sourate Al-Ikhlâs',
   surahIndex:'Sourate n° 1 · 7 versets · Vous êtes ici',
   completed:'0 / 7 versets étudiés',
   unstarted:'NON COMMENCÉE',
   bayyina:'Sourate Al-Bayyina',
   listening:'Appuie sur le haut-parleur pour écouter la récitation du verset 1.',
   ayahIndex:'Al-Ikhlâs · verset 1/4',
   fatiha:'Sourate Al-Fâtiha',
   verse:'Verset 1 / 7 · Dernière séance : pas encore étudié',
   oneAyah:'0 / 1 verset',sevenAyahs:'2 / 7 versets',
   personalReview:'Parcours personnalisé parmi 24 versets à revoir',
   journey:'Parcours d’Al-Ikhlâs',
   learning:'0/4 versets appris',
   listeningStep:'2 · LIRE',
   level:'NIVEAU 0',
   recurrence:'Tâches quotidiennes : 0/1 terminée · 1 révision en attente'
  },'Quran UI key and dynamic count translations must remain source-specific');
  rec.quranUiExamples=quranUiExamples;
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
  // Record actual user-visible navigational controls, not only the legacy
  // shortcut selector. Distinguishes an intentional hidden legacy shortcut
  // from the absence of any usable library button.
  const dashboardControls=await page.evaluate(()=>{
   const root=document.getElementById('leagueScreenBody');
   return [...root.querySelectorAll('button,a,[role="button"]')].slice(0,45).map(el=>{
    const box=el.getBoundingClientRect(),css=getComputedStyle(el);
    const visible=!!(box.width&&box.height&&css.display!=='none'&&css.visibility!=='hidden');
    return {text:el.textContent.trim().slice(0,85),className:String(el.className).slice(0,70),
     onclick:el.getAttribute('onclick')?.slice(0,130)||null,
     visible,display:css.display,visibility:css.visibility,
     parentClassName:String(el.parentElement?.className||'').slice(0,80)};
   });
  });
  rec.dashboardControls=dashboardControls;
  console.log('FR_QURAN_DASHBOARD_CONTROLS',JSON.stringify({viewport:device.name,
   controls:dashboardControls}));
  // New Quran dashboard: the legacy quick shortcut is hidden, but there is
  // a distinct visible primary "Sureler / Bibliothèque" user action.
  // Always enter through the real clickable UI, never call surahList() directly.
  const legacyShortcut=page.locator('#leagueScreenBody .deen-quran-quick button[onclick*="surahList"]').first();
  const legacyVisible=await legacyShortcut.isVisible();
  const libraryAction=page.locator('#leagueScreenBody .deen-qia-action.primary').first();
  assert.equal(await libraryAction.count(),1,'Visible Quran library primary action missing');
  const userFacingLabel=(await libraryAction.textContent()||'').trim();
  assert(/sure|sourate/i.test(userFacingLabel),
   'First primary Quran action no longer opens surah library: '+userFacingLabel);
  assert(await libraryAction.isVisible(),'Real library action is not visible');
  await libraryAction.click({timeout:15000});
  rec.libraryNavigation={
   directUserClick:true,
   actionText:userFacingLabel,
   legacyShortcutVisible:legacyVisible,
   modernQuranDashboard:true
  };
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
  // Ground the user-facing generic route separately from the legacy API.
  // The visible library card should expose a usable surah page, not a blank
  // modal. Preserve all original Arabic script even under French QA overlay.
  const genericViewer=await page.evaluate(()=>{
   const root=document.querySelector('#v5Sheet[open]');
   const content=root?.textContent?.trim()||'';
   const arabicVisible=[...root?.querySelectorAll('[lang="ar"],.deen-quran-ar,.deen-quran-ayah-arabic,.deen-qj2-ar')||[]]
     .map(el=>el.textContent.trim()).filter(Boolean);
   const arabicScript=[...content.matchAll(/[\u0600-\u06ff][\u0600-\u06ff\s\u064b-\u065f\u0670\u06d6-\u06ed]{8,}/gu)]
     .map(m=>m[0].trim()).slice(0,8);
   const controls=[...root?.querySelectorAll('button,[role="button"],audio')||[]]
     .map(el=>({tag:el.tagName.toLowerCase(),text:(el.textContent||'').trim().slice(0,80),
      aria:el.getAttribute('aria-label'),disabled:!!el.disabled})).slice(0,22);
   const arabicBefore=arabicVisible.join('||');
   const arabicTextBefore=arabicScript.join('||');
   const writes=DEEN_FRENCH_STAGE_UI.setLocale('fr',root);
   const arabicAfter=[...root?.querySelectorAll('[lang="ar"],.deen-quran-ar,.deen-quran-ayah-arabic,.deen-qj2-ar')||[]]
     .map(el=>el.textContent.trim()).filter(Boolean).join('||');
   const arabicTextAfter=[...(root?.textContent||'').matchAll(/[\u0600-\u06ff][\u0600-\u06ff\s\u064b-\u065f\u0670\u06d6-\u06ed]{8,}/gu)]
     .map(m=>m[0].trim()).slice(0,8).join('||');
   return {hasModal:!!root,characters:content.length,controls,
    textPreview:content.slice(0,320),arabicNodeCount:arabicVisible.length,
    arabicSample:arabicVisible.slice(0,3),scriptMatches:arabicScript.length,
    arabicUnchanged:arabicBefore===arabicAfter&&arabicTextBefore===arabicTextAfter,
    writes};
  });
  rec.genericViewer=genericViewer;
  assert(genericViewer.hasModal&&genericViewer.characters>50,
   'Visible Ikhlas library card opened an empty/nonexistent generic page');
  assert(genericViewer.arabicUnchanged,'French QA rewrote generic Quran Arabic script');
  console.log('FR_QURAN_GENERIC_ROUTE',JSON.stringify({viewport:device.name,...genericViewer}));
  await page.screenshot({path:output+'/'+device.name+'-ikhlas-generic-route.png',fullPage:true});
  // Exercise the actual "Commencer" path from the generic Ikhlas journey,
  // rather than confusing a successfully opened overview with an ayah lesson.
  const actualStart=page.locator('#v5Sheet button').filter({hasText:/^(BAŞLA|COMMENCER|Commencer)$/i}).first();
  assert.equal(await actualStart.count(),1,'Ikhlas journey has no visible start action');
  assert(await actualStart.isVisible(),'Ikhlas journey start is not visible to learner');
  assert(await actualStart.isEnabled(),'Ikhlas journey start is unexpectedly disabled');
  const beforeStart=await page.evaluate(()=>document.querySelector('#v5SheetBody')?.innerHTML||'');
  await actualStart.click({timeout:15000});
  await page.waitForTimeout(350);
  const genericStart=await page.evaluate(before=>{
   const sheet=document.getElementById('v5Sheet');
   const raw=sheet?.querySelector('#v5SheetBody')?.innerHTML||'';
   const arabicBefore=[...sheet?.querySelectorAll('[lang="ar"]')||[]].map(el=>el.textContent.trim());
   const ayahSource=DEEN_QURAN_CONTENT.getAyah('ikhlas',1)?.arabic?.text||null;
   const exactAyahDisplayed=!!ayahSource&&arabicBefore.includes(ayahSource);
   const beforeSourceAttribution=(sheet?.innerText||'').includes('Muhammed Hamdi Yazır, 1938');
   const writes=sheet?.open?DEEN_FRENCH_STAGE_UI.setLocale('fr',sheet):0;
   const arabicAfter=[...sheet?.querySelectorAll('[lang="ar"]')||[]].map(el=>el.textContent.trim());
   const afterSourceAttribution=(sheet?.innerText||'').includes('Muhammed Hamdi Yazır, 1938');
   const frenchMeaningReady=!!sheet?.querySelector('[data-verse-translation="ready"][lang="fr"]');
   return {changed:raw!==before,open:!!sheet?.open,writes,
    exactAyahDisplayed,ayahSourceVerified:!!ayahSource,
    sourceAttributionUnchanged:beforeSourceAttribution===afterSourceAttribution,
    frenchMeaningReady,
    title:document.getElementById('v5SheetTitle')?.textContent?.trim()||'',
    visibleText:(sheet?.innerText||'').slice(0,600),
    arabicNodeCount:arabicBefore.length,
    arabicUnchanged:JSON.stringify(arabicBefore)===JSON.stringify(arabicAfter),
    appLocale:DEEN_APP_LOCALE.get(),
    prodGate:window.__DEEN_CONTENT_MANIFEST__.languages.fr.question_data
   };
  },beforeStart);
  rec.genericJourneyStart=genericStart;
  assert(genericStart.changed,'Clicking the real Ikhlas start button did not advance the journey');
  assert(genericStart.arabicUnchanged,'French preview changed native Quran Arabic during journey start');
  assert(genericStart.ayahSourceVerified&&genericStart.exactAyahDisplayed,
   'Visible native Quran learning route does not display the exact verified Arabic ayah');
  assert(genericStart.sourceAttributionUnchanged,
   'French preview modified the Quran translation source attribution');
  assert.equal(genericStart.frenchMeaningReady,false,
   'Unapproved Quran French meaning was misleadingly exposed as ready');
  assert.equal(genericStart.appLocale,'tr');
  assert.equal(genericStart.prodGate,'missing');
  console.log('FR_QURAN_GENERIC_START',JSON.stringify({viewport:device.name,...genericStart}));
  await page.screenshot({path:output+'/'+device.name+'-ikhlas-generic-start.png',fullPage:true});
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
  // Decode the actual ayah MP3 files in Chromium without playing them.
  // Codec success is not permission to publish or proof of audio playback.
  const audioCodec=await page.evaluate(async()=>{
   const manifestResponse=await fetch('/assets/quran/audio/ayah-audio-manifest.json',{cache:'no-store'});
   if(!manifestResponse.ok)throw Error('Audio manifest fetch failed');
   const manifest=await manifestResponse.json();
   const ctx=new (window.AudioContext||window.webkitAudioContext)();
   const records=[];
   try{
    for(const key of ['fatiha:1','ikhlas:1']){
     const entry=manifest.entries.find(x=>x.key===key);
     if(!entry)throw Error('Missing critical ayah audio entry '+key);
     const response=await fetch('/'+entry.audio,{cache:'no-store'});
     if(!response.ok)throw Error('MP3 request failed '+key+' '+response.status);
     const decoded=await ctx.decodeAudioData(await response.arrayBuffer());
     records.push({key,durationSeconds:decoded.duration,channels:decoded.numberOfChannels,
      sampleRate:decoded.sampleRate,decodeSucceeded:true,playbackAttempted:false});
    }
   }finally{await ctx.close();}
   const response=await fetch('/assets/quran/audio/word-timings.json',{cache:'no-store'});
   if(!response.ok)throw Error('Word timing manifest request failed');
   const alignment=await response.json();
   return {records,alignedAyahs:Object.keys(alignment.entries||{}).length,
    synchronizedHighlightCertified:false,rightsOrPlaybackCertified:false};
  });
  assert.equal(audioCodec.records.length,2);
  assert(audioCodec.records.every(x=>x.decodeSucceeded&&Number.isFinite(x.durationSeconds)&&
   x.durationSeconds>0&&x.channels>0),'Real browser cannot decode critical recitation MP3s');
  rec.audioCodecVerification=audioCodec;
  rec.audioPlaybackCertified=false;
  rec.chromeAudioRightsGatingChecked=true;
  const coverage=await page.evaluate(()=>{
   const audit=DEEN_FRENCH_STAGE_UI.audit();
   return {unrecognizedCount:audit.unrecognized.length,
    sourceOnlyExamples:audit.unrecognized.filter(x=>/[A-Za-zÇĞİÖŞÜçğıöşü]/u.test(x))
     .filter(x=>!/^[\d\W]+$/u.test(x)).slice(0,80),
    productionLocale:DEEN_APP_LOCALE.get()};
  });
  rec.quranRuntimeUnmapped=coverage;
  assert.equal(coverage.productionLocale,'tr');
  rec.errors=errors;
  assert.deepEqual(errors,[],'Unexpected browser errors in Quran staging');
  rec.status='passed';
  console.log('FR_QURAN_BROWSER',JSON.stringify({viewport:device.name,status:rec.status,
   library:library.count,steps:steps.map(x=>x.step),arabicPreserved:true,
   audioRightsControlsChecked:true,frenchMeaningReleased:false,actualLocale:afterPreview.locale,
   nativeLibraryClick:rec.libraryNavigation.directUserClick,
   legacyIkhlasApiFallback:!!rec.legacyLearningRouteFallback,
   libraryUserClick:rec.libraryNavigation.directUserClick,
   unmappedCount:coverage.unrecognizedCount,unmappedSample:coverage.sourceOnlyExamples}));
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
