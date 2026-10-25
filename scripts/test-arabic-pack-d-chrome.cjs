/* Real browser lesson 11–13: Pack D, 5 locales, complete 10 questions, progress preserved */
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
  for(const name of ['quran-arabic-letters.js','quran-arabic-letter-audio.js','quran-arabic-questions-v2.js','quran-arabic-questions-pack-a.js','quran-arabic-questions-pack-b.js','quran-arabic-harakat.js','quran-arabic-questions-pack-c.js','quran-arabic-reading.js','quran-arabic-questions-pack-d.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-weekly-goals.js','quran-arabic-paths.js'])
   await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_QUESTIONS_V2.stats().questions),400);
  const ids=await page.evaluate(()=>DEEN_ARABIC_READING.lessons.map(x=>x.id));
  assert.deepEqual(ids,['arabic-reading-sukun-01','arabic-reading-shadda-01','arabic-reading-madd-01']);
  await page.evaluate(()=>{
   localStorage.setItem('deen_hearts_v1','29');
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.map(x=>x.id)}));
  });
  const stored=await page.evaluate(()=>({
   letter:localStorage.getItem('deen_arabic_foundations_v2'),
   vowels:localStorage.getItem('deen_arabic_harakat_v1')}));
  for(let i=10;i<=12;i++){
   await page.evaluate(i=>{
    document.documentElement.lang='tr';
    if(i>10)localStorage.setItem('deen_arabic_reading_v1',JSON.stringify({
     schema:1,completed:DEEN_ARABIC_READING.lessons.slice(0,i-10).map(x=>x.id)
    }));
    DEEN_QURAN_PATHS.enterArabic();
    if(!DEEN_QURAN_PATHS.selectGroup(i)||!DEEN_QURAN_PATHS.start())
     throw Error('Locked reading lesson '+i);
   },i);
   if(await page.locator('.deen-path-mini-tip').count())
    await page.locator('[data-qpath-action="tipDismiss"]').click();
   assert.equal(await page.locator('.deen-path-v2-lesson').count(),1);
   assert.ok((await page.locator('.deen-path-question-count').innerText()).includes('1 / 10'));
   const stage=ids[i-10];
   async function verify(locale){
    const title=(await page.locator('.deen-path-inner-title').innerText()).trim();
    const target=(await page.locator('.deen-v2-target').innerText()).trim();
    const options=(await page.locator('.deen-v2-label').allInnerTexts()).map(s=>s.trim());
    const q=await page.evaluate(({title,target,stage,locale})=>{
     const a=DEEN_ARABIC_QUESTIONS_V2.poolFor(stage).find(x=>x.prompt[locale]===title&&x.target===target);
     if(!a)throw Error('Could not identify real Pack D question: '+stage+'/'+locale);
     return {id:a.id,correct:a.correctAnswer,wrong:a.choices.find(x=>x.id!==a.correctAnswer).id,choices:a.choices.map(x=>x.glyph)};
    },{title,target,stage,locale});
    assert.deepEqual(options,q.choices);
    assert.equal(await page.locator('.deen-v2-target').getAttribute('dir'),'rtl');
    return q;
   }
   for(const locale of ['tr','en','ar','de','fr']){
    await page.evaluate(l=>{document.documentElement.lang=l;DEEN_QURAN_PATHS.refresh()},locale);
    await verify(locale);
   }
   await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.refresh()});
   const seen=new Set();
   for(let j=0;j<(i===10?10:1);j++){
    const q=await verify('tr');
    assert.ok(!seen.has(q.id),'Repeated question ID in session');seen.add(q.id);
    assert.ok(q.id.startsWith('pack-d-'),'Real Pack D item');
    if(j===0){
     await page.locator('.deen-v2-option[data-choice-id="'+q.wrong+'"]').click();
     await page.locator('[data-qpath-action="v2Check"]').click();
     assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
     assert.equal(await page.locator('.deen-v2-distractor').count(),1);
    }
    await page.locator('.deen-v2-option[data-choice-id="'+q.correct+'"]').click();
    await page.locator('[data-qpath-action="v2Check"]').click();
    assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
    await page.locator('[data-qpath-action="next"]').click();
   }
   if(i===10){
    const completed=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_reading_v1')).completed);
    assert.ok(completed.includes(ids[0]),'Real 10-question reading lesson completion');
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_v2_recent_v1'))['arabic-reading-sukun-01'].length),10);
   }else await page.locator('[data-qpath-action="group"]').click();
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_hearts_v1')),'29');
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_foundations_v2')),stored.letter);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_harakat_v1')),stored.vowels);
  await page.setViewportSize({width:320,height:720});
  await page.evaluate(()=>{document.documentElement.lang='ar';DEEN_QURAN_PATHS.enterArabic();if(!DEEN_QURAN_PATHS.selectGroup(12)||!DEEN_QURAN_PATHS.start())throw Error('Mobile lesson locked')});
  const rect=await page.locator('.deen-path-v2-lesson').boundingBox();
  assert.ok(rect&&rect.x>=0&&rect.x+rect.width<=322);
  assert.equal(await page.locator('.deen-v2-option').count(),4);
  assert.deepEqual(errors,[]);
  console.log('PASS ARABIC PACK D CHROME: 400 questions, stages 11–13, 5 locales, RTL 320px, wrong retry, 10-question completion, legacy heart/progress preserved');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
