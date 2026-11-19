/* The home screen wears the game's palette: indigo ground (not the old teal slab behind it), gold call-to-action button,
   gold active tab, indigo cards, a colour per kind of stage. The other tabs keep their own look until they are done. */
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
 const css=(s,p)=>page.evaluate(([s,p])=>{const e=document.querySelector(s);return e?getComputedStyle(e)[p]:null},[s,p]);
 const rgb=v=>(String(v).match(/\d+(\.\d+)?/g)||[]).slice(0,3).map(Number);
 const phone=await css('#phone','backgroundImage');assert.match(phone,/linear-gradient/,'the ground behind the home screen is the indigo gradient, not a flat teal slab');
 const cta=await css('#v680HomeAction','backgroundImage');assert.match(cta,/linear-gradient/,'the call to action is a gradient');const [r,g,b]=rgb(await css('#v680HomeAction','backgroundColor').then(()=>cta.match(/rgb\(([^)]*)\)/)?.[0]));
 assert.ok(r>200&&g>150&&b<g-30,'the call to action is gold ('+cta.slice(0,80)+')');
 const nav=rgb(await css('nav.bottomnav .navbtn.active','color'));assert.ok(nav[0]>200&&nav[1]>180&&nav[2]<180,'the active tab is gold ('+nav+')');
 const card=await css('#v5Return section','backgroundImage');assert.doesNotMatch(card,/63, 215, 173/,'the next-step card has no teal glow left');
 const hasStages=await page.evaluate(()=>[...document.querySelectorAll('#v5Paths .lp-stop')].length>=5);assert.ok(hasStages);
 const roles=await page.evaluate(()=>[...document.querySelectorAll('#v5Paths .lp-stop .v630-macro-role')].slice(0,5).map(e=>getComputedStyle(e).color));assert.ok(new Set(roles).size>=4,'each kind of stage has its own colour ('+[...new Set(roles)].length+' colours)');
 // the other tabs are untouched for now
 await page.locator('.navbtn').nth(3).click();await page.waitForTimeout(1500);
 const prof=await css('#phone','backgroundImage');assert.equal(prof,'none','other tabs keep their own ground');
 await browser.close();server.close();console.log('PASS: home screen palette');
})().catch(e=>{console.error(e);process.exit(1)});
