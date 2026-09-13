(()=>{
 if(window.__deenV832HF2V)return;window.__deenV832HF2V=true;
 const VERSION='8.3.2-HF2V';
 function canvas(){return document.querySelector('#v812Wardrobe .v832u-canvas')}
 function check(){
  const c=canvas(),cs=c?getComputedStyle(c):null;
  return {
   version:VERSION,
   viewport:{width:window.innerWidth,height:window.innerHeight},
   desktop:window.matchMedia('(min-width:701px)').matches,
   canvasSize:cs?.getPropertyValue('--u-size')?.trim()||null,
   fitScale:cs?.getPropertyValue('--v832v-scale')?.trim()||null,
   saveLocked:true
  };
 }
 window.DEEN_HF2V={version:VERSION,check};
 document.documentElement.dataset.deenHF2V='ready';
 window.DEEN_RELEASE_VERSION=VERSION;
 setTimeout(()=>{document.title='DEEN v8.3.2 HF2V'},500);
})();
