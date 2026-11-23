/* Level-up screen (assets/design/motion.js dressLevel + motion.css): the new level as a big gold medal, a "level up"
   kicker, the Sparkles reward as one chip (not repeated in the detail line), a gold continue button, and the title in the
   learner's language (the engine writes "Seviye 2 → 3"). */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const want={tr:['SEVİYE ATLADIN',/^Seviye 2/],en:['LEVEL UP',/^Level 2/],ar:['ارتقيت مستوى',/^المستوى 2/]};
 for(const lang of Object.keys(want)){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
  await ctx.addInitScript(l=>{localStorage.setItem('deen_app_language_v1',l);localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,profile:{name:'QA',companion:'cat'},settings:{language:l,onboardingLanguageConfirmed:true},completed:[]}))},lang);
  const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2500);
  await page.evaluate(()=>celebrate({type:'level_up',id:'L3',from:2,to:3,amount:5,title:'Seviye 2 → 3',detail:'Bir adım daha ilerledin. · +5 Pırıltı'}));await page.waitForTimeout(1500);
  const r=await page.evaluate(()=>{const d=document.querySelector('dialog.gf-reward-modal[open]');if(!d)return null;const smalls=[...d.querySelectorAll(':scope>div>small')].map(x=>x.textContent.trim()).filter(Boolean);
   return {cls:d.className,num:d.querySelector('.ds-level-num')?.textContent,kicker:d.querySelector('.ds-level-kicker')?.textContent,title:d.querySelector(':scope>div>b')?.textContent.trim(),
    reward:d.querySelector('.ds-level-reward')?.textContent.trim(),smalls,btn:getComputedStyle(d.querySelector('.gf-reward-close')).backgroundImage.slice(0,30),bg:getComputedStyle(d).backgroundImage.slice(0,20)}});
  assert.ok(r,lang+': level-up dialog open');assert.match(r.cls,/ds-level/,lang+': level design');
  assert.equal(r.num,'3',lang+': the new level on the medal');assert.equal(r.kicker,want[lang][0],lang+': kicker');assert.match(r.title,want[lang][1],lang+': title in the learner\'s language: '+r.title);
  assert.ok(r.reward&&/\+\s*5/.test(r.reward),lang+': reward chip');assert.equal(r.smalls.filter(t=>/\+\s*5/.test(t)).length,1,lang+': the reward appears once: '+JSON.stringify(r.smalls));
  assert.match(r.btn,/gradient/,lang+': gold continue button');assert.match(r.bg,/gradient/,lang+': indigo card');
  console.log('  ok',lang,JSON.stringify({title:r.title,smalls:r.smalls}));await ctx.close();
 }
 await browser.close();server.close();console.log('PASS: level-up screen design');
})().catch(e=>{console.error(e);process.exit(1)});
