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
 const LISTENING=window.DEEN_ARABIC_LISTENING;
 if(!LISTENING||LISTENING.startIndex!==16||LISTENING.lessonCount!==2)throw Error('DEEN_ARABIC_LISTENING_MISSING');
 const LISTENING_LESSONS=LISTENING.lessons;
 const MEANING=window.DEEN_ARABIC_MEANING;
 if(!MEANING||MEANING.startIndex!==18||MEANING.lessonCount!==3)throw Error('DEEN_ARABIC_MEANING_MISSING');
 const MEANING_LESSONS=MEANING.lessons;
 const PHRASES=window.DEEN_ARABIC_PHRASES;
 if(!PHRASES||PHRASES.startIndex!==21||PHRASES.lessonCount!==3)throw Error('DEEN_ARABIC_PHRASES_MISSING');
 const PHRASE_LESSONS=PHRASES.lessons;
 const PATTERNS=window.DEEN_ARABIC_PATTERNS;
 if(!PATTERNS||PATTERNS.startIndex!==24||PATTERNS.lessonCount!==3)throw Error('DEEN_ARABIC_PATTERNS_MISSING');
 const PATTERN_LESSONS=PATTERNS.lessons;
 const REMEDY=window.DEEN_ARABIC_REMEDIATION;
 if(!REMEDY||REMEDY.version!==1)throw Error('DEEN_ARABIC_REMEDIATION_MISSING');
 const REMEDY_STORE='deen_arabic_remediation_v1';
 const CHECKPOINT=window.DEEN_ARABIC_CHECKPOINT;
 if(!CHECKPOINT||CHECKPOINT.version!==1)throw Error('DEEN_ARABIC_CHECKPOINT_MISSING');
 const CHECKPOINT_STORE='deen_arabic_checkpoint_v1';
 const FOUNDATION=window.DEEN_ARABIC_FOUNDATION_REVIEW;
 if(!FOUNDATION||FOUNDATION.version!==1)throw Error('DEEN_ARABIC_FOUNDATION_REVIEW_MISSING');
 const FOUNDATION_REVIEW_STORE='deen_arabic_foundation_review_v1';
 const ADAPTIVE=window.DEEN_ARABIC_ADAPTIVE;
 if(!ADAPTIVE||ADAPTIVE.version!==1)throw Error('DEEN_ARABIC_ADAPTIVE_MISSING');
 const ADAPTIVE_STORE='deen_arabic_adaptive_v1';
 const GOALS=window.DEEN_ARABIC_WEEKLY_GOALS;
 if(!GOALS||GOALS.version!==1)throw Error('DEEN_WEEKLY_GOALS_MISSING');
 const WEEKLY_BADGE_STORE='deen_arabic_weekly_badges_v1';
 const WEEKLY=window.DEEN_ARABIC_WEEKLY;
 if(!WEEKLY||WEEKLY.version!==1)throw Error('DEEN_ARABIC_WEEKLY_MISSING');
 const WEEKLY_STORE='deen_arabic_weekly_activity_v1';
 const DAILY=window.DEEN_ARABIC_DAILY;
 if(!DAILY||DAILY.version!==1)throw Error('DEEN_ARABIC_DAILY_MISSING');
 const DAILY_ACTIVITY_STORE='deen_arabic_daily_activity_v1';
 const DAILY_SETTINGS_STORE='deen_arabic_daily_settings_v1';
 const MASTERY=window.DEEN_ARABIC_MASTERY;
 if(!MASTERY||MASTERY.version!==1)throw Error('DEEN_ARABIC_MASTERY_MISSING');
 const ALL_LESSONS=Object.freeze([...LESSONS,...PHONIC_LESSONS,...READING_LESSONS,...WORD_LESSONS,...LISTENING_LESSONS,...MEANING_LESSONS,...PHRASE_LESSONS,...PATTERN_LESSONS]);
 const PATTERN_STORE='deen_arabic_patterns_v1';
 const REVIEW_CARDS=Object.freeze([...PHRASES.reviewCards,...PATTERNS.reviewCards]);
 const REVIEW_IDS=Object.freeze(REVIEW_CARDS.map(x=>x.id));
 const PHRASE_STORE='deen_arabic_phrases_v1';
 const REVIEW_STORE='deen_arabic_written_review_v1';
 const MEANING_STORE='deen_arabic_meaning_v1';
 const LISTENING_STORE='deen_arabic_listening_v1';
 const WORD_STORE='deen_arabic_words_v1';
 const READING_STORE='deen_arabic_reading_v1';
 const PHONICS_STORE='deen_arabic_harakat_v1';
 const PROGRESS_STORE='deen_arabic_foundations_v2';
 const legacyStore=STORE;
 const extra={
  tr:{course:'28 Arapça harf · 7 mini ders',lesson:'Ders',openLesson:'Dersi İncele',locked:'Önceki dersi tamamla',done:'Tamamlandı',new:'Başlamaya hazır',allLetters:'28 Harf ve Yazılış Biçimleri',atlasHelp:'Başta, ortada ve sonda harflerin biçimleri değişebilir. Bazı harfler kendilerinden sonraki harfle birleşmez.',alone:'Tek',begin:'Başta',middle:'Ortada',end:'Sonda',noMiddle:'Birleşmez',noJoin:'Sonraki harfle birleşmez',goLesson:'Alıştırmaya Başla',nextLesson:'Sonraki Derse Geç',courseProgress:'Harf öğrenme ilerlemen',courseComplete:'Tüm 7 ders tamamlandı!',courseCompleteDesc:'28 harfin adlarını tanıma alıştırmalarını bitirdin. Sonraki aşamada harekeler ve telaffuz çalışacağız.',groupTitle:'Harfleri tanıma',courseInfo:'8 harfte sesli önizleme var. Sesler telaffuz kontrolü bekliyor.',shape:'Yazılış biçimleri',letters:'harf'},
  en:{course:'28 Arabic letters · 7 mini lessons',lesson:'Lesson',openLesson:'Explore lesson',locked:'Complete the previous lesson',done:'Completed',new:'Ready to start',allLetters:'28 Letters & Writing Forms',atlasHelp:'Letters can change shape at the beginning, middle and end. Some do not connect to the next letter.',alone:'Isolated',begin:'Initial',middle:'Medial',end:'Final',noMiddle:'Does not join',noJoin:'Does not connect forward',goLesson:'Start Practice',nextLesson:'Next Lesson',courseProgress:'Your letter-learning progress',courseComplete:'All 7 lessons complete!',courseCompleteDesc:'You practiced recognizing all 28 letters. Vowels and verified pronunciation will come next.',groupTitle:'Recognize letters',courseInfo:'Audio previews are available for 8 letters; pronunciation review is pending.',shape:'Writing forms',letters:'letters'},
  ar:{course:'٢٨ حرفًا عربيًا · ٧ دروس قصيرة',lesson:'الدرس',openLesson:'استعرض الدرس',locked:'أكمل الدرس السابق',done:'مكتمل',new:'جاهز للبدء',allLetters:'الحروف الـ٢٨ وأشكال كتابتها',atlasHelp:'قد يتغيّر شكل الحرف في أول الكلمة ووسطها وآخرها. بعض الحروف لا تتصل بما بعدها.',alone:'منفصل',begin:'في البداية',middle:'في الوسط',end:'في النهاية',noMiddle:'لا يتصل',noJoin:'لا يتصل بما بعده',goLesson:'ابدأ التدريب',nextLesson:'الدرس التالي',courseProgress:'تقدّمك في تعلّم الحروف',courseComplete:'أكملت الدروس السبعة!',courseCompleteDesc:'تدرّبت على تمييز الحروف الـ٢٨. ستأتي الحركات والنطق الموثّق لاحقًا.',groupTitle:'تمييز الحروف',courseInfo:'تتوفر معاينة صوتية لثمانية أحرف، والنطق قيد المراجعة.',shape:'أشكال الكتابة',letters:'حروف'},
  de:{course:'28 arabische Buchstaben · 7 Mini-Lektionen',lesson:'Lektion',openLesson:'Lektion ansehen',locked:'Vorherige Lektion abschließen',done:'Abgeschlossen',new:'Bereit',allLetters:'28 Buchstaben und Schreibformen',atlasHelp:'Buchstaben können am Anfang, in der Mitte und am Ende anders aussehen. Manche verbinden sich nicht mit dem nächsten Buchstaben.',alone:'Einzeln',begin:'Anfang',middle:'Mitte',end:'Ende',noMiddle:'Keine Verbindung',noJoin:'Verbindet nicht nach links',goLesson:'Übung starten',nextLesson:'Nächste Lektion',courseProgress:'Fortschritt beim Buchstabenlernen',courseComplete:'Alle 7 Lektionen abgeschlossen!',courseCompleteDesc:'Du hast alle 28 Buchstaben geübt. Vokalzeichen und geprüfte Aussprache folgen.',groupTitle:'Buchstaben erkennen',courseInfo:'Für 8 Buchstaben gibt es eine Audio-Vorschau; die Aussprache wird noch geprüft.',shape:'Schreibformen',letters:'Buchstaben'},
  fr:{course:'28 lettres arabes · 7 mini-leçons',lesson:'Leçon',openLesson:'Découvrir la leçon',locked:'Termine la leçon précédente',done:'Terminée',new:'Prête',allLetters:'28 lettres et leurs formes',atlasHelp:'Les lettres peuvent changer de forme au début, au milieu et à la fin du mot. Certaines ne se lient pas à la lettre suivante.',alone:'Isolée',begin:'Initiale',middle:'Médiane',end:'Finale',noMiddle:'Pas de liaison',noJoin:'Ne se lie pas à la suivante',goLesson:'Commencer l’exercice',nextLesson:'Leçon suivante',courseProgress:'Ta progression dans les lettres',courseComplete:'Les 7 leçons sont terminées !',courseCompleteDesc:'Tu as appris à reconnaître les 28 lettres. Les voyelles et la prononciation vérifiée viendront ensuite.',groupTitle:'Reconnaître les lettres',courseInfo:'Un aperçu audio existe pour 8 lettres ; la prononciation reste à vérifier.',shape:'Formes écrites',letters:'lettres'}
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
 const listeningUi={
  tr:{listenHeading:'Dinleyerek Arapça Öğren',listenSub:'Sesleri ayırt et, duyduğun kelimeyi seç. Kayıtlar yalnızca hak ve telaffuz onayından sonra açılır.',listenLesson:'Dinleme Dersi',listenSyllableTitle:'Harekeyi Dinle ve Bul',listenWordTitle:'Duyduğun Kelimeyi Bul',listenSyllableDetail:'Üç farklı harekeli heceyi kulakla ayırt et.',listenWordDetail:'Kur’an kelimelerini seslerinden tanı.',listenReady:'Dinleme alıştırması hazır',listenPending:'Onaylı telaffuz kaydı bekleniyor',listenLocked:'Önceki dersleri tamamla',listenVerified:'Onaylı ses',listenProgress:'Dinleme ilerlemesi',listenPlay:'Sesi Dinle',listenReplay:'Yeniden Dinle',listenWorking:'Ses açılıyor…',listenWait:'Dinlemek için onaylı ses bulunmuyor. Bu dersi tamamlamak için ses gereklidir.',listenError:'Ses doğrulanamadı veya oynatılamadı; ilerleme kaydedilmedi.',listenChoose:'Duyduğun Arapça yazılışı seç',listenComplete:'Dinleme dersini tamamladın!',listenFinish:'Tüm yanıtlar onaylı ses oynatıldıktan sonra değerlendirildi.'},
  en:{listenHeading:'Learn Arabic by Listening',listenSub:'Recognize heard syllables and words. Recordings unlock only after rights and pronunciation review.',listenLesson:'Listening Lesson',listenSyllableTitle:'Listen for the Vowel',listenWordTitle:'Find the Heard Word',listenSyllableDetail:'Distinguish three vocalized Arabic syllables.',listenWordDetail:'Recognize Quran words by their sound.',listenReady:'Listening practice ready',listenPending:'Awaiting approved recordings',listenLocked:'Complete previous lessons first',listenVerified:'Approved audio',listenProgress:'Listening progress',listenPlay:'Play Audio',listenReplay:'Play Again',listenWorking:'Loading audio…',listenWait:'No approved recording is available. Audio is required to complete this lesson.',listenError:'Audio could not be verified or played; progress was not saved.',listenChoose:'Select the Arabic writing you hear',listenComplete:'Listening lesson complete!',listenFinish:'Answers were checked only after approved audio playback.'},
  ar:{listenHeading:'تعلّم العربية بالاستماع',listenSub:'ميّز الحركات والكلمات المسموعة. لا تُتاح التسجيلات إلا بعد مراجعة الحقوق والنطق.',listenLesson:'درس الاستماع',listenSyllableTitle:'استمع إلى الحركة',listenWordTitle:'اختر الكلمة المسموعة',listenSyllableDetail:'ميّز ثلاثة مقاطع صوتية.',listenWordDetail:'تعرّف على الكلمات القرآنية بالصوت.',listenReady:'الاستماع متاح',listenPending:'بانتظار تسجيلات معتمدة',listenLocked:'أكمل الدروس السابقة أولًا',listenVerified:'صوت معتمد',listenProgress:'تقدّم الاستماع',listenPlay:'استمع',listenReplay:'استمع مجددًا',listenWorking:'جارٍ تحميل الصوت…',listenWait:'لا يوجد تسجيل معتمد بعد، والصوت مطلوب لإكمال الدرس.',listenError:'تعذّر التحقق من الصوت أو تشغيله؛ لم يُحفظ التقدم.',listenChoose:'اختر الكتابة العربية التي تسمعها',listenComplete:'أكملت درس الاستماع!',listenFinish:'قُيّمت الإجابات بعد الاستماع إلى تسجيل معتمد فقط.'},
  de:{listenHeading:'Arabisch durch Zuhören',listenSub:'Laute und Wörter erkennen. Aufnahmen erst nach Rechte- und Ausspracheprüfung.',listenLesson:'Hörlektion',listenSyllableTitle:'Vokal hören und finden',listenWordTitle:'Gehörtes Wort finden',listenSyllableDetail:'Drei vokalisierte Silben unterscheiden.',listenWordDetail:'Koranwörter am Klang erkennen.',listenReady:'Hörübung bereit',listenPending:'Geprüfte Tonaufnahmen fehlen',listenLocked:'Vorherige Lektionen abschließen',listenVerified:'Geprüfter Ton',listenProgress:'Hörfortschritt',listenPlay:'Ton abspielen',listenReplay:'Erneut abspielen',listenWorking:'Ton wird geladen…',listenWait:'Noch keine geprüfte Aufnahme. Für diese Lektion wird Audio benötigt.',listenError:'Audio nicht überprüfbar oder abspielbar; kein Fortschritt gespeichert.',listenChoose:'Wähle die gehörte arabische Schrift',listenComplete:'Hörlektion abgeschlossen!',listenFinish:'Antworten wurden nur nach geprüfter Wiedergabe bewertet.'},
  fr:{listenHeading:'Apprendre l’arabe en écoutant',listenSub:'Reconnais les syllabes et les mots entendus. Audio soumis à validation des droits et de la prononciation.',listenLesson:'Leçon d’écoute',listenSyllableTitle:'Écouter la voyelle',listenWordTitle:'Trouver le mot entendu',listenSyllableDetail:'Distingue trois syllabes vocalisées.',listenWordDetail:'Reconnais les mots coraniques au son.',listenReady:'Exercice d’écoute prêt',listenPending:'Enregistrements approuvés manquants',listenLocked:'Termine les leçons précédentes',listenVerified:'Audio approuvé',listenProgress:'Progression d’écoute',listenPlay:'Écouter',listenReplay:'Réécouter',listenWorking:'Chargement du son…',listenWait:'Aucun enregistrement approuvé. Le son est nécessaire pour terminer.',listenError:'Audio non vérifié ou impossible à lire ; progression non enregistrée.',listenChoose:'Choisis l’écriture arabe entendue',listenComplete:'Leçon d’écoute terminée !',listenFinish:'Réponses validées uniquement après écoute d’un enregistrement approuvé.'}
 };
 const meaningUi={
  tr:{meaningHeading:'Kur’an Kelimelerini Anla',meaningSub:'Kelimenin anlamını bul, dil bilgisindeki görevini tanı ve ayet sırasını kur.',meaningLesson:'Anlam Dersi',meaningProgress:'Anlama ilerlemen',meaningPrereq:'Önce 16 okuma dersini tamamla',meaningReady:'Başlamaya hazır',meaningGlossTitle:'Kelimenin Anlamı',meaningRoleTitle:'Cümledeki Görevi',meaningOrderTitle:'Ayetin Kelime Sırası',meaningGlossDetail:'İhlâs suresindeki dört temel kelimeyi anlamıyla eşleştir.',meaningRoleDetail:'Emir fiili, zamir, özel isim ve birliği anlatan ismi tanı.',meaningOrderDetail:'Ayetin kelimelerini doğru sıraya koy. Bu, tam bir Arapça dil bilgisi dersi değildir.',meaningIntro:'Kelimelerin kısa anlamları öğrenme ipucudur; meal veya tefsirin yerini tutmaz.',meaningCTA:'Anlam Çalışmasına Başla',meaningGlossPrompt:'Bu anlama gelen Arapça kelime hangisi?',meaningRolePrompt:'Ayet içindeki bu görevi hangi kelime üstlenir?',meaningOrderPrompt:'Bu ayetin kelimelerini doğru sıraya diz.',meaningCheckReset:'Sıfırla ve Yeniden Dene',meaningWrongOrder:'Kelime sırası farklı. Sıfırla ve yeniden dene.',meaningVerse:'Ayet',meaningOrderHint:'Türkçe anlam ipucu',meaningFinish:'Kelimelerin temel anlamlarını ve ayet içindeki sıralarını çalıştın.',meaningDone:'Üç anlam dersi tamamlandı!'},
  en:{meaningHeading:'Understand Quran Words',meaningSub:'Learn a word’s meaning, identify its grammatical role and reconstruct verse order.',meaningLesson:'Meaning Lesson',meaningProgress:'Comprehension progress',meaningPrereq:'Complete the 16 reading lessons first',meaningReady:'Ready to start',meaningGlossTitle:'Word Meaning',meaningRoleTitle:'Role in a Phrase',meaningOrderTitle:'Order the Verse Words',meaningGlossDetail:'Match four words from Al-Ikhlas with their meanings.',meaningRoleDetail:'Find the imperative, pronoun, proper noun and word expressing oneness.',meaningOrderDetail:'Put Quran words in order. This is not a full Arabic grammar course.',meaningIntro:'Short glosses are study aids, not full translations or tafsir.',meaningCTA:'Start Meaning Practice',meaningGlossPrompt:'Which Arabic word has this meaning?',meaningRolePrompt:'Which word has this role in the verse?',meaningOrderPrompt:'Arrange the words in their Quran verse order.',meaningCheckReset:'Reset and Try Again',meaningWrongOrder:'The word order is different. Reset and try again.',meaningVerse:'Verse',meaningOrderHint:'Translation hint',meaningFinish:'You practiced word meanings and their order in selected verses.',meaningDone:'All three meaning lessons completed!'},
  ar:{meaningHeading:'افهم كلمات القرآن',meaningSub:'تعلّم المعاني الموجزة والوظائف النحوية وترتيب كلمات الآية.',meaningLesson:'درس المعاني',meaningProgress:'تقدّم الفهم',meaningPrereq:'أكمل دروس القراءة الستة عشر أولًا',meaningReady:'جاهز للبدء',meaningGlossTitle:'معاني الكلمات',meaningRoleTitle:'دور الكلمة في الجملة',meaningOrderTitle:'رتّب كلمات الآية',meaningGlossDetail:'اربط أربع كلمات من سورة الإخلاص بمعانيها.',meaningRoleDetail:'ميّز فعل الأمر والضمير والعَلَم والاسم الدال على الوحدانية.',meaningOrderDetail:'رتّب الكلمات كما وردت في الآية؛ هذا ليس درسًا كاملًا في النحو.',meaningIntro:'هذه معانٍ تعليمية موجزة لا تغني عن التفسير.',meaningCTA:'ابدأ تدريب المعاني',meaningGlossPrompt:'أي كلمة عربية تعني ما يأتي؟',meaningRolePrompt:'أي كلمة تؤدي هذا الدور في الآية؟',meaningOrderPrompt:'رتّب الكلمات كما وردت في الآية.',meaningCheckReset:'أعِد المحاولة',meaningWrongOrder:'ترتيب الكلمات غير صحيح. أعد المحاولة.',meaningVerse:'الآية',meaningOrderHint:'مساعدة بالمعنى',meaningFinish:'تدرّبت على المعاني الأساسية وترتيب الكلمات في الآيات.',meaningDone:'أكملت دروس المعاني الثلاثة!'},
  de:{meaningHeading:'Koranwörter verstehen',meaningSub:'Wortbedeutungen, Satzfunktionen und Wortfolge im Vers üben.',meaningLesson:'Bedeutungslektion',meaningProgress:'Fortschritt Sprachverständnis',meaningPrereq:'Zuerst die 16 Leselektionen abschließen',meaningReady:'Bereit',meaningGlossTitle:'Wortbedeutungen',meaningRoleTitle:'Funktion im Satz',meaningOrderTitle:'Verswörter ordnen',meaningGlossDetail:'Vier Wörter aus Al-Ichlās mit ihrer Bedeutung verbinden.',meaningRoleDetail:'Imperativ, Pronomen, Eigenname und ein Wort für Einzigkeit erkennen.',meaningOrderDetail:'Wörter in Koranreihenfolge ordnen; kein vollständiger Grammatikkurs.',meaningIntro:'Kurzglossen ersetzen keine vollständige Übersetzung oder Exegese.',meaningCTA:'Bedeutungsübung starten',meaningGlossPrompt:'Welches arabische Wort hat diese Bedeutung?',meaningRolePrompt:'Welches Wort hat diese Funktion im Vers?',meaningOrderPrompt:'Ordne die Wörter wie im Vers.',meaningCheckReset:'Zurücksetzen',meaningWrongOrder:'Falsche Reihenfolge. Versuche es erneut.',meaningVerse:'Vers',meaningOrderHint:'Bedeutungshinweis',meaningFinish:'Du hast Wortbedeutungen und die Wortfolge im Vers geübt.',meaningDone:'Drei Bedeutungslektionen geschafft!'},
  fr:{meaningHeading:'Comprendre les mots du Coran',meaningSub:'Étudie le sens, les fonctions grammaticales et l’ordre des mots.',meaningLesson:'Leçon de sens',meaningProgress:'Progression en compréhension',meaningPrereq:'Termine d’abord les 16 leçons de lecture',meaningReady:'Prêt',meaningGlossTitle:'Sens des mots',meaningRoleTitle:'Rôle dans la phrase',meaningOrderTitle:'Ordonner les mots du verset',meaningGlossDetail:'Associe quatre mots d’Al-Ikhlâs à leur sens.',meaningRoleDetail:'Repère impératif, pronom, nom propre et nom évoquant l’unicité.',meaningOrderDetail:'Replace les mots dans l’ordre du verset. Ce n’est pas un cours complet de grammaire.',meaningIntro:'Ces gloses sont des aides, pas une traduction ni un tafsir complet.',meaningCTA:'Commencer la compréhension',meaningGlossPrompt:'Quel mot arabe a ce sens ?',meaningRolePrompt:'Quel mot joue ce rôle dans le verset ?',meaningOrderPrompt:'Remets les mots dans l’ordre du verset.',meaningCheckReset:'Recommencer',meaningWrongOrder:'L’ordre est incorrect. Réessaie.',meaningVerse:'Verset',meaningOrderHint:'Indice de traduction',meaningFinish:'Tu as étudié le sens des mots et leur ordre dans les versets.',meaningDone:'Les trois leçons sont terminées !'}
 };
 const phraseUi={
  tr:{"phraseHeading":"Kur’an İfadelerini Anla","phraseSub":"Sık kullanılan Kur’an kelimeleri ve kısa ifadelerin yazılı anlamlarını çalış.","phraseLesson":"İfade Dersi","phraseVocabTitle":"Kelime Hazinesi","phraseContextTitle":"Kısa İfadeler","phraseOrderTitle":"Ayet Sırası","phrasePrereq":"Önce üç anlam dersini tamamla","phraseVocabDetail":"Yazılı bir kelimeyi anlamıyla eşleştir.","phraseContextDetail":"Kısa ifadenin anlamını seç.","phraseOrderDetail":"Ayet kelimelerini sırayla yerleştir.","phraseVocabPrompt":"Anlamına uygun Arapça kelimeyi seç.","phraseContextPrompt":"Bu ifadenin anlamı nedir?","phraseOrderPrompt":"Kelimeleri ayet sırasına diz.","phraseCTA":"İfadeleri Çalış","phraseWrongOrder":"Yanlış sıra. Sıfırlayıp tekrar dene.","phraseReset":"Tekrar dene","phraseVerse":"Ayet","phraseNote":"Dil bilgisi ipucu","phraseDone":"Üç ifade dersi tamamlandı!","reviewHeading":"Aralıklı Tekrar","reviewSub":"Yazılı kelimeleri 1, 3, 7, 14 ve 30 gün aralıklarla hatırla.","reviewDue":"Tekrar zamanı gelen","reviewTracked":"Öğrenilen kart","reviewButton":"Tekrara Başla","reviewNone":"Bugün tekrarlanacak kart yok.","reviewPrompt":"Doğru eşleştirmeyi seç.","reviewCorrect":"Doğru! Yeni tekrar planlandı.","reviewWrong":"Bu kart yaklaşık 10 dakika sonra yeniden gelecek.","reviewNext":"Sonraki Kart","reviewComplete":"Tekrar tamamlandı!","reviewBack":"Derslere Dön","reviewSample":"Ses içermeyen yazılı çalışma"},
  en:{"phraseHeading":"Understand Quran Phrases","phraseSub":"Study contextual Quran words and short written expressions.","phraseLesson":"Phrase Lesson","phraseVocabTitle":"Vocabulary","phraseContextTitle":"Short Phrases","phraseOrderTitle":"Verse Order","phrasePrereq":"Finish the three meaning lessons first","phraseVocabDetail":"Match words with their meanings.","phraseContextDetail":"Choose the meaning of a short expression.","phraseOrderDetail":"Arrange verse words in order.","phraseVocabPrompt":"Select the Arabic word for this meaning.","phraseContextPrompt":"What does this expression mean?","phraseOrderPrompt":"Arrange the words in Quran order.","phraseCTA":"Start Phrase Practice","phraseWrongOrder":"Wrong order. Reset and retry.","phraseReset":"Try Again","phraseVerse":"Verse","phraseNote":"Language hint","phraseDone":"Three phrase lessons completed!","reviewHeading":"Spaced Review","reviewSub":"Recall written cards after 1, 3, 7, 14 and 30 days.","reviewDue":"Cards due","reviewTracked":"Cards learned","reviewButton":"Start Review","reviewNone":"No reviews due today.","reviewPrompt":"Select the correct match.","reviewCorrect":"Correct! The next review is scheduled.","reviewWrong":"This card will return in about 10 minutes.","reviewNext":"Next Card","reviewComplete":"Reviews completed!","reviewBack":"Back to Lessons","reviewSample":"Written recall, no audio"},
  ar:{"phraseHeading":"افهم العبارات القرآنية","phraseSub":"تعلّم المفردات والتعبيرات المكتوبة في سياق الآيات.","phraseLesson":"درس العبارات","phraseVocabTitle":"المفردات","phraseContextTitle":"عبارات قصيرة","phraseOrderTitle":"ترتيب الآيات","phrasePrereq":"أكمل دروس المعاني الثلاثة أولًا","phraseVocabDetail":"اربط الكلمات بمعانيها.","phraseContextDetail":"اختر معنى العبارة.","phraseOrderDetail":"رتّب كلمات الآية.","phraseVocabPrompt":"اختر الكلمة العربية المناسبة.","phraseContextPrompt":"ما معنى هذه العبارة؟","phraseOrderPrompt":"رتّب كلمات الآية.","phraseCTA":"ابدأ درس العبارات","phraseWrongOrder":"الترتيب غير صحيح، حاول مجددًا.","phraseReset":"إعادة المحاولة","phraseVerse":"الآية","phraseNote":"مساعدة لغوية","phraseDone":"اكتملت دروس العبارات الثلاثة!","reviewHeading":"المراجعة المتباعدة","reviewSub":"تُراجع البطاقات الكتابية بعد 1 و3 و7 و14 و30 يومًا.","reviewDue":"بطاقات مستحقة","reviewTracked":"بطاقات تعلّمتها","reviewButton":"ابدأ المراجعة","reviewNone":"لا توجد مراجعات مستحقة اليوم.","reviewPrompt":"اختر الإجابة الصحيحة.","reviewCorrect":"صحيح! حُدد موعد المراجعة التالية.","reviewWrong":"ستعود البطاقة بعد نحو عشر دقائق.","reviewNext":"البطاقة التالية","reviewComplete":"اكتملت المراجعة!","reviewBack":"العودة إلى الدروس","reviewSample":"مراجعة كتابية بلا صوت"},
  de:{"phraseHeading":"Koranische Wendungen verstehen","phraseSub":"Wörter und kurze Ausdrücke im Korankontext üben.","phraseLesson":"Wendungslektion","phraseVocabTitle":"Wortschatz","phraseContextTitle":"Kurze Wendungen","phraseOrderTitle":"Versfolge","phrasePrereq":"Erst drei Bedeutungslektionen abschließen","phraseVocabDetail":"Verbinde Wörter und Bedeutungen.","phraseContextDetail":"Wähle die Bedeutung des Ausdrucks.","phraseOrderDetail":"Ordne die Wörter des Verses.","phraseVocabPrompt":"Welches arabische Wort passt dazu?","phraseContextPrompt":"Was bedeutet der Ausdruck?","phraseOrderPrompt":"Ordne die Wörter im Vers.","phraseCTA":"Wendungen üben","phraseWrongOrder":"Falsche Reihenfolge. Erneut versuchen.","phraseReset":"Zurücksetzen","phraseVerse":"Vers","phraseNote":"Sprachlicher Hinweis","phraseDone":"Drei Wendungslektionen geschafft!","reviewHeading":"Verteilte Wiederholung","reviewSub":"Schriftkarten nach 1, 3, 7, 14 und 30 Tagen wiederholen.","reviewDue":"Fällige Karten","reviewTracked":"Gelernte Karten","reviewButton":"Wiederholen","reviewNone":"Keine Wiederholung fällig.","reviewPrompt":"Wähle die richtige Antwort.","reviewCorrect":"Richtig! Nächste Wiederholung geplant.","reviewWrong":"Karte kommt in etwa zehn Minuten zurück.","reviewNext":"Nächste Karte","reviewComplete":"Wiederholung fertig!","reviewBack":"Zurück zu den Lektionen","reviewSample":"Schriftliche Übung ohne Ton"},
  fr:{"phraseHeading":"Comprendre les expressions coraniques","phraseSub":"Étudie des mots et expressions écrites dans leur contexte.","phraseLesson":"Leçon d’expression","phraseVocabTitle":"Vocabulaire","phraseContextTitle":"Expressions courtes","phraseOrderTitle":"Ordre du verset","phrasePrereq":"Termine d’abord les trois leçons de sens","phraseVocabDetail":"Associe les mots à leurs sens.","phraseContextDetail":"Choisis le sens de l’expression.","phraseOrderDetail":"Replace les mots dans l’ordre.","phraseVocabPrompt":"Quel mot arabe correspond ?","phraseContextPrompt":"Que signifie cette expression ?","phraseOrderPrompt":"Remets les mots dans l’ordre.","phraseCTA":"Commencer","phraseWrongOrder":"Ordre incorrect. Réessaie.","phraseReset":"Recommencer","phraseVerse":"Verset","phraseNote":"Indice linguistique","phraseDone":"Trois leçons terminées !","reviewHeading":"Révision espacée","reviewSub":"Revois les cartes écrites après 1, 3, 7, 14 et 30 jours.","reviewDue":"Cartes dues","reviewTracked":"Cartes apprises","reviewButton":"Réviser","reviewNone":"Aucune révision due.","reviewPrompt":"Retrouve la bonne réponse.","reviewCorrect":"Bravo ! Prochaine révision programmée.","reviewWrong":"Cette carte reviendra dans environ dix minutes.","reviewNext":"Carte suivante","reviewComplete":"Révision terminée !","reviewBack":"Retour aux leçons","reviewSample":"Exercice écrit, sans audio"}
 };
 const patternUi={
  tr:{"patternHeading":"Kur’an Cümle Kalıpları","patternSub":"Nâs ve İhlâs surelerinden yeni kelimeler, ifadeler ve basit dil bilgisi.","patternLesson":"Kalıp Dersi","patternVocabTitle":"Yeni Kelimeler","patternContextTitle":"Kısa İfadeler","patternStructureTitle":"Cümle Yapısı","patternPrereq":"Önce ifade derslerini tamamla","patternVocabPrompt":"Bu kelimenin anlamı hangisi?","patternContextPrompt":"Bu kısa ifadenin anlamını seç.","patternStructurePrompt":"Bu Arapça ifadeye uygun dil bilgisi yapısı hangisi?","patternFinish":"Yeni kelimeler ve basit kalıpları çalıştın.","patternCTA":"Kalıpları Öğren","weakHeading":"Zorlandığın Kelimeler","weakSub":"Zorlandığın kelimeleri tekrar çalış; zamanı gelen kartlara öncelik verilir.","weakCTA":"Zayıf Kartları Çalış","weakEmpty":"Önce alıştırmalarda yanlış yaptığın kartlar burada görünecek."},
  en:{"patternHeading":"Quran Sentence Patterns","patternSub":"New words, expressions and grammar clues from An-Nas and Al-Ikhlas.","patternLesson":"Pattern Lesson","patternVocabTitle":"New Vocabulary","patternContextTitle":"Short Expressions","patternStructureTitle":"Sentence Structure","patternPrereq":"Complete the phrase lessons first","patternVocabPrompt":"What does this word mean?","patternContextPrompt":"What does this short expression mean?","patternStructurePrompt":"Which grammar pattern describes the Arabic phrase?","patternFinish":"You practiced new vocabulary and sentence structures.","patternCTA":"Learn Patterns","weakHeading":"Your Difficult Words","weakSub":"Review words you struggled with; due cards receive priority.","weakCTA":"Practice Weak Cards","weakEmpty":"Cards you miss in exercises will appear here."},
  ar:{"patternHeading":"أنماط الجمل القرآنية","patternSub":"مفردات وعبارات وقواعد مبسطة من سورتي الناس والإخلاص.","patternLesson":"درس التراكيب","patternVocabTitle":"مفردات جديدة","patternContextTitle":"عبارات قصيرة","patternStructureTitle":"بنية الجملة","patternPrereq":"أكمل دروس العبارات أولًا","patternVocabPrompt":"ما معنى هذه الكلمة؟","patternContextPrompt":"ما معنى هذه العبارة القصيرة؟","patternStructurePrompt":"ما البنية اللغوية المناسبة لهذه العبارة؟","patternFinish":"درست كلمات جديدة وتراكيب أساسية.","patternCTA":"تعلّم التراكيب","weakHeading":"الكلمات الصعبة","weakSub":"راجع الكلمات التي أخطأت فيها، مع أولوية للمراجعات المستحقة.","weakCTA":"راجع البطاقات الصعبة","weakEmpty":"ستظهر هنا الكلمات التي أخطأت فيها سابقًا."},
  de:{"patternHeading":"Koranische Satzmuster","patternSub":"Neue Wörter und einfache Grammatik aus An-Nas und Al-Ichlās.","patternLesson":"Musterlektion","patternVocabTitle":"Neue Wörter","patternContextTitle":"Kurze Wendungen","patternStructureTitle":"Satzstruktur","patternPrereq":"Zuerst die Wendungslektionen abschließen","patternVocabPrompt":"Was bedeutet dieses Wort?","patternContextPrompt":"Was bedeutet dieser Ausdruck?","patternStructurePrompt":"Welche Satzstruktur passt hierzu?","patternFinish":"Du hast neue Wörter und Strukturen geübt.","patternCTA":"Muster lernen","weakHeading":"Schwierige Wörter","weakSub":"Wiederhole schwierige Wörter; fällige Karten erhalten Vorrang.","weakCTA":"Schwierige Karten üben","weakEmpty":"Hier erscheinen Karten, bei denen Fehler auftraten."},
  fr:{"patternHeading":"Structures de phrases coraniques","patternSub":"Mots et grammaire simple des sourates An-Nas et Al-Ikhlâs.","patternLesson":"Leçon de structures","patternVocabTitle":"Nouveaux mots","patternContextTitle":"Expressions courtes","patternStructureTitle":"Structure de phrase","patternPrereq":"Termine d’abord les leçons d’expressions","patternVocabPrompt":"Que signifie ce mot ?","patternContextPrompt":"Que signifie cette expression ?","patternStructurePrompt":"Quelle structure grammaticale correspond ?","patternFinish":"Tu as étudié de nouveaux mots et des structures simples.","patternCTA":"Étudier les structures","weakHeading":"Mots difficiles","weakSub":"Révise les mots difficiles, en donnant priorité aux cartes dues.","weakCTA":"Réviser les cartes difficiles","weakEmpty":"Les cartes avec des erreurs apparaîtront ici."}
 };
 const masteryUi={
  tr:{"masteryHeading":"Arapça Ustalık Panelim","masteryIntro":"Yazılı ders ve tekrar kayıtlarına dayalı öğrenme görünümü.","masteryOpen":"Ustalığımı Gör","masteryBack":"Arapça Derslerine Dön","masteryPracticed":"Çalışılan kart","masteryWritten":"Tamamlanan yazılı ders","masteryDue":"Tekrar zamanı gelen","masteryWeak":"Hata yapılan kart","masteryStages":"Tekrar aşaması dağılımı","masteryNotStarted":"Henüz çalışılmadı","masteryNeedsPractice":"Yeniden çalışılmalı","masteryLearning":"Gelişiyor","masteryStrengthening":"Pekiştiriliyor","masteryLevelsNote":"Bu aşamalar tekrar düzenini gösterir; dil yeterliliğini veya doğru telaffuzu ölçmez.","masteryGroupPhraseVocab":"Kelime Hazinesi","masteryGroupPhrases":"Kısa İfadeler","masteryGroupPatternVocab":"Yeni Kelimeler","masteryGroupPatterns":"Kur’an Kalıpları","masteryGroupHeading":"Konulara Göre İlerleme","masteryCardsTitle":"Kelime ve İfade Kartları","masteryFilterAll":"Tümü","masteryFilterDue":"Tekrar Zamanı","masteryFilterWeak":"Zorlandıklarım","masteryFilterNew":"Yeni Kartlar","masteryEmpty":"Bu kategoride henüz kart yok.","masteryAttempts":"Deneme","masteryMistakes":"Hata","masteryNext":"Sonraki tekrar","masteryNextNone":"Planlanmadı","masteryNow":"Şimdi","masteryPracticeDue":"Zamanı Gelenleri Çalış","masteryPracticeWeak":"Zorlandıklarımı Çalış","masteryContinue":"Sıradaki Derse Geç","masteryNotUnlocked":"Yeni derslerin kilidini açmak için önceki dersleri tamamla.","masteryPrivacy":"Bu bir hafıza/çalışma göstergesidir; kıraat, tecvid veya dinî yeterlilik belgesi değildir.","masteryLocalOnly":"Bu cihazdaki kayıtlar kullanılır; hesabına otomatik aktarılmaz."},
  en:{"masteryHeading":"My Arabic Mastery","masteryIntro":"Learning overview based on written lessons and review history.","masteryOpen":"View My Progress","masteryBack":"Back to Arabic Lessons","masteryPracticed":"Cards practiced","masteryWritten":"Written lessons done","masteryDue":"Reviews due","masteryWeak":"Cards with mistakes","masteryStages":"Review-stage distribution","masteryNotStarted":"Not practiced","masteryNeedsPractice":"Needs practice","masteryLearning":"Developing","masteryStrengthening":"Reinforcing","masteryLevelsNote":"Stages reflect spaced practice, not proof of fluency or pronunciation.","masteryGroupPhraseVocab":"Vocabulary","masteryGroupPhrases":"Short Phrases","masteryGroupPatternVocab":"New Words","masteryGroupPatterns":"Quran Patterns","masteryGroupHeading":"Progress by Topic","masteryCardsTitle":"Word and Phrase Cards","masteryFilterAll":"All","masteryFilterDue":"Due","masteryFilterWeak":"Difficult","masteryFilterNew":"New","masteryEmpty":"No cards match this filter.","masteryAttempts":"Attempts","masteryMistakes":"Mistakes","masteryNext":"Next review","masteryNextNone":"Not scheduled","masteryNow":"Now","masteryPracticeDue":"Practice Due Cards","masteryPracticeWeak":"Practice Difficult Cards","masteryContinue":"Continue Lessons","masteryNotUnlocked":"Complete earlier lessons to unlock the next one.","masteryPrivacy":"Practice indicators do not certify Arabic fluency, recitation or Tajwid.","masteryLocalOnly":"Based on this device only; not automatically synced to an account."},
  ar:{"masteryHeading":"مستوى تقدمي في العربية","masteryIntro":"ملخص مبني على الدروس الكتابية وسجل المراجعة.","masteryOpen":"اعرض تقدمي","masteryBack":"العودة إلى دروس العربية","masteryPracticed":"بطاقات درستها","masteryWritten":"دروس كتابية مكتملة","masteryDue":"مراجعات مستحقة","masteryWeak":"بطاقات أخطأت فيها","masteryStages":"مراحل المراجعة","masteryNotStarted":"لم تُدرس بعد","masteryNeedsPractice":"تحتاج إلى مراجعة","masteryLearning":"في طور التعلم","masteryStrengthening":"في طور التثبيت","masteryLevelsNote":"هذه المراحل توضح التمرين ولا تقيس الطلاقة أو صحة التلاوة.","masteryGroupPhraseVocab":"المفردات","masteryGroupPhrases":"عبارات قصيرة","masteryGroupPatternVocab":"كلمات جديدة","masteryGroupPatterns":"تراكيب قرآنية","masteryGroupHeading":"التقدم حسب الموضوع","masteryCardsTitle":"بطاقات الكلمات والعبارات","masteryFilterAll":"الكل","masteryFilterDue":"مستحقة","masteryFilterWeak":"صعبة","masteryFilterNew":"جديدة","masteryEmpty":"لا توجد بطاقات في هذا القسم.","masteryAttempts":"محاولات","masteryMistakes":"أخطاء","masteryNext":"المراجعة القادمة","masteryNextNone":"لم تُحدد","masteryNow":"الآن","masteryPracticeDue":"راجع البطاقات المستحقة","masteryPracticeWeak":"راجع البطاقات الصعبة","masteryContinue":"تابع الدروس","masteryNotUnlocked":"أكمل الدروس السابقة لفتح الدرس التالي.","masteryPrivacy":"هذا مؤشر تدريب ولا يُعد شهادة للطلاقة أو التجويد أو التلاوة.","masteryLocalOnly":"البيانات محفوظة على هذا الجهاز وليست مزامنة تلقائيًا مع الحساب."},
  de:{"masteryHeading":"Mein Arabisch-Lernstand","masteryIntro":"Übersicht aus schriftlichen Lektionen und Wiederholungen.","masteryOpen":"Fortschritt anzeigen","masteryBack":"Zurück zu Arabisch","masteryPracticed":"Geübte Karten","masteryWritten":"Schriftlektionen abgeschlossen","masteryDue":"Fällige Wiederholungen","masteryWeak":"Karten mit Fehlern","masteryStages":"Wiederholungsstufen","masteryNotStarted":"Noch nicht geübt","masteryNeedsPractice":"Braucht Übung","masteryLearning":"Im Aufbau","masteryStrengthening":"Wird gefestigt","masteryLevelsNote":"Die Stufen zeigen Übung, keine zertifizierte Sprach- oder Aussprachekompetenz.","masteryGroupPhraseVocab":"Wortschatz","masteryGroupPhrases":"Kurze Wendungen","masteryGroupPatternVocab":"Neue Wörter","masteryGroupPatterns":"Koranische Muster","masteryGroupHeading":"Fortschritt nach Themen","masteryCardsTitle":"Wort- und Wendungskarten","masteryFilterAll":"Alle","masteryFilterDue":"Fällig","masteryFilterWeak":"Schwierig","masteryFilterNew":"Neu","masteryEmpty":"Keine Karten in dieser Auswahl.","masteryAttempts":"Versuche","masteryMistakes":"Fehler","masteryNext":"Nächste Wiederholung","masteryNextNone":"Noch nicht geplant","masteryNow":"Jetzt","masteryPracticeDue":"Fällige Karten üben","masteryPracticeWeak":"Schwierige Karten üben","masteryContinue":"Lektionen fortsetzen","masteryNotUnlocked":"Zum Freischalten zuerst frühere Lektionen abschließen.","masteryPrivacy":"Diese Anzeige bestätigt keine Rezitations- oder Tadschwid-Kompetenz.","masteryLocalOnly":"Nur Daten dieses Geräts; keine automatische Kontosynchronisierung."},
  fr:{"masteryHeading":"Ma progression en arabe","masteryIntro":"Vue fondée sur les leçons écrites et les révisions.","masteryOpen":"Voir ma progression","masteryBack":"Retour aux leçons","masteryPracticed":"Cartes étudiées","masteryWritten":"Leçons écrites terminées","masteryDue":"Révisions dues","masteryWeak":"Cartes avec erreurs","masteryStages":"Étapes de révision","masteryNotStarted":"Non étudiées","masteryNeedsPractice":"À retravailler","masteryLearning":"En apprentissage","masteryStrengthening":"En consolidation","masteryLevelsNote":"Les étapes décrivent l’entraînement, pas la maîtrise orale ni la prononciation.","masteryGroupPhraseVocab":"Vocabulaire","masteryGroupPhrases":"Expressions courtes","masteryGroupPatternVocab":"Nouveaux mots","masteryGroupPatterns":"Structures coraniques","masteryGroupHeading":"Progression par sujet","masteryCardsTitle":"Cartes de mots et d’expressions","masteryFilterAll":"Toutes","masteryFilterDue":"À revoir","masteryFilterWeak":"Difficiles","masteryFilterNew":"Nouvelles","masteryEmpty":"Aucune carte dans cette sélection.","masteryAttempts":"Essais","masteryMistakes":"Erreurs","masteryNext":"Prochaine révision","masteryNextNone":"Non programmée","masteryNow":"Maintenant","masteryPracticeDue":"Réviser les cartes dues","masteryPracticeWeak":"Revoir mes difficultés","masteryContinue":"Continuer les leçons","masteryNotUnlocked":"Termine les leçons précédentes pour débloquer la suite.","masteryPrivacy":"Cet indicateur n’atteste ni récitation ni maîtrise du tajwid.","masteryLocalOnly":"Données de cet appareil uniquement, sans synchronisation automatique."}
 };
 const lang=()=>{let x=window.DEEN_APP_LOCALE?.get?.()||document.documentElement.lang||'tr';x=String(x).toLowerCase().split('-')[0];return i18n[x]?x:'tr'};
 const t=()=>Object.assign({},i18n[lang()],extra[lang()],vowelUi[lang()],readingUi[lang()],wordUi[lang()],listeningUi[lang()],meaningUi[lang()],phraseUi[lang()],patternUi[lang()],masteryUi[lang()],DAILY.ui[lang()],ADAPTIVE.ui[lang()],FOUNDATION.ui[lang()],CHECKPOINT.ui[lang()],REMEDY.ui[lang()],WEEKLY.ui[lang()],GOALS.ui[lang()]);
 const state={view:'home',lessonIndex:0,question:0,correct:false,feedback:'',complete:false,pieces:[],listenHeard:false,listeningBusy:false,reviewQueue:[],reviewIndex:0,reviewMode:'normal',lessonMissed:[],foundationQueue:[],foundationIndex:0,foundationPieces:[],foundationCorrect:false,foundationFeedback:'',foundationWrong:false,checkpointQuestions:[],checkpointIndex:0,checkpointPieces:[],checkpointAnswers:[],checkpointFeedback:null,checkpointResult:null,remedyQuestions:[],remedyIndex:0,remedyPieces:[],remedyCorrect:false,remedyFeedback:'',masteryFilter:'all',audioPreviewOpen:false,audioStatus:'',selectedLetterId:null};
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
 const listeningCompleted=()=>{
  try{const raw=JSON.parse(localStorage.getItem(LISTENING_STORE)||'null');
   const valid=raw&&Array.isArray(raw.completed)?raw.completed.filter(id=>LISTENING_LESSONS.some(x=>x.id===id)):[];
   return [...new Set(valid)];
  }catch(_){return []}
 };
 const meaningCompleted=()=>{
  try{const raw=JSON.parse(localStorage.getItem(MEANING_STORE)||'null');
   const valid=raw&&Array.isArray(raw.completed)?raw.completed.filter(id=>MEANING_LESSONS.some(x=>x.id===id)):[];
   return [...new Set(valid)];
  }catch(_){return []}
 };
 const patternCompleted=()=>{
  try{const raw=JSON.parse(localStorage.getItem(PATTERN_STORE)||'null');
   return [...new Set(raw&&Array.isArray(raw.completed)?raw.completed.filter(id=>PATTERN_LESSONS.some(x=>x.id===id)):[])];
  }catch(_){return []}
 };
 const phraseCompleted=()=>{
  try{const raw=JSON.parse(localStorage.getItem(PHRASE_STORE)||'null');
   return [...new Set(raw&&Array.isArray(raw.completed)?raw.completed.filter(id=>PHRASE_LESSONS.some(x=>x.id===id)):[])];
  }catch(_){return []}
 };
 const reviewRead=()=>{
  const cards=Object.create(null);
  try{const raw=JSON.parse(localStorage.getItem(REVIEW_STORE)||'null');
   if(raw&&raw.cards&&typeof raw.cards==='object')for(const id of REVIEW_IDS){
    const r=raw.cards[id];
    if(r&&Number.isFinite(r.dueAt)&&r.dueAt>=0&&Number.isInteger(r.step)&&r.step>=0&&r.step<=5)cards[id]=r;
   }
  }catch(_){}
  return cards;
 };
 const reviewDue=()=>{
  const cards=reviewRead(),now=Date.now();
  return REVIEW_CARDS.filter(item=>cards[item.id]&&cards[item.id].dueAt<=now)
   .sort((a,b)=>((cards[b.id].mistakes||0)-(cards[a.id].mistakes||0))||(cards[a.id].step-cards[b.id].step)||(cards[a.id].dueAt-cards[b.id].dueAt));
 };
 const reviewWeak=()=>{
  const cards=reviewRead();
  return REVIEW_CARDS.filter(item=>cards[item.id]&&(cards[item.id].mistakes||0)>0)
   .sort((a,b)=>(cards[b.id].mistakes||0)-(cards[a.id].mistakes||0)||(cards[a.id].step-cards[b.id].step));
 };
 function recordReview(id,correct){
  if(!REVIEW_IDS.includes(id))return;
  const cards=reviewRead(),prev=cards[id]||null;
  const next=PHRASES.schedule(prev,correct);
  if(correct)dailyMark('review',id);
  cards[id]={...next,mistakes:Math.min(999,Math.max(0,prev?.mistakes||0)+(correct?0:1)),attempts:Math.min(9999,Math.max(0,prev?.attempts||0)+1)};
  try{localStorage.setItem(REVIEW_STORE,JSON.stringify({schema:1,cards,updatedAt:Date.now()}))}catch(_){}
 }
 const writtenCompletedCount=()=>completed().length+vowelCompleted().length+readingCompleted().length+
  wordCompleted().length+meaningCompleted().length+phraseCompleted().length+patternCompleted().length;
 const masterySnapshot=()=>MASTERY.analyze({cards:reviewRead()},writtenCompletedCount(),ALL_LESSONS.length-LISTENING_LESSONS.length);
 const dailyMinutes=()=>{
  try{return DAILY.safeMinutes(JSON.parse(localStorage.getItem(DAILY_SETTINGS_STORE)||'null')?.minutes)}
  catch(_){return 10}
 };
 const dailyActivity=()=>{
  let raw=null;try{raw=JSON.parse(localStorage.getItem(DAILY_ACTIVITY_STORE)||'null')}catch(_){}
  return DAILY.normalizeActivity(raw);
 };
 const weeklyLog=()=>{
  try{return WEEKLY.clean(JSON.parse(localStorage.getItem(WEEKLY_STORE)||'null'))}
  catch(_){return WEEKLY.clean(null)}
 };
 const weeklySnapshot=()=>WEEKLY.summarize(weeklyLog(),dailyActivity(),checkpointRead());
 const weeklyGoalSnapshot=()=>GOALS.build({
  journal:weeklyLog(),daily:dailyActivity(),exams:checkpointRead(),
  remainingWritten:25-writtenCompletedCount(),reviewEligible:reviewDue().length>0||reviewWeak().length>0
 });
 const weeklyBadges=()=>{
  try{return GOALS.cleanAwards(JSON.parse(localStorage.getItem(WEEKLY_BADGE_STORE)||'null'))}
  catch(_){return GOALS.cleanAwards(null)}
 };
 function weeklySyncBadges(){
  const before=weeklyBadges(),after=GOALS.syncAwards(before,weeklyGoalSnapshot());
  if(JSON.stringify(after.weeks)!==JSON.stringify(before.weeks))
   try{localStorage.setItem(WEEKLY_BADGE_STORE,JSON.stringify(after))}catch(_){}
 }
 const dailyLessons=()=>ALL_LESSONS.filter(x=>!LISTENING_LESSONS.includes(x)).map(x=>({
  id:x.id,index:x.index,unlocked:isUnlocked(x.index),completed:lessonIsDone(x)
 }));
 const dailySnapshot=()=>DAILY.suggest({
  minutes:dailyMinutes(),activity:dailyActivity(),lessons:dailyLessons(),
  due:reviewDue().map(c=>c.id),weak:reviewWeak().map(c=>c.id)
 });
 function dailyMark(type,id){
  if(type==='lesson'&&!ALL_LESSONS.some(x=>x.id===id&&!LISTENING_LESSONS.includes(x)))return;
  if(type==='review'&&!REVIEW_IDS.includes(id))return;
  const next=DAILY.mark(dailyActivity(),type,id);
  try{localStorage.setItem(DAILY_ACTIVITY_STORE,JSON.stringify(next))}catch(_){}
  // Phase-16 journal starts recording genuine completions from the update date.
  const weeklyNext=WEEKLY.record(weeklyLog(),type,id);
  try{localStorage.setItem(WEEKLY_STORE,JSON.stringify(weeklyNext))}catch(_){}
  weeklySyncBadges();
 }
 function setDailyMinutes(value){
  const num=Number(value);if(!DAILY.allowedMinutes.includes(num))return false;
  try{localStorage.setItem(DAILY_SETTINGS_STORE,JSON.stringify({schema:1,minutes:num}))}catch(_){}
  return true;
 }
 const adaptiveHistory=()=>{
  try{return ADAPTIVE.clean(JSON.parse(localStorage.getItem(ADAPTIVE_STORE)||'null'))}
  catch(_){return ADAPTIVE.clean(null)}
 };
 const adaptiveCandidate=()=>ALL_LESSONS.find(x=>!LISTENING_LESSONS.includes(x)&&!lessonIsDone(x)&&isUnlocked(x.index));
 const adaptiveSnapshot=()=>{
  const lesson=adaptiveCandidate();
  return ADAPTIVE.suggest({history:adaptiveHistory(),reviewCards:reviewRead(),
   nextLesson:lesson?{id:lesson.id,index:lesson.index,unlocked:true}:null});
 };
 function markLessonMiss(){
  const item=groupLetters()[state.question];
  if(item?.id&&!state.lessonMissed.includes(item.id))state.lessonMissed.push(item.id);
 }
 function saveLessonOutcome(){
  const previous=adaptiveHistory();
  const next=ADAPTIVE.recordLesson(previous,{lessonId:group().id,
   questions:groupLetters().length,missedIds:state.lessonMissed});
  try{localStorage.setItem(ADAPTIVE_STORE,JSON.stringify(next))}catch(_){}
 }
 const foundationRead=()=>{
  let data=null;try{data=JSON.parse(localStorage.getItem(FOUNDATION_REVIEW_STORE)||'null')}catch(_){}
  return FOUNDATION.clean(data);
 };
 const foundationDoneLessons=()=>ALL_LESSONS.slice(0,16).filter(x=>lessonIsDone(x)).map(x=>x.id);
 const foundationSnapshot=()=>FOUNDATION.suggest(foundationRead(),foundationDoneLessons());
 function foundationWrite(next){
  try{localStorage.setItem(FOUNDATION_REVIEW_STORE,JSON.stringify(next))}catch(_){}
 }
 function foundationGradeInLesson(correct){
  const item=groupLetters()[state.question],entry=FOUNDATION.byId[item?.id];
  if(!entry||group().id!==entry.lessonId)return;
  if(!correct&&state.lessonMissed.includes(item.id))return;
  foundationWrite(FOUNDATION.grade(foundationRead(),item.id,correct));
 }
 const checkpointRead=()=>{
  try{return CHECKPOINT.history(JSON.parse(localStorage.getItem(CHECKPOINT_STORE)||'null'))}
  catch(_){return CHECKPOINT.history(null)}
 };
 const checkpointLatest=()=>checkpointRead().attempts.slice(-1)[0]||null;
 const checkpointEligible=()=>writtenCompletedCount()>=CHECKPOINT.requiredWritten;
 const remedyRead=()=>{
  try{return JSON.parse(localStorage.getItem(REMEDY_STORE)||'null')}
  catch(_){return null}
 };
 const remedyPlan=()=>REMEDY.progress(REMEDY.plan(checkpointRead()),remedyRead());
 const remedyComparison=()=>REMEDY.compare(checkpointRead());
 function remedyWrite(record){
  try{localStorage.setItem(REMEDY_STORE,JSON.stringify(record))}catch(_){}
 }
 const savedComplete=()=>completed().includes(LESSONS[0].id);
 const group=()=>ALL_LESSONS[state.lessonIndex];
 const groupLetters=()=>group().letters||group().items;
 const lessonIsDone=(g=group())=>g.kind==='recognition'?completed().includes(g.id):READING_LESSONS.includes(g)?readingCompleted().includes(g.id):WORD_LESSONS.includes(g)?wordCompleted().includes(g.id):LISTENING_LESSONS.includes(g)?listeningCompleted().includes(g.id):MEANING_LESSONS.includes(g)?meaningCompleted().includes(g.id):PHRASE_LESSONS.includes(g)?phraseCompleted().includes(g.id):PATTERN_LESSONS.includes(g)?patternCompleted().includes(g.id):vowelCompleted().includes(g.id);
 const isUnlocked=i=>{
  if(!Number.isInteger(i)||i<0||i>=ALL_LESSONS.length)return false;
  if(i===0)return true;
  if(i<LESSONS.length)return completed().includes(LESSONS[i-1].id);
  if(i===LESSONS.length)return completed().length===LESSONS.length;
  if(i<LESSONS.length+PHONIC_LESSONS.length)return vowelCompleted().includes(ALL_LESSONS[i-1].id);
  if(i===LESSONS.length+PHONIC_LESSONS.length)return vowelCompleted().length===PHONIC_LESSONS.length;
  if(i<WORDS.startIndex)return readingCompleted().includes(ALL_LESSONS[i-1].id);
  if(i===WORDS.startIndex)return readingCompleted().length===READING_LESSONS.length;
  if(i<LISTENING.startIndex)return wordCompleted().includes(ALL_LESSONS[i-1].id);
  if(i===LISTENING.startIndex)return wordCompleted().length===WORD_LESSONS.length&&LISTENING.lessonReady(ALL_LESSONS[i].id);
  if(i<MEANING.startIndex)return listeningCompleted().includes(ALL_LESSONS[i-1].id)&&LISTENING.lessonReady(ALL_LESSONS[i].id);
  // Semantic learning is an independent fork of the 16 complete written lessons;
  // it must not depend on unavailable recitation licenses.
  if(i===MEANING.startIndex)return wordCompleted().length===WORD_LESSONS.length;
  if(i<PHRASES.startIndex)return meaningCompleted().includes(ALL_LESSONS[i-1].id);
  if(i===PHRASES.startIndex)return meaningCompleted().length===MEANING_LESSONS.length;
  if(i<PATTERNS.startIndex)return phraseCompleted().includes(ALL_LESSONS[i-1].id);
  if(i===PATTERNS.startIndex)return phraseCompleted().length===PHRASE_LESSONS.length;
  return patternCompleted().includes(ALL_LESSONS[i-1].id);
 };
 function saveCompleted(){
  const id=group().id;
  if(PATTERN_LESSONS.includes(group())){
   const ids=patternCompleted();if(!ids.includes(id))ids.push(id);
   try{localStorage.setItem(PATTERN_STORE,JSON.stringify({schema:1,completed:ids,updatedAt:Date.now()}))}catch(_){}
   return;
  }
  if(PHRASE_LESSONS.includes(group())){
   const ids=phraseCompleted();if(!ids.includes(id))ids.push(id);
   try{localStorage.setItem(PHRASE_STORE,JSON.stringify({schema:1,completed:ids,updatedAt:Date.now()}))}catch(_){}
   return;
  }
  if(MEANING_LESSONS.includes(group())){
   const ids=meaningCompleted();if(!ids.includes(id))ids.push(id);
   try{localStorage.setItem(MEANING_STORE,JSON.stringify({schema:1,completed:ids,updatedAt:Date.now()}))}catch(_){}
   return;
  }
  if(LISTENING_LESSONS.includes(group())){
   if(!LISTENING.lessonReady(group().id))return;
   const ids=listeningCompleted();if(!ids.includes(id))ids.push(id);
   try{localStorage.setItem(LISTENING_STORE,JSON.stringify({schema:1,completed:ids,updatedAt:Date.now()}))}catch(_){}
   return;
  }
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
 const letterAudioCourseInfo=fallback=>{
  const voice=window.DEEN_ARABIC_LETTER_AUDIO;
  const recorded=Object.keys(voice?.records||{}).length;
  if(!recorded)return fallback;
  const playable=voice.previewCount(),pending=voice.pendingCount(),missing=CURRICULUM.count-recorded;
  const messages=playable?{
   tr:playable+' harfin sesi dinlenebilir (ses sahibi onaylı önizleme). '+pending+' kayıt bağımsız telaffuz incelemesinden geçmedi; '+missing+' harfin sesi henüz yok.',
   en:playable+' letter recordings are playable as creator-confirmed previews. '+pending+' await independent pronunciation review; '+missing+' letters are unrecorded.',
   ar:'يمكن الاستماع إلى '+playable+' تسجيلات أكّدها صاحبها. لم تخضع '+pending+' تسجيلات لمراجعة نطق مستقلة، و'+missing+' حرفًا بلا تسجيل.',
   de:playable+' Buchstaben sind als vom Urheber bestätigte Vorschau hörbar. '+pending+' warten auf unabhängige Ausspracheprüfung; '+missing+' fehlen.',
   fr:playable+' lettres sont audibles en aperçu confirmé par leur créateur. '+pending+' attendent une vérification indépendante ; '+missing+' restent sans enregistrement.'
  }:{
   tr:recorded+' ses kaydı eklendi; telaffuz onayı tamamlanmadan dinleme açılmayacak. '+missing+' harfin sesi henüz yok.',
   en:recorded+' recordings are staged. Listening stays disabled until pronunciation review is approved. '+missing+' letters are unrecorded.',
   ar:'تم إعداد '+recorded+' تسجيلات، والاستماع متوقف حتى اعتماد النطق. لم تُسجّل '+missing+' أحرف بعد.',
   de:recorded+' Aufnahmen sind vorbereitet. Anhören erst nach Prüfung der Aussprache. '+missing+' Buchstaben fehlen.',
   fr:recorded+' enregistrements sont prêts. Lecture bloquée avant validation de la prononciation. '+missing+' lettres manquent encore.'
  };
  return messages[lang()]||messages.tr;
 };
 const elem=(tag,className,text)=>{const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e};
 function makeButton(label,action,className){
  const b=elem('button',className,label);b.type='button';b.dataset.qpathAction=action;return b;
 }

 const letterAudioHelp=Object.freeze({
  tr:{missing:'Bu cihaz Arapça sesli okumayı desteklemiyor. Kayıtsız şıklar için Arapça ses paketi gerekir.',partial:'🔊 Sesli şıklara dokun. Diğer harfler için cihazda Arapça seslendirme bulunmalı.',open:'🔊 Kayıtlı 8 harfi dinle',close:'Sesleri gizle',heading:'Kayıtlı harf seslerini dene',play:'Dinlemek için bir harfe dokun.',present:'🔊 Her şık doğrudan okunur: kayıtlı 8 harfte MP3, diğerlerinde cihazın Arapça sesi (telaffuz cihaza göre değişebilir).',device:'Cihazın Arapça sesi'},
  en:{missing:'This device cannot speak Arabic. Install an Arabic speech voice to hear unrecorded letters.',partial:'🔊 Tap audible answers; other letters require an Arabic voice on your device.',open:'🔊 Listen to 8 recorded letters',close:'Hide sounds',heading:'Try the recorded letter sounds',play:'Tap a letter to hear it.',present:'🔊 Tap any answer to hear its own name: original MP3 or device Arabic voice (pronunciation varies).',device:'Device Arabic voice'},
  ar:{missing:'هذا الجهاز لا يدعم النطق بالعربية. تحتاج الأحرف غير المسجّلة إلى صوت عربي على الجهاز.',partial:'🔊 المس الخيارات المسموعة؛ تحتاج الأحرف الأخرى إلى صوت عربي على الجهاز.',open:'🔊 استمع إلى ٨ أحرف مسجّلة',close:'إخفاء الأصوات',heading:'جرّب أصوات الأحرف المسجّلة',play:'المس حرفًا لسماع صوته.',present:'🔊 اضغط على أي خيار لسماع اسمه: تسجيل أصلي أو نطق الجهاز العربي (قد يختلف النطق).',device:'النطق العربي للجهاز'},
  de:{missing:'Dieses Gerät unterstützt keine arabische Sprachausgabe. Für die übrigen Buchstaben ist eine arabische Stimme nötig.',partial:'🔊 Tippe auf hörbare Antworten; andere benötigen eine arabische Stimme.',open:'🔊 8 aufgenommene Buchstaben anhören',close:'Töne ausblenden',heading:'Aufgenommene Buchstaben testen',play:'Tippe auf einen Buchstaben, um ihn zu hören.',present:'🔊 Jede Antwort spricht ihren eigenen Buchstaben: Aufnahme oder arabische Gerätestimme (Aussprache kann variieren).',device:'Arabische Gerätestimme'},
  fr:{missing:'Cet appareil ne propose pas de synthèse vocale arabe. Une voix arabe est nécessaire pour les autres lettres.',partial:'🔊 Touchez les réponses sonores ; les autres exigent une voix arabe sur cet appareil.',open:'🔊 Écouter les 8 lettres enregistrées',close:'Masquer les sons',heading:'Essayer les lettres enregistrées',play:'Touchez une lettre pour l’entendre.',present:'🔊 Chaque réponse prononce sa lettre : MP3 ou voix arabe de l’appareil (prononciation variable).',device:'Voix arabe de l’appareil'}
 });
 const audioHelp=()=>letterAudioHelp[lang()]||letterAudioHelp.tr;
 const audioDiagnostics=Object.freeze({
  tr:{test:'🔊 MP3 ses testi: م (Mim)',noArabic:'Bu cihazda Arapça konuşma sesi bulunamadı. Kayıtlı 8 MP3 çalabilir; kalan harfler için Arapça ses paketi veya yeni MP3 gerekir.',deviceError:'Cihaz Arapça okumayı başlatamadı. Arapça ses paketini ve medya ses düzeyini kontrol et.',mp3Error:'MP3 oynatılamadı. İnternet bağlantısını ve medya sesini kontrol et.',mp3Started:'Kayıt çalıyor. Duymuyorsan medya sesini kontrol et.',deviceStarted:'Cihaz Arapça harf adını okumaya başladı.'},
  en:{test:'🔊 Test MP3: م (Mim)',noArabic:'No Arabic speaking voice found on this device. Eight MP3 files can play; other letters need an installed Arabic voice or new MP3 recordings.',deviceError:'Device Arabic speech could not start. Check speech voices and media volume.',mp3Error:'MP3 failed to play. Check connection and media volume.',mp3Started:'MP3 playback started. Check media volume if silent.',deviceStarted:'Device speech started.'},
  ar:{test:'🔊 اختبار MP3: م (ميم)',noArabic:'لم يُعثر على صوت عربي في الجهاز. يمكن تشغيل ثمانية ملفات MP3، وتحتاج باقي الأحرف إلى صوت عربي أو تسجيلات.',deviceError:'تعذّر بدء النطق العربي. تحقق من الأصوات ومستوى الصوت.',mp3Error:'تعذّر تشغيل ملف MP3. تحقق من الاتصال والصوت.',mp3Started:'بدأ تشغيل التسجيل. تحقق من صوت الوسائط إن لم تسمعه.',deviceStarted:'بدأ النطق العربي للجهاز.'},
  de:{test:'🔊 MP3-Test: م (Mim)',noArabic:'Auf diesem Gerät ist keine arabische Stimme verfügbar. Acht MP3s funktionieren; weitere Buchstaben brauchen eine arabische Stimme oder Aufnahmen.',deviceError:'Arabische Sprachausgabe konnte nicht starten.',mp3Error:'MP3 konnte nicht abgespielt werden.',mp3Started:'MP3-Wiedergabe gestartet. Medienlautstärke prüfen.',deviceStarted:'Gerätesprachausgabe gestartet.'},
  fr:{test:'🔊 Test MP3 : م (Mim)',noArabic:'Aucune voix arabe trouvée sur cet appareil. Huit MP3 peuvent fonctionner ; les autres lettres nécessitent une voix arabe ou des enregistrements.',deviceError:'La voix arabe de l’appareil n’a pas démarré.',mp3Error:'Lecture MP3 impossible. Vérifiez la connexion et le volume.',mp3Started:'MP3 en cours. Vérifiez le volume multimédia.',deviceStarted:'La voix arabe a démarré.'}
 });
 const audioDiagnostic=code=>{
  const messages=audioDiagnostics[lang()]||audioDiagnostics.tr;
  return ({'no-arabic-voice':messages.noArabic,'device-error':messages.deviceError,'mp3-error':messages.mp3Error,'mp3-started':messages.mp3Started,'device-started':messages.deviceStarted})[code]||'';
 };
 function letterAudioPreviewPanel(){
  const voice=window.DEEN_ARABIC_LETTER_AUDIO;
  const letters=LETTERS.filter(letter=>voice?.available(letter.id));
  if(!letters.length)return null;
  const help=audioHelp(),section=elem('section','deen-path-audio-preview');
  section.append(elem('h3','deen-path-audio-preview-title',help.heading),elem('p','deen-path-audio-preview-copy',help.play));
  const grid=elem('div','deen-path-audio-preview-grid');
  for(const letter of letters){
   const button=makeButton('','letterAudio','deen-path-audio-preview-choice');
   button.dataset.letterId=letter.id;
   button.setAttribute('aria-label',letterLabel(letter)+' · '+help.play);
   const glyph=elem('span','',letter.glyph);glyph.lang='ar';glyph.dir='rtl';
   button.append(glyph,elem('small','',letterLabel(letter)));
   grid.append(button);
  }
  section.append(grid);
  return section;
 }
 function appendLetterAudioHelp(box,items){
  const voice=window.DEEN_ARABIC_LETTER_AUDIO;
  const help=audioHelp(),modes=items.map(letter=>voice?.modeFor(letter.id)||null);
  // Answers are the only playback controls in a recognition quiz.
  // Do not send learners to a separate, unrelated Mim sample underneath.
  const allAudible=modes.every(Boolean),anyAudible=modes.some(Boolean);
  box.append(elem('p','deen-path-audio-info',allAudible?help.present:anyAudible?help.partial:help.missing));
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
   const voice=window.DEEN_ARABIC_LETTER_AUDIO;
   const hasAudio=!!voice?.hasClip(item.id),ready=hasAudio&&voice.available(item.id);
   const card=hasAudio?makeButton('','letterAudio','deen-path-letter-card deen-path-letter-card-audio'):elem('div','deen-path-letter-card');
   if(hasAudio){
    card.dataset.letterId=item.id;
    card.disabled=!ready;
    card.setAttribute('aria-label',letterLabel(item)+'. '+voice.label(lang(),ready));
   }
   card.append(elem('span','deen-path-glyph',item.glyph),elem('small','',letterLabel(item)));
   if(hasAudio)card.append(elem('span','deen-path-letter-audio-label','🔊 '+voice.label(lang(),ready)));
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
 function remedyTrendView(){
  const c=t(),comparison=remedyComparison();
  if(!comparison)return null;
  const wrap=elem('section','deen-path-remedy-trend');
  wrap.append(elem('h3','deen-path-shape-subtitle',c.remedyTrend));
  const delta=comparison.delta,sign=delta>0?'+':'';
  const total=elem('p','deen-path-remedy-delta'+(delta>0?' is-up':delta<0?' is-down':''),
   c.remedyPrevious+' '+comparison.previous+' / 20  →  '+c.remedyCurrent+' '+comparison.current+
   ' / 20  ·  '+c.remedyChange+' '+sign+delta);
  wrap.append(total);
  for(const topic of comparison.topics){
   const line=elem('div','deen-path-remedy-trend-topic');
   line.append(elem('span','',checkpointTitle(topic.id)),
    elem('span','',topic.previous+' / 4 → '+topic.current+' / 4 ('+
     (topic.delta>0?'+':'')+topic.delta+')'));
   wrap.append(line);
  }
  return wrap;
 }
 function remedyPanel(){
  const c=t(),plan=remedyPlan(),box=elem('section','deen-path-remedy-section');
  box.append(elem('h3','deen-path-shape-subtitle',c.remedyHeading),
   elem('p','deen-path-muted',c.remedyIntro));
  if(!plan.key){
   box.append(elem('p','deen-path-muted',c.remedyBlocked));return box;
  }
  box.append(elem('p','deen-path-remedy-count',c.remedyProgress+' · '+plan.complete+' / '+plan.total));
  const track=elem('div','deen-path-course-progress'),fill=elem('span');
  fill.style.width=(plan.total?Math.round(plan.complete/plan.total*100):100)+'%';
  track.append(fill);box.append(track);
  for(const topic of plan.topics){
   const line=elem('div','deen-path-remedy-topic');
   line.append(elem('strong','',checkpointTitle(topic.id)),
    elem('span','',topic.done+' / '+topic.total));box.append(line);
  }
  if(plan.remaining){
   box.append(makeButton(plan.complete?c.remedyResume:c.remedyStart,
    'remedyStart','deen-path-primary'));
  }else{
   box.append(elem('p','deen-path-remedy-finished',plan.finished&&plan.total?c.remedyDone:c.remedyEmpty));
   if(plan.total&&checkpointEligible())box.append(makeButton(c.remedyRetry,'checkpointStart','deen-path-secondary'));
  }
  box.append(elem('p','deen-path-muted deen-path-remedy-note',c.remedyNote));
  return box;
 }
 function remedyStart(){
  const plan=remedyPlan();
  if(!plan.key||!plan.remaining||!checkpointEligible())return false;
  const done=new Set(plan.done);
  state.remedyQuestions=plan.questions.filter(q=>!done.has(q.id));
  state.remedyIndex=0;state.remedyPieces=[];state.remedyCorrect=false;state.remedyFeedback='';
  return show('remedyQuestion');
 }
 function remedyQuestion(){
  return state.remedyQuestions[state.remedyIndex]||null;
 }
 function remedyQuestionView(){
  const c=t(),q=remedyQuestion(),box=elem('section','deen-path-lesson deen-path-remedy-question');
  if(!q)return box;
  box.append(makeButton('←  '+c.remedyBack,'remedy','deen-path-back'),
   elem('div','deen-path-kicker',c.remedyHeading),
   elem('p','deen-path-question-count',c.remedyCard+' '+(state.remedyIndex+1)+' / '+state.remedyQuestions.length),
   elem('h2','deen-path-inner-title',checkpointTitle(q.domain)),
   elem('p','deen-path-muted',q.type==='build'?c.remedyBuild:c.remedyQuestion));
  box.append(elem('div','deen-path-checkpoint-hint',q.label?.[lang()]||q.label?.tr||q.glyph));
  if(q.type==='build'){
   const built=elem('div','deen-path-word-built',state.remedyPieces.map(i=>q.parts[i]).join('')||'···');
   built.lang='ar';built.dir='rtl';box.append(built);
   const bank=elem('div','deen-path-word-pieces');
   for(const i of q.parts.map((_,idx)=>idx).reverse()){
    const btn=makeButton(q.parts[i],'remedyPiece','deen-path-word-piece');
    btn.dataset.pieceIndex=String(i);btn.disabled=state.remedyCorrect||state.remedyPieces.includes(i);
    btn.lang='ar';btn.dir='rtl';bank.append(btn);
   }
   box.append(bank);
   const reset=makeButton(c.remedyReset,'remedyReset','deen-path-back deen-path-remedy-reset');
   reset.disabled=state.remedyCorrect||!state.remedyPieces.length;box.append(reset);
  }else{
   const opts=elem('div','deen-path-options');
   for(const opt of q.options){
    const btn=makeButton(opt.glyph,'remedyAnswer','deen-path-option');
    btn.dataset.itemId=opt.id;btn.disabled=state.remedyCorrect;
    if(state.remedyCorrect&&opt.id===q.id)btn.classList.add('deen-path-option-correct');
    btn.lang='ar';btn.dir='rtl';opts.append(btn);
   }
   box.append(opts);
  }
  if(q.reference)box.append(elem('p','deen-path-muted deen-path-word-reference',c.phraseVerse+' · '+q.reference));
  if(state.remedyFeedback){
   const feedback=elem('p','deen-path-feedback'+(state.remedyCorrect?' is-correct':' is-wrong'),state.remedyFeedback);
   feedback.setAttribute('role','status');box.append(feedback);
  }
  if(state.remedyCorrect)box.append(makeButton(
   state.remedyIndex===state.remedyQuestions.length-1?c.remedyDone:c.remedyNext,
   'remedyNext','deen-path-primary'));
  return box;
 }
 function remedyMark(correct){
  if(state.view!=='remedyQuestion'||state.remedyCorrect)return false;
  const q=remedyQuestion();if(!q)return false;
  if(correct){
   const plan=remedyPlan();
   remedyWrite(REMEDY.mark(plan,remedyRead(),q.id,true));
   state.remedyCorrect=true;state.remedyFeedback=t().remedyCorrect;
  }else state.remedyFeedback=t().remedyWrong;
  update();return true;
 }
 function remedyAnswer(id){
  const q=remedyQuestion();
  if(!q||q.type!=='choice'||!q.options.some(x=>x.id===id))return false;
  return remedyMark(id===q.id);
 }
 function remedyPiece(index){
  const q=remedyQuestion();index=Number(index);
  if(state.view!=='remedyQuestion'||!q||q.type!=='build'||state.remedyCorrect||
   !Number.isInteger(index)||index<0||index>=q.parts.length||state.remedyPieces.includes(index))return;
  state.remedyPieces.push(index);
  if(state.remedyPieces.length===q.parts.length)
   return remedyMark(state.remedyPieces.every((v,i)=>v===i));
  update();
 }
 function remedyNext(){
  if(state.view!=='remedyQuestion'||!state.remedyCorrect)return false;
  if(state.remedyIndex+1===state.remedyQuestions.length)return show('remedyDone');
  state.remedyIndex++;state.remedyPieces=[];state.remedyCorrect=false;state.remedyFeedback='';
  return show('remedyQuestion');
 }
 function remedyView(){
  const c=t(),box=elem('section','deen-path-remedy-landing');
  box.append(makeButton('←  '+c.remedyBack,'checkpointResults','deen-path-back'),remedyPanel());
  const trend=remedyTrendView();if(trend)box.append(trend);
  return box;
 }
 function remedyDoneView(){
  const c=t(),box=elem('section','deen-path-remedy-finished-screen');
  box.append(elem('div','deen-path-complete-star','✦'),elem('h2','deen-path-inner-title',c.remedyDone),
   remedyPanel(),makeButton(c.remedyBack,'checkpointResults','deen-path-back'));
  return box;
 }
 function checkpointTitle(id){
  const c=t(),names={letters:c.examLetters,vowels:c.examVowels,reading:c.examReading,
   words:c.examWords,meaning:c.examMeaning};
  return names[id]||id;
 }
 function checkpointPanel(){
  const c=t(),box=elem('section','deen-path-checkpoint-section'),latest=checkpointLatest();
  box.append(elem('h3','deen-path-shape-subtitle',c.examHeading),
   elem('p','deen-path-muted',c.examIntro));
  const progress=writtenCompletedCount();
  box.append(elem('p','deen-path-progress-copy',progress+' / '+CHECKPOINT.requiredWritten));
  if(latest)box.append(elem('p','deen-path-checkpoint-last',c.examLast+' · '+latest.correct+' / '+latest.total));
  if(!checkpointEligible())box.append(elem('p','deen-path-muted',c.examLocked));
  const b=makeButton(c.examStart,state.view==='checkpoint'?'checkpointStart':'checkpointOpen','deen-path-primary');
  b.disabled=!checkpointEligible();box.append(b);
  if(latest)box.append(makeButton(c.examResults,'checkpointResults','deen-path-secondary'));
  if(latest&&remedyPlan().total)box.append(makeButton(c.remedyHeading,'remedyOpen','deen-path-secondary'));
  return box;
 }
 function checkpointStart(){
  if(!checkpointEligible())return false;
  state.checkpointQuestions=CHECKPOINT.build(checkpointRead().nextAttempt);
  state.checkpointIndex=0;state.checkpointAnswers=[];state.checkpointPieces=[];
  state.checkpointFeedback=null;state.checkpointResult=null;
  return show('checkpointQuestion');
 }
 function checkpointLanding(){
  const c=t(),box=elem('section','deen-path-checkpoint-landing');
  box.append(makeButton('←  '+c.examBack,'arabic','deen-path-back'));
  box.append(checkpointPanel());
  return box;
 }
 function checkpointItem(){return state.checkpointQuestions[state.checkpointIndex]||null}
 function checkpointQuestionView(){
  const c=t(),q=checkpointItem(),box=elem('section','deen-path-lesson deen-path-checkpoint-question');
  if(!q)return box;
  box.append(makeButton('←  '+c.examBack,'checkpoint','deen-path-back'),
   elem('div','deen-path-kicker',c.examHeading));
  box.append(elem('p','deen-path-question-count',c.examProgress+' '+(state.checkpointIndex+1)+' / '+CHECKPOINT.questionCount),
   elem('h2','deen-path-inner-title',checkpointTitle(q.domain)));
  box.append(elem('p','deen-path-muted',q.type==='build'?c.examBuild:c.examPrompt));
  const prompt=elem('div','deen-path-checkpoint-hint',q.label?.[lang()]||q.label?.tr||q.glyph);
  box.append(prompt);
  if(q.type==='build'){
   const built=elem('div','deen-path-word-built',state.checkpointPieces.map(i=>q.parts[i]).join('')||'···');
   built.lang='ar';built.dir='rtl';box.append(built);
   const bank=elem('div','deen-path-word-pieces');
   for(const i of q.parts.map((_,idx)=>idx).reverse()){
    const b=makeButton(q.parts[i],'checkpointPiece','deen-path-word-piece');b.dataset.pieceIndex=String(i);
    b.disabled=state.checkpointPieces.includes(i)||state.checkpointFeedback!==null;
    b.lang='ar';b.dir='rtl';bank.append(b);
   }
   box.append(bank);
   const reset=makeButton(c.examReset,'checkpointReset','deen-path-back');
   reset.disabled=state.checkpointFeedback!==null||!state.checkpointPieces.length;box.append(reset);
  }else{
   const options=elem('div','deen-path-options');
   for(const opt of q.options){
    const b=makeButton(opt.glyph,'checkpointAnswer','deen-path-option');b.dataset.itemId=opt.id;
    b.disabled=state.checkpointFeedback!==null;b.lang='ar';b.dir='rtl';
    if(state.checkpointFeedback!==null&&opt.id===q.id)b.classList.add('deen-path-option-correct');
    options.append(b);
   }
   box.append(options);
  }
  if(q.reference)box.append(elem('p','deen-path-muted deen-path-word-reference',c.phraseVerse+' · '+q.reference));
  if(state.checkpointFeedback!==null){
   const message=elem('p','deen-path-feedback'+(state.checkpointFeedback?' is-correct':' is-wrong'),
    state.checkpointFeedback?c.examCorrect:c.examWrong);
   message.setAttribute('role','status');box.append(message);
   box.append(makeButton(state.checkpointIndex+1===CHECKPOINT.questionCount?c.examFinish:c.examNext,
    'checkpointNext','deen-path-primary'));
  }
  return box;
 }
 function checkpointMark(correct){
  if(state.view!=='checkpointQuestion'||state.checkpointFeedback!==null)return false;
  const q=checkpointItem();if(!q)return false;
  state.checkpointFeedback=correct===true;
  state.checkpointAnswers.push({id:q.id,correct:state.checkpointFeedback});update();return true;
 }
 function checkpointAnswer(id){
  const q=checkpointItem();if(!q||q.type!=='choice'||state.checkpointFeedback!==null||
     !q.options.some(o=>o.id===id))return false;
  return checkpointMark(id===q.id);
 }
 function checkpointPiece(index){
  const q=checkpointItem();index=Number(index);
  if(state.view!=='checkpointQuestion'||!q||q.type!=='build'||state.checkpointFeedback!==null||
     !Number.isInteger(index)||index<0||index>=q.parts.length||state.checkpointPieces.includes(index))return;
  state.checkpointPieces.push(index);
  if(state.checkpointPieces.length===q.parts.length)return checkpointMark(state.checkpointPieces.every((p,i)=>p===i));
  update();
 }
 function checkpointNext(){
  if(state.view!=='checkpointQuestion'||state.checkpointFeedback===null)return false;
  if(state.checkpointIndex+1===CHECKPOINT.questionCount){
   const result=CHECKPOINT.summarize(state.checkpointQuestions,state.checkpointAnswers);
   if(!result)return false;
   state.checkpointResult=result;
   const updated=CHECKPOINT.save(checkpointRead(),result);
   try{localStorage.setItem(CHECKPOINT_STORE,JSON.stringify(updated))}catch(_){}
   weeklySyncBadges();
   return show('checkpointResults');
  }
  state.checkpointIndex++;state.checkpointPieces=[];state.checkpointFeedback=null;
  return show('checkpointQuestion');
 }
 function checkpointResultView(){
  const c=t(),s=state.checkpointResult||checkpointLatest(),box=elem('section','deen-path-checkpoint-results');
  box.append(makeButton('←  '+c.examBack,'arabic','deen-path-back'),
   elem('h2','deen-path-inner-title',c.examResults));
  if(!s){box.append(elem('p','deen-path-muted',c.examNone));return box}
  const number=elem('p','deen-path-checkpoint-score',s.correct+' / '+s.total+'  ·  '+s.accuracy+'%');
  box.append(elem('p','deen-path-muted',c.examScore),number);
  const topics=elem('section','deen-path-checkpoint-topics');
  topics.append(elem('h3','deen-path-shape-subtitle',c.examAreas));
  for(const topic of s.topics){
   const line=elem('div','deen-path-checkpoint-topic');
   line.append(elem('strong','',checkpointTitle(topic.id)),
    elem('span','deen-path-checkpoint-value',topic.correct+' / '+topic.total));
   const progress=elem('div','deen-path-course-progress'),fill=elem('span');
   fill.style.width=Math.round(100*topic.correct/topic.total)+'%';progress.append(fill);line.append(progress);
   if(topic.needsReview){
    const btn=makeButton(c.examRevisit,'checkpointTopic','deen-path-secondary');btn.dataset.lessonIndex=String(topic.lessonIndex);
    line.append(btn);
   }
   topics.append(line);
  }
  box.append(topics,elem('h3','deen-path-shape-subtitle',c.examReview));
  const weak=s.topics.filter(x=>x.needsReview);
  box.append(elem('p','deen-path-muted',weak.length?weak.map(x=>checkpointTitle(x.id)).join(' · '):c.examReady));
  box.append(remedyPanel());
  const comparison=remedyTrendView();if(comparison)box.append(comparison);
  box.append(elem('p','deen-path-muted deen-path-checkpoint-note',c.examLocal));
  if(checkpointEligible())box.append(makeButton(c.examRetry,'checkpointStart','deen-path-primary'));
  return box;
 }
 function alphabetView(){
  const c=t(),box=elem('section','deen-path-arabic-landing');
  box.append(makeButton('←  '+c.back,'home','deen-path-back'));
  box.append(elem('span','deen-path-pill',c.free),elem('h2','deen-path-inner-title',c.arabic),elem('p','deen-path-muted',letterAudioCourseInfo(c.courseInfo)));
  const done=completed().length;
  box.append(elem('p','deen-path-progress-copy',c.courseProgress+' · '+done+' / '+LESSONS.length));
  const track=elem('div','deen-path-course-progress'),fill=elem('span','',undefined);
  fill.style.width=Math.round(100*done/LESSONS.length)+'%';track.appendChild(fill);box.appendChild(track);
  const mastery=masterySnapshot(),masteryButton=makeButton('','mastery','deen-path-mastery-teaser');
  masteryButton.append(elem('span','deen-path-mastery-teaser-name',c.masteryOpen+' →'));
  masteryButton.append(elem('span','deen-path-mastery-teaser-sub',
   c.masteryWritten+' · '+mastery.lessonCompleted+' / '+mastery.lessonTotal+'   ·   '+
   c.masteryPracticed+' · '+mastery.practiced+' / '+mastery.total));
  box.append(masteryButton);
  box.append(foundationPanel());
  box.append(checkpointPanel());
  const daily=dailySnapshot(),dailyButton=makeButton('','daily','deen-path-daily-teaser');
  dailyButton.append(elem('span','deen-path-daily-teaser-name',c.dailyOpen+' →'),
   elem('span','deen-path-daily-teaser-sub',c.dailyProgress+' · '+daily.completed+' / '+daily.total+
   '  ·  '+c.dailyGoal+' · '+daily.minutes+' '+c.dailyMinutes));
  box.append(dailyButton);
  box.append(makeButton(c.weekOpen+' →','weekly','deen-path-weekly-link'));
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
  box.appendChild(meaningRoadmap());
  box.appendChild(phraseRoadmap());
  box.appendChild(patternRoadmap());
  box.appendChild(spacedReviewDashboard());
  box.appendChild(listeningRoadmap());
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
 function meaningRoadmap(){
  const c=t(),box=elem('section','deen-path-meaning-section'),done=meaningCompleted().length;
  box.append(elem('h3','deen-path-shape-subtitle',c.meaningHeading),elem('p','deen-path-muted',c.meaningSub));
  box.append(elem('p','deen-path-progress-copy',c.meaningProgress+' · '+done+' / '+MEANING_LESSONS.length));
  const bar=elem('div','deen-path-course-progress'),fill=elem('span');fill.style.width=Math.round(100*done/MEANING_LESSONS.length)+'%';bar.append(fill);box.append(bar);
  for(const lesson of MEANING_LESSONS){
   const complete=meaningCompleted().includes(lesson.id),locked=!isUnlocked(lesson.index);
   const title=lesson.kind==='meaning-gloss'?c.meaningGlossTitle:lesson.kind==='meaning-role'?c.meaningRoleTitle:c.meaningOrderTitle;
   const card=makeButton('','group','deen-path-course-item deen-path-meaning-item'+(complete?' is-completed':'')+(locked?' is-locked':''));
   card.dataset.lessonIndex=String(lesson.index);card.disabled=locked;
   const top=elem('span','deen-path-course-item-top');
   top.append(elem('span','deen-path-course-number',c.meaningLesson+' '+(lesson.index-MEANING.startIndex+1)+' · '+title),
    elem('span','deen-path-course-status',complete?'✓ '+c.done:locked?'🔒 '+(lesson.index===MEANING.startIndex?c.meaningPrereq:c.locked):c.meaningReady));
   const glyph=elem('span','deen-path-course-glyphs',lesson.items.slice(0,4).map(x=>x.glyph).join('  '));glyph.lang='ar';glyph.dir='rtl';
   card.append(top,glyph,elem('span','deen-path-course-item-foot',c.free+' · '+title));box.append(card);
  }
  if(done===MEANING_LESSONS.length)box.append(elem('p','deen-path-completed',c.meaningDone+' ✓'));
  return box;
 }
 function phraseRoadmap(){
  const c=t(),box=elem('section','deen-path-phrase-section'),done=phraseCompleted().length;
  box.append(elem('h3','deen-path-shape-subtitle',c.phraseHeading),elem('p','deen-path-muted',c.phraseSub));
  box.append(elem('p','deen-path-progress-copy',done+' / '+PHRASE_LESSONS.length));
  const bar=elem('div','deen-path-course-progress'),fill=elem('span');fill.style.width=Math.round(100*done/PHRASE_LESSONS.length)+'%';bar.append(fill);box.append(bar);
  for(const lesson of PHRASE_LESSONS){
   const complete=phraseCompleted().includes(lesson.id),locked=!isUnlocked(lesson.index);
   const title=lesson.kind==='phrase-vocab'?c.phraseVocabTitle:lesson.kind==='phrase-context'?c.phraseContextTitle:c.phraseOrderTitle;
   const card=makeButton('','group','deen-path-course-item deen-path-phrase-item'+(complete?' is-completed':'')+(locked?' is-locked':''));
   card.dataset.lessonIndex=String(lesson.index);card.disabled=locked;
   const top=elem('span','deen-path-course-item-top');
   top.append(elem('span','deen-path-course-number',c.lesson+' '+(lesson.index+1)+' · '+title),
    elem('span','deen-path-course-status',complete?'✓ '+c.done:locked?'🔒 '+(lesson.index===PHRASES.startIndex?c.phrasePrereq:c.locked):c.new));
   const glyph=elem('span','deen-path-course-glyphs',lesson.items.map(x=>x.glyph).join('   '));glyph.lang='ar';glyph.dir='rtl';
   card.append(top,glyph,elem('span','deen-path-course-item-foot',c.free+' · '+title));box.append(card);
  }
  if(done===PHRASE_LESSONS.length)box.append(elem('p','deen-path-completed',c.phraseDone+' ✓'));
  return box;
 }
 function patternRoadmap(){
  const c=t(),box=elem('section','deen-path-pattern-section'),done=patternCompleted().length;
  box.append(elem('h3','deen-path-shape-subtitle',c.patternHeading),elem('p','deen-path-muted',c.patternSub));
  box.append(elem('p','deen-path-progress-copy',done+' / '+PATTERN_LESSONS.length));
  const prog=elem('div','deen-path-course-progress'),fill=elem('span');fill.style.width=Math.round(done/PATTERN_LESSONS.length*100)+'%';prog.append(fill);box.append(prog);
  for(const lesson of PATTERN_LESSONS){
   const complete=patternCompleted().includes(lesson.id),locked=!isUnlocked(lesson.index);
   const title=lesson.kind==='pattern-vocab'?c.patternVocabTitle:lesson.kind==='pattern-context'?c.patternContextTitle:c.patternStructureTitle;
   const btn=makeButton('','group','deen-path-course-item deen-path-pattern-item'+(complete?' is-completed':'')+(locked?' is-locked':''));
   btn.dataset.lessonIndex=String(lesson.index);btn.disabled=locked;
   const upper=elem('span','deen-path-course-item-top');
   upper.append(elem('span','deen-path-course-number',c.lesson+' '+(lesson.index+1)+' · '+title),
     elem('span','deen-path-course-status',complete?'✓ '+c.done:locked?'🔒 '+(lesson.index===PATTERNS.startIndex?c.patternPrereq:c.locked):c.new));
   const glyph=elem('span','deen-path-course-glyphs',lesson.items.map(x=>x.glyph).join('  '));glyph.lang='ar';glyph.dir='rtl';
   btn.append(upper,glyph,elem('span','deen-path-course-item-foot',c.free+' · '+title));box.append(btn);
  }
  return box;
 }
 function adaptivePanel(){
  const c=t(),s=adaptiveSnapshot(),box=elem('section','deen-path-adaptive-section');
  box.append(elem('h3','deen-path-shape-subtitle',c.heading),elem('p','deen-path-muted',c.intro));
  const metrics=elem('div','deen-path-adaptive-metrics');
  if(s.lastQuestions!==null){
   metrics.append(elem('span','deen-path-adaptive-stat',(s.lastMistakes?c.mistake+' · '+s.lastMistakes+' / '+s.lastQuestions:c.noMistake)));
   metrics.append(elem('span','deen-path-adaptive-stat',c.clean+' · '+s.cleanRunStreak));
  }
  metrics.append(elem('span','deen-path-adaptive-stat',c.count+' · '+s.available));
  box.append(metrics);
  if(s.available)box.append(makeButton(c.ready+' ('+s.available+')','startAdaptive','deen-path-primary'));
  else box.append(elem('p','deen-path-muted',c.noCards));
  if(s.mode==='advance'&&s.nextLesson){
   const b=makeButton(c.continue+' · '+t().lesson+' '+(s.nextLesson.index+1),'adaptiveNext','deen-path-adaptive-next');
   b.dataset.lessonIndex=String(s.nextLesson.index);box.append(b);
  }
  box.append(elem('p','deen-path-muted deen-path-adaptive-note',c.note));return box;
 }
 function startAdaptive(){
  const s=adaptiveSnapshot();
  if(!s.cards.length)return false;
  const queue=s.cards.map(id=>REVIEW_CARDS.find(x=>x.id===id)).filter(Boolean);
  if(!queue.length)return false;
  state.reviewQueue=queue;state.reviewIndex=0;state.correct=false;state.feedback='';state.reviewMode='adaptive';
  return show('review');
 }
 function foundationPanel(){
  const c=t(),s=foundationSnapshot(),box=elem('section','deen-path-foundation-review-section');
  box.append(elem('h3','deen-path-shape-subtitle',c.foundationHeading),elem('p','deen-path-muted',c.foundationIntro));
  const summary=elem('p','deen-path-progress-copy',
   s.learned+' / '+s.total+'   ·   '+c.foundationDue+' · '+s.due+'   ·   '+c.foundationErrors+' · '+s.weak);
  box.append(summary);
  const list=elem('div','deen-path-foundation-topics');
  for(const g of s.groups)list.append(elem('span','deen-path-foundation-topic',c[g.kind]+' · '+g.available));
  box.append(list);
  if(s.ids.length)box.append(makeButton(c.foundationStart+' ('+s.ids.length+')','startFoundation','deen-path-primary'));
  else box.append(elem('p','deen-path-muted',c.foundationEmpty));
  box.append(elem('p','deen-path-muted deen-path-adaptive-note',c.foundationNote));
  return box;
 }
 function startFoundation(){
  const s=foundationSnapshot();
  const queue=s.ids.map(id=>FOUNDATION.byId[id]).filter(Boolean);
  if(!queue.length)return false;
  state.foundationQueue=queue;state.foundationIndex=0;state.foundationPieces=[];
  state.foundationCorrect=false;state.foundationFeedback='';state.foundationWrong=false;
  return show('foundationReview');
 }
 function foundationItem(){return state.foundationQueue[state.foundationIndex]}
 function foundationReviewView(){
  const c=t(),item=foundationItem(),box=elem('section','deen-path-lesson deen-path-foundation-review-view');
  if(!item)return box;
  const building=item.kind==='words'&&item.parts.length>0;
  box.append(makeButton('←  '+c.foundationBack,'arabic','deen-path-back'),elem('div','deen-path-kicker',c.foundationHeading));
  box.append(elem('p','deen-path-question-count',c.foundationProgress+' '+(state.foundationIndex+1)+' / '+state.foundationQueue.length));
  box.append(elem('h2','deen-path-inner-title',building?c.foundationBuild:c.foundationQuestion));
  const label=elem('div','deen-path-foundation-prompt',item.names?.[lang()]||item.names?.tr||item.glyph);
  box.append(label);
  if(building){
   const preview=elem('div','deen-path-word-built',state.foundationPieces.map(i=>item.parts[i]).join('')||'···');
   preview.lang='ar';preview.dir='rtl';box.append(preview);
   const choices=elem('div','deen-path-word-pieces');
   for(const idx of item.parts.map((_,i)=>i).reverse()){
    const b=makeButton(item.parts[idx],'foundationPiece','deen-path-word-piece');
    b.dataset.pieceIndex=String(idx);b.disabled=state.foundationPieces.includes(idx);
    b.lang='ar';b.dir='rtl';choices.append(b);
   }
   box.append(choices);
   const reset=makeButton(c.foundationReset,'foundationReset','deen-path-back deen-path-word-reset');
   reset.disabled=!state.foundationPieces.length||state.foundationCorrect;box.append(reset);
  }else{
   const lesson=ALL_LESSONS[item.lessonIndex],pool=(lesson.letters||lesson.items);
   const choices=elem('div','deen-path-options');
   const start=(state.foundationIndex+1)%pool.length;
   for(const candidate of [...pool.slice(start),...pool.slice(0,start)]){
    const b=makeButton(candidate.glyph,'foundationAnswer','deen-path-option');
    b.dataset.itemId=candidate.id;b.lang='ar';b.dir='rtl';
    if(state.foundationCorrect&&candidate.id===item.id)b.classList.add('deen-path-option-correct');
    choices.append(b);
   }
   box.append(choices);
  }
  if(item.reference)box.append(elem('p','deen-path-muted deen-path-word-reference',c.phraseVerse+' · '+item.reference));
  if(state.foundationFeedback){
   const feedback=elem('p','deen-path-feedback'+(state.foundationCorrect?' is-correct':' is-wrong'),state.foundationFeedback);
   feedback.setAttribute('role','status');box.append(feedback);
  }
  if(state.foundationCorrect)box.append(makeButton(
    state.foundationIndex+1===state.foundationQueue.length?c.foundationFinish:c.foundationNext,'foundationNext','deen-path-primary'));
  return box;
 }
 function foundationAnswer(id){
  if(state.view!=='foundationReview'||state.foundationCorrect)return;
  const item=foundationItem();if(!item||item.parts.length)return;
  const pool=ALL_LESSONS[item.lessonIndex].letters||ALL_LESSONS[item.lessonIndex].items;
  if(!pool.some(c=>c.id===id))return;
  const correct=id===item.id;
  if(!correct){if(!state.foundationWrong){foundationWrite(FOUNDATION.grade(foundationRead(),item.id,false));state.foundationWrong=true}}
  else{foundationWrite(FOUNDATION.grade(foundationRead(),item.id,true));state.foundationCorrect=true}
  state.foundationFeedback=correct?t().correct:t().wrong;update();
 }
 function foundationPiece(index){
  if(state.view!=='foundationReview'||state.foundationCorrect)return;
  const item=foundationItem();index=Number(index);
  if(!item||!item.parts.length||!Number.isInteger(index)||index<0||index>=item.parts.length||
     state.foundationPieces.includes(index))return;
  state.foundationPieces.push(index);
  if(state.foundationPieces.length===item.parts.length){
   const correct=state.foundationPieces.every((part,i)=>part===i);
   if(!correct){if(!state.foundationWrong){foundationWrite(FOUNDATION.grade(foundationRead(),item.id,false));state.foundationWrong=true}}
   else{foundationWrite(FOUNDATION.grade(foundationRead(),item.id,true));state.foundationCorrect=true}
   state.foundationFeedback=correct?t().correct:t().wrong;
  }
  update();
 }
 function foundationReset(){
  if(state.view!=='foundationReview'||state.foundationCorrect||!foundationItem()?.parts.length)return;
  state.foundationPieces=[];state.foundationFeedback='';update();
 }
 function foundationNext(){
  if(state.view!=='foundationReview'||!state.foundationCorrect)return;
  if(state.foundationIndex+1===state.foundationQueue.length){
   foundationWrite(FOUNDATION.finish(foundationRead(),state.foundationQueue.map(x=>x.id)));
   show('foundationDone');return;
  }
  state.foundationIndex++;state.foundationPieces=[];state.foundationCorrect=false;
  state.foundationFeedback='';state.foundationWrong=false;update();
 }
 function foundationDoneView(){
  const c=t(),box=elem('section','deen-path-completion');
  box.append(elem('div','deen-path-complete-star','✦'),
   elem('h2','deen-path-inner-title',c.foundationFinish),
   elem('p','deen-path-muted',c.foundationNote),
   makeButton(c.foundationBack,'arabic','deen-path-primary'));
  return box;
 }
 function weeklyGoalsView(){
  const c=t(),stats=weeklyGoalSnapshot(),box=elem('section','deen-path-week-goals');
  if(!stats)return box;
  box.append(elem('h3','deen-path-shape-subtitle',c.goalHeading),
   elem('p','deen-path-muted',c.goalIntro),
   elem('p','deen-path-goal-basis',stats.hasPreviousEvidence?c.goalPersonal:c.goalFresh));
  const period=elem('p','deen-path-goal-period',c.goalWeek+' · '+stats.start+' — '+stats.end);
  box.append(period);
  const goals=elem('div','deen-path-goal-list');
  const titles={active:c.goalDays,lessons:c.goalLessons,reviews:c.goalReviews};
  for(const g of stats.goals){
   const line=elem('div','deen-path-goal-item');
   const heading=elem('div','deen-path-goal-item-head');
   heading.append(elem('strong','',titles[g.id]||g.id),
    elem('span','',Math.min(g.current,g.target)+' / '+g.target));
   const track=elem('div','deen-path-course-progress'),fill=elem('span');
   fill.style.width=Math.round(Math.min(1,g.current/g.target)*100)+'%';
   track.append(fill);line.append(heading,track);goals.append(line);
  }
  box.append(goals);
  if(stats.allGoalsMet)box.append(elem('p','deen-path-goal-complete','✓ '+c.goalComplete));
  box.append(elem('h3','deen-path-shape-subtitle',c.goalRewards));
  const rewards=elem('div','deen-path-goal-rewards');
  const names={'first-steps':c.goalBronze,steady:c.goalSilver,committed:c.goalGold};
  const symbols={'first-steps':'✦',steady:'◆',committed:'★'};
  for(const tier of stats.rewards){
   const card=elem('div','deen-path-goal-reward'+(tier.earned?' is-earned':''));
   card.append(elem('span','deen-path-goal-reward-symbol',symbols[tier.id]),
    elem('strong','',names[tier.id]),
    elem('span','deen-path-goal-reward-progress',
     tier.earned?'✓ '+c.goalEarned:tier.progress+' / '+tier.days+' · '+c.goalLocked));
   rewards.append(card);
  }
  box.append(rewards);
  const archives=Object.entries(weeklyBadges().weeks).filter(([key,ids])=>key!==stats.key&&ids.length).slice(-6).reverse();
  const history=elem('div','deen-path-goal-archive');
  history.append(elem('h3','deen-path-shape-subtitle',c.goalArchive));
  if(!archives.length)history.append(elem('p','deen-path-muted',c.goalNoArchive));
  else for(const [week,ids] of archives)history.append(
   elem('p','deen-path-goal-archive-line',week+' · '+ids.map(id=>names[id]||id).join(', ')));
  box.append(history,elem('p','deen-path-muted deen-path-goal-note',c.goalOptional));
  return box;
 }
 function weeklyView(){
  const c=t(),stats=weeklySnapshot(),box=elem('section','deen-path-weekly-screen');
  box.append(makeButton('←  '+c.weekBack,'arabic','deen-path-back'),
   elem('div','deen-path-kicker',c.weekHeading),
   elem('h2','deen-path-inner-title',c.weekHeading),
   elem('p','deen-path-muted',c.weekIntro));
  const metrics=elem('div','deen-path-weekly-metrics');
  const nums=[[c.weekLessons,stats.lessonCount],[c.weekReviews,stats.reviewCount],
   [c.weekActive,stats.activeDays+' / 7'],[c.weekExams,stats.assessmentCount]];
  for(const [label,value] of nums){
   const item=elem('div','deen-path-weekly-stat');
   item.append(elem('strong','',String(value)),elem('span','',label));metrics.append(item);
  }
  box.append(metrics);
  box.append(weeklyGoalsView());
  const graph=elem('section','deen-path-weekly-history');
  graph.append(elem('h3','deen-path-shape-subtitle',c.weekDays));
  const days=elem('div','deen-path-weekly-days');
  const formatter=new Intl.DateTimeFormat(
   {tr:'tr-TR',en:'en-US',ar:'ar',de:'de-DE',fr:'fr-FR'}[lang()]||'tr-TR',
   {weekday:'short'});
  for(const d of stats.days){
   const date=new Date(Number(d.day.slice(0,4)),Number(d.day.slice(5,7))-1,Number(d.day.slice(8,10)),12);
   const day=elem('div','deen-path-weekly-day'+(d.day===stats.end?' is-today':''));
   const label=formatter.format(date);
   const count=d.lessons+d.reviews+d.assessments;
   const column=elem('div','deen-path-weekly-bar');
   const bar=elem('span','deen-path-weekly-bar-fill');
   bar.style.height=(count?Math.max(15,Math.min(100,count*16)):0)+'%';
   column.append(bar);
   day.append(elem('strong','deen-path-weekly-count',String(count)),column,
    elem('span','deen-path-weekly-daylabel',label),
    elem('span','deen-path-weekly-daydate',d.day.slice(8,10)));
   day.setAttribute('aria-label',
    d.day+' · '+c.weekDayLessons+' '+d.lessons+' · '+c.weekDayReviews+' '+d.reviews+
    ' · '+c.weekDayExams+' '+d.assessments);
   days.append(day);
  }
  graph.append(days);
  if(!stats.hasAnyActivity)graph.append(elem('p','deen-path-muted',c.weekNone));
  box.append(graph);
  const exams=elem('section','deen-path-weekly-exams');
  exams.append(elem('h3','deen-path-shape-subtitle',c.weekExamHeading));
  if(!stats.mostRecentScores.length)exams.append(elem('p','deen-path-muted',c.weekNoExam));
  else{
   for(const [i,s] of stats.mostRecentScores.entries()){
    const label=stats.mostRecentScores.length===2&&i===0?c.weekPrevious:c.weekLatest;
    const line=elem('div','deen-path-weekly-examrow');
    line.append(elem('span','',label),elem('strong','',s.correct+' / '+s.total));exams.append(line);
   }
   if(stats.scoreChange!==null){
    const delta=stats.scoreChange;
    const line=elem('p','deen-path-weekly-delta'+(delta>0?' is-up':delta<0?' is-down':''),
     c.weekChange+' · '+(delta>0?'+':'')+delta+' / 20');
    exams.append(line);
   }
  }
  box.append(exams,elem('p','deen-path-muted deen-path-weekly-note',c.weekLocal),
   elem('p','deen-path-muted deen-path-weekly-note',c.weekTime));
  return box;
 }
 function dailyView(){
  const c=t(),plan=dailySnapshot(),box=elem('section','deen-path-daily-screen');
  box.append(makeButton('←  '+c.dailyBack,'arabic','deen-path-back'),
   elem('div','deen-path-kicker',c.dailyHeading),
   elem('h2','deen-path-inner-title',c.dailyHeading),
   elem('p','deen-path-muted',c.dailyIntro));
  const selector=elem('section','deen-path-daily-setting');
  selector.append(elem('h3','deen-path-shape-subtitle',c.dailyPick));
  const choices=elem('div','deen-path-daily-choices');
  for(const minutes of DAILY.allowedMinutes){
   const b=makeButton(minutes+' '+c.dailyMinutes,'dailyMinutes','deen-path-daily-choice'+(plan.minutes===minutes?' is-selected':''));
   b.dataset.minutes=String(minutes);b.setAttribute('aria-pressed',String(plan.minutes===minutes));choices.append(b);
  }
  selector.append(choices,elem('p','deen-path-muted',c.dailyDurationNote));box.append(selector);
  const progress=elem('section','deen-path-daily-progress');
  progress.append(elem('h3','deen-path-shape-subtitle',c.dailyProgress));
  progress.append(elem('p','deen-path-daily-score',plan.completed+' / '+plan.total));
  const bar=elem('div','deen-path-course-progress'),fill=elem('span');fill.style.width=plan.completionPct+'%';bar.append(fill);
  progress.append(bar);
  const breakdown=elem('div','deen-path-daily-breakdown');
  breakdown.append(elem('span','',c.dailyLesson+' · '+plan.lessonDone+' / '+plan.lessonQuota));
  breakdown.append(elem('span','',c.dailyReview+' · '+plan.reviewDone+' / '+plan.reviewQuota));
  progress.append(breakdown);box.append(progress);
  const tasks=elem('section','deen-path-daily-tasks');
  tasks.append(elem('h3','deen-path-shape-subtitle',c.dailyGoal));
  if(plan.nextLesson){
   const b=makeButton(c.dailyNext+' · '+c.lesson+' '+(plan.nextLesson.index+1),'dailyLesson','deen-path-primary');
   b.dataset.lessonIndex=String(plan.nextLesson.index);tasks.append(b);
  }else if(!plan.lessonQuota)tasks.append(elem('p','deen-path-muted',c.dailyNoLesson));
  else if(!plan.remainingLesson)tasks.append(elem('p','deen-path-daily-check','✓ '+c.dailyLesson+' · '+c.dailyCompleted));
  if(plan.remainingReviews>0){
   if(plan.dueCount)tasks.append(makeButton(c.dailyPractice+' ('+plan.dueCount+')','startReview','deen-path-primary'));
   else if(plan.weakCount)tasks.append(makeButton(c.dailyWeakPractice+' ('+plan.weakCount+')','startWeakReview','deen-path-secondary'));
   else tasks.append(elem('p','deen-path-muted',c.dailyNoDue));
  }else if(plan.reviewQuota)tasks.append(elem('p','deen-path-daily-check','✓ '+c.dailyReview+' · '+c.dailyCompleted));
  if(plan.total===0||plan.completed===plan.total)tasks.append(elem('p','deen-path-daily-done','✓ '+c.dailyDone));
  box.append(tasks);
  box.append(makeButton(c.weekOpen+' →','weekly','deen-path-weekly-link'));
  box.append(checkpointPanel());
  if(remedyPlan().key)box.append(remedyPanel());
  box.append(foundationPanel());
  box.append(adaptivePanel());
  box.append(elem('p','deen-path-muted deen-path-daily-note',c.dailyLocal),
   elem('p','deen-path-muted deen-path-daily-note',c.masteryPrivacy));
  return box;
 }
 function masteryView(){
  const c=t(),stats=masterySnapshot(),box=elem('section','deen-path-mastery-screen');
  box.append(makeButton('←  '+c.masteryBack,'arabic','deen-path-back'),
   elem('div','deen-path-kicker',c.masteryHeading),
   elem('h2','deen-path-inner-title',c.masteryHeading),
   elem('p','deen-path-muted',c.masteryIntro));
  const metrics=elem('div','deen-path-mastery-metrics');
  for(const [label,value] of [
   [c.masteryWritten,stats.lessonCompleted+' / '+stats.lessonTotal],
   [c.masteryPracticed,stats.practiced+' / '+stats.total],
   [c.masteryDue,String(stats.due)],
   [c.masteryWeak,String(stats.weak)]
  ]){
   const tile=elem('div','deen-path-mastery-metric');tile.append(elem('span','deen-path-mastery-number',value),
    elem('span','deen-path-mastery-label',label));metrics.append(tile);
  }
  box.append(metrics);
  const levels=elem('section','deen-path-mastery-levels');
  levels.append(elem('h3','deen-path-shape-subtitle',c.masteryStages));
  const pairs=[
   ['notStarted',c.masteryNotStarted],['needsPractice',c.masteryNeedsPractice],
   ['learning',c.masteryLearning],['strengthening',c.masteryStrengthening]
  ];
  for(const [id,title] of pairs){
   const row=elem('div','deen-path-mastery-level-row');
   row.append(elem('span','deen-path-mastery-level-label',title),elem('span','deen-path-mastery-level-count',String(stats.levels[id])));
   const bar=elem('div','deen-path-course-progress'),fill=elem('span');
   fill.style.width=Math.round(100*stats.levels[id]/stats.total)+'%';
   bar.append(fill);row.append(bar);levels.append(row);
  }
  levels.append(elem('p','deen-path-muted deen-path-mastery-limit',c.masteryLevelsNote));
  box.append(levels);
  const action=elem('div','deen-path-mastery-actions');
  if(stats.due)action.append(makeButton(c.masteryPracticeDue+' ('+stats.due+')','startReview','deen-path-primary'));
  if(stats.weak)action.append(makeButton(c.masteryPracticeWeak+' ('+stats.weak+')','startWeakReview','deen-path-secondary'));
  const first=ALL_LESSONS.find(x=>!LISTENING_LESSONS.includes(x)&&!lessonIsDone(x)&&isUnlocked(x.index));
  if(first){const b=makeButton(c.masteryContinue,'masteryContinue','deen-path-secondary');b.dataset.lessonIndex=String(first.index);action.append(b)}
  if(action.childElementCount)box.append(action);
  const topics=elem('section','deen-path-mastery-topics');
  topics.append(elem('h3','deen-path-shape-subtitle',c.masteryGroupHeading));
  for(const group of stats.groupSummary){
   const line=elem('div','deen-path-mastery-topic');
   line.append(elem('span','deen-path-mastery-topic-name',c[group.titleKey]),
    elem('span','deen-path-mastery-topic-count',group.practiced+' / '+group.total));
   const progress=elem('div','deen-path-course-progress'),fill=elem('span');
   fill.style.width=Math.round(100*group.practiced/group.total)+'%';progress.append(fill);line.append(progress);
   const note=elem('small','deen-path-muted',c.masteryDue+' · '+group.due+'   ·   '+c.masteryWeak+' · '+group.weak);
   line.append(note);topics.append(line);
  }
  box.append(topics);
  const catalogue=elem('section','deen-path-mastery-catalogue');
  catalogue.append(elem('h3','deen-path-shape-subtitle',c.masteryCardsTitle));
  const filters=elem('div','deen-path-mastery-filters');
  for(const [id,label] of [['all',c.masteryFilterAll],['due',c.masteryFilterDue],['weak',c.masteryFilterWeak],['new',c.masteryFilterNew]]){
   const b=makeButton(label,'masteryFilter','deen-path-mastery-filter'+(state.masteryFilter===id?' is-active':''));
   b.dataset.filter=id;b.setAttribute('aria-pressed',String(state.masteryFilter===id));filters.append(b);
  }
  catalogue.append(filters);
  const filtered=stats.cards.filter(item=>state.masteryFilter==='due'?item.due:
   state.masteryFilter==='weak'?item.weak:state.masteryFilter==='new'?item.level==='notStarted':true);
  if(!filtered.length)catalogue.append(elem('p','deen-path-muted',c.masteryEmpty));
  else for(const item of filtered){
   const row=elem('div','deen-path-mastery-card');
   const title=elem('span','deen-path-mastery-word',item.glyph);title.lang='ar';title.dir='rtl';
   const copy=elem('div','deen-path-mastery-word-copy');
   copy.append(elem('strong','',item.gloss[lang()]||item.gloss.tr),
    elem('small','deen-path-muted',item.reference+' · '+c[['notStarted','needsPractice','learning','strengthening'].includes(item.level)?{
     notStarted:'masteryNotStarted',needsPractice:'masteryNeedsPractice',learning:'masteryLearning',strengthening:'masteryStrengthening'
    }[item.level]:'masteryNotStarted']));
   const footer=elem('small','deen-path-muted',c.masteryAttempts+' · '+item.attempts+
    '   ·   '+c.masteryMistakes+' · '+item.mistakes);
   copy.append(footer);
   if(item.due)copy.append(elem('small','deen-path-mastery-due',c.masteryNext+' · '+c.masteryNow));
   else if(item.dueAt!==null){
    let dateText=c.masteryNextNone;
    try{dateText=new Intl.DateTimeFormat(({tr:'tr-TR',en:'en-US',ar:'ar',de:'de-DE',fr:'fr-FR'})[lang()]||'tr-TR',
     {year:'numeric',month:'short',day:'numeric'}).format(new Date(item.dueAt))}catch(_){}
    copy.append(elem('small','deen-path-muted',c.masteryNext+' · '+dateText));
   }else copy.append(elem('small','deen-path-muted',c.masteryNext+' · '+c.masteryNextNone));
   row.append(title,copy);catalogue.append(row);
  }
  box.append(catalogue);
  box.append(elem('p','deen-path-muted deen-path-mastery-limit',c.masteryPrivacy),
   elem('p','deen-path-muted deen-path-mastery-limit',c.masteryLocalOnly));
  return box;
 }
 function spacedReviewDashboard(){
  const c=t(),box=elem('section','deen-path-spaced-section'),due=reviewDue(),tracked=Object.keys(reviewRead()).length;
  box.append(elem('h3','deen-path-shape-subtitle',c.reviewHeading),elem('p','deen-path-muted',c.reviewSub));
  box.append(elem('p','deen-path-progress-copy',c.reviewTracked+' · '+tracked+' / '+REVIEW_IDS.length+'   ·   '+c.reviewDue+' · '+due.length));
  if(due.length){const btn=makeButton(c.reviewButton+' ('+due.length+')','startReview','deen-path-primary');box.append(btn)}
  else box.append(elem('p','deen-path-muted',c.reviewNone));
  const weak=reviewWeak();box.append(elem('h4','deen-path-weak-heading',c.weakHeading+' · '+weak.length));
  box.append(elem('p','deen-path-muted',weak.length?c.weakSub:c.weakEmpty));
  if(weak.length)box.append(makeButton(c.weakCTA+' ('+weak.length+')','startWeakReview','deen-path-secondary'));
  box.append(elem('p','deen-path-muted',c.reviewSample));
  return box;
 }
 function listeningRoadmap(){
  const c=t(),box=elem('section','deen-path-listening-section'),done=listeningCompleted().length;
  box.append(elem('h3','deen-path-shape-subtitle',c.listenHeading),elem('p','deen-path-muted',c.listenSub));
  box.append(elem('p','deen-path-progress-copy',c.listenProgress+' · '+done+' / '+LISTENING_LESSONS.length));
  const progress=elem('div','deen-path-course-progress'),fill=elem('span');
  fill.style.width=Math.round(done/LISTENING_LESSONS.length*100)+'%';progress.append(fill);box.append(progress);
  box.append(elem('p','deen-path-muted deen-path-listening-count',c.listenVerified+' · '+LISTENING.approvedCount()+' / '+LISTENING.requiredCount));
  for(const lesson of LISTENING_LESSONS){
   const ready=LISTENING.lessonReady(lesson.id),locked=!isUnlocked(lesson.index),complete=listeningCompleted().includes(lesson.id);
   const card=makeButton('','group','deen-path-course-item deen-path-listening-item'+(complete?' is-completed':'')+(locked?' is-locked':''));
   card.disabled=locked;card.dataset.lessonIndex=String(lesson.index);
   const title=lesson.kind==='listen-syllable'?c.listenSyllableTitle:c.listenWordTitle;
   const top=elem('span','deen-path-course-item-top');
   top.append(elem('span','deen-path-course-number',c.listenLesson+' '+(lesson.index-LISTENING.startIndex+1)+' · '+title),
    elem('span','deen-path-course-status',complete?'✓ '+c.done:!ready?'🔒 '+c.listenPending:locked?'🔒 '+c.listenLocked:c.listenReady));
   const forms=elem('span','deen-path-course-glyphs',lesson.items.map(item=>item.glyph).join('  '));
   forms.lang='ar';forms.dir='rtl';card.append(top,forms,elem('span','deen-path-course-item-foot',c.free+' · '+title));box.append(card);
  }
  return box;
 }
 function groupView(){
  const c=t(),items=groupLetters(),box=elem('section','deen-path-arabic-landing');
  box.append(makeButton('←  '+c.arabic,'arabic','deen-path-back'));
  const pattern=PATTERN_LESSONS.includes(group()),phrase=PHRASE_LESSONS.includes(group()),meaning=MEANING_LESSONS.includes(group()),listening=LISTENING_LESSONS.includes(group()),word=WORD_LESSONS.includes(group()),reading=READING_LESSONS.includes(group()),phonics=group().kind!=='recognition'&&!reading&&!word&&!listening&&!meaning&&!phrase&&!pattern;
  const label=pattern?c.patternLesson:phrase?c.phraseLesson:meaning?c.meaningLesson:listening?c.listenLesson:word?c.wordLesson:reading?c.readLesson:phonics?c.vowelLesson:c.lesson;
  const num=pattern?state.lessonIndex-PATTERNS.startIndex+1:phrase?state.lessonIndex-PHRASES.startIndex+1:meaning?state.lessonIndex-MEANING.startIndex+1:listening?state.lessonIndex-LISTENING.startIndex+1:word?state.lessonIndex-WORDS.startIndex+1:reading?state.lessonIndex-READING.startIndex+1:phonics?state.lessonIndex-LESSONS.length+1:state.lessonIndex+1;
  const size=pattern?PATTERN_LESSONS.length:phrase?PHRASE_LESSONS.length:meaning?MEANING_LESSONS.length:listening?LISTENING_LESSONS.length:word?WORD_LESSONS.length:reading?READING_LESSONS.length:phonics?PHONIC_LESSONS.length:LESSONS.length;
  const title=pattern?(group().kind==='pattern-vocab'?c.patternVocabTitle:group().kind==='pattern-context'?c.patternContextTitle:c.patternStructureTitle):phrase?(group().kind==='phrase-vocab'?c.phraseVocabTitle:group().kind==='phrase-context'?c.phraseContextTitle:c.phraseOrderTitle):meaning?(group().kind==='meaning-gloss'?c.meaningGlossTitle:group().kind==='meaning-role'?c.meaningRoleTitle:c.meaningOrderTitle):listening?(group().kind==='listen-syllable'?c.listenSyllableTitle:c.listenWordTitle):word?(group().kind==='syllable-build'?c.wordSyllablesTitle:group().kind==='word-build'?c.wordWordsTitle:c.wordQuranTitle):reading?c[group().kind+'Title']:phonics?(group().kind==='harakat'?c.markTitle:c.syllableTitle):c.groupTitle;
  const help=pattern?c.patternSub:phrase?(group().kind==='phrase-vocab'?c.phraseVocabDetail:group().kind==='phrase-context'?c.phraseContextDetail:c.phraseOrderDetail):meaning?(group().kind==='meaning-gloss'?c.meaningGlossDetail:group().kind==='meaning-role'?c.meaningRoleDetail:c.meaningOrderDetail):listening?(group().kind==='listen-syllable'?c.listenSyllableDetail:c.listenWordDetail):word?(group().kind==='syllable-build'?c.wordSyllablesDetail:group().kind==='word-build'?c.wordWordsDetail:c.wordQuranDetail):reading?c[group().kind+'Detail']:phonics?(group().kind==='harakat'?c.vowelHelp:c.syllableHelp):letterAudioCourseInfo(c.courseInfo);
  box.append(elem('span','deen-path-pill',label+' '+num+' / '+size+' · '+c.free));
  box.append(elem('h2','deen-path-inner-title',title),elem('p','deen-path-muted',help));
  box.append(lettersStrip(items));
  if(!reading&&!phonics&&!word&&!listening&&!meaning&&!phrase&&!pattern){
   box.append(elem('h3','deen-path-shape-subtitle',c.shape),shapeAtlas(items));
   if(items.some(item=>!item.joinsNext))box.appendChild(elem('p','deen-path-muted',c.atlasHelp));
  }
  box.append(elem('p','deen-path-muted deen-path-warning',pattern?c.patternSub:phrase?c.meaningIntro:meaning?c.meaningIntro:listening?c.listenSub:word?c.wordIntro:reading?c.readIntro:phonics?c.audioMissing:letterAudioCourseInfo(c.courseInfo)));
  box.append(makeButton(lessonIsDone()?c.redo:pattern?c.patternCTA:phrase?c.phraseCTA:meaning?c.meaningCTA:listening?c.listenPlay:word?c.wordCTA:reading?c.readCTA:phonics?(group().kind==='harakat'?c.vowelStart:c.syllableStart):c.goLesson,'start','deen-path-primary'));
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
 function listeningLessonView(){
  const c=t(),items=groupLetters(),item=items[state.question],box=elem('section','deen-path-lesson deen-path-listening-lesson');
  box.append(makeButton('←  '+c.arabic,'group','deen-path-back'));
  box.append(elem('div','deen-path-kicker',c.listenHeading));
  box.append(elem('p','deen-path-question-count',c.progress+' '+(state.question+1)+' / '+items.length),
   elem('h2','deen-path-inner-title',c.listenChoose));
  const playButton=makeButton(state.listeningBusy?c.listenWorking:state.listenHeard?c.listenReplay:c.listenPlay,'listen','deen-path-primary deen-path-listen-play');
  playButton.disabled=state.listeningBusy;box.append(playButton);
  const options=elem('div','deen-path-options deen-path-listening-options');
  const order=[...items.slice((state.question+1)%items.length),...items.slice(0,(state.question+1)%items.length)];
  for(const candidate of order){
   const b=makeButton(candidate.glyph,'answer','deen-path-option');b.dataset.letterId=candidate.id;b.lang='ar';b.dir='rtl';
   b.disabled=!state.listenHeard||state.listeningBusy;
   if(state.correct&&candidate.id===item.id)b.classList.add('deen-path-option-correct');
   options.append(b);
  }
  box.append(options);
  if(state.feedback){
   const line=elem('p','deen-path-feedback'+(state.correct?' is-correct':' is-wrong'),state.feedback);
   line.setAttribute('role','status');box.append(line);
  }
  if(state.correct)box.append(makeButton(state.question===items.length-1?c.finish:c.next,'next','deen-path-primary'));
  return box;
 }
 async function playListening(){
  if(state.view!=='lesson'||!LISTENING_LESSONS.includes(group())||!isUnlocked(state.lessonIndex)||state.listeningBusy)return;
  const id=groupLetters()[state.question].clipId,lessonIndex=state.lessonIndex,question=state.question;
  state.listeningBusy=true;state.feedback='';update();
  const ok=await LISTENING.play(id);
  if(state.view!=='lesson'||state.lessonIndex!==lessonIndex||state.question!==question)return;
  state.listeningBusy=false;state.listenHeard=state.listenHeard||ok;
  if(!ok)state.feedback=t().listenError;
  update();
 }
 function meaningLessonView(){
  const c=t(),items=groupLetters(),item=items[state.question],type=group().kind,ordering=type==='meaning-order';
  const box=elem('section','deen-path-lesson deen-path-meaning-lesson');
  box.append(makeButton('←  '+c.arabic,'group','deen-path-back'));
  box.append(elem('div','deen-path-kicker',c.meaningHeading));
  box.append(elem('p','deen-path-question-count',c.progress+' '+(state.question+1)+' / '+items.length));
  box.append(elem('h2','deen-path-inner-title',ordering?c.meaningOrderPrompt:type==='meaning-role'?c.meaningRolePrompt:c.meaningGlossPrompt));
  if(ordering){
   const hint=elem('div','deen-path-meaning-hint',c.meaningOrderHint+' · '+(item.meaning[lang()]||item.meaning.tr));box.append(hint);
   const preview=elem('div','deen-path-meaning-built',state.pieces.map(i=>item.parts[i]).join(' ')||'···');
   preview.lang='ar';preview.dir='rtl';box.append(preview);
   const choices=elem('div','deen-path-meaning-pieces');
   for(const i of item.parts.map((_,j)=>j).reverse()){
    const b=makeButton(item.parts[i],'meaningPiece','deen-path-meaning-piece');
    b.dataset.pieceIndex=String(i);b.lang='ar';b.dir='rtl';b.disabled=state.pieces.includes(i);choices.append(b);
   }
   box.append(choices);
   const reset=makeButton(c.meaningCheckReset,'resetMeaning','deen-path-back deen-path-word-reset');
   reset.disabled=!state.pieces.length;box.append(reset);
  }else{
   const prompt=elem('div','deen-path-meaning-hint',(type==='meaning-role'?item.role:item.gloss)[lang()]||(type==='meaning-role'?item.role:item.gloss).tr);
   box.append(prompt);
   if(type==='meaning-role'){const excerpt=elem('div','deen-path-word-excerpt',item.excerpt);excerpt.lang='ar';excerpt.dir='rtl';box.append(excerpt)}
   const options=elem('div','deen-path-options');
   const ordered=[...items.slice((state.question+1)%items.length),...items.slice(0,(state.question+1)%items.length)];
   for(const candidate of ordered){
    const btn=makeButton(candidate.glyph,'answer','deen-path-option');btn.dataset.letterId=candidate.id;btn.lang='ar';btn.dir='rtl';
    if(state.correct&&candidate.id===item.id)btn.classList.add('deen-path-option-correct');options.append(btn);
   }
   box.append(options);
  }
  box.append(elem('p','deen-path-muted deen-path-word-reference',c.meaningVerse+' · '+item.reference));
  if(state.feedback){
   const f=elem('p','deen-path-feedback'+(state.correct?' is-correct':' is-wrong'),state.feedback);
   f.setAttribute('role','status');box.append(f);
  }
  if(state.correct)box.append(makeButton(state.question===items.length-1?c.finish:c.next,'next','deen-path-primary'));
  return box;
 }
 function meaningPiece(index){
  if(state.view!=='lesson'||state.correct||group().kind!=='meaning-order')return;
  const item=groupLetters()[state.question];index=Number(index);
  if(!Number.isInteger(index)||index<0||index>=item.parts.length||state.pieces.includes(index))return;
  state.pieces.push(index);
  if(state.pieces.length===item.parts.length){
   state.correct=state.pieces.every((x,i)=>x===i);
   if(!state.correct)markLessonMiss();
    state.feedback=state.correct?t().correct:t().meaningWrongOrder;
  }
  update();
 }
 function resetMeaning(){
  if(state.view!=='lesson'||state.correct||group().kind!=='meaning-order')return;
  state.pieces=[];state.feedback='';update();
 }
 function phraseLessonView(){
  const c=t(),lesson=group(),items=groupLetters(),item=items[state.question],kind=lesson.kind,ordering=kind==='phrase-order';
  const box=elem('section','deen-path-lesson deen-path-phrase-lesson');
  box.append(makeButton('←  '+c.arabic,'group','deen-path-back'),elem('div','deen-path-kicker',c.phraseHeading));
  box.append(elem('p','deen-path-question-count',c.progress+' '+(state.question+1)+' / '+items.length));
  box.append(elem('h2','deen-path-inner-title',ordering?c.phraseOrderPrompt:kind==='phrase-vocab'?c.phraseVocabPrompt:c.phraseContextPrompt));
  if(ordering){
   box.append(elem('div','deen-path-phrase-hint',item.gloss[lang()]||item.gloss.tr));
   const built=elem('div','deen-path-meaning-built',state.pieces.map(i=>item.parts[i]).join(' ')||'···');
   built.lang='ar';built.dir='rtl';box.append(built);
   const parts=elem('div','deen-path-meaning-pieces');
   for(const i of item.parts.map((_,j)=>j).reverse()){
    const b=makeButton(item.parts[i],'phrasePiece','deen-path-meaning-piece');b.dataset.pieceIndex=String(i);
    b.disabled=state.pieces.includes(i);b.lang='ar';b.dir='rtl';parts.append(b);
   }
   box.append(parts);const reset=makeButton(c.phraseReset,'resetPhrase','deen-path-back deen-path-word-reset');
   reset.disabled=!state.pieces.length;box.append(reset);
  }else{
   const hint=elem('div','deen-path-phrase-hint',kind==='phrase-vocab'?item.gloss[lang()]:item.glyph);
   if(kind==='phrase-context'){hint.lang='ar';hint.dir='rtl';hint.classList.add('deen-path-phrase-arabic')}
   box.append(hint);
   if(kind==='phrase-vocab'){const verse=elem('div','deen-path-word-excerpt',item.excerpt);verse.lang='ar';verse.dir='rtl';box.append(verse)}
   const choices=elem('div','deen-path-options');
   for(const candidate of [...items.slice((state.question+1)%items.length),...items.slice(0,(state.question+1)%items.length)]){
    const value=kind==='phrase-vocab'?candidate.glyph:candidate.gloss[lang()];
    const btn=makeButton(value,'answer','deen-path-option deen-path-phrase-option');btn.dataset.letterId=candidate.id;
    if(kind==='phrase-vocab'){btn.lang='ar';btn.dir='rtl'}
    if(state.correct&&candidate.id===item.id)btn.classList.add('deen-path-option-correct');
    choices.append(btn);
   }
   box.append(choices);
  }
  box.append(elem('p','deen-path-muted deen-path-word-reference',c.phraseVerse+' · '+item.reference));
  if(state.correct&&item.note)box.append(elem('p','deen-path-muted deen-path-phrase-note',c.phraseNote+' · '+item.note[lang()]));
  if(state.feedback){const f=elem('p','deen-path-feedback'+(state.correct?' is-correct':' is-wrong'),state.feedback);f.setAttribute('role','status');box.append(f)}
  if(state.correct)box.append(makeButton(state.question===items.length-1?c.finish:c.next,'next','deen-path-primary'));
  return box;
 }
 function phrasePiece(index){
  if(state.view!=='lesson'||state.correct||group().kind!=='phrase-order')return;
  const item=groupLetters()[state.question];index=Number(index);
  if(!Number.isInteger(index)||index<0||index>=item.parts.length||state.pieces.includes(index))return;
  state.pieces.push(index);
  if(state.pieces.length===item.parts.length){
   state.correct=state.pieces.every((piece,j)=>piece===j);
   if(!state.correct)markLessonMiss();
    state.feedback=state.correct?t().correct:t().phraseWrongOrder;
  }
  update();
 }
 function resetPhrase(){
  if(state.view!=='lesson'||state.correct||group().kind!=='phrase-order')return;
  state.pieces=[];state.feedback='';update();
 }
 function reviewItem(){return state.reviewQueue[state.reviewIndex]}
 function startReview(weakOnly=false){
  state.reviewMode='normal';
  const due=weakOnly?reviewWeak():reviewDue();
  if(!due.length)return false;
  state.reviewQueue=due.slice(0,12);state.reviewIndex=0;state.correct=false;state.feedback='';
  return show('review');
 }
 function reviewView(){
  const c=t(),item=reviewItem(),box=elem('section','deen-path-lesson deen-path-review-lesson');
  if(!item)return box;
  const groupIndex=PATTERNS.lessons[1].items.some(x=>x.id===item.id)?3:PATTERNS.lessons[0].items.some(x=>x.id===item.id)?2:PHRASES.lessons[1].items.some(x=>x.id===item.id)?1:0;
  const pools=[PHRASES.lessons[0].items,PHRASES.lessons[1].items,PATTERNS.lessons[0].items,PATTERNS.lessons[1].items];
  const items=pools[groupIndex],phrase=(groupIndex%2)===1;
  box.append(makeButton('←  '+c.arabic,'arabic','deen-path-back'),elem('div','deen-path-kicker',state.reviewMode==='adaptive'?c.heading:c.reviewHeading));
  box.append(elem('p','deen-path-question-count',c.progress+' '+(state.reviewIndex+1)+' / '+state.reviewQueue.length));
  box.append(elem('h2','deen-path-inner-title',c.reviewPrompt));
  const prompt=elem('div','deen-path-phrase-hint',phrase?item.glyph:item.gloss[lang()]);
  if(phrase){prompt.lang='ar';prompt.dir='rtl';prompt.classList.add('deen-path-phrase-arabic')}
  box.append(prompt);
  const choices=elem('div','deen-path-options');
  const order=[...items.slice((state.reviewIndex+1)%items.length),...items.slice(0,(state.reviewIndex+1)%items.length)];
  for(const candidate of order){
   const label=phrase?candidate.gloss[lang()]:candidate.glyph;
   const btn=makeButton(label,'reviewAnswer','deen-path-option deen-path-phrase-option');btn.dataset.letterId=candidate.id;
   if(!phrase){btn.lang='ar';btn.dir='rtl'}
   if(state.correct&&candidate.id===item.id)btn.classList.add('deen-path-option-correct');
   choices.append(btn);
  }
  box.append(choices);
  if(state.feedback){const f=elem('p','deen-path-feedback'+(state.correct?' is-correct':' is-wrong'),state.feedback);f.setAttribute('role','status');box.append(f)}
  if(state.correct)box.append(makeButton(c.reviewNext,'reviewNext','deen-path-primary'));
  return box;
 }
 function reviewAnswer(id){
  if(state.view!=='review'||state.correct||!reviewItem())return;
  const right=id===reviewItem().id;
  recordReview(reviewItem().id,right);
  state.correct=right;
  state.feedback=right?t().reviewCorrect:t().reviewWrong;
  update();
 }
 function reviewNext(){
  if(state.view!=='review'||!state.correct)return;
  state.reviewIndex++;state.correct=false;state.feedback='';
  if(state.reviewIndex>=state.reviewQueue.length){
   if(state.reviewMode==='adaptive'){
    const next=ADAPTIVE.recordFocus(adaptiveHistory(),state.reviewQueue.map(x=>x.id));
    try{localStorage.setItem(ADAPTIVE_STORE,JSON.stringify(next))}catch(_){}
   }
   show('reviewDone');
  }
  else update();
 }
 function reviewDoneView(){
  const c=t(),box=elem('section','deen-path-completion');
  box.append(elem('div','deen-path-complete-star','✦'),elem('h2','deen-path-inner-title',state.reviewMode==='adaptive'?c.finished:c.reviewComplete));
  box.append(elem('p','deen-path-muted',state.reviewMode==='adaptive'?c.note:c.reviewSub),makeButton(c.reviewBack,'arabic','deen-path-primary'));
  return box;
 }
 function patternLessonView(){
  const c=t(),items=groupLetters(),item=items[state.question],kind=group().kind;
  const box=elem('section','deen-path-lesson deen-path-pattern-lesson');
  box.append(makeButton('←  '+c.arabic,'group','deen-path-back'),elem('div','deen-path-kicker',c.patternHeading));
  box.append(elem('p','deen-path-question-count',c.progress+' '+(state.question+1)+' / '+items.length),
   elem('h2','deen-path-inner-title',kind==='pattern-vocab'?c.patternVocabPrompt:kind==='pattern-context'?c.patternContextPrompt:c.patternStructurePrompt));
  const prompt=elem('div','deen-path-phrase-hint deen-path-phrase-arabic',item.glyph);prompt.lang='ar';prompt.dir='rtl';box.append(prompt);
  const options=elem('div','deen-path-options');
  for(const candidate of [...items.slice((state.question+1)%items.length),...items.slice(0,(state.question+1)%items.length)]){
   const label=(kind==='pattern-structure'?candidate.role:candidate.gloss)[lang()];
   const b=makeButton(label,'answer','deen-path-option deen-path-phrase-option');b.dataset.letterId=candidate.id;
   if(state.correct&&candidate.id===item.id)b.classList.add('deen-path-option-correct');
   options.append(b);
  }
  box.append(options,elem('p','deen-path-muted deen-path-word-reference',c.phraseVerse+' · '+item.reference));
  if(state.correct&&kind==='pattern-structure')box.append(elem('p','deen-path-muted deen-path-phrase-note',item.gloss[lang()]));
  if(state.feedback){const f=elem('p','deen-path-feedback'+(state.correct?' is-correct':' is-wrong'),state.feedback);f.setAttribute('role','status');box.append(f)}
  if(state.correct)box.append(makeButton(state.question===items.length-1?c.finish:c.next,'next','deen-path-primary'));
  return box;
 }
 const recognitionLabels=Object.freeze({
  tr:{check:'Kontrol Et'},en:{check:'Check'},ar:{check:'تحقق'},
  de:{check:'Prüfen'},fr:{check:'Vérifier'}
 });
 const recognitionText=()=>recognitionLabels[lang()]||recognitionLabels.tr;
 function lessonView(){
  if(PATTERN_LESSONS.includes(group()))return patternLessonView();
  if(PHRASE_LESSONS.includes(group()))return phraseLessonView();
  if(MEANING_LESSONS.includes(group()))return meaningLessonView();
  if(LISTENING_LESSONS.includes(group()))return listeningLessonView();
  if(WORD_LESSONS.includes(group()))return wordLessonView();
  const c=t(),items=groupLetters(),box=elem('section','deen-path-lesson');
  box.append(makeButton('←  '+c.arabic,'group','deen-path-back'));
  const item=items[state.question],n=state.question+1;
  box.append(elem('div','deen-path-kicker',READING_LESSONS.includes(group())?c.readHeading:group().kind!=='recognition'?c.vowelHeading:c.lesson+' '+(state.lessonIndex+1)+' · '+c.groupTitle));
  box.append(elem('p','deen-path-question-count',c.progress+' '+n+' / '+items.length),elem('h2','deen-path-inner-title',c.question));
  box.append(elem('div','deen-path-prompt',letterLabel(item)));
  const letterVoice=window.DEEN_ARABIC_LETTER_AUDIO;
  // Playback belongs directly to the answer chips; no extra Listen button.
  const options=elem('div','deen-path-options');
  if(group().kind==='recognition'&&items.length===4)options.classList.add('deen-path-options-four');
  const order=[...items.slice((state.question+1)%items.length),...items.slice(0,(state.question+1)%items.length)];
  for(const candidate of order){
   const b=makeButton(candidate.glyph,'answer','deen-path-option');
   b.dataset.letterId=candidate.id;b.lang='ar';b.dir='rtl';
   // Only names with a recorded, available voice show the speaker affordance.
   if(group().kind==='recognition'){
    const mode=letterVoice?.modeFor(candidate.id);
    if(mode){
     b.classList.add('deen-path-option-audio');
     if(mode==='device')b.classList.add('deen-path-option-tts');
     b.title=mode==='device'?audioHelp().device:letterVoice.label(lang(),true);
     b.setAttribute('aria-label',letterLabel(candidate)+' · '+b.title);
    }
   }
   if(group().kind==='recognition'){
    const selected=state.selectedLetterId===candidate.id;
    b.setAttribute('aria-pressed',String(selected));
    if(selected)b.classList.add('deen-path-option-selected');
   }
   if(state.correct&&candidate.id===item.id)b.classList.add('deen-path-option-correct');
   options.appendChild(b);
  }
  box.appendChild(options);
  if(group().kind==='recognition'){
   appendLetterAudioHelp(box,items);
   const status=elem('p','deen-path-audio-status',audioDiagnostic(state.audioStatus));
   status.id='deenLetterAudioStatus';status.setAttribute('role','status');
   status.hidden=!status.textContent;box.append(status);
  }
  if(state.feedback){
   const f=elem('p','deen-path-feedback'+(state.correct?' is-correct':' is-wrong'),state.feedback);
   f.setAttribute('role','status');box.appendChild(f);
  }
  if(group().kind==='recognition'&&!state.correct){
   const check=makeButton(recognitionText().check,'checkLetterAnswer','deen-path-primary deen-path-check-letter');
   check.disabled=!state.selectedLetterId;
   box.appendChild(check);
  }
  if(state.correct)box.appendChild(makeButton(state.question===items.length-1?c.finish:c.next,'next','deen-path-primary'));
  return box;
 }
 function completedView(){
  const c=t(),box=elem('section','deen-path-completion');
  box.append(elem('div','deen-path-complete-star','✦'),elem('h2','deen-path-inner-title',c.completed));
  box.append(elem('p','deen-path-muted',(PATTERN_LESSONS.includes(group())?c.patternLesson:PHRASE_LESSONS.includes(group())?c.phraseLesson:MEANING_LESSONS.includes(group())?c.meaningLesson:LISTENING_LESSONS.includes(group())?c.listenLesson:WORD_LESSONS.includes(group())?c.wordLesson:READING_LESSONS.includes(group())?c.readLesson:group().kind==='recognition'?c.lesson:c.vowelLesson)+' '+(PATTERN_LESSONS.includes(group())?state.lessonIndex-PATTERNS.startIndex+1:PHRASE_LESSONS.includes(group())?state.lessonIndex-PHRASES.startIndex+1:MEANING_LESSONS.includes(group())?state.lessonIndex-MEANING.startIndex+1:LISTENING_LESSONS.includes(group())?state.lessonIndex-LISTENING.startIndex+1:WORD_LESSONS.includes(group())?state.lessonIndex-WORDS.startIndex+1:READING_LESSONS.includes(group())?state.lessonIndex-READING.startIndex+1:group().kind==='recognition'?state.lessonIndex+1:state.lessonIndex-LESSONS.length+1)+' · '+groupLetters().map(x=>x.glyph).join('  ')));
  box.append(elem('p','deen-path-muted',PATTERN_LESSONS.includes(group())?c.patternFinish:PHRASE_LESSONS.includes(group())?c.phraseDone:MEANING_LESSONS.includes(group())?c.meaningFinish:LISTENING_LESSONS.includes(group())?c.listenFinish:WORD_LESSONS.includes(group())?c.wordFinish:READING_LESSONS.includes(group())?c.readFinish:group().kind==='recognition'?(completed().length===LESSONS.length?c.courseCompleteDesc:c.completedDesc):c.vowelFinish));
  if(state.lessonIndex<ALL_LESSONS.length-1&&isUnlocked(state.lessonIndex+1))box.append(makeButton(c.nextLesson,'nextGroup','deen-path-primary'));
  // Phase 6 audio is locked pending independent review: offer an actual next lesson.
  if(state.lessonIndex===WORD_LESSONS[WORD_LESSONS.length-1].index&&isUnlocked(MEANING.startIndex))
   box.append(makeButton(c.meaningCTA,'openMeaning','deen-path-primary'));
  if(state.lessonIndex===MEANING_LESSONS[MEANING_LESSONS.length-1].index&&isUnlocked(PHRASES.startIndex))
   box.append(makeButton(c.phraseCTA,'openPhrases','deen-path-primary'));
  if(state.lessonIndex===PHRASE_LESSONS[PHRASE_LESSONS.length-1].index&&isUnlocked(PATTERNS.startIndex))
   box.append(makeButton(c.patternCTA,'openPatterns','deen-path-primary'));
  if(state.lessonIndex<16)box.append(foundationPanel());
  else box.append(adaptivePanel());
  if(checkpointEligible())box.append(checkpointPanel());
  box.append(makeButton(c.redo,'start','deen-path-primary'),makeButton('←  '+c.arabic,'arabic','deen-path-back'));
  return box;
 }
 function show(view){
  if(state.view==='lesson'||view!=='lesson')LISTENING.stop();
  if(view!=='group'||state.view!=='group')window.DEEN_ARABIC_LETTER_AUDIO?.stop();
  if(state.view!==view)state.audioPreviewOpen=false;
  state.view=view;const container=root();if(!container)return false;
  ensure();
  update();return true;
 }
 function selectGroup(index){
  index=Number(index);
  if(!Number.isInteger(index)||index<0||index>=ALL_LESSONS.length||!isUnlocked(index))return false;
  LISTENING.stop();window.DEEN_ARABIC_LETTER_AUDIO?.stop();state.lessonIndex=index;state.question=0;state.correct=false;state.feedback='';state.pieces=[];state.lessonMissed=[];state.listenHeard=false;state.listeningBusy=false;
  return show('group');
 }
 function start(){
  if(!isUnlocked(state.lessonIndex))return false;
  LISTENING.stop();window.DEEN_ARABIC_LETTER_AUDIO?.stop();state.audioPreviewOpen=false;state.audioStatus='';state.selectedLetterId=null;state.question=0;state.correct=false;state.feedback='';state.pieces=[];state.lessonMissed=[];state.complete=false;state.listenHeard=false;state.listeningBusy=false;
  return show('lesson');
 }
 function next(){
  if(state.view==='review')return reviewNext();
  if(!state.correct)return;
  LISTENING.stop();
  if(state.question<groupLetters().length-1){
   state.question++;state.correct=false;state.feedback='';state.audioStatus='';state.selectedLetterId=null;state.pieces=[];state.listenHeard=false;state.listeningBusy=false;show('lesson');
  }else{
   state.complete=true;saveCompleted();saveLessonOutcome();dailyMark('lesson',group().id);show('complete');
  }
 }
 function gradeAnswer(id){
  if(state.correct)return;
  if((PHRASE_LESSONS.includes(group())&&group().kind!=='phrase-order')||
      (PATTERN_LESSONS.includes(group())&&group().kind!=='pattern-structure'))
   recordReview(groupLetters()[state.question].id,id===groupLetters()[state.question].id);
  if(LISTENING_LESSONS.includes(group())&&!state.listenHeard)return;
  state.correct=id===groupLetters()[state.question].id;
  foundationGradeInLesson(state.correct);
  if(!state.correct)markLessonMiss();
  state.feedback=state.correct?t().correct:t().wrong;
  update();
 }
 function answer(id){
  if(state.view!=='lesson')return;
  if(group().kind==='recognition'){
   if(!groupLetters().some(candidate=>candidate.id===id))return;
   // Each choice plays its own pronunciation on the originating tap;
   // only the separate Check action is allowed to grade an answer.
   state.audioStatus='';
   window.DEEN_ARABIC_LETTER_AUDIO?.playChoice?.(id);
   if(!state.correct){
    state.selectedLetterId=id;
    state.feedback='';
    update();
   }
   return;
  }
  gradeAnswer(id);
 }
 function checkLetterAnswer(){
  if(state.view!=='lesson'||group().kind!=='recognition'||state.correct)return;
  if(state.selectedLetterId)gradeAnswer(state.selectedLetterId);
 }
 function piece(index){
  if(state.view!=='lesson'||state.correct||!WORD_LESSONS.includes(group())||group().kind==='quran-find')return;
  const item=groupLetters()[state.question];index=Number(index);
  if(!Number.isInteger(index)||index<0||index>=item.parts.length||state.pieces.includes(index)||state.pieces.length>=item.parts.length)return;
  state.pieces.push(index);
  if(state.pieces.length===item.parts.length){
   state.correct=state.pieces.every((part,i)=>part===i);
   foundationGradeInLesson(state.correct);
   if(!state.correct)markLessonMiss();
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
   panel.appendChild(state.view==='home'?homeView():state.view==='arabic'?alphabetView():state.view==='remedy'?remedyView():state.view==='remedyQuestion'?remedyQuestionView():state.view==='remedyDone'?remedyDoneView():state.view==='checkpoint'?checkpointLanding():state.view==='checkpointQuestion'?checkpointQuestionView():state.view==='checkpointResults'?checkpointResultView():state.view==='foundationReview'?foundationReviewView():state.view==='foundationDone'?foundationDoneView():state.view==='weekly'?weeklyView():state.view==='daily'?dailyView():state.view==='mastery'?masteryView():state.view==='group'?groupView():state.view==='lesson'?lessonView():state.view==='review'?reviewView():state.view==='reviewDone'?reviewDoneView():completedView());
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
  document.addEventListener('deen:arabic-letter-audio-status',e=>{
   if(state.view!=='lesson')return;
   state.audioStatus=String(e.detail?.code||'');
   const display=container.querySelector('#deenLetterAudioStatus');
   if(display){display.textContent=audioDiagnostic(state.audioStatus);display.hidden=!display.textContent}
  });
  document.addEventListener('deen:arabic-letter-voiceschanged',()=>{
   if(state.view==='lesson'&&group().kind==='recognition')update();
  });
  container.addEventListener('click',e=>{
   const b=e.target.closest?.('[data-qpath-action]');if(!b||!container.contains(b))return;
   const action=b.dataset.qpathAction;
   if(['home','arabic','surah'].includes(action))show(action);
   else if(action==='group'){
    if(b.dataset.lessonIndex!==undefined)selectGroup(b.dataset.lessonIndex);
    else show('group'); // lesson back button: preserve selected lesson
   }
   else if(action==='weekly')show('weekly');
   else if(action==='daily')show('daily');
   else if(action==='dailyMinutes'){if(setDailyMinutes(b.dataset.minutes))update()}
   else if(action==='dailyLesson')selectGroup(b.dataset.lessonIndex);
   else if(action==='mastery'){state.masteryFilter='all';show('mastery')}
   else if(action==='masteryFilter'){
    if(['all','due','weak','new'].includes(b.dataset.filter)){state.masteryFilter=b.dataset.filter;update()}
   }
   else if(action==='masteryContinue')selectGroup(b.dataset.lessonIndex);
   else if(action==='nextGroup')selectGroup(state.lessonIndex+1);
   else if(action==='start')start();
   else if(action==='answer')answer(b.dataset.letterId);
   else if(action==='checkLetterAnswer')checkLetterAnswer();
   else if(action==='piece')piece(b.dataset.pieceIndex);
   else if(action==='resetPieces')resetPieces();
   else if(action==='meaningPiece')meaningPiece(b.dataset.pieceIndex);
   else if(action==='phrasePiece')phrasePiece(b.dataset.pieceIndex);
   else if(action==='resetPhrase')resetPhrase();
   else if(action==='openPhrases')selectGroup(PHRASES.startIndex);
   else if(action==='remedy')show('remedy');
   else if(action==='remedyOpen')show('remedy');
   else if(action==='remedyStart')remedyStart();
   else if(action==='remedyAnswer')remedyAnswer(b.dataset.itemId);
   else if(action==='remedyPiece')remedyPiece(b.dataset.pieceIndex);
   else if(action==='remedyReset'){
    if(state.view==='remedyQuestion'&&!state.remedyCorrect){state.remedyPieces=[];state.remedyFeedback='';update()}
   }
   else if(action==='remedyNext')remedyNext();
   else if(action==='checkpointOpen')show('checkpoint');
   else if(action==='checkpointStart')checkpointStart();
   else if(action==='checkpointResults'){state.checkpointResult=null;show('checkpointResults')}
   else if(action==='checkpointAnswer')checkpointAnswer(b.dataset.itemId);
   else if(action==='checkpointPiece')checkpointPiece(b.dataset.pieceIndex);
   else if(action==='checkpointReset'){
    if(state.view==='checkpointQuestion'&&state.checkpointFeedback===null){state.checkpointPieces=[];update()}
   }
   else if(action==='checkpointNext')checkpointNext();
   else if(action==='checkpointTopic')selectGroup(b.dataset.lessonIndex);
   else if(action==='startFoundation')startFoundation();
   else if(action==='foundationAnswer')foundationAnswer(b.dataset.itemId);
   else if(action==='foundationPiece')foundationPiece(b.dataset.pieceIndex);
   else if(action==='foundationReset')foundationReset();
   else if(action==='foundationNext')foundationNext();
   else if(action==='startAdaptive')startAdaptive();
   else if(action==='adaptiveNext')selectGroup(b.dataset.lessonIndex);
   else if(action==='startReview')startReview();
   else if(action==='startWeakReview')startReview(true);
   else if(action==='openPatterns')selectGroup(PATTERNS.startIndex);
   else if(action==='reviewAnswer')reviewAnswer(b.dataset.letterId);
   else if(action==='reviewNext')reviewNext();
   else if(action==='resetMeaning')resetMeaning();
   else if(action==='openMeaning')selectGroup(MEANING.startIndex);
   else if(action==='letterAudio')window.DEEN_ARABIC_LETTER_AUDIO?.play(b.dataset.letterId);
   else if(action==='toggleAudioPreview'){state.audioPreviewOpen=!state.audioPreviewOpen;update()}
   else if(action==='listen')playListening();
   else if(action==='next')next();
  });
  observer=new MutationObserver(scheduleEnsure);
  observer.observe(container,{childList:true});
  ensure();
  document.addEventListener('deen:navigated',()=>{
   // Navigation away from Qur'an must stop letter audio too, not only re-entry.
   window.DEEN_ARABIC_LETTER_AUDIO?.stop();
   if(document.querySelector('.screen.active')?.id==='leagueScreen'){
    state.view='home';
    setTimeout(()=>{if(ensure())update()},0);
   }
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.DEEN_QURAN_PATHS=Object.freeze({enterArabic:()=>show('arabic'),openSurahs:()=>show('surah'),home:()=>show('home'),selectGroup,start,ensure,refresh:update,status:()=>({view:state.view,lessonIndex:state.lessonIndex,lessonAvailable:true,complete:savedComplete(),completedLessons:completed().length,totalLessons:LESSONS.length,letterCount:LETTERS.length,lessonLetters:groupLetters().map(x=>x.id),vowelCompletedLessons:vowelCompleted().length,vowelTotalLessons:PHONIC_LESSONS.length,phonicsAudioReady:false,readingCompletedLessons:readingCompleted().length,readingTotalLessons:READING_LESSONS.length,readingAudioReady:false,wordCompletedLessons:wordCompleted().length,wordTotalLessons:WORD_LESSONS.length,wordAudioReady:false,listeningCompletedLessons:listeningCompleted().length,listeningTotalLessons:LISTENING_LESSONS.length,listeningApprovedClips:LISTENING.approvedCount(),listeningRequiredClips:LISTENING.requiredCount,overallLessonCount:ALL_LESSONS.length,meaningCompletedLessons:meaningCompleted().length,meaningTotalLessons:MEANING_LESSONS.length,meaningAvailable:isUnlocked(MEANING.startIndex),phraseCompletedLessons:phraseCompleted().length,phraseTotalLessons:PHRASE_LESSONS.length,phraseAvailable:isUnlocked(PHRASES.startIndex),reviewDue:reviewDue().length,reviewTracked:Object.keys(reviewRead()).length,reviewWeak:reviewWeak().length,weekly:weeklySnapshot(),weeklyGoals:weeklyGoalSnapshot(),weeklyBadges:weeklyBadges(),remediation:(p=>({key:p.key,total:p.total,complete:p.complete,remaining:p.remaining,topics:p.topics.map(t=>({id:t.id,total:t.total,done:t.done})),comparison:remedyComparison()}))(remedyPlan()),checkpoint:{eligible:checkpointEligible(),completedWritten:writtenCompletedCount(),last:checkpointLatest(),attemptCount:checkpointRead().attempts.length},foundation:foundationSnapshot(),adaptive:adaptiveSnapshot(),daily:dailySnapshot(),mastery:((s)=>({total:s.total,practiced:s.practiced,due:s.due,weak:s.weak,levels:s.levels,lessonCompleted:s.lessonCompleted,lessonTotal:s.lessonTotal}))(masterySnapshot()),patternCompletedLessons:patternCompleted().length,patternTotalLessons:PATTERN_LESSONS.length,patternAvailable:isUnlocked(PATTERNS.startIndex)}),version:'quran-arabic-paths-phase17'});
})();