(()=>{
 if(window.__deenV838FaceSync)return;
 window.__deenV838FaceSync=true;
 const VERSION='8.3.8-FACE-SYNC',REV='838sync1';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const CELL=224;
 const HOLES=[
  {x:113,y:19,w:21,h:25},{x:99,y:18,w:21,h:26},{x:104,y:18,w:20,h:25},
  {x:102,y:18,w:21,h:25},{x:101,y:20,w:22,h:25},{x:101,y:20,w:22,h:25},
  {x:100,y:19,w:22,h:25},{x:103,y:19,w:21,h:23},{x:103,y:19,w:21,h:25},
  {x:100,y:19,w:21,h:25},{x:96,y:19,w:20,h:24}
 ];
 let raf=0,lastError=null,lastSig='';
 function root(){return $('#v812Wardrobe')}
 function croot(){return $('.v832u-canvas',root())}
 function gender(){return $('.v832k-mannequin',root())?.dataset?.gender==='male'?'male':'female'}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function femaleIndex(id){const m=String(id||'').match(/^female_(\d{2})$/);if(!m)return-1;const n=Number(m[1]);return n>=1&&n<=11?n-1:-1}
 function clearStaticFace(){
  const r=root(),cr=croot();if(!r?.classList?.contains('open')||!cr||gender()!=='female')return false;
  const idx=femaleIndex(activeId()),cv=$('.v837-final-canvas',cr);if(idx<0||!cv)return false;
  const ctx=cv.getContext?.('2d');if(!ctx)return false;
  const h=HOLES[idx],kx=cv.width/CELL,ky=cv.height/CELL;
  ctx.clearRect(h.x*kx,h.y*ky,h.w*kx,h.h*ky);
  cr.classList.add('v838-face-sync');cr.dataset.v838id=activeId()||'';
  return true;
 }
 function sync(){
  try{
   if(gender()!=='female'){croot()?.classList?.remove('v838-face-sync');return false}
   window.DEEN_V833_FACE_ENGINE?.refresh?.();
   const ok=clearStaticFace();
   const st=window.DEEN_AVATAR_ASSETS?.state?.();
   lastSig=(activeId()||'')+'|'+JSON.stringify(st?.selected?.female||{});
   lastError=null;document.documentElement.dataset.deenV838=ok?'ready':'waiting';return ok;
  }catch(err){lastError=String(err?.message||err);window.DEEN_V838_ERROR=lastError;console.error('DEEN v8.3.8 face sync:',err);return false}
 }
 function schedule(delay=0){
  if(delay){setTimeout(()=>schedule(0),delay);return}
  if(raf)return;raf=requestAnimationFrame(()=>{raf=0;sync()});
 }
 document.addEventListener('click',e=>{
  if(e.target.closest?.('#v812Wardrobe [data-v831-asset],#v812Wardrobe [data-v831-gender],#v812Wardrobe [data-v832k-real],#v812Wardrobe .v832k-card,[data-v810-open-wardrobe]')){
   [0,40,100,190].forEach(schedule);
  }
 },true);
 const obs=new MutationObserver(()=>{if(root()?.classList?.contains('open'))schedule(0)});
 setTimeout(()=>{const r=root();if(r)obs.observe(r,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-v837id','data-gender']})},300);
 [0,160,420,900,1600].forEach(schedule);
 window.DEEN_V838_FACE_SYNC={version:VERSION,revision:REV,refresh:()=>{window.DEEN_V833_FACE_ENGINE?.refresh?.();[0,50,140].forEach(schedule)},check:()=>({version:VERSION,revision:REV,gender:gender(),active:activeId(),ready:!!croot()?.classList?.contains('v838-face-sync'),faceCanvas:!!$('.v833-face-canvas',croot()),outfitCanvas:!!$('.v837-final-canvas',croot()),signature:lastSig,error:lastError})};
 window.DEEN_RELEASE_VERSION=VERSION;window.DEEN_RENDER_ARBITRATION='V838_OUTFIT_PLUS_STATE_FACE';
})();
