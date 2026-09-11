(()=>{
 if(window.__deenV790Applied)return;window.__deenV790Applied=true;
 const VERSION='7.9.0',STATE_VERSION=63;
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v7.9.0 — Room Presets';
 const DECOR=window.DEEN_WORLD_DECOR,COLLECTION=window.DEEN_WORLD_COLLECTION,IW=window.DEEN_INTERACTIVE_WORLD,PREVIEW=window.DEEN_WORLD_PREVIEW,IDLE=window.DEEN_WORLD_IDLE,ACTIONS=window.DEEN_WORLD_ACTIONS;
 if(!DECOR||!COLLECTION||!IW)return;
 const TYPES=['desk','rug','plant','shelf','window','nur'];
 const STARTER={desk:null,rug:'rug_teal',plant:null,shelf:null,window:null,nur:null};
 const SLOTS=[
  {id:'work',name:'Çalışma',icon:'▰'},
  {id:'night',name:'Gece',icon:'☾'},
  {id:'nature',name:'Doğa',icon:'♧'}
 ];
 let scheduled=false;
 function save(){try{saveState?.()}catch(e){}}
 function editing(){try{return !!IW.state?.().editMode}catch(e){return false}}
 function eq(){state.myWorld=state.myWorld&&typeof state.myWorld==='object'?state.myWorld:{};state.myWorld.equipped=state.myWorld.equipped&&typeof state.myWorld.equipped==='object'?state.myWorld.equipped:{};if(!state.myWorld.equipped.rug)state.myWorld.equipped.rug='rug_teal';return state.myWorld.equipped}
 function cloneEquipped(){const e=eq(),out={};for(const t of TYPES)out[t]=Object.prototype.hasOwnProperty.call(e,t)?e[t]:STARTER[t];return out}
 function ensure(){state.myWorld=state.myWorld&&typeof state.myWorld==='object'?state.myWorld:{};let p=state.myWorld.roomPresets&&typeof state.myWorld.roomPresets==='object'?state.myWorld.roomPresets:{};p.version=VERSION;p.slots=p.slots&&typeof p.slots==='object'?p.slots:{};for(const s of SLOTS){const old=p.slots[s.id]&&typeof p.slots[s.id]==='object'?p.slots[s.id]:{};p.slots[s.id]={id:s.id,name:s.name,icon:s.icon,snapshot:old.snapshot&&typeof old.snapshot==='object'?old.snapshot:null,updatedAt:Number(old.updatedAt)||0}}state.myWorld.roomPresets=p;state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);return p}
 function slot(id){return ensure().slots[id]||null}
 function owned(id){return id==null||id==='rug_teal'||!!state.myWorld?.owned?.includes?.(id)}
 function normalizeSnapshot(snap){const cur=cloneEquipped(),out={};for(const t of TYPES){const raw=Object.prototype.hasOwnProperty.call(snap||{},t)?snap[t]:STARTER[t];out[t]=owned(raw)?raw:cur[t]}return out}
 function same(a,b){return TYPES.every(t=>(a?.[t]??STARTER[t])===(b?.[t]??STARTER[t]))}
 function itemName(id,type){if(id==null)return ({desk:'Standart Masa',plant:'Bitki Yok',shelf:'Kitaplık Yok',window:'Standart Pencere',nur:'Standart NUR'})[type]||'Standart';if(id==='rug_teal')return 'Teal Halı';try{return COLLECTION.items?.().find(x=>x.id===id)?.name||id}catch(e){return id}}
 function summary(s){if(!s?.snapshot)return 'Henüz kaydedilmedi';const x=s.snapshot;const a=[itemName(x.desk,'desk'),itemName(x.rug,'rug'),itemName(x.window,'window')];return a.join(' · ')}
 function timestamp(ms){if(!ms)return 'BOŞ';try{return new Intl.DateTimeFormat('tr-TR',{hour:'2-digit',minute:'2-digit'}).format(new Date(ms))}catch(e){return 'KAYITLI'}}
 function currentSlotId(){const cur=cloneEquipped();for(const s of SLOTS){const x=slot(s.id);if(x?.snapshot&&same(cur,x.snapshot))return s.id}return null}
 function saveSlot(id){const s=slot(id);if(!s)return false;s.snapshot=cloneEquipped();s.updatedAt=Date.now();save();decoratePresets();try{DEEN_SFX?.play?.('snap')}catch(e){};toast?.(s.name+' odası kaydedildi');return true}
 function applySnapshot(snap){const clean=normalizeSnapshot(snap),e=eq();for(const t of TYPES)e[t]=clean[t];save();try{DECOR.apply?.()}catch(e){};try{COLLECTION.apply?.()}catch(e){};try{DECOR.refresh?.()}catch(e){};try{COLLECTION.refresh?.()}catch(e){};return clean}
 function roomFeedback(name){const r=document.getElementById('v750Room');if(!r)return;r.classList.remove('v790-preset-shift');void r.offsetWidth;r.classList.add('v790-preset-shift');setTimeout(()=>r.classList.remove('v790-preset-shift'),700);r.querySelector(':scope > .v790-preset-chip')?.remove();const c=document.createElement('span');c.className='v790-preset-chip';c.textContent=name.toUpperCase()+' PRESETİ';r.append(c);setTimeout(()=>c.remove(),1250)}
 function applySlot(id){const s=slot(id);if(!s?.snapshot){toast?.('Önce bu slota odanı kaydet.');return false}try{PREVIEW?.close?.('preset')}catch(e){};try{ACTIONS?.clear?.()}catch(e){};try{IDLE?.clear?.()}catch(e){};applySnapshot(s.snapshot);roomFeedback(s.name);decoratePresets();try{DEEN_SFX?.play?.('unlock')}catch(e){};toast?.(s.name+' oda düzeni uygulandı');setTimeout(()=>{try{IDLE?.reschedule?.()}catch(e){}},750);return true}
 function cardHtml(m,active){const s=slot(m.id),saved=!!s?.snapshot;return `<div class="v790-preset-card ${saved?'saved':''} ${active===m.id?'active':''}" data-v790-card="${m.id}"><div class="v790-preset-top"><span class="v790-preset-icon">${m.icon}</span><span class="v790-preset-copy"><b>${m.name}</b><small>${active===m.id?'AKTİF':saved?'KAYITLI · '+timestamp(s.updatedAt):'BOŞ SLOT'}</small></span></div><div class="v790-preset-foot">${summary(s)}</div>${saved?`<div class="v790-preset-actions two"><button type="button" class="v790-apply" data-v790-apply="${m.id}">UYGULA</button><button type="button" class="v790-update" data-v790-save="${m.id}">GÜNCELLE</button></div>`:`<div class="v790-preset-actions"><button type="button" class="v790-save" data-v790-save="${m.id}">BU ODAYI KAYDET</button></div>`}</div>`}
 function decoratePresets(){scheduled=false;const tray=document.querySelector('#worldScreenBody .v750-tray');if(!tray||!editing()){tray?.querySelector(':scope > .v790-presets')?.remove();return false}ensure();let box=tray.querySelector(':scope > .v790-presets');const saved=SLOTS.filter(s=>!!slot(s.id)?.snapshot).length,active=currentSlotId(),sig=JSON.stringify({active,eq:cloneEquipped(),slots:SLOTS.map(s=>{const x=slot(s.id);return[x?.updatedAt||0,x?.snapshot||null]})});if(box?.dataset?.v790Sig===sig)return true;const html=`<section class="v790-presets"><div class="v790-presets-head"><div><b>ODA PRESETLERİ</b><small>3 farklı dekor kombinasyonunu kaydet ve tek dokunuşla değiştir.</small></div><span class="v790-presets-count">${saved}/3<br>KAYIT</span></div><div class="v790-preset-grid">${SLOTS.map(s=>cardHtml(s,active)).join('')}</div></section>`;if(box)box.outerHTML=html;else{const anchor=tray.querySelector(':scope > .v788-customizer,:scope > .v787-customizer');if(anchor)anchor.insertAdjacentHTML('beforebegin',html);else tray.insertAdjacentHTML('afterbegin',html)}box=tray.querySelector(':scope > .v790-presets');if(box)box.dataset.v790Sig=sig;return true}
 function schedule(ms=50){if(scheduled)return;scheduled=true;setTimeout(()=>decoratePresets(),ms)}
 document.addEventListener('click',e=>{const saveBtn=e.target.closest?.('[data-v790-save]');if(saveBtn){e.preventDefault();e.stopPropagation();saveSlot(saveBtn.dataset.v790Save);return}const applyBtn=e.target.closest?.('[data-v790-apply]');if(applyBtn){e.preventDefault();e.stopPropagation();applySlot(applyBtn.dataset.v790Apply);return}if(e.target.closest?.('#worldScreenBody [data-v780="edit"],#worldScreenBody .v780-area-select,#worldScreenBody .v780-back-btn,.navbtn[data-screen="worldScreen"]'))schedule(110)},true);
 const obs=new MutationObserver(ms=>{for(const m of ms){if(m.target?.closest?.('.v790-presets'))continue;if(m.type==='childList'&&m.target?.closest?.('#worldScreenBody')){schedule(55);break}}});obs.observe(document.body,{childList:true,subtree:true});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(120)});window.addEventListener('pageshow',()=>schedule(140));
 ensure();save();
 window.DEEN_WORLD_PRESETS={version:VERSION,stateVersion:STATE_VERSION,save:saveSlot,apply:applySlot,refresh:decoratePresets,slots:()=>SLOTS.map(s=>({...slot(s.id),snapshot:slot(s.id)?.snapshot?{...slot(s.id).snapshot}:null})),snapshot:()=>({version:VERSION,editing:editing(),saved:SLOTS.filter(s=>!!slot(s.id)?.snapshot).length,active:currentSlotId(),equipped:cloneEquipped(),visible:!!document.querySelector('#worldScreenBody .v790-presets')})};
 setTimeout(()=>decoratePresets(),850);
})();
