/* Liquid Glass tab bar: on an iPhone whose WebKit has the iOS 26 features (anchor positioning / scroll-driven animations)
   the bottom bar becomes a floating translucent capsule with a blurred backdrop, content scrolls underneath it, and the
   active tab gets a sliding glass lens; on other platforms nothing changes. Headless Chrome has both features, so an iPhone user
   agent stands in for iOS 26+ and a desktop user agent for everything else. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
const IPHONE='Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 for(const [name,ua,want] of [['iphone',IPHONE,true],['desktop',null,false]]){
  const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block',...(ua?{userAgent:ua,isMobile:true,hasTouch:true}:{})});
  await ctx.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,profile:{name:'QA',companion:'cat'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))});
  const page=await ctx.newPage();await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2500);
  const r=await page.evaluate(()=>{const n=document.querySelector('nav.bottomnav'),c=getComputedStyle(n),b=n.getBoundingClientRect(),a=n.querySelector('.navbtn.active');
   const sc=document.querySelector('#learnScreen>.scroll').getBoundingClientRect();
   return {glass:document.documentElement.classList.contains('ilnura-glass'),left:b.left,radius:parseFloat(c.borderTopLeftRadius),blur:(c.backdropFilter||c.webkitBackdropFilter||''),
    scrollBottom:sc.bottom,phoneBottom:document.querySelector('.phone').getBoundingClientRect().bottom,navBottom:b.bottom,
    lens:(()=>{const l=n.querySelector('.ilnura-glass-lens');if(!l)return null;const lr=l.getBoundingClientRect(),ar=a.getBoundingClientRect();return {bg:getComputedStyle(l).backgroundImage.slice(0,15),offset:Math.round(Math.abs(lr.left+lr.width/2-(ar.left+ar.width/2)))}})()}});
  assert.equal(r.glass,want,name+': glass mode '+(want?'on':'off'));
  if(want){
   assert.ok(r.left>=10,'floating capsule inset from the edge: '+r.left);assert.ok(r.radius>=28,'capsule radius '+r.radius);
   assert.match(r.blur,/blur\(/,'blurred backdrop');assert.ok(r.scrollBottom>=r.navBottom,'content scrolls under the bar');
   assert.ok(r.navBottom<r.phoneBottom,'the bar floats above the bottom edge');assert.ok(r.lens&&/gradient/.test(r.lens.bg),'a glass lens is drawn');assert.ok(r.lens.offset<=3,'the lens sits under the active tab: '+r.lens.offset);
  }else{assert.ok(r.left<2,'the regular bar stays full width');assert.equal(r.lens,null,'no lens outside glass mode')}
  console.log('  ok',name,JSON.stringify(r));await ctx.close();
 }
 await browser.close();server.close();console.log('PASS: Liquid Glass tab bar on iOS 26+, unchanged elsewhere');
})().catch(e=>{console.error(e);process.exit(1)});
