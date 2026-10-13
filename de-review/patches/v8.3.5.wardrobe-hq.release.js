(()=>{const VERSION='8.3.5-WARDROBE-HQ',REV='835hq1';const tags=`
<link rel="stylesheet" href="./patches/v8.3.5.wardrobe-hq.css?v=${REV}" data-deen-v835-css>
<script src="./patches/v8.3.5.wardrobe-hq.runtime.js?v=${REV}" data-deen-v835-runtime><\/script>
`;window.DEEN_PATCH_V835=function(html){let out=String(html);if(out.includes('data-deen-v835-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}}})();
