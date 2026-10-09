/* DEEN startup state machine. No progress/state reset and no fabricated auth. */
(()=>{
 const build='9389onboardingarabic1';
 const boot={phase:'onboarding',ready:false,progress:0,taskCount:0,error:null};
 const ar=()=>window.DEEN_APP_LOCALE?.get?.()==='ar';
 const text=(tr,arabic)=>ar()?arabic:tr;
 let overlay=null,ongoing=null,completion=null;
 function render(){
  if(!overlay){overlay=document.createElement('section');overlay.id='deenPreparation';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.innerHTML='<div><b class="deen-prep-brand">DEEN</b><h1></h1><p class="deen-prep-status" role="status"></p><progress max="100" value="0"></progress><strong class="deen-prep-percent"></strong><button type="button" hidden></button></div>';document.body.append(overlay);overlay.querySelector('button').onclick=()=>prepare()}
  overlay.dir=ar()?'rtl':'ltr';overlay.querySelector('h1').textContent=text('DEEN hazırlanıyor','جارٍ تجهيز DEEN');
  overlay.querySelector('progress').value=boot.progress;
  overlay.querySelector('.deen-prep-percent').textContent=boot.progress+'%';
  overlay.querySelector('p').textContent=boot.error?text('Hazırlık tamamlanamadı: ','تعذّر إكمال التجهيز: ')+boot.error:text('Dil ve ders verileri doğrulanıyor…','جارٍ التحقق من اللغة وبيانات الدروس…');
  overlay.querySelector('button').hidden=!boot.error;overlay.querySelector('button').textContent=text('Yeniden dene','حاول مجددًا');
 }
 function progress(done,total){boot.taskCount=total;boot.progress=Math.min(95,Math.floor(done/total*90));render()}
 async function prepare(){
  if(ongoing)return ongoing;
  boot.phase='preparing';boot.ready=false;boot.error=null;boot.progress=0;render();
  ongoing=(async()=>{
   try{
    if(ar()){
     const bank=window.DEEN_ARABIC_PILOT;if(!bank)throw Error('AR_RUNTIME_MISSING');
     if(!await bank.preload())throw Error(bank.failure||'AR_LOAD_FAILED');
     const baseReport=bank.inspectBank(window.DEEN_BASE_QUESTIONS||[]);if(baseReport.sourceCount!==1500||baseReport.failedIds.length)throw Error('AR_BASE_SOURCE_MISMATCH: '+baseReport.failedIds.join(', '));
     const report=bank.inspectBank(QUESTIONS);
     if(report.failedIds.length)throw Error('AR_SOURCE_MISMATCH: '+report.failedIds.join(', '));
    }else{progress(1,2)}
    if(window.DEEN_APP_LOCALE.get()!==document.documentElement.lang)throw Error('LOCALE_MISMATCH');
    window.DEEN_ARABIC_PILOT?.localizeChrome?.(document.body);
    boot.progress=100;boot.ready=true;boot.phase='ready';render();
    document.documentElement.dataset.deenStartup='ready';
    document.title='DEEN v9.12.69';window.DEEN_BUILD_ID=build;window.DEEN_RELEASE_VERSION='9.12.69';
    const cb=completion;completion=null;if(cb)cb();
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    overlay?.remove();overlay=null;
    return true;
   }catch(e){boot.error=String(e?.message||e);boot.phase='error';render();return false}
   finally{ongoing=null}
  })();return ongoing;
 }
 function start(){
  const selected=window.__DEEN_BOOT_SELECTED_LANGUAGE__||localStorage.getItem('deen_app_language_v1')||'tr';
  DEEN_APP_LOCALE.apply(selected);
  state.settings.onboardingLanguageConfirmed=true;
  saveState();document.documentElement.dataset.deenStartup='onboarding';
  if(state.onboarded)prepare();
 }
 function finishOnboarding(cb){completion=cb;return prepare()}
 function changeLanguage(next){
  try{if(typeof session==='object'&&session&&document.getElementById('lesson')?.classList.contains('active'))closeLesson()}catch(_){}
  const previous=DEEN_APP_LOCALE.get();DEEN_APP_LOCALE.apply(next);localStorage.setItem('deen_app_language_v1',next);saveState();
  document.dispatchEvent(new CustomEvent('deen:language-changed',{detail:{language:next,previous}}));
  DEEN_APP_LOCALE.renderSettings();return prepare();
 }
 window.DEEN_BOOT={start,prepare,finishOnboarding,changeLanguage,progress,isReady:()=>boot.ready,status:()=>({...boot}),build};
})();
