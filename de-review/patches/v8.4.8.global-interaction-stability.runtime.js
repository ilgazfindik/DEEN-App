(()=>{
 if(window.__deenV848GlobalStability)return;
 window.__deenV848GlobalStability=true;
 const VERSION='8.4.8-GLOBAL-INTERACTION-STABILITY',REV='848global1';
 let blockedReconciles=0,blockedScrolls=0,coalescedRoomRenders=0,coalescedShopRenders=0;
 let pendingRoomRender=0,pendingShopRender=0;

 // v8.1.3 decorates the wardrobe after most renders and schedules a smooth
 // scrollIntoView each time. Do not allow those animations to accumulate.
 const currentScroll=Element.prototype.scrollIntoView;
 if(typeof currentScroll==='function'&&!currentScroll.__deenV848){
  const nativeScroll=currentScroll.__deenNative||currentScroll;
  function stableScroll(arg){
   try{
    if(this?.closest?.('#v812Wardrobe')){
     blockedScrolls++;
     return;
    }
   }catch(_){}
   return nativeScroll.call(this,arg);
  }
  stableScroll.__deenV848=true;
  stableScroll.__deenNative=nativeScroll;
  Element.prototype.scrollIntoView=stableScroll;
 }

 // v8.3.0 has an anonymous document click listener which queues the named
 // reconcile() callback after EVERY click. The real module transitions call
 // reconcile from their own anonymous transition callbacks, so suppressing
 // only the directly scheduled named function removes redundant global work
 // without disabling open/close reconciliation.
 const currentTimeout=window.setTimeout;
 if(typeof currentTimeout==='function'&&!currentTimeout.__deenV848){
  const nativeTimeout=(currentTimeout.__deenNative||currentTimeout).bind(window);
  const nativeClear=window.clearTimeout.bind(window);
  function stableTimeout(fn,delay,...args){
   try{
    if(typeof fn==='function'&&fn.name==='reconcile'){
     blockedReconciles++;
     return 0;
    }
    // Room preset/equip/buy flows may queue several delayed full rail renders.
    // Keep only the latest delayed render; synchronous category renders remain
    // untouched so the UI still responds immediately.
    if(typeof fn==='function'&&fn.name==='renderRoomRail'&&Number(delay)>=50){
     if(pendingRoomRender){nativeClear(pendingRoomRender);coalescedRoomRenders++}
     pendingRoomRender=nativeTimeout(()=>{pendingRoomRender=0;fn(...args)},delay);
     return pendingRoomRender;
    }
    if(typeof fn==='function'&&fn.name==='renderShop'&&Number(delay)>=50){
     if(pendingShopRender){nativeClear(pendingShopRender);coalescedShopRenders++}
     pendingShopRender=nativeTimeout(()=>{pendingShopRender=0;fn(...args)},delay);
     return pendingShopRender;
    }
   }catch(_){}
   return nativeTimeout(fn,delay,...args);
  }
  stableTimeout.__deenV848=true;
  stableTimeout.__deenNative=currentTimeout.__deenNative||currentTimeout;
  window.setTimeout=stableTimeout;
 }

 document.documentElement.dataset.deenV848='ready';
 window.DEEN_V848_STABILITY={
  version:VERSION,
  revision:REV,
  check:()=>({
   version:VERSION,
   blockedReconciles,
   blockedScrolls,
   coalescedRoomRenders,
   coalescedShopRenders,
   roomOpen:!!document.querySelector('#v820RoomOverlay.open'),
   wardrobeOpen:!!document.querySelector('#v812Wardrobe.open'),
   timeoutGuard:!!window.setTimeout?.__deenV848,
   scrollGuard:!!Element.prototype.scrollIntoView?.__deenV848
  })
 };
 window.DEEN_RELEASE_VERSION=VERSION;
 window.DEEN_RENDER_ARBITRATION='V848_GLOBAL_INTERACTION_STABILITY';
})();
