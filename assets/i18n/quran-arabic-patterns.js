/* DEEN Arabic — Phase 9: additional Quran vocabulary and simple written patterns.
 * Short study glosses are not a complete translation or tafsir.
 * Verified excerpts: An-Nas 114:1-3, Al-Ikhlas 112:2.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_PATTERNS)return;
 const langs=Object.freeze(['tr','en','ar','de','fr']);
 const freeze=o=>Object.freeze(o);
 function card(id,glyph,reference,excerpt,gloss,kind,role){
  if(!excerpt.includes(glyph))throw Error('ARABIC_PATTERN_EXCERPT_MISMATCH:'+id);
  for(const lang of langs)if(!gloss?.[lang]||(role&&!role[lang]))throw Error('ARABIC_PATTERN_LOCALE_MISSING:'+id+':'+lang);
  return freeze({id,glyph,reference,excerpt,gloss:freeze(gloss),kind,role:role?freeze(role):null});
 }
 const vocabulary=freeze([
  card('pv-people','ٱلنَّاسِ','114:1','قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
   {tr:'İnsanlar',en:'Humankind',ar:'البشر',de:'Menschen',fr:'Les êtres humains'},'vocab'),
  card('pv-king','مَلِكِ','114:2','مَلِكِ ٱلنَّاسِ',
   {tr:'Hükümdar',en:'King / Sovereign',ar:'صاحب الملك',de:'König / Herrscher',fr:'Roi / Souverain'},'vocab'),
  card('pv-deity','إِلَٰهِ','114:3','إِلَٰهِ ٱلنَّاسِ',
   {tr:'İlah',en:'God / Deity',ar:'الإله المعبود',de:'Gott / Gottheit',fr:'Dieu / Divinité'},'vocab'),
  card('pv-samad','ٱلصَّمَدُ','112:2','ٱللَّهُ ٱلصَّمَدُ',
   {tr:'Samed: herkesin muhtaç olduğu, kendisi muhtaç olmayan',en:'As-Samad: the One all depend upon',ar:'الصمد: الذي تقصده الخلائق في حوائجها',de:'As-Samad: auf Ihn sind alle angewiesen',fr:'As-Samad : Celui dont tous dépendent'},'vocab')
 ]);
 const expressions=freeze([
  card('px-rabb','بِرَبِّ ٱلنَّاسِ','114:1','قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
   {tr:'İnsanların Rabbine',en:'In the Lord of humankind',ar:'برب البشر',de:'Beim Herrn der Menschen',fr:'Auprès du Seigneur des hommes'},'phrase'),
  card('px-malik','مَلِكِ ٱلنَّاسِ','114:2','مَلِكِ ٱلنَّاسِ',
   {tr:'İnsanların hükümdarı',en:'King of humankind',ar:'ملك البشر',de:'König der Menschen',fr:'Roi des hommes'},'phrase'),
  card('px-ilah','إِلَٰهِ ٱلنَّاسِ','114:3','إِلَٰهِ ٱلنَّاسِ',
   {tr:'İnsanların ilahı',en:'God of humankind',ar:'إله البشر',de:'Gott der Menschen',fr:'Dieu des hommes'},'phrase'),
  card('px-samad','ٱللَّهُ ٱلصَّمَدُ','112:2','ٱللَّهُ ٱلصَّمَدُ',
   {tr:'Allah Samed’dir',en:'Allah, the Eternal Refuge',ar:'الله الصمد',de:'Allah, auf den alle angewiesen sind',fr:'Allah, Celui dont tous dépendent'},'phrase')
 ]);
 const structures=freeze([
  card('ps-preposition','بِرَبِّ ٱلنَّاسِ','114:1','قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
   {tr:'İnsanların Rabbine',en:'In the Lord of humankind',ar:'برب البشر',de:'Beim Herrn der Menschen',fr:'Auprès du Seigneur des hommes'},'structure',
   {tr:'Edat + isim tamlaması',en:'Preposition + genitive phrase',ar:'حرف جر + تركيب إضافي',de:'Präposition + Genitivverbindung',fr:'Préposition + construction génitive'}),
  card('ps-idafa','مَلِكِ ٱلنَّاسِ','114:2','مَلِكِ ٱلنَّاسِ',
   {tr:'İnsanların hükümdarı',en:'King of humankind',ar:'ملك البشر',de:'König der Menschen',fr:'Roi des hommes'},'structure',
   {tr:'İsim tamlaması (izafet)',en:'Genitive (idafa) construction',ar:'تركيب إضافي',de:'Genitivverbindung (Idafa)',fr:'Construction génitive (idafa)'}),
  card('ps-nominal','ٱللَّهُ ٱلصَّمَدُ','112:2','ٱللَّهُ ٱلصَّمَدُ',
   {tr:'Allah Samed’dir',en:'Allah, the Eternal Refuge',ar:'الله الصمد',de:'Allah, der Unabhängige',fr:'Allah, Celui dont tous dépendent'},'structure',
   {tr:'İsim cümlesi',en:'Nominal sentence',ar:'جملة اسمية',de:'Nominalsatz',fr:'Phrase nominale'}),
  card('ps-verbs','قُلْ أَعُوذُ','114:1','قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
   {tr:'De ki: Sığınırım',en:'Say: I seek refuge',ar:'قل أعتصم',de:'Sprich: Ich suche Zuflucht',fr:'Dis : Je cherche refuge'},'structure',
   {tr:'Emir + geniş/şimdiki zaman fiili',en:'Imperative + imperfect verb',ar:'فعل أمر + فعل مضارع',de:'Imperativ + Präsensverb',fr:'Impératif + verbe à l’inaccompli'})
 ]);
 const lessons=freeze([
  freeze({id:'arabic-pattern-vocabulary-01',index:24,kind:'pattern-vocab',items:vocabulary}),
  freeze({id:'arabic-pattern-context-01',index:25,kind:'pattern-context',items:expressions}),
  freeze({id:'arabic-pattern-structure-01',index:26,kind:'pattern-structure',items:structures})
 ]);
 const reviewCards=freeze([...vocabulary,...expressions]);
 const unique=new Set([...reviewCards,...structures].map(x=>x.id));
 if(unique.size!==12)throw Error('ARABIC_PATTERN_DUPLICATE_ID');
 window.DEEN_ARABIC_PATTERNS=freeze({
  version:1,startIndex:24,lessonCount:3,lessons,reviewCards,
  cardIds:freeze(reviewCards.map(x=>x.id)),reviewTotal:8,
  sourceRefs:freeze(['112:2','114:1','114:2','114:3']),
  contentType:'introductory-writing-not-tafsir-or-recitation'
 });
})();
