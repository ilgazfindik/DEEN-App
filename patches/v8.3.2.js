(()=>{
 const VERSION='8.3.2';
 const tags='\n<link rel="stylesheet" href="./patches/v8.3.2.css?v=832" data-deen-v832-css>\n<script src="./patches/v8.3.2.registry.js?v=832" data-deen-v832-registry><\/script>\n<script src="./patches/v8.3.2.runtime.js?v=832" data-deen-v832-runtime><\/script>\n';
 window.DEEN_PATCH_V832=function(html){let out=String(html);if(out.includes('data-deen-v832-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
