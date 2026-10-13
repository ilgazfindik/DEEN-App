(()=>{
 const VERSION='8.0.2';
 const tags='\n<link rel="stylesheet" href="./patches/v8.0.2.css?v=802" data-deen-v802>\n<script src="./patches/v8.0.2.runtime.js?v=802" data-deen-v802><\/script>\n';
 window.DEEN_PATCH_V802=function(html){let out=String(html);if(out.includes('data-deen-v802'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
