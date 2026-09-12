(()=>{
 const VERSION='8.3.2-HF2A';
 const tags='\n<link rel="stylesheet" href="./patches/v8.3.1.css?v=832hf2a3" data-deen-hf2-v831-css>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=832hf2a3" data-deen-hf2-css>\n<script src="./patches/v8.3.2.hf2a.bootstrap.js?v=832hf2a3" data-deen-hf2-bootstrap><\/script>\n';
 window.DEEN_PATCH_V832HF2=function(html){let out=String(html);if(out.includes('data-deen-hf2-bootstrap'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
