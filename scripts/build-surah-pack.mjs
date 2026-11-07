// Builds assets/quran/surah-pack.js: the extra surahs of the surah path, taken verbatim from their sources.
//   node scripts/build-surah-pack.mjs <quran-json checkout>/data
// Sources (all verbatim, nothing edited, only the Tanzil bismillah prefix on ayah 1 is cut off):
//   Arabic   Tanzil Uthmani (CC BY 3.0, verbatim + attribution)
//   Turkish  Ali Özek ve ark., QuranEnc turkish_shahin v1.0.0 (re-publication with credit and version number)
//   English  Pickthall, The Meaning of the Glorious Koran, 1930 (public domain)
// The files' checksums are written into the pack so a later rebuild can be compared with this one.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const dataDir=process.argv[2];
if(!dataDir){console.error('usage: node scripts/build-surah-pack.mjs <quran-json>/data');process.exit(1)}
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

const arabic=json('tanzil/uthmani.json'),turkish=json('quranenc/turkish_shahin.json'),english=json('extra/english_pickthall.json');
const chapters=json('tanzil/chapters.json');
const chapterInfo=Object.fromEntries((Array.isArray(chapters)?chapters:chapters.chapters).map(c=>[c.id,c]));

// Tanzil puts the bismillah in front of ayah 1 of every surah but Fatiha and Tawba. Drop exactly those four words,
// after checking they really are the bismillah (letters only, marks removed).
const skeleton=t=>t.normalize('NFKD').replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g,'').replace(/[ٱآأإ]/g,'ا');
const BISMILLAH=skeleton('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
function stripBismillah(text){
 const words=text.split(' ');
 if(skeleton(words.slice(0,4).join(' '))!==BISMILLAH)throw new Error('ayah 1 does not start with the bismillah: '+text);
 return words.slice(4).join(' ');
}

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
 const ar=arabic[s.number],tr=turkish[s.number],en=english[s.number];
 const count=chapterInfo[s.number].total_verses;
 if(ar.length!==count||tr.length!==count||en.length!==count)throw new Error(s.id+': ayah counts differ between sources');
 const audio=audioOf(s.id,count);
 return {...s,nameAr:chapterInfo[s.number].name,...(audio?{audio:{chapter:audio.chapter,credit:audio.credit}}:{}),ayahs:ar.map((a,i)=>{
  if(a.verse!==i+1||tr[i].verse!==i+1||en[i].verse!==i+1)throw new Error(s.id+': verse numbering differs at '+(i+1));
  return {n:i+1,ar:(i===0?stripBismillah(a.text):a.text).trim(),tr:tr[i].text.trim(),en:en[i].text.trim(),...(audio?.ayahs?{audio:audio.ayahs[i]}:{})};
 })};
});

const meta={
 version:1,
 verification:'source-verbatim',          // taken unchanged from licensed sources; not yet reviewed by a scholar
 sources:{
  ar:{provider:'Tanzil Project',edition:'Uthmani (Hafs)',license:'CC BY 3.0, verbatim copies only',url:'https://tanzil.net/docs/text_license',sha256:sha('tanzil/uthmani.json')},
  tr:{provider:'QuranEnc.com',edition:'Ali Özek ve ark. (turkish_shahin)',version:'1.0.0',license:'QuranEnc re-publication terms: unmodified, credited, version stated',url:'https://quranenc.com/en/browse/turkish_shahin',sha256:sha('quranenc/turkish_shahin.json')},
  en:{provider:'Marmaduke Pickthall',edition:'The Meaning of the Glorious Koran (1930)',license:'Public domain',sha256:sha('extra/english_pickthall.json')}
 },
 levels:[{id:1,max:8},{id:2,max:15},{id:3,max:99}]
};

const file='/* Extra surahs for the surah path. Generated by scripts/build-surah-pack.mjs from licensed sources; do not edit by hand. */\n'+
 '(()=>{\n \'use strict\';\n if(window.DEEN_SURAH_PACK)return;\n window.DEEN_SURAH_PACK=Object.freeze('+JSON.stringify({...meta,surahs:out})+');\n})();\n';
writeFileSync(root+'assets/quran/surah-pack.js',file);
console.log('wrote assets/quran/surah-pack.js:',out.length,'surahs,',out.reduce((n,s)=>n+s.ayahs.length,0),'ayahs,',file.length,'bytes');
