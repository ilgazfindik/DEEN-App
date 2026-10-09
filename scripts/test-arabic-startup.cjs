/* Chromium integration tests against the real segmented application, using disposable local profiles. */
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.env.DEEN_QA_OUTPUT||path.join(root,'qa/arabic-runtime');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const url=req.url.split('?')[0],file=path.join(root,decodeURIComponent(url==='/'?'/index.html':url));try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':'application/octet-stream');res.end(fs.readFileSync(file))}catch(_){res.statusCode=404;res.end('missing')}});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,...(process.env.DEEN_CHROMIUM?{executablePath:process.env.DEEN_CHROMIUM}:{}),args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-zygote']});

 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],report={};page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForSelector('#deenLanguageGate');assert.equal(await page.locator('[data-locale]').count(),6);assert.equal(await page.locator('.v9912-authbtn').count(),0);
 await page.locator('[data-locale="ar"]').click();assert.equal(await page.locator('#deenLanguageGate').getAttribute('lang'),'ar');await page.getByRole('button',{name:'متابعة',exact:true}).click();
 await page.waitForSelector('#v998Onboarding');await page.waitForFunction(()=>window.DEEN_BOOT?.status().phase==='onboarding');
 assert.equal(await page.evaluate(()=>DEEN_APP_LOCALE.get()),'ar');assert.equal(await page.locator('.v9912-authbtn').count(),0);
 await page.locator('[onclick="onboarding(1)"]').click();await page.locator('#v998Name').fill('اختبار');await page.locator('[onclick="DEEN_PREMIUM_ONBOARDING.nameNext()"]').click();
 assert.equal(await page.locator('#v998Onboarding h1').innerText(),'اختر أسلوب التعلّم الأنسب لك');
 for(const id of ['child','teen','adult'])await page.locator('[onclick="DEEN_PREMIUM_ONBOARDING.age(\''+id+'\')"]').click();
 await page.locator('#v998Onboarding .v998-primary').click();assert.equal(await page.locator('[data-animal]').count(),6);
 await page.locator('[data-animal="cat"]').click();await page.locator('#v998Onboarding .v998-primary').click();
 await page.locator('[onclick="DEEN_PREMIUM_ONBOARDING.minutes(15)"]').click();await page.locator('#v998Onboarding .v998-primary').click();
 assert.equal(await page.locator('#deenPreparation').count(),0);
 await page.evaluate(()=>{window.__progress=[];window.__progressObserver=new MutationObserver(()=>{const p=document.querySelector('#deenPreparation progress');if(p)__progress.push(Number(p.value))});__progressObserver.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['value']})});
 let fail=true;await page.route('**/assets/i18n/questions/ar/units/U07.json*',r=>fail?r.fulfill({status:503,body:'offline'}):r.continue());
 await page.locator('[onclick="DEEN_PREMIUM_ONBOARDING.finish()"]').click();await page.waitForFunction(()=>DEEN_BOOT.status().phase==='error');
 report.failedLoad=await page.evaluate(()=>({boot:DEEN_BOOT.status(),onboarded:state.onboarded,progress:__progress}));assert(report.failedLoad.boot.progress<100);assert(!report.failedLoad.onboarded);assert(!report.failedLoad.progress.includes(100));
 fail=false;await page.locator('#deenPreparation [data-retry]').click();await page.waitForFunction(()=>DEEN_BOOT.isReady()&&state.onboarded);await page.waitForSelector('#v998Onboarding',{state:'detached'});
 report.onboarding=await page.evaluate(()=>({snapshot:DEEN_PREMIUM_ONBOARDING.snapshot(),progress:__progress,locale:DEEN_APP_LOCALE.get()}));assert.equal(report.onboarding.snapshot.animal,'cat');assert.equal(report.onboarding.snapshot.age,'adult');assert.equal(report.onboarding.snapshot.minutes,15);assert(report.onboarding.progress.includes(0)&&report.onboarding.progress.includes(100));
 await page.waitForTimeout(250);
 // Inspect attributes as well as visible text; prior scans missed mixed-language screen-reader labels.
 report.homeLanguage=await page.evaluate(()=>{
   const root=document.getElementById('learnScreen'),values=[];
   for(const el of root.querySelectorAll('*')){
     for(const name of ['aria-label','title','alt'])if(el.hasAttribute(name))values.push({kind:name,text:el.getAttribute(name)});
     if(!el.children.length&&el.getClientRects().length)values.push({kind:'text',text:el.innerText||''});
   }
   return values.filter(v=>/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(v.text.replace(/DEEN|XP/g,'')));
 });
 assert.deepEqual(report.homeLanguage,[]);
 await page.screenshot({path:path.join(out,'fresh-arabic-home.png')});
 await page.evaluate(async()=>{state.xp=321;state.completed=['U01-S01'];saveState();await(await caches.open('deen-release-obsolete')).put('old',new Response('old'));const current=await caches.open('deen-release-'+DEEN_BOOT.build);await current.put('./release/v9.9.3-direct/segment-66.txt?v='+DEEN_BOOT.build,new Response('CORRUPTED CACHE'))});
 await page.reload();await page.waitForFunction(()=>window.DEEN_BOOT?.isReady());report.cache=await page.evaluate(async()=>({keys:await caches.keys(),xp:state.xp,completed:state.completed,onboarding:!!document.getElementById('v998Onboarding'),locale:DEEN_APP_LOCALE.get()}));assert.equal(report.cache.xp,321);assert(report.cache.completed.includes('U01-S01'));assert(!report.cache.keys.includes('deen-release-obsolete'));assert(!report.cache.onboarding);assert.equal(report.cache.locale,'ar');
 for(const viewport of [{width:320,height:740},{width:1440,height:1000}]){await page.setViewportSize(viewport);await page.waitForTimeout(150);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert(!overflow,JSON.stringify(viewport));await page.screenshot({path:path.join(out,'viewport-'+viewport.width+'.png')})}report.viewports=[320,390,1440];
 assert.deepEqual(errors,[]);report.errors=errors;fs.writeFileSync(path.join(out,'startup-report.json'),JSON.stringify(report,null,2));console.log('PASS STARTUP',JSON.stringify(report));await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
