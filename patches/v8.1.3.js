(()=>{
 const VERSION='8.1.3';
 const tags='\n<link rel="stylesheet" href="./patches/v8.1.0.css?v=810" data-deen-v810-css>\n<script src="./patches/v8.1.0.runtime.js?v=810" data-deen-v810-runtime><\/script>\n<link rel="stylesheet" href="./patches/v8.1.2.css?v=812" data-deen-v812-css>\n<script src="./patches/v8.1.2.runtime.js?v=812" data-deen-v812-runtime><\/script>\n<link rel="stylesheet" href="./patches/v8.1.3.css?v=813" data-deen-v813-css>\n<script src="./patches/v8.1.3.runtime.js?v=813" data-deen-v813-runtime><\/script>\n';
 window.DEEN_PATCH_V813=function(html){let out=String(html);if(out.includes('data-deen-v813-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
