/* Source-exact U01 live runtime French draft QA, fail closed, never deploy. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const root='assets/i18n/questions/';
const gate=read('assets/i18n/content-support.json').languages.fr;
assert.equal(gate.question_data,'missing');
assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
assert(!gate.bank&&!gate.parts?.length,'French runtime must not be activated');
const english=read(root+'en/runtime/U01.live.json');
assert.equal(english.translations&&Object.keys(english.translations).length,84);
const eq=(x,y)=>JSON.stringify(x??null)===JSON.stringify(y??null);
const blank=s=>(String(s??'').match(/_{2,}|\[\s*\]|\{blank\}/g)||[]).length;
const srcFields=['question_tr','explanation_tr','activity_type','options_tr',
  'correct_answer','pairs','items','correct_order'];
let count=0,cards=0,choice=0,matchPairs=0,fill=0;
const types={},issues=[],seen=new Set(),stageCounts={};
for(let n=1;n<=7;n++){
 const stage='U01-S'+String(n).padStart(2,'0');
 const file='fr/runtime/staging/'+stage+'.live.json';
 const p=read(root+file);
 for(const [k,v] of Object.entries({
  schema_version:1,locale:'fr',unit:'U01',scope:'live_runtime_staging',
  stage,question_count:12,status:'staging_not_available_in_runtime',
  release_ready:false,expert_approved:false,verified_by_religious_expert:false,
  native_reviewer_approved:false,source_language:'tr'
 }))assert.equal(p[k],v,stage+':'+k);
 const entries=Object.entries(p.translations||{});
 assert.equal(entries.length,12,stage+':count');
 stageCounts[stage]=entries.length;
 for(let i=0;i<12;i++){
  const [id,x]=entries[i],old=english.translations[id],bad=why=>issues.push(id+':'+why);
  const expected='DEEN-'+stage+'-P'+String(i+1).padStart(2,'0');
  if(id!==expected)bad('order');
  if(!old){bad('unknown_original');continue;}
  if(seen.has(id))bad('duplicate_id');seen.add(id);
  if(!x?.source||!x?.display){bad('missing_translation');continue}
  const s=x.source,d=x.display,ref=old.source;
  for(const field of srcFields)if(!eq(s[field],ref[field]))bad('source_identity_'+field);
  if(x.expert_approved!==false||x.native_reviewer_approved!==false||x.status!=='traduction_provisoire_relecture_francophone_et_religieuse_requise')bad('approval_drift');
  if(d.activity_type!==s.activity_type)bad('activity_type');
  if(!d.question_tr?.trim()||!d.explanation_tr?.trim()||!d.stage_title?.trim()||!d.topic?.trim())bad('missing_text');
  if(d.question_tr===s.question_tr||d.explanation_tr===s.explanation_tr)bad('untranslated_visible_text');
  if(blank(d.question_tr)!==blank(s.question_tr))bad('blank_count');
  if(s.activity_type==='fill_blank'){fill++;if(blank(d.question_tr)!==1)bad('fill_blank_missing');}
  if(s.options_tr){
   choice++;
   const position=s.options_tr.indexOf(s.correct_answer);
   if(!Array.isArray(d.options_tr)||d.options_tr.length!==s.options_tr.length||position<0)bad('options_shape');
   else if(position!==d.options_tr.indexOf(d.correct_answer)||d.options_tr.filter(v=>v===d.correct_answer).length!==1||new Set(d.options_tr).size!==d.options_tr.length)bad('correct_answer_index');
  }else if(d.options_tr!==null)bad('unexpected_options');
  if(s.pairs){
   if(!Array.isArray(d.pairs)||d.pairs.length!==s.pairs.length)bad('pair_shape');
   else {
    matchPairs+=s.pairs.length;
    for(const side of ['left','right']){
     if(new Set(d.pairs.map(p=>p[side])).size!==new Set(s.pairs.map(p=>p[side])).size)bad('pair_cardinality_'+side);
     if(d.pairs.some(p=>!p[side]?.trim()))bad('empty_pair_'+side);
    }
   }
  }else if(d.pairs!==null)bad('unexpected_pairs');
  if(s.items){
   if(!eq(s.items.length,d.items?.length)||!eq(s.correct_order.length,d.correct_order?.length))bad('sequence_shape');
  }else if(d.items!==null||d.correct_order!==null)bad('unexpected_sequence');
  if(s.activity_type==='true_false'&&!eq(d.options_tr,['Vrai','Faux']))bad('true_false_choices');
  const oldCard=old.display.teaching_card,card=d.teaching_card;
  if(!!oldCard!==!!card)bad('teaching_card_presence');
  if(card){
   cards++;
   assert.deepEqual(Object.keys(card).sort(),['body','eyebrow','memory','title'].sort());
   for(const k of ['eyebrow','title','body','memory'])if(!card[k]?.trim())bad('teaching_card_empty_'+k);
  }
  const allStrings=[d.question_tr,d.explanation_tr,d.correct_answer,...(d.options_tr||[]),
    ...(d.pairs||[]).flatMap(p=>[p.left,p.right]),d.stage_title,d.topic,...Object.values(card||{})].filter(v=>v!=null);
  for(const v of allStrings){
   if(typeof v!=='string'||!v.trim())bad('empty_display_value');
   if(/[İıĞğŞş]/u.test(v))bad('Turkish_locale_characters');
  }
  types[s.activity_type]=(types[s.activity_type]||0)+1;count++;
 }
}
assert.equal(count,84);
assert.equal(seen.size,84);
assert.deepEqual([...seen].sort(),Object.keys(english.translations).sort(),'Runtime source ID inventory drift');
assert.equal(cards,24,'All available teaching cards must be translated');
assert.equal(fill,14,'Expected 14 fill tasks');
assert.deepEqual(issues,[],'U01 French live QA issues');
console.log(JSON.stringify({locale:'fr',status:'staging_only',unit:'U01',questions:count,stages:stageCounts,
 types,optionBearing:choice,matchingPairs:matchPairs,fillBlanks:fill,
 teachingCards:cards,structuralErrors:issues.length,sourceKeysExact:true,
 nativeApproved:false,religiousApproved:false,runtimeActivated:false},null,2));
