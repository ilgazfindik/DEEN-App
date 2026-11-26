/* Chest reveal order and the legendary moment (assets/design/market.js openChest): whatever order the roll gives, the
   rewards are shown Sparkles first, then common → rare → epic → legendary, and the summary keeps that order. A
   legendary item is announced (dim screen, gathering golden light) and then bursts in with rings, sparks, confetti and
   a banner; other items show at once. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),SHOT=process.env.SHOT;
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg','.avif':'image/avif'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true,deviceScaleFactor:SHOT?2:1});
 await ctx.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,currency:500,profile:{name:'QA',companion:'lion'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))});
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2500);
 await page.evaluate(()=>navigate('marketScreen'));await page.waitForTimeout(1500);
 // A legendary chest whose roll came out in a mixed order.
 await page.evaluate(async()=>{
  const j=await (await fetch('assets/companions/outfits.json')).json(),by=c=>j.items.find(i=>i.cost===c);
  const it=(r,c)=>({kind:'outfit',o:by(c),a:'lion',r,fresh:true});
  DEEN_MARKET.openChest({chest:DEEN_MARKET.chests[3],rewards:[it('legendary',250),it('common',60),{kind:'sp',n:99,r:'legendary'},it('epic',150),it('rare',100)]});
 });
 const mko=page.locator('.mko');await mko.waitFor();await page.waitForTimeout(400);
 for(let k=0;k<3;k++){await mko.click({position:{x:196,y:300}});await page.waitForTimeout(700)}
 await page.waitForFunction(()=>document.querySelector('.mko.reveal .mko-card'),null,{timeout:6000});
 const seen=[];const shot=n=>SHOT?page.screenshot({path:SHOT+'-'+n+'.png'}):null;
 const cur=()=>page.evaluate(()=>{if(document.querySelector('.mko-orb'))return 'orb';const c=document.querySelector('.mko-show .mko-card');return c?(c.classList.contains('sp')?'sp':c.dataset.r):null});
 seen.push(await cur());
 for(let k=0;k<4;k++){
  const before=await cur();
  for(let n=0;n<10&&await cur()===before;n++){await page.waitForTimeout(300);await mko.click({position:{x:196,y:300}});await page.waitForTimeout(150)}
  seen.push(await cur());
 }
 // The legendary one: announced (dim screen, golden light) before it shows.
 assert.equal(seen[4],'orb','legendary is announced first: '+seen);
 assert.ok(await page.evaluate(()=>document.querySelector('.mko').classList.contains('leg-charge')),'screen dims');
 await page.waitForTimeout(400);await shot('1-charge');
 await page.waitForSelector('.mko.leg-burst .mko-legbanner',{timeout:4000});
 const burst=await page.evaluate(()=>({banner:document.querySelector('.mko-legbanner')?.textContent,sparks:document.querySelectorAll('.mko-legsparks i').length,confetti:document.querySelectorAll('.mko-confetti b').length,card:document.querySelector('.mko-show .mko-card')?.dataset.r}));
 await page.waitForTimeout(900);await shot('2-legendary');
 assert.deepEqual(seen.slice(0,4),['sp','common','rare','epic'],'least precious first: '+seen);
 assert.deepEqual(burst,{banner:'Efsanevi!',sparks:28,confetti:26,card:'legendary'},'legendary burst');
 await page.waitForTimeout(1200);await mko.click({position:{x:196,y:300}});await page.waitForTimeout(600);
 const sum=await page.evaluate(()=>[...document.querySelectorAll('.mko-sum .mko-card')].map(c=>c.classList.contains('sp')?'sp':c.dataset.r));
 assert.deepEqual(sum,['sp','common','rare','epic','legendary'],'summary in the same order');
 assert.equal(await page.evaluate(()=>document.querySelector('.mko').classList.contains('leg-burst')),false,'effects end on the summary');
 // A chest without a legendary item shows no legendary moment.
 await page.locator('.mko-done').click();await page.waitForTimeout(500);
 await page.evaluate(async()=>{const j=await (await fetch('assets/companions/outfits.json')).json();DEEN_MARKET.openChest({chest:DEEN_MARKET.chests[0],rewards:[{kind:'sp',n:8,r:'common'},{kind:'outfit',o:j.items.find(i=>i.cost===60),a:'lion',r:'common',fresh:true}]})});
 await page.locator('.mko').waitFor();for(let k=0;k<3;k++){await page.locator('.mko').click({position:{x:196,y:300}});await page.waitForTimeout(700)}
 await page.waitForTimeout(1200);for(let k=0;k<2;k++){await page.locator('.mko').click({position:{x:196,y:300}});await page.waitForTimeout(500)}
 assert.equal(await page.evaluate(()=>document.querySelectorAll('.mko-orb,.mko-legbanner').length),0,'no legendary moment for common items');
 assert.deepEqual(errors,[]);
 await browser.close();server.close();console.log('PASS: chest reveal — least precious first, legendary moment');
})().catch(e=>{console.error(e);process.exit(1)});
