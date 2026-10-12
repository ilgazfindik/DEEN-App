/*
 * Generate a synthetic DE manifest strictly for the local Chromium acceptance test.
 * NEVER change assets/i18n/content-support.json or claim human approval.
 * All 114 source-guarded staging packs retain their own approval=false flags.
 */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const root='assets/i18n/questions/de/';
const names=[];
for(let u=1;u<=15;u++)for(let s=1;s<=7;s++)
 names.push(root+'staging/U'+String(u).padStart(2,'0')+'-S'+String(s).padStart(2,'0')+'.json');
for(let s=1;s<=7;s++)names.push(root+'runtime/staging/U01-S'+String(s).padStart(2,'0')+'.live.json');
names.push(root+'runtime/staging/U01.variants.json',root+'runtime/staging/U01.legacy-renderer.json');
assert.equal(names.length,114);
const real=read('assets/i18n/content-support.json');
assert.equal(real.languages.de.question_data,'missing');
assert.equal(real.languages.de.global_qa,'blocked');
assert.equal(real.languages.de.religious_expert_approved,false);
assert.equal(real.languages.de.parts,undefined);
let total=0;
const parts=names.map(name=>{
 const raw=readFileSync(name), pack=JSON.parse(raw.toString('utf8'));
 assert.equal(pack.locale,'de');assert.equal(pack.expert_approved,false);
 assert.equal(pack.native_reviewer_approved,false);
 assert.equal(pack.verified_by_religious_expert,false);
 const count=Object.keys(pack.translations||{}).length;total+=count;
 return {path:'./'+name,count,sha256:createHash('sha256').update(raw).digest('hex')};
});
assert.equal(total,1704);
const config={
 schema_version:1,
 qa_only:true,
 source_file:'assets/i18n/content-support.json',
 production_untouched:true,
 actual_german_approved:false,
 synthetic_manifest_values_only:true,
 localhost_required:true,
 parts,
 preview_language_config:{
  entry:'complete',
  question_data:'complete',
  bank:null,
  global_qa:'passed', // SYNTHETIC browser-memory override, never source manifest
  religious_expert_approved:false,
  parts
 }
};
mkdirSync('qa-artifacts/german-browser',{recursive:true});
writeFileSync('qa-artifacts/german-browser/qa-preview-config.json',JSON.stringify(config));
console.log(JSON.stringify({status:'QA_PREVIEW_ONLY',paths:parts.length,authored_versions:total,
 actual_production_german_release:real.languages.de.global_qa,unapproved:true}));
