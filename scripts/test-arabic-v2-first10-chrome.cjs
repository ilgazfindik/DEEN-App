/* Stage21: real user journey milestones; on-device only, no telemetry. */
'use strict';
const {chromium}=require('playwright'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><meta name="viewport" content="width=device-width,initial-scale=1"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"></div></div></div></body></html>';
const server=http.createServer((_,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)});
const modules=['quran-arabic-letters.js','quran-arabic-letter-audio.js','quran-arabic-questions-v2.js',
 'quran-arabic-questions-pack-a.js','quran-arabic-questions-pack-b.js','quran-arabic-harakat.js',
 'quran-arabic-questions-pack-c.js','quran-arabic-reading.js','quran-arabic-questions-pack-d.js',
 'quran-arabic-words.js','quran-arabic-questions-pack-e.js','quran-arabic-listening.js',
 'quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js',
 'quran-arabic-questions-pack-f.js','quran-arabic-mastery.js','quran-arabic-daily.js',
 'quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js',
 'quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-weekly-goals.js','quran-arabic-paths.js'];
(async()=>{
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:320,height:740},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port);
  await page.evaluate(()=>window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang});
  await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
  for(const file of modules)await page.addScriptTag({path:path.join(root,'assets/i18n',file)});
  await page.evaluate(()=>{
   localStorage.setItem('deen_hearts_v1','24');
   DEEN_QURAN_PATHS.enterArabic();
  });
  assert.equal(await page.locator('.deen-path-first10').count(),1);
  let record=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_first10_v1')));
  assert.ok(record.at>0);assert.equal(record.lesson,0);assert.equal(record.correct,0);assert.equal(record.finished,0);assert.equal(record.exits,0);
  for(const locale of ['tr','en','ar','de','fr']){
   await page.evaluate(locale=>{document.documentElement.lang=locale;DEEN_QURAN_PATHS.refresh()},locale);
   assert.ok((await page.locator('.deen-path-first10 h3').innerText()).length>5);
  }
  await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.refresh()});
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(0)),true);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.start()),true);
  record=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_first10_v1')));
  assert.ok(record.lesson>=record.at);
  if(await page.locator('.deen-path-mini-tip').count())await page.locator('[data-qpath-action="tipDismiss"]').click();
  const correctChoice=async()=>{
   const prompt=(await page.locator('.deen-path-v2-lesson .deen-path-inner-title').innerText()).trim();
   const target=(await page.locator('.deen-path-v2-lesson .deen-v2-target').innerText()).trim();
   return page.evaluate(({prompt,target})=>{
    const pool=DEEN_ARABIC_QUESTIONS_V2.poolFor('arabic-letters-01');
    const candidates=pool.filter(q=>q.prompt.tr===prompt&&q.target===target);
    if(candidates.length!==1)throw Error('Ambiguous live question lookup: '+prompt+' / '+target+' matches '+candidates.length);
    return candidates[0].correctAnswer;
   },{prompt,target});
  };
  for(let i=0;i<10;i++){
   const choice=await correctChoice();
   await page.locator('[data-qpath-action="v2Choice"][data-choice-id="'+choice+'"]').click();
   await page.locator('[data-qpath-action="v2Check"]').click();
   assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
   await page.locator('[data-qpath-action="next"]').click();
  }
  record=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_first10_v1')));
  assert.ok(record.correct>=record.at);assert.ok(record.finished>=record.at);
  assert.equal(record.exits,0);
  await page.evaluate(()=>DEEN_QURAN_PATHS.enterArabic());
  assert.equal(await page.locator('.deen-path-first10-step').count(),4);
  await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(0));
  await page.evaluate(()=>DEEN_QURAN_PATHS.start());
  await page.locator('[data-qpath-action="group"]').first().click();
  record=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_first10_v1')));
  assert.equal(record.exits,1,'abandoned new lesson counted only on back navigation');
  await page.evaluate(()=>{
   const key='deen_arabic_first10_v1',x=JSON.parse(localStorage.getItem(key));
   x.at=Date.now()-600001;x.lesson=0;x.correct=0;x.finished=0;
   localStorage.setItem(key,JSON.stringify(x));
   DEEN_QURAN_PATHS.enterArabic();
   DEEN_QURAN_PATHS.selectGroup(0);DEEN_QURAN_PATHS.start();
  });
  const expired=await page.evaluate(()=>localStorage.getItem('deen_arabic_first10_v1'));
  assert.equal(JSON.parse(expired).lesson,0,'expired window cannot forge later milestones');
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_hearts_v1')),'24');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=320),true);
  assert.deepEqual(errors,[]);
  console.log('PASS STAGE21 FIRST10 Chrome: first visit, first lesson, written correct, completion, exit, five locales, 320px, expiry, isolated hearts');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
