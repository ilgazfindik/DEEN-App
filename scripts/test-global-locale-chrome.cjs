/* Actual Google Chrome integration test; all profiles are disposable. */
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.env.DEEN_QA_OUTPUT||path.join(root,'qa/global-locale');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const p=decodeURIComponent(req.url.split('?')[0]),file=path.join(root,p==='/'?'index.html':p);try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':'application/octet-stream');res.end(fs.readFileSync(file));}catch(_){res.statusCode=404;res.end('missing');}});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={browser:'Google Chrome',version:browser.version(),languages:{},fullSupport:false};
 for(const lang of ['tr','ar','en','de','es','fr']){
  const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForSelector('#deenLanguageGate');assert.equal(await page.locator('.phone').count(),0);assert.equal(await page.locator('.v9912-authbtn').count(),0);
  assert.equal(await page.locator('[data-locale]').count(),6);assert(!await page.locator('.deen-language-continue').isEnabled());
  await page.locator('[data-locale="'+lang+'"]').click();assert.equal(await page.locator('#deenLanguageGate').getAttribute('lang'),lang);
  await page.screenshot({path:path.join(out,'chrome-'+lang+'-language.png')});
  await page.locator('.deen-language-continue').click();await page.waitForSelector('#v998Onboarding');
  assert.equal(await page.locator('#deenLanguageGate').count(),0);assert.equal(await page.locator('.v9912-authbtn').count(),0);
  assert.equal(await page.locator('#v998Onboarding').getAttribute('lang'),lang);
  const screens=[];
  async function capture(step){const text=await page.locator('#v998Onboarding').innerText();if(lang!=='tr')assert(!/Yol arkadaşını|Kaplumbağa|Günlük hedef|Sana nasıl|Kısa, sade/.test(text),lang+':'+step);screens.push({step,text});assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));await page.screenshot({path:path.join(out,'chrome-'+lang+'-onboarding-'+step+'.png')});}
  await capture(0);await page.locator('#v998Onboarding .v998-primary').click();await page.locator('#v998Name').fill('QA');await capture(1);
  await page.locator('#v998Onboarding .v998-primary').click();await page.locator('[onclick="DEEN_PREMIUM_ONBOARDING.age(\'adult\')"]').click();await capture(2);
  await page.locator('#v998Onboarding .v998-primary').click();assert.equal(await page.locator('#v998Onboarding [data-animal]').count(),6);await page.locator('#v998Onboarding [data-animal="cat"]').click();await capture(3);
  await page.locator('#v998Onboarding .v998-primary').click();await page.locator('[onclick="DEEN_PREMIUM_ONBOARDING.minutes(15)"]').click();await capture(4);
  await page.locator('#v998Onboarding .v998-primary').click();await capture(5);await page.locator('#v998Onboarding .v998-primary').click();
  if(['tr','ar'].includes(lang)){
   await page.waitForFunction(()=>window.DEEN_BOOT?.isReady()&&state.onboarded);await page.waitForSelector('#v998Onboarding',{state:'detached'});
   const before=await page.evaluate(()=>({locale:DEEN_APP_LOCALE.get(),xp:state.xp,completed:state.completed,profile:state.profile,minutes:state.minutes}));assert.equal(before.locale,lang);assert.equal(before.profile.companion,'cat');assert.equal(before.minutes,15);
   await page.screenshot({path:path.join(out,'chrome-'+lang+'-home.png')});await page.reload();await page.waitForFunction(()=>window.DEEN_BOOT?.isReady());
   assert.equal(await page.locator('#deenLanguageGate').count(),0);assert.equal(await page.locator('#v998Onboarding').count(),0);
   const after=await page.evaluate(()=>({locale:DEEN_APP_LOCALE.get(),xp:state.xp,completed:state.completed,profile:state.profile,minutes:state.minutes}));assert.deepEqual(after,before);
   report.languages[lang]={entry:'PASS Chrome',onboarding:'PASS Chrome',reload:'PASS Chrome',resources:'PASS validated',globalUI:'NOT fully certified',screens,errors};
  }else{
   await page.waitForFunction(()=>window.DEEN_BOOT?.status().phase==='blocked');assert.equal(await page.evaluate(()=>state.onboarded),false);assert.equal(await page.locator('html').getAttribute('lang'),lang);
   await page.screenshot({path:path.join(out,'chrome-'+lang+'-blocked.png')});
   report.languages[lang]={entry:'PASS Chrome',onboarding:'PASS Chrome',resources:'BLOCKED missing question pack',globalUI:'INCOMPLETE',screens,errors};
  }
  console.log('CHROME RESULT',JSON.stringify({locale:lang,browser:report.browser,version:report.version,...Object.fromEntries(Object.entries(report.languages[lang]).filter(([k])=>k!=='screens'))}));
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'global-locale-chrome.json'),JSON.stringify(report,null,2));await context.close();
 }
 await browser.close();server.close();console.log('PASS entry and resource gates; full six-language support remains INCOMPLETE');
})().catch(e=>{console.error(e);server.close();process.exit(1);});
