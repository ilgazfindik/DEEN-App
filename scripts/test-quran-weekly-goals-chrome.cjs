/* Phase 17: calendar-week goals, genuine rewards, no XP mutations, real browser flows. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="originalSurah">Existing Quran</button></div></div></div></body></html>';
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
  const boot=['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-weekly-goals.js','quran-arabic-paths.js'];
  for(const file of boot)await page.addScriptTag({path:path.join(root,'assets/i18n',file)});
  const pure=await page.evaluate(()=>{
   const G=DEEN_ARABIC_WEEKLY_GOALS,W=DEEN_ARABIC_WEEKLY;
   const now=new Date(2026,9,18,12);
   const dates=G.span(now);
   let history=null;
   for(let i=0;i<4;i++){
    const date=new Date(2026,9,5+i,12);
    history=W.record(history,'lesson','earlier-'+i,date);
    if(i<2)history=W.record(history,'review','review-'+i,date);
   }
   const previous=G.build({journal:history,now,remainingWritten:8,reviewEligible:true});
   for(let i=0;i<6;i++){
    const date=new Date(2026,9,12+i,12);
    history=W.record(history,'lesson','current-'+i,date);
    if(i<3)history=W.record(history,'review','correct-'+i,date);
   }
   const current=G.build({journal:history,now,remainingWritten:8,reviewEligible:true});
   const award=G.syncAwards(null,current);
   const duplicate=G.syncAwards(award,current);
   const next=G.build({journal:history,now:new Date(2026,9,19,12),remainingWritten:7,reviewEligible:false});
   const rolled=G.syncAwards(duplicate,next);
   const baseline=G.build({now:new Date(2026,9,18,12),remainingWritten:0,reviewEligible:false});
   const leap=G.span(new Date(2027,0,1,12));
   const dst=G.span(new Date(2027,2,28,12));
   return {version:DEEN_QURAN_PATHS.version,lessonSlots:DEEN_QURAN_PATHS.status().overallLessonCount,
    dates,previous,current,award,duplicate,rolled,next,baseline,leap,dst};
  });
  assert.equal(pure.version,'quran-arabic-paths-phase17');
  assert.equal(pure.lessonSlots,27);
  assert.deepEqual([pure.dates.start,pure.dates.end,pure.dates.previousStart,pure.dates.previousEnd],
   ['2026-10-12','2026-10-18','2026-10-05','2026-10-11']);
  assert.deepEqual(pure.previous.goals.map(g=>[g.id,g.current,g.target]),
   [['active',0,5],['lessons',0,3],['reviews',0,3]]);
  assert.deepEqual(pure.current.goals.map(g=>[g.id,g.current,g.target]),
   [['active',6,5],['lessons',6,3],['reviews',3,3]]);
  assert.deepEqual(pure.current.rewards.map(r=>r.earned),[true,true,true]);
  assert.equal(pure.current.allGoalsMet,true);
  assert.deepEqual(pure.award.weeks['2026-10-12'],['first-steps','steady','committed']);
  assert.deepEqual(pure.duplicate,pure.award);
  assert.equal(pure.next.current.activeDays,0);
  assert.equal(pure.next.previous.activeDays,6);
  assert.deepEqual(pure.next.goals.map(g=>g.id),['active','lessons']);
  assert.deepEqual(pure.rolled.weeks['2026-10-12'],pure.award.weeks['2026-10-12']);
  assert.deepEqual(pure.baseline.goals.map(g=>[g.id,g.target]),[['active',2]]);
  assert.deepEqual([pure.leap.start,pure.leap.end],['2026-12-28','2027-01-03']);
  assert.equal(pure.dst.days.length,7);
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_weekly_badges_v1')),null);
  await page.locator('[data-qpath-action="weekly"]').click();
  assert.equal(await page.locator('.deen-path-week-goals').count(),1);
  assert.equal(await page.locator('.deen-path-goal-reward.is-earned').count(),0);
  assert.equal(await page.locator('.deen-path-goal-item').count(),2,'No review target when there are no eligible cards');
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().weeklyGoals.current.activeDays),0);
  // Old written lesson progress does not create dated progress or earned badges.
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().weeklyGoals.current.activeDays),0);
  await page.locator('[data-qpath-action="weekly"]').click();
  assert.equal(await page.locator('.deen-path-goal-reward.is-earned').count(),0);
  // Genuine completion and correct written review creates ONLY one active day today.
  await page.evaluate(()=>{
   const remaining=[
    ['deen_arabic_harakat_v1',DEEN_ARABIC_HARAKAT.lessons],
    ['deen_arabic_reading_v1',DEEN_ARABIC_READING.lessons],
    ['deen_arabic_words_v1',DEEN_ARABIC_WORDS.lessons],
    ['deen_arabic_meaning_v1',DEEN_ARABIC_MEANING.lessons],
    ['deen_arabic_phrases_v1',DEEN_ARABIC_PHRASES.lessons],
    ['deen_arabic_patterns_v1',DEEN_ARABIC_PATTERNS.lessons.slice(0,2)]
   ];
   for(const [key,lessons] of remaining)
    localStorage.setItem(key,JSON.stringify({schema:1,completed:lessons.map(x=>x.id)}));
   const card=DEEN_ARABIC_PHRASES.cardIds[0];
   localStorage.setItem('deen_arabic_written_review_v1',JSON.stringify({schema:1,cards:{
    [card]:{step:0,dueAt:Date.now()-2000,mistakes:1,attempts:2,lastResult:'again'}
   }}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  await page.evaluate(()=>{DEEN_QURAN_PATHS.selectGroup(26);localStorage.setItem('deen_arabic_lesson_tips_seen_v1',JSON.stringify([window.DEEN_ARABIC_LETTERS,window.DEEN_ARABIC_HARAKAT,window.DEEN_ARABIC_READING,window.DEEN_ARABIC_WORDS,window.DEEN_ARABIC_LISTENING,window.DEEN_ARABIC_MEANING,window.DEEN_ARABIC_PHRASES,window.DEEN_ARABIC_PATTERNS].filter(x=>Array.isArray(x?.lessons)).flatMap(x=>x.lessons.map(l=>l.id))));DEEN_QURAN_PATHS.start()});
  const lessons=await page.evaluate(()=>DEEN_ARABIC_PATTERNS.lessons[2].items.map(x=>x.id));
  for(const id of lessons){
   await page.locator('[data-qpath-action="answer"][data-letter-id="'+id+'"]').click();
   await page.locator('[data-qpath-action="next"]').click();
  }
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="daily"]').click();
  await page.locator('[data-qpath-action="startReview"]').click();
  const card=await page.evaluate(()=>DEEN_ARABIC_PHRASES.cardIds[0]);
  await page.locator('[data-qpath-action="reviewAnswer"][data-letter-id="'+card+'"]').click();
  await page.locator('[data-qpath-action="reviewNext"]').click();
  const actual=await page.evaluate(()=>({
   snapshot:DEEN_QURAN_PATHS.status().weeklyGoals,
   awards:localStorage.getItem('deen_arabic_weekly_badges_v1'),
   weekly:DEEN_QURAN_PATHS.status().weekly
  }));
  assert.equal(actual.snapshot.current.activeDays,1);
  assert.equal(actual.snapshot.current.lessons,1);
  assert.equal(actual.snapshot.current.reviews,1);
  assert.equal(actual.snapshot.rewards[0].earned,false);
  assert.equal(actual.awards,null,'A single day never awards 2-day badge');
  // Populate one other genuine-style dated session within current week, never beyond today.
  await page.evaluate(()=>{
   const W=DEEN_ARABIC_WEEKLY,G=DEEN_ARABIC_WEEKLY_GOALS;
   const range=G.span(),today=W.dayKey();
   const prior=range.days.filter(d=>d<today).at(-1);
   if(!prior)return;
   const record=JSON.parse(localStorage.getItem('deen_arabic_weekly_activity_v1'));
   const next=W.record(record,'review','older-correct-card',new Date(
    Number(prior.slice(0,4)),Number(prior.slice(5,7))-1,Number(prior.slice(8,10)),12));
   localStorage.setItem('deen_arabic_weekly_activity_v1',JSON.stringify(next));
   const earned=G.syncAwards(null,G.build({
    journal:next,daily:JSON.parse(localStorage.getItem('deen_arabic_daily_activity_v1')),
    exams:DEEN_ARABIC_CHECKPOINT.history(null),now:new Date(),remainingWritten:0,reviewEligible:true
   }));
   localStorage.setItem('deen_arabic_weekly_badges_v1',JSON.stringify(earned));
   DEEN_QURAN_PATHS.enterArabic();
  });
  await page.locator('[data-qpath-action="weekly"]').click();
  assert.equal(await page.locator('.deen-path-goal-reward.is-earned').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().weeklyGoals.current.activeDays),2);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().weeklyBadges.weeks[DEEN_ARABIC_WEEKLY_GOALS.span().key].length),1);
  const oldKeys=await page.evaluate(()=>Object.fromEntries(
   ['deen_arabic_foundations_v2','deen_arabic_harakat_v1','deen_arabic_patterns_v1',
    'deen_arabic_listening_v1'].map(k=>[k,localStorage.getItem(k)])));
  for(const locale of ['tr','en','ar','de','fr']){
   await page.evaluate(locale=>{document.documentElement.lang=locale;DEEN_QURAN_PATHS.enterArabic()},locale);
   await page.locator('[data-qpath-action="weekly"]').click();
   assert.equal(await page.locator('.deen-path-goal-reward').count(),3);
   assert.equal(await page.locator('.deen-path-goal-item').count()>=1,true);
   assert.ok((await page.locator('.deen-path-week-goals h3').first().innerText()).length>=4);
  }
  const afterKeys=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),Object.keys(oldKeys));
  assert.deepEqual(afterKeys,oldKeys,'Goals may not modify old course and audio data');
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="home"]').click();
  await page.locator('[data-qpath-action="surah"]').click();
  assert.equal(await page.locator('#originalSurah').count(),1);
  assert.deepEqual(errors,[]);
  console.log('PASS QURAN WEEKLY GOALS PHASE17: Monday weeks, prior-week adaptation, 2/4/6-day badges, accurate per-day records, locale and course safety');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
