/* DEEN offline release shell, version-pinned and SHA-256 verified.
 * A worker activates only after all release segments and loader assets are cached.
 * Stored user progress is never accessed or altered by this service worker.
 */
'use strict';
const scope=self.registration.scope;
const version=new URL(self.location.href).searchParams.get('v');
const cacheName='deen-offline-shell-'+version;
const base=path=>new URL(path,scope).href;
const hex=buffer=>Array.from(new Uint8Array(buffer),n=>n.toString(16).padStart(2,'0')).join('');
const hash=async text=>hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)));
function extract(source,start,end){
 const a=source.indexOf(start);
 if(a<0)throw Error('Missing '+start);
 const b=source.indexOf(end,a+start.length);
 if(b<0)throw Error('Missing '+end);
 return JSON.parse(source.slice(a+start.length,b));
}
async function prepare(){
 if(!version||!/^[a-zA-Z0-9_-]{8,80}$/.test(version))throw Error('Invalid release');
 const shell=await fetch(base('./index.html'),{cache:'no-store'});
 if(!shell.ok)throw Error('Offline shell fetch '+shell.status);
 const html=await shell.text();
 if(!html.includes("const BUILD='"+version+"'"))throw Error('Offline shell release mismatch');
 const assets=extract(html,'/* DEEN_ASSET_HASHES_START */','/* DEEN_ASSET_HASHES_END */');
 const segments=extract(html,'/* DEEN_HASHES_START */','/* DEEN_HASHES_END */');
 if(!Array.isArray(segments)||segments.length!==67||Object.keys(assets).length<30)throw Error('Offline manifest invalid');
 const core=[
  ...segments.map((expected,i)=>({path:'./release/v9.9.3-direct/segment-'+String(i).padStart(2,'0')+'.txt',expected})),
  ...Object.entries(assets).map(([name,expected])=>({path:'./assets/i18n/'+name,expected}))
 ];
 const optional=[
  './assets/i18n/fr/runtime-ui.js',
  './assets/i18n/questions.ar.draft.json',
  './assets/companions/manifest.json',
  './assets/badges/deen-badges-atlas.webp',
  './assets/combo/companions-sheet.png',
  './assets/companions/owl/owl_avatar.png',
  './assets/i18n/questions/ar/runtime/U01.live.json',
  './assets/i18n/questions/en/runtime/U01.live.json',
  './assets/i18n/questions/en/runtime/U01.variants.json',
  ...['ar','en'].flatMap(code=>Array.from({length:15},(_,i)=>'./assets/i18n/questions/'+code+'/units/U'+String(i+1).padStart(2,'0')+'.json'))
 ];
 const cache=await caches.open(cacheName);
 // Stage the complete release; fail closed on a required asset or checksum error.
 await cache.put(base('./index.html'),new Response(html,{status:200,headers:{'Content-Type':'text/html; charset=utf-8'}}));
 const todo=[...core,...optional.map(path=>({path,expected:null}))];
 let cursor=0;
 await Promise.all(Array.from({length:8},async()=>{
  while(cursor<todo.length){
   const item=todo[cursor++],url=base(item.path);
   const res=await fetch(url,{cache:'no-store'});
   if(!res.ok)throw Error('Missing offline resource: '+item.path+' HTTP '+res.status);
   if(item.expected){
    const body=await res.text();
    if(await hash(body)!==item.expected)throw Error('Offline asset checksum failed: '+item.path);
    await cache.put(url,new Response(body,{status:200,headers:{'Content-Type':res.headers.get('Content-Type')||'text/plain; charset=utf-8'}}));
   }else{
    // Preserve original bytes for optional JSON, images and graphics.
    await cache.put(url,res.clone());
   }
  }
 }));
}
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{await prepare();await self.skipWaiting()})());
});
self.addEventListener('activate',event=>{
 event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(scope))return;
 event.respondWith((async()=>{
  const cache=await caches.open(cacheName);
  if(request.mode==='navigate'){
   try{const online=await fetch(request);if(online.ok)return online}catch(_){}
   return await cache.match(base('./index.html'))||
    new Response('Offline assets not ready',{status:503,headers:{'Content-Type':'text/plain'}});
  }
  const cached=await cache.match(new URL(url.pathname,url.origin).href);
  if(cached)return cached;
  try{
   const response=await fetch(request);
   if(response.ok&&url.pathname.match(/\.(?:js|css|json|html|txt|svg|png|webp)$/i)){
    try{await cache.put(new URL(url.pathname,url.origin).href,response.clone())}catch(_){}
   }
   return response;
  }catch(err){
   return cached||new Response('Offline file unavailable',{status:503,headers:{'Content-Type':'text/plain'}});
  }
 })());
});
