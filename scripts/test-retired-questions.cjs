/* Retired (duplicate) questions are never offered, and no exact duplicate is left in the pool. Real browser. */
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');const types={'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.txt':'text/plain','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(root,p);fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});r.end(b)})});
const retired=JSON.parse(fs.readFileSync(path.join(root,'scripts/learn-extra/retired.json'),'utf8')).ids;
(async()=>{await new Promise(r=>srv.listen(0,r));const base='http://localhost:'+srv.address().port+'/';const b=await chromium.launch();
 const pg=await (await b.newContext({serviceWorkers:'block'})).newPage(),errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.addInitScript(()=>{if(sessionStorage.getItem('s'))return;sessionStorage.setItem('s','1');localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,xp:1,name:'T',completed:[],mistakes:[],settings:{},profile:{name:'T',companion:'owl'}}))});
 await pg.goto(base,{waitUntil:'load'});await pg.waitForSelector('#v5Return .v680-nba',{timeout:60000});await pg.waitForTimeout(2000);
 const r=await pg.evaluate(retiredIds=>{
  state.completed=[...new Set(QUESTIONS.map(q=>q.stage_id))];
  const pool=reviewPool('smart');
  const set=window.DEEN_RETIRED_IDS;
  const key=q=>JSON.stringify([q.question_tr,q.pairs?q.pairs.map(p=>[p.left,p.right]):q.options_tr&&[...q.options_tr].sort(),q.correct_answer]);
  const seen=new Map(),dups=[];for(const q of pool){const k=key(q);if(seen.has(k))dups.push([seen.get(k),q.id]);else seen.set(k,q.id)}
  return {size:set&&set.size,retiredInPool:pool.filter(q=>set.has(q.id)).map(q=>q.id),poolSize:pool.length,
   allRetiredKnown:retiredIds.every(i=>set.has(i)),extraCount:(window.DEEN_EXTRA_QUESTIONS||[]).length,dups};
 },retired);
 assert.strictEqual(r.size,retired.length,'retired list is in the engine');
 assert(r.allRetiredKnown,'every id in retired.json is in the engine');
 assert.deepStrictEqual(r.retiredInPool,[],'no retired question in the review pool');
 assert.strictEqual(r.extraCount,496,'496 extra questions');
 assert.deepStrictEqual(r.dups,[],'no exact duplicate left in the pool: '+JSON.stringify(r.dups.slice(0,5)));
 assert(r.poolSize>1500,'pool still large: '+r.poolSize);
 // Real lessons of units 11-15 (every macro stage): none of the questions the engine picks is retired.
 const lessons=await pg.evaluate(()=>{
  state.completed=[...new Set(QUESTIONS.map(q=>q.stage_id))];state.energy=30;state.premium=true;state.sectionFinal={completed:true};state.section2Final={completed:true};state.section3Final={completed:true};
  const out=[];const defs=DEEN_FIVE_STAGE.all().filter(d=>/^U(01|02|04|05|06|07|1[1-5])/.test(d.id));
  for(const d of defs){try{startMacroStage(d.id);const qs=(session&&session.questions)||[];out.push({id:d.id,n:qs.length,bad:qs.filter(q=>DEEN_RETIRED_IDS.has(q.id)).map(q=>q.id)});try{closeLesson()}catch(e){}}catch(e){out.push({id:d.id,err:String(e).slice(0,80)})}}
  return out});
 assert(lessons.length>=30,'macro stages found: '+lessons.length);
 for(const l of lessons){assert(!l.err,l.id+' '+l.err);assert.deepStrictEqual(l.bad,[],l.id+' offers retired questions');assert(l.n>=5,l.id+' has '+l.n+' questions')}
 // A retired question that is still in a learner's saved lesson plays like any other question (no "media unavailable" panel).
 const shown=await pg.evaluate(id=>{const q=QUESTIONS.find(x=>x.id===id);session={stage:STAGES.find(s=>s.id===q.stage_id),questions:[q],index:0,correct:0,combo:0,bestCombo:0,startedAt:Date.now(),v5responses:[]};document.getElementById('lesson').classList.add('active');document.getElementById('quizView').style.display='flex';resetResultView(false);renderQuestion();return {text:document.getElementById('answerArea').innerText,opts:q.options_tr||[],blocked:audioBlocked(q)}},retired.find(i=>/U11-S01/.test(i))||retired[0]);
 assert.strictEqual(shown.blocked,false,'retired questions are not audio-blocked');
 assert(shown.opts.length>0&&shown.opts.every(o=>shown.text.includes(o)),'retired question still renders its options');
 assert.deepStrictEqual(errs,[]);await b.close();srv.close();console.log('Retired questions ok:',r.size,'retired · pool',r.poolSize,'· lessons checked',lessons.length);})().catch(e=>{console.error(e);process.exit(1)});
