/* DEEN Arabic V2 / Pack D: 100 orthographic reading questions.
 * 34 sukūn + 33 shadda + 27 madd + 6 tanwīn examples.
 * Forms are didactic writing examples, not quoted Qur'an or certified audio.
 * No invented recitations. Tanwīn is introduced as written mark contrast.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_QUESTIONS_PACK_D)return;
 const letters=window.DEEN_ARABIC_LETTERS,reading=window.DEEN_ARABIC_READING,
  engine=window.DEEN_ARABIC_QUESTIONS_V2;
 if(!letters||!reading||!engine)throw Error('ARABIC_PACK_D_DEPENDENCIES_MISSING');
 const localized=(tr,en,ar,de,fr)=>Object.freeze({tr,en,ar,de,fr});
 const locales=Object.freeze(['tr','en','ar','de','fr']);
 const stageSukun=reading.lessons[0].id,stageShadda=reading.lessons[1].id,
  stageMadd=reading.lessons[2].id;
 const vowels=Object.freeze([
  {id:'fatha',mark:'\u064e',name:localized('üstün','fatḥa','فَتْحَة','Fatha','fatḥa'),sound:'a',
   long:'\u0627',longSound:'ā'},
  {id:'kasra',mark:'\u0650',name:localized('esre','kasra','كَسْرَة','Kasra','kasra'),sound:'i',
   long:'\u064a',longSound:'ī'},
  {id:'damma',mark:'\u064f',name:localized('ötre','ḍamma','ضَمَّة','Damma','ḍamma'),sound:'u',
   long:'\u0648',longSound:'ū'}
 ]);
 const consonants=letters.all.filter(x=>x.id!=='alif');
 if(consonants.length!==27||reading.lessons.length!==3)throw Error('PACK_D_READING_CONTRACT');
 const sukun='\u0652',shadda='\u0651';
 const options=(variants)=>Object.freeze(variants.map(x=>Object.freeze({id:x.id,glyph:x.glyph})));
 const distract=(kind,wrong,correct)=>localized(
  'Bu işaret '+wrong+' seçeneğini gösterir; '+correct+' isteniyor.',
  'This is the '+wrong+' form, but '+correct+' is required.',
  'هذا شكل '+wrong+'، والمطلوب '+correct+'.',
  'Das ist die Form '+wrong+'; gesucht ist '+correct+'.',
  'C’est la forme '+wrong+' ; il faut '+correct+'.'
 );
 const prompts=(kind,l,mark,extra)=>{
  const n=l?.names;
  if(kind==='sukun')return localized(
   n.tr+' harfinin cezimli biçimini seç.',
   'Choose '+n.en+' with sukūn (no short vowel).',
   'اختر حرف '+n.ar+' وعليه سكون.',
   'Wähle '+n.de+' mit Sukūn (ohne kurzen Vokal).',
   'Choisis '+n.fr+' avec soukoun (sans voyelle brève).');
  if(kind==='sukun-compare')return localized(
   'Örnekteki cezim işaretini '+n.tr+' harfinde bul.',
   'Find the same sukūn on '+n.en+' as in the example.',
   'اختر علامة السكون نفسها على حرف '+n.ar+'.',
   'Finde dasselbe Sukūn auf '+n.de+' wie im Beispiel.',
   'Retrouve le même soukoun sur '+n.fr+' que dans l’exemple.');
  if(kind==='shadda')return localized(
   n.tr+' harfinin şeddeli ve '+mark.name.tr+' biçimini seç.',
   'Choose '+n.en+' with shadda and '+mark.name.en+'.',
   'اختر حرف '+n.ar+' مشددًا مع '+mark.name.ar+'.',
   'Wähle '+n.de+' mit Schadda und '+mark.name.de+'.',
   'Choisis '+n.fr+' avec chadda et '+mark.name.fr+'.');
  if(kind==='shadda-compare')return localized(
   'Örnekteki şedde ve '+mark.name.tr+' birleşimini '+n.tr+' üzerinde bul.',
   'Find the same shadda and '+mark.name.en+' combination on '+n.en+'.',
   'اختر الشدة مع '+mark.name.ar+' على حرف '+n.ar+' كما في المثال.',
   'Finde die gleiche Schadda-'+mark.name.de+'-Kombination auf '+n.de+'.',
   'Retrouve la même combinaison chadda-'+mark.name.fr+' sur '+n.fr+'.');
  if(kind==='madd')return localized(
   n.tr+' harfinde kısa '+mark.sound+' sesini uzun '+mark.longSound+' sesine uzatan biçimi seç.',
   'Choose the long '+mark.longSound+' form of '+n.en+', not the short vowel.',
   'اختر صيغة المد الطويل '+mark.longSound+' مع حرف '+n.ar+'، لا الحركة القصيرة.',
   'Wähle die lange '+mark.longSound+'-Form von '+n.de+' statt des kurzen Vokals.',
   'Choisis la forme longue '+mark.longSound+' de '+n.fr+', pas la voyelle brève.');
  return localized(
   extra+' sözcüğünde '+mark.name.tr+' tenvinini (çift harekeyi) taşıyan biçimi seç.',
   'Choose '+extra+' with tanwīn '+mark.name.en+' (the doubled ending mark).',
   'اختر كلمة '+extra+' بتنوين '+mark.name.ar+' (الحركتان في آخر الاسم).',
   'Wähle '+extra+' mit Tanwīn '+mark.name.de+' (doppeltem Endzeichen).',
   'Choisis '+extra+' avec tanwīn '+mark.name.fr+' (double signe final).');
 };
 const explanations=(kind,l,mark,correct)=>{
  if(kind.startsWith('sukun'))return localized(
   correct+' cezimlidir: ünsüzün üzerinde kısa hareke yoktur.',
   correct+' carries sukūn: no short vowel follows this consonant.',
   'الحرف '+correct+' ساكن؛ لا حركة قصيرة له.',
   correct+' trägt Sukūn: auf den Konsonanten folgt kein kurzer Vokal.',
   correct+' porte un soukoun : aucune voyelle brève ne suit cette consonne.');
  if(kind.startsWith('shadda'))return localized(
   correct+' şedde ve '+mark.name.tr+' taşır; şedde ünsüzün pekiştirilmesini gösterir.',
   correct+' combines shadda and '+mark.name.en+'; shadda indicates consonant doubling.',
   correct+' يجمع بين الشدة و'+mark.name.ar+'؛ الشدة تدل على تضعيف الحرف.',
   correct+' kombiniert Schadda und '+mark.name.de+'; Schadda verdoppelt den Konsonanten.',
   correct+' combine chadda et '+mark.name.fr+' ; la chadda double la consonne.');
  if(kind==='madd')return localized(
   correct+' uzun '+mark.longSound+' biçimidir; kısa '+mark.sound+' sesinden farklıdır.',
   correct+' indicates long '+mark.longSound+', not the short '+mark.sound+' vowel.',
   correct+' يدل على المد الطويل '+mark.longSound+' لا الصوت القصير '+mark.sound+'.',
   correct+' zeigt langes '+mark.longSound+' statt kurzem '+mark.sound+'.',
   correct+' indique le son long '+mark.longSound+', non le bref '+mark.sound+'.');
  return localized(
   correct+' sonunda çift hareke vardır; tenvin tek hareke veya med değildir.',
   correct+' has a doubled final vowel sign (tanwīn), not a single vowel or madd.',
   correct+' فيه تنوين في آخر الاسم، وليس حركة مفردة ولا مدًّا.',
   correct+' trägt ein doppeltes Endvokalzeichen (Tanwīn), keinen einfachen Vokal oder Madd.',
   correct+' porte un double signe final (tanwīn), non une voyelle simple ou un madd.');
 };
 const all=[],bySkill={sukun:0,shadda:0,madd:0,tanwin:0},byStage={};
 const add=(id,kind,stage,skill,target,prompt,choices,correctId,mark,level,source)=>{
  if(choices.length!==4||new Set(choices.map(c=>c.id)).size!==4||
   new Set(choices.map(c=>c.glyph)).size!==4)throw Error('PACK_D_BAD_CHOICES_'+id);
  const correct=choices.find(c=>c.id===correctId);
  if(!correct)throw Error('PACK_D_MISSING_ANSWER_'+id);
  const why=Object.fromEntries(choices.filter(c=>c.id!==correctId)
   .map(c=>[c.id,distract(skill,c.id,correctId)]));
  all.push(Object.freeze({
   id:'pack-d-'+id,skill,stage,difficulty:level,type:'choice',target,
   prompt,choices:options(choices),correctAnswer:correctId,
   explanation:explanations(kind,null,mark,correct.glyph),
   distractorRationale:Object.freeze(why),locale:locales,source
  }));
  byStage[stage]=(byStage[stage]||0)+1;
  bySkill[skill]++;
 };
 const marksFor=l=>[
  {id:'sukun',glyph:l.glyph+sukun},
  ...vowels.map(v=>({id:v.id,glyph:l.glyph+v.mark}))
 ];
 consonants.forEach((l,i)=>{
  add('sukun-'+l.id,'sukun',stageSukun,'sukun',l.glyph,
   prompts('sukun',l),marksFor(l),'sukun',null,i<14?1:2,
   'Didactic sukūn form '+l.id);
 });
 const comparators=['ba','ta','mim','nun','lam','fa','qaf'];
 comparators.forEach((id,i)=>{
  const l=letters.get(id),sample=letters.get(i%2?'jim':'ha');
  if(!l||!sample||sample.id===id)throw Error('PACK_D_SUKUN_COMPARISON');
  add('sukun-match-'+id,'sukun-compare',stageSukun,'sukun',
   sample.glyph+sukun,prompts('sukun-compare',l),marksFor(l),'sukun',
   null,3,'Compare sukūn on '+sample.id+' with '+l.id);
 });
 const withShadda=(l)=>[
  ...vowels.map(v=>({id:v.id,glyph:l.glyph+shadda+v.mark})),
  {id:'no-shadda',glyph:l.glyph+vowels[0].mark}
 ];
 consonants.forEach((l,i)=>{
  const mark=vowels[i%3],opts=withShadda(l);
  add('shadda-'+l.id,'shadda',stageShadda,'shadda',l.glyph,
   prompts('shadda',l,mark),opts,mark.id,mark,i<14?2:3,
   'Didactic shadda form '+l.id+'/'+mark.id);
 });
 const doubles=['ba','ta','mim','nun','lam','fa'];
 doubles.forEach((id,i)=>{
  const l=letters.get(id),mark=vowels[i%3],sample=letters.get(i%2?'jim':'ha');
  const other=withShadda(l);
  add('shadda-match-'+id,'shadda-compare',stageShadda,'shadda',
   sample.glyph+shadda+mark.mark,prompts('shadda-compare',l,mark),
   other,mark.id,mark,3,'Compare shadda '+mark.id+' on '+sample.id+' and '+l.id);
 });
 const maddLetters=['ba','ta','tha','jim','lam','mim','nun','fa','qaf'];
 maddLetters.forEach((id,i)=>{
  const l=letters.get(id);
  for(const mark of vowels){
   const variants=[
    ...vowels.map(v=>({id:v.id,glyph:l.glyph+v.mark+v.long})),
    {id:'short',glyph:l.glyph+mark.mark}
   ];
   add('madd-'+id+'-'+mark.id,'madd',stageMadd,'madd',
    l.glyph+mark.mark,prompts('madd',l,mark),variants,mark.id,mark,i<4?2:3,
    'Didactic long-vowel form '+l.id+'/'+mark.id);
  }
 });
 // Written noun examples use legitimate Arabic indefinite endings.
 // Fatḥ-tanwīn requires its orthographic alif on these two nouns.
 const nouns=[
  {id:'kitab',base:'كِتَاب',fath:'كِتَابًا',kasr:'كِتَابٍ',damm:'كِتَابٌ',plain:'كِتَابَ'},
  {id:'ilm',base:'عِلْم',fath:'عِلْمًا',kasr:'عِلْمٍ',damm:'عِلْمٌ',plain:'عِلْمَ'}
 ];
 const tanwinNames=[
  {id:'fath',name:localized('çift üstün','fatḥ-tanwīn','تنوين الفتح','Fath-Tanwīn','tanwīn fatḥ')},
  {id:'kasr',name:localized('çift esre','kasr-tanwīn','تنوين الكسر','Kasr-Tanwīn','tanwīn kasr')},
  {id:'damm',name:localized('çift ötre','ḍamm-tanwīn','تنوين الضم','Damm-Tanwīn','tanwīn ḍamm')}
 ];
 nouns.forEach(noun=>tanwinNames.forEach(mark=>{
  const opts=[
   ...tanwinNames.map(t=>({id:t.id,glyph:noun[t.id]})),
   {id:'plain',glyph:noun.plain}
  ];
  add('tanwin-'+noun.id+'-'+mark.id,'tanwin',stageMadd,'tanwin',
   noun.base,prompts('tanwin',null,mark,noun.base),opts,mark.id,mark,3,
   'Illustrative nominal tanwīn ending '+noun.id+'/'+mark.id);
 }));
 if(all.length!==100||bySkill.sukun!==34||bySkill.shadda!==33||
  bySkill.madd!==27||bySkill.tanwin!==6||
  byStage[stageSukun]!==34||byStage[stageShadda]!==33||byStage[stageMadd]!==33||
  new Set(all.map(q=>q.id)).size!==100)throw Error('ARABIC_PACK_D_COUNT');
 if(all.some(q=>q.audioRef||q.choices.some(c=>c.audioRef)))throw Error('PACK_D_AUDIO_UNAPPROVED');
 const result=engine.registerPack({id:'arabic-reading-pack-d-100',questions:all});
 window.DEEN_ARABIC_QUESTIONS_PACK_D=Object.freeze({
  version:1,id:result.id,count:result.count,
  distribution:Object.freeze({...byStage}),bySkill:Object.freeze({...bySkill}),
  questionIds:Object.freeze(all.map(q=>q.id)),
  audioPolicy:'no-syllable-or-reading-audio-without-verified-voice',
  sourcePolicy:'didactic-orthographic-examples-not-quran-verses'
 });
})();