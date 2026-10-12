/* Asr (103): draft German ayah meanings may be QA-previewed with exact
 * canonical Arabic/audio identities, never exposed in production pending review.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const manifest=read('assets/quran/audio/ayah-audio-manifest.json');
const stage=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const gate=read('assets/i18n/content-support.json').languages.de;
assert.equal(manifest.ayahCount,90);
assert.equal(manifest.entries.length,90);
assert.equal(gate.question_data,'missing');
assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
assert.equal(stage.locale,'de');
assert.equal(stage.scope,'quran_ayah_meanings_staging');
assert.equal(stage.ayah_count,66);
assert.equal(Object.keys(stage.translations).length,66);
for(const k of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(stage[k],false,k+': unexpected approval');
const asr=manifest.entries.filter(e=>e.surahId==='asr').sort((a,b)=>a.ayah-b.ayah);
assert.deepEqual(asr.map(e=>e.key),['asr:1','asr:2','asr:3']);
const falseFlags=['native_reviewer_approved','expert_approved','rights_reviewed','meaning_reviewed'];
let rejected=0;
for(const original of asr){
 const draft=stage.translations[original.key];
 assert(draft,'Missing German draft for '+original.key);
 assert.equal(draft.source_ayah_key,original.key);
 assert.equal(draft.surah_id,original.surahId);
 assert.equal(draft.ayah_number,original.ayah);
 assert.equal(draft.source_arabic_text,original.text);
 assert.equal(draft.source_audio_path,original.audio);
 assert.equal(draft.language,'de');
 assert.equal(draft.status,'draft_review_required');
 assert(typeof draft.text==='string'&&draft.text.trim()&&!/[\u0600-\u06ff]/u.test(draft.text));
 assert(draft.reviewer_note_tr.length>35);
 for(const k of falseFlags)assert.equal(draft[k],false,original.key+':'+k);
 assert.equal(resolveGermanAyahMeaning(original,stage),null,original.key+': must not release');
 assert.equal(resolveGermanAyahMeaning(original,stage,{preview:true}),draft.text,original.key+': source guarded preview');
 assert.deepEqual({...auditGermanAyahSource(original,stage)},{source_matches:true,approved:false,has_german_draft:true});
 const wrong=[
  {...original,key:'asr:'+(original.ayah===3?1:3)},
  {...original,surahId:'kawthar'},
  {...original,ayah:original.ayah+1},
  {...original,text:original.text+'۞'},
  {...original,audio:original.audio+'.incorrect'},
  {...original,key:'fatiha:'+original.ayah,surahId:'fatiha'}
 ];
 for(const source of wrong){assert.equal(resolveGermanAyahMeaning(source,stage,{preview:true}),null,original.key+': accepted tampering');rejected++}
 const falsePositivePack={...stage,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(original,falsePositivePack),null,'Pack cannot override per-ayah missing approvals');
 rejected++;
}
assert.equal(resolveGermanAyahMeaning(asr[0],{...stage,locale:'en'},{preview:true}),null);rejected++;
assert.equal(resolveGermanAyahMeaning(manifest.entries.find(e=>e.surahId==='tin'),stage,{preview:true}),null);rejected++;
let previews=0,production=0;
for(const source of manifest.entries){
 if(resolveGermanAyahMeaning(source,stage,{preview:true})!==null)previews++;
 if(resolveGermanAyahMeaning(source,stage)!==null)production++;
}
assert.equal(previews,66);
assert.equal(production,0);
const compared=stage.sources.comparative_only.filter(r=>r.comparison_scope==='Surah 103 Al-Asr');
assert.equal(compared.length,2);
assert(compared.every(r=>r.text_copied_verbatim===false&&/^https:\/\//.test(r.url)));
console.log(JSON.stringify({status:'passed',surah:'Al-Asr',source_ayahs:3,qa_preview_matches:3,
 quran_meaning_drafts:66,missing_meaning_drafts:24,production_visible:0,
 negative_source_guards:rejected,arabic_verses_modified:false,audio_modified:false,
 native_religious_rights_review:'pending'},null,2));
