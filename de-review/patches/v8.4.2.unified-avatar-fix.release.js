(()=>{const VERSION='8.4.2-UNIFIED-AVATAR-FIX',REV='842fix1';const tags=`
<link rel="stylesheet" href="./patches/v8.4.2.unified-avatar-fix.css?v=${REV}" data-deen-v842-css>
<script src="./patches/v8.4.2.unified-avatar-fix.runtime.js?v=${REV}" data-deen-v842-runtime><\/script>
`;window.DEEN_PATCH_V842=function(html){let out=String(html);if(out.includes('data-deen-v842-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}}})();
