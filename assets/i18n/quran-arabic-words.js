/* DEEN Quran Arabic • Phase 5: guided written word-building.
   Quran references are written examples, not certified audio recitation. */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_WORDS)return;
 const item=(id,glyph,roman,parts,reference,excerpt)=>Object.freeze({
  id,glyph,names:Object.freeze({tr:roman,en:roman,ar:roman,de:roman,fr:roman}),
  parts:Object.freeze([...parts]),reference,excerpt
 });
 const syllabus=[
  {id:'syllables',index:13,kind:'syllable-build',items:[
   item('huwa-join','هُوَ','huwa',['هُ','وَ'],'112:1','قُلْ هُوَ اللَّهُ أَحَدٌ'),
   item('khalaqa-join','خَلَقَ','khalaqa',['خَ','لَ','قَ'],'96:2','خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ'),
   item('qala-join','قَالَ','qāla',['قَا','لَ'],'20:25','قَالَ رَبِّ اشْرَحْ لِي صَدْرِي')
  ]},
  {id:'words',index:14,kind:'word-build',items:[
   item('qul-build','قُلْ','qul',['قُ','لْ'],'112:1','قُلْ هُوَ اللَّهُ أَحَدٌ'),
   item('lam-build','لَمْ','lam',['لَ','مْ'],'112:3','لَمْ يَلِدْ وَلَمْ يُولَدْ'),
   item('bismi-build','بِسْمِ','bismi',['بِ','سْ','مِ'],'1:1','بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')
  ]},
  {id:'quran',index:15,kind:'quran-find',items:[
   item('qul-find','قُلْ','qul',[],'112:1','قُلْ هُوَ اللَّهُ أَحَدٌ'),
   item('huwa-find','هُوَ','huwa',[],'112:1','قُلْ هُوَ اللَّهُ أَحَدٌ'),
   item('bismi-find','بِسْمِ','bismi',[],'1:1','بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')
  ]}
 ];
 const lessons=Object.freeze(syllabus.map(g=>Object.freeze({
  id:'arabic-word-'+g.id+'-01',index:g.index,kind:g.kind,items:Object.freeze(g.items)
 })));
 for(const lesson of lessons)for(const word of lesson.items){
  if(word.parts.length&&word.parts.join('')!==word.glyph)throw Error('ARABIC_WORD_PARTS_MISMATCH:'+word.id);
  if(!word.excerpt.includes(word.glyph))throw Error('ARABIC_WORD_REFERENCE_MISMATCH:'+word.id);
 }
 window.DEEN_ARABIC_WORDS=Object.freeze({
  version:1,startIndex:13,lessonCount:3,lessons,
  audioStatus:'awaiting-verified-recitation',coverage:'introductory-written-word-reading'
 });
})();
