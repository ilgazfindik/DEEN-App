/* The internal review flag REQUIRES_EXPERT_VERIFICATION lives in the question data (policy: questions stay "needs review"),
   but learners must never see it in the lesson's source note. The honest "expert review pending" note stays. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
 await ctx.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,streak:3,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))});
 const page=await ctx.newPage();await page.goto(url);await page.waitForFunction(()=>window.DEEN_BOOT?.status().phase==='ready',null,{timeout:90000});await page.waitForTimeout(3000);
 const res=await page.evaluate(async()=>{state.completed=[];state.energy=30;session=null;startStage(STAGES[0].id);const out=[];
  for(let i=0;i<session.questions.length&&out.length<6;i++){const q=session.questions[i];session.index=i;renderQuestion();await new Promise(r=>setTimeout(r,500));const d=document.querySelector('.v5-source');
   out.push({flagInData:/REQUIRES_EXPERT_VERIFICATION/.test((q.source_reference||'')+(q.source_evidence_note||'')),shown:/REQUIRES_EXPERT_VERIFICATION/.test(d?.textContent||''),text:(d?.textContent||'').slice(0,80)})}
  return out});
 assert.ok(res.some(r=>r.flagInData),'the data still carries the review flag');
 for(const r of res)assert.equal(r.shown,false,'the flag is never shown to learners: '+r.text);
 assert.ok(res.some(r=>/Uzman incelemesi bekliyor/.test(r.text)),'the honest expert-review note stays');
 await browser.close();server.close();console.log('PASS: review flag hidden from learners, expert-review note kept');
})().catch(e=>{console.error(e);process.exit(1)});
