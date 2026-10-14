/* Actual Google Chrome integration test; all profiles are disposable. */
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.env.DEEN_QA_OUTPUT||path.join(root,'qa/global-locale');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const p=decodeURIComponent(req.url.split('?')[0]),file=path.join(root,p==='/'?'index.html':p);try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':'application/octet-stream');res.end(fs.readFileSync(file));}catch(_){res.statusCode=404;res.end('missing');}});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={browser:'Google Chrome',version:browser.version(),languages:{},fullSupport:false};
 for(const lang of ['tr','ar','en','de','fr']){
  const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForSelector('#deenLanguageGate');assert.equal(await page.locator('.phone').count(),0);assert.equal(await page.locator('.v9912-authbtn').count(),0);
  assert.equal(await page.locator('[data-locale]').count(),5);assert.equal(await page.locator('[data-locale="es"]').count(),0);assert(!await page.locator('.deen-language-continue').isEnabled());
  await page.locator('[data-locale="'+lang+'"]').click();assert.equal(await page.locator('#deenLanguageGate').getAttribute('lang'),lang);
  await page.screenshot({path:path.join(out,'chrome-'+lang+'-language.png')});
  await page.locator('.deen-language-continue').click();await page.waitForSelector('#deenAccountGate');
  assert.equal(await page.locator('#deenAccountGate').getAttribute('lang'),lang);
  assert.equal(await page.locator('#deenAccountGate [data-social]').count(),2);
  assert.equal(await page.locator('#deenAccountGate .da-email').count(),1);
  // All provider buttons carry a real inline SVG, with label visually centered.
  const providerLayout=await page.evaluate(()=>{
   const gate=document.querySelector('#deenAccountGate');
   return [...gate.querySelectorAll('.da-provider')].map(button=>{
    const svg=button.querySelector('.da-provider-icon svg'),label=button.querySelector('.da-provider-label');
    const b=button.getBoundingClientRect(),l=label.getBoundingClientRect(),i=svg?.getBoundingClientRect();
    return {icon:!!svg,hidden:svg?.getAttribute('aria-hidden'),svgWidth:i?.width,
     labelOffset:Math.abs((l.left+l.width/2)-(b.left+b.width/2)),
     overflow:label.scrollWidth>label.clientWidth+1,dir:getComputedStyle(button).direction};
   });
  });
  assert.equal(providerLayout.length,3);
  for(const row of providerLayout){assert(row.icon&&row.hidden==='true','Decorative provider SVG missing');
   assert.equal(row.svgWidth,20);assert(row.labelOffset<4,'Provider label must stay centered '+JSON.stringify(row));
   assert(!row.overflow,'Provider label must not overflow '+JSON.stringify(row));}
  if(lang==='ar')assert(providerLayout.every(x=>x.dir==='rtl'),'Arabic icon/label layout must be RTL');
  if(lang==='tr'){
   await page.locator('#deenAccountGate .da-email').click();
   assert.equal(await page.locator('#deenAccountGate form input[type="email"]').count(),1);
   assert.equal(await page.locator('#deenAccountGate form input[type="password"]').count(),1);
   await page.locator('#deenAccountGate [data-mode="signin"]').click();
   await page.locator('#deenAccountGate .da-reset').click();
   assert.equal(await page.locator('#deenAccountGate form input[type="password"]').count(),0);
  }
  await page.locator('#deenAccountGate .da-guest').click();await page.waitForSelector('#v998Onboarding');
  assert.equal(await page.locator('#deenAccountGate').count(),0);
  assert.equal(await page.locator('#deenLanguageGate').count(),0);assert.equal(await page.locator('.v9912-authbtn').count(),0);
  assert.equal(await page.locator('#v998Onboarding').getAttribute('lang'),lang);
  const screens=[];
  async function capture(step){assert.equal(await page.locator('#v998Onboarding .v998-hero').count(),0,'No decorative hero on onboarding step '+step);const motion=await page.locator('#v998Onboarding').getAttribute('data-deen-motion');assert(['initial','forward','backward','steady'].includes(motion),'Unexpected onboarding motion: '+motion);if(step===0)assert.equal(motion,'initial');if(step===1||step===5)assert.equal(motion,'forward');if(step===2||step===3||step===4)assert.equal(motion,'steady');if(motion!=='steady')await page.waitForTimeout(350);const text=await page.locator('#v998Onboarding').innerText();if(lang!=='tr')assert(!/Yol arkadaşını|Kaplumbağa|Günlük hedef|Sana nasıl|Kısa, sade/.test(text),lang+':'+step);screens.push({step,text});assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));await page.screenshot({path:path.join(out,'chrome-'+lang+'-onboarding-'+step+'.png')});}
  await capture(0);
  assert.equal(await page.locator('#v998Onboarding').getAttribute('data-deen-motion'),'initial');
  assert.equal(await page.evaluate(()=>DEEN_PREMIUM_ONBOARDING.transitions.type),'soft-slide');
  assert.equal(await page.evaluate(()=>DEEN_PREMIUM_ONBOARDING.transitions.finish),'mint-liquid');
  async function assertWelcomeCentered(label){
   const box=await page.evaluate(()=>{
    const rect=selector=>document.querySelector(selector).getBoundingClientRect();
    const copy=rect('#v998Onboarding .v998-copy'),logo=rect('#v998Onboarding .v998-top');
    const dots=rect('#v998Onboarding .v998-dots'),bottom=rect('#v998Onboarding .v998-bottom');
    return {viewport:innerHeight,copyCenter:(copy.top+copy.bottom)/2,copyTop:copy.top,logoBottom:logo.bottom,dotsBottom:dots.bottom,buttonTop:bottom.top,buttonBottom:bottom.bottom};
   });
   assert(box.copyCenter/box.viewport>0.36&&box.copyCenter/box.viewport<0.64,lang+':'+label+': welcome text is not vertically centered '+JSON.stringify(box));
   assert(box.copyTop>box.logoBottom+25,lang+':'+label+': welcome title crowds logo');
   assert(box.buttonTop>box.dotsBottom+25,lang+':'+label+': dots crowd CTA');
   assert(box.buttonBottom<=box.viewport+1,lang+':'+label+': bottom CTA is clipped');
  }
  await assertWelcomeCentered('390x844');
  if(lang==='tr'){
   await page.evaluate(()=>onboarding(1));assert.equal(await page.locator('#v998Onboarding').getAttribute('data-deen-motion'),'forward');
   await page.evaluate(()=>onboarding(0));assert.equal(await page.locator('#v998Onboarding').getAttribute('data-deen-motion'),'backward');
   const direction=await page.locator('#v998Onboarding .v998-copy').evaluate(el=>getComputedStyle(el).animationName);
   assert(direction.includes('deenOnboardBackward'),'Back transition must animate from left');
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.evaluate(()=>onboarding(1));
   const reduced=await page.locator('#v998Onboarding .v998-copy').evaluate(el=>getComputedStyle(el).animationName);
   assert.equal(reduced,'none','Reduced motion must disable entrance transitions');
   await page.evaluate(()=>onboarding(0));
   await page.emulateMedia({reducedMotion:'no-preference'});
   await page.waitForTimeout(350);
   await assertWelcomeCentered('after-back-navigation');
  }
  if(lang==='tr'||lang==='fr'){
   await page.setViewportSize({width:320,height:700});
   await assertWelcomeCentered('320x700');
   await page.screenshot({path:path.join(out,'chrome-'+lang+'-welcome-centered-320x700.png')});
   await page.setViewportSize({width:390,height:844});
  }
  await page.locator('#v998Onboarding .v998-primary').click();await page.locator('#v998Name').fill('QA');await capture(1);
  await page.locator('#v998Onboarding .v998-primary').click();await page.locator('[onclick="DEEN_PREMIUM_ONBOARDING.age(\'adult\')"]').click();await capture(2);
  await page.locator('#v998Onboarding .v998-primary').click();assert.equal(await page.locator('#v998Onboarding [data-animal]').count(),6);await page.locator('#v998Onboarding [data-animal="cat"]').click();await capture(3);
  await page.locator('#v998Onboarding .v998-primary').click();await page.locator('[onclick="DEEN_PREMIUM_ONBOARDING.minutes(15)"]').click();await capture(4);
  await page.locator('#v998Onboarding .v998-primary').click();await capture(5);await page.locator('#v998Onboarding .v998-primary').click();
  if(['tr','ar','en','fr'].includes(lang)){
   await page.waitForFunction(()=>window.DEEN_BOOT?.isReady()&&state.onboarded);await page.waitForSelector('#v998Onboarding',{state:'detached'});
   const before=await page.evaluate(()=>({locale:DEEN_APP_LOCALE.get(),xp:state.xp,completed:state.completed,profile:state.profile,minutes:state.minutes}));assert.equal(before.locale,lang);assert.equal(before.profile.companion,'cat');assert.equal(before.minutes,15);
   await page.screenshot({path:path.join(out,'chrome-'+lang+'-home.png')});await page.reload();await page.waitForFunction(()=>window.DEEN_BOOT?.isReady());
   assert.equal(await page.locator('#deenLanguageGate').count(),0);assert.equal(await page.locator('#v998Onboarding').count(),0);
   const after=await page.evaluate(()=>({locale:DEEN_APP_LOCALE.get(),xp:state.xp,completed:state.completed,profile:state.profile,minutes:state.minutes}));assert.deepEqual(after,before);
   if(lang==='tr'){
    await page.goto(url+'?previewAccount=1');await page.waitForSelector('#deenAccountGate');
    assert.equal(await page.locator('#deenAccountGate [data-social]').count(),2);
    assert.equal(await page.evaluate(()=>window.DEEN_AUTH_GATE.configured()),false);
    assert.equal(await page.locator('#v998Onboarding').count(),0);
    await page.screenshot({path:path.join(out,'chrome-returning-user-account-preview.png')});
    await page.locator('#deenAccountGate .da-guest').click();
    await page.waitForSelector('#deenAccountGate',{state:'detached'});
    const preserved=await page.evaluate(()=>({locale:DEEN_APP_LOCALE.get(),xp:state.xp,completed:state.completed,profile:state.profile,minutes:state.minutes}));
    assert.deepEqual(preserved,before,'Preview must not alter returning user progress');
    assert.equal(await page.evaluate(()=>state.onboarded),true);
    // Full reset is destructive for DEEN data, but must retain unrelated origin data.
    await page.evaluate(()=>{
     state.xp=789;state.completed=['U01-S01'];saveState();
     localStorage.setItem('deen_reset_probe','delete me');
     sessionStorage.setItem('deen_reset_probe','delete me');
     localStorage.setItem('unrelated_app_reset_probe','preserve me');
    });
    page.once('dialog',dialog=>dialog.accept());
    await page.evaluate(()=>window.DEEN_ADMIN.open());
    assert.equal(await page.locator('#deenAdminPanelV2 [data-admin="fullReset"]').innerText(),'HER ŞEYİ SIFIRLA');
    await page.locator('#deenAdminPanelV2 [data-admin="fullReset"]').click();
    await page.waitForSelector('#deenLanguageGate',{timeout:45000});
    assert.equal(await page.locator('#deenAccountGate').count(),0,'Account screen must follow language choice');
    assert.equal(await page.locator('[data-locale]').count(),5);
    const cleared=await page.evaluate(()=>({
     lang:localStorage.getItem('deen_app_language_v1'),
     oldState:localStorage.getItem('deen_v4_1_state'),
     lastGood:localStorage.getItem('deen_v57_last_good_state'),
     reset:localStorage.getItem('deen_reset_probe'),
     session:sessionStorage.getItem('deen_reset_probe'),
     sessionLang:sessionStorage.getItem('deen_boot_language'),
     unrelated:localStorage.getItem('unrelated_app_reset_probe')
    }));
    for(const key of ['lang','oldState','lastGood','reset','session','sessionLang'])assert.equal(cleared[key],null,'Reset must clear '+key);
    assert.equal(cleared.unrelated,'preserve me','Do not delete unrelated app data');
    await page.locator('[data-locale="tr"]').click();
    await page.locator('.deen-language-continue').click();
    await page.waitForSelector('#deenAccountGate');
    assert.equal(await page.locator('#deenAccountGate [data-social]').count(),2);
    await page.locator('#deenAccountGate .da-guest').click();
    await page.waitForSelector('#v998Onboarding[data-step="0"]');
    const fresh=await page.evaluate(()=>({xp:state.xp,completed:state.completed,onboarded:state.onboarded}));
    assert.notEqual(fresh.xp,789,'XP must reset');
    assert(!fresh.completed.includes('U01-S01'),'Completed stages must reset');
    assert.equal(fresh.onboarded,false,'Onboarding must restart');
   }
   report.languages[lang]={entry:'PASS Chrome',onboarding:'PASS Chrome',reload:'PASS Chrome',resources:'PASS validated',globalUI:lang==='en'?'English release CI separately verified':lang==='fr'?'French game-only UI smoke; Quran meanings excluded':'NOT fully certified',adminFullReset:lang==='tr'?'PASS language -> account -> welcome':'NOT RUN',screens,errors};
  }else{
   await page.waitForFunction(()=>window.DEEN_BOOT?.status().phase==='blocked');assert.equal(await page.evaluate(()=>state.onboarded),false);assert.equal(await page.locator('html').getAttribute('lang'),lang);
   await page.screenshot({path:path.join(out,'chrome-'+lang+'-blocked.png')});
   report.languages[lang]={entry:'PASS Chrome',onboarding:'PASS Chrome',resources:'BLOCKED missing question pack',globalUI:'INCOMPLETE',screens,errors};
  }
  console.log('CHROME RESULT',JSON.stringify({locale:lang,browser:report.browser,version:report.version,...Object.fromEntries(Object.entries(report.languages[lang]).filter(([k])=>k!=='screens'))}));
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'global-locale-chrome.json'),JSON.stringify(report,null,2));await context.close();
 }
 await browser.close();server.close();console.log('PASS entry and resource gates; full five-language support remains INCOMPLETE');
})().catch(e=>{console.error(e);server.close();process.exit(1);});
