/* Source-aligned French *UI staging* audit; never activates French in production. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const ref=read('de-review/assets/i18n/german-ui.staging.json');
const support=read('assets/i18n/content-support.json').languages.fr;
assert.equal(ref.locale,'de');
assert.equal(support.question_data,'missing','French must stay blocked in production');
assert.equal(support.global_qa,'blocked','French must stay blocked in production');
assert.equal(support.religious_expert_approved,false);
const initial=read('assets/i18n/fr/ui.staging.json');
const specs=[
 {file:'ui.core-navigation-lesson.staging.json',groups:['navigation','lesson'],expected:[41,30]},
 {file:'ui.core-quran.staging.json',groups:['quran_hub','quran_lesson'],expected:[35,49]},
 {file:'ui.core-profile.staging.json',groups:['profile'],expected:[42]}
];
const seen=new Set(Object.keys(initial.translations));
assert.equal(seen.size,35);
const packSummary={};
const placeholders=s=>[...s.matchAll(/\\{[a-zA-Z][a-zA-Z0-9_]*\\}/g)].map(m=>m[0]).sort();
for(const spec of specs){
 const p=read('assets/i18n/fr/'+spec.file);
 assert.equal(p.schema_version,1);
 assert.equal(p.locale,'fr');
 assert.equal(p.release_ready,false);
 assert.equal(p.global_qa,'blocked');
 assert.equal(p.native_reviewer_approved,false);
 assert.equal(p.verified_by_religious_expert,false);
 let count=0;
 for(const [i,group] of spec.groups.entries()){
  const source=ref.groups[group];
  const missing=source.filter(k=>!(k in initial.translations));
  assert.equal(missing.length,spec.expected[i],group+' expected untranslated count drift');
  assert.deepEqual(p.groups[group],missing,group+' original key identity/order drift');
  for(const key of missing){
   assert(!(key in initial.translations),'Duplicate source key in baseline');
   assert(!seen.has(key),'Duplicate translation across packs: '+key);
   assert(Object.prototype.hasOwnProperty.call(p.translations,key),'Source key missing: '+key);
   const value=p.translations[key];
   assert.equal(typeof value,'string');
   assert(value.trim(),'Empty translation: '+key);
   assert(!/[İıĞğŞş]/u.test(value),'Turkish locale characters in translated UI: '+key);
   assert.deepEqual(placeholders(value),placeholders(key),'Dynamic placeholder changed: '+key);
   seen.add(key);
   count++;
  }
 }
 assert.equal(count,p.translation_count,'Pack count drift '+spec.file);
 assert.equal(Object.keys(p.translations).length,count,'Extra out-of-scope keys in '+spec.file);
 packSummary[spec.file]=count;
}
assert.equal(seen.size,232);
console.log(JSON.stringify({
 locale:'fr',status:'staging_only',uiDrafts:seen.size,
 baseline:35,newCoreUI:197,sourceTotal:1452,
 packs:packSummary,productionActivated:false,
 nativeApproved:false,religiousApproved:false,
 originalArabicAndRecitationUnchanged:true
},null,2));
