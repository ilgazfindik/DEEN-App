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
  window.__qa={long:[],observers:[],listeners:0};const Native=MutationObserver;
  window.MutationObserver=class extends Native{constructor(fn){const row={fn:fn.toString().slice(0,160),callbacks:0,mutations:0,ms:0};__qa.observers.push(row);super((r,o)=>{row.callbacks++;row.mutations+=r.length;const t=performance.now();fn(r,o);row.ms+=performance.now()-t})}};
  new PerformanceObserver(l=>__qa.long.push(...l.getEntries().map(e=>({start:e.startTime,ms:e.duration})))).observe({entryTypes:['longtask']});
 });
 await page.goto(url);await page.waitForFunction(()=>window.DEEN_BOOT?.status().phase==='ready'||window.DEEN_BOOT?.status().phase==='error',{timeout:30000});
 const boot=await page.evaluate(()=>DEEN_BOOT.status());assert.equal(boot.phase,'ready',JSON.stringify(boot));report.boot=boot;

 const snapshots=[];
 async function capture(name){await page.waitForTimeout(200);const data=await page.evaluate(()=>{const texts=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){const el=node.parentElement;if(!el||el.closest('script,style,[data-deen-no-translate]')||!el.getClientRects().length||getComputedStyle(el).visibility==='hidden')continue;const text=node.nodeValue.trim();if(text&&/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(text))texts.push(text)}return [...new Set(texts)]});snapshots.push({name,texts:data});console.log('SURFACE',name,JSON.stringify(data));}
 await capture('home');
 for(const tab of ['review','profile','league']){await page.evaluate(tab=>navigate(tab+'Screen'),tab);await capture(tab)}
 const quran=await page.evaluate(()=>({keys:Object.keys(DEEN_QURAN),audio:Object.keys(DEEN_QURAN_AYAH_AUDIO),practice:DEEN_QURAN_PRACTICE.types}));console.log('QURAN',JSON.stringify(quran));
 for(const id of Object.keys(await page.evaluate(()=>DEEN_QURAN_AYAH_AUDIO.configs()))){await page.evaluate(id=>DEEN_QURAN.openSurah(id),id);await capture('journey-'+id);await page.evaluate(()=>DEEN_QURAN_JOURNEY_V2.startStage('learn'));await capture('learn-'+id);const audio=await page.evaluate(id=>DEEN_QURAN_AYAH_AUDIO.play(1,id),id);await page.waitForTimeout(250);const audioState=await page.evaluate(()=>DEEN_QURAN_AYAH_AUDIO.state());console.log('AUDIO',id,audio,JSON.stringify(audioState));assert(audio&&audioState.currentTime>0,id);await page.evaluate(()=>DEEN_QURAN_AYAH_AUDIO.stop());await page.screenshot({path:path.join(out,'quran-'+id+'.png')})}
 await page.evaluate(()=>{for(const id of Object.keys(DEEN_QURAN_AYAH_AUDIO.configs()))for(let n=1;n<=DEEN_QURAN_AYAH_AUDIO.config(id).count;n++)DEEN_QURAN.updateAyah(id,n,{completedAt:new Date().toISOString()});DEEN_QURAN.openSurah('fatiha');DEEN_QURAN_JOURNEY_V2.startStage('memorize')});await capture('memorize');
 for(const type of quran.practice){await page.evaluate(type=>DEEN_QURAN_PRACTICE.open(type,1),type);await capture('practice-'+type)}

 const quiz=[];for(const id of ['fatiha','ikhlas','falaq','nas','kafirun','nasr','masad','fil','quraysh','maun','sharh','tin','bayyina','zilzal','kawthar','asr']){
 const ready=await page.evaluate(id=>DEEN_QURAN_AYET_TEST.start(id),id);assert(ready,id);await capture('ayah-test-'+id);
 const questions=await page.evaluate(()=>DEEN_QURAN_JOURNEY_V2.buildQuestions('ayah',1));assert.equal(questions.length,5);for(const q of questions)assert.equal(q.options.filter(o=>o.text===q.answer).length,1);
 await page.locator('.deen-qj2-option').first().click();await page.locator('.deen-qj2-next').click();await page.waitForTimeout(120);assert((await page.evaluate(()=>DEEN_QURAN_AYET_TEST.snapshot())).answered);
 await capture('ayah-feedback-'+id);await page.locator('.deen-qj2-next').click();quiz.push({id,questionCount:questions.length,passedInteraction:true});
 }
 for(const type of ['fill_blank','continuation','surah','audio','next_ayah','ayah_number','meaning']){await page.evaluate(type=>DEEN_QURAN_QUESTION_ARENA.open(type,'all'),type);await capture('arena-'+type);const q=await page.evaluate(()=>DEEN_QURAN_QUESTION_ARENA.state().q);if(q){await page.locator('.deen-qarena-option').first().click();await capture('arena-feedback-'+type)}}
 const audioAudit=await page.evaluate(()=>DEEN_QURAN_AYAH_AUDIO.regressionAudit());assert(audioAudit.ok);console.log('AUDIO AUDIT',JSON.stringify(audioAudit));
 await page.evaluate(()=>{closeSheet();DEEN_PREMIUM_ONBOARDING.render(0)});await capture('login');
 for(let step=1;step<=6;step++){await page.evaluate(step=>{DEEN_PREMIUM_ONBOARDING.render(step)},step);await capture('onboarding-'+step)}
 const leaks=snapshots.flatMap(s=>s.texts.filter(t=>/[ÇĞİÖŞÜçğıöşü]|\b(?:Ayet|doğru|görev|sure|EZBER|Hoparlöre|Yolculuğu|SIFIRLA|Mevcut)\b/i.test(t)).map(text=>({surface:s.name,text})));assert.deepEqual(leaks,[]);assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'surface-scan.json'),JSON.stringify({snapshots,quran,quiz,audioAudit,errors},null,2));await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
