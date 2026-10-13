/* Linguistic residue and grading structure checks, never religious expert approval. */
import {readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {root,baseQuestions,getSource} from './english-source.mjs';
const requested=process.argv.find(a=>/^U\d{2}$/.test(a));
const units=requested?[requested]:Array.from({length:15},(_,i)=>'U'+String(i+1).padStart(2,'0'));
const issues=[],sourceIssues=[],counts={},same=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const strings=value=>typeof value==='string'?[value]:Array.isArray(value)?value.flatMap(strings):value&&typeof value==='object'?Object.values(value).flatMap(strings):[];
const blank=s=>(String(s).match(/_{2,}|\[\s*\]|\{blank\}/g)||[]);
let total=0;
for(const unit of units){
 const p=root+'assets/i18n/questions/en/units/'+unit+'.json';if(!existsSync(p)){if(requested)issues.push(unit+':missing_package');continue;}
 const pack=JSON.parse(readFileSync(p,'utf8')),source=baseQuestions.filter(q=>q.stage_id.startsWith(unit));
 assert.equal(source.length,100);assert.equal(pack.locale,'en');assert.equal(pack.unit,unit);assert.equal(pack.expert_approved,false);assert.equal(pack.verified_by_religious_expert,false);
 const translations=pack.translations||{};counts[unit]=0;
 if(Object.keys(translations).length!==100)issues.push(unit+':expected_100_entries');
 for(const q of source){
  const e=translations[q.id],fail=message=>issues.push(q.id+':'+message);
  if(!e){fail('missing');continue;}
  if(!same(e.source,getSource(q)))fail('source_changed');const d=e.display;
  if(!d||!d.question_tr?.trim()||!d.explanation_tr?.trim()){fail('empty_text');continue;}
  if(!same(blank(q.question_tr),blank(d.question_tr)))fail('blank_structure_changed');
  if(q.options_tr){
   if(d.options_tr?.length!==q.options_tr.length)fail('option_count');
   const i=q.options_tr.indexOf(q.correct_answer);if(i<0||d.options_tr?.[i]!==d.correct_answer||d.options_tr?.filter(x=>x===d.correct_answer).length!==1)fail('answer_index_or_uniqueness');
   if(new Set(d.options_tr).size!==d.options_tr.length)fail('duplicate_option');
  }else if(q.correct_answer!=null&&!d.correct_answer?.trim())fail('missing_answer');
  if(q.pairs){
   if(d.pairs?.length!==q.pairs.length||d.pairs.some(p=>!p.left?.trim()||!p.right?.trim()))fail('matching_structure');
   for(const side of ['left','right']){
    const sourceDistinct=new Set(q.pairs.map(p=>p[side])).size;
    const displayDistinct=new Set(d.pairs?.map(p=>p[side])).size;
    if(sourceDistinct<q.pairs.length)sourceIssues.push({id:q.id,field:'pairs.'+side,issue:'duplicate_source_matching_label',distinct:sourceDistinct,pairs:q.pairs.length});
    if(displayDistinct!==sourceDistinct)fail('matching_label_identity_changed:'+side);
   }
  }
  if(q.items){if(d.items?.length!==q.items.length||new Set(d.items).size!==q.items.length)fail('sequence_items');if(!same(q.correct_order.map(x=>q.items.indexOf(x)),d.correct_order?.map(x=>d.items.indexOf(x))))fail('sequence_order');}
  for(const [field,value] of Object.entries(d))for(const text of strings(value)){
   if(/[\u0600-\u06ff]/.test(text))fail('Arabic_residue:'+field);
   if(/[ÇĞİÖŞÜçğıöşü]/.test(text))fail('Turkish_characters:'+field);
   if(/\b(?:Doğru|Yanlış|ibadet|ahlak|inanç|kulluk|Peygamber|Müslüman|Soru|Cevap|Tekrar)\b/i.test(text))fail('Turkish_residue:'+field);
   if(text===q[field]&&text.length>20)fail('untranslated:'+field);
  }
  if(!issues.some(s=>s.startsWith(q.id+':')))counts[unit]++;
 }
 for(const id of Object.keys(translations))if(!source.some(q=>q.id===id))issues.push(id+':unexpected_id');
 total+=counts[unit];
}
const report={locale:'en',unit_counts:counts,translated:total,base:1500,issues,issue_count:issues.length,source_issues:sourceIssues,source_issue_count:sourceIssues.length,checks:['source_identity','answer_index','unique_options','blank_structure','matching_structure','sequence_order','display_language_residue'],religious_expert_approved:0,native_english_reviewer_approved:0};
console.log(JSON.stringify(report,null,2));
if(process.env.DEEN_QA_OUTPUT){mkdirSync(process.env.DEEN_QA_OUTPUT,{recursive:true});writeFileSync(process.env.DEEN_QA_OUTPUT+'/english-'+(requested||'all')+'.json',JSON.stringify(report,null,2));}
if(issues.length)process.exitCode=1;
if(process.argv.includes('--require-complete')&&total!==1500)process.exitCode=1;
