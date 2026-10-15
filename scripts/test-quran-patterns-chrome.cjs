/* DEEN Arabic Phase 9: 12 pattern exercises + personalized weak-card regression */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="surahOriginal">Existing Surah Course</button></div></div></div></body></html>';
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
  for(const file of ['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-remediation.js','quran-arabic-paths.js'])
   await page.addScriptTag({path:path.join(root,'assets/i18n',file)});
  const curriculum=await page.evaluate(()=>({
   version:DEEN_QURAN_PATHS.version,total:DEEN_QURAN_PATHS.status().overallLessonCount,
   lessons:DEEN_ARABIC_PATTERNS.lessons.map(x=>({id:x.id,index:x.index,kind:x.kind,items:x.items.map(i=>({id:i.id,glyph:i.glyph,reference:i.reference,excerpt:i.excerpt,gloss:i.gloss,role:i.role}))})),
   review:DEEN_ARABIC_PATTERNS.reviewCards.map(x=>x.id)
  }));
  assert.equal(curriculum.version,'quran-arabic-paths-phase15');
  assert.equal(curriculum.total,27);
  assert.deepEqual(curriculum.lessons.map(x=>x.index),[24,25,26]);
  assert.deepEqual(curriculum.lessons.map(x=>x.items.length),[4,4,4]);
  assert.equal(curriculum.review.length,8);
  for(const lesson of curriculum.lessons)for(const item of lesson.items){
   assert.ok(item.excerpt.includes(item.glyph),item.id);
   for(const lang of ['tr','en','ar','de','fr']){
    assert.ok(item.gloss[lang],item.id+' gloss '+lang);
    if(item.role)assert.ok(item.role[lang],item.id+' role '+lang);
   }
  }
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.locator('.deen-path-pattern-item:disabled').count(),3);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(24)),false);
  // Existing phase-8 user: old 7 study cards and all 22 playable lessons stay intact.
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_reading_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_READING.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_words_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_WORDS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_meaning_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_MEANING.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_phrases_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_PHRASES.lessons.map(x=>x.id)}));
   const cards={};for(const id of DEEN_ARABIC_PHRASES.cardIds)cards[id]={step:1,dueAt:Date.now()+5*86400000,updatedAt:Date.now(),lastResult:'good',mistakes:0,attempts:2};
   localStorage.setItem('deen_arabic_written_review_v1',JSON.stringify({schema:1,cards}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  assert.equal(await page.locator('.deen-path-pattern-item:disabled').count(),2);
  assert.equal(await page.locator('.deen-path-listening-item:disabled').count(),2);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().reviewTracked),7);
  for(let li=0;li<3;li++){
   await page.locator('.deen-path-pattern-item[data-lesson-index="'+(24+li)+'"]').click();
   await page.locator('[data-qpath-action="start"]').click();
   const items=curriculum.lessons[li].items;
   for(let q=0;q<items.length;q++){
    assert.match(await page.locator('.deen-path-question-count').innerText(),new RegExp((q+1)+' / 4'));
    const wrong=items[(q+1)%4].id,correct=items[q].id;
    await page.locator('[data-qpath-action="answer"][data-letter-id="'+wrong+'"]').click();
    assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
    await page.locator('[data-qpath-action="answer"][data-letter-id="'+correct+'"]').click();
    assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
    await page.locator('[data-qpath-action="next"]').click();
   }
   assert.equal(await page.locator('.deen-path-completion').count(),1);
   assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().patternCompletedLessons),li+1);
   await page.locator('[data-qpath-action="arabic"]').click();
  }
  assert.equal(await page.locator('.deen-path-pattern-item:disabled').count(),0);
  assert.equal(await page.locator('.deen-path-listening-item:disabled').count(),2,'Ungrounded recitation still locked');
  const oldAndNew=await page.evaluate(()=>{
   const cards=JSON.parse(localStorage.getItem('deen_arabic_written_review_v1')).cards;
   return {
    old:DEEN_ARABIC_PHRASES.cardIds.map(id=>cards[id]),
    fresh:DEEN_ARABIC_PATTERNS.cardIds.map(id=>cards[id]),
    pattern:JSON.parse(localStorage.getItem('deen_arabic_patterns_v1')).completed,
    audio:localStorage.getItem('deen_arabic_listening_v1'),
    status:DEEN_QURAN_PATHS.status()
   };
  });
  assert.equal(oldAndNew.old.length,7);
  assert.ok(oldAndNew.old.every(x=>x.step===1&&x.mistakes===0),'Older reviews preserved');
  assert.equal(oldAndNew.fresh.length,8);
  assert.ok(oldAndNew.fresh.every(x=>x.mistakes>=1&&x.dueAt>Date.now()));
  assert.deepEqual(oldAndNew.pattern,curriculum.lessons.map(x=>x.id));
  assert.equal(oldAndNew.audio,null);
  assert.equal(oldAndNew.status.reviewTracked,15);
  assert.equal(oldAndNew.status.reviewWeak,8);
  assert.equal(oldAndNew.status.reviewDue,0);
  assert.equal(await page.locator('[data-qpath-action="startWeakReview"]').count(),1);
  // Weak-only practice can run BEFORE cards are due.
  await page.locator('[data-qpath-action="startWeakReview"]').click();
  assert.equal(await page.locator('.deen-path-review-lesson').count(),1);
  await page.locator('[data-qpath-action="reviewAnswer"][data-letter-id="'+curriculum.lessons[0].items[0].id+'"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
  await page.locator('[data-qpath-action="arabic"]').click();
  // Two due cards from the same vocabulary pool: older mistake-heavy item should come first.
  const seed=await page.evaluate(ids=>{
   const v=JSON.parse(localStorage.getItem('deen_arabic_written_review_v1')),now=Date.now();
   v.cards[ids[0]].dueAt=now-1000;v.cards[ids[0]].mistakes=2;
   v.cards[ids[1]].dueAt=now-5000;v.cards[ids[1]].mistakes=5;
   localStorage.setItem('deen_arabic_written_review_v1',JSON.stringify(v));DEEN_QURAN_PATHS.enterArabic();
   return {first:v.cards[ids[0]],second:v.cards[ids[1]]};
  },curriculum.review.slice(0,2));
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().reviewDue),2);
  await page.locator('[data-qpath-action="startReview"]').click();
  const currentPrompt=await page.locator('.deen-path-phrase-hint').innerText();
  assert.equal(currentPrompt,curriculum.lessons[0].items[1].gloss.tr,'Weakest due item should be first');
  await page.locator('[data-qpath-action="reviewAnswer"][data-letter-id="'+curriculum.review[1]+'"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
  await page.locator('[data-qpath-action="reviewNext"]').click();
  await page.locator('[data-qpath-action="reviewAnswer"][data-letter-id="'+curriculum.review[0]+'"]').click();
  await page.locator('[data-qpath-action="reviewNext"]').click();
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().reviewDue),0);
  for(const lang of ['tr','en','ar','de','fr']){
   await page.evaluate(lang=>{document.documentElement.lang=lang;DEEN_QURAN_PATHS.enterArabic()},lang);
   assert.ok((await page.locator('.deen-path-pattern-section h3').innerText()).length>5);
   assert.ok((await page.locator('.deen-path-spaced-section h3').innerText()).length>5);
   await page.locator('.deen-path-pattern-item[data-lesson-index="26"]').click();
   await page.locator('[data-qpath-action="start"]').click();
   assert.ok((await page.locator('.deen-path-phrase-option').first().innerText()).length>4);
   await page.locator('[data-qpath-action="group"]').click();
   await page.locator('[data-qpath-action="arabic"]').click();
  }
  await page.locator('[data-qpath-action="home"]').click();
  await page.locator('[data-qpath-action="surah"]').click();
  assert.equal(await page.locator('#surahOriginal').count(),1);
  assert.deepEqual(errors,[]);
  console.log('PASS QURAN PATTERNS PHASE9: 12 exercises, 15 migrated cards, 8 weak, due prioritization, 5 locales, preserved surahs');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
