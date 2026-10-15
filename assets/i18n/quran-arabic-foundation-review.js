/* DEEN Quran Arabic · Phase 13: honest written foundation practice.
 * Includes actual letters, vowel marks, reading marks and word construction.
 * No generated recitation, no Tajwid or pronunciation proficiency assertions.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_FOUNDATION_REVIEW)return;
 const A=window.DEEN_ARABIC_LETTERS,V=window.DEEN_ARABIC_HARAKAT,
       R=window.DEEN_ARABIC_READING,W=window.DEEN_ARABIC_WORDS;
 if(!A||!V||!R||!W)throw Error('DEEN_FOUNDATION_INPUT_MISSING');
 const groups=Object.freeze([
  Object.freeze({kind:'letters',lessons:A.lessons}),
  Object.freeze({kind:'vowels',lessons:V.lessons}),
  Object.freeze({kind:'reading',lessons:R.lessons}),
  Object.freeze({kind:'words',lessons:W.lessons})
 ]);
 const catalog=Object.freeze(groups.flatMap(group=>group.lessons.flatMap(lesson=>
  (lesson.letters||lesson.items).map(item=>Object.freeze({
   id:item.id,kind:group.kind,lessonId:lesson.id,lessonIndex:lesson.index,
   glyph:item.glyph,questionKind:lesson.kind,parts:item.parts||Object.freeze([]),
   names:item.names,excerpt:item.excerpt||null,reference:item.reference||null
  }))
 )));
 const catalogMap=Object.freeze(Object.assign(Object.create(null),Object.fromEntries(catalog.map(x=>[x.id,x]))));
 const cardIds=Object.freeze(catalog.map(x=>x.id));
 if(catalog.length!==55||new Set(cardIds).size!==55)throw Error('DEEN_FOUNDATION_CATALOG_INTEGRITY');
 const int=(v,max)=>Number.isInteger(v)?Math.max(0,Math.min(max,v)):0;
 const clean=raw=>{
  const cards=Object.create(null),source=raw?.cards&&typeof raw.cards==='object'&&!Array.isArray(raw.cards)?raw.cards:{};
  for(const id of cardIds){
   const r=source[id];if(!r||typeof r!=='object'||Array.isArray(r))continue;
   if(!Number.isInteger(r.step)||r.step<0||r.step>5||!Number.isFinite(r.dueAt)||r.dueAt<0)continue;
   cards[id]=Object.freeze({
    step:r.step,dueAt:r.dueAt,mistakes:int(r.mistakes,999),attempts:int(r.attempts,9999),
    lastMissedAt:Number.isFinite(r.lastMissedAt)&&r.lastMissedAt>=0?r.lastMissedAt:0,
    lastFocusedAt:Number.isFinite(r.lastFocusedAt)&&r.lastFocusedAt>=0?r.lastFocusedAt:0
   });
  }
  return Object.freeze({schema:1,cards:Object.freeze(cards)});
 };
 const intervals=Object.freeze([1,3,7,14,30]);
 function grade(raw,id,correct,now=Date.now()){
  const state=clean(raw),item=catalogMap[id];if(!item||!Number.isFinite(now)||now<0)return state;
  const r=state.cards[id],good=correct===true;
  const step=good?Math.min(5,(r?.step||0)+1):0;
  const next=Object.freeze({
   step,dueAt:good?now+intervals[step-1]*86400000:now+600000,
   mistakes:Math.min(999,(r?.mistakes||0)+(good?0:1)),
   attempts:Math.min(9999,(r?.attempts||0)+1),
   lastMissedAt:good?(r?.lastMissedAt||0):now,
   lastFocusedAt:r?.lastFocusedAt||0
  });
  return Object.freeze({schema:1,cards:Object.freeze({...state.cards,[id]:next})});
 }
 function finish(raw,ids=[],now=Date.now()){
  const state=clean(raw);if(!Array.isArray(ids)||!Number.isFinite(now)||now<0)return state;
  const cards={...state.cards};
  for(const id of [...new Set(ids)])if(cards[id])cards[id]=Object.freeze({...cards[id],lastFocusedAt:now});
  return Object.freeze({schema:1,cards:Object.freeze(cards)});
 }
 function suggest(raw,completedLessons=[],now=Date.now(),limit=4){
  const state=clean(raw),complete=new Set(Array.isArray(completedLessons)?completedLessons:[]),max=Math.max(0,Math.min(8,int(limit,8)));
  const items=catalog.filter(x=>complete.has(x.lessonId)&&state.cards[x.id]).map(item=>{
   const r=state.cards[item.id],due=r.dueAt<=now,missed=r.lastMissedAt>0&&r.lastMissedAt>r.lastFocusedAt;
   return {item,due,missed,mistakes:r.mistakes,step:r.step,lastMissedAt:r.lastMissedAt,score:(missed?100000:0)+(due?10000:0)+r.mistakes*20-r.step};
  }).filter(x=>x.due||x.missed)
    .sort((x,y)=>y.score-x.score||y.lastMissedAt-x.lastMissedAt||catalog.indexOf(x.item)-catalog.indexOf(y.item));
  const chosen=items.slice(0,max).map(x=>x.item.id);
  const due=items.filter(x=>x.due).length,weak=items.filter(x=>x.missed).length;
  const byGroup=Object.freeze(groups.map(g=>Object.freeze({
   kind:g.kind,available:items.filter(x=>x.item.kind===g.kind).length,
   selected:chosen.filter(id=>catalogMap[id].kind===g.kind).length
  })));
  return Object.freeze({schema:1,total:catalog.length,learned:Object.keys(state.cards).length,
   eligible:items.length,due,weak,ids:Object.freeze(chosen),groups:byGroup});
 }
 const legacyUi=Object.freeze({
  tr:{heading:'Harf ve Okuma Pekiştirmesi',intro:'Zorlandığın harf, hareke, okuma ve kelime kurma sorularını yeniden çalış.',start:'Okuma Tekrarını Başlat',empty:'Önce bir yazılı derste soru çöz. Hatalar ve zamanı gelen tekrarlar burada görünür.',letters:'Harfler',vowels:'Harekeler',reading:'Okuma işaretleri',words:'Kelime kurma',question:'Doğru Arapça biçimi seç.',build:'Parçaları doğru sırayla birleştir.',choose:'Bu ifade hangisi?',progress:'Pekiştirme',reset:'Yeniden dene',wrong:'Henüz doğru değil. Yeniden dene.',correct:'Doğru!',next:'Sonraki Kart',finish:'Okuma tekrarı tamamlandı!',back:'Arapça Derslerine Dön',note:'Bu sadece yazılı tanıma çalışmasıdır; sesli okuma ve tecvid değerlendirmesi değildir.',due:'Zamanı gelen',errors:'Hata yapılan'},
  en:{heading:'Reading Foundations Review',intro:'Revisit difficult letters, vowel signs, reading marks and word building.',start:'Start Reading Review',empty:'Practice a written lesson first. Mistakes and due cards will appear here.',letters:'Letters',vowels:'Vowels',reading:'Reading marks',words:'Build words',question:'Choose the correct Arabic form.',build:'Put the parts in the correct order.',choose:'Which form matches?',progress:'Review',reset:'Try Again',wrong:'Not quite. Try again.',correct:'Correct!',next:'Next Card',finish:'Reading review completed!',back:'Back to Arabic Lessons',note:'Written recognition only; not audio reading or Tajwid assessment.',due:'Due',errors:'Missed'},
  ar:{heading:'مراجعة الحروف والقراءة',intro:'راجع الحروف والحركات وعلامات القراءة وتركيب الكلمات التي صعبت عليك.',start:'ابدأ مراجعة القراءة',empty:'ابدأ بحل درس مكتوب لتظهر هنا الأخطاء والمراجعات المستحقة.',letters:'الحروف',vowels:'الحركات',reading:'علامات القراءة',words:'تركيب الكلمات',question:'اختر الشكل العربي الصحيح.',build:'رتّب الأجزاء ترتيبًا صحيحًا.',choose:'أي شكل يناسب؟',progress:'المراجعة',reset:'حاول مرة أخرى',wrong:'ليس صحيحًا بعد. حاول مجددًا.',correct:'صحيح!',next:'البطاقة التالية',finish:'اكتملت مراجعة القراءة!',back:'العودة إلى دروس العربية',note:'تدريب كتابي فقط، لا يقيس التلاوة أو التجويد.',due:'مستحقة',errors:'أخطاء'},
  de:{heading:'Buchstaben und Lesen üben',intro:'Wiederhole schwierige Buchstaben, Vokalzeichen, Lesemarken und Wortaufbau.',start:'Leseübung starten',empty:'Bearbeite zuerst eine Schriftlektion, dann erscheinen Fehler und fällige Karten.',letters:'Buchstaben',vowels:'Vokale',reading:'Lesemarken',words:'Wortaufbau',question:'Wähle die richtige arabische Form.',build:'Ordne die Teile richtig.',choose:'Welche Form passt?',progress:'Wiederholung',reset:'Erneut versuchen',wrong:'Noch nicht richtig. Versuch es erneut.',correct:'Richtig!',next:'Nächste Karte',finish:'Leseübung beendet!',back:'Zurück zu Arabisch',note:'Nur schriftliche Übung, keine Prüfung der Rezitation oder des Tadschwids.',due:'Fällig',errors:'Fehler'},
  fr:{heading:'Révision des lettres et de la lecture',intro:'Revois les lettres, voyelles, signes et assemblages de mots difficiles.',start:'Réviser la lecture',empty:'Commence par un cours écrit. Les erreurs et cartes dues apparaîtront ici.',letters:'Lettres',vowels:'Voyelles',reading:'Signes de lecture',words:'Assembler des mots',question:'Choisis la bonne forme arabe.',build:'Remets les morceaux dans l’ordre.',choose:'Quelle forme correspond ?',progress:'Révision',reset:'Réessayer',wrong:'Ce n’est pas encore exact. Réessaie.',correct:'Correct !',next:'Carte suivante',finish:'Révision de lecture terminée !',back:'Retour aux leçons',note:'Exercice écrit uniquement, sans évaluation de récitation ou du tajwid.',due:'Dues',errors:'Erreurs'}
 });
 const ui=Object.freeze(Object.fromEntries(Object.entries(legacyUi).map(([locale,words])=>[
  locale,Object.freeze(Object.fromEntries(Object.entries(words).map(([key,value])=>[
   'foundation'+key.charAt(0).toUpperCase()+key.slice(1),value
  ])))
 ])));
 window.DEEN_ARABIC_FOUNDATION_REVIEW=Object.freeze({
  version:1,catalog,byId:catalogMap,cardIds,groups,ui,clean,grade,finish,suggest,
  coverage:'28 letters, 9 vowel items, 9 reading items, 9 word items; written only'
 });
})();
