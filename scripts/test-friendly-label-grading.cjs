/* The youth wording shortens some option labels ("İman = inanç; ibadet = kulluk davranışı"). Tapping the right card must still be graded correct. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const assert=require('node:assert/strict');const root=path.resolve(__dirname,'..');const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.jpg':'image/jpeg','.mp3':'audio/mpeg','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
const b=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true});
await ctx.addInitScript(()=>{if(!sessionStorage.getItem('s')){sessionStorage.setItem('s','1');localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,learningProfile:'youth',profile:{name:'QA',companion:'cat'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))}});
const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(3000);
// start a session containing the question
await page.evaluate(()=>{const q=QUESTIONS.find(x=>x.id==='DEEN-U01-S03-004');const st=STAGES.find(s=>s.id==='U01-S03');startStage('U01-S03');});
await page.waitForTimeout(1500);
assert.ok(true);for(let i=0;i<14;i++){const id=await page.evaluate(()=>session?.questions[session.index]?.id);if(id==='DEEN-U01-S03-004')break;await page.evaluate(()=>{const q=session.questions[session.index];try{completeQuestion(true,q)}catch(e){}try{nextQuestion()}catch(e){}});await page.waitForTimeout(500)}
console.log('at',await page.evaluate(()=>session?.questions[session.index]?.id));
await page.waitForSelector('#answerArea .option',{timeout:8000}).catch(()=>{});
await page.locator('#answerArea .option',{hasText:'= inanç'}).first().click();await page.waitForTimeout(300);
await page.waitForTimeout(500);

const cta=page.locator('#lesson button:has-text("Kontrol Et")').first();await cta.click({timeout:3000}).catch(e=>console.log('nocta'));await page.waitForTimeout(900);
const res=await page.evaluate(()=>({fb:document.getElementById('feedback')?.className,txt:document.getElementById('feedback')?.textContent.replace(/\s+/g,' ').slice(0,80),sel:currentChoiceSelection?.value,ca:session.questions[session.index]?.correct_answer}));assert.ok(/✓|Harika/.test(res.txt)&&!/Birlikte düzeltelim/.test(res.txt),'the right card with a shortened label is graded correct: '+res.txt);console.log('PASS: shortened labels grade correctly');
await b.close();server.close()})().catch(e=>{console.error(e);process.exit(1)});
