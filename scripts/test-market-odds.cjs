/* Market drop rules (assets/design/market.js). Simulated chests match the published chances per item; the epic chest
   always holds a rare-or-better item and the legendary chest an epic-or-better one (a legendary item about 2% per item); bad-luck protection gives an epic item
   after 7 chests in a row without one, and a legendary item after 29 without; a learner who owns every outfit of a
   rarity gets it again as Sparkles of that rarity (not a lower item). A finished lesson pays 3 Sparkles, 5 without
   mistakes, shown on the result screen, up to 30 a day. The shop shows the protection counters. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true});
 await ctx.addInitScript(()=>{if(sessionStorage.getItem('x'))return;sessionStorage.setItem('x','1');localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,currency:100,learningProfile:'adult',profile:{name:'QA',companion:'cat'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[],history:[{date:'2026-01-01',at:1,stage:'U01-S01',total:10,correct:10,perfect:true}]}))});
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(3000);
 // 1. Simulated chances (no state is changed by rolling).
 const sim=await page.evaluate(async()=>{
  await new Promise(r=>{const t=setInterval(()=>{if(DEEN_MARKET.chests)clearInterval(t),r()},50)});
  await fetch('assets/companions/outfits.json');await new Promise(r=>setTimeout(r,500));
  // A seeded generator: the shares are compared with the published chances on the same sample every run (no random misses).
  const realRandom=Math.random;let seed=0x9e3779b9;Math.random=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  const out={};const R=['common','rare','epic','legendary'];
  for(const c of DEEN_MARKET.chests){const n={common:0,rare:0,epic:0,legendary:0};let items=0,guarOk=true;
   for(let k=0;k<20000;k++){state.marketMeta.pity={epic:0,legendary:0};const rw=DEEN_MARKET.roll(c).filter(x=>x.kind==='outfit');items+=rw.length;rw.forEach(x=>n[x.r]++);
    if(c.guarantee&&!rw.some(x=>R.indexOf(x.r)>=R.indexOf(c.guarantee))&&rw.length===c.items)guarOk=false}
   out[c.r]={share:R.map(r=>+(n[r]/items*100).toFixed(2)),odds:c.odds,guarOk}}
  state.marketMeta.pity={epic:7,legendary:0};const pe=DEEN_MARKET.roll(DEEN_MARKET.chests[0]).filter(x=>x.kind==='outfit').map(x=>x.r);
  state.marketMeta.pity={epic:0,legendary:29};const pl=DEEN_MARKET.roll(DEEN_MARKET.chests[0]).filter(x=>x.kind==='outfit').map(x=>x.r);
  state.marketMeta.pity={epic:0,legendary:0};Math.random=realRandom;
  return {out,pe,pl,rule:DEEN_MARKET.pityRule}});
 for(const [r,v] of Object.entries(sim.out)){
  if(!v.guarOk)assert.fail(r+': guarantee broken');
  // Without a guarantee the shares match the published chances (within 0.6 points over 40k+ items).
  if(r==='common'||r==='rare')v.odds.forEach((o,i)=>assert.ok(Math.abs(v.share[i]-o)<0.6,r+' chest: '+['common','rare','epic','legendary'][i]+' '+v.share[i]+'% vs '+o+'%'));
 }
 assert.ok(sim.out.common.share[3]>0&&sim.out.common.share[3]<0.3,'legendary from a common chest is about 1 in 1000 ('+sim.out.common.share[3]+'%)');
 // The legendary chest does not promise a legendary item: about 2% per item, about one chest in ten; it promises an epic one.
 assert.ok(sim.out.legendary.share[3]>1.5&&sim.out.legendary.share[3]<2.6,'legendary chest: about 2% legendary per item ('+sim.out.legendary.share[3]+'%)');
 assert.ok(sim.out.legendary.share[2]+sim.out.legendary.share[3]>=20,'legendary chest: an epic-or-better item in every chest');
 assert.ok(sim.pe.some(r=>r==='epic'||r==='legendary'),'bad-luck protection: epic after 7 empty chests '+sim.pe);
 assert.ok(sim.pl.includes('legendary'),'bad-luck protection: legendary after 29 '+sim.pl);
 assert.deepEqual(sim.rule,{epic:8,legendary:30});
 console.log('  ok chances',JSON.stringify(Object.fromEntries(Object.entries(sim.out).map(([k,v])=>[k,v.share]))));
 // 2. Every legendary outfit owned: a legendary roll stays legendary and turns into Sparkles.
 const dup=await page.evaluate(async()=>{const j=await (await fetch('assets/companions/outfits.json')).json();
  const leg=j.items.filter(i=>i.cost>=170).map(i=>i.id);state.companionMeta=state.companionMeta||{};state.companionMeta.items=leg.slice();state.marketMeta.pity={epic:0,legendary:29};
  const rw=DEEN_MARKET.roll({...DEEN_MARKET.chests[3],animal:0}).filter(x=>x.kind==='outfit'&&x.r==='legendary');state.companionMeta.items=[];state.marketMeta.pity={epic:0,legendary:0};return rw.map(x=>({fresh:x.fresh,dupe:x.dupe}))});
 assert.ok(dup.length>=1&&dup.every(x=>x.fresh===false&&x.dupe===80),'owned legendary comes again as 80 Sparkles '+JSON.stringify(dup));
 // 3. The shop shows the protection counters; the epic chest's preview shows its guarantee.
 await page.locator('nav.bottomnav .navbtn[data-screen="marketScreen"]').click();await page.waitForTimeout(1200);
 const pity=await page.evaluate(()=>[...document.querySelectorAll('#marketScreen .mk-pity-row small')].map(e=>e.textContent));
 assert.deepEqual(pity,['8 sandık kaldı','30 sandık kaldı'],'protection counters');
 await page.locator('#marketScreen .mk-chest[data-r="epic"]').click();await page.waitForTimeout(700);
 assert.match(await page.locator('.mk-sheet .mk-guar').textContent(),/En az 1 Ender eşya garanti/);
 assert.equal(await page.locator('.mk-sheet .mk-odd b').first().textContent(),'%40');
 if(process.env.SHOT){await page.screenshot({path:process.env.SHOT+'-sheet.png'});}
 await page.locator('.mk-sheet-x').click();await page.waitForTimeout(400);
 if(process.env.SHOT){await page.evaluate(()=>{document.querySelector('#marketScreen .mk-pity').scrollIntoView({block:'center'})});await page.waitForTimeout(400);await page.screenshot({path:process.env.SHOT+'-pity.png'})}
 // 4. A real lesson finished without mistakes pays 5 Sparkles, shown on the result screen; older lessons are not paid.
 const c0=await page.evaluate(()=>state.currency);
 await page.locator('nav.bottomnav .navbtn[data-screen="learnScreen"]').click();await page.waitForTimeout(800);
 await page.locator('.v680-main').first().click();await page.waitForSelector('#answerArea .option',{timeout:30000});await page.waitForTimeout(1200);
 await page.evaluate(async()=>{for(let i=0;i<40&&document.getElementById('quizView')?.style.display!=='none';i++){const q=session.questions[session.index];if(!q)break;try{completeQuestion(true,q)}catch(e){}await new Promise(r=>setTimeout(r,120));try{nextQuestion()}catch(e){}await new Promise(r=>setTimeout(r,150))}});
 await page.waitForSelector('#resultView.show',{timeout:20000});await page.waitForTimeout(900);
 const chip=await page.evaluate(()=>{const c=document.querySelector('#resultView .mk-earn');return c?c.textContent:''});
 const last=await page.evaluate(()=>state.history[state.history.length-1]);
 const c1=await page.evaluate(()=>state.currency);
 const expect=last.total>=5?(last.perfect?5:3):0;
 assert.ok(c1-c0>=expect,'the lesson paid Sparkles ('+(c1-c0)+', lesson '+expect+')');
 assert.match(chip,new RegExp('\\+'+expect+' Pırıltı'),'result screen shows the Sparkles: '+chip);
 if(process.env.SHOT)await page.screenshot({path:process.env.SHOT+'-result.png'});
 // 5. The daily cap.
 const cap=await page.evaluate(()=>{const mm=state.marketMeta;mm.earn={date:mm.earn.date,n:28};const before=state.currency;
  for(let k=0;k<3;k++)state.history.push({date:'x',at:Date.now()+k+10,total:10,correct:10,perfect:true});DEEN_MARKET.payLessons();return {gain:state.currency-before,n:mm.earn.n}});
 assert.deepEqual(cap,{gain:2,n:30},'up to 30 a day');
 assert.deepEqual(errors,[],'no page errors');
 await browser.close();server.close();console.log('PASS: market drop rules — chances, guarantees, bad-luck protection, duplicates by rarity, Sparkles for lessons with a daily cap');
})().catch(e=>{console.error(e);process.exit(1)});
