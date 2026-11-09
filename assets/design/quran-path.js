/* Surah path: the surah area opens on one path. Each surah is a unit with short card-first lessons built
   from the recorded text: get to know the ayahs, learn the meaning (only where a verified meaning exists in
   the learner's language), memorise, ayah order and a surah review. Lessons run in the card layer and write
   their result into the surah engine's own progress (ayah learned, memorisation level, next review), so the
   existing practice tools below the path see the same progress. */
(()=>{
 'use strict';
 if(window.DEEN_QURAN_PATH)return;
 const STORE='deen_quran_path_v1';
 const T={
  tr:{memTip:['Ezber yöntemi','Ezber dört adımda kalıcı olur: ayeti oku ve anlamını hatırla, kelimeleri sırayla diz, gizlenen kelimeyi bul, en sonda ayeti ezberden kur.'],title:'Sure Yolu',sub:'Ayet ayet oku, anla, ezberle.',learned:'Öğrenilen ayet',today:'Bugün',due:n=>n+' ayet tekrar bekliyor',cont:'Kaldığın yer: ',surah:'SURE',ayahs:n=>n+' ayet',
   know:(a,b)=>'Tanı · Ayet '+(a===b?a:a+'–'+b),meaning:'Anlamını öğren',mem:(a,b)=>'Ezberle · Ayet '+(a===b?a:a+'–'+b),order:'Ayet sırası',review:'Sure tekrarı',
   done:'Tamamlandı',ready:'Başlamaya hazır',lockPrev:'Önceki dersi tamamla',lockSurah:'Önceki surenin tanı derslerini bitir',tools:'Pratik ve araçlar',toolsSub:'Testler, challenge’lar ve ezber araçları',
   subKnow:'Ayetleri oku ve tanı.',subMeaning:'Ayetleri anlamlarıyla eşleştir.',subMem:'Diz, gizleneni bul, ezberden kur.',subOrder:'Ayetleri doğru sıraya koy.',subReview:'Surenin tamamından karışık sorular.',source:'Elmalılı Hamdi Yazır meali (1938)',go:'BAŞLA'},
  en:{memTip:['How to memorise','Memorising sticks in four steps: read the ayah and recall its meaning, put its words in order, find the hidden word, and finally build the ayah from memory.'],title:'Surah Path',sub:'Read, understand and memorise, ayah by ayah.',learned:'Ayahs learned',today:'Today',due:n=>n+' ayahs due for review',cont:'Continue with ',surah:'SURAH',ayahs:n=>n+' ayahs',
   know:(a,b)=>'Get to know · Ayah'+(a===b?' '+a:'s '+a+'–'+b),meaning:'Learn the meaning',mem:(a,b)=>'Memorise · Ayah'+(a===b?' '+a:'s '+a+'–'+b),order:'Ayah order',review:'Surah review',
   done:'Completed',ready:'Ready to start',lockPrev:'Complete the previous lesson',lockSurah:'Finish the previous surah’s first lessons',tools:'Practice and tools',toolsSub:'Tests, challenges and memorisation tools',
   subKnow:'Read the ayahs and get to know them.',subMeaning:'Match the ayahs with their meaning.',subMem:'Build, find the hidden word, then build from memory.',subOrder:'Put the ayahs in the right order.',subReview:'Mixed questions from the whole surah.',source:'Pickthall (1930)',go:'START'},
  de:{memTip:['So lernst du auswendig','Auswendiglernen gelingt in vier Schritten: Lies den Vers, setze seine Wörter in die richtige Reihenfolge, finde das versteckte Wort und setze den Vers zuletzt aus dem Gedächtnis zusammen.'],title:'Suren-Pfad',sub:'Lies, verstehe und lerne auswendig, Vers für Vers.',learned:'Gelernte Verse',today:'Heute',due:n=>n+' Verse zur Wiederholung',cont:'Weiter mit ',surah:'SURE',ayahs:n=>n+' Verse',
   know:(a,b)=>'Kennenlernen · Vers'+(a===b?' '+a:'e '+a+'–'+b),meaning:'Bedeutung lernen',mem:(a,b)=>'Auswendig lernen · Vers'+(a===b?' '+a:'e '+a+'–'+b),order:'Versreihenfolge',review:'Sure wiederholen',
   done:'Abgeschlossen',ready:'Bereit',lockPrev:'Vorherige Lektion abschließen',lockSurah:'Schließe zuerst die ersten Lektionen der vorherigen Sure ab',tools:'Übung und Werkzeuge',toolsSub:'Tests, Challenges und Werkzeuge zum Auswendiglernen',
   subKnow:'Lies die Verse und lerne sie kennen.',subMeaning:'Ordne die Verse ihrer Bedeutung zu.',subMem:'Zusammensetzen, verstecktes Wort finden, dann aus dem Gedächtnis.',subOrder:'Bringe die Verse in die richtige Reihenfolge.',subReview:'Gemischte Fragen aus der ganzen Sure.',source:'',go:'START'},
  fr:{memTip:['Comment mémoriser','La mémorisation tient en quatre étapes : lis le verset, remets ses mots dans l’ordre, trouve le mot caché, puis reconstitue le verset de mémoire.'],title:'Parcours des sourates',sub:'Lis, comprends et mémorise, verset par verset.',learned:'Versets appris',today:'Aujourd’hui',due:n=>n+' versets à réviser',cont:'Continuer avec ',surah:'SOURATE',ayahs:n=>n+' versets',
   know:(a,b)=>'Découvrir · verset'+(a===b?' '+a:'s '+a+'–'+b),meaning:'Apprendre le sens',mem:(a,b)=>'Mémoriser · verset'+(a===b?' '+a:'s '+a+'–'+b),order:'Ordre des versets',review:'Révision de la sourate',
   done:'Terminée',ready:'Prête',lockPrev:'Termine la leçon précédente',lockSurah:'Termine d’abord les premières leçons de la sourate précédente',tools:'Pratique et outils',toolsSub:'Tests, défis et outils de mémorisation',
   subKnow:'Lis les versets et apprends à les reconnaître.',subMeaning:'Associe les versets à leur sens.',subMem:'Reconstitue, trouve le mot caché, puis de mémoire.',subOrder:'Remets les versets dans le bon ordre.',subReview:'Questions variées sur toute la sourate.',source:'',go:'COMMENCER'},
  ar:{memTip:['طريقة الحفظ','يثبت الحفظ في أربع خطوات: اقرأ الآية، ورتّب كلماتها، وأوجد الكلمة المخفية، ثم رتّب الآية من الذاكرة.'],title:'مسار السور',sub:'اقرأ وافهم واحفظ، آيةً آية.',learned:'الآيات المتعلَّمة',today:'اليوم',due:n=>n+' آيات للمراجعة',cont:'تابع مع ',surah:'السورة',ayahs:n=>n+' آيات',
   know:(a,b)=>'تعرّف · '+(a===b?'الآية '+a:'الآيات '+a+'–'+b),meaning:'تعلّم المعنى',mem:(a,b)=>'احفظ · '+(a===b?'الآية '+a:'الآيات '+a+'–'+b),order:'ترتيب الآيات',review:'مراجعة السورة',
   done:'مكتمل',ready:'جاهز للبدء',lockPrev:'أكمل الدرس السابق',lockSurah:'أكمل الدروس الأولى في السورة السابقة',tools:'التدريب والأدوات',toolsSub:'اختبارات وتحديات وأدوات الحفظ',
   subKnow:'اقرأ الآيات وتعرّف عليها.',subMeaning:'صِل الآيات بمعانيها.',subMem:'رتّب، وأوجد الكلمة المخفية، ثم رتّب من الذاكرة.',subOrder:'رتّب الآيات ترتيبًا صحيحًا.',subReview:'أسئلة متنوعة من السورة كلها.',source:'',go:'ابدأ'}
 };
 // Levels, surah exam, stars, badges and the exam reward card.
 const X={
  tr:{lvl:['Kolay','Orta','İleri'],levelTag:n=>'SEVİYE '+n,levelCount:(a,b)=>a+' / '+b+' sure',exam:'Sure sınavı',examSub:'Tüm ayetlerden final sınavı. %80 ve üstü üçüncü yıldızı kazandırır.',
   stars:['Tanı derslerini bitir','Ezber derslerini bitir','Sınavı %80 ile geç'],crownTip:'Kusursuz sınav',badgesTitle:'Rozetler',
   badge:{first:['İlk adım','İlk dersini tamamla'],surah1:['İlk sure','Bir sureyi baştan sona bitir'],surah5:['Beş sure','Beş sureyi bitir'],crown:['Kusursuz','Sure sınavında %95 ve üstü al'],ayah100:['100 ayet','100 ayet öğren']},
   lvlBadge:n=>[n+' seviye','Bu seviyedeki bütün sureleri bitir'],
   reward:{title:'Sure sınavı tamamlandı',acc:'Doğruluk',stars:'Yıldız',crown:'Kusursuz! Taç kazandın.',newBadge:'Yeni rozet',cont:'Devam',again:'%80 ve üstü üçüncü yıldızı getirir. Tekrar deneyebilirsin.'},
   srcTr:'Elmalılı Hamdi Yazır meali (1938)',srcEn:'Pickthall (1930)',grp:(a,b)=>'Ayet '+a+'–'+b+' birlikte çevrilmiştir',more:'Daha fazla araç',less:'Daha az göster',prog:{title:'İlerleme',sub:'Hedefler, yıldızlar ve rozetler',level:n=>'Seviye '+n,overall:'Genel ilerleme',learned:'Öğrenilen ayet',goals:'Bugünkü hedefler',goalAyahs:'Ayet',goalMinutes:'Dakika',streak:n=>n+' gün seri',pace:'Çalışma temposu',presets:['Sakin','Dengeli','Yoğun'],presetSub:(a,m,d)=>a+' ayet · '+m+' dk · haftada '+d+' gün',solid:'Sağlam ezber',due:'Tekrar bekliyor',stars:'Yıldız',surahs:'Sureler',close:'Kapat'},rev:{title:'Tekrar',empty:'Bugün için tekrar kalmadı',emptySub:'Yeni ayetler öğrendikçe tekrar zamanları burada belirir.',arena:'Soru Arenası',close:'Kapat'},audio:{listen:'Sureyi dinle',pause:'Duraklat',reciter:'Kıraat',fail:'Ses yüklenemedi. İnternet bağlantısı gerekir.'}},
  en:{lvl:['Easy','Medium','Advanced'],levelTag:n=>'LEVEL '+n,levelCount:(a,b)=>a+' / '+b+' surahs',exam:'Surah exam',examSub:'A final test on every ayah. 80% or more earns the third star.',
   stars:['Finish the get-to-know lessons','Finish the memorising lessons','Pass the exam with 80%'],crownTip:'Flawless exam',badgesTitle:'Badges',
   badge:{first:['First step','Complete your first lesson'],surah1:['First surah','Finish a surah from start to end'],surah5:['Five surahs','Finish five surahs'],crown:['Flawless','Score 95% or more in a surah exam'],ayah100:['100 ayahs','Learn 100 ayahs']},
   lvlBadge:n=>[n+' level','Finish every surah of this level'],
   reward:{title:'Surah exam complete',acc:'Accuracy',stars:'Stars',crown:'Flawless! You earned a crown.',newBadge:'New badge',cont:'Continue',again:'80% or more brings the third star. You can try again.'},
   srcTr:'Elmalılı Hamdi Yazır (1938)',srcEn:'Pickthall (1930)',grp:(a,b)=>'Ayahs '+a+'–'+b+' are translated together',more:'More tools',less:'Show less',prog:{title:'Progress',sub:'Goals, stars and badges',level:n=>'Level '+n,overall:'Overall progress',learned:'Ayahs learned',goals:'Today’s goals',goalAyahs:'Ayahs',goalMinutes:'Minutes',streak:n=>n+'-day streak',pace:'Study pace',presets:['Relaxed','Balanced','Intense'],presetSub:(a,m,d)=>a+' ayahs · '+m+' min · '+d+' days a week',solid:'Solid memory',due:'Due for review',stars:'Stars',surahs:'Surahs',close:'Close'},rev:{title:'Review',empty:'Nothing to review today',emptySub:'As you learn new ayahs, their review times show up here.',arena:'Question Arena',close:'Close'},audio:{listen:'Listen to the surah',pause:'Pause',reciter:'Recitation',fail:'The recitation could not load. An internet connection is needed.'}},
  de:{lvl:['Leicht','Mittel','Fortgeschritten'],levelTag:n=>'STUFE '+n,levelCount:(a,b)=>a+' / '+b+' Suren',exam:'Suren-Prüfung',examSub:'Eine Abschlussprüfung zu allen Versen. Ab 80 % gibt es den dritten Stern.',
   stars:['Kennenlern-Lektionen abschließen','Auswendig-Lektionen abschließen','Prüfung mit 80 % bestehen'],crownTip:'Makellose Prüfung',badgesTitle:'Abzeichen',
   badge:{first:['Erster Schritt','Schließe deine erste Lektion ab'],surah1:['Erste Sure','Schließe eine Sure von Anfang bis Ende ab'],surah5:['Fünf Suren','Schließe fünf Suren ab'],crown:['Makellos','Erreiche in einer Suren-Prüfung 95 % oder mehr'],ayah100:['100 Verse','Lerne 100 Verse']},
   lvlBadge:n=>['Stufe '+n,'Schließe alle Suren dieser Stufe ab'],
   reward:{title:'Suren-Prüfung abgeschlossen',acc:'Genauigkeit',stars:'Sterne',crown:'Makellos! Du hast eine Krone verdient.',newBadge:'Neues Abzeichen',cont:'Weiter',again:'Ab 80 % gibt es den dritten Stern. Du kannst es noch einmal versuchen.'},
   srcTr:'Elmalılı Hamdi Yazır (1938)',srcEn:'Pickthall (1930)',grp:(a,b)=>'Verse '+a+'–'+b+' sind gemeinsam übersetzt',more:'Weitere Werkzeuge',less:'Weniger anzeigen',prog:{title:'Fortschritt',sub:'Ziele, Sterne und Abzeichen',level:n=>'Stufe '+n,overall:'Gesamtfortschritt',learned:'Gelernte Verse',goals:'Ziele für heute',goalAyahs:'Verse',goalMinutes:'Minuten',streak:n=>n+' Tage in Folge',pace:'Lerntempo',presets:['Ruhig','Ausgewogen','Intensiv'],presetSub:(a,m,d)=>a+' Verse · '+m+' Min. · '+d+' Tage pro Woche',solid:'Sicher auswendig',due:'Zur Wiederholung fällig',stars:'Sterne',surahs:'Suren',close:'Schließen'},rev:{title:'Wiederholung',empty:'Heute ist nichts zu wiederholen',emptySub:'Sobald du neue Verse lernst, erscheinen ihre Wiederholungen hier.',arena:'Fragenarena',close:'Schließen'},audio:{listen:'Sure anhören',pause:'Pause',reciter:'Rezitation',fail:'Die Rezitation konnte nicht geladen werden. Internet erforderlich.'}},
  fr:{lvl:['Facile','Moyen','Avancé'],levelTag:n=>'NIVEAU '+n,levelCount:(a,b)=>a+' / '+b+' sourates',exam:'Examen de la sourate',examSub:'Un test final sur tous les versets. 80 % ou plus donne la troisième étoile.',
   stars:['Termine les leçons de découverte','Termine les leçons de mémorisation','Réussis l’examen avec 80 %'],crownTip:'Examen sans faute',badgesTitle:'Badges',
   badge:{first:['Premier pas','Termine ta première leçon'],surah1:['Première sourate','Termine une sourate du début à la fin'],surah5:['Cinq sourates','Termine cinq sourates'],crown:['Sans faute','Obtiens 95 % ou plus à un examen de sourate'],ayah100:['100 versets','Apprends 100 versets']},
   lvlBadge:n=>['Niveau '+n,'Termine toutes les sourates de ce niveau'],
   reward:{title:'Examen de la sourate terminé',acc:'Précision',stars:'Étoiles',crown:'Sans faute ! Tu as gagné une couronne.',newBadge:'Nouveau badge',cont:'Continuer',again:'80 % ou plus donne la troisième étoile. Tu peux réessayer.'},
   srcTr:'Elmalılı Hamdi Yazır (1938)',srcEn:'Pickthall (1930)',grp:(a,b)=>'Versets '+a+'–'+b+' traduits ensemble',more:'Plus d’outils',less:'Voir moins',prog:{title:'Progression',sub:'Objectifs, étoiles et badges',level:n=>'Niveau '+n,overall:'Progression globale',learned:'Versets appris',goals:'Objectifs du jour',goalAyahs:'Versets',goalMinutes:'Minutes',streak:n=>n+' jours d’affilée',pace:'Rythme d’étude',presets:['Tranquille','Équilibré','Intense'],presetSub:(a,m,d)=>a+' versets · '+m+' min · '+d+' jours par semaine',solid:'Mémorisé solidement',due:'À réviser',stars:'Étoiles',surahs:'Sourates',close:'Fermer'},rev:{title:'Révision',empty:'Rien à réviser aujourd’hui',emptySub:'Au fil des nouveaux versets, leurs révisions apparaîtront ici.',arena:'Arène des questions',close:'Fermer'},audio:{listen:'Écouter la sourate',pause:'Pause',reciter:'Récitation',fail:'La récitation n’a pas pu se charger. Une connexion internet est nécessaire.'}},
  ar:{lvl:['سهل','متوسط','متقدّم'],levelTag:n=>'المستوى '+n,levelCount:(a,b)=>a+' / '+b+' سور',exam:'اختبار السورة',examSub:'اختبار نهائي في جميع آيات السورة. تحصل على النجمة الثالثة بنسبة 80٪ أو أكثر.',
   stars:['أكمل دروس التعرّف','أكمل دروس الحفظ','اجتز الاختبار بنسبة 80٪'],crownTip:'اختبار بلا أخطاء',badgesTitle:'الأوسمة',
   badge:{first:['الخطوة الأولى','أكمل درسك الأول'],surah1:['السورة الأولى','أكمل سورة من أولها إلى آخرها'],surah5:['خمس سور','أكمل خمس سور'],crown:['بلا أخطاء','احصل على 95٪ أو أكثر في اختبار سورة'],ayah100:['100 آية','تعلّم 100 آية']},
   lvlBadge:n=>['مستوى '+n,'أكمل جميع سور هذا المستوى'],
   reward:{title:'اكتمل اختبار السورة',acc:'الدقة',stars:'النجوم',crown:'بلا أخطاء! نلت تاجًا.',newBadge:'وسام جديد',cont:'متابعة',again:'تحصل على النجمة الثالثة بنسبة 80٪ أو أكثر. يمكنك المحاولة مرة أخرى.'},
   srcTr:'ترجمة إلماليلي حمدي يازر (١٩٣٨) إلى التركية',srcEn:'Pickthall (1930)',grp:(a,b)=>'الآيات '+a+'–'+b+' تُترجَم معًا',more:'المزيد من الأدوات',less:'عرض أقل',prog:{title:'التقدّم',sub:'الأهداف والنجوم والأوسمة',level:n=>'المستوى '+n,overall:'التقدّم العام',learned:'الآيات المتعلَّمة',goals:'أهداف اليوم',goalAyahs:'آيات',goalMinutes:'دقائق',streak:n=>n+' أيام متتالية',pace:'وتيرة الدراسة',presets:['هادئة','متوازنة','مكثّفة'],presetSub:(a,m,d)=>a+' آيات · '+m+' د · '+d+' أيام أسبوعيًا',solid:'حفظ راسخ',due:'بانتظار المراجعة',stars:'النجوم',surahs:'السور',close:'إغلاق'},rev:{title:'المراجعة',empty:'لا شيء للمراجعة اليوم',emptySub:'كلما تعلّمت آيات جديدة ظهرت مراجعتها هنا.',arena:'ساحة الأسئلة',close:'إغلاق'},audio:{listen:'استمع إلى السورة',pause:'إيقاف مؤقت',reciter:'التلاوة',fail:'تعذّر تحميل التلاوة. يلزم اتصال بالإنترنت.'}}
 };
 const x=()=>X[lang()]||X.en;
 // Question arena strings.
 const AX={
  tr:{title:'Soru Arenası',sub:'Zorluğunu seç, sorulara başla.',lv:[['Kolay','Anlamı bul, doğru ayeti seç'],['Orta','Eksik kelime ve ayet sırası'],['Zor','Kelimeleri diz, sırala, tamamla']],q:n=>n+' soru',best:n=>'En iyi %'+n,scopeLearned:'Öğrendiklerim',scopeAll:'Tüm sureler',pool:n=>n+' ayet havuzda',combo:{3:'3 üst üste!',5:'5 üst üste! Durdurulamaz!'},back:'Geri',few:'Önce birkaç ayet öğren'},
  en:{title:'Question Arena',sub:'Pick your level and start answering.',lv:[['Easy','Find the meaning, pick the right ayah'],['Medium','Missing words and ayah order'],['Hard','Build the words, order, complete']],q:n=>n+' questions',best:n=>'Best '+n+'%',scopeLearned:'What I learned',scopeAll:'All surahs',pool:n=>n+' ayahs in the pool',combo:{3:'3 in a row!',5:'5 in a row! Unstoppable!'},back:'Back',few:'Learn a few ayahs first'},
  de:{title:'Fragenarena',sub:'Wähle dein Level und leg los.',lv:[['Leicht','Bedeutung finden, richtigen Vers wählen'],['Mittel','Fehlende Wörter und Versreihenfolge'],['Schwer','Wörter bauen, ordnen, ergänzen']],q:n=>n+' Fragen',best:n=>'Bestwert '+n+' %',scopeLearned:'Was ich gelernt habe',scopeAll:'Alle Suren',pool:n=>n+' Verse im Pool',combo:{3:'3 richtig in Folge!',5:'5 in Folge! Nicht zu stoppen!'},back:'Zurück',few:'Lerne zuerst ein paar Verse'},
  fr:{title:'Arène des questions',sub:'Choisis ton niveau et lance-toi.',lv:[['Facile','Trouver le sens, choisir le bon verset'],['Moyen','Mots manquants et ordre des versets'],['Difficile','Remettre les mots, ordonner, compléter']],q:n=>n+' questions',best:n=>'Meilleur '+n+' %',scopeLearned:'Ce que j’ai appris',scopeAll:'Toutes les sourates',pool:n=>n+' versets dans la réserve',combo:{3:'3 d’affilée !',5:'5 d’affilée ! Inarrêtable !'},back:'Retour',few:'Apprends d’abord quelques versets'},
  ar:{title:'ساحة الأسئلة',sub:'اختر مستواك وابدأ الإجابة.',lv:[['سهل','اعثر على المعنى واختر الآية الصحيحة'],['متوسط','الكلمات الناقصة وترتيب الآيات'],['صعب','رتّب الكلمات وأكمل']],q:n=>n+' أسئلة',best:n=>'الأفضل '+n+'٪',scopeLearned:'ما تعلّمته',scopeAll:'كل السور',pool:n=>n+' آية في المجموعة',combo:{3:'٣ متتالية!',5:'٥ متتالية! لا يُوقَف!'},back:'رجوع',few:'تعلّم بعض الآيات أولًا'}
 };
 const ax=()=>AX[lang()]||AX.en;

 function lang(){let c='';try{c=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}c=String(c||document.documentElement.lang||'tr').slice(0,2).toLowerCase();return T[c]?c:'tr'}
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n};
 const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
 // Even groups of at most n (7 ayahs in threes: 3, 2, 2), so no lesson is left with a single ayah.
 const chunk=(a,n)=>{const k=Math.ceil(a.length/n),out=[];let i=0;for(let g=0;g<k;g++){const size=Math.ceil((a.length-i)/(k-g));out.push(a.slice(i,i+size));i+=size}return out};
 const ARABIC=/[ء-يٱ-ۓ]/;
 const readStore=()=>{try{const d=JSON.parse(localStorage.getItem(STORE)||'null');return d&&typeof d==='object'?d:{}}catch(_){return {}}};
 const doneIds=()=>{const d=readStore();return Array.isArray(d.done)?d.done:[]};
 function writeStore(mutate){
  const d=readStore();d.schema=2;d.done=Array.isArray(d.done)?d.done:[];d.ayah=d.ayah&&typeof d.ayah==='object'?d.ayah:{};d.exam=d.exam&&typeof d.exam==='object'?d.exam:{};
  mutate(d);d.updatedAt=Date.now();try{localStorage.setItem(STORE,JSON.stringify(d))}catch(_){}
 }
 function markDone(id){writeStore(d=>{if(!d.done.includes(id))d.done.push(id)})}
 const examOf=sid=>readStore().exam?.[sid]||{};
 const Q=()=>window.DEEN_QURAN,C=()=>window.DEEN_QURAN_CONTENT;
 const PACK=()=>window.DEEN_SURAH_PACK;
 const packSurah=sid=>PACK()?.surahs?.find(s=>s.id===sid)||null;
 // Level by length: up to 8 ayahs easy, up to 15 medium, longer advanced. The extra surahs carry their own level.
 const levelOf=s=>s.level||(s.ayahs<=8?1:s.ayahs<=15?2:3);
 // Easy to hard: by level, then by length (Fatiha stays first), ties keep the engine's own order.
 const surahs=()=>{
  const list=[
   ...(Q()?.surahs||[]).filter(s=>s&&s.id&&s.ayahs).map(s=>({...s,level:levelOf(s)})),
   ...(PACK()?.surahs||[]).map(s=>({id:s.id,name:(lang()==='ar'&&s.nameAr)||s.name,ayahs:s.ayahs.length,ext:true,level:levelOf(s)}))
  ];
  const at=new Map(list.map((s,i)=>[s.id,i]));
  return list.sort((a,b)=>a.level-b.level||(a.id==='fatiha'?-1:b.id==='fatiha'?1:0)||a.ayahs-b.ayahs||at.get(a.id)-at.get(b.id));
 };
 // The extra surahs are not in the old surah engine, so their ayah progress lives in this path's own store.
 const progressOf=(sid,n)=>{
  if(packSurah(sid))return readStore().ayah?.[sid+':'+n]||{};
  try{return Q().state().progress.surahs[sid].ayahs[n]||{}}catch(_){return {}}
 };
 // The text is kept exactly as published, bismillah included; on screen it is not part of the first ayah (it is not, in the
 // mushaf, outside Fatiha), so it is left out of what is shown, read and asked.
 const skel=t=>t.normalize('NFKD').replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g,'').replace(/[\u0671\u0622\u0623\u0625]/g,'\u0627');
 const BSM=skel('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
 function noBismillah(t){const w=t.trim().split(/\s+/);return w.length>4&&skel(w.slice(0,4).join(' '))===BSM?w.slice(4).join(' '):t}
 // The recorded ayahs of one surah as card items; the meaning only where a verified one exists.
 function itemsOf(sid,code){
  const ps=packSurah(sid);
  if(ps){
   const xt=x();
   return ps.ayahs.map(a=>{
    const meal=code==='tr'?a.tr:code==='en'?a.en:'';
    const ar=a.n===1?noBismillah(a.ar):a.ar,grp=code==='tr'&&a.trGroup?' · '+xt.grp(a.trGroup[0],a.trGroup[1]):'';
    return {id:sid+':'+a.n,num:a.n,glyph:ar,name:meal,hint:meal?(code==='tr'?xt.srcTr+grp:xt.srcEn):'',audio:a.audio||ps.audio?.chapter||'',audioLabel:a.audio?'':xt.audio.listen,audioPause:xt.audio.pause,audioCredit:a.audio||!ps.audio?'':xt.audio.reciter+': '+ps.audio.credit.reciter+' · '+ps.audio.credit.license,parts:ar.split(/\s+/).filter(w=>ARABIC.test(w))};
   });
  }
  const rows=C()?.getSurah?.(sid)||[],tr=window.DEEN_QURAN_LEARNING_TRANSLATION,t=T[code];
  return rows.map(r=>{
   const n=r.ayah_number,text=String(r.arabic?.text||'');
   let meal='';try{meal=(code==='tr'||code==='en')?(tr?.get?.(r)?.text||''):''}catch(_){}
   const audio=r.recitation?.verification_status==='production_ready'&&r.recitation?.rights_status==='cleared'?r.recitation.audio_url:'';
   return {id:sid+':'+n,num:n,glyph:text,name:meal,hint:meal?t.source:'',audio,parts:text.split(/\s+/).filter(w=>ARABIC.test(w))};
  }).filter(x=>x.glyph);
 }
 // Lessons of a surah, in order. Ayahs are introduced four at a time and memorised three at a time.
 function plan(sid,count,code){
  const t=T[code],nums=Array.from({length:count},(_,i)=>i+1),hasMeal=code==='tr'||code==='en',out=[];
  for(const g of chunk(nums,4))out.push({id:sid+':know:'+g[0],kind:'know',ayahs:g,title:t.know(g[0],g[g.length-1]),sub:t.subKnow,icon:'read'});
  if(hasMeal)out.push({id:sid+':meaning',kind:'meaning',ayahs:nums,title:t.meaning,sub:t.subMeaning,icon:'mean'});
  for(const g of chunk(nums,3))out.push({id:sid+':mem:'+g[0],kind:'mem',ayahs:g,title:t.mem(g[0],g[g.length-1]),sub:t.subMem,icon:'mem'});
  if(count>=3)out.push({id:sid+':order',kind:'order',ayahs:nums,title:t.order,sub:t.subOrder,icon:'order'});
  out.push({id:sid+':review',kind:'review',ayahs:nums,title:x().exam,sub:x().examSub,icon:'crown'});
  return out;
 }
 // Earlier work in the surah engine counts: ayahs already learned or memorised there unlock the same lessons.
 function lessonDone(sid,l,done){
  if(done.includes(l.id))return true;
  if(l.kind==='know')return l.ayahs.every(n=>!!progressOf(sid,n).completedAt);
  if(l.kind==='mem')return l.ayahs.every(n=>(progressOf(sid,n).memorizationLevel||0)>=3);
  return false;
 }
 function steps(sid,l,items,code){
  const id=n=>sid+':'+n,byId=Object.fromEntries(items.map(x=>[x.id,x])),all=items.map(x=>x.num),out=[];
  const hasMeal=!!items[0]?.name;
  const wordsOf=n=>byId[id(n)]?.parts||[];
  const fill=n=>{const w=wordsOf(n);if(w.length<2)return null;const hide=Math.random()*w.length|0,ans=w[hide];
   const pool=[...new Set(all.filter(m=>m!==n).flatMap(wordsOf))].filter(x=>x!==ans);
   return {k:'q',type:'fill',id:id(n),hide,ans,opts:shuffle([ans,...shuffle(pool).slice(0,2)])}};
  const other=(n,pool)=>pool.filter(m=>m!==n&&(!hasMeal||byId[id(m)]?.name!==byId[id(n)]?.name));
  const meanQ=(n,pool)=>({k:'q',type:'name',id:id(n),ask:'mean',opts:shuffle([id(n),...shuffle(other(n,pool)).slice(0,2).map(id)])});
  const ayahQ=(n,pool)=>({k:'q',type:'pick',id:id(n),ask:'ayah',opts:shuffle([id(n),...shuffle(other(n,pool)).slice(0,2).map(id)])});
  if(l.kind==='know'){
   const seen=all.filter(n=>n<l.ayahs[0]);
   l.ayahs.forEach((n,i)=>{
    out.push({k:'card',kind:'new',id:id(n)});seen.push(n);
    if(i>=1){const prev=l.ayahs[i-1];out.push(hasMeal?meanQ(prev,seen):ayahQ(prev,seen));const f=fill(n);if(f)out.push(f)}
   });
   const last=l.ayahs[l.ayahs.length-1];
   if(l.ayahs.length===1){const f=fill(last);if(f)out.push(f)}
   if(hasMeal&&seen.length>1)out.push(meanQ(last,seen));
   if(seen.length>1)out.push(ayahQ(shuffle(l.ayahs)[0],seen));
   if(l.ayahs.length>=2)out.push({k:'q',type:'seq',ids:l.ayahs.map(id)});
  }else if(l.kind==='meaning'){
   for(const n of shuffle(all))out.push(meanQ(n,all));
  }else if(l.kind==='mem'){
   out.push({k:'card',kind:'intro'});
   for(const n of l.ayahs){if(wordsOf(n).length>=2)out.push({k:'q',type:'build',id:id(n),parts:wordsOf(n)});const f=fill(n);if(f)out.push(f)}
   for(const n of l.ayahs)if(wordsOf(n).length>=2)out.push({k:'q',type:'build',id:id(n),parts:wordsOf(n),memory:true});
  }else if(l.kind==='order'){
   for(const g of chunk(all,4))if(g.length>=2)out.push({k:'q',type:'seq',ids:g.map(id)});
   if(all.length>4)out.push({k:'q',type:'seq',ids:shuffle(all).slice(0,4).sort((a,b)=>a-b).map(id)});
  }else{
   for(const n of shuffle(all)){
    const r=Math.random();
    if(r<.34&&all.length>1)out.push(ayahQ(n,all));
    else if(r<.67){const f=fill(n);if(f)out.push(f);else out.push(ayahQ(n,all))}
    else if(wordsOf(n).length>=2)out.push({k:'q',type:'build',id:id(n),parts:wordsOf(n),memory:true});
   }
   if(all.length>=2)out.push({k:'q',type:'seq',ids:all.slice(0,Math.min(5,all.length)).map(id)});
  }
  return out.filter(q=>!(q.k==='q'&&(q.type==='name'||q.type==='pick')&&q.opts.length<2));
 }
 // Results go into the surah engine: learned, memorisation level, recall counts and next review.
 // Today's goal counters: ayahs learned for the first time and minutes spent, from every path lesson.
 function bumpDaily(fresh,seconds){
  try{const q=Q().ensureState(),d=q.daily;d.ayahs=(d.ayahs||0)+fresh;d.minutes=Math.round(((d.minutes||0)+(seconds||0)/60)*100)/100;Q().persistState()}catch(_){}
 }
 function record(sid,l,result){
  const gain=(l.kind==='know'||l.kind==='meaning'||l.kind==='mem')?l.ayahs.filter(n=>!progressOf(sid,n).completedAt).length:0;
  recordCore(sid,l,result);
  bumpDaily(gain,result?.seconds);
 }
 function recordCore(sid,l,result){
  const now=Date.now(),iso=new Date(now).toISOString();
  const missed=new Set((result?.missedIds||[]).map(v=>Number(String(v).split(':')[1])).filter(Boolean));
  // The exam keeps its best score; a flawless one (95% or more) earns the crown.
  if(l.kind==='review'){
   const pct=result?.questions?Math.round(result.firstTryCorrect/result.questions*100):100;
   writeStore(d=>{const e=d.exam[sid]||{};d.exam[sid]={best:Math.max(e.best||0,pct),last:pct,plays:(e.plays||0)+1,crown:!!e.crown||pct>=95,at:now}});
  }
  if(packSurah(sid)){
   writeStore(d=>{for(const n of l.ayahs){
    const k=sid+':'+n,a=d.ayah[k]||{},wrong=missed.has(n),patch={repetitions:(a.repetitions||0)+1,correctRecalls:(a.correctRecalls||0)+(wrong?0:1),wrongRecalls:(a.wrongRecalls||0)+(wrong?1:0),lastStudiedAt:iso};
    if(l.kind==='know'||l.kind==='meaning')patch.completedAt=a.completedAt||iso;
    if(l.kind==='mem'){patch.memorizationLevel=Math.min(5,(a.memorizationLevel||0)+(wrong?1:2));patch.completedAt=a.completedAt||iso}
    if((l.kind==='review'||l.kind==='order')&&(a.memorizationLevel||0)>=3&&!wrong)patch.memorizationLevel=Math.min(5,(a.memorizationLevel||0)+1);
    if(l.kind==='mem'||l.kind==='review'){const ivl=wrong?1:(l.kind==='review'?3:1);d.ivl=d.ivl||{};d.ivl[k]=ivl;patch.nextReviewAt=new Date(now+ivl*864e5).toISOString()}
    d.ayah[k]={...a,...patch};
   }});
   return;
  }
  const Qe=Q();if(!Qe?.updateAyah)return;
  try{Qe.startSurah?.(sid,l.ayahs[0],l.kind==='mem'?'memorize':'learn')}catch(_){}
  for(const n of l.ayahs){
   const a=progressOf(sid,n),wrong=missed.has(n);
   const patch={repetitions:(a.repetitions||0)+1,correctRecalls:(a.correctRecalls||0)+(wrong?0:1),wrongRecalls:(a.wrongRecalls||0)+(wrong?1:0),lastStudiedAt:iso};
   if(l.kind==='know'||l.kind==='meaning'){patch.completedAt=a.completedAt||iso;if(!a.state||a.state==='new')patch.state='learning'}
   if(l.kind==='mem'){const lvl=Math.min(5,(a.memorizationLevel||0)+(wrong?1:2));patch.memorizationLevel=lvl;patch.state=lvl>=4?'solid':'strengthening';patch.completedAt=a.completedAt||iso}
   if(l.kind==='review'||l.kind==='order'){if((a.memorizationLevel||0)>=3&&!wrong)patch.memorizationLevel=Math.min(5,(a.memorizationLevel||0)+1)}
   try{Qe.updateAyah(sid,n,patch)}catch(_){}
   if(l.kind==='mem'||l.kind==='review'){try{Qe.scheduleReview?.(sid,n,new Date(now+(wrong?1:(l.kind==='review'?3:1))*864e5).toISOString(),'surah-path')}catch(_){}}
  }
 }
 function open(sid,l){
  const code=lang(),t=T[code],items=itemsOf(sid,code),s=surahs().find(x=>x.id===sid);
  if(!items.length||!window.DEEN_ARABIC_CARDS)return false;
  const list=steps(sid,l,items,code);if(!list.length)return false;
  chStop();
  const before=badgeList(overview()).filter(b=>b.on).map(b=>b.id);let last=null;
  return window.DEEN_ARABIC_CARDS.open({lessonIndex:null,items,lessonIds:l.ayahs.map(n=>sid+':'+n),steps:list,lang:code,ask:'mean',
   title:(s?.name||'')+' · '+l.title,subtitle:l.sub,tip:l.kind==='mem'?{title:t.memTip[0],text:t.memTip[1],examples:[]}:null,
   onDone:result=>{last=result;markDone(l.id);record(sid,l,result)},
   onClose:()=>{remount();setTimeout(()=>document.querySelector('#leagueScreenBody .dsr-node.is-cur')?.scrollIntoView({block:'center',behavior:'instant'}),200);if(last)reward(sid,l,before)}});
 }
 const ICON={
  read:'<path d="M4 19V6.5A1.5 1.5 0 0 1 5.5 5H11v14H5.5A1.5 1.5 0 0 0 4 20.5"/><path d="M20 19V6.5A1.5 1.5 0 0 0 18.5 5H13v14h5.5a1.5 1.5 0 0 1 1.5 1.5"/>',
  mean:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  mem:'<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3.5L6 20V5a1 1 0 0 1 1-1z"/>',
  order:'<path d="M8 4v16M4.5 7.5 8 4l3.5 3.5M16 20V4M12.5 16.5 16 20l3.5-3.5"/>',
  star:'<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" fill="currentColor"/>',
  lock:'<path d="M7 10V8a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V8a3 3 0 0 0-6 0z" fill="currentColor" stroke="none"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5" stroke-width="3.2"/>',
  play:'<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
  pause:'<path d="M7 5h3.2v14H7zM13.8 5H17v14h-3.2z" fill="currentColor" stroke="none"/>',
  crown:'<path d="M4 18h16M5 18 3.5 8l5 4L12 5l3.5 7 5-4L19 18z"/>',
  medal:'<circle cx="12" cy="9" r="5"/><path d="m9 13.5-2 7 5-2.5 5 2.5-2-7"/>',
  calendar:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  alert:'<path d="M12 4 3 20h18z"/><path d="M12 10v4M12 17v.5"/>',
  clip:'<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
 };
 const svg=d=>'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>';
 function companion(){let p='owl';try{p=state.profile.companion||p}catch(_){}return String(p).replace(/[^a-z]/g,'')||'owl'}
 // Everything the path shows, computed once: lessons and their state per surah, stars, crowns, ayahs learned.
 // Stars build on each other: 1 = get-to-know lessons done, 2 = memorising done too, 3 = exam passed with 80%.
 function overview(){
  const code=lang(),done=doneIds(),list=surahs(),info={};let learned=0,total=0;
  for(const sh of list){
   const lessons=plan(sh.id,sh.ayahs,code),states=lessons.map(l=>lessonDone(sh.id,l,done)),ex=examOf(sh.id);
   const all=kinds=>lessons.every((l,i)=>!kinds.includes(l.kind)||states[i]);
   const s1=all(['know','meaning']),s2=s1&&all(['mem']),s3=s2&&(ex.best||0)>=80;
   info[sh.id]={lessons,states,stars:s3?3:s2?2:s1?1:0,crown:!!ex.crown,complete:states.every(Boolean)};
   total+=sh.ayahs;for(let n=1;n<=sh.ayahs;n++)if(progressOf(sh.id,n).completedAt)learned++;
  }
  return {list,info,learned,total,done};
 }
 function badgeList(ov){
  const xt=x(),completed=Object.values(ov.info).filter(i=>i.complete).length,out=[];
  const add=(id,icon,names,on)=>out.push({id,icon,name:names[0],desc:names[1],on:!!on});
  add('first','read',xt.badge.first,ov.done.length>0||ov.learned>0);
  add('surah1','mem',xt.badge.surah1,completed>=1);
  add('surah5','medal',xt.badge.surah5,completed>=5);
  add('crown','crown',xt.badge.crown,Object.values(ov.info).some(i=>i.crown));
  add('ayah100','star',xt.badge.ayah100,ov.learned>=100);
  [1,2,3].forEach(lv=>{const inLv=ov.list.filter(sh=>sh.level===lv);add('lvl'+lv,'medal',xt.lvlBadge(xt.lvl[lv-1]),inLv.length>0&&inLv.every(sh=>ov.info[sh.id].complete))});
  return out;
 }
 function starsEl(n,crown,xt){
  const w=el('span','dsr-stars');
  for(let i=0;i<3;i++){const st=el('i','dsr-star'+(i<n?' is-on':''));st.title=xt.stars[i];st.innerHTML=svg(ICON.star);w.append(st)}
  if(crown){const c=el('i','dsr-crown');c.title=xt.crownTip;c.innerHTML=svg(ICON.crown);w.append(c)}
  return w;
 }
 // After an exam (or a lesson that earned a badge) a small card shows the result.
 function reward(sid,l,beforeIds){
  const ov=overview(),xt=x(),r=xt.reward,fresh=badgeList(ov).filter(b=>b.on&&!beforeIds.includes(b.id)),exam=l.kind==='review';
  if(!exam&&!fresh.length)return;
  const inf=ov.info[sid],ex=examOf(sid);
  const wrap=el('div','dsr-reward');wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.dir=lang()==='ar'?'rtl':'ltr';
  const card=el('div','dsr-reward-card');
  const chest=new Image();chest.className='dsr-reward-chest';chest.alt='';chest.decoding='async';chest.src='assets/design/chest/chest-open.webp';card.append(chest);
  if(exam){
   card.append(el('h3','',r.title),starsEl(inf.stars,inf.crown,xt));
   const row=el('div','dsr-reward-acc');row.append(el('small','',r.acc),el('b','',(ex.last??0)+'%'));card.append(row);
   card.append(el('p','dsr-reward-note',(ex.last||0)>=95?r.crown:inf.stars<3?r.again:''));
  }
  for(const b of fresh){
   const row=el('div','dsr-reward-badge'),ic=el('span','dsr-badge-ico');ic.innerHTML=svg(ICON[b.icon]);
   const tx=el('span','');tx.append(el('small','',r.newBadge),el('b','',b.name),el('em','',b.desc));row.append(ic,tx);card.append(row);
  }
  const go=el('button','dsr-reward-go',r.cont);go.type='button';go.addEventListener('click',()=>wrap.remove());card.append(go);
  wrap.append(card);document.body.append(wrap);
  try{window.DEEN_DS_MOTION?.confetti?.(wrap)}catch(_){}
  try{window.DEENSound?.play?.('reward')}catch(_){}
  go.focus({preventScroll:true});
 }
 // Practice and tools: six clear cards, the rest behind "More tools". The old tools keep working: every card
 // reads its title and description from the old tool's own button (already in the learner's language) and passes
 // the tap on to it. The old list itself is hidden by the stylesheet.
 const lq=sel=>document.querySelector('#leagueScreenBody '+sel);
 const qia=(sec,i)=>document.querySelectorAll('#leagueScreenBody [data-qia-section="'+sec+'"] .deen-qia-action')[i]||null;
 const arena=kind=>lq('.deen-qarena-hub-card[onclick*="\''+kind+'\'"]');
 // ---- Question arena: a full screen of its own. Pick a level, then ten questions in the card layer; at 3 and
 // 5 right in a row the learner's companion rises from the bottom, as in the lessons. ----
 const LV_KEYS=['easy','medium','hard'];
 function arenaPool(scope,code){
  const all=[];
  for(const sh of surahs())for(const it of itemsOf(sh.id,code)){if(scope==='all'||progressOf(sh.id,it.num).completedAt)all.push(it)}
  return all;
 }
 // Question makers over a pool of ayah items; used by the arena and by the review.
 function qKit(pool){
  const words=[...new Set(pool.flatMap(i=>i.parts))];
  const withMeal=pool.filter(i=>i.name),short=i=>i.parts.length>=2&&i.parts.length<=7;
  const fill=(it,k)=>{const hide=Math.random()*it.parts.length|0,ans=it.parts[hide];return {k:'q',type:'fill',id:it.id,hide,ans,opts:shuffle([ans,...shuffle(words.filter(w=>w!==ans)).slice(0,k-1)])}};
  const meaning=it=>({k:'q',type:'name',id:it.id,ask:'mean',opts:shuffle([it.id,...shuffle(withMeal.filter(i=>i.id!==it.id&&i.name!==it.name)).slice(0,2).map(i=>i.id)])});
  const byMeaning=it=>({k:'q',type:'pick',id:it.id,ask:'mean',opts:shuffle([it.id,...shuffle(withMeal.filter(i=>i.id!==it.id&&i.name!==it.name&&i.glyph.length<=70)).slice(0,2).map(i=>i.id)])});
  const build=it=>({k:'q',type:'build',id:it.id,parts:it.parts});
  // A run of consecutive ayahs of one surah, for "put them in order".
  const run=n=>{
   const by={};for(const i of pool)(by[i.id.split(':')[0]]||=new Map()).set(i.num,i);
   const starts=[];for(const [sid,m] of Object.entries(by))for(const a of m.keys()){let ok=true;for(let k=1;k<n;k++)if(!m.has(a+k)){ok=false;break}if(ok)starts.push([sid,a])}
   if(!starts.length)return null;const [sid,a]=starts[Math.random()*starts.length|0];
   return {k:'q',type:'seq',ids:Array.from({length:n},(_,k)=>sid+':'+(a+k))};
  };
  return {words,withMeal,short,fill,meaning,byMeaning,build,run};
 }
 function arenaSteps(level,pool,code){
  const hasMeal=code==='tr'||code==='en',used=new Set(),out=[];
  const take=(n,f)=>{const c=shuffle(pool.filter(i=>!used.has(i.id)&&(!f||f(i)))).slice(0,n);c.forEach(i=>used.add(i.id));return c};
  const {words,withMeal,short,fill,meaning,byMeaning,build,run}=qKit(pool);
  const add=(n,make)=>{for(let i=0;i<n;i++){const q=make();if(q)out.push(q)}};
  const rec={
   easy:()=>{
    if(hasMeal){add(1,()=>null);take(5,short).forEach(i=>out.push(meaning(i)));take(3,short).forEach(i=>out.push(byMeaning(i)));take(2,short).forEach(i=>out.push(fill(i,3)))}
    else{take(6,short).forEach(i=>out.push(fill(i,3)));add(2,()=>run(3))}
   },
   medium:()=>{
    take(3,short).forEach(i=>out.push(fill(i,3)));
    if(hasMeal){take(2,short).forEach(i=>out.push(meaning(i)));take(2,short).forEach(i=>out.push(build(i)));take(1,short).forEach(i=>out.push(byMeaning(i)))}
    else take(3,short).forEach(i=>out.push(fill(i,3)));
    add(2,()=>run(3));
   },
   hard:()=>{
    if(hasMeal){take(4,short).forEach(i=>out.push(build(i)));take(1,short).forEach(i=>out.push(byMeaning(i)))}
    else take(5,short).forEach(i=>out.push(fill(i,4)));
    take(3,short).forEach(i=>out.push(fill(i,4)));add(2,()=>run(4));
   }
  };
  rec[level]();
  // Top up with fill-in-the-blank if a kind ran short, then keep ten.
  for(const i of take(10,short)){if(out.length>=10)break;out.push(fill(i,level==='hard'?4:3))}
  return shuffle(out).slice(0,10);
 }
 // ---- Review: every ayah that is due, from the old surahs (their engine's queue) and the new ones (this path's store). ----
 function dueList(){
  const now=Date.now(),out=[];
  try{for(const v of Q().state().review?.queue||[])if(v.surahId&&v.ayah&&Date.parse(v.dueAt)<=now)out.push({sid:v.surahId,n:v.ayah})}catch(_){}
  for(const [k,a] of Object.entries(readStore().ayah||{})){
   if(!a.nextReviewAt||Date.parse(a.nextReviewAt)>now)continue;
   const [sid,n]=k.split(':');if(packSurah(sid))out.push({sid,n:Number(n)});
  }
  return out;
 }
 const LADDER=[1,3,7,14,30];
 function reviewDone(asked,result,seconds){
  const missed=new Set((result?.missedIds||[]).map(String)),now=Date.now(),iso=new Date(now).toISOString();
  const plan=asked.map(it=>{const [sid,n]=it.id.split(':'),k=it.id,wrong=missed.has(k);return {sid,n:Number(n),k,wrong}});
  writeStore(d=>{
   d.ivl=d.ivl||{};
   for(const r of plan){
    const at=LADDER.indexOf(d.ivl[r.k]||1),ivl=r.wrong?1:LADDER[Math.min(LADDER.length-1,Math.max(0,at)+1)];
    d.ivl[r.k]=ivl;
    if(packSurah(r.sid)){const a=d.ayah[r.k]||{};d.ayah[r.k]={...a,repetitions:(a.repetitions||0)+1,correctRecalls:(a.correctRecalls||0)+(r.wrong?0:1),wrongRecalls:(a.wrongRecalls||0)+(r.wrong?1:0),lastStudiedAt:iso,nextReviewAt:new Date(now+ivl*864e5).toISOString()}}
   }
  });
  // The old surahs keep their schedule in their own engine.
  const Qe=Q();
  for(const r of plan){
   if(packSurah(r.sid)||!Qe?.updateAyah)continue;
   const a=progressOf(r.sid,r.n),ivl=(readStore().ivl||{})[r.k]||1;
   try{Qe.updateAyah(r.sid,r.n,{repetitions:(a.repetitions||0)+1,correctRecalls:(a.correctRecalls||0)+(r.wrong?0:1),wrongRecalls:(a.wrongRecalls||0)+(r.wrong?1:0),lastStudiedAt:iso})}catch(_){}
   try{Qe.scheduleReview?.(r.sid,r.n,new Date(now+ivl*864e5).toISOString(),'surah-path')}catch(_){}
  }
  bumpDaily(0,seconds);
 }
 function reviewStart(){
  const code=lang(),hasMeal=code==='tr'||code==='en',pool=arenaPool('all',code),byId=Object.fromEntries(pool.map(i=>[i.id,i]));
  const kit=qKit(pool),asked=[],steps=[];
  const kinds=hasMeal?['meaning','fill','byMeaning','build']:['fill'];
  for(const d of shuffle(dueList())){
   if(asked.length>=10)break;
   const it=byId[d.sid+':'+d.n];if(!it)continue;
   const k=kinds[asked.length%kinds.length];
   if(k==='meaning'&&it.name)steps.push(kit.meaning(it));
   else if(k==='byMeaning'&&it.name)steps.push(kit.byMeaning(it));
   else if(k==='build'&&it.name&&kit.short(it))steps.push(kit.build(it));
   else if(it.parts.length>=2)steps.push(kit.fill(it,3));
   else if(it.name)steps.push(kit.meaning(it));
   else continue;
   asked.push(it);
  }
  if(!steps.length||!window.DEEN_ARABIC_CARDS)return reviewEmpty();
  const t=x().rev;
  const ok=window.DEEN_ARABIC_CARDS.open({lessonIndex:null,items:pool,lessonIds:[],steps,lang:code,ask:'mean',title:t.title,subtitle:'',
   onAnswer:()=>{},onDone:result=>reviewDone(asked,result,result?.seconds),onClose:()=>{remount()},onExit:()=>{remount()}});
  const host=document.getElementById('dsArabicCards');
  if(ok&&host){host.classList.add('dsa-run');host.dataset.level='easy';setTimeout(()=>host.querySelector('.dac-intro-go')?.click(),60)}
  return ok;
 }
 function reviewEmpty(){
  const t=x().rev,wrap=el('div','dsr-reward');wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.dir=lang()==='ar'?'rtl':'ltr';
  const card=el('div','dsr-reward-card'),pet=new Image();pet.className='dsr-reward-chest';pet.alt='';pet.decoding='async';
  pet.addEventListener('error',()=>{if(!pet.src.includes('/owl/'))pet.src='assets/companions/owl/owl_celebrate.png'},{once:true});
  pet.src='assets/companions/'+companion()+'/'+companion()+'_avatar.png';
  card.append(pet,el('h3','',t.empty),el('p','dsr-reward-note',t.emptySub));
  const go=el('button','dsr-reward-go',t.arena);go.type='button';go.addEventListener('click',()=>{wrap.remove();arenaScreen()});
  const no=el('button','dsr-reward-no',t.close);no.type='button';no.addEventListener('click',()=>wrap.remove());
  card.append(go,no);wrap.append(card);document.body.append(wrap);go.focus({preventScroll:true});
 }
 function recordArena(level,result){
  const pct=result?.questions?Math.round(result.firstTryCorrect/result.questions*100):0;
  writeStore(d=>{d.arena=d.arena&&typeof d.arena==='object'?d.arena:{};const e=d.arena[level]||{};d.arena[level]={best:Math.max(e.best||0,pct),last:pct,plays:(e.plays||0)+1}});
 }
 function comboRise(n,host){
  host.querySelector('.dsa-rise')?.remove();
  const pet=companion(),rise=el('div','dsa-rise'),img=new Image();rise.dataset.tier=String(n);
  img.alt='';img.decoding='async';
  img.addEventListener('error',()=>{if(!img.src.includes('/owl/'))img.src='assets/companions/owl/owl_combo_'+n+'.webp'},{once:true});
  img.src='assets/companions/'+pet+'/'+pet+'_combo_'+n+'.webp';
  const say=el('div','dsa-say',ax().combo[n]);rise.append(el('span','dsa-glow'),img,say);host.append(rise);
  // The result sheet slides up a moment after the answer; keep measuring so the companion stands on its edge.
  const place=()=>{const f=host.querySelector('.dac-foot');if(f)host.style.setProperty('--dsa-h',Math.round(f.getBoundingClientRect().height)+'px')};
  place();for(const ms of [120,260,420,650])setTimeout(place,ms);
  const bye=()=>{if(!rise.isConnected||rise.classList.contains('closing'))return;rise.classList.add('closing');setTimeout(()=>rise.remove(),260)};
  setTimeout(bye,2300);
  host.addEventListener('click',e=>{if(e.target.closest?.('.dac-cta'))bye()},{once:true,capture:true});
 }
 function startArena(level,scope,screen){
  const code=lang(),pool=arenaPool(scope,code),steps=arenaSteps(level,pool,code);
  if(steps.length<4||!window.DEEN_ARABIC_CARDS)return false;
  let combo=0;
  const ok=window.DEEN_ARABIC_CARDS.open({lessonIndex:null,items:pool,lessonIds:[],steps,lang:code,ask:'mean',title:ax().title,subtitle:ax().lv[LV_KEYS.indexOf(level)][0],
   onAnswer:(id,right)=>{if(right){combo++;if(combo===3||combo===5){const h=document.getElementById('dsArabicCards');if(h)comboRise(combo,h)}}else combo=0},
   onDone:result=>recordArena(level,result),
   onClose:()=>arenaScreen(),onExit:()=>arenaScreen()});
  if(!ok)return false;
  const host=document.getElementById('dsArabicCards');
  if(host){host.classList.add('dsa-run');host.dataset.level=level;setTimeout(()=>host.querySelector('.dac-intro-go')?.click(),60)}
  // The level screen stays on top until the first question is ready, then lifts away.
  if(screen){screen.classList.add('is-leaving');setTimeout(()=>screen.remove(),720)}
  return true;
 }
 function arenaScreen(from){
  document.querySelector('.dsa')?.remove();
  const code=lang(),a=ax(),store=readStore().arena||{};
  const learnedN=arenaPool('learned',code).length,allN=arenaPool('all',code).length;
  let scope=learnedN>=8?'learned':'all';
  const wrap=el('div','dsa');wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-label',a.title);wrap.dir=code==='ar'?'rtl':'ltr';
  if(from&&from.x!=null){wrap.style.setProperty('--ox',Math.round(from.x)+'px');wrap.style.setProperty('--oy',Math.round(from.y)+'px');wrap.classList.add('is-reveal')}else wrap.classList.add('is-fade');
  const close=()=>{wrap.classList.add('is-leaving');setTimeout(()=>wrap.remove(),380);document.removeEventListener('keydown',onKey)};
  const onKey=e=>{if(e.key==='Escape')close()};document.addEventListener('keydown',onKey);
  const inner=el('div','dsa-inner');wrap.append(inner);
  const top=el('div','dsa-top'),cb=el('button','dsa-close','×');cb.type='button';cb.setAttribute('aria-label',a.back);cb.addEventListener('click',close);top.append(el('span','dsa-kicker','ilnura'),cb);inner.append(top);
  const hero=el('div','dsa-hero'),pet=new Image();pet.className='dsa-pet';pet.alt='';pet.decoding='async';
  pet.addEventListener('error',()=>{if(!pet.src.includes('/owl/'))pet.src='assets/companions/owl/owl_lesson_idle.png'},{once:true});pet.src='assets/companions/'+companion()+'/'+companion()+'_lesson_idle.png';
  const ht=el('div','dsa-hero-txt');ht.append(el('h2','',a.title),el('p','',a.sub));hero.append(ht,pet);inner.append(hero);
  const chips=el('div','dsa-scope'),poolTxt=el('span','dsa-pool');
  const chipL=el('button','dsa-chip',a.scopeLearned),chipA=el('button','dsa-chip',a.scopeAll);chipL.type=chipA.type='button';
  const paint=()=>{chipL.classList.toggle('is-on',scope==='learned');chipA.classList.toggle('is-on',scope==='all');poolTxt.textContent=a.pool(scope==='learned'?learnedN:allN)};
  if(learnedN<8){chipL.disabled=true;chipL.title=a.few}
  chipL.addEventListener('click',()=>{if(!chipL.disabled){scope='learned';paint()}});chipA.addEventListener('click',()=>{scope='all';paint()});
  chips.append(chipL,chipA);paint();inner.append(chips,poolTxt);
  const list=el('div','dsa-levels');
  LV_KEYS.forEach((key,i)=>{
   const b=el('button','dsa-level');b.type='button';b.dataset.lv=String(i+1);b.style.setProperty('--i',String(i));
   const ico=el('span','dsa-lv-ico');for(let k=0;k<=i;k++){const st=el('i');st.innerHTML=svg(ICON.star);ico.append(st)}
   const tx=el('span','dsa-lv-txt');tx.append(el('b','',a.lv[i][0]),el('small','',a.lv[i][1]));
   const meta=el('span','dsa-lv-meta');meta.append(el('em','',a.q(10)));const best=store[key]?.best;if(best!=null)meta.append(el('i','',a.best(best)));
   b.append(ico,tx,meta);
   b.addEventListener('click',()=>{
    if(wrap.classList.contains('is-picked'))return;wrap.classList.add('is-picked');b.classList.add('is-chosen');
    try{window.DEENSound?.play?.('start')}catch(_){}
    setTimeout(()=>{if(!startArena(key,scope,wrap)){wrap.classList.remove('is-picked');b.classList.remove('is-chosen')}},reduceMotion()?0:380);
   });
   list.append(b);
  });
  inner.append(list);
  document.body.append(wrap);cb.focus({preventScroll:true});
 }
 const reduceMotion=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(_){return false}};
 const TOOL_MAIN=[
  {id:'arena',icon:'bolt',wide:true,own:e=>arenaScreen(e),text:()=>[ax().title,ax().lv.map(v=>v[0]).join(' · ')]},
  {id:'review',icon:'calendar',own:()=>reviewStart(),get:()=>qia('progress',2)},      // review plan: ayahs due today
  {id:'memorize',get:()=>qia('memorize',0)},                    // recall round
  {id:'weak',icon:'alert',get:()=>lq('[data-qweak-challenge]')},// weak ayahs challenge
  {id:'progress',icon:'chart',own:()=>progressSheet(),text:()=>[x().prog.title,x().prog.sub]}
 ];
 function toolsPanel(dueCount){
  const xt=x(),born=Date.now(),wrap=el('div','dsr-toolsbox'),grid=el('div','dsr-tgrid'),cards=[];
  for(const spec of TOOL_MAIN){
   const b=el('button','dsr-tool');b.type='button';b.dataset.tool=spec.id;b.hidden=true;
   const ico=el('span','dsr-tool-ico'),tx=el('span','dsr-tool-txt'),ti=el('b'),su=el('small');tx.append(ti,su);b.append(ico,tx);
   if(spec.wide)b.classList.add('is-wide');
   b.addEventListener('click',e=>{if(spec.own){const r=b.getBoundingClientRect();spec.own({x:e.clientX||r.left+r.width/2,y:e.clientY||r.top+r.height/2})}else{const old=spec.get();if(old)old.click()}});
   grid.append(b);cards.push({spec,b,ico,ti,su});
  }
  // Copy title, description and icon from the old buttons; run again whenever the old list changes (it is built late and translated late).
  const sync=()=>{
   for(const c of cards){
    if(c.spec.own&&c.spec.text){const [t1,t2]=c.spec.text();c.b.hidden=false;if(c.ti.textContent!==t1)c.ti.textContent=t1;if(c.su.textContent!==t2)c.su.textContent=t2;if(!c.ico.firstChild)c.ico.innerHTML=svg(ICON[c.spec.icon]);continue}
    const old=c.spec.get();c.b.hidden=!old;if(!old)continue;
    const ti=old.querySelector('b')?.textContent?.trim(),su=old.querySelector('small')?.textContent?.trim();
    if(ti&&c.ti.textContent!==ti)c.ti.textContent=ti;
    if(c.su.textContent!==(su||''))c.su.textContent=su||'';
    if(!c.ico.firstChild){if(c.spec.icon)c.ico.innerHTML=svg(ICON[c.spec.icon]);else{const svgOld=old.querySelector('svg');if(svgOld)c.ico.append(svgOld.cloneNode(true))}}
    if(c.spec.id==='review'){let badge=c.b.querySelector('.dsr-tool-badge');if(dueCount>0){if(!badge){badge=el('em','dsr-tool-badge');c.b.append(badge)}badge.textContent=String(dueCount)}else badge?.remove()}
   }
  };
  sync();
  let timer=0;
  const mo=new MutationObserver(list=>{
   if(!wrap.isConnected){if(Date.now()-born>3000)mo.disconnect();return}
   if(list.every(r=>wrap.contains(r.target)))return;
   clearTimeout(timer);timer=setTimeout(sync,150);
  });
  const host=document.getElementById('leagueScreenBody');if(host)mo.observe(host,{childList:true,subtree:true,characterData:true});
  wrap.append(grid);return wrap;
 }
 // The progress screen: one place for what used to be four (progress centre, mastery, level and personal plan).
 const PRESETS=[[1,5,3],[3,10,5],[5,20,7]];
 function ringEl(pct,label){
  const r=44,c=2*Math.PI*r,box=el('div','dsn-ring');
  box.innerHTML='<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="'+r+'" class="dsn-ring-bg"/><circle cx="50" cy="50" r="'+r+'" class="dsn-ring-fg" stroke-dasharray="'+(c*Math.min(1,pct/100)).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 50 50)"/></svg>';
  box.append(el('b','',Math.round(pct)+'%'));if(label)box.append(el('small','',label));return box;
 }
 function progressSheet(){
  const code=lang(),xt=x(),pr=xt.prog,ov=overview(),badges=badgeList(ov);
  let q={};try{q=Q().state()}catch(_){}
  const goals=q.goals||{dailyAyahs:1,dailyMinutes:5,weeklyDays:3},daily=q.daily||{ayahs:0,minutes:0};
  let streak=0;try{streak=Number(state.streak)||0}catch(_){}
  let due=0,solid=0,starSum=0,completed=0;
  due=dueList().length;
  for(const sh of ov.list){const inf=ov.info[sh.id];starSum+=inf.stars;if(inf.complete)completed++;for(let n=1;n<=sh.ayahs;n++)if((progressOf(sh.id,n).memorizationLevel||0)>=4)solid++}
  const wrap=el('div','dsn');wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-label',pr.title);wrap.dir=code==='ar'?'rtl':'ltr';
  const close=()=>{wrap.remove();document.removeEventListener('keydown',onKey)};
  const onKey=e=>{if(e.key==='Escape')close()};document.addEventListener('keydown',onKey);
  const inner=el('div','dsn-inner');wrap.append(inner);
  const top=el('div','dsn-top');const cb=el('button','dsn-close','×');cb.type='button';cb.setAttribute('aria-label',pr.close);cb.addEventListener('click',close);top.append(el('span','dsn-kicker','ilnura'),cb);inner.append(top);
  // Hero: overall ring, level, streak.
  const pct=ov.total?ov.learned/ov.total*100:0,hero=el('div','dsn-hero');
  const ht=el('div','dsn-hero-txt');ht.append(el('h2','',pr.title),el('span','dsn-level',pr.level(completed+1)),el('p','',ov.learned+' / '+ov.total+' · '+pr.learned.toLowerCase()));
  if(streak>0){const sk=el('span','dsn-streak');sk.innerHTML=svg(ICON.sun);sk.append(document.createTextNode(pr.streak(streak)));ht.append(sk)}
  hero.append(ringEl(pct,pr.overall),ht);inner.append(hero);
  // Today's goals and pace.
  const gc=el('div','dsn-card');gc.append(el('h3','',pr.goals));
  const bar=(label,val,max)=>{const r=el('div','dsn-goal'),h=el('div','dsn-goal-head');const num=el('b','',Math.min(val,max)+' / '+max);num.dir='ltr';h.append(el('span','',label),num);const b=el('span','dsr-bar'),f=el('i');f.style.width=Math.min(100,max?val/max*100:0)+'%';b.append(f);r.append(h,b);return r};
  gc.append(bar(pr.goalAyahs,daily.ayahs||0,goals.dailyAyahs||1),bar(pr.goalMinutes,Math.round(daily.minutes||0),goals.dailyMinutes||5));
  gc.append(el('h4','',pr.pace));
  const chips=el('div','dsn-chips');
  PRESETS.forEach(([a,m,d],i)=>{
   const on=goals.dailyAyahs===a&&goals.dailyMinutes===m&&goals.weeklyDays===d;
   const c=el('button','dsn-chip'+(on?' is-on':''));c.type='button';c.append(el('b','',pr.presets[i]),el('small','',pr.presetSub(a,m,d)));
   c.addEventListener('click',()=>{try{Q().setGoal('dailyAyahs',a);Q().setGoal('dailyMinutes',m);Q().setGoal('weeklyDays',d)}catch(_){}close();progressSheet()});
   chips.append(c);
  });
  gc.append(chips);inner.append(gc);
  // Four numbers.
  const grid=el('div','dsn-stats');
  for(const [label,val,tone] of [[pr.learned,ov.learned,'a'],[pr.solid,solid,'b'],[pr.due,due,'c'],[pr.stars,starSum+' / '+ov.list.length*3,'d']]){const t=el('div','dsn-stat is-'+tone);t.append(el('b','',String(val)),el('small','',label));grid.append(t)}
  inner.append(grid);
  // Surahs by level; a tap goes to that surah on the path.
  const sc=el('div','dsn-card');sc.append(el('h3','',pr.surahs));
  let lastLv=0;
  for(const sh of ov.list){
   if(sh.level!==lastLv){lastLv=sh.level;sc.append(el('h4','dsn-lv',xt.lvl[sh.level-1]))}
   const inf=ov.info[sh.id];let got=0;for(let n=1;n<=sh.ayahs;n++)if(progressOf(sh.id,n).completedAt)got++;
   const row=el('button','dsn-row');row.type='button';
   const nm=el('span','dsn-row-name');nm.append(el('b','',sh.name));const b=el('span','dsr-bar'),f=el('i');f.style.width=Math.round(got/sh.ayahs*100)+'%';b.append(f);nm.append(b);
   row.append(nm,starsEl(inf.stars,inf.crown,xt));
   row.addEventListener('click',()=>{close();document.querySelector('.dsr-unit[data-sid="'+sh.id+'"]')?.scrollIntoView({block:'center',behavior:'smooth'})});
   sc.append(row);
  }
  inner.append(sc);
  // Badges.
  const bc=el('div','dsn-card');const bh=el('div','dsn-badges-head');bh.append(el('h3','',xt.badgesTitle),el('span','',badges.filter(v=>v.on).length+' / '+badges.length));bc.append(bh);
  const bg=el('div','dsn-badges');
  for(const v of badges){const c=el('div','dsr-badge'+(v.on?' is-on':'')),ic=el('span','dsr-badge-ico');ic.innerHTML=svg(v.on?ICON[v.icon]:ICON.lock);c.append(ic,el('b','',v.name),el('small','',v.desc));bg.append(c)}
  bc.append(bg);inner.append(bc);
  document.body.append(wrap);cb.focus({preventScroll:true});
 }
 // ---- Whole-surah recitation for the new surahs: one shared player, a play button on the surah's unit. ----
 let chPlayer=null,chId=null,chErr=null;
 function chPaint(){
  for(const b of document.querySelectorAll('.dsr-listen')){
   const on=b.dataset.sid===chId&&!!chPlayer&&!chPlayer.paused&&!chPlayer.ended&&!chPlayer.error;
   const bad=b.dataset.sid===chErr&&!on;
   b.classList.toggle('is-playing',on);b.classList.toggle('is-error',bad);b.innerHTML=svg(on?ICON.pause:bad?ICON.alert:ICON.play);b.setAttribute('aria-label',bad?x().audio.fail:on?x().audio.pause:x().audio.listen);if(bad)b.title=x().audio.fail;
  }
 }
 function chStop(){try{chPlayer?.pause()}catch(_){}chPaint()}
 function chToggle(sid){
  const au=packSurah(sid)?.audio;if(!au)return;
  if(!chPlayer){chPlayer=new Audio();chPlayer.preload='none';for(const ev of ['play','pause','ended'])chPlayer.addEventListener(ev,()=>{if(ev==='play')chErr=null;chPaint()});chPlayer.addEventListener('error',()=>{chErr=chId;try{chPlayer.pause()}catch(_){}chPaint()})}
  if(chId===sid&&!chPlayer.paused){chPlayer.pause();return}
  if(chId!==sid||chPlayer.error){chPlayer.src=au.chapter;chId=sid}
  chErr=null;chPlayer.play().catch(()=>{chErr=chId;chPaint()});
 }
 function build(){
  const code=lang(),t=T[code],xt=x(),ov=overview(),done=ov.done,list=ov.list;
  const root=el('div','dsr-path');root.dir=code==='ar'?'rtl':'ltr';
  // Hero and progress.
  const hero=el('div','dsr-hero');const copy=el('div','dsr-hero-copy');copy.append(el('h2','',t.title),el('p','',t.sub));
  const pet=new Image();pet.className='dsr-pet';pet.alt='';pet.decoding='async';pet.addEventListener('error',()=>{if(!pet.src.includes('/owl/'))pet.src='assets/companions/owl/owl_lesson_idle.png'},{once:true});pet.src='assets/companions/'+companion()+'/'+companion()+'_lesson_idle.png';
  hero.append(copy,pet);root.append(hero);
  const learned=ov.learned,total=ov.total;
  const prog=el('div','dsr-prog');const row=el('div','dsr-prog-row');row.append(el('span','',t.learned),el('b','',learned+' / '+total));
  const bar=el('span','dsr-bar');const fill=el('i');fill.style.width=(total?Math.round(learned/total*100):0)+'%';bar.append(fill);prog.append(row,bar);root.append(prog);
  // Today: reviews due, or where to continue.
  let current='';const dueCount=dueList().length;try{const st=Q().state();current=list.find(sh=>sh.id===st.profile?.currentSurah)?.name||list[0]?.name||''}catch(_){}
  const today=el('div','dsr-today');today.innerHTML=svg(ICON.sun);const tc=el('div','');// The surah name sits in its own element so the app’s translation layer can render it per language.
  const sm=el('small','',dueCount?t.due(dueCount):t.cont);if(!dueCount)sm.append(el('span','',current));tc.append(el('b','',t.today),sm);today.append(tc);root.append(today);
  // Badges: earned ones in colour, the rest dimmed with what they ask for.
  const badges=badgeList(ov),bw=el('div','dsr-badges'),bh=el('div','dsr-badges-head');
  bh.append(el('h3','',xt.badgesTitle),el('span','',badges.filter(b=>b.on).length+' / '+badges.length));
  const strip=el('div','dsr-badges-row');
  for(const b of badges){const c=el('div','dsr-badge'+(b.on?' is-on':'')),ic=el('span','dsr-badge-ico');ic.innerHTML=svg(b.on?ICON[b.icon]:ICON.lock);c.append(ic,el('b','',b.name),el('small','',b.desc));c.title=b.desc;strip.append(c)}
  bw.append(bh,strip);root.append(bw);
  // Units, grouped by level. A surah opens once the previous surah's "get to know" lessons are done.
  const adm=!!window.DEEN_ADMIN_UNLOCK?.();   // admin test mode: every surah and lesson is open
  let prevKnowDone=true,curMarked=false,lastLevel=0;
  list.forEach((s,si)=>{
   if(s.level!==lastLevel){
    lastLevel=s.level;
    const inLv=list.filter(z=>z.level===s.level),doneLv=inLv.filter(z=>ov.info[z.id].complete).length;
    const lh=el('div','dsr-level');lh.dataset.lv=String(s.level);
    const lc=el('span','dsr-level-copy');lc.append(el('small','',xt.levelTag(s.level)),el('b','',xt.lvl[s.level-1]));
    const lm=el('span','dsr-level-meter');lm.append(el('em','',xt.levelCount(doneLv,inLv.length)));const lb=el('span','dsr-bar'),lf=el('i');lf.style.width=Math.round(doneLv/inLv.length*100)+'%';lb.append(lf);lm.append(lb);
    lh.append(lc,lm);root.append(lh);
   }
   const inf=ov.info[s.id],lessons=inf.lessons,states=inf.states,open=si===0||prevKnowDone||states.some(Boolean)||adm;
   const unit=el('div','dsr-unit'+(open?'':' is-locked'));unit.dataset.tone=String(si%5);unit.dataset.sid=s.id;
   const first=(itemsOf(s.id,code)[0]?.glyph||'').match(ARABIC)?.[0]||'';
   const ico=el('span','dsr-unit-ico',first);ico.lang='ar';
   const uc=el('span','dsr-unit-copy');uc.append(el('small','',t.surah+' '+(si+1)),el('b','',s.name),el('em','',t.ayahs(s.ayahs)));
   if(open)uc.append(starsEl(inf.stars,inf.crown,xt));
   const au=packSurah(s.id)?.audio;
   if(au&&open)uc.append(el('small','dsr-unit-credit',xt.audio.reciter+': '+au.credit.reciter+' · '+au.credit.license));
   unit.append(ico,uc);
   if(au&&open){const lb=el('button','dsr-listen');lb.type='button';lb.dataset.sid=s.id;lb.title=au.credit.reciter+' · '+au.credit.license+' · Wikimedia Commons';lb.addEventListener('click',e=>{e.stopPropagation();chToggle(s.id)});unit.append(lb)}
   root.append(unit);
   if(open){
    const box=el('div','dsr-list');root.append(box);
    let shownLock=false;
    lessons.forEach((l,i)=>{
     const isDone=states[i],avail=isDone||i===0||states[i-1]||adm;
     const b=el('button','dsr-node');b.type='button';
     const isCur=avail&&!isDone&&!curMarked;if(isCur)curMarked=true;
     b.classList.add(isDone?'is-done':isCur?'is-cur':avail?'is-open':'is-locked');if(l.kind==='review')b.classList.add('is-star','is-exam');
     if(i<lessons.length-1)b.append(el('span','dsr-line'));
     const dot=el('span','dsr-dot');dot.innerHTML=svg(isDone?ICON.check:avail?ICON[l.icon]:ICON.lock);b.append(dot);
     const tx=el('span','dsr-txt');tx.append(el('b','',l.title));
     const status=isDone?t.done:isCur?t.ready:(!avail&&!shownLock?(shownLock=true,t.lockPrev):'');if(status)tx.append(el('span','',status));b.append(tx);
     if(isCur){const bub=el('span','dsr-bubble',t.go);bub.setAttribute('aria-hidden','true');b.append(bub)}
     if(avail)b.addEventListener('click',()=>open_(s.id,l));else b.disabled=true;
     box.append(b);
    });
   }else{
    const hint=el('p','dsr-lockhint',t.lockSurah);root.append(hint);
   }
   prevKnowDone=open&&lessons.filter(l=>l.kind==='know').every((l,i)=>states[lessons.indexOf(l)]);
  });
  setTimeout(chPaint,0);
  const head=el('div','dsr-tools');head.append(el('h3','',t.tools),el('p','',t.toolsSub));root.append(head,toolsPanel(dueCount));
  return root;
 }
 const open_=(sid,l)=>open(sid,l);
 function mount(shell){
  if(!shell||!C()?.getSurah||!Q()?.surahs)return;
  if(shell.querySelector(':scope>.dsr-path'))return;
  shell.classList.add('dsr-on');shell.prepend(build());
 }
 function remount(){const shell=document.querySelector('#leagueScreenBody .deen-quran-shell');if(!shell)return;shell.querySelector(':scope>.dsr-path')?.remove();mount(shell)}
 window.DEEN_QURAN_PATH=Object.freeze({version:'ds-quran-path-1',mount,remount,plan,items:itemsOf,steps,arena:()=>arenaScreen(),review:()=>reviewStart(),progress:()=>progressSheet(),open:(sid,lessonId)=>{const s=surahs().find(x=>x.id===sid);const l=s&&plan(sid,s.ayahs,lang()).find(x=>x.id===lessonId);return l?open(sid,l):false},store:STORE});
})();
