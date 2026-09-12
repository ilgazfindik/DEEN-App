(()=>{
 if(window.__deenV832HF2OHead)return; window.__deenV832HF2OHead=true;
 const VERSION='8.3.2-HF2O',REV='832hf2o1';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const FILES={female:['female_base.b64','female_hair.b64','female_eyes.b64','female_nose.b64','female_mouth.b64'],male:['male_base.b64','male_hair.b64','male_eyes.b64','male_nose.b64','male_mouth.b64']};
 const CACHE={female:null,male:null};
 function root(){return $('#v812Wardrobe')}
 function mannequin(){return $('.v832k-mannequin',root())}
 function gender(){return mannequin()?.dataset?.gender==='male'?'male':'female'}
 async function load(g){
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
 function forceBadge(text='HF2O · HEAD CROP TEST'){
   const b=$('.v832k-runtime-badge',root());
   if(b&&b.textContent!==text)b.textContent=text;
 }
 function watchBadge(){
   const b=$('.v832k-runtime-badge',root());if(!b||b.dataset.hf2oWatch)return;
   b.dataset.hf2oWatch='1';
   new MutationObserver(()=>forceBadge()).observe(b,{childList:true,characterData:true,subtree:true});
 }
 async function renderHead(){
   const r=root(),m=mannequin(),slot=$('.v832k-head-slot',m);
   if(!r?.classList?.contains('open')||!m||!slot)return false;
   const g=gender(); forceBadge(); watchBadge();
   if(slot.dataset.hf2oGender===g&&$('.v832o-head-stack',slot))return true;
   slot.dataset.hf2oGender=g;
   slot.innerHTML='<span class="v832o-loading">KAFA YÜKLENİYOR</span>';
   try{
     const urls=await load(g);if(slot.dataset.hf2oGender!==g)return false;
     const stack=document.createElement('div');stack.className='v832o-head-stack';
     urls.forEach((src,i)=>{const el=document.createElement('span');el.className='v832o-head-layer l'+i;el.style.backgroundImage=`url("${src}")`;stack.appendChild(el)});
     slot.innerHTML='';slot.appendChild(stack);
     const note=$('.v832k-body-note',m);if(note)note.textContent='GÖVDE + KAFA HİZA TESTİ';
     const f=$('.v812-footcopy',r);if(f)f.innerHTML='<b>Adım 1B · Kafa kırpma ve boyun hizası</b><small>Kıyafet giydirme kapalı. Önce kafa-gövde birleşimini doğruluyoruz.</small>';
     document.documentElement.dataset.deenHF2O='ready';
     return true;
   }catch(err){console.error('HF2O head',err);slot.innerHTML='<span class="v832o-error">KAFA ASSET HATASI</span>';forceBadge('HF2O · HEAD LOAD ERROR');window.DEEN_HF2O_ERROR=String(err?.message||err);return false;}
 }
 function tick(){const r=root();if(!r?.classList?.contains('open'))return;const m=mannequin();if(!m)return;$('.v832l-garment',m)?.remove();$('.v832l-step-badge',m)?.remove();forceBadge();watchBadge();renderHead()}
 setInterval(tick,120);[0,80,180,360,700,1200].forEach(ms=>setTimeout(tick,ms));
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe]'))[40,120,260].forEach(ms=>setTimeout(tick,ms))},true);
 window.DEEN_HF2O={version:VERSION,refresh:tick,check:()=>({version:VERSION,gender:gender(),head:!!$('.v832o-head-stack',root()),badge:$('.v832k-runtime-badge',root())?.textContent||null,error:window.DEEN_HF2O_ERROR||null})};
 window.DEEN_RELEASE_VERSION=VERSION;setTimeout(()=>{document.title='DEEN v8.3.2 HF2O'},400);
})();
