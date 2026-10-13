(()=>{
 const VERSION='7.9.1';
 const tags='\n<link rel="stylesheet" href="./patches/v7.9.1.css?v=791" data-deen-v791>\n<script src="./patches/v7.9.1.runtime.js?v=791" data-deen-v791><\/script>\n';
 window.DEEN_PATCH_V791=function(html){let out=String(html);if(out.includes('data-deen-v791'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
