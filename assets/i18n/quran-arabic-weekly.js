/* DEEN Quran Arabic, phase 16 — accurate, local-only seven-day activity.
 * Historical completions without timestamps are never backdated. The earlier
 * daily journal may contribute TODAY only, even on the first run after upgrading.
 * Values are unique completed written lessons and correctly reviewed cards,
 * not minutes, session lengths, pronunciation results, or study proficiency.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_WEEKLY)return;
 const dayKey=(at=new Date())=>{
  const date=at instanceof Date?at:new Date(at);
  if(!Number.isFinite(date.getTime()))return null;
  return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
 };
 const parseDay=key=>{
  if(typeof key!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(key))return null;
  const [y,m,d]=key.split('-').map(Number),date=new Date(y,m-1,d,12);
  return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d?date:null;
 };
 const weekDays=(now=new Date())=>{
  const today=now instanceof Date?new Date(now):new Date(now);
  if(!Number.isFinite(today.getTime()))return Object.freeze([]);
  today.setHours(12,0,0,0);
  return Object.freeze(Array.from({length:7},(_,i)=>{
   const date=new Date(today);date.setDate(today.getDate()-(6-i));return dayKey(date);
  }));
 };
 const unique=ids=>[...new Set(Array.isArray(ids)?ids.filter(x=>typeof x==='string'&&x.length>0&&x.length<=128):[])];
 function clean(raw){
  const days=Object.create(null),source=raw?.schema===1&&raw?.days&&typeof raw.days==='object'&&!Array.isArray(raw.days)?raw.days:{};
  const valid=Object.keys(source).filter(k=>parseDay(k)).sort().slice(-35);
  for(const key of valid){
   const value=source[key];if(!value||typeof value!=='object'||Array.isArray(value))continue;
   days[key]=Object.freeze({
    lessons:Object.freeze(unique(value.lessons).slice(0,100)),
    reviews:Object.freeze(unique(value.reviews).slice(0,100))
   });
  }
  return Object.freeze({schema:1,days:Object.freeze(days)});
 }
 function record(raw,type,id,when=new Date()){
  const key=dayKey(when),base=clean(raw);
  if(!key||!['lesson','review'].includes(type)||typeof id!=='string'||!id||id.length>128)return base;
  const old=base.days[key]||{lessons:[],reviews:[]},field=type==='lesson'?'lessons':'reviews';
  const days={...base.days,[key]:{...old,[field]:unique([...old[field],id]).slice(0,100)}};
  return clean({schema:1,days});
 }
 function summarize(raw,daily,examHistory,now=new Date()){
  const log=clean(raw),keys=weekDays(now),today=dayKey(now);
  const currentDaily=daily&&daily.day===today&&typeof daily==='object'?daily:null;
  const exams=Array.isArray(examHistory?.attempts)?examHistory.attempts:[];
  const columns=keys.map(key=>{
   const entry=log.days[key]||{lessons:[],reviews:[]};
   const lessons=unique([...entry.lessons,...(key===today?currentDaily?.lessons||[]:[])]);
   const reviews=unique([...entry.reviews,...(key===today?currentDaily?.reviews||[]:[])]);
   const assessments=exams.filter(x=>x&&Number.isFinite(x.at)&&dayKey(x.at)===key&&Number.isInteger(x.correct)).length;
   return Object.freeze({day:key,lessons:lessons.length,reviews:reviews.length,assessments,
    active:lessons.length+reviews.length+assessments>0});
  });
  const sum=key=>columns.reduce((value,row)=>value+row[key],0);
  const scores=exams.filter(x=>x&&Number.isInteger(x.correct)&&x.correct>=0&&x.correct<=20&&Number.isFinite(x.at)).slice(-2)
   .map(x=>Object.freeze({at:x.at,correct:x.correct,total:20}));
  return Object.freeze({
   start:keys[0]||null,end:keys[6]||null,days:Object.freeze(columns),
   lessonCount:sum('lessons'),reviewCount:sum('reviews'),assessmentCount:sum('assessments'),
   activeDays:columns.filter(x=>x.active).length,
   mostRecentScores:Object.freeze(scores),
   scoreChange:scores.length===2?scores[1].correct-scores[0].correct:null,
   hasAnyActivity:columns.some(x=>x.active),
   source:'timestamped activity logged on this device; historical untimed lessons excluded'
  });
 }
 const ui=Object.freeze({
  tr:{weekHeading:'Haftalık Arapça Gelişimim',weekIntro:'Son 7 günün gerçek ders ve tekrar etkinliklerini takip et.',weekOpen:'Haftalık Gelişimimi Gör',weekBack:'Arapça Öğrenmeye Dön',weekLessons:'Tamamlanan ders',weekReviews:'Doğru kelime tekrarı',weekActive:'Aktif gün',weekExams:'Bitirme değerlendirmesi',weekDays:'Son 7 Gün',weekExamHeading:'Sınav Puanı Gelişimi',weekPrevious:'Önceki',weekLatest:'Son',weekChange:'Değişim',weekNone:'Henüz tarihli çalışma bulunmuyor. Bugünden itibaren tamamladığın çalışmalar burada görünecek.',weekNoExam:'Sınav sonucu henüz yok.',weekLocal:'Yalnızca bu cihazdaki kayıtlar kullanılır. Tarihi bulunmayan eski dersler geçmiş günlere eklenmez.',weekTime:'Ders süresi ölçülmez; sayılar tamamlanan tekil çalışmalar ve doğru tekrar kartlarıdır.',weekDayLessons:'Ders',weekDayReviews:'Tekrar',weekDayExams:'Sınav',weekDone:'Bu hafta'},
  en:{weekHeading:'My Weekly Arabic Progress',weekIntro:'See actual lessons and correct reviews over the last 7 days.',weekOpen:'View Weekly Progress',weekBack:'Back to Arabic Learning',weekLessons:'Completed lessons',weekReviews:'Correct word reviews',weekActive:'Active days',weekExams:'Written checkpoints',weekDays:'Last 7 Days',weekExamHeading:'Checkpoint Score Trend',weekPrevious:'Previous',weekLatest:'Latest',weekChange:'Change',weekNone:'No dated activity yet. Work you complete from today will appear here.',weekNoExam:'No checkpoint results yet.',weekLocal:'Only this device. Older lesson records without dates are not assigned to past days.',weekTime:'Study duration is not measured. Counts mean distinct completed activities and correct review cards.',weekDayLessons:'Lessons',weekDayReviews:'Reviews',weekDayExams:'Exams',weekDone:'This week'},
  ar:{weekHeading:'تقدمي الأسبوعي في العربية',weekIntro:'تابع الدروس والمراجعات الصحيحة خلال الأيام السبعة الماضية.',weekOpen:'اعرض التقدم الأسبوعي',weekBack:'العودة لتعلم العربية',weekLessons:'الدروس المكتملة',weekReviews:'مراجعات الكلمات الصحيحة',weekActive:'الأيام النشطة',weekExams:'التقييمات الكتابية',weekDays:'آخر ٧ أيام',weekExamHeading:'تطور نتائج التقييم',weekPrevious:'السابق',weekLatest:'الأخير',weekChange:'التغيّر',weekNone:'لا توجد أنشطة مؤرخة بعد. ستظهر التدريبات الجديدة هنا.',weekNoExam:'لا توجد نتائج تقييم بعد.',weekLocal:'تُستخدم بيانات هذا الجهاز فقط. الدروس القديمة بلا تاريخ لا تُضاف إلى الأيام السابقة.',weekTime:'لا يُقاس وقت الدراسة. الأعداد تمثل الأنشطة المكتملة والمراجعات الصحيحة المميزة.',weekDayLessons:'الدروس',weekDayReviews:'المراجعات',weekDayExams:'التقييمات',weekDone:'هذا الأسبوع'},
  de:{weekHeading:'Mein wöchentlicher Arabisch-Fortschritt',weekIntro:'Deine wirklichen Lektionen und richtigen Wiederholungen der letzten 7 Tage.',weekOpen:'Wochenfortschritt anzeigen',weekBack:'Zurück zum Arabischlernen',weekLessons:'Abgeschlossene Lektionen',weekReviews:'Richtige Wortwiederholungen',weekActive:'Aktive Tage',weekExams:'Schriftliche Tests',weekDays:'Letzte 7 Tage',weekExamHeading:'Entwicklung der Testpunkte',weekPrevious:'Vorher',weekLatest:'Zuletzt',weekChange:'Änderung',weekNone:'Noch keine datierten Aktivitäten. Ab heute erledigte Aufgaben erscheinen hier.',weekNoExam:'Noch keine Testergebnisse.',weekLocal:'Nur auf diesem Gerät. Alte Lektionen ohne Datum werden nicht rückdatiert.',weekTime:'Keine Messung der Lernzeit. Gezählt werden unterschiedliche abgeschlossene Aufgaben.',weekDayLessons:'Lektionen',weekDayReviews:'Wiederholungen',weekDayExams:'Tests',weekDone:'Diese Woche'},
  fr:{weekHeading:'Ma progression hebdomadaire en arabe',weekIntro:'Tes véritables leçons et révisions réussies des 7 derniers jours.',weekOpen:'Voir la progression de la semaine',weekBack:'Retour à l’apprentissage',weekLessons:'Leçons terminées',weekReviews:'Révisions justes',weekActive:'Jours actifs',weekExams:'Bilans écrits',weekDays:'7 derniers jours',weekExamHeading:'Évolution des notes',weekPrevious:'Précédent',weekLatest:'Dernier',weekChange:'Évolution',weekNone:'Aucune activité datée pour le moment. Les prochaines activités seront visibles ici.',weekNoExam:'Aucun résultat de bilan.',weekLocal:'Données de cet appareil uniquement. Les anciennes leçons sans date ne sont pas reportées sur le passé.',weekTime:'La durée n’est pas mesurée. Les chiffres comptent les activités distinctes terminées.',weekDayLessons:'Leçons',weekDayReviews:'Révisions',weekDayExams:'Bilans',weekDone:'Cette semaine'}
 });
 window.DEEN_ARABIC_WEEKLY=Object.freeze({version:1,dayKey,weekDays,clean,record,summarize,ui});
})();
