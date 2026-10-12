/*
 * German content-adapter integration smoke test.
 * Uses the REAL production content.js in a VM with an IN-MEMORY STAGING manifest.
 * It does NOT alter content-support.json or enable German in the shipped app.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const root=fileURLToPath(new URL('../',import.meta.url));
const readJSON=path=>JSON.parse(readFileSync(root+path,'utf8'));
const actualManifest=readJSON('assets/i18n/content-support.json');
assert.equal(actualManifest.languages.de.question_data,'missing','German must stay unavailable in production');
assert.equal(actualManifest.languages.de.global_qa,'blocked','German QA must stay blocked in production');

const basePacks=[];
for(let u=1;u<=15;u++)for(let stage=1;stage<=7;stage++){
 const name='U'+String(u).padStart(2,'0')+'-S'+String(stage).padStart(2,'0')+'.json';
 basePacks.push('assets/i18n/questions/de/staging/'+name);
}
const runtimePacks=[
 ...Array.from({length:7},(_,i)=>'assets/i18n/questions/de/runtime/staging/U01-S0'+(i+1)+'.live.json'),
 'assets/i18n/questions/de/runtime/staging/U01.variants.json',
 'assets/i18n/questions/de/runtime/staging/U01.legacy-renderer.json'
];
const files=[...basePacks,...runtimePacks];
const fileData=Object.fromEntries(files.map(p=>[p,readJSON(p)]));
const base=basePacks.flatMap(p=>Object.entries(fileData[p].translations).map(([id,v])=>({id,...v.source})));
const active=[
 ...base.filter(q=>!q.id.startsWith('DEEN-U01-')),
 ...runtimePacks.slice(0,7).flatMap(p=>Object.entries(fileData[p].translations).map(([id,v])=>({id,...v.source})))
];
assert.equal(base.length,1500);
assert.equal(active.length,1484);
const staged={...actualManifest,
 languages:{...actualManifest.languages,
  de:{entry:'complete',question_data:'complete',global_qa:'passed',
   parts:files.map(p=>({path:'./'+p,count:Object.keys(fileData[p].translations).length}))}}};
const errors=[];
const sandboxWindow={
 __DEEN_CONTENT_MANIFEST__:staged, DEEN_APP_LOCALE:{get:()=> 'de'},
 DEEN_BASE_QUESTIONS:base, __DEEN_DEPLOY_ID__:'stage-test-only',
 DEEN_BOOT:{progress:()=>{}}
};
const sourceFetch=async url=>{
 const pathname=String(url).split('?')[0].replace(/^\.\//,'');
 if(!(pathname in fileData))return {ok:false,status:404,text:async()=>''};
 return {ok:true,status:200,text:async()=>JSON.stringify(fileData[pathname])};
};
const consoleProxy={error:(...args)=>errors.push(args.map(String).join(' ')),log:()=>{}};
vm.runInNewContext(readFileSync(root+'assets/i18n/content.js','utf8'),
 {window:sandboxWindow,QUESTIONS:active,fetch:sourceFetch,console:consoleProxy},{filename:'assets/i18n/content.js'});
const adapter=sandboxWindow.DEEN_CONTENT_LOCALE;
assert(adapter);
assert.equal(await adapter.preload('de'),true,'Actual content adapter could not preload all staged German questions: '+errors.join(' | '));
assert.deepEqual(adapter.inspectBank(base,'de').failedIds,[]);
assert.deepEqual(adapter.inspectBank(active,'de').failedIds,[]);

let checked=0,duplicates=0,variants=0,legacy=0;
const seen=new Map();
for(const path of files){
 const pack=fileData[path];
 for(const [id,entry] of Object.entries(pack.translations)){
  const source={id,...entry.source};
  const translated=adapter.translateQuestion(source,'de');
  assert(translated,'Untranslated '+path+':'+id);
  assert.equal(translated.question_tr,entry.display.question_tr,'Wrong source variant selected '+path+':'+id);
  assert.equal(translated.explanation_tr,entry.display.explanation_tr,'Wrong explanation selected '+path+':'+id);
  assert.equal(translated.correct_answer,entry.display.correct_answer,'Wrong grading choice '+path+':'+id);
  assert.equal(translated.activity_type,entry.source.activity_type,'Activity type was changed '+path+':'+id);
  assert.equal(translated.__deenSourceQuestion,source,'Original source identity must survive '+path+':'+id);
  assert.equal(adapter.validate(entry.source,entry),true,'Entry failed production validator '+path+':'+id);
  checked++;
  const prior=seen.get(id)||[];if(prior.length)duplicates++;prior.push({path,source:entry.source,display:entry.display});seen.set(id,prior);
  if(path.endsWith('U01.variants.json'))variants++;
  if(path.endsWith('U01.legacy-renderer.json'))legacy++;
 }
}
assert.equal(checked,1500+84+20+100);
assert.equal(variants,20);
assert.equal(legacy,100);
assert.equal(duplicates,108,'Expected 8 variant and 100 legacy ID collisions');
const collisions=[...seen.values()].filter(v=>v.length>1);
assert(collisions.length>0);
for(const versions of collisions)for(const version of versions){
 const q={id:[...seen].find(([,set])=>set===versions)[0],...version.source};
 const got=adapter.translateQuestion(q,'de');
 assert.equal(got?.question_tr,version.display.question_tr,'Overlapping ID chose wrong version: '+q.id);
}
assert.equal(adapter.translateQuestion({id:'DEEN-U01-S01-001',question_tr:'not the original question'},'de'),null,'ID-only fallback is unsafe');
const variantQuestion=fileData['assets/i18n/questions/de/runtime/staging/U01.variants.json'].translations['DEEN-U01-S01-001'];
assert.equal(adapter.translateQuestion({id:'DEEN-U01-S01-001',...variantQuestion.source,activity_type:'multiple_choice'},'de'),null,'Type mismatch must fail closed');
assert.equal(adapter.translateQuestion({id:'DEEN-U01-S01-001',...variantQuestion.source,options_tr:['corrupted']},'de'),null,'Option mismatch must fail closed');
// The VM's green staged manifest is a test fixture, NEVER written to disk.
assert.equal(readJSON('assets/i18n/content-support.json').languages.de.question_data,'missing');
assert.equal(readJSON('assets/i18n/content-support.json').languages.de.global_qa,'blocked');
console.log(JSON.stringify({
 status:'passed',locale:'de',staging_only:true,
 base:base.length,active:active.length,checked,
 duplicate_entries:duplicates,collision_ids:collisions.length,
 stored_variants:variants,legacy,production_manifest:'blocked',
 negative_guards:['wrong_source','wrong_activity_type','wrong_options'],
 request_count:files.length
},null,2));
