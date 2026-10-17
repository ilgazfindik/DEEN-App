/* DEEN — Phase 14: deterministic five-locale, source, Arabic-script and audio QA.
 * This program does NOT certify theology, a Quran translation, or pronunciation.
 * Human-review queues remain explicit, including when all automatic tests pass.
 */
'use strict';
const {readFileSync}=require('node:fs');
const path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),window={},context={window,console},langs=['tr','en','ar','de','fr'];
function load(name){
 const pathName=path.join(root,'assets/i18n',name);
 vm.runInNewContext(readFileSync(pathName,'utf8'),context,{filename:name});
}
load('quran-arabic-letters.js');
const ids=['alif','ba','ta','tha','jim','hha','kha','qaf','ya','waw','ha','nun','mim','lam','kaf'];
window.DEEN_ARABIC_LETTER_AUDIO={available:ref=>ids.includes(ref)};
for(const name of [
 'quran-arabic-questions-v2.js','quran-arabic-questions-pack-a.js',
 'quran-arabic-questions-pack-b.js','quran-arabic-harakat.js',
 'quran-arabic-questions-pack-c.js','quran-arabic-reading.js',
 'quran-arabic-questions-pack-d.js','quran-arabic-words.js',
 'quran-arabic-questions-pack-e.js','quran-arabic-meaning.js',
 'quran-arabic-phrases.js','quran-arabic-patterns.js',
 'quran-arabic-questions-pack-f.js'
])load(name);
const api=window.DEEN_ARABIC_QUESTIONS_V2;
const failures=[],humanReview=[],warnings=[],stages=new Map(),perPack={};
const badControl=/[\u202a-\u202e\u2066-\u2069\u200e\u200f]/u;
const arabic=/[\u0621-\u064a\u0671-\u06d3]/u;
const arabicNumbers=/[\u0660-\u0669]/u;
const placeholder=/(?:\bTODO\b|\bTBD\b|undefined|null|nullish|\[object Object\]|lorem ipsum|translation pending)/i;
const dangerous=/<\s*(?:script|iframe|object|embed|img)\b/i;
// Do not canonicalize Qur'an/harakat text: mark sequencing is preserved verbatim.
const normalized=s=>s.replace(/\s+/g,' ').trim();
function fail(q,field,reason){failures.push({id:q.id,field,reason})}
function review(q,reason){humanReview.push({id:q.id,stage:q.stage,reason})}
function checkString(q,field,value){
 if(typeof value!=='string'||!value.trim()){fail(q,field,'EMPTY');return}
 if(badControl.test(value))fail(q,field,'BIDI_OVERRIDE_OR_ISOLATE');
 if(placeholder.test(value))fail(q,field,'PLACEHOLDER');
 if(dangerous.test(value))fail(q,field,'HTML_EXECUTABLE');
 if(value!==normalized(value))warnings.push({id:q.id,field,reason:'EXTRA_SPACES_OR_LINEBREAKS'});
}
assert.deepEqual(api.stats().packs,6);
assert.equal(api.stats().questions,600);
assert.equal(api.stats().stages,25);
for(const p of ['a','b','c','d','e','f'])perPack[p]=0;
const all=[];
for(const pack of ['a','b','c','d','e','f']){
 const key='DEEN_ARABIC_QUESTIONS_PACK_'+pack.toUpperCase(),record=window[key];
 assert(record,'Missing '+key);
 const questions=record.questions||record.items||[];
 // Published packs are registered through the V2 bank. Their declared count is checked independently.
 assert.equal(record.count,100,'Pack '+pack+' count mismatch');
}
const groupDefs=[
 window.DEEN_ARABIC_LETTERS.lessons,window.DEEN_ARABIC_HARAKAT.lessons,
 window.DEEN_ARABIC_READING.lessons,window.DEEN_ARABIC_WORDS.lessons,
 window.DEEN_ARABIC_MEANING.lessons,window.DEEN_ARABIC_PHRASES.lessons,
 window.DEEN_ARABIC_PATTERNS.lessons
];
const courseIds=new Set(groupDefs.flat().map(x=>x.id));
assert.equal(courseIds.size,25);
for(const stage of courseIds){
 const questions=api.poolFor(stage);assert(questions.length>=8,'Insufficient live questions '+stage);
 const validation=api.validateBank(questions);
 if(!validation.valid)for(const reason of validation.errors)fail({id:stage},'SCHEMA',reason);
 stages.set(stage,questions.length);
 all.push(...questions);
 for(const q of questions){
  const letter=q.id.match(/^pack-([a-f])-?/);
  if(!letter){fail(q,'id','MISSING_PACK_PREFIX');continue}
  perPack[letter[1]]++;
  if(!arabic.test(q.target))fail(q,'target','ARABIC_REQUIRED');
  if(q.audioRef&&!window.DEEN_ARABIC_LETTER_AUDIO.available(q.audioRef))fail(q,'audioRef','UNVERIFIED_AUDIO');
  checkString(q,'target',q.target);
  if(q.source)checkString(q,'source',q.source);
  const correct=q.choices.filter(c=>c.id===q.correctAnswer);
  if(correct.length!==1)fail(q,'correctAnswer','ANSWER_NOT_UNIQUE');
  for(const choice of q.choices)checkString(q,'choices.'+choice.id+'.glyph',choice.glyph);
  for(const locale of langs){
   checkString(q,'prompt.'+locale,q.prompt?.[locale]);
   checkString(q,'explanation.'+locale,q.explanation?.[locale]);
   if(locale==='ar'&&!arabic.test(q.prompt?.[locale]||''))fail(q,'prompt.ar','NO_ARABIC_SCRIPT');
   for(const choice of q.choices){
    if(choice.label){
     checkString(q,'choiceLabel.'+choice.id+'.'+locale,choice.label[locale]);
    }
    if(choice.id!==q.correctAnswer)
     checkString(q,'distractorRationale.'+choice.id+'.'+locale,q.distractorRationale?.[choice.id]?.[locale]);
    if(choice.audioRef&&!window.DEEN_ARABIC_LETTER_AUDIO.available(choice.audioRef))
     fail(q,'choices.'+choice.id+'.audio','UNVERIFIED_AUDIO');
   }
  }
  if(!q.source&&/^arabic-(?:meaning|phrase|pattern)/.test(q.stage))fail(q,'source','SOURCE_REQUIRED');
  if(/^(?:arabic-(?:meaning|phrase|pattern))/.test(q.stage))review(q,'QURAN_MEANING_GRAMMAR_CONTEXT');
  else if(/(?:harakat|reading|word)/.test(q.stage))review(q,'HARAKAT_OR_PHONETIC_DETAIL');
  if(q.audioRef||q.choices.some(c=>c.audioRef))review(q,'HUMAN_AUDIO_PRONUNCIATION_RIGHTS');
  // Same full prompt in another language is a possible copy-paste leak, not hard evidence.
  if(q.prompt?.tr===q.prompt?.en&&(q.prompt.tr||'').length>25)warnings.push({id:q.id,reason:'TR_EN_IDENTICAL_PROMPT'});
  if(q.prompt?.de===q.prompt?.fr&&(q.prompt.de||'').length>25)warnings.push({id:q.id,reason:'DE_FR_IDENTICAL_PROMPT'});
 }
}
assert.equal(all.length,600);
assert.equal(new Set(all.map(q=>q.id)).size,600);
for(const [pack,count] of Object.entries(perPack))assert.equal(count,100,'Pack '+pack);
assert.deepEqual(api.validateBank(all).valid,true,'Combined 600-question semantic integrity');
const out={phase:14,results:{packs:api.stats().packs,questions:all.length,stages:stages.size,
 localeCoverage:Object.fromEntries(langs.map(l=>[l,all.filter(q=>q.prompt?.[l]&&q.explanation?.[l]).length])),
 perPack,structuralErrors:failures.length,nonBlockingWarnings:warnings.length,
 humanReviewItems:humanReview.length,
 noHumanApprovalClaim:true,
 humanReviewByReason:Object.fromEntries([...new Set(humanReview.map(r=>r.reason))].map(key=>[key,humanReview.filter(r=>r.reason===key).length]))
 },firstFailures:failures.slice(0,25),firstWarnings:warnings.slice(0,15),reviewExamples:humanReview.slice(0,12)};
console.log('DEEN_ARABIC_V2_LOCALE_CONTENT_AUDIT '+JSON.stringify(out,null,2));
if(failures.length)process.exitCode=1;
