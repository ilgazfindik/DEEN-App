(()=>{
 const VERSION='8.1.3';
 const tags='\n<link rel="stylesheet" href="./patches/v8.1.3.css?v=813" data-deen-v813-css>\n<script src="./patches/v8.1.3.runtime.js?v=813" data-deen-v813-runtime><\/script>\n';
 window.DEEN_PATCH_V813=function(html){let out=String(html);if(out.includes('data-deen-v813-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
