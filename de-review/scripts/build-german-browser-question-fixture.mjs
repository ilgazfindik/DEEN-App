/* Bundle only for local CI HTTP serving. Never committed as a German production content pack. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const files=[];
for(let unit=1;unit<=15;unit++)for(let stage=1;stage<=7;stage++)
 files.push('assets/i18n/questions/de/staging/U'+String(unit).padStart(2,'0')+
 '-S'+String(stage).padStart(2,'0')+'.json');
for(let stage=1;stage<=7;stage++)files.push('assets/i18n/questions/de/runtime/staging/U01-S'+String(stage).padStart(2,'0')+'.live.json');
files.push('assets/i18n/questions/de/runtime/staging/U01.variants.json',
 'assets/i18n/questions/de/runtime/staging/U01.legacy-renderer.json');
const packs=files.map(read);
mkdirSync('qa-artifacts/german-browser',{recursive:true});
writeFileSync('qa-artifacts/german-browser/qa-question-packs.json',
 JSON.stringify({schema_version:1,staging_only:true,release_approved:false,packs}));
console.log('Bundled '+packs.length+' source-guarded QA packs; never activate DE in production');
