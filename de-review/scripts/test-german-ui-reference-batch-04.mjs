/* German UI remediation batch 04: exact reference-key mapping, 8 dictionaries,
 * term review holds and release embargo remain intact.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const english=read('assets/i18n/english-ui.draft.json').translations;
const original=[
 'assets/i18n/german-ui.staging.json',
 'assets/i18n/german-ui.lesson-flow.staging.json',
 'assets/i18n/german-ui.premium-shop.staging.json',
 'assets/i18n/german-ui.quran-controls.staging.json'
];
const map=new Map();
for(const p of original){
 const layer=read(p);
 for(const [key,value] of Object.entries(layer.translations)){
  if(map.has(key))assert.equal(map.get(key),value,'Conflicting prior German UI key: '+key);
  map.set(key,value);
 }
}
assert.equal(map.size,592);
const enKeys=Object.keys(english);
assert.equal(enKeys.length,1087);
const gaps=enKeys.filter(k=>!map.has(k));
assert.equal(gaps.length,850);
const stages=[1,2,3,4].map(i=>read('assets/i18n/german-ui.reference-batch-'+String(i).padStart(2,'0')+'.staging.json'));
for(let i=0;i<stages.length;i++){
 const stage=stages[i],id=String(i+1).padStart(2,'0');
 assert.equal(stage.locale,'de');
 assert.equal(stage.schema_version,1);
 assert.equal(stage.scope,'ui_reference_remediation_staging');
 assert.equal(stage.batch,id);
 assert.equal(stage.translation_count,120);
 assert.equal(stage.release_ready,false);
 assert.equal(stage.global_qa,'blocked');
 assert.equal(stage.native_reviewer_approved,false);
 assert.equal(stage.verified_by_religious_expert,false);
 assert.equal(stage.rights_reviewed,false);
 const expected=gaps.slice(i*120,(i+1)*120);
 assert.deepEqual(Object.keys(stage.translations),expected,'Batch '+id+' source key order changed');
 for(const [key,value] of Object.entries(stage.translations)){
  assert(Object.hasOwn(english,key),'Unknown original Turkish source key '+key);
  assert(!map.has(key),'Batch overlap or overwrite '+key);
  assert.equal(stage.reference_english[key],english[key],'Mismatched English source-reference value '+key);
  assert(typeof value==='string'&&value.trim()!==''&&value!==key,'Not yet translated into German: '+key);
  assert(!/[\u0600-\u06ff]/u.test(value),'Arabic text may not be replaced by German UI label '+key);
  map.set(key,value);
 }
 for(const k of stage.review_required_keys)assert(Object.hasOwn(stage.translations,k),'Review flag outside batch '+id+': '+k);
}
const fourth=stages[3];
assert.equal(fourth.review_required_keys.length,20);
assert(fourth.review_required_keys.includes('Kader ve Kaza'),'Divine decree nuances require review');
assert(fourth.review_required_keys.includes('Şartlar ve Esaslar Ayrımı'),'Articles-versus-pillars distinction requires review');
assert.equal(map.size,1072,'592 base + 4 * 120 must be unique');
assert.equal(enKeys.filter(k=>map.has(k)).length,717);
assert.equal(enKeys.filter(k=>!map.has(k)).length,370);
assert.equal(enKeys.filter(k=>map.has(k)).length+370,1087);
const manifest=read('assets/i18n/content-support.json').languages.de;
assert.equal(manifest.question_data,'missing');
assert.equal(manifest.global_qa,'blocked');
assert.equal(manifest.religious_expert_approved,false);
const quran=read('assets/i18n/quran/de/ayah-meanings.staging.json');
assert.equal(quran.ayah_count,90);
assert.equal(quran.release_ready,false);
assert.equal(quran.expert_approved,false);
assert.equal(quran.native_reviewer_approved,false);
assert.equal(quran.rights_reviewed,false);
console.log(JSON.stringify({
 status:'passed',locale:'de',added_batch_04:120,all_new_reference_drafts:480,
 original_reference_gaps:850,remaining_gaps:370,staged_unique_german_ui_labels:1072,
 reference_covered:717,reference_total:1087,review_sensitive_terms_batch_04:20,
 religious_native_rights_review:'pending',ready_to_deploy:false
},null,2));
