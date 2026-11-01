/* Chrome E2E: Pronunciation Workshop (design/makharij.js) on the Arabic path. */
const {chromium}=require('playwright'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><h2 id="existingSurahHeader">Current Surahs</h2><button id="existingSurahAction">Review Surahs</button></div></div></div></body></html>';
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)});
const FILES=['quran-arabic-letters.js', 'quran-arabic-harakat.js', 'quran-arabic-reading.js', 'quran-arabic-words.js', 'quran-arabic-listening.js', 'quran-arabic-meaning.js', 'quran-arabic-phrases.js', 'quran-arabic-patterns.js', 'quran-arabic-mastery.js', 'quran-arabic-daily.js', 'quran-arabic-adaptive.js', 'quran-arabic-foundation-review.js', 'quran-arabic-checkpoint.js', 'quran-arabic-remediation.js', 'quran-arabic-weekly.js', 'quran-arabic-weekly-goals.js', 'quran-arabic-paths.js'];
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);
 await page.evaluate(()=>window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang});
 await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
 for(const f of FILES)await page.addScriptTag({path:path.join(root,'assets/i18n/'+f)});
 for(const css of ['deen-ds.css','quran.css'])await page.addStyleTag({path:path.join(root,'assets/design/'+css)});
 await page.addScriptTag({path:path.join(root,'assets/design/quran.js')});
 await page.addScriptTag({path:path.join(root,'assets/design/makharij.js')});
 const open=async()=>{await page.locator('[data-qpath-action="home"]').first().click().catch(()=>{});await page.locator('[data-qpath-action="arabic"]').first().click()};
 await page.locator('[data-qpath-action="arabic"]').click();
 const entry=page.locator('.deen-path-arabic-landing > .dsm-entry');
 await entry.waitFor();
 assert.equal(await entry.isDisabled(),true,'Locked until the 7 letter lessons are done');
 assert.equal(await page.evaluate(()=>DEEN_MAKHARIJ.status().unlocked),false);
 await page.evaluate(()=>localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(l=>l.id)})));
 await open();
 await page.waitForFunction(()=>{const e=document.querySelector('.dsm-entry');return e&&!e.disabled});
 assert.equal(await page.evaluate(()=>DEEN_MAKHARIJ.status().unlocked),true);
 await page.locator('.dsm-entry').scrollIntoViewIfNeeded();await page.screenshot({path:process.env.SHOT_DIR?process.env.SHOT_DIR+'/landing.png':undefined});
 await page.locator('.dsm-entry').click();
 assert.equal(await page.locator('.dsm-letter').count(),3);
 await page.screenshot({path:process.env.SHOT_DIR?process.env.SHOT_DIR+'/intro.png':undefined});
 await page.locator('.dsm-lesson .deen-path-primary').click();
 const Q=await page.evaluate(()=>DEEN_MAKHARIJ.questions.map(q=>({answer:q.answer,options:q.options})));
 assert.equal(Q.length,9);
 for(let i=0;i<Q.length;i++){
  const opts=page.locator('.dsm-option');
  assert.equal(await opts.count(),Q[i].options.length);
  if(i===0){ // wrong first, then the hint shows and the answer is still retryable
   await opts.nth(Q[i].options.indexOf('dhal')).click();
   await page.locator('.deen-path-feedback.is-wrong').waitFor();
   await page.screenshot({path:process.env.SHOT_DIR?process.env.SHOT_DIR+'/wrong.png':undefined});
  }
  await opts.nth(Q[i].options.indexOf(Q[i].answer)).click();
  await page.locator('.deen-path-feedback.is-correct').waitFor();
  if(i===6)await page.screenshot({path:process.env.SHOT_DIR?process.env.SHOT_DIR+'/word.png':undefined});
  await page.locator('.dsm-lesson .deen-path-primary').click();
 }
 // 8 of 9 first-try correct (one miss) still passes
 await page.locator('.deen-path-completion').waitFor();
 await page.screenshot({path:process.env.SHOT_DIR?process.env.SHOT_DIR+'/result.png':undefined});
 const st=await page.evaluate(()=>DEEN_MAKHARIJ.status());
 assert.equal(st.completed,true);assert.equal(st.best,8);
 await page.locator('.deen-path-completion .deen-path-primary').click();
 await page.locator('.deen-path-arabic-landing > .dsm-entry.is-done').waitFor();
 // saved path progress untouched
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed.length),7);
 // fail path: three misses -> not completed
 await page.evaluate(()=>localStorage.removeItem('deen_arabic_makharij_v1'));
 await page.evaluate(()=>DEEN_MAKHARIJ.open());
 await page.locator('.dsm-lesson .deen-path-primary').click();
 for(let i=0;i<Q.length;i++){
  const opts=page.locator('.dsm-option');
  if(i<3){const wrong=Q[i].options.find(o=>o!==Q[i].answer);await opts.nth(Q[i].options.indexOf(wrong)).click()}
  await opts.nth(Q[i].options.indexOf(Q[i].answer)).click();
  await page.locator('.dsm-lesson .deen-path-primary').click();
 }
 await page.locator('.deen-path-completion').waitFor();
 assert.equal(await page.evaluate(()=>DEEN_MAKHARIJ.status().completed),false);
 // every locale has every string
 const miss=await page.evaluate(()=>{const S=DEEN_MAKHARIJ.strings,base=Object.keys(S.tr),out=[];for(const l of Object.keys(S))for(const k of base)if(!(k in S[l]))out.push(l+':'+k);return out});
 assert.deepEqual(miss,[]);
 await browser.close();server.close();
 if(errors.length)throw Error(errors.join('\n'));
 console.log('PASS: Pronunciation Workshop locked/unlocked, 9 questions, hint, pass/fail, store, locales');
})().catch(e=>{console.error(e);process.exit(1)});
