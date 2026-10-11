/* Screenshot-backed English UI regression: real segmented DEEN in Chrome.
   Exercises every stage intro and the specific premium, goal, review, feedback surfaces. */
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.env.DEEN_QA_OUTPUT||path.join(root,'qa/english-five-screens');
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const n=decodeURIComponent((req.url||'/').split('?')[0]);const p=path.resolve(root,n.replace(/^\/+/, '')||'index.html');if(!p.startsWith(root+path.sep)){res.statusCode=403;return res.end()}try{res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':p.endsWith('.json')?'application/json':'text/html');res.end(fs.readFileSync(p))}catch(e){res.statusCode=404;res.end('missing')}});
(async()=>{
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[],report={screens:[],stageIntros:[],dictionary:{}};
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__DEEN_LOCALIZATION_QA__=true;if(!localStorage.getItem('deen_v4_1_state')){localStorage.setItem('deen_app_language_v1','en');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:777,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'en',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))}});
 await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.DEEN_BOOT?.isReady(),null,{timeout:45000});
 const lang=await page.evaluate(()=>window.DEEN_APP_LOCALE?.get());assert.equal(lang,'en');
 async function show(name,fn,selector,expected=[],forbidden=[]){
  await page.evaluate(f=>eval(f),fn);await page.waitForTimeout(420);
  const t=selector==='#v5SheetBody'?await page.locator(selector).textContent():await page.locator(selector).innerText();
  expected.forEach(x=>assert(t.includes(x),name+' missing '+x+'\n'+t));
  forbidden.forEach(x=>assert(!t.includes(x),name+' untranslated '+x+'\n'+t));
  report.screens.push({name,text:t});
  await page.screenshot({path:path.join(out,name+'.png')});
  return t;
 }
 const firstMacroId=await page.evaluate(()=>DEEN_FIVE_STAGE.defs('U01')[0].id);
 assert.equal(firstMacroId,'U01-M01');
 await show('01-first-stage',"previewMacro('"+firstMacroId+"')",'#v5SheetBody',
  ['IN THIS STAGE','Get a gentle, easy introduction to this topic.','START STAGE'],
  ['Konuyla','BÖLÜME','BAŞLA','BÖLÜME START']);
 await page.evaluate(()=>closeSheet());
 const units=await page.evaluate(()=>Array.from({length:15},(_,i)=>DEEN_FIVE_STAGE.defs('U'+String(i+1).padStart(2,'0')).map(d=>d.id)).flat());
 assert.equal(units.length,75);
 for(const id of units){
  await page.evaluate(id=>{closeSheet();previewMacro(id)},id);
  await page.waitForTimeout(30);
  const text=await page.locator('.deen-intro-goal b').innerText();
  assert(!/[ÇĞİÖŞÜçğıöşü]/.test(text),'Stage goal has Turkish characters: '+id+' '+text);
  assert(!/\b(?:Konuyla|bilgiyi|öğrendiğin|doğru anlam|görmeden|uygula|hatırla|kavramları|mini derslerden|daha az)\b/i.test(text),'Stage goal still Turkish: '+id+' '+text);
  report.stageIntros.push({id,goal:text});
 }
 await page.evaluate(()=>closeSheet());
 await show('02-goal',"goalPanel()",'#v5Sheet',
  ['Choose Your Learning Pace','Light','Intensive','1 mini lesson · about 5 minutes','2 mini lessons · about 10 minutes','3 mini lessons · about 15 minutes','Changing your goal will not erase your progress'],
  ['Kendi ritmini','Hedef yalnız','Hafif','Yoğun','yaklaşık','Hedefi değiştirmek']);
 await page.evaluate(()=>closeSheet());
 await show('03-premium',"premiumPanel()",'#v5Sheet',
  ['KNOWLEDGE IS FOR EVERYONE','Premium is about comfort,','not exclusive content.','15 units and all core lessons','Section finals','FEATURE','Enable Premium preview','This prototype has no real payments'],
  ['BİLGİ HERKESE','Premium içerik','konfor katmanıdır','Dinî öğrenme','ÖZELLİK','simülasyonunu','gerçek ödeme','Gelişmiş soru']);
 await page.evaluate(()=>closeSheet());
 await page.evaluate(()=>{state.premium=true});
 await show('04-premium-active',"premiumPanel()",'#v5Sheet',
  ['Disable Premium preview','Detailed learning records'],['simülasyonunu kapat','Detaylı öğrenme kayıtları']);
 await page.evaluate(()=>{state.premium=false;closeSheet()});
 await show('05-home',"navigate('learnScreen')",'#learnScreen',[],[]);
 const samples={
  'Şimdi bilgiyi sabitle.':'Reinforce What You Learned',
  '5 soruluk adaptif tekrar, bugünkü öğrenmeyi hafızada tutmaya yardım eder.':'A five-question adaptive review helps you remember what you learned today.',
  '5 SORULUK HATIRLAMA':'5-QUESTION RECALL',
  'BÖLÜME BAŞLA':'START STAGE',
  '0/3 Task':'0/3 Tasks',
  '0/3 Görev':'0/3 Tasks',
  'Kendi ritmini seç':'Choose Your Learning Pace',
  'Premium içerik değil,':'Premium is about comfort,',
  'konfor katmanıdır.':'not exclusive content.',
  'Harika!':'Great!'
 };
 for(const [source,want]of Object.entries(samples)){
  const actual=await page.evaluate(s=>window.DEEN_ENGLISH_UI.t(s),source);assert.equal(actual,want,source);report.dictionary[source]=actual;
 }
 // Real answer feedback: the English localization observer must handle a freshly rendered
 // native feedback title (including the former untranslated 'Harika!').
 await page.evaluate(()=>{closeLesson();state.energy=30;startStage('U01-S01')});
 await page.waitForTimeout(400);
 const q=await page.evaluate(()=>session?.questions?.[0]);
 if(q&&q.activity_type==='multiple_choice'){
  const chosen=await page.evaluate(q=>{const b=[...document.querySelectorAll('#answerArea button')].find(x=>x.dataset.value===q.correct_answer||(x.querySelector('.option-label')?.textContent||x.textContent).trim()===q.correct_answer);if(b)b.dataset.qaCorrect='1';return !!b},q);
  if(chosen){await page.locator('#answerArea [data-qa-correct]').click();await page.waitForTimeout(180);}
 }
 await page.evaluate(()=>{const t=document.getElementById('feedbackTitle');if(t)t.textContent='Harika!';DEEN_ENGLISH_UI.localize(document.body)});
 const corrected=await page.locator('#feedbackTitle').innerText();assert.equal(corrected,'Great!','Screenshot feedback leak');
 await page.screenshot({path:path.join(out,'06-feedback.png')});
 report.feedback=corrected;
 assert.deepEqual(errors,[],'Browser page errors: '+errors.join(' | '));
 fs.writeFileSync(path.join(out,'five-screenshot-report.json'),JSON.stringify({report,errors},null,2));
 console.log('PASS FIVE SCREENSHOT FLOWS',JSON.stringify({realScreens:report.screens.length,stageIntros:report.stageIntros.length,phrases:Object.keys(report.dictionary).length,feedback:corrected}));
 await browser.close();server.close();
})().catch(err=>{console.error(err);server.close();process.exit(1)});
