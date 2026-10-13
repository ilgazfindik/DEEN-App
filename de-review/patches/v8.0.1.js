(()=>{
 const VERSION='8.0.1';
 const tags='\n<script src="./patches/v8.0.1.runtime.js?v=801" data-deen-v801><\/script>\n';
 window.DEEN_PATCH_V801=function(html){let out=String(html);if(out.includes('data-deen-v801'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
