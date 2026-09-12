(()=>{
 const VERSION='8.3.2-HF2S',REV='832hf2s1';
 const tags=`
<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2s-v831-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2s-responsive>
<link rel="stylesheet" href="./patches/v8.3.2.hf2k.css?v=${REV}" data-deen-hf2s-body-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2r.css?v=${REV}" data-deen-hf2s-head-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2s.css?v=${REV}" data-deen-hf2s-fit-css>
<script>window.__deenV832WearApplied=true;<\/script>
<script src="./patches/v8.3.2.hf2b.bootstrap.js?v=${REV}" data-deen-hf2s-avatar><\/script>
<script src="./patches/v8.3.2.hf2k.closet.js?v=${REV}" data-deen-hf2s-closet><\/script>
<script src="./patches/v8.3.2.hf2s.runtime.js?v=${REV}" data-deen-hf2s-runtime><\/script>
`;
 window.DEEN_PATCH_V832HF2S=function(html){let out=String(html);if(out.includes('data-deen-hf2s-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
