/* Notifications (assets/design/notify.js) with a stand-in for Capacitor's native bridge (LocalNotifications through
   nativePromise/addListener, as in the real app):
   - the plan: daily reminder at the chosen or usual hour, streak rescue at 21:00, gift, energy full, weekly summary on Sunday;
     at most 2 a day at any hour (no quiet hours), thinning out on days the app is not opened, unique ids under iOS's 64 limit,
     nothing today once today's lesson is done, messages in the learner's language with the companion's name;
   - the native flow: the old 3100+ reminders are cancelled, the Settings toggle asks permission and schedules, a denied
     permission explains itself, the soft question after the second lesson, a tap opens its screen;
   - the web build: nothing is added. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
const IPHONE='Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
function seed(native,perm){
 return ([native,perm])=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,profile:{name:'QA',companion:'cat'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[],history:[]}));
  if(!native)return;
  window.__ln={perm,scheduled:[],cancelled:[],requests:0,listeners:{}};
  const impl={LocalNotifications:{checkPermissions:()=>({display:__ln.perm}),requestPermissions:()=>{__ln.requests++;if(__ln.perm==='prompt')__ln.perm=__ln.grant||'granted';return {display:__ln.perm}},
   schedule:a=>{__ln.scheduled=a.notifications;return {notifications:a.notifications.map(n=>({id:n.id}))}},cancel:a=>{__ln.cancelled.push(a.notifications.map(n=>n.id))},getPending:()=>({notifications:__ln.scheduled})},
   Haptics:{impact:()=>{},selectionStart:()=>{},selectionChanged:()=>{},selectionEnd:()=>{}},NativeTabBar:{isAvailable:()=>({available:false})}};
  window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>'ios',
   nativePromise:(plugin,method,args)=>{const f=impl[plugin]&&impl[plugin][method];return f?Promise.resolve(f(args)):Promise.reject(new Error('not implemented '+plugin+'.'+method))},
   addListener:(plugin,event,cb)=>{if(plugin==='LocalNotifications')__ln.listeners[event]=cb;return {remove:async()=>{}}}};
 };
}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const open=async(native,perm)=>{const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',userAgent:IPHONE,timezoneId:'Europe/Istanbul'});
  await ctx.addInitScript(seed(),[native,perm]);const page=await ctx.newPage();page.on('pageerror',e=>console.error('pageerror',e.message));
  await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForFunction(()=>!document.getElementById('ilnura-veil'),null,{timeout:30000});await page.waitForTimeout(1800);return {ctx,page}};

 // ---- 1. The plan ----
 let {ctx,page}=await open(true,'prompt');
 const r=await page.evaluate(()=>{
  const N=DEEN_NOTIFY,now=new Date(2026,10,23,10,0).getTime(),D=864e5; // Monday 23 Nov 2026, 10:00
  const on=(o)=>Object.assign({on:true,hour:19,smart:false,types:{daily:true,rescue:true,gift:true,energy:true,weekly:true},asks:[]},o||{});
  const st=(o)=>Object.assign({profile:{companion:'cat'},energy:30,history:[],streakMeta:{currentStreak:5,lastStudyDate:'2026-11-22'},marketMeta:{}},o||{});
  const sum=l=>l.map(x=>{const d=new Date(x.at);return x.kind+'@'+d.getDate()+'T'+d.getHours()+':'+String(d.getMinutes()).padStart(2,'0')});
  const perDay=l=>{const m={};l.forEach(x=>{const k=new Date(x.at).toDateString();m[k]=(m[k]||0)+1});return Math.max(0,...Object.values(m))};
  const a=N.plan(now,st(),on(),'tr');
  const b=N.plan(now,st({streakMeta:{currentStreak:5,lastStudyDate:'2026-11-23'}}),on(),'tr');
  const c=N.plan(now,st({history:[0,1,2,3,4].map(i=>({at:new Date(2026,10,18+i,7,10).getTime(),xp:20}))}),on({smart:true}),'en');
  const d=N.plan(now,st({energy:10,lastEnergyAt:now,streakMeta:{}}),on(),'tr');const d2=N.plan(now,st({energy:10,lastEnergyAt:now}),on(),'tr');
  const e=N.plan(now,st(),on({hour:20}),'tr');
  const f=N.plan(now,st(),on({on:false}),'tr');
  const g=N.plan(now,st({history:[{at:now-D,xp:40},{at:now-2*D,xp:30}]}),on(),'de');
  const off=N.plan(now,st(),on({types:{daily:false,rescue:true,gift:false,energy:true,weekly:false}}),'tr');
  return {a:sum(a),aIds:a.map(x=>x.id),aMax:perDay(a),late:sum(N.plan(now,st(),on({hour:23}),'tr')).filter(x=>x.startsWith('daily@23T')),early:sum(N.plan(now,st(),on({hour:6}),'tr')).filter(x=>x.startsWith('daily@24T')),aLen:a.length,aRescue:a.find(x=>x.kind==='rescue'),aDaily:a.find(x=>x.kind==='daily'),aGift:a.find(x=>x.kind==='gift'),
   b:sum(b),c:sum(c).slice(0,3),cTitle:c[0]&&c[0].title,d:sum(d).filter(x=>x.startsWith('energy')),d2:sum(d2).filter(x=>x.startsWith('energy')),e:sum(e).filter(x=>x.endsWith('T20:00')||x.includes('@23T')),f:f.length,gWeekly:g.find(x=>x.kind==='weekly'),off:[...new Set(off.map(x=>x.kind))]};
 });
 // Monday 23rd, not studied yet, 5-day streak: today 19:00 daily + 21:00 rescue (the gift at 09:00 has passed).
 assert.deepEqual(r.a.filter(x=>x.includes('@23T')),['daily@23T19:00','rescue@23T21:00'],'today: daily and rescue');
 assert.deepEqual(r.a.filter(x=>x.includes('@24T')),['gift@24T9:00','daily@24T19:00'],'tomorrow: gift and daily');
 assert.equal(r.aMax,2,'at most 2 a day');assert.deepEqual(r.late,['daily@23T23:00'],'a late hour is kept (23:00)');assert.deepEqual(r.early,['daily@24T6:00'],'an early hour is kept (06:00)');assert.ok(r.aLen<=64,'under the iOS limit');
 assert.equal(new Set(r.aIds).size,r.aIds.length,'unique ids');assert.ok(r.aIds.every(i=>i>=4000&&i<4100),'ids 4000+');
 // Away days (not opened since): 26th (day 3) and 28th (day 5) daily, 30th (day 7) and 6 Dec (day 13) a gentle note,
 // Sunday 29th the weekly summary; 27th and 1–5 Dec silent.
 assert.deepEqual(r.a.filter(x=>/@(2[5-9]|30)T/.test(x)),['gift@25T9:00','daily@25T19:00','daily@26T19:00','daily@28T19:00','weekly@29T19:30','miss@30T19:00'],'thinning out');
 assert.equal(r.a.filter(x=>/@[1-5]T/.test(x)).length,0,'silent 1–5 Dec');assert.ok(r.a.includes('miss@6T19:00'),'a note after two weeks');
 assert.match(r.aRescue.title,/^5 günlük serin bu gece bitiyor/,'rescue names the streak');assert.match(r.aRescue.body,/Kedi/,'rescue in the companion’s voice');
 assert.deepEqual(r.aDaily.extra,{screen:'learnScreen'});assert.deepEqual(r.aGift.extra,{screen:'marketScreen'},'gift opens the shop');
 // Studied today: nothing more today, the rescue moves to tomorrow night.
 assert.equal(r.b.filter(x=>x.includes('@23T')).length,0,'nothing today after today’s lesson');assert.ok(r.b.includes('rescue@24T21:00'),'tomorrow’s rescue');
 // Smart time: lessons around 07:10 → 07:00 (any hour is allowed); English text.
 assert.ok(r.c.some(x=>x.endsWith('T7:00')&&x.startsWith('daily')),'smart time at 07:00: '+r.c);assert.match(r.cTitle,/Cat|streak|ready|step|learn/,'English text');
 // Energy 10/30 with the clock at now: full in 100 minutes.
 assert.deepEqual(r.d,['energy@23T11:40'],'energy full');assert.deepEqual(r.d2,[],'not on a day that already has 2');
 // A daily reminder close to the rescue is dropped (the rescue says it).
 assert.ok(!r.e.includes('daily@23T20:00'),'no daily 1 hour before the rescue');
 assert.equal(r.f,0,'off: nothing');assert.match(r.gWeekly.body,/2 Tagen.*70 XP/,'weekly summary counts days and XP (German)');
 assert.ok(!r.off.includes('daily')&&!r.off.includes('gift')&&!r.off.includes('weekly'),'switched-off kinds are left out');
 console.log('  ok plan',JSON.stringify(r.a.slice(0,8)));

 // ---- 2. Native flow ----
 const legacy=await page.evaluate(()=>__ln.cancelled.some(l=>l.includes(3100)&&l.includes(3107)));assert.ok(legacy,'old 3100+ reminders cancelled');
 assert.equal(await page.evaluate(()=>__ln.scheduled.length),0,'nothing before permission');
 // Settings group → toggle on → permission asked → scheduled.
 await page.evaluate(()=>settingsPanel());await page.waitForSelector('.ds-ntf-settings',{timeout:5000});
 assert.equal(await page.isVisible('.ds-ntf-more'),false,'details hidden while off');
 await page.click('.ds-ntf-settings [data-n="on"]');await page.waitForTimeout(800);
 const s=await page.evaluate(()=>({req:__ln.requests,n:__ln.scheduled.length,more:!document.querySelector('.ds-ntf-more').hidden,cfg:DEEN_NOTIFY.cfg(),first:__ln.scheduled[0]}));
 assert.equal(s.req,1,'permission asked');assert.ok(s.n>3,'scheduled '+s.n);assert.equal(s.more,true,'details shown');assert.equal(s.cfg.on,true);
 assert.ok(s.first.schedule&&s.first.schedule.at&&s.first.extra&&s.first.extra.screen,'native payload: at + screen');
 await page.click('.ds-ntf-settings [data-n="t:gift"]');await page.waitForTimeout(600);
 assert.equal(await page.evaluate(()=>__ln.scheduled.some(n=>n.extra.screen==='marketScreen')),false,'gift switched off → not scheduled');
 await page.evaluate(()=>closeSheet());await page.waitForTimeout(500);
 // A tap on a notification opens its screen.
 await page.evaluate(()=>__ln.listeners.localNotificationActionPerformed({actionId:'tap',notification:{id:4001,extra:{screen:'marketScreen'}}}));await page.waitForTimeout(900);
 assert.equal(await page.evaluate(()=>document.querySelector('.screen.active').id),'marketScreen','tap opens the shop');
 await page.evaluate(()=>navigate('learnScreen'));
 // Finishing today's lesson: today's reminders go away when it plans again.
 await page.evaluate(async()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');state.streakMeta={...(state.streakMeta||{}),currentStreak:3,lastStudyDate:d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())};await DEEN_NOTIFY.reschedule()});
 assert.equal(await page.evaluate(()=>{const t=new Date().toDateString();return __ln.scheduled.filter(n=>new Date(n.schedule.at).toDateString()===t&&n.extra.screen==='learnScreen'&&!/⚡/.test(n.title)).length}),0,'no learning reminder later today');
 // Off → everything cancelled, nothing scheduled.
 await page.evaluate(()=>DEEN_NOTIFY.disable());assert.equal(await page.evaluate(()=>DEEN_NOTIFY.last().length),0);
 await ctx.close();

 // ---- 3. Soft question after the second lesson ----
 ({ctx,page}=await open(true,'prompt'));
 await page.evaluate(()=>{state.history=[{at:Date.now()-3e5,xp:20},{at:Date.now()-6e4,xp:20}];saveState()});
 await page.evaluate(()=>DEEN_NOTIFY.maybeAsk());await page.waitForSelector('.ds-ntf-ask.in',{timeout:3000});
 const ask=await page.evaluate(()=>({h:document.querySelector('.ds-ntf-ask h3').textContent,img:document.querySelector('.ds-ntf-ask img').getAttribute('src')}));
 assert.equal(ask.h,'Seni hatırlatayım mı?');assert.match(ask.img,/cat_avatar/,'the companion asks');
 fs.mkdirSync(path.join(root,'qa'),{recursive:true});await page.screenshot({path:path.join(root,'qa','notify-ask.png')});
 await page.click('.ds-ntf-yes');await page.waitForTimeout(900);
 const after=await page.evaluate(()=>({req:__ln.requests,n:__ln.scheduled.length,on:DEEN_NOTIFY.cfg().on,gone:!document.querySelector('.ds-ntf-ask')}));
 assert.deepEqual([after.req>0,after.n>0,after.on,after.gone],[true,true,true,true],'yes → permission and schedule');
 // Already on → not asked again; twice at most and a week apart.
 await page.evaluate(()=>DEEN_NOTIFY.maybeAsk());await page.waitForTimeout(400);assert.equal(await page.$('.ds-ntf-ask'),null,'not asked when on');
 await page.evaluate(()=>{DEEN_NOTIFY.disable();const c=JSON.parse(localStorage.getItem('deen_native_reminder'));c.asks=[Date.now()-1e3];localStorage.setItem('deen_native_reminder',JSON.stringify(c))});
 await page.evaluate(()=>DEEN_NOTIFY.maybeAsk());await page.waitForTimeout(400);assert.equal(await page.$('.ds-ntf-ask'),null,'not again within a week');
 await page.screenshot({path:path.join(root,'qa','notify-home.png')});
 await page.evaluate(()=>settingsPanel());await page.waitForSelector('.ds-ntf-settings');await page.click('.ds-ntf-settings [data-n="on"]');await page.waitForTimeout(700);
 await page.evaluate(()=>document.querySelector('.ds-ntf-settings').scrollIntoView({block:'start'}));await page.waitForTimeout(300);
 await page.screenshot({path:path.join(root,'qa','notify-settings.png')});
 await ctx.close();

 // ---- 4. Denied permission ----
 ({ctx,page}=await open(true,'denied'));
 await page.evaluate(()=>settingsPanel());await page.waitForSelector('.ds-ntf-settings');await page.click('.ds-ntf-settings [data-n="on"]');await page.waitForTimeout(700);
 const den=await page.evaluate(()=>({checked:document.querySelector('.ds-ntf-settings [data-n="on"]').checked,msg:document.querySelector('.ds-ntf-msg').hidden?'':document.querySelector('.ds-ntf-msg').textContent,n:__ln.scheduled.length}));
 assert.equal(den.checked,false);assert.match(den.msg,/Ayarları/,'explains where to turn it on');assert.equal(den.n,0);
 await page.evaluate(()=>{closeSheet();state.history=[{at:1},{at:2}]});await page.evaluate(()=>DEEN_NOTIFY.maybeAsk());await page.waitForTimeout(300);
 assert.equal(await page.$('.ds-ntf-ask'),null,'no soft question when iOS already said no');
 await ctx.close();

 // ---- 5. Web build ----
 ({ctx,page}=await open(false));
 await page.evaluate(()=>settingsPanel());await page.waitForTimeout(900);
 assert.deepEqual(await page.evaluate(()=>({sup:DEEN_NOTIFY.supported(),group:!!document.querySelector('.ds-ntf-settings')})),{sup:false,group:false},'web: nothing added');
 await ctx.close();
 await browser.close();server.close();console.log('PASS: notifications');
})().catch(e=>{console.error(e);process.exit(1)});
