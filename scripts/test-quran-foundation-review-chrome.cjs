/* DEEN Phase 13: Chrome regression for first-try mistakes in letters, vowel, reading, word construction. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="surahOriginal">Existing surah journey</button></div></div></div></body></html>';
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
  for(const name of ['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-paths.js'])
   await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  const info=await page.evaluate(()=>{
   const F=DEEN_ARABIC_FOUNDATION_REVIEW;
   const counts=F.groups.map(g=>({kind:g.kind,count:F.catalog.filter(x=>x.kind===g.kind).length}));
   const letter=F.byId.ba;
   const wrong=F.grade(null,letter.id,false,1000000),correct=F.grade(wrong,letter.id,true,1000100);
   const summary=F.suggest(correct,[letter.lessonId],1000200,4);
   const focused=F.finish(correct,[letter.id],1000300);
   const delayed=F.suggest(focused,[letter.lessonId],1000400,4);
   const tomorrow=F.suggest(focused,[letter.lessonId],1000100+86400000+1,4);
   const off=F.suggest(correct,[],1000200,4);
   return {version:DEEN_QURAN_PATHS.version,total:DEEN_QURAN_PATHS.status().overallLessonCount,
    catalog:F.catalog.length,counts,wrong:wrong.cards[letter.id],correct:correct.cards[letter.id],
    suggested:summary.ids,focused:delayed.ids,tomorrow:tomorrow.ids,locked:off.ids};
  });
  assert.equal(info.version,'quran-arabic-paths-phase13');assert.equal(info.total,27);assert.equal(info.catalog,55);
  assert.deepEqual(info.counts,[{kind:'letters',count:28},{kind:'vowels',count:9},{kind:'reading',count:9},{kind:'words',count:9}]);
  assert.equal(info.wrong.dueAt,1600000);
  assert.equal(info.correct.dueAt,1000100+86400000);
  assert.ok(info.suggested.includes('ba'));assert.deepEqual(info.focused,[]);
  assert.deepEqual(info.tomorrow,['ba']);assert.deepEqual(info.locked,[]);
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.locator('.deen-path-foundation-review-section').count(),1);
  assert.equal(await page.locator('[data-qpath-action="startFoundation"]').count(),0);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_foundation_review_v1')),null,'Do not invent progress');
  // A real letter lesson with a wrong answer then correction.
  await page.evaluate(()=>{DEEN_QURAN_PATHS.selectGroup(0);DEEN_QURAN_PATHS.start()});
  const first=await page.evaluate(()=>DEEN_ARABIC_LETTERS.lessons[0].letters.map(x=>x.id));
  await page.locator('[data-qpath-action="answer"][data-letter-id="'+first[1]+'"]').click();
  await page.locator('[data-qpath-action="answer"][data-letter-id="'+first[0]+'"]').click();
  await page.locator('[data-qpath-action="next"]').click();
  for(const id of first.slice(1)){
   await page.locator('[data-qpath-action="answer"][data-letter-id="'+id+'"]').click();
   await page.locator('[data-qpath-action="next"]').click();
  }
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().foundation.eligible),1);
  await page.locator('[data-qpath-action="startFoundation"]').click();
  assert.equal(await page.locator('.deen-path-foundation-review-view').count(),1);
  await page.locator('[data-qpath-action="foundationAnswer"][data-item-id="'+first[0]+'"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
  await page.locator('[data-qpath-action="foundationNext"]').click();
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().foundation.eligible),0,'No repeated immediate practice loop');
  // Preexisting letter/harakat/reading progress, no unlock bypass.
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.slice(0,2).map(x=>x.id)}));
   localStorage.setItem('deen_arabic_reading_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_READING.lessons.slice(0,2).map(x=>x.id)}));
   localStorage.setItem('deen_arabic_words_v1',JSON.stringify({schema:1,completed:[]}));
  });
  // Short vowels/heces: the actual third lesson, wrong and retry.
  await page.evaluate(()=>{DEEN_QURAN_PATHS.selectGroup(9);DEEN_QURAN_PATHS.start()});
  const vowel=await page.evaluate(()=>DEEN_ARABIC_HARAKAT.lessons[2].items.map(x=>x.id));
  await page.locator('[data-qpath-action="answer"][data-letter-id="'+vowel[1]+'"]').click();
  await page.locator('[data-qpath-action="answer"][data-letter-id="'+vowel[0]+'"]').click();
  await page.locator('[data-qpath-action="next"]').click();
  for(const id of vowel.slice(1)){await page.locator('[data-qpath-action="answer"][data-letter-id="'+id+'"]').click();await page.locator('[data-qpath-action="next"]').click();}
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().foundation.eligible),1);
  // Reading marks: shadda/sukun/madd recognition.
  await page.evaluate(()=>{DEEN_QURAN_PATHS.selectGroup(12);DEEN_QURAN_PATHS.start()});
  const reading=await page.evaluate(()=>DEEN_ARABIC_READING.lessons[2].items.map(x=>x.id));
  await page.locator('[data-qpath-action="answer"][data-letter-id="'+reading[1]+'"]').click();
  await page.locator('[data-qpath-action="answer"][data-letter-id="'+reading[0]+'"]').click();await page.locator('[data-qpath-action="next"]').click();
  for(const id of reading.slice(1)){await page.locator('[data-qpath-action="answer"][data-letter-id="'+id+'"]').click();await page.locator('[data-qpath-action="next"]').click();}
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  // Word building: reverse initial parts deliberately, reset and complete all three.
  await page.evaluate(()=>{DEEN_QURAN_PATHS.selectGroup(13);DEEN_QURAN_PATHS.start()});
  const words=await page.evaluate(()=>DEEN_ARABIC_WORDS.lessons[0].items.map(x=>({id:x.id,parts:x.parts})));
  for(let i=0;i<words.length;i++){
   const item=words[i],indexes=item.parts.map((_,j)=>j);
   if(i===0){
    for(const idx of indexes.slice().reverse())await page.locator('[data-qpath-action="piece"][data-piece-index="'+idx+'"]').click();
    assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
    await page.locator('[data-qpath-action="resetPieces"]').click();
   }
   for(const idx of indexes)await page.locator('[data-qpath-action="piece"][data-piece-index="'+idx+'"]').click();
   assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
   await page.locator('[data-qpath-action="next"]').click();
  }
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  const snapshot=await page.evaluate(()=>DEEN_QURAN_PATHS.status().foundation);
  assert.equal(snapshot.eligible,3);
  assert.deepEqual(snapshot.groups.map(g=>g.available),[0,1,1,1]);
  await page.locator('[data-qpath-action="startFoundation"]').click();
  assert.equal(await page.locator('.deen-path-foundation-review-view').count(),1);
  const order=await page.evaluate(()=>DEEN_QURAN_PATHS.status().foundation.ids);
  assert.equal(order[0],words[0].id,'Most recent word error should be prioritized');
  const pieceIds=words[0].parts.map((_,i)=>i);
  for(const idx of pieceIds.reverse())await page.locator('[data-qpath-action="foundationPiece"][data-piece-index="'+idx+'"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
  await page.locator('[data-qpath-action="foundationReset"]').click();
  for(const idx of words[0].parts.map((_,i)=>i))await page.locator('[data-qpath-action="foundationPiece"][data-piece-index="'+idx+'"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
  await page.locator('[data-qpath-action="foundationNext"]').click();
  for(const id of order.slice(1)){
   const item=await page.evaluate(id=>DEEN_ARABIC_FOUNDATION_REVIEW.byId[id],id);
   await page.locator('[data-qpath-action="foundationAnswer"][data-item-id="'+id+'"]').click();
   assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
   await page.locator('[data-qpath-action="foundationNext"]').click();
  }
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().foundation.eligible),0);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_listening_v1')),null);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().listeningApprovedClips),0);
  const prev=await page.evaluate(()=>({letters:JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed.length,
   vowels:JSON.parse(localStorage.getItem('deen_arabic_harakat_v1')).completed.length,
   reading:JSON.parse(localStorage.getItem('deen_arabic_reading_v1')).completed.length,
   words:JSON.parse(localStorage.getItem('deen_arabic_words_v1')).completed.length}));
  assert.deepEqual(prev,{letters:7,vowels:3,reading:3,words:1});
  for(const lang of ['tr','en','ar','de','fr']){
   await page.evaluate(lang=>{document.documentElement.lang=lang;DEEN_QURAN_PATHS.enterArabic()},lang);
   assert.ok((await page.locator('.deen-path-foundation-review-section h3').innerText()).length>5);
   await page.locator('[data-qpath-action="daily"]').click();
   assert.equal(await page.locator('.deen-path-foundation-review-section').count(),1);
  }
  await page.locator('[data-qpath-action="arabic"]').click();await page.locator('[data-qpath-action="home"]').click();
  await page.locator('[data-qpath-action="surah"]').click();
  assert.equal(await page.locator('#surahOriginal').count(),1);
  assert.deepEqual(errors,[]);
  console.log('PASS QURAN FOUNDATION REVIEW PHASE13: 55 letters/vowels/reading/word cards, real errors, full mixed review, 5 locales, no audio bypass');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
