(()=>{
 if(window.__deenV834HQComposite)return;window.__deenV834HQComposite=true;
 const VERSION='8.3.4-HQ-COMPOSITE',REV='834hq4';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 function root(){return $('#v812Wardrobe')}
 function croot(){return $('.v832u-canvas',root())}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function isFemale(){return /^female_\d{2}$/.test(activeId()||'')}
 function cleanupLegacyComposite(cr){const cv=$('.v834-composite-canvas',cr);if(cv)cv.remove()}
 function refreshFace(){try{window.DEEN_V833_FACE_ENGINE?.refresh?.()}catch(_){} }
 function render(){
   const r=root(),cr=croot(),id=activeId();
   if(!r?.classList?.contains('open')||!cr||!id)return false;
   cleanupLegacyComposite(cr);
   if(!isFemale()){
     cr.classList.remove('v834-hq-ready');
     cr.dataset.v834sig='';
     return false;
   }
   refreshFace();
   const outfit=$('.v832u-outfit',cr),slot=$('.v832u-avatar-slot',cr),face=$('.v833-face-canvas',slot);
   const sig=id+'|'+(face?'face':'pending');
   cr.dataset.v834sig=sig;
   cr.classList.add('v834-hq-ready');
   document.documentElement.dataset.deenV834=face&&outfit?'ready':'warming';
   window.DEEN_V834_ERROR=null;
   return !!(outfit&&face);
 }
 function kick(){render()}
 document.addEventListener('click',e=>{
   if(e.target.closest?.('#v812Wardrobe [data-v832k-real],#v812Wardrobe [data-v831-asset],#v812Wardrobe [data-v831-gender],#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe]'))
     [0,30,90,180,360,700].forEach(ms=>setTimeout(kick,ms));
 },true);
 const obs=new MutationObserver(()=>{if(root()?.classList?.contains('open'))queueMicrotask(kick)});
 setTimeout(()=>{const r=root();if(r)obs.observe(r,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']})},250);
 const timer=setInterval(()=>{if(root()?.classList?.contains('open'))kick()},220);
 [0,80,220,520,1000,1700,2600].forEach(ms=>setTimeout(kick,ms));
 window.DEEN_V834_HQ_COMPOSITE={
   version:VERSION,revision:REV,refresh:kick,
   check:()=>({version:VERSION,revision:REV,active:activeId(),nativeOutfit:!!$('.v832u-outfit',croot()),face:!!$('.v833-face-canvas',$('.v832u-avatar-slot',croot())),legacyComposite:!!$('.v834-composite-canvas',croot()),ready:croot()?.classList?.contains('v834-hq-ready')||false,saveLocked:true,error:window.DEEN_V834_ERROR||null})
 };
 window.DEEN_RELEASE_VERSION=VERSION;
 setTimeout(()=>{document.title='DEEN v8.3.4 HQ Composite'},500);
})();
