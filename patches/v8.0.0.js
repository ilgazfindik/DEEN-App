(()=>{
 const VERSION='8.0.0';
 const tags='\n<link rel="stylesheet" href="./patches/v8.0.0.css?v=800" data-deen-v800>\n<script src="./patches/v8.0.0.runtime.js?v=800" data-deen-v800><\/script>\n';
 window.DEEN_PATCH_V800=function(html){let out=String(html);if(out.includes('data-deen-v800'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
