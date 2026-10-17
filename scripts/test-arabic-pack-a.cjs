/* DEEN Arabic V2 Pack A: independent 100-question content audit. No browser/network needed. */
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const window={},ctx={window,console};
const exec=f=>vm.runInNewContext(fs.readFileSync(path.join(root,'assets/i18n',f),'utf8'),ctx,{filename:f});
exec('quran-arabic-letters.js');
const allowed=new Set(['alif','ba','ta','tha','jim','hha','kha','qaf','ya','waw','ha','nun','mim','lam','kaf']);
window.DEEN_ARABIC_LETTER_AUDIO={available:id=>allowed.has(id)};
exec('quran-arabic-questions-v2.js');exec('quran-arabic-questions-pack-a.js');
const {DEEN_ARABIC_LETTERS:course,DEEN_ARABIC_QUESTIONS_V2:api,DEEN_ARABIC_QUESTIONS_PACK_A:pack}=window;
assert.equal(pack.count,100);assert.equal(api.stats().questions,100);
assert.equal(api.stats().stages,7);
const letters=course.all,byId=Object.fromEntries(letters.map(x=>[x.id,x]));
const dotTruth={alif:'none',ba:'one-below',ta:'two-above',tha:'three-above',
jim:'one-below',hha:'none',kha:'one-above',dal:'none',dhal:'one-above',ra:'none',
zay:'one-above',sin:'none',shin:'three-above',sad:'none',dad:'one-above',tta:'none',
zza:'one-above',ayn:'none',ghayn:'one-above',fa:'one-above',qaf:'two-above',
kaf:'none',lam:'none',mim:'none',nun:'one-above',ha:'none',waw:'none',ya:'two-below'};
const shapeFamily=[['ba','ta'],['jim','hha'],['dal','dhal'],['ra','zay'],
['sin','shin'],['sad','dad'],['tta','zza'],['ayn','ghayn']];
const seen=new Set(),kindCount={};
for(const stage of course.lessons){
 const pool=api.poolFor(stage.id);
 assert.equal(pool.length,pack.distribution[stage.id],'Exact stage count '+stage.id);
 assert.ok(pool.length>=8&&pool.length<=20);
 assert.equal(api.validateBank(pool).valid,true,'Stage bank is valid: '+stage.id);
 const s1=api.createSession(stage.id,{count:10,seed:1}),s2=api.createSession(stage.id,{count:12,seed:2});
 assert.equal(s1.total,10);
 assert.equal(s2.total,Math.min(12,pool.length));
 assert.equal(new Set(s1.ids).size,10);
 assert.equal(new Set(s2.ids).size,Math.min(12,pool.length));
 assert.ok(s1.ids.every(id=>!id.startsWith('fixture-')));
 const third=api.createSession(stage.id,{count:10,seed:3,recentIds:s1.ids});
 assert.equal(third.total,10);
 assert.ok(third.ids.some(id=>!s1.ids.includes(id)),'Avoid recent when pool permits it');
 for(const q of pool){
  assert.ok(!seen.has(q.id),'Unique question ID '+q.id);seen.add(q.id);
  assert.ok(q.stage===stage.id);
  assert.equal(q.choices.length,4);
  assert.equal(new Set(q.choices.map(x=>x.id)).size,4);
  assert.equal(q.choices.filter(x=>x.id===q.correctAnswer).length,1);
  const owner=q.id.match(/^pack-a-(glyph|name|dots|shape)-(.+)$/);
  assert.ok(owner,q.id);
  const [_,kind,id]=owner,l=byId[id];assert.ok(l,owner);
  assert.ok(stage.letterIds.includes(id));
  kindCount[kind]=(kindCount[kind]||0)+1;
  const answer=q.choices.find(x=>x.id===q.correctAnswer);
  if(kind==='glyph'){
   assert.equal(q.target,l.names.ar);
   assert.equal(answer.glyph,l.glyph);
   assert.equal(q.skill,'letter-name-to-glyph');
  }
  if(kind==='name'){
   assert.equal(q.target,l.glyph);
   assert.equal(answer.glyph,l.names.ar);
   for(const loc of ['tr','en','ar','de','fr'])assert.equal(answer.label[loc],l.names[loc]);
  }
  if(kind==='dots'){
   assert.equal(q.target,l.glyph);
   assert.equal(answer.id,'dot-'+dotTruth[id]);
   assert.ok(q.choices.every(c=>c.label?.tr&&c.label?.ar));
  }
  if(kind==='shape'){
   const family=shapeFamily.find(group=>group.includes(id));
   assert.ok(family&&family.includes(answer.id),id);
   assert.notEqual(answer.id,id);
   assert.equal(q.target,l.glyph);
   assert.ok(q.choices.filter(c=>family.includes(c.id)).length===1,'Only one same-body answer');
  }
  assert.ok(q.choices.every(c=>c.glyph.trim().length>0));
  for(const opt of q.choices){
   if(opt.audioRef){assert.equal(opt.audioRef,opt.id,'Voice belongs to selected letter');assert.ok(allowed.has(opt.id))}
   if(!allowed.has(opt.id))assert.ok(!opt.audioRef,'No audio for unrecorded letter');
  }
  for(const lang of ['tr','en','ar','de','fr']){
   assert.ok(q.prompt[lang]?.length>=8,q.id+' '+lang+' prompt');
   assert.ok(q.explanation[lang]?.length>=12,q.id+' '+lang+' explanation');
   for(const opt of q.choices)if(opt.id!==q.correctAnswer)
    assert.ok(q.distractorRationale[opt.id]?.[lang]?.length>=12,q.id+' '+opt.id+' '+lang);
  }
 }
}
assert.deepEqual(kindCount,{glyph:28,name:28,dots:28,shape:16});
assert.equal(seen.size,100);
assert.deepEqual(Object.values(pack.distribution).sort((a,b)=>a-b),[11,12,14,15,16,16,16].sort((a,b)=>a-b));
const first=api.poolFor('arabic-letters-01')[0];
const before=api.stats().questions;
assert.throws(()=>api.registerPack({id:'rearranged-duplicate',questions:[
 {...first,id:'fake-reorder-01',choices:[...first.choices].reverse()}
]}),/V2_QUESTION_AUDIT_FAILED/);
assert.equal(api.stats().questions,before,'Atomic duplicate refusal');
const q0=api.poolFor('arabic-letters-01')[0];
assert.equal(api.validateBank([{...q0,id:'bad-sound-choice',choices:q0.choices.map((c,i)=>i===0?{...c,audioRef:'unverified'}:c)}]).valid,false);
console.log('PASS ARABIC PACK A: 100/100 distinct questions, 28 letters, 7 playable lessons, 28+28+28+16 skills, 5 locales, answer keys, dot/shape truth, 15 preview-audio ceiling, rejection of duplicates and fake audio');
