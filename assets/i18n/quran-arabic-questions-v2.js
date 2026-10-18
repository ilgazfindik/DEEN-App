/* DEEN Arabic V2: audited question packs; new stores never replace legacy progress.
 * Packs remain code-owned, never loaded from localStorage. No new questions ship here.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_QUESTIONS_V2)return;
 const languages=Object.freeze(['tr','en','ar','de','fr']);
 const banks=new Map(),byId=new Map(),fingerprints=new Set(),packs=new Set();
 const eligible=/[\u0621-\u064a\u0671-\u06d3]/u;
 const text=o=>typeof o==='string'&&o.trim().length>0;
 const norm=s=>String(s).normalize('NFC').replace(/\u0640/g,'').replace(/\s+/g,' ').trim();
 const translation=o=>!!o&&typeof o==='object'&&languages.every(l=>text(o[l]));
 const error=(id,issue)=>id+':'+issue;
 const approved=ref=>!!window.DEEN_ARABIC_LETTER_AUDIO?.available?.(ref);
 function validateBank(questions,existingIds=new Set(),existingFingerprints=new Set()){
  const errors=[],ids=new Set(existingIds),keys=new Set(existingFingerprints);
  if(!Array.isArray(questions)){return {valid:false,errors:['PACK_NOT_ARRAY']}}
  for(const [i,q] of questions.entries()){
   const id=text(q?.id)?q.id:'index-'+i,fail=m=>errors.push(error(id,m));
   if(!q||typeof q!=='object'){fail('NOT_OBJECT');continue}
   if(!/^[a-z0-9][a-z0-9-]{4,70}$/.test(id)||ids.has(id))fail('ID_DUPLICATE_OR_INVALID');
   ids.add(id);
   if(!/^[a-z][a-z0-9-]*$/.test(q.skill||''))fail('SKILL_REQUIRED');
   if(!/^arabic-[a-z0-9-]+$/.test(q.stage||''))fail('STAGE_REQUIRED');
   if(![1,2,3].includes(q.difficulty))fail('DIFFICULTY_RANGE');
   if(q.type!=='choice')fail('UNSUPPORTED_TYPE');
   if(!text(q.target)||!eligible.test(q.target)||/[\u0000-\u001f]/.test(q.target))fail('ARABIC_TARGET_REQUIRED');
   if(!translation(q.prompt)||!translation(q.explanation))fail('FIVE_LANGUAGE_PROMPT_EXPLANATION');
   if(!Array.isArray(q.locale)||q.locale.length!==5||languages.some(l=>!q.locale.includes(l)))fail('LOCALE_CONTRACT');
   if(!Array.isArray(q.choices)||q.choices.length<3||q.choices.length>4){fail('CHOICES_THREE_TO_FOUR');continue}
   const seenIds=new Set(),seenGlyphs=new Set();
   for(const choice of q.choices){
    if(!text(choice?.id)||seenIds.has(choice.id))fail('CHOICE_ID_DUPLICATE');
    seenIds.add(choice?.id);
    if(!text(choice?.glyph)||!eligible.test(choice.glyph))fail('CHOICE_ARABIC_GLYPH');
    if(seenGlyphs.has(norm(choice?.glyph)))fail('CHOICE_GLYPH_DUPLICATE');
    seenGlyphs.add(norm(choice?.glyph));
    if(choice?.audioRef&&!approved(choice.audioRef))fail('UNAPPROVED_CHOICE_AUDIO');
    if(choice?.label!=null&&!translation(choice.label))fail('CHOICE_LABEL_MISSING_LOCALES');
   }
   if(!text(q.correctAnswer)||q.choices.filter(x=>x?.id===q.correctAnswer).length!==1)fail('ONE_CORRECT_ANSWER');
   for(const choice of q.choices){
    if(choice?.id===q.correctAnswer)continue;
    if(!translation(q.distractorRationale?.[choice?.id]))fail('DISTRACTOR_EXPLANATION_'+choice?.id);
   }
   if(q.audioRef&&!approved(q.audioRef))fail('UNAPPROVED_AUDIO');
   if(q.source!=null&&!text(q.source))fail('SOURCE_MUST_BE_TEXT');
   if(q.stage.startsWith('arabic-meaning')&&q.source==null)fail('MEANING_REQUIRES_SOURCE');
   const correct=q.choices.find(x=>x?.id===q.correctAnswer)?.glyph||'';
   if(translation(q.prompt)&&text(q.stage)&&text(q.skill)&&text(q.target)){
    // Exclude the choice order: a reshuffled multiple-choice item is not new content.
    const key=[q.stage,q.skill,norm(q.target),norm(q.prompt.tr).toLocaleLowerCase('tr'),norm(correct)].join('|');
    if(keys.has(key))fail('SEMANTIC_DUPLICATE');
    keys.add(key);
   }
  }
  return {valid:errors.length===0,errors};
 }
 function registerPack(pack){
  if(!pack||!text(pack.id)||!Array.isArray(pack.questions)||packs.has(pack.id))throw Error('V2_PACK_ID_OR_DUPLICATE');
  const audit=validateBank(pack.questions,new Set(byId.keys()),fingerprints);
  if(!audit.valid){const e=Error('V2_QUESTION_AUDIT_FAILED:'+audit.errors.join(';'));e.issues=audit.errors;throw e}
  // Atomic: no mutations above this line.
  for(const input of pack.questions){
   const q=Object.freeze({...input,choices:Object.freeze(input.choices.map(x=>Object.freeze({...x})))});
   if(!banks.has(q.stage))banks.set(q.stage,[]);
   banks.get(q.stage).push(q);byId.set(q.id,q);
   const correct=q.choices.find(x=>x.id===q.correctAnswer).glyph;
   fingerprints.add([q.stage,q.skill,norm(q.target),norm(q.prompt.tr).toLocaleLowerCase('tr'),norm(correct)].join('|'));
  }
  packs.add(pack.id);
  return {id:pack.id,count:pack.questions.length};
 }
 const rng=seed=>{let s=(Number(seed)>>>0)||1;return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296}};
 function shuffled(array,random){
  const copy=[...array];
  for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}
  return copy;
 }
 function createSession(stage,{count=10,recentIds=[],seed=Date.now(),practice=null,now=Date.now()}={}){
  const pool=banks.get(stage)||[];
  if(pool.length<8)return null; // Existing 3–5 question lessons stay entirely legacy.
  const limit=Math.max(8,Math.min(12,Math.trunc(Number(count)||10),pool.length));
  const recent=new Set(Array.isArray(recentIds)?recentIds:[]);
  const random=rng(seed);
  const preferred=pool.filter(q=>!recent.has(q.id)),fallback=pool.filter(q=>recent.has(q.id));
  const balanced=list=>{
   const buckets=[1,2,3].map(d=>shuffled(list.filter(q=>q.difficulty===d),random));
   const pattern=[0,1,0,2,1],out=[];
   while(buckets.some(x=>x.length)){
    let progressed=false;
    for(const n of pattern)if(buckets[n].length){out.push(buckets[n].shift());progressed=true}
    if(!progressed)break;
   }
   return out;
  };
  const cards=cleanPractice(practice).cards;
  const reviewMax=Math.min(3,Math.floor(limit/3));
  const due=preferred.filter(q=>cards[q.id]?.dueAt>0&&cards[q.id].dueAt<=now)
   .sort((a,b)=>cards[b.id].mistakes-cards[a.id].mistakes||cards[a.id].dueAt-cards[b.id].dueAt||a.id.localeCompare(b.id));
  const selected=due.slice(0,reviewMax),selectedIds=new Set(selected.map(q=>q.id));
  // Target fresh questions about weak skills and commonly confused answers.
  // Never inflate the review quota or repeat the immediately previous session.
  const weakSkills=new Map(),confusedGlyphs=new Map();
  for(const [id,record] of Object.entries(cards)){
   if(record.step!==0||record.mistakes<1)continue;
   const original=byId.get(id);if(!original||original.stage!==stage)continue;
   weakSkills.set(original.skill,(weakSkills.get(original.skill)||0)+Math.min(5,record.mistakes));
   for(const [wrong,n] of Object.entries(record.confusions)){
    const glyph=original.choices.find(x=>x.id===wrong)?.glyph;
    if(glyph)confusedGlyphs.set(glyph,(confusedGlyphs.get(glyph)||0)+n);
   }
  }
  const weakScore=q=>{
   const answer=q.choices.find(x=>x.id===q.correctAnswer)?.glyph;
   return (weakSkills.get(q.skill)||0)*3+(confusedGlyphs.get(answer)||0)*5;
  };
  const focused=preferred.filter(q=>!selectedIds.has(q.id)&&
   !(cards[q.id]?.dueAt>0&&cards[q.id].dueAt<=now)&&weakScore(q)>0)
   .sort((a,b)=>weakScore(b)-weakScore(a)||a.id.localeCompare(b.id))
   .slice(0,reviewMax-selected.length);
  for(const q of focused)selectedIds.add(q.id);
  const chosen=[...selected,...focused,...balanced(preferred.filter(q=>!selectedIds.has(q.id))),
   ...balanced(fallback)].slice(0,limit);
  return Object.freeze({stage,questions:Object.freeze(chosen),total:chosen.length,ids:Object.freeze(chosen.map(q=>q.id))});
 }

 // New, independent written-practice evidence; never alter old progress or rewards.
 const DAY=86400000,intervals=Object.freeze([1,3,7,14]);
 const safe=o=>o&&typeof o==='object'&&!Array.isArray(o)?o:{};
 const int=(n,max)=>Number.isInteger(n)?Math.max(0,Math.min(max,n)):0;
 const time=n=>Number.isFinite(n)&&n>=0?Math.trunc(n):0;
 function cleanPractice(raw){
  const source=safe(raw),cards=Object.create(null),sessions=[];
  for(const [id,row] of Object.entries(safe(source.cards)).slice(0,650)){
   const q=byId.get(id);if(!q||!row||typeof row!=='object'||Array.isArray(row))continue;
   const confusions=Object.create(null);
   for(const [choice,n] of Object.entries(safe(row.confusions)).slice(0,8))
    if(q.choices.some(c=>c.id===choice&&choice!==q.correctAnswer)&&Number.isInteger(n)&&n>0)
     confusions[choice]=int(n,999);
   cards[id]=Object.freeze({step:int(row.step,4),attempts:int(row.attempts,9999),
    correct:int(row.correct,9999),mistakes:int(row.mistakes,9999),lastAt:time(row.lastAt),
    dueAt:time(row.dueAt),confusions:Object.freeze(confusions)});
  }
  for(const s of (Array.isArray(source.sessions)?source.sessions:[]).slice(-10))
   if(s&&banks.has(s.stage)&&Number.isInteger(s.total)&&s.total>=1&&s.total<=12&&
      Number.isInteger(s.correct)&&s.correct>=0&&s.correct<=s.total)
    sessions.push(Object.freeze({stage:s.stage,total:s.total,correct:s.correct,at:time(s.at)}));
  return Object.freeze({schema:1,cards:Object.freeze(cards),sessions:Object.freeze(sessions)});
 }
 function recordPractice(raw,{stage,answers=[],at=Date.now()}={}){
  const history=cleanPractice(raw),when=time(at),found=new Set(),valid=[];
  if(!banks.has(stage)||!Array.isArray(answers)||answers.length<1||answers.length>12||!when)return history;
  for(const a of answers){
   const q=byId.get(a?.id);
   if(!q||q.stage!==stage||found.has(q.id)||typeof a.firstTryCorrect!=='boolean')return history;
   if(!a.firstTryCorrect&&a.wrongChoiceId!=null&&
    !q.choices.some(c=>c.id===a.wrongChoiceId&&c.id!==q.correctAnswer))return history;
   found.add(q.id);valid.push(a);
  }
  const cards={...history.cards};let correct=0;
  for(const a of valid){
   const before=cards[a.id]||{step:0,attempts:0,correct:0,mistakes:0,confusions:{}};
   const pass=a.firstTryCorrect;if(pass)correct++;
   const step=pass?Math.min(4,before.step+1):0,confusions={...before.confusions};
   if(!pass&&a.wrongChoiceId)confusions[a.wrongChoiceId]=Math.min(999,(confusions[a.wrongChoiceId]||0)+1);
   cards[a.id]=Object.freeze({step,attempts:Math.min(9999,before.attempts+1),
    correct:Math.min(9999,before.correct+(pass?1:0)),
    mistakes:Math.min(9999,before.mistakes+(pass?0:1)),
    lastAt:when,dueAt:when+DAY*intervals[Math.max(0,step-1)],confusions:Object.freeze(confusions)});
  }
  return Object.freeze({schema:1,cards:Object.freeze(cards),
   sessions:Object.freeze([...history.sessions,{stage,total:valid.length,correct,at:when}].slice(-10))});
 }
 function practiceSummary(raw,{stage=null,now=Date.now()}={}){
  const history=cleanPractice(raw),all=Object.entries(history.cards).filter(([id])=>!stage||byId.get(id).stage===stage);
  const sessions=history.sessions.filter(s=>!stage||s.stage===stage),t=time(now);
  const attempts=sessions.reduce((n,s)=>n+s.total,0),correct=sessions.reduce((n,s)=>n+s.correct,0);
  const days=new Set(sessions.map(s=>Math.floor(s.at/DAY))).size;
  return Object.freeze({tracked:all.length,due:all.filter(([,c])=>c.dueAt>0&&c.dueAt<=t).length,
   weak:all.filter(([,c])=>c.mistakes>0&&c.step===0).length,lessons:sessions.length,attempts,correct,
   accuracy:attempts?correct/attempts:null,distinctDays:days,mastery:attempts>=10&&days>=2&&correct/attempts>=.8,
   intervals});
 }

 // Stage20: non-rewarded written pre/post assessment from existing audited 600 questions.
 // Matched stages and difficulties, but distinct IDs; no listening, XP, hearts, or mastery mutation.
 const assessmentDomains=Object.freeze([
  Object.freeze({id:'letters',stages:Object.freeze(['arabic-letters-02','arabic-letters-06'])}),
  Object.freeze({id:'vowels',stages:Object.freeze(['arabic-harakat-01','arabic-harakat-02'])}),
  Object.freeze({id:'words',stages:Object.freeze(['arabic-word-syllables-01','arabic-word-quran-01'])}),
  Object.freeze({id:'expressions',stages:Object.freeze(['arabic-phrase-vocab-01','arabic-pattern-vocabulary-01'])})
 ]);
 const ASSESSMENT_DAY=86400000;
 function assessmentQuestions(phase){
  if(phase!=='pre'&&phase!=='post')return null;
  const selected=[];
  for(const group of assessmentDomains)for(let i=0;i<group.stages.length;i++){
   const stage=group.stages[i],all=banks.get(stage)||[];
   const candidates=[1,2,3].map(level=>all.filter(q=>q.difficulty===level&&!q.audioRef)
    .sort((a,b)=>a.id.localeCompare(b.id)));
   const preferred=candidates[(i+assessmentDomains.indexOf(group))%3];
   const pairs=[preferred,...candidates].find(x=>x.length>=2);
   if(!pairs)throw Error('DEEN_ASSESSMENT_POOL_TOO_SMALL:'+stage);
   selected.push(Object.freeze({domain:group.id,id:(phase==='pre'?pairs[0]:pairs[1]).id,
    question:phase==='pre'?pairs[0]:pairs[1]}));
  }
  if(selected.length!==8||new Set(selected.map(x=>x.id)).size!==8)
   throw Error('DEEN_ASSESSMENT_DUPLICATE_QUESTION');
  return Object.freeze(selected);
 }
 function assessmentRead(raw){
  const obj=safe(raw),results={};
  for(const phase of ['pre','post']){
   const row=obj[phase],expected=assessmentQuestions(phase);
   if(!row||!Number.isSafeInteger(row.at)||row.at<=0||
      !Number.isInteger(row.completedLessons)||row.completedLessons<0||row.completedLessons>25||
      !Array.isArray(row.answers)||row.answers.length!==8)continue;
   if(!expected.every((x,i)=>row.answers[i]?.id===x.id&&
     x.question.choices.some(c=>c.id===row.answers[i]?.choiceId)))continue;
   const answers=expected.map((x,i)=>Object.freeze({id:x.id,choiceId:row.answers[i].choiceId}));
   results[phase]=Object.freeze({at:row.at,completedLessons:row.completedLessons,answers:Object.freeze(answers)});
  }
  if(results.post&&!results.pre)delete results.post;
  return Object.freeze({schema:1,pre:results.pre||null,post:results.post||null});
 }
 function assessmentCanPost(raw,{at=Date.now(),completedLessons=0}={}){
  const h=assessmentRead(raw);
  return !!h.pre&&!h.post&&(completedLessons>h.pre.completedLessons||
   (Number.isSafeInteger(at)&&at>=h.pre.at+ASSESSMENT_DAY));
 }
 function assessmentSave(raw,{phase,answers,at=Date.now(),completedLessons=0}={}){
  const h=assessmentRead(raw),expected=assessmentQuestions(phase);
  if(!expected||!Array.isArray(answers)||answers.length!==8||!Number.isSafeInteger(at)||
   at<=0||!Number.isInteger(completedLessons)||completedLessons<0||completedLessons>25)return h;
  if(phase==='pre'&&h.pre)return h;
  if(phase==='post'&&!assessmentCanPost(h,{at,completedLessons}))return h;
  if(!expected.every((item,i)=>answers[i]?.id===item.id&&
   item.question.choices.some(c=>c.id===answers[i]?.choiceId)))return h;
  const result={at,completedLessons,answers:answers.map(({id,choiceId})=>({id,choiceId}))};
  return assessmentRead({...h,[phase]:result});
 }
 function assessmentSummary(raw){
  const h=assessmentRead(raw);
  const grade=phase=>{
   if(!h[phase])return null;
   const items=assessmentQuestions(phase);
   const domains=assessmentDomains.map(g=>{
    const indexes=items.flatMap((x,i)=>x.domain===g.id?[i]:[]);
    const correct=indexes.filter(i=>h[phase].answers[i].choiceId===items[i].question.correctAnswer).length;
    return Object.freeze({id:g.id,correct,total:2});
   });
   return Object.freeze({at:h[phase].at,total:8,
    correct:domains.reduce((sum,g)=>sum+g.correct,0),domains:Object.freeze(domains)});
  };
  const pre=grade('pre'),post=grade('post');
  const delta=pre&&post?post.correct-pre.correct:null;
  return Object.freeze({schema:1,pre,post,delta,
   disclaimer:'Written recognition only; changes do not establish causal learning gains or recitation ability.'});
 }
 const assessment=Object.freeze({version:1,domains:assessmentDomains,questionCount:8,
  questions:assessmentQuestions,read:assessmentRead,canPost:assessmentCanPost,
  save:assessmentSave,summary:assessmentSummary});
 const poolFor=stage=>Object.freeze([...(banks.get(stage)||[])]);
 window.DEEN_ARABIC_QUESTIONS_V2=Object.freeze({
  version:2,locales:languages,validateBank,registerPack,createSession,poolFor,cleanPractice,recordPractice,practiceSummary,assessment,
  stats:()=>Object.freeze({packs:packs.size,questions:byId.size,stages:banks.size}),
  get:id=>byId.get(id)||null
 });
})();