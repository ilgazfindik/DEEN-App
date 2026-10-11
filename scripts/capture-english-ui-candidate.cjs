/* Chromium integration tests against the real segmented application, using disposable local profiles. */
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.env.DEEN_QA_OUTPUT||path.join(root,'qa/english-runtime');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const url=req.url.split('?')[0],file=path.join(root,decodeURIComponent(url==='/'?'/index.html':url));try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':'application/octet-stream');res.end(fs.readFileSync(file))}catch(_){res.statusCode=404;res.end('missing')}});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({channel:'chrome',headless:true,...(process.env.DEEN_CHROMIUM?{executablePath:process.env.DEEN_CHROMIUM}:{}),args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-zygote']});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],report={stages:[],macros:[],types:{},reviews:[],errors};
 report.browser={name:'Google Chrome',version:browser.version()};
 page.on('console',m=>{if(m.type()==='error')console.log('BROWSER',m.text())});page.on('pageerror',e=>{errors.push(e.message);console.log('ERROR',e.message)});
 await page.addInitScript(()=>{
  if(window.top!==window)return;window.__DEEN_LOCALIZATION_QA__=true;
  // This test data exists only in this disposable browser context.
  if(!localStorage.getItem('deen_v4_1_state')){localStorage.setItem('deen_app_language_v1','en');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:777,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'en',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))}
  window.__qa={long:[],observers:[],globalListeners:0};const originalAdd=EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener=function(...args){if(this===window||this===document)__qa.globalListeners++;return originalAdd.apply(this,args)};const Native=MutationObserver;
  window.MutationObserver=class extends Native{constructor(fn){const row={fn:fn.toString().slice(0,160),callbacks:0,mutations:0,ms:0};__qa.observers.push(row);super((r,o)=>{row.callbacks++;row.mutations+=r.length;const t=performance.now();fn(r,o);row.ms+=performance.now()-t});this.qaRow=row}observe(...args){this.qaRow.active=true;return super.observe(...args)}disconnect(){this.qaRow.active=false;return super.disconnect()}};
  new PerformanceObserver(l=>__qa.long.push(...l.getEntries().map(e=>({start:e.startTime,ms:e.duration})))).observe({entryTypes:['longtask']});
 });
 await page.goto(url);await page.waitForFunction(()=>window.DEEN_BOOT?.status().phase==='ready'||window.DEEN_BOOT?.status().phase==='error',{timeout:30000});
 const boot=await page.evaluate(()=>DEEN_BOOT.status());assert.equal(boot.phase,'ready',JSON.stringify(boot));report.boot=boot;
 await sleep(7000);


 const texts=new Set(),failures=[];
 const shopSource='Pırıltı öğrenme hedeflerinden kazanılır. Dinî içerik satın alınmaz.';const shopExpected='Earn sparkles through learning goals. Religious content is not purchased.';
 assert.equal(await page.evaluate(t=>DEEN_ENGLISH_UI.t(t),shopSource),shopExpected,'English shop policy copy must translate as one sentence');

 await page.evaluate(()=>{
  window.__qaContentTexts=new Set();
  const collect=v=>{if(typeof v==='string')__qaContentTexts.add(v.trim());else if(Array.isArray(v))v.forEach(collect);else if(v&&typeof v==='object')Object.values(v).forEach(collect)};
  for(const q of [...DEEN_BASE_QUESTIONS,...QUESTIONS])for(const k of ['question_tr','explanation_tr','options_tr','correct_answer','pairs','items','correct_order','teaching_card'])collect(q[k]);
  for(const x of DEEN_QURAN_CONTENT.inventory())collect(DEEN_QURAN_CONTENT.getAyah(x.surah_id,x.ayah_number)?.translation?.text);
  state.completed=STAGES.map(s=>s.id);state.energy=30;state.sectionFinal={completed:true};state.section2Final={completed:true};DEEN_FIVE_STAGE.sync();
 });
 async function capture(){
  await page.waitForTimeout(180);
  const rows=await page.evaluate(()=>{
   const out=new Set(),walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
   let n;while(n=walker.nextNode()){
    const el=n.parentElement,s=n.nodeValue.trim();
    if(!s||!el?.getClientRects().length||el.closest('script,style,noscript,code,.deen-ikhlas-arabic,.deen-mem-arabic,[data-deen-no-translate]')||__qaContentTexts.has(s))continue;
    out.add(s);
   }
   for(const el of document.querySelectorAll('[aria-label],[placeholder],[alt],[title]'))if(el.getClientRects().length)for(const k of ['aria-label','placeholder','alt','title']){const s=el.getAttribute(k);if(s&&!__qaContentTexts.has(s))out.add(s);}
   return [...out];
  });rows.forEach(s=>texts.add(s));
 }
 await capture();
 const screenIds=await page.evaluate(()=>[...document.querySelectorAll('.screen[id]')].map(e=>e.id));
 for(const id of screenIds){await page.evaluate(id=>navigate(id),id);await capture();}
 // Review screen: assert rendered live UI, including ASCII Turkish leaks missed by diacritic checks.
 await page.evaluate(()=>navigate('reviewScreen'));
 await page.waitForTimeout(240);
 const reviewScreenText=await page.locator('#reviewScreen').innerText();
 assert(reviewScreenText.includes("Today's memory plan"),"Review header missing");
 assert(/\b\d+ concepts · \d+ energy\b/.test(reviewScreenText),"Review concept/energy card is not fully English");
 assert(/\b\d+ READY\b/.test(reviewScreenText),"Spaced-review ready count must be English");
 assert(/\b\d+ checkpoints? completed\b/.test(reviewScreenText),"Review checkpoints label must be English");
 assert(reviewScreenText.includes('SPACED REVIEW'),"Spaced-review panel missing");
 assert(!/\b(?:kavram|enerji|HAZIR|tekrar bekliyor)\b/i.test(reviewScreenText)&&!/[ÇĞİÖŞÜçğıöşü]/.test(reviewScreenText),'Turkish review UI residue');
 await page.screenshot({path:path.join(out,'english-review-dashboard.png')});
 const expectedReviewLabels={
  '462 kavram · 3 enerji':'462 concepts · 3 energy',
  '1 kavram · 3 enerji':'1 concept · 3 energy',
  '0 kavram':'0 concepts',
  '1 kavram':'1 concept',
  '30 enerji':'30 energy',
  '0 HAZIR':'0 READY',
  '5 HAZIR':'5 READY',
  '0 kontrol noktası tamamlandı':'0 checkpoints completed',
  '1 kontrol noktası tamamlandı':'1 checkpoint completed',
  '1 tekrar bekliyor':'1 review due',
  '2 tekrar bekliyor':'2 reviews due',
  'Eşleşen kavramlar · %0':'Matching concepts · 0%',
  'Temel kavramlar · %75':'Core concepts · 75%',
  '1 soruda hata tekrar ediyor. Akıllı tekrar bu sinyalleri önceliklendirecek.':'Mistakes recur in 1 question. Smart review will prioritize these signals.',
  '2 soruda hata tekrar ediyor. Akıllı tekrar bu sinyalleri önceliklendirecek.':'Mistakes recur in 2 questions. Smart review will prioritize these signals.',
  'Hafıza planı:':'Memory plan:',
  'Vadesi gelen bilgiler önce geliyor.':'Due review items are prioritized.',
  'Vadesi gelen soru yok; plan zayıf kavramlar ve kontrollü varyasyonlarla dengeleniyor.':'No questions are due; the plan balances weaker concepts with controlled variations.'
 };
 for(const [source,expected] of Object.entries(expectedReviewLabels)){
  const actual=await page.evaluate(x=>DEEN_ENGLISH_UI.t(x),source);
  assert.equal(actual,expected,'Review English UI: '+source);
 }
 console.log('PASS ENGLISH REVIEW DASHBOARD GATE',JSON.stringify({rendered:true,counters:true,ready:true,checkpoint:true,labels:Object.keys(expectedReviewLabels).length}));
 for(const expression of ['settingsPanel()','storePanel()','DEEN_ADMIN.open()']){
  try{await page.evaluate(expression=>eval(expression),expression);await capture();await page.evaluate(()=>{DEEN_ADMIN.close();closeSheet()});}catch(e){failures.push({expression,error:String(e)})}
 }
 const macros=await page.evaluate(()=>DEEN_FIVE_STAGE.all().map(d=>d.id));
 for(const id of macros){
  await page.evaluate(id=>previewMacro(id),id);await capture();await page.evaluate(()=>closeSheet());
  await page.evaluate(id=>{state.energy=30;session=null;startMacroStage(id)},id);await capture();
  if(await page.locator('.v910-overlay .v910-card-button').count())await page.locator('.v910-overlay .v910-card-button').click();
  await capture();
  await page.evaluate(()=>{if(session)completeQuestion(false,session.questions[session.index])});await capture();await page.evaluate(()=>closeLesson());
 }
 for(const mode of ['smart','quick','mistakes','weak','due']){
  await page.evaluate(mode=>{state.energy=30;state.mistakes=QUESTIONS.slice(0,10).map(q=>q.id);for(const q of QUESTIONS.slice(0,10))state.reviewSchedule[q.id]={nextReview:Date.now()-100,lastSeen:Date.now()-100000,correctCount:0,wrongCount:1};startSmartReview(mode)},mode);await capture();await page.evaluate(()=>closeLesson());
 }
 for(const id of ['fatiha','ikhlas','falaq','nas','kafirun','nasr','masad','fil','quraysh','maun','sharh','tin','bayyina','zilzal','kawthar','asr']){
  await page.evaluate(id=>DEEN_QURAN.openSurah(id),id);await capture();
  await page.evaluate(()=>DEEN_QURAN_JOURNEY_V2.startStage('learn'));await capture();
  await page.evaluate(id=>DEEN_QURAN_AYET_TEST.start(id),id);await capture();await page.evaluate(()=>closeSheet());
 }
 for(const type of ['fill_blank','continuation','surah','audio','next_ayah','ayah_number','meaning']){
  await page.evaluate(type=>DEEN_QURAN_QUESTION_ARENA.open(type,'all'),type);await capture();await page.evaluate(()=>closeSheet());
 }
 for(const profile of ['child','teen','adult']){
  await page.evaluate(profile=>{state.learningProfile=profile;state.energy=30;startMacroStage('U01-M01')},profile);await capture();await page.screenshot({path:path.join(out,'english-'+profile+'-question.png')});await page.evaluate(()=>closeLesson());
 }
 for(const mascot of ['lion','wolf','owl','turtle','eagle','cat'])for(const combo of [3,5,10]){await page.evaluate(({mascot,combo})=>{state.profile.companion=mascot;DEEN_COMPANION_STREAK.celebrate(combo)},{mascot,combo});await capture();await page.waitForTimeout(1600)}
 const localization=await page.evaluate(()=>DEEN_ENGLISH_UI.audit());console.log('ENGLISH_UI_STATS='+JSON.stringify(localization));const snapshot={localization,texts:[...texts],failures,screenIds,macros:macros.length};
 snapshot.leaks=snapshot.texts.filter(s=>/[ÇĞİÖŞÜçğıöşü\u0600-\u06ff]/.test(s)&&!/^AR:|Quran.com/.test(s));console.log('DEEN_ENGLISH_UI_CANDIDATE='+JSON.stringify(snapshot));
 fs.writeFileSync(path.join(out,'english-ui-candidate.json'),JSON.stringify(snapshot,null,2));
 // Catch ASCII-only Turkish completion badges that character-based leak scans missed.
 const completedLabels=snapshot.texts.filter(s=>/^SECTION \d+ · UNIT \d+ · ✓ COMPLETED$/.test(s));
 assert.equal(completedLabels.length,15,'All 15 completed learning unit labels must be fully English: '+JSON.stringify(completedLabels));
 assert(snapshot.texts.includes('EARN XP'),'Learning stage introduction must display EARN XP in English');
 const learningLeaks=snapshot.texts.filter(s=>/\b(?:TAMAMLANDI|XP KAZAN|ÜNİTE UNVANI|ÜNİTE XP|USTALIK SINAVINI BAŞLAT)\b/i.test(s));
 assert.deepEqual(learningLeaks,[],'Learning path still contains ASCII Turkish copy');
 const expectedLearningLabels={
  '1. SECTION · 1. UNIT · ✓ TAMAMLANDI':'SECTION 1 · UNIT 1 · ✓ COMPLETED',
  '3. KISIM · 15. ÜNİTE · ✓ TAMAMLANDI':'SECTION 3 · UNIT 15 · ✓ COMPLETED',
  '✓ TAMAMLANDI':'✓ COMPLETED',
  'XP KAZAN':'EARN XP',
  'ÜNİTE TAMAMLANDI':'UNIT COMPLETED',
  'KISIM 2 TAMAMLANDI':'SECTION 2 COMPLETED',
  '2/7 aşama':'2/7 stages',
  '5/5 aşama':'5/5 stages',
  '3/3 mini ders · öğrenme zinciri tamamlandı':'3/3 mini lessons · learning sequence completed',
  'Kusursuz dersler: 2':'Perfect lessons: 2',
  'En iyi skor':'Best score'
 };
 for(const [source,expected] of Object.entries(expectedLearningLabels)){
  const actual=await page.evaluate(s=>DEEN_ENGLISH_UI.t(s),source);
  assert.equal(actual,expected,'Learning screen i18n: '+source);
 }
 console.log('PASS ENGLISH LEARNING PATH COMPLETION GATE',JSON.stringify({completedUnitLabels:completedLabels.length,xpReward:true,assertions:Object.keys(expectedLearningLabels).length,asciiTurkishLeaks:learningLeaks.length}));
 snapshot.turkishLeaks=snapshot.leaks.filter(s=>/[ÇĞİÖŞÜçğıöşü]/.test(s));console.log('TURKISH_UI_LEAKS='+JSON.stringify(snapshot.turkishLeaks));assert.deepEqual(snapshot.turkishLeaks,[],'English UI still displays Turkish copy');
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
