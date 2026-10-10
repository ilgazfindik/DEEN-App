/* Google Chrome tests for correct/wrong feedback and a persisted global switch. */
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.env.DEEN_QA_OUTPUT||path.join(root,'qa/global-locale');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const p=decodeURIComponent(req.url.split('?')[0]),file=path.join(root,p==='/'?'index.html':p);try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':'application/octet-stream');res.end(fs.readFileSync(file));}catch(_){res.statusCode=404;res.end('missing');}});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']}),report={browser:'Google Chrome',version:browser.version(),languages:{}};
 for(const lang of ['tr','ar']){
  const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',dialog=>dialog.accept());
  await page.goto(url);await page.waitForSelector('#deenLanguageGate');await page.locator('[data-locale="'+lang+'"]').click();await page.locator('.deen-language-continue').click();await page.waitForSelector('#v998Onboarding');
  await page.locator('#v998Onboarding .v998-primary').click();await page.locator('#v998Name').fill('QA');await page.locator('#v998Onboarding .v998-primary').click();
  await page.locator('[onclick="DEEN_PREMIUM_ONBOARDING.age(\'adult\')"]').click();await page.locator('#v998Onboarding .v998-primary').click();await page.locator('#v998Onboarding [data-animal="cat"]').click();await page.locator('#v998Onboarding .v998-primary').click();
  await page.locator('[onclick="DEEN_PREMIUM_ONBOARDING.minutes(15)"]').click();await page.locator('#v998Onboarding .v998-primary').click();await page.locator('#v998Onboarding .v998-primary').click();
  await page.waitForFunction(()=>window.DEEN_BOOT?.isReady()&&state.onboarded);await page.waitForSelector('#v998Onboarding',{state:'detached'});
  await page.evaluate(()=>{state.xp=321;state.completed=['U01-S01'];saveState();});const feedback=[];
  for(const correct of [false,true]){
   await page.evaluate(()=>{closeSheet();closeLesson();const q=QUESTIONS.find(q=>q.stage_id==='U02-S01'&&q.activity_type==='multiple_choice');session={stage:STAGES.find(s=>s.id===q.stage_id),questions:[q],index:0,correct:0,combo:0,bestCombo:0,startedAt:Date.now(),v5responses:[]};document.getElementById('lesson').classList.add('active');document.getElementById('quizView').style.display='flex';resetResultView(false);renderQuestion();});
   await page.waitForTimeout(250);if(await page.locator('.v910-overlay .v910-card-button').count())await page.locator('.v910-overlay .v910-card-button').click();
   const q=await page.evaluate(()=>session.questions[0]),answer=correct?q.correct_answer:q.options_tr.find(x=>x!==q.correct_answer);
   await page.evaluate(answer=>{document.querySelectorAll('[data-qa-feedback]').forEach(x=>x.removeAttribute('data-qa-feedback'));const b=[...document.querySelectorAll('#answerArea button')].find(x=>x.dataset.value===answer||(x.querySelector('.option-label')?.textContent||x.textContent).trim()===answer);if(b)b.dataset.qaFeedback='1';},answer);
   await page.locator('[data-qa-feedback]').click();if(!await page.locator('#feedback.show').count()){const c=page.locator('#answerArea .v710-action:not([disabled]),#answerArea .template-action:not([disabled])').last();if(await c.count())await c.click();}
   await page.waitForSelector('#feedback.show');const text=await page.locator('#feedback').innerText();assert.equal(await page.evaluate(()=>session.correct),correct?1:0);
   if(lang==='ar')assert(!/[ÇĞİÖŞÜçğıöşü]|\b(?:Doğru|Yanlış|Kısaca|Cevap|Dikkat)\b/.test(text),text);else assert(/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(text));
   await page.screenshot({path:path.join(out,'chrome-'+lang+'-'+(correct?'correct':'wrong')+'.png')});feedback.push({id:q.id,correct,text});
  }
  // An active lesson rejects a change without discarding answers.
  const next=lang==='tr'?'ar':'tr';assert.equal(await page.evaluate(next=>DEEN_APP_LOCALE.set(next),next),false);assert.equal(await page.locator('html').getAttribute('lang'),lang);
  await page.evaluate(()=>closeLesson());const before=await page.evaluate(()=>({xp:state.xp,completed:state.completed,profile:state.profile}));
  await page.evaluate(next=>DEEN_APP_LOCALE.set(next),next);await page.waitForFunction(next=>window.DEEN_BOOT?.isReady()&&DEEN_APP_LOCALE.get()===next,next);
  const after=await page.evaluate(()=>({xp:state.xp,completed:state.completed,profile:state.profile}));assert.deepEqual(after,before);
  assert.equal(await page.locator('html').getAttribute('lang'),next);assert.equal(await page.locator('#deenLanguageGate').count(),0);assert.equal(await page.locator('#v998Onboarding').count(),0);
  const title=await page.locator('#heroU1').getByRole('heading').first().innerText();if(next==='ar')assert(/[\u0600-\u06ff]/.test(title));else assert(!/[\u0600-\u06ff]/.test(title),title);
  report.languages[lang]={feedback,switchTo:next,progressPreserved:true,activeLessonGuard:true,errors};assert.deepEqual(errors,[]);await context.close();
 }
 fs.writeFileSync(path.join(out,'global-feedback-chrome.json'),JSON.stringify(report,null,2));console.log('PASS CHROME FEEDBACK',JSON.stringify(report));await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1);});
