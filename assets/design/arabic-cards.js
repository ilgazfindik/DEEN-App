/* Card-first letter lessons: each new letter arrives as a teaching card and is asked about at once,
   using only letters already taught. A wrong answer shows a short reminder and the question returns
   at the end of the lesson. The Arabic path engine opens this layer and saves the result itself. */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_CARDS)return;
 const AR_FONT='"Noto Naskh Arabic","Geeza Pro","Arabic Typesetting","Traditional Arabic",serif';
 // Shape family and dots for every letter: [family, dot count, 'a'bove/'b'elow].
 const DESC={alif:['stroke',0],ba:['boat',1,'b'],ta:['boat',2,'a'],tha:['boat',3,'a'],jim:['hook',1,'b'],hha:['hook',0],kha:['hook',1,'a'],
  dal:['angle',0],dhal:['angle',1,'a'],ra:['tail',0],zay:['tail',1,'a'],sin:['teeth',0],shin:['teeth',3,'a'],sad:['loop',0],dad:['loop',1,'a'],
  tta:['stick',0],zza:['stick',1,'a'],ayn:['mouth',0],ghayn:['mouth',1,'a'],fa:['fa',1,'a'],qaf:['qaf',2,'a'],kaf:['kaf',0],lam:['lam',0],
  mim:['mim',0],nun:['nun',1,'a'],ha:['ring',0],waw:['waw',0],ya:['ya',2,'b']};
 const SHAPE={
  tr:{stroke:'Yukarıdan aşağı dik bir çizgi.',boat:'Kayık gibi yayvan bir çanak.',hook:'Üstte bir şapka, altta açık bir kanca.',angle:'Küçük, köşeli bir dirsek.',tail:'Satırın altına inen kısa bir kuyruk.',teeth:'Üç küçük diş ve yuvarlak bir kuyruk.',loop:'Yatık bir halka ve yuvarlak bir kuyruk.',stick:'Yatık bir halka ve üstünde dik bir çubuk.',mouth:'Üstte açık bir ağız, altta geniş bir kanca.',fa:'Küçük yuvarlak bir baş ve düz bir gövde.',qaf:'Yuvarlak bir baş ve derin bir çanak.',kaf:'Uzun bir gövde, içinde küçük bir işaret.',lam:'Uzun bir çizgi ve altta yuvarlak bir kanca.',mim:'Küçük yuvarlak bir baş ve aşağı inen kuyruk.',nun:'Yuvarlak, derin bir çanak.',ring:'Küçük, yuvarlak bir halka.',waw:'Yuvarlak bir baş ve aşağı kıvrılan kuyruk.',ya:'Kıvrımlı bir gövde ve geri dönen kuyruk.'},
  en:{stroke:'A single upright stroke.',boat:'A wide, shallow bowl like a boat.',hook:'A cap on top and an open hook below.',angle:'A small angled elbow.',tail:'A short tail that dips below the line.',teeth:'Three small teeth and a round tail.',loop:'A flat loop and a round tail.',stick:'A flat loop with an upright stick.',mouth:'An open mouth on top and a wide hook below.',fa:'A small round head on a flat body.',qaf:'A round head and a deep bowl.',kaf:'A tall body with a small mark inside.',lam:'A tall stroke ending in a round hook.',mim:'A small round head with a tail going down.',nun:'A round, deep bowl.',ring:'A small round ring.',waw:'A round head with a tail curling down.',ya:'A curving body with a tail that sweeps back.'},
  de:{stroke:'Ein einzelner senkrechter Strich.',boat:'Eine flache Schale wie ein Boot.',hook:'Oben ein Dach, unten ein offener Haken.',angle:'Ein kleiner, eckiger Winkel.',tail:'Ein kurzer Schwanz, der unter die Zeile reicht.',teeth:'Drei kleine Zähne und ein runder Bogen.',loop:'Eine flache Schlaufe und ein runder Bogen.',stick:'Eine flache Schlaufe mit senkrechtem Strich.',mouth:'Oben ein offener Mund, unten ein weiter Haken.',fa:'Ein kleiner runder Kopf auf flachem Körper.',qaf:'Ein runder Kopf und eine tiefe Schale.',kaf:'Ein hoher Körper mit kleinem Zeichen darin.',lam:'Ein hoher Strich mit rundem Haken unten.',mim:'Ein kleiner runder Kopf mit Schwanz nach unten.',nun:'Eine runde, tiefe Schale.',ring:'Ein kleiner runder Ring.',waw:'Ein runder Kopf mit nach unten gebogenem Schwanz.',ya:'Ein geschwungener Körper mit zurückschwingendem Schwanz.'},
  fr:{stroke:'Un simple trait vertical.',boat:'Une coupe plate comme une barque.',hook:'Un chapeau en haut et un crochet ouvert en bas.',angle:'Un petit coude anguleux.',tail:'Une courte queue qui descend sous la ligne.',teeth:'Trois petites dents et une queue arrondie.',loop:'Une boucle allongée et une queue arrondie.',stick:'Une boucle allongée surmontée d’une tige.',mouth:'Une bouche ouverte en haut et un large crochet en bas.',fa:'Une petite tête ronde sur un corps plat.',qaf:'Une tête ronde et une coupe profonde.',kaf:'Un grand corps avec un petit signe à l’intérieur.',lam:'Un trait haut terminé par un crochet rond.',mim:'Une petite tête ronde avec une queue vers le bas.',nun:'Une coupe ronde et profonde.',ring:'Un petit anneau rond.',waw:'Une tête ronde et une queue qui descend en courbe.',ya:'Un corps courbé avec une queue qui revient.'},
  ar:{stroke:'خطّ واحد قائم.',boat:'جسم مسطّح يشبه القارب.',hook:'رأس في الأعلى وتجويف مفتوح في الأسفل.',angle:'شكل صغير بزاوية.',tail:'ذيل قصير ينزل تحت السطر.',teeth:'ثلاث أسنان صغيرة وذيل مستدير.',loop:'عقدة مستطيلة وذيل مستدير.',stick:'عقدة مستطيلة فوقها عصا قائمة.',mouth:'رأس مفتوح في الأعلى وتجويف واسع في الأسفل.',fa:'رأس صغير مستدير على جسم مسطّح.',qaf:'رأس مستدير وتجويف عميق.',kaf:'جسم طويل بداخله علامة صغيرة.',lam:'خطّ طويل ينتهي بتجويف مستدير.',mim:'رأس صغير مستدير وذيل نازل.',nun:'تجويف مستدير عميق.',ring:'حلقة صغيرة مستديرة.',waw:'رأس مستدير وذيل منحنٍ للأسفل.',ya:'جسم منحنٍ وذيل يرتدّ إلى الخلف.'}
 };
 const T={
  tr:{whichAyah:n=>n+'. ayet hangisi?',fillQ:'Eksik kelimeyi bul',seqQ:'Ayetleri sırayla diz',buildMem:'Ezberden kur',buildAyah:n=>n+'. ayeti diz',correctWord:'Doğru kelime:',correctOrder:'Doğru sıra:',ayahWord:'Ayet',seqHint:'Önce küçük numaralı ayet gelir',introEyebrow:'BU DERSTE',startLesson:'Derse başla',countCards:n=>n+' kart',countQs:n=>n+' soru',countMin:n=>'~'+n+' dk',howRead:'Bu nasıl okunur?',meanQ:'Bu ne demek?',roleQ:'Bunun görevi ne?',whichMean:n=>'Hangisi “'+n+'” demek?',build:'Parçaları sırayla diz',buildHint:'Arapça sağdan sola okunur',findQ:n=>'Ayette “'+n+'” kelimesini bul',inQuran:'Kur’an’da',learnedItems:'Bu derste öğrendiklerin',newItem:'YENİ',caution:'DİKKAT',whatItem:'Bu hangisi?',matchItems:'Eşleştir',example:'Örnek',newLetter:'YENİ HARF',rule:'KURAL',form:'YAZILIŞ',listen:'Dinle',cont:'Devam',check:'Kontrol et',got:'Anladım',which:n=>'Hangisi '+n+'?',whatName:'Bu harf hangisi?',hear:'Duyduğun harfe dokun',match:'Harfleri adlarıyla eşleştir',
   dotsQ:(c,p)=>c===0?'Hangisinde nokta yok?':'Hangisinin '+(p==='a'?'üstünde ':'altında ')+c+' nokta var?',
   dots:(c,p)=>c===0?'Noktası yok.':(p==='a'?'Üstünde ':'Altında ')+c+' nokta var.',dotsShort:(c,p)=>c===0?'nokta yok':(p==='a'?'üstte ':'altta ')+c+' nokta',
   ruleTitle:'Noktalar harfi değiştirir',ruleSub:'Benzer harfleri noktaların sayısı ve yeri ayırır.',
   joinTitle:'Kelime başında kısalır',joinSub:'Bu harfler kelimenin başında sonraki harfe bağlanır ve kuyruklarını bırakır. Noktalar yerinde kalır.',initialQ:n=>n+' kelime başında nasıl yazılır?',
   noJoinTitle:'Sonraki harfe bağlanmaz',noJoinSub:'Bu harfler kendilerinden sonra gelen harfle birleşmez; kelimenin başında da aynı yazılır.',noJoinQ:'Hangisi sonraki harfe bağlanmaz?',
   praise:['Harika!','Doğru!','Çok iyi!','Tam isabet!'],matched:'Hepsini eşleştirdin.',streak:n=>n+' doğru üst üste',streakTag:n=>n+' seri',remember:'Hatırla',again:'Bu soru az sonra yeniden gelecek.',retry:'TEKRAR DENE',
   matchHint:'Harfi ve adını birlikte seç.',done:'Ders tamamlandı!',learned:'Bu derste öğrendiklerin',acc:'DOĞRULUK',time:'SÜRE',best:'EN UZUN SERİ',quitTitle:'Dersten çıkılsın mı?',quitSub:'Bu dersteki ilerlemen kaydedilmez.',quitStay:'Derse devam et',quitLeave:'Çık',close:'Dersten çık',progress:'Ders ilerlemesi',replay:'Sesi tekrar çal'},
  en:{whichAyah:n=>'Which one is ayah '+n+'?',fillQ:'Find the missing word',seqQ:'Put the ayahs in order',buildMem:'Build it from memory',buildAyah:n=>'Build ayah '+n,correctWord:'Correct word:',correctOrder:'Correct order:',ayahWord:'Ayah',seqHint:'The lower-numbered ayah comes first',introEyebrow:'IN THIS LESSON',startLesson:'Start lesson',countCards:n=>n+(n===1?' card':' cards'),countQs:n=>n+(n===1?' question':' questions'),countMin:n=>'~'+n+' min',howRead:'How is this read?',meanQ:'What does this mean?',roleQ:'What is its role?',whichMean:n=>'Which one means “'+n+'”?',build:'Put the parts in order',buildHint:'Arabic reads right to left',findQ:n=>'Find “'+n+'” in the verse',inQuran:'In the Quran',learnedItems:'What you learned',newItem:'NEW',caution:'WATCH OUT',whatItem:'Which one is this?',matchItems:'Match the pairs',example:'Example',newLetter:'NEW LETTER',rule:'RULE',form:'WRITING',listen:'Listen',cont:'Continue',check:'Check',got:'Got it',which:n=>'Which one is '+n+'?',whatName:'Which letter is this?',hear:'Tap the letter you hear',match:'Match the letters to their names',
   dotsQ:(c,p)=>c===0?'Which one has no dots?':'Which one has '+c+' dot'+(c>1?'s':'')+(p==='a'?' above?':' below?'),
   dots:(c,p)=>c===0?'No dots.':c+' dot'+(c>1?'s':'')+(p==='a'?' above.':' below.'),dotsShort:(c,p)=>c===0?'no dots':c+(p==='a'?' above':' below'),
   ruleTitle:'Dots change the letter',ruleSub:'Similar letters differ only in the number and place of their dots.',
   joinTitle:'Shorter at the start of a word',joinSub:'At the start of a word these letters join the next letter and drop their tail. The dots stay where they are.',initialQ:n=>'How is '+n+' written at the start of a word?',
   noJoinTitle:'Does not join forward',noJoinSub:'These letters never join the letter after them, so they look the same at the start of a word.',noJoinQ:'Which one does not join the next letter?',
   praise:['Great!','Correct!','Well done!','Spot on!'],matched:'All matched.',streak:n=>n+' in a row',streakTag:n=>n+' streak',remember:'Remember',again:'This question comes back in a moment.',retry:'TRY AGAIN',
   matchHint:'Pick a letter and its name together.',done:'Lesson complete!',learned:'Letters from this lesson',acc:'ACCURACY',time:'TIME',best:'BEST STREAK',quitTitle:'Leave the lesson?',quitSub:'Progress in this lesson will not be saved.',quitStay:'Keep learning',quitLeave:'Leave',close:'Leave lesson',progress:'Lesson progress',replay:'Play the sound again'},
  de:{whichAyah:n=>'Welcher ist Vers '+n+'?',fillQ:'Finde das fehlende Wort',seqQ:'Bringe die Verse in die richtige Reihenfolge',buildMem:'Aus dem Gedächtnis zusammensetzen',buildAyah:n=>'Setze Vers '+n+' zusammen',correctWord:'Richtiges Wort:',correctOrder:'Richtige Reihenfolge:',ayahWord:'Vers',seqHint:'Der Vers mit der kleineren Nummer kommt zuerst',introEyebrow:'IN DIESER LEKTION',startLesson:'Lektion starten',countCards:n=>n+(n===1?' Karte':' Karten'),countQs:n=>n+(n===1?' Frage':' Fragen'),countMin:n=>'~'+n+' Min.',howRead:'Wie liest man das?',meanQ:'Was bedeutet das?',roleQ:'Welche Rolle hat es?',whichMean:n=>'Was bedeutet „'+n+'“?',build:'Setze die Teile in die richtige Reihenfolge',buildHint:'Arabisch liest man von rechts nach links',findQ:n=>'Finde „'+n+'“ im Vers',inQuran:'Im Koran',learnedItems:'Das hast du gelernt',newItem:'NEU',caution:'ACHTUNG',whatItem:'Was ist das?',matchItems:'Ordne die Paare zu',example:'Beispiel',newLetter:'NEUER BUCHSTABE',rule:'REGEL',form:'SCHREIBWEISE',listen:'Anhören',cont:'Weiter',check:'Prüfen',got:'Verstanden',which:n=>'Welcher ist '+n+'?',whatName:'Welcher Buchstabe ist das?',hear:'Tippe auf den Buchstaben, den du hörst',match:'Ordne die Buchstaben ihren Namen zu',
   dotsQ:(c,p)=>c===0?'Welcher hat keine Punkte?':'Welcher hat '+c+' Punkt'+(c>1?'e':'')+(p==='a'?' oben?':' unten?'),
   dots:(c,p)=>c===0?'Keine Punkte.':c+' Punkt'+(c>1?'e':'')+(p==='a'?' oben.':' unten.'),dotsShort:(c,p)=>c===0?'keine Punkte':c+(p==='a'?' oben':' unten'),
   ruleTitle:'Punkte ändern den Buchstaben',ruleSub:'Ähnliche Buchstaben unterscheiden sich nur durch Zahl und Lage der Punkte.',
   joinTitle:'Am Wortanfang kürzer',joinSub:'Am Wortanfang verbinden sich diese Buchstaben mit dem nächsten und verlieren ihren Schwanz. Die Punkte bleiben.',initialQ:n=>'Wie schreibt man '+n+' am Wortanfang?',
   noJoinTitle:'Verbindet nicht nach links',noJoinSub:'Diese Buchstaben verbinden sich nie mit dem folgenden Buchstaben und sehen am Wortanfang gleich aus.',noJoinQ:'Welcher verbindet sich nicht mit dem nächsten Buchstaben?',
   praise:['Super!','Richtig!','Sehr gut!','Genau!'],matched:'Alles zugeordnet.',streak:n=>n+' richtig in Folge',streakTag:n=>n+' in Folge',remember:'Merke',again:'Diese Frage kommt gleich noch einmal.',retry:'NOCH EINMAL',
   matchHint:'Wähle einen Buchstaben und seinen Namen.',done:'Lektion geschafft!',learned:'Buchstaben aus dieser Lektion',acc:'GENAUIGKEIT',time:'ZEIT',best:'BESTE SERIE',quitTitle:'Lektion verlassen?',quitSub:'Der Fortschritt dieser Lektion wird nicht gespeichert.',quitStay:'Weiterlernen',quitLeave:'Verlassen',close:'Lektion verlassen',progress:'Lektionsfortschritt',replay:'Ton noch einmal abspielen'},
  fr:{whichAyah:n=>'Lequel est le verset '+n+' ?',fillQ:'Trouve le mot manquant',seqQ:'Remets les versets dans l’ordre',buildMem:'Reconstitue de mémoire',buildAyah:n=>'Reconstitue le verset '+n,correctWord:'Bon mot :',correctOrder:'Bon ordre :',ayahWord:'Verset',seqHint:'Le verset au plus petit numéro vient d’abord',introEyebrow:'DANS CETTE LEÇON',startLesson:'Commencer la leçon',countCards:n=>n+(n===1?' carte':' cartes'),countQs:n=>n+(n===1?' question':' questions'),countMin:n=>'~'+n+' min',howRead:'Comment se lit ce mot ?',meanQ:'Que signifie ceci ?',roleQ:'Quel est son rôle ?',whichMean:n=>'Lequel signifie « '+n+' » ?',build:'Remets les parties dans l’ordre',buildHint:'L’arabe se lit de droite à gauche',findQ:n=>'Trouve « '+n+' » dans le verset',inQuran:'Dans le Coran',learnedItems:'Ce que tu as appris',newItem:'NOUVEAU',caution:'ATTENTION',whatItem:'Qu’est-ce que c’est ?',matchItems:'Associe les paires',example:'Exemple',newLetter:'NOUVELLE LETTRE',rule:'RÈGLE',form:'ÉCRITURE',listen:'Écouter',cont:'Continuer',check:'Vérifier',got:'Compris',which:n=>'Laquelle est '+n+' ?',whatName:'Quelle est cette lettre ?',hear:'Touche la lettre que tu entends',match:'Associe les lettres à leur nom',
   dotsQ:(c,p)=>c===0?'Laquelle n’a aucun point ?':'Laquelle a '+c+' point'+(c>1?'s':'')+(p==='a'?' au-dessus ?':' dessous ?'),
   dots:(c,p)=>c===0?'Aucun point.':c+' point'+(c>1?'s':'')+(p==='a'?' au-dessus.':' dessous.'),dotsShort:(c,p)=>c===0?'aucun point':c+(p==='a'?' dessus':' dessous'),
   ruleTitle:'Les points changent la lettre',ruleSub:'Des lettres semblables ne diffèrent que par le nombre et la place des points.',
   joinTitle:'Plus courte en début de mot',joinSub:'En début de mot, ces lettres se lient à la suivante et perdent leur queue. Les points restent en place.',initialQ:n=>'Comment s’écrit '+n+' en début de mot ?',
   noJoinTitle:'Ne se lie pas à la suivante',noJoinSub:'Ces lettres ne se lient jamais à la lettre suivante ; en début de mot elles gardent la même forme.',noJoinQ:'Laquelle ne se lie pas à la lettre suivante ?',
   praise:['Bravo !','Correct !','Très bien !','Parfait !'],matched:'Tout est associé.',streak:n=>n+' d’affilée',streakTag:n=>n+' d’affilée',remember:'À retenir',again:'Cette question reviendra dans un instant.',retry:'ENCORE UNE FOIS',
   matchHint:'Choisis une lettre et son nom.',done:'Leçon terminée !',learned:'Lettres de cette leçon',acc:'PRÉCISION',time:'TEMPS',best:'MEILLEURE SÉRIE',quitTitle:'Quitter la leçon ?',quitSub:'Ta progression dans cette leçon ne sera pas enregistrée.',quitStay:'Continuer',quitLeave:'Quitter',close:'Quitter la leçon',progress:'Progression de la leçon',replay:'Rejouer le son'},
  ar:{whichAyah:n=>'أيّها الآية '+n+'؟',fillQ:'أكمل الكلمة الناقصة',seqQ:'رتّب الآيات',buildMem:'رتّبها من الذاكرة',buildAyah:n=>'رتّب الآية '+n,correctWord:'الكلمة الصحيحة:',correctOrder:'الترتيب الصحيح:',ayahWord:'الآية',seqHint:'تأتي الآية ذات الرقم الأصغر أولًا',introEyebrow:'في هذا الدرس',startLesson:'ابدأ الدرس',countCards:n=>n+' بطاقات',countQs:n=>n+' أسئلة',countMin:n=>'~'+n+' د',howRead:'كيف يُقرأ هذا؟',meanQ:'ما معنى هذا؟',roleQ:'ما وظيفته؟',whichMean:n=>'أيّها يعني «'+n+'»؟',build:'رتّب الأجزاء',buildHint:'تُقرأ العربية من اليمين إلى اليسار',findQ:n=>'ابحث عن «'+n+'» في الآية',inQuran:'في القرآن',learnedItems:'ما تعلّمته',newItem:'جديد',caution:'انتبه',whatItem:'ما هذا؟',matchItems:'صِل بين الأزواج',example:'مثال',newLetter:'حرف جديد',rule:'قاعدة',form:'الكتابة',listen:'استمع',cont:'متابعة',check:'تحقّق',got:'فهمت',which:n=>'أيّها '+n+'؟',whatName:'ما اسم هذا الحرف؟',hear:'المس الحرف الذي تسمعه',match:'صِل كل حرف باسمه',
   dotsQ:(c,p)=>c===0?'أيّها بلا نقاط؟':'أيّها '+({1:'فيه نقطة واحدة',2:'فيه نقطتان',3:'فيه ثلاث نقاط'}[c])+(p==='a'?' فوقه؟':' تحته؟'),
   dots:(c,p)=>c===0?'بلا نقاط.':({1:'نقطة واحدة',2:'نقطتان',3:'ثلاث نقاط'}[c])+(p==='a'?' فوقه.':' تحته.'),dotsShort:(c,p)=>c===0?'بلا نقاط':({1:'نقطة',2:'نقطتان',3:'ثلاث نقاط'}[c])+(p==='a'?' فوق':' تحت'),
   ruleTitle:'النقاط تغيّر الحرف',ruleSub:'الحروف المتشابهة يميّزها عدد النقاط ومكانها.',
   joinTitle:'يقصر في أول الكلمة',joinSub:'في أول الكلمة تتصل هذه الحروف بما بعدها ويختفي ذيلها، وتبقى النقاط في مكانها.',initialQ:n=>'كيف يُكتب '+n+' في أول الكلمة؟',
   noJoinTitle:'لا يتصل بما بعده',noJoinSub:'هذه الحروف لا تتصل أبدًا بالحرف الذي يليها، فيبقى شكلها في أول الكلمة كما هو.',noJoinQ:'أيّها لا يتصل بالحرف الذي بعده؟',
   praise:['رائع!','صحيح!','أحسنت!','إصابة تامة!'],matched:'وصلت الجميع.',streak:n=>n+' إجابات صحيحة متتالية',streakTag:n=>n+' متتالية',remember:'تذكّر',again:'سيعود هذا السؤال بعد قليل.',retry:'حاول مجددًا',
   matchHint:'اختر الحرف واسمه معًا.',done:'اكتمل الدرس!',learned:'حروف هذا الدرس',acc:'الدقّة',time:'الوقت',best:'أطول سلسلة',quitTitle:'هل تريد مغادرة الدرس؟',quitSub:'لن يُحفظ تقدّمك في هذا الدرس.',quitStay:'تابع التعلّم',quitLeave:'مغادرة',close:'مغادرة الدرس',progress:'تقدّم الدرس',replay:'أعد تشغيل الصوت'}
 };
 const ICON={
  speak:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  close:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'
 };

 const INTRO_ICON={
  cards:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="6" width="12" height="14" rx="2.5"/><path d="M8.5 3.5h9a3 3 0 0 1 3 3v10"/></svg>',
  qs:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2.2-2.4 3.7M12 17.2h.01"/></svg>',
  time:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9.5 2.5h5"/></svg>'
 };
 const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
 const arText=(e,text)=>{e.textContent=text;e.lang='ar';e.dir='rtl';return e};

 /* Lesson plan: card → question for each letter, then a dots rule, a match, and the writing rules. */
 function buildSteps(letters,known,L,audioOk){
  const C=window.DEEN_ARABIC_LETTERS,get=id=>C.get(id),steps=[];
  const taught=[...known];
  const fam=id=>DESC[id]?.[0],dotKey=id=>(DESC[id]?.[1]||0)+(DESC[id]?.[2]||'');
  const others=(x,n,pool)=>{
   // Same-shape letters first: they are the ones learners confuse.
   const cand=shuffle(pool.filter(id=>id!==x));cand.sort((a,b)=>(fam(b)===fam(x))-(fam(a)===fam(x)));
   return cand.slice(0,n);
  };
  letters.forEach((x,i)=>{
   const twin=taught.filter(id=>fam(id)===fam(x)).pop();
   steps.push({k:'card',kind:'new',id:x,vs:twin||null});
   taught.push(x);
   const pool=taught.filter(id=>id!==x);
   if(pool.length)steps.push({k:'q',type:'pick',id:x,opts:shuffle([x,...others(x,i===0?1:Math.min(2,pool.length),taught)])});
   if(i>=1){
    if(audioOk(x)&&i%2===0)steps.push({k:'q',type:'listen',id:x,opts:shuffle([x,...others(x,2,taught)])});
    else steps.push({k:'q',type:'name',id:x,opts:shuffle([x,...others(x,Math.min(2,pool.length),letters.slice(0,i+1).concat(known))])});
   }
  });
  steps.push({k:'card',kind:'rule',ids:letters.slice(0,5)});
  steps.push({k:'q',type:'match',ids:shuffle(letters).slice(0,4)});
  // A dots question whose answer is the only option with that dot pattern.
  for(const x of shuffle(letters)){
   const rest=shuffle(taught.filter(id=>id!==x&&dotKey(id)!==dotKey(x)));
   const picks=[];for(const id of rest){if(picks.length===2)break;if(!picks.some(p=>dotKey(p)===dotKey(id)))picks.push(id)}
   if(picks.length===2){steps.push({k:'q',type:'dots',id:x,opts:shuffle([x,...picks])});break}
  }
  const joiners=letters.filter(id=>get(id).joinsNext),stay=letters.filter(id=>!get(id).joinsNext);
  if(joiners.length){
   const show=joiners.slice(0,3);
   steps.push({k:'card',kind:'join',ids:show});
   const x=shuffle(show)[0],pool=taught.filter(id=>get(id).joinsNext&&id!==x);
   if(pool.length)steps.push({k:'q',type:'initial',id:x,opts:shuffle([x,...others(x,Math.min(2,pool.length),pool)])});
  }
  if(stay.length){
   steps.push({k:'card',kind:'nojoin',ids:stay.slice(0,4)});
   const x=shuffle(stay)[0],pool=taught.filter(id=>get(id).joinsNext);
   if(pool.length>=1)steps.push({k:'q',type:'nojoin',id:x,opts:shuffle([x,...shuffle(pool).slice(0,2)])});
  }
  return steps;
 }

 function buildItemSteps(ids,known,tip,items,mode){
  const steps=[],taught=[...known];
  const parts=id=>(items?.[id]?.parts||[]).length>1,long=id=>(items?.[id]?.glyph||'').length>14;
  if(tip)steps.push({k:'card',kind:'intro'});
  ids.forEach((x,i)=>{
   steps.push({k:'card',kind:'new',id:x});taught.push(x);
   const pool=taught.filter(id=>id!==x);
   // This lesson's items first: they are the ones being told apart.
   const near=shuffle(pool.filter(id=>ids.includes(id))).concat(shuffle(pool.filter(id=>!ids.includes(id))));
   if(mode==='find'&&items?.[x]?.verse){steps.push({k:'q',type:'find',id:x});return}
   if(pool.length&&!long(x))steps.push({k:'q',type:'pick',id:x,opts:shuffle([x,...near.filter(id=>!long(id)).slice(0,i===0?1:2)])});
   if(parts(x))steps.push({k:'q',type:'build',id:x,parts:items[x].parts});
   else if(i>=1)steps.push({k:'q',type:'name',id:x,opts:shuffle([x,...shuffle(ids.slice(0,i)).slice(0,2)])});
  });
  if(tip?.mistake)steps.push({k:'card',kind:'tip'});
  if(!ids.some(long))steps.push({k:'q',type:'match',ids:shuffle(ids).slice(0,4)});
  const x=shuffle(ids)[0];steps.push({k:'q',type:'pick',id:x,opts:shuffle([x,...shuffle(taught.filter(id=>id!==x)).slice(0,2)])});
  return steps;
 }

 // Unit review: no teaching cards, about ten mixed questions over everything the unit taught.
 function buildReviewSteps(letters,items,audioOk){
  const steps=[];
  if(letters){
   const C=window.DEEN_ARABIC_LETTERS,fam=id=>DESC[id]?.[0];
   const near=(x,n)=>{const c=shuffle(letters.filter(id=>id!==x));c.sort((a,b)=>(fam(b)===fam(x))-(fam(a)===fam(x)));return c.slice(0,n)};
   shuffle(letters).slice(0,10).forEach(x=>{
    const kinds=['pick','name','pick'];if(audioOk(x))kinds.push('listen');if(C.get(x).joinsNext)kinds.push('initial');
    const type=kinds[Math.random()*kinds.length|0];
    const pool=letters.filter(id=>id!==x&&C.get(id).joinsNext);
    if(type==='initial'&&pool.length)steps.push({k:'q',type,id:x,opts:shuffle([x,...shuffle(pool).slice(0,2)])});
    else steps.push({k:'q',type:type==='initial'?'pick':type,id:x,opts:shuffle([x,...near(x,2)])});
   });
   steps.push({k:'q',type:'match',ids:shuffle(letters).slice(0,4)});
   return steps;
  }
  const ids=Object.keys(items),long=id=>(items[id].glyph||'').length>14;
  shuffle(ids).slice(0,10).forEach(x=>{
   const it=items[x],same=ids.filter(id=>id!==x&&items[id].group===it.group);
   if((it.parts||[]).length>1&&(long(x)||Math.random()<.6)){steps.push({k:'q',type:'build',id:x,parts:it.parts});return}
   if(same.length&&(long(x)||Math.random()<.5)){steps.push({k:'q',type:'name',id:x,ask:it.ask,opts:shuffle([x,...shuffle(same).slice(0,2)])});return}
   const pool=ids.filter(id=>id!==x&&!long(id));
   if(!long(x)&&pool.length)steps.push({k:'q',type:'pick',id:x,ask:it.ask,opts:shuffle([x,...shuffle(pool).slice(0,2)])});
  });
  const short=ids.filter(id=>!long(id));if(short.length>=3)steps.push({k:'q',type:'match',ids:shuffle(short).slice(0,4)});
  return steps;
 }

 let host=null,run=null,run_glyph=null;
 function close(){
  window.DEEN_ARABIC_LETTER_AUDIO?.stop?.();
  document.removeEventListener('keydown',onKey,true);
  host?.remove();host=null;run=null;document.documentElement.classList.remove('dac-open');
 }
 function onKey(e){if(e.key==='Escape'&&run){e.preventDefault();askQuit()}}
 function sound(kind){try{window.DEEN_DS_SOUND?.play?.(kind)}catch(_){}}

 function open(opts){
  const C=window.DEEN_ARABIC_LETTERS;if(!C||!opts||!(opts.letterIds?.length||opts.items?.length))return false;
  close();
  const lang=T[opts.lang]?opts.lang:'tr',L=T[lang],S=SHAPE[lang];
  // Item lessons (vowel marks, syllables, reading marks) bring their own glyphs, names and hints.
  const ITEMS=opts.items?Object.fromEntries([...(opts.knownItems||[]),...opts.items].map(x=>[x.id,x])):null;
  const lessonIds=opts.lessonIds||opts.letterIds||opts.items.map(x=>x.id);
  const AUDIO=window.DEEN_ARABIC_LETTER_AUDIO,audioOk=id=>!ITEMS&&!!AUDIO?.available?.(id);
  const name=id=>ITEMS?ITEMS[id]?.name||id:C.get(id)?.names?.[lang]||C.get(id)?.names?.en||id,glyph=id=>ITEMS?ITEMS[id]?.glyph||'':C.get(id)?.glyph||'';
  const dotsOf=id=>L.dots(DESC[id]?.[1]||0,DESC[id]?.[2]),dotsShort=id=>L.dotsShort(DESC[id]?.[1]||0,DESC[id]?.[2]);
  const play=id=>{if(audioOk(id))AUDIO.play(id)};
  // Ayahs show their number where a whole verse would not fit (intro chips, the finish list).
  const shortGlyph=id=>ITEMS?.[id]?.num?String(ITEMS[id].num):glyph(id).length>12?glyph(id).split(/\s+/)[0]:glyph(id);
  run_glyph=glyph;
  const steps=Array.isArray(opts.steps)&&opts.steps.length?opts.steps.map(x=>({...x})):opts.review?buildReviewSteps(ITEMS?null:opts.letterIds,ITEMS,audioOk):ITEMS?buildItemSteps(opts.items.map(x=>x.id),(opts.knownItems||[]).map(x=>x.id),opts.tip,ITEMS,opts.mode):buildSteps(opts.letterIds,(opts.known||[]).filter(id=>C.get(id)),L,audioOk);
  run={glyph:run_glyph,opts,queue:steps.map(s=>({s})),total:steps.length,done:0,first:0,asked:0,combo:0,best:0,missed:new Set(),started:Date.now(),cur:null,sel:null,phase:'',matchBad:false};
  const pet=(()=>{let p='owl';try{p=state.profile.companion||p}catch(_){}return String(p).replace(/[^a-z]/g,'')||'owl'})();
  const img=pose=>'assets/companions/'+pet+'/'+pet+'_'+pose+'.png';

  host=el('div','dac');host.id='dsArabicCards';host.setAttribute('role','dialog');host.setAttribute('aria-modal','true');host.dir=lang==='ar'?'rtl':'ltr';host.lang=lang;
  host.style.setProperty('--dac-ar',AR_FONT);
  host.innerHTML='<div class="dac-top"><button type="button" class="dac-x"></button><div class="dac-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"><i></i></div><span class="dac-combo"></span></div><div class="dac-body"></div><div class="dac-foot"><div class="dac-fb"><img alt=""><div><h3></h3><p></p></div><span class="dac-mini"></span></div><button type="button" class="dac-cta"></button></div>';
  const $=s=>host.querySelector(s),body=$('.dac-body'),foot=$('.dac-foot'),cta=$('.dac-cta');
  $('.dac-x').innerHTML=ICON.close;$('.dac-x').setAttribute('aria-label',L.close);$('.dac-x').addEventListener('click',askQuit);
  $('.dac-bar').setAttribute('aria-label',L.progress);
  $('.dac-fb img').addEventListener('error',e=>{if(!e.target.src.includes('/owl/'))e.target.src=e.target.src.replace(/companions\/[a-z]+\/[a-z]+_/,'companions/owl/owl_')});
  document.body.append(host);document.documentElement.classList.add('dac-open');document.addEventListener('keydown',onKey,true);

  const setBar=()=>{const p=Math.round(run.done/run.total*100);$('.dac-bar i').style.width=p+'%';$('.dac-bar').setAttribute('aria-valuenow',String(p))};
  const feedback=(state,title,text,mini,pose)=>{
   foot.classList.remove('is-ok','is-bad');if(state)foot.classList.add(state);
   $('.dac-fb h3').textContent=title||'';$('.dac-fb p').textContent=text||'';arText($('.dac-mini'),mini||'');if(pose)$('.dac-fb img').src=img(pose);
  };
  function next(){
   setBar();
   if(!run.queue.length)return finish();
   run.cur=run.queue.shift();run.sel=null;run.matchBad=false;feedback();
   const s=run.cur.s;body.textContent='';body.scrollTop=0;
   const box=el('div','dac-step');body.append(box);
   cta.className='dac-cta';
   if(s.k==='card'){renderCard(s,box);cta.disabled=false;cta.textContent=L.cont;run.phase='card';return}
   run.phase='ask';cta.textContent=L.check;cta.disabled=true;
   if(run.cur.retry)box.append(el('span','dac-tag is-rule',L.retry));
   const prompt=el('h2','dac-prompt');box.append(prompt);
   const ask=s.ask||opts.ask;
   if(s.type==='pick'&&ask==='ayah')prompt.textContent=L.whichAyah(ITEMS[s.id]?.num||'');
   else if(s.type==='pick')prompt.textContent=ask==='mean'?L.whichMean(name(s.id)):L.which(name(s.id));
   else if(s.type==='name')prompt.textContent=ITEMS?(ask==='read'?L.howRead:ask==='mean'?L.meanQ:ask==='role'?L.roleQ:L.whatItem):L.whatName;
   else if(s.type==='build')prompt.textContent=s.memory?L.buildMem:ITEMS?.[s.id]?.num?L.buildAyah(ITEMS[s.id].num):L.build;
   else if(s.type==='fill')prompt.textContent=L.fillQ;
   else if(s.type==='seq')prompt.textContent=L.seqQ;
   else if(s.type==='find')prompt.textContent=L.findQ(name(s.id));
   else if(s.type==='listen')prompt.textContent=L.hear;
   else if(s.type==='match')prompt.textContent=ITEMS?L.matchItems:L.match;
   else if(s.type==='dots')prompt.textContent=L.dotsQ(DESC[s.id]?.[1]||0,DESC[s.id]?.[2]);
   else if(s.type==='initial')prompt.textContent=L.initialQ(name(s.id));
   else if(s.type==='nojoin')prompt.textContent=L.noJoinQ;
   if(s.type==='fill')renderFill(s,box);else if(s.type==='seq')renderSeq(s,box);else if(s.type==='match')renderMatch(s,box);else if(s.type==='build')renderBuild(s,box);else if(s.type==='find')renderFind(s,box);else renderChoices(s,box);
  }
  function renderCard(s,box){
   box.append(el('span','dac-tag '+(s.kind==='new'?'is-new':'is-rule'),s.kind==='new'?(ITEMS?L.newItem:L.newLetter):s.kind==='rule'||s.kind==='intro'?L.rule:s.kind==='tip'?L.caution:L.form));
   const c=el('div','dac-card');box.append(c);
   if(ITEMS&&s.kind==='new'){
    const it=ITEMS[s.id];
    if(it.num){c.append(el('span','dac-num',String(it.num)),arText(el('div','dac-ayah'),it.glyph));if(it.name)c.append(el('div','dac-meal',it.name));if(it.hint)c.append(el('div','dac-src',it.hint))}
    else{c.append(arText(el('div','dac-big'+sizeClass(it.glyph)),it.glyph),el('div','dac-name',it.name));if(it.hint)c.append(el('div','dac-tip',it.hint))}
    if(it.audio){const b=el('button','dac-hear');b.type='button';b.innerHTML=ICON.speak;b.append(el('span','',L.listen));b.addEventListener('click',()=>playUrl(it.audio));c.append(b)}
    if(!it.num&&(it.parts||[]).length>1)c.append(arText(el('div','dac-parts'),it.parts.join('  +  ')));
    if(it.verse&&it.verse!==it.glyph){const v=el('div','dac-verse');const t=arText(el('p',''),'');const hi=it.mark||it.glyph,at=it.verse.indexOf(hi);
     if(at>=0){t.append(it.verse.slice(0,at),el('mark','',hi),it.verse.slice(at+hi.length))}else t.textContent=it.verse;
     v.append(t,el('small','',L.inQuran+(it.ref?' · '+it.ref:'')));c.append(v)}
    if(it.example&&it.example!==it.glyph){const vs=el('div','dac-vs');const d=el('div','');d.append(arText(el('b','is-hi'),it.example),el('span','',L.example));vs.append(d);c.append(vs)}
   }else if(s.kind==='intro'){
    const tp=opts.tip;c.append(el('div','dac-name is-sm',tp.title||''));if(tp.text)c.append(el('div','dac-tip',tp.text));
    const rows=el('div','dac-rows');for(const ex of tp.examples||[]){const r=el('div','');const t=el('span','');t.append(el('strong','',ex.caption||''));r.append(arText(el('b',''),ex.glyph||''),t);rows.append(r)}if(rows.childElementCount)c.append(rows);
   }else if(s.kind==='tip'){
    c.append(el('div','dac-tip is-lead',opts.tip.mistake));
   }else if(s.kind==='new'){
    c.append(arText(el('div','dac-big'),glyph(s.id)),el('div','dac-name',name(s.id)),el('div','dac-tip',S[DESC[s.id][0]]+' '+dotsOf(s.id)));
    if(audioOk(s.id)){const b=el('button','dac-hear');b.type='button';b.innerHTML=ICON.speak;b.append(el('span','',L.listen));b.addEventListener('click',()=>play(s.id));c.append(b);setTimeout(()=>{if(run&&run.cur?.s===s)play(s.id)},350)}
    if(s.vs){const vs=el('div','dac-vs');const side=(id,hi)=>{const d=el('div','');d.append(arText(el('b',hi?'is-hi':''),glyph(id)),el('span','',name(id)));return d};vs.append(side(s.vs,false),el('span','dac-ne','≠'),side(s.id,true));c.append(vs)}
   }else if(s.kind==='rule'){
    c.append(el('div','dac-name is-sm',L.ruleTitle),el('div','dac-tip',L.ruleSub));
    const rows=el('div','dac-rows');for(const id of s.ids){const r=el('div','');const t=el('span','');t.append(el('strong','',name(id)),el('em','',dotsShort(id)));r.append(arText(el('b',''),glyph(id)),t);rows.append(r)}c.append(rows);
   }else{
    c.append(el('div','dac-name is-sm',s.kind==='join'?L.joinTitle:L.noJoinTitle));
    const forms=el('div','dac-forms');
    for(const id of s.ids){const r=el('div','dac-form');r.append(arText(el('b',''),glyph(id)),el('span','dac-arrow',lang==='ar'?'←':'→'),arText(el('b','is-to'),C.get(id).forms.initial));forms.append(r)}
    c.append(forms,el('div','dac-tip',s.kind==='join'?L.joinSub:L.noJoinSub));
   }
  }
  let urlAudio=null;
  function playUrl(src){try{urlAudio?.pause?.();urlAudio=new Audio(src);urlAudio.play()?.catch?.(()=>{})}catch(_){}}
  // Missing word: the ayah with one word blanked, the words to choose from come from the text itself.
  function renderFill(s,box){
   const it=ITEMS[s.id],w=it.parts||String(it.glyph).split(/\s+/),shown=el('div','dac-fillshow');shown.lang='ar';shown.dir='rtl';
   w.forEach((x,i)=>{if(i===s.hide)shown.append(el('span','dac-blank'));else shown.append(x+' ')});box.append(shown);
   const g=el('div','dac-opts is-long');box.append(g);
   for(const word of s.opts){const b=el('button','dac-opt');b.type='button';b.dataset.id=word;arText(b,word);
    b.addEventListener('click',()=>{if(run.phase!=='ask')return;g.querySelectorAll('.dac-opt').forEach(x=>x.classList.toggle('is-sel',x===b));run.sel=word;cta.disabled=false;sound('select')});g.append(b)}
  }
  // Ayah order: whole ayahs as tiles, tapped into reading order.
  function renderSeq(s,box){
   const slots=el('div','dac-slots is-seq'),tiles=el('div','dac-tiles is-seq'),picked=[];box.append(slots,tiles,el('p','dac-hint',L.seqHint));
   let order=shuffle(s.ids);if(order.every((v,i)=>v===s.ids[i])&&order.length>1)order.reverse();
   const sync=()=>{run.sel=picked.length===s.ids.length?picked.slice():null;cta.disabled=!run.sel};
   for(const id of order){
    const b=el('button','dac-opt dac-tile is-ayah');b.type='button';arText(b,glyph(id));
    b.addEventListener('click',()=>{if(run.phase!=='ask'||b.classList.contains('is-used'))return;b.classList.add('is-used');sound('select');
     const c=el('button','dac-opt dac-tile is-ayah');c.type='button';arText(c,glyph(id));
     c.addEventListener('click',()=>{if(run.phase!=='ask')return;picked.splice(picked.indexOf(id),1);c.remove();b.classList.remove('is-used');sync()});
     slots.append(c);picked.push(id);sync()});
    tiles.append(b);
   }
  }
  function sizeClass(text){const n=String(text||'').length;return n>14?' is-long':n>5?' is-mid':''}
  function renderBuild(s,box){
   const it=ITEMS[s.id],slots=el('div','dac-slots'),tiles=el('div','dac-tiles'),picked=[];
   slots.dir='rtl';box.append(arText(el('div','dac-meaning'),''),slots,tiles,el('p','dac-hint',L.buildHint));
   box.querySelector('.dac-meaning').textContent=s.memory?'':it.name;box.querySelector('.dac-meaning').dir='auto';box.querySelector('.dac-meaning').lang=lang;
   let order=shuffle(it.parts.map((_,i)=>i));if(order.every((v,i)=>v===i)&&order.length>1)order.reverse();
   const sync=()=>{run.sel=picked.length===it.parts.length?picked.map(i=>it.parts[i]):null;cta.disabled=!run.sel};
   for(const i of order){
    const b=el('button','dac-opt dac-tile');b.type='button';arText(b,it.parts[i]);
    b.addEventListener('click',()=>{if(run.phase!=='ask'||b.classList.contains('is-used'))return;b.classList.add('is-used');sound('select');
     const c=el('button','dac-opt dac-tile');c.type='button';arText(c,it.parts[i]);
     c.addEventListener('click',()=>{if(run.phase!=='ask')return;picked.splice(picked.indexOf(i),1);c.remove();b.classList.remove('is-used');sync()});
     slots.append(c);picked.push(i);sync()});
    tiles.append(b);
   }
  }
  function renderFind(s,box){
   const it=ITEMS[s.id],g=el('div','dac-find');g.dir='rtl';box.append(g);
   it.verse.split(/\s+/).filter(Boolean).forEach((w,i)=>{
    const b=el('button','dac-opt dac-word');b.type='button';b.dataset.id=w===it.glyph?s.id:'w'+i;arText(b,w);
    b.addEventListener('click',()=>{if(run.phase!=='ask')return;g.querySelectorAll('.dac-opt').forEach(x=>x.classList.toggle('is-sel',x===b));run.sel=b.dataset.id;cta.disabled=false;sound('select')});
    g.append(b);
   });
   if(it.ref)box.append(el('p','dac-hint',L.inQuran+' · '+it.ref));
  }
  function renderChoices(s,box){
   if(s.type==='name')box.append(arText(el('div','dac-shown'+sizeClass(glyph(s.id))),glyph(s.id)));
   if(s.type==='listen'){const b=el('button','dac-listen');b.type='button';b.innerHTML=ICON.speak;b.setAttribute('aria-label',L.replay);b.addEventListener('click',()=>play(s.id));box.append(b);setTimeout(()=>{if(run&&run.cur?.s===s)play(s.id)},350)}
   const g=el('div','dac-opts'+(s.type==='name'?' is-text':'')+(s.type!=='name'&&s.opts.some(id=>glyph(id).length>5)?' is-long':''));box.append(g);
   for(const id of s.opts){
    const b=el('button','dac-opt');b.type='button';b.dataset.id=id;
    if(s.type==='name')b.textContent=name(id);else arText(b,s.type==='initial'?C.get(id).forms.initial:glyph(id));
    b.addEventListener('click',()=>{if(run.phase!=='ask')return;g.querySelectorAll('.dac-opt').forEach(x=>x.classList.toggle('is-sel',x===b));run.sel=id;cta.disabled=false;sound('select');if(s.type!=='listen')play(id)});
    g.append(b);
   }
  }
  function renderMatch(s,box){
   const g=el('div','dac-match');box.append(g);const right=shuffle(s.ids);let pickL=null,pickR=null,left=s.ids.length;
   s.ids.forEach((id,i)=>{
    for(const [val,side] of [[id,'L'],[right[i],'R']]){
     const b=el('button','dac-opt'+(side==='L'?' is-glyph':''));b.type='button';b.dataset.id=val;b.dataset.side=side;
     if(side==='L')arText(b,glyph(val));else b.textContent=name(val);
     b.addEventListener('click',()=>{
      if(run.phase!=='ask')return;
      g.querySelectorAll('[data-side="'+side+'"]').forEach(x=>x.classList.remove('is-sel'));b.classList.add('is-sel');
      if(side==='L'){pickL=b;play(val)}else pickR=b;
      if(!pickL||!pickR)return;
      const a=pickL,c=pickR;pickL=pickR=null;
      if(a.dataset.id===c.dataset.id){
       a.classList.replace('is-sel','is-right');c.classList.replace('is-sel','is-right');sound('select');
       setTimeout(()=>{a.classList.add('is-gone');c.classList.add('is-gone')},320);
       if(--left===0){run.sel='ok';setTimeout(check,420)}
      }else{
       run.matchBad=true;run.missed.add(a.dataset.id);sound('wrong');
       a.classList.replace('is-sel','is-wrong');c.classList.replace('is-sel','is-wrong');setTimeout(()=>{a.classList.remove('is-wrong');c.classList.remove('is-wrong')},450);
      }
     });
     g.append(b);
    }
   });
   box.append(el('p','dac-hint',L.matchHint));
  }
  function check(){
   const s=run.cur.s,ok=s.type==='fill'?run.sel===s.ans:s.type==='seq'?!!run.sel&&run.sel.join(',')===s.ids.join(','):s.type==='match'?!run.matchBad:s.type==='build'?!!run.sel&&run.sel.join('')===ITEMS[s.id].parts.join(''):run.sel===s.id;
   run.phase='feedback';
   const want=s.type==='fill'?s.ans:s.id;
   if(s.type!=='match'&&s.type!=='seq')body.querySelectorAll('.dac-opt').forEach(b=>{if(b.dataset.id===want)b.classList.add('is-right');else if(b.classList.contains('is-sel'))b.classList.add('is-wrong')});
   if(!run.cur.retry)run.asked++;
   opts.onAnswer?.(s.id||null,ok);
   cta.disabled=false;
   if(ok){
    if(!run.cur.retry)run.first++;run.combo++;run.best=Math.max(run.best,run.combo);run.done++;setBar();
    const tag=$('.dac-combo');tag.textContent=run.combo>=3?L.streakTag(run.combo):'';tag.classList.toggle('is-on',run.combo>=3);
    sound(run.combo===3?'combo3':run.combo===5?'combo5':run.combo===7?'combo7':'correct');
    feedback('is-ok',L.praise[Math.random()*L.praise.length|0],run.combo>=3?L.streak(run.combo):s.type==='match'?L.matched:'','', 'correct');
    cta.textContent=L.cont;
   }else{
    run.combo=0;$('.dac-combo').classList.remove('is-on');if(s.id)run.missed.add(s.id);sound('wrong');
    const hintId=s.id||s.ids?.[0]||[...run.missed].pop();
    const mini=s.type==='initial'?C.get(hintId).forms.initial:glyph(hintId).length>10?'':glyph(hintId);
    const text=s.type==='fill'?L.correctWord+' '+s.ans:s.type==='seq'?L.correctOrder+' '+s.ids.map(id=>ITEMS?.[id]?.num||'').join(', '):ITEMS?.[hintId]?.num?L.ayahWord+' '+ITEMS[hintId].num+(ITEMS[hintId].name?': '+ITEMS[hintId].name:''):ITEMS&&s.type==='build'?name(hintId)+': '+ITEMS[hintId].parts.join(' + '):ITEMS?name(hintId)+(ITEMS[hintId]?.hint?': '+ITEMS[hintId].hint:'.'):s.type==='nojoin'?name(hintId)+': '+L.noJoinTitle+'.':s.type==='initial'?name(hintId)+': '+L.joinTitle+'.':name(hintId)+': '+dotsOf(hintId);
    feedback('is-bad',L.remember,text+' '+L.again,mini,'try_again');
    cta.classList.add('is-bad');cta.textContent=L.got;
    run.queue.push({s,retry:true});
   }
  }
  function finish(){
   const sec=Math.round((Date.now()-run.started)/1000),acc=run.asked?Math.round(run.first/run.asked*100):100;
   const result={lessonIndex:opts.lessonIndex,missedIds:[...run.missed],questions:run.asked,firstTryCorrect:run.first,seconds:sec};
   try{opts.onDone?.(result)}catch(_){}
   sound('complete');
   body.textContent='';foot.remove();$('.dac-top').remove();host.classList.add('is-done');
   const d=el('div','dac-done');body.append(d);
   const party=el('img','dac-party');party.alt='';party.src=img('celebrate');party.addEventListener('error',()=>{if(!party.src.includes('/owl/'))party.src='assets/companions/owl/owl_celebrate.png'});
   const stats=el('div','dac-stats');
   for(const [cls,label,val] of [['a',L.acc,acc+'%'],['b',L.time,Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')],['c',L.best,String(run.best)]]){const s=el('div','dac-stat is-'+cls);s.append(el('small','',label),el('span','',val));stats.append(s)}
   const learned=el('div','dac-learned');
   for(const id of lessonIds.slice(0,8)){const b=el('button','');b.type='button';arText(b,shortGlyph(id));b.setAttribute('aria-label',name(id));b.addEventListener('click',()=>play(id));learned.append(b)}
   const btn=el('button','dac-cta',L.cont);btn.type='button';btn.addEventListener('click',()=>{close();try{opts.onClose?.()}catch(_){}});
   d.append(party,el('h2','',L.done),el('p','dac-sub',ITEMS?L.learnedItems:L.learned),learned,stats,btn);
   try{window.DEEN_DS_MOTION?.confetti?.(host)}catch(_){}
   btn.focus({preventScroll:true});
  }
  cta.addEventListener('click',()=>{
   if(!run)return;
   if(run.phase==='card'){run.done++;next();return}
   if(run.phase==='ask'){if(run.sel)check();return}
   if(run.phase==='feedback')next();
  });
  run.ask=()=>{
   if(host.classList.contains('is-intro')){close();try{opts.onExit?.()}catch(_){}return}
   if(host.querySelector('.dac-quit'))return;
   const q=el('div','dac-quit');q.setAttribute('role','alertdialog');
   const card=el('div','dac-quit-card');const stay=el('button','dac-cta',L.quitStay),leave=el('button','dac-leave',L.quitLeave);stay.type=leave.type='button';
   card.append(el('h3','',L.quitTitle),el('p','',L.quitSub),stay,leave);q.append(card);host.append(q);
   stay.addEventListener('click',()=>q.remove());leave.addEventListener('click',()=>{close();try{opts.onExit?.()}catch(_){}});stay.focus({preventScroll:true});
  };
  // Intro: what this lesson teaches, how long it is, then an animated launch into the first step.
  function intro(){
   host.classList.add('is-intro');
   const cards=steps.filter(x=>x.k==='card').length,qs=steps.length-cards,mins=Math.max(1,Math.round(steps.length*14/60));
   const box=el('div','dac-intro');
   const pet=el('div','dac-intro-pet');const pi=new Image();pi.alt='';pi.decoding='async';pi.src=img('lesson_idle');
   pi.addEventListener('error',()=>{if(!pi.src.includes('/owl/'))pi.src='assets/companions/owl/owl_lesson_idle.png'},{once:true});pet.append(pi);
   const chips=el('div','dac-intro-chips');
   lessonIds.slice(0,6).forEach((id,i)=>{const c=arText(el('span','dac-intro-chip'+(shortGlyph(id).length>5?' is-wide':'')),shortGlyph(id));c.style.setProperty('--i',String(i));chips.append(c)});
   const meta=el('div','dac-intro-meta');
   for(const [ico,label] of [...(cards?[['cards',L.countCards(cards)]]:[]),['qs',L.countQs(qs)],['time',L.countMin(mins)]]){const m=el('span','');m.innerHTML=INTRO_ICON[ico];m.append(el('b','',label));meta.append(m)}
   const go=el('button','dac-cta dac-intro-go',L.startLesson);go.type='button';
   box.append(pet,el('small','dac-intro-eyebrow',L.introEyebrow),el('h2','dac-intro-title',opts.title||''),opts.subtitle?el('p','dac-intro-sub',opts.subtitle):'',chips,meta,go);
   body.append(box);
   go.addEventListener('click',()=>{
    if(!host.classList.contains('is-intro')||host.classList.contains('is-launch'))return;
    run.started=Date.now();sound('start');host.classList.add('is-launch');
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(()=>{if(!run)return;host.classList.remove('is-intro','is-launch');host.classList.add('is-enter');box.remove();next();setTimeout(()=>host?.classList.remove('is-enter'),700)},reduce?0:420);
   });
   requestAnimationFrame(()=>go.focus({preventScroll:true}));
  }
  intro();
  return true;
 }
 function askQuit(){run?.ask?.()}
 window.DEEN_ARABIC_CARDS=Object.freeze({version:'ds-arabic-cards-1',open,close,isOpen:()=>!!host,phase:()=>host?(host.classList.contains('is-intro')?'intro':run?.phase||''):'',current:()=>run?.cur?{kind:run.cur.s.k,type:run.cur.s.type||run.cur.s.kind,id:run.cur.s.id||null,retry:!!run.cur.retry,parts:run.cur.s.parts||null,ans:run.cur.s.ans||null,seq:run.cur.s.ids&&run.glyph?run.cur.s.ids.map(run.glyph):null}:null,plan:(ids,known,lang)=>buildSteps(ids,known||[],T[lang]||T.tr,()=>false)});
})();
