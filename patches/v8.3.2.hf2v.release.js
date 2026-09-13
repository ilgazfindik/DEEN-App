(()=>{
 const VERSION='8.3.2-HF2V',REV='832hf2v1';
 const tags=`
<link rel="stylesheet" href="./patches/v8.3.2.hf2v.css?v=${REV}" data-deen-hf2v-css>
<script src="./patches/v8.3.2.hf2v.runtime.js?v=${REV}" data-deen-hf2v-runtime><\/script>
`;
 window.DEEN_PATCH_V832HF2V=function(html){let out=String(html);if(out.includes('data-deen-hf2v-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
