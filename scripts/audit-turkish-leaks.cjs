/* Walks the main screens and pop-ups in en/de/fr/ar and lists text that is still Turkish.
   Usage: node scripts/audit-turkish-leaks.cjs [langs]   (default en,de,fr,ar). Prints findings; exit 1 if any (with --strict). */
const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');const types={'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.txt':'text/plain','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(root,p);fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});r.end(b)})});
// Turkish-only letters, or common Turkish words. Proper names (İslam…, Kur’an, Ilnura) are allowed.
const TR_LETTER=/[ğĞşŞıİ]/, TR_WORD=/(?<![\p{L}])(ve|bir|için|ile|değil|veya|ders|günlük|tekrar|görev|ödül|sandık|seri|devam|başla|tamamla|yolculuk|hedef|ayarlar)(?![\p{L}])/iu;
const ALLOW=/^(İslam|Kur[’']an|Ilnura|DEEN|P)$|İslam|Kur[’']an|Ilnura|Diyanet/;
const SCREENS=[
 ['learn',pg=>pg.evaluate(()=>navigate('learnScreen'))],
 ['review',pg=>pg.evaluate(()=>navigate('reviewScreen'))],
 ['quran',pg=>pg.evaluate(()=>navigate('quranScreen'))],
 ['profile',pg=>pg.evaluate(()=>navigate('profileScreen'))],
 ['streak sheet',pg=>pg.evaluate(()=>streakPanel())],
 ['store sheet',pg=>pg.evaluate(()=>storePanel())],
 ['xp sheet',pg=>pg.evaluate(()=>xpPanel())],
 ['goal sheet',pg=>pg.evaluate(()=>goalPanel())],
 ['settings sheet',pg=>pg.evaluate(()=>settingsPanel())],
 ['energy sheet',pg=>pg.evaluate(()=>showEnergy())],
 ['account sheet',pg=>pg.evaluate(()=>window.DEEN_ACCOUNT.open())],
 ['legal sheet',pg=>pg.evaluate(()=>window.DEEN_LEGAL.open())],
 ['premium',pg=>pg.evaluate(()=>{navigate('profileScreen');document.querySelector('[data-deen-hub-action="compare"]')?.click()})],
 ['lesson',pg=>pg.evaluate(()=>{navigate('learnScreen');startMacroStage('U01-M01')})],
];
async function leaks(pg){
 return pg.evaluate(([L,W,A])=>{
  const re1=new RegExp(L),re2=new RegExp(W,'iu'),allow=new RegExp(A);
  const roots=[...document.querySelectorAll('dialog[open],.screen.active,#lesson.active,#v5Sheet[open],.deen-premium-hub,[id*="remium"]')];
  const seen=new Set(),out=[];
  for(const r of (roots.length?roots:[document.body])){
   const w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT);
   while(w.nextNode()){const n=w.currentNode,t=n.data.trim();
    if(!t||t.length<3||seen.has(t))continue;
    const el=n.parentElement;if(!el||el.closest('script,style,[lang="ar"][data-quran],.quran-text,.arabic'))continue;
    const st=getComputedStyle(el);if(st.display==='none'||st.visibility==='hidden')continue;
    if((re1.test(t)||re2.test(t))&&!allow.test(t)){seen.add(t);out.push(t.slice(0,120))}}
  }
  return out;
 },[TR_LETTER.source,TR_WORD.source,ALLOW.source]);
}
(async()=>{await new Promise(r=>srv.listen(0,r));const base='http://localhost:'+srv.address().port+'/';const b=await chromium.launch();
 const langs=(process.argv[2]&&!process.argv[2].startsWith('--')?process.argv[2]:'en,de,fr,ar').split(',');let total=0;
 for(const lang of langs){
  const ctx=await b.newContext({serviceWorkers:'block',viewport:{width:390,height:844}}),pg=await ctx.newPage();pg.on('pageerror',()=>{});
  await pg.addInitScript(l=>{if(sessionStorage.getItem('s'))return;sessionStorage.setItem('s','1');localStorage.setItem('deen_app_language_v1',l);localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,xp:420,name:'T',completed:[],mistakes:[],settings:{},profile:{name:'T',companion:'owl'},currency:80,streak:5,streakMeta:{lastStudyDate:null,currentStreak:5,longestStreak:9,streakFreeze:1,weeklyActivity:{},freezeDates:[]}}))},lang);
  await pg.goto(base,{waitUntil:'load'});await pg.waitForSelector('#v5Return .v680-nba',{timeout:60000});
  if(lang==='de')await pg.waitForFunction(()=>window.DEEN_GERMAN_UI,null,{timeout:30000}).catch(()=>{});
  await pg.waitForTimeout(2500);
  for(const [name,open] of SCREENS){
   try{await pg.evaluate(()=>{try{closeSheet()}catch(_){}try{if(document.getElementById('lesson')?.classList.contains('active'))closeLesson()}catch(_){}});await open(pg);await pg.waitForTimeout(1200);}catch(e){console.log(lang,name,'SKIPPED',String(e.message).slice(0,80));continue}
   const found=await leaks(pg);total+=found.length;
   console.log(lang.padEnd(2),name.padEnd(15),found.length?('LEAKS '+found.length+': '+JSON.stringify(found.slice(0,8))):'clean');
  }
  await ctx.close();
 }
 await b.close();srv.close();console.log('TOTAL leaks',total);if(total&&process.argv.includes('--strict'))process.exit(1);})().catch(e=>{console.error(e);process.exit(1)});
