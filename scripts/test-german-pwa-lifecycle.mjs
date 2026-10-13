// Unit-execute the ACTUAL service worker using Node 22 Web APIs and a
// deterministic CacheStorage/fetch/ServiceWorkerGlobalScope mock. No browser
// network, no synthetic Quran meanings, no production release approval.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync('sw.js','utf8');
const prefix='9408enfiveuiscreens1-ikhlasdeqa1-pwa15';
assert(source.includes("const VERSION='"+prefix+"'"),
 'Worker version must match verified app-shell worker revision');
assert(readFileSync('index.html','utf8').includes("'./sw.js?v="+prefix+"'"),
 'Loader must register exactly the worker tested here');
const ROOT='https://example.test/DEEN-App/';
const audio=path=>ROOT+'assets/quran/audio/'+path+'.mp3';
const resourceBytes=new Uint8Array(4096).map((_,i)=>i%256);
const cloneKey=request=>{
 const uri=typeof request==='string'?request:request.url;
 const u=new URL(uri);
 return u.origin+u.pathname;
};
function scenario(config={}){
 const events=new Map(),records=new Map();
 let offline=false,quotaFailures=0,skipWaitingCalls=0,claims=0;
 const failPath=config.failPath||'';
 async function mockFetch(request){
  const url=cloneKey(request);
  if(offline)throw new Error('net::ERR_INTERNET_DISCONNECTED');
  if(failPath&&url.endsWith(failPath))
   return new Response('Unavailable',{status:503});
  if(url.endsWith('.mp3'))
   return new Response(resourceBytes.slice(),{status:200,headers:{'Content-Type':'audio/mpeg'}});
  return new Response('verified source shell '+url,
   {status:200,headers:{'Content-Type':'text/plain'}});
 }
 class Store{
  constructor(name){this.name=name;this.files=new Map();}
  async match(request){const r=this.files.get(cloneKey(request));return r?.clone()}
  async put(request,response){
   if(this.name.startsWith('deen-pwa-ayah-')&&quotaFailures>0){
    quotaFailures--;
    const error=new Error('Storage quota exceeded');
    error.name='QuotaExceededError';
    throw error;
   }
   this.files.set(cloneKey(request),response.clone());
  }
  async keys(){return [...this.files.keys()].map(uri=>new Request(uri))}
  async delete(request){return this.files.delete(cloneKey(request))}
  async addAll(requests){
   for(const request of requests){
    const response=await mockFetch(request);
    if(!response.ok)throw new Error('Failed to precache '+request.url);
    await this.put(request,response);
   }
  }
 }
 const caches={
  async open(name){if(!records.has(name))records.set(name,new Store(name));return records.get(name)},
  async keys(){return [...records.keys()]},
  async delete(name){return records.delete(name)}
 };
 const self={
  registration:{scope:ROOT},
  addEventListener(name,fn){events.set(name,fn)},
  async skipWaiting(){skipWaitingCalls++},
  clients:{async claim(){claims++}}
 };
 vm.runInNewContext(source,{self,caches,fetch:mockFetch,URL,Request,Response,console},
  {filename:'sw.js',timeout:2000});
 async function dispatch(name,request){
  let promise,responded=false;
  const e={
   request,
   waitUntil(task){promise=Promise.resolve(task)},
   respondWith(task){responded=true;promise=Promise.resolve(task)}
  };
  assert(events.has(name),'Worker does not handle '+name);
  events.get(name)(e);
  if(name==='fetch'&&!responded)return null;
  return await promise;
 }
 return {dispatch,caches,records,
  setOffline(value){offline=value},
  setQuotaFailures(value){quotaFailures=value},
  get skipped(){return skipWaitingCalls},get claimed(){return claims}};
}
const shellName='deen-pwa-shell-'+prefix,mediaName='deen-pwa-ayah-'+prefix;
const demo=scenario();
const oldShell=await demo.caches.open('deen-pwa-shell-before-upgrade');
await oldShell.put(ROOT+'index.html',new Response('old verified app'));
const oldMedia=await demo.caches.open('deen-pwa-ayah-before-upgrade');
await oldMedia.put(audio('fatiha/fatiha_1'),new Response('old recitation'));
const trusted=await demo.caches.open('deen-release-verified-sha256');
await trusted.put(ROOT+'release/v9.9.3-direct/segment-34.txt',
 new Response('independently pinned text'));
