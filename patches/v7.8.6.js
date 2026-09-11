(()=>{
  const VERSION='7.8.6',STATE_VERSION=59;
  const addition=`
<!-- DEEN v7.8.6 — Room Evolution by Level -->
<style id="deen-v786-room-evolution-css">
#worldScreenBody .v750-room.v786-evolution{transition:box-shadow .45s ease,filter .45s ease,background .45s ease}
#worldScreenBody .v786-evolution-layer{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden;border-radius:inherit}
#worldScreenBody .v786-wall-frame{position:absolute;left:19px;top:30px;width:48px;height:58px;border-radius:15px;border:1px solid rgba(151,221,204,.13);background:linear-gradient(180deg,rgba(25,61,66,.42),rgba(13,42,47,.18));box-shadow:inset 0 0 0 4px rgba(7,28,33,.12),0 7px 18px rgba(0,0,0,.06);opacity:0;transform:translateY(4px) scale(.96);transition:opacity .4s ease,transform .4s ease}
#worldScreenBody .v786-wall-frame:before{content:'✦';position:absolute;inset:0;display:grid;place-items:center;color:rgba(147,226,207,.36);font-size:14px}
#worldScreenBody .v750-room.reading .v786-wall-frame{border-color:rgba(225,205,155,.14);background:linear-gradient(180deg,rgba(78,70,51,.42),rgba(47,43,35,.2))}
#worldScreenBody .v750-room.reading .v786-wall-frame:before{color:rgba(229,204,143,.34)}
#worldScreenBody .v750-room.garden .v786-wall-frame{display:none}
#worldScreenBody .v786-wall-trim{position:absolute;left:12px;right:12px;top:55%;height:1px;background:linear-gradient(90deg,transparent,rgba(137,215,197,.19) 20%,rgba(137,215,197,.19) 80%,transparent);opacity:0;transform:scaleX(.88);transition:opacity .4s ease,transform .4s ease}
#worldScreenBody .v750-room.reading .v786-wall-trim{background:linear-gradient(90deg,transparent,rgba(226,201,145,.16) 20%,rgba(226,201,145,.16) 80%,transparent)}
#worldScreenBody .v750-room.garden .v786-wall-trim{top:36%;background:linear-gradient(90deg,transparent,rgba(139,213,179,.16) 18%,rgba(139,213,179,.16) 82%,transparent)}
#worldScreenBody .v786-floor-inlay{position:absolute;left:14%;right:14%;bottom:5%;height:29%;border:1px solid rgba(123,207,188,.08);border-radius:50%;box-shadow:inset 0 0 28px rgba(91,185,164,.035),0 0 18px rgba(0,0,0,.04);opacity:0;transform:scale(.92);transition:opacity .45s ease,transform .45s ease}
#worldScreenBody .v750-room.reading .v786-floor-inlay{border-color:rgba(222,197,141,.08);box-shadow:inset 0 0 26px rgba(213,181,110,.035)}
#worldScreenBody .v750-room.garden .v786-floor-inlay{border-color:rgba(130,206,164,.09);bottom:2%;height:35%}
#worldScreenBody .v786-desk-light{position:absolute;left:-5%;bottom:-8%;width:62%;height:52%;background:radial-gradient(ellipse at 48% 48%,rgba(112,213,188,.08),transparent 67%);opacity:0;transition:opacity .5s ease;filter:blur(1px)}
#worldScreenBody .v750-room.reading .v786-desk-light{background:radial-gradient(ellipse at 48% 48%,rgba(223,190,119,.07),transparent 68%)}
#worldScreenBody .v750-room.garden .v786-desk-light{left:22%;bottom:-10%;background:radial-gradient(ellipse at 48% 48%,rgba(121,210,160,.07),transparent 67%)}
#worldScreenBody .v786-ceiling-glow{position:absolute;left:20%;right:20%;top:-18%;height:42%;border-radius:50%;background:radial-gradient(ellipse at center,rgba(124,224,201,.075),transparent 70%);opacity:0;transition:opacity .5s ease;filter:blur(3px)}
#worldScreenBody .v750-room.reading .v786-ceiling-glow{background:radial-gradient(ellipse at center,rgba(230,201,132,.06),transparent 70%)}
#worldScreenBody .v786-corner-dots{position:absolute;left:23px;bottom:24px;width:38px;height:16px;opacity:0;transition:opacity .45s ease}
#worldScreenBody .v786-corner-dots:before,#worldScreenBody .v786-corner-dots:after{content:'';position:absolute;width:3px;height:3px;border-radius:50%;background:rgba(146,228,209,.34);box-shadow:12px 5px 0 rgba(146,228,209,.21),25px -1px 0 rgba(146,228,209,.17)}
#worldScreenBody .v786-corner-dots:after{left:5px;top:10px;opacity:.55;transform:scale(.7)}
#worldScreenBody .v750-room.reading .v786-corner-dots:before,#worldScreenBody .v750-room.reading .v786-corner-dots:after{background:rgba(229,205,149,.3);box-shadow:12px 5px 0 rgba(229,205,149,.18),25px -1px 0 rgba(229,205,149,.15)}
#worldScreenBody .v786-window-stars{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .45s ease;z-index:3}
#worldScreenBody .v786-window-stars i{position:absolute;width:2px;height:2px;border-radius:50%;background:rgba(219,246,239,.68);box-shadow:0 0 5px rgba(174,234,221,.4)}
#worldScreenBody .v786-window-stars i:nth-child(1){left:20%;top:24%}#worldScreenBody .v786-window-stars i:nth-child(2){left:41%;top:15%;width:1px;height:1px}#worldScreenBody .v786-window-stars i:nth-child(3){left:67%;top:36%}#worldScreenBody .v786-window-stars i:nth-child(4){left:78%;top:17%;width:1px;height:1px}#worldScreenBody .v786-window-stars i:nth-child(5){left:31%;top:48%;width:1px;height:1px}#worldScreenBody .v786-window-stars i:nth-child(6){left:58%;top:57%}
#worldScreenBody .v786-ge2 .v786-wall-frame{opacity:1;transform:none}
#worldScreenBody .v786-ge3 .v786-wall-trim{opacity:1;transform:none}
#worldScreenBody .v786-ge4 .v786-floor-inlay{opacity:1;transform:none}
#worldScreenBody .v786-ge5 .v786-desk-light{opacity:1}
#worldScreenBody .v786-ge5{box-shadow:0 18px 42px rgba(0,0,0,.18),inset 0 0 45px rgba(117,211,190,.025)!important}
#worldScreenBody .v750-room.reading.v786-ge5{box-shadow:0 18px 42px rgba(0,0,0,.18),inset 0 0 45px rgba(228,197,128,.024)!important}
#worldScreenBody .v786-ge6 .v786-window-stars{opacity:1}
#worldScreenBody .v786-ge6 .v779-window-scene:before{background:radial-gradient(circle at 73% 24%,rgba(235,220,157,.88) 0 3px,transparent 4px),radial-gradient(circle at 28% 32%,rgba(224,246,241,.65) 0 1px,transparent 2px),linear-gradient(180deg,#123846 0%,#112f3b 58%,#102832 100%)!important}
#worldScreenBody .v750-room.reading.v786-ge6 .v779-window-scene:before{background:radial-gradient(circle at 73% 24%,rgba(239,215,151,.78) 0 3px,transparent 4px),radial-gradient(circle at 29% 30%,rgba(244,229,187,.55) 0 1px,transparent 2px),linear-gradient(180deg,#303f45,#39372f 100%)!important}
#worldScreenBody .v750-room.garden.v786-ge6 .v750-sky:before{box-shadow:0 0 42px rgba(225,202,143,.32)!important}
#worldScreenBody .v786-ge6 .v786-corner-dots{opacity:1}
#worldScreenBody .v786-ge7 .v786-ceiling-glow{opacity:1}
#worldScreenBody .v786-ge7 .v750-obj-nur{filter:drop-shadow(0 0 18px rgba(118,231,205,.64)) brightness(1.06)!important}
#worldScreenBody .v786-ge7{box-shadow:0 18px 44px rgba(0,0,0,.19),inset 0 0 70px rgba(117,222,197,.035)!important}
#worldScreenBody .v786-level-shift .v786-evolution-layer{animation:v786Shift 1s ease both}
@keyframes v786Shift{0%{filter:brightness(1)}40%{filter:brightness(1.18)}100%{filter:brightness(1)}}
html.v5-reduce #worldScreenBody .v786-level-shift .v786-evolution-layer,html.v625-motion-off #worldScreenBody .v786-level-shift .v786-evolution-layer{animation:none!important}
@media(prefers-reduced-motion:reduce){#worldScreenBody .v750-room.v786-evolution,#worldScreenBody .v786-evolution-layer,#worldScreenBody .v786-wall-frame,#worldScreenBody .v786-wall-trim,#worldScreenBody .v786-floor-inlay,#worldScreenBody .v786-desk-light,#worldScreenBody .v786-ceiling-glow,#worldScreenBody .v786-corner-dots,#worldScreenBody .v786-window-stars{transition:none!important;animation:none!important}}
@media(max-width:390px){#worldScreenBody .v786-wall-frame{left:15px;top:25px;transform:scale(.92)}#worldScreenBody .v786-floor-inlay{left:11%;right:11%}}
</style>
<script id="deen-v786-room-evolution-js">
(()=>{
 if(window.__deenV786Applied)return;window.__deenV786Applied=true;
 const VERSION='7.8.6',STATE_VERSION=59;
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v7.8.6 — Room Evolution by Level';
 const PROG=window.DEEN_WORLD_PROGRESSION;
 if(!PROG)return;
 let scheduled=false,lastApplied=0,previewLevel=null,watchTimer=0;
 function room(){return document.getElementById('v750Room')}
 function level(){if(previewLevel!=null)return previewLevel;try{return Math.max(1,Math.min(7,Number(PROG.snapshot?.().level)||1))}catch(e){return 1}}
 function ensureLayer(r){let l=r.querySelector(':scope > .v786-evolution-layer');if(l)return l;l=document.createElement('span');l.className='v786-evolution-layer';l.setAttribute('aria-hidden','true');l.innerHTML='<span class="v786-wall-frame"></span><span class="v786-wall-trim"></span><span class="v786-floor-inlay"></span><span class="v786-desk-light"></span><span class="v786-ceiling-glow"></span><span class="v786-corner-dots"></span>';r.insertBefore(l,r.firstChild);return l}
 function ensureStars(r){const w=r.querySelector('.v779-window-scene');if(!w)return;let s=w.querySelector(':scope > .v786-window-stars');if(s)return;s=document.createElement('span');s.className='v786-window-stars';s.setAttribute('aria-hidden','true');s.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i>';w.append(s)}
 function apply(force=false){scheduled=false;const r=room();if(!r)return false;const lv=level();ensureLayer(r);ensureStars(r);[...r.classList].filter(x=>/^v786-(?:lv|ge)\d+$/.test(x)).forEach(x=>r.classList.remove(x));r.classList.add('v786-evolution','v786-lv'+lv);for(let n=2;n<=lv;n++)r.classList.add('v786-ge'+n);r.dataset.v786Level=String(lv);if((force||lastApplied)&&lastApplied&&lv>lastApplied){r.classList.remove('v786-level-shift');void r.offsetWidth;r.classList.add('v786-level-shift');setTimeout(()=>r.classList.remove('v786-level-shift'),1050)}lastApplied=lv;return true}
 function schedule(ms=50){if(scheduled)return;scheduled=true;setTimeout(()=>apply(),ms)}
 function watch(){clearTimeout(watchTimer);apply();watchTimer=setTimeout(watch,1800)}
 const obs=new MutationObserver(ms=>{for(const m of ms){if(m.type==='childList'||m.target?.closest?.('#worldScreenBody .v784-progress-strip,#worldScreenBody .v750-world')){schedule(40);break}}});obs.observe(document.body,{childList:true,subtree:true,characterData:true});
 document.addEventListener('click',e=>{if(e.target.closest?.('#worldScreenBody .navbtn,#worldScreenBody .v780-area-select,#worldScreenBody .v784-progress-strip,.v785-levelup,#worldScreenBody .v780-back-btn'))schedule(120)},true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(watchTimer);else{schedule(120);watchTimer=setTimeout(watch,500)}});window.addEventListener('pagehide',()=>clearTimeout(watchTimer));window.addEventListener('pageshow',()=>schedule(140));
 state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);try{saveState?.()}catch(e){}
 window.DEEN_WORLD_EVOLUTION={version:VERSION,stateVersion:STATE_VERSION,apply,preview:n=>{previewLevel=Math.max(1,Math.min(7,Number(n)||1));apply(true);return previewLevel},clearPreview:()=>{previewLevel=null;apply(true)},snapshot:()=>{const r=room();return{version:VERSION,level:level(),roomLevel:Number(r?.dataset?.v786Level)||null,classes:r?[...r.classList].filter(x=>x.startsWith('v786-')):[],layer:!!r?.querySelector('.v786-evolution-layer'),stars:!!r?.querySelector('.v786-window-stars')}}};
 setTimeout(()=>{apply();watchTimer=setTimeout(watch,1800)},720);
})();
</script>`;
  window.DEEN_PATCH_V786=function(html){let out=String(html);if(out.includes('deen-v786-room-evolution-js'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}}
})();
