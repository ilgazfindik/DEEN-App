// Writes assets/quran/text-check.json: for every ayah of the pack, the checksum of the exact text the app holds and the
// checksum of its letters in an independent print (Kemenag, Indonesia). The two prints must agree before anything is written.
//   node scripts/build-text-check.mjs <kemenag quran.json>
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {skeleton,withoutBismillah} from './quran-skeleton.mjs';
const MUSHAF={qadr:97,takathur:102,humaza:104,duha:93,adiyat:100,qaria:101,shams:91,tariq:86,ala:87,alaq:96,balad:90,layl:92};
const sha=t=>createHash('sha256').update(t).digest('hex').slice(0,16);
const win={};vm.runInNewContext(readFileSync('assets/quran/surah-pack.js','utf8'),{window:win});
const other=JSON.parse(readFileSync(process.argv[2],'utf8')),out={};
for(const s of win.DEEN_SURAH_PACK.surahs){
 const n=MUSHAF[s.id],theirs=other[String(n)];
 if(!theirs||theirs.length!==s.ayahs.length)throw new Error(s.id+': ayah count differs');
 out[s.id]=s.ayahs.map((a,i)=>{
  const mine=skeleton(withoutBismillah(n,a.ar)),their=skeleton(withoutBismillah(n,theirs[i].text));
  if(mine!==their)throw new Error(s.id+':'+a.n+' differs from the independent print');
  return [sha(a.ar),sha(mine)];
 });
}
writeFileSync('assets/quran/text-check.json',JSON.stringify({about:'Checksums of the Quran text in surah-pack.js: [exact text, letters]. The letters come from an independent print (Kemenag). node scripts/verify-quran-text.mjs',surahs:out})+'\n');
console.log('wrote assets/quran/text-check.json',Object.keys(out).length,'surahs');
