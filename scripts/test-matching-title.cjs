/* The matching screen's heading ("Eşleşen çiftleri bul", written as three nodes) is localised as one phrase. */
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');const types={'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.txt':'text/plain','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(root,p);fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});r.end(b)})});
const WANT={en:'Find the matching pairs',de:'Finde die passenden Paare',fr:'Trouve les paires assorties',ar:'ابحث عن الأزواج المتطابقة'};
(async()=>{await new Promise(r=>srv.listen(0,r));const base='http://localhost:'+srv.address().port+'/';const b=await chromium.launch();
 for(const lang of Object.keys(WANT)){
  const ctx=await b.newContext({serviceWorkers:'block',viewport:{width:390,height:844}}),pg=await ctx.newPage(),errs=[];pg.on('pageerror',e=>errs.push(e.message));
  await pg.addInitScript(l=>{if(sessionStorage.getItem('s'))return;sessionStorage.setItem('s','1');localStorage.setItem('deen_app_language_v1',l);localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,xp:200,name:'T',completed:[],mistakes:[],settings:{},profile:{name:'T',companion:'owl'}}))},lang);
  await pg.goto(base,{waitUntil:'load'});await pg.waitForSelector('#v5Return .v680-nba',{timeout:60000});
  if(lang==='de')await pg.waitForFunction(()=>window.DEEN_GERMAN_UI,null,{timeout:30000}).catch(()=>{});
  await pg.evaluate(()=>{navigate('learnScreen');startMacroStage('U01-M01')});await pg.waitForSelector('#quizView .v9916-task-title',{state:'attached',timeout:30000});await pg.waitForTimeout(1500);
  // Put the engine's Turkish matching heading in place, as the matching renderer does on every matching question.
  await pg.evaluate(()=>{document.querySelector('#quizView .v9916-task-title').innerHTML='Eşleşen <span class="v1013-mint">çiftleri</span> bul'});
  await pg.waitForFunction(w=>document.querySelector('#quizView .v9916-task-title').textContent===w,WANT[lang],{timeout:10000}).catch(()=>{});
  const got=await pg.evaluate(()=>document.querySelector('#quizView .v9916-task-title').textContent);
  assert.strictEqual(got,WANT[lang],lang+': '+got);
  assert(await pg.evaluate(()=>!!document.querySelector('#quizView .v9916-task-title .v1013-mint')),lang+': accent span kept');
  assert.deepStrictEqual(errs,[]);await ctx.close();
 }
 await b.close();srv.close();console.log('Matching title ok');})().catch(e=>{console.error(e);process.exit(1)});
