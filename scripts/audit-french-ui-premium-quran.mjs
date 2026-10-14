/* Source-keyed French Premium/Quran staging audit, without runtime activation. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>JSON.parse(readFileSync(path,'utf8'));
const base='assets/i18n/fr/';
const support=read('assets/i18n/content-support.json').languages.fr;
assert.equal(support.question_data,'missing','French question release gate must stay locked');
assert.equal(support.global_qa,'blocked','French QA gate must stay blocked');
assert.equal(support.religious_expert_approved,false,'Independent religious review remains pending');

const existing=[
 'ui.staging.json',
 'ui.core-navigation-lesson.staging.json',
 'ui.core-quran.staging.json',
 'ui.core-profile.staging.json',
 'ui.lesson-intro-feedback.staging.json',
 'ui.lesson-results.staging.json',
 'ui.streak-xp.staging.json'
];
const seen=new Set();
for(const filename of existing){
 const p=read(base+filename);
 assert.equal(p.locale,'fr');
 assert.equal(p.release_ready,false);
 for(const key of Object.keys(p.translations)){
  assert(!seen.has(key),'Duplicate previous UI source key: '+key);
  seen.add(key);
 }
}
assert.equal(seen.size,421);

const specs=[
 {filename:'ui.premium-shop.staging.json',src:'german-ui.premium-shop.staging.json',
  groups:['premium_options','shop_rewards','content_safeguards'],count:[25,10,6]},
 {filename:'ui.quran-navigation-game.staging.json',src:'german-ui.quran-controls.staging.json',
  groups:['quran_navigation','memorization_game'],count:[46,16]},
 {filename:'ui.quran-learning-surahs.staging.json',src:'german-ui.quran-controls.staging.json',
  groups:['learning_memorization','surah_names'],count:[49,32]}
];
const placeholders=s=>[...s.matchAll(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g)].map(m=>m[0]).sort();
const report={};let added=0;
for(const spec of specs){
 const source=read('de-review/assets/i18n/'+spec.src);
 const p=read(base+spec.filename);
 assert.equal(source.locale,'de');
 assert.equal(p.schema_version,1);
 assert.equal(p.locale,'fr');
 assert.equal(p.source_language,'tr');
 assert.equal(p.release_ready,false);
 assert.equal(p.global_qa,'blocked');
 assert.equal(p.native_reviewer_approved,false);
 assert.equal(p.verified_by_religious_expert,false);
 if(spec.filename.includes('quran')){
  assert.equal(p.rights_reviewed,false);
  assert(p.protected_content_note.includes('No Arabic verse text'),
   'Quran source and recitation must remain immutable');
 }
 if(spec.filename.includes('learning-surahs'))
  assert.equal(p.transliteration_reviewed,false);
 let total=0;
 for(let i=0;i<spec.groups.length;i++){
  const group=spec.groups[i],reference=source.groups[group];
  assert.equal(reference.length,spec.count[i],'Unexpected source group length '+group);
  assert.deepEqual(p.groups[group],reference,'Source identity or ordering changed: '+group);
  for(const key of reference){
   assert(!seen.has(key),'French duplicate across packages: '+key);
   assert(Object.prototype.hasOwnProperty.call(p.translations,key),'Missing source key: '+key);
   const translated=p.translations[key];
   assert.equal(typeof translated,'string');
   assert(translated.trim(),'Empty French string: '+key);
   assert(!/[İıĞğŞş]/u.test(translated),'Turkish letters in French display: '+key);
   assert.deepEqual(placeholders(translated),placeholders(key),'Placeholder mismatch: '+key);
   seen.add(key); total++;
  }
 }
 assert.equal(Object.keys(p.translations).length,total,'Extra translations: '+spec.filename);
 assert.equal(p.translation_count,total,'Metadata count drift: '+spec.filename);
 report[spec.filename]=total;
 added+=total;
}
assert.equal(added,184);
assert.equal(seen.size,605);
console.log(JSON.stringify({
 locale:'fr',status:'staging_only',newUI:added,allUI:seen.size,
 sourceTotal:1452,remaining:847,packs:report,structuralErrors:0,
 arabicOriginalUnchanged:true,nativeApproved:false,religiousApproved:false,
 transliterationReviewed:false,productionActivated:false
},null,2));
