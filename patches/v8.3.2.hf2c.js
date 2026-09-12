(()=>{
 const VERSION='8.3.2-HF2C',REV='832hf2c1';
 const tags='\n<link rel="stylesheet" href="./patches/v8.3.1.css?v='+REV+'" data-deen-hf2-v831-css>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v='+REV+'" data-deen-hf2-css>\n<link rel="stylesheet" href="./patches/v8.3.2.hf2c.css?v='+REV+'" data-deen-hf2c-css>\n<script src="./patches/v8.3.2.hf2b.bootstrap.js?v='+REV+'" data-deen-hf2b-bootstrap><\/script>\n<script src="./patches/v8.3.2.hf2c.wear.js?v='+REV+'" data-deen-hf2c-wear><\/script>\n';
 window.DEEN_PATCH_V832HF2C=function(html){let out=String(html);if(out.includes('data-deen-hf2c-wear'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
