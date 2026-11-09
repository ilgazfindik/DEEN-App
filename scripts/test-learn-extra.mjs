// Structural checks of assets/learn/extra-questions.js (Turkish-only extra Learn-path questions).
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const win={};vm.runInNewContext(readFileSync('assets/learn/extra-questions.js','utf8'),{window:win});
const Q=win.DEEN_EXTRA_QUESTIONS;assert(Array.isArray(Q)&&Q.length>=150,'extra questions present');
const ids=new Set(),texts=new Set(),UNITS=new Set(['U03','U11','U12','U13','U14','U15']);
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
console.log('Extra Learn-path questions ok:',Q.length,JSON.stringify(per));
