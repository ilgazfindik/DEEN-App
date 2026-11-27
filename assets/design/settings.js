/* Settings sheet in the app's indigo and gold: the groups the engine and the other layers build (notifications,
   celebrations, narration, accessibility, goal and Premium, data, policy) become grouped cards in a clear order,
   check boxes become switches, the backup import is a normal row, and the policy notes fold into an "About" card.
   Nothing is moved in the DOM: the order is set with CSS (flex order), so every layer keeps its own markup. */
(()=>{
 'use strict';
 if(window.DEEN_DS_SETTINGS)return;
 const ORDER={notify:1,learn:2,profile:3,celebrate:4,narration:5,other:6,access:7,data:8,about:9,note:10};
 const ABOUT={tr:'Hakkında ve ilkeler',en:'About and principles',de:'Über uns und Grundsätze',fr:'À propos et principes',ar:'حول التطبيق والمبادئ'};
 const PREM={tr:{free:'Ücretsiz',on:'Etkin',go:'Keşfet →'},en:{free:'Free',on:'Active',go:'Explore →'},de:{free:'Kostenlos',on:'Aktiv',go:'Entdecken →'},fr:{free:'Gratuit',on:'Actif',go:'Découvrir →'},ar:{free:'مجاني',on:'مفعّل',go:'اكتشف ←'}};
 const lang=()=>{let l='tr';try{l=window.DEEN_APP_LOCALE?.get?.()||localStorage.getItem('deen_app_language_v1')||'tr'}catch(_){}return ABOUT[l]?l:'tr'};
 function kind(g){
  if(g.classList.contains('ds-ntf-settings'))return 'notify';
  if(g.classList.contains('v950-settings-profile'))return 'profile';
  if(g.classList.contains('ds-celebrate-settings'))return 'celebrate';
  if(g.classList.contains('v960-narration-settings'))return 'narration';
  if(g.querySelector('[onclick*="goalPanel"],[onclick*="premiumPanel"]'))return 'learn';
  if(g.querySelector('[onclick*="exportProgress"],[onclick*="importProgress"],[onclick*="resetPreview"]'))return 'data';
  if(g.querySelector('.v690-policy-card'))return 'about';
  if(g.querySelector('[onchange*="state.settings.animation"],[onchange*="state.settings.haptic"],[onchange*="state.settings.reducedMotion"]'))return 'access';
  return 'other';
 }
 function decorate(){
  const sheet=document.getElementById('v5Sheet'),body=document.getElementById('v5SheetBody');if(!sheet||!body)return;
  const groups=[...body.querySelectorAll(':scope>.v690-setting-group')];
  // The settings sheet is the one made of setting groups with the accessibility switches or the data rows.
  const isSettings=groups.length>=3&&groups.some(g=>/access|data/.test(kind(g)));
  sheet.classList.toggle('ds-settings',isSettings);if(!isSettings)return;
  for(const g of groups){
   const k=kind(g);if(g.dataset.dsSec!==k){g.dataset.dsSec=k;g.style.order=String(ORDER[k]||6)}
   if(k==='about'){
    const head=g.querySelector(':scope>small');
    if(head&&!head.dataset.dsAbout){head.dataset.dsAbout='1';head.setAttribute('role','button');head.tabIndex=0;head.setAttribute('aria-expanded','false')}
    if(head&&head.dataset.dsLang!==lang()){head.dataset.dsLang=lang();head.textContent=ABOUT[lang()]}
   }
  }
  for(const n of body.querySelectorAll(':scope>.v690-state-note'))n.style.order=String(ORDER.note);
  // The Premium row says plainly whether Premium is on, in the learner's language.
  const prem=body.querySelector('[onclick*="premiumPanel"]');
  if(prem){let on=false;try{on=!!(state.premium||window.DEEN_PREMIUM_ENTITLEMENT?.active)}catch(_){}
   const P=PREM[lang()],label='Premium · '+(on?P.on:P.free),end=on?'✓':P.go;
   const sp=prem.querySelector('span'),b=prem.querySelector('b');
   if(sp&&sp.textContent!==label)sp.textContent=label;if(b&&b.textContent!==end)b.textContent=end}
  // The backup import: the label is the row, the file input covers it invisibly.
  for(const lab of body.querySelectorAll('.v5-import'))lab.classList.add('ds-set-import');
 }
 let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;try{decorate()}catch(_){}})};
 document.addEventListener('deen:settings-rendered',()=>{schedule();setTimeout(schedule,60);setTimeout(schedule,400)});
 document.addEventListener('click',e=>{
  const h=e.target.closest&&e.target.closest('#v5Sheet.ds-settings [data-ds-sec="about"]>small');if(!h)return;
  const g=h.parentElement,open=!g.classList.contains('ds-open');g.classList.toggle('ds-open',open);h.setAttribute('aria-expanded',String(open));
 });
 document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('#v5Sheet.ds-settings [data-ds-sec="about"]>small')){e.preventDefault();e.target.click()}});
 function install(){
  const sheet=document.getElementById('v5Sheet');
  if(sheet)new MutationObserver(schedule).observe(sheet,{childList:true,subtree:true});else setTimeout(install,300);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 window.DEEN_DS_SETTINGS=Object.freeze({version:'ds-settings-1',refresh:schedule});
})();
