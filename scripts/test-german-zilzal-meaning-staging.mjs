/* Az-Zalzalah (99): the final eight German Quran meaning drafts complete
 * 90/90 QA-only source-pinned drafts, with zero public release permission.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const original=read('assets/quran/audio/ayah-audio-manifest.json');
const pack=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const gate=read('assets/i18n/content-support.json').languages.de;
assert.equal(original.ayahCount,90);
assert.equal(original.entries.length,90);
assert.equal(gate.question_data,'missing');
assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
assert.equal(pack.locale,'de');
assert.equal(pack.scope,'quran_ayah_meanings_staging');
assert.equal(pack.ayah_count,90);
assert.equal(Object.keys(pack.translations).length,90);
for(const flag of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(pack[flag],false,'Staging release review incomplete');
const ids=original.entries.map(v=>v.key);
assert.equal(new Set(ids).size,90,'Canonical 90 IDs not unique');
assert.deepEqual(Object.keys(pack.translations).slice().sort(),ids.slice().sort(),'Staging must match precisely 90 source ayah keys, no extras or missing ayahs');
const verses=original.entries.filter(x=>x.surahId==='zilzal').sort((a,b)=>a.ayah-b.ayah);
assert.deepEqual(verses.map(x=>x.key),Array.from({length:8},(_,i)=>'zilzal:'+(i+1)));
assert(pack.translations['zilzal:4'].text.endsWith(','),'99:4 account of the earth must continue to 99:5');
assert(pack.translations['zilzal:7'].text.includes('Gutes'),'99:7 must retain good deeds');
assert(pack.translations['zilzal:8'].text.includes('Böses'),'99:8 must retain bad deeds');
const failClosedFields=['expert_approved','native_reviewer_approved','rights_reviewed','meaning_reviewed'];
let rejected=0;
for(const src of original.entries){
 const entry=pack.translations[src.key];
 assert(entry,src.key+': no German meaning draft');
 assert.equal(entry.source_ayah_key,src.key);
 assert.equal(entry.surah_id,src.surahId);
 assert.equal(entry.ayah_number,src.ayah);
 assert.equal(entry.source_arabic_text,src.text,'Unchanged Arabic Quran source mismatch '+src.key);
 assert.equal(entry.source_audio_path,src.audio,'Original Arabic Quran recitation path mismatch '+src.key);
 assert.equal(entry.language,'de');
 assert.equal(entry.status,'draft_review_required');
 assert(typeof entry.text==='string'&&!!entry.text.trim()&&!/[\u0600-\u06ff]/u.test(entry.text));
 assert(typeof entry.reviewer_note_tr==='string'&&entry.reviewer_note_tr.length>30);
 for(const field of failClosedFields)assert.equal(entry[field],false,src.key+':'+field+' unexpectedly approved');
 assert.equal(resolveGermanAyahMeaning(src,pack,{preview:true}),entry.text,src.key+': QA preview does not match source');
 assert.equal(resolveGermanAyahMeaning(src,pack),null,src.key+': unreviewed German meaning exposed publicly');
 assert.deepEqual({...auditGermanAyahSource(src,pack)},{source_matches:true,approved:false,has_german_draft:true});
}
for(const src of verses){
 for(const changed of [
  {...src,key:'zilzal:'+(src.ayah===8?1:8)},
  {...src,ayah:src.ayah+1},
  {...src,surahId:'tin'},
  {...src,text:src.text+'۞'},
  {...src,audio:src.audio+'.invalid'},
  {...src,key:'bayyina:'+src.ayah,surahId:'bayyina'}
 ]){
  assert.equal(resolveGermanAyahMeaning(changed,pack,{preview:true}),null,'Invalid source identity accepted for '+src.key);rejected++;
 }
 const forged={...pack,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(src,forged),null,'Unapproved verse must stay hidden despite forged global release');rejected++;
}
assert.equal(resolveGermanAyahMeaning(verses[0],{...pack,locale:'en'},{preview:true}),null);rejected++;
assert.equal(resolveGermanAyahMeaning({...original.entries[0],key:'not-present:1',surahId:'not-present'},pack,{preview:true}),null);rejected++;
const references=pack.sources.comparative_only.filter(r=>r.comparison_scope==='Surah 99 Az-Zalzalah');
assert.equal(references.length,2);
assert(references.every(r=>r.text_copied_verbatim===false&&/^https:\/\//.test(r.url)));
console.log(JSON.stringify({
 status:'passed',locale:'de',surah:'Az-Zalzalah',new_ayah_meaning_drafts:8,
 canonical_ayahs:90,unique_ayahs:90,staged_quran_meanings:90,missing_draft_meanings:0,
 qa_source_matches:90,production_exposed:0,all_verses_pending_expert_native_rights_review:true,
 denied_tampered_source_cases:rejected,original_arabic_audio_unchanged:true
},null,2));
