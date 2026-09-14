(()=>{const VERSION='8.4.1-UNIFIED-AVATAR',REV='841u1';const tags=`
<link rel="stylesheet" href="./patches/v8.4.1.unified-avatar.css?v=${REV}" data-deen-v841-css>
<script src="./patches/v8.4.1.unified-avatar.runtime.js?v=${REV}" data-deen-v841-runtime><\/script>
`;window.DEEN_PATCH_V841=function(html){let out=String(html);if(out.includes('data-deen-v841-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}}})();