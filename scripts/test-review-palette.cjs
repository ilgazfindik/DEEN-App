/* The review tab wears the game's palette (indigo ground, indigo plan card, a colour per mode and per number, gold ring), and the
   home screen's little 1-2-3 bubbles are no longer mint green. Quran keeps its own look until it is done. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true});
 await ctx.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,streak:3,learningProfile:'adult',profile:{name:'QA',companion:'lion'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:['U01-S01','U01-S02'],mistakes:[]}))});
 const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(4000);
 const bubble=await page.evaluate(()=>{const s=document.querySelector('.v680-step.current>span');return s?getComputedStyle(s).backgroundImage+' '+getComputedStyle(s).backgroundColor:null});
 assert.ok(bubble&&/linear-gradient/.test(bubble),'the current 1-2-3 bubble is gold, not mint ('+bubble+')');
 await page.locator('.navbtn').nth(1).click();await page.waitForSelector('#reviewScreenBody .dsr-stat',{timeout:20000});await page.waitForTimeout(1200);
 const r=await page.evaluate(()=>{const g=(s,p)=>{const e=document.querySelector(s);return e?getComputedStyle(e)[p]:null};return {ground:g('#phone','backgroundImage'),plan:g('.dsr-plan','backgroundImage'),stats:[...document.querySelectorAll('.dsr-stat')].map(e=>getComputedStyle(e).borderTopColor),modes:[...document.querySelectorAll('.dsr-mode')].map(e=>getComputedStyle(e).borderTopColor),ring:g('.dsr-ring-fill','stroke')}});
 assert.match(r.ground,/linear-gradient/,'the ground behind the review tab is the indigo gradient');assert.doesNotMatch(r.plan,/63, 215, 173/,'the plan card has no teal glow left');
 assert.ok(new Set(r.stats).size>=4,'each number has its own colour');assert.ok(new Set(r.modes).size>=4,'each mode has its own colour');
 const ring=(r.ring.match(/\d+/g)||[]).map(Number);assert.ok(ring[0]>200&&ring[1]>180,'the progress ring is gold ('+r.ring+')');
 await page.locator('.navbtn').nth(2).click();await page.waitForTimeout(1800);
 const q=await page.evaluate(()=>getComputedStyle(document.querySelector('#phone')).backgroundImage);assert.match(q,/linear-gradient/,'the Quran tab has the indigo ground too');
 await browser.close();server.close();console.log('PASS: review palette');
})().catch(e=>{console.error(e);process.exit(1)});
