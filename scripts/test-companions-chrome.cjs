/* Companion unlocks + wardrobe — isolated Chrome regression (engine globals are stubbed). */
const {chromium}=require('playwright'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><dialog id="v5Sheet"><h3 id="v5SheetTitle"></h3><div id="v5SheetBody"></div></dialog><div id="profileScreenBody"><section class="dsp-id"><span class="dsp-avatar-slot"></span></section></div><div id="picker"></div></body></html>';
const PNG=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==','base64');
const OUTFITS={groups:{robes:{name:{tr:'Cübbe',en:'Thobe'}}},items:[
 {id:'ot_robe',slot:'body',z:10,cost:0,default:true,full:true,group:'robes',swatch:'#f4f4f6',name:{tr:'Cübbe',en:'Thobe'},art:{cat:'assets/companions/outfits/cat/ot_robe.png'}},
 {id:'ot_robe_blue',slot:'body',z:10,cost:60,full:true,group:'robes',swatch:'#5678a8',name:{tr:'Mavi',en:'Blue'},art:{cat:'assets/companions/outfits/cat/ot_robe_blue.png'}},
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
 await page.waitForFunction(()=>window.toasts.some(t=>/Kurt/.test(t)&&/açıldı/.test(t)),null,{timeout:4000});
 assert.equal(await page.locator('#v5Sheet[open]').count(),0,'unlocking never pops a modal over other screens');
 await ev(()=>DEEN_COMPANIONS.open('animals'));
 assert.equal(await page.locator('.dcz-card .dcz-new').count(),1,'new animal is tagged in the Animal Room');
 await ev(()=>DEEN_COMPANIONS.open('animals'));
 assert.equal(await page.locator('.dcz-card .dcz-new').count(),0,'the tag disappears after it was seen');
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
 const cat=k=>page.locator('[data-dcz=cat][data-id='+k+']').click();
 const sel=id=>page.locator('[data-dcz=sel][data-id='+id+']').click();
 const act=()=>page.locator('[data-dcz=act]').click();
 await page.locator('[data-dcz=tab][data-id=wardrobe]').click();
 assert.equal(await ev(()=>getComputedStyle(document.querySelector('.dcz-sticky')).position),'sticky','preview and action stay in view while the list scrolls');
 // try it on first: selecting previews the item but neither buys nor wears it
 await cat('bg');await sel('bg_dune');
 assert.equal(await page.locator('.dcz-pv [data-dcz-bg=bg_dune]').count(),1,'selected backdrop is previewed');
 assert.equal(await ev(()=>state.currency),100,'selecting does not charge');
 assert.equal(await ev(()=>state.companionMeta.eq.bg),undefined,'selecting does not wear');
 assert.match(await page.locator('.dcz-selname small').textContent(),/Önizleme/,'unowned item is marked as preview');
 await act();
 assert.equal(await ev(()=>state.currency),70,'backdrop costs 30');
 assert.equal(await ev(()=>state.companionMeta.eq.bg),'bg_dune');
 await cat('ac');await sel('ac_star');await act();
 assert.equal(await ev(()=>state.currency),25);
 await ev(()=>{state.currency=10});
 await sel('ac_moon');
 assert.equal(await page.locator('.dcz-act.poor').count(),1,'not enough Sparkles is shown on the button');
 await act();
 assert.equal(await ev(()=>state.currency),10,'no purchase without enough sparkles');
 assert.ok(!(await ev(()=>state.companionMeta.items.includes('ac_moon'))));
 await cat('bg');await sel('bg_dune');await act(); // worn -> take off
 assert.equal(await ev(()=>state.companionMeta.eq.bg),undefined);
 await ev(()=>{state.currency=100});
 assert.equal(await ev(()=>DEEN_COMPANIONS.items.length),18);
 await cat('fr');await sel('fr_gold');await act();
 assert.equal(await ev(()=>state.currency),50,'frame costs 50');
 assert.equal(await ev(()=>state.companionMeta.eq.fr),'fr_gold');
 assert.equal(await page.locator('.dcz-pv [data-dcz-fr=fr_gold]').count(),1,'frame shown on preview');
 assert.equal(await page.locator('.dcz-pv .dcz-badge svg').count(),1,'badge is svg');
 assert.equal(await ev(()=>getComputedStyle(document.querySelector('.dcz-pv [data-dcz-fr]')).boxShadow.includes('244, 201, 93')),true,'frame ring is styled');
 // 5b. layered outfits (full-body art + transparent layers, per animal)
 await ev(()=>{state.currency=300;state.profile.companion='cat';DEEN_COMPANIONS.open('wardrobe')});
 await page.locator('.dcz-body .dcz-base').waitFor();
 await page.waitForFunction(()=>DEEN_COMPANIONS.outfits().length===4,null,{timeout:4000});
 assert.deepEqual(await ev(()=>DEEN_COMPANIONS.outfits()),['ot_robe','ot_robe_blue','ot_cap','ot_scarf'],'invalid outfit ids are rejected');
 await cat('ot');
 assert.equal(await page.locator('.dcz-grp .dcz-dot').count(),2,'a family of colours is one card with colour dots');
 assert.equal(await page.locator('[data-id=ot_cap]').count(),1);
 await sel('ot_scarf');await act();
 await sel('ot_cap');await act();
 assert.equal(await ev(()=>state.currency),200,'outfits cost 40+60; the default robe is free');
 assert.deepEqual(await page.locator('.dcz-body .dcz-layer').evaluateAll(a=>a.map(e=>e.dataset.slot+':'+e.style.zIndex)),['neck:20','head:30'],'layers stack by z over the full dressed character');
 await sel('ot_cap');await act(); // worn -> take off
 assert.equal(await page.locator('.dcz-body .dcz-layer').count(),1,'cap removed');
 await ev(()=>{state.currency=300});
 await sel('ot_robe_blue');
 assert.match(await page.locator('.dcz-body .dcz-base').getAttribute('src'),/ot_robe_blue\.png/,'a colour is previewed before it is bought');
 assert.equal(await ev(()=>state.currency),300,'previewing does not charge');
 await act();
 assert.equal(await ev(()=>state.currency),240,'second robe costs 60');
 await act(); // worn -> take off
 assert.match(await page.locator('.dcz-body .dcz-base').getAttribute('src'),/ot_robe\.png/,'taking it off brings the default robe back');
 await ev(()=>{state.currency=200});
 await sel('ot_robe');
 assert.equal(await page.locator('.dcz-act[disabled]').count(),1,'the default robe cannot be taken off');
 assert.match(await page.locator('.dcz-body .dcz-base').getAttribute('src'),/ot_robe\.png/,'the default full robe is the base picture');
 await ev(()=>{state.profile.companion='lion';DEEN_COMPANIONS.open('wardrobe')});
 await page.locator('.dcz-pv .dcz-stage').waitFor();
 assert.equal(await page.locator('.dcz-body').count(),0,'no full-body view (bare body) for an animal without a default outfit');
 assert.equal(await page.locator('[data-dcz=cat][data-id=ot]').count(),0,'no outfit category for an animal without outfits');
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
