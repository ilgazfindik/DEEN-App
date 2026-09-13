(()=>{
 if(window.__deenV834HQComposite)return;window.__deenV834HQComposite=true;
 const VERSION='8.3.4-HQ-COMPOSITE',REV='834hq1';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const FILES={
  femaleFace:['female_face_640_1.b64'],
  maleFace:['male_face_640_1.b64','male_face_640_2.b64'],
  femaleOutfit:['female_outfits_hq_1.b64','female_outfits_hq_2.b64','female_outfits_hq_3.b64'],
  maleOutfit:['male_combos_hq_1.b64','male_combos_hq_2.b64']
 };
 const PATH='./assets/avatar-runtime/v4/';
 const FM={"w":1536,"h":1344,"face":[{"x":18,"y":12,"w":156,"h":168},{"x":210,"y":12,"w":156,"h":168},{"x":402,"y":12,"w":156,"h":168},{"x":591,"y":12,"w":161,"h":168},{"x":783,"y":12,"w":162,"h":168},{"x":977,"y":12,"w":158,"h":168}],"eye":[{"x":1203,"y":64,"w":90,"h":63},{"x":1395,"y":64,"w":90,"h":63},{"x":52,"y":256,"w":88,"h":63},{"x":243,"y":256,"w":90,"h":63},{"x":435,"y":256,"w":90,"h":63},{"x":626,"y":255,"w":92,"h":65},{"x":812,"y":254,"w":103,"h":67}],"brow":[{"x":1007,"y":272,"w":97,"h":32},{"x":1194,"y":272,"w":108,"h":32},{"x":1385,"y":272,"w":110,"h":31},{"x":35,"y":464,"w":121,"h":32},{"x":227,"y":464,"w":121,"h":31},{"x":418,"y":464,"w":124,"h":32}],"nose":[{"x":645,"y":443,"w":54,"h":74},{"x":834,"y":442,"w":59,"h":76},{"x":1025,"y":441,"w":61,"h":77},{"x":1222,"y":443,"w":52,"h":74},{"x":1414,"y":445,"w":52,"h":70}],"mouth":[{"x":52,"y":650,"w":88,"h":43},{"x":243,"y":652,"w":90,"h":40},{"x":463,"y":648,"w":34,"h":47},{"x":629,"y":648,"w":86,"h":47},{"x":820,"y":648,"w":88,"h":47},{"x":1018,"y":651,"w":76,"h":41},{"x":1218,"y":650,"w":59,"h":43},{"x":1400,"y":646,"w":79,"h":52},{"x":54,"y":842,"w":83,"h":43},{"x":244,"y":841,"w":88,"h":45}],"blush":[{"x":428,"y":824,"w":103,"h":79}]};
 const MM={"w":1536,"h":1920,"face":[{"x":18,"y":12,"w":155,"h":168},{"x":208,"y":12,"w":160,"h":168},{"x":400,"y":12,"w":159,"h":168},{"x":591,"y":12,"w":161,"h":168},{"x":784,"y":12,"w":160,"h":168},{"x":975,"y":12,"w":161,"h":168}],"eye":[{"x":1188,"y":31,"w":119,"h":130},{"x":1382,"y":33,"w":115,"h":126},{"x":37,"y":226,"w":117,"h":124},{"x":229,"y":227,"w":117,"h":121},{"x":422,"y":227,"w":115,"h":122}],"brow":[{"x":600,"y":262,"w":144,"h":52},{"x":794,"y":263,"w":139,"h":50},{"x":986,"y":265,"w":140,"h":45},{"x":1176,"y":263,"w":144,"h":50},{"x":1367,"y":263,"w":146,"h":49},{"x":22,"y":455,"w":148,"h":50},{"x":214,"y":456,"w":148,"h":47}],"nose":[{"x":429,"y":415,"w":101,"h":130},{"x":616,"y":408,"w":112,"h":144},{"x":812,"y":411,"w":103,"h":137},{"x":999,"y":410,"w":113,"h":139},{"x":1195,"y":414,"w":106,"h":131},{"x":1380,"y":411,"w":119,"h":137},{"x":44,"y":605,"w":103,"h":133},{"x":232,"y":607,"w":112,"h":130}],"mouth":[{"x":405,"y":643,"w":149,"h":58},{"x":599,"y":641,"w":146,"h":61},{"x":794,"y":640,"w":140,"h":63},{"x":979,"y":638,"w":153,"h":68},{"x":1178,"y":644,"w":139,"h":56},{"x":1363,"y":643,"w":153,"h":58},{"x":21,"y":835,"w":149,"h":58},{"x":217,"y":826,"w":142,"h":76}],"hair":[{"x":396,"y":800,"w":168,"h":127},{"x":588,"y":796,"w":168,"h":135},{"x":780,"y":796,"w":168,"h":136},{"x":972,"y":798,"w":168,"h":131},{"x":1164,"y":799,"w":168,"h":130},{"x":1356,"y":797,"w":168,"h":134},{"x":12,"y":989,"w":168,"h":133},{"x":204,"y":984,"w":168,"h":143},{"x":396,"y":989,"w":168,"h":134},{"x":588,"y":989,"w":168,"h":133},{"x":780,"y":986,"w":168,"h":140},{"x":972,"y":989,"w":168,"h":133},{"x":1164,"y":988,"w":168,"h":135},{"x":1356,"y":990,"w":168,"h":132}],"beard":[{"x":12,"y":1197,"w":168,"h":101},{"x":204,"y":1211,"w":168,"h":73},{"x":396,"y":1224,"w":168,"h":48},{"x":588,"y":1225,"w":168,"h":46},{"x":780,"y":1185,"w":168,"h":125},{"x":972,"y":1188,"w":168,"h":120},{"x":1164,"y":1227,"w":168,"h":41},{"x":1356,"y":1191,"w":168,"h":113},{"x":12,"y":1391,"w":168,"h":98},{"x":204,"y":1415,"w":168,"h":50},{"x":396,"y":1421,"w":168,"h":38},{"x":589,"y":1379,"w":166,"h":122},{"x":780,"y":1402,"w":168,"h":75}],"glasses":[{"x":984,"y":1382,"w":144,"h":115},{"x":1164,"y":1384,"w":168,"h":112},{"x":1360,"y":1384,"w":160,"h":112},{"x":14,"y":1576,"w":164,"h":112},{"x":218,"y":1576,"w":140,"h":112},{"x":398,"y":1574,"w":164,"h":115},{"x":593,"y":1580,"w":157,"h":104},{"x":783,"y":1580,"w":162,"h":104},{"x":986,"y":1575,"w":139,"h":113},{"x":1165,"y":1575,"w":166,"h":113},{"x":1360,"y":1576,"w":160,"h":112},{"x":15,"y":1768,"w":162,"h":112}],"hat":[{"x":204,"y":1762,"w":168,"h":124},{"x":396,"y":1761,"w":168,"h":125},{"x":588,"y":1768,"w":168,"h":112},{"x":780,"y":1772,"w":168,"h":104},{"x":972,"y":1774,"w":168,"h":99},{"x":1164,"y":1769,"w":168,"h":109},{"x":1356,"y":1761,"w":168,"h":125}]};
 const OUTFIT={female:[{"x":4,"y":18,"w":128,"h":355,"hole":{"x":62,"y":23,"w":36,"h":44}},{"x":132,"y":17,"w":109,"h":358,"hole":{"x":41,"y":23,"w":36,"h":44}},{"x":241,"y":17,"w":107,"h":359,"hole":{"x":39,"y":23,"w":36,"h":44}},{"x":348,"y":16,"w":111,"h":358,"hole":{"x":38,"y":23,"w":36,"h":43}},{"x":459,"y":17,"w":109,"h":353,"hole":{"x":38,"y":25,"w":36,"h":43}},{"x":568,"y":16,"w":119,"h":362,"hole":{"x":43,"y":26,"w":38,"h":44}},{"x":687,"y":17,"w":111,"h":359,"hole":{"x":39,"y":24,"w":37,"h":44}},{"x":798,"y":16,"w":109,"h":361,"hole":{"x":38,"y":26,"w":37,"h":40}},{"x":907,"y":16,"w":109,"h":361,"hole":{"x":38,"y":25,"w":36,"h":43}},{"x":1016,"y":16,"w":110,"h":361,"hole":{"x":36,"y":25,"w":38,"h":44}},{"x":1126,"y":16,"w":126,"h":359,"hole":{"x":37,"y":24,"w":35,"h":42}}],male:[{"x":18,"y":3,"w":90,"h":233},{"x":108,"y":1,"w":94,"h":234},{"x":202,"y":9,"w":91,"h":229},{"x":294,"y":3,"w":89,"h":234},{"x":384,"y":3,"w":98,"h":235},{"x":483,"y":3,"w":92,"h":233},{"x":575,"y":1,"w":107,"h":236},{"x":682,"y":2,"w":94,"h":235},{"x":776,"y":4,"w":91,"h":233},{"x":867,"y":4,"w":92,"h":232},{"x":964,"y":4,"w":86,"h":231},{"x":1055,"y":2,"w":82,"h":233}]};
 const CACHE={};
 function root(){return $('#v812Wardrobe')}
 function croot(){return $('.v832u-canvas',root())}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function gender(){const id=activeId();if(id?.startsWith('male_'))return'male';if(id?.startsWith('female_'))return'female';return croot()?.dataset?.gender==='male'?'male':'female'}
 function avatarState(){try{return window.DEEN_AVATAR_ASSETS?.state?.()||null}catch(_){return null}}
 function selected(g){return avatarState()?.selected?.[g]||{}}
 function idx(id,count,def=0){if(!count)return 0;const m=String(id||'').match(/(\d+)(?!.*\d)/);if(!m)return Math.min(def,count-1);return Math.max(0,(Number(m[1])-1)%count)}
 async function load(key){
   if(CACHE[key])return CACHE[key];
   CACHE[key]=(async()=>{
     const chunks=await Promise.all(FILES[key].map(async name=>{
       const r=await fetch(PATH+name+'?v='+REV,{cache:'no-store'});
       if(!r.ok)throw new Error(name+' HTTP '+r.status);
       return (await r.text()).replace(/\s+/g,'');
     }));
     const b=chunks.join(''); if(!b.startsWith('UklGR'))throw new Error(key+' invalid webp');
     const im=await new Promise((ok,bad)=>{const x=new Image();x.onload=()=>ok(x);x.onerror=()=>bad(new Error(key+' decode'));x.src='data:image/webp;base64,'+b});
     return im;
   })(); return CACHE[key];
 }
 function part(M,cat,n){const a=M[cat]||[];if(!a.length)return null;const p=a[Math.max(0,Math.min(a.length-1,n||0))];return {...p,_aw:M.w,_ah:M.h}}
 function drawPart(ctx,img,p,cx,cy,w,flip=false,alpha=1){
   if(!p||!w)return;const h=w*(p.h/p.w),rx=img.naturalWidth/p._aw,ry=img.naturalHeight/p._ah;
   ctx.save();ctx.globalAlpha=alpha;
   if(flip){ctx.translate(cx+w/2,cy-h/2);ctx.scale(-1,1);ctx.drawImage(img,p.x*rx,p.y*ry,p.w*rx,p.h*ry,0,0,w,h)}
   else ctx.drawImage(img,p.x*rx,p.y*ry,p.w*rx,p.h*ry,cx-w/2,cy-h/2,w,h);
   ctx.restore();
 }
 function composeFemale(img,sel){
   const cv=document.createElement('canvas');cv.width=240;cv.height=280;const c=cv.getContext('2d');const W=240,H=280;
   c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
   const faceN=idx(sel.face_shapes||sel.skin_tones,(FM.face||[]).length,0);
   const eyeN=idx(sel.eyes,(FM.eye||[]).length),browN=idx(sel.eyebrows,(FM.brow||[]).length),noseN=idx(sel.noses,(FM.nose||[]).length),mouthN=idx(sel.mouths,(FM.mouth||[]).length);
   drawPart(c,img,part(FM,'face',faceN),W*.50,H*.50,W*1.20);
   const e=part(FM,'eye',eyeN),b=part(FM,'brow',browN);
   drawPart(c,img,b,W*.31,H*.31,W*.31);drawPart(c,img,b,W*.69,H*.31,W*.31,true);
   drawPart(c,img,e,W*.31,H*.48,W*.34);drawPart(c,img,e,W*.69,H*.48,W*.34,true);
   drawPart(c,img,part(FM,'nose',noseN),W*.50,H*.63,W*.18);
   drawPart(c,img,part(FM,'mouth',mouthN),W*.50,H*.79,W*.29);
   if(sel.blush&&FM.blush){const p=part(FM,'blush',idx(sel.blush,FM.blush.length));drawPart(c,img,p,W*.25,H*.65,W*.22,false,.7);drawPart(c,img,p,W*.75,H*.65,W*.22,true,.7)}
   if(sel.glasses&&FM.glasses)drawPart(c,img,part(FM,'glasses',idx(sel.glasses,FM.glasses.length)),W*.50,H*.49,W*.95);
   return cv;
 }
 function composeMale(img,sel){
   const cv=document.createElement('canvas');cv.width=260;cv.height=300;const c=cv.getContext('2d');const W=260,H=300;
   c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
   const faceN=idx(sel.face_shapes,(MM.face||[]).length),eyeN=idx(sel.eyes,(MM.eye||[]).length),browN=idx(sel.eyebrows,(MM.brow||[]).length),noseN=idx(sel.noses,(MM.nose||[]).length),mouthN=idx(sel.mouths,(MM.mouth||[]).length);
   drawPart(c,img,part(MM,'face',faceN),W*.5,H*.57,W*.72);
   const e=part(MM,'eye',eyeN),b=part(MM,'brow',browN);
   drawPart(c,img,b,W*.36,H*.39,W*.23);drawPart(c,img,b,W*.64,H*.39,W*.23,true);
   drawPart(c,img,e,W*.36,H*.51,W*.25);drawPart(c,img,e,W*.64,H*.51,W*.25,true);
   drawPart(c,img,part(MM,'nose',noseN),W*.5,H*.63,W*.16);
   drawPart(c,img,part(MM,'mouth',mouthN),W*.5,H*.74,W*.27);
   const beard=sel.beards||sel.mustaches;if(beard)drawPart(c,img,part(MM,'beard',idx(beard,(MM.beard||[]).length)),W*.5,H*.75,W*.72);
   const glasses=sel.glasses||sel.sunglasses;if(glasses)drawPart(c,img,part(MM,'glasses',idx(glasses,(MM.glasses||[]).length)),W*.5,H*.51,W*.72);
   if(sel.hair)drawPart(c,img,part(MM,'hair',idx(sel.hair,(MM.hair||[]).length)),W*.5,H*.22,W*1.02);
   if(sel.headwear)drawPart(c,img,part(MM,'hat',idx(sel.headwear,(MM.hat||[]).length)),W*.5,H*.12,W*1.02);
   return cv;
 }
 function outfitIndex(g,id){const m=String(id||'').match(new RegExp('^'+g+'_(\\d{2})$'));if(!m)return 0;return Math.max(0,Math.min(OUTFIT[g].length-1,Number(m[1])-1))}
 function renderFemale(cv,outfitImg,faceImg,sel,id){
   const c=cv.getContext('2d'),S=cv.width,it=OUTFIT.female[outfitIndex('female',id)];c.clearRect(0,0,S,S);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
   const targetH=S*.92,scale=targetH/it.h,ow=it.w*scale,ox=S/2-ow/2,oy=S*.98-targetH,h=it.hole;
   const hx=ox+h.x*scale,hy=oy+h.y*scale,hw=h.w*scale,hh=h.h*scale,headW=hw*1.45,headH=hh*1.45;
   const f=composeFemale(faceImg,sel);c.drawImage(f,hx+hw/2-headW/2,hy-hh*.15,headW,headH);
   c.drawImage(outfitImg,it.x,it.y,it.w,it.h,ox,oy,ow,targetH);
 }
 function renderMale(cv,outfitImg,faceImg,sel,id){
   const c=cv.getContext('2d'),S=cv.width,it=OUTFIT.male[outfitIndex('male',id)];c.clearRect(0,0,S,S);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
   const targetH=S*.72,scale=targetH/it.h,ow=it.w*scale,ox=S/2-ow/2,oy=S*.96-targetH,headH=S*.22,headW=headH*.86,fy=oy-headH*.75;
   const f=composeMale(faceImg,sel);c.drawImage(f,S/2-headW/2,fy,headW,headH);
   c.drawImage(outfitImg,it.x,it.y,it.w,it.h,ox,oy,ow,targetH);
 }
 async function render(){
   const r=root(),cr=croot(),id=activeId();if(!r?.classList?.contains('open')||!cr||!id)return false;
   const g=gender(),sel=selected(g),sig=g+'|'+id+'|'+JSON.stringify(sel);
   if(cr.dataset.v834sig===sig&&$('.v834-composite-canvas',cr))return true;
   const token=(Number(cr.dataset.v834token)||0)+1;cr.dataset.v834token=String(token);
   try{
     const [outfitImg,faceImg]=await Promise.all([load(g==='female'?'femaleOutfit':'maleOutfit'),load(g==='female'?'femaleFace':'maleFace')]);
     if(String(token)!==cr.dataset.v834token)return false;
     let cv=$('.v834-composite-canvas',cr);if(!cv){cv=document.createElement('canvas');cv.className='v834-composite-canvas';cv.width=720;cv.height=720;cr.appendChild(cv)}
     if(g==='female')renderFemale(cv,outfitImg,faceImg,sel,id);else renderMale(cv,outfitImg,faceImg,sel,id);
     cr.dataset.v834sig=sig;cr.classList.add('v834-hq-ready');document.documentElement.dataset.deenV834='ready';window.DEEN_V834_ERROR=null;return true;
   }catch(err){console.error('v8.3.4 HQ composite',err);cr.classList.remove('v834-hq-ready');window.DEEN_V834_ERROR=String(err?.message||err);return false}
 }
 function kick(){render()}
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v832k-real],#v812Wardrobe [data-v831-asset],#v812Wardrobe [data-v831-gender],#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe]'))[20,80,180].forEach(ms=>setTimeout(kick,ms))},true);
 const obs=new MutationObserver(()=>{if(root()?.classList?.contains('open'))queueMicrotask(kick)});setTimeout(()=>{const r=root();if(r)obs.observe(r,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})},350);
 [0,120,360,800,1600].forEach(ms=>setTimeout(kick,ms));
 window.DEEN_V834_HQ_COMPOSITE={version:VERSION,refresh:kick,check:()=>({version:VERSION,gender:gender(),active:activeId(),canvas:!!$('.v834-composite-canvas',croot()),ready:croot()?.classList?.contains('v834-hq-ready')||false,saveLocked:true,error:window.DEEN_V834_ERROR||null})};
 window.DEEN_RELEASE_VERSION=VERSION;setTimeout(()=>{document.title='DEEN v8.3.4 HQ Composite'},500);
})();
