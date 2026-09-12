(()=>{
 if(window.__deenV832HF2MHead)return;window.__deenV832HF2MHead=true;
 const VERSION='8.3.2-HF2M';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const LAYERS={
  male:['base_avatar','face_shapes','hair','headwear','eyebrows','eyes','noses','mouths','mustaches','beards','glasses','sunglasses'],
  female:['base_avatar','hair','hijabs','bangs','eyes','noses','mouths','blush','glasses','bows_ribbons','floral_accessories','clips','special_accessories']
 };
 const OPTIONAL=new Set(['headwear','hijabs','bangs','glasses','sunglasses','mustaches','beards','blush','bows_ribbons','floral_accessories','clips','special_accessories']);
 function root(){return $('#v812Wardrobe')}
 function mannequin(){return $('.v832k-mannequin',root())}
 function gender(){
   const m=mannequin();
   if(m?.dataset?.gender==='male'||m?.dataset?.gender==='female')return m.dataset.gender;
   try{return window.DEEN_AVATAR_ASSETS?.state?.().gender==='male'?'male':'female'}catch(_){}
   try{return state?.myWorld?.avatarAssets?.gender==='male'?'male':'female'}catch(_){}
   return 'female';
 }
 function stateFor(g){
   try{
     const a=window.DEEN_AVATAR_ASSETS?.state?.();
     if(a?.selected?.[g])return a.selected[g];
   }catch(_){}
   try{return state?.myWorld?.avatarAssets?.selected?.[g]||{}}catch(_){return {}}
 }
 function packs(g){return Array.isArray(window.DEEN_AVATAR_ASSET_PACKS?.[g])?window.DEEN_AVATAR_ASSET_PACKS[g]:[]}
 function def(g,cat){const a=packs(g).filter(x=>x?.category===cat);return a.find(x=>x.default)||a[0]||null}
 function pick(g,cat,sel){
   if(cat==='base_avatar')return def(g,cat);
   const has=Object.prototype.hasOwnProperty.call(sel||{},cat);
   const id=has?sel[cat]:null;
   if(has&&!id)return null;
   if(id)return packs(g).find(x=>x?.id===id)||null;
   return OPTIONAL.has(cat)?null:def(g,cat);
 }
 function applySprite(el,x){
   const sx=(Number(x.atlasW||x.w)/Number(x.w||112))*100;
   const sy=(Number(x.atlasH||x.h)/Number(x.h||112))*100;
   const px=Number(x.atlasW||x.w)===Number(x.w||112)?0:(Number(x.x||0)/(Number(x.atlasW||x.w)-Number(x.w||112)))*100;
   const py=Number(x.atlasH||x.h)===Number(x.h||112)?0:(Number(x.y||0)/(Number(x.atlasH||x.h)-Number(x.h||112)))*100;
   el.style.backgroundImage=`url("${x.src}")`;
   el.style.backgroundSize=`${sx}% ${sy}%`;
   el.style.backgroundPosition=`${px}% ${py}%`;
   el.style.backgroundRepeat='no-repeat';
 }
 function signature(g,sel){
   return g+'|'+LAYERS[g].map(cat=>{
     const x=pick(g,cat,sel);return x?.id||'-';
   }).join('|');
 }
 function renderHead(){
   const r=root(),m=mannequin(),slot=$('.v832k-head-slot',m);
   if(!r?.classList?.contains('open')||!m||!slot)return false;
   const g=gender(),sel=stateFor(g),ps=packs(g);
   if(!ps.length)return false;
   const sig=signature(g,sel);
   let stack=$('.v832m-head-stack',slot);
   if(stack?.dataset?.sig===sig)return true;
   slot.innerHTML='';
   stack=document.createElement('div');
   stack.className='v832m-head-stack';
   stack.dataset.sig=sig;
   for(const cat of LAYERS[g]){
     const x=pick(g,cat,sel); if(!x)continue;
     const s=document.createElement('span');
     s.className=`v832m-head-layer layer-${cat}`;
     s.dataset.assetId=x.id||'';
     applySprite(s,x);
     stack.appendChild(s);
   }
   slot.appendChild(stack);
   return stack.children.length>0;
 }
 function decorate(){
   const r=root(),m=mannequin();if(!r?.classList?.contains('open')||!m)return;
   $('.v832l-garment',m)?.remove();
   $('.v832l-step-badge',m)?.remove();
   const badge=$('.v832k-runtime-badge',r);if(badge)badge.textContent='HF2M · HEAD FIT TEST';
   const note=$('.v832k-body-note',m);if(note)note.textContent='GÖVDE + KAFA TESTİ';
   const f=$('.v812-footcopy',r);if(f)f.innerHTML='<b>Adım 1B · Kafa gövdeye bağlandı</b><small>Şimdilik kıyafet giydirme kapalı. Önce kafa, boyun ve omuz hizasını doğruluyoruz.</small>';
 }
 function tick(){
   const r=root();if(!r?.classList?.contains('open'))return;
   if(renderHead()){decorate();document.documentElement.dataset.deenHF2M='ready'}
 }
 setInterval(tick,120);
 [0,80,180,360,700,1200,2200].forEach(ms=>setTimeout(tick,ms));
 document.addEventListener('click',e=>{
   if(e.target.closest?.('#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe]')){
     [40,120,260,520].forEach(ms=>setTimeout(tick,ms));
   }
 },true);
 window.DEEN_HF2M={
   version:VERSION,refresh:tick,
   check:()=>({
     version:VERSION,gender:gender(),packs:packs(gender()).length,
     headLayers:$('.v832m-head-stack',root())?.children?.length||0,
     signature:$('.v832m-head-stack',root())?.dataset?.sig||null
   })
 };
 window.DEEN_RELEASE_VERSION=VERSION;
 setTimeout(()=>{document.title='DEEN v8.3.2 HF2M'},500);
})();