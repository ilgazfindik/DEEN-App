(()=>{
 const VERSION='8.7.3-U01-FLOW-BALANCE',BUILD='873flow1';
 const addition=`<!-- DEEN v8.7.3 — U01 Flow Balance -->
<script id="deen-v873-u01-flow-balance-runtime">
(()=>{
 if(window.__deenV873FlowBalance)return;window.__deenV873FlowBalance=true;
 const VERSION='8.7.3-U01-FLOW-BALANCE',BUILD='873flow1';
 const FAMILY={mcq:'choice',card:'choice',true_false:'binary',fill_blank:'construct',match:'connect',sequence:'order',scenario:'application',odd_one_out:'discriminate',listen_select:'audio',pronunciation:'voice'};
 let plans=0,lastPlan=null;
 const orch=()=>window.DEEN_LESSON_ORCHESTRATOR;
 const classify=q=>{try{return orch()?.classify?.(q)||'mcq'}catch(_){return'mcq'}};
 const concept=q=>String(q?.concept_id||q?.knowledgeKey||q?.skill||q?.objective||q?.topic||'').trim();
 function difficulty(q){const d={easy:0,medium:1,hard:2}[String(q?.difficulty||'').toLowerCase()]??1;const c={recognition:0,recall:1,application:2}[String(q?.cognitive_level||'').toLowerCase()]??1;return d*2+c}
 function desiredDifficulty(pos,total){const x=total<=1?0:pos/(total-1);return x<.24?1:x<.7?2.5:4}
 function balancedPlan(items){
  const src=Array.isArray(items)?items.filter(Boolean):[];if(src.length<2)return[...src];
  const pool=src.map((q,i)=>({q,i,type:classify(q),family:FAMILY[classify(q)]||'other',concept:concept(q),difficulty:difficulty(q)}));
  const out=[],lastConceptPos=new Map(),conceptTypes=new Map(),typeUse={};
  while(pool.length){
   const pos=out.length,total=src.length,last=out.at(-1),prev=out.at(-2),counts={};
   pool.forEach(x=>counts[x.type]=(counts[x.type]||0)+1);
   let typeChoices=Object.keys(counts).filter(t=>!last||t!==last.type);if(!typeChoices.length)typeChoices=Object.keys(counts);
   typeChoices.sort((a,b)=>{
    const countDiff=counts[b]-counts[a];if(countDiff)return countDiff;
    const aTwo=prev&&a===prev.type?1:0,bTwo=prev&&b===prev.type?1:0;if(aTwo!==bTwo)return aTwo-bTwo;
    const useDiff=Number(typeUse[a]||0)-Number(typeUse[b]||0);if(useDiff)return useDiff;
    return a.localeCompare(b,'tr');
   });
   const chosenType=typeChoices[0];let candidates=pool.filter(x=>x.type===chosenType);
   const spaced=candidates.filter(x=>!x.concept||!lastConceptPos.has(x.concept)||pos-lastConceptPos.get(x.concept)>=3);if(spaced.length)candidates=spaced;
   const target=desiredDifficulty(pos,total);
   candidates.sort((a,b)=>{
    const score=x=>{
     let s=0;s-=Math.abs(x.difficulty-target)*.58;
     if(last&&x.family!==last.family)s+=.38;
     if(pos===0&&['card','match','fill_blank','mcq'].includes(x.type))s+=.45;
     if(pos>=Math.max(1,total-2)&&['scenario','odd_one_out','sequence'].includes(x.type))s+=.72;
     if(x.type==='true_false'&&pos>=Math.max(1,total-2))s-=.9;
     if(x.concept&&lastConceptPos.has(x.concept)){
      const gap=pos-lastConceptPos.get(x.concept),seen=conceptTypes.get(x.concept)||new Set();
      if(gap>=3&&gap<=5&&!seen.has(x.type))s+=.95;if(gap<3)s-=2.2;
     }
     s-=Math.abs(x.i-pos)*.018;return s;
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
  const s=getSession();if(!s||!Array.isArray(s.questions)||s.questions.length<2||s.index!==0||s.__v873Planned)return false;
  const before=orch()?.analyze?.(s.questions)||null,ordered=balancedPlan(s.questions);s.questions.splice(0,s.questions.length,...ordered);
  s.__v873Planned=true;s.__v862Planned=true;const after=orch()?.analyze?.(s.questions)||null;
  s.questionFlow={version:VERSION,build:BUILD,before,after,types:s.questions.map(classify)};
  lastPlan={stage:s.stage?.id||'',lessonNo:s.lessonNo||null,final:!!s.final,review:!!s.review,before,after,types:[...s.questionFlow.types],at:Date.now()};plans++;
  try{document.documentElement.dataset.deenQuestionFlow='balanced';document.dispatchEvent(new CustomEvent('deen:flow:balanced',{detail:{version:VERSION,...lastPlan}}))}catch(_){}
  return true;
 }
 function install(){
  const o=orch();if(!o)return false;o.plan=balancedPlan;
  const old=typeof renderQuestion==='function'?renderQuestion:window.renderQuestion;
  if(typeof old==='function'&&!old.__v873){const wrapped=function(...args){prepareSession();return old.apply(this,args)};wrapped.__v873=true;try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}}
  document.documentElement.dataset.deenFlowBalance='ready';return true;
 }
 function audit(){
  let qs=[];try{if(Array.isArray(QUESTIONS))qs=QUESTIONS}catch(_){}if(!qs.length&&Array.isArray(window.QUESTIONS))qs=window.QUESTIONS;
  const stages=['U01-S01','U01-S02','U01-S03','U01-S04','U01-S05','U01-S06','U01-S07'];
  const result=stages.map(id=>{const pool=qs.filter(q=>String(q?.stage_id||q?.stageId||'')===id),ordered=balancedPlan(pool),a=orch()?.analyze?.(ordered)||null;return{id,count:pool.length,uniqueTypes:a?.uniqueTypes||0,immediateRepeats:a?.immediateRepeats??null,twoBackRepeats:a?.twoBackRepeats??null}});
  return{version:VERSION,build:BUILD,ready:!!qs.length,pass:result.every(x=>x.immediateRepeats===0||x.immediateRepeats===null),stages:result};
 }
 [0,120,420,1000].forEach(ms=>setTimeout(install,ms));
 window.DEEN_U01_FLOW_BALANCE={version:VERSION,build:BUILD,plan:balancedPlan,prepareSession,install,audit,check:()=>({version:VERSION,build:BUILD,ready:document.documentElement.dataset.deenFlowBalance==='ready',plans,lastPlan,audit:audit()})};
})();
<\/script>`;
 window.DEEN_PATCH_V873=function(html){let out=String(html);if(out.includes('deen-v873-u01-flow-balance-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
