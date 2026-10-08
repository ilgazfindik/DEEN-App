import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const seg=n=>read('release/v9.9.3-direct/segment-'+String(n).padStart(2,'0')+'.txt');
const base=JSON.parse(Array.from({length:7},(_,i)=>seg(i+2)).join('').replace(/^const QUESTIONS=/,'').trim().replace(/;$/,''));
const source=seg(66).match(/<script id="deen-v91223-arabic-fullbank-js">([\s\S]*?)<\/script>/)[1];
const W={DEEN_APP_LOCALE:{get:()=> 'ar'},DEEN_ARABIC_UI:{register:()=>{}},alert:()=>{}};
const D={readyState:'loading',addEventListener:()=>{}};
const fetchLocal=async url=>({ok:true,json:async()=>JSON.parse(read(url.split('?')[0].replace(/^\.\//,'')))});
Function('window','document','fetch',source)(W,D,fetchLocal);
assert.equal(await W.DEEN_ARABIC_PILOT.preload(),true,W.DEEN_ARABIC_PILOT.failure);
const bank=W.DEEN_ARABIC_PILOT,report=bank.inspectBank(base);assert.deepEqual(report.failedIds,[]);
let options=0,matching=0,sequence=0,blanks=0;
for(const q of base){const t=bank.translateQuestion(q);assert(t,q.id);
 if(Array.isArray(q.options_tr)&&q.activity_type!=='matching'){assert.equal(t.options_tr.length,q.options_tr.length);assert.equal(t.options_tr.indexOf(t.correct_answer),q.options_tr.indexOf(q.correct_answer));assert.equal(t.options_tr.filter(x=>x===t.correct_answer).length,1);options++;}
 if(q.pairs?.length){assert.equal(t.pairs.length,q.pairs.length);matching++;}
 if(q.items?.length){assert.equal(t.items.length,q.items.length);const arOrder=t.correct_order.map(x=>t.items.indexOf(x)),trOrder=q.correct_order.map(x=>q.items.indexOf(x));if(bank.translations[q.id].sequence_order_policy==='arabic_grammar'){assert.equal(q.id,'DEEN-U03-S04-006');assert.deepEqual(arOrder,[1,2,0]);assert.deepEqual([...arOrder].sort(),[...trOrder].sort())}else assert.deepEqual(arOrder,trOrder);sequence++;}
 assert.equal((t.question_tr.match(/___/g)||[]).length,(q.question_tr.match(/___/g)||[]).length);if(q.question_tr.includes('___'))blanks++;
 assert.equal(q.religious_release_ready,false);assert.equal(bank.translations[q.id].expert_approved,false);
 assert.equal(bank.translateQuestion({...q,question_tr:q.question_tr+' STALE'}),null);
}
for(let n=1;n<=15;n++){const file=JSON.parse(read('assets/i18n/questions/ar/units/U'+String(n).padStart(2,'0')+'.json'));assert.equal(file.release_ready,false);assert.equal(file.verified_by_religious_expert,false);assert.equal(Object.keys(file.translations).length,100);}
assert.equal(Object.keys(bank.live_translations).length,84);assert.equal(Object.keys(bank.runtime_variants).length,20);
// The full-bank localizer must never read script/style contents.
assert(!seg(66).includes('while((n=walker.nextNode()))nodes.push(n)'));
assert(!seg(48).includes('deen-v91221-arabic-question-pilot-js'));
console.log(JSON.stringify({result:'PASS',base:base.length,stages:Object.keys(report.byStage).length,options,matching,sequence,blanks,live:84,variants:20,sourceMismatchRejects:base.length,expertApproved:0},null,2));
