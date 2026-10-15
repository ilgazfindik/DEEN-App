/* DEEN Arabic Phase 3: harakat + Ba/Ta first syllables, no artificial audio. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><h2 id="existingSurahHeader">Memorize surahs</h2><button id="existingSurahAction">Existing Quran action</button></div></div></div></body></html>';
const server=http.createServer((_,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:375,height:812}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);
 await page.evaluate(()=>window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang});
 await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-letters.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-harakat.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-reading.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-words.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-listening.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-meaning.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-phrases.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-patterns.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-mastery.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-daily.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-adaptive.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-foundation-review.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-checkpoint.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-remediation.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-weekly.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-weekly-goals.js')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-paths.js')});
 assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.version),'quran-arabic-paths-phase17');
 const data=await page.evaluate(()=>({marks:DEEN_ARABIC_HARAKAT.marks.map(x=>({id:x.id,glyph:x.glyph,mark:x.mark})),lessons:DEEN_ARABIC_HARAKAT.lessons.map(x=>({id:x.id,kind:x.kind,items:x.items.map(y=>({id:y.id,glyph:y.glyph}))})),audio:DEEN_ARABIC_HARAKAT.audioStatus}));
 assert.deepEqual(data.marks.map(x=>x.id),['fatha','kasra','damma']);
 assert.deepEqual(data.marks.map(x=>x.mark),['\u064e','\u0650','\u064f']);
 assert.deepEqual(data.lessons[1].items.map(x=>x.glyph),['بَ','بِ','بُ']);
 assert.deepEqual(data.lessons[2].items.map(x=>x.glyph),['تَ','تِ','تُ']);
 assert.equal(data.audio,'awaiting-verified-recordings');
 // The original seven-letter-course progress must remain untouched.
 await page.locator('[data-qpath-action="arabic"]').click();
 assert.equal(await page.locator('.deen-path-vowel-item').count(),3);
 assert.equal(await page.locator('.deen-path-vowel-item:disabled').count(),3,'Vowels locked before 28-letter course');
 assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(7)),false,'Cannot skip alphabet prerequisite');
 await page.evaluate(()=>{
  localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id),updatedAt:Date.now()}));
  DEEN_QURAN_PATHS.enterArabic();
 });
 assert.equal(await page.locator('.deen-path-vowel-item:disabled').count(),2);
 assert.match(await page.locator('.deen-path-progress-copy').first().innerText(),/7 \/ 7/);
 assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().vowelCompletedLessons),0);
 const expected=data.lessons.map(x=>x.items.map(y=>y.id));
 for(let i=0;i<3;i++){
  await page.locator('.deen-path-vowel-item[data-lesson-index="'+(i+7)+'"]').click();
  assert.equal(await page.locator('.deen-path-letter-card').count(),3);
  assert.equal(await page.locator('.deen-path-shape-atlas').count(),0,'No alphabet joining table for phonics lessons');
  await page.locator('[data-qpath-action="start"]').click();
  for(let q=0;q<3;q++){
   assert.match(await page.locator('.deen-path-question-count').innerText(),new RegExp((q+1)+' / 3'));
   if(q===0){
    await page.locator('.deen-path-option[data-letter-id="'+expected[i][1]+'"]').click();
    assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1,'Wrong answer must show correction');
   }
   await page.locator('.deen-path-option[data-letter-id="'+expected[i][q]+'"]').click();
   assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
   await page.locator('[data-qpath-action="next"]').click();
  }
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().vowelCompletedLessons),i+1);
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.locator('.deen-path-vowel-item:disabled').count(),Math.max(0,1-i));
 }
 const vowelSaved=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_harakat_v1')));
 assert.equal(vowelSaved.schema,1);assert.equal(vowelSaved.completed.length,3);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed.length),7,'Old letter progress untouched');
 await page.locator('[data-qpath-action="home"]').click();
 await page.locator('[data-qpath-action="surah"]').click();
 assert.notEqual(await page.locator('.deen-quran-shell').evaluate(el=>getComputedStyle(el).display),'none');
 assert.equal(await page.locator('#existingSurahAction').count(),1);
 await page.evaluate(()=>{document.documentElement.lang='fr';DEEN_QURAN_PATHS.enterArabic()});
 assert.match(await page.locator('.deen-path-vowel-section h3').innerText(),/Voyelles/);
 await page.evaluate(()=>{document.documentElement.lang='ar';DEEN_QURAN_PATHS.enterArabic()});
 assert.match(await page.locator('.deen-path-vowel-section h3').innerText(),/الحركات/);
 assert.deepEqual(errors,[],'No JS browser exceptions');
 await browser.close();server.close();
 console.log('PASS QURAN HARAKAT Phase3: 3 vowel marks, 3 syllable lessons, locked prerequisites, progress, prior Quran preservation, TR/FR/AR');
})().catch(e=>{console.error(e);server.close();process.exit(1)});
