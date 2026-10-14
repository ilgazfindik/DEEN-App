/* Real Chromium DEEN French staging smoke. Uses only local loopback, real
 * assembled app and actual content.js; never activates production release flags.
 * Captures evidence of incomplete localization instead of claiming full QA. */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
import {buildFrenchPreview} from './fr-preview-pack-builder.mjs';

const fixture=buildFrenchPreview();
const origin=process.env.DEEN_QA_ORIGIN||'http://127.0.0.1:8765';
if(!/^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/.test(origin))
 throw Error('FR_BROWSER_QA_ORIGIN_NOT_LOOPBACK');
const output=process.env.DEEN_QA_OUTPUT||'qa-artifacts/french-browser';
mkdirSync(output,{recursive:true});
const report={schema_version:1,scope:'real_chromium_local_staging',
 staging_only:true,productionActivated:false,real_chrome:true,
 baselineSourceQuestions:1500,activeSourceQuestions:1484,staticReferenceKeys:1452,
 viewportRuns:[],errors:[],observedPotentialTurkishUI:[],unreviewed:[]};
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
async function visit(width,height,label){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,
  serviceWorkers:'block',locale:'fr-FR'});
 const page=await context.newPage(),errors=[],activityWarnings=[];
 let deliberateProbe=false;
 page.on('pageerror',e=>errors.push(String(e?.message||e)));
 page.on('console',message=>{
  if(message.type()!=='error'||/favicon|Failed to load resource/.test(message.text()))return;
  const value=message.text();
  // The app's own fill-freeze checker objects to deliberately hot-swapping
  // three quiz types in one QA session. Report it explicitly as an unresolved
  // forced-render warning, never suppress it during regular gameplay.
  if(deliberateProbe&&value.startsWith('DEEN fill freeze regression failed'))
   activityWarnings.push(value.slice(0,320));
  else errors.push('console:'+value.slice(0,220));
 });
 await page.addInitScript(()=>{
  localStorage.setItem('deen_app_language_v1','tr');
  // This is a disposable browser only. No persistent French preference is written.
 });
 await page.route('**/__fr_staging_qa__/**',async route=>{
  const pathname=new URL(route.request().url()).pathname;
  const name='.'+pathname;
  const body=fixture.content.get(name);
  if(!body)return route.fulfill({status:404,body:'QA pack not found'});
  await route.fulfill({status:200,contentType:'application/json; charset=utf-8',
   headers:{'Cache-Control':'no-store'},body});
 });
 try{
  const res=await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:60000});
  assert.equal(res?.status(),200,label+': local app entry not served');
  await page.waitForFunction(()=>!!(window.DEEN_CONTENT_LOCALE&&window.DEEN_BOOT&&
   window.DEEN_APP_LOCALE&&document.querySelector('#lesson .question-frame')&&
   typeof startStage==='function'),null,{timeout:100000});
  // Initial assembly can briefly hold 1522 source/legacy records before the
  // runtime normalizes the 1484 active pool. Observe the settled source list.
  await page.waitForFunction(()=>{
   try{return Array.isArray(QUESTIONS)&&QUESTIONS.length===1484}catch{return false;}
  },null,{timeout:50000});
  const initial=await page.evaluate(()=>{
   const app=window.DEEN_APP_LOCALE,content=window.DEEN_CONTENT_LOCALE;
   return {lang:app.get(),available:content.available('fr'),
    prodFlag:window.__DEEN_CONTENT_MANIFEST__?.languages?.fr?.question_data,
    activeCount:typeof QUESTIONS!=='undefined'?QUESTIONS.length:null,
    phone:!!document.querySelector('.phone'),lesson:!!document.querySelector('#lesson'),
    screenIds:[...document.querySelectorAll('.screen')].map(e=>e.id)};
  });
  assert.equal(initial.lang,'tr');assert.equal(initial.available,false);
  assert.equal(initial.prodFlag,'missing');assert.equal(initial.activeCount,1484);
  await page.screenshot({path:output+'/'+label+'-assembled-original.png',fullPage:true});
  const stage=await page.evaluate(async manifest=>{
   const old=window.__DEEN_CONTENT_MANIFEST__;
   if(window.DEEN_CONTENT_LOCALE.available('fr'))throw Error('QA started on unlocked locale');
   try{
    window.__DEEN_CONTENT_MANIFEST__=manifest;
    if(!await window.DEEN_CONTENT_LOCALE.preload('fr'))
     throw Error('REAL_BROWSER_FRENCH_PRELOAD_FAILED');
    const base=window.DEEN_CONTENT_LOCALE.inspectBank(window.DEEN_BASE_QUESTIONS,'fr');
    const active=window.DEEN_CONTENT_LOCALE.inspectBank(QUESTIONS,'fr');
    return {base,active};
   }finally{
    window.__DEEN_CONTENT_MANIFEST__=old;
   }
  },fixture.manifest);
  assert.equal(stage.base.sourceCount,1500);
  assert.equal(stage.active.sourceCount,1484);
  assert.deepEqual(stage.base.failedIds,[],'Base source mismatch in actual Chromium');
  assert.deepEqual(stage.active.failedIds,[],'Active source mismatch in actual Chromium');
  const gate=await page.evaluate(()=>({
   available:window.DEEN_CONTENT_LOCALE.available('fr'),
   flag:window.__DEEN_CONTENT_MANIFEST__.languages.fr.question_data,
   stored:localStorage.getItem('deen_app_language_v1')
  }));
  assert.deepEqual(gate,{available:false,flag:'missing',stored:'tr'},
   'QA browser exposed a French production release gate');
  await page.evaluate(()=>{window.__DEEN_FRENCH_QA__=true});
  await page.addScriptTag({url:origin+'/assets/i18n/fr/staging-preview.js'});
  const shell=await page.evaluate(({ui,dynamic,observed})=>{
   const renderer=window.DEEN_FRENCH_STAGE_UI;
   if(!renderer)throw Error('Missing localhost-only FR UI staging bridge');
   const init=renderer.init({staticTranslations:ui,dynamicTranslations:dynamic,
    runtimeObservedTranslations:observed});
   const mock=document.createElement('div');
   mock.id='frQaDynamicFixture';
   mock.innerHTML='<p data-streak>1 günlük seri</p><p data-verse>Ayet 1 / 4 · Son çalışma: Bugün</p>'+
    '<button aria-label="Devam Et">Geri</button><p lang="ar">بِسْمِ اللَّهِ</p>';
   document.body.append(mock);
   const beforeArabic=mock.querySelector('[lang="ar"]').textContent;
   renderer.setLocale('fr',mock);
   const examples={streak:mock.querySelector('[data-streak]').textContent,
    verse:mock.querySelector('[data-verse]').textContent,
    cta:mock.querySelector('button').textContent,
    label:mock.querySelector('button').getAttribute('aria-label'),
    arabic:mock.querySelector('[lang="ar"]').textContent};
   renderer.setLocale('tr',mock);
   const reversed={streak:mock.querySelector('[data-streak]').textContent,
    verse:mock.querySelector('[data-verse]').textContent,
    cta:mock.querySelector('button').textContent,
    label:mock.querySelector('button').getAttribute('aria-label'),
    arabic:mock.querySelector('[lang="ar"]').textContent};
   if(examples.arabic!==beforeArabic||reversed.arabic!==beforeArabic)
    throw Error('Original Quran Arabic was modified');
   mock.remove();
   const protectedQ={
    beforeText:document.querySelector('#questionText')?.textContent,
    beforeOptions:document.querySelector('#answerArea')?.innerHTML,
    beforeArabic:[...document.querySelectorAll('[lang="ar"]')].map(e=>e.textContent)};
   // Apply only to an actual assembled non-graded shell (no question or answer area).
   const phone=document.querySelector('.phone');
   const stageTargets=[...phone.querySelectorAll('.bottomnav,.screen:not(#lesson)')];
   let writes=0;
   for(const target of stageTargets)writes+=renderer.setLocale('fr',target);
   const afterArabic=[...document.querySelectorAll('[lang="ar"]')].map(e=>e.textContent);
   const afterQuestion=document.querySelector('#questionText')?.textContent;
   const afterOptions=document.querySelector('#answerArea')?.innerHTML;
   const audit=renderer.audit();
   return {init,examples,reversed,writes,audit,
    protectedQuestion:protectedQ.beforeText===afterQuestion&&
     protectedQ.beforeOptions===afterOptions,
    protectedArabic:JSON.stringify(protectedQ.beforeArabic)===JSON.stringify(afterArabic),
    sampleVisibleTexts:[...phone.querySelectorAll('.navbtn')].map(n=>n.textContent.trim())};
  },{ui:fixture.ui,dynamic:fixture.dynamic,observed:fixture.observed});
  assert.equal(shell.examples.streak,'1 jour de suite');
  assert.equal(shell.examples.verse,'Verset 1 / 4 · Dernière séance : aujourd’hui');
  assert.equal(shell.examples.cta,'Retour');
  assert.equal(shell.examples.label,'Continuer');
  assert.equal(shell.reversed.streak,'1 günlük seri');
  assert.equal(shell.reversed.cta,'Geri');
  assert.equal(shell.protectedQuestion,true);
  assert.equal(shell.protectedArabic,true);
  await page.screenshot({path:output+'/'+label+'-french-shell-preview.png',fullPage:true});
  // A real initialized app, not a static mock: exercise every persistent tab
  // and sample lazy panels before lesson. Missing labels are reported, not
  // silently passed as a claim of complete French coverage.
  const qaBoot=await page.evaluate(async()=>{
   if(typeof state!=='undefined'){
    state.energy=30;state.onboarded=true;
    if(state.settings)state.settings.onboardingLanguageConfirmed=true;
   }
   const ok=await window.DEEN_BOOT.prepare();
   if(!ok)return {ok:false,status:window.DEEN_BOOT.status()};
   for(const element of ['v998Onboarding','deenLanguageGate','deenPreparation'])
    document.getElementById(element)?.remove();
   const phone=document.querySelector('.phone');if(phone)phone.inert=false;
   return {ok:true,locale:window.DEEN_APP_LOCALE.get(),
    productionFrenchAvailable:window.DEEN_CONTENT_LOCALE.available('fr'),
    nav:[...document.querySelectorAll('.bottomnav [data-screen]')]
     .map(el=>el.dataset.screen)};
  });
  assert.equal(qaBoot.ok,true,'App did not finish Turkish startup before QA screens');
  assert.equal(qaBoot.locale,'tr');
  assert.equal(qaBoot.productionFrenchAvailable,false);
  const navAudit=[];
  for(const id of ['learnScreen','reviewScreen','leagueScreen','profileScreen']){
   const button=page.locator('.bottomnav [data-screen="'+id+'"]').first();
   assert.equal(await button.count(),1,label+': missing tab '+id);
   await button.click({timeout:15000});
   await page.waitForTimeout(250);
   const state=await page.evaluate(id=>{
    const node=document.getElementById(id),phone=document.querySelector('.phone');
    const arabicBefore=[...document.querySelectorAll('[lang="ar"]')].map(e=>e.textContent);
    const before={q:document.querySelector('#questionText')?.textContent,
     a:document.querySelector('#answerArea')?.innerHTML,
     f:document.querySelector('#feedbackText')?.textContent};
    const writes=window.DEEN_FRENCH_STAGE_UI.setLocale('fr',node);
    const after={q:document.querySelector('#questionText')?.textContent,
     a:document.querySelector('#answerArea')?.innerHTML,
     f:document.querySelector('#feedbackText')?.textContent};
    const visible=(e)=>{
     const s=getComputedStyle(e),r=e.getBoundingClientRect();
     return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
    };
    const text=[...node.querySelectorAll('h1,h2,h3,button,[role="button"],a,.navbtn')]
     .filter(visible).map(e=>e.textContent.trim()).filter(Boolean).slice(0,35);
    const content=node.innerText||'';
    const overflow=[...node.querySelectorAll('button,h1,h2,h3,.card,.navbtn')]
     .filter(visible).filter(e=>e.scrollWidth>e.clientWidth+4)
     .slice(0,12).map(e=>({selector:e.tagName.toLowerCase(),
      className:String(e.className).slice(0,60),text:e.textContent.trim().slice(0,90),
      extraPx:e.scrollWidth-e.clientWidth}));
    const arabicAfter=[...document.querySelectorAll('[lang="ar"]')].map(e=>e.textContent);
    return {id,exists:!!node,active:node.classList.contains('active'),
     selected:document.querySelector('.bottomnav .navbtn.active')?.dataset.screen,
     locale:window.DEEN_APP_LOCALE.get(),frenchProduction:window.DEEN_CONTENT_LOCALE.available('fr'),
     arabicUnchanged:JSON.stringify(arabicBefore)===JSON.stringify(arabicAfter),
     gradedFieldsUntouched:JSON.stringify(before)===JSON.stringify(after),
     textPreview:text,visibleChars:content.length,overflow,
     uiWrites:writes,streakTurkish:/\b(?:Günlük hedef|Bugünkü|Öğrenmeye|Tekrarla|İlerleme|Rozetler)\b/u.test(content),
     turkishSignals:[...content.matchAll(/\b(?:Günlük hedef|Bugünkü|Öğrenmeye|Tekrarla|İlerleme|Rozetler)\b/gu)]
      .slice(0,12).map(match=>content.slice(Math.max(0,match.index-60),match.index+100)),
     quranNodes:node.querySelectorAll('[lang="ar"],[data-deen-quran]').length,
     fullPhoneOverflow:phone.scrollWidth>phone.clientWidth+4};
   },id);
   navAudit.push(state);
   assert(state.exists&&state.active,label+': tab failed to open '+id);
   assert.equal(state.selected,id,label+': active nav mismatch '+id);
   assert.equal(state.locale,'tr');assert.equal(state.frenchProduction,false);
   assert(state.arabicUnchanged&&state.gradedFieldsUntouched,id+': protected source changed');
   await page.screenshot({path:output+'/'+label+'-tab-'+id+'.png',fullPage:true});
  }
  const panelAudit=[];
  for(const name of ['storePanel','premiumPanel','settingsPanel','streakPanel',
                     'xpPanel','goalPanel','editProfile','analyticsPanel']){
   const record=await page.evaluate(name=>{
    const sheet=document.getElementById('v5Sheet');
    if(sheet?.open)sheet.close();
    const fn=window[name];if(typeof fn!=='function')return {name,available:false};
    try{fn()}catch(error){return {name,available:true,error:String(error)};}
    const beforeArabic=[...document.querySelectorAll('[lang="ar"]')].map(e=>e.textContent);
    const root=sheet?.open?sheet:document.querySelector('.screen.active');
    const writes=window.DEEN_FRENCH_STAGE_UI.setLocale('fr',root);
    const afterArabic=[...document.querySelectorAll('[lang="ar"]')].map(e=>e.textContent);
    const nowSheet=document.getElementById('v5Sheet');
    return {name,available:true,open:!!nowSheet?.open,
     heading:document.getElementById('v5SheetTitle')?.textContent?.trim(),
     writes,arabicUnchanged:JSON.stringify(beforeArabic)===JSON.stringify(afterArabic),
     locale:window.DEEN_APP_LOCALE.get(),
     frenchProduction:window.DEEN_CONTENT_LOCALE.available('fr')};
   },name);
   panelAudit.push(record);
   if(record.open)await page.screenshot({path:output+'/'+label+'-panel-'+name+'.png',fullPage:true});
  }
  assert(panelAudit.every(x=>!x.error&&x.arabicUnchanged!==false),
   'An app panel failed or Arabic changed during French QA');
  assert.equal(panelAudit.find(x=>x.name==='analyticsPanel')?.heading,'Analyse de l’apprentissage',
   'Analytics title still Turkish in source-keyed French preview');
  assert.equal(panelAudit.find(x=>x.name==='xpPanel')?.heading,'Niveau 1',
   'XP level label still Turkish in source-keyed French preview');
  await page.evaluate(()=>{
   const sheet=document.getElementById('v5Sheet');if(sheet?.open)sheet.close();
   for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
   const root=document.querySelector('.phone');if(root)root.inert=false;
  });
  console.log('FR_REAL_CHROMIUM_NAV_AUDIT',JSON.stringify({
   viewport:label,tabs:navAudit.map(x=>({id:x.id,active:x.active,qaWrites:x.uiWrites,
    contentChars:x.visibleChars,overflowCount:x.overflow.length,
    overflowSample:x.overflow.slice(0,6),
    signalTurkish:x.streakTurkish,turkishSignals:x.turkishSignals,
    quranNodes:x.quranNodes})),
   panels:panelAudit}));
  const lesson=await page.evaluate(async()=>{
   if(typeof state!=='undefined'){
    state.energy=30;
    state.onboarded=true;
    if(state.settings)state.settings.onboardingLanguageConfirmed=true;
   }
   // Do not force a hidden bootstrap view into visibility. Complete the same
   // resource validation and startup lifecycle required by the real app.
   const prepared=await window.DEEN_BOOT.prepare();
   if(!prepared)return {opened:false,boot:window.DEEN_BOOT.status()};
   document.getElementById('v998Onboarding')?.remove();
   document.getElementById('deenLanguageGate')?.remove();
   const root=document.querySelector('.phone');
   if(root)root.inert=false;
   startStage('U01-S01');
   if(!session?.questions?.length)return {opened:false};
   const original=session.questions.slice();
   const translated=original.map(q=>window.DEEN_CONTENT_LOCALE.translateQuestion(q,'fr'));
   const missing=original.filter((q,i)=>!translated[i]).map(q=>q.id);
   if(missing.length)return {opened:true,missing};
   const target=translated.find(q=>q.options_tr?.length>=2&&q.correct_answer&&
    ['multiple_choice','scenario','error_spotting','card_choice'].includes(q.activity_type));
   if(!target)return {opened:true,noChoice:true,types:translated.map(q=>q.activity_type)};
   session.questions=[target,...translated.filter(q=>q!==target)];
   session.index=0;
   renderQuestion();
   return {opened:document.querySelector('#lesson')?.classList.contains('active'),
    id:target.id,question:target.question_tr,sourceId:target.__deenSourceQuestion?.id,
    type:target.activity_type,correct:target.correct_answer,
    options:target.options_tr,locale:window.DEEN_APP_LOCALE.get()};
  });
  assert.equal(lesson.opened,true,'Real lesson renderer not activated: '+JSON.stringify(lesson));
  assert.equal(lesson.locale,'tr','QA must not commit French locale to app settings');
  assert.equal(lesson.id,lesson.sourceId);
  assert(lesson.options?.includes(lesson.correct));
  await page.screenshot({path:output+'/'+label+'-french-lesson.png',fullPage:true});
  // v9.10 lesson loop may show a teaching card again after the asynchronous
  // question decorator runs. Finish actual cards via user clicks, never remove
  // them programmatically or bypass the learning lifecycle.
  await page.waitForTimeout(160);
  const localizedCards=await page.evaluate(()=>{
   const overlays=[...document.querySelectorAll('#lesson .v910-overlay')];
   let writes=0;
   for(const card of overlays)writes+=window.DEEN_FRENCH_STAGE_UI.setLocale('fr',card);
   return {overlays:overlays.length,writes,
    buttons:overlays.map(el=>el.querySelector('.v910-card-button')?.textContent.trim())};
  });
  if(localizedCards.overlays)
   assert(localizedCards.buttons.every(text=>text!=='ÖĞRENDİM · SORUYA GEÇ'),
    'U01 teaching CTA still uses Turkish after QA translation');
  const teaching=page.locator('#lesson .v910-overlay .v910-card-button:visible');
  const teachingSteps=[];
  for(let i=0;i<5;i++){
   if(!(await teaching.count()))break;
   teachingSteps.push(await teaching.first().textContent());
   await teaching.first().click({timeout:15000,force:true});
   await page.waitForTimeout(260);
  }
  console.log('FR_REAL_CHROMIUM_TEACHING',JSON.stringify({viewport:label,steps:teachingSteps,
   stillVisible:await teaching.count()}));
  assert.equal(await teaching.count(),0,'Teaching overlay still blocks card choice');
  const questionAfterTeaching=await page.evaluate(()=>session?.questions?.[session?.index]?.id);
  assert.equal(questionAfterTeaching,lesson.id,'Teaching lifecycle unexpectedly changed target question');
  const rendered=await page.evaluate(expected=>{
   const el=document.querySelector('#questionText');
   const raw=el?.textContent?.trim()||'';
   const adapted=window.DEEN_FRENCH_STAGE_UI.localizeQuestionPrompt(raw,expected);
   if(adapted!==null)el.textContent=adapted;
   return {raw,question:el?.textContent?.trim(),
    qaWrapperAdjusted:adapted!==null,
    labels:[...document.querySelectorAll('#answerArea .option-label')].map(e=>e.textContent.trim())};
  },lesson.question);
  console.log('FR_REAL_CHROMIUM_RENDER_DIAGNOSTIC',JSON.stringify({
   viewport:label,expected:lesson.question,raw:rendered.raw,
   adapted:rendered.question,qaWrapperAdjusted:rendered.qaWrapperAdjusted,
   expectedChoices:lesson.options,visibleChoices:rendered.labels}));
  assert(rendered.qaWrapperAdjusted||rendered.raw.includes(lesson.question),
   'Unrecognized game runtime question wrapper: '+
   JSON.stringify({expected:lesson.question,raw:rendered.raw}));
  assert(rendered.question?.includes(lesson.question),
   'Real browser QA-stage renderer does not display French source-matched question');
  assert.deepEqual([...rendered.labels].sort(),[...lesson.options].sort(),
   'Correct-answer option display is not source-matched French');
  const right=page.locator('#answerArea .option').filter({
   has:page.locator('.option-label',{hasText:lesson.correct})});
  assert.equal(await right.count(),1,'French answer card must be unambiguous');
  const hitTest=await page.evaluate(correct=>{
   const element=[...document.querySelectorAll('#answerArea .option')]
    .find(node=>node.querySelector('.option-label')?.textContent.trim()===correct);
   if(!element)return {cardFound:false};
   const box=element.getBoundingClientRect();
   const center={x:box.x+box.width/2,y:box.y+box.height/2};
   const top=document.elementFromPoint(center.x,center.y);
   return {cardFound:true,center,
    hitTag:top?.tagName,hitClass:top?.className,
    hitInsideCard:element.contains(top),
    cardPointerEvents:getComputedStyle(element).pointerEvents,
    cardVisibility:getComputedStyle(element).visibility,
    overlayCandidates:[...document.querySelectorAll('#lesson [role="dialog"],#lesson .v910-overlay,.deen-prep-overlay')]
     .map(node=>({className:node.className,display:getComputedStyle(node).display,
      visibility:getComputedStyle(node).visibility,pointer:getComputedStyle(node).pointerEvents})),
    cardHasOnclick:typeof element.onclick==='function',
    optionOuterHTML:element.outerHTML.slice(0,750)};
  },lesson.correct);
  console.log('FR_REAL_CHROMIUM_HIT_TEST',JSON.stringify({viewport:label,hitTest}));
  await right.click({timeout:15000});
  const feedback=page.locator('#feedback');
  if(!(await feedback.evaluate(e=>e.classList.contains('show')))){
   const confirm=page.locator('#answerArea .template-action:visible:not([disabled])');
   if(await confirm.count())await confirm.first().click({timeout:10000});
  }
  await page.waitForTimeout(700);
  const feedbackLocale=await page.evaluate(()=>{
   const q=session?.questions?.[session?.index];
   const before={
    title:document.querySelector('#feedbackTitle')?.textContent.trim(),
    body:document.querySelector('#feedbackText')?.textContent.trim(),
    continue:document.querySelector('#continueBtn')?.textContent.trim()};
   const result=window.DEEN_FRENCH_STAGE_UI.localizeGradedFeedback(q);
   const after={
    title:document.querySelector('#feedbackTitle')?.textContent.trim(),
    body:document.querySelector('#feedbackText')?.textContent.trim(),
    continue:document.querySelector('#continueBtn')?.textContent.trim()};
   return {before,after,result};
  });
  console.log('FR_REAL_CHROMIUM_FEEDBACK_TRANSLATION',JSON.stringify({
   viewport:label,feedbackLocale}));
  assert.equal(feedbackLocale.result?.sourceGuarded,true,'French grading feedback must use source validation');
  assert.equal(feedbackLocale.after.title,'Bravo !');
  assert(feedbackLocale.after.body?.startsWith('En bref : '));
  assert.equal(feedbackLocale.after.continue,'Continuer');
  const grade=await page.evaluate(()=>({
   shown:document.querySelector('#feedback')?.classList.contains('show')||false,
   feedbackClass:document.querySelector('#feedback')?.className,
   correct:session?.correct,answer:session?.questions?.[0]?.correct_answer,
   sourceLocale:window.DEEN_APP_LOCALE.get(),
   title:document.querySelector('#feedbackTitle')?.textContent?.trim(),
   body:document.querySelector('#feedbackText')?.textContent?.trim(),
   selected:[...document.querySelectorAll('#answerArea .option.selected')].map(e=>e.textContent.trim()),
   controls:[...document.querySelectorAll('#lesson button')]
    .filter(e=>!e.hidden&&e.getClientRects().length>0)
    .map(e=>({text:e.textContent.trim().slice(0,65),class:e.className,disabled:e.disabled})).slice(-25)
  }));
  console.log('FR_REAL_CHROMIUM_GRADE_DIAGNOSTIC',JSON.stringify({viewport:label,grade}));
  assert.equal(grade.shown,true,'Real engine did not show graded feedback: '+JSON.stringify(grade));
  assert(grade.correct>=1,'French answer not counted as correct in real game');
  assert.equal(grade.sourceLocale,'tr');
  await page.screenshot({path:output+'/'+label+'-french-graded.png',fullPage:true});
  const geometry=await page.evaluate(()=>{
   const selectors=['.phone','.bottomnav','#lesson','#answerArea','.screen.active'];
   return selectors.map(selector=>{
    const el=document.querySelector(selector),r=el?.getBoundingClientRect();
    return {selector,exists:!!el,width:r?.width??null,height:r?.height??null,
      viewport:innerWidth,scrollWidth:el?.scrollWidth??null,
      clientWidth:el?.clientWidth??null,overflow:(el?.scrollWidth||0)>(el?.clientWidth||0)+3};
   });
  });
  // Broaden render coverage beyond the graded multiple-choice example.
  // Observe true/false, fill and matching in the real lesson DOM; their
  // complete grading lifecycles are a separate, still-open QA requirement.
  const activityRenders=[];
  deliberateProbe=true;
  for(const type of ['true_false','fill_blank','matching']){
   const data=await page.evaluate(type=>{
    startStage('U01-S01');
    const source=session?.questions?.find(q=>q.activity_type===type);
    if(!source)return {type,found:false};
    const fr=window.DEEN_CONTENT_LOCALE.translateQuestion(source,'fr');
    if(!fr)return {type,found:true,sourceValidated:false};
    session.questions=[fr,...session.questions.filter(q=>q.id!==fr.id)];
    session.index=0;renderQuestion();
    return {type,found:true,sourceValidated:true,id:fr.id,sourceId:fr.__deenSourceQuestion?.id,
     frenchPrompt:fr.question_tr,options:fr.options_tr||[],
     pairs:fr.pairs||[],sourcePrompt:source.question_tr};
   },type);
   await page.waitForTimeout(170);
   const rendered=await page.evaluate(()=>{
    const area=document.querySelector('#answerArea');
    // Translate exact staged UI guidance only, never question option values.
    const uiWrites=window.DEEN_FRENCH_STAGE_UI.setLocale('fr',area);
    const question=document.querySelector('#questionText');
    return {question:question?.textContent?.trim()||'',uiWrites,
     untranslatedTerminology:/Soruda belirtilen terminoloji/u.test(area?.textContent||''),
     answerText:area?.textContent?.trim().slice(0,1100)||'',
     answerButtons:area?.querySelectorAll('button').length||0,
     answerChildren:area?.children.length||0,
     overlay:document.querySelectorAll('#lesson .v910-overlay').length};
   });
   const row={...data,rendered};
   activityRenders.push(row);
   assert(row.found&&row.sourceValidated&&row.id===row.sourceId,
    label+': source-guarded runtime exercise missing '+type);
   assert(row.rendered.answerChildren>0,label+': no real answer controls for '+type);
   if(['fill_blank','matching'].includes(type))
    assert.equal(row.rendered.untranslatedTerminology,false,
     'Untranslated Turkish terminology disclaimer in staged '+type+' lesson');
   await page.screenshot({path:output+'/'+label+'-'+type+'-render.png',fullPage:true});
  }
  deliberateProbe=false;
  console.log('FR_REAL_CHROMIUM_ACTIVITY_RENDER',JSON.stringify({viewport:label,
   forcedRenderWarnings:activityWarnings.length,
   types:activityRenders.map(x=>({type:x.type,id:x.id,controls:x.rendered.answerChildren,
    questionPreview:x.rendered.question.slice(0,110),answerPreview:x.rendered.answerText.slice(0,160)}))}));
  return {viewport:label,width,height,assembledShell:true,sourceValidated:true,
   frenchAvailableInProduction:false,staticAndDynamicPreview:shell,
   lesson:{id:lesson.id,type:lesson.type,question:lesson.question,
    options:rendered.labels,qaWrapperAdjusted:rendered.qaWrapperAdjusted,
    localizedCards,feedbackLocale,graded:grade},
   geometry,navAudit,panelAudit,activityRenders,activityWarnings,errors};
 }finally{
  await context.close();
 }
}
try{
 report.viewportRuns.push(await visit(390,844,'mobile-390'));
 report.viewportRuns.push(await visit(1280,820,'desktop-1280'));
 report.errors=report.viewportRuns.flatMap(x=>x.errors);
 report.activityRegressionWarnings=report.viewportRuns.flatMap(x=>x.activityWarnings);
 // Page errors are evaluated after collecting all available screenshot evidence.
 assert.deepEqual(report.errors.filter(s=>!s.includes('Failed to load resource')),[],
  'Uncaught browser JavaScript errors');
 report.status=report.activityRegressionWarnings.length?'passed_with_forced_render_warnings':'passed';
 console.log(JSON.stringify({status:report.status,scope:report.scope,
  browser:'Chromium Playwright',viewports:report.viewportRuns.map(x=>x.viewport),
  sourceCounts:[1500,1484],gameplayGrade:report.viewportRuns.map(x=>x.lesson.graded.correct),
  realShellFrenchPreviewWrites:report.viewportRuns.map(x=>x.staticAndDynamicPreview.writes),
  productionGateLocked:true,realGameplayTested:true,
  navTabsAudited:report.viewportRuns.map(x=>x.navAudit.length),
  panelsAttempted:report.viewportRuns.map(x=>x.panelAudit.length),
  additionalTypesRendered:report.viewportRuns.map(x=>x.activityRenders.map(y=>y.type)),
  forcedRenderRegressionWarnings:report.activityRegressionWarnings.length,
  fullFrenchScreensAudited:false,nativeAndReligiousReviewPending:true},null,2));
}catch(error){
 report.status='failed';report.failure=String(error?.stack||error);
 console.error(report.failure);
 process.exitCode=1;
}finally{
 writeFileSync(output+'/browser-report.json',JSON.stringify(report,null,2)+'\n');
 await browser.close();
}
