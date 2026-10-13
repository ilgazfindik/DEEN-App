(()=>{
 if(window.__deenV832HF2FCloset)return;window.__deenV832HF2FCloset=true;
 const VERSION='8.3.2-HF2F',REV='832hf2f1';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const $$=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
 const LEGACY=['outfit_teal','outfit_lavender','outfit_navy','outfit_cream'];
 const LEGACY_NAMES=['Teal Tunik','Lavanta Tunik','Lacivert Tunik','Krem Tunik'];
 const CFG={
   male:{count:12,cell:96,cols:6,file:'male_atlas.b64'},
   female:{count:11,cell:80,cols:6,file:'female_atlas.b64'}
 };
 const URLS={male:'',female:''},META={male:null,female:null};
 const preview={male:null,female:null};
 let frame=0,observer=null;
 function gender(){
   try{const g=window.DEEN_AVATAR_ASSETS?.state?.()?.gender;if(g==='male'||g==='female')return g}catch(_){}
   try{return state?.myWorld?.avatarAssets?.gender==='male'?'male':'female'}catch(_){return 'female'}
 }
 function worldSnap(){try{return window.DEEN_WORLD?.snapshot?.()||{}}catch(_){return {}}}
 function worldItems(){try{return window.DEEN_WORLD?.items?.()||[]}catch(_){return []}}
 function store(){
   try{
     state.myWorld=state.myWorld&&typeof state.myWorld==='object'?state.myWorld:{};
     state.myWorld.avatarAssets=state.myWorld.avatarAssets&&typeof state.myWorld.avatarAssets==='object'?state.myWorld.avatarAssets:{};
     const a=state.myWorld.avatarAssets;
     a.visualOutfit=a.visualOutfit&&typeof a.visualOutfit==='object'?a.visualOutfit:{};
     return a.visualOutfit;
   }catch(_){return {}}
 }
 function legacyEquipped(){return worldSnap()?.equipped?.outfit||'outfit_teal'}
 function legacyIndex(id){const i=LEGACY.indexOf(id);return i<0?0:i}
 function idFor(g,i){return `${g}_${String(i+1).padStart(2,'0')}`}
 function parseId(g,id){const m=String(id||'').match(new RegExp('^'+g+'_(\\d{2})$'));if(!m)return null;const i=Number(m[1])-1;return i>=0&&i<CFG[g].count?i:null}
 function saved(g){const s=store();return parseId(g,s[g])!==null?s[g]:idFor(g,legacyIndex(legacyEquipped()))}
 function current(g=gender()){return parseId(g,preview[g])!==null?preview[g]:saved(g)}
 function spriteStyle(g,id){
   const i=parseId(g,id),c=CFG[g];if(i===null||!URLS[g])return '';
   const col=i%c.cols,row=Math.floor(i/c.cols),aw=c.cols*c.cell,rows=Math.ceil(c.count/c.cols),ah=rows*c.cell;
   const x=col*c.cell,y=row*c.cell,sx=(aw/c.cell)*100,sy=(ah/c.cell)*100;
   const px=aw===c.cell?0:(x/(aw-c.cell))*100,py=ah===c.cell?0:(y/(ah-c.cell))*100;
   return `background-image:url('${URLS[g]}');background-size:${sx}% ${sy}%;background-position:${px}% ${py}%;background-repeat:no-repeat`;
 }
 async function atlas(g){
   const c=CFG[g],r=await fetch(`./assets/clothing-runtime/hf2e/${c.file}?v=${REV}`,{cache:'no-store'});
   if(!r.ok)throw new Error(`${g} outfit atlas HTTP ${r.status}`);
   const text=(await r.text()).replace(/\\s+/g,''),bin=atob(text),raw=new Uint8Array(bin.length);
   for(let i=0;i<bin.length;i++)raw[i]=bin.charCodeAt(i);
   const four=o=>String.fromCharCode(raw[o],raw[o+1],raw[o+2],raw[o+3]);
   if(raw.length<16||four(0)!=='RIFF'||four(8)!=='WEBP')throw new Error(`${g} outfit atlas invalid`);
   const declared=(raw[4]|raw[5]<<8|raw[6]<<16|raw[7]<<24)>>>0,expected=declared+8;
   if(raw.length<expected)throw new Error(`${g} outfit atlas truncated ${raw.length}/${expected}`);
   const bytes=raw.length===expected?raw:raw.slice(0,expected);
   const url=URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
   const size=await new Promise((ok,bad)=>{const im=new Image();im.onload=()=>ok([im.naturalWidth,im.naturalHeight]);im.onerror=()=>bad(new Error(`${g} outfit atlas decode`));im.src=url});
   URLS[g]=url;META[g]={bytes:bytes.length,width:size[0],height:size[1],count:c.count};
 }
 function outfitInfo(){const items=worldItems().filter(x=>x?.type==='outfit'&&!x?.paid),snap=worldSnap(),owned=new Set(snap?.owned||[]);return {items,owned}}
 function cardLabel(g,i){
   if(i<4){const {items,owned}=outfitInfo(),it=items.find(x=>x.id===LEGACY[i]);const own=!!(it?.default||owned.has(LEGACY[i]));return {name:it?.name||LEGACY_NAMES[i],sub:own?'SAHİPSİN':`🪙 ${Number(it?.price||0)}`}}
   return {name:`${g==='male'?'Erkek':'Kadın'} Kombin ${i+1}`,sub:'DENE'};
 }
 function cardsHtml(g){
   const cur=current(g);
   return Array.from({length:CFG[g].count},(_,i)=>{
     const id=idFor(g,i),lab=cardLabel(g,i),legacy=i<4?` data-v831-outfit="${LEGACY[i]}"`:'';
     return `<button type="button" class="v831-card v832f-card ${id===cur?'active':''}" data-v832f-real="${id}"${legacy}><span class="v831-thumb v832f-thumb"><span class="v831-sprite v832f-sprite" style="${spriteStyle(g,id)}"></span></span><b>${lab.name}</b><small class="${i<4?'v831-price':''}">${id===cur?'SEÇİLİ':lab.sub}</small></button>`;
   }).join('');
 }
 function outfitMode(root){return !!($('.v831-main-tab.active[data-v831-cat="outfit"]',root)||$('[data-v831-outfit]',root)||$('.v832f-card',root))}
 function renderCards(){
   const root=$('#v812Wardrobe');if(!root||!root.classList.contains('open')||!outfitMode(root))return false;
   const g=gender(),cards=$('.v831-cards',root);if(!cards||!URLS[g])return false;
   const sig=`${g}|${current(g)}|${legacyEquipped()}|${(worldSnap()?.owned||[]).join(',')}`;
   if(cards.dataset.v832fSig!==sig||!$('.v832f-card',cards)){
     cards.innerHTML=cardsHtml(g);cards.dataset.v832fSig=sig;
   }else{
     $$('.v832f-card',cards).forEach(el=>el.classList.toggle('active',el.dataset.v832fReal===current(g)));
   }
   const h=$('.v831-selector-head b',root),s=$('.v831-selector-head small',root);
   if(h)h.textContent='Gerçek kıyafetler';if(s)s.textContent=`${CFG[g].count} kombin · sağa-sola kaydır`;
   root.dataset.v832fCloset='ready';return true;
 }
 function wear(stack,g,id){
   if(!stack||!URLS[g])return false;
   const currentEl=$(':scope>.v832f-worn-outfit',stack);
   if(currentEl?.dataset?.v832f===id)return true;
   $$(':scope>.v832-worn-outfit,:scope>.v832d-worn-outfit,:scope>.v832e-worn-outfit,:scope>.v832f-worn-outfit',stack).forEach(n=>n.remove());
   const el=document.createElement('span');el.className='v831-sprite v832f-worn-outfit';el.dataset.v832f=id;el.setAttribute('aria-hidden','true');el.style.cssText=spriteStyle(g,id);
   const base=$(':scope>.layer-base_avatar',stack);base?base.after(el):stack.prepend(el);return true;
 }
 function applyPreview(){
   const root=$('#v812Wardrobe'),g=gender(),stack=$('.v831-preview .v831-stack',root);if(stack)wear(stack,g,current(g));
 }
 function applyWorld(){
   const g=gender(),id=saved(g);$$('[data-v831-real-avatar="1"].v831-stack').forEach(stack=>{if(!stack.closest?.('#v812Wardrobe .v831-preview'))wear(stack,g,id)});
 }
 function sync(){frame=0;if(!URLS.male&&!URLS.female)return;renderCards();applyPreview();applyWorld();document.documentElement.dataset.deenHF2F='ready'}
 function schedule(ms=0){if(ms)return setTimeout(schedule,ms);if(frame)return;frame=requestAnimationFrame(sync)}
 function persist(g){const s=store(),id=current(g);if(parseId(g,id)!==null){s[g]=id;preview[g]=id;try{state.myWorld.avatarAssets.visualOutfitPreview=null;saveState?.();updateUI?.()}catch(_){}}}
 function bind(){
   if(document.__v832fBound)return;document.__v832fBound=true;
   document.addEventListener('click',e=>{
     const real=e.target.closest?.('[data-v832f-real]');
     if(real){const g=gender();preview[g]=real.dataset.v832fReal;try{state.myWorld.avatarAssets.visualOutfitPreview=preview[g]}catch(_){};schedule();schedule(30);schedule(120);return}
     if(e.target.closest?.('#v812Wardrobe [data-v831-gender]')){schedule(30);schedule(120);return}
     if(e.target.closest?.('#v812Wardrobe .v831-main-tab')){schedule(20);schedule(100);return}
     if(e.target.closest?.('#v812Wardrobe [data-v831-save]')){const g=gender();setTimeout(()=>{persist(g);applyWorld()},80);return}
   },true);
 }
 function observe(){
   if(observer)return;observer=new MutationObserver(()=>schedule());observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
 }
 async function boot(){
   const result=await Promise.allSettled([atlas('male'),atlas('female')]);
   if(!URLS.male&&!URLS.female){console.error('DEEN HF2F outfit atlases failed',result);document.documentElement.dataset.deenHF2F='error';return}
   for(const g of ['male','female'])preview[g]=saved(g);
   bind();observe();
   [0,60,180,500,1200].forEach(schedule);
   window.DEEN_REAL_CLOSET={version:VERSION,revision:REV,refresh:sync,check:()=>({version:VERSION,revision:REV,gender:gender(),saved:saved(gender()),preview:current(gender()),realCards:$$('#v812Wardrobe .v832f-card').length,worn:$$('.v832f-worn-outfit').length,atlas:META,mode:outfitMode($('#v812Wardrobe'))})};
   window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.3.2 HF2F';
 }
 boot().catch(err=>{console.error('DEEN HF2F closet boot failed',err);document.documentElement.dataset.deenHF2F='error';window.DEEN_HF2F_ERROR=String(err?.message||err)});
})();