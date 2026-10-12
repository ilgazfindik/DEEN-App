/* Staging-only German active runtime audit. Fail closed, no release activation. */
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const manifest=read('assets/i18n/content-support.json');
const runtime=read('assets/i18n/questions/en/runtime/U01.live.json');
const variants=read('assets/i18n/questions/en/runtime/U01.variants.json');
const legacy=read('assets/i18n/questions/en/runtime/U01.legacy-renderer.json');
assert.equal(manifest.languages.de.question_data,'missing');
assert.equal(manifest.languages.de.global_qa,'blocked');
assert(!manifest.languages.de.parts?.length && !manifest.languages.de.bank);
const base=new Set();
const counts={};
for(let unit=1;unit<=15;unit++){
 const u='U'+String(unit).padStart(2,'0');
 for(let stage=1;stage<=7;stage++){
  const s=u+'-S'+String(stage).padStart(2,'0');
  const p=read('assets/i18n/questions/de/staging/'+s+'.json');
  for(const id of Object.keys(p.translations))assert(!base.has(id),'Duplicate base ID '+id),base.add(id);
 }
 counts[u]=[...base].filter(id=>id.startsWith('DEEN-'+u+'-')).length;
 assert.equal(counts[u],100);
}
assert.equal(base.size,1500);
const activeBase=[...base].filter(id=>!id.startsWith('DEEN-U01-'));
assert.equal(activeBase.length,1400);
const sourceIds=Object.keys(runtime.translations);
assert.equal(sourceIds.length,84);
assert(sourceIds.every(id=>!base.has(id)),'Active U01 ID must be separate from base');
assert.equal(new Set([...activeBase,...sourceIds]).size,manifest.required_active_questions);
assert.equal(Object.keys(variants.translations).length,manifest.required_runtime_variants);
assert.equal(Object.keys(legacy.translations).length,100);
const storedVariantOverlap=Object.keys(variants.translations).filter(id=>base.has(id)).length;
const legacyOverlap=Object.keys(legacy.translations).filter(id=>base.has(id)).length;
assert.equal(storedVariantOverlap,20);
assert.equal(legacyOverlap,100);
const folder='assets/i18n/questions/de/runtime/staging/';
const stageFiles=readdirSync(root+folder).filter(name=>/^U01-S\d\d\.live\.json$/.test(name)).sort();
const problems=[],covered=new Set(),types={};
const eq=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const blank=t=>(String(t||'').match(/_{2,}|\[\s*\]|\{blank\}/g)||[]).length;
for(const file of stageFiles){
 const pack=read(folder+file);
 for(const [k,v] of Object.entries({schema_version:1,locale:'de',unit:'U01',scope:'live_runtime_staging',release_ready:false,expert_approved:false,verified_by_religious_expert:false,native_reviewer_approved:false}))assert.equal(pack[k],v,file+':'+k);
 assert.equal(pack.question_count,12,file+':count');
 assert.equal(Object.keys(pack.translations).length,12,file+':entries');
 for(const [id,entry] of Object.entries(pack.translations)){
  const p=(what)=>problems.push(id+':'+what),s=entry.source,d=entry.display,o=runtime.translations[id]?.source;
  if(!o||covered.has(id)){p('missing_original_or_duplicate');continue}
  covered.add(id);
  for(const key of ['question_tr','explanation_tr','activity_type','options_tr','correct_answer','pairs','items','correct_order'])if(!eq(s[key],o[key]))p('source_mismatch:'+key);
  if(d?.activity_type!==s.activity_type)p('type_mismatch');
  if(!d?.question_tr?.trim()||!d?.explanation_tr?.trim())p('empty_prompt_or_explanation');
  if(blank(s.question_tr)!==blank(d?.question_tr))p('blank_count');
  if(entry.expert_approved!==false||entry.native_reviewer_approved!==false)p('invalid_approval');
  const displayValues=[d?.question_tr,d?.explanation_tr,...(d?.options_tr||[]),d?.correct_answer,...(d?.pairs||[]).flatMap(z=>[z.left,z.right]),...Object.values(d?.teaching_card||{})].filter(x=>x!=null);
  for(const v of displayValues){if(typeof v!=='string'||!v.trim())p('invalid_german_string');else if(/[ÇĞİŞçğıış]/.test(v)||/\b(?:sadece|doğru|yanlış|müslüman|peygamber|kulluk|ibadet)\b/i.test(v))p('turkish_residue')}
  if(s.options_tr){
   if(!Array.isArray(d?.options_tr)||d.options_tr.length!==s.options_tr.length||s.options_tr.indexOf(s.correct_answer)!==d.options_tr.indexOf(d.correct_answer))p('answer_index');
   if(new Set(d.options_tr||[]).size!==(d.options_tr||[]).length)p('duplicate_options');
  }else if(d?.options_tr!==null)p('unexpected_options');
  if(s.pairs){
   if(!Array.isArray(d?.pairs)||d.pairs.length!==s.pairs.length)p('matching_count');
   else for(const side of ['left','right'])if(new Set(s.pairs.map(x=>x[side])).size!==new Set(d.pairs.map(x=>x[side])).size)p('matching_identity_'+side);
  }else if(d?.pairs!==null)p('unexpected_pairs');
  if(!eq(d?.teaching_card===null,runtime.translations[id]?.display.teaching_card===null))p('teaching_card_presence');
  types[s.activity_type]=(types[s.activity_type]||0)+1;
 }
}
const report={locale:'de',base_questions_staged:base.size,active_questions:activeBase.length+sourceIds.length,active_base_reuse:activeBase.length,unique_active_u01_questions:sourceIds.length,unique_active_u01_translated_staged:covered.size,unique_active_u01_remaining:sourceIds.length-covered.size,stored_variants:20,stored_variants_overlapping_base_ids:storedVariantOverlap,legacy_renderer_records:100,legacy_overlapping_base_ids:legacyOverlap,stage_packs:stageFiles,activity_types:types,production_ready:false,issue_count:problems.length,issues:problems};
console.log(JSON.stringify(report,null,2));
assert.equal(problems.length,0,problems.join('\n'));
