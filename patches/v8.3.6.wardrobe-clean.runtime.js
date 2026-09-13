(()=>{
 if(window.__deenV836Wardrobe)return;window.__deenV836Wardrobe=true;
 const VERSION='8.3.6-WARDROBE-CLEAN',REV='836clean1';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const OUTFIT_PATH='./assets/avatar-runtime/v4/';
 const OUTFIT_FILES=['female_outfits_240_q70_c01.b64','female_outfits_240_q70_c02.b64','female_outfits_240_q70_c03.b64'];
 const FACE_FILE='./assets/avatar-runtime/v6/female_default_face_128.b64';
 const ITEMS=[
  {x:4,y:18,w:128,h:355,hole:{x:62,y:23,w:36,h:44}},
  {x:132,y:17,w:109,h:358,hole:{x:41,y:23,w:36,h:44}},
  {x:241,y:17,w:107,h:359,hole:{x:39,y:23,w:36,h:44}},
  {x:348,y:16,w:111,h:358,hole:{x:38,y:23,w:36,h:43}},
  {x:459,y:17,w:109,h:353,hole:{x:38,y:25,w:36,h:43}},
  {x:568,y:16,w:119,h:362,hole:{x:43,y:26,w:38,h:44}},
  {x:687,y:17,w:111,h:359,hole:{x:39,y:24,w:37,h:44}},
  {x:798,y:16,w:109,h:361,hole:{x:38,y:26,w:37,h:40}},
  {x:907,y:16,w:109,h:361,hole:{x:38,y:25,w:36,h:43}},
  {x:1016,y:16,w:110,h:361,hole:{x:36,y:25,w:38,h:44}},
  {x:1126,y:16,w:126,h:359,hole:{x:37,y:24,w:35,h:42}}
 ];
 const CACHE={outfit:null,face:null};let outfitPromise=null,facePromise=null,raf=0,token=0;
 function root(){return $('#v812Wardrobe')}
 function croot(){return $('.v832u-canvas',root())}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function femaleIndex(id){const m=String(id||'').match(/^female_(\d{2})$/);return m?Math.max(0,Math.min(10,Number(m[1])-1)):-1}
 async function text(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(url+' HTTP '+r.status);return (await r.text()).replace(/\s+/g,'')}
 function asImage(b64,label){if(!b64.startsWith('UklGR'))throw new Error(label+' invalid WebP');return new Promise((ok,bad)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>bad(new Error(label+' decode'));im.src='data:image/webp;base64,'+b64})}
 async function loadOutfit(){if(CACHE.outfit)return CACHE.outfit;if(outfitPromise)return outfitPromise;outfitPromise=(async()=>{const parts=await Promise.all(OUTFIT_FILES.map(n=>text(OUTFIT_PATH+n+'?v='+REV)));CACHE.outfit=await asImage(parts.join(''),'female outfit HQ');return CACHE.outfit})();return outfitPromise}
 async function loadFace(){if(CACHE.face)return CACHE.face;if(facePromise)return facePromise;facePromise=(async()=>{CACHE.face=await asImage(await text(FACE_FILE+'?v='+REV),'female face');return CACHE.face})();return facePromise}
 function ensureCanvas(cr){let cv=$('.v836-final-canvas',cr);if(!cv){cv=document.createElement('canvas');cv.className='v836-final-canvas';cv.width=720;cv.height=720;cr.appendChild(cv)}return cv}
 function drawFemale(cv,outfit,face,idx){
   const c=cv.getContext('2d'),S=cv.width,it=ITEMS[idx],h=it.hole;
   c.clearRect(0,0,S,S);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
   const refW=1254,refH=384,rx=outfit.naturalWidth/refW,ry=outfit.naturalHeight/refH;
   const targetH=S*.92,scale=targetH/it.h,ow=it.w*scale,ox=S/2-ow/2,oy=S*.985-targetH;
   c.drawImage(outfit,it.x*rx,it.y*ry,it.w*rx,it.h*ry,ox,oy,ow,targetH);
   const hx=ox+h.x*scale,hy=oy+h.y*scale,hw=h.w*scale,hh=h.h*scale,cx=hx+hw/2,cy=hy+hh/2;
   const headW=hw*1.62,headH=headW*(face.naturalHeight/face.naturalWidth),fx=cx-headW/2,fy=cy-headH*.49;
   c.save();c.beginPath();c.ellipse(cx,cy,hw*.49,hh*.51,0,0,Math.PI*2);c.clip();c.drawImage(face,fx,fy,headW,headH);c.restore();
 }
 async function render(){
   const r=root();if(!r?.classList?.contains('open'))return false;
   window.DEEN_HF2U?.refresh?.();
   const cr=croot(),id=activeId(),idx=femaleIndex(id);if(!cr||!id)return false;
   if(idx<0){cr.classList.remove('v836-ready');$('.v836-final-canvas',cr)?.remove?.();document.documentElement.dataset.deenV836='male-fallback';return false}
   const my=++token;
   try{
     const [outfit,face]=await Promise.all([loadOutfit(),loadFace()]);if(my!==token)return false;
     const cv=ensureCanvas(cr);drawFemale(cv,outfit,face,idx);
     cr.dataset.gender='female';cr.dataset.v836id=id;cr.classList.add('v836-ready');
     document.documentElement.dataset.deenV836='ready';window.DEEN_V836_ERROR=null;return true;
   }catch(err){console.error('v8.3.6 wardrobe',err);cr.classList.remove('v836-ready');window.DEEN_V836_ERROR=String(err?.message||err);document.documentElement.dataset.deenV836='error';return false}
 }
 function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;render()})}
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],#v812Wardrobe [data-v831-gender],[data-v810-open-wardrobe]')){schedule();setTimeout(schedule,70);setTimeout(schedule,180)}},true);
 [0,180,550].forEach(ms=>setTimeout(schedule,ms));
 window.DEEN_V836_WARDROBE={version:VERSION,revision:REV,refresh:schedule,check:()=>({version:VERSION,active:activeId(),canvas:!!$('.v836-final-canvas',croot()),ready:croot()?.classList?.contains('v836-ready')||false,eventDriven:true,legacyIntervals:false,error:window.DEEN_V836_ERROR||null,saveLocked:true})};
 window.DEEN_RELEASE_VERSION=VERSION;
})();