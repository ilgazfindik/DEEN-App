/* On a short screen (Safari with its bars: about 393x664) a choice question must still fill the whole screen: no scaling from the
   top-left corner (that left a gap on the right and at the bottom); the frame scrolls instead. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 for(const [w,h] of [[393,664],[375,560],[390,844]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},serviceWorkers:'block',isMobile:true,hasTouch:true});
  await ctx.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,streak:3,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))});
  const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(3000);
  await page.locator('.v680-main').first().click();await page.waitForSelector('#answerArea .option',{timeout:30000});await page.waitForTimeout(2200);
  const r=await page.evaluate(()=>{const f=document.querySelector('#lesson .question-frame'),b=f.getBoundingClientRect();return {w:innerWidth,h:innerHeight,right:Math.round(b.right),bottom:Math.round(b.bottom),tf:getComputedStyle(f).transform,fitted:document.getElementById('lesson').classList.contains('v9913-fitted'),scrolls:f.scrollHeight>f.clientHeight}});
  assert.equal(r.tf,'none',w+'x'+h+': no scaling');assert.equal(r.fitted,false);
  assert.ok(r.right>=r.w-10,w+'x'+h+': full width ('+r.right+' of '+r.w+')');assert.ok(r.bottom>=r.h-10,w+'x'+h+': full height ('+r.bottom+' of '+r.h+')');
  console.log('  ok',w+'x'+h,JSON.stringify(r));await ctx.close();
 }
 await browser.close();server.close();console.log('PASS: choice screens fill short screens (no corner scaling)');
})().catch(e=>{console.error(e);process.exit(1)});
