(()=>{
 const VERSION='8.5.0-RUNTIME-STABILITY',REV='850stable1';
 const PRE=`<script data-deen-v850-pre>(()=>{
  if(window.__deenV850Pre)return;window.__deenV850Pre=true;
  const Native=window.MutationObserver;
  const nativeSetTimeout=window.setTimeout.bind(window),nativeClearTimeout=window.clearTimeout.bind(window);
  const stats={version:'8.5.0-PRE',created:0,rawRecords:0,deliveredBatches:0,suppressedRecords:0,coalescedBatches:0,errors:0};
  if(typeof Native!=='function'){window.DEEN_V850_PRE={check:()=>({...stats,active:false})};return}
  const SELF='.v784-progress-strip,.v802-progress-strip,.v740-buy[data-v784-text]';
  function targetEl(m){const t=m?.target;return t?.nodeType===1?t:t?.parentElement||null}
  function suppress(m){
   if(m?.type!=='childList')return false;
   const t=targetEl(m);if(!t)return false;
   try{return !!t.closest?.(SELF)}catch(_){return false}
  }
  class StableMutationObserver{
   constructor(cb){
    if(typeof cb!=='function')throw new TypeError('MutationObserver callback must be a function');
    this._cb=cb;this._pending=[];this._timer=0;this._dead=false;stats.created++;
    this._native=new Native(records=>{
     stats.rawRecords+=records.length;
     for(const r of records){if(suppress(r)){stats.suppressedRecords++;continue}this._pending.push(r)}
     if(!this._pending.length||this._dead)return;
     if(this._timer){stats.coalescedBatches++;return}
     this._timer=nativeSetTimeout(()=>this._flush(),0);
    });
   }
   _flush(){
    this._timer=0;if(this._dead||!this._pending.length)return;
    const batch=this._pending.splice(0);stats.deliveredBatches++;
    try{this._cb(batch,this)}catch(err){stats.errors++;nativeSetTimeout(()=>{throw err},0)}
   }
   observe(...args){this._dead=false;return this._native.observe(...args)}
   disconnect(){this._dead=true;if(this._timer){nativeClearTimeout(this._timer);this._timer=0}this._pending.length=0;return this._native.disconnect()}
   takeRecords(){
    const direct=this._native.takeRecords();const kept=[];
    for(const r of direct){if(suppress(r)){stats.suppressedRecords++;continue}kept.push(r)}
    if(this._pending.length)kept.push(...this._pending.splice(0));
    return kept;
   }
  }
  StableMutationObserver.__deenV850=true;StableMutationObserver.__deenNative=Native;
  window.MutationObserver=StableMutationObserver;
  window.DEEN_V850_PRE={version:'8.5.0-PRE',check:()=>({...stats,active:window.MutationObserver===StableMutationObserver})};
 })();<\/script>`;
 window.DEEN_PATCH_V850_PRE=function(html){
  let out=String(html);if(out.includes('data-deen-v850-pre'))return{html:out,version:VERSION,applied:0};
  out+='\n'+PRE+'\n';return{html:out,version:VERSION,applied:1};
 };
 window.DEEN_PATCH_V850_POST=function(html){
  let out=String(html);if(out.includes('data-deen-v850-runtime'))return{html:out,version:VERSION,applied:0};
  out+=`\n<script src="./patches/v8.5.0.runtime-stability.runtime.js?v=${REV}" data-deen-v850-runtime><\/script>\n`;
  return{html:out,version:VERSION,applied:1};
 };
 window.DEEN_V850_BOOTSTRAP={version:VERSION,revision:REV};
})();
