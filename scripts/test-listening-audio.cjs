/* Listening questions (assets/design/lesson.js, "Listening questions"). Without an approved recording in the app the
   listening questions are never asked, the "Dinle ve Tanı" stage (U03-S03) is passed over (marked as skipped, so Unit 3
   goes on), and no question shows the speaker button. With a recording (here a stand-in file), the skip is undone,
   listening questions come back and each one has a real play control that plays the file. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
const DONE=['U01-S01','U01-S02','U01-S03','U01-S04','U01-S05','U01-S06','U01-S07','U02-S01','U02-S02','U02-S03','U02-S04','U02-S05','U02-S06','U02-S07','U03-S01','U03-S02'];
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']})}
 async function open(withAudio,prior){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true});
  await ctx.addInitScript(([a,p])=>{if(a)window.DEEN_LOCAL_AUDIO={audio_shahada_verified:'assets/quran/audio/arabic-learning/letter-alif.mp3'};if(sessionStorage.getItem('x'))return;sessionStorage.setItem('x','1');
   localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify(Object.assign({onboarded:true,energy:30,xp:3000,learningProfile:'youth',profile:{name:'QA',companion:'cat'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:p.done,mistakes:[]},p.extra||{})))},[withAudio,prior]);
  const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2500);return {ctx,page,errors};
 }
 // 1. No recording: nothing silent is asked, the stage is passed over, no speaker buttons.
 {const {ctx,page,errors}=await open(false,{done:DONE});
  const s=await page.evaluate(()=>({blocked:QUESTIONS.filter(q=>/^listening_/.test(q.activity_type)).every(q=>audioBlocked(q)),s03:stageState('U03',2),s04:stageState('U03',3),skip:!!state.audioStageSkip['U03-S03']}));
  assert.equal(s.blocked,true,'no listening question without a recording');assert.equal(s.s03.done,true,'the listening stage is passed over');assert.equal(s.s04.locked,false,'the next stage is open');assert.equal(s.skip,true,'marked as skipped');
  await page.evaluate(()=>{state.energy=30;startStage('U03-S04')});await page.waitForTimeout(2500);
  for(let k=0;k<6;k++){const r=await page.evaluate(()=>{const c=document.querySelector('.v910-overlay .v910-card-button');if(c&&c.offsetParent)c.click();const q=session.questions[session.index];
    const sp=[...document.querySelectorAll('#lesson .deen-character-question-audio,#lesson .v960-speak')].filter(b=>b.getClientRects().length&&getComputedStyle(b).display!=='none');return {type:q&&q.activity_type,speakers:sp.length}});
   assert.ok(!/^listening_/.test(r.type||''),'no listening question');assert.equal(r.speakers,0,'no speaker button next to a question');
   await page.evaluate(()=>{try{session.index=Math.min(session.index+1,session.questions.length-1);renderQuestion()}catch(_){}});await page.waitForTimeout(700)}
  assert.deepEqual(errors,[],'no page errors');console.log('  ok without a recording');await ctx.close();}
 // 2. With a recording: the skip is undone, listening questions come back with a play control that plays the file.
 {const {ctx,page,errors}=await open(true,{done:DONE.concat('U03-S03'),extra:{audioStageSkip:{'U03-S03':1}}});
  const s=await page.evaluate(()=>({blocked:QUESTIONS.filter(q=>/^listening_/.test(q.activity_type)).some(q=>audioBlocked(q)),s03:stageState('U03',2),pool:chooseQuestions('U03-S03').filter(q=>/^listening_/.test(q.activity_type)).length}));
  assert.equal(s.blocked,false,'listening questions are back');assert.equal(s.s03.done,false,'the skip is undone');assert.ok(s.pool>0,'listening questions in the stage');
  await page.evaluate(()=>{state.energy=30;startStage('U03-S03')});await page.waitForTimeout(2500);
  let played=false;
  for(let k=0;k<8&&!played;k++){
   const t=await page.evaluate(()=>{const c=document.querySelector('.v910-overlay .v910-card-button');if(c&&c.offsetParent)c.click();return session.questions[session.index].activity_type});
   if(/^listening_/.test(t)){
    await page.waitForSelector('#lesson .ds-listen-play',{timeout:5000});
    await page.locator('#lesson .ds-listen-play').click();
    await page.waitForFunction(()=>document.querySelector('#lesson .ds-listen-play')?.classList.contains('playing')||document.querySelector('#lesson .ds-listen-play')?.classList.contains('heard'),null,{timeout:8000});
    const st=await page.evaluate(()=>({cls:document.querySelector('#lesson .ds-listen-play').className,src:window.DEEN_LISTENING.source()}));
    assert.match(st.cls,/playing|heard/,'the recording plays');assert.match(st.src,/\.mp3$/);played=true;
    if(process.env.SHOT)await page.screenshot({path:process.env.SHOT});
   }else{await page.evaluate(()=>{try{session.index++;renderQuestion()}catch(_){}});await page.waitForTimeout(800)}
  }
  assert.equal(played,true,'a listening question with a working play control');
  assert.deepEqual(errors,[],'no page errors');console.log('  ok with a recording');await ctx.close();}
 await browser.close();server.close();console.log('PASS: listening — no silent questions, no stall, no speaker buttons; a recording plays when added');
})().catch(e=>{console.error(e);process.exit(1)});
