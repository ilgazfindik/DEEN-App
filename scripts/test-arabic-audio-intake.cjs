/* Stage17: intake audit regression; never claim new clips are licensed or reviewed. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {buildInventory,queueDefinitions,checkFileHeader}=require('./audit-arabic-audio-intake.cjs');
const root=path.resolve(__dirname,'..');
const clean=fs.mkdtempSync(path.join(os.tmpdir(),'deen-audio-qa-'));
const existing=fs.readFileSync(path.join(root,'assets/quran/audio/arabic-learning/letter-alif.mp3'));
try{
 const first=buildInventory({intakeDir:clean});
 assert.equal(first.existingOwnerConfirmedLetterPreviews,15);
 assert.equal(first.queueTotal,19);
 assert.equal(first.pending,19);
 assert.equal(first.received,0);
 assert.equal(first.runtimeNewlyApproved,0);
 assert.deepEqual(first.errors,[]);
 const letters=first.items.filter(x=>x.kind==='letter-name'),syllables=first.items.filter(x=>x.kind==='syllable'),
  words=first.items.filter(x=>x.kind==='quran-word');
 assert.equal(letters.length,13);assert.equal(syllables.length,3);assert.equal(words.length,3);
 assert.deepEqual(letters.map(x=>x.id),['dal','dhal','ra','zay','sin','shin','sad','dad','tta','zza','ayn','ghayn','fa']);
 assert.deepEqual(syllables.map(x=>x.text),['بَ','بِ','بُ']);
 assert.deepEqual(words.map(x=>x.text),['قُلْ','هُوَ','لَمْ']);
 assert.ok(first.items.every(x=>!x.runtimeApproved&&x.rightsReview==='pending'&&x.pronunciationReview==='pending'));
 // Copied/relabeled existing audio is not a new letter recording.
 fs.writeFileSync(path.join(clean,'letter-dal.mp3'),existing);
 let report=buildInventory({intakeDir:clean});
 assert.ok(report.errors.some(x=>x.startsWith('EXACT_DUPLICATE_AUDIO:letter-dal.mp3:existing-letter-alif')));
 assert.equal(report.items.find(x=>x.id==='dal').runtimeApproved,false);
 // Byte-different candidate can enter the human review queue, NEVER unlock gameplay.
 const novel=Buffer.concat([existing,Buffer.from([0])]);
 fs.writeFileSync(path.join(clean,'letter-dal.mp3'),novel);
 report=buildInventory({intakeDir:clean});
 assert.deepEqual(report.errors,[]);
 assert.equal(report.received,1);assert.equal(report.pending,18);
 assert.equal(report.items.find(x=>x.id==='dal').state,'awaiting-human-review');
 assert.equal(report.items.find(x=>x.id==='dal').runtimeApproved,false);
 assert.equal(report.items.find(x=>x.id==='dal').sha256.length,64);
 // A forged file extension or unexpected file name is never silently accepted.
 fs.writeFileSync(path.join(clean,'syllable-ba-fatha.mp3'),Buffer.alloc(1300,0));
 report=buildInventory({intakeDir:clean});
 assert.ok(report.errors.includes('INVALID_MP3_HEADER:syllable-ba-fatha.mp3'));
 fs.writeFileSync(path.join(clean,'unexpected.mp3'),existing);
 report=buildInventory({intakeDir:clean});
 assert.ok(report.errors.includes('UNEXPECTED_INTAKE_FILE:unexpected.mp3'));
 assert.equal(checkFileHeader(Buffer.from('not-mp3')),false);
 assert.equal(checkFileHeader(existing),true);
 console.log('PASS ARABIC AUDIO INTAKE: 13 names + 6 independent clips, 15 preserved previews, exact duplicate/corruption/unknown file blocked, no approval');
}finally{fs.rmSync(clean,{recursive:true,force:true})}
