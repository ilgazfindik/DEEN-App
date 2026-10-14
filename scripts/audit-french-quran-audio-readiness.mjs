/* French staging-only Quran audio readiness audit.
 * An MP3 being present is not evidence of playback permission or word timing.
 * This audit never changes Arabic, translation, audio files or release gates. */
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import path from 'node:path';

const manifestPath='assets/quran/audio/ayah-audio-manifest.json';
const timingsPath='assets/quran/audio/word-timings.json';
const outputPath='qa-artifacts/french-quran/audio-readiness.json';
const manifest=JSON.parse(await readFile(manifestPath,'utf8'));
const timings=JSON.parse(await readFile(timingsPath,'utf8'));
assert.equal(manifest.schemaVersion,1,'Unexpected audio manifest schema');
assert.equal(manifest.ayahCount,90,'Audio manifest needs independent review after inventory changes');
assert(Array.isArray(manifest.entries)&&manifest.entries.length===manifest.ayahCount,
  'Audio manifest ayah count drift');
assert.equal(timings.schemaVersion,1,'Unexpected word timings schema');
assert(timings.entries&&typeof timings.entries==='object'&&!Array.isArray(timings.entries),
  'Invalid word timing entries');

// Source-exact word alignment guard: a plausible timestamp is not evidence
// that the highlighted Arabic word is the one actually displayed.
function validateWordSegments(key,sourceWords,segments){
  let previousEnd=0;
  for(const [index,word] of segments.entries()){
    assert(word&&typeof word==='object','Invalid word segment '+key+'['+index+']');
    assert.equal(word.text,sourceWords[index],
      'Wrong Arabic source token in word timing '+key+'['+index+']');
    assert(Number.isFinite(word.start)&&Number.isFinite(word.end)&&
      word.start>=0&&word.start>=previousEnd-0.025&&word.end>word.start,
      'Invalid/out-of-order timestamp '+key+'['+index+']');
    previousEnd=word.end;
  }
}
// Negative tests ensure corruption cannot be marked as a timing candidate,
// even though the shipped timing manifest currently contains no alignments.
const fixtureWords=['بِسْمِ','ٱللَّهِ'];
const fixtureSegments=[{text:fixtureWords[0],start:0,end:0.35},
 {text:fixtureWords[1],start:0.36,end:0.9}];
validateWordSegments('fixture',fixtureWords,fixtureSegments);
assert.throws(()=>validateWordSegments('fixture',fixtureWords,
 [{...fixtureSegments[0],text:fixtureWords[1]}]),/Wrong Arabic source token/);
assert.throws(()=>validateWordSegments('fixture',fixtureWords,
 [fixtureSegments[0],{...fixtureSegments[1],start:0.1}]),/Invalid\/out-of-order timestamp/);
assert.throws(()=>validateWordSegments('fixture',fixtureWords,
 [fixtureSegments[0],{...fixtureSegments[1],end:NaN}]),/Invalid\/out-of-order timestamp/);

const audioKeys=new Set(),audioPaths=new Set(),records=[];
for(const entry of manifest.entries){
  assert(typeof entry.key==='string'&&/^[a-z0-9-]+:[1-9][0-9]*$/.test(entry.key),
    'Invalid ayah audio key');
  assert.equal(entry.key,entry.surahId+':'+entry.ayah,'Surah/ayah audio key mismatch');
  assert(!audioKeys.has(entry.key),'Duplicate ayah key '+entry.key);
  audioKeys.add(entry.key);
  assert(typeof entry.text==='string'&&/[\u0600-\u06ff]/u.test(entry.text),
    'Arabic source missing '+entry.key);
  assert(typeof entry.audio==='string'&&
    /^assets\/quran\/audio\/[a-z0-9-]+\/[a-z0-9_]+\.mp3$/.test(entry.audio),
    'Untrusted audio path '+entry.key);
  assert(!audioPaths.has(entry.audio),'Duplicate audio file mapping '+entry.audio);
  audioPaths.add(entry.audio);
  const bytes=await readFile(entry.audio);
  assert(bytes.length>1000,'Truncated audio asset '+entry.key);
  const id3=bytes.toString('ascii',0,3)==='ID3';
  const mpeg=(bytes[0]===0xff&&(bytes[1]&0xe0)===0xe0);
  assert(id3||mpeg,'Audio is not an ID3/MPEG stream '+entry.key);
  const words=entry.text.trim().split(/\s+/u).filter(Boolean);
  const alignment=timings.entries[entry.key];
  let timingStatus='missing';
  if(alignment){
    assert.equal(alignment.surahId,entry.surahId,'Wrong alignment surah '+entry.key);
    assert.equal(alignment.ayah,entry.ayah,'Wrong alignment ayah '+entry.key);
    assert.equal(alignment.text,entry.text,'Alignment Arabic source drift '+entry.key);
    assert.equal(alignment.audio,entry.audio,'Alignment audio source drift '+entry.key);
    assert.equal(alignment.expectedWords,words.length,'Word-count source drift '+entry.key);
    assert(Array.isArray(alignment.words)&&alignment.words.length>0,
      'Empty alignment '+entry.key);
    assert.equal(alignment.alignedWords,alignment.words.length,'Alignment count drift '+entry.key);
    assert.equal(alignment.wordCountMatch,alignment.words.length===words.length,
      'Alignment match flag drift '+entry.key);
    validateWordSegments(entry.key,words,alignment.words);
    timingStatus=alignment.wordCountMatch?'candidate_needs_human_review':'incomplete';
  }
  records.push({key:entry.key,bytes:bytes.length,assetHeaderValid:true,
    sourceWordCount:words.length,wordTiming:timingStatus});
}
for(const key of Object.keys(timings.entries))
  assert(audioKeys.has(key),'Orphaned timing key '+key);
for(const [surah,expected] of [['fatiha',7],['ikhlas',4]]){
  assert.equal(records.filter(x=>x.key.startsWith(surah+':')).length,expected,
    'Critical surah ayah count drift '+surah);
}
const timingCandidates=records.filter(x=>x.wordTiming==='candidate_needs_human_review').length;
const timingIncomplete=records.filter(x=>x.wordTiming==='incomplete').length;
const report={
  scope:'french_staging_audio_asset_and_alignment_readiness',
  releaseReady:false, productionFrenchAudioPlaybackCertified:false,
  rightsAndLicenseClearedByThisAudit:false,
  audioAssetCount:records.length, mp3HeadersValidated:records.length,
  wordTimingCandidates:timingCandidates, wordTimingIncomplete:timingIncomplete,
  wordTimingMissing:records.length-timingCandidates-timingIncomplete,
  wordSynchronizedHighlightCertified:0,
  reason:'Present audio files are not playback proof; timestamps and independent recitation/rights review are required.',
  criticalSurahs:records.filter(x=>/^fatiha:|^ikhlas:/.test(x.key)),
  records
};
await mkdir(path.dirname(outputPath),{recursive:true});
await writeFile(outputPath,JSON.stringify(report,null,2)+'\n','utf8');
console.log('FRENCH_QURAN_AUDIO_READINESS '+JSON.stringify({
  audioFiles:report.audioAssetCount,mp3HeadersValidated:report.mp3HeadersValidated,
  timingCandidates:timingCandidates,timingIncomplete:timingIncomplete,
  timingMissing:report.wordTimingMissing,playbackCertified:false,
  wordHighlightCertified:false,rightsCleared:false
}));
