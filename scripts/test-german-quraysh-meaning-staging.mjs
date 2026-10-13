/* Quraysh (106): German meaning drafts must match the unmodified
 * canonical Quran Arabic and recitation tracks; never publicly load drafts.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const manifest=read('assets/quran/audio/ayah-audio-manifest.json');
const pack=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const gate=read('assets/i18n/content-support.json').languages.de;
assert.equal(manifest.ayahCount,90);
assert.equal(manifest.entries.length,90);
assert.equal(gate.question_data,'missing');
assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
assert.equal(pack.locale,'de');
assert.equal(pack.scope,'quran_ayah_meanings_staging');
assert.equal(pack.ayah_count,90);
assert.equal(Object.keys(pack.translations).length,90);
for(const flag of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(pack[flag],false,flag+' must remain false');
const quraysh=manifest.entries.filter(e=>e.surahId==='quraysh').sort((a,b)=>a.ayah-b.ayah);
assert.deepEqual(quraysh.map(e=>e.key),['quraysh:1','quraysh:2','quraysh:3','quraysh:4']);
let tamperingRejected=0;
for(const ayah of quraysh){
 const entry=pack.translations[ayah.key];
 assert(entry,'missing German meaning draft '+ayah.key);
 assert.equal(entry.source_ayah_key,ayah.key);
 assert.equal(entry.surah_id,'quraysh');
 assert.equal(entry.ayah_number,ayah.ayah);
 assert.equal(entry.source_arabic_text,ayah.text,'canonical Arabic ayah was modified '+ayah.key);
 assert.equal(entry.source_audio_path,ayah.audio,'canonical recitation audio path was modified '+ayah.key);
 assert.equal(entry.language,'de');
 assert.equal(entry.status,'draft_review_required');
 assert(typeof entry.text==='string'&&entry.text.trim()&&!/[\u0600-\u06ff]/u.test(entry.text));
 assert(typeof entry.reviewer_note_tr==='string'&&entry.reviewer_note_tr.length>40);
 for(const flag of ['native_reviewer_approved','expert_approved','rights_reviewed','meaning_reviewed'])assert.equal(entry[flag],false,ayah.key+' unexpectedly approved');
 assert.equal(resolveGermanAyahMeaning(ayah,pack),null,'unapproved German meaning became public '+ayah.key);
 assert.equal(resolveGermanAyahMeaning(ayah,pack,{preview:true}),entry.text);
 assert.deepEqual({...auditGermanAyahSource(ayah,pack)},{source_matches:true,approved:false,has_german_draft:true});
 const forged=[
  {...ayah,key:'quraysh:'+(ayah.ayah===4?1:4)},
  {...ayah,ayah:ayah.ayah+1},
  {...ayah,surahId:'fil'},
  {...ayah,text:ayah.text+'۞'},
  {...ayah,audio:ayah.audio+'.tampered'},
  {...ayah,key:'masad:'+ayah.ayah,surahId:'masad'},
 ];
 for(const bad of forged){assert.equal(resolveGermanAyahMeaning(bad,pack,{preview:true}),null,'tampered Quran source accepted '+ayah.key);tamperingRejected++}
 const fakeApprovals={...pack,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(ayah,fakeApprovals),null,'per-verse false approval must override fake pack flags');tamperingRejected++;
}
assert.equal(resolveGermanAyahMeaning(quraysh[0],{...pack,locale:'tr'},{preview:true}),null);tamperingRejected++;
assert.equal(resolveGermanAyahMeaning({...manifest.entries[0],key:'missing:1',surahId:'missing'},pack,{preview:true}),null);tamperingRejected++;
let previewed=0,publicVisible=0;
for(const ayah of manifest.entries){
 if(resolveGermanAyahMeaning(ayah,pack,{preview:true})!==null)previewed++;
 if(resolveGermanAyahMeaning(ayah,pack)!==null)publicVisible++;
}
assert.equal(previewed,90);
assert.equal(publicVisible,0);
const comparison=pack.sources.comparative_only.filter(r=>r.comparison_scope==='Surah 106 Quraysh');
assert.equal(comparison.length,2);
assert(comparison.every(x=>x.text_copied_verbatim===false&&/^https:\/\//.test(x.url)));
console.log(JSON.stringify({
 status:'passed',surah:'Quraysh',new_ayah_drafts:4,total_staged_meanings:90,
 pending_meanings:39,verified_qa_preview_matches:4,public_meanings:0,
 negative_source_tests:tamperingRejected,source_arabic_audio_unchanged:true,
 qualified_native_religious_rights_review:'pending'
},null,2));
