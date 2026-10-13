(()=>{
  const VERSION='7.8.5',STATE_VERSION=58;
  const addition=`
<!-- DEEN v7.8.5 — Level-Up Celebration & Unlock Reveal -->
<style id="deen-v785-levelup-css">
.v785-levelup{position:fixed;inset:0;z-index:10120;display:grid;place-items:center;padding:18px;box-sizing:border-box;background:rgba(2,12,16,.72);backdrop-filter:blur(7px);animation:v785Fade .2s ease both}
.v785-levelup-card{width:min(360px,100%);border:1px solid rgba(139,224,203,.3);border-radius:25px;background:linear-gradient(180deg,#11323a,#092229 72%);box-shadow:0 28px 78px rgba(0,0,0,.46),inset 0 1px rgba(255,255,255,.03);padding:22px 18px 16px;text-align:center;position:relative;overflow:hidden;animation:v785Card .46s cubic-bezier(.2,.85,.24,1.08) both}
.v785-levelup-card:before{content:'';position:absolute;left:50%;top:-80px;width:220px;height:180px;transform:translateX(-50%);background:radial-gradient(circle,rgba(108,224,198,.17),transparent 68%);pointer-events:none}
.v785-level-orbit{width:88px;height:88px;margin:0 auto 12px;border-radius:28px;display:grid;place-items:center;position:relative;background:linear-gradient(180deg,#24554d,#153d39);border:1px solid rgba(150,235,214,.29);box-shadow:0 0 0 7px rgba(117,219,194,.04),0 16px 30px rgba(0,0,0,.18)}
.v785-level-orbit:before,.v785-level-orbit:after{content:'✦';position:absolute;color:#9be5d3;font-size:10px;animation:v785Sparkle 1.4s ease-in-out infinite}
.v785-level-orbit:before{left:-14px;top:8px}.v785-level-orbit:after{right:-11px;bottom:8px;animation-delay:.45s}
.v785-level-num{font-size:26px;line-height:1;font-weight:1000;color:#effcf8;letter-spacing:-1px}.v785-level-num small{display:block;margin-bottom:5px;font-size:7px;letter-spacing:1.3px;color:#8bd8c7}
.v785-kicker{font-size:7px;font-weight:950;letter-spacing:1.25px;color:#78cdbb;text-transform:uppercase}.v785-title{margin:7px 0 5px;font-size:21px;line-height:1.05;color:#f2fbf8;letter-spacing:-.35px}.v785-sub{margin:0 auto;color:#8da5a9;font-size:8px;line-height:1.45;max-width:285px}
.v785-unlock{margin:16px 0 12px;padding:11px;border:1px solid rgba(224,196,126,.22);border-radius:16px;background:linear-gradient(180deg,rgba(57,50,32,.75),rgba(35,34,27,.65));display:grid;grid-template-columns:46px minmax(0,1fr);gap:10px;align-items:center;text-align:left}
.v785-unlock-icon{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:#173a3b;border:1px solid rgba(128,216,197,.16);font-size:20px;color:#99e3d1;box-shadow:inset 0 0 18px rgba(122,218,195,.04)}
.v785-unlock-copy b{display:block;color:#efe1ad;font-size:9.5px}.v785-unlock-copy small{display:block;margin-top:3px;color:#9b9274;font-size:6.7px;line-height:1.35}.v785-unlock-copy em{font-style:normal;color:#79d3bf}
.v785-actions{display:grid;grid-template-columns:1fr 1.25fr;gap:8px;margin-top:11px}.v785-actions button{min-height:44px;border-radius:13px;font-size:7.3px;font-weight:1000}.v785-later{border:1px solid #31515a;background:#102a32;color:#9eb7ba}.v785-shop{border:1px solid #82dfc9;background:linear-gradient(180deg,#79dec6,#4bb9a4);color:#072722;box-shadow:0 10px 22px rgba(45,157,135,.14)}
.v785-confetti{position:absolute;inset:0;pointer-events:none;overflow:hidden}.v785-confetti i{position:absolute;top:44%;left:50%;width:5px;height:9px;border-radius:2px;background:#8fe1ce;opacity:0;animation:v785Confetti 1s ease-out forwards}.v785-confetti i:nth-child(2n){background:#d9c27d}.v785-confetti i:nth-child(3n){width:4px;height:4px;border-radius:50%;background:#c9f2e8}
#worldScreenBody .v785-room-reveal{position:absolute;z-index:92;min-width:86px;transform:translate(-50%,-50%);pointer-events:none;text-align:center;animation:v785RoomReveal 1.45s cubic-bezier(.2,.8,.3,1) both}
#worldScreenBody .v785-room-reveal .icon{width:54px;height:54px;margin:0 auto 5px;border-radius:17px;display:grid;place-items:center;border:1px solid rgba(157,235,216,.27);background:rgba(13,48,53,.92);box-shadow:0 0 28px rgba(113,226,199,.26),0 12px 26px rgba(0,0,0,.18);font-size:24px;color:#a5ebda}
#worldScreenBody .v785-room-reveal b{display:inline-block;padding:4px 7px;border-radius:999px;background:rgba(7,28,34,.9);border:1px solid rgba(140,219,201,.16);font-size:6px;color:#b7ddd5;white-space:nowrap}
#worldScreenBody .v785-unlock-target{animation:v785TargetGlow 1.5s ease both!important}
@keyframes v785Fade{from{opacity:0}to{opacity:1}}@keyframes v785Card{from{opacity:0;transform:translateY(18px) scale(.94)}to{opacity:1;transform:none}}@keyframes v785Sparkle{0%,100%{opacity:.25;transform:scale(.75) rotate(0)}50%{opacity:1;transform:scale(1.2) rotate(18deg)}}
@keyframes v785Confetti{0%{opacity:0;transform:translate(0,0) rotate(0)}16%{opacity:1}100%{opacity:0;transform:translate(var(--x),var(--y)) rotate(var(--r))}}@keyframes v785RoomReveal{0%{opacity:0;transform:translate(-50%,-38%) scale(.72)}28%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}72%{opacity:1;transform:translate(-50%,-54%) scale(1)}100%{opacity:0;transform:translate(-50%,-66%) scale(.94)}}@keyframes v785TargetGlow{0%,100%{filter:none}42%{filter:brightness(1.22) drop-shadow(0 0 18px rgba(128,228,204,.52))}}
html.v5-reduce .v785-levelup-card,html.v625-motion-off .v785-levelup-card,html.v5-reduce .v785-confetti i,html.v625-motion-off .v785-confetti i{animation:none!important}
@media(prefers-reduced-motion:reduce){.v785-levelup,.v785-levelup-card,.v785-confetti i,#worldScreenBody .v785-room-reveal,#worldScreenBody .v785-unlock-target{animation:none!important}.v785-confetti{display:none}}
@media(max-width:390px){.v785-levelup{padding:12px}.v785-levelup-card{padding:19px 14px 14px;border-radius:22px}.v785-level-orbit{width:80px;height:80px;border-radius:25px}.v785-title{font-size:19px}.v785-actions button{min-height:42px}}
</style>
<script id="deen-v785-levelup-js">
(()=>{
 if(window.__deenV785Applied)return;window.__deenV785Applied=true;
 const VERSION='7.8.5',STATE_VERSION=58;
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v7.8.5 — Level-Up Celebration & Unlock Reveal';
 const PROG=window.DEEN_WORLD_PROGRESSION,WORLD=window.DEEN_WORLD,IDLE=window.DEEN_WORLD_IDLE,ACTIONS=window.DEEN_WORLD_ACTIONS;
 if(!PROG||!WORLD)return;
 const META={
  2:{title:'Yeşeren Köşe',unlock:'plant_olive',fallback:'Zeytin Saksısı',icon:'♧',selector:'.v750-obj-plant'},
  3:{title:'Okuma Alanı',unlock:'shelf_oak',fallback:'Meşe Kitaplık',icon:'▥',selector:'.v750-obj-shelf'},
  4:{title:'Sıcak Dokunuş',unlock:'rug_sunrise',fallback:'Gün Doğumu Halısı',icon:'◉',selector:'.v750-obj-rug'},
  5:{title:'Odak Alanı',unlock:'desk_sand',fallback:'Kum Çalışma Masası',icon:'▰',selector:'.v750-obj-desk'},
  6:{title:'Gece Manzarası',unlock:'window_night',fallback:'Gece Penceresi',icon:'◒',selector:'.v779-window-scene,.v781-window-tap'},
  7:{title:'Yıldız Işığı',unlock:'nur_starlight',fallback:'NUR · Yıldız Işığı',icon:'✦',selector:'.v750-obj-nur'}
 };
 let queue=[],showing=false,watchTimer=0;
 function save(){try{saveState?.()}catch(e){}}
 function reduced(){try{return document.documentElement.classList.contains('v5-reduce')||document.documentElement.classList.contains('v625-motion-off')||matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}}
 function currentLevel(){try{return Number(PROG.snapshot?.().level)||1}catch(e){return 1}}
 function ensure(){state.myWorld=state.myWorld&&typeof state.myWorld==='object'?state.myWorld:{};let c=state.myWorld.progressionCelebration&&typeof state.myWorld.progressionCelebration==='object'?state.myWorld.progressionCelebration:{};c.version=VERSION;c.seenLevels=Array.isArray(c.seenLevels)?c.seenLevels:[];if(!c.initialized){c.knownLevel=currentLevel();for(let n=2;n<=c.knownLevel;n++)if(!c.seenLevels.includes(n))c.seenLevels.push(n);c.initialized=true}else c.knownLevel=Math.max(1,Number(c.knownLevel)||1);state.myWorld.progressionCelebration=c;state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);return c}
 function itemName(id,fallback){try{return (WORLD.items?.()||[]).find(x=>x.id===id)?.name||fallback}catch(e){return fallback}}
 function markSeen(n){const c=ensure();if(!c.seenLevels.includes(n))c.seenLevels.push(n);c.knownLevel=Math.max(c.knownLevel,n);save()}
 function closeOverlay(){document.querySelector('.v785-levelup')?.remove();showing=false;try{IDLE?.reschedule?.()}catch(e){};setTimeout(runQueue,90)}
 function confetti(){let s='';for(let i=0;i<18;i++){const a=(Math.PI*2*i/18),dist=70+(i%5)*11,x=Math.cos(a)*dist,y=Math.sin(a)*dist-26,r=((i*47)%210)-105;s+='<i style="--x:'+x.toFixed(0)+'px;--y:'+y.toFixed(0)+'px;--r:'+r+'deg;animation-delay:'+((i%6)*.025).toFixed(3)+'s"></i>'}return '<span class="v785-confetti">'+s+'</span>'}
 function roomReveal(n){const m=META[n],room=document.getElementById('v750Room');if(!m||!room)return;room.querySelectorAll('.v785-room-reveal').forEach(x=>x.remove());const target=room.querySelector(m.selector);target?.classList.add('v785-unlock-target');setTimeout(()=>target?.classList.remove('v785-unlock-target'),1600);const rb=room.getBoundingClientRect(),tb=target?.getBoundingClientRect();let x=50,y=48;if(tb&&rb.width&&rb.height){x=((tb.left+tb.width/2-rb.left)/rb.width)*100;y=((tb.top+tb.height/2-rb.top)/rb.height)*100}const r=document.createElement('span');r.className='v785-room-reveal';r.style.left=Math.max(13,Math.min(87,x))+'%';r.style.top=Math.max(18,Math.min(78,y))+'%';r.innerHTML='<span class="icon">'+m.icon+'</span><b>YENİ DEKOR AÇILDI</b>';room.append(r);setTimeout(()=>r.remove(),1550)}
 function show(n){const m=META[n];if(!m||document.querySelector('.v785-levelup'))return false;showing=true;markSeen(n);try{ACTIONS?.clear?.()}catch(e){};try{IDLE?.clear?.()}catch(e){};roomReveal(n);try{DEEN_SFX?.play?.('unlock')}catch(e){};setTimeout(()=>{if(document.querySelector('.v785-levelup'))return;const name=itemName(m.unlock,m.fallback),o=document.createElement('div');o.className='v785-levelup';o.innerHTML='<div class="v785-levelup-card" role="dialog" aria-modal="true">'+(reduced()?'':confetti())+'<div class="v785-level-orbit"><div class="v785-level-num"><small>ODA SEVİYESİ</small>'+n+'</div></div><div class="v785-kicker">YENİ SEVİYE</div><h2 class="v785-title">'+m.title+'</h2><p class="v785-sub">Dünyam gelişiyor. Yeni dekor mağazada açıldı ve seviye ödülün alınmaya hazır.</p><div class="v785-unlock"><span class="v785-unlock-icon">'+m.icon+'</span><span class="v785-unlock-copy"><b>'+name+'</b><small><em>Mağazada açıldı</em> · sahip olmak için Altın ile alabilirsin.</small></span></div><div class="v785-actions"><button class="v785-later" type="button">SONRA</button><button class="v785-shop" type="button">MAĞAZADA GÖR</button></div></div>';o.addEventListener('click',e=>{if(e.target===o||e.target.closest('.v785-later'))closeOverlay();if(e.target.closest('.v785-shop')){closeOverlay();setTimeout(()=>{try{WORLD.tab?.('shop')}catch(_){}},80)}});document.body.append(o);document.body.classList.add('v780-sheet-open')},reduced()?20:540);return true}
 function runQueue(){if(showing||document.querySelector('.v785-levelup'))return;const n=queue.shift();if(n)show(n)}
 function enqueueRange(from,to){const c=ensure();for(let n=Math.max(2,from+1);n<=to;n++)if(META[n]&&!c.seenLevels.includes(n)&&!queue.includes(n))queue.push(n);runQueue()}
 function detect(before,after){const c=ensure();if(after>before)enqueueRange(before,after);c.knownLevel=Math.max(c.knownLevel,after);save()}
 const oldClaimDaily=PROG.claimDaily;if(typeof oldClaimDaily==='function'&&!oldClaimDaily.__v785){const fn=function(...args){const before=currentLevel(),out=oldClaimDaily.apply(this,args),after=currentLevel();if(out!==false)detect(before,after);return out};fn.__v785=true;PROG.claimDaily=fn}
 function watch(){clearTimeout(watchTimer);const c=ensure(),now=currentLevel();if(now>c.knownLevel)detect(c.knownLevel,now);else if(now<c.knownLevel){c.knownLevel=now;save()}watchTimer=setTimeout(watch,2200)}
 document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(watchTimer)}else setTimeout(watch,500)});window.addEventListener('pagehide',()=>clearTimeout(watchTimer));
 ensure();save();watchTimer=setTimeout(watch,1200);
 window.DEEN_WORLD_LEVELUP={version:VERSION,stateVersion:STATE_VERSION,show,close:closeOverlay,preview:n=>show(Number(n)||2),snapshot:()=>{const c=ensure();return{version:VERSION,currentLevel:currentLevel(),knownLevel:c.knownLevel,seenLevels:[...c.seenLevels],queue:[...queue],showing}}};
})();
</script>`;
  window.DEEN_PATCH_V785=function(html){let out=String(html);if(out.includes('deen-v785-levelup-js'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}}
})();
