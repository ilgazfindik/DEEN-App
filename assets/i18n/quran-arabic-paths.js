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
 const PHONICS=window.DEEN_ARABIC_HARAKAT;
 if(!PHONICS||PHONICS.lessonCount!==3)throw Error('DEEN_ARABIC_HARAKAT_MISSING');
 const PHONIC_LESSONS=PHONICS.lessons;
 const READING=window.DEEN_ARABIC_READING;
 if(!READING||READING.lessonCount!==3)throw Error('DEEN_ARABIC_READING_MISSING');
 const READING_LESSONS=READING.lessons;
 const WORDS=window.DEEN_ARABIC_WORDS;
 if(!WORDS||WORDS.lessonCount!==3||WORDS.startIndex!==13)throw Error('DEEN_ARABIC_WORDS_MISSING');
 const WORD_LESSONS=WORDS.lessons;
 const ALL_LESSONS=Object.freeze([...LESSONS,...PHONIC_LESSONS,...READING_LESSONS,...WORD_LESSONS]);
 const WORD_STORE='deen_arabic_words_v1';
 const READING_STORE='deen_arabic_reading_v1';
 const PHONICS_STORE='deen_arabic_harakat_v1';
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
 const vowelUi={
  tr:{vowelHeading:'Harekeler ve İlk Heceler',vowelSubtitle:'Üstün, esre ve ötreyi tanı. Be ve Te ile ilk heceleri oluştur.',vowelLesson:'Hareke Dersi',vowelReady:'Harfler tamamlandı · Başlayabilirsin',vowelLocked:'Önce 28 harfin 7 dersini tamamla',vowelProgress:'Hareke ilerlemesi',markTitle:'Üstün · Esre · Ötre',syllableTitle:'Heceleri Okuyalım',vowelStart:'Hareke Alıştırmasına Başla',syllableStart:'Hece Alıştırmasına Başla',vowelHelp:'Üstün kısa a, esre kısa i, ötre kısa u işaretidir.',syllableHelp:'Öğrendiğin harekeyi ب ve ت harflerinin üzerinde bul. Yazılıştaki küçük işarete dikkat et.',audioMissing:'Sesli telaffuz henüz hazır değil; doğrulanmış harf kayıtları eklenecek.',vowelComplete:'İlk 3 hareke ve hece dersini tamamladın!',vowelFinish:'Bu hareke dersini tamamladın. Sonraki adıma geçebilirsin.',phonicsLetters:'Hareke / Hece'},
  en:{vowelHeading:'Vowels & First Syllables',vowelSubtitle:'Learn fatḥa, kasra and ḍamma, then read syllables using Bā and Tā.',vowelLesson:'Vowel Lesson',vowelReady:'Letters completed · Ready to learn',vowelLocked:'Complete all 7 letter lessons first',vowelProgress:'Vowel progress',markTitle:'Fatḥa · Kasra · Ḍamma',syllableTitle:'Read the Syllables',vowelStart:'Start Vowel Practice',syllableStart:'Start Syllable Practice',vowelHelp:'Fatḥa marks a short a, kasra a short i, and ḍamma a short u.',syllableHelp:'Find the vowel mark attached to ب or ت. Pay attention to the small sign.',audioMissing:'Verified pronunciation audio has not been added yet.',vowelComplete:'You completed the first 3 vowel and syllable lessons!',vowelFinish:'Vowel exercise completed. Continue to the next step.',phonicsLetters:'Vowels / Syllables'},
  ar:{vowelHeading:'الحركات والمقاطع الأولى',vowelSubtitle:'تعرّف على الفتحة والكسرة والضمة، ثم اقرأ المقاطع بالباء والتاء.',vowelLesson:'درس الحركات',vowelReady:'أكملت الحروف · جاهز للتعلّم',vowelLocked:'أكمل دروس الحروف السبعة أولًا',vowelProgress:'تقدّم الحركات',markTitle:'الفتحة · الكسرة · الضمة',syllableTitle:'اقرأ المقاطع',vowelStart:'ابدأ تدريب الحركات',syllableStart:'ابدأ تدريب المقاطع',vowelHelp:'الفتحة لحركة a القصيرة، والكسرة لحركة i، والضمة لحركة u.',syllableHelp:'حدّد الحركة على الحرفين ب وت. انتبه للعلامة الصغيرة.',audioMissing:'لم تُضَف بعدُ تسجيلات النطق الموثوقة.',vowelComplete:'أكملت دروس الحركات والمقاطع الثلاثة!',vowelFinish:'أكملت تدريب الحركات. تابع الدرس التالي.',phonicsLetters:'الحركات والمقاطع'},
  de:{vowelHeading:'Vokalzeichen & erste Silben',vowelSubtitle:'Lerne Fatha, Kasra und Damma. Lies dann Silben mit Bā und Tā.',vowelLesson:'Vokal-Lektion',vowelReady:'Buchstaben fertig · Bereit',vowelLocked:'Zuerst alle 7 Buchstabenlektionen abschließen',vowelProgress:'Fortschritt Vokalzeichen',markTitle:'Fatha · Kasra · Damma',syllableTitle:'Silben lesen',vowelStart:'Vokalzeichen üben',syllableStart:'Silben üben',vowelHelp:'Fatha steht für kurzes a, Kasra für i und Damma für u.',syllableHelp:'Finde das richtige Vokalzeichen auf ب oder ت.',audioMissing:'Geprüfte Ausspracheaufnahmen sind noch nicht verfügbar.',vowelComplete:'Alle 3 Vokal- und Silbenlektionen geschafft!',vowelFinish:'Vokalübung abgeschlossen. Weiter geht’s.',phonicsLetters:'Vokale / Silben'},
  fr:{vowelHeading:'Voyelles & premières syllabes',vowelSubtitle:'Découvre fatḥa, kasra et ḍamma, puis lis des syllabes avec Bā et Tā.',vowelLesson:'Leçon de voyelles',vowelReady:'Lettres terminées · Prêt à apprendre',vowelLocked:'Termine d’abord les 7 leçons de lettres',vowelProgress:'Progression des voyelles',markTitle:'Fatḥa · Kasra · Ḍamma',syllableTitle:'Lire les syllabes',vowelStart:'Pratiquer les voyelles',syllableStart:'Pratiquer les syllabes',vowelHelp:'Fatḥa indique un a bref, kasra un i bref et ḍamma un u bref.',syllableHelp:'Reconnais la voyelle sur ب ou ت. Observe le petit signe.',audioMissing:'Les enregistrements de prononciation vérifiés ne sont pas encore disponibles.',vowelComplete:'Les 3 leçons de voyelles et syllabes sont terminées !',vowelFinish:'Exercice terminé. Passe à l’étape suivante.',phonicsLetters:'Voyelles / Syllabes'}
 };
 const readingUi={
  tr:{readHeading:'Cezim, Şedde ve Med',readSub:'Üç yeni dersle duraklayan sesi, çift ünsüzü ve uzun ünlüyü ayırt et.',readLesson:'Okuma Dersi',readProgress:'Okuma işaretleri ilerlemen',readLocked:'Önce 3 hareke ve hece dersini bitir',readReady:'Başlamaya hazır',readDone:'3 okuma dersi tamamlandı!',readIntro:'Bu mini dersler işaretleri tanıtır. Doğru telaffuz ve tecvid için doğrulanmış sesli eğitim daha sonra eklenecek.',sukunTitle:'Cezim (Sükûn)',sukunDetail:'Cezim (ْ) harfte kısa ünlü olmadığını gösterir; burada harf adını ve işareti tanıyoruz.',shaddaTitle:'Şedde',shaddaDetail:'Şedde (ّ) ünsüzün çift olduğunu gösterir. Üstün, esre ve ötre ile birleşebilir.',maddTitle:'Med: Uzatma',maddDetail:'Başlangıç örnekleri: بَا = bâ, بِي = bî, بُو = bû. Uzatmanın kuralları daha sonra öğretilecek.',readCTA:'Okuma Alıştırmasına Başla',readFinish:'İşareti ve yazılışını tanıdın. Daha kapsamlı okuma ve doğrulanmış ses eğitimi sonraki aşamada.',readAllDone:'Üç yeni okuma dersini tamamladın!'},
  en:{readHeading:'Sukūn, Shadda & Madd',readSub:'Three new lessons: no short vowel, doubled consonant and long vowel.',readLesson:'Reading Lesson',readProgress:'Reading mark progress',readLocked:'Complete 3 vowel lessons first',readReady:'Ready to learn',readDone:'3 reading lessons completed!',readIntro:'These mini lessons introduce written signs. Verified pronunciation and fuller tajwid follow later.',sukunTitle:'Sukūn',sukunDetail:'Sukūn (ْ) indicates no short vowel on the consonant. Practice identifying the sign and letter.',shaddaTitle:'Shadda',shaddaDetail:'Shadda (ّ) marks a doubled consonant and may combine with short vowels.',maddTitle:'Madd: Lengthening',maddDetail:'Starter examples: بَا = bā, بِي = bī, بُو = bū. Full lengthening rules come later.',readCTA:'Start Reading Practice',readFinish:'You recognized the written pattern. Verified pronunciation and more reading rules will follow.',readAllDone:'All three reading lessons completed!'},
  ar:{readHeading:'السكون والشدة والمد',readSub:'ثلاثة دروس جديدة: السكون، والحرف المشدد، والحركات الطويلة.',readLesson:'درس القراءة',readProgress:'تقدّم علامات القراءة',readLocked:'أكمل دروس الحركات الثلاثة أولًا',readReady:'جاهز للتعلّم',readDone:'أكملت دروس القراءة الثلاثة!',readIntro:'هذه مقدمة للعلامات المكتوبة، وليست تعليمًا كاملًا للتجويد. سيُضاف النطق الموثوق لاحقًا.',sukunTitle:'السكون',sukunDetail:'يدل السكون (ْ) على غياب الحركة القصيرة عن الحرف. تدرّب على تمييز العلامة.',shaddaTitle:'الشدة',shaddaDetail:'تدل الشدة (ّ) على تضعيف الحرف، وقد تقترن بالفتحة أو الكسرة أو الضمة.',maddTitle:'المد',maddDetail:'أمثلة أولية: بَا، بِي، بُو. ستأتي قواعد المد التفصيلية لاحقًا.',readCTA:'ابدأ تدريب القراءة',readFinish:'تعرّفت على العلامة المكتوبة. ستُضاف تدريبات صوتية موثوقة لاحقًا.',readAllDone:'أكملت دروس القراءة الثلاثة!'},
  de:{readHeading:'Sukūn, Schadda & Madd',readSub:'Drei neue Lektionen: kein kurzer Vokal, Doppelkonsonant, langer Vokal.',readLesson:'Leselektion',readProgress:'Fortschritt der Lesezeichen',readLocked:'Erst die 3 Vokallektionen abschließen',readReady:'Bereit',readDone:'3 Leselektionen abgeschlossen!',readIntro:'Diese Übungen zeigen Schriftzeichen. Geprüfte Aussprache und ausführlicher Tadschwīd folgen.',sukunTitle:'Sukūn',sukunDetail:'Sukūn (ْ) zeigt an, dass kein kurzer Vokal folgt. Erkenne das Zeichen.',shaddaTitle:'Schadda',shaddaDetail:'Schadda (ّ) verdoppelt einen Konsonanten und kann mit Vokalzeichen kombiniert werden.',maddTitle:'Madd: Längung',maddDetail:'Erste Beispiele: بَا = bā, بِي = bī, بُو = bū. Weitere Regeln folgen.',readCTA:'Leseübung starten',readFinish:'Du hast das Schriftbild erkannt. Geprüfte Aussprache folgt.',readAllDone:'Alle drei Leselektionen abgeschlossen!'},
  fr:{readHeading:'Sukūn, Shadda et Madd',readSub:'Trois leçons : absence de voyelle brève, consonne doublée et voyelle longue.',readLesson:'Leçon de lecture',readProgress:'Progression des signes de lecture',readLocked:'Termine d’abord les 3 leçons de voyelles',readReady:'Prêt à commencer',readDone:'3 leçons de lecture terminées !',readIntro:'Ces exercices présentent les signes écrits. Prononciation vérifiée et règles de tajwid suivront.',sukunTitle:'Sukūn',sukunDetail:'Le sukūn (ْ) indique l’absence de voyelle brève sur une consonne.',shaddaTitle:'Shadda',shaddaDetail:'La shadda (ّ) double une consonne et peut accompagner les voyelles brèves.',maddTitle:'Madd : allongement',maddDetail:'Premiers exemples : بَا = bā, بِي = bī, بُو = bū. Les autres règles suivront.',readCTA:'Commencer la lecture',readFinish:'Tu as reconnu le signe écrit. La prononciation vérifiée viendra plus tard.',readAllDone:'Tu as terminé les trois leçons de lecture !'}
 };
 const wordUi={
 tr:{wordHeading:'Heceden Kur’an Kelimesine',wordSub:'Heceleri birleştir, kelime kur ve ayetteki kelimeyi tanı.',wordLesson:'Kelime Dersi',wordProgress:'Kelime okuma ilerlemen',wordLocked:'Önce cezim, şedde ve med derslerini tamamla',wordIntro:'Yazılı biçimleri çalışıyoruz. Latin okunuşları ipucudur; sesli kıraat ve tecvid yerine geçmez.',wordSyllablesTitle:'Heceleri Birleştir',wordWordsTitle:'Kelime Oluştur',wordQuranTitle:'Kur’an Kelimesini Bul',wordSyllablesDetail:'Harekeli parçaları doğru sırayla birleştir.',wordWordsDetail:'Cezimli harflerle harekeleri kullanarak kelime kur.',wordQuranDetail:'Ayet parçasındaki kelimenin yazılışını seçeneklerde bul.',wordCTA:'Kelime Alıştırmasına Başla',wordBuildGuide:'Okuma ipucuna göre parçaları sırayla seç.',wordFindGuide:'Ayet parçasındaki kelimeyi seçeneklerden bul.',wordWord:'Kelime',wordPartReset:'Parçaları sıfırla',wordPartial:'Parçalara sırayla dokun',wordReference:'Ayet referansı',wordWrong:'Sıra doğru değil. Parçaları sıfırlayıp yeniden dene.',wordFinish:'Yazılı kelimeleri birleştirdin ve ayet içinde tanıdın. Doğrulanmış ses eğitimi ayrıca eklenecek.',wordAllDone:'Üç kelime dersi tamamlandı!'},
 en:{wordHeading:'From Syllables to Quran Words',wordSub:'Join pieces, build words and identify them in Quran excerpts.',wordLesson:'Word Lesson',wordProgress:'Word reading progress',wordLocked:'Finish sukūn, shadda and madd lessons first',wordIntro:'Written practice only: romanization is a hint, not verified recitation or tajwid.',wordSyllablesTitle:'Join Syllables',wordWordsTitle:'Build a Word',wordQuranTitle:'Find a Quran Word',wordSyllablesDetail:'Arrange vocalized pieces to form a word.',wordWordsDetail:'Build words with short vowels and sukūn.',wordQuranDetail:'Find the written word in the excerpt.',wordCTA:'Start Word Practice',wordBuildGuide:'Use the reading hint and select pieces in order.',wordFindGuide:'Find this word in the Quran excerpt.',wordWord:'Word',wordPartReset:'Reset pieces',wordPartial:'Tap pieces in order',wordReference:'Verse reference',wordWrong:'The order is wrong. Reset and try again.',wordFinish:'You assembled written words and spotted them in verses. Verified audio will come separately.',wordAllDone:'Three word lessons completed!'},
 ar:{wordHeading:'من المقاطع إلى كلمات القرآن',wordSub:'ركّب المقاطع وتعرّف على الكلمات في الآيات.',wordLesson:'درس الكلمات',wordProgress:'تقدّم قراءة الكلمات',wordLocked:'أكمل أولًا دروس السكون والشدة والمد',wordIntro:'تمارين كتابية: الكتابة اللاتينية مجرد وسيلة مساعدة وليست تلاوة أو تجويدًا معتمدًا.',wordSyllablesTitle:'ركّب المقاطع',wordWordsTitle:'كوّن كلمة',wordQuranTitle:'تعرّف على كلمة قرآنية',wordSyllablesDetail:'رتّب المقاطع المكتوبة لتكوين كلمة.',wordWordsDetail:'كوّن كلمة بالحروف والحركات والسكون.',wordQuranDetail:'اختر الكلمة المكتوبة في الآية.',wordCTA:'ابدأ تدريب الكلمات',wordBuildGuide:'اختر الأجزاء بالترتيب بحسب المساعدة اللاتينية.',wordFindGuide:'ابحث عن هذه الكلمة في نص الآية.',wordWord:'الكلمة',wordPartReset:'إعادة القطع',wordPartial:'اضغط على القطع بالترتيب',wordReference:'موضع الآية',wordWrong:'الترتيب غير صحيح. أعد القطع وحاول مجددًا.',wordFinish:'ركّبت كلمات مكتوبة وتعرّفت عليها في الآيات. ستُضاف التلاوة الموثوقة لاحقًا.',wordAllDone:'أكملت دروس الكلمات الثلاثة!'},
 de:{wordHeading:'Von Silben zu Koranwörtern',wordSub:'Teile verbinden und Wörter in Koranversen erkennen.',wordLesson:'Wortlektion',wordProgress:'Fortschritt Wortlesen',wordLocked:'Erst Sukūn, Schadda und Madd abschließen',wordIntro:'Nur Schriftübungen: Umschrift ersetzt weder geprüfte Rezitation noch Tadschwīd.',wordSyllablesTitle:'Silben verbinden',wordWordsTitle:'Wort bilden',wordQuranTitle:'Koranwort finden',wordSyllablesDetail:'Ordne die Silben in der richtigen Reihenfolge.',wordWordsDetail:'Verbinde Buchstaben, Vokale und Sukūn.',wordQuranDetail:'Finde das Wort im Versauszug.',wordCTA:'Wortübung starten',wordBuildGuide:'Wähle die Teile mithilfe der Umschrift in der richtigen Reihenfolge.',wordFindGuide:'Finde dieses Wort im Korantext.',wordWord:'Wort',wordPartReset:'Teile zurücksetzen',wordPartial:'Teile nacheinander antippen',wordReference:'Versreferenz',wordWrong:'Falsche Reihenfolge. Bitte erneut versuchen.',wordFinish:'Du hast Wörter aufgebaut und erkannt. Geprüfte Rezitation folgt separat.',wordAllDone:'Alle drei Wortlektionen geschafft!'},
 fr:{wordHeading:'Des syllabes aux mots coraniques',wordSub:'Assemble les morceaux et repère des mots dans les versets.',wordLesson:'Leçon de mots',wordProgress:'Progression de lecture',wordLocked:'Termine d’abord sukūn, shadda et madd',wordIntro:'Écriture seulement : la translittération ne remplace ni récitation vérifiée ni tajwid.',wordSyllablesTitle:'Assembler des syllabes',wordWordsTitle:'Former un mot',wordQuranTitle:'Trouver un mot du Coran',wordSyllablesDetail:'Place les morceaux dans le bon ordre.',wordWordsDetail:'Associe consonnes, voyelles et sukūn.',wordQuranDetail:'Repère le mot dans l’extrait coranique.',wordCTA:'Commencer les exercices',wordBuildGuide:'Choisis les morceaux selon la translittération.',wordFindGuide:'Repère ce mot dans le verset.',wordWord:'Mot',wordPartReset:'Recommencer',wordPartial:'Touche les morceaux dans l’ordre',wordReference:'Référence du verset',wordWrong:'Ordre incorrect. Recommence.',wordFinish:'Tu as assemblé et reconnu des mots écrits. La prononciation vérifiée suivra.',wordAllDone:'Les trois leçons sont terminées !'}
 };
 const lang=()=>{let x=window.DEEN_APP_LOCALE?.get?.()||document.documentElement.lang||'tr';x=String(x).toLowerCase().split('-')[0];return i18n[x]?x:'tr'};
 const t=()=>Object.assign({},i18n[lang()],extra[lang()],vowelUi[lang()],readingUi[lang()],wordUi[lang()]);
 const state={view:'home',lessonIndex:0,question:0,correct:false,feedback:'',complete:false,pieces:[]};
 const storage=()=>{try{
  const v=JSON.parse(localStorage.getItem(PROGRESS_STORE)||'null');
  const completed=(v&&Array.isArray(v.completed))?v.completed.filter(x=>LESSONS.some(y=>y.id===x)):[];
  // Preserve existing phase-1 learners. Migrating to v2 never erases the old record.
  if(JSON.parse(localStorage.getItem(legacyStore)||'null')?.completed&&!completed.includes(LESSONS[0].id))completed.unshift(LESSONS[0].id);
  return {schema:2,completed:[...new Set(completed)]};
 }catch(_){return {schema:2,completed:[]}}};
 const completed=()=>storage().completed;
 const vowelStorage=()=>{
  try{const v=JSON.parse(localStorage.getItem(PHONICS_STORE)||'null');
   const valid=v&&Array.isArray(v.completed)?v.completed.filter(id=>PHONIC_LESSONS.some(item=>item.id===id)):[];
   return {schema:1,completed:[...new Set(valid)]};
  }catch(_){return {schema:1,completed:[]}}
 };
 const vowelCompleted=()=>vowelStorage().completed;
 const readingStorage=()=>{
  try{
   const raw=JSON.parse(localStorage.getItem(READING_STORE)||'null');
   const completed=raw&&Array.isArray(raw.completed)?raw.completed.filter(id=>READING_LESSONS.some(l=>l.id===id)):[];
   return {schema:1,completed:[...new Set(completed)]};
  }catch(_){return {schema:1,completed:[]}}
 };
 const readingCompleted=()=>readingStorage().completed;
 const wordCompleted=()=>{
  try{const raw=JSON.parse(localStorage.getItem(WORD_STORE)||'null');
   const valid=raw&&Array.isArray(raw.completed)?raw.completed.filter(id=>WORD_LESSONS.some(x=>x.id===id)):[];
   return [...new Set(valid)];
  }catch(_){return []}
 };
 const savedComplete=()=>completed().includes(LESSONS[0].id);
 const group=()=>ALL_LESSONS[state.lessonIndex];
 const groupLetters=()=>group().letters||group().items;
 const lessonIsDone=(g=group())=>g.kind==='recognition'?completed().includes(g.id):READING_LESSONS.includes(g)?readingCompleted().includes(g.id):WORD_LESSONS.includes(g)?wordCompleted().includes(g.id):vowelCompleted().includes(g.id);
 const isUnlocked=i=>{
  if(!Number.isInteger(i)||i<0||i>=ALL_LESSONS.length)return false;
  if(i===0)return true;
  if(i<LESSONS.length)return completed().includes(LESSONS[i-1].id);
  if(i===LESSONS.length)return completed().length===LESSONS.length;
  if(i<LESSONS.length+PHONIC_LESSONS.length)return vowelCompleted().includes(ALL_LESSONS[i-1].id);
  if(i===LESSONS.length+PHONIC_LESSONS.length)return vowelCompleted().length===PHONIC_LESSONS.length;
  if(i<WORDS.startIndex)return readingCompleted().includes(ALL_LESSONS[i-1].id);
  if(i===WORDS.startIndex)return readingCompleted().length===READING_LESSONS.length;
  return wordCompleted().includes(ALL_LESSONS[i-1].id);
 };
 function saveCompleted(){
  const id=group().id;
  if(WORD_LESSONS.includes(group())){
   const ids=wordCompleted();if(!ids.includes(id))ids.push(id);
   try{localStorage.setItem(WORD_STORE,JSON.stringify({schema:1,completed:ids,updatedAt:Date.now()}))}catch(_){}
   return;
  }
  if(READING_LESSONS.includes(group())){
   const ids=readingCompleted();if(!ids.includes(id))ids.push(id);
   try{localStorage.setItem(READING_STORE,JSON.stringify({schema:1,completed:ids,updatedAt:Date.now()}))}catch(_){}
   return;
  }
  if(group().kind!=='recognition'){
   const ids=vowelCompleted();if(!ids.includes(id))ids.push(id);
   try{localStorage.setItem(PHONICS_STORE,JSON.stringify({schema:1,completed:ids,updatedAt:Date.now()}))}catch(_){}
   return;
  }
  const ids=completed();if(!ids.includes(id))ids.push(id);
  try{
   localStorage.setItem(PROGRESS_STORE,JSON.stringify({schema:2,completed:ids,updatedAt:Date.now()}));
   if(state.lessonIndex===0)localStorage.setItem(legacyStore,JSON.stringify({completed:true,completedAt:Date.now(),schema:1}));
  }catch(_){}
 }
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
  box.appendChild(vowelRoadmap());
  box.appendChild(readingRoadmap());
  box.appendChild(wordRoadmap());
  if(done===LESSONS.length)box.appendChild(elem('p','deen-path-completed',c.courseComplete+' ✓'));
  const details=elem('details','deen-path-atlas-details');
  const summary=elem('summary','',c.allLetters);details.appendChild(summary);
  details.append(elem('p','deen-path-muted',c.atlasHelp),shapeAtlas(LETTERS));
  box.append(details,elem('p','deen-path-muted deen-path-warning',c.future));
  return box;
 }
 function vowelRoadmap(){
  const c=t(),wrap=elem('section','deen-path-vowel-section');
  wrap.append(elem('h3','deen-path-shape-subtitle',c.vowelHeading),elem('p','deen-path-muted',c.vowelSubtitle));
  const vc=vowelCompleted().length;
  wrap.append(elem('p','deen-path-progress-copy',c.vowelProgress+' · '+vc+' / '+PHONIC_LESSONS.length));
  const bar=elem('div','deen-path-course-progress'),fill=elem('span');
  fill.style.width=Math.round(100*vc/PHONIC_LESSONS.length)+'%';
  bar.append(fill);wrap.append(bar);
  for(const lesson of PHONIC_LESSONS){
   const i=lesson.index,locked=!isUnlocked(i),done=vowelCompleted().includes(lesson.id);
   const card=makeButton('','group','deen-path-course-item deen-path-vowel-item'+(done?' is-completed':'')+(locked?' is-locked':''));
   card.dataset.lessonIndex=String(i);card.disabled=locked;
   const upper=elem('span','deen-path-course-item-top');
   upper.append(elem('span','deen-path-course-number',c.vowelLesson+' '+(i-LESSONS.length+1)),elem('span','deen-path-course-status',done?'✓ '+c.done:locked?'🔒 '+(i===LESSONS.length?c.vowelLocked:c.locked):c.vowelReady));
   const chars=elem('span','deen-path-course-glyphs',lesson.items.map(x=>x.glyph).join('  '));
   chars.lang='ar';chars.dir='rtl';
   card.append(upper,chars,elem('span','deen-path-course-item-foot',(lesson.kind==='harakat'?c.markTitle:c.syllableTitle)+' · '+c.free));
   wrap.append(card);
  }
  if(vc===PHONIC_LESSONS.length)wrap.append(elem('p','deen-path-completed',c.vowelComplete+' ✓'));
  return wrap;
 }
 function readingRoadmap(){
  const c=t(),box=elem('section','deen-path-reading-section'),done=readingCompleted().length;
  box.append(elem('h3','deen-path-shape-subtitle',c.readHeading),elem('p','deen-path-muted',c.readSub));
  box.append(elem('p','deen-path-progress-copy',c.readProgress+' · '+done+' / '+READING_LESSONS.length));
  const bar=elem('div','deen-path-course-progress'),fill=elem('span');
  fill.style.width=Math.round(done/READING_LESSONS.length*100)+'%';
  bar.append(fill);box.append(bar);
  for(const lesson of READING_LESSONS){
   const locked=!isUnlocked(lesson.index),complete=readingCompleted().includes(lesson.id);
   const card=makeButton('','group','deen-path-course-item deen-path-reading-item'+(complete?' is-completed':'')+(locked?' is-locked':''));
   card.dataset.lessonIndex=String(lesson.index);card.disabled=locked;
   const title=c[lesson.kind+'Title'];
   const top=elem('span','deen-path-course-item-top');
   top.append(elem('span','deen-path-course-number',c.readLesson+' '+(lesson.index-LESSONS.length-PHONIC_LESSONS.length+1)+' · '+title),
    elem('span','deen-path-course-status',complete?'✓ '+c.done:locked?'🔒 '+(lesson.index===READING.startIndex?c.readLocked:c.locked):c.readReady));
   const forms=elem('span','deen-path-course-glyphs',lesson.items.map(item=>item.glyph).join('   '));forms.lang='ar';forms.dir='rtl';
   card.append(top,forms,elem('span','deen-path-course-item-foot',c.free+' · '+title));
   box.append(card);
  }
  if(done===READING_LESSONS.length)box.append(elem('p','deen-path-completed',c.readAllDone+' ✓'));
  return box;
 }
 function wordRoadmap(){
  const c=t(),box=elem('section','deen-path-word-section'),done=wordCompleted().length;
  box.append(elem('h3','deen-path-shape-subtitle',c.wordHeading),elem('p','deen-path-muted',c.wordSub));
  box.append(elem('p','deen-path-progress-copy',c.wordProgress+' · '+done+' / '+WORD_LESSONS.length));
  const bar=elem('div','deen-path-course-progress'),fill=elem('span');fill.style.width=Math.round(done/WORD_LESSONS.length*100)+'%';bar.append(fill);box.append(bar);
  for(const lesson of WORD_LESSONS){
   const locked=!isUnlocked(lesson.index),complete=wordCompleted().includes(lesson.id);
   const card=makeButton('','group','deen-path-course-item deen-path-word-item'+(complete?' is-completed':'')+(locked?' is-locked':''));
   card.dataset.lessonIndex=String(lesson.index);card.disabled=locked;
   const title=lesson.kind==='syllable-build'?c.wordSyllablesTitle:lesson.kind==='word-build'?c.wordWordsTitle:c.wordQuranTitle;
   const top=elem('span','deen-path-course-item-top');
   top.append(elem('span','deen-path-course-number',c.wordLesson+' '+(lesson.index-WORDS.startIndex+1)+' · '+title),elem('span','deen-path-course-status',complete?'✓ '+c.done:locked?'🔒 '+(lesson.index===WORDS.startIndex?c.wordLocked:c.locked):c.new));
   const forms=elem('span','deen-path-course-glyphs',lesson.items.map(x=>x.glyph).join('   '));forms.lang='ar';forms.dir='rtl';
   card.append(top,forms,elem('span','deen-path-course-item-foot',c.free+' · '+title));box.append(card);
  }
  if(done===WORD_LESSONS.length)box.append(elem('p','deen-path-completed',c.wordAllDone+' ✓'));
  return box;
 }
 function groupView(){
  const c=t(),items=groupLetters(),box=elem('section','deen-path-arabic-landing');
  box.append(makeButton('←  '+c.arabic,'arabic','deen-path-back'));
  const word=WORD_LESSONS.includes(group()),reading=READING_LESSONS.includes(group()),phonics=group().kind!=='recognition'&&!reading&&!word;
  const label=word?c.wordLesson:reading?c.readLesson:phonics?c.vowelLesson:c.lesson;
  const num=word?state.lessonIndex-WORDS.startIndex+1:reading?state.lessonIndex-READING.startIndex+1:phonics?state.lessonIndex-LESSONS.length+1:state.lessonIndex+1;
  const size=word?WORD_LESSONS.length:reading?READING_LESSONS.length:phonics?PHONIC_LESSONS.length:LESSONS.length;
  const title=word?(group().kind==='syllable-build'?c.wordSyllablesTitle:group().kind==='word-build'?c.wordWordsTitle:c.wordQuranTitle):reading?c[group().kind+'Title']:phonics?(group().kind==='harakat'?c.markTitle:c.syllableTitle):c.groupTitle;
  const help=word?(group().kind==='syllable-build'?c.wordSyllablesDetail:group().kind==='word-build'?c.wordWordsDetail:c.wordQuranDetail):reading?c[group().kind+'Detail']:phonics?(group().kind==='harakat'?c.vowelHelp:c.syllableHelp):c.courseInfo;
  box.append(elem('span','deen-path-pill',label+' '+num+' / '+size+' · '+c.free));
  box.append(elem('h2','deen-path-inner-title',title),elem('p','deen-path-muted',help));
  box.append(lettersStrip(items));
  if(!reading&&!phonics&&!word){
   box.append(elem('h3','deen-path-shape-subtitle',c.shape),shapeAtlas(items));
   if(items.some(item=>!item.joinsNext))box.appendChild(elem('p','deen-path-muted',c.atlasHelp));
  }
  box.append(elem('p','deen-path-muted deen-path-warning',word?c.wordIntro:reading?c.readIntro:phonics?c.audioMissing:c.courseInfo));
  box.append(makeButton(lessonIsDone()?c.redo:word?c.wordCTA:reading?c.readCTA:phonics?(group().kind==='harakat'?c.vowelStart:c.syllableStart):c.goLesson,'start','deen-path-primary'));
  return box;
 }
 function wordLessonView(){
  const c=t(),lesson=group(),items=groupLetters(),item=items[state.question],box=elem('section','deen-path-lesson deen-path-word-lesson');
  const building=lesson.kind!=='quran-find';
  box.append(makeButton('←  '+c.arabic,'group','deen-path-back'));
  box.append(elem('div','deen-path-kicker',c.wordHeading));
  box.append(elem('p','deen-path-question-count',c.progress+' '+(state.question+1)+' / '+items.length),elem('h2','deen-path-inner-title',building?c.wordBuildGuide:c.wordFindGuide));
  box.append(elem('div','deen-path-word-hint',c.wordWord+' · '+letterLabel(item)));
  if(!building){
   const verse=elem('div','deen-path-word-excerpt',item.excerpt);verse.lang='ar';verse.dir='rtl';box.append(verse);
   const choices=elem('div','deen-path-options');
   const order=[...items.slice((state.question+1)%items.length),...items.slice(0,(state.question+1)%items.length)];
   for(const candidate of order){
    const b=makeButton(candidate.glyph,'answer','deen-path-option');b.dataset.letterId=candidate.id;b.lang='ar';b.dir='rtl';
    if(state.correct&&candidate.id===item.id)b.classList.add('deen-path-option-correct');choices.append(b);
   }
   box.append(choices);
  }else{
   const preview=elem('div','deen-path-word-built',state.pieces.map(i=>item.parts[i]).join('')||'···');
   preview.lang='ar';preview.dir='rtl';preview.setAttribute('aria-label',c.wordPartial);box.append(preview);
   const options=elem('div','deen-path-word-pieces');
   for(const i of item.parts.map((_,j)=>j).reverse()){
    const b=makeButton(item.parts[i],'piece','deen-path-word-piece');b.dataset.pieceIndex=String(i);
    b.lang='ar';b.dir='rtl';b.disabled=state.pieces.includes(i);
    b.setAttribute('aria-label',c.wordPartial+' '+item.parts[i]);options.append(b);
   }
   box.append(options);
   const clear=makeButton(c.wordPartReset,'resetPieces','deen-path-back deen-path-word-reset');clear.disabled=state.pieces.length===0;box.append(clear);
  }
  box.append(elem('p','deen-path-muted deen-path-word-reference',c.wordReference+' · '+item.reference));
  if(state.feedback){const feedback=elem('p','deen-path-feedback'+(state.correct?' is-correct':' is-wrong'),state.feedback);feedback.setAttribute('role','status');box.append(feedback)}
  if(state.correct)box.append(makeButton(state.question===items.length-1?c.finish:c.next,'next','deen-path-primary'));
  return box;
 }
 function lessonView(){
  if(WORD_LESSONS.includes(group()))return wordLessonView();
  const c=t(),items=groupLetters(),box=elem('section','deen-path-lesson');
  box.append(makeButton('←  '+c.arabic,'group','deen-path-back'));
  const item=items[state.question],n=state.question+1;
  box.append(elem('div','deen-path-kicker',READING_LESSONS.includes(group())?c.readHeading:group().kind!=='recognition'?c.vowelHeading:c.lesson+' '+(state.lessonIndex+1)+' · '+c.groupTitle));
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
  box.append(elem('p','deen-path-muted',(WORD_LESSONS.includes(group())?c.wordLesson:READING_LESSONS.includes(group())?c.readLesson:group().kind==='recognition'?c.lesson:c.vowelLesson)+' '+(WORD_LESSONS.includes(group())?state.lessonIndex-WORDS.startIndex+1:READING_LESSONS.includes(group())?state.lessonIndex-READING.startIndex+1:group().kind==='recognition'?state.lessonIndex+1:state.lessonIndex-LESSONS.length+1)+' · '+groupLetters().map(x=>x.glyph).join('  ')));
  box.append(elem('p','deen-path-muted',WORD_LESSONS.includes(group())?c.wordFinish:READING_LESSONS.includes(group())?c.readFinish:group().kind==='recognition'?(completed().length===LESSONS.length?c.courseCompleteDesc:c.completedDesc):c.vowelFinish));
  if(state.lessonIndex<ALL_LESSONS.length-1)box.append(makeButton(c.nextLesson,'nextGroup','deen-path-primary'));
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
  if(!Number.isInteger(index)||index<0||index>=ALL_LESSONS.length||!isUnlocked(index))return false;
  state.lessonIndex=index;state.question=0;state.correct=false;state.feedback='';state.pieces=[];
  return show('group');
 }
 function start(){
  if(!isUnlocked(state.lessonIndex))return false;
  state.question=0;state.correct=false;state.feedback='';state.pieces=[];state.complete=false;
  return show('lesson');
 }
 function next(){
  if(!state.correct)return;
  if(state.question<groupLetters().length-1){
   state.question++;state.correct=false;state.feedback='';state.pieces=[];show('lesson');
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
 function piece(index){
  if(state.view!=='lesson'||state.correct||!WORD_LESSONS.includes(group())||group().kind==='quran-find')return;
  const item=groupLetters()[state.question];index=Number(index);
  if(!Number.isInteger(index)||index<0||index>=item.parts.length||state.pieces.includes(index)||state.pieces.length>=item.parts.length)return;
  state.pieces.push(index);
  if(state.pieces.length===item.parts.length){
   state.correct=state.pieces.every((part,i)=>part===i);
   state.feedback=state.correct?t().correct:t().wordWrong;
  }
  update();
 }
 function resetPieces(){
  if(state.view!=='lesson'||state.correct||!WORD_LESSONS.includes(group()))return;
  state.pieces=[];state.feedback='';update();
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
   else if(action==='piece')piece(b.dataset.pieceIndex);
   else if(action==='resetPieces')resetPieces();
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
 window.DEEN_QURAN_PATHS=Object.freeze({enterArabic:()=>show('arabic'),openSurahs:()=>show('surah'),home:()=>show('home'),selectGroup,start,ensure,refresh:update,status:()=>({view:state.view,lessonIndex:state.lessonIndex,lessonAvailable:true,complete:savedComplete(),completedLessons:completed().length,totalLessons:LESSONS.length,letterCount:LETTERS.length,lessonLetters:groupLetters().map(x=>x.id),vowelCompletedLessons:vowelCompleted().length,vowelTotalLessons:PHONIC_LESSONS.length,phonicsAudioReady:false,readingCompletedLessons:readingCompleted().length,readingTotalLessons:READING_LESSONS.length,readingAudioReady:false,wordCompletedLessons:wordCompleted().length,wordTotalLessons:WORD_LESSONS.length,wordAudioReady:false}),version:'quran-arabic-paths-phase5'});
})();