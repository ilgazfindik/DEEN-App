import test from 'node:test';
import assert from 'node:assert/strict';
import {validateAlignmentCandidate,validateStoredAlignment} from './quran/word-alignment-guard.mjs';
const ayah={key:'ikhlas:2',surahId:'ikhlas',ayah:2,
 text:'ٱللَّهُ ٱلصَّمَدُ',audio:'assets/quran/audio/ikhlas/ihlas_2.mp3'};
const sample=()=>({words:[{text:'ٱللَّهُ',start:0,end:0.32},
 {text:'ٱلصَّمَدُ',start:0.35,end:0.8}],loss:0.2});
test('accept source-exact Arabic words with monotonic positive time',()=>{
 const row=validateAlignmentCandidate(ayah,sample());
 assert.equal(row.wordCountMatch,true);
 assert.equal(row.alignedWords,2);
 assert.equal(row.words[1].text,'ٱلصَّمَدُ');
 assert.deepEqual(validateStoredAlignment(ayah,row),row);
});
test('reject missing or excess words rather than filtering and saving',()=>{
 for(const words of [sample().words.slice(0,1),[...sample().words,sample().words[0]]])
  assert.throws(()=>validateAlignmentCandidate(ayah,{words}),/Word-count mismatch/);
});
test('reject words in the wrong order and changed Arabic diacritics',()=>{
 for(const words of [
  [...sample().words].reverse(),
  [{...sample().words[0],text:'الله'},sample().words[1]]
 ])assert.throws(()=>validateAlignmentCandidate(ayah,{words}),/Arabic token mismatch/);
});
test('reject truncated, invalid and overlapping timings',()=>{
 for(const bad of [
  {start:0.1,end:0.1},{start:-1,end:0.2},
  {start:0.2,end:0.8},{start:NaN,end:1},
  {start:'0.35',end:0.8},{start:0.35,end:Infinity}
 ]){
  const words=sample().words.map((w,i)=>i===1?{...w,...bad}:w);
  assert.throws(()=>validateAlignmentCandidate(ayah,{words}),/Invalid timestamp/);
 }
});
test('reject a stored alignment claiming a different audio or verse',()=>{
 const aligned=validateAlignmentCandidate(ayah,sample());
 for(const key of ['audio','text','surahId','ayah','expectedWords','alignedWords','wordCountMatch']){
  assert.throws(()=>validateStoredAlignment(ayah,{...aligned,[key]:'modified'}),/Stored alignment metadata mismatch/);
 }
});
test('reject null, missing and non-array API outputs',()=>{
 for(const v of [null,{}, {words:null},{words:'string'}])
  assert.throws(()=>validateAlignmentCandidate(ayah,v),/Missing word timings/);
});
