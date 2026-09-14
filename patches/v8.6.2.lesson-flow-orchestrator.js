(()=>{
 const VERSION='8.6.2-LESSON-FLOW-ORCHESTRATOR',BUILD='862flow1';
 const addition=`<!-- DEEN v8.6.2 — Lesson Flow Orchestrator -->
<script id="deen-v862-flow-runtime">
(()=>{
 if(window.__deenV862Flow)return;window.__deenV862Flow=true;
 const VERSION='8.6.2-LESSON-FLOW-ORCHESTRATOR',BUILD='862flow1';
 const ALIAS={
  multiple_choice:'mcq',mcq:'mcq',choice:'mcq',
  card:'card',card_grid:'card',large_card:'card',
  true_false:'true_false',boolean:'true_false',
  fill_blank:'fill_blank',missing_item:'fill_blank',progressive_recall:'fill_blank',next_word:'fill_blank',
  matching:'match',match:'match',
  build_sequence:'sequence',sequence:'sequence',ordering:'sequence',
  scenario:'scenario',case:'scenario',
  error_spotting:'odd_one_out',odd_one_out:'odd_one_out',find_wrong:'odd_one_out',find_incorrect:'odd_one_out',wrong_one:'odd_one_out',spot_error:'odd_one_out',
  listening_select:'listen_select',listening_meaning:'listen_select',listen_select:'listen_select','listen-and-select':'listen_select',audio_select:'listen_select',audio_choice:'listen_select',
  pronunciation:'pronunciation',pronounce:'pronunciation',speaking:'pronunciation',repeat_after_me:'pronunciation',speak:'pronunciation'
 };
 const FAMILY={mcq:'choice',card:'choice',true_false:'binary',fill_blank:'construct',match:'connect',sequence:'order',scenario:'application',odd_one_out:'discriminate',listen_select:'audio',pronunciation:'voice'};
 let plans=0,lastPlan=null;
 const rawType=q=>String(q?.type||q?.question_type||q?.activity_type||'').trim().toLowerCase();
 function classify(q){
  const raw=rawType(q);if(ALIAS[raw])return ALIAS[raw];
  if(Array.isArray(q?.pairs))return'match';
  if(Array.isArray(q?.correct_order)||Array.isArray(q?.sequence))return'sequence';
  if(Array.isArray(q?.options_tr)||Array.isArray(q?.options))return'mcq';
  return'fill_blank';
 }
 const concept=q=>String(q?.concept_id||q?.knowledgeKey||q?.skill||q?.objective||q?.topic||'').trim();
 function difficulty(q){
  const d={easy:0,medium:1,hard:2}[String(q?.difficulty||'').toLowerCase()]??1;
  const c={recognition:0,recall:1,application:2}[String(q?.cognitive_level||'').toLowerCase()]??1;
  return d*2+c;
 }
 function desiredDifficulty(pos,total){const x=total<=1?0:pos/(total-1);return x<.24?1:x<.7?2.5:4}
 function analyze(items){
  const types=(items||[]).map(classify),counts={};types.forEach(t=>counts[t]=(counts[t]||0)+1);
  let immediateRepeats=0,twoBackRepeats=0;for(let i=1;i<types.length;i++){if(types[i]===types[i-1])immediateRepeats++;if(i>1&&types[i]===types[i-2])twoBackRepeats++}
  const conceptMap=new Map();(items||[]).forEach((q,i)=>{const c=concept(q);if(!c)return;const arr=conceptMap.get(c)||[];arr.push({i,type:types[i]});conceptMap.set(c,arr)});
  let crossFormatConcepts=0;for(const arr of conceptMap.values())if(arr.length>1&&new Set(arr.map(x=>x.type)).size>1)crossFormatConcepts++;
  return{count:types.length,uniqueTypes:Object.keys(counts).length,counts,immediateRepeats,twoBackRepeats,trueFalse:counts.true_false||0,crossFormatConcepts,diverse:immediateRepeats===0&&Object.keys(counts).length>=Math.min(types.length,5)};
 }
 function plan(items,opts={}){
  const src=Array.isArray(items)?items.filter(Boolean):[];if(src.length<2)return[...src];
  const pool=src.map((q,i)=>({q,i,type:classify(q),family:FAMILY[classify(q)]||'other',concept:concept(q),difficulty:difficulty(q)}));
  const out=[],lastConceptPos=new Map(),conceptTypes=new Map(),typeUse={};
  while(pool.length){
   const pos=out.length,total=src.length,last=out.at(-1),prev=out.at(-2);
   let candidates=[...pool];
   const noImmediate=candidates.filter(x=>!last||x.type!==last.type);if(noImmediate.length)candidates=noImmediate;
   const noTwoBack=candidates.filter(x=>!prev||x.type!==prev.type);if(noTwoBack.length)candidates=noTwoBack;
   const spacedConcept=candidates.filter(x=>!x.concept||!lastConceptPos.has(x.concept)||pos-lastConceptPos.get(x.concept)>=3);if(spacedConcept.length)candidates=spacedConcept;
   const target=desiredDifficulty(pos,total);
   candidates.sort((a,b)=>{
    const score=x=>{
     let s=0;
     s-=Math.abs(x.difficulty-target)*.58;
     s-=Number(typeUse[x.type]||0)*.34;
     if(!typeUse[x.type])s+=1.35;
     if(last&&x.family!==last.family)s+=.38;
     if(pos===0&&['card','match','fill_blank','mcq'].includes(x.type))s+=.45;
     if(pos>=Math.max(1,total-2)&&['scenario','odd_one_out','sequence'].includes(x.type))s+=.72;
     if(x.type==='true_false'&&pos>=Math.max(1,total-2))s-=.9;
     if(x.concept&&lastConceptPos.has(x.concept)){
      const gap=pos-lastConceptPos.get(x.concept),seenTypes=conceptTypes.get(x.concept)||new Set();
      if(gap>=3&&gap<=5&&!seenTypes.has(x.type))s+=.95;
      if(gap<3)s-=2.2;
     }
     s-=Math.abs(x.i-pos)*.018;
     return s;
    };
    return score(b)-score(a)||a.i-b.i;
   });
   const pick=candidates[0]||pool[0];out.push(pick);typeUse[pick.type]=(typeUse[pick.type]||0)+1;
   if(pick.concept){lastConceptPos.set(pick.concept,pos);const set=conceptTypes.get(pick.concept)||new Set();set.add(pick.type);conceptTypes.set(pick.concept,set)}
   pool.splice(pool.indexOf(pick),1);
  }
  return out.map(x=>x.q);
 }
 function getSession(){let s=null;try{s=session}catch(_){try{s=window.session}catch(__){}}return s}
 function prepareSession(){
  const s=getSession();
  if(!s||!Array.isArray(s.questions)||s.questions.length<2||s.index!==0||s.__v862Planned)return false;
  const before=analyze(s.questions),ordered=plan(s.questions,{final:!!s.final,review:!!s.review,macro:!!s.macroStage});
  s.questions.splice(0,s.questions.length,...ordered);s.__v862Planned=true;
  const after=analyze(s.questions);s.questionFlow={version:VERSION,build:BUILD,before,after,types:s.questions.map(classify)};
  lastPlan={stage:s.stage?.id||'',lessonNo:s.lessonNo||null,final:!!s.final,review:!!s.review,before,after,types:[...s.questionFlow.types],at:Date.now()};plans++;
  try{document.documentElement.dataset.deenQuestionFlow='ready';document.dispatchEvent(new CustomEvent('deen:flow:planned',{detail:{version:VERSION,...lastPlan}}))}catch(_){}
  return true;
 }
 const oldRender=typeof renderQuestion==='function'?renderQuestion:null;
 if(oldRender&&!oldRender.__v862){
  const wrapped=function(...args){prepareSession();return oldRender.apply(this,args)};wrapped.__v862=true;
  try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
 }
 window.DEEN_LESSON_ORCHESTRATOR={version:VERSION,build:BUILD,classify,plan,analyze,prepareSession,check:()=>({version:VERSION,build:BUILD,ready:true,plans,lastPlan})};
 document.documentElement.dataset.deenLessonOrchestrator='ready';
})();
<\/script>`;
 window.DEEN_PATCH_V862=function(html){let out=String(html);if(out.includes('deen-v862-flow-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
