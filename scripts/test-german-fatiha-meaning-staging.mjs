import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const read=path=>JSON.parse(readFileSync(root+path,'utf8'));
const original=read('assets/quran/audio/ayah-audio-manifest.json');
const stage=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const gate=read('assets/i18n/content-support.json').languages.de;
assert.equal(gate.question_data,'missing');
assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
assert.equal(original.ayahCount,90);
assert.equal(original.entries.length,90);
assert.equal(stage.ayah_count,58);
assert.equal(Object.keys(stage.translations).length,58);
assert.equal(stage.scope,'quran_ayah_meanings_staging');
assert.equal(stage.locale,'de');
for(const k of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(stage[k],false,'pack_not_approved:'+k);
assert.equal(stage.sources.canonical_arabic,'assets/quran/audio/ayah-audio-manifest.json');
assert.equal(stage.sources.external_translation_imported,false);
assert.equal(stage.sources.comparative_only.length,29);
for(const ref of stage.sources.comparative_only){
 assert.equal(ref.text_copied_verbatim,false);
 assert(/^https:\/\//.test(ref.url));
}
const fixtures=original.entries.filter(e=>e.surahId==='fatiha').sort((a,b)=>a.ayah-b.ayah);
assert.equal(fixtures.length,7);
const flags=['native_reviewer_approved','expert_approved','rights_reviewed','meaning_reviewed'];
for(const source of fixtures){
 const key=source.key,entry=stage.translations[key];
 assert(entry,'missing Fatiha German draft '+key);
 assert.equal(entry.surah_id,'fatiha');
 assert.equal(entry.ayah_number,source.ayah);
 assert.equal(entry.source_ayah_key,key);
 assert.equal(entry.source_arabic_text,source.text,'Arabic transcription mismatch '+key);
 assert.equal(entry.source_audio_path,source.audio,'Audio mismatch '+key);
 assert.equal(entry.language,'de');
 assert.equal(entry.status,'draft_review_required');
 assert(typeof entry.reviewer_note_tr==='string'&&entry.reviewer_note_tr.length>15);
 for(const flag of flags)assert.equal(entry[flag],false,flag+':'+key);
 assert.equal(resolveGermanAyahMeaning(source,stage),null,'Unapproved Quran meaning released: '+key);
 assert.equal(resolveGermanAyahMeaning(source,stage,{preview:true}),entry.text,'QA draft lookup failed: '+key);
 assert.deepEqual({...auditGermanAyahSource(source,stage)},{source_matches:true,approved:false,has_german_draft:true});
 for(const mutation of [
  {...source,text:source.text+'۞'},
  {...source,audio:source.audio+'.incorrect'},
  {...source,ayah:source.ayah+1},
  {...source,key:'fatiha:'+(source.ayah===7?1:7)},
  {...source,surahId:'ikhlas'}
 ])assert.equal(resolveGermanAyahMeaning(mutation,stage,{preview:true}),null,'Wrong Arabic source/audio/index accepted '+key);
}
let found=0;
for(const ayah of original.entries){
 const preview=resolveGermanAyahMeaning(ayah,stage,{preview:true});
 const prod=resolveGermanAyahMeaning(ayah,stage);
 assert.equal(prod,null,'Production Quran meaning must remain blocked '+ayah.key);
 if(preview!==null)found++;
 else assert.notEqual(ayah.surahId,'fatiha','Missing Fatiha draft '+ayah.key);
}
assert.equal(found,58,'Fatiha 7 + Ikhlas 4 + Falaq 5 + Nas 6 + Kawthar 3 + Asr 3 + Kafirun 6 + Nasr 3 + Masad 5 + Fil 5 + Quraysh 4 + Maun 7 drafts must all resolve in isolated QA');
assert.equal(original.entries.length-found,32);
assert.equal(resolveGermanAyahMeaning(null,stage,{preview:true}),null);
assert.equal(resolveGermanAyahMeaning({key:'fatiha:99'},stage,{preview:true}),null);
assert.equal(resolveGermanAyahMeaning(fixtures[0],{...stage,locale:'tr'},{preview:true}),null);
assert.equal(resolveGermanAyahMeaning(fixtures[0],{...stage,translations:{}},{preview:true}),null);
assert.equal(resolveGermanAyahMeaning(fixtures[0],stage,{preview:false}),null);
const forgedPack={...stage,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
assert.equal(resolveGermanAyahMeaning(fixtures[0],forgedPack),null,'One unapproved entry cannot inherit approval from its pack');
const report={
 status:'passed',locale:'de',surah:'fatiha',total_ayahs:90,staged_german_meanings:58,
 remaining_german_meanings:32,qa_preview_valid:58,production_allowed:0,
 negative_source_guards:7*5+6,production_release_gate:'blocked',
 arabic_and_audio_unchanged:true,expert_native_rights_approved:false
};
console.log(JSON.stringify(report,null,2));
