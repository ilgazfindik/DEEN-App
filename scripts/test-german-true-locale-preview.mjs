/*
 * Genuine 'de' runtime bootstrap acceptance in an isolated local browser.
 * The test overrides the manifest IN MEMORY, at 127.0.0.1 only.
 * Production files, releases, audit approvals, and user accounts are untouched.
 * An alternate browser without this init script MUST remain blocked.
 */
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
const origin=process.env.DEEN_QA_ORIGIN||'http://127.0.0.1:8765';
const output=process.env.DEEN_QA_OUTPUT||'qa-artifacts/german-browser';
if(new URL(origin).hostname!=='127.0.0.1')throw Error('QA_PREVIEW_HOST_REQUIRED');
const fixture=JSON.parse(readFileSync(output+'/qa-preview-config.json','utf8'));
assert(fixture.qa_only&&fixture.production_untouched&&fixture.actual_german_approved===false);
assert.equal(fixture.parts.length,114);
mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report={scope:'TRUE_GERMAN_RUNTIME_LOCAL_ONLY',real_manifest_modified:false,
 synthetic_approval_only_in_browser_memory:true,locale:'de',production_release:false,errors:[]};
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
page.on('pageerror',e=>report.errors.push(String(e.stack||e)));
page.on('console',m=>{if(m.type()==='error')report.errors.push('console:'+m.text())});
try{
 await page.addInitScript(({preview})=>{
  if(location.hostname!=='127.0.0.1')throw Error('PREVIEW_HOST_NOT_LOCAL');
  let current;
  Object.defineProperty(window,'__DEEN_CONTENT_MANIFEST__',{
   configurable:true,enumerable:true,
   get(){return current},
   set(value){
    if(!value||value.languages?.de?.question_data!=='missing'||value.languages.de.global_qa!=='blocked')
     throw Error('PREVIEW_DID_NOT_START_FROM_BLOCKED_RELEASE');
    if(value.languages.de.religious_expert_approved!==false)
     throw Error('UNEXPECTED_RELEASE_APPROVAL');
    current=value;
    // Synthetic approval for this disposable browser ONLY: all source packs
    // still retain their literal expert_approved:false flags and SHA-256 checks.
    current.languages.de=structuredClone(preview);
    current.__deenSyntheticGermanQA=true;
   }
  });
 },{preview:fixture.preview_language_config});
 const response=await page.goto(origin+'/?previewLanguage=1',
  {waitUntil:'domcontentloaded',timeout:60000});
 assert.equal(response?.status(),200);
 await page.waitForSelector('#deenLanguageGate [data-locale="de"]',{timeout:90000});
 await page.locator('#deenLanguageGate [data-locale="de"]').click();
 await page.locator('#deenLanguageGate .deen-language-continue').click();
 await page.waitForFunction(()=>window.DEEN_APP_LOCALE?.get()==='de'&&
    window.DEEN_CONTENT_LOCALE?.available('de')&&
    window.__DEEN_CONTENT_MANIFEST__?.__deenSyntheticGermanQA===true,
  null,{timeout:100000});
 await page.waitForFunction(()=>typeof QUESTIONS!=='undefined'&&
    Array.isArray(QUESTIONS)&&QUESTIONS.length===1484,null,{timeout:90000});
 const ready=await page.evaluate(async()=>{
  if(typeof state==='undefined'||!state.settings)throw Error('Missing app state');
  // Skip only the personal-data onboarding sequence in this disposable E2E
  // profile, not language selection, actual content loading or validation.
  state.onboarded=true;
  state.settings.onboardingLanguageConfirmed=true;
  state.energy=30;
  const success=await window.DEEN_BOOT.prepare();
  return {success,phase:window.DEEN_BOOT.status().phase,
   error:window.DEEN_BOOT.status().error,
   locale:window.DEEN_APP_LOCALE.get(),doc_lang:document.documentElement.lang,
   config_injected:window.__DEEN_CONTENT_MANIFEST__.__deenSyntheticGermanQA,
   available:window.DEEN_CONTENT_LOCALE.available('de'),
   base:window.DEEN_CONTENT_LOCALE.inspectBank(window.DEEN_BASE_QUESTIONS,'de'),
   active:window.DEEN_CONTENT_LOCALE.inspectBank(QUESTIONS,'de'),
   arabic:document.querySelector('[lang="ar"]')?.textContent?.trim()||null};
 });
 report.boot={success:ready.success,phase:ready.phase,error:ready.error,
  locale:ready.locale,doc_lang:ready.doc_lang,
  available:ready.available,baseCount:ready.base.sourceCount,
  baseFailed:ready.base.failedIds.slice(0,18),
  activeCount:ready.active.sourceCount,activeFailed:ready.active.failedIds.slice(0,18)};
 assert.equal(ready.success,true,'Native German DEEN_BOOT.prepare was not ready');
 assert.equal(ready.phase,'ready');
 assert.equal(ready.locale,'de');
 assert.equal(ready.doc_lang,'de');
 assert.equal(ready.available,true);
 assert.equal(ready.base.sourceCount,1500);
 assert.equal(ready.active.sourceCount,1484);
 assert.deepEqual(ready.base.failedIds,[]);
 assert.deepEqual(ready.active.failedIds,[]);
 const stage=await page.evaluate(()=>{
  for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
  for(const id of ['v998Onboarding','deenPreparation','deenLanguageGate'])
   document.getElementById(id)?.remove();
  document.getElementById('energyModal')?.classList.remove('show');
  document.querySelector('.phone').inert=false;
  startStage('U01-S01');
  if(!session?.questions?.length)return {opened:false};
  const selectedIds=session.questions.map(q=>q.id);
  const initiallyLocalized=session.questions.filter(q=>q.__deenContentLocale==='de').length;
  // The stage translates lazily as each question enters the real renderer.
  const renders=[];
  for(let i=0;i<selectedIds.length;i++){
   session.index=i;
   renderQuestion();
   const question=session.questions[i];
   const source=question.__deenSourceQuestion;
   renders.push({index:i,id:question.id,type:question.activity_type,
    language:question.__deenContentLocale||null,
    localized:question.__deenContentLocale==='de',
    source_distinct:!!source&&source.question_tr!==question.question_tr,
    displayed_text:document.getElementById('questionText')?.textContent?.trim()||null,
    question:question.question_tr,answer:question.correct_answer,
    options:question.options_tr,pairs:question.pairs,items:question.items,
    order:question.correct_order});
  }
  session.index=0;renderQuestion();
  return {opened:true,selected_count:selectedIds.length,initially_localized:initiallyLocalized,
   renders,question_order_stable:selectedIds.every((id,i)=>session.questions[i]?.id===id),
   rendered:document.getElementById('questionText')?.textContent||null,
   answerLabels:[...document.querySelectorAll('#answerArea .option-label')]
    .map(el=>el.textContent?.trim())};
 });
 report.lesson=stage;
 assert.equal(stage.opened,true,'Stage did not open under German actual locale');
 assert.equal(stage.selected_count,12,'Unexpected active U01 lesson question count');
 assert.equal(stage.question_order_stable,true,'German rendering mutated lesson question order');
 assert.equal(stage.renders.length,12);
 assert(stage.renders.every(q=>q.localized),
  'The real lesson renderer failed to translate one or more questions: '+
  JSON.stringify(stage.renders.filter(q=>!q.localized).map(q=>q.id)));
 assert(stage.renders.every(q=>q.source_distinct),
  'German question content did not retain its original source');
 const normalizeSentence=s=>String(s||'')
  .replace(/_{2,}|[\u00a0]+/g,' ').replace(/\s+/g,' ').trim();
 const mismatched=stage.renders.filter(q=>
  normalizeSentence(q.displayed_text)!==normalizeSentence(q.question));
 assert.deepEqual(mismatched.map(q=>({id:q.id,rendered:q.displayed_text,expected:q.question})),[],
  'A rendered lesson question differs from verified German (blank slots normalized)');
 assert(stage.renders.filter(q=>Array.isArray(q.options)).every(q=>
  q.options.includes(q.answer)),'Rendered German answers did not contain the correct choice');
 await page.screenshot({path:output+'/true-locale-german-first-lesson.png',fullPage:true});
 const content=await page.evaluate(()=>{
  const source=window.DEEN_CONTENT_LOCALE.inspectBank(QUESTIONS,'de');
  return {locale:window.DEEN_APP_LOCALE.get(),
   source_count:source.sourceCount,failedIds:source.failedIds.slice(0,10),
   still_synthetic:window.__DEEN_CONTENT_MANIFEST__.__deenSyntheticGermanQA===true};
 });
 report.content=content;
 assert.deepEqual(content.failedIds,[]);
 // Apply the existing German UI staging adapter only inside the disposable
 // DE-language browser. Production still has no implicit DE DOM renderer.
 const chrome=await page.evaluate(async()=>{
  const files=['german-ui.staging.json','german-ui.lesson-flow.staging.json',
   'german-ui.premium-shop.staging.json','german-ui.quran-controls.staging.json',
   ...Array.from({length:8},(_,i)=>'german-ui.reference-batch-'+
    String(i+1).padStart(2,'0')+'.staging.json'),'german-ui.real-lesson.staging.json'];
  const json=async path=>{
   const res=await fetch('/assets/i18n/'+path,{cache:'no-store'});
   if(!res.ok)throw Error('German QA UI pack not served: '+path);
   return res.json();
  };
  const [packs,reference]=await Promise.all([
   Promise.all(files.map(json)),json('english-ui.draft.json')]);
  const {createGermanUIStagingRenderer}=await import(
   '/assets/i18n/german-ui.renderer.staging.mjs');
  const renderer=createGermanUIStagingRenderer({packs,
   englishReference:reference.translations});
  const root=document.querySelector('.phone');
  const arabicBefore=[...root.querySelectorAll('[lang="ar"]')]
   .map(x=>x.textContent).join('|');
  const answerBefore=document.getElementById('answerArea')?.innerHTML;
  const questionBefore=document.getElementById('questionText')?.textContent;
  const audit=renderer.render(root,{qaMode:true,locale:'de',documentRef:document});
  window.__DEEN_GERMAN_TRUE_LOCALE_UI_QA__=renderer;
  return {scanned:audit.scanned,writes:audit.writes,unresolved:audit.unresolved,
   current_locale:window.DEEN_APP_LOCALE.get(),
   arabic_unchanged:arabicBefore===
    [...root.querySelectorAll('[lang="ar"]')].map(x=>x.textContent).join('|'),
   graded_content_unchanged:answerBefore===document.getElementById('answerArea')?.innerHTML&&
    questionBefore===document.getElementById('questionText')?.textContent,
   release_enabled:window.__DEEN_CONTENT_MANIFEST__.languages.de
    .religious_expert_approved===true};
 });
 report.chrome=chrome;
 assert.equal(chrome.current_locale,'de');
 assert(chrome.scanned>100,'German app UI shell not scanned');
 assert.deepEqual(chrome.unresolved,[],'Turkish UI chrome remains in true German QA session');
 assert.equal(chrome.arabic_unchanged,true);
 assert.equal(chrome.graded_content_unchanged,true);
 assert.equal(chrome.release_enabled,false);
 await page.screenshot({path:output+'/true-locale-german-ui-staging.png',fullPage:true});

 // Exercise the ACTUAL grader under the actual 'de' locale, not a Turkish page
 // with a translated source injected. The lesson's own teaching card remains.
 const teaching=page.locator('#lesson .v910-card-button:visible');
 if(await teaching.count())await teaching.first().click({timeout:20000});
 const correct=stage.renders[0].answer;
 const answer=page.locator('#answerArea .option')
  .filter({has:page.locator('.option-label',{hasText:correct})});
 assert.equal(await answer.count(),1,'Exactly one correct German answer must be shown');
 await answer.click({timeout:20000});
 await page.waitForTimeout(550);
 const beforeGrade=await page.evaluate(()=>({
  feedback:document.getElementById('feedback')?.classList.contains('show')||false
 }));
 if(!beforeGrade.feedback){
  const confirm=page.locator('#answerArea .template-action:visible:not([disabled])');
  if(await confirm.count())await confirm.first().click({timeout:12000});
 }
 const grading=await page.evaluate(()=>{
  const question=session?.questions?.[0],source=question?.__deenSourceQuestion;
  const resolved=source&&window.DEEN_CONTENT_LOCALE.translateQuestion(source,'de');
  const explanation=document.getElementById('feedbackText')?.textContent?.trim();
  return {app_locale:window.DEEN_APP_LOCALE.get(),
   selected_question:question?.id,
   translated_answer:question?.correct_answer,
   resolved_answer:resolved?.correct_answer,
   source_answer:source?.correct_answer,
   answered_correct:session?.correct,
   feedback_visible:document.getElementById('feedback')?.classList.contains('show'),
   feedback_title:document.getElementById('feedbackTitle')?.textContent?.trim(),
   feedback_text:explanation,expected_explanation:resolved?.explanation_tr};
 });
 report.grading=grading;
 assert.equal(grading.app_locale,'de');
 assert.equal(grading.feedback_visible,true,'German response did not reach grading feedback');
 assert.equal(grading.answered_correct,1,'German answer was graded incorrectly');
 assert.equal(grading.translated_answer,grading.resolved_answer);
 assert.notEqual(grading.source_answer,grading.translated_answer);
 assert(grading.feedback_text?.includes(grading.expected_explanation),
  'German answer feedback did not retain the source-matched German explanation');
 // The actual app may still contain Turkish wrapper chrome in the feedback;
 // apply only staged QA UI chrome and report source wrappers separately.
 const feedbackChrome=await page.evaluate(()=>{
  const q=session.questions[0],el=document.getElementById('feedbackText');
  const old=el?.textContent?.trim()||'';
  let wrapperTranslated=false;
  if(q.__deenContentLocale==='de'&&q.__deenSourceQuestion&&
     window.DEEN_CONTENT_LOCALE.translateQuestion(q.__deenSourceQuestion,'de')
      ?.explanation_tr===q.explanation_tr&&old==='Kısaca: '+q.explanation_tr){
   el.textContent='Kurz gesagt: '+q.explanation_tr;
   wrapperTranslated=true;
  }
  const audit=window.__DEEN_GERMAN_TRUE_LOCALE_UI_QA__.render(
   document.getElementById('lesson'),{qaMode:true,locale:'de',documentRef:document});
  return {wrapperTranslated,unresolved:audit.unresolved,
   visible_feedback:document.getElementById('feedbackText')?.textContent?.trim(),
   heading:document.getElementById('feedbackTitle')?.textContent?.trim()};
 });
 report.feedback_chrome=feedbackChrome;
 assert.deepEqual(feedbackChrome.unresolved,[],
  'German graded feedback UI contains Turkish text');
 assert(feedbackChrome.visible_feedback.endsWith(grading.expected_explanation));
 await page.screenshot({path:output+'/true-locale-german-graded.png',fullPage:true});

 // A fresh stage in the same ephemeral German profile exercises the WRONG
 // answer branch without touching the 1,500/1,484 verified question banks.
 const wrongStage=await page.evaluate(()=>{
  document.getElementById('energyModal')?.classList.remove('show');
  if(typeof state!=='undefined')state.energy=30;
  startStage('U01-S01');
  if(!session?.questions?.length)throw Error('Unable to restart lesson for negative QA');
  const q=session.questions[0];
  return {id:q.id,language:q.__deenContentLocale,correct:q.correct_answer,
   options:[...(q.options_tr||[])],source_unchanged:!!q.__deenSourceQuestion};
 });
 assert.equal(wrongStage.language,'de');
 assert.equal(wrongStage.source_unchanged,true);
 const teachingAgain=page.locator('#lesson .v910-card-button:visible');
 if(await teachingAgain.count())await teachingAgain.first().click({timeout:20000});
 const incorrect=wrongStage.options.find(value=>value!==wrongStage.correct);
 assert(incorrect,'No alternative answer for negative grading check');
 const wrongButton=page.locator('#answerArea .option')
  .filter({has:page.locator('.option-label',{hasText:incorrect})});
 assert.equal(await wrongButton.count(),1);
 await wrongButton.click({timeout:20000});
 await page.waitForTimeout(500);
 const initiallyShown=await page.locator('#feedback').evaluate(el=>el.classList.contains('show'));
 if(!initiallyShown){
  const confirm=page.locator('#answerArea .template-action:visible:not([disabled])');
  if(await confirm.count())await confirm.first().click({timeout:12000});
 }
 const wrong=await page.evaluate(()=>{
  const q=session?.questions?.[0],source=q?.__deenSourceQuestion;
  const verified=source&&window.DEEN_CONTENT_LOCALE.translateQuestion(source,'de');
  return {app_locale:window.DEEN_APP_LOCALE.get(),session_score:session?.correct,
   feedback_visible:document.getElementById('feedback')?.classList.contains('show'),
   message:document.getElementById('feedbackTitle')?.textContent?.trim(),
   explanation:document.getElementById('feedbackText')?.textContent?.trim(),
   translated_answer:q?.correct_answer,verified_answer:verified?.correct_answer,
   verified_explanation:verified?.explanation_tr};
 });
 report.wrong_answer=wrong;
 assert.equal(wrong.app_locale,'de');
 assert.equal(wrong.feedback_visible,true,'Incorrect German answer did not show feedback');
 assert.equal(wrong.session_score,0,'Incorrect German answer was marked correct');
 assert.equal(wrong.translated_answer,wrong.verified_answer);
 assert(wrong.explanation.includes(wrong.verified_explanation),
  'Wrong-answer feedback omitted source-matched German explanation');
 const wrongUI=await page.evaluate(()=>{
  const q=session.questions[0],el=document.getElementById('feedbackText');
  const before=el?.textContent?.trim();
  const source=q?.__deenSourceQuestion;
  const checked=source&&window.DEEN_CONTENT_LOCALE.translateQuestion(source,'de');
  let guarded_wrapper=false;
  if(q.__deenContentLocale==='de'&&checked?.explanation_tr===q.explanation_tr&&
     before==='Kısaca: '+q.explanation_tr){
   el.textContent='Kurz gesagt: '+q.explanation_tr;
   guarded_wrapper=true;
  }
  const audit=window.__DEEN_GERMAN_TRUE_LOCALE_UI_QA__.render(
   document.getElementById('lesson'),{qaMode:true,locale:'de',documentRef:document});
  return {unresolved:audit.unresolved,guarded_wrapper,
   heading:document.getElementById('feedbackTitle')?.textContent?.trim(),
   explanation:document.getElementById('feedbackText')?.textContent?.trim()};
 });
 report.wrong_answer.ui=wrongUI;
 assert.deepEqual(wrongUI.unresolved,[],
  'Untranslated UI chrome after an incorrect German answer');
 await page.screenshot({path:output+'/true-locale-german-wrong-answer.png',fullPage:true});

 // True German interactive MATCHING: actual opposing card taps, no direct
 // completeQuestion calls and no JS mutations of source answer pairs.
 const matching=await page.evaluate(()=>{
  document.getElementById('energyModal')?.classList.remove('show');
  if(typeof state!=='undefined')state.energy=30;
  startStage('U01-S01');
  session.index=1;
  renderQuestion();
  const q=session.questions[1];
  return {id:q.id,locale:window.DEEN_APP_LOCALE.get(),type:q.activity_type,
   translated:q.__deenContentLocale==='de',
   source_exists:!!q.__deenSourceQuestion,
   pairs:structuredClone(q.pairs),
   cards:[...document.querySelectorAll('#answerArea .v1017-card')].map(el=>({
    side:el.dataset.side,pair:Number(el.dataset.pair),text:el.querySelector('.v1017-card-label')?.textContent}))};
 });
 report.matching={start:matching};
 assert.equal(matching.type,'matching');
 assert.equal(matching.locale,'de');
 assert.equal(matching.translated,true);
 assert.equal(matching.source_exists,true);
 assert.equal(matching.cards.length,matching.pairs.length*2);
 const matchingTeaching=page.locator('#lesson .v910-card-button:visible');
 if(await matchingTeaching.count())await matchingTeaching.first().click({timeout:15000});
 report.matching.tapTrace=[];
 for(let i=0;i<matching.pairs.length;i++){
  // Pair order changes by shuffle, so select the SOURCE-GUARDED semantic pair
  // using data-pair; the DOM click handlers still perform all validation.
  const left=page.locator('#answerArea .v1017-card[data-side="left"][data-pair="'+i+'"]');
  const right=page.locator('#answerArea .v1017-card[data-side="right"][data-pair="'+i+'"]');
  assert.equal(await left.count(),1);
  assert.equal(await right.count(),1);
  await left.click({timeout:15000});
  const selected=await page.evaluate(()=>({
   snapshot:window.DEEN_MATCHING_SESSION_STATE?.snapshot?.(),
   last:document.documentElement.dataset.deenMatchingLast,
   overlays:[...document.querySelectorAll('#lesson .v910-card-button')]
    .filter(el=>el.getClientRects().length).map(el=>el.textContent?.trim())
  }));
  await right.click({timeout:15000});
  const count=await page.evaluate(()=>({
   public_snapshot:window.DEEN_MATCHING_SESSION_STATE?.snapshot?.(),
   session_state:session?.__deenMatchingState?{
    key:session.__deenMatchingState.key,
    matchedLeft:[...session.__deenMatchingState.matchedLeft],
    matchedRight:[...session.__deenMatchingState.matchedRight],
    errors:session.__deenMatchingState.errors,
    finished:session.__deenMatchingState.finished}:null,
   dom_matched:document.querySelectorAll('#answerArea .v1017-card.matched').length,
   footer:document.querySelector('#answerArea .v1017-count')?.textContent,
   progress:document.documentElement.dataset.deenMatchingProgress
  }));
  report.matching.tapTrace.push({i,after_left:selected,after_right:count,
   last:await page.locator('html').getAttribute('data-deen-matching-last')});
  assert.equal(count.session_state?.matchedLeft.length,i+1,
    'Actual session did not persist correct German pairing: '+JSON.stringify(report.matching.tapTrace));
  assert.equal(count.session_state.errors,0,'Correct German matching pair marked incorrect');
  assert.equal(count.dom_matched,(i+1)*2,'Matched German cards not marked in DOM');
 }
 await page.waitForFunction(()=>document.getElementById('feedback')?.classList.contains('show'),
  null,{timeout:15000});
 const matched=await page.evaluate(()=>({
  locale:window.DEEN_APP_LOCALE.get(),correct:session.correct,
  state:session?.__deenMatchingState?{
   finished:session.__deenMatchingState.finished,
   errors:session.__deenMatchingState.errors,
   matchedLeft:[...session.__deenMatchingState.matchedLeft]}:null,
  global_snapshot:window.DEEN_MATCHING_SESSION_STATE?.snapshot?.(),
  feedback:document.getElementById('feedbackTitle')?.textContent?.trim()}));
 report.matching.result=matched;
 assert.equal(matched.correct,1);
 assert.equal(matched.state.finished,true);
 assert.equal(matched.state.matchedLeft.length,matching.pairs.length);
 assert.equal(matched.state.errors,0);
 await page.screenshot({path:output+'/true-locale-german-matching-graded.png',fullPage:true});

 // True German FILL-BLANK: user chooses the exact translated missing word
 // from the rendered chip bank, then confirms through its own grading action.
 const blank=await page.evaluate(()=>{
  document.getElementById('energyModal')?.classList.remove('show');
  if(typeof state!=='undefined')state.energy=30;
  startStage('U01-S01');
  session.index=3;
  renderQuestion();
  const q=session.questions[3];
  return {id:q.id,locale:window.DEEN_APP_LOCALE.get(),type:q.activity_type,
   translated:q.__deenContentLocale==='de',
   correct_answer:q.correct_answer,source_answer:q.__deenSourceQuestion?.correct_answer,
   options:q.options_tr,
   chips:[...document.querySelectorAll('#answerArea .fill-choice')].map(el=>({
    text:el.textContent?.trim(),html:el.outerHTML.slice(0,420)})),
   input:!!document.querySelector('#answerArea input'),
   checks:[...document.querySelectorAll('#answerArea button')].filter(el=>
    el.classList.contains('template-action')).map(el=>({text:el.textContent?.trim(),disabled:el.disabled})),
   slot:document.querySelector('#questionText')?.textContent?.trim()};
 });
 report.fill_blank={start:blank};
 assert.equal(blank.type,'fill_blank');
 assert.equal(blank.locale,'de');
 assert.equal(blank.translated,true);
 assert(blank.options.includes(blank.correct_answer));
 assert.notEqual(blank.source_answer,blank.correct_answer);
 if(blank.chips.length){
  const chip=page.locator('#answerArea .fill-choice')
   .filter({hasText:blank.correct_answer});
  assert.equal(await chip.count(),1);
  await chip.click({timeout:15000,force:true});
 }else if(blank.input){
  await page.locator('#answerArea input').first().fill(blank.correct_answer);
 }else throw Error('German fill-blank has no interactive word choice or input');
 const confirm=page.locator('#answerArea .template-action:visible:not([disabled])');
 assert(await confirm.count()>0,'Fill-blank lacks a usable answer confirmation');
 await confirm.first().click({timeout:15000,force:true});
 await page.waitForTimeout(550);
 const filled=await page.evaluate(()=>({
  correct:session.correct,feedback:document.getElementById('feedback')?.classList.contains('show'),
  locale:window.DEEN_APP_LOCALE.get(),graded_source:session.questions[3]?.__deenSourceQuestion?.id,
  answer:session.questions[3]?.correct_answer
 }));
 report.fill_blank.result=filled;
 assert.equal(filled.locale,'de');
 assert.equal(filled.correct,1,'German fill-blank correct word graded incorrectly');
 assert.equal(filled.feedback,true);
 await page.screenshot({path:output+'/true-locale-german-fill-blank-graded.png',fullPage:true});




 assert.deepEqual(report.errors,[],'Browser threw errors during real German boot');
 report.status='passed';
 console.log(JSON.stringify(report,null,2));
}catch(e){report.status='failed';report.error=String(e.stack||e);
 console.error(JSON.stringify(report,null,2));process.exitCode=1;}
finally{
 writeFileSync(output+'/true-locale-report.json',JSON.stringify(report,null,2)+'\n');
 await page.close();await browser.close();
}
