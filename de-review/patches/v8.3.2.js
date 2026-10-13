(()=>{
 const VERSION='8.3.2';
 const core='\n<link rel="stylesheet" href="./patches/v8.3.2.css?v=832" data-deen-v832-css>\n<script src="./patches/v8.3.2.registry.js?v=832" data-deen-v832-registry><\/script>\n<script src="./patches/v8.3.2.runtime.js?v=832" data-deen-v832-runtime><\/script>\n';
 const wear='\n<script src="./patches/v8.3.2.wear.js?v=8321" data-deen-v832-wear><\/script>\n';
 window.DEEN_PATCH_V832=function(html){let out=String(html),applied=0;if(!out.includes('data-deen-v832-runtime')){out+=core;applied++}if(!out.includes('data-deen-v832-wear')){out+=wear;applied++}return{html:out,version:VERSION,applied}};
})();
