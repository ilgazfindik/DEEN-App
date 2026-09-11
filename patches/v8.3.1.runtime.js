(()=>{
 if(window.__deenV831Applied)return;window.__deenV831Applied=true;
 const VERSION='8.3.1',STATE_VERSION=74;
 const PACKS=window.DEEN_AVATAR_ASSET_PACKS||{};
 if(!Array.isArray(PACKS.male)||!Array.isArray(PACKS.female)){console.warn('DEEN v8.3.1 avatar packs missing');return}
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const clone=x=>JSON.parse(JSON.stringify(x));
 const GROUPS={
  male:{face:[['face_shapes','Yüz'],['eyes','Göz'],['eyebrows','Kaş'],['noses','Burun'],['mouths','Ağız']],head:[['hair','Saç'],['headwear','Şapka']],access:[['glasses','Gözlük'],['sunglasses','Güneş Gözlüğü'],['mustaches','Bıyık'],['beards','Sakal']],outfit:[['worldOutfit','Kıyafet']]},
  female:{face:[['eyes','Göz'],['noses','Burun'],['mouths','Ağız'],['blush','Allık']],head:[['hair','Saç'],['hijabs','Başörtüsü'],['bangs','Perçem']],access:[['glasses','Gözlük'],['bows_ribbons','Fiyonk'],['floral_accessories','Çiçek'],['clips','Toka'],['special_accessories','Özel']],outfit:[['worldOutfit','Kıyafet']]}
 };
 const MAIN=[['face','Yüz'],['head','Baş'],['access','Aksesuar'],['outfit','Kıyafet']];
 const OPTIONAL=new Set(['headwear','hijabs','bangs','glasses','sunglasses','mustaches','beards','blush','bows_ribbons','floral_accessories','clips','special_accessories']);
 const LAYERS={male:['base_avatar','face_shapes','hair','headwear','eyebrows','eyes','noses','mouths','mustaches','beards','glasses','sunglasses'],female:['base_avatar','hair','hijabs','bangs','eyes','noses','mouths','blush','glasses','bows_ribbons','floral_accessories','clips','special_accessories']};
 const S={open:false,dirty:false,cat:'face',sub:'eyes',initialAssets:null,initialLegacyGender:null,previewOutfit:null,initialOutfit:null};
 function ww(){try{state.myWorld=state.myWorld&&typeof state.myWorld==='object'?state.myWorld:{};return state.myWorld}catch(e){return {}}}
 function legacy(){const w=ww();w.avatar=w.avatar&&typeof w.avatar==='object'?w.avatar:{};return w.avatar}
 function world(){return window.DEEN_WORLD}
 function pro(){return window.DEEN_WARDROBE_PRO}
 function wSnap(){try{return world()?.snapshot?.()||{}}catch(e){return {}}}
 function items(){try{return world()?.items?.()||[]}catch(e){return []}}
 function outfits(){return items().filter(x=>x.type==='outfit'&&!x.paid)}
 function asset(g,id){return PACKS[g]?.find(x=>x.id===id)||null}
 function list(g,cat){return (PACKS[g]||[]).filter(x=>x.category===cat)}
 function def(g,cat){const a=list(g,cat);return a.find(x=>x.default)?.id||a[0]?.id||null}
 function spriteStyle(x){if(!x)return '';const sx=(x.atlasW/x.w)*100,sy=(x.atlasH/x.h)*100,px=x.atlasW===x.w?0:(x.x/(x.atlasW-x.w))*100,py=x.atlasH===x.h?0:(x.y/(x.atlasH-x.h))*100;return `background-image:url('${x.src}');background-size:${sx}% ${sy}%;background-position:${px}% ${py}%;background-repeat:no-repeat`}
 function spriteDiv(x,cls=''){return x?`<span class="v831-sprite ${cls}" style="${spriteStyle(x)}"></span>`:''}
 function ensure(){
  const w=ww(),g0=legacy()?.gender==='male'?'male':'female';
  let a=w.avatarAssets;
  if(!a||typeof a!=='object')a=w.avatarAssets={version:VERSION,gender:g0,selected:{male:{},female:{}},savedAt:0};
  a.version=VERSION;a.gender=a.gender==='male'?'male':'female';a.selected=a.selected&&typeof a.selected==='object'?a.selected:{male:{},female:{}};
  for(const g of ['male','female']){a.selected[g]=a.selected[g]&&typeof a.selected[g]==='object'?a.selected[g]:{};for(const cat of LAYERS[g]){if(cat==='base_avatar')continue;if(!(cat in a.selected[g]))a.selected[g][cat]=OPTIONAL.has(cat)?null:def(g,cat)}}
  return a;
 }
 function signature(){const a=ensure(),g=a.gender,s=a.selected[g]||{};return g+'|'+LAYERS[g].map(c=>c==='base_avatar'?def(g,c):(s[c]||'-')).join('|')}
 function stackHtml(g=ensure().gender,small=false){const a=ensure(),sel=a.selected[g]||{},imgs=[];for(const cat of LAYERS[g]){let id=cat==='base_avatar'?def(g,cat):sel[cat];if(!id)continue;const x=asset(g,id);if(x)imgs.push(spriteDiv(x,`layer-${cat}`))}return `<div data-v831-real-avatar="1" class="v831-stack${small?' small':''}">${imgs.join('')}</div>`}
 function assetSvg(g=ensure().gender){return stackHtml(g,true)}
 function allowed(){const a=ensure();return GROUPS[a.gender]?.[S.cat]||[]}
 function normalizeSub(){const subs=allowed();if(!subs.some(x=>x[0]===S.sub))S.sub=subs[0]?.[0]||'eyes'}
 function selected(cat){const a=ensure();return a.selected[a.gender]?.[cat]||null}
 function setSelected(cat,id){
  const a=ensure(),g=a.gender,s=a.selected[g];s[cat]=id||null;
  if(g==='female'&&cat==='hair'&&id){s.hijabs=null}
  if(g==='female'&&cat==='hijabs'&&id){s.hair=null;s.bangs=null}
  if(cat==='glasses'&&id)s.sunglasses=null;if(cat==='sunglasses'&&id)s.glasses=null;
  markDirty();render();applyEverywhere();
 }
 function setGender(g){if(g!=='male'&&g!=='female')return;const a=ensure();if(a.gender===g)return;a.gender=g;legacy().gender=g;S.cat='face';S.sub=GROUPS[g].face[0][0];markDirty();render();applyEverywhere()}
 function markDirty(){S.dirty=true;$('#v812Wardrobe')?.classList.add('v831-dirty')}
 function cost(){const id=S.previewOutfit||wSnap().equipped?.outfit;const it=outfits().find(x=>x.id===id);const own=wSnap().owned||[];return it&&!it.default&&!own.includes(id)?Number(it.price||0):0}
 function outfitCards(){const cur=S.previewOutfit||wSnap().equipped?.outfit,own=wSnap().owned||[];return outfits().map(o=>`<button type="button" class="v831-card ${cur===o.id?'active':''}" data-v831-outfit="${o.id}"><span class="v831-thumb"><span class="v831-outfit-thumb" style="--main:${o.color||'#28665d'};--accent:${o.color2||'#327569'}"></span></span><b>${o.name}</b><small class="v831-price">${o.default||own.includes(o.id)?'SAHİPSİN':'🪙 '+Number(o.price||0)}</small></button>`).join('')}
 function assetCards(){const a=ensure(),g=a.gender,cat=S.sub,arr=list(g,cat),cur=selected(cat),none=OPTIONAL.has(cat)?`<button type="button" class="v831-card v831-none ${!cur?'active':''}" data-v831-asset="" data-v831-cat="${cat}"><span class="v831-thumb">∅</span><b>Yok</b><small>Parçayı kaldır</small></button>`:'';return none+arr.map(x=>`<button type="button" class="v831-card ${cur===x.id?'active':''}" data-v831-asset="${x.id}" data-v831-cat="${cat}"><span class="v831-thumb">${spriteDiv(x)}</span><b>${x.name}</b><small>${cur===x.id?'Seçili':'Dokun ve dene'}</small></button>`).join('')}
 function render(){
  const root=$('#v812Wardrobe');if(!root||!root.classList.contains('open'))return;mount();normalizeSub();const a=ensure(),g=a.gender;
  const prev=$('.v831-preview',root);if(prev)prev.innerHTML=stackHtml(g);
  $$('.v831-gender button',root).forEach(b=>b.classList.toggle('active',b.dataset.v831Gender===g));
  $$('.v831-main-tab',root).forEach(b=>b.classList.toggle('active',b.dataset.v831Cat===S.cat));
  const subs=$('.v831-subtabs',root);if(subs)subs.innerHTML=allowed().map(([k,l])=>`<button type="button" class="v831-subtab ${S.sub===k?'active':''}" data-v831-sub="${k}">${l}</button>`).join('');
  const cards=$('.v831-cards',root);if(cards)cards.innerHTML=S.sub==='worldOutfit'?outfitCards():assetCards();
  const label=allowed().find(x=>x[0]===S.sub)?.[1]||'Kıyafet';const h=$('.v831-selector-head b',root);if(h)h.textContent=label+' seçenekleri';
  const c=cost(),gold=Number(wSnap().gold||0),btn=$('.v831-save',root),foot=$('.v831-footcopy',root);
  if(c>0){if(foot)foot.innerHTML=`<b>Seçim hazır</b><small>Kıyafet kaydederken ${c} Altın ile satın alınacak · bakiye ${gold}</small>`;if(btn){btn.textContent=`🪙 ${c} · KAYDET`;btn.disabled=gold<c}}
  else{if(foot)foot.innerHTML='<b>Gerçek avatar assetleri aktif</b><small>Seçimler Dünyam karakterine uygulanacak.</small>';if(btn){btn.textContent='KAYDET & ODAYA DÖN';btn.disabled=false}}
  root.classList.toggle('v831-dirty',S.dirty);
 }
 function bodyHtml(){return `<div class="v831-body"><div class="v831-stage"><div class="v831-gender"><button type="button" data-v831-gender="female">KADIN</button><button type="button" data-v831-gender="male">ERKEK</button></div><button type="button" class="v831-random" data-v831-random>RASTGELE</button><div class="v831-preview"></div><div class="v831-real-badge">GERÇEK PNG ASSET · v8.3.1</div></div><div class="v831-main-tabs">${MAIN.map(([k,l])=>`<button type="button" class="v831-main-tab ${S.cat===k?'active':''}" data-v831-cat="${k}">${l}</button>`).join('')}</div><div class="v831-subtabs"></div><div class="v831-selector"><div class="v831-selector-head"><b>Seçenekler</b><small>Sağa-sola kaydır</small></div><div class="v831-cards"></div></div><div class="v831-footer"><div class="v831-footcopy"><b>Gerçek avatar assetleri aktif</b><small>Seçimler Dünyam karakterine uygulanacak.</small></div><button type="button" class="v831-save" data-v831-save>KAYDET & ODAYA DÖN</button></div></div>`}
 function mount(){
  const root=$('#v812Wardrobe');if(!root)return null;root.classList.add('v831-assets-mode');
  let b=$('.v831-body',root);if(!b){const head=$('.v812-head',root);head?.insertAdjacentHTML('afterend',bodyHtml());b=$('.v831-body',root)}
  const title=$('.v812-title b',root),sub=$('.v812-title small',root);if(title)title.textContent='Giyinme Odası';if(sub)sub.textContent='Gerçek PNG avatar parçaları · canlı önizleme';
  return b
 }
 function randomize(){const a=ensure(),g=a.gender,s=a.selected[g];for(const cat of LAYERS[g]){if(cat==='base_avatar')continue;const arr=list(g,cat);if(!arr.length)continue;if(OPTIONAL.has(cat)&&Math.random()<.58){s[cat]=null;continue}s[cat]=arr[Math.floor(Math.random()*arr.length)].id}if(g==='female'){if(Math.random()<.5){s.hijabs=null;if(!s.hair)s.hair=def(g,'hair')}else{s.hair=null;s.bangs=null;s.hijabs=def(g,'hijabs')}}if(s.glasses)s.sunglasses=null;markDirty();render();applyEverywhere()}
 function commitAssets(){
  const a=ensure(),c=cost(),gold=Number(wSnap().gold||0);if(c>gold)return false;
  const oid=S.previewOutfit||wSnap().equipped?.outfit,it=outfits().find(x=>x.id===oid),own=wSnap().owned||[];
  try{if(it){if(c>0)world()?.buy?.(oid);else if(it.default||own.includes(oid))world()?.equip?.(oid)}}catch(e){console.warn('v8.3.1 outfit save',e)}
  a.version=VERSION;a.savedAt=Date.now();legacy().gender=a.gender;legacy().created=true;legacy().assetRuntime=VERSION;
  try{state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);saveState?.();updateUI?.()}catch(e){}
  S.dirty=false;$('#v812Wardrobe')?.classList.remove('v831-dirty');applyEverywhere();return true
 }
 function restoreAssets(){if(S.initialAssets){ww().avatarAssets=clone(S.initialAssets);legacy().gender=S.initialLegacyGender||ww().avatarAssets.gender}S.dirty=false;applyEverywhere()}
 function patchPro(){
  const p=pro();if(!p||p.__v831)return false;const oldOpen=p.open,oldCancel=p.cancel,oldSave=p.save,oldRender=p.render,oldSnap=p.snapshot;
  p.open=function(...args){S.initialAssets=clone(ensure());S.initialLegacyGender=legacy().gender;S.initialOutfit=wSnap().equipped?.outfit||null;S.previewOutfit=S.initialOutfit;S.dirty=false;S.cat='face';S.sub=GROUPS[ensure().gender].face[0][0];const r=typeof oldOpen==='function'?oldOpen.apply(this,args):undefined;S.open=true;[0,40,140].forEach(ms=>setTimeout(()=>{mount();render();applyEverywhere()},ms));return r};
  p.cancel=function(...args){restoreAssets();S.open=false;const r=typeof oldCancel==='function'?oldCancel.apply(this,args):undefined;setTimeout(applyEverywhere,80);return r};
  p.save=function(...args){if(!commitAssets())return false;S.open=false;const r=typeof oldSave==='function'?oldSave.apply(this,args):undefined;setTimeout(applyEverywhere,100);return r};
  p.render=function(...args){const r=typeof oldRender==='function'?oldRender.apply(this,args):undefined;setTimeout(()=>{mount();render()},0);return r};
  p.snapshot=function(){const b=typeof oldSnap==='function'?oldSnap.call(this):{};return {...(b||{}),assetRuntime:VERSION,assetState:clone(ensure()),assetDirty:S.dirty}};
  p.__v831=true;return true
 }
 function patchFinal(){const f=window.DEEN_WARDROBE_FINAL;if(!f||f.__v831)return;const old=f.snapshot;f.snapshot=function(){const b=typeof old==='function'?old.call(this):{};return {...(b||{}),dirty:!!(b?.dirty||S.dirty),assetRuntime:VERSION}};f.__v831=true}
 function bind(){const root=$('#v812Wardrobe');if(!root||root.__v831Bound)return;root.__v831Bound=true;root.addEventListener('click',e=>{
   const g=e.target.closest('[data-v831-gender]');if(g){setGender(g.dataset.v831Gender);return}
   const card=e.target.closest('[data-v831-asset]');if(card){setSelected(card.dataset.v831Cat,card.dataset.v831Asset||null);return}
   const main=e.target.closest('.v831-main-tab[data-v831-cat]');if(main){S.cat=main.dataset.v831Cat;S.sub=GROUPS[ensure().gender][S.cat]?.[0]?.[0]||'eyes';render();return}
   const sub=e.target.closest('[data-v831-sub]');if(sub){S.sub=sub.dataset.v831Sub;render();return}
   const out=e.target.closest('[data-v831-outfit]');if(out){S.previewOutfit=out.dataset.v831Outfit;markDirty();render();return}
   if(e.target.closest('[data-v831-random]')){randomize();return}
   if(e.target.closest('[data-v831-save]')){pro()?.save?.();return}
  },true);}
 function layerInto(el){if(!el)return;const sig=signature();if(el.dataset.v831Sig===sig&&$('[data-v831-real-avatar]',el))return;el.dataset.v831Sig=sig;el.innerHTML=assetSvg()}
 function applyEverywhere(){
  try{$$('.v740-character,.v742-avatar,.v742-profile-avatar,.v742-league-avatar,#v750Character,.v730-avatar,.v732-reaction-avatar').forEach(layerInto)}catch(e){console.warn('DEEN v8.3.1 apply',e)}
 }
 function openFallback(){if(pro()?.open)return pro().open();return false}
 function patchWorld(){const w=world();if(!w||w.__v831AvatarPatched)return;['render','open','tab'].forEach(k=>{const old=w[k];if(typeof old==='function')w[k]=function(...a){const r=old.apply(this,a);[110,240,430].forEach(ms=>setTimeout(applyEverywhere,ms));return r}});w.__v831AvatarPatched=true}
 function patchGlobalHooks(){
  for(const k of ['updateUI','renderQuestion','completeQuestion']){const fn=window[k];if(typeof fn!=='function'||fn.__v831AvatarPatched)continue;const wrap=function(...a){const r=fn.apply(this,a);[130,260].forEach(ms=>setTimeout(applyEverywhere,ms));return r};wrap.__v831AvatarPatched=true;window[k]=wrap}
 }
 document.addEventListener('click',e=>{const m=e.target.closest?.('.v831-main-tab[data-v831-cat]');if(m&&$('#v812Wardrobe')?.classList.contains('open')){e.preventDefault();S.cat=m.dataset.v831Cat;S.sub=GROUPS[ensure().gender][S.cat]?.[0]?.[0]||'eyes';render();return}const sub=e.target.closest?.('.v831-subtab[data-v831-sub]');if(sub&&$('#v812Wardrobe')?.classList.contains('open')){e.preventDefault();S.sub=sub.dataset.v831Sub;render();}},true);
 ensure();try{state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0)}catch(e){}
 document.addEventListener('click',e=>{if(e.target.closest?.('[data-v810-open-wardrobe]'))setTimeout(()=>{patchPro();patchFinal();patchWorld();patchGlobalHooks();bind();mount();render()},120)},true);
 [0,80,250,700,1400].forEach(ms=>setTimeout(()=>{patchPro();patchFinal();patchWorld();patchGlobalHooks();bind();applyEverywhere()},ms));
 window.DEEN_AVATAR_ASSETS={version:VERSION,stateVersion:STATE_VERSION,open:openFallback,render,apply:applyEverywhere,svg:assetSvg,registry:PACKS,state:()=>clone(ensure()),select:setSelected,setGender,randomize,check:()=>({version:VERSION,maleAssets:PACKS.male.length,femaleAssets:PACKS.female.length,gender:ensure().gender,dirty:S.dirty,wardrobeOpen:!!$('#v812Wardrobe.open'),worldCharacters:$$('#v750Character [data-v831-real-avatar]').length,signature:signature()})};
 const stamp=()=>{window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.3.1 — Gerçek Avatar Asset Runtime'};stamp();[900,2200,4200].forEach(ms=>setTimeout(stamp,ms));
})();
