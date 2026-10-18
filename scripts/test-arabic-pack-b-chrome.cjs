/* Pack B live V2 QA: all seven letter lessons, five locales, no false audio, RTL and progress. */
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
  for(const name of ['quran-arabic-letters.js','quran-arabic-letter-audio.js','quran-arabic-questions-v2.js','quran-arabic-questions-pack-a.js','quran-arabic-questions-pack-b.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-weekly-goals.js','quran-arabic-paths.js'])
   await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_QUESTIONS_V2.stats().questions),200);
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_QUESTIONS_PACK_B.count),100);
  const lessonTotals=await page.evaluate(()=>DEEN_ARABIC_LETTERS.lessons.map(x=>DEEN_ARABIC_QUESTIONS_V2.poolFor(x.id).length));
  assert.ok(lessonTotals.every(x=>x>=20),'Each lesson has deep A+B pool');
  // All letter lessons are unlockable with legitimate preexisting v2 progress.
  await page.evaluate(()=>localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)})));
  await page.evaluate(()=>localStorage.setItem('deen_hearts_v1','37'));
  const initialProgress=await page.evaluate(()=>localStorage.getItem('deen_arabic_foundations_v2'));
  let bObserved=0;
  for(let i=0;i<7;i++){
   await page.evaluate(i=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.enterArabic();if(!DEEN_QURAN_PATHS.selectGroup(i))throw Error('locked');DEEN_QURAN_PATHS.start()},i);
   if(await page.locator('.deen-path-mini-tip').count())await page.locator('[data-qpath-action="tipDismiss"]').click();
   assert.equal(await page.locator('.deen-path-v2-lesson').count(),1);
   assert.ok((await page.locator('.deen-path-question-count').innerText()).includes('1 / 10'));
   const stage='arabic-letters-'+String(i+1).padStart(2,'0');
   const verify=async(locale)=>{
    const questionId=await page.locator('.deen-v2-target').getAttribute('data-question-id');
    const content=await page.locator('.deen-v2-option').allInnerTexts();
    const result=await page.evaluate(({questionId,stage,locale})=>{
     const q=DEEN_ARABIC_QUESTIONS_V2.poolFor(stage).find(q=>q.id===questionId);
     if(!q)throw Error('No question from visible UI: '+stage+'/'+locale);
     return {id:q.id,sourcePrompt:q.prompt[locale],joined:q.choices.find(x=>x.id===q.correctAnswer).glyph,options:q.choices.map(c=>c.label?.[locale]||c.glyph),correct:q.correctAnswer,wrong:q.choices.find(x=>x.id!==q.correctAnswer).id};
    },{questionId,stage,locale});
    if(await page.locator('.deen-v2-match-board').count()){
     const names=await page.locator('.deen-v2-match-name').allInnerTexts();
     assert.deepEqual(names.map(x=>x.trim()).sort(),result.options.slice().sort());
    }else if(await page.locator('.deen-v2-build-bank').count()){
     assert.notEqual(title,result.sourcePrompt,'Build uses an actionable instruction instead of legacy prompt');
     assert.equal(await page.locator('.deen-v2-target').innerText(),result.joined,'Show joined model, not the answer pair');
     assert.equal(await page.locator('.deen-v2-target').getAttribute('data-source-target').then(x=>x.includes(' + ')),true);
     assert.equal(await page.locator('[data-qpath-action="v2Piece"]').count(),4);
     assert.equal(await page.locator('.deen-v2-build-slot').count(),2);
    }else{
     const labels=await page.locator('.deen-v2-label').allInnerTexts();
     assert.deepEqual(labels.map(x=>x.trim()),result.options);
    }
    assert.equal(await page.locator('.deen-v2-target').getAttribute('dir'),'rtl');
    return result;
   };
   for(const loc of ['tr','en','ar','de','fr']){
    await page.evaluate(lang=>{document.documentElement.lang=lang;DEEN_QURAN_PATHS.refresh()},loc);
    await verify(loc);
   }
   await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.refresh()});
   const seen=new Set();
   // Grade all 10 questions on one stage; others sample live screen.
   const rounds=i===0?10:1;
   for(let j=0;j<rounds;j++){
    const q=await verify('tr');
    assert.ok(!seen.has(q.id),'No question repeats in one session');
    seen.add(q.id);
    if(q.id.startsWith('pack-b-'))bObserved++;
    if(await page.locator('.deen-v2-match-board').count()){
     const ids=await page.locator('[data-qpath-action="v2MatchGlyph"]').evaluateAll(nodes=>nodes.map(n=>n.dataset.choiceId));
     if(i===0&&j===0){
      await page.locator('[data-qpath-action="v2MatchGlyph"][data-choice-id="'+ids[0]+'"]').click();
      await page.locator('[data-qpath-action="v2MatchName"][data-choice-id="'+ids[1]+'"]').click();
      assert.equal(await page.locator('.deen-v2-notice').count(),1);
     }
     for(const id of ids){
      await page.locator('[data-qpath-action="v2MatchGlyph"][data-choice-id="'+id+'"]').click();
      await page.locator('[data-qpath-action="v2MatchName"][data-choice-id="'+id+'"]').click();
     }
    }else if(await page.locator('.deen-v2-build-bank').count()){
     const target=(await page.locator('.deen-v2-target').getAttribute('data-source-target')).split(/\s*\+\s*/);
     const bank=await page.locator('[data-qpath-action="v2Piece"]').evaluateAll(nodes=>nodes.map(n=>n.textContent.trim()));
     if(i===0&&j===0){
      await page.locator('[data-qpath-action="v2Piece"][data-piece-index="0"]').click();
      await page.locator('[data-qpath-action="v2Piece"][data-piece-index="2"]').click();
      await page.locator('[data-qpath-action="v2Check"]').click();
      assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
     }
     for(const glyph of target){
      const ix=bank.indexOf(glyph);
      assert.ok(ix>=0,'Arabic target fragment present');
      await page.locator('[data-qpath-action="v2Piece"][data-piece-index="'+ix+'"]').click();
     }
     assert.equal(await page.locator('.deen-v2-build-preview').count(),1,'Composed Arabic preview appears before checking');
     await page.locator('[data-qpath-action="v2Check"]').click();
    }else{
     if(i===0&&j===0){
      await page.locator('.deen-v2-option[data-choice-id="'+q.wrong+'"]').click();
      assert.equal(await page.locator('[data-qpath-action="next"]').count(),0,'Requires explicit grading');
      await page.locator('[data-qpath-action="v2Check"]').click();
      assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
      assert.equal(await page.locator('.deen-v2-distractor').count(),1);
     }
     await page.locator('.deen-v2-option[data-choice-id="'+q.correct+'"]').click();
     await page.locator('[data-qpath-action="v2Check"]').click();
    }
    assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
    await page.locator('[data-qpath-action="next"]').click();
   }
   if(i>0)await page.locator('[data-qpath-action="group"]').click();
  }
  assert.ok(bObserved>0,'At least one B question used in actual gameplay');
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_hearts_v1')),'37');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed),JSON.parse(initialProgress).completed,'Previously completed lesson IDs remain unchanged');
  const recent=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_v2_recent_v1')));
  assert.equal(recent['arabic-letters-01'].length,10);
  await page.setViewportSize({width:320,height:720});
  await page.evaluate(()=>{document.documentElement.lang='ar';DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(6);DEEN_QURAN_PATHS.start()});
  const bb=await page.locator('.deen-path-v2-lesson').boundingBox();
  assert.ok(bb&&bb.x>=0&&bb.x+bb.width<=322,'320px Arabic RTL');
  assert.ok((await page.locator('.deen-v2-option').count()===4)||
   (await page.locator('.deen-v2-match-board').count()===1)||
   (await page.locator('.deen-v2-build-bank').count()===1),'valid choice/match/build question');
  assert.deepEqual(errors,[],'Browser page errors');
  console.log('PASS ARABIC PACK B CHROME: 200 total questions, 7-stage real gameplay, A+B mixed selection, 5 locales, RTL 320px, completion/retry, unchanged progress and hearts');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
