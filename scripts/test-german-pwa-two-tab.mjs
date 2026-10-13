/*
 * REAL Chromium service-worker upgrade across TWO open browser tabs.
 * This runs the checked-in sw.js as B and the SAME real worker with only the
 * version label changed as A, on a disposable 127.0.0.1 origin.
 * No production publish, no approval changes, no fake Quran meanings.
 */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';

const actual=readFileSync('sw.js','utf8');
const versionB='9408enfiveuiscreens1-ikhlasdeqa1-pwa15';
const versionA='9408enfiveuiscreens1-ikhlasdeqa1-pwa14-upgradefixture';
assert.equal(actual.split("const VERSION='"+versionB+"'").length,2,
 'Expected a unique checked-in service worker version');
const previous=actual.replace("const VERSION='"+versionB+"'",
 "const VERSION='"+versionA+"'");
assert(!actual.includes('self.skipWaiting()')&&!previous.includes('self.skipWaiting()'),
 'This lifecycle must not force takeover of still-open tabs');

const bytes=new Uint8Array(4096).map((_,i)=>i%251);
let served='old',installFetches=0;
const server=createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 res.setHeader('Cache-Control','no-store');
 if(url.pathname==='/DEEN-App/sw.js'){
  res.setHeader('Content-Type','application/javascript; charset=utf-8');
  res.end(served==='old'?previous:actual);return;
 }
 if(url.pathname==='/observer'){
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.end('<!doctype html><title>Off-scope lifecycle observer</title>');return;
 }
 if(url.pathname==='/DEEN-App/'||url.pathname==='/DEEN-App/index.html'){
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.end('<!doctype html><title>Verified previous/current app shell</title>');return;
 }
 if(url.pathname.endsWith('.mp3')){
  res.setHeader('Content-Type','audio/mpeg');
  res.setHeader('Content-Length',String(bytes.length));
  res.end(Buffer.from(bytes));return;
 }
 if(url.pathname.startsWith('/DEEN-App/')){
  installFetches++;
  res.setHeader('Content-Type','text/plain; charset=utf-8');
  res.end('Original first-party asset: '+url.pathname);return;
 }
 res.statusCode=404;res.end('not found');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;
