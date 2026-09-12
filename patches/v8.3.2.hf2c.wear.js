(()=>{
 if(window.__deenV832HF2CWear)return;window.__deenV832HF2CWear=true;
 const VERSION='8.3.2-HF2C',REV='832hf2c1',SRC=`./assets/visual-runtime/wear_outfits.webp?v=${REV}`;
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const CELL=112,AW=448,AH=224;
 const DEF=(gender,outfitId,x,y)=>({gender,outfitId,src:SRC,x,y,w:CELL,h:CELL,atlasW:AW,atlasH:AH});
 const WEAR={
  female:{outfit_teal:DEF('female','outfit_teal',0,0),outfit_lavender:DEF('female','outfit_lavender',112,0),outfit_navy:DEF('female','outfit_navy',224,0),outfit_cream:DEF('female','outfit_cream',336,0)},
  male:{outfit_teal:DEF('male','outfit_teal',0,112),outfit_lavender:DEF('male','outfit_lavender',112,112),outfit_navy:DEF('male','outfit_navy',224,112),outfit_cream:DEF('male','outfit_cream',336,112)}
 };
 function spriteStyle(x){
  if(!x)return '';
  const sx=(x.atlasW/x.w)*100,sy=(x.atlasH/x.h)*100;
  const px=x.atlasW===x.w?0:(x.x/(x.atlasW-x.w))*100;
  const py=x.atlasH===x.h?0:(x.y/(x.atlasH-x.h))*100;
  return `background-image:url('${x.src}');background-size:${sx}% ${sy}%;background-position:${px}% ${py}%;background-repeat:no-repeat`;
 }
 function gender(){try{return window.DEEN_AVATAR_ASSETS?.state?.().gender==='male'?'male':'female'}catch(e){try{return state?.myWorld?.avatar?.gender==='male'?'male':'female'}catch(_){return 'female'}}}
 function equipped(){try{return window.DEEN_WORLD?.snapshot?.().equipped?.outfit||state?.myWorld?.equipped?.outfit||'outfit_teal'}catch(e){return 'outfit_teal'}}
 function preview(){const root=$('#v812Wardrobe');return root?.querySelector('[data-v831-outfit].active')?.dataset.v831Outfit||equipped()}
 function wearAsset(g,id){return WEAR[g]?.[id]||WEAR[g]?.outfit_teal||null}
 function applyStack(stack,g,id){
  if(!stack)return false;const x=wearAsset(g,id);if(!x)return false;
  const sig=`${g}|${id}`;let el=$(':scope>.v832-worn-outfit',stack);
  if(el?.dataset.v832Wear===sig)return false;
  el?.remove();el=document.createElement('span');el.className='v831-sprite v832-worn-outfit';el.dataset.v832Wear=sig;el.setAttribute('aria-hidden','true');el.style.cssText=spriteStyle(x);
  const base=$(':scope>.layer-base_avatar',stack);if(base)base.after(el);else stack.prepend(el);return true;
 }
 function decorateCards(){
  const g=gender(),root=$('#v812Wardrobe');if(!root)return 0;let n=0;
  $$('[data-v831-outfit]',root).forEach(card=>{
   const id=card.dataset.v831Outfit,x=wearAsset(g,id),thumb=$('.v831-thumb',card);if(!x||!thumb)return;
   let real=$('.v832-real-outfit-thumb',thumb);
   const sig=`${g}|${id}`;
   if(!real){thumb.innerHTML='';real=document.createElement('span');real.className='v832-real-outfit-thumb';thumb.appendChild(real)}
   if(real.dataset.v832Thumb!==sig){real.dataset.v832Thumb=sig;real.style.cssText=spriteStyle(x);n++}
  });
  return n;
 }
 function refresh(){
  const g=gender(),eq=equipped(),root=$('#v812Wardrobe'),previewStack=root?.querySelector('.v831-preview .v831-stack');
  decorateCards();
  if(previewStack)applyStack(previewStack,g,preview());
  $$('.v831-stack[data-v831-real-avatar="1"], [data-v831-real-avatar="1"].v831-stack').forEach(stack=>{if(stack!==previewStack)applyStack(stack,g,eq)});
 }
 let timer=0;function schedule(ms=28){clearTimeout(timer);timer=setTimeout(refresh,ms)}
 const obs=new MutationObserver(()=>schedule());obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
 document.addEventListener('click',e=>{if(e.target.closest?.('[data-v831-outfit],[data-v831-gender],[data-v831-save],[data-v812-cancel]'))schedule(45)},true);
 [0,120,420,1000,2200].forEach(ms=>setTimeout(refresh,ms));
 window.DEEN_REAL_WEAR={version:VERSION,revision:REV,refresh,map:WEAR,check:()=>({version:VERSION,revision:REV,gender:gender(),equipped:equipped(),preview:preview(),wornStacks:$$('.v832-worn-outfit').length,realOutfitThumbs:$$('#v812Wardrobe .v832-real-outfit-thumb').length,wardrobeWorn:!!$('#v812Wardrobe .v831-preview .v832-worn-outfit')})};
})();
