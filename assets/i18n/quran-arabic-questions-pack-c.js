/* DEEN V2 Pack C: 100 genuinely different short-vowel and short-syllable
 * reading tasks (34 diacritic recognition, 33 b- and 33 t-syllables).
 * No guessed audio. Sukūn/shadda/madd/tanwīn are deliberately left to Pack D.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_QUESTIONS_PACK_C)return;
 const letters=window.DEEN_ARABIC_LETTERS,harakat=window.DEEN_ARABIC_HARAKAT,
  engine=window.DEEN_ARABIC_QUESTIONS_V2;
 if(!letters||!harakat||!engine)throw Error('ARABIC_PACK_C_DEPENDENCIES_MISSING');
 const locales=Object.freeze(['tr','en','ar','de','fr']);
 const marks=harakat.marks;
 if(marks.length!==3||marks.map(x=>x.id).join(',')!=='fatha,kasra,damma')throw Error('ARABIC_PACK_C_MARK_ORDER');
 const localized=(tr,en,ar,de,fr)=>Object.freeze({tr,en,ar,de,fr});
 const markName=(m,lang)=>m.names[lang];
 const markDetails=m=>localized(
  m.names.tr+' işareti kısa '+m.vowel+' sesini gösterir.',
  m.names.en+' indicates the short '+m.vowel+' vowel.',
  'علامة '+m.names.ar+' تدل على الحركة القصيرة '+m.vowel+'.',
  m.names.de+' steht für den kurzen Vokal '+m.vowel+'.',
  m.names.fr+' représente la voyelle brève '+m.vowel+'.'
 );
 const reasons=(wrong,correct)=>localized(
  'Bu '+wrong.names.tr+' işaretidir; istenen '+correct.names.tr+'.',
  'This shows '+wrong.names.en+', not '+correct.names.en+'.',
  'هذه علامة '+wrong.names.ar+' وليست '+correct.names.ar+'.',
  'Das ist '+wrong.names.de+' statt '+correct.names.de+'.',
  'Il s’agit de '+wrong.names.fr+' et non de '+correct.names.fr+'.'
 );
 const examples=(base)=>marks.map(m=>Object.freeze({id:m.id,glyph:base+m.mark}));
 const questions=[],byStage={};
 const add=(id,skill,stage,target,prompt,correct,options,difficulty,source)=>{
  const why=Object.freeze(Object.fromEntries(marks.filter(x=>x.id!==correct.id)
   .map(m=>[m.id,reasons(m,correct)])));
  const q=Object.freeze({
   id:'pack-c-'+id,skill,stage,target,difficulty,type:'choice',
   prompt,choices:Object.freeze(options),correctAnswer:correct.id,
   explanation:markDetails(correct),distractorRationale:why,locale:locales,source
  });
  questions.push(q);byStage[stage]=(byStage[stage]||0)+1;
 };
 const [stageMarks,stageBa,stageTa]=harakat.lessons.map(x=>x.id);
 // Skill 1: 28 meaningful vowel-form prompts across 27 consonants and Bā review.
 // The bare alif (ا) is not a standalone consonant to which three
 // short vowels can simply be attached; avoid misleading spellings اَ اِ اُ.
 const addForm=(l,m,id)=>{
  const n=l.names;
  const p=localized(
   n.tr+' harfini '+markName(m,'tr')+' ile yazan seçeneği bul.',
   'Choose '+n.en+' written with '+markName(m,'en')+'.',
   'اختر حرف '+n.ar+' وعليه '+markName(m,'ar')+'.',
   'Wähle '+n.de+' mit '+markName(m,'de')+'.',
   'Choisis '+n.fr+' avec '+markName(m,'fr')+'.');
  add('form-'+id,'harakat-form',stageMarks,l.glyph,p,m,examples(l.glyph),1,
   'Short-vowel orthography: '+l.id+'/'+m.id);
 };
 letters.all.filter(l=>l.id!=='alif').forEach((l,i)=>addForm(l,marks[i%3],l.id));
 addForm(letters.get('ba'),marks[1],'ba-kasra-review');
 // Skill 2 (6): identify the same mark across two DIFFERENT letters.
 const comparison=['fa','qaf','lam','mim','nun','ya'];
 comparison.forEach((id,i)=>{
  const letter=letters.get(id),m=marks[i%3],reference=letters.get(i%2===0?'ta':'ba');
  if(!letter||letter.id===reference.id)throw Error('ARABIC_PACK_C_BAD_COMPARISON');
  const prompt=localized('Örnekteki harekeyle aynı işareti taşıyan heceyi seç.',
   'Select the syllable carrying the same short-vowel mark as the example.',
   'اختر المقطع الذي يحمل نفس الحركة الموجودة في المثال.',
   'Wähle die Silbe mit demselben kurzen Vokalzeichen wie im Beispiel.',
   'Choisis la syllabe portant la même voyelle brève que dans l’exemple.');
  add('match-'+id,'harakat-compare',stageMarks,letter.glyph+m.mark,
   prompt,m,examples(reference.glyph),2,'Compare '+id+' with '+reference.id+' / '+m.id);
 });
 const makeSyllables=(base,stage,candidates,skill)=>{
  if(candidates.length!==11)throw Error('PACK_C_CANDIDATE_COUNT');
  candidates.forEach((id,i)=>{
   const ref=letters.get(id);
   if(!ref||ref.glyph===base)throw Error('PACK_C_IDENTICAL_TARGET_BASE');
   for(const mark of marks){
    const target=ref.glyph+mark.mark;
    const prompt=localized(
     'Örnekteki harekeye karşılık gelen '+(base==='ب'?'Be':'Te')+' hecesini seç.',
     'Select the '+(base==='ب'?'Bā':'Tā')+' syllable with the same short vowel as the example.',
     'اختر المقطع الذي يحمل نفس حركة المثال، ويبدأ بحرف '+(base==='ب'?'الباء':'التاء')+'.',
     'Wähle die '+(base==='ب'?'Bā':'Tā')+'-Silbe mit demselben Vokalzeichen wie im Beispiel.',
     'Choisis la syllabe de '+(base==='ب'?'bā':'tā')+' portant la même voyelle brève que l’exemple.'
    );
    add(skill+'-'+id+'-'+mark.id,skill,stage,target,prompt,mark,
     examples(base),i<4?1:i<8?2:3,
     'Short vowel matching: '+ref.id+'/'+mark.id+' -> '+(base==='ب'?'ba':'ta'));
   }
  });
 };
 makeSyllables('ب',stageBa,
  ['ta','tha','jim','hha','kha','dal','dhal','ra','zay','sin','shin'],'syllable-ba');
 makeSyllables('ت',stageTa,
  ['ba','tha','jim','hha','kha','sad','dad','tta','zza','ayn','ghayn'],'syllable-ta');
 if(questions.length!==100||byStage[stageMarks]!==34||byStage[stageBa]!==33||byStage[stageTa]!==33||
  new Set(questions.map(q=>q.id)).size!==100)throw Error('ARABIC_PACK_C_NOT_100');
 if(questions.some(q=>q.audioRef||q.choices.some(c=>c.audioRef)))throw Error('ARABIC_PACK_C_UNVERIFIED_AUDIO');
 const registered=engine.registerPack({id:'arabic-harakat-pack-c-100',questions});
 window.DEEN_ARABIC_QUESTIONS_PACK_C=Object.freeze({
  version:1,id:registered.id,count:registered.count,distribution:Object.freeze({...byStage}),
  bySkill:Object.freeze({forms:28,matching:6,ba:33,ta:33}),questionIds:Object.freeze(questions.map(q=>q.id)),
  audioPolicy:'no-audio-without-confirmed-syllable-recording',nextPack:'sukun-shadda-madd-tanwin'
 });
})();