const root='http://127.0.0.1:'+port+'/DEEN-App/';
const report={test:'two-tab real Chromium worker update',originalWorkerVersion:versionB,
 installFetches:0,oldControlledTabs:0,waitingBeforeTabClose:false,
 protectedOldCache:false,preservedVerifiedSegments:false,
 oldCacheRemovedOnlyOnActivation:false,newControl:false,
 offlineReload:false,offlineAudioRange:null};
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const context=await browser.newContext({serviceWorkers:'allow'});
const observer=await context.newPage(); 
let tabA,tabB,tabC;
try{
 await observer.goto('http://127.0.0.1:'+port+'/observer');
 tabA=await context.newPage();
 await tabA.goto(root,{waitUntil:'domcontentloaded'});
 const first=await tabA.evaluate(async()=>{
  const registration=await navigator.serviceWorker.register('./sw.js',
   {scope:'./',updateViaCache:'none'});
  await navigator.serviceWorker.ready;
  if(!navigator.serviceWorker.controller)
   await new Promise((resolve,reject)=>{
    const t=setTimeout(()=>reject(Error('Old worker did not claim first client')),12000);
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
     clearTimeout(t);resolve();
    },{once:true});
   });
  return {scope:registration.scope,controlled:!!navigator.serviceWorker.controller};
 });
 assert(first.controlled);
 tabB=await context.newPage();
 await tabB.goto(root,{waitUntil:'domcontentloaded'});
 await tabB.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await Promise.all([tabA,tabB].map(tab=>tab.evaluate(()=>{
  window.__deenControllerChanges=0;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
   window.__deenControllerChanges++;
  });
 })));
 report.oldControlledTabs=2;
 const protectedVersion=await tabA.evaluate(async({a})=>{
  const trusted=await caches.open('deen-release-verified-sha256');
  await trusted.put(new URL('release/v9.9.3-direct/segment-34.txt',location.href),
   new Response('independently SHA-256 verified original source'));
  const oldMedia=await caches.open('deen-pwa-ayah-'+a);
  await oldMedia.put(new URL('assets/quran/audio/ikhlas/ihlas_1.mp3',location.href),
   new Response(new Uint8Array([1,2,3]),{headers:{'Content-Type':'audio/mpeg'}}));
  return await caches.keys();
 },{a:versionA});
 assert(protectedVersion.includes('deen-pwa-shell-'+versionA));
 assert(protectedVersion.includes('deen-pwa-ayah-'+versionA));
 served='new';
 await tabA.evaluate(async()=>{
  const registration=await navigator.serviceWorker.getRegistration();
  await registration.update();
 });
 await observer.waitForFunction(async({root,b})=>{
  const registration=await navigator.serviceWorker.getRegistration(root);
  const keys=await caches.keys();
  return !!registration?.waiting &&
   registration.waiting.state==='installed' &&
   !!registration.active&&
   keys.includes('deen-pwa-shell-'+b);
 },{root,b:versionB},{timeout:20000});
 const guarded=await observer.evaluate(async({root,a,b})=>{
  const registration=await navigator.serviceWorker.getRegistration(root);
  const cachesNow=await caches.keys();
  return {waiting:registration.waiting?.state,
   active:registration.active?.state,
   oldShell:cachesNow.includes('deen-pwa-shell-'+a),
   oldMedia:cachesNow.includes('deen-pwa-ayah-'+a),
   newShell:cachesNow.includes('deen-pwa-shell-'+b),
   verified:cachesNow.includes('deen-release-verified-sha256')};
 },{root,a:versionA,b:versionB});
 const openTabStates=await Promise.all([tabA,tabB].map(tab=>tab.evaluate(async()=>{
  const reg=await navigator.serviceWorker.getRegistration();
  return {controller:!!navigator.serviceWorker.controller,
   controllerState:navigator.serviceWorker.controller?.state,
   controlsCurrentActive:navigator.serviceWorker.controller===reg.active,
   changes:window.__deenControllerChanges,
   activeState:reg.active?.state,waitingState:reg.waiting?.state};
 })));
 await new Promise(resolve=>setTimeout(resolve,250));
 const stateAfterDelay=await observer.evaluate(async({root,a,b})=>{
  const registration=await navigator.serviceWorker.getRegistration(root);
  const keys=await caches.keys();
  return {waiting:registration.waiting?.state,active:registration.active?.state,
   oldShell:keys.includes('deen-pwa-shell-'+a),
   newShell:keys.includes('deen-pwa-shell-'+b)};
 },{root,a:versionA,b:versionB});
 console.log('PWA_UPGRADE_DIAGNOSTICS '+JSON.stringify({guarded,openTabStates,stateAfterDelay}));
 assert.deepEqual(guarded,{
  waiting:'installed',active:'activated',oldShell:true,oldMedia:true,
  newShell:true,verified:true
 },'Second SW evicted old caches while 2 old tabs remain open');
 report.waitingBeforeTabClose=true;
 report.protectedOldCache=true;
 report.preservedVerifiedSegments=true;
 await tabA.close();tabA=null;
 await observer.waitForFunction(async root=>{
  const r=await navigator.serviceWorker.getRegistration(root);
  return !!r?.waiting;
 },root,{timeout:8000});
 const onlyB=await tabB.evaluate(async()=>{
  const r=await navigator.serviceWorker.getRegistration();
  return {controlled:!!navigator.serviceWorker.controller,waiting:!!r?.waiting};
 });
 assert.deepEqual(onlyB,{controlled:true,waiting:true},
  'Waiting worker replaced the old client before all tabs were closed');
 await tabB.close();tabB=null;
 await observer.waitForFunction(async({root,a,b})=>{
  const registration=await navigator.serviceWorker.getRegistration(root);
  const keys=await caches.keys();
  return registration?.active?.state==='activated'&&!registration.waiting&&
   keys.includes('deen-pwa-shell-'+b)&&
   !keys.includes('deen-pwa-shell-'+a)&&
   !keys.includes('deen-pwa-ayah-'+a);
 },{root,a:versionA,b:versionB},{timeout:20000});
 report.oldCacheRemovedOnlyOnActivation=true;
 const releasePreserved=await observer.evaluate(async()=>{
  const cache=await caches.open('deen-release-verified-sha256');
  const source=await cache.match('http://127.0.0.1:'+location.port+
   '/DEEN-App/release/v9.9.3-direct/segment-34.txt');
  return source?await source.text():null;
 });
 assert.equal(releasePreserved,'independently SHA-256 verified original source');
 tabC=await context.newPage();
 await tabC.goto(root,{waitUntil:'domcontentloaded'});
 await tabC.waitForFunction(()=>!!navigator.serviceWorker.controller);
 const full=await tabC.evaluate(async()=>{
  const result=await fetch('assets/quran/audio/ikhlas/ihlas_1.mp3',{cache:'no-store'});
  const bytes=await result.arrayBuffer();
  return {status:result.status,bytes:bytes.byteLength};
 });
 assert.deepEqual(full,{status:200,bytes:4096});
 await context.setOffline(true);
 try{
  const reload=await tabC.reload({waitUntil:'domcontentloaded',timeout:12000});
  assert.equal(reload.status(),200,'New shell failed warm offline reload');
  report.offlineReload=true;
  const range=await tabC.evaluate(async()=>{
   const resp=await fetch('assets/quran/audio/ikhlas/ihlas_1.mp3?offline=1',
    {headers:{Range:'bytes=128-255'}});
   return {status:resp.status,range:resp.headers.get('Content-Range'),
    bytes:(await resp.arrayBuffer()).byteLength};
  });
  assert.deepEqual(range,{status:206,range:'bytes 128-255/4096',bytes:128});
  report.offlineAudioRange=range;
 }finally{await context.setOffline(false);}
 report.newControl=true;
 report.installFetches=installFetches;
 console.log('PWA_TWO_TAB_ACCEPTANCE '+JSON.stringify(report,null,2));
 console.log('PASS real two-tab waiting update, safe activation and offline audio');
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
