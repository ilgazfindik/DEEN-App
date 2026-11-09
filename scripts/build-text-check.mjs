// Writes assets/quran/text-check.json: for every ayah of the pack, the checksum of the exact text the app holds and the
// checksum of its letters in an independent print (Kemenag, Indonesia). The two prints must agree before anything is written.
//   node scripts/build-text-check.mjs <kemenag quran.json> <tanzil uthmani.json> <legacy.json>
// legacy.json: {surahId:[ayah text as shown in the app]} for the older surahs (scripts/verify-quran-text-app.mjs --dump writes it).
// Those must agree with BOTH independent prints.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {skeleton,withoutBismillah} from './quran-skeleton.mjs';
const LEGACY={fatiha:1,ikhlas:112,falaq:113,nas:114,kafirun:109,nasr:110,masad:111,fil:105,quraysh:106,maun:107,sharh:94,tin:95,bayyina:98,zilzal:99,kawthar:108,asr:103};
const MUSHAF={qadr:97,takathur:102,humaza:104,duha:93,adiyat:100,qaria:101,shams:91,tariq:86,ala:87,alaq:96,balad:90,layl:92};
const sha=t=>createHash('sha256').update(t).digest('hex').slice(0,16);
const win={};vm.runInNewContext(readFileSync('assets/quran/surah-pack.js','utf8'),{window:win});
const other=JSON.parse(readFileSync(process.argv[2],'utf8')),tanzil=JSON.parse(readFileSync(process.argv[3],'utf8')),legacy=JSON.parse(readFileSync(process.argv[4],'utf8')),out={},old={};
for(const s of win.DEEN_SURAH_PACK.surahs){
 const n=MUSHAF[s.id],theirs=other[String(n)];
 if(!theirs||theirs.length!==s.ayahs.length)throw new Error(s.id+': ayah count differs');
 out[s.id]=s.ayahs.map((a,i)=>{
  const mine=skeleton(withoutBismillah(n,a.ar)),their=skeleton(withoutBismillah(n,theirs[i].text));
  if(mine!==their)throw new Error(s.id+':'+a.n+' differs from the independent print');
  return [sha(a.ar),sha(mine)];
 });
}
for(const [id,n] of Object.entries(LEGACY)){
 const mine=legacy[id];
 if(!mine||mine.length!==other[String(n)].length||mine.length!==tanzil[String(n)].length)throw new Error(id+': ayah count differs');
 old[id]=mine.map((a,i)=>{
  const sk=skeleton(withoutBismillah(n,a));
  if(sk!==skeleton(withoutBismillah(n,other[String(n)][i].text))||sk!==skeleton(withoutBismillah(n,tanzil[String(n)][i].text)))throw new Error(id+':'+(i+1)+' differs from an independent print');
  return [sha(a),sha(sk)];
 });
}
writeFileSync('assets/quran/text-check.json',JSON.stringify({about:'Checksums of the Quran text: [exact text, letters]. surahs = the pack (surah-pack.js, checked by verify-quran-text.mjs); legacy = the older surahs as the app shows them (checked in a browser by verify-quran-text-app.mjs). Letters agree with Kemenag (pack) and with Kemenag and Tanzil (legacy).',surahs:out,legacy:old})+'\n');
console.log('wrote assets/quran/text-check.json',Object.keys(out).length,'pack surahs,',Object.keys(old).length,'older surahs');
