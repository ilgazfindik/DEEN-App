(()=>{const VERSION='8.3.3-FACE-ENGINE',REV='833fe3';const tags=`
<link rel="stylesheet" href="./patches/v8.3.3.face-engine.css?v=${REV}" data-deen-v833-face-css>
<script src="./patches/v8.3.3.face-engine.runtime.js?v=${REV}" data-deen-v833-face-runtime><\/script>
`;window.DEEN_PATCH_V833FACE=function(html){let out=String(html);if(out.includes('data-deen-v833-face-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}}})();
