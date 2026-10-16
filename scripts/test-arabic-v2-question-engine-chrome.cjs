/* Step 06: real V2 browser workflow, atomic validation and legacy progression. */
const {chromium}=require('playwright'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="oldSurah">Surah</button></div></div></div></body></html>';
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
  for(const name of ['quran-arabic-letters.js','quran-arabic-letter-audio.js','quran-arabic-questions-v2.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-weekly-goals.js','quran-arabic-paths.js'])
   await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  const data=await page.evaluate(()=>{
   const api=DEEN_ARABIC_QUESTIONS_V2,letters=DEEN_ARABIC_LETTERS.all.slice(0,12);
   const locs=['tr','en','ar','de','fr'];
   const fixture=letters.map((letter,i)=>{
    const wrong=letters.filter(l=>l.id!==letter.id).slice(0,3);
    const text=(suffix)=>Object.fromEntries(locs.map(lang=>[lang,suffix+' '+lang+' '+(i+1)]));
    return {id:'fixture-letter-'+String(i+1).padStart(3,'0'),skill:'letter-recognition',
     stage:'arabic-letters-01',difficulty:(i%3)+1,target:letter.glyph,type:'choice',
     prompt:text('Find the Arabic letter'),explanation:text('This is the correct letter'),
     locale:locs,choices:[{id:letter.id,glyph:letter.glyph},...wrong.map(l=>({id:l.id,glyph:l.glyph}))],
     correctAnswer:letter.id,distractorRationale:Object.fromEntries(wrong.map(l=>[l.id,text('This is a different letter')])),
     source:'Teaching fixture — not shipped course content'};
   });
   const sample=fixture[0];
   const invalid={...sample,id:'broken-duplicate-answer',choices:[sample.choices[0],sample.choices[0],sample.choices[1]]};
   const invalidText={...sample,id:'broken-languages',prompt:{tr:'Only one language'}};
   const invalidAudio={...sample,id:'broken-audio',audioRef:'unlicensed-word-qul'};
   const before=api.stats().questions;
   const failures=[api.validateBank([invalid]),api.validateBank([invalidText]),api.validateBank([invalidAudio])].map(x=>!x.valid);
   let rejected=false;try{api.registerPack({id:'bad-pack',questions:[...fixture,invalidAudio]})}catch(e){rejected=true}
   if(api.stats().questions!==before)throw Error('Invalid pack partially committed');
   api.registerPack({id:'fixture-12',questions:fixture});
   const duplicate=api.validateBank([{...sample,id:'copy-shuffled',choices:[...sample.choices].reverse()}],new Set(),new Set([
    [sample.stage,sample.skill,sample.target,sample.prompt.tr.toLocaleLowerCase('tr'),sample.choices[0].glyph].join('|')
   ]));
   const s1=api.createSession('arabic-letters-01',{count:10,seed:17}),s2=api.createSession('arabic-letters-01',{count:12,seed:19,recentIds:s1.ids});
   const none=api.createSession('arabic-letters-02');
   return {failures,rejected,duplicate:!duplicate.valid,stats:api.stats(),s1:s1.ids,s2:s2.ids,
    total:s1.total,total2:s2.total,unique:new Set(s1.ids).size,noPool:none===null,
    overlap:s2.ids.filter(x=>s1.ids.includes(x)).length};
  });
  assert.deepEqual(data.failures,[true,true,true]);
  assert.equal(data.rejected,true);
  assert.equal(data.duplicate,true);
  assert.equal(data.stats.questions,12);assert.equal(data.total,10);assert.equal(data.total2,12);
  assert.equal(data.unique,10);assert.equal(data.noPool,true);assert.equal(data.overlap,10); // 12 requested from a pool of 12.
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(1)),false,'Uncompleted second legacy lesson is locked');
  await page.evaluate(()=>{DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(0)});
  const oldBefore=await page.evaluate(()=>JSON.stringify({letter:localStorage.getItem('deen_arabic_foundations_v2'),heart:localStorage.getItem('deen_hearts_v1')}));
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-mini-tip').count(),1,'Tutorial stays before V2 quiz');
  await page.locator('[data-qpath-action="tipDismiss"]').click();
  assert.equal(await page.locator('.deen-path-v2-lesson').count(),1);
  assert.equal(await page.locator('.deen-path-question-count').innerText(),'Soru 1 / 10');
  const first=await page.evaluate(()=>DEEN_ARABIC_QUESTIONS_V2.createSession('arabic-letters-01',{seed:99})?.total);
  assert.equal(first,10);
  const letterIds=await page.evaluate(()=>DEEN_ARABIC_LETTERS.all.map(l=>l.id));
  const seen=[];
  for(let i=0;i<10;i++){
   const ids=await page.locator('.deen-v2-option').evaluateAll(btns=>btns.map(b=>b.dataset.choiceId));
   assert.equal(ids.length,4);
   const q=await page.evaluate(i=>{
    const view=DEEN_QURAN_PATHS.status();return {index:view.lessonIndex,questionIndex:i};
   },i);
   const v2Text=await page.locator('.deen-path-inner-title').innerText();seen.push(v2Text);
   const askedNumber=Number(v2Text.match(/(\d+)$/)?.[1]);
   const correctId=letterIds[askedNumber-1];
   assert.ok(correctId,'Correct answer decoded from fixture title: '+v2Text);
   if(i===0){
    const wrong=ids.find(id=>id!==correctId);
    await page.locator('.deen-v2-option[data-choice-id="'+wrong+'"]').click();
    await page.locator('[data-qpath-action="v2Check"]').click();
    assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
    assert.equal(await page.locator('.deen-path-v2-lesson').count(),1,'Wrong answer cannot complete question');
   }
   await page.locator('.deen-v2-option[data-choice-id="'+correctId+'"]').click();
   await page.locator('[data-qpath-action="v2Check"]').click();
   assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
   await page.locator('[data-qpath-action="next"]').click();
  }
  assert.equal(new Set(seen).size,10);
  assert.equal(await page.locator('.deen-path-completion').count(),1);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().completedLessons),1);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_v2_recent_v1'))['arabic-letters-01'].length),10);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_hearts_v1')),JSON.parse(oldBefore).heart);
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(1)),true);
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-mini-tip').count(),1,'Old lesson 2 uses existing first-run tutorial');
  await page.locator('[data-qpath-action="tipDismiss"]').click();
  assert.equal(await page.locator('.deen-path-v2-lesson').count(),0,'No V2 pool: old quiz remains');
  assert.equal(await page.locator('.deen-path-option').count(),4,'Legacy answer chips present');
  assert.deepEqual(errors,[]);
  console.log('PASS ARABIC V2 ENGINE: atomic QA/semantic duplicate/approved audio, 10 and 12 unique choices, live first-lesson V2, wrong retry, fallback legacy, unchanged hearts and progress');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
