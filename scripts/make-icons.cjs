/* Renders the app icons (the arch and crescent of the opening screen) to PNG with the pre-installed Chromium.
   node scripts/make-icons.cjs  ->  assets/icons/*.png and favicon.svg */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const out=path.join(__dirname,'..','assets','icons');fs.mkdirSync(out,{recursive:true});
// The mark, drawn in a 200 x 304 box (x 0..200, y -44..260) like the opening screen.
const MARK=`<path d="M24 260V112C24 70 64 40 100 4C136 40 176 70 176 112V260Z" fill="url(#door)"/>
<path d="M24 260V112C24 70 64 40 100 4C136 40 176 70 176 112V260" fill="none" stroke="url(#gold)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M100 4V260" stroke="#d9aa4b" stroke-width="1.6" opacity=".55"/>
<path d="M108 -36.86A16 16 0 1 0 108 -9.14A14.5 14.5 0 1 1 108 -36.86Z" fill="#ffe29a" transform="translate(0,-4) scale(1.15) translate(-13,-1)"/>`;
// scale = share of the canvas height used by the mark (smaller for the maskable icon, whose edges the system crops).
function svg(size,scale,rounded){
 const h=304*scale*size/304,k=h/304,w=200*k;
 const x=(size-w)/2,y=(size-h)/2+44*k;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<defs>
<radialGradient id="bg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#17504c"/><stop offset="1" stop-color="#03131b"/></radialGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffeaa8"/><stop offset="1" stop-color="#c8922e"/></linearGradient>
<radialGradient id="door" cx="50%" cy="85%" r="80%"><stop offset="0" stop-color="#e8b955" stop-opacity=".85"/><stop offset=".6" stop-color="#14525a"/><stop offset="1" stop-color="#0a3340"/></radialGradient>
</defs>
<rect width="${size}" height="${size}" ${rounded?`rx="${size*0.22}"`:''} fill="url(#bg)"/>
<g transform="translate(${x} ${y}) scale(${k})">${MARK}</g>
</svg>`;
}
(async()=>{
 const b=await chromium.launch();const page=await b.newPage();
 const jobs=[['icon-512.png',512,.74,false],['icon-192.png',192,.74,false],['icon-maskable-512.png',512,.56,false],['apple-touch-icon.png',180,.74,false],['favicon-32.png',32,.8,true],['favicon-48.png',48,.8,true]];
 for(const [name,size,scale,rounded] of jobs){
  await page.setViewportSize({width:size,height:size});
  await page.setContent('<style>html,body{margin:0;background:transparent}</style>'+svg(size,scale,rounded));
  await page.screenshot({path:path.join(out,name),omitBackground:true});console.log('wrote',name);
 }
 fs.writeFileSync(path.join(out,'favicon.svg'),svg(64,.8,true));
 await b.close();
})();
