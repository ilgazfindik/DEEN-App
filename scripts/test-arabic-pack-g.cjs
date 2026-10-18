/* DEEN Arabic V2 Pack G — actual 900-question regression gate. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),window={},ctx={window,console};
const load=name=>vm.runInNewContext(fs.readFileSync(path.join(root,'assets/i18n',name),'utf8'),ctx,{filename:name});
load('quran-arabic-letters.js');
window.DEEN_ARABIC_LETTER_AUDIO={available:id=>new Set([
 'alif','ba','ta','tha','jim','hha','kha','qaf','ya','waw','ha','nun','mim','lam','kaf'
]).has(id)};
const base=[
 'quran-arabic-questions-v2.js','quran-arabic-questions-pack-a.js','quran-arabic-questions-pack-b.js',
 'quran-arabic-harakat.js','quran-arabic-questions-pack-c.js','quran-arabic-reading.js',
 'quran-arabic-questions-pack-d.js','quran-arabic-words.js','quran-arabic-questions-pack-e.js',
 'quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js',
 'quran-arabic-questions-pack-f.js'
];
for(const name of base)load(name);
const api=window.DEEN_ARABIC_QUESTIONS_V2;
assert.equal(api.stats().questions,600,'The 600 source-checked questions must remain intact');
assert.equal(api.stats().packs,6);
const beforeIds=new Set();
for(const x of [
 window.DEEN_ARABIC_LETTERS,window.DEEN_ARABIC_HARAKAT,window.DEEN_ARABIC_READING,
 window.DEEN_ARABIC_WORDS,window.DEEN_ARABIC_MEANING,window.DEEN_ARABIC_PHRASES,
 window.DEEN_ARABIC_PATTERNS
 ])for(const l of x.lessons)for(const q of api.poolFor(l.id))beforeIds.add(q.id);
assert.equal(beforeIds.size,600);
const former=api.get([...beforeIds][0]);
load('quran-arabic-questions-pack-g.js');
const pack=window.DEEN_ARABIC_QUESTIONS_PACK_G;
assert.ok(pack);
assert.equal(pack.count,300);
assert.equal(api.stats().packs,7);
assert.equal(api.stats().questions,900);
assert.equal(api.stats().stages,25);
assert.equal(api.get(former.id),former,'Existing questions must not be overwritten');
assert.equal(pack.audioRequired,false);
assert.equal(new Set(pack.questionIds).size,300);
const locales=['tr','en','ar','de','fr'];
const newIds=new Set(pack.questionIds),sections={letters:0,harakat:0,reading:0,words:0};
let checked=0;
for(const group of [
 window.DEEN_ARABIC_LETTERS,window.DEEN_ARABIC_HARAKAT,window.DEEN_ARABIC_READING,
 window.DEEN_ARABIC_WORDS,window.DEEN_ARABIC_MEANING,window.DEEN_ARABIC_PHRASES,
 window.DEEN_ARABIC_PATTERNS
 ]){
 for(const stage of group.lessons){
  const pool=api.poolFor(stage.id);
  assert.ok(pool.length>=8,'Pool remains playable: '+stage.id);
  assert.equal(api.validateBank(pool).valid,true,'Five-language validation: '+stage.id);
  const ids=pool.map(q=>q.id);
  assert.equal(new Set(ids).size,ids.length,'No duplicate IDs: '+stage.id);
  for(const q of pool.filter(q=>newIds.has(q.id))){
   checked++;
   assert.ok(q.id.startsWith('pack-g-'));
   assert.ok(q.source.includes('not quoted Quran'));
   assert.ok(!q.audioRef&&q.choices.every(c=>!c.audioRef));
   assert.ok(q.choices.length>=3&&q.choices.length<=4);
   assert.equal(q.choices.filter(c=>c.id===q.correctAnswer).length,1);
   for(const locale of locales){
    assert.ok(q.prompt?.[locale]?.trim(),'Question translation '+q.id+'/'+locale);
    assert.ok(q.explanation?.[locale]?.trim(),'Answer explanation '+q.id+'/'+locale);
    for(const choice of q.choices.filter(c=>c.id!==q.correctAnswer))
     assert.ok(q.distractorRationale[choice.id]?.[locale]?.trim(),'Distractor '+q.id+'/'+locale);
   }
   if(stage.id.startsWith('arabic-letters-'))sections.letters++;
   else if(stage.id.startsWith('arabic-harakat-'))sections.harakat++;
   else if(stage.id.startsWith('arabic-reading-'))sections.reading++;
   else if(stage.id.startsWith('arabic-word-'))sections.words++;
   else throw Error('New question in unplanned lesson '+stage.id);
  }
  const session=api.createSession(stage.id,{seed:177,count:10});
  assert.ok(session&&session.total===Math.min(10,pool.length));
  assert.equal(new Set(session.ids).size,10);
 }
}
assert.equal(checked,300,'All 300 new exercises must be reachable from existing lessons');
assert.equal(sections.letters,56);
assert.equal(sections.harakat,81);
assert.equal(sections.reading,81);
assert.equal(sections.words,82);
const oldPractice={schema:1,cards:{
 [former.id]:{step:1,attempts:3,correct:2,mistakes:1,dueAt:1000,lastAt:500,confusions:{}}
},sessions:[]};
const clean=api.cleanPractice(oldPractice);
assert.equal(clean.cards[former.id].attempts,3,'Existing practice history retained');
assert.equal(clean.cards[former.id].correct,2);
assert.equal(api.assessment.questionCount,8,'Pre/post assessment remains unchanged');
assert.equal(api.choicePositionAudit().questions,850,'850 selectable items; 28 match and 22 build use other modes');
console.log('PASS ARABIC PACK G EXPANSION '+JSON.stringify({
 total:api.stats().questions,newQuestions:checked,sections,
 packs:api.stats().packs,stages:api.stats().stages,locales,
 pendingAudio:false,previousQuestionsPreserved:beforeIds.size
}));