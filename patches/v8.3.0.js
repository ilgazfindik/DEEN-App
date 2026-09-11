(()=>{
 const VERSION='8.3.0';
 const tags='\n<link rel="stylesheet" href="./patches/v8.3.0.css?v=830" data-deen-v830-css>\n<script src="./patches/v8.3.0.runtime.js?v=830" data-deen-v830-runtime><\/script>\n';
 window.DEEN_PATCH_V830=function(html){let out=String(html);if(out.includes('data-deen-v830-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
