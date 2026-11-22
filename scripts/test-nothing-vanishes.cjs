/* After a correct (or wrong) choice answer nothing on the question screen disappears: the heading and the "tap to answer" line
   stay visible, the character stays painted with no filter on it (an iOS WebKit trap), and the answers stay. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true});
 await ctx.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,streak:3,learningProfile:'youth',profile:{name:'QA',companion:'lion'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))});
 const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(3000);
 await page.locator('.v680-main').first().click();await page.waitForSelector('#answerArea .option',{timeout:30000});await page.waitForTimeout(1800);
 const open=n=>page.evaluate(async n=>{state.completed=[];state.energy=30;let k=0;for(const st of STAGES){session=null;try{startStage(st.id)}catch(e){continue}if(!session)continue;for(let i=0;i<session.questions.length;i++){if(session.questions[i].activity_type!=='multiple_choice')continue;if(k++<n)continue;session.index=i;renderQuestion();return session.questions[i].correct_answer}}return null},n);
 const state=()=>page.evaluate(()=>{const vis=s=>{const e=document.querySelector(s);if(!e)return false;const b=e.getBoundingClientRect(),c=getComputedStyle(e);return b.width>2&&b.height>2&&c.display!=='none'&&c.visibility!=='hidden'&&+c.opacity>0.05};const a=document.querySelector('.deen-character-question-avatar'),img=a&&a.querySelector('img');return {head:vis('.ds-mc-head'),tap:vis('.v859-speed-tag')||!document.querySelector('.v859-speed-tag'),avatar:vis('.deen-character-question-avatar img'),filterImg:img?getComputedStyle(img).filter:'none',filterHolder:a?getComputedStyle(a).filter:'none',options:[...document.querySelectorAll('#answerArea .option')].filter(e=>e.getClientRects().length).length}});
 for(const [mode,n] of [['correct',0],['wrong',1],['correct',2]]){
  const c=await open(n);await page.waitForTimeout(900);const card=page.locator('.v910-overlay .v910-card-button');
  // a stage intro card can open late on a slow machine: close it whenever it shows up until the answers are visible
  for(let t=0;t<20;t++){if(await card.count()&&await card.first().isVisible()){await card.first().click();await page.waitForTimeout(1200);continue}
   if(await page.locator('#answerArea .option').first().isVisible().catch(()=>false)){await page.waitForTimeout(600);if(!(await card.count()&&await card.first().isVisible()))break}else await page.waitForTimeout(500)}
  const before=await state();
  const opt=mode==='correct'?page.locator('#answerArea .option').filter({hasText:String(c)}).first():page.locator('#answerArea .option').filter({hasNotText:String(c)}).first();
  const bb=await opt.boundingBox();await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);await page.waitForSelector('#feedback.show',{timeout:10000});
  for(const wait of [200,500,1500]){await page.waitForTimeout(wait);const s=await state();
   assert.equal(s.head,before.head,mode+': the heading stays');assert.equal(s.tap,true,mode+': the tap line stays');assert.equal(s.avatar,true,mode+': the character stays painted');
   assert.equal(s.filterImg,'none',mode+': no filter on the character image');assert.equal(s.filterHolder,'none',mode+': no filter on its holder');assert.equal(s.options,before.options,mode+': the answers stay')}
  console.log('  ok',mode);
 }
 await browser.close();server.close();console.log('PASS: nothing vanishes when a choice answer is graded');
})().catch(e=>{console.error(e);process.exit(1)});
