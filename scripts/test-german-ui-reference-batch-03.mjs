/* German UI reference remediation: exact batch 03 keys, spelling, and staging release guards. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const base=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(base+p,'utf8'));
const english=read('assets/i18n/english-ui.draft.json').translations;
const original=[
 'assets/i18n/german-ui.staging.json',
 'assets/i18n/german-ui.lesson-flow.staging.json',
 'assets/i18n/german-ui.premium-shop.staging.json',
 'assets/i18n/german-ui.quran-controls.staging.json'
];
const known=new Map();
for(const path of original)for(const [k,v] of Object.entries(read(path).translations)){
 if(known.has(k))assert.equal(known.get(k),v,'Inconsistent original German UI key: '+k);
 known.set(k,v);
}
assert.equal(known.size,592);
const keys=Object.keys(english);
assert.equal(keys.length,1087);
const originalMissing=keys.filter(k=>!known.has(k));
assert.equal(originalMissing.length,850);
const stages=[1,2,3].map(n=>read('assets/i18n/german-ui.reference-batch-'+String(n).padStart(2,'0')+'.staging.json'));
for(let i=0;i<stages.length;i++){
 const stage=stages[i],part=String(i+1).padStart(2,'0');
 assert.equal(stage.schema_version,1);
 assert.equal(stage.locale,'de');
 assert.equal(stage.scope,'ui_reference_remediation_staging');
 assert.equal(stage.batch,part);
 assert.equal(stage.translation_count,120);
 assert.equal(stage.release_ready,false);
 assert.equal(stage.global_qa,'blocked');
 assert.equal(stage.native_reviewer_approved,false);
 assert.equal(stage.verified_by_religious_expert,false);
 assert.equal(stage.rights_reviewed,false);
 const draft=stage.translations;
 const slice=originalMissing.slice(i*120,(i+1)*120);
 assert.deepEqual(Object.keys(draft),slice,'Source-key order/coverage mismatch in batch '+part);
 assert.equal(Object.keys(draft).length,120);
 for(const [key,value] of Object.entries(draft)){
  assert(!known.has(key),'Overlapping key in German UI stages '+key);
  assert(Object.hasOwn(english,key),'Noncanonical Turkish source string '+key);
  assert.equal(stage.reference_english[key],english[key],'Incorrect English comparative meaning for '+key);
  assert(typeof value==='string'&&value.trim()&&value!==key,'Turkish placeholder or empty German text: '+key);
  assert(!/[\u0600-\u06ff]/u.test(value),'Unexpected Arabic script within German UI label '+key);
  known.set(key,value);
 }
 assert(Array.isArray(stage.review_required_keys));
 for(const key of stage.review_required_keys)assert(Object.hasOwn(draft,key),'Review label missing '+key);
}
const third=stages[2];
assert.equal(third.review_required_keys.length,21);
assert.equal(third.reference_english['Şehadetin Türkçe anlamı'],'The English meaning of the Shahada');
assert.equal(third.translations['Şehadetin Türkçe anlamı'],'Die türkische Bedeutung der Schahāda');
assert(third.review_required_keys.includes('Şehadetin Türkçe anlamı'),'Conflicting Turkish/English source semantic must be flagged');
assert.equal(third.reference_english['Türkçe anlam sıralama'],'Ordering the English meaning');
assert.equal(third.translations['Türkçe anlam sıralama'],'Die türkische Bedeutung richtig anordnen');
assert(third.review_required_keys.includes('Türkçe anlam sıralama'),'Second Turkish/English source discrepancy must be flagged');
assert.equal(known.size,952);
assert.equal(keys.filter(k=>known.has(k)).length,597);
assert.equal(keys.filter(k=>!known.has(k)).length,490);
const de=read('assets/i18n/content-support.json').languages.de;
assert.equal(de.question_data,'missing');
assert.equal(de.global_qa,'blocked');
assert.equal(de.religious_expert_approved,false);
const quran=read('assets/i18n/quran/de/ayah-meanings.staging.json');
assert.equal(quran.ayah_count,90);
assert.equal(quran.release_ready,false);
console.log(JSON.stringify({status:'passed',staging_only:true,new_batch:3,new_translations:120,
 completed_original_missing:360,initial_reference_gaps:850,remaining_reference_gaps:490,
 german_staged_ui_unique:952,english_reference_total:1087,english_reference_covered:597,
 expert_native_review_terms:21,turkish_english_source_discrepancies_flagged:2,public_release:'blocked'},null,2));
