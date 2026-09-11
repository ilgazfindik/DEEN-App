(()=>{
  const VERSION='7.7.7',STATE_VERSION=50;
  const addition=`
<!-- DEEN v7.7.7 — Dünyam Object Interactions & Visual Polish -->
<style id="deen-v777-world-object-css">
#worldScreenBody .v750-room{height:342px}
#worldScreenBody .v750-toolbar{background:linear-gradient(180deg,#0c2530,#0a2028);border-bottom:1px solid rgba(126,214,194,.08)}
#worldScreenBody .v750-toolbar .title{min-width:0}
#worldScreenBody .v750-toolbar .title b{font-size:12px!important;color:#e9f5f2}
#worldScreenBody .v750-toolbar .title small{font-size:7.5px!important;color:#8ba5aa!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:235px}
#worldScreenBody .v777-room-state{margin-left:auto;margin-right:6px;display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 8px;border:1px solid rgba(126,222,201,.16);border-radius:999px;background:#0f2d35;color:#9eb7ba;font-size:7px;font-weight:900;white-space:nowrap}
#worldScreenBody .v777-room-state:before{content:'';width:6px;height:6px;border-radius:50%;background:#75dcc4;box-shadow:0 0 8px rgba(117,220,196,.55)}
#worldScreenBody .v777-room-state.lamp-on{border-color:rgba(231,201,126,.24);color:#e5d3a0;background:#2b291f}
#worldScreenBody .v777-room-state.lamp-on:before{background:#f0cf79;box-shadow:0 0 10px rgba(240,207,121,.7)}
#worldScreenBody .v750-object[role="button"]{outline:none}
#worldScreenBody .v750-object.v777-selected{filter:brightness(1.12) drop-shadow(0 0 11px rgba(121,229,203,.4))!important}
#worldScreenBody .v750-object.v777-selected:not(.v750-obj-rug){transform:translate(-50%,-50%) scale(1.04)}
#worldScreenBody .v750-obj-rug.v777-selected{box-shadow:0 8px 8px rgba(0,0,0,.14),0 0 0 2px rgba(129,224,203,.2),0 0 24px rgba(92,204,181,.14)}
#worldScreenBody .v777-feedback{position:absolute;z-index:85;left:12px;right:12px;top:12px;display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:13px;border:1px solid rgba(121,221,198,.2);background:rgba(7,29,36,.94);box-shadow:0 12px 28px rgba(0,0,0,.22);color:#a9bdc0;font-size:8px;line-height:1.35;pointer-events:none;animation:v777In .22s ease both}
#worldScreenBody .v777-feedback strong{color:#e8f5f1;font-size:9px}.v777-feedback .ico{width:27px;height:27px;border-radius:9px;background:#153b42;display:grid;place-items:center;color:#88e2cd;font-size:15px;flex:0 0 auto}
@keyframes v777In{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}
#worldScreenBody .v777-focus .v750-obj-desk{filter:brightness(1.08) drop-shadow(0 0 12px rgba(129,223,202,.2))}
#worldScreenBody .v777-resting .v750-obj-rug{animation:v777Rug 1.2s ease 1}
@keyframes v777Rug{50%{filter:brightness(1.12)}}
#worldScreenBody .v777-fresh .v750-obj-plant{filter:brightness(1.15) saturate(1.12)}
#worldScreenBody .v777-memory .v750-obj-collectible{box-shadow:0 0 20px rgba(240,210,126,.28)}
#worldScreenBody .v751-activity{min-height:48px!important;padding:8px 10px!important;background:linear-gradient(180deg,#0d2831,#0b232b)!important;border-color:#284952!important}
#worldScreenBody .v751-activity>span{width:28px!important;height:28px!important;font-size:15px!important}
#worldScreenBody .v751-activity b{font-size:9px!important}
#worldScreenBody .v751-activity small{font-size:7.5px!important;line-height:1.35}
#worldScreenBody .v776-hint{font-size:6.8px!important;padding:7px 9px!important;margin-top:7px!important}
#worldScreenBody .v750-stage-card.v777-interacting{box-shadow:0 12px 30px rgba(0,0,0,.18),0 0 0 1px rgba(120,223,199,.05)}
@media(max-width:390px){#worldScreenBody .v750-room{height:326px}#worldScreenBody .v777-room-state{display:none}#worldScreenBody .v750-toolbar .title small{max-width:205px}}
</style>
<script id="deen-v777-world-object-js">
(()=>{
 if(window.__deenV777Applied)return;window.__deenV777Applied=true;
 const VERSION='7.7.7',STATE_VERSION=50;
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v7.7.7 — Dünyam Object Interactions & Visual Polish';
 const IW=window.DEEN_INTERACTIVE_WORLD,LW=window.DEEN_LIVING_WORLD,WS=window.DEEN_WORLD_STABILITY,UX=window.DEEN_WORLD_UX;
 if(!IW||!LW)return;
 const clone=v=>JSON.parse(JSON.stringify(v||{}));
 const critical=['gender','skin','face','eyes','brows','nose','mouth','headwear','head','hairColor','hijabColor','beard','outfit','glasses','extra','created','libraryVersion'];
 const meta={desk:['▰','Çalışma masası'],lamp:['◒','Masa lambası'],rug:['◉','Halı'],plant:['♧','Bitki'],shelf:['▥','Kitaplık'],nur:['✦','NUR'],collectible:['◇','Ünite hatırası']};
 let watchdog=0;
 function living(){const raw=state.myWorld?.interactiveWorld?.living;return raw&&typeof raw==='object'?raw:null}
 function area(){try{return IW.state?.().currentArea||'study'}catch(e){return'study'}}
 function editing(){try{return !!IW.state?.().editMode}catch(e){return false}}
 function canonical(){return clone(state.myWorld?.avatar||{})}
 function sameAvatar(a,b){return critical.every(k=>JSON.stringify(a?.[k]??null)===JSON.stringify(b?.[k]??null))}
 function restoreAvatar(snapshot){if(!snapshot||document.getElementById('v765AvatarOverlay'))return false;const now=canonical();if(sameAvatar(snapshot,now))return false;state.myWorld.avatar=clone(snapshot);try{saveState?.()}catch(e){};try{WS?.refreshAvatarOnly?.()}catch(e){};return true}
 function stage(){return document.querySelector('#worldScreenBody .v750-stage-card')}
 function room(){return document.getElementById('v750Room')}
 function recover(){clearTimeout(watchdog);try{UX?.recover?.()}catch(e){};const s=stage();s?.classList.remove('v777-interacting','v776-busy');document.querySelectorAll('#worldScreenBody .v777-selected').forEach(x=>x.classList.remove('v777-selected'));document.querySelectorAll('#worldScreenBody .v750-controls button,#worldScreenBody .v750-object').forEach(x=>x.style.pointerEvents='');}
 function feedback(item,title,copy){const r=room();if(!r)return;r.querySelector('.v777-feedback')?.remove();const m=meta[item]||['✦','Dünyam'];const el=document.createElement('div');el.className='v777-feedback';el.innerHTML='<span class="ico">'+m[0]+'</span><div><strong>'+String(title||m[1])+'</strong><br>'+String(copy||'Etkileşim tamamlandı.')+'</div>';r.append(el);setTimeout(()=>el.remove(),1850)}
 function decorate(){const r=room(),s=stage();if(!r||!s)return;for(const el of r.querySelectorAll('.v750-object[data-item]')){const item=el.dataset.item,m=meta[item]||['•',item];el.setAttribute('aria-label',m[1]+' ile etkileşim');el.dataset.v777Title=m[1]}
   const tb=s.querySelector('.v750-toolbar');if(tb&&!tb.querySelector('.v777-room-state')){const p=document.createElement('span');p.className='v777-room-state';tb.insertBefore(p,tb.querySelector('.v750-edit'))}
   const pill=s.querySelector('.v777-room-state'),on=!!living()?.lampOn?.[area()];if(pill){pill.classList.toggle('lamp-on',on);pill.textContent=on?'IŞIK AÇIK':'ODA HAZIR'}
 }
 function post(item,snap){setTimeout(()=>restoreAvatar(snap),40);setTimeout(()=>{restoreAvatar(snap);decorate();const l=living(),last=l?.lastInteraction;if(item==='lamp'&&last?.item==='lamp'){const on=!!l.lampOn?.[area()];last.title=on?'Lamba açıldı':'Lamba kapandı';last.copy=on?'Oda daha sıcak ve aydınlık oldu.':'Işık kapandı; oda sakin moda döndü.';try{saveState?.()}catch(e){};feedback(item,last.title,last.copy)}else if(last?.item===item){feedback(item,last.title,last.copy)}const root=document.querySelector('#worldScreenBody .v750-world');if(root){const cls=item==='desk'?'v777-focus':item==='rug'?'v777-resting':item==='plant'?'v777-fresh':item==='collectible'?'v777-memory':null;if(cls){root.classList.add(cls);setTimeout(()=>root.classList.remove(cls),1350)}}recover();},1080)}
 function wrap(name){const old=LW[name];if(typeof old!=='function'||old.__v777)return;const fn=function(item,...args){const snap=canonical();recover();const el=document.querySelector('#worldScreenBody .v750-object[data-item="'+item+'"]');el?.classList.add('v777-selected');stage()?.classList.add('v777-interacting');clearTimeout(watchdog);watchdog=setTimeout(()=>{restoreAvatar(snap);recover();decorate()},1800);let out=false;try{out=old.call(this,item,...args)}catch(e){restoreAvatar(snap);recover();throw e}if(out===false){restoreAvatar(snap);recover();return false}post(item,snap);return out};fn.__v777=true;LW[name]=fn}
 wrap('interact');wrap('quick');
 const oldMove=IW.move;if(typeof oldMove==='function'&&!oldMove.__v777){const fn=function(...args){const snap=canonical();const out=oldMove.apply(this,args);setTimeout(()=>restoreAvatar(snap),650);return out};fn.__v777=true;IW.move=fn}
 document.addEventListener('click',e=>{const obj=e.target.closest?.('#worldScreenBody .v750-object[data-item]');if(!obj||editing())return;const item=obj.dataset.item;obj.classList.add('v777-selected');setTimeout(()=>obj.classList.remove('v777-selected'),1150)},true);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>{recover();decorate()},120)});
 window.addEventListener('pageshow',()=>setTimeout(()=>{recover();decorate()},120));
 const oldUpdate=window.updateUI;if(typeof oldUpdate==='function'&&!oldUpdate.__v777){const fn=function(...args){const out=oldUpdate.apply(this,args);setTimeout(()=>{if(document.getElementById('worldScreen')?.classList.contains('active'))decorate()},100);return out};fn.__v777=true;window.updateUI=fn}
 state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);try{saveState?.()}catch(e){}
 window.DEEN_WORLD_OBJECTS={version:VERSION,stateVersion:STATE_VERSION,recover,decorate,snapshot:()=>({version:VERSION,area:area(),editing:editing(),lampOn:!!living()?.lampOn?.[area()],avatarCanonical:canonical(),objectCount:room()?.querySelectorAll('.v750-object[data-item]').length||0})};
 setTimeout(()=>{recover();decorate()},420);
})();
</script>`;
 window.DEEN_PATCH_V777=function(html){let out=String(html);if(out.includes('deen-v777-world-object-js'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}}
})();
