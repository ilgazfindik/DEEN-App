(()=>{
 const VERSION='8.3.2-HF2P',REV='832hf2p1';
 const tags=`
<link rel="stylesheet" href="./patches/v8.3.1.css?v=${REV}" data-deen-hf2p-v831-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2.css?v=${REV}" data-deen-hf2p-responsive>
<link rel="stylesheet" href="./patches/v8.3.2.hf2k.css?v=${REV}" data-deen-hf2p-body-css>
<link rel="stylesheet" href="./patches/v8.3.2.hf2p.css?v=${REV}" data-deen-hf2p-head-css>
<script>window.__deenV832WearApplied=true;<\/script>
<script src="./patches/v8.3.2.hf2b.bootstrap.js?v=${REV}" data-deen-hf2p-avatar><\/script>
<script src="./patches/v8.3.2.hf2k.closet.js?v=${REV}" data-deen-hf2p-closet><\/script>
<script src="./patches/v8.3.2.hf2p.head.js?v=${REV}" data-deen-hf2p-head><\/script>
`;
 window.DEEN_PATCH_V832HF2P=function(html){let out=String(html);if(out.includes('data-deen-hf2p-head'))return{html:out,version:VERSION,applied:0};out+=tags;return{html:out,version:VERSION,applied:1}};
})();
