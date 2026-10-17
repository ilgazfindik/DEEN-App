/* Final 100 question pack, live V2 gameplay across nine semantics lessons. */
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
  for(const name of ['quran-arabic-letters.js','quran-arabic-letter-audio.js','quran-arabic-questions-v2.js',
    'quran-arabic-questions-pack-a.js','quran-arabic-questions-pack-b.js','quran-arabic-harakat.js',
    'quran-arabic-questions-pack-c.js','quran-arabic-reading.js','quran-arabic-questions-pack-d.js',
    'quran-arabic-words.js','quran-arabic-questions-pack-e.js','quran-arabic-listening.js',
    'quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js',
    'quran-arabic-questions-pack-f.js','quran-arabic-mastery.js','quran-arabic-daily.js',
    'quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js',
    'quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-weekly-goals.js',
    'quran-arabic-paths.js'])await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_QUESTIONS_V2.stats().questions),600);
  const ids=await page.evaluate(()=>[...DEEN_ARABIC_MEANING.lessons,...DEEN_ARABIC_PHRASES.lessons,...DEEN_ARABIC_PATTERNS.lessons].map(x=>x.id));
  assert.equal(ids.length,9);
  await page.evaluate(()=>{
   localStorage.setItem('deen_hearts_v1','37');
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_reading_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_READING.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_words_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_WORDS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_meaning_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_MEANING.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_phrases_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_PHRASES.lessons.map(x=>x.id)}));
  });
  const persistent=await page.evaluate(()=>({
   foundations:localStorage.getItem('deen_arabic_foundations_v2'),
   vowels:localStorage.getItem('deen_arabic_harakat_v1'),
   reading:localStorage.getItem('deen_arabic_reading_v1'),
   words:localStorage.getItem('deen_arabic_words_v1')
  }));
  for(let index=18;index<=26;index++){
   await page.evaluate(index=>{
    document.documentElement.lang='tr';DEEN_QURAN_PATHS.enterArabic();
    if(!DEEN_QURAN_PATHS.selectGroup(index)||!DEEN_QURAN_PATHS.start())throw Error('Locked meaning/phrase/pattern lesson '+index);
   },index);
   if(await page.locator('.deen-path-mini-tip').count())await page.locator('[data-qpath-action="tipDismiss"]').click();
   assert.equal(await page.locator('.deen-path-v2-lesson').count(),1,'V2 visible in '+(index+1));
   assert.ok((await page.locator('.deen-path-question-count').innerText()).includes('1 / 10'));
   const stage=ids[index-18];
   async function verify(locale){
    const title=(await page.locator('.deen-path-inner-title').innerText()).trim();
    const target=(await page.locator('.deen-v2-target').innerText()).trim();
    const options=(await page.locator('.deen-v2-option').allInnerTexts()).map(x=>x.trim());
    const q=await page.evaluate(({title,target,stage,locale})=>{
     const found=DEEN_ARABIC_QUESTIONS_V2.poolFor(stage).find(x=>x.prompt[locale]===title&&x.target===target);
     if(!found)throw Error('Missing displayed meaning question '+stage+'/'+locale);
     return {id:found.id,correct:found.correctAnswer,wrong:found.choices.find(x=>x.id!==found.correctAnswer).id,
      choices:found.choices.map(x=>x.label?.[locale]||x.glyph),source:found.source};
    },{title,target,stage,locale});
    assert.deepEqual(options,q.choices,'Meaning choice translations '+stage+'/'+locale);
    assert.equal(await page.locator('.deen-v2-target').getAttribute('dir'),'rtl');
    return q;
   }
   for(const locale of ['tr','en','ar','de','fr']){
    await page.evaluate(locale=>{document.documentElement.lang=locale;DEEN_QURAN_PATHS.refresh()},locale);
    await verify(locale);
   }
   await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.refresh()});
   const seen=new Set(),rounds=index===18?10:1;
   for(let n=0;n<rounds;n++){
    const q=await verify('tr');
    assert.ok(!seen.has(q.id),'No repeated question in session');seen.add(q.id);
    assert.ok(q.id.startsWith('pack-f-'));
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
   if(index===18){
    const completed=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_meaning_v1')).completed);
    assert.ok(completed.includes(ids[0]));
    assert.equal(await page.evaluate(stage=>JSON.parse(localStorage.getItem('deen_arabic_v2_recent_v1'))[stage].length,ids[0]),10);
   }else await page.locator('[data-qpath-action="group"]').click();
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_hearts_v1')),'37');
  for(const [name,key] of [['foundations','deen_arabic_foundations_v2'],['vowels','deen_arabic_harakat_v1'],['reading','deen_arabic_reading_v1'],['words','deen_arabic_words_v1']])
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),persistent[name],name+' prior progress changed');
  await page.setViewportSize({width:320,height:720});
  await page.evaluate(()=>{document.documentElement.lang='ar';DEEN_QURAN_PATHS.enterArabic();if(!DEEN_QURAN_PATHS.selectGroup(26)||!DEEN_QURAN_PATHS.start())throw Error('RTL lesson locked')});
  const b=await page.locator('.deen-path-v2-lesson').boundingBox();
  assert.ok(b&&b.x>=0&&b.x+b.width<=322,'320px Arabic RTL viewport');
  assert.ok((await page.locator('.deen-v2-option').count())>=3);
  assert.deepEqual(errors,[]);
  console.log('PASS ARABIC PACK F CHROME: 600 total V2 items, 9 source-backed semantics lessons, 5 locales and RTL 320px, 10-question completion, wrong feedback and unchanged legacy hearts/progress');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
