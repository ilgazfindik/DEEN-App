const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');const assert=require('assert');
const root=path.resolve(__dirname,'..');const types={'.js':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.txt':'text/plain','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(root,p);fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});r.end(b)})});
(async()=>{await new Promise(r=>srv.listen(0,r));const port=srv.address().port,base='http://localhost:'+port+'/';
const b=await chromium.launch();const ctx=await b.newContext({serviceWorkers:'block'});const pg=await ctx.newPage();
const calls=[];let row=null;
await ctx.route('https://swlipzpxlyzemqxyhdho.supabase.co/**',async rt=>{const u=new URL(rt.request().url()),m=rt.request().method();calls.push(m+' '+u.pathname);
 const h={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*','content-type':'application/json'};
 if(m==='OPTIONS')return rt.fulfill({status:204,headers:h});
 if(u.pathname==='/auth/v1/settings')return rt.fulfill({status:200,headers:h,body:JSON.stringify({external:{google:true,apple:false,email:true}})});
 if(u.pathname==='/rest/v1/progress'){if(m==='GET')return rt.fulfill({status:200,headers:h,body:row?JSON.stringify(row):'null'});
   const body=JSON.parse(rt.request().postData()||'{}');row={data:body.data,revision:1,updated_at:new Date().toISOString()};return rt.fulfill({status:201,headers:h,body:JSON.stringify(row)})}
 if(u.pathname==='/auth/v1/user')return rt.fulfill({status:200,headers:h,body:JSON.stringify({id:'u1',email:'a@b.c'})});
 rt.fulfill({status:404,headers:h,body:'{}'})});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
// 1) fresh guest: gate shows only enabled providers
await pg.addInitScript(()=>{try{if(!localStorage.getItem('deen_app_language_v1'))localStorage.setItem('deen_app_language_v1','en')}catch(_){}});
await pg.goto(base+'?previewAccount=1',{waitUntil:'load'});
await pg.waitForFunction(()=>window.DEEN_ACCOUNT&&window.DEEN_AUTH_GATE,null,{timeout:60000});
await pg.evaluate(()=>window.DEEN_AUTH_GATE.show());await pg.waitForSelector('#deenAccountGate .da-provider',{timeout:15000});await pg.waitForTimeout(800);
const provs=await pg.$$eval('#deenAccountGate .da-provider',a=>a.map(x=>x.className.replace('da-provider ','')));

const future=Math.floor(Date.now()/1000)+3600;
await pg.addInitScript(f=>{if(sessionStorage.getItem('seeded'))return;sessionStorage.setItem('seeded','1');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,xp:50,name:'T',completed:[],mistakes:[],settings:{}}));localStorage.setItem('deen-auth-v2',JSON.stringify({access_token:'a.b.c',refresh_token:'r',token_type:'bearer',expires_in:3600,expires_at:f,user:{id:'u1',email:'a@b.c',aud:'authenticated',app_metadata:{},user_metadata:{},created_at:'2026-01-01'}}))},future);
calls.length=0;await pg.goto(base,{waitUntil:'load'});for(let i=0;i<120&&!row;i++)await pg.waitForTimeout(500);
const sync1=row&&JSON.parse(row.data.deen_v4_1_state).xp;
// conflict: cloud row from another device with different progress; local has meta mismatch
const cur=await pg.evaluate(()=>JSON.parse(localStorage.getItem('deen_v4_1_state')));cur.xp=999;row={data:{deen_v4_1_state:JSON.stringify(cur)},revision:7,updated_at:new Date().toISOString()};
await pg.evaluate(()=>{localStorage.setItem('deen_cloud_meta',JSON.stringify({uid:'u1',revision:3,at:1}))});
await pg.evaluate(()=>window.DEEN_ACCOUNT.onSignedIn());await pg.waitForSelector('[data-acc="useCloud"]',{timeout:30000}).catch(()=>{});
const shown=await pg.evaluate(()=>!!document.querySelector('[data-acc="useCloud"]'));
await pg.click('[data-acc="useCloud"]');await pg.waitForNavigation({timeout:15000}).catch(()=>null);
await pg.waitForTimeout(1500);
const xpNow=await pg.evaluate(()=>JSON.parse(localStorage.getItem('deen_v4_1_state')).xp),bk=await pg.evaluate(()=>!!localStorage.getItem('deen_cloud_backup'));
await b.close();srv.close();
assert.deepStrictEqual(provs,['da-google','da-email'],'only enabled providers shown');
assert(!calls.some(c=>/auth\/v1\/(token|signup)/.test(c)),'no sign-in call without user action');
assert(row&&sync1===50,'first sign-in uploads local progress');
assert(shown,'conflict sheet shown');assert.strictEqual(xpNow,999,'cloud choice applied and kept after reload');assert(bk,'local copy kept as backup');
assert.deepStrictEqual(errs,[]);console.log('Account sync ok');})().catch(e=>{console.error(e);process.exit(1)});
