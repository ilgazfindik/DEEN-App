/* The lesson result screen is one calm screen: mascot (sharp picture), title, percentage, three stat cards, one progress card,
   the rhythm line and a single button that is on screen without scrolling. The long stack of extra cards and the leftover
   "5x SERI" chip are gone. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 for(const [w,h] of [[393,852],[375,667]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},serviceWorkers:'block',isMobile:true,hasTouch:true});
  await ctx.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,streak:3,learningProfile:'adult',profile:{name:'QA',companion:'lion'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))});
  const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(3500);
  await page.locator('.v680-main').first().click();await page.waitForSelector('#answerArea .option',{timeout:30000});await page.waitForTimeout(1200);
  await page.evaluate(async()=>{for(let i=0;i<40&&document.getElementById('quizView')?.style.display!=='none';i++){const q=session.questions[session.index];if(!q)break;try{completeQuestion(true,q)}catch(e){}await new Promise(r=>setTimeout(r,120));try{nextQuestion()}catch(e){}await new Promise(r=>setTimeout(r,150))}});
  await page.waitForSelector('#resultView.show',{timeout:20000});await page.waitForTimeout(3000);
  const r=await page.evaluate(()=>{const rv=document.getElementById('resultView');const shown=s=>[...rv.querySelectorAll(s)].some(e=>e.getClientRects().length&&getComputedStyle(e).display!=='none');const btn=document.getElementById('resultContinueBtn');const bb=btn.getBoundingClientRect();const mascot=rv.querySelector('.ds-end-mascot');const g=document.getElementById('gfCombo');return {extras:['.v54-result-loop','.v633-debrief','.v650-result-loop','.v622-chest','.v623-result-banner','.v680-result-next','#resultMedal'].filter(shown),combo:!!g&&getComputedStyle(g).display!=='none',btnBottom:Math.round(bb.bottom),btnVisible:bb.height>20,vh:innerHeight,scrolls:rv.scrollHeight>rv.clientHeight+2,mascotW:mascot?mascot.naturalWidth:0,stats:['#resultXp','#resultCorrect','#resultCombo','#resultTitle','#resultPct'].every(s=>!!document.querySelector(s))}});
  assert.deepEqual(r.extras,[],w+'x'+h+': the extra cards are hidden');assert.equal(r.combo,false,'the leftover combo chip is hidden');
  assert.equal(r.btnVisible,true);assert.ok(r.btnBottom<=r.vh+1,w+'x'+h+': the button is on screen ('+r.btnBottom+' of '+r.vh+')');
  assert.ok(r.mascotW>=250,w+'x'+h+': the mascot picture is the sharp one ('+r.mascotW+'px)');assert.equal(r.stats,true,'title, percentage and the three stats are there');
  console.log('  ok',w+'x'+h,JSON.stringify({scrolls:r.scrolls,btnBottom:r.btnBottom,mascotW:r.mascotW}));await ctx.close();
 }
 await browser.close();server.close();console.log('PASS: lesson result screen is one calm screen');
})().catch(e=>{console.error(e);process.exit(1)});
