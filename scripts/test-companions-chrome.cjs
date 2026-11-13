/* Companion unlocks + wardrobe — isolated Chrome regression (engine globals are stubbed). */
const {chromium}=require('playwright'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><dialog id="v5Sheet"><h3 id="v5SheetTitle"></h3><div id="v5SheetBody"></div></dialog><div id="profileScreenBody"><section class="dsp-id"><span class="dsp-avatar-slot"></span></section></div><div id="picker"></div></body></html>';
const PNG=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==','base64');
const OUTFITS={items:[
 {id:'ot_robe',slot:'body',z:10,cost:0,default:true,name:{tr:'Cübbe',en:'Thobe'},art:{cat:'assets/companions/outfits/cat/ot_robe.png'}},
 {id:'ot_cap',slot:'head',z:30,cost:60,name:{tr:'Şapka',en:'Cap'},art:{cat:'assets/companions/outfits/cat/ot_cap.png'}},
 {id:'ot_scarf',slot:'neck',z:20,cost:40,name:{tr:'Atkı',en:'Scarf'},art:{cat:'assets/companions/outfits/cat/ot_scarf.png',lion:'assets/companions/outfits/lion/ot_scarf.png'}},
 {id:'bad id',slot:'head',z:1,cost:1,art:{cat:'x.png'}}
]};
const server=http.createServer((req,res)=>{
 if(req.url.includes('outfits.json')){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(OUTFITS))}
 if(/\.(png|webp)(\?|$)/.test(req.url)){res.setHeader('Content-Type','image/png');return res.end(PNG)}
 res.setHeader('Content-Type','text/html');res.end(html)});
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
 await ev(()=>{state.currency=100});
 assert.equal(await ev(()=>DEEN_COMPANIONS.items.length),18);
 await page.locator('[data-id=fr_gold]').click();
 assert.equal(await ev(()=>state.currency),50,'frame costs 50');
 assert.equal(await ev(()=>state.companionMeta.eq.fr),'fr_gold');
 assert.equal(await page.locator('.dcz-prev [data-dcz-fr=fr_gold]').count(),1,'frame shown on preview');
 assert.equal(await page.locator('.dcz-prev .dcz-badge svg').count(),1,'badge is svg');
 assert.equal(await ev(()=>getComputedStyle(document.querySelector('.dcz-prev [data-dcz-fr]')).boxShadow.includes('244, 201, 93')),true,'frame ring is styled');
 // 5b. layered outfits (full-body art + transparent layers, per animal)
 await ev(()=>{state.currency=300;state.profile.companion='cat';DEEN_COMPANIONS.open('wardrobe')});
 await page.locator('.dcz-body .dcz-base').waitFor();
 await page.waitForFunction(()=>DEEN_COMPANIONS.outfits().length===3,null,{timeout:4000});
 assert.deepEqual(await ev(()=>DEEN_COMPANIONS.outfits()),['ot_robe','ot_cap','ot_scarf'],'invalid outfit ids are rejected');
 assert.equal(await page.locator('[data-id=ot_cap]').count(),1);
 await page.locator('[data-id=ot_scarf]').click();
 await page.locator('[data-id=ot_cap]').click();
 assert.equal(await ev(()=>state.currency),200,'outfits cost 40+60; the default robe is free');
 assert.deepEqual(await page.locator('.dcz-body .dcz-layer').evaluateAll(a=>a.map(e=>e.dataset.slot+':'+e.style.zIndex)),['body:10','neck:20','head:30'],'default robe + layers stack by z');
 await page.locator('[data-id=ot_cap]').click();
 assert.equal(await page.locator('.dcz-body .dcz-layer').count(),2,'cap removed, robe stays');
 await page.locator('[data-id=ot_robe]').click();
 assert.equal(await page.locator('.dcz-body .dcz-layer[data-slot=body]').count(),1,'the default robe cannot be taken off');
 await ev(()=>{state.profile.companion='lion';DEEN_COMPANIONS.open('wardrobe')});
 await page.locator('.dcz-prev .dcz-stage').waitFor();
 assert.equal(await page.locator('.dcz-body').count(),0,'no full-body view (bare body) for an animal without a default outfit');
 assert.equal(await page.locator('[data-id=ot_cap]').count(),0,'items without lion art stay hidden');
 await ev(()=>{state.profile.companion='cat'});
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
