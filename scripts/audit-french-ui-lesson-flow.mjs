/* Audit source-aligned French lesson-flow UI drafts without enabling production. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>JSON.parse(readFileSync(path,'utf8'));
const source=read('de-review/assets/i18n/german-ui.lesson-flow.staging.json');
const support=read('assets/i18n/content-support.json').languages.fr;
assert.equal(source.locale,'de');
assert.equal(support.question_data,'missing');
assert.equal(support.global_qa,'blocked');
assert.equal(support.religious_expert_approved,false);

const original=[
 'ui.staging.json',
 'ui.core-navigation-lesson.staging.json',
 'ui.core-quran.staging.json',
 'ui.core-profile.staging.json'
];
const known=new Set();
for(const name of original){
 const pack=read('assets/i18n/fr/'+name);
 assert.equal(pack.locale,'fr');
 assert.equal(pack.release_ready,false);
 for(const key of Object.keys(pack.translations)){
  assert(!known.has(key),'Preexisting French key collision: '+key);
  known.add(key);
 }
}
assert.equal(known.size,232);

const packs=[
 {name:'ui.lesson-intro-feedback.staging.json',groups:['stage_intro','question_feedback'],counts:[35,31]},
 {name:'ui.lesson-results.staging.json',groups:['result_flow'],counts:[94]},
 {name:'ui.streak-xp.staging.json',groups:['streak_xp'],counts:[29]}
];
const placeholders=s=>[...s.matchAll(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g)].map(m=>m[0]).sort();
const summary={};let added=0;
for(const spec of packs){
 const pack=read('assets/i18n/fr/'+spec.name);
 assert.equal(pack.schema_version,1);
 assert.equal(pack.locale,'fr');
 assert.equal(pack.release_ready,false);
 assert.equal(pack.global_qa,'blocked');
 assert.equal(pack.native_reviewer_approved,false);
 assert.equal(pack.verified_by_religious_expert,false);
 let count=0;
 for(let i=0;i<spec.groups.length;i++){
  const group=spec.groups[i],base=source.groups[group];
  const missing=base.filter(key=>!known.has(key));
  assert.equal(missing.length,spec.counts[i],'Source-count drift: '+group);
  assert.deepEqual(pack.groups[group],missing,'Source key/order drift: '+group);
  for(const key of missing){
   assert(!known.has(key),'Duplicate French key: '+key);
   assert(Object.prototype.hasOwnProperty.call(pack.translations,key),'Untranslated key: '+key);
   const value=pack.translations[key];
   assert.equal(typeof value,'string');
   assert(value.trim(),'Empty French display: '+key);
   assert(!/[İıĞğŞş]/u.test(value),'Turkish locale leakage: '+key);
   assert.deepEqual(placeholders(value),placeholders(key),'Dynamic token mismatch: '+key);
   known.add(key);
   count++;
  }
 }
 assert.equal(Object.keys(pack.translations).length,count,'Extra keys in pack '+spec.name);
 assert.equal(pack.translation_count,count,'Metadata drift '+spec.name);
 summary[spec.name]=count;
 added+=count;
}
assert.equal(added,189);
assert.equal(known.size,421);
console.log(JSON.stringify({locale:'fr',status:'staging_only',newLessonFlow:added,allUI:known.size,
 sourceTotal:1452,remaining:1452-known.size,packs:summary,structuralErrors:0,
 nativeApproved:false,religiousApproved:false,productionActivated:false},null,2));
