/* The opening animation: first launch keeps the full story; returning players get the same story at about half the length;
   reduced motion keeps its own short version. Checked through the class and the computed animation timings (not wall-clock time,
   so a slow machine cannot make it flaky). */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const seed={lang:'tr',returning:{onboarded:true,xp:777,streak:5,profile:{name:'Ali',companion:'owl'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}};
 async function probe(label,{returning,reduce}){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',reducedMotion:reduce?'reduce':'no-preference'});
  await ctx.addInitScript(([r,st])=>{localStorage.setItem('deen_app_language_v1','tr');if(r)localStorage.setItem('deen_v4_1_state',JSON.stringify(st))},[returning,seed.returning]);
  const page=await ctx.newPage();await page.goto(url,{waitUntil:'commit'});
  await page.waitForFunction(()=>document.getElementById('ilnura-splash')?.classList.contains('go'),null,{timeout:60000});
  const r=await page.evaluate(()=>{const root=document.getElementById('ilnura-splash');return {fast:root.classList.contains('fast'),rm:root.classList.contains('rm'),hi:getComputedStyle(root.querySelector('.sp-hi')).animationDelay,line:getComputedStyle(root.querySelector('.sp-line')).animationDuration}});
  await ctx.close();console.log(' ',label,JSON.stringify(r));return r;
 }
 const first=await probe('first launch',{returning:false,reduce:false});
 assert.equal(first.fast,false,'first launch keeps the full animation');assert.equal(first.hi,'1.5s');assert.equal(first.line,'0.95s');
 const back=await probe('returning player',{returning:true,reduce:false});
 assert.equal(back.fast,true,'returning players get the short animation');assert.equal(back.hi,'0.82s','the greeting still appears');assert.equal(back.line,'0.5s');
 const rm=await probe('returning, reduced motion',{returning:true,reduce:true});
 assert.equal(rm.fast,false,'reduced motion keeps its own version');assert.equal(rm.rm,true);
 await browser.close();server.close();
 console.log('PASS: opening animation is shorter for returning players');
})().catch(e=>{console.error(e);process.exit(1)});
