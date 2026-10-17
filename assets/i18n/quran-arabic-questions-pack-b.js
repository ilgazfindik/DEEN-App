/* Arabic Learning V2 Pack B — 100 unique context-form and joining-rule questions.
 * 28 initial + 22 medial + 28 final + 22 joining-order tasks.
 * The six non-next-joining letters NEVER receive fictitious medial forms.
 * Tatweel is used only as an educational joining stroke; not a Qur'an transcription.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_QUESTIONS_PACK_B)return;
 const course=window.DEEN_ARABIC_LETTERS,engine=window.DEEN_ARABIC_QUESTIONS_V2;
 if(!course||!engine)throw Error('ARABIC_PACK_B_DEPENDENCIES_MISSING');
 const letters=course.all,locales=Object.freeze(['tr','en','ar','de','fr']);
 const joiners=letters.filter(l=>l.joinsNext),nonJoiners=letters.filter(l=>!l.joinsNext);
 if(letters.length!==28||joiners.length!==22||nonJoiners.length!==6||
  nonJoiners.some(l=>l.forms.medial!==null||l.forms.initial!==l.glyph))
  throw Error('ARABIC_PACK_B_JOINING_RULES');
 const tr=(tr,en,ar,de,fr)=>Object.freeze({tr,en,ar,de,fr});
 const lessonFor=id=>{
  const lesson=course.lessons.find(x=>x.letterIds.includes(id));
  if(!lesson)throw Error('ARABIC_PACK_B_NO_LESSON_'+id);
  return lesson.id;
 };
 const whyWrong=(kind)=>kind==='joining'
  ?tr('Harflerin sırası veya bitişme çizgisi hedefteki gibi değil.',
      'The letter order or joining stroke does not match the target.',
      'ترتيب الحروف أو اتصالها لا يطابق المطلوب.',
      'Buchstabenfolge oder Verbindung stimmt nicht mit der Vorgabe überein.',
      'L’ordre des lettres ou leur liaison ne correspond pas au modèle.')
  :tr('Bu seçenek aynı harfin istenen konumdaki biçimi değildir.',
      'This is not the required positional form of the same letter.',
      'هذا ليس شكل الحرف المطلوب في موضعه المحدد.',
      'Das ist nicht die Positionsform des verlangten Buchstabens.',
      'Ce n’est pas la forme positionnelle de la lettre demandée.');
 const prompt=(kind,l)=>{
  const n=l.names;
  if(kind==='initial')return tr(
   n.tr+' harfi kelime başında nasıl yazılır?',
   'How is '+n.en+' written at the start of a word?',
   'كيف يُكتب حرف '+n.ar+' في أول الكلمة؟',
   'Wie schreibt man '+n.de+' am Wortanfang?',
   'Comment écrit-on '+n.fr+' au début du mot ?');
  if(kind==='medial')return tr(
   n.tr+' harfi iki yandan bağlıyken hangi biçimi alır?',
   'What form does '+n.en+' take when joined on both sides?',
   'ما شكل حرف '+n.ar+' عندما يتصل من الجانبين؟',
   'Welche Form hat '+n.de+', wenn es auf beiden Seiten verbunden ist?',
   'Quelle forme prend '+n.fr+' quand la lettre est liée des deux côtés ?');
  if(kind==='final')return tr(
   n.tr+' harfi önceki harfe bağlı, kelime sonunda nasıl görünür?',
   'Which form of '+n.en+' is used at the end, joined to the previous letter?',
   'كيف يُكتب حرف '+n.ar+' آخر الكلمة متصلاً بما قبله؟',
   'Welche Endform von '+n.de+' verbindet sich mit dem vorherigen Buchstaben?',
   'Quelle forme finale de '+n.fr+' est liée à la lettre précédente ?');
  return tr('İki harfi sırasını koruyarak tek bir birim hâlinde doğru bağla.',
   'Join the two given letters in order as one connected unit.',
   'صِل الحرفين المعروضين بالترتيب في كتابة متصلة.',
   'Verbinde die beiden angegebenen Buchstaben in derselben Reihenfolge.',
   'Relie les deux lettres proposées en conservant leur ordre.');
 };
 const explanation=(kind,l,correct,follower)=>{
  const n=l.names;
  if(kind==='initial'){
   const note=l.joinsNext
    ?tr('Sonraki harfe bağlanır.','It joins the following letter.','يتصل بالحرف الذي يليه.','Es verbindet sich mit dem folgenden Buchstaben.','Elle se lie à la lettre suivante.')
    :tr('Bu harf sonraki harfe bağlanmaz; baştaki biçimi yalındır.',
         'It cannot join the following letter; its initial form is isolated.',
         'لا يتصل هذا الحرف بما بعده؛ وشكله في البداية منفصل.',
         'Der Buchstabe verbindet sich nicht nach links; seine Anfangsform bleibt isoliert.',
         'Cette lettre ne se lie pas à la suivante ; elle garde sa forme isolée.');
   return tr(
    'Doğru yazılış '+correct+'. '+note.tr,'Correct form: '+correct+'. '+note.en,
    'الشكل الصحيح '+correct+'. '+note.ar,'Richtige Form: '+correct+'. '+note.de,
    'Forme correcte : '+correct+'. '+note.fr);
  }
  if(kind==='medial')return tr(
   'İki yana bağlanabilen '+n.tr+' harfinin ortadaki biçimi '+correct+'.',
   n.en+' can join on both sides: its medial form is '+correct+'.',
   'يتصل حرف '+n.ar+' من الجانبين؛ شكله الوسطي '+correct+'.',
   n.de+' kann beidseitig verbunden werden: '+correct+'.',
   n.fr+' peut se lier des deux côtés : '+correct+'.');
  if(kind==='final')return tr(
   'Kelime sonunda önceki harfe bağlanan biçim '+correct+'.',
   'Joined to a preceding letter, its final form is '+correct+'.',
   'الشكل الأخير المتصل بالحرف السابق هو '+correct+'.',
   'Die mit dem Vorgänger verbundene Endform ist '+correct+'.',
   'La forme finale reliée à la lettre précédente est '+correct+'.');
  return tr(
   l.glyph+' önce '+follower.glyph+' sonra gelir; doğru bağlanma '+correct+'.',
   l.glyph+' comes before '+follower.glyph+'; correct joined sample: '+correct+'.',
   'يأتي '+l.glyph+' قبل '+follower.glyph+'؛ والكتابة المتصلة '+correct+'.',
   l.glyph+' steht vor '+follower.glyph+'; verbunden: '+correct+'.',
   l.glyph+' précède '+follower.glyph+' ; liaison correcte : '+correct+'.');
 };
 const candidates=(l,kind)=>{
  const available=kind==='medial'?joiners:letters;
  const same=course.lessons.find(x=>x.letterIds.includes(l.id)).letters
   .filter(x=>x.id!==l.id&&(kind!=='medial'||x.joinsNext));
  return [...new Map([...same,...available.filter(x=>x.id!==l.id)]
   .map(x=>[x.id,x])).values()].slice(0,3);
 };
 const questions=[],countByType={initial:0,medial:0,final:0,joining:0};
 function add(kind,l,options,correctId,target,follower=null){
  const choices=Object.freeze(options.map(([id,glyph])=>Object.freeze({id,glyph})));
  if(choices.length!==4||new Set(choices.map(x=>x.id)).size!==4||
    new Set(choices.map(x=>x.glyph)).size!==4)throw Error('PACK_B_BAD_CHOICE_'+kind+'_'+l.id);
  const reasons=Object.freeze(Object.fromEntries(
   choices.filter(x=>x.id!==correctId).map(x=>[x.id,whyWrong(kind)])
  ));
  const correct=choices.find(x=>x.id===correctId);
  const q=Object.freeze({
   id:'pack-b-'+kind+'-'+l.id,
   skill:kind==='initial'?'position-initial':kind==='medial'?'position-medial':
     kind==='final'?'position-final':'joining-two-letters',
   stage:lessonFor(l.id),difficulty:kind==='initial'?1:kind==='final'?2:3,
   type:'choice',target,prompt:prompt(kind,l),choices,correctAnswer:correctId,
   explanation:explanation(kind,l,correct.glyph,follower),
   distractorRationale:reasons,locale:locales,
   source:'Arabic letter inventory contextual forms: '+l.names.ar+' ('+l.id+'), '+kind
  });
  questions.push(q);countByType[kind]++;
 }
 for(const l of letters){
  for(const kind of ['initial','final']){
   const shape=l.forms[kind],others=candidates(l,kind);
   add(kind,l,[['correct',shape],...others.map(o=>[o.id,o.forms[kind]])],
     'correct',l.glyph);
  }
  if(l.joinsNext){
   const others=candidates(l,'medial');
   add('medial',l,[['correct',l.forms.medial],...others.map(o=>[o.id,o.forms.medial])],
    'correct',l.glyph);
  }
 }
 const followers=['ba','ta','jim','lam','mim','nun','ya'].map(course.get);
 joiners.forEach((l,i)=>{
  let follower=followers[i%followers.length];
  if(follower.id===l.id)follower=followers[(i+1)%followers.length];
  const other=followers.find(x=>x.id!==follower.id&&x.id!==l.id);
  const joined=l.forms.initial+follower.glyph;
  // Disconnected, reversed, or second letter changed: only one correct pair.
  const disconnected=l.glyph+' '+follower.glyph;
  const reversed=follower.forms.initial+l.glyph;
  const incorrectFollower=l.forms.initial+other.glyph;
  add('joining',l,[
   ['correct',joined],['separated',disconnected],['reversed',reversed],
   ['different-follower',incorrectFollower]
  ],'correct',l.glyph+' + '+follower.glyph,follower);
 });
 if(questions.length!==100||countByType.initial!==28||countByType.final!==28||
  countByType.medial!==22||countByType.joining!==22||
  new Set(questions.map(q=>q.id)).size!==100)
  throw Error('ARABIC_PACK_B_NOT_100');
 const distribution=Object.freeze(Object.fromEntries(course.lessons.map(lesson=>[
  lesson.id,questions.filter(q=>q.stage===lesson.id).length
 ])));
 if(Object.values(distribution).some(x=>x<8))throw Error('ARABIC_PACK_B_STAGE_UNDER_8');
 const registered=engine.registerPack({id:'arabic-letters-pack-b-100',questions});
 window.DEEN_ARABIC_QUESTIONS_PACK_B=Object.freeze({
  version:1,id:registered.id,count:registered.count,distribution,
  bySkill:Object.freeze({...countByType}),questionIds:Object.freeze(questions.map(q=>q.id)),
  audioPolicy:'no isolated letter-name audio reused for joining forms'
 });
})();