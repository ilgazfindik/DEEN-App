/* Startup and language changes validate resources before admitting the learner. */
(()=>{
 const build=window.__DEEN_DEPLOY_ID__||'9397globalentrydraft1';
 const boot={phase:'onboarding',ready:false,progress:0,taskCount:0,error:null};
 const locale=()=>window.DEEN_APP_LOCALE.get();
 const T=key=>window.DEEN_I18N.t(key);
 let overlay=null,ongoing=null,completion=null,changing=false;
 function removeOverlay(){const onboarding=document.getElementById('v998Onboarding');if(onboarding)onboarding.inert=false;overlay?.remove();overlay=null;const phone=document.querySelector('.phone');if(phone)phone.inert=!!document.getElementById('v998Onboarding');}
 function chooseLanguage(){
  window.DEEN_I18N.showGate(async next=>{
   const accepted=await changeLanguage(next,{recover:true});
   if(!accepted){render();return;}
   if(!state.onboarded)await prepare();
  });
 }
 function render(){
  if(!overlay){
   overlay=document.createElement('section');overlay.id='deenPreparation';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
   overlay.innerHTML='<div><b class="deen-prep-brand">DEEN</b><h1></h1><p class="deen-prep-status" role="status"></p><progress max="100" value="0"></progress><strong class="deen-prep-percent"></strong><div class="deen-prep-actions"><button type="button" data-retry hidden></button><button type="button" data-language hidden></button></div></div>';
   document.body.append(overlay);overlay.querySelector('[data-retry]').onclick=()=>prepare();overlay.querySelector('[data-language]').onclick=chooseLanguage;
  }
  const onboarding=document.getElementById('v998Onboarding');if(onboarding)onboarding.inert=true;
  const blocked=boot.phase==='blocked';overlay.lang=locale();overlay.dir=locale()==='ar'?'rtl':'ltr';
  overlay.querySelector('h1').textContent=T(blocked?'unavailableTitle':'preparing');
  overlay.querySelector('p').textContent=T(blocked?'unavailableSub':boot.error?'prepareError':'verifying');
  overlay.querySelector('progress').value=boot.progress;overlay.querySelector('progress').hidden=blocked;
  overlay.querySelector('.deen-prep-percent').textContent=boot.progress+'%';overlay.querySelector('.deen-prep-percent').hidden=blocked;
  const retry=overlay.querySelector('[data-retry]');retry.hidden=!boot.error||blocked;retry.textContent=T('retry');
  const language=overlay.querySelector('[data-language]');language.hidden=!boot.error;language.textContent=T('changeLanguage');
  const phone=document.querySelector('.phone');if(phone)phone.inert=true;
 }
 function progress(done,total){if(boot.phase!=='preparing')return;boot.taskCount=total;boot.progress=Math.min(95,Math.floor(done/total*90));render();}
 async function verify(lang){
  if(!window.DEEN_CONTENT_LOCALE?.available(lang))throw Error('CONTENT_PACK_MISSING:'+lang);
  if(!await window.DEEN_CONTENT_LOCALE.preload(lang))throw Error('CONTENT_LOAD_FAILED:'+lang);
  const base=window.DEEN_CONTENT_LOCALE.inspectBank(window.DEEN_BASE_QUESTIONS||[],lang);
  const active=window.DEEN_CONTENT_LOCALE.inspectBank(QUESTIONS,lang);
  if(base.sourceCount!==1500||base.failedIds.length||active.sourceCount!==1484||active.failedIds.length)throw Error('CONTENT_SOURCE_MISMATCH:'+lang);
 }
 function unavailable(){boot.phase='blocked';boot.ready=false;boot.error='CONTENT_PACK_MISSING:'+locale();document.documentElement.dataset.deenStartup='blocked';render();return false;}
 async function prepare(){
  if(ongoing)return ongoing;
  if(!window.DEEN_CONTENT_LOCALE?.available(locale()))return unavailable();
  boot.phase='preparing';boot.ready=false;boot.error=null;boot.progress=0;render();
  ongoing=(async()=>{
   try{
    await verify(locale());
    if(locale()!==document.documentElement.lang)throw Error('LOCALE_MISMATCH');
    window.DEEN_ARABIC_UI?.localize?.(document.body);window.DEEN_ARABIC_PILOT?.localizeChrome?.(document.body);
    boot.progress=100;boot.ready=true;boot.phase='ready';render();document.documentElement.dataset.deenStartup='ready';
    document.title='DEEN v9.12.77';window.DEEN_BUILD_ID=build;window.DEEN_RELEASE_VERSION='9.12.77';
    const cb=completion;completion=null;if(cb)cb();
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    removeOverlay();return true;
   }catch(e){boot.error=String(e?.message||e);boot.phase='error';document.documentElement.dataset.deenStartup='error';console.error('[DEEN preparation]',boot.error);render();return false;}
   finally{ongoing=null;}
  })();return ongoing;
 }
 function start(){
  DEEN_APP_LOCALE.hydrate();state.settings.onboardingLanguageConfirmed=window.DEEN_I18N.hasPreference();DEEN_APP_LOCALE.persist();
  document.documentElement.dataset.deenStartup='onboarding';if(state.onboarded)prepare();
 }
 function finishOnboarding(cb){completion=cb;return prepare();}
 async function changeLanguage(next,{recover=false}={}){
  next=DEEN_APP_LOCALE.normalize(next);if(!next||changing)return false;
  if(document.getElementById('lesson')?.classList.contains('active')){try{toast(T('activeLesson'));}catch(_){}DEEN_APP_LOCALE.renderSettings();return false;}
  if(state.onboarded&&!window.DEEN_CONTENT_LOCALE.available(next)){
   try{sheet(T('unavailableTitle'),'<p>'+T('unavailableSub')+'</p>');}catch(_){}
   DEEN_APP_LOCALE.renderSettings();return false;
  }
  changing=true;
  try{
   if(state.onboarded)await verify(next);
   DEEN_APP_LOCALE.commit(next);window.__DEEN_BOOT_SELECTED_LANGUAGE__=next;
   state.settings.onboardingLanguageConfirmed=true;saveState();
   window.DEEN_ARABIC_UI?.localize?.(document.body);
   if(state.onboarded){try{updateUI();}catch(_){}if(recover)await prepare();}
   else if(!recover){const step=Number(document.getElementById('v998Onboarding')?.dataset.step||0);window.DEEN_PREMIUM_ONBOARDING?.render?.(step);}
   return true;
  }catch(e){console.error('[DEEN language]',String(e?.message||e));try{toast(T('languageFailed'));}catch(_){}return false;}
  finally{changing=false;DEEN_APP_LOCALE.renderSettings();}
 }
 window.DEEN_BOOT={start,prepare,finishOnboarding,changeLanguage,unavailable,progress,isReady:()=>boot.ready,status:()=>({...boot}),build};
})();
