(()=>{
 if(window.__deenV840HeadIntegration)return;
 window.__deenV840HeadIntegration=true;
 const VERSION='8.4.0-HEAD-INTEGRATION-DIRECT-PARTS',REV='840head4';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const CELL=224,FACE_AW=1536,FACE_AH=1344;
 const OUTFIT_ROOT='./assets/avatar-runtime/v7/';
 const OUTFIT_PARTS=['female_hq224_c01.b64','female_hq224_s02a.b64','female_hq224_s02b.b64','female_hq224_s02c.b64','female_hq224_s02d.b64','female_hq224_s02e.b64','female_hq224_c03.b64','female_hq224_c04.b64','female_hq224_c05.b64','female_hq224_s06a.b64','female_hq224_s06b.b64','female_hq224_s06c.b64','female_hq224_s06d.b64'];
 const FACE_FILE='./assets/avatar-runtime/v3/female_face_192_1.b64';
 const HOLES=[{x:113,y:19,w:21,h:25},{x:99,y:18,w:21,h:26},{x:104,y:18,w:20,h:25},{x:102,y:18,w:21,h:25},{x:101,y:20,w:22,h:25},{x:101,y:20,w:22,h:25},{x:100,y:19,w:22,h:25},{x:103,y:19,w:21,h:23},{x:103,y:19,w:21,h:25},{x:100,y:19,w:21,h:25},{x:96,y:19,w:20,h:24}];
 const FIT={
  female_01:{sx:1.17,sy:1.17,dx:.10,dy:-.18},female_02:{sx:1.18,sy:1.18,dx:0,dy:-.18},female_03:{sx:1.18,sy:1.18,dx:.05,dy:-.15},female_04:{sx:1.18,sy:1.18,dx:0,dy:-.16},
  female_05:{sx:1.20,sy:1.20,dx:0,dy:-.22},female_06:{sx:1.20,sy:1.20,dx:.05,dy:-.20},female_07:{sx:1.23,sy:1.22,dx:0,dy:-.28},female_08:{sx:1.18,sy:1.18,dx:0,dy:-.15},
  female_09:{sx:1.20,sy:1.20,dx:0,dy:-.20},female_10:{sx:1.20,sy:1.20,dx:.05,dy:-.20},female_11:{sx:1.19,sy:1.19,dx:0,dy:-.18}
 };
 const P={
  face:[{x:18,y:12,w:156,h:168}],
  eye:[{x:1203,y:64,w:90,h:63},{x:1395,y:64,w:90,h:63},{x:52,y:256,w:88,h:63},{x:243,y:256,w:90,h:63},{x:435,y:256,w:90,h:63},{x:626,y:255,w:92,h:65},{x:812,y:254,w:103,h:67}],
  brow:[{x:1007,y:272,w:97,h:32},{x:1194,y:272,w:108,h:32},{x:1385,y:272,w:110,h:31},{x:35,y:464,w:121,h:32},{x:227,y:464,w:121,h:31},{x:418,y:464,w:124,h:32}],
  nose:[{x:645,y:443,w:54,h:74},{x:834,y:442,w:59,h:76},{x:1025,y:441,w:61,h:77},{x:1222,y:443,w:52,h:74},{x:1414,y:445,w:52,h:70}],
  mouth:[{x:52,y:650,w:88,h:43},{x:243,y:652,w:90,h:40},{x:463,y:648,w:34,h:47},{x:629,y:648,w:86,h:47},{x:820,y:648,w:88,h:47},{x:1018,y:651,w:76,h:41},{x:1218,y:650,w:59,h:43},{x:1400,y:646,w:79,h:52},{x:54,y:842,w:83,h:43},{x:244,y:841,w:88,h:45}],
  blush:[{x:428,y:824,w:103,h:79},{x:626,y:823,w:92,h:81},{x:821,y:824,w:86,h:79},{x:1012,y:825,w:88,h:77},{x:1205,y:828,w:86,h:72},{x:1397,y:827,w:85,h:74},{x:53,y:1017,w:86,h:77},{x:246,y:1019,w:83,h:74},{x:428,y:1013,w:104,h:85},{x:617,y:1014,w:110,h:83}],
  glasses:[{x:791,y:1001,w:146,h:110},{x:980,y:1001,w:151,h:110},{x:1183,y:1007,w:130,h:97},{x:1374,y:1007,w:131,h:97},{x:12,y:1216,w:168,h:64},{x:204,y:1216,w:168,h:63},{x:396,y:1215,w:168,h:66},{x:588,y:1216,w:168,h:64},{x:791,y:1193,w:146,h:110},{x:972,y:1192,w:168,h:112},{x:1221,y:1164,w:53,h:168}]
 };
 let outfit=null,face=null,loadPromise=null,token=0,lastError=null,lastReadyAt=0,lastSig='',boundRoot=null,observer=null,lastObserved='';
 function root(){return $('#v812Wardrobe')}
 function croot(){return $('.v832u-canvas',root())}
 function finalCanvas(){return $('.v837-final-canvas',croot())}
 function gender(){return $('.v832k-mannequin',root())?.dataset?.gender==='male'?'male':'female'}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function femaleIndex(id){const m=String(id||'').match(/^female_(\d{2})$/);if(!m)return-1;const n=Number(m[1]);return n>=1&&n<=11?n-1:-1}
 function selected(){try{return window.DEEN_AVATAR_ASSETS?.state?.()?.selected?.female||{}}catch(_){return {}}}
 function sig(){try{return JSON.stringify(selected())}catch(_){return '{}'}}
 function pick(id,count,def=0){if(!count)return 0;const m=String(id||'').match(/(\d+)(?!.*\d)/);if(!m)return Math.min(def,count-1);return Math.max(0,(Number(m[1])-1)%count)}
 function frame(){return new Promise(ok=>requestAnimationFrame(ok))}
 async function waitFor(test,my,max=150){for(let i=0;i<max;i++){if(my!==token)return false;try{if(test())return true}catch(_){}await frame()}return false}
 async function text(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(url+' HTTP '+r.status);return(await r.text()).replace(/\s+/g,'')}
 function image(b64,label){return new Promise((ok,bad)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>bad(new Error(label+' decode failed'));im.src='data:image/webp;base64,'+b64})}
 async function load(){if(outfit&&face)return[outfit,face];if(loadPromise)return loadPromise;loadPromise=(async()=>{const [ob,fb]=await Promise.all([Promise.all(OUTFIT_PARTS.map(n=>text(OUTFIT_ROOT+n+'?v='+REV))).then(a=>a.join('')),text(FACE_FILE+'?v='+REV)]);if(!ob.startsWith('UklGR')||!fb.startsWith('UklGR'))throw new Error('v8.4.0 atlas invalid');const imgs=await Promise.all([image(ob,'outfit atlas'),image(fb,'face atlas')]);outfit=imgs[0];face=imgs[1];if(outfit.naturalWidth!==1344||outfit.naturalHeight!==448)throw new Error('outfit atlas dimensions '+outfit.naturalWidth+'x'+outfit.naturalHeight);return imgs})();return loadPromise}
 function sourceDraw(ctx,img,p,cx,cy,w,flip=false,alpha=1){if(!p||!w)return;const h=w*(p.h/p.w),rx=img.naturalWidth/FACE_AW,ry=img.naturalHeight/FACE_AH;ctx.save();ctx.globalAlpha=alpha;if(flip){ctx.translate(cx,0);ctx.scale(-1,1);ctx.drawImage(img,p.x*rx,p.y*ry,p.w*rx,p.h*ry,-w/2,cy-h/2,w,h)}else ctx.drawImage(img,p.x*rx,p.y*ry,p.w*rx,p.h*ry,cx-w/2,cy-h/2,w,h);ctx.restore()}
 function sourceRect(ctx,img,p,cx,cy,w,h){const rx=img.naturalWidth/FACE_AW,ry=img.naturalHeight/FACE_AH;ctx.drawImage(img,p.x*rx,p.y*ry,p.w*rx,p.h*ry,cx-w/2,cy-h/2,w,h)}
 function paint(cv,outfitImg,faceImg,id,fi){const ctx=cv.getContext('2d',{alpha:true});if(!ctx)return false;const S=cv.width,k=S/CELL,hole=HOLES[fi],fit=FIT[id]||{sx:1.19,sy:1.19,dx:0,dy:-.18},sel=selected();const bw=hole.w*fit.sx*k,bh=hole.h*fit.sy*k,cx=(hole.x+hole.w/2+fit.dx)*k,cy=(hole.y+hole.h/2+fit.dy)*k;ctx.clearRect(0,0,cv.width,cv.height);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.save();ctx.beginPath();ctx.ellipse(cx,cy,bw*.52,bh*.52,0,0,Math.PI*2);ctx.clip();sourceRect(ctx,faceImg,P.face[0],cx,cy,bw,bh);const eye=P.eye[pick(sel.eyes,P.eye.length)],brow=P.brow[pick(sel.eyebrows,P.brow.length)];sourceDraw(ctx,faceImg,brow,cx-bw*.1583,cy-bh*.1715,bw*.2583,false);sourceDraw(ctx,faceImg,brow,cx+bw*.1583,cy-bh*.1715,bw*.2583,true);sourceDraw(ctx,faceImg,eye,cx-bw*.1583,cy-bh*.0181,bw*.2833,false);sourceDraw(ctx,faceImg,eye,cx+bw*.1583,cy-bh*.0181,bw*.2833,true);sourceDraw(ctx,faceImg,P.nose[pick(sel.noses,P.nose.length)],cx,cy+bh*.1173,bw*.15);sourceDraw(ctx,faceImg,P.mouth[pick(sel.mouths,P.mouth.length)],cx,cy+bh*.2618,bw*.2417);if(sel.blush){const b=P.blush[pick(sel.blush,P.blush.length)];sourceDraw(ctx,faceImg,b,cx-bw*.2083,cy+bh*.1354,bw*.1833,false,.70);sourceDraw(ctx,faceImg,b,cx+bw*.2083,cy+bh*.1354,bw*.1833,true,.70)}if(sel.glasses)sourceDraw(ctx,faceImg,P.glasses[pick(sel.glasses,P.glasses.length)],cx,cy-bh*.009,bw*.7917);ctx.restore();const col=fi<6?fi:fi-6,row=fi<6?0:1;ctx.drawImage(outfitImg,col*CELL,row*CELL,CELL,CELL,0,0,S,S);return true}
 function v839Ready(id){const c=window.DEEN_V839_WARDROBE?.check?.();return !!(c?.ready&&c?.stage==='ready'&&c?.active===id&&finalCanvas())}
 async function render(){const r=root();if(!r?.classList?.contains('open'))return false;const id=activeId(),g=gender(),fi=femaleIndex(id),my=++token;if(g!=='female'||fi<0){const cr=croot();cr?.classList?.remove('v840-ready');cr?.removeAttribute('data-v840id');document.documentElement.dataset.deenV840='male-fallback';return false}document.documentElement.dataset.deenV840='waiting';const [imgs,ready]=await Promise.all([load(),waitFor(()=>v839Ready(id),my)]);if(!ready||my!==token||activeId()!==id)return false;const cv=finalCanvas(),cr=croot();if(!cv||!cr)return false;document.documentElement.dataset.deenV840='composing';if(!paint(cv,imgs[0],imgs[1],id,fi))return false;if(my!==token||activeId()!==id)return false;cr.classList.add('v840-ready');cr.dataset.v840id=id;lastSig=id+'|'+sig();lastReadyAt=Date.now();lastError=null;document.documentElement.dataset.deenV840='ready';return true}
 function refresh(){render().catch(err=>{lastError=String(err?.message||err);window.DEEN_V840_ERROR=lastError;document.documentElement.dataset.deenV840='error';console.error('DEEN v8.4.0 direct head integration:',err)});return true}
 function observe(){const cr=croot();if(!cr||cr===boundRoot)return;observer?.disconnect?.();boundRoot=cr;lastObserved='';observer=new MutationObserver(()=>{const live=croot();if(!live)return;const key=`${live.dataset.v839id||''}|${live.classList.contains('v839-ready')?'1':'0'}|${activeId()||''}|${sig()}`;if(key===lastObserved)return;lastObserved=key;if(live.classList.contains('v839-ready'))queueMicrotask(refresh)});observer.observe(cr,{attributes:true,subtree:false,attributeFilter:['class','data-v839id','data-v837id']})}
 function bind(){observe();if(root()?.classList?.contains('open'))refresh();if(!boundRoot)requestAnimationFrame(bind)}
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v832k-real],#v812Wardrobe [data-v831-asset],#v812Wardrobe [data-v831-gender],#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe]'))queueMicrotask(()=>{observe();refresh()})},true);
 requestAnimationFrame(bind);
 window.DEEN_V840_HEAD={version:VERSION,revision:REV,refresh,check:()=>({version:VERSION,revision:REV,active:activeId(),gender:gender(),ready:!!croot()?.classList?.contains('v840-ready')&&croot()?.dataset?.v840id===activeId(),outfitAtlas:!!outfit,faceAtlas:!!face,signature:lastSig,readyAt:lastReadyAt,error:lastError})};
 window.DEEN_RELEASE_VERSION=VERSION;window.DEEN_RENDER_ARBITRATION='V840_DIRECT_FACE_PARTS';
})();