(()=>{
 if(window.__deenV832HF2S)return;window.__deenV832HF2S=true;
 const VERSION='8.3.2-HF2S',REV='832hf2s1';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const FILES={female:['female_base.b64','female_hair.b64','female_eyes.b64','female_nose.b64','female_mouth.b64'],male:['male_base.b64','male_hair.b64','male_eyes.b64','male_nose.b64','male_mouth.b64']};
 const CACHE={female:null,male:null};
 function root(){return $('#v812Wardrobe')}
 function mannequin(){return $('.v832k-mannequin',root())}
 function gender(){return mannequin()?.dataset?.gender==='male'?'male':'female'}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function forceCopy(){
   const r=root();if(!r)return;
   const badge=$('.v832k-runtime-badge',r),bt='HF2S · REAL OUTFIT FIT';if(badge&&badge.textContent!==bt)badge.textContent=bt;
   const note=$('.v832k-body-note',r),nt='GÖVDE + KAFA + KIYAFET';if(note&&note.textContent!==nt)note.textContent=nt;
   const f=$('.v812-footcopy',r),fh='<b>Adım 2 · Gerçek kıyafet uyumu</b><small>11 kadın + 12 erkek güvenli kombin canlı deneniyor. Kaydetme henüz kilitli.</small>';if(f&&f.innerHTML!==fh)f.innerHTML=fh;
 }
 async function loadHead(g){
   if(CACHE[g])return CACHE[g];
   const arr=await Promise.all(FILES[g].map(async name=>{
     const r=await fetch(`./assets/avatar-runtime/hf2/defaults/${name}?v=${REV}`,{cache:'no-store'});
     if(!r.ok)throw new Error(`${name} HTTP ${r.status}`);
     const b=(await r.text()).replace(/\s+/g,'');
     if(!b.startsWith('UklGR'))throw new Error(`${name} invalid`);
     return `data:image/webp;base64,${b}`;
   }));
   CACHE[g]=arr;return arr;
 }
 async function renderHead(){
   const r=root(),m=mannequin(),slot=$('.v832k-head-slot',m);if(!r?.classList?.contains('open')||!m||!slot)return false;
   const g=gender();
   if(slot.dataset.hf2sGender===g&&$('.v832s-head-stack',slot))return true;
   slot.dataset.hf2sGender=g;slot.innerHTML='<span class="v832r-loading">KAFA YÜKLENİYOR</span>';
   try{
     const urls=await loadHead(g);if(slot.dataset.hf2sGender!==g)return false;
     const stack=document.createElement('div');stack.className='v832r-head-stack v832s-head-stack';
     urls.forEach((src,i)=>{const el=document.createElement('span');el.className='v832r-head-layer l'+i;el.style.backgroundImage=`url("${src}")`;stack.appendChild(el)});
     slot.innerHTML='';slot.appendChild(stack);return true;
   }catch(err){console.error('HF2S head',err);slot.innerHTML='<span class="v832r-error">KAFA ASSET HATASI</span>';window.DEEN_HF2S_ERROR=String(err?.message||err);return false}
 }
 function syncGarment(){
   const r=root(),m=mannequin();if(!r?.classList?.contains('open')||!m)return false;
   const id=activeId(),g=gender();if(!id)return false;
   const src=$(`.v832k-card[data-v832k-real="${id}"] .v832k-sprite`,r);if(!src)return false;
   let wear=$('.v832s-garment',m);
   if(!wear){wear=document.createElement('span');wear.className='v832s-garment';wear.setAttribute('aria-hidden','true');const head=$('.v832k-head-slot',m);head?head.before(wear):m.appendChild(wear)}
   const style=src.getAttribute('style')||'';
   if(wear.dataset.id!==id||wear.dataset.gender!==g||wear.getAttribute('style')!==style){wear.dataset.id=id;wear.dataset.gender=g;wear.setAttribute('style',style)}
   return true;
 }
 function badge(){const m=mannequin();if(!m)return;let b=$('.v832s-step-badge',m);if(!b){b=document.createElement('span');b.className='v832s-step-badge';m.appendChild(b)}const t=`${gender()==='male'?'ERKEK':'KADIN'} · ${activeId()||'KOMBİN'}`;if(b.textContent!==t)b.textContent=t}
 function tick(){
   const r=root();if(!r?.classList?.contains('open'))return;
   const m=mannequin();if(!m)return;
   $('.v832l-garment',m)?.remove();$('.v832l-step-badge',m)?.remove();
   renderHead();syncGarment();badge();forceCopy();document.documentElement.dataset.deenHF2S='ready';
 }
 const obs=new MutationObserver(()=>{if(root()?.classList?.contains('open'))queueMicrotask(tick)});
 setTimeout(()=>{const r=root();if(r)obs.observe(r,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']})},300);
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v832k-real],#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe]'))[30,100,220].forEach(ms=>setTimeout(tick,ms))},true);
 setInterval(tick,120);[0,80,200,420,900,1500].forEach(ms=>setTimeout(tick,ms));
 window.DEEN_HF2S={version:VERSION,refresh:tick,check:()=>({version:VERSION,gender:gender(),active:activeId(),head:!!$('.v832s-head-stack',root()),garment:!!$('.v832s-garment',root()),saveLocked:true,error:window.DEEN_HF2S_ERROR||null})};
 window.DEEN_RELEASE_VERSION=VERSION;setTimeout(()=>{document.title='DEEN v8.3.2 HF2S'},450);
})();
