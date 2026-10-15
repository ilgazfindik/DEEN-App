/* DEEN Phase 16: real Chromium coverage of seven-day activity and truthful trends. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="originalSurah">Original Quran Lessons</button></div></div></div></body></html>';
const server=http.createServer((_,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:375,height:812}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port);
  await page.evaluate(()=>window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang});
  await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
  for(const file of ['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-paths.js'])
   await page.addScriptTag({path:path.join(root,'assets/i18n',file)});
  const pure=await page.evaluate(()=>{
   const W=DEEN_ARABIC_WEEKLY,now=new Date(2026,9,16,12),day1=new Date(2026,9,14,12),
    day2=new Date(2026,9,15,12),old=new Date(2026,9,3,12);
   const entries=[
    ['lesson','first',day1],['lesson','first',day1],['review','card-a',day1],
    ['review','card-b',day2],['review','card-b',day2],['lesson','too-old',old]
   ];
   let journal=null;for(const [type,id,when] of entries)journal=W.record(journal,type,id,when);
   const daily={day:'2026-10-16',lessons:['today-lesson','today-lesson'],reviews:['today-review']};
   const scores={attempts:[
    {at:new Date(2026,9,12,12).getTime(),correct:8},
    {at:new Date(2026,9,15,12).getTime(),correct:13}
   ]};
   const summary=W.summarize(journal,daily,scores,now);
   const duplicateToday=W.record(journal,'lesson','today-lesson',now);
   const dedup=W.summarize(duplicateToday,daily,scores,now);
   return {version:DEEN_QURAN_PATHS.version,total:DEEN_QURAN_PATHS.status().overallLessonCount,
    journal,summary,duplicate:dedup.lessonCount,keys:W.weekDays(now),bad:W.clean({schema:1,days:{'2026-02-30':{lessons:['false']},'2026-10-16':{reviews:['real','real']}}}),
    invalid:W.record(journal,'bogus','not-real',now)};
  });
  assert.equal(pure.version,'quran-arabic-paths-phase16');assert.equal(pure.total,27);
  assert.deepEqual(pure.keys,['2026-10-10','2026-10-11','2026-10-12','2026-10-13','2026-10-14','2026-10-15','2026-10-16']);
  assert.equal(pure.summary.lessonCount,2);assert.equal(pure.summary.reviewCount,3);
  assert.equal(pure.summary.activeDays,4);assert.equal(pure.summary.assessmentCount,2);
  assert.equal(pure.summary.scoreChange,5);assert.equal(pure.duplicate,2);
  assert.equal(pure.summary.days[0].active,false);assert.equal(pure.summary.days.length,7);
  assert.equal(pure.journal.days['2026-10-14'].lessons.length,1);
  assert.equal(pure.journal.days['2026-10-15'].reviews.length,1);
  assert.equal(Object.keys(pure.bad.days).length,1);
  assert.deepEqual(pure.invalid.days,pure.journal.days);
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.locator('.deen-path-weekly-link').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().weekly.lessonCount),0);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_weekly_activity_v1')),null);
  // Older completed lessons do not get invented dates; today's existing journal is valid.
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().weekly.activeDays),0);
  await page.locator('[data-qpath-action="weekly"]').click();
  assert.equal(await page.locator('.deen-path-weekly-day').count(),7);
  assert.equal(await page.locator('.deen-path-weekly-history .deen-path-muted').count(),1);
  await page.locator('[data-qpath-action="arabic"]').click();
  // Seed all prior lessons except last patterns stage, then finish that stage through real UI.
  await page.evaluate(()=>{
   const data=[
    ['deen_arabic_harakat_v1',DEEN_ARABIC_HARAKAT.lessons],
    ['deen_arabic_reading_v1',DEEN_ARABIC_READING.lessons],
    ['deen_arabic_words_v1',DEEN_ARABIC_WORDS.lessons],
    ['deen_arabic_meaning_v1',DEEN_ARABIC_MEANING.lessons],
    ['deen_arabic_phrases_v1',DEEN_ARABIC_PHRASES.lessons],
    ['deen_arabic_patterns_v1',DEEN_ARABIC_PATTERNS.lessons.slice(0,2)]
   ];
   for(const [key,lessons] of data)localStorage.setItem(key,JSON.stringify({schema:1,completed:lessons.map(x=>x.id)}));
   const id=DEEN_ARABIC_PHRASES.cardIds[0];
   localStorage.setItem('deen_arabic_written_review_v1',JSON.stringify({schema:1,cards:{
    [id]:{step:1,dueAt:Date.now()-2000,mistakes:1,attempts:2,lastResult:'good'}
   }}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  await page.evaluate(()=>{DEEN_QURAN_PATHS.selectGroup(26);DEEN_QURAN_PATHS.start()});
  const ids=await page.evaluate(()=>DEEN_ARABIC_PATTERNS.lessons[2].items.map(x=>x.id));
  for(const id of ids){await page.locator('[data-qpath-action="answer"][data-letter-id="'+id+'"]').click();await page.locator('[data-qpath-action="next"]').click();}
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="daily"]').click();
  await page.locator('[data-qpath-action="startReview"]').click();
  const card=await page.evaluate(()=>DEEN_ARABIC_PHRASES.cardIds[0]);
  await page.locator('[data-qpath-action="reviewAnswer"][data-letter-id="'+card+'"]').click();
  await page.locator('[data-qpath-action="reviewNext"]').click();
  const result=await page.evaluate(()=>({
   weekly:DEEN_QURAN_PATHS.status().weekly,
   journal:JSON.parse(localStorage.getItem('deen_arabic_weekly_activity_v1')),
   daily:JSON.parse(localStorage.getItem('deen_arabic_daily_activity_v1')),
   audio:localStorage.getItem('deen_arabic_listening_v1')
  }));
  assert.equal(result.weekly.lessonCount,1);assert.equal(result.weekly.reviewCount,1);
  assert.equal(result.weekly.activeDays,1);
  const today=await page.evaluate(()=>DEEN_ARABIC_WEEKLY.dayKey());
  assert.deepEqual(result.journal.days[today].lessons,['arabic-pattern-structure-01']);
  assert.deepEqual(result.journal.days[today].reviews,[card]);
  assert.equal(result.daily.lessons.length,1);assert.equal(result.audio,null);
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="weekly"]').click();
  assert.equal(await page.locator('.deen-path-weekly-stat').count(),4);
  assert.equal(await page.locator('.deen-path-weekly-day').count(),7);
  assert.equal(await page.locator('.deen-path-weekly-history .deen-path-muted').count(),0);
  // Save two real-format historical assessments; weekly exam displays only actual timestamps.
  await page.evaluate(()=>{
   const X=DEEN_ARABIC_CHECKPOINT,q0=X.build(0),q1=X.build(1);
   const a=X.summarize(q0,q0.map((v,i)=>({id:v.id,correct:i%4!==0})),Date.now()-86400000);
   const b=X.summarize(q1,q1.map((v,i)=>({id:v.id,correct:i%4<2})),Date.now());
   localStorage.setItem('deen_arabic_checkpoint_v1',JSON.stringify(X.save(X.save(null,a),b)));
   DEEN_QURAN_PATHS.enterArabic();
  });
  await page.locator('[data-qpath-action="weekly"]').click();
  assert.equal(await page.locator('.deen-path-weekly-examrow').count(),2);
  assert.match(await page.locator('.deen-path-weekly-delta').innerText(),/-5/);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().weekly.assessmentCount),2);
  for(const language of ['tr','en','ar','de','fr']){
   await page.evaluate(language=>{document.documentElement.lang=language;DEEN_QURAN_PATHS.enterArabic()},language);
   await page.locator('[data-qpath-action="weekly"]').click();
   assert.ok((await page.locator('.deen-path-weekly-screen h2').innerText()).length>4);
   assert.equal(await page.locator('.deen-path-weekly-day').count(),7);
   assert.equal(await page.locator('.deen-path-weekly-stat').count(),4);
  }
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="home"]').click();
  await page.locator('[data-qpath-action="surah"]').click();
  assert.equal(await page.locator('#originalSurah').count(),1);
  assert.deepEqual(errors,[]);
  console.log('PASS QURAN WEEKLY PHASE16: seven local calendar days, honest journal, real lesson/review events, checkpoint trend, 5 locales, intact Quran route');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
