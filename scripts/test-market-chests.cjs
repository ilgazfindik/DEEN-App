/* Market chests (assets/design/market.js). A chest bought with Sparkles is paid, rolled and saved at once: Sparkles
   first, then its items (outfits, and in epic and legendary chests sometimes a new companion); a reward already owned
   turns into Sparkles. The opening is full screen in the chest's colour: tap right, tap left, tap — it breaks open —
   then one reward per tap and a summary. Not enough Sparkles: nothing is spent. The daily gift opens once a day. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 async function open(currency,lang){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true});
  await ctx.addInitScript(([c,l])=>{if(sessionStorage.getItem('x'))return;sessionStorage.setItem('x','1');localStorage.setItem('deen_app_language_v1',l);localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:0,currency:c,profile:{name:'QA',companion:'cat'},settings:{language:l,onboardingLanguageConfirmed:true},completed:[]}))},[currency,lang||'tr']);
  const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  // THROTTLE=n slows the CPU n times, like a slow CI machine.
  if(process.env.THROTTLE){const c=await ctx.newCDPSession(page);await c.send('Emulation.setCPUThrottlingRate',{rate:+process.env.THROTTLE})}
  await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2500);
  await page.locator('nav.bottomnav .navbtn[data-screen="marketScreen"]').click();await page.waitForTimeout(1500);
  return {ctx,page,errors};
 }
 const buy=async(page,sel)=>{await page.locator(sel).scrollIntoViewIfNeeded();await page.locator(sel).click();await page.waitForTimeout(700);await page.locator('.mk-sheet .mk-buy').click();await page.waitForTimeout(900)};
 // 1. A rare chest: paid, rolled, saved before the animation; the opening; rewards one per tap; the summary.
 {const {ctx,page,errors}=await open(1000);
  await buy(page,'#marketScreen .mk-chest[data-r="rare"]');
  const s=await page.evaluate(()=>({cur:state.currency,last:state.marketMeta.history.slice(-1)[0],items:state.companionMeta.items.slice(),saved:JSON.parse(localStorage.getItem('deen_v4_1_state')).currency,overlay:!!document.querySelector('.mko[data-r="rare"]')}));
  assert.equal(s.overlay,true,'the opening screen in the chest colour');assert.equal(s.last.chest,'rare');assert.equal(s.last.price,150);
  assert.equal(s.last.got.length,4,'Sparkles + 3 items');assert.match(s.last.got[0],/^sp:\d+$/,'Sparkles come first');
  const sp=+s.last.got[0].slice(3);assert.ok(sp>=25&&sp<=45,'Sparkles in range '+sp);
  const dupes=s.last.got.filter(g=>/:dupe$/.test(g)).length;assert.equal(dupes,0,'a new learner gets new outfits');
  assert.equal(s.cur,1000-150+sp,'paid and Sparkles added at once');assert.equal(s.saved,s.cur,'saved before the animation');
  assert.deepEqual(s.items,s.last.got.slice(1).map(g=>g.split(':')[1]),'the outfits are owned');
  const ov=page.locator('.mko');
  await ov.click({position:{x:196,y:300}});await page.waitForTimeout(650);assert.match(await page.locator('.mko-chest').getAttribute('class'),/\btr\b/,'first tap: right');
  await ov.click({position:{x:196,y:300}});await page.waitForTimeout(650);assert.match(await page.locator('.mko-chest').getAttribute('class'),/\btl\b/,'second tap: left');
  await ov.click({position:{x:196,y:300}});
  // Waits for the states rather than fixed times (CI machines are slower): taps while a card is still flying in are
  // ignored by design, so each tap waits for the card on show to change.
  await page.waitForFunction(()=>document.querySelector('.mko')?.classList.contains('opened'),null,{timeout:10000});
  await page.waitForFunction(()=>document.querySelector('.mko.reveal .mko-show .mko-card'),null,{timeout:10000});
  const first=await page.evaluate(()=>document.querySelector('.mko-show .mko-card').classList.contains('sp'));assert.equal(first,true,'first reward shown: Sparkles');
  const seen=[];
  for(let k=0;k<20&&!(await page.locator('.mko.summary').count());k++){
   const cur=await page.evaluate(()=>document.querySelector('.mko-show .mko-card')?.outerHTML||'');if(cur&&seen[seen.length-1]!==cur)seen.push(cur);
   await ov.click({position:{x:196,y:500}});await page.waitForTimeout(650);
  }
  assert.equal(seen.length,4,'one card per reward, one at a time ('+seen.length+')');
  assert.ok(seen.slice(1).every(h=>/mko-card-name/.test(h)&&!/ sp"/.test(h)),'then the outfit cards');
  await page.waitForSelector('.mko-grid .mko-card',{timeout:5000});
  assert.equal(await page.locator('.mko-grid .mko-card').count(),4,'summary of all four rewards');
  await page.locator('.mko-done').click();await page.waitForTimeout(600);assert.equal(await page.locator('.mko').count(),0,'closes');
  assert.equal(await page.evaluate(()=>document.querySelector('#marketScreen .mk-bal b').textContent),String(s.cur),'balance updated');
  // Not enough Sparkles for a legendary chest: nothing is spent and nothing opens.
  await page.evaluate(()=>{state.currency=100;DEEN_MARKET.render()});await page.waitForTimeout(300);
  await buy(page,'#marketScreen .mk-chest[data-r="legendary"]');
  assert.equal(await page.evaluate(()=>state.currency),100,'not enough Sparkles: nothing spent');assert.equal(await page.locator('.mko').count(),0,'nothing opens');
  await page.locator('.mk-sheet-x').click();await page.waitForTimeout(400);
  // The daily gift: once a day.
  await buy(page,'#marketScreen .mk-gift');
  const g=await page.evaluate(()=>({gift:state.marketMeta.gift,last:state.marketMeta.history.slice(-1)[0]}));
  assert.equal(g.last.chest,'gift');assert.equal(g.last.price,0);assert.equal(g.last.got.length,2,'gift: Sparkles + one item');
  await page.evaluate(()=>{document.querySelector('.mko').remove()});
  const before=await page.evaluate(()=>state.marketMeta.history.length);
  await page.evaluate(()=>DEEN_MARKET.render());await page.waitForTimeout(300);
  await buy(page,'#marketScreen .mk-gift');
  assert.equal(await page.evaluate(()=>state.marketMeta.history.length),before,'the gift opens once a day');
  assert.deepEqual(errors,[],'no page errors');console.log('  ok rare chest, not enough Sparkles, daily gift',JSON.stringify(s.last.got));await ctx.close();}
 // 2. Legendary chest with a companion (the roll is steered so the companion slot comes up), and duplicates.
 {const {ctx,page,errors}=await open(5000);
  await page.evaluate(()=>{const r=Math.random;let n=0;Math.random=()=>n++<2?0:r()});
  await buy(page,'#marketScreen .mk-chest[data-r="legendary"]');
  const s=await page.evaluate(()=>({last:state.marketMeta.history.slice(-1)[0],owned:state.companionMeta.owned.slice()}));
  const pet=s.last.got.find(g=>g.startsWith('animal:'));assert.ok(pet,'a companion comes out: '+JSON.stringify(s.last.got));
  assert.ok(s.owned.includes(pet.split(':')[1]),'the companion is now owned');
  assert.equal(await page.evaluate(a=>DEEN_COMPANIONS.isUnlocked(a),pet.split(':')[1]),true,'and unlocked for the learner');
  await page.evaluate(()=>{document.querySelector('.mko').remove()});
  // Own every outfit: what comes out turns into Sparkles.
  await page.evaluate(async()=>{const j=await (await fetch('assets/companions/outfits.json')).json();state.companionMeta.items=j.items.map(i=>i.id)});
  const c0=await page.evaluate(()=>state.currency);
  await buy(page,'#marketScreen .mk-chest[data-r="common"]');
  const d=await page.evaluate(()=>({last:state.marketMeta.history.slice(-1)[0],cur:state.currency}));
  assert.ok(d.last.got.slice(1).every(g=>/:dupe$/.test(g)),'owned outfits come out as duplicates: '+JSON.stringify(d.last.got));
  assert.ok(d.cur>c0-60+(+d.last.got[0].slice(3)),'duplicates turn into Sparkles');
  assert.deepEqual(errors,[],'no page errors');console.log('  ok companion and duplicates',JSON.stringify({pet,dupes:d.last.got}));await ctx.close();}
 await browser.close();server.close();console.log('PASS: market chests — pay, roll and save first, open (right, left, break), Sparkles then items, companions, duplicates, daily gift');
})().catch(e=>{console.error(e);process.exit(1)});
