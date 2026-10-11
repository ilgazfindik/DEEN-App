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

 const scriptsUntouched=await page.evaluate(()=>{const scripts=[...document.querySelectorAll('script')].filter(s=>s.textContent.length>10000),before=scripts.map(s=>s.textContent);DEEN_ENGLISH_UI.localize(document.body);return scripts.length>0&&scripts.every((s,i)=>s.textContent===before[i]);});assert(scriptsUntouched,'English localization must never rewrite embedded source scripts');

 const ids=['DEEN-U04-S04-007','DEEN-U05-S02-005','DEEN-U05-S02-008','DEEN-U05-S04-003','DEEN-U05-S04-009','DEEN-U05-S04-013','DEEN-U13-S03-006','DEEN-U13-S06-012'];
 const results=[];
 for(const id of ids){
  const q=await page.evaluate(id=>{closeSheet();closeLesson();const q=DEEN_BASE_QUESTIONS.find(x=>x.id===id);session={stage:STAGES.find(s=>s.id===q.stage_id),questions:[q],index:0,correct:0,combo:0,bestCombo:0,startedAt:Date.now(),v5responses:[]};document.getElementById('lesson').classList.add('active');document.getElementById('quizView').style.display='flex';resetResultView(false);renderQuestion();return session.questions[0]},id);
  await page.waitForTimeout(180);
  if(await page.locator('.v910-overlay .v910-card-button').count())await page.locator('.v910-overlay .v910-card-button').click();
  const used=new Set(),chosen=[];
  for(let i=0;i<q.pairs.length;i++){
   // Choose a different identical label first: the visible meaning, not its hidden pair ID, must determine correctness.
   const candidates=q.pairs.map((p,j)=>({p,j})).filter(x=>x.p.right===q.pairs[i].right&&!used.has(x.j));
   const j=(candidates.find(x=>x.j!==i)||candidates[0]).j;used.add(j);chosen.push({left:i,right:j});
   await page.locator('#answerArea [data-side="left"][data-pair="'+i+'"]').click();
   await page.locator('#answerArea [data-side="right"][data-pair="'+j+'"]').click();
   await page.waitForTimeout(80);
   assert.equal(await page.locator('#answerArea [data-side="left"].matched').count(),i+1,id+' duplicate label rejected');
  }
  await page.waitForSelector('#feedback.show',{timeout:5000});
  assert.equal(await page.evaluate(()=>session.correct),1,id);
  fs.writeFileSync(path.join(out,id+'.html'),await page.locator('#lesson').innerHTML());
  await page.screenshot({path:path.join(out,id+'.png')});results.push({id,chosen,passed:true});
 }
 fs.writeFileSync(path.join(out,'duplicate-matching.json'),JSON.stringify({results,errors},null,2));
 assert.deepEqual(errors,[]);console.log('PASS DUPLICATE LABEL GAMEPLAY',results.length);
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
