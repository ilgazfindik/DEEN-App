(()=>{
 if(window.__deenV839WardrobeFaceStability)return;
 window.__deenV839WardrobeFaceStability=true;
 window.DEEN_V839_ACTIVE=true;
 const VERSION='8.3.9-WARDROBE-FACE-STABILITY',REV='839stable1';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const CELL=224;
 const HOLES=[
  {x:113,y:19,w:21,h:25},{x:99,y:18,w:21,h:26},{x:104,y:18,w:20,h:25},
  {x:102,y:18,w:21,h:25},{x:101,y:20,w:22,h:25},{x:101,y:20,w:22,h:25},
  {x:100,y:19,w:22,h:25},{x:103,y:19,w:21,h:23},{x:103,y:19,w:21,h:25},
  {x:100,y:19,w:21,h:25},{x:96,y:19,w:20,h:24}
 ];
 let renderToken=0,lastError=null,lastStage='idle',lastSig='',lastReadyAt=0;
 function root(){return $('#v812Wardrobe')}
 function croot(){return $('.v832u-canvas',root())}
 function slot(){return $('.v832u-avatar-slot',croot())}
 function faceCanvas(){return $('.v833-face-canvas',slot())}
 function outfitCanvas(){return $('.v837-final-canvas',croot())}
 function gender(){return $('.v832k-mannequin',root())?.dataset?.gender==='male'?'male':'female'}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function femaleIndex(id){const m=String(id||'').match(/^female_(\d{2})$/);if(!m)return-1;const n=Number(m[1]);return n>=1&&n<=11?n-1:-1}
 function frame(){return new Promise(ok=>requestAnimationFrame(()=>ok()))}
 async function waitFor(test,my,maxFrames=120){for(let i=0;i<maxFrames;i++){if(my!==renderToken)return false;try{if(test())return true}catch(_){}await frame()}return false}
 function resetClasses(cr){if(!cr)return;cr.classList.remove('v839-ready','v839-waiting-face');cr.removeAttribute('data-v839id')}
 function faceState(){try{return window.DEEN_AVATAR_ASSETS?.state?.()?.selected?.female||{}}catch(_){return {}}}
 function faceSigReady(id){const s=slot(),fc=faceCanvas();return !!(s&&fc&&String(s.dataset.v833feSig||'').startsWith(`female|${id}|`))}
 function outfitReady(id){const cr=croot(),ck=window.DEEN_V837_WARDROBE?.check?.();return !!(cr&&outfitCanvas()&&cr.classList.contains('v837-ready')&&cr.dataset.v837id===id&&ck?.ready&&ck?.active===id)}
 function clearStaticFace(id){const cr=croot(),fc=faceCanvas(),cv=outfitCanvas(),idx=femaleIndex(id);if(!cr||!fc||!cv||idx<0||activeId()!==id||gender()!=='female')return false;const ctx=cv.getContext?.('2d');if(!ctx)return false;const h=HOLES[idx],kx=cv.width/CELL,ky=cv.height/CELL;ctx.clearRect(h.x*kx,h.y*ky,h.w*kx,h.h*ky);cr.classList.remove('v839-waiting-face');cr.classList.add('v839-ready');cr.dataset.v839id=id;return true}
 async function render(){
  const r=root();if(!r?.classList?.contains('open'))return false;
  const my=++renderToken,g=gender(),id=activeId();
  if(!id)return false;
  if(g!=='female'){resetClasses(croot());lastStage='male-fallback';document.documentElement.dataset.deenV839='male-fallback';return false}
  lastStage='outfit';document.documentElement.dataset.deenV839='outfit';
  window.DEEN_HF2U?.refresh?.();
  window.DEEN_V837_WARDROBE?.refresh?.();
  const haveOutfit=await waitFor(()=>outfitReady(id),my);
  if(!haveOutfit){if(my===renderToken){lastStage='outfit-timeout';lastError=`outfit not ready: ${id}`;document.documentElement.dataset.deenV839='outfit-timeout'}return false}
  if(my!==renderToken||activeId()!==id)return false;
  const cr=croot();cr?.classList?.remove('v839-ready');cr?.classList?.add('v839-waiting-face');
  lastStage='face';document.documentElement.dataset.deenV839='face';
  window.DEEN_V833_FACE_ENGINE?.refresh?.();
  const haveFace=await waitFor(()=>faceSigReady(id),my);
  if(!haveFace){if(my===renderToken){lastStage='waiting-face';lastError=`face not ready: ${id}`;document.documentElement.dataset.deenV839='waiting-face'}return false}
  if(my!==renderToken||activeId()!==id||gender()!=='female')return false;
  lastStage='compose';document.documentElement.dataset.deenV839='compose';
  const ok=clearStaticFace(id);
  if(!ok){lastStage='compose-failed';lastError=`compose failed: ${id}`;document.documentElement.dataset.deenV839='compose-failed';return false}
  lastSig=id+'|'+JSON.stringify(faceState());lastError=null;lastStage='ready';lastReadyAt=Date.now();document.documentElement.dataset.deenV839='ready';
  return true;
 }
 function refresh(){render().catch(err=>{lastError=String(err?.message||err);lastStage='error';window.DEEN_V839_ERROR=lastError;document.documentElement.dataset.deenV839='error';console.error('DEEN v8.3.9 wardrobe pipeline:',err)});return true}
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v831-asset],#v812Wardrobe [data-v812-avatar],#v812Wardrobe [data-v831-gender],#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe]'))queueMicrotask(refresh)},true);
 document.addEventListener('keydown',e=>{if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&root()?.classList?.contains('open'))queueMicrotask(refresh)},true);
 requestAnimationFrame(()=>{if(root()?.classList?.contains('open'))refresh()});
 window.DEEN_V839_WARDROBE={version:VERSION,revision:REV,refresh,check:()=>({version:VERSION,revision:REV,active:activeId(),gender:gender(),stage:lastStage,ready:!!croot()?.classList?.contains('v839-ready')&&!!faceCanvas()&&!!outfitCanvas(),outfitReady:outfitReady(activeId()),faceReady:faceSigReady(activeId()),outfitCanvas:!!outfitCanvas(),faceCanvas:!!faceCanvas(),signature:lastSig,readyAt:lastReadyAt,error:lastError})};
 window.DEEN_RELEASE_VERSION=VERSION;window.DEEN_RENDER_ARBITRATION='V839_DETERMINISTIC_WARDROBE_FACE';
})();