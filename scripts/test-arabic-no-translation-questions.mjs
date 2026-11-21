/* Arabic learners are never asked to "translate" or give the "meaning" of Arabic text that is already Arabic.
   These Kelime-i Şehadet questions were translation questions in Turkish; for the Arabic locale they are written
   as Arabic-native questions (complete the phrase, order the parts, name the part, what the phrase affirms). */
import {readFileSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(dirname(new URL(import.meta.url).pathname),'..');
const dir=resolve(root,'assets/i18n/questions/ar/units');
const all={};
for(const f of readdirSync(dir).filter(x=>/^U\d+\.json$/.test(x))){Object.assign(all,JSON.parse(readFileSync(resolve(dir,f),'utf8')).translations)}
assert.equal(Object.keys(all).length,1500,'the Arabic bank is complete');
// 1. no Arabic prompt mentions Turkish or asks for a translation
const bad=Object.entries(all).filter(([,q])=>/بالتركية|الترجمة|ترجم|Türk/.test([q.question_ar,...(q.options_ar||[]),q.explanation_ar||''].join(' ')));
assert.deepEqual(bad.map(x=>x[0]),[],'no Arabic question asks to translate');
// 2. the rewritten Shahada questions do not ask for the meaning of the Arabic phrase itself
const ids=['S01-005','S01-009','S01-012','S01-014','S02-008','S02-012','S03-002','S03-006','S04-006','S04-010','S04-015','S06-006'].map(x=>'DEEN-U03-'+x);
for(const id of ids){
  const q=all[id];assert.ok(q,id+' exists');
  assert.ok(!/معنى|يعني|تعني|تدل|دلالة/.test(q.question_ar),id+' does not ask for the meaning of Arabic text: '+q.question_ar);
}
// 3. structure unchanged: the same answer is still among the options
for(const id of ids){const q=all[id];if(Array.isArray(q.options_ar)&&q.correct_answer_ar!=null)assert.ok(q.options_ar.includes(q.correct_answer_ar),id+' keeps its correct option')}
console.log('PASS: Arabic questions never ask to translate Arabic text ('+ids.length+' rewritten)');
