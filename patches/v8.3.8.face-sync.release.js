(()=>{const VERSION='8.3.8-FACE-SYNC-SAFE',REV='839safe1';const tags=`
<link rel="stylesheet" href="./patches/v8.3.3.face-engine.css?v=${REV}" data-deen-v838-facebase-css>
<script src="./patches/v8.3.3.face-engine.runtime.js?v=${REV}" data-deen-v838-facebase-runtime><\/script>
<link rel="stylesheet" href="./patches/v8.3.8.face-sync.css?v=${REV}" data-deen-v838-css>
<script src="./patches/v8.3.8.face-sync.runtime.js?v=${REV}" data-deen-v838-runtime><\/script>
`;window.DEEN_PATCH_V838=function(html){let out=String(html);if(out.includes('data-deen-v838-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}}})();
