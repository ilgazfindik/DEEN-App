(()=>{
 const VERSION='8.3.2-HF2Y',REV='832hf2y1';
 const css=`
/* DEEN v8.3.2 HF2Y — use HF2B validated row object URLs directly */
#v812Wardrobe .v832u-avatar-slot>.v831-stack,
#v812Wardrobe .v832u-avatar-slot>.v832x-stack{display:none!important}
#v812Wardrobe .v832y-stack{position:absolute!important;left:50%!important;transform:translateX(-50%)!important;overflow:visible!important;pointer-events:none!important}
#v812Wardrobe .v832y-layer{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;background-repeat:no-repeat!important;pointer-events:none!important}
#v812Wardrobe .v832u-canvas[data-gender="female"] .v832u-avatar-slot{z-index:7!important;overflow:hidden!important;border-radius:50%!important;clip-path:ellipse(42% 46% at 50% 49%)!important;-webkit-clip-path:ellipse(42% 46% at 50% 49%)!important}
#v812Wardrobe .v832u-canvas[data-gender="female"] .v832y-stack{top:-39%!important;width:218%!important;height:218%!important}
#v812Wardrobe .v832u-canvas[data-gender="male"] .v832u-avatar-slot{z-index:7!important}
#v812Wardrobe .v832u-canvas[data-gender="male"] .v832y-stack{top:-7%!important;width:112%!important;height:112%!important}
`;
 const runtime=`(()=>{
  if(window.__deenV832HF2Y)return;window.__deenV832HF2Y=true;
  const VERSION='8.3.2-HF2Y';
  const $=(s,r=document)=>r?.querySelector?.(s)||null;
  const ORDER={
   female:['base_avatar','eyes','noses','mouths','blush','glasses'],
   male:['base_avatar','face_shapes','hair','headwear','eyebrows','eyes','noses','mouths','mustaches','beards','glasses','sunglasses']
  };
  function root(){return $('#v812Wardrobe')}
  function canvas(){return $('.v832u-canvas',root())}
  function avatarState(){try{return window.DEEN_AVATAR_ASSETS?.state?.()||null}catch(_){return null}}
  function registry(g){return window.DEEN_AVATAR_ASSET_PACKS?.[g]||[]}
  function asset(g,id){return id?registry(g).find(x=>x.id===id)||null:null}
  function def(g,cat){const a=registry(g).filter(x=>x.category===cat);return a.find(x=>x.default)||a[0]||null}
  function resolved(g){
   const st=avatarState(),sel=st?.selected?.[g]||{};
   return ORDER[g].map(cat=>{
    if(cat==='base_avatar')return def(g,cat);
    const id=sel[cat];return id?asset(g,id):null;
   }).filter(x=>x&&x.src);
  }
  function paintLayer(el,x){
   const sx=(x.atlasW/x.w)*100;
   const px=x.atlasW===x.w?0:(x.x/(x.atlasW-x.w))*100;
   el.style.backgroundImage='url("'+x.src+'")';
   el.style.backgroundSize=sx+'% 100%';
   el.style.backgroundPosition=px+'% 0%';
  }
  function render(){
   const r=root(),c=canvas(),slot=$('.v832u-avatar-slot',c);
   if(!r?.classList?.contains('open')||!c||!slot)return false;
   const g=c.dataset.gender==='male'?'male':'female',parts=resolved(g);
   if(!parts.length)return false;
   const sig=g+'|'+parts.map(x=>x.id+'@'+x.src).join('|');
   if(slot.dataset.hf2ySig===sig&&$('.v832y-stack',slot))return true;
   const stack=document.createElement('div');stack.className='v832y-stack';
   parts.forEach(x=>{const el=document.createElement('span');el.className='v832y-layer layer-'+x.category;paintLayer(el,x);stack.appendChild(el)});
   slot.innerHTML='';slot.appendChild(stack);slot.dataset.hf2ySig=sig;
   document.documentElement.dataset.deenHF2Y='ready';return true;
  }
  function tick(){render()}
  document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v832k-real],#v812Wardrobe [data-v831-asset],#v812Wardrobe [data-v831-gender],#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe]'))[25,80,170,320].forEach(ms=>setTimeout(tick,ms))},true);
  const obs=new MutationObserver(()=>{if(root()?.classList?.contains('open'))queueMicrotask(tick)});
  setTimeout(()=>{const r=root();if(r)obs.observe(r,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})},350);
  setInterval(tick,300);[0,80,220,520,1000,1700].forEach(ms=>setTimeout(tick,ms));
  window.DEEN_HF2Y={version:VERSION,refresh:tick,check:()=>({version:VERSION,gender:canvas()?.dataset?.gender||null,layers:root()?.querySelectorAll?.('.v832y-layer')?.length||0,registryRows:(window.DEEN_AVATAR_ASSET_PACKS?.female||[]).filter(x=>x.src).length,saveLocked:true})};
  window.DEEN_RELEASE_VERSION=VERSION;setTimeout(()=>{document.title='DEEN v8.3.2 HF2Y'},450);
 })();`;
 const tags='<style data-deen-hf2y-css>'+css+'</style><script data-deen-hf2y-runtime>'+runtime+'<\\/script>';
 window.DEEN_PATCH_V832HF2Y=function(html){let out=String(html);if(out.includes('data-deen-hf2y-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
