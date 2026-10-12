import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createGermanQuestionStagingAdapter} from '../assets/i18n/german-question.adapter.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const manifests=read('assets/i18n/content-support.json');
assert.equal(manifests.languages.de.question_data,'missing');
assert.equal(manifests.languages.de.global_qa,'blocked');
assert.equal(manifests.languages.de.religious_expert_approved,false);
const parts=[];
for(let unit=1;unit<=15;unit++)for(let stage=1;stage<=7;stage++)
 parts.push('assets/i18n/questions/de/staging/U'+String(unit).padStart(2,'0')+
 '-S'+String(stage).padStart(2,'0')+'.json');
for(let stage=1;stage<=7;stage++)
 parts.push('assets/i18n/questions/de/runtime/staging/U01-S'+String(stage).padStart(2,'0')+'.live.json');
parts.push('assets/i18n/questions/de/runtime/staging/U01.variants.json',
 'assets/i18n/questions/de/runtime/staging/U01.legacy-renderer.json');
const packs=parts.map(read);
const adapter=createGermanQuestionStagingAdapter({packs});
const records={base_staging:[],live_runtime_staging:[],
 stored_runtime_variants_staging:[],legacy_u01_presenter_staging:[]};
const signatureFields=['question_tr','explanation_tr','activity_type','options_tr','correct_answer','pairs','items','correct_order'];
for(const pack of packs){
 const scope=pack.scope||'base_staging';
 for(const [id,entry] of Object.entries(pack.translations)){
  const original={id,stage_id:id.match(/U\d\d-S\d\d/)?.[0]||'',...structuredClone(entry.source)};
  const translated=adapter.translate(original,{qaMode:true,scope});
  assert(translated,scope+' did not translate '+id);
  assert.equal(translated.__deenQANotForRelease,true);
  assert.equal(translated.__deenQAScope,scope);
  assert.equal(translated.__deenSourceQuestion,original);
  assert.deepEqual(translated.options_tr,entry.display.options_tr,scope+':'+id+':choices');
  assert.deepEqual(translated.pairs,entry.display.pairs,scope+':'+id+':matching');
  assert.deepEqual(translated.items,entry.display.items,scope+':'+id+':sequence');
  assert.deepEqual(translated.correct_order,entry.display.correct_order,scope+':'+id+':order');
  assert.equal(translated.correct_answer,entry.display.correct_answer,scope+':'+id+':answer');
  for(const field of signatureFields)assert.deepEqual(original[field],entry.source[field],
    'QA adapter mutated Turkish source field '+field+':'+id);
  assert.equal(original.question_tr,entry.source.question_tr);
  assert.notEqual(adapter.translate({...original,question_tr:original.question_tr+' [DRIFT]'},
   {qaMode:true,scope}),translated,'Source drift silently reused a display');
  assert.equal(adapter.translate({...original,question_tr:original.question_tr+' [DRIFT]'},
   {qaMode:true,scope}),null,'Source drift should fail closed');
  if(Array.isArray(original.options_tr)&&original.options_tr.length){
   const wrong={...original,options_tr:[...original.options_tr]};
   wrong.options_tr[0]+=' [DRIFT]';
   assert.equal(adapter.translate(wrong,{qaMode:true,scope}),null,'Options drift should fail closed');
  }
  if(Array.isArray(original.pairs)&&original.pairs.length){
   const wrong={...original,pairs:structuredClone(original.pairs)};
   wrong.pairs[0].left+=' [DRIFT]';
   assert.equal(adapter.translate(wrong,{qaMode:true,scope}),null,'Matching drift should fail closed');
  }
  if(Array.isArray(original.items)&&original.items.length){
   const wrong={...original,items:[...original.items]};
   wrong.items[0]+=' [DRIFT]';
   assert.equal(adapter.translate(wrong,{qaMode:true,scope}),null,'Sequence drift should fail closed');
  }
  records[scope].push(original);
 }
}
const expected={base_staging:1500,live_runtime_staging:84,
 stored_runtime_variants_staging:20,legacy_u01_presenter_staging:100};
assert.deepEqual(adapter.inventory().counts,expected);
for(const [scope,items] of Object.entries(records)){
 assert.equal(items.length,expected[scope]);
 const check=adapter.inspect(items,{scope});
 assert.equal(check.translated,expected[scope],scope+': missing source-matched translation');
 assert.deepEqual(check.unresolved,[],scope+': unresolved entries');
}
assert.throws(()=>adapter.translate(records.base_staging[0],{qaMode:false,scope:'base_staging'}),
 /DE_QA_UNAPPROVED_CONTENT/);
assert.throws(()=>adapter.translate(records.base_staging[0],{qaMode:true,locale:'en',scope:'base_staging'}),
 /DE_QA_UNAPPROVED_CONTENT/);
assert.equal(adapter.translate({...records.base_staging[0],id:'MISSING'},
 {qaMode:true,scope:'base_staging'}),null);
assert.equal(adapter.translate({...records.base_staging[0],correct_answer:'tampered'},
 {qaMode:true,scope:'base_staging'}),null);
const sample=adapter.translate(records.live_runtime_staging[0],
 {qaMode:true,scope:'live_runtime_staging'});
assert(sample);
assert.equal(adapter.adaptQuestionPrompt('Birlikte düşün: '+sample.question_tr,sample,
 {qaMode:true}),'Überlege mit: '+sample.question_tr);
assert.equal(adapter.adaptQuestionPrompt(sample.question_tr,sample,{qaMode:true}),sample.question_tr);
assert.equal(adapter.adaptQuestionPrompt('Different: '+sample.question_tr,sample,{qaMode:true}),null);
assert.equal(adapter.adaptQuestionPrompt('Birlikte düşün: '+sample.question_tr,
 {...sample,__deenQANotForRelease:false},{qaMode:true}),null);
assert.throws(()=>adapter.adaptQuestionPrompt('Birlikte düşün: '+sample.question_tr,
 sample,{qaMode:false}),/DE_QA_UNAPPROVED_CONTENT/);
const totals=Object.fromEntries(Object.entries(records).map(([k,v])=>[k,v.length]));
console.log(JSON.stringify({status:'passed',staging_only:true,release_ready:false,
 scopes:totals,total_versions:Object.values(totals).reduce((a,b)=>a+b,0),
 checks:['exact_source','wrong_choice','matching','sequence','correct_answer',
 'source_integrity','no_prod_activation']},null,2));
