/* Settings sheet design (assets/design/settings.js + settings.css): indigo and gold grouped cards in a clear order
   (notifications, learning, narration profile, celebrations, narration, accessibility, data, about), switches instead
   of check boxes (they still change the setting), the backup import as a normal row, the Premium row in plain words,
   and the policy notes folded into an "About" card that opens on tap. Other sheets are left alone. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg','.avif':'image/avif'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 for(const lang of ['tr','en','ar']){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
  await ctx.addInitScript(l=>{localStorage.setItem('deen_app_language_v1',l);localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,history:[{at:1}],profile:{name:'QA',companion:'owl'},settings:{language:l,onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))},lang);
  const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2000);
  await page.evaluate(()=>settingsPanel());await page.waitForSelector('#v5Sheet.ds-settings',{timeout:5000});await page.waitForTimeout(500);
  const r=await page.evaluate(()=>{
   const groups=[...document.querySelectorAll('#v5SheetBody>.v690-setting-group')].map(g=>({k:g.dataset.dsSec,top:g.getBoundingClientRect().top}));
   const order=groups.slice().sort((a,b)=>a.top-b.top).map(g=>g.k);
   const cb=document.querySelector('#v5Sheet .v5-toggle input[type=checkbox]');const cs=getComputedStyle(cb);
   const about=document.querySelector('[data-ds-sec=about]');
   return {order,appearance:cs.appearance||cs.webkitAppearance,w:cs.width,bg:getComputedStyle(document.getElementById('v5Sheet')).backgroundImage,
    aboutHidden:getComputedStyle(about.querySelector('.v690-policy-card')).display,aboutHead:about.querySelector('small').textContent,
    prem:document.querySelector('[onclick*="premiumPanel"] span').textContent,note:getComputedStyle(document.querySelector('.v690-state-note')||document.body).display,
    importRow:!!document.querySelector('.ds-set-import input[type=file]')};
  });
  assert.deepEqual(r.order.filter(k=>k!=='other'),['learn','profile','celebrate','narration','access','data','about'],lang+': order '+r.order);
  assert.equal(r.appearance,'none',lang+': switch');assert.equal(r.w,'51px');assert.match(r.bg,/linear-gradient/,'indigo background');
  assert.equal(r.aboutHidden,'none','about is folded');assert.ok(r.importRow,'import row');
  assert.equal(r.prem,{tr:'Premium · Ücretsiz',en:'Premium · Free',ar:'Premium · مجاني'}[lang]);
  assert.equal(r.aboutHead,{tr:'Hakkında ve ilkeler',en:'About and principles',ar:'حول التطبيق والمبادئ'}[lang]);
  // A switch still changes the setting.
  const before=await page.evaluate(()=>state.settings.haptic!==false);
  await page.locator('#v5Sheet input[onchange*="state.settings.haptic"]').click();
  assert.equal(await page.evaluate(()=>state.settings.haptic),!before,'the switch changes the setting');
  // About opens on tap.
  await page.locator('[data-ds-sec=about]>small').click();
  assert.notEqual(await page.evaluate(()=>getComputedStyle(document.querySelector('[data-ds-sec=about] .v690-policy-card')).display),'none','about opens');
  // Another sheet (goal) is not styled as settings.
  await page.evaluate(()=>{closeSheet();goalPanel()});await page.waitForTimeout(600);
  assert.equal(await page.evaluate(()=>document.getElementById('v5Sheet').classList.contains('ds-settings')),false,'other sheets untouched');
  assert.deepEqual(errors,[]);console.log('  ok',lang,r.order.join('>'));
  await ctx.close();
 }
 await browser.close();server.close();console.log('PASS: settings sheet design');
})().catch(e=>{console.error(e);process.exit(1)});
