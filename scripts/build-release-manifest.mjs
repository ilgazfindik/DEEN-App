// Exact content hashes are embedded in the loader so an old index cannot execute new segments.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const hashes=Array.from({length:67},(_,i)=>createHash('sha256').update(readFileSync(root+'release/v9.9.3-direct/segment-'+String(i).padStart(2,'0')+'.txt')).digest('hex'));
const file=root+'index.html',source=readFileSync(file,'utf8');
const built=source.replace(/\/\* DEEN_HASHES_START \*\/[\s\S]*?\/\* DEEN_HASHES_END \*\//,'/* DEEN_HASHES_START */'+JSON.stringify(hashes)+'/* DEEN_HASHES_END */');
if(process.argv.includes('--check')){if(source!==built)throw Error('Release hashes are stale; run node scripts/build-release-manifest.mjs');console.log('PASS: 67 segment hashes');}else writeFileSync(file,built);
