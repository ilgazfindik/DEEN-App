(()=>{
 if(window.__deenV832HF2PHead)return;window.__deenV832HF2PHead=true;
 const VERSION='8.3.2-HF2P';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 function root(){return $('#v812Wardrobe')}
 function mannequin(){return $('.v832k-mannequin',root())}
 function gender(){return mannequin()?.dataset?.gender==='male'?'male':'female'}
 function avatar(){return window.DEEN_AVATAR_ASSETS}
 function sig(){
  try{const a=avatar()?.state?.(),g=gender();return g+'|'+JSON.stringify(a?.selected?.[g]||{})}catch(_){return gender()+'|?'}
 }
 function forceBadge(text='HF2P · LIVE AVATAR HEAD'){
  const b=$('.v832k-runtime-badge',root());if(b&&b.textContent!==text)b.textContent=text
 }
 function watchBadge(){
  const b=$('.v832k-runtime-badge',root());if(!b||b.dataset.hf2pWatch)return;
  b.dataset.hf2pWatch='1';new MutationObserver(()=>forceBadge()).observe(b,{childList:true,characterData:true,subtree:true})
 }
 function renderHead(){
  const r=root(),m=mannequin(),slot=$('.v832k-head-slot',m);
  if(!r?.classList?.contains('open')||!m||!slot)return false;
  forceBadge();watchBadge();
  const api=avatar(),g=gender();
  if(typeof api?.svg!=='function'){
    if(!$('.v832p-wait',slot))slot.innerHTML='<span class="v832p-wait">AVATAR BEKLENİYOR</span>';
    return false;
  }
  const s=sig();
  if(slot.dataset.hf2pSig===s&&$('.v832p-head-stack',slot))return true;
  let html='';try{html=api.svg(g)||''}catch(_){}
  if(!html)return false;
  slot.innerHTML=html;
  const stack=$('.v831-stack',slot);if(!stack)return false;
  stack.classList.add('v832p-head-stack');slot.dataset.hf2pSig=s;
  const note=$('.v832k-body-note',m);if(note)note.textContent='GÖVDE + GERÇEK KAFA TESTİ';
  const f=$('.v812-footcopy',r);if(f)f.innerHTML='<b>Adım 1B · Gerçek avatar kafası</b><small>Kıyafet seçimi hâlâ kapalı. Önce kafa, boyun ve omuz birleşimini doğruluyoruz.</small>';
  document.documentElement.dataset.deenHF2P='ready';
  return true
 }
 function tick(){
  const r=root();if(!r?.classList?.contains('open'))return;const m=mannequin();if(!m)return;
  $('.v832l-garment',m)?.remove();$('.v832l-step-badge',m)?.remove();
  forceBadge();watchBadge();renderHead()
 }
 setInterval(tick,120);[0,80,180,360,700,1200,2200].forEach(ms=>setTimeout(tick,ms));
 document.addEventListener('click',e=>{
  if(e.target.closest?.('#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe],#v812Wardrobe [data-v831-asset]'))[40,120,260,520].forEach(ms=>setTimeout(tick,ms))
 },true);
 window.DEEN_HF2P={version:VERSION,refresh:tick,check:()=>({version:VERSION,gender:gender(),avatarReady:typeof avatar()?.svg==='function',head:!!$('.v832p-head-stack',root()),badge:$('.v832k-runtime-badge',root())?.textContent||null,signature:sig()})};
 window.DEEN_RELEASE_VERSION=VERSION;setTimeout(()=>{document.title='DEEN v8.3.2 HF2P'},500)
})();
