(()=>{
 if(window.__deenV844NoClothing)return;
 window.__deenV844NoClothing=true;
 const VERSION='8.4.4-NO-CLOTHING',REV='844noclothes1';
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
  const controls=$$('button,[role="tab"],[data-v812-cat],[data-v812-sub]',r);
  return controls.find(el=>{
   const cat=String(el.dataset?.v812Cat||'').toLowerCase();
   const sub=String(el.dataset?.v812Sub||'').toLowerCase();
   const txt=String(el.textContent||'').trim().toLocaleLowerCase('tr-TR');
   return cat==='head'||sub==='head'||txt==='baş';
  })||null;
 }
 function cleanup(){
  const r=root();if(!r)return false;
  const controls=$$('button,[role="tab"],[data-v812-cat],[data-v812-sub]',r);
  let clothingActive=false;
  for(const el of controls){
   if(!isClothingControl(el))continue;
   if(el.classList.contains('active')||el.getAttribute('aria-selected')==='true')clothingActive=true;
   el.style.setProperty('display','none','important');
   el.setAttribute('aria-hidden','true');
   if('disabled' in el)el.disabled=true;
  }
  $$('.v812-outfit,.v832k-card,.v832u-outfit,.v832u-canvas,.v832k-mannequin',r).forEach(el=>el.remove());
  if(clothingActive){
   const head=findHeadControl(r);
   if(head&&!head.disabled)queueMicrotask(()=>head.click());
  }
  r.dataset.deenClothing='removed';
  document.documentElement.dataset.deenV844='ready';
  return true;
 }
 let raf=0;
 function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;cleanup()})}
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe,[data-v810-open-wardrobe]')){schedule();setTimeout(schedule,80)}},true);
 const mo=new MutationObserver(schedule);
 const bind=()=>{const r=root();if(r){mo.observe(r,{subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-selected']});cleanup()}else requestAnimationFrame(bind)};
 requestAnimationFrame(bind);
 window.DEEN_V844_NO_CLOTHING={version:VERSION,revision:REV,refresh:schedule,check:()=>({version:VERSION,removed:root()?.dataset?.deenClothing==='removed',clothingControls:root()?$$('button,[role="tab"],[data-v812-cat],[data-v812-sub]',root()).filter(isClothingControl).filter(el=>getComputedStyle(el).display!=='none').length:0})};
 window.DEEN_RELEASE_VERSION=VERSION;
 window.DEEN_RENDER_ARBITRATION='V844_NO_CLOTHING';
})();
