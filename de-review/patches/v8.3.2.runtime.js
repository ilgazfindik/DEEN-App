(()=>{
 if(window.__deenV832Applied)return;window.__deenV832Applied=true;
 const VERSION='8.3.2',STATE_VERSION=75;
 const A=window.DEEN_VISUAL_ASSETS||{};
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 if(!Array.isArray(A.room)||!Array.isArray(A.maleOutfits)||!Array.isArray(A.femaleOutfits)){console.warn('DEEN v8.3.2 visual registry missing');return}
 const COL=()=>window.DEEN_WORLD_COLLECTION;
 const WORLD=()=>window.DEEN_WORLD;
 const avState=()=>{try{return window.DEEN_AVATAR_ASSETS?.state?.()||{gender:state?.myWorld?.avatar?.gender||'female'}}catch(e){return {gender:'female'}}};
 const colItems=()=>{try{return COL()?.items?.()||[]}catch(e){return[]}};
 const colSnap=()=>{try{return COL()?.snapshot?.()||{}}catch(e){return{}};
 function spriteStyle(x){if(!x)return '';const sx=(x.atlasW/x.w)*100,sy=(x.atlasH/x.h)*100,px=x.atlasW===x.w?0:(x.x/(x.atlasW-x.w))*100,py=x.atlasH===x.h?0:(x.y/(x.atlasH-x.h))*100;return `background-image:url('${x.src}');background-size:${sx}% ${sy}%;background-position:${px}% ${py}%;background-repeat:no-repeat`}
 function sprite(x,cls=''){return x?`<span class="v832-sprite ${cls}" style="${spriteStyle(x)}"></span>`:''}
 function roomCat(cat){return A.room.filter(x=>x.category===cat)}
 const roomGroups={desk:'desks_tables',rug:'rugs',plant:'plants',shelf:'storage_furniture',window:'windows',nur:'lighting'};
 function itemIndex(type,id){const arr=colItems().filter(x=>x.type===type&&!x.paid&&!x.default);if(!id)return 0;const n=arr.findIndex(x=>x.id===id);return n<0?0:n+1}
 function roomAsset(type,id){const cat=roomGroups[type];const arr=roomCat(cat);if(!arr.length)return null;let idx=itemIndex(type,id);if(type==='nur')idx=(idx+8)%arr.length;return arr[idx%arr.length]}
 function currentEq(){return colSnap().equipped||state?.myWorld?.equipped||{}}
 function currentArea(){try{return window.DEEN_INTERACTIVE_WORLD?.snapshot?.().currentArea||'study'}catch(e){return 'study'}}
 function areaAsset(cat){const arr=roomCat(cat);if(!arr.length)return null;const area=currentArea();const idx=area==='reading'?Math.min(3,arr.length-1):area==='garden'?Math.min(5,arr.length-1):0;return arr[idx]||arr[0]}
 function roomSig(){const e=currentEq();return [currentArea(),e.desk,e.rug,e.plant,e.shelf,e.window,e.nur].join('|')}
 function roomLayerHtml(){const e=currentEq();return `<div class="v832-real-room" data-v832-sig="${roomSig()}">
   ${sprite(areaAsset('walls_backdrops'),'wall')}${sprite(areaAsset('floors'),'floor')}
   ${sprite(roomAsset('window',e.window),'window')}${sprite(roomAsset('shelf',e.shelf),'shelf')}
   ${sprite(roomAsset('rug',e.rug),'rug')}${sprite(roomAsset('desk',e.desk),'desk')}
   ${sprite(roomAsset('plant',e.plant),'plant')}${sprite(roomAsset('nur',e.nur),'nur')}
 </div>`}
 function ensureRoomVisual(root){if(!root)return false;const sig=roomSig();let layer=$(':scope > .v832-real-room',root);if(layer?.dataset.v832Sig===sig)return false;layer?.remove();root.insertAdjacentHTML('afterbegin',roomLayerHtml());return true}
 function applyRooms(){
   ensureRoomVisual($('#v750Room'));
   $$('.v820-room-preview .v750-room').forEach(ensureRoomVisual);
 }
 function decorateRoomCards(){
   $$('.v820-decor').forEach(card=>{const type=card.dataset.type,id=card.dataset.id||null,thumb=$('.v820-decor-thumb',card);if(!thumb)return;const x=roomAsset(type,id);if(!x)return;const sig=x.id;if(thumb.dataset.v832Sprite===sig)return;thumb.dataset.v832Sprite=sig;thumb.classList.add('v832-real-thumb');thumb.innerHTML=sprite(x) });
   $$('.v820-shop-card').forEach(card=>{const btn=$('[data-v820-shop-preview],[data-v820-shop-use],[data-v820-shop-buy]',card);const id=btn?.dataset.v820ShopPreview||btn?.dataset.v820ShopUse||btn?.dataset.v820ShopBuy||null;const type=$('.v820-decor-thumb',card)?.className?.match(/\b(desk|rug|plant|shelf|window|nur)\b/)?.[1];const thumb=$('.v820-decor-thumb',card);if(!thumb||!type)return;const x=roomAsset(type,id);if(!x)return;if(thumb.dataset.v832Sprite===x.id)return;thumb.dataset.v832Sprite=x.id;thumb.classList.add('v832-real-thumb');thumb.innerHTML=sprite(x)});
 }
 function outfitPack(g){return g==='male'?A.maleOutfits:A.femaleOutfits}
 function outfitForIndex(g,i){const arr=outfitPack(g);return arr.length?arr[i%arr.length]:null}
 function decorateOutfits(){
   const root=$('#v812Wardrobe');if(!root||!root.classList.contains('open'))return;
   const g=avState().gender==='male'?'male':'female';const cards=$$('[data-v831-outfit]',root);
   cards.forEach((card,i)=>{const x=outfitForIndex(g,i);if(!x)return;const t=$('.v831-thumb',card);if(!t)return;if(t.dataset.v832Outfit===x.id)return;t.dataset.v832Outfit=x.id;t.classList.add('v832-outfit-thumb');t.innerHTML=sprite(x)});
   const active=cards.find(x=>x.classList.contains('active'))||cards[0];const idx=Math.max(0,cards.indexOf(active));const x=outfitForIndex(g,idx);let side=$('.v832-outfit-preview',root);
   if(x){if(!side){const stage=$('.v831-stage',root);if(stage){side=document.createElement('div');side.className='v832-outfit-preview';stage.append(side)}}if(side&&side.dataset.asset!==x.id){side.dataset.asset=x.id;side.innerHTML=sprite(x)+'<small>KIYAFET</small>'}}
 }
 function decorateMainRoomMenu(){
   const main=$('#worldScreenBody .v810-shell');if(!main)return;const room=$('.v810-room-shell',main);if(room&&!$('.v832-visual-badge',room)){room.insertAdjacentHTML('afterbegin','<span class="v832-visual-badge">GERÇEK ODA ASSETLERİ</span>')}
 }
 let queued=false;
 function refresh(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;try{applyRooms();decorateRoomCards();decorateOutfits();decorateMainRoomMenu()}catch(e){console.warn('DEEN v8.3.2 refresh',e)}})}
 function patchApis(){
   const w=WORLD();if(w&&!w.__v832Visual){['render','open','tab','buy','equip'].forEach(k=>{const old=w[k];if(typeof old==='function')w[k]=function(...a){const r=old.apply(this,a);[30,120,300].forEach(ms=>setTimeout(refresh,ms));return r}});w.__v832Visual=true}
   const c=COL();if(c&&!c.__v832Visual){['equip','buy'].forEach(k=>{const old=c[k];if(typeof old==='function')c[k]=function(...a){const r=old.apply(this,a);[20,100,260].forEach(ms=>setTimeout(refresh,ms));return r}});c.__v832Visual=true}
 }
 const obs=new MutationObserver(()=>{clearTimeout(obs._t);obs._t=setTimeout(refresh,24)});obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
 document.addEventListener('click',e=>{if(e.target.closest?.('[data-v831-outfit],[data-v820-equip],[data-v820-buy],[data-v820-shop-use],[data-v820-shop-buy],[data-v810-toggle-edit],[data-v810-open-shop]'))setTimeout(refresh,45)},true);
 try{state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);saveState?.()}catch(e){}
 [0,120,420,1000,2200].forEach(ms=>setTimeout(()=>{patchApis();refresh()},ms));
 window.DEEN_REAL_VISUALS={version:VERSION,stateVersion:STATE_VERSION,refresh,registry:A,check:()=>({version:VERSION,roomAssets:A.room.length,maleOutfits:A.maleOutfits.length,femaleOutfits:A.femaleOutfits.length,roomLayer:!!$('#v750Room>.v832-real-room'),roomSig:roomSig(),wardrobeOutfitCards:$$('#v812Wardrobe [data-v831-outfit] .v832-sprite').length,roomCardThumbs:$$('.v820-decor-thumb.v832-real-thumb,.v820-shop-card .v832-real-thumb').length})};
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.3.2 — Gerçek Kıyafet & Oda Assetleri';
})();
