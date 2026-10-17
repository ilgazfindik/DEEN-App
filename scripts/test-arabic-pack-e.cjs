/* DEEN Pack E independent QA: 100 sourced word questions, 500 total. */
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),window={},ctx={window,console};
const read=n=>vm.runInNewContext(fs.readFileSync(path.join(root,'assets/i18n',n),'utf8'),ctx,{filename:n});
read('quran-arabic-letters.js');
window.DEEN_ARABIC_LETTER_AUDIO={available:id=>new Set(['alif','ba','ta','tha','jim','hha','kha','qaf','ya','waw','ha','nun','mim','lam','kaf']).has(id)};
for(const n of ['quran-arabic-questions-v2.js','quran-arabic-questions-pack-a.js',
 'quran-arabic-questions-pack-b.js','quran-arabic-harakat.js','quran-arabic-questions-pack-c.js',
 'quran-arabic-reading.js','quran-arabic-questions-pack-d.js','quran-arabic-words.js','quran-arabic-questions-pack-e.js'])
 read(n);
const {DEEN_ARABIC_QUESTIONS_V2:api,DEEN_ARABIC_WORDS:course,DEEN_ARABIC_QUESTIONS_PACK_E:pack}=window;
const sources={
 '112:1':'قُلْ هُوَ اللَّهُ أَحَدٌ',
 '96:2':'خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ',
 '20:25':'قَالَ رَبِّ اشْرَحْ لِي صَدْرِي',
 '112:3':'لَمْ يَلِدْ وَلَمْ يُولَدْ',
 '1:1':'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
},locale=['tr','en','ar','de','fr'];
assert.equal(api.stats().packs,5);
assert.equal(api.stats().questions,500);
assert.equal(api.stats().stages,16);
assert.equal(pack.count,100);assert.equal(pack.wordIds.length,20);
assert.deepEqual(JSON.parse(JSON.stringify(pack.bySkill)),{first:17,last:17,assemble:20,before:13,find:20,after:13});
assert.deepEqual(Array.from(course.lessons,x=>pack.distribution[x.id]),[34,33,33]);
const validated=new Set(),kinds={first:0,last:0,assemble:0,before:0,find:0,after:0};
for(const [idx,stage] of course.lessons.entries()){
 const pool=api.poolFor(stage.id);
 assert.equal(pool.length,[34,33,33][idx]);
 assert.equal(api.validateBank(pool).valid,true,'V2 QA '+stage.id);
 for(const count of [8,10,12]){
  const session=api.createSession(stage.id,{count,seed:17+idx});
  assert.equal(session.total,count);
  assert.equal(new Set(session.ids).size,count);
 }
 const s1=api.createSession(stage.id,{count:10,seed:40});
 const s2=api.createSession(stage.id,{count:10,seed:41,recentIds:s1.ids});
 assert.ok(s2.ids.some(id=>!s1.ids.includes(id)),'Recent questions avoided when pool allows it');
 for(const q of pool){
  assert.ok(!validated.has(q.id));validated.add(q.id);
  assert.equal(q.choices.length,4);
  assert.equal(q.choices.filter(x=>x.id===q.correctAnswer).length,1);
  assert.equal(new Set(q.choices.map(x=>x.id)).size,4);
  assert.equal(new Set(q.choices.map(x=>x.glyph)).size,4);
  assert.ok(q.choices.every(x=>!x.audioRef),'Word answers must not trigger nonlicensed audio');
  assert.ok(!q.audioRef);
  const answer=q.choices.find(x=>x.id===q.correctAnswer).glyph;
  const match=/^pack-e-(first|last|assemble|before|find|after)-(.+)$/.exec(q.id);
  assert.ok(match,q.id);const kind=match[1],slug=match[2];kinds[kind]++;
  assert.ok(q.source.includes(' '),q.id+' source label');
  const verse=q.source.match(/^(\d+:\d+)\s+(.+)$/);
  assert.ok(verse,q.id);
  const [_,ref,excerpt]=verse;
  assert.equal(excerpt,sources[ref],q.id+' source must exactly match approved course quote');
  const tokens=excerpt.split(/\s+/);
  for(const l of locale){
   assert.ok(q.prompt[l]?.length>=12,q.id+'/'+l+'/prompt');
   assert.ok(q.explanation[l]?.length>=16,q.id+'/'+l+'/explanation');
   for(const c of q.choices)if(c.id!==q.correctAnswer)
    assert.ok(q.distractorRationale[c.id]?.[l]?.length>=15,q.id+'/'+l+'/distractor');
  }
  if(kind==='first'||kind==='last'){
   assert.equal(idx,0);
   assert.ok(tokens.includes(q.target),'Displayed word must actually appear in cited verse');
   assert.ok(q.target.startsWith(answer)||q.target.endsWith(answer));
   assert.ok(q.target.length>answer.length,'Should be part, not entire word');
   assert.equal(kind==='first',q.id.includes('first-'));
   assert.equal(kind==='last',q.id.includes('last-'));
  }else if(kind==='assemble'){
   assert.equal(idx,1);
   assert.equal(q.target.split(' + ').join(''),answer,'Joining only attested written pieces');
   assert.ok(tokens.includes(answer),'Assembled word must occur in quoted verse');
  }else if(kind==='find'){
   assert.equal(idx,2);
   assert.equal(q.target,excerpt);
   assert.ok(tokens.includes(answer),'Find answer must occur in verse');
   for(const x of q.choices)if(x.id!==q.correctAnswer)
    assert.ok(!tokens.includes(x.glyph),'Wrong choice must NOT be another correct word in verse');
  }else{
   assert.equal(idx,kind==='before'?1:2);
   assert.equal(q.target,excerpt);
   const m=slug.match(/^(\d+)-(\d+)-(\d+)$/);
   assert.ok(m,slug);const refFromId=m[1]+':'+m[2],position=Number(m[3]);
   assert.equal(refFromId,ref);
   const expected=tokens[position+(kind==='before'?-1:1)];
   assert.ok(expected);
   assert.equal(answer,expected,'Only immediate neighboring token is correct');
   const anchor=tokens[position];
   assert.ok(q.prompt.tr.includes('«'+anchor+'»'));
   assert.ok(q.choices.filter(x=>x.glyph===expected).length===1);
  }
 }
}
assert.deepEqual(kinds,{first:17,last:17,assemble:20,before:13,find:20,after:13});
assert.equal(validated.size,100);
const first=api.poolFor(course.lessons[0].id)[0],before=api.stats().questions;
assert.throws(()=>api.registerPack({id:'duplicate-pack-e',questions:[{
 ...first,id:'pack-e-artificial-reorder',choices:[...first.choices].reverse()
}]}),/V2_QUESTION_AUDIT_FAILED/);
assert.equal(api.stats().questions,before,'Pack registration must be atomic');
console.log('PASS ARABIC PACK E: 100 sourced word tasks, 5 attested Qur’an excerpts, exact letter/word segmentation, 34/33/33 playable stages, 500 total, 5 locales, no invented audio');
