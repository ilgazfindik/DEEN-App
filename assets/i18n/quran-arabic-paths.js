/* DEEN Qur'an learning paths · phase 1.
   Existing surah lessons remain authoritative. Arabic starter is free and
   intentionally has no synthesized Quran recitation or unverified audio. */
(()=>{
 'use strict';
 if(window.DEEN_QURAN_PATHS)return;
 const STORE='deen_arabic_foundations_intro_v1';
 const CURRICULUM=window.DEEN_ARABIC_LETTERS;
 if(!CURRICULUM||CURRICULUM.count!==28||CURRICULUM.lessonCount!==7)throw Error('DEEN_ARABIC_LETTERS_MISSING');
 const LETTERS=CURRICULUM.all;
 const LESSONS=CURRICULUM.lessons;
 const PROGRESS_STORE='deen_arabic_foundations_v2';
 const legacyStore=STORE;
 const extra={
  tr:{course:'28 Arapça harf · 7 mini ders',lesson:'Ders',openLesson:'Dersi İncele',locked:'Önceki dersi tamamla',done:'Tamamlandı',new:'Başlamaya hazır',allLetters:'28 Harf ve Yazılış Biçimleri',atlasHelp:'Başta, ortada ve sonda harflerin biçimleri değişebilir. Bazı harfler kendilerinden sonraki harfle birleşmez.',alone:'Tek',begin:'Başta',middle:'Ortada',end:'Sonda',noMiddle:'Birleşmez',noJoin:'Sonraki harfle birleşmez',goLesson:'Alıştırmaya Başla',nextLesson:'Sonraki Derse Geç',courseProgress:'Harf öğrenme ilerlemen',courseComplete:'Tüm 7 ders tamamlandı!',courseCompleteDesc:'28 harfin adlarını tanıma alıştırmalarını bitirdin. Sonraki aşamada harekeler ve telaffuz çalışacağız.',groupTitle:'Harfleri tanıma',courseInfo:'Seslendirme henüz eklenmedi. Harflerin adlarını ve yazılışlarını öğreneceğiz.',shape:'Yazılış biçimleri',letters:'harf'},
  en:{course:'28 Arabic letters · 7 mini lessons',lesson:'Lesson',openLesson:'Explore lesson',locked:'Complete the previous lesson',done:'Completed',new:'Ready to start',allLetters:'28 Letters & Writing Forms',atlasHelp:'Letters can change shape at the beginning, middle and end. Some do not connect to the next letter.',alone:'Isolated',begin:'Initial',middle:'Medial',end:'Final',noMiddle:'Does not join',noJoin:'Does not connect forward',goLesson:'Start Practice',nextLesson:'Next Lesson',courseProgress:'Your letter-learning progress',courseComplete:'All 7 lessons complete!',courseCompleteDesc:'You practiced recognizing all 28 letters. Vowels and verified pronunciation will come next.',groupTitle:'Recognize letters',courseInfo:'Audio is not yet included. Start with names and letter forms.',shape:'Writing forms',letters:'letters'},
  ar:{course:'٢٨ حرفًا عربيًا · ٧ دروس قصيرة',lesson:'الدرس',openLesson:'استعرض الدرس',locked:'أكمل الدرس السابق',done:'مكتمل',new:'جاهز للبدء',allLetters:'الحروف الـ٢٨ وأشكال كتابتها',atlasHelp:'قد يتغيّر شكل الحرف في أول الكلمة ووسطها وآخرها. بعض الحروف لا تتصل بما بعدها.',alone:'منفصل',begin:'في البداية',middle:'في الوسط',end:'في النهاية',noMiddle:'لا يتصل',noJoin:'لا يتصل بما بعده',goLesson:'ابدأ التدريب',nextLesson:'الدرس التالي',courseProgress:'تقدّمك في تعلّم الحروف',courseComplete:'أكملت الدروس السبعة!',courseCompleteDesc:'تدرّبت على تمييز الحروف الـ٢٨. ستأتي الحركات والنطق الموثّق لاحقًا.',groupTitle:'تمييز الحروف',courseInfo:'لم يُضف الصوت بعد. ابدأ بأسماء الحروف وأشكالها.',shape:'أشكال الكتابة',letters:'حروف'},
  de:{course:'28 arabische Buchstaben · 7 Mini-Lektionen',lesson:'Lektion',openLesson:'Lektion ansehen',locked:'Vorherige Lektion abschließen',done:'Abgeschlossen',new:'Bereit',allLetters:'28 Buchstaben und Schreibformen',atlasHelp:'Buchstaben können am Anfang, in der Mitte und am Ende anders aussehen. Manche verbinden sich nicht mit dem nächsten Buchstaben.',alone:'Einzeln',begin:'Anfang',middle:'Mitte',end:'Ende',noMiddle:'Keine Verbindung',noJoin:'Verbindet nicht nach links',goLesson:'Übung starten',nextLesson:'Nächste Lektion',courseProgress:'Fortschritt beim Buchstabenlernen',courseComplete:'Alle 7 Lektionen abgeschlossen!',courseCompleteDesc:'Du hast alle 28 Buchstaben geübt. Vokalzeichen und geprüfte Aussprache folgen.',groupTitle:'Buchstaben erkennen',courseInfo:'Audio kommt später. Beginne mit Namen und Schreibformen.',shape:'Schreibformen',letters:'Buchstaben'},
  fr:{course:'28 lettres arabes · 7 mini-leçons',lesson:'Leçon',openLesson:'Découvrir la leçon',locked:'Termine la leçon précédente',done:'Terminée',new:'Prête',allLetters:'28 lettres et leurs formes',atlasHelp:'Les lettres peuvent changer de forme au début, au milieu et à la fin du mot. Certaines ne se lient pas à la lettre suivante.',alone:'Isolée',begin:'Initiale',middle:'Médiane',end:'Finale',noMiddle:'Pas de liaison',noJoin:'Ne se lie pas à la suivante',goLesson:'Commencer l’exercice',nextLesson:'Leçon suivante',courseProgress:'Ta progression dans les lettres',courseComplete:'Les 7 leçons sont terminées !',courseCompleteDesc:'Tu as appris à reconnaître les 28 lettres. Les voyelles et la prononciation vérifiée viendront ensuite.',groupTitle:'Reconnaître les lettres',courseInfo:'L’audio sera ajouté plus tard. Commence par le nom et la forme des lettres.',shape:'Formes écrites',letters:'lettres'}
 };
 const i18n={
  tr:{kicker:'KUR’AN ÖĞRENME MERKEZİ',homeTitle:'Kur’an yolculuğun',homeSub:'Harfleri tanı, okumayı öğren, sureleri keşfet.',arabic:'Arapça Öğren',arabicSub:'Sıfırdan harfler, harekeler ve okumaya ilk adım.',surah:'Sure Öğren ve Ezberle',surahSub:'Mevcut sureler, ayet dinleme, ezber ve tekrar.',arabicAction:'Arapça Öğrenmeye Başla',surahAction:'Surelere Geç',back:'Öğrenme yolları',preview:'İLK DERS',introTitle:'İlk üç harfi tanıyalım',introSub:'Elif, Be ve Te harflerinin şekillerini öğren. İlk alıştırmada doğru harfe dokun.',firstLesson:'Harfleri Tanı · 1',lessonStart:'Mini Dersi Başlat',completed:'İlk mini ders tamamlandı',completedDesc:'Harika! Üç harfi tanıdın. Sonraki derslerde tüm harfleri, harekeleri ve sesleri öğreneceğiz.',redo:'Yeniden Çalış',next:'Sonraki Soru',finish:'Dersi Tamamla',question:'Hangi harf?',correct:'Doğru! Harfi tanıdın.',wrong:'Bir daha dene. Harfin şeklini karşılaştır.',progress:'Soru',free:'ÜCRETSİZ',future:'28 harf ve diğer dersler adım adım eklenecek. Şimdilik sesli kıraat veya tam bir Arapça kursu sunulmuyor.',status:'İlk ders hazır'},
  en:{kicker:'QURAN LEARNING CENTER',homeTitle:'Your Quran journey',homeSub:'Recognize letters, learn to read and explore surahs.',arabic:'Learn Arabic',arabicSub:'Begin with letters, vowels and reading skills.',surah:'Learn & Memorize Surahs',surahSub:'Your existing surahs, audio, memorization and review.',arabicAction:'Start Learning Arabic',surahAction:'Explore Surahs',back:'Learning paths',preview:'FIRST LESSON',introTitle:'Meet the first three letters',introSub:'Learn to recognize Alif, Bā and Tā. Tap the correct letter in the exercise.',firstLesson:'Letter Recognition · 1',lessonStart:'Start Mini Lesson',completed:'First mini lesson completed',completedDesc:'Well done! You recognized three letters. More letters, vowels and sounds come next.',redo:'Practice Again',next:'Next Question',finish:'Complete Lesson',question:'Which letter?',correct:'Correct! You recognized the letter.',wrong:'Try again. Compare the letter shapes.',progress:'Question',free:'FREE',future:'The full 28-letter path and more lessons will follow. Recitation audio is not available in this starter yet.',status:'First lesson ready'},
  ar:{kicker:'مركز تعلّم القرآن',homeTitle:'رحلتك مع القرآن',homeSub:'تعرّف على الحروف، وتعلّم القراءة، واستكشف السور.',arabic:'تعلّم العربية',arabicSub:'ابدأ بالحروف والحركات وأساسيات القراءة.',surah:'تعلّم السور وحفظها',surahSub:'السور الحالية والاستماع والحفظ والمراجعة.',arabicAction:'ابدأ تعلّم الحروف',surahAction:'انتقل إلى السور',back:'مسارات التعلّم',preview:'الدرس الأول',introTitle:'تعرّف على أول ثلاثة حروف',introSub:'تعرّف على أشكال الألف والباء والتاء، ثم اختر الحرف الصحيح.',firstLesson:'تمييز الحروف · ١',lessonStart:'ابدأ الدرس القصير',completed:'أكملت الدرس الأول',completedDesc:'أحسنت! تعرّفت على ثلاثة حروف. ستأتي بقية الحروف والحركات والأصوات في الدروس التالية.',redo:'أعِد التدريب',next:'السؤال التالي',finish:'أنهِ الدرس',question:'أي حرف هذا؟',correct:'صحيح! تعرّفت على الحرف.',wrong:'حاول مجددًا، وقارن بين أشكال الحروف.',progress:'سؤال',free:'مجاني',future:'ستُضاف الحروف الـ٢٨ والدروس تدريجيًا. الصوت والتلاوة غير متاحين بعد في هذه المقدمة.',status:'الدرس الأول جاهز'},
  de:{kicker:'KORAN-LERNZENTRUM',homeTitle:'Deine Koran-Reise',homeSub:'Erkenne Buchstaben, lerne lesen und entdecke Suren.',arabic:'Arabisch lernen',arabicSub:'Starte mit Buchstaben, Vokalzeichen und Lesen.',surah:'Suren lernen und auswendig lernen',surahSub:'Vorhandene Suren, Anhören, Auswendiglernen und Wiederholung.',arabicAction:'Arabisch lernen starten',surahAction:'Suren entdecken',back:'Lernwege',preview:'ERSTE LEKTION',introTitle:'Die ersten drei Buchstaben',introSub:'Erkenne Alif, Bā und Tā und tippe im Quiz auf den richtigen Buchstaben.',firstLesson:'Buchstaben erkennen · 1',lessonStart:'Mini-Lektion starten',completed:'Erste Mini-Lektion geschafft',completedDesc:'Prima! Du erkennst drei Buchstaben. Weitere Buchstaben, Vokalzeichen und Laute folgen.',redo:'Erneut üben',next:'Nächste Frage',finish:'Lektion abschließen',question:'Welcher Buchstabe?',correct:'Richtig erkannt!',wrong:'Versuche es erneut. Vergleiche die Buchstabenformen.',progress:'Frage',free:'KOSTENLOS',future:'Alle 28 Buchstaben und weitere Lektionen folgen. Audio ist in dieser Einführung noch nicht verfügbar.',status:'Erste Lektion verfügbar'},
  fr:{kicker:'CENTRE D’APPRENTISSAGE DU CORAN',homeTitle:'Ton parcours coranique',homeSub:'Reconnais les lettres, apprends à lire et découvre les sourates.',arabic:'Apprendre l’arabe',arabicSub:'Commence par les lettres, les voyelles et la lecture.',surah:'Apprendre et mémoriser les sourates',surahSub:'Sourates actuelles, écoute, mémorisation et révision.',arabicAction:'Commencer l’arabe',surahAction:'Explorer les sourates',back:'Parcours d’apprentissage',preview:'PREMIÈRE LEÇON',introTitle:'Découvre les trois premières lettres',introSub:'Apprends à reconnaître Alif, Bā et Tā, puis touche la bonne lettre.',firstLesson:'Reconnaître les lettres · 1',lessonStart:'Commencer la mini-leçon',completed:'Première mini-leçon terminée',completedDesc:'Bravo ! Tu reconnais trois lettres. Les autres lettres, voyelles et sons arrivent ensuite.',redo:'Recommencer',next:'Question suivante',finish:'Terminer la leçon',question:'Quelle lettre ?',correct:'Bonne réponse !',wrong:'Réessaie en comparant les formes.',progress:'Question',free:'GRATUIT',future:'Les 28 lettres et les autres leçons seront ajoutées progressivement. Cette introduction ne propose pas encore d’audio.',status:'Première leçon prête'}
 };
 // Curriculum messages override phase-1 placeholders after the full 28-letter release.
 for(const [code,future,finished] of [
  ['tr','Harekeler, hece birleştirme ve doğrulanmış harf sesleri sonraki aşamalarda eklenecek.','Bu dersteki harfleri tanıdın. Sıradaki harf grubuna devam edebilirsin.'],
  ['en','Vowel marks, syllables and verified letter audio will be added in later stages.','You recognized this group of letters. Continue to the next group when ready.'],
  ['ar','ستُضاف الحركات والمقاطع والأصوات الموثّقة في المراحل القادمة.','تعرّفت على حروف هذا الدرس. يمكنك الانتقال إلى المجموعة التالية.'],
  ['de','Vokalzeichen, Silben und geprüfte Buchstaben-Audios folgen später.','Du erkennst diese Buchstaben. Weiter geht es mit der nächsten Gruppe.'],
  ['fr','Les voyelles, les syllabes et les sons vérifiés seront ajoutés par la suite.','Tu reconnais les lettres de ce groupe. Tu peux passer au suivant.']
 ]){extra[code].future=future;extra[code].completedDesc=finished}
 const lang=()=>{let x=window.DEEN_APP_LOCALE?.get?.()||document.documentElement.lang||'tr';x=String(x).toLowerCase().split('-')[0];return i18n[x]?x:'tr'};
 const t=()=>Object.assign({},i18n[lang()],extra[lang()]);
 const state={view:'home',lessonIndex:0,question:0,correct:false,feedback:'',complete:false};
 const storage=()=>{try{
  const v=JSON.parse(localStorage.getItem(PROGRESS_STORE)||'null');
  const completed=(v&&Array.isArray(v.completed))?v.completed.filter(x=>LESSONS.some(y=>y.id===x)):[];
  // Preserve existing phase-1 learners. Migrating to v2 never erases the old record.
  if(JSON.parse(localStorage.getItem(legacyStore)||'null')?.completed&&!completed.includes(LESSONS[0].id))completed.unshift(LESSONS[0].id);
  return {schema:2,completed:[...new Set(completed)]};
 }catch(_){return {schema:2,completed:[]}}};
 const completed=()=>storage().completed;
 const savedComplete=()=>completed().includes(LESSONS[0].id);
 function saveCompleted(){
  const ids=completed(),id=LESSONS[state.lessonIndex].id;
  if(!ids.includes(id))ids.push(id);
  try{localStorage.setItem(PROGRESS_STORE,JSON.stringify({schema:2,completed:ids,updatedAt:Date.now()}));
   if(state.lessonIndex===0)localStorage.setItem(legacyStore,JSON.stringify({completed:true,completedAt:Date.now(),schema:1}));
  }catch(_){}
 }
 const group=()=>LESSONS[state.lessonIndex];
 const groupLetters=()=>group().letters;
 const isUnlocked=i=>i===0||completed().includes(LESSONS[i-1].id);
 function root(){return document.getElementById('leagueScreenBody')}
 const letterLabel=item=>item.names?.[lang()]||item.names?.tr||item.glyph;
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
 function lettersStrip(items){
  const samples=elem('div','deen-path-letter-row');
  for(const item of items){
   const card=elem('div','deen-path-letter-card');
   card.append(elem('span','deen-path-glyph',item.glyph),elem('small','',letterLabel(item)));
   samples.appendChild(card);
  }
  return samples;
 }
 function shapeAtlas(items){
  const c=t(),table=elem('div','deen-path-shape-atlas');
  table.setAttribute('role','table');table.setAttribute('aria-label',c.shape);
  const h=elem('div','deen-path-shape-row deen-path-shape-head');
  h.setAttribute('role','row');
  for(const name of [c.alone,c.begin,c.middle,c.end]){
   const cell=elem('span','',name);cell.setAttribute('role','columnheader');h.appendChild(cell);
  }
  table.appendChild(h);
  for(const item of items){
   const row=elem('div','deen-path-shape-entry');row.setAttribute('role','row');
   row.dataset.letterId=item.id;
   for(const name of ['isolated','initial','medial','final']){
    const glyph=item.forms[name];
    const cell=elem('span','deen-path-shape-form'+(glyph?'':' is-unjoined'),glyph||'—');
    cell.setAttribute('role','cell');
    if(glyph){cell.lang='ar';cell.dir='rtl'}
    else cell.setAttribute('aria-label',c.noMiddle);
    row.appendChild(cell);
   }
   const label=elem('small','deen-path-shape-name',letterLabel(item));
   if(!item.joinsNext)label.title=c.noJoin;
   row.appendChild(label);table.appendChild(row);
  }
  return table;
 }
 function alphabetView(){
  const c=t(),box=elem('section','deen-path-arabic-landing');
  box.append(makeButton('←  '+c.back,'home','deen-path-back'));
  box.append(elem('span','deen-path-pill',c.free),elem('h2','deen-path-inner-title',c.arabic),elem('p','deen-path-muted',c.courseInfo));
  const done=completed().length;
  box.append(elem('p','deen-path-progress-copy',c.courseProgress+' · '+done+' / '+LESSONS.length));
  const track=elem('div','deen-path-course-progress'),fill=elem('span','',undefined);
  fill.style.width=Math.round(100*done/LESSONS.length)+'%';track.appendChild(fill);box.appendChild(track);
  const list=elem('div','deen-path-course-grid');
  LESSONS.forEach((lesson,i)=>{
   const locked=!isUnlocked(i),done=completed().includes(lesson.id);
   const card=makeButton('', 'group','deen-path-course-item'+(done?' is-completed':'')+(locked?' is-locked':''));
   card.dataset.lessonIndex=String(i);
   card.disabled=locked;
   const upper=elem('span','deen-path-course-item-top');
   upper.append(elem('span','deen-path-course-number',c.lesson+' '+(i+1)),elem('span','deen-path-course-status',done?'✓ '+c.done:locked?'🔒 '+c.locked:c.new));
   const glyphs=elem('span','deen-path-course-glyphs',lesson.letters.map(x=>x.glyph).join('  '));glyphs.lang='ar';glyphs.dir='rtl';
   card.append(upper,glyphs,elem('span','deen-path-course-item-foot',lesson.letters.length+' '+c.letters+' · '+c.groupTitle));
   list.append(card);
  });
  box.appendChild(list);
  if(done===LESSONS.length)box.appendChild(elem('p','deen-path-completed',c.courseComplete+' ✓'));
  const details=elem('details','deen-path-atlas-details');
  const summary=elem('summary','',c.allLetters);details.appendChild(summary);
  details.append(elem('p','deen-path-muted',c.atlasHelp),shapeAtlas(LETTERS));
  box.append(details,elem('p','deen-path-muted deen-path-warning',c.future));
  return box;
 }
 function groupView(){
  const c=t(),items=groupLetters(),box=elem('section','deen-path-arabic-landing');
  box.append(makeButton('←  '+c.arabic,'arabic','deen-path-back'));
  box.append(elem('span','deen-path-pill',c.lesson+' '+(state.lessonIndex+1)+' / '+LESSONS.length+' · '+c.free));
  box.append(elem('h2','deen-path-inner-title',c.groupTitle),elem('p','deen-path-muted',c.courseInfo));
  box.append(lettersStrip(items),elem('h3','deen-path-shape-subtitle',c.shape),shapeAtlas(items));
  if(items.some(item=>!item.joinsNext))box.appendChild(elem('p','deen-path-muted',c.atlasHelp));
  box.append(elem('p','deen-path-muted deen-path-warning',c.courseInfo));
  box.append(makeButton(completed().includes(group().id)?c.redo:c.goLesson,'start','deen-path-primary'));
  return box;
 }
 function lessonView(){
  const c=t(),items=groupLetters(),box=elem('section','deen-path-lesson');
  box.append(makeButton('←  '+c.arabic,'group','deen-path-back'));
  const item=items[state.question],n=state.question+1;
  box.append(elem('div','deen-path-kicker',c.lesson+' '+(state.lessonIndex+1)+' · '+c.groupTitle));
  box.append(elem('p','deen-path-question-count',c.progress+' '+n+' / '+items.length),elem('h2','deen-path-inner-title',c.question));
  box.append(elem('div','deen-path-prompt',letterLabel(item)));
  const options=elem('div','deen-path-options');
  const order=[...items.slice((state.question+1)%items.length),...items.slice(0,(state.question+1)%items.length)];
  for(const candidate of order){
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
  if(state.correct)box.appendChild(makeButton(state.question===items.length-1?c.finish:c.next,'next','deen-path-primary'));
  return box;
 }
 function completedView(){
  const c=t(),box=elem('section','deen-path-completion');
  box.append(elem('div','deen-path-complete-star','✦'),elem('h2','deen-path-inner-title',c.completed));
  box.append(elem('p','deen-path-muted',c.lesson+' '+(state.lessonIndex+1)+' / '+LESSONS.length+' · '+groupLetters().map(x=>x.glyph).join('  ')));
  box.append(elem('p','deen-path-muted',completed().length===LESSONS.length?c.courseCompleteDesc:c.completedDesc));
  if(state.lessonIndex<LESSONS.length-1)box.append(makeButton(c.nextLesson,'nextGroup','deen-path-primary'));
  box.append(makeButton(c.redo,'start','deen-path-primary'),makeButton('←  '+c.arabic,'arabic','deen-path-back'));
  return box;
 }
 function show(view){
  state.view=view;const container=root();if(!container)return false;
  ensure();
  update();return true;
 }
 function selectGroup(index){
  index=Number(index);
  if(!Number.isInteger(index)||index<0||index>=LESSONS.length||!isUnlocked(index))return false;
  state.lessonIndex=index;state.question=0;state.correct=false;state.feedback='';
  return show('group');
 }
 function start(){
  if(!isUnlocked(state.lessonIndex))return false;
  state.question=0;state.correct=false;state.feedback='';state.complete=false;
  return show('lesson');
 }
 function next(){
  if(!state.correct)return;
  if(state.question<groupLetters().length-1){
   state.question++;state.correct=false;state.feedback='';show('lesson');
  }else{
   state.complete=true;saveCompleted();show('complete');
  }
 }
 function answer(id){
  if(state.view!=='lesson'||state.correct)return;
  state.correct=id===groupLetters()[state.question].id;
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
   panel.appendChild(state.view==='home'?homeView():state.view==='arabic'?alphabetView():state.view==='group'?groupView():state.view==='lesson'?lessonView():completedView());
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
   else if(action==='group')selectGroup(b.dataset.lessonIndex);
   else if(action==='nextGroup')selectGroup(state.lessonIndex+1);
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
 window.DEEN_QURAN_PATHS=Object.freeze({enterArabic:()=>show('arabic'),openSurahs:()=>show('surah'),home:()=>show('home'),selectGroup,start,ensure,refresh:update,status:()=>({view:state.view,lessonIndex:state.lessonIndex,lessonAvailable:true,complete:savedComplete(),completedLessons:completed().length,totalLessons:LESSONS.length,letterCount:LETTERS.length,lessonLetters:groupLetters().map(x=>x.id)}),version:'quran-arabic-paths-phase2'});
})();