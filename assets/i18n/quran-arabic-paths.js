/* DEEN Qur'an learning paths · phase 1.
   Existing surah lessons remain authoritative. Arabic starter is free and
   intentionally has no synthesized Quran recitation or unverified audio. */
(()=>{
 'use strict';
 if(window.DEEN_QURAN_PATHS)return;
 const STORE='deen_arabic_foundations_intro_v1';
 const LETTERS=[
  {id:'alif',glyph:'ا',labels:{tr:'Elif',en:'Alif',ar:'ألف',de:'Alif',fr:'Alif'}},
  {id:'ba',glyph:'ب',labels:{tr:'Be',en:'Bā',ar:'باء',de:'Bā',fr:'Bā'}},
  {id:'ta',glyph:'ت',labels:{tr:'Te',en:'Tā',ar:'تاء',de:'Tā',fr:'Tā'}}
 ];
 const i18n={
  tr:{kicker:'KUR’AN ÖĞRENME MERKEZİ',homeTitle:'Kur’an yolculuğun',homeSub:'Harfleri tanı, okumayı öğren, sureleri keşfet.',arabic:'Arapça Öğren',arabicSub:'Sıfırdan harfler, harekeler ve okumaya ilk adım.',surah:'Sure Öğren ve Ezberle',surahSub:'Mevcut sureler, ayet dinleme, ezber ve tekrar.',arabicAction:'Arapça Öğrenmeye Başla',surahAction:'Surelere Geç',back:'Öğrenme yolları',preview:'İLK DERS',introTitle:'İlk üç harfi tanıyalım',introSub:'Elif, Be ve Te harflerinin şekillerini öğren. İlk alıştırmada doğru harfe dokun.',firstLesson:'Harfleri Tanı · 1',lessonStart:'Mini Dersi Başlat',completed:'İlk mini ders tamamlandı',completedDesc:'Harika! Üç harfi tanıdın. Sonraki derslerde tüm harfleri, harekeleri ve sesleri öğreneceğiz.',redo:'Yeniden Çalış',next:'Sonraki Soru',finish:'Dersi Tamamla',question:'Hangi harf?',correct:'Doğru! Harfi tanıdın.',wrong:'Bir daha dene. Harfin şeklini karşılaştır.',progress:'Soru',free:'ÜCRETSİZ',future:'28 harf ve diğer dersler adım adım eklenecek. Şimdilik sesli kıraat veya tam bir Arapça kursu sunulmuyor.',status:'İlk ders hazır'},
  en:{kicker:'QURAN LEARNING CENTER',homeTitle:'Your Quran journey',homeSub:'Recognize letters, learn to read and explore surahs.',arabic:'Learn Arabic',arabicSub:'Begin with letters, vowels and reading skills.',surah:'Learn & Memorize Surahs',surahSub:'Your existing surahs, audio, memorization and review.',arabicAction:'Start Learning Arabic',surahAction:'Explore Surahs',back:'Learning paths',preview:'FIRST LESSON',introTitle:'Meet the first three letters',introSub:'Learn to recognize Alif, Bā and Tā. Tap the correct letter in the exercise.',firstLesson:'Letter Recognition · 1',lessonStart:'Start Mini Lesson',completed:'First mini lesson completed',completedDesc:'Well done! You recognized three letters. More letters, vowels and sounds come next.',redo:'Practice Again',next:'Next Question',finish:'Complete Lesson',question:'Which letter?',correct:'Correct! You recognized the letter.',wrong:'Try again. Compare the letter shapes.',progress:'Question',free:'FREE',future:'The full 28-letter path and more lessons will follow. Recitation audio is not available in this starter yet.',status:'First lesson ready'},
  ar:{kicker:'مركز تعلّم القرآن',homeTitle:'رحلتك مع القرآن',homeSub:'تعرّف على الحروف، وتعلّم القراءة، واستكشف السور.',arabic:'تعلّم العربية',arabicSub:'ابدأ بالحروف والحركات وأساسيات القراءة.',surah:'تعلّم السور وحفظها',surahSub:'السور الحالية والاستماع والحفظ والمراجعة.',arabicAction:'ابدأ تعلّم الحروف',surahAction:'انتقل إلى السور',back:'مسارات التعلّم',preview:'الدرس الأول',introTitle:'تعرّف على أول ثلاثة حروف',introSub:'تعرّف على أشكال الألف والباء والتاء، ثم اختر الحرف الصحيح.',firstLesson:'تمييز الحروف · ١',lessonStart:'ابدأ الدرس القصير',completed:'أكملت الدرس الأول',completedDesc:'أحسنت! تعرّفت على ثلاثة حروف. ستأتي بقية الحروف والحركات والأصوات في الدروس التالية.',redo:'أعِد التدريب',next:'السؤال التالي',finish:'أنهِ الدرس',question:'أي حرف هذا؟',correct:'صحيح! تعرّفت على الحرف.',wrong:'حاول مجددًا، وقارن بين أشكال الحروف.',progress:'سؤال',free:'مجاني',future:'ستُضاف الحروف الـ٢٨ والدروس تدريجيًا. الصوت والتلاوة غير متاحين بعد في هذه المقدمة.',status:'الدرس الأول جاهز'},
  de:{kicker:'KORAN-LERNZENTRUM',homeTitle:'Deine Koran-Reise',homeSub:'Erkenne Buchstaben, lerne lesen und entdecke Suren.',arabic:'Arabisch lernen',arabicSub:'Starte mit Buchstaben, Vokalzeichen und Lesen.',surah:'Suren lernen und auswendig lernen',surahSub:'Vorhandene Suren, Anhören, Auswendiglernen und Wiederholung.',arabicAction:'Arabisch lernen starten',surahAction:'Suren entdecken',back:'Lernwege',preview:'ERSTE LEKTION',introTitle:'Die ersten drei Buchstaben',introSub:'Erkenne Alif, Bā und Tā und tippe im Quiz auf den richtigen Buchstaben.',firstLesson:'Buchstaben erkennen · 1',lessonStart:'Mini-Lektion starten',completed:'Erste Mini-Lektion geschafft',completedDesc:'Prima! Du erkennst drei Buchstaben. Weitere Buchstaben, Vokalzeichen und Laute folgen.',redo:'Erneut üben',next:'Nächste Frage',finish:'Lektion abschließen',question:'Welcher Buchstabe?',correct:'Richtig erkannt!',wrong:'Versuche es erneut. Vergleiche die Buchstabenformen.',progress:'Frage',free:'KOSTENLOS',future:'Alle 28 Buchstaben und weitere Lektionen folgen. Audio ist in dieser Einführung noch nicht verfügbar.',status:'Erste Lektion verfügbar'},
  fr:{kicker:'CENTRE D’APPRENTISSAGE DU CORAN',homeTitle:'Ton parcours coranique',homeSub:'Reconnais les lettres, apprends à lire et découvre les sourates.',arabic:'Apprendre l’arabe',arabicSub:'Commence par les lettres, les voyelles et la lecture.',surah:'Apprendre et mémoriser les sourates',surahSub:'Sourates actuelles, écoute, mémorisation et révision.',arabicAction:'Commencer l’arabe',surahAction:'Explorer les sourates',back:'Parcours d’apprentissage',preview:'PREMIÈRE LEÇON',introTitle:'Découvre les trois premières lettres',introSub:'Apprends à reconnaître Alif, Bā et Tā, puis touche la bonne lettre.',firstLesson:'Reconnaître les lettres · 1',lessonStart:'Commencer la mini-leçon',completed:'Première mini-leçon terminée',completedDesc:'Bravo ! Tu reconnais trois lettres. Les autres lettres, voyelles et sons arrivent ensuite.',redo:'Recommencer',next:'Question suivante',finish:'Terminer la leçon',question:'Quelle lettre ?',correct:'Bonne réponse !',wrong:'Réessaie en comparant les formes.',progress:'Question',free:'GRATUIT',future:'Les 28 lettres et les autres leçons seront ajoutées progressivement. Cette introduction ne propose pas encore d’audio.',status:'Première leçon prête'}
 };
 const lang=()=>{let x=window.DEEN_APP_LOCALE?.get?.()||document.documentElement.lang||'tr';x=String(x).toLowerCase().split('-')[0];return i18n[x]?x:'tr'};
 const t=()=>i18n[lang()];
 const state={view:'home',question:0,correct:false,feedback:'',complete:false};
 const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'null')}catch(_){return null}};
 const savedComplete=()=>!!read()?.completed;
 function saveCompleted(){try{localStorage.setItem(STORE,JSON.stringify({completed:true,completedAt:Date.now(),schema:1}))}catch(_){}}
 function root(){return document.getElementById('leagueScreenBody')}
 const letterLabel=item=>item.labels[lang()]||item.labels.tr;
 const elem=(tag,className,text)=>{const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e};
 function makeButton(label,action,className){
  const b=elem('button',className,label);b.type='button';b.dataset.qpathAction=action;return b;
 }
 function topBar(){
  const c=t(),wrap=elem('section','deen-path-top');wrap.id='deenQuranPathNav';
  const eyebrow=elem('div','deen-path-kicker',c.kicker);
  const title=elem('h1','deen-path-title',c.homeTitle);
  const sub=elem('p','deen-path-description',c.homeSub);
  wrap.append(eyebrow,title,sub);return wrap;
 }
 function homeView(){
  const c=t(),view=elem('div','deen-path-home');
  const tiles=[
   {kind:'arabic',glyph:'ب',title:c.arabic,description:c.arabicSub,button:c.arabicAction},
   {kind:'surah',glyph:'۞',title:c.surah,description:c.surahSub,button:c.surahAction}
  ];
  for(const tile of tiles){
   const button=makeButton('',tile.kind,'deen-path-card deen-path-'+tile.kind);
   const symbol=elem('span','deen-path-symbol',tile.glyph);symbol.setAttribute('aria-hidden','true');symbol.lang='ar';symbol.dir='rtl';
   const copy=elem('span','deen-path-copy');copy.append(elem('strong','',tile.title),elem('small','',tile.description));
   const action=elem('span','deen-path-link',tile.button+'  →');
   button.append(symbol,copy,action);view.appendChild(button);
  }
  return view;
 }
 function alphabetView(){
  const c=t(),box=elem('section','deen-path-arabic-landing');
  const back=makeButton('←  '+c.back,'home','deen-path-back');box.appendChild(back);
  box.append(elem('span','deen-path-pill',c.preview+' · '+c.free),elem('h2','deen-path-inner-title',c.introTitle),elem('p','deen-path-muted',c.introSub));
  const samples=elem('div','deen-path-letter-row');
  for(const item of LETTERS){
   const card=elem('div','deen-path-letter-card');card.append(elem('span','deen-path-glyph',item.glyph),elem('small','',letterLabel(item)));samples.appendChild(card);
  }
  box.append(samples,elem('p','deen-path-muted deen-path-warning',c.future),makeButton(savedComplete()?c.redo:c.lessonStart,'start','deen-path-primary'));
  if(savedComplete())box.appendChild(elem('p','deen-path-completed',c.completed+' ✓'));
  return box;
 }
 function lessonView(){
  const c=t(),box=elem('section','deen-path-lesson');
  box.append(makeButton('←  '+c.back,'arabic','deen-path-back'));
  const item=LETTERS[state.question],n=state.question+1;
  box.append(elem('div','deen-path-kicker',c.firstLesson),elem('p','deen-path-question-count',c.progress+' '+n+' / '+LETTERS.length),elem('h2','deen-path-inner-title',c.question));
  box.append(elem('div','deen-path-prompt',letterLabel(item)));
  const options=elem('div','deen-path-options');
  for(const candidate of [LETTERS[(state.question+1)%3],LETTERS[state.question],LETTERS[(state.question+2)%3]]){
   const b=makeButton(candidate.glyph,'answer','deen-path-option');
   b.dataset.letterId=candidate.id;b.lang='ar';b.dir='rtl';
   if(state.correct&&candidate.id===item.id)b.classList.add('deen-path-option-correct');
   options.appendChild(b);
  }
  box.appendChild(options);
  if(state.feedback){
   const f=elem('p','deen-path-feedback'+(state.correct?' is-correct':' is-wrong'),state.feedback);
   f.setAttribute('role','status');box.appendChild(f);
  }
  if(state.correct)box.appendChild(makeButton(state.question===2?c.finish:c.next,'next','deen-path-primary'));
  return box;
 }
 function completedView(){
  const c=t(),box=elem('section','deen-path-completion');
  box.append(elem('div','deen-path-complete-star','✦'),elem('h2','deen-path-inner-title',c.completed),elem('p','deen-path-muted',c.completedDesc));
  box.append(makeButton(c.redo,'start','deen-path-primary'),makeButton('←  '+c.back,'arabic','deen-path-back'));
  return box;
 }
 function show(view){
  state.view=view;const container=root();if(!container)return false;
  ensure();
  update();return true;
 }
 function start(){
  state.question=0;state.correct=false;state.feedback='';state.complete=false;
  return show('lesson');
 }
 function next(){
  if(!state.correct)return;
  if(state.question<LETTERS.length-1){state.question++;state.correct=false;state.feedback='';show('lesson')}
  else{state.complete=true;saveCompleted();show('complete')}
 }
 function answer(id){
  if(state.view!=='lesson'||state.correct)return;
  state.correct=id===LETTERS[state.question].id;
  state.feedback=state.correct?t().correct:t().wrong;
  update();
 }
 function update(){
  const container=root();if(!container)return;
  container.dataset.deenLearningPath=state.view;
  const nav=container.querySelector('#deenQuranPathNav');
  if(nav)nav.replaceWith(topBar());
  container.querySelector('#deenQuranPathView')?.remove();
  if(state.view==='surah'){
   const returnBar=elem('div','deen-path-surah-return');
   returnBar.id='deenQuranPathView';
   returnBar.append(makeButton('←  '+t().back,'home','deen-path-back'));
   container.querySelector('#deenQuranPathNav')?.after(returnBar);
  }else{
   const panel=elem('div','deen-path-view');panel.id='deenQuranPathView';
   panel.appendChild(state.view==='home'?homeView():state.view==='arabic'?alphabetView():state.view==='lesson'?lessonView():completedView());
   container.querySelector('#deenQuranPathNav')?.after(panel);
  }
 }
 let observer=null,scheduled=false;
 function ensure(){
  const container=root();
  if(!container||!container.querySelector('.deen-quran-shell'))return false;
  if(!container.querySelector('#deenQuranPathNav')){
   container.prepend(topBar());
   if(!container.querySelector('#deenQuranPathView'))update();
  }
  return true;
 }
 function scheduleEnsure(){
  if(scheduled)return;scheduled=true;
  queueMicrotask(()=>{scheduled=false;ensure()});
 }
 function init(){
  const container=root();if(!container||container.dataset.deenPathsBound==='1')return;
  container.dataset.deenPathsBound='1';
  container.addEventListener('click',e=>{
   const b=e.target.closest?.('[data-qpath-action]');if(!b||!container.contains(b))return;
   const action=b.dataset.qpathAction;
   if(['home','arabic','surah'].includes(action))show(action);
   else if(action==='start')start();
   else if(action==='answer')answer(b.dataset.letterId);
   else if(action==='next')next();
  });
  observer=new MutationObserver(scheduleEnsure);
  observer.observe(container,{childList:true});
  ensure();
  document.addEventListener('deen:navigated',()=>{
   if(document.querySelector('.screen.active')?.id==='leagueScreen'){
    state.view='home';
    setTimeout(()=>{if(ensure())update()},0);
   }
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.DEEN_QURAN_PATHS=Object.freeze({enterArabic:()=>show('arabic'),openSurahs:()=>show('surah'),home:()=>show('home'),start,ensure,refresh:update,status:()=>({view:state.view,lessonAvailable:true,complete:savedComplete(),lessonLetters:LETTERS.map(x=>x.id)}),version:'quran-arabic-paths-phase1'});
})();