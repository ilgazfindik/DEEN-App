/* DEEN Arabic foundations • 28-letter curriculum, no unverified audio.
   "medial" is unavailable for six non-left-joining letters.
   Connection strokes use tatweel solely as contextual shape examples. */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_LETTERS)return;
 const raw=[
 // id, letter, Turkish name, conventional transliteration, Arabic name, joins following
 ['alif','ا','Elif','Alif','ألف',false],
 ['ba','ب','Be','Bāʾ','باء',true],
 ['ta','ت','Te','Tāʾ','تاء',true],
 ['tha','ث','Se','Thāʾ','ثاء',true],
 ['jim','ج','Cim','Jīm','جيم',true],
 ['hha','ح','Ha','Ḥāʾ','حاء',true],
 ['kha','خ','Hı','Khāʾ','خاء',true],
 ['dal','د','Dal','Dāl','دال',false],
 ['dhal','ذ','Zel','Dhāl','ذال',false],
 ['ra','ر','Ra','Rāʾ','راء',false],
 ['zay','ز','Ze','Zāy','زاي',false],
 ['sin','س','Sin','Sīn','سين',true],
 ['shin','ش','Şın','Shīn','شين',true],
 ['sad','ص','Sad','Ṣād','صاد',true],
 ['dad','ض','Dad','Ḍād','ضاد',true],
 ['tta','ط','Tı','Ṭāʾ','طاء',true],
 ['zza','ظ','Zı','Ẓāʾ','ظاء',true],
 ['ayn','ع','Ayn','ʿAyn','عين',true],
 ['ghayn','غ','Gayn','Ghayn','غين',true],
 ['fa','ف','Fe','Fāʾ','فاء',true],
 ['qaf','ق','Kaf (ق)','Qāf','قاف',true],
 ['kaf','ك','Kef','Kāf','كاف',true],
 ['lam','ل','Lam','Lām','لام',true],
 ['mim','م','Mim','Mīm','ميم',true],
 ['nun','ن','Nun','Nūn','نون',true],
 ['ha','ه','He','Hāʾ','هاء',true],
 ['waw','و','Vav','Wāw','واو',false],
 ['ya','ي','Ye','Yāʾ','ياء',true]
 ];
 const lessonIds=[
  ['alif','ba','ta'],
  ['tha','jim','hha','kha'],
  ['dal','dhal','ra','zay'],
  ['sin','shin','sad','dad'],
  ['tta','zza','ayn','ghayn'],
  ['fa','qaf','kaf','lam'],
  ['mim','nun','ha','waw','ya']
 ];
 const all=Object.freeze(raw.map(([id,glyph,tr,roman,ar,joinsNext],i)=>{
  // Arabic connects to the preceding letter for every letter; only
  // these 22 letters connect on to the next letter.
  const forms=Object.freeze({
   isolated:glyph,
   initial:joinsNext?glyph+'ـ':glyph,
   medial:joinsNext?'ـ'+glyph+'ـ':null,
   final:'ـ'+glyph
  });
  return Object.freeze({id,order:i+1,glyph,names:Object.freeze({tr,en:roman,de:roman,fr:roman,ar}),joinsNext,forms});
 }));
 const byId=Object.freeze(Object.fromEntries(all.map(letter=>[letter.id,letter])));
 const lessons=Object.freeze(lessonIds.map((ids,index)=>Object.freeze({
  id:'arabic-letters-'+String(index+1).padStart(2,'0'),
  index,kind:'recognition',letterIds:Object.freeze(ids),
  letters:Object.freeze(ids.map(id=>byId[id]))
 })));
 const course=Object.freeze({version:2,count:28,lessonCount:7,all,lessons,get:id=>byId[id]||null});
 window.DEEN_ARABIC_LETTERS=course;
})();