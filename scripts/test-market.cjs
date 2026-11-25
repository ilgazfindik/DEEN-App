/* Market tab (assets/design/market.js + market.css). A fifth bottom tab, before Profile, opens a shop: daily deals (a free
   gift and five outfits for the current companion), four chests by rarity (common, rare, epic, legendary) with their
   chances, the six companions, the outfits per companion and a rarity guide. A tap opens a large preview (chests are bought
   there, see test-market-chests; other items are "soon"). Labels follow the app language; Arabic is right to left. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
const LABEL={tr:'Market',en:'Shop',ar:'المتجر'};
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 for(const lang of ['tr','en','ar']){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true});
  await ctx.addInitScript(l=>{localStorage.setItem('deen_app_language_v1',l);localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,currency:245,profile:{name:'QA',companion:'cat'},settings:{language:l,onboardingLanguageConfirmed:true},completed:['U01-S01']}))},lang);
  const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2500);
  const tabs=await page.evaluate(()=>[...document.querySelectorAll('nav.bottomnav .navbtn')].map(b=>b.dataset.screen));
  assert.deepEqual(tabs,['learnScreen','reviewScreen','leagueScreen','marketScreen','profileScreen'],lang+': five tabs, Market before Profile');
  const tab=page.locator('nav.bottomnav .navbtn[data-screen="marketScreen"]');
  assert.equal((await tab.textContent()).trim(),LABEL[lang],lang+': tab label');
  const cols=await page.evaluate(()=>getComputedStyle(document.querySelector('nav.bottomnav')).gridTemplateColumns.split(' ').length);
  assert.equal(cols,5,lang+': the bar has five columns');
  await tab.click();await page.waitForTimeout(1500);
  const info=await page.evaluate(()=>{const s=document.getElementById('marketScreen');return {active:s.classList.contains('active'),dir:s.getAttribute('dir'),
   deals:s.querySelectorAll('.mk-sec:nth-of-type(1) .mk-card').length,gift:s.querySelectorAll('.mk-gift').length,chests:[...s.querySelectorAll('.mk-chest')].map(c=>c.dataset.r),
   animals:s.querySelectorAll('.mk-row .mk-card').length,outfits:s.querySelectorAll('.mk-sec:nth-of-type(4) .mk-card').length,guide:s.querySelectorAll('.mk-guide-row').length,
   balance:s.querySelector('.mk-bal b').textContent,overflow:document.documentElement.scrollWidth>innerWidth+1,
   brokenImgs:[...s.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src'))}});
  assert.equal(info.active,true,lang+': the market screen opens');assert.equal(info.dir,lang==='ar'?'rtl':'ltr',lang+': direction');
  assert.equal(info.deals,6,lang+': a free gift and five deals');assert.equal(info.gift,1);
  assert.deepEqual(info.chests,['common','rare','epic','legendary'],lang+': four chests by rarity');
  assert.equal(info.animals,6,lang+': six companions');assert.ok(info.outfits>=20,lang+': outfits for the companion ('+info.outfits+')');
  assert.equal(info.guide,4,lang+': rarity guide');assert.equal(info.balance,'245',lang+': Sparkles balance');
  assert.equal(info.overflow,false,lang+': no sideways scroll');assert.deepEqual(info.brokenImgs,[],lang+': every picture loads');
  // Preview of the legendary chest with its chances; buying is "soon" and spends nothing.
  await page.locator('#marketScreen .mk-chest[data-r="legendary"]').click();await page.waitForTimeout(700);
  const odds=await page.evaluate(()=>[...document.querySelectorAll('.mk-sheet .mk-odd b')].map(b=>b.textContent));
  assert.deepEqual(odds,lang==='tr'?['%20','%50','%28','%2','%15']:['20%','50%','28%','2%','15%'],lang+': legendary chest chances (four rarities and the companion chance)');
  await page.locator('.mk-sheet .mk-buy').click();await page.waitForTimeout(400);
  assert.equal(await page.evaluate(()=>state.currency),245,lang+': 245 Sparkles cannot pay for a 450 chest: nothing is spent');assert.equal(await page.locator('.mko').count(),0,lang+': nothing opens');
  await page.locator('.mk-sheet-x').click();await page.waitForTimeout(500);assert.equal(await page.locator('.mk-sheet').count(),0,lang+': the preview closes');
  // Another companion's outfits.
  await page.locator('#marketScreen .mk-pet[data-pet="wolf"]').click();await page.waitForTimeout(500);
  const wolf=await page.evaluate(()=>[...document.querySelectorAll('#marketScreen .mk-sec:nth-of-type(4) .mk-skin img:nth-child(2)')].every(i=>/\/wolf\//.test(i.getAttribute('src'))));
  assert.equal(wolf,true,lang+': outfits switch to the chosen companion');
  // Leaving and coming back.
  await page.locator('nav.bottomnav .navbtn[data-screen="learnScreen"]').click();await page.waitForTimeout(500);
  assert.equal(await page.evaluate(()=>document.getElementById('learnScreen').classList.contains('active')&&!document.getElementById('marketScreen').classList.contains('active')),true,lang+': back to Learn');
  assert.deepEqual(errors,[],lang+': no page errors');
  console.log('  ok',lang,JSON.stringify({outfits:info.outfits}));
  await ctx.close();
 }
 await browser.close();server.close();console.log('PASS: market tab — deals, chests by rarity, companions, outfits, rarity guide, preview (buying not open yet)');
})().catch(e=>{console.error(e);process.exit(1)});
