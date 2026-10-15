/* DEEN Quran Arabic — Phase 15: targeted written-exam remediation.
 * Replays only actually missed items from the latest checkpoint, verifies the
 * original question set, and never edits lesson, mastery, XP or exam scores.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_REMEDIATION)return;
 const exam=window.DEEN_ARABIC_CHECKPOINT;
 if(!exam||exam.version!==1)throw Error('DEEN_REMEDIATION_REQUIRES_CHECKPOINT');
 const empty=Object.freeze({key:null,total:0,complete:0,remaining:0,topics:Object.freeze([]),questions:Object.freeze([]),done:Object.freeze([]),finished:false});
 function plan(raw){
  const history=exam.history(raw),last=history.attempts[history.attempts.length-1];
  if(!last||!Array.isArray(last.topics)||!Array.isArray(last.missedIds))return empty;
  const attempt=Math.max(0,history.nextAttempt-1);
  const bank=exam.build(attempt);
  const needed=new Set(last.topics.filter(t=>t?.needsReview===true).map(t=>t.id));
  const missed=new Set(last.missedIds);
  const questions=bank.filter(q=>needed.has(q.domain)&&missed.has(q.id));
  const sourceIds=new Set(last.topics.filter(t=>needed.has(t.id)).flatMap(t=>Array.isArray(t.missed)?t.missed:[]));
  if(!questions.every(q=>sourceIds.has(q.id)))return empty;
  const key=[attempt,last.at,last.correct,questions.map(q=>q.id).join(',')].join(':');
  const topics=last.topics.filter(t=>needed.has(t.id)).map(topic=>Object.freeze({
   id:topic.id,total:questions.filter(q=>q.domain===topic.id).length,
   correct:topic.correct,lessonIndex:topic.lessonIndex
  }));
  return Object.freeze({key,total:questions.length,complete:0,remaining:questions.length,
   topics:Object.freeze(topics),questions:Object.freeze(questions),done:Object.freeze([]),finished:questions.length===0});
 }
 function progress(p,raw){
  if(!p?.key)return empty;
  const doneIds=raw?.key===p.key&&Array.isArray(raw.done)?new Set(raw.done.filter(id=>typeof id==='string')):new Set();
  const done=p.questions.filter(q=>doneIds.has(q.id)).map(q=>q.id);
  const completed=new Set(done);
  const topics=p.topics.map(t=>Object.freeze({...t,done:p.questions.filter(q=>q.domain===t.id&&completed.has(q.id)).length}));
  return Object.freeze({...p,complete:done.length,remaining:p.total-done.length,done:Object.freeze(done),
   topics:Object.freeze(topics),finished:p.total>0&&done.length===p.total});
 }
 function mark(p,raw,id,correct){
  const state=progress(p,raw);
  if(!state.key||correct!==true||!state.questions.some(q=>q.id===id)||state.done.includes(id))return Object.freeze({schema:1,key:state.key,done:state.done});
  return Object.freeze({schema:1,key:state.key,done:Object.freeze([...state.done,id])});
 }
 function compare(raw){
  const a=exam.history(raw).attempts;
  if(a.length<2)return null;
  const previous=a[a.length-2],current=a[a.length-1];
  const topics=current.topics.map(topic=>{
   const prior=previous.topics.find(t=>t.id===topic.id);
   return Object.freeze({id:topic.id,previous:prior?.correct??null,current:topic.correct,
    delta:Number.isInteger(prior?.correct)?topic.correct-prior.correct:null});
  });
  return Object.freeze({previous:previous.correct,current:current.correct,delta:current.correct-previous.correct,
   topics:Object.freeze(topics),basis:'two consecutive 20-question written assessments; questions rotate'});
 }
 const ui=Object.freeze({
  tr:{remedyHeading:'Kişisel Eksik Tamamlama',remedyIntro:'Son değerlendirmede zorlandığın konulardaki yanlış soruları yeniden çöz.',remedyStart:'Eksiklerimi Çalış',remedyResume:'Kaldığım Yerden Devam Et',remedyProgress:'Tamamlanan tekrar',remedyTopic:'Tekrar edilecek konu',remedyEmpty:'Bu değerlendirmede öncelikli eksik konu yok.',remedyBlocked:'Önce yazılı bitirme değerlendirmesini tamamla.',remedyQuestion:'Doğru Arapça biçimi seç.',remedyBuild:'Parçaları doğru sırayla diz.',remedyWrong:'Henüz doğru değil. Tekrar dene.',remedyCorrect:'Doğru! Bu kartı pekiştirdin.',remedyNext:'Sonraki Kart',remedyDone:'Eksik Tamamlama Bitti!',remedyRetry:'Yeni Değerlendirme Yap',remedyBack:'Sonuçlara Dön',remedyReset:'Yeniden Kur',remedyTrend:'Son İki Değerlendirme',remedyPrevious:'Önceki',remedyCurrent:'Son',remedyChange:'Değişim',remedyIncrease:'Artış',remedyDecrease:'Azalış',remedySame:'Değişmedi',remedyNote:'Bu yazılı tekrar, yeni sınavın puanını otomatik artırmaz. Sesli okuma veya tecvid ölçülmez.',remedyCard:'Kart'},
  en:{remedyHeading:'Personal Practice Plan',remedyIntro:'Retry the questions you missed in weaker topics on your latest checkpoint.',remedyStart:'Practice My Weak Topics',remedyResume:'Resume Practice',remedyProgress:'Cards reinforced',remedyTopic:'Review topic',remedyEmpty:'No priority gaps in your latest checkpoint.',remedyBlocked:'Complete the written checkpoint first.',remedyQuestion:'Choose the correct Arabic form.',remedyBuild:'Put the word parts in order.',remedyWrong:'Not quite. Try again.',remedyCorrect:'Correct! You reinforced this card.',remedyNext:'Next Card',remedyDone:'Practice Plan Complete!',remedyRetry:'Take Another Checkpoint',remedyBack:'Back to Results',remedyReset:'Reset Parts',remedyTrend:'Last Two Checkpoints',remedyPrevious:'Previous',remedyCurrent:'Latest',remedyChange:'Change',remedyIncrease:'Increase',remedyDecrease:'Decrease',remedySame:'No change',remedyNote:'Written practice never changes your previous score. Recitation and Tajwid are not assessed.',remedyCard:'Card'},
  ar:{remedyHeading:'خطة معالجة نقاط الضعف',remedyIntro:'أعد حل الأسئلة التي أخطأت فيها ضمن الموضوعات الأضعف.',remedyStart:'راجع نقاط الضعف',remedyResume:'تابع المراجعة',remedyProgress:'بطاقات تمت مراجعتها',remedyTopic:'موضوع المراجعة',remedyEmpty:'لا توجد نقاط ضعف ذات أولوية في آخر تقييم.',remedyBlocked:'أكمل التقييم الكتابي أولًا.',remedyQuestion:'اختر الشكل العربي الصحيح.',remedyBuild:'رتّب أجزاء الكلمة.',remedyWrong:'ليست صحيحة بعد. حاول مرة أخرى.',remedyCorrect:'صحيح! راجعت هذه البطاقة.',remedyNext:'البطاقة التالية',remedyDone:'اكتملت خطة المراجعة!',remedyRetry:'ابدأ تقييمًا جديدًا',remedyBack:'العودة إلى النتائج',remedyReset:'أعد الترتيب',remedyTrend:'آخر تقييمين',remedyPrevious:'السابق',remedyCurrent:'الأخير',remedyChange:'التغيّر',remedyIncrease:'تحسّن',remedyDecrease:'انخفاض',remedySame:'لم يتغير',remedyNote:'لا تغيّر المراجعة نتيجة التقييم السابق، ولا تقيس التلاوة أو التجويد.',remedyCard:'بطاقة'},
  de:{remedyHeading:'Mein persönlicher Übungsplan',remedyIntro:'Bearbeite falsche Fragen aus den schwächeren Bereichen deines letzten Tests.',remedyStart:'Schwächen üben',remedyResume:'Übung fortsetzen',remedyProgress:'Geübte Karten',remedyTopic:'Wiederholungsthema',remedyEmpty:'Im letzten Test keine vorrangigen Schwächen.',remedyBlocked:'Schließe zuerst den schriftlichen Test ab.',remedyQuestion:'Wähle die richtige arabische Form.',remedyBuild:'Setze die Wortteile in die richtige Reihenfolge.',remedyWrong:'Noch nicht richtig. Versuch es erneut.',remedyCorrect:'Richtig! Karte gefestigt.',remedyNext:'Nächste Karte',remedyDone:'Übungsplan abgeschlossen!',remedyRetry:'Neuen Test starten',remedyBack:'Zurück zum Ergebnis',remedyReset:'Teile zurücksetzen',remedyTrend:'Letzte zwei Tests',remedyPrevious:'Vorher',remedyCurrent:'Aktuell',remedyChange:'Veränderung',remedyIncrease:'Verbesserung',remedyDecrease:'Rückgang',remedySame:'Unverändert',remedyNote:'Übungen verändern keine alten Testergebnisse. Rezitation und Tadschwid werden nicht geprüft.',remedyCard:'Karte'},
  fr:{remedyHeading:'Mon programme de révision',remedyIntro:'Reprends les questions ratées dans les domaines faibles du dernier bilan.',remedyStart:'Réviser mes difficultés',remedyResume:'Continuer la révision',remedyProgress:'Cartes révisées',remedyTopic:'Domaine à revoir',remedyEmpty:'Aucune faiblesse prioritaire dans le dernier bilan.',remedyBlocked:'Termine d’abord le bilan écrit.',remedyQuestion:'Choisis la bonne forme arabe.',remedyBuild:'Assemble les parties dans le bon ordre.',remedyWrong:'Pas encore correct. Réessaie.',remedyCorrect:'Correct ! Carte révisée.',remedyNext:'Carte suivante',remedyDone:'Programme terminé !',remedyRetry:'Refaire un bilan',remedyBack:'Retour aux résultats',remedyReset:'Recommencer',remedyTrend:'Deux derniers bilans',remedyPrevious:'Avant',remedyCurrent:'Dernier',remedyChange:'Évolution',remedyIncrease:'Amélioration',remedyDecrease:'Baisse',remedySame:'Sans changement',remedyNote:'La révision ne modifie pas les notes passées. La récitation et le tajwid ne sont pas évalués.',remedyCard:'Carte'}
 });
 window.DEEN_ARABIC_REMEDIATION=Object.freeze({version:1,plan,progress,mark,compare,ui});
})();
