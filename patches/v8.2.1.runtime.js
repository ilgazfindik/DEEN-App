(()=>{
 const VERSION='8.2.1';
 let tries=0;
 function boot(){
 const WORLD=window.DEEN_WORLD, IW=window.DEEN_INTERACTIVE_WORLD;
 if(!WORLD||!IW){if(tries++<80)setTimeout(boot,150);return}
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const MEMORIES=[
  ['U01','İlk Işık Lambası','✦'],['U02','Düzen Pusulası','⌖'],['U03','Ses Halkası','◌'],['U04','Beş Sütun Biblosu','Ⅱ'],['U05','İman Haritası','✧'],
  ['U06','Işık Kristali','◇'],['U07','Vahiy Sayfası','▱'],['U08','Rehberlik İşareti','↗'],['U09','Ufuk Küresi','◒'],['U10','Ölçü Pusulası','⌖'],
  ['U11','Niyet Taşı','◇'],['U12','Berrak Damla','∿'],['U13','Hazırlık Basamağı','⌁'],['U14','Saf Düzeni','≡'],['U15','Ramazan Feneri','◔']
 ];
 const AREA_META={
  study:{visual:'study',tag:'BAŞLANGIÇ',note:'Ders, masa ve günlük etkileşimler için ana alan.',feature:'Odak & çalışma'},
  reading:{visual:'reading',tag:'SAKİN ALAN',note:'Okuma ve sakin oda atmosferi için ikinci köşe.',feature:'Okuma & dinlenme'},
  garden:{visual:'garden',tag:'AÇIK HAVA',note:'Yeşil tonlar ve farklı etkileşim noktalarıyla açık alan.',feature:'Bahçe & nefes'}
 };
 let memoryFilter='all';
 function gold(){try{return Number(WORLD.gold?.())||0}catch(e){return Number(state?.currency)||0}}
 function areas(){try{const a=IW.areas?.()||[];return Array.isArray(a)?a:Object.values(a)}catch(e){return[]}}
 function areaSnap(){try{return IW.snapshot?.()||{}}catch(e){return{}}}
 function worldSnap(){try{return WORLD.snapshot?.()||{}}catch(e){return{}}}
 function visualMarkup(a){const m=AREA_META[a.id]||AREA_META.study;return `<div class="v821-area-visual ${m.visual}"><span class="v821-area-badge">${esc(m.tag)}</span><span class="window"></span><span class="desk"></span><span class="lamp"></span>${a.id==='reading'?'<span class="books"></span>':''}${a.id==='garden'?'<span class="plant"></span>':''}</div>`}
 function areasMarkup(){
   const snap=areaSnap(), unlocked=new Set(snap.unlocked||['study']), cur=snap.currentArea||'study';
   return areas().map(a=>{const open=unlocked.has(a.id), active=cur===a.id, m=AREA_META[a.id]||AREA_META.study, enough=gold()>=(Number(a.price)||0);return `<article class="v821-area-card ${active?'active':''}">${visualMarkup(a)}${!open?`<span class="v821-area-lock">🔒 ${Number(a.price)||0} ALTIN</span>`:''}<div class="v821-area-body"><div class="v821-area-row"><div><b>${esc(a.name)}</b><small>${esc(m.note)}</small></div>${active?'<span class="v821-pill">AKTİF</span>':''}</div><div class="v821-area-meta"><span class="v821-pill">${esc(m.feature)}</span><span class="v821-pill">Kalıcı alan</span>${!open?`<span class="v821-pill gold">🪙 ${Number(a.price)||0}</span>`:''}</div>${active?'<button class="v821-area-action secondary" type="button" disabled>Şu an bu alandasın</button>':open?`<button class="v821-area-action" type="button" data-v821-area-use="${esc(a.id)}">Bu Alana Geç</button>`:`<button class="v821-area-action" type="button" data-v821-area-unlock="${esc(a.id)}" ${enough?'':'disabled'}>${enough?`🪙 ${Number(a.price)||0} · ALANI AÇ`:'Yetersiz Altın'}</button>`}</div></article>`}).join('');
 }
 function memoryStatus(unit){try{return WORLD.chestStatus?.(unit,'end')||{ready:false,claimed:false}}catch(e){return{ready:false,claimed:false}}}
 function memoryRows(){
   const ws=worldSnap(), equipped=ws.equipped?.collectible||'';
   return MEMORIES.map((m,i)=>{const st=memoryStatus(m[0]);return{unit:m[0],name:m[1],glyph:m[2],n:i+1,claimed:!!st.claimed,ready:!!st.ready,equipped:equipped===m[0]}});
 }
 function filteredMemories(){const rows=memoryRows();if(memoryFilter==='owned')return rows.filter(x=>x.claimed);if(memoryFilter==='ready')return rows.filter(x=>x.ready&&!x.claimed);if(memoryFilter==='locked')return rows.filter(x=>!x.claimed&&!x.ready);return rows}
 function memoryCard(x){let cls=x.equipped?'equipped owned':x.claimed?'owned':x.ready?'ready':'locked';let stateText=x.equipped?'ODADA KULLANILIYOR':x.claimed?'KOLEKSİYONDA':x.ready?'SANDIK HAZIR':'KİLİTLİ';let action=x.equipped?'<button class="v821-memory-action" disabled>Aktif Hatıra</button>':x.claimed?`<button class="v821-memory-action" type="button" data-v821-equip="${x.unit}">Odada Kullan</button>`:x.ready?`<button class="v821-memory-action" type="button" data-v821-claim="${x.unit}">Büyük Sandığı Aç</button>`:'<button class="v821-memory-action" disabled>Üniteyi Tamamla</button>';return `<article class="v821-memory-card ${cls}"><span class="v821-memory-num">${String(x.n).padStart(2,'0')}</span><div class="v821-memory-icon">${x.claimed?x.glyph:'◇'}</div><b>${esc(x.name)}</b><small>${x.claimed?'Bu ünite hatırası koleksiyonuna eklendi.':x.ready?'Ünite tamamlandı; büyük sandık açılmayı bekliyor.':'Büyük sandık için ünitenin ana aşamalarını tamamla.'}</small><span class="v821-memory-state">${stateText}</span>${action}</article>`}
 function renderAreas(){const root=$('#v821AreasOverlay');if(!root)return;const snap=areaSnap(), unlocked=(snap.unlocked||['study']).length;$('.v821-wallet',root).innerHTML=`🪙 ${gold()} Altın`;$('.v821-area-summary .count',root).textContent=unlocked+'/'+areas().length;$('.v821-area-list',root).innerHTML=areasMarkup()}
 function renderMemories(){const root=$('#v821MemoriesOverlay');if(!root)return;const rows=memoryRows(), owned=rows.filter(x=>x.claimed).length, ready=rows.filter(x=>x.ready&&!x.claimed).length;$('.v821-progress-row strong',root).textContent=owned+'/'+rows.length;$('.v821-progress-bar i',root).style.width=(rows.length?owned/rows.length*100:0)+'%';$('.v821-progress-card small',root).textContent=ready?`${ready} büyük sandık açılmaya hazır.`:'Hatıralar büyük sandıklardan açılır.';$$('.v821-filter',root).forEach(b=>b.classList.toggle('active',b.dataset.filter===memoryFilter));$('.v821-memory-grid',root).innerHTML=filteredMemories().map(memoryCard).join('')||'<div class="v821-note" style="grid-column:1/-1">Bu filtrede henüz hatıra yok.</div>'}
 function mount(){
   if(!$('#v821AreasOverlay')){const d=document.createElement('div');d.id='v821AreasOverlay';d.innerHTML=`<section class="v821-sheet"><header class="v821-head"><button class="v821-back" type="button" data-close>Geri</button><div class="v821-headcopy"><small>DÜNYAM</small><b>Alanlar</b><span>Köşeni seç veya yeni bir alan aç.</span></div><span class="v821-wallet">🪙 0 Altın</span></header><div class="v821-scroll"><div class="v821-area-summary"><div><b>Dünya Alanların</b><small>Açtığın alanlar kalıcıdır ve yalnızca Dünyam kişiselleştirmesini değiştirir.</small></div><span class="count">1/3</span></div><div class="v821-area-list"></div><div class="v821-note">Alan satın almak enerji, ders avantajı veya dinî ilerleme sağlamaz; yalnızca Dünyam görünümünü genişletir.</div></div></section>`;document.body.append(d)}
   if(!$('#v821MemoriesOverlay')){const d=document.createElement('div');d.id='v821MemoriesOverlay';d.innerHTML=`<section class="v821-sheet"><header class="v821-head"><button class="v821-back" type="button" data-close>Geri</button><div class="v821-headcopy"><small>KOLEKSİYON</small><b>Ünite Hatıraları</b><span>Tamamladığın ünitelerden kalan kozmetik hatıralar.</span></div></header><div class="v821-scroll"><div class="v821-progress-card"><div class="v821-progress-row"><div><b>Koleksiyon İlerlemesi</b><small>Hatıralar büyük sandıklardan açılır.</small></div><strong>0/15</strong></div><div class="v821-progress-bar"><i style="width:0%"></i></div></div><div class="v821-filterbar"><button class="v821-filter active" data-filter="all">Tümü</button><button class="v821-filter" data-filter="owned">Açılan</button><button class="v821-filter" data-filter="ready">Hazır</button><button class="v821-filter" data-filter="locked">Kilitli</button></div><div class="v821-memory-grid"></div><div class="v821-note">Ünite Hatıraları yalnızca kozmetik koleksiyondur. Dinî yeterlilik, ibadet veya maneviyat ölçüsü değildir.</div></div></section>`;document.body.append(d)}
 }
 function closeAll(){['v821AreasOverlay','v821MemoriesOverlay'].forEach(id=>document.getElementById(id)?.classList.remove('open'));document.body.style.overflow=''}
 function openAreas(){mount();closeAll();renderAreas();$('#v821AreasOverlay').classList.add('open');document.body.style.overflow='hidden'}
 function openMemories(){mount();closeAll();memoryFilter='all';renderMemories();$('#v821MemoriesOverlay').classList.add('open');document.body.style.overflow='hidden'}
 function refreshWorld(){setTimeout(()=>{try{WORLD.open?.('world')}catch(e){};setTimeout(decorateMain,180)},90)}
 function useArea(id){try{IW.area?.(id)}catch(e){};closeAll();refreshWorld()}
 function unlockArea(id){let ok=false;try{ok=!!IW.unlockNow?.(id)}catch(e){};if(ok){closeAll();refreshWorld()}else renderAreas()}
 function equipMemory(unit){try{WORLD.equipCollectible?.(unit)}catch(e){};setTimeout(()=>{renderMemories();decorateMain()},100)}
 function claimMemory(unit){let ok=false;try{ok=!!WORLD.claimPathChest?.(unit,'end')}catch(e){};setTimeout(()=>{renderMemories();decorateMain()},120);return ok}
 function decorateMain(){const root=$('#worldScreenBody .v810-shell');if(!root)return;const head=$('.v810-collection-head',root);if(head&&!$('.v821-memory-more',head)){const b=document.createElement('button');b.className='v821-memory-more';b.type='button';b.dataset.v821OpenMemories='1';b.textContent='Tümünü Gör';head.append(b)}const menu=$('[data-v810-menu]',root);if(menu&&!$('[data-v821-open-memories]',menu)){const b=document.createElement('button');b.type='button';b.dataset.v821OpenMemories='1';b.textContent='Koleksiyon';menu.append(b)}}
 mount();
 document.addEventListener('click',e=>{
   const t=e.target;
   if(t.closest?.('#v821AreasOverlay [data-close],#v821MemoriesOverlay [data-close]')){closeAll();return}
   const use=t.closest?.('[data-v821-area-use]');if(use){useArea(use.dataset.v821AreaUse);return}
   const unlock=t.closest?.('[data-v821-area-unlock]');if(unlock){unlockArea(unlock.dataset.v821AreaUnlock);return}
   const filter=t.closest?.('#v821MemoriesOverlay [data-filter]');if(filter){memoryFilter=filter.dataset.filter;renderMemories();return}
   const eq=t.closest?.('[data-v821-equip]');if(eq){equipMemory(eq.dataset.v821Equip);return}
   const cl=t.closest?.('[data-v821-claim]');if(cl){claimMemory(cl.dataset.v821Claim);return}
 },true);
 document.addEventListener('click',e=>{
   const a=e.target.closest?.('[data-v810-area-open]');if(a){e.preventDefault();e.stopImmediatePropagation();openAreas();return}
   const m=e.target.closest?.('[data-v821-open-memories]');if(m){e.preventDefault();e.stopImmediatePropagation();openMemories();return}
 },true);
 ['v821AreasOverlay','v821MemoriesOverlay'].forEach(id=>document.getElementById(id)?.addEventListener('click',e=>{if(e.target.id===id)closeAll()}));
 const observer=new MutationObserver(()=>decorateMain());observer.observe(document.documentElement,{subtree:true,childList:true});
 setTimeout(decorateMain,500);setTimeout(decorateMain,1200);
 window.DEEN_WORLD_AREAS_UI={version:VERSION,open:openAreas,close:closeAll,render:renderAreas,snapshot:()=>({current:areaSnap().currentArea,unlocked:[...(areaSnap().unlocked||[])],gold:gold(),areas:areas().length})};
 window.DEEN_WORLD_MEMORIES_UI={version:VERSION,open:openMemories,close:closeAll,render:renderMemories,snapshot:()=>{const r=memoryRows();return{owned:r.filter(x=>x.claimed).length,ready:r.filter(x=>x.ready&&!x.claimed).length,equipped:r.find(x=>x.equipped)?.unit||null,total:r.length}}};
}
 boot();
})();
