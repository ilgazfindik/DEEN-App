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
  // Legacy audio regression expects the quiz directly; first-run tip behavior
  // is exercised separately below after clearing this independent flag.
  await page.evaluate(()=>localStorage.setItem('deen_arabic_lesson_tips_seen_v1',JSON.stringify(DEEN_ARABIC_LETTERS.lessons.map(lesson=>lesson.id))));
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_LETTER_AUDIO.previewCount()),15);
  assert.equal(await page.evaluate(()=>DEEN_ARABIC_LETTER_AUDIO.pendingCount()),15);
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
  // The user's first two lessons are now MP3-backed, not Arabic-device-TTS dependent.
  await page.evaluate(()=>{
   document.querySelector('#leagueScreen').classList.add('active');
   DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(0);
  });
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-option').count(),3);
  assert.equal(await page.locator('.deen-path-option-audio').count(),3);
  assert.equal(await page.locator('.deen-path-option-tts').count(),0);
  assert.equal(await page.locator('[data-qpath-action="checkLetterAnswer"]').isDisabled(),true);
  const baCount=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-ba.mp3')).length);
  await page.locator('.deen-path-option[data-letter-id="ba"]').click();
  await page.waitForFunction(n=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-ba.mp3')).length>n,baCount);
  assert.equal(await page.locator('.deen-path-feedback').count(),0,'Listen/select does not grade');
  await page.locator('[data-qpath-action="checkLetterAnswer"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-wrong').count(),1);
  const alifCount=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-alif.mp3')).length);
  await page.locator('.deen-path-option[data-letter-id="alif"]').click();
  await page.waitForFunction(n=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-alif.mp3')).length>n,alifCount);
  assert.equal(await page.locator('.deen-path-feedback').count(),0);
  await page.locator('[data-qpath-action="checkLetterAnswer"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
  assert.equal(await page.evaluate(()=>__deenTtsEvents.filter(e=>e.type==='speak').length),1,
   'Alif and Ba must not trigger device TTS; only previously-tested unrecorded Fa may do that');

  // Lesson 2: all four choices use their matching user-supplied MP3.
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({
    schema:2,completed:DEEN_ARABIC_LETTERS.lessons.slice(0,1).map(x=>x.id)
   }));
   DEEN_QURAN_PATHS.enterArabic();
  });
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(1)),true);
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-option-audio').count(),4);
  assert.equal(await page.locator('.deen-path-option-tts').count(),0);
  assert.equal(await page.locator('.deen-path-audio-preview-choice').count(),0);
  const heard=new Set();
  for(const id of ['tha','jim','hha','kha']){
   const before=await page.evaluate(id=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('/letter-'+id+'.mp3')).length,id);
   await page.locator('[data-qpath-action="answer"][data-letter-id="'+id+'"]').click();
   await page.waitForFunction(({id,before})=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('/letter-'+id+'.mp3')).length>before,{id,before});
   assert.equal(await page.locator('.deen-path-feedback').count(),0,'Listening only must never grade');
   heard.add(id);
  }
  assert.equal(heard.size,4);
  assert.equal(await page.locator('.deen-path-option-selected').count(),1);
  await page.locator('[data-qpath-action="answer"][data-letter-id="tha"]').click();
  await page.locator('[data-qpath-action="checkLetterAnswer"]').click();
  assert.equal(await page.locator('.deen-path-feedback.is-correct').count(),1);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed.length),1);
  assert.equal(await page.locator('#originalSurah').count(),1);
  assert.deepEqual(errors,[]);
  // Micro-tip pilot: opens once per lesson, never grades or mutates progress.
  await page.evaluate(()=>{
   localStorage.removeItem('deen_arabic_lesson_tips_seen_v1');
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:[]}));
   document.documentElement.lang='tr';
   DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(0);
  });
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-mini-tip').count(),1);
  assert.equal(await page.locator('.deen-path-mini-tip-example').count(),3);
  assert.match(await page.locator('.deen-path-mini-tip-title').innerText(),/Elif/);
  assert.equal(await page.locator('.deen-path-option').count(),0,'Quizzes hidden while teaching');
  const beforeTipAudio=await page.evaluate(()=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-ba.mp3')).length);
  await page.locator('.deen-path-mini-tip-audio[data-letter-id="ba"]').click();
  await page.waitForFunction(n=>__deenAudioEvents.filter(e=>e.type==='playing'&&e.src.endsWith('letter-ba.mp3')).length>n,beforeTipAudio);
  await page.locator('[data-qpath-action="tipDismiss"]').click();
  assert.equal(await page.locator('.deen-path-option').count(),3);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_lesson_tips_seen_v1'))),['arabic-letters-01']);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed.length),0);
  await page.locator('[data-qpath-action="tipOpen"]').click();
  assert.equal(await page.locator('.deen-path-mini-tip').count(),1);
  await page.locator('[data-qpath-action="tipDismiss"]').click();
  await page.locator('[data-qpath-action="group"]').click();
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-mini-tip').count(),0,'Seen tips not repeated');
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:['arabic-letters-01']}));
   DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(1);
  });
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-mini-tip').count(),1);
  for(const [locale,word] of Object.entries({tr:'Noktalar',en:'Dots',ar:'النقاط',de:'Punkte',fr:'points'})){
   await page.evaluate(locale=>{document.documentElement.lang=locale;DEEN_QURAN_PATHS.refresh()},locale);
   assert.ok((await page.locator('.deen-path-mini-tip-title').innerText()).includes(word),locale);
   assert.equal(await page.locator('.deen-path-mini-tip-example').count(),3);
   assert.equal(await page.locator('.deen-path-mini-tip').getAttribute('dir'),locale==='ar'?'rtl':'ltr');
  }
  await page.locator('[data-qpath-action="tipDismiss"]').click();
  assert.equal(await page.locator('.deen-path-option').count(),4);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed.length),1);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_lesson_tips_seen_v1')).length),2);
  await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.refresh()});
  // Arabic Learning V2 step 02: each remaining letter lesson has a genuine
  // first-run teaching screen, valid examples and truthful audio affordances.
  const tipSeenBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_lesson_tips_seen_v1')));
  assert.equal(tipSeenBefore.length,2);
  for(let lesson=2;lesson<7;lesson++){
   const lessonId='arabic-letters-'+String(lesson+1).padStart(2,'0');
   await page.evaluate(lesson=>{
    const completed=DEEN_ARABIC_LETTERS.lessons.slice(0,lesson).map(x=>x.id);
    localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed}));
    document.documentElement.lang='tr';
    DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(lesson);
   },lesson);
   await page.locator('[data-qpath-action="start"]').click();
   assert.equal(await page.locator('.deen-path-mini-tip').count(),1,'New lesson opens tip: '+lessonId);
   assert.equal(await page.locator('.deen-path-option').count(),0,'No grading controls under lesson tip');
   assert.equal(await page.locator('.deen-path-mini-tip-example').count(),3,'Three examples per tip');
   const expectedClips=lesson===5||lesson===6?3:0;
   assert.equal(await page.locator('.deen-path-mini-tip-audio').count(),expectedClips,
    'Only authentic MP3-backed letters have audio buttons in '+lessonId);
   for(const locale of ['tr','en','ar','de','fr']){
    await page.evaluate(locale=>{document.documentElement.lang=locale;DEEN_QURAN_PATHS.refresh()},locale);
    const title=(await page.locator('.deen-path-mini-tip-title').innerText()).trim();
    const explanation=(await page.locator('.deen-path-mini-tip-desc').innerText()).trim();
    assert.ok(title.length>=12&&explanation.length>=35,lessonId+' '+locale+' not translated');
    assert.equal(await page.locator('.deen-path-mini-tip-examples').locator('.deen-path-mini-tip-example').count(),3);
    assert.equal(await page.locator('.deen-path-mini-tip').getAttribute('dir'),locale==='ar'?'rtl':'ltr');
   }
   await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.refresh()});
   await page.locator('[data-qpath-action="tipDismiss"]').click();
   assert.equal(await page.locator('.deen-path-option').count(),await page.evaluate(lesson=>DEEN_ARABIC_LETTERS.lessons[lesson].letterIds.length,lesson));
   assert.equal(await page.locator('.deen-path-feedback').count(),0);
   await page.locator('[data-qpath-action="tipOpen"]').click();
   assert.equal(await page.locator('.deen-path-mini-tip').count(),1,'Reopen is always possible');
   await page.locator('[data-qpath-action="tipDismiss"]').click();
   assert.equal(await page.evaluate(lesson=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed.length,lesson),lesson,
    'Tip dismissal must not mark a lesson complete');
  }
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_lesson_tips_seen_v1')).length),7);
  assert.equal(await page.locator('.deen-path-mini-tip').count(),0);
  // Step 03: 8-13 teach short vowels, syllables, sukun, shadda and madd.
  for(let lesson=7;lesson<13;lesson++){
   const lessonId=await page.evaluate(index=>{
    const all=[...DEEN_ARABIC_LETTERS.lessons,...DEEN_ARABIC_HARAKAT.lessons,...DEEN_ARABIC_READING.lessons];
    const completed=all.slice(0,index).map(x=>x.id);
    localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed}));
    document.documentElement.lang='tr';
    DEEN_QURAN_PATHS.enterArabic();
    if(DEEN_QURAN_PATHS.selectGroup(index)!==true)throw Error('Could not unlock tutorial '+index);
    return all[index].id;
   },lesson);
   await page.locator('[data-qpath-action="start"]').click();
   assert.equal(await page.locator('.deen-path-mini-tip').count(),1,lessonId+' opens a lesson tip');
   assert.equal(await page.locator('.deen-path-mini-tip-example').count(),3);
   assert.equal(await page.locator('.deen-path-mini-tip-audio').count(),0,
    lessonId+' must never play letter-name recordings for short vowels or reading examples');
   assert.equal(await page.locator('.deen-path-option').count(),0,
    'Instruction must precede assessment in '+lessonId);
   for(const locale of ['tr','en','ar','de','fr']){
    await page.evaluate(locale=>{document.documentElement.lang=locale;DEEN_QURAN_PATHS.refresh()},locale);
    const title=await page.locator('.deen-path-mini-tip-title').innerText();
    const body=await page.locator('.deen-path-mini-tip-desc').innerText();
    assert.ok(title.trim().length>=9&&body.trim().length>=30,
     'Missing teacher translation for '+lessonId+'/'+locale);
    assert.equal(await page.locator('.deen-path-mini-tip').getAttribute('dir'),locale==='ar'?'rtl':'ltr');
    assert.equal(await page.locator('.deen-path-mini-tip-glyph').count(),3);
   }
   await page.evaluate(()=>{document.documentElement.lang='tr';DEEN_QURAN_PATHS.refresh()});
   await page.locator('[data-qpath-action="tipDismiss"]').click();
   assert.equal(await page.locator('.deen-path-mini-tip').count(),0);
   assert.equal(await page.locator('.deen-path-option').count(),3);
   assert.equal(await page.locator('.deen-path-feedback').count(),0);
   await page.locator('[data-qpath-action="tipOpen"]').click();
   assert.equal(await page.locator('.deen-path-mini-tip').count(),1,'Note can reopen '+lessonId);
   await page.locator('[data-qpath-action="tipDismiss"]').click();
   assert.equal(await page.evaluate(index=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed.length,index),lesson,
    'Tips cannot forge progress in '+lessonId);
  }
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_lesson_tips_seen_v1')).length),13);

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
  assert.equal(await mobile.locator('.deen-path-mini-tip').count(),1,'Mobile lesson 7 first visit shows its tutorial');
  assert.equal(await mobile.locator('.deen-path-mini-tip').getAttribute('dir'),'rtl');
  await mobile.locator('[data-qpath-action="tipDismiss"]').tap();
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
   DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(0);
  });
  await mobile.locator('[data-qpath-action="start"]').tap();
  assert.equal(await mobile.locator('.deen-path-mini-tip').count(),1);
  const tipBounds=await mobile.locator('.deen-path-mini-tip').boundingBox();
  assert.ok(tipBounds&&tipBounds.x>=0&&tipBounds.x+tipBounds.width<=322,'320px tip must fit viewport');
  await mobile.locator('[data-qpath-action="tipDismiss"]').tap();
  assert.equal(await mobile.locator('.deen-path-option-audio').count(),3);
  assert.equal(await mobile.locator('.deen-path-option-tts').count(),0);
  const mobileBa=await mobile.evaluate(()=>__mobileAudioEvents.plays.filter(s=>s.endsWith('/letter-ba.mp3')).length);
  await mobile.locator('.deen-path-option[data-letter-id="ba"]').tap();
  await mobile.waitForFunction(n=>__mobileAudioEvents.plays.filter(s=>s.endsWith('/letter-ba.mp3')).length>n,mobileBa);
  // On a real phone without an Arabic TTS voice, uploaded MP3s still work.
  await mobile.evaluate(()=>{
   speechSynthesis.getVoices=()=>[{lang:'en-US',name:'Non-Arabic voice'}];
   DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(0);
  });
  await mobile.locator('[data-qpath-action="start"]').tap();
  assert.equal(await mobile.locator('.deen-path-option-audio').count(),3);
  assert.equal(await mobile.locator('.deen-path-option-tts').count(),0);
  const beforeVoice=await mobile.evaluate(()=>__mobileAudioEvents.plays.filter(s=>s.endsWith('/letter-ta.mp3')).length);
  const beforeTts=await mobile.evaluate(()=>__mobileTtsEvents.filter(s=>s.type==='speak').length);
  await mobile.locator('.deen-path-option[data-letter-id="ta"]').tap();
  await mobile.waitForFunction(n=>__mobileAudioEvents.plays.filter(s=>s.endsWith('/letter-ta.mp3')).length>n,beforeVoice);
  assert.equal(await mobile.evaluate(()=>__mobileTtsEvents.filter(s=>s.type==='speak').length),beforeTts);
  assert.equal(await mobile.locator('.deen-path-feedback').count(),0);
  assert.deepEqual(mobileErrors,[]);
  await mobile.close();
  const progressBeforeReload=await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed.length);
  await page.reload();
  await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
  for(const name of scriptNames)await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  await page.evaluate(()=>{window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang};DEEN_QURAN_PATHS.enterArabic();DEEN_QURAN_PATHS.selectGroup(0)});
  await page.locator('[data-qpath-action="start"]').click();
  assert.equal(await page.locator('.deen-path-mini-tip').count(),0,'Dismissed tip persists after reload');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_foundations_v2')).completed.length),progressBeforeReload,'Old progress retained across reload');
  assert.deepEqual(errors,[]);
  console.log('PASS LETTER AUDIO CHROME: 15 real MP3 assets, first/second lesson direct MP3, no TTS required on non-Arabic-voice mobile, 5 locales, mobile taps, background stop, single voice and progress safety');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
