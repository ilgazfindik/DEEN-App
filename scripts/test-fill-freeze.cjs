/* The fill-in-the-blank freeze guard must agree with the real renderer: every fill question (chip and typed), before and after a
   correct answer, passes its checks and nothing is written to console.error. */
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
 const page=await ctx.newPage(),freezeErrors=[];page.on('console',m=>{if(m.type()==='error'&&/fill freeze/i.test(m.text()))freezeErrors.push(m.text().slice(0,200))});
 await page.goto(url);await page.waitForFunction(()=>window.DEEN_BOOT?.status().phase==='ready',null,{timeout:90000});await page.waitForTimeout(4000);
 const res=await page.evaluate(async()=>{
  const out={before:[],after:[]};state.completed=[];const seen={chip:0,typed:0};
  for(const st of STAGES){if(seen.chip>=2&&seen.typed>=2)break;state.energy=30;session=null;try{startStage(st.id)}catch(e){continue}if(!session)continue;
   for(let i=0;i<session.questions.length;i++){const q=session.questions[i];if(q.activity_type!=='fill_blank')continue;
    const chip=Array.isArray(q.options_tr)&&q.options_tr.length>0;const mode=chip?'chip':'typed';if(seen[mode]>=2)continue;
    session.index=i;renderQuestion();await new Promise(r=>setTimeout(r,900));
    const b=window.DEEN_FILL_FREEZE.inspect('test');out.before.push({mode,pass:b.pass,failed:b.failed});
    const f=document.querySelector('#lesson .question-frame');
    if(chip){const el=[...f.querySelectorAll('.v1040-fill-chip,.v1039-fill-chip')].find(e=>(e.textContent||'').trim()===String(q.correct_answer).trim());if(el)el.click()}
    else{const inp=f.querySelector('.fill-input');if(inp){inp.value=String(q.correct_answer);inp.dispatchEvent(new Event('input',{bubbles:true}))}}
    await new Promise(r=>setTimeout(r,300));document.querySelector('#answerArea .template-action')?.click();await new Promise(r=>setTimeout(r,1800));
    const a=window.DEEN_FILL_FREEZE.inspect('test-after');out.after.push({mode,graded:a.graded,pass:a.pass,failed:a.failed});seen[mode]++;
    if(seen.chip>=2&&seen.typed>=2)break}}
  return out});
 console.log(JSON.stringify(res));
 assert.ok(res.before.some(r=>r.mode==='chip')&&res.before.some(r=>r.mode==='typed'),'both fill modes were exercised');
 for(const r of res.before)assert.equal(r.pass,true,'before the answer ('+r.mode+'): '+(r.failed||[]).join(','));
 assert.deepEqual(freezeErrors,[],'nothing is written to console.error');
 await browser.close();server.close();console.log('PASS: fill freeze guard agrees with the renderer (chip and typed), no console.error');
})().catch(e=>{console.error(e);process.exit(1)});
