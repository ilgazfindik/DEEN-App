(()=>{
 if(window.__deenV837Wardrobe)return;
 window.__deenV837Wardrobe=true;
 window.DEEN_V837_ACTIVE=true;
 const VERSION='8.3.7-WARDROBE-STABLE',REV='837stable1';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const ASSET_ROOT='./assets/avatar-runtime/v7/';
 const ATLAS_PARTS=[
  'female_hq224_c01.b64',
  'female_hq224_s02a.b64','female_hq224_s02b.b64','female_hq224_s02c.b64','female_hq224_s02d.b64','female_hq224_s02e.b64',
  'female_hq224_c03.b64','female_hq224_c04.b64','female_hq224_c05.b64',
  'female_hq224_s06a.b64','female_hq224_s06b.b64','female_hq224_s06c.b64','female_hq224_s06d.b64'
 ];
 const FACE_FILE='./assets/avatar-runtime/v6/female_default_face_128.b64';
 const EXPECT={atlasB64:105412,atlasBytes:79058,faceB64:7008,faceBytes:5254};
 const CELL=224;
 const HOLES=[
  {x:113,y:19,w:21,h:25},{x:99,y:18,w:21,h:26},{x:104,y:18,w:20,h:25},
  {x:102,y:18,w:21,h:25},{x:101,y:20,w:22,h:25},{x:101,y:20,w:22,h:25},
  {x:100,y:19,w:22,h:25},{x:103,y:19,w:21,h:23},{x:103,y:19,w:21,h:25},
  {x:100,y:19,w:21,h:25},{x:96,y:19,w:20,h:24}
 ];
 const FACE_ALPHA={x:14,y:12,w:85,h:92};
 const CACHE={atlas:null,face:null};
 let atlasPromise=null,facePromise=null,raf=0,token=0,lastError=null;
 function root(){return $('#v812Wardrobe')}
 function mannequin(){return $('.v832k-mannequin',root())}
 function croot(){return $('.v832u-canvas',root())}
 function gender(){return mannequin()?.dataset?.gender==='male'?'male':'female'}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function femaleIndex(id){const m=String(id||'').match(/^female_(\d{2})$/);if(!m)return-1;const n=Number(m[1]);return n>=1&&n<=11?n-1:-1}
 async function text(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(url+' HTTP '+r.status);return(await r.text()).replace(/\s+/g,'')}
 function riffBytes(b64,label,expectedB64,expectedBytes){
  if(b64.length!==expectedB64)throw new Error(label+' base64 length '+b64.length+' != '+expectedB64);
  let bin;try{bin=atob(b64)}catch(_){throw new Error(label+' base64 decode failed')}
  if(bin.length!==expectedBytes)throw new Error(label+' bytes '+bin.length+' != '+expectedBytes);
  if(bin.slice(0,4)!=='RIFF'||bin.slice(8,12)!=='WEBP')throw new Error(label+' invalid WebP header');
  const riff=(bin.charCodeAt(4)|(bin.charCodeAt(5)<<8)|(bin.charCodeAt(6)<<16)|(bin.charCodeAt(7)<<24))>>>0;
  if(riff+8!==bin.length)throw new Error(label+' RIFF size '+(riff+8)+' != '+bin.length);
  return true;
 }
 function imageFromB64(b64,label){return new Promise((ok,bad)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>bad(new Error(label+' image decode failed'));im.src='data:image/webp;base64,'+b64})}
 async function loadAtlas(){
  if(CACHE.atlas)return CACHE.atlas;if(atlasPromise)return atlasPromise;
  atlasPromise=(async()=>{const parts=await Promise.all(ATLAS_PARTS.map(n=>text(ASSET_ROOT+n+'?v='+REV)));const b64=parts.join('');riffBytes(b64,'female HQ atlas',EXPECT.atlasB64,EXPECT.atlasBytes);const im=await imageFromB64(b64,'female HQ atlas');if(im.naturalWidth!==1344||im.naturalHeight!==448)throw new Error('female HQ atlas dimensions '+im.naturalWidth+'x'+im.naturalHeight+' != 1344x448');CACHE.atlas=im;return im})();
  return atlasPromise;
 }
 async function loadFace(){
  if(CACHE.face)return CACHE.face;if(facePromise)return facePromise;
  facePromise=(async()=>{const b64=await text(FACE_FILE+'?v='+REV);riffBytes(b64,'female face',EXPECT.faceB64,EXPECT.faceBytes);const im=await imageFromB64(b64,'female face');CACHE.face=im;return im})();
  return facePromise;
 }
 function ensureCanvas(cr){let cv=$('.v837-final-canvas',cr);if(!cv){cv=document.createElement('canvas');cv.className='v837-final-canvas';cv.width=672;cv.height=672;cv.setAttribute('aria-hidden','true');cr.appendChild(cv)}return cv}
 function drawFemale(cv,atlas,face,idx){
  const ctx=cv.getContext('2d',{alpha:true}),S=cv.width,k=S/CELL,h=HOLES[idx];
  ctx.clearRect(0,0,S,S);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  const fit=Math.min((h.w*.96)/FACE_ALPHA.w,(h.h*.96)/FACE_ALPHA.h);
  const fx=(h.x+h.w/2-(FACE_ALPHA.x+FACE_ALPHA.w/2)*fit)*k;
  const fy=(h.y+h.h/2-(FACE_ALPHA.y+FACE_ALPHA.h/2)*fit)*k;
  const fw=face.naturalWidth*fit*k,fh=face.naturalHeight*fit*k;
  ctx.drawImage(face,fx,fy,fw,fh);
  const col=idx<6?idx:idx-6,row=idx<6?0:1;
  ctx.drawImage(atlas,col*CELL,row*CELL,CELL,CELL,0,0,S,S);
 }
 function clearReady(cr,mode){if(!cr)return;cr.classList.remove('v837-ready');cr.removeAttribute('data-v837id');$('.v837-final-canvas',cr)?.remove?.();document.documentElement.dataset.deenV837=mode||'idle'}
 async function render(){
  const r=root();if(!r?.classList?.contains('open'))return false;
  window.DEEN_HF2U?.refresh?.();
  const cr=croot();if(!cr)return false;
  const id=activeId(),g=gender(),idx=femaleIndex(id);
  if(g!=='female'||idx<0){clearReady(cr,'male-fallback');return false}
  const my=++token;
  try{
   const [atlas,face]=await Promise.all([loadAtlas(),loadFace()]);if(my!==token)return false;
   const liveCr=croot(),liveId=activeId();if(!liveCr||liveId!==id||gender()!=='female')return false;
   const cv=ensureCanvas(liveCr);drawFemale(cv,atlas,face,idx);
   liveCr.dataset.gender='female';liveCr.dataset.v837id=id;liveCr.classList.add('v837-ready');
   lastError=null;window.DEEN_V837_ERROR=null;document.documentElement.dataset.deenV837='ready';return true;
  }catch(err){lastError=String(err?.message||err);window.DEEN_V837_ERROR=lastError;console.error('DEEN v8.3.7 wardrobe:',err);clearReady(croot(),'error');return false}
 }
 function schedule(delay=0){if(delay){setTimeout(()=>schedule(0),delay);return}if(raf)return;raf=requestAnimationFrame(()=>{raf=0;render()})}
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],#v812Wardrobe [data-v831-gender],#v812Wardrobe [data-v832k-real],#v812Wardrobe .v832k-card,[data-v810-open-wardrobe]')){schedule();schedule(60);schedule(170)}},true);
 document.addEventListener('keydown',e=>{if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&root()?.classList?.contains('open'))schedule(60)},true);
 [0,180,520,1000].forEach(ms=>schedule(ms));
 window.DEEN_V837_WARDROBE={version:VERSION,revision:REV,refresh:()=>schedule(),check:()=>({version:VERSION,revision:REV,active:activeId(),gender:gender(),ready:!!croot()?.classList?.contains('v837-ready'),canvas:!!$('.v837-final-canvas',croot()),atlasLoaded:!!CACHE.atlas,faceLoaded:!!CACHE.face,eventDriven:true,legacyPolling:false,atlasBytes:EXPECT.atlasBytes,error:lastError})};
 window.DEEN_RELEASE_VERSION=VERSION;window.DEEN_RENDER_ARBITRATION='V837_SINGLE_RENDERER';
})();
