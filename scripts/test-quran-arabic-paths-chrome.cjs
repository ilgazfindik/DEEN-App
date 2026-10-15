/* Isolated Chrome test for the Quran Arabic foundations phase 1. */
const {chromium}=require('playwright'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><h2 id="existingSurahHeader">Current Surahs</h2><button id="existingSurahAction">Review Surahs</button></div></div></div></body></html>';
const server=http.createServer((_,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);
 await page.evaluate(()=>window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang});
 await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-paths.js')});
 assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.version),'quran-arabic-paths-phase1');
 assert.equal(await page.locator('.deen-path-card').count(),2);
 assert.equal(await page.locator('#deenQuranPathNav').count(),1);
 assert.equal(await page.locator('#existingSurahHeader').count(),1,'Original surah UI still present');
 assert.equal(await page.locator('.deen-quran-shell').evaluate(el=>getComputedStyle(el).display),'none','Existing surah UI hidden on two-path landing');
 await page.locator('[data-qpath-action="surah"]').click();
 assert.equal(await page.locator('.deen-quran-shell').evaluate(el=>getComputedStyle(el).display)!=='none',true,'Existing surah path must be visible');
 await page.locator('#existingSurahAction').click();
 assert.equal(await page.locator('#existingSurahAction').count(),1,'Surah controls untouched');
 await page.locator('[data-qpath-action="home"]').click();
 await page.locator('[data-qpath-action="arabic"]').click();
 assert.equal(await page.locator('.deen-path-letter-card').count(),3);
 assert.deepEqual(await page.locator('.deen-path-glyph').allInnerTexts(),['ا','ب','ت']);
 assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().complete),false);
 await page.locator('[data-qpath-action="start"]').click();
 for(let i=0;i<3;i++){
  assert.match(await page.locator('.deen-path-question-count').innerText(),new RegExp((i+1)+' / 3'));
  const letter=['alif','ba','ta'][i];
  if(i===0){
   await page.locator('[data-qpath-action="answer"][data-letter-id="ba"]').click();
   assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1,'Wrong answer gives feedback');
  }
  await page.locator('[data-qpath-action="answer"][data-letter-id="'+letter+'"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1,'Right answer advances');
  await page.locator('[data-qpath-action="next"]').click();
 }
 assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().complete),true);
 assert.equal(await page.locator('.deen-path-completion').count(),1);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_intro_v1')).completed),true);
 // Quran renderer can replace its shell, and the new hub must reattach without duplicates.
 await page.evaluate(()=>{document.getElementById('leagueScreenBody').innerHTML='<div class="deen-quran-shell"><button id="surahAfterRerender">Memorization remains</button></div>'});
 await page.locator('.deen-path-completion').waitFor();
 assert.equal(await page.locator('#deenQuranPathNav').count(),1);
 assert.equal(await page.locator('#surahAfterRerender').count(),1);
 await page.evaluate(()=>{document.documentElement.lang='fr';DEEN_QURAN_PATHS.home()});
 assert.equal(await page.locator('.deen-path-card').count(),2);
 assert.match(await page.locator('.deen-path-title').innerText(),/Ton parcours/);
 await page.evaluate(()=>{document.documentElement.lang='ar';DEEN_QURAN_PATHS.enterArabic()});
 assert.match(await page.locator('.deen-path-inner-title').innerText(),/ثلاثة/);
 assert.deepEqual(errors,[]);
 await browser.close();server.close();
 console.log('PASS QURAN ARABIC PATHS phase1: nav, original surah, alphabet intro, quiz, progress, rerender, TR/FR/AR');
})().catch(e=>{console.error(e);server.close();process.exit(1)});
