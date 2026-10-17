/* Stage19 queue must remain faithful to the existing human-review audit. */
'use strict';
const assert=require('node:assert/strict'),os=require('node:os'),fs=require('node:fs'),path=require('node:path');
const {getAudit,loadQuestions,buildQueue,exportQueue,safeCell,toCsv}=require('./export-arabic-v2-human-review.cjs');
const audit=getAudit(),engine=loadQuestions(),queue=buildQueue(audit,engine);
assert.equal(queue.count,448);
assert.equal(queue.tasks.length,448);
assert.equal(queue.approvalCount,0);
assert.equal(queue.status,'UNREVIEWED');
assert.equal(Object.values(queue.byCategory).reduce((n,x)=>n+x,0),448);
const ids=new Set();
for(const t of queue.tasks){
 assert.ok(!ids.has(t.reviewId));ids.add(t.reviewId);
 assert.equal(t.decision,'pending');
 assert.equal(t.reviewer,'');assert.equal(t.evidenceRef,'');assert.equal(t.reviewedAt,'');
 assert.equal(t.contentSha256.length,64);
 assert.ok(engine.get(t.questionId));
 assert.equal(t.source,engine.get(t.questionId).source||null);
 assert.equal(t.correctAnswerGlyph,engine.get(t.questionId).choices.find(c=>c.id===t.correctAnswerId).glyph);
 for(const l of ['tr','en','ar','de','fr']){
  assert.ok(t.prompts[l]?.prompt);
  assert.ok(t.prompts[l]?.explanation);
  assert.ok(t.prompts[l]?.distractors.length>0);
 }
}
assert.equal(safeCell('=1+1'),'"\'=1+1"');
assert.equal(safeCell(' +cmd'),'"\' +cmd"');
assert.equal(safeCell('@danger'),'"\'@danger"');
assert.equal(safeCell('hello"world'),'"hello""world"');
const target=fs.mkdtempSync(path.join(os.tmpdir(),'deen-stage19-review-test-'));
try{
 const result=exportQueue(target,queue);
 assert.equal(result.count,448);
 assert.equal(result.files.length,5);
 const summary=JSON.parse(fs.readFileSync(path.join(target,'review-summary.json'),'utf8'));
 assert.equal(summary.count,448);assert.equal(Object.hasOwn(summary,'tasks'),false);
 const json=JSON.parse(fs.readFileSync(path.join(target,'review-queue.json'),'utf8'));
 assert.equal(json.tasks.length,448);
 for(const [name,n] of Object.entries(queue.byCategory)){
  const csv=fs.readFileSync(path.join(target,name+'.csv'),'utf8');
  assert.equal(csv.startsWith('reviewId,category,reason,'),true);
  assert.equal(csv.split('\r\n').length-2,n);
  assert.equal(csv, toCsv(queue.tasks.filter(x=>x.category===name)));
 }
 const bad={...audit,humanReview:[...audit.humanReview,{...audit.humanReview[0]}],
  results:{...audit.results,humanReviewItems:449}};
 assert.throws(()=>buildQueue(bad,engine),/Expected reviewed source inventory/);
 const badId={...audit,humanReview:audit.humanReview.map((x,i)=>i===0?{...x,id:'missing-question'}:x)};
 assert.throws(()=>buildQueue(badId,engine),/absent question/);
 console.log('PASS DEEN ARABIC V2 STAGE19: 448 expert flags, five-language reviewer evidence, 3 category CSV, no auto-approvals, formula safety');
}finally{fs.rmSync(target,{recursive:true,force:true})}
