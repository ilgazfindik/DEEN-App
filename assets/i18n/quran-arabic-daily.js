/* DEEN Arabic phase 11 — device-local daily study plan.
 * Daily counts are actual written lesson completions and correct card reviews.
 * Durations are user preferences, never measured or guaranteed study time.
 * No background scheduling, notifications or audio claims.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_DAILY)return;
 const allowed=Object.freeze([5,10,15]);
 const localDay=(when=new Date())=>{
  const d=when instanceof Date?when:new Date(when);
  if(Number.isNaN(d.getTime()))return null;
  return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
 };
 const unique=items=>[...new Set(Array.isArray(items)?items.filter(x=>typeof x==='string'&&x.length>0&&x.length<120):[])];
 const safeMinutes=value=>allowed.includes(Number(value))?Number(value):10;
 const normalizeActivity=(raw,day=localDay())=>{
  const empty={day,lessons:[],reviews:[]};
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.day!==day)return Object.freeze(empty);
  return Object.freeze({day,lessons:Object.freeze(unique(raw.lessons).slice(0,50)),
   reviews:Object.freeze(unique(raw.reviews).slice(0,100))});
 };
 const mark=(raw,type,id,day=localDay())=>{
  const before=normalizeActivity(raw,day);
  if(!['lesson','review'].includes(type)||typeof id!=='string'||!id)return before;
  const key=type==='lesson'?'lessons':'reviews';
  return normalizeActivity({...before,[key]:unique([...before[key],id])},day);
 };
 function suggest(args={}){
  const minutes=safeMinutes(args.minutes);
  const activity=normalizeActivity(args.activity,args.day||localDay());
  const lessonCandidates=Array.isArray(args.lessons)?args.lessons:[];
  const next=lessonCandidates.find(l=>l&&typeof l.id==='string'&&Number.isInteger(l.index)&&l.unlocked===true&&!l.completed)||null;
  const due=unique(args.due||[]);
  const weak=unique(args.weak||[]).filter(id=>!due.includes(id));
  const availableCards=unique([...due,...weak]);
  const quotas={5:{lessons:1,reviews:2},10:{lessons:1,reviews:4},15:{lessons:2,reviews:6}}[minutes];
  const lessonQuota=next||activity.lessons.length?quotas.lessons:0;
  const reviewQuota=Math.min(quotas.reviews,availableCards.length+activity.reviews.length);
  const lessonDone=Math.min(lessonQuota,activity.lessons.length);
  const reviewDone=Math.min(reviewQuota,activity.reviews.length);
  const total=lessonQuota+reviewQuota;
  const remainingLesson=Math.max(0,lessonQuota-lessonDone);
  const remainingReviews=Math.max(0,reviewQuota-reviewDone);
  const cardsToStudy=unique([...due,...weak]).filter(id=>!activity.reviews.includes(id)).slice(0,remainingReviews);
  const completed=lessonDone+reviewDone;
  return Object.freeze({
   version:1,day:activity.day,minutes,lessonQuota,reviewQuota,
   lessonDone,reviewDone,total,completed,
   completionPct:total?Math.round(100*completed/total):100,
   dueCount:due.length,weakCount:weak.length,
   remainingLesson,remainingReviews,
   nextLesson:remainingLesson&&next?Object.freeze({id:next.id,index:next.index}):null,
   cardsToStudy:Object.freeze(cardsToStudy),
   isRestDay:total===0,
   hasTasksLeft:completed<total,
   // This is a study suggestion, not an assessment of actual learning effectiveness.
   source:'local lesson completions and written practice only'
  });
 }
 const ui=Object.freeze({"tr":{"dailyHeading":"Bugünkü Arapça Planım","dailyIntro":"Gerçek ders ve tekrar ilerlemene göre günlük çalışma önerisi.","dailyOpen":"Günlük Planımı Aç","dailyBack":"Derslere Dön","dailyGoal":"Günlük odak","dailyMinutes":"dk","dailyLesson":"Yeni ders","dailyReview":"Kelime tekrarı","dailyDue":"Zamanı gelen","dailyWeak":"Zorlanılan","dailyProgress":"Bugünkü ilerleme","dailyCompleted":"Tamamlanan","dailyNext":"Önerilen sıradaki ders","dailyPractice":"Tekrara Başla","dailyWeakPractice":"Zorlandıklarını Çalış","dailyNoDue":"Bugün zamanı gelen kart yok.","dailyNoLesson":"Yeni yazılı ders kalmadı.","dailyDone":"Bugünkü hedef tamamlandı!","dailyLocal":"Bu cihazdaki kayıtlar kullanılır; otomatik eşitlenmez.","dailyDurationNote":"Dakika tercihtir, ölçülen çalışma süresi değildir.","dailyPick":"Odak süresini seç"},"en":{"dailyHeading":"Today's Arabic Plan","dailyIntro":"Daily study suggestion based on actual lessons and reviews.","dailyOpen":"Open Daily Plan","dailyBack":"Back to Lessons","dailyGoal":"Daily focus","dailyMinutes":"min","dailyLesson":"New lesson","dailyReview":"Word reviews","dailyDue":"Due","dailyWeak":"Difficult","dailyProgress":"Today's progress","dailyCompleted":"Completed","dailyNext":"Recommended next lesson","dailyPractice":"Start Reviews","dailyWeakPractice":"Practice Difficult Cards","dailyNoDue":"No cards are due right now.","dailyNoLesson":"No new written lessons are unlocked.","dailyDone":"Today's goal completed!","dailyLocal":"Data stays on this device; not synced automatically.","dailyDurationNote":"Minutes are a focus preference, not measured study time.","dailyPick":"Choose focus"},"ar":{"dailyHeading":"خطتي اليومية للعربية","dailyIntro":"اقتراح يومي حسب الدروس والمراجعات الحقيقية.","dailyOpen":"افتح خطتي","dailyBack":"العودة للدروس","dailyGoal":"الهدف اليومي","dailyMinutes":"دقائق","dailyLesson":"درس جديد","dailyReview":"مراجعة الكلمات","dailyDue":"مستحقة","dailyWeak":"صعبة","dailyProgress":"تقدم اليوم","dailyCompleted":"المكتمل","dailyNext":"الدرس المقترح التالي","dailyPractice":"ابدأ المراجعة","dailyWeakPractice":"راجع الكلمات الصعبة","dailyNoDue":"لا توجد بطاقات مستحقة الآن.","dailyNoLesson":"لا يوجد درس كتابي جديد متاح.","dailyDone":"أكملت هدف اليوم!","dailyLocal":"البيانات محفوظة على هذا الجهاز ولا تُزامن تلقائيًا.","dailyDurationNote":"الدقائق تفضيل وليست وقتًا مقاسًا.","dailyPick":"اختر المدة"},"de":{"dailyHeading":"Mein Arabisch-Tagesplan","dailyIntro":"Übungsvorschlag auf Basis deiner echten Lern- und Wiederholungsdaten.","dailyOpen":"Tagesplan öffnen","dailyBack":"Zurück zu Lektionen","dailyGoal":"Tagesziel","dailyMinutes":"Min","dailyLesson":"Neue Lektion","dailyReview":"Wiederholung","dailyDue":"Fällig","dailyWeak":"Schwierig","dailyProgress":"Fortschritt heute","dailyCompleted":"Erledigt","dailyNext":"Nächste Lektion","dailyPractice":"Karten wiederholen","dailyWeakPractice":"Schwierige Karten üben","dailyNoDue":"Keine Karten fällig.","dailyNoLesson":"Keine neue Schriftlektion verfügbar.","dailyDone":"Tagesziel geschafft!","dailyLocal":"Daten bleiben auf diesem Gerät; keine automatische Synchronisierung.","dailyDurationNote":"Minuten sind ein Fokusziel, keine gemessene Zeit.","dailyPick":"Fokus wählen"},"fr":{"dailyHeading":"Mon plan d'arabe du jour","dailyIntro":"Suggestion fondée sur les leçons et révisions réalisées.","dailyOpen":"Ouvrir mon plan","dailyBack":"Retour aux leçons","dailyGoal":"Objectif du jour","dailyMinutes":"min","dailyLesson":"Nouvelle leçon","dailyReview":"Révision des mots","dailyDue":"Dues","dailyWeak":"Difficiles","dailyProgress":"Progression du jour","dailyCompleted":"Terminées","dailyNext":"Prochaine leçon conseillée","dailyPractice":"Réviser","dailyWeakPractice":"Revoir les difficultés","dailyNoDue":"Aucune carte due.","dailyNoLesson":"Aucune nouvelle leçon écrite disponible.","dailyDone":"Objectif du jour atteint !","dailyLocal":"Données de cet appareil, sans synchronisation automatique.","dailyDurationNote":"Les minutes sont une préférence, pas une durée mesurée.","dailyPick":"Choisir une durée"}});
 window.DEEN_ARABIC_DAILY=Object.freeze({version:1,allowedMinutes:allowed,localDay,safeMinutes,normalizeActivity,mark,suggest,ui});
})();
