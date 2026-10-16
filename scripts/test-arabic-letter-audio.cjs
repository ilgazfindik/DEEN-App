#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {createHash}=require('node:crypto');
const base=path.join(__dirname,'..');
const source=path.join(base,'assets','i18n');
let plays=0,pauses=0;const sounds=[];
class MockAudio{
 constructor(url){this.src=url;this.handlers={};sounds.push(this)}
 addEventListener(event,callback){this.handlers[event]=callback}
 play(){plays++;return Promise.resolve()}
 pause(){pauses++}
 removeAttribute(){this.src=''}
 load(){}
}
const window={addEventListener(){}};
const context={window,URL,location:{origin:'http://127.0.0.1:8765',hostname:'127.0.0.1'},
 document:{baseURI:'http://127.0.0.1:8765/DEEN-App/'},Audio:MockAudio};
vm.runInNewContext(fs.readFileSync(path.join(source,'quran-arabic-letters.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(source,'quran-arabic-letter-audio.js'),'utf8'),context);
const audio=window.DEEN_ARABIC_LETTER_AUDIO;
const expected={qaf:'ق',ya:'ي',waw:'و',ha:'ه',nun:'ن',mim:'م',lam:'ل',kaf:'ك'};
assert.equal(Object.keys(audio.records).length,8);
for(const [id,glyph] of Object.entries(expected)){
 const record=audio.records[id],file=path.join(base,record.file);
 assert.equal(record.glyph,glyph);
 assert.equal(window.DEEN_ARABIC_LETTERS.get(id).glyph,glyph);
 assert.match(record.file,/^assets\/quran\/audio\/arabic-learning\/letter-[a-z]+\.mp3$/);
 assert.equal(fs.existsSync(file),true,record.file+' missing');
 const bytes=fs.readFileSync(file);
 assert.equal(bytes.length,record.size);
 assert.match(bytes.slice(0,3).toString(),/^ID3$/);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);
 assert.equal(record.rights,'owner-attested','creator rights declaration must be recorded');
 assert.equal(record.rightsEvidence,'owner-declaration-2026-10-16');
 assert.equal(record.pronunciation,'pending-review','audio pronunciation is not yet reviewed');
 assert.equal(audio.approved(id),false,'review must remain pending');
 assert.equal(audio.available(id),true,'preview must be enabled');
 assert.equal(audio.hasClip(id),true);
}
assert.equal(audio.available('hha'),false);
assert.equal(audio.hasClip('hha'),false);
assert.equal(audio.pendingCount(),8);
assert.equal(audio.previewCount(),8);
assert.equal(audio.play('qaf'),true);
assert.equal(plays,1);
assert.ok(sounds[0].src.endsWith('/DEEN-App/assets/quran/audio/arabic-learning/letter-qaf.mp3'));
assert.equal(audio.play('kaf'),true);
assert.equal(plays,2);
assert.equal(pauses,1,'previous clip should stop before another starts');
audio.stop();
assert.equal(pauses,2);
// Production fail-closed check: no QA preview on a non-loopback hostname.
const productionWindow={addEventListener(){}};
const production={
 window:productionWindow,URL,
 location:{origin:'https://ilgazfindik.github.io',hostname:'ilgazfindik.github.io'},
 document:{baseURI:'https://ilgazfindik.github.io/DEEN-App/'},Audio:MockAudio
};
vm.runInNewContext(fs.readFileSync(path.join(source,'quran-arabic-letters.js'),'utf8'),production);
vm.runInNewContext(fs.readFileSync(path.join(source,'quran-arabic-letter-audio.js'),'utf8'),production);
const prod=productionWindow.DEEN_ARABIC_LETTER_AUDIO;
assert.equal(prod.previewCount(),0,'Pending recordings must remain inaccessible on deployed hosts');
assert.equal(prod.pendingCount(),8);
for(const id of Object.keys(expected)){
 assert.equal(prod.available(id),false,'No pending playback on production: '+id);
 assert.equal(prod.play(id),false,'No production playback: '+id);
}
assert.equal(plays,2,'Denied production playback must not start audio');
console.log('PASS: 8/8 files+SHA, local QA preview, single voice, production fail-closed release gate');
