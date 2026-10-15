/* DEEN Arabic foundations • Phase 3: short vowels and first syllables.
   3 harakat with dotted-circle display and two full 3-form practice sets.
   No synthetic pronunciation, external audio or paid gate. */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_HARAKAT)return;
 const names={
  fatha:{tr:'Üstün',en:'Fatḥa',ar:'فَتْحَة',de:'Fatha',fr:'Fatḥa'},
  kasra:{tr:'Esre',en:'Kasra',ar:'كَسْرَة',de:'Kasra',fr:'Kasra'},
  damma:{tr:'Ötre',en:'Ḍamma',ar:'ضَمَّة',de:'Damma',fr:'Ḍamma'}
 };
 const marks=Object.freeze([
  Object.freeze({id:'fatha',glyph:'◌َ',mark:'\u064E',vowel:'a',names:Object.freeze(names.fatha)}),
  Object.freeze({id:'kasra',glyph:'◌ِ',mark:'\u0650',vowel:'i',names:Object.freeze(names.kasra)}),
  Object.freeze({id:'damma',glyph:'◌ُ',mark:'\u064F',vowel:'u',names:Object.freeze(names.damma)})
 ]);
 const syllableSet=(letter,glyph)=>Object.freeze(marks.map(mark=>Object.freeze({
  id:letter+'-'+mark.id,
  letter,markId:mark.id,glyph:glyph+mark.mark,
  names:Object.freeze({tr:letter==='ba'?'b'+mark.vowel:'t'+mark.vowel,
   en:letter==='ba'?'b'+mark.vowel:'t'+mark.vowel,
   de:letter==='ba'?'b'+mark.vowel:'t'+mark.vowel,
   fr:letter==='ba'?'b'+mark.vowel:'t'+mark.vowel,
   ar:letter==='ba'?'b'+mark.vowel:'t'+mark.vowel})
 })));
 const lessons=Object.freeze([
  Object.freeze({id:'arabic-harakat-01',index:7,kind:'harakat',items:marks}),
  Object.freeze({id:'arabic-harakat-02',index:8,kind:'syllables',letterId:'ba',items:syllableSet('ba','ب')}),
  Object.freeze({id:'arabic-harakat-03',index:9,kind:'syllables',letterId:'ta',items:syllableSet('ta','ت')})
 ]);
 window.DEEN_ARABIC_HARAKAT=Object.freeze({
  version:1,marks,lessons,lessonCount:3,
  markById:Object.freeze(Object.fromEntries(marks.map(x=>[x.id,x]))),
  audioStatus:'awaiting-verified-recordings'
 });
})();