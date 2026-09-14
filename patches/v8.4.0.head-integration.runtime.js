(()=>{
 if(window.__deenV840HeadIntegration)return;
 window.__deenV840HeadIntegration=true;
 const VERSION='8.4.0-HEAD-INTEGRATION',REV='840head3';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const CELL=224;
 const ASSET_ROOT='./assets/avatar-runtime/v7/';
 const ATLAS_PARTS=[
  'female_hq224_c01.b64',
  'female_hq224_s02a.b64','female_hq224_s02b.b64','female_hq224_s02c.b64','female_hq224_s02d.b64','female_hq224_s02e.b64',
  'female_hq224_c03.b64','female_hq224_c04.b64','female_hq224_c05.b64',
  'female_hq224_s06a.b64','female_hq224_s06b.b64','female_hq224_s06c.b64','female_hq224_s06d.b64'
 ];
 const HOLES=[
  {x:113,y:19,w:21,h:25},{x:99,y:18,w:21,h:26},{x:104,y:18,w:20,h:25},
  {x:102,y:18,w:21,h:25},{x:101,y:20,w:22,h:25},{x:101,y:20,w:22,h:25},
  {x:100,y:19,w:22,h:25},{x:103,y:19,w:21,h:23},{x:103,y:19,w:21,h:25},
  {x:100,y:19,w:21,h:25},{x:96,y:19,w:20,h:24}
 ];
 /* fillX/fillY describe the real hijab opening, not the whole source canvas.
    The visible face is alpha-cropped first, then cover-fitted into this box. */
 const HEAD_FIT={
  female_01:{fillX:1.06,fillY:1.07,dx:0.10,dy:-0.10},
  female_02:{fillX:1.07,fillY:1.08,dx:0.00,dy:-0.15},
  female_03:{fillX:1.07,fillY:1.07,dx:0.05,dy:-0.10},
  female_04:{fillX:1.07,fillY:1.08,dx:0.00,dy:-0.10},
  female_05:{fillX:1.09,fillY:1.09,dx:0.00,dy:-0.20},
  female_06:{fillX:1.09,fillY:1.09,dx:0.05,dy:-0.15},
  female_07:{fillX:1.10,fillY:1.09,dx:0.00,dy:-0.25},
  female_08:{fillX:1.07,fillY:1.07,dx:0.00,dy:-0.10},
  female_09:{fillX:1.09,fillY:1.09,dx:0.00,dy:-0.15},
  female_10:{fillX:1.09,fillY:1.09,dx:0.05,dy:-0.15},
  female_11:{fillX:1.08,fillY:1.08,dx:0.00,dy:-0.15}
 };
 let atlas=null,atlasPromise=null,renderToken=0,lastError=null,lastReadyAt=0,lastSig='',boundRoot=null,observer=null,lastObservedKey='',lastSourceBounds=null;
 function root(){return $('#v812Wardrobe')}
 function croot(){return $('.v832u-canvas',root())}
 function slot(){return $('.v832u-avatar-slot',croot())}
 function faceCanvas(){return $('.v833-face-canvas',slot())}
 function finalCanvas(){return $('.v837-final-canvas',croot())}
 function gender(){return $('.v832k-mannequin',root())?.dataset?.gender==='male'?'male':'female'}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function femaleIndex(id){const m=String(id||'').match(/^female_(\d{2})$/);if(!m)return-1;const n=Number(m[1]);return n>=1&&n<=11?n-1:-1}
 function frame(){return new Promise(ok=>requestAnimationFrame(()=>ok()))}
 async function waitFor(test,my,maxFrames=150){for(let i=0;i<maxFrames;i++){if(my!==renderToken)return false;try{if(test())return true}catch(_){}await frame()}return false}
 async function text(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(url+' HTTP '+r.status);return(await r.text()).replace(/\s+/g,'')}
 function imageFromB64(b64){return new Promise((ok,bad)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>bad(new Error('v8.4.0 female atlas decode failed'));im.src='data:image/webp;base64,'+b64})}
 async function loadAtlas(){
  if(atlas)return atlas;if(atlasPromise)return atlasPromise;
  atlasPromise=(async()=>{const parts=await Promise.all(ATLAS_PARTS.map(n=>text(ASSET_ROOT+n+'?v='+REV)));const b64=parts.join('');if(!b64.startsWith('UklGR'))throw new Error('v8.4.0 female atlas invalid');const im=await imageFromB64(b64);if(im.naturalWidth!==1344||im.naturalHeight!==448)throw new Error(`v8.4.0 atlas dimensions ${im.naturalWidth}x${im.naturalHeight}`);atlas=im;return im})();
  return atlasPromise;
 }
 function faceStateSig(){try{return JSON.stringify(window.DEEN_AVATAR_ASSETS?.state?.()?.selected?.female||{})}catch(_){return '{}'}}
 function v839Ready(id){const ck=window.DEEN_V839_WARDROBE?.check?.();return !!(ck?.ready&&ck?.stage==='ready'&&ck?.active===id&&faceCanvas()&&finalCanvas())}
 function alphaBounds(fc){
  try{
   const g=fc.getContext('2d',{willReadFrequently:true}),W=fc.width,H=fc.height,d=g.getImageData(0,0,W,H).data;
   let minX=W,minY=H,maxX=-1,maxY=-1;
   for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(d[(y*W+x)*4+3]>10){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y}}
   if(maxX<minX||maxY<minY)return{x:0,y:0,w:W,h:H};
   const px=Math.max(2,Math.round((maxX-minX+1)*.02)),py=Math.max(2,Math.round((maxY-minY+1)*.015));
   minX=Math.max(0,minX-px);minY=Math.max(0,minY-py);maxX=Math.min(W-1,maxX+px);maxY=Math.min(H-1,maxY+py);
   return{x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
  }catch(_){return{x:0,y:0,w:fc.width,h:fc.height}}
 }
 function paint(cv,fc,im,id,idx){
  const ctx=cv.getContext('2d',{alpha:true});if(!ctx)return false;
  const S=cv.width,k=S/CELL,h=HOLES[idx],fit=HEAD_FIT[id]||{fillX:1.08,fillY:1.08,dx:0,dy:-.1};
  const src=alphaBounds(fc);lastSourceBounds={...src};
  const targetW=h.w*fit.fillX*k,targetH=h.h*fit.fillY*k;
  const cover=Math.max(targetW/src.w,targetH/src.h);
  const destW=src.w*cover,destH=src.h*cover;
  const cx=(h.x+h.w/2+fit.dx)*k,cy=(h.y+h.h/2+fit.dy)*k;
  const destX=cx-destW/2,destY=cy-destH/2;
  ctx.clearRect(0,0,cv.width,cv.height);
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  /* Safety clip prevents skin from leaking beyond a transparent head edge.
     The actual scarf/hijab atlas is painted afterwards and remains the final mask. */
  ctx.save();
  ctx.beginPath();ctx.ellipse(cx,cy,h.w*.60*k,h.h*.60*k,0,0,Math.PI*2);ctx.clip();
  ctx.globalAlpha=.998;ctx.drawImage(fc,src.x,src.y,src.w,src.h,destX,destY,destW,destH);
  ctx.restore();
  const col=idx<6?idx:idx-6,row=idx<6?0:1;
  ctx.drawImage(im,col*CELL,row*CELL,CELL,CELL,0,0,S,S);
  return true;
 }
 async function render(){
  const r=root();if(!r?.classList?.contains('open'))return false;
  const id=activeId(),g=gender(),idx=femaleIndex(id),my=++renderToken;
  if(g!=='female'||idx<0){const cr=croot();cr?.classList?.remove('v840-ready');cr?.removeAttribute('data-v840id');document.documentElement.dataset.deenV840='male-fallback';return false}
  document.documentElement.dataset.deenV840='waiting-base';
  const [im,ready]=await Promise.all([loadAtlas(),waitFor(()=>v839Ready(id),my)]);
  if(!ready||my!==renderToken||activeId()!==id||gender()!=='female')return false;
  const cv=finalCanvas(),fc=faceCanvas(),cr=croot();if(!cv||!fc||!cr)return false;
  document.documentElement.dataset.deenV840='composing';
  if(!paint(cv,fc,im,id,idx)){lastError='2d context unavailable';document.documentElement.dataset.deenV840='error';return false}
  if(my!==renderToken||activeId()!==id)return false;
  cr.classList.add('v840-ready');cr.dataset.v840id=id;
  lastSig=id+'|'+faceStateSig();lastReadyAt=Date.now();lastError=null;
  document.documentElement.dataset.deenV840='ready';
  return true;
 }
 function refresh(){render().catch(err=>{lastError=String(err?.message||err);window.DEEN_V840_ERROR=lastError;document.documentElement.dataset.deenV840='error';console.error('DEEN v8.4.0 head integration:',err)});return true}
 function observeCanvas(){
  const cr=croot();if(!cr||cr===boundRoot)return false;
  observer?.disconnect?.();boundRoot=cr;lastObservedKey='';
  observer=new MutationObserver(()=>{const live=croot();if(!live)return;const key=`${live.dataset.v839id||''}|${live.dataset.v837id||''}|${live.classList.contains('v839-ready')?'1':'0'}|${activeId()||''}`;if(key===lastObservedKey)return;lastObservedKey=key;if(live.classList.contains('v839-ready'))queueMicrotask(refresh)});
  observer.observe(cr,{attributes:true,attributeFilter:['class','data-v839id','data-v837id']});
  return true;
 }
 function bind(){observeCanvas();if(root()?.classList?.contains('open'))refresh();if(!boundRoot)requestAnimationFrame(bind)}
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v832k-real],#v812Wardrobe [data-v831-asset],#v812Wardrobe [data-v831-gender],#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe]'))queueMicrotask(()=>{observeCanvas();refresh()})},true);
 document.addEventListener('keydown',e=>{if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&root()?.classList?.contains('open'))queueMicrotask(refresh)},true);
 requestAnimationFrame(bind);
 window.DEEN_V840_HEAD={version:VERSION,revision:REV,refresh,compose:refresh,fit:id=>HEAD_FIT[id]||null,check:()=>({version:VERSION,revision:REV,active:activeId(),gender:gender(),ready:!!croot()?.classList?.contains('v840-ready')&&croot()?.dataset?.v840id===activeId(),faceCanvas:!!faceCanvas(),finalCanvas:!!finalCanvas(),atlasLoaded:!!atlas,sourceBounds:lastSourceBounds,signature:lastSig,readyAt:lastReadyAt,error:lastError})};
 window.DEEN_RELEASE_VERSION=VERSION;window.DEEN_RENDER_ARBITRATION='V840_HEAD_ALPHA_CROP_COMPOSITE';
})();