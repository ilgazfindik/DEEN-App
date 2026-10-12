/* Ash-Sharh (94): all eight German meaning drafts are QA-only.
 * Verify exact canonical Arabic/ayah/audio mapping and immutable release gates.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const original=read('assets/quran/audio/ayah-audio-manifest.json');
const stage=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const gate=read('assets/i18n/content-support.json').languages.de;
assert.equal(original.ayahCount,90);
assert.equal(original.entries.length,90);
assert.equal(gate.question_data,'missing');
assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
assert.equal(stage.locale,'de');
assert.equal(stage.scope,'quran_ayah_meanings_staging');
assert.equal(stage.ayah_count,82);
assert.equal(Object.keys(stage.translations).length,82);
for(const flag of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(stage[flag],false,'The release gate must remain blocked');
const verses=original.entries.filter(x=>x.surahId==='sharh').sort((a,b)=>a.ayah-b.ayah);
assert.deepEqual(verses.map(x=>x.key),Array.from({length:8},(_,i)=>'sharh:'+(i+1)));
assert(stage.translations['sharh:2'].text.endsWith(','),'Verse 2 must lead to the defining relative clause in verse 3');
assert(stage.translations['sharh:3'].text.endsWith('?'),'Verse 3 must complete the rhetorical question');
for(const id of ['sharh:5','sharh:6'])assert(stage.translations[id].text.includes('mit der Erschwernis ist auch Erleichterung verbunden.'),'Repeated ease-with-hardship promise lost in '+id);
let negativeChecks=0;
for(const src of verses){
 const e=stage.translations[src.key];
 assert(e,'Missing German Ash-Sharh draft '+src.key);
 assert.equal(e.source_ayah_key,src.key);
 assert.equal(e.surah_id,'sharh');
 assert.equal(e.ayah_number,src.ayah);
 assert.equal(e.source_arabic_text,src.text,'Canonical Quran verse mismatch');
 assert.equal(e.source_audio_path,src.audio,'Original recitation audio mismatch');
 assert.equal(e.language,'de');
 assert.equal(e.status,'draft_review_required');
 assert(typeof e.text==='string'&&e.text.trim()&&!/[\u0600-\u06ff]/u.test(e.text));
 assert(typeof e.reviewer_note_tr==='string'&&e.reviewer_note_tr.length>50);
 for(const flag of ['native_reviewer_approved','expert_approved','rights_reviewed','meaning_reviewed'])assert.equal(e[flag],false,src.key+':unapproved');
 assert.equal(resolveGermanAyahMeaning(src,stage),null,'Unreviewed German Quran meaning was released');
 assert.equal(resolveGermanAyahMeaning(src,stage,{preview:true}),e.text,'QA preview missing or mismatched');
 assert.deepEqual({...auditGermanAyahSource(src,stage)},{source_matches:true,approved:false,has_german_draft:true});
 for(const changed of [
  {...src,key:'sharh:'+(src.ayah===8?1:8)},
  {...src,ayah:src.ayah+1},
  {...src,surahId:'tin'},
  {...src,text:src.text+'۞'},
  {...src,audio:src.audio+'.wrong'},
  {...src,key:'fatiha:'+src.ayah,surahId:'fatiha'}
 ]){
  assert.equal(resolveGermanAyahMeaning(changed,stage,{preview:true}),null,src.key+':invalid source incorrectly accepted');negativeChecks++;
 }
 const forged={...stage,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(src,forged),null,'Per-verse unapproved flags remain authoritative');negativeChecks++;
}
assert.equal(resolveGermanAyahMeaning(verses[0],{...stage,locale:'tr'},{preview:true}),null);negativeChecks++;
assert.equal(resolveGermanAyahMeaning(original.entries.find(x=>x.surahId==='zilzal'),stage,{preview:true}),null);negativeChecks++;
let qaCount=0,publicCount=0;
for(const src of original.entries){
 if(resolveGermanAyahMeaning(src,stage,{preview:true})!==null)qaCount++;
 if(resolveGermanAyahMeaning(src,stage)!==null)publicCount++;
}
assert.equal(qaCount,82);
assert.equal(publicCount,0);
const sources=stage.sources.comparative_only.filter(x=>x.comparison_scope==='Surah 94 Ash-Sharh');
assert.equal(sources.length,2);
assert(sources.every(s=>s.text_copied_verbatim===false&&/^https:\/\//.test(s.url)));
console.log(JSON.stringify({
 status:'passed',locale:'de',surah:'Ash-Sharh',new_drafts:8,total_staged:82,
 missing_meanings:8,correct_qa_previews:8,public_exposed:0,negative_guard_checks:negativeChecks,
 preserved_verse_2_3_connection:true,preserved_verse_5_6_repetition:true,
 canonical_arabic_audio_untouched:true,expert_native_rights_review:'pending'
},null,2));
