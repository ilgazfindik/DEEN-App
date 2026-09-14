(()=>{
 if(window.__deenV845NoClothingStable)return;
 window.__deenV845NoClothingStable=true;
 const VERSION='8.4.5-NO-CLOTHING-STABLE',REV='845save1';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const $$=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
 function root(){return $('#v812Wardrobe')}
 function isClothingControl(el){
  if(!el)return false;
  const cat=String(el.dataset?.v812Cat||'').toLowerCase();
  const sub=String(el.dataset?.v812Sub||'').toLowerCase();
  const txt=String(el.textContent||'').trim().toLocaleLowerCase('tr-TR');
  return cat==='outfit'||sub==='outfit'||sub==='worldoutfit'||txt==='kıyafet';
 }
 function findHeadControl(r){
  return $$('button,[role="tab"],[data-v812-cat],[data-v812-sub]',r).find(el=>{
   const cat=String(el.dataset?.v812Cat||'').toLowerCase();
   const sub=String(el.dataset?.v812Sub||'').toLowerCase();
   const txt=String(el.textContent||'').trim().toLocaleLowerCase('tr-TR');
   return cat==='head'||sub==='head'||txt==='baş';
  })||null;
 }
 function apply(){
  const r=root();if(!r)return false;
  const controls=$$('button,[role="tab"],[data-v812-cat],[data-v812-sub]',r);
  let clothingActive=false;
  for(const el of controls){
   if(!isClothingControl(el))continue;
   if(el.classList.contains('active')||el.getAttribute('aria-selected')==='true')clothingActive=true;
   el.setAttribute('aria-hidden','true');
   if('disabled' in el)el.disabled=true;
  }
  // Never remove avatar/canvas/mannequin nodes. They are shared by the normal avatar save/render flow.
  if(clothingActive){
   const head=findHeadControl(r);
   if(head&&!head.disabled)queueMicrotask(()=>head.click());
  }
  r.dataset.deenClothing='removed';
  document.documentElement.dataset.deenV845='ready';
  return true;
 }
 function schedule(){requestAnimationFrame(apply)}
 document.addEventListener('click',e=>{
  if(e.target.closest?.('[data-v810-open-wardrobe]')){
   schedule();setTimeout(apply,60);setTimeout(apply,180);
  }
 },true);
 // One passive initialization only. No MutationObserver: saving can freely rebuild the UI.
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
 window.DEEN_V845_NO_CLOTHING={version:VERSION,revision:REV,refresh:schedule,check:()=>({version:VERSION,removed:root()?.dataset?.deenClothing==='removed',destructiveCleanup:false,observer:false})};
 window.DEEN_RELEASE_VERSION=VERSION;
 window.DEEN_RENDER_ARBITRATION='V845_NO_CLOTHING_STABLE';
})();
