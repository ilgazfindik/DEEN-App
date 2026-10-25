/* DEEN Arabic — Phase 14 written-learning checkpoint.
 * Five tested study areas, 20 questions, 4 each. This assesses written recognition
 * only: no recitation, Arabic proficiency, certificates, XP, or paid gating.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_CHECKPOINT)return;
 const letters=window.DEEN_ARABIC_LETTERS,harakat=window.DEEN_ARABIC_HARAKAT,
  reading=window.DEEN_ARABIC_READING,words=window.DEEN_ARABIC_WORDS,
  phrases=window.DEEN_ARABIC_PHRASES,patterns=window.DEEN_ARABIC_PATTERNS;
 if(!letters||!harakat||!reading||!words||!phrases||!patterns)throw Error('DEEN_ARABIC_CHECKPOINT_DATA_MISSING');
 const makeDomain=(id,items,lessonIndex)=>Object.freeze({
  id,lessonIndex,items:Object.freeze(items.map(item=>Object.freeze(item)))
 });
 const domains=Object.freeze([
  makeDomain('letters',letters.all,0),
  makeDomain('vowels',harakat.lessons.flatMap(l=>l.items),7),
  makeDomain('reading',reading.lessons.flatMap(l=>l.items),10),
  makeDomain('words',words.lessons.flatMap(l=>l.items).filter(x=>x.parts.length>0),13),
  makeDomain('meaning',[...phrases.reviewCards,...patterns.reviewCards],21)
 ]);
 if(domains.some(g=>g.items.length<4))throw Error('DEEN_ARABIC_CHECKPOINT_TOO_FEW_ITEMS');
 function build(attempt=0){
  const turn=Number.isInteger(attempt)&&attempt>=0?attempt:0,questions=[];
  for(const domain of domains){
   const pool=domain.items;
   const picks=Array.from({length:4},(_,i)=>pool[(turn*4+i)%pool.length]);
   for(let i=0;i<picks.length;i++){
    const item=picks[i],isBuild=domain.id==='words',selected=[];
    if(!isBuild){
     const pivot=pool.findIndex(x=>x.id===item.id);
     for(let offset=0;offset<pool.length&&selected.length<4;offset++){
      const other=pool[(pivot+offset)%pool.length];
      if(!selected.some(x=>x.glyph===other.glyph))selected.push({id:other.id,glyph:other.glyph});
     }
     if(selected.length<4)throw Error('DEEN_ARABIC_CHECKPOINT_DUPLICATE_GLYPH');
     const spin=(turn+i+2)%4;
     selected.push(...selected.splice(0,spin));
    }
    questions.push(Object.freeze({
     id:item.id,domain:domain.id,type:isBuild?'build':'choice',
     glyph:item.glyph,label:item.names||item.gloss,
     parts:Object.freeze(isBuild?[...item.parts]:[]),
     options:Object.freeze(selected.map(x=>Object.freeze(x))),
     reference:item.reference||null
    }));
   }
  }
  if(questions.length!==20||new Set(questions.map(q=>q.id)).size!==20)throw Error('DEEN_ARABIC_CHECKPOINT_DUPLICATE_QUESTION');
  return Object.freeze(questions);
 }
 function summarize(questions,answers,at=Date.now()){
  if(!Array.isArray(questions)||questions.length!==20||!Array.isArray(answers)||answers.length!==20)return null;
  if(!questions.every((q,i)=>answers[i]&&answers[i].id===q.id&&typeof answers[i].correct==='boolean'))return null;
  const topics=domains.map(g=>{
   const indexes=questions.flatMap((q,i)=>q.domain===g.id?[i]:[]);
   const correct=indexes.filter(i=>answers[i].correct).length;
   return Object.freeze({id:g.id,correct,total:indexes.length,needsReview:correct<3,lessonIndex:g.lessonIndex,
    missed:Object.freeze(indexes.filter(i=>!answers[i].correct).map(i=>questions[i].id))});
  });
  const correct=answers.filter(x=>x.correct).length;
  return Object.freeze({schema:1,at:Number.isFinite(at)&&at>=0?at:Date.now(),correct,total:20,
   accuracy:correct*5,topics:Object.freeze(topics),
   needsReview:Object.freeze(topics.filter(x=>x.needsReview).map(x=>x.id)),
   missedIds:Object.freeze(answers.filter(x=>!x.correct).map(x=>x.id)),
   limitation:'Written question recognition and word ordering, not spoken Arabic or Quran recitation.'});
 }
 function history(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return Object.freeze({schema:1,nextAttempt:0,attempts:Object.freeze([])});
  const candidates=Array.isArray(raw.attempts)?raw.attempts.slice(-10):[];
  const attempts=candidates.filter(x=>x&&Number.isInteger(x.correct)&&x.correct>=0&&x.correct<=20&&
   Number.isFinite(x.at)&&Array.isArray(x.topics)&&x.topics.length===5).map(x=>Object.freeze(x));
  return Object.freeze({schema:1,nextAttempt:Number.isInteger(raw.nextAttempt)&&raw.nextAttempt>=0?Math.min(1000000,raw.nextAttempt):attempts.length,
   attempts:Object.freeze(attempts)});
 }
 function save(raw,summary){
  const previous=history(raw);
  if(!summary||summary.schema!==1||summary.total!==20||!Number.isInteger(summary.correct)||summary.topics?.length!==5)return previous;
  return Object.freeze({schema:1,nextAttempt:previous.nextAttempt+1,
   attempts:Object.freeze([...previous.attempts,summary].slice(-10))});
 }
 const ui=Object.freeze({
  tr:{examHeading:'Arapça Bitirme Değerlendirmesi',examIntro:'Öğrendiğin harfleri, harekeleri, okuma işaretlerini, kelime kurmayı ve anlam bilgisini yazılı sorularla kontrol et.',examLocked:'Değerlendirmeyi açmak için 25 yazılı dersi tamamla. Onay bekleyen sesli dersler gerekli değil.',examStart:'20 Soruluk Değerlendirmeye Başla',examRetry:'Yeniden Dene',examBack:'Arapça Derslerine Dön',examProgress:'Soru',examPrompt:'Doğru Arapça biçimi seç.',examBuild:'Parçaları doğru sırayla birleştir.',examCorrect:'Doğru',examWrong:'Tekrar çalışılabilir',examNext:'Sonraki Soruyu Aç',examFinish:'Sonuçları Gör',examResults:'Değerlendirme Sonuçların',examScore:'Yazılı Doğruluk',examAreas:'Konu Bazında Sonuç',examReview:'Tekrar Edilmesi Önerilenler',examRevisit:'Konuyu Tekrar Çalış',examReady:'Bu denemede öncelikli tekrar konusu belirlenmedi.',examLast:'Son tamamlanan deneme',examNone:'Henüz bir değerlendirme tamamlanmadı.',examLocal:'Sonuçlar bu cihazda saklanır. Bu bir dil seviyesi, kıraat veya tecvid sertifikası değildir.',examLetters:'Harfler',examVowels:'Harekeler ve Heceler',examReading:'Okuma İşaretleri',examWords:'Kelime Oluşturma',examMeaning:'Kelimelerin Anlamı',examReset:'Parçaları Sıfırla'},
  en:{examHeading:'Arabic Learning Checkpoint',examIntro:'Check written letter, vowel, reading-mark, word-building and meaning recognition.',examLocked:'Complete all 25 written lessons to unlock. Unapproved audio lessons are not required.',examStart:'Start 20-Question Checkpoint',examRetry:'Try Again',examBack:'Back to Arabic Lessons',examProgress:'Question',examPrompt:'Choose the correct Arabic form.',examBuild:'Build the word in the correct order.',examCorrect:'Correct',examWrong:'Needs more practice',examNext:'Next Question',examFinish:'View Results',examResults:'Your Checkpoint Results',examScore:'Written Accuracy',examAreas:'Results by Topic',examReview:'Suggested Topics to Review',examRevisit:'Practice This Topic',examReady:'No priority review topics in this attempt.',examLast:'Last completed attempt',examNone:'No completed checkpoint yet.',examLocal:'Saved on this device. This is not a language, recitation or Tajwid certificate.',examLetters:'Letters',examVowels:'Vowels and Syllables',examReading:'Reading Marks',examWords:'Word Building',examMeaning:'Word Meanings',examReset:'Reset Parts'},
  ar:{examHeading:'تقييم ختامي للعربية',examIntro:'اختبر تمييز الحروف والحركات وعلامات القراءة وتركيب الكلمات ومعانيها كتابةً.',examLocked:'أكمل الدروس الكتابية الخمسة والعشرين أولًا. دروس الصوت غير المعتمدة ليست مطلوبة.',examStart:'ابدأ تقييم ٢٠ سؤالًا',examRetry:'حاول مرة أخرى',examBack:'العودة لدروس العربية',examProgress:'السؤال',examPrompt:'اختر الشكل العربي الصحيح.',examBuild:'رتّب الأجزاء لتكوين الكلمة.',examCorrect:'صحيح',examWrong:'يحتاج إلى تدريب',examNext:'السؤال التالي',examFinish:'عرض النتائج',examResults:'نتائج التقييم',examScore:'الدقة الكتابية',examAreas:'النتائج حسب الموضوع',examReview:'موضوعات للمراجعة',examRevisit:'راجع هذا الموضوع',examReady:'لا توجد موضوعات ذات أولوية للمراجعة في هذه المحاولة.',examLast:'آخر محاولة مكتملة',examNone:'لم يكتمل أي تقييم بعد.',examLocal:'النتائج محفوظة على الجهاز. هذا ليس شهادة لغة أو تلاوة أو تجويد.',examLetters:'الحروف',examVowels:'الحركات والمقاطع',examReading:'علامات القراءة',examWords:'تركيب الكلمات',examMeaning:'معاني الكلمات',examReset:'إعادة الأجزاء'},
  de:{examHeading:'Arabisch-Abschlusstest',examIntro:'Prüfe schriftlich Buchstaben, Vokale, Lesemarken, Wortaufbau und Bedeutungen.',examLocked:'Schließe alle 25 schriftlichen Lektionen ab. Nicht freigegebene Audiolektionen sind nicht nötig.',examStart:'20-Fragen-Test starten',examRetry:'Erneut versuchen',examBack:'Zurück zu Arabisch',examProgress:'Frage',examPrompt:'Wähle die richtige arabische Form.',examBuild:'Setze die Wortteile richtig zusammen.',examCorrect:'Richtig',examWrong:'Mehr Übung nötig',examNext:'Nächste Frage',examFinish:'Ergebnis ansehen',examResults:'Dein Testergebnis',examScore:'Schriftliche Trefferquote',examAreas:'Ergebnisse nach Thema',examReview:'Empfohlene Wiederholungen',examRevisit:'Thema wiederholen',examReady:'In diesem Versuch keine vorrangigen Themen.',examLast:'Letzter abgeschlossener Versuch',examNone:'Noch kein abgeschlossener Test.',examLocal:'Nur auf diesem Gerät gespeichert. Kein Sprach-, Rezitations- oder Tadschwid-Zertifikat.',examLetters:'Buchstaben',examVowels:'Vokale und Silben',examReading:'Lesemarken',examWords:'Wörter zusammensetzen',examMeaning:'Wortbedeutungen',examReset:'Teile zurücksetzen'},
  fr:{examHeading:'Bilan final d’arabe',examIntro:'Évalue par écrit les lettres, voyelles, signes, assemblages de mots et sens.',examLocked:'Termine les 25 leçons écrites. Les leçons audio non approuvées ne sont pas nécessaires.',examStart:'Lancer le bilan de 20 questions',examRetry:'Réessayer',examBack:'Retour aux leçons',examProgress:'Question',examPrompt:'Choisis la bonne forme arabe.',examBuild:'Assemble les morceaux dans l’ordre.',examCorrect:'Correct',examWrong:'À retravailler',examNext:'Question suivante',examFinish:'Voir les résultats',examResults:'Résultats du bilan',examScore:'Précision à l’écrit',examAreas:'Résultats par sujet',examReview:'Sujets à réviser',examRevisit:'Réviser ce sujet',examReady:'Aucun sujet prioritaire dans cet essai.',examLast:'Dernier essai terminé',examNone:'Aucun bilan terminé.',examLocal:'Conservé sur cet appareil. Ne certifie ni langue, ni récitation, ni tajwid.',examLetters:'Lettres',examVowels:'Voyelles et syllabes',examReading:'Signes de lecture',examWords:'Assembler des mots',examMeaning:'Sens des mots',examReset:'Réinitialiser les morceaux'}
 });
 window.DEEN_ARABIC_CHECKPOINT=Object.freeze({version:1,domains,build,summarize,history,save,ui,requiredWritten:25,questionCount:20});
})();
