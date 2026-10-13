import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {chromium} from 'playwright';
const root=process.cwd(),origin='https://ilgazfindik.github.io/DEEN-App/de-review/';
const released=JSON.parse(readFileSync('de-review/assets/i18n/content-support.json','utf8'));
assert.equal(released.languages.de.question_data,'missing');
assert.equal(released.languages.de.global_qa,'blocked');
assert.equal(released.languages.de.religious_expert_approved,false);
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:390,height:844}});
const failures=[];
page.on('pageerror',error=>failures.push(error.stack||String(error)));
await page.addInitScript(()=>{window.__DEEN_TEST_RAW_STORAGE__=window.localStorage});
await page.route('https://ilgazfindik.github.io/**',async route=>{
 const u=new URL(route.request().url());
 if(!u.pathname.startsWith('/DEEN-App/'))return route.abort();
 let rel=decodeURIComponent(u.pathname.slice('/DEEN-App/'.length));
 if(!rel||rel.endsWith('/'))rel+='index.html';
 if(rel.includes('..'))return route.fulfill({status:403,body:'Forbidden'});
 const disk=resolve(root,rel);
 if(!disk.startsWith(root+'/'))return route.fulfill({status:403,body:'Forbidden'});
 const type=/\.m?js$/.test(disk)?'application/javascript':/\.json$/.test(disk)?'application/json':
  /\.html$/.test(disk)?'text/html':/\.css$/.test(disk)?'text/css':
  /\.txt$/.test(disk)?'text/plain':'application/octet-stream';
 try{return route.fulfill({status:200,contentType:type,body:readFileSync(disk)})}
 catch{return route.fulfill({status:404,body:'Missing '+rel})}
});
try{
 await page.goto(origin,{waitUntil:'domcontentloaded',timeout:120000});
 await page.waitForFunction(()=>window.DEEN_CONTENT_LOCALE&&window.DEEN_APP_LOCALE&&
  window.__DEEN_CONTENT_MANIFEST__?.__deenSyntheticGermanQA===true,null,{timeout:120000});
 await page.waitForFunction(()=>window.DEEN_BOOT &&
  ['onboarding','ready'].includes(document.documentElement.dataset.deenStartup) &&
  document.documentElement.lang==='de',null,{timeout:120000});
 const boot=await page.evaluate(()=>({
  locale:window.DEEN_APP_LOCALE.get(),documentLocale:document.documentElement.lang,
  parts:window.__DEEN_CONTENT_MANIFEST__.languages.de.parts?.length,
  expertApproved:window.__DEEN_CONTENT_MANIFEST__.languages.de.religious_expert_approved,
  reviewIsolated:window.__DEEN_REVIEW_ISOLATED__===true,
  productionPreference:window.__DEEN_TEST_RAW_STORAGE__?.getItem('deen_app_language_v1'),
  reviewPreference:window.localStorage.getItem('deen_app_language_v1'),
  serviceWorkerScope:navigator.serviceWorker?.controller?.scriptURL||null
 }));
 assert.equal(boot.locale,'de');assert.equal(boot.documentLocale,'de');
 assert.equal(boot.parts,114);assert.equal(boot.expertApproved,false);
 assert.equal(boot.reviewIsolated,true);assert.equal(boot.productionPreference,null);
 assert.equal(boot.reviewPreference,'de');
 const content=await page.evaluate(async()=>{
  const success=await window.DEEN_CONTENT_LOCALE.preload('de');
  const base=window.DEEN_CONTENT_LOCALE.inspectBank(window.DEEN_BASE_QUESTIONS||[],'de');
  const active=window.DEEN_CONTENT_LOCALE.inspectBank(QUESTIONS||[],'de');
  return {success,base:{total:base.sourceCount,failed:base.failedIds.length},
   active:{total:active.sourceCount,failed:active.failedIds.length}};
 });
 assert.equal(content.success,true);assert.deepEqual(content.base,{total:1500,failed:0});
 assert.deepEqual(content.active,{total:1484,failed:0});
 await page.waitForFunction(()=>window.DEEN_GERMAN_REVIEW?.audit?.().released===false,
  null,{timeout:90000});
 const review=await page.evaluate(()=>window.DEEN_GERMAN_REVIEW.audit());
 assert(review.scanned>100,'German DOM preview scan was not initialized');
 mkdirSync('qa-artifacts',{recursive:true});
 await page.screenshot({path:'qa-artifacts/german-review-public-preview.png',fullPage:true});
 assert.deepEqual(failures,[],'Unhandled review browser errors');
 console.log(JSON.stringify({status:'passed',scope:'QA_REVIEW_ONLY',noProductionApproval:true,
  productionStorageUntouched:true,boot,content,uiScanned:review.scanned,uiWrites:review.writes},null,2));
}finally{await browser.close()}
