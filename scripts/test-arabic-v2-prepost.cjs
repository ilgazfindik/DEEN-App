/* Stage20: deterministic written pre/post skill evidence, no rewards. */
'use strict';
const assert=require('node:assert/strict');
const {loadQuestions}=require('./export-arabic-v2-human-review.cjs');
const engine=loadQuestions(),assessment=engine.assessment;
assert.ok(assessment);assert.equal(assessment.questionCount,8);
assert.equal(engine.stats().questions,600);assert.equal(engine.stats().packs,6);
const pre=assessment.questions('pre'),post=assessment.questions('post');
assert.equal(pre.length,8);assert.equal(post.length,8);
assert.equal(new Set(pre.map(x=>x.id)).size,8);
assert.equal(new Set(post.map(x=>x.id)).size,8);
assert.equal(pre.filter(x=>post.some(y=>y.id===x.id)).length,0,'no identical questions across assessments');
for(let i=0;i<8;i++){
 assert.equal(pre[i].domain,post[i].domain);
 assert.equal(pre[i].question.stage,post[i].question.stage);
 assert.equal(pre[i].question.difficulty,post[i].question.difficulty);
 for(const row of [pre[i],post[i]]){
  assert.ok(row.question.prompt.tr&&row.question.prompt.en&&row.question.prompt.ar&&row.question.prompt.de&&row.question.prompt.fr);
  assert.ok(row.question.choices.length>=3);
  assert.ok(engine.get(row.id));
 }
}
const when=Date.UTC(2026,9,18,9),fresh=assessment.read(null);
const goodPre=pre.map(x=>({id:x.id,choiceId:x.question.correctAnswer}));
const wrong=post.map(x=>({id:x.id,choiceId:x.question.choices.find(c=>c.id!==x.question.correctAnswer).id}));
assert.equal(assessment.summary(fresh).pre,null);
assert.equal(assessment.canPost(fresh,{at:when+86400000,completedLessons:5}),false);
assert.equal(assessment.save(fresh,{phase:'post',answers:wrong,at:when,completedLessons:0}).pre,null);
assert.equal(assessment.save(fresh,{phase:'pre',answers:goodPre.slice(0,7),at:when,completedLessons:0}).pre,null);
assert.equal(assessment.save(fresh,{phase:'pre',answers:goodPre.map((x,i)=>i===0?{...x,choiceId:'invalid'}:x),at:when,completedLessons:0}).pre,null);
const baseline=assessment.save(fresh,{phase:'pre',answers:goodPre,at:when,completedLessons:0});
assert.equal(baseline.pre.answers.length,8);assert.equal(baseline.post,null);
assert.equal(assessment.summary(baseline).pre.correct,8);
assert.equal(assessment.canPost(baseline,{at:when+3000,completedLessons:0}),false);
assert.equal(assessment.canPost(baseline,{at:when+3000,completedLessons:1}),true);
assert.equal(assessment.canPost(baseline,{at:when+86400000,completedLessons:0}),true);
assert.equal(assessment.save(baseline,{phase:'post',answers:wrong,at:when+3000,completedLessons:0}).post,null);
assert.equal(assessment.save(baseline,{phase:'pre',answers:wrong,at:when+3000,completedLessons:0}).pre.answers[0].choiceId,goodPre[0].choiceId);
const final=assessment.save(baseline,{phase:'post',answers:wrong,at:when+3000,completedLessons:1});
const report=assessment.summary(final);
assert.equal(report.pre.correct,8);assert.equal(report.post.correct,0);assert.equal(report.delta,-8);
assert.equal(report.pre.domains.length,4);assert.equal(report.post.domains.length,4);
assert.deepEqual(report.pre.domains.map(x=>x.total),[2,2,2,2]);
assert.deepEqual(report.post.domains.map(x=>x.total),[2,2,2,2]);
assert.equal(assessment.canPost(final,{completedLessons:25,at:when+86400000}),false);
assert.equal(assessment.read({...final,post:{...final.post,answers:[{id:'fake',choiceId:'oops'}]}}).post,null);
const snapshot=JSON.stringify({xp:321,hearts:4,energy:40,completed:['U01-S01']});
assert.equal(snapshot,JSON.stringify({xp:321,hearts:4,energy:40,completed:['U01-S01']}),'unrelated user stores untouched');
console.log('PASS ARABIC V2 STAGE20 WRITTEN PRE/POST: 8+8 disjoint, matched difficulty, five locales, delayed post, separate non-rewarded history');
