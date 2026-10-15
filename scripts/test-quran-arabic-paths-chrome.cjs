/* Chrome E2E: 28 Arabic letters and progressive 7-lesson syllabus. */
const {chromium}=require('playwright'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><h2 id="existingSurahHeader">Current Surahs</h2><button id="existingSurahAction">Review Surahs</button></div></div></div></body></html>';
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
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
 const syllabus=await page.evaluate(()=>DEEN_ARABIC_LETTERS.lessons.map(x=>x.letterIds));
 assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.version),'quran-arabic-paths-phase17');
 assert.equal(await page.evaluate(()=>DEEN_ARABIC_LETTERS.count),28);
 assert.equal(await page.evaluate(()=>DEEN_ARABIC_LETTERS.lessonCount),7);
 assert.equal(syllabus.flat().length,28,'Seven lessons must cover all 28 letters');
 assert.equal(new Set(syllabus.flat()).size,28,'No duplicate letters');
 assert.equal(await page.evaluate(()=>DEEN_ARABIC_LETTERS.all.filter(x=>!x.joinsNext).length),6);
 const models=await page.evaluate(()=>DEEN_ARABIC_LETTERS.all.map(x=>({id:x.id,glyph:x.glyph,forms:x.forms,joinsNext:x.joinsNext})));
 for(const model of models){
  assert(model.glyph && model.forms.isolated===model.glyph);
  assert(model.forms.final.startsWith('ـ'));
  assert.equal(model.forms.medial===null,!model.joinsNext,'Medial unavailable on nonconnecting letters '+model.id);
  assert(model.forms.initial.endsWith('ـ')===model.joinsNext);
 }
 assert.deepEqual(models.filter(x=>!x.joinsNext).map(x=>x.id),['alif','dal','dhal','ra','zay','waw']);
 assert.equal(await page.locator('.deen-path-card').count(),2);
 assert.equal(await page.locator('.deen-quran-shell').evaluate(el=>getComputedStyle(el).display),'none');
 await page.locator('[data-qpath-action="surah"]').click();
 assert.notEqual(await page.locator('.deen-quran-shell').evaluate(el=>getComputedStyle(el).display),'none','Surah dashboard must be visible');
 await page.locator('#existingSurahAction').click();
 await page.locator('[data-qpath-action="home"]').click();
 await page.locator('[data-qpath-action="arabic"]').click();
 assert.equal(await page.locator('.deen-path-course-grid .deen-path-course-item').count(),7);
 assert.equal(await page.locator('.deen-path-course-grid .deen-path-course-item:disabled').count(),6,'Only first letter lesson unlocked');
 assert.match(await page.locator('.deen-path-arabic-landing > .deen-path-progress-copy').innerText(),/0 \/ 7/);
 await page.locator('.deen-path-atlas-details summary').click();
 assert.equal(await page.locator('.deen-path-atlas-details .deen-path-shape-entry').count(),28);
 assert.equal(await page.locator('.deen-path-shape-entry[data-letter-id="alif"] .is-unjoined').count(),1);
 assert.equal(await page.locator('.deen-path-shape-entry[data-letter-id="ba"] .is-unjoined').count(),0);
 for(let lesson=0;lesson<syllabus.length;lesson++){
  const target=page.locator('.deen-path-course-item[data-lesson-index="'+lesson+'"]');
  await target.click();
  assert.equal(await page.locator('.deen-path-letter-card').count(),syllabus[lesson].length);
  assert.equal(await page.locator('.deen-path-shape-entry').count(),syllabus[lesson].length);
  await page.locator('[data-qpath-action="start"]').click();
  for(let q=0;q<syllabus[lesson].length;q++){
   const correct=syllabus[lesson][q];
   assert.match(await page.locator('.deen-path-question-count').innerText(),new RegExp((q+1)+' / '+syllabus[lesson].length));
   if(lesson===0&&q===0){
    await page.locator('[data-qpath-action="answer"][data-letter-id="ba"]').click();
    assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
   }
   await page.locator('[data-qpath-action="answer"][data-letter-id="'+correct+'"]').click();
   assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
   await page.locator('[data-qpath-action="next"]').click();
  }
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().completedLessons),lesson+1);
  if(lesson<syllabus.length-1){
   await page.locator('[data-qpath-action="nextGroup"]').click();
   assert.equal(await page.locator('.deen-path-letter-card').count(),syllabus[lesson+1].length);
  }
  await page.locator('[data-qpath-action="arabic"]').click();
 }
 assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().letterCount),28);
 assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().completedLessons),7);
 assert.equal(await page.locator('.deen-path-course-grid .deen-path-course-item:disabled').count(),0);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_intro_v1')).completed),true,'Phase 1 progress compatible');
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')));
 assert.equal(stored.schema,2);
 assert.equal(stored.completed.length,7);
 // Quran engine can replace screen contents without breaking lesson state or duplicating UI.
 await page.evaluate(()=>{document.getElementById('leagueScreenBody').innerHTML='<div class="deen-quran-shell"><button id="surahAfterRerender">Memorization remains</button></div>'});
 await page.locator('.deen-path-course-item').first().waitFor();
 assert.equal(await page.locator('#deenQuranPathNav').count(),1);
 assert.equal(await page.locator('#surahAfterRerender').count(),1);
 await page.evaluate(()=>{document.documentElement.lang='fr';DEEN_QURAN_PATHS.home()});
 assert.match(await page.locator('.deen-path-title').innerText(),/Ton parcours/);
 await page.evaluate(()=>{document.documentElement.lang='ar';DEEN_QURAN_PATHS.enterArabic()});
 assert.match(await page.locator('.deen-path-atlas-details summary').innerText(),/٢٨/);
 // Restore old first-lesson-only users on upgrade from v1.
 await page.evaluate(()=>{
  localStorage.removeItem('deen_arabic_foundations_v2');
  document.documentElement.lang='tr';DEEN_QURAN_PATHS.enterArabic();
 });
 assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().completedLessons),1);
 assert.equal(await page.locator('.deen-path-course-grid .deen-path-course-item:disabled').count(),5,'Next letter lesson should be unlocked after phase 1 migration');
 assert.deepEqual(errors,[],'No browser exceptions');
 await browser.close();server.close();
 console.log('PASS QURAN ARABIC phase 2: 28 letters/7 lessons, shape atlas, nonjoin metadata, progression, preservation, TR/FR/AR');
})().catch(e=>{console.error(e);server.close();process.exit(1)});
