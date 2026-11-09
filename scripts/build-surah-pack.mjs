// Builds assets/quran/surah-pack.js: the extra surahs of the surah path, taken verbatim from their sources.
//   node scripts/build-surah-pack.mjs <quran-json checkout>/data <dir with tur-elmalilihamdiya/<chapter>.json>
// Sources (all verbatim, nothing edited):
//   Arabic   Tanzil Uthmani (CC BY 3.0, verbatim + attribution); kept exactly as published, including the bismillah Tanzil puts
//            in front of ayah 1 (the app hides it on screen, the data is untouched)
//   Turkish  Elmalili Hamdi Yazir, 1938 (public domain), from fawazahmed0/quran-api, edition tur-elmalilihamdiya, fetched with
//            curl https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/tur-elmalilihamdiya/<chapter>.json
//            The translation covers some passages as a whole: where neighbouring ayahs carry the same text, the pack records
//            the group ("trGroup") so the app can say so.
//   Arabic   (meaning for Arabic players) Al-Tafsir al-Muyassar, from spa5k/tafsir_api (tafsir/ar-tafsir-muyassar/<chapter>.json).
//            The first ayah of each chapter carries the surah's introduction followed by "[التفسير]"; only the text after that marker is
//            kept, nothing inside it is edited. Ayahs explained together carry the same text; the pack records the group ("msGroup").
//   English  Pickthall, The Meaning of the Glorious Koran, 1930 (public domain)
// The files' checksums are written into the pack so a later rebuild can be compared with this one.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const dataDir=process.argv[2],yazirDir=process.argv[3],muyassarDir=process.argv[4];
if(!dataDir||!yazirDir||!muyassarDir){console.error('usage: node scripts/build-surah-pack.mjs <quran-json>/data <yazir dir> <muyassar dir>');process.exit(1)}
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFileSync(dataDir+'/'+p);
const json=p=>JSON.parse(read(p).toString('utf8'));
const sha=p=>createHash('sha256').update(read(p)).digest('hex');

// Easy to hard: by length, shortest first. id, mushaf number, Turkish name (as the app writes it), level.
const SURAHS=[
 {id:'qadr',number:97,name:'Kadir',level:1},
 {id:'takathur',number:102,name:'Tekâsür',level:1},
 {id:'humaza',number:104,name:'Hümeze',level:2},
 {id:'duha',number:93,name:'Duhâ',level:2},
 {id:'adiyat',number:100,name:'Âdiyât',level:2},
 {id:'qaria',number:101,name:'Kâria',level:2},
 {id:'shams',number:91,name:'Şems',level:2},
 {id:'tariq',number:86,name:'Târık',level:3},
 {id:'ala',number:87,name:'A‘lâ',level:3},
 {id:'alaq',number:96,name:'Alak',level:3},
 {id:'balad',number:90,name:'Beled',level:3},
 {id:'layl',number:92,name:'Leyl',level:3}
];

const arabic=json('tanzil/uthmani.json'),english=json('extra/english_pickthall.json');
const yazirFile=n=>yazirDir+'/tur-elmalilihamdiya/'+n+'.json';
const yazir=n=>JSON.parse(readFileSync(yazirFile(n),'utf8')).chapter;
const muyassarFile=n=>muyassarDir+'/'+n+'.json';
const muyassar=n=>JSON.parse(readFileSync(muyassarFile(n),'utf8')).map(v=>({verse:v.ayah,text:v.text.includes('[التفسير]')?v.text.split('[التفسير]').pop().trim():v.text.trim()}));
const chapters=json('tanzil/chapters.json');
const chapterInfo=Object.fromEntries((Array.isArray(chapters)?chapters:chapters.chapters).map(c=>[c.id,c]));

