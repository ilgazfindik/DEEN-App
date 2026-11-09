/* Reading signs unit: tanwīn, the article al- (sun and moon letters), lengthening signs, and tā marbūṭa,
   lām-alif and hamza. Four card-first lessons with their own progress, shown on the Arabic path after
   the sukūn/shadda/madd unit. Every example is a word from a cited verse (Uthmani spelling). */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_MARKS)return;
 const STORE='deen_arabic_reading_marks_v1';
 const w=(id,glyph,ref,verse,tr,lat,hint)=>({id,glyph,ref,verse,names:{tr,en:lat,de:lat,fr:lat,ar:lat},hint});
 const LESSONS=[
  {id:'marks-tanwin',signs:'◌ٌ ◌ً ◌ٍ',
   title:{tr:'Tenvin',en:'Tanwīn',de:'Tanwīn',fr:'Tanwīn',ar:'التنوين'},
   tip:{
    tr:['Tenvin: sondaki n sesi','Kelimenin son harfinde hareke iki kez yazılırsa sona n sesi eklenir: ◌ٌ -un, ◌ً -an, ◌ٍ -in.','Tenvinli harfi iki hece gibi okuma; yalnızca sonuna n eklenir. Kelimede durunca okunuş değişebilir.'],
    en:['Tanwīn: the final n sound','When a vowel mark is doubled on the last letter, an n sound is added: ◌ٌ -un, ◌ً -an, ◌ٍ -in.','Do not read it as two syllables; only an n is added. The reading changes when you pause on the word.'],
    de:['Tanwīn: das n am Wortende','Steht das Vokalzeichen doppelt auf dem letzten Buchstaben, kommt ein n dazu: ◌ٌ -un, ◌ً -an, ◌ٍ -in.','Nicht als zwei Silben lesen; es kommt nur ein n hinzu. Beim Anhalten auf dem Wort ändert sich die Aussprache.'],
    fr:['Tanwīn : le son n final','Quand le signe vocalique est doublé sur la dernière lettre, on ajoute un n : ◌ٌ -un, ◌ً -an, ◌ٍ -in.','Ne le lis pas comme deux syllabes : on ajoute seulement un n. La lecture change quand on s’arrête sur le mot.'],
    ar:['التنوين: نون في آخر الكلمة','إذا تكرّرت الحركة على الحرف الأخير زِيدَ صوت النون: ◌ٌ ◌ً ◌ٍ.','لا تقرأه مقطعين؛ إنما تُضاف نون. ويتغيّر النطق عند الوقف على الكلمة.']},
   items:[
    w('m-ahadun','أَحَدٌ','112:1','قُلْ هُوَ ٱللَّهُ أَحَدٌ','ahadun','aḥadun',{tr:'İki ötre (◌ٌ): sonda -un',en:'Double ḍamma (◌ٌ): ends in -un',de:'Doppeltes Damma (◌ٌ): Endung -un',fr:'Double ḍamma (◌ٌ) : finale -un',ar:'تنوين ضم (◌ٌ): يُنطق -ُن'}),
    w('m-kufuwan','كُفُوًا','112:4','وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ','kufuven','kufuwan',{tr:'İki üstün (◌ً): sonda -an; çoğu zaman bir elifle yazılır',en:'Double fatḥa (◌ً): ends in -an, usually written with an alif',de:'Doppeltes Fatha (◌ً): Endung -an, meist mit Alif geschrieben',fr:'Double fatḥa (◌ً) : finale -an, souvent écrite avec un alif',ar:'تنوين فتح (◌ً): يُنطق -َن ويُكتب غالبًا مع ألف'}),
    w('m-hasidin','حَاسِدٍ','113:5','وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ','hâsidin','ḥāsidin',{tr:'İki esre (◌ٍ): sonda -in',en:'Double kasra (◌ٍ): ends in -in',de:'Doppeltes Kasra (◌ٍ): Endung -in',fr:'Double kasra (◌ٍ) : finale -in',ar:'تنوين كسر (◌ٍ): يُنطق -ِن'})
   ]},
  {id:'marks-article',signs:'ٱلْ',
   title:{tr:'El takısı: şemsi ve kameri',en:'Al-: sun and moon letters',de:'Al-: Sonnen- und Mondbuchstaben',fr:'Al- : lettres solaires et lunaires',ar:'أل: الشمسية والقمرية'},
   tip:{
    tr:['El takısı: şemsi ve kameri harfler','ٱلْ takısındaki lam, kameri harften önce okunur (el-hamdu); şemsi harften önce okunmaz ve o harf şeddeli olur (en-nâs). Baştaki ٱ, okumaya orada başlarsan "e" diye okunur.','Şeddeye bak: lamdan sonraki harfte şedde varsa (ٱلنَّ) lam okunmaz.'],
    en:['The article al-: sun and moon letters','Before a moon letter the l of ٱلْ is read (al-ḥamdu); before a sun letter it is silent and that letter is doubled (an-nās). The opening ٱ is read "a" when you start there.','Look for the shadda: if the letter after the l carries one (ٱلنَّ), the l is silent.'],
    de:['Der Artikel al-: Sonnen- und Mondbuchstaben','Vor einem Mondbuchstaben wird das l von ٱلْ gelesen (al-ḥamdu); vor einem Sonnenbuchstaben bleibt es stumm und der Buchstabe wird verdoppelt (an-nās). Das ٱ am Anfang liest man „a“, wenn man dort beginnt.','Achte auf die Schadda: Trägt der Buchstabe nach dem l eine (ٱلنَّ), bleibt das l stumm.'],
    fr:['L’article al- : lettres solaires et lunaires','Devant une lettre lunaire, le l de ٱلْ se prononce (al-ḥamdu) ; devant une lettre solaire, il est muet et la lettre est redoublée (an-nās). Le ٱ initial se lit « a » quand on commence par lui.','Repère la shadda : si la lettre après le l en porte une (ٱلنَّ), le l est muet.'],
    ar:['أل الشمسية والقمرية','تُنطق لام «أل» قبل الحرف القمري (الْحَمْد)، ولا تُنطق قبل الحرف الشمسي ويُشدَّد الحرف بعدها (النَّاس). وتُنطق همزة الوصل عند الابتداء بها.','انظر إلى الشدة: إذا كان الحرف بعد اللام مشدَّدًا (ٱلنَّ) فاللام لا تُنطق.']},
   items:[
    w('m-alhamdu','ٱلْحَمْدُ','1:2','ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ','el-hamdu','al-ḥamdu',{tr:'Kameri harf (ح): lam okunur, el-',en:'Moon letter (ḥ): the l is read, al-',de:'Mondbuchstabe (ḥ): das l wird gelesen, al-',fr:'Lettre lunaire (ḥ) : le l se prononce, al-',ar:'حرف قمري (ح): تُنطق اللام'}),
    w('m-annas','ٱلنَّاسِ','114:1','قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ','en-nâs','an-nās',{tr:'Şemsi harf (ن): lam okunmaz, ن şeddeli okunur',en:'Sun letter (n): the l is silent and the n is doubled',de:'Sonnenbuchstabe (n): das l bleibt stumm, das n wird verdoppelt',fr:'Lettre solaire (n) : le l est muet, le n est redoublé',ar:'حرف شمسي (ن): لا تُنطق اللام وتُشدَّد النون'}),
    w('m-alfalaq','ٱلْفَلَقِ','113:1','قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ','el-felak','al-falaq',{tr:'Kameri harf (ف): lam okunur, el-',en:'Moon letter (f): the l is read, al-',de:'Mondbuchstabe (f): das l wird gelesen, al-',fr:'Lettre lunaire (f) : le l se prononce, al-',ar:'حرف قمري (ف): تُنطق اللام'}),
    w('m-arrahim','ٱلرَّحِيمِ','1:1','بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ','er-rahîm','ar-raḥīm',{tr:'Şemsi harf (ر): lam okunmaz, ر şeddeli okunur',en:'Sun letter (r): the l is silent and the r is doubled',de:'Sonnenbuchstabe (r): das l bleibt stumm, das r wird verdoppelt',fr:'Lettre solaire (r) : le l est muet, le r est redoublé',ar:'حرف شمسي (ر): لا تُنطق اللام وتُشدَّد الراء'})
   ]},
  {id:'marks-long',signs:'◌ٰ ى',
   title:{tr:'Uzatma işaretleri',en:'Lengthening signs',de:'Dehnungszeichen',fr:'Signes d’allongement',ar:'علامات المدّ'},
   tip:{
    tr:['Uzatma işaretleri','Kur’an yazısında uzun â bazen küçük bir elifle (◌ٰ), kelime sonunda ise noktasız yeyle (ى) gösterilir.','Noktasız ى ile iki noktalı ي farklıdır: sondaki ى burada "î" değil "â" okunur.'],
    en:['Lengthening signs','In the Quranic script a long ā is sometimes shown by a small alif (◌ٰ), and at the end of a word by a dotless yā (ى).','Dotless ى is not the dotted ي: at the end of these words it reads ā, not ī.'],
    de:['Dehnungszeichen','In der Koranschrift zeigt manchmal ein kleines Alif (◌ٰ) ein langes ā, am Wortende auch ein punktloses Yā (ى).','Das punktlose ى ist nicht das ي mit Punkten: Am Ende dieser Wörter liest man es ā, nicht ī.'],
    fr:['Signes d’allongement','Dans l’écriture coranique, un ā long est parfois noté par un petit alif (◌ٰ) et, en fin de mot, par un yā sans points (ى).','Le ى sans points n’est pas le ي pointé : à la fin de ces mots, il se lit ā et non ī.'],
    ar:['علامات المدّ','في الرسم القرآني يُشار إلى المدّ بالألف أحيانًا بألف صغيرة (◌ٰ)، وفي آخر الكلمة بالألف المقصورة (ى).','الألف المقصورة (ى) غير الياء المنقوطة (ي): تُنطق في آخر هذه الكلمات ألفًا لا ياءً.']},
   items:[
    w('m-arrahman','ٱلرَّحْمَـٰنِ','1:1','بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ','er-rahmân','ar-raḥmān',{tr:'Üstteki küçük elif (◌ٰ): uzun â',en:'Small alif above (◌ٰ): long ā',de:'Kleines Alif oben (◌ٰ): langes ā',fr:'Petit alif suscrit (◌ٰ) : ā long',ar:'الألف الخنجرية (◌ٰ): مدّ بالألف'}),
    w('m-dhalika','ذَٰلِكَ','2:2','ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ','zâlike','dhālika',{tr:'Küçük elif yazılı bir elifin yerini tutar: zâ-li-ke',en:'The small alif stands for a written alif: dhā-li-ka',de:'Das kleine Alif steht für ein geschriebenes Alif: dhā-li-ka',fr:'Le petit alif remplace un alif écrit : dhā-li-ka',ar:'الألف الصغيرة تقوم مقام الألف: ذا-لِ-كَ'}),
    w('m-alala','ٱلْأَعْلَى','87:1','سَبِّحِ ٱسْمَ رَبِّكَ ٱلْأَعْلَى','el-a‘lâ','al-aʿlā',{tr:'Sondaki noktasız ye (ى, elif maksura): uzun â',en:'Final dotless yā (ى, alif maqṣūra): long ā',de:'Punktloses Yā am Ende (ى, Alif maqṣūra): langes ā',fr:'Yā final sans points (ى, alif maqṣūra) : ā long',ar:'الألف المقصورة (ى): تُنطق ألفًا ممدودة'}),
    w('m-musa','مُوسَىٰ','87:19','صُحُفِ إِبْرَٰهِيمَ وَمُوسَىٰ','Mûsâ','Mūsā',{tr:'ى üstünde küçük elif: yine uzun â',en:'ى with a small alif above: also a long ā',de:'ى mit kleinem Alif darüber: ebenfalls langes ā',fr:'ى surmonté d’un petit alif : aussi ā long',ar:'ى وفوقها ألف صغيرة: مدّ بالألف أيضًا'})
   ]},
  {id:'marks-special',signs:'ة لا أ',
   title:{tr:'Yuvarlak te, lam-elif ve hemze',en:'Tā marbūṭa, lām-alif and hamza',de:'Tā marbūṭa, Lām-Alif und Hamza',fr:'Tā marbūṭa, lām-alif et hamza',ar:'التاء المربوطة واللام ألف والهمزة'},
   tip:{
    tr:['Yuvarlak te, lam-elif ve hemze','Bu üç yazım Kur’an’da çok sık geçer: kelime sonundaki yuvarlak te (ة), lam ile elifin birleşik şekli (لا) ve elif üstündeki hemze (أ).','Hemzeli elif (أ) ile düz elifi (ا) karıştırma: düz elif tek başına ses vermez, önceki sesi uzatır.'],
    en:['Tā marbūṭa, lām-alif and hamza','These three spellings are very common in the Quran: the round tā at the end of a word (ة), the joined form of lām and alif (لا), and the hamza on an alif (أ).','Do not confuse the alif with hamza (أ) and the plain alif (ا): the plain alif has no sound of its own, it lengthens the vowel before it.'],
    de:['Tā marbūṭa, Lām-Alif und Hamza','Diese drei Schreibungen kommen im Koran sehr oft vor: das runde Tā am Wortende (ة), die verbundene Form von Lām und Alif (لا) und die Hamza auf dem Alif (أ).','Verwechsle das Alif mit Hamza (أ) nicht mit dem einfachen Alif (ا): Das einfache Alif hat keinen eigenen Laut, es dehnt den Vokal davor.'],
    fr:['Tā marbūṭa, lām-alif et hamza','Ces trois graphies sont très fréquentes dans le Coran : le tā rond en fin de mot (ة), la forme liée de lām et alif (لا) et la hamza sur l’alif (أ).','Ne confonds pas l’alif avec hamza (أ) et l’alif simple (ا) : l’alif simple n’a pas de son propre, il allonge la voyelle qui le précède.'],
    ar:['التاء المربوطة واللام ألف والهمزة','تكثر هذه الثلاث في المصحف: التاء المربوطة في آخر الكلمة (ة)، واللام ألف (لا)، والهمزة على الألف (أ).','لا تخلط بين الألف المهموزة (أ) والألف اللينة (ا): الألف اللينة لا تُنطق وحدها بل تمدّ ما قبلها.']},
   items:[
    w('m-qariah','ٱلْقَارِعَةُ','101:1','ٱلْقَارِعَةُ','el-kâri‘atu','al-qāriʿatu',{tr:'Yuvarlak te (ة): okurken t; durunca h okunur',en:'Tā marbūṭa (ة): read t; when you pause, h',de:'Tā marbūṭa (ة): t beim Weiterlesen, h beim Anhalten',fr:'Tā marbūṭa (ة) : t en lecture continue, h à la pause',ar:'التاء المربوطة (ة): تُنطق تاءً في الوصل وهاءً في الوقف'}),
    w('m-la','لَا','2:2','ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ','lâ','lā',{tr:'Lam ile elif birleşik yazılır (لا): uzun "lâ"',en:'Lām and alif join into one shape (لا): a long "lā"',de:'Lām und Alif werden zu einer Form (لا): langes „lā“',fr:'Lām et alif forment un seul signe (لا) : « lā » long',ar:'اللام والألف تُكتبان معًا (لا): لا ممدودة'}),
    w('m-audhu','أَعُوذُ','113:1','قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ','e‘ûzu','aʿūdhu',{tr:'Elif üstündeki ء hemzedir: kısa bir kesintiyle "e" okunur',en:'The ء on the alif is a hamza: a short catch in the throat, read "a"',de:'Das ء auf dem Alif ist eine Hamza: ein kurzer Stimmansatz, „a“',fr:'Le ء sur l’alif est une hamza : un petit coup de glotte, « a »',ar:'الهمزة (ء) على الألف: تُنطق محقَّقة'})
   ]}
 ];
 const T={
  tr:{unit:'Okuma işaretleri',lesson:n=>'Okuma İşaretleri '+n,done:'Tamamlandı',ready:'Başlamaya hazır',lockFirst:'Önce cezim, şedde ve med derslerini tamamla',lockNext:'Önceki dersi tamamla',foot:'Kur’an örnekleriyle'},
  en:{unit:'Reading signs',lesson:n=>'Reading Signs '+n,done:'Completed',ready:'Ready to start',lockFirst:'Finish the sukūn, shadda and madd lessons first',lockNext:'Complete the previous lesson',foot:'With Quran examples'},
  de:{unit:'Lesezeichen im Koran',lesson:n=>'Lesezeichen '+n,done:'Abgeschlossen',ready:'Bereit',lockFirst:'Schließe zuerst Sukūn, Schadda und Madd ab',lockNext:'Vorherige Lektion abschließen',foot:'Mit Beispielen aus dem Koran'},
  fr:{unit:'Signes de lecture',lesson:n=>'Signes de lecture '+n,done:'Terminée',ready:'Prête',lockFirst:'Termine d’abord sukūn, shadda et madd',lockNext:'Termine la leçon précédente',foot:'Avec des exemples du Coran'},
  ar:{unit:'علامات القراءة',lesson:n=>'علامات القراءة '+n,done:'مكتمل',ready:'جاهز للبدء',lockFirst:'أكمل دروس السكون والشدة والمدّ أولًا',lockNext:'أكمل الدرس السابق',foot:'بأمثلة من القرآن'}
 };
 function lang(){let c='';try{c=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}c=String(c||document.documentElement.lang||'tr').slice(0,2).toLowerCase();return T[c]?c:'tr'}
 function completed(){try{const d=JSON.parse(localStorage.getItem(STORE)||'null');return Array.isArray(d?.completed)?d.completed.filter(id=>LESSONS.some(l=>l.id===id)):[]}catch(_){return []}}
 function markDone(id){const ids=completed();if(!ids.includes(id))ids.push(id);try{localStorage.setItem(STORE,JSON.stringify({schema:1,completed:ids,updatedAt:Date.now()}))}catch(_){}}
 // The unit opens once the sukūn, shadda and madd lessons are done; then one lesson after another.
 function prerequisiteMet(){try{const s=window.DEEN_QURAN_PATHS?.status?.();return !!s&&s.readingTotalLessons>0&&s.readingCompletedLessons>=s.readingTotalLessons}catch(_){return false}}
 function unlocked(i){return !!window.DEEN_ADMIN_UNLOCK?.()||prerequisiteMet()&&(i===0||completed().includes(LESSONS[i-1].id))}
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n};
 function itemsOf(lesson,code){return lesson.items.map(x=>({id:x.id,glyph:x.glyph,name:x.names[code]||x.names.en,hint:x.hint[code]||x.hint.en,verse:x.verse,ref:x.ref,example:'',parts:null}))}
 function open(i){
  const lesson=LESSONS[i],code=lang(),t=T[code],tip=lesson.tip[code]||lesson.tip.en;
  if(!lesson||!unlocked(i)||!window.DEEN_ARABIC_CARDS)return false;
  const items=itemsOf(lesson,code);
  return window.DEEN_ARABIC_CARDS.open({lessonIndex:null,items,knownItems:LESSONS.slice(0,i).flatMap(l=>itemsOf(l,code)),ask:'read',lang:code,
   title:t.lesson(i+1)+' · '+(lesson.title[code]||lesson.title.en),subtitle:tip[0],
   tip:{title:tip[0],text:tip[1],examples:items.map(x=>({glyph:x.glyph,caption:x.name})),mistake:tip[2]},
   onDone:()=>markDone(lesson.id),
   onClose:()=>{window.DEEN_QURAN_PATHS?.refresh?.();setTimeout(()=>document.querySelector('#leagueScreenBody .dsq-cur')?.scrollIntoView({block:'center',behavior:'instant'}),220)}});
 }
 // The unit as a section shaped like the engine's own course sections, for the path layer to restyle.
 function section(){
  const code=lang(),t=T[code],done=completed();
  const sec=el('section','deen-path-marks-section');sec.append(el('h3','deen-path-shape-subtitle',t.unit));
  LESSONS.forEach((lesson,i)=>{
   const isDone=done.includes(lesson.id),open_=unlocked(i);
   const b=el('button','deen-path-course-item dsq-marks-item'+(isDone?' is-completed':'')+(open_?'':' is-locked'));b.type='button';b.dataset.marksLesson=lesson.id;b.disabled=!open_;
   const top=el('span','deen-path-course-item-top');
   top.append(el('span','deen-path-course-number',t.lesson(i+1)+' · '+(lesson.title[code]||lesson.title.en)),el('span','deen-path-course-status',isDone?'✓ '+t.done:open_?t.ready:(i===0?t.lockFirst:t.lockNext)));
   const g=el('span','deen-path-course-glyphs',lesson.signs);g.lang='ar';g.dir='rtl';
   b.append(top,g,el('span','deen-path-course-item-foot',t.foot));
   b.addEventListener('click',()=>open(i));
   sec.append(b);
  });
  return sec;
 }
 window.DEEN_ARABIC_MARKS=Object.freeze({version:'ds-arabic-marks-1',lessons:LESSONS.map(l=>l.id),section,open,
  progress:()=>({done:completed().length,total:LESSONS.length}),
  items:code=>LESSONS.flatMap(l=>itemsOf(l,T[code]?code:lang()).map(x=>({...x,group:l.id,ask:'read'}))),allDone:()=>LESSONS.every(l=>completed().includes(l.id)),unlocked,store:STORE});
})();
