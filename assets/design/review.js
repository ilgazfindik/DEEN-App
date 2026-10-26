/* Review tab on the design system — phases R1–R6.
   Renders #reviewScreenBody from the existing engines only (DEEN_ADAPTIVE, DEEN_SPACED_REVIEW,
   startSmartReview); scheduling and grading logic stay untouched.
   Interface copy is localized here for all five languages. Data that comes from the content
   bank in Turkish (topics, unit and stage titles) is placed in its own text node so the
   existing locale layers translate it exactly as before. */
(()=>{
 'use strict';
 if(window.DEEN_DS_REVIEW)return;

 const L={
  tr:{eyebrow:'HATIRLA · PEKİŞTİR',title:['Unutmaya göre çalışan ','tekrar.'],sub:'Plan, geçmiş cevaplarına ve tekrar zamanlarına göre kendini ayarlar.',
   planEyebrow:'HAFIZA PLANI',live:'Canlı',planTitle:'Bugünkü hafıza planın',planDue:'Vadesi gelen bilgiler önce geliyor.',planBalanced:'Vadesi gelen yok; plan zayıf kavramları dengeli şekilde tekrar ettirir.',
   questionsCaps:'SORU',statDue:'Bekleyen',statMistakes:'Yanlış',statWeak:'Zayıf kavram',statMemory:'Hafıza gücü',
   start:'Adaptif tekrarı başlat',startMeta:'{n} soru · ~{m} dk',modes:'Tekrar modları',
   mistakes:'Yanlışların',mistakesDesc:'Kaçırdıklarına odaklan',weak:'Zayıf kavramlar',weakDesc:'Anlayışını güçlendir',quick:'Hızlı tekrar',quickDesc:'Kısa ve etkili',due:'Vadesi gelenler',dueDesc:'Unutmadan hatırla',
   q:n=>n+' soru',c:n=>n+' kavram',free:'Ücretsiz',energy:n=>n+' enerji',emptyMode:'Şu an boş',
   memory:'Hafıza haritası',memorySub:'Güçlendirmen gereken kavramlar',bandWeak:'Öncelikli',bandDeveloping:'Gelişiyor',bandSteady:'Dengeli',dueN:n=>n+' tekrar bekliyor',
   showAll:'Tümünü gör',showLess:'Daha az göster',noHistory:'Birkaç ders sonra güçlendirmen gereken kavramlar burada görünür.',
   byUnit:'Ünitelere göre',unitMeta:(a,b,c)=>a+' kavram · '+b+' güçlendirilecek · '+c+' bekleyen',
   spaced:'Aralıklı tekrar',spacedSub:'1. ve 7. günde kısa kontroller, bilgiyi kalıcı yapar.',day1:'1. gün',day7:'7. gün',ready:n=>n+' hazır',readyNow:'Hazır',tomorrow:'Yarın',inDays:n=>n+' gün sonra',
   spacedEmpty:'Bir ders bitirdiğinde 1. ve 7. gün tekrarların burada planlanır.',spacedStart:'Sıradaki tekrarı başlat',spacedDone:n=>n+' kontrol tamamlandı',
   disclaimer:'Bu skor yalnızca öğrenme ve hatırlama performansını gösterir; dinî yeterlilik veya ibadet değeri ölçmez.',
   emptyTitle:'Hafızan burada şekillenecek',emptyText:'İlk mini dersini tamamla; DEEN neyi ne zaman tekrar etmen gerektiğini senin için planlasın.',emptyCta:'İlk derse başla',steps:['Ders tamamla','Plan oluşur','Akıllı tekrar'],
   pct:n=>'%'+n},
  en:{eyebrow:'RECALL · REINFORCE',title:['Review that responds to ','forgetting.'],sub:'Your plan adapts to your past answers and review times.',
   planEyebrow:'MEMORY PLAN',live:'Live',planTitle:"Today's memory plan",planDue:'Items that are due come first.',planBalanced:'Nothing is due; the plan balances your weaker concepts.',
   questionsCaps:'QUESTIONS',statDue:'Due',statMistakes:'Mistakes',statWeak:'Weak concepts',statMemory:'Memory strength',
   start:'Start adaptive review',startMeta:'{n} questions · ~{m} min',modes:'Review modes',
   mistakes:'Your mistakes',mistakesDesc:'Focus on what you missed',weak:'Weaker concepts',weakDesc:'Build stronger understanding',quick:'Quick review',quickDesc:'Short and effective',due:'Due reviews',dueDesc:'Recall before you forget',
   q:n=>n===1?'1 question':n+' questions',c:n=>n===1?'1 concept':n+' concepts',free:'Free',energy:n=>n+' energy',emptyMode:'Nothing here yet',
   memory:'Memory map',memorySub:'Concepts to strengthen',bandWeak:'Priority',bandDeveloping:'Improving',bandSteady:'Steady',dueN:n=>n+' due',
   showAll:'See all',showLess:'Show less',noHistory:'After a few lessons, concepts to strengthen appear here.',
   byUnit:'By unit',unitMeta:(a,b,c)=>a+' concepts · '+b+' to strengthen · '+c+' due',
   spaced:'Spaced review',spacedSub:'Short check-ins on day 1 and day 7 make knowledge last.',day1:'Day 1',day7:'Day 7',ready:n=>n+' ready',readyNow:'Ready',tomorrow:'Tomorrow',inDays:n=>'In '+n+' days',
   spacedEmpty:'Finish a lesson and your day-1 and day-7 reviews are scheduled here.',spacedStart:'Start next review',spacedDone:n=>n===1?'1 check-in completed':n+' check-ins completed',
   disclaimer:'This score reflects learning and recall only; it does not measure religious competence or the value of worship.',
   emptyTitle:'Your memory plan starts here',emptyText:'Finish your first mini lesson and DEEN will plan what to review and when.',emptyCta:'Start your first lesson',steps:['Finish a lesson','Plan is built','Smart review'],
   pct:n=>n+'%'},
  ar:{eyebrow:'تذكّر · عزّز',title:['مراجعة تتكيّف مع ','النسيان.'],sub:'تتغيّر الخطة تلقائيًا وفق إجاباتك السابقة ومواعيد المراجعة.',
   planEyebrow:'خطة الذاكرة',live:'مباشر',planTitle:'خطة الذاكرة لليوم',planDue:'تأتي المعلومات المستحقة للمراجعة أولًا.',planBalanced:'لا شيء مستحق الآن؛ تركّز الخطة على المفاهيم الأضعف بتوازن.',
   questionsCaps:'سؤال',statDue:'مستحق',statMistakes:'أخطاء',statWeak:'مفاهيم ضعيفة',statMemory:'قوة الذاكرة',
   start:'ابدأ المراجعة التكيفية',startMeta:'{n} أسئلة · ~{m} د',modes:'أنماط المراجعة',
   mistakes:'أخطاؤك',mistakesDesc:'ركّز على ما فاتك',weak:'المفاهيم الضعيفة',weakDesc:'قوِّ فهمك',quick:'مراجعة سريعة',quickDesc:'قصيرة وفعّالة',due:'المراجعات المستحقة',dueDesc:'تذكّر قبل أن تنسى',
   q:n=>n+' سؤال',c:n=>n+' مفهوم',free:'مجانية',energy:n=>n+' طاقة',emptyMode:'لا شيء الآن',
   memory:'خريطة الذاكرة',memorySub:'مفاهيم تحتاج إلى تقوية',bandWeak:'أولوية',bandDeveloping:'في تحسّن',bandSteady:'متوازن',dueN:n=>n+' مستحقة',
   showAll:'عرض الكل',showLess:'عرض أقل',noHistory:'بعد بضعة دروس ستظهر هنا المفاهيم التي تحتاج إلى تقوية.',
   byUnit:'حسب الوحدة',unitMeta:(a,b,c)=>a+' مفهوم · '+b+' للتقوية · '+c+' مستحقة',
   spaced:'المراجعة المتباعدة',spacedSub:'مراجعات قصيرة في اليوم الأول والسابع تجعل المعرفة راسخة.',day1:'اليوم 1',day7:'اليوم 7',ready:n=>n+' جاهزة',readyNow:'جاهزة',tomorrow:'غدًا',inDays:n=>'بعد '+n+' أيام',
   spacedEmpty:'عند إنهاء درس، تُجدول هنا مراجعات اليوم الأول والسابع.',spacedStart:'ابدأ المراجعة التالية',spacedDone:n=>'اكتمل '+n+' من المراجعات',
   disclaimer:'يعكس هذا المؤشر أداء التعلّم والتذكّر فقط، ولا يقيس الكفاءة الدينية أو قيمة العبادة.',
   emptyTitle:'خطة ذاكرتك تبدأ هنا',emptyText:'أكمل درسك المصغّر الأول، وسيخطّط DEEN لما تراجعه ومتى.',emptyCta:'ابدأ الدرس الأول',steps:['أكمل درسًا','تُبنى الخطة','مراجعة ذكية'],
   pct:n=>n+'%'},
  de:{eyebrow:'ERINNERN · FESTIGEN',title:['Wiederholung, die sich dem ','Vergessen anpasst.'],sub:'Dein Plan passt sich deinen bisherigen Antworten und Wiederholungszeiten an.',
   planEyebrow:'GEDÄCHTNISPLAN',live:'Live',planTitle:'Dein Gedächtnisplan für heute',planDue:'Fällige Inhalte kommen zuerst.',planBalanced:'Nichts ist fällig; der Plan stärkt ausgewogen deine schwächeren Begriffe.',
   questionsCaps:'FRAGEN',statDue:'Fällig',statMistakes:'Fehler',statWeak:'Schwache Begriffe',statMemory:'Gedächtnisstärke',
   start:'Adaptive Wiederholung starten',startMeta:'{n} Fragen · ~{m} Min.',modes:'Wiederholungsmodi',
   mistakes:'Deine Fehler',mistakesDesc:'Konzentriere dich auf Verpasstes',weak:'Schwächere Begriffe',weakDesc:'Verständnis stärken',quick:'Schnelle Wiederholung',quickDesc:'Kurz und wirksam',due:'Fällige Wiederholungen',dueDesc:'Erinnern, bevor du vergisst',
   q:n=>n===1?'1 Frage':n+' Fragen',c:n=>n===1?'1 Begriff':n+' Begriffe',free:'Kostenlos',energy:n=>n+' Energie',emptyMode:'Gerade leer',
   memory:'Gedächtniskarte',memorySub:'Begriffe zum Festigen',bandWeak:'Priorität',bandDeveloping:'Wird besser',bandSteady:'Stabil',dueN:n=>n+' fällig',
   showAll:'Alle anzeigen',showLess:'Weniger anzeigen',noHistory:'Nach ein paar Lektionen erscheinen hier Begriffe zum Festigen.',
   byUnit:'Nach Einheit',unitMeta:(a,b,c)=>a+' Begriffe · '+b+' zu festigen · '+c+' fällig',
   spaced:'Verteilte Wiederholung',spacedSub:'Kurze Checks an Tag 1 und Tag 7 machen Wissen dauerhaft.',day1:'Tag 1',day7:'Tag 7',ready:n=>n+' bereit',readyNow:'Bereit',tomorrow:'Morgen',inDays:n=>'In '+n+' Tagen',
   spacedEmpty:'Schließe eine Lektion ab, dann werden hier deine Wiederholungen für Tag 1 und Tag 7 geplant.',spacedStart:'Nächste Wiederholung starten',spacedDone:n=>n===1?'1 Check abgeschlossen':n+' Checks abgeschlossen',
   disclaimer:'Dieser Wert zeigt nur Lernen und Erinnern; er misst weder religiöse Kompetenz noch den Wert des Gottesdienstes.',
   emptyTitle:'Hier entsteht dein Gedächtnisplan',emptyText:'Schließe deine erste Mini-Lektion ab, dann plant DEEN, was du wann wiederholst.',emptyCta:'Erste Lektion starten',steps:['Lektion abschließen','Plan entsteht','Smarte Wiederholung'],
   pct:n=>n+' %'},
  fr:{eyebrow:'RAPPELER · CONSOLIDER',title:['Une révision qui s’adapte à ','l’oubli.'],sub:'Ton plan s’adapte à tes réponses passées et à tes moments de révision.',
   planEyebrow:'PLAN DE MÉMOIRE',live:'En direct',planTitle:'Ton plan de mémoire du jour',planDue:'Les notions à revoir passent en premier.',planBalanced:'Rien n’est dû ; le plan renforce tes notions plus fragiles.',
   questionsCaps:'QUESTIONS',statDue:'À revoir',statMistakes:'Erreurs',statWeak:'Notions fragiles',statMemory:'Force de mémoire',
   start:'Lancer la révision adaptative',startMeta:'{n} questions · ~{m} min',modes:'Modes de révision',
   mistakes:'Tes erreurs',mistakesDesc:'Concentre-toi sur tes oublis',weak:'Notions fragiles',weakDesc:'Renforce ta compréhension',quick:'Révision rapide',quickDesc:'Courte et efficace',due:'Révisions dues',dueDesc:'Rappelle-toi avant d’oublier',
   q:n=>n<=1?n+' question':n+' questions',c:n=>n<=1?n+' notion':n+' notions',free:'Gratuit',energy:n=>n+' énergie',emptyMode:'Rien pour l’instant',
   memory:'Carte de mémoire',memorySub:'Notions à consolider',bandWeak:'Prioritaire',bandDeveloping:'En progrès',bandSteady:'Stable',dueN:n=>n+' à revoir',
   showAll:'Tout voir',showLess:'Voir moins',noHistory:'Après quelques leçons, les notions à consolider apparaîtront ici.',
   byUnit:'Par unité',unitMeta:(a,b,c)=>a+' notions · '+b+' à consolider · '+c+' à revoir',
   spaced:'Révision espacée',spacedSub:'De courts rappels au jour 1 et au jour 7 ancrent tes connaissances.',day1:'Jour 1',day7:'Jour 7',ready:n=>n<=1?n+' prête':n+' prêtes',readyNow:'Prête',tomorrow:'Demain',inDays:n=>'Dans '+n+' jours',
   spacedEmpty:'Termine une leçon et tes révisions du jour 1 et du jour 7 seront planifiées ici.',spacedStart:'Lancer la prochaine révision',spacedDone:n=>n<=1?n+' rappel terminé':n+' rappels terminés',
   disclaimer:'Ce score reflète uniquement l’apprentissage et la mémorisation ; il ne mesure ni la compétence religieuse ni la valeur de l’adoration.',
   emptyTitle:'Ton plan de mémoire commence ici',emptyText:'Termine ta première mini-leçon et DEEN planifiera quoi réviser et quand.',emptyCta:'Commencer la première leçon',steps:['Termine une leçon','Le plan se crée','Révision intelligente'],
   pct:n=>n+' %'}
 };

 const ICON={
  brain:'<path d="M9 4a3 3 0 0 0-3 3v.2A3 3 0 0 0 4 10a3 3 0 0 0 1 2.2A3 3 0 0 0 7 17a3 3 0 0 0 5 1V5a3 3 0 0 0-3-1Z"/><path d="M15 4a3 3 0 0 1 3 3v.2A3 3 0 0 1 20 10a3 3 0 0 1-1 2.2A3 3 0 0 1 17 17a3 3 0 0 1-5 1"/><path d="M9 9h1.5M14 12h1.5M9 14h1.5"/>',
  clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2"/>',
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 12l6-6M15.5 5.5H18.5V8.5"/>',
  bolt:'<path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z"/>',
  chart:'<path d="M5 19V13M10 19V9M15 19V11M20 19V5"/>',
  play:'<path d="M9 7.5v9l7.5-4.5L9 7.5Z" fill="currentColor"/>',
  chevron:'<path d="m9 6 6 6-6 6"/>',
  book:'<path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.5v-15Z"/><path d="M20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.5v-15Z"/>',
  refresh:'<path d="M19 8a7.5 7.5 0 0 0-13.3 1"/><path d="M19 4v4h-4"/><path d="M5 16a7.5 7.5 0 0 0 13.3-1"/><path d="M5 20v-4h4"/>',
  calendar:'<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  sparkle:'<path d="M12 3c.7 4.3 2.7 6.3 7 7-4.3.7-6.3 2.7-7 7-.7-4.3-2.7-6.3-7-7 4.3-.7 6.3-2.7 7-7Z"/>',
  layers:'<path d="m12 4 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4M4 16l8 4 8-4"/>'
 };
 const svg=(name,cls='')=>'<svg class="dsr-ico '+cls+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+ICON[name]+'</svg>';
 const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
 // Content-bank text (Turkish source) in its own element so the locale layers translate it.
 const data=v=>'<span class="dsr-data">'+esc(v)+'</span>';

 function lang(){
  let code='';try{code=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}
  code=String(code||document.documentElement.lang||'tr').slice(0,2).toLowerCase();
  return L[code]?code:'tr';
 }
 // Unit names and stages are top-level bindings of the legacy bundle, not window properties.
 const unitNames=()=>{try{return Array.isArray(U)?U:[]}catch(_){return[]}};
 const appState=()=>{try{return state||{}}catch(_){return{}}};
 const stageList=()=>{try{return Array.isArray(STAGES)?STAGES:[]}catch(_){return[]}};
 const clampPct=n=>Math.max(0,Math.min(100,Math.round(Number(n)||0)));
 const band=score=>score<50?'weak':score<70?'developing':'steady';
 let expanded=false,lastRender=0;

 function snapshot(){
  const A=window.DEEN_ADAPTIVE,S=window.DEEN_SPACED_REVIEW,st=appState();
  if(!A)return null;
  const now=Date.now();
  const concepts=A.concepts()||[];
  const plan=A.plan('smart',null,7)?.summary||{count:0,due:0};
  const quick=A.plan('quick',null,5)?.summary||{count:0};
  const due=Object.values(st.reviewSchedule||{}).filter(r=>Number(r?.nextReview)>0&&Number(r.nextReview)<=now).length;
  const weak=concepts.filter(c=>c.score<60);
  const units=[];
  for(let n=1;n<=15;n++){const id='U'+String(n).padStart(2,'0'),m=A.unit(id);if(m?.learnedConcepts)units.push({id,n,...m})}
  const global=A.global?.()||{score:0};
  let spaced=null;
  if(S){
   try{
    const rows=S.pending()||[],ready=rows.filter(r=>r.due),store=S.state()||{};
    const done=Object.values(store).reduce((sum,e)=>sum+Object.values(e?.checkpoints||{}).filter(cp=>cp?.completedAt).length,0);
    spaced={rows,ready:ready.length,done};
   }catch(_){spaced=null}
  }
  return {concepts,plan,quick,due,weak,units,global,spaced,mistakes:(st.mistakes||[]).length,empty:!concepts.length&&!plan.count};
 }

 function ring(count,target){
  const r=34,c=2*Math.PI*r,p=target?Math.min(1,count/target):0;
  return '<svg class="dsr-ring-svg" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="'+r+'" class="dsr-ring-track"/><circle cx="42" cy="42" r="'+r+'" class="dsr-ring-fill" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+(c*(1-p)).toFixed(1)+'"/></svg>';
 }
 const bar=(pct,tone='')=>'<span class="dsr-bar '+tone+'"><i style="width:'+clampPct(pct)+'%"></i></span>';

 function stat(icon,tone,value,label,pct){
  return '<div class="dsr-stat '+tone+'">'+svg(icon)+'<b>'+esc(value)+'</b><small>'+esc(label)+'</small>'+(pct==null?'':bar(pct,tone))+'</div>';
 }

 function planCard(s,T){
  const p=s.plan,minutes=Math.max(1,Math.ceil(p.count*0.65));
  const chips=s.concepts.slice().sort((a,b)=>a.score-b.score).slice(0,3).map(c=>'<span class="dsr-chip '+band(c.score)+'">'+data(c.topic)+'<em>'+esc(T.pct(c.score))+'</em></span>').join('');
  const scheduled=Object.keys(appState().reviewSchedule||{}).length||1;
  return '<section class="dsr-plan" aria-labelledby="dsrPlanTitle">'+
   '<div class="dsr-plan-head"><span class="dsr-plan-eyebrow">'+svg('brain')+esc(T.planEyebrow)+'</span>'+(p.count?'<span class="dsr-live"><i></i>'+esc(T.live)+'</span>':'')+'</div>'+
   '<div class="dsr-plan-main"><div><h2 id="dsrPlanTitle">'+esc(T.planTitle)+'</h2><p>'+esc(p.due?T.planDue:T.planBalanced)+'</p></div>'+
   '<div class="dsr-ring" role="img" aria-label="'+esc(p.count+' '+T.questionsCaps)+'">'+ring(p.count,7)+'<span><b>'+p.count+'</b><small>'+esc(T.questionsCaps)+'</small></span></div></div>'+
   '<div class="dsr-stats">'+
    stat('clock','sky',s.due,T.statDue,Math.round(s.due/scheduled*100))+
    stat('target','coral',s.mistakes,T.statMistakes,null)+
    stat('bolt','amber',s.weak.length,T.statWeak,null)+
    stat('chart','mint',T.pct(clampPct(s.global.score)),T.statMemory,s.global.score)+
   '</div>'+
   (chips?'<div class="dsr-chips">'+chips+'</div>':'')+
   '<button type="button" class="dsr-cta" data-dsr-start="smart"><span class="dsr-cta-play">'+svg('play')+'</span><span class="dsr-cta-text"><b>'+esc(T.start)+'</b><small>'+svg('clock')+esc(T.startMeta.replace('{n}',p.count).replace('{m}',minutes))+'</small></span>'+svg('chevron','dsr-flip')+'</button>'+
  '</section>';
 }

 function modes(s,T){
  const items=[
   {mode:'mistakes',icon:'target',tone:'coral',title:T.mistakes,meta:T.q(s.mistakes),desc:T.mistakesDesc,count:s.mistakes},
   {mode:'weak',icon:'bolt',tone:'amber',title:T.weak,meta:T.c(s.weak.length)+' · '+T.energy(3),desc:T.weakDesc,count:s.weak.length},
   {mode:'quick',icon:'book',tone:'mint',title:T.quick,meta:T.q(Math.min(5,s.quick.count||0))+' · '+T.free,desc:T.quickDesc,count:s.quick.count||0},
   {mode:'due',icon:'refresh',tone:'sky',title:T.due,meta:T.q(s.due),desc:T.dueDesc,count:s.due}
  ];
  return '<h2 class="dsr-section">'+esc(T.modes)+'</h2><div class="dsr-modes">'+items.map(it=>{
   const off=!it.count;
   return '<button type="button" class="dsr-mode '+it.tone+(off?' is-empty':'')+'" data-dsr-start="'+it.mode+'"'+(off?' disabled aria-disabled="true"':'')+'>'+
    '<span class="dsr-mode-top"><span class="dsr-badge">'+svg(it.icon)+'</span>'+svg('chevron','dsr-flip dsr-chev')+'</span>'+
    '<b>'+esc(it.title)+'</b><span class="dsr-mode-meta">'+esc(off?T.emptyMode:it.meta)+'</span><small>'+esc(it.desc)+'</small></button>';
  }).join('')+'</div>';
 }

 function memory(s,T){
  const rows=s.weak.slice().sort((a,b)=>a.score-b.score);
  const U=unitNames();
  const label=c=>c.score<50?T.bandWeak:c.score<70?T.bandDeveloping:T.bandSteady;
  const shown=expanded?rows.slice(0,8):rows.slice(0,3);
  let html='<div class="dsr-section-row"><h2 class="dsr-section">'+esc(T.memory)+'</h2>'+(rows.length>3?'<button type="button" class="dsr-link" data-dsr-toggle>'+esc(expanded?T.showLess:T.showAll)+'</button>':'')+'</div>';
  if(!rows.length)return html+'<p class="dsr-note">'+esc(T.noHistory)+'</p>';
  html+='<p class="dsr-sub">'+esc(T.memorySub)+'</p><div class="dsr-list">'+shown.map(c=>{
   const unitName=U[Number(String(c.unit).slice(1))-1]||c.unit;
   return '<div class="dsr-row '+band(c.score)+'"><div class="dsr-row-top"><b>'+data(c.topic)+'</b><strong>'+esc(T.pct(c.score))+'</strong></div>'+bar(c.score,band(c.score))+
    '<small>'+data(unitName)+'<span> · '+esc(label(c))+(c.due?' · '+esc(T.dueN(c.due)):'')+'</span></small></div>';
  }).join('')+'</div>';
  if(s.units.length){
   html+='<h2 class="dsr-section">'+esc(T.byUnit)+'</h2><div class="dsr-list">'+s.units.map(u=>
    '<button type="button" class="dsr-unit" data-dsr-start="smart" data-dsr-unit="'+u.id+'"><span class="dsr-unit-no">'+u.n+'</span><span class="dsr-unit-body"><span class="dsr-row-top"><b>'+data(U[u.n-1]||u.id)+'</b><strong>'+esc(T.pct(u.score))+'</strong></span>'+bar(u.score,band(u.score))+'<small>'+esc(T.unitMeta(u.learnedConcepts,u.weak,u.due))+'</small></span>'+svg('chevron','dsr-flip dsr-chev')+'</button>').join('')+'</div>';
  }
  return html;
 }

 function spaced(s,T){
  const sp=s.spaced;if(!sp)return '';
  const when=at=>{const d=at-Date.now();if(d<=0)return T.readyNow;const days=Math.ceil(d/86400000);return days===1?T.tomorrow:T.inDays(days)};
  const stages=stageList();
  const title=id=>stages.find(x=>x.id===id)?.title||id;
  const rows=sp.rows.slice(0,4).map(r=>'<div class="dsr-sp-row '+(r.due?'due':'')+'"><span class="dsr-sp-day">'+esc(r.key==='d7'?T.day7:T.day1)+'</span><b>'+data(title(r.stageId))+'</b><strong>'+esc(when(r.dueAt))+'</strong></div>').join('');
  return '<section class="dsr-spaced">'+
   '<div class="dsr-spaced-head"><span class="dsr-badge sky">'+svg('calendar')+'</span><div><h2>'+esc(T.spaced)+'</h2><p>'+esc(T.spacedSub)+'</p></div>'+(sp.ready?'<span class="dsr-pill">'+esc(T.ready(sp.ready))+'</span>':'')+'</div>'+
   '<div class="dsr-timeline" aria-hidden="true"><span class="on">'+esc(T.day1)+'</span><i></i><span>'+esc(T.day7)+'</span></div>'+
   (rows?'<div class="dsr-sp-list">'+rows+'</div>':'<p class="dsr-note">'+esc(T.spacedEmpty)+'</p>')+
   (sp.ready?'<button type="button" class="dsr-secondary" data-dsr-spaced>'+esc(T.spacedStart)+'</button>':'')+
   (sp.done?'<small class="dsr-foot">'+esc(T.spacedDone(sp.done))+'</small>':'')+
  '</section>';
 }

 function emptyState(T){
  const animal=String(appState().profile?.companion||'owl').replace(/[^a-z]/g,'')||'owl';
  return '<section class="dsr-empty">'+
   '<div class="dsr-empty-art"><span class="dsr-empty-glow"></span><img src="./assets/companions/'+animal+'/'+animal+'_avatar.png" alt="" onerror="this.remove()"></div>'+
   '<h2>'+esc(T.emptyTitle)+'</h2><p>'+esc(T.emptyText)+'</p>'+
   '<ol class="dsr-steps">'+T.steps.map((x,i)=>'<li><span>'+(i+1)+'</span>'+esc(x)+'</li>').join('')+'</ol>'+
   '<button type="button" class="dsr-cta" data-dsr-first><span class="dsr-cta-play">'+svg('play')+'</span><span class="dsr-cta-text"><b>'+esc(T.emptyCta)+'</b></span>'+svg('chevron','dsr-flip')+'</button>'+
  '</section>';
 }

 function render(){
  const body=document.getElementById('reviewScreenBody');if(!body)return false;
  let s;try{s=snapshot()}catch(err){console.warn('DEEN_DS_REVIEW_DATA',err);return false}
  if(!s)return false;
  const code=lang(),T=L[code];
  body.classList.add('dsr-host');
  const keep=body.scrollTop;
  // Entrance motion only when the screen is opened, not on every data refresh.
  const animate=Date.now()-lastRender>1500;lastRender=Date.now();
  body.innerHTML='<div class="dsr'+(animate?' dsr-anim':'')+'" data-dsr-lang="'+code+'">'+
   '<header class="dsr-hero"><span class="dsr-eyebrow">'+esc(T.eyebrow)+'</span><h1>'+esc(T.title[0])+'<em>'+esc(T.title[1])+'</em></h1><p>'+esc(T.sub)+'</p>'+'</header>'+
   (s.empty?emptyState(T)+modes(s,T):planCard(s,T)+modes(s,T)+spaced(s,T)+memory(s,T)+'<p class="dsr-disclaimer">'+esc(T.disclaimer)+'</p>')+
  '</div>';
  body.scrollTop=keep;
  return true;
 }

 function firstLesson(){
  try{window.navigate?.('learnScreen')}catch(_){}
  setTimeout(()=>{const go=document.getElementById('v680HomeAction')||document.querySelector('#learnScroll .lp-stop.current .deen-stage-card, #learnScroll .deen-stage-card.current');go?.click()},120);
 }

 document.addEventListener('click',event=>{
  const host=event.target.closest?.('#reviewScreenBody .dsr');if(!host)return;
  const start=event.target.closest('[data-dsr-start]');
  if(start){if(start.disabled)return;event.preventDefault();window.startSmartReview?.(start.dataset.dsrStart,start.dataset.dsrUnit||null);return}
  if(event.target.closest('[data-dsr-spaced]')){event.preventDefault();window.DEEN_SPACED_REVIEW?.startNext?.();return}
  if(event.target.closest('[data-dsr-first]')){event.preventDefault();firstLesson();return}
  if(event.target.closest('[data-dsr-toggle]')){event.preventDefault();expanded=!expanded;render()}
 });

 // The legacy renderer stays the entry point; this view replaces only its output.
 function install(){
  if(typeof window.reviewView!=='function'){setTimeout(install,300);return}
  const base=window.reviewView;
  window.reviewView=function(){let out;try{out=base.apply(this,arguments)}catch(err){console.warn('DEEN_DS_REVIEW_BASE',err)}render();return out};
  const active=()=>document.getElementById('reviewScreen')?.classList.contains('active');
  // Spaced-review and progress changes arrive through ui-updated; re-render only while visible.
  document.addEventListener('deen:ui-updated',()=>{if(active())queueMicrotask(render)});
  if(active())render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 window.DEEN_DS_REVIEW=Object.freeze({render,version:'ds-review-v1',strings:L});
})();
