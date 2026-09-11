(()=>{
 if(window.__deenV800Applied)return;window.__deenV800Applied=true;
 const VERSION='8.0.0',STATE_VERSION=66;
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.0.0 — Dünyam Final Stabilization';
 const TYPES=['desk','rug','plant','shelf','window','nur'];
 const STARTER={desk:null,rug:'rug_teal',plant:null,shelf:null,window:null,nur:null};
 let timer=0,lastHealth=null,previewReturnTab=null,previewWasOpen=false;
 function save(){try{saveState?.()}catch(e){}}
 function worldActive(){return !!document.getElementById('worldScreen')?.classList.contains('active')}
 function visible(el){if(!el||!el.isConnected)return false;const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)!==0&&!!(el.offsetWidth||el.offsetHeight||el.getClientRects().length)}
 function ensureState(){
   state.myWorld=state.myWorld&&typeof state.myWorld==='object'?state.myWorld:{};
   state.myWorld.owned=Array.isArray(state.myWorld.owned)?[...new Set(state.myWorld.owned.filter(Boolean))]:[];
   const e=state.myWorld.equipped&&typeof state.myWorld.equipped==='object'?state.myWorld.equipped:{};
   for(const t of TYPES)if(!Object.prototype.hasOwnProperty.call(e,t))e[t]=STARTER[t];
   if(!e.rug)e.rug='rug_teal';state.myWorld.equipped=e;
   const p=state.myWorld.progression&&typeof state.myWorld.progression==='object'?state.myWorld.progression:{};
   p.nur=Math.max(0,Number(p.nur)||0);p.levelClaims=Array.isArray(p.levelClaims)?[...new Set(p.levelClaims.map(Number).filter(n=>n>=2&&n<=7))]:[];
   if(!p.daily||typeof p.daily!=='object')p.daily={date:'',visited:false,items:[],claimed:[]};
   p.daily.items=Array.isArray(p.daily.items)?[...new Set(p.daily.items.filter(Boolean))]:[];
   p.daily.claimed=Array.isArray(p.daily.claimed)?[...new Set(p.daily.claimed.filter(Boolean))]:[];
   state.myWorld.progression=p;
   const rp=state.myWorld.roomPresets;
   if(rp&&typeof rp==='object'&&rp.slots&&typeof rp.slots==='object'){
     for(const id of ['work','night','nature']){
       const s=rp.slots[id];if(!s||!s.snapshot||typeof s.snapshot!=='object')continue;
       for(const t of TYPES)if(!Object.prototype.hasOwnProperty.call(s.snapshot,t))s.snapshot[t]=STARTER[t];
     }
   }
   state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);return true;
 }
 function hardenPreview(){
   const P=window.DEEN_WORLD_PREVIEW,W=window.DEEN_WORLD;if(!P||!W||P.__v800)return false;
   const oldOpen=P.open?.bind(P),oldClose=P.close?.bind(P);if(typeof oldOpen!=='function')return false;
   P.open=function(id){
     if(!document.getElementById('v750Room')){
       previewReturnTab='shop';try{W.tab?.('world')}catch(e){previewReturnTab=null;return false}
       setTimeout(()=>{const ok=oldOpen(id);previewWasOpen=!!ok;if(!ok&&previewReturnTab){const tab=previewReturnTab;previewReturnTab=null;try{W.tab?.(tab)}catch(e){}}},90);
       return true;
     }
     const ok=oldOpen(id);previewWasOpen=!!ok;
     if(!ok&&previewReturnTab){try{W.tab?.(previewReturnTab)}catch(e){};previewReturnTab=null;previewWasOpen=false}
     return ok;
   };
   if(typeof oldClose==='function')P.close=function(reason){const ok=oldClose(reason);const tab=previewReturnTab;previewReturnTab=null;previewWasOpen=false;if(tab)setTimeout(()=>{try{W.tab?.(tab)}catch(e){}},30);return ok};
   P.__v800=true;return true;
 }
 function restorePreviewTabIfNeeded(){
   const open=!!document.querySelector('#worldScreenBody .v789-preview');
   if(previewWasOpen&&!open&&previewReturnTab){const tab=previewReturnTab;previewReturnTab=null;previewWasOpen=false;setTimeout(()=>{try{window.DEEN_WORLD?.tab?.(tab)}catch(e){}},35)}
   else if(open)previewWasOpen=true;
 }
 function cleanDuplicates(selector,keep='last'){const nodes=[...document.querySelectorAll(selector)];if(nodes.length<=1)return 0;const survivor=keep==='first'?nodes[0]:nodes[nodes.length-1];let n=0;for(const x of nodes){if(x!==survivor){x.remove();n++}}return n}
 function cleanTransient(){
   let removed=0;
   removed+=cleanDuplicates('#worldScreenBody .v789-preview');
   removed+=cleanDuplicates('#worldScreenBody .v790-presets');
   removed+=cleanDuplicates('#worldScreenBody .v788-shop');
   removed+=cleanDuplicates('#worldScreenBody .v791-shop-polish');
   restorePreviewTabIfNeeded();
   const previews=[...document.querySelectorAll('#worldScreenBody .v789-preview')];
   if(previews.length===0)document.body.classList.remove('v789-preview-open');
   const sheets=[...document.querySelectorAll('.v780-sheet')].filter(visible);
   if(sheets.length===0)document.body.classList.remove('v780-sheet-open');
   const room=document.getElementById('v750Room');
   if(room){room.classList.remove('moving','v751-character-walking','v751-character-arrive');}
   document.querySelectorAll('#worldScreenBody .v750-character').forEach(x=>{x.classList.remove('moving','v751-character-walking','v751-character-arrive')});
   return removed;
 }
 function avatarSnapshot(){const a=state.avatar||{};const keys=['gender','skin','face','eyes','brows','nose','mouth','headwear','head','hairColor','hijabColor','beard','outfit','glasses','extra','created','libraryVersion'];const out={};for(const k of keys)out[k]=a[k];return out}
 function check(){
   const room=document.getElementById('v750Room'),body=document.getElementById('worldScreenBody');
   const apis=['DEEN_WORLD','DEEN_INTERACTIVE_WORLD','DEEN_LIVING_WORLD','DEEN_WORLD_ACTIONS','DEEN_WORLD_IDLE','DEEN_WORLD_PROGRESSION','DEEN_WORLD_LEVELUP','DEEN_WORLD_EVOLUTION','DEEN_WORLD_DECOR','DEEN_WORLD_COLLECTION','DEEN_WORLD_PREVIEW','DEEN_WORLD_PRESETS','DEEN_WORLD_SHOP_POLISH','DEEN_WORLD_BALANCE'];
   const missing=apis.filter(k=>!window[k]);
   const ids=[...document.querySelectorAll('[id]')].map(x=>x.id).filter(Boolean),dupIds=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
   const overflow=!!(body&&body.scrollWidth>body.clientWidth+1);
   const previewCount=document.querySelectorAll('#worldScreenBody .v789-preview').length;
   const presetCount=document.querySelectorAll('#worldScreenBody .v790-presets').length;
   const shopCount=document.querySelectorAll('#worldScreenBody .v788-shop').length;
   const prog=(()=>{try{return window.DEEN_WORLD_PROGRESSION?.snapshot?.()||null}catch(e){return null}})();
   return {version:VERSION,stateVersion:Number(state.stateVersion)||0,worldActive:worldActive(),room:!!room,missingApis:missing,duplicateIds:dupIds,overflow,previewCount,presetCount,shopCount,gold:Number(state.currency)||0,nur:Number(prog?.nur)||0,level:Number(prog?.level)||1,avatar:avatarSnapshot()};
 }
 function refreshSystems(){
   hardenPreview();
   try{window.DEEN_WORLD_DECOR?.apply?.()}catch(e){}
   try{window.DEEN_WORLD_COLLECTION?.apply?.()}catch(e){}
   try{window.DEEN_WORLD_EVOLUTION?.apply?.(false)}catch(e){}
   try{window.DEEN_WORLD_SHOP_POLISH?.refresh?.()}catch(e){}
   try{window.DEEN_WORLD_PRESETS?.refresh?.()}catch(e){}
   try{window.DEEN_WORLD_BALANCE?.refresh?.()}catch(e){}
   if(worldActive()&&!visible(document.querySelector('.v780-sheet'))&&!visible(document.querySelector('#worldScreenBody .v789-preview'))){try{window.DEEN_WORLD_IDLE?.reschedule?.()}catch(e){}}
 }
 function stabilize(reason='manual'){
   clearTimeout(timer);ensureState();const removed=cleanTransient();save();refreshSystems();lastHealth=check();lastHealth.reason=reason;lastHealth.cleaned=removed;return {...lastHealth};
 }
 function schedule(reason,ms=120){clearTimeout(timer);timer=setTimeout(()=>stabilize(reason),ms)}
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule('visibility',100)});
 window.addEventListener('pageshow',()=>schedule('pageshow',120));
 window.addEventListener('focus',()=>schedule('focus',140));
 document.addEventListener('click',e=>{if(e.target.closest?.('.navbtn[data-screen="worldScreen"],#worldScreenBody [data-v780="edit"],#worldScreenBody [data-v788-buy],#worldScreenBody [data-v788-use],#worldScreenBody [data-v790-apply],#worldScreenBody [data-v790-save]'))schedule('interaction',220)},true);
 ensureState();hardenPreview();save();
 window.DEEN_WORLD_FINAL={version:VERSION,stateVersion:STATE_VERSION,stabilize,check,snapshot:()=>({...check(),lastHealth:lastHealth?{...lastHealth}:null})};
 setTimeout(()=>stabilize('boot'),950);
})();
