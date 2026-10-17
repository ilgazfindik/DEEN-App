/* Pack F: independent source/semantics audit of final 100 meaning questions. */
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),window={},ctx={window,console};
const load=name=>vm.runInNewContext(fs.readFileSync(path.join(root,'assets/i18n',name),'utf8'),ctx,{filename:name});
load('quran-arabic-letters.js');
window.DEEN_ARABIC_LETTER_AUDIO={available:id=>new Set(['alif','ba','ta','tha','jim','hha','kha','qaf','ya','waw','ha','nun','mim','lam','kaf']).has(id)};
for(const n of ['quran-arabic-questions-v2.js','quran-arabic-questions-pack-a.js',
 'quran-arabic-questions-pack-b.js','quran-arabic-harakat.js','quran-arabic-questions-pack-c.js',
 'quran-arabic-reading.js','quran-arabic-questions-pack-d.js','quran-arabic-words.js',
 'quran-arabic-questions-pack-e.js','quran-arabic-meaning.js','quran-arabic-phrases.js',
 'quran-arabic-patterns.js','quran-arabic-questions-pack-f.js'])load(n);
const {DEEN_ARABIC_QUESTIONS_V2:api,DEEN_ARABIC_QUESTIONS_PACK_F:pack}=window;
const courses=[window.DEEN_ARABIC_MEANING,window.DEEN_ARABIC_PHRASES,window.DEEN_ARABIC_PATTERNS],
 lessons=courses.flatMap(c=>c.lessons),lang=['tr','en','ar','de','fr'];
assert.equal(api.stats().packs,6);
assert.equal(api.stats().questions,600);
assert.equal(api.stats().stages,25);
assert.equal(pack.count,100);
assert.deepEqual(Array.from(lessons,l=>pack.distribution[l.id]),[12,12,10,12,9,9,12,12,12]);
let total=0;const seen=new Set(),kinds={};
for(const lesson of lessons){
 const pool=api.poolFor(lesson.id);total+=pool.length;
 assert.equal(pool.length,pack.distribution[lesson.id]);
 assert.ok(pool.length>=9);
 assert.equal(api.validateBank(pool).valid,true,'Stage valid '+lesson.id);
 for(const size of [8,10,12]){
  const session=api.createSession(lesson.id,{count:size,seed:size+lesson.index});
  assert.equal(session.total,Math.min(size,pool.length));
  assert.equal(new Set(session.ids).size,Math.min(size,pool.length));
 }
 const previous=api.createSession(lesson.id,{count:8,seed:40});
 const next=api.createSession(lesson.id,{count:8,seed:40,recentIds:previous.ids});
 if(pool.length>8)assert.ok(next.ids.some(id=>!previous.ids.includes(id)));
 const stageTag='pack-f-'+lesson.id.replace(/^arabic-/,'')+'-';
 for(const q of pool){
  assert.ok(!seen.has(q.id));seen.add(q.id);
  assert.ok(q.id.startsWith(stageTag));
  assert.ok(q.id.startsWith('pack-f-'));
  assert.equal(q.stage,lesson.id);
  assert.equal(q.choices.filter(c=>c.id===q.correctAnswer).length,1);
  assert.ok(q.choices.length>=3&&q.choices.length<=4);
  assert.equal(new Set(q.choices.map(c=>c.glyph)).size,q.choices.length);
  assert.ok(q.choices.every(c=>!c.audioRef));
  assert.ok(!q.audioRef);
  const kind=q.skill.replace('understand-','');kinds[kind]=(kinds[kind]||0)+1;
  const card=lesson.items.find(x=>q.id.includes('-'+x.id)&&q.source===x.reference+' '+(x.excerpt||x.glyph));
  assert.ok(card,'Item and exact source matched: '+q.id);
  assert.ok(q.source.endsWith(card.excerpt||card.glyph));
  assert.ok((card.excerpt||card.glyph).includes(card.glyph));
  const correct=q.choices.find(c=>c.id===q.correctAnswer);
  for(const l of lang){
   assert.ok(q.prompt[l]?.length>=15,q.id+'/'+l+'/prompt');
   assert.ok(q.explanation[l]?.length>=14,q.id+'/'+l+'/explanation');
   for(const c of q.choices)if(c.id!==q.correctAnswer)
    assert.ok(q.distractorRationale[c.id]?.[l]?.length>=15,q.id+'/'+l+'/rationale');
   if(correct.label)assert.ok(correct.label[l]?.length>0,q.id+'/'+l+'/correct label');
  }
  if(['gloss','note','role'].includes(kind)){
   assert.equal(correct.id,card.id);
   assert.equal(correct.glyph,card.glyph);
   const field=kind==='gloss'?card.gloss||card.meaning:kind==='note'?card.note:card.role;
   assert.ok(field,'Source label missing '+q.id);
   for(const l of lang)assert.equal(correct.label[l],field[l]);
   assert.equal(q.target,card.glyph);
  }else if(kind==='find'){
   assert.equal(correct.id,card.id);
   assert.equal(correct.glyph,card.glyph);
   assert.equal(q.target,card.excerpt||card.glyph);
  }else if(kind==='ordinal'){
   const match=/-(first|last|second)$/.exec(q.id);assert.ok(match);
   const parts=(card.excerpt||card.glyph).split(/\s+/);
   const expected=match[1]==='first'?parts[0]:match[1]==='last'?parts.at(-1):parts[1];
   assert.equal(correct.glyph,expected);
   assert.equal(q.target,card.glyph);
  }else if(kind==='neighbor'){
   const tokens=card.excerpt.split(/\s+/),i=tokens.indexOf(card.glyph);
   assert.ok(i>=0);
   assert.equal(correct.glyph,tokens[i===tokens.length-1?i-1:i+1]);
   assert.equal(q.target,card.excerpt);
  }else assert.fail('Unsupported meaning skill '+kind);
 }
}
assert.equal(total,100);
assert.equal(seen.size,100);
assert.deepEqual(kinds,{gloss:29,find:27,neighbor:12,role:8,ordinal:17,note:7});
const first=api.poolFor(lessons[0].id)[0],before=api.stats().questions;
assert.throws(()=>api.registerPack({id:'shuffled-f-copy',questions:[
 {...first,id:'pack-f-rearranged-copy',choices:[...first.choices].reverse()}
]}),/V2_QUESTION_AUDIT_FAILED/);
assert.equal(api.stats().questions,before,'Semantic duplicate refusal remains atomic');
console.log('PASS ARABIC PACK F: 100 sourced semantics questions / 9 lessons, five locales, exact vocabulary and role/gloss source labels, 600 total and six packs, duplicate/audio rejection');
