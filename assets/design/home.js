/* Liquid Glass tab bar for iPhones on iOS 26 and later (iOS 27 included). The web view's user agent freezes the OS
   version at 18.x, so the version is detected by a WebKit feature that first shipped with iOS 26 (CSS anchor positioning,
   or scroll-driven animations). ?glass=1 / ?glass=0 or localStorage ilnura_glass=1/0 force it on or off for testing. */
(()=>{
 'use strict';
 try{
  const ua=navigator.userAgent||'';
  let force=null;
  try{const q=new URLSearchParams(location.search).get('glass');if(q==='1'||q==='0'){force=q==='1';localStorage.setItem('ilnura_glass',q)}
   else{const v=localStorage.getItem('ilnura_glass');if(v==='1'||v==='0')force=v==='1'}}catch(_){}
  let native='';try{native=window.Capacitor&&window.Capacitor.getPlatform?window.Capacitor.getPlatform():''}catch(_){}
  const ios=/iP(hone|ad|od)/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1)||native==='ios';
  const webkit26=!!(window.CSS&&CSS.supports&&(CSS.supports('anchor-name','--ilnura')||CSS.supports('animation-timeline','scroll()')));
  const on=force===null?(ios&&webkit26):force;
  if(on)document.documentElement.classList.add('ilnura-glass');
  window.DEEN_DS_GLASS=Object.freeze({on,ios,webkit26});
 }catch(_){}
})();

/* Home (Learn tab) behaviour on the design system — Phase 2.
   Only adds state attributes/classes to the legacy DOM, so every re-render by the old
   renderers is re-decorated idempotently:
   - the current unit is open, earlier (done) and later (upcoming) units are collapsed;
   - a unit header toggles its path (click, Enter, Space) and remembers the choice;
   - "Next unit" dividers between units of the same section are hidden.
   Scroll position is left to the legacy scrollToCurrent(), which centres the current stage. */
