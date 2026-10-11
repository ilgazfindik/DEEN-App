/* Independent read-only Chrome sweep, with disposable profile and screen-level evidence. */
const {chromium}=require('playwright');
const fs=require('fs'),http=require('http'),path=require('path');
const root=path.resolve(__dirname,'..'),scope=process.env.DEEN_AUDIT_SCOPE||'screens';
const out=process.env.DEEN_QA_OUTPUT||path.join(root,'qa','sectional');fs.mkdirSync(out,{recursive:true});
const serve=http.createServer((req,res)=>{const p=path.resolve(root,decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\/+/,'')||'index.html');if(!p.startsWith(root+path.sep)){res.writeHead(403);return res.end()}try{res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':p.endsWith('.json')?'application/json':'text/html');res.end(fs.readFileSync(p))}catch(e){res.writeHead(404);res.end()}});
const report={scope,started:new Date().toISOString(),surfaces:[],errors:[],actions:[]};let browser,page;
const turkish=/\b(?:Animasyon|Dokunsal geri bildirim|Hareketi azalt|[0-9]+\s*dk\b|Görevler|Haftalık|Günlük|Ders|Aşama|Soru|Sonraki|Sıradaki|Tekrar|Kapat|Devam|Başla|Bölüm|Ödül|YENİ|Hazır|Yanlış|Doğru)\b/i;
const grammars=/\b1\s+missed\s+days\b|\b90\s+verse\b|\b1\s+lessons\b|(?:[0-9]\/3·|rhythm[0-9]+\/[0-9]+)/i;
async function capture(name,selector,shot=false){
 await page.waitForTimeout(220);
 const found=await page.evaluate(sel=>{const root=sel?document.querySelector(sel):document.body;if(!root)return {missing:sel,texts:[]};const vis=el=>{if(!el||!el.getClientRects().length)return false;let s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'};const t=[],walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){const el=n.parentElement;if(!vis(el)||el.closest('script,style,noscript,code,[data-deen-no-translate],.deen-ikhlas-arabic,.deen-mem-arabic,.deen-qj2-ar'))continue;let x=n.nodeValue.trim();if(x)t.push(x)}for(const el of root.querySelectorAll('[aria-label],[title],[placeholder]'))if(vis(el))for(const att of ['aria-label','title','placeholder']){let v=el.getAttribute(att);if(v)t.push(att+': '+v)}return {texts:[...new Set(t)],lang:document.documentElement.lang,active:document.querySelector('.screen.active')?.id}},selector);
 const text=found.texts||[];const findings=text.filter(x=>/[ÇĞİÖŞÜçğıöşü]/.test(x)||turkish.test(x)||grammars.test(x)).map(x=>({text:x,type:/[ÇĞİÖŞÜçğıöşü]/.test(x)?'tr-chars':turkish.test(x)?'tr-ascii':'grammar'}));
 report.surfaces.push({name,selector,lang:found.lang,active:found.active,missing:found.missing||null,strings:text.length,findings,text:text.slice(0,90)});
 console.log('AUDIT_SURFACE',JSON.stringify({name,count:text.length,findings}));
 if(shot)try{await page.screenshot({path:path.join(out,scope+'-'+name.replace(/[^a-z0-9-]/gi,'-')+'.png')})}catch(e){report.errors.push('shot '+name+': '+e.message)}
}
async function action(name,code,arg){try{const r=await page.evaluate(([s,v])=>v===null?eval(s):eval(s.replaceAll('__ARG__',JSON.stringify(v))),[code,arg===undefined?null:arg]);report.actions.push({name,ok:true,value:r});return r}catch(e){report.actions.push({name,ok:false,error:String(e)});console.log('ACTION_FAILURE',name,String(e));return null}}
(async()=>{
 await new Promise(r=>serve.listen(0,'127.0.0.1',r));browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>report.errors.push(e.message));
 await page.addInitScript(()=>{window.__DEEN_LOCALIZATION_QA__=true;if(!localStorage.getItem('deen_v4_1_state')){localStorage.setItem('deen_app_language_v1','en');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:777,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'en',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))}});
 await page.goto('http://127.0.0.1:'+serve.address().port);await page.waitForFunction(()=>window.DEEN_BOOT?.isReady(),null,{timeout:60000});report.build=await page.evaluate(()=>DEEN_BOOT.status());
 if(scope==='screens'){
  for(const [name,id]of [['learning','learnScreen'],['review','reviewScreen'],['quran','leagueScreen'],['profile','profileScreen']]){await action(name,'navigate('+JSON.stringify(id)+')');await capture(name,'#'+id,true)}
  for(const [name,expr]of [['settings','settingsPanel()'],['store','storePanel()'],['streak','streakPanel()'],['level','xpPanel()']]){await action(name,expr);await capture(name,'#v5Sheet',true);await action('close-'+name,'closeSheet()')}
  await action('to-quran',"navigate('leagueScreen')");
  const nav=await page.locator('#leagueScreenBody [data-qia-nav] button').allInnerTexts();
  for(let i=0;i<nav.length;i++){await page.locator('#leagueScreenBody [data-qia-nav] button').nth(i).click();await capture('quran-tab-'+(i+1)+'-'+nav[i],'#leagueScreenBody',i===0)}
 }else if(scope==='units'){
  await action('unlock-test-state','state.completed=STAGES.map(s=>s.id);state.energy=30;state.sectionFinal={completed:true};state.section2Final={completed:true};DEEN_FIVE_STAGE.sync()');
  const defs=await page.evaluate(()=>Array.from({length:15},(_,i)=>{const unit='U'+String(i+1).padStart(2,'0');return {unit,ids:DEEN_FIVE_STAGE.defs(unit).map(x=>x.id)}}));
  for(const {unit,ids}of defs){report.actions.push({name:'unit-'+unit,ok:ids.length===5,ids});
   for(let i=0;i<ids.length;i++){const macro=ids[i];await action('preview-'+macro,'previewMacro(__ARG__)',macro);await capture(macro+'-intro','#v5Sheet',i===0);await action('close','closeSheet()');await action('start-'+macro,'state.energy=30;session=null;startMacroStage(__ARG__)',macro);await capture(macro+'-question','#lesson',i===0);await action('feedback-'+macro,'if(session)completeQuestion(false,session.questions[session.index])');await capture(macro+'-feedback','#feedback');await action('end','closeLesson()')}
  }
 }else if(scope==='quran'){
  for(const id of ['fatiha','ihlas','falaq','nas','kafirun','nasr','masad','fil','quraysh','maun','sharh','tin','bayyina','zilzal','kawthar','asr']){await action('open-'+id,'DEEN_QURAN.openSurah(__ARG__)',id);await capture(id+'-journey',null,true);await action('learn-'+id,"DEEN_QURAN_JOURNEY_V2.startStage('learn')");await capture(id+'-learn',null);await action('close','closeSheet()')}
  for(const type of ['fill_blank','continuation','surah','audio','next_ayah','ayah_number','meaning']){await action('arena-'+type,'DEEN_QURAN_QUESTION_ARENA.open(__ARG__,"all")',type);await capture('arena-'+type,null,type==='fill_blank');await action('close','closeSheet()')}
 }else throw Error('Unsupported scope '+scope);
})().catch(e=>{report.errors.push('FATAL '+String(e));console.log('FATAL',String(e))}).finally(async()=>{
 report.finished=new Date().toISOString();report.total=report.surfaces.length;report.suspects=report.surfaces.reduce((n,x)=>n+x.findings.length,0);fs.writeFileSync(path.join(out,'sectional-'+scope+'.json'),JSON.stringify(report,null,2));console.log('AUDIT_SUMMARY',JSON.stringify({scope,total:report.total,suspects:report.suspects,errors:report.errors,failedActions:report.actions.filter(x=>!x.ok).slice(0,30)}));try{await browser?.close()}catch(e){}serve.close();
});