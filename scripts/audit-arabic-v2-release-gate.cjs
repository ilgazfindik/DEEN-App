/* Stage 16: deterministic final curriculum/assessment release gate.
 * Complements real Chrome QA; does not certify recitation, theology or real-device cache capacity.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),window={},context={window,console};
const locales=['tr','en','ar','de','fr'];
const audioIds=new Set(['alif','ba','ta','tha','jim','hha','kha','qaf','ya','waw','ha','nun','mim','lam','kaf']);
const load=name=>vm.runInNewContext(
 fs.readFileSync(path.join(root,'assets/i18n',name),'utf8'),context,{filename:name});
load('quran-arabic-letters.js');
window.DEEN_ARABIC_LETTER_AUDIO={available:id=>audioIds.has(id)};
for(const name of [
 'quran-arabic-questions-v2.js','quran-arabic-questions-pack-a.js',
 'quran-arabic-questions-pack-b.js','quran-arabic-harakat.js',
 'quran-arabic-questions-pack-c.js','quran-arabic-reading.js',
 'quran-arabic-questions-pack-d.js','quran-arabic-words.js',
 'quran-arabic-questions-pack-e.js','quran-arabic-listening.js',
 'quran-arabic-meaning.js','quran-arabic-phrases.js',
 'quran-arabic-patterns.js','quran-arabic-questions-pack-f.js'
])load(name);

const api=window.DEEN_ARABIC_QUESTIONS_V2;
assert.ok(api,'V2 question engine not registered');
const groups=[
 window.DEEN_ARABIC_LETTERS,window.DEEN_ARABIC_HARAKAT,window.DEEN_ARABIC_READING,
 window.DEEN_ARABIC_WORDS,window.DEEN_ARABIC_LISTENING,window.DEEN_ARABIC_MEANING,
 window.DEEN_ARABIC_PHRASES,window.DEEN_ARABIC_PATTERNS
];
for(const group of groups)assert.ok(group?.lessons?.length,'Curriculum group unavailable');
const lessons=groups.flatMap(group=>group.lessons);
const ids=lessons.map(lesson=>lesson.id);
assert.equal(lessons.length,27,'Exactly 27 visible mini lessons');
assert.equal(new Set(ids).size,27,'Duplicate curriculum lesson');

const source=fs.readFileSync(path.join(root,'assets/i18n/quran-arabic-paths.js'),'utf8');
const marker=' const lessonTips=Object.freeze(';
const begin=source.indexOf(marker),start=begin+marker.length;
const end=source.indexOf(');\n const tipUi=',start);
assert.ok(begin>=0&&end>start,'The live lesson-tip lookup was not found');
const tips=JSON.parse(source.slice(start,end));
assert.equal(Object.keys(tips).length,27,'Exactly 27 actual lesson tips');
assert.deepEqual(Object.keys(tips).sort(),[...ids].sort(),'Tip IDs must match playable lessons');
let checkedTips=0;
for(const lesson of lessons){
 const tip=tips[lesson.id];
 assert.equal(tip.id,lesson.id);
 for(const lang of locales){
  const entry=tip.locale?.[lang];
  assert.ok(entry,'Missing '+lang+' tutorial '+lesson.id);
  for(const key of ['title','oneSentence','mistakeTip'])
   assert.ok(typeof entry[key]==='string'&&entry[key].trim(),'Missing '+key+' '+lesson.id+'/'+lang);
  assert.ok(Array.isArray(entry.examples)&&entry.examples.length>=2&&entry.examples.length<=3,
   'Tutorial must show two or three examples: '+lesson.id+'/'+lang);
  for(const example of entry.examples)
   assert.ok(example.glyph&&example.caption,'Missing teaching example: '+lesson.id+'/'+lang);
  checkedTips++;
 }
}

const stageCounts={},packCounts=Object.fromEntries('abcdef'.split('').map(x=>[x,0]));
const seen=new Set(),playable=[],unavailable=[];
for(const lesson of lessons){
 const pool=api.poolFor(lesson.id);
 if(!pool.length){unavailable.push(lesson.id);continue}
 assert.ok(pool.length>=8,'A playable V2 pool requires 8 or more questions: '+lesson.id);
 assert.ok(api.validateBank(pool).valid,'Invalid V2 question pool '+lesson.id);
 stageCounts[lesson.id]=pool.length;
 playable.push(lesson.id);
 for(const count of [8,10,12]){
  const session=api.createSession(lesson.id,{count,seed:16*1000+count});
  assert.ok(session,'Missing playable V2 session '+lesson.id);
  assert.equal(session.total,Math.min(count,pool.length),'Incorrect session length '+lesson.id);
  assert.equal(session.ids.length,session.total);
  assert.equal(new Set(session.ids).size,session.total,'Repeated question in session '+lesson.id);
  assert.ok(session.ids.every(id=>pool.some(q=>q.id===id)),'Question missing from stage pool '+lesson.id);
 }
 for(const q of pool){
  assert.ok(!seen.has(q.id),'Duplicate question registered: '+q.id);
  seen.add(q.id);
  assert.equal(q.stage,lesson.id,'Incorrect question stage: '+q.id);
  assert.ok(api.get(q.id),'Live question not addressable: '+q.id);
  const pack=q.id.match(/^pack-([a-f])-/);
  assert.ok(pack,'Unexpected content outside A-F: '+q.id);
  packCounts[pack[1]]++;
  assert.equal(q.choices.filter(c=>c.id===q.correctAnswer).length,1,'Bad answer key: '+q.id);
  for(const lang of locales){
   assert.ok(q.prompt?.[lang]?.trim(),'Missing prompt '+q.id+'/'+lang);
   assert.ok(q.explanation?.[lang]?.trim(),'Missing explanation '+q.id+'/'+lang);
   for(const choice of q.choices){
    if(choice.id!==q.correctAnswer)
     assert.ok(q.distractorRationale?.[choice.id]?.[lang]?.trim(),
      'Missing wrong-choice explanation: '+q.id+'/'+choice.id+'/'+lang);
   }
  }
 }
}
assert.deepEqual(unavailable.sort(),Array.from(window.DEEN_ARABIC_LISTENING.lessons,x=>x.id).sort(),
 'Only unlicensed independent listening lessons may lack a V2 question bank');
assert.equal(playable.length,25,'Expected 25 written-practice V2 lessons');
assert.equal(seen.size,600,'Total unique live questions');
assert.equal(api.stats().questions,600);
assert.equal(api.stats().packs,6);
assert.equal(api.stats().stages,25);
for(const [pack,count] of Object.entries(packCounts))
 assert.equal(count,100,'Pack '+pack.toUpperCase()+' must contain exactly 100 live questions');

const report={
 phase:16,build:'arabic-v2',curriculumLessons:lessons.length,teachingTips:checkedTips,
 locales,playableV2Lessons:playable.length,listeningLessonsAwaitingIndependentAudio:unavailable,
 uniqueQuestions:seen.size,packCounts,sessionSizesTested:[8,10,12],
 lessonQuestionCounts:stageCounts,
 limitations:['Automated checks do not imply expert Arabic/Quran validation',
  'Only 15 original letter recordings are approved; 13 are still missing',
  'Offline readiness depends on device cache and is tested separately in Chrome']
};
const reportArg=process.argv.find(x=>x.startsWith('--report='));
if(reportArg){
 const destination=path.resolve(reportArg.slice('--report='.length));
 fs.mkdirSync(path.dirname(destination),{recursive:true});
 fs.writeFileSync(destination,JSON.stringify(report,null,2)+'\n','utf8');
}
console.log('PASS ARABIC V2 STAGE16 RELEASE GATE '+JSON.stringify(report));
