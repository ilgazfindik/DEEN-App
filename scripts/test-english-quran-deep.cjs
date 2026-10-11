/* Chromium integration tests against the real segmented application, using disposable local profiles. */
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.env.DEEN_QA_OUTPUT||path.join(root,'qa/english-runtime');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const url=req.url.split('?')[0],file=path.join(root,decodeURIComponent(url==='/'?'/index.html':url));try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':'application/octet-stream');res.end(fs.readFileSync(file))}catch(_){res.statusCode=404;res.end('missing')}});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({channel:'chrome',headless:true,...(process.env.DEEN_CHROMIUM?{executablePath:process.env.DEEN_CHROMIUM}:{}),args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-zygote']});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],report={stages:[],macros:[],types:{},reviews:[],errors};
 report.browser={name:'Google Chrome',version:browser.version()};
 page.on('console',m=>{if(m.type()==='error')console.log('BROWSER',m.text())});page.on('pageerror',e=>{errors.push(e.message);console.log('ERROR',e.message)});
 await page.addInitScript(()=>{
  if(window.top!==window)return;window.__DEEN_LOCALIZATION_QA__=true;
  // This test data exists only in this disposable browser context.
  if(!localStorage.getItem('deen_v4_1_state')){localStorage.setItem('deen_app_language_v1','en');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:777,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'en',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))}
  window.__qa={long:[],observers:[],listeners:0};const Native=MutationObserver;
  window.MutationObserver=class extends Native{constructor(fn){const row={fn:fn.toString().slice(0,160),callbacks:0,mutations:0,ms:0};__qa.observers.push(row);super((r,o)=>{row.callbacks++;row.mutations+=r.length;const t=performance.now();fn(r,o);row.ms+=performance.now()-t})}};
  new PerformanceObserver(l=>__qa.long.push(...l.getEntries().map(e=>({start:e.startTime,ms:e.duration})))).observe({entryTypes:['longtask']});
 });
 await page.goto(url);await page.waitForFunction(()=>window.DEEN_BOOT?.status().phase==='ready'||window.DEEN_BOOT?.status().phase==='error',{timeout:30000});
 const boot=await page.evaluate(()=>DEEN_BOOT.status());assert.equal(boot.phase,'ready',JSON.stringify(boot));report.boot=boot;


 const surfaces=[];
 async function capture(name){
  await page.waitForTimeout(100);
  const data=await page.evaluate(()=>{
   const scope=document.querySelector('#v5Sheet')||document.body;
   const texts=[],attrs=[],walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);let n;
   while(n=walker.nextNode())if(n.parentElement?.getClientRects().length&&!n.parentElement.closest('script,style,[lang="ar"],[data-deen-no-translate]')){const s=n.textContent.trim();if(s)texts.push(s)}
   for(const el of scope.querySelectorAll('[aria-label],[title],[alt]'))if(el.getClientRects().length)for(const k of ['aria-label','title','alt'])if(el.getAttribute(k))attrs.push(el.getAttribute(k));
   return {texts,attrs,overflow:document.documentElement.scrollWidth>innerWidth+2,html:scope.outerHTML};
  });
  fs.writeFileSync(path.join(out,name+'.html'),data.html);delete data.html;surfaces.push({name,...data});
  fs.writeFileSync(path.join(out,'deep-surfaces.json'),JSON.stringify({browser:report.browser,surfaces,errors},null,2));
  if(name.startsWith('fatiha-')||name.startsWith('arena-'))await page.screenshot({path:path.join(out,name+'.png')});
 }
 await page.evaluate(()=>navigate('leagueScreen'));
 const ids=await page.evaluate(()=>Object.keys(DEEN_QURAN_AYAH_AUDIO.configs()));
 for(const id of ids){
  await page.evaluate(id=>{closeSheet();id==='ikhlas'?DEEN_QURAN_IKHLAS.open(1):DEEN_QURAN_MULTI.openLearning(id,1)},id);
  for(let step=0;step<5;step++){
   await capture(id+'-learn-'+step);
   if(step===3){await page.locator('[onclick*=".reveal()"]').last().click();await capture(id+'-learn-revealed')}
   if(step<4)await page.locator(id==='ikhlas'?'[onclick="DEEN_QURAN_IKHLAS.next()"]':'[onclick="DEEN_QURAN_MULTI.next()"]' ).click();
  }
  await page.locator(id==='ikhlas'?'[onclick="DEEN_QURAN_IKHLAS.finishAyah()"]':'[onclick="DEEN_QURAN_MULTI.finish()"]' ).click();
  await capture(id+'-learn-finished');

  const count=await page.evaluate(id=>DEEN_QURAN_AYAH_AUDIO.config(id).count,id);
  for(let ayah=2;ayah<=count;ayah++){
   await page.evaluate(({id,ayah})=>{closeSheet();id==='ikhlas'?DEEN_QURAN_IKHLAS.open(ayah):DEEN_QURAN_MULTI.openLearning(id,ayah)},{id,ayah});
   await capture(id+'-ayah-'+ayah+'-learn');
  }
  await page.evaluate(id=>{for(let i=0;i<4;i++)id==='ikhlas'?DEEN_QURAN_IKHLAS.next():DEEN_QURAN_MULTI.next();id==='ikhlas'?DEEN_QURAN_IKHLAS.finishAyah():DEEN_QURAN_MULTI.finish()},id);
  await capture(id+'-surah-finished');
  for(let level=1;level<=5;level++){
   await page.evaluate(({id,level})=>{closeSheet();DEEN_QURAN.updateAyah(id,1,{completedAt:new Date().toISOString(),memorizationLevel:level-1});id==='ikhlas'?DEEN_QURAN_MEM.open(1):DEEN_QURAN_MULTI.openMem(id,1)},{id,level});
   await capture(id+'-mem-level-'+level);
   await page.evaluate(id=>id==='ikhlas'?DEEN_QURAN_MEM.reveal():DEEN_QURAN_MULTI.memReveal(),id);
   await capture(id+'-mem-level-'+level+'-revealed');
  }

 }
 for(const type of ['fill_blank','continuation','surah','audio','next_ayah','ayah_number','meaning']){
  await page.evaluate(type=>DEEN_QURAN_QUESTION_ARENA.open(type,'all'),type);await capture('arena-'+type);
  await page.locator('.deen-qarena-option').first().click();await capture('arena-'+type+'-feedback');
 }
 for(const width of [320,768,1440]){
  await page.setViewportSize({width,height:900});
  await page.evaluate(()=>{closeSheet();DEEN_QURAN_MULTI.openLearning('fatiha',7)});await capture('fatiha-width-'+width);
 }
 fs.writeFileSync(path.join(out,'deep-surfaces.json'),JSON.stringify({browser:report.browser,surfaces,errors},null,2));
 console.log('DEEP_SURFACES',surfaces.length,'ERRORS',JSON.stringify(errors));
 const leaks=surfaces.flatMap(s=>[...s.texts,...s.attrs].filter(t=>/[ÇĞİÖŞÜçğıöşü]|\b(?:Ezberi|Tamamla|TAMAMLA|Anlam|ANLAM|Oku|OKU|Hatırla|HATIRLA|Motoru|metin|turunu|kaydı|Pratik)\b/.test(t)).map(text=>({surface:s.name,text})));
 console.log('LANGUAGE_LEAKS',JSON.stringify(leaks));assert.deepEqual(leaks,[]);
 assert(!surfaces.some(s=>s.overflow),'Horizontal viewport overflow');
 assert.deepEqual(errors,[]);
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
