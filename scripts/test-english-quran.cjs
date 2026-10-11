/* Chromium integration tests against the real segmented application, using disposable local profiles. */
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.env.DEEN_QA_OUTPUT||path.join(root,'qa/english-runtime');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const url=req.url.split('?')[0],file=path.join(root,decodeURIComponent(url==='/'?'/index.html':url));try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':'application/octet-stream');res.end(fs.readFileSync(file))}catch(_){res.statusCode=404;res.end('missing')}});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({channel:'chrome',headless:true,...(process.env.DEEN_CHROMIUM?{executablePath:process.env.DEEN_CHROMIUM}:{}),args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-zygote']});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],report={stages:[],macros:[],types:{},reviews:[],errors};
 report.browser={name:'Google Chrome',version:browser.version()};
 page.on('console',m=>{if(m.type()==='error')console.log('BROWSER',m.text())});page.on('pageerror',e=>{errors.push(e.message);console.log('ERROR',e.message)});
 await page.addInitScript(()=>{
  if(window.top!==window)return;window.__DEEN_LOCALIZATION_QA__=true;
  // This test data exists only in this disposable browser context.
  if(!localStorage.getItem('deen_v4_1_state')){localStorage.setItem('deen_app_language_v1','en');localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:777,learningProfile:'adult',profile:{name:'QA',companion:'owl'},settings:{language:'en',onboardingLanguageConfirmed:true},completed:[],mistakes:[]}))}
  window.__qa={long:[],observers:[],listeners:0};const Native=MutationObserver;
  window.MutationObserver=class extends Native{constructor(fn){const row={fn:fn.toString().slice(0,160),callbacks:0,mutations:0,ms:0};__qa.observers.push(row);super((r,o)=>{row.callbacks++;row.mutations+=r.length;const t=performance.now();fn(r,o);row.ms+=performance.now()-t})}};
  new PerformanceObserver(l=>__qa.long.push(...l.getEntries().map(e=>({start:e.startTime,ms:e.duration})))).observe({entryTypes:['longtask']});
 });
 await page.goto(url);await page.waitForFunction(()=>window.DEEN_BOOT?.status().phase==='ready'||window.DEEN_BOOT?.status().phase==='error',{timeout:30000});
 const boot=await page.evaluate(()=>DEEN_BOOT.status());assert.equal(boot.phase,'ready',JSON.stringify(boot));report.boot=boot;

 const snapshots=[];
 async function capture(name){await page.waitForTimeout(200);const data=await page.evaluate(()=>{const texts=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){const el=node.parentElement;if(!el||el.closest('script,style,[data-deen-no-translate],.deen-ikhlas-arabic,.deen-mem-arabic,.deen-qj2-ar,.deen-qj2-option.ar')||!el.getClientRects().length||getComputedStyle(el).visibility==='hidden')continue;const text=node.nodeValue.trim();if(text&&/[ÇĞİÖŞÜçğıöşü\u0600-\u06ff]/.test(text))texts.push(text)}for(const el of document.querySelectorAll('[aria-label],[title],img[alt]')){if(!el.getClientRects().length||getComputedStyle(el).visibility==='hidden')continue;for(const key of ['aria-label','title','alt']){const value=el.getAttribute(key);if(value&&/[ÇĞİÖŞÜçğıöşü\u0600-\u06ff]/.test(value))texts.push(value)}}return [...new Set(texts)]});snapshots.push({name,texts:data});console.log('SURFACE',name,JSON.stringify(data));}
 await capture('home');
 for(const tab of ['review','profile','league']){await page.evaluate(tab=>navigate(tab+'Screen'),tab);await capture(tab)}
 // Quran home screen audit: ASCII-only Turkish words must be detected, not just Turkish diacritics.
 await page.waitForSelector('#leagueScreenBody [data-qia-root] [data-qia-section]',{timeout:15000});
 await page.waitForFunction(()=>[...document.querySelectorAll('#leagueScreenBody [data-qia-nav] button')].map(x=>x.textContent.trim()).join('|')==='Today|Learn|Play|Memorize|Progress',null,{timeout:15000});
 const hub=await page.evaluate(()=>{
  const root=document.querySelector('#leagueScreenBody [data-qia-root]'),nav=document.querySelector('#leagueScreenBody [data-qia-nav]');
  const visible=el=>el?.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';
  const attrs=[...document.querySelectorAll('#leagueScreenBody [aria-label],#leagueScreenBody [title]')].filter(visible).flatMap(el=>['aria-label','title'].map(k=>el.getAttribute(k)).filter(Boolean));
  return {lang:DEEN_APP_LOCALE.get(),nav:[...nav.querySelectorAll('button')].map(x=>x.textContent.trim()),sections:root.querySelectorAll('[data-qia-section]').length,copy:root.innerText,attrs};
 });
 assert.equal(hub.lang,'en');assert.equal(hub.sections,5);
 assert.deepEqual(hub.nav,['Today','Learn','Play','Memorize','Progress']);
 for(const phrase of ['Surahs','Surah Game','Surah Tests','Common Words','Continuous Memorization','Start Memorizing','Progress Center','16 SURAHS · 90 AYAHS']){
  assert(hub.copy.includes(phrase),'Quran hub missing English phrase: '+phrase);
 }
 assert(hub.attrs.some(x=>x.includes('Quran sections')),'Quran tabs accessibility text must be English');
 const asciiTurkish=/\b(?:Oyna|Ezber|Sureler|Oyunu|Testleri|Ezbere|Kesintisiz|Merkezi|kütüphanesi|görev|ayet|hafıza|zayıf|hazır|İlerleme|kavram|sıralaması|tamamla|suretler|Surah Oyunu)\b/i;
 const allHub=hub.copy+' '+hub.attrs.join(' ');
 assert(!asciiTurkish.test(allHub)&&!/[ÇĞİÖŞÜçğıöşü]/.test(allHub),'Turkish Quran hub UI: '+allHub.match(asciiTurkish)?.[0]);
 const exacts={
  '10 Eki':'10 Oct',
  '12 zayıf ayet':'12 weaker ayahs',
  '2 tekrar bugün':'2 reviews due today',
  '11/90 ayet':'11/90 ayahs',
  '1/3 görev':'1/3 tasks',
  'Ustalık %75':'Mastery 75%',
  '%75 hafıza':'75% memory strength',
  '16 sure · 90 ayet':'16 surahs · 90 ayahs'
 };
 for(const [source,expected]of Object.entries(exacts)){
  const actual=await page.evaluate(source=>DEEN_ENGLISH_UI.t(source),source);
  assert.equal(actual,expected,'Quran dashboard dynamic label '+source);
 }
 console.log('PASS ENGLISH QURAN HUB ASCII RESIDUE GATE',JSON.stringify({nav:hub.nav,sections:hub.sections,checks:Object.keys(exacts).length,copyLength:hub.copy.length}));

 const translations=await page.evaluate(()=>DEEN_QURAN_CONTENT.inventory().map(x=>DEEN_QURAN_LEARNING_TRANSLATION.get(DEEN_QURAN_CONTENT.getAyah(x.surah_id,x.ayah_number))));assert.equal(translations.length,90);assert(translations.every(x=>x?.text&&x.language==='en'),JSON.stringify(translations.filter(x=>!x?.text||x.language!=='en')));
 const quran=await page.evaluate(()=>({keys:Object.keys(DEEN_QURAN),audio:Object.keys(DEEN_QURAN_AYAH_AUDIO),practice:DEEN_QURAN_PRACTICE.types}));console.log('QURAN',JSON.stringify(quran));
 for(const id of Object.keys(await page.evaluate(()=>DEEN_QURAN_AYAH_AUDIO.configs()))){await page.evaluate(id=>DEEN_QURAN.openSurah(id),id);await capture('journey-'+id);await page.evaluate(()=>DEEN_QURAN_JOURNEY_V2.startStage('learn'));await capture('learn-'+id);const audio=await page.evaluate(id=>DEEN_QURAN_AYAH_AUDIO.play(1,id),id);assert(audio,id);await page.waitForFunction(()=>DEEN_QURAN_AYAH_AUDIO.state().currentTime>0,null,{timeout:10000});const audioState=await page.evaluate(()=>DEEN_QURAN_AYAH_AUDIO.state());console.log('AUDIO',id,audio,JSON.stringify(audioState));assert(audioState.currentTime>0,id);await page.evaluate(()=>DEEN_QURAN_AYAH_AUDIO.stop());await page.screenshot({path:path.join(out,'quran-'+id+'.png')})}
 await page.evaluate(()=>{for(const id of Object.keys(DEEN_QURAN_AYAH_AUDIO.configs()))for(let n=1;n<=DEEN_QURAN_AYAH_AUDIO.config(id).count;n++)DEEN_QURAN.updateAyah(id,n,{completedAt:new Date().toISOString()});DEEN_QURAN.openSurah('fatiha');DEEN_QURAN_JOURNEY_V2.startStage('memorize')});await capture('memorize');
 for(const type of quran.practice){await page.evaluate(type=>DEEN_QURAN_PRACTICE.open(type,1),type);await capture('practice-'+type)}

 // Phase 2: real English UI audit of the deeper Quran modules. Arabic ayah text is intentionally retained.
 await page.evaluate(()=>{closeSheet();DEEN_QURAN_WORD_INTEL.open()});
 await page.waitForFunction(()=>document.querySelector('.deen-qwi')?.innerText.includes('occurrences')&&document.querySelector('.deen-qwi')?.innerText.includes('surahs'),null,{timeout:12000});
 let wordScreen=await page.locator('.deen-qwi').innerText();
 assert.equal(await page.locator('.deen-qwi-row').count(),24);
 assert(wordScreen.includes('Turkish word meanings are shown only when an expert-verified word-by-word record is available;'),wordScreen);
 assert((await page.locator('.deen-qwi-row button').first().innerText())==='LEARNED','Common-word action must be English');
 assert(await page.locator('.deen-qwi-row b[lang="ar"]').first().evaluate(x=>/[\u0600-\u06ff]/.test(x.textContent)),'Arabic word must not be transliterated');
 await capture('common-quran-words');
 await page.evaluate(()=>DEEN_QURAN_WORD_INTEL.toggle(DEEN_QURAN_WORD_INTEL.top(1)[0].key));
 await page.waitForFunction(()=>document.querySelector('.deen-qwi-row button')?.textContent.trim()==='✓',null,{timeout:8000});
 await page.evaluate(()=>{closeSheet();DEEN_QURAN_MEM_V2.openContinuous('fatiha')});
 await page.waitForFunction(()=>document.querySelector('.deen-qm2')?.innerText.includes('Continuous Memorization')&&document.querySelector('.deen-qm2')?.innerText.includes('First recite the full ayah from memory.'),null,{timeout:8000});
 assert(await page.locator('.deen-qm2-ar').first().evaluate(x=>/[\u0600-\u06ff]/.test(x.textContent)),'Arabic ayah must remain Arabic');
 assert.equal((await page.locator('.deen-qm2-btn').first().innerText()).trim(),'SHOW TEXT');
 await capture('continuous-memorization-before-reveal');
 await page.evaluate(()=>DEEN_QURAN_MEM_V2.reveal());
 await page.waitForFunction(()=>document.querySelector('.deen-qm2')?.innerText.includes('Check the text and assess your recall.'),null,{timeout:8000});
 const actions=await page.locator('.deen-qm2-btn').allInnerTexts();
 assert.deepEqual(actions,['I STRUGGLED','I REMEMBERED']);
 await capture('continuous-memorization-after-reveal');
 await page.evaluate(()=>DEEN_QURAN_MEM_V2.grade(true));
 await page.evaluate(()=>{closeSheet();DEEN_QURAN_MEM_V2.openWeak()});
 await page.waitForSelector('.deen-qm2',{timeout:8000});
 await page.waitForFunction(()=>document.querySelector('.deen-qm2')?.innerText.includes('First recite the full ayah from memory.'),null,{timeout:8000});
 await capture('weak-ayahs-recall');
 await page.evaluate(()=>{closeSheet();DEEN_QURAN_MEM_V2.openSequence('fatiha')});
 await page.waitForFunction(()=>document.querySelector('.deen-qm2')?.innerText.includes('Select the opening words of the ayahs in surah order.'),null,{timeout:8000});
 assert((await page.locator('.deen-qm2-seq button').count())>=2);
 await capture('ayah-sequence');
 await page.evaluate(()=>{closeSheet();DEEN_QURAN_JUZ_AMMA.open()});
 await page.waitForFunction(()=>document.querySelector('.deen-juzamma')?.innerText.includes('EXPERT REVIEW REQUIRED'),null,{timeout:8000});
 const juz=await page.locator('.deen-juzamma').innerText();
 assert.equal(await page.locator('.deen-juz-row').count(),37);
 console.log('DEEN_JUZ_EN_LABELS='+JSON.stringify(await page.locator('.deen-juz-row b').allInnerTexts()));
 console.log('DEEN_JUZ_EN_TRANSLATION='+JSON.stringify(await page.evaluate(()=>['İhlâs','112 · İhlâs','Nâs','114 · Nâs'].map(s=>({s,t:DEEN_ENGLISH_UI.t(s)})))));
 for(const text of ['An-Naba','An-Nazi\'at','Ash-Shams','Ash-Sharh','Al-Ikhlas','An-Nas','EXPERT REVIEW REQUIRED','READY','Turkish translations must not go live without rights clearance and expert review.'])assert(juz.includes(text),'Juz Amma missing English: '+text);
 const badEnglish=/\b(?:HAZIR|UZMAN|ayet|sure|öğrenildi|tekrar|ZORLANDIM|HATIRLADIM|Tebbet|İnşirâh|Nâziât)\b/i;
 assert(!badEnglish.test(juz)&&!/[ÇĞİÖŞÜçğıöşü]/.test(juz),'Turkish residue in Juz Amma');
 await capture('juz-amma-map');
 const labels={
  'Sık Kur’an Kelimeleri':'Common Quran Words',
  '3 tekrar':'3 occurrences',
  '1 tekrar':'1 occurrence',
  '5 sure':'5 surahs',
  '1 sure':'1 surah',
  'Kesintisiz Ezber · ikhlas 1':'Continuous Memorization · ikhlas 1',
  'Bu ezber turu tamamlandı.':'This memorization round is complete.',
  'Ayet sıralaması':'Ayah Sequence',
  'Cüz Amma':'Juz Amma',
  '112 · İhlâs':'112 · Al-Ikhlas',
  'HAZIR':'READY',
  'UZMAN REVIEW':'EXPERT REVIEW REQUIRED'
 };
 for(const [source,expected]of Object.entries(labels))assert.equal(await page.evaluate(x=>DEEN_ENGLISH_UI.t(x),source),expected,source);
 console.log('PASS ENGLISH QURAN INNER MODULES',JSON.stringify({words:24,juzSurahs:37,memorization:true,weakAyah:true,ayahSequence:true,englishLabelChecks:Object.keys(labels).length}));
 await page.evaluate(()=>closeSheet());


 const quiz=[];for(const id of ['fatiha','ikhlas','falaq','nas','kafirun','nasr','masad','fil','quraysh','maun','sharh','tin','bayyina','zilzal','kawthar','asr']){
 const ready=await page.evaluate(id=>DEEN_QURAN_AYET_TEST.start(id),id);assert(ready,id);await capture('ayah-test-'+id);
 const questions=await page.evaluate(()=>DEEN_QURAN_JOURNEY_V2.buildQuestions('ayah',1));assert.equal(questions.length,5);for(const q of questions)assert.equal(q.options.filter(o=>o.text===q.answer).length,1);
 await page.locator('.deen-qj2-option').first().click();await page.locator('.deen-qj2-next').click();await page.waitForTimeout(120);assert((await page.evaluate(()=>DEEN_QURAN_AYET_TEST.snapshot())).answered);
 await capture('ayah-feedback-'+id);await page.locator('.deen-qj2-next').click();quiz.push({id,questionCount:questions.length,passedInteraction:true});
 }
 for(const type of ['fill_blank','continuation','surah','audio','next_ayah','ayah_number','meaning']){await page.evaluate(type=>DEEN_QURAN_QUESTION_ARENA.open(type,'all'),type);await capture('arena-'+type);const q=await page.evaluate(()=>DEEN_QURAN_QUESTION_ARENA.state().q);if(q){assert(await page.locator('.deen-qarena-option[onclick]').count()===0,'Question answers must not interpolate translated text into inline JavaScript');await page.locator('.deen-qarena-option').first().click();assert((await page.evaluate(()=>DEEN_QURAN_QUESTION_ARENA.state())).answered,'Answer click failed for '+type);await capture('arena-feedback-'+type)}}
 const audioAudit=await page.evaluate(()=>DEEN_QURAN_AYAH_AUDIO.regressionAudit());assert(audioAudit.ok);console.log('AUDIO AUDIT',JSON.stringify(audioAudit));
 await page.evaluate(()=>{closeSheet();DEEN_PREMIUM_ONBOARDING.render(0)});await capture('login');
 for(let step=1;step<=6;step++){await page.evaluate(step=>{DEEN_PREMIUM_ONBOARDING.render(step)},step);await capture('onboarding-'+step)}
 const leaks=snapshots.flatMap(s=>s.texts.filter(t=>/[ÇĞİÖŞÜçğıöşü]|\b(?:Ayet|doğru|görev|sure|EZBER|Hoparlöre|Yolculuğu|SIFIRLA|Mevcut)\b/i.test(t)).map(text=>({surface:s.name,text})));console.log('QURAN_LEAKS='+JSON.stringify(leaks));assert.deepEqual(leaks,[]);assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'surface-scan.json'),JSON.stringify({snapshots,quran,quiz,audioAudit,errors},null,2));await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
