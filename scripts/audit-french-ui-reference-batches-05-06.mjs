/* Validate French topic and onboarding drafts 05-06 against original Turkish keys. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const root='assets/i18n/fr/';
const support=read('assets/i18n/content-support.json').languages.fr;
assert.equal(support.question_data,'missing','French must not ship questions');
assert.equal(support.global_qa,'blocked','French QA is not production approved');
assert.equal(support.religious_expert_approved,false);
const previous=[
 'ui.staging.json','ui.core-navigation-lesson.staging.json',
 'ui.core-quran.staging.json','ui.core-profile.staging.json',
 'ui.lesson-intro-feedback.staging.json','ui.lesson-results.staging.json',
 'ui.streak-xp.staging.json','ui.premium-shop.staging.json',
 'ui.quran-navigation-game.staging.json','ui.quran-learning-surahs.staging.json',
 'ui.reference-batch-01.staging.json','ui.reference-batch-02.staging.json',
 'ui.real-lesson-extra.staging.json','ui.reference-batch-03.staging.json',
 'ui.reference-batch-04.staging.json'
];
const seen=new Set();
for(const name of previous){
 const x=read(root+name);
 assert.equal(x.locale,'fr');
 assert.equal(x.release_ready,false);
 for(const k of Object.keys(x.translations)){
  assert(!seen.has(k),'Duplicate previously staged source: '+k);
  seen.add(k);
 }
}
assert.equal(seen.size,1083,'Previous inventory unexpectedly changed');
const flagged=read(root+'ui.reference-batch-01.staging.json');
assert.equal(flagged.translations['doğru'],'droit','Upright must not be translated as debout');
assert(flagged.review_required_keys.includes('doğru'),'Ambiguous upright term requires reviewer');
const placeholders=s=>[...s.matchAll(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g)].map(m=>m[0]).sort();
const summary={};let added=0;
for(const batch of ['05','06']){
 const name='ui.reference-batch-'+batch+'.staging.json';
 const orig=read('de-review/assets/i18n/german-ui.reference-batch-'+batch+'.staging.json');
 const fr=read(root+name);
 assert.equal(orig.locale,'de');
 assert.equal(fr.schema_version,1);
 assert.equal(fr.locale,'fr');
 assert.equal(fr.source_language,'tr');
 assert.equal(fr.reference_batch,batch);
 assert.equal(fr.release_ready,false);
 assert.equal(fr.global_qa,'blocked');
 assert.equal(fr.native_reviewer_approved,false);
 assert.equal(fr.verified_by_religious_expert,false);
 const expected=Object.keys(orig.translations).filter(x=>!seen.has(x));
 const got=Object.keys(fr.translations);
 assert.equal(expected.length,120,'Reference source drift: '+batch);
 assert.deepEqual(got,expected,'Original Turkish source key/ordering drift: '+batch);
 for(const key of expected){
  const value=fr.translations[key];
  assert.equal(typeof value,'string');
  assert(value.trim(),'Empty French translation: '+key);
  assert(!/[İıĞğŞş]/u.test(value),'Untranslated Turkish letter: '+key);
  assert.deepEqual(placeholders(value),placeholders(key),'Interpolation token mismatch: '+key);
  seen.add(key);
 }
 assert.equal(fr.translation_count,got.length,'Metadata drift '+name);
 assert(Array.isArray(fr.review_required_keys) && fr.review_required_keys.length>0,
  'Expected religious and language review flags');
 for(const key of fr.review_required_keys)
  assert(expected.includes(key),'Review flag outside source group: '+key);
 summary[name]=got.length;
 added+=got.length;
}
assert.equal(added,240);
assert.equal(seen.size,1323);
console.log(JSON.stringify({
 locale:'fr',batch:'P06',status:'staging_only',
 newStatic:added,totalStatic:seen.size,totalKnown:1452,remaining:129,
 auditedBatches:summary,structuralErrors:0,productionActivated:false,
 nativeReviewerApproved:false,religiousExpertApproved:false
},null,2));
