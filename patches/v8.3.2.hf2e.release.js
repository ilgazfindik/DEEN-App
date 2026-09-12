(()=>{
 const VERSION='8.3.2-HF2E',REV='832hf2e6';
 const tags=`\n<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2e-v831-css>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2e-responsive>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2e.css?v=${REV}" data-deen-hf2e-css>\n<script>window.__deenV832WearApplied=true;<\/script>\n<script src="./patches/v8.3.2.hf2b.bootstrap.js?v=${REV}" data-deen-hf2e-avatar><\/script>\n<script src="./patches/v8.3.2.hf2e.closet.atlas.js?v=${REV}" data-deen-hf2e-closet><\/script>\n`;
 window.DEEN_PATCH_V832HF2E=function(html){let out=String(html);if(out.includes('data-deen-hf2e-closet'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
