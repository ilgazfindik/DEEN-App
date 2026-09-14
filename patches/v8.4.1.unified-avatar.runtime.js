(()=>{
 if(window.__deenV841UnifiedAvatar)return;
 window.__deenV841UnifiedAvatar=true;
 window.DEEN_V841_ACTIVE=true;
 const VERSION='8.4.1-UNIFIED-AVATAR',REV='841u1';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const CELL=224,SIZE=672,K=SIZE/CELL;
 const OUTFIT_ROOT='./assets/avatar-runtime/v7/';
 const OUTFIT_PARTS=['female_hq224_c01.b64','female_hq224_s02a.b64','female_hq224_s02b.b64','female_hq224_s02c.b64','female_hq224_s02d.b64','female_hq224_s02e.b64','female_hq224_c03.b64','female_hq224_c04.b64','female_hq224_c05.b64','female_hq224_s06a.b64','female_hq224_s06b.b64','female_hq224_s06c.b64','female_hq224_s06d.b64'];
 const FACE_FILE='./assets/avatar-runtime/v3/female_face_192_1.b64';
 const FACE_AW=1536,FACE_AH=1344;
 const HOLES=[
  {x:113,y:19,w:21,h:25},{x:99,y:18,w:21,h:26},{x:104,y:18,w:20,h:25},
  {x:102,y:18,w:21,h:25},{x:101,y:20,w:22,h:25},{x:101,y:20,w:22,h:25},
  {x:100,y:19,w:22,h:25},{x:103,y:19,w:21,h:23},{x:103,y:19,w:21,h:25},
  {x:100,y:19,w:21,h:25},{x:96,y:19,w:20,h:24}
 ];
 // Small optical corrections only; geometry comes from real atlas openings above.
 const TUNE={
  female_01:{s:1.28,dx:.10,dy:-.10},female_02:{s:1.29,dx:0,dy:-.10},female_03:{s:1.30,dx:.05,dy:-.08},
  female_04:{s:1.29,dx:0,dy:-.10},female_05:{s:1.31,dx:0,dy:-.16},female_06:{s:1.31,dx:.04,dy:-.14},
  female_07:{s:1.33,dx:0,dy:-.18},female_08:{s:1.29,dx:0,dy:-.08},female_09:{s:1.31,dx:0,dy:-.14},
  female_10:{s:1.31,dx:.04,dy:-.12},female_11:{s:1.30,dx:0,dy:-.10}
 };
 const PARTS={
  face:[{x:18,y:12,w:156,h:168}],
  eye:[{x:1203,y:64,w:90,h:63},{x:1395,y:64,w:90,h:63},{x:52,y:256,w:88,h:63},{x:243,y:256,w:90,h:63},{x:435,y:256,w:90,h:63},{x:626,y:255,w:92,h:65},{x:812,y:254,w:103,h:67}],
  brow:[{x:1007,y:272,w:97,h:32},{x:1194,y:272,w:108,h:32},{x:1385,y:272,w:110,h:31},{x:35,y:464,w:121,h:32},{x:227,y:464,w:121,h:31},{x:418,y:464,w:124,h:32}],
  nose:[{x:645,y:443,w:54,h:74},{x:834,y:442,w:59,h:76},{x:1025,y:441,w:61,h:77},{x:1222,y:443,w:52,h:74},{x:1414,y:445,w:52,h:70}],
  mouth:[{x:52,y:650,w:88,h:43},{x:243,y:652,w:90,h:40},{x:463,y:648,w:34,h:47},{x:629,y:648,w:86,h:47},{x:820,y:648,w:88,h:47},{x:1018,y:651,w:76,h:41},{x:1218,y:650,w:59,h:43},{x:1400,y:646,w:79,h:52},{x:54,y:842,w:83,h:43},{x:244,y:841,w:88,h:45}],
  blush:[{x:428,y:824,w:103,h:79},{x:626,y:823,w:92,h:81},{x:821,y:824,w:86,h:79},{x:1012,y:825,w:88,h:77},{x:1205,y:828,w:86,h:72},{x:1397,y:827,w:85,h:74},{x:53,y:1017,w:86,h:77},{x:246,y:1019,w:83,h:74},{x:428,y:1013,w:104,h:85},{x:617,y:1014,w:110,h:83}],
  glasses:[{x:791,y:1001,w:146,h:110},{x:980,y:1001,w:151,h:110},{x:1183,y:1007,w:130,h:97},{x:1374,y:1007,w:131,h:97},{x:12,y:1216,w:168,h:64},{x:204,y:1216,w:168,h:63},{x:396,y:1215,w:168,h:66},{x:588,y:1216,w:168,h:64},{x:791,y:1193,w:146,h:110},{x:972,y:1192,w:168,h:112},{x:1221,y:1164,w:53,h:168}]
 };
 const CACHE={outfit:null,face:null};let outfitPromise=null,facePromise=null,token=0,raf=0,lastError=null,lastSig='',obs=null,obsRoot=null;
 function root(){return $('#v812Wardrobe')}
 function croot(){return $('.v832u-canvas',root())}
 function gender(){return $('.v832k-mannequin',root())?.dataset?.gender==='male'?'male':'female'}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function femaleIndex(id){const m=String(id||'').match(/^female_(\d{2})$/);if(!m)return-1;const n=+m[1];return n>=1&&n<=11?n-1:-1}
 function state(){try{return window.DEEN_AVATAR_ASSETS?.state?.()?.selected?.female||{}}catch(_){return {}}}
 function idx(id,count){const m=String(id||'').match(/(\d+)(?!.*\d)/);return !m?0:Math.max(0,(+m[1]-1)%count)}
 async function text(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(url+' HTTP '+r.status);return(await r.text()).replace(/\s+/g,'')}
 function image(b64,label){return new Promise((ok,bad)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>bad(new Error(label+' decode failed'));im.src='data:image/webp;base64,'+b64})}
 async function loadOutfit(){if(CACHE.outfit)return CACHE.outfit;if(outfitPromise)return outfitPromise;outfitPromise=(async()=>{const b=(await Promise.all(OUTFIT_PARTS.map(n=>text(OUTFIT_ROOT+n+'?v='+REV)))).join('');const im=await image(b,'female outfit atlas');if(im.naturalWidth!==1344||im.naturalHeight!==448)throw new Error('female outfit atlas dimensions '+im.naturalWidth+'x'+im.naturalHeight);return CACHE.outfit=im})();return outfitPromise}
 async function loadFace(){if(CACHE.face)return CACHE.face;if(facePromise)return facePromise;facePromise=(async()=>CACHE.face=await image(await text(FACE_FILE+'?v='+REV),'female face atlas'))();return facePromise}
 function ensureCanvas(cr){let cv=$('.v841-unified-canvas',cr);if(!cv){cv=document.createElement('canvas');cv.className='v841-unified-canvas';cv.width=SIZE;cv.height=SIZE;cv.setAttribute('aria-hidden','true');cr.appendChild(cv)}return cv}
 function part(cat,n=0){const a=PARTS[cat]||[];return a[Math.max(0,Math.min(a.length-1,n))]||null}
 function drawPart(ctx,img,p,cx,cy,w,flip=false,alpha=1){if(!p||!w)return;const h=w*(p.h/p.w),rx=img.naturalWidth/FACE_AW,ry=img.naturalHeight/FACE_AH;ctx.save();ctx.globalAlpha=alpha;if(flip){ctx.translate(cx+w/2,cy-h/2);ctx.scale(-1,1);ctx.drawImage(img,p.x*rx,p.y*ry,p.w*rx,p.h*ry,0,0,w,h)}else ctx.drawImage(img,p.x*rx,p.y*ry,p.w*rx,p.h*ry,cx-w/2,cy-h/2,w,h);ctx.restore()}
 function paint(cv,outfit,faceImg,id,fi){
  const ctx=cv.getContext('2d',{alpha:true});if(!ctx)return false;ctx.clearRect(0,0,SIZE,SIZE);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  const h=HOLES[fi],t=TUNE[id]||{s:1.30,dx:0,dy:-.1},sel=state();
  const cx=(h.x+h.w/2+t.dx)*K,cy=(h.y+h.h/2+t.dy)*K,faceW=h.w*t.s*K;
  // Base skin is deliberately oversized so its outline remains behind the hijab edge.
  drawPart(ctx,faceImg,part('face',0),cx,cy,faceW);
  const hw=h.w*K,hh=h.h*K;
  const eyeN=idx(sel.eyes,PARTS.eye.length),browN=idx(sel.eyebrows,PARTS.brow.length),noseN=idx(sel.noses,PARTS.nose.length),mouthN=idx(sel.mouths,PARTS.mouth.length);
  drawPart(ctx,faceImg,part('brow',browN),cx-hw*.19,cy-hh*.20,hw*.31);drawPart(ctx,faceImg,part('brow',browN),cx+hw*.19,cy-hh*.20,hw*.31,true);
  drawPart(ctx,faceImg,part('eye',eyeN),cx-hw*.19,cy-hh*.03,hw*.34);drawPart(ctx,faceImg,part('eye',eyeN),cx+hw*.19,cy-hh*.03,hw*.34,true);
  drawPart(ctx,faceImg,part('nose',noseN),cx,cy+hh*.14,hw*.18);
  drawPart(ctx,faceImg,part('mouth',mouthN),cx,cy+hh*.31,hw*.29);
  if(sel.blush){const p=part('blush',idx(sel.blush,PARTS.blush.length));drawPart(ctx,faceImg,p,cx-hw*.25,cy+hh*.18,hw*.22,false,.70);drawPart(ctx,faceImg,p,cx+hw*.25,cy+hh*.18,hw*.22,true,.70)}
  if(sel.glasses)drawPart(ctx,faceImg,part('glasses',idx(sel.glasses,PARTS.glasses.length)),cx,cy-hh*.02,hw*.95);
  // Outfit/hijab is final mask; no clearRect/ellipse is used.
  const col=fi<6?fi:fi-6,row=fi<6?0:1;ctx.drawImage(outfit,col*CELL,row*CELL,CELL,CELL,0,0,SIZE,SIZE);
  lastSig=id+'|'+JSON.stringify(sel);return true;
 }
 async function render(){const r=root();if(!r?.classList?.contains('open'))return false;window.DEEN_HF2U?.refresh?.();const cr=croot();if(!cr)return false;const id=activeId(),g=gender(),fi=femaleIndex(id),my=++token;if(g!=='female'||fi<0){cr.classList.remove('v841-ready');cr.removeAttribute('data-v841id');document.documentElement.dataset.deenV841='male-fallback';return false}try{const [outfit,faceImg]=await Promise.all([loadOutfit(),loadFace()]);if(my!==token||activeId()!==id||gender()!=='female')return false;const cv=ensureCanvas(cr);cr.dataset.gender='female';if(!paint(cv,outfit,faceImg,id,fi))throw new Error('2d context unavailable');if(my!==token||activeId()!==id)return false;cr.dataset.v841id=id;cr.classList.add('v841-ready');lastError=null;document.documentElement.dataset.deenV841='ready';return true}catch(err){lastError=String(err?.message||err);window.DEEN_V841_ERROR=lastError;document.documentElement.dataset.deenV841='error';console.error('DEEN v8.4.1 unified avatar:',err);return false}}
 function schedule(delay=0){if(delay){setTimeout(()=>schedule(0),delay);return}if(raf)return;raf=requestAnimationFrame(()=>{raf=0;render()})}
 function observe(){const rr=root();if(!rr||rr===obsRoot)return;obs?.disconnect?.();obsRoot=rr;obs=new MutationObserver(()=>schedule(0));obs.observe(rr,{subtree:true,attributes:true,attributeFilter:['class','data-gender','data-v832k-real']})}
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v832k-real],#v812Wardrobe [data-v831-asset],#v812Wardrobe [data-v831-gender],#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe]')){queueMicrotask(()=>{observe();schedule(0);schedule(70)})}},false);
 document.addEventListener('keydown',e=>{if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&root()?.classList?.contains('open'))schedule(60)},false);
 requestAnimationFrame(()=>{observe();schedule(0)});
 window.DEEN_V841_UNIFIED={version:VERSION,revision:REV,refresh:()=>schedule(0),check:()=>({version:VERSION,revision:REV,active:activeId(),gender:gender(),ready:!!croot()?.classList?.contains('v841-ready')&&croot()?.dataset?.v841id===activeId(),canvas:!!$('.v841-unified-canvas',croot()),outfitLoaded:!!CACHE.outfit,faceLoaded:!!CACHE.face,signature:lastSig,error:lastError})};
 window.DEEN_RELEASE_VERSION=VERSION;window.DEEN_RENDER_ARBITRATION='V841_SINGLE_AUTHORITATIVE_RENDERER';
})();