/* An-Nasr (110): German meaning drafts are staging-only, pinned to the
 * exact original Quran Arabic and unchanged audio recordings.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const source=read('assets/quran/audio/ayah-audio-manifest.json');
const pack=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const lang=read('assets/i18n/content-support.json').languages.de;
assert.equal(source.ayahCount,90);
assert.equal(source.entries.length,90);
assert.equal(lang.question_data,'missing');
assert.equal(lang.global_qa,'blocked');
assert.equal(lang.religious_expert_approved,false);
assert.equal(pack.locale,'de');
assert.equal(pack.scope,'quran_ayah_meanings_staging');
assert.equal(pack.ayah_count,37);
assert.equal(Object.keys(pack.translations).length,37);
for(const flag of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(pack[flag],false,'Global German meaning release gate must be blocked: '+flag);
const nasr=source.entries.filter(e=>e.surahId==='nasr').sort((x,y)=>x.ayah-y.ayah);
assert.deepEqual(nasr.map(x=>x.key),['nasr:1','nasr:2','nasr:3']);
const flags=['native_reviewer_approved','expert_approved','rights_reviewed','meaning_reviewed'];
let rejected=0;
for(const ayah of nasr){
 const item=pack.translations[ayah.key];
 assert(item,'No German An-Nasr draft for '+ayah.key);
 assert.equal(item.source_ayah_key,ayah.key);
 assert.equal(item.surah_id,'nasr');
 assert.equal(item.ayah_number,ayah.ayah);
 assert.equal(item.source_arabic_text,ayah.text,'Canonical Arabic mismatch');
 assert.equal(item.source_audio_path,ayah.audio,'Canonical recitation audio mismatch');
 assert.equal(item.language,'de');
 assert.equal(item.status,'draft_review_required');
 assert(item.reviewer_note_tr.length>30);
 assert(typeof item.text==='string'&&!!item.text.trim()&&!/[\u0600-\u06ff]/u.test(item.text));
 for(const flag of flags)assert.equal(item[flag],false,ayah.key+':'+flag);
 assert.equal(resolveGermanAyahMeaning(ayah,pack),null,ayah.key+': public German meaning must remain inaccessible');
 assert.equal(resolveGermanAyahMeaning(ayah,pack,{preview:true}),item.text,ayah.key+': source-matched QA preview');
 assert.deepEqual({...auditGermanAyahSource(ayah,pack)},{source_matches:true,approved:false,has_german_draft:true});
 for(const modified of [
  {...ayah,key:'nasr:'+(ayah.ayah===3?1:3)},
  {...ayah,surahId:'masad'},
  {...ayah,ayah:ayah.ayah+1},
  {...ayah,text:ayah.text+'۞'},
  {...ayah,audio:ayah.audio+'.tampered'},
  {...ayah,key:'ikhlas:'+Math.min(ayah.ayah,4),surahId:'ikhlas'}
 ]){
  assert.equal(resolveGermanAyahMeaning(modified,pack,{preview:true}),null,ayah.key+': mutated source must be blocked');
  rejected++;
 }
 const forgedPack={...pack,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(ayah,forgedPack),null,'Per-ayah false approval must override forged pack approval');rejected++;
}
assert.equal(resolveGermanAyahMeaning(nasr[0],{...pack,locale:'tr'},{preview:true}),null);rejected++;
assert.equal(resolveGermanAyahMeaning(source.entries.find(e=>e.surahId==='masad'),pack,{preview:true}),null);rejected++;
let qa=0,publicAllowed=0;
for(const e of source.entries){
 if(resolveGermanAyahMeaning(e,pack,{preview:true})!==null)qa++;
 if(resolveGermanAyahMeaning(e,pack)!==null)publicAllowed++;
}
assert.equal(qa,37);
assert.equal(publicAllowed,0);
const compared=pack.sources.comparative_only.filter(r=>r.comparison_scope==='Surah 110 An-Nasr');
assert.equal(compared.length,2);
assert(compared.every(ref=>ref.text_copied_verbatim===false&&/^https:\/\//.test(ref.url)));
console.log(JSON.stringify({
 status:'passed',surah:'An-Nasr',new_ayah_drafts:3,combined_staging_meanings:37,
 remaining_meanings:53,source_matched_QA_previews:3,public_meanings:0,negative_guard_checks:rejected,
 arabic_or_audio_modified:false,native_religious_rights_approved:false,release_gate:'blocked'
},null,2));
