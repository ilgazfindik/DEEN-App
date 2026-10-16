/* DEEN Arabic V2 Step 05 — all seven phrase and pattern first-run teaching screens. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..'),js=fs.readFileSync(path.join(root,'assets/i18n/quran-arabic-paths.js'),'utf8');
const token=' const lessonTips=Object.freeze(',start=js.indexOf(token)+token.length,end=js.indexOf(');\n const tipUi=',start);
assert.ok(start>token.length&&end>start);
const tips=JSON.parse(js.slice(start,end));
const ids=['arabic-meaning-order-01','arabic-phrase-vocab-01','arabic-phrase-context-01','arabic-phrase-order-01','arabic-pattern-vocabulary-01','arabic-pattern-context-01','arabic-pattern-structure-01'];
const locales=['tr','en','ar','de','fr'];
assert.equal(Object.keys(tips).length,27);
for(const id of ids)for(const lang of locales){
 const t=tips[id]?.locale[lang];assert.ok(t&&t.title.length>8&&t.oneSentence.length>25&&t.mistakeTip.length>16,id+'/'+lang);
 assert.equal(t.examples.length,3);assert.ok(t.examples.every(x=>x.glyph&&x.caption&&!x.audioRef),'No invented audio');
}
const scripts=['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-weekly-goals.js','quran-arabic-paths.js'];
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="oldSurah">Surah</button></div></div></div></body></html>';
const server=http.createServer((_,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
 const page=await browser.newPage({viewport:{width:375,height:812}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);
 await page.evaluate(()=>window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang});
 await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
 for(const file of scripts)await page.addScriptTag({path:path.join(root,'assets/i18n',file)});
 assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().overallLessonCount),27);
 for(let index=20;index<=26;index++){
  const id=ids[index-20];
  await page.evaluate(index=>{
   const l=DEEN_ARABIC_LETTERS.lessons,v=DEEN_ARABIC_HARAKAT.lessons,r=DEEN_ARABIC_READING.lessons,w=DEEN_ARABIC_WORDS.lessons,m=DEEN_ARABIC_MEANING.lessons,p=DEEN_ARABIC_PHRASES.lessons,k=DEEN_ARABIC_PATTERNS.lessons;
   const save=(key,completed)=>localStorage.setItem(key,JSON.stringify({schema:1,completed}));
   save('deen_arabic_foundations_v2',l.map(x=>x.id));save('deen_arabic_harakat_v1',v.map(x=>x.id));save('deen_arabic_reading_v1',r.map(x=>x.id));save('deen_arabic_words_v1',w.map(x=>x.id));
   save('deen_arabic_meaning_v1',m.slice(0,index===20?2:3).map(x=>x.id));
   save('deen_arabic_phrases_v1',p.slice(0,Math.max(0,Math.min(3,index-21))).map(x=>x.id));
   save('deen_arabic_patterns_v1',k.slice(0,Math.max(0,index-24)).map(x=>x.id));
   document.documentElement.lang='tr';DEEN_QURAN_PATHS.enterArabic();
   if(!DEEN_QURAN_PATHS.selectGroup(index))throw Error('Cannot unlock '+index);
  },index);
  const storageKeys=['deen_arabic_foundations_v2','deen_arabic_harakat_v1','deen_arabic_reading_v1','deen_arabic_words_v1','deen_arabic_meaning_v1','deen_arabic_phrases_v1','deen_arabic_patterns_v1','deen_arabic_listening_v1'];
  const before=await page.evaluate(keys=>JSON.stringify(keys.map(k=>localStorage.getItem(k))),storageKeys);
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-mini-tip').count(),1,id+' auto note');
  assert.equal(await page.locator('.deen-path-question-count').count(),0,'No hidden question while note visible');
  assert.equal(await page.locator('.deen-path-mini-tip-audio').count(),0);
  for(const lang of locales){
    await page.evaluate(lang=>{document.documentElement.lang=lang;DEEN_QURAN_PATHS.refresh()},lang);
    assert.equal((await page.locator('.deen-path-mini-tip-title').innerText()).trim(),tips[id].locale[lang].title);
    assert.deepEqual(await page.locator('.deen-path-mini-tip-glyph').allInnerTexts(),tips[id].locale[lang].examples.map(x=>x.glyph));
    assert.equal(await page.locator('.deen-path-mini-tip').getAttribute('dir'),lang==='ar'?'rtl':'ltr');
  }
  await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.refresh()});
  await page.locator('[data-qpath-action="tipDismiss"]').click();
  assert.equal(await page.locator('.deen-path-question-count').count(),1);
  assert.equal(await page.locator('.deen-path-feedback').count(),0);
  await page.locator('[data-qpath-action="tipOpen"]').click();
  assert.equal(await page.locator('.deen-path-mini-tip').count(),1,'Can reopen note');
  await page.locator('[data-qpath-action="tipDismiss"]').click();
  assert.equal(await page.evaluate(keys=>JSON.stringify(keys.map(k=>localStorage.getItem(k))),storageKeys),before,'Opening tip cannot fake completion');
  await page.locator('[data-qpath-action="group"]').click();
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-mini-tip').count(),0,'Already viewed stays dismissed');
  await page.locator('[data-qpath-action="group"]').click();
 }
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_lesson_tips_seen_v1'))),ids);
 assert.equal(await page.evaluate(()=>DEEN_ARABIC_LISTENING.approvedCount()),0,'Do not bypass pending audio');
 await page.setViewportSize({width:320,height:720});
 await page.evaluate(()=>{document.documentElement.lang='ar';DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(26)});
 await page.locator('[data-qpath-action="start"]').click();
 await page.locator('[data-qpath-action="tipOpen"]').click();
 const bounds=await page.locator('.deen-path-mini-tip').boundingBox();
 assert.ok(bounds&&bounds.x>=0&&bounds.x+bounds.width<=322,'320px Arabic tip width');
 await page.locator('[data-qpath-action="tipDismiss"]').click();
 const saved=await page.evaluate(()=>localStorage.getItem('deen_arabic_patterns_v1'));
 await page.reload();
 await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
 for(const file of scripts)await page.addScriptTag({path:path.join(root,'assets/i18n',file)});
 await page.evaluate(()=>{window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang};DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(26)});
 await page.locator('[data-qpath-action="start"]').click();
 assert.equal(await page.locator('.deen-path-mini-tip').count(),0,'Reload keeps acknowledgement');
 assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_patterns_v1')),saved,'Progress unchanged');
 assert.deepEqual(errors,[]);
 console.log('PASS ARABIC STEP05: 7 new teacher notes, 27 total, 5 languages, RTL mobile, no fake audio/progress, reload and 21-27 gameplay');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
