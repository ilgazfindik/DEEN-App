/* Onboarding look: a progress bar replaces the step dots, and the companion asks each question
   from a speech bubble (the owl until a companion is picked, then that one). The steps, fields
   and what they save are the engine's; only presentation is added, and only when it changes. */
(()=>{
 'use strict';
 if(window.DEEN_DS_ONBOARDING)return;
 let lastPct='0%';
 const LINE='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">';
 const CHOICE_ICONS={
  '📚':LINE+'<path d="M4 19V6a1 1 0 0 1 1-1h3v14H5a1 1 0 0 1-1-1z"/><path d="M8 5h3v14H8"/><path d="m13.5 6.2 2.9-.8 3.6 13.1-2.9.8z"/></svg>',
  '🎓':LINE+'<path d="m2.5 9.5 9.5-4.5 9.5 4.5-9.5 4.5z"/><path d="M6.5 11.5v4.2c1.6 1.4 3.5 2.1 5.5 2.1s3.9-.7 5.5-2.1v-4.2"/><path d="M21.5 9.5v5"/></svg>',
  '📖':LINE+'<path d="M3.5 5.5c2.9-.9 5.7-.4 8.5 1.6v12c-2.8-2-5.6-2.5-8.5-1.6z"/><path d="M20.5 5.5c-2.9-.9-5.7-.4-8.5 1.6v12c2.8-2 5.6-2.5 8.5-1.6z"/></svg>'
 };
 function companion(root){
  let pick=root.querySelector('.v998-animal.selected')?.dataset.animal;
  try{pick=pick||state?.profile?.companion}catch(_){}
  return String(pick||'owl').replace(/[^a-z]/g,'')||'owl';
 }
 function decorate(root){
  const step=Number(root.dataset.step)||0;
  root.classList.toggle('ds-ob-intro',step===0);
  const dots=[...root.querySelectorAll('.v998-dots i')],top=root.querySelector('.v998-top');
  if(top&&dots.length){
   const at=Math.max(0,dots.findIndex(d=>d.classList.contains('on')));
   // The engine's welcome dot counts as the start, so the name step shows the first fifth.
   const pct=Math.max(6,Math.round(at/Math.max(1,dots.length-1)*100))+'%';
   let bar=top.querySelector('.ds-ob-bar');
   // The engine redraws each step, so a new bar starts at the last width and grows from there.
   if(!bar){bar=document.createElement('div');bar.className='ds-ob-bar';bar.setAttribute('aria-hidden','true');bar.append(document.createElement('i'));bar.style.setProperty('--p',lastPct);top.append(bar);requestAnimationFrame(()=>requestAnimationFrame(()=>bar.style.setProperty('--p',pct)))}
   else if(bar.style.getPropertyValue('--p')!==pct)bar.style.setProperty('--p',pct);
   lastPct=pct;
  }
  // The narration choices used emoji; they get line icons in the app's own style.
  for(const ico of root.querySelectorAll('.choice-ico')){const svg=CHOICE_ICONS[ico.textContent.trim()];if(svg){ico.innerHTML=svg;ico.classList.add('ds-ob-ico')}}
  const copy=root.querySelector('.v998-copy');
  if(copy&&step>0){
   const pet=companion(root),src='assets/companions/'+pet+'/'+pet+'_avatar.png';
   let img=copy.querySelector('.ds-ob-pet');
   if(!img){img=new Image();img.className='ds-ob-pet';img.alt='';img.decoding='async';img.setAttribute('aria-hidden','true');copy.prepend(img)}
   if(img.getAttribute('src')!==src)img.src=src;
  }
 }
 let queued=false;
 const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;const root=document.getElementById('v998Onboarding');if(root)decorate(root)})};
 // Only the onboarding element is watched closely; the page-wide watch just notices it arriving.
 // With the account screen skipped, the welcome screen has already greeted the learner: the engine's
 // own welcome step is passed once, before it is painted (observer callbacks run before paint).
 function skipIntro(){
  const root=document.getElementById('v998Onboarding');
  if(!window.__DEEN_SKIP_ONBOARDING_INTRO__||root?.dataset.step!=='0')return false;
  window.__DEEN_SKIP_ONBOARDING_INTRO__=false;
  try{root.remove();window.DEEN_PREMIUM_ONBOARDING.render(1);return true}catch(_){return false}
 }
 const inner=new MutationObserver(()=>{if(!skipIntro())schedule()});let watched=null;
 function attach(){
  if(skipIntro())return attach();
  const root=document.getElementById('v998Onboarding');if(!root||root===watched)return;
  watched=root;inner.disconnect();inner.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-step']});schedule();
 }
 function install(){
  if(!document.body){setTimeout(install,50);return}
  new MutationObserver(records=>{for(const r of records)for(const n of r.addedNodes)if(n.id==='v998Onboarding'||n.querySelector?.('#v998Onboarding')){attach();return}})
   .observe(document.body,{childList:true,subtree:true});
  attach();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 window.DEEN_DS_ONBOARDING=Object.freeze({version:'ds-onboarding-1'});
})();
