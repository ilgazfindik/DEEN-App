/* Al-Falaq (113) Arabic identity, audio mapping, German draft and fail-closed QA */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const original=read('assets/quran/audio/ayah-audio-manifest.json');
const stage=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const gate=read('assets/i18n/content-support.json').languages.de;
assert.equal(gate.question_data,'missing');
assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
assert.equal(stage.locale,'de');
assert.equal(stage.scope,'quran_ayah_meanings_staging');
assert.equal(stage.ayah_count,90);
assert.equal(Object.keys(stage.translations).length,90);
for(const prop of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(stage[prop],false,prop);
const falaq=original.entries.filter(e=>e.surahId==='falaq').sort((a,b)=>a.ayah-b.ayah);
assert.deepEqual(falaq.map(e=>e.ayah),[1,2,3,4,5]);
assert.deepEqual(falaq.map(e=>e.key),['falaq:1','falaq:2','falaq:3','falaq:4','falaq:5']);
let negatives=0;
for(const entry of falaq){
 const current=stage.translations[entry.key];
 assert(current,entry.key+':missing');
 assert.equal(current.source_ayah_key,entry.key);
 assert.equal(current.ayah_number,entry.ayah);
 assert.equal(current.surah_id,'falaq');
 assert.equal(current.source_arabic_text,entry.text);
 assert.equal(current.source_audio_path,entry.audio);
 assert.equal(current.language,'de');
 assert.equal(current.status,'draft_review_required');
 assert.equal(/[\u0600-\u06ff]/u.test(current.text),false);
 assert(current.reviewer_note_tr.length>30);
 for(const flag of ['expert_approved','native_reviewer_approved','rights_reviewed','meaning_reviewed'])assert.equal(current[flag],false,entry.key+':'+flag);
 assert.equal(resolveGermanAyahMeaning(entry,stage),null,entry.key+':public_not_allowed');
 assert.equal(resolveGermanAyahMeaning(entry,stage,{preview:true}),current.text);
 assert.deepEqual({...auditGermanAyahSource(entry,stage)},{source_matches:true,approved:false,has_german_draft:true});
 for(const mutated of [
  {...entry,key:'falaq:'+(entry.ayah===5?1:5)},
  {...entry,surahId:'nas'},
  {...entry,ayah:entry.ayah+1},
  {...entry,text:entry.text+'۞'},
  {...entry,audio:entry.audio+'.missing'},
  {...entry,key:'ikhlas:'+entry.ayah,surahId:'ikhlas'},
 ]){
  assert.equal(resolveGermanAyahMeaning(mutated,stage,{preview:true}),null,entry.key+':wrong_source_accepted');
  negatives++;
 }
 const forged={...stage,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(entry,forged),null,entry.key+':false_approval');
 negatives++;
}
let qa=0,production=0;
for(const entry of original.entries){
 if(resolveGermanAyahMeaning(entry,stage,{preview:true})!==null)qa++;
 if(resolveGermanAyahMeaning(entry,stage)!==null)production++;
}
assert.equal(qa,90);
assert.equal(production,0);
assert.equal(resolveGermanAyahMeaning(falaq[0],{...stage,locale:'en'},{preview:true}),null);negatives++;
assert.equal(resolveGermanAyahMeaning({...original.entries[0],key:'missing:1',surahId:'missing'},stage,{preview:true}),null);negatives++;
const comparative=stage.sources.comparative_only.filter(r=>r.comparison_scope==='Surah 113 Al-Falaq');
assert.equal(comparative.length,2);
assert(comparative.every(ref=>ref.text_copied_verbatim===false&&/^https:\/\//.test(ref.url)));
console.log(JSON.stringify({status:'passed',surah:'Al-Falaq',staged_ayahs:5,total_drafts:90,remaining_ayah_meanings:0,
 preview_matching:5,production_exposed:0,negative_checks:negatives,original_arabic_audio_modified:false,
 native_religious_rights_approval:'pending'},null,2));
