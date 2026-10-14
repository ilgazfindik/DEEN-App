/* Fail closed: a green staging CI is not production French approval. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const manifest=read('assets/i18n/content-support.json');
const audio=read('assets/quran/audio/ayah-audio-manifest.json');
const timing=read('assets/quran/audio/word-timings.json');
const rights=read('assets/quran/audio/fr-rights-evidence.staging.json');
const reviews=read('qa/FRENCH_P12_HUMAN_REVIEW.staging.json');
assert.equal(audio.entries.length,audio.ayahCount,'MP3 inventory drift');
assert.equal(rights.records.length,audio.ayahCount,'Rights inventory drift');
assert(timing.entries&&typeof timing.entries==='object'&&!Array.isArray(timing.entries),'Timing schema drift');
assert.equal(reviews.schema_version,1);
assert.equal(reviews.releaseReady,false,'Reviews must not enable release');
assert.equal(reviews.status,'draft_human_review_required');
const required=['native_french_editor','islamic_subject_expert','u13_source_editor',
 'quran_recitation_expert','audio_rights_review','quran_french_meaning_review',
 'p10_policy_copy_review','fr_selected_locale_integration',
 'ios_safari_physical_device','android_chrome_physical_device',
 'release_regression_signoff'];
const seen=new Set(),pending=[],submitted=[];
for(const item of reviews.requirements){
 assert(typeof item.id==='string'&&required.includes(item.id),'Unknown reviewer gate');
 assert(!seen.has(item.id),'Duplicate reviewer gate');
 seen.add(item.id);
 assert(['pending','evidence_submitted'].includes(item.status),'Illegal reviewer approval status');
 if(item.status==='pending'){
  pending.push(item.id);
  assert(item.reviewer===null&&item.evidence_ref===null&&item.reviewed_at===null,
   'Pending review incorrectly implies signoff');
 }else{
  submitted.push(item.id);
  for(const field of ['reviewer','evidence_ref','reviewed_at'])
   assert(typeof item[field]==='string'&&item[field].trim(),
    'Submitted review missing evidence '+item.id);
 }
}
assert.equal(seen.size,required.length,'Missing independent reviewer gate');
const fr=manifest.languages.fr;
assert.equal(fr.question_data,'missing','Unapproved FR question bank unlocked');
assert.equal(fr.global_qa,'blocked','Unapproved FR global QA unlocked');
assert.equal(fr.religious_expert_approved,false,'Unapproved FR religious gate unlocked');
assert.equal(rights.releaseReady,false);
assert.equal(rights.frenchMeaning.releaseReady,false);
const timings=Object.keys(timing.entries).length;
const remainingRights=rights.records.filter(x=>x.permissionStatus!=='evidence_submitted').length;
const remainingRecitation=rights.records.filter(x=>x.recitationReview!=='review_submitted').length;
const blockers=[
 'real_fr_locale_still_blocked',
 ...timings<audio.ayahCount?['word_timing_alignment_missing']:[],
 ...remainingRights?['audio_rights_evidence_missing']:[],
 ...remainingRecitation?['quran_recitation_review_missing']:[],
 ...rights.frenchMeaning.rightsEvidenceRef===null?['french_meaning_rights_missing']:[],
 ...pending.map(x=>'review_pending:'+x),
 ...submitted.map(x=>'review_evidence_not_independently_verified:'+x)
];
const result={scope:'french_production_release_gate',status:'blocked',
 productionReleaseAllowed:false,audioAssets:audio.ayahCount,wordTimingCandidates:timings,
 audioRightsEvidenceMissing:remainingRights,recitationReviewsMissing:remainingRecitation,
 reviewerGatesPending:pending.length,reviewerEvidenceSubmitted:submitted.length,
 reasons:blockers,source:'production_manifest_and_staging_evidence',
 note:'No tool run certifies translation correctness, commercial licenses or religious reviews.'};
mkdirSync('qa-artifacts/french-release',{recursive:true});
writeFileSync('qa-artifacts/french-release/gates.json',JSON.stringify(result,null,2)+'\n');
console.log('FR_RELEASE_GATE '+JSON.stringify(result));
if(process.env.FR_RELEASE_ENFORCE==='1')
 throw Error('FR_RELEASE_BLOCKED: '+blockers.join(','));
