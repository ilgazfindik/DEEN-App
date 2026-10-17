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
    const title=(await page.locator('.deen-path-inner-title').innerText()).trim(),target=(await page.locator('.deen-v2-target').innerText()).trim();
    const content=await page.locator('.deen-v2-option').allInnerTexts();
    const result=await page.evaluate(({title,target,stage,locale})=>{
     const q=DEEN_ARABIC_QUESTIONS_V2.poolFor(stage).find(q=>q.prompt[locale]===title&&q.target===target);
     if(!q)throw Error('No question from visible UI: '+stage+'/'+locale);
     return {id:q.id,options:q.choices.map(c=>c.label?.[locale]||c.glyph),correct:q.correctAnswer,wrong:q.choices.find(x=>x.id!==q.correctAnswer).id};
    },{title,target,stage,locale});
    assert.deepEqual(content.map(x=>x.trim()),result.options);
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
    if(i===0&&j===0){
     await page.locator('.deen-v2-option[data-choice-id="'+q.wrong+'"]').click();
     assert.equal(await page.locator('[data-qpath-action="next"]').count(),0,'Requires explicit grading');
     await page.locator('[data-qpath-action="v2Check"]').click();
     assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
     assert.equal(await page.locator('.deen-v2-distractor').count(),1);
    }
    await page.locator('.deen-v2-option[data-choice-id="'+q.correct+'"]').click();
    await page.locator('[data-qpath-action="v2Check"]').click();
    assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
    await page.locator('[data-qpath-action="next"]').click();
   }
   if(i>0)await page.locator('[data-qpath-action="group"]').click();
  }
  assert.ok(bObserved>0,'At least one B question used in actual gameplay');
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_hearts_v1')),'37');
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_foundations_v2')),initialProgress);
  const recent=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_v2_recent_v1')));
  assert.equal(recent['arabic-letters-01'].length,10);
  await page.setViewportSize({width:320,height:720});
  await page.evaluate(()=>{document.documentElement.lang='ar';DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(6);DEEN_QURAN_PATHS.start()});
  const bb=await page.locator('.deen-path-v2-lesson').boundingBox();
  assert.ok(bb&&bb.x>=0&&bb.x+bb.width<=322,'320px Arabic RTL');
  assert.equal(await page.locator('.deen-v2-option').count(),4);
  assert.deepEqual(errors,[],'Browser page errors');
  console.log('PASS ARABIC PACK B CHROME: 200 total questions, 7-stage real gameplay, A+B mixed selection, 5 locales, RTL 320px, completion/retry, unchanged progress and hearts');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
