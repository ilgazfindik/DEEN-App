/* DEEN Phase 8 browser QA — phrase comprehension and honest spaced-review lifecycle. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="surahOriginal">Existing Surahs</button></div></div></div></body></html>';
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
  for(const name of ['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-paths.js'])
   await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  const lessons=await page.evaluate(()=>({
   version:DEEN_QURAN_PATHS.version,total:DEEN_QURAN_PATHS.status().overallLessonCount,
   lessons:DEEN_ARABIC_PHRASES.lessons.map(x=>({id:x.id,index:x.index,kind:x.kind,
    items:x.items.map(y=>({id:y.id,glyph:y.glyph,parts:y.parts,reference:y.reference,excerpt:y.excerpt,gloss:y.gloss,note:y.note}))})),
   cards:DEEN_ARABIC_PHRASES.cardIds,
   before:DEEN_ARABIC_PHRASES.schedule(null,true,10000),
   good:DEEN_ARABIC_PHRASES.schedule({step:1,lastResult:'good'},true,10000),
   again:DEEN_ARABIC_PHRASES.schedule({step:2,lastResult:'good'},false,10000),
   retry:DEEN_ARABIC_PHRASES.schedule({step:0,lastResult:'again'},true,10000)
  }));
  assert.equal(lessons.version,'quran-arabic-paths-phase16');
  assert.equal(lessons.total,27);
  assert.deepEqual(lessons.lessons.map(x=>x.index),[21,22,23]);
  assert.deepEqual(lessons.lessons.map(x=>x.items.length),[4,3,3]);
  assert.equal(lessons.cards.length,7);
  assert.equal(lessons.before.dueAt,10000+86400000);
  assert.equal(lessons.good.dueAt,10000+3*86400000);
  assert.equal(lessons.again.dueAt,10000+600000);
  assert.equal(lessons.retry.dueAt,10000+600000);
  for(const lesson of lessons.lessons)for(const item of lesson.items){
   assert.ok(item.excerpt.includes(item.glyph),'Actual Quran text contains '+item.id);
   for(const locale of ['tr','en','ar','de','fr'])assert.ok(item.gloss[locale],item.id+':'+locale);
   if(item.parts)assert.equal(item.parts.join(' '),item.glyph);
  }
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.locator('.deen-path-phrase-item:disabled').count(),3);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(21)),false);
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(l=>l.id)}));
   localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.map(l=>l.id)}));
   localStorage.setItem('deen_arabic_reading_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_READING.lessons.map(l=>l.id)}));
   localStorage.setItem('deen_arabic_words_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_WORDS.lessons.map(l=>l.id)}));
   localStorage.setItem('deen_arabic_meaning_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_MEANING.lessons.map(l=>l.id)}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  assert.equal(await page.locator('.deen-path-phrase-item:disabled').count(),2);
  assert.equal(await page.locator('.deen-path-listening-item:disabled').count(),2,'Audio remains gated');
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(22)),false);
  for(let li=0;li<3;li++){
   await page.locator('.deen-path-phrase-item[data-lesson-index="'+(21+li)+'"]').click();
   await page.locator('[data-qpath-action="start"]').click();
   const items=lessons.lessons[li].items;
   for(let q=0;q<items.length;q++){
    const item=items[q];
    assert.match(await page.locator('.deen-path-question-count').innerText(),new RegExp((q+1)+' / '+items.length));
    if(li<2){
     const wrong=items[(q+1)%items.length].id;
     await page.locator('[data-qpath-action="answer"][data-letter-id="'+wrong+'"]').click();
     assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
     await page.locator('[data-qpath-action="answer"][data-letter-id="'+item.id+'"]').click();
    }else{
     for(const idx of item.parts.map((_,i)=>i).reverse())
      await page.locator('[data-qpath-action="phrasePiece"][data-piece-index="'+idx+'"]').click();
     assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
     await page.locator('[data-qpath-action="resetPhrase"]').click();
     assert.equal(await page.locator('.deen-path-feedback').count(),0);
     for(let idx=0;idx<item.parts.length;idx++)
      await page.locator('[data-qpath-action="phrasePiece"][data-piece-index="'+idx+'"]').click();
     assert.equal(await page.locator('.deen-path-meaning-built').innerText(),item.glyph);
    }
    assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
    await page.locator('[data-qpath-action="next"]').click();
   }
   assert.equal(await page.locator('.deen-path-completion').count(),1);
   assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().phraseCompletedLessons),li+1);
   await page.locator('[data-qpath-action="arabic"]').click();
  }
  assert.equal(await page.locator('.deen-path-phrase-item:disabled').count(),0);
  assert.equal(await page.locator('.deen-path-listening-item:disabled').count(),2);
  const saved=await page.evaluate(()=>({
   phrases:JSON.parse(localStorage.getItem('deen_arabic_phrases_v1')),
   cards:JSON.parse(localStorage.getItem('deen_arabic_written_review_v1')).cards,
   letters:JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed.length,
   vowels:JSON.parse(localStorage.getItem('deen_arabic_harakat_v1')).completed.length,
   reading:JSON.parse(localStorage.getItem('deen_arabic_reading_v1')).completed.length,
   words:JSON.parse(localStorage.getItem('deen_arabic_words_v1')).completed.length,
   meaning:JSON.parse(localStorage.getItem('deen_arabic_meaning_v1')).completed.length,
   audio:localStorage.getItem('deen_arabic_listening_v1')
  }));
  assert.deepEqual(saved.phrases.completed,lessons.lessons.map(x=>x.id));
  assert.deepEqual([saved.letters,saved.vowels,saved.reading,saved.words,saved.meaning],[7,3,3,3,3]);
  assert.equal(saved.audio,null,'No audio completion forged');
  assert.equal(Object.keys(saved.cards).length,7);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().reviewDue),0,'Cards start in future');
  // Make two real previously learned cards due: never expose a fake daily review.
  const dueIds=[lessons.lessons[0].items[0].id,lessons.lessons[1].items[0].id];
  await page.evaluate(ids=>{
   const record=JSON.parse(localStorage.getItem('deen_arabic_written_review_v1'));
   for(const id of ids){record.cards[id].dueAt=Date.now()-5000;record.cards[id].lastResult='good'}
   record.cards[ids[1]].step=1; // Simulate the second learned card reaching its 3-day review
   localStorage.setItem('deen_arabic_written_review_v1',JSON.stringify(record));
   DEEN_QURAN_PATHS.enterArabic();
  },dueIds);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().reviewDue),2);
  await page.locator('[data-qpath-action="startReview"]').click();
  assert.equal(await page.locator('.deen-path-review-lesson').count(),1);
  await page.locator('[data-qpath-action="reviewAnswer"][data-letter-id="'+lessons.lessons[0].items[1].id+'"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
  await page.locator('[data-qpath-action="reviewAnswer"][data-letter-id="'+dueIds[0]+'"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
  await page.locator('[data-qpath-action="reviewNext"]').click();
  await page.locator('[data-qpath-action="reviewAnswer"][data-letter-id="'+dueIds[1]+'"]').click();
  await page.locator('[data-qpath-action="reviewNext"]').click();
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  const reviewed=await page.evaluate(ids=>{
   const r=JSON.parse(localStorage.getItem('deen_arabic_written_review_v1'));
   return {a:r.cards[ids[0]],b:r.cards[ids[1]],status:DEEN_QURAN_PATHS.status()};
  },dueIds);
  assert.ok(reviewed.a.dueAt>Date.now());
  assert.ok(reviewed.a.dueAt<Date.now()+15*60*1000,'Wrong card repeats soon');
  assert.ok(reviewed.b.dueAt>Date.now()+86400000*2,'Successful review has longer interval');
  assert.equal(reviewed.status.reviewDue,0);
  for(const locale of ['tr','en','de','fr','ar']){
   await page.evaluate(x=>{document.documentElement.lang=x;DEEN_QURAN_PATHS.enterArabic()},locale);
   assert.ok((await page.locator('.deen-path-phrase-section h3').innerText()).length>5);
   assert.ok((await page.locator('.deen-path-spaced-section h3').innerText()).length>5);
   await page.locator('.deen-path-phrase-item[data-lesson-index="21"]').click();
   await page.locator('[data-qpath-action="start"]').click();
   assert.ok((await page.locator('.deen-path-phrase-hint').innerText()).length>2);
   await page.locator('[data-qpath-action="group"]').click();
   await page.locator('[data-qpath-action="arabic"]').click();
  }
  await page.locator('[data-qpath-action="home"]').click();
  await page.locator('[data-qpath-action="surah"]').click();
  assert.equal(await page.locator('#surahOriginal').count(),1);
  assert.deepEqual(errors,[]);
  console.log('PASS QURAN PHRASES PHASE8: 10 activities, 7 tracked cards, 2 due reviews, interval logic, 5 locales and preserved progress');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
