/* Surah Al-Kawthar (108): German meaning drafts are QA-only and pinned to exact Arabic/audio source. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const source=read('assets/quran/audio/ayah-audio-manifest.json');
const draft=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const support=read('assets/i18n/content-support.json').languages.de;
assert.equal(source.ayahCount,90);
assert.equal(source.entries.length,90);
assert.equal(support.question_data,'missing');
assert.equal(support.global_qa,'blocked');
assert.equal(support.religious_expert_approved,false);
assert.equal(draft.locale,'de');
assert.equal(draft.scope,'quran_ayah_meanings_staging');
assert.equal(draft.ayah_count,25);
assert.equal(Object.keys(draft.translations).length,25);
for(const flag of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(draft[flag],false);
const kawthar=source.entries.filter(e=>e.surahId==='kawthar').sort((a,b)=>a.ayah-b.ayah);
assert.deepEqual(kawthar.map(e=>e.key),['kawthar:1','kawthar:2','kawthar:3']);
let failClosedCases=0;
for(const ayah of kawthar){
 const item=draft.translations[ayah.key];
 assert(item,'Missing German draft for '+ayah.key);
 assert.equal(item.source_ayah_key,ayah.key);
 assert.equal(item.surah_id,ayah.surahId);
 assert.equal(item.ayah_number,ayah.ayah);
 assert.equal(item.source_arabic_text,ayah.text);
 assert.equal(item.source_audio_path,ayah.audio);
 assert.equal(item.language,'de');
 assert.equal(item.status,'draft_review_required');
 assert(item.reviewer_note_tr.length>=30);
 assert(!/[\u0600-\u06ff]/u.test(item.text));
 for(const flag of ['expert_approved','native_reviewer_approved','rights_reviewed','meaning_reviewed'])assert.equal(item[flag],false);
 assert.equal(resolveGermanAyahMeaning(ayah,draft),null,'Must never expose pending Quran meaning to public');
 assert.equal(resolveGermanAyahMeaning(ayah,draft,{preview:true}),item.text);
 assert.deepEqual({...auditGermanAyahSource(ayah,draft)},{source_matches:true,approved:false,has_german_draft:true});
 for(const bad of [
  {...ayah,key:'kawthar:'+(ayah.ayah===3?1:3)},
  {...ayah,surahId:'ikhlas'},
  {...ayah,ayah:ayah.ayah+1},
  {...ayah,text:ayah.text+'۞'},
  {...ayah,audio:ayah.audio+'.tampered'},
  {...ayah,key:'fatiha:'+ayah.ayah,surahId:'fatiha'}
 ]){
  assert.equal(resolveGermanAyahMeaning(bad,draft,{preview:true}),null,'Wrong audio/Arabic/ayah identity accepted for '+ayah.key);
  failClosedCases++;
 }
 const forged={...draft,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(ayah,forged),null,'Individual meaning review cannot be overridden');
 failClosedCases++;
}
assert.equal(resolveGermanAyahMeaning(kawthar[0],{...draft,locale:'tr'},{preview:true}),null);failClosedCases++;
assert.equal(resolveGermanAyahMeaning(source.entries.find(e=>e.surahId==='asr'),draft,{preview:true}),null);failClosedCases++;
let previews=0,publicMeanings=0;
for(const ayah of source.entries){
 if(resolveGermanAyahMeaning(ayah,draft,{preview:true})!==null)previews++;
 if(resolveGermanAyahMeaning(ayah,draft)!==null)publicMeanings++;
}
assert.equal(previews,25);
assert.equal(publicMeanings,0);
const citations=draft.sources.comparative_only.filter(x=>x.comparison_scope==='Surah 108 Al-Kawthar');
assert.equal(citations.length,3);
assert(citations.every(x=>x.text_copied_verbatim===false&&/^https:\/\//.test(x.url)));
console.log(JSON.stringify({
 status:'passed',surah:'Al-Kawthar',new_ayahs:3,total_german_meaning_drafts:25,remaining:65,
 correctly_matched_qa_previews:3,negative_guard_cases:failClosedCases,public_meanings:0,
 arabic_verses_or_audio_modified:false,religious_native_rights_approval:'pending'
},null,2));
