(()=>{
  const VERSION='7.8.3',STATE_VERSION=56;
  const addition=`<!-- DEEN v7.8.3 — Idle Life & Ambient Behavior -->
<style id="deen-v783-idle-life-css">
#worldScreenBody #v750Character.v783-idle-ready:not(.moving):not(.v782-acting) svg{transform-origin:50% 88%;animation:v783Breath 3.8s ease-in-out infinite}
#worldScreenBody #v750Character.v783-blink g[data-layer="eyes"]{transform-box:fill-box;transform-origin:center;animation:v783Blink .22s ease-in-out 1}
#worldScreenBody #v750Character.v783-look-left svg{animation:v783LookLeft 1.25s ease-in-out 1!important}
#worldScreenBody #v750Character.v783-look-right svg{animation:v783LookRight 1.25s ease-in-out 1!important}
#worldScreenBody #v750Character.v783-glance-nur svg{animation:v783GlanceNur 1.55s ease-in-out 1!important}
#worldScreenBody #v750Character.v783-glance-window svg{animation:v783GlanceWindow 1.7s ease-in-out 1!important}
#worldScreenBody #v750Character.v783-glance-nur g[data-layer="eyes"]{transform-box:fill-box;transform-origin:center;animation:v783EyesRight 1.55s ease-in-out 1}
#worldScreenBody #v750Character.v783-glance-window g[data-layer="eyes"]{transform-box:fill-box;transform-origin:center;animation:v783EyesRight 1.7s ease-in-out 1}
#worldScreenBody .v750-room.v783-room-nur .v750-obj-nur{filter:drop-shadow(0 0 20px rgba(121,231,206,.52)) brightness(1.08)!important}
#worldScreenBody .v750-room.v783-room-window .v779-window-scene{filter:brightness(1.08) drop-shadow(0 0 13px rgba(126,205,216,.13))!important}
#worldScreenBody .v783-ambient-spark{position:absolute;z-index:84;width:5px;height:5px;border-radius:50%;background:#a7eadb;box-shadow:0 0 9px rgba(139,232,210,.72);pointer-events:none;animation:v783Spark 1s ease-out both}
@keyframes v783Breath{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-1px) scale(1.006)}}
@keyframes v783Blink{0%,100%{transform:scaleY(1)}45%,60%{transform:scaleY(.08)}}
@keyframes v783LookLeft{0%,100%{transform:none}38%,68%{transform:translateX(-2px) rotate(-1.4deg)}}
@keyframes v783LookRight{0%,100%{transform:none}38%,68%{transform:translateX(2px) rotate(1.4deg)}}
@keyframes v783GlanceNur{0%,100%{transform:none}38%,72%{transform:translateX(1px) rotate(1.2deg) scale(1.003)}}
@keyframes v783GlanceWindow{0%,100%{transform:none}36%,72%{transform:translateX(2px) rotate(1.6deg) scale(1.002)}}
@keyframes v783EyesRight{0%,100%{transform:translateX(0)}35%,70%{transform:translateX(1.4px)}}
@keyframes v783Spark{0%{opacity:0;transform:translateY(3px) scale(.6)}30%{opacity:.9}100%{opacity:0;transform:translateY(-13px) scale(1.25)}}
html.v5-reduce #worldScreenBody #v750Character.v783-idle-ready svg,html.v625-motion-off #worldScreenBody #v750Character.v783-idle-ready svg{animation:none!important}
@media(prefers-reduced-motion:reduce){#worldScreenBody #v750Character.v783-idle-ready svg,#worldScreenBody #v750Character[class*="v783-"] svg,#worldScreenBody #v750Character[class*="v783-"] g[data-layer="eyes"]{animation:none!important}}
</style>
<script id="deen-v783-idle-life-js">
(()=>{
 if(window.__deenV783Applied)return;window.__deenV783Applied=true;
 const VERSION='7.8.3',STATE_VERSION=56;
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v7.8.3 — Idle Life & Ambient Behavior';
 const IW=window.DEEN_INTERACTIVE_WORLD,ACTIONS=window.DEEN_WORLD_ACTIONS;
 if(!IW)return;
 const IDLE_MIN=7000,IDLE_MAX=13500,QUIET_AFTER_INPUT=4200;
 let timer=0,seq=0,lastInput=Date.now(),lastKind='';
 const ambientClasses=['v783-blink','v783-look-left','v783-look-right','v783-glance-nur','v783-glance-window'];
 function ch(){return document.getElementById('v750Character')}
 function room(){return document.getElementById('v750Room')}
 function worldActive(){return !!document.getElementById('worldScreen')?.classList.contains('active')&&!!room()}
 function editing(){try{return !!IW.state?.().editMode}catch(e){return false}}
 function reduced(){try{return document.documentElement.classList.contains('v5-reduce')||document.documentElement.classList.contains('v625-motion-off')||matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}}
 function busy(){const c=ch();return !c||editing()||c.classList.contains('moving')||c.classList.contains('v782-acting')||!!document.querySelector('.v780-sheet')||!!document.getElementById('v765AvatarOverlay')}
 function clearAmbient(){const c=ch(),r=room();if(c)ambientClasses.forEach(x=>c.classList.remove(x));if(r){r.classList.remove('v783-room-nur','v783-room-window');r.querySelectorAll('.v783-ambient-spark').forEach(x=>x.remove())}}
 function randDelay(){return Math.round(IDLE_MIN+Math.random()*(IDLE_MAX-IDLE_MIN))}
 function schedule(ms){clearTimeout(timer);if(reduced())return;timer=setTimeout(tick,ms==null?randDelay():ms)}
 function noteInput(){lastInput=Date.now();clearAmbient();const c=ch();c?.classList.add('v783-idle-ready');schedule(QUIET_AFTER_INPUT+Math.round(Math.random()*1800))}
 function spark(xPct,yPct){const r=room();if(!r)return;const s=document.createElement('span');s.className='v783-ambient-spark';s.style.left=xPct+'%';s.style.top=yPct+'%';r.append(s);setTimeout(()=>s.remove(),1100)}
 function choose(){let kinds=['blink','look-left','look-right'];const r=room();if(r?.querySelector('.v750-obj-nur'))kinds.push('nur');if(r&&!r.classList.contains('garden')&&(r.querySelector('.v781-window-tap')||r.querySelector('.v779-window-scene')))kinds.push('window');let filtered=kinds.filter(k=>k!==lastKind);if(!filtered.length)filtered=kinds;return filtered[Math.floor(Math.random()*filtered.length)]}
 function play(kind){const c=ch(),r=room();if(!c||!r)return false;clearAmbient();lastKind=kind;const mine=++seq;if(kind==='blink'){c.classList.add('v783-blink');setTimeout(()=>{if(mine===seq)c.classList.remove('v783-blink')},320)}else if(kind==='look-left'||kind==='look-right'){c.classList.add('v783-'+kind);setTimeout(()=>{if(mine===seq)c.classList.remove('v783-'+kind)},1350)}else if(kind==='nur'){c.classList.add('v783-glance-nur');r.classList.add('v783-room-nur');const nur=r.querySelector('.v750-obj-nur');if(nur){const rb=r.getBoundingClientRect(),b=nur.getBoundingClientRect();spark(((b.left+b.width/2-rb.left)/rb.width)*100,((b.top-rb.top)/rb.height)*100)}setTimeout(()=>{if(mine===seq){c.classList.remove('v783-glance-nur');r.classList.remove('v783-room-nur')}},1650)}else if(kind==='window'){c.classList.add('v783-glance-window');r.classList.add('v783-room-window');setTimeout(()=>{if(mine===seq){c.classList.remove('v783-glance-window');r.classList.remove('v783-room-window')}},1800)}return true}
 function tick(){if(reduced()||!worldActive()){schedule(5000);return}if(Date.now()-lastInput<QUIET_AFTER_INPUT||busy()){schedule(2200);return}play(choose());schedule(randDelay())}
 function decorate(){const c=ch();if(c&&!editing()&&!reduced())c.classList.add('v783-idle-ready');else c?.classList.remove('v783-idle-ready')}
 ['pointerdown','touchstart','keydown'].forEach(ev=>document.addEventListener(ev,e=>{if(e.target?.closest?.('#worldScreenBody,.v780-sheet,#v765AvatarOverlay'))noteInput()},true));
 document.addEventListener('click',e=>{if(e.target.closest?.('#worldScreenBody .v750-object,#worldScreenBody .v781-window-tap,#worldScreenBody [data-v780="edit"],#worldScreenBody .v780-area-select,.navbtn'))noteInput()},true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(timer);clearAmbient()}else{decorate();noteInput()}});
 window.addEventListener('pagehide',()=>{clearTimeout(timer);clearAmbient()});window.addEventListener('pageshow',()=>{decorate();noteInput()});
 const oldClear=ACTIONS?.clear;if(ACTIONS&&typeof oldClear==='function'&&!oldClear.__v783){const fn=function(...args){const out=oldClear.apply(this,args);noteInput();return out};fn.__v783=true;ACTIONS.clear=fn}
 state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);try{saveState?.()}catch(e){}
 window.DEEN_WORLD_IDLE={version:VERSION,stateVersion:STATE_VERSION,play,clear:clearAmbient,reschedule:noteInput,snapshot:()=>({version:VERSION,active:worldActive(),busy:busy(),reduced:reduced(),lastKind:lastKind,classes:ch()?[...ch().classList].filter(x=>x.startsWith('v783-')):[]})};
 setTimeout(()=>{decorate();noteInput()},650);
})();
</script>
`;
  window.DEEN_PATCH_V783=function(html){let out=String(html);if(out.includes('deen-v783-idle-life-js'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}}
})();
