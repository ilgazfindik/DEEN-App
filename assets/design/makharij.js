/* Telaffuz Atölyesi (pronunciation workshop) — Qur'an > Arabic path.
   Lesson 1: the tongue-tip letters ث ذ ظ. Lesson 2: the throat letters ح خ ه. Lesson 3: heavy and light pairs ص–س ط–ت ض–د. A written introduction only: no audio and no synthetic
   recitation. The mahraj description follows the common tajwid teaching and still needs review by
   a qualified teacher before it is treated as final.
   Independent of the 27-lesson chain: it has its own store, is not part of ALL_LESSONS and never
   changes the saved progress of the path. Lesson 1 is unlocked once the 7 letter lessons are complete; each next lesson after the previous one. */
(()=>{
 'use strict';
 if(window.DEEN_MAKHARIJ)return;
 const STORE='deen_arabic_makharij_v1',PASS=8;
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n};
 const LANGS=['tr','en','ar','de','fr'];
 function lang(){
  let code='';try{code=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}
  code=String(code||document.documentElement.lang||'tr').slice(0,2).toLowerCase();
  return LANGS.includes(code)?code:'tr';
 }

 const GLYPH={tha:'ث',dhal:'ذ',zza:'ظ',sin:'س',sad:'ص',zay:'ز',hha:'ح',kha:'خ',ha:'ه',kaf:'ك',tta:'ط',ta:'ت',dad:'ض',dal:'د'};
 const FALLBACK_NAME={tha:'Se',dhal:'Zel',zza:'Zı',sin:'Sin',sad:'Sad',zay:'Ze',hha:'Ha',kha:'Hı',ha:'He',kaf:'Kef',tta:'Tı',ta:'Te',dad:'Dad',dal:'Dal'};
 function letterName(id,code){
  try{const n=window.DEEN_ARABIC_LETTERS?.get?.(id)?.names?.[code];if(n)return n}catch(_){}
  return FALLBACK_NAME[id];
 }

 const C={
  tr:{
   posLow:'boğazın dibi',posMid:'boğazın ortası',posUp:'boğazın üstü',lockedPrev:'Önce bir önceki Telaffuz Atölyesi dersini bitir',
   entry:'Telaffuz Atölyesi',entrySub:'dil ucu harfleri',entryMeta:'5 dk · 9 soru',lockedMsg:'Önce 28 harf derslerini tamamla',done:'✓ Tamamlandı',
   kicker:'TELAFFUZ ATÖLYESİ',title:'Dil ucu harfleri',back:'Arapça yoluna dön',
   lead:'Bu üç harfin sesi, dil ucuyla üst ön dişlerin ucu arasında çıkar. Dil ucu dişlere hafifçe değer, hava aradan akar.',
   tip:'Türkçede bu sesler yok. “s” ve “z” diye okuma; dil ucunu dişlerin ucuna getir.',
   voiceless:'titreşimsiz',voiced:'titreşimli',thin:'ince',thick:'kalın',
   note:'Bu ders yazılı bir tanıtımdır; ses içermez. Doğru telaffuz için mutlaka bir hocadan dinleyip tekrar et.',
   start:'Derse başla',check:'Devam',next:'Sıradaki',finish:'Bitir',count:(a,b)=>'Soru '+a+' / '+b,
   right:'Doğru. Dil ucu dişlere değdi.',
   hintThaDhal:'İkisi de aynı yerden çıkar. Fark: ث’de boğaz titremez, ذ’de titrer.',
   hintDhalZza:'Mahreç aynı. ظ’de dilin arkası yükselir, ses kalındır.',
   hintThaZza:'ظ kalın ve titreşimlidir; ث ince ve titreşimsizdir.',
   hintOther:'س ص ز harfleri dil ucunu alt dişlerin arkasına yaklaştırır; ث ذ ظ ise üst dişlerin ucuna değer.',
   hintWord:'Kelimedeki dil ucu harfini yeniden ara.',
   qThroat:'Parmağını boğazına koy. Hangisini söylerken titreşim OLMAZ?',
   qVoiceless:'Titreşimsiz ve ince:',qVoicedThin:'Titreşimli ve ince:',qVoicedThick:'Titreşimli ve kalın:',
   qMakhraj:'Hangi harf, dil ucuyla üst ön dişlerin ucundan çıkar?',
   qNot:'Hangisi dil ucuyla üst ön dişlerin ucundan ÇIKMAZ?',
   qWord:'Kelimedeki dil ucu harfi hangisi?',
   resultPass:'Tebrikler, ders tamamlandı',resultFail:'Biraz daha çalış',
   score:(a,b)=>b+' sorunun '+a+'’ini ilk denemede bildin.',
   passNeed:n=>'Dersi tamamlamak için en az '+n+' doğru gerekir.',retry:'Tekrar dene',
   wordMeanings:{'thumma':'sonra','dhalika':'işte o','zalimin':'zalimler'}
  },
  en:{
   posLow:'low throat',posMid:'mid throat',posUp:'upper throat',lockedPrev:'Finish the previous Pronunciation Workshop lesson first',
   entry:'Pronunciation Workshop',entrySub:'tongue-tip letters',entryMeta:'5 min · 9 questions',lockedMsg:'Finish the 28 letter lessons first',done:'✓ Done',
   kicker:'PRONUNCIATION WORKSHOP',title:'Tongue-tip letters',back:'Back to the Arabic path',
   lead:'These three letters are made between the tip of the tongue and the tips of the upper front teeth. The tongue touches the teeth lightly and air flows past.',
   tip:'English and Turkish learners often say “s” or “z”. Put the tongue tip against the teeth instead.',
   voiceless:'voiceless',voiced:'voiced',thin:'light',thick:'heavy',
   note:'This lesson is a written introduction with no audio. Always listen to a qualified teacher to learn the correct pronunciation.',
   start:'Start lesson',check:'Continue',next:'Next',finish:'Finish',count:(a,b)=>'Question '+a+' of '+b,
   right:'Correct. The tongue tip touched the teeth.',
   hintThaDhal:'Both come from the same place. The difference: ث has no vibration in the throat, ذ does.',
   hintDhalZza:'Same place. For ظ the back of the tongue rises and the sound is heavy.',
   hintThaZza:'ظ is heavy and voiced; ث is light and voiceless.',
   hintOther:'س ص ز bring the tongue tip behind the lower teeth; ث ذ ظ touch the tips of the upper teeth.',
   hintWord:'Look again for the tongue-tip letter in the word.',
   qThroat:'Put a finger on your throat. Which one has NO vibration?',
   qVoiceless:'Voiceless and light:',qVoicedThin:'Voiced and light:',qVoicedThick:'Voiced and heavy:',
   qMakhraj:'Which letter is made with the tongue tip at the tips of the upper front teeth?',
   qNot:'Which one is NOT made with the tongue tip at the upper front teeth?',
   qWord:'Which tongue-tip letter is in this word?',
   resultPass:'Well done, lesson complete',resultFail:'A little more practice',
   score:(a,b)=>'You got '+a+' of '+b+' right on the first try.',
   passNeed:n=>'You need at least '+n+' correct to complete the lesson.',retry:'Try again',
   wordMeanings:{'thumma':'then','dhalika':'that','zalimin':'the wrongdoers'}
  },
  ar:{
   posLow:'أقصى الحلق',posMid:'وسط الحلق',posUp:'أدنى الحلق',lockedPrev:'أكمل درس ورشة النطق السابق أولاً',
   entry:'ورشة النطق',entrySub:'حروف طرف اللسان',entryMeta:'٥ دقائق · ٩ أسئلة',lockedMsg:'أكمل دروس الحروف الثمانية والعشرين أولاً',done:'✓ مكتمل',
   kicker:'ورشة النطق',title:'حروف طرف اللسان',back:'العودة إلى مسار العربية',
   lead:'تخرج هذه الحروف الثلاثة من بين طرف اللسان وأطراف الثنايا العليا. يلامس طرف اللسان الأسنان برفق ويمرّ الهواء.',
   tip:'لا توجد هذه الأصوات في التركية؛ لا تنطقها سينًا أو زايًا، بل ضع طرف اللسان على أطراف الأسنان.',
   voiceless:'مهموس',voiced:'مجهور',thin:'مرقّق',thick:'مفخّم',
   note:'هذا الدرس تعريف مكتوب بلا صوت. استمع إلى معلّم متخصص لتتعلّم النطق الصحيح.',
   start:'ابدأ الدرس',check:'متابعة',next:'التالي',finish:'إنهاء',count:(a,b)=>'السؤال '+a+' من '+b,
   right:'صحيح. لامس طرف اللسان الأسنان.',
   hintThaDhal:'يخرجان من الموضع نفسه. الفرق: الثاء مهموسة والذال مجهورة.',
   hintDhalZza:'المخرج واحد. في الظاء يرتفع مؤخر اللسان ويكون الصوت مفخّمًا.',
   hintThaZza:'الظاء مفخّمة مجهورة، والثاء مرقّقة مهموسة.',
   hintOther:'السين والصاد والزاي تقرّب طرف اللسان من الثنايا السفلى، أما الثاء والذال والظاء فعند أطراف الثنايا العليا.',
   hintWord:'ابحث مرة أخرى عن حرف طرف اللسان في الكلمة.',
   qThroat:'ضع إصبعك على حلقك. أي حرف لا اهتزاز فيه؟',
   qVoiceless:'مهموس ومرقّق:',qVoicedThin:'مجهور ومرقّق:',qVoicedThick:'مجهور ومفخّم:',
   qMakhraj:'أي حرف يخرج من طرف اللسان وأطراف الثنايا العليا؟',
   qNot:'أي حرف لا يخرج من طرف اللسان وأطراف الثنايا العليا؟',
   qWord:'أي حرف من حروف طرف اللسان في هذه الكلمة؟',
   resultPass:'أحسنت، اكتمل الدرس',resultFail:'تحتاج إلى مزيد من التدريب',
   score:(a,b)=>'أجبت عن '+a+' من '+b+' بشكل صحيح من المحاولة الأولى.',
   passNeed:n=>'تحتاج إلى '+n+' إجابات صحيحة على الأقل.',retry:'حاول مرة أخرى',
   wordMeanings:{'thumma':'بعد ذلك','dhalika':'ذلك','zalimin':'الظالمون'}
  },
  de:{
   posLow:'tiefer Rachen',posMid:'mittlerer Rachen',posUp:'oberer Rachen',lockedPrev:'Schließe zuerst die vorherige Lektion der Aussprache-Werkstatt ab',
   entry:'Aussprache-Werkstatt',entrySub:'Zungenspitzen-Buchstaben',entryMeta:'5 Min · 9 Fragen',lockedMsg:'Schließe zuerst die 28 Buchstaben-Lektionen ab',done:'✓ Fertig',
   kicker:'AUSSPRACHE-WERKSTATT',title:'Zungenspitzen-Buchstaben',back:'Zurück zum Arabisch-Pfad',
   lead:'Diese drei Buchstaben entstehen zwischen der Zungenspitze und den Spitzen der oberen Schneidezähne. Die Zunge berührt die Zähne leicht, die Luft strömt vorbei.',
   tip:'Viele sprechen hier „s“ oder „z“. Lege stattdessen die Zungenspitze an die Zähne.',
   voiceless:'stimmlos',voiced:'stimmhaft',thin:'hell',thick:'dunkel',
   note:'Diese Lektion ist eine schriftliche Einführung ohne Audio. Höre für die richtige Aussprache immer eine qualifizierte Lehrkraft.',
   start:'Lektion starten',check:'Weiter',next:'Weiter',finish:'Beenden',count:(a,b)=>'Frage '+a+' von '+b,
   right:'Richtig. Die Zungenspitze berührte die Zähne.',
   hintThaDhal:'Beide entstehen an derselben Stelle. Unterschied: ث ist stimmlos, ذ ist stimmhaft.',
   hintDhalZza:'Gleiche Stelle. Bei ظ hebt sich der hintere Zungenteil, der Klang ist dunkel.',
   hintThaZza:'ظ ist dunkel und stimmhaft; ث ist hell und stimmlos.',
   hintOther:'س ص ز nähern die Zungenspitze den unteren Zähnen; ث ذ ظ berühren die Spitzen der oberen Zähne.',
   hintWord:'Suche den Zungenspitzen-Buchstaben im Wort noch einmal.',
   qThroat:'Lege einen Finger an den Hals. Bei welchem Buchstaben gibt es KEINE Vibration?',
   qVoiceless:'Stimmlos und hell:',qVoicedThin:'Stimmhaft und hell:',qVoicedThick:'Stimmhaft und dunkel:',
   qMakhraj:'Welcher Buchstabe entsteht mit der Zungenspitze an den oberen Schneidezähnen?',
   qNot:'Welcher Buchstabe entsteht NICHT mit der Zungenspitze an den oberen Schneidezähnen?',
   qWord:'Welcher Zungenspitzen-Buchstabe steckt in diesem Wort?',
   resultPass:'Gut gemacht, Lektion abgeschlossen',resultFail:'Noch ein wenig üben',
   score:(a,b)=>'Du hast '+a+' von '+b+' beim ersten Versuch richtig.',
   passNeed:n=>'Für den Abschluss brauchst du mindestens '+n+' richtige Antworten.',retry:'Noch einmal',
   wordMeanings:{'thumma':'dann','dhalika':'jenes','zalimin':'die Ungerechten'}
  },
  fr:{
   posLow:'fond de la gorge',posMid:'milieu de la gorge',posUp:'haut de la gorge',lockedPrev:'Termine d’abord la leçon précédente de l’atelier',
   entry:'Atelier de prononciation',entrySub:'lettres de la pointe de la langue',entryMeta:'5 min · 9 questions',lockedMsg:'Termine d’abord les 28 leçons de lettres',done:'✓ Terminé',
   kicker:'ATELIER DE PRONONCIATION',title:'Lettres de la pointe de la langue',back:'Retour au parcours d’arabe',
   lead:'Ces trois lettres se prononcent entre la pointe de la langue et le bout des incisives supérieures. La langue touche légèrement les dents et l’air passe.',
   tip:'On dit souvent « s » ou « z » par erreur. Place plutôt la pointe de la langue contre les dents.',
   voiceless:'sourde',voiced:'sonore',thin:'légère',thick:'lourde',
   note:'Cette leçon est une introduction écrite, sans audio. Écoute toujours un enseignant qualifié pour apprendre la bonne prononciation.',
   start:'Commencer la leçon',check:'Continuer',next:'Suivant',finish:'Terminer',count:(a,b)=>'Question '+a+' sur '+b,
   right:'Correct. La pointe de la langue a touché les dents.',
   hintThaDhal:'Les deux sortent du même endroit. Différence : ث est sourde, ذ est sonore.',
   hintDhalZza:'Même endroit. Pour ظ, l’arrière de la langue se lève et le son est lourd.',
   hintThaZza:'ظ est lourde et sonore ; ث est légère et sourde.',
   hintOther:'س ص ز rapprochent la pointe de la langue des dents inférieures ; ث ذ ظ touchent le bout des dents supérieures.',
   hintWord:'Cherche à nouveau la lettre de la pointe de la langue dans le mot.',
   qThroat:'Pose un doigt sur ta gorge. Laquelle n’a AUCUNE vibration ?',
   qVoiceless:'Sourde et légère :',qVoicedThin:'Sonore et légère :',qVoicedThick:'Sonore et lourde :',
   qMakhraj:'Quelle lettre se prononce avec la pointe de la langue au bout des incisives supérieures ?',
   qNot:'Quelle lettre ne se prononce PAS avec la pointe de la langue au bout des incisives supérieures ?',
   qWord:'Quelle lettre de la pointe de la langue est dans ce mot ?',
   resultPass:'Bravo, leçon terminée',resultFail:'Encore un peu de pratique',
   score:(a,b)=>'Tu as réussi '+a+' question(s) sur '+b+' du premier coup.',
   passNeed:n=>'Il faut au moins '+n+' bonnes réponses pour terminer la leçon.',retry:'Réessayer',
   wordMeanings:{'thumma':'ensuite','dhalika':'cela','zalimin':'les injustes'}
  }
 };

 // ---- lesson definitions (language-neutral; texts come from C plus per-lesson overrides) ----
 const THROAT={
  tr:{entry:'Telaffuz Atölyesi',entrySub:'boğaz harfleri',title:'Boğaz harfleri',
   lead:'Bu üç harf boğazdan çıkar, ama boğazın üç ayrı yerinden: ه en dipten, ح ortadan, خ üst kısımdan (ağza en yakın yerden).',
   tip:'Türkçede hepsini “h” diye okuma. ح boğazı daraltarak, خ ise boğazın üstünden kalın bir sürtünmeyle çıkar.',
   right:'Doğru. Ses boğazdan geldi.',
   hintHaHha:'İkisi de ince ve titreşimsiz. Fark: ه boğazın en dibinden hafif bir nefes gibi, ح ise boğazın ortasından, boğaz daralarak çıkar.',
   hintHhaKha:'ح boğazın ortasından ve ince; خ boğazın üst kısmından ve kalındır.',
   hintHaKha:'ه en dipten, hafif ve ince; خ boğazın üst kısmından ve kalındır.',
   hintOther:'ك boğazdan değil, dilin arkasından çıkar.',hintWord:'Kelimedeki boğaz harfini yeniden ara.',
   qLow:'Boğazın en dibinden çıkan harf hangisi?',qMid:'Boğazın ortasından çıkan harf hangisi?',qUp:'Boğazın ağza en yakın üst kısmından çıkan harf hangisi?',
   qThick:'Hangisi kalın okunur?',qBreath:'Hafif bir nefes gibi çıkan, Türkçe “h”ye en yakın harf hangisi?',qNot:'Hangisi boğaz harflerinden DEĞİLDİR?',qWord:'Kelimedeki boğaz harfi hangisi?',
   wordMeanings:{'hamd':'övgü, hamd','khalaqa':'yarattı','huwa':'o'}},
  en:{entry:'Pronunciation Workshop',entrySub:'throat letters',title:'Throat letters',
   lead:'These three letters come from the throat, but from three different places: ه from the very bottom, ح from the middle, خ from the upper part nearest the mouth.',
   tip:'Do not read all three as “h”. ح narrows the throat; خ is a heavy, scraping sound from the top of the throat.',
   right:'Correct. The sound came from the throat.',
   hintHaHha:'Both are light and voiceless. ه is a soft breath from the very bottom; ح comes from the middle with a narrowed throat.',
   hintHhaKha:'ح is from the middle and light; خ is from the upper throat and heavy.',
   hintHaKha:'ه is from the very bottom, soft and light; خ is from the upper throat and heavy.',
   hintOther:'ك comes from the back of the tongue, not the throat.',hintWord:'Look again for the throat letter in the word.',
   qLow:'Which letter comes from the very bottom of the throat?',qMid:'Which letter comes from the middle of the throat?',qUp:'Which letter comes from the upper throat, nearest the mouth?',
   qThick:'Which one is read heavy?',qBreath:'Which letter is a light breath, closest to “h”?',qNot:'Which one is NOT a throat letter?',qWord:'Which throat letter is in this word?',
   wordMeanings:{'hamd':'praise','khalaqa':'created','huwa':'he'}},
  ar:{entry:'ورشة النطق',entrySub:'حروف الحلق',title:'حروف الحلق',
   lead:'تخرج هذه الحروف الثلاثة من الحلق، لكن من ثلاثة مواضع: الهاء من أقصاه، والحاء من وسطه، والخاء من أدناه مما يلي الفم.',
   tip:'لا تنطقها كلها هاءً؛ الحاء بتضييق الحلق، والخاء مفخّمة من أعلى الحلق.',
   right:'صحيح. خرج الصوت من الحلق.',
   hintHaHha:'كلاهما مرقّق ومهموس. الهاء نَفَس خفيف من أقصى الحلق، والحاء من وسطه مع تضييق الحلق.',
   hintHhaKha:'الحاء من وسط الحلق ومرقّقة؛ الخاء من أدناه ومفخّمة.',
   hintHaKha:'الهاء من أقصى الحلق ومرقّقة؛ الخاء من أدناه ومفخّمة.',
   hintOther:'الكاف تخرج من أقصى اللسان وليس من الحلق.',hintWord:'ابحث مرة أخرى عن حرف الحلق في الكلمة.',
   qLow:'أي حرف يخرج من أقصى الحلق؟',qMid:'أي حرف يخرج من وسط الحلق؟',qUp:'أي حرف يخرج من أدنى الحلق مما يلي الفم؟',
   qThick:'أي حرف يُنطق مفخّمًا؟',qBreath:'أي حرف نَفَس خفيف أقرب إلى الهاء؟',qNot:'أي حرف ليس من حروف الحلق؟',qWord:'أي حرف من حروف الحلق في هذه الكلمة؟',
   wordMeanings:{'hamd':'الثناء','khalaqa':'أوجد','huwa':'هو'}},
  de:{entry:'Aussprache-Werkstatt',entrySub:'Kehlbuchstaben',title:'Kehlbuchstaben',
   lead:'Diese drei Buchstaben entstehen im Rachen, aber an drei verschiedenen Stellen: ه ganz unten, ح in der Mitte, خ oben nahe am Mund.',
   tip:'Sprich nicht alle drei wie „h“. ح verengt den Rachen; خ ist ein dunkler, reibender Laut aus dem oberen Rachen.',
   right:'Richtig. Der Laut kam aus dem Rachen.',
   hintHaHha:'Beide sind hell und stimmlos. ه ist ein sanfter Hauch ganz unten; ح entsteht in der Mitte bei verengtem Rachen.',
   hintHhaKha:'ح kommt aus der Mitte und ist hell; خ kommt aus dem oberen Rachen und ist dunkel.',
   hintHaKha:'ه kommt ganz von unten, sanft und hell; خ aus dem oberen Rachen und dunkel.',
   hintOther:'ك kommt vom hinteren Zungenrücken, nicht aus dem Rachen.',hintWord:'Suche den Rachenbuchstaben im Wort noch einmal.',
   qLow:'Welcher Buchstabe kommt ganz aus der Tiefe des Rachens?',qMid:'Welcher Buchstabe kommt aus der Mitte des Rachens?',qUp:'Welcher Buchstabe kommt aus dem oberen Rachen, nahe am Mund?',
   qThick:'Welcher wird dunkel gesprochen?',qBreath:'Welcher Buchstabe ist ein leichter Hauch, am nächsten zum „h“?',qNot:'Welcher ist KEIN Rachenbuchstabe?',qWord:'Welcher Rachenbuchstabe steckt in diesem Wort?',
   wordMeanings:{'hamd':'Lob','khalaqa':'er schuf','huwa':'er'}},
  fr:{entry:'Atelier de prononciation',entrySub:'lettres de la gorge',title:'Lettres de la gorge',
   lead:'Ces trois lettres sortent de la gorge, mais de trois endroits : ه tout au fond, ح au milieu, خ en haut, près de la bouche.',
   tip:'Ne les lis pas toutes comme un « h ». ح resserre la gorge ; خ est un son lourd et râpeux du haut de la gorge.',
   right:'Correct. Le son est venu de la gorge.',
   hintHaHha:'Toutes deux sont légères et sourdes. ه est un souffle doux tout au fond ; ح sort du milieu, gorge resserrée.',
   hintHhaKha:'ح vient du milieu et est légère ; خ vient du haut de la gorge et est lourde.',
   hintHaKha:'ه vient du fond, douce et légère ; خ du haut de la gorge et lourde.',
   hintOther:'ك sort de l’arrière de la langue, pas de la gorge.',hintWord:'Cherche à nouveau la lettre de la gorge dans le mot.',
   qLow:'Quelle lettre sort tout au fond de la gorge ?',qMid:'Quelle lettre sort du milieu de la gorge ?',qUp:'Quelle lettre sort du haut de la gorge, près de la bouche ?',
   qThick:'Laquelle se prononce lourde ?',qBreath:'Quelle lettre est un souffle léger, le plus proche du « h » ?',qNot:'Laquelle n’est PAS une lettre de la gorge ?',qWord:'Quelle lettre de la gorge est dans ce mot ?',
   wordMeanings:{'hamd':'louange','khalaqa':'il a créé','huwa':'il'}}
 };
 const THICK={
  tr:{entry:'Telaffuz Atölyesi',entrySub:'kalın ve ince harfler',title:'Kalın ve ince harfler',
   lead:'Bazı harflerin kalın ve ince bir ikizi vardır; kartlarda alt alta duran harfler çifttir. Kalın harflerde dilin arkası damağa doğru yükselir ve ağız dolu gibi bir ses çıkar. İnce harflerde dil düz kalır.',
   tip:'Türkçede ص ط ض gibi kalın ünsüzler yok. Dilin arkasını yukarı kaldırarak oku; “s”, “t”, “d” gibi okuma.',
   right:'Doğru.',
   hintPair:'İkisi de aynı yerden çıkar. Fark: kalın harfte dilin arkası yükselir, ince harfte dil düz kalır.',
   hintDad:'ض dilin yan kenarından, د dil ucundan çıkar. Ayrıca ض kalın, د incedir.',
   hintOther:'Kalın harflerde dilin arkası yükselir ve ağız dolu gibi bir ses çıkar; ince harflerde dil düz kalır.',
   hintMatch:'Önce harfin kalın mı ince mi olduğunu düşün, sonra aynı yerden çıkan ince harfi bul.',
   hintWord:'Kelimedeki kalın harfi yeniden ara.',
   qThickPick:'Hangisi kalın okunur?',qThinPick:'Hangisi ince okunur?',qPairSad:'ص harfinin ince karşılığı hangisi?',qPairTta:'ط harfinin ince karşılığı hangisi?',qPairDad:'ض harfinin ince karşılığı hangisi?',qWordThick:'Kelimedeki kalın harf hangisi?',
   wordMeanings:{'samad':'Samed (herkesin muhtaç olduğu)','ard':'yer, dünya','tur':'Tûr (dağ)'}},
  en:{entry:'Pronunciation Workshop',entrySub:'heavy and light letters',title:'Heavy and light letters',
   lead:'Some letters have a heavy and a light twin; letters stacked in the cards are pairs. For heavy letters the back of the tongue rises toward the palate and the sound is full. For light letters the tongue stays flat.',
   tip:'Many languages have no heavy consonants like ص ط ض. Raise the back of the tongue; do not read them as “s”, “t” or “d”.',
   right:'Correct.',
   hintPair:'Both come from the same place. Difference: for the heavy letter the back of the tongue rises; for the light one the tongue stays flat.',
   hintDad:'ض comes from the side of the tongue, د from the tongue tip. Also ض is heavy and د is light.',
   hintOther:'For heavy letters the back of the tongue rises and the sound is full; for light letters the tongue stays flat.',
   hintMatch:'First decide whether the letter is heavy or light, then find the light letter from the same place.',
   hintWord:'Look again for the heavy letter in the word.',
   qThickPick:'Which one is read heavy?',qThinPick:'Which one is read light?',qPairSad:'Which is the light counterpart of ص?',qPairTta:'Which is the light counterpart of ط?',qPairDad:'Which is the light counterpart of ض?',qWordThick:'Which heavy letter is in this word?',
   wordMeanings:{'samad':'As-Samad (the One all depend on)','ard':'earth','tur':'Mount Tur'}},
  ar:{entry:'ورشة النطق',entrySub:'التفخيم والترقيق',title:'الحروف المفخّمة والمرقّقة',
   lead:'لبعض الحروف توأم مفخّم وآخر مرقّق؛ الحروف المتقابلة في البطاقات أزواج. في المفخّمة يرتفع مؤخر اللسان نحو الحنك ويمتلئ الفم بالصوت، وفي المرقّقة يبقى اللسان منبسطًا.',
   tip:'لا تنطق ص ط ض كالسين والتاء والدال؛ ارفع مؤخر اللسان.',
   right:'صحيح.',
   hintPair:'يخرجان من الموضع نفسه. الفرق: في المفخّم يرتفع مؤخر اللسان، وفي المرقّق يبقى منبسطًا.',
   hintDad:'الضاد تخرج من حافة اللسان والدال من طرفه. والضاد مفخّمة والدال مرقّقة.',
   hintOther:'في المفخّمة يرتفع مؤخر اللسان ويمتلئ الفم بالصوت؛ وفي المرقّقة يبقى اللسان منبسطًا.',
   hintMatch:'حدّد أولاً هل الحرف مفخّم أم مرقّق، ثم ابحث عن المرقّق من الموضع نفسه.',
   hintWord:'ابحث مرة أخرى عن الحرف المفخّم في الكلمة.',
   qThickPick:'أي حرف يُنطق مفخّمًا؟',qThinPick:'أي حرف يُنطق مرقّقًا؟',qPairSad:'ما المقابل المرقّق للصاد (ص)؟',qPairTta:'ما المقابل المرقّق للطاء (ط)؟',qPairDad:'ما المقابل المرقّق للضاد (ض)؟',qWordThick:'أي حرف مفخّم في هذه الكلمة؟',
   wordMeanings:{'samad':'الصمد','ard':'الأرض','tur':'جبل الطور'}},
  de:{entry:'Aussprache-Werkstatt',entrySub:'dunkle und helle Buchstaben',title:'Dunkle und helle Buchstaben',
   lead:'Manche Buchstaben haben einen dunklen und einen hellen Zwilling; die untereinander stehenden Karten sind Paare. Bei dunklen Buchstaben hebt sich der hintere Zungenteil zum Gaumen, der Klang ist voll. Bei hellen bleibt die Zunge flach.',
   tip:'Dunkle Konsonanten wie ص ط ض gibt es im Deutschen nicht. Hebe den hinteren Zungenteil; sprich sie nicht wie „s“, „t“ oder „d“.',
   right:'Richtig.',
   hintPair:'Beide entstehen an derselben Stelle. Unterschied: beim dunklen Buchstaben hebt sich der hintere Zungenteil, beim hellen bleibt die Zunge flach.',
   hintDad:'ض entsteht am Zungenrand, د an der Zungenspitze. Außerdem ist ض dunkel und د hell.',
   hintOther:'Bei dunklen Buchstaben hebt sich der hintere Zungenteil und der Klang ist voll; bei hellen bleibt die Zunge flach.',
   hintMatch:'Entscheide erst, ob der Buchstabe dunkel oder hell ist, und suche dann den hellen von derselben Stelle.',
   hintWord:'Suche den dunklen Buchstaben im Wort noch einmal.',
   qThickPick:'Welcher wird dunkel gesprochen?',qThinPick:'Welcher wird hell gesprochen?',qPairSad:'Welcher ist das helle Gegenstück von ص?',qPairTta:'Welcher ist das helle Gegenstück von ط?',qPairDad:'Welcher ist das helle Gegenstück von ض?',qWordThick:'Welcher dunkle Buchstabe steckt in diesem Wort?',
   wordMeanings:{'samad':'As-Samad (auf den alle angewiesen sind)','ard':'Erde','tur':'der Berg Tur'}},
  fr:{entry:'Atelier de prononciation',entrySub:'lettres lourdes et légères',title:'Lettres lourdes et légères',
   lead:'Certaines lettres ont un jumeau lourd et un léger ; les lettres superposées dans les cartes forment des paires. Pour les lourdes, l’arrière de la langue monte vers le palais et le son est plein. Pour les légères, la langue reste à plat.',
   tip:'Le français n’a pas de consonnes lourdes comme ص ط ض. Lève l’arrière de la langue ; ne les lis pas comme « s », « t » ou « d ».',
   right:'Correct.',
   hintPair:'Les deux sortent du même endroit. Différence : pour la lourde, l’arrière de la langue monte ; pour la légère, la langue reste à plat.',
   hintDad:'ض sort du côté de la langue, د de la pointe. De plus, ض est lourde et د légère.',
   hintOther:'Pour les lettres lourdes, l’arrière de la langue monte et le son est plein ; pour les légères, la langue reste à plat.',
   hintMatch:'Décide d’abord si la lettre est lourde ou légère, puis cherche la légère du même endroit.',
   hintWord:'Cherche à nouveau la lettre lourde dans le mot.',
   qThickPick:'Laquelle se prononce lourde ?',qThinPick:'Laquelle se prononce légère ?',qPairSad:'Quelle est la jumelle légère de ص ?',qPairTta:'Quelle est la jumelle légère de ط ?',qPairDad:'Quelle est la jumelle légère de ض ?',qWordThick:'Quelle lettre lourde est dans ce mot ?',
   wordMeanings:{'samad':'As-Samad (Celui dont tous dépendent)','ard':'terre','tur':'le mont Tûr'}}
 };
 const pairKey=(a,b)=>[a,b].sort().join('|');
 const LESSONS=Object.freeze([
  {id:'tongue-tip',glyphs:'ث  ذ  ظ',letters:['tha','dhal','zza'],extra:null,
   tags:{tha:['voiceless','thin'],dhal:['voiced','thin'],zza:['voiced','thick']},
   questions:[
    {id:'throat',prompt:'qThroat',options:['tha','dhal','zza'],answer:'tha'},
    {id:'p-voiceless',prompt:'qVoiceless',options:['tha','dhal','zza'],answer:'tha'},
    {id:'p-voiced-thin',prompt:'qVoicedThin',options:['tha','dhal','zza'],answer:'dhal'},
    {id:'p-voiced-thick',prompt:'qVoicedThick',options:['tha','dhal','zza'],answer:'zza'},
    {id:'m-in',prompt:'qMakhraj',options:['sin','tha','sad','zay'],answer:'tha'},
    {id:'m-out',prompt:'qNot',options:['dhal','zay','zza','tha'],answer:'zay'},
    {id:'w-thumma',prompt:'qWord',word:'ثُمَّ',meaning:'thumma',options:['tha','dhal','zza'],answer:'tha'},
    {id:'w-dhalika',prompt:'qWord',word:'ذَٰلِكَ',meaning:'dhalika',options:['tha','dhal','zza'],answer:'dhal'},
    {id:'w-zalimin',prompt:'qWord',word:'ٱلظَّٰلِمِينَ',meaning:'zalimin',options:['tha','dhal','zza'],answer:'zza'}],
   hint(q,chosen){
    if(!['tha','dhal','zza'].includes(chosen))return 'hintOther';
    if(q.word)return 'hintWord';
    const k=pairKey(q.answer,chosen);
    return k==='dhal|tha'?'hintThaDhal':k==='dhal|zza'?'hintDhalZza':'hintThaZza';
   }},
  {id:'throat',glyphs:'ح  خ  ه',letters:['ha','hha','kha'],extra:THROAT,
   tags:{ha:['posLow','thin'],hha:['posMid','thin'],kha:['posUp','thick']},
   questions:[
    {id:'t-low',prompt:'qLow',options:['hha','kha','ha'],answer:'ha'},
    {id:'t-mid',prompt:'qMid',options:['hha','kha','ha'],answer:'hha'},
    {id:'t-up',prompt:'qUp',options:['hha','kha','ha'],answer:'kha'},
    {id:'t-thick',prompt:'qThick',options:['ha','hha','kha'],answer:'kha'},
    {id:'t-breath',prompt:'qBreath',options:['kha','hha','ha'],answer:'ha'},
    {id:'t-not',prompt:'qNot',options:['kha','kaf','hha','ha'],answer:'kaf'},
    {id:'w-hamd',prompt:'qWord',word:'ٱلْحَمْدُ',meaning:'hamd',options:['ha','hha','kha'],answer:'hha'},
    {id:'w-khalaqa',prompt:'qWord',word:'خَلَقَ',meaning:'khalaqa',options:['ha','hha','kha'],answer:'kha'},
    {id:'w-huwa',prompt:'qWord',word:'هُوَ',meaning:'huwa',options:['ha','hha','kha'],answer:'ha'}],
   hint(q,chosen){
    if(chosen==='kaf')return 'hintOther';
    if(!['ha','hha','kha'].includes(chosen))return 'hintOther';
    if(q.word)return 'hintWord';
    const k=pairKey(q.answer,chosen);
    return k==='ha|hha'?'hintHaHha':k==='hha|kha'?'hintHhaKha':'hintHaKha';
   }}
  ,{id:'thick-thin',glyphs:'ص  ط  ض',letters:['sad','tta','dad','sin','ta','dal'],extra:THICK,
   tags:{sad:['thick'],tta:['thick'],dad:['thick'],sin:['thin'],ta:['thin'],dal:['thin']},
   questions:[
    {id:'k-1',prompt:'qThickPick',options:['sin','sad'],answer:'sad'},
    {id:'k-2',prompt:'qThinPick',options:['tta','ta'],answer:'ta'},
    {id:'k-3',prompt:'qThickPick',options:['dal','dad'],answer:'dad'},
    {id:'k-4',prompt:'qPairSad',pair:true,options:['ta','sin','dal'],answer:'sin'},
    {id:'k-5',prompt:'qPairTta',pair:true,options:['sin','ta','dal'],answer:'ta'},
    {id:'k-6',prompt:'qPairDad',pair:true,options:['dal','ta','sin'],answer:'dal'},
    {id:'w-samad',prompt:'qWordThick',word:'ٱلصَّمَدُ',meaning:'samad',options:['sin','sad','ta'],answer:'sad'},
    {id:'w-ard',prompt:'qWordThick',word:'ٱلْأَرْضِ',meaning:'ard',options:['dal','dad','sin'],answer:'dad'},
    {id:'w-tur',prompt:'qWordThick',word:'ٱلطُّورِ',meaning:'tur',options:['ta','tta','sad'],answer:'tta'}],
   hint(q,chosen){
    if(q.word)return 'hintWord';
    if(q.pair)return 'hintMatch';
    const k=pairKey(q.answer,chosen);
    return k==='dad|dal'?'hintDad':(k==='sad|sin'||k==='ta|tta')?'hintPair':'hintOther';
   }}
 ]);
 const lessonById=id=>LESSONS.find(l=>l.id===id)||LESSONS[0];
 const strings=(lesson,code)=>({...C[code],...(lesson.extra?lesson.extra[code]:null)});
 // Legacy (v1) saves held one lesson at the top level; they belong to the first lesson.
 function readStore(){
  try{
   const v=JSON.parse(localStorage.getItem(STORE)||'null'),out={};
   for(const l of LESSONS)out[l.id]={completed:false,best:0};
   if(v&&v.lessons&&typeof v.lessons==='object'){
    for(const l of LESSONS){const r=v.lessons[l.id];if(r)out[l.id]={completed:!!r.completed,best:Number.isInteger(r.best)?r.best:0}}
   }else if(v)out[LESSONS[0].id]={completed:!!v.completed,best:Number.isInteger(v.best)?v.best:0};
   return out;
  }catch(_){return Object.fromEntries(LESSONS.map(l=>[l.id,{completed:false,best:0}]))}
 }
 function writeStore(id,score,passed){
  const all=readStore(),cur=all[id];
  all[id]={completed:cur.completed||passed,best:Math.max(cur.best,score)};
  try{localStorage.setItem(STORE,JSON.stringify({schema:2,lessons:all,updatedAt:Date.now()}))}catch(_){}
 }
 function lettersDone(){
  try{const s=window.DEEN_QURAN_PATHS?.status?.();return !!s&&Number(s.completedLessons)>=Number(s.totalLessons)&&Number(s.totalLessons)>0}
  catch(_){return false}
 }
 // 0 = open, 1 = letter lessons unfinished, 2 = previous workshop lesson unfinished
 function lockReason(index){
  if(!lettersDone())return 1;
  if(index>0&&!readStore()[LESSONS[index-1].id].completed)return 2;
  return 0;
 }

 // ---- entry cards on the Arabic landing -----------------------------------------------
 function decorateLanding(){
  const landing=document.querySelector('#deenQuranPathView .deen-path-arabic-landing');
  if(!landing||landing.querySelector(':scope>.dsm-entry'))return;
  const code=lang(),st=readStore(),grid=landing.querySelector(':scope>.deen-path-course-grid');
  let anchor=grid;
  LESSONS.forEach((lesson,index)=>{
   const T=strings(lesson,code),lock=lockReason(index),done=st[lesson.id].completed;
   const card=el('button','dsm-entry');card.type='button';card.disabled=lock!==0;card.dataset.lesson=lesson.id;
   card.classList.toggle('is-locked',lock!==0);card.classList.toggle('is-done',done);
   const glyphs=el('span','dsm-entry-glyphs',lesson.glyphs);glyphs.lang='ar';glyphs.dir='rtl';
   const copy=el('span','dsm-entry-copy');
   copy.append(el('b','dsm-entry-title',T.entry+' '+(index+1)),
    el('small','dsm-entry-sub',lock===0?T.entrySub+' · '+T.entryMeta:'🔒 '+(lock===1?T.lockedMsg:T.lockedPrev)));
   card.append(copy,glyphs);
   if(done)card.append(el('span','dsm-entry-badge',T.done));
   card.addEventListener('click',()=>openLesson(lesson.id));
   if(anchor)anchor.insertAdjacentElement('afterend',card);else landing.append(card);
   anchor=card;
  });
 }

 // ---- lesson view ---------------------------------------------------------------------
 let S=null;
 function fresh(lesson){return {lesson,step:-1,picked:null,correct:false,wrong:'',firstTry:{}}}
 function openLesson(id){
  const index=LESSONS.findIndex(l=>l.id===id);
  if(index<0||lockReason(index)!==0)return;
  S=fresh(LESSONS[index]);render();
 }
 function mount(node){
  const panel=document.getElementById('deenQuranPathView');if(!panel)return false;
  panel.replaceChildren(node);panel.scrollIntoView?.({block:'start'});return true;
 }
 function backToPath(){S=null;try{window.DEEN_QURAN_PATHS?.enterArabic?.()}catch(_){}}
 function letterCard(id,T,code){
  const card=el('div','dsm-letter');
  const g=el('span','dsm-letter-glyph',GLYPH[id]);g.lang='ar';g.dir='rtl';
  const keys=S.lesson.tags[id],tags=el('span','dsm-letter-tags');
  keys.forEach((k,i)=>tags.append(el('i','dsm-tag'+(k==='voiced'?' is-voiced':k==='thick'?' is-thick':''),T[k])));
  card.append(g,el('b','dsm-letter-name',letterName(id,code)),tags);
  return card;
 }
 function intro(T,code){
  const box=el('section','deen-path-lesson dsm-lesson');
  const back=el('button','deen-path-back','←  '+T.back);back.type='button';back.addEventListener('click',backToPath);
  box.append(back,el('div','deen-path-kicker',T.kicker),el('h2','deen-path-inner-title',T.title),el('p','dsm-lead',T.lead));
  const row=el('div','dsm-letters');
  for(const id of S.lesson.letters)row.append(letterCard(id,T,code));
  box.append(row,el('p','dsm-tip',T.tip),el('p','deen-path-muted dsm-note',T.note));
  const go=el('button','deen-path-primary',T.start);go.type='button';
  go.addEventListener('click',()=>{S.step=0;render()});
  box.append(go);return box;
 }
 function question(T,code){
  const qs=S.lesson.questions,q=qs[S.step],box=el('section','deen-path-lesson dsm-lesson');
  const back=el('button','deen-path-back','←  '+T.back);back.type='button';back.addEventListener('click',backToPath);
  box.append(back,el('div','deen-path-kicker',T.kicker),el('p','deen-path-question-count',T.count(S.step+1,qs.length)));
  const bar=el('div','deen-path-course-progress'),fill=el('span');fill.style.width=Math.round(S.step/qs.length*100)+'%';bar.append(fill);box.append(bar);
  box.append(el('h2','deen-path-inner-title',T[q.prompt]));
  if(q.word){const w=el('div','deen-path-phrase-hint deen-path-phrase-arabic dsm-word',q.word);w.lang='ar';w.dir='rtl';box.append(w);
   if(S.correct)box.append(el('p','deen-path-muted dsm-meaning',T.wordMeanings[q.meaning]||''))}
  const options=el('div','deen-path-options dsm-options');options.style.gridTemplateColumns='repeat('+(q.options.length===3?3:2)+',1fr)';
  for(const id of q.options){
   const b=el('button','deen-path-option dsm-option');b.type='button';
   const g=el('span','dsm-option-glyph',GLYPH[id]);g.lang='ar';g.dir='rtl';
   b.append(g,el('span','dsm-option-name',letterName(id,code)));
   if(S.correct&&id===q.answer)b.classList.add('deen-path-option-correct');
   if(S.picked===id&&!S.correct)b.classList.add('is-wrong');
   b.disabled=S.correct;
   b.addEventListener('click',()=>pick(id));
   options.append(b);
  }
  box.append(options);
  if(S.correct){const f=el('p','deen-path-feedback is-correct',T.right);f.setAttribute('role','status');box.append(f)}
  else if(S.wrong){const f=el('p','deen-path-feedback is-wrong',S.wrong);f.setAttribute('role','status');box.append(f)}
  if(S.correct){
   const last=S.step===qs.length-1;
   const next=el('button','deen-path-primary',last?T.finish:T.next);next.type='button';
   next.addEventListener('click',()=>{S.step++;S.picked=null;S.correct=false;S.wrong='';render()});
   box.append(next);
  }
  return box;
 }
 function pick(id){
  const q=S.lesson.questions[S.step],T=strings(S.lesson,lang());
  if(S.correct)return;
  S.picked=id;
  if(id===q.answer){S.correct=true;S.wrong='';if(!(q.id in S.firstTry))S.firstTry[q.id]=true}
  else{S.wrong=T[S.lesson.hint(q,id)];if(!(q.id in S.firstTry))S.firstTry[q.id]=false}
  render();
 }
 function result(T){
  const qs=S.lesson.questions,score=qs.filter(q=>S.firstTry[q.id]).length,passed=score>=PASS;
  if(!S.saved){S.saved=true;writeStore(S.lesson.id,score,passed)}
  const box=el('section','deen-path-completion dsm-lesson');
  box.append(el('div','deen-path-complete-star',passed?'✦':'·'),el('h2','deen-path-inner-title',passed?T.resultPass:T.resultFail),
   el('p','deen-path-muted',T.score(score,qs.length)));
  if(!passed)box.append(el('p','deen-path-muted',T.passNeed(PASS)));
  if(!passed){const again=el('button','deen-path-primary',T.retry);again.type='button';again.addEventListener('click',()=>{S=fresh(S.lesson);render()});box.append(again)}
  const back=el('button',passed?'deen-path-primary':'deen-path-back',passed?T.back:'←  '+T.back);back.type='button';back.addEventListener('click',backToPath);
  box.append(back);return box;
 }
 function render(){
  if(!S)return;
  const code=lang(),T=strings(S.lesson,code),n=S.lesson.questions.length;
  mount(S.step<0?intro(T,code):S.step>=n?result(T):question(T,code));
 }

 // ---- install -------------------------------------------------------------------------
 let queued=false;
 const schedule=()=>{if(queued)return;queued=true;setTimeout(()=>{queued=false;decorateLanding()},60)};
 function install(){
  const body=document.getElementById('leagueScreenBody');
  if(!body){setTimeout(install,300);return}
  new MutationObserver(rows=>{if(rows.some(r=>r.addedNodes.length))schedule()}).observe(body,{childList:true,subtree:true});
  decorateLanding();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 window.DEEN_MAKHARIJ=Object.freeze({version:'makharij-v2',lessons:LESSONS,pass:PASS,strings:C,decorate:decorateLanding,open:openLesson,
  status:()=>({lessons:readStore(),unlocked:LESSONS.map((l,i)=>lockReason(i)===0),active:!!S,lesson:S?S.lesson.id:null,step:S?S.step:null})});
})();
