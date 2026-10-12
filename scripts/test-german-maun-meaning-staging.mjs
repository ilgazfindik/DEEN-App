/* Al-Maun (107): Quran German meaning staging is source-guarded and unreleased. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';
const base=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(base+p,'utf8'));
const canonical=read('assets/quran/audio/ayah-audio-manifest.json');
const pack=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const gate=read('assets/i18n/content-support.json').languages.de;
assert.equal(canonical.ayahCount,90);
assert.equal(canonical.entries.length,90);
assert.equal(gate.question_data,'missing');
assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
assert.equal(pack.locale,'de');
assert.equal(pack.scope,'quran_ayah_meanings_staging');
assert.equal(pack.ayah_count,74);
assert.equal(Object.keys(pack.translations).length,74);
for(const f of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(pack[f],false,'Global review incomplete '+f);
const maun=canonical.entries.filter(x=>x.surahId==='maun').sort((a,b)=>a.ayah-b.ayah);
assert.deepEqual(maun.map(x=>x.key),['maun:1','maun:2','maun:3','maun:4','maun:5','maun:6','maun:7']);
assert(pack.translations['maun:4'].text.endsWith(','),'Warning in 107:4 must be completed by 107:5');
assert(pack.translations['maun:5'].text.endsWith(','),'Negligent worshipers linked to their context');
let tamperingGuards=0;
for(const original of maun){
 const entry=pack.translations[original.key];
 assert(entry,'Missing Maun German draft '+original.key);
 assert.equal(entry.source_ayah_key,original.key);
 assert.equal(entry.surah_id,'maun');
 assert.equal(entry.ayah_number,original.ayah);
 assert.equal(entry.source_arabic_text,original.text,'Canonical Quran Arabic mismatch');
 assert.equal(entry.source_audio_path,original.audio,'Canonical recitation audio mismatch');
 assert.equal(entry.language,'de');
 assert.equal(entry.status,'draft_review_required');
 assert(typeof entry.text==='string'&&entry.text.trim()&&!/[\u0600-\u06ff]/u.test(entry.text));
 assert(typeof entry.reviewer_note_tr==='string'&&entry.reviewer_note_tr.length>40);
 for(const f of ['expert_approved','native_reviewer_approved','rights_reviewed','meaning_reviewed'])assert.equal(entry[f],false,original.key+':'+f);
 assert.equal(resolveGermanAyahMeaning(original,pack),null,'Unapproved meaning exposed in public mode');
 assert.equal(resolveGermanAyahMeaning(original,pack,{preview:true}),entry.text,'QA source lookup must succeed');
 assert.deepEqual({...auditGermanAyahSource(original,pack)},{source_matches:true,approved:false,has_german_draft:true});
 const altered=[
  {...original,key:'maun:'+(original.ayah===7?1:7)},
  {...original,ayah:original.ayah+1},
  {...original,surahId:'sharh'},
  {...original,text:original.text+'۞'},
  {...original,audio:original.audio+'.changed'},
  {...original,key:'quraysh:'+Math.min(original.ayah,4),surahId:'quraysh'}
 ];
 for(const bad of altered){assert.equal(resolveGermanAyahMeaning(bad,pack,{preview:true}),null,'Source integrity guard failed: '+original.key);tamperingGuards++;}
 const forged={...pack,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(original,forged),null,'Per-ayah false reviews must block forged global release');tamperingGuards++;
}
assert.equal(resolveGermanAyahMeaning(maun[0],{...pack,locale:'en'},{preview:true}),null);tamperingGuards++;
assert.equal(resolveGermanAyahMeaning(canonical.entries.find(x=>x.surahId==='bayyina'),pack,{preview:true}),null);tamperingGuards++;
let qaDrafts=0,publicDrafts=0;
for(const x of canonical.entries){
 if(resolveGermanAyahMeaning(x,pack,{preview:true})!==null)qaDrafts++;
 if(resolveGermanAyahMeaning(x,pack)!==null)publicDrafts++;
}
assert.equal(qaDrafts,74);
assert.equal(publicDrafts,0);
const compared=pack.sources.comparative_only.filter(x=>x.comparison_scope==='Surah 107 Al-Maun');
assert.equal(compared.length,3);
assert(compared.every(x=>x.text_copied_verbatim===false&&/^https:\/\//.test(x.url)));
console.log(JSON.stringify({status:'passed',locale:'de',surah:'Al-Maun',new_ayah_drafts:7,
 staged_total:74,remaining_missing:16,qa_previews:7,production_exposed:0,
 negative_integrity_checks:tamperingGuards,verse_4_5_warning_context_preserved:true,
 canonical_arabic_audio_modified:false,religious_native_rights_review:'pending'},null,2));
