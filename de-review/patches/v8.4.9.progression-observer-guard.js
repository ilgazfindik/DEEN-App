(()=>{
 const VERSION='8.4.9-PROGRESSION-OBSERVER-STABILITY',REV='849loop1';
 window.DEEN_PATCH_V849_PRE=function(html){
  let out=String(html);
  if(out.includes('data-deen-v849-observer-guard'))return{html:out,version:VERSION,applied:0};
  out+=`\n<script data-deen-v849-observer-guard>(()=>{
 if(window.__deenV849ObserverGuard)return;
 window.__deenV849ObserverGuard=true;
 const VERSION='8.4.9-PROGRESSION-OBSERVER-STABILITY',REV='849loop1';
 const Native=window.MutationObserver;
 let created=0,suppressed=0,delivered=0;
 const SELF='.v784-progress-strip,.v802-progress-strip';
 function isSelfMutation(m){
  if(!m||m.type!=='childList')return false;
  const t=m.target;
  if(!t||t.nodeType!==1)return false;
  try{return !!(t.matches?.(SELF)||t.closest?.(SELF))}catch(_){return false}
 }
 function filter(records){
  const clean=[];
  for(const m of records||[]){
   if(isSelfMutation(m)){suppressed++;continue}
   clean.push(m);
  }
  return clean;
 }
 if(typeof Native==='function'&&!Native.__deenV849){
  class SafeMutationObserver{
   constructor(callback){
    if(typeof callback!=='function')throw new TypeError('MutationObserver callback must be a function');
    created++;
    this._callback=callback;
    this._native=new Native((records)=>{
     const clean=filter(records);
     if(!clean.length)return;
     delivered++;
     callback(clean,this);
    });
   }
   observe(target,options){return this._native.observe(target,options)}
   disconnect(){return this._native.disconnect()}
   takeRecords(){return filter(this._native.takeRecords())}
  }
  Object.defineProperty(SafeMutationObserver,'__deenV849',{value:true});
  Object.defineProperty(SafeMutationObserver,'__deenNative',{value:Native});
  window.MutationObserver=SafeMutationObserver;
 }
 document.documentElement.dataset.deenV849='ready';
 window.DEEN_V849_OBSERVER_GUARD={
  version:VERSION,
  revision:REV,
  check:()=>({version:VERSION,revision:REV,installed:!!window.MutationObserver?.__deenV849,created,suppressed,delivered,legacyStrip:document.querySelectorAll('.v784-progress-strip').length,stableStrip:document.querySelectorAll('.v802-progress-strip').length,journeyOpen:!!document.querySelector('.v792-balance-sheet,.v784-progression-sheet')})
 };
})();<\/script>\n`;
  return{html:out,version:VERSION,applied:1};
 };
 window.DEEN_V849_BOOTSTRAP={version:VERSION,revision:REV};
})();
