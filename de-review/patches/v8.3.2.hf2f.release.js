(()=>{
 const VERSION='8.3.2-HF2F',REV='832hf2f1';
 const tags=`\n<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2f-v831-css>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2f-responsive>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2f.css?v=${REV}" data-deen-hf2f-css>\n<script>window.__deenV832WearApplied=true;<\/script>\n<script src="./patches/v8.3.2.hf2b.bootstrap.js?v=${REV}" data-deen-hf2f-avatar><\/script>\n<script src="./patches/v8.3.2.hf2f.closet.js?v=${REV}" data-deen-hf2f-closet><\/script>\n`;
 window.DEEN_PATCH_V832HF2F=function(html){let out=String(html);if(out.includes('data-deen-hf2f-closet'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();