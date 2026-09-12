(()=>{
 const VERSION='8.3.2-HF2K',REV='832hf2k1';
 const tags=`\n<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2k-v831-css>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2k-responsive>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2k.css?v=${REV}" data-deen-hf2k-css>\n<script>window.__deenV832WearApplied=true;<\/script>\n<script src="./patches/v8.3.2.hf2b.bootstrap.js?v=${REV}" data-deen-hf2k-avatar><\/script>\n<script src="./patches/v8.3.2.hf2k.closet.js?v=${REV}" data-deen-hf2k-closet><\/script>\n`;
 window.DEEN_PATCH_V832HF2K=function(html){let out=String(html);if(out.includes('data-deen-hf2k-closet'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();