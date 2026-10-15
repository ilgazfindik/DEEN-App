/* DEEN Arabic phase 7: introductory word meaning, grammatical roles, verse word order.
   Source: Al-Ikhlas 112:1-2 and Al-Fatiha 1:1. Text remains Arabic.
   Glosses are short study aids, NOT full tafsir or a certified translation. */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_MEANING)return;
 const freeze=o=>Object.freeze(o);
 const word=(id,glyph,gloss,role,reference,excerpt)=>freeze({
  id,glyph,gloss:freeze(gloss),role:freeze(role),reference,excerpt
 });
 const ayah='قُلْ هُوَ ٱللَّهُ أَحَدٌ';
 const words=freeze([
  word('qul','قُلْ',{tr:'De!',en:'Say!',de:'Sag!',fr:'Dis !',ar:'اطلب منه أن يقول'},
   {tr:'Emir fiili',en:'Imperative verb',de:'Verb im Imperativ',fr:'Verbe à l’impératif',ar:'فعل أمر'},'112:1',ayah),
  word('huwa','هُوَ',{tr:'O (erkek)',en:'He',de:'Er',fr:'Il',ar:'ضمير الغائب المفرد'},
   {tr:'Şahıs zamiri',en:'Personal pronoun',de:'Personalpronomen',fr:'Pronom personnel',ar:'ضمير منفصل'},'112:1',ayah),
  word('allahu','ٱللَّهُ',{tr:'Allah',en:'Allah',de:'Allah',fr:'Allah',ar:'اسم الله تعالى'},
   {tr:'Özel isim',en:'Proper name',de:'Eigenname',fr:'Nom propre',ar:'اسم عَلَم'},'112:1',ayah),
  word('ahad','أَحَدٌ',{tr:'Tek, biricik',en:'The One',de:'Der Eine',fr:'L’Unique',ar:'الواحد الذي لا شريك له'},
   {tr:'Birliği ifade eden isim',en:'Noun expressing oneness',de:'Nomen für Einzigkeit',fr:'Nom exprimant l’unicité',ar:'اسم يدل على الوحدانية'},'112:1',ayah)
 ]);
 const verses=freeze([
  freeze({id:'ikhlas-1',glyph:ayah,reference:'112:1',parts:freeze(['قُلْ','هُوَ','ٱللَّهُ','أَحَدٌ']),meaning:freeze({
   tr:'De ki: O Allah tektir.',en:'Say: He is Allah, the One.',de:'Sprich: Er ist Allah, der Eine.',fr:'Dis : Il est Allah, l’Unique.',ar:'قل: هو الله الواحد.'
  })}),
  freeze({id:'ikhlas-2',glyph:'ٱللَّهُ ٱلصَّمَدُ',reference:'112:2',parts:freeze(['ٱللَّهُ','ٱلصَّمَدُ']),meaning:freeze({
   tr:'Allah, Samed’dir.',en:'Allah, the Eternal Refuge.',de:'Allah, der Unabhängige, auf den alle angewiesen sind.',fr:'Allah, Celui dont tous dépendent.',ar:'الله الصمد الذي يُقصد في الحوائج.'
  })}),
  freeze({id:'fatiha-1',glyph:'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',reference:'1:1',
   parts:freeze(['بِسْمِ','ٱللَّهِ','ٱلرَّحْمَـٰنِ','ٱلرَّحِيمِ']),meaning:freeze({
    tr:'Rahmân ve Rahîm olan Allah’ın adıyla.',en:'In the name of Allah, the Most Compassionate, the Most Merciful.',
    de:'Im Namen Allahs, des Allerbarmers, des Barmherzigen.',
    fr:'Au nom d’Allah, le Tout Miséricordieux, le Très Miséricordieux.',
    ar:'باسم الله الرحمن الرحيم.'
   })})
 ]);
 const lessons=freeze([
  freeze({id:'arabic-meaning-gloss-01',index:18,kind:'meaning-gloss',items:words}),
  freeze({id:'arabic-meaning-role-01',index:19,kind:'meaning-role',items:words}),
  freeze({id:'arabic-meaning-order-01',index:20,kind:'meaning-order',items:verses})
 ]);
 for(const v of verses){if(v.parts.join(' ')!==v.glyph)throw Error('ARABIC_MEANING_VERSE_MISMATCH:'+v.id)}
 for(const w of words)if(!w.excerpt.includes(w.glyph))throw Error('ARABIC_MEANING_WORD_MISMATCH:'+w.id);
 for(const lesson of lessons)for(const item of lesson.items){
  for(const locale of ['tr','en','ar','de','fr']){
   if(!item[lesson.kind==='meaning-role'?'role':lesson.kind==='meaning-order'?'meaning':'gloss'][locale])
    throw Error('ARABIC_MEANING_LOCALE_MISSING:'+lesson.id+':'+item.id+':'+locale);
  }
 }
 window.DEEN_ARABIC_MEANING=freeze({
  version:1,startIndex:18,lessonCount:3,lessons,
  sources:freeze(['Quran 112:1','Quran 112:2','Quran 1:1']),
  availability:'independent-of-pending-listening-audio',contentType:'introductory-word-glosses-not-tafsir'
 });
})();
