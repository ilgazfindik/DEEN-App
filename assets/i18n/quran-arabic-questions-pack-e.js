/* DEEN V2 Pack E: 100 actual word-recognition questions based on
 * 5 attested, existing Qur'an course excerpts. No new translations,
 * speculative recitation, arbitrary syllable strings or fabricated MP3s.
 * 34 word-part recognition + 33 assembly/context-preceding
 * +33 verse recognition/context-following.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_QUESTIONS_PACK_E)return;
 const wordsModule=window.DEEN_ARABIC_WORDS,engine=window.DEEN_ARABIC_QUESTIONS_V2;
 if(!wordsModule||!engine||wordsModule.lessons.length!==3)
  throw Error('ARABIC_PACK_E_DEPENDENCIES_MISSING');
 const stages=wordsModule.lessons.map(x=>x.id);
 const locales=Object.freeze(['tr','en','ar','de','fr']);
 const t=(tr,en,ar,de,fr)=>Object.freeze({tr,en,ar,de,fr});
 // The exact excerpts below are present in quran-arabic-words.js.
 // A word is included only when its exact fully-vowelled form occurs in
 // the stated verse and its pedagogical written pieces concatenate exactly.
 const verses=Object.freeze([
  {ref:'112:1',text:'قُلْ هُوَ اللَّهُ أَحَدٌ'},
  {ref:'96:2',text:'خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ'},
  {ref:'20:25',text:'قَالَ رَبِّ اشْرَحْ لِي صَدْرِي'},
  {ref:'112:3',text:'لَمْ يَلِدْ وَلَمْ يُولَدْ'},
  {ref:'1:1',text:'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
 ].map(v=>Object.freeze({...v,tokens:Object.freeze(v.text.split(/\s+/))})));
 const entries=[
  ['qul','قُلْ',['قُ','لْ'],'112:1'],
  ['huwa','هُوَ',['هُ','وَ'],'112:1'],
  ['allah','اللَّهُ',['ال','لَّهُ'],'112:1'],
  ['ahad','أَحَدٌ',['أَ','حَ','دٌ'],'112:1'],
  ['khalaqa','خَلَقَ',['خَ','لَ','قَ'],'96:2'],
  ['insan','الْإِنسَانَ',['الْ','إِن','سَا','نَ'],'96:2'],
  ['min','مِنْ',['مِ','نْ'],'96:2'],
  ['alaq','عَلَقٍ',['عَ','لَ','قٍ'],'96:2'],
  ['qala','قَالَ',['قَا','لَ'],'20:25'],
  ['rabbi','رَبِّ',['رَ','بِّ'],'20:25'],
  ['ishrah','اشْرَحْ',['اشْ','رَ','حْ'],'20:25'],
  ['li','لِي',['لِ','ي'],'20:25'],
  ['sadri','صَدْرِي',['صَ','دْ','رِ','ي'],'20:25'],
  ['lam','لَمْ',['لَ','مْ'],'112:3'],
  ['yalid','يَلِدْ',['يَ','لِ','دْ'],'112:3'],
  ['walam','وَلَمْ',['وَ','لَ','مْ'],'112:3'],
  ['yulad','يُولَدْ',['يُو','لَ','دْ'],'112:3'],
  ['bismi','بِسْمِ',['بِ','سْ','مِ'],'1:1'],
  ['rahman','الرَّحْمَٰنِ',['ال','رَّ','حْ','مَٰ','نِ'],'1:1'],
  ['rahim','الرَّحِيمِ',['ال','رَّ','حِ','ي','مِ'],'1:1']
 ];
 const words=Object.freeze(entries.map(([id,glyph,parts,ref])=>{
  const verse=verses.find(v=>v.ref===ref);
  if(!verse||!verse.tokens.includes(glyph)||parts.join('')!==glyph||parts.length<2)
   throw Error('ARABIC_PACK_E_UNATTESTED_TOKEN_OR_INVALID_PIECES:'+id);
  return Object.freeze({id,glyph,parts:Object.freeze(parts),verse,
   index:verse.tokens.indexOf(glyph)});
 }));
 if(words.length!==20||new Set(words.map(w=>w.glyph)).size!==20)
  throw Error('ARABIC_PACK_E_CORPUS_DUPLICATE');
 // Every verse and spelling must still match the established course data.
 const known=wordsModule.lessons.flatMap(x=>x.items);
 for(const item of known){
  if(!verses.some(v=>v.ref===item.reference&&v.text===item.excerpt&&v.tokens.includes(item.glyph)))
   throw Error('ARABIC_PACK_E_COURSE_SOURCE_MISMATCH:'+item.id);
 }
 const reason=(candidate,correct)=>t(
  '«'+candidate+'» geçerli bir yazılış olsa da bu soruda istenen «'+correct+'» değildir.',
  '“'+candidate+'” is a real written form, but not the requested “'+correct+'”.',
  '«'+candidate+'» كتابة موجودة، لكنها ليست الإجابة المطلوبة «'+correct+'».',
  '„'+candidate+'“ ist eine echte Schreibform, aber nicht die gesuchte „'+correct+'“.',
  '«'+candidate+'» est une forme écrite réelle, mais pas «'+correct+'» ici.'
 );
 const explainParts=(w,mode)=>t(
  '«'+w.glyph+'» kelimesinin doğru parça sırası: '+w.parts.join(' + ')+'.',
  'The word '+w.glyph+' is written in this order: '+w.parts.join(' + ')+'.',
  'تُكتب كلمة '+w.glyph+' بهذه الأجزاء بالترتيب: '+w.parts.join(' + ')+'.',
  'Die Wortteile von '+w.glyph+' stehen in dieser Reihenfolge: '+w.parts.join(' + ')+'.',
  'Les segments de '+w.glyph+' se suivent ainsi : '+w.parts.join(' + ')+'.'
 );
 const explainContext=(verse,anchor,answer,direction)=>t(
  'Ayet ('+verse.ref+') içinde «'+anchor+'» kelimesinin '+(direction==='before'?'hemen öncesi':'hemen sonrası')+' «'+answer+'» şeklindedir.',
  'In '+verse.ref+', the word immediately '+(direction==='before'?'before':'after')+' '+anchor+' is '+answer+'.',
  'في الآية '+verse.ref+' تأتي كلمة '+answer+' '+(direction==='before'?'قبل':'بعد')+' كلمة '+anchor+' مباشرةً.',
  'In '+verse.ref+' steht '+answer+' direkt '+(direction==='before'?'vor':'nach')+' '+anchor+'.',
  'Dans '+verse.ref+', '+answer+' se trouve juste '+(direction==='before'?'avant':'après')+' '+anchor+'.'
 );
 const prompt=(kind,w,anchor)=>kind==='first'?t(
  '«'+w.glyph+'» kelimesinin ilk yazılı parçası hangisi?',
  'Which written segment begins '+w.glyph+'?',
  'ما الجزء المكتوب الأول من كلمة '+w.glyph+'؟',
  'Welcher Teil steht am Anfang von '+w.glyph+'?',
  'Quel segment commence le mot '+w.glyph+' ?'):
 kind==='last'?t(
  '«'+w.glyph+'» kelimesinin son yazılı parçası hangisi?',
  'Which written segment ends '+w.glyph+'?',
  'ما الجزء المكتوب الأخير من كلمة '+w.glyph+'؟',
  'Welcher Teil steht am Ende von '+w.glyph+'?',
  'Quel segment termine le mot '+w.glyph+' ?'):
 kind==='assemble'?t(
  'Verilen parçalar sırayla birleşince hangi gerçek Arapça kelime oluşur?',
  'Which real Arabic word is formed by joining these segments in order?',
  'أي كلمة عربية صحيحة تتكون من وصل الأجزاء المعروضة بالترتيب؟',
  'Welches echte arabische Wort entsteht aus diesen Teilen in der angegebenen Reihenfolge?',
  'Quel mot arabe réel obtient-on en reliant ces segments dans cet ordre ?'):
 kind==='find'?t(
  'Ayette «'+w.glyph+'» kelimesini aynen yazıldığı biçimde bul.',
  'Find the exact written form of '+w.glyph+' in the verse.',
  'ابحث عن كلمة '+w.glyph+' مكتوبةً كما وردت في الآية.',
  'Finde die genaue Schreibweise von '+w.glyph+' im Vers.',
  'Trouve l’écriture exacte de '+w.glyph+' dans le verset.'):
 kind==='before'?t(
  'Bu ayette «'+anchor+'» kelimesinden hemen önce hangisi gelir?',
  'Which word comes immediately before '+anchor+' in this verse?',
  'أي كلمة تأتي مباشرةً قبل '+anchor+' في هذه الآية؟',
  'Welches Wort steht in diesem Vers direkt vor '+anchor+'?',
  'Quel mot précède immédiatement '+anchor+' dans ce verset ?'):
 t(
  'Bu ayette «'+anchor+'» kelimesinden hemen sonra hangisi gelir?',
  'Which word comes immediately after '+anchor+' in this verse?',
  'أي كلمة تأتي مباشرةً بعد '+anchor+' في هذه الآية؟',
  'Welches Wort steht in diesem Vers direkt nach '+anchor+'?',
  'Quel mot suit immédiatement '+anchor+' dans ce verset ?'
 );
 const all=[],byKind={first:0,last:0,assemble:0,before:0,find:0,after:0},byStage={};
 function question({id,kind,word,stage,target,answer,others,detail,level,source}){
  // Candidates are genuine documented word forms/segments; every glyph differs.
  const clean=[...new Set(others)].filter(s=>s!==answer).slice(0,3);
  if(clean.length!==3)throw Error('ARABIC_PACK_E_DISTRACTOR_COUNT:'+id);
  const right={id:'correct',glyph:answer},wrong=clean.map((glyph,i)=>({id:'other-'+(i+1),glyph}));
  const options=[...wrong];options.splice(all.length%4,0,right);
  const why=Object.fromEntries(wrong.map(c=>[c.id,reason(c.glyph,answer)]));
  all.push(Object.freeze({
   id:'pack-e-'+id,skill:'word-'+kind,stage,difficulty:level,type:'choice',
   target,prompt:prompt(kind,word,detail?.anchor),choices:Object.freeze(options.map(Object.freeze)),
   correctAnswer:right.id,explanation:detail?.explanation||explainParts(word,kind),
   distractorRationale:Object.freeze(why),locale:locales,source
  }));
  byKind[kind]++;byStage[stage]=(byStage[stage]||0)+1;
 }
 const onset=words.map(w=>w.parts[0]),ending=words.map(w=>w.parts.at(-1));
 const candidates=(correct,primary,fallback)=>[...new Set([...primary,...fallback])].filter(x=>x!==correct).slice(0,3);
 // Lesson 14: 17 first- and 17 last-segment tasks: actual word boundaries.
 words.slice(0,17).forEach((w,i)=>{
  question({id:'first-'+w.id,kind:'first',word:w,stage:stages[0],
   target:w.glyph,answer:w.parts[0],others:candidates(w.parts[0],onset,ending),
   level:i<8?1:2,source:w.verse.ref+' '+w.verse.text});
  question({id:'last-'+w.id,kind:'last',word:w,stage:stages[0],
   target:w.glyph,answer:w.parts.at(-1),others:candidates(w.parts.at(-1),ending,onset),
   level:i<8?1:2,source:w.verse.ref+' '+w.verse.text});
 });
 const otherWords=(correct,preferred=[])=>candidates(correct,preferred,words.map(w=>w.glyph));
 // Lesson 15: assemble all 20 independently sourced words.
 words.forEach((w,i)=>{
  question({id:'assemble-'+w.id,kind:'assemble',word:w,stage:stages[1],
   target:w.parts.join(' + '),answer:w.glyph,
   others:otherWords(w.glyph,w.verse.tokens),level:i<7?1:i<14?2:3,
   source:w.verse.ref+' '+w.verse.text});
 });
 // Lesson 16: locate each of the 20 unique words IN ITS VERSE.
 words.forEach((w,i)=>{
  question({id:'find-'+w.id,kind:'find',word:w,stage:stages[2],
   target:w.verse.text,answer:w.glyph,
   others:words.filter(x=>!w.verse.tokens.includes(x.glyph)).map(x=>x.glyph),
   level:i<7?1:i<14?2:3,source:w.verse.ref+' '+w.verse.text,
   detail:{explanation:t(
    '«'+w.glyph+'», '+w.verse.ref+' ayetinde aynen bu biçimde yer alır.',
    w.glyph+' appears in this exact form in verse '+w.verse.ref+'.',
    'وردت كلمة '+w.glyph+' بهذه الصورة في الآية '+w.verse.ref+'.',
    w.glyph+' steht genau so in Vers '+w.verse.ref+'.',
    w.glyph+' apparaît ainsi dans le verset '+w.verse.ref+'.')}});
 });
 const adjacent=(direction,stage)=>{
  const positions=verses.flatMap(v=>v.tokens.map((glyph,i)=>({verse:v,glyph,i})))
   .filter(row=>direction==='before'?row.i>0:row.i<row.verse.tokens.length-1);
  if(positions.length<13)throw Error('ARABIC_PACK_E_INSUFFICIENT_ADJACENCY');
  positions.slice(0,13).forEach((row,i)=>{
   const answer=row.verse.tokens[row.i+(direction==='before'?-1:1)];
   const anchor=row.glyph;
   const w=words.find(x=>x.glyph===anchor)||words[0];
   question({id:direction+'-'+row.verse.ref.replace(':','-')+'-'+row.i,
    kind:direction,word:w,stage,target:row.verse.text,answer,
    others:otherWords(answer,row.verse.tokens.filter(x=>x!==answer)),
    level:i<4?2:3,source:row.verse.ref+' '+row.verse.text,
    detail:{anchor,explanation:explainContext(row.verse,anchor,answer,direction)}
   });
  });
 };
 adjacent('before',stages[1]);adjacent('after',stages[2]);
 if(all.length!==100||byStage[stages[0]]!==34||byStage[stages[1]]!==33||
   byStage[stages[2]]!==33||new Set(all.map(x=>x.id)).size!==100)
  throw Error('ARABIC_PACK_E_WRONG_COUNT');
 if(all.some(x=>x.audioRef||x.choices.some(y=>y.audioRef)))
  throw Error('ARABIC_PACK_E_UNVERIFIED_AUDIO');
 const reg=engine.registerPack({id:'arabic-words-pack-e-100',questions:all});
 window.DEEN_ARABIC_QUESTIONS_PACK_E=Object.freeze({
  version:1,id:reg.id,count:reg.count,
  distribution:Object.freeze({...byStage}),bySkill:Object.freeze({...byKind}),
  wordIds:Object.freeze(words.map(w=>w.id)),questionIds:Object.freeze(all.map(q=>q.id)),
  sourcePolicy:'only-preexisting-verse-excerpts',audioPolicy:'no-unapproved-quran-word-audio'
 });
})();