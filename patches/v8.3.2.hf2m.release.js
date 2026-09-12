(()=>{
 const VERSION='8.3.2-HF2M',REV='832hf2m1';
 const tags=`
<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2m-v831-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2m-responsive>
<link rel="stylesheet" href="./patches/v8.3.2.hf2k.css?v=${REV}" data-deen-hf2m-body-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2m.css?v=${REV}" data-deen-hf2m-head-css>
<script>window.__deenV832WearApplied=true;<\/script>
<script src="./patches/v8.3.2.hf2b.bootstrap.js?v=${REV}" data-deen-hf2m-avatar><\/script>
<script src="./patches/v8.3.2.hf2k.closet.js?v=${REV}" data-deen-hf2m-closet><\/script>
<script src="./patches/v8.3.2.hf2m.head.js?v=${REV}" data-deen-hf2m-head><\/script>
`;
 window.DEEN_PATCH_V832HF2M=function(html){
   let out=String(html);
   if(out.includes('data-deen-hf2m-head'))return{html:out,version:VERSION,applied:0};
   out+=tags;return{html:out,version:VERSION,applied:1}
 };
})();