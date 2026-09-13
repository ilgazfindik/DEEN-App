(()=>{
 if(window.__deenV832HF2T)return;window.__deenV832HF2T=true;
 const VERSION='8.3.2-HF2T';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 function root(){return $('#v812Wardrobe')}
 function mannequin(){return $('.v832k-mannequin',root())}
 function gender(){return mannequin()?.dataset?.gender==='male'?'male':'female'}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function fit(){
   const r=root(),m=mannequin();if(!r?.classList?.contains('open')||!m)return false;
   const wear=$('.v832s-garment',m);if(!wear)return false;
   m.classList.add('v832t-fit-active');m.dataset.gender=gender();
   let label=$('.v832t-fit-label',m);if(!label){label=document.createElement('span');label.className='v832t-fit-label';m.appendChild(label)}
   label.textContent='KIYAFET GÖVDEYE SABİTLENDİ';
   const badge=$('.v832k-runtime-badge',r);if(badge)badge.textContent='HF2T · OUTFIT BODY ANCHOR';
   const note=$('.v832k-body-note',m);if(note)note.textContent='GERÇEK KIYAFET + MODÜLER KAFA';
   const foot=$('.v812-footcopy',r);if(foot)foot.innerHTML='<b>Adım 2B · Kıyafet gövde sabitleme</b><small>Seçilen gerçek kombin artık ikinci bir karakter gibi altta durmamalı; avatarın gövdesi olarak hizalanmalı. Kaydetme hâlâ kilitli.</small>';
   document.documentElement.dataset.deenHF2T='ready';return true;
 }
 function tick(){fit()}
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v832k-real],#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe]'))[20,70,160,320].forEach(ms=>setTimeout(tick,ms))},true);
 const obs=new MutationObserver(()=>{if(root()?.classList?.contains('open'))queueMicrotask(tick)});
 setTimeout(()=>{const r=root();if(r)obs.observe(r,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']})},350);
 setInterval(tick,120);[0,80,200,450,900,1500].forEach(ms=>setTimeout(tick,ms));
 window.DEEN_HF2T={version:VERSION,refresh:tick,check:()=>({version:VERSION,gender:gender(),active:activeId(),fitActive:!!mannequin()?.classList?.contains('v832t-fit-active'),garment:!!$('.v832s-garment',mannequin()),saveLocked:true})};
 window.DEEN_RELEASE_VERSION=VERSION;setTimeout(()=>{document.title='DEEN v8.3.2 HF2T'},700);
})();
