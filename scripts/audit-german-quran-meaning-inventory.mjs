/* German Quran ayah-meaning release inventory, separate from UI strings. */
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const manifest=read('assets/i18n/content-support.json');
const audio=read('assets/quran/audio/ayah-audio-manifest.json');
assert.equal(manifest.languages.de.question_data,'missing');
assert.equal(manifest.languages.de.global_qa,'blocked');
assert.equal(manifest.languages.de.religious_expert_approved,false);
assert.equal(audio.schemaVersion,1);
assert.equal(audio.ayahCount,90);
assert.equal(audio.entries.length,90);
const expected={fatiha:7,ikhlas:4,falaq:5,nas:6,kawthar:3,asr:3,kafirun:6,nasr:3,masad:5,fil:5,quraysh:4,maun:7,sharh:8,tin:8,bayyina:8,zilzal:8};
const actual={},seen=new Set(),issues=[];
for(const e of audio.entries){
 if(seen.has(e.key))issues.push('duplicate_key:'+e.key);seen.add(e.key);
 if(e.key!==e.surahId+':'+e.ayah)issues.push('id_mismatch:'+e.key);
 if(!Object.hasOwn(expected,e.surahId))issues.push('unexpected_surah:'+e.surahId);
 (actual[e.surahId]??=[]).push(e.ayah);
 if(typeof e.text!=='string'||!(/[\u0600-\u06ff]/u.test(e.text)))issues.push('arabic_ayah_missing:'+e.key);
 if(typeof e.audio!=='string'||!e.audio.startsWith('assets/quran/audio/')||!existsSync(root+e.audio)||statSync(root+e.audio).size<100)issues.push('missing_audio:'+e.key);
}
assert.equal(seen.size,90);
assert.deepEqual(Object.keys(actual).sort(),Object.keys(expected).sort());
for(const [surah,number]of Object.entries(expected)){
 assert.equal(actual[surah].length,number,surah+':count');
 assert.deepEqual(actual[surah].sort((a,b)=>a-b),Array.from({length:number},(_,i)=>i+1),surah+':ayah_sequence');
}
const germanPath='assets/i18n/quran/de/ayah-meanings.staging.json';
let staged={};
if(existsSync(root+germanPath)){
 const pack=read(germanPath);
 assert.equal(pack.locale,'de');
 assert.equal(pack.release_ready,false);
 assert.equal(pack.expert_approved,false);
 assert.equal(pack.native_reviewer_approved,false);
 assert.equal(pack.verified_by_religious_expert,false);
 staged=pack.translations||{};
 for(const [id,entry]of Object.entries(staged)){
  if(!seen.has(id))issues.push('unknown_ayah_translation:'+id);
  if(typeof entry?.text!=='string'||!entry.text.trim())issues.push('empty_german_ayah_meaning:'+id);
  if(entry.expert_approved!==false||entry.native_reviewer_approved!==false)issues.push('incorrect_ayah_approval:'+id);
 }
}
const missing=[...seen].filter(k=>!Object.hasOwn(staged,k));
const report={locale:'de',quran_surahs:16,source_ayahs:90,registered_audio:audio.entries.length,
 german_ayah_meanings_staged:Object.keys(staged).length,missing_german_ayah_meanings:missing.length,
 missing_by_surah:Object.fromEntries(Object.keys(expected).map(id=>[id,missing.filter(key=>key.startsWith(id+':')).length])),
 release_ready:false,production_manifest:'blocked',
 translated_quran_ui_is_not_ayah_translation:true,issues};
console.log(JSON.stringify(report,null,2));
assert.deepEqual(issues,[]);
