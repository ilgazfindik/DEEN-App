/* Staging Quran forced-alignment. Dry-run never calls API or writes data.
 * Any generated timing remains a human-review candidate, not a certified recital. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {validateAlignmentCandidate,validateStoredAlignment} from './word-alignment-guard.mjs';
const API='https://api.elevenlabs.io/v1/forced-alignment';
const KEY=process.env.ELEVENLABS_API_KEY;
const manifestPath='assets/quran/audio/ayah-audio-manifest.json';
const outputPath='assets/quran/audio/word-timings.json';
const dryRun=process.env.ALIGN_DRY_RUN==='1',force=process.env.FORCE_ALIGNMENT==='1';
const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));
if(manifest.schemaVersion!==1||!Array.isArray(manifest.entries)||
   manifest.entries.length!==manifest.ayahCount)
  throw Error('Invalid Quran audio manifest');
let output;
try{output=JSON.parse(await fs.readFile(outputPath,'utf8'));}
catch(error){
  if(error?.code!=='ENOENT')throw error;
  output={schemaVersion:1,source:'elevenlabs_forced_alignment',generatedAt:null,entries:{}};
}
if(output.schemaVersion!==1||!output.entries||typeof output.entries!=='object'||
   Array.isArray(output.entries))
  throw Error('Invalid existing timing registry; refusing to overwrite');
const rawOnly=process.env.ALIGN_ONLY??'';
const selectors=rawOnly.trim()?rawOnly.split(',').map(x=>x.trim()):[];
if(selectors.some(x=>!x||!/^[a-z0-9-]+(?::[1-9][0-9]*)?$/.test(x)))
  throw Error('ALIGN_ONLY must be comma-separated surah or surah:ayah names');
const chosen=new Set(selectors);
for(const selector of chosen)
  if(!manifest.entries.some(entry=>entry.key===selector||entry.surahId===selector))
    throw Error('Unknown ALIGN_ONLY selector '+selector);
const selected=manifest.entries.filter(entry=>!chosen.size||
  chosen.has(entry.key)||chosen.has(entry.surahId));
if(!selected.length)throw Error('No audio manifest entries selected');
const rawMax=String(process.env.ALIGN_MAX??'').trim();
if(rawMax&&!/^[1-9][0-9]*$/.test(rawMax))
  throw Error('ALIGN_MAX must be a positive integer');
const max=rawMax?Number(rawMax):selected.length;
if(!Number.isSafeInteger(max)||max>manifest.entries.length)
  throw Error('ALIGN_MAX exceeds the audio manifest size');
const manifestKeys=new Set(manifest.entries.map(entry=>entry.key));
if(manifestKeys.size!==manifest.entries.length)throw Error('Duplicate ayah key');
for(const key of Object.keys(output.entries))
  if(!manifestKeys.has(key))throw Error('Orphaned saved alignment '+key);
const pending=[],skipped=[];
for(const entry of selected){
  if(!force&&output.entries[entry.key]){
    validateStoredAlignment(entry,output.entries[entry.key]);
    skipped.push(entry.key);
  }else pending.push(entry);
}
const work=pending.slice(0,max);
const plan={mode:dryRun?'dry-run':'execution',
  selectors:selectors.length?selectors:['all'],
  totalAudio:manifest.entries.length,selected:selected.length,alreadyValid:skipped.length,
  pending:pending.length,queued:work.length,remainingAfterQueue:pending.length-work.length,
  keys:work.map(x=>x.key),noNetworkOrWrites:dryRun,humanReviewRequired:true,
  releaseReady:false};
console.log('ALIGN_PLAN '+JSON.stringify(plan));
if(dryRun)process.exit(0);
if(work.length&&!KEY)
  throw Error('ELEVENLABS_API_KEY required to execute; use ALIGN_DRY_RUN=1');
for(const entry of work){
  const bytes=await fs.readFile(entry.audio);
  const form=new FormData();
  form.append('file',new Blob([bytes],{type:'audio/mpeg'}),path.basename(entry.audio));
  form.append('text',entry.text);
  const response=await fetch(API,{method:'POST',
    headers:{'xi-api-key':KEY},body:form,signal:AbortSignal.timeout(120000)});
  if(!response.ok)throw Error('Forced alignment rejected '+entry.key+' HTTP '+response.status);
  const candidate=validateAlignmentCandidate(entry,await response.json());
  output.entries[entry.key]=candidate;
  output.generatedAt=new Date().toISOString();
  const tmp=outputPath+'.tmp-'+process.pid+'-'+Date.now();
  try{
    await fs.writeFile(tmp,JSON.stringify(output,null,2)+'\n','utf8');
    await fs.rename(tmp,outputPath);
  }finally{await fs.rm(tmp,{force:true});}
  console.log('ALIGN_CANDIDATE '+JSON.stringify({
    key:entry.key,words:candidate.alignedWords,reviewed:false}));
}
console.log('ALIGN_BATCH_END '+JSON.stringify({
  candidatesWritten:work.length,sourceCount:selected.length,independentReviewRequired:true}));
