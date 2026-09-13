(()=>{
 const VERSION='8.3.6-CLEAN-BASE',REV='836base2';
 const tags=`
<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2t-v831-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2t-responsive>
<link rel="stylesheet" href="./patches/v8.3.2.hf2k.css?v=${REV}" data-deen-hf2t-body-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2r.css?v=${REV}" data-deen-hf2t-head-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2s.css?v=${REV}" data-deen-hf2t-fit-base-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2t.css?v=${REV}" data-deen-hf2t-fit-css>
<script>window.__deenV832WearApplied=true;<\/script>
<script src="./patches/v8.3.2.hf2k.closet.js?v=${REV}" data-deen-hf2t-closet><\/script>
`;
 window.DEEN_PATCH_V832HF2T=function(html){let out=String(html);if(out.includes('data-deen-hf2t-closet'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();