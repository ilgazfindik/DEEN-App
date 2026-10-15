/* DEEN Quran Arabic — Phase 17, non-monetary weekly goals.
 * Monday-Sunday calendar weeks are calculated in device-local civil time.
 * Rewards reflect real dated study, do not mint XP/elixirs and never change
 * existing lesson or review records.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_WEEKLY_GOALS)return;
 const WEEKLY=window.DEEN_ARABIC_WEEKLY;
 if(!WEEKLY||WEEKLY.version!==1)throw Error('DEEN_WEEKLY_GOALS_REQUIRES_WEEKLY');
 const tiers=Object.freeze([
  Object.freeze({id:'first-steps',days:2}),
  Object.freeze({id:'steady',days:4}),
  Object.freeze({id:'committed',days:6})
 ]);
 const bounded=(v,min,max)=>Math.max(min,Math.min(max,Number.isInteger(v)?v:min));
 const iso=(date)=>WEEKLY.dayKey(date);
 function weekStart(now=new Date()){
  const date=now instanceof Date?new Date(now):new Date(now);
  if(!Number.isFinite(date.getTime()))return null;
  date.setHours(12,0,0,0);
  date.setDate(date.getDate()-(date.getDay()+6)%7);
  return date;
 }
 function daysOf(start){
  return Object.freeze(Array.from({length:7},(_,i)=>{
   const date=new Date(start);date.setDate(start.getDate()+i);return iso(date);
  }));
 }
 function span(now=new Date()){
  const start=weekStart(now);if(!start)return null;
  const prev=new Date(start);prev.setDate(start.getDate()-7);
  const days=daysOf(start),previousDays=daysOf(prev);
  return Object.freeze({key:days[0],start:days[0],end:days[6],days,previousStart:previousDays[0],
   previousEnd:previousDays[6],previousDays});
 }
 const unique=xs=>[...new Set(Array.isArray(xs)?xs.filter(x=>typeof x==='string'&&x.length>0&&x.length<129):[])];
 function activity(log,daily,exams,dates,now){
  const journal=WEEKLY.clean(log),today=iso(now),rows=Array.isArray(dates)?dates:[];
  const dayToday=daily?.day===today?daily:null;
  const completedExams=Array.isArray(exams?.attempts)?exams.attempts:[];
  const buckets=rows.map(day=>{
   const entry=journal.days[day]||{lessons:[],reviews:[]};
   const lessons=unique([...entry.lessons,...(day===today?dayToday?.lessons||[]:[])]);
   const reviews=unique([...entry.reviews,...(day===today?dayToday?.reviews||[]:[])]);
   const assessments=completedExams.filter(x=>Number.isFinite(x?.at)&&x.at>=0&&
    Number.isInteger(x.correct)&&x.correct>=0&&x.correct<=20&&iso(x.at)===day).length;
   return Object.freeze({day,lessons:lessons.length,reviews:reviews.length,assessments,
    active:lessons.length+reviews.length+assessments>0});
  });
  return Object.freeze({days:Object.freeze(buckets),
   activeDays:buckets.filter(x=>x.active).length,
   lessons:buckets.reduce((n,x)=>n+x.lessons,0),
   reviews:buckets.reduce((n,x)=>n+x.reviews,0),
   assessments:buckets.reduce((n,x)=>n+x.assessments,0)});
 }
 function build({journal,daily,exams,now=new Date(),remainingWritten=0,reviewEligible=false}={}){
  const calendar=span(now);
  if(!calendar)return null;
  const current=activity(journal,daily,exams,calendar.days,now),
   previous=activity(journal,daily,exams,calendar.previousDays,now);
  // Targets are suggestions based on dated prior-week activity, not measured time.
  const daysGoal=previous.activeDays?bounded(previous.activeDays+1,2,5):2;
  const lessonsGoal=bounded(remainingWritten,0,25)>0?
   Math.min(bounded(remainingWritten,0,25),bounded(previous.lessons+1,1,3)):0;
  const reviewsGoal=reviewEligible===true?bounded(previous.reviews+1,1,4):0;
  const goals=Object.freeze([
   Object.freeze({id:'active',current:current.activeDays,target:daysGoal}),
   ...(lessonsGoal?[Object.freeze({id:'lessons',current:current.lessons,target:lessonsGoal})]:[]),
   ...(reviewsGoal?[Object.freeze({id:'reviews',current:current.reviews,target:reviewsGoal})]:[])
  ]);
  const rewards=Object.freeze(tiers.map(t=>Object.freeze({
   ...t,earned:current.activeDays>=t.days,progress:Math.min(current.activeDays,t.days)
  })));
  return Object.freeze({schema:1,key:calendar.key,start:calendar.start,end:calendar.end,
   previousStart:calendar.previousStart,previousEnd:calendar.previousEnd,
   current,previous,goals,rewards,allGoalsMet:goals.every(g=>g.current>=g.target),
   hasPreviousEvidence:previous.activeDays>0});
 }
 function cleanAwards(raw){
  const weeks=Object.create(null),source=raw?.schema===1&&raw.weeks&&typeof raw.weeks==='object'?raw.weeks:{};
  for(const week of Object.keys(source).filter(k=>/^\d{4}-\d{2}-\d{2}$/.test(k)).sort().slice(-16)){
   const entry=source[week];if(!entry||!Array.isArray(entry.ids))continue;
   weeks[week]=Object.freeze(unique(entry.ids).filter(id=>tiers.some(t=>t.id===id)));
  }
  return Object.freeze({schema:1,weeks:Object.freeze(weeks)});
 }
 function syncAwards(raw,snapshot){
  const awards=cleanAwards(raw);
  if(!snapshot?.key||!/^\d{4}-\d{2}-\d{2}$/.test(snapshot.key))return awards;
  const achieved=tiers.filter(t=>snapshot.current?.activeDays>=t.days).map(t=>t.id);
  if(!achieved.length)return awards;
  const weeks={...awards.weeks,[snapshot.key]:unique([...(awards.weeks[snapshot.key]||[]),...achieved])};
  return cleanAwards({schema:1,weeks});
 }
 const ui=Object.freeze({
  tr:{goalHeading:'Yeni Hafta Hedeflerim',goalIntro:'Geçen haftaki gerçek çalışma düzenine göre önerilen, baskısız hedefler.',goalDays:'Aktif gün',goalLessons:'Yazılı ders',goalReviews:'Doğru tekrar',goalWeek:'Bu hafta',goalLastWeek:'Geçen hafta',goalFresh:'İlk haftan için başlangıç hedefleri',goalPersonal:'Geçen haftanın etkinliklerinden önerildi',goalRewards:'Devamlılık Rozetleri',goalBronze:'İlk İstikrar',goalSilver:'Düzenli Yolcu',goalGold:'Kararlı Öğrenci',goalEarned:'Kazanıldı',goalLocked:'Aktif gün hedefi',goalComplete:'Haftalık hedeflerini tamamladın!',goalOptional:'Hedefler öneridir; kaçırmak puan kaybettirmez. Rozetler yalnızca bu cihazda gösterilir, XP veya iksir vermez.',goalArchive:'Önceki haftalarda kazanılan rozet',goalNoArchive:'Henüz geçmiş hafta rozeti yok.'},
  en:{goalHeading:'My New Weekly Goals',goalIntro:'Flexible suggestions based on your actual previous-week study.',goalDays:'Active days',goalLessons:'Written lessons',goalReviews:'Correct reviews',goalWeek:'This week',goalLastWeek:'Last week',goalFresh:'Starter goals for your first week',goalPersonal:'Suggested from previous-week activity',goalRewards:'Consistency Badges',goalBronze:'First Steps',goalSilver:'Steady Learner',goalGold:'Committed Learner',goalEarned:'Earned',goalLocked:'Active-day milestone',goalComplete:'You reached your weekly goals!',goalOptional:'Goals are optional. Missing one costs no points. These local-only badges give no XP or elixirs.',goalArchive:'Badges earned in past weeks',goalNoArchive:'No badges from previous weeks yet.'},
  ar:{goalHeading:'أهدافي للأسبوع الجديد',goalIntro:'أهداف مرنة مقترحة بناءً على تدريب الأسبوع الماضي الحقيقي.',goalDays:'الأيام النشطة',goalLessons:'الدروس الكتابية',goalReviews:'المراجعات الصحيحة',goalWeek:'هذا الأسبوع',goalLastWeek:'الأسبوع الماضي',goalFresh:'أهداف بداية الأسبوع الأول',goalPersonal:'اقتراح وفق أنشطة الأسبوع السابق',goalRewards:'شارات الاستمرارية',goalBronze:'الخطوات الأولى',goalSilver:'متعلم منتظم',goalGold:'متعلم مثابر',goalEarned:'تم الحصول عليها',goalLocked:'هدف الأيام النشطة',goalComplete:'حققت أهداف الأسبوع!',goalOptional:'الأهداف اختيارية، ولا تُخصم نقاط عند عدم تحقيقها. الشارات محلية ولا تمنح خبرة أو إكسيرًا.',goalArchive:'شارات الأسابيع السابقة',goalNoArchive:'لا توجد شارات سابقة بعد.'},
  de:{goalHeading:'Meine neuen Wochenziele',goalIntro:'Flexible Vorschläge nach den tatsächlich erledigten Aufgaben der Vorwoche.',goalDays:'Aktive Tage',goalLessons:'Schriftliche Lektionen',goalReviews:'Richtige Wiederholungen',goalWeek:'Diese Woche',goalLastWeek:'Letzte Woche',goalFresh:'Startziele für die erste Woche',goalPersonal:'Nach Aktivitäten der Vorwoche empfohlen',goalRewards:'Beständigkeits-Abzeichen',goalBronze:'Erste Schritte',goalSilver:'Regelmäßiger Lerner',goalGold:'Ausdauernder Lerner',goalEarned:'Verdient',goalLocked:'Ziel aktiver Tage',goalComplete:'Deine Wochenziele sind erreicht!',goalOptional:'Ziele sind freiwillig. Versäumte Ziele kosten keine Punkte. Diese lokalen Abzeichen geben weder XP noch Elixiere.',goalArchive:'Abzeichen früherer Wochen',goalNoArchive:'Noch keine Abzeichen aus früheren Wochen.'},
  fr:{goalHeading:'Mes nouveaux objectifs hebdomadaires',goalIntro:'Des suggestions souples fondées sur les activités réelles de la semaine précédente.',goalDays:'Jours actifs',goalLessons:'Leçons écrites',goalReviews:'Révisions justes',goalWeek:'Cette semaine',goalLastWeek:'Semaine précédente',goalFresh:'Objectifs de départ pour la première semaine',goalPersonal:'Suggérés selon la semaine précédente',goalRewards:'Badges de régularité',goalBronze:'Premiers pas',goalSilver:'Élève régulier',goalGold:'Élève persévérant',goalEarned:'Obtenu',goalLocked:'Objectif de jours actifs',goalComplete:'Tes objectifs hebdomadaires sont atteints !',goalOptional:'Objectifs facultatifs, sans perte de points. Les badges restent sur cet appareil et ne donnent ni XP ni élixirs.',goalArchive:'Badges des semaines précédentes',goalNoArchive:'Aucun badge des semaines précédentes.'}
 });
 window.DEEN_ARABIC_WEEKLY_GOALS=Object.freeze({version:1,tiers,span,activity,build,cleanAwards,syncAwards,ui});
})();
