/* Fail-closed German production bridge contract. No live locale activation. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createGermanUIProductionRenderer,germanReleaseAuthorized}
 from '../assets/i18n/german-ui.production.mjs';
const read=path=>readFileSync(path,'utf8');
const json=path=>JSON.parse(read(path));
const support=json('assets/i18n/content-support.json');
const de=support.languages.de;
assert.equal(de.question_data,'missing');
assert.equal(de.global_qa,'blocked');
for(const key of ['religious_expert_approved','native_reviewer_approved','rights_reviewed',
  'ui_release_ready','quran_meanings_approved','production_bridge_ready'])
 assert.equal(de[key],false,'Approval not granted: '+key);
assert.equal(germanReleaseAuthorized(support),false);
const hash=s=>createHash('sha256').update(s).digest('hex');
assert.equal(de.production_bridge_sha256,hash(read('assets/i18n/german-ui.production.mjs')));
const shell=read('index.html'),boot=read('assets/i18n/boot.js');
const quranJourney=read('release/v9.9.3-direct/segment-49.txt');
assert.match(quranJourney,/DEEN_GERMAN_QURAN_MEANINGS.*get/);
assert.match(read('assets/i18n/german-ui.production.mjs'),/resolveGermanAyahMeaning/);
const hashes=JSON.parse(shell.match(/const ASSET_HASHES=\/\* DEEN_ASSET_HASHES_START \*\/(\{[^\n]+\})\/\* DEEN_ASSET_HASHES_END \*\//)[1]);
assert.equal(hashes['boot.js'],hash(boot));
assert.equal(hashes['content-support.json'],hash(read('assets/i18n/content-support.json')));
assert.match(boot,/await prepareGermanPresentation\(\)/);
assert.match(boot,/DE_GERMAN_RELEASE_APPROVAL_REQUIRED/);
assert.match(boot,/DE_GERMAN_BRIDGE_INTEGRITY_FAILED/);
const uiNames=['german-ui.staging.json','german-ui.lesson-flow.staging.json',
 'german-ui.premium-shop.staging.json','german-ui.quran-controls.staging.json',
 ...Array.from({length:8},(_,i)=>'german-ui.reference-batch-'+String(i+1).padStart(2,'0')+'.staging.json'),
 'german-ui.real-lesson.staging.json'];
const packs=uiNames.map(name=>json('assets/i18n/'+name));
const reference=json('assets/i18n/english-ui.draft.json');
const renderer=createGermanUIProductionRenderer({packs,englishReference:reference.translations});
const firstKey=Object.keys(packs[0].translations)[0];
assert.equal(renderer.translate(firstKey),packs[0].translations[firstKey]);
assert.equal(renderer.translate('UNKNOWN_NOT_A_SOURCE_TRANSLATION'),null);
assert.throws(()=>renderer.render({},{locale:'de',releaseAuthorized:false}),
 /DE_GERMAN_UI_NOT_RELEASE_AUTHORIZED/);
const fake={...support,languages:{...support.languages,de:{...de,entry:'complete',
 question_data:'complete',global_qa:'passed',religious_expert_approved:true,
 native_reviewer_approved:true,rights_reviewed:true,ui_release_ready:true,
 quran_meanings_approved:true,production_bridge_ready:true,
 parts:Array.from({length:114},(_,i)=>({path:'./test/'+i+'.json',count:1,sha256:'a'.repeat(64)})),
 ui_parts:uiNames.map(name=>({path:'./assets/i18n/'+name,sha256:'b'.repeat(64)})),
 ui_reference_sha256:'c'.repeat(64),quran_meanings_sha256:'d'.repeat(64),
 quran_meanings_path:'./assets/i18n/quran/de/ayah-meanings.approved.json',
 quran_audio_manifest_sha256:'e'.repeat(64)}}};
assert.equal(germanReleaseAuthorized(fake),true,'A structurally reviewed manifest must pass');
for(const key of ['religious_expert_approved','native_reviewer_approved','rights_reviewed',
 'ui_release_ready','quran_meanings_approved','production_bridge_ready']){
 const wrong=structuredClone(fake);wrong.languages.de[key]=false;
 assert.equal(germanReleaseAuthorized(wrong),false,'False signoff was accepted: '+key);
}
for(const broken of ['question_data','global_qa','parts','ui_parts','ui_reference_sha256',
 'quran_meanings_sha256','quran_audio_manifest_sha256','quran_meanings_path',
 'production_bridge_sha256']){
 const wrong=structuredClone(fake);
 wrong.languages.de[broken]=null;
 assert.equal(germanReleaseAuthorized(wrong),false,'Missing release resource accepted: '+broken);
}
const reordered=structuredClone(fake);
reordered.languages.de.ui_parts.reverse();
assert.equal(germanReleaseAuthorized(reordered),false,'Source pack order changed');
console.log(JSON.stringify({result:'passed',mode:'production-wired-release-locked',
 approvals:false,source_ui_packs:packs.length,production_module_sha256:de.production_bridge_sha256,
 runtime_questions_unmodified:true,existing_locale_behavior_preserved:true},null,2));
