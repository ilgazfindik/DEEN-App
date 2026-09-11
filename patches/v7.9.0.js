(()=>{
 const VERSION='7.9.0';
 const tags='\n<link rel="stylesheet" href="./patches/v7.9.0.css?v=790" data-deen-v790>\n<script src="./patches/v7.9.0.runtime.js?v=790" data-deen-v790><\/script>\n';
 window.DEEN_PATCH_V790=function(html){let out=String(html);if(out.includes('data-deen-v790'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
