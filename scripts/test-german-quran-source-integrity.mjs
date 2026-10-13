/*
 * Source/ayah/audio reference audit for 90 unapproved German Quran meaning
 * drafts. No Quran translation approval, licensing opinion, nor file writes.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const originals=read('assets/quran/audio/ayah-audio-manifest.json');
const drafts=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const prod=read('assets/i18n/content-support.json');
assert.equal(originals.schemaVersion,1);
assert.equal(originals.ayahCount,90);
assert.equal(originals.entries.length,90);
assert.equal(drafts.locale,'de');
assert.equal(drafts.ayah_count,90);
assert.equal(drafts.release_ready,false);
assert.equal(drafts.expert_approved,false);
assert.equal(drafts.verified_by_religious_expert,false);
assert.equal(drafts.native_reviewer_approved,false);
assert.equal(drafts.rights_reviewed,false);
assert.equal(prod.languages.de.global_qa,'blocked');
assert.equal(prod.languages.de.question_data,'missing');
assert.equal(prod.languages.de.religious_expert_approved,false);
const seen=new Set();
const mismatches=[];
const perSurah={};
const exactKeys=new Set(Object.keys(drafts.translations));
const blank=/^\s*$/u;
for(const ayah of originals.entries){
 const key=ayah.key;
 if(seen.has(key))mismatches.push({key,error:'AUDIO_MANIFEST_DUPLICATE'});
 seen.add(key);
 const target=drafts.translations[key];
 if(!target){mismatches.push({key,error:'NO_MEANING'});continue}
 if(target.source_ayah_key!==key||target.surah_id!==ayah.surahId
    ||target.ayah_number!==ayah.ayah||target.source_arabic_text!==ayah.text
    ||target.source_audio_path!==ayah.audio)
  mismatches.push({key,error:'ARABIC_OR_AUDIO_SOURCE_MISMATCH'});
 if(typeof target.text!=='string'||blank.test(target.text))
  mismatches.push({key,error:'EMPTY_GERMAN_MEANING'});
 if(target.language!=='de'||target.status!=='draft_review_required'||
    target.expert_approved!==false||target.meaning_reviewed!==false||
    target.native_reviewer_approved!==false||target.rights_reviewed!==false)
  mismatches.push({key,error:'PREMATURE_RELEASE_APPROVAL'});
 perSurah[ayah.surahId]=(perSurah[ayah.surahId]||0)+1;
 exactKeys.delete(key);
}
for(const key of exactKeys)mismatches.push({key,error:'EXTRA_OR_UNMATCHED_MEANING'});
assert.deepEqual(mismatches,[],'Arabic/ayah/audio source reference or release guard drift');
assert.equal(seen.size,90);
console.log(JSON.stringify({
 status:'passed_source_reference_only',not_human_approved:true,
 counts:{arabic_source_ayahs:originals.entries.length,german_drafts:Object.keys(drafts.translations).length},
 surahs:perSurah,source_mismatches:mismatches.length,
 rights_reviewed:false,expert_approved:false,
 live_german_activation:false},null,2));
