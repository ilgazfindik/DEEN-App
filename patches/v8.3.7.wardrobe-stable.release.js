(()=>{const VERSION='8.3.7-WARDROBE-STABLE',REV='837stable1';const tags=`
<link rel="stylesheet" href="./patches/v8.3.7.wardrobe-stable.css?v=${REV}" data-deen-v837-css>
<script src="./patches/v8.3.7.wardrobe-stable.runtime.js?v=${REV}" data-deen-v837-runtime><\/script>
`;window.DEEN_PATCH_V837=function(html){let out=String(html);if(out.includes('data-deen-v837-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}}})();
