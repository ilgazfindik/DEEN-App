(()=>{
 if(window.__deenV832HF2W)return;window.__deenV832HF2W=true;
 const VERSION='8.3.2-HF2W';
 function check(){
  const r=document.querySelector('#v812Wardrobe');
  const c=r?.querySelector('.v832u-canvas');
  return {version:VERSION,gender:c?.dataset?.gender||null,faceSlot:!!c?.querySelector('.v832u-avatar-slot'),outfit:!!c?.querySelector('.v832u-outfit'),saveLocked:true};
 }
 window.DEEN_HF2W={version:VERSION,check};
 window.DEEN_RELEASE_VERSION=VERSION;
 document.documentElement.dataset.deenHF2W='ready';
 setTimeout(()=>{document.title='DEEN v8.3.2 HF2W'},450);
})();
