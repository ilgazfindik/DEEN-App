(()=>{
 const VERSION='8.3.2-HF2I',REV='832hf2i1';
 const tags=`\n<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2i-v831-css>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2i-responsive>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2i.css?v=${REV}" data-deen-hf2i-css>\n<script>window.__deenV832WearApplied=true;<\/script>\n<script src="./patches/v8.3.2.hf2b.bootstrap.js?v=${REV}" data-deen-hf2i-avatar><\/script>\n<script src="./patches/v8.3.2.hf2i.closet.js?v=${REV}" data-deen-hf2i-closet><\/script>\n`;
 window.DEEN_PATCH_V832HF2I=function(html){let out=String(html);if(out.includes('data-deen-hf2i-closet'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
