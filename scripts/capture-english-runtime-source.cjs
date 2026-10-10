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
 page.on('pageerror',e=>{errors.push(e.message);console.log('ERROR',e.message)});
 await page.addInitScript(()=>{
  if(window.top!==window)return;
  // This test data exists only in this disposable browser context.
  if(!localStorage.getItem('deen_v4_1_state')){localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:777,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))}
  window.__qa={long:[],observers:[],globalListeners:0};const originalAdd=EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener=function(...args){if(this===window||this===document)__qa.globalListeners++;return originalAdd.apply(this,args)};const Native=MutationObserver;
  window.MutationObserver=class extends Native{constructor(fn){const row={fn:fn.toString().slice(0,160),callbacks:0,mutations:0,ms:0};__qa.observers.push(row);super((r,o)=>{row.callbacks++;row.mutations+=r.length;const t=performance.now();fn(r,o);row.ms+=performance.now()-t});this.qaRow=row}observe(...args){this.qaRow.active=true;return super.observe(...args)}disconnect(){this.qaRow.active=false;return super.disconnect()}};
  new PerformanceObserver(l=>__qa.long.push(...l.getEntries().map(e=>({start:e.startTime,ms:e.duration})))).observe({entryTypes:['longtask']});
 });
 await page.goto(url);await page.waitForFunction(()=>window.DEEN_BOOT?.status().phase==='ready'||window.DEEN_BOOT?.status().phase==='error',{timeout:30000});
 const boot=await page.evaluate(()=>DEEN_BOOT.status());assert.equal(boot.phase,'ready',JSON.stringify(boot));report.boot=boot;
 await sleep(7000);

 await page.evaluate(()=>DEEN_ARABIC_PILOT.preload());
 const snapshot=await page.evaluate(()=>{
  const fields=['question_tr','explanation_tr','activity_type','options_tr','correct_answer','pairs','items','correct_order','stage_title','topic','concept_id','teaching_card'];
  const raw=q=>q.__deenSourceQuestion||q;
  const live=QUESTIONS.filter(q=>q.id.startsWith('DEEN-U01-')).map(q=>{q=raw(q);return {id:q.id,stage_id:q.stage_id,...Object.fromEntries(fields.map(k=>[k,q[k]??null]))};});
  return {live,variants:DEEN_ARABIC_PILOT.runtime_variants,active:QUESTIONS.length,base:DEEN_BASE_QUESTIONS.length};
 });
 assert.equal(snapshot.live.length,84);assert.equal(Object.keys(snapshot.variants).length,20);
 assert.equal(snapshot.active,1484);assert.equal(snapshot.base,1500);
 console.log('DEEN_ENGLISH_SOURCE_SNAPSHOT='+JSON.stringify(snapshot));
 fs.writeFileSync(path.join(out,'runtime-source-snapshot.json'),JSON.stringify(snapshot,null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
