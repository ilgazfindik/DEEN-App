(()=>{
 if(window.__deenV833FaceEngine)return;window.__deenV833FaceEngine=true;
 const VERSION='8.3.3-FACE-ENGINE',REV='833fe3';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const ATLAS={"female":{"w":1536,"h":1344,"parts":{"face":[{"x":18,"y":12,"w":156,"h":168},{"x":210,"y":12,"w":156,"h":168},{"x":402,"y":12,"w":156,"h":168},{"x":591,"y":12,"w":161,"h":168},{"x":783,"y":12,"w":162,"h":168},{"x":977,"y":12,"w":158,"h":168}],"eye":[{"x":1203,"y":64,"w":90,"h":63},{"x":1395,"y":64,"w":90,"h":63},{"x":52,"y":256,"w":88,"h":63},{"x":243,"y":256,"w":90,"h":63},{"x":435,"y":256,"w":90,"h":63},{"x":626,"y":255,"w":92,"h":65},{"x":812,"y":254,"w":103,"h":67}],"brow":[{"x":1007,"y":272,"w":97,"h":32},{"x":1194,"y":272,"w":108,"h":32},{"x":1385,"y":272,"w":110,"h":31},{"x":35,"y":464,"w":121,"h":32},{"x":227,"y":464,"w":121,"h":31},{"x":418,"y":464,"w":124,"h":32}],"nose":[{"x":645,"y":443,"w":54,"h":74},{"x":834,"y":442,"w":59,"h":76},{"x":1025,"y":441,"w":61,"h":77},{"x":1222,"y":443,"w":52,"h":74},{"x":1414,"y":445,"w":52,"h":70}],"mouth":[{"x":52,"y":650,"w":88,"h":43},{"x":243,"y":652,"w":90,"h":40},{"x":463,"y":648,"w":34,"h":47},{"x":629,"y":648,"w":86,"h":47},{"x":820,"y":648,"w":88,"h":47},{"x":1018,"y":651,"w":76,"h":41},{"x":1218,"y":650,"w":59,"h":43},{"x":1400,"y":646,"w":79,"h":52},{"x":54,"y":842,"w":83,"h":43},{"x":244,"y":841,"w":88,"h":45}],"blush":[{"x":428,"y":824,"w":103,"h":79},{"x":626,"y":823,"w":92,"h":81},{"x":821,"y":824,"w":86,"h":79},{"x":1012,"y":825,"w":88,"h":77},{"x":1205,"y":828,"w":86,"h":72},{"x":1397,"y":827,"w":85,"h":74},{"x":53,"y":1017,"w":86,"h":77},{"x":246,"y":1019,"w":83,"h":74},{"x":428,"y":1013,"w":104,"h":85},{"x":617,"y":1014,"w":110,"h":83}],"glasses":[{"x":791,"y":1001,"w":146,"h":110},{"x":980,"y":1001,"w":151,"h":110},{"x":1183,"y":1007,"w":130,"h":97},{"x":1374,"y":1007,"w":131,"h":97},{"x":12,"y":1216,"w":168,"h":64},{"x":204,"y":1216,"w":168,"h":63},{"x":396,"y":1215,"w":168,"h":66},{"x":588,"y":1216,"w":168,"h":64},{"x":791,"y":1193,"w":146,"h":110},{"x":972,"y":1192,"w":168,"h":112},{"x":1221,"y":1164,"w":53,"h":168}]}}},"male":{"w":1536,"h":1920,"parts":{"face":[{"x":18,"y":12,"w":155,"h":168},{"x":208,"y":12,"w":160,"h":168},{"x":400,"y":12,"w":159,"h":168},{"x":591,"y":12,"w":161,"h":168},{"x":784,"y":12,"w":160,"h":168},{"x":975,"y":12,"w":161,"h":168}],"eye":[{"x":1188,"y":31,"w":119,"h":130},{"x":1382,"y":33,"w":115,"h":126},{"x":37,"y":226,"w":117,"h":124},{"x":229,"y":227,"w":117,"h":121},{"x":422,"y":227,"w":115,"h":122}],"brow":[{"x":600,"y":262,"w":144,"h":52},{"x":794,"y":263,"w":139,"h":50},{"x":986,"y":265,"w":140,"h":45},{"x":1176,"y":263,"w":144,"h":50},{"x":1367,"y":263,"w":146,"h":49},{"x":22,"y":455,"w":148,"h":50},{"x":214,"y":456,"w":148,"h":47}],"nose":[{"x":429,"y":415,"w":101,"h":130},{"x":616,"y":408,"w":112,"h":144},{"x":812,"y":411,"w":103,"h":137},{"x":999,"y":410,"w":113,"h":139},{"x":1195,"y":414,"w":106,"h":131},{"x":1380,"y":411,"w":119,"h":137},{"x":44,"y":605,"w":103,"h":133},{"x":232,"y":607,"w":112,"h":130}],"mouth":[{"x":405,"y":643,"w":149,"h":58},{"x":599,"y":641,"w":146,"h":61},{"x":794,"y":640,"w":140,"h":63},{"x":979,"y":638,"w":153,"h":68},{"x":1178,"y":644,"w":139,"h":56},{"x":1363,"y":643,"w":153,"h":58},{"x":21,"y":835,"w":149,"h":58},{"x":217,"y":826,"w":142,"h":76}],"hair":[{"x":396,"y":800,"w":168,"h":127},{"x":588,"y":796,"w":168,"h":135},{"x":780,"y":796,"w":168,"h":136},{"x":972,"y":798,"w":168,"h":131},{"x":1164,"y":799,"w":168,"h":130},{"x":1356,"y":797,"w":168,"h":134},{"x":12,"y":989,"w":168,"h":133},{"x":204,"y":984,"w":168,"h":143},{"x":396,"y":989,"w":168,"h":134},{"x":588,"y":989,"w":168,"h":133},{"x":780,"y":986,"w":168,"h":140},{"x":972,"y":989,"w":168,"h":133},{"x":1164,"y":988,"w":168,"h":135},{"x":1356,"y":990,"w":168,"h":132}],"beard":[{"x":12,"y":1197,"w":168,"h":101},{"x":204,"y":1211,"w":168,"h":73},{"x":396,"y":1224,"w":168,"h":48},{"x":588,"y":1225,"w":168,"h":46},{"x":780,"y":1185,"w":168,"h":125},{"x":972,"y":1188,"w":168,"h":120},{"x":1164,"y":1227,"w":168,"h":41},{"x":1356,"y":1191,"w":168,"h":113},{"x":12,"y":1391,"w":168,"h":98},{"x":204,"y":1415,"w":168,"h":50},{"x":396,"y":1421,"w":168,"h":38},{"x":589,"y":1379,"w":166,"h":122},{"x":780,"y":1402,"w":168,"h":75}],"glasses":[{"x":984,"y":1382,"w":144,"h":115},{"x":1164,"y":1384,"w":168,"h":112},{"x":1360,"y":1384,"w":160,"h":112},{"x":14,"y":1576,"w":164,"h":112},{"x":218,"y":1576,"w":140,"h":112},{"x":398,"y":1574,"w":164,"h":115},{"x":593,"y":1580,"w":157,"h":104},{"x":783,"y":1580,"w":162,"h":104},{"x":986,"y":1575,"w":139,"h":113},{"x":1165,"y":1575,"w":166,"h":113},{"x":1360,"y":1576,"w":160,"h":112},{"x":15,"y":1768,"w":162,"h":112}],"hat":[{"x":204,"y":1762,"w":168,"h":124},{"x":396,"y":1761,"w":168,"h":125},{"x":588,"y":1768,"w":168,"h":112},{"x":780,"y":1772,"w":168,"h":104},{"x":972,"y":1774,"w":168,"h":99},{"x":1164,"y":1769,"w":168,"h":109},{"x":1356,"y":1761,"w":168,"h":125}]}}};
 const FILES={female:['female_face_192_1.b64'],male:['male_face_192_1.b64','male_face_192_2.b64']};
 const URLS={female:null,male:null},IMAGES={female:null,male:null};
 function root(){return $('#v812Wardrobe')}
 function canvasRoot(){return $('.v832u-canvas',root())}
 function slot(){return $('.v832u-avatar-slot',canvasRoot())}
 function gender(){return canvasRoot()?.dataset?.gender==='male'?'male':'female'}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function avatarState(){try{return window.DEEN_AVATAR_ASSETS?.state?.()||null}catch(_){return null}}
 function selected(g){return avatarState()?.selected?.[g]||{}}
 function idx(id,count,def=0){
   if(!count)return 0;const m=String(id||'').match(/(\d+)(?!.*\d)/);if(!m)return Math.min(def,count-1);
   return Math.max(0,(Number(m[1])-1)%count);
 }
 async function load(g){
   if(IMAGES[g])return IMAGES[g];
   const chunks=await Promise.all(FILES[g].map(async name=>{const r=await fetch(`./assets/avatar-runtime/v3/${name}?v=${REV}`,{cache:'no-store'});if(!r.ok)throw new Error(`${name} HTTP ${r.status}`);return (await r.text()).replace(/\s+/g,'')}));
   const b=chunks.join('');if(!b.startsWith('UklGR'))throw new Error(`${g} face atlas invalid`);
   URLS[g]='data:image/webp;base64,'+b;
   IMAGES[g]=await new Promise((ok,bad)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>bad(new Error(g+' face atlas decode'));im.src=URLS[g]});
   return IMAGES[g];
 }
 function part(g,cat,n){
   const a=ATLAS[g]?.parts?.[cat]||[];if(!a.length)return null;const p=a[Math.max(0,Math.min(a.length-1,n||0))];return {...p,_aw:ATLAS[g].w,_ah:ATLAS[g].h}
 }
 function draw(ctx,img,p,cx,cy,w,flip=false,alpha=1){
   if(!p||!w)return;const h=w*(p.h/p.w),rx=img.naturalWidth/p._aw,ry=img.naturalHeight/p._ah;ctx.save();ctx.globalAlpha=alpha;
   if(flip){ctx.translate(cx+w/2,cy-h/2);ctx.scale(-1,1);ctx.drawImage(img,p.x*rx,p.y*ry,p.w*rx,p.h*ry,0,0,w,h)}
   else ctx.drawImage(img,p.x*rx,p.y*ry,p.w*rx,p.h*ry,cx-w/2,cy-h/2,w,h);
   ctx.restore();
 }
 function renderFemale(cv,img,sel){
   const c=cv.getContext('2d');const W=cv.width,H=cv.height;c.clearRect(0,0,W,H);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
   const faceN=0,eyeN=idx(sel.eyes,(ATLAS.female.parts.eye||[]).length),browN=idx(sel.eyebrows,(ATLAS.female.parts.brow||[]).length);
   const noseN=idx(sel.noses,(ATLAS.female.parts.nose||[]).length),mouthN=idx(sel.mouths,(ATLAS.female.parts.mouth||[]).length);
   const blushId=sel.blush,glassId=sel.glasses;
   draw(c,img,part('female','face',faceN),W*.50,H*.50,W*1.20,false,1);
   const eye=part('female','eye',eyeN),brow=part('female','brow',browN);
   draw(c,img,brow,W*.31,H*.31,W*.31,false);draw(c,img,brow,W*.69,H*.31,W*.31,true);
   draw(c,img,eye,W*.31,H*.48,W*.34,false);draw(c,img,eye,W*.69,H*.48,W*.34,true);
   draw(c,img,part('female','nose',noseN),W*.50,H*.63,W*.18);
   draw(c,img,part('female','mouth',mouthN),W*.50,H*.79,W*.29);
   if(blushId){const p=part('female','blush',idx(blushId,(ATLAS.female.parts.blush||[]).length));draw(c,img,p,W*.25,H*.65,W*.22,false,.70);draw(c,img,p,W*.75,H*.65,W*.22,true,.70)}
   if(glassId)draw(c,img,part('female','glasses',idx(glassId,(ATLAS.female.parts.glasses||[]).length)),W*.50,H*.49,W*.95);
 }
 function renderMale(cv,img,sel){
   const c=cv.getContext('2d');const W=cv.width,H=cv.height;c.clearRect(0,0,W,H);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
   const faceN=idx(sel.face_shapes,(ATLAS.male.parts.face||[]).length),eyeN=idx(sel.eyes,(ATLAS.male.parts.eye||[]).length),browN=idx(sel.eyebrows,(ATLAS.male.parts.brow||[]).length);
   const noseN=idx(sel.noses,(ATLAS.male.parts.nose||[]).length),mouthN=idx(sel.mouths,(ATLAS.male.parts.mouth||[]).length);
   draw(c,img,part('male','face',faceN),W*.50,H*.57,W*.72);
   const eye=part('male','eye',eyeN),brow=part('male','brow',browN);
   draw(c,img,brow,W*.36,H*.39,W*.23,false);draw(c,img,brow,W*.64,H*.39,W*.23,true);
   draw(c,img,eye,W*.36,H*.51,W*.25,false);draw(c,img,eye,W*.64,H*.51,W*.25,true);
   draw(c,img,part('male','nose',noseN),W*.50,H*.63,W*.16);
   draw(c,img,part('male','mouth',mouthN),W*.50,H*.74,W*.27);
   const beardId=sel.beards||sel.mustaches;if(beardId)draw(c,img,part('male','beard',idx(beardId,(ATLAS.male.parts.beard||[]).length)),W*.50,H*.75,W*.72);
   const glassId=sel.glasses||sel.sunglasses;if(glassId)draw(c,img,part('male','glasses',idx(glassId,(ATLAS.male.parts.glasses||[]).length)),W*.50,H*.51,W*.72);
   const hairId=sel.hair;if(hairId)draw(c,img,part('male','hair',idx(hairId,(ATLAS.male.parts.hair||[]).length)),W*.50,H*.22,W*1.02);
   const hatId=sel.headwear;if(hatId)draw(c,img,part('male','hat',idx(hatId,(ATLAS.male.parts.hat||[]).length)),W*.50,H*.12,W*1.02);
 }
 async function render(){
   const r=root(),croot=canvasRoot(),s=slot();if(!r?.classList?.contains('open')||!croot||!s)return false;
   const g=gender(),sel=selected(g),id=activeId();if(!id)return false;
   const sig=g+'|'+id+'|'+JSON.stringify(sel);
   if(s.dataset.v833feSig===sig&&$('.v833-face-canvas',s))return true;
   const token=(Number(s.dataset.v833feToken)||0)+1;s.dataset.v833feToken=String(token);
   try{
     const img=await load(g);if(String(token)!==s.dataset.v833feToken)return false;
     const cv=document.createElement('canvas');cv.className='v833-face-canvas';cv.width=g==='female'?240:260;cv.height=g==='female'?280:300;
     if(g==='female')renderFemale(cv,img,sel);else renderMale(cv,img,sel);
     if(String(token)!==s.dataset.v833feToken)return false;
     s.innerHTML='';s.appendChild(cv);s.dataset.v833feSig=sig;
     document.documentElement.dataset.deenV833FaceEngine='ready';window.DEEN_V833_FACE_ERROR=null;return true;
   }catch(err){console.error('v8.3.3 face engine',err);window.DEEN_V833_FACE_ERROR=String(err?.message||err);return false}
 }
 function kick(){render()}
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v832k-real],#v812Wardrobe [data-v831-asset],#v812Wardrobe [data-v831-gender],#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe]'))[20,80,180].forEach(ms=>setTimeout(kick,ms))},true);
 const obs=new MutationObserver(()=>{if(root()?.classList?.contains('open'))queueMicrotask(kick)});setTimeout(()=>{const r=root();if(r)obs.observe(r,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})},350);
 [0,100,300,700,1400].forEach(ms=>setTimeout(kick,ms));
 window.DEEN_V833_FACE_ENGINE={version:VERSION,refresh:kick,check:()=>({version:VERSION,gender:gender(),active:activeId(),canvas:!!$('.v833-face-canvas',slot()),saveLocked:true,error:window.DEEN_V833_FACE_ERROR||null})};
 window.DEEN_RELEASE_VERSION=VERSION;setTimeout(()=>{document.title='DEEN v8.3.3 Face Engine'},500);
})();
