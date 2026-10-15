/* DEEN Phase 10: real Chrome coverage for local-only Arabic mastery dashboard */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="surahOriginal">Existing Quran view</button></div></div></div></body></html>';
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
  for(const file of ['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-paths.js'])
   await page.addScriptTag({path:path.join(root,'assets/i18n',file)});
  const info=await page.evaluate(()=>{
   const module=DEEN_ARABIC_MASTERY;
   const now=Date.UTC(2026,9,16,12);
   const ids=module.cardList.map(c=>c.id),records={};
   records[ids[0]]={step:3,dueAt:now+86400000,lastResult:'good',mistakes:0,attempts:3};
   records[ids[1]]={step:0,dueAt:now-1,lastResult:'again',mistakes:4,attempts:5};
   records[ids[2]]={step:1,dueAt:now+3*86400000,lastResult:'good'};
   records['arbitrary-malicious-id']={step:5,dueAt:0,mistakes:999};
   const before=JSON.stringify(records);
   const s=module.analyze({cards:records},7,25,now);
   return {version:DEEN_QURAN_PATHS.version,overall:DEEN_QURAN_PATHS.status().overallLessonCount,
    groups:module.groups.map(g=>g.cards.length),ids:ids.length,unchanged:JSON.stringify(records)===before,
    total:s.total,practiced:s.practiced,due:s.due,weak:s.weak,levels:s.levels,lessonCompleted:s.lessonCompleted,
    nextDueAt:s.nextDueAt,topic:s.groupSummary[0],known:module.analyze({cards:{malformed:{step:100}}},0,25,now).practiced};
  });
  assert.equal(info.version,'quran-arabic-paths-phase10');
  assert.equal(info.overall,27);
  assert.equal(info.ids,15);assert.deepEqual(info.groups,[4,3,4,4]);
  assert.equal(info.unchanged,true);
  assert.deepEqual([info.total,info.practiced,info.due,info.weak,info.lessonCompleted],[15,3,1,1,7]);
  assert.deepEqual(info.levels,{notStarted:12,needsPractice:1,learning:1,strengthening:1});
  assert.equal(info.topic.total,4);assert.equal(info.topic.practiced,3);
  assert.equal(info.known,0);
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.locator('.deen-path-mastery-teaser').count(),1);
  await page.locator('[data-qpath-action="mastery"]').click();
  assert.equal(await page.locator('.deen-path-mastery-screen').count(),1);
  assert.equal(await page.locator('.deen-path-mastery-metric').count(),4);
  assert.equal(await page.locator('.deen-path-mastery-card').count(),15);
  assert.equal(await page.locator('.deen-path-mastery-topic').count(),4);
  assert.equal(await page.locator('[data-qpath-action="masteryContinue"]').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().mastery.lessonTotal),25);
  await page.locator('[data-qpath-action="masteryFilter"][data-filter="new"]').click();
  assert.equal(await page.locator('.deen-path-mastery-card').count(),15);
  assert.equal(await page.locator('[data-qpath-action="masteryFilter"][aria-pressed="true"]').count(),1);
  await page.locator('[data-qpath-action="masteryContinue"]').click();
  assert.equal(await page.locator('.deen-path-course-item-top').count(),0); // group view is a lesson landing
  await page.locator('[data-qpath-action="arabic"]').click();
  // Previous phase-9 learner with existing review rows; mastery derives from them without writes.
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_reading_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_READING.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_words_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_WORDS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_meaning_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_MEANING.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_phrases_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_PHRASES.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_patterns_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_PATTERNS.lessons.map(x=>x.id)}));
   const oldId=DEEN_ARABIC_PHRASES.cardIds[0],newId=DEEN_ARABIC_PATTERNS.cardIds[0],now=Date.now();
   const cards={};
   cards[oldId]={step:4,dueAt:now+4*86400000,lastResult:'good',mistakes:0,attempts:6};
   cards[newId]={step:0,dueAt:now-60000,lastResult:'again',mistakes:3,attempts:4};
   localStorage.setItem('deen_arabic_written_review_v1',JSON.stringify({schema:1,cards,updatedAt:now}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  const savedBefore=await page.evaluate(()=>localStorage.getItem('deen_arabic_written_review_v1'));
  await page.locator('[data-qpath-action="mastery"]').click();
  assert.equal(await page.locator('.deen-path-mastery-card').count(),15);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().mastery.lessonCompleted),25);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().mastery.practiced),2);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().mastery.due),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().mastery.weak),1);
  assert.equal(await page.locator('[data-qpath-action="masteryContinue"]').count(),0);
  assert.equal(await page.locator('[data-qpath-action="startReview"]').count(),1);
  assert.equal(await page.locator('[data-qpath-action="startWeakReview"]').count(),1);
  await page.locator('[data-qpath-action="masteryFilter"][data-filter="due"]').click();
  assert.equal(await page.locator('.deen-path-mastery-card').count(),1);
  await page.locator('[data-qpath-action="masteryFilter"][data-filter="weak"]').click();
  assert.equal(await page.locator('.deen-path-mastery-card').count(),1);
  await page.locator('[data-qpath-action="masteryFilter"][data-filter="new"]').click();
  assert.equal(await page.locator('.deen-path-mastery-card').count(),13);
  await page.locator('[data-qpath-action="masteryFilter"][data-filter="all"]').click();
  assert.equal(await page.locator('.deen-path-mastery-card').count(),15);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_written_review_v1')),savedBefore,'Mastery view must never modify stored practice data');
  for(const lang of ['tr','en','ar','de','fr']){
   await page.evaluate(code=>{document.documentElement.lang=code;DEEN_QURAN_PATHS.enterArabic()},lang);
   await page.locator('[data-qpath-action="mastery"]').click();
   assert.ok((await page.locator('.deen-path-mastery-screen h2').innerText()).length>5);
   assert.equal(await page.locator('.deen-path-mastery-card').count(),15);
   assert.ok((await page.locator('.deen-path-mastery-word-copy').first().innerText()).length>5);
  }
  await page.locator('[data-qpath-action="masteryBack"]').count().then(x=>assert.equal(x,0));
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.locator('.deen-path-mastery-teaser').count(),1);
  await page.locator('[data-qpath-action="home"]').click();
  await page.locator('[data-qpath-action="surah"]').click();
  assert.equal(await page.locator('#surahOriginal').count(),1);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_listening_v1')),null);
  assert.deepEqual(errors,[]);
  console.log('PASS QURAN MASTERY PHASE10: 15 honest review cards, 25 written lessons, 5 locales, due/weak/new filters, nonmutating legacy progress, surah safety');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
