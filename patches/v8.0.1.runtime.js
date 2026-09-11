(()=>{
 if(window.__deenV801Applied)return;window.__deenV801Applied=true;
 const VERSION='8.0.1',STATE_VERSION=67;
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.0.1 — Dünyam Entry Freeze Hotfix';
 let seq=0;
 function worldActive(){return !!document.getElementById('worldScreen')?.classList.contains('active')}
 function avatarCreated(){return state?.myWorld?.avatar?.created===true}
 function clearLockClasses(){
   const body=document.getElementById('worldScreenBody');
   if(body){body.style.visibility='';body.style.pointerEvents='auto';body.removeAttribute('inert')}
   if(avatarCreated()){
     document.getElementById('worldScreen')?.classList.remove('v773-gated');
     document.getElementById('v773WorldGate')?.remove();
   }
   document.querySelectorAll('#worldScreenBody .v750-stage-card').forEach(x=>x.classList.remove('v776-busy','v777-interacting'));
   document.querySelectorAll('#worldScreenBody .dragging,.v750-character').forEach(x=>x.classList.remove('dragging','moving','left','v751-character-walking','v751-character-arrive','v782-acting'));
   try{window.DEEN_WORLD_UX?.recover?.()}catch(e){}
   try{window.DEEN_WORLD_ACTIONS?.clear?.()}catch(e){}
 }
 function closeInvisibleWorldLayers(){
   document.querySelectorAll('#worldScreenBody .v789-preview,.v780-sheet').forEach(el=>{
     if(!el.isConnected)return;
     const s=getComputedStyle(el),visible=s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)!==0&&!!(el.offsetWidth||el.offsetHeight||el.getClientRects().length);
     if(!visible)el.remove();
   });
   if(!document.querySelector('#worldScreenBody .v789-preview'))document.body.classList.remove('v789-preview-open');
   if(![...document.querySelectorAll('.v780-sheet')].some(el=>{const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)!==0&&!!(el.offsetWidth||el.offsetHeight||el.getClientRects().length)}))document.body.classList.remove('v780-sheet-open');
 }
 function top(){const body=document.getElementById('worldScreenBody');if(!body)return false;body.scrollTop=0;body.scrollLeft=0;return true}
 function ensureHome(){
   if(!worldActive())return false;
   if(!document.getElementById('v750Room')){
     try{window.DEEN_WORLD?.tab?.('world')}catch(e){}
   }
   return true;
 }
 function recover(reason='manual',forceHome=false){
   seq++;
   if(forceHome)ensureHome();
   clearLockClasses();closeInvisibleWorldLayers();
   if(forceHome)top();
   try{window.DEEN_WORLD_FINAL?.stabilize?.('v801-'+reason)}catch(e){}
   clearLockClasses();
   if(forceHome)top();
   try{window.DEEN_WORLD_SIMPLE?.decorate?.()}catch(e){}
   try{window.DEEN_WORLD_DIRECT?.decorate?.()}catch(e){}
   try{window.DEEN_WORLD_IDLE?.reschedule?.()}catch(e){}
   return snapshot(reason);
 }
 function enter(reason='nav'){
   [0,70,180,360].forEach((ms,i)=>setTimeout(()=>recover(reason+'-'+i,true),ms));
 }
 function snapshot(reason='snapshot'){
   const body=document.getElementById('worldScreenBody'),stage=document.querySelector('#worldScreenBody .v750-stage-card');
   return {version:VERSION,stateVersion:Number(state?.stateVersion)||0,reason,worldActive:worldActive(),scrollTop:body?.scrollTop||0,room:!!document.getElementById('v750Room'),bodyPointer:body?.style.pointerEvents||'',gated:!!document.getElementById('worldScreen')?.classList.contains('v773-gated'),busy:!!stage?.classList.contains('v776-busy'),interacting:!!stage?.classList.contains('v777-interacting'),previewOpen:!!document.querySelector('#worldScreenBody .v789-preview'),sheetOpen:!![...document.querySelectorAll('.v780-sheet')].some(el=>{const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)!==0})};
 }
 document.addEventListener('click',e=>{if(e.target.closest?.('.navbtn[data-screen="worldScreen"]'))enter('bottom-nav')},true);
 window.addEventListener('pageshow',()=>{if(worldActive())setTimeout(()=>recover('pageshow',false),100)});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&worldActive())setTimeout(()=>recover('visibility',false),100)});
 window.addEventListener('focus',()=>{if(worldActive())setTimeout(()=>recover('focus',false),120)});
 state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);try{saveState?.()}catch(e){}
 window.DEEN_WORLD_ENTRY_FIX={version:VERSION,stateVersion:STATE_VERSION,enter,recover,top,snapshot};
 setTimeout(()=>{if(worldActive())recover('boot-active',false)},900);
})();
