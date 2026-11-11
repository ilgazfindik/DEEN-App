/* Tomorrow teaser on the Home next-step card, in a real browser. */
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');const types={'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.txt':'text/plain','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(root,p);fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});r.end(b)})});
const pad=n=>String(n).padStart(2,'0'),key=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
async function open(base,browser,lang,streak){
 const ctx=await browser.newContext({serviceWorkers:'block',viewport:{width:390,height:844}}),pg=await ctx.newPage(),errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.addInitScript(a=>{if(sessionStorage.getItem('s'))return;sessionStorage.setItem('s','1');localStorage.setItem('deen_app_language_v1',a.lang);
  localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,xp:200,name:'T',completed:[],mistakes:[],settings:{},profile:{name:'T',companion:'owl'},streak:a.streak,streakMeta:{lastStudyDate:a.today,currentStreak:a.streak,longestStreak:a.streak,streakFreeze:0,weeklyActivity:{},freezeDates:[]}}))},{lang,streak,today:key(new Date())});
 await pg.goto(base,{waitUntil:'load'});await pg.waitForSelector('#v5Return .v680-nba',{timeout:60000});await pg.waitForSelector('#v5Paths .lp-stop.current',{timeout:60000});
 return {ctx,pg,errs};
}
(async()=>{await new Promise(r=>srv.listen(0,r));const base='http://localhost:'+srv.address().port+'/';const b=await chromium.launch();
 // 1) journey not complete: no teaser
 let a=await open(base,b,'en',4);await a.pg.waitForTimeout(2500);
 assert.strictEqual(await a.pg.locator('#v5Return .dst').count(),0,'no teaser while today is unfinished');
 // 2) journey complete: teaser names the next lesson in the learner's language + streak hook
 await a.pg.evaluate(()=>{const J=window.DEEN_DAILY_JOURNEY,st=J.status();window.DEEN_DAILY_JOURNEY={...J,status:()=>({...J.status(),complete:true})};returnCard()});
 await a.pg.waitForSelector('#v5Return .dst',{timeout:10000});
 let txt=await a.pg.textContent('#v5Return .dst');assert(/WAITING FOR YOU TOMORROW/.test(txt)&&/Meet Islam/.test(txt)&&/reaches day 5/.test(txt),'teaser text: '+txt);
 assert(!/İslam/.test(txt),'title is localised');
 await a.ctx.close();
 // 3) milestone tomorrow (streak 6 -> day 7): reward hook; Arabic: localised title, RTL
 a=await open(base,b,'ar',6);
 await a.pg.evaluate(()=>{const J=window.DEEN_DAILY_JOURNEY;window.DEEN_DAILY_JOURNEY={...J,status:()=>({...J.status(),complete:true})};returnCard()});
 await a.pg.waitForSelector('#v5Return .dst',{timeout:10000});
 txt=await a.pg.textContent('#v5Return .dst');assert(/🎁/.test(txt)&&/7/.test(txt),'milestone hook: '+txt);assert(!/[İış]/.test(txt),'Arabic title localised: '+txt);
 assert.strictEqual(await a.pg.getAttribute('#v5Return .dst','dir'),'rtl');
 assert.deepStrictEqual(a.errs,[]);await a.ctx.close();
 await b.close();srv.close();console.log('Tomorrow teaser ok');})().catch(e=>{console.error(e);process.exit(1)});
