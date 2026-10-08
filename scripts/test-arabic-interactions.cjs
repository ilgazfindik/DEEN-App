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

 const types=await page.evaluate(()=>[...new Set(QUESTIONS.map(q=>q.activity_type))]);const interactions=[],residual=new Set();
 for(const type of types){
 const id=await page.evaluate(type=>QUESTIONS.find(q=>q.activity_type===type)?.id,type);
 const q=await page.evaluate(id=>{closeSheet();closeLesson();const q=QUESTIONS.find(x=>x.id===id);session={stage:STAGES.find(s=>s.id===q.stage_id),questions:[q],index:0,correct:0,combo:0,bestCombo:0,startedAt:Date.now(),v5responses:[]};document.getElementById('lesson').classList.add('active');document.getElementById('quizView').style.display='flex';resetResultView(false);renderQuestion();return session.questions[0]},id);
 await page.waitForTimeout(180);if(await page.locator('.v910-overlay .v910-card-button').count()){await page.locator('.v910-overlay .v910-card-button').click();await page.waitForTimeout(100)}
 const texts=await page.locator('#lesson').innerText();for(const line of texts.split('\n'))if(/[ÇĞİÖŞÜçğıöşü]|\b(?:DERS|SIRAYI|KAVRAM|doğru|yanlış|soru|ders|tekrar|eşleşme|kelime|cevap|Devam|Kontrol)\b/i.test(line))residual.add(line);
 fs.writeFileSync(path.join(out,'last-question.html'),await page.locator('#lesson').innerHTML());fs.writeFileSync(path.join(out,'residual.json'),JSON.stringify([...residual]));const area=page.locator('#answerArea');
 if(type==='matching'){
 for(let i=0;i<q.pairs.length;i++){await area.locator('[data-side="left"][data-pair="'+i+'"]').click();await area.locator('[data-side="right"][data-pair="'+i+'"]').click()}
 }else if(q.items?.length){for(const text of q.correct_order){const bank=area.locator('.sequence-bank,.v710-word-bank');await bank.getByRole('button',{name:text,exact:true}).first().click()}await area.locator('button:not([disabled])').filter({hasText:/تحق|فحص/}).last().click();
 }else if(await area.locator('input:visible').count()){
 await area.locator('input:visible').fill(q.correct_answer);await area.locator('button:not([disabled])').last().click();
 }else{
 await page.evaluate(answer=>{document.querySelectorAll('[data-qa-answer]').forEach(x=>x.removeAttribute('data-qa-answer'));const b=[...document.querySelectorAll('#answerArea button')].find(x=>x.dataset.value===answer||(x.querySelector('.option-label')?.textContent||x.textContent).trim()===answer);if(b)b.dataset.qaAnswer='1'},q.correct_answer);const answer=area.locator('[data-qa-answer]');
 if(await answer.count())await answer.click();else{console.log('NO ANSWER',type,q.correct_answer,await area.innerText());interactions.push({type,id,blocked:true});continue;}
 if(!await page.locator('#feedback.show').count()){const confirm=area.locator('.v710-action:not([disabled]),.template-action:not([disabled])').last();if(await confirm.count())await confirm.click();}
 }
 await page.waitForSelector('#feedback.show',{timeout:5000});assert.equal(await page.evaluate(()=>session.correct),1,type);const feedback=await page.locator('#feedback').innerText();assert(/[\u0600-\u06ff]/.test(feedback));interactions.push({type,id,passed:true,feedback});console.log('INTERACTION',type,'PASS');
 }
 fs.writeFileSync(path.join(out,'interaction-report.json'),JSON.stringify({interactions,residual:[...residual],errors},null,2));console.log('RESIDUAL',JSON.stringify([...residual]));assert.deepEqual(errors,[]);assert.deepEqual([...residual],[]);assert(interactions.every(x=>x.passed),JSON.stringify(interactions.filter(x=>!x.passed)));await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
