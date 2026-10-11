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
  window.__qa={long:[],observers:[],listeners:0};const Native=MutationObserver;
  window.MutationObserver=class extends Native{constructor(fn){const row={fn:fn.toString().slice(0,160),callbacks:0,mutations:0,ms:0};__qa.observers.push(row);super((r,o)=>{row.callbacks++;row.mutations+=r.length;const t=performance.now();fn(r,o);row.ms+=performance.now()-t})}};
  new PerformanceObserver(l=>__qa.long.push(...l.getEntries().map(e=>({start:e.startTime,ms:e.duration})))).observe({entryTypes:['longtask']});
 });
 console.log('START',url);await page.goto(url);await page.waitForFunction(()=>window.DEEN_BOOT?.status().phase==='ready'||window.DEEN_BOOT?.status().phase==='error',{timeout:30000});
 const boot=await page.evaluate(()=>DEEN_BOOT.status());assert.equal(boot.phase,'ready',JSON.stringify(boot));report.boot=boot;


 console.log('BOOT READY');report.admin=await page.evaluate(()=>{const before=DEEN_ADMIN.snapshot();DEEN_ADMIN.open();return {before,open:document.getElementById('deenAdminPanelV2')?.open,authoritative:DEEN_ADMIN.authoritative}});assert(report.admin.open&&report.admin.authoritative);await page.evaluate(()=>DEEN_ADMIN.close());
 console.log('ADMIN PASS');await page.evaluate(()=>navigate('profileScreen'));await page.waitForTimeout(350);report.badges=await page.evaluate(()=>DEEN_BADGE_AUDIT.run());assert(report.badges.pass);assert.equal(report.badges.achievement.profile.cards,10);
 console.log('BADGES PASS');const verseRows=await page.evaluate(()=>DEEN_QURAN_CONTENT.inventory().map(x=>DEEN_QURAN_CONTENT.getAyah(x.surah_id,x.ayah_number)));assert.equal(verseRows.length,90);assert(verseRows.every(Boolean));report.verses=verseRows.length;const verseBefore=JSON.stringify(verseRows);
 await page.evaluate(()=>{DEEN_QURAN.openSurah('fatiha');DEEN_QURAN_JOURNEY_V2.startStage('learn')});
 const beforeText=await page.locator('.deen-ikhlas-arabic').last().innerText();assert(await page.evaluate(()=>DEEN_QURAN_AYAH_AUDIO.play(1,'fatiha')));
 await page.waitForTimeout(1800);report.wordSync=await page.evaluate(()=>{DEEN_QURAN_AYAH_AUDIO.syncText();const el=[...document.querySelectorAll('.deen-ikhlas-arabic')].find(x=>x.dataset.deenAudioSync==='1');return {mode:el?.dataset.syncMode,words:el?.querySelectorAll('.deen-ayah-sync-word').length,current:el?.querySelectorAll('.deen-ayah-sync-word.current').length,text:[...el.querySelectorAll('.deen-ayah-sync-word')].map(w=>w.textContent).join(' ')}});assert.equal(report.wordSync.mode,'weighted');assert.equal(report.wordSync.current,1);assert.equal(report.wordSync.text,beforeText.trim());await page.evaluate(()=>{DEEN_QURAN_AYAH_AUDIO.stop();closeSheet()});
 const verseAfter=await page.evaluate(()=>JSON.stringify(DEEN_QURAN_CONTENT.inventory().map(x=>DEEN_QURAN_CONTENT.getAyah(x.surah_id||x.surah,x.ayah_number||x.number))));assert.equal(verseAfter,verseBefore);report.verseDataUnchanged=true;
 console.log('SYNC PASS'); // One full native lesson: real rendered answers and continue buttons, then native rewards.
 await page.evaluate(()=>{closeLesson();state.energy=30;startStage('U01-S01')});
 const rewardBefore=await page.evaluate(()=>({xp:state.xp,currency:state.currency,completed:[...state.completed]}));let answered=0;
 while(await page.evaluate(()=>!!session&&session.index<session.questions.length)&&await page.locator('#quizView:visible').count()){
  await page.waitForTimeout(350);if(await page.locator('.v910-overlay .v910-card-button').count())await page.locator('.v910-overlay .v910-card-button').click();
  const q=await page.evaluate(()=>session.questions[session.index]),area=page.locator('#answerArea');
  if(q.activity_type==='matching'){for(let i=0;i<q.pairs.length;i++){await area.locator('[data-side="left"][data-pair="'+i+'"]').click();await area.locator('[data-side="right"][data-pair="'+i+'"]').click()}}
  else if(q.items?.length){for(const text of q.correct_order)await area.locator('.sequence-bank,.v710-word-bank').getByRole('button',{name:text,exact:true}).first().click();await area.locator('button:not([disabled])').filter({hasText:/check|verify|confirm|submit/i}).last().click()}
  else if(await area.locator('input:visible').count()){await area.locator('input:visible').fill(q.correct_answer);await area.locator('button:not([disabled])').last().click()}
  else{await page.evaluate(answer=>{const b=[...document.querySelectorAll('#answerArea button')].find(x=>x.dataset.value===answer||(x.querySelector('.option-label')?.textContent||x.textContent).trim()===answer);if(b)b.dataset.qaAnswer='1'},q.correct_answer);await area.locator('[data-qa-answer]').click();if(!await page.locator('#feedback.show').count()){const c=area.locator('.v710-action:not([disabled]),.template-action:not([disabled])').last();if(await c.count())await c.click()}}
  await page.waitForSelector('#feedback.show');const previous=await page.evaluate(()=>session.index);await page.locator('#continueBtn').click();await page.waitForFunction(i=>!session||session.index>i||document.getElementById('resultView').classList.contains('show'),previous);answered++;console.log('ANSWERED',answered);assert(answered<60);
 }

 // Assert the real, short-lived result toast (not just a dictionary lookup).
 await page.locator('.deen-fx-banner').last().waitFor({state:'visible',timeout:5000});
 await page.waitForTimeout(160);
 report.resultToast=await page.locator('.deen-fx-banner').last().innerText();
 assert(/stage.*(complete|unlocked)/i.test(report.resultToast),'New stage toast did not translate: '+report.resultToast);
 assert(!/(?:artık|bitti|düğüm|açıldı|sıradaki|aşama|ders|yeni)/i.test(report.resultToast),'Turkish result toast: '+report.resultToast);
 const expectedResultCopy={
  "Meet Islam artık bitti. Sıradaki düğüm açıldı.": "Meet Islam is complete. The next stage is unlocked.",
  "Who Is a Muslim? artık oynanabilir.": "Who Is a Muslim? is now available.",
  "Sıradaki aşama · Who Is a Muslim?": "Next stage · Who Is a Muslim?",
  "Sonraki mini ders · Hatırla": "Next mini lesson · Recall",
  "3 derslik bu aşamada 2/3 ilerlemedesin.": "You have completed 2 of 3 mini lessons in this stage.",
  "Ders 2/3": "Lesson 2/3",
  "Görevler 0/3 · Haftalık ritim 1/5 gün": "Daily tasks 0/3 · Weekly rhythm 1/5 days",
  "Görevler 2/3 · Haftalık ritim 4/5 gün · 1 tekrar": "Daily tasks 2/3 · Weekly rhythm 4/5 days · 1 review",
  "1 soru tekrar bekliyor.": "1 question is due for review.",
  "5 soru tekrar bekliyor.": "5 questions are due for review.",
  "AŞAMA ÖĞRENME DÖNGÜSÜ": "STAGE LEARNING CYCLE",
  "Bu mini dersi %70 ve üzeri ile geçmen gerekiyor.": "You need at least 70% to pass this mini lesson.",
  "Bir tur daha": "Try again",
  "Yeni ders açıldı": "New stage unlocked",
  "Altın performans": "Gold performance",
  "FİNAL KAPISINA GİT": "GO TO THE FINAL",
  "SIRADA NE VAR?": "WHAT'S NEXT?",
  "İbadet Temelleri Ustalığı hazır.": "Foundations of Worship mastery is ready.",
  "25 soru · 0 enerji · %80 geçiş.": "25 questions · 0 energy · 80% to pass.",
  "BUGÜN TAMAM": "DONE FOR TODAY"
};
 for(const [source,expected] of Object.entries(expectedResultCopy)){
  const actual=await page.evaluate(value=>DEEN_ENGLISH_UI.t(value),source);
  assert.equal(actual,expected,'English result/transition copy: '+source);
 }
 console.log('PASS ENGLISH RESULT FLOW',JSON.stringify({liveToast:report.resultToast,translations:Object.keys(expectedResultCopy).length}));
 await page.waitForTimeout(1400);report.result=await page.locator('#resultView').innerText();report.rewards=await page.evaluate(()=>({xp:state.xp,currency:state.currency,completed:[...state.completed]}));report.answered=answered;assert(answered>0);assert(report.rewards.xp>rewardBefore.xp);assert(report.rewards.completed.includes('U01-S01'));
 assert(!/[ÇĞİÖŞÜçğıöşü]|\b(?:Ders|Soru|Devam|Doğru|Ödül|DENE)\b/.test(report.result),report.result);
 assert(/Daily tasks 0\/3 · Weekly rhythm 1\/5 days/.test(report.result),'English daily-summary spacing regression: '+report.result.slice(-850));
 assert(/Next stage/i.test(report.result),'Result next-stage CTA missing');
 assert(!/SIRADAKİ EN İYİ ADIM|Bu aşamadaki/.test(report.result),'Turkish bottom result copy');

 report.visibleNextCards=await page.locator('#resultView .v624-next-card:visible, #resultView .v680-result-next:visible').count();
 assert.equal(report.visibleNextCards,1,'Duplicate visible next-step cards in English result');
 assert.equal((report.result.match(/YOUR BEST NEXT STEP/g)||[]).length,1,'Repeated next-step heading in English result');
 await page.locator('#resultView .v680-result-next').screenshot({path:path.join(out,'english-result-next-step.png')});
 for(const [source,expected] of Object.entries({
   'Ders öğrenildi':'Lesson completed',
   'Tekrarlarla tamamlanan':'Correct by lesson end',
   'Önce bu adımı sağlamlaştır.':'Strengthen this step before moving on.',
   'Aşama tamamlandı. Yeni düğüm açıldı.':'Stage complete. A new stage has unlocked.',
   'Geçiş için %70 gerekiyor. Aynı atanmış soru seti korunacak; yeni first-pass içerik tüketilmeyecek.':'You need at least 70% to advance. The same question set will be reused without consuming new first-pass content.'
 })){
   assert.equal(await page.evaluate(v=>DEEN_ENGLISH_UI.t(v),source),expected,'Next-action English: '+source);
 }
 console.log('PASS RESULT NEXT STEP',JSON.stringify({visibleCards:report.visibleNextCards,repeatedHeadings:0}));
await page.screenshot({path:path.join(out,'english-result.png')});
 await page.evaluate(()=>{finishLesson();state.energy=10;rewardAd()});report.energy=await page.evaluate(()=>state.energy);assert.equal(report.energy,20);
 await page.reload();await page.waitForFunction(()=>window.DEEN_BOOT?.isReady());assert.equal(await page.evaluate(()=>state.xp),report.rewards.xp);assert(await page.evaluate(()=>state.completed.includes('U01-S01')));report.persisted=true;
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'regression-report.json'),JSON.stringify(report,null,2));console.log('PASS REGRESSION',JSON.stringify(report));await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
