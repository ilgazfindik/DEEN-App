/* DEEN P11: rights evidence registry, NOT a legal approval decision. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const source=JSON.parse(readFileSync('assets/quran/audio/ayah-audio-manifest.json','utf8'));
const evidence=JSON.parse(readFileSync('assets/quran/audio/fr-rights-evidence.staging.json','utf8'));
function check(manifest,ledger){
 assert.equal(manifest?.schemaVersion,1,'Unrecognized audio manifest');
 assert(Array.isArray(manifest.entries)&&manifest.entries.length===manifest.ayahCount,'Original audio count drift');
 assert.equal(ledger?.schemaVersion,1,'Invalid rights schema');
 assert.equal(ledger.status,'staging_evidence_only','No release state allowed');
 assert.equal(ledger.releaseReady,false,'Audio cannot be published by metadata');
 assert(Array.isArray(ledger.records)&&ledger.records.length===manifest.entries.length,'Missing audio rights records');
 const indexed=new Map(ledger.records.map(x=>[x.key,x]));
 assert.equal(indexed.size,ledger.records.length,'Duplicate audio rights record');
 let lacking=0,submitted=0,recitationPending=0;
 for(const entry of manifest.entries){
  const item=indexed.get(entry.key);
  assert(item,'Missing audio rights record '+entry.key);
  assert.equal(item.audio,entry.audio,'Audio identity changed '+entry.key);
  assert(['unverified','evidence_submitted'].includes(item.permissionStatus),'Invalid rights status '+entry.key);
  assert(['pending','review_submitted'].includes(item.recitationReview),'Invalid recitation status '+entry.key);
  if(item.permissionStatus==='unverified'){
   lacking++;
   assert.equal(item.evidenceRef,null,'Unverified audio falsely claims license '+entry.key);
  }else{
   submitted++;
   assert(typeof item.evidenceRef==='string'&&item.evidenceRef.trim(),
    'Submitted rights must point to evidence '+entry.key);
  }
  if(item.recitationReview==='pending'){
   recitationPending++;
   assert.equal(item.reviewRef,null,'Pending recitation falsely claims expert review '+entry.key);
  }else assert(typeof item.reviewRef==='string'&&item.reviewRef.trim(),
    'Submitted listening review needs reference '+entry.key);
 }
 const m=ledger.frenchMeaning;
 assert(m&&m.releaseReady===false,'French meaning must remain unreleased');
 if(m.rightsEvidenceRef!==null){
  for(const field of ['edition','translator','rightsEvidenceRef','religiousReviewRef','nativeFrenchReviewRef'])
   assert(typeof m[field]==='string'&&m[field].trim(),'French meaning source missing '+field);
 }
 return {assets:manifest.entries.length,rightsUnverified:lacking,
  rightsEvidenceSubmitted:submitted,recitationReviewsPending:recitationPending,
  frenchMeaningRightsDocumented:m.rightsEvidenceRef!==null,
  releaseReady:false,legalPermissionVerifiedByAutomation:false};
}
const copy=()=>structuredClone(evidence);
const result=check(source,evidence);
assert.equal(result.assets,90);
{
 const x=copy();x.records.pop();
 assert.throws(()=>check(source,x),/Missing audio rights records/);
}
{
 const x=copy();x.records[1].key=x.records[0].key;
 assert.throws(()=>check(source,x),/Duplicate audio rights record/);
}
{
 const x=copy();x.records[0].audio=x.records[1].audio;
 assert.throws(()=>check(source,x),/Audio identity changed/);
}
{
 const x=copy();x.records[0].permissionStatus='approved';
 assert.throws(()=>check(source,x),/Invalid rights status/);
}
{
 const x=copy();x.records[0].evidenceRef='imaginary license';
 assert.throws(()=>check(source,x),/falsely claims license/);
}
{
 const x=copy();x.records[0].permissionStatus='evidence_submitted';
 assert.throws(()=>check(source,x),/point to evidence/);
}
{
 const x=copy();x.frenchMeaning.releaseReady=true;
 assert.throws(()=>check(source,x),/must remain unreleased/);
}
mkdirSync('qa-artifacts/french-quran',{recursive:true});
writeFileSync('qa-artifacts/french-quran/rights-audit.json',JSON.stringify(result,null,2)+'\n');
console.log('FR_QURAN_RIGHTS_AUDIT '+JSON.stringify({...result,negativeChecks:7}));
