(()=>{
  const VERSION='7.7.9',STATE_VERSION=52;
  const addition=`
<!-- DEEN v7.7.9 — Dünyam Asset Polish -->
<style id="deen-v779-asset-polish-css">
#worldScreenBody .v750-object{will-change:filter}
#worldScreenBody .v750-obj-desk{width:112px!important;height:62px!important}
#worldScreenBody .v750-obj-desk .top{left:1px!important;right:1px!important;top:7px!important;height:17px!important;border-radius:6px!important;background:linear-gradient(180deg,#a17b58 0%,#806047 48%,#674c3a 100%)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.12),inset 0 -2px 0 rgba(52,35,25,.28),0 4px 0 #513b2f,0 8px 12px rgba(0,0,0,.1)!important}
#worldScreenBody .v750-obj-desk .leg1,#worldScreenBody .v750-obj-desk .leg2{top:24px!important;width:9px!important;height:32px!important;border-radius:2px 2px 4px 4px!important;background:linear-gradient(90deg,#4b372d,#715341 45%,#49352c)!important;box-shadow:inset 1px 0 rgba(255,255,255,.04)}
#worldScreenBody .v750-obj-desk .leg1{left:15px!important}#worldScreenBody .v750-obj-desk .leg2{right:15px!important}
#worldScreenBody .v779-desk-drawer{position:absolute;left:34px;top:26px;width:44px;height:11px;border-radius:2px 2px 4px 4px;background:linear-gradient(180deg,#684d3c,#503b30);box-shadow:inset 0 1px rgba(255,255,255,.05)}
#worldScreenBody .v779-desk-drawer:after{content:'';position:absolute;left:19px;top:4px;width:7px;height:2px;border-radius:3px;background:#c0a47a;opacity:.72}
#worldScreenBody .v779-desk-book{position:absolute;left:12px;top:2px;width:26px;height:5px;border-radius:2px;background:linear-gradient(90deg,#316d66,#4b8f82);box-shadow:0 -4px 0 -1px #c3a86e;transform:rotate(-1.5deg);opacity:.9}
#worldScreenBody .v750-obj-lamp{width:46px!important;height:72px!important}
#worldScreenBody .v750-obj-lamp .shade{top:1px!important;left:5px!important;width:36px!important;height:25px!important;background:linear-gradient(180deg,#f0d994,#d2ad60 72%,#a98446)!important;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12))!important;box-shadow:inset 0 2px rgba(255,255,255,.16)}
#worldScreenBody .v750-obj-lamp .stem{left:21px!important;top:25px!important;width:4px!important;height:36px!important;background:linear-gradient(90deg,#6f5a3b,#b09257 46%,#665134)!important;border-radius:3px}
#worldScreenBody .v750-obj-lamp .base{left:7px!important;bottom:3px!important;width:32px!important;height:7px!important;background:linear-gradient(180deg,#a88a55,#6e593b)!important;box-shadow:0 3px 5px rgba(0,0,0,.16)}
#worldScreenBody .v779-lamp-glow{position:absolute;left:-10px;top:-10px;width:66px;height:70px;border-radius:50%;background:radial-gradient(circle at 52% 34%,rgba(255,226,145,.24),rgba(241,201,104,.08) 42%,transparent 72%);opacity:.45;filter:blur(2px);z-index:-1;transition:opacity .22s}
#worldScreenBody .v750-room.v779-lamp-on .v779-lamp-glow{opacity:1;filter:blur(1px)}
#worldScreenBody .v750-room.v779-lamp-on .v750-obj-lamp .shade{filter:drop-shadow(0 0 12px rgba(247,210,119,.42))!important}
#worldScreenBody .v750-obj-rug{width:140px!important;height:74px!important;opacity:.96!important;background:radial-gradient(ellipse at center,#387b70 0 36%,#28665e 37% 55%,#1a4c47 56% 65%,#113c39 66% 100%)!important;box-shadow:0 10px 12px rgba(0,0,0,.16),inset 0 0 0 2px rgba(176,231,216,.08)!important}
#worldScreenBody .v750-room.reading .v750-obj-rug{background:radial-gradient(ellipse at center,#9a8458 0 36%,#766445 37% 55%,#5a4d39 56% 65%,#413a2f 66% 100%)!important}
#worldScreenBody .v750-room.garden .v750-obj-rug{background:radial-gradient(ellipse at center,#67856d 0 36%,#4c6953 37% 55%,#35533e 56% 65%,#294333 66% 100%)!important}
#worldScreenBody .v779-rug-medallion{position:absolute;left:50%;top:50%;width:52px;height:25px;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(209,239,229,.17);box-shadow:inset 0 0 0 5px rgba(8,46,42,.08)}
#worldScreenBody .v779-rug-medallion:before,#worldScreenBody .v779-rug-medallion:after{content:'';position:absolute;top:50%;width:8px;height:8px;border:1px solid rgba(220,241,233,.16);transform:translateY(-50%) rotate(45deg)}
#worldScreenBody .v779-rug-medallion:before{left:-22px}#worldScreenBody .v779-rug-medallion:after{right:-22px}
#worldScreenBody .v750-obj-plant{width:62px!important;height:86px!important}
#worldScreenBody .v750-obj-plant .pot{left:14px!important;bottom:1px!important;width:34px!important;height:27px!important;border-radius:4px 4px 12px 12px!important;background:linear-gradient(90deg,#7c5b43,#a87a55 48%,#6e513e)!important;box-shadow:inset 0 2px rgba(255,255,255,.07),0 6px 6px rgba(0,0,0,.12)}
#worldScreenBody .v750-obj-plant .pot:before{content:'';position:absolute;left:-2px;right:-2px;top:-3px;height:7px;border-radius:6px;background:#a77a57;box-shadow:inset 0 2px rgba(255,255,255,.06)}
#worldScreenBody .v750-obj-plant .leaf{background:linear-gradient(135deg,#75b98d,#397c60)!important;box-shadow:inset 2px 1px rgba(255,255,255,.06)}
#worldScreenBody .v779-stem{position:absolute;left:30px;top:26px;width:2px;height:38px;background:#3e7458;transform-origin:bottom;border-radius:4px}
#worldScreenBody .v779-stem.s2{transform:rotate(-18deg);height:31px;left:27px;top:31px}.v779-stem.s3{transform:rotate(20deg);height:32px;left:33px;top:30px}
#worldScreenBody .v779-leaf{position:absolute;width:15px;height:29px;border-radius:100% 0 100% 0;background:linear-gradient(135deg,#69ad83,#34745a);transform-origin:bottom center}
#worldScreenBody .v779-leaf.l4{left:34px;top:16px;transform:rotate(42deg)}#worldScreenBody .v779-leaf.l5{left:7px;top:28px;transform:rotate(-66deg)}
#worldScreenBody .v750-obj-shelf{width:82px!important;height:112px!important;border:6px solid #5b4434!important;border-radius:7px!important;background:linear-gradient(90deg,#312b27,#292725 52%,#312a26)!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.025),0 10px 12px rgba(0,0,0,.12)!important}
#worldScreenBody .v750-obj-shelf:after{content:''!important;left:0!important;right:0!important;top:31px!important;height:4px!important;background:#5a4333!important;box-shadow:0 36px 0 #5a4333!important;font-size:0!important;line-height:0!important}
#worldScreenBody .v779-books{position:absolute;inset:7px 6px 8px 6px;display:grid;grid-template-rows:1fr 1fr 1fr;gap:7px;padding:3px 2px;box-sizing:border-box}
#worldScreenBody .v779-books-row{display:flex;align-items:flex-end;gap:2px;padding:0 3px}
#worldScreenBody .v779-book{width:7px;border-radius:1px 1px 0 0;background:#406f68;box-shadow:inset 1px 0 rgba(255,255,255,.06)}
#worldScreenBody .v779-book:nth-child(2n){background:#a17450}.v779-book:nth-child(3n){background:#806b44}.v779-book:nth-child(4n){background:#4b6070}.v779-book:nth-child(5n){background:#6e4f48}
#worldScreenBody .v779-window-scene{position:absolute;right:24px;top:29px;width:87px;height:111px;border-radius:35px 35px 6px 6px;overflow:hidden;z-index:1;pointer-events:none;box-sizing:border-box}
#worldScreenBody .v779-window-scene:before{content:'';position:absolute;inset:4px;border-radius:31px 31px 4px 4px;background:radial-gradient(circle at 73% 24%,rgba(229,217,162,.82) 0 3px,transparent 4px),linear-gradient(180deg,#174353 0%,#163747 60%,#152f39 100%);box-shadow:inset 0 -18px 26px rgba(8,25,31,.22)}
#worldScreenBody .v779-window-scene:after{content:'';position:absolute;left:50%;top:4px;bottom:4px;width:2px;background:rgba(125,183,184,.16);box-shadow:-42px 58px 0 -1px rgba(125,183,184,.12)}
#worldScreenBody .v750-room.reading .v779-window-scene:before{background:radial-gradient(circle at 72% 26%,rgba(236,208,137,.7) 0 3px,transparent 4px),linear-gradient(180deg,#394c51,#443e32 100%)}
#worldScreenBody .v779-window-sill{position:absolute;right:17px;top:139px;width:100px;height:6px;border-radius:2px;background:linear-gradient(180deg,#365861,#213d45);z-index:2;box-shadow:0 4px 6px rgba(0,0,0,.11)}
#worldScreenBody .v750-room.reading .v779-window-sill{background:linear-gradient(180deg,#6d624b,#4e4739)}
#worldScreenBody .v750-obj-nur{width:48px!important;height:48px!important;background:radial-gradient(circle,#fff8d8 0 5%,#bff4e8 11%,#70d9c5 20%,rgba(78,194,174,.22) 43%,transparent 70%)!important;filter:drop-shadow(0 0 12px rgba(108,229,204,.46))!important}
#worldScreenBody .v779-nur-ring{position:absolute;inset:7px;border:1px solid rgba(185,247,233,.18);border-radius:50%;box-shadow:0 0 0 5px rgba(85,207,184,.03)}
#worldScreenBody .v750-obj-collectible{width:46px!important;height:46px!important;border-radius:14px!important;background:linear-gradient(180deg,#3b3525,#29271f)!important;border-color:rgba(234,205,126,.42)!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.025),0 8px 10px rgba(0,0,0,.12)!important}
#worldScreenBody .v750-room.editing .v750-object{filter:drop-shadow(0 0 9px rgba(118,217,193,.23))!important}
#worldScreenBody .v750-room.editing .v750-object.dragging{filter:drop-shadow(0 14px 12px rgba(0,0,0,.32))!important}
@media(max-width:390px){#worldScreenBody .v750-obj-desk{transform:translate(-50%,-50%) scale(.9)!important}#worldScreenBody .v750-obj-rug{transform:translate(-50%,-50%) scale(.94)!important}#worldScreenBody .v779-window-scene{right:24px;top:29px;width:87px;height:111px}}
</style>
<script id="deen-v779-asset-polish-js">
(()=>{
 if(window.__deenV779Applied)return;window.__deenV779Applied=true;
 const VERSION='7.7.9',STATE_VERSION=52;
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v7.7.9 — Dünyam Asset Polish';
 let scheduled=false;
 function living(){const x=state.myWorld?.interactiveWorld?.living;return x&&typeof x==='object'?x:null}
 function area(){try{return window.DEEN_INTERACTIVE_WORLD?.state?.().currentArea||'study'}catch(e){return'study'}}
 function add(el,cls,html=''){const key=String(cls).trim().replace(/\s+/g,'-');if(!el||el.querySelector(':scope > [data-v779="'+key+'"]'))return;const n=document.createElement('span');n.className=cls;n.dataset.v779=key;n.innerHTML=html;el.append(n)}
 function decorateDesk(el){add(el,'v779-desk-drawer');add(el,'v779-desk-book')}
 function decorateLamp(el){add(el,'v779-lamp-glow')}
 function decorateRug(el){add(el,'v779-rug-medallion')}
 function decoratePlant(el){add(el,'v779-stem');add(el,'v779-stem s2');add(el,'v779-stem s3');add(el,'v779-leaf l4');add(el,'v779-leaf l5')}
 function decorateShelf(el){if(!el||el.querySelector(':scope > .v779-books'))return;const wrap=document.createElement('span');wrap.className='v779-books';for(let r=0;r<3;r++){const row=document.createElement('span');row.className='v779-books-row';for(let i=0;i<6;i++){const b=document.createElement('span');b.className='v779-book';b.style.height=(12+((i+r*2)%4)*3)+'px';row.append(b)}wrap.append(row)}el.append(wrap)}
 function decorateNur(el){add(el,'v779-nur-ring')}
 function decorateWindow(room){if(!room||room.classList.contains('garden'))return;const sky=room.querySelector('.v750-sky');if(!sky)return;if(!sky.querySelector('.v779-window-scene')){const w=document.createElement('span');w.className='v779-window-scene';sky.append(w)}if(!sky.querySelector('.v779-window-sill')){const s=document.createElement('span');s.className='v779-window-sill';sky.append(s)}}
 function syncLamp(room){if(!room)return;const on=!!living()?.lampOn?.[area()];room.classList.toggle('v779-lamp-on',on)}
 function decorate(){scheduled=false;const room=document.getElementById('v750Room');if(!room)return;decorateDesk(room.querySelector('.v750-obj-desk'));decorateLamp(room.querySelector('.v750-obj-lamp'));decorateRug(room.querySelector('.v750-obj-rug'));decoratePlant(room.querySelector('.v750-obj-plant'));decorateShelf(room.querySelector('.v750-obj-shelf'));decorateNur(room.querySelector('.v750-obj-nur'));decorateWindow(room);syncLamp(room)}
 function schedule(ms=50){if(scheduled)return;scheduled=true;setTimeout(decorate,ms)}
 document.addEventListener('click',e=>{if(e.target.closest?.('#worldScreenBody .v750-object,#worldScreenBody .v750-area-btn,#worldScreenBody .v750-edit,.navbtn[data-screen="worldScreen"],#worldScreen .v740-world-tabs button'))schedule(120)},true);
 window.addEventListener('pageshow',()=>schedule(130));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(120)});
 const body=document.getElementById('worldScreenBody');if(body)new MutationObserver(()=>schedule(60)).observe(body,{childList:true,subtree:true});
 state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);try{saveState?.()}catch(e){}
 window.DEEN_WORLD_ASSETS={version:VERSION,stateVersion:STATE_VERSION,decorate,snapshot:()=>({version:VERSION,area:area(),desk:!!document.querySelector('.v779-desk-drawer'),lamp:!!document.querySelector('.v779-lamp-glow'),rug:!!document.querySelector('.v779-rug-medallion'),plant:!!document.querySelector('.v779-leaf'),shelf:!!document.querySelector('.v779-books'),window:!!document.querySelector('.v779-window-scene'),nur:!!document.querySelector('.v779-nur-ring')})};
 setTimeout(decorate,520);
})();
</script>`;
 window.DEEN_PATCH_V779=function(html){let out=String(html);if(out.includes('deen-v779-asset-polish-js'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}}
})();
