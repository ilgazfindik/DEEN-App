/* Admin panel wardrobe switches: all wardrobe open (non-destructive) and unlimited Sparkles (restores the real balance). */
const {chromium}=require('playwright'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><dialog id="v5Sheet"><h3 id="v5SheetTitle"></h3><div id="v5SheetBody"></div></dialog><div id="deenAdminPanelV2"><div id="deenAdminBody"><div class="deen-admin-status">durum</div></div><div id="deenAdminMessage"></div></div></body></html>';
const PNG=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==','base64');
const OUTFITS={items:[{id:'ot_robe',slot:'body',z:10,cost:0,default:true,full:true,name:{tr:'Cübbe'},art:{cat:'assets/companions/outfits/cat/ot_robe.png'}},{id:'ot_blue',slot:'body',z:10,cost:60,full:true,name:{tr:'Mavi'},art:{cat:'assets/companions/outfits/cat/ot_blue.png'}}]};
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
  window.state={xp:0,currency:42,onboarded:true,profile:{name:'T',companion:'cat'}};
  window.level=(xp=0)=>({n:1});window.saveState=()=>{};window.updateUI=()=>{};window.toast=()=>{};
  window.sheet=(t,b)=>{document.querySelector('#v5SheetTitle').textContent=t;document.querySelector('#v5SheetBody').innerHTML=b;document.querySelector('#v5Sheet').showModal()};
  window.closeSheet=()=>document.querySelector('#v5Sheet').close();
  window.DEEN_APP_LOCALE={get:()=>'tr'};
  window.DEEN_ADMIN={render:()=>{document.getElementById('deenAdminWardrobe')?.remove();window.DEEN_ADMIN_TEST.inject()}};
 });
 await page.addScriptTag({path:path.join(root,'assets/design/companions.js')});
 await page.addScriptTag({path:path.join(root,'assets/design/admin-test.js')});
 const ev=(f,a)=>page.evaluate(f,a);
 await ev(()=>DEEN_ADMIN_TEST.inject()); // the real panel draws itself after load and the observer injects the sections
 await page.locator('#deenAdminWardrobe').waitFor();
 // Baseline: locked
 assert.equal(await ev(()=>DEEN_COMPANIONS.unlocked('eagle')),false);
 assert.equal(await ev(()=>DEEN_COMPANIONS.buyItem('bg_gold')),false,'not enough Sparkles');
 // 1. unlimited Sparkles
 await page.locator('[data-adm2=sparkles]').click();
 await page.waitForFunction(()=>state.currency===999999);
 assert.equal(await ev(()=>DEEN_COMPANIONS.buyItem('bg_gold')),true);
 await page.waitForFunction(()=>state.currency===999999,null,{timeout:4000}); // topped up again after spending
 await page.locator('[data-adm2=sparkles]').click();
 assert.equal(await ev(()=>state.currency),42,'the real balance comes back when switched off');
 // 2. all wardrobe
 await ev(()=>{state.companionMeta.items=[];state.companionMeta.eq={}});
 await page.locator('[data-adm2=wardrobe]').click();
 assert.equal(await ev(()=>['lion','cat','wolf','owl','turtle','eagle'].every(i=>DEEN_COMPANIONS.unlocked(i))),true,'every animal opens');
 assert.equal(await ev(()=>DEEN_COMPANIONS.buyItem('fr_nur')),true,'items are free while the switch is on');
 assert.equal(await ev(()=>state.currency),42,'nothing is charged');
 await ev(()=>DEEN_COMPANIONS.open('wardrobe'));
 await page.waitForFunction(()=>DEEN_COMPANIONS.outfits().length===2);
 await page.locator('.dcz-body').waitFor();
 await page.locator('[data-dcz=cat][data-id=ot]').click();
 await page.locator('[data-dcz=sel][data-id=ot_blue]').click();
 await page.locator('[data-dcz=act]').click();
 assert.match(await page.locator('.dcz-body .dcz-base').getAttribute('src'),/ot_blue\.png/,'every outfit can be tried');
 await page.locator('[data-dcz=cat][data-id=bg]').click();
 assert.equal(await page.locator('[data-id=bg_garden]').textContent().then(t=>/◇/.test(t)),false,'items show as owned (no price)');
await ev(()=>closeSheet());
 // 3. switching off restores the locks and ignores what was only worn through the switch
 await page.locator('[data-adm2=wardrobe]').click();
 assert.equal(await ev(()=>DEEN_COMPANIONS.unlocked('eagle')),false);
 await ev(()=>DEEN_COMPANIONS.open('wardrobe'));
 await page.locator('.dcz-body').waitFor();
 assert.match(await page.locator('.dcz-body .dcz-base').getAttribute('src'),/ot_robe\.png/,'the default robe is back');
 assert.equal(await page.locator('.dcz-prev [data-dcz-fr]').count(),0,'a frame that was never bought is not shown');
 assert.deepEqual(errors,[]);
 await browser.close();server.close();
 console.log('PASS: admin wardrobe switches');
})().catch(e=>{console.error(e);process.exit(1)});
