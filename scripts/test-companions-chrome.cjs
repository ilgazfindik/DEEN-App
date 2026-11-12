/* Companion unlocks + wardrobe — isolated Chrome regression (engine globals are stubbed). */
const {chromium}=require('playwright'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><dialog id="v5Sheet"><h3 id="v5SheetTitle"></h3><div id="v5SheetBody"></div></dialog><div id="profileScreenBody"><section class="dsp-id"><span class="dsp-avatar-slot"></span></section></div><div id="picker"></div></body></html>';
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(html)});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);
 await page.evaluate(()=>{
  window.state={xp:0,currency:100,onboarded:true,profile:{name:'T',companion:null}};
  window.level=(xp=0)=>{let n=1,base=0,span=300;while(xp>=base+span){base+=span;n++;span=300+(n-1)*100}return{n}};
  window.saveState=()=>{window.saved=(window.saved||0)+1};window.updateUI=()=>{};
  window.toasts=[];window.toast=m=>window.toasts.push(m);
  window.sheet=(t,b)=>{document.querySelector('#v5SheetTitle').textContent=t;document.querySelector('#v5SheetBody').innerHTML=b;document.querySelector('#v5Sheet').showModal()};
  window.closeSheet=()=>document.querySelector('#v5Sheet').close();
  window.DEEN_APP_LOCALE={get:()=>window.__lang||'tr'};
  window.picked=[];
  window.DEEN_COMPANION={select:id=>{window.picked.push(id);window.state.profile.companion=id;return true}};
  document.querySelector('#picker').innerHTML=['lion','cat','wolf','owl','turtle','eagle'].map(id=>'<button class="v994-animal-card" onclick="DEEN_COMPANION.select(\''+id+'\')">'+id+'</button>').join('');
 });
 await page.addScriptTag({path:path.join(root,'assets/design/companions.js')});
 const ev=(f,a)=>page.evaluate(f,a);
 await page.waitForFunction(()=>window.DEEN_COMPANION.__dcz,null,{timeout:4000});
 // 1. only lion + cat open at level 1
 assert.deepEqual(await ev(()=>['lion','cat','wolf','owl','turtle','eagle'].filter(i=>DEEN_COMPANIONS.unlocked(i))),['lion','cat']);
 // 2. locked picker card cannot select; open one can
 await page.locator('.v994-animal-card',{hasText:'wolf'}).click();
 assert.deepEqual(await ev(()=>window.picked),[],'locked animal must not be selectable');
 assert.equal(await ev(()=>DEEN_COMPANION.select('eagle')),false);
 await page.locator('.v994-animal-card',{hasText:'cat'}).click();
 assert.deepEqual(await ev(()=>window.picked),['cat']);
 // 3. level-up unlocks wolf (level 2 at 300 xp) and announces it
 await ev(()=>{window.state.xp=300});
 assert.equal(await ev(()=>DEEN_COMPANIONS.unlocked('wolf')),true);
 await page.waitForFunction(()=>/Yeni yol arkadaşı/.test(document.querySelector('#v5SheetTitle').textContent),null,{timeout:4000});
 assert.match(await page.locator('#v5SheetBody').innerText(),/Yeni yol arkadaşı|Kurt/,'unlock celebration shown');
 await page.locator('#v5SheetBody [data-dcz=open]').click();
 assert.match(await page.locator('.dcz-next').innerText(),/Baykuş · Seviye 3/,'next unlock line');
 assert.equal(await ev(()=>DEEN_COMPANIONS.levels.eagle),7);
 // 4. grandfathering: an old choice stays usable at level 1
 await ev(()=>{window.state.xp=0;window.state.profile.companion='eagle'});
 assert.equal(await ev(()=>DEEN_COMPANIONS.unlocked('eagle')),true);
 await ev(()=>{window.state.profile.companion='cat'});
 // 5. animal room + wardrobe
 await page.waitForSelector('#dczEntry');
 await ev(()=>closeSheet());
 await page.locator('#dczEntry').click();
 await page.locator('.dcz-card').first().waitFor();
 assert.equal(await page.locator('.dcz-card').count(),6);
 assert.equal(await page.locator('.dcz-card.locked').count(),3,'wolf is open (level 2), 3 remain locked');
 await page.locator('[data-dcz=tab][data-id=wardrobe]').click();
 await page.locator('[data-id=bg_dune]').click();
 assert.equal(await ev(()=>state.currency),70,'backdrop costs 30');
 assert.equal(await ev(()=>state.companionMeta.eq.bg),'bg_dune');
 await page.locator('[data-id=ac_star]').click();
 assert.equal(await ev(()=>state.currency),25);
 await ev(()=>{state.currency=10});
 await page.locator('[data-id=ac_moon]').click();
 assert.equal(await ev(()=>state.currency),10,'no purchase without enough sparkles');
 assert.ok(!(await ev(()=>state.companionMeta.items.includes('ac_moon'))));
 await page.locator('[data-id=bg_dune]').click(); // un-wear
 assert.equal(await ev(()=>state.companionMeta.eq.bg),undefined);
 // 6. every language renders without throwing
 for(const l of ['tr','en','de','fr','ar']){
  await ev(l=>{window.__lang=l;DEEN_COMPANIONS.open('animals')},l);
  assert.equal(await page.locator('.dcz-card').count(),6,l);
  assert.equal(await page.locator('.dcz').getAttribute('dir'),l==='ar'?'rtl':'ltr');
 }
 assert.deepEqual(errors,[]);
 await browser.close();server.close();
 console.log('PASS: companion unlocks + wardrobe');
})().catch(e=>{console.error(e);process.exit(1)});
