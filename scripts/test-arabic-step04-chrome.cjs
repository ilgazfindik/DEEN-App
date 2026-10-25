/* Step 04: actual 14–20 lesson-tip integration, locked audio, RTL and preservation. */
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const http=require('node:http'),path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'..');
const p=fs.readFileSync(path.join(root,'assets/i18n/quran-arabic-paths.js'),'utf8');
const begin=p.indexOf(' const lessonTips=Object.freeze(')+' const lessonTips=Object.freeze('.length;
const end=p.indexOf(');\n const tipUi=',begin);
assert.ok(begin>30&&end>begin,'tip table is parseable');
const tips=JSON.parse(p.slice(begin,end));
const records=['arabic-word-syllables-01','arabic-word-words-01','arabic-word-quran-01','arabic-listen-syllables-01','arabic-listen-words-01','arabic-meaning-gloss-01','arabic-meaning-role-01'];
const locales=['tr','en','ar','de','fr'];
assert.equal(Object.keys(tips).length,27,'All 27 lessons must retain notes');
for(const id of records){
  const tip=tips[id];assert.ok(tip&&tip.id===id,id);
  for(const lang of locales){
    const v=tip.locale[lang];assert.ok(v&&v.title.length>=9&&v.oneSentence.length>=25&&v.mistakeTip.length>=15,id+'/'+lang);
    assert.equal(v.examples.length,3,id+' has three examples');
    assert.ok(v.examples.every(x=>x.glyph&&x.caption&&!x.audioRef),'No letter-name audio on a word or vowel');
  }
}
const scriptNames=['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-weekly-goals.js','quran-arabic-paths.js'];
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="originalSurah">Surahs</button></div></div></div></body></html>';
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:375,height:812}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port);
  await page.evaluate(()=>window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang});
  await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
  for(const name of scriptNames)await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  const status=await page.evaluate(()=>({
   required:DEEN_ARABIC_LISTENING.requiredCount,approved:DEEN_ARABIC_LISTENING.approvedCount(),
   ready:DEEN_ARABIC_LISTENING.lessons.map(x=>DEEN_ARABIC_LISTENING.lessonReady(x.id))
  }));
  assert.equal(status.required,6);
  assert.equal(status.approved,0,'No licensed and approved isolated words were uploaded');
  assert.deepEqual(status.ready,[false,false]);
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_reading_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_READING.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_words_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_WORDS.lessons.map(x=>x.id)}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(16)),false,'Listening 16 is locked until verified clips');
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(17)),false,'Listening 17 is locked until verified clips');
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_listening_v1')),null,'No fabricated listening progress');

  const unlocked=[13,14,15,18,19];
  for(const index of unlocked){
   const id=await page.evaluate(index=>{
    localStorage.setItem('deen_arabic_words_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_WORDS.lessons.slice(0,index<16?index-13:3).map(x=>x.id)}));
    localStorage.setItem('deen_arabic_meaning_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_MEANING.lessons.slice(0,index===19?1:0).map(x=>x.id)}));
    document.documentElement.lang='tr';
    DEEN_QURAN_PATHS.enterArabic();
    if(DEEN_QURAN_PATHS.selectGroup(index)!==true)throw Error('Not unlocked '+index);
    return [...DEEN_ARABIC_WORDS.lessons,...DEEN_ARABIC_LISTENING.lessons,...DEEN_ARABIC_MEANING.lessons][index-13].id;
   },index);
   const storedBefore=await page.evaluate(()=>JSON.stringify({
    letters:localStorage.getItem('deen_arabic_foundations_v2'),
    vowels:localStorage.getItem('deen_arabic_harakat_v1'),
    reading:localStorage.getItem('deen_arabic_reading_v1'),
    words:localStorage.getItem('deen_arabic_words_v1'),
    meaning:localStorage.getItem('deen_arabic_meaning_v1'),
    listening:localStorage.getItem('deen_arabic_listening_v1')
   }));
   await page.locator('[data-qpath-action="start"]').click();
   assert.equal(await page.locator('.deen-path-mini-tip').count(),1,id+' first visit opens note');
   assert.equal(await page.locator('.deen-path-question-count').count(),0,id+' cannot grade while note open');
   assert.equal(await page.locator('.deen-path-mini-tip-audio').count(),0,'Never reuse isolated letter-name MP3s for words');
   for(const lang of locales){
    await page.evaluate(lang=>{document.documentElement.lang=lang;DEEN_QURAN_PATHS.refresh()},lang);
    const expected=tips[id].locale[lang];
    assert.equal((await page.locator('.deen-path-mini-tip-title').innerText()).trim(),expected.title);
    assert.equal((await page.locator('.deen-path-mini-tip-desc').innerText()).trim(),expected.oneSentence);
    assert.deepEqual(await page.locator('.deen-path-mini-tip-glyph').allInnerTexts(),expected.examples.map(x=>x.glyph));
    assert.equal(await page.locator('.deen-path-mini-tip').getAttribute('dir'),lang==='ar'?'rtl':'ltr');
   }
   await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.refresh()});
   await page.locator('[data-qpath-action="tipDismiss"]').click();
   assert.equal(await page.locator('.deen-path-question-count').count(),1,'Question starts after dismiss');
   assert.equal(await page.locator('.deen-path-feedback').count(),0);
   await page.locator('[data-qpath-action="tipOpen"]').click();
   assert.equal(await page.locator('.deen-path-mini-tip').count(),1,'Lesson Note can reopen');
   await page.locator('[data-qpath-action="tipDismiss"]').click();
   const storedAfter=await page.evaluate(()=>JSON.stringify({
    letters:localStorage.getItem('deen_arabic_foundations_v2'),
    vowels:localStorage.getItem('deen_arabic_harakat_v1'),
    reading:localStorage.getItem('deen_arabic_reading_v1'),
    words:localStorage.getItem('deen_arabic_words_v1'),
    meaning:localStorage.getItem('deen_arabic_meaning_v1'),
    listening:localStorage.getItem('deen_arabic_listening_v1')
   }));
   assert.equal(storedAfter,storedBefore,'Reading a teacher note must not grant progress: '+id);
   await page.locator('[data-qpath-action="group"]').click();
   await page.locator('[data-qpath-action="start"]').click();
   assert.equal(await page.locator('.deen-path-mini-tip').count(),0,'Returning does not reopen acknowledged tip');
   await page.locator('[data-qpath-action="group"]').click();
  }
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_lesson_tips_seen_v1'))),unlocked.map(i=>records[i<16?i-13:i-13]));
  await page.setViewportSize({width:320,height:720});
  await page.evaluate(()=>{document.documentElement.lang='ar';DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(18)});
  await page.locator('[data-qpath-action="start"]').click();
  await page.locator('[data-qpath-action="tipOpen"]').click();
  const rect=await page.locator('.deen-path-mini-tip').boundingBox();
  assert.ok(rect&&rect.x>=0&&rect.x+rect.width<=322,'320px RTL teaching card fits');
  await page.reload();
  await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
  for(const name of scriptNames)await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  await page.evaluate(()=>{window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang};DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(18)});
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-mini-tip').count(),0,'After reload, note stays dismissed');
  assert.deepEqual(errors,[]);
  console.log('PASS Arabic V2 step04: 7×5 localized notes, 5 accessible lessons, 2 gated listening lessons, 320px RTL, persistence, zero fake audio');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
