(()=>{
 const VERSION='8.3.2-HF2U',REV='832hf2u1';
 const tags=`
<link rel="stylesheet" href="./patches/v8.3.2.hf2u.css?v=${REV}" data-deen-hf2u-css>
<script src="./patches/v8.3.2.hf2u.runtime.js?v=${REV}" data-deen-hf2u-runtime><\/script>
`;
 window.DEEN_PATCH_V832HF2U=function(html){let out=String(html);if(out.includes('data-deen-hf2u-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
