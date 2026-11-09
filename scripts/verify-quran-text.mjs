// Fails when any Quran text in the pack is not what was checked: a changed letter, mark, missing or extra ayah.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {skeleton,withoutBismillah} from './quran-skeleton.mjs';
const MUSHAF={qadr:97,takathur:102,humaza:104,duha:93,adiyat:100,qaria:101,shams:91,tariq:86,ala:87,alaq:96,balad:90,layl:92};
const sha=t=>createHash('sha256').update(t).digest('hex').slice(0,16);
const win={};vm.runInNewContext(readFileSync('assets/quran/surah-pack.js','utf8'),{window:win});
const check=JSON.parse(readFileSync('assets/quran/text-check.json','utf8')).surahs,bad=[];let n=0;
for(const s of win.DEEN_SURAH_PACK.surahs){
 const want=check[s.id];
 if(!want||want.length!==s.ayahs.length){bad.push(s.id+': ayah count');continue}
 s.ayahs.forEach((a,i)=>{
  n++;
  if(sha(a.ar)!==want[i][0])bad.push(s.id+':'+a.n+' exact text changed');
  else if(sha(skeleton(withoutBismillah(MUSHAF[s.id],a.ar)))!==want[i][1])bad.push(s.id+':'+a.n+' letters differ');
 });
}
for(const id of Object.keys(check))if(!win.DEEN_SURAH_PACK.surahs.some(s=>s.id===id))bad.push(id+': missing from the pack');
if(bad.length){console.error('Quran text check FAILED\n'+bad.join('\n'));process.exit(1)}
console.log('Quran text check passed:',n,'ayahs in',Object.keys(check).length,'surahs');
