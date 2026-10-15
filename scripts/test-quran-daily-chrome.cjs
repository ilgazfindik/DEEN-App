/* DEEN phase 11: real Chromium test of personalized daily planning, not synthetic completion. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="surahOriginal">Existing Quran</button></div></div></div></body></html>';
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
  for(const name of ['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-weekly-goals.js','quran-arabic-paths.js'])
   await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  const pure=await page.evaluate(()=>{
   const a=DEEN_ARABIC_DAILY;
   const day=a.localDay(new Date('2026-10-16T12:00:00')),other=a.localDay(new Date('2026-10-17T12:00:00'));
   const sample=a.mark(null,'lesson','lesson-one',day),again=a.mark(sample,'lesson','lesson-one',day);
   const next=a.normalizeActivity(sample,other);
   const cases=[5,10,15].map(minutes=>a.suggest({day,minutes,activity:sample,
    lessons:[{id:'lesson-two',index:12,unlocked:true,completed:false}],
    due:['card-a','card-b'],weak:['card-c']}));
   return {version:DEEN_QURAN_PATHS.version,total:DEEN_QURAN_PATHS.status().overallLessonCount,
    day,other,marks:again.lessons,next,quota:cases.map(p=>({minutes:p.minutes,lessonQuota:p.lessonQuota,reviewQuota:p.reviewQuota})),
    nonsense:a.safeMinutes(-1),empty:a.suggest({day,minutes:10,lessons:[],due:[],weak:[]})};
  });
  assert.equal(pure.version,'quran-arabic-paths-phase17');
  assert.equal(pure.total,27);
  assert.notEqual(pure.day,pure.other);
  assert.deepEqual(pure.marks,['lesson-one']);
  assert.deepEqual(pure.next.lessons,[]);
  assert.deepEqual(pure.quota,[{minutes:5,lessonQuota:1,reviewQuota:2},{minutes:10,lessonQuota:1,reviewQuota:3},{minutes:15,lessonQuota:2,reviewQuota:3}]);
  assert.equal(pure.nonsense,10);
  assert.equal(pure.empty.total,0);
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.locator('.deen-path-daily-teaser').count(),1);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_daily_activity_v1')),null,'Daily panel must not invent completed tasks');
  await page.locator('[data-qpath-action="daily"]').click();
  assert.equal(await page.locator('.deen-path-daily-screen').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().daily.minutes),10);
  await page.locator('[data-qpath-action="dailyMinutes"][data-minutes="15"]').click();
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().daily.minutes),15);
  assert.equal(await page.locator('.deen-path-daily-choice.is-selected').count(),1);
  await page.locator('[data-qpath-action="dailyMinutes"][data-minutes="10"]').click();
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().daily.minutes),10);
  // Last incomplete pattern lesson + actual review due. Phase 6 recitation remains locked.
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_reading_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_READING.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_words_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_WORDS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_meaning_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_MEANING.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_phrases_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_PHRASES.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_patterns_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_PATTERNS.lessons.slice(0,2).map(x=>x.id)}));
   const card=DEEN_ARABIC_PHRASES.cardIds[0];
   localStorage.setItem('deen_arabic_written_review_v1',JSON.stringify({schema:1,cards:{[card]:{step:1,dueAt:Date.now()-3000,lastResult:'good',mistakes:1,attempts:2}}}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  assert.equal(await page.locator('.deen-path-listening-item:disabled').count(),2);
  await page.locator('[data-qpath-action="daily"]').click();
  const suggested=await page.evaluate(()=>DEEN_QURAN_PATHS.status().daily);
  assert.deepEqual([suggested.nextLesson.index,suggested.lessonQuota,suggested.reviewQuota,suggested.completed,suggested.total],[26,1,1,0,2]);
  assert.equal(await page.locator('[data-qpath-action="dailyLesson"]').count(),1);
  await page.locator('[data-qpath-action="dailyLesson"]').click();
  await page.locator('[data-qpath-action="start"]').click();
  const items=await page.evaluate(()=>DEEN_ARABIC_PATTERNS.lessons[2].items.map(x=>x.id));
  for(const id of items){
   await page.locator('[data-qpath-action="answer"][data-letter-id="'+id+'"]').click();
   assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
   await page.locator('[data-qpath-action="next"]').click();
  }
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  const journal=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_daily_activity_v1')));
  assert.deepEqual(journal.lessons,[ 'arabic-pattern-structure-01' ]);
  assert.deepEqual(journal.reviews,[]);
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="daily"]').click();
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().daily.completed),1);
  assert.equal(await page.locator('[data-qpath-action="startReview"]').count(),1);
  await page.locator('[data-qpath-action="startReview"]').click();
  const cardId=await page.evaluate(()=>DEEN_ARABIC_PHRASES.cardIds[0]);
  await page.locator('[data-qpath-action="reviewAnswer"][data-letter-id="'+cardId+'"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
  await page.locator('[data-qpath-action="reviewNext"]').click();
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="daily"]').click();
  const finished=await page.evaluate(()=>DEEN_QURAN_PATHS.status().daily);
  assert.deepEqual([finished.lessonDone,finished.reviewDone,finished.completed,finished.total,finished.completionPct],[1,1,2,2,100]);
  assert.equal(await page.locator('.deen-path-daily-done').count(),1);
  assert.equal(await page.locator('[data-qpath-action="dailyLesson"]').count(),0);
  const end=await page.evaluate(()=>({
   activity:JSON.parse(localStorage.getItem('deen_arabic_daily_activity_v1')),
   patterns:JSON.parse(localStorage.getItem('deen_arabic_patterns_v1')).completed.length,
   audio:localStorage.getItem('deen_arabic_listening_v1')
  }));
  assert.deepEqual(end.activity.reviews,[cardId]);assert.equal(end.patterns,3);assert.equal(end.audio,null);
  for(const lang of ['tr','en','ar','de','fr']){
   await page.evaluate(lang=>{document.documentElement.lang=lang;DEEN_QURAN_PATHS.enterArabic()},lang);
   await page.locator('[data-qpath-action="daily"]').click();
   assert.ok((await page.locator('.deen-path-daily-screen h2').innerText()).length>4);
   assert.equal(await page.locator('.deen-path-daily-choice').count(),3);
   assert.ok((await page.locator('.deen-path-daily-breakdown').innerText()).length>8);
  }
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="mastery"]').click();
  assert.equal(await page.locator('.deen-path-mastery-screen').count(),1);
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="home"]').click();
  await page.locator('[data-qpath-action="surah"]').click();
  assert.equal(await page.locator('#surahOriginal').count(),1);
  assert.deepEqual(errors,[]);
  console.log('PASS QURAN DAILY PHASE11: 5/10/15-minute goals, genuine lesson and review activity, next-day rollover, five locales, intact mastery and surahs');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
