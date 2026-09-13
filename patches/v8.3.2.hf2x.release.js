(()=>{
 const VERSION='8.3.2-HF2X',REV='832hf2x1';
 const css=`
/* DEEN v8.3.2 HF2X — safe row-sliced avatar face/head renderer */
#v812Wardrobe .v832u-avatar-slot>.v831-stack{display:none!important}
#v812Wardrobe .v832x-stack{position:absolute!important;left:50%!important;transform:translateX(-50%)!important;overflow:visible!important;pointer-events:none!important}
#v812Wardrobe .v832x-layer{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;background-repeat:no-repeat!important;pointer-events:none!important}
#v812Wardrobe .v832u-canvas[data-gender="female"] .v832u-avatar-slot{z-index:7!important;overflow:hidden!important;border-radius:50%!important;clip-path:ellipse(42% 46% at 50% 49%)!important;-webkit-clip-path:ellipse(42% 46% at 50% 49%)!important}
#v812Wardrobe .v832u-canvas[data-gender="female"] .v832x-stack{top:-39%!important;width:218%!important;height:218%!important}
#v812Wardrobe .v832u-canvas[data-gender="male"] .v832u-avatar-slot{z-index:7!important}
#v812Wardrobe .v832u-canvas[data-gender="male"] .v832x-stack{top:-7%!important;width:112%!important;height:112%!important}
`;
 const runtime=`(()=>{
  if(window.__deenV832HF2X)return;window.__deenV832HF2X=true;
  const VERSION='8.3.2-HF2X',REV='832hf2x1';
  const $=(s,r=document)=>r?.querySelector?.(s)||null;
  const ROW_CACHE=new Map(),ROW_PENDING=new Map();
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
   }).filter(Boolean);
  }
  async function rowUrl(g,row){
   const key=g+':'+row;if(ROW_CACHE.has(key))return ROW_CACHE.get(key);if(ROW_PENDING.has(key))return ROW_PENDING.get(key);
   const p=(async()=>{const r=await fetch('./assets/avatar-runtime/hf2/rows/'+g+'_r'+row+'.b64?v='+REV,{cache:'no-store'});if(!r.ok)throw new Error(g+'_r'+row+' HTTP '+r.status);const b=(await r.text()).replace(/\\s+/g,'');if(!b.startsWith('UklGR'))throw new Error(g+'_r'+row+' invalid');const u='data:image/webp;base64,'+b;ROW_CACHE.set(key,u);ROW_PENDING.delete(key);return u})().catch(err=>{ROW_PENDING.delete(key);throw err});ROW_PENDING.set(key,p);return p;
  }
  function paintLayer(el,x,url){
   const sx=(x.atlasW/x.w)*100,px=x.atlasW===x.w?0:(x.x/(x.atlasW-x.w))*100;
   el.style.backgroundImage='url("'+url+'")';el.style.backgroundSize=sx+'% 100%';el.style.backgroundPosition=px+'% 0%';
  }
  async function render(){
   const r=root(),c=canvas(),slot=$('.v832u-avatar-slot',c);if(!r?.classList?.contains('open')||!c||!slot)return false;
   const g=c.dataset.gender==='male'?'male':'female',parts=resolved(g);if(!parts.length)return false;
   const sig=g+'|'+parts.map(x=>x.id).join('|');
   if(slot.dataset.hf2xSig===sig&&$('.v832x-stack',slot))return true;
   const token=(Number(slot.dataset.hf2xToken)||0)+1;slot.dataset.hf2xToken=String(token);
   try{
    const urls=await Promise.all(parts.map(x=>rowUrl(g,Math.floor(x.y/x.h))));if(String(token)!==slot.dataset.hf2xToken)return false;
    const stack=document.createElement('div');stack.className='v832x-stack';
    parts.forEach((x,i)=>{const el=document.createElement('span');el.className='v832x-layer layer-'+x.category;paintLayer(el,x,urls[i]);stack.appendChild(el)});
    slot.innerHTML='';slot.appendChild(stack);slot.dataset.hf2xSig=sig;document.documentElement.dataset.deenHF2X='ready';return true;
   }catch(err){console.error('HF2X safe face',err);window.DEEN_HF2X_ERROR=String(err?.message||err);return false}
  }
  function tick(){render()}
  document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v832k-real],#v812Wardrobe [data-v831-asset],#v812Wardrobe [data-v831-gender],#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe]'))[25,80,170,320].forEach(ms=>setTimeout(tick,ms))},true);
  const obs=new MutationObserver(()=>{if(root()?.classList?.contains('open'))queueMicrotask(tick)});setTimeout(()=>{const r=root();if(r)obs.observe(r,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})},350);
  setInterval(tick,160);[0,80,220,520,1000,1700].forEach(ms=>setTimeout(tick,ms));
  window.DEEN_HF2X={version:VERSION,refresh:tick,check:()=>({version:VERSION,gender:canvas()?.dataset?.gender||null,safeStack:!!$('.v832x-stack',root()),layers:root()?.querySelectorAll?.('.v832x-layer')?.length||0,saveLocked:true,error:window.DEEN_HF2X_ERROR||null})};
  window.DEEN_RELEASE_VERSION=VERSION;setTimeout(()=>{document.title='DEEN v8.3.2 HF2X'},450);
 })();`;
 const tags='<style data-deen-hf2x-css>'+css+'</style><script data-deen-hf2x-runtime>'+runtime+'<\\/script>';
 window.DEEN_PATCH_V832HF2X=function(html){let out=String(html);if(out.includes('data-deen-hf2x-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
