/* German UI reference remediation batch 06: source identity, six batches,
 * onboarding copy, and fail-closed religious/native/rights release state.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const dir=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(dir+p,'utf8'));
const reference=read('assets/i18n/english-ui.draft.json').translations;
const originalPaths=[
 'assets/i18n/german-ui.staging.json',
 'assets/i18n/german-ui.lesson-flow.staging.json',
 'assets/i18n/german-ui.premium-shop.staging.json',
 'assets/i18n/german-ui.quran-controls.staging.json'
];
const merged=new Map();
for(const path of originalPaths){
 const pack=read(path);
 for(const [key,value] of Object.entries(pack.translations)){
  if(merged.has(key))assert.equal(merged.get(key),value,'Existing German UI conflict: '+key);
  merged.set(key,value);
 }
}
assert.equal(merged.size,592);
const baseline=Object.keys(reference);
assert.equal(baseline.length,1087);
const originallyMissing=baseline.filter(key=>!merged.has(key));
assert.equal(originallyMissing.length,850);
const batches=[1,2,3,4,5,6].map(n=>read('assets/i18n/german-ui.reference-batch-'+String(n).padStart(2,'0')+'.staging.json'));
for(let i=0;i<batches.length;i++){
 const batch=batches[i],code=String(i+1).padStart(2,'0');
 assert.equal(batch.schema_version,1);
 assert.equal(batch.locale,'de');
 assert.equal(batch.scope,'ui_reference_remediation_staging');
 assert.equal(batch.batch,code);
 assert.equal(batch.translation_count,120);
 assert.equal(batch.release_ready,false);
 assert.equal(batch.global_qa,'blocked');
 assert.equal(batch.verified_by_religious_expert,false);
 assert.equal(batch.native_reviewer_approved,false);
 assert.equal(batch.rights_reviewed,false);
 assert.equal(batch.status,'translation_draft_requires_native_and_subject_expert_review');
 assert.deepEqual(Object.keys(batch.translations),originallyMissing.slice(i*120,(i+1)*120),'Source-key ordering/coverage changed for batch '+code);
 assert.equal(Object.keys(batch.reference_english).length,120);
 assert(Array.isArray(batch.review_required_keys));
 for(const [key,value] of Object.entries(batch.translations)){
  assert(Object.hasOwn(reference,key),'Unrecognized Turkish UI source key: '+key);
  assert(!merged.has(key),'Duplicate/overlapping German UI key: '+key);
  assert.equal(batch.reference_english[key],reference[key],'Reference gloss/source identity changed: '+key);
  assert(typeof value==='string'&&value.trim()&&value!==key,'Empty/untranslated German UI label: '+key);
  assert(!/[\u0600-\u06ff]/u.test(value),'Unexpected Arabic script replacing German UI chrome: '+key);
  merged.set(key,value);
 }
 for(const label of batch.review_required_keys)assert(Object.hasOwn(batch.translations,label),'Unmapped religious review label: '+label);
}
assert.equal(batches[5].review_required_keys.length,20);
assert.equal(batches[5].translations['DEEN’e hoş geldin'],'Willkommen bei DEEN');
assert.equal(batches[5].translations['Sana nasıl hitap edelim?'],'Wie dürfen wir dich nennen?');
assert.equal(batches[5].translations['Yol arkadaşını seç'],'Wähle deinen Lernbegleiter');
assert.equal(batches[5].translations['Yatsı namazı'],'Nachtgebet (ʿIschāʾ)');
assert.equal(merged.size,1312);
assert.equal(baseline.filter(key=>merged.has(key)).length,957);
assert.equal(baseline.filter(key=>!merged.has(key)).length,130);
const German=read('assets/i18n/content-support.json').languages.de;
assert.equal(German.question_data,'missing');
assert.equal(German.global_qa,'blocked');
assert.equal(German.religious_expert_approved,false);
const quran=read('assets/i18n/quran/de/ayah-meanings.staging.json');
assert.equal(quran.ayah_count,90);
assert.equal(quran.release_ready,false);
assert.equal(quran.expert_approved,false);
assert.equal(quran.native_reviewer_approved,false);
assert.equal(quran.rights_reviewed,false);
console.log(JSON.stringify({status:'passed',locale:'de',new_batch:6,
 new_german_ui_drafts:120,total_remediated_reference_keys:720,
 initial_missing_reference_keys:850,remaining_missing_reference_keys:130,
 staged_ui_labels:1312,reference_covered:957,reference_total:1087,
 religious_review_terms:20,production_release:'blocked'},null,2));
