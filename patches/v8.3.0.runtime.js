(()=>{
 if(window.__deenV830Applied)return;window.__deenV830Applied=true;
 const VERSION='8.3.0',STATE_VERSION=73;
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const MODS=[
  ['wardrobe','Giyinme','◒','#v812Wardrobe'],
  ['room','Oda','▣','#v820RoomOverlay'],
  ['shop','Mağaza','◇','#v820ShopOverlay'],
  ['areas','Alanlar','⌂','#v821AreasOverlay'],
  ['memories','Hatıralar','✦','#v821MemoriesOverlay']
 ];
 let requested=null,lastModule=null,reconciling=false,observer=null;
 const overlayFor=n=>MODS.find(x=>x[0]===n)?.[3]||'';
 let v820Retrying=false,v820Retries=0;
 function ensureRoomShop(){
   if(window.DEEN_WORLD_ROOM_UI?.open&&window.DEEN_WORLD_SHOP_UI?.open)return true;
   if(v820Retrying||v820Retries>=3)return false;
   if(!window.DEEN_WORLD||!window.DEEN_WORLD_COLLECTION||!window.DEEN_WORLD_DECOR)return false;
   v820Retrying=true;v820Retries++;
   try{
     window.__deenV820Applied=false;
     const inline=document.querySelector('script[data-deen-v820-inline]');
     if(inline?.textContent?.trim()){new Function(inline.textContent)();v820Retrying=false;return !!window.DEEN_WORLD_ROOM_UI?.open}
     const old=document.querySelector('script[data-deen-v820-runtime]');
     if(old?.src){const sc=document.createElement('script');sc.dataset.deenV820Retry='830';sc.src=old.src+(old.src.includes('?')?'&':'?')+'retry=830-'+v820Retries;sc.onload=()=>{v820Retrying=false;decorate();reconcile()};sc.onerror=()=>{v820Retrying=false};document.head.append(sc);return false}
   }catch(e){console.warn('DEEN v8.3.0 v8.2.0 recovery',e)}
   v820Retrying=false;return false;
 }
 const elFor=n=>$(overlayFor(n));
 function isOpen(n){return !!elFor(n)?.classList.contains('open')}
 function openNames(){return MODS.filter(x=>isOpen(x[0])).map(x=>x[0])}
 function api(n){
   if(n==='wardrobe')return window.DEEN_WARDROBE_PRO;
   if(n==='room')return window.DEEN_WORLD_ROOM_UI;
   if(n==='shop')return window.DEEN_WORLD_SHOP_UI;
   if(n==='areas')return window.DEEN_WORLD_AREAS_UI;
   if(n==='memories')return window.DEEN_WORLD_MEMORIES_UI;
 }
 function dirtyWardrobe(){try{return !!window.DEEN_WARDROBE_FINAL?.snapshot?.().dirty}catch(e){return false}}
 function setBodyLock(){const any=openNames().length>0||$('#v830Unsaved.open');document.body.classList.toggle('v830-module-open',any);document.body.style.overflow=any?'hidden':''}
 function scrollWorldTop(){const b=$('#worldScreenBody');if(b){try{b.scrollTo({top:0,left:0,behavior:'auto'})}catch(e){b.scrollTop=0}b.scrollTop=0}try{window.scrollTo(0,0)}catch(e){}}
 function hardClose(n){
   const e=elFor(n);if(!e)return;
   if(n==='room'){try{api(n)?.close?.(false)}catch(_){e.classList.remove('open')}}
   else if(n==='shop'){try{api(n)?.close?.(false)}catch(_){e.classList.remove('open')}}
   else if(n==='areas'||n==='memories'){try{api(n)?.close?.()}catch(_){e.classList.remove('open')}}
   else if(n==='wardrobe'){e.classList.remove('open')}
 }
 function closeOthers(keep){MODS.forEach(([n])=>{if(n!==keep&&isOpen(n))hardClose(n)})}
 function rawOpen(n){
   if((n==='room'||n==='shop')&&!api(n)?.open){ensureRoomShop();if(!api(n)?.open){setTimeout(()=>rawOpen(n),180);return true}}
   const a=api(n);if(!a?.open)return false;
   requested=n;closeOthers(n);
   try{a.open()}catch(e){console.warn('DEEN v8.3.0 open',n,e);return false}
   setTimeout(()=>{requested=null;lastModule=n;decorate();reconcile()},30);return true
 }
 function ensureUnsaved(){
   let d=$('#v830Unsaved');if(d)return d;
   d=document.createElement('div');d.id='v830Unsaved';d.className='v830-unsaved';d.innerHTML=`<div class="v830-unsaved-card" role="dialog" aria-modal="true" aria-labelledby="v830UnsavedTitle"><div class="mark">◇</div><h3 id="v830UnsavedTitle">Görünüm değişiklikleri kaydedilsin mi?</h3><p>Giyinme Odası'nda henüz kaydetmediğin seçimler var. Başka bir Dünyam bölümüne geçmeden önce karar ver.</p><div class="v830-unsaved-actions"><button type="button" data-v830-stay>Kal</button><button type="button" class="discard" data-v830-discard>Vazgeç ve Geç</button><button type="button" class="save" data-v830-save>Kaydet ve Geç</button></div></div>`;document.body.append(d);return d
 }
 function askWardrobe(target){
   const d=ensureUnsaved();d.dataset.target=target;d.classList.add('open');setBodyLock();setTimeout(()=>$('[data-v830-save]',d)?.focus?.(),20)
 }
 function open(n){
   if(!MODS.some(x=>x[0]===n))return false;
   const cur=current();if(cur===n){decorate();return true}
   if(cur==='wardrobe'&&dirtyWardrobe()){askWardrobe(n);return true}
   if(cur==='wardrobe'){
     try{window.DEEN_WARDROBE_PRO?.cancel?.()}catch(e){hardClose('wardrobe')}
     setTimeout(()=>rawOpen(n),100);return true
   }
   return rawOpen(n)
 }
 function closeCurrent(){
   const cur=current();if(!cur){setBodyLock();return false}
   if(cur==='wardrobe'){try{window.DEEN_WARDROBE_PRO?.cancel?.()}catch(e){hardClose(cur)}}else hardClose(cur);
   setTimeout(()=>{reconcile();scrollWorldTop()},110);return true
 }
 function current(){const names=openNames();if(requested&&names.includes(requested))return requested;return names[names.length-1]||null}
 function hubHtml(active){return `<nav class="v830-hubbar" aria-label="Dünyam bölümleri">${MODS.map(([id,label,ico])=>`<button type="button" data-v830-open="${id}" class="${id===active?'active':''}" aria-current="${id===active?'page':'false'}"><span class="ico">${ico}</span>${label}</button>`).join('')}</nav>`}
 function decorateOverlay(n){
   const root=elFor(n);if(!root)return;
   let head=null;if(n==='wardrobe')head=$('.v812-head',root);else if(n==='room'||n==='shop')head=$('.v820-head',root);else head=$('.v821-head',root);
   if(!head)return;
   let bar=$('.v830-hubbar',root);if(!bar){head.insertAdjacentHTML('afterend',hubHtml(n));bar=$('.v830-hubbar',root)}
   $$('.v830-hubbar button',root).forEach(b=>{const on=b.dataset.v830Open===n;b.classList.toggle('active',on);b.setAttribute('aria-current',on?'page':'false')});
 }
 function decorateMain(){
   const root=$('#worldScreenBody .v810-shell');if(!root)return;
   const menu=$('[data-v810-menu]',root);if(menu){
     const order=['[data-v810-open-wardrobe]','[data-v810-toggle-edit]','[data-v810-open-shop]','[data-v810-area-open]','[data-v821-open-memories]','[data-v810-open-avatar]'];
     order.forEach(sel=>{const b=$(sel,menu);if(b)menu.append(b)});
   }
   const kicker=$('.v810-head .kicker',root);if(kicker&&!$('.v830-version',kicker.parentElement)){kicker.insertAdjacentHTML('afterend','<span class="v830-version">v8.3 · DÜNYAM</span>')}
 }
 function decorate(){MODS.forEach(([n])=>decorateOverlay(n));decorateMain();setBodyLock()}
 function reconcile(){
   if(reconciling)return;reconciling=true;
   try{
     const names=openNames();
     if(names.length>1){const keep=requested&&names.includes(requested)?requested:(lastModule&&names.includes(lastModule)?lastModule:names[names.length-1]);names.forEach(n=>{if(n!==keep)hardClose(n)});lastModule=keep}
     const cur=current();if(cur)lastModule=cur;decorate();
     if(!openNames().length&&!$('#v830Unsaved.open')){setBodyLock()}
   }finally{reconciling=false}
 }
 function horizontalOverflow(){
   const cur=current(),root=cur?elFor(cur):$('#worldScreenBody .v810-shell');if(!root)return 0;const target=$('.v812-body,.v820-scroll,.v821-scroll,.v810-shell',root)||root;return Math.max(0,Math.round((target.scrollWidth||0)-(target.clientWidth||0)))
 }
 function duplicateIds(){const ids=new Map(),dups=[];$$('[id]').forEach(e=>{const n=(ids.get(e.id)||0)+1;ids.set(e.id,n);if(n===2)dups.push(e.id)});return dups}
 function check(){
   const names=openNames();return {version:VERSION,apis:{wardrobe:!!api('wardrobe')?.open,room:!!api('room')?.open,shop:!!api('shop')?.open,areas:!!api('areas')?.open,memories:!!api('memories')?.open},mainShell:$$('#worldScreenBody .v810-shell').length,openOverlays:names,openCount:names.length,duplicateIds:duplicateIds(),horizontalOverflow:horizontalOverflow(),bodyLocked:document.body.style.overflow==='hidden',hubBars:$$('.v830-hubbar').length,dirtyWardrobe:dirtyWardrobe()}
 }
 function recover(){closeOthers(null);$('#v830Unsaved')?.classList.remove('open');setBodyLock();scrollWorldTop();decorate();return check()}
 document.addEventListener('click',e=>{
   const b=e.target.closest?.('[data-v830-open]');if(b){e.preventDefault();e.stopPropagation();open(b.dataset.v830Open);return}
   const d=$('#v830Unsaved');if(!d?.classList.contains('open'))return;
   if(e.target===d||e.target.closest?.('[data-v830-stay]')){d.classList.remove('open');setBodyLock();return}
   const target=d.dataset.target;
   if(e.target.closest?.('[data-v830-discard]')){d.classList.remove('open');try{window.DEEN_WARDROBE_PRO?.cancel?.()}catch(_){};setTimeout(()=>rawOpen(target),120);return}
   if(e.target.closest?.('[data-v830-save]')){d.classList.remove('open');try{window.DEEN_WARDROBE_PRO?.save?.()}catch(_){};setTimeout(()=>{if(isOpen('wardrobe')){setBodyLock();return}rawOpen(target)},150);return}
 },true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#v830Unsaved.open')){e.preventDefault();e.stopImmediatePropagation();$('#v830Unsaved').classList.remove('open');setBodyLock()}},true);
 document.addEventListener('click',e=>{if(e.target.closest?.('.navbtn[data-screen="worldScreen"]'))setTimeout(()=>{scrollWorldTop();decorateMain()},180)},true);
 observer=new MutationObserver(()=>{clearTimeout(observer._t);observer._t=setTimeout(reconcile,18)});observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
 try{state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);saveState?.()}catch(e){}
 window.DEEN_WORLD_HUB={version:VERSION,stateVersion:STATE_VERSION,open,close:closeCurrent,current,decorate,recover,check,snapshot:()=>({version:VERSION,current:current(),open:openNames(),lastModule,gold:window.DEEN_WORLD?.gold?.(),area:window.DEEN_INTERACTIVE_WORLD?.snapshot?.().currentArea||null})};
 [40,180,600].forEach(ms=>setTimeout(ensureRoomShop,ms));
 [80,320,900,1600].forEach(ms=>setTimeout(()=>{ensureRoomShop();decorate();reconcile()},ms));
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.3.0 — Dünyam Final Polish';
})();
