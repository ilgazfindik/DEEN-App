/* Fill in the blank: when the answer is graded the character row stays where it was, the scene is not rebuilt, and the word bank
   (or the typed answer box) stays on screen, dimmed, instead of vanishing. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true});
 await ctx.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,streak:3,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))});
 const page=await ctx.newPage();await page.goto(url);await page.waitForFunction(()=>window.DEEN_BOOT?.status().phase==='ready',null,{timeout:90000});await page.waitForTimeout(3500);
 for(const mode of ['chip','typed']){
  const ready=await page.evaluate(async mode=>{
   // Stage sessions draw a random subset of questions, so one pass can miss a kind: try several passes.
   for(let pass=0;pass<12;pass++){state.completed=[];state.energy=30;for(const st of STAGES){session=null;try{startStage(st.id)}catch(e){continue}if(!session)continue;for(let i=0;i<session.questions.length;i++){const q=session.questions[i];if(q.activity_type!=='fill_blank')continue;const chip=Array.isArray(q.options_tr)&&q.options_tr.length>0;if((mode==='chip')!==chip)continue;session.index=i;renderQuestion();return {a:q.correct_answer}}}}return null},mode);
  assert.ok(ready,mode+': a question of this kind exists');await page.waitForTimeout(1200);
  const card=page.locator('.v910-overlay .v910-card-button');if(await card.count()){await card.first().click();await page.waitForTimeout(1200)}
  const snap=()=>page.evaluate(()=>{const R=s=>{const e=document.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect(),c=getComputedStyle(e);return {top:Math.round(b.top),h:Math.round(b.height),shown:b.height>2&&c.display!=='none'&&c.visibility!=='hidden'&&+c.opacity>0.05}};return {row:R('.deen-character-question-row'),bank:R('.v1040-fill-bank'),input:R('.fill-input'),scene:document.querySelector('.v9920-lesson-scene'),img:!!document.querySelector('.deen-character-question-avatar img')}});
  const before=await snap();await page.evaluate(()=>{window.__scene=document.querySelector('.v9920-lesson-scene')});
  await page.evaluate(async c=>{const f=document.querySelector('#lesson .question-frame');const el=[...f.querySelectorAll('.v1040-fill-chip')].find(e=>(e.textContent||'').trim()===String(c.a).trim());if(el)el.click();else{const inp=f.querySelector('.fill-input');if(inp){inp.value=String(c.a);inp.dispatchEvent(new Event('input',{bubbles:true}))}}await new Promise(z=>setTimeout(z,300));document.querySelector('#answerArea .template-action')?.click()},ready);
  await page.waitForSelector('#feedback.show',{timeout:10000});
  for(let i=0;i<12;i++){await page.waitForTimeout(150);const s=await snap();
   assert.equal(s.row.top,before.row.top,mode+': the character row did not move');assert.equal(s.img,true,mode+': the character stays');
   if(before.bank)assert.equal(s.bank&&s.bank.shown,true,mode+': the word bank stays on screen');
   if(before.input)assert.equal(s.input&&s.input.shown,true,mode+': the answer box stays on screen')}
  const same=await page.evaluate(()=>window.__scene===document.querySelector('.v9920-lesson-scene'));assert.equal(same,true,mode+': the scene is not rebuilt');
  console.log('  ok',mode);
 }
 await browser.close();server.close();console.log('PASS: fill in the blank keeps its screen when graded (chip and typed)');
})().catch(e=>{console.error(e);process.exit(1)});
