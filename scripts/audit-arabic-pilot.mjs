// Fail-closed Arabic first-stage preview: verify ALL live overrides and new questions.
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const seg=n=>read('release/v9.9.3-direct/segment-'+String(n).padStart(2,'0')+'.txt');
const baseText=Array.from({length:7},(_,i)=>seg(i+2)).join('');
if(!baseText.startsWith('const QUESTIONS=')||!baseText.trim().endsWith('];'))throw Error('Unexpected core question bank boundaries');
const bank=JSON.parse(baseText.slice('const QUESTIONS='.length).replace(/;\s*$/,''));
const draft=JSON.parse(read('assets/i18n/questions.ar.draft.json'));
const s21=seg(21),s22=seg(22),s48=seg(48);
const p=s21.indexOf('const ITEMS=[',s21.indexOf('<!-- DEEN v8.6.9')),e=s21.indexOf('];\n let installed',p);
const c=s22.indexOf('const CHANGES={'),d=s22.indexOf('};\n  let attempts',c);
if([p,e,c,d].some(v=>v<0))throw Error('Runtime question-format sources not located');
const added=Function('const TARGET="U01-S01";return '+s21.slice(p+'const ITEMS='.length,e+1))();
const changes=Function('return ('+s22.slice(c+'const CHANGES='.length,d+1)+')')();
if(added.length!==6||Object.keys(changes).length!==6)throw Error('Unreviewed live-format source change');
for(const [id,change] of Object.entries(changes)){
 const row=bank.find(q=>q.id===id);
 if(!row)throw Error('Missing source question '+id);
 Object.assign(row,JSON.parse(JSON.stringify(change)));
 if(change.pairs){delete row.options_tr;delete row.options;delete row.correct_order;}
}
for(const item of added){
 if(bank.some(q=>q.id===item.id))throw Error('Duplicate enrichment '+item.id);
 bank.push(item);
}
const pilotBank=bank.filter(q=>q.stage_id==='U01-S01');
if(pilotBank.length!==20)throw Error('Unexpected pilot stage question count '+pilotBank.length);
if(Object.keys(draft.translations).length!==14||Object.keys(draft.runtime_variants||{}).length!==12)throw Error('Unexpected translation counts');
if(draft.release_ready!==false||draft.verified_by_religious_expert!==false)throw Error('Expert approval safety metadata changed');
const start=s48.indexOf(' function sameSourceOptions('),finish=s48.indexOf(' pilot.decorate=function(){',start);
if(start<0||finish<0)throw Error('Pilot grader source missing');
const pilot={ready:true,translations:draft.translations,runtime_variants:draft.runtime_variants};
const impl=Function('pilot',s48.slice(start,finish)+'\nreturn {pilot,asDisplayQuestion};')(pilot);
let matchCount=0,blankCount=0,correctIndexChecks=0,matchingChecks=0;
const reports=[];
for(const q of pilotBank){
 const tr=pilot.runtime_variants[q.id]||pilot.translations[q.id];
 if(!tr)throw Error(q.id+': untranslated');
 const render=impl.asDisplayQuestion(q,tr,!!pilot.runtime_variants[q.id]);
 if(!render)throw Error(q.id+': source changed or Arabic grading index invalid');
 if(render.activity_type==='matching'){
  matchingChecks++;
  if(!Array.isArray(render.pairs)||render.pairs.length<3)throw Error(q.id+': missing Arabic pair translations');
 }
 if(Array.isArray(render.options_tr)){
  correctIndexChecks++;
  const index=render.options_tr.indexOf(render.correct_answer);
  if(index<0||index!==q.options_tr.indexOf(q.correct_answer))throw Error(q.id+': correct option changed');
 }
 const tBlanks=(q.question_tr.match(/___/g)||[]).length,aBlanks=(render.question_tr.match(/___/g)||[]).length;
 if(tBlanks!==aBlanks)throw Error(q.id+': blank count mismatch');
 if(aBlanks)blankCount++;
 if(!/[\u0600-\u06FF]/.test(render.question_tr)||!/[\u0600-\u06FF]/.test(render.explanation_tr))throw Error(q.id+': Arabic text missing');
 if(render.__deenSourceQuestion!==q)throw Error(q.id+': did not preserve Turkish source');
 if(tr.expert_approved!==false)throw Error(q.id+': invalid expert-review state');
 reports.push({id:q.id,type:render.activity_type,correctIndex:Array.isArray(q.options_tr)?q.options_tr.indexOf(q.correct_answer):null});
 matchCount++;
}
const seven=pilot.questionsFor(bank,7,a=>[...a]);
if(seven.length!==7||new Set(seven.map(q=>q.id)).size!==7)throw Error('Seven-question selection invalid');
if(!seven.some(q=>q.activity_type==='matching')||!seven.some(q=>q.activity_type==='fill_blank')||!seven.some(q=>q.activity_type==='true_false'))throw Error('Format diversity insufficient');
if(pilot.questionsFor(bank.filter(q=>q.id!=='DEEN-U01-S01-015'),7,a=>[...a]).length!==0)throw Error('Fail-closed missing-source behavior did not work');
console.log(JSON.stringify({
 result:'PASS',baseStageQuestions:14,runtimeOverrides:6,runtimeAdditions:6,
 playableArabicQuestionVariants:matchCount,choiceIndexChecks:correctIndexChecks,
 matchingChecks,clozeChecks:blankCount,pilotSelection:seven.map(q=>q.id),
 translationsRemainExpertUnapproved:true,
 malformedOrStaleDataMustBlock:true
},null,2));
