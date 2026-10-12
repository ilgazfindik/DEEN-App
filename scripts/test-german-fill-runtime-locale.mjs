import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
const segment=readFileSync('release/v9.9.3-direct/segment-27.txt','utf8');
const index=readFileSync('index.html','utf8');
const pattern=/const SEGMENT_HASHES=\/\* DEEN_HASHES_START \*\/(\[[^\n]+?\])\/\* DEEN_HASHES_END \*\//;
const match=index.match(pattern);
assert(match,'DEEN release SHA-256 hash manifest missing');
const hashes=JSON.parse(match[1]);
assert.equal(hashes[27],createHash('sha256').update(segment).digest('hex'),
 'The fill monitoring script must match its release integrity digest');
const script=segment.match(/<script id="deen-v1044-fill-freeze-js">([\s\S]*?)<\/script>/)?.[1];
assert(script,'DEEN fill monitor script missing');
assert(script.includes("const continueBtn=document.getElementById('continueBtn');"));
const guard=script.match(/\/\(\?:devam\|continue\|متابعة\|weiter\|fortfahren\)\/i/);
assert(guard,'Expected safe continuation regex for German and existing languages');
const test=new RegExp('(?:devam|continue|متابعة|weiter|fortfahren)','i');
for(const label of ['Devam Et','Continue','متابعة','Weiter','FORTFAHREN'])
 assert(test.test(label),'Missing supported continue label: '+label);
assert(!test.test('Abbrechen'),'Invalid continue label should be rejected');
console.log(JSON.stringify({status:'passed',segment:27,sha256:hashes[27],
 german_continue:['Weiter','Fortfahren'],original_languages_preserved:true}));
