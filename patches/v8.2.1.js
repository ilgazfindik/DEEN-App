(()=>{
 const VERSION='8.2.1';
 const tags='\n<link rel="stylesheet" href="./patches/v8.2.1.css?v=821" data-deen-v821-css>\n<script src="./patches/v8.2.1.runtime.js?v=821" data-deen-v821-runtime><\/script>\n';
 window.DEEN_PATCH_V821=function(html){let out=String(html);if(out.includes('data-deen-v821-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
