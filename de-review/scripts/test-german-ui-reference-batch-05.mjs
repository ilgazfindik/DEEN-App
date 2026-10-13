/* German UI reference remediation batch 05: validate precise original label identity,
 * six-hundred-source-key coverage, religious/native review markers and release embargo.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const en=read('assets/i18n/english-ui.draft.json').translations;
const original=[
 'assets/i18n/german-ui.staging.json',
 'assets/i18n/german-ui.lesson-flow.staging.json',
 'assets/i18n/german-ui.premium-shop.staging.json',
 'assets/i18n/german-ui.quran-controls.staging.json'
];
const all=new Map();
for(const path of original)for(const [key,value] of Object.entries(read(path).translations)){
 if(all.has(key))assert.equal(all.get(key),value,'Conflicting German UI source '+key);
 all.set(key,value);
}
assert.equal(all.size,592);
const enKeys=Object.keys(en);
assert.equal(enKeys.length,1087);
const originalMissing=enKeys.filter(k=>!all.has(k));
assert.equal(originalMissing.length,850);
const packs=[1,2,3,4,5].map(n=>read('assets/i18n/german-ui.reference-batch-'+String(n).padStart(2,'0')+'.staging.json'));
for(let i=0;i<packs.length;i++){
 const pack=packs[i],id=String(i+1).padStart(2,'0');
 assert.equal(pack.schema_version,1);
 assert.equal(pack.locale,'de');
 assert.equal(pack.scope,'ui_reference_remediation_staging');
 assert.equal(pack.batch,id);
 assert.equal(pack.translation_count,120);
 assert.equal(pack.release_ready,false);
 assert.equal(pack.global_qa,'blocked');
 assert.equal(pack.verified_by_religious_expert,false);
 assert.equal(pack.native_reviewer_approved,false);
 assert.equal(pack.rights_reviewed,false);
 assert.equal(pack.status,'translation_draft_requires_native_and_subject_expert_review');
 assert.deepEqual(Object.keys(pack.translations),originalMissing.slice(120*i,120*(i+1)),'Source-key order drift: '+id);
 assert.equal(Object.keys(pack.reference_english).length,120);
 for(const [key,value] of Object.entries(pack.translations)){
  assert(Object.hasOwn(en,key),'Missing original source key '+key);
  assert(!all.has(key),'Duplicate German UI label '+key);
  assert.equal(pack.reference_english[key],en[key],'Wrong source context '+key);
  assert(typeof value==='string'&&value.trim()&&value!==key,'Untranslated German label '+key);
  assert(!/[\u0600-\u06ff]/u.test(value),'Arabic original cannot become a German UI label '+key);
  all.set(key,value);
 }
 assert(Array.isArray(pack.review_required_keys));
 for(const key of pack.review_required_keys)assert(Object.hasOwn(pack.translations,key),'Unmatched review marker: '+key);
 assert(typeof pack.review_note_tr==='string'&&pack.review_note_tr.length>80);
}
assert.equal(packs[4].review_required_keys.length,25);
for(const k of ["Gayba İman","Kur'an'ın Korunması","Ölüm Meleği","Kadere İman Kapsamı"])
 assert(packs[4].review_required_keys.includes(k),'Theology-sensitive term not flagged: '+k);
assert.equal(all.size,1192,'592 original plus five times 120');
assert.equal(enKeys.filter(k=>all.has(k)).length,837);
assert.equal(enKeys.filter(k=>!all.has(k)).length,250);
const flags=read('assets/i18n/content-support.json').languages.de;
assert.equal(flags.question_data,'missing');
assert.equal(flags.global_qa,'blocked');
assert.equal(flags.religious_expert_approved,false);
const quran=read('assets/i18n/quran/de/ayah-meanings.staging.json');
assert.equal(quran.ayah_count,90);
assert.equal(quran.release_ready,false);
assert.equal(quran.expert_approved,false);
assert.equal(quran.native_reviewer_approved,false);
assert.equal(quran.rights_reviewed,false);
console.log(JSON.stringify({status:'passed',locale:'de',new_batch:5,new_ui_drafts:120,
 draft_gap_remediation:600,initial_reference_missing:850,remaining_reference_missing:250,
 staged_ui_labels:1192,reference_covered:837,reference_total:1087,
 religious_terms_pending_review:25,religious_native_rights_approval:'pending',
 full_german_live_release:'blocked'},null,2));
