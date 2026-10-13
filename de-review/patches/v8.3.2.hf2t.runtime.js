(()=>{
 if(window.__deenV832HF2T)return;window.__deenV832HF2T=true;
 const VERSION='8.3.2-HF2T-PERF';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 function root(){return $('#v812Wardrobe')}
 function mannequin(){return $('.v832k-mannequin',root())}
 function gender(){return mannequin()?.dataset?.gender==='male'?'male':'female'}
 function activeId(){return $('.v832k-card.active',root())?.dataset?.v832kReal||null}
 function fit(){
   const r=root(),m=mannequin();if(!r?.classList?.contains('open')||!m)return false;
   const wear=$('.v832s-garment',m);if(!wear)return false;
   m.classList.add('v832t-fit-active');m.dataset.gender=gender();
   $('.v832t-fit-label',m)?.remove?.();$('.v832k-body-note',m)?.remove?.();
   document.documentElement.dataset.deenHF2T='ready';return true;
 }
 let raf=0;function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;fit()})}
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe,[data-v810-open-wardrobe]')){schedule();setTimeout(schedule,80)}},true);
 [0,150,500].forEach(ms=>setTimeout(schedule,ms));
 window.DEEN_HF2T={version:VERSION,refresh:schedule,check:()=>({version:VERSION,gender:gender(),active:activeId(),fitActive:!!mannequin()?.classList?.contains('v832t-fit-active'),saveLocked:true,eventDriven:true})};
})();
