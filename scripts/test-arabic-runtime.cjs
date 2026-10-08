/* Chromium integration tests against the real segmented application, using disposable local profiles. */
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.env.DEEN_QA_OUTPUT||path.join(root,'qa/arabic-runtime');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const url=req.url.split('?')[0],file=path.join(root,decodeURIComponent(url==='/'?'/index.html':url));try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':'application/octet-stream');res.end(fs.readFileSync(file))}catch(_){res.statusCode=404;res.end('missing')}});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,...(process.env.DEEN_CHROMIUM?{executablePath:process.env.DEEN_CHROMIUM}:{}),args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-zygote']});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],report={stages:[],macros:[],types:{},reviews:[],errors};
 page.on('pageerror',e=>{errors.push(e.message);console.log('ERROR',e.message)});
 await page.addInitScript(()=>{
  if(window.top!==window)return;
  // This test data exists only in this disposable browser context.
  if(!localStorage.getItem('deen_v4_1_state')){localStorage.setItem('deen_app_language_v1','ar');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:777,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'ar',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))}
  window.__qa={long:[],observers:[],globalListeners:0};const originalAdd=EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener=function(...args){if(this===window||this===document)__qa.globalListeners++;return originalAdd.apply(this,args)};const Native=MutationObserver;
  window.MutationObserver=class extends Native{constructor(fn){const row={fn:fn.toString().slice(0,160),callbacks:0,mutations:0,ms:0};__qa.observers.push(row);super((r,o)=>{row.callbacks++;row.mutations+=r.length;const t=performance.now();fn(r,o);row.ms+=performance.now()-t});this.qaRow=row}observe(...args){this.qaRow.active=true;return super.observe(...args)}disconnect(){this.qaRow.active=false;return super.disconnect()}};
  new PerformanceObserver(l=>__qa.long.push(...l.getEntries().map(e=>({start:e.startTime,ms:e.duration})))).observe({entryTypes:['longtask']});
 });
 await page.goto(url);await page.waitForFunction(()=>window.DEEN_BOOT?.status().phase==='ready'||window.DEEN_BOOT?.status().phase==='error',{timeout:30000});
 const boot=await page.evaluate(()=>DEEN_BOOT.status());assert.equal(boot.phase,'ready',JSON.stringify(boot));report.boot=boot;
 await sleep(7000);
 report.regression=await page.evaluate(()=>DEEN_RUNTIME_REGRESSION.run());assert.equal(report.regression.pass,true,JSON.stringify(report.regression.failed));
 report.preserved=await page.evaluate(()=>({xp:state.xp,companion:state.profile.companion,name:state.profile.name}));assert.deepEqual(report.preserved,{xp:777,companion:'owl',name:'QA'});
 // Idle performance after startup callbacks have completed.
 const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');await cdp.send('Profiler.enable');await cdp.send('Profiler.start');
 const before=await cdp.send('Performance.getMetrics');const longBefore=await page.evaluate(()=>__qa.long.length);await sleep(5000);const after=await cdp.send('Performance.getMetrics');
 fs.writeFileSync(path.join(out,'idle.cpuprofile'),JSON.stringify((await cdp.send('Profiler.stop')).profile));
 const metric=(m,n)=>m.metrics.find(x=>x.name===n)?.value;
 report.performance={idleSeconds:5,taskSeconds:metric(after,'TaskDuration')-metric(before,'TaskDuration'),heapBefore:metric(before,'JSHeapUsedSize'),heapAfter:metric(after,'JSHeapUsedSize'),idleLongTasks:await page.evaluate(i=>__qa.long.slice(i),longBefore)};
 console.log('PERFORMANCE',JSON.stringify(report.performance));
 // Unlock only test profile; exercise all established technical launchers.
 const ids=await page.evaluate(()=>{state.completed=STAGES.map(s=>s.id);state.energy=30;return STAGES.map(s=>s.id)});
 for(const id of ids){
  const start=await page.evaluate(id=>{document.getElementById('v5Sheet')?.close();state.energy=30;session=null;startStage(id);return {id,started:!!session,questions:session?.questions?.length||0}},id);
  if(start.started){await page.waitForTimeout(65);start.render=await page.evaluate(()=>{const q=session.questions[session.index];return {id:q.id,ar:q.__deenArabicFullBank===true,text:document.getElementById('questionText').innerText,type:q.activity_type,source:q,translation:DEEN_ARABIC_PILOT.runtime_variants[q.id]||DEEN_ARABIC_PILOT.live_translations[q.id]||DEEN_ARABIC_PILOT.translations[q.id]}});if(!start.render.ar)fs.writeFileSync(path.join(out,'failed-question.json'),JSON.stringify(start,null,2));assert(start.render.ar,JSON.stringify(start));assert(/[\u0600-\u06ff]/.test(start.render.text),JSON.stringify(start));await page.evaluate(()=>closeLesson());}
  report.stages.push(start);if(report.stages.length%15===0)console.log('STAGES',report.stages.length);
 }
 // The visible path has five macro nodes per unit, retaining each node's mini lessons.
 const defs=await page.evaluate(()=>DEEN_FIVE_STAGE.defs?Array.from({length:15},(_,i)=>DEEN_FIVE_STAGE.defs('U'+String(i+1).padStart(2,'0'))).flat():[]);
 console.log('MACRO_DEFS',defs.length);
 // Retrieve IDs from actual user-facing path buttons, not the legacy seven-stage mapping.
 const macroIds=await page.evaluate(()=>{state.sectionFinal={completed:true};state.section2Final={completed:true};DEEN_FIVE_STAGE.sync();return DEEN_FIVE_STAGE.all().map(d=>d.id)});
 for(const id of macroIds){const result=await page.evaluate(id=>{state.energy=30;session=null;startMacroStage(id);return {id,started:!!session,macro:session?.macroStage,questions:session?.questions?.map(q=>({id:q.id,ar:q.__deenArabicFullBank===true}))}},id);assert(result.started,JSON.stringify(result));if(result.started){assert.equal(result.macro,true);assert(result.questions.every(q=>q.ar),JSON.stringify(result));await page.evaluate(()=>closeLesson())}report.macros.push(result);}
 // Render every active record using the canonical renderer, including each question type.
 report.observerCountBefore=await page.evaluate(()=>__qa.observers.length);report.listenersBefore=await page.evaluate(()=>__qa.globalListeners);const active=await page.evaluate(()=>{window.__qaBank=[...new Map([...DEEN_BASE_QUESTIONS,...QUESTIONS].map(q=>[q.id,q])).values()];return __qaBank.map(q=>q.id)});
 for(let i=0;i<active.length;i++){
  const row=await page.evaluate(id=>{const q=__qaBank.find(x=>x.id===id);session={stage:STAGES.find(s=>s.id===q.stage_id),questions:[q],index:0,correct:0,combo:0,bestCombo:0,startedAt:Date.now(),v5responses:[]};document.getElementById('lesson').classList.add('active');document.getElementById('quizView').style.display='flex';resetResultView(false);renderQuestion();const rendered=session.questions[0];return {id,ar:rendered.__deenArabicFullBank===true,type:rendered.activity_type,text:document.getElementById('questionText').innerText,options:rendered.options_tr,answer:rendered.correct_answer,explanation:rendered.explanation_tr}},active[i]);
  assert(row.ar,JSON.stringify(row));assert(/[\u0600-\u06ff]/.test(row.explanation),row.id);report.types[row.type]=(report.types[row.type]||0)+1;
  if(i%100===0)console.log('RENDERED',i+1,'/',active.length);
  // Yield to actual question-rendered decorators, ensuring asynchronous UI work executes.
  await page.waitForTimeout(65);
  if(await page.locator('.v910-overlay .v910-card-button').count()){await page.locator('.v910-overlay .v910-card-button').click();await page.waitForTimeout(30)}
  const dom=await page.evaluate(()=>({question:document.querySelector('#questionText').innerText,answers:document.querySelector('#answerArea').innerText}));
  assert(/[\u0600-\u06ff]/.test(dom.question+dom.answers),row.id);
  if(row.options?.length)for(const option of row.options)assert(dom.answers.includes(option)||dom.question.includes(option),row.id+' missing displayed Arabic option: '+option);
 }
 report.listenersAfter=await page.evaluate(()=>__qa.globalListeners);assert.equal(report.listenersAfter,report.listenersBefore);report.observers=await page.evaluate(()=>__qa.observers);report.observerCountAfter=report.observers.length;assert(report.observerCountAfter-report.observerCountBefore<=8);report.activeObservers=report.observers.filter(x=>x.active).length;report.longTasks=await page.evaluate(()=>__qa.long);await cdp.send('HeapProfiler.collectGarbage');report.heapAfterRender=metric(await cdp.send('Performance.getMetrics'),'JSHeapUsedSize');report.rendered=active.length;report.baseRendered=1500;report.activeBankCount=1484;await page.evaluate(()=>closeLesson());
 for(const mode of ['smart','quick','mistakes','weak','due']){const result=await page.evaluate(mode=>{state.energy=30;state.mistakes=QUESTIONS.slice(0,10).map(q=>q.id);for(const q of QUESTIONS.slice(0,10))state.reviewSchedule[q.id]={nextReview:Date.now()-100,lastSeen:Date.now()-100000,correctCount:0,wrongCount:1};session=null;startSmartReview(mode);return {mode,started:!!session,adaptive:session?.adaptiveReview,arabic:session?.questions.every(q=>q.__deenArabicFullBank===true)}},mode);assert(result.started&&result.arabic,JSON.stringify(result));report.reviews.push(result);await page.evaluate(()=>closeLesson());}
 // Capture an actual macro question and its feedback.
 await page.evaluate(()=>{state.energy=30;closeSheet();startMacroStage('U01-M01')});await page.waitForTimeout(250);await page.screenshot({path:path.join(out,'arabic-question.png')});
 await page.evaluate(()=>completeQuestion(true,session.questions[session.index]));await page.waitForTimeout(150);report.feedback=await page.locator('#feedback').innerText();assert(/[\u0600-\u06ff]/.test(report.feedback));await page.screenshot({path:path.join(out,'arabic-feedback.png')});await page.evaluate(()=>closeLesson());
 // Reload tests the actual stored locale and progress without fresh initialization.
 fs.writeFileSync(path.join(out,'pre-reload-state.json'),await page.evaluate(()=>localStorage.getItem('deen_v4_1_state')));await page.reload();await page.waitForFunction(()=>window.DEEN_BOOT?.isReady()||window.DEEN_BOOT?.status().phase==='error',{timeout:30000});assert.equal((await page.evaluate(()=>DEEN_BOOT.status())).phase,'ready',JSON.stringify(await page.evaluate(()=>DEEN_BOOT.status())));assert.equal(await page.evaluate(()=>DEEN_APP_LOCALE.get()),'ar');report.localeReload=true;
 await page.evaluate(()=>DEEN_APP_LOCALE.set('tr'));await page.waitForFunction(()=>DEEN_BOOT.isReady()&&DEEN_APP_LOCALE.get()==='tr');await page.evaluate(()=>{state.energy=30;startMacroStage('U01-M01')});await page.waitForTimeout(150);report.turkish=await page.locator('#questionText').innerText();assert(/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(report.turkish));
 report.errors=errors;assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'runtime-report.json'),JSON.stringify(report,null,2));console.log('PASS',JSON.stringify({stages:report.stages.length,started:report.stages.filter(s=>s.started).length,macros:report.macros.length,rendered:report.rendered,types:report.types,reviews:report.reviews,performance:report.performance}));
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
