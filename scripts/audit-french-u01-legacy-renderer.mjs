/* U01 legacy French translation audit — source-exact, never publish. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const root='assets/i18n/questions/';
const original=read(root+'en/runtime/U01.legacy-renderer.json');
const staged=read(root+'fr/runtime/staging/U01.legacy-renderer.json');
const base=Object.assign({},...Array.from({length:7},(_,i)=>
 read(root+'fr/staging/U01-S'+String(i+1).padStart(2,'0')+'.json').translations));
const gate=read('assets/i18n/content-support.json').languages.fr;
assert.equal(gate.question_data,'missing');
assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
assert(!gate.bank&&!gate.parts?.length);
for(const [field,value] of Object.entries({
 schema_version:1,locale:'fr',unit:'U01',scope:'legacy_u01_presenter_staging',
 question_count:100,status:'staging_not_available_in_runtime',source_language:'tr',
 release_ready:false,expert_approved:false,verified_by_religious_expert:false,
 native_reviewer_approved:false
}))assert.equal(staged[field],value,'Unreviewed production flag or metadata drift: '+field);
assert.deepEqual(staged.source_variations,{altered_question_prompts:100,altered_option_banks:7,ids_overlap_base:100});
const oldIds=Object.keys(original.translations),ids=Object.keys(staged.translations);
assert.equal(oldIds.length,100);
assert.deepEqual(ids,oldIds);
assert.equal(Object.keys(base).length,100);
const eq=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const blank=x=>(String(x||'').match(/_{2,}|\[\s*\]|\{blank\}/g)||[]).length;
const fields=['question_tr','explanation_tr','activity_type','options_tr','correct_answer','pairs','items','correct_order'];
const problems=[],types={};
let questions=0,optionBankDifferences=0,choiceQuestions=0,matchingPairs=0,fillQuestions=0,changedBlankFromCanonical=0,changedPromptCount=0;
for(const id of ids){
 const legacy=original.translations[id],pack=staged.translations[id],canon=base[id];
 const bad=msg=>problems.push(id+':'+msg);
 if(!legacy||!canon||!pack?.source||!pack?.display){bad('unknown_or_missing');continue}
 const s=pack.source,d=pack.display,baseD=canon.display,baseS=canon.source;
 for(const field of fields)if(!eq(s[field],legacy.source[field]))bad('source_change:'+field);
 if(pack.expert_approved!==false||pack.native_reviewer_approved!==false||pack.status!=='traduction_provisoire_relecture_francophone_et_religieuse_requise')bad('approval_claim');
 if(d.activity_type!==s.activity_type)bad('activity_type');
 if(d.question_tr===baseD.question_tr||d.question_tr===s.question_tr||!d.question_tr?.trim())bad('missing_distinct_french_legacy_prompt');
 if(!d.explanation_tr?.trim()||!d.stage_title?.trim()||!d.topic?.trim())bad('missing_visible_metadata');
 if(!eq(d.explanation_tr,baseD.explanation_tr)||!eq(d.topic,baseD.topic)||!eq(d.stage_title,baseD.stage_title))bad('unchanged_translation_was_mutated');
 if(blank(d.question_tr)!==blank(s.question_tr))bad('blank_count');
 if(blank(baseS.question_tr)!==blank(s.question_tr))changedBlankFromCanonical++;
 if(s.activity_type==='fill_blank'){fillQuestions++;if(blank(d.question_tr)!==1)bad('fill_blank_slot_missing');}
 const sourceChoicesChanged=!eq(s.options_tr,baseS.options_tr);
 if(sourceChoicesChanged)optionBankDifferences++;
 if(s.options_tr){
  choiceQuestions++;
  const pos=s.options_tr.indexOf(s.correct_answer);
  if(!Array.isArray(d.options_tr)||d.options_tr.length!==s.options_tr.length||pos<0)bad('option_shape');
  else {
   if(pos!==d.options_tr.indexOf(d.correct_answer)||d.options_tr.filter(v=>v===d.correct_answer).length!==1)bad('correct_answer_index');
   if(new Set(d.options_tr).size!==d.options_tr.length)bad('duplicate_options');
  }
 }else if(d.options_tr!==null)bad('unexpected_options');
 if(sourceChoicesChanged){
  if(!s.options_tr||s.activity_type!=='fill_blank')bad('unsupported_source_choice_change');
  if(eq(d.options_tr,baseD.options_tr))bad('changed_choice_bank_not_translated');
 }else if(!eq(d.options_tr,baseD.options_tr)||!eq(d.correct_answer,baseD.correct_answer))bad('unnecessary_choice_change');
 if(s.pairs){
  if(d.pairs?.length!==s.pairs.length)bad('matching_count');
  else {
   matchingPairs+=d.pairs.length;
   for(const side of ['left','right']){
    if(new Set(d.pairs.map(p=>p[side])).size!==new Set(s.pairs.map(p=>p[side])).size)bad('matching_unique_'+side);
    if(d.pairs.some(p=>!p[side]?.trim()))bad('matching_empty_'+side);
   }
  }
 }else if(d.pairs!==null)bad('unexpected_pairs');
 if(!eq(d.pairs,baseD.pairs))bad('existing_matching_translation_changed');
 if(s.items){
  if(d.items?.length!==s.items.length||d.correct_order?.length!==s.correct_order.length)bad('sequence_shape');
 }else if(d.items!==null||d.correct_order!==null)bad('unexpected_sequence');
 if(!eq(d.items,baseD.items)||!eq(d.correct_order,baseD.correct_order))bad('sequence_changed');
 if(s.activity_type==='true_false'&&!eq(d.options_tr,['Vrai','Faux']))bad('true_false_choices');
 const strings=[d.question_tr,d.explanation_tr,d.correct_answer,...(d.options_tr||[]),...(d.pairs||[]).flatMap(x=>[x.left,x.right]),...(d.items||[]),...(d.correct_order||[]),d.topic,d.stage_title].filter(v=>v!==null);
 for(const value of strings){
  if(typeof value!=='string'||!value.trim())bad('invalid_visible_text');
  if(/[İıĞğŞş]/u.test(value))bad('Turkish_special_letters');
 }
 if(!eq(d.question_tr,baseD.question_tr))changedPromptCount++;
 types[s.activity_type]=(types[s.activity_type]||0)+1;
 questions++;
}
assert.equal(questions,100);
assert.equal(changedPromptCount,100);
assert.equal(optionBankDifferences,7);
assert.equal(changedBlankFromCanonical,1);
assert.deepEqual(problems,[],'French legacy renderer audit failures');
console.log(JSON.stringify({
 locale:'fr',unit:'U01',scope:'legacy_u01_presenter_staging',
 questions,sourcePromptDifferences:changedPromptCount,changedOptionBanks:optionBankDifferences,
 changedSourceBlankStructures:changedBlankFromCanonical,choiceQuestions,matchingPairs,
 fillQuestions,types,structuralErrors:0,all100BaseIdsOverlap:true,
 nativeApproved:false,religiousApproved:false,runtimeActivated:false
},null,2));
