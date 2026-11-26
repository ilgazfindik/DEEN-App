/* Premium subscriptions (assets/design/subscribe.js ↔ ios/App/App/Subscriptions.swift, plugin "DeenStore"), with a
   stand-in for Capacitor's native bridge:
   - premiumPanel() opens the paywall with the App Store prices in the store's currency (EUR here), the yearly plan first
     with its 7-day trial, price per month and saving; Apple's required terms and links are there;
   - a parental gate comes before the purchase: a wrong answer buys nothing, the right one buys;
   - a purchase turns Premium on (unlimited energy), the paywall then shows "active" with Manage; a refund or expiry
     reported by StoreKit turns it off; restore works; the last answer is kept for offline use until its expiry;
   - outside the iPhone app the paywall only says Premium is bought in the app; five languages. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),SHOT=process.env.SHOT;
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg','.avif':'image/avif'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
const IPHONE='Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const open=async(native,lang)=>{const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',userAgent:IPHONE,deviceScaleFactor:SHOT?2:1});
  await ctx.addInitScript(([native,lang])=>{if(!sessionStorage.getItem('s')){sessionStorage.setItem('s','1');localStorage.setItem('deen_app_language_v1',lang);localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:12,xp:420,profile:{name:'QA',companion:'owl'},settings:{language:lang,onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))}
   if(!native)return;
   window.__st={calls:[],ent:JSON.parse(sessionStorage.getItem('ent')||'{"active":false}'),listeners:{}};
   const P={'com.ilgazfindik.ilnura.premium.yearly':{id:'com.ilgazfindik.ilnura.premium.yearly',displayPrice:'49,99 €',price:49.99,currency:'EUR',period:'P1Y',trial:{period:'P1W'},eligibleForTrial:true},
    'com.ilgazfindik.ilnura.premium.monthly':{id:'com.ilgazfindik.ilnura.premium.monthly',displayPrice:'9,99 €',price:9.99,currency:'EUR',period:'P1M',eligibleForTrial:false}};
   const save=()=>sessionStorage.setItem('ent',JSON.stringify(__st.ent));
   const S={products:a=>{__st.calls.push('products');return {products:a.ids.map(i=>P[i]).filter(Boolean)}},
    purchase:a=>{__st.calls.push('purchase:'+a.id);__st.ent={active:true,productId:a.id,expires:Date.now()+7*864e5,inTrial:true,willRenew:true};save();return {status:'purchased',entitlement:__st.ent}},
    entitlement:()=>{__st.calls.push('entitlement');return __st.ent},restore:()=>{__st.calls.push('restore');return __st.ent},manage:()=>{__st.calls.push('manage');return {shown:true}}};
   window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>'ios',nativePromise:(pl,m,a)=>{if(pl==='DeenStore'&&S[m])return Promise.resolve(S[m](a));if(pl==='LocalNotifications'&&m==='checkPermissions')return Promise.resolve({display:'prompt'});return Promise.reject(new Error('n/a'))},addListener:(pl,ev,cb)=>{if(pl==='DeenStore')__st.listeners[ev]=cb;return {remove:async()=>{}}}};
  },[native,lang]);
  const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2200);return {ctx,page,errors}};
 // ---- Native: paywall, gate, purchase ----
 let {ctx,page,errors}=await open(true,'de');
 assert.equal(await page.evaluate(()=>state.premium),false,'not Premium at first');
 await page.evaluate(()=>premiumPanel());await page.waitForSelector('.sub-sheet.in .sub-plan',{timeout:5000});
 const pw=await page.evaluate(()=>({plans:[...document.querySelectorAll('.sub-plan')].map(b=>b.innerText.replace(/\s+/g,' ')),cta:document.querySelector('[data-sub=buy]').textContent,fine:document.querySelector('.sub-fine').textContent,links:[...document.querySelectorAll('.sub-legal a')].map(a=>a.href),restore:!!document.querySelector('[data-sub=restore]')}));
 assert.match(pw.plans[0],/Jährlich.*49,99 €.*4,17 € \/ Monat.*58 % sparen.*7 Tage gratis/,'yearly: store price, per month, saving, trial: '+pw.plans[0]);
 assert.match(pw.plans[1],/Monatlich.*9,99 €/,'monthly');
 assert.equal(pw.cta,'7 Tage gratis starten');assert.match(pw.fine,/24 Stunden/);assert.ok(pw.restore,'restore purchases');
 assert.ok(pw.links.some(l=>/stdeula/.test(l))&&pw.links.some(l=>/legal\/terms\.html/.test(l))&&pw.links.some(l=>/legal\/privacy\.html/.test(l)),'EULA, terms and privacy links');
 if(SHOT)await page.screenshot({path:SHOT+'-paywall.png'});
 // Parental gate: wrong answer buys nothing.
 await page.click('[data-sub=buy]');await page.waitForSelector('.sub-gate');
 await page.fill('.sub-gate input','1');await page.click('.sub-gate-ok');
 assert.equal(await page.isVisible('.sub-gate-err'),true,'wrong answer is refused');
 assert.ok(!(await page.evaluate(()=>__st.calls)).some(c=>c.startsWith('purchase')),'nothing bought');
 if(SHOT)await page.screenshot({path:SHOT+'-gate.png'});
 const sum=await page.evaluate(()=>{const m=document.querySelector('.sub-gate p').textContent.match(/(\d+) \+ (\d+)/);return +m[1]+ +m[2]});
 await page.fill('.sub-gate input',String(sum));await page.click('.sub-gate-ok');
 await page.waitForFunction(()=>state.premium===true,null,{timeout:5000});
 assert.ok((await page.evaluate(()=>__st.calls)).includes('purchase:com.ilgazfindik.ilnura.premium.yearly'),'yearly bought');
 assert.equal(await page.evaluate(()=>DEEN_PREMIUM_ENTITLEMENT.active),true);
 await page.waitForTimeout(400);assert.equal(await page.$('.sub-sheet'),null,'paywall closes');
 // Active: the paywall shows the status and Manage.
 await page.evaluate(()=>premiumPanel());await page.waitForSelector('.sub-active');
 assert.match(await page.textContent('.sub-active'),/Premium ist aktiv.*Gratis-Testphase läuft/);
 await page.click('[data-sub=manage]');await page.waitForTimeout(200);assert.ok((await page.evaluate(()=>__st.calls)).includes('manage'));
 await page.click('.sub-x');await page.waitForTimeout(300);
 // After a reload, still Premium (from the store and the cache).
 await page.reload();await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2500);
 assert.equal(await page.evaluate(()=>state.premium),true,'Premium after a restart');
 // A refund reported by StoreKit turns it off.
 await page.evaluate(()=>{__st.ent={active:false};sessionStorage.setItem('ent','{"active":false}');__st.listeners.entitlement({active:false})});await page.waitForTimeout(300);
 assert.equal(await page.evaluate(()=>state.premium),false,'refund turns Premium off');
 // Restore brings it back when the store has it.
 await page.evaluate(()=>{__st.ent={active:true,productId:'com.ilgazfindik.ilnura.premium.monthly',expires:Date.now()+30*864e5}});
 await page.evaluate(()=>premiumPanel());await page.waitForSelector('[data-sub=restore]');await page.click('[data-sub=restore]');
 await page.waitForFunction(()=>state.premium===true,null,{timeout:4000});
 // An expired cache does not keep Premium.
 await page.evaluate(()=>{localStorage.setItem('deen_premium_entitlement_v1',JSON.stringify({active:true,expires:Date.now()-1000}))});
 assert.equal(await page.evaluate(()=>DEEN_PREMIUM_ENTITLEMENT.active),false,'expired entitlement is not active');
 assert.deepEqual(errors,[]);await ctx.close();
 // ---- Five languages on the paywall ----
 for(const l of ['tr','en','fr','ar']){
  ({ctx,page,errors}=await open(true,l));await page.evaluate(()=>premiumPanel());await page.waitForSelector('.sub-plan');
  const r=await page.evaluate(()=>({dir:document.querySelector('.sub-sheet').dir,cta:document.querySelector('[data-sub=buy]').textContent}));
  assert.equal(r.dir,l==='ar'?'rtl':'ltr');assert.ok(r.cta.length>3);
  if(SHOT&&l==='tr')await page.screenshot({path:SHOT+'-paywall-tr.png'});
  await ctx.close();
 }
 // ---- Web: no purchase, a note ----
 ({ctx,page,errors}=await open(false,'tr'));
 await page.evaluate(()=>premiumPanel());await page.waitForSelector('.sub-sheet');
 assert.match(await page.textContent('.sub-note'),/iPhone uygulamasındaki App Store/);assert.equal(await page.$('[data-sub=buy]'),null);
 assert.equal(await page.evaluate(()=>DEEN_PREMIUM_ENTITLEMENT.active),false);
 await ctx.close();
 await browser.close();server.close();console.log('PASS: Premium subscriptions (paywall, parental gate, purchase, entitlement, restore, web)');
})().catch(e=>{console.error(e);process.exit(1)});
