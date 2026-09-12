(()=>{
 const VERSION='8.3.2-HF2J',REV='832hf2j1';
 const tags=`\n<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2j-v831-css>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2j-responsive>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2i.css?v=${REV}" data-deen-hf2j-css>\n<script>window.__deenV832WearApplied=true;<\/script>\n<script src="./patches/v8.3.2.hf2b.bootstrap.js?v=${REV}" data-deen-hf2j-avatar><\/script>\n<script src="./patches/v8.3.2.hf2j.closet.js?v=${REV}" data-deen-hf2j-closet><\/script>\n`;
 window.DEEN_PATCH_V832HF2J=function(html){let out=String(html);if(out.includes('data-deen-hf2j-closet'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();