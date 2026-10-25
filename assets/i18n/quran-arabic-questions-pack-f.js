/* DEEN Arabic V2 Pack F: 100 source-backed meaning, phrase and grammar tasks.
 * Curriculum source of truth: DEEN_ARABIC_MEANING, PHRASES and PATTERNS.
 * Existing study glosses are short learning aids, NOT authorized translations or tafsir.
 * The Qur'an in question targets is never transliterated, rewritten or re-voiced.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_QUESTIONS_PACK_F)return;
 const meaning=window.DEEN_ARABIC_MEANING,phrases=window.DEEN_ARABIC_PHRASES,
  patterns=window.DEEN_ARABIC_PATTERNS,engine=window.DEEN_ARABIC_QUESTIONS_V2;
 if(!meaning||!phrases||!patterns||!engine)throw Error('ARABIC_PACK_F_DEPENDENCIES_MISSING');
 const locales=Object.freeze(['tr','en','ar','de','fr']),t=(tr,en,ar,de,fr)=>Object.freeze({tr,en,ar,de,fr});
 const lessons=[...meaning.lessons,...phrases.lessons,...patterns.lessons];
 if(lessons.length!==9||lessons.some((l,i)=>l.index!==18+i))throw Error('PACK_F_LESSON_ALIGNMENT');
 const all=[],stageCount={},skillCount={};
 const words=Object.freeze([...new Set(lessons.flatMap(l=>l.items.flatMap(c=>(c.excerpt||c.glyph).split(/\s+/))))]);
 const safeText=o=>locales.every(l=>typeof o?.[l]==='string'&&o[l].trim());
 const wordOptions=(answer,pool=words)=>{
  const distinct=[...new Set(pool.concat(words))].filter(x=>x!==answer);
  if(distinct.length<2)throw Error('PACK_F_NOT_ENOUGH_TOKENS');
  return [answer,...distinct.slice(0,3)].map((glyph,i)=>({id:i?'wrong-'+i:'right',glyph}));
 };
 function explain(item,kind,answer,detail){
  const ref=item.reference;
  if(kind==='gloss')return t(
   '«'+item.glyph+'» için dersin kısa anlam karşılığı: '+item.gloss.tr+'.',
   'Study gloss of '+item.glyph+': '+item.gloss.en+'.',
   'شرح الكلمة الدراسي '+item.glyph+': '+item.gloss.ar+'.',
   'Lernbedeutung von '+item.glyph+': '+item.gloss.de+'.',
   'Sens étudié de '+item.glyph+' : '+item.gloss.fr+'.');
  if(kind==='note'||kind==='role') {
   const label=kind==='role'?item.role:item.note;
   return t(
    '«'+item.glyph+'»: '+label.tr+'.',
    item.glyph+': '+label.en+'.',
    item.glyph+': '+label.ar+'.',
    item.glyph+': '+label.de+'.',
    item.glyph+' : '+label.fr+'.');
  }
  if(kind==='find')return t(
   '«'+item.glyph+'», '+ref+' kaynağındaki doğru ifadedir: '+item.gloss.tr+'.',
   item.glyph+' is attested in '+ref+': '+item.gloss.en+'.',
   'وردت '+item.glyph+' في '+ref+'؛ المعنى الدراسي: '+item.gloss.ar+'.',
   item.glyph+' steht in '+ref+': '+item.gloss.de+'.',
   item.glyph+' figure dans '+ref+' : '+item.gloss.fr+'.');
  if(kind==='neighbor')return t(
   ref+' içinde «'+detail.anchor+'» kelimesinin '+(detail.dir==='before'?'öncesinde':'sonrasında')+' «'+answer+'» gelir.',
   'In '+ref+', '+answer+' comes immediately '+(detail.dir==='before'?'before':'after')+' '+detail.anchor+'.',
   'في الآية '+ref+' تأتي '+answer+' '+(detail.dir==='before'?'قبل':'بعد')+' '+detail.anchor+' مباشرةً.',
   'In '+ref+' steht '+answer+' unmittelbar '+(detail.dir==='before'?'vor':'nach')+' '+detail.anchor+'.',
   'Dans '+ref+', '+answer+' se trouve juste '+(detail.dir==='before'?'avant':'après')+' '+detail.anchor+'.');
  return t(
   'Ayet '+ref+' içinde '+detail.position+'. kelime «'+answer+'» biçimindedir.',
   'Word '+detail.position+' of verse '+ref+' is '+answer+'.',
   'الكلمة رقم '+detail.position+' في الآية '+ref+' هي '+answer+'.',
   'Wort '+detail.position+' in Vers '+ref+' lautet '+answer+'.',
   'Le mot '+detail.position+' du verset '+ref+' est '+answer+'.');
 }
 function prompt(kind,item,detail){
  if(kind==='gloss')return t('«'+item.glyph+'» ifadesinin derste öğretilen anlamı nedir?',
   'What is the study meaning of '+item.glyph+'?',
   'ما المعنى التعليمي لعبارة '+item.glyph+'؟',
   'Welche Lernbedeutung hat '+item.glyph+'?',
   'Quel sens est enseigné pour '+item.glyph+' ?');
  if(kind==='note')return t('«'+item.glyph+'» için hangi dil bilgisi notu doğrudur?',
   'Which linguistic note applies to '+item.glyph+'?',
   'أي ملاحظة لغوية تنطبق على '+item.glyph+'؟',
   'Welche Sprachnotiz gilt für '+item.glyph+'?',
   'Quelle remarque linguistique concerne '+item.glyph+' ?');
  if(kind==='role')return t('«'+item.glyph+'» için hangi dil bilgisi görevi doğrudur?',
   'Which grammatical role applies to '+item.glyph+'?',
   'ما الوظيفة النحوية لعبارة '+item.glyph+'؟',
   'Welche grammatische Funktion hat '+item.glyph+'?',
   'Quelle fonction grammaticale a '+item.glyph+' ?');
  if(kind==='find')return t('«'+item.gloss.tr+'» anlamı veya göreviyle ilişkili Arapça ifadeyi ayette bul.',
   'Find the Arabic expression associated with “'+item.gloss.en+'” in this verse.',
   'اعثر في الآية على العبارة العربية التي يدل عليها: «'+item.gloss.ar+'».',
   'Finde im Vers den arabischen Ausdruck für „'+item.gloss.de+'“.',
   'Retrouve dans le verset l’expression arabe correspondant à «'+item.gloss.fr+'».');
  if(kind==='neighbor')return t('«'+detail.anchor+'» kelimesinin ayette hemen '+(detail.dir==='before'?'öncesinde':'sonrasında')+' hangisi gelir?',
   'What comes immediately '+(detail.dir==='before'?'before':'after')+' '+detail.anchor+' in the verse?',
   'ما الكلمة التي تأتي مباشرةً '+(detail.dir==='before'?'قبل':'بعد')+' '+detail.anchor+' في الآية؟',
   'Was steht unmittelbar '+(detail.dir==='before'?'vor':'nach')+' '+detail.anchor+' im Vers?',
   'Quel mot est placé juste '+(detail.dir==='before'?'avant':'après')+' '+detail.anchor+' dans le verset ?');
  return t('Ayette '+detail.position+'. sıradaki kelimeyi seç.',
   'Choose word number '+detail.position+' in the verse.',
   'اختر الكلمة رقم '+detail.position+' في الآية.',
   'Wähle Wort Nummer '+detail.position+' im Vers.',
   'Choisis le mot numéro '+detail.position+' dans le verset.');
 }
 function add({lesson,item,kind,variant,choices,target,correct,detail,level}){
  const id='pack-f-'+lesson.id.replace(/^arabic-/,'')+'-'+kind+'-'+item.id+(variant?'-'+variant:'');
  const ids=new Set(),glyphs=new Set();
  const options=choices.map((c,i)=>{
   if(ids.has(c.id)||glyphs.has(c.glyph))throw Error('PACK_F_BAD_OPTIONS:'+id);
   ids.add(c.id);glyphs.add(c.glyph);
   if(c.label&&!safeText(c.label))throw Error('PACK_F_LABEL_MISSING:'+id);
   return Object.freeze({...c});
  });
  if(options.length<3||options.length>4||options.filter(c=>c.id===correct).length!==1)
   throw Error('PACK_F_BAD_ANSWER:'+id);
  const trueChoice=options.find(c=>c.id===correct);
  const answers=Object.freeze(Object.fromEntries(options.filter(c=>c.id!==correct).map(c=>[c.id,t(
   'Bu seçenek '+(c.label?.tr||c.glyph)+'; aranan '+(trueChoice.label?.tr||trueChoice.glyph)+'.',
   'This option is '+(c.label?.en||c.glyph)+'; the answer is '+(trueChoice.label?.en||trueChoice.glyph)+'.',
   'هذا الاختيار '+(c.label?.ar||c.glyph)+'، والمطلوب '+(trueChoice.label?.ar||trueChoice.glyph)+'.',
   'Diese Option ist '+(c.label?.de||c.glyph)+'; gesucht ist '+(trueChoice.label?.de||trueChoice.glyph)+'.',
   'Cette option est '+(c.label?.fr||c.glyph)+' ; la réponse est '+(trueChoice.label?.fr||trueChoice.glyph)+'.'
  )])));
  all.push(Object.freeze({
   id,skill:'understand-'+kind,stage:lesson.id,difficulty:level||2,
   type:'choice',target,prompt:prompt(kind,item,detail),choices:Object.freeze(options),
   correctAnswer:correct,explanation:explain(item,kind,trueChoice.glyph,detail),
   distractorRationale:answers,locale:locales,source:item.reference+' '+item.excerpt
  }));
  stageCount[lesson.id]=(stageCount[lesson.id]||0)+1;
  skillCount[kind]=(skillCount[kind]||0)+1;
 }
 function concept(lesson,item,items,kind,key){
  const selected=items.length===3?items:items.slice(0,4);
  add({lesson,item,kind,target:item.glyph,
   correct:item.id,choices:selected.map(c=>({id:c.id,glyph:c.glyph,label:c[key]})),
   level:kind==='gloss'?1:2});
 }
 function find(lesson,item,items){
  const picked=[item,...items.filter(x=>x.id!==item.id)].slice(0,4);
  add({lesson,item,kind:'find',target:item.excerpt,correct:item.id,
   choices:picked.map(c=>({id:c.id,glyph:c.glyph})),level:2});
 }
 function neighbor(lesson,item){
  const tokens=item.excerpt.split(/\s+/),pos=tokens.indexOf(item.glyph);
  if(pos<0)throw Error('PACK_F_WORD_NOT_IN_VERSE:'+item.id);
  const dir=pos===tokens.length-1?'before':'after';
  const right=tokens[pos+(dir==='before'?-1:1)];
  add({lesson,item,kind:'neighbor',target:item.excerpt,correct:'right',
   choices:wordOptions(right,tokens),detail:{anchor:item.glyph,dir},level:3});
 }
 function ordinal(lesson,item,position,variant){
  const tokens=item.excerpt.split(/\s+/),right=tokens[position-1];
  if(!right)throw Error('PACK_F_POSITION_OUT_OF_BOUNDS:'+item.id+'/'+position);
  add({lesson,item,kind:'ordinal',variant,target:item.glyph,correct:'right',
   choices:wordOptions(right,tokens),detail:{position},level:3});
 }
 // Meaning lessons: 12 + 12 + 10 = 34.
 const [mg,mr,mo,pv,pc,po,sv,sc,ss]=lessons;
 mg.items.forEach(item=>{concept(mg,item,mg.items,'gloss','gloss');find(mg,item,mg.items);neighbor(mg,item)});
 mr.items.forEach(item=>{concept(mr,item,mr.items,'role','role');find(mr,item,mr.items);neighbor(mr,item)});
 mo.items.forEach(item=>{
  const converted={...item,excerpt:item.glyph,gloss:item.meaning};
  concept(mo,converted,mo.items.map(x=>({...x,gloss:x.meaning})),'gloss','gloss');
  ordinal(mo,converted,1,'first');ordinal(mo,converted,item.parts.length,'last');
 });
 ordinal(mo,{...mo.items[0],excerpt:mo.items[0].glyph},2,'second');
 // Short vocabulary and phrase lessons: 12 + 9 + 9 = 30.
 pv.items.forEach(item=>{concept(pv,item,pv.items,'gloss','gloss');concept(pv,item,pv.items,'note','note');find(pv,item,pv.items)});
 pc.items.forEach(item=>{concept(pc,item,pc.items,'gloss','gloss');concept(pc,item,pc.items,'note','note');find(pc,item,pc.items)});
 po.items.forEach(item=>{
  const converted={...item,excerpt:item.glyph};
  concept(po,converted,po.items,'gloss','gloss');
  ordinal(po,converted,1,'first');ordinal(po,converted,item.parts.length,'last');
 });
 // Patterns: 12 + 12 + 12 = 36.
 sv.items.forEach(item=>{concept(sv,item,sv.items,'gloss','gloss');find(sv,item,sv.items);neighbor(sv,item)});
 sc.items.forEach(item=>{concept(sc,item,sc.items,'gloss','gloss');find(sc,item,sc.items);ordinal(sc,item,1,'first')});
 ss.items.forEach(item=>{concept(ss,item,ss.items,'role','role');concept(ss,item,ss.items,'gloss','gloss');find(ss,item,ss.items)});
 const distribution=lessons.map(l=>stageCount[l.id]);
 if(all.length!==100||distribution.join(',')!=='12,12,10,12,9,9,12,12,12'||
   new Set(all.map(q=>q.id)).size!==100)throw Error('ARABIC_PACK_F_NOT_100');
 if(all.some(q=>q.audioRef||q.choices.some(c=>c.audioRef)))
  throw Error('ARABIC_PACK_F_UNVERIFIED_AUDIO');
 const reg=engine.registerPack({id:'arabic-meaning-pack-f-100',questions:all});
 window.DEEN_ARABIC_QUESTIONS_PACK_F=Object.freeze({
  version:1,id:reg.id,count:reg.count,
  distribution:Object.freeze({...stageCount}),bySkill:Object.freeze({...skillCount}),
  questionIds:Object.freeze(all.map(q=>q.id)),
  sourcePolicy:'reuse-only-existing-introductory-course-glosses-and-verses',
  audioPolicy:'no-unapproved-audio',contentCaveat:'study-aids-not-complete-tafsir'
 });
})();