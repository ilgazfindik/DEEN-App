/* DEEN Arabic Phase 5: syllables, written words, Quran word spotting */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="originalSurah">Surah learning</button></div></div></div></body></html>';
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:375,height:812}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port);
  await page.evaluate(()=>window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang});
  await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
  for(const f of ['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-paths.js'])
   await page.addScriptTag({path:path.join(root,'assets/i18n',f)});
  const data=await page.evaluate(()=>({version:DEEN_QURAN_PATHS.version,lessons:DEEN_ARABIC_WORDS.lessons.map(l=>({index:l.index,kind:l.kind,id:l.id,items:l.items.map(x=>({id:x.id,word:x.glyph,parts:x.parts,excerpt:x.excerpt}))}))}));
  assert.equal(data.version,'quran-arabic-paths-phase5');
  assert.deepEqual(data.lessons.map(l=>l.index),[13,14,15]);
  assert.deepEqual(data.lessons.map(l=>l.kind),['syllable-build','word-build','quran-find']);
  for(const lesson of data.lessons)for(const word of lesson.items){
   assert.ok(word.excerpt.includes(word.word));
   if(word.parts.length)assert.equal(word.parts.join(''),word.word);
  }
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.locator('.deen-path-word-item:disabled').count(),3);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(13)),false);
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(l=>l.id)}));
   localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.map(l=>l.id)}));
   localStorage.setItem('deen_arabic_reading_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_READING.lessons.map(l=>l.id)}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  assert.equal(await page.locator('.deen-path-word-item:disabled').count(),2);
  for(let li=0;li<3;li++){
   await page.locator('.deen-path-word-item[data-lesson-index="'+(13+li)+'"]').click();
   assert.equal(await page.locator('.deen-path-letter-card').count(),3);
   await page.locator('[data-qpath-action="start"]').click();
   for(let q=0;q<3;q++){
    const item=data.lessons[li].items[q];
    assert.match(await page.locator('.deen-path-question-count').innerText(),new RegExp((q+1)+' / 3'));
    if(li<2){
     for(const idx of [...item.parts.keys()].reverse())
      await page.locator('[data-qpath-action="piece"][data-piece-index="'+idx+'"]').click();
     assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
     await page.locator('[data-qpath-action="resetPieces"]').click();
     assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),0);
     for(let idx=0;idx<item.parts.length;idx++)
      await page.locator('[data-qpath-action="piece"][data-piece-index="'+idx+'"]').click();
     assert.equal(await page.locator('.deen-path-word-built').innerText(),item.word);
    }else{
     assert.ok((await page.locator('.deen-path-word-excerpt').innerText()).includes(item.word));
     const wrong=data.lessons[li].items[(q+1)%3].id;
     await page.locator('[data-qpath-action="answer"][data-letter-id="'+wrong+'"]').click();
     assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
     await page.locator('[data-qpath-action="answer"][data-letter-id="'+item.id+'"]').click();
    }
    assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
    await page.locator('[data-qpath-action="next"]').click();
   }
   assert.equal(await page.locator('.deen-path-completion').count(),1);
   assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().wordCompletedLessons),li+1);
   await page.locator('[data-qpath-action="arabic"]').click();
  }
  assert.equal(await page.locator('.deen-path-word-item:disabled').count(),0);
  const stored=await page.evaluate(()=>({
   words:JSON.parse(localStorage.getItem('deen_arabic_words_v1')),
   letters:JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')),
   vowels:JSON.parse(localStorage.getItem('deen_arabic_harakat_v1')),
   reading:JSON.parse(localStorage.getItem('deen_arabic_reading_v1'))
  }));
  assert.deepEqual(stored.words.completed,data.lessons.map(x=>x.id));
  assert.equal(stored.letters.completed.length,7);
  assert.equal(stored.vowels.completed.length,3);
  assert.equal(stored.reading.completed.length,3);
  for(const locale of ['tr','en','de','fr','ar']){
   await page.evaluate(code=>{document.documentElement.lang=code;DEEN_QURAN_PATHS.enterArabic()},locale);
   assert.ok((await page.locator('.deen-path-word-section h3').innerText()).length>3);
  }
  await page.locator('[data-qpath-action="home"]').click();
  await page.locator('[data-qpath-action="surah"]').click();
  assert.equal(await page.locator('#originalSurah').count(),1);
  await page.evaluate(()=>{document.getElementById('leagueScreenBody').innerHTML='<div class="deen-quran-shell">Rebuilt surahs</div>'});
  await page.locator('.deen-path-word-item').first().waitFor();
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().wordCompletedLessons),3);
  assert.deepEqual(errors,[]);
  console.log('PASS QURAN WORD PHASE5: 3 lessons, 9 activities, retry, locking, locales and previous-progress regression');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
