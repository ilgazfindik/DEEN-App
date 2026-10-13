// DEEN Arabic question coverage and grading-integrity audit.
// This script never edits questions, grants approval, or publishes a translation.
// Usage: node scripts/audit-arabic-questions.mjs [--require-complete]
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const segment=n=>readFileSync(resolve(root,'release/v9.9.3-direct/segment-'+String(n).padStart(2,'0')+'.txt'),'utf8');
const assembled=Array.from({length:7},(_,i)=>segment(i+2)).join('');
const header='const QUESTIONS=';
if(!assembled.startsWith(header))throw Error('Question-bank prefix changed');
if(!assembled.trimEnd().endsWith('];'))throw Error('Question-bank suffix changed');
const sourceQuestions=JSON.parse(assembled.slice(header.length).trim().replace(/;$/,''));
const locale=JSON.parse(readFileSync(resolve(root,'assets/i18n/questions.ar.draft.json'),'utf8'));
const drafts={};
for(let n=1;n<=15;n++){const file=JSON.parse(readFileSync(resolve(root,'assets/i18n/questions/ar/units/U'+String(n).padStart(2,'0')+'.json'),'utf8'));Object.assign(drafts,file.translations||{})}
const ids=new Set(),typeCount={},unitCount={},issues=[];
let sourceReviewNeeded=0,approved=0,structurallyValid=0,matched=0,readyForPublication=0,wrongOptionPositions=0;
function missing(entry,field){return !entry||typeof entry[field]!=='string'||!entry[field].trim();}
for(const q of sourceQuestions){
 if(!q?.id||ids.has(q.id))issues.push((q?.id||'UNKNOWN')+':duplicate_or_empty_id');
 ids.add(q.id);
 typeCount[q.activity_type]=(typeCount[q.activity_type]||0)+1;
 const unit=q.stage_id?.slice(0,3)||'unassigned';unitCount[unit]=(unitCount[unit]||0)+1;
 if(q.religious_release_ready!==true)sourceReviewNeeded++;
 const ar=drafts[q.id];if(!ar)continue;matched++;
 const errors=[];
 if(ar.source_question_tr!==q.question_tr)errors.push('stale_question');
 if(ar.source_correct_answer_tr!==q.correct_answer)errors.push('stale_answer');
 if(missing(ar,'question_ar'))errors.push('question_ar_missing');
 if(missing(ar,'explanation_ar'))errors.push('explanation_ar_missing');
 const sourceBlanks=(q.question_tr?.match(/___/g)||[]).length;
 const translatedBlanks=(ar.question_ar?.match(/___/g)||[]).length;
 if(sourceBlanks!==translatedBlanks)errors.push('blank_count_changed');
 if(Array.isArray(q.options_tr)){
  if(!Array.isArray(ar.options_ar)||ar.options_ar.length!==q.options_tr.length)errors.push('options_count_changed');
  if(q.correct_answer!=null){
   const expected=q.options_tr.indexOf(q.correct_answer),actual=ar.options_ar?.indexOf(ar.correct_answer_ar);
   if(expected<0)errors.push('source_correct_option_missing');
   else if(actual!==expected){wrongOptionPositions++;errors.push('correct_option_index_changed');}
   if(ar.options_ar?.filter(x=>x===ar.correct_answer_ar).length!==1)errors.push('correct_option_not_unique');
  }
 }else if(q.correct_answer!=null&&missing(ar,'correct_answer_ar'))errors.push('fill_or_single_answer_missing');
 const pairs=q.pairs;
 if(Array.isArray(pairs)&&pairs.length){
  if(!Array.isArray(ar.pairs_ar)||ar.pairs_ar.length!==pairs.length)errors.push('matching_pairs_missing');
  else if(ar.pairs_ar.some(p=>!p||!p.left||!p.right))errors.push('matching_pair_text_missing');
 }
 if(Array.isArray(q.items)&&q.items.length&&(!Array.isArray(ar.items_ar)||ar.items_ar.length!==q.items.length))errors.push('sequence_items_missing');
 if(Array.isArray(q.correct_order)&&q.correct_order.length&&(!Array.isArray(ar.correct_order_ar)||ar.correct_order_ar.length!==q.correct_order.length))errors.push('correct_sequence_missing');
 if(errors.length)issues.push(q.id+':'+errors.join(','));
 else{
  structurallyValid++;
  if(ar.expert_approved===true)approved++;
  if(ar.expert_approved===true&&q.religious_release_ready===true)readyForPublication++;
 }
}
const extras=Object.keys(drafts).filter(id=>!ids.has(id));
extras.forEach(id=>issues.push(id+':unknown_translation_id'));
const report={
 source:'release/v9.9.3-direct/segment-02..08',
 base_questions:sourceQuestions.length,
 unique_base_question_ids:ids.size,
 translated_drafts:matched,
 structurally_valid_drafts:structurallyValid,
 arabic_expert_approved:approved,
 religious_source_review_needed:sourceReviewNeeded,
 ready_for_publication:readyForPublication,
 untranslated_base_questions:sourceQuestions.length-matched,
 dynamic_question_packs:'NOT_INCLUDED_IN_BASE_COUNT; separately audit runtime format variants',
 wrong_option_positions:wrongOptionPositions,
 unit_counts:unitCount,
 type_counts:typeCount,
 issues:issues.slice(0,150),
 issue_count:issues.length
};
console.log(JSON.stringify(report,null,2));
if(process.env.GITHUB_STEP_SUMMARY){
 const {appendFileSync}=await import('node:fs');
 appendFileSync(process.env.GITHUB_STEP_SUMMARY,
  '## Arabic question audit\n\n'+
  '| Metric | Count |\n|---|---:|\n'+
  '| Base questions | '+report.base_questions+' |\n'+
  '| Arabic drafts | '+report.translated_drafts+' |\n'+
  '| Structural checks passed | '+report.structurally_valid_drafts+' |\n'+
  '| Arabic expert approved | '+report.arabic_expert_approved+' |\n'+
  '| Ready to publish | '+report.ready_for_publication+' |\n'+
  '| Missing translations | '+report.untranslated_base_questions+' |\n'+
  '| Issues | '+report.issue_count+' |\n\n'+
  'Base-bank figures exclude added runtime question variants.\n');
}
if(issues.length)process.exitCode=1;
if(process.argv.includes('--require-complete') &&
 (report.untranslated_base_questions!==0||report.ready_for_publication!==report.base_questions||issues.length))process.exitCode=1;
