(()=>{
 if(window.__deenV847WardrobePerf)return;
 window.__deenV847WardrobePerf=true;
 const VERSION='8.4.7-WARDROBE-PERFORMANCE',REV='847perf1';
 let blockedScrolls=0,blockedReconciles=0;

 // v8.1.3 schedules smooth scrollIntoView after every wardrobe render.
 // When users move across many tabs/options those animations can pile up.
 const currentScroll=Element.prototype.scrollIntoView;
 if(typeof currentScroll==='function'&&!currentScroll.__deenV847){
  const nativeScroll=currentScroll;
  function safeScroll(arg){
   try{
    if(this?.closest?.('#v812Wardrobe')){
     blockedScrolls++;
     return;
    }
   }catch(_){}
   return nativeScroll.call(this,arg);
  }
  safeScroll.__deenV847=true;
  safeScroll.__deenNative=nativeScroll;
  Element.prototype.scrollIntoView=safeScroll;
 }

 // v8.3.0 queues reconcile() after every document click. Wardrobe-internal
 // option/tab clicks do not need a full Dünyam reconciliation. Suppress only
 // that exact callback while wardrobe is open; module navigation remains intact.
 const currentTimeout=window.setTimeout;
 if(typeof currentTimeout==='function'&&!currentTimeout.__deenV847){
  const nativeTimeout=currentTimeout.bind(window);
  function guardedTimeout(fn,delay,...args){
   try{
    if(typeof fn==='function' &&
       fn.name==='reconcile' &&
       document.querySelector('#v812Wardrobe.open') &&
       !document.querySelector('#v830Unsaved.open')){
      blockedReconciles++;
      return 0;
    }
   }catch(_){}
   return nativeTimeout(fn,delay,...args);
  }
  guardedTimeout.__deenV847=true;
  guardedTimeout.__deenNative=currentTimeout;
  window.setTimeout=guardedTimeout;
 }

 document.documentElement.dataset.deenV847='ready';
 window.DEEN_V847_PERF={
  version:VERSION,
  revision:REV,
  check:()=>({
   version:VERSION,
   wardrobeOpen:!!document.querySelector('#v812Wardrobe.open'),
   blockedScrolls,
   blockedReconciles,
   scrollGuard:!!Element.prototype.scrollIntoView?.__deenV847,
   timeoutGuard:!!window.setTimeout?.__deenV847
  })
 };
 window.DEEN_RELEASE_VERSION=VERSION;
 window.DEEN_RENDER_ARBITRATION='V847_WARDROBE_PERFORMANCE';
})();
