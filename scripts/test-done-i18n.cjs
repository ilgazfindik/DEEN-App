/* Completed-day states of the Home next-step card are localised (no Turkish leftovers), in a real browser. */
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');const types={'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.txt':'text/plain','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(root,p);fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});r.end(b)})});
const states={done:{j:{complete:true,due:0},e:{}},optional:{j:{complete:true,due:9,reviewAvailable:true},e:{}},daily:{j:{complete:true,due:0},e:{dailyChest:{ready:true,claimed:false}}},weekly:{j:{complete:true,due:0},e:{weeklyChest:{ready:true,claimed:false,days:5}}}};
const TITLE={en:{done:'All done for today.',optional:'Today’s plan is done.',daily:'Your daily chest is ready.',weekly:'Your weekly rhythm chest is ready.'},
 de:{done:'Für heute geschafft.',optional:'Der heutige Plan ist erledigt.',daily:'Deine Tagestruhe ist bereit.',weekly:'Deine Wochenrhythmus-Truhe ist bereit.'},
 fr:{done:'C’est tout pour aujourd’hui.',optional:'Le plan du jour est terminé.',daily:'Ton coffre du jour est prêt.',weekly:'Ton coffre du rythme hebdomadaire est prêt.'},
 ar:{done:'انتهيت لهذا اليوم.',optional:'اكتملت خطة اليوم.',daily:'صندوقك اليومي جاهز.',weekly:'صندوق إيقاعك الأسبوعي جاهز.'}};
const TURKISH=/\b(tamam|Bugünlük|Bugünkü|sandığın|hazır|Ödülünü|isteğe|bağlı|hedefin|İstersen|soruluk|HAZIR|TAMAM|SANDIĞI|ritim)\b/;
(async()=>{await new Promise(r=>srv.listen(0,r));const base='http://localhost:'+srv.address().port+'/';const b=await chromium.launch();
 for(const lang of ['en','de','fr','ar']){
  const ctx=await b.newContext({serviceWorkers:'block',viewport:{width:390,height:844}}),pg=await ctx.newPage(),errs=[];pg.on('pageerror',e=>errs.push(e.message));
  await pg.addInitScript(l=>{if(sessionStorage.getItem('s'))return;sessionStorage.setItem('s','1');localStorage.setItem('deen_app_language_v1',l);localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,xp:200,name:'T',completed:[],mistakes:[],settings:{},profile:{name:'T',companion:'owl'}}))},lang);
  await pg.goto(base,{waitUntil:'load'});await pg.waitForSelector('#v5Return .v680-nba',{timeout:60000});await pg.waitForTimeout(2000);
  for(const [name,st] of Object.entries(states)){
   await pg.evaluate(s=>{const J=window.__J||(window.__J=window.DEEN_DAILY_JOURNEY),E=window.__E||(window.__E=window.DEEN_ECONOMY);window.DEEN_DAILY_JOURNEY={...J,status:()=>({...J.status(),...s.j})};window.DEEN_ECONOMY={...E,status:()=>({...E.status(),...s.e})};returnCard();document.dispatchEvent(new Event('deen:ui-updated'))},st);
   await pg.waitForTimeout(1200);
   const card=await pg.evaluate(()=>{const c=document.querySelector('#v5Return .v680-nba');return {h1:c.querySelector(':scope>h1').textContent.trim(),text:c.innerText}});
   assert.strictEqual(card.h1,TITLE[lang][name],lang+' '+name+' title: '+card.h1);
   assert(!TURKISH.test(card.text),lang+' '+name+' leftover Turkish: '+card.text.replace(/\n+/g,' | '));
  }
  assert.deepStrictEqual(errs,[]);await ctx.close();
 }
 await b.close();srv.close();console.log('Completed-state translations ok');})().catch(e=>{console.error(e);process.exit(1)});
