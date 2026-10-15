/* DEEN phase 6: audio release gate, provenance requirements and state safety */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="tr"><body><div id="leagueScreen" class="screen active"><div id="leagueScreenBody"><div class="deen-quran-shell"><button id="originalSurah">Original surahs</button></div></div></div></body></html>';
const server=http.createServer((_,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:375,height:812}}),errors=[],audioRequests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.url().includes('/assets/quran/audio/'))audioRequests.push(r.url())});
  await page.goto('http://127.0.0.1:'+server.address().port);
  await page.evaluate(()=>window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang});
  await page.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
  for(const name of ['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-paths.js'])
   await page.addScriptTag({path:path.join(root,'assets/i18n',name)});
  const status=await page.evaluate(()=>({
   version:DEEN_QURAN_PATHS.version,modules:DEEN_ARABIC_LISTENING.lessons.map(x=>({id:x.id,index:x.index,kind:x.kind,clips:x.items.map(y=>y.clipId)})),
   approved:DEEN_ARABIC_LISTENING.approvedCount(),required:DEEN_ARABIC_LISTENING.requiredCount,overall:DEEN_QURAN_PATHS.status().overallLessonCount
  }));
  assert.equal(status.version,'quran-arabic-paths-phase7');
  assert.deepEqual(status.modules.map(x=>x.index),[16,17]);
  assert.equal(status.overall,21);
  assert.deepEqual(status.modules.map(x=>x.kind),['listen-syllable','listen-word']);
  assert.equal(new Set(status.modules.flatMap(x=>x.clips)).size,6);
  assert.equal(status.approved,0);assert.equal(status.required,6);
  const approvalCheck=await page.evaluate(async()=>{
   const a=DEEN_ARABIC_LISTENING,base={
    state:'approved',file:'assets/quran/audio/arabic-learning/reviewed-word.mp3',sha256:'a'.repeat(64),reciter:'Test Speaker',auditedText:'بَ',
    rights:{state:'approved',evidence:'audited-license-reference'},
    pronunciation:{state:'approved',reviewRef:'teacher-review-reference'}
   };
   return {
    validShape:a.isRecordApproved(base,'بَ'),
    badNoRights:a.isRecordApproved({...base,rights:{state:'unverified',evidence:'audited-license-reference'}},'بَ'),
    badNoReview:a.isRecordApproved({...base,pronunciation:{state:'pending',reviewRef:null}},'بَ'),
    badPath:a.isRecordApproved({...base,file:'assets/quran/audio/../../other.mp3'},'بَ'),
    badExternal:a.isRecordApproved({...base,file:'https://external.example/audio.mp3'},'بَ'),
    badHash:a.isRecordApproved({...base,sha256:'0'.repeat(63)},'بَ'),
    badText:a.isRecordApproved({...base,auditedText:'بِ'},'بَ'),
    playbackBlocked:await a.play('word-qul')
   };
  });
  assert.equal(approvalCheck.validShape,true);
  for(const [name,value] of Object.entries(approvalCheck))if(name!=='validShape'&&name!=='playbackBlocked')assert.equal(value,false,name);
  assert.equal(await approvalCheck.playbackBlocked,false);
  await page.locator('[data-qpath-action="arabic"]').click();
  assert.equal(await page.locator('.deen-path-listening-item').count(),2);
  assert.equal(await page.locator('.deen-path-listening-item:disabled').count(),2);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(16)),false);
  await page.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_reading_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_READING.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_words_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_WORDS.lessons.map(x=>x.id)}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  assert.equal(await page.locator('.deen-path-listening-item:disabled').count(),2,'Even after 16 lessons audio stays locked without review');
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.selectGroup(16)),false);
  assert.equal(await page.evaluate(()=>DEEN_QURAN_PATHS.status().listeningCompletedLessons),0);
  assert.equal(await page.evaluate(()=>localStorage.getItem('deen_arabic_listening_v1')),null);
  assert.match(await page.locator('.deen-path-listening-count').innerText(),/0 \/ 6/);
  assert.deepEqual(audioRequests,[],'No unverified recording fetched');
  for(const lang of ['tr','en','ar','de','fr']){
   await page.evaluate(x=>{document.documentElement.lang=x;DEEN_QURAN_PATHS.enterArabic()},lang);
   assert.ok((await page.locator('.deen-path-listening-section h3').innerText()).length>5);
  }
  await page.locator('[data-qpath-action="home"]').click();
  await page.locator('[data-qpath-action="surah"]').click();
  assert.equal(await page.locator('#originalSurah').count(),1,'Existing surahs preserved');
  assert.deepEqual(errors,[],'No JS exceptions');
  // In a SECOND isolated browser profile, simulate independently reviewed
  // clips in TEST ONLY to exercise the unlocked quiz. Never change production
  // approval data or pretend the six source recordings exist.
  const demo=await browser.newPage({viewport:{width:375,height:812}}),demoErrors=[];
  demo.on('pageerror',e=>demoErrors.push(e.message));
  await demo.goto('http://127.0.0.1:'+server.address().port);
  await demo.evaluate(()=>window.DEEN_APP_LOCALE={get:()=>document.documentElement.lang});
  await demo.addStyleTag({path:path.join(root,'assets/i18n/quran-arabic-paths.css')});
  for(const name of ['quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js'])
   await demo.addScriptTag({path:path.join(root,'assets/i18n',name)});
  await demo.evaluate(()=>{
   const actual=window.DEEN_ARABIC_LISTENING;
   window.__MOCK_AUDIO_ATTEMPTS__=Object.create(null);
   // This is a browser test double, NEVER shipped or put in app code.
   window.DEEN_ARABIC_LISTENING=Object.freeze({
    ...actual,approvedCount:()=>actual.requiredCount,lessonReady:()=>true,stop:()=>{},
    play:async id=>{
     const plays=window.__MOCK_AUDIO_ATTEMPTS__;
     plays[id]=(plays[id]||0)+1;
     if(id==='syllable-ba-kasra'&&plays[id]===1)return false;
     return true;
    }
   });
  });
  await demo.addScriptTag({path:path.join(root,'assets/i18n/quran-arabic-paths.js')});
  await demo.evaluate(()=>{
   localStorage.setItem('deen_arabic_foundations_v2',JSON.stringify({schema:2,completed:DEEN_ARABIC_LETTERS.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_harakat_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_HARAKAT.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_reading_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_READING.lessons.map(x=>x.id)}));
   localStorage.setItem('deen_arabic_words_v1',JSON.stringify({schema:1,completed:DEEN_ARABIC_WORDS.lessons.map(x=>x.id)}));
   DEEN_QURAN_PATHS.enterArabic();
  });
  assert.equal(await demo.locator('.deen-path-listening-item:disabled').count(),1);
  const mockItems=await demo.evaluate(()=>DEEN_ARABIC_LISTENING.lessons.map(x=>x.items.map(i=>i.id)));
  for(let li=0;li<2;li++){
   await demo.locator('.deen-path-listening-item[data-lesson-index="'+(16+li)+'"]').click();
   await demo.locator('[data-qpath-action="start"]').click();
   for(let q=0;q<3;q++){
    assert.equal(await demo.locator('.deen-path-listening-options button:disabled').count(),3,'Audio must play before answers unlock');
    await demo.locator('[data-qpath-action="listen"]').click();
    if(li===0&&q===1){
     await demo.locator('.deen-path-feedback.is-wrong').waitFor();
     assert.equal(await demo.locator('.deen-path-listening-options button:disabled').count(),3,'Failed audio leaves options locked');
     assert.equal(await demo.evaluate(()=>DEEN_QURAN_PATHS.status().listeningCompletedLessons),0);
     await demo.locator('[data-qpath-action="listen"]').click();
    }
    await demo.locator('.deen-path-listening-options button:not(:disabled)').first().waitFor();
    const wrong=mockItems[li][(q+1)%3],correct=mockItems[li][q];
    await demo.locator('[data-qpath-action="answer"][data-letter-id="'+wrong+'"]').click();
    assert.equal(await demo.locator('.deen-path-feedback.is-wrong').count(),1);
    await demo.locator('[data-qpath-action="answer"][data-letter-id="'+correct+'"]').click();
    assert.equal(await demo.locator('.deen-path-feedback.is-correct').count(),1);
    await demo.locator('[data-qpath-action="next"]').click();
   }
   assert.equal(await demo.locator('.deen-path-completion').count(),1);
   assert.equal(await demo.evaluate(()=>DEEN_QURAN_PATHS.status().listeningCompletedLessons),li+1);
   await demo.locator('[data-qpath-action="arabic"]').click();
  }
  assert.equal(await demo.locator('.deen-path-listening-item:disabled').count(),0);
  assert.equal(await demo.evaluate(()=>JSON.parse(localStorage.getItem('deen_arabic_listening_v1')).completed.length),2);
  assert.equal(await demo.evaluate(()=>window.__MOCK_AUDIO_ATTEMPTS__['syllable-ba-kasra']),2);
  assert.deepEqual(demoErrors,[]);
  await demo.close();
  console.log('PASS QURAN LISTENING PHASE6: 18 lesson slots, 0/6 approved, blocked playback and bypass, 5 locales, intact prior progress and Quran route');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
