/* Celebration videos: clips exist and are small mp4s; the first lesson plays the learner's own companion clip full screen;
   "Geç" closes it; the same moment never plays twice; turning the setting off (or reduced motion) prevents it;
   ordinary lessons show none; the settings sheet has both toggles. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 const man=JSON.parse(fs.readFileSync(path.join(root,'assets/videos/manifest.json'),'utf8'));
 for(const [ev,m] of Object.entries(man))for(const [a,c] of Object.entries(m)){const b=fs.readFileSync(path.join(root,c.src));assert.equal(b.slice(4,8).toString(),'ftyp',ev+'/'+a+' is an mp4');assert.ok(b.length<1.5e6,a+' is small');assert.ok(fs.existsSync(path.join(root,c.poster)),a+' has a poster')}
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']})}
 async function run(name,{settings={},keep=null,companion='lion'}={}){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true});
  await ctx.addInitScript(([s,c,k])=>{if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,streak:0,learningProfile:'adult',profile:{name:'QA',companion:c},settings:{language:'tr',onboardingLanguageConfirmed:true,...s},completed:[],mistakes:[]}));if(k)localStorage.setItem('deen_celebrate_seen_v1',JSON.stringify(k))}},[settings,companion,keep]);
  const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(3500);
  await page.locator('.v680-main').first().click();await page.waitForSelector('#answerArea .option',{timeout:30000});await page.waitForTimeout(1200);
  await page.evaluate(async()=>{for(let i=0;i<40&&document.getElementById('quizView')?.style.display!=='none';i++){const q=session.questions[session.index];if(!q)break;try{completeQuestion(true,q)}catch(e){}await new Promise(r=>setTimeout(r,120));try{nextQuestion()}catch(e){}await new Promise(r=>setTimeout(r,150))}});
  await page.waitForSelector('#resultView.show',{timeout:20000});await page.waitForTimeout(3800);
  const r=await page.evaluate(()=>{const o=document.getElementById('dsCelebrate');const v=o?.querySelector('video');return{open:!!o,src:v?.getAttribute('src')||'',poster:v?.getAttribute('poster')||'',seen:localStorage.getItem('deen_celebrate_seen_v1')}});
  return{ctx,page,r};
 }
 let t=await run('first');
 assert.equal(t.r.open,true,'the first lesson plays a celebration');assert.equal(t.r.src,'assets/videos/lion/lesson_done.mp4','lion learner gets the lion clip');
 await t.page.screenshot({path:'/tmp/w/celebrate.png'}).catch(()=>{});
 await t.page.click('#dsCelebrate .ds-cv-skip');await t.page.waitForTimeout(500);
 assert.equal(await t.page.evaluate(()=>!!document.getElementById('dsCelebrate')),false,'Geç closes it');
 await t.ctx.close();
 t=await run('already seen',{keep:{first:1,perfectDay:new Date().toISOString().slice(0,10)}});
 assert.equal(t.r.open,false,'a moment that was already celebrated does not repeat');await t.ctx.close();
 t=await run('off',{settings:{celebrateVideo:false}});assert.equal(t.r.open,false,'setting off: no video');await t.ctx.close();
 t=await run('reduced',{settings:{reducedMotion:true}});assert.equal(t.r.open,false,'reduced motion: no video');await t.ctx.close();
 t=await run('cat',{companion:'cat'});assert.equal(t.r.src,'assets/videos/cat/lesson_done.mp4','cat learner gets the cat clip');
 await t.page.click('#dsCelebrate .ds-cv-skip');await t.page.waitForTimeout(400);
 await t.page.evaluate(()=>{document.querySelector('#resultContinueBtn')?.click()});await t.page.waitForTimeout(800);
 await t.page.evaluate(()=>{try{settingsPanel()}catch(e){}});await t.page.waitForSelector('#v5SheetBody',{timeout:8000});await t.page.waitForTimeout(600);
 const tog=await t.page.evaluate(()=>[...document.querySelectorAll('.ds-celebrate-settings input')].map(i=>i.dataset.k+':'+i.checked));
 assert.deepEqual(tog,['celebrateVideo:true','celebrateSound:true'],'settings has both toggles, default on');
 await t.ctx.close();
 await browser.close();server.close();console.log('PASS: celebration videos');
})().catch(e=>{console.error(e);process.exit(1)});
