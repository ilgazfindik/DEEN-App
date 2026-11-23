/* The admin panel is a developer tool: regular visitors (any host except localhost) never see the "P" button, the P key and
   DEEN_ADMIN.open() do nothing. Developer mode turns on with ?dev=1 or ten quick taps in the top-left corner. The App Store app
   is never in developer mode; a TestFlight build (marked by the native shell) starts with it on. Zoom stays allowed. */
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
 // 5. the store app (Capacitor serves it from capacitor://localhost, so the hostname looks like localhost): never a developer,
 // not through ?dev=1, a stale switch left in storage, or the tap switch
 const ctxN=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
 await ctxN.addInitScript(()=>{window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>'ios'};if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.setItem('deen_dev_mode','1');localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,streak:3,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))}});
 const pn=await ctxN.newPage();await pn.goto('http://127.0.0.1:'+port+'/index.html?dev=1');await pn.waitForSelector('.navbtn',{timeout:90000});await pn.waitForTimeout(2500);
 assert.equal(await pn.evaluate(()=>window.__DEEN_DEV_MODE__),false,'the store app is never in developer mode');
 assert.equal(await pn.locator('#deenMobileAdminButton').count(),0,'no P button in the store app');
 assert.equal(await pn.evaluate(()=>localStorage.getItem('deen_dev_mode')),null,'a stale developer switch is cleared');
 for(let i=0;i<10;i++)await pn.mouse.click(40,50);await pn.waitForTimeout(500);
 assert.equal(await pn.evaluate(()=>localStorage.getItem('deen_dev_mode')),null,'the tap switch does nothing in the store app');
 await ctxN.close();
 // 6. a TestFlight (or debug) build: the native shell sets window.__ILNURA_TESTFLIGHT__ before the page loads, so developer
 // mode is on by default there — the P button shows and opens the panel; ten taps switch it off and back on.
 const ctxT=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
 await ctxT.addInitScript(()=>{window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>'ios'};window.__ILNURA_TESTFLIGHT__=true;if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:777,profile:{name:'QA',companion:'cat'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[]}))}});
 const pt=await ctxT.newPage();const bootT=async()=>{await pt.waitForSelector('.navbtn',{timeout:90000});await pt.waitForFunction(()=>document.documentElement.dataset.deenStartup==='ready',null,{timeout:90000}).catch(()=>{});await pt.waitForTimeout(2000)};
 await pt.goto('http://127.0.0.1:'+port+'/index.html');await bootT();
 assert.equal(await pt.evaluate(()=>window.__DEEN_DEV_MODE__),true,'TestFlight build: developer mode on by default');
 assert.equal(await pt.locator('#deenMobileAdminButton').count(),1,'TestFlight build: P button');
 await pt.locator('#deenMobileAdminButton').click();await pt.waitForTimeout(500);
 assert.equal(await pt.evaluate(()=>!!document.querySelector('#deenAdminPanelV2[open]')),true,'TestFlight build: the panel opens');
 await pt.evaluate(()=>document.querySelector('#deenAdminPanelV2[open]')?.close());await pt.waitForTimeout(300);
 for(let i=0;i<9;i++)await pt.mouse.click(40,50);
 await Promise.all([pt.waitForNavigation({timeout:60000}),pt.mouse.click(40,50)]);await bootT();
 assert.equal(await pt.evaluate(()=>[window.__DEEN_DEV_MODE__,localStorage.getItem('deen_dev_mode')].join()),'false,0','ten taps switch it off in TestFlight');
 assert.equal(await pt.locator('#deenMobileAdminButton').count(),0,'no P button once switched off');
 for(let i=0;i<9;i++)await pt.mouse.click(40,50);
 await Promise.all([pt.waitForNavigation({timeout:60000}),pt.mouse.click(40,50)]);await bootT();
 assert.equal(await pt.evaluate(()=>window.__DEEN_DEV_MODE__),true,'and ten more taps switch it back on');
 assert.equal(await pt.locator('#deenMobileAdminButton').count(),1,'P button back');
 await ctxT.close();
 // 7. TestFlight recognised only by asking the native side (NativeTabBar.buildInfo through Capacitor.nativePromise), with
 // no document-start flag: the P button still appears.
 const ctxB=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
 await ctxB.addInitScript(()=>{window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>'ios',nativePromise:(p,m)=>p==='NativeTabBar'&&m==='buildInfo'?Promise.resolve({testBuild:true,source:'appTransaction:Sandbox'}):Promise.reject(new Error('no '+p+'.'+m)),addListener:()=>({remove:async()=>{}})};
  if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:777,profile:{name:'QA',companion:'cat'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[]}))}});
 const pb=await ctxB.newPage();await pb.goto('http://127.0.0.1:'+port+'/index.html');await pb.waitForSelector('.navbtn',{timeout:90000});await pb.waitForFunction(()=>document.documentElement.dataset.deenStartup==='ready',null,{timeout:90000}).catch(()=>{});await pb.waitForTimeout(2000);
 assert.equal(await pb.evaluate(()=>window.__DEEN_DEV_MODE__),true,'TestFlight confirmed by the native side: developer mode on');
 assert.equal(await pb.locator('#deenMobileAdminButton').count(),1,'TestFlight confirmed by the native side: P button');
 await pb.locator('#deenMobileAdminButton').click();await pb.waitForTimeout(500);
 assert.equal(await pb.evaluate(()=>!!document.querySelector('#deenAdminPanelV2[open]')),true,'and the panel opens');
 await ctxB.close();
 assert.deepEqual(errors.filter(e=>!/Supabase|fetch|Failed to load|NetworkError/i.test(e)),[]);
 await browser.close();server.close();
 console.log('PASS: developer gate (admin panel hidden from regular visitors and the App Store app, on in TestFlight builds)');
})().catch(e=>{console.error(e);process.exit(1)});
