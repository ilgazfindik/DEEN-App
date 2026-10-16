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
 function createSession(stage,{count=10,recentIds=[],seed=Date.now()}={}){
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
  const chosen=[...balanced(preferred),...balanced(fallback)].slice(0,limit);
  return Object.freeze({stage,questions:Object.freeze(chosen),total:chosen.length,ids:Object.freeze(chosen.map(q=>q.id))});
 }
 const poolFor=stage=>Object.freeze([...(banks.get(stage)||[])]);
 window.DEEN_ARABIC_QUESTIONS_V2=Object.freeze({
  version:2,locales:languages,validateBank,registerPack,createSession,poolFor,
  stats:()=>Object.freeze({packs:packs.size,questions:byId.size,stages:banks.size}),
  get:id=>byId.get(id)||null
 });
})();