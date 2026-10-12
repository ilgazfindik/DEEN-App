/*
 * Source-verified German QUESTION adapter for isolated QA.
 * Not part of production boot, not an approval of Islamic content.
 * Prevent ID-only translation of grading-sensitive U01 question variants.
 */
const KEYS=['question_tr','explanation_tr','activity_type','options_tr','correct_answer','pairs','items','correct_order'];
const same=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const blanks=s=>(String(s??'').match(/_{2,}|\[\s*\]|\{blank\}/g)||[]).length;
const forbidden=/[\u0600-\u06ff]/u;
function valid(source,entry){
 if(!entry?.source||!entry.display||!source)return false;
 const snapshot=entry.source,display=entry.display;
 if(KEYS.some(k=>!same(source[k],snapshot[k])))return false;
 if(display.activity_type!==source.activity_type)return false;
 if(typeof display.question_tr!=='string'||!display.question_tr.trim()
  ||typeof display.explanation_tr!=='string'||!display.explanation_tr.trim()
  ||blanks(source.question_tr)!==blanks(display.question_tr))return false;
 if(forbidden.test(display.question_tr)||forbidden.test(display.explanation_tr))return false;
 if(Array.isArray(source.pairs)){
  if(!Array.isArray(display.pairs)||source.pairs.length!==display.pairs.length)return false;
  for(const side of ['left','right']){
   const values=display.pairs.map(p=>p?.[side]);
   if(values.some(v=>typeof v!=='string'||!v.trim()||forbidden.test(v))
     ||new Set(values).size!==new Set(source.pairs.map(p=>p[side])).size)return false;
  }
 }else if(display.pairs!=null)return false;
 if(Array.isArray(source.items)){
  if(!Array.isArray(display.items)||display.items.length!==source.items.length
   ||!Array.isArray(display.correct_order)||display.correct_order.length!==source.correct_order?.length
   ||new Set(display.items).size!==display.items.length)return false;
  const indices=source.correct_order.map(text=>source.items.indexOf(text));
  if(indices.some((index,i)=>index<0||display.items[index]!==display.correct_order[i]))return false;
 }else if(display.items!=null||display.correct_order!=null)return false;
 if(Array.isArray(source.options_tr)){
  if(!Array.isArray(display.options_tr)||display.options_tr.length!==source.options_tr.length)return false;
  const index=source.options_tr.indexOf(source.correct_answer);
  if(index<0||display.options_tr[index]!==display.correct_answer
   ||display.options_tr.filter(x=>x===display.correct_answer).length!==1
   ||display.options_tr.some(x=>typeof x!=='string'||!x.trim()||forbidden.test(x))
   ||new Set(display.options_tr).size!==display.options_tr.length)return false;
 }else if(display.options_tr!=null)return false;
 if(source.correct_answer!==null&&source.correct_answer!==undefined&&
    typeof display.correct_answer!=='string')return false;
 return true;
}
const scopeOf=pack=>pack.scope||'base_staging';
export function createGermanQuestionStagingAdapter({packs}={}){
 if(!Array.isArray(packs)||packs.length!==114)throw Error('DE_QA_QUESTION_PACK_COUNT');
 const index=new Map(),counts={};
 for(const pack of packs){
  if(pack?.schema_version!==1||pack.locale!=='de'
   ||pack.expert_approved!==false||pack.verified_by_religious_expert!==false
   ||pack.native_reviewer_approved!==false||pack.release_ready===true)
    throw Error('DE_QA_QUESTION_PACK_RELEASE_GUARD');
  const scope=scopeOf(pack);
  if(!['base_staging','live_runtime_staging','stored_runtime_variants_staging',
        'legacy_u01_presenter_staging'].includes(scope))throw Error('DE_QA_UNKNOWN_SCOPE:'+scope);
  if(!pack.translations||typeof pack.translations!=='object')throw Error('DE_QA_TRANSLATIONS_MISSING');
  const values=Object.entries(pack.translations);
  if(pack.question_count!=null&&pack.question_count!==values.length)throw Error('DE_QA_QUESTION_COUNT');
  counts[scope]=(counts[scope]||0)+values.length;
  for(const [id,entry] of values){
   if(!id||!entry?.source||!entry.display
    ||entry.expert_approved!==false||entry.native_reviewer_approved!==false)
    throw Error('DE_QA_QUESTION_ENTRY_GUARD:'+id);
   const record={id,scope,entry};
   if(!index.has(id))index.set(id,[]);
   index.get(id).push(record);
  }
 }
 if(counts.base_staging!==1500||counts.live_runtime_staging!==84
    ||counts.stored_runtime_variants_staging!==20||counts.legacy_u01_presenter_staging!==100)
  throw Error('DE_QA_COVERAGE:'+JSON.stringify(counts));
 function translate(question,{qaMode=false,locale='de',scope}={}){
  if(qaMode!==true||locale!=='de')throw Error('DE_QA_UNAPPROVED_CONTENT');
  if(!question||typeof question.id!=='string')return null;
  const matches=(index.get(question.id)||[]).filter(row=>
   (!scope||row.scope===scope)&&valid(question,row.entry));
  if(matches.length!==1)return null; // never silently choose a variant by ID
  const d=matches[0].entry.display;
  return {...question,...d,__deenSourceQuestion:question,__deenQAScope:matches[0].scope,
   __deenQANotForRelease:true};
 }
 return Object.freeze({translate,inspect:(questions,options={})=>{
  const unresolved=[];
  for(const source of questions)if(!translate(source,{...options,qaMode:true,locale:'de'}))unresolved.push(source?.id);
  return {sourceCount:questions.length,translated:questions.length-unresolved.length,unresolved};
 },inventory:()=>({counts:{...counts},uniqueIds:index.size}),scope:'staging-only'});
}
