(()=>{
 if(window.__deenV850Runtime)return;window.__deenV850Runtime=true;
 const VERSION='8.5.0-RUNTIME-STABILITY',REV='850stable1';
 let progressPollStopped=false,stopAttempts=0,forcedProgressCloses=0,recoveredOverflow=0,recoveredWorldLocks=0,lastError=null;
 function visible(el){
  if(!el||!el.isConnected)return false;
  try{const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)!==0&&!!(el.offsetWidth||el.offsetHeight||el.getClientRects().length)}catch(_){return false}
 }
 function visibleBlockingOverlay(){
  const selectors=['.v780-sheet','#v812Wardrobe.open','#v820RoomOverlay.open','#v820ShopOverlay.open','#v821AreasOverlay.open','#v821MemoriesOverlay.open','#v830Unsaved.open','#v765AvatarOverlay'];
  for(const sel of selectors){for(const el of document.querySelectorAll(sel)){if(visible(el))return true}}
  return false;
 }
 function stopProgressPoll(){
  stopAttempts++;
  try{
   const p=window.DEEN_WORLD_PROGRESS_STABLE;
   if(!p?.stop)return false;
   p.stop();progressPollStopped=true;return true;
  }catch(err){lastError='stopProgressPoll: '+String(err?.message||err);return false}
 }
 function normalizeLocks(){
  try{
   const visibleSheet=[...document.querySelectorAll('.v780-sheet')].some(visible);
   if(!visibleSheet)document.body.classList.remove('v780-sheet-open');
   if(visibleBlockingOverlay())return false;
   if(document.body.style.overflow==='hidden'){document.body.style.overflow='';recoveredOverflow++}
   const wb=document.getElementById('worldScreenBody');
   if(wb){
    if(wb.style.pointerEvents==='none'){wb.style.pointerEvents='auto';recoveredWorldLocks++}
    if(wb.hasAttribute('inert')){wb.removeAttribute('inert');recoveredWorldLocks++}
    if(wb.style.visibility==='hidden'){wb.style.visibility='';recoveredWorldLocks++}
   }
   return true;
  }catch(err){lastError='normalizeLocks: '+String(err?.message||err);return false}
 }
 function closeProgress(){
  try{
   const sheets=[...document.querySelectorAll('.v780-sheet.v784-progression-sheet')];
   if(!sheets.length)return false;
   forcedProgressCloses+=sheets.length;sheets.forEach(el=>el.remove());
   document.body.classList.remove('v780-sheet-open');normalizeLocks();return true;
  }catch(err){lastError='closeProgress: '+String(err?.message||err);return false}
 }
 document.addEventListener('click',e=>{
  if(e.target.closest?.('.v784-progression-sheet .v780-close')){
   e.preventDefault();e.stopImmediatePropagation();closeProgress();return;
  }
  if(e.target.closest?.('.navbtn,[data-close],[data-v812-cancel],[data-v812-save]'))setTimeout(normalizeLocks,0);
 },true);
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&document.querySelector('.v784-progression-sheet')){e.preventDefault();closeProgress();return}
  if(e.key==='Escape')setTimeout(normalizeLocks,0);
 },true);
 window.addEventListener('pageshow',()=>{setTimeout(stopProgressPoll,0);setTimeout(normalizeLocks,20)});
 window.addEventListener('focus',()=>setTimeout(normalizeLocks,20));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){setTimeout(stopProgressPoll,0);setTimeout(normalizeLocks,20)}});
 [0,120,400,900,1600,2600].forEach(ms=>setTimeout(()=>{stopProgressPoll();normalizeLocks()},ms));
 document.documentElement.dataset.deenV850='ready';
 window.DEEN_V850_STABILITY={
  version:VERSION,revision:REV,closeProgress,normalize:normalizeLocks,stopProgressPoll,
  check:()=>({
   version:VERSION,revision:REV,progressPollStopped,stopAttempts,forcedProgressCloses,recoveredOverflow,recoveredWorldLocks,lastError,
   progressionSheets:document.querySelectorAll('.v784-progression-sheet').length,
   bodySheetOpen:document.body.classList.contains('v780-sheet-open'),bodyOverflow:document.body.style.overflow||'',
   observer:window.DEEN_V850_PRE?.check?.()||null
  })
 };
 window.DEEN_RELEASE_VERSION=VERSION;window.DEEN_RENDER_ARBITRATION='V850_RUNTIME_STABILITY';
})();
