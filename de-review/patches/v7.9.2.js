(()=>{
 const VERSION='7.9.2';
 const tags='\n<link rel="stylesheet" href="./patches/v7.9.2.css?v=792" data-deen-v792>\n<script src="./patches/v7.9.2.runtime.js?v=792" data-deen-v792><\/script>\n';
 window.DEEN_PATCH_V792=function(html){let out=String(html);if(out.includes('data-deen-v792'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
