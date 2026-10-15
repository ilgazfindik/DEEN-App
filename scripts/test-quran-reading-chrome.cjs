/* DEEN Quran Arabic phase-4 Chrome QA: sukun, shadda and basic madd */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><h2>Original Surahs</h2><button id="originalSurah">Review Surahs</button></div></div></div></body></html>';
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:375,height:812}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);
 await page.evaluate(()=>window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang});
 await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
 for(const name of ['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-paths.js']){
  await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
 }
 assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.version),'quran-arabic-paths-phase14');
 const content=await page.evaluate(()=>({
  data:DEEN_ARABIC_READING.lessons.map(x=>({id:x.id,index:x.index,kind:x.kind,items:x.items.map(y=>({id:y.id,glyph:y.glyph}))})),
  audio:DEEN_ARABIC_READING.audioStatus
 }));
 assert.equal(content.data.length,3);
 assert.deepEqual(content.data.map(x=>x.index),[10,11,12]);
 assert.deepEqual(content.data.map(x=>x.kind),['sukun','shadda','madd']);
 assert.deepEqual(content.data[0].items.map(x=>x.glyph),['بْ','تْ','مْ']);
 assert.deepEqual(content.data[1].items.map(x=>x.glyph),['بَّ','بِّ','بُّ']);
 assert.deepEqual(content.data[2].items.map(x=>x.glyph),['بَا','بِي','بُو']);
 assert.equal(content.audio,'awaiting-verified-recitation');
 await page.locator('[data-qpath-action="arabic"]').click();
 assert.equal(await page.locator('.deen-path-reading-item').count(),3);
 assert.equal(await page.locator('.deen-path-reading-item:disabled').count(),3);
 assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(10)),false,'Phase 4 locked until earlier lessons completed');
 // Existing alphabet and short-vowel records are unchanged by advanced lessons.
 await page.evaluate(()=>{
  localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)}));
  DEEN_QURAN_PATHS.enterArabic();
 });
 assert.equal(await page.locator('.deen-path-reading-item:disabled').count(),3,'Letters alone do not unlock advanced lessons');
 await page.evaluate(()=>{
  localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.map(x=>x.id)}));
  DEEN_QURAN_PATHS.enterArabic();
 });
 assert.equal(await page.locator('.deen-path-reading-item:disabled').count(),2);
 assert.match(await page.locator('.deen-path-reading-section .deen-path-progress-copy').innerText(),/0 \/ 3/);
 for(let li=0;li<3;li++){
  await page.locator('.deen-path-reading-item[data-lesson-index="'+(10+li)+'"]').click();
  assert.equal(await page.locator('.deen-path-letter-card').count(),3,'All three examples shown on intro');
  assert.equal(await page.locator('.deen-path-shape-atlas').count(),0,'No letter-joining table on reading exercises');
  assert.match(await page.locator('.deen-path-warning').innerText(),/sesli eğitim|telaffuz|tecvid|sesli/i);
  await page.locator('[data-qpath-action="start"]').click();
  for(let q=0;q<3;q++){
   const id=content.data[li].items[q].id;
   assert.match(await page.locator('.deen-path-question-count').innerText(),new RegExp((q+1)+' / 3'));
   if(q===0){
    const wrong=content.data[li].items[1].id;
    await page.locator('[data-qpath-action="answer"][data-letter-id="'+wrong+'"]').click();
    assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
   }
   await page.locator('[data-qpath-action="answer"][data-letter-id="'+id+'"]').click();
   assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
   await page.locator('[data-qpath-action="next"]').click();
  }
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().readingCompletedLessons),li+1);
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.locator('.deen-path-reading-item:disabled').count(),Math.max(0,1-li));
 }
 const progress=await page.evaluate(()=>({
  reading:JSON.parse(localStorage.getItem('deen_arabic_reading_v1')),
  vowel:JSON.parse(localStorage.getItem('deen_arabic_harakat_v1')),
  letters:JSON.parse(localStorage.getItem('deen_arabic_foundations_v2'))
 }));
 assert.equal(progress.reading.schema,1);
 assert.deepEqual(progress.reading.completed,content.data.map(x=>x.id));
 assert.equal(progress.vowel.completed.length,3);
 assert.equal(progress.letters.completed.length,7);
 assert.match(await page.locator('.deen-path-reading-section .deen-path-progress-copy').innerText(),/3 \/ 3/);
 await page.locator('[data-qpath-action="home"]').click();
 await page.locator('[data-qpath-action="surah"]').click();
 assert.notEqual(await page.locator('.deen-quran-shell').evaluate(el=>getComputedStyle(el).display),'none');
 assert.equal(await page.locator('#originalSurah').count(),1);
 await page.evaluate(()=>{document.documentElement.lang='fr';DEEN_QURAN_PATHS.enterArabic()});
 assert.match(await page.locator('.deen-path-reading-section h3').innerText(),/Sukūn/);
 await page.evaluate(()=>{document.documentElement.lang='ar';DEEN_QURAN_PATHS.enterArabic()});
 assert.match(await page.locator('.deen-path-reading-section h3').innerText(),/السكون/);
 // Old Quran view redraws should never delete saved reading progress.
 await page.evaluate(()=>{document.getElementById('leagueScreenBody').innerHTML='<div class="deen-quran-shell">Existing surah content</div>'});
 await page.locator('.deen-path-reading-item').first().waitFor();
 assert.equal(await page.locator('#deenQuranPathNav').count(),1);
 assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().readingCompletedLessons),3);
 assert.deepEqual(errors,[],'No JavaScript exceptions');
 await browser.close();server.close();
 console.log('PASS QURAN READING PHASE4: sukun shadda madd, locked gating, 3x3 play, preserved storage, locales and original surah engine');
})().catch(e=>{console.error(e);server.close();process.exit(1)});
