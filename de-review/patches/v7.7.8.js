(()=>{
  const VERSION='7.7.8',STATE_VERSION=51;
  const addition=`
<!-- DEEN v7.7.8 — Dünyam Visual Hierarchy & Room Composition -->
<style id="deen-v778-world-visual-css">
#worldScreenBody{padding-bottom:112px!important}
#worldScreenBody .v740-world-head{display:grid!important;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;margin-bottom:10px!important;padding:2px 1px 0}
#worldScreenBody .v740-world-head .v5-kicker{font-size:8px!important;letter-spacing:1.45px;color:#79d8c2!important}
#worldScreenBody .v740-world-head h1{font-size:24px!important;line-height:1.04;margin:5px 0 5px!important;letter-spacing:-.45px;color:#f1faf7}
#worldScreenBody .v740-world-head p{font-size:9px!important;line-height:1.4;color:#8fa6ab!important;margin:0!important;max-width:265px}
#worldScreenBody .v740-gold-pill{min-height:43px!important;border-radius:14px!important;padding:0 12px!important;font-size:10px!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.025),0 8px 20px rgba(0,0,0,.15)}
#worldScreenBody .v740-world-tabs{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:6px!important;margin:8px 0 12px!important;padding:4px;border:1px solid rgba(117,186,177,.13);border-radius:16px;background:#0a2028}
#worldScreenBody .v740-world-tabs>button{min-width:0!important;min-height:39px!important;padding:0 3px!important;border:1px solid transparent!important;border-radius:11px!important;background:transparent!important;color:#829ba1!important;font-size:7.5px!important;letter-spacing:.08px;font-weight:900!important;box-shadow:none!important;position:relative}
#worldScreenBody .v740-world-tabs>button.active{background:#153b3a!important;border-color:rgba(121,216,194,.23)!important;color:#d9f7ef!important}
#worldScreenBody .v740-world-tabs>button.active:after{content:'';position:absolute;left:28%;right:28%;bottom:4px;height:2px;border-radius:2px;background:#78dbc4;box-shadow:0 0 7px rgba(120,219,196,.35)}
#worldScreenBody .v740-world-tabs .v770-tab-badge,#worldScreenBody .v740-world-tabs .v769-badge-new{transform:scale(.8);transform-origin:center}
#worldScreenBody .v750-world{margin:4px 0 16px!important}
#worldScreenBody .v750-area-tabs{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px!important;overflow:visible!important;padding:0 0 9px!important}
#worldScreenBody .v750-area-btn{min-width:0!important;width:100%;min-height:49px!important;padding:7px 8px!important;border-radius:14px!important;text-align:left;display:flex!important;flex-direction:column;justify-content:center;gap:2px;background:linear-gradient(180deg,#102c35,#0d2730)!important;border-color:#2c4b54!important;color:#adc0c4!important;box-shadow:0 5px 14px rgba(0,0,0,.08)}
#worldScreenBody .v750-area-btn.active{background:linear-gradient(180deg,#1d4a44,#153d39)!important;border-color:#70d1bb!important;color:#ebfff9!important;box-shadow:0 8px 20px rgba(26,86,75,.18),inset 0 0 0 1px rgba(255,255,255,.025)}
#worldScreenBody .v750-area-btn.locked{background:linear-gradient(180deg,#2a2922,#22251f)!important;border-color:rgba(218,193,128,.22)!important;color:#cfbe8e!important}
#worldScreenBody .v750-area-btn .v778-area-top{display:flex;align-items:center;gap:5px;min-width:0;width:100%}
#worldScreenBody .v750-area-btn .v778-area-icon{display:grid;place-items:center;width:20px;height:20px;border-radius:7px;background:rgba(121,216,194,.08);color:#8ee3ce;font-size:11px;flex:0 0 auto}
#worldScreenBody .v750-area-btn.locked .v778-area-icon{color:#d9c37d;background:rgba(223,197,143,.07)}
#worldScreenBody .v750-area-btn .v778-area-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:8.5px;letter-spacing:.15px}
#worldScreenBody .v750-area-btn small{font-size:6.3px!important;line-height:1.25;margin:0!important;padding-left:25px;color:#7f999e!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;box-sizing:border-box}
#worldScreenBody .v750-area-btn.active small{color:#9bc1b9!important}
#worldScreenBody .v750-stage-card{border-radius:21px!important;border-color:rgba(111,183,173,.27)!important;background:#0b222a!important;box-shadow:0 18px 40px rgba(0,0,0,.18)!important}
#worldScreenBody .v750-toolbar{height:52px!important;min-height:52px!important;padding:0 11px 0 13px!important;background:linear-gradient(180deg,#0d2b35,#0a232c)!important}
#worldScreenBody .v750-toolbar .title b{font-size:11.5px!important;letter-spacing:.15px}
#worldScreenBody .v750-toolbar .title small{font-size:7.2px!important;color:#7f9ca2!important;max-width:210px!important}
#worldScreenBody .v750-edit{min-height:33px!important;padding:0 9px!important;border-radius:10px!important;font-size:7px!important;background:#102f38!important;border-color:#34555d!important}
#worldScreenBody .v750-edit:before{content:'✦';margin-right:4px;color:#8edecb}
#worldScreenBody .v750-edit.active:before{content:'✓';color:#e6cf8c}
#worldScreenBody .v750-room{height:372px!important;background:linear-gradient(180deg,#173844 0 55%,#102a2f 55% 100%)!important}
#worldScreenBody .v750-room:before{top:55%!important;height:1px!important;background:linear-gradient(90deg,transparent,rgba(151,214,205,.11) 18%,rgba(151,214,205,.11) 82%,transparent)!important}
#worldScreenBody .v750-room:after{left:-18%!important;right:-18%!important;bottom:-31%!important;height:64%!important;background:radial-gradient(ellipse at center,rgba(48,92,84,.42) 0,rgba(15,43,47,.65) 47%,rgba(8,24,29,.98) 78%)!important;box-shadow:inset 0 22px 45px rgba(130,213,193,.025)}
#worldScreenBody .v750-room.reading{background:linear-gradient(180deg,#37362f 0 55%,#252927 55% 100%)!important}
#worldScreenBody .v750-room.reading:after{background:radial-gradient(ellipse at center,rgba(126,106,71,.31),rgba(36,33,28,.96) 72%)!important}
#worldScreenBody .v750-room.garden{background:linear-gradient(180deg,#153542 0 36%,#1e493f 36% 100%)!important}
#worldScreenBody .v750-room.garden:before{top:36%!important}
#worldScreenBody .v750-room.garden:after{bottom:-36%!important;height:79%!important;background:radial-gradient(ellipse at center,#315d4c 0,#1a4135 58%,#0d2922 100%)!important}
#worldScreenBody .v750-sky{opacity:.92}
#worldScreenBody .v750-room.study .v750-sky:before,#worldScreenBody .v750-room.reading .v750-sky:before{right:24px!important;top:29px!important;width:87px!important;height:111px!important;border-width:3px!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.025),0 14px 30px rgba(0,0,0,.08)!important}
#worldScreenBody .v750-object{transition:filter .18s,transform .18s,opacity .18s!important}
#worldScreenBody .v750-obj-desk{filter:drop-shadow(0 10px 6px rgba(0,0,0,.16))}
#worldScreenBody .v750-obj-lamp{filter:drop-shadow(0 8px 8px rgba(0,0,0,.12))}
#worldScreenBody .v750-obj-plant{filter:drop-shadow(0 9px 6px rgba(0,0,0,.13))}
#worldScreenBody .v750-obj-shelf{filter:drop-shadow(0 10px 7px rgba(0,0,0,.15))}
#worldScreenBody .v750-obj-nur{transform:translate(-50%,-50%) scale(.88)!important}
#worldScreenBody .v750-obj-collectible{transform:translate(-50%,-50%) scale(.92)!important}
#worldScreenBody .v750-character{width:106px!important;height:145px!important;transform:translate(-50%,-92%)!important;filter:drop-shadow(0 10px 8px rgba(0,0,0,.16));z-index:12!important}
#worldScreenBody .v750-character:after{left:20px!important;right:20px!important;bottom:4px!important;height:10px!important;background:rgba(0,0,0,.25)!important;filter:blur(6px)!important}
#worldScreenBody .v750-character.moving{filter:drop-shadow(0 13px 10px rgba(0,0,0,.21))!important}
#worldScreenBody .v750-controls{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important;padding:8px!important;background:#091f27!important;border-top-color:rgba(255,255,255,.035)!important}
#worldScreenBody .v750-controls button{min-height:46px!important;padding:6px 3px!important;border-radius:12px!important;border-color:#294851!important;background:#0f2a33!important;color:#8fa7ac!important;font-size:6.6px!important}
#worldScreenBody .v750-controls button .v776-ico{font-size:14px!important;color:#91cfc1!important}
#worldScreenBody .v750-controls button.active{background:#173f3b!important;border-color:#62c7b2!important;color:#e5faf4!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.02)}
#worldScreenBody .v750-controls button.active .v776-ico{color:#7fe1c8!important}
#worldScreenBody .v776-hint{display:none!important}
#worldScreenBody .v750-world-note{margin-top:8px!important;padding:8px 10px!important;border-radius:11px!important;font-size:6.5px!important;line-height:1.35!important;opacity:.72}
#worldScreenBody .v750-unlock-card{margin-top:9px!important;border-radius:14px!important;padding:10px 11px!important}
#worldScreenBody .v750-unlock-card b{font-size:9px!important}
#worldScreenBody .v750-unlock-card small{font-size:6.7px!important}
#worldScreenBody .v750-unlock-card button{min-height:34px!important;border-radius:10px!important;font-size:7px!important}
#worldScreenBody .v751-activity{margin:8px 8px 0!important;border-radius:11px!important}
@media(max-width:390px){#worldScreenBody .v740-world-head h1{font-size:22px!important}#worldScreenBody .v740-world-head p{font-size:8px!important;max-width:230px}#worldScreenBody .v740-gold-pill{padding:0 9px!important;font-size:9px!important}#worldScreenBody .v740-world-tabs{gap:4px!important;padding:3px!important}#worldScreenBody .v740-world-tabs>button{font-size:6.8px!important;min-height:37px!important}#worldScreenBody .v750-area-tabs{gap:5px!important}#worldScreenBody .v750-area-btn{padding:6px!important;min-height:47px!important}#worldScreenBody .v750-area-btn .v778-area-name{font-size:7.8px}#worldScreenBody .v750-area-btn small{font-size:5.8px!important;padding-left:23px}#worldScreenBody .v750-room{height:350px!important}#worldScreenBody .v750-character{width:101px!important;height:139px!important}#worldScreenBody .v750-controls button{font-size:6.2px!important;min-height:44px!important}}
</style>
<script id="deen-v778-world-visual-js">
(()=>{
 if(window.__deenV778Applied)return;window.__deenV778Applied=true;
 const VERSION='7.7.8',STATE_VERSION=51;
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v7.7.8 — Dünyam Visual Hierarchy & Room Composition';
 const IW=window.DEEN_INTERACTIVE_WORLD;if(!IW)return;
 const icons={study:'▰',reading:'▥',garden:'♧'};let scheduled=false;
 function currentArea(){try{return IW.state?.().currentArea||'study'}catch(e){return'study'}}
 function decorateAreas(){const wrap=document.querySelector('#worldScreenBody .v750-area-tabs');if(!wrap)return;[...wrap.querySelectorAll('.v750-area-btn')].forEach((btn,i)=>{if(btn.dataset.v778==='1')return;const small=btn.querySelector('small');const sub=small?.textContent||'';const raw=[...btn.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ').replace(/🔒/g,'').trim();const id=i===0?'study':i===1?'reading':'garden';[...btn.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.remove());const top=document.createElement('span');top.className='v778-area-top';top.innerHTML='<span class="v778-area-icon">'+(btn.classList.contains('locked')?'⌾':icons[id])+'</span><span class="v778-area-name">'+(raw||['Çalışma Köşesi','Okuma Köşesi','Bahçe'][i])+'</span>';btn.insertBefore(top,small||null);if(small)small.textContent=sub;btn.dataset.v778='1'})}
 function decorateToolbar(){const card=document.querySelector('#worldScreenBody .v750-stage-card');if(!card)return;const title=card.querySelector('.v750-toolbar .title small');if(title&&!card.classList.contains('editing')&&title.textContent!=='Konum seç veya odadaki bir eşyaya dokun')title.textContent='Konum seç veya odadaki bir eşyaya dokun';const room=document.getElementById('v750Room');if(room)room.dataset.v778Area=currentArea()}
 function decorate(){scheduled=false;decorateAreas();decorateToolbar();const h=document.querySelector('#worldScreenBody .v740-world-head h1'),p=document.querySelector('#worldScreenBody .v740-world-head p');if(h&&h.textContent!=='Benim Köşem')h.textContent='Benim Köşem';if(p&&p.textContent!=='Karakterini yaşat, odanı düzenle ve yeni alanlar aç.')p.textContent='Karakterini yaşat, odanı düzenle ve yeni alanlar aç.'}
 function schedule(ms=60){if(scheduled)return;scheduled=true;setTimeout(decorate,ms)}
 document.addEventListener('click',e=>{if(e.target.closest?.('.navbtn[data-screen="worldScreen"],#worldScreen .v740-world-tabs button,#worldScreenBody .v750-area-btn,#worldScreenBody .v750-edit,#worldScreenBody .v776-edit-reset'))schedule(110)},true);
 window.addEventListener('pageshow',()=>schedule(120));
 const body=document.getElementById('worldScreenBody');if(body){new MutationObserver(()=>schedule(50)).observe(body,{childList:true,subtree:true})}
 state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);try{saveState?.()}catch(e){}
 window.DEEN_WORLD_VISUAL={version:VERSION,stateVersion:STATE_VERSION,decorate,snapshot:()=>({version:VERSION,area:currentArea(),characterScale:getComputedStyle(document.querySelector('#worldScreenBody .v750-character')||document.body).width,areaButtons:document.querySelectorAll('#worldScreenBody .v750-area-btn').length,worldTabs:document.querySelectorAll('#worldScreenBody .v740-world-tabs>button').length})};
 setTimeout(decorate,500);
})();
</script>`;
 window.DEEN_PATCH_V778=function(html){let out=String(html);if(out.includes('deen-v778-world-visual-js'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}}
})();
