#!/usr/bin/env node
/* DEEN Arabic V2 — read-only intake for 13 letter names + six listening targets.
 * A structural audio scan is NOT a rights, phonetic, or recitation approval.
 * This script never publishes, activates, or modifies any audio record.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..');
const audioRoot=path.join(root,'assets/quran/audio/arabic-learning');
const moduleRoot=path.join(root,'assets/i18n');
function loadAudioSources(){
 const window={addEventListener(){}},ctx={window,URL,
  location:{hostname:'127.0.0.1',origin:'http://127.0.0.1'},
  document:{baseURI:'http://127.0.0.1/DEEN-App/',addEventListener(){}},
  Audio:function(){}};
 for(const file of ['quran-arabic-letters.js','quran-arabic-letter-audio.js','quran-arabic-listening.js'])
  vm.runInNewContext(fs.readFileSync(path.join(moduleRoot,file),'utf8'),ctx,{filename:file});
 return window;
}
function sha256(bytes){return createHash('sha256').update(bytes).digest('hex')}
function queueDefinitions(window){
 const letters=window.DEEN_ARABIC_LETTERS,existing=window.DEEN_ARABIC_LETTER_AUDIO;
 const listening=window.DEEN_ARABIC_LISTENING;
 assert.equal(letters.count,28);assert.equal(Object.keys(existing.records).length,15);
 assert.equal(listening.requiredCount,6);assert.equal(listening.approvedCount(),0,
  'Release must not silently approve isolated listening audio');
 const missingLetters=Array.from(letters.all).filter(x=>!existing.hasClip(x.id));
 const list=missingLetters.map(letter=>({
  id:letter.id,kind:'letter-name',text:letter.names.ar,glyph:letter.glyph,
  filename:'letter-'+letter.id+'.mp3',lessonId:letters.lessons.find(l=>Array.from(l.letterIds).includes(letter.id))?.id
 }));
 for(const lesson of listening.lessons)for(const item of lesson.items)list.push({
  id:item.clipId,kind:lesson.kind==='listen-syllable'?'syllable':'quran-word',
  text:item.glyph,glyph:item.glyph,filename:item.clipId+'.mp3',lessonId:lesson.id
 });
 assert.equal(missingLetters.length,13,'Unexpected number of missing letter files');
 assert.equal(list.length,19,'Expected 13 letter names plus six listening targets');
 assert.equal(new Set(list.map(x=>x.filename)).size,list.length,'Duplicate target file name');
 return list;
}
function checkFileHeader(bytes){
 // Header recognition is only a preflight check, NOT decoding or listening.
 return bytes.subarray(0,3).toString()==='ID3'||
  (bytes.length>=2&&bytes[0]===255&&(bytes[1]&224)===224);
}
function buildInventory({intakeDir=path.join(root,'qa/audio-intake')}={}){
 const window=loadAudioSources(),original=window.DEEN_ARABIC_LETTER_AUDIO;
 const queue=queueDefinitions(window);
 const reserved=new Map();
 for(const record of Object.values(original.records)){
  const filepath=path.join(root,record.file);
  assert.ok(fs.statSync(filepath).isFile(),'Missing original MP3 '+record.file);
  const bytes=fs.readFileSync(filepath);
  assert.equal(bytes.length,record.size,'Original recording size changed '+record.id);
  assert.equal(sha256(bytes),record.sha256,'Original recording hash changed '+record.id);
  reserved.set(record.sha256,'existing-letter-'+record.id);
 }
 const errors=[],seen=new Map(reserved),items=[];
 const expected=new Set(queue.map(q=>q.filename));
 if(fs.existsSync(intakeDir)){
  if(!fs.statSync(intakeDir).isDirectory())errors.push('INTAKE_NOT_DIRECTORY');
  else for(const name of fs.readdirSync(intakeDir)){
   if(!expected.has(name))errors.push('UNEXPECTED_INTAKE_FILE:'+name);
  }
 }
 for(const q of queue){
  const filepath=path.join(intakeDir,q.filename);
  const row={...q,present:false,bytes:null,sha256:null,formatHeaderRecognized:false,
   state:'missing-recording',rightsReview:'pending',pronunciationReview:'pending',
   runtimeApproved:false};
  if(fs.existsSync(filepath)){
   const stat=fs.lstatSync(filepath);
   if(!stat.isFile()||stat.isSymbolicLink()){errors.push('UNSAFE_FILE:'+q.filename)}
   else{
    const bytes=fs.readFileSync(filepath),hash=sha256(bytes);
    row.present=true;row.bytes=bytes.length;row.sha256=hash;
    row.formatHeaderRecognized=checkFileHeader(bytes);
    row.state='awaiting-human-review';
    if(bytes.length<512||bytes.length>2000000)errors.push('INVALID_SIZE:'+q.filename);
    if(!row.formatHeaderRecognized)errors.push('INVALID_MP3_HEADER:'+q.filename);
    if(seen.has(hash))errors.push('EXACT_DUPLICATE_AUDIO:'+q.filename+':'+seen.get(hash));
    else seen.set(hash,q.filename);
   }
  }
  items.push(row);
 }
 const report={schema:1,phase:17,scope:'Arabic-learning recordings intake only',
  existingOwnerConfirmedLetterPreviews:reserved.size,missingLetterNames:13,
  independentListeningTargets:6,queueTotal:queue.length,
  received:items.filter(x=>x.present).length,pending:items.filter(x=>!x.present).length,
  runtimeNewlyApproved:0,
  disclaimer:'Byte hashes and MP3 headers cannot certify pronunciation, Quran correctness, ownership or licensing.',
  items,errors};
 return report;
}
function arg(name){return process.argv.find(x=>x.startsWith('--'+name+'='))?.slice(name.length+3)}
if(require.main===module){
 const report=buildInventory({intakeDir:arg('intake')?path.resolve(arg('intake')):undefined});
 if(arg('report')){
  const file=path.resolve(arg('report'));fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');
 }
 console.log('DEEN_ARABIC_AUDIO_INTAKE '+JSON.stringify({expected:report.queueTotal,
  existing:report.existingOwnerConfirmedLetterPreviews,received:report.received,
  pending:report.pending,errors:report.errors,approvalGranted:false}));
 if(report.errors.length)process.exitCode=1;
}
module.exports={buildInventory,queueDefinitions,checkFileHeader};
