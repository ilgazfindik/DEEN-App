/* Chest opening (assets/design/motion.js + motion.css). A ready chest takes the whole screen on one solid colour and
   nothing but the chest shows (no button, no title, no app behind it). A tap anywhere counts: the first swings it in 3D
   to the right, the second to the left, the third brings it back to the middle and breaks it open (the reward is
   claimed once), and the rewards and the way on then appear. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 for(const lang of ['tr','en']){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true});
  await ctx.addInitScript(l=>{localStorage.setItem('deen_app_language_v1',l);localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,profile:{name:'QA',companion:'cat'},settings:{language:l,onboardingLanguageConfirmed:true},completed:['U01-S01']}))},lang);
  const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2500);
  // Make today's chest ready: three quest seals and a completed daily journey.
  await page.evaluate(()=>{const d=DEEN_ECONOMY.status().dailyChest.date;state.retentionEconomy.daily[d].questDoneIds=['q1','q2','q3'];
   const J=window.DEEN_DAILY_JOURNEY,orig=J.status;J.status=(...a)=>({...(orig?orig.apply(J,a):{}),complete:true});DEEN_ECONOMY.openDailyChest()});
  await page.waitForTimeout(900);
  const look=()=>page.evaluate(()=>{const c=document.querySelector('dialog.v670-reward .v670-card'),ch=c.querySelector('.v670-chest'),b=c.querySelector('.v670-open'),h=c.querySelector('.ds-chest-hint');
   return {cls:c.className,chest:ch.className,btnShown:getComputedStyle(b).display!=='none'&&!b.hidden,hint:h&&getComputedStyle(h).display!=='none'?h.textContent:'',sparkles:Number(state.sparkles??state.retentionEconomy?.ledger?.length??0),claimed:DEEN_ECONOMY.status().dailyChest.claimed}});
  let s=await look();
  assert.equal(s.btnShown,false,lang+': a ready chest shows no open button');
  const full=await page.evaluate(()=>{const d=document.querySelector('dialog.v670-reward'),r=d.getBoundingClientRect(),c=d.querySelector('.v670-card');
   const shown=[...c.children].filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().height>0).map(e=>e.className);
   return {full:d.classList.contains('ds-full'),w:Math.round(r.width),h:Math.round(r.height),bg:getComputedStyle(d).backgroundColor,shown}});
  assert.equal(full.full,true,lang+': full-screen chest');assert.equal(full.w,393,lang+': covers the width');assert.equal(full.h,852,lang+': covers the height');
  assert.equal(full.bg,'rgb(13, 58, 64)',lang+': one solid colour behind it');
  assert.deepEqual(full.shown,['v670-chest-stage'],lang+': only the chest shows ('+full.shown.join(', ')+')');
  await page.mouse.click(196,140);await page.waitForTimeout(650);s=await look();
  assert.match(s.chest,/ds-tilt-r/,lang+': first tap swings it right');assert.doesNotMatch(s.cls,/\bopened\b/);
  const t1=await page.evaluate(()=>getComputedStyle(document.querySelector('dialog.v670-reward .v670-chest')).transform);
  assert.notEqual(t1,'none',lang+': the swing is a 3D transform');
  await page.mouse.click(40,800);await page.waitForTimeout(650);s=await look();
  assert.match(s.chest,/ds-tilt-l/,lang+': second tap swings it left');assert.doesNotMatch(s.cls,/\bopened\b/);assert.equal(s.claimed,false);
  await page.mouse.click(300,520);await page.waitForTimeout(150);s=await look();
  assert.match(s.chest,/ds-center/,lang+': third tap brings it to the middle first');
  await page.waitForTimeout(1000);s=await look();
  assert.match(s.cls,/\bopened\b/,lang+': then it breaks open');
  assert.ok(await page.locator('dialog.v670-reward .v670-continue').isVisible(),lang+': the way on shows after opening');assert.equal(s.claimed,true,lang+': the reward is claimed');
  const loot=await page.evaluate(()=>document.querySelector('dialog.v670-reward .v670-loot').textContent);
  assert.match(loot,/\+\d/,lang+': the reward shows ('+loot+')');
  await page.waitForTimeout(800);
  assert.equal(await page.evaluate(()=>getComputedStyle(document.querySelector('dialog.v670-reward .ds-chest-rays')).opacity>0.5),true,lang+': rays behind the open chest');
  assert.deepEqual(errors,[],lang+': no page errors');
  console.log('  ok',lang,JSON.stringify({loot}));
  await ctx.close();
 }
 await browser.close();server.close();console.log('PASS: full-screen chest, only the chest; opens by tapping anywhere (right, left, middle → breaks open)');
})().catch(e=>{console.error(e);process.exit(1)});
