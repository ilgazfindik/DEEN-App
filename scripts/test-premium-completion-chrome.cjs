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

 assert.equal(await page.locator('#deenPremiumOffer .dp-features li').count(),3,'Show only implemented benefits');
 assert.equal(await page.locator('#deenPremiumOffer .dp-future-chip').count(),2,'Unreleased benefits must be clearly separated');
 const secondary=page.locator('#deenPremiumOffer button.dp-later');
 assert.equal((await secondary.innerText()).trim(),'Şimdilik Devam Et','Secondary button must never be blank');
 const style=await secondary.evaluate(el=>({size:parseFloat(getComputedStyle(el).fontSize),color:getComputedStyle(el).color,width:el.getBoundingClientRect().width,opacity:getComputedStyle(el).opacity}));
 assert(style.size>=12&&style.width>=180&&style.opacity!=='0','Secondary CTA must be visually legible');
 const layout=await page.locator('#deenPremiumOffer').evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,viewport:innerHeight,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight}));
 assert(layout.width<=375&&layout.height<=760,'Premium modal must fit mobile viewport');
 assert.equal(await page.locator('#deenPremiumOffer .dp-title-accent').innerText(),'güçlendir');
 assert.equal(await page.locator('#deenPremiumOffer button.dp-close').getAttribute('aria-label'),'Premium ekranını kapat');

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
 // Exiting an entered lesson *without completing it* now offers Premium.
 // Closing an unrelated overlay must not generate an offer.
 await page.evaluate(()=>{
  document.dispatchEvent(new CustomEvent('deen:lesson-closed',{detail:{session:null}}));
  document.dispatchEvent(new CustomEvent('deen:lesson-closed',{detail:{session:{stage:{id:'SMART'},review:true}}}));
 });
 await page.waitForTimeout(410);
 assert.equal(await page.locator('#deenPremiumOffer').evaluate(el=>el.open),false,'No premium for null/review session');

 await page.evaluate(()=>{
  const lesson=document.createElement('div');lesson.id='lesson';lesson.className='active';document.body.appendChild(lesson);
  window.__deenExitFixture={stage:{id:'U03-M02'},macroStage:true,lessonNo:1,lessonTotal:3};
  document.dispatchEvent(new CustomEvent('deen:lesson-closed',{detail:{session:window.__deenExitFixture}}));
 });
 await page.waitForTimeout(450);
 assert.equal(await page.locator('#deenPremiumOffer').evaluate(el=>el.open),false,'Never interrupt an active lesson');
 await page.evaluate(()=>{
  document.querySelector('#lesson').classList.remove('active');
  document.dispatchEvent(new CustomEvent('deen:navigated',{detail:{id:'learnScreen'}}));
 });
 await page.locator('#deenPremiumOffer.dp-visible').waitFor({timeout:6500});
 assert.equal(await page.locator('#deenPremiumOffer [data-dp="later"]').innerText(),'Şimdilik Devam Et');
 assert.equal(await page.evaluate(()=>Boolean(JSON.parse(localStorage.getItem('deen_premium_offer_seen_v1')||'{}')['exit:U03-M02'])),false,'Exit offers are transient and do not pollute seen milestones');
 await page.locator('#deenPremiumOffer [data-dp-action="later"]').click();
 await page.waitForFunction(()=>!document.querySelector('#deenPremiumOffer')?.open);
 await page.evaluate(()=>document.dispatchEvent(new CustomEvent('deen:lesson-finished',{detail:{session:window.__deenExitFixture}})));
 await page.waitForTimeout(450);
 assert.equal(await page.locator('#deenPremiumOffer').evaluate(el=>el.open),false,'An exit session cannot show twice');
 await page.evaluate(()=>document.dispatchEvent(new CustomEvent('deen:lesson-finished',{detail:{session:{stage:{id:'U03-M02'},macroStage:true}}})));
 await page.locator('#deenPremiumOffer.dp-visible').waitFor({timeout:6500});
 await page.locator('#deenPremiumOffer [data-dp-action="later"]').click();
 await page.waitForFunction(()=>!document.querySelector('#deenPremiumOffer')?.open);
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
  window.__deenPartialSession=detail.session;
  document.dispatchEvent(new CustomEvent('deen:lesson-result',{detail}));
 });
 await page.waitForTimeout(390);
 assert.equal(await page.locator('#deenPremiumOffer').evaluate(el=>el.open),false,'Incomplete 2/3 result must not interrupt the learner');
 // But leaving that unfinished chapter should open the offer by explicit request.
 await page.evaluate(()=>document.dispatchEvent(new CustomEvent('deen:lesson-closed',{detail:{session:window.__deenPartialSession}})));
 await page.locator('#deenPremiumOffer.dp-visible').waitFor({timeout:6500});
 await page.locator('#deenPremiumOffer [data-dp-action="later"]').click();
 await page.waitForFunction(()=>!document.querySelector('#deenPremiumOffer')?.open);
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

 await page.evaluate(()=>document.dispatchEvent(new CustomEvent('deen:lesson-closed',{detail:{session:{stage:{id:'U06-M04'},macroStage:true}}})));
 await page.waitForTimeout(450);
 assert.equal(await page.locator('#deenPremiumOffer').evaluate(el=>el.open),false,'Premium trial members must never see an exit offer');

 assert.deepEqual(errors,[]);
 console.log('PASS PREMIUM completion lifecycle, deduplication, 72-hour local trial, and dialog fade');
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
