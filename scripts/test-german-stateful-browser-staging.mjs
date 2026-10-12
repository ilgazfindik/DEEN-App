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
 staging_only:true,release_enabled:false,gate:null,tabs:[],modals:[],errors:[]};
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
    return {panel:name,is_open:!!sheet?.open,
     heading:document.getElementById('v5SheetTitle')?.textContent||null,
     scanned:audit.scanned,writes:audit.writes,unresolved:audit.unresolved,
     arabic_unchanged:beforeArabic===afterArabic,
     graded_content_unchanged:JSON.stringify(before)===JSON.stringify(after)};
   },name);
   report.modals.push(modal);
   assert.equal(modal.is_open,true,'App failed to open '+name);
   assert.equal(modal.arabic_unchanged,true,name+': original Arabic changed');
   assert.equal(modal.graded_content_unchanged,true,name+': source-dependent content changed');
   assert.deepEqual(modal.unresolved,[],name+': untranslated modal chrome');
   await page.screenshot({path:output+'/stateful-modal-'+name+'.png',fullPage:true});
  }
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
