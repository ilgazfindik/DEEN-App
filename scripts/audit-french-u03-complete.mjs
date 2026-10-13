/* French U03 audit: structural integrity only, never expert approval. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {baseQuestions,getSource} from './english-source.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const eq=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const blank=v=>(String(v||'').match(/_{2,}|\[\s*\]|\{blank\}/g)||[]).length;
const base=new Map(baseQuestions.map(x=>[x.id,x]));
const gate=read('assets/i18n/content-support.json').languages.fr;
assert.equal(gate.question_data,'missing');assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
assert(!gate.bank&&!gate.parts?.length);
const expected=[14,14,14,16,16,12,14],seen=new Set,issues=[],types={};
let count=0,matchingPairs=0,choiceQuestions=0,fillQuestions=0;
for(let i=1;i<=7;i++){
 const stage='U03-S'+String(i).padStart(2,'0');
 const pack=read('assets/i18n/questions/fr/staging/'+stage+'.json');
 for(const [k,v] of Object.entries({schema_version:1,locale:'fr',unit:'U03',stage,
  question_count:expected[i-1],status:'staging_not_available_in_runtime',
  source_language:'tr',expert_approved:false,verified_by_religious_expert:false,
  native_reviewer_approved:false,release_ready:false}))
  assert.equal(pack[k],v,stage+':'+k);
 const entries=Object.entries(pack.translations||{});
 assert.equal(entries.length,expected[i-1],stage+':count');
 for(let j=0;j<entries.length;j++){
  const [id,item]=entries[j],src=base.get(id),bad=x=>issues.push(id+':'+x);
  if(id!=='DEEN-'+stage+'-'+String(j+1).padStart(3,'0'))bad('question_order');
  if(seen.has(id))bad('duplicate_id');seen.add(id);
  if(!src||!item?.source||!item?.display){bad('missing_source');continue}
  const s=item.source,d=item.display;
  if(!eq(s,getSource(src)))bad('source_identity');
  if(item.expert_approved!==false||item.native_reviewer_approved!==false||
    item.status!=='traduction_provisoire_relecture_francophone_et_religieuse_requise')
    bad('approval_claim');
  if(s.activity_type!==d.activity_type)bad('activity_type');
  if(!d.question_tr?.trim()||!d.explanation_tr?.trim()||
     !d.stage_title?.trim()||!d.topic?.trim())bad('empty_text');
  if(d.question_tr===s.question_tr||d.explanation_tr===s.explanation_tr)
    bad('untranslated_text');
  if(blank(d.question_tr)!==blank(s.question_tr))bad('blank_count');
  if(s.activity_type==='fill_blank'&&blank(d.question_tr)!==1)bad('fill_blank_missing');
  const strings=[d.question_tr,d.explanation_tr,d.correct_answer,...(d.options_tr||[]),
    ...(d.pairs||[]).flatMap(p=>[p.left,p.right]),...(d.items||[]),
    ...(d.correct_order||[]),d.stage_title,d.topic].filter(x=>x!=null);
  if(strings.some(x=>typeof x!=='string'||!x.trim()))bad('empty_visible_text');
  for(const text of strings){
   // Shahada phonetic segments are non-UI liturgical source strings.
   // Do not mistake the preserved Turkish-standard transliteration for untranslated labels.
   const withoutProperNames=text.replace(/(?:Eşhedü|eşhedü|Resûlüh|resûlüh|abdühû|Allahüekber|Sübhanallah|İllallah)/gu,'ARABIC_PHONETIC');
   if(/[İıĞğŞş]/u.test(withoutProperNames))bad('Turkish_locale_letters');
   if(/\b(?:sadece|yanlış|doğru|günlük|öğrenme|peygamber|kavramları)\b/iu.test(text))
     bad('Turkish_word');
   if(/\b(?:which|because|nicht|welche|worship|that)\b/iu.test(text))
     bad('English_German_word');
  }
  if(s.pairs){
   if(!Array.isArray(d.pairs)||d.pairs.length!==s.pairs.length)
    bad('matching_cardinality');
   else {
    for(const side of ['left','right']){
     if(new Set(s.pairs.map(x=>x[side])).size!==new Set(d.pairs.map(x=>x[side])).size||
      d.pairs.some(x=>!x?.[side]?.trim()))bad('matching_identity_'+side);
    }
    matchingPairs+=d.pairs.length;
   }
   if(d.options_tr!==null||d.correct_answer!==null)bad('matching_scalar_answer');
  }else if(d.pairs!==null)bad('unexpected_matching');
  if(s.items){
   if(!Array.isArray(d.items)||!Array.isArray(d.correct_order)||
    d.items.length!==s.items.length||d.correct_order.length!==s.correct_order.length)
    bad('sequence_count');
   else{
    const a=s.items.map(x=>s.correct_order.indexOf(x));
    const b=d.items.map(x=>d.correct_order.indexOf(x));
    if(!eq(a,b)||!eq([...d.items].sort(),[...d.correct_order].sort()))
     bad('sequence_answer_order');
   }
  }else if(d.items!==null||d.correct_order!==null)bad('unexpected_sequence');
  if(Array.isArray(s.options_tr)){
   choiceQuestions++;
   const pos=s.options_tr.indexOf(s.correct_answer);
   if(pos<0||!Array.isArray(d.options_tr)||d.options_tr.length!==s.options_tr.length)
    bad('option_count');
   else if(d.options_tr.indexOf(d.correct_answer)!==pos||
     d.options_tr.filter(x=>x===d.correct_answer).length!==1||
     new Set(d.options_tr).size!==d.options_tr.length)bad('answer_index');
  }else if(d.options_tr!==null||(s.pairs===null&&s.items===null&&!d.correct_answer?.trim()))
    bad('free_response_answer');
  if(s.activity_type==='true_false'&&!eq(d.options_tr,['Vrai','Faux']))
    bad('true_false_order');
  if(s.activity_type==='fill_blank')fillQuestions++;
  types[s.activity_type]=(types[s.activity_type]||0)+1;count++;
 }
}
assert.equal(count,100);assert.equal(seen.size,100);
assert.deepEqual(issues,[],'French U03 structural failures');
console.log(JSON.stringify({result:'passed',status:'staging_not_released',locale:'fr',
 unit:'U03',stages:7,questions:100,choiceQuestions,matchingPairs,fillQuestions,
 activityTypes:types,structuralErrors:0,nativeApproved:false,religiousApproved:false},null,2));
