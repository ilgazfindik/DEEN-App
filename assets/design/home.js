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
  const paths=document.getElementById('v5Paths');if(!paths)return;
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
  observer=new MutationObserver(records=>{if(records.some(r=>r.type==='childList'))schedule()});
  observer.observe(scroll,{childList:true,subtree:true});
  decorate();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
 window.DEEN_DS_HOME=Object.freeze({decorate,version:'ds-home-v1'});
})();
