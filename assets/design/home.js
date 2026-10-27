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
 function decorateNextStep(){
  const card=document.querySelector('#v5Return .v680-nba');if(!card)return;
  setClass(card,'ds-nba',true);
  localizeNextStep(card);
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
 window.DEEN_DS_HOME=Object.freeze({decorate,version:'ds-home-v1'});
})();
