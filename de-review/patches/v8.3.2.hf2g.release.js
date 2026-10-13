(()=>{
 const VERSION='8.3.2-HF2G',REV='832hf2g1';
 const tags=`\n<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2g-v831-css>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2g-responsive>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2g.css?v=${REV}" data-deen-hf2g-css>\n<script>window.__deenV832WearApplied=true;<\/script>\n<script src="./patches/v8.3.2.hf2b.bootstrap.js?v=${REV}" data-deen-hf2g-avatar><\/script>\n<script src="./patches/v8.3.2.hf2g.closet.js?v=${REV}" data-deen-hf2g-closet><\/script>\n`;
 window.DEEN_PATCH_V832HF2G=function(html){let out=String(html);if(out.includes('data-deen-hf2g-closet'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
