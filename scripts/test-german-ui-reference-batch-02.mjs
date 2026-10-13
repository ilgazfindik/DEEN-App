/* German UI reference remediation: stage-only batch 02 and cross-batch source matching. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const reference=read('assets/i18n/english-ui.draft.json').translations;
const originalPaths=[
 'assets/i18n/german-ui.staging.json',
 'assets/i18n/german-ui.lesson-flow.staging.json',
 'assets/i18n/german-ui.premium-shop.staging.json',
 'assets/i18n/german-ui.quran-controls.staging.json'
];
const sourceKeys=Object.keys(reference);
const prior=new Map();
for(const path of originalPaths)for(const [key,value] of Object.entries(read(path).translations)){
 if(prior.has(key))assert.equal(prior.get(key),value,'Old dictionary conflict: '+key);
 prior.set(key,value);
}
assert.equal(prior.size,592);
assert.equal(sourceKeys.length,1087);
const initiallyMissing=sourceKeys.filter(key=>!prior.has(key));
assert.equal(initiallyMissing.length,850);
const p1=read('assets/i18n/german-ui.reference-batch-01.staging.json');
const p2=read('assets/i18n/german-ui.reference-batch-02.staging.json');
const first120=initiallyMissing.slice(0,120);
assert.deepEqual(Object.keys(p1.translations),first120,'Batch 01 source keys must not drift');
const next120=initiallyMissing.slice(120,240);
assert.deepEqual(Object.keys(p2.translations),next120,'Batch 02 must continue exactly after batch 01 without gaps');
for(const [n,pack] of [[1,p1],[2,p2]]){
 assert.equal(pack.locale,'de');
 assert.equal(pack.schema_version,1);
 assert.equal(pack.scope,'ui_reference_remediation_staging');
 assert.equal(pack.batch,String(n).padStart(2,'0'));
 assert.equal(pack.translation_count,120);
 assert.equal(Object.keys(pack.translations).length,120);
 assert.equal(pack.release_ready,false);
 assert.equal(pack.global_qa,'blocked');
 assert.equal(pack.native_reviewer_approved,false);
 assert.equal(pack.verified_by_religious_expert,false);
 assert.equal(pack.rights_reviewed,false);
 assert(pack.status.includes('draft'));
 assert(typeof pack.review_note_tr==='string'&&pack.review_note_tr.length>80);
 for(const [key,value] of Object.entries(pack.translations)){
  assert(!prior.has(key),'New German pack overwrites an already translated label '+key);
  assert(Object.hasOwn(reference,key),'Unrecognized Turkish source label '+key);
  assert.equal(pack.reference_english[key],reference[key],'English context/source mismatch '+key);
  assert(typeof value==='string'&&value.trim()&&value!==key,'Empty or untranslated label '+key);
  assert(!/[\u0600-\u06ff]/u.test(value),'Arabic original must not become German chrome label '+key);
  prior.set(key,value);
 }
 for(const key of pack.review_required_keys)assert(Object.hasOwn(pack.translations,key),'Flagged review key not found in batch '+n+': '+key);
}
assert.equal(p2.review_required_keys.length,20);
assert.equal(prior.size,832,'592 original + 240 new distinct labels');
const stillMissing=sourceKeys.filter(key=>!prior.has(key));
assert.equal(stillMissing.length,610);
assert.equal(sourceKeys.filter(key=>prior.has(key)).length,477);
for(const k of next120)assert(!stillMissing.includes(k),'Batch 02 still missing: '+k);
const de=read('assets/i18n/content-support.json').languages.de;
assert.equal(de.question_data,'missing');
assert.equal(de.global_qa,'blocked');
assert.equal(de.religious_expert_approved,false);
assert.equal(read('assets/i18n/quran/de/ayah-meanings.staging.json').release_ready,false);
console.log(JSON.stringify({status:'passed',staging_only:true,new_batch:2,new_translations:120,
 combined_new_translations:240,initial_reference_missing:850,remaining_reference_missing:610,
 german_staged_ui_unique:832,english_reference_total:1087,english_reference_covered:477,
 religious_terms_awaiting_review:p2.review_required_keys.length,live_release:'blocked'},null,2));
