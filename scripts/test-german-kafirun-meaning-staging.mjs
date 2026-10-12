/* Al-Kafirun 109: exact 6-ayah German meaning draft source/audio verification.
 * QA preview only; no German Quran meaning is approved for the production UI.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const source=read('assets/quran/audio/ayah-audio-manifest.json');
const pack=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const language=read('assets/i18n/content-support.json').languages.de;
assert.equal(source.ayahCount,90);
assert.equal(source.entries.length,90);
assert.equal(language.question_data,'missing');
assert.equal(language.global_qa,'blocked');
assert.equal(language.religious_expert_approved,false);
assert.equal(pack.locale,'de');
assert.equal(pack.scope,'quran_ayah_meanings_staging');
assert.equal(pack.ayah_count,58);
assert.equal(Object.keys(pack.translations).length,58);
for(const flag of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(pack[flag],false,'Global gate must remain blocked');
const kafirun=source.entries.filter(e=>e.surahId==='kafirun').sort((a,b)=>a.ayah-b.ayah);
assert.deepEqual(kafirun.map(e=>e.key),['kafirun:1','kafirun:2','kafirun:3','kafirun:4','kafirun:5','kafirun:6']);
assert.equal(kafirun[2].text,kafirun[4].text,'Arabic verses 3 and 5 must match exactly');
assert.equal(pack.translations['kafirun:3'].text,pack.translations['kafirun:5'].text,'Matching Arabic verses 3 and 5 must share the same German meaning');
const reviewFlags=['expert_approved','native_reviewer_approved','rights_reviewed','meaning_reviewed'];
let rejected=0;
for(const original of kafirun){
 const item=pack.translations[original.key];
 assert(item,original.key+': no draft');
 assert.equal(item.source_ayah_key,original.key);
 assert.equal(item.surah_id,original.surahId);
 assert.equal(item.ayah_number,original.ayah);
 assert.equal(item.source_arabic_text,original.text,'Arabic verse mismatch');
 assert.equal(item.source_audio_path,original.audio,'Audio source mismatch');
 assert.equal(item.language,'de');
 assert.equal(item.status,'draft_review_required');
 assert(typeof item.reviewer_note_tr==='string'&&item.reviewer_note_tr.length>25);
 assert(typeof item.text==='string'&&!!item.text.trim()&&!/[\u0600-\u06ff]/u.test(item.text));
 for(const flag of reviewFlags)assert.equal(item[flag],false,original.key+':'+flag);
 assert.equal(resolveGermanAyahMeaning(original,pack),null,original.key+':unapproved text exposed');
 assert.equal(resolveGermanAyahMeaning(original,pack,{preview:true}),item.text,original.key+':preview mismatch');
 assert.deepEqual({...auditGermanAyahSource(original,pack)},{source_matches:true,approved:false,has_german_draft:true});
 for(const bad of [
  {...original,key:'kafirun:'+(original.ayah===6?1:6)},
  {...original,ayah:original.ayah+1},
  {...original,surahId:'nasr'},
  {...original,text:original.text+'۞'},
  {...original,audio:original.audio+'.broken'},
  {...original,key:'asr:'+Math.min(original.ayah,3),surahId:'asr'}
 ]){
  assert.equal(resolveGermanAyahMeaning(bad,pack,{preview:true}),null,'Wrong Arabic/surah/verse/audio accepted '+original.key);
  rejected++;
 }
 const forged={...pack,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(original,forged),null,'Per-ayah review may not be overridden');
 rejected++;
}
assert.equal(resolveGermanAyahMeaning(kafirun[0],{...pack,locale:'tr'},{preview:true}),null);
rejected++;
assert.equal(resolveGermanAyahMeaning(source.entries.find(e=>e.surahId==='sharh'),pack,{preview:true}),null);
rejected++;
let qa=0,prod=0;
for(const entry of source.entries){
 if(resolveGermanAyahMeaning(entry,pack,{preview:true})!==null)qa++;
 if(resolveGermanAyahMeaning(entry,pack)!==null)prod++;
}
assert.equal(qa,58);
assert.equal(prod,0);
const sources=pack.sources.comparative_only.filter(r=>r.comparison_scope==='Surah 109 Al-Kafirun');
assert.equal(sources.length,2);
assert(sources.every(s=>s.text_copied_verbatim===false&&/^https:\/\//.test(s.url)));
console.log(JSON.stringify({
 status:'passed',surah:'Al-Kafirun',new_ayah_drafts:6,all_german_draft_meanings:58,
 still_missing:32,arabic_repeat_verses_3_and_5_checked:true,source_matched_previews:6,
 production_visible:0,negative_guard_checks:rejected,arabic_or_audio_changed:false,
 qualified_religious_native_rights_approvals:false
},null,2));
