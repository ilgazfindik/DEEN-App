/* Real browser: 8–10 vowel/short-syllable lessons use 100 Pack C questions. */
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
  for(const name of ['quran-arabic-letters.js','quran-arabic-letter-audio.js','quran-arabic-questions-v2.js','quran-arabic-questions-pack-a.js','quran-arabic-questions-pack-b.js','quran-arabic-harakat.js','quran-arabic-questions-pack-c.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-weekly-goals.js','quran-arabic-paths.js'])
   await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_QUESTIONS_V2.stats().questions),300);
  await page.evaluate(()=>{
   localStorage.setItem('deen_hearts_v1','37');
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)}));
  });
  const letterProgress=await page.evaluate(()=>localStorage.getItem('deen_arabic_foundations_v2'));
  for(let i=7;i<=9;i++){
   await page.evaluate(i=>{
    document.documentElement.lang='tr';
    if(i>7)localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({
     schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.slice(0,i-7).map(x=>x.id)
    }));
    DEEN_QURAN_PATHS.enterArabic();
    if(!DEEN_QURAN_PATHS.selectGroup(i)||!DEEN_QURAN_PATHS.start())throw Error('Locked phonics '+i);
   },i);
   if(await page.locator('.deen-path-mini-tip').count())await page.locator('[data-qpath-action="tipDismiss"]').click();
   assert.equal(await page.locator('.deen-path-v2-lesson').count(),1);
   assert.ok((await page.locator('.deen-path-question-count').innerText()).includes('1 / 10'));
   const stage='arabic-harakat-0'+String(i-6);
   const verify=async(lang)=>{
    const title=(await page.locator('.deen-path-inner-title').innerText()).trim(),target=(await page.locator('.deen-v2-target').innerText()).trim();
    const options=(await page.locator('.deen-v2-label').allInnerTexts()).map(x=>x.trim());
    const row=await page.evaluate(({title,target,stage,lang})=>{
     const q=DEEN_ARABIC_QUESTIONS_V2.poolFor(stage).find(x=>x.prompt[lang]===title&&x.target===target);
     if(!q)throw Error('Question not rendered for '+stage+'/'+lang);
     return {id:q.id,correct:q.correctAnswer,wrong:q.choices.find(x=>x.id!==q.correctAnswer).id,choices:q.choices.map(x=>x.glyph)};
    },{title,target,stage,lang});
    assert.deepEqual(options,row.choices);
    assert.equal(await page.locator('.deen-v2-target').getAttribute('dir'),'rtl');
    return row;
   };
   for(const lang of ['tr','en','ar','de','fr']){
    await page.evaluate(lang=>{document.documentElement.lang=lang;DEEN_QURAN_PATHS.refresh()},lang);
    await verify(lang);
   }
   await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.refresh()});
   const seen=new Set(),rounds=i===7?10:1;
   for(let n=0;n<rounds;n++){
    const q=await verify('tr');
    assert.ok(!seen.has(q.id),'No duplicate question in 10-question session');seen.add(q.id);
    assert.ok(q.id.startsWith('pack-c-'));
    if(n===0){
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
   if(i===7){
    const completed=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_harakat_v1')).completed);
    assert.ok(completed.includes('arabic-harakat-01'),'10 correct answers complete the first phonics lesson');
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_v2_recent_v1'))['arabic-harakat-01'].length),10);
   }else await page.locator('[data-qpath-action="group"]').click();
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_hearts_v1')),'37');
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_foundations_v2')),letterProgress);
  await page.setViewportSize({width:320,height:720});
  await page.evaluate(()=>{
   document.documentElement.lang='ar';DEEN_QURAN_PATHS.enterArabic();
   if(!DEEN_QURAN_PATHS.selectGroup(9)||!DEEN_QURAN_PATHS.start())throw Error('locked mobile RTL');
  });
  const bounds=await page.locator('.deen-path-v2-lesson').boundingBox();
  assert.ok(bounds&&bounds.x>=0&&bounds.x+bounds.width<=322,'Arabic mobile 320px');
  assert.equal(await page.locator('.deen-v2-option').count(),3);
  assert.deepEqual(errors,[]);
  console.log('PASS ARABIC PACK C CHROME: 300 total, actual 8–10 lesson gameplay, five locales, 10 correct/grading, 320px RTL and previous heart/letter progress');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
