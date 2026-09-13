(()=>{
 const VERSION='8.3.4-HQ-COMPOSITE',REV='834hq4';
 const tags=`
<link rel="stylesheet" href="./patches/v8.3.4.hq-composite.css?v=${REV}" data-deen-v834-css>
<script src="./patches/v8.3.4.hq-composite.runtime.js?v=${REV}" data-deen-v834-runtime><\/script>
`;
 window.DEEN_PATCH_V834=function(html){let out=String(html);if(out.includes('data-deen-v834-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
