(()=>{
 const VERSION='8.3.4-VISUAL-FIT',REV='834vf1';
 const tags=`\n<link rel="stylesheet" href="./patches/v8.3.4.visual-fit.css?v=${REV}" data-deen-v834vf-css>\n<script>setTimeout(()=>{try{window.DEEN_V833_FACE_ENGINE?.refresh?.()}catch(_){ }},80);window.DEEN_RELEASE_VERSION='${VERSION}';<\/script>\n`;
 window.DEEN_PATCH_V834VF=function(html){let out=String(html);if(out.includes('data-deen-v834vf-css'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
