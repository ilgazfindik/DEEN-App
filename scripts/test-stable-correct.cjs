/* A correct choice answer must not move or remove anything on the lesson screen: the character row, the answers and the
   source line keep their position and size, the lesson is never scaled, the character stays, and only the result sheet is added.
   Checked in every UI language with the first question of the first lesson (a multiple-choice question). */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 for(const lang of ['tr','en','de','fr','ar']){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
  await ctx.addInitScript(l=>{localStorage.setItem('deen_app_language_v1',l);localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,streak:3,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:l,onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))},lang);
  const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:60000});await page.waitForTimeout(3500);
  await page.locator('.v680-main').first().click();await page.waitForSelector('#answerArea .option',{timeout:30000});await page.waitForTimeout(1800);
  const snap=()=>page.evaluate(()=>{const R=s=>{const e=document.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect();return [Math.round(b.top),Math.round(b.left),Math.round(b.width),Math.round(b.height)]};
   return {row:R('.deen-character-question-row'),avatar:R('.deen-character-question-avatar'),area:R('#answerArea'),opts:[...document.querySelectorAll('#answerArea .option')].map(o=>{const b=o.getBoundingClientRect();return [Math.round(b.top),Math.round(b.left),Math.round(b.width),Math.round(b.height)]}),
    fitted:document.getElementById('lesson').classList.contains('v9913-fitted'),scaled:getComputedStyle(document.querySelector('#lesson .question-frame')).transform!=='none',img:!!document.querySelector('.deen-character-question-avatar img')}});
  const before=await snap();
  const ok=await page.evaluate(()=>{const q=session.questions[session.index];return {a:q.correct_answer,type:String(q.activity_type||q.question_type||q.type||'')}});
  const target=page.locator('#answerArea .option').filter({hasText:ok.a}).first();const bb=await target.boundingBox();
  await page.evaluate(()=>{window.__moves=[];const f=document.querySelector('#lesson .question-frame');new MutationObserver(()=>{window.__moves.push(document.getElementById('lesson').classList.contains('v9913-fitted')||getComputedStyle(f).transform!=='none')}).observe(document.getElementById('lesson'),{attributes:true,subtree:true,attributeFilter:['class','style']})});
  await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);
  let worst=0;for(let i=0;i<14;i++){await page.waitForTimeout(150);const s=await snap();assert.equal(s.fitted,false,lang+': the lesson is never scaled after grading');assert.equal(s.scaled,false,lang+': no transform on the frame');
   for(const k of ['row','area']){assert.deepEqual(s[k]&&s[k].slice(0,3),before[k]&&before[k].slice(0,3),lang+': '+k+' moved ('+JSON.stringify(before[k])+' -> '+JSON.stringify(s[k])+')');}
   s.opts.forEach((o,i)=>assert.deepEqual(o,before.opts[i],lang+': option '+i+' moved'));assert.ok(s.img,lang+': the character stays')}
  const sheet=await page.evaluate(()=>!!document.querySelector('#feedback.show #continueBtn'));assert.equal(sheet,true,lang+': the result sheet shows');
  assert.ok(!(await page.evaluate(()=>window.__moves)).includes(true),lang+': the frame was never scaled, not even briefly');
  console.log('  ok',lang,ok.type||'choice');await ctx.close();
 }
 await browser.close();server.close();console.log('PASS: a correct answer keeps the lesson screen still (tr en de fr ar)');
})().catch(e=>{console.error(e);process.exit(1)});
