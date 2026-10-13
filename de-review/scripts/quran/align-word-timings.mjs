import fs from 'node:fs/promises';
import path from 'node:path';

const API='https://api.elevenlabs.io/v1/forced-alignment';
const KEY=process.env.ELEVENLABS_API_KEY;
if(!KEY) throw new Error('ELEVENLABS_API_KEY is required');

const manifestPath='assets/quran/audio/ayah-audio-manifest.json';
const outputPath='assets/quran/audio/word-timings.json';
const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));
let output;
try{ output=JSON.parse(await fs.readFile(outputPath,'utf8')); }
catch{ output={schemaVersion:1,source:'elevenlabs_forced_alignment',generatedAt:null,entries:{}}; }
output.entries=output.entries&&typeof output.entries==='object'?output.entries:{};

const only=String(process.env.ALIGN_ONLY||'').trim();
const force=process.env.FORCE_ALIGNMENT==='1';
const selected=manifest.entries.filter(x=>!only||x.key===only||x.surahId===only);
if(!selected.length) throw new Error('No manifest entries matched ALIGN_ONLY='+only);

function normalizeWords(words){
  if(!Array.isArray(words)) return [];
  return words.map(w=>({
    text:String(w?.text??'').trim(),
    start:Number(w?.start),
    end:Number(w?.end),
    loss:Number.isFinite(Number(w?.loss))?Number(w.loss):null
  })).filter(w=>w.text&&Number.isFinite(w.start)&&Number.isFinite(w.end)&&w.end>=w.start);
}

for(const entry of selected){
  if(!force&&output.entries[entry.key]?.words?.length){
    console.log('skip',entry.key,'already aligned');
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
  const words=normalizeWords(data.words);
  const expected=entry.text.trim().split(/\s+/).filter(Boolean).length;
  if(!words.length) throw new Error('No word timings returned for '+entry.key);

  output.entries[entry.key]={
    surahId:entry.surahId,
    ayah:entry.ayah,
    text:entry.text,
    audio:entry.audio,
    expectedWords:expected,
    alignedWords:words.length,
    wordCountMatch:words.length===expected,
    loss:Number.isFinite(Number(data.loss))?Number(data.loss):null,
    words
  };
  output.generatedAt=new Date().toISOString();
  await fs.writeFile(outputPath,JSON.stringify(output,null,2)+'\n');
  console.log('aligned',entry.key,words.length+'/'+expected,'loss',data.loss);
}
