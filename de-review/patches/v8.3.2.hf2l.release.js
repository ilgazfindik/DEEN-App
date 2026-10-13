(()=>{
 const VERSION='8.3.2-HF2L',REV='832hf2l1';
 const tags=`\n<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2l-v831-css>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2l-responsive>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2k.css?v=${REV}" data-deen-hf2l-body-css>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2l.css?v=${REV}" data-deen-hf2l-css>\n<script>window.__deenV832WearApplied=true;<\/script>\n<script src="./patches/v8.3.2.hf2b.bootstrap.js?v=${REV}" data-deen-hf2l-avatar><\/script>\n<script src="./patches/v8.3.2.hf2k.closet.js?v=${REV}" data-deen-hf2l-closet><\/script>\n<script src="./patches/v8.3.2.hf2l.test.js?v=${REV}" data-deen-hf2l-test><\/script>\n`;
 window.DEEN_PATCH_V832HF2L=function(html){let out=String(html);if(out.includes('data-deen-hf2l-test'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
