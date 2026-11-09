/* Letter forms unit: how letters look in the middle and at the end of a word, and the letters that
   change shape most. Three card-first lessons with their own progress, shown after the 28-letter
   unit. Each form is shown inside a Quran word from a cited verse (Uthmani spelling). */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_FORMS)return;
 const STORE='deen_arabic_letter_forms_v1';
 const POS={
  tr:{initial:'başta',medial:'ortada',final:'sonda'},en:{initial:'start',medial:'middle',final:'end'},
  de:{initial:'Anfang',medial:'Mitte',final:'Ende'},fr:{initial:'début',medial:'milieu',final:'fin'},ar:{initial:'في الأول',medial:'في الوسط',final:'في الآخر'}
 };
 const HINT={
  tr:{initial:'Başta: yalnızca sonraki harfe bağlanır.',medial:'Ortada: iki yandan bağlanır.',final:'Sonda: yalnızca önceki harfe bağlanır.',stay:'Sonraki harfe hiç bağlanmaz.'},
  en:{initial:'Start: joined only to the next letter.',medial:'Middle: joined on both sides.',final:'End: joined only to the letter before.',stay:'It never joins the next letter.'},
  de:{initial:'Anfang: nur mit dem nächsten Buchstaben verbunden.',medial:'Mitte: auf beiden Seiten verbunden.',final:'Ende: nur mit dem Buchstaben davor verbunden.',stay:'Er verbindet sich nie mit dem nächsten Buchstaben.'},
  fr:{initial:'Début : liée seulement à la lettre suivante.',medial:'Milieu : liée des deux côtés.',final:'Fin : liée seulement à la lettre d’avant.',stay:'Elle ne se lie jamais à la lettre suivante.'},
  ar:{initial:'في الأول: تتصل بما بعدها فقط.',medial:'في الوسط: تتصل من الجهتين.',final:'في الآخر: تتصل بما قبلها فقط.',stay:'ولا تتصل أبدًا بما بعدها.'}
 };
 const EXTRA={
  'ha-medial':{tr:'He ortada şeklini tamamen değiştirir; onu ayrıca tanımayı öğren.',en:'Hā changes its shape completely in the middle; learn to spot it on its own.',de:'Hā ändert in der Mitte seine Form völlig; lerne es eigens zu erkennen.',fr:'Au milieu, hā change complètement de forme ; apprends à la reconnaître.',ar:'تتغيّر صورة الهاء في الوسط كليًّا، فتعلّم تمييزها.'},
  'ayn-medial':{tr:'Ayn ortada küçük, kapalı bir üçgen olur.',en:'ʿAyn in the middle becomes a small closed triangle.',de:'ʿAyn wird in der Mitte ein kleines geschlossenes Dreieck.',fr:'Au milieu, ʿayn devient un petit triangle fermé.',ar:'العين في الوسط تصبح مثلثًا صغيرًا مغلقًا.'}
 };
 // [letter id, position, form, Quran word that shows it, verse reference, verse excerpt]
 const f=(letter,pos,form,word,ref,verse)=>({letter,pos,form,word,ref,verse});
 const LESSONS=[
  {id:'forms-boat',signs:'ـبـ ـنـ ـيـ',
   title:{tr:'Be ailesi: ortada ve sonda',en:'The bā family: middle and end',de:'Die Bā-Familie: Mitte und Ende',fr:'La famille de bā : milieu et fin',ar:'عائلة الباء: في الوسط والآخر'},
   tip:{
    tr:['Be ailesi ortada ve sonda','ب ت ث ن ي ortada aynı küçük dişe dönüşür; onları yalnızca noktaları ayırır. Sonda kuyruklarını geri alırlar.','Ortadaki dişte noktayı say ve yerine bak: altta bir nokta Be, üstte bir nokta Nun, altta iki nokta Ye.'],
    en:['The bā family in the middle and at the end','ب ت ث ن ي all shrink to the same small tooth in the middle; only their dots tell them apart. At the end they get their tail back.','On a middle tooth, count the dots and check where they are: one below is bā, one above is nūn, two below is yā.'],
    de:['Die Bā-Familie in der Mitte und am Ende','ب ت ث ن ي werden in der Mitte alle zum gleichen kleinen Zahn; nur die Punkte unterscheiden sie. Am Ende bekommen sie ihren Schwanz zurück.','Zähle beim Zahn in der Mitte die Punkte und achte auf ihre Lage: einer unten ist Bā, einer oben Nūn, zwei unten Yā.'],
    fr:['La famille de bā au milieu et à la fin','ب ت ث ن ي deviennent toutes la même petite dent au milieu ; seuls les points les distinguent. À la fin, elles retrouvent leur queue.','Sur une dent au milieu, compte les points et regarde leur place : un dessous, c’est bā ; un dessus, nūn ; deux dessous, yā.'],
    ar:['عائلة الباء في الوسط والآخر','الباء والتاء والثاء والنون والياء تصير في الوسط سنًّا صغيرة واحدة، ولا يميّزها إلا النقاط. وفي الآخر يعود إليها ذيلها.','في السنّ الوسطى عُدَّ النقاط وانظر مكانها: نقطة أسفل باء، ونقطة أعلى نون، ونقطتان أسفل ياء.']},
   items:[
    f('ba','medial','ـبـ','بِٱلصَّبْرِ','103:3','وَتَوَاصَوْا۟ بِٱلصَّبْرِ'),
    f('ba','final','ـب','لَهَبٍ','111:1','تَبَّتْ يَدَآ أَبِى لَهَبٍ وَتَبَّ'),
    f('nun','medial','ـنـ','ٱلنَّاسِ','114:1','قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ'),
    f('nun','final','ـن','ٱلْعَـٰلَمِينَ','1:2','ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ'),
    f('ya','medial','ـيـ','ٱلرَّحِيمِ','1:1','بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ'),
    f('ta','final','ـت','ٱلْبَيْتِ','106:3','فَلْيَعْبُدُوا۟ رَبَّ هَـٰذَا ٱلْبَيْتِ')
   ]},
  {id:'forms-change',signs:'هـ ـهـ ـعـ',
   title:{tr:'Şekli değişen harfler: He ve Ayn',en:'Letters that change shape: hā and ʿayn',de:'Buchstaben, die ihre Form ändern: Hā und ʿAyn',fr:'Lettres qui changent de forme : hā et ʿayn',ar:'حروف تتغيّر صورتها: الهاء والعين'},
   tip:{
    tr:['Şekli değişen harfler','He (ه) ve Ayn (ع) kelimedeki yerine göre çok farklı görünür. Başta, ortada ve sonda üç ayrı şekli tanı.','Ortadaki He (ـهـ) ile ortadaki Ayn (ـعـ) karışabilir; ikisini yan yana görüp farkı öğren.'],
    en:['Letters that change shape','Hā (ه) and ʿayn (ع) look very different depending on where they stand in a word. Learn their start, middle and end shapes.','A middle hā (ـهـ) and a middle ʿayn (ـعـ) are easy to mix up; compare them side by side.'],
    de:['Buchstaben, die ihre Form ändern','Hā (ه) und ʿAyn (ع) sehen je nach Stelle im Wort sehr verschieden aus. Lerne ihre Formen am Anfang, in der Mitte und am Ende.','Ein Hā in der Mitte (ـهـ) und ein ʿAyn in der Mitte (ـعـ) verwechselt man leicht; vergleiche sie nebeneinander.'],
    fr:['Lettres qui changent de forme','Hā (ه) et ʿayn (ع) changent beaucoup selon leur place dans le mot. Apprends leurs formes au début, au milieu et à la fin.','Un hā au milieu (ـهـ) et un ʿayn au milieu (ـعـ) se confondent facilement ; compare-les côte à côte.'],
    ar:['حروف تتغيّر صورتها','تختلف صورة الهاء (ه) والعين (ع) كثيرًا بحسب موضعهما في الكلمة. تعرّف على صورها في الأول والوسط والآخر.','قد تختلط الهاء الوسطى (ـهـ) بالعين الوسطى (ـعـ)، فقارن بينهما جنبًا إلى جنب.']},
   items:[
    f('ha','initial','هـ','هُوَ','112:1','قُلْ هُوَ ٱللَّهُ أَحَدٌ'),
    f('ha','medial','ـهـ','عَلَيْهِمْ','1:7','صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ'),
    f('ha','final','ـه','لِلَّهِ','1:2','ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ'),
    f('ayn','initial','عـ','عَلَقٍ','96:2','خَلَقَ ٱلْإِنسَـٰنَ مِنْ عَلَقٍ'),
    f('ayn','medial','ـعـ','نَعْبُدُ','1:5','إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ')
   ]},
  {id:'forms-stay',signs:'ـا ـد ـر ـو',
   title:{tr:'Bağlanmayan harfler sonda',en:'Non-joining letters at the end',de:'Nicht verbindende Buchstaben am Ende',fr:'Lettres non liantes à la fin',ar:'الحروف التي لا تتصل بما بعدها في الآخر'},
   tip:{
    tr:['Bağlanmayan harfler sonda','ا د ذ ر ز و önceki harfe bağlanır ama sonrakine hiç bağlanmaz. Bu yüzden kelimenin içinde bile ardından küçük bir boşluk kalır.','Bu harflerden sonra gelen harf yeniden "baş" biçimiyle yazılır; kelime bitmiş sanma.'],
    en:['Non-joining letters at the end','ا د ذ ر ز و join the letter before but never the letter after, so a small gap follows them even inside a word.','The letter after one of these is written in its start form again; the word has not ended.'],
    de:['Nicht verbindende Buchstaben am Ende','ا د ذ ر ز و verbinden sich mit dem Buchstaben davor, aber nie mit dem danach; deshalb folgt selbst im Wort eine kleine Lücke.','Der Buchstabe danach steht wieder in seiner Anfangsform; das Wort ist noch nicht zu Ende.'],
    fr:['Lettres non liantes à la fin','ا د ذ ر ز و se lient à la lettre d’avant mais jamais à la suivante ; un petit espace les suit donc même à l’intérieur d’un mot.','La lettre qui suit s’écrit de nouveau dans sa forme de début ; le mot n’est pas fini.'],
    ar:['الحروف التي لا تتصل بما بعدها','ا د ذ ر ز و تتصل بما قبلها ولا تتصل أبدًا بما بعدها، فتبقى بعدها فُرجة صغيرة حتى داخل الكلمة.','الحرف الذي يليها يُكتب بصورته الأولى من جديد؛ ولا يعني ذلك أن الكلمة انتهت.']},
   items:[
    f('alif','final','ـا','ٱلنَّاسِ','114:1','قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ'),
    f('dal','final','ـد','أَحَدٌ','112:1','قُلْ هُوَ ٱللَّهُ أَحَدٌ'),
    f('ra','final','ـر','بِٱلصَّبْرِ','103:3','وَتَوَاصَوْا۟ بِٱلصَّبْرِ'),
    f('waw','final','ـو','هُوَ','112:1','قُلْ هُوَ ٱللَّهُ أَحَدٌ')
   ]}
 ];
 const T={
  tr:{unit:'Harf biçimleri',lesson:n=>'Harf Biçimleri '+n,done:'Tamamlandı',ready:'Başlamaya hazır',lockFirst:'Önce 28 harf derslerini tamamla',lockNext:'Önceki dersi tamamla',foot:'Kur’an kelimeleriyle'},
  en:{unit:'Letter forms',lesson:n=>'Letter Forms '+n,done:'Completed',ready:'Ready to start',lockFirst:'Finish the 28 letter lessons first',lockNext:'Complete the previous lesson',foot:'With Quran words'},
  de:{unit:'Buchstabenformen',lesson:n=>'Buchstabenformen '+n,done:'Abgeschlossen',ready:'Bereit',lockFirst:'Schließe zuerst die 28 Buchstaben ab',lockNext:'Vorherige Lektion abschließen',foot:'Mit Wörtern aus dem Koran'},
  fr:{unit:'Formes des lettres',lesson:n=>'Formes des lettres '+n,done:'Terminée',ready:'Prête',lockFirst:'Termine d’abord les 28 lettres',lockNext:'Termine la leçon précédente',foot:'Avec des mots du Coran'},
  ar:{unit:'صور الحروف',lesson:n=>'صور الحروف '+n,done:'مكتمل',ready:'جاهز للبدء',lockFirst:'أكمل دروس الحروف الثمانية والعشرين أولًا',lockNext:'أكمل الدرس السابق',foot:'بكلمات من القرآن'}
 };
 function lang(){let c='';try{c=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}c=String(c||document.documentElement.lang||'tr').slice(0,2).toLowerCase();return T[c]?c:'tr'}
 function completed(){try{const d=JSON.parse(localStorage.getItem(STORE)||'null');return Array.isArray(d?.completed)?d.completed.filter(id=>LESSONS.some(l=>l.id===id)):[]}catch(_){return []}}
 function markDone(id){const ids=completed();if(!ids.includes(id))ids.push(id);try{localStorage.setItem(STORE,JSON.stringify({schema:1,completed:ids,updatedAt:Date.now()}))}catch(_){}}
 function prerequisiteMet(){try{const s=window.DEEN_QURAN_PATHS?.status?.();return !!s&&s.totalLessons>0&&s.completedLessons>=s.totalLessons}catch(_){return false}}
 function unlocked(i){return !!window.DEEN_ADMIN_UNLOCK?.()||prerequisiteMet()&&(i===0||completed().includes(LESSONS[i-1].id))}
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n};
 function itemsOf(lesson,code){
  const C=window.DEEN_ARABIC_LETTERS;
  return lesson.items.map(x=>{
   const letterName=C?.get?.(x.letter)?.names?.[code]||C?.get?.(x.letter)?.names?.en||x.letter;
   const extra=EXTRA[x.letter+'-'+x.pos]?.[code]||'';
   const hint=HINT[code][x.pos]+(lesson.id==='forms-stay'?' '+HINT[code].stay:'')+(extra?' '+extra:'');
   return {id:'f-'+x.letter+'-'+x.pos,glyph:x.form,name:letterName+' · '+POS[code][x.pos],hint,verse:x.verse,ref:x.ref,mark:x.word,example:'',parts:null};
  });
 }
 function open(i){
  const lesson=LESSONS[i],code=lang(),t=T[code],tip=lesson.tip[code]||lesson.tip.en;
  if(!lesson||!unlocked(i)||!window.DEEN_ARABIC_CARDS)return false;
  const items=itemsOf(lesson,code);
  return window.DEEN_ARABIC_CARDS.open({lessonIndex:null,items,knownItems:LESSONS.slice(0,i).flatMap(l=>itemsOf(l,code)),ask:'name',lang:code,
   title:t.lesson(i+1)+' · '+(lesson.title[code]||lesson.title.en),subtitle:tip[0],
   tip:{title:tip[0],text:tip[1],examples:items.slice(0,4).map(x=>({glyph:x.glyph,caption:x.name})),mistake:tip[2]},
   onDone:()=>markDone(lesson.id),
   onClose:()=>{window.DEEN_QURAN_PATHS?.refresh?.();setTimeout(()=>document.querySelector('#leagueScreenBody .dsq-cur')?.scrollIntoView({block:'center',behavior:'instant'}),220)}});
 }
 function section(){
  const code=lang(),t=T[code],done=completed();
  const sec=el('section','deen-path-forms-section');sec.append(el('h3','deen-path-shape-subtitle',t.unit));
  LESSONS.forEach((lesson,i)=>{
   const isDone=done.includes(lesson.id),open_=unlocked(i);
   const b=el('button','deen-path-course-item dsq-forms-item'+(isDone?' is-completed':'')+(open_?'':' is-locked'));b.type='button';b.dataset.formsLesson=lesson.id;b.disabled=!open_;
   const top=el('span','deen-path-course-item-top');
   top.append(el('span','deen-path-course-number',t.lesson(i+1)+' · '+(lesson.title[code]||lesson.title.en)),el('span','deen-path-course-status',isDone?'✓ '+t.done:open_?t.ready:(i===0?t.lockFirst:t.lockNext)));
   const g=el('span','deen-path-course-glyphs',lesson.signs);g.lang='ar';g.dir='rtl';
   b.append(top,g,el('span','deen-path-course-item-foot',t.foot));
   b.addEventListener('click',()=>open(i));
   sec.append(b);
  });
  return sec;
 }
 window.DEEN_ARABIC_FORMS=Object.freeze({version:'ds-arabic-forms-1',lessons:LESSONS.map(l=>l.id),section,open,
  progress:()=>({done:completed().length,total:LESSONS.length}),
  items:code=>LESSONS.flatMap(l=>itemsOf(l,T[code]?code:lang()).map(x=>({...x,group:l.id,ask:'name'}))),unlocked,store:STORE});
})();
