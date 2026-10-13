(()=>{
 if(window.__deenV832HF2ECloset)return; window.__deenV832HF2ECloset=true;
 const VERSION='8.3.2-HF2E',REV='832hf2e6';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const $$=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
 const delay=ms=>new Promise(r=>setTimeout(r,ms));
 const CFG={
  male:{count:12,cell:96,aw:576,ah:192,file:'male_atlas.b64'},
  female:{count:11,cell:80,aw:480,ah:160,file:'female_atlas.b64'}
 };
 const LEGACY=['outfit_teal','outfit_lavender','outfit_navy','outfit_cream'];
 const URLS={male:'',female:''},INFO={male:null,female:null};
 let preview={male:null,female:null},initial={male:null,female:null},patched=false;
 function gender(){
  try{const g=window.DEEN_AVATAR_ASSETS?.state?.()?.gender;if(g==='male'||g==='female')return g}catch(e){}
  try{return state?.myWorld?.avatarAssets?.gender==='male'?'male':'female'}catch(e){return 'female'}
 }
 function worldSnap(){try{return window.DEEN_WORLD?.snapshot?.()||{}}catch(e){return {}}}
 function legacyEquipped(){return worldSnap()?.equipped?.outfit||'outfit_teal'}
 function legacyIndex(id){const i=LEGACY.indexOf(id);return i<0?0:i}
 function idFor(g,i){return `${g}_${String(i+1).padStart(2,'0')}`}
 function parseId(g,id){const m=String(id||'').match(new RegExp('^'+g+'_(\\d{2})$'));if(!m)return null;const i=Number(m[1])-1;return i>=0&&i<CFG[g].count?i:null}
 function ensureStore(){
  try{
   state.myWorld=state.myWorld&&typeof state.myWorld==='object'?state.myWorld:{};
   state.myWorld.avatarAssets=state.myWorld.avatarAssets&&typeof state.myWorld.avatarAssets==='object'?state.myWorld.avatarAssets:{};
   const a=state.myWorld.avatarAssets;
   a.visualOutfit=a.visualOutfit&&typeof a.visualOutfit==='object'?a.visualOutfit:{};
   return a.visualOutfit;
  }catch(e){return {}}
 }
 function saved(g){const s=ensureStore();return parseId(g,s[g])!==null?s[g]:idFor(g,legacyIndex(legacyEquipped()))}
 function activeLegacy(){return $('#v812Wardrobe [data-v831-outfit].active')?.dataset?.v831Outfit||legacyEquipped()}
 function current(g=gender()){
  if(parseId(g,preview[g])!==null)return preview[g];
  return saved(g);
 }
 function spriteStyle(g,id){
  const c=CFG[g],i=parseId(g,id);if(i===null||!URLS[g])return '';
  const col=i%6,row=Math.floor(i/6),x=col*c.cell,y=row*c.cell;
  const sx=(c.aw/c.cell)*100,sy=(c.ah/c.cell)*100;
  const px=c.aw===c.cell?0:(x/(c.aw-c.cell))*100;
  const py=c.ah===c.cell?0:(y/(c.ah-c.cell))*100;
  return `background-image:url('${URLS[g]}');background-size:${sx}% ${sy}%;background-position:${px}% ${py}%;background-repeat:no-repeat`;
 }
 async function loadAtlas(g){
  const c=CFG[g],res=await fetch(`./assets/clothing-runtime/hf2e/${c.file}?v=${REV}`,{cache:'no-store'});
  if(!res.ok)throw new Error(`${g} atlas HTTP ${res.status}`);
  const b64=(await res.text()).replace(/\s+/g,''),bin=atob(b64),u=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  const four=o=>String.fromCharCode(u[o],u[o+1],u[o+2],u[o+3]);
  if(u.length<16||four(0)!=='RIFF'||four(8)!=='WEBP')throw new Error(`${g} atlas invalid WebP`);
  const declared=(u[4]|u[5]<<8|u[6]<<16|u[7]<<24)>>>0,expected=declared+8;
  if(u.length!==expected)throw new Error(`${g} atlas length ${u.length}/${expected}`);
  const url=URL.createObjectURL(new Blob([u],{type:'image/webp'}));
  const size=await new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve([im.naturalWidth,im.naturalHeight]);im.onerror=()=>reject(new Error(`${g} atlas decode failed`));im.src=url});
  if(size[0]!==c.aw||size[1]!==c.ah)throw new Error(`${g} atlas size ${size.join('x')}`);
  URLS[g]=url;INFO[g]={bytes:u.length,width:size[0],height:size[1],count:c.count};
 }
 function wearStack(stack,g,id){
  if(!stack||!URLS[g])return false;
  $$(':scope>.v832-worn-outfit,:scope>.v832d-worn-outfit,:scope>.v832e-worn-outfit',stack).forEach(el=>el.remove());
  const el=document.createElement('span');el.className='v831-sprite v832e-worn-outfit';el.setAttribute('aria-hidden','true');el.dataset.v832e=id;el.style.cssText=spriteStyle(g,id);
  const base=$(':scope>.layer-base_avatar',stack);if(base)base.after(el);else stack.prepend(el);return true;
 }
 function decorateLegacy(root,g){
  let n=0;
  $$('[data-v831-outfit]',root).forEach(card=>{
   const i=legacyIndex(card.dataset.v831Outfit),id=idFor(g,i),thumb=$('.v831-thumb',card);if(!thumb)return;
   let el=$('.v832e-legacy-sprite',thumb);if(!el){thumb.innerHTML='';el=document.createElement('span');el.className='v831-sprite v832e-legacy-sprite';thumb.appendChild(el)}
   el.style.cssText=spriteStyle(g,id);el.dataset.v832e=id;n++;
  });return n;
 }
 function closetHtml(g){
  const active=current(g),cards=Array.from({length:CFG[g].count},(_,i)=>{const id=idFor(g,i);return `<button type="button" class="v832e-card ${id===active?'active':''}" data-v832e-real="${id}"><span class="v832e-card-img"><span class="v831-sprite" style="${spriteStyle(g,id)}"></span></span><b>${g==='male'?'Erkek':'Kadın'} Kombin ${i+1}</b><small>${id===active?'SEÇİLİ':'DENE'}</small></button>`}).join('');
  return `<section class="v832e-closet" data-v832e-gender="${g}"><div class="v832e-closet-head"><div><b>Gerçek Kombinler</b><small>${CFG[g].count} güvenli gerçek kombin · canlı önizleme</small></div><em>27 sorunlu composite release dışında</em></div><div class="v832e-grid">${cards}</div></section>`;
 }
 function mountCloset(root,g){
  if(!root||!$('[data-v831-outfit]',root)){root?.querySelector?.('.v832e-closet')?.remove();return false}
  const selector=$('.v831-selector',root);if(!selector)return false;
  let box=$('.v832e-closet',selector);const sig=`${g}|${current(g)}`;
  if(!box||box.dataset.v832eSig!==sig){box?.remove();selector.insertAdjacentHTML('beforeend',closetHtml(g));box=$('.v832e-closet',selector);if(box)box.dataset.v832eSig=sig}
  return !!box;
 }
 function applyWorld(g){
  const id=saved(g);let n=0;
  $$('[data-v831-real-avatar="1"].v831-stack').forEach(stack=>{
   if(stack.closest?.('#v812Wardrobe .v831-preview'))return;
   if(wearStack(stack,g,id))n++;
  });return n;
 }
 function refresh(){
  if(!URLS.male||!URLS.female)return;
  const root=$('#v812Wardrobe'),g=gender();
  if(root?.classList?.contains('open')){
   if($('[data-v831-outfit]',root)){
    if(parseId(g,preview[g])===null)preview[g]=idFor(g,legacyIndex(activeLegacy()));
    decorateLegacy(root,g);mountCloset(root,g);
    const ps=$('.v831-preview .v831-stack',root);if(ps)wearStack(ps,g,current(g));
   }else $('.v832e-closet',root)?.remove();
  }
  applyWorld(g);document.documentElement.dataset.deenHF2E='ready';
 }
 function bind(){
  if(document.__v832eBound)return;document.__v832eBound=true;
  document.addEventListener('click',e=>{
   const real=e.target.closest?.('[data-v832e-real]');if(real){const g=gender();preview[g]=real.dataset.v832eReal;try{state.myWorld.avatarAssets.visualOutfitPreview=preview[g]}catch(_){};[0,20,80].forEach(ms=>setTimeout(refresh,ms));return}
   const legacy=e.target.closest?.('#v812Wardrobe [data-v831-outfit]');if(legacy){const g=gender();preview[g]=idFor(g,legacyIndex(legacy.dataset.v831Outfit));[0,20,80].forEach(ms=>setTimeout(refresh,ms));return}
   const gen=e.target.closest?.('#v812Wardrobe [data-v831-gender]');if(gen){setTimeout(()=>{const g=gender();preview[g]=saved(g);refresh()},30)}
  },false);
 }
 function patchPro(){
  const p=window.DEEN_WARDROBE_PRO;if(!p||p.__v832e)return false;
  const oldOpen=p.open,oldSave=p.save,oldCancel=p.cancel,oldRender=p.render;
  p.open=function(...a){const r=typeof oldOpen==='function'?oldOpen.apply(this,a):undefined;for(const g of ['male','female']){initial[g]=saved(g);preview[g]=initial[g]}[0,40,140].forEach(ms=>setTimeout(refresh,ms));return r};
  p.save=function(...a){const r=typeof oldSave==='function'?oldSave.apply(this,a):undefined;if(r===false)return r;const g=gender(),s=ensureStore();s[g]=current(g);preview[g]=s[g];try{state.myWorld.avatarAssets.visualOutfitPreview=null;saveState?.();updateUI?.()}catch(e){};[40,120].forEach(ms=>setTimeout(refresh,ms));return r};
  p.cancel=function(...a){const r=typeof oldCancel==='function'?oldCancel.apply(this,a):undefined;for(const g of ['male','female'])preview[g]=initial[g]||saved(g);try{if(state?.myWorld?.avatarAssets)state.myWorld.avatarAssets.visualOutfitPreview=null}catch(e){};setTimeout(refresh,80);return r};
  p.render=function(...a){const r=typeof oldRender==='function'?oldRender.apply(this,a):undefined;setTimeout(refresh,0);return r};
  p.__v832e=true;patched=true;return true;
 }
 async function boot(){
  try{
   await Promise.all([loadAtlas('male'),loadAtlas('female')]);
   const start=Date.now();while(Date.now()-start<15000){if(window.__deenV831Applied&&window.DEEN_WARDROBE_PRO)break;await delay(60)}
   if(!window.__deenV831Applied)throw new Error('HF2E avatar runtime not ready');
   patchPro();bind();for(const g of ['male','female'])preview[g]=saved(g);
   [0,80,250,700].forEach(ms=>setTimeout(refresh,ms));
   setInterval(()=>{const r=$('#v812Wardrobe');if(r?.classList?.contains('open')){if(!patched)patchPro();refresh()}},300);
   window.DEEN_REAL_CLOSET={version:VERSION,revision:REV,refresh,atlas:()=>INFO,check:()=>({version:VERSION,revision:REV,gender:gender(),saved:saved(gender()),preview:current(gender()),legacyCards:$$('#v812Wardrobe [data-v831-outfit]').length,legacyRealThumbs:$$('#v812Wardrobe .v832e-legacy-sprite').length,realCards:$$('#v812Wardrobe [data-v832e-real]').length,worn:$$('.v832e-worn-outfit').length,atlas:INFO})};
   window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.3.2 HF2E';
  }catch(err){console.error('DEEN HF2E closet failed',err);document.documentElement.dataset.deenHF2E='error';window.DEEN_HF2E_ERROR=String(err?.message||err)}
 }
 boot();
})();
