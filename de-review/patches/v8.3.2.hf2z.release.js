(()=>{
 const VERSION='8.3.2-HF2Z',REV='832hf2z1';
 const css=`
/* DEEN v8.3.2 HF2Z — deterministic canvas-composited female face */
#v812Wardrobe .v832u-canvas[data-gender="female"] .v832u-avatar-slot>.v831-stack,
#v812Wardrobe .v832u-canvas[data-gender="female"] .v832u-avatar-slot>.v832x-stack,
#v812Wardrobe .v832u-canvas[data-gender="female"] .v832u-avatar-slot>.v832y-stack{display:none!important}
#v812Wardrobe .v832u-canvas[data-gender="female"] .v832u-avatar-slot{z-index:8!important;overflow:hidden!important;border-radius:48% 48% 46% 46%!important;clip-path:ellipse(47% 49% at 50% 50%)!important;-webkit-clip-path:ellipse(47% 49% at 50% 50%)!important}
#v812Wardrobe .v832z-face-canvas{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;pointer-events:none!important}
`;
 const runtime=`(()=>{
  if(window.__deenV832HF2Z)return;window.__deenV832HF2Z=true;
  const VERSION='8.3.2-HF2Z';
  const $=(s,r=document)=>r?.querySelector?.(s)||null;
  const IMG=new Map();
  const CORE=['base_avatar','eyes','noses','mouths','blush'];
  function root(){return $('#v812Wardrobe')}
  function canvasRoot(){return $('.v832u-canvas',root())}
  function state(){try{return window.DEEN_AVATAR_ASSETS?.state?.()||null}catch(_){return null}}
  function reg(){return window.DEEN_AVATAR_ASSET_PACKS?.female||[]}
  function items(cat){return reg().filter(x=>x.category===cat)}
  function def(cat){const a=items(cat);return a.find(x=>x.default)||a[0]||null}
  function byId(id){return id?reg().find(x=>x.id===id)||null:null}
  function selected(){
   const sel=state()?.selected?.female||{};
   const out=[];
   for(const cat of CORE){const x=byId(sel[cat])||def(cat);if(x?.src)out.push(x)}
   const glasses=byId(sel.glasses);if(glasses?.src)out.push(glasses);
   return out;
  }
  function load(src){
   if(IMG.has(src))return IMG.get(src);
   const p=new Promise((ok,bad)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>bad(new Error('image decode failed'));im.src=src});
   IMG.set(src,p);return p;
  }
  async function render(){
   const r=root(),c=canvasRoot(),slot=$('.v832u-avatar-slot',c);
   if(!r?.classList?.contains('open')||!c||!slot||c.dataset.gender!=='female')return false;
   const parts=selected();if(!parts.length)return false;
   const sig=parts.map(x=>x.id+'@'+x.src).join('|');
   if(slot.dataset.hf2zSig===sig&&$('.v832z-face-canvas',slot))return true;
   const token=(Number(slot.dataset.hf2zToken)||0)+1;slot.dataset.hf2zToken=String(token);
   try{
    const imgs=await Promise.all(parts.map(x=>load(x.src)));if(String(token)!==slot.dataset.hf2zToken)return false;
    const srcCanvas=document.createElement('canvas');srcCanvas.width=112;srcCanvas.height=112;
    const sx=srcCanvas.getContext('2d');sx.clearRect(0,0,112,112);sx.imageSmoothingEnabled=true;sx.imageSmoothingQuality='high';
    parts.forEach((x,i)=>sx.drawImage(imgs[i],x.x,0,x.w,x.h,0,0,112,112));
    const out=document.createElement('canvas');out.className='v832z-face-canvas';out.width=176;out.height=200;
    const ox=out.getContext('2d');ox.clearRect(0,0,out.width,out.height);ox.imageSmoothingEnabled=true;ox.imageSmoothingQuality='high';
    /* Verified against the original 512x512 avatar reference: head/face occupies x≈31–69%, y≈13–56%. */
    ox.drawImage(srcCanvas,35,14,42,48,0,0,out.width,out.height);
    slot.innerHTML='';slot.appendChild(out);slot.dataset.hf2zSig=sig;
    document.documentElement.dataset.deenHF2Z='ready';window.DEEN_HF2Z_ERROR=null;return true;
   }catch(err){console.error('HF2Z face canvas',err);window.DEEN_HF2Z_ERROR=String(err?.message||err);return false}
  }
  function tick(){render()}
  document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v832k-real],#v812Wardrobe [data-v831-asset],#v812Wardrobe [data-v831-gender],[data-v810-open-wardrobe]'))[20,70,150,300].forEach(ms=>setTimeout(tick,ms))},true);
  const obs=new MutationObserver(()=>{if(root()?.classList?.contains('open'))queueMicrotask(tick)});setTimeout(()=>{const r=root();if(r)obs.observe(r,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})},350);
  setInterval(tick,350);[0,80,220,520,1000,1700].forEach(ms=>setTimeout(tick,ms));
  window.DEEN_HF2Z={version:VERSION,refresh:tick,check:()=>({version:VERSION,gender:canvasRoot()?.dataset?.gender||null,faceCanvas:!!$('.v832z-face-canvas',root()),parts:selected().map(x=>x.id),saveLocked:true,error:window.DEEN_HF2Z_ERROR||null})};
  window.DEEN_RELEASE_VERSION=VERSION;setTimeout(()=>{document.title='DEEN v8.3.2 HF2Z'},450);
 })();`;
 const tags='<style data-deen-hf2z-css>'+css+'</style><script data-deen-hf2z-runtime>'+runtime+'<\\/script>';
 window.DEEN_PATCH_V832HF2Z=function(html){let out=String(html);if(out.includes('data-deen-hf2z-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
