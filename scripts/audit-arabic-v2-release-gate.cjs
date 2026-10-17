/* DEEN Arabic V2 phase 16 — non-negotiable 27-lesson/600-question release gate.
 * Auto QA is NOT a human attestation of recitation, Qur'anic interpretation or rights.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),win={},ctx={window:win,console};
const langs=['tr','en','ar','de','fr'];
function load(n){vm.runInNewContext(fs.readFileSync(path.join(root,'assets/i18n',n),'utf8'),ctx,{filename:n})}
load('quran-arabic-letters.js');
const clips=['alif','ba','ta','tha','jim','hha','kha','qaf','ya','waw','ha','nun','mim','lam','kaf'];
win.DEEN_ARABIC_LETTER_AUDIO={available:id=>clips.includes(id)};
for(const name of ['quran-arabic-questions-v2.js','quran-arabic-questions-pack-a.js','quran-arabic-questions-pack-b.js',
 'quran-arabic-harakat.js','quran-arabic-questions-pack-c.js','quran-arabic-reading.js','quran-arabic-questions-pack-d.js',
 'quran-arabic-words.js','quran-arabic-questions-pack-e.js','quran-arabic-listening.js','quran-arabic-meaning.js',
 'quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-questions-pack-f.js'])load(name);
const api=win.DEEN_ARABIC_QUESTIONS_V2;
const modules=[win.DEEN_ARABIC_LETTERS,win.DEEN_ARABIC_HARAKAT,win.DEEN_ARABIC_READING,
 win.DEEN_ARABIC_WORDS,win.DEEN_ARABIC_LISTENING,win.DEEN_ARABIC_MEANING,
 win.DEEN_ARABIC_PHRASES,win.DEEN_ARABIC_PATTERNS];
const lessons=modules.flatMap(m=>m.lessons);
assert.equal(lessons.length,27,'Every one of 27 lessons must be registered');
assert.equal(new Set(lessons.map(l=>l.id)).size,27,'Distinct lesson ids');
assert.deepEqual(Array.from(lessons,l=>l.index),Array.from({length:27},(_,i)=>i),'Lesson order 0..26');
const ui=fs.readFileSync(path.join(root,'assets/i18n/quran-arabic-paths.js'),'utf8');
const marker=' const lessonTips=Object.freeze(',start=ui.indexOf(marker);
assert(start>=0,'Tutor source section missing');
const begin=start+marker.length,end=ui.indexOf(');\n const tipUi=',begin);
assert(end>begin,'Tutor section could not be isolated');
const tips=JSON.parse(ui.slice(begin,end));
assert.equal(Object.keys(tips).length,27);
assert.deepEqual(new Set(Object.keys(tips)),new Set(lessons.map(l=>l.id)),'Tutorial ids and lessons must agree');
let tipEntries=0;
for(const lesson of lessons){
 const tip=tips[lesson.id];
 for(const lang of langs){
  const t=tip?.locale?.[lang];
  assert(t,'Missing '+lesson.id+'/'+lang);
  for(const key of ['title','oneSentence','mistakeTip'])
   assert(typeof t[key]==='string'&&t[key].trim().length>8,lesson.id+'/'+lang+'/'+key);
  assert(Array.isArray(t.examples)&&t.examples.length>=2&&t.examples.length<=3,lesson.id+'/'+lang+'/examples');
  assert(t.examples.every(row=>typeof row.glyph==='string'&&row.glyph.trim()&&typeof row.caption==='string'&&row.caption.trim()&&!row.audioRef),
   'Missing examples or unapproved tip audio '+lesson.id+'/'+lang);
  tipEntries++;
 }
}
const listening=new Set(win.DEEN_ARABIC_LISTENING.lessons.map(l=>l.id));
assert.equal(listening.size,2);
assert.equal(win.DEEN_ARABIC_LISTENING.approvedCount(),0,'Cannot claim six unapproved listening clips');
assert.equal(win.DEEN_ARABIC_LISTENING.requiredCount,6);
assert([...listening].every(id=>!win.DEEN_ARABIC_LISTENING.lessons.find(l=>l.id===id).items.some(x=>win.DEEN_ARABIC_LISTENING.clipReady(x.clipId))));
const playable=lessons.filter(l=>!listening.has(l.id));
assert.equal(playable.length,25);
assert.equal(api.stats().questions,600);
assert.equal(api.stats().packs,6);
assert.equal(api.stats().stages,25);
const all=[];
let sampled=0;
for(const lesson of playable){
 const pool=api.poolFor(lesson.id);
 assert(pool.length>=8,'Lesson missing 8 playable questions '+lesson.id);
 assert(api.validateBank(pool).valid,'Invalid pool '+lesson.id);
 all.push(...pool);
 for(const size of [8,10,12]){
  const a=api.createSession(lesson.id,{count:size,seed:lesson.index+71});
  assert.equal(a.total,Math.min(size,pool.length));
  assert.equal(new Set(a.ids).size,a.total,'Session repeats a question: '+lesson.id);
  assert(a.ids.every(id=>pool.some(q=>q.id===id)));
  sampled++;
 }
 for(const q of pool)for(const lang of langs){
  assert(q.prompt?.[lang]?.trim()&&q.explanation?.[lang]?.trim(),q.id+'/'+lang);
  assert(q.choices.find(c=>c.id===q.correctAnswer),'Missing answer '+q.id);
  for(const choice of q.choices)if(choice.id!==q.correctAnswer)
   assert(q.distractorRationale?.[choice.id]?.[lang]?.trim(),q.id+'/'+choice.id+'/'+lang);
 }
}
assert.equal(all.length,600);
assert.equal(new Set(all.map(q=>q.id)).size,600,'Duplicate questions across lessons');
assert(api.validateBank(all).valid,'Entire 600-question bank structurally invalid');
const result={phase:16,readiness:'AUTOMATED_QA_PASS_HUMAN_REVIEWS_PENDING',
 tutorialLessons:27,tutorialLocalizedCards:tipEntries,playableLessons:25,lockedListeningLessons:2,
 approvedListeningClips:0,requiredListeningClips:6,questions:all.length,languageCount:langs.length,
 languages:langs,sessionSizes:[8,10,12],sampledSessions:sampled,
 unapprovedLetterAudio:28-clips.length,
 promises:{sourceIntegrity:true,humanRecitationApproval:false,humanTheologyApproval:false,fullGeneralArabicB1:false}};
console.log('PASS ARABIC_V2_STAGE16_RELEASE_GATE '+JSON.stringify(result));
