/* Isolated Chrome exercise of real DEEN premium lifecycle events. */
const {chromium}=require('playwright'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const server=http.createServer((_,res)=>{res.setHeader('Content-Type','text/html');res.end('<!doctype html><html lang="tr"><body></body></html>')});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:375,height:760}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:'+server.address().port);
 await page.evaluate(()=>{
  window.state={onboarded:true,premium:false,completed:[],sectionFinal:{completed:false}};
  window.STAGES=Array.from({length:7},(_,i)=>({id:'U01-S'+String(i+1).padStart(2,'0'),unit:'U01'}));
  window.saveState=()=>{};window.updateUI=()=>{};
  window.DEEN_BOOT={isReady:()=>true};
  window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang};
  document.documentElement.dataset.deenStartup='ready';
 });
 await page.addStyleTag({path:path.join(root,'assets/i18n/premium-offer.css')});
 await page.addScriptTag({path:path.join(root,'assets/i18n/premium-offer.js')});
 assert.equal(await page.evaluate(()=>window.DEEN_PREMIUM_OFFER?.version),'premium-fade-trial-v1');
 await page.evaluate(()=>{
  const detail={session:{stage:{id:'U01-S07'}}};
  document.dispatchEvent(new CustomEvent('deen:lesson-result-before',{detail}));
  state.completed=STAGES.map(s=>s.id);
  document.dispatchEvent(new CustomEvent('deen:lesson-result',{detail}));
  document.dispatchEvent(new CustomEvent('deen:lesson-closed'));
 });
 await page.locator('#deenPremiumOffer.dp-visible').waitFor({timeout:6500});
 assert.equal(await page.locator('#deenPremiumOffer [data-dp="trial"]').innerText(),'İlk 3 gün ücretsiz');
 const seen=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_premium_offer_seen_v1')||'{}'));
 assert(seen['unit:U01'],'First-time U01 completion must enqueue once');
 await page.locator('#deenPremiumOffer [data-dp-action="later"]').click();
 await page.waitForFunction(()=>!document.querySelector('#deenPremiumOffer')?.open);
 await page.evaluate(()=>{
  const detail={session:{stage:{id:'U01-S07'}}};
  document.dispatchEvent(new CustomEvent('deen:lesson-result-before',{detail}));
  document.dispatchEvent(new CustomEvent('deen:lesson-result',{detail}));
  document.dispatchEvent(new CustomEvent('deen:lesson-closed'));
 });
 await page.waitForTimeout(430);
 assert.equal(await page.locator('#deenPremiumOffer').evaluate(el=>el.open),false,'Duplicate unit result must not re-open offer');
 // Current DEEN UI uses a 5-chapter Uxx-Mxx map with multiple mini lessons.
 // A 3/3 successful macro lesson must open the offer, even though U02-S07
 // (the old 7-stage unit marker) has not been completed.
 await page.evaluate(()=>{const phone=document.createElement('div');phone.id='phone';phone.className='phone gf-celebrating';document.body.appendChild(phone)});
 await page.evaluate(()=>{
  state.macroStageMeta={'U02-M01':{completedLessons:2,totalLessons:3}};
  const def={id:'U02-M01',unit:'U02',legacyIds:['U02-S01'],lessons:3};
  const detail={session:{stage:{id:'U02-M01'},macroStage:true,macroDef:def,lessonNo:3,lessonTotal:3}};
  document.dispatchEvent(new CustomEvent('deen:lesson-result-before',{detail}));
  state.macroStageMeta['U02-M01'].completedLessons=3;
  state.completed.push('U02-S01');
  document.dispatchEvent(new CustomEvent('deen:lesson-result',{detail}));
  document.dispatchEvent(new CustomEvent('deen:lesson-closed'));
 });
 await page.waitForTimeout(450);
 assert.equal(await page.locator('#deenPremiumOffer').evaluate(el=>el.open),false,'Premium must wait until the award animation is complete');
 await page.evaluate(()=>document.querySelector('#phone').classList.remove('gf-celebrating'));
 await page.locator('#deenPremiumOffer.dp-visible').waitFor({timeout:6500});
 const seenMacro=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_premium_offer_seen_v1')||'{}'));
 assert(seenMacro['macro:U02-M01'],'U02 macro chapter must offer premium after the final mini lesson');
 await page.locator('#deenPremiumOffer [data-dp-action="later"]').click();
 await page.waitForFunction(()=>!document.querySelector('#deenPremiumOffer')?.open);
 // A 2/3 mini lesson and replay must NOT trigger an offer.
 await page.evaluate(()=>{
  state.macroStageMeta['U02-M02']={completedLessons:1,totalLessons:3};
  const def={id:'U02-M02',unit:'U02',legacyIds:['U02-S02'],lessons:3};
  const detail={session:{stage:{id:'U02-M02'},macroStage:true,macroDef:def,lessonNo:2,lessonTotal:3}};
  document.dispatchEvent(new CustomEvent('deen:lesson-result-before',{detail}));
  state.macroStageMeta['U02-M02'].completedLessons=2;
  document.dispatchEvent(new CustomEvent('deen:lesson-result',{detail}));
  document.dispatchEvent(new CustomEvent('deen:lesson-closed'));
 });
 await page.waitForTimeout(390);
 assert.equal(await page.locator('#deenPremiumOffer').evaluate(el=>el.open),false,'Incomplete 2/3 chapter must not show premium');
 // Legacy stages are also still used in some learning paths.
 await page.evaluate(()=>{
  const detail={session:{stage:{id:'U02-S02'}}};
  document.dispatchEvent(new CustomEvent('deen:lesson-result-before',{detail}));
  state.completed.push('U02-S02');
  document.dispatchEvent(new CustomEvent('deen:lesson-result',{detail}));
  document.dispatchEvent(new CustomEvent('deen:lesson-closed'));
 });
 await page.locator('#deenPremiumOffer.dp-visible').waitFor({timeout:6500});
 const seenStage=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_premium_offer_seen_v1')||'{}'));
 assert(seenStage['stage:U02-S02'],'Legacy stage completion remains supported');
 await page.locator('#deenPremiumOffer [data-dp-action="later"]').click();
 await page.waitForFunction(()=>!document.querySelector('#deenPremiumOffer')?.open);
 await page.evaluate(()=>{
  const detail={session:{final:true}};
  document.dispatchEvent(new CustomEvent('deen:section-result-before',{detail}));
  state.sectionFinal.completed=true;
  document.dispatchEvent(new CustomEvent('deen:section-result',{detail}));
  document.dispatchEvent(new CustomEvent('deen:navigated'));
 });
 await page.locator('#deenPremiumOffer.dp-visible').waitFor({timeout:6500});
 const seenFinal=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_premium_offer_seen_v1')||'{}'));
 assert(seenFinal['section:1'],'First successful section final must enqueue');
 await page.locator('#deenPremiumOffer [data-dp-action="start"]').click();
 assert.equal(await page.evaluate(()=>state.premium&&DEEN_PREMIUM_OFFER.isTrialActive()),true);
 assert.equal(await page.locator('#deenPremiumOffer').evaluate(el=>el.open),true,'Fade-out is asynchronous');
 await page.waitForFunction(()=>!document.querySelector('#deenPremiumOffer')?.open);
 await page.evaluate(()=>{document.documentElement.lang='ar'});
 assert.equal(await page.evaluate(()=>DEEN_PREMIUM_OFFER.open()),false,'Active trial suppresses offers');
 assert.deepEqual(errors,[]);
 console.log('PASS PREMIUM completion lifecycle, deduplication, 72-hour local trial, and dialog fade');
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
