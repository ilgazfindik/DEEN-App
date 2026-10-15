/* DEEN Arabic Reading • Phase 4: sukūn, shadda and first lengthening patterns.
   Arabic examples are orthographic study items, not certified audio recitation.
   Short vowels/letters are prerequisites; lessons stay free. */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_READING)return;
 const item=(id,glyph,names,markId)=>Object.freeze({
  id,glyph,markId,names:Object.freeze(names)
 });
 const sets=[
  {id:'sukun',index:10,title:'sukun',items:[
   item('ba-sukun','بْ',{tr:'Cezimli Be',en:'Bā with sukūn',de:'Bā mit Sukūn',fr:'Bā avec sukūn',ar:'باء ساكنة'},'sukun'),
   item('ta-sukun','تْ',{tr:'Cezimli Te',en:'Tā with sukūn',de:'Tā mit Sukūn',fr:'Tā avec sukūn',ar:'تاء ساكنة'},'sukun'),
   item('mim-sukun','مْ',{tr:'Cezimli Mim',en:'Mīm with sukūn',de:'Mīm mit Sukūn',fr:'Mīm avec sukūn',ar:'ميم ساكنة'},'sukun')
  ]},
  {id:'shadda',index:11,title:'shadda',items:[
   item('ba-shadda-fatha','بَّ',{tr:'Be + Şedde + Üstün',en:'Bā + shadda + fatḥa',de:'Bā + Schadda + Fatha',fr:'Bā + shadda + fatḥa',ar:'باء مشددة مفتوحة'},'shadda-fatha'),
   item('ba-shadda-kasra','بِّ',{tr:'Be + Şedde + Esre',en:'Bā + shadda + kasra',de:'Bā + Schadda + Kasra',fr:'Bā + shadda + kasra',ar:'باء مشددة مكسورة'},'shadda-kasra'),
   item('ba-shadda-damma','بُّ',{tr:'Be + Şedde + Ötre',en:'Bā + shadda + ḍamma',de:'Bā + Schadda + Damma',fr:'Bā + shadda + ḍamma',ar:'باء مشددة مضمومة'},'shadda-damma')
  ]},
  {id:'madd',index:12,title:'madd',items:[
   item('ba-madd-alif','بَا',{tr:'Bâ — uzun a',en:'Bā — long ā',de:'Bā — langes ā',fr:'Bā — ā long',ar:'بَا — مدّ بالألف'},'madd-alif'),
   item('ba-madd-ya','بِي',{tr:'Bî — uzun i',en:'Bī — long ī',de:'Bī — langes ī',fr:'Bī — ī long',ar:'بِي — مدّ بالياء'},'madd-ya'),
   item('ba-madd-waw','بُو',{tr:'Bû — uzun u',en:'Bū — long ū',de:'Bū — langes ū',fr:'Bū — ū long',ar:'بُو — مدّ بالواو'},'madd-waw')
  ]}
 ];
 const lessons=Object.freeze(sets.map(x=>Object.freeze({
  id:'arabic-reading-'+x.id+'-01',index:x.index,kind:x.id,title:x.title,
  items:Object.freeze(x.items)
 })));
 window.DEEN_ARABIC_READING=Object.freeze({
  version:1,lessons,lessonCount:3,startIndex:10,
  marks:Object.freeze({sukun:'\u0652',shadda:'\u0651'}),
  audioStatus:'awaiting-verified-recitation',
  coverage:'recognition-introduction-not-full-tajwid'
 });
})();