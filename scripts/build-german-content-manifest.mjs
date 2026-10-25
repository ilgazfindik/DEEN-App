// Writes the German entry of assets/i18n/content-support.json from the German question packs on disk.
// German mirrors the French gameplay gate: playable, but never marked expert/native approved.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const file=root+'assets/i18n/content-support.json';
const support=JSON.parse(readFileSync(file,'utf8'));
const fr=support.languages.fr;
const parts=fr.parts.map(part=>{
 const path=part.path.replace('/questions/fr/','/questions/de/');
 const text=readFileSync(root+path.slice(2),'utf8'),pack=JSON.parse(text);
 if(pack.locale!=='de'||pack.schema_version!==1||pack.expert_approved!==false||pack.verified_by_religious_expert!==false)throw Error('DE_PACK_SCHEMA:'+path);
 const entry={path,count:Object.keys(pack.translations).length};
 if(part.sha256)entry.sha256=createHash('sha256').update(text).digest('hex');
 return entry;
});
const {parts:_,...frGate}=fr;
support.languages.de={...frGate,native_reviewer_approved:false,religious_expert_approved:false,parts};
writeFileSync(file,JSON.stringify(support,null,2)+'\n');
console.log('de parts',parts.length,'versions',parts.reduce((n,p)=>n+p.count,0));
