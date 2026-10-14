import fs from 'node:fs/promises';
import path from 'node:path';
import {validateAlignmentCandidate,validateStoredAlignment} from './word-alignment-guard.mjs';

const API='https://api.elevenlabs.io/v1/forced-alignment';
const KEY=process.env.ELEVENLABS_API_KEY;
if(!KEY) throw new Error('ELEVENLABS_API_KEY is required');

const manifestPath='assets/quran/audio/ayah-audio-manifest.json';
const outputPath='assets/quran/audio/word-timings.json';
const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));
let output;
try{ output=JSON.parse(await fs.readFile(outputPath,'utf8')); }
catch{ output={schemaVersion:1,source:'elevenlabs_forced_alignment',generatedAt:null,entries:{}}; }
if(!output.entries||typeof output.entries!=='object'||Array.isArray(output.entries))
  throw Error('Invalid existing timing registry; refusing to discard it');

const only=String(process.env.ALIGN_ONLY||'').trim();
const force=process.env.FORCE_ALIGNMENT==='1';
const selected=manifest.entries.filter(x=>!only||x.key===only||x.surahId===only);
if(!selected.length) throw new Error('No manifest entries matched ALIGN_ONLY='+only);


for(const entry of selected){
  if(!force&&output.entries[entry.key]){
    validateStoredAlignment(entry,output.entries[entry.key]);
    console.log('skip',entry.key,'already aligned and structurally valid');
    continue;
  }
  const bytes=await fs.readFile(entry.audio);
  const form=new FormData();
  form.append('file',new Blob([bytes],{type:'audio/mpeg'}),path.basename(entry.audio));
  form.append('text',entry.text);

  const res=await fetch(API,{method:'POST',headers:{'xi-api-key':KEY},body:form});
  if(!res.ok){
    const body=await res.text().catch(()=> '');
    throw new Error('Alignment failed '+entry.key+' HTTP '+res.status+' '+body.slice(0,300));
  }
  const data=await res.json();
  // Reject wrong, partial or reordered words BEFORE any persistent write.
  const candidate=validateAlignmentCandidate(entry,data);
  output.entries[entry.key]=candidate;
  output.generatedAt=new Date().toISOString();
  // Commit each accepted ayah atomically; a failed later ayah cannot leave a
  // partially written JSON registry or save a rejected current candidate.
  const tmp=outputPath+'.tmp-'+process.pid+'-'+Date.now();
  try{
    await fs.writeFile(tmp,JSON.stringify(output,null,2)+'\n','utf8');
    await fs.rename(tmp,outputPath);
  }finally{
    await fs.rm(tmp,{force:true});
  }
  console.log('candidate (needs human review)',entry.key,
    candidate.alignedWords+'/'+candidate.expectedWords,'loss',candidate.loss);
}
