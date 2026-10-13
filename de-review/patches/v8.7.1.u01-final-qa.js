(()=>{
 const VERSION='8.7.1-U01-FINAL-QA',BUILD='871u01qa1';
 const addition=`<!-- DEEN v8.7.1 — U01 Final QA -->
<script id="deen-v871-u01-final-qa-runtime">
(()=>{
 if(window.__deenV871U01QA)return;window.__deenV871U01QA=true;
 const VERSION='8.7.1-U01-FINAL-QA',BUILD='871u01qa1';
 const STAGES=['U01-S01','U01-S02','U01-S03','U01-S04','U01-S05','U01-S06','U01-S07'];
 const ALIAS={multiple_choice:'mcq',mcq:'mcq',choice:'mcq',card:'card',card_grid:'card',large_card:'card',true_false:'true_false',boolean:'true_false',fill_blank:'fill_blank',missing_item:'fill_blank',progressive_recall:'fill_blank',next_word:'fill_blank',matching:'match',match:'match',build_sequence:'sequence',sequence:'sequence',ordering:'sequence',scenario:'scenario',case:'scenario',error_spotting:'odd_one_out',odd_one_out:'odd_one_out',find_wrong:'odd_one_out',find_incorrect:'odd_one_out',wrong_one:'odd_one_out',spot_error:'odd_one_out',listening_select:'listen_select',listen_select:'listen_select',pronunciation:'pronunciation',speak:'pronunciation'};
 let runs=0,lastReport=null;
 function bank(){let q=[];try{if(Array.isArray(QUESTIONS))q=QUESTIONS}catch(_){};if(!q.length&&Array.isArray(window.QUESTIONS))q=window.QUESTIONS;return Array.isArray(q)?q:[]}
 function type(q){try{const t=window.DEEN_LESSON_ORCHESTRATOR?.classify?.(q);if(t)return t}catch(_){};const raw=String(q?.type||q?.question_type||q?.activity_type||'').toLowerCase();if(ALIAS[raw])return ALIAS[raw];if(Array.isArray(q?.pairs))return'match';if(Array.isArray(q?.correct_order)||Array.isArray(q?.sequence))return'sequence';if(Array.isArray(q?.options_tr)||Array.isArray(q?.options))return'mcq';return'fill_blank'}
 const stage=q=>String(q?.stage_id||q?.stageId||'');
 const concept=q=>String(q?.concept_id||q?.knowledgeKey||q?.skill||q?.objective||q?.topic||'').trim();
 const prompt=q=>String(q?.question_tr||q?.prompt||q?.question||'').trim();
 const opts=q=>Array.isArray(q?.options_tr)?q.options_tr:Array.isArray(q?.options)?q.options:[];
 const norm=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[“”"'’.,!?;:()\[\]{}\-_/\\]/g,' ').replace(/\s+/g,' ').trim();
 const tokens=s=>new Set(norm(s).split(' ').filter(x=>x.length>2));
 function jaccard(a,b){const A=tokens(a),B=tokens(b);if(!A.size||!B.size)return 0;let i=0;A.forEach(x=>{if(B.has(x))i++});return i/(A.size+B.size-i)}
 function duplicatePromptAudit(qs){
  const exact=[],near=[],map=new Map();
  qs.forEach(q=>{const n=norm(prompt(q));if(!n)return;const prev=map.get(n)||[];prev.forEach(p=>exact.push({a:p.id,b:q.id,stageA:stage(p),stageB:stage(q),text:prompt(q)}));prev.push(q);map.set(n,prev)});
  for(let i=0;i<qs.length;i++)for(let j=i+1;j<qs.length;j++){
   const a=qs[i],b=qs[j],pa=prompt(a),pb=prompt(b);if(pa.length<24||pb.length<24||norm(pa)===norm(pb))continue;
   const sim=jaccard(pa,pb);if(sim<.82)continue;
   const sameType=type(a)===type(b),ca=concept(a),cb=concept(b),sameConcept=!!ca&&ca===cb;
   if(sameType||!sameConcept)near.push({a:a.id,b:b.id,stageA:stage(a),stageB:stage(b),similarity:Number(sim.toFixed(3)),sameType,sameConcept});
  }
  return{exact,near};
 }
 function itemAudit(q){
  const issues=[],o=opts(q).map(x=>String(x||'').trim()),t=type(q),correct=String(q?.correct_answer??q?.answer??'').trim();
  if(['mcq','card','true_false','fill_blank','scenario','odd_one_out','listen_select'].includes(t)){
   if(o.length<2)issues.push('TOO_FEW_OPTIONS');
   const n=o.map(norm);if(new Set(n).size!==n.length)issues.push('DUPLICATE_OPTIONS');
   if(correct&&o.length&&!n.includes(norm(correct)))issues.push('CORRECT_NOT_IN_OPTIONS');
   if(o.some(x=>x.length>120))issues.push('OPTION_TOO_LONG_MOBILE');
   if(correct&&o.length>=3){const ci=o.findIndex(x=>norm(x)===norm(correct));if(ci>=0){const dl=o.filter((_,i)=>i!==ci).map(x=>Math.max(1,x.length));const avg=dl.reduce((a,b)=>a+b,0)/dl.length;if(correct.length>28&&correct.length>avg*2.6)issues.push('ANSWER_LENGTH_GIVEAWAY')}}
  }
  if(prompt(q).length>190)issues.push('PROMPT_TOO_LONG_MOBILE');
  if(t==='match'&&Array.isArray(q?.pairs)){if(q.pairs.length>5)issues.push('TOO_MANY_MATCH_PAIRS');if(q.pairs.some(p=>String(p?.left||'').length>70||String(p?.right||'').length>70))issues.push('MATCH_TEXT_TOO_LONG')}
  if(t==='sequence'){const arr=Array.isArray(q?.items)?q.items:Array.isArray(q?.correct_order)?q.correct_order:[];if(arr.length>6)issues.push('TOO_MANY_SEQUENCE_ITEMS')}
  return issues;
 }
 function stageAudit(id,qs){
  const pool=qs.filter(q=>stage(q)===id),counts={};pool.forEach(q=>counts[type(q)]=(counts[type(q)]||0)+1);
  const unique=Object.keys(counts).length,n=pool.length,dominant=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]||['none',0];
  const flags=[];
  if(n<10)flags.push({severity:'warning',code:'LOW_POOL',text:'Soru havuzu 10 etkileşimin altında.'});
  if(n>=10&&unique<4)flags.push({severity:'critical',code:'LOW_FORMAT_VARIETY',text:'10+ etkileşimde 4 farklı formatın altında.'});
  else if(n>=10&&unique<5)flags.push({severity:'warning',code:'FORMAT_VARIETY',text:'5 farklı formatın altında.'});
  if(n&&dominant[1]/n>.55)flags.push({severity:'warning',code:'DOMINANT_FORMAT',text:dominant[0]+' oranı %'+Math.round(dominant[1]/n*100)+'.'});
  if(n&&(counts.true_false||0)/n>.25)flags.push({severity:'warning',code:'TRUE_FALSE_HEAVY',text:'Doğru/Yanlış oranı %25 üstünde.'});
  const cmap=new Map();pool.forEach(q=>{const c=concept(q);if(!c)return;const a=cmap.get(c)||[];a.push(type(q));cmap.set(c,a)});
  let repeated=0,cross=0;for(const arr of cmap.values())if(arr.length>1){repeated++;if(new Set(arr).size>1)cross++}
  if(repeated>=2&&cross/repeated<.5)flags.push({severity:'warning',code:'LOW_CROSS_FORMAT',text:'Tekrarlanan kazanımların yarısından azı farklı formatla ölçülüyor.'});
  let planned=null;try{const p=window.DEEN_LESSON_ORCHESTRATOR?.plan?.(pool)||pool;planned=window.DEEN_LESSON_ORCHESTRATOR?.analyze?.(p)||null;if(planned?.immediateRepeats>0)flags.push({severity:'warning',code:'FLOW_REPEAT',text:'Planner sonrası ardışık format tekrarı kaldı.'})}catch(_){}
  return{id,count:n,uniqueTypes:unique,counts,dominantType:dominant[0],dominantShare:n?Number((dominant[1]/n).toFixed(3)):0,repeatedConcepts:repeated,crossFormatConcepts:cross,crossFormatRate:repeated?Number((cross/repeated).toFixed(3)):null,planned,flags};
 }
 function run(){
  const all=bank(),qs=all.filter(q=>/^U01-S0[1-7]$/.test(stage(q)));
  if(!qs.length){lastReport={version:VERSION,build:BUILD,ready:false,reason:'U01_NOT_READY',at:Date.now()};return lastReport}
  const stages=STAGES.map(id=>stageAudit(id,qs));
  const itemIssues=[];qs.forEach(q=>{const issues=itemAudit(q);if(issues.length)itemIssues.push({id:q.id,stage:stage(q),type:type(q),issues})});
  const dup=duplicatePromptAudit(qs);
  const allTypes=[...new Set(qs.map(type))],missingStages=STAGES.filter(id=>!qs.some(q=>stage(q)===id));
  const critical=[];const warnings=[];stages.forEach(s=>s.flags.forEach(f=>(f.severity==='critical'?critical:warnings).push({stage:s.id,...f})));
  itemIssues.forEach(x=>x.issues.forEach(code=>{const sev=['CORRECT_NOT_IN_OPTIONS','DUPLICATE_OPTIONS','TOO_FEW_OPTIONS'].includes(code)?'critical':'warning';(sev==='critical'?critical:warnings).push({stage:x.stage,id:x.id,severity:sev,code})}));
  dup.exact.forEach(x=>critical.push({severity:'critical',code:'EXACT_DUPLICATE_PROMPT',...x}));
  dup.near.forEach(x=>warnings.push({severity:'warning',code:'SUSPICIOUS_NEAR_DUPLICATE',...x}));
  if(missingStages.length)critical.push({severity:'critical',code:'MISSING_STAGES',stages:missingStages});
  const requiredSystems=['DEEN_QUESTION_ENGINE','DEEN_LESSON_ORCHESTRATOR','DEEN_QUESTION_COVERAGE','DEEN_CARD_CHOICE_UI','DEEN_MATCHING_MINIGAME','DEEN_FILL_BLANK_MINIGAME','DEEN_TRUE_FALSE_SWIPE','DEEN_SCENARIO_MINIGAME','DEEN_ODD_ONE_OUT_MINIGAME','DEEN_RAPID_CHOICE_MCQ'];
  const missingSystems=requiredSystems.filter(k=>!window[k]);if(missingSystems.length)critical.push({severity:'critical',code:'MISSING_RUNTIME_SYSTEMS',systems:missingSystems});
  lastReport={version:VERSION,build:BUILD,ready:true,at:Date.now(),unit:'U01',questionCount:qs.length,stageCount:STAGES.length,types:allTypes,uniqueTypes:allTypes.length,stages,itemIssues,duplicates:dup,missingStages,missingSystems,summary:{pass:critical.length===0,critical:critical.length,warnings:warnings.length,exactDuplicates:dup.exact.length,nearDuplicates:dup.near.length,itemIssueQuestions:itemIssues.length},critical,warnings};
  runs++;try{document.documentElement.dataset.deenU01FinalQa=lastReport.summary.pass?'pass':'review';document.dispatchEvent(new CustomEvent('deen:u01:qa',{detail:{version:VERSION,summary:lastReport.summary}}))}catch(_){}
  return lastReport;
 }
 function schedule(){[0,200,650,1500,3000].forEach(ms=>setTimeout(()=>{const r=run();if(r?.ready&&r.summary?.pass)document.documentElement.dataset.deenU01FinalQa='pass'},ms))}
 window.DEEN_U01_FINAL_QA={version:VERSION,build:BUILD,run,report:()=>lastReport,check:()=>{const r=lastReport||run();return{version:VERSION,build:BUILD,ready:!!r?.ready,runs,summary:r?.summary||null,questionCount:r?.questionCount||0,uniqueTypes:r?.uniqueTypes||0,stages:r?.stages?.map(s=>({id:s.id,count:s.count,uniqueTypes:s.uniqueTypes,flags:s.flags}))||[]}}};
 document.documentElement.dataset.deenU01FinalQa='loaded';schedule();
})();
<\/script>`;
 window.DEEN_PATCH_V871=function(html){let out=String(html);if(out.includes('deen-v871-u01-final-qa-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
