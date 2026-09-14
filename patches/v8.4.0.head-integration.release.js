(()=>{const VERSION='8.4.0-HEAD-INTEGRATION',REV='840head2';const tags=`
<link rel="stylesheet" href="./patches/v8.4.0.head-integration.css?v=${REV}" data-deen-v840-css>
<script src="./patches/v8.4.0.head-integration.runtime.js?v=${REV}" data-deen-v840-runtime><\/script>
`;window.DEEN_PATCH_V840=function(html){let out=String(html);if(out.includes('data-deen-v840-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}}})();
