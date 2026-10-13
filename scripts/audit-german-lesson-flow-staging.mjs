/* German lesson-flow UI dictionary audit against the exact English runtime dictionary.
   Reads staging data only: does not enable German lessons or claim human review. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=path=>JSON.parse(readFileSync(root+path,'utf8'));
const stage=read('assets/i18n/german-ui.lesson-flow.staging.json');
const previous=read('assets/i18n/german-ui.staging.json');
const manifest=read('assets/i18n/content-support.json');
assert.equal(manifest.languages.de.question_data,'missing');
assert.equal(manifest.languages.de.global_qa,'blocked');
assert(!manifest.languages.de.parts?.length);
const source=readFileSync(root+'assets/i18n/english-ui.js','utf8');
const cut='const SCREENSHOT_PRIORITY=';
assert(source.includes(cut),'English UI dictionary boundary has changed');
const code=source.slice(0,source.indexOf(cut))+'return D;\n})()';
const english=vm.runInNewContext(code,{}, {timeout:2500,filename:'english-ui.js:dictionary'});
const expectedGroups={stage_intro:41,question_feedback:33,result_flow:94,streak_xp:29};
for(const [key,v]of Object.entries({schema_version:1,locale:'de',scope:'lesson_flow_ui_staging',release_ready:false,global_qa:'blocked',expert_approved:false,native_reviewer_approved:false,verified_by_religious_expert:false,reference:'assets/i18n/english-ui.js'}))assert.equal(stage[key],v,'metadata:'+key);
const keys=Object.keys(stage.translations||{}),owners=new Set(),issues=[];
assert.equal(stage.translation_count,197);
assert.equal(keys.length,197);
assert.deepEqual(Object.keys(stage.groups||{}).sort(),Object.keys(expectedGroups).sort());
for(const [group,count]of Object.entries(expectedGroups)){
 const groupKeys=stage.groups[group];assert(Array.isArray(groupKeys),group);
 assert.equal(groupKeys.length,count,group+':count');
 for(const key of groupKeys){
  if(owners.has(key))issues.push('duplicate_group_key:'+key);
  if(!Object.hasOwn(stage.translations,key))issues.push('missing_in_dictionary:'+key);
  owners.add(key);
 }
}
assert.equal(owners.size,keys.length);
const numbers=t=>(String(t).match(/\d+(?:[.,]\d+)?/g)||[]).sort();
const items=[];
for(const key of keys){
 const val=stage.translations[key];
 if(!Object.hasOwn(english,key))issues.push('unknown_runtime_source_key:'+key);
 if(Object.hasOwn(previous.translations,key))issues.push('overlap_with_primary_staging:'+key);
 if(typeof val!=='string'||!val.trim()){issues.push('empty_value:'+key);continue}
 if(/[ÇĞİŞçğıış\u0600-\u06ff]/.test(val)||/\b(?:yanlış|doğru|cevabı|hatırla|öğren|aşama|kazanırsın|günlük|sıradaki|başla|tamamlandı)\b/i.test(val))issues.push('Turkish_or_Arabic_residue:'+key);
 if(val===key)issues.push('untranslated_source_key:'+key);
 if(JSON.stringify(numbers(key))!==JSON.stringify(numbers(val)))issues.push('numeric_mismatch:'+key+' source='+numbers(key)+' display='+numbers(val));
 if(/(?:\b\d+\s*%|%\s*\d+)\b/.test(key)&&!/[%]/.test(val))issues.push('percent_missing:'+key);
 items.push(key);
}
const report={locale:'de',staging_only:true,existing_ui_keys:Object.keys(previous.translations).length,
 new_lesson_flow_strings:keys.length,total_staged_ui_strings:keys.length+Object.keys(previous.translations).length,
 groups:expectedGroups,matched_english_runtime_keys:items.length-issues.filter(x=>x.startsWith('unknown_runtime_source_key:')).length,
 release_ready:false,production_manifest:'blocked',issues};
console.log(JSON.stringify(report,null,2));
assert.equal(issues.length,0,issues.join('\n'));
