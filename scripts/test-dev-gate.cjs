/* The admin panel is a developer tool: regular visitors (any host except localhost) never see the "P" button, the P key and
   DEEN_ADMIN.open() do nothing. Developer mode turns on with ?dev=1 or ten quick taps in the top-left corner. Zoom stays allowed. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
 let browser;const args=['--no-sandbox','--disable-dev-shm-usage','--host-resolver-rules=MAP app.test 127.0.0.1','--unsafely-treat-insecure-origin-as-secure=http://app.test:'+port]; // a secure context, like the real https site (hash checks need crypto.subtle)
 try{browser=await chromium.launch({channel:'chrome',headless:true,args})}catch(_){browser=await chromium.launch({headless:true,args})}
 const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
 await ctx.addInitScript(()=>{if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:777,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))}});
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const boot=async url=>{await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForFunction(()=>document.documentElement.dataset.deenStartup==='ready',null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(1500)};
 const panelOpen=()=>page.evaluate(()=>!!document.querySelector('#deenAdminPanelV2[open]'));
 // 1. a regular visitor
 await boot('http://app.test:'+port+'/index.html');
 assert.equal(await page.evaluate(()=>window.__DEEN_DEV_MODE__),false,'not a developer');
 assert.equal(await page.locator('#deenMobileAdminButton').count(),0,'no P button for regular visitors');
 await page.keyboard.press('p');await page.waitForTimeout(300);
 assert.equal(await panelOpen(),false,'the P key does not open the panel');
 await page.evaluate(()=>{window.DEEN_ADMIN?.open?.();window.DEEN_ADMIN?.toggle?.()});await page.waitForTimeout(300);
 assert.equal(await panelOpen(),false,'DEEN_ADMIN.open() does nothing');
 const vp=await page.evaluate(()=>document.querySelector('meta[name=viewport]')?.content||'');
 assert.doesNotMatch(vp,/user-scalable\s*=\s*(no|0)/i,'pinch zoom stays allowed');assert.doesNotMatch(vp,/maximum-scale\s*=\s*1(\.0)?\b/i,'no zoom cap');
 assert.equal(await page.evaluate(()=>getComputedStyle(document.body).touchAction),'manipulation','no accidental double-tap zoom');
 // 2. the hidden switch: ten quick taps in the top-left corner
 for(let i=0;i<9;i++)await page.mouse.click(40,50);
 await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>localStorage.getItem('deen_dev_mode')),null,'nine taps are not enough');
 await Promise.all([page.waitForNavigation({timeout:60000}),page.mouse.click(40,50)]);
 await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(3000);
 assert.equal(await page.evaluate(()=>localStorage.getItem('deen_dev_mode')),'1','ten taps turn developer mode on');
 assert.equal(await page.evaluate(()=>window.__DEEN_DEV_MODE__),true);
 assert.equal(await page.locator('#deenMobileAdminButton').count(),1,'P button for the developer');
 await page.locator('#deenMobileAdminButton').click();await page.waitForTimeout(500);
 assert.equal(await panelOpen(),true,'the developer opens the panel');
 // 3. ?dev=0 turns it off again
 await boot('http://app.test:'+port+'/index.html?dev=0');
 assert.equal(await page.evaluate(()=>localStorage.getItem('deen_dev_mode')),null);
 assert.equal(await page.locator('#deenMobileAdminButton').count(),0,'back to a regular visitor');
 // 4. ?dev=1 and localhost
 await boot('http://app.test:'+port+'/index.html?dev=1');
 assert.equal(await page.locator('#deenMobileAdminButton').count(),1,'?dev=1 turns it on');
 await boot('http://127.0.0.1:'+port+'/index.html');
 assert.equal(await page.evaluate(()=>window.__DEEN_DEV_MODE__),true,'localhost is always a developer (tests rely on this)');
 assert.deepEqual(errors.filter(e=>!/Supabase|fetch|Failed to load|NetworkError/i.test(e)),[]);
 await browser.close();server.close();
 console.log('PASS: developer gate (admin panel hidden from regular visitors)');
})().catch(e=>{console.error(e);process.exit(1)});
