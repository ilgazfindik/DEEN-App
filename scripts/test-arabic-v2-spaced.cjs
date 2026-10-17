/* DEEN Arabic V2 spaced recall deterministic smoke — 600 registered questions. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const win={},ctx={window:win,console},root=path.resolve(__dirname,'..');
const load=n=>vm.runInNewContext(fs.readFileSync(path.join(root,'assets/i18n',n),'utf8'),ctx,{filename:n});
load('quran-arabic-letters.js');
win.DEEN_ARABIC_LETTER_AUDIO={available:id=>new Set(['alif','ba','ta','tha','jim','hha','kha','qaf','ya','waw','ha','nun','mim','lam','kaf']).has(id)};
for(const name of ['quran-arabic-questions-v2.js','quran-arabic-questions-pack-a.js','quran-arabic-questions-pack-b.js',
 'quran-arabic-harakat.js','quran-arabic-questions-pack-c.js','quran-arabic-reading.js','quran-arabic-questions-pack-d.js',
 'quran-arabic-words.js','quran-arabic-questions-pack-e.js','quran-arabic-meaning.js','quran-arabic-phrases.js',
 'quran-arabic-patterns.js','quran-arabic-questions-pack-f.js'])load(name);
const api=win.DEEN_ARABIC_QUESTIONS_V2,DAY=86400000;
assert.equal(api.stats().questions,600);
const stage='arabic-letters-01',pool=api.poolFor(stage),q=pool[0],wrong=q.choices.find(c=>c.id!==q.correctAnswer).id;
const at=Date.UTC(2026,9,1,12);
const answer=(id,firstTryCorrect=true,wrongChoiceId=null)=>({id,firstTryCorrect,wrongChoiceId});
const empty=api.cleanPractice({cards:{'not-in-bank':{step:4}},sessions:[{stage:'unseen',total:3,correct:3}]});
assert.equal(Object.keys(empty.cards).length,0);assert.equal(empty.sessions.length,0);
let state=api.recordPractice(null,{stage,answers:[answer(q.id,false,wrong)],at});
assert.equal(state.cards[q.id].mistakes,1);
assert.equal(state.cards[q.id].confusions[wrong],1);
assert.equal(state.cards[q.id].step,0);assert.equal(state.cards[q.id].dueAt,at+DAY);
const weakSession=api.createSession(stage,{count:10,practice:state,now:at+3600000,seed:97,recentIds:[q.id]});
assert.equal(weakSession.total,10);
assert.ok(!weakSession.ids.includes(q.id));
const peers=pool.filter(x=>x.id!==q.id&&x.skill===q.skill);
if(peers.length){
 const first=api.get(weakSession.ids[0]);
 const confusingGlyph=q.choices.find(x=>x.id===wrong).glyph;
 const correctGlyph=first.choices.find(x=>x.id===first.correctAnswer).glyph;
 assert.ok(first.skill===q.skill||correctGlyph===confusingGlyph,'Observed weakness prioritizes a different related item');
}
const bad=api.recordPractice(state,{stage,answers:[answer(q.id),answer(q.id)],at:at+DAY});
assert.equal(bad.cards[q.id].attempts,1);
for(const [elapsed,expectStep,expectDue] of [[1,1,2],[2,2,5],[5,3,12],[12,4,26]]){
 state=api.recordPractice(state,{stage,answers:[answer(q.id)],at:at+elapsed*DAY});
 assert.equal(state.cards[q.id].step,expectStep);
 assert.equal(state.cards[q.id].dueAt,at+expectDue*DAY);
}
const recommended=api.createSession(stage,{count:10,practice:state,now:at+27*DAY,seed:41});
assert.equal(recommended.total,10);
assert.equal(new Set(recommended.ids).size,10);
assert.ok(recommended.ids.includes(q.id));
const nonRepeated=api.createSession(stage,{count:10,practice:state,now:at+27*DAY,seed:41,recentIds:[q.id]});
assert.ok(!nonRepeated.ids.includes(q.id));
let history=null;
for(let i=0;i<12;i++){
 const item=pool[i],first=i!==0;
 history=api.recordPractice(history,{stage,answers:[answer(item.id,first,first?null:item.choices.find(c=>c.id!==item.correctAnswer).id)],at:at+i*DAY});
}
const summary=api.practiceSummary(history,{stage,now:at+13*DAY});
assert.equal(summary.lessons,10);assert.equal(summary.attempts,10);
assert.equal(summary.correct,10);assert.equal(summary.distinctDays,10);
assert.equal(summary.mastery,true);
const novice=api.practiceSummary(api.recordPractice(null,{stage,answers:[answer(q.id)],at}),{stage,now:at+DAY});
assert.equal(novice.mastery,false);
console.log('PASS ARABIC V2 SPACED: 600 questions, first-attempt confusion tracking, 1/3/7/14-day intervals, max 10 sessions, delayed mastery, due selection');
