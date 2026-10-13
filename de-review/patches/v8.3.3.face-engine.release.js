(()=>{const VERSION='8.3.3-FACE-COMPAT',REV='833fe4perf';const tags=`
<link rel="stylesheet" href="./patches/v8.3.3.face-engine.css?v=${REV}" data-deen-v833-face-css>
<script data-deen-v833-face-compat>window.DEEN_V833_FACE_ENGINE={version:'${VERSION}',refresh:()=>false,check:()=>({version:'${VERSION}',disabled:true,reason:'HQ renderer active'})};<\/script>
`;window.DEEN_PATCH_V833FACE=function(html){let out=String(html);if(out.includes('data-deen-v833-face-compat'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}}})();
