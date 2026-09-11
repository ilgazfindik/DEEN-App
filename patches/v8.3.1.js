(()=>{
 const VERSION='8.3.1';
 const tags='\n<link rel="stylesheet" href="./patches/v8.3.1.css?v=831" data-deen-v831-css>\n<script src="./patches/v8.3.1.assets.male.js?v=831" data-deen-v831-male><\/script>\n<script src="./patches/v8.3.1.assets.female.js?v=831" data-deen-v831-female><\/script>\n<script src="./patches/v8.3.1.runtime.js?v=831" data-deen-v831-runtime><\/script>\n';
 window.DEEN_PATCH_V831=function(html){let out=String(html);if(out.includes('data-deen-v831-runtime'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
