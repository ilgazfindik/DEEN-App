(()=>{
 const VERSION='8.2.0';
 const tags='\n<link rel="stylesheet" href="./patches/v8.2.0.css?v=820" data-deen-v820-css>\n<script src="./patches/v8.2.0.runtime.js?v=820" data-deen-v820-runtime><\/script>\n';
 window.DEEN_PATCH_V820=function(html){let out=String(html);if(out.includes('data-deen-v820-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
