/* Phase 15 — real Chromium drill of missed checkpoint questions and improvement trend. */
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
  const boot=['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-remediation.js','quran-arabic-paths.js'];
  for(const file of boot)await page.addScriptTag({path:path.join(root,'assets/i18n',file)});
  const pure=await page.evaluate(()=>{
   const E=DEEN_ARABIC_CHECKPOINT,R=DEEN_ARABIC_REMEDIATION,questions=E.build(0);
   const first=E.summarize(questions,questions.map((q,i)=>({id:q.id,correct:i%4>=2})),1000);
   const prior=E.save(null,first),plan=R.plan(prior),before=R.progress(plan,null);
   const one=R.mark(before,null,plan.questions[0].id,true),twice=R.mark(plan,one,plan.questions[0].id,true);
   const after=R.progress(plan,twice),invalid=R.mark(plan,one,'unknown-id',true);
   const improved=E.save(prior,E.summarize(E.build(1),E.build(1).map((q,i)=>({id:q.id,correct:i%4>=1})),2000));
   const trend=R.compare(improved),changed=R.plan(improved);
   return {version:DEEN_QURAN_PATHS.version,total:DEEN_QURAN_PATHS.status().overallLessonCount,
    topicCount:plan.topics.length,questions:plan.questions.map(q=>({id:q.id,domain:q.domain,type:q.type})),
    rawDone:one.done,twice:twice.done,after:after.complete,invalid:invalid.done,
    delta:trend.delta,topicDeltas:trend.topics.map(t=>t.delta),changed:changed.key!==plan.key,
    empty:R.plan(null).key};
  });
  assert.equal(pure.version,'quran-arabic-paths-phase15');assert.equal(pure.total,27);
  assert.equal(pure.topicCount,5);assert.equal(pure.questions.length,10);
  assert.deepEqual(pure.questions.reduce((o,x)=>({...o,[x.domain]:(o[x.domain]||0)+1}),{}),
   {letters:2,vowels:2,reading:2,words:2,meaning:2});
  assert.equal(pure.after,1);assert.deepEqual(pure.rawDone,pure.twice);assert.deepEqual(pure.rawDone,pure.invalid);
  assert.equal(pure.delta,5);assert.deepEqual(pure.topicDeltas,[1,1,1,1,1]);assert.equal(pure.changed,true);assert.equal(pure.empty,null);
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.locator('.deen-path-remedy-section').count(),0,'Do not make up an exam history');
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_remediation_v1')),null);
  await page.evaluate(()=>{
   const sources=[
    ['deen_arabic_foundations_v2',DEEN_ARABIC_LETTERS.lessons],
    ['deen_arabic_harakat_v1',DEEN_ARABIC_HARAKAT.lessons],
    ['deen_arabic_reading_v1',DEEN_ARABIC_READING.lessons],
    ['deen_arabic_words_v1',DEEN_ARABIC_WORDS.lessons],
    ['deen_arabic_meaning_v1',DEEN_ARABIC_MEANING.lessons],
    ['deen_arabic_phrases_v1',DEEN_ARABIC_PHRASES.lessons],
    ['deen_arabic_patterns_v1',DEEN_ARABIC_PATTERNS.lessons]
   ];
   for(const [key,lessons] of sources)localStorage.setItem(key,JSON.stringify({schema:1,completed:lessons.map(x=>x.id)}));
   const exam=DEEN_ARABIC_CHECKPOINT,q=exam.build(0),
    first=exam.summarize(q,q.map((v,i)=>({id:v.id,correct:i%4>=2})),Date.now()-3600000);
   localStorage.setItem('deen_arabic_checkpoint_v1',JSON.stringify(exam.save(null,first)));
   DEEN_QURAN_PATHS.enterArabic();
  });
  const old=await page.evaluate(()=>Object.fromEntries(
   ['deen_arabic_foundations_v2','deen_arabic_harakat_v1','deen_arabic_reading_v1',
    'deen_arabic_words_v1','deen_arabic_meaning_v1','deen_arabic_phrases_v1',
    'deen_arabic_patterns_v1','deen_arabic_checkpoint_v1'].map(k=>[k,localStorage.getItem(k)])));
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().remediation.total),10);
  assert.equal(await page.locator('.deen-path-listening-item:disabled').count(),2);
  await page.locator('[data-qpath-action="checkpointResults"]').click();
  assert.equal(await page.locator('.deen-path-checkpoint-topic').count(),5);
  assert.equal(await page.locator('.deen-path-remedy-topic').count(),5);
  assert.equal(await page.locator('[data-qpath-action="remedyStart"]').count(),1);
  await page.locator('[data-qpath-action="remedyStart"]').click();
  assert.equal(await page.locator('.deen-path-remedy-question').count(),1);
  const items=await page.evaluate(()=>DEEN_ARABIC_REMEDIATION.plan(
    DEEN_ARABIC_CHECKPOINT.history(JSON.parse(localStorage.getItem('deen_arabic_checkpoint_v1')))).questions.map(q=>({id:q.id,type:q.type,options:q.options,parts:q.parts})));
  const first=items[0];
  assert.equal(first.type,'choice');
  await page.locator('[data-qpath-action="remedyAnswer"][data-item-id="'+first.options.find(o=>o.id!==first.id).id+'"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().remediation.complete),0);
  await page.locator('[data-qpath-action="remedyAnswer"][data-item-id="'+first.id+'"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().remediation.complete),1);
  await page.locator('[data-qpath-action="remedy"]').click();
  assert.equal(await page.locator('.deen-path-remedy-landing').count(),1);
  assert.equal(await page.locator('.deen-path-remedy-count').count(),1);
  await page.locator('[data-qpath-action="remedyStart"]').click();
  assert.match(await page.locator('.deen-path-question-count').innerText(),/1 \/ 9/);
  for(const q of items.slice(1)){
   if(q.type==='build'){
    for(const i of q.parts.map((_,i)=>i).reverse())
     await page.locator('[data-qpath-action="remedyPiece"][data-piece-index="'+i+'"]').click();
    assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
    await page.locator('[data-qpath-action="remedyReset"]').click();
    for(const i of q.parts.map((_,i)=>i))
     await page.locator('[data-qpath-action="remedyPiece"][data-piece-index="'+i+'"]').click();
   }else await page.locator('[data-qpath-action="remedyAnswer"][data-item-id="'+q.id+'"]').click();
   assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
   await page.locator('[data-qpath-action="remedyNext"]').click();
  }
  assert.equal(await page.locator('.deen-path-remedy-finished-screen').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().remediation.remaining),0);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_remediation_v1')).done.length),10);
  const unchanged=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),Object.keys(old));
  assert.deepEqual(unchanged,old,'The practice plan must not modify past grades, XP or lesson saves');
  await page.locator('[data-qpath-action="checkpointStart"]').click();
  assert.equal(await page.locator('.deen-path-checkpoint-question').count(),1);
  const retest=await page.evaluate(()=>DEEN_ARABIC_CHECKPOINT.build(1).map(q=>({id:q.id,type:q.type,parts:q.parts,options:q.options})));
  for(let i=0;i<retest.length;i++){
   const q=retest[i],wrong=i%4===0;
   if(q.type==='build'){
    for(const j of (wrong?q.parts.map((_,j)=>j).reverse():q.parts.map((_,j)=>j)))
     await page.locator('[data-qpath-action="checkpointPiece"][data-piece-index="'+j+'"]').click();
   }else{
    const id=wrong?q.options.find(x=>x.id!==q.id).id:q.id;
    await page.locator('[data-qpath-action="checkpointAnswer"][data-item-id="'+id+'"]').click();
   }
   await page.locator('[data-qpath-action="checkpointNext"]').click();
  }
  assert.equal(await page.locator('.deen-path-checkpoint-results').count(),1);
  const final=await page.evaluate(()=>DEEN_QURAN_PATHS.status().remediation);
  assert.equal(final.comparison.delta,5);
  assert.equal(final.total,0,'New exam with 3/4 per topic has no priority gaps');
  assert.equal(final.key!==await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_remediation_v1')).key),true,'Old remediation progress must not be applied to the new exam');
  assert.equal(await page.locator('.deen-path-remedy-trend-topic').count(),5);
  const historic=await page.evaluate(()=>DEEN_ARABIC_CHECKPOINT.history(JSON.parse(localStorage.getItem('deen_arabic_checkpoint_v1'))).attempts);
  assert.deepEqual(historic.map(x=>x.correct),[10,15]);
  for(const lang of ['tr','en','ar','de','fr']){
   await page.evaluate(lang=>{document.documentElement.lang=lang;DEEN_QURAN_PATHS.enterArabic()},lang);
   await page.locator('[data-qpath-action="checkpointResults"]').click();
   assert.ok((await page.locator('.deen-path-remedy-section h3').innerText()).length>5);
   assert.ok((await page.locator('.deen-path-remedy-trend h3').innerText()).length>5);
  }
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="home"]').click();await page.locator('[data-qpath-action="surah"]').click();
  assert.equal(await page.locator('#originalSurah').count(),1);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_listening_v1')),null);
  assert.deepEqual(errors,[]);
  console.log('PASS QURAN REMEDIATION PHASE15: 10 real missed questions, reset-and-retry, persistence, 10→15 exam trend, 5 locales, untouched XP/lessons/surahs/audio');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
