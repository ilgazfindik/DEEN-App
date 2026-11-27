// New Learn-path units (U16+): hidden by default (expert review pending); with the admin switch on they follow U15 on the
// path under their own section, open after the section 3 final, and every mini lesson of U16 can be played to the end.
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.avif':'image/avif','.txt':'text/plain','.mp3':'audio/mpeg','.m4a':'audio/mp4'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
const done=[];for(let u=1;u<=15;u++)for(let s=1;s<=7;s++)done.push(`U${String(u).padStart(2,'0')}-S0${s}`);
async function open(browser,url,{lang='tr',flag=true,final3=true}={}){
 const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
 await ctx.addInitScript(([d,lang,flag,final3])=>{window.DEEN_PREMIUM_OFFER={open(){return false},close(){},sync(){},isTrialActive(){return false},isTrialUsed(){return false}};localStorage.setItem('deen_app_language_v1',lang);if(flag)localStorage.setItem('deen_admin_units_plus','1');const f={completed:true,bestScore:90,rank:'USTALIK',attempts:1};localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,premium:true,energy:30,xp:420,currency:120,profile:{name:'QA',companion:'lion'},settings:{language:lang,onboardingLanguageConfirmed:true},completed:d,mistakes:[],sectionFinal:f,section2Final:f,section3Final:final3?f:{completed:false,bestScore:0,attempts:0}}))},[done,lang,flag,final3]);
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2500);
 return {page,ctx,errors};
}
async function answerAll(page,label){
 let answered=0;
 while(await page.evaluate(()=>!!session&&session.index<session.questions.length)&&await page.locator('#quizView:visible').count()){
  await page.waitForTimeout(250);if(await page.locator('.v910-overlay .v910-card-button').count())await page.locator('.v910-overlay .v910-card-button').click();
  const q=await page.evaluate(()=>session.questions[session.index]),area=page.locator('#answerArea');
  assert(/^DEEN-U16-S0\d-X\d{3}$/.test(q.id),label+': question from U16 '+q.id);
  if(q.activity_type==='matching'){for(let i=0;i<q.pairs.length;i++){await area.locator('[data-side="left"][data-pair="'+i+'"]').click();await area.locator('[data-side="right"][data-pair="'+i+'"]').click()}}
  else if(await area.locator('input:visible').count()){await area.locator('input:visible').fill(q.correct_answer);await area.locator('button:not([disabled])').last().click()}
  else{await page.evaluate(answer=>{const b=[...document.querySelectorAll('#answerArea button')].find(x=>x.dataset.value===answer||(x.querySelector('.option-label')?.textContent||x.textContent).trim()===answer);if(b)b.dataset.qaAnswer='1'},q.correct_answer);await area.locator('[data-qa-answer]').click();if(!await page.locator('#feedback.show').count()){const c=area.locator('.v710-action:not([disabled]),.template-action:not([disabled])').last();if(await c.count())await c.click()}}
  await page.waitForSelector('#feedback.show');assert(await page.evaluate(()=>!document.getElementById('feedback').classList.contains('wrong')),label+': graded correct '+q.id);
  const previous=await page.evaluate(()=>session.index);await page.locator('#continueBtn').click();
  await page.waitForFunction(i=>!session||session.index>i||document.getElementById('resultView').classList.contains('show'),previous);answered++;assert(answered<40);
 }
 return answered;
}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 const browser=await chromium.launch();
 try{
  // Default: hidden.
  {const {page,ctx,errors}=await open(browser,url,{flag:false});
   const r=await page.evaluate(()=>({len:U.length,units:document.querySelectorAll('#v5Paths section.restored-unit').length,live:DEEN_UNITS_PLUS.live,stages:STAGES.length}));
   assert.deepEqual(r,{len:15,units:15,live:false,stages:105},'new units stay hidden without the admin switch');
   assert.deepEqual(errors,[]);await ctx.close();console.log('hidden by default ok');}
  // Switch on, section 3 final not passed: U16 is on the path but locked.
  {const {page,ctx}=await open(browser,url,{final3:false});
   const r=await page.evaluate(()=>DEEN_FIVE_STAGE.state('U16-M01'));assert.equal(r.locked,true,'U16 waits for the section 3 final');await ctx.close();console.log('locked before final ok');}
  // Switch on, Turkish: path, divider and a full play-through of U16.
  {const {page,ctx,errors}=await open(browser,url);
   const meta=await page.evaluate(()=>window.DEEN_UNITS_PLUS_META.units.map(m=>m.unit));
   const r=await page.evaluate(()=>({len:U.length,units:document.querySelectorAll('#v5Paths section.restored-unit').length,title:document.querySelector('#v5Unit16 h1')?.textContent,divider:document.querySelector('.units-plus-section')?.textContent,next:DEEN_FIVE_STAGE.state('U16-M01')}));
   assert.equal(r.len,15+meta.length);assert.equal(r.units,15+meta.length);assert.equal(r.title,'Zekât ve Sadaka');
   assert.equal(r.divider,'KISIM 4 · İBADET HAYATI VE KUR’AN');assert.equal(r.next.locked,false);assert.equal(r.next.current,true);
   for(let m=1;m<=5;m++){
    const id='U16-M0'+m;let guard=0;
    while(!(await page.evaluate(id=>DEEN_FIVE_STAGE.done(id),id))){
     await page.evaluate(id=>{closeLesson?.();state.energy=30;startMacroStage(id)},id);await page.waitForSelector('#quizView:visible',{timeout:8000});
     const n=await answerAll(page,id);assert(n>=4,id+' lesson length '+n);
     await page.waitForTimeout(400);await page.evaluate(()=>{try{finishLesson()}catch(_){}});await page.waitForTimeout(300);
     assert(++guard<=5,id+' finishes');
    }
    console.log(id,'done');
   }
   const fin=await page.evaluate(()=>['S01','S02','S03','S04','S05','S06','S07'].every(s=>state.completed.includes('U16-'+s)));
   assert(fin,'all U16 legacy stages are completed');
   if(meta.length>1){const nx=await page.evaluate(()=>DEEN_FIVE_STAGE.state('U17-M01'));assert.equal(nx.current,true,'U17 opens after U16')}
   assert.deepEqual(errors,[]);await ctx.close();}
  console.log('Units plus ok');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exit(1)});
