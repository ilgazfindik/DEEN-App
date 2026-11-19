/* The profile tab wears the game's palette: indigo ground, indigo identity card and cards, a colour per statistic tile.
   Other tabs keep their own look until they are done. */
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
 const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(3500);
 await page.locator('.navbtn').nth(3).click();await page.waitForSelector('#profileScreenBody .dsp-stat',{timeout:20000});await page.waitForTimeout(1200);
 const r=await page.evaluate(()=>{const g=(s,p)=>{const e=document.querySelector(s);return e?getComputedStyle(e)[p]:null};return {ground:g('#phone','backgroundImage'),id:g('.dsp-id','backgroundImage'),idBorder:g('.dsp-id','borderTopColor'),card:g('.dsp-card','backgroundImage'),stats:[...document.querySelectorAll('.dsp-stat')].map(e=>getComputedStyle(e).borderTopColor),bg:g('#profileScreenBody','backgroundImage')}});
 assert.match(r.ground,/linear-gradient/,'the ground behind the profile is the indigo gradient');
 assert.doesNotMatch(r.id,/63, 215, 173/,'the identity card has no teal glow left');assert.match(r.card,/linear-gradient/);
 assert.ok(r.stats.length>=6);assert.ok(new Set(r.stats).size>=5,'each statistic has its own colour ('+new Set(r.stats).size+' colours)');
 await page.locator('.navbtn').nth(0).click();await page.waitForTimeout(1500);
 await page.locator('.navbtn').nth(1).click();await page.waitForTimeout(1500);
 const review=await page.evaluate(()=>getComputedStyle(document.querySelector('#phone')).backgroundImage);assert.equal(review,'none','the review tab keeps its own ground for now');
 await browser.close();server.close();console.log('PASS: profile palette');
})().catch(e=>{console.error(e);process.exit(1)});
