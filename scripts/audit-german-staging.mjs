// Staging-only German translation audit. Incomplete packs must remain unavailable.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {baseQuestions,sourceFields} from './english-source.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const manifest=read('assets/i18n/content-support.json');
const source=new Map(baseQuestions.map(q=>[q.id,q]));
// Full stage boundaries. No German content is exposed in runtime until all gates pass.
const stages=[
 ...[14,14,14,16,16,12,14].map((count,i)=>({unit:'U01',stage:'S'+String(i+1).padStart(2,'0'),count})),
 ...[14,14,14,16,16,12,14].map((count,i)=>({unit:'U02',stage:'S'+String(i+1).padStart(2,'0'),count})),
 ...[14,14,14,16,16,12,14].map((count,i)=>({unit:'U03',stage:'S'+String(i+1).padStart(2,'0'),count})),
 ...[14,14,14,16,16,12,14].map((count,i)=>({unit:'U04',stage:'S'+String(i+1).padStart(2,'0'),count})),
 ...[14,14,14,16,16,12,14].map((count,i)=>({unit:'U05',stage:'S'+String(i+1).padStart(2,'0'),count})),
 ...[14,14,14,16,16,12,14].map((count,i)=>({unit:'U06',stage:'S'+String(i+1).padStart(2,'0'),count})),
 ...[14,14,14,16,16,12,14].map((count,i)=>({unit:'U07',stage:'S'+String(i+1).padStart(2,'0'),count})),
 ...[14,14,14,16,16,12,14].map((count,i)=>({unit:'U08',stage:'S'+String(i+1).padStart(2,'0'),count})),
 ...[14,14,14,16,16,12,14].map((count,i)=>({unit:'U09',stage:'S'+String(i+1).padStart(2,'0'),count})),
 ...[14,14,14,16,16,12,14].map((count,i)=>({unit:'U10',stage:'S'+String(i+1).padStart(2,'0'),count})),
 ...[14,14,14,16,16,12,14].map((count,i)=>({unit:'U11',stage:'S'+String(i+1).padStart(2,'0'),count})),
 ...[14,14,14,16,16,12,14].map((count,i)=>({unit:'U12',stage:'S'+String(i+1).padStart(2,'0'),count})),
 ...[14,14,14,16,16].map((count,i)=>({unit:'U13',stage:'S'+String(i+1).padStart(2,'0'),count})),
];
const expectedCounts=Object.fromEntries(stages.map(({unit,stage,count})=>[unit+'-'+stage,count]));
const same=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const blankCount=s=>(String(s||'').match(/_{2,}|\[\s*\]|\{blank\}/g)||[]).length;
const types={},issues=[],ids=new Set();
let translated=0;
assert.equal(source.size,1500);
assert.equal(manifest.languages.de.question_data,'missing','German must not launch with partial packs');
assert.equal(manifest.languages.de.global_qa,'blocked','German must remain blocked');
assert(!manifest.languages.de.bank&&!manifest.languages.de.parts?.length,'No incomplete German parts in manifest');
for(const {unit,stage,count} of stages){
 const pack=read('assets/i18n/questions/de/staging/'+unit+'-'+stage+'.json');
 for(const [key,expected] of Object.entries({schema_version:1,locale:'de',unit,stage:unit+'-'+stage,status:'staging_not_available_in_runtime',expert_approved:false,verified_by_religious_expert:false,native_reviewer_approved:false}))assert.equal(pack[key],expected,'pack:'+unit+'-'+stage+':'+key);
 const entries=Object.entries(pack.translations);
 assert.equal(entries.length,count,unit+'-'+stage+' count');
 const problem=(id,what)=>issues.push(id+':'+what);
 for(let n=0;n<entries.length;n++){
  const [id,entry]=entries[n],original=source.get(id),s=entry.source,d=entry.display;
  if(id!=='DEEN-'+unit+'-'+stage+'-'+String(n+1).padStart(3,'0'))problem(id,'stage_id_or_order');
  if(ids.has(id))problem(id,'duplicate_translation');
  ids.add(id);
  if(!original||!s||!d){problem(id,'source_or_display_missing');continue;}
  for(const key of sourceFields)if(!same(s[key],original[key]))problem(id,'source_mismatch:'+key);
  if(d.activity_type!==s.activity_type)problem(id,'activity_type_changed');
  if(!d.question_tr?.trim()||!d.explanation_tr?.trim())problem(id,'empty_question_or_explanation');
  if(d.question_tr===s.question_tr||d.explanation_tr===s.explanation_tr)problem(id,'untranslated_field');
  if(blankCount(s.question_tr)!==blankCount(d.question_tr))problem(id,'blank_count_changed');
  if(entry.expert_approved!==false||entry.native_reviewer_approved!==false)problem(id,'approval_claim');
  if(s.activity_type==='build_sequence'){
   if(d.options_tr!==null||d.correct_answer!==null||d.pairs!==null)problem(id,'sequence_unexpected_options');
   if(!Array.isArray(d.items)||!Array.isArray(d.correct_order)||d.items.length!==s.items?.length||d.correct_order.length!==s.correct_order?.length)problem(id,'sequence_cardinality');
   else {
    const sorted=x=>[...x].sort().join('\u0000');
    if(sorted(d.items)!==sorted(d.correct_order))problem(id,'sequence_card_multiset');
    if(new Set(d.items).size!==new Set(s.items).size)problem(id,'sequence_card_distinctness');
    const sourcePosition=s.items.map(x=>s.correct_order.indexOf(x));
    const germanPosition=d.items.map(x=>d.correct_order.indexOf(x));
    if(!same(sourcePosition,germanPosition))problem(id,'sequence_correct_order_changed');
   }
  }else if(d.items!==null||d.correct_order!==null)problem(id,'unexpected_sequence_fields');
  // ö and ü are standard German letters. Only flag Turkish-specific letters and words.
  const strings=[d.question_tr,d.explanation_tr,...(d.options_tr||[]),d.correct_answer,...(d.pairs||[]).flatMap(x=>[x.left,x.right]),...(d.items||[]),...(d.correct_order||[])];
  for(const value of strings){
   if(value===null||value===undefined)continue;
   if(typeof value!=='string'||!value.trim()){problem(id,'bad_string');continue;}
   // Preserve a person's original name (Ayşe, including German genitive Ayşes):
   // a Turkish-specific letter inside a proper noun is not an untranslated interface string.
   const contentWithoutProperNames=value.replace(/Ayşe(?:s)?/g,'PERSON');
   if(/[ÇĞİŞçğıış]/.test(contentWithoutProperNames))problem(id,'turkish_specific_letter');
   if(/\b(?:sadece|doğru|yanlış|yapmak|ibadet|peygamber|müslüman|soru|cevap|öğrenme)\b/i.test(value))problem(id,'turkish_word');
   if(/\b(?:which|the|only|faith|worship|because)\b/i.test(value))problem(id,'english_word');
  }
  if(s.activity_type==='matching'){
   if(d.options_tr!==null||d.correct_answer!==null)problem(id,'matching_options_or_answer');
   if(!Array.isArray(d.pairs)||d.pairs.length!==s.pairs?.length)problem(id,'matching_pair_count');
   else for(const side of ['left','right']){
    if(d.pairs.some(pair=>typeof pair?.[side]!=='string'||!pair[side].trim()))problem(id,'empty_matching_label:'+side);
    // Preserve source ambiguity count; never convert distinct source labels to duplicates.
    const sourceDistinct=new Set(s.pairs.map(p=>p[side])).size;
    const translatedDistinct=new Set(d.pairs.map(p=>p[side])).size;
    if(translatedDistinct!==sourceDistinct)problem(id,'matching_label_identity:'+side);
   }
  }else if(s.activity_type==='build_sequence'){
   // Sequence-card checks are handled separately above; no scalar answer is expected.
  }else{
   if(d.pairs!==null)problem(id,'unexpected_matching_pairs');
   if(Array.isArray(s.options_tr)){
    if(!Array.isArray(d.options_tr)||d.options_tr.length!==s.options_tr.length)problem(id,'options_count');
    else{
     const originalIndex=s.options_tr.indexOf(s.correct_answer);
     const translatedIndex=d.options_tr.indexOf(d.correct_answer);
     if(originalIndex<0||translatedIndex!==originalIndex)problem(id,'correct_answer_index');
     if(new Set(d.options_tr).size!==d.options_tr.length)problem(id,'duplicate_translation_options');
     if(d.options_tr.filter(x=>x===d.correct_answer).length!==1)problem(id,'correct_answer_ambiguity');
    }
   }else{
    if(d.options_tr!==null)problem(id,'unexpected_options');
    if(typeof d.correct_answer!=='string'||!d.correct_answer.trim())problem(id,'missing_fill_answer');
   }
  }
  if(s.activity_type==='fill_blank'&&blankCount(d.question_tr)!==1)problem(id,'fill_slot');
  types[s.activity_type]=(types[s.activity_type]||0)+1;
  translated++;
 }
}
const report={locale:'de',phase:'U01-U12 complete; U13-S01 through U13-S05 staged',production_ready:false,base_question_total:1500,staged_questions:translated,u01_staged:100,u02_staged:100,u03_staged:100,u04_staged:100,u05_staged:100,u06_staged:100,u07_staged:100,u08_staged:100,u09_staged:100,u10_staged:100,u11_staged:100,u12_staged:100,u13_staged:74,u01_remaining:0,u02_remaining:0,u03_remaining:0,u04_remaining:0,u05_remaining:0,u06_remaining:0,u07_remaining:0,u08_remaining:0,u09_remaining:0,u10_remaining:0,u11_remaining:0,u12_remaining:0,u13_remaining:26,stages:expectedCounts,types,issue_count:issues.length,issues};
console.log(JSON.stringify(report,null,2));
if(issues.length)process.exitCode=1;
