(()=>{
 const VERSION='8.3.2-HF2W',REV='832hf2w1';
 const tags=`
<link rel="stylesheet" href="./patches/v8.3.2.hf2w.css?v=${REV}" data-deen-hf2w-css>
<script src="./patches/v8.3.2.hf2w.runtime.js?v=${REV}" data-deen-hf2w-runtime><\/script>
`;
 window.DEEN_PATCH_V832HF2W=function(html){let out=String(html);if(out.includes('data-deen-hf2w-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
