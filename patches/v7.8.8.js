(()=>{
 const VERSION='7.8.8';
 const tags='\n<link rel="stylesheet" href="./patches/v7.8.8.css?v=788" data-deen-v788>\n<script src="./patches/v7.8.8.runtime.js?v=788" data-deen-v788><\/script>\n';
 window.DEEN_PATCH_V788=function(html){let out=String(html);if(out.includes('data-deen-v788'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
