/* DEEN Arabic phase 12 — evidence-limited adaptive written practice.
 * No synthetic grades: only completed lessons, observed mistakes and actual review history.
 * The algorithm never unlocks lessons, changes XP or certifies Quran recitation.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_ADAPTIVE)return;
 const PHRASES=window.DEEN_ARABIC_PHRASES,PATTERNS=window.DEEN_ARABIC_PATTERNS;
 if(!PHRASES||!PATTERNS)throw Error('DEEN_ARABIC_ADAPTIVE_DATA_MISSING');
 const cards=Object.freeze([...PHRASES.reviewCards,...PATTERNS.reviewCards]);
 const cardIds=Object.freeze(cards.map(c=>c.id));
 const validCard=new Set(cardIds);
 const integer=(n,max)=>Number.isInteger(n)?Math.max(0,Math.min(max,n)):0;
 const safeId=v=>typeof v==='string'&&v.length<128?v:null;
 const clean=(raw)=>{
  const sessions=Object.create(null);
  const rows=raw&&typeof raw==='object'&&!Array.isArray(raw)&&raw.sessions&&typeof raw.sessions==='object'?raw.sessions:{};
  for(const [id,s] of Object.entries(rows).slice(0,150)){
   if(!safeId(id)||!s||typeof s!=='object')continue;
   const seen=Array.isArray(s.missedCardIds)?s.missedCardIds.filter(x=>validCard.has(x)).slice(0,15):[];
   sessions[id]=Object.freeze({
    attempts:integer(s.attempts,999),
    cleanRunStreak:integer(s.cleanRunStreak,999),
    lastMistakes:integer(s.lastMistakes,100),
    questions:integer(s.questions,100),
    missedCardIds:Object.freeze([...new Set(seen)]),
    updatedAt:Number.isFinite(s.updatedAt)&&s.updatedAt>=0?s.updatedAt:0
   });
  }
  const lastLesson=typeof raw?.lastLesson==='string'&&sessions[raw.lastLesson]?raw.lastLesson:null;
  return Object.freeze({schema:1,lastLesson,globalCleanStreak:integer(raw?.globalCleanStreak,999),sessions:Object.freeze(sessions)});
 };
 const recordLesson=(raw,{lessonId,questions,missedIds=[],at=Date.now()}={})=>{
  const state=clean(raw),id=safeId(lessonId);
  if(!id)return state;
  const previous=state.sessions[id];
  const n=integer(questions,100);
  const missed=[...new Set(Array.isArray(missedIds)?missedIds.filter(v=>typeof v==='string'&&v.length<128):[])];
  const cleanRun=missed.length===0&&n>0;
  const session=Object.freeze({
   attempts:Math.min(999,(previous?.attempts||0)+1),
   cleanRunStreak:cleanRun?Math.min(999,(previous?.cleanRunStreak||0)+1):0,
   lastMistakes:Math.min(n,missed.length),questions:n,
   missedCardIds:Object.freeze(missed.filter(x=>validCard.has(x))),
   updatedAt:Number.isFinite(at)&&at>=0?at:Date.now()
  });
  return Object.freeze({schema:1,lastLesson:id,globalCleanStreak:cleanRun?Math.min(999,state.globalCleanStreak+1):0,sessions:Object.freeze({...state.sessions,[id]:session})});
 };
 function suggest({history,reviewCards={},now=Date.now(),limit=3,nextLesson=null}={}){
  const state=clean(history),recent=state.lastLesson?state.sessions[state.lastLesson]:null;
  const selected=new Set(recent?.missedCardIds||[]);
  const review=reviewCards&&typeof reviewCards==='object'?reviewCards:{};
  const due=[],weak=[];
  for(const card of cards){
   const r=review[card.id];if(!r||typeof r!=='object')continue;
   const mistakes=integer(r.mistakes,999),step=integer(r.step,5);
   const isDue=Number.isFinite(r.dueAt)&&r.dueAt<=now;
   if(isDue)due.push({id:card.id,score:500+mistakes*9-step*3});
   else if(mistakes>0)weak.push({id:card.id,score:200+mistakes*9-step*3});
  }
  for(const c of due)selected.add(c.id);
  for(const c of weak)selected.add(c.id);
  const ranked=[...selected].filter(x=>validCard.has(x)).map(id=>{
   const record=review[id]||{},mistakes=integer(record.mistakes,999),step=integer(record.step,5);
   const due=Number.isFinite(record.dueAt)&&record.dueAt<=now;
   const recentMiss=!!recent?.missedCardIds.includes(id);
   return {id,score:(recentMiss?1000:0)+(due?500:0)+mistakes*9-step*3};
  }).sort((a,b)=>b.score-a.score||cardIds.indexOf(a.id)-cardIds.indexOf(b.id));
  const cardLimit=Math.max(0,Math.min(6,integer(limit,6)));
  const recommended=ranked.slice(0,cardLimit).map(x=>x.id);
  const cleanStreak=state.globalCleanStreak||0;
  return Object.freeze({
   version:1,lastLesson:state.lastLesson,lastMistakes:recent?.lastMistakes??null,
   lastQuestions:recent?.questions??null,cleanRunStreak:cleanStreak,
   cards:Object.freeze(recommended),available:recommended.length,
   // Next lesson is already checked by the existing curriculum's sequential unlock.
   nextLesson:nextLesson&&Number.isInteger(nextLesson.index)&&nextLesson.unlocked===true?
    Object.freeze({id:nextLesson.id,index:nextLesson.index}):null,
   mode:recommended.length?'reinforce':cleanStreak>=2?'advance':'practice',
   rationale:recommended.length?'observed-incorrect-or-due':cleanStreak>=2?'two-clean-runs':'ordinary-next-lesson',
   limitations:'Written practice recommendations, not independently assessed proficiency.'
  });
 }
 const ui=Object.freeze({
  tr:{heading:'Akıllı Pekiştirme',intro:'Yanlış cevaplarını ve zamanı gelen kelimeleri temel alan kısa bir yazılı tekrar turu.',ready:'Pekiştirme Turunu Başlat',count:'Önerilen kart',noCards:'Şu anda pekiştirilecek kelime yok.',clean:'Üst üste hatasız ders',next:'Sıradaki derse geçebilirsin',continue:'Önerilen Derse Geç',finished:'Pekiştirme turu tamamlandı!',mistake:'Bu derste ilk denemede zorlandığın soru',noMistake:'Bu dersi hatasız tamamladın.',note:'Yalnızca gerçek çalışma kayıtları kullanılır. Sesli telaffuz ve tecvid ölçülmez.',back:'Derslere Dön'},
  en:{heading:'Smart Practice',intro:'A short written review based on mistakes and cards due.',ready:'Start Focused Review',count:'Suggested cards',noCards:'No cards require reinforcement right now.',clean:'Consecutive error-free lessons',next:'Ready for the next lesson',continue:'Go to Suggested Lesson',finished:'Focused review completed!',mistake:'Questions missed on first try in this lesson',noMistake:'You finished this lesson without mistakes.',note:'Only real practice records are used. Pronunciation and Tajwid are not assessed.',back:'Back to Lessons'},
  ar:{heading:'تدريب مركّز',intro:'مراجعة كتابية قصيرة وفق الأخطاء والبطاقات المستحقة.',ready:'ابدأ المراجعة المركّزة',count:'بطاقات مقترحة',noCards:'لا توجد بطاقات تحتاج للتعزيز حاليًا.',clean:'دروس متتالية دون أخطاء',next:'يمكنك متابعة الدرس التالي',continue:'الدرس التالي المقترح',finished:'اكتملت المراجعة المركّزة!',mistake:'أسئلة أخطأت فيها من المحاولة الأولى',noMistake:'أنهيت هذا الدرس بلا أخطاء.',note:'تعتمد النتائج على التدريب الفعلي ولا تقيس التلاوة أو التجويد.',back:'العودة للدروس'},
  de:{heading:'Gezielte Vertiefung',intro:'Kurze schriftliche Wiederholung bei Fehlern und fälligen Karten.',ready:'Vertiefung starten',count:'Empfohlene Karten',noCards:'Derzeit ist keine zusätzliche Wiederholung nötig.',clean:'Fehlerfreie Lektionen in Folge',next:'Bereit für die nächste Lektion',continue:'Zur empfohlenen Lektion',finished:'Vertiefung abgeschlossen!',mistake:'Beim ersten Versuch falsch beantwortete Fragen',noMistake:'Du hast diese Lektion fehlerfrei beendet.',note:'Nur echte Übungsdaten. Aussprache und Tadschwid werden nicht bewertet.',back:'Zurück zu den Lektionen'},
  fr:{heading:'Révision ciblée',intro:'Courte révision écrite selon les erreurs et les cartes dues.',ready:'Commencer la révision ciblée',count:'Cartes conseillées',noCards:'Aucune carte ne nécessite de renforcement maintenant.',clean:'Leçons réussies sans erreur de suite',next:'Prêt pour la prochaine leçon',continue:'Aller à la prochaine leçon',finished:'Révision ciblée terminée !',mistake:'Questions manquées au premier essai',noMistake:'Tu as terminé cette leçon sans erreur.',note:'Fondé sur les exercices réels ; ne mesure ni récitation ni tajwid.',back:'Retour aux leçons'}
 });
 window.DEEN_ARABIC_ADAPTIVE=Object.freeze({version:1,cardIds,clean,recordLesson,suggest,ui});
})();
