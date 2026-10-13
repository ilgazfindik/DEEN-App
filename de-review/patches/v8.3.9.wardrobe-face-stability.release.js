(()=>{const VERSION='8.3.9-WARDROBE-FACE-STABILITY',REV='839stable1';const tags=`
<link rel="stylesheet" href="./patches/v8.3.9.wardrobe-face-stability.css?v=${REV}" data-deen-v839-css>
<script src="./patches/v8.3.9.wardrobe-face-stability.runtime.js?v=${REV}" data-deen-v839-runtime><\/script>
`;window.DEEN_PATCH_V839=function(html){let out=String(html);if(out.includes('data-deen-v839-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}}})();
