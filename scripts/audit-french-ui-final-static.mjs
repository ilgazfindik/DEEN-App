/* Final French static UI source inventory audit — translation drafts, not a runtime release. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const root='assets/i18n/fr/';
const support=read('assets/i18n/content-support.json').languages.fr;
assert.equal(support.question_data,'missing');
assert.equal(support.global_qa,'blocked');
assert.equal(support.religious_expert_approved,false);

const earlier=[
 'ui.staging.json','ui.core-navigation-lesson.staging.json','ui.core-quran.staging.json',
 'ui.core-profile.staging.json','ui.lesson-intro-feedback.staging.json',
 'ui.lesson-results.staging.json','ui.streak-xp.staging.json',
 'ui.premium-shop.staging.json','ui.quran-navigation-game.staging.json',
 'ui.quran-learning-surahs.staging.json','ui.reference-batch-01.staging.json',
 'ui.reference-batch-02.staging.json','ui.real-lesson-extra.staging.json',
 'ui.reference-batch-03.staging.json','ui.reference-batch-04.staging.json',
 'ui.reference-batch-05.staging.json','ui.reference-batch-06.staging.json'
];
const seen=new Set();
const placeholder=s=>[...s.matchAll(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g)].map(m=>m[0]).sort();
for(const name of earlier){
 const p=read(root+name);
 assert.equal(p.locale,'fr');
 assert.equal(p.release_ready,false);
 assert.equal(p.native_reviewer_approved,false);
 for(const key of Object.keys(p.translations)){
  assert(!seen.has(key),'Duplicate prior French source '+key);
  seen.add(key);
 }
}
assert.equal(seen.size,1323,'Preexisting source inventory drift');
const actual={};let newCount=0;
for(const [batch,expectedCount] of [['07',119],['08',10]]){
 const p=read(root+'ui.reference-batch-'+batch+'.staging.json');
 const ref=read('de-review/assets/i18n/german-ui.reference-batch-'+batch+'.staging.json');
 assert.equal(ref.locale,'de');
 assert.equal(p.schema_version,1);
 assert.equal(p.locale,'fr');
 assert.equal(p.source_language,'tr');
 assert.equal(p.reference_batch,batch);
 assert.equal(p.release_ready,false);
 assert.equal(p.global_qa,'blocked');
 assert.equal(p.native_reviewer_approved,false);
 assert.equal(p.verified_by_religious_expert,false);
 assert.equal(p.translation_count,expectedCount);
 const missing=Object.keys(ref.translations).filter(k=>!seen.has(k));
 assert.equal(missing.length,expectedCount,'Expected source count '+batch);
 assert.deepEqual(Object.keys(p.translations),missing,'Source identity/order mismatch in batch '+batch);
 for(const key of missing){
  assert(!seen.has(key),'Overlapping source key '+key);
  const value=p.translations[key];
  assert.equal(typeof value,'string');
  assert(value.trim(),'Empty French translation '+key);
  assert(!/[İıĞğŞş]/u.test(value),'Turkish characters in French translation '+key);
  assert.deepEqual(placeholder(value),placeholder(key),'Template token mismatch '+key);
  seen.add(key);
 }
 assert(Array.isArray(p.review_required_keys)&&p.review_required_keys.length>0,'Review flags missing');
 for(const key of p.review_required_keys)assert(missing.includes(key),'Review flag not from source: '+key);
 if(batch==='07')assert.deepEqual(p.existing_key_not_repeated,['Ünite bazında']);
 if(batch==='08'){
  assert.equal(p.transliteration_reviewed,false,'Unreviewed surah labels must not be released');
  assert.equal(p.rights_reviewed,false);
  assert(p.protected_content_note.includes('Original Arabic ayat'));
 }
 actual[batch]=missing.length;
 newCount+=missing.length;
}
assert.equal(newCount,129);
assert.equal(seen.size,1452);
const dyn=read(root+'ui.dynamic-preview.staging.json');
assert.equal(dyn.runtime_integrated,false,'Dynamic templates must stay unbound');
assert.equal(dyn.release_ready,false);
assert.equal(dyn.not_in_static_ui_baseline,true);
assert.equal(dyn.translation_count,9,'Expected nine dynamic preview templates');
console.log(JSON.stringify({
 locale:'fr',stage:'UI_P07',status:'staging_only',newStaticUI:newCount,
 totalKnownStatic:seen.size,staticSourceTotal:1452,staticRemaining:0,
 questionSourceDrafts:1500,dynamicUnbound:dyn.translation_count,
 sourceKeyErrors:0,religiousApproved:false,nativeApproved:false,productionActivated:false,
 completedBatches:actual
},null,2));
