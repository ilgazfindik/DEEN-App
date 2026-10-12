/*
 * Generate review-ready JSONL for qualified reviewers; this does not grant approval.
 * Use separate source and target fields so no theological source content is hidden.
 */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const source='assets/i18n/questions/de/';
const names=[];
for(let u=1;u<=15;u++)for(let s=1;s<=7;s++)
 names.push(source+'staging/U'+String(u).padStart(2,'0')+'-S'+String(s).padStart(2,'0')+'.json');
for(let s=1;s<=7;s++)
 names.push(source+'runtime/staging/U01-S'+String(s).padStart(2,'0')+'.live.json');
names.push(source+'runtime/staging/U01.variants.json',
 source+'runtime/staging/U01.legacy-renderer.json');
const rows=[];
for(const filename of names){
 const pack=read(filename);
 assert(pack.expert_approved===false&&pack.verified_by_religious_expert===false&&
  pack.native_reviewer_approved===false,'Review pack must remain pending: '+filename);
 for(const [id,entry] of Object.entries(pack.translations)){
  rows.push({
   review_status:'PENDING_NATIVE_GERMAN_AND_ISLAMIC_EXPERT_REVIEW',
   key:pack.scope?pack.scope+':'+id:'base_staging:'+id,
   question_id:id,scope:pack.scope||'base_staging',unit:pack.unit,stage:pack.stage,
   source_file:filename,source_turkish:entry.source,german_draft:entry.display,
   reviewer:'',review_date:'',terminology_notes:'',source_approval_evidence:'',
   accept_or_revise:'',expert_religious_approval:false,native_german_approval:false
  });
 }
}
assert.equal(rows.length,1704);
const q=read('assets/i18n/quran/de/ayah-meanings.staging.json');
assert(q.release_ready===false&&q.expert_approved===false&&
 q.native_reviewer_approved===false&&q.rights_reviewed===false);
const verses=Object.entries(q.translations).map(([key,e])=>({
 review_status:'PENDING_EXPERT_NATIVE_AND_RIGHTS_REVIEW',
 ayah_key:key,surah_id:e.surah_id,ayah_number:e.ayah_number,
 source_arabic_text:e.source_arabic_text,source_audio_path:e.source_audio_path,
 german_meaning_draft:e.text,source_attribution:q.sources,
 pending_source_question:e.reviewer_note_tr||'',
 reviewer:'',review_date:'',meaning_accuracy_evidence:'',
 translation_license_evidence:'',attribution_license_evidence:'',
 native_german_approved:false,religious_expert_approved:false,rights_reviewed:false
}));
assert.equal(verses.length,90);
const dir='qa-artifacts/german-review';
mkdirSync(dir,{recursive:true});
writeFileSync(dir+'/question-versions.pending-review.jsonl',
 rows.map(row=>JSON.stringify(row)).join('\n')+'\n');
writeFileSync(dir+'/quran-meanings.pending-review.jsonl',
 verses.map(row=>JSON.stringify(row)).join('\n')+'\n');
writeFileSync(dir+'/README.txt',[
 'DEEN — German release candidate human review package',
 'Questions: 1704 source-guarded versions (1500 base, 84 live U01, 20 stored variants, 100 legacy)',
 'Quran meaning drafts: 90; original Arabic/audio are immutable.',
 'All rows are pending review. No automatic approval or license clearance is inferred.',
 'Reviewer must inspect Turkish source, German meaning, all alternatives, correct answer, theological accuracy and language.',
 'For Quran meanings, verify ayah number/source correspondence, translator/rights, attribution and permission for use.',
 'Retain review evidence outside the app; only promote content through a separately verified release process.',
 ''
].join('\n'));
console.log(JSON.stringify({question_versions:rows.length,ayah_meanings:verses.length,
 status:'PENDING_HUMAN_APPROVAL',dir}));
