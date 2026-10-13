(()=>{
 if(window.__deenV832HF2S)return;window.__deenV832HF2S=true;
 const VERSION='8.3.2-HF2S-PERF';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 function root(){return $('#v812Wardrobe')}
 function mannequin(){return $('.v832k-mannequin',root())}
 function gender(){return mannequin()?.dataset?.gender==='male'?'male':'female'}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function syncGarment(){
   const r=root(),m=mannequin();if(!r?.classList?.contains('open')||!m)return false;
   const id=activeId(),g=gender();if(!id)return false;
   const src=$(`.v832k-card[data-v832k-real="${id}"] .v832k-sprite`,r);if(!src)return false;
   let wear=$('.v832s-garment',m);if(!wear){wear=document.createElement('span');wear.className='v832s-garment';wear.setAttribute('aria-hidden','true');m.appendChild(wear)}
   const style=src.getAttribute('style')||'';if(wear.dataset.id!==id||wear.dataset.gender!==g||wear.getAttribute('style')!==style){wear.dataset.id=id;wear.dataset.gender=g;wear.setAttribute('style',style)}
   document.documentElement.dataset.deenHF2S='ready';return true;
 }
 let raf=0;function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;syncGarment()})}
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe,[data-v810-open-wardrobe]')){schedule();setTimeout(schedule,70)}},true);
 [0,180,600].forEach(ms=>setTimeout(schedule,ms));
 window.DEEN_HF2S={version:VERSION,refresh:schedule,check:()=>({version:VERSION,gender:gender(),active:activeId(),garment:!!$('.v832s-garment',root()),saveLocked:true,eventDriven:true})};
})();
