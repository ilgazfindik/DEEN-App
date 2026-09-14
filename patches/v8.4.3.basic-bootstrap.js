(()=>{
 const VERSION='8.4.3-BASIC-WARDROBE',REV='843basic1';
 window.DEEN_PATCH_V832HF2T=function(html){
  let out=String(html);if(out.includes('data-deen-v843-basic-closet'))return{html:out,version:VERSION,applied:0};
  out+=`\n<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}">\n<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}">\n<link rel="stylesheet" href="./patches/v8.3.2.hf2k.css?v=${REV}">\n<link rel="stylesheet" href="./patches/v8.3.2.hf2r.css?v=${REV}">\n<link rel="stylesheet" href="./patches/v8.3.2.hf2s.css?v=${REV}">\n<link rel="stylesheet" href="./patches/v8.3.2.hf2t.css?v=${REV}">\n<script>window.__deenV832WearApplied=true;<\/script>\n<script src="./patches/v8.3.2.hf2k.closet.js?v=${REV}" data-deen-v843-basic-closet><\/script>\n`;
  return{html:out,version:VERSION,applied:1};
 };
 window.DEEN_PATCH_V832HF2U=function(html){
  let out=String(html);if(out.includes('data-deen-v843-basic-runtime'))return{html:out,version:VERSION,applied:0};
  out+=`\n<link rel="stylesheet" href="./patches/v8.3.2.hf2u.css?v=${REV}">\n<link rel="stylesheet" href="./patches/v8.4.3.basic-closet.css?v=${REV}">\n<script src="./patches/v8.3.2.hf2u.runtime.js?v=${REV}" data-deen-v843-basic-runtime><\/script>\n`;
  return{html:out,version:VERSION,applied:1};
 };
 window.DEEN_V843_BASIC_BOOTSTRAP={version:VERSION,revision:REV};
})();