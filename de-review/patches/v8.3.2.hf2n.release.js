(()=>{
 const VERSION='8.3.2-HF2N',REV='832hf2n1';
 const tags=`
<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2n-v831-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2n-responsive>
<link rel="stylesheet" href="./patches/v8.3.2.hf2k.css?v=${REV}" data-deen-hf2n-body-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2n.css?v=${REV}" data-deen-hf2n-head-css>
<script>window.__deenV832WearApplied=true;<\/script>
<script src="./patches/v8.3.2.hf2b.bootstrap.js?v=${REV}" data-deen-hf2n-avatar><\/script>
<script src="./patches/v8.3.2.hf2k.closet.js?v=${REV}" data-deen-hf2n-closet><\/script>
<script src="./patches/v8.3.2.hf2n.head.js?v=${REV}" data-deen-hf2n-head><\/script>
`;
 window.DEEN_PATCH_V832HF2N=function(html){let out=String(html);if(out.includes('data-deen-hf2n-head'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
