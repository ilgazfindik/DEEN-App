/* Widgets (iPhone app): the web app hands the learner's progress to the native WidgetBridge (ios/App/App/WidgetBridge.swift),
   which stores it for the widget extension (ios/App/IlnuraWidget). With a stand-in for Capacitor's native bridge:
   the snapshot carries exactly the fields WidgetSnapshot decodes, is sent at start, again only when it changed (going to
   the background, finishing a lesson), and nothing happens on the web. Also checks the Xcode project wires the widget. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
const IPHONE='Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
// The Swift side: the fields WidgetSnapshot decodes, the plugin name, the project wiring.
const swift=fs.readFileSync(path.join(root,'ios/App/Shared/WidgetStore.swift'),'utf8');
const FIELDS=[...swift.matchAll(/forKey: \.(\w+)\)/g)].map(m=>m[1]).sort();
assert.ok(/jsName = "DeenWidget"/.test(fs.readFileSync(path.join(root,'ios/App/App/WidgetBridge.swift'),'utf8')),'plugin name');
assert.ok(/registerPluginInstance\(WidgetBridgePlugin\(\)\)/.test(fs.readFileSync(path.join(root,'ios/App/App/NativeTabBar.swift'),'utf8')),'plugin registered');
const pbx=fs.readFileSync(path.join(root,'ios/App/App.xcodeproj/project.pbxproj'),'utf8');
for(const s of ['IlnuraWidgetExtension.appex in Embed Foundation Extensions','dstSubfolderSpec = 13','com.apple.product-type.app-extension','PRODUCT_BUNDLE_IDENTIFIER = com.ilgazfindik.ilnura.widget','PROVISIONING_PROFILE_SPECIFIER = "Ilnura Widget App Store (CI)"','CODE_SIGN_ENTITLEMENTS = App/App.entitlements','CODE_SIGN_ENTITLEMENTS = IlnuraWidget/IlnuraWidget.entitlements','WidgetStore.swift in Sources'])assert.ok(pbx.includes(s),'project: '+s);
assert.equal((pbx.match(/WidgetStore\.swift in Sources \*\/,/g)||[]).length,2,'the shared store is compiled into the app and the widget');
for(const f of ['ios/App/App/App.entitlements','ios/App/IlnuraWidget/IlnuraWidget.entitlements'])assert.ok(fs.readFileSync(path.join(root,f),'utf8').includes('$(AppIdentifierPrefix)com.ilgazfindik.ilnura.shared'),'same keychain group: '+f);
for(const a of ['lion','cat','wolf','owl','turtle','eagle'])assert.ok(fs.existsSync(path.join(root,`ios/App/IlnuraWidget/Assets.xcassets/pet_${a}.imageset/pet_${a}.png`)),'widget picture '+a);
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const open=async native=>{const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',userAgent:IPHONE});
  await ctx.addInitScript(native=>{const d=new Date(Date.now()-864e5),p=n=>String(n).padStart(2,'0'),y=d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());
   localStorage.setItem('deen_app_language_v1','de');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,dailyGoal:2,profile:{name:'QA',companion:'wolf'},settings:{language:'de',onboardingLanguageConfirmed:true},completed:[],mistakes:[],history:[{date:y,at:d.getTime(),xp:20}],streakMeta:{currentStreak:4,lastStudyDate:y,longestStreak:4,streakFreeze:0,weeklyActivity:{},freezeDates:[]}}));
   if(!native)return;window.__w=[];
   const impl={DeenWidget:{update:a=>{__w.push(JSON.parse(a.json));return {saved:true,changed:true}}},LocalNotifications:{checkPermissions:()=>({display:'prompt'}),cancel:()=>{}},Haptics:{impact:()=>{}},NativeTabBar:{isAvailable:()=>({available:false})}};
   window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>'ios',nativePromise:(pl,m,a)=>{const f=impl[pl]&&impl[pl][m];return f?Promise.resolve(f(a)):Promise.reject(new Error('n/a'))},addListener:()=>({remove:async()=>{}})};
  },native);
  const page=await ctx.newPage();page.on('pageerror',e=>console.error('pageerror',e.message));await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2800);return {ctx,page}};
 let {ctx,page}=await open(true);
 let w=await page.evaluate(()=>__w);
 assert.equal(w.length,1,'sent once at start');
 const s=w[0];assert.deepEqual(Object.keys(s).sort(),FIELDS,'exactly the fields WidgetSnapshot decodes');
 assert.equal(s.streak,4);assert.equal(s.companion,'wolf');assert.equal(s.lang,'de');assert.equal(s.goal,2);assert.equal(s.xp,420);
 assert.match(s.lastStudy,/^\d{4}-\d\d-\d\d$/);assert.ok(s.studied.includes(s.lastStudy),'yesterday among the studied days');assert.equal(s.todayLessons,0);
 // Background without a change: nothing new. After a lesson today: sent again.
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{get:()=>true,configurable:true});document.dispatchEvent(new Event('visibilitychange'))});await page.waitForTimeout(300);
 assert.equal(await page.evaluate(()=>__w.length),1,'unchanged snapshot is not sent again');
 await page.evaluate(()=>{delete document.hidden;const d=new Date(),p=n=>String(n).padStart(2,'0'),t=d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());
  state.history.push({date:t,at:Date.now(),xp:30});state.streakMeta.currentStreak=5;state.streakMeta.lastStudyDate=t;document.getElementById('resultView').classList.add('show')});
 await page.waitForTimeout(900);
 w=await page.evaluate(()=>__w);assert.equal(w.length,2,'sent after the lesson');
 assert.equal(w[1].streak,5);assert.equal(w[1].lastStudy,w[1].todayKey,'today done');assert.ok(w[1].todayLessons>=1,'today’s lesson counted');
 console.log('  ok native',JSON.stringify(w[1]));
 await ctx.close();
 ({ctx,page}=await open(false));
 assert.equal(await page.evaluate(()=>typeof window.__w),'undefined');assert.equal(await page.evaluate(()=>DEEN_WIDGET.version),'widget-1');
 await ctx.close();await browser.close();server.close();console.log('PASS: widget bridge');
})().catch(e=>{console.error(e);process.exit(1)});
