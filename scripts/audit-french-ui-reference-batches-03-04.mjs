/* Independent French topic-draft audit: batches 03–04, source IDs and release locks. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const base='assets/i18n/fr/';
const support=read('assets/i18n/content-support.json').languages.fr;
assert.equal(support.question_data,'missing');
assert.equal(support.global_qa,'blocked');
assert.equal(support.religious_expert_approved,false);
const old=[
 'ui.staging.json',
 'ui.core-navigation-lesson.staging.json',
 'ui.core-quran.staging.json',
 'ui.core-profile.staging.json',
 'ui.lesson-intro-feedback.staging.json',
 'ui.lesson-results.staging.json',
 'ui.streak-xp.staging.json',
 'ui.premium-shop.staging.json',
 'ui.quran-navigation-game.staging.json',
 'ui.quran-learning-surahs.staging.json',
 'ui.reference-batch-01.staging.json',
 'ui.reference-batch-02.staging.json',
 'ui.real-lesson-extra.staging.json'
];
const seen=new Set();
for(const name of old){
 const file=read(base+name);
 assert.equal(file.locale,'fr');
 assert.equal(file.release_ready,false);
 for(const key of Object.keys(file.translations)){
  assert(!seen.has(key),'Prior French source key duplicated: '+key);
  seen.add(key);
 }
}
assert.equal(seen.size,843,'Prior UI coverage drift');
const placeholder=s=>[...s.matchAll(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g)].map(x=>x[0]).sort();
const stats={};let added=0;
for(const batch of ['03','04']){
 const name='ui.reference-batch-'+batch+'.staging.json';
 const raw='german-ui.reference-batch-'+batch+'.staging.json';
 const original=read('de-review/assets/i18n/'+raw);
 const translated=read(base+name);
 assert.equal(original.locale,'de');
 assert.equal(translated.schema_version,1);
 assert.equal(translated.locale,'fr');
 assert.equal(translated.source_language,'tr');
 assert.equal(translated.reference_batch,batch);
 assert.equal(translated.release_ready,false);
 assert.equal(translated.global_qa,'blocked');
 assert.equal(translated.native_reviewer_approved,false);
 assert.equal(translated.verified_by_religious_expert,false);
 const sourceKeys=Object.keys(original.translations).filter(key=>!seen.has(key));
 const actualKeys=Object.keys(translated.translations);
 assert.equal(sourceKeys.length,120,'Reference 120-key coverage changed: '+name);
 assert.deepEqual(actualKeys,sourceKeys,'Turkish source identity / order drift: '+name);
 for(const key of sourceKeys){
  const value=translated.translations[key];
  assert.equal(typeof value,'string');
  assert(value.trim(),'Empty French translation: '+key);
  assert(!/[İıĞğŞş]/u.test(value),'Potential Turkish character leak: '+key);
  assert.deepEqual(placeholder(value),placeholder(key),'Template placeholder drift: '+key);
  seen.add(key);
 }
 assert.equal(translated.translation_count,120,'Declared count drift: '+name);
 assert(Array.isArray(translated.review_required_keys)&&translated.review_required_keys.length>0,'Expert review keys missing');
 for(const key of translated.review_required_keys)
  assert(sourceKeys.includes(key),'Expert flag key missing from source: '+key);
 stats[name]=sourceKeys.length;
 added+=sourceKeys.length;
}
assert.equal(added,240);
assert.equal(seen.size,1083);
console.log(JSON.stringify({
 locale:'fr',stage:'UI_P05',status:'staging_only',newStaticUI:240,
 totalStaticUI:1083,baseline:1452,missing:369,packs:stats,
 sourceKeyErrors:0,reviewRequired:true,runtimeActivated:false
},null,2));
