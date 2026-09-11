(()=>{
 if(window.__deenV813Applied)return;window.__deenV813Applied=true;
 const VERSION='8.1.3',STATE_VERSION=72;
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const ICON={head:'◒',face:'◉',outfit:'▣',access:'◇',color:'●'};
 let dirty=false, zoomed=false, toastTimer=0;
 function root(){return $('#v812Wardrobe')}
 function pro(){return window.DEEN_WARDROBE_PRO}
 function snap(){try{return pro()?.snapshot?.()||{}}catch(e){return {}}}
 function toast(msg){const r=root();if(!r)return;let t=$('.v813-toast',r);if(!t){t=document.createElement('div');t.className='v813-toast';r.append(t)}t.textContent=msg;clearTimeout(toastTimer);requestAnimationFrame(()=>t.classList.add('show'));toastTimer=setTimeout(()=>t.classList.remove('show'),1200)}
 function labelFor(sub){const map={headwear:'Tür',head:'Stil',face:'Yüz',eyes:'Göz',brows:'Kaş',nose:'Burun',mouth:'Ağız',worldOutfit:'Kıyafet',glasses:'Gözlük',extra:'Ekstra',beard:'Sakal',skin:'Ten',tone:'Saç / Başörtüsü'};return map[sub]||'Seçenekler'}
 function selectedName(){const r=root();const a=$('.v812-card.active b',r);return a?.textContent?.trim()||'Seçim yap'}
 function thumbSvg(cat){
   const c='#9fded0',d='#5b8f90',skin='#d8a57f';
   if(cat==='headwear'||cat==='head')return `<span class="v813-thumb"><svg viewBox="0 0 48 48"><path d="M9 31c0-14 6-22 15-22s15 8 15 22c-3 7-8 11-15 11S12 38 9 31Z" fill="none" stroke="${c}" stroke-width="2.5"/><path d="M15 25c2-7 5-10 9-10s7 3 10 10" fill="none" stroke="${d}" stroke-width="2" stroke-linecap="round"/></svg></span>`;
   if(cat==='face')return `<span class="v813-thumb"><svg viewBox="0 0 48 48"><ellipse cx="24" cy="24" rx="14" ry="17" fill="${skin}" opacity=".86"/><circle cx="19" cy="22" r="1.7" fill="${d}"/><circle cx="29" cy="22" r="1.7" fill="${d}"/><path d="M19 30q5 5 10 0" fill="none" stroke="${d}" stroke-width="2" stroke-linecap="round"/></svg></span>`;
   if(cat==='eyes')return `<span class="v813-thumb"><svg viewBox="0 0 48 48"><path d="M10 24q6-7 12 0q-6 7-12 0M26 24q6-7 12 0q-6 7-12 0" fill="none" stroke="${c}" stroke-width="2.4"/><circle cx="16" cy="24" r="2" fill="${c}"/><circle cx="32" cy="24" r="2" fill="${c}"/></svg></span>`;
   if(cat==='brows')return `<span class="v813-thumb"><svg viewBox="0 0 48 48"><path d="M10 22q6-5 12-1M26 21q6-4 12 1" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/></svg></span>`;
   if(cat==='nose')return `<span class="v813-thumb"><svg viewBox="0 0 48 48"><path d="M25 14q-4 13-1 19q3 3 7 0" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/></svg></span>`;
   if(cat==='mouth')return `<span class="v813-thumb"><svg viewBox="0 0 48 48"><path d="M13 23q11 13 22 0" fill="none" stroke="${c}" stroke-width="2.7" stroke-linecap="round"/></svg></span>`;
   if(cat==='glasses')return `<span class="v813-thumb"><svg viewBox="0 0 48 48"><rect x="7" y="17" width="13" height="10" rx="4" fill="none" stroke="${c}" stroke-width="2.2"/><rect x="28" y="17" width="13" height="10" rx="4" fill="none" stroke="${c}" stroke-width="2.2"/><path d="M20 21h8" stroke="${c}" stroke-width="2.2"/></svg></span>`;
   if(cat==='beard')return `<span class="v813-thumb"><svg viewBox="0 0 48 48"><path d="M12 18q1 20 12 22q11-2 12-22q-5 7-12 7t-12-7Z" fill="none" stroke="${c}" stroke-width="2.3"/></svg></span>`;
   return `<span class="v813-thumb"><svg viewBox="0 0 48 48"><path d="M24 8l4 11l11 5l-11 5l-4 11l-4-11l-11-5l11-5Z" fill="none" stroke="${c}" stroke-width="2.2"/></svg></span>`;
 }
 function decorateThumbs(){const r=root();if(!r)return;$$('.v812-card[data-v812-avatar]',r).forEach(card=>{const cat=card.dataset.v812Avatar,ico=$('.ico',card);if(!ico||ico.classList.contains('swatch')||ico.dataset.v813Thumb)return;ico.dataset.v813Thumb='1';ico.innerHTML=thumbSvg(cat)})}
 function ensureChrome(){
   const r=root();if(!r)return;
   const panel=$('.v812-panel',r), grid=$('.v812-grid',r);
   if(panel&&grid&&!$('.v813-tray-head',panel)){
     const h=document.createElement('div');h.className='v813-tray-head';h.innerHTML='<b>Seçenekler</b><small>Sağa kaydır · dokun ve dene</small>';panel.insertBefore(h,grid)
   }
   if(panel&&grid&&!$('.v813-current',panel)){
     const c=document.createElement('div');c.className='v813-current';c.innerHTML='<span>Şu an seçili</span><b>—</b>';panel.insertBefore(c,grid)
   }
   const footer=$('.v812-footer',r);if(footer){const btn=$('.v812-buy-save',footer);if(btn&&!btn.dataset.v813Decorated){btn.dataset.v813Decorated='1';btn.innerHTML='<span class="v813-save-dot"></span>'+btn.textContent}}
 }
 function decorateTabs(){const r=root();if(!r)return;$$('.v812-main-tab',r).forEach(b=>{if(!$('.v813-tab-ico',b)){const key=b.dataset.v812Cat;const i=document.createElement('span');i.className='v813-tab-ico';i.textContent=ICON[key]||'•';b.prepend(i)}})}
 function decorateState(){
   const r=root();if(!r)return;ensureChrome();decorateTabs();decorateThumbs();
   const s=snap();const head=$('.v813-tray-head b',r),cur=$('.v813-current b',r);if(head)head.textContent=labelFor(s.sub);if(cur)cur.textContent=selectedName();
   r.classList.toggle('v813-dirty',dirty);
   const stage=$('.v812-stage',r),z=$('[data-v813-zoom]',r);if(stage)stage.classList.toggle('v813-zoom',zoomed);if(z)z.textContent=zoomed?'−':'＋';
   const save=$('.v812-save',r);if(save)save.textContent=dirty?'Kaydet •':'Kaydet';
   const footer=$('.v812-buy-save',r);if(footer&&!footer.querySelector('.v813-save-dot'))footer.innerHTML='<span class="v813-save-dot"></span>'+footer.textContent;
   const active=$('.v812-card.active',r);if(active){setTimeout(()=>{try{active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})}catch(e){}},30)}
 }
 function markDirty(msg){dirty=true;decorateState();if(msg)toast(msg)}
 function patchPro(){
   const p=pro();if(!p||p.__v813)return;
   const oldOpen=p.open, oldRender=p.render, oldCancel=p.cancel, oldSave=p.save;
   if(typeof oldOpen==='function')p.open=function(...a){dirty=false;zoomed=false;const x=oldOpen.apply(this,a);setTimeout(decorateState,20);setTimeout(decorateState,100);return x};
   if(typeof oldRender==='function')p.render=function(...a){const x=oldRender.apply(this,a);setTimeout(decorateState,0);return x};
   if(typeof oldCancel==='function')p.cancel=function(...a){dirty=false;zoomed=false;return oldCancel.apply(this,a)};
   if(typeof oldSave==='function')p.save=function(...a){dirty=false;zoomed=false;return oldSave.apply(this,a)};
   p.__v813=true;
 }
 document.addEventListener('click',e=>{
   if(e.target.closest?.('[data-v810-open-wardrobe]')){dirty=false;zoomed=false;setTimeout(decorateState,80);return}
   const r=root();if(!r||!r.classList.contains('open'))return;
   if(e.target.closest('[data-v812-cancel],[data-v812-save]')){dirty=false;zoomed=false;setTimeout(decorateState,0);return}
   if(e.target.closest('[data-v812-avatar],[data-v812-outfit]')){setTimeout(()=>markDirty('Önizleme güncellendi'),25);return}
   if(e.target.closest('[data-v812-random]')){setTimeout(()=>markDirty('Yeni bir görünüm denendi'),35);return}
   if(e.target.closest('[data-v812-cat],[data-v812-sub]')){setTimeout(decorateState,20);return}
 },true);
 document.addEventListener('keydown',e=>{if((e.key==='ArrowRight'||e.key==='ArrowLeft')&&root()?.classList.contains('open')){const r=root(),cards=$$('.v812-card',r);if(!cards.length)return;const idx=Math.max(0,cards.findIndex(x=>x.classList.contains('active')));const n=e.key==='ArrowRight'?Math.min(cards.length-1,idx+1):Math.max(0,idx-1);cards[n]?.click()}},true);
 state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);try{saveState?.()}catch(e){}
 patchPro();
 const timer=setInterval(()=>{patchPro();if(root()?.classList.contains('open'))decorateState()},800);
 window.DEEN_WARDROBE_FINAL={version:VERSION,stateVersion:STATE_VERSION,decorate:decorateState,snapshot:()=>{const r=root();return {version:VERSION,dirty,open:!!r?.classList.contains('open'),zoom:false,...snap()}}};
 setTimeout(()=>{patchPro();decorateState();window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.1.3 — Giyinme Odası Final Polish'},900);
})();
