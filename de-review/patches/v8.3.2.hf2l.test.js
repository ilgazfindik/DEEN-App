(()=>{
 if(window.__deenV832HF2LTest)return;window.__deenV832HF2LTest=true;
 const VERSION='8.3.2-HF2L';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const $$=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
 function gender(){try{return window.DEEN_AVATAR_STUDIO?.state?.().gender==='male'?'male':'female'}catch(_){return 'female'}}
 function root(){return $('#v812Wardrobe')}
 function mannequin(){return $('.v832k-mannequin',root())}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function syncHead(m){
   if(!m)return false;const slot=$('.v832k-head-slot',m);if(!slot)return false;
   if(!$('.v831-stack',slot)){
     try{const html=window.DEEN_AVATAR_ASSETS?.svg?.(gender())||'';if(html)slot.innerHTML=html}catch(_){}
   }
   return !!$('.v831-stack',slot);
 }
 function syncGarment(m){
   if(!m)return false;let wear=$('.v832l-garment',m);const id=activeId(),g=gender();
   if(g!=='female'||id!=='female_01'){
     wear?.remove();return false;
   }
   const src=$('.v832k-card[data-v832k-real="female_01"] .v832k-sprite',root());
   if(!src)return false;
   if(!wear){wear=document.createElement('span');wear.className='v832l-garment';wear.setAttribute('aria-hidden','true');const head=$('.v832k-head-slot',m);head?head.before(wear):m.appendChild(wear)}
   const inline=src.getAttribute('style')||'';if(inline&&wear.getAttribute('style')!==inline)wear.setAttribute('style',inline);
   return true;
 }
 function decorate(m){
   const g=gender();$$('.v832k-card',root()).forEach(c=>c.classList.toggle('v832l-disabled',g==='female'&&c.dataset.v832kReal!=='female_01'));
   if(m){let b=$('.v832l-step-badge',m);if(!b){b=document.createElement('span');b.className='v832l-step-badge';m.appendChild(b)}b.textContent=g==='female'?'ADIM 2 · KADIN KOMBİN 1 TEST':'ADIM 2 · ÖNCE KADIN TESTİ';const n=$('.v832k-body-note',m);if(n)n.textContent='GÖVDE + KIYAFET TESTİ'}
   const f=$('.v812-footcopy',root());if(f)f.innerHTML=g==='female'?'<b>Adım 2 · Sadece Kadın Kombin 1 aktif</b><small>İlk karta dokun: kıyafet gövdeye oturmalı. Diğer kombinleri henüz giydirmiyoruz.</small>':'<b>Adım 2 · Kadın gövde/kıyafet testi</b><small>Erkek giydirme bir sonraki doğrulamadan sonra açılacak.</small>';
   const badge=$('.v832k-runtime-badge',root());if(badge)badge.textContent='HF2L · 1 OUTFIT FIT TEST';
 }
 function tick(){
   const r=root();if(!r?.classList?.contains('open'))return;const m=mannequin();if(!m)return;
   syncHead(m);syncGarment(m);decorate(m);
   document.documentElement.dataset.deenHF2L='ready';
 }
 setInterval(tick,100);[0,80,180,400,900,1600].forEach(ms=>setTimeout(tick,ms));
 window.DEEN_HF2L={version:VERSION,refresh:tick,check:()=>({version:VERSION,gender:gender(),active:activeId(),head:!!$('.v832k-head-slot .v831-stack',root()),garment:!!$('.v832l-garment',root())})};
 window.DEEN_RELEASE_VERSION=VERSION;setTimeout(()=>{document.title='DEEN v8.3.2 HF2L'},500);
})();
