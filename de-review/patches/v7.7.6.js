(()=>{
  const VERSION='7.7.6',STATE_VERSION=49;
  const addition=`
<!-- DEEN v7.7.6 — Dünyam Room UX & Interaction Stability -->
<style id="deen-v776-world-ux-css">
#worldScreenBody .v750-world{margin-top:10px}
#worldScreenBody .v750-stage-card{overflow:hidden;border-radius:18px;border-color:#2b4a53;box-shadow:0 12px 30px rgba(0,0,0,.18)}
#worldScreenBody .v750-toolbar{padding:0 12px;min-height:50px}
#worldScreenBody .v750-toolbar .title b{font-size:11px;letter-spacing:.1px}
#worldScreenBody .v750-toolbar .title small{font-size:7px;color:#8fa7ad;margin-top:2px}
#worldScreenBody .v750-controls{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;overflow:visible!important;padding:9px;background:#0a2028}
#worldScreenBody .v750-controls button{min-width:0!important;width:100%;padding:7px 5px!important;min-height:43px;border-radius:12px;font-size:7px!important;line-height:1.15;white-space:normal;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}
#worldScreenBody .v750-controls button .v776-ico{font-size:14px;line-height:1;color:#bfe7dd}
#worldScreenBody .v750-controls button.active .v776-ico{color:#8ce6cf}
#worldScreenBody .v750-controls .reset{display:none!important}
#worldScreenBody .v776-edit-reset{border:1px solid rgba(223,197,143,.28);background:#28271f;color:#e0ca8d;border-radius:10px;padding:7px 9px;font-size:7px;font-weight:950;white-space:nowrap}
#worldScreenBody .v751-activity{margin:9px 10px 0!important;border-radius:13px!important}
#worldScreenBody .v751-world-actions{display:none!important}
#worldScreenBody .v751-asset-note{display:none!important}
#worldScreenBody .v776-hint{margin:8px 10px 10px;padding:8px 10px;border:1px solid rgba(125,221,199,.14);border-radius:12px;background:#0c252d;color:#8fa9ae;font-size:7px;line-height:1.45;text-align:center}
#worldScreenBody .v776-hint b{color:#cceee5}
#worldScreenBody .v750-stage-card.v776-busy .v750-controls button,
#worldScreenBody .v750-stage-card.v776-busy .v750-object[role="button"]{pointer-events:none!important}
#worldScreenBody .v750-stage-card.v776-busy .v750-controls{opacity:.72}
#worldScreenBody .v750-stage-card.v776-busy .v750-character{filter:drop-shadow(0 8px 10px rgba(0,0,0,.24))}
#worldScreenBody .v750-hotspot{display:none!important;pointer-events:none!important}
@media(max-width:390px){
 #worldScreenBody .v750-controls{gap:5px;padding:8px}
 #worldScreenBody .v750-controls button{font-size:6.5px!important;min-height:41px;padding:6px 3px!important}
 #worldScreenBody .v750-controls button .v776-ico{font-size:13px}
}
</style>
<script id="deen-v776-world-ux-js">
(()=>{
 if(window.__deenV776Applied)return;window.__deenV776Applied=true;
 const VERSION='7.7.6',STATE_VERSION=49;
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v7.7.6 — Dünyam Room UX & Interaction Stability';
 const IW=window.DEEN_INTERACTIVE_WORLD,LW=window.DEEN_LIVING_WORLD,WS=window.DEEN_WORLD_STABILITY;
 if(!IW)return;
 let busyUntil=0,busyTimer=0;
 const labels={
  study:{center:['⌂','ORTAYA GEL'],desk:['▰','MASAYA GİT'],window:['◫','PENCEREYE GİT']},
  reading:{center:['⌂','ORTAYA GEL'],desk:['▥','OKUMA KÖŞESİ'],window:['◫','PENCEREYE GİT']},
  garden:{center:['⌂','ORTAYA GEL'],desk:['▰','BANKA GİT'],window:['♧','AĞACA GİT']}
 };
 function root(){return document.querySelector('#worldScreenBody .v750-stage-card')}
 function area(){try{return IW.state?.().currentArea||'study'}catch(e){return'study'}}
 function editing(){try{return !!IW.state?.().editMode}catch(e){return false}}
 function unlock(){busyUntil=0;clearTimeout(busyTimer);root()?.classList.remove('v776-busy')}
 function lock(ms=760){busyUntil=performance.now()+ms;const r=root();r?.classList.add('v776-busy');clearTimeout(busyTimer);busyTimer=setTimeout(unlock,ms+80)}
 function isBusy(){return performance.now()<busyUntil}
 function recover(){
   unlock();
   document.querySelectorAll('#worldScreenBody .dragging,#worldScreenBody .v751-character-walking').forEach(x=>x.classList.remove('dragging','v751-character-walking'));
   const ch=document.getElementById('v750Character');ch?.classList.remove('moving','left');
   try{WS?.refreshAvatarOnly?.()}catch(e){}
 }
 function decorateControls(){
   const bar=document.querySelector('#worldScreenBody .v750-controls');if(!bar)return;
   const a=area(),defs=labels[a]||labels.study,buttons=[...bar.querySelectorAll('button:not(.reset)')];
   ['center','desk','window'].forEach((id,i)=>{const b=buttons[i],d=defs[id];if(!b||!d)return;b.dataset.v776Action=id;b.setAttribute('aria-label',d[1].toLocaleLowerCase('tr-TR'));b.innerHTML='<span class="v776-ico">'+d[0]+'</span><span>'+d[1]+'</span>'});
   const pose=buttons[3];if(pose){pose.dataset.v776Action='pose';pose.setAttribute('aria-label','Poz değiştir');pose.innerHTML='<span class="v776-ico">✦</span><span>POZ DEĞİŞTİR</span>'}
   const toolbar=document.querySelector('#worldScreenBody .v750-toolbar .title small');if(toolbar&&!editing())toolbar.textContent='Karakterini yönlendir veya odadaki bir eşyaya dokun';
   const tray=document.querySelector('#worldScreenBody .v750-tray-head');if(tray&&!tray.querySelector('.v776-edit-reset')){const b=document.createElement('button');b.className='v776-edit-reset';b.type='button';b.textContent='DÜZENİ SIFIRLA';b.onclick=()=>{if(isBusy())return;IW.resetLayout?.()};tray.append(b)}
   const stage=root();if(stage&&!stage.querySelector('.v776-hint'))stage.insertAdjacentHTML('beforeend','<div class="v776-hint"><b>İpucu:</b> Hareket için alttaki butonları, eşya tepkileri için odadaki objeleri kullan.</div>');
 }
 function decorate(){decorateControls();if(document.getElementById('worldScreen')?.classList.contains('active')){document.getElementById('worldScreen')?.classList.remove('v773-gated');const body=document.getElementById('worldScreenBody');if(body){body.style.visibility='';body.style.pointerEvents='auto'}}}
 function wrap(name,ms){const old=IW[name];if(typeof old!=='function'||old.__v776)return;const fn=function(...args){if(isBusy()&&!editing())return false;lock(ms);try{const r=old.apply(this,args);if(r===false)unlock();setTimeout(decorate,30);return r}catch(e){recover();throw e}};fn.__v776=true;IW[name]=fn}
 wrap('move',620);wrap('pose',330);wrap('area',420);wrap('edit',300);
 if(LW){
   for(const name of ['quick','interact']){const old=LW[name];if(typeof old!=='function'||old.__v776)continue;const fn=function(...args){if(isBusy()&&!editing())return false;lock(900);try{const r=old.apply(this,args);if(r===false)unlock();setTimeout(decorate,30);return r}catch(e){recover();throw e}};fn.__v776=true;LW[name]=fn}
 }
 document.addEventListener('click',e=>{
   const obj=e.target.closest?.('#worldScreenBody .v750-object[data-item]');if(!obj||editing())return;
   if(isBusy()){e.preventDefault();e.stopImmediatePropagation();return}
   lock(900);
 },true);
 document.addEventListener('pointerup',e=>{if(e.target.closest?.('#worldScreenBody .v750-object')&&editing())setTimeout(unlock,60)},true);
 window.addEventListener('pageshow',()=>setTimeout(()=>{recover();decorate()},120));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>{recover();decorate()},120)});
 const oldUpdate=window.updateUI;if(typeof oldUpdate==='function'&&!oldUpdate.__v776){const fn=function(...args){const r=oldUpdate.apply(this,args);setTimeout(()=>{if(document.getElementById('worldScreen')?.classList.contains('active'))decorate()},90);return r};fn.__v776=true;window.updateUI=fn}
 document.addEventListener('click',e=>{if(e.target.closest?.('.navbtn[data-screen="worldScreen"],#worldScreen .v740-world-tabs button'))setTimeout(decorate,120)},true);
 state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);try{saveState?.()}catch(e){}
 window.DEEN_WORLD_UX={version:VERSION,stateVersion:STATE_VERSION,recover,decorate,isBusy,snapshot:()=>({version:VERSION,area:area(),editing:editing(),busy:isBusy(),hotspots:false,explicitMovementControls:true,avatarCanonical:!!state.myWorld?.avatar?.libraryVersion})};
 setTimeout(()=>{recover();decorate()},350);
})();
</script>`;
 window.DEEN_PATCH_V776=function(html){
   let out=String(html);
   if(out.includes('deen-v776-world-ux-js'))return{html:out,version:VERSION,applied:0};
   /* v7.7.5 itself is appended after the legacy closing body; append after every prior runtime layer. */
   out += '\n'+addition+'\n';
   return{html:out,version:VERSION,applied:1};
 };
})();
