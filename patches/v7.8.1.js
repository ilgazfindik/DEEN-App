(()=>{
  const VERSION='7.8.1',STATE_VERSION=54;
  const addition=`
<!-- DEEN v7.8.1 — Direct Object Movement & Minimal Controls -->
<style id="deen-v781-direct-world-css">
#worldScreenBody .v780-actions{grid-template-columns:1fr!important;margin-top:8px!important}
#worldScreenBody .v780-actions [data-v780="move"]{display:none!important}
#worldScreenBody .v780-action[data-v780="edit"]{min-height:42px!important;background:linear-gradient(180deg,#102b33,#0c252c)!important}
#worldScreenBody .v750-object[role="button"]{cursor:pointer;touch-action:manipulation}
#worldScreenBody .v750-object[role="button"]:not(.dragging):active{filter:brightness(1.12) drop-shadow(0 0 10px rgba(126,225,201,.28))!important}
#worldScreenBody .v781-direct-hint{display:flex;align-items:center;justify-content:center;gap:6px;margin:7px 2px 0;padding:6px 9px;border-radius:11px;border:1px solid rgba(119,208,189,.11);background:rgba(13,42,49,.52);color:#829da1;font-size:6.8px;line-height:1.2;transition:opacity .25s,transform .25s}
#worldScreenBody .v781-direct-hint b{color:#a9d8ce;font-weight:900}
#worldScreenBody .v781-direct-hint.hide{opacity:0;transform:translateY(-2px);pointer-events:none}
#worldScreenBody .v781-window-tap{position:absolute;right:17px;top:24px;width:101px;height:124px;z-index:18;border:0;background:transparent;border-radius:39px 39px 10px 10px;cursor:pointer;touch-action:manipulation}
#worldScreenBody .v781-window-tap:after{content:'';position:absolute;inset:7px;border-radius:32px 32px 7px 7px;border:1px solid transparent;transition:border-color .16s,box-shadow .16s,background .16s}
#worldScreenBody .v781-window-tap:active:after{border-color:rgba(126,224,202,.28);box-shadow:0 0 16px rgba(105,218,194,.13);background:rgba(109,216,194,.025)}
#worldScreenBody .v750-room.garden .v781-window-tap{display:none}
#worldScreenBody .v781-tap-pulse{position:absolute;z-index:88;width:30px;height:30px;margin:-15px 0 0 -15px;border:1px solid rgba(152,235,216,.52);border-radius:50%;pointer-events:none;animation:v781Pulse .48s ease-out both}
@keyframes v781Pulse{0%{opacity:.85;transform:scale(.45);box-shadow:0 0 0 0 rgba(128,224,202,.18)}100%{opacity:0;transform:scale(1.7);box-shadow:0 0 0 10px rgba(128,224,202,0)}}
.v780-menu-item.v781-movement .ico{background:#173b45;color:#9adbd0}
@media(max-width:390px){#worldScreenBody .v781-window-tap{right:17px;top:24px;width:101px;height:124px}#worldScreenBody .v781-direct-hint{font-size:6.3px}}
</style>
<script id="deen-v781-direct-world-js">
(()=>{
 if(window.__deenV781Applied)return;window.__deenV781Applied=true;
 const VERSION='7.8.1',STATE_VERSION=54;
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v7.8.1 — Direct Object Movement & Minimal Controls';
 const IW=window.DEEN_INTERACTIVE_WORLD,LW=window.DEEN_LIVING_WORLD,SIMPLE=window.DEEN_WORLD_SIMPLE,UX=window.DEEN_WORLD_UX;
 if(!IW||!LW||!SIMPLE)return;
 let scheduled=false,windowBusy=false;
 function world(){return document.querySelector('#worldScreenBody .v750-world')}
 function room(){return document.getElementById('v750Room')}
 function editing(){try{return !!IW.state?.().editMode}catch(e){return false}}
 function save(){try{saveState?.()}catch(e){}}
 function hintSeen(){return !!state.myWorld?.directInteractionHintSeen}
 function markHint(){if(!state.myWorld)return;state.myWorld.directInteractionHintSeen=true;save();document.querySelector('#worldScreenBody .v781-direct-hint')?.classList.add('hide')}
 function pulse(clientX,clientY){const r=room();if(!r)return;const b=r.getBoundingClientRect(),p=document.createElement('span');p.className='v781-tap-pulse';p.style.left=(clientX-b.left)+'px';p.style.top=(clientY-b.top)+'px';r.append(p);setTimeout(()=>p.remove(),560)}
 function compactActions(){const w=world();if(!w)return;let actions=document.querySelector('#worldScreenBody .v780-actions');if(!actions){const stage=document.querySelector('#worldScreenBody .v750-stage-card');if(stage){actions=document.createElement('div');actions.className='v780-actions';actions.innerHTML='<button class="v780-action" type="button" data-v780="edit"><span class="ico">✎</span>ODA DÜZENİ</button>';stage.insertAdjacentElement('afterend',actions);actions.querySelector('[data-v780="edit"]')?.addEventListener('click',()=>{IW.edit?.();setTimeout(decorate,100)})}}actions?.querySelector('[data-v780="move"]')?.remove();const edit=actions?.querySelector('[data-v780="edit"]');if(edit&&!editing()){edit.innerHTML='<span class="ico">✎</span>ODA DÜZENİ'}
   document.querySelector('#worldScreenBody .v781-direct-hint')?.remove();
   if(!hintSeen()&&!editing()&&actions){const h=document.createElement('div');h.className='v781-direct-hint';h.innerHTML='<span>✦</span><span><b>Eşyalara dokun</b> · karakterin yanına gidip tepki verir.</span>';actions.before(h);setTimeout(()=>h.classList.add('hide'),6500)}
 }
 function bindDirectObjects(){const r=room();if(!r||editing())return;r.querySelectorAll('.v750-object[data-item]').forEach(el=>{const item=el.dataset.item;if(!item)return;el.setAttribute('role','button');el.tabIndex=0;el.onclick=e=>{e.preventDefault();e.stopPropagation();if(editing())return false;markHint();pulse(e.clientX||0,e.clientY||0);try{UX?.recover?.()}catch(_){};return LW.interact?.(item)};el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}}})}
 function windowTarget(){const r=room();if(!r||r.classList.contains('garden'))return;r.querySelector('.v781-window-tap')?.remove();const b=document.createElement('button');b.type='button';b.className='v781-window-tap';b.setAttribute('aria-label','Pencereye git');b.onclick=e=>{e.preventDefault();e.stopPropagation();if(editing()||windowBusy)return;windowBusy=true;markHint();pulse(e.clientX,e.clientY);try{UX?.recover?.()}catch(_){};const rr=room();rr?.classList.add('v780-window-arrive');IW.move?.('window');setTimeout(()=>{rr?.classList.remove('v780-window-arrive');windowBusy=false},820)};r.append(b)
 }
 function decorateMenu(sheet){if(!sheet||sheet.dataset.v781==='1')return;const title=(sheet.querySelector('.v780-sheet-head b')?.textContent||'').trim();if(title!=='Dünyam Menüsü')return;const grid=sheet.querySelector('.v780-menu-grid');if(!grid)return;sheet.dataset.v781='1';const b=document.createElement('button');b.className='v780-menu-item v781-movement';b.type='button';b.innerHTML='<span class="ico">↝</span><div><b>HAREKET</b><small>Karakteri elle konumlandır veya pozunu değiştir</small></div>';b.onclick=()=>{SIMPLE.closeSheet?.();setTimeout(()=>SIMPLE.openMove?.(),30)};grid.append(b)
 }
 function decorate(){scheduled=false;compactActions();bindDirectObjects();windowTarget();document.querySelectorAll('.v780-sheet').forEach(decorateMenu)}
 function schedule(ms=45){if(scheduled)return;scheduled=true;setTimeout(decorate,ms)}
 window.addEventListener('pointerup',e=>{const obj=e.target.closest?.('#worldScreenBody .v750-object[data-item]');if(!obj||editing())return;markHint();pulse(e.clientX,e.clientY)},true);
 const observer=new MutationObserver(ms=>{let relevant=false;for(const m of ms){for(const n of m.addedNodes){if(n.nodeType===1&&(n.matches?.('.v780-sheet,.v750-world,.v780-actions')||n.querySelector?.('.v780-sheet,.v750-world,.v780-actions'))){relevant=true;break}}if(relevant)break}if(relevant)schedule(35)});observer.observe(document.body,{childList:true,subtree:true});
 document.addEventListener('click',e=>{if(e.target.closest?.('.navbtn[data-screen="worldScreen"],#worldScreenBody .v780-area-select,#worldScreenBody [data-v780="edit"],#worldScreenBody .v750-inventory button'))schedule(100)},true);
 window.addEventListener('pageshow',()=>schedule(120));document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(120)});
 state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);save();
 window.DEEN_WORLD_DIRECT={version:VERSION,stateVersion:STATE_VERSION,decorate,markHint,snapshot:()=>({version:VERSION,directObjects:document.querySelectorAll('#worldScreenBody .v750-object[role="button"]').length,windowTap:!!document.querySelector('#worldScreenBody .v781-window-tap'),mainMoveButton:!!document.querySelector('#worldScreenBody [data-v780="move"]'),hintSeen:hintSeen(),editing:editing()})};
 setTimeout(decorate,520);
})();
</script>`;
 window.DEEN_PATCH_V781=function(html){let out=String(html);if(out.includes('deen-v781-direct-world-js'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}}
})();
