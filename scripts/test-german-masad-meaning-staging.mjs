/* Masad / Tebbet (111): source-pinned German Quran meaning drafts are not public. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const source=read('assets/quran/audio/ayah-audio-manifest.json');
const pack=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const german=read('assets/i18n/content-support.json').languages.de;
assert.equal(source.ayahCount,90);
assert.equal(source.entries.length,90);
assert.equal(german.question_data,'missing');
assert.equal(german.global_qa,'blocked');
assert.equal(german.religious_expert_approved,false);
assert.equal(pack.locale,'de');
assert.equal(pack.scope,'quran_ayah_meanings_staging');
assert.equal(pack.ayah_count,42);
assert.equal(Object.keys(pack.translations).length,42);
for(const flag of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(pack[flag],false,'Global Quran German release blocked');
const masad=source.entries.filter(x=>x.surahId==='masad').sort((x,y)=>x.ayah-y.ayah);
assert.deepEqual(masad.map(x=>x.key),['masad:1','masad:2','masad:3','masad:4','masad:5']);
const flags=['native_reviewer_approved','expert_approved','rights_reviewed','meaning_reviewed'];
let negativeCases=0;
for(const aya of masad){
 const entry=pack.translations[aya.key];
 assert(entry,'missing '+aya.key);
 assert.equal(entry.source_ayah_key,aya.key);
 assert.equal(entry.surah_id,aya.surahId);
 assert.equal(entry.ayah_number,aya.ayah);
 assert.equal(entry.source_arabic_text,aya.text,'Arabic Quran source not equal to canonical '+aya.key);
 assert.equal(entry.source_audio_path,aya.audio,'Arabic recitation source changed '+aya.key);
 assert.equal(entry.language,'de');
 assert.equal(entry.status,'draft_review_required');
 assert(typeof entry.reviewer_note_tr==='string'&&entry.reviewer_note_tr.length>40);
 assert(typeof entry.text==='string'&&entry.text.trim()&&!/[\u0600-\u06ff]/u.test(entry.text));
 for(const flag of flags)assert.equal(entry[flag],false,flag+':'+aya.key);
 assert.equal(resolveGermanAyahMeaning(aya,pack),null,aya.key+':unapproved released');
 assert.equal(resolveGermanAyahMeaning(aya,pack,{preview:true}),entry.text);
 assert.deepEqual({...auditGermanAyahSource(aya,pack)},{source_matches:true,approved:false,has_german_draft:true});
 for(const tampered of [
  {...aya,key:'masad:'+(aya.ayah===5?1:5)},
  {...aya,ayah:aya.ayah+1},
  {...aya,surahId:'nasr'},
  {...aya,text:aya.text+'۞'},
  {...aya,audio:aya.audio+'.tampered'},
  {...aya,key:'fatiha:'+Math.min(aya.ayah,7),surahId:'fatiha'}
 ]){
  assert.equal(resolveGermanAyahMeaning(tampered,pack,{preview:true}),null,'Wrong Arabic/audio/ayah was accepted for '+aya.key);
  negativeCases++;
 }
 const forged={...pack,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(aya,forged),null,'Per-verse review cannot be bypassed');
 negativeCases++;
}
assert.equal(resolveGermanAyahMeaning(masad[0],{...pack,locale:'en'},{preview:true}),null);negativeCases++;
assert.equal(resolveGermanAyahMeaning(source.entries.find(e=>e.surahId==='fil'),pack,{preview:true}),null);negativeCases++;
let previewCount=0,productionCount=0;
for(const aya of source.entries){
 if(resolveGermanAyahMeaning(aya,pack,{preview:true})!==null)previewCount++;
 if(resolveGermanAyahMeaning(aya,pack)!==null)productionCount++;
}
assert.equal(previewCount,42);
assert.equal(productionCount,0);
const sources=pack.sources.comparative_only.filter(s=>s.comparison_scope==='Surah 111 Al-Masad');
assert.equal(sources.length,3);
assert(sources.every(s=>s.text_copied_verbatim===false&&/^https:\/\//.test(s.url)));
console.log(JSON.stringify({status:'passed',surah:'Al-Masad',new_drafts:5,total_quran_meaning_drafts:42,
 pending_drafts:48,previewed_correctly:5,public_meanings:0,negative_source_guard_cases:negativeCases,
 original_arabic_modified:false,original_audio_modified:false,expert_rights_native_approval:'pending'},null,2));
