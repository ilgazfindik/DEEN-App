/* A corrupt save must never be lost silently: with a good "last good" copy the player's progress comes back; without one the app starts
   fresh but the unreadable text is kept under deen_corrupt_state_backup instead of being overwritten by the next save. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const good={onboarded:true,energy:22,xp:1234,streak:7,learningProfile:'adult',profile:{name:'QA',companion:'cat'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]};
 async function run(seed){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
  await ctx.addInitScript(s=>{if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.setItem('deen_app_language_v1','tr');for(const[k,v]of Object.entries(s))localStorage.setItem(k,v)}},seed);
  const page=await ctx.newPage();await page.goto(url);await page.waitForFunction(()=>window.DEEN_BOOT?.status().phase==='ready',null,{timeout:90000});await page.waitForTimeout(2500);
  const r=await page.evaluate(()=>({xp:state.xp,streak:state.streak,recovered:!!state.__recoveredFromBackup,kept:localStorage.getItem('deen_corrupt_state_backup')}));
  await ctx.close();return r;
 }
 const CORRUPT='{"xp":99,"streak":3,"broken';
 const a=await run({deen_v4_1_state:CORRUPT,deen_v57_last_good_state:JSON.stringify(good)});
 assert.equal(a.xp,1234,'progress is restored from the last good copy');assert.equal(a.kept,CORRUPT,'the unreadable text is kept');
 const b=await run({deen_v4_1_state:CORRUPT});
 assert.equal(b.kept,CORRUPT,'with no good copy the unreadable text is still kept (not overwritten)');
 await browser.close();server.close();console.log('PASS: corrupt save is recovered or preserved, never silently lost');
})().catch(e=>{console.error(e);process.exit(1)});
