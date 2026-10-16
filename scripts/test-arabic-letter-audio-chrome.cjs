/* DEEN Arabic letter-name audio: real Chrome MP3 decode and UI regression.
 * This test runs against the isolated PR branch and does not approve pronunciations.
 */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http'),path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'..');
const audioFolder=path.join(root,'assets/quran/audio/arabic-learning');
const html='<!doctype html><html lang="tr"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="originalSurah">Surah learning</button></div></div></div></body></html>';
const server=http.createServer((request,response)=>{
 const pathname=new URL(request.url,'http://localhost').pathname;
 if(pathname==='/DEEN-App/'||pathname==='/DEEN-App/index.html'){
  response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});response.end(html);return;
 }
 const match=pathname.match(/^\/DEEN-App\/assets\/quran\/audio\/arabic-learning\/(letter-[a-z]+\.mp3)$/);
 if(!match){response.writeHead(404);response.end('Not found');return}
 const file=path.join(audioFolder,match[1]);
 if(!fs.existsSync(file)){response.writeHead(404);response.end('Missing audio');return}
 response.writeHead(200,{'Content-Type':'audio/mpeg','Cache-Control':'no-store'});
 fs.createReadStream(file).pipe(response);
});
const expected=['qaf','kaf','lam','mim','nun','ha','waw','ya'];
const fileOf=id=>'letter-'+id+'.mp3';
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:375,height:812},reducedMotion:'reduce'});
  const errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.url().includes('/assets/quran/audio/arabic-learning/'))requests.push(r.url())});
  await page.goto('http://127.0.0.1:'+server.address().port+'/DEEN-App/');
  await page.evaluate(()=>{
   window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang};
   window.__deenAudioEvents=[];
   const RealAudio=window.Audio;
   window.Audio=function(url){
    const audio=new RealAudio(url);
    const log=(type)=>window.__deenAudioEvents.push({type,src:audio.src});
    log('created');
    for(const name of ['playing','ended','error'])audio.addEventListener(name,()=>log(name));
    const originalPause=audio.pause.bind(audio);
    audio.pause=function(){log('paused');return originalPause()};
    return audio;
   };
  });
  await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
  const scriptNames=[
   'quran-arabic-letters.js','quran-arabic-letter-audio.js',
   'quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js',
   'quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js',
   'quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js',
   'quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js',
   'quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-weekly-goals.js',
   'quran-arabic-paths.js'
  ];
  for(const name of scriptNames)await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_LETTER_AUDIO.previewCount()),8);
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_LETTER_AUDIO.pendingCount()),8);
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_LETTER_AUDIO.approved('qaf')),false);
  const oldProgress=await page.evaluate(()=>{
   const completed=DEEN_ARABIC_LETTERS.lessons.slice(0,5).map(x=>x.id);
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed}));
   DEEN_QURAN_PATHS.enterArabic();
   return localStorage.getItem('deen_arabic_foundations_v2');
  });
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(5)),true,'Letter group six unlocks after prior five');
  assert.equal(await page.locator('.deen-path-letter-card-audio').count(),3,'Only recorded cards are playable');
  assert.equal(await page.locator('.deen-path-letter-card:not(.deen-path-letter-card-audio)').count(),1);
  const clickAndHear=async id=>{
   const selector='.deen-path-letter-card-audio[data-letter-id="'+id+'"]';
   const previous=await page.evaluate(id=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('/'+id)).length,fileOf(id));
   await page.locator(selector).click();
   await page.waitForFunction(({file,previous})=>
     window.__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('/'+file)).length>previous,
     {file:fileOf(id),previous},{timeout:9000});
   assert.ok(await page.locator(selector).isEnabled());
   assert.ok(await page.locator(selector).evaluate(el=>el.getBoundingClientRect().height)>=42);
  };
  for(const id of ['qaf','kaf','lam'])await clickAndHear(id);
  const pausesAfterSwitch=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='paused').length);
  assert.ok(pausesAfterSwitch>=2,'Switching letters stops the prior clip');
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({
    schema:2,completed:DEEN_ARABIC_LETTERS.lessons.slice(0,6).map(x=>x.id)}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(6)),true);
  assert.equal(await page.locator('.deen-path-letter-card-audio').count(),5);
  for(const id of ['mim','nun','ha','waw','ya'])await clickAndHear(id);
  assert.equal(new Set(requests.map(x=>x.slice(x.lastIndexOf('/')+1))).size,8,'Each original MP3 was requested');
  for(const [locale,label] of Object.entries({tr:'Dinle',en:'Listen',ar:'استمع',de:'Anhören',fr:'Écouter'})){
   await page.evaluate(locale=>{document.documentElement.lang=locale;DEEN_QURAN_PATHS.refresh()},locale);
   assert.ok((await page.locator('.deen-path-letter-card-audio').first().innerText()).includes(label),locale);
  }
  // Actual lesson question 2 (qaf) must expose the same audio control.
  await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.selectGroup(5)});
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-letter-lesson-listen').count(),0,'No audio for unrecorded fa');
  await page.locator('[data-qpath-action="answer"][data-letter-id="fa"]').click();
  await page.locator('[data-qpath-action="next"]').click();
  assert.equal(await page.locator('.deen-path-letter-lesson-listen[data-letter-id="qaf"]').count(),1);
  const startCount=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-qaf.mp3')).length);
  await page.locator('.deen-path-letter-lesson-listen').click();
  await page.waitForFunction(n=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-qaf.mp3')).length>n,startCount);
  const lastPause=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='paused').length);
  await page.evaluate(()=>{
   document.querySelector('#leagueScreen').classList.remove('active');
   document.dispatchEvent(new Event('deen:navigated'));
  });
  assert.ok(await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='paused').length)>lastPause,
    'Navigating to another app tab stops current letter pronunciation');
  const afterProgress=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed);
  assert.equal(afterProgress.length,6,'Preview and lesson clicks never award a completed lesson');
  assert.equal(await page.locator('#originalSurah').count(),1,'Quran surah subtree still exists');
  assert.deepEqual(errors,[]);
  // Emulate mobile Chrome: touch-only input, 320px viewport and device scale 2.
  // A real user gesture must allow media playback; selectors must stay tappable.
  const mobile=await browser.newPage({
   viewport:{width:320,height:720},deviceScaleFactor:2,hasTouch:true,isMobile:true
  });
  const mobileErrors=[];
  mobile.on('pageerror',e=>mobileErrors.push(e.message));
  await mobile.goto('http://127.0.0.1:'+server.address().port+'/DEEN-App/');
  await mobile.evaluate(()=>{
   window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang};
   window.__mobileAudioEvents={plays:[],pauses:0};
   const NativeAudio=window.Audio;
   window.Audio=function(url){
    const a=new NativeAudio(url);
    a.addEventListener('playing',()=>__mobileAudioEvents.plays.push(a.src));
    const realPause=a.pause.bind(a);
    a.pause=function(){__mobileAudioEvents.pauses++;return realPause()};
    return a;
   };
  });
  await mobile.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
  for(const name of scriptNames)await mobile.addScriptTag({path:path.join(root,'assets/i18n',name)});
  await mobile.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({
    schema:2,completed:DEEN_ARABIC_LETTERS.lessons.slice(0,6).map(x=>x.id)
   }));
   DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(6);
  });
  const mobileCard=mobile.locator('.deen-path-letter-card-audio[data-letter-id="mim"]');
  const bounds=await mobileCard.boundingBox();
  assert.ok(bounds&&bounds.width>=60&&bounds.height>=44,'320px card touch target must be at least 44px tall');
  assert.ok(bounds.x>=0&&bounds.x+bounds.width<=322,'320px card must fit within viewport');
  await mobileCard.tap();
  await mobile.waitForFunction(()=>__mobileAudioEvents.plays.some(s=>s.endsWith('/letter-mim.mp3')),{},{timeout:9000});
  await mobile.evaluate(()=>{document.documentElement.lang='ar';DEEN_QURAN_PATHS.refresh()});
  const nun=mobile.locator('.deen-path-letter-card-audio[data-letter-id="nun"]');
  assert.ok((await nun.innerText()).includes('استمع'),'Arabic listening action must be translated');
  await nun.tap();
  await mobile.waitForFunction(()=>__mobileAudioEvents.plays.some(s=>s.endsWith('/letter-nun.mp3')),{},{timeout:9000});
  // Actual document.hidden is read-only; override it inside this isolated
  // test only to exercise the event that iOS/Android fires on app backgrounding.
  const beforeHide=await mobile.evaluate(()=>__mobileAudioEvents.pauses);
  await mobile.evaluate(()=>{
   Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
   document.dispatchEvent(new Event('visibilitychange'));
   delete document.hidden;
  });
  assert.ok(await mobile.evaluate(()=>__mobileAudioEvents.pauses)>beforeHide,
   'Backgrounding the web app must stop the isolated letter clip');
  const stored=await mobile.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed.length);
  assert.equal(stored,6,'Listening on touchscreens never forges lesson completion');
  assert.deepEqual(mobileErrors,[]);
  await mobile.close();
  console.log('PASS LETTER AUDIO CHROME: 8 real MP3 decodes, 5 locales, touch cards, 320px mobile taps, background stop, single voice, lesson replay, progress safety');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
