/* Pack C content audit: 100 short-vowel questions, 3 real lessons, 300 total. */
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),window={},ctx={window,console};
const read=n=>vm.runInNewContext(fs.readFileSync(path.join(root,'assets/i18n',n),'utf8'),ctx,{filename:n});
read('quran-arabic-letters.js');
window.DEEN_ARABIC_LETTER_AUDIO={available:id=>new Set(['alif','ba','ta','tha','jim','hha','kha','qaf','ya','waw','ha','nun','mim','lam','kaf']).has(id)};
read('quran-arabic-questions-v2.js');
read('quran-arabic-questions-pack-a.js');
read('quran-arabic-questions-pack-b.js');
read('quran-arabic-harakat.js');
read('quran-arabic-questions-pack-c.js');
const {DEEN_ARABIC_QUESTIONS_V2:api,DEEN_ARABIC_QUESTIONS_PACK_C:pack,DEEN_ARABIC_HARAKAT:harakat,DEEN_ARABIC_LETTERS:letters}=window;
const locales=['tr','en','ar','de','fr'],marks=harakat.marks,stages=harakat.lessons;
assert.equal(pack.count,100);
assert.equal(api.stats().questions,300);
assert.equal(api.stats().packs,3);
assert.equal(api.stats().stages,10);
assert.deepEqual(JSON.parse(JSON.stringify(pack.bySkill)),{forms:28,matching:6,ba:33,ta:33});
assert.deepEqual(Array.from(stages,x=>pack.distribution[x.id]),[34,33,33]);
assert.deepEqual([...api.poolFor(stages[0].id)].map(x=>x.id).filter(id=>id.includes('pack-c-match-')).length,6);
const seen=new Set(),bySkill={};
for(const [i,stage] of stages.entries()){
 const pool=api.poolFor(stage.id);
 assert.equal(pool.length,[34,33,33][i]);
 assert.equal(api.validateBank(pool).valid,true);
 for(const count of [8,10,12]){
  const session=api.createSession(stage.id,{count,seed:i+99});
  assert.equal(session.total,count);
  assert.equal(new Set(session.ids).size,count);
 }
 const first=api.createSession(stage.id,{seed:17});
 const recent=api.createSession(stage.id,{seed:17,recentIds:first.ids});
 assert.ok(recent.ids.some(id=>!first.ids.includes(id)),'recent selection should avoid the same lesson questions');
 for(const q of pool){
  assert.ok(!seen.has(q.id));seen.add(q.id);
  assert.equal(q.choices.length,3);
  assert.equal(q.choices.filter(x=>x.id===q.correctAnswer).length,1);
  assert.equal(new Set(q.choices.map(x=>x.glyph)).size,3);
  assert.equal(q.locale.length,5);
  assert.ok(q.choices.every(x=>!x.audioRef),'no approved syllable recordings provided');
  assert.ok(!q.audioRef);
  assert.ok(q.source);
  const correct=q.choices.find(x=>x.id===q.correctAnswer);
  const mark=harakat.markById[q.correctAnswer];
  assert.ok(mark);
  assert.ok(correct.glyph.endsWith(mark.mark),'correct vowel mark visual agrees with answer');
  assert.deepEqual(Array.from(q.choices,x=>x.id).sort(),['fatha','kasra','damma'].sort());
  const kind=q.id.startsWith('pack-c-form-')?'form':q.id.startsWith('pack-c-match-')?'match':
   q.id.startsWith('pack-c-syllable-ba-')?'ba':'ta';
  bySkill[kind]=(bySkill[kind]||0)+1;
  if(kind==='form'){
    const letter=letters.get(q.id.slice('pack-c-form-'.length));
    assert.ok(letter);
    assert.equal(q.target,letter.glyph);
    assert.equal(correct.glyph,letter.glyph+mark.mark);
  }else if(kind==='match'){
    assert.ok(q.target.endsWith(mark.mark),'recognition compares matching vowel');
    assert.ok(correct.glyph.startsWith('ب')||correct.glyph.startsWith('ت'));
    assert.notEqual(correct.glyph,q.target,'do not copy the same visual glyph');
  }else{
    const base=kind==='ba'?'ب':'ت';
    assert.equal(correct.glyph,base+mark.mark,'same vowel under a different letter');
    assert.ok(q.target.endsWith(mark.mark));
    assert.notEqual(q.target,correct.glyph);
    assert.equal(q.stage,stages[kind==='ba'?1:2].id);
  }
  for(const l of locales){
   assert.ok(q.prompt[l]?.length>=15,q.id+'/'+l+'/prompt');
   assert.ok(q.explanation[l]?.length>=20,q.id+'/'+l+'/explanation');
   for(const opt of q.choices)if(opt.id!==q.correctAnswer)
    assert.ok(q.distractorRationale[opt.id]?.[l]?.length>=15,q.id+'/'+l+'/distractor');
  }
 }
}
assert.equal(seen.size,100);
assert.deepEqual(bySkill,{form:28,match:6,ba:33,ta:33});
const sample=api.poolFor(stages[1].id)[0];
const before=api.stats().questions;
assert.throws(()=>api.registerPack({id:'pack-c-duplicate-shuffle',questions:[{
 ...sample,id:'pack-c-duplicate-shuffle-01',choices:[...sample.choices].reverse()
}]}),/V2_QUESTION_AUDIT_FAILED/);
assert.equal(api.stats().questions,before);
console.log('PASS ARABIC PACK C: 100 short-vowel+syllable questions, 300 total, 3 lessons (34/33/33), 5 locales, true answers, 3 distinct choices, no fabricated recordings');
