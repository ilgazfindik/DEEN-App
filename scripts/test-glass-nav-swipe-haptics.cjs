/* Swipeable Liquid Glass tab bar + haptics. With a stand-in for the native Capacitor Haptics plugin:
   - dragging the glass lens from the first tab to the last opens the last tab, ticks once per tab passed (selection
     haptics) and the lens ends under the new active tab;
   - tapping a tab gives one light impact;
   - with Settings → haptic feedback off, nothing reaches the plugin. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
const IPHONE='Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',userAgent:IPHONE});
 await ctx.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,profile:{name:'QA',companion:'cat'},settings:{language:'tr',onboardingLanguageConfirmed:true,haptic:false},completed:[],mistakes:[]}));
  // Like Capacitor's injected native bridge: no Capacitor.Plugins, only nativePromise by plugin name.
  window.__hap=[];const names={impact:'impact',selectionStart:'selStart',selectionChanged:'sel',selectionEnd:'selEnd'};
  window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>'ios',nativePromise:(plugin,method,a)=>{if(plugin==='Haptics'&&names[method]){window.__hap.push(names[method]+(a&&a.style?':'+a.style:''));return Promise.resolve()}return Promise.reject(new Error('no '+plugin+'.'+method))},addListener:()=>({remove:async()=>{}})}});
 const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(3000);
 const info=await page.evaluate(()=>({glass:document.documentElement.classList.contains('ilnura-glass'),haptic:state.settings.haptic,native:window.DEEN_DS_HAPTIC&&DEEN_DS_HAPTIC.native,lens:!!document.querySelector('.ilnura-glass-lens')}));
 assert.deepEqual(info,{glass:true,haptic:true,native:true,lens:true},'glass mode, haptics switched on once, native plugin, lens: '+JSON.stringify(info));
 const box=async i=>page.evaluate(i=>{const b=document.querySelectorAll('nav.bottomnav .navbtn')[i].getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2}},i);
 // Drag the lens from Öğren (0) to Profil (4, the last tab).
 const a=await box(0),z=await box(4);await page.evaluate(()=>{window.__hap.length=0});
 await page.mouse.move(a.x,a.y);await page.mouse.down();for(let k=1;k<=12;k++){await page.mouse.move(a.x+(z.x-a.x)*k/12,a.y+(k%2));await page.waitForTimeout(30)}
 const mid=await page.evaluate(()=>({drag:document.querySelector('nav.bottomnav').classList.contains('is-dragging'),over:document.querySelector('nav.bottomnav .navbtn.lens-over')?.dataset.screen}));
 await page.mouse.up();await page.waitForTimeout(900);
 const after=await page.evaluate(()=>{const n=document.querySelector('nav.bottomnav'),l=n.querySelector('.ilnura-glass-lens').getBoundingClientRect(),a=n.querySelector('.navbtn.active');const ar=a.getBoundingClientRect();
  return {active:a.dataset.screen,screen:document.querySelector('.screen.active')?.id,lensCentre:Math.round(l.left+l.width/2),activeCentre:Math.round(ar.left+ar.width/2),hap:[...window.__hap]}});
 assert.equal(mid.drag,true,'dragging state while the finger moves');assert.equal(mid.over,'profileScreen','the lens is over Profil before release');
 assert.equal(after.active,'profileScreen','release opens the tab under the lens');assert.equal(after.screen,'profileScreen','profile screen shown');
 assert.ok(Math.abs(after.lensCentre-after.activeCentre)<=3,'lens settles under the active tab');
 assert.equal(after.hap.filter(h=>h==='sel').length,4,'one selection tick per tab passed: '+after.hap);assert.ok(after.hap.includes('selStart')&&after.hap.includes('selEnd'),'selection haptics start/end');
 // Tap Tekrar: one light impact.
 await page.evaluate(()=>{window.__hap.length=0});const t=await box(1);await page.mouse.click(t.x,t.y);await page.waitForTimeout(500);
 const tapH=await page.evaluate(()=>[...window.__hap]);assert.deepEqual(tapH,['impact:LIGHT'],'a tap gives one light impact');
 assert.equal(await page.evaluate(()=>document.querySelector('.screen.active').id),'reviewScreen','tap still opens the tab');
 // Settings switch off: nothing reaches the plugin.
 await page.evaluate(()=>{state.settings.haptic=false;window.__hap.length=0});const p=await box(3);await page.mouse.click(p.x,p.y);await page.waitForTimeout(400);
 assert.deepEqual(await page.evaluate(()=>[...window.__hap]),[],'haptic switch off silences everything');
 // The switch is not forced back on after a reload.
 await page.evaluate(()=>{try{saveState()}catch(_){}});await page.reload();await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2000);
 assert.equal(await page.evaluate(()=>state.settings.haptic),false,'the player’s choice is kept');
 console.log('  ok',JSON.stringify({info,mid,after,tapH}));
 await browser.close();server.close();console.log('PASS: swipeable glass tab bar with haptics and a working haptic switch');
})().catch(e=>{console.error(e);process.exit(1)});
