/* Quran tab on the design system.
   quran-arabic-paths.js and the surah engine keep rendering every view and own all
   behaviour (each control keeps its data-qpath-action). This layer only adds presentation:
   progress on the two hub cards, a "next lesson" card and section headings on the Arabic
   path (it clicks the real lesson button), and a 12px floor for legacy text. */
(()=>{
 'use strict';
 if(window.DEEN_DS_QURAN)return;

 const L={
  tr:{heroSub:'Harf harf, ayet ayet ilerle.',overall:'Genel ilerleme',unit:n=>'ÜNİTE '+n,lettersUnit:'28 harf',workshopsUnit:'Telaffuz atölyeleri',go:'BAŞLA',lessons:(a,b)=>a+'/'+b+' ders tamamlandı',surahs:n=>n+' sure · dinle, ezberle, tekrar et',next:'SIRADAKİ DERS',start:'Derse başla',
   lessonsHeading:'Dersler',practiceHeading:'Ölçüm ve pekiştirme',planHeading:'Planın'},
  en:{heroSub:'Letter by letter, verse by verse.',overall:'Overall progress',unit:n=>'UNIT '+n,lettersUnit:'The 28 letters',workshopsUnit:'Pronunciation workshops',go:'START',lessons:(a,b)=>a+' of '+b+' lessons done',surahs:n=>n+' surahs · listen, memorise, review',next:'NEXT LESSON',start:'Start lesson',
   lessonsHeading:'Lessons',practiceHeading:'Practice and progress checks',planHeading:'Your plan'},
  ar:{heroSub:'حرفًا حرفًا، وآيةً آية.',overall:'التقدّم العام',unit:n=>'الوحدة '+n,lettersUnit:'الحروف الثمانية والعشرون',workshopsUnit:'ورش النطق',go:'ابدأ',lessons:(a,b)=>'أُنجز '+a+' من '+b+' دروس',surahs:n=>n+' سورة · استمع واحفظ وراجع',next:'الدرس التالي',start:'ابدأ الدرس',
   lessonsHeading:'الدروس',practiceHeading:'التدريب وقياس التقدّم',planHeading:'خطتك'},
  de:{heroSub:'Buchstabe für Buchstabe, Vers für Vers.',overall:'Gesamtfortschritt',unit:n=>'EINHEIT '+n,lettersUnit:'Die 28 Buchstaben',workshopsUnit:'Aussprache-Werkstätten',go:'START',lessons:(a,b)=>a+' von '+b+' Lektionen erledigt',surahs:n=>n+' Suren · hören, auswendig lernen, wiederholen',next:'NÄCHSTE LEKTION',start:'Lektion starten',
   lessonsHeading:'Lektionen',practiceHeading:'Üben und Fortschritt prüfen',planHeading:'Dein Plan'},
  fr:{heroSub:'Lettre après lettre, verset après verset.',overall:'Progression globale',unit:n=>'UNITÉ '+n,lettersUnit:'Les 28 lettres',workshopsUnit:'Ateliers de prononciation',go:'COMMENCER',lessons:(a,b)=>a+' leçons sur '+b+' terminées',surahs:n=>n+' sourates · écoute, mémorise, révise',next:'PROCHAINE LEÇON',start:'Commencer la leçon',
   lessonsHeading:'Leçons',practiceHeading:'Pratique et suivi des progrès',planHeading:'Ton plan'}
 };
 function lang(){
  let code='';try{code=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}
  code=String(code||document.documentElement.lang||'tr').slice(0,2).toLowerCase();
  return L[code]?code:'tr';
 }
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n};
 const ARROW='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';
 const PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.5v9l7.5-4.5L9 7.5Z" fill="currentColor"/></svg>';

 function arabicProgress(){
  const s=window.DEEN_QURAN_PATHS?.status?.();if(!s)return null;
  let done=0;for(const [k,v] of Object.entries(s))if(/CompletedLessons$/.test(k)&&typeof v==='number')done+=v;
  let total=Number(s.overallLessonCount)||0;
  const m=window.DEEN_ARABIC_MARKS?.progress?.();if(m&&total){done+=m.done;total+=m.total}
  return total?{done:Math.min(done,total),total}:null;
 }
 function surahCount(){
  try{const inv=window.DEEN_QURAN_CONTENT?.inventory?.()||[];return new Set(inv.map(x=>x.surah_id)).size}catch(_){return 0}
 }

 function decorateHome(view,T){
  const arabic=view.querySelector('.deen-path-card.deen-path-arabic'),surah=view.querySelector('.deen-path-card.deen-path-surah');
  const p=arabicProgress();
  if(arabic&&p&&!arabic.querySelector('.dsq-progress')){
   const box=el('span','dsq-progress');
   const bar=el('span','dsq-bar');const fill=el('i');fill.style.width=Math.round(p.done/p.total*100)+'%';bar.append(fill);
   box.append(el('span','dsq-progress-text',T.lessons(p.done,p.total)),bar);
   arabic.querySelector('.deen-path-copy')?.append(box);
  }
  const n=surahCount();
  if(surah&&n&&!surah.querySelector('.dsq-progress')){
   const box=el('span','dsq-progress');box.append(el('span','dsq-progress-text',T.surahs(n)));
   surah.querySelector('.deen-path-copy')?.append(box);
  }
  for(const card of [arabic,surah]){if(card&&!card.querySelector('.dsq-go')){const go=el('span','dsq-go');go.innerHTML=ARROW;go.setAttribute('aria-hidden','true');card.append(go)}}
 }

 function decorateArabic(landing,T){
  if(landing.querySelector(':scope>.dsq-next,:scope>.dsq-heading')){if(landing.classList.contains('dsq-pathed'))pathLate(landing,T);return}
  // The reading-signs unit (its own layer) sits after the sukūn/shadda/madd unit, before the words.
  const marks=window.DEEN_ARABIC_MARKS?.section?.();
  if(marks){const before=landing.querySelector(':scope>.deen-path-word-section');if(before)landing.insertBefore(marks,before);else landing.append(marks)}
  // Each unit ends with a review node (its own layer).
  window.DEEN_ARABIC_REVIEW?.attach?.(landing,T);
  const items=[...landing.querySelectorAll('[data-qpath-action="group"],.dsq-marks-item,.dsq-review-item')];
  const next=items.find(b=>!b.disabled&&!/\bis-(complete|completed|done)\b/.test(b.className));
  if(next){
   const card=el('button','dsq-next');card.type='button';
   const eyebrow=el('span','dsq-next-eyebrow',T.next);
   const title=el('b','dsq-next-title',next.querySelector('.deen-path-course-number')?.textContent||'');
   const foot=el('small','dsq-next-foot',next.querySelector('.deen-path-course-item-foot')?.textContent||'');
   const glyphs=el('span','dsq-next-glyphs',next.querySelector('.deen-path-course-glyphs')?.textContent||'');glyphs.lang='ar';glyphs.dir='rtl';
   const cta=el('span','dsq-next-cta');cta.innerHTML='<span class="dsq-play">'+PLAY+'</span>';cta.append(el('span','',T.start));
   const copy=el('span','dsq-next-copy');copy.append(eyebrow,title,foot);
   card.append(copy,glyphs,cta);
   card.addEventListener('click',()=>next.click());
   landing.append(card);
  }
  landing.append(el('h3','dsq-heading dsq-heading-plan',T.planHeading),el('h3','dsq-heading dsq-heading-lessons',T.lessonsHeading),el('h3','dsq-heading dsq-heading-practice',T.practiceHeading));
  pathify(landing,T,next);
 }

 /* The lessons read as one path: a night hero with the companion, an overall progress card, then
    each course as a unit card (icon, title, arrow to its next lesson) over a vertical list of round
    lesson nodes (the engine's own buttons, restyled) joined by a line. The next lesson pulses with a
    start bubble; done and next-locked lessons say so beside the node. */
 const UNIT_ICONS={
  letters:'<path d="M4 19V6.5A1.5 1.5 0 0 1 5.5 5H11v14H5.5A1.5 1.5 0 0 0 4 20.5"/><path d="M20 19V6.5A1.5 1.5 0 0 0 18.5 5H13v14h5.5a1.5 1.5 0 0 1 1.5 1.5"/>',
  workshops:'<path d="M12 4a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3z"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3"/>',
  vowel:'<path d="M7 7h10M9 17h6"/><circle cx="12" cy="12" r="2.2"/>',
  reading:'<path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.6"/>',
  word:'<rect x="3.5" y="7" width="7" height="10" rx="2"/><rect x="13.5" y="7" width="7" height="10" rx="2"/>',
  meaning:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  phrase:'<path d="M4 5.5h16v10H9l-5 4z"/>',
  marks:'<path d="M5 19h14"/><path d="M8 15c0-3 2-4 4-4s4 1 4 4"/><circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/>',
  pattern:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  listening:'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>'
 };
 const svg=d=>'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>';
 function companion(){let p='owl';try{p=window.state?.profile?.companion||p}catch(_){}return String(p).replace(/[^a-z]/g,'')||'owl'}
 const isDone=n=>/\bis-(complete|completed|done)\b/.test(n.className);
 const firstOpen=nodes=>nodes.find(n=>!n.disabled&&!isDone(n))||nodes.find(n=>!n.disabled);
 function unitOf(before,title,nodes,key,loose){
  const open=nodes.some(n=>!n.disabled);
  const banner=el('div','dsq-unit'+(open?'':' is-locked')+(loose?' dsq-unit-loose':''));
  const icon=el('span','dsq-unit-icon');icon.innerHTML=svg(UNIT_ICONS[key]||UNIT_ICONS.letters);
  const copy=el('span','dsq-unit-copy');copy.append(el('small',''),el('b','',title));
  banner.append(icon,copy);
  if(open){
   const go=el('button','dsq-unit-go');go.type='button';go.innerHTML=ARROW;go.setAttribute('aria-label',title);
   go.addEventListener('click',()=>firstOpen(nodes)?.click());banner.append(go);
  }
  before.parentNode.insertBefore(banner,before);
  nodes.forEach((n,j)=>{
   n.classList.add('dsq-node');
   const g=n.querySelector('.deen-path-course-glyphs,.dsm-entry-glyphs');if(g&&g.textContent.replace(/\s+/g,'').length>7){g.classList.add('dsq-long');g.dataset.dsqShort=g.textContent.trim().split(/\s+/)[0]}
   if(isDone(n))n.classList.add('dsq-done');
   if(j<nodes.length-1&&!n.querySelector(':scope>.dsq-line')){const line=el('span','dsq-line');line.setAttribute('aria-hidden','true');n.prepend(line)}
  });
 }
 // A short status beside the node, from the engine's own (screen-reader) status text.
 function statusOf(n,text){
  if(n.querySelector('.dsq-status'))return;
  const t=String(text||'').replace(/^[\s\u{1F512}\u2713\u2714]+/u,'').trim();if(!t)return;
  const s=el('span','dsq-status',t);s.setAttribute('aria-hidden','true');
  (n.querySelector('.deen-path-course-item-top,.dsm-entry-copy')||n).append(s);
 }
 function statuses(landing){
  const nodes=[...landing.querySelectorAll('.dsq-node')];let nextLocked=false;
  for(const n of nodes){
   const raw=n.querySelector('.deen-path-course-status,.dsm-entry-sub')?.textContent||'';
   if(n.classList.contains('dsq-done')||n.classList.contains('dsq-cur'))statusOf(n,raw);
   else if(n.disabled&&!nextLocked&&nodes.some(x=>x.classList.contains('dsq-cur'))&&nodes.indexOf(n)>nodes.findIndex(x=>x.classList.contains('dsq-cur'))){nextLocked=true;n.classList.add('dsq-next-lock');statusOf(n,raw)}
  }
 }
 // The pronunciation workshops are added by their own layer, possibly after this pass: they get
 // their unit whenever they appear, and the unit numbers follow page order.
 function pathLate(landing,T){
  const workshops=[...landing.querySelectorAll(':scope>.dsm-entry:not(.dsq-node)')];
  if(workshops.length&&!landing.querySelector(':scope>.dsq-unit-loose'))unitOf(workshops[0],T.workshopsUnit,workshops,'workshops',true);
  else workshops.forEach(n=>{n.classList.add('dsq-node');if(isDone(n))n.classList.add('dsq-done')});
  // Units are numbered in page order and take turns through five colours.
  landing.querySelectorAll('.dsq-unit small').forEach((s,i)=>{const t=T.unit(i+1);if(s.textContent!==t)s.textContent=t;const u=s.closest('.dsq-unit'),tone=String(i%5);if(u.dataset.tone!==tone)u.dataset.tone=tone});
  statuses(landing);
 }
 function hero(landing,T){
  if(landing.querySelector(':scope>.dsq-hero'))return;
  const box=el('div','dsq-hero');
  const copy=el('div','dsq-hero-copy');
  const back=landing.querySelector(':scope>.deen-path-back'),title=landing.querySelector(':scope>.deen-path-inner-title');
  if(back)box.append(back);
  if(title)copy.append(title);
  copy.append(el('p','dsq-hero-sub',T.heroSub));box.append(copy);
  const pet=companion(),img=new Image();img.className='dsq-hero-pet';img.alt='';img.decoding='async';img.setAttribute('aria-hidden','true');
  img.addEventListener('error',()=>{if(!img.src.includes('/owl/'))img.src='assets/companions/owl/owl_lesson_idle.png'},{once:true});
  img.src='assets/companions/'+pet+'/'+pet+'_lesson_idle.png';box.append(img);
  landing.prepend(box);
  const p=arabicProgress();
  if(p){
   const card=el('div','dsq-prog');const row=el('div','dsq-prog-row');row.append(el('span','',T.overall),el('b','',p.done+' / '+p.total));
   const bar=el('span','dsq-bar');const fill=el('i');fill.style.width=Math.round(p.done/p.total*100)+'%';bar.append(fill);
   card.append(row,bar);box.after(card);
  }
 }
 function pathify(landing,T,next){
  landing.classList.add('dsq-pathed');
  hero(landing,T);
  const grid=landing.querySelector(':scope>.deen-path-course-grid');
  if(grid)unitOf(grid,T.lettersUnit,[...grid.querySelectorAll('.deen-path-course-item,.dsq-review-item')],'letters');
  for(const sec of landing.querySelectorAll(':scope>section')){
   const nodes=[...sec.querySelectorAll(':scope>.deen-path-course-item,:scope>.dsq-review-item')];if(!nodes.length)continue;
   sec.classList.add('dsq-unit-section');
   const key=(String(sec.className).match(/deen-path-(vowel|reading|marks|word|meaning|phrase|pattern|listening)-section/)||[])[1];
   unitOf(sec.querySelector(':scope>h3')||nodes[0],sec.querySelector(':scope>h3')?.textContent||'',nodes,key);
  }
  if(next&&next.classList.contains('dsq-node')){
   next.classList.add('dsq-cur');
   const bubble=el('span','dsq-bubble',T.go);bubble.setAttribute('aria-hidden','true');next.prepend(bubble);
  }
  pathLate(landing,T);
 }

 // Legacy surah and path styles go down to 7px; lift anything below 12px to 12px.
 // Each element is checked once (again only when its classes change).
 const floored=new WeakMap();
 function textFloor(root){
  for(const n of root.querySelectorAll('*')){
   const cls=n.getAttribute('class')||'';if(floored.get(n)===cls)continue;
   if(n.closest('svg')){floored.set(n,cls);continue}
   if(![...n.childNodes].some(c=>c.nodeType===3&&c.data.trim()))continue;
   floored.set(n,cls);
   const size=parseFloat(getComputedStyle(n).fontSize);
   if(size&&size<12)n.style.setProperty('font-size','12px','important');
  }
 }

 // The Arabic path plays its entrance only when arriving from another view (not after a lesson).
 let lastView='';
 function entrance(landing){
  if(landing.dataset.dsqEntered)return;landing.dataset.dsqEntered='1';
  if(lastView==='arabic'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  [...landing.querySelectorAll('.dsq-unit,.dsq-node')].slice(0,9).forEach((n,i)=>n.style.setProperty('--dsq-k',String(i)));
  landing.classList.add('dsq-enter');setTimeout(()=>landing.classList.remove('dsq-enter'),1600);
 }
 function decorate(){
  const body=document.getElementById('leagueScreenBody');if(!body)return;
  const T=L[lang()];
  const home=body.querySelector('#deenQuranPathView .deen-path-home');if(home)decorateHome(home,T);
  const landing=body.querySelector('#deenQuranPathView .deen-path-arabic-landing');if(landing){decorateArabic(landing,T);entrance(landing)}
  lastView=landing?'arabic':body.dataset.deenLearningPath||'';
  if(document.getElementById('leagueScreen')?.classList.contains('active'))textFloor(body);
 }

 let queued=false;
 const schedule=()=>{if(queued)return;queued=true;setTimeout(()=>{queued=false;decorate()},60)};
 function install(){
  const body=document.getElementById('leagueScreenBody');
  if(!body){setTimeout(install,300);return}
  // Views are swapped as direct children of the screen body and inside the surah shell.
  new MutationObserver(rows=>{if(rows.some(r=>r.addedNodes.length))schedule()}).observe(body,{childList:true,subtree:true});
  document.addEventListener('deen:ui-updated',schedule);
  decorate();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 window.DEEN_DS_QURAN=Object.freeze({decorate,version:'ds-quran-v1',strings:L});
})();
