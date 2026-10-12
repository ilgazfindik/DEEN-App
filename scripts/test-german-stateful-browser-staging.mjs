/*
 * Browser-driven German locale gating and post-navigation QA.
 * Staging only: starts in Turkish, never enables German lessons or writes to main.
 * Renderer is applied explicitly in a disposable browser, not production boot.
 */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';

const origin=process.env.DEEN_QA_ORIGIN||'http://127.0.0.1:8765';
const output=process.env.DEEN_QA_OUTPUT||'qa-artifacts/german-browser';
mkdirSync(output,{recursive:true});
const report={schema_version:1,scope:'QA-only language gate and navigated tabs',
 staging_only:true,release_enabled:false,gate:null,tabs:[],modals:[],lesson:null,errors:[]};
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
async function verifyGermanGate(){
 const page=await browser.newPage({viewport:{width:390,height:844}});
 page.on('pageerror',error=>report.errors.push('gate: '+String(error)));
 try{
  await page.goto(origin+'/?previewLanguage=1',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('#deenLanguageGate [data-locale="de"]',{timeout:90000});
  await page.locator('#deenLanguageGate [data-locale="de"]').click();
  assert.equal(await page.locator('#deenLanguageGate').getAttribute('lang'),'de');
  assert.equal(await page.locator('#deenLanguageGate .deen-language-continue').textContent(),'Weiter');
  await page.locator('#deenLanguageGate .deen-language-continue').click();
  await page.waitForFunction(()=>window.DEEN_APP_LOCALE?.get()==='de',{timeout:25000});
  await page.waitForFunction(()=>Boolean(window.DEEN_CONTENT_LOCALE?.available&&window.DEEN_BOOT?.prepare),null,{timeout:100000});
  const blocked=await page.evaluate(async()=>{
   const available=window.DEEN_CONTENT_LOCALE.available('de');
   const result=await window.DEEN_BOOT.prepare();
   const dialog=document.querySelector('#deenPreparation');
   return {available,prepare_result:result,phase:window.DEEN_BOOT.status().phase,
    locale:window.DEEN_APP_LOCALE.get(),startup:document.documentElement.dataset.deenStartup,
    heading:dialog?.querySelector('h1')?.textContent||null,
    detail:dialog?.querySelector('p')?.textContent||null,
    arabic_original:document.querySelector('[lang="ar"]')?.textContent||null};
  });
  assert.equal(blocked.available,false);
  assert.equal(blocked.prepare_result,false);
  assert.equal(blocked.phase,'blocked');
  assert.equal(blocked.locale,'de');
  assert.equal(blocked.startup,'blocked');
  assert.equal(blocked.heading,'Lektionen in dieser Sprache sind noch nicht verfügbar');
  assert(!/Bu dilde|henüz hazır|Öğrenmeye başlamak/.test(blocked.detail||''),
   'German unavailable-language explanation leaked Turkish');
  await page.screenshot({path:output+'/stateful-german-blocked.png',fullPage:true});
  return blocked;
 }finally{await page.close()}
}
async function auditNavTabs(){
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 let currentProbe='boot';
 page.on('pageerror',error=>report.errors.push('tabs['+currentProbe+']: '+String(error.stack||error)));
 await page.addInitScript(()=>{
  try{localStorage.setItem('deen_app_language_v1','tr')}catch(_){}
 });
 try{
  await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>Boolean(window.DEEN_APP_LOCALE&&window.DEEN_CONTENT_LOCALE
   &&document.querySelector('.bottomnav [data-screen="learnScreen"]')
   &&document.querySelector('#lesson .question-frame')),null,{timeout:100000});
  // A new-profile onboarding layer blocks taps. Remove it ONLY in this
  // disposable QA page to exercise the already assembled application's nav.
  // This deliberately does not test production onboarding completion.
  await page.waitForFunction(()=>typeof QUESTIONS!=='undefined'&&Array.isArray(QUESTIONS)&&QUESTIONS.length===1484,null,{timeout:25000});
  const qaBoot=await page.evaluate(async()=>{
   // Disposable QA profile; first complete the actual Turkish boot validation.
   if(typeof state!=='undefined'&&state?.settings){
    state.settings.onboardingLanguageConfirmed=true;
    state.onboarded=true;
   }
   const ready=await window.DEEN_BOOT.prepare();
   for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
   for(const id of ['v998Onboarding','deenPreparation','deenLanguageGate'])
    document.getElementById(id)?.remove();
   const phone=document.querySelector('.phone');phone.inert=false;
   const scriptOrigin=[...document.scripts].map((script,index)=>{
    const source=script.textContent||'';
    const lines=source.split('\n');
    const hits=lines.map((line,i)=>({i,line})).filter(row=>
     /function\s+cards\s*\(|\bconst\s+T\s*=|\bfunction\s+T\s*\(|\bT\s*\(/.test(row.line));
    return {index,id:script.id||'',src:script.src||'',lineCount:lines.length,
     candidates:hits.filter(row=>/function\s+cards\s*\(|\bconst\s+T\s*=|\bfunction\s+T\s*\(/.test(row.line))
      .slice(0,8).map(row=>({line:row.i+1,text:row.line.slice(0,220)})),
     tCalls:hits.filter(row=>/\bT\s*\(/.test(row.line)).length};
   }).filter(x=>x.candidates.length||x.tCalls>8);
   const active=typeof QUESTIONS!=='undefined'&&Array.isArray(QUESTIONS)?QUESTIONS:[];
   const base=Array.isArray(window.DEEN_BASE_QUESTIONS)?window.DEEN_BASE_QUESTIONS:[];
   const ids=items=>items.map(q=>String(q?.id||q?.questionId||'')).filter(Boolean);
   const activeIds=ids(active),baseIds=ids(base),baseSet=new Set(baseIds);
   const approvedU01=await fetch('/assets/i18n/questions/en/runtime/U01.live.json')
    .then(r=>r.ok?r.json():Promise.reject(Error('Missing English approved U01 live pack')));
   const knownU01=new Set(Object.keys(approvedU01.translations||{}));
   const unmapped=active.filter(q=>q?.id?.startsWith('DEEN-U01-')&&!knownU01.has(q.id));
   const uncovered=unmapped.map(q=>({
    id:q.id,stage:q.stage_id,type:q.activity_type,question_tr:q.question_tr,
    explanation_tr:q.explanation_tr,options_tr:q.options_tr,
    correct_answer:q.correct_answer,pairs:q.pairs,items:q.items,correct_order:q.correct_order
   }));
   const unique=new Set(activeIds),frequency=new Map();
   const byUnit={};
   for(const id of activeIds){const m=id.match(/-U(\d{2})-/);const unit=m?'U'+m[1]:'other';byUnit[unit]=(byUnit[unit]||0)+1;}
   for(const id of activeIds)frequency.set(id,(frequency.get(id)||0)+1);
   return {ready,boot:window.DEEN_BOOT.status(),overlays:
    [...document.querySelectorAll('[aria-modal="true"]')].map(el=>el.id),
    script_origin:scriptOrigin,
    question_inventory:{active_count:active.length,base_count:base.length,
     active_unique_ids:unique.size,active_duplicate_id_count:activeIds.length-unique.size,
     active_by_unit:byUnit,
     non_base_ids:[...unique].filter(id=>!baseSet.has(id)).slice(0,60),
     duplicate_ids:[...frequency.entries()].filter(([,count])=>count>1).slice(0,25),
     approved_live_u01_count:knownU01.size,uncovered_live_u01_count:uncovered.length,
     uncovered_live_u01:uncovered}};

  });
  report.qa_boot=qaBoot;
  // A pre-onboarding Turkish session may not satisfy the fully onboarded
  // release checks. Record the reason; QA nav probes are intentionally separate.
  if(!qaBoot.ready)report.qa_boot_limitation='Boot not ready in disposable guest state';
  const init=await page.evaluate(async()=>{
   const files=['german-ui.staging.json','german-ui.lesson-flow.staging.json',
    'german-ui.premium-shop.staging.json','german-ui.quran-controls.staging.json',
    ...Array.from({length:8},(_,i)=>'german-ui.reference-batch-'+String(i+1).padStart(2,'0')+'.staging.json'),
    'german-ui.real-lesson.staging.json'];
   const read=async path=>{
    const response=await fetch('/assets/i18n/'+path,{cache:'no-store'});
    if(!response.ok)throw Error('German staging QA pack fetch: '+path+': '+response.status);
    return response.json();
   };
   const [packs,english]=await Promise.all([
    Promise.all(files.map(read)),read('english-ui.draft.json')]);
   const mod=await import('/assets/i18n/german-ui.renderer.staging.mjs');
   window.__DEEN_GERMAN_NAV_QA__=mod.createGermanUIStagingRenderer({
    packs,englishReference:english.translations});
   return {locale:window.DEEN_APP_LOCALE.get(),
    german_available:window.DEEN_CONTENT_LOCALE.available('de'),
    navs:[...document.querySelectorAll('.bottomnav [data-screen]')].map(x=>x.dataset.screen)};
  });
  assert.equal(init.locale,'tr');
  assert.equal(init.german_available,false);
  assert.deepEqual(init.navs.slice(0,4),['learnScreen','reviewScreen','leagueScreen','profileScreen']);
  for(const id of init.navs.slice(0,4)){
   currentProbe=id;
   const button=page.locator('.bottomnav [data-screen="'+id+'"]').first();
   await page.evaluate(()=>{
    for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
    document.getElementById('deenPreparation')?.remove();
    document.getElementById('v998Onboarding')?.remove();
    document.querySelector('.phone').inert=false;
   });
   await button.click({timeout:20000});
   await page.waitForFunction(target=>document.querySelector('.screen.active')?.id===target,id,{timeout:5000}).catch(()=>{});
   await page.waitForTimeout(500);
   const state=await page.evaluate(target=>{
    const root=document.querySelector('.phone');
    const targetScreen=document.getElementById(target);
    const renderer=window.__DEEN_GERMAN_NAV_QA__;
    const originalArabic=[...document.querySelectorAll('[lang="ar"]')]
     .map(el=>el.textContent).join('|');
    const before={
     question:document.querySelector('#questionText')?.textContent,
     choices:document.querySelector('#answerArea')?.innerHTML,
     feedback:document.querySelector('#feedbackText')?.textContent};
    const audit=renderer.render(root,{qaMode:true,locale:'de',documentRef:document});
    const after={
     question:document.querySelector('#questionText')?.textContent,
     choices:document.querySelector('#answerArea')?.innerHTML,
     feedback:document.querySelector('#feedbackText')?.textContent};
    const arabicAfter=[...document.querySelectorAll('[lang="ar"]')]
     .map(el=>el.textContent).join('|');
    return {target,screen_active:targetScreen?.classList.contains('active')||false,
     screen_exists:!!targetScreen,selected_button:
      document.querySelector('.bottomnav .navbtn.active')?.dataset.screen||null,
     language:window.DEEN_APP_LOCALE.get(),german_available:window.DEEN_CONTENT_LOCALE.available('de'),
     energy_modal_exists:name==='showEnergy'?!!energy:undefined,
     energy_modal_classes:name==='showEnergy'?energy?.className:undefined,
     scanned:audit.scanned,writes:audit.writes,unresolved:audit.unresolved,
     graded_content_unchanged:JSON.stringify(before)===JSON.stringify(after),
     arabic_unchanged:originalArabic===arabicAfter,
     dynamic_elements:targetScreen?.querySelectorAll('[data-deen-quran],button,[role="button"]').length||0,
     visible_heading:targetScreen?.querySelector('h1,h2,.page-title')?.textContent?.trim()||null};
   },id);
   report.tabs.push(state);
   assert(state.screen_exists,'Target screen is missing: '+id);
   assert(state.screen_active,'Navigation did not activate target screen: '+id);
   assert.equal(state.selected_button,id,'Navigation did not select target tab: '+id);
   assert.equal(state.language,'tr','QA navigation must not activate German runtime');
   assert.equal(state.german_available,false);
   assert.equal(state.graded_content_unchanged,true);
   assert.equal(state.arabic_unchanged,true);
   assert.deepEqual(state.unresolved,[], 'Navigated '+id+' has untranslated Turkish-signal UI chrome');
   await page.screenshot({path:output+'/stateful-tab-'+id+'.png',fullPage:true});
  }
  // Open real, read-only application dialogs; capture lazy UI unavailable in the
  // initial shell. No purchases, answers, resets or other mutating controls are used.
  const dialogs=['storePanel','premiumPanel','settingsPanel','goalPanel',
   'streakPanel','xpPanel','showEnergy','editProfile','analyticsPanel','companion'];
  for(const name of dialogs){
   currentProbe='dialog:'+name;
   const modal=await page.evaluate(name=>{
    const dialog=document.getElementById('v5Sheet');
    if(dialog?.open)dialog.close();
    if(name==='companion')window.DEEN_COMPANION.open('profile');
    else{
     const fn=window[name];
     if(typeof fn!=='function')throw Error('Missing app panel: '+name);
     fn();
    }
    const root=document.querySelector('.phone'),sheet=document.getElementById('v5Sheet');
    const beforeArabic=[...document.querySelectorAll('[lang="ar"]')].map(e=>e.textContent).join('|');
    const before={
     question:document.querySelector('#questionText')?.textContent,
     choices:document.querySelector('#answerArea')?.innerHTML,
     feedback:document.querySelector('#feedbackText')?.textContent};
    const audit=window.__DEEN_GERMAN_NAV_QA__.render(root,{
     qaMode:true,locale:'de',documentRef:document});
    const afterArabic=[...document.querySelectorAll('[lang="ar"]')].map(e=>e.textContent).join('|');
    const after={
     question:document.querySelector('#questionText')?.textContent,
     choices:document.querySelector('#answerArea')?.innerHTML,
     feedback:document.querySelector('#feedbackText')?.textContent};
    const energy=document.getElementById('energyModal');
    const energyVisible=!!energy&&
      !energy.hidden&&window.getComputedStyle(energy).display!=='none'&&
      window.getComputedStyle(energy).visibility!=='hidden'&&
      energy.getClientRects().length>0;
    return {panel:name,is_open:!!sheet?.open||(name==='showEnergy'&&energyVisible),
     heading:document.getElementById('v5SheetTitle')?.textContent||null,
     scanned:audit.scanned,writes:audit.writes,unresolved:audit.unresolved,
     arabic_unchanged:beforeArabic===afterArabic,
     graded_content_unchanged:JSON.stringify(before)===JSON.stringify(after)};
   },name);
   report.modals.push(modal);
   assert.equal(modal.is_open,true,'App failed to open '+name);
   assert.equal(modal.arabic_unchanged,true,name+': original Arabic changed');
   assert.equal(modal.graded_content_unchanged,true,name+': source-dependent content changed');
   // Collect all modal gaps in one run; fail the combined report afterward.
   await page.screenshot({path:output+'/stateful-modal-'+name+'.png',fullPage:true});
  }
  const unresolved=report.modals.filter(m=>m.unresolved.length).map(m=>({panel:m.panel,strings:m.unresolved}));
  report.modal_unresolved=unresolved;
  assert.deepEqual(unresolved,[],'Turkish text remains across real app modals');
  // Full real engine smoke in a disposable TURKISH QA session; German staged
  // questions are inserted into only this page's current lesson session.
  // This is not production German activation and never changes the source bank.
  currentProbe='lesson';
  const qaLesson=await page.evaluate(async()=>{
   for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
   window.hideEnergy?.();
   // The separately implemented energyModal uses .show rather than a dialog.
   // Close the earlier QA-opened energy sheet before tapping the lesson card.
   document.getElementById('energyModal')?.classList.remove('show');
   document.getElementById('deenPreparation')?.remove();
   document.querySelector('.phone').inert=false;
   if(typeof state!=='undefined')state.energy=30;
   const response=await fetch('/qa-artifacts/german-browser/qa-question-packs.json',
    {cache:'no-store'});
   if(!response.ok)throw Error('No local QA-only German pack bundle '+response.status);
   const bundle=await response.json();
   if(bundle.staging_only!==true||bundle.release_approved!==false)
    throw Error('German QA pack guard missing');
   const {createGermanQuestionStagingAdapter}=await import(
    '/assets/i18n/german-question.adapter.staging.mjs');
   const adapter=createGermanQuestionStagingAdapter({packs:bundle.packs});
   window.__DEEN_QA_STAGE_ADAPTER__=adapter;
   if(window.DEEN_CONTENT_LOCALE.available('de'))throw Error('German was activated outside review');
   startStage('U01-S01');
   if(!session?.questions?.length)return {opened:false,reason:'Stage did not create questions'};
   const source=session.questions.map(q=>q);
   const german=source.map(q=>adapter.translate(q,{qaMode:true,
    locale:'de',scope:'live_runtime_staging'}));
   const unresolved=source.filter((q,i)=>!german[i]).map(q=>q.id);
   if(unresolved.length)return {opened:true,unresolved};
   const candidate=german.find(q=>Array.isArray(q.options_tr)&&
    q.options_tr.length>=2&&q.correct_answer&&
    ['card_choice','multiple_choice','scenario','error_spotting'].includes(q.activity_type));
   if(!candidate)return {opened:true,unresolved:[],no_choice_example:true,
    question_types:german.map(q=>q.activity_type)};
   session.questions=[candidate,...german.filter(q=>q.id!==candidate.id)];
   session.index=0;
   renderQuestion();
   const choices=[...document.querySelectorAll('#answerArea .option-label')]
    .map(el=>el.textContent.trim());
   return {opened:document.querySelector('#lesson')?.classList.contains('active')||false,
    app_locale:window.DEEN_APP_LOCALE.get(),
    staged_question_id:candidate.id,question:candidate.question_tr,
    rendered_question:document.querySelector('#questionText')?.textContent.trim(),
    choices,expected_choices:candidate.options_tr,
    correct_answer:candidate.correct_answer,
    source_question_unchanged:candidate.__deenSourceQuestion===source.find(q=>q.id===candidate.id),
    source_bank_count:QUESTIONS.length,unresolved:[],
    sample_type:candidate.activity_type,qa_only:candidate.__deenQANotForRelease===true};
  });
  report.lesson=qaLesson;
  assert.equal(qaLesson.opened,true,'Actual stage did not start');
  assert.equal(qaLesson.app_locale,'tr','QA German overlay must not enable German release');
  assert.equal(qaLesson.qa_only,true);
  assert.equal(qaLesson.source_question_unchanged,true);
  assert.deepEqual(qaLesson.unresolved,[],'Actual U01 lesson pack signatures drifted');
  assert.equal(qaLesson.rendered_question,qaLesson.question,
   'German question did not render in actual lesson template');
  assert.equal(qaLesson.choices.length,qaLesson.expected_choices.length,
   'Real answer buttons differ from staged German source count');
  assert.deepEqual([...qaLesson.choices].sort(),[...qaLesson.expected_choices].sort(),
   'German answer button text does not match source-verified staging choices');
  await page.screenshot({path:output+'/stateful-german-lesson-qa.png',fullPage:true});
  // Follow the actual U01 teaching-card lifecycle before answering.
  const teachingCTA=page.locator('#lesson .v910-card-button:visible');
  if(await teachingCTA.count()){
   await teachingCTA.first().click({timeout:20000});
   await page.waitForTimeout(400);
  }
  const afterTeaching=await page.evaluate(()=>{
   const text=document.querySelector('#questionText');
   const raw=text?.textContent?.trim();
   const localized=window.__DEEN_QA_STAGE_ADAPTER__.adaptQuestionPrompt(
    raw,session.questions[0],{qaMode:true,locale:'de'});
   if(localized!==null&&localized!==raw)text.textContent=localized;
   return {raw_question:raw,question:text?.textContent?.trim(),
    teaching_cta_visible:[...document.querySelectorAll('#lesson .v910-card-button')]
     .some(el=>el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden'),
    options:[...document.querySelectorAll('#answerArea .option-label')]
     .map(el=>el.textContent?.trim())};
  });
  report.lesson.after_teaching=afterTeaching;
  assert(['Überlege mit: '+qaLesson.question,qaLesson.question].includes(afterTeaching.question),
   'Unexpected source-dependent wrapper around German question');
  const rightButton=page.locator('#answerArea .option').filter({
    has:page.locator('.option-label', {hasText:qaLesson.correct_answer})});
  // The same real DOM grading controls are exercised; no direct grade mutation.
  assert.equal(await rightButton.count(),1,'The correct German answer must be selectable once');
  await rightButton.click({timeout:20000,force:true});
  // The shipped card-choice UI may grade immediately and hide its legacy confirm
  // button (v852-hidden-confirm). Never try to click a hidden/disabled control.
  const feedback=page.locator('#feedback');
  if(!(await feedback.evaluate(el=>el.classList.contains('show')))){
   const confirm=page.locator('#answerArea .template-action:visible:not([disabled])');
   if(await confirm.count())await confirm.first().click({timeout:10000});
  }
  await page.waitForTimeout(850);
  const graded=await page.evaluate(()=>({
   feedback_shown:document.getElementById('feedback')?.classList.contains('show'),
   feedback_class:document.getElementById('feedback')?.className,
   score:session?.correct,
   index:session?.index,
   selected:[...document.querySelectorAll('#answerArea .option.selected')]
     .map(el=>el.textContent?.trim()),
   visible_actions:[...document.querySelectorAll('#lesson button')].filter(el=>
     !el.hidden&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden')
     .slice(-15).map(el=>({text:el.textContent?.trim().slice(0,60),class:el.className,disabled:el.disabled})),
   current_source_id:session?.questions?.[0]?.__deenSourceQuestion?.id,
   correct_answer:session?.questions?.[0]?.correct_answer,
   grading_result:document.getElementById('feedbackTitle')?.textContent.trim()
  }));
  report.lesson.grading=graded;
  assert.equal(graded.score,1,'Real quiz engine did not award correct German response');
  await page.screenshot({path:output+'/stateful-german-lesson-graded-qa.png',fullPage:true});
  return init;
 }finally{await page.close()}
}
try{
 report.gate=await verifyGermanGate();
 report.init=await auditNavTabs();
 assert.equal(report.tabs.length,4);
 assert.equal(report.modals.length,10);
 assert.deepEqual(report.errors,[],'Browser errors during German staging navigation');
 report.status='passed';
 console.log(JSON.stringify(report,null,2));
}catch(error){
 report.status='failed';report.error=String(error?.stack||error);
 console.error(JSON.stringify(report,null,2));
 process.exitCode=1;
}finally{
 writeFileSync(output+'/stateful-report.json',JSON.stringify(report,null,2)+'\n');
 await browser.close();
}
