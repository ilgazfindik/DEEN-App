/* DEEN Arabic phase 12 QA: evidence-based reinforcement without fabricated results. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="surahOriginal">Existing surahs</button></div></div></div></body></html>';
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
   const a=DEEN_ARABIC_ADAPTIVE,id=DEEN_ARABIC_PHRASES.cardIds[0],id2=DEEN_ARABIC_PATTERNS.cardIds[0];
   const one=a.recordLesson(null,{lessonId:'arabic-test',questions:4,missedIds:[id,id,'non-reviewable'],at:1000});
   const clean1=a.recordLesson(one,{lessonId:'arabic-test',questions:4,missedIds:[],at:2000});
   const clean2=a.recordLesson(clean1,{lessonId:'arabic-test-two',questions:3,missedIds:[],at:3000});
   const ranked=a.suggest({history:one,reviewCards:{
    [id]:{step:0,mistakes:2,dueAt:400},[id2]:{step:1,mistakes:9,dueAt:100}
   },now:2000,nextLesson:{id:'next',index:26,unlocked:true}});
   const advanced=a.suggest({history:clean2,reviewCards:{},now:4000,nextLesson:{id:'next',index:26,unlocked:true}});
   const blocked=a.suggest({history:clean2,reviewCards:{},now:4000,nextLesson:{id:'locked',index:16,unlocked:false}});
   return {version:DEEN_QURAN_PATHS.version,overall:DEEN_QURAN_PATHS.status().overallLessonCount,
    cardTotal:a.cardIds.length,one,clean1,clean2,ranked,advanced,blocked,
    invalid:a.clean({lastLesson:'oops',sessions:{'__proto__':{attempts:5}}}).lastLesson
   };
  });
  assert.equal(pure.version,'quran-arabic-paths-phase16');
  assert.equal(pure.overall,27);assert.equal(pure.cardTotal,15);
  assert.equal(pure.one.sessions['arabic-test'].lastMistakes,2);
  assert.deepEqual(pure.one.sessions['arabic-test'].missedCardIds.slice(),[await page.evaluate(()=>DEEN_ARABIC_PHRASES.cardIds[0])]);
  assert.equal(pure.clean1.globalCleanStreak,1);assert.equal(pure.clean2.globalCleanStreak,2);
  assert.equal(pure.ranked.mode,'reinforce');assert.equal(pure.ranked.cards.length,2);
  assert.equal(pure.ranked.cards[0],await page.evaluate(()=>DEEN_ARABIC_PHRASES.cardIds[0]));
  assert.equal(pure.advanced.mode,'advance');assert.equal(pure.advanced.nextLesson.index,26);
  assert.equal(pure.blocked.nextLesson,null);assert.equal(pure.invalid,null);
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="daily"]').click();
  assert.equal(await page.locator('.deen-path-adaptive-section').count(),1);
  assert.equal(await page.locator('[data-qpath-action="startAdaptive"]').count(),0);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_adaptive_v1')),null,'Do not fabricate a lesson history');
  // An existing phase-11 learner with all prior written lessons finished.
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_reading_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_READING.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_words_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_WORDS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_meaning_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_MEANING.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_phrases_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_PHRASES.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_patterns_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_PATTERNS.lessons.slice(0,2).map(x=>x.id)}));
   const due=DEEN_ARABIC_PHRASES.cardIds[1];
   localStorage.setItem('deen_arabic_written_review_v1',JSON.stringify({schema:1,cards:{[due]:{step:0,dueAt:Date.now()-2000,mistakes:2,lastResult:'again',attempts:3}}}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  const reviewBefore=await page.evaluate(()=>localStorage.getItem('deen_arabic_written_review_v1'));
  await page.locator('.deen-path-pattern-item[data-lesson-index="26"]').click();
  await page.locator('[data-qpath-action="start"]').click();
  const ids=await page.evaluate(()=>DEEN_ARABIC_PATTERNS.lessons[2].items.map(x=>x.id));
  await page.locator('[data-qpath-action="answer"][data-letter-id="'+ids[1]+'"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
  await page.locator('[data-qpath-action="answer"][data-letter-id="'+ids[0]+'"]').click();
  await page.locator('[data-qpath-action="next"]').click();
  for(const id of ids.slice(1)){await page.locator('[data-qpath-action="answer"][data-letter-id="'+id+'"]').click();await page.locator('[data-qpath-action="next"]').click();}
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  const after=await page.evaluate(()=>({status:DEEN_QURAN_PATHS.status(),history:JSON.parse(localStorage.getItem('deen_arabic_adaptive_v1'))}));
  assert.equal(after.status.adaptive.lastMistakes,1);
  assert.equal(after.status.adaptive.lastQuestions,4);
  assert.equal(after.status.adaptive.available,1);
  assert.equal(after.history.sessions['arabic-pattern-structure-01'].lastMistakes,1);
  assert.equal(await page.locator('[data-qpath-action="startAdaptive"]').count(),1);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_written_review_v1')),reviewBefore,'Lesson-structure errors must not forge vocabulary review records');
  await page.locator('[data-qpath-action="startAdaptive"]').click();
  assert.equal(await page.locator('.deen-path-review-lesson').count(),1);
  const card=await page.evaluate(()=>DEEN_ARABIC_PHRASES.cardIds[1]);
  await page.locator('[data-qpath-action="reviewAnswer"][data-letter-id="'+card+'"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
  await page.locator('[data-qpath-action="reviewNext"]').click();
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  const completeText=await page.locator('.deen-path-completion h2').innerText();
  assert.match(completeText,/Pekiştirme/);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().adaptive.available),0,'Successfully reinforced cards should not loop before their next due date');
  const saved=await page.evaluate(()=>({daily:JSON.parse(localStorage.getItem('deen_arabic_daily_activity_v1')),
   audio:localStorage.getItem('deen_arabic_listening_v1'),
   pattern:JSON.parse(localStorage.getItem('deen_arabic_patterns_v1')).completed.length}));
  assert.deepEqual(saved.daily.reviews,[card]);
  assert.equal(saved.pattern,3);assert.equal(saved.audio,null);
  for(const lang of ['tr','en','de','fr','ar']){
   await page.evaluate(l=>{document.documentElement.lang=l;DEEN_QURAN_PATHS.enterArabic()},lang);
   await page.locator('[data-qpath-action="daily"]').click();
   assert.equal(await page.locator('.deen-path-adaptive-section').count(),1);
   assert.ok((await page.locator('.deen-path-adaptive-section h3').innerText()).length>5);
  }
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="mastery"]').click();assert.equal(await page.locator('.deen-path-mastery-screen').count(),1);
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="home"]').click();await page.locator('[data-qpath-action="surah"]').click();
  assert.equal(await page.locator('#surahOriginal').count(),1);
  assert.deepEqual(errors,[]);
  console.log('PASS QURAN ADAPTIVE PHASE12: real first-try mistakes, 3-card recommendations, focused review, no forged audio, 5 locales, intact prior courses');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
