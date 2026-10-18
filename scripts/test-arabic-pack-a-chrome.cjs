/* Live DEEN letter lessons must use actual Pack A content, not fixture questions. */
const {chromium}=require('playwright'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><h3>Surahs</h3></div></div></div></body></html>';
const server=http.createServer((_,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)});
(async()=>{
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:375,height:812}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port);
  await page.evaluate(()=>window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang});
  await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
  for(const name of ['quran-arabic-letters.js','quran-arabic-letter-audio.js','quran-arabic-questions-v2.js','quran-arabic-questions-pack-a.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-weekly-goals.js','quran-arabic-paths.js'])
   await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_QUESTIONS_V2.stats().questions),100);
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_QUESTIONS_PACK_A.count),100);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().completedLessons),0);
  await page.evaluate(()=>{localStorage.setItem('deen_hearts_v1','37');DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(0)});
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-mini-tip').count(),1,'Existing first-run lesson note retained');
  await page.locator('[data-qpath-action="tipDismiss"]').click();
  assert.equal(await page.locator('.deen-path-v2-lesson').count(),1);
  assert.ok((await page.locator('.deen-path-question-count').innerText()).includes('1 / 10'));
  // Five full UI locales and option translations, retaining Arabic text.
  for(const locale of ['tr','en','ar','de','fr']){
   await page.evaluate(locale=>{document.documentElement.lang=locale;DEEN_QURAN_PATHS.refresh()},locale);
   const title=(await page.locator('.deen-path-inner-title').innerText()).trim();
   const questionId=await page.locator('.deen-v2-target').getAttribute('data-question-id');
   const items=await page.locator('.deen-v2-option').allInnerTexts();
   const result=await page.evaluate(({questionId,locale})=>{
    const q=DEEN_ARABIC_QUESTIONS_V2.poolFor('arabic-letters-01').find(q=>q.id===questionId);
    if(!q)throw Error('No visible V2 question for '+locale);
    return {choices:q.choices.map(c=>c.label?.[locale]||c.glyph),sourcePrompt:q.prompt[locale]};
   },{questionId,locale});
   if(await page.locator('.deen-v2-match-board').count()){
    assert.notEqual(title,result.sourcePrompt,'Match prompt describes four pairs');
    const labels=await page.locator('.deen-v2-match-name').allInnerTexts();
    assert.deepEqual(labels.map(x=>x.trim()).sort(),result.choices.slice().sort());
   }else assert.deepEqual(await page.locator('.deen-v2-label').allInnerTexts().then(a=>a.map(x=>x.trim())),result.choices);
   assert.equal(await page.locator('.deen-v2-target').getAttribute('dir'),'rtl');
  }
  await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.refresh()});
  const answered=new Set();
  for(let i=0;i<10;i++){
   const title=(await page.locator('.deen-path-inner-title').innerText()).trim();
   const questionId=await page.locator('.deen-v2-target').getAttribute('data-question-id');
   const q=await page.evaluate(({questionId})=>{
    const x=DEEN_ARABIC_QUESTIONS_V2.poolFor('arabic-letters-01').find(q=>q.id===questionId);
    if(!x)throw Error('Could not find question from live DOM');
    return {id:x.id,correct:x.correctAnswer,wrong:x.choices.find(c=>c.id!==x.correctAnswer).id};
   },{questionId});
   assert.ok(!answered.has(q.id),'No repeated question ID in session');
   answered.add(q.id);
   if(await page.locator('.deen-v2-match-board').count()){
    const ids=await page.locator('[data-qpath-action="v2MatchGlyph"]').evaluateAll(nodes=>nodes.map(n=>n.dataset.choiceId));
    if(i===0){
     const wrong=ids.find(id=>id!==ids[0]);
     await page.locator('[data-qpath-action="v2MatchGlyph"][data-choice-id="'+ids[0]+'"]').click();
     await page.locator('[data-qpath-action="v2MatchName"][data-choice-id="'+wrong+'"]').click();
     assert.equal(await page.locator('.deen-v2-notice').count(),1);
     assert.equal(await page.locator('[data-qpath-action="next"]').count(),0);
    }
    for(const id of ids){
     await page.locator('[data-qpath-action="v2MatchGlyph"][data-choice-id="'+id+'"]').click();
     await page.locator('[data-qpath-action="v2MatchName"][data-choice-id="'+id+'"]').click();
    }
   }else{
    if(i===0){
     await page.locator('.deen-v2-option[data-choice-id="'+q.wrong+'"]').click();
     assert.equal(await page.locator('[data-qpath-action="next"]').count(),0,'A selected choice is not graded');
     await page.locator('[data-qpath-action="v2Check"]').click();
     assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
     assert.equal(await page.locator('.deen-v2-distractor').count(),1,'Every distractor has localized feedback');
    }
    await page.locator('.deen-v2-option[data-choice-id="'+q.correct+'"]').click();
    await page.locator('[data-qpath-action="v2Check"]').click();
   }
   assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
   await page.locator('[data-qpath-action="next"]').click();
  }
  assert.equal(answered.size,10);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().completedLessons),1);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_hearts_v1')),'37','Legacy hearts preserved');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_v2_recent_v1'))['arabic-letters-01'].length),10);
  // Seed older progress: select all 7 independently, confirm new V2 and no empty lesson.
  await page.evaluate(()=>localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)})));
  for(let i=1;i<7;i++){
   const status=await page.evaluate(i=>{DEEN_QURAN_PATHS.enterArabic();return {unlocked:DEEN_QURAN_PATHS.selectGroup(i),start:DEEN_QURAN_PATHS.start()}},i);
   assert.equal(status.unlocked,true);
   assert.equal(status.start,true);
   const tip=page.locator('.deen-path-mini-tip');
   if(await tip.count())await page.locator('[data-qpath-action="tipDismiss"]').click();
   assert.equal(await page.locator('.deen-path-v2-lesson').count(),1,'V2 on alphabet lesson '+(i+1));
   assert.ok((await page.locator('.deen-path-question-count').innerText()).includes('1 / 10'));
   await page.locator('[data-qpath-action="group"]').click();
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_hearts_v1')),'37');
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_QUESTIONS_V2.stats().questions),100);
  await page.setViewportSize({width:320,height:720});
  await page.evaluate(()=>{document.documentElement.lang='ar';DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(6);DEEN_QURAN_PATHS.start()});
  const bb=await page.locator('.deen-path-v2-lesson').boundingBox();
  assert.ok(bb&&bb.x>=0&&bb.x+bb.width<=322,'320px RTL quiz fits');
  assert.deepEqual(errors,[]);
  console.log('PASS ARABIC PACK A CHROME: 100 real production questions in all 7 lessons, 10-question gameplay, 5 locales, 320px Arabic RTL, checked grading and wrong feedback, local progress/hearts unchanged');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
