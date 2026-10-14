/* P08 French locale persistence: real DEEN storage/locale functions in Chromium.
 * Two distinct claims: production FR is STILL blocked; QA-only commit FR->TR
 * preserves state. QA commit deliberately bypasses boot availability and is NOT
 * proof that real production FR language selection is enabled. */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';

const origin=process.env.DEEN_QA_ORIGIN||'http://127.0.0.1:8765';
assert(/^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/.test(origin),
 'P08 test must never run against production or a remote site');
const output='qa-artifacts/french-locale-progress';
mkdirSync(output,{recursive:true});
const result={scope:'actual_DEEN_locale_state_persistence_in_disposable_Chromium',
 productionFrenchSupported:false,qaOnlyFrenchCommit:true,
 testDoesNotUnlockFrench:true,tests:[],failures:[]};
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
function snapshot(){
 // This function's source is intentionally duplicated inside page.evaluate
 // below because Playwright runs evaluation in a separate browser realm.
}
try{
 for(const device of [{name:'mobile-390',width:390,height:844},
                      {name:'desktop-1280',width:1280,height:820}]){
  const context=await browser.newContext({
   viewport:{width:device.width,height:device.height},
   serviceWorkers:'block',locale:'fr-FR'
  });
  const page=await context.newPage(),errors=[],row={viewport:device.name};
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem('deen_app_language_v1','tr'));
  try{
   const response=await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:65000});
   assert.equal(response?.status(),200);
   await page.waitForFunction(()=>typeof saveState==='function'&&
    typeof state==='object'&&window.DEEN_BOOT&&window.DEEN_APP_LOCALE&&
    window.DEEN_CONTENT_LOCALE&&window.DEEN_QURAN?.state&&document.getElementById('lesson'),null,{timeout:100000});

   const seed=await page.evaluate(async()=>{
    if(DEEN_APP_LOCALE.get()!=='tr')throw Error('QA must start in Turkish');
    if(DEEN_CONTENT_LOCALE.available('fr'))throw Error('French release unexpectedly enabled');
    const fr=window.__DEEN_CONTENT_MANIFEST__?.languages?.fr;
    if(fr?.question_data!=='missing'||fr?.global_qa!=='blocked'||
       fr?.religious_expert_approved!==false)throw Error('French rights gate not blocked');
    document.getElementById('v998Onboarding')?.remove();
    document.getElementById('deenLanguageGate')?.remove();
    document.getElementById('deenPreparation')?.remove();
    document.querySelector('.phone')?.removeAttribute('inert');
    // Real app's migrated storage model, synthetic progress only in this context.
    state.onboarded=true;
    state.settings=state.settings||{};
    state.settings.language='tr';
    state.settings.onboardingLanguageConfirmed=true;
    state.xp=1735;
    state.streak=9;
    state.streakMeta=state.streakMeta||{};
    state.streakMeta.currentStreak=9;
    state.streakMeta.longestStreak=11;
    state.completed=['U01-S01','U01-S02'];
    state.stageScores={...(state.stageScores||{}),'U01-S01':100,'U01-S02':90};
    state.achievements=['first','streak7','xp1000'];
    // Initialize via the product's own Quran model normalizer, never fabricate a schema.
    DEEN_QURAN.state();
    if(!state.quranJourney||!state.quranJourney.progress?.surahs?.ikhlas)
     throw Error('Original Quran journey storage model unavailable');
    const q=state.quranJourney;
    q.currentSurah='ikhlas';q.profile.currentSurah='ikhlas';
    q.profile.currentAyah=2;
    q.progress.surahs.ikhlas.status='learning';
    q.progress.surahs.ikhlas.currentAyah=2;
    q.startedSurahs=Array.from(new Set([...(q.startedSurahs||[]),'ikhlas']));
    q.daily.ayahs=2;
    q.quizLocale='tr';
    saveState();
    if(JSON.parse(localStorage.getItem('deen_v4_1_state')).xp!==1735)
     throw Error('Actual state storage write failed');
    return {ready:DEEN_BOOT.status(),keys:Object.keys(state).length,
     localStorageStateSaved:true,frGate:fr.question_data};
   });
   row.seed=seed;
   // Capture domain progress, not volatile persistence metadata/time fields.
   const readProgress=()=>page.evaluate(()=>{
    const q=state.quranJourney;
    return {
     xp:state.xp,streak:state.streak,
     streakMeta:{currentStreak:state.streakMeta.currentStreak,
      longestStreak:state.streakMeta.longestStreak},
     completed:[...state.completed],stageScores:{...state.stageScores},
     achievements:[...state.achievements],
     quran:{currentSurah:q.currentSurah,profileSurah:q.profile.currentSurah,
      currentAyah:q.profile.currentAyah,ikhlasStatus:q.progress.surahs.ikhlas.status,
      ikhlasAyah:q.progress.surahs.ikhlas.currentAyah,
      startedIkhlas:q.startedSurahs.includes('ikhlas'),dailyAyahs:q.daily.ayahs},
     badgeFlags:badges().filter(b=>b.ok).map(b=>b.id).sort()
    };
   });
   const before=await readProgress();
   assert(before.xp>1000&&before.streak>7&&before.completed.length>=2);
   assert(['first','streak7','xp1000'].every(x=>before.badgeFlags.includes(x)),
    'Real badge achievements were not populated in isolated QA fixture');
   row.before=before;

   // Real production boot must reject FR and leave all state untouched.
   const blocked=await page.evaluate(async()=>{
    const accepted=await DEEN_BOOT.changeLanguage('fr');
    return {accepted,locale:DEEN_APP_LOCALE.get(),
     pref:localStorage.getItem('deen_app_language_v1'),
     settings:state.settings.language,
     quranQuizLocale:state.quranJourney.quizLocale,
     frAvailability:DEEN_CONTENT_LOCALE.available('fr'),
     activeLesson:document.getElementById('lesson')?.classList.contains('active')};
   });
   assert.equal(blocked.accepted,false,'Production unexpectedly allowed French');
   assert.equal(blocked.locale,'tr');assert.equal(blocked.pref,'tr');
   assert.equal(blocked.settings,'tr');assert.equal(blocked.quranQuizLocale,'tr');
   assert.equal(blocked.frAvailability,false);
   assert.deepEqual(await readProgress(),before,
    'Blocked French request changed user learning state');
   row.productionBlockedPreserved=true;

   // QA-only: exercise the actual DEEN_APP_LOCALE.commit and saveState paths.
   // This bypass is NEVER inserted into production UI or deploy.
   const qaFrench=await page.evaluate(()=>{
    if(DEEN_CONTENT_LOCALE.available('fr'))throw Error('French gate changed');
    if(!DEEN_APP_LOCALE.commit('fr'))throw Error('QA-only commit failed');
    return {locale:DEEN_APP_LOCALE.get(),
     stored:localStorage.getItem('deen_app_language_v1'),
     state:state.settings.language,quiz:state.quranJourney.quizLocale,
     runtimeReady:DEEN_CONTENT_LOCALE.available('fr')};
   });
   assert.deepEqual(qaFrench,{locale:'fr',stored:'fr',state:'fr',
    quiz:'fr',runtimeReady:false});
   assert.deepEqual(await readProgress(),before,
    'QA French locale setter changed user progress');
   row.qaFrenchCommitPreserved=true;
   const back=await page.evaluate(()=>{
    if(!DEEN_APP_LOCALE.commit('tr'))throw Error('Cannot switch back to TR');
    return {locale:DEEN_APP_LOCALE.get(),
     stored:localStorage.getItem('deen_app_language_v1'),
     state:state.settings.language,quiz:state.quranJourney.quizLocale};
   });
   assert.deepEqual(back,{locale:'tr',stored:'tr',state:'tr',quiz:'tr'});
   assert.deepEqual(await readProgress(),before,'Locale roundtrip changed progress');
   row.qaRoundTripPreserved=true;

   // Reload through the actual assembled app and compare restored data.
   await page.reload({waitUntil:'domcontentloaded',timeout:65000});
   await page.waitForFunction(()=>typeof state==='object'&&window.DEEN_BOOT?.isReady?.()
    &&window.DEEN_APP_LOCALE?.get?.()==='tr',null,{timeout:100000});
   const restored=await readProgress();
   assert.deepEqual(restored,before,'Reload lost progress after QA locale roundtrip');
   const storage=await page.evaluate(()=>({
    language:localStorage.getItem('deen_app_language_v1'),
    storedXP:JSON.parse(localStorage.getItem('deen_v4_1_state'))?.xp,
    frGate:window.__DEEN_CONTENT_MANIFEST__.languages.fr.question_data,
    frenchRuntimeAvailable:DEEN_CONTENT_LOCALE.available('fr')
   }));
   assert.deepEqual(storage,{language:'tr',storedXP:1735,frGate:'missing',
    frenchRuntimeAvailable:false});
   row.reloadPreserved=true;row.restored=restored;row.storage=storage;
   row.errors=errors;
   assert.deepEqual(errors,[],'Unexpected app page errors');
   row.status='passed';
   console.log('FR_P08_PROGRESS',JSON.stringify({
    viewport:device.name,status:row.status,
    productionFrenchBlocked:true,realLocaleSaveRoundTrip:true,
    xp:restored.xp,streak:restored.streak,
    achievements:restored.achievements.length,
    completed:restored.completed.length,quranSurah:restored.quran.currentSurah,
    quranAyah:restored.quran.currentAyah,
    reloadPreserved:true,productionFrenchUnlocked:false
   }));
   await page.screenshot({path:output+'/'+device.name+'-after-roundtrip.png',fullPage:true});
  }catch(e){
   row.status='failed';row.error=String(e?.stack||e);row.errors=errors;
   console.error('FR_P08_FAILURE',JSON.stringify({viewport:device.name,error:row.error}));
  }finally{result.tests.push(row);await context.close();}
 }
 result.failures=result.tests.filter(x=>x.status!=='passed')
  .map(x=>({viewport:x.viewport,error:x.error}));
 result.status=result.failures.length?'failed':'passed';
 console.log('FR_P08_SUMMARY',JSON.stringify({
  status:result.status,passed:result.tests.length-result.failures.length,
  viewports:result.tests.length,qaOnlyFrenchCommit:true,
  productionFrenchUnlocked:false,failures:result.failures
 }));
 if(result.failures.length)process.exitCode=1;
}finally{
 writeFileSync(output+'/state-roundtrip.json',JSON.stringify(result,null,2)+'\n');
 await browser.close();
}
