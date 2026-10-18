/* DEEN Arabic V2 — real-bank lesson mode inventory and answer-position regression. */
'use strict';
const assert=require('node:assert/strict');
const {loadQuestions}=require('./export-arabic-v2-human-review.cjs');
const engine=loadQuestions();
assert.equal(engine.stats().questions,600);
assert.equal(engine.stats().packs,6);
const mode=q=>{
 if(q.skill==='joining-two-letters'&&q.target.split(/\s*\+\s*/).length===2)return 'build';
 if(q.skill==='letter-glyph-to-name'&&q.choices.length===4&&q.choices.every(c=>c.label)&&
   [...q.id].reduce((s,c)=>s+c.charCodeAt(0),0)%4===0)return 'match';
 return 'choice';
};
const shuffle=(items,key)=>{
 let hash=2166136261;
 for(const char of key)hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
 const copy=[...items];
 for(let i=copy.length-1;i>0;i--){
  hash^=hash<<13;hash^=hash>>>17;hash^=hash<<5;hash>>>=0;
  const j=hash%(i+1);[copy[i],copy[j]]=[copy[j],copy[i]];
 }
 return copy;
};
const stages=Array.from({length:7},(_,i)=>'arabic-letters-'+String(i+1).padStart(2,'0'));
const questions=stages.flatMap(stage=>engine.poolFor(stage));
const distribution={choice:0,match:0,build:0};
const byStage={};
for(const stage of stages){
 const pool=engine.poolFor(stage);assert.ok(pool.length>=20);
 const counts={choice:0,match:0,build:0};
 for(const q of pool){
  assert.equal(q.choices.length,4,'Four choices: '+q.id);
  assert.ok(q.choices.some(c=>c.id===q.correctAnswer));
  counts[mode(q)]++;distribution[mode(q)]++;
 }
 byStage[stage]=counts;
}
assert.equal(questions.length,200,'Seven letter lessons use the 200 Pack A+B questions');
assert.equal(distribution.build,22,'All 22 two-letter joining examples use assembly');
assert.ok(distribution.match>=4,'Real matching examples present');
assert.equal(Object.values(distribution).reduce((s,n)=>s+n,0),200);
const positions=new Set(),answerAtFirst=new Set();
for(const q of questions.filter(q=>mode(q)==='build')){
 const letters=q.target.split(/\s*\+\s*/);
 assert.equal(letters.length,2);
 const extras=['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي']
  .filter(x=>!letters.includes(x));
 const index=[...q.id].reduce((s,c)=>s+c.charCodeAt(0),0)%extras.length;
 for(let slot=0;slot<10;slot++){
  const bank=shuffle([letters[0],letters[1],extras[index],extras[(index+1)%extras.length]],q.id+':bank:'+slot);
  assert.equal(bank.length,4);
  assert.equal(new Set(bank).size,4,'Unique build pieces: '+q.id);
  const indices=letters.map(g=>bank.indexOf(g));
  assert.ok(indices.every(x=>x>=0));
  positions.add(indices.join('→'));
  if(slot===0)answerAtFirst.add(indices.join('→'));
 }
}
assert.ok(positions.size>=8,'Answer is no longer fixed in two tile positions');
assert.ok(answerAtFirst.size>=5,'Answer varies across joining questions, even at slot zero');
for(const q of questions.filter(q=>mode(q)==='match')){
 for(let slot=0;slot<10;slot++){
  const glyphs=shuffle(q.choices,q.id+':glyph:'+slot);
  const shift=1+([...q.id].reduce((n,c)=>n+c.charCodeAt(0),0)+slot)%3;
  const labels=glyphs.map((_,i)=>glyphs[(i+shift)%4]);
  assert.ok(glyphs.every((g,i)=>g.id!==labels[i].id),'Do not leak matching answer by aligned row');
  assert.equal(new Set(labels.map(c=>c.id)).size,4);
 }
}
const patterns=new Set();
for(const stage of stages){
 for(let seed=11;seed<30;seed++){
  const sess=engine.createSession(stage,{count:10,seed});
  assert.ok(sess&&sess.questions.length===10);
  assert.equal(sess.ids.length,10);
  assert.equal(new Set(sess.ids).size,10);
  const hist=sess.questions.map(mode);
  assert.equal(hist.length,10);
  patterns.add(hist.join('/'));
 }
}
assert.ok(patterns.size>=15,'Session question-mode combinations should vary between real seeds');
console.log('PASS ARABIC V2 QUIZ DIVERSITY '+JSON.stringify({
 total:engine.stats().questions,letterStageQuestions:questions.length,distribution,
 buildPositions:positions.size,distinctFirstPositions:answerAtFirst.size,
 sessionPatterns:patterns.size,byStage
}));
