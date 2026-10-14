/* U01 French stored runtime variants: preserve variant source, not just question IDs. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const root='assets/i18n/questions/';
const english=read(root+'en/runtime/U01.variants.json');
const french=read(root+'fr/runtime/staging/U01.variants.json');
const canon=read(root+'en/units/U01.json');
const gate=read('assets/i18n/content-support.json').languages.fr;
assert.equal(gate.question_data,'missing');assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
for(const [k,v] of Object.entries({
 schema_version:1,locale:'fr',unit:'U01',scope:'stored_runtime_variants_staging',
 question_count:20,status:'staging_not_available_in_runtime',release_ready:false,
 expert_approved:false,verified_by_religious_expert:false,native_reviewer_approved:false,source_language:'tr'
}))assert.equal(french[k],v);
const ids=Object.keys(english.translations);
assert.equal(ids.length,20);
assert.deepEqual(Object.keys(french.translations),ids);
const eq=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const blanks=x=>(String(x??'').match(/_{2,}|\[\s*\]|\{blank\}/g)||[]).length;
const fields=['question_tr','explanation_tr','activity_type','options_tr','correct_answer','pairs','items','correct_order'];
const problems=[],types={};let choice=0,matching=0,fill=0,overlap=0,variantSourceDifferences=0;
for(const id of ids){
 const source=english.translations[id].source,entry=french.translations[id],s=entry?.source,d=entry?.display;
 const bad=msg=>problems.push(id+':'+msg);
 if(!entry||!s||!d){bad('missing_entry');continue;}
 for(const k of fields)if(!eq(s[k],source[k]))bad('source_changed_'+k);
 if(d.activity_type!==s.activity_type)bad('activity_type');
 if(entry.expert_approved!==false||entry.native_reviewer_approved!==false||entry.status!=='traduction_provisoire_relecture_francophone_et_religieuse_requise')bad('review_claim');
 if(!d.question_tr?.trim()||!d.explanation_tr?.trim()||!d.stage_title?.trim()||!d.topic?.trim())bad('missing_text');
 if(d.question_tr===s.question_tr||d.explanation_tr===s.explanation_tr)bad('untranslated');
 if(blanks(d.question_tr)!==blanks(s.question_tr))bad('blank_structure');
 if(s.activity_type==='fill_blank')fill++;
 if(s.options_tr){
  choice++;
  const position=s.options_tr.indexOf(s.correct_answer);
  if(!Array.isArray(d.options_tr)||position<0||s.options_tr.length!==d.options_tr.length)bad('option_shape');
  else if(position!==d.options_tr.indexOf(d.correct_answer)||d.options_tr.filter(v=>v===d.correct_answer).length!==1||new Set(d.options_tr).size!==d.options_tr.length)bad('answer_index');
 }else if(d.options_tr!==null||d.correct_answer!==null)bad('unexpected_option');
 if(s.pairs){
  matching+=s.pairs.length;
  if(d.pairs?.length!==s.pairs.length)bad('matching_count');
  else for(const side of ['left','right'])if(new Set(d.pairs.map(x=>x[side])).size!==new Set(s.pairs.map(x=>x[side])).size)bad('matching_unique_'+side);
 }else if(d.pairs!==null)bad('unexpected_pairs');
 if(s.items){
  if(d.items?.length!==s.items.length||d.correct_order?.length!==s.correct_order.length)bad('sequence_count');
 }else if(d.items!==null||d.correct_order!==null)bad('unexpected_sequence');
 if(s.activity_type==='true_false'&&!eq(d.options_tr,['Vrai','Faux']))bad('truth_values');
 if(d.teaching_card!==null)bad('unexpected_teaching_card');
 for(const v of [d.question_tr,d.explanation_tr,d.correct_answer,...(d.options_tr||[]),...(d.pairs||[]).flatMap(p=>[p.left,p.right]),d.stage_title,d.topic].filter(x=>x!==null)){
  if(!v?.trim()||/[İıĞğŞş]/u.test(v))bad('invalid_visible_text');
 }
 const baseline=canon.translations[id]?.source;
 if(baseline){
  overlap++;
  if(fields.some(k=>!eq(s[k],baseline[k])))variantSourceDifferences++;
 }
 types[s.activity_type]=(types[s.activity_type]||0)+1;
}
assert.equal(overlap,8,'Variant/base ID overlaps changed');
assert(variantSourceDifferences>0,'Variant payloads must be audited independently of base IDs');
assert.equal(Object.keys(french.translations).length,20);
assert.deepEqual(problems,[],'Variant source, grading or translation failures');
console.log(JSON.stringify({
 locale:'fr',status:'staging_only',unit:'U01',storedVariants:20,
 sourceBaseIdOverlaps:overlap,overlapPayloadDifferences:variantSourceDifferences,
 types,optionBearing:choice,matchingPairs:matching,fillBlanks:fill,
 sourceOrAnswerErrors:0,nativeApproved:false,religiousApproved:false,
 runtimeActivated:false,legacy100StillPending:true
},null,2));
