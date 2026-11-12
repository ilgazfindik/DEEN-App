// Structural checks of assets/learn/extra-questions.js (Turkish-only extra Learn-path questions).
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const win={};vm.runInNewContext(readFileSync('assets/learn/extra-questions.js','utf8'),{window:win});
const Q=win.DEEN_EXTRA_QUESTIONS;assert(Array.isArray(Q)&&Q.length>=150,'extra questions present');
const ids=new Set(),texts=new Set(),UNITS=new Set(['U04','U01','U02','U03','U05','U11','U12','U13','U14','U15']);
const TYPES=new Set(['multiple_choice','true_false','fill_blank','missing_item','scenario','error_spotting','speed_review','matching','progressive_recall']);
for(const q of Q){
 assert(!ids.has(q.id),'duplicate id '+q.id);ids.add(q.id);
 assert(/^DEEN-U\d\d-S0[1-7]-X\d{3}$/.test(q.id),'id shape '+q.id);
 assert(UNITS.has(q.id.slice(5,8))&&q.stage_id===q.id.slice(5,12),'unit/stage '+q.id);
 assert(q.tr_only===true&&q.verification_status==='needs_review'&&q.religious_release_ready===false&&q.source_release_ready===false,'review flags '+q.id);
 assert(TYPES.has(q.activity_type),'type '+q.id);
 assert(typeof q.question_tr==='string'&&q.question_tr.length>8,'text '+q.id);assert(!texts.has(q.question_tr),'duplicate text '+q.id);texts.add(q.question_tr);
 assert(typeof q.explanation_tr==='string'&&q.explanation_tr.length>8,'explanation '+q.id);
 if(q.activity_type==='matching'){assert(q.pairs.length===4&&new Set(q.pairs.map(p=>p.left)).size===4&&new Set(q.pairs.map(p=>p.right)).size===4,'pairs '+q.id)}
 else if(q.activity_type==='progressive_recall'){assert(q.correct_answer&&!q.options_tr,'recall '+q.id)}
 else{
  assert(Array.isArray(q.options_tr)&&q.options_tr.length>=2&&new Set(q.options_tr).size===q.options_tr.length,'options '+q.id);
  assert(q.options_tr.filter(o=>o===q.correct_answer).length===1,'exactly one correct option '+q.id);
  if(q.activity_type==='true_false')assert(q.options_tr.join()==='Doğru,Yanlış','true/false options '+q.id);
  else assert(q.options_tr.length===4,'four options '+q.id);
  if(q.activity_type==='fill_blank'||q.activity_type==='missing_item')assert(q.question_tr.includes('___'),'blank '+q.id);
 }
}
const per={};for(const q of Q){const u=q.id.slice(5,8);per[u]=(per[u]||0)+1}
// Translations (en, de, fr, ar): every extra question has one in every language, shaped like the existing packs.
import {createHash} from 'node:crypto';
const byId=new Map(Q.map(q=>[q.id,q]));
const same=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const blanks=s=>(String(s||'').match(/_{2,}/g)||[]).length;
const hashes=JSON.parse(readFileSync('assets/learn/extra-questions.js','utf8').match(/const HASHES=(\{[^}]*\})/)[1]);
for(const lang of ['en','de','fr','ar']){
 const raw=readFileSync('assets/learn/extra-questions.'+lang+'.json');
 assert.equal(createHash('sha256').update(raw).digest('hex'),hashes[lang],'hash of the '+lang+' file matches extra-questions.js');
 const pack=JSON.parse(raw.toString('utf8'));
 assert(pack.locale===lang&&pack.expert_approved===false&&pack.verified_by_religious_expert===false,'pack flags '+lang);
 assert.equal(Object.keys(pack.translations).length,Q.length,'every extra question is translated into '+lang);
 for(const [id,e] of Object.entries(pack.translations)){
  const q=byId.get(id);assert(q,'known id '+id);
  if(lang==='ar'){
   assert(e.expert_approved===false&&e.source_question_tr===q.question_tr&&same(e.source_options_tr,q.options_tr)&&same(e.source_pairs_tr,q.pairs)&&e.source_correct_answer_tr===q.correct_answer,'ar source '+id);
   assert(e.question_ar&&e.explanation_ar&&e.topic_ar&&e.activity_type===q.activity_type,'ar fields '+id);
   const shown=[e.question_ar,e.explanation_ar,e.topic_ar,e.correct_answer_ar,...(e.options_ar||[]),...(e.pairs_ar||[]).flatMap(p=>[p.left,p.right])].filter(Boolean);
   assert(!shown.some(v=>/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(v)),'no Latin or Turkish letters in the Arabic of '+id);
   assert.equal(blanks(q.question_tr),blanks(e.question_ar),'blanks '+id);
   if(q.options_tr){assert.equal(e.options_ar.length,q.options_tr.length,'ar options '+id);assert.equal(e.options_ar.indexOf(e.correct_answer_ar),q.options_tr.indexOf(q.correct_answer),'ar correct position '+id);assert.equal(e.options_ar.filter(o=>o===e.correct_answer_ar).length,1,'ar one correct '+id)}
   if(q.pairs)assert(e.pairs_ar.length===q.pairs.length&&new Set(e.pairs_ar.map(p=>p.right)).size===q.pairs.length,'ar pairs '+id);
  }else{
   assert(Array.isArray(e)&&e.length===1,'entry '+id);const {source,display:d}=e[0];
   for(const f of ['question_tr','explanation_tr','activity_type','options_tr','correct_answer','pairs'])assert(same(source[f],q[f]),'source '+f+' '+id);
   assert(d.question_tr.trim()&&d.explanation_tr.trim()&&d.topic.trim(),'display text '+id);
   assert.equal(blanks(q.question_tr),blanks(d.question_tr),'blanks '+id);
   if(q.options_tr){assert.equal(d.options_tr.length,q.options_tr.length,'options '+id);assert.equal(d.options_tr.indexOf(d.correct_answer),q.options_tr.indexOf(q.correct_answer),'correct position '+id);assert.equal(d.options_tr.filter(o=>o===d.correct_answer).length,1,'one correct '+id)}
   if(q.pairs)assert(d.pairs.length===q.pairs.length&&new Set(d.pairs.map(p=>p.right)).size===q.pairs.length,'pairs '+id);
   assert(!/[ğşıİĞŞ]/.test(JSON.stringify(d)),'no Turkish letters in '+lang+' '+id);
  }
 }
}
console.log('Extra Learn-path questions ok:',Q.length,JSON.stringify(per));
