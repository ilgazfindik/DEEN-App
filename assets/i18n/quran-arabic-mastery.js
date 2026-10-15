/* DEEN Arabic Phase 10 — honest, local-only practice mastery analytics.
 * Estimates practice intervals; does NOT claim real linguistic mastery or recitation skills.
 * Reads phase 8/9 review data without modifying legacy lesson or review records. */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_MASTERY)return;
 const phrases=window.DEEN_ARABIC_PHRASES,patterns=window.DEEN_ARABIC_PATTERNS;
 if(!phrases||!patterns)throw Error('DEEN_ARABIC_MASTERY_REQUIRES_PRIOR_CURRICULA');
 const groups=Object.freeze([
  Object.freeze({id:'phrase-vocab',titleKey:'masteryGroupPhraseVocab',cards:phrases.lessons[0].items}),
  Object.freeze({id:'phrase-context',titleKey:'masteryGroupPhrases',cards:phrases.lessons[1].items}),
  Object.freeze({id:'pattern-vocab',titleKey:'masteryGroupPatternVocab',cards:patterns.lessons[0].items}),
  Object.freeze({id:'pattern-context',titleKey:'masteryGroupPatterns',cards:patterns.lessons[1].items})
 ]);
 const cardList=Object.freeze(groups.flatMap(g=>g.cards.map(card=>Object.freeze({
  id:card.id,glyph:card.glyph,gloss:card.gloss,reference:card.reference,groupId:g.id
 }))));
 if(cardList.length!==15||new Set(cardList.map(x=>x.id)).size!==15)throw Error('DEEN_ARABIC_MASTERY_CARD_SET_MISMATCH');
 const intervalLabels=Object.freeze([1,3,7,14,30]);
 const levelFor=record=>{
  if(!record)return 'notStarted';
  if(record.lastResult==='again'||record.lastResult==='retry'||record.step<1)return 'needsPractice';
  if(record.step>=3)return 'strengthening';
  return 'learning';
 };
 const integer=(v,min,max)=>Number.isInteger(v)?Math.max(min,Math.min(max,v)):min;
 const parse=(raw)=>{
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return Object.create(null);
  const source=raw.cards&&typeof raw.cards==='object'&&!Array.isArray(raw.cards)?raw.cards:raw;
  const result=Object.create(null);
  for(const c of cardList){
   const r=source[c.id];
   if(!r||typeof r!=='object'||Array.isArray(r)||!Number.isFinite(r.dueAt)||r.dueAt<0||!Number.isInteger(r.step)||r.step<0||r.step>5)continue;
   result[c.id]=Object.freeze({
    step:r.step,dueAt:r.dueAt,
    mistakes:integer(r.mistakes,0,999),
    attempts:integer(r.attempts,0,9999),
    lastResult:['good','retry','again'].includes(r.lastResult)?r.lastResult:'unknown'
   });
  }
  return result;
 };
 function analyze(raw,completedWritten=0,totalWritten=25,at=Date.now()){
  const now=Number.isFinite(at)?at:Date.now(),records=parse(raw),stats={notStarted:0,needsPractice:0,learning:0,strengthening:0},counts=[];
  let practiced=0,due=0,weak=0,nextDueAt=null;
  for(const card of cardList){
   const entry=records[card.id]||null,level=levelFor(entry),isDue=!!entry&&entry.dueAt<=now,isWeak=!!entry&&entry.mistakes>0;
   stats[level]++;
   if(entry){
    practiced++;if(isDue)due++;if(isWeak)weak++;
    if(entry.dueAt>now&&(nextDueAt===null||entry.dueAt<nextDueAt))nextDueAt=entry.dueAt;
   }
   counts.push(Object.freeze({...card,level,due:isDue,weak:isWeak,step:entry?.step||0,mistakes:entry?.mistakes||0,attempts:entry?.attempts||0,dueAt:entry?.dueAt??null}));
  }
  const groupsSummary=Object.freeze(groups.map(g=>{
   const cards=counts.filter(x=>x.groupId===g.id);
   return Object.freeze({
    id:g.id,titleKey:g.titleKey,total:cards.length,practiced:cards.filter(x=>x.level!=='notStarted').length,
    due:cards.filter(x=>x.due).length,weak:cards.filter(x=>x.weak).length,
    strengthening:cards.filter(x=>x.level==='strengthening').length
   });
  }));
  return Object.freeze({
   schema:1,total:cardList.length,practiced,due,weak,nextDueAt,
   lessonCompleted:integer(completedWritten,0,Math.max(0,totalWritten)),lessonTotal:Math.max(0,totalWritten),
   levels:Object.freeze(stats),
   groupSummary:groupsSummary,
   cards:Object.freeze(counts),
   // Interval stage is a progress indicator, not a claim of verified mastery.
   retainedPracticePct:Math.round(100*counts.reduce((sum,card)=>sum+Math.min(card.step,5),0)/(cardList.length*5))
  });
 }
 window.DEEN_ARABIC_MASTERY=Object.freeze({
  version:1,cardList,groups,intervalLabels,analyze,parse,levelFor,
  source:'local written practice only',
  limitations:'Interval progress does not measure fluency, Tajwid, spoken Arabic or a certified level.'
 });
})();
