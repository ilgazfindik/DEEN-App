/* Long questions ("Hatayı bul"): the action button stays on screen at the bottom of the frame even on a short phone screen. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const assert=require('node:assert/strict');const root=path.resolve(__dirname,'..');const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.jpg':'image/jpeg','.mp3':'audio/mpeg','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
const b=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:393,height:740},serviceWorkers:'block',isMobile:true,hasTouch:true,deviceScaleFactor:2});
await ctx.addInitScript(()=>{if(!sessionStorage.getItem('s')){sessionStorage.setItem('s','1');localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,learningProfile:'teen',profile:{name:'QA',companion:'lion'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))}});
const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(3000);
await page.evaluate(()=>{state.energy=30;session=null;startStage('U01-S04')});await page.waitForTimeout(1500);
for(let i=0;i<10;i++){const t=await page.evaluate(()=>session?.questions[session.index]?.activity_type);console.log('step',i,t);if(t==='error_spotting')break;
 await page.evaluate(()=>{const q=session.questions[session.index];submitAnswer(q.correct_answer,null)});await page.waitForTimeout(900);
 const cb=page.locator('#feedback.show #continueBtn');if(await cb.count()){await cb.first().click()}else{console.log('no continue; fallback');await page.evaluate(()=>{try{nextQuestion()}catch(e){}})}await page.waitForTimeout(1200)}
console.log('type',await page.evaluate(()=>session?.questions[session.index]?.activity_type));await page.waitForTimeout(1500);
const card=page.locator('.v910-overlay .v910-card-button');if(await card.count()){await card.first().click();await page.waitForTimeout(1200)}
await page.locator('#answerArea button').nth(1).click();await page.waitForTimeout(600);
const r=await page.evaluate(()=>{const c=document.querySelector('#answerArea>.template-action');const f=document.querySelector('.question-frame').getBoundingClientRect();const b=c.getBoundingClientRect();return{bottom:b.bottom,frameBottom:f.bottom,vh:innerHeight,disabled:c.disabled,pos:getComputedStyle(c).position}});
console.log(JSON.stringify(r));assert.equal(r.pos,'sticky','the action button sticks to the bottom');assert.ok(r.bottom<=r.frameBottom+1&&r.bottom<=r.vh+1,'the action button is on screen without scrolling ('+r.bottom+' of '+r.vh+')');
await b.close();server.close();console.log('PASS: the action button stays visible on long questions')})().catch(e=>{console.error(e);process.exit(1)});
