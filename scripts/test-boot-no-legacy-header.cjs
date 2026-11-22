/* Start-up never shows the legacy pre-start header. The app body (.phone) stays transparent until the design system,
   written last, has run and the brand pass has renamed "DEEN" (data-deen-design="ready"); the splash veil stays until then
   too. iOS paints between HTML chunks, so without this gate the old "DEEN" wordmark and stat pills showed for a second or
   two after the splash. Headless Chrome does not paint mid-parse, so the gate itself is asserted on every DOM change. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 for(const lang of ['tr','en']){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
  await ctx.addInitScript(l=>{localStorage.setItem('deen_app_language_v1',l);localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,streak:4,xp:1955,energy:30,profile:{name:'QA',companion:'cat'},settings:{language:l,onboardingLanguageConfirmed:true},completed:[]}));
   window.__bad=[];window.__seenHeader=false;
   const chk=()=>{const h=document.querySelector('#learnScreen .app-header');if(!h)return;window.__seenHeader=true;
    let op=1,e=h;while(e&&e.nodeType===1){op*=+getComputedStyle(e).opacity;e=e.parentElement}
    const veil=document.getElementById('ilnura-veil'),prep=document.getElementById('deenPreparation');
    const covered=(veil&&+getComputedStyle(veil).opacity>.5)||(prep&&getComputedStyle(prep).display!=='none'&&getComputedStyle(prep).visibility!=='hidden'&&+getComputedStyle(prep).opacity>.5);
    const ready=document.documentElement.dataset.deenDesign==='ready',name=(h.querySelector('.brand-name')?.textContent||'').trim();
    if(!ready&&op>.05)__bad.push('app body visible before the design system ran (opacity '+op.toFixed(2)+', header "'+name+'")');
    if(op>.05&&!covered&&getComputedStyle(h).visibility==='visible'&&name==='DEEN')__bad.push('legacy "DEEN" header exposed');};
   new MutationObserver(chk).observe(document,{subtree:true,childList:true,attributes:true,characterData:true});setInterval(chk,40)},lang);
  const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});
  await page.waitForFunction(()=>!document.getElementById('ilnura-veil'),null,{timeout:30000});await page.waitForTimeout(800);
  const r=await page.evaluate(()=>({bad:[...new Set(__bad)],seen:__seenHeader,design:document.documentElement.dataset.deenDesign,name:document.querySelector('#learnScreen .app-header .brand-name')?.textContent?.trim()}));
  assert.equal(r.seen,true,lang+': the start-up header was never seen');assert.deepEqual(r.bad,[],lang+': '+r.bad.join('; '));
  assert.equal(r.design,'ready',lang+': design gate never opened');assert.equal(r.name,'ilnura',lang+': header is renamed once visible');
  console.log('  ok',lang,JSON.stringify(r));await ctx.close();
 }
 await browser.close();server.close();console.log('PASS: start-up never shows the legacy header');
})().catch(e=>{console.error(e);process.exit(1)});
