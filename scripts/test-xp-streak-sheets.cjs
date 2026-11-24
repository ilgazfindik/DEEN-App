/* XP and streak sheets (assets/design/home.js "XP and streak sheets"). The header's XP chip opens the XP sheet with a
   level ring (the level and the share to the next level) and the streak chip opens the streak sheet with a hero (flame and
   the current streak) first, the companion's own picture, and the calendar with today marked; both in indigo and gold.
   Other sheets keep their own look. */
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
  await ctx.addInitScript(l=>{if(sessionStorage.getItem('x'))return;sessionStorage.setItem('x','1');localStorage.setItem('deen_app_language_v1',l);localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:243,streak:1,profile:{name:'QA',companion:'lion'},settings:{language:l,onboardingLanguageConfirmed:true},completed:['U01-S01']}))},lang);
  const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2500);
  // XP
  await page.locator('.app-header .stat[onclick*="xpPanel"]').first().click();await page.waitForTimeout(800);
  const xp=await page.evaluate(()=>{const d=document.getElementById('v5Sheet'),h=d.querySelector('.ds-xp-hero');return {cls:d.classList.contains('ds-xpsheet'),lvl:h&&h.querySelector('b').textContent,first:d.querySelector('#v5SheetBody').firstElementChild===h,offset:h&&+h.querySelector('.val').getAttribute('stroke-dashoffset'),bg:getComputedStyle(d).backgroundImage}});
  assert.equal(xp.cls,true,lang+': XP sheet recognised');assert.equal(xp.lvl,'1',lang+': level in the ring');assert.equal(xp.first,true);
  assert.ok(xp.offset>0&&xp.offset<339,lang+': the ring shows the share to the next level ('+xp.offset+')');assert.match(xp.bg,/gradient/,lang+': indigo sheet');
  await page.evaluate(()=>closeSheet());await page.waitForTimeout(400);
  // Streak
  await page.locator('.app-header .stat[onclick*="streakPanel"]').first().click();await page.waitForTimeout(900);
  const st=await page.evaluate(()=>{const d=document.getElementById('v5Sheet'),b=d.querySelector('#v5SheetBody');return {cls:d.classList.contains('ds-streaksheet'),xp:d.classList.contains('ds-xpsheet'),first:b.firstElementChild.className,n:b.querySelector('.ds-st-hero b')?.textContent,img:b.querySelector('.v994-streak-companion .animal img')?.getAttribute('src')||'',today:b.querySelector('.v5-calendar').lastElementChild.classList.contains('ds-today')}});
  assert.deepEqual({cls:st.cls,xp:st.xp,first:st.first,n:st.n,today:st.today},{cls:true,xp:false,first:'ds-st-hero',n:'1',today:true},lang+': streak sheet '+JSON.stringify(st));
  assert.match(st.img,/lion_avatar\.png$/,lang+': the companion picture');
  await page.evaluate(()=>closeSheet());await page.waitForTimeout(400);
  // Another sheet keeps its own look.
  await page.evaluate(()=>{try{settingsPanel()}catch(_){}});await page.waitForTimeout(700);
  assert.equal(await page.evaluate(()=>{const d=document.getElementById('v5Sheet');return d.classList.contains('ds-xpsheet')||d.classList.contains('ds-streaksheet')}),false,lang+': other sheets are left alone');
  assert.deepEqual(errors,[],lang+': no page errors');console.log('  ok',lang);await ctx.close();
 }
 await browser.close();server.close();console.log('PASS: XP and streak sheets in indigo and gold');
})().catch(e=>{console.error(e);process.exit(1)});
