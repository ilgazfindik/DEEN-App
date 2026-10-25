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
const expected={alif:'ا',ba:'ب',ta:'ت',tha:'ث',jim:'ج',hha:'ح',kha:'خ',qaf:'ق',ya:'ي',waw:'و',ha:'ه',nun:'ن',mim:'م',lam:'ل',kaf:'ك'};
assert.equal(Object.keys(audio.records).length,15);
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
 assert.equal(record.pronunciation,'creator-confirmed','Creator has confirmed the letter names');
 assert.equal(record.creatorConfirmation,'creator-pronunciation-confirmation-2026-10-16');
 assert.equal(audio.approved(id),false,'independent review remains pending');
 assert.equal(audio.available(id),true,'preview must be enabled');
 assert.equal(audio.hasClip(id),true);
}
assert.equal(audio.available('dal'),false);
assert.equal(audio.hasClip('dal'),false);
assert.equal(audio.pendingCount(),15,'Independent review must remain pending');
assert.equal(audio.creatorConfirmedCount(),15);
assert.equal(audio.previewCount(),15);
assert.equal(audio.play('qaf'),true);
assert.equal(plays,1);
assert.ok(sounds[0].src.endsWith('/DEEN-App/assets/quran/audio/arabic-learning/letter-qaf.mp3'));
assert.equal(audio.play('kaf'),true);
assert.equal(plays,2);
assert.equal(pauses,1,'previous clip should stop before another starts');
audio.stop();
assert.equal(pauses,2);
// Production allows ONLY creator-confirmed previews. No independent-approval claim.
const productionWindow={addEventListener(){}};
const production={
 window:productionWindow,URL,
 location:{origin:'https://ilgazfindik.github.io',hostname:'ilgazfindik.github.io'},
 document:{baseURI:'https://ilgazfindik.github.io/DEEN-App/'},Audio:MockAudio
};
vm.runInNewContext(fs.readFileSync(path.join(source,'quran-arabic-letters.js'),'utf8'),production);
vm.runInNewContext(fs.readFileSync(path.join(source,'quran-arabic-letter-audio.js'),'utf8'),production);
const prod=productionWindow.DEEN_ARABIC_LETTER_AUDIO;
assert.equal(prod.previewCount(),15,'Creator-confirmed recordings are available on production');
assert.equal(prod.creatorConfirmedCount(),15);
assert.equal(prod.pendingCount(),15,'Do not falsely claim independent pronunciation review');
for(const id of Object.keys(expected)){
 assert.equal(prod.available(id),true,'Creator-confirmed preview should work in production: '+id);
 assert.equal(prod.approved(id),false,'Not independent phonetic approval: '+id);
}
assert.equal(prod.play('qaf'),true,'Production should play creator-confirmed qaf');
assert.equal(prod.play('kaf'),true,'Production should play creator-confirmed kaf');
assert.equal(prod.available('dal'),false,'No MP3 exists for dal (د)');
assert.equal(prod.play('dal'),false);
assert.equal(plays,4,'Exactly 2 live preview attempts should start');
prod.stop();
console.log('PASS: 15/15 MP3+SHA, owner-confirmed production previews, independent review pending, one voice');
