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
 // Regression fixtures from the five user screenshots: dynamic chrome must
 // localize even after the real page has initialized and mutation observers run.
 const screen=await page.evaluate(()=>{
  const samples=[
   'ADAPTİF TEKRARI BAŞLAT · 7 SORU',
   'Ayet 1 / 7 · Son çalışma: Bugün',
   'ÇALIŞMAYA DEVAM ET',
   'Geçmek için %70 veya üzeri gerekiyor.',
   'ÖĞREN · AŞAMA 1/5',
   '0/3 mini ders',
   'Aynı aşama tamamlanmadan sonraki düğüm açılmaz.',
   'Tägliche Aufgaben 0/3 · Wochenrhythmus 1/5 gün',
   'Çok Kolay Tanışma',
   'öğrenme özeti',
   'HAFIZA PLANI AKTİF',
   'AUFGABENTYP',
   'TEKRAR ÖNCELİĞİ',
   '1 günlük seri',
   'Sonraki seri ödülü: 3 gün',
   'DERS ÖDÜLÜ',
   'Bu mini ders için akıllı tekrar öneriliyor.',
   "Allah'a iman tanımı · %43",
   'Öğüt bütünlük · %45',
   '🔥 1 günlük seri',
   'Sonraki ödül 3 gün',
   '1. KISIM · 1. ÜNİTE · ✓ TAMAMLANDI',
   '1-Tage-Serie'
  ];
  const div=document.createElement('section');
  div.id='de-review-screenshot-fixture';
  div.innerHTML=samples.map(t=>'<p></p>').join('');
  for(const [i,node]of [...div.children].entries())node.textContent=samples[i];
  const arabic=document.createElement('p');arabic.lang='ar';arabic.textContent='بِسْمِ ٱللَّهِ';
  const protectedNode=document.createElement('p');protectedNode.dataset.deenSourceQuestion='1';
  protectedNode.textContent='Eşleşen çiftleri bul';
  div.append(arabic,protectedNode);document.body.append(div);
  const lesson=document.querySelector('#lesson');
  const template=document.createElement('div');template.className='question-frame v1013-match-ref';
  template.innerHTML='<h2 class="v9916-task-title">Eşleşen <span class="v1013-mint">çiftleri</span> bul</h2>'+
   '<div class="v1013-match-subtitle">Doğru kavramları anlamlarıyla eşleştir.</div>';
  lesson?.prepend(template);
  window.DEEN_GERMAN_REVIEW.render();
  const values=[...div.children].slice(0,samples.length).map(n=>n.textContent);
  const result={values,heading:template.querySelector('h2')?.textContent,
   subtitle:template.querySelector('.v1013-match-subtitle')?.textContent,
   arabic:arabic.textContent,protected:protectedNode.textContent};
  template.remove();div.remove();return result;
 });
 assert.equal(screen.heading,'Finde die passenden Paare');
 assert.equal(screen.subtitle,'Ordne die Begriffe den passenden Bedeutungen zu.');
 assert.deepEqual(screen.values,[
  'ADAPTIVE WIEDERHOLUNG STARTEN · 7 FRAGEN',
  'Vers 1 / 7 · Zuletzt geübt: Heute','WEITERLERNEN',
  'Zum Bestehen sind mindestens 70 % erforderlich.',
  'LERNEN · ETAPPE 1/5','0/3 Mini-Lektionen',
  'Der nächste Lernschritt wird erst nach Abschluss dieser Etappe freigeschaltet.',
  'Tagesaufgaben 0/3 · Wochenrhythmus 1/5 Tage',
  'Einfacher Einstieg','Lernübersicht','WIEDERHOLUNGSPLAN AKTIV',
  'AUFGABENTYPEN','WIEDERHOLUNGSPRIORITÄT','1 Tag in Folge',
  'Nächste Serienbelohnung: in 3 Tagen','LEKTIONSBELOHNUNG',
  'Für diese Mini-Lektion empfehlen wir eine gezielte Wiederholung.',
  'Definition des Glaubens an Allah · 43 %',
  'Aufrichtigkeit und Integrität · 45 %',
  '🔥 1 Tag in Folge',
  'Nächste Belohnung: in 3 Tagen',
  'ABSCHNITT 1 · EINHEIT 1 · ✓ ABGESCHLOSSEN',
  '1 Tag in Folge'
 ]);
 assert.equal(screen.arabic,'بِسْمِ ٱللَّهِ');
 assert.equal(screen.protected,'Eşleşen çiftleri bul');

 mkdirSync('qa-artifacts',{recursive:true});
 await page.screenshot({path:'qa-artifacts/german-review-public-preview.png',fullPage:true});
 assert.deepEqual(failures,[],'Unhandled review browser errors');
 console.log(JSON.stringify({status:'passed',scope:'QA_REVIEW_ONLY',noProductionApproval:true,
  productionStorageUntouched:true,boot,content,uiScanned:review.scanned,uiWrites:review.writes},null,2));
}finally{await browser.close()}
