/* DEEN Arabic V2 — Pack G. 300 original written-practice questions.
 * 56 contextual letter-form choices; 81 short-vowel tasks;
 * 81 sukun/shadda/madd contrasts; 82 spelling and word-building tasks.
 * Didactic Modern Standard Arabic examples are NOT Qur'an quotations.
 * No audio, automatic recitation, theological gloss, or user-data migration.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_QUESTIONS_PACK_G)return;
 const course=window.DEEN_ARABIC_LETTERS;
 const engine=window.DEEN_ARABIC_QUESTIONS_V2;
 if(!course||!engine)throw Error('ARABIC_PACK_G_DEPENDENCIES_MISSING');
 const locales=Object.freeze(['tr','en','ar','de','fr']);
 const t=(tr,en,ar,de,fr)=>Object.freeze({tr,en,ar,de,fr});
 const questions=[],bySkill={},byStage={};
 const source='Original MSA teaching examples — not quoted Quran or certified recitation';
 function add(id,stage,skill,target,correct,wrongs,prompt,explanation,difficulty){
  if(!/^[a-z0-9-]+$/.test(id)||new Set(wrongs).size!==3||wrongs.includes(correct))
   throw Error('PACK_G_INVALID_DISTRACTORS:'+id);
  const options=[
   {id:'answer',glyph:correct},
   ...wrongs.map((glyph,i)=>({id:'wrong-'+(i+1),glyph}))
  ];
  const rationale=Object.fromEntries(options.slice(1).map(c=>[c.id,t(
   '«'+c.glyph+'» bu soruda aranan yazılı biçim değil.',
   c.glyph+' is not the written form requested here.',
   'الصيغة '+c.glyph+' ليست المطلوبة في هذا السؤال.',
   c.glyph+' ist hier nicht die gesuchte Schreibform.',
   c.glyph+' n’est pas la graphie demandée ici.'
  )]));
  const question=Object.freeze({id:'pack-g-'+id,stage,skill,target,
   difficulty,type:'choice',prompt,explanation,
   choices:Object.freeze(options.map(Object.freeze)),correctAnswer:'answer',
   distractorRationale:Object.freeze(rationale),locale:locales,source});
  questions.push(question);
  byStage[stage]=(byStage[stage]||0)+1;
  bySkill[skill]=(bySkill[skill]||0)+1;
 }
 const letters=course.all,consonants=letters.filter(l=>l.id!=='alif');
 if(letters.length!==28||consonants.length!==27)throw Error('PACK_G_LETTER_SOURCE_CHANGED');
 // A: 28 named letters × two genuinely different positional recognition skills.
 letters.forEach((l,i)=>{
  const distractors=[1,2,3].map(n=>letters[(i+n)%letters.length]);
  for(const form of ['final','initial']){
   const glyph=form==='final'?l.forms.final:l.forms.initial;
   const others=distractors.map(x=>form==='final'?x.forms.final:x.forms.initial);
   add('letter-'+l.id+'-'+form,course.lessons.find(x=>x.letterIds.includes(l.id)).id,
    'letter-position-'+form,l.names.ar,glyph,others,
    form==='final'?t(
     l.names.tr+' harfinin kelime sonundaki yazılı biçimini seç.',
     'Choose the final form of '+l.names.en+'.',
     'اختر الشكل النهائي لحرف '+l.names.ar+'.',
     'Wähle die Endform von '+l.names.de+'.',
     'Choisis la forme finale de '+l.names.fr+'.'
    ):t(
     l.names.tr+' harfinin kelime başındaki biçimini seç.',
     'Choose the beginning-of-word form of '+l.names.en+'.',
     'اختر شكل حرف '+l.names.ar+' في أول الكلمة.',
     'Wähle die Anfangsform von '+l.names.de+'.',
     'Choisis la forme de début du mot de '+l.names.fr+'.'
    ),t(
     l.names.tr+' harfinin bu konumdaki biçimi «'+glyph+'» şeklindedir.',
     'The corresponding written form of '+l.names.en+' is '+glyph+'.',
     'الشكل المطلوب لحرف '+l.names.ar+' هو '+glyph+'.',
     'Die passende Form von '+l.names.de+' ist '+glyph+'.',
     'La bonne forme de '+l.names.fr+' est '+glyph+'.'
    ),form==='final'?2:1);
  }
 });
 // B: 27 consonants × 3 distinct vowel targets. The base consonant, not
 // a pre-vowelled answer, is shown as the prompt to avoid giving away the answer.
 const vowelMarks=[
  {id:'fatha',mark:'\u064e',sound:'a',name:t('üstün','fatḥa','فَتْحَة','Fatha','fatḥa')},
  {id:'kasra',mark:'\u0650',sound:'i',name:t('esre','kasra','كَسْرَة','Kasra','kasra')},
  {id:'damma',mark:'\u064f',sound:'u',name:t('ötre','ḍamma','ضَمَّة','Damma','ḍamma')}
 ];
 for(const l of consonants)for(const v of vowelMarks){
  const correct=l.glyph+v.mark;
  add('vowel-'+l.id+'-'+v.id,'arabic-harakat-01','harakat-sound-'+v.id,
   l.glyph,correct,[...vowelMarks.filter(x=>x.id!==v.id).map(x=>l.glyph+x.mark),l.glyph+'\u0652'],
   t(
    l.names.tr+' harfine '+v.name.tr+' eklenirse hangi yazılı biçim oluşur?',
    'Which form of '+l.names.en+' carries '+v.name.en+'?',
    'أي شكل لحرف '+l.names.ar+' يحمل علامة '+v.name.ar+'؟',
    'Welche Form von '+l.names.de+' trägt '+v.name.de+'?',
    'Quelle forme de '+l.names.fr+' porte '+v.name.fr+' ?'
   ),t(
    'Doğru biçim «'+correct+'»; '+v.name.tr+' kısa '+v.sound+' sesini gösterir.',
    'The correct form is '+correct+'; '+v.name.en+' indicates short '+v.sound+'.',
    'الشكل الصحيح '+correct+'؛ علامة '+v.name.ar+' تدل على الحركة القصيرة '+v.sound+'.',
    'Richtig ist '+correct+'; '+v.name.de+' zeigt den kurzen Laut '+v.sound+'.',
    'La forme correcte est '+correct+' ; '+v.name.fr+' marque le son bref '+v.sound+'.'
   ),1);
 }
 // C: sukūn, shadda and long-vowel spellings; never infer spoken tajwīd.
 for(const [i,l] of consonants.entries()){
  const base=l.glyph,sukun=base+'\u0652',fatha=base+'\u064e',
   kasra=base+'\u0650',damma=base+'\u064f';
  add('sukun-'+l.id,'arabic-reading-sukun-01','reading-sukun',base,sukun,[fatha,kasra,damma],
   t('«'+l.names.tr+'» harfinin cezimli biçimini seç.',
    'Select '+l.names.en+' with sukūn.',
    'اختر حرف '+l.names.ar+' مع السكون.',
    'Wähle '+l.names.de+' mit Sukūn.',
    'Choisis '+l.names.fr+' avec soukoun.'),
   t('Cezim işareti bu örnekte «'+sukun+'» olarak yazılır.',
    'The sukūn is written here as '+sukun+'.',
    'تُكتب علامة السكون هنا هكذا: '+sukun+'.',
    'Das Sukūn erscheint hier als '+sukun+'.',
    'Le soukoun s’écrit ici '+sukun+'.'),1);
  const stressed=base+'\u0651\u064e';
  add('shadda-'+l.id,'arabic-reading-shadda-01','reading-shadda-fatha',base,stressed,
   [fatha,base+'\u0651\u0650',base+'\u0651\u064f'],
   t('«'+l.names.tr+'» harfini şedde ve üstünle yazılmış biçimiyle seç.',
    'Select '+l.names.en+' with shadda and fatḥa.',
    'اختر حرف '+l.names.ar+' مع الشدة والفتحة.',
    'Wähle '+l.names.de+' mit Schadda und Fatha.',
    'Choisis '+l.names.fr+' avec chadda et fatḥa.'),
   t('Şedde ve üstün birlikte «'+stressed+'» biçimini oluşturur.',
    'Shadda and fatḥa together give '+stressed+'.',
    'الشدة مع الفتحة تعطي الشكل '+stressed+'.',
    'Schadda und Fatha ergeben '+stressed+'.',
    'La chadda avec fatḥa donne '+stressed+'.'),2);
  const long=[
   {v:'ā',glyph:fatha+'ا',kind:t('uzun a','long ā','المدّ بالألف','langes ā','ā long')},
   {v:'ī',glyph:kasra+'ي',kind:t('uzun i','long ī','المدّ بالياء','langes ī','ī long')},
   {v:'ū',glyph:damma+'و',kind:t('uzun u','long ū','المدّ بالواو','langes ū','ū long')}
  ];
  // Not every consonant + long-vowel combination is a lexical word;
  // these are labelled as *written spelling patterns*, not word readings.
  const desired=long[i%3],wrong=[...long.filter(x=>x!==desired).map(x=>x.glyph),base+'\u0652'];
  add('madd-'+l.id,'arabic-reading-madd-01','reading-madd-pattern',base,desired.glyph,wrong,
   t('«'+l.names.tr+'» harfiyle '+desired.kind.tr+' yazım örneğini seç.',
    'Select the written '+desired.kind.en+' pattern using '+l.names.en+'.',
    'اختر نمط '+desired.kind.ar+' مع حرف '+l.names.ar+'.',
    'Wähle das Schriftmuster für '+desired.kind.de+' mit '+l.names.de+'.',
    'Choisis la graphie de '+desired.kind.fr+' avec '+l.names.fr+'.'),
   t('Bu yazılı med örneği «'+desired.glyph+'» şeklindedir.',
    'This written long-vowel pattern is '+desired.glyph+'.',
    'نمط المدّ المكتوب هنا هو '+desired.glyph+'.',
    'Dieses schriftliche Dehnungsmuster ist '+desired.glyph+'.',
    'Ce modèle écrit de voyelle longue est '+desired.glyph+'.'),3);
 }
 // D: 41 attested basic MSA vocabulary forms with hand-split written
 // segments. Concatenation is enforced. These are NOT Quran quotations.
 const rows=[
  ['kitab','كِتَابٌ',['كِ','تَا','بٌ']],
  ['qalam','قَلَمٌ',['قَ','لَ','مٌ']],
  ['bayt','بَيْتٌ',['بَ','يْ','تٌ']],
  ['bab','بَابٌ',['بَا','بٌ']],
  ['maa','مَاءٌ',['مَا','ءٌ']],
  ['nur','نُورٌ',['نُو','رٌ']],
  ['walad','وَلَدٌ',['وَ','لَ','دٌ']],
  ['bint','بِنْتٌ',['بِ','نْ','تٌ']],
  ['ab','أَبٌ',['أَ','بٌ']],
  ['umm','أُمٌّ',['أُ','مٌّ']],
  ['akh','أَخٌ',['أَ','خٌ']],
  ['ukht','أُخْتٌ',['أُ','خْ','تٌ']],
  ['talib','طَالِبٌ',['طَا','لِ','بٌ']],
  ['muallim','مُعَلِّمٌ',['مُ','عَ','لِّ','مٌ']],
  ['madrasa','مَدْرَسَةٌ',['مَ','دْ','رَ','سَ','ةٌ']],
  ['maktab','مَكْتَبٌ',['مَ','كْ','تَ','بٌ']],
  ['fasl','فَصْلٌ',['فَ','صْ','لٌ']],
  ['dars','دَرْسٌ',['دَ','رْ','سٌ']],
  ['sadiq','صَدِيقٌ',['صَ','دِي','قٌ']],
  ['taam','طَعَامٌ',['طَ','عَا','مٌ']],
  ['khubz','خُبْزٌ',['خُ','بْ','زٌ']],
  ['laban','لَبَنٌ',['لَ','بَ','نٌ']],
  ['tuffah','تُفَّاحٌ',['تُ','فَّا','حٌ']],
  ['mawz','مَوْزٌ',['مَ','وْ','زٌ']],
  ['suq','سُوقٌ',['سُو','قٌ']],
  ['shari','شَارِعٌ',['شَا','رِ','عٌ']],
  ['madina','مَدِينَةٌ',['مَ','دِي','نَ','ةٌ']],
  ['hadiqa','حَدِيقَةٌ',['حَ','دِي','قَ','ةٌ']],
  ['shajara','شَجَرَةٌ',['شَ','جَ','رَ','ةٌ']],
  ['zahra','زَهْرَةٌ',['زَ','هْ','رَ','ةٌ']],
  ['shams','شَمْسٌ',['شَ','مْ','سٌ']],
  ['qamar','قَمَرٌ',['قَ','مَ','رٌ']],
  ['najm','نَجْمٌ',['نَ','جْ','مٌ']],
  ['samaa','سَمَاءٌ',['سَ','مَا','ءٌ']],
  ['ard','أَرْضٌ',['أَ','رْ','ضٌ']],
  ['yawm','يَوْمٌ',['يَ','وْ','مٌ']],
  ['layl','لَيْلٌ',['لَ','يْ','لٌ']],
  ['sabah','صَبَاحٌ',['صَ','بَا','حٌ']],
  ['masaa','مَسَاءٌ',['مَ','سَا','ءٌ']],
  ['waqt','وَقْتٌ',['وَ','قْ','تٌ']],
  ['ilm','عِلْمٌ',['عِ','لْ','مٌ']]
 ];
 if(rows.length!==41||new Set(rows.map(x=>x[1])).size!==41)throw Error('PACK_G_WORD_INVENTORY');
 rows.forEach(([id,glyph,parts],i)=>{
  if(parts.join('')!==glyph||parts.length<2)throw Error('PACK_G_SPELLING:'+id);
  const otherFirst=[...new Set(rows.map(x=>x[2][0]))].filter(s=>s!==parts[0]).slice(i%6,i%6+3);
  if(otherFirst.length!==3)throw Error('PACK_G_FIRST_DISTRACTORS:'+id);
  add('segment-'+id,'arabic-word-syllables-01','word-first-written-segment',glyph,
   parts[0],otherFirst,
   t('«'+glyph+'» kelimesinin ilk yazılı parçası hangisi?',
    'Which written segment begins '+glyph+'?',
    'ما الجزء المكتوب الأول من كلمة '+glyph+'؟',
    'Welcher Schriftteil beginnt '+glyph+'?',
    'Quel segment écrit commence '+glyph+' ?'),
   t('«'+glyph+'» kelimesi «'+parts.join(' + ')+'» olarak ayrılabilir.',
    glyph+' can be segmented for study as '+parts.join(' + ')+'.',
    'يمكن تقسيم '+glyph+' للتعلّم إلى '+parts.join(' + ')+'.',
    glyph+' kann als '+parts.join(' + ')+' gegliedert werden.',
    glyph+' peut se décomposer en '+parts.join(' + ')+'.'),2);
  const distractorWords=[1,2,3].map(n=>rows[(i+n*7)%rows.length][1]);
  add('assemble-'+id,'arabic-word-words-01','word-rebuild-written',parts.join(' + '),glyph,
   distractorWords,
   t('Parçaları sırayla birleştir: doğru kelimeyi seç.',
    'Join the written pieces in order. Which word is formed?',
    'اجمع الأجزاء المكتوبة بالترتيب. أي كلمة تتكوّن؟',
    'Setze die Schriftteile in Reihenfolge zusammen. Welches Wort entsteht?',
    'Assemble les segments écrits dans l’ordre. Quel mot obtiens-tu ?'),
   t('Bu parçalar «'+glyph+'» kelimesini oluşturur.',
    'These segments form the written word '+glyph+'.',
    'تكوّن هذه الأجزاء الكلمة المكتوبة '+glyph+'.',
    'Diese Teile ergeben das Wort '+glyph+'.',
    'Ces segments forment le mot '+glyph+'.'),2);
 });
 if(questions.length!==300||new Set(questions.map(q=>q.id)).size!==300)
  throw Error('PACK_G_COUNT_OR_IDS');
 if(questions.some(q=>q.audioRef||q.choices.some(c=>c.audioRef)))
  throw Error('PACK_G_AUDIO_UNVERIFIED');
 const registered=engine.registerPack({id:'arabic-skills-pack-g-300',questions});
 window.DEEN_ARABIC_QUESTIONS_PACK_G=Object.freeze({
  version:1,count:registered.count,id:registered.id,
  distribution:Object.freeze({...byStage}),skills:Object.freeze({...bySkill}),
  questionIds:Object.freeze(questions.map(q=>q.id)),audioRequired:false,
  sourcePolicy:'original-didactic-MSA-not-Quran-verses',
  contentStatus:'written-only-pending-human-pedagogy-and-language-review'
 });
})();