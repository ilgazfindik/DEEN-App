/* Al-Fil Quran German meaning drafts: exact Arabic/audio source identity,
 * independent German review drafts only, never production.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';
const base=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(base+p,'utf8'));
const source=read('assets/quran/audio/ayah-audio-manifest.json');
const pack=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const gate=read('assets/i18n/content-support.json').languages.de;
assert.equal(source.ayahCount,90);
assert.equal(source.entries.length,90);
assert.equal(gate.question_data,'missing');
assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
assert.equal(pack.locale,'de');
assert.equal(pack.scope,'quran_ayah_meanings_staging');
assert.equal(pack.ayah_count,90);
assert.equal(Object.keys(pack.translations).length,90);
for(const flag of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(pack[flag],false);
const fil=source.entries.filter(x=>x.surahId==='fil').sort((x,y)=>x.ayah-y.ayah);
assert.deepEqual(fil.map(x=>x.key),['fil:1','fil:2','fil:3','fil:4','fil:5']);
let rejected=0;
for(const aya of fil){
 const de=pack.translations[aya.key];
 assert(de,'missing '+aya.key);
 assert.equal(de.source_ayah_key,aya.key);
 assert.equal(de.surah_id,'fil');
 assert.equal(de.ayah_number,aya.ayah);
 assert.equal(de.source_arabic_text,aya.text,'Arabic Quran source must remain unchanged');
 assert.equal(de.source_audio_path,aya.audio,'Original audio path mismatch');
 assert.equal(de.language,'de');
 assert.equal(de.status,'draft_review_required');
 assert(typeof de.text==='string'&&de.text.trim()&&!/[\u0600-\u06ff]/u.test(de.text));
 assert(de.reviewer_note_tr.length>40);
 for(const flag of ['expert_approved','native_reviewer_approved','rights_reviewed','meaning_reviewed'])assert.equal(de[flag],false);
 assert.equal(resolveGermanAyahMeaning(aya,pack),null,'Production must stay blocked');
 assert.equal(resolveGermanAyahMeaning(aya,pack,{preview:true}),de.text,'QA source mapping mismatch');
 assert.deepEqual({...auditGermanAyahSource(aya,pack)},{source_matches:true,approved:false,has_german_draft:true});
 for(const bad of [
  {...aya,key:'fil:'+(aya.ayah===5?1:5)},
  {...aya,ayah:aya.ayah+1},
  {...aya,surahId:'quraysh'},
  {...aya,text:aya.text+'۞'},
  {...aya,audio:aya.audio+'.wrong'},
  {...aya,key:'masad:'+aya.ayah,surahId:'masad'},
 ]){
  assert.equal(resolveGermanAyahMeaning(bad,pack,{preview:true}),null,'Wrong Quran/audio metadata accepted '+aya.key);
  rejected++;
 }
 const forged={...pack,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(aya,forged),null,'Per-ayah review cannot be bypassed');rejected++;
}
assert.equal(resolveGermanAyahMeaning(fil[0],{...pack,locale:'tr'},{preview:true}),null);rejected++;
assert.equal(resolveGermanAyahMeaning({...source.entries[0],key:'missing:1',surahId:'missing'},pack,{preview:true}),null);rejected++;
let draftCount=0,productionCount=0;
for(const x of source.entries){
 if(resolveGermanAyahMeaning(x,pack,{preview:true})!==null)draftCount++;
 if(resolveGermanAyahMeaning(x,pack)!==null)productionCount++;
}
assert.equal(draftCount,90);
assert.equal(productionCount,0);
const refs=pack.sources.comparative_only.filter(ref=>ref.comparison_scope==='Surah 105 Al-Fil');
assert.equal(refs.length,3);
assert(refs.every(x=>x.text_copied_verbatim===false&&/^https:\/\//.test(x.url)));
console.log(JSON.stringify({status:'passed',surah:'Al-Fil',new_ayah_drafts:5,total_staging_meanings:90,missing_meanings:0,
 correct_qa_previews:5,public_meanings:0,negative_checks:rejected,original_arabic_and_audio_unchanged:true,approvals:'pending'},null,2));
