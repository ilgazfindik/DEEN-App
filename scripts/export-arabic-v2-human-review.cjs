#!/usr/bin/env node
/* Human REVIEW QUEUE, never a human approval. Generated from Phase14 audit.
 * No user data, no production content edits, no automatic approval.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),vm=require('node:vm');
const {spawnSync}=require('node:child_process'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),locales=['tr','en','ar','de','fr'];
const reasonToCategory=Object.freeze({
 QURAN_MEANING_GRAMMAR_CONTEXT:'quran-meaning-grammar',
 HARAKAT_OR_PHONETIC_DETAIL:'phonetics-and-harakat',
 HUMAN_AUDIO_PRONUNCIATION_RIGHTS:'audio-rights-pronunciation'
});
const names=[
 'quran-arabic-questions-v2.js','quran-arabic-questions-pack-a.js',
 'quran-arabic-questions-pack-b.js','quran-arabic-harakat.js',
 'quran-arabic-questions-pack-c.js','quran-arabic-reading.js',
 'quran-arabic-questions-pack-d.js','quran-arabic-words.js',
 'quran-arabic-questions-pack-e.js','quran-arabic-meaning.js',
 'quran-arabic-phrases.js','quran-arabic-patterns.js',
 'quran-arabic-questions-pack-f.js'
];
function loadQuestions(){
 const window={DEEN_ARABIC_LETTER_AUDIO:{available:id=>new Set(['alif','ba','ta','tha','jim','hha','kha','qaf','ya','waw','ha','nun','mim','lam','kaf']).has(id)}};
 const ctx={window,console};
 for(const name of names)vm.runInNewContext(fs.readFileSync(path.join(root,'assets/i18n',name),'utf8'),ctx,{filename:name});
 const engine=window.DEEN_ARABIC_QUESTIONS_V2;
 assert.equal(engine.stats().questions,600,'Live question bank changed');
 return engine;
}
function getAudit(){
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'deen-arabic-human-audit-'));
 const file=path.join(temp,'audit.json');
 try{
  const res=spawnSync(process.execPath,[path.join(root,'scripts/audit-arabic-v2-locale-content.cjs'),'--report='+file],
   {encoding:'utf8',maxBuffer:12*1024*1024});
  assert.equal(res.status,0,'Phase14 source audit failed: '+(res.stderr||res.stdout).slice(-3000));
  const data=JSON.parse(fs.readFileSync(file,'utf8'));
  assert.equal(data.results.structuralErrors,0);
  assert.equal(data.results.questions,600);
  return data;
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
}
function buildQueue(audit=getAudit(),engine=loadQuestions()){
 assert.equal(audit.results.humanReviewItems,448,'Expected reviewed source inventory of 448 flags');
 assert.ok(Array.isArray(audit.humanReview));
 assert.equal(audit.humanReview.length,448);
 const tasks=[],seen=new Set();
 for(const flag of audit.humanReview){
  assert.ok(reasonToCategory[flag.reason],'Unmapped reason: '+flag.reason);
  const q=engine.get(flag.id);
  assert.ok(q&&q.stage===flag.stage,'Review points to absent question '+flag.id);
  const key=flag.id+'::'+flag.reason;
  assert.ok(!seen.has(key),'Duplicate review item '+key);seen.add(key);
  const selected=q.choices.find(c=>c.id===q.correctAnswer);
  assert.ok(selected,'Missing answer for '+q.id);
  const prompts=Object.fromEntries(locales.map(locale=>[locale,{
   prompt:q.prompt[locale],explanation:q.explanation[locale],
   correctLabel:selected.label?.[locale]||null,
   distractors:q.choices.filter(c=>c.id!==q.correctAnswer).map(c=>({
    glyph:c.glyph,id:c.id,label:c.label?.[locale]||null,
    rationale:q.distractorRationale?.[c.id]?.[locale]||null
   }))
  }]));
  const snapshot={
   questionId:q.id,stage:q.stage,skill:q.skill,target:q.target,
   source:q.source||null,correctAnswerId:q.correctAnswer,correctAnswerGlyph:selected.glyph,
   choices:q.choices.map(c=>({id:c.id,glyph:c.glyph})),audioRef:q.audioRef||null,
   prompts
  };
  const contentHash=createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
  tasks.push({
   reviewId:key,questionId:q.id,stage:q.stage,skill:q.skill,
   reason:flag.reason,category:reasonToCategory[flag.reason],
   contentSha256:contentHash,...snapshot,
   decision:'pending',reviewer:'',evidenceRef:'',reviewedAt:'',reviewNotes:''
  });
 }
 const byCategory=Object.fromEntries(Object.values(reasonToCategory).map(name=>[
  name,tasks.filter(t=>t.category===name).length
 ]));
 assert.equal(tasks.length,448);
 assert.equal(Object.values(byCategory).reduce((sum,x)=>sum+x,0),448);
 return {schema:1,phase:19,status:'UNREVIEWED',count:tasks.length,
  distinctQuestions:new Set(tasks.map(t=>t.questionId)).size,
  byCategory,approvalCount:0,autoApproval:false,
  policy:'Reviewer decision needs independently verified expertise, rationale and source evidence; generator never approves.',
  tasks};
}
const csvFields=['reviewId','category','reason','questionId','stage','skill',
 'target','source','correctAnswerGlyph','contentSha256',
 ...locales.flatMap(l=>['prompt_'+l,'explanation_'+l]),
 'decision','reviewer','evidenceRef','reviewedAt','reviewNotes'];
function safeCell(value){
 let s=String(value==null?'':value);
 // Protect reviewers opening CSV in Excel/Sheets against formula execution.
 if(/^[\s\uFEFF]*[=+@-]/u.test(s))s="'"+s;
 return '"'+s.replace(/"/g,'""')+'"';
}
function toCsv(tasks){
 return [csvFields.join(','),...tasks.map(t=>csvFields.map(field=>{
  const match=/^(prompt|explanation)_(tr|en|ar|de|fr)$/.exec(field);
  return safeCell(match?t.prompts[match[2]][match[1]]:t[field]);
 }).join(','))].join('\r\n')+'\r\n';
}
function exportQueue(destination,queue=buildQueue()){
 fs.mkdirSync(destination,{recursive:true});
 const manifest={...queue,tasks:undefined};
 fs.writeFileSync(path.join(destination,'review-summary.json'),JSON.stringify(manifest,null,2)+'\n');
 fs.writeFileSync(path.join(destination,'review-queue.json'),JSON.stringify(queue,null,2)+'\n');
 for(const category of Object.values(reasonToCategory)){
  fs.writeFileSync(path.join(destination,category+'.csv'),
   toCsv(queue.tasks.filter(t=>t.category===category)),'utf8');
 }
 return {destination,count:queue.count,byCategory:queue.byCategory,
  files:['review-summary.json','review-queue.json',...Object.values(reasonToCategory).map(x=>x+'.csv')]};
}
if(require.main===module){
 const value=process.argv.find(x=>x.startsWith('--out-dir='));
 const output=value?path.resolve(value.slice('--out-dir='.length)):
  path.join(os.tmpdir(),'deen-arabic-v2-human-review');
 const report=exportQueue(output);
 console.log('PASS DEEN_ARABIC_V2_HUMAN_REVIEW_QUEUE '+JSON.stringify(report));
}
module.exports={loadQuestions,getAudit,buildQueue,toCsv,exportQueue,safeCell};
