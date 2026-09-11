(()=>{
 const VERSION='7.8.9';
 const tags='\n<link rel="stylesheet" href="./patches/v7.8.9.css?v=789" data-deen-v789>\n<script src="./patches/v7.8.9.runtime.js?v=789" data-deen-v789><\/script>\n';
 window.DEEN_PATCH_V789=function(html){let out=String(html);if(out.includes('data-deen-v789'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
