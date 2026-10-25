/* Stage20: real Chrome pre/post written assessment with 5 locales and isolated history. */
'use strict';
const {chromium}=require('playwright'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><meta name="viewport" content="width=device-width,initial-scale=1"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><h3>Surahs</h3></div></div></div></body></html>';
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
  const url='http://127.0.0.1:'+server.address().port;
  const inject=async()=>{
   await page.evaluate(()=>window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang});
   await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
   for(const name of modules)await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  };
  await page.goto(url);await inject();
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_QUESTIONS_V2.stats().questions),600);
  await page.evaluate(()=>localStorage.setItem('deen_hearts_v1','37'));
  await page.evaluate(()=>DEEN_QURAN_PATHS.enterArabic());
  assert.equal(await page.locator('.deen-path-assessment-section').count(),1);
  const original=await page.evaluate(()=>({
   xp:localStorage.getItem('deen_xp'),hearts:localStorage.getItem('deen_hearts_v1'),
   foundation:localStorage.getItem('deen_arabic_foundations_v2'),
   spaced:localStorage.getItem('deen_arabic_v2_spaced_v1')
  }));
  await page.locator('[data-qpath-action="assessment"]').click();
  assert.equal(await page.locator('.deen-path-assessment-landing').count(),1);
  await page.locator('[data-qpath-action="assessmentStart"]').click();
  assert.equal(await page.locator('.deen-path-assessment-question').count(),1);
  assert.equal(await page.locator('.deen-path-assessment-question .deen-path-question-count').innerText(),'Soru 1 / 8');
  for(const locale of ['tr','en','ar','de','fr']){
   await page.evaluate(locale=>{document.documentElement.lang=locale;DEEN_QURAN_PATHS.refresh()},locale);
   const title=await page.locator('.deen-path-assessment-question .deen-path-inner-title').innerText();
   assert.ok(title.length>6,'missing locale '+locale);
   assert.equal(await page.locator('.deen-v2-target').getAttribute('dir'),'rtl');
   assert.equal(await page.locator('.deen-path-assessment-question .deen-v2-option').count()>=3,true);
  }
  await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.refresh()});
  for(let i=0;i<8;i++){
   const answer=await page.evaluate(i=>DEEN_ARABIC_QUESTIONS_V2.assessment.questions('pre')[i].question.correctAnswer,i);
   await page.locator('[data-qpath-action="assessmentAnswer"][data-choice-id="'+answer+'"]').click();
  }
  assert.equal(await page.locator('.deen-path-assessment-landing').count(),1);
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_v2_assessment_v1')));
  assert.equal(stored.pre.answers.length,8);
  assert.equal(await page.locator('[data-qpath-action="assessmentStart"]').isDisabled(),true);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().assessment.pre.correct),8);
  const afterPre=await page.evaluate(()=>({
   xp:localStorage.getItem('deen_xp'),hearts:localStorage.getItem('deen_hearts_v1'),
   foundation:localStorage.getItem('deen_arabic_foundations_v2'),
   spaced:localStorage.getItem('deen_arabic_v2_spaced_v1')
  }));
  assert.deepEqual(afterPre,original,'pretest must not award XP, hearts or lesson completion');
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({
    schema:2,completed:[DEEN_ARABIC_LETTERS.lessons[0].id]
   }));
   DEEN_QURAN_PATHS.refresh();
  });
  assert.equal(await page.locator('[data-qpath-action="assessmentStart"]').isEnabled(),true);
  await page.locator('[data-qpath-action="assessmentStart"]').click();
  for(let i=0;i<8;i++){
   const wrong=await page.evaluate(i=>{
    const q=DEEN_ARABIC_QUESTIONS_V2.assessment.questions('post')[i].question;
    return q.choices.find(o=>o.id!==q.correctAnswer).id;
   },i);
   await page.locator('[data-qpath-action="assessmentAnswer"][data-choice-id="'+wrong+'"]').click();
  }
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().assessment.post.correct),0);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().assessment.delta),-8);
  assert.equal(await page.locator('.deen-path-assessment-landing').count(),1);
  await page.evaluate(()=>{document.documentElement.lang='ar';DEEN_QURAN_PATHS.refresh()});
  assert.ok((await page.locator('.deen-path-assessment-landing .deen-path-inner-title').innerText()).includes('العربية'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=320),true,'320px RTL no horizontal overflow');
  await page.reload();await inject();await page.evaluate(()=>DEEN_QURAN_PATHS.enterArabic());
  await page.locator('[data-qpath-action="assessment"]').click();
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().assessment.delta),-8,'persistent results after reload');
  assert.equal(await page.locator('[data-qpath-action="assessmentStart"]').count(),0,'completed pair cannot be replayed accidentally');
  assert.deepEqual(errors,[],'no JS runtime errors');
  console.log('PASS STAGE20 Chrome: 8+8 written pre/post, 5 languages, 320px RTL, no rewards, unlock gate, reload persistence');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
