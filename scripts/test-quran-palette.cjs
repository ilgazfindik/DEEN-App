/* The Quran tab wears the game's palette: indigo ground, a blue "learn Arabic" card and a gold surah card with their own buttons,
   and inside the Arabic course the unit card is blue and the letter orbs are blue instead of mint. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',isMobile:true,hasTouch:true});
 await ctx.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,streak:3,learningProfile:'adult',profile:{name:'QA',companion:'lion'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))});
 const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(3500);
 await page.locator('.navbtn').nth(2).click();await page.waitForSelector('.deen-path-arabic',{timeout:20000});await page.waitForTimeout(1200);
 const css=(s,p)=>page.evaluate(([s,p])=>{const e=document.querySelector(s);return e?getComputedStyle(e)[p]:null},[s,p]);
 assert.match(await css('#phone','backgroundImage'),/linear-gradient/,'indigo ground');
 assert.doesNotMatch(await css('.deen-path-arabic','backgroundImage'),/63, 215, 173/,'the Arabic card has no teal glow left');
 const a=await css('.deen-path-arabic .deen-path-link','backgroundImage'),s=await css('.deen-path-surah .deen-path-link','backgroundImage');
 assert.ok(/linear-gradient/.test(a)&&/linear-gradient/.test(s)&&a!==s,'each card has its own button');
 await page.locator('.deen-path-arabic').first().click();await page.waitForSelector('.dsq-unit',{timeout:20000});await page.waitForTimeout(1200);
 const unit=await css('.dsq-unit:not(.is-locked)','backgroundImage');assert.ok(/74, 134, 232|47, 85, 184/.test(unit),'the Arabic unit card is blue ('+unit.slice(0,80)+')');
 const orb=await css('.deen-path-course-glyphs','backgroundImage');assert.ok(/143, 188, 255|79, 141, 240/.test(orb),'the letter orbs are blue ('+orb.slice(0,80)+')');
 // the question arena and its quiz screens are indigo too (they were teal)
 await page.locator('.navbtn').nth(0).click();await page.waitForTimeout(500);await page.locator('.navbtn').nth(2).click();await page.waitForTimeout(800);
 if(!(await page.locator('.deen-path-surah').count())){await page.evaluate(()=>{document.querySelector('.deen-path-back')?.click()});await page.waitForTimeout(800)}
 await page.locator('.deen-path-surah').first().click();await page.waitForSelector('.dsr-tool.is-wide',{timeout:20000});
 const tool=await css('.dsr-tool:not(.is-wide)','backgroundImage');assert.doesNotMatch(tool,/13, 40, 44|63, 215, 173/,'the practice tool cards are not teal ('+tool.slice(0,60)+')');
 await page.locator('.dsr-tool.is-wide').first().click();await page.waitForSelector('.dsa-level',{timeout:15000});await page.waitForTimeout(700);
 assert.doesNotMatch(await css('.dsa','backgroundImage'),/23, 80, 76|7, 41, 51/,'the arena ground is indigo, not teal');
 const lv1=await css('.dsa-level','backgroundImage');assert.match(lv1,/143, 188, 255|74, 134, 232/,'Kolay is blue ('+lv1.slice(0,60)+')');
 await page.locator('.dsa-level').first().click();await page.waitForSelector('.dac-opt',{timeout:15000});await page.waitForTimeout(600);
 const dac=await css('.dac','backgroundImage');assert.match(dac,/20, 33, 63|12, 26, 51/,'the quiz ground is the game navy ('+dac.slice(0,80)+')');
 const opt=await css('.dac-opt','backgroundImage');assert.match(opt,/27, 44, 82/,'quiz options use the card gradient');
 await browser.close();server.close();console.log('PASS: Quran palette');
})().catch(e=>{console.error(e);process.exit(1)});
