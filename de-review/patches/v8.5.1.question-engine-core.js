(()=>{
  const VERSION='8.5.1-QUESTION-ENGINE-CORE';
  const BUILD='851qcore1';
  const addition=`<!-- DEEN v8.5.1 — Multi-format Question Engine Core -->
<script id="deen-v851-question-engine-core">
(()=>{
 if(window.__deenV851QuestionEngine)return;window.__deenV851QuestionEngine=true;
 const VERSION='8.5.1-QUESTION-ENGINE-CORE',BUILD='851qcore1';
 const TYPES=Object.freeze({
  MCQ:'mcq',
  CARD:'card',
  TRUE_FALSE:'true_false',
  FILL_BLANK:'fill_blank',
  MATCH:'match',
  SEQUENCE:'sequence',
  SCENARIO:'scenario',
  ODD_ONE_OUT:'odd_one_out',
  LISTEN_SELECT:'listen_select',
  PRONUNCIATION:'pronunciation'
 });
 const TYPE_LIST=Object.freeze(Object.values(TYPES));
 const TYPE_META=Object.freeze({
  mcq:{label:'4 Şıklı',interaction:'tap',family:'choice'},
  card:{label:'Kart Seçimi',interaction:'tap',family:'choice'},
  true_false:{label:'Doğru / Yanlış',interaction:'swipe_or_tap',family:'binary'},
  fill_blank:{label:'Boşluk Doldurma',interaction:'drag_or_tap',family:'construct'},
  match:{label:'Eşleştirme',interaction:'match',family:'connect'},
  sequence:{label:'Sıralama',interaction:'drag',family:'order'},
  scenario:{label:'Senaryo',interaction:'decision',family:'application'},
  odd_one_out:{label:'Yanlışı Bul',interaction:'tap',family:'discriminate'},
  listen_select:{label:'Dinle ve Seç',interaction:'listen_and_tap',family:'audio'},
  pronunciation:{label:'Telaffuz',interaction:'speak',family:'voice'}
 });
 const clone=v=>{try{return structuredClone(v)}catch(_){return JSON.parse(JSON.stringify(v))}};
 const normText=v=>String(v??'').trim().toLocaleLowerCase('tr-TR').replace(/\\s+/g,' ');
 const optionValue=o=>o&&typeof o==='object'?(o.id??o.value??o.text??''):o;
 function normalizeQuestion(input,index=0){
  const q=input&&typeof input==='object'?clone(input):{};
  q.id=String(q.id||q.questionId||('q_'+(index+1)));
  q.type=String(q.type||TYPES.MCQ).toLowerCase();
  q.prompt=String(q.prompt??q.question??q.text??'').trim();
  q.instruction=String(q.instruction??'').trim();
  q.difficulty=String(q.difficulty||'normal').toLowerCase();
  q.topic=String(q.topic||q.topicId||'').trim();
  q.knowledgeKey=String(q.knowledgeKey||q.skill||q.objective||q.id).trim();
  q.options=Array.isArray(q.options)?q.options:[];
  if(q.answer===undefined&&q.correct!==undefined)q.answer=q.correct;
  if(q.answer===undefined&&q.correctAnswer!==undefined)q.answer=q.correctAnswer;
  q.explanation=String(q.explanation??q.feedback??'').trim();
  q.meta=q.meta&&typeof q.meta==='object'?q.meta:{};
  return q;
 }
 function validateQuestion(input){
  const q=normalizeQuestion(input);
  const errors=[];
  if(!TYPE_LIST.includes(q.type))errors.push('unsupported_type');
  if(!q.prompt&&q.type!==TYPES.PRONUNCIATION)errors.push('missing_prompt');
  if([TYPES.MCQ,TYPES.CARD,TYPES.SCENARIO,TYPES.ODD_ONE_OUT,TYPES.LISTEN_SELECT].includes(q.type)){
   if(q.options.length<2)errors.push('not_enough_options');
   if(q.answer===undefined||q.answer===null||q.answer==='')errors.push('missing_answer');
  }
  if(q.type===TYPES.TRUE_FALSE&&typeof q.answer!=='boolean')errors.push('answer_must_be_boolean');
  if(q.type===TYPES.FILL_BLANK&&(q.answer===undefined||q.answer===null||(Array.isArray(q.answer)&&!q.answer.length)))errors.push('missing_answer');
  if(q.type===TYPES.MATCH){const pairs=q.pairs||q.answer;if(!Array.isArray(pairs)||pairs.length<2)errors.push('missing_pairs')}
  if(q.type===TYPES.SEQUENCE&&!Array.isArray(q.answer||q.sequence))errors.push('missing_sequence');
  if(q.type===TYPES.PRONUNCIATION&&!String(q.targetText??q.answer??'').trim())errors.push('missing_target_text');
  return {valid:errors.length===0,errors,question:q};
 }
 function sameValue(a,b){return normText(optionValue(a))===normText(optionValue(b))}
 function canonicalPairs(v){
  if(!v)return[];
  if(Array.isArray(v))return v.map(x=>Array.isArray(x)?[normText(x[0]),normText(x[1])]:[normText(x?.left??x?.key),normText(x?.right??x?.value)]).sort((a,b)=>a[0].localeCompare(b[0],'tr'));
  if(typeof v==='object')return Object.entries(v).map(([k,val])=>[normText(k),normText(val)]).sort((a,b)=>a[0].localeCompare(b[0],'tr'));
  return[];
 }
 function grade(input,response){
  const q=normalizeQuestion(input);
  if(q.type===TYPES.PRONUNCIATION)return {gradable:false,correct:null,reason:'speech_engine_required'};
  let correct=false;
  if([TYPES.MCQ,TYPES.CARD,TYPES.SCENARIO,TYPES.ODD_ONE_OUT,TYPES.LISTEN_SELECT].includes(q.type)) correct=sameValue(response,q.answer);
  else if(q.type===TYPES.TRUE_FALSE) correct=Boolean(response)===q.answer;
  else if(q.type===TYPES.FILL_BLANK){const accepted=Array.isArray(q.answer)?q.answer:[q.answer];correct=accepted.some(a=>normText(a)===normText(response))}
  else if(q.type===TYPES.SEQUENCE){const expected=q.answer||q.sequence||[],got=Array.isArray(response)?response:[];correct=expected.length===got.length&&expected.every((x,i)=>sameValue(x,got[i]))}
  else if(q.type===TYPES.MATCH){const expected=canonicalPairs(q.pairs||q.answer),got=canonicalPairs(response);correct=expected.length===got.length&&expected.every((p,i)=>p[0]===got[i]?.[0]&&p[1]===got[i]?.[1])}
  return {gradable:true,correct,answer:clone(q.answer??q.pairs??q.sequence??null)};
 }
 function shuffle(a,rng=Math.random){const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
 function buildSection(pool,opts={}){
  const count=Math.max(1,Number(opts.count)||10),rng=typeof opts.rng==='function'?opts.rng:Math.random;
  let items=(Array.isArray(pool)?pool:[]).map(normalizeQuestion);
  if(Array.isArray(opts.allowedTypes)&&opts.allowedTypes.length){const allowed=new Set(opts.allowedTypes);items=items.filter(q=>allowed.has(q.type))}
  items=shuffle(items,rng);
  const out=[],usedTypeCount={};
  while(items.length&&out.length<count){
   const last=out.at(-1)?.type,prev=out.at(-2)?.type;
   let candidates=items.filter(q=>q.type!==last&&q.type!==prev);
   if(!candidates.length)candidates=items.filter(q=>q.type!==last);
   if(!candidates.length)candidates=items;
   candidates.sort((a,b)=>(usedTypeCount[a.type]||0)-(usedTypeCount[b.type]||0));
   const min=usedTypeCount[candidates[0]?.type]||0;
   const best=candidates.filter(q=>(usedTypeCount[q.type]||0)===min);
   const pick=best[Math.floor(rng()*best.length)]||candidates[0];
   out.push(pick);usedTypeCount[pick.type]=(usedTypeCount[pick.type]||0)+1;
   items.splice(items.indexOf(pick),1);
  }
  return out;
 }
 function analyzeSection(items){
  const q=(items||[]).map(normalizeQuestion),types=q.map(x=>x.type),counts={};types.forEach(t=>counts[t]=(counts[t]||0)+1);
  let consecutiveRepeats=0;for(let i=1;i<types.length;i++)if(types[i]===types[i-1])consecutiveRepeats++;
  return {count:q.length,uniqueTypes:Object.keys(counts).length,counts,consecutiveRepeats,diverse:consecutiveRepeats===0&&Object.keys(counts).length>=Math.min(6,q.length)};
 }
 function emit(name,detail){
  const payload={version:VERSION,at:Date.now(),...detail};
  try{document.dispatchEvent(new CustomEvent('deen:question:'+name,{detail:payload}))}catch(_){}
  return payload;
 }
 function feedbackProfile(correct,streak){
  if(!correct)return {tone:'coach',intensity:'soft',label:'Tekrar deneyelim'};
  if(streak>=5)return {tone:'celebrate',intensity:'high',label:'Seri ×'+streak};
  if(streak>=3)return {tone:'reward',intensity:'medium',label:'Harika seri!'};
  return {tone:'reward',intensity:'light',label:'Doğru!'};
 }
 function createSession(pool,opts={}){
  const questions=opts.keepOrder?(pool||[]).map(normalizeQuestion):buildSection(pool,{...opts,count:opts.count||Math.min(10,(pool||[]).length||10)});
  const state={id:String(opts.id||('session_'+Date.now())),index:0,streak:0,bestStreak:0,correct:0,wrong:0,answers:[],startedAt:Date.now(),finishedAt:null};
  const api={
   questions,
   state,
   current:()=>questions[state.index]||null,
   submit(response,extra={}){
    const q=questions[state.index];if(!q)return {ok:false,reason:'finished'};
    const result=grade(q,response),isCorrect=result.correct===true;
    if(result.gradable){if(isCorrect){state.correct++;state.streak++;state.bestStreak=Math.max(state.bestStreak,state.streak)}else{state.wrong++;state.streak=0}}
    const record={questionId:q.id,type:q.type,knowledgeKey:q.knowledgeKey,response:clone(response),correct:result.correct,gradable:result.gradable,elapsedMs:Number(extra.elapsedMs)||0,at:Date.now()};
    state.answers.push(record);
    const feedback=feedbackProfile(isCorrect,state.streak);
    emit('answered',{sessionId:state.id,record,feedback,streak:state.streak});
    if(result.gradable)emit(isCorrect?'correct':'incorrect',{sessionId:state.id,record,feedback,streak:state.streak});
    if(isCorrect&&state.streak>=3)emit('combo',{sessionId:state.id,streak:state.streak,feedback});
    state.index++;
    if(state.index>=questions.length){state.finishedAt=Date.now();emit('complete',{sessionId:state.id,summary:api.summary()})}
    return {ok:true,...result,feedback,streak:state.streak,next:api.current()};
   },
   summary:()=>({id:state.id,total:questions.length,answered:state.answers.length,correct:state.correct,wrong:state.wrong,bestStreak:state.bestStreak,accuracy:state.answers.filter(x=>x.gradable).length?Math.round(state.correct/state.answers.filter(x=>x.gradable).length*100):0,finished:!!state.finishedAt,durationMs:(state.finishedAt||Date.now())-state.startedAt}),
   reset(){state.index=0;state.streak=0;state.bestStreak=0;state.correct=0;state.wrong=0;state.answers.length=0;state.startedAt=Date.now();state.finishedAt=null;emit('reset',{sessionId:state.id});return api}
  };
  emit('session',{sessionId:state.id,count:questions.length,analysis:analyzeSection(questions)});
  return api;
 }
 window.DEEN_QUESTION_TYPES=TYPES;
 window.DEEN_QUESTION_ENGINE={
  version:VERSION,build:BUILD,types:TYPES,typeList:TYPE_LIST,typeMeta:TYPE_META,
  normalize:normalizeQuestion,validate:validateQuestion,grade,buildSection,analyzeSection,createSession,feedbackProfile,
  check:()=>({version:VERSION,build:BUILD,types:TYPE_LIST.length,labels:TYPE_LIST.map(t=>TYPE_META[t].label),ready:true})
 };
 document.documentElement.dataset.deenQuestionEngine='ready';
})();
<\/script>`;
  window.DEEN_PATCH_V851=function(html){
    let out=String(html);
    if(out.includes('deen-v851-question-engine-core'))return {html:out,version:VERSION,applied:0};
    out+='\n'+addition+'\n';
    return {html:out,version:VERSION,applied:1};
  };
})();