await demo.dispatch('install');
assert((await demo.caches.keys()).includes(shellName),'New shell not prepared');
assert((await demo.caches.keys()).includes('deen-pwa-shell-before-upgrade'),
 'Install cannot evict the ACTIVE app before activation');
assert.equal(demo.skipped,0,
 'Calling skipWaiting would replace a worker while older tabs are open');
await demo.dispatch('activate');
assert.equal(demo.claimed,1,'New worker did not claim clients after safe activation');
assert(!(await demo.caches.keys()).includes('deen-pwa-shell-before-upgrade'));
assert(!(await demo.caches.keys()).includes('deen-pwa-ayah-before-upgrade'));
assert((await demo.caches.keys()).includes('deen-release-verified-sha256'),
 'Never delete the separately SHA-256 verified release segments');
console.log('PASS install/activate: old app protected until activation, release data retained');

const failed=scenario({failPath:'assets/i18n/boot.css'});
const lastGood=await failed.caches.open('deen-pwa-shell-before-upgrade');
await lastGood.put(ROOT+'index.html',new Response('old app survives'));
await assert.rejects(failed.dispatch('install'),/Failed to precache/);
assert(!(await failed.caches.keys()).includes(shellName),
 'Failed install left a partial offline-ready shell');
assert((await failed.caches.keys()).includes('deen-pwa-shell-before-upgrade'),
 'Failed update deleted a working old shell');
assert.equal((await lastGood.match(ROOT+'index.html')).status,200);
console.log('PASS interrupted install: new shell rolled back; previous version untouched');

const quota=scenario();
await quota.dispatch('install');
await quota.dispatch('activate');
const audCache=await quota.caches.open(mediaName);
const first=audio('fatiha/fatiha_1'),next=audio('ikhlas/ihlas_1');
await audCache.put(first,new Response(resourceBytes,{headers:{'Content-Type':'audio/mpeg'}}));
quota.setQuotaFailures(1);
const full=await quota.dispatch('fetch',new Request(next));
assert.equal(full.status,200,'Physical quota must not stop online MP3 playback');
assert.equal((await full.arrayBuffer()).byteLength,resourceBytes.byteLength);
assert.equal(await audCache.match(first),undefined,
 'Quota retry should evict at most the oldest file');
assert.equal((await audCache.match(next)).status,200,'Quota retry did not save the new MP3');
quota.setOffline(true);
const offlineRange=await quota.dispatch('fetch',
 new Request(next+'?de=1',{headers:{Range:'bytes=100-199'}}));
assert.equal(offlineRange.status,206,'Cached MP3 must satisfy offline range');
assert.equal((await offlineRange.arrayBuffer()).byteLength,100);
assert.equal(offlineRange.headers.get('content-range'),'bytes 100-199/4096');
console.log('PASS recoverable quota: evict one, retry, serve offline 206 byte ranges');

const hardQuota=scenario();
const previous=await hardQuota.caches.open(mediaName);
await previous.put(first,new Response(resourceBytes,{headers:{'Content-Type':'audio/mpeg'}}));
hardQuota.setQuotaFailures(2);
const stillPlayable=await hardQuota.dispatch('fetch',new Request(next));
assert.equal(stillPlayable.status,200,'Two cache quota failures interrupted online audio');
assert.equal((await stillPlayable.arrayBuffer()).byteLength,resourceBytes.byteLength);
assert.equal(await previous.match(next),undefined,
 'A failed persistent write must not claim offline audio was saved');
console.log('PASS unrecoverable quota: online playback continues; no false cache hit');

const outsider=await hardQuota.dispatch('fetch',
 new Request('https://other.example/DEEN-App/assets/quran/audio/ikhlas/ihlas_1.mp3'));
assert.equal(outsider,null,'Third-party recitation should bypass same-origin worker');
const otherScope=await hardQuota.dispatch('fetch',
 new Request('https://example.test/OTHER/assets/quran/audio/ikhlas/ihlas_1.mp3'));
assert.equal(otherScope,null,'Worker intercepted content outside registered scope');
console.log('PASS same-origin scoped Quran asset boundaries');

console.log('RESULT service-worker upgrade and quota lifecycle: ALL TESTS PASSED');
