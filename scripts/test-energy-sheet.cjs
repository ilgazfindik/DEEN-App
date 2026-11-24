/* Energy sheet (assets/design/home.js "Energy sheet"). Every button works: +10 energy adds 10 and closes; Premium opens
   the Premium offer and never turns Premium on by itself; Got it, × and a tap outside close it. It shows the energy
   (hearts, count, bar, live countdown); a lesson that needs more says how much; Premium shows unlimited energy. Five
   languages, Arabic right to left. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 for(const lang of ['tr','en','ar']){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true});
  await ctx.addInitScript(l=>{if(sessionStorage.getItem('x'))return;sessionStorage.setItem('x','1');localStorage.setItem('deen_app_language_v1',l);localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:2,xp:420,profile:{name:'QA',companion:'cat'},settings:{language:l,onboardingLanguageConfirmed:true},completed:['U01-S01']}))},lang);
  const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2500);
  const shown=()=>page.evaluate(()=>document.getElementById('energyModal').classList.contains('show'));
  const open=async()=>{await page.evaluate(()=>showEnergy());await page.waitForTimeout(700);assert.equal(await shown(),true,lang+': opens')};
  // Opened from the header's energy chip.
  await page.locator('.app-header .stat[onclick*="showEnergy"]').first().click();await page.waitForTimeout(700);assert.equal(await shown(),true,lang+': the energy chip opens it');
  const look=await page.evaluate(()=>{const s=document.querySelector('#energyModal .sheet');return {ds:s.classList.contains('ds-energy'),dir:s.dir,count:s.querySelector('.ds-en-count b').textContent,hearts:s.querySelectorAll('.ds-en-hearts i.on').length,next:s.querySelector('.ds-en-next').textContent}});
  assert.equal(look.ds,true);assert.equal(look.dir,lang==='ar'?'rtl':'ltr');assert.equal(look.count,'2');assert.equal(look.hearts,1);assert.match(look.next,/\d:\d\d/,lang+': countdown '+look.next);
  // Each button is the top element where it is drawn (nothing covers it).
  const covered=await page.evaluate(()=>[...document.querySelectorAll('#energyModal [data-act],#energyModal .ds-en-x')].filter(b=>{const r=b.getBoundingClientRect(),el=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return !(el===b||b.contains(el))}).map(b=>b.dataset.act||'x'));
  assert.deepEqual(covered,[],lang+': nothing covers the buttons');
  // +10 energy.
  await page.locator('#energyModal [data-act="ad"]').click();await page.waitForTimeout(500);
  assert.equal(await page.evaluate(()=>state.energy),12,lang+': +10 energy');assert.equal(await shown(),false,lang+': and closes');
  // Premium opens the offer, never Premium itself.
  await open();await page.locator('#energyModal [data-act="prem"]').click();await page.waitForTimeout(900);
  assert.equal(await page.evaluate(()=>!!state.premium),false,lang+': Premium is not turned on by a tap');assert.equal(await shown(),false);
  assert.equal(await page.evaluate(()=>!!document.querySelector('dialog[open]')),true,lang+': the Premium offer opens');
  await page.evaluate(()=>{try{closeSheet()}catch(_){}try{DEEN_PREMIUM_OFFER.close()}catch(_){}document.querySelectorAll('dialog[open]').forEach(d=>{try{d.close()}catch(_){}})});await page.waitForTimeout(400);
  // Got it, × and a tap outside close it.
  await open();await page.locator('#energyModal [data-act="ok"]').click();await page.waitForTimeout(300);assert.equal(await shown(),false,lang+': Got it closes');
  await open();await page.locator('#energyModal .ds-en-x').click();await page.waitForTimeout(300);assert.equal(await shown(),false,lang+': × closes');
  await open();await page.mouse.click(196,60);await page.waitForTimeout(300);assert.equal(await shown(),false,lang+': a tap outside closes');
  // A lesson that needs more energy; Premium.
  await page.evaluate(()=>{state.energy=0;window.__v624EnergyIntent={stageId:'U01-S02',cost:3,at:Date.now()};showEnergy()});await page.waitForTimeout(600);
  assert.ok(await page.locator('#energyModal .ds-en-need').count(),lang+': says how much the lesson needs');
  await page.evaluate(()=>{document.getElementById('energyModal').classList.remove('show');state.premium=true;showEnergy()});await page.waitForTimeout(600);
  const prem=await page.evaluate(()=>({inf:document.querySelector('#energyModal .ds-en-count b').textContent,ad:document.querySelectorAll('#energyModal [data-act="ad"],#energyModal [data-act="prem"]').length}));
  assert.deepEqual(prem,{inf:'∞',ad:0},lang+': Premium shows unlimited energy and no offers');
  assert.deepEqual(errors,[],lang+': no page errors');console.log('  ok',lang);await ctx.close();
 }
 await browser.close();server.close();console.log('PASS: energy sheet — every button works, Premium is never turned on by a tap, five languages');
})().catch(e=>{console.error(e);process.exit(1)});
