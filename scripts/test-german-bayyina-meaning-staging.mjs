/* Al-Bayyinah (98): German ayah meanings are QA-only pending review.
 * Preserve exact canonical Arabic Quran / recorded audio source identity.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const canonical=read('assets/quran/audio/ayah-audio-manifest.json');
const draft=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const de=read('assets/i18n/content-support.json').languages.de;
assert.equal(canonical.ayahCount,90);
assert.equal(canonical.entries.length,90);
assert.equal(de.question_data,'missing');
assert.equal(de.global_qa,'blocked');
assert.equal(de.religious_expert_approved,false);
assert.equal(draft.locale,'de');
assert.equal(draft.scope,'quran_ayah_meanings_staging');
assert.equal(draft.ayah_count,82);
assert.equal(Object.keys(draft.translations).length,82);
for(const flag of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])
 assert.equal(draft[flag],false,flag+': German Quran may not be released');
const verses=canonical.entries.filter(v=>v.surahId==='bayyina').sort((a,b)=>a.ayah-b.ayah);
assert.deepEqual(verses.map(v=>v.key),Array.from({length:8},(_,i)=>'bayyina:'+(i+1)));
assert(draft.translations['bayyina:1'].text.endsWith(':'),'The clear proof in 98:1 must be identified in 98:2');
assert(draft.translations['bayyina:2'].text.endsWith(','),'The purified pages in 98:2 must be continued in 98:3');
assert(draft.translations['bayyina:3'].text.endsWith('.'),'98:3 should finish the prior explanation');
assert(draft.translations['bayyina:5'].text.includes('Gebet')&&draft.translations['bayyina:5'].text.includes('Abgabe'),'Prayer and zakat must both appear in 98:5');
assert(draft.translations['bayyina:6'].text.includes('Hölle'),'The contrasted warning in 98:6 must remain visible');
assert(draft.translations['bayyina:7'].text.includes('rechtschaffen'),'The contrasted righteous deeds in 98:7 must remain visible');
assert(draft.translations['bayyina:8'].text.includes('zufrieden'),'Mutual contentment in 98:8 must remain visible');
let tamperRejections=0;
for(const src of verses){
 const item=draft.translations[src.key];
 assert(item,src.key+': missing German draft');
 assert.equal(item.source_ayah_key,src.key);
 assert.equal(item.surah_id,'bayyina');
 assert.equal(item.ayah_number,src.ayah);
 assert.equal(item.source_arabic_text,src.text,'Exact Arabic verse identity must not change');
 assert.equal(item.source_audio_path,src.audio,'Original Quran recitation audio identity must not change');
 assert.equal(item.language,'de');
 assert.equal(item.status,'draft_review_required');
 assert(typeof item.text==='string'&&item.text.trim()&&!/[\u0600-\u06ff]/u.test(item.text));
 assert(typeof item.reviewer_note_tr==='string'&&item.reviewer_note_tr.length>40);
 for(const flag of ['expert_approved','native_reviewer_approved','rights_reviewed','meaning_reviewed'])
  assert.equal(item[flag],false,src.key+': review gate must remain closed: '+flag);
 assert.equal(resolveGermanAyahMeaning(src,draft),null,src.key+': not allowed to show in live Quran tab');
 assert.equal(resolveGermanAyahMeaning(src,draft,{preview:true}),item.text);
 assert.deepEqual({...auditGermanAyahSource(src,draft)},{source_matches:true,approved:false,has_german_draft:true});
 for(const forgedSrc of [
  {...src,key:'bayyina:'+(src.ayah===8?1:8)},
  {...src,ayah:src.ayah+1},
  {...src,surahId:'zilzal'},
  {...src,text:src.text+'۞'},
  {...src,audio:src.audio+'.altered'},
  {...src,key:'tin:'+src.ayah,surahId:'tin'}
 ]){
  assert.equal(resolveGermanAyahMeaning(forgedSrc,draft,{preview:true}),null,'Tampered Arabic/ayah/audio source accepted: '+src.key);
  tamperRejections++;
 }
 const forgedPack={...draft,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(src,forgedPack),null,'Unapproved verse cannot be made public by forging package flags');
 tamperRejections++;
}
assert.equal(resolveGermanAyahMeaning(verses[0],{...draft,locale:'tr'},{preview:true}),null);tamperRejections++;
assert.equal(resolveGermanAyahMeaning(canonical.entries.find(v=>v.surahId==='zilzal'),draft,{preview:true}),null);tamperRejections++;
let previews=0,publicVisible=0;
for(const src of canonical.entries){
 if(resolveGermanAyahMeaning(src,draft,{preview:true})!==null)previews++;
 if(resolveGermanAyahMeaning(src,draft)!==null)publicVisible++;
}
assert.equal(previews,82);
assert.equal(publicVisible,0);
const sources=draft.sources.comparative_only.filter(r=>r.comparison_scope==='Surah 98 Al-Bayyina');
assert.equal(sources.length,3);
assert(sources.every(r=>r.text_copied_verbatim===false&&/^https:\/\//.test(r.url)));
console.log(JSON.stringify({
 status:'passed',locale:'de',surah:'Al-Bayyina',new_ayah_drafts:8,
 overall_staged:82,remaining:8,source_matched_qa_previews:8,public_exposed:0,
 negative_source_checks:tamperRejections,verses_1_to_3_context_preserved:true,
 verse_5_prayer_and_zakat_preserved:true,verses_6_to_8_contrast_preserved:true,
 original_arabic_audio_modified:false,expert_native_rights_review:'pending'
},null,2));
