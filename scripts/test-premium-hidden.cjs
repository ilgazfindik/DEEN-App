/* Draft Premium prices and the "first 3 days free" offer start no real payment, so players must not see them: no Premium text
   on the profile and no premium modules for a regular visitor; developer mode (?dev=1) still shows the preview. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
 const args=['--no-sandbox','--disable-dev-shm-usage','--host-resolver-rules=MAP app.test 127.0.0.1','--unsafely-treat-insecure-origin-as-secure=http://app.test:'+port];
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args})}catch(_){browser=await chromium.launch({headless:true,args})}
 async function probe(q){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
  await ctx.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,streak:3,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))});
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://app.test:'+port+'/index.html'+q);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(3000);
  await page.locator('.navbtn').last().click();await page.waitForTimeout(1500);
  const r=await page.evaluate(()=>({text:document.body.innerText,offer:typeof window.DEEN_PREMIUM_OFFER,hub:typeof window.DEEN_PREMIUM_HUB}));
  await ctx.close();return {...r,errors:errors.filter(e=>!/Supabase|fetch|Failed to load|NetworkError/i.test(e))};
 }
 const reg=await probe('');
 assert.equal(/premium/i.test(reg.text),false,'no Premium text for players');assert.equal(/ücretsiz dene|3 gün ücretsiz/i.test(reg.text),false,'no trial offer');
 assert.equal(reg.offer,'undefined');assert.equal(reg.hub,'undefined');assert.deepEqual(reg.errors,[],'nothing breaks without the premium modules');
 const dev=await probe('?dev=1');
 assert.equal(dev.offer,'object','developer mode keeps the preview');assert.equal(dev.hub,'object');assert.match(dev.text,/premium/i);
 await browser.close();server.close();console.log('PASS: Premium preview hidden from players, kept for developer mode');
})().catch(e=>{console.error(e);process.exit(1)});
