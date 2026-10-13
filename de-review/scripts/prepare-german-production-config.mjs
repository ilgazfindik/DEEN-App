/* Offline German release candidate builder. NEVER self-approves review.
 * Default mode writes only a blocked JSON candidate in qa/; --apply requires
 * externally supplied native/religious/rights approval evidence and validation.
 */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=path=>readFileSync(path,'utf8');
const json=path=>JSON.parse(read(path));
const hash=s=>createHash('sha256').update(s).digest('hex');
const draft=json('assets/i18n/content-support.json');
assert.equal(draft.languages.de.question_data,'missing','Do not regenerate over published German data');
assert.equal(draft.languages.de.global_qa,'blocked','Do not overwrite an existing German public release');
const base=[];
for(let u=1;u<=15;u++)for(let s=1;s<=7;s++)
 base.push('assets/i18n/questions/de/staging/U'+String(u).padStart(2,'0')+
  '-S'+String(s).padStart(2,'0')+'.json');
const live=Array.from({length:7},(_,i)=>'assets/i18n/questions/de/runtime/staging/U01-S0'+(i+1)+'.live.json');
const variants=['assets/i18n/questions/de/runtime/staging/U01.variants.json',
 'assets/i18n/questions/de/runtime/staging/U01.legacy-renderer.json'];
const all=[...base,...live,...variants];
const group={base:0,live:0,variants:0};
const parts=all.map((path,i)=>{
 const pack=json(path),count=Object.keys(pack.translations||{}).length;
 assert.equal(pack.schema_version,1,path);
 assert.equal(pack.locale,'de',path);
 assert.equal(pack.expert_approved,false,path+':not automatically approved');
 assert.equal(pack.verified_by_religious_expert,false,path+':not automatically approved');
 assert(count>0,path+':empty');
 if(i<105)group.base+=count;else if(i<112)group.live+=count;else group.variants+=count;
 return {path:'./'+path,count,sha256:hash(read(path))};
});
assert.deepEqual(group,{base:1500,live:84,variants:120});
assert.equal(parts.length,114);
const uiNames=['german-ui.staging.json','german-ui.lesson-flow.staging.json',
 'german-ui.premium-shop.staging.json','german-ui.quran-controls.staging.json',
 ...Array.from({length:8},(_,i)=>'german-ui.reference-batch-'+String(i+1).padStart(2,'0')+'.staging.json'),
 'german-ui.real-lesson.staging.json'];
const ui_parts=uiNames.map(name=>{
 const path='assets/i18n/'+name,pack=json(path);
 assert.equal(pack.locale,'de');assert.equal(pack.release_ready,false);
 return {path:'./'+path,count:pack.translation_count,sha256:hash(read(path))};
});
const quran=json('assets/i18n/quran/de/ayah-meanings.staging.json');
assert.equal(Object.keys(quran.translations).length,90);
assert.equal(quran.release_ready,false,'Quran meanings require human approval');
const releasedQuran=structuredClone(quran);
Object.assign(releasedQuran,{release_ready:true,expert_approved:true,
 native_reviewer_approved:true,verified_by_religious_expert:true,
 rights_reviewed:true,meaning_release_gate:'approved_with_independent_review_evidence'});
for(const record of Object.values(releasedQuran.translations)){
 Object.assign(record,{native_reviewer_approved:true,expert_approved:true,
  rights_reviewed:true,meaning_reviewed:true,status:'reviewed_for_release'});
}
const releasedQuranPath='assets/i18n/quran/de/ayah-meanings.approved.json';
const releasedQuranText=JSON.stringify(releasedQuran,null,2)+'\n';
const audioManifestText=read('assets/quran/audio/ayah-audio-manifest.json');
const bridgeHash=hash(read('assets/i18n/german-ui.production.mjs'));
assert.equal(bridgeHash,draft.languages.de.production_bridge_sha256,
 'Production bridge changed without updating pinned manifest SHA-256');
const release={...draft,languages:{...draft.languages,de:{
 ...draft.languages.de,parts,ui_parts,
 ui_reference_sha256:hash(read('assets/i18n/english-ui.draft.json')),
 quran_meanings_sha256:hash(releasedQuranText),
 quran_meanings_path:'./'+releasedQuranPath,
 quran_audio_manifest_sha256:hash(audioManifestText),
 production_bridge_sha256:bridgeHash
}}};
const applying=process.argv.includes('--apply');
if(applying){
 const at=process.argv.indexOf('--approval-file'),path=process.argv[at+1];
 assert(at>=0&&path&&path!=='--apply','--apply requires --approval-file FILE');
 const approval=json(path);
 // Enforce independent named attestations and exact commit identity, not mere truthy flags.
 const roles=['native_german','islamic_subject_expert','rights_clearance','mobile_acceptance'];
 for(const role of roles){
  const item=approval[role];assert.equal(item?.approved,true,role+' approval missing');
  assert(typeof item.reviewer==='string'&&item.reviewer.trim().length>=3,role+' reviewer missing');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(item.date||''),role+' date missing');
 }
 assert.equal(approval.reviewed_bridge_sha256,bridgeHash,'Approval evidence from wrong bridge');
 assert.equal(approval.reviewed_question_versions,1704,
  'All 1,704 source variant records require review');
 assert.equal(approval.reviewed_ayah_keys?.length,90,'Every ayah needs explicit approval');
 assert.deepEqual([...approval.reviewed_ayah_keys].sort(),
  Object.keys(quran.translations).sort(),'Approved ayah identities do not match sources');
 assert.equal(approval.reviewed_ui_keys,1452,'All UI keys need review');
 const de=release.languages.de;
 Object.assign(de,{question_data:'complete',global_qa:'passed',
  religious_expert_approved:true,native_reviewer_approved:true,rights_reviewed:true,
  ui_release_ready:true,quran_meanings_approved:true,production_bridge_ready:true});
 writeFileSync(releasedQuranPath,releasedQuranText);
 writeFileSync('assets/i18n/content-support.json',JSON.stringify(release,null,2)+'\n');
 console.log('Reviewed German candidate written. Update index.html asset hash, run ALL CI and device smoke before merging.');
}else{
 mkdirSync('qa',{recursive:true});
 const path='qa/GERMAN_PRODUCTION_CONFIG_CANDIDATE.json';
 writeFileSync(path,JSON.stringify(release,null,2)+'\n');
 console.log(JSON.stringify({mode:'blocked_candidate_only',path,questions:group,
  questionPacks:parts.length,uiPacks:ui_parts.length,quranDrafts:90,
  releaseReady:false,expertApproval:false},null,2));
}
