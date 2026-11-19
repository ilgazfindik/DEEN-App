/* The lesson swaps the character to its "correct" pose on every second right answer. The swap must never blank the character:
   the picture is swapped only after the new one loaded, and it ends up decoded (naturalWidth > 0), for every animal. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 for(const animal of ['owl','cat','wolf','lion','eagle','turtle']){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true});
  await ctx.addInitScript(a=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,streak:3,learningProfile:'adult',profile:{name:'QA',companion:a},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))},animal);
  const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(3000);
  await page.locator('.v680-main').first().click();await page.waitForSelector('#answerArea .option',{timeout:30000});await page.waitForTimeout(1500);
  let seenCorrect=false;
  const idx=await page.evaluate(()=>{state.completed=[];state.energy=30;session=null;startStage(STAGES[0].id);return session.questions.map((q,i)=>['multiple_choice','missing_item','speed_review','scenario'].includes(q.activity_type)?i:-1).filter(i=>i>=0)});
  assert.ok(idx.length>=2,animal+': the first lesson has two choice questions');
  for(const i of idx.slice(0,3)){
   await page.evaluate(i=>{session.index=i;renderQuestion()},i);await page.waitForTimeout(900);
   const card=page.locator('.v910-overlay .v910-card-button');if(await card.count()){await card.first().click();await page.waitForTimeout(900)}
   const ok=await page.evaluate(()=>session.questions[session.index].correct_answer);
   const o=page.locator('#answerArea .option').filter({hasText:String(ok)}).first();const bb=await o.boundingBox();await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);
   await page.waitForSelector('#feedback.show',{timeout:10000});await page.waitForTimeout(1600);
   const r=await page.evaluate(()=>{const i=document.querySelector('#lesson .deen-character-question-avatar img');return i?{src:i.getAttribute('src'),w:i.naturalWidth,done:i.complete}:null});
   assert.ok(r,animal+': the character is there');assert.ok(r.done&&r.w>0,animal+': the character picture is decoded ('+r.src+')');
   if(/_correct\./.test(r.src))seenCorrect=true;
  }
  assert.ok(seenCorrect,animal+': the correct pose appeared after the second right answer');
  console.log('  ok',animal,seenCorrect?'(correct pose seen)':'');await ctx.close();
 }
 await browser.close();server.close();console.log('PASS: the pose swap never blanks the character (all animals)');
})().catch(e=>{console.error(e);process.exit(1)});
