/* Real 320px Chrome gameplay plus persistent spaced evidence for Arabic V2. */
const {chromium}=require('playwright'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><h3>Surahs</h3></div></div></div></body></html>';
const server=http.createServer((_,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)});
(async()=>{
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:320,height:720}}),errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  await page.goto('http://127.0.0.1:'+server.address().port);
  await page.evaluate(()=>window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang});
  await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
  for(const file of ['quran-arabic-letters.js','quran-arabic-letter-audio.js','quran-arabic-questions-v2.js',
   'quran-arabic-questions-pack-a.js','quran-arabic-questions-pack-b.js','quran-arabic-harakat.js',
   'quran-arabic-questions-pack-c.js','quran-arabic-reading.js','quran-arabic-questions-pack-d.js',
   'quran-arabic-words.js','quran-arabic-questions-pack-e.js','quran-arabic-listening.js',
   'quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js',
   'quran-arabic-questions-pack-f.js','quran-arabic-mastery.js','quran-arabic-daily.js',
   'quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js',
   'quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-weekly-goals.js',
   'quran-arabic-paths.js'])await page.addScriptTag({path:path.join(root,'assets/i18n',file)});
  await page.evaluate(()=>{
   localStorage.setItem('deen_hearts_v1','29');
   DEEN_QURAN_PATHS.enterArabic();
   if(!DEEN_QURAN_PATHS.selectGroup(0)||!DEEN_QURAN_PATHS.start())throw Error('First lesson locked');
  });
  if(await page.locator('.deen-path-mini-tip').count())
   await page.locator('[data-qpath-action="tipDismiss"]').click();
  const prior=await page.evaluate(()=>localStorage.getItem('deen_arabic_foundations_v2'));
  for(const locale of ['tr','en','ar','de','fr']){
   await page.evaluate(locale=>{document.documentElement.lang=locale;DEEN_QURAN_PATHS.refresh()},locale);
   assert.ok((await page.locator('.deen-path-inner-title').innerText()).length>4);
  }
  await page.evaluate(()=>{document.documentElement.lang='ar';DEEN_QURAN_PATHS.refresh()});
  const bound=await page.locator('.deen-path-v2-lesson').boundingBox();
  assert.ok(bound&&bound.x>=-1&&bound.x+bound.width<=322,'320px RTL must fit');
  await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.refresh()});
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_v2_spaced_v1')),null);
  for(let i=0;i<10;i++){
   const q=await page.evaluate(()=>{
    const title=document.querySelector('.deen-path-inner-title').textContent,target=document.querySelector('.deen-v2-target').textContent;
    const item=DEEN_ARABIC_QUESTIONS_V2.poolFor('arabic-letters-01').find(x=>x.prompt.tr===title&&x.target===target);
    if(!item)throw Error('Question not found');
    return {correct:item.correctAnswer,wrong:item.choices.find(x=>x.id!==item.correctAnswer).id};
   });
   if(i===0){
    await page.locator('.deen-v2-option[data-choice-id="'+q.wrong+'"]').click();
    await page.locator('[data-qpath-action="v2Check"]').click();
    assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
   }
   await page.locator('.deen-v2-option[data-choice-id="'+q.correct+'"]').click();
   await page.locator('[data-qpath-action="v2Check"]').click();
   await page.locator('[data-qpath-action="next"]').click();
  }
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  const snapshot=await page.evaluate(()=>({
   rec:JSON.parse(localStorage.getItem('deen_arabic_v2_spaced_v1')),
   existing:localStorage.getItem('deen_arabic_foundations_v2'),hearts:localStorage.getItem('deen_hearts_v1')
  }));
  assert.equal(snapshot.rec.sessions.length,1);
  assert.equal(snapshot.rec.sessions[0].total,10);
  assert.equal(snapshot.rec.sessions[0].correct,9);
  assert.equal(Object.values(snapshot.rec.cards).filter(x=>x.mistakes>0).length,1);
  assert.equal(snapshot.hearts,'29');
  assert.notEqual(snapshot.existing,prior);
  assert.equal(JSON.parse(snapshot.existing).completed.length,1);
  assert.deepEqual(errors,[]);
  console.log('PASS ARABIC V2 SPACED CHROME: five locales, mobile 320 RTL, first-try mistakes, completed-session save and preserved hearts');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
