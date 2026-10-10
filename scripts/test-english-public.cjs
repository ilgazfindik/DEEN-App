/* Release gate: exercise English without any QA bypass in a real first-run Chrome profile. */
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.env.DEEN_QA_OUTPUT||path.join(root,'qa/english-public');
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
 const requested=decodeURIComponent(req.url.split('?')[0]),file=path.join(root,requested==='/'?'index.html':requested);
 try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':'application/octet-stream');res.end(fs.readFileSync(file))}
 catch(_){res.statusCode=404;res.end('missing')}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],report={mode:'normal user without QA bypass',browser:browser.version()};
 page.on('pageerror',e=>errors.push(e.message));
 page.on('dialog',dialog=>dialog.accept());
 const url='http://127.0.0.1:'+server.address().port;
 await page.goto(url);
 await page.waitForSelector('#deenLanguageGate');
 assert.equal(await page.evaluate(()=>window.__DEEN_LOCALIZATION_QA__===true),false,'QA override must be absent');
 await page.locator('[data-locale="en"]').click();
 await page.locator('.deen-language-continue').click();
 await page.waitForSelector('#v998Onboarding');
 await page.locator('#v998Onboarding .v998-primary').click();
 await page.locator('#v998Name').fill('Normal English User');
 await page.locator('#v998Onboarding .v998-primary').click();
 await page.locator("[onclick=\"DEEN_PREMIUM_ONBOARDING.age(\\'adult\\')\"]").click();
 await page.locator('#v998Onboarding .v998-primary').click();
 await page.locator('#v998Onboarding [data-animal="owl"]').click();
 await page.locator('#v998Onboarding .v998-primary').click();
 await page.locator('[onclick="DEEN_PREMIUM_ONBOARDING.minutes(15)"]').click();
 await page.locator('#v998Onboarding .v998-primary').click();
 await page.locator('#v998Onboarding .v998-primary').click();
 await page.waitForFunction(()=>window.DEEN_BOOT?.isReady()&&state.onboarded,null,{timeout:120000});
 await page.waitForSelector('#v998Onboarding',{state:'detached'});
 const ready=await page.evaluate(()=>{
  const cfg=window.__DEEN_CONTENT_MANIFEST__.languages.en;
  const original=QUESTIONS.find(q=>q.activity_type==='multiple_choice');
  const translated=DEEN_CONTENT_LOCALE.translateQuestion(original,'en');
  return {startup:DEEN_BOOT.status(),lang:DEEN_APP_LOCALE.get(),htmlLang:document.documentElement.lang,config:cfg.global_qa,ui:cfg.ui,
   expertApproved:cfg.religious_expert_approved,questionCount:DEEN_CONTENT_LOCALE.inspectBank(window.DEEN_BASE_QUESTIONS,'en').translated,
   activeCount:DEEN_CONTENT_LOCALE.inspectBank(QUESTIONS,'en').translated,
   translated:!!translated&&translated.question_tr!==original.question_tr,qaOverride:window.__DEEN_LOCALIZATION_QA__===true};
 });
 assert.equal(ready.startup.phase,'ready',JSON.stringify(ready));
 assert.equal(ready.lang,'en');assert.equal(ready.htmlLang,'en');assert.equal(ready.config,'passed');
 assert.equal(ready.ui,'passed_chrome_qa');assert.equal(ready.expertApproved,false);
 assert.equal(ready.questionCount,1500);assert.equal(ready.activeCount,1484);assert.equal(ready.translated,true);assert.equal(ready.qaOverride,false);
 report.ready=ready;
 await page.screenshot({path:path.join(out,'english-public-onboarded.png')});
 await page.evaluate(()=>{state.energy=30;startStage('U01-S01')});
 const stageProbe=await page.evaluate(()=>({hasSession:!!session,stageId:session?.stage?.id,energy:state.energy,lessonActive:document.getElementById('lesson')?.classList.contains('active'),startup:DEEN_BOOT.status().phase,buttons:[...document.querySelectorAll('button')].filter(el=>el.getClientRects().length).map(el=>el.textContent.trim()).slice(-15)}));
 console.log('PUBLIC STAGE PROBE',JSON.stringify(stageProbe));
 await page.waitForFunction(()=>typeof session!=='undefined'&&!!session&&session.questions?.length>0,null,{timeout:15000});
 assert.equal(await page.locator('#lesson.active').count(),1,'Normal English lesson must open');
 // Non-QA first-run test: inspect real learning-loop cards and transitions, not just question data.
 const cardPlan=[
  {index:0,contains:['1 · MAIN IDEA','Islam means turning to Allah.','GOT IT · GO TO QUESTION']},
  {index:1,contains:['THREE KEY CONCEPTS','Faith, worship and good character reinforce one another.']},
  {index:2,contains:['UNIVERSAL IDENTITY','Being Muslim is not tied to one country.']},
  {index:3,contains:['SUBMISSION',"Submission means accepting Allah's guidance."]},
  {index:4,contains:['STAGE 2 · APPLY','START APPLYING']},
  {index:8,contains:['STAGE 3 · RECALL','START RECALL ROUND']}
 ];
 assert((await page.evaluate(()=>session.questions.length))>=9,'U01 pilot must have at least nine questions');
 const oldTurkish=/[ÇĞİÖŞÜçğıöşü]|\\b(?:İslam|İman|ibadet|ahlak|Öğrenme|öğrenme|aşama|şimdi|dört|önce|soruda|tekrar|soruya|başla|ipucu|İpuçları|kendi|hatırla|yönel|güven|teslim)\\b/i;
 report.teachingAudit=[];
 for(const plan of cardPlan){
  if(plan.index!==0)await page.evaluate(i=>{document.querySelector('.v910-overlay')?.remove();session.index=i;renderQuestion()},plan.index);
  await page.waitForSelector('.v910-overlay',{timeout:12000});
  await page.waitForFunction(needles=>needles.every(t=>(document.querySelector('.v910-overlay')?.innerText||'').includes(t)),plan.contains,{timeout:15000});
  const item=await page.evaluate(()=>({overlay:document.querySelector('.v910-overlay')?.innerText||'',phase:document.querySelector('.v910-phasebar')?.innerText||''}));
  assert(!oldTurkish.test(item.overlay+' '+item.phase),JSON.stringify({index:plan.index,...item}));
  report.teachingAudit.push({index:plan.index,translated:true,phase:item.phase});
 }
 const rawTeaching=await page.evaluate(()=>Object.values(DEEN_U01_S01_LEARNING_LOOP.teaching).flatMap(c=>Object.values(c)).map(value=>({source:value,display:DEEN_ENGLISH_UI.t(value)})));
 assert(rawTeaching.length>=16);
 for(const v of rawTeaching)assert(v.display!==v.source&&!oldTurkish.test(v.display),JSON.stringify(v));
 report.teachingTextCount=rawTeaching.length;
 console.log('PASS ENGLISH U01 TEACHING AND TRANSITIONS',JSON.stringify({cards:report.teachingAudit.length,fields:report.teachingTextCount}));
 report.lesson={stage:await page.evaluate(()=>session.stage.id),questionId:await page.evaluate(()=>session.questions[0].id)};
 await page.evaluate(()=>{closeLesson();state.xp=543;state.completed=['U01-S01'];saveState()});
 const before=await page.evaluate(()=>({xp:state.xp,completed:state.completed,companion:state.profile.companion}));
 await page.evaluate(()=>DEEN_APP_LOCALE.set('ar'));
 await page.waitForFunction(()=>window.DEEN_BOOT?.isReady()&&DEEN_APP_LOCALE.get()==='ar',null,{timeout:120000});
 const after=await page.evaluate(()=>({xp:state.xp,completed:state.completed,companion:state.profile.companion}));
 assert.deepEqual(after,before,'Switching to Arabic must preserve progress');
 await page.evaluate(()=>DEEN_APP_LOCALE.set('en'));
 await page.waitForFunction(()=>window.DEEN_BOOT?.isReady()&&DEEN_APP_LOCALE.get()==='en',null,{timeout:120000});
 assert.equal(await page.evaluate(()=>window.__DEEN_LOCALIZATION_QA__===true),false);
 report.switches='en -> ar -> en, preserved progress';
 assert.deepEqual(errors,[],JSON.stringify(errors));
 fs.writeFileSync(path.join(out,'english-public-release.json'),JSON.stringify({...report,errors},null,2));
 console.log('PASS NORMAL USER ENGLISH RELEASE GATE',JSON.stringify({...report,errors}));
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
