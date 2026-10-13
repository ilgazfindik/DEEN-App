(()=>{
 const VERSION='8.3.2-HF2Q',REV='832hf2q1';
 const tags=`
<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2q-v831-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2q-responsive>
<link rel="stylesheet" href="./patches/v8.3.2.hf2k.css?v=${REV}" data-deen-hf2q-body-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2q.css?v=${REV}" data-deen-hf2q-head-css>
<script>window.__deenV832WearApplied=true;<\/script>
<script src="./patches/v8.3.2.hf2k.closet.js?v=${REV}" data-deen-hf2q-closet><\/script>
<script src="./patches/v8.3.2.hf2q.head.js?v=${REV}" data-deen-hf2q-head><\/script>
`;
 window.DEEN_PATCH_V832HF2Q=function(html){let out=String(html);if(out.includes('data-deen-hf2q-head'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
