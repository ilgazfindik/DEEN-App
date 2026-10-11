// Source-guarded German staging audit. A partial pack must never activate gameplay.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {baseQuestions,sourceFields} from './english-source.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const pack=read('assets/i18n/questions/de/staging/U01-S01.json');
const manifest=read('assets/i18n/content-support.json');
const source=new Map(baseQuestions.map(q=>[q.id,q]));
assert.equal(baseQuestions.length,1500);
for(const [key,expected] of Object.entries({schema_version:1,locale:'de',unit:'U01',stage:'U01-S01',status:'staging_not_available_in_runtime',expert_approved:false,verified_by_religious_expert:false,native_reviewer_approved:false}))assert.equal(pack[key],expected,key);
assert.equal(manifest.languages.de.question_data,'missing','Incomplete German bank must stay unavailable');
assert.equal(manifest.languages.de.global_qa,'blocked');
assert(!manifest.languages.de.parts?.length&&!manifest.languages.de.bank);
const entries=Object.entries(pack.translations),same=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const blanks=s=>(String(s||'').match(/_{2,}|\[\s*\]|\{blank\}/g)||[]).length;
const issues=[],types={};
assert.equal(entries.length,14);
for(let n=0;n<entries.length;n++){
 const [id,e]=entries[n],src=source.get(id),s=e.source,d=e.display;
 const fail=reason=>issues.push(id+':'+reason);
 if(id!=='DEEN-U01-S01-'+String(n+1).padStart(3,'0'))fail('id_order');
 if(!src||!s||!d){fail('missing_source');continue}
 for(const key of sourceFields)if(!same(src[key],s[key]))fail('source_mismatch:'+key);
 if(d.activity_type!==s.activity_type)fail('type_changed');
 if(!d.question_tr?.trim()||!d.explanation_tr?.trim())fail('missing_text');
 if(blanks(s.question_tr)!==blanks(d.question_tr))fail('blank_changed');
 if(e.expert_approved!==false||e.native_reviewer_approved!==false)fail('unsupported_approval');
 const texts=[d.question_tr,d.explanation_tr,...(d.options_tr||[]),d.correct_answer];
 for(const text of texts){
  if(!text?.trim()){fail('empty_display');continue}
  if(/[ÇĞİŞçğıış]/.test(text))fail('turkish_character_residue');
  if(/\b(?:sadece|doğru|yanlış|yapmak|ibadet|peygamber|müslüman|soru|cevap|öğrenme)\b/i.test(text))fail('turkish_word_residue');
  if(/\b(?:which|the|only|faith|worship|because)\b/i.test(text))fail('english_word_residue');
 }
 if(Array.isArray(s.options_tr)){
  if(!Array.isArray(d.options_tr)||d.options_tr.length!==s.options_tr.length)fail('options_count');
  if(s.options_tr.indexOf(s.correct_answer)!==d.options_tr?.indexOf(d.correct_answer))fail('correct_choice_index');
  if(new Set(d.options_tr||[]).size!==d.options_tr?.length)fail('duplicate_options');
 }else if(d.options_tr!==null)fail('unexpected_options');
 if(!same(s.pairs,d.pairs)||!same(s.items,d.items)||!same(s.correct_order,d.correct_order))fail('structure_changed');
 if(s.activity_type==='fill_blank'&&blanks(d.question_tr)!==1)fail('fill_slot_count');
 types[s.activity_type]=(types[s.activity_type]||0)+1;
}
const report={locale:'de',stage:'U01-S01 staging',translated:entries.length,total_unit:100,total_bank:1500,production_ready:false,question_types:types,issues};
console.log(JSON.stringify(report,null,2));
if(issues.length)process.exitCode=1;
