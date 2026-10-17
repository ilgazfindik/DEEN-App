/* Pack B: independent non-browser QA; actual Arabic joining rules, 100 question keys and 200 total. */
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),window={};
const ctx={window,console,location:{hostname:'localhost'}};
const load=n=>vm.runInNewContext(fs.readFileSync(path.join(root,'assets/i18n',n),'utf8'),ctx,{filename:n});
load('quran-arabic-letters.js');
const allowed=new Set(['alif','ba','ta','tha','jim','hha','kha','qaf','ya','waw','ha','nun','mim','lam','kaf']);
window.DEEN_ARABIC_LETTER_AUDIO={available:id=>allowed.has(id)};
load('quran-arabic-questions-v2.js');load('quran-arabic-questions-pack-a.js');load('quran-arabic-questions-pack-b.js');
const {DEEN_ARABIC_LETTERS:letters,DEEN_ARABIC_QUESTIONS_V2:api,DEEN_ARABIC_QUESTIONS_PACK_A:a,DEEN_ARABIC_QUESTIONS_PACK_B:b}=window;
const locales=['tr','en','ar','de','fr'],nonJoin=['alif','dal','dhal','ra','zay','waw'];
assert.equal(a.count,100);assert.equal(b.count,100);
assert.equal(api.stats().questions,200);assert.equal(api.stats().packs,2);
assert.equal(api.stats().stages,7);
assert.equal(letters.all.filter(x=>x.joinsNext).length,22);
assert.deepEqual(JSON.parse(JSON.stringify(letters.all.filter(x=>!x.joinsNext).map(x=>x.id).sort())),nonJoin.sort());
const dist=JSON.parse(JSON.stringify(b.bySkill));
assert.deepEqual(dist,{initial:28,medial:22,final:28,joining:22});
const answers=new Set(),ids=new Set(),kindTotal={initial:0,medial:0,final:0,joining:0};
for(const lesson of letters.lessons){
 const pool=api.poolFor(lesson.id),ours=pool.filter(q=>q.id.startsWith('pack-b-'));
 assert.equal(ours.length,b.distribution[lesson.id]);
 assert.ok(ours.length>=8,'B-only coverage for '+lesson.id);
 assert.equal(pool.length,a.distribution[lesson.id]+b.distribution[lesson.id]);
 assert.equal(api.validateBank(pool).valid,true,'joint A+B content QA '+lesson.id);
 for(const count of [8,10,12]){
  const session=api.createSession(lesson.id,{count,seed:count*243});
  assert.equal(session.total,count);
  assert.equal(new Set(session.ids).size,count);
 }
 const recent=api.createSession(lesson.id,{count:10,seed:1});
 const next=api.createSession(lesson.id,{count:10,seed:1,recentIds:recent.ids});
 assert.equal(next.ids.some(id=>!recent.ids.includes(id)),true,'Avoid repeat when possible');
 for(const q of ours){
  assert.ok(!ids.has(q.id));ids.add(q.id);
  const match=/^pack-b-(initial|medial|final|joining)-([a-z]+)$/.exec(q.id);
  assert.ok(match,q.id);
  const [,kind,id]=match,l=letters.get(id);
  assert.ok(l&&lesson.letterIds.includes(id));
  kindTotal[kind]++;
  const answer=q.choices.find(choice=>choice.id===q.correctAnswer);
  assert.ok(answer);assert.ok(!answers.has(q.id));answers.add(q.id);
  assert.equal(q.type,'choice');assert.equal(q.choices.length,4);
  assert.equal(new Set(q.choices.map(x=>x.id)).size,4);
  assert.equal(new Set(q.choices.map(x=>x.glyph)).size,4,'Unique visual choices '+q.id);
  assert.equal(Object.keys(q.distractorRationale).length,3);
  assert.equal(q.locale.length,5);
  assert.ok(q.choices.every(x=>!x.audioRef),'No letter-name audio on contextual forms');
  assert.equal(q.target,kind==='joining'?q.target:l.glyph);
  if(kind==='initial'){
   assert.equal(answer.glyph,l.forms.initial);
   if(nonJoin.includes(id))assert.equal(answer.glyph,l.glyph,'Nonjoiner initial must stay disconnected');
  }else if(kind==='medial'){
   assert.equal(l.joinsNext,true,'No medial for 6 nonjoining letters');
   assert.equal(answer.glyph,l.forms.medial);
   assert.ok(answer.glyph.startsWith('ـ')&&answer.glyph.endsWith('ـ'));
  }else if(kind==='final'){
   assert.equal(answer.glyph,l.forms.final);
   assert.ok(answer.glyph.startsWith('ـ'),'Joined to preceding letter');
  }else{
   assert.equal(l.joinsNext,true,'Only right-to-left joining letters get join questions');
   const target=q.target.split(' + ');
   assert.equal(target[0],l.glyph);
   const nextLetter=letters.all.find(x=>x.glyph===target[1]);
   assert.ok(nextLetter);
   assert.equal(answer.glyph,l.forms.initial+nextLetter.glyph,'Correct writing is ordered and joined');
   const wrong=Object.fromEntries(q.choices.map(x=>[x.id,x.glyph]));
   assert.equal(wrong.separated,l.glyph+' '+nextLetter.glyph);
   assert.ok(wrong.reversed!==answer.glyph);
   assert.ok(wrong['different-follower']!==answer.glyph);
  }
  for(const loc of locales){
   assert.ok(q.prompt[loc]?.length>=12,q.id+'/'+loc+'/prompt');
   assert.ok(q.explanation[loc]?.length>=20,q.id+'/'+loc+'/explanation');
   for(const option of q.choices)if(option.id!==q.correctAnswer)
    assert.ok(q.distractorRationale[option.id]?.[loc]?.length>=20,q.id+'/'+loc+'/rationale');
  }
 }
}
assert.equal(ids.size,100);
assert.deepEqual(kindTotal,{initial:28,medial:22,final:28,joining:22});
const sample=api.poolFor(letters.lessons[0].id).find(x=>x.id.startsWith('pack-b-'));
const old=api.stats().questions;
assert.throws(()=>api.registerPack({id:'pack-b-fake-reorder',questions:[{...sample,id:'pack-b-reorder',choices:[...sample.choices].reverse()}]}),/V2_QUESTION_AUDIT_FAILED/);
assert.equal(api.stats().questions,old,'Atomic rejection of duplicate content');
assert.equal(api.poolFor('arabic-letters-01').filter(x=>x.id.startsWith('pack-b-')).length,b.distribution['arabic-letters-01']);
console.log('PASS ARABIC PACK B: 100/100 new questions, 200 total, 28 initial + 22 medial + 28 final + 22 joining, six nonjoiners, 5 locales, 7 lessons, no unverified audio, duplicate refusal');
