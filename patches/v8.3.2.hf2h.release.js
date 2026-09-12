(()=>{
 const VERSION='8.3.2-HF2H',REV='832hf2h1';
 const tags=`\n<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2h-v831-css>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2h-responsive>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2h.css?v=${REV}" data-deen-hf2h-css>\n<script>window.__deenV832WearApplied=true;<\/script>\n<script src="./patches/v8.3.2.hf2b.bootstrap.js?v=${REV}" data-deen-hf2h-avatar><\/script>\n<script src="./patches/v8.3.2.hf2h.closet.js?v=${REV}" data-deen-hf2h-closet><\/script>\n`;
 window.DEEN_PATCH_V832HF2H=function(html){let out=String(html);if(out.includes('data-deen-hf2h-closet'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
