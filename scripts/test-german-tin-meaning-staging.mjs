/* At-Tin (95): 8 source-pinned German ayah meaning drafts are QA-only. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const canonical=read('assets/quran/audio/ayah-audio-manifest.json');
const pack=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const gate=read('assets/i18n/content-support.json').languages.de;
assert.equal(canonical.ayahCount,90);
assert.equal(canonical.entries.length,90);
assert.equal(gate.question_data,'missing');
assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
assert.equal(pack.locale,'de');
assert.equal(pack.scope,'quran_ayah_meanings_staging');
assert.equal(pack.ayah_count,74);
assert.equal(Object.keys(pack.translations).length,74);
for(const flag of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(pack[flag],false,flag+': pending review cannot be bypassed');
const verses=canonical.entries.filter(e=>e.surahId==='tin').sort((a,b)=>a.ayah-b.ayah);
assert.deepEqual(verses.map(x=>x.key),Array.from({length:8},(_,i)=>'tin:'+(i+1)));
assert(pack.translations['tin:4'].text.endsWith(','),'Verse 4 assertion must continue to verse 5');
assert(pack.translations['tin:5'].text.endsWith(','),'Verse 5 contrast must continue to verse 6');
assert(pack.translations['tin:6'].text.includes('ausgenommen'),'Verse 6 faith/good deeds exception must be explicit');
let rejected=0;
for(const aya of verses){
 const entry=pack.translations[aya.key];
 assert(entry,aya.key+': missing draft');
 assert.equal(entry.source_ayah_key,aya.key);
 assert.equal(entry.surah_id,'tin');
 assert.equal(entry.ayah_number,aya.ayah);
 assert.equal(entry.source_arabic_text,aya.text,'Canonical Arabic cannot be changed');
 assert.equal(entry.source_audio_path,aya.audio,'Original recitation file path cannot be changed');
 assert.equal(entry.language,'de');
 assert.equal(entry.status,'draft_review_required');
 assert(typeof entry.text==='string'&&entry.text.trim()&&!/[\u0600-\u06ff]/u.test(entry.text));
 assert(typeof entry.reviewer_note_tr==='string'&&entry.reviewer_note_tr.length>40);
 for(const flag of ['expert_approved','native_reviewer_approved','rights_reviewed','meaning_reviewed'])assert.equal(entry[flag],false,aya.key+':'+flag);
 assert.equal(resolveGermanAyahMeaning(aya,pack),null,'German draft must not appear in public mode');
 assert.equal(resolveGermanAyahMeaning(aya,pack,{preview:true}),entry.text,'Source-guarded QA draft mismatch');
 assert.deepEqual({...auditGermanAyahSource(aya,pack)},{source_matches:true,approved:false,has_german_draft:true});
 for(const tampered of [
  {...aya,key:'tin:'+(aya.ayah===8?1:8)},
  {...aya,ayah:aya.ayah+1},
  {...aya,surahId:'bayyina'},
  {...aya,text:aya.text+'۞'},
  {...aya,audio:aya.audio+'.invalid'},
  {...aya,key:'sharh:'+aya.ayah,surahId:'sharh'}
 ]){
  assert.equal(resolveGermanAyahMeaning(tampered,pack,{preview:true}),null,'Tampered verse/source/audio was accepted '+aya.key);
  rejected++;
 }
 const forged={...pack,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(aya,forged),null,'False verse approvals override fake pack approval');
 rejected++;
}
assert.equal(resolveGermanAyahMeaning(verses[0],{...pack,locale:'tr'},{preview:true}),null);rejected++;
assert.equal(resolveGermanAyahMeaning(canonical.entries.find(x=>x.surahId==='bayyina'),pack,{preview:true}),null);rejected++;
let preview=0,publicMeanings=0;
for(const aya of canonical.entries){
 if(resolveGermanAyahMeaning(aya,pack,{preview:true})!==null)preview++;
 if(resolveGermanAyahMeaning(aya,pack)!==null)publicMeanings++;
}
assert.equal(preview,74);
assert.equal(publicMeanings,0);
const refs=pack.sources.comparative_only.filter(r=>r.comparison_scope==='Surah 95 At-Tin');
assert.equal(refs.length,3);
assert(refs.every(r=>r.text_copied_verbatim===false&&/^https:\/\//.test(r.url)));
console.log(JSON.stringify({
 status:'passed',surah:'At-Tin',new_ayah_meaning_drafts:8,staged_total:74,remaining:16,
 source_matched_previews:8,public_meanings:0,negative_source_guards:rejected,
 verse_4_to_6_context_preserved:true,original_arabic_or_audio_modified:false,
 scholarly_native_rights_review:'pending',release_gate:'blocked'
},null,2));
