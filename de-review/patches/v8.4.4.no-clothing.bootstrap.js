(()=>{
 const VERSION='8.4.8-GLOBAL-INTERACTION-STABILITY',REV='848global1';
 window.DEEN_PATCH_V832HF2T=function(html){
  let out=String(html);
  if(out.includes('data-deen-v848-no-clothing'))return{html:out,version:VERSION,applied:0};
  out+=`\n<link rel="stylesheet" href="./patches/v8.4.4.no-clothing.css?v=${REV}" data-deen-v848-no-clothing-css>\n<script src="./patches/v8.4.4.no-clothing.runtime.js?v=${REV}" data-deen-v848-no-clothing><\/script>\n<script src="./patches/v8.4.8.global-interaction-stability.runtime.js?v=${REV}" data-deen-v848-stability><\/script>\n`;
  return{html:out,version:VERSION,applied:1};
 };
 window.DEEN_PATCH_V832HF2U=function(html){return{html:String(html),version:VERSION,applied:0}};
 window.DEEN_V848_BOOTSTRAP={version:VERSION,revision:REV};
})();
