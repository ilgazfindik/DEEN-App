/* Step 10: independent orthographic audit of 100 real Pack D questions */
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),window={},ctx={window,console};
const read=name=>vm.runInNewContext(fs.readFileSync(path.join(root,'assets/i18n',name),'utf8'),ctx,{filename:name});
read('quran-arabic-letters.js');
const allowed=new Set(['alif','ba','ta','tha','jim','hha','kha','qaf','ya','waw','ha','nun','mim','lam','kaf']);
window.DEEN_ARABIC_LETTER_AUDIO={available:id=>allowed.has(id)};
for(const n of ['quran-arabic-questions-v2.js','quran-arabic-questions-pack-a.js','quran-arabic-questions-pack-b.js','quran-arabic-harakat.js','quran-arabic-questions-pack-c.js','quran-arabic-reading.js','quran-arabic-questions-pack-d.js'])read(n);
const {DEEN_ARABIC_LETTERS:letters,DEEN_ARABIC_READING:reading,DEEN_ARABIC_QUESTIONS_V2:api,DEEN_ARABIC_QUESTIONS_PACK_D:pack}=window;
assert.equal(pack.count,100);assert.equal(api.stats().questions,400);
assert.equal(api.stats().packs,4);assert.equal(api.stats().stages,13);
assert.deepEqual(JSON.parse(JSON.stringify(pack.bySkill)),{sukun:34,shadda:33,madd:27,tanwin:6});
assert.deepEqual(Array.from(reading.lessons,x=>pack.distribution[x.id]),[34,33,33]);
const vowels=[{id:'fatha',mark:'\u064e',long:'\u0627'},{id:'kasra',mark:'\u0650',long:'\u064a'},{id:'damma',mark:'\u064f',long:'\u0648'}];
const had=new Set(),kinds={sukun:0,shadda:0,madd:0,tanwin:0},sukun='\u0652',shadda='\u0651';
const nouns={
 kitab:{fath:'كِتَابًا',kasr:'كِتَابٍ',damm:'كِتَابٌ',plain:'كِتَابَ'},
 ilm:{fath:'عِلْمًا',kasr:'عِلْمٍ',damm:'عِلْمٌ',plain:'عِلْمَ'}
};
for(const [i,stage] of reading.lessons.entries()){
 const pool=api.poolFor(stage.id);
 assert.equal(pool.length,[34,33,33][i]);
 assert.equal(api.validateBank(pool).valid,true,'Pack D stage validation '+stage.id);
 for(const count of [8,10,12]){
  const s=api.createSession(stage.id,{count,seed:100+i});
  assert.equal(s.total,count);assert.equal(new Set(s.ids).size,count);
 }
 const first=api.createSession(stage.id,{seed:99});
 const second=api.createSession(stage.id,{seed:99,recentIds:first.ids});
 assert.ok(second.ids.some(id=>!first.ids.includes(id)),'V2 avoids recent questions when pool large');
 for(const q of pool){
  assert.ok(!had.has(q.id),q.id);had.add(q.id);
  assert.equal(q.type,'choice');assert.equal(q.choices.length,4);
  assert.equal(new Set(q.choices.map(x=>x.id)).size,4);
  assert.equal(new Set(q.choices.map(x=>x.glyph)).size,4);
  assert.ok(!q.audioRef);assert.ok(q.choices.every(x=>!x.audioRef));
  assert.equal(q.choices.filter(x=>x.id===q.correctAnswer).length,1);
  const correct=q.choices.find(x=>x.id===q.correctAnswer);
  assert.equal(Object.keys(q.distractorRationale).length,3);
  for(const l of ['tr','en','ar','de','fr']){
   assert.ok(q.prompt[l]?.length>=12,q.id+'/'+l+'/prompt');
   assert.ok(q.explanation[l]?.length>=18,q.id+'/'+l+'/explain');
   for(const choice of q.choices)if(choice.id!==q.correctAnswer)
    assert.ok(q.distractorRationale[choice.id]?.[l]?.length>=15,q.id+'/'+l+'/distractor');
  }
  const a=q.id.match(/^pack-d-(sukun|shadda|madd|tanwin)-(.+)$/);
  assert.ok(a,'Expected question ID '+q.id);
  const kind=a[1];kinds[kind]++;
  if(kind==='sukun'){
   assert.equal(i,0);
   const transfer=q.id.startsWith('pack-d-sukun-match-');
   const id=transfer?q.id.slice('pack-d-sukun-match-'.length):q.id.slice('pack-d-sukun-'.length);
   const letter=letters.get(id);assert.ok(letter&&id!=='alif');
   assert.equal(correct.glyph,letter.glyph+sukun);
   assert.ok(correct.glyph.endsWith(sukun));
   if(!transfer)assert.equal(q.target,letter.glyph);
   else assert.ok(q.target.endsWith(sukun));
  }else if(kind==='shadda'){
   assert.equal(i,1);
   const transfer=q.id.startsWith('pack-d-shadda-match-');
   const id=transfer?q.id.slice('pack-d-shadda-match-'.length):q.id.slice('pack-d-shadda-'.length);
   const letter=letters.get(id);assert.ok(letter&&id!=='alif');
   const v=vowels.find(x=>x.id===q.correctAnswer);assert.ok(v);
   assert.equal(correct.glyph,letter.glyph+shadda+v.mark);
   assert.ok(q.choices.some(x=>x.id==='no-shadda'));
  }else if(kind==='madd'){
   assert.equal(i,2);
   const m=q.id.match(/^pack-d-madd-([a-z]+)-(fatha|kasra|damma)$/);
   assert.ok(m);const letter=letters.get(m[1]),v=vowels.find(x=>x.id===m[2]);
   assert.ok(letter&&v);assert.equal(q.correctAnswer,v.id);
   assert.equal(correct.glyph,letter.glyph+v.mark+v.long);
   assert.equal(q.target,letter.glyph+v.mark);
   assert.ok(q.choices.some(x=>x.id==='short'&&x.glyph===letter.glyph+v.mark));
  }else if(kind==='tanwin'){
   assert.equal(i,2);
   const m=q.id.match(/^pack-d-tanwin-(kitab|ilm)-(fath|kasr|damm)$/);assert.ok(m);
   assert.equal(correct.glyph,nouns[m[1]][m[2]]);
   assert.equal(q.choices.find(x=>x.id==='plain').glyph,nouns[m[1]].plain);
   assert.ok(!correct.glyph.endsWith('\u0652'),'Tanwin is not sukūn');
  }
 }
}
assert.deepEqual(kinds,{sukun:34,shadda:33,madd:27,tanwin:6});
assert.equal(had.size,100);
const one=api.poolFor(reading.lessons[0].id)[0],prior=api.stats().questions;
assert.throws(()=>api.registerPack({id:'duplicate-pack-d',questions:[{
 ...one,id:'pack-d-shuffled-copy',choices:[...one.choices].reverse()
}]}),/V2_QUESTION_AUDIT_FAILED/);
assert.equal(api.stats().questions,prior,'Duplicate rejection is atomic');
console.log('PASS ARABIC PACK D: 100/100 verified, 400 total, sukūn/shadda/madd/tanwīn spelling, six real noun tanwīn endings, 5 locales, 13 V2 stages, no invented audio');
