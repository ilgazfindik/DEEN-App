/* First run goes straight into the game; the account offer appears only after a first lesson. Real browser, mocked Supabase. */
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');const types={'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.txt':'text/plain','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(root,p);fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});r.end(b)})});
const H={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*','content-type':'application/json'};
async function open(base,b,init){
 const ctx=await b.newContext({serviceWorkers:'block',viewport:{width:390,height:844}}),pg=await ctx.newPage(),errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await ctx.route('https://swlipzpxlyzemqxyhdho.supabase.co/**',rt=>{const m=rt.request().method(),u=new URL(rt.request().url());
  if(m==='OPTIONS')return rt.fulfill({status:204,headers:H});
  if(u.pathname==='/auth/v1/settings')return rt.fulfill({status:200,headers:H,body:JSON.stringify({external:{google:true,email:true}})});
  rt.fulfill({status:u.pathname.startsWith('/rest')?200:404,headers:H,body:u.pathname.startsWith('/rest')?'null':'{}'})});
 await pg.addInitScript(i=>{if(sessionStorage.getItem('s'))return;sessionStorage.setItem('s','1');localStorage.setItem('deen_app_language_v1','en');for(const [k,v] of Object.entries(i))localStorage.setItem(k,v)},init);
 await pg.goto(base,{waitUntil:'load'});return {ctx,pg,errs};
}
const played=JSON.stringify({onboarded:true,xp:60,name:'T',completed:[],mistakes:[],settings:{},profile:{name:'T',companion:'owl'},history:[{id:'U01-M01',at:Date.now()}]});
const fresh=JSON.stringify({onboarded:true,xp:0,name:'T',completed:[],mistakes:[],settings:{},profile:{name:'T',companion:'owl'}});
(async()=>{await new Promise(r=>srv.listen(0,r));const base='http://localhost:'+srv.address().port+'/';const b=await chromium.launch();
 // 1) brand-new visitor: no sign-in wall; onboarding starts with the name step
 let a=await open(base,b,{});
 await a.pg.waitForSelector('#v998Onboarding',{timeout:60000});await a.pg.waitForTimeout(1500);
 assert.strictEqual(await a.pg.locator('#deenAccountGate').count(),0,'no account wall on first run');
 assert(await a.pg.locator('#v998Onboarding input').count()>0,'first run starts at the name step');
 await a.ctx.close();
 // 2) learner who has not played yet: no offer
 a=await open(base,b,{deen_v4_1_state:fresh});
 await a.pg.waitForSelector('#v5Return .v680-nba',{timeout:60000});await a.pg.waitForTimeout(3500);
 assert.strictEqual(await a.pg.locator('#dsSaveCard').count(),0,'no offer before a first lesson');
 await a.ctx.close();
 // 3) after a first lesson: the offer appears; "Create account" opens the sign-in screen with the enabled providers
 a=await open(base,b,{deen_v4_1_state:played});
 await a.pg.waitForSelector('#dsSaveCard',{timeout:60000});
 assert(/progress/i.test(await a.pg.textContent('#dsSaveCard')),'offer text');
 assert.strictEqual(await a.pg.evaluate(()=>document.getElementById('dsSaveCard').nextElementSibling?.id),'v5Return','offer sits above the next-step card');
 await a.pg.click('#dsSaveCard [data-acc="signin"]');await a.pg.waitForSelector('#deenAccountGate .da-provider',{timeout:15000});
 await a.pg.waitForSelector('#deenAccountGate .da-google',{timeout:10000});
 assert(/guest/i.test(await a.pg.textContent('#deenAccountGate')),'guest wording');
 assert(!/not enabled yet/i.test(await a.pg.textContent('#deenAccountGate')),'no stale "cloud sync not enabled" text');
 await a.ctx.close();
 // 4) "Not now" hides it and it stays hidden
 a=await open(base,b,{deen_v4_1_state:played});
 await a.pg.waitForSelector('#dsSaveCard',{timeout:60000});await a.pg.click('#dsSaveCard [data-acc="saveLater"]');
 await a.pg.waitForTimeout(2600);assert.strictEqual(await a.pg.locator('#dsSaveCard').count(),0,'dismissed');
 assert(await a.pg.evaluate(()=>JSON.parse(localStorage.getItem('deen_save_card')).n===1),'dismissal remembered');
 await a.ctx.close();
 // 5) already signed in: never offered
 const future=Math.floor(Date.now()/1000)+3600;
 a=await open(base,b,{deen_v4_1_state:played,'deen-auth-v2':JSON.stringify({access_token:'a.b.c',refresh_token:'r',token_type:'bearer',expires_in:3600,expires_at:future,user:{id:'u1',email:'a@b.c',aud:'authenticated',app_metadata:{},user_metadata:{},created_at:'2026-01-01'}})});
 await a.pg.waitForSelector('#v5Return .v680-nba',{timeout:60000});await a.pg.waitForTimeout(3500);
 assert.strictEqual(await a.pg.locator('#dsSaveCard').count(),0,'no offer for signed-in learners');
 await a.ctx.close();
 await b.close();srv.close();console.log('First run and save-progress offer ok');})().catch(e=>{console.error(e);process.exit(1)});
