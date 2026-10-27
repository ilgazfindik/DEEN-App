/* Profile tab on the design system — phases P1–P6.
   The legacy renderers (profileView and its patch layers) still build #profileScreenBody and
   remain the source of truth for every number; this layer reads their output, hides it and
   draws the modern layout. Interactive pieces forward to the original controls, so dialogs,
   pickers and the economy keep their behaviour. The Premium card stays the real element,
   in its required place: after the profile identity and before the statistics.
   Content text read from the legacy DOM stays in its own text node so the locale layers
   translate it exactly as before; interface copy for all five languages lives here. */
(()=>{
 'use strict';
 if(window.DEEN_DS_PROFILE)return;

 const L={
  tr:{narration:'Anlatım profili',kicker:'SENİN YOLCULUĞUN',edit:'Profili düzenle',settings:'Ayarlar',levelShort:n=>'Sv. '+n,toNext:n=>'Sonraki seviyeye '+n+' XP',streak:n=>n+' gün seri',
   stats:'İstatistikler',statsEmpty:'İlk dersini tamamla; istatistiklerin burada canlanır.',today:'Bugün ve bu hafta',week:'Bu hafta',quests:'Günlük görevler',questNote:'Her görev günlük sandığa bir mühür ekler.',
   badges:'Rozetler',earnedCount:(a,b)=>a+'/'+b+' kazanıldı',next:'Sıradaki',earned:'Kazanıldı',showAll:'Tümünü gör',showLess:'Daha az göster',
   prefs:'Tercihler',calendar:'Öğrenme takvimi',goal:'Günlük hedef',goalValue:n=>n+' ders',store:'Pırıltı mağazası',approach:'Öğrenme yaklaşımın'},
  en:{narration:'Narration style',kicker:'YOUR JOURNEY',edit:'Edit profile',settings:'Settings',levelShort:n=>'Lv '+n,toNext:n=>n+' XP to the next level',streak:n=>n===1?'1-day streak':n+'-day streak',
   stats:'Statistics',statsEmpty:'Finish your first lesson and your stats come to life here.',today:'Today and this week',week:'This week',quests:'Daily quests',questNote:'Each quest adds a seal to the daily chest.',
   badges:'Badges',earnedCount:(a,b)=>a+' of '+b+' earned',next:'Next',earned:'Earned',showAll:'See all',showLess:'Show less',
   prefs:'Preferences',calendar:'Learning calendar',goal:'Daily goal',goalValue:n=>n===1?'1 lesson':n+' lessons',store:'Sparkle shop',approach:'Your learning approach'},
  ar:{narration:'أسلوب الشرح',kicker:'رحلتك التعليمية',edit:'تعديل الملف الشخصي',settings:'الإعدادات',levelShort:n=>'م '+n,toNext:n=>'يتبقى '+n+' XP للمستوى التالي',streak:n=>'سلسلة '+n+' يوم',
   stats:'الإحصائيات',statsEmpty:'أكمل درسك الأول لتظهر إحصائياتك هنا.',today:'اليوم وهذا الأسبوع',week:'هذا الأسبوع',quests:'المهام اليومية',questNote:'كل مهمة تضيف ختمًا إلى صندوق اليوم.',
   badges:'الأوسمة',earnedCount:(a,b)=>'تم كسب '+a+' من '+b,next:'التالي',earned:'مكتسب',showAll:'عرض الكل',showLess:'عرض أقل',
   prefs:'التفضيلات',calendar:'تقويم التعلّم',goal:'الهدف اليومي',goalValue:n=>n+' دروس',store:'متجر البريق',approach:'نهج تعلّمك'},
  de:{narration:'Erzählstil',kicker:'DEINE REISE',edit:'Profil bearbeiten',settings:'Einstellungen',levelShort:n=>'Lvl '+n,toNext:n=>'Noch '+n+' XP bis zum nächsten Level',streak:n=>n===1?'1 Tag Serie':n+' Tage Serie',
   stats:'Statistiken',statsEmpty:'Schließe deine erste Lektion ab, dann erwachen deine Statistiken hier.',today:'Heute und diese Woche',week:'Diese Woche',quests:'Tägliche Aufgaben',questNote:'Jede Aufgabe fügt der Tagestruhe ein Siegel hinzu.',
   badges:'Abzeichen',earnedCount:(a,b)=>a+' von '+b+' verdient',next:'Als Nächstes',earned:'Verdient',showAll:'Alle anzeigen',showLess:'Weniger anzeigen',
   prefs:'Präferenzen',calendar:'Lernkalender',goal:'Tagesziel',goalValue:n=>n===1?'1 Lektion':n+' Lektionen',store:'Funkel-Shop',approach:'Dein Lernansatz'},
  fr:{narration:'Style de narration',kicker:'TON PARCOURS',edit:'Modifier le profil',settings:'Paramètres',levelShort:n=>'Niv. '+n,toNext:n=>'Encore '+n+' XP avant le niveau suivant',streak:n=>'Série de '+n+' j',
   stats:'Statistiques',statsEmpty:'Termine ta première leçon et tes statistiques prendront vie ici.',today:'Aujourd’hui et cette semaine',week:'Cette semaine',quests:'Quêtes du jour',questNote:'Chaque quête ajoute un sceau au coffre du jour.',
   badges:'Badges',earnedCount:(a,b)=>a+' sur '+b+' obtenus',next:'Prochain',earned:'Obtenu',showAll:'Tout voir',showLess:'Voir moins',
   prefs:'Préférences',calendar:'Calendrier d’apprentissage',goal:'Objectif du jour',goalValue:n=>n<=1?n+' leçon':n+' leçons',store:'Boutique d’étincelles',approach:'Ton approche d’apprentissage'}
 };

 const ICON={
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  pen:'<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
  flame:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.8 1.2 2.7 2 3-.5-3 0-6 1-8.5Z"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 13v4M8.5 20h7M10 17h4"/>',
  book:'<path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.5v-15Z"/><path d="M20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.5v-15Z"/>',
  chart:'<path d="M5 19V13M10 19V9M15 19V11M20 19V5"/>',
  star:'<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>',
  calendar:'<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6" fill="currentColor"/>',
  gem:'<path d="M6 4h12l3 5-9 11L3 9l3-5Z"/><path d="M3 9h18M9 4l3 16M15 4l-3 16"/>',
  voice:'<path d="M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Z"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
  chest:'<rect x="3.5" y="9" width="17" height="11" rx="2"/><path d="M5 9V7.5A3.5 3.5 0 0 1 8.5 4h7A3.5 3.5 0 0 1 19 7.5V9M3.5 13h17M11 12h2v3h-2z"/>',
  chevron:'<path d="m9 6 6 6-6 6"/>',
  compass:'<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>'
 };
 const svg=(name,cls='')=>'<svg class="dsp-ico '+cls+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+ICON[name]+'</svg>';
 const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
 // Legacy (Turkish-source) text in its own element so the locale layers can translate it.
 const data=v=>'<span class="dsp-data">'+esc(v)+'</span>';
 const appState=()=>{try{return state||{}}catch(_){return{}}};
 const levelInfo=()=>{try{return level()}catch(_){return null}};
 function lang(){
  let code='';try{code=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}
  code=String(code||document.documentElement.lang||'tr').slice(0,2).toLowerCase();
  return L[code]?code:'tr';
 }
 const txt=el=>(el?.textContent||'').replace(/\s+/g,' ').trim();
 const num=v=>{const m=String(v).match(/\d+/);return m?Number(m[0]):0};
 const pctOf=el=>{const w=el?.querySelector?.('i')?.style?.width||'';return Math.max(0,Math.min(100,parseFloat(w)||0))};
 let showAllBadges=false;

 // ---- read the legacy output -------------------------------------------------------------
 function read(body){
  const q=s=>body.querySelector(':scope>'+s);
  const head=q('.v5-profilehead');
  const panels=[...body.querySelectorAll(':scope>.v5-panel')];
  const levelPanel=panels.find(p=>p.querySelector('.v5-bar')&&/XP/.test(p.textContent)&&!p.querySelector('.v660-quest'));
  const weekPanel=panels.find(p=>p.querySelector('.v5-metricrow'));
  const questPanel=panels.find(p=>p.querySelector('.v660-quest,.v660-chest-card'));
  const metrics=[...(q('.v5-profilemetrics')?.children||[])].map(d=>({value:txt(d.querySelector('strong')),label:txt(d.querySelector('small'))}));
  const summary=[...(q('.v690-profile-summary')?.querySelectorAll('.v5-row')||[])].map(r=>({label:txt(r.querySelector('span')),value:txt(r.querySelector('b'))}));
  const listButtons=[...body.querySelectorAll(':scope>.v5-listbtn')];
  const storeBtn=listButtons.find(b=>/storePanel/.test(b.getAttribute('onclick')||''));
  const weekCard=q('.v54-week-card');
  const chest=questPanel?.querySelector('.v660-chest-card');
  const chestBtn=chest?.querySelector('button');
  return {
   head,avatar:head?.querySelector('.v5-avatar'),name:txt(head?.querySelector('h1')),
   level:levelInfo(),levelPanel,metrics,summary,
   narration:q('.v950-learning-profile'),analytics:q('.v970-analytics-card'),
   week:weekPanel&&{
    metrics:[...weekPanel.querySelectorAll('.v5-metricrow>span')].map(s=>({value:txt(s.firstChild),label:txt(s.querySelector('small'))})),
    lines:[...weekPanel.querySelectorAll(':scope>p')].map(p=>{const b=p.querySelector('b');return b?{label:txt(b),value:txt(p).slice(txt(b).length).trim()}:{text:txt(p)}})
   },
   rhythm:weekCard&&{title:txt(weekCard.querySelector('strong')),desc:txt(weekCard.querySelector('.v5-row small')),progress:txt(weekCard.querySelector('.v5-row>b')),
    dots:[...weekCard.querySelectorAll('.v54-week-dots i')].map(i=>i.className.trim().length>0),reward:txt(weekCard.querySelector(':scope>small'))},
   quests:[...(questPanel?.querySelectorAll('.v660-quest')||[])].map(x=>({title:txt(x.querySelector('.head b')),progress:txt(x.querySelector('.head span')),pct:pctOf(x.querySelector('.v5-bar')),done:x.classList.contains('done')||pctOf(x.querySelector('.v5-bar'))>=100})),
   chest:chest&&{title:txt(chest.querySelector('strong')),desc:txt(chest.querySelector('small')),progress:txt(chest.querySelector('.row>b')).replace(/\s*✦\s*/,''),
    button:txt(chestBtn),disabled:!!chestBtn?.disabled,open:!chest.classList.contains('locked')},
   badges:[...body.querySelectorAll(':scope>.v5-badges>.v5-badge')].map(b=>({id:b.dataset.badgeId,name:txt(b.querySelector('strong')),desc:txt(b.querySelector('small:not(.deen-badge-status)')),earned:b.classList.contains('earned'),art:b.querySelector('.deen-badge-art')})),
   store:storeBtn&&{value:num(txt(storeBtn).split('◇').pop())},
   footer:q('.v5-footer-note')
  };
 }

 // ---- draw ---------------------------------------------------------------------------------
 const TONES=['amber','gold','mint','sky','coral','mint'];
 const STAT_ICONS=['flame','trophy','book','chart','star','moon'];

 function identity(d,T){
  const st=appState(),lv=d.level||{n:1,progress:0,left:0},xp=Number(st.xp)||0,streak=Number(st.streak)||0;
  const r=46,c=2*Math.PI*r,p=Math.max(0,Math.min(100,Number(lv.progress)||0))/100;
  const companion=d.avatar?.getAttribute('title')||'';
  return '<section class="dsp-id" aria-label="'+esc(d.name)+'">'+
   '<button type="button" class="dsp-gear" data-dsp="settings" aria-label="'+esc(T.settings)+'">'+svg('gear')+'</button>'+
   '<div class="dsp-id-main">'+
    '<button type="button" class="dsp-avatar" data-dsp="avatar" aria-label="'+esc(d.avatar?.getAttribute('aria-label')||d.name)+'">'+
     '<svg class="dsp-avatar-ring" viewBox="0 0 104 104" aria-hidden="true"><circle cx="52" cy="52" r="'+r+'" class="track"/><circle cx="52" cy="52" r="'+r+'" class="fill" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+(c*(1-p)).toFixed(1)+'"/></svg>'+
     '<span class="dsp-avatar-slot"></span><span class="dsp-level-chip">'+esc(T.levelShort(lv.n))+'</span></button>'+
    '<div class="dsp-id-text"><h1>'+esc(d.name)+'</h1>'+(companion?'<p class="dsp-companion">'+data(companion)+'</p>':'')+
     '<button type="button" class="dsp-edit" data-dsp="edit">'+svg('pen')+esc(T.edit)+'</button></div>'+
   '</div>'+
   '<div class="dsp-xp"><div class="dsp-xp-row"><b>'+esc(xp)+' XP</b><span>'+esc(T.toNext(lv.left??0))+'</span></div><span class="dsp-bar gold"><i style="width:'+Math.round(p*100)+'%"></i></span></div>'+
   '<div class="dsp-id-chips"><span class="dsp-chip amber">'+svg('flame')+esc(T.streak(streak))+'</span><span class="dsp-chip gold">'+svg('gem')+esc(d.store?.value??(Number(st.currency)||0))+'</span></div>'+
  '</section>';
 }

 function stats(d,T){
  if(!d.metrics.length)return '';
  const empty=d.metrics.every(m=>num(m.value)===0);
  return '<section class="dsp-section"><h2 class="dsp-h2">'+esc(T.stats)+'</h2><div class="dsp-stats">'+d.metrics.map((m,i)=>
   '<div class="dsp-stat '+(TONES[i]||'mint')+'">'+svg(STAT_ICONS[i]||'star')+'<b>'+data(m.value)+'</b><small>'+data(m.label)+'</small></div>').join('')+'</div>'+
   (empty?'<p class="dsp-hint">'+svg('info')+esc(T.statsEmpty)+'</p>':'')+'</section>';
 }

 function today(d,T){
  const parts=[];
  if(d.week){
   parts.push('<div class="dsp-week"><h3>'+esc(T.week)+'</h3><div class="dsp-week-metrics">'+d.week.metrics.map(m=>'<span><b>'+data(m.value)+'</b><small>'+data(m.label)+'</small></span>').join('')+'</div>'+
    '<ul class="dsp-week-lines">'+d.week.lines.map(l=>l.text?'<li>'+data(l.text)+'</li>':'<li><b>'+data(l.label)+'</b> '+data(l.value)+'</li>').join('')+'</ul></div>');
  }
  if(d.rhythm){
   parts.push('<div class="dsp-rhythm"><div class="dsp-row"><span class="dsp-badge sky">'+svg('calendar')+'</span><div class="dsp-grow"><b>'+data(d.rhythm.title)+'</b><small>'+data(d.rhythm.desc)+'</small></div><strong>'+data(d.rhythm.progress)+'</strong></div>'+
    '<div class="dsp-dots">'+d.rhythm.dots.map(on=>'<i class="'+(on?'on':'')+'"></i>').join('')+'</div>'+(d.rhythm.reward?'<small class="dsp-reward">'+data(d.rhythm.reward)+'</small>':'')+'</div>');
  }
  if(d.quests.length||d.chest){
   parts.push('<div class="dsp-quests"><h3>'+esc(T.quests)+'</h3>'+d.quests.map(x=>
    '<div class="dsp-quest'+(x.done?' done':'')+'"><span class="dsp-badge mint">'+svg('target')+'</span><div class="dsp-grow"><div class="dsp-row"><b>'+data(x.title)+'</b><strong>'+data(x.progress)+'</strong></div><span class="dsp-bar mint"><i style="width:'+x.pct+'%"></i></span></div></div>').join('')+
    '<p class="dsp-note">'+esc(T.questNote)+'</p>'+
    (d.chest?'<div class="dsp-chest'+(d.chest.open?' open':'')+'"><span class="dsp-badge gold">'+svg('chest')+'</span><div class="dsp-grow"><b>'+data(d.chest.title)+'</b><small>'+data(d.chest.desc)+'</small></div><strong>'+data(d.chest.progress)+'</strong>'+
     '<button type="button" class="dsp-chest-btn" data-dsp="chest"'+(d.chest.disabled?' disabled':'')+'>'+data(d.chest.button)+'</button></div>':'')+
   '</div>');
  }
  return parts.length?'<section class="dsp-section"><h2 class="dsp-h2">'+esc(T.today)+'</h2><div class="dsp-card dsp-today">'+parts.join('<hr>')+'</div></section>':'';
 }

 function badges(d,T){
  if(!d.badges.length)return '';
  const earned=d.badges.filter(b=>b.earned),rest=d.badges.filter(b=>!b.earned);
  const ordered=[...earned,...rest],nextId=rest[0]?.id;
  const shown=showAllBadges?ordered:ordered.slice(0,6);
  return '<section class="dsp-section"><div class="dsp-section-row"><h2 class="dsp-h2">'+esc(T.badges)+'</h2><span class="dsp-count">'+esc(T.earnedCount(earned.length,d.badges.length))+'</span></div>'+
   '<div class="dsp-badges">'+shown.map(b=>'<div class="dsp-badge-card'+(b.earned?' earned':'')+(b.id===nextId?' next':'')+'" data-badge-id="'+esc(b.id)+'"><span class="dsp-art" data-art="'+esc(b.id)+'"></span>'+
    (b.id===nextId?'<span class="dsp-next">'+esc(T.next)+'</span>':'')+(b.earned?'<span class="dsp-earned">'+esc(T.earned)+'</span>':'')+
    '<b>'+data(b.name)+'</b><small>'+data(b.desc)+'</small></div>').join('')+'</div>'+
   (ordered.length>6?'<button type="button" class="dsp-link" data-dsp="badges">'+esc(showAllBadges?T.showLess:T.showAll)+'</button>':'')+'</section>';
 }

 function analytics(d){
  const a=d.analytics;if(!a)return '';
  const mini=[...a.querySelectorAll('.mini>span')].map(s=>'<span><b>'+data(txt(s.querySelector('b')))+'</b><small>'+data(txt(s).slice(txt(s.querySelector('b')).length).trim())+'</small></span>').join('');
  return '<button type="button" class="dsp-card dsp-analytics" data-dsp="analytics"><div class="dsp-row"><span class="dsp-badge sky">'+svg('chart')+'</span><div class="dsp-grow"><span class="dsp-eyebrow">'+data(txt(a.querySelector('.kicker')))+'</span><b>'+data(txt(a.querySelector('h3')))+'</b><small>'+data(txt(a.querySelector('p')))+'</small></div><strong class="dsp-score">'+data(txt(a.querySelector('.score')))+'</strong></div>'+
   (mini?'<div class="dsp-mini">'+mini+'</div>':'')+'</button>';
 }

 function prefs(d,T){
  const st=appState(),rows=[];
  const row=(key,icon,tone,label,value)=>'<button type="button" class="dsp-pref" data-dsp="'+key+'"><span class="dsp-badge '+tone+'">'+svg(icon)+'</span><span class="dsp-grow">'+label+'</span>'+(value?'<span class="dsp-pref-value">'+value+'</span>':'')+svg('chevron','dsp-flip dsp-chev')+'</button>';
  if(d.narration){const val=txt(d.narration.querySelector('b')).replace(/^◇\s*/,'');rows.push(row('narration','voice','gold',esc(T.narration),data(val)))}
  rows.push(row('calendar','calendar','sky',esc(T.calendar),''));
  // The daily rhythm (lessons · minutes) is the goal's value, so it is not repeated below.
  const rhythm=d.summary[0];
  rows.push(row('goal','target','mint',esc(T.goal),rhythm?data(rhythm.value):esc(T.goalValue(Number(st.dailyGoal)||0))));
  if(d.store)rows.push(row('store','gem','gold',esc(T.store),esc(d.store.value)));
  rows.push(row('settings','gear','muted',esc(T.settings),''));
  const facts=d.summary.slice(1);
  const approach=facts.length?'<details class="dsp-approach"><summary>'+svg('compass')+'<span class="dsp-grow">'+esc(T.approach)+'</span>'+svg('chevron','dsp-chev dsp-rot')+'</summary><dl>'+
   facts.map(s=>'<div><dt>'+data(s.label)+'</dt><dd>'+data(s.value)+'</dd></div>').join('')+'</dl></details>':'';
  return '<section class="dsp-section"><h2 class="dsp-h2">'+esc(T.prefs)+'</h2><div class="dsp-card dsp-prefs">'+rows.join('')+approach+'</div></section>';
 }

 // ---- mount ---------------------------------------------------------------------------------
 let busy=false,lastRender=0,approachOpen=false;
 function render(){
  const body=document.getElementById('profileScreenBody');if(!body||busy)return false;
  const head=body.querySelector(':scope>.v5-profilehead');if(!head)return false;
  busy=true;
  try{
   const d=read(body),code=lang(),T=L[code];
   const keep=body.scrollTop,animate=Date.now()-lastRender>1500;lastRender=Date.now();
   approachOpen=!!body.querySelector('.dsp-approach[open]')||approachOpen&&!!body.querySelector('.dsp-approach');
   body.querySelectorAll(':scope>.dsp-top,:scope>.dsp-rest').forEach(n=>n.remove());
   const top=document.createElement('div');top.className='dsp dsp-top'+(animate?' dsp-anim':'');top.dataset.dspLang=code;
   top.innerHTML='<div class="dsp-kicker">'+esc(T.kicker)+'</div>'+identity(d,T);
   const rest=document.createElement('div');rest.className='dsp dsp-rest'+(animate?' dsp-anim':'');rest.dataset.dspLang=code;
   rest.innerHTML=stats(d,T)+today(d,T)+badges(d,T)+analytics(d)+prefs(d,T)+(d.footer?'<p class="dsp-footer">'+[...d.footer.childNodes].filter(n=>n.nodeType===3).map(n=>data(n.textContent.trim())).join(' ')+'</p>':'');
   // The real avatar and badge art are cloned so their images and state stay identical.
   // Companion artwork; the legacy avatar (emoji or initial) is the fallback.
   const slot=top.querySelector('.dsp-avatar-slot'),animal=String(appState().profile?.companion||'').replace(/[^a-z]/g,'');
   const fallback=()=>{if(!d.avatar)return;const a=d.avatar.cloneNode(true);a.removeAttribute('onclick');a.removeAttribute('id');a.setAttribute('aria-hidden','true');a.classList.add('dsp-avatar-clone');slot.replaceChildren(a)};
   if(animal){const img=new Image();img.alt='';img.decoding='async';img.src='./assets/companions/'+animal+'/'+animal+'_avatar.png';img.onerror=fallback;slot.append(img)}else fallback();
   for(const slot of rest.querySelectorAll('.dsp-art[data-art]')){const b=d.badges.find(x=>x.id===slot.dataset.art);if(b?.art){const art=b.art.cloneNode(true);art.removeAttribute('id');slot.append(art)}}
   if(approachOpen)rest.querySelector('.dsp-approach')?.setAttribute('open','');
   // Required order: identity → Premium card (real element) → everything else; legacy stays hidden.
   const hub=body.querySelector(':scope>.deen-hub-profile');
   if(hub)decoratePremium(hub,code);
   head.after(top);(hub?(top.after(hub),hub):top).after(rest);
   for(const child of body.children){if(child!==top&&child!==rest&&child!==hub)child.classList.add('dsp-hide')}
   body.classList.add('dsp-host');body.scrollTop=keep;
   return true;
  }catch(err){console.warn('DEEN_DS_PROFILE',err);return false}
  finally{busy=false;observer?.takeRecords()}
 }

 // Premium card in the reference style. DEEN_PREMIUM_HUB renders it (copy, actions, active
 // state); this only adds art, icons and an accented copy of the headline and perks. The
 // originals stay in the DOM, visually hidden, so the hub's tests and screen readers see them.
 const PREMIUM_ACCENT={tr:'zarif yolu.',en:'way to learn.',ar:'براحة أكثر.',de:'mehr Komfort.',fr:'plus sereinement.'};
 const PICON={
  crown:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 8.5 8 12l4-6.5 4 6.5 4.5-3.5-1.8 9.5H5.3L3.5 8.5Z" fill="currentColor"/><rect x="5.3" y="19" width="13.4" height="2.2" rx="1.1" fill="currentColor"/></svg>',
  infinity:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M7.2 8.2c-2.3 0-4.2 1.7-4.2 3.8s1.9 3.8 4.2 3.8c3.6 0 6-7.6 9.6-7.6 2.3 0 4.2 1.7 4.2 3.8s-1.9 3.8-4.2 3.8c-3.6 0-6-7.6-9.6-7.6Z"/></svg>',
  refresh:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 8a7.5 7.5 0 0 0-13.3 1"/><path d="M19 4v4h-4"/><path d="M5 16a7.5 7.5 0 0 0 13.3-1"/><path d="M5 20v-4h4"/></svg>',
  chart:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="13" width="4" height="7" rx="1" fill="currentColor"/><rect x="10" y="9" width="4" height="11" rx="1" fill="currentColor"/><rect x="16.5" y="4.5" width="4" height="15.5" rx="1" fill="currentColor" opacity=".75"/></svg>',
  gift:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="3.5" y="9" width="17" height="4" rx="1"/><path d="M5 13v7.5h14V13M12 9v11.5"/><path d="M12 9c-1.5-3.5-5.5-4.2-5.5-1.8C6.5 8.6 9 9 12 9Zm0 0c1.5-3.5 5.5-4.2 5.5-1.8C17.5 8.6 15 9 12 9Z"/></svg>',
  chevron:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
  rays:'<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="4.2" stroke-linecap="round"><path d="M10 22 8 12"/><path d="M19 20 25 9"/><path d="M24 29 34 25"/></svg>',
  swoosh:'<svg class="dsp-swoosh" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M3 9.5C55 3.5 120 2 197 5.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/><path d="M40 10.5C90 7 140 6.5 182 8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".55"/></svg>'
 };
 const PERK_ICONS=['infinity','refresh','chart'];
 function decoratePremium(hub,code){
  hub.classList.add('dsp-prem');
  if(!hub.querySelector(':scope>.dsp-prem-art')){
   const art=new Image();art.className='dsp-prem-art';art.alt='';art.decoding='async';art.setAttribute('aria-hidden','true');art.src='assets/design/mosque-arch.webp';
   hub.prepend(art);
  }
  for(const el of hub.querySelectorAll('.dh-crown,.dh-status')){
   if(!el.querySelector('.dsp-crown'))el.insertAdjacentHTML('afterbegin','<span class="dsp-crown">'+PICON.crown+'</span>');
  }
  const headline=hub.querySelector('.dh-headline');
  if(headline){
   headline.classList.add('dsp-sr');
   const text=headline.textContent.trim();let copy=hub.querySelector('.dsp-prem-title');
   if(copy&&copy.dataset.dspSource!==text){copy.remove();copy=null}
   if(!copy&&text){
    const accent=PREMIUM_ACCENT[code],at=accent?text.lastIndexOf(accent):-1;
    const words=text.split(/\s+/),lead=at>0?text.slice(0,at).trim():words.slice(0,-2).join(' '),tail=at>0?accent:words.slice(-2).join(' ');
    copy=document.createElement('div');copy.className='dsp-prem-title';copy.dataset.dspSource=text;copy.setAttribute('aria-hidden','true');
    const em=document.createElement('em');em.textContent=tail;
    copy.append(document.createTextNode(lead?lead+' ':''),em);
    copy.insertAdjacentHTML('beforeend','<span class="dsp-rays">'+PICON.rays+'</span>'+PICON.swoosh);
    headline.after(copy);
   }
  }
  hub.querySelector('.dh-summary')?.classList.add('dsp-sr');
  const perks=hub.querySelector('.dh-perks');
  if(perks){
   perks.classList.add('dsp-sr');
   const text=perks.textContent.trim();let list=hub.querySelector('.dsp-prem-perks');
   if(list&&list.dataset.dspSource!==text){list.remove();list=null}
   if(!list&&text){
    list=document.createElement('div');list.className='dsp-prem-perks';list.dataset.dspSource=text;list.setAttribute('aria-hidden','true');
    text.split(/\s*·\s*/).slice(0,3).forEach((label,i)=>{
     const item=document.createElement('span');item.className='dsp-prem-perk';item.innerHTML=PICON[PERK_ICONS[i]];
     const b=document.createElement('b');b.textContent=label.charAt(0).toLocaleUpperCase(code)+label.slice(1);item.append(b);list.append(item);
    });
    perks.after(list);
   }
  }
  const main=hub.querySelector('.dh-main');
  if(main&&!main.querySelector('.dsp-prem-disc')){
   main.insertAdjacentHTML('afterbegin','<span class="dsp-prem-disc" aria-hidden="true">'+PICON.crown+'</span>');
   main.insertAdjacentHTML('beforeend','<span class="dsp-prem-end" aria-hidden="true">'+PICON.chevron+'</span>');
  }
  const trial=hub.querySelector('.dh-compare');
  if(trial&&!trial.querySelector('.dsp-prem-disc'))trial.insertAdjacentHTML('afterbegin','<span class="dsp-prem-disc" aria-hidden="true">'+PICON.gift+'</span>');
 }

 const legacyClick=sel=>document.querySelector('#profileScreenBody>'+sel)?.click();
 document.addEventListener('click',event=>{
  const el=event.target.closest?.('#profileScreenBody .dsp [data-dsp]');if(!el||el.disabled)return;
  const k=el.dataset.dsp;event.preventDefault();
  const call=fn=>{try{window[fn]?.()}catch(err){console.warn('DEEN_DS_PROFILE_ACTION',fn,err)}};
  if(k==='settings')call('settingsPanel');
  else if(k==='edit')call('editProfile');
  else if(k==='avatar'){const a=document.querySelector('#profileScreenBody>.v5-profilehead .v5-avatar');a?a.click():call('editProfile')}
  else if(k==='calendar')call('streakPanel');
  else if(k==='goal')call('goalPanel');
  else if(k==='store')call('storePanel');
  else if(k==='narration')legacyClick('.v950-learning-profile');
  else if(k==='analytics')legacyClick('.v970-analytics-card');
  else if(k==='chest'){try{window.DEEN_ECONOMY?.openDailyChest?.()}catch(err){console.warn('DEEN_DS_PROFILE_ACTION','chest',err)}}
  else if(k==='badges'){showAllBadges=!showAllBadges;render()}
 });
 document.addEventListener('toggle',event=>{if(event.target.matches?.('#profileScreenBody .dsp-approach'))approachOpen=event.target.open},true);

 // Legacy layers add their sections at different times; redraw once they settle.
 let observer=null,queued=false;
 const schedule=()=>{if(queued)return;queued=true;setTimeout(()=>{queued=false;render()},0)};
 function install(){
  const body=document.getElementById('profileScreenBody');
  if(typeof window.profileView!=='function'||!body){setTimeout(install,300);return}
  const base=window.profileView;
  window.profileView=function(){let out;try{out=base.apply(this,arguments)}catch(err){console.warn('DEEN_DS_PROFILE_BASE',err)}render();return out};
  observer=new MutationObserver(rows=>{if(busy)return;if(rows.some(r=>[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1&&!n.classList?.contains('dsp'))))schedule()});
  observer.observe(body,{childList:true});
  const active=()=>document.getElementById('profileScreen')?.classList.contains('active');
  document.addEventListener('deen:ui-updated',()=>{if(active())schedule()});
  if(body.querySelector(':scope>.v5-profilehead'))render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 window.DEEN_DS_PROFILE=Object.freeze({render,version:'ds-profile-v1',strings:L});
})();
