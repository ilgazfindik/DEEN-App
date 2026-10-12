/* First 120 missing German UI keys: exact source-key identity and staging embargo. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const reference=read('assets/i18n/english-ui.draft.json').translations;
const priorPaths=[
 'assets/i18n/german-ui.staging.json',
 'assets/i18n/german-ui.lesson-flow.staging.json',
 'assets/i18n/german-ui.premium-shop.staging.json',
 'assets/i18n/german-ui.quran-controls.staging.json'
];
const baseKeys=new Set(priorPaths.flatMap(p=>Object.keys(read(p).translations)));
const allSourceKeys=Object.keys(reference);
const oldMissing=allSourceKeys.filter(k=>!baseKeys.has(k));
const batch=read('assets/i18n/german-ui.reference-batch-01.staging.json');
const keys=Object.keys(batch.translations||{});
assert.equal(batch.schema_version,1);
assert.equal(batch.locale,'de');
assert.equal(batch.scope,'ui_reference_remediation_staging');
assert.equal(batch.release_ready,false);
assert.equal(batch.global_qa,'blocked');
assert.equal(batch.verified_by_religious_expert,false);
assert.equal(batch.native_reviewer_approved,false);
assert.equal(batch.rights_reviewed,false);
assert.equal(batch.translation_count,120);
assert.equal(keys.length,120);
assert.equal(new Set(keys).size,120);
assert.equal(oldMissing.length,850,'Baseline changed: update classification before proceeding');
assert.deepEqual(keys,oldMissing.slice(0,120),'Batch 1 must match the 120 earliest previously unfilled source keys without changing order');
assert.equal(batch.review_required_keys.length,15);
for(const key of keys){
 assert(Object.hasOwn(reference,key),'Unrecognized original UI source label '+key);
 assert(!baseKeys.has(key),'New batch unexpectedly overwrites an existing German UI translation '+key);
 assert.equal(batch.reference_english[key],reference[key],'Wrong source label/context '+key);
 const translation=batch.translations[key];
 assert(typeof translation==='string'&&translation.trim()&&translation!==key,'Untranslated or empty German value '+key);
 assert(!/[\u0600-\u06FF]/u.test(translation),'Arabic script is not a German label: '+key);
}
for(const key of batch.review_required_keys)assert(keys.includes(key),'Reviewer exception outside this batch');
const allKeys=new Set([...baseKeys,...keys]);
const missing=allSourceKeys.filter(k=>!allKeys.has(k));
assert.equal(allSourceKeys.length,1087);
assert.equal(missing.length,730);
assert.equal(allSourceKeys.filter(k=>allKeys.has(k)).length,357);
const lang=read('assets/i18n/content-support.json').languages.de;
assert.equal(lang.question_data,'missing');
assert.equal(lang.global_qa,'blocked');
assert.equal(lang.religious_expert_approved,false);
const quran=read('assets/i18n/quran/de/ayah-meanings.staging.json');
assert.equal(quran.ayah_count,90);
assert.equal(quran.release_ready,false);
console.log(JSON.stringify({status:'passed',staging_only:true,batch:1,added:keys.length,
 reference_ui_strings:1087,covered_reference:357,remaining_missing:730,
 source_key_integrity:'matched',review_flags:'all_blocked',religious_exception_terms:15,
 new_meaning_publicly_released:false,live_german_enabled:false},null,2));
