/* Quran tab on the design system.
   quran-arabic-paths.js and the surah engine keep rendering every view and own all
   behaviour (each control keeps its data-qpath-action). This layer only adds presentation:
   progress on the two hub cards, a "next lesson" card and section headings on the Arabic
   path (it clicks the real lesson button), and a 12px floor for legacy text. */
(()=>{
 'use strict';
 if(window.DEEN_DS_QURAN)return;

 const L={
  tr:{unit:n=>'ÜNİTE '+n,lettersUnit:'28 harf',workshopsUnit:'Telaffuz atölyeleri',go:'BAŞLA',lessons:(a,b)=>a+'/'+b+' ders tamamlandı',surahs:n=>n+' sure · dinle, ezberle, tekrar et',next:'SIRADAKİ DERS',start:'Derse başla',
   lessonsHeading:'Dersler',practiceHeading:'Ölçüm ve pekiştirme',planHeading:'Planın'},
  en:{unit:n=>'UNIT '+n,lettersUnit:'The 28 letters',workshopsUnit:'Pronunciation workshops',go:'START',lessons:(a,b)=>a+' of '+b+' lessons done',surahs:n=>n+' surahs · listen, memorise, review',next:'NEXT LESSON',start:'Start lesson',
   lessonsHeading:'Lessons',practiceHeading:'Practice and progress checks',planHeading:'Your plan'},
  ar:{unit:n=>'الوحدة '+n,lettersUnit:'الحروف الثمانية والعشرون',workshopsUnit:'ورش النطق',go:'ابدأ',lessons:(a,b)=>'أُنجز '+a+' من '+b+' دروس',surahs:n=>n+' سورة · استمع واحفظ وراجع',next:'الدرس التالي',start:'ابدأ الدرس',
   lessonsHeading:'الدروس',practiceHeading:'التدريب وقياس التقدّم',planHeading:'خطتك'},
  de:{unit:n=>'EINHEIT '+n,lettersUnit:'Die 28 Buchstaben',workshopsUnit:'Aussprache-Werkstätten',go:'START',lessons:(a,b)=>a+' von '+b+' Lektionen erledigt',surahs:n=>n+' Suren · hören, auswendig lernen, wiederholen',next:'NÄCHSTE LEKTION',start:'Lektion starten',
   lessonsHeading:'Lektionen',practiceHeading:'Üben und Fortschritt prüfen',planHeading:'Dein Plan'},
  fr:{unit:n=>'UNITÉ '+n,lettersUnit:'Les 28 lettres',workshopsUnit:'Ateliers de prononciation',go:'COMMENCER',lessons:(a,b)=>a+' leçons sur '+b+' terminées',surahs:n=>n+' sourates · écoute, mémorise, révise',next:'PROCHAINE LEÇON',start:'Commencer la leçon',
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
  const total=Number(s.overallLessonCount)||0;
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
  const items=[...landing.querySelectorAll('[data-qpath-action="group"]')];
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

 /* The lessons read as one winding path: each course becomes a unit with a banner, each lesson
    button a round node (the engine's own button, restyled), the next lesson pulses with a
    start bubble and the companion beside it. */
 const SWAY=[0,-62,-86,-62,0,62,86,62];
 function companion(){let p='owl';try{p=window.state?.profile?.companion||p}catch(_){}return String(p).replace(/[^a-z]/g,'')||'owl'}
 let unitCount=0;
 function unitOf(before,title,nodes,loose){
  const shift=(unitCount++%2)*4;
  const banner=el('div','dsq-unit'+(nodes.some(n=>!n.disabled)?'':' is-locked')+(loose?' dsq-unit-loose':''));
  const copy=el('span','dsq-unit-copy');copy.append(el('small',''),el('b','',title));banner.append(copy);
  const sample=(nodes[0]?.querySelector('.deen-path-course-glyphs,.dsm-entry-glyphs')?.textContent||'').trim();
  if(sample){const g=el('span','dsq-unit-glyphs',sample);g.lang='ar';g.dir='rtl';banner.append(g)}
  before.parentNode.insertBefore(banner,before);
  nodes.forEach((n,j)=>{
   n.classList.add('dsq-node');n.style.setProperty('--dsq-dx',SWAY[(j+shift)%SWAY.length]+'px');
   const g=n.querySelector('.deen-path-course-glyphs,.dsm-entry-glyphs');if(g&&g.textContent.replace(/\s+/g,'').length>7){g.classList.add('dsq-long');g.dataset.dsqShort=g.textContent.trim().split(/\s+/)[0]}
   if(/\bis-(complete|completed|done)\b/.test(n.className))n.classList.add('dsq-done');
  });
 }
 // The pronunciation workshops are added by their own layer, possibly after this pass: they get
 // their unit whenever they appear, and the unit numbers follow page order.
 function pathLate(landing,T){
  const workshops=[...landing.querySelectorAll(':scope>.dsm-entry:not(.dsq-node)')];
  if(workshops.length&&!landing.querySelector(':scope>.dsq-unit-loose'))unitOf(workshops[0],T.workshopsUnit,workshops,true);
  else workshops.forEach(n=>{n.classList.add('dsq-node');if(/\bis-(complete|completed|done)\b/.test(n.className))n.classList.add('dsq-done')});
  // Units are numbered in page order and take turns through five colours.
  landing.querySelectorAll('.dsq-unit small').forEach((s,i)=>{const t=T.unit(i+1);if(s.textContent!==t)s.textContent=t;const u=s.closest('.dsq-unit'),tone=String(i%5);if(u.dataset.tone!==tone)u.dataset.tone=tone});
 }
 function pathify(landing,T,next){
  landing.classList.add('dsq-pathed');unitCount=0;
  const grid=landing.querySelector(':scope>.deen-path-course-grid');
  if(grid)unitOf(grid,T.lettersUnit,[...grid.querySelectorAll('.deen-path-course-item')]);
  for(const sec of landing.querySelectorAll(':scope>section')){
   const nodes=[...sec.querySelectorAll(':scope>.deen-path-course-item')];if(!nodes.length)continue;
   sec.classList.add('dsq-unit-section');
   unitOf(sec.querySelector(':scope>h3')||nodes[0],sec.querySelector(':scope>h3')?.textContent||'',nodes);
  }
  pathLate(landing,T);
  if(next&&next.classList.contains('dsq-node')){
   next.classList.add('dsq-cur');
   const bubble=el('span','dsq-bubble',T.go);bubble.setAttribute('aria-hidden','true');next.prepend(bubble);
   const dx=parseFloat(next.style.getPropertyValue('--dsq-dx'))||0;
   const pet=companion(),img=new Image();img.className='dsq-mascot '+(dx>0?'is-left':'is-right');img.alt='';img.decoding='async';img.setAttribute('aria-hidden','true');
   img.addEventListener('error',()=>{if(!img.src.includes('/owl/'))img.src='assets/companions/owl/owl_lesson_idle.png'},{once:true});
   img.src='assets/companions/'+pet+'/'+pet+'_lesson_idle.png';
   next.append(img);
  }
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

 function decorate(){
  const body=document.getElementById('leagueScreenBody');if(!body)return;
  const T=L[lang()];
  const home=body.querySelector('#deenQuranPathView .deen-path-home');if(home)decorateHome(home,T);
  const landing=body.querySelector('#deenQuranPathView .deen-path-arabic-landing');if(landing)decorateArabic(landing,T);
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
