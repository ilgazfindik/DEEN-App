// Fail-closed Arabic preview audit for every enabled lesson stage.
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

const specs=[
 {stage:'U01-S01',macro:'U01-M01',versionMarker:"8.6.9-U01-S01",baseCount:14,additionCount:6,patchCount:6},
 {stage:'U01-S02',macro:'U01-M02',versionMarker:"8.6.8-U01-S02",baseCount:14,additionCount:6,patchCount:2}
];

function clone(v){return JSON.parse(JSON.stringify(v))}
function extractAdditions(spec){
 const v=s21.indexOf("const VERSION='"+spec.versionMarker);
 if(v<0)throw Error(spec.stage+': enrichment version marker missing');
 const p=s21.indexOf('const ITEMS=[',v),e=s21.indexOf('];\n let',p);
 if(p<0||e<0)throw Error(spec.stage+': ITEMS block not found');
 const items=Function('const TARGET="'+spec.stage+'";return '+s21.slice(p+'const ITEMS='.length,e+1))();
 if(items.length!==spec.additionCount)throw Error(spec.stage+': runtime additions changed '+items.length);
 return items;
}
function extractPatches(spec){
 const needle="'DEEN-"+spec.stage+"-";
 const hit=s22.indexOf(needle);
 if(hit<0){
  if(spec.patchCount===0)return {};
  throw Error(spec.stage+': patch ids missing');
 }
 const p=s22.lastIndexOf('const CHANGES={',hit),e=s22.indexOf('};\n  let attempts',p);
 if(p<0||e<0)throw Error(spec.stage+': CHANGES block not found');
 const changes=Function('return ('+s22.slice(p+'const CHANGES='.length,e+1)+')')();
 if(Object.keys(changes).length!==spec.patchCount)throw Error(spec.stage+': runtime patch count changed '+Object.keys(changes).length);
 return changes;
}

const liveByStage={};
for(const spec of specs){
 const baseStage=bank.filter(q=>q.stage_id===spec.stage);
 if(baseStage.length!==spec.baseCount)throw Error(spec.stage+': base question count changed '+baseStage.length);
 const changes=extractPatches(spec),additions=extractAdditions(spec);
 for(const [id,change] of Object.entries(changes)){
  const row=bank.find(q=>q.id===id);
  if(!row)throw Error(spec.stage+': missing patched source '+id);
  Object.assign(row,clone(change));
  if(change.pairs){delete row.options_tr;delete row.options;delete row.correct_order;}
 }
 for(const item of additions){
  if(bank.some(q=>q.id===item.id))throw Error(spec.stage+': duplicate enrichment '+item.id);
  bank.push(clone(item));
 }
 liveByStage[spec.stage]={changes,additions};
}

if(Object.keys(draft.translations||{}).length!==28)throw Error('Unexpected base Arabic translation count');
if(Object.keys(draft.runtime_variants||{}).length!==20)throw Error('Unexpected runtime Arabic translation count');
if(draft.release_ready!==false||draft.verified_by_religious_expert!==false)throw Error('Expert approval safety metadata changed');
if(Object.values(draft.translations).some(x=>x.expert_approved!==false))throw Error('Base review flags changed');
if(Object.values(draft.runtime_variants).some(x=>x.expert_approved!==false))throw Error('Runtime review flags changed');

const start=s48.indexOf(' function sameSourceOptions('),finish=s48.indexOf(' pilot.decorate=function(){',start);
if(start<0||finish<0)throw Error('Pilot grader source missing');
const pilot={
 ready:true,
 translations:draft.translations,
 runtime_variants:draft.runtime_variants,
 supportedStages:new Set(specs.map(x=>x.stage))
};
const impl=Function('pilot',s48.slice(start,finish)+'\nreturn {pilot,asDisplayQuestion};')(pilot);

