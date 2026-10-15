/* DEEN phase 7: Quran word meanings, word roles and independent verse ordering */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="surahOriginal">Original surah course</button></div></div></div></body></html>';
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
  for(const name of ['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-paths.js'])
   await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  const syllabus=await page.evaluate(()=>({
   version:DEEN_QURAN_PATHS.version,
   lessons:DEEN_ARABIC_MEANING.lessons.map(l=>({id:l.id,index:l.index,kind:l.kind,items:l.items.map(x=>({id:x.id,glyph:x.glyph,reference:x.reference,parts:x.parts,gloss:x.gloss,role:x.role,meaning:x.meaning}))})),
   total:DEEN_QURAN_PATHS.status().overallLessonCount
  }));
  assert.equal(syllabus.version,'quran-arabic-paths-phase8');
  assert.equal(syllabus.total,24);
  assert.deepEqual(syllabus.lessons.map(l=>l.index),[18,19,20]);
  assert.deepEqual(syllabus.lessons.map(l=>l.items.length),[4,4,3]);
  for(const lesson of syllabus.lessons){
   for(const item of lesson.items){
    assert.ok(item.reference);
    const fields=lesson.kind==='meaning-gloss'?item.gloss:lesson.kind==='meaning-role'?item.role:item.meaning;
    for(const locale of ['tr','en','ar','de','fr'])assert.ok(fields[locale]);
    if(item.parts)assert.equal(item.parts.join(' '),item.glyph);
   }
  }
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.locator('.deen-path-meaning-item:disabled').count(),3);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(18)),false);
  // Phase 7 should unlock from 16 written lessons WITHOUT phase 6 licensed sound.
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(l=>l.id)}));
   localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.map(l=>l.id)}));
   localStorage.setItem('deen_arabic_reading_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_READING.lessons.map(l=>l.id)}));
   localStorage.setItem('deen_arabic_words_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_WORDS.lessons.map(l=>l.id)}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  assert.equal(await page.locator('.deen-path-meaning-item:disabled').count(),2);
  assert.equal(await page.locator('.deen-path-listening-item:disabled').count(),2);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(19)),false);
  for(let li=0;li<3;li++){
   await page.locator('.deen-path-meaning-item[data-lesson-index="'+(18+li)+'"]').click();
   await page.locator('[data-qpath-action="start"]').click();
   const items=syllabus.lessons[li].items;
   for(let q=0;q<items.length;q++){
    const item=items[q];
    assert.match(await page.locator('.deen-path-question-count').innerText(),new RegExp((q+1)+' / '+items.length));
    if(li<2){
     const wrong=items[(q+1)%items.length].id;
     await page.locator('[data-qpath-action="answer"][data-letter-id="'+wrong+'"]').click();
     assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
     await page.locator('[data-qpath-action="answer"][data-letter-id="'+item.id+'"]').click();
    }else{
     const order=item.parts.map((_,i)=>i).reverse();
     for(const idx of order)await page.locator('[data-qpath-action="meaningPiece"][data-piece-index="'+idx+'"]').click();
     assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
     await page.locator('[data-qpath-action="resetMeaning"]').click();
     assert.equal(await page.locator('.deen-path-feedback').count(),0);
     for(let idx=0;idx<item.parts.length;idx++)
      await page.locator('[data-qpath-action="meaningPiece"][data-piece-index="'+idx+'"]').click();
     assert.equal(await page.locator('.deen-path-meaning-built').innerText(),item.glyph);
    }
    assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
    await page.locator('[data-qpath-action="next"]').click();
   }
   assert.equal(await page.locator('.deen-path-completion').count(),1);
   assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().meaningCompletedLessons),li+1);
   await page.locator('[data-qpath-action="arabic"]').click();
  }
  assert.equal(await page.locator('.deen-path-meaning-item:disabled').count(),0);
  assert.equal(await page.locator('.deen-path-listening-item:disabled').count(),2);
  const saved=await page.evaluate(()=>({
   meanings:JSON.parse(localStorage.getItem('deen_arabic_meaning_v1')),
   letters:JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')),
   vowels:JSON.parse(localStorage.getItem('deen_arabic_harakat_v1')),
   reading:JSON.parse(localStorage.getItem('deen_arabic_reading_v1')),
   words:JSON.parse(localStorage.getItem('deen_arabic_words_v1')),
   audio:localStorage.getItem('deen_arabic_listening_v1')
  }));
  assert.deepEqual(saved.meanings.completed,syllabus.lessons.map(l=>l.id));
  assert.deepEqual([saved.letters.completed.length,saved.vowels.completed.length,saved.reading.completed.length,saved.words.completed.length],[7,3,3,3]);
  assert.equal(saved.audio,null,'No fake audio completion');
  for(const code of ['tr','en','ar','de','fr']){
   await page.evaluate(code=>{document.documentElement.lang=code;DEEN_QURAN_PATHS.enterArabic()},code);
   assert.ok((await page.locator('.deen-path-meaning-section h3').innerText()).length>5);
   await page.locator('.deen-path-meaning-item[data-lesson-index="18"]').click();
   await page.locator('[data-qpath-action="start"]').click();
   assert.ok((await page.locator('.deen-path-meaning-hint').innerText()).length>1);
   await page.locator('[data-qpath-action="group"]').click();
   await page.locator('[data-qpath-action="arabic"]').click();
  }
  await page.locator('[data-qpath-action="home"]').click();
  await page.locator('[data-qpath-action="surah"]').click();
  assert.equal(await page.locator('#surahOriginal').count(),1);
  assert.deepEqual(errors,[]);
  console.log('PASS QURAN MEANING PHASE7: 3 active lessons, 11 questions, 5 locales, audio independent, wrong-answer retries, old progress, surah preserved');
 }finally{await browser.close();server.close()}
})().catch(err=>{console.error(err);server.close();process.exit(1)});
