/* Info envelope (assets/design/lesson.js). Stage start: a sealed envelope with up to three notes taken from the stage's
   bank questions that are not in this session (no answers given away); tapping opens it into a swipeable card, "got it"
   closes it, and the same stage does not show it again. Mid-lesson: after the first wrong answer the next question gets
   one envelope with another question's note on the same concept. Notes are in the learner's language only (no Turkish
   leaks in English). Automated browsers without the opt-in never get it, so other lesson tests are not covered. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 async function open(lang,optIn){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true});
  await ctx.addInitScript(([l,o])=>{if(o)localStorage.setItem('ilnura_envelope','1');localStorage.setItem('deen_app_language_v1',l);localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,learningProfile:'youth',profile:{name:'QA',companion:'cat'},settings:{language:l,onboardingLanguageConfirmed:true},completed:['U01-S01'],mistakes:[]}))},[lang,optIn]);
  const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2500);return {ctx,page};
 }
 async function startAndWait(page,id){
  await page.evaluate(id=>{state.energy=30;startStage(id)},id);
  for(let k=0;k<16;k++){await page.waitForTimeout(500);const c=page.locator('.v910-overlay .v910-card-button');if(await c.count()&&await c.first().isVisible()){await c.first().click();await page.waitForTimeout(700)}if(await page.locator('.ds-env-overlay').count())return true}
  return false;
 }
 for(const lang of ['tr','en']){
  const {ctx,page}=await open(lang,true);
  assert.equal(await startAndWait(page,'U01-S02'),true,lang+': stage envelope appears');
  const info=await page.evaluate(()=>({notes:[...document.querySelectorAll('.ds-env-page p')].map(p=>p.textContent),inSession:session.questions.map(q=>q.id),
   ids:(DEEN_DS_ENVELOPE.stageNotes({stage:session.stage,questions:[]})||[]).map(n=>n.id)}));
  assert.ok(info.notes.length>=1&&info.notes.length<=3,lang+': one to three notes');
  if(lang==='en')assert.ok(info.notes.every(n=>!/[ğışĞİŞ]/.test(n)),'English notes carry no Turkish');
  await page.locator('.ds-env-envelope').click({force:true});await page.waitForTimeout(1500);
  assert.equal(await page.evaluate(()=>document.querySelector('.ds-env-overlay').classList.contains('opened')),true,lang+': opens into a card');
  if(info.notes.length>1){await page.evaluate(()=>{const p=document.querySelector('.ds-env-pages');p.scrollTo({left:p.clientWidth,behavior:'instant'})});await page.waitForTimeout(400);
   assert.equal(await page.evaluate(()=>[...document.querySelectorAll('.ds-env-dots i')].findIndex(d=>d.classList.contains('on'))),1,lang+': swipe moves to the second note')}
  await page.locator('.ds-env-ok').click();await page.waitForTimeout(700);assert.equal(await page.locator('.ds-env-overlay').count(),0,lang+': got it closes it');
  // Session questions never feed the stage envelope.
  const stageNotesNow=await page.evaluate(()=>DEEN_DS_ENVELOPE.stageNotes(session).map(n=>n.id));
  assert.ok(stageNotesNow.every(id=>!info.inSession.includes(id)),lang+': stage notes come from questions outside the session');
  // Mid-lesson: a wrong answer on the current question → the next question shows one concept envelope (when one exists).
  const mid=await page.evaluate(()=>{const prev=session.questions[session.index];return {has:!!DEEN_DS_ENVELOPE.conceptNote(session,prev)}});
  await page.evaluate(()=>{session.combo=0;session.index=session.index+1;renderQuestion()});await page.waitForTimeout(1600);
  const midShown=await page.locator('.ds-env-overlay').count();
  assert.equal(midShown,mid.has?1:0,lang+': mid-lesson envelope after a wrong answer iff a same-concept note exists ('+JSON.stringify(mid)+')');
  if(midShown){await page.locator('.ds-env-skip').click();await page.waitForTimeout(600)}
  // The same stage does not show its envelope again.
  await page.evaluate(()=>{try{closeLesson&&closeLesson()}catch(_){}});await page.waitForTimeout(800);
  assert.equal(await startAndWait(page,'U01-S02'),false,lang+': not shown twice for a stage');
  console.log('  ok',lang,JSON.stringify({notes:info.notes.length,mid}));
  await ctx.close();
 }
 // Automated browsers without the opt-in: never shown.
 const {ctx,page}=await open('tr',false);assert.equal(await startAndWait(page,'U01-S02'),false,'no envelope without opt-in under automation');await ctx.close();
 await browser.close();server.close();console.log('PASS: info envelope at stage start and mid-lesson');
})().catch(e=>{console.error(e);process.exit(1)});
