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
 const open=async()=>{await page.evaluate(()=>{DEEN_QURAN_PATHS.home();DEEN_QURAN_PATHS.enterArabic()})};
 const shot=async n=>{if(process.env.SHOT_DIR)await page.screenshot({path:process.env.SHOT_DIR+'/'+n+'.png'})};
 const card=id=>page.locator('.deen-path-arabic-landing > .dsm-entry[data-lesson="'+id+'"]');
 await page.locator('[data-qpath-action="arabic"]').click();
 await card('tongue-tip').waitFor();
 assert.equal(await page.locator('.deen-path-arabic-landing > .dsm-entry').count(),3);
 assert.equal(await card('tongue-tip').isDisabled(),true,'Locked until the 7 letter lessons are done');
 assert.deepEqual(await page.evaluate(()=>DEEN_MAKHARIJ.status().unlocked),[false,false,false]);
 await page.evaluate(()=>localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(l=>l.id)})));
 await open();
 await page.waitForFunction(()=>{const e=document.querySelector('.dsm-entry[data-lesson="tongue-tip"]');return e&&!e.disabled});
 assert.deepEqual(await page.evaluate(()=>DEEN_MAKHARIJ.status().unlocked),[true,false,false],'Each lesson waits for the previous one');
 assert.equal(await card('throat').isDisabled(),true);
 assert.equal(await card('thick-thin').isDisabled(),true);
 await card('throat').scrollIntoViewIfNeeded();await shot('landing');
 // Plays one lesson: every question answered correctly, optionally missing the first ones once.
 const play=async(id,misses,tag)=>{
  await open();await card(id).waitFor();await card(id).click();
  const lesson=await page.evaluate(id=>DEEN_MAKHARIJ.lessons.find(l=>l.id===id).questions.map(q=>({answer:q.answer,options:q.options})),id);
  assert.equal(lesson.length,9);
  assert.equal(await page.locator('.dsm-letter').count(),await page.evaluate(id=>DEEN_MAKHARIJ.lessons.find(l=>l.id===id).letters.length,id));
  await shot(tag+'-intro');
  await page.locator('.dsm-lesson .deen-path-primary').click();
  for(let i=0;i<lesson.length;i++){
   const q=lesson[i],opts=page.locator('.dsm-option');
   assert.equal(await opts.count(),q.options.length);
   if(i<misses){
    await opts.nth(q.options.indexOf(q.options.find(o=>o!==q.answer))).click();
    await page.locator('.deen-path-feedback.is-wrong').waitFor();
    if(i===0)await shot(tag+'-wrong');
   }
   await opts.nth(q.options.indexOf(q.answer)).click();
   await page.locator('.deen-path-feedback.is-correct').waitFor();
   if(i===6)await shot(tag+'-word');
   await page.locator('.dsm-lesson .deen-path-primary').click();
  }
  await page.locator('.deen-path-completion').waitFor();
  await shot(tag+'-result');
 };
 await play('tongue-tip',1,'l1');                       // one miss: 8/9 still passes
 let st=await page.evaluate(()=>DEEN_MAKHARIJ.status().lessons);
 assert.equal(st['tongue-tip'].completed,true);assert.equal(st['tongue-tip'].best,8);
 assert.equal(st.throat.completed,false);
 await page.locator('.deen-path-completion .deen-path-primary').click();
 await card('tongue-tip').and(page.locator('.is-done')).waitFor();
 assert.equal(await card('throat').isDisabled(),false,'Second lesson unlocks after the first');
 await play('throat',0,'l2');
 st=await page.evaluate(()=>DEEN_MAKHARIJ.status().lessons);
 assert.equal(st.throat.completed,true);assert.equal(st.throat.best,9);
 await page.locator('.deen-path-completion .deen-path-primary').click();
 assert.equal(await card('thick-thin').isDisabled(),false,'Third lesson unlocks after the second');
 await play('thick-thin',0,'l3');
 st=await page.evaluate(()=>DEEN_MAKHARIJ.status().lessons);
 assert.equal(st['thick-thin'].completed,true);assert.equal(st['thick-thin'].best,9);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed.length),7,'path progress untouched');
 // failing run: three misses -> 6/9, not completed
 await page.evaluate(()=>localStorage.removeItem('deen_arabic_makharij_v1'));
 await play('tongue-tip',3,'fail');
 st=await page.evaluate(()=>DEEN_MAKHARIJ.status().lessons);
 assert.equal(st['tongue-tip'].completed,false);assert.equal(st['tongue-tip'].best,6);
 // a v1 save (single lesson at top level) still counts for the first lesson
 await page.evaluate(()=>localStorage.setItem('deen_arabic_makharij_v1',JSON.stringify({schema:1,completed:true,best:8})));
 st=await page.evaluate(()=>DEEN_MAKHARIJ.status().lessons);
 assert.equal(st['tongue-tip'].completed,true);assert.equal(st['tongue-tip'].best,8);assert.equal(st.throat.completed,false);
 // every locale has every string, per lesson
 const miss=await page.evaluate(()=>{const M=DEEN_MAKHARIJ,out=[];
  for(const l of Object.keys(M.strings))for(const k of Object.keys(M.strings.tr))if(!(k in M.strings[l]))out.push(l+':'+k);
  for(const lesson of M.lessons)if(lesson.extra)for(const l of Object.keys(lesson.extra))for(const k of Object.keys(lesson.extra.tr))if(!(k in lesson.extra[l]))out.push(lesson.id+' '+l+':'+k);
  for(const lesson of M.lessons)for(const q of lesson.questions)for(const l of Object.keys(M.strings)){
   const T={...M.strings[l],...(lesson.extra?lesson.extra[l]:{})};
   if(!T[q.prompt])out.push(lesson.id+' '+l+' prompt '+q.prompt);
   if(q.word&&!T.wordMeanings[q.meaning])out.push(lesson.id+' '+l+' meaning '+q.meaning);
   for(const o of q.options)if(!(o in {tha:1,dhal:1,zza:1,sin:1,sad:1,zay:1,hha:1,kha:1,ha:1,kaf:1,tta:1,ta:1,dad:1,dal:1}))out.push('glyph '+o);
  }
  return out});
 assert.deepEqual(miss,[]);
 await browser.close();server.close();
 if(errors.length)throw Error(errors.join('\n'));
 console.log('PASS: Pronunciation Workshop 3 lessons, locks, 9 questions each, hints, pass/fail, v1 save, locales');
})().catch(e=>{console.error(e);process.exit(1)});
