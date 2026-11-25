/* Daily reminder in the native app (Capacitor local notifications through notify.js), from the account sheet: no account
   needed, daily reminders at the chosen hour, nothing more today once the player studied, the schedule is refreshed at start.
   The native bridge is stubbed like Capacitor's injected one (nativePromise, no Capacitor.Plugins). */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),__flat=a=>[].concat(...a);
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
 await ctx.addInitScript(()=>{
  window.__ln={calls:[],perm:sessionStorage.getItem('perm')||'prompt'};
  // Like Capacitor's injected native bridge: no Capacitor.Plugins, only nativePromise / addListener by plugin name.
  const LN={checkPermissions:()=>({display:__ln.perm}),requestPermissions:()=>{__ln.calls.push(['perm']);if(__ln.perm==='prompt'){__ln.perm='granted';sessionStorage.setItem('perm','granted')}return {display:__ln.perm}},
   cancel:a=>{__ln.calls.push(['cancel',a.notifications.map(n=>n.id)])},
   schedule:a=>{__ln.calls.push(['schedule',a.notifications.map(n=>({id:n.id,title:n.title,body:n.body,at:new Date(n.schedule.at).toISOString(),h:new Date(n.schedule.at).getHours(),d:new Date(n.schedule.at).getDate(),screen:n.extra&&n.extra.screen}))])}};
  window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>'ios',nativePromise:(pl,m,a)=>pl==='LocalNotifications'&&LN[m]?Promise.resolve(LN[m](a)):Promise.reject(new Error('n/a')),addListener:()=>({remove:async()=>{}})};
  if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:777,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[],streakMeta:{lastStudyDate:null,currentStreak:0,longestStreak:0,streakFreeze:0,weeklyActivity:{},freezeDates:[]}}))}
 });
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const boot=async()=>{await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2500)};
 const sched=()=>page.evaluate(()=>__ln.calls.filter(c=>c[0]==='schedule').map(c=>c[1]));
 const calls=()=>page.evaluate(()=>__ln.calls.map(c=>c[0]));
 const openAcc=async()=>{await page.evaluate(()=>window.DEEN_ACCOUNT.open());await page.waitForSelector('[data-acc-hour]',{timeout:10000})};
 await boot();
 // 1. signed-out player, native app: the reminder block is there
 await openAcc();
 assert.equal(await page.locator('[data-acc=remOn]').count(),1,'reminder switch without an account');
 assert.equal(await page.evaluate(()=>document.querySelector('[data-acc-hour]').value),'19','default 19:00');
 // 2. turn on: permission, the old reminders (3100+) cancelled, daily reminders at 19:00 in Turkish (notify.js plans them)
 await page.locator('[data-acc=remOn]').click();await page.waitForFunction(()=>__ln.calls.some(c=>c[0]==='schedule'),null,{timeout:5000});
 let s=(await sched()).pop();const daily=l=>l.filter(n=>n.id>=4000&&n.screen==='learnScreen'&&!/🔥|🌙|⚡/.test(n.title));
 assert.ok((await calls()).includes('perm'),'permission asked');
 assert.ok(__flat(await page.evaluate(()=>__ln.calls.filter(c=>c[0]==='cancel').map(c=>c[1]))).includes(3100),'old reminders cancelled');
 assert.ok(daily(s).length>=3,'daily reminders, got '+daily(s).length);
 assert.ok(daily(s).every(n=>n.h===19),'all at 19:00');assert.equal(new Set(s.map(n=>n.id)).size,s.length,'unique ids');
 assert.ok(s.some(n=>/Baykuş/.test(n.title+n.body)),'in the companion’s voice');
 assert.equal(await page.locator('[data-acc=remOff]').count(),1,'switch shows "turn off"');
 // 3. change the hour: rescheduled; every hour of the day is offered
 assert.deepEqual(await page.evaluate(()=>[...document.querySelector('[data-acc-hour]').options].map(o=>+o.value)),Array.from({length:24},(_,h)=>h));
 await page.evaluate(()=>{window.__ln.calls.length=0});
 await page.selectOption('[data-acc-hour]','8');await page.waitForFunction(()=>__ln.calls.some(c=>c[0]==='schedule'),null,{timeout:5000});
 s=(await sched()).pop();assert.ok(daily(s).every(n=>n.h===8),'rescheduled at 08:00');
 // 4. the player already studied today: nothing more today
 await page.evaluate(()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');state.streakMeta.lastStudyDate=d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())});
 await page.evaluate(()=>{__ln.calls.length=0;Object.defineProperty(document,'hidden',{get:()=>true,configurable:true});document.dispatchEvent(new Event('visibilitychange'))});
 await page.waitForFunction(()=>__ln.calls.some(c=>c[0]==='schedule'),null,{timeout:5000});
 s=(await sched()).pop();const today=await page.evaluate(()=>new Date().getDate());
 assert.ok(!daily(s).some(n=>n.d===today),'no reminder today after studying');
 await page.evaluate(()=>{delete document.hidden;state.streakMeta.lastStudyDate=null;saveState()});
 // 5. saved choice is applied again when the app opens
 await page.evaluate(()=>{window.__ln.calls.length=0});
 await boot();await page.waitForFunction(()=>__ln.calls.some(c=>c[0]==='schedule'),null,{timeout:8000});
 assert.ok(daily((await sched()).pop()).every(n=>n.h===8),'the saved hour (08:00) is rescheduled at start');
 // 6. turn off
 await openAcc();await page.evaluate(()=>{__ln.calls.length=0});
 await page.locator('[data-acc=remOff]').click();await page.waitForFunction(()=>__ln.calls.some(c=>c[0]==='cancel'),null,{timeout:5000});
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_native_reminder')).on),false);
 // 7. permission denied: a clear message, nothing scheduled
 await page.evaluate(()=>{__ln.perm='denied';__ln.calls.length=0});
 await page.locator('[data-acc=remOn]').click();await page.waitForSelector('.dacc-status',{timeout:5000});
 assert.match(await page.locator('.dacc-status').textContent(),/iPhone Ayarları/);assert.ok(!(await calls()).includes('schedule'));
 assert.deepEqual(errors,[]);
 await browser.close();server.close();
 console.log('PASS: native daily reminder (local notifications)');
})().catch(e=>{console.error(e);process.exit(1)});
