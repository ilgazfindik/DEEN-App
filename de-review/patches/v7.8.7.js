(()=>{
  const VERSION='7.8.7',STATE_VERSION=60;
  const addition=`
<!-- DEEN v7.8.7 — Room Decor Equip & Personalization -->
<style id="deen-v787-room-personalization-css">
#worldScreenBody .v787-customizer{margin:9px 0 8px;padding:10px;border:1px solid rgba(123,205,187,.17);border-radius:15px;background:linear-gradient(180deg,#0d2a31,#0a232a);box-shadow:0 8px 20px rgba(0,0,0,.06)}
#worldScreenBody .v787-customizer-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:9px}
#worldScreenBody .v787-customizer-head b{display:block;font-size:9px;color:#edf8f5}.v787-customizer-head small{display:block;margin-top:2px;font-size:6.2px;line-height:1.35;color:#81999e}
#worldScreenBody .v787-shop-link{border:1px solid #36535a;background:#102c33;color:#95b4b4;min-height:31px;border-radius:10px;padding:0 9px;font-size:6.3px;font-weight:950;white-space:nowrap}
#worldScreenBody .v787-groups{display:grid;gap:7px}
#worldScreenBody .v787-group{display:grid;grid-template-columns:62px minmax(0,1fr);gap:7px;align-items:center}
#worldScreenBody .v787-group-label{font-size:6.5px;font-weight:950;color:#8ca5a9;letter-spacing:.25px}
#worldScreenBody .v787-options{display:flex;gap:6px;min-width:0;overflow-x:auto;scrollbar-width:none;padding:1px}.v787-options::-webkit-scrollbar{display:none}
#worldScreenBody .v787-choice{flex:0 0 auto;min-height:35px;border:1px solid #315058;border-radius:10px;background:#102a31;color:#9eb6b8;padding:6px 8px;font-size:6.5px;font-weight:900;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:transform .12s,border-color .12s,background .12s}
#worldScreenBody .v787-choice:active{transform:scale(.97)}#worldScreenBody .v787-choice .ico{font-size:12px;color:#8bdcca}
#worldScreenBody .v787-choice.active{border-color:#79d9c2;background:linear-gradient(180deg,#1b4a43,#143c38);color:#eefaf7;box-shadow:inset 0 0 0 1px rgba(126,225,202,.08)}
#worldScreenBody .v787-choice.active .ico{color:#b5f0e1}
#worldScreenBody .v787-current{margin-top:8px;padding-top:8px;border-top:1px solid rgba(117,195,179,.1);display:flex;justify-content:space-between;gap:8px;color:#789196;font-size:6.1px}.v787-current b{color:#a8c8c4;font-size:6.2px}
#worldScreenBody .v750-room.v787-no-plant .v750-obj-plant,#worldScreenBody .v750-room.v787-no-shelf .v750-obj-shelf{display:none!important}
#worldScreenBody .v750-room.v787-desk-sand .v750-obj-desk .top{background:linear-gradient(180deg,#d2b68a 0%,#b99669 50%,#8e704f 100%)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.2),inset 0 -2px 0 rgba(75,52,32,.18),0 4px 0 #765a40,0 8px 12px rgba(0,0,0,.09)!important}
#worldScreenBody .v750-room.v787-desk-sand .v750-obj-desk .leg1,#worldScreenBody .v750-room.v787-desk-sand .v750-obj-desk .leg2{background:linear-gradient(90deg,#765a43,#ad8b65 45%,#6c513c)!important}
#worldScreenBody .v750-room.v787-desk-sand .v779-desk-drawer{background:linear-gradient(180deg,#aa8864,#82654a)!important}
#worldScreenBody .v750-room.v787-rug-sunrise .v750-obj-rug{background:radial-gradient(ellipse at center,#d7b26e 0 25%,#bb8259 26% 46%,#8f594f 47% 62%,#633e42 63% 100%)!important;box-shadow:0 10px 13px rgba(0,0,0,.16),inset 0 0 0 2px rgba(255,226,171,.11)!important}
#worldScreenBody .v750-room.v787-rug-sunrise .v779-rug-medallion{border-color:rgba(255,231,180,.25)!important;box-shadow:inset 0 0 0 5px rgba(99,55,41,.09),0 0 16px rgba(231,181,101,.08)!important}
#worldScreenBody .v750-room.v787-plant-olive .v750-obj-plant .leaf,#worldScreenBody .v750-room.v787-plant-olive .v779-leaf{background:linear-gradient(135deg,#8ab070,#496f51)!important}
#worldScreenBody .v750-room.v787-plant-olive .v750-obj-plant .pot{background:linear-gradient(90deg,#77604c,#a38362 48%,#685442)!important}
#worldScreenBody .v750-room.v787-shelf-oak .v750-obj-shelf{border-color:#72583d!important;background:linear-gradient(90deg,#3d3027,#332b25 52%,#3d3027)!important}
#worldScreenBody .v750-room.v787-shelf-oak .v750-obj-shelf:after{background:#72563d!important;box-shadow:0 36px 0 #72563d!important}
#worldScreenBody .v750-room.v787-window-night .v779-window-scene:before{background:radial-gradient(circle at 72% 24%,rgba(244,224,153,.92) 0 4px,transparent 5px),radial-gradient(circle at 28% 31%,rgba(226,246,241,.7) 0 1px,transparent 2px),radial-gradient(circle at 53% 17%,rgba(226,246,241,.56) 0 1px,transparent 2px),linear-gradient(180deg,#0c2638 0%,#102c3d 52%,#152f39 100%)!important;box-shadow:inset 0 -22px 30px rgba(3,14,22,.3)!important}
#worldScreenBody .v750-room.reading.v787-window-night .v779-window-scene:before{background:radial-gradient(circle at 72% 24%,rgba(244,220,151,.86) 0 4px,transparent 5px),radial-gradient(circle at 30% 31%,rgba(245,232,193,.58) 0 1px,transparent 2px),linear-gradient(180deg,#252d39,#3a342d 100%)!important}
#worldScreenBody .v750-room.v787-nur-starlight .v750-obj-nur{background:radial-gradient(circle,#fffdf0 0 5%,#ffe9a3 10%,#e7c565 21%,rgba(223,184,78,.26) 44%,transparent 71%)!important;filter:drop-shadow(0 0 15px rgba(238,203,103,.6))!important}
#worldScreenBody .v750-room.v787-nur-starlight .v779-nur-ring{border-color:rgba(255,231,159,.28)!important;box-shadow:0 0 0 5px rgba(232,193,91,.045),0 0 14px rgba(232,193,91,.12)!important}
#worldScreenBody .v787-equip-flash{animation:v787Equip .55s ease both!important}@keyframes v787Equip{0%{filter:brightness(1)}45%{filter:brightness(1.22) drop-shadow(0 0 13px rgba(132,228,205,.34))}100%{filter:brightness(1)}}
html.v5-reduce #worldScreenBody .v787-equip-flash,html.v625-motion-off #worldScreenBody .v787-equip-flash{animation:none!important}@media(prefers-reduced-motion:reduce){#worldScreenBody .v787-equip-flash{animation:none!important}}
@media(max-width:390px){#worldScreenBody .v787-customizer{padding:8px}.v787-group{grid-template-columns:54px minmax(0,1fr)!important}.v787-choice{min-height:33px!important;padding:5px 7px!important}.v787-shop-link{padding:0 7px!important}}
</style>
<script id="deen-v787-room-personalization-js">
(()=>{
 if(window.__deenV787Applied)return;window.__deenV787Applied=true;
 const VERSION='7.8.7',STATE_VERSION=60;
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v7.8.7 — Room Decor Equip & Personalization';
 const WORLD=window.DEEN_WORLD,IW=window.DEEN_INTERACTIVE_WORLD,ASSETS=window.DEEN_WORLD_ASSETS,EVOLUTION=window.DEEN_WORLD_EVOLUTION;
 if(!WORLD||!IW)return;
 const GROUPS=[
  {type:'desk',label:'MASA',icon:'▰',base:null,baseName:'Standart Masa',ids:['desk_sand']},
  {type:'rug',label:'HALI',icon:'◉',base:'rug_teal',baseName:'Teal Halı',ids:['rug_sunrise']},
  {type:'plant',label:'BİTKİ',icon:'♧',base:null,baseName:'Bitki Yok',ids:['plant_olive']},
  {type:'shelf',label:'KİTAPLIK',icon:'▥',base:null,baseName:'Kitaplık Yok',ids:['shelf_oak']},
  {type:'window',label:'PENCERE',icon:'◒',base:null,baseName:'Standart Pencere',ids:['window_night']},
  {type:'nur',label:'NUR',icon:'✦',base:null,baseName:'Standart NUR',ids:['nur_starlight']}
 ];
 let scheduled=false,observer=null;
 function save(){try{saveState?.()}catch(e){}}
 function owned(id){return !id||id==='rug_teal'||!!state.myWorld?.owned?.includes?.(id)}
 function items(){try{return WORLD.items?.()||[]}catch(e){return[]}}
 function item(id){return items().find(x=>x.id===id)||null}
 function eq(){state.myWorld=state.myWorld&&typeof state.myWorld==='object'?state.myWorld:{};state.myWorld.equipped=state.myWorld.equipped&&typeof state.myWorld.equipped==='object'?state.myWorld.equipped:{};if(!state.myWorld.equipped.rug)state.myWorld.equipped.rug='rug_teal';return state.myWorld.equipped}
 function room(){return document.getElementById('v750Room')}
 function editing(){try{return !!IW.state?.().editMode}catch(e){return false}}
 function nameFor(id,fallback){return id?(item(id)?.name||fallback):fallback}
 function currentName(g){const v=eq()[g.type]??g.base;return v===g.base?g.baseName:nameFor(v,g.baseName)}
 function applyThemes(flashType=null){const r=room();if(!r)return false;const e=eq();[...r.classList].filter(x=>x.startsWith('v787-')&&!['v787-equip-flash'].includes(x)).forEach(x=>r.classList.remove(x));r.classList.add('v787-personalized');r.classList.toggle('v787-no-plant',!e.plant);r.classList.toggle('v787-no-shelf',!e.shelf);if(e.desk==='desk_sand')r.classList.add('v787-desk-sand');if(e.rug==='rug_sunrise')r.classList.add('v787-rug-sunrise');if(e.plant==='plant_olive')r.classList.add('v787-plant-olive');if(e.shelf==='shelf_oak')r.classList.add('v787-shelf-oak');if(e.window==='window_night')r.classList.add('v787-window-night');if(e.nur==='nur_starlight')r.classList.add('v787-nur-starlight');r.dataset.v787Equipped=[e.desk||'default',e.rug||'rug_teal',e.plant||'none',e.shelf||'none',e.window||'default',e.nur||'default'].join('|');if(flashType){const sel={desk:'.v750-obj-desk',rug:'.v750-obj-rug',plant:'.v750-obj-plant',shelf:'.v750-obj-shelf',window:'.v779-window-scene',nur:'.v750-obj-nur'}[flashType],t=sel?r.querySelector(sel):null;t?.classList.remove('v787-equip-flash');if(t){void t.offsetWidth;t.classList.add('v787-equip-flash');setTimeout(()=>t.classList.remove('v787-equip-flash'),620)}}return true}
 function choice(g,id,label){const cur=(eq()[g.type]??g.base)===id,icon=id?(item(id)?.icon||g.icon):g.icon;return '<button type="button" class="v787-choice '+(cur?'active':'')+'" data-v787-type="'+g.type+'" data-v787-id="'+(id??'__base__')+'"><span class="ico">'+icon+'</span><span>'+label+'</span></button>'}
 function groupHtml(g){let opts=[choice(g,g.base,g.baseName)];for(const id of g.ids){if(owned(id))opts.push(choice(g,id,nameFor(id,id)))}return '<div class="v787-group"><span class="v787-group-label">'+g.label+'</span><div class="v787-options">'+opts.join('')+'</div></div>'}
 function customizerHtml(){const summary=GROUPS.map(g=>currentName(g)).join(' · ');return '<div class="v787-customizer"><div class="v787-customizer-head"><div><b>DEKOR STİLİ</b><small>Sahip olduğun parçaları tek dokunuşla odaya uygula.</small></div><button type="button" class="v787-shop-link" data-v787-shop>MAĞAZA</button></div><div class="v787-groups">'+GROUPS.map(groupHtml).join('')+'</div><div class="v787-current"><span>Seçimler otomatik kaydolur</span><b>'+summary+'</b></div></div>'}
 function decorateCustomizer(){const tray=document.querySelector('#worldScreenBody .v750-tray');if(!tray||!editing()){tray?.querySelector('.v787-customizer')?.remove();return}let box=tray.querySelector(':scope > .v787-customizer');if(!box){tray.insertAdjacentHTML('afterbegin',customizerHtml());box=tray.querySelector(':scope > .v787-customizer')}else box.outerHTML=customizerHtml();box=tray.querySelector(':scope > .v787-customizer');const head=tray.querySelector('.v750-tray-head b'),sub=tray.querySelector('.v750-tray-head small');if(head)head.textContent='YERLEŞİM';if(sub)sub.textContent='Eşyaları sürükle veya görünürlüğünü değiştir.';box?.querySelectorAll('[data-v787-type]').forEach(b=>b.addEventListener('click',()=>{const type=b.dataset.v787Type,id=b.dataset.v787Id==='__base__'?GROUPS.find(g=>g.type===type)?.base:b.dataset.v787Id;equip(type,id)}));box?.querySelector('[data-v787-shop]')?.addEventListener('click',()=>{try{if(editing())IW.edit?.()}catch(e){};setTimeout(()=>WORLD.tab?.('shop'),70)})}
 function equip(type,id){const g=GROUPS.find(x=>x.type===type);if(!g)return false;if(id!==g.base&&!owned(id)){toast?.('Bu dekor henüz sende yok.');return false}const e=eq();e[type]=id;if(type==='rug'&&!e[type])e[type]='rug_teal';save();applyThemes(type);decorateCustomizer();try{DEEN_SFX?.play?.('snap')}catch(_){};toast?.((id?nameFor(id,g.baseName):g.baseName)+' kullanılıyor');return true}
 function decorate(){scheduled=false;eq();applyThemes();decorateCustomizer()}
 function schedule(ms=45){if(scheduled)return;scheduled=true;setTimeout(decorate,ms)}
 const oldEquip=WORLD.equip;if(typeof oldEquip==='function'&&!oldEquip.__v787){const fn=function(id,...args){const out=oldEquip.call(this,id,...args);setTimeout(()=>{applyThemes(item(id)?.type||null);decorateCustomizer()},120);return out};fn.__v787=true;WORLD.equip=fn}
 const oldBuy=WORLD.buy;if(typeof oldBuy==='function'&&!oldBuy.__v787){const fn=function(id,...args){const out=oldBuy.call(this,id,...args);setTimeout(()=>{applyThemes(item(id)?.type||null);decorateCustomizer()},140);return out};fn.__v787=true;WORLD.buy=fn}
 document.addEventListener('click',e=>{if(e.target.closest?.('#worldScreenBody [data-v780="edit"],#worldScreenBody .v780-area-select,#worldScreenBody .v780-back-btn,.navbtn[data-screen="worldScreen"],#worldScreenBody .v750-inventory button'))schedule(100)},true);
 observer=new MutationObserver(ms=>{for(const m of ms){for(const n of m.addedNodes){if(n.nodeType===1&&(n.matches?.('#v750Room,.v750-tray,.v750-world')||n.querySelector?.('#v750Room,.v750-tray,.v750-world'))){schedule(40);return}}}});observer.observe(document.body,{childList:true,subtree:true});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(110)});window.addEventListener('pageshow',()=>schedule(120));
 state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);eq();save();
 window.DEEN_WORLD_DECOR={version:VERSION,stateVersion:STATE_VERSION,equip,apply:applyThemes,refresh:decorate,owned:id=>owned(id),snapshot:()=>({version:VERSION,editing:editing(),equipped:{...eq()},roomClasses:room()?[...room().classList].filter(x=>x.startsWith('v787-')):[],customizer:!!document.querySelector('#worldScreenBody .v787-customizer')})};
 setTimeout(()=>{try{ASSETS?.decorate?.();EVOLUTION?.apply?.()}catch(e){};decorate()},760);
})();
</script>`;
  window.DEEN_PATCH_V787=function(html){let out=String(html);if(out.includes('deen-v787-room-personalization-js'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}}
})();
