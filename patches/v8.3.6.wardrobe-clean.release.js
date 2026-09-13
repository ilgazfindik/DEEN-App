(()=>{const VERSION='8.3.6-WARDROBE-CLEAN',REV='836clean1';const tags=`
<link rel="stylesheet" href="./patches/v8.3.6.wardrobe-clean.css?v=${REV}" data-deen-v836-css>
<script src="./patches/v8.3.6.wardrobe-clean.runtime.js?v=${REV}" data-deen-v836-runtime><\/script>
`;window.DEEN_PATCH_V836=function(html){let out=String(html);if(out.includes('data-deen-v836-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}}})();