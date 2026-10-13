/* UI reference batch 01, 02 and real-lesson staging source audit (release stays locked). */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>JSON.parse(readFileSync(path,'utf8'));
const base='assets/i18n/fr/';
const frSupport=read('assets/i18n/content-support.json').languages.fr;
assert.equal(frSupport.question_data,'missing');
assert.equal(frSupport.global_qa,'blocked');
assert.equal(frSupport.religious_expert_approved,false);

const previous=[
 'ui.staging.json',
 'ui.core-navigation-lesson.staging.json',
 'ui.core-quran.staging.json',
 'ui.core-profile.staging.json',
 'ui.lesson-intro-feedback.staging.json',
 'ui.lesson-results.staging.json',
 'ui.streak-xp.staging.json',
 'ui.premium-shop.staging.json',
 'ui.quran-navigation-game.staging.json',
 'ui.quran-learning-surahs.staging.json'
];
const seen=new Set();
for(const file of previous){
 const p=read(base+file);
 assert.equal(p.locale,'fr');
 assert.equal(p.release_ready,false);
 for(const key of Object.keys(p.translations)){
  assert(!seen.has(key),'Previous source-key duplicate: '+key);
  seen.add(key);
 }
}
assert.equal(seen.size,605,'Expected pre-batch staging inventory');

const configs=[
 {file:'ui.reference-batch-01.staging.json',
  source:'german-ui.reference-batch-01.staging.json',expected:112},
 {file:'ui.reference-batch-02.staging.json',
  source:'german-ui.reference-batch-02.staging.json',expected:120},
 {file:'ui.real-lesson-extra.staging.json',
  source:'german-ui.real-lesson.staging.json',expected:6}
];
const placeholders=s=>[...s.matchAll(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g)].map(m=>m[0]).sort();
const stats={};let added=0;
for(const spec of configs){
 const source=read('de-review/assets/i18n/'+spec.source);
 const pack=read(base+spec.file);
 assert.equal(source.locale,'de');
 assert.equal(pack.schema_version,1);
 assert.equal(pack.locale,'fr');
 assert.equal(pack.source_language,'tr');
 assert.equal(pack.release_ready,false);
 assert.equal(pack.global_qa,'blocked');
 assert.equal(pack.native_reviewer_approved,false);
 assert.equal(pack.verified_by_religious_expert,false);
 const expected=Object.keys(source.translations).filter(key=>!seen.has(key));
 const received=Object.keys(pack.translations);
 assert.equal(expected.length,spec.expected,'Reference source count changed: '+spec.file);
 assert.deepEqual(received,expected,'Source identity/order changed: '+spec.file);
 for(const key of expected){
  const translated=pack.translations[key];
  assert.equal(typeof translated,'string');
  assert(translated.trim(),'Empty translation: '+key);
  assert(!/[İıĞğŞş]/u.test(translated),'Possible Turkish characters in French display: '+key);
  assert.deepEqual(placeholders(translated),placeholders(key),'Interpolation token mismatch: '+key);
  assert(!seen.has(key),'Duplicate Turkish source: '+key);
  seen.add(key);
 }
 assert.equal(pack.translation_count,received.length,'Pack metadata drift '+spec.file);
 stats[spec.file]=received.length;
 added+=received.length;
}
assert.equal(added,238);
assert.equal(seen.size,843);

const risky=read(base+'ui.reference-batch-01.staging.json');
for(const key of ['doğru','İhlâs','İhlas','Vakit','Fâtiha hükmü']){
 assert(risky.review_required_keys.includes(key),'Missing context-sensitive review flag: '+key);
}

const dynamic=read(base+'ui.dynamic-preview.staging.json');
assert.equal(dynamic.schema_version,1);
assert.equal(dynamic.locale,'fr');
assert.equal(dynamic.release_ready,false);
assert.equal(dynamic.global_qa,'blocked');
assert.equal(dynamic.native_reviewer_approved,false);
assert.equal(dynamic.verified_by_religious_expert,false);
assert.equal(dynamic.runtime_integrated,false);
assert.equal(dynamic.not_in_static_ui_baseline,true);
const sources=readFileSync('scripts/inventory-french-ui.mjs','utf8');
const templates=Object.entries(dynamic.translations);
assert.equal(templates.length,9,'Dynamic preview scope changed');
assert.equal(dynamic.translation_count,9);
for(const [key,translation] of templates){
 assert(sources.includes(key),'Dynamic review template is not in source risk inventory: '+key);
 assert(!seen.has(key)||!dynamic.runtime_integrated,'Dynamic preview must not be published as static key: '+key);
 assert(translation.trim(),'Empty dynamic preview: '+key);
 assert(!/[İıĞğŞş]/u.test(translation),'Turkish leak in dynamic preview');
 assert.deepEqual(placeholders(translation),placeholders(key),'Dynamic placeholder cardinality or identity changed: '+key);
}
console.log(JSON.stringify({
 locale:'fr',stage:'UI_P04',status:'staging_only',
 newStaticUI:added,staticUI:seen.size,staticBaseline:1452,staticRemaining:1452-seen.size,
 dynamicPreviewTemplates:templates.length,dynamicRuntimeIntegrated:false,
 sourceReviewFlags:risky.review_required_keys,
 packs:stats,structuralErrors:0,productionActivated:false,
 nativeApproved:false,religiousApproved:false
},null,2));
