/* Streak protection card + streak repair, in a real browser against a seeded learner. */
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');const types={'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.txt':'text/plain','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(root,p);fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});r.end(b)})});
const pad=n=>String(n).padStart(2,'0'),key=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()),ago=n=>{const d=new Date();d.setDate(d.getDate()-n);return key(d)};
async function run(base,browser,seed,label){
 const ctx=await browser.newContext({serviceWorkers:'block'}),pg=await ctx.newPage(),errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.addInitScript(s=>{if(sessionStorage.getItem('seeded'))return;sessionStorage.setItem('seeded','1');localStorage.setItem('deen_app_language_v1','en');localStorage.setItem('deen_v4_1_state',JSON.stringify(s.state));if(s.guard)localStorage.setItem('deen_streak_guard',JSON.stringify(s.guard));if(s.trial)localStorage.setItem('deen_premium_trial_v1',JSON.stringify({used:true,startedAt:Date.now()}))},seed);
 await pg.goto(base,{waitUntil:'load'});
 return {ctx,pg,errs};
}
(async()=>{await new Promise(r=>srv.listen(0,r));const base='http://localhost:'+srv.address().port+'/';const browser=await chromium.launch();
 const st=(streak,last,extra={})=>({onboarded:true,xp:200,name:'T',completed:[],mistakes:[],settings:{},profile:{name:'T',companion:'owl'},currency:60,streak,streakMeta:{lastStudyDate:last,currentStreak:streak,longestStreak:streak,streakFreeze:0,weeklyActivity:{},freezeDates:[]},...extra});
 // 1) streak waiting today: card visible, with shop shortcut
 let a=await run(base,browser,{state:st(4,ago(1))},'risk');
 await a.pg.waitForSelector('#dsStreakGuard',{timeout:60000});
 const cardTxt=await a.pg.textContent('#dsStreakGuard');assert(/4-day streak/.test(cardTxt),'card names the streak: '+cardTxt);
 assert(await a.pg.evaluate(()=>document.getElementById('dsStreakGuard').nextElementSibling?.id==='v5Return'&&document.getElementById('dsStreakGuard').previousElementSibling?.id==='v5Stats'),'card sits between the stats header and the next-step card');
 await a.pg.click('#dsStreakGuard [data-dsg="buy"]');await a.pg.waitForTimeout(400);
 const fz=await a.pg.evaluate(()=>[state.streakMeta.streakFreeze,state.currency]);assert.deepStrictEqual(fz,[1,40],'one freeze bought for 20');
 await a.ctx.close();
 // 2) broken streak (3 days away, no freeze): repair offered and restores
 a=await run(base,browser,{state:st(6,ago(3)),guard:{v:6,last:ago(3)}},'lost');
 await a.pg.waitForSelector('[data-dsg="repair"]',{timeout:60000});
 await a.pg.click('[data-dsg="repair"]');await a.pg.waitForTimeout(500);
 const rep=await a.pg.evaluate(()=>[state.streak,state.streakMeta.currentStreak,state.currency,state.streakMeta.freezeDates.length]);
 assert.deepStrictEqual(rep,[6,6,35,2],'streak restored for 25, two missed days marked');
 await a.ctx.close();
 // 3) too poor: button disabled, nothing charged
 a=await run(base,browser,{state:st(6,ago(3),{currency:5}),guard:{v:6,last:ago(3)}},'poor');
 await a.pg.waitForSelector('[data-dsg="repair"]',{timeout:60000});
 assert(await a.pg.isDisabled('[data-dsg="repair"]'),'repair disabled without enough sparkles');
 await a.ctx.close();
 // 3b) Premium: free repair once a week (no sparkles charged), then it costs again
 a=await run(base,browser,{state:st(6,ago(3),{currency:5}),guard:{v:6,last:ago(3)},trial:true},'premium');
 await a.pg.waitForSelector('[data-dsg="repair"]',{timeout:60000});
 assert(!(await a.pg.isDisabled('[data-dsg="repair"]')),'premium repair enabled with 5 sparkles');
 await a.pg.click('[data-dsg="repair"]');await a.pg.waitForTimeout(500);
 const prem=await a.pg.evaluate(()=>[state.streak,state.currency,localStorage.getItem('deen_streak_free_repair')]);
 assert.deepStrictEqual(prem.slice(0,2),[6,5],'premium repair is free');assert(prem[2],'free repair date remembered');
 await a.ctx.close();
 // 4) long gap (10 days): no offer
 a=await run(base,browser,{state:st(6,ago(10)),guard:{v:6,last:ago(10)}},'old');
 await a.pg.waitForTimeout(8000);assert.strictEqual(await a.pg.locator('[data-dsg="repair"]').count(),0,'no repair offer after a long gap');
 assert.deepStrictEqual(a.errs,[]);await a.ctx.close();
 await browser.close();srv.close();console.log('Streak protection ok');})().catch(e=>{console.error(e);process.exit(1)});
