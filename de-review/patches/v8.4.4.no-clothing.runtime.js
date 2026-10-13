(()=>{
 if(window.__deenV846AvatarSaveStable)return;
 window.__deenV846AvatarSaveStable=true;
 const VERSION='8.4.6-AVATAR-SAVE-STABLE',REV='846save2';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const $$=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
 let saving=false,restoreTimer=0,lastError=null,lastSavedAt=0;
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
  if(clothingActive){
   const head=findHeadControl(r);
   if(head&&!head.disabled)queueMicrotask(()=>head.click());
  }
  r.dataset.deenClothing='removed';
  document.documentElement.dataset.deenV846='ready';
  return true;
 }
 function schedule(){requestAnimationFrame(apply)}
 function setSaveBusy(busy){
  const r=root();if(!r)return;
  $$('[data-v812-save]',r).forEach(btn=>{btn.disabled=!!busy;btn.dataset.v846Saving=busy?'1':'0'});
 }
 function avatarOnlySave(e){
  const r=root();
  if(!r?.classList?.contains('open'))return;
  if(!e.target.closest?.('[data-v812-save]'))return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  if(saving)return;
  saving=true;lastError=null;setSaveBusy(true);
  const pro=window.DEEN_WARDROBE_PRO;
  const world=window.DEEN_WORLD;
  const oldUpdate=window.updateUI;
  const oldOpen=world?.open;
  const oldBuy=world?.buy;
  const oldEquip=world?.equip;
  try{
   // The wardrobe's original save still owns its internal open/close state and calls saveState().
   // During that synchronous save, suppress obsolete clothing mutations and the heavy updateUI rebuild.
   if(typeof oldUpdate==='function')window.updateUI=()=>{};
   if(world&&typeof oldOpen==='function')world.open=()=>true;
   if(world&&typeof oldBuy==='function')world.buy=()=>false;
   if(world&&typeof oldEquip==='function')world.equip=()=>false;
   if(pro&&typeof pro.save==='function')pro.save();
   else{
    try{state.myWorld=state.myWorld||{};state.myWorld.avatar=state.myWorld.avatar||{};state.myWorld.avatar.created=true;saveState?.()}catch(_){}
    r.classList.remove('open');document.body.style.overflow='';
   }
   lastSavedAt=Date.now();
  }catch(err){
   lastError=String(err?.message||err);window.DEEN_V846_SAVE_ERROR=lastError;console.error('DEEN v8.4.6 avatar save:',err);
  }finally{
   if(typeof oldUpdate==='function')window.updateUI=oldUpdate;
   if(world&&typeof oldBuy==='function')world.buy=oldBuy;
   if(world&&typeof oldEquip==='function')world.equip=oldEquip;
   clearTimeout(restoreTimer);
   // v8.1.2 queues world.open() at +80ms. Keep it suppressed long enough for that callback to expire.
   restoreTimer=setTimeout(()=>{
    if(world&&typeof oldOpen==='function')world.open=oldOpen;
    saving=false;setSaveBusy(false);
   },180);
  }
 }
 document.addEventListener('click',avatarOnlySave,true);
 document.addEventListener('click',e=>{
  if(e.target.closest?.('[data-v810-open-wardrobe]')){schedule();setTimeout(apply,60);setTimeout(apply,180)}
 },true);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
 window.DEEN_V846_NO_CLOTHING={version:VERSION,revision:REV,refresh:schedule,save:()=>{const b=$('[data-v812-save]',root());b?.click()},check:()=>({version:VERSION,removed:root()?.dataset?.deenClothing==='removed',saving,lastSavedAt,error:lastError,destructiveCleanup:false,observer:false})};
 window.DEEN_RELEASE_VERSION=VERSION;
 window.DEEN_RENDER_ARBITRATION='V846_AVATAR_SAVE_STABLE';
})();
