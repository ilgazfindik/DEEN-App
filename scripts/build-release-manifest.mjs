// Exact content hashes are embedded in the loader so an old index cannot execute new segments.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const hashes=Array.from({length:67},(_,i)=>createHash('sha256').update(readFileSync(root+'release/v9.9.3-direct/segment-'+String(i).padStart(2,'0')+'.txt')).digest('hex'));
const file=root+'index.html',source=readFileSync(file,'utf8');
const assets=Object.fromEntries(['locale.js','locale.css','content.js','content-support.json','boot.js','boot.css','auth.js','auth.css','english-ui.js','premium-offer.js','premium-offer.css','premium-hub.js','premium-hub.css','quran-arabic-paths.js','quran-arabic-paths.css','quran-arabic-letters.js','quran-arabic-letter-audio.js','quran-arabic-questions-v2.js','quran-arabic-questions-pack-a.js','quran-arabic-questions-pack-b.js','quran-arabic-harakat.js','quran-arabic-questions-pack-c.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-checkpoint.js','quran-arabic-remediation.js','quran-arabic-weekly.js','quran-arabic-weekly-goals.js'].map(name=>[name,createHash('sha256').update(readFileSync(root+'assets/i18n/'+name)).digest('hex')]));
const built=source.replace(/\/\* DEEN_HASHES_START \*\/[\s\S]*?\/\* DEEN_HASHES_END \*\//,'/* DEEN_HASHES_START */'+JSON.stringify(hashes)+'/* DEEN_HASHES_END */').replace(/\/\* DEEN_ASSET_HASHES_START \*\/[\s\S]*?\/\* DEEN_ASSET_HASHES_END \*\//,'/* DEEN_ASSET_HASHES_START */'+JSON.stringify(assets)+'/* DEEN_ASSET_HASHES_END */');
if(process.argv.includes('--check')){
 if(source!==built){
  const assetMatch=source.match(/\/\* DEEN_ASSET_HASHES_START \*\/([\s\S]*?)\/\* DEEN_ASSET_HASHES_END \*\//);
  const segMatch=source.match(/\/\* DEEN_HASHES_START \*\/([\s\S]*?)\/\* DEEN_HASHES_END \*\//);
  const priorAssets=assetMatch?JSON.parse(assetMatch[1]):{};
  const priorSegments=segMatch?JSON.parse(segMatch[1]):[];
  const changedAssets=Object.keys(assets).filter(key=>priorAssets[key]!==assets[key]);
  const changedSegments=hashes.map((value,i)=>priorSegments[i]!==value?i:null).filter(i=>i!==null);
  throw Error('Release hashes are stale: assets='+JSON.stringify(changedAssets)+', segments='+JSON.stringify(changedSegments)+'. Run node scripts/build-release-manifest.mjs');
 }
 console.log('PASS: 67 segment and '+Object.keys(assets).length+' startup asset hashes');
}else writeFileSync(file,built);
