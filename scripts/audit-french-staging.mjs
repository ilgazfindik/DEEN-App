/* French draft QA: reject guessed approvals, mistranslated answer positions, and source drift. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {baseQuestions,getSource} from './english-source.mjs';

const read=path=>JSON.parse(readFileSync(path,'utf8'));
const support=read('assets/i18n/content-support.json');
const fr=support.languages.fr;
assert.equal(fr.entry,'complete','Existing French onboarding should remain available');
assert.equal(fr.question_data,'missing','No incomplete French questions in production');
assert.equal(fr.global_qa,'blocked','Do not bypass full QA');
assert.equal(fr.religious_expert_approved,false,'Do not fabricate religious approval');
assert(!fr.bank&&!fr.parts?.length,'Production must not load French staging packs');
assert.equal(support.languages.de.question_data,'missing','German approval gate preserved');
assert.equal(support.languages.en.question_data,'complete','English production unchanged');
const locales=readFileSync('assets/i18n/locale.js','utf8');
assert.match(locales,/\{id:'fr',name:'Français'\}/);
assert.match(locales,/fr:\{languageTitle:/);
assert.equal(baseQuestions.length,1500);
const units=new Map(),source=new Map();
for(const q of baseQuestions){
 assert(!source.has(q.id),'Duplicate base source question: '+q.id);
 source.set(q.id,q);
 const unit=q.id.match(/^DEEN-(U\d\d)-S\d\d-\d{3}$/)?.[1];
 assert(unit,'Malformed base question ID: '+q.id);
 units.set(unit,(units.get(unit)||0)+1);
}
assert.equal(units.size,15);
for(let i=1;i<=15;i++)assert.equal(units.get('U'+String(i).padStart(2,'0')),100);
const pack=read('assets/i18n/questions/fr/staging/U01-S01.json');
for(const [key,want]of Object.entries({
 schema_version:1,locale:'fr',unit:'U01',stage:'U01-S01',
 question_count:14,status:'staging_not_available_in_runtime',
 expert_approved:false,verified_by_religious_expert:false,
 native_reviewer_approved:false,release_ready:false
}))assert.equal(pack[key],want,'Unapproved French pack metadata: '+key);
const entries=Object.entries(pack.translations);
assert.equal(entries.length,14);
const same=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const blanks=text=>(String(text??'').match(/_{2,}|\[\s*\]|\{blank\}/g)||[]).length;
const counts={},failures=[],seen=new Set();
for(const [i,[id,item]] of entries.entries()){
 const error=label=>failures.push(id+':'+label);
 const required='DEEN-U01-S01-'+String(i+1).padStart(3,'0');
 if(id!==required)error('unexpected_id_or_order');
 if(seen.has(id))error('duplicate_id');seen.add(id);
 const original=source.get(id);
 if(!original||!item.source||!item.display){error('missing_source_or_display');continue}
 const s=item.source,d=item.display;
 if(!same(s,getSource(original)))error('source_fields_modified');
 for(const k of ['expert_approved','native_reviewer_approved'])
  if(item[k]!==false)error('review_status_fabricated:'+k);
 if(item.status!=='traduction_provisoire_relecture_francophone_et_religieuse_requise')
  error('unreviewed_status_changed');
 if(d.activity_type!==s.activity_type)error('activity_type');
 if(!d.question_tr?.trim()||!d.explanation_tr?.trim())error('missing_question_or_explanation');
 if(d.question_tr===s.question_tr||d.explanation_tr===s.explanation_tr)error('untranslated');
 if(blanks(d.question_tr)!==blanks(s.question_tr))error('blank_slots');
 if((s.pairs??null)!==null||(s.items??null)!==null)error('unexpected_matching_or_sequence_in_S01');
 if(d.pairs!==null||d.items!==null||d.correct_order!==null)error('unintended_structural_fields');
 if(d.stage_title!=='Découvrir l’islam'||!d.topic?.trim())error('stage_or_topic');
 const sourceAnswers=s.options_tr, translatedAnswers=d.options_tr;
 if(Array.isArray(sourceAnswers)){
  const correctIndex=sourceAnswers.indexOf(s.correct_answer);
  if(correctIndex<0||!Array.isArray(translatedAnswers)||translatedAnswers.length!==sourceAnswers.length)
   error('choice_cardinality');
  else if(translatedAnswers.indexOf(d.correct_answer)!==correctIndex||
    translatedAnswers.filter(x=>x===d.correct_answer).length!==1||
    new Set(translatedAnswers).size!==translatedAnswers.length)
   error('correct_option_position_or_uniqueness');
 }else if(translatedAnswers!==null||!d.correct_answer?.trim())
  error('fill_answer');
 if(s.activity_type==='fill_blank'&&blanks(d.question_tr)!==1)error('missing_fill_slot');
 if(s.activity_type==='true_false'&&!same(translatedAnswers,['Vrai','Faux']))
  error('true_false_options');
 const strings=[d.question_tr,d.explanation_tr,d.correct_answer,...(d.options_tr||[]),d.stage_title,d.topic];
 if(strings.some(value=>typeof value!=='string'||!value.trim()))error('empty_visible_text');
 if(strings.some(value=>/[İıĞğŞş]/u.test(value)))error('Turkish_locale_letters');
 if(strings.some(value=>/\b(?:which|because|nicht|welche|sadece|yanlış|doğru|günlük)\b/iu.test(value)))
  error('mixed_language_keyword');
 counts[s.activity_type]=(counts[s.activity_type]||0)+1;
}
assert.deepEqual(counts,{multiple_choice:9,true_false:3,fill_blank:2});
assert.deepEqual(failures,[],'French staging question audit failed');
const ui=read('assets/i18n/fr/ui.staging.json');
for(const [key,value]of Object.entries({schema_version:1,locale:'fr',
 scope:'french_static_ui_staging',release_ready:false,global_qa:'blocked',
 native_reviewer_approved:false,verified_by_religious_expert:false}))
 assert.equal(ui[key],value,'UI staging release status: '+key);
assert.equal(ui.translation_count,Object.keys(ui.translations).length);
assert(ui.translation_count>=30);
for(const [k,v]of Object.entries(ui.translations)){
 assert(k&&typeof v==='string'&&v.trim()&&k!==v,'Invalid French UI translation:'+k);
}
console.log(JSON.stringify({result:'passed',scope:'FRENCH_STAGING_ONLY',
 total_base_questions:baseQuestions.length,translated_base_questions:entries.length,
 remaining_base_questions:1500-entries.length,staged_UI_strings:ui.translation_count,
 stage:'U01-S01',activityTypes:counts,correct_answer_mapping_errors:failures.length,
 runtime_unlocked:false,native_or_religious_approved:false},null,2));