// Tanzil puts the bismillah in front of ayah 1 of every surah but Fatiha and Tawba. It is kept; check it is really there.
const skeleton=t=>t.normalize('NFKD').replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g,'').replace(/[\u0671\u0622\u0623\u0625]/g,'\u0627');
const BISMILLAH=skeleton('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
const checkBismillah=text=>{if(skeleton(text.split(' ').slice(0,4).join(' '))!==BISMILLAH)throw new Error('ayah 1 does not start with the bismillah: '+text)};

// Recitations: a whole-surah file for each surah, played straight from Wikimedia Commons (as for the first sixteen surahs; not copied
// into the app). Reciter Atcovi; CC0 or CC BY-SA 4.0, credited from new-surahs-credits.json. Per-ayah files are used only for a
// surah whose every ayah has one under assets/quran/audio/<id>/ (none yet: the recordings have no ayah timings).
const credits=JSON.parse(readFileSync(root+'assets/quran/audio/new-surahs-credits.json','utf8'));
const commons=file=>'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(file).replace(/'/g,'%27');
const audioOf=(id,count)=>{
 const c=credits[id];if(!c)return null;
 const files=Array.from({length:count},(_,i)=>'assets/quran/audio/'+id+'/'+id+'_'+(i+1)+'.mp3');
 return {chapter:commons(c.file),ayahs:files.every(f=>existsSync(root+f))?files:null,credit:{reciter:c.author,license:c.license,licenseUrl:c.licenseUrl,source:c.source}};
};
const out=SURAHS.map(s=>{
 const ar=arabic[s.number],tr=yazir(s.number),en=english[s.number],ms=muyassar(s.number);
 const count=chapterInfo[s.number].total_verses;
 if(ar.length!==count||tr.length!==count||en.length!==count||ms.length!==count)throw new Error(s.id+': ayah counts differ between sources');
 const audio=audioOf(s.id,count);
 return {...s,nameAr:chapterInfo[s.number].name,...(audio?{audio:{chapter:audio.chapter,credit:audio.credit}}:{}),ayahs:ar.map((a,i)=>{
  if(a.verse!==i+1||Number(tr[i].verse)!==i+1||en[i].verse!==i+1||ms[i].verse!==i+1||!ms[i].text)throw new Error(s.id+': verse numbering differs at '+(i+1));
  if(i===0)checkBismillah(a.text);
  const text=tr[i].text.trim(),same=tr.map((v,k)=>v.text.trim()===text?k+1:0).filter(Boolean);
  const mt=ms[i].text,msSame=ms.map((v,k)=>v.text===mt?k+1:0).filter(Boolean);
  return {n:i+1,ar:a.text.trim(),tr:text,ms:mt,...(msSame.length>1?{msGroup:[msSame[0],msSame[msSame.length-1]]}:{}),...(same.length>1?{trGroup:[same[0],same[same.length-1]]}:{}),en:en[i].text.trim(),...(audio?.ayahs?{audio:audio.ayahs[i]}:{})};
 })};
});

// The older surahs live elsewhere in the app; for Arabic players only their Muyassar text is added here ("muyassarOlder").
const OLDER={fatiha:1,ikhlas:112,falaq:113,nas:114,kafirun:109,nasr:110,masad:111,fil:105,quraysh:106,maun:107,sharh:94,tin:95,bayyina:98,zilzal:99,kawthar:108,asr:103};
const muyassarOlder=Object.fromEntries(Object.entries(OLDER).map(([id,n])=>{
 const ms=muyassar(n);
 if(ms.some((v,i)=>v.verse!==i+1||!v.text))throw new Error(id+': Muyassar numbering or empty text');
 return [id,ms.map((v,i)=>{const same=ms.map((w,k)=>w.text===v.text?k+1:0).filter(Boolean);return {ms:v.text,...(same.length>1?{msGroup:[same[0],same[same.length-1]]}:{})}})];
}));
const arNames=Object.fromEntries([...Object.entries(OLDER)].map(([id,n])=>[id,chapterInfo[n].name]));
const meta={
 version:1,
 verification:'source-verbatim',          // taken unchanged from licensed sources; not yet reviewed by a scholar
 sources:{
  ar:{provider:'Tanzil Project',edition:'Uthmani (Hafs)',license:'CC BY 3.0, verbatim copies only',url:'https://tanzil.net/docs/text_license',sha256:sha('tanzil/uthmani.json')},
  ms:{provider:'Al-Tafsir al-Muyassar',edition:'التفسير الميسر',url:'https://github.com/spa5k/tafsir_api',dataset:'ar-tafsir-muyassar',sha256:Object.fromEntries([...SURAHS.map(s=>s.number),...Object.values(OLDER)].map(n=>[n,createHash('sha256').update(readFileSync(muyassarFile(n))).digest('hex')]))},
  tr:{provider:'Elmalılı Hamdi Yazır',edition:'Hak Dini Kur’an Dili (1938)',license:'Public domain',url:'https://github.com/fawazahmed0/quran-api',dataset:'tur-elmalilihamdiya',sha256:Object.fromEntries(SURAHS.map(s=>[s.number,createHash('sha256').update(readFileSync(yazirFile(s.number))).digest('hex')]))},
  en:{provider:'Marmaduke Pickthall',edition:'The Meaning of the Glorious Koran (1930)',license:'Public domain',sha256:sha('extra/english_pickthall.json')}
 },
 levels:[{id:1,max:8},{id:2,max:15},{id:3,max:99}]
};

const file='/* Extra surahs for the surah path. Generated by scripts/build-surah-pack.mjs from licensed sources; do not edit by hand. */\n'+
 '(()=>{\n \'use strict\';\n if(window.DEEN_SURAH_PACK)return;\n window.DEEN_SURAH_PACK=Object.freeze('+JSON.stringify({...meta,surahs:out,muyassarOlder,arNames})+');\n})();\n';
writeFileSync(root+'assets/quran/surah-pack.js',file);
console.log('wrote assets/quran/surah-pack.js:',out.length,'surahs,',out.reduce((n,s)=>n+s.ayahs.length,0),'ayahs,',file.length,'bytes');
