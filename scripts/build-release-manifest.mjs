// Exact content hashes are embedded in the loader so an old index cannot execute new segments.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const hashes=Array.from({length:67},(_,i)=>createHash('sha256').update(readFileSync(root+'release/v9.9.3-direct/segment-'+String(i).padStart(2,'0')+'.txt')).digest('hex'));
const file=root+'index.html',source=readFileSync(file,'utf8');
// Names with a folder (design/…) live under assets/, the rest under assets/i18n/ — same rule as loadAsset().
const assets=Object.fromEntries(['locale.js','locale.css','content.js','content-support.json','boot.js','boot.css','auth.js','auth.css','english-ui.js','design/deen-ds.css','design/home.css','design/home.js'].map(name=>[name,createHash('sha256').update(readFileSync(root+'assets/'+(name.includes('/')?name:'i18n/'+name))).digest('hex')]));
// Locale game-UI scripts are pinned inline next to their language branch in the loader.
const pinLocale=(text,lang)=>{const hash=createHash('sha256').update(readFileSync(root+'assets/i18n/'+lang+'/runtime-ui.js')).digest('hex');return text.replace(new RegExp("if\\(actual!=='[0-9a-f]{64}'\\)throw Error\\('"+lang.toUpperCase()+"_UI_INTEGRITY_FAILED'\\)"),"if(actual!=='"+hash+"')throw Error('"+lang.toUpperCase()+"_UI_INTEGRITY_FAILED')")};
const built=pinLocale(pinLocale(source,'fr'),'de').replace(/\/\* DEEN_HASHES_START \*\/[\s\S]*?\/\* DEEN_HASHES_END \*\//,'/* DEEN_HASHES_START */'+JSON.stringify(hashes)+'/* DEEN_HASHES_END */').replace(/\/\* DEEN_ASSET_HASHES_START \*\/[\s\S]*?\/\* DEEN_ASSET_HASHES_END \*\//,'/* DEEN_ASSET_HASHES_START */'+JSON.stringify(assets)+'/* DEEN_ASSET_HASHES_END */');
if(process.argv.includes('--check')){if(source!==built)throw Error('Release hashes are stale; run node scripts/build-release-manifest.mjs');console.log('PASS: 67 segment, 9 startup asset and 2 locale UI hashes');}else writeFileSync(file,built);
