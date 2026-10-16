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
   window.__deenTtsEvents=[];
   window.SpeechSynthesisUtterance=function(text){this.text=text;this.lang='';this.rate=1};
   Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
    getVoices(){return [{name:'Arabic QA voice',lang:'ar-SA'}]},
    speak(utterance){__deenTtsEvents.push({type:'speak',text:utterance.text,lang:utterance.lang,voice:utterance.voice?.lang})},
    cancel(){__deenTtsEvents.push({type:'cancel'})}
   }});
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
  // The audio belongs to the answer choices, not separate listen buttons.
  await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.selectGroup(5)});
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-letter-lesson-listen').count(),0,'No audio for unrecorded fa');
  assert.equal(await page.locator('.deen-path-option-audio').count(),4,'All four choices have a voice source');
  assert.equal(await page.locator('.deen-path-option-tts[data-letter-id="fa"]').count(),1,'Fa uses the device voice');
  assert.equal(await page.locator('.deen-path-option-tts[data-letter-id="qaf"]').count(),0,'Recorded Qaf uses MP3');
  // First question: fa is correct but unrecorded. Wrong qaf must play
  // QAF, never the correct answer's sound.
  const wrongQafBefore=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-qaf.mp3')).length);
  await page.locator('[data-qpath-action="answer"][data-letter-id="qaf"]').click();
  await page.waitForFunction(n=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-qaf.mp3')).length>n,wrongQafBefore);
  assert.equal(await page.locator('.deen-path-feedback').count(),0,'Listening alone must not grade');
  assert.equal(await page.locator('.deen-path-option-selected[data-letter-id="qaf"]').count(),1);
  await page.locator('[data-qpath-action="checkLetterAnswer"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
  const createdBeforeUnrecorded=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='created').length);
  const pausesBeforeUnrecorded=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='paused').length);
  await page.locator('[data-qpath-action="answer"][data-letter-id="fa"]').click();
  assert.equal(await page.locator('.deen-path-feedback').count(),0);
  await page.locator('[data-qpath-action="checkLetterAnswer"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
  assert.equal(await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='created').length),createdBeforeUnrecorded,'Do not invent an MP3 for Fa');
  assert.ok(await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='paused').length)>pausesBeforeUnrecorded,'Device TTS stops previous MP3');
  assert.equal(await page.evaluate(()=>__deenTtsEvents.filter(e=>e.type==='speak'&&e.text==='فَاء'&&e.lang==='ar-SA').length),1,
   'Unrecorded Fa is spoken in Arabic via device TTS');
  await page.locator('[data-qpath-action="next"]').click();
  assert.equal(await page.locator('.deen-path-letter-lesson-listen').count(),0,'No redundant prompt-level listen button');
  // Second question: kaf is wrong. Its OWN audio plays, followed by
  // qaf's OWN audio when the correct answer is tapped.
  const wrongKafBefore=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-kaf.mp3')).length);
  await page.locator('[data-qpath-action="answer"][data-letter-id="kaf"]').click();
  await page.waitForFunction(n=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-kaf.mp3')).length>n,wrongKafBefore);
  assert.equal(await page.locator('.deen-path-feedback').count(),0);
  await page.locator('[data-qpath-action="checkLetterAnswer"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
  const correctQafBefore=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-qaf.mp3')).length);
  await page.locator('[data-qpath-action="answer"][data-letter-id="qaf"]').click();
  await page.waitForFunction(n=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-qaf.mp3')).length>n,correctQafBefore);
  assert.equal(await page.locator('.deen-path-feedback').count(),0);
  await page.locator('[data-qpath-action="checkLetterAnswer"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
  const startCount=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-qaf.mp3')).length);
  await page.locator('.deen-path-option[data-letter-id="qaf"]').click();
  await page.waitForFunction(n=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-qaf.mp3')).length>n,startCount);
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1,'Replay does not change a graded answer');
  const lastPause=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='paused').length);
  await page.evaluate(()=>{
   document.querySelector('#leagueScreen').classList.remove('active');
   document.dispatchEvent(new Event('deen:navigated'));
  });
  assert.ok(await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='paused').length)>lastPause,
    'Navigating to another app tab stops current letter pronunciation');
  const afterProgress=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed);
  assert.equal(afterProgress.length,6,'Preview and lesson clicks never award a completed lesson');
  // The FIRST lesson contains exactly three options, all without MP3 assets.
  // Every choice must now speak its own Arabic name on a capable device.
  await page.evaluate(()=>{
   document.querySelector('#leagueScreen').classList.add('active');
   DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(0);
  });
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-option').count(),3);
  assert.equal(await page.locator('[data-qpath-action="checkLetterAnswer"]').isDisabled(),true);
  assert.equal(await page.locator('.deen-path-option-tts').count(),3,'All three first-lesson choices must be audible');
  const audioEventsBefore=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='created').length);
  await page.locator('.deen-path-option[data-letter-id="ba"]').click();
  assert.equal(await page.locator('.deen-path-feedback').count(),0,'Unverified selection must not be graded');
  await page.locator('[data-qpath-action="checkLetterAnswer"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
  assert.ok(await page.evaluate(()=>__deenTtsEvents.some(e=>e.type==='speak'&&e.text==='بَاء'&&e.lang==='ar-SA')));
  await page.locator('.deen-path-option[data-letter-id="alif"]').click();
  assert.equal(await page.locator('.deen-path-feedback').count(),0);
  await page.locator('[data-qpath-action="checkLetterAnswer"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
  assert.ok(await page.evaluate(()=>__deenTtsEvents.some(e=>e.type==='speak'&&e.text==='أَلِف'&&e.lang==='ar-SA')));
  assert.equal(await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='created').length),audioEventsBefore,'First lesson must not use an unrelated MP3');

  // Lesson 2: Tha, Jim, Hha and Kha have no supplied MP3, but should
  // speak directly on tap without opening the optional preview tray.
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({
    schema:2,completed:DEEN_ARABIC_LETTERS.lessons.slice(0,1).map(x=>x.id)
   }));
   DEEN_QURAN_PATHS.enterArabic();
  });
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(1)),true);
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-option-tts').count(),4);
  assert.match(await page.locator('.deen-path-audio-info').innerText(),/doğrudan okunur/);
  assert.equal(await page.locator('.deen-path-audio-preview-choice').count(),0,'No tray needed for audible choices');
  const recordedBeforeTha=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='created').length);
  await page.locator('[data-qpath-action="answer"][data-letter-id="jim"]').click();
  assert.equal(await page.locator('.deen-path-feedback').count(),0);
  await page.locator('[data-qpath-action="checkLetterAnswer"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
  assert.ok(await page.evaluate(()=>__deenTtsEvents.some(e=>e.type==='speak'&&e.text==='جِيم')));
  await page.locator('[data-qpath-action="answer"][data-letter-id="tha"]').click();
  assert.equal(await page.locator('.deen-path-feedback').count(),0);
  await page.locator('[data-qpath-action="checkLetterAnswer"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
  assert.ok(await page.evaluate(()=>__deenTtsEvents.some(e=>e.type==='speak'&&e.text==='ثَاء')));
  assert.equal(await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='created').length),recordedBeforeTha,'Never substitute recorded Qaf/Kaf for lesson 2');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed.length),1,'Speech must not alter stored progress');
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
   window.__mobileTtsEvents=[];
   window.SpeechSynthesisUtterance=function(text){this.text=text;this.lang=''};
   Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
    getVoices(){return [{lang:'ar-SA',name:'Mobile Arabic QA'}]},
    speak(utterance){__mobileTtsEvents.push({type:'speak',text:utterance.text,lang:utterance.lang})},
    cancel(){__mobileTtsEvents.push({type:'cancel'})}
   }});
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
  await mobile.locator('[data-qpath-action="start"]').tap();
  assert.equal(await mobile.locator('.deen-path-option-audio').count(),5,'All five lesson 7 options have voice clips');
  const mobileNunBefore=await mobile.evaluate(()=>__mobileAudioEvents.plays.filter(s=>s.endsWith('/letter-nun.mp3')).length);
  await mobile.locator('.deen-path-option[data-letter-id="nun"]').tap();
  await mobile.waitForFunction(n=>__mobileAudioEvents.plays.filter(s=>s.endsWith('/letter-nun.mp3')).length>n,mobileNunBefore);
  assert.equal(await mobile.locator('.deen-path-feedback').count(),0);
  await mobile.locator('[data-qpath-action="checkLetterAnswer"]').tap();
  assert.equal(await mobile.locator('.deen-path-feedback.is-wrong').count(),1);
  const mobileMimBefore=await mobile.evaluate(()=>__mobileAudioEvents.plays.filter(s=>s.endsWith('/letter-mim.mp3')).length);
  await mobile.locator('.deen-path-option[data-letter-id="mim"]').tap();
  await mobile.waitForFunction(n=>__mobileAudioEvents.plays.filter(s=>s.endsWith('/letter-mim.mp3')).length>n,mobileMimBefore);
  assert.equal(await mobile.locator('.deen-path-feedback').count(),0);
  await mobile.locator('[data-qpath-action="checkLetterAnswer"]').tap();
  assert.equal(await mobile.locator('.deen-path-feedback.is-correct').count(),1);
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
  await mobile.evaluate(()=>{
   DEEN_QURAN_PATHS.enterArabic();
   DEEN_QURAN_PATHS.selectGroup(0);
  });
  await mobile.locator('[data-qpath-action="start"]').tap();
  assert.equal(await mobile.locator('.deen-path-option-tts').count(),3);
  await mobile.locator('.deen-path-option[data-letter-id="ba"]').tap();
  assert.ok(await mobile.evaluate(()=>__mobileTtsEvents.some(e=>e.type==='speak'&&e.text==='بَاء'&&e.lang==='ar-SA')),
   'Direct mobile choice taps must invoke Arabic device speech');
  // Reproduce the real failure: Web Speech API exists, but NO Arabic voice
  // is installed. The old code returned success despite audible silence.
  await mobile.evaluate(()=>{
   speechSynthesis.getVoices=()=>[{lang:'en-US',name:'Non-Arabic voice'}];
   DEEN_QURAN_PATHS.enterArabic();
   DEEN_QURAN_PATHS.selectGroup(0);
  });
  await mobile.locator('[data-qpath-action="start"]').tap();
  assert.equal(await mobile.locator('.deen-path-option').count(),3);
  assert.equal(await mobile.locator('.deen-path-option-tts').count(),0,
   'Do not advertise synthetic audio without an actual Arabic voice');
  assert.equal(await mobile.locator('.deen-path-audio-test').count(),0,
   'Do not ask learners to play an unrelated Mim sound below the three choices');
  assert.equal(await mobile.locator('.deen-path-audio-preview-toggle').count(),0,
   'No secondary preview panel in a recognition quiz');
  const ttsBefore=await mobile.evaluate(()=>__mobileTtsEvents.filter(e=>e.type==='speak').length);
  await mobile.locator('.deen-path-option[data-letter-id="ba"]').tap();
  assert.equal(await mobile.evaluate(()=>__mobileTtsEvents.filter(e=>e.type==='speak').length),ttsBefore,
   'Never try an unavailable Arabic voice on a device lacking that voice');
  assert.match(await mobile.locator('#deenLetterAudioStatus').innerText(),/عربي|arab/i,
   'Explain exactly why the option did not produce a recording');
  assert.deepEqual(mobileErrors,[]);
  await mobile.close();
  console.log('PASS LETTER AUDIO CHROME: 8 real MP3 decodes, 3-choice first lesson and 4-choice second lesson Arabic device TTS, recorded option MP3s, Arabic voice absent diagnostics, 5 locales, mobile taps, background stop, single voice and progress safety');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
