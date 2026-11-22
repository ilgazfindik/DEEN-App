/* Native iOS tab bar bridge (assets/design/home.js ↔ ios/App/App/NativeTabBar.swift), with a stand-in for the native
   plugin: on iOS 26+ the web asks for the native bar with the four tabs, hides its own bar (kept as the router), opens
   the screen of a native selection (with the light haptic tap), mirrors web-side screen changes to the native bar, and
   hides the native bar while something covers the tab bar (a sheet, a lesson). Without the shell nothing changes. */
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
 await ctx.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,profile:{name:'QA',companion:'cat'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}));
  window.__nt={calls:[],listeners:{}};window.__hap=[];const log=(n,a)=>{__nt.calls.push([n,a]);};
  window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>'ios',Plugins:{
   Haptics:{impact:a=>{__hap.push('impact:'+(a&&a.style));return Promise.resolve()},selectionStart:()=>Promise.resolve(),selectionChanged:()=>Promise.resolve(),selectionEnd:()=>Promise.resolve()},
   NativeTabBar:{isAvailable:()=>Promise.resolve({available:true}),show:a=>{log('show',a);return Promise.resolve({shown:true,height:83})},select:a=>{log('select',a);return Promise.resolve()},
    setHidden:a=>{log('hidden',a.hidden);return Promise.resolve()},addListener:(n,cb)=>{__nt.listeners[n]=cb;return Promise.resolve({remove(){}})}}}}});
 const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});
 await page.waitForFunction(()=>!document.getElementById('ilnura-veil'),null,{timeout:30000});await page.waitForTimeout(1500);
 const lastHidden=()=>page.evaluate(()=>{const h=__nt.calls.filter(c=>c[0]==='hidden');return h.length?h[h.length-1][1]:null});
 const s1=await page.evaluate(()=>{const show=__nt.calls.filter(c=>c[0]==='show');const a=show[show.length-1]&&show[show.length-1][1];
  return {cls:document.documentElement.classList.contains('native-tabbar'),shows:show.length,tabs:a&&a.tabs.map(t=>t.id+':'+t.title+':'+t.icon),selected:a&&a.selected,tint:a&&a.tint,webNavOpacity:getComputedStyle(document.querySelector('nav.bottomnav')).opacity,h:getComputedStyle(document.documentElement).getPropertyValue('--native-tabbar-h').trim()}});
 assert.equal(s1.cls,true,'native tab bar mode');assert.equal(s1.shows,1,'shown once');
 assert.deepEqual(s1.tabs,['learnScreen:Öğren:book','reviewScreen:Tekrar:arrow.clockwise.circle','leagueScreen:Kur’an:text.book.closed','profileScreen:Profil:person'],'four tabs with titles and SF Symbols');
 assert.equal(s1.selected,'learnScreen');assert.equal(s1.tint,'#f2cf84');assert.equal(s1.webNavOpacity,'0','web bar not drawn');assert.equal(s1.h,'83px','native bar height passed to CSS');
 assert.equal(await lastHidden(),false,'native bar visible on the home screen');
 // Native selection → web screen + haptic.
 await page.evaluate(()=>{__hap.length=0;__nt.listeners.tabSelected({id:'profileScreen'})});await page.waitForTimeout(800);
 const s2=await page.evaluate(()=>({screen:document.querySelector('.screen.active').id,hap:[...__hap]}));
 assert.equal(s2.screen,'profileScreen','native selection opens the screen');assert.deepEqual(s2.hap,['impact:LIGHT'],'light haptic tap');
 // Web-side change → native select.
 await page.evaluate(()=>{__nt.calls.length=0;navigate('reviewScreen')});await page.waitForTimeout(600);
 assert.ok(await page.evaluate(()=>__nt.calls.some(c=>c[0]==='select'&&c[1].id==='reviewScreen')),'web screen change selects the native tab');
 // A sheet covers the bar → hidden; closed → shown again.
 await page.evaluate(()=>settingsPanel());await page.waitForTimeout(900);assert.equal(await lastHidden(),true,'hidden under a sheet');
 await page.evaluate(()=>closeSheet());await page.waitForTimeout(900);assert.equal(await lastHidden(),false,'back after the sheet closes');
 // A lesson covers the bar → hidden.
 await page.evaluate(()=>{navigate('learnScreen');state.energy=30;startStage(STAGES[0].id)});await page.waitForTimeout(1500);
 assert.equal(await lastHidden(),true,'hidden during a lesson');
 console.log('  ok',JSON.stringify({s1,s2}));
 await ctx.close();
 // Outside the iOS shell nothing changes.
 const ctx2=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',userAgent:IPHONE});
 await ctx2.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,profile:{name:'QA',companion:'cat'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[]}))});
 const p2=await ctx2.newPage();await p2.goto(url);await p2.waitForSelector('.navbtn',{timeout:90000});await p2.waitForTimeout(2000);
 const web=await p2.evaluate(()=>({cls:document.documentElement.classList.contains('native-tabbar'),op:getComputedStyle(document.querySelector('nav.bottomnav')).opacity}));
 assert.deepEqual(web,{cls:false,op:'1'},'web build keeps its own bar');console.log('  ok web',JSON.stringify(web));
 await browser.close();server.close();console.log('PASS: native iOS tab bar bridge');
})().catch(e=>{console.error(e);process.exit(1)});
