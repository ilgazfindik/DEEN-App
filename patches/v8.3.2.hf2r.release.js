(()=>{
 const VERSION='8.3.2-HF2R',REV='832hf2r1';
 const tags=`
<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2r-v831-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2r-responsive>
<link rel="stylesheet" href="./patches/v8.3.2.hf2k.css?v=${REV}" data-deen-hf2r-body-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2r.css?v=${REV}" data-deen-hf2r-head-css>
<script>window.__deenV832WearApplied=true;<\/script>
<script src="./patches/v8.3.2.hf2b.bootstrap.js?v=${REV}" data-deen-hf2r-avatar><\/script>
<script src="./patches/v8.3.2.hf2k.closet.js?v=${REV}" data-deen-hf2r-closet><\/script>
<script src="./patches/v8.3.2.hf2r.head.js?v=${REV}" data-deen-hf2r-head><\/script>
`;
 window.DEEN_PATCH_V832HF2R=function(html){let out=String(html);if(out.includes('data-deen-hf2r-head'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
