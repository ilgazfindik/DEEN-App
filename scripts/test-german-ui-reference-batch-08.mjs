/* German UI reference batch 08: close all 850 originally missing baseline
 * keys without unlocking staged, unreviewed language content.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=path=>JSON.parse(readFileSync(root+path,'utf8'));
const baseline=read('assets/i18n/english-ui.draft.json').translations;
const core=[
 'assets/i18n/german-ui.staging.json',
 'assets/i18n/german-ui.lesson-flow.staging.json',
 'assets/i18n/german-ui.premium-shop.staging.json',
 'assets/i18n/german-ui.quran-controls.staging.json'
];
const translations=new Map();
for(const path of core){
 const layer=read(path);
 assert.equal(layer.locale,'de');
 assert.equal(layer.translation_count,Object.keys(layer.translations).length);
 for(const [key,value] of Object.entries(layer.translations)){
  if(translations.has(key))assert.equal(translations.get(key),value,'Conflicting core key: '+key);
  translations.set(key,value);
 }
}
assert.equal(translations.size,592);
const sources=Object.keys(baseline);
assert.equal(sources.length,1087);
const originallyMissing=sources.filter(key=>!translations.has(key));
assert.equal(originallyMissing.length,850);
const counts=[120,120,120,120,120,120,120,10];
const batches=counts.map((_,i)=>read('assets/i18n/german-ui.reference-batch-'+String(i+1).padStart(2,'0')+'.staging.json'));
let consumed=0;
for(const [index,pack] of batches.entries()){
 const n=counts[index],batch=String(index+1).padStart(2,'0');
 assert.equal(pack.schema_version,1);
 assert.equal(pack.locale,'de');
 assert.equal(pack.scope,'ui_reference_remediation_staging');
 assert.equal(pack.source_reference,'assets/i18n/english-ui.draft.json:translations');
 assert.equal(pack.batch,batch);
 assert.equal(pack.translation_count,n);
 for(const flag of ['release_ready','verified_by_religious_expert','native_reviewer_approved','rights_reviewed'])assert.equal(pack[flag],false,'Premature approval '+flag+' in batch '+batch);
 assert.equal(pack.global_qa,'blocked');
 assert.equal(pack.status,'translation_draft_requires_native_and_subject_expert_review');
 const expected=originallyMissing.slice(consumed,consumed+n);
 assert.deepEqual(Object.keys(pack.translations),expected,'Source key identity/order drift in batch '+batch);
 assert.deepEqual(Object.keys(pack.reference_english),expected,'Reference gloss identity/order drift in batch '+batch);
 for(const [key,value] of Object.entries(pack.translations)){
  assert(!translations.has(key),'Duplicate German staging source key: '+key);
  assert.equal(pack.reference_english[key],baseline[key],'English reference has changed: '+key);
  assert(typeof value==='string'&&value.trim()&&value!==key,'Empty/unchanged German draft: '+key);
  assert(!/[\u0600-\u06ff]/u.test(value),'Unexpected Arabic in German UI chrome: '+key);
  if(index===7){
   assert(!/[ıİğĞşŞ]/u.test(value),'Residual Turkish-only character: '+key);
   const before=(baseline[key].match(/\d+(?:[.,]\d+)*/g)||[]).join(',');
   const after=(value.match(/\d+(?:[.,]\d+)*/g)||[]).join(',');
   assert.equal(after,before,'Numeric integrity of German draft: '+key);
  }
  translations.set(key,value);
 }
 for(const k of pack.review_required_keys)assert(Object.hasOwn(pack.translations,k),'Unmapped review-required text in batch '+batch+': '+k);
 consumed+=n;
}
assert.equal(consumed,850);
const final=batches[7];
assert.equal(final.review_required_keys.length,10);
assert.equal(final.translations['Fâtiha'],'Al-Fātiha');
assert.equal(final.translations['Felak'],'Al-Falaq');
assert.equal(final.translations['Nâs'],'An-Nās');
assert.equal(final.translations['Mâûn'],'Al-Māʿūn');
assert.equal(final.translations['İnşirah'],'Asch-Scharh');
assert.equal(final.translations['Zilzâl'],'Az-Zalzala');
assert(/Rechtsschulen/.test(final.translations['Geçerli mezhep farklılıkları yanlış cevap olarak puanlanmaz; bütün yeni içerikler uzman incelemesi bekler.']));
assert.equal(translations.size,1442);
assert.equal(sources.filter(k=>translations.has(k)).length,1087);
assert.deepEqual(sources.filter(k=>!translations.has(k)),[]);
const extra=[...translations.keys()].filter(k=>!Object.hasOwn(baseline,k));
assert.equal(extra.length,355);
const support=read('assets/i18n/content-support.json').languages.de;
assert.equal(support.question_data,'missing');
assert.equal(support.global_qa,'blocked');
assert.equal(support.religious_expert_approved,false);
const quran=read('assets/i18n/quran/de/ayah-meanings.staging.json');
assert.equal(quran.ayah_count,90);
assert.equal(quran.release_ready,false);
assert.equal(quran.expert_approved,false);
assert.equal(quran.native_reviewer_approved,false);
assert.equal(quran.rights_reviewed,false);
console.log(JSON.stringify({status:'passed',locale:'de',batch:'08',
 newly_staged:10,remediated_missing_reference_keys:850,remaining_reference_keys:0,
 covered_reference_keys:1087,reference_total:1087,staged_distinct_ui_labels:1442,
 extra_ui_keys_beyond_baseline:355,mandatory_human_review_keys:10,
 production_status:'blocked',browser_runtime_coverage:'unverified'},null,2));