(()=>{
 'use strict';
 if(window.DEEN_DS_HOME)return;
 const opened=new Set(),closed=new Set();
 const setAttr=(el,name,value)=>{if(el.getAttribute(name)!==value)el.setAttribute(name,value)};
 const setClass=(el,name,on)=>{if(el.classList.contains(name)!==on)el.classList.toggle(name,on)};
 const world=el=>[...el.classList].find(c=>/^world-\d+$/.test(c))||'';
 function units(paths){return [...paths.querySelectorAll(':scope>section.restored-unit')]}
 function currentIndex(list){
  let i=list.findIndex(u=>u.querySelector('.lp-stop.current'));
  if(i<0)i=list.findIndex(u=>u.querySelector('.lp-stop:not(.locked)'));
  return i<0?0:i;
 }
 function decorate(){
  const paths=document.getElementById('v5Paths');if(!paths){decorateNextStep();return}
  const list=units(paths),current=currentIndex(list);
  list.forEach((unit,i)=>{
   const state=i<current?'done':i>current?'upcoming':'current';
   setAttr(unit,'data-ds-unit',state);
   const open=opened.has(unit.id)||(!closed.has(unit.id)&&state==='current');
   setClass(unit,'ds-collapsed',!open);
   const hero=unit.querySelector(':scope>.hero'),path=unit.querySelector(':scope>.lp-path');
   if(!hero)return;
   if(path&&!path.id)path.id=unit.id+'-path';
   setAttr(hero,'role','button');setAttr(hero,'tabindex','0');
   setAttr(hero,'aria-expanded',String(open));
   if(path)setAttr(hero,'aria-controls',path.id);
  });
  for(const divider of paths.querySelectorAll(':scope>.restore-section-divider')){
   const prev=divider.previousElementSibling,next=divider.nextElementSibling;
   const betweenUnits=prev?.matches('section.restored-unit')&&next?.matches('section.restored-unit')&&world(prev)===world(next);
   setClass(divider,'ds-unit-divider',!!betweenUnits);
  }
  decorateNextStep();
 }
 // "Your next step" card (v680) in the reference style. The engine rebuilds it on every home
 // render and the locale layers translate its text nodes in place, so everything is added as
 // decoration around the engine's own nodes: the art, icons, and an accented copy of the
 // title (the real <h1> stays in the DOM, visually hidden, for screen readers and locale layers).
 const ICON={
  layers:'<svg class="ds-nba-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="m12 3 9 4.6-9 4.6-9-4.6L12 3Z"/><path d="m3 12.2 9 4.6 9-4.6"/><path d="m3 16.6 9 4.6 9-4.6"/></svg>',
  info:'<svg class="ds-nba-info" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M12 10.6v6" stroke="#06302b" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="7.3" r="1.35" fill="#06302b"/></svg>',
  infoLine:'<svg class="ds-nba-info-line" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9.2"/><path d="M12 10.8v5.6"/><path d="M12 7.6h.01" stroke-width="2.6"/></svg>',
  play:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6.6v10.8l8.6-5.4L9 6.6Z" fill="currentColor"/></svg>',
  chevrons:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 6 6 6-6 6"/><path d="m12 6 6 6-6 6"/></svg>',
  swoosh:'<svg class="ds-swoosh" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M3 9.5C55 3.5 120 2 197 5.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/><path d="M40 10.5C90 7 140 6.5 182 8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".55"/></svg>'
 };
 const ART='assets/design/mosque-arch.webp';
 // The accent is the closing phrase: the last two words of longer titles, otherwise the last one.
 function splitAccent(text){
  const words=text.trim().split(/\s+/),n=words.length>=4?2:1;
  return [words.slice(0,-n).join(' '),words.slice(-n).join(' ')];
 }
 // Card copy the locale tables miss: the due-review sentence (it carries a count), the section
 // final details and one button. Everything else on the card is already translated.
 const NEXT_STEP_COPY={
  en:{due:n=>n===1?'1 review is due; the short plan picks the most important ones.':n+' reviews are due; the short plan picks the most important ones.',
   final:(k,q)=>'Section '+k+' final · '+q+' questions',lesson:'CONTINUE WITH THE LESSON'},
  de:{due:n=>n===1?'1 Wiederholung ist fällig; der kurze Plan wählt die wichtigsten aus.':n+' Wiederholungen sind fällig; der kurze Plan wählt die wichtigsten aus.',
   final:(k,q)=>'Finale von Teil '+k+' · '+q+' Fragen',lesson:'MIT DER LEKTION WEITER'},
  fr:{due:n=>n===1?'1 révision à faire ; le plan court choisit les plus importantes.':n+' révisions à faire ; le plan court choisit les plus importantes.',
   final:(k,q)=>'Finale de la partie '+k+' · '+q+' questions',lesson:'CONTINUER AVEC LA LEÇON'},
  // Arabic translates the sentence and the question count itself; only these two remain.
  ar:{part:k=>'نهائي القسم '+k,lesson:'تابع الدرس'}
 };
 // The lesson button as the engine writes it, and as the English table half-translates it.
 const LESSON_BUTTON=new Set(['DERSLE DEVAM ET','DERSLE CONTINUE']);
 function localeTranslator(code){
  const api=code==='en'?(window.DEEN_ENGLISH_UI&&{translate:k=>window.DEEN_ENGLISH_UI.t(k)}):code==='de'?window.DEEN_GERMAN_UI:code==='fr'?window.DEEN_FRENCH_UI:null;
  if(!api?.translate)return()=>null;
  return key=>{let v=null;try{v=api.translate(key)}catch(_){}return v&&v!==key?v:null};
 }
 const TURKISH=/[ğışĞİŞ]|\bsoru\b|finali/;
 function localizeNextStep(card){
  let code='';try{code=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}
  code=String(code||document.documentElement.lang||'').slice(0,2).toLowerCase();
  const C=NEXT_STEP_COPY[code];if(!C)return;
  const tx=localeTranslator(code);
  const nodes=[card.querySelector(':scope>p'),card.querySelector('.v680-main')].flatMap(el=>el?[...el.childNodes].filter(n=>n.nodeType===3&&n.data.trim()):[]);
  for(const node of nodes){
   const text=node.data.trim();
   if(LESSON_BUTTON.has(text)){node.data=node.data.replace(text,C.lesson);continue}
   if(!TURKISH.test(text))continue;
   let out=text;
   if(C.due)out=out.replace(/^(\d+) tekrar vadesi geldi; kısa plan en önemlileri seçer\.$/,(_,n)=>C.due(Number(n)));
   if(C.final)out=out.replace(/Kısım (\d+) finali · (\d+) soru/,(_,k,q)=>C.final(k,q));
   if(C.part)out=out.replace(/Kısım (\d+) finali/,(_,k)=>C.part(k));
   // Final details arrive as "<final title> · Kısım n finali · m soru"; the title has a table entry.
   if(TURKISH.test(out))out=out.split(' · ').map(part=>tx(part)||part).join(' · ');
   if(out!==text)node.data=node.data.replace(text,out);
  }
 }
 // Completed-day states of the next-step card (done, optional review, chests). The engine writes these in Turkish and the
 // word-level locale layers mangle them, so the card is localised from the engine's own decision (state.nextActionMeta.lastDecision).
 const DONE_COPY={
  en:{done:{title:'All done for today.',detail:'Your learning and review goals are complete. Continuing is entirely optional.',reason:'Daily goal complete',badge:'DONE',label:'RETURN TO THE LEARNING PATH'},
   optional_review:{title:'Today’s plan is done.',detail:n=>'If you like, you can do another short '+n+'-question review.',reason:'Daily goal complete · an extra session is optional',badge:'DONE',label:'OPTIONAL REVIEW'},
   daily_chest:{title:'Your daily chest is ready.',detail:'Today’s Journey and 3 task seals are complete. Collect your reward.',reason:'The only required step left in today’s reward loop',badge:'READY',label:'OPEN THE SMALL CHEST'},
   weekly_chest:{title:'Your weekly rhythm chest is ready.',detail:'Today’s Journey was completed on 5 different days. You can open the medium chest.',reason:'Weekly rhythm complete',badge:'READY',label:'OPEN THE MEDIUM CHEST'}},
  de:{done:{title:'Für heute geschafft.',detail:'Dein Lern- und Wiederholungsziel ist erreicht. Weiterzumachen ist völlig freiwillig.',reason:'Tagesziel erreicht',badge:'FERTIG',label:'ZURÜCK ZUM LERNPFAD'},
   optional_review:{title:'Der heutige Plan ist erledigt.',detail:n=>'Wenn du magst, kannst du noch eine kurze Wiederholung mit '+n+' Fragen machen.',reason:'Tagesziel erreicht · eine zusätzliche Einheit ist freiwillig',badge:'FERTIG',label:'FREIWILLIGE WIEDERHOLUNG'},
   daily_chest:{title:'Deine Tagestruhe ist bereit.',detail:'Die heutige Tagesreise und 3 Aufgabensiegel sind abgeschlossen. Hol dir deine Belohnung.',reason:'Der einzige noch nötige Schritt im heutigen Belohnungskreislauf',badge:'BEREIT',label:'KLEINE TRUHE ÖFFNEN'},
   weekly_chest:{title:'Deine Wochenrhythmus-Truhe ist bereit.',detail:'An 5 verschiedenen Tagen wurde die Tagesreise abgeschlossen. Du kannst die mittlere Truhe öffnen.',reason:'Wochenrhythmus abgeschlossen',badge:'BEREIT',label:'MITTLERE TRUHE ÖFFNEN'}},
  fr:{done:{title:'C’est tout pour aujourd’hui.',detail:'Ton objectif d’apprentissage et de révision est atteint. Continuer est entièrement facultatif.',reason:'Objectif du jour atteint',badge:'FAIT',label:'RETOUR AU PARCOURS'},
   optional_review:{title:'Le plan du jour est terminé.',detail:n=>'Si tu veux, tu peux faire encore une courte révision de '+n+' questions.',reason:'Objectif du jour atteint · une séance supplémentaire est facultative',badge:'FAIT',label:'RÉVISION FACULTATIVE'},
   daily_chest:{title:'Ton coffre du jour est prêt.',detail:'Le parcours du jour et 3 sceaux de défi sont terminés. Récupère ta récompense.',reason:'La seule étape obligatoire restante du cycle de récompenses du jour',badge:'PRÊT',label:'OUVRIR LE PETIT COFFRE'},
   weekly_chest:{title:'Ton coffre du rythme hebdomadaire est prêt.',detail:'Le parcours du jour a été terminé sur 5 jours différents. Tu peux ouvrir le coffre moyen.',reason:'Rythme hebdomadaire atteint',badge:'PRÊT',label:'OUVRIR LE COFFRE MOYEN'}},
  ar:{done:{title:'انتهيت لهذا اليوم.',detail:'اكتمل هدفك للتعلّم والمراجعة. المتابعة اختيارية تمامًا.',reason:'اكتمل الهدف اليومي',badge:'تم',label:'العودة إلى مسار التعلّم'},
   optional_review:{title:'اكتملت خطة اليوم.',detail:n=>'إن شئت يمكنك إجراء مراجعة قصيرة أخرى من '+n+' أسئلة.',reason:'اكتمل الهدف اليومي · الجلسة الإضافية اختيارية',badge:'تم',label:'مراجعة اختيارية'},
   daily_chest:{title:'صندوقك اليومي جاهز.',detail:'اكتملت رحلة اليوم و3 أختام مهام. اجمع مكافأتك.',reason:'الخطوة الإلزامية الوحيدة المتبقية في دورة مكافآت اليوم',badge:'جاهز',label:'افتح الصندوق الصغير'},
   weekly_chest:{title:'صندوق إيقاعك الأسبوعي جاهز.',detail:'اكتملت رحلة اليوم في 5 أيام مختلفة. يمكنك فتح الصندوق المتوسط.',reason:'اكتمل الإيقاع الأسبوعي',badge:'جاهز',label:'افتح الصندوق المتوسط'}}
 };
 function setText(el,text){if(el&&el.textContent!==text)el.textContent=text}
 function localizeDecision(card){
  let code='';try{code=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}
  const C=DONE_COPY[String(code).slice(0,2)];if(!C)return;
  let d=null;try{d=state.nextActionMeta?.lastDecision}catch(_){}
  const K=d&&C[d.kind];if(!K)return;
  setText(card.querySelector(':scope>h1'),K.title);
  const n=Math.min(5,Number((String(d.detail||'').match(/\d+/)||[5])[0])||5);
  setText(card.querySelector(':scope>p'),typeof K.detail==='function'?K.detail(n):K.detail);
  setText(card.querySelector('.v680-why>span'),K.reason);
  setText(card.querySelector('.v680-badge'),K.badge);
  const cta=card.querySelector('.v680-main');
  const node=cta&&[...cta.childNodes].find(x=>x.nodeType===3&&x.data.trim());
  if(node&&node.data.trim()!==K.label)node.data=K.label;
 }
 function decorateNextStep(){
  const card=document.querySelector('#v5Return .v680-nba');if(!card)return;
  setClass(card,'ds-nba',true);
  localizeNextStep(card);
  localizeDecision(card);
  if(!card.querySelector(':scope>.ds-nba-art')){
   const art=document.createElement('img');art.className='ds-nba-art';art.src=ART;art.alt='';art.decoding='async';art.setAttribute('aria-hidden','true');
   card.prepend(art);
  }
  const kicker=card.querySelector('.v680-kicker');
  if(kicker&&!kicker.querySelector('.ds-nba-ico'))kicker.insertAdjacentHTML('afterbegin',ICON.layers);
  const h1=card.querySelector(':scope>h1');
  if(h1){
   setClass(h1,'ds-sr',true);
   const text=h1.textContent.trim();let copy=card.querySelector(':scope>.ds-nba-title');
   if(copy&&copy.dataset.dsSource!==text){copy.remove();copy=null}
   if(!copy&&text){
    const [lead,accent]=splitAccent(text);
    copy=document.createElement('div');copy.className='ds-nba-title';copy.dataset.dsSource=text;copy.setAttribute('aria-hidden','true');
    const em=document.createElement('em');em.textContent=accent;
    copy.append(document.createTextNode(lead?lead+' ':''),em);copy.insertAdjacentHTML('beforeend',ICON.swoosh);
    h1.after(copy);
   }
  }
  const why=card.querySelector('.v680-why');
  if(why&&!why.querySelector('.ds-nba-info'))why.insertAdjacentHTML('afterbegin',ICON.info);
  const cta=card.querySelector('.v680-main');
  if(cta){
   if(!cta.querySelector(':scope>.ds-cta-play')){
    cta.insertAdjacentHTML('afterbegin','<span class="ds-cta-play" aria-hidden="true">'+ICON.play+'</span>');
    cta.insertAdjacentHTML('beforeend','<span class="ds-cta-end" aria-hidden="true">'+ICON.chevrons+'</span>');
   }
   // renderHome() pins a 12.5px label inline; the reference button uses a larger label.
   if(cta.style.getPropertyValue('font-size')!=='15px')cta.style.setProperty('font-size','15px','important');
   // The Arabic layer translates only the "5 SORU" part of "5 SORULUK ISINMA" and leaves
   // "LUK ISINMA" behind; replace that half-translated label with the whole phrase.
   const label=[...cta.childNodes].find(n=>n.nodeType===3&&n.data.trim());
   const m=label?.data.trim().match(/^(\d+)\s*أسئلة\s*LUK ISINMA$/);
   if(m)label.data='إحماء بـ '+m[1]+' أسئلة';
  }
  const soft=card.querySelector('.v680-soft');
  if(soft&&!soft.querySelector('.ds-nba-info-line'))soft.insertAdjacentHTML('afterbegin',ICON.infoLine);
 }

 function toggle(hero){
  const unit=hero.closest('section.restored-unit');if(!unit)return;
  const open=unit.classList.contains('ds-collapsed');
  (open?opened:closed).add(unit.id);(open?closed:opened).delete(unit.id);
  decorate();
  if(open)requestAnimationFrame(()=>hero.scrollIntoView({block:'nearest'}));
 }
 const heroFrom=target=>target?.closest?.('#v5Paths>section.restored-unit>.hero');
 document.addEventListener('click',event=>{
  const hero=heroFrom(event.target);if(!hero||event.target.closest('button,a'))return;
  event.preventDefault();toggle(hero);
 });
 document.addEventListener('keydown',event=>{
  if(event.key!=='Enter'&&event.key!==' ')return;
  const hero=heroFrom(event.target);if(!hero||event.target!==hero)return;
  event.preventDefault();toggle(hero);
 });

 // Re-decorate after the legacy renderers rebuild the path; our own attribute writes do not loop.
 let queued=false;
 const schedule=()=>{if(queued)return;queued=true;setTimeout(()=>{queued=false;decorate()},0)};
 let observer=null;
 function watch(){
  const scroll=document.getElementById('learnScroll');
  if(!scroll){setTimeout(watch,300);return}
  // Text changes matter too: the locale layers translate the next-step title in place.
  observer=new MutationObserver(records=>{if(records.some(r=>r.type==='childList'||r.type==='characterData'))schedule()});
  observer.observe(scroll,{childList:true,subtree:true,characterData:true});
  decorate();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
 // Arabic: "الملف الشخصي" does not fit the bottom bar and was cut ("الملف الشخ…"); the short form fits.
 function fixNavLabels(){
  let code='';try{code=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}
  if(code!=='ar')return;
  const span=document.querySelector('.bottomnav .navbtn[data-screen="profileScreen"] span');
  if(span&&span.textContent.trim()!=='ملفي')span.textContent='ملفي';
 }
 setInterval(()=>{try{fixNavLabels()}catch(_){}},1500);
 window.DEEN_DS_HOME=Object.freeze({decorate,version:'ds-home-v1'});
})();

/* Native plugin access. The app does not bundle @capacitor/core, and Capacitor's injected native bridge does not fill
   Capacitor.Plugins; it does provide Capacitor.nativePromise(plugin, method, options) and Capacitor.addListener(plugin,
   event, callback). DEEN_NATIVE_PLUGIN(name) returns an object whose methods call the native plugin through them (or the
   Capacitor.Plugins entry when one exists), or null outside the iOS app. */
window.DEEN_NATIVE_PLUGIN=window.DEEN_NATIVE_PLUGIN||function(name){
 const C=window.Capacitor;if(!C)return null;
 let native=false;try{native=!!(C.isNativePlatform?C.isNativePlatform():C.getPlatform&&C.getPlatform()!=='web')}catch(_){}
 if(!native)return null;
 try{if(C.Plugins&&C.Plugins[name])return C.Plugins[name]}catch(_){}
 if(typeof C.nativePromise!=='function')return null;
 return new Proxy({},{get:(_,m)=>{
  if(m==='then'||typeof m!=='string')return undefined;
  if(m==='addListener')return (event,cb)=>Promise.resolve(typeof C.addListener==='function'?C.addListener(name,event,cb):null);
  return (args)=>C.nativePromise(name,m,args||{});
 }});
};

/* Haptics + swipeable glass tab bar.
   - Haptics go through the native Capacitor Haptics plugin on iOS (navigator.vibrate does nothing there); elsewhere
     navigator.vibrate is used. The Settings switch "Dokunsal geri bildirim" (state.settings.haptic) turns every haptic
     off; it is switched on once for existing players, since it never worked on iPhone before.
   - The game's own answer vibrations stay off (motion.js switched them off on purpose); only the tab bar uses haptics.
   - The tab bar: a tap gives a light tap; in Liquid Glass mode a glass lens sits under the active tab and can be dragged
     left and right like the iOS 26 tab bars (WhatsApp, Music…). Each tab the lens passes ticks; letting go opens it. */
(()=>{
 'use strict';
 const C=window.Capacitor;
 let native=false;try{native=!!(C&&(C.isNativePlatform?C.isNativePlatform():C.getPlatform&&C.getPlatform()!=='web'))}catch(_){}
 let H=null;try{H=native?window.DEEN_NATIVE_PLUGIN('Haptics'):null}catch(_){H=null}
 const webVibrate=typeof navigator.vibrate==='function'?navigator.vibrate.bind(navigator):null;
 // The game keeps its state in a global `let` (not a window property), so it is read by name.
 const S=()=>{try{return typeof state==='object'&&state?state:null}catch(_){return null}};
 function defaultOn(){try{const st=S();if(!st||!st.settings)return false;if(localStorage.getItem('ilnura_haptic_default_v2')!=='1'){st.settings.haptic=true;localStorage.setItem('ilnura_haptic_default_v2','1');try{saveState()}catch(_){}}return true}catch(_){return true}}
 (function retry(n){if(!defaultOn()&&n<40)setTimeout(()=>retry(n+1),250)})(0);
 const enabled=()=>{const st=S();return !st||!st.settings||st.settings.haptic!==false};
 const call=(fn,arg)=>{try{const p=H&&H[fn]&&H[fn](arg);if(p&&p.catch)p.catch(()=>{})}catch(_){}};
 function tap(){if(!enabled())return;if(H)call('impact',{style:'LIGHT'});else if(webVibrate)try{webVibrate(8)}catch(_){}}
 function select(){if(!enabled())return;if(H)call('selectionChanged');else if(webVibrate)try{webVibrate(5)}catch(_){}}
 function selectStart(){if(H&&enabled())call('selectionStart')}
 function selectEnd(){if(H)call('selectionEnd')}
 window.DEEN_DS_HAPTIC=Object.freeze({tap,select,enabled,native:!!H});

 const glass=()=>document.documentElement.classList.contains('ilnura-glass');
 let suppressClick=0;
 function install(){
  const nav=document.querySelector('nav.bottomnav');if(!nav){setTimeout(install,400);return}
  const tabs=()=>[...nav.querySelectorAll('button.navbtn')];
  let lens=null;
  function ensureLens(){if(!glass())return null;if(!lens||!lens.isConnected){lens=document.createElement('i');lens.className='ilnura-glass-lens';lens.setAttribute('aria-hidden','true');nav.prepend(lens);nav.classList.add('has-lens')}return lens}
  function place(i,dragX){const l=ensureLens();if(!l)return;const t=tabs();const b=t[i];if(!b)return;const nr=nav.getBoundingClientRect(),br=b.getBoundingClientRect();
   const w=br.width,x=dragX==null?br.left-nr.left:Math.max(6,Math.min(nr.width-6-w,dragX-nr.left-w/2));
   l.style.width=w+'px';l.style.transform='translateX('+x+'px)'}
  const activeIndex=()=>Math.max(0,tabs().findIndex(b=>b.classList.contains('active')));
  const sync=()=>{if(!drag)place(activeIndex())};
  new MutationObserver(sync).observe(nav,{subtree:true,attributes:true,attributeFilter:['class']});
  new MutationObserver(()=>{if(glass())sync()}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  window.addEventListener('resize',sync);setTimeout(sync,60);setTimeout(sync,600);

  let drag=null;
  const indexAt=x=>{const t=tabs();let best=0,bd=1e9;t.forEach((b,i)=>{const r=b.getBoundingClientRect(),d=Math.abs(r.left+r.width/2-x);if(d<bd){bd=d;best=i}});return best};
  nav.addEventListener('pointerdown',e=>{if(!glass()||e.button>0)return;drag={id:e.pointerId,x0:e.clientX,y0:e.clientY,moved:false,idx:indexAt(e.clientX),start:activeIndex()}},{passive:true});
  nav.addEventListener('pointermove',e=>{
   if(!drag||e.pointerId!==drag.id)return;
   const dx=e.clientX-drag.x0,dy=e.clientY-drag.y0;
   if(!drag.moved){if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy))return;drag.moved=true;try{nav.setPointerCapture(e.pointerId)}catch(_){}nav.classList.add('is-dragging');selectStart()}
   place(drag.idx,e.clientX);const i=indexAt(e.clientX);
   if(i!==drag.idx){drag.idx=i;select();tabs().forEach((b,k)=>b.classList.toggle('lens-over',k===i))}
  });
  const end=e=>{
   if(!drag||(e&&e.pointerId!==drag.id))return;const d=drag;drag=null;
   nav.classList.remove('is-dragging');tabs().forEach(b=>b.classList.remove('lens-over'));
   if(d.moved){selectEnd();suppressClick=Date.now();const b=tabs()[d.idx];
    if(b&&!b.classList.contains('active'))b.click();else place(activeIndex())}
  };
  nav.addEventListener('pointerup',end);nav.addEventListener('pointercancel',e=>{if(drag&&e.pointerId===drag.id){drag=null;nav.classList.remove('is-dragging');tabs().forEach(b=>b.classList.remove('lens-over'));place(activeIndex())}});
  // A drag ends with a synthetic click on the tab it started from: swallow that one. Real taps give a light tap.
  nav.addEventListener('click',e=>{
   if(Date.now()-suppressClick<350&&e.isTrusted){e.stopImmediatePropagation();e.preventDefault();return}
   if(e.isTrusted&&e.target.closest('button.navbtn'))tap();
  },true);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();

/* Native iOS tab bar (iOS 26+). When the app runs in the iOS shell and the NativeTabBar plugin (ios/App/App/
   NativeTabBar.swift) reports it is available, the real UITabBar is shown over the web view: the system draws it in
   Liquid Glass, with its own lens, drag-to-switch gesture and feedback. The web tab bar stays in the DOM as the router
   (transparent, under the native bar):
   - a native tab selection clicks the matching web tab, so every screen change goes through the existing code, and gives
     the same light haptic tap as the web bar (Settings switch respected);
   - a web-side screen change (from a card, a link…) selects the matching native tab;
   - the native bar hides whenever the web tab bar is not the top element at its spot (lesson, sheets, dialogs, start-up),
     and the titles follow the web tab labels (language changes). */
(()=>{
 'use strict';
 const C=window.Capacitor;
 let native=false;try{native=!!(C&&(C.isNativePlatform?C.isNativePlatform():C.getPlatform&&C.getPlatform()!=='web'))}catch(_){}
 if(!native)return;
 let NT=null;try{NT=window.DEEN_NATIVE_PLUGIN('NativeTabBar')}catch(_){NT=null}
 if(!NT||typeof NT.isAvailable!=='function')return;
 const ICONS={learnScreen:['book','book.fill'],reviewScreen:['arrow.clockwise.circle','arrow.clockwise.circle.fill'],leagueScreen:['text.book.closed','text.book.closed.fill'],marketScreen:['bag','bag.fill'],profileScreen:['person','person.fill']};
 const safe=p=>{try{const r=p&&p.then?p:Promise.resolve(p);return r.catch(()=>null)}catch(_){return Promise.resolve(null)}};
 let nav=null,lastTabs='',lastSel='',hidden=null,ready=false;
 const tabsOf=()=>[...nav.querySelectorAll('button.navbtn')].map(b=>({id:b.dataset.screen,title:(b.querySelector('span')?.textContent||'').trim(),label:b.getAttribute('aria-label')||'',icon:(ICONS[b.dataset.screen]||['circle'])[0],selectedIcon:(ICONS[b.dataset.screen]||['circle','circle'])[1]}));
 const activeId=()=>nav.querySelector('button.navbtn.active')?.dataset.screen||'learnScreen';
 function push(){
  if(!ready||!nav)return;
  const tabs=tabsOf(),key=JSON.stringify(tabs),sel=activeId();
  if(key!==lastTabs){lastTabs=key;lastSel=sel;safe(NT.show({tabs,selected:sel,tint:'#f2cf84'})).then(r=>{if(r&&r.height)document.documentElement.style.setProperty('--native-tabbar-h',Math.round(r.height)+'px')});hidden=false}
  else if(sel!==lastSel){lastSel=sel;safe(NT.select({id:sel}))}
  visibility();
 }
 function covered(){
  const d=document.documentElement;
  if(d.dataset.deenDesign!=='ready'||document.getElementById('ilnura-veil'))return true;
  const prep=document.getElementById('deenPreparation');if(prep&&getComputedStyle(prep).display!=='none'&&getComputedStyle(prep).visibility!=='hidden')return true;
  const r=nav.getBoundingClientRect();if(r.width<10||r.height<10)return true;
  const cs=getComputedStyle(nav);if(cs.display==='none'||cs.visibility==='hidden')return true;
  const pts=[[r.left+r.width*.25,r.top+r.height/2],[r.left+r.width*.75,r.top+r.height/2]];
  return pts.some(([x,y])=>{const el=document.elementFromPoint(x,y);return !el||!nav.contains(el)});
 }
 function visibility(){if(!ready||!nav)return;const h=covered();if(h!==hidden){hidden=h;safe(NT.setHidden({hidden:h}))}}
 function install(){
  nav=document.querySelector('nav.bottomnav');if(!nav){setTimeout(install,400);return}
  safe(NT.isAvailable()).then(r=>{
   if(!r||!r.available)return;
   ready=true;document.documentElement.classList.add('native-tabbar');
   safe(NT.addListener&&NT.addListener('tabSelected',e=>{const b=nav.querySelector('button.navbtn[data-screen="'+String(e&&e.id||'')+'"]');if(b&&!b.classList.contains('active')){try{window.DEEN_DS_HAPTIC&&DEEN_DS_HAPTIC.tap()}catch(_){}b.click()}lastSel=e&&e.id||lastSel}));
   new MutationObserver(push).observe(nav,{subtree:true,attributes:true,attributeFilter:['class','aria-label'],childList:true,characterData:true});
   let t=0;new MutationObserver(()=>{if(t)return;t=setTimeout(()=>{t=0;visibility()},80)}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','open','style','hidden']});
   new MutationObserver(visibility).observe(document.documentElement,{attributes:true,attributeFilter:['data-deen-design','class']});
   setInterval(visibility,400);push();
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
