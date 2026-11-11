/* Daily reminder opt-in/out in the account sheet, against a mocked Supabase + mocked browser push. */
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');const types={'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.txt':'text/plain','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(root,p);fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});r.end(b)})});
(async()=>{await new Promise(r=>srv.listen(0,r));const base='http://localhost:'+srv.address().port+'/';const b=await chromium.launch();
 const ctx=await b.newContext({serviceWorkers:'block'}),pg=await ctx.newPage(),errs=[],calls=[];pg.on('pageerror',e=>errs.push(e.message));
 const H={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*','content-type':'application/json'};
 let rows=[];
 await ctx.route('https://swlipzpxlyzemqxyhdho.supabase.co/**',async rt=>{const rq=rt.request(),u=new URL(rq.url()),m=rq.method();
  if(m==='OPTIONS')return rt.fulfill({status:204,headers:H});
  if(u.pathname==='/auth/v1/settings')return rt.fulfill({status:200,headers:H,body:JSON.stringify({external:{google:true,email:true}})});
  if(u.pathname==='/functions/v1/send-reminders'){calls.push('KEY');return rt.fulfill({status:200,headers:H,body:JSON.stringify({publicKey:'BKfAk9BWql5As9Jr91TPHi6FGdaL04kxV3BS9_U0IPdaJj_CBx-5r7Ln2yM1MyhQHJjMV0mGSBVeyvccWwbo1vY'})})}
  if(u.pathname==='/rest/v1/push_subscriptions'){
   if(m==='GET')return rt.fulfill({status:200,headers:H,body:rows.length?JSON.stringify(rows[0]):'null'});
   if(m==='POST'){const body=JSON.parse(rq.postData());rows=[body];calls.push('UPSERT '+JSON.stringify(body));return rt.fulfill({status:201,headers:H,body:'[]'})}
   if(m==='PATCH'){const body=JSON.parse(rq.postData());Object.assign(rows[0]||{},body);calls.push('PATCH '+JSON.stringify(body));return rt.fulfill({status:204,headers:H,body:''})}
   if(m==='DELETE'){rows=[];calls.push('DELETE');return rt.fulfill({status:204,headers:H,body:''})}
  }
  if(u.pathname==='/rest/v1/progress')return rt.fulfill({status:200,headers:H,body:m==='GET'?'null':'[]'});
  rt.fulfill({status:404,headers:H,body:'{}'})});
 const future=Math.floor(Date.now()/1000)+3600;
 await pg.addInitScript(f=>{if(sessionStorage.getItem('seeded'))return;sessionStorage.setItem('seeded','1');
  localStorage.setItem('deen_app_language_v1','en');
  localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,xp:50,name:'T',completed:[],mistakes:[],settings:{},profile:{name:'T',companion:'owl'}}));
  localStorage.setItem('deen-auth-v2',JSON.stringify({access_token:'a.b.c',refresh_token:'r',token_type:'bearer',expires_in:3600,expires_at:f,user:{id:'u1',email:'a@b.c',aud:'authenticated',app_metadata:{},user_metadata:{},created_at:'2026-01-01'}}));
 },future);
 // Fake browser push (headless Chromium has no push service).
 await pg.addInitScript(()=>{let sub=null;
  const fake={pushManager:{getSubscription:async()=>sub,subscribe:async o=>{window.__appKey=o.applicationServerKey.length;sub={endpoint:'https://push.example/abc',toJSON:()=>({keys:{p256dh:'PKEY',auth:'AKEY'}}),unsubscribe:async()=>{sub=null;return true}};return sub}}};
  Object.defineProperty(navigator.serviceWorker,'ready',{get:()=>Promise.resolve(fake)});
  Notification.requestPermission=async()=>'granted';
 });
 await pg.goto(base,{waitUntil:'load'});await pg.waitForFunction(()=>window.DEEN_ACCOUNT&&window.DEEN_AUTH_GATE,null,{timeout:60000});await pg.waitForTimeout(3000);
 await pg.evaluate(()=>window.DEEN_ACCOUNT.open());await pg.waitForSelector('[data-acc="remOn"]',{timeout:20000});
 await pg.click('[data-acc="remOn"]');await pg.waitForSelector('[data-acc="remOff"]',{timeout:10000});
 const up=calls.find(c=>c.startsWith('UPSERT'));assert(up,'subscription saved');const body=JSON.parse(up.slice(7));
 assert.strictEqual(body.endpoint,'https://push.example/abc');assert.strictEqual(body.p256dh,'PKEY');assert.strictEqual(body.auth,'AKEY');assert.strictEqual(body.hour,19);assert.strictEqual(body.lang,'en');assert.strictEqual(body.user_id,'u1');assert(body.tz&&body.tz.length>1,'time zone stored');
 assert.strictEqual(await pg.evaluate(()=>window.__appKey),65,'VAPID public key decoded to 65 bytes');
 await pg.selectOption('[data-acc-hour]','21');await pg.waitForTimeout(500);
 assert(calls.some(c=>c.startsWith('PATCH')&&JSON.parse(c.slice(6)).hour===21),'hour change saved');
 await pg.click('[data-acc="remOff"]');await pg.waitForSelector('[data-acc="remOn"]',{timeout:10000});
 assert(calls.includes('DELETE'),'subscription removed on turn-off');
 assert.deepStrictEqual(errs,[]);await b.close();srv.close();console.log('Push reminders ok');})().catch(e=>{console.error(e);process.exit(1)});
