(()=>{
 if(window.__deenV832HF2DWear)return;window.__deenV832HF2DWear=true;
 const VERSION='8.3.2-HF2D',REV='832hf2d1',SRC=`./assets/visual-runtime/wear_outfits.webp?v=${REV}`;
 const CELL=112,AW=448,AH=224;
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const $$=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
 const delay=ms=>new Promise(r=>setTimeout(r,ms));
 let atlasURL='',atlasInfo=null;
 const DEF=(gender,outfitId,x,y)=>({gender,outfitId,x,y,w:CELL,h:CELL,atlasW:AW,atlasH:AH});
 const WEAR={
  female:{outfit_teal:DEF('female','outfit_teal',0,0),outfit_lavender:DEF('female','outfit_lavender',112,0),outfit_navy:DEF('female','outfit_navy',224,0),outfit_cream:DEF('female','outfit_cream',336,0)},
  male:{outfit_teal:DEF('male','outfit_teal',0,112),outfit_lavender:DEF('male','outfit_lavender',112,112),outfit_navy:DEF('male','outfit_navy',224,112),outfit_cream:DEF('male','outfit_cream',336,112)}
 };
 function spriteStyle(x){
  if(!x||!atlasURL)return '';
  const sx=(x.atlasW/x.w)*100,sy=(x.atlasH/x.h)*100;
  const px=x.atlasW===x.w?0:(x.x/(x.atlasW-x.w))*100;
  const py=x.atlasH===x.h?0:(x.y/(x.atlasH-x.h))*100;
  return `background-image:url('${atlasURL}');background-size:${sx}% ${sy}%;background-position:${px}% ${py}%;background-repeat:no-repeat`;
 }
 async function loadAtlas(){
  const res=await fetch(SRC,{cache:'no-store'});if(!res.ok)throw new Error('wear atlas HTTP '+res.status);
  const u=new Uint8Array(await res.arrayBuffer());
  const four=(a,b,c,d)=>String.fromCharCode(u[a],u[b],u[c],u[d]);
  if(u.length<16||four(0,1,2,3)!=='RIFF'||four(8,9,10,11)!=='WEBP')throw new Error('wear atlas invalid WebP');
  const declared=(u[4]|u[5]<<8|u[6]<<16|u[7]<<24)>>>0,expected=declared+8;
  if(u.length<expected)throw new Error(`wear atlas truncated ${u.length}/${expected}`);
  const clean=u.length===expected?u:u.slice(0,expected);
  const url=URL.createObjectURL(new Blob([clean],{type:'image/webp'}));
  await new Promise((resolve,reject)=>{const im=new Image();im.onload=resolve;im.onerror=()=>reject(new Error('wear atlas decode failed'));im.src=url});
  atlasInfo={received:u.length,expected,trimmed:Math.max(0,u.length-expected)};return url;
 }
 function gender(){
  try{const g=window.DEEN_AVATAR_ASSETS?.state?.()?.gender;if(g==='male'||g==='female')return g}catch(e){}
  const active=$('#v812Wardrobe [data-v831-gender].active')?.dataset?.v831Gender;if(active==='male'||active==='female')return active;
  try{return state?.myWorld?.avatar?.gender==='male'?'male':'female'}catch(e){return 'female'}
 }
 function equipped(){
  try{const id=window.DEEN_WORLD?.snapshot?.()?.equipped?.outfit;if(id)return id}catch(e){}
  try{return state?.myWorld?.equipped?.outfit||'outfit_teal'}catch(e){return 'outfit_teal'}
 }
 function preview(){return $('#v812Wardrobe [data-v831-outfit].active')?.dataset?.v831Outfit||equipped()}
 function asset(g,id){return WEAR[g]?.[id]||WEAR[g]?.outfit_teal||null}
 function decorateCards(){
  const root=$('#v812Wardrobe');if(!root||!atlasURL)return 0;const g=gender();let n=0;
  $$('[data-v831-outfit]',root).forEach(card=>{
   const id=card.dataset.v831Outfit,x=asset(g,id),thumb=$('.v831-thumb',card);if(!x||!thumb)return;
   let el=$('.v832d-real-outfit-thumb',thumb);if(!el){el=document.createElement('span');el.className='v832d-real-outfit-thumb';thumb.appendChild(el)}
   const sig=`${g}|${id}|${REV}`;if(el.dataset.v832d!==sig){el.dataset.v832d=sig;el.style.cssText=spriteStyle(x);n++}
  });return n;
 }
 function applyStack(stack,g,id){
  if(!stack||!atlasURL)return false;const x=asset(g,id);if(!x)return false;
  $$(':scope>.v832-worn-outfit',stack).forEach(el=>el.remove());
  let el=$(':scope>.v832d-worn-outfit',stack);const sig=`${g}|${id}|${REV}`;
  if(!el){el=document.createElement('span');el.className='v831-sprite v832d-worn-outfit';el.setAttribute('aria-hidden','true');const base=$(':scope>.layer-base_avatar',stack);if(base)base.after(el);else stack.prepend(el)}
  if(el.dataset.v832d!==sig){el.dataset.v832d=sig;el.style.cssText=spriteStyle(x)}return true;
 }
 function refresh(){
  if(!atlasURL)return;const root=$('#v812Wardrobe'),g=gender(),eq=equipped();decorateCards();
  const previewStack=$('.v831-preview .v831-stack',root);if(previewStack)applyStack(previewStack,g,preview());
  $$('[data-v831-real-avatar="1"].v831-stack').forEach(stack=>{if(stack!==previewStack)applyStack(stack,g,eq)});
  document.documentElement.dataset.deenWearHF2D='ready';
 }
 async function boot(){
  try{
   atlasURL=await loadAtlas();
   const start=Date.now();while(Date.now()-start<12000){if(window.__deenV831Applied&&$('#v812Wardrobe'))break;await delay(60)}
   if(!window.__deenV831Applied)throw new Error('avatar runtime not ready');
   [0,80,220,600,1400].forEach(ms=>setTimeout(refresh,ms));
   setInterval(()=>{const r=$('#v812Wardrobe');if(r?.classList?.contains('open'))refresh()},350);
   const obs=new MutationObserver(()=>setTimeout(refresh,25));obs.observe(document.documentElement,{subtree:true,childList:true});
   document.addEventListener('click',e=>{if(e.target.closest?.('[data-v831-outfit],[data-v831-gender],[data-v831-save],[data-v812-cancel]'))[20,80,180].forEach(ms=>setTimeout(refresh,ms))},true);
   window.DEEN_REAL_WEAR={version:VERSION,revision:REV,refresh,map:WEAR,atlas:()=>atlasInfo,check:()=>({version:VERSION,revision:REV,atlas:atlasInfo,gender:gender(),equipped:equipped(),preview:preview(),realOutfitThumbs:$$('#v812Wardrobe .v832d-real-outfit-thumb').length,wornStacks:$$('.v832d-worn-outfit').length,wardrobeWorn:!!$('#v812Wardrobe .v831-preview .v832d-worn-outfit')})};
  }catch(err){console.error('DEEN HF2D wear failed',err);document.documentElement.dataset.deenWearHF2D='error';window.DEEN_HF2D_ERROR=String(err?.message||err)}
 }
 boot();
})();
