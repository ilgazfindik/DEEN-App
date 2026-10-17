/* DEEN Arabic V2 Pack A — 100 distinct, content-validated letter recognition tasks.
 * 28 find-glyph-by-name, 28 identify-name-by-glyph, 28 dot-place questions,
 * 16 close-shape comparisons. This is NOT 100 option shuffles.
 * Sources: 28-letter course metadata; no claims of Qur'an recitation or expert-reviewed audio.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_QUESTIONS_PACK_A)return;
 const course=window.DEEN_ARABIC_LETTERS,engine=window.DEEN_ARABIC_QUESTIONS_V2;
 if(!course||!engine)throw Error('ARABIC_PACK_A_DEPENDENCIES_MISSING');
 const locales=['tr','en','ar','de','fr'],letters=course.all,byId=course.get;
 const dotRows=Object.freeze([
  ['alif','none'],['ba','one-below'],['ta','two-above'],['tha','three-above'],
  ['jim','one-below'],['hha','none'],['kha','one-above'],['dal','none'],
  ['dhal','one-above'],['ra','none'],['zay','one-above'],['sin','none'],
  ['shin','three-above'],['sad','none'],['dad','one-above'],['tta','none'],
  ['zza','one-above'],['ayn','none'],['ghayn','one-above'],['fa','one-above'],
  ['qaf','two-above'],['kaf','none'],['lam','none'],['mim','none'],
  ['nun','one-above'],['ha','none'],['waw','none'],['ya','two-below']
 ]);
 const dots=Object.freeze(Object.fromEntries(dotRows));
 const dotTypes=Object.freeze({
  none:{tr:'Nokta yok',en:'No dots',ar:'دُونَ نُقَطٍ',de:'Keine Punkte',fr:'Sans point'},
  'one-above':{tr:'Üstte 1 nokta',en:'One dot above',ar:'نُقْطَةٌ فَوْقَ',de:'Ein Punkt oben',fr:'Un point au-dessus'},
  'one-below':{tr:'Altta 1 nokta',en:'One dot below',ar:'نُقْطَةٌ تَحْتَ',de:'Ein Punkt unten',fr:'Un point au-dessous'},
  'two-above':{tr:'Üstte 2 nokta',en:'Two dots above',ar:'نُقْطَتَانِ فَوْقَ',de:'Zwei Punkte oben',fr:'Deux points au-dessus'},
  'two-below':{tr:'Altta 2 nokta',en:'Two dots below',ar:'نُقْطَتَانِ تَحْتَ',de:'Zwei Punkte unten',fr:'Deux points au-dessous'},
  'three-above':{tr:'Üstte 3 nokta',en:'Three dots above',ar:'ثَلَاثُ نُقَطٍ فَوْقَ',de:'Drei Punkte oben',fr:'Trois points au-dessus'}
 });
 // The 8 actual shared-body families: do not infer shape similarity by Unicode proximity.
 const sharedShape=Object.freeze([
  ['ba','ta'],['jim','hha'],['dal','dhal'],['ra','zay'],
  ['sin','shin'],['sad','dad'],['tta','zza'],['ayn','ghayn']
 ]);
 if(dotRows.length!==28||new Set(dotRows.map(x=>x[0])).size!==28||
   letters.length!==28||letters.some(l=>!dots[l.id]))throw Error('ARABIC_PACK_A_LETTER_COVERAGE');
 const familyOf=id=>sharedShape.find(pair=>pair.includes(id))||[];
 const localized=(tr,en,ar,de,fr)=>Object.freeze({tr,en,ar,de,fr});
 const sentence=(kind,l)=>{
  const n=l.names;
  if(kind==='glyph')return localized(
   '"'+n.tr+'" harfini seç.', 'Choose the letter named "'+n.en+'".',
   'اختر حرف '+n.ar+'.','Wähle den Buchstaben '+n.de+'.',
   'Choisis la lettre '+n.fr+'.');
  if(kind==='name')return localized('Gösterilen harfin adını seç.',
   'Choose the name of the displayed letter.','اختر اسم الحرف الظاهر.',
   'Wähle den Namen des gezeigten Buchstabens.',
   'Choisis le nom de la lettre affichée.');
  if(kind==='dots')return localized('Bu harfin nokta sayısı ve konumu nedir?',
   'How many dots does this letter have, and where?',
   'ما عدد نقاط هذا الحرف وأين موضعها؟',
   'Wie viele Punkte hat dieser Buchstabe und wo liegen sie?',
   'Combien de points cette lettre possède-t-elle, et où ?');
  return localized('Hangisi bu harfle aynı ana şekle sahip başka bir harftir?',
   'Which different letter shares the same basic shape?',
   'أيُّ حرفٍ آخر يشترك مع هذا الحرف في الشكل الأساسي؟',
   'Welcher andere Buchstabe hat dieselbe Grundform?',
   'Quelle autre lettre partage la même forme de base ?');
 };
 const explanation=(kind,l,answer)=>{
  const n=l.names;
  if(kind==='glyph'||kind==='name')return localized(
   n.tr+' harfinin yazılışı '+l.glyph+' şeklindedir.',
   n.en+' is written '+l.glyph+'.',
   'يُكتب حرف '+n.ar+' هكذا: '+l.glyph+'.',
   n.de+' wird als '+l.glyph+' geschrieben.',
   'La lettre '+n.fr+' s’écrit '+l.glyph+'.');
  if(kind==='dots')return localized(
   l.glyph+' harfinde '+dotTypes[answer].tr.toLocaleLowerCase('tr')+' bulunur.',
   l.glyph+' has '+dotTypes[answer].en.toLowerCase()+'.',
   'يتميز الحرف '+l.glyph+' بوصف النقاط: '+dotTypes[answer].ar+'.',
   l.glyph+' hat '+dotTypes[answer].de.toLowerCase()+'.',
   l.glyph+' possède : '+dotTypes[answer].fr.toLowerCase()+'.');
  const sibling=byId(answer);
  return localized(l.glyph+' ile '+sibling.glyph+' harfleri ana şekli paylaşır; noktaları farklıdır.',
   l.glyph+' and '+sibling.glyph+' share a base outline but differ in dots.',
   'يتشابه '+l.glyph+' و'+sibling.glyph+' في أصل الشكل ويختلفان بالنقاط.',
   l.glyph+' und '+sibling.glyph+' haben dieselbe Grundform, aber andere Punkte.',
   l.glyph+' et '+sibling.glyph+' ont la même forme de base, mais pas les mêmes points.');
 };
 const distractor=(kind,correct,wrong)=>{
  if(kind==='dots')return localized('Noktaların sayısını ve yerini yeniden karşılaştır.',
   'Compare the number and placement of dots again.',
   'أعِد النظر في عدد النقاط ومواضعها.',
   'Vergleiche Zahl und Lage der Punkte erneut.',
   'Vérifie à nouveau le nombre et la place des points.');
  if(kind==='shape')return localized('Bu harfin çizgi gövdesi, gösterilen harfin ailesinden farklıdır.',
   'This letter has a different basic outline.',
   'هيئة هذا الحرف الأساسية مختلفة عن الحرف المعروض.',
   'Dieser Buchstabe hat eine andere Grundform.',
   'Cette lettre a une forme de base différente.');
  return localized('Seçilen harf farklıdır; adını ve yazılışını yeniden karşılaştır.',
   'The selected letter has a different name and written form.',
   'الحرف المحدد مختلف؛ قارن الاسم والرسم مرة أخرى.',
   'Dieser Buchstabe hat einen anderen Namen und eine andere Schreibform.',
   'Cette lettre a un autre nom et une autre graphie.');
 };
 const stageFor=id=>{
  const g=course.lessons.find(lesson=>lesson.letterIds.includes(id));
  if(!g)throw Error('ARABIC_PACK_A_STAGE_MISSING:'+id);
  return g.id;
 };
 const wrongLetters=(l,n=3,exclude=[])=>{
  const family=familyOf(l.id).filter(id=>id!==l.id&&!exclude.includes(id)).map(byId);
  const sameLesson=course.lessons.find(x=>x.letterIds.includes(l.id)).letters
   .filter(x=>x.id!==l.id&&!exclude.includes(x.id));
  const other=letters.filter(x=>x.id!==l.id&&!exclude.includes(x.id));
  const unique=new Map([...family,...sameLesson,...other].map(x=>[x.id,x]));
  // Preserve the family-priority order; a wrong answer never aliases the right letter.
  return [...unique.values()].slice(0,n);
 };
 const placed=(correct,others,position)=>{
  const arranged=others.map(x=>x);
  arranged.splice(position%4,0,correct);
  if(arranged.length!==4||new Set(arranged.map(x=>x.id)).size!==4)throw Error('ARABIC_PACK_A_CHOICES');
  return arranged;
 };
 const letterOption=(letter,withName=false)=>Object.freeze({
  id:letter.id,glyph:withName?letter.names.ar:letter.glyph,
  ...(withName?{label:Object.freeze({...letter.names})}:{}),
  ...(window.DEEN_ARABIC_LETTER_AUDIO?.available?.(letter.id)?{audioRef:letter.id}:{})
 });
 const questions=[];
 function add(kind,l,correct,choices,order,skill){
  const options=placed(correct,choices,order);
  const reasons={};
  for(const other of options)if(other.id!==correct.id)reasons[other.id]=distractor(kind,correct.id,other.id);
  const id='pack-a-'+kind+'-'+l.id;
  questions.push(Object.freeze({
   id,skill,stage:stageFor(l.id),difficulty:kind==='glyph'?1:kind==='name'?2:kind==='dots'?2:3,
   type:'choice',target:kind==='glyph'?l.names.ar:l.glyph,
   prompt:sentence(kind,l),choices:Object.freeze(options),correctAnswer:correct.id,
   explanation:explanation(kind,l,correct.id==='dot-'+dots[l.id]?dots[l.id]:correct.id),
   distractorRationale:Object.freeze(reasons),locale:Object.freeze(locales),
   source:'Arabic letter inventory: '+l.names.ar+' ('+l.id+')'
  }));
 }
 for(const [i,l] of letters.entries()){
  const similar=wrongLetters(l);
  add('glyph',l,letterOption(l),similar.map(x=>letterOption(x)),i%4,'letter-name-to-glyph');
  add('name',l,letterOption(l,true),similar.map(x=>letterOption(x,true)),(i+2)%4,'letter-glyph-to-name');
  const signature=dots[l.id];
  const otherTypes=Object.keys(dotTypes).filter(x=>x!==signature);
  // Always include one common visual competitor; all options are genuine dot descriptions.
  const selected=[otherTypes[i%otherTypes.length],...otherTypes.filter(x=>x!==otherTypes[i%otherTypes.length])].slice(0,3);
  const makeDot=type=>Object.freeze({id:'dot-'+type,glyph:dotTypes[type].ar,label:dotTypes[type]});
  add('dots',l,makeDot(signature),selected.map(makeDot),(i+1)%4,'letter-dot-position');
 }
 for(const [i,[a,b]] of sharedShape.entries())for(const [j,id] of [a,b].entries()){
  const l=byId(id),correct=byId(id===a?b:a);
  const wrong=wrongLetters(l,3,[...familyOf(l.id),correct.id]);
  add('shape',l,letterOption(correct),wrong.map(x=>letterOption(x)),(i+j+3)%4,'letter-shape-family');
 }
 if(questions.length!==100||new Set(questions.map(q=>q.id)).size!==100)
  throw Error('ARABIC_PACK_A_NOT_100_UNIQUE');
 const dist=Object.freeze(Object.fromEntries(course.lessons.map(x=>[
  x.id,questions.filter(q=>q.stage===x.id).length
 ])));
 if(Object.values(dist).some(n=>n<8))throw Error('ARABIC_PACK_A_NOT_PLAYABLE_ALL_LESSONS');
 // Registration runs only when the engine is loaded; throws on a single invalid item, no partial pack.
 const result=engine.registerPack({id:'arabic-letters-pack-a-100',questions});
 window.DEEN_ARABIC_QUESTIONS_PACK_A=Object.freeze({
  version:1,id:result.id,count:result.count,distribution:dist,
  questionIds:Object.freeze(questions.map(q=>q.id)),audioPolicy:'creator-confirmed-preview-only'
 });
})();