const reports=[];
let totalPlayable=0,totalChoiceIndexChecks=0,totalMatchingChecks=0,totalClozeChecks=0;
for(const spec of specs){
 const live=bank.filter(q=>q.stage_id===spec.stage);
 if(live.length!==20)throw Error(spec.stage+': unexpected live question count '+live.length);
 let stageChoice=0,stageMatch=0,stageCloze=0;
 for(const q of live){
  const tr=pilot.runtime_variants[q.id]||pilot.translations[q.id];
  if(!tr)throw Error(q.id+': untranslated');
  const render=impl.asDisplayQuestion(q,tr,!!pilot.runtime_variants[q.id]);
  if(!render)throw Error(q.id+': source changed or Arabic grading integrity failed');
  if(render.activity_type==='matching'){
   stageMatch++;
   if(!Array.isArray(render.pairs)||render.pairs.length<3)throw Error(q.id+': missing Arabic pair translations');
  }
  if(Array.isArray(render.options_tr)){
   stageChoice++;
   const arIndex=render.options_tr.indexOf(render.correct_answer);
   const sourceIndex=q.options_tr.indexOf(q.correct_answer);
   if(arIndex<0||arIndex!==sourceIndex)throw Error(q.id+': correct option index changed');
  }
  const sourceBlanks=(q.question_tr.match(/_{3,}/g)||[]).length;
  const arBlanks=(render.question_tr.match(/_{3,}/g)||[]).length;
  if(sourceBlanks!==arBlanks)throw Error(q.id+': blank count changed');
  if(arBlanks)stageCloze++;
  if(!/[\u0600-\u06FF]/.test(render.question_tr)||!/[\u0600-\u06FF]/.test(render.explanation_tr))throw Error(q.id+': Arabic text missing');
  if(render.__deenSourceQuestion!==q)throw Error(q.id+': Turkish source not retained');
  if(tr.expert_approved!==false)throw Error(q.id+': expert-review state unsafe');
 }
 const seven=pilot.questionsFor(bank,spec.stage,7,a=>[...a]);
 if(seven.length!==7||new Set(seven.map(q=>q.id)).size!==7)throw Error(spec.stage+': seven-question selection invalid');
 if(!seven.some(q=>q.activity_type==='matching')||!seven.some(q=>q.activity_type==='fill_blank')||!seven.some(q=>q.activity_type==='true_false'))throw Error(spec.stage+': format diversity insufficient');
 const missingOne=bank.filter(q=>q.id!==live[0].id);
 if(pilot.questionsFor(missingOne,spec.stage,7,a=>[...a]).length!==0)throw Error(spec.stage+': fail-closed missing-source behavior failed');
 totalPlayable+=live.length;totalChoiceIndexChecks+=stageChoice;totalMatchingChecks+=stageMatch;totalClozeChecks+=stageCloze;
 reports.push({stage:spec.stage,macro:spec.macro,live:live.length,choiceIndexChecks:stageChoice,matchingChecks:stageMatch,clozeChecks:stageCloze,selection:seven.map(q=>q.id)});
}

// Exercise the actual browser entry guards.
const browserScript=s48.match(/<script id="deen-v91221-arabic-question-pilot-js">([\s\S]*?)<\/script>/);
if(!browserScript)throw Error('Arabic pilot browser boot script not found');
let lang='ar',nativeMacro=0,nativeReview=0,routedStage='',warnings=0;
const W={
 DEEN_APP_LOCALE:{get:()=>lang},
 startStage:id=>{routedStage=id},
 startMacroStage:()=>{nativeMacro++},
 startSmartReview:()=>{nativeReview++},
 alert:()=>{warnings++}
};
const D={addEventListener:()=>{}};
const simulatedFetch=async()=>({ok:true,json:async()=>draft});
Function('window','document','fetch','console',browserScript[1])(W,D,simulatedFetch,console);
await W.DEEN_ARABIC_PILOT.promise;
if(!W.DEEN_ARABIC_PILOT.ready)throw Error('Arabic preview failed to preload');

routedStage='';W.startMacroStage('U01-M01');
if(routedStage!=='U01-S01'||nativeMacro!==0)throw Error('U01-M01 did not route to Arabic S01');
routedStage='';W.startMacroStage('U01-M02');
if(routedStage!=='U01-S02'||nativeMacro!==0)throw Error('U01-M02 did not route to Arabic S02');
routedStage='';W.startMacroStage('U01-M03');
if(routedStage!==''||nativeMacro!==0)throw Error('Unreviewed Arabic macro stage was not blocked');
W.startSmartReview();
if(nativeReview!==0)throw Error('Unreviewed Arabic smart-review was not blocked');

lang='tr';W.startMacroStage('U01-M03');W.startSmartReview();
if(nativeMacro!==1||nativeReview!==1)throw Error('Original Turkish paths not preserved');
if(warnings<2)throw Error('Blocked Arabic content did not show a warning');

console.log(JSON.stringify({
 result:'PASS',
 enabledStages:specs.map(x=>x.stage),
 enabledMacros:specs.map(x=>x.macro),
 playableArabicQuestionVariants:totalPlayable,
 baseArabicTranslations:Object.keys(draft.translations).length,
 runtimeArabicVariants:Object.keys(draft.runtime_variants).length,
 choiceIndexChecks:totalChoiceIndexChecks,
 matchingChecks:totalMatchingChecks,
 clozeChecks:totalClozeChecks,
 stageReports:reports,
 translationsRemainExpertUnapproved:true,
 malformedOrStaleDataMustBlock:true,
 arabicMacroEntryGuardPass:true,
 originalTurkishNavigationPreserved:true
},null,2));
