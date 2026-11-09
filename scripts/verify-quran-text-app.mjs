// Opens the real app in a headless browser and checks the Arabic text of the older surahs against text-check.json.
//   node scripts/verify-quran-text-app.mjs          verify
//   node scripts/verify-quran-text-app.mjs --dump F write the shown texts to F (input of build-text-check.mjs)
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,existsSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {extname,join,normalize} from 'node:path';
import {createRequire} from 'node:module';
import {skeleton,withoutBismillah} from './quran-skeleton.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const LEGACY={fatiha:1,ikhlas:112,falaq:113,nas:114,kafirun:109,nasr:110,masad:111,fil:105,quraysh:106,maun:107,sharh:94,tin:95,bayyina:98,zilzal:99,kawthar:108,asr:103};
const sha=t=>createHash('sha256').update(t).digest('hex').slice(0,16);
const TYPES={'.html':'text/html;charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain;charset=utf-8','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg'};
const root=process.cwd();
const server=createServer((q,r)=>{
 let p=normalize(decodeURIComponent(q.url.split('?')[0])).replace(/^(\.\.[\/\\])+/,'');if(p.endsWith('/'))p+='index.html';
 const f=join(root,p);if(!f.startsWith(root)||!existsSync(f)||!statSync(f).isFile()){r.writeHead(404);r.end();return}
 r.writeHead(200,{'content-type':TYPES[extname(f)]||'application/octet-stream'});r.end(readFileSync(f));
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const port=server.address().port,browser=await chromium.launch();
try{
 const page=await (await browser.newContext()).newPage();
 await page.addInitScript(()=>{localStorage.setItem('deen_app_language_v1','tr');localStorage.setItem('ilnura_splash','off');localStorage.setItem('deen_v4_1_state',JSON.stringify({profile:{name:'A',companion:'owl'},onboarded:true,settings:{sound:false}}))});
 await page.goto('http://127.0.0.1:'+port+'/index.html');
 await page.waitForSelector('.bottomnav',{timeout:90000});await page.waitForFunction(()=>window.DEEN_QURAN_PATH?.items,null,{timeout:30000});
 const shown=await page.evaluate(ids=>Object.fromEntries(ids.map(id=>[id,window.DEEN_QURAN_PATH.items(id,'tr').map(i=>i.glyph)])),Object.keys(LEGACY));
 if(process.argv[2]==='--dump'){writeFileSync(process.argv[3],JSON.stringify(shown));console.log('dumped',Object.keys(shown).length,'surahs');process.exit(0)}
 const want=JSON.parse(readFileSync('assets/quran/text-check.json','utf8')).legacy,bad=[];let n=0;
 for(const [id,chapter] of Object.entries(LEGACY)){
  const w=want[id],got=shown[id];
  if(!w||got.length!==w.length){bad.push(id+': ayah count');continue}
  got.forEach((a,i)=>{n++;if(sha(a)!==w[i][0])bad.push(id+':'+(i+1)+' exact text changed');else if(sha(skeleton(withoutBismillah(chapter,a)))!==w[i][1])bad.push(id+':'+(i+1)+' letters differ')});
 }
 if(bad.length){console.error('Older-surah text check FAILED\n'+bad.join('\n'));process.exit(1)}
 console.log('Older-surah text check passed:',n,'ayahs in',Object.keys(LEGACY).length,'surahs');
}finally{await browser.close();server.close()}
