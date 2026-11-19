/* The result sheet (Harika! / Birlikte düzeltelim) has no listen button and its text is never read aloud, correct or wrong,
   even when the auto-read feedback setting is on. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
 await ctx.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,streak:3,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'tr',onboardingLanguageConfirmed:true,narration:true,narrationAutoFeedback:true},completed:[],mistakes:[]}));
  window.__spoken=[];try{const orig=window.speechSynthesis.speak.bind(window.speechSynthesis);window.speechSynthesis.speak=u=>{window.__spoken.push(String(u.text||''));return orig(u)}}catch(_){}});
 const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(3000);
 await page.locator('.v680-main').first().click();await page.waitForSelector('#answerArea .option',{timeout:30000});await page.waitForTimeout(1800);
 const open=n=>page.evaluate(async n=>{state.completed=[];state.energy=30;let k=0;for(const st of STAGES){session=null;try{startStage(st.id)}catch(e){continue}if(!session)continue;for(let i=0;i<session.questions.length;i++){if(session.questions[i].activity_type!=='multiple_choice')continue;if(k++<n)continue;session.index=i;renderQuestion();return session.questions[i].correct_answer}}return null},n);
 for(const [mode,n] of [['correct',0],['wrong',1]]){
  const c=await open(n);await page.waitForTimeout(900);
  const card=page.locator('.v910-overlay .v910-card-button');if(await card.count()){await card.first().click();await page.waitForTimeout(1200)}
  await page.evaluate(()=>{window.__spoken.length=0});
  const opt=mode==='correct'?page.locator('#answerArea .option').filter({hasText:String(c)}).first():page.locator('#answerArea .option').filter({hasNotText:String(c)}).first();
  const bb=await opt.boundingBox();await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);
  await page.waitForSelector('#feedback.show #continueBtn',{timeout:10000});await page.waitForTimeout(1500);
  const r=await page.evaluate(()=>({btn:document.querySelectorAll('.v960-feedback-speak').length,shown:[...document.querySelectorAll('.v960-feedback-speak')].some(b=>b.getClientRects().length),spoken:window.__spoken.length,text:(document.getElementById('feedbackText')?.textContent||'').length}));
  assert.ok(r.text>10,mode+': the explanation text is still shown');assert.equal(r.shown,false,mode+': no listen button in the sheet');assert.equal(r.spoken,0,mode+': nothing is read aloud');
 }
 await browser.close();server.close();console.log('PASS: result sheet has no listen button and is never read aloud');
})().catch(e=>{console.error(e);process.exit(1)});
