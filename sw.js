/* DEEN opt-in PWA offline shell — release candidate, not German approval.
 * Each recitation is cached only after a real request. Same-origin only.
 * The original SHA-256-pinned loader independently verifies all 67 segments.
 */
'use strict';
const VERSION='9408enfiveuiscreens1-ikhlasdeqa1-pwa12';
const SHELL='deen-pwa-shell-'+VERSION;
const MEDIA='deen-pwa-ayah-'+VERSION;
const VISUAL='deen-pwa-visual-'+VERSION;
const MAX_VISUAL=120;
const scope=new URL(self.registration.scope);
const ROOT=scope.pathname.endsWith('/')?scope.pathname:scope.pathname+'/';
const core=[
 './','./index.html',
 './assets/i18n/locale.js','./assets/i18n/locale.css',
 './assets/i18n/boot.js','./assets/i18n/boot.css',
 './assets/i18n/content.js','./assets/i18n/content-support.json',
 './assets/i18n/english-ui.js','./assets/quran/audio/ayah-audio-manifest.json',
 // The five pieces form the original 73.9 KB onboarding atlas. They must
 // all exist together after an offline reload (not a partial/empty sprite).
 ...Array.from({length:5},(_,i)=>'./release/v9.9.3-direct/assets/onboarding-hq/atlas.part'+i+'.txt'),
 ...['cat','eagle','lion','owl','turtle','wolf'].map(id=>'./assets/companions/'+id+'/'+id+'_avatar.png'),
 './assets/badges/deen-badges-atlas.webp','./assets/combo/companions-sheet.png'
];
const sameScope=url=>url.origin===scope.origin&&url.pathname.startsWith(ROOT);
const isAudio=url=>sameScope(url)&&/^assets\/quran\/audio\/[a-z0-9_-]+\/[a-z0-9_-]+\.mp3$/i
 .test(url.pathname.slice(ROOT.length));
const isAssets=url=>sameScope(url)&&
 (/^assets\/i18n\//.test(url.pathname.slice(ROOT.length))||
  url.pathname.slice(ROOT.length)==='assets/quran/audio/ayah-audio-manifest.json');
const isVisual=url=>sameScope(url)&&
 (/^assets\/(companions|avatar-runtime|clothing-runtime|visual-runtime|badges|combo)\/.+\.(?:png|webp|avif|gif|svg|b64)$/i
   .test(url.pathname.slice(ROOT.length))||
  /^release\/v9\.9\.3-direct\/assets\/onboarding-hq\/atlas\.part[0-4]\.txt$/i
   .test(url.pathname.slice(ROOT.length)));
const isSegments=url=>sameScope(url)&&
 /^release\/v9\.9\.3-direct\/segment-\d{2}\.txt$/.test(url.pathname.slice(ROOT.length));
const canonical=url=>new Request(new URL(url.pathname,scope.origin).href);
const audioMime=response=>String(response.headers.get('content-type')||'').toLowerCase();
const isFullAudio=response=>response?.status===200&&
 (audioMime(response).includes('audio/')||audioMime(response).includes('application/octet-stream'));
function failAudio(){return new Response('Recitation unavailable offline',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}
async function readFullAudio(url){
 const cache=await caches.open(MEDIA);
 const key=canonical(url);
 const saved=await cache.match(key);
 if(saved)return saved;
 // Strip Range and cache-busting query; no third-party audio or redirect cache.
 const result=await fetch(new Request(key.url,{cache:'no-store',redirect:'error'}));
 if(!isFullAudio(result))return result;
 try{await cache.put(key,result.clone())}catch(_){/* Storage quota reached; playback still works. */}
 return result;
}
async function rangeAudio(response,range){
 const data=await response.arrayBuffer();
 const total=data.byteLength;
 const m=/^bytes=(\d*)-(\d*)$/i.exec(String(range||'').trim());
 if(!m||(!m[1]&&!m[2])){
  return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+total,'Accept-Ranges':'bytes'}});
 }
 let start,end;
 if(!m[1]){const suffix=Number(m[2]);start=Math.max(0,total-suffix);end=total-1}
 else{start=Number(m[1]);end=m[2]?Math.min(total-1,Number(m[2])):total-1}
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=total||end<start)
  return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+total,'Accept-Ranges':'bytes'}});
 const body=data.slice(start,end+1);
 return new Response(body,{status:206,headers:{
  'Content-Type':'audio/mpeg','Content-Range':'bytes '+start+'-'+end+'/'+total,
  'Content-Length':String(body.byteLength),'Accept-Ranges':'bytes'
 }});
}
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(SHELL);
  // Fail installation if shell files are absent. No partial offline-ready claim.
  await cache.addAll(core.map(path=>new Request(new URL(path,scope),{cache:'reload'})));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  for(const key of await caches.keys()){
   if(key.startsWith('deen-pwa-')&&key!==SHELL&&key!==MEDIA&&key!==VISUAL)
    await caches.delete(key);
  }
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request, url=new URL(req.url);
 if(req.method!=='GET'||!sameScope(url))return;
 if(isAudio(url)){
  event.respondWith((async()=>{
   try{
    const response=await readFullAudio(url);
    if(!isFullAudio(response))return response;
    return req.headers.has('range')
     ?await rangeAudio(response,req.headers.get('range')):response;
   }catch(_){return failAudio()}
  })());
  return;
 }
 if(req.mode==='navigate'){
  event.respondWith((async()=>{
   const cache=await caches.open(SHELL);
   try{
    const result=await fetch(req);
    if(result.ok&&result.status===200)await cache.put(new URL('./index.html',scope),result.clone()).catch(()=>{});
    return result;
   }catch(_){
    const result=await cache.match(new URL('./index.html',scope));
    return result||Response.error();
   }
  })());
  return;
 }
 if(isVisual(url)){
  event.respondWith((async()=>{
   const cache=await caches.open(VISUAL),key=canonical(url);
   const hit=await cache.match(key);
   if(hit)return hit;
   try{
    const result=await fetch(req);
    if(result.ok&&result.status===200&&result.type!=='opaque'){
     try{
      await cache.put(key,result.clone());
      const keys=await cache.keys();
      if(keys.length>MAX_VISUAL)
       await Promise.all(keys.slice(0,keys.length-MAX_VISUAL).map(k=>cache.delete(k)));
     }catch(_){/* Storage quota: fallback remains online. */}
    }
    return result;
   }catch(_){return Response.error()}
  })());
  return;
 }
 if(isAssets(url)||isSegments(url)){
  event.respondWith((async()=>{
   // Only the existing SHA-256 loader decides if cached segment text is safe.
   // Never substitute unrelated releases or unvalidated German meaning data.
   try{
    const result=await fetch(req);
    if(result.ok&&result.status===200&&isAssets(url)){
     const cache=await caches.open(SHELL);
     await cache.put(canonical(url),result.clone()).catch(()=>{});
    }
    return result;
   }catch(_){
    if(isAssets(url)){
     const cache=await caches.open(SHELL);
     const hit=await cache.match(canonical(url));
     if(hit)return hit;
    }
    if(isSegments(url)){
     const keys=(await caches.keys()).filter(x=>x.startsWith('deen-release-'));
     for(const name of keys){
      const release=await caches.open(name);
      const hit=await release.match(req,{ignoreSearch:true});
      if(hit)return hit;
     }
    }
    return Response.error();
   }
  })());
 }
});
