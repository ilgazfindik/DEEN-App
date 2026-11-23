/* Info envelope (assets/design/lesson.js). Every envelope comes as soon as the learner enters a lesson, on its first
   question, and none in the middle of a lesson. A tap anywhere opens it into a card in the middle of the screen, each
   further tap shows the next note and the tap after the last one closes it. Every lesson of every stage gets one, with one
   or two hint notes on the concepts this lesson asks about (from other questions, never from the lesson's own questions);
   notes are in the learner's language only. Automated browsers without the opt-in never get it, so other lesson tests are not covered. */
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
 const closeCard=async page=>{const c=page.locator('.v910-overlay .v910-card-button');if(await c.count()&&await c.first().isVisible()){await c.first().click();await page.waitForTimeout(700)}};
 async function startAndWait(page,id){
  await page.evaluate(id=>{state.energy=30;startStage(id)},id);
  for(let k=0;k<16;k++){await page.waitForTimeout(500);await closeCard(page);if(await page.locator('.ds-env-overlay').count())return true}
  return false;
 }
 const endLesson=async page=>{await page.evaluate(()=>{try{closeLesson&&closeLesson()}catch(_){}});await page.waitForTimeout(700)};
 for(const lang of ['tr','en']){
  const {ctx,page}=await open(lang,true);
  assert.equal(await startAndWait(page,'U01-S02'),true,lang+': envelope as soon as the lesson starts');
  const info=await page.evaluate(()=>{const ns=DEEN_DS_ENVELOPE.stageNotes(session,2);return {index:session.index,notes:[...document.querySelectorAll('.ds-env-page p')].map(p=>p.textContent),inSession:session.questions.map(q=>q.id),
   sessionConcepts:[...new Set(session.questions.map(q=>q.concept_id).filter(Boolean))],noteConcepts:ns.map(n=>n.concept),noteIds:ns.map(n=>n.id)}});
  assert.equal(info.index,0,lang+': on the first question');assert.ok(info.notes.length>=1&&info.notes.length<=2,lang+': one or two notes ('+info.notes.length+')');
  assert.ok(info.noteConcepts.some(c=>info.sessionConcepts.includes(c)),lang+': notes are about concepts this lesson asks about '+JSON.stringify(info.noteConcepts));
  assert.ok(info.noteIds.every(id=>!info.inSession.includes(id)),lang+': never a note of the lesson\'s own questions');
  if(lang==='en')assert.ok(info.notes.every(n=>!/[ğışĞİŞ]/.test(n)),'English notes carry no Turkish');
  await page.mouse.click(196,760);await page.waitForTimeout(1500);
  assert.equal(await page.evaluate(()=>document.querySelector('.ds-env-overlay').classList.contains('opened')),true,lang+': opens into a card');
  const centre=await page.evaluate(()=>{const r=document.querySelector('.ds-env-card').getBoundingClientRect();return Math.round(r.top+r.height/2)});
  assert.ok(Math.abs(centre-426)<=40,lang+': the card sits in the middle of the screen ('+centre+')');
  for(let k=1;k<info.notes.length;k++){await page.mouse.click(40,120);await page.waitForTimeout(600);
   assert.equal(await page.evaluate(()=>document.querySelectorAll('.ds-env-dots i.on').length),k+1,lang+': tap → note '+(k+1)+' (story bars fill up)')}
  await page.mouse.click(40,120);await page.waitForTimeout(700);assert.equal(await page.locator('.ds-env-overlay').count(),0,lang+': the tap after the last note closes it');
  // No envelope in the middle of the lesson, whatever happens (wrong answers, streaks, half-way).
  for(let k=0;k<7;k++){await page.evaluate(k=>{session.combo=k%2?0:4;session.index=Math.min(session.index+1,session.questions.length-1);renderQuestion()},k);await page.waitForTimeout(600);await closeCard(page);await page.waitForTimeout(700);
   assert.equal(await page.locator('.ds-env-overlay').count(),0,lang+': no envelope mid-lesson (question '+(k+2)+')')}
  await endLesson(page);
  assert.equal(await startAndWait(page,'U01-S02'),true,lang+': every lesson has one');
  console.log('  ok',lang,JSON.stringify({notes:info.notes.length}));
  await ctx.close();
 }
 // Every stage of a unit, every lesson: one or two notes.
 {const {ctx,page}=await open('tr',true);
  const startOnly=async id=>{const shown=await startAndWait(page,id);let notes=0;if(shown){notes=await page.locator('.ds-env-page').count();await page.locator('.ds-env-skip').click();await page.waitForTimeout(600)}await endLesson(page);return {shown,notes}};
  const all=[];for(const id of ['U01-S01','U01-S03','U01-S05','U01-S06','U01-S07','U02-S06'])for(let k=0;k<2;k++){const r=await startOnly(id);all.push([id,r.shown,r.notes]);
   assert.equal(r.shown,true,id+' lesson '+(k+1)+': envelope');assert.ok(r.notes>=1&&r.notes<=2,id+': one or two notes ('+r.notes+')')}
  console.log('  ok every stage',JSON.stringify(all));await ctx.close();}
 // The way learners really start lessons: the home screen's "next mini lesson" button and a path card both open a mini
 // lesson (U01-M0x, questions from several stages) — the envelope must come there too.
 {const {ctx,page}=await open('tr',true);
  const waitEnv=async()=>{for(let k=0;k<20;k++){await page.waitForTimeout(500);await closeCard(page);if(await page.locator('.ds-env-overlay').count())return true}return false};
  await page.locator('.v680-main').first().click();
  const home=await waitEnv();const homeStage=await page.evaluate(()=>String(session.stage&&(session.stage.id||session.stage)));
  assert.equal(home,true,'home "next mini lesson" button: envelope ('+homeStage+')');
  await page.locator('.ds-env-skip').click();await page.waitForTimeout(600);await endLesson(page);
  await page.evaluate(()=>{navigate('learnScreen');previewMacro('U01-M01')});await page.waitForTimeout(1000);
  await page.locator('#v5SheetBody .v5-primary').first().click();
  const card=await waitEnv();const cardStage=await page.evaluate(()=>String(session.stage&&(session.stage.id||session.stage)));
  assert.equal(card,true,'path card → start: envelope ('+cardStage+')');
  assert.match(homeStage+' '+cardStage,/U01-M0\d U01-M0\d/,'both are mini-lesson sessions');
  console.log('  ok real entry',JSON.stringify({homeStage,cardStage}));await ctx.close();}
 // Automated browsers without the opt-in: never shown.
 const {ctx,page}=await open('tr',false);assert.equal(await startAndWait(page,'U01-S02'),false,'no envelope without opt-in under automation');await ctx.close();
 await browser.close();server.close();console.log('PASS: info envelope on entry in every lesson, one or two concept hints, none mid-lesson');
})().catch(e=>{console.error(e);process.exit(1)});
