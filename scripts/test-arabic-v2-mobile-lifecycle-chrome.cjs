/* DEEN Phase 15 — REAL segmented app: slow connection, 320/375 RTL, reload,
 * first-try evidence, local progress, in-session offline and fresh offline navigation.
 * Fresh offline launch is a measured capability, not assumed to exist.
 */
'use strict';
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const makeFile=req=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const file=pathname==='/'?path.join(root,'index.html'):path.resolve(root,'.'+pathname.replace(/\\/g,'/'));
 if(!file.startsWith(root+path.sep)&&file!==path.join(root,'index.html'))return null;
 return file;
};
const mime=f=>f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.js')?'text/javascript; charset=utf-8':f.endsWith('.css')?'text/css; charset=utf-8':f.endsWith('.json')?'application/json; charset=utf-8':'application/octet-stream';
const server=http.createServer((req,res)=>{
 const f=makeFile(req);
 try{const target=f&&fs.statSync(f).isFile()?f:path.join(root,'__missing__');
  res.setHeader('Content-Type',mime(target));res.end(fs.readFileSync(target));
 }catch(_){res.statusCode=404;res.end('missing')}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:320,height:720},locale:'ar-SA'});
 const errors=[],page=await context.newPage(),report={stage:15,origin:'disposable localhost',
  widths:[],warnings:[],network:{},offline:{},state:{}};
 page.on('pageerror',err=>errors.push(err.message));
 try{
  await page.addInitScript(()=>{
   localStorage.setItem('deen_app_language_v1','ar');
   if(!localStorage.getItem('deen_v4_1_state'))
    localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:27,xp:731,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'ar',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}));
   if(!localStorage.getItem('deen_hearts_v1'))localStorage.setItem('deen_hearts_v1','29');
  });
  let delayed=false;
  await page.route('**/release/v9.9.3-direct/segment-00.txt*',async route=>{
   if(!delayed){delayed=true;await new Promise(r=>setTimeout(r,450));}
   await route.continue();
  });
  const start=Date.now();
  await page.goto(origin+'/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.DEEN_BOOT&&['ready','error'].includes(DEEN_BOOT.status().phase),null,{timeout:85000});
  const boot=await page.evaluate(()=>DEEN_BOOT.status());
  report.network.firstReadyMs=Date.now()-start;
  report.network.delayedSegment=delayed;
  assert.equal(boot.phase,'ready',JSON.stringify(boot));
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_QUESTIONS_V2.stats().questions),600);
  report.network.phase=boot.phase;
  const original=await page.evaluate(()=>({state:JSON.parse(localStorage.getItem('deen_v4_1_state')),
   heart:localStorage.getItem('deen_hearts_v1'),
   curriculum:localStorage.getItem('deen_arabic_foundations_v2'),
   spaced:localStorage.getItem('deen_arabic_v2_spaced_v1')}));
  assert.equal(original.state.xp,731);assert.equal(original.heart,'29');
  await page.evaluate(()=>{navigate('leagueScreen');DEEN_QURAN_PATHS.enterArabic();if(!DEEN_QURAN_PATHS.selectGroup(0)||!DEEN_QURAN_PATHS.start())throw Error('lesson one locked')});
  if(await page.locator('.deen-path-mini-tip').count())await page.locator('[data-qpath-action="tipDismiss"]').click();
  assert.equal(await page.locator('.deen-path-v2-lesson').count(),1);
  for(const width of [320,375]){
   await page.setViewportSize({width,height:720});
   const data=await page.evaluate(()=>({
    lang:document.documentElement.lang,dir:document.documentElement.dir,
    screenWidth:document.documentElement.scrollWidth,
    viewport:document.documentElement.clientWidth,
    lesson:(()=>{const r=document.querySelector('.deen-path-v2-lesson')?.getBoundingClientRect();return r?{left:r.left,right:r.right}:null})()
   }));
   assert(data.lesson,'Missing lesson at '+width);
   assert(data.lesson.left>=-2&&data.lesson.right<=width+2,'Lesson spills off screen at '+width+': '+JSON.stringify(data));
   report.widths.push({width,fit:true,documentScroll:data.screenWidth,lang:data.lang,dir:data.dir});
  }
  await page.setViewportSize({width:320,height:720});
  // Wrong answer followed by correct answer must not save an incomplete lesson.
  const first=await page.evaluate(()=>{
   const stage='arabic-letters-01',title=document.querySelector('.deen-path-inner-title')?.textContent.trim(),
    target=document.querySelector('.deen-v2-target')?.textContent.trim();
   const item=DEEN_ARABIC_QUESTIONS_V2.poolFor(stage).find(q=>(q.prompt.ar===title||q.prompt.tr===title)&&q.target===target);
   if(!item)throw Error('Question not found '+title+' '+target);
   return {id:item.id,wrong:item.choices.find(c=>c.id!==item.correctAnswer).id,correct:item.correctAnswer};
  });
  await page.locator('.deen-v2-option[data-choice-id="'+first.wrong+'"]').click();
  await page.locator('[data-qpath-action="v2Check"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_v2_spaced_v1')),original.spaced);
  report.state.firstWrongFeedback=true;
  // Offline launch is ready only after the version-pinned SW has fully installed.
  await page.waitForFunction(()=>navigator.serviceWorker?.controller!=null,null,{timeout:85000});
  const offlineCacheReady=await page.evaluate(async()=>{
   const ctrl=navigator.serviceWorker.controller;
   const names=await caches.keys(),version=window.__DEEN_DEPLOY_ID__;
   const cache=await caches.open('deen-offline-shell-'+version);
   return {controlled:!!ctrl,shell:!!(await cache.match(new URL('./index.html',location.href).href)),
    cachedSegments:await Promise.all(Array.from({length:67},(_,i)=>cache.match(new URL('./release/v9.9.3-direct/segment-'+String(i).padStart(2,'0')+'.txt',location.href).href))).then(r=>r.filter(Boolean).length)};
  });
  assert.equal(offlineCacheReady.controlled,true);
  assert.equal(offlineCacheReady.shell,true);
  assert.equal(offlineCacheReady.cachedSegments,67);
  report.offline.cacheReady=offlineCacheReady;
  await context.setOffline(true);
  const available=await page.evaluate(()=>({
   v2:DEEN_ARABIC_QUESTIONS_V2.stats().questions,
   view:DEEN_QURAN_PATHS.status().view,
   optionCount:document.querySelectorAll('.deen-v2-option').length
  }));
  assert.equal(available.v2,600);assert.equal(available.view,'lesson');assert(available.optionCount>=3);
  report.offline.activeLessonWorks=true;
  const fresh=await context.newPage();
  try{
   const freshConsole=[],freshNetwork=[];
   fresh.on('console',msg=>{if(msg.type()==='error'||msg.type()==='warning')freshConsole.push(msg.text())});
   fresh.on('pageerror',err=>freshConsole.push(err.message));
   fresh.on('requestfailed',req=>freshNetwork.push({url:req.url(),failure:req.failure()}));
   await fresh.goto(origin+'/',{timeout:6000,waitUntil:'domcontentloaded'});
   await fresh.waitForFunction(()=>window.DEEN_BOOT&&['ready','error'].includes(DEEN_BOOT.status().phase),null,{timeout:45000});
   const offlineResult=await fresh.evaluate(()=>({boot:DEEN_BOOT.status(),screen:document.body.innerText.slice(0,600),
    hasV2:!!window.DEEN_ARABIC_QUESTIONS_V2}));
   assert.equal(offlineResult.boot.phase,'ready','Offline initial boot '+JSON.stringify({offlineResult,freshConsole,freshNetwork}));
   assert.equal(await fresh.evaluate(()=>DEEN_ARABIC_QUESTIONS_V2.stats().questions),600);
   report.offline.freshNavigation=true;
  }catch(e){
   report.offline.freshNavigation=false;
   throw Error('Fresh offline boot failed: '+String(e.message));
  }finally{await fresh.close()}
  await context.setOffline(false);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.DEEN_BOOT&&['ready','error'].includes(DEEN_BOOT.status().phase),null,{timeout:85000});
  assert.equal(await page.evaluate(()=>DEEN_BOOT.status().phase),'ready');
  const saved=await page.evaluate(()=>({
   state:JSON.parse(localStorage.getItem('deen_v4_1_state')),
   heart:localStorage.getItem('deen_hearts_v1'),
   curriculum:localStorage.getItem('deen_arabic_foundations_v2'),
   spaced:localStorage.getItem('deen_arabic_v2_spaced_v1'),
   questionCount:DEEN_ARABIC_QUESTIONS_V2.stats().questions
  }));
  assert.equal(saved.state.xp,original.state.xp);
  assert.equal(saved.state.energy,original.state.energy);
  assert.equal(saved.heart,original.heart);
  assert.equal(saved.curriculum,original.curriculum);
  assert.equal(saved.spaced,original.spaced);
  assert.equal(saved.questionCount,600);
  report.state.reloadRetainsLegacyXpEnergyHearts=true;
  report.state.abandonedLessonDidNotForgePractice=true;
  assert.deepEqual(errors,[]);
  report.errors=errors;
  if(process.env.DEEN_QA_OUTPUT){
   fs.mkdirSync(process.env.DEEN_QA_OUTPUT,{recursive:true});
   fs.writeFileSync(path.join(process.env.DEEN_QA_OUTPUT,'arabic-v2-stage15-mobile.json'),JSON.stringify(report,null,2));
  }
  console.log('PASS ARABIC V2 STAGE15 MOBILE '+JSON.stringify(report));
 }finally{await context.close();await browser.close();server.close()}
})().catch(err=>{console.error(err);server.close();process.exit(1)});
