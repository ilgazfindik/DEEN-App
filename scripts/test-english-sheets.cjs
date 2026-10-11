/* Real Chrome UI assertions for English Streak, XP, settings, profile and shop.
   Uses a disposable local profile; no changes to user progress or main branch. */
const {chromium}=require('playwright'),fs=require('fs'),http=require('http'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.env.DEEN_QA_OUTPUT||path.join(root,'qa/english-sheets');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const name=decodeURIComponent(req.url.split('?')[0]);const file=path.join(root,name==='/'?'index.html':name);try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.json')?'application/json':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file))}catch(e){res.writeHead(404);res.end('missing')}});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],report={};
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.log('BROWSER',m.text())});
 await page.addInitScript(()=>{window.__DEEN_LOCALIZATION_QA__=true;if(!localStorage.getItem('deen_v4_1_state')){localStorage.setItem('deen_app_language_v1','en');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:777,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'en',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))}});
 await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.DEEN_BOOT?.isReady(),null,{timeout:45000});
 async function surface(name,expression,selector,required,forbidden){
  await page.evaluate(expr=>eval(expr),expression);
  await page.waitForTimeout(520);
  const text=await page.locator(selector).innerText();
  for(const phrase of required)assert(text.includes(phrase),name+' missing "'+phrase+'"\n'+text);
  if(name==='xp')assert(text.includes('You will earn +5 Sparkles at the next level.'),'XP reward sentence is grammatically broken: '+text);
  if(name==='streak')assert(!text.includes('chestComplete'),'Weekly chest title is joined to description: '+text);

  for(const phrase of forbidden)assert(!text.includes(phrase),name+' Turkish/mixed text "'+phrase+'"\n'+text);
  report[name]=text;
  await page.screenshot({path:path.join(out,'english-'+name+'.png')});
  console.log('SHEET VERIFIED',name,JSON.stringify({length:text.length,required:required.length}));
  if(name!=='profile')await page.evaluate(()=>closeSheet());
 }
 await surface('streak','streakPanel()','#v5Sheet',['One Step Every Day','Current streak','Longest streak','Streak protection','Next streak milestone','Mon','Tue','Wed','Thu','Fri','Sat','Sun','3 days until the 3-day streak milestone'],['Her days','seninle','seri kilometre','seri koruması','Çar','güne 3','kaldı','ibadet puanı değildir']);
 await surface('xp','xpPanel()','#v5Sheet',['You will earn','at the next level.','XP measures learning, quizzes and review activities only.','When you repeat the same lesson on the same day'],['Bir sonraki','kazanırsın','Aynı lessons','İbadetlere','tekrarlandığında']);
 await surface('settings','settingsPanel()','#v5Sheet',['Animations','Haptic feedback','Reduce motion'],['Animasyon','Dokunsal geri bildirim','Hareketi azalt']);
 await surface('store','storePanel()','#v5Sheet',['1 missed day · Maximum 2'],['missed days','kaçırılan','En fazla']);
 await surface('profile',"navigate('profileScreen')",'#profileScreenBody',['2 mini lessons · 10 min'],['mini lessons · 10 dk']);
 assert.deepEqual(errors,[],errors.join('\n'));
 fs.writeFileSync(path.join(out,'english-sheets.json'),JSON.stringify({report,errors},null,2));
 console.log('PASS ENGLISH SHEETS',JSON.stringify(Object.fromEntries(Object.entries(report).map(([k,v])=>[k,v.length]))));
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
