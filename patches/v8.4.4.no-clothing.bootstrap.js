(()=>{
 const VERSION='8.4.5-NO-CLOTHING-STABLE',REV='845save1';
 window.DEEN_PATCH_V832HF2T=function(html){
  let out=String(html);
  if(out.includes('data-deen-v845-no-clothing'))return{html:out,version:VERSION,applied:0};
  out+=`\n<link rel="stylesheet" href="./patches/v8.4.4.no-clothing.css?v=${REV}" data-deen-v845-no-clothing-css>\n<script src="./patches/v8.4.4.no-clothing.runtime.js?v=${REV}" data-deen-v845-no-clothing><\/script>\n`;
  return{html:out,version:VERSION,applied:1};
 };
 window.DEEN_PATCH_V832HF2U=function(html){return{html:String(html),version:VERSION,applied:0}};
 window.DEEN_V845_BOOTSTRAP={version:VERSION,revision:REV};
})();
