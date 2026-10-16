#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const base=path.join(__dirname,'..','assets','i18n');
const window={addEventListener(){}};
const context={window,URL,location:{origin:'https://example.org'},document:{baseURI:'https://example.org/DEEN-App/'},Audio:function(){}};
vm.runInNewContext(fs.readFileSync(path.join(base,'quran-arabic-letters.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(base,'quran-arabic-letter-audio.js'),'utf8'),context);
const registry=window.DEEN_ARABIC_LETTER_AUDIO;
const expected={qaf:'ق',ya:'ي',waw:'و',ha:'ه',nun:'ن',mim:'م',lam:'ل',kaf:'ك'};
assert.equal(Object.keys(registry.records).length,8);
for(const [id,glyph] of Object.entries(expected)){
 const r=registry.records[id];
 assert.equal(r.glyph,glyph);
 assert.equal(window.DEEN_ARABIC_LETTERS.get(id).glyph,glyph);
 assert.match(r.file,/^assets\/quran\/audio\/arabic-learning\/letter-[a-z]+\.mp3$/);
 assert.match(r.sha256,/^[a-f0-9]{64}$/);
 assert.equal(r.rights,'pending');
 assert.equal(r.pronunciation,'pending');
 assert.equal(registry.available(id),false);
 assert.equal(registry.play(id),false);
}
assert.equal(registry.available('hha'),false);
assert.equal(registry.hasClip('hha'),false);
assert.equal(registry.pendingCount(),8);
console.log('Arabic letter audio mapping: 8/8, safe pending-review gate: PASS');
