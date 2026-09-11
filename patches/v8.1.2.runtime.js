(()=>{
 if(window.__deenV812Applied)return;window.__deenV812Applied=true;
 const VERSION='8.1.2',STATE_VERSION=71;
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.1.2 — Premium Giyinme Odası';
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const clone=x=>JSON.parse(JSON.stringify(x));
 const CATS={
  head:{label:'Baş',subs:[['headwear','Tür'],['head','Stil']]},
  face:{label:'Yüz',subs:[['face','Yüz'],['eyes','Göz'],['brows','Kaş'],['nose','Burun'],['mouth','Ağız']]},
  outfit:{label:'Kıyafet',subs:[['worldOutfit','Kıyafet']]},
  access:{label:'Aksesuar',subs:[['glasses','Gözlük'],['extra','Ekstra']]},
  color:{label:'Renkler',subs:[['skin','Ten'],['tone','Saç / Başörtüsü']]}
 };
 const S={open:false,cat:'head',sub:'head',initialAvatar:null,initialWorldOutfit:null,previewOutfit:null};
 function studio(){return window.DEEN_AVATAR_STUDIO}
 function world(){return window.DEEN_WORLD}
 function av(){try{return studio()?.state?.()||{}}catch(e){return {}}}
 function ws(){try{return world()?.snapshot?.()||{}}catch(e){return {}}}
 function worldItems(){try{return world()?.items?.()||[]}catch(e){return []}}
 function owned(){return ws().owned||[]}
 function outfitItems(){return worldItems().filter(x=>x.type==='outfit'&&!x.paid)}
 function outfitBy(id){return worldItems().find(x=>x.id===id)}
 function currentOutfit(){return S.previewOutfit||ws().equipped?.outfit||'outfit_teal'}
 function rewardUnlocked(cat,opt){if(!opt?.reward)return true;const arr=state?.myWorld?.avatarOwnedParts||[];return arr.includes(`${cat}:${opt.v}`)}
 function value(cat){const a=av();if(cat==='tone')return a.gender==='male'||a.headwear==='hair'?a.hairColor:a.hijabColor;return a[cat]}
 function options(cat){try{return studio()?.options?.(cat)||[]}catch(e){return []}}
 function allowedSubs(){const a=av();const base=clone(CATS);if(a.gender==='male')base.access.subs.push(['beard','Sakal']);return base[S.cat]?.subs||[]}
 function previewSvg(){
   const st=studio(); if(!st?.renderSvg)return '';
   let svg=st.renderSvg('idle',av());
   const actual=outfitBy(ws().equipped?.outfit||'outfit_teal')||outfitBy('outfit_teal')||{};
   const selected=outfitBy(currentOutfit())||actual;
   if(actual?.color&&selected?.color&&actual.color!==selected.color)svg=svg.split(actual.color).join(selected.color);
   if(actual?.color2&&selected?.color2&&actual.color2!==selected.color2)svg=svg.split(actual.color2).join(selected.color2);
   return svg;
 }
 function optionIcon(o,cat){if(o.color)return `<span class="ico swatch" style="background:${o.color}"></span>`;const glyph=o.i||({headwear:'◒',head:'✦',face:'◯',eyes:'◉',brows:'⌒',nose:'⌁',mouth:'⌣',glasses:'▣',extra:'✧',beard:'≈'}[cat]||'✦');return `<span class="ico">${glyph}</span>`}
 function avatarCards(cat){
   const cur=value(cat);
   return options(cat).map(o=>{const locked=!rewardUnlocked(cat,o),active=cur===o.v;return `<button type="button" class="v812-card ${active?'active':''} ${locked?'locked':''}" data-v812-avatar="${cat}" data-v812-value="${o.v}">${optionIcon(o,cat)}<b>${o.n||o.v}</b><small>${locked?'Sandıktan açılır':active?'Seçili':'Dokun ve dene'}</small></button>`}).join('');
 }
 function outfitCards(){const cur=currentOutfit(), own=owned();return outfitItems().map(o=>{const active=cur===o.id,has=own.includes(o.id)||o.default;return `<button type="button" class="v812-card v812-outfit ${active?'active':''}" data-v812-outfit="${o.id}"><span class="ico" style="--main:${o.color||'#27645c'};--accent:${o.color2||'#2d7367'}"></span><b>${o.name}</b><span class="price">${has?'SAHİPSİN':'🪙 '+o.price}</span></button>`}).join('')}
 function purchaseCost(){const id=currentOutfit(),it=outfitBy(id);return it&&!owned().includes(id)&&!it.default?Number(it.price||0):0}
 function render(){
   const root=$('#v812Wardrobe');if(!root)return;
   $('.v812-avatar',root).innerHTML=previewSvg();
   const a=av();$('.v812-stage-badge',root).textContent=(a.gender==='female'?'KADIN':'ERKEK')+' · CANLI ÖNİZLEME';
   const defs=allowedSubs();if(!defs.some(([k])=>k===S.sub))S.sub=defs[0]?.[0]||'head';
   $('.v812-subtabs',root).innerHTML=defs.map(([k,l])=>`<button type="button" class="v812-subtab ${S.sub===k?'active':''}" data-v812-sub="${k}">${l}</button>`).join('');
   $$('.v812-main-tab',root).forEach(b=>b.classList.toggle('active',b.dataset.v812Cat===S.cat));
   $('.v812-grid',root).innerHTML=S.sub==='worldOutfit'?outfitCards():avatarCards(S.sub);
   const cost=purchaseCost(),it=outfitBy(currentOutfit());
   const foot=$('.v812-footcopy',root),btn=$('.v812-buy-save',root);
   if(cost>0){foot.innerHTML=`<b>${it?.name||'Kıyafet'} seçildi</b><small>Kaydederken satın alınacak · mevcut bakiye ${Number(ws().gold||0)} Altın</small>`;btn.textContent=`🪙 ${cost} · SATIN AL & KAYDET`;btn.disabled=Number(ws().gold||0)<cost}
   else{foot.innerHTML='<b>Görünüm hazır</b><small>Seçimlerin karakterinde ve Dünyam’da kullanılacak.</small>';btn.textContent='KAYDET & ODAYA DÖN';btn.disabled=false}
 }
 function mount(){
   let root=$('#v812Wardrobe');if(root)return root;
   root=document.createElement('div');root.id='v812Wardrobe';
   root.innerHTML=`<div class="v812-head"><button type="button" class="v812-back" data-v812-cancel>‹</button><div class="v812-title"><b>Giyinme Odası</b><small>Karakterini tek ekranda hızlıca düzenle</small></div><button type="button" class="v812-save" data-v812-save>Kaydet</button></div><div class="v812-stage"><div class="v812-stage-badge">CANLI ÖNİZLEME</div><div class="v812-stage-meta"><button class="v812-mini" type="button" data-v812-random>RASTGELE</button></div><div class="v812-avatar"></div></div><div class="v812-main-tabs">${Object.entries(CATS).map(([k,v])=>`<button type="button" class="v812-main-tab ${k===S.cat?'active':''}" data-v812-cat="${k}">${v.label}</button>`).join('')}</div><div class="v812-subtabs"></div><div class="v812-panel"><div class="v812-grid"></div></div><div class="v812-footer"><div class="v812-footcopy"><b>Görünüm hazır</b><small>Seçimlerin karakterinde ve Dünyam’da kullanılacak.</small></div><button type="button" class="v812-buy-save" data-v812-save>KAYDET & ODAYA DÖN</button></div>`;
   document.body.append(root);
   root.addEventListener('click',e=>{
     const cat=e.target.closest('[data-v812-cat]');if(cat){S.cat=cat.dataset.v812Cat;S.sub=allowedSubs()[0]?.[0]||'head';render();return}
     const sub=e.target.closest('[data-v812-sub]');if(sub){S.sub=sub.dataset.v812Sub;render();return}
     const opt=e.target.closest('[data-v812-avatar]');if(opt){const c=opt.dataset.v812Avatar,v=opt.dataset.v812Value;try{studio()?.select?.(c,v)}catch(err){};setTimeout(render,20);return}
     const outfit=e.target.closest('[data-v812-outfit]');if(outfit){S.previewOutfit=outfit.dataset.v812Outfit;render();return}
     if(e.target.closest('[data-v812-random]')){try{studio()?.randomize?.()}catch(err){};setTimeout(render,30);return}
     if(e.target.closest('[data-v812-cancel]')){cancel();return}
     if(e.target.closest('[data-v812-save]')){commit();return}
   });
   return root;
 }
 function open(){
   try{window.DEEN_WARDROBE_UI?.close?.()}catch(e){}
   try{const d=document.getElementById('v5Sheet');if(d?.open)d.close()}catch(e){}
   const root=mount();S.initialAvatar=clone(av());S.initialWorldOutfit=ws().equipped?.outfit||'outfit_teal';S.previewOutfit=S.initialWorldOutfit;S.cat='head';S.sub='head';S.open=true;root.classList.add('open');document.body.style.overflow='hidden';render();
 }
 function restoreAvatar(){if(!S.initialAvatar)return;try{state.myWorld=state.myWorld||{};state.myWorld.avatar=clone(S.initialAvatar);saveState?.();updateUI?.()}catch(e){} }
 function closeOnly(){const root=$('#v812Wardrobe');if(root)root.classList.remove('open');document.body.style.overflow='';S.open=false}
 function cancel(){restoreAvatar();closeOnly();setTimeout(()=>{try{world()?.open?.('world')}catch(e){}},60)}
 function commit(){
   const id=currentOutfit(),it=outfitBy(id),cost=purchaseCost();if(cost>0&&Number(ws().gold||0)<cost)return;
   try{if(cost>0)world()?.buy?.(id);else if(it)world()?.equip?.(id)}catch(e){}
   try{state.myWorld.avatar.created=true;state.myWorld.avatar.libraryVersion='8.1.2';saveState?.();updateUI?.()}catch(e){}
   closeOnly();setTimeout(()=>{try{world()?.open?.('world')}catch(e){}},80)
 }
 document.addEventListener('click',e=>{const b=e.target.closest?.('[data-v810-open-wardrobe]');if(!b)return;setTimeout(open,0)},true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.open){e.preventDefault();cancel()}},true);
 state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);try{saveState?.()}catch(e){}
 window.DEEN_WARDROBE_PRO={version:VERSION,stateVersion:STATE_VERSION,open,cancel,save:commit,render,snapshot:()=>({open:S.open,cat:S.cat,sub:S.sub,previewOutfit:currentOutfit(),avatar:clone(av()),cost:purchaseCost()})};
 setTimeout(()=>{window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.1.2 — Premium Giyinme Odası'},1200);
})();
