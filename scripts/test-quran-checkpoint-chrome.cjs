/* DEEN phase 14 Chrome E2E: actual 20 questions, five domains, locked prior to 25 written lessons. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="originalSurah">Existing Quran Course</button></div></div></div></body></html>';
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
  const inventory=await page.evaluate(()=>{
   const engine=DEEN_QURAN_PATHS,x=DEEN_ARABIC_CHECKPOINT;
   const a=x.build(0),b=x.build(1);
   const answers=a.map((q,i)=>({id:q.id,correct:i%4!==0}));
   const s=x.summarize(a,answers,1000);
   return {version:engine.version,total:engine.status().overallLessonCount,
    questions:a.map(q=>({id:q.id,domain:q.domain,type:q.type,options:q.options.length,parts:q.parts.length})),
    rotated:b.map(q=>q.id),summary:s,empty:x.history(null),saved:x.save(null,s)};
  });
  assert.equal(inventory.version,'quran-arabic-paths-phase16');
  assert.equal(inventory.total,27);
  assert.equal(inventory.questions.length,20);
  assert.equal(new Set(inventory.questions.map(x=>x.id)).size,20);
  assert.deepEqual(inventory.questions.reduce((out,q)=>({...out,[q.domain]:(out[q.domain]||0)+1}),{}),
   {letters:4,vowels:4,reading:4,words:4,meaning:4});
  assert.equal(inventory.questions.filter(q=>q.type==='build').length,4);
  assert.ok(inventory.questions.filter(q=>q.type==='choice').every(x=>x.options===4));
  assert.notDeepEqual(inventory.rotated,inventory.questions.map(x=>x.id));
  assert.equal(inventory.summary.correct,15);
  assert.deepEqual(inventory.summary.topics.map(x=>x.correct),[3,3,3,3,3]);
  assert.equal(inventory.summary.needsReview.length,0);
  assert.equal(inventory.saved.attempts.length,1);
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.locator('.deen-path-checkpoint-section').count(),1);
  assert.equal(await page.locator('[data-qpath-action="checkpointOpen"]:disabled').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().checkpoint.eligible),false);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_checkpoint_v1')),null);
  // Seed all 25 written lessons and preserve all legacy values.
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
   DEEN_QURAN_PATHS.enterArabic();
  });
  const legacyBefore=await page.evaluate(()=>{
   const keys=['deen_arabic_foundations_v2','deen_arabic_harakat_v1','deen_arabic_reading_v1','deen_arabic_words_v1','deen_arabic_meaning_v1','deen_arabic_phrases_v1','deen_arabic_patterns_v1'];
   return Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)]));
  });
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().checkpoint.eligible),true);
  assert.equal(await page.locator('.deen-path-listening-item:disabled').count(),2);
  await page.locator('[data-qpath-action="checkpointOpen"]').click();
  assert.equal(await page.locator('.deen-path-checkpoint-landing').count(),1);
  await page.locator('[data-qpath-action="checkpointStart"]').click();
  assert.equal(await page.locator('.deen-path-checkpoint-question').count(),1);
  const questions=await page.evaluate(()=>DEEN_ARABIC_CHECKPOINT.build(0).map(x=>({id:x.id,type:x.type,parts:x.parts,options:x.options})));
  for(let i=0;i<questions.length;i++){
   const q=questions[i],makeWrong=i%4<2;
   assert.match(await page.locator('.deen-path-question-count').innerText(),new RegExp((i+1)+' / 20'));
   if(q.type==='choice'){
    const id=makeWrong?q.options.find(opt=>opt.id!==q.id).id:q.id;
    await page.locator('[data-qpath-action="checkpointAnswer"][data-item-id="'+id+'"]').click();
   }else{
    const indices=q.parts.map((_,idx)=>idx);
    for(const index of (makeWrong?indices.reverse():indices))
     await page.locator('[data-qpath-action="checkpointPiece"][data-piece-index="'+index+'"]').click();
   }
   assert.equal(await page.locator('.deen-path-feedback'+(makeWrong?'.is-wrong':'.is-correct')).count(),1);
   await page.locator('[data-qpath-action="checkpointNext"]').click();
  }
  assert.equal(await page.locator('.deen-path-checkpoint-results').count(),1);
  assert.equal(await page.locator('.deen-path-checkpoint-topic').count(),5);
  assert.equal(await page.locator('[data-qpath-action="checkpointTopic"]').count(),5);
  const persisted=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_checkpoint_v1')));
  assert.equal(persisted.attempts.length,1);
  assert.equal(persisted.attempts[0].correct,10);
  assert.equal(persisted.attempts[0].accuracy,50);
  assert.deepEqual(persisted.attempts[0].topics.map(t=>t.correct),[2,2,2,2,2]);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().checkpoint.attemptCount),1);
  const legacyAfter=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),Object.keys(legacyBefore));
  assert.deepEqual(legacyAfter,legacyBefore,'Assessment must not alter legacy lesson records');
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_listening_v1')),null);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_written_review_v1')),null);
  // The result links go back to an already unlocked topic.
  await page.locator('[data-qpath-action="checkpointTopic"][data-lesson-index="7"]').click();
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().lessonIndex),7);
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="checkpointResults"]').click();
  assert.equal(await page.locator('.deen-path-checkpoint-topic').count(),5);
  await page.locator('[data-qpath-action="checkpointStart"]').click();
  assert.equal(await page.locator('.deen-path-checkpoint-question').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().checkpoint.attemptCount),1,'Incomplete attempt must not be saved');
  for(const lang of ['tr','en','ar','de','fr']){
   await page.evaluate(lang=>{document.documentElement.lang=lang;DEEN_QURAN_PATHS.enterArabic()},lang);
   assert.ok((await page.locator('.deen-path-checkpoint-section h3').innerText()).length>5);
   await page.locator('[data-qpath-action="checkpointResults"]').click();
   assert.ok((await page.locator('.deen-path-checkpoint-results h2').innerText()).length>5);
   assert.equal(await page.locator('.deen-path-checkpoint-topic').count(),5);
  }
  await page.locator('[data-qpath-action="arabic"]').click();
  await page.locator('[data-qpath-action="home"]').click();
  await page.locator('[data-qpath-action="surah"]').click();
  assert.equal(await page.locator('#originalSurah').count(),1);
  assert.deepEqual(errors,[]);
  console.log('PASS QURAN CHECKPOINT PHASE14: 20 actual questions, five domains, blocked until 25 lessons, 50% result, weakness routes, five locales, legacy and audio isolation');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
