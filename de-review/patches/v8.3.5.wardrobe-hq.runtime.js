(()=>{
 if(window.__deenV835WardrobeHQ)return;window.__deenV835WardrobeHQ=true;
 const VERSION='8.3.5-WARDROBE-HQ',REV='835hq1';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
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
 let faceImg=null,facePromise=null,raf=0;
 function root(){return $('#v812Wardrobe')}
 function croot(){return $('.v832u-canvas',root())}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function femaleIndex(id){const m=String(id||'').match(/^female_(\d{2})$/);return m?Math.max(0,Math.min(10,Number(m[1])-1)):-1}
 async function loadFace(){
   if(faceImg)return faceImg;if(facePromise)return facePromise;
   facePromise=(async()=>{
     const r=await fetch('./patches/v8.3.4.hq-composite.runtime.js?v=834hq5',{cache:'no-store'});if(!r.ok)throw new Error('HQ5 runtime '+r.status);
     const txt=await r.text(),m=txt.match(/const FACE_B64='([^']+)'/);if(!m)throw new Error('embedded face not found');
     return await new Promise((ok,bad)=>{const im=new Image();im.onload=()=>{faceImg=im;ok(im)};im.onerror=()=>bad(new Error('embedded face decode'));im.src='data:image/webp;base64,'+m[1]});
   })();return facePromise;
 }
 function ensureOverlay(cr){let cv=$('.v835-face-overlay',cr);if(!cv){cv=document.createElement('canvas');cv.className='v835-face-overlay';cv.width=720;cv.height=720;cr.appendChild(cv)}return cv}
 async function render(){
   const r=root(),cr=croot(),id=activeId(),idx=femaleIndex(id);if(!r?.classList?.contains('open')||!cr)return false;
   if(idx<0){$('.v835-face-overlay',cr)?.remove?.();cr.classList.remove('v835-face-ready');return false}
   try{window.DEEN_V834_HQ_COMPOSITE?.refresh?.()}catch(_){ }
   const base=$('.v834-composite-canvas',cr);if(!base||!cr.classList.contains('v834-hq-ready')){setTimeout(schedule,100);return false}
   try{
     const im=await loadFace(),cv=ensureOverlay(cr),c=cv.getContext('2d'),S=cv.width,it=ITEMS[idx],h=it.hole;
     c.clearRect(0,0,S,S);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
     const targetH=S*.92,scale=targetH/it.h,ow=it.w*scale,ox=S/2-ow/2,oy=S*.98-targetH;
     const hx=ox+h.x*scale,hy=oy+h.y*scale,hw=h.w*scale,hh=h.h*scale,cx=hx+hw/2,cy=hy+hh/2;
     const headW=hw*1.55,headH=headW*(im.naturalHeight/im.naturalWidth),fx=cx-headW/2,fy=cy-headH*.50;
     c.save();c.beginPath();c.ellipse(cx,cy,hw*.48,hh*.51,0,0,Math.PI*2);c.clip();c.drawImage(im,fx,fy,headW,headH);c.restore();
     cr.classList.add('v835-face-ready');cr.dataset.v835id=id;document.documentElement.dataset.deenV835='ready';window.DEEN_V835_ERROR=null;return true;
   }catch(err){console.error('v8.3.5 face overlay',err);window.DEEN_V835_ERROR=String(err?.message||err);document.documentElement.dataset.deenV835='error';return false}
 }
 function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;render()})}
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe,[data-v810-open-wardrobe]')){schedule();setTimeout(schedule,70);setTimeout(schedule,180)}},true);
 [0,180,650,1400].forEach(ms=>setTimeout(schedule,ms));
 window.DEEN_V835_WARDROBE_HQ={version:VERSION,revision:REV,refresh:schedule,check:()=>({version:VERSION,active:activeId(),faceOverlay:!!$('.v835-face-overlay',croot()),hqBase:!!$('.v834-composite-canvas',croot()),ready:croot()?.classList?.contains('v835-face-ready')||false,eventDriven:true,error:window.DEEN_V835_ERROR||null,saveLocked:true})};
 window.DEEN_RELEASE_VERSION=VERSION;setTimeout(()=>{document.title='DEEN v8.3.5 Wardrobe HQ'},650);
})();
