/* An-Nas (114) six German meaning drafts must never change the source Quran/audio or release pending content. */
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
assert.equal(pack.ayah_count,25);
assert.equal(Object.keys(pack.translations).length,25);
for(const key of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(pack[key],false,'Whole-pack approval may not be assumed');
const nas=original.entries.filter(e=>e.surahId==='nas').sort((a,b)=>a.ayah-b.ayah);
assert.equal(nas.length,6);
assert.deepEqual(nas.map(x=>x.ayah),[1,2,3,4,5,6]);
assert.deepEqual(nas.map(x=>x.key),['nas:1','nas:2','nas:3','nas:4','nas:5','nas:6']);
const flags=['native_reviewer_approved','expert_approved','rights_reviewed','meaning_reviewed'];
let tamperingRejected=0;
for(const src of nas){
 const e=pack.translations[src.key];
 assert(e,'No German An-Nas meaning for '+src.key);
 assert.equal(e.source_ayah_key,src.key);
 assert.equal(e.surah_id,src.surahId);
 assert.equal(e.ayah_number,src.ayah);
 assert.equal(e.source_arabic_text,src.text,'Quran Arabic source changed at '+src.key);
 assert.equal(e.source_audio_path,src.audio,'Quran Arabic audio changed at '+src.key);
 assert.equal(e.language,'de');
 assert.equal(e.status,'draft_review_required');
 assert.equal(/[\u0600-\u06ff]/u.test(e.text),false,'German draft must not include Arabic substitution');
 assert(typeof e.reviewer_note_tr==='string'&&e.reviewer_note_tr.length>30);
 for(const flag of flags)assert.equal(e[flag],false,src.key+':approval_flag_'+flag);
 assert.equal(resolveGermanAyahMeaning(src,pack),null,'Production Quran text must not use pending German draft');
 assert.equal(resolveGermanAyahMeaning(src,pack,{preview:true}),e.text);
 assert.deepEqual({...auditGermanAyahSource(src,pack)},{source_matches:true,approved:false,has_german_draft:true});
 for(const forged of [
  {...src,key:'nas:'+(src.ayah===6?1:6)},
  {...src,surahId:'ikhlas'},
  {...src,ayah:src.ayah+1},
  {...src,text:src.text+'۞'},
  {...src,audio:src.audio+'.incorrect'},
  {...src,key:'falaq:'+Math.min(src.ayah,5),surahId:'falaq'},
 ]){
  assert.equal(resolveGermanAyahMeaning(forged,pack,{preview:true}),null,'Wrong Arabic/audio/source was accepted: '+src.key);
  tamperingRejected++;
 }
 const apparentlyApprovedPack={...pack,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(src,apparentlyApprovedPack),null,'Per-verse nonapproval must remain authoritative');
 tamperingRejected++;
}
assert.equal(resolveGermanAyahMeaning(nas[0],{...pack,locale:'tr'},{preview:true}),null);tamperingRejected++;
assert.equal(resolveGermanAyahMeaning(original.entries.find(x=>x.surahId==='asr'),pack,{preview:true}),null);tamperingRejected++;
let qa=0,publicCount=0;
for(const src of original.entries){
 if(resolveGermanAyahMeaning(src,pack,{preview:true})!==null)qa++;
 if(resolveGermanAyahMeaning(src,pack)!==null)publicCount++;
}
assert.equal(qa,25);
assert.equal(publicCount,0);
const refs=pack.sources.comparative_only.filter(s=>s.comparison_scope==='Surah 114 An-Nas');
assert.equal(refs.length,2);
assert(refs.every(r=>r.text_copied_verbatim===false&&/^https:\/\//.test(r.url)));
console.log(JSON.stringify({
 locale:'de',status:'passed',surah:'An-Nas',nas_drafts:6,total_quran_meaning_drafts:25,remaining_without_draft:65,
 correctly_matched_qa_previews:6,production_meanings_exposed:0,tamper_guard_negative_checks:tamperingRejected,
 arabic_quran_modified:false,original_audio_modified:false,native_religious_rights_approved:false,
 release_gate:'blocked'
},null,2));
