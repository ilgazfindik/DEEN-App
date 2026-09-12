(()=>{
 const VERSION='8.3.2-HF2O',REV='832hf2o1';
 const tags=`
<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2o-v831-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2o-responsive>
<link rel="stylesheet" href="./patches/v8.3.2.hf2k.css?v=${REV}" data-deen-hf2o-body-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2o.css?v=${REV}" data-deen-hf2o-head-css>
<script>window.__deenV832WearApplied=true;<\/script>
<script src="./patches/v8.3.2.hf2b.bootstrap.js?v=${REV}" data-deen-hf2o-avatar><\/script>
<script src="./patches/v8.3.2.hf2k.closet.js?v=${REV}" data-deen-hf2o-closet><\/script>
<script src="./patches/v8.3.2.hf2o.head.js?v=${REV}" data-deen-hf2o-head><\/script>
`;
 window.DEEN_PATCH_V832HF2O=function(html){let out=String(html);if(out.includes('data-deen-hf2o-head'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
