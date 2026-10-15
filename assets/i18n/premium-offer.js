/* DEEN premium offer: local 72h product preview. No payments or recurring billing. */
(()=>{
 'use strict';
 if(window.DEEN_PREMIUM_OFFER)return;
 const TRIAL_KEY='deen_premium_trial_v1',SEEN_KEY='deen_premium_offer_seen_v1',TRIAL_MS=72*60*60*1000;
 const translations={
  tr:{
   eyebrow:'DEEN PREMIUM',titleLead:'Öğrenme yolculuğunu',titleAccent:'güçlendir',
   trial:'İlk 3 gün ücretsiz',used:'Ücretsiz denemen kullanıldı',
   description:'Daha rahat öğren, dilediğin kadar tekrar et ve gelişimini takip et.',
   features:[['∞','Sınırsız öğrenme enerjisi'],['▤','Detaylı tekrar geçmişi'],['▥','Öğrenme ilerleme analizleri']],
   futureTitle:'Yakında DEEN Premium’da',future:['Özel rozetler','Zenginleştirilmiş Kur’an deneyimi'],
   start:'3 Gün Ücretsiz Başlat',unavailable:'Abonelik yakında',later:'Şimdilik Devam Et',
   closeLabel:'Premium ekranını kapat',
   support:'Premium ile DEEN’in gelişmesine ve daha fazla kişiye ulaşmasına destek olursun.',
   disclosure:'Ücretsiz deneme yalnızca bu cihazda geçerlidir. Otomatik ödeme veya abonelik başlamaz.',
   expired:'Denemen sona erdi. Ücretli abonelik henüz kullanılamıyor.'
  },
  en:{
   eyebrow:'DEEN PREMIUM',titleLead:'Elevate your',titleAccent:'learning journey',
   trial:'Your first 3 days are free',used:'Free trial already used',
   description:'Learn with more freedom, revisit what matters and track your progress.',
   features:[['∞','Unlimited learning energy'],['▤','Detailed review history'],['▥','Learning progress insights']],
   futureTitle:'Coming to DEEN Premium',future:['Exclusive badges','Enhanced Quran learning'],
   start:'Start 3 Free Days',unavailable:'Subscriptions coming soon',later:'Continue for now',
   closeLabel:'Close premium offer',
   support:'Premium helps DEEN grow and reach more learners.',
   disclosure:'The free trial works on this device only. No subscription or automatic payment starts.',
   expired:'Your trial has ended. Paid subscriptions are not available yet.'
  },
  ar:{
   eyebrow:'DEEN PREMIUM',titleLead:'ارتقِ برحلتك',titleAccent:'التعليمية',
   trial:'أول ٣ أيام مجانًا',used:'تم استخدام التجربة المجانية',
   description:'تعلّم بمرونة أكبر، وراجع ما تعلّمته، وتابع تقدّمك.',
   features:[['∞','طاقة تعلم غير محدودة'],['▤','سجل مراجعة مفصّل'],['▥','تحليلات التقدّم في التعلم']],
   futureTitle:'قريبًا في DEEN Premium',future:['شارات حصرية','تجربة مطوّرة لتعلّم القرآن'],
   start:'ابدأ ٣ أيام مجانًا',unavailable:'الاشتراك قريبًا',later:'المتابعة الآن',
   closeLabel:'إغلاق عرض Premium',
   support:'يساعد Premium في تطوير DEEN والوصول إلى مزيد من المتعلمين.',
   disclosure:'التجربة المجانية متاحة على هذا الجهاز فقط، ولن يبدأ اشتراك أو دفع تلقائي.',
   expired:'انتهت تجربتك. الاشتراك المدفوع غير متاح بعد.'
  },
  de:{
   eyebrow:'DEEN PREMIUM',titleLead:'Entfalte dein',titleAccent:'Lernpotenzial',
   trial:'Die ersten 3 Tage kostenlos',used:'Gratis-Testphase bereits genutzt',
   description:'Lerne flexibler, wiederhole Inhalte und behalte deinen Fortschritt im Blick.',
   features:[['∞','Unbegrenzte Lernenergie'],['▤','Detaillierter Wiederholungsverlauf'],['▥','Einblicke in deinen Lernfortschritt']],
   futureTitle:'Demnächst bei DEEN Premium',future:['Exklusive Abzeichen','Erweitertes Koran-Lernen'],
   start:'3 Gratistage starten',unavailable:'Abo bald verfügbar',later:'Vorerst fortfahren',
   closeLabel:'Premium-Angebot schließen',
   support:'Mit Premium unterstützt du die Entwicklung von DEEN für mehr Lernende.',
   disclosure:'Die Gratis-Testphase gilt nur auf diesem Gerät. Kein Abo und keine automatische Zahlung.',
   expired:'Deine Testphase ist abgelaufen. Bezahl-Abos sind noch nicht verfügbar.'
  },
  fr:{
   eyebrow:'DEEN PREMIUM',titleLead:'Enrichis ton',titleAccent:'apprentissage',
   trial:'Les 3 premiers jours gratuits',used:'Essai gratuit déjà utilisé',
   description:'Apprends plus librement, révise à ton rythme et suis tes progrès.',
   features:[['∞','Énergie d’apprentissage illimitée'],['▤','Historique détaillé des révisions'],['▥','Analyses de progression']],
   futureTitle:'Bientôt dans DEEN Premium',future:['Badges exclusifs','Apprentissage du Coran enrichi'],
   start:'Activer 3 jours gratuits',unavailable:'Abonnement bientôt disponible',later:'Continuer pour le moment',
   closeLabel:'Fermer l’offre Premium',
   support:'Premium soutient le développement de DEEN pour aider davantage de personnes.',
   disclosure:'L’essai gratuit est valable sur cet appareil uniquement. Aucun abonnement ni prélèvement automatique.',
   expired:'Ton essai est terminé. Aucun abonnement payant n’est encore disponible.'
  }
 };
 const lang=()=>window.DEEN_APP_LOCALE?.get?.()||document.documentElement.lang||'tr';
 const T=()=>translations[lang()]||translations.tr;
 const appState=()=>{try{return typeof state==='object'?state:window.state||null}catch(_){return window.state||null}};
 const get=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch(_){return null}};
 const put=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val));return true}catch(_){return false}};
 const record=()=>{const r=get(TRIAL_KEY);return r&&typeof r==='object'&&r.used===true&&Number.isFinite(r.startedAt)&&r.startedAt>0?r:null};
 const active=()=>{const r=record();return !!r&&Date.now()>=r.startedAt&&Date.now()-r.startedAt<TRIAL_MS};
 const externalActive=()=>{const e=window.DEEN_PREMIUM_ENTITLEMENT;return !!e&&e!==localEntitlement&&e.active===true};
 // The production guard requires an entitlement. This object represents ONLY a local demo,
 // not verified App Store/Google Play billing or a server-side receipt.
 const localEntitlement={source:'local-device-trial-preview',get active(){return active()}};
 if(!window.DEEN_PREMIUM_ENTITLEMENT)window.DEEN_PREMIUM_ENTITLEMENT=localEntitlement;
 let locallyEnabled=false;
 function sync(){
  const s=appState();if(!s)return false;
  const on=active();
  if(on){if(s.premium!==true){s.premium=true;locallyEnabled=true;try{saveState?.()}catch(_){}try{updateUI?.()}catch(_){}}}
  else if(record()&&!externalActive()&&s.premium===true){s.premium=false;locallyEnabled=false;try{saveState?.()}catch(_){}try{updateUI?.()}catch(_){}}
  return on;
 }
 function eligible(){const s=appState();return !!s?.onboarded&&document.documentElement.dataset.deenStartup==='ready'&&window.DEEN_BOOT?.isReady?.()===true&&!active()&&!externalActive()&&!s.premium&&!document.querySelector('#deenLanguageGate,#deenAccountGate,#v998Onboarding,#deenPreparation');}
 function seen(){const r=get(SEEN_KEY);return r&&typeof r==='object'?r:{}}
 let dialog=null,pending=null,pendingIsRepeatable=false,closeTimer=null,restoreFocus=null;
 let celebrationObserver=null;
 function observeCelebration(){
  if(celebrationObserver||!window.MutationObserver)return;
  const phone=document.getElementById('phone');
  if(!phone)return;
  // Only the celebration lifecycle class is watched: no expensive subtree scan.
  celebrationObserver=new MutationObserver(()=>{
   if(!pending){celebrationObserver.disconnect();celebrationObserver=null;return}
   setTimeout(attempt,120);
  });
  celebrationObserver.observe(phone,{attributes:true,attributeFilter:['class']});
 }
 function stopObservingCelebration(){
  celebrationObserver?.disconnect();celebrationObserver=null;
 }
 function mount(){
  if(dialog?.isConnected)return dialog;
  dialog=document.createElement('dialog');dialog.id='deenPremiumOffer';dialog.setAttribute('aria-labelledby','deenPremiumTitle');
  dialog.innerHTML=
   '<div class="dp-shell">'+
    '<div class="dp-arch" aria-hidden="true"><span>✦</span></div>'+
    '<button class="dp-close" type="button" data-dp-action="close" aria-label="Close">×</button>'+
    '<div class="dp-brand"><span class="dp-brand-rule" aria-hidden="true"></span><span data-dp="eyebrow"></span><span class="dp-brand-rule" aria-hidden="true"></span></div>'+
    '<h2 id="deenPremiumTitle" class="dp-title"><span data-dp="titleLead"></span><span class="dp-title-accent" data-dp="titleAccent"></span></h2>'+
    '<p class="dp-trial" data-dp="trial"></p>'+
    '<p class="dp-desc" data-dp="description"></p>'+
    '<ul class="dp-features"></ul>'+
    '<div class="dp-future"><span class="dp-future-label" data-dp="futureTitle"></span><div class="dp-future-items"></div></div>'+
    '<div class="dp-actions"><button type="button" class="dp-start" data-dp-action="start"><span class="dp-start-spark" aria-hidden="true">✦</span><span data-dp="start"></span><span class="dp-action-arrow" aria-hidden="true">→</span></button>'+
    '<button type="button" class="dp-later" data-dp-action="later"><span data-dp="later"></span></button></div>'+
    '<div class="dp-divider" aria-hidden="true"><span></span></div>'+
    '<p class="dp-support" data-dp="support"></p>'+
    '<p class="dp-disclosure" data-dp="disclosure"></p>'+
    '<div class="dp-skyline" aria-hidden="true"></div>'+
   '</div>';
  dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
  dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
  dialog.querySelector('[data-dp-action="later"]').onclick=close;
  dialog.querySelector('[data-dp-action="close"]').onclick=close;
  dialog.querySelector('[data-dp-action="start"]').onclick=()=>{
   if(record()){dialog.querySelector('[data-dp="disclosure"]').textContent=T().expired;return;}
   const now=Date.now();if(!put(TRIAL_KEY,{used:true,startedAt:now})){dialog.querySelector('[data-dp="disclosure"]').textContent=T().disclosure;return;}
   sync();close();
  };
  document.body.appendChild(dialog);return dialog;
 }
 function render(){
  const d=mount(),t=T(),used=!!record();
  d.lang=lang();d.dir=lang()==='ar'?'rtl':'ltr';
  for(const [key,value] of Object.entries(t)){
   if(typeof value!=='string')continue;
   const target=d.querySelector('[data-dp="'+key+'"]');
   if(target)target.textContent=value;
  }
  d.querySelector('.dp-close').setAttribute('aria-label',t.closeLabel);
  d.querySelector('[data-dp="trial"]').textContent=used?t.used:t.trial;
  const list=d.querySelector('.dp-features');list.replaceChildren();
  for(const [icon,text] of t.features){
   const li=document.createElement('li');
   const mark=document.createElement('span');mark.className='dp-feature-icon';mark.textContent=icon;mark.setAttribute('aria-hidden','true');
   const label=document.createElement('span');label.className='dp-feature-text';label.textContent=text;
   const tick=document.createElement('span');tick.className='dp-feature-check';tick.textContent='✓';tick.setAttribute('aria-hidden','true');
   li.append(mark,label,tick);list.appendChild(li);
  }
  const future=d.querySelector('.dp-future-items');future.replaceChildren();
  for(const text of t.future){
   const chip=document.createElement('span');chip.className='dp-future-chip';chip.textContent=text;future.appendChild(chip);
  }
  const cta=d.querySelector('[data-dp-action="start"]');
  cta.querySelector('[data-dp="start"]').textContent=used?t.unavailable:t.start;
  cta.disabled=used;
  // Keep labels visible even when global DEEN button rules apply (iOS included).
  d.querySelector('[data-dp="later"]').textContent=t.later;
  d.querySelector('[data-dp="disclosure"]').textContent=used?t.expired:t.disclosure;
  return d;
 }
 function open(){
  sync();if(!eligible())return false;
  const d=render();if(d.open)return true;
  restoreFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
  clearTimeout(closeTimer);d.showModal();
  requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.add('dp-visible')));
  return true;
 }
 function close(){
  if(!dialog?.open)return;
  dialog.classList.remove('dp-visible');clearTimeout(closeTimer);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  closeTimer=setTimeout(()=>{if(dialog?.open&&!dialog.classList.contains('dp-visible'))dialog.close();if(restoreFocus?.isConnected)restoreFocus.focus({preventScroll:true});restoreFocus=null},reduced?0:300);
 }
 // Completion offers are a one-time milestone. Exit offers are transient: every
 // actual lesson session may offer again without growing localStorage indefinitely.
 function enqueue(key,{repeatable=false}={}){
  sync();if(!eligible()||pending||(!repeatable&&seen()[key]))return false;
  pending=key;pendingIsRepeatable=repeatable;observeCelebration();return true;
 }
 function attempt(){
  if(!pending||!eligible()||document.querySelector('#lesson.active,#phone.gf-celebrating,dialog[open],#v5Sheet[open]'))return false;
  const key=pending,repeatable=pendingIsRepeatable;
  if(!repeatable&&seen()[key]){pending=null;pendingIsRepeatable=false;stopObservingCelebration();return false}
  if(!open())return false;
  pending=null;pendingIsRepeatable=false;stopObservingCelebration();
  if(!repeatable)put(SEEN_KEY,{...seen(),[key]:Date.now()});
  return true;
 }
 let lessonBefore=null,finalBefore=null;
 const completed=id=>!!appState()?.completed?.includes(id);
 const macroComplete=(id,ids,total)=>{
  const meta=appState()?.macroStageMeta?.[id];
  return !!meta&&Number(total)>0&&Number(meta.completedLessons)>=Number(total)&&ids.length>0&&ids.every(completed);
 };
 const unitCompleted=unit=>{
  const list=typeof STAGES!=='undefined'&&Array.isArray(STAGES)?STAGES.filter(x=>x.unit===unit):[];
  return list.length>=7&&list.every(x=>completed(x.id));
 };
 // The live learning map uses U01-M01..M05, not just the legacy U01-S07.
 // Capture progress *before* the final result is committed by the game engine.
 function contextFor(s){
  if(!s||s.review||s.final||s.final2||s.final3||s.stage?.id==='SMART')return null;
  const d=s.macroDef;
  if(s.macroStage&&/^U\d{2}-M\d{2}$/.test(d?.id||'')){
   const ids=Array.isArray(d.legacyIds)?d.legacyIds.slice():[];
   return {kind:'macro',id:d.id,unit:d.unit,ids,total:Number(d.lessons)||0,wasComplete:macroComplete(d.id,ids,d.lessons)};
  }
  const id=s.stage?.id||'';
  if(/^U\d{2}-S\d{2}$/.test(id))return {kind:'stage',id,unit:id.slice(0,3),wasComplete:completed(id)};
  return null;
 }
 function contextCompleted(ctx){
  return ctx.kind==='macro'?macroComplete(ctx.id,ctx.ids,ctx.total):completed(ctx.id);
 }
 document.addEventListener('deen:lesson-result-before',e=>{lessonBefore=contextFor(e.detail?.session)});
 document.addEventListener('deen:lesson-result',()=>{
  const ctx=lessonBefore;lessonBefore=null;
  if(!ctx||ctx.wasComplete||!contextCompleted(ctx))return;
  // A completed learning-map chapter should prompt once; failed mini lessons and
  // repeated lessons do not. Preserve independent unit-final milestones.
  const key=unitCompleted(ctx.unit)?'unit:'+ctx.unit:ctx.kind+':'+ctx.id;
  enqueue(key);
 });
 function sectionOf(s){return s?.final3?3:s?.final2?2:s?.final?1:0}
 const finalState=n=>appState()?.[n===1?'sectionFinal':n===2?'section2Final':'section3Final'];
 document.addEventListener('deen:section-result-before',e=>{const n=sectionOf(e.detail?.session);finalBefore=n?{n,wasComplete:!!finalState(n)?.completed}:null});
 document.addEventListener('deen:section-result',()=>{const ctx=finalBefore;finalBefore=null;if(ctx&&!ctx.wasComplete&&finalState(ctx.n)?.completed)enqueue('section:'+ctx.n)});
 document.addEventListener('click',e=>{
  if(!pending)return;
  // Closing a completed result, reward sheet, or subsequent screen should
  // release the pending offer after the game's own click handlers finish.
  if(e.target.closest?.('#resultContinueBtn,#v5Sheet button,.navbtn,[data-sheet-close],.v5-close,.dac-close,#lpCeremonyContinue,.lp-ceremony button,.gf-reward-modal button'))setTimeout(attempt,420);
 },true);
 // Both back/close and "continue to learning path" are actual lesson exits.
 // A WeakSet prevents two lifecycle events for the same attempt from duplicating
 // an offer. Merely navigating tabs or opening a chapter preview is not an exit.
 const exitedSessions=new WeakSet();
 function afterLessonExit(event){
  const s=event?.detail?.session;
  if(!s||typeof s!=='object'||exitedSessions.has(s))return;
  if(s.review||s.final||s.final2||s.final3||s.stage?.id==='SMART')return;
  const stageId=String(s.stage?.id||'');
  if(!/^U\d{2}-(?:M\d{2}|S\d{2})$/.test(stageId))return;
  exitedSessions.add(s);
  // Keep a queued chapter-completion/section offer ahead of a generic exit offer.
  if(!pending)enqueue('exit:'+stageId,{repeatable:true});
 }
 document.addEventListener('deen:lesson-finished',e=>{afterLessonExit(e);setTimeout(attempt,320)});
 document.addEventListener('deen:lesson-closed',e=>{afterLessonExit(e);setTimeout(attempt,320)});
 document.addEventListener('deen:navigated',()=>setTimeout(attempt,320));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
 setInterval(sync,60000);
 sync();
 window.DEEN_PREMIUM_OFFER=Object.freeze({open,close,sync,isTrialActive:active,isTrialUsed:()=>!!record(),version:'premium-fade-trial-v1'});
})();