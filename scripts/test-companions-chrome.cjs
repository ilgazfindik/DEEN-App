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
 await ev(()=>DEEN_COMPANIONS.open(undefined,{force:true}));
 assert.equal(await page.locator('.dcz-tab.on[data-id=animals]').count(),1,'a new animal opens the Animals tab');
 assert.equal(await page.locator('.dcz-tile .dcz-new').count(),1,'new animal is tagged in the Animal Room');
 await ev(()=>DEEN_COMPANIONS.close());
 await page.waitForFunction(()=>!document.querySelector('.dcz-room'));
 await ev(()=>DEEN_COMPANIONS.open('animals',{force:true}));
 assert.equal(await page.locator('.dcz-tile .dcz-new').count(),0,'the tag disappears after it was seen');
 assert.match(await page.locator('.dcz-next').innerText(),/Baykuş · Seviye 3/,'next unlock line');
 assert.equal(await ev(()=>DEEN_COMPANIONS.levels.eagle),7);
 // 4. grandfathering: an old choice stays usable at level 1
 await ev(()=>{window.state.xp=0;window.state.profile.companion='eagle'});
 assert.equal(await ev(()=>DEEN_COMPANIONS.unlocked('eagle')),true);
 await ev(()=>{window.state.profile.companion='cat'});
 // 5. full-screen room (not a bottom sheet)
 await ev(()=>DEEN_COMPANIONS.close());
 await page.waitForFunction(()=>!document.querySelector('.dcz-room'));
 await page.waitForSelector('#dczEntry');
 await ev(()=>closeSheet());
 // 5a. coming soon: regular users only see the red animated notice, never the wardrobe
 assert.equal(await ev(()=>DEEN_COMPANIONS.soon()),true,'soon mode is on for regular users');
 assert.equal(await page.locator('#dczEntry .dcz-soonpill').textContent(),'Yakında','entry button carries the red pill');
 assert.equal(await page.locator('#dczEntry .dcz-soonpill').evaluate(e=>getComputedStyle(e).animationName),'dczSoonPulse');
 await page.locator('#dczEntry').click();
 await page.locator('.dcz-soon.in').waitFor();
 assert.equal(await page.locator('.dcz-room').count(),0,'regular users do not reach the wardrobe');
 assert.equal(await page.locator('.dcz-soon-tag').textContent(),'Yakında');
 const tagCss=await page.locator('.dcz-soon-tag').evaluate(e=>{const c=getComputedStyle(e);return {bg:c.backgroundImage,an:c.animationName}});
 assert.match(tagCss.bg,/rgb\(255, 74, 61\)/,'the tag is red');
 assert.equal(tagCss.an,'dczSoonTag','the tag is animated');
 await page.locator('.dcz-sc-out').waitFor({state:'attached'});
 assert.equal(await page.locator('.dcz-sc-base').evaluate(e=>getComputedStyle(e).animationName),'dczScBase','dress-up animation: bare animal');
 assert.equal(await page.locator('.dcz-sc-out').evaluate(e=>getComputedStyle(e).animationName),'dczScOut','dress-up animation: outfit lands on the animal');
 assert.match(await page.locator('.dcz-sc-out').getAttribute('src'),/outfits\/[a-z]+\/ot_/,'an outfit is shown');
 assert.ok(await page.locator('.dcz-soon-txt').innerText().then(t=>/yakında geliyor/i.test(t)),'caption');
 await page.locator('.dcz-soon-x').click();
 await page.waitForFunction(()=>!document.querySelector('.dcz-soon'),null,{timeout:3000});
 await ev(()=>DEEN_COMPANIONS.open(undefined,{force:true}));
 await page.locator('.dcz-room.in').waitFor();
 assert.equal(await page.locator('#v5Sheet[open]').count(),0,'the room is its own page, not the bottom sheet');
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('.dcz-panel')).transform==='none',null,{timeout:4000});
 assert.equal(await page.locator('.dcz-tab').count(),4,'Shop / My closet / Outfits / Animals');
 const tabk=k=>page.locator('[data-dcz=tab][data-id='+k+']').click();
 const cat=k=>page.locator('[data-dcz=cat][data-id='+k+']').click();
 const tile=id=>page.locator('[data-dcz=tile][data-id='+id+']').click();
 const save=()=>page.locator('[data-dcz=save]').click();
 const closed=()=>page.waitForFunction(()=>!document.querySelector('.dcz-room'));
 const openRoom=async(which)=>{await ev(w=>DEEN_COMPANIONS.open(w,{force:true}),which);await page.locator('.dcz-room.in').waitFor()};
 await tabk('animals');
 assert.equal(await page.locator('.dcz-tile.an').count(),6);
 assert.equal(await page.locator('.dcz-tile.an.lock').count(),3,'wolf is open (level 2), 3 remain locked');
 await tabk('shop');
 // try it on first: a tap only previews; Save buys and equips everything at once
 await cat('bg');await tile('bg_dune');
 assert.equal(await page.locator('.dcz-st[data-dcz-bg=bg_dune]').count(),1,'selected backdrop is previewed on the stage');
 assert.equal(await ev(()=>state.currency),100,'previewing does not charge');
 assert.equal(await ev(()=>state.companionMeta.eq.bg),undefined,'previewing does not wear');
 assert.match(await page.locator('[data-dcz=save]').textContent(),/30/,'Save shows what it will cost');
 await save();await closed();
 assert.equal(await ev(()=>state.currency),70,'backdrop costs 30');
 assert.equal(await ev(()=>state.companionMeta.eq.bg),'bg_dune');
 // several slots in one go: total price, one Save
 await ev(()=>{state.currency=100});
 await openRoom('wardrobe');
 await cat('bg');await tile('bg_night');await cat('ac');await tile('ac_star');
 assert.match(await page.locator('[data-dcz=save]').textContent(),/75/,'30 + 45 in one Save');
 // undo / redo step through the draft
 await page.locator('[data-dcz=undo]').click();
 assert.match(await page.locator('[data-dcz=save]').textContent(),/30/,'undo removes the badge');
 await page.locator('[data-dcz=redo]').click();
 assert.match(await page.locator('[data-dcz=save]').textContent(),/75/,'redo brings it back');
 // leaving with unsaved changes asks first
 await page.locator('[data-dcz=close]').click();
 assert.equal(await page.locator('.dcz-room').count(),1,'first tap on X only warns');
 assert.ok((await ev(()=>window.toasts)).some(x=>/Kaydetmeden/.test(x)));
 await page.locator('[data-dcz=close]').click();await closed();
 assert.equal(await ev(()=>state.currency),100,'discarded draft costs nothing');
 await openRoom('wardrobe');
 await cat('bg');await tile('bg_night');await cat('ac');await tile('ac_star');await save();await closed();
 assert.equal(await ev(()=>state.currency),25,'both bought in one Save');
 assert.equal(await ev(()=>state.companionMeta.eq.ac),'ac_star');
 // not enough Sparkles: nothing is applied and the room stays open
 await ev(()=>{state.currency=10});
 await openRoom('wardrobe');
 await cat('ac');await tile('ac_moon');await save();
 assert.equal(await page.locator('.dcz-room').count(),1,'room stays open when the price is too high');
 assert.equal(await ev(()=>state.currency),10,'no purchase without enough sparkles');
 assert.ok(!(await ev(()=>state.companionMeta.items.includes('ac_moon'))));
 // tapping the chosen item again takes it off
 await cat('bg');await tile('bg_dune'); // owned: previewed for free
 assert.equal(await page.locator('.dcz-st[data-dcz-bg=bg_dune]').count(),1);
 await tile('bg_dune');
 assert.equal(await page.locator('.dcz-st[data-dcz-bg]').count(),0,'tap again = no backdrop');
 await ev(()=>DEEN_COMPANIONS.close());await closed();
 // My closet shows only what is owned
 await openRoom('wardrobe');await tabk('closet');await cat('bg');
 assert.equal(await page.locator('.dcz-tile').count(),2,'two backdrops owned (dune, night)');
 await cat('fr');
 assert.equal(await page.locator('.dcz-tile').count(),0,'no frame owned yet');
 assert.equal(await page.locator('.dcz-empty').count(),1,'empty state is explained');
 await ev(()=>{state.currency=100;DEEN_COMPANIONS.close()});await closed();
 assert.equal(await ev(()=>DEEN_COMPANIONS.items.length),26);
 await openRoom('wardrobe');
 await cat('fr');await tile('fr_gold');await save();await closed();
 assert.equal(await ev(()=>state.currency),50,'frame costs 50');
 await openRoom('wardrobe');
 assert.equal(await page.locator('.dcz-st[data-dcz-fr=fr_gold]').count(),1,'frame shown on the stage');
 assert.equal(await page.locator('.dcz-char .dcz-badge svg').count(),1,'badge is svg');
 assert.equal(await ev(()=>getComputedStyle(document.querySelector('.dcz-st[data-dcz-fr]')).boxShadow.includes('inset')),true,'the frame is an inner glow on the full-bleed stage');
 await ev(()=>DEEN_COMPANIONS.close());await closed();
 // 5b. outfits: full-body art + transparent layers, per animal
 await ev(()=>{state.currency=300;state.profile.companion='cat'});
 await openRoom('wardrobe');
 await page.locator('.dcz-char .dcz-base').waitFor();
 await page.waitForFunction(()=>DEEN_COMPANIONS.outfits().length===4,null,{timeout:4000});
 assert.deepEqual(await ev(()=>DEEN_COMPANIONS.outfits()),['ot_robe','ot_robe_blue','ot_cap','ot_scarf'],'invalid outfit ids are rejected');
 assert.equal(await page.locator('[data-dcz=cat][data-id=ot]').count(),1);
 await cat('ot');
 assert.equal(await page.locator('[data-dcz=tile][data-id=ot_cap]').count(),1);
 await tile('ot_scarf');await tile('ot_cap');
 assert.deepEqual(await page.locator('.dcz-char .dcz-layer').evaluateAll(a=>a.map(e=>e.dataset.slot+':'+e.style.zIndex)),['neck:20','head:30'],'layers stack by z over the full dressed character');
 await save();await closed();
 assert.equal(await ev(()=>state.currency),200,'outfits cost 40+60; the default robe is free');
 await openRoom('wardrobe');await cat('ot');
 assert.equal(await page.locator('.dcz-char .dcz-layer').count(),2,'saved outfit is worn when the room opens');
 await tile('ot_cap'); // tap the chosen one again = take it off
 assert.equal(await page.locator('.dcz-char .dcz-layer').count(),1,'cap taken off in the draft');
 await save();await closed();
 await ev(()=>{state.currency=300});
 await openRoom('wardrobe');await cat('ot');
 await tile('ot_robe_blue');
 assert.match(await page.locator('.dcz-char .dcz-base').getAttribute('src'),/ot_robe_blue\.png/,'a colour is previewed before it is bought');
 assert.equal(await ev(()=>state.currency),300,'previewing does not charge');
 await save();await closed();
 assert.equal(await ev(()=>state.currency),240,'second robe costs 60');
 await openRoom('wardrobe');await cat('ot');
 await tile('ot_robe_blue'); // take it off
 assert.match(await page.locator('.dcz-char .dcz-base').getAttribute('src'),/ot_robe\.png/,'taking it off brings the default robe back');
 await tile('ot_robe'); // the default stays
 assert.match(await page.locator('.dcz-char .dcz-base').getAttribute('src'),/ot_robe\.png/,'the default robe cannot be taken off');
 await ev(()=>DEEN_COMPANIONS.close());await closed();
 await ev(()=>{state.profile.companion='lion'});
 await openRoom('wardrobe');
 assert.equal(await page.locator('[data-dcz=cat][data-id=ot]').count(),0,'no outfit category for an animal without outfits');
 assert.equal(await page.locator('.dcz-char .dcz-av').count(),1,'no bare full-body view for an animal without a default outfit');
 await ev(()=>DEEN_COMPANIONS.close());await closed();
 await ev(()=>{state.profile.companion='cat'});
 // closing animation removes the room
 await openRoom('wardrobe');
 await page.locator('[data-dcz=close]').click();
 await page.waitForFunction(()=>document.querySelector('.dcz-room')?.classList.contains('out')||!document.querySelector('.dcz-room'));
 await closed();
 // 5d. reward items open at a goal and can never be bought; outfit slots save and re-apply a look
 await ev(()=>{state.profile.companion='cat';state.currency=900;state.streakMeta={longestStreak:0,currentStreak:0};state.companionMeta.items=['bg_dune','ac_star'];state.companionMeta.eq={bg:'bg_dune',ac:'ac_star'};state.companionMeta.outfit={}});
 await page.waitForFunction(()=>Array.isArray(state.companionMeta.rewardSeen),null,{timeout:6000});
 await openRoom('wardrobe');await cat('bg');
 assert.equal(await page.locator('[data-dcz=tile][data-id=bg_gold].rw.lock').count(),1,'a reward item is locked until the goal');
 assert.match(await page.locator('[data-dcz=tile][data-id=bg_gold] .dcz-rq').textContent(),/14 günlük seri/,'the goal is shown on the tile');
 await tile('bg_gold');
 assert.ok((await ev(()=>window.toasts)).some(m=>/Açmak için: 14 günlük seri/.test(m)),'tapping a locked reward explains the goal');
 assert.equal(await page.locator('[data-dcz=save]').isDisabled(),true,'a locked reward is never added to the draft');
 assert.equal(await ev(()=>DEEN_COMPANIONS.buyItem('bg_gold')),false,'rewards cannot be bought');
 await ev(()=>{state.streakMeta.longestStreak=14});
 await page.waitForFunction(()=>window.toasts.some(m=>/Yeni ödül/.test(m)),null,{timeout:6000});
 await ev(()=>DEEN_COMPANIONS.close());await closed();
 await openRoom('wardrobe');await cat('bg');
 assert.equal(await page.locator('[data-dcz=tile][data-id=bg_gold].lock').count(),0,'earned: the lock is gone');
 await tile('bg_gold');
 assert.doesNotMatch(await page.locator('[data-dcz=save]').textContent(),/◇/,'an earned reward costs nothing');
 await save();await closed();
 assert.equal(await ev(()=>state.companionMeta.eq.bg),'bg_gold');
 assert.equal(await ev(()=>state.currency),900,'nothing was charged for the reward');
 // outfit slots
 await ev(()=>{state.companionMeta.eq={bg:'bg_dune',ac:'ac_star'}});
 await openRoom('wardrobe');await tabk('combos');
 assert.equal(await page.locator('.dcz-slot').count(),3,'three slots');
 await page.locator('[data-dcz=csave][data-id="0"]').click();
 assert.deepEqual(await ev(()=>state.companionMeta.combos.cat[0].k),{bg:'bg_dune',ac:'ac_star'},'the current look is stored per animal');
 await ev(()=>DEEN_COMPANIONS.close());await closed();
 await ev(()=>{state.companionMeta.eq={}});
 await openRoom('wardrobe');await tabk('combos');
 await page.locator('[data-dcz=capply][data-id="0"]').click();
 assert.equal(await page.locator('.dcz-tab.on[data-id=shop]').count(),1,'applying a look goes back to the stage');
 await save();await closed();
 assert.deepEqual(await ev(()=>({bg:state.companionMeta.eq.bg,ac:state.companionMeta.eq.ac})),{bg:'bg_dune',ac:'ac_star'},'one tap wears the whole look');
 // a look that contains something not owned yet cannot be saved
 await openRoom('wardrobe');await cat('bg');await tile('bg_night');await tabk('combos');
 await page.locator('[data-dcz=csave][data-id="1"]').click();
 assert.equal(await ev(()=>state.companionMeta.combos.cat[1]),null,'an unowned item blocks saving the look');
 assert.ok((await ev(()=>window.toasts)).some(m=>/Önce eşyaları/.test(m)));
 await page.locator('[data-dcz=cdel][data-id="0"]').click();
 assert.equal(await ev(()=>state.companionMeta.combos.cat[0]),null,'a slot can be emptied');
 await ev(()=>DEEN_COMPANIONS.close());await closed();
 await ev(()=>{state.companionMeta.eq={};state.companionMeta.outfit={}});
 // 5e. seasons: Ramadan and the Eids come from the Hijri calendar; seasonal items can only be bought in season
 assert.equal(await ev(()=>DEEN_COMPANIONS.seasonFor(new Date('2027-02-10T12:00:00')).id),'ramadan','Ramadan 1448');
 assert.ok(await ev(()=>DEEN_COMPANIONS.seasonFor(new Date('2027-02-10T12:00:00')).left)>10,'days left are counted');
 assert.equal(await ev(()=>DEEN_COMPANIONS.seasonFor(new Date('2027-03-10T12:00:00')).id),'eid','Eid al-Fitr');
 assert.equal(await ev(()=>DEEN_COMPANIONS.seasonFor(new Date('2027-05-16T12:00:00')).id),'eid','Eid al-Adha');
 assert.equal(await ev(()=>DEEN_COMPANIONS.seasonFor(new Date('2026-11-15T12:00:00'))),null,'an ordinary day has no season');
 await ev(()=>{state.profile.companion='cat';state.currency=900;state.companionMeta.items=[];state.companionMeta.eq={};window.DEEN_ADMIN_SEASON=()=>window.__season||'';window.__season='eid'});
 await openRoom('wardrobe');await cat('bg');
 assert.match(await page.locator('.dcz-banner').textContent(),/Bayramınız mübarek olsun/,'a banner greets the season');
 assert.equal(await page.locator('[data-dcz=tile][data-id=bg_ramadan].rw').count(),1,'a Ramadan item is closed during Eid');
 assert.equal(await page.locator('[data-dcz=tile][data-id=bg_eid].rw').count(),0,'an Eid item is open during Eid');
 await tile('bg_ramadan');
 assert.ok((await ev(()=>window.toasts)).some(m=>/Ramazan ayında alınabilir/.test(m)),'tapping a closed seasonal item explains');
 assert.equal(await ev(()=>DEEN_COMPANIONS.buyItem('bg_ramadan')),false,'closed seasonal items cannot be bought');
 await tile('bg_eid');await save();await closed();
 assert.equal(await ev(()=>state.currency),850,'an open seasonal item costs its price');
 assert.equal(await ev(()=>state.companionMeta.eq.bg),'bg_eid');
 // what was bought stays usable after the season ends
 await ev(()=>{window.__season=''});
 await openRoom('wardrobe');await tabk('closet');await cat('bg');
 assert.equal(await page.locator('[data-dcz=tile][data-id=bg_eid]').count(),1,'owned seasonal items stay in My closet all year');
 await ev(()=>DEEN_COMPANIONS.close());await closed();
 await ev(()=>{state.companionMeta.eq={};state.companionMeta.items=[]});
 // 5c. the player's own animal is shown dressed wherever the plain avatar appears
 await ev(()=>{
  const m=state.companionMeta;if(!m.items.includes('ot_robe_blue'))m.items.push('ot_robe_blue');
  state.profile.companion='cat';m.outfit={};
  document.body.insertAdjacentHTML('beforeend','<img id="avMine" src="assets/companions/cat/cat_avatar.png" alt=""><img id="avOther" src="assets/companions/lion/lion_avatar.png" alt="">');
 });
 await page.waitForTimeout(1500);
 assert.match(await ev(()=>document.getElementById('avMine').getAttribute('src')),/cat_avatar\.png/,'nothing customised: the original avatar stays');
 await ev(()=>{state.companionMeta.outfit={cat:{body:'ot_robe_blue'}}});
 await page.waitForFunction(()=>/^data:image/.test(document.getElementById('avMine').getAttribute('src')),null,{timeout:6000});
 assert.match(await ev(()=>document.getElementById('avOther').getAttribute('src')),/lion_avatar\.png/,'only the own animal is replaced');
 await ev(()=>{state.companionMeta.outfit={}});
 await page.waitForFunction(()=>/cat_avatar\.png/.test(document.getElementById('avMine').getAttribute('src')),null,{timeout:6000});
 await ev(()=>{document.getElementById('avMine').remove();document.getElementById('avOther').remove()});
 // 6. every language renders without throwing
 for(const l of ['tr','en','de','fr','ar']){
  await ev(l=>{window.__lang=l;DEEN_COMPANIONS.open('animals',{force:true})},l);
  assert.equal(await page.locator('.dcz-tile.an').count(),6,l);
  assert.equal(await page.locator('.dcz-room').getAttribute('dir'),l==='ar'?'rtl':'ltr');
  await ev(()=>DEEN_COMPANIONS.close());
  await page.waitForFunction(()=>!document.querySelector('.dcz-room'));
 }
 assert.deepEqual(errors,[]);
 await browser.close();server.close();
 console.log('PASS: companion unlocks + wardrobe');
})().catch(e=>{console.error(e);process.exit(1)});
