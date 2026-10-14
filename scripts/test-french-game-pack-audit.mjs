/* Validate shipped French game content without pretending expert or Quran audio review. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {baseQuestions,getSource} from './english-source.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const manifest=read('assets/i18n/content-support.json'),fr=manifest.languages.fr;
assert.equal(fr.question_data,'complete');assert.equal(fr.gameplay_enabled,true);
assert.equal(fr.scope,'game_questions_and_ui_only');assert.equal(fr.global_qa,'blocked');
assert.equal(fr.religious_expert_approved,false);assert.equal(fr.parts.length,114);
const bank=new Map();let count=0;
for(const part of fr.parts){
 assert(part.path.startsWith('./assets/i18n/questions/fr/'),'Untrusted part path');
 const p=read(part.path);assert.equal(p.locale,'fr');assert.equal(p.schema_version,1);
 assert.equal(p.expert_approved,false);assert.equal(p.verified_by_religious_expert,false);
 assert.equal(Object.keys(p.translations).length,part.count);
 for(const [id,e] of Object.entries(p.translations)){
  assert(e.source&&e.display,'Missing source/display '+id);
  assert(typeof e.display.question_tr==='string'&&e.display.question_tr.trim(),'Missing French question '+id);
  assert(typeof e.display.explanation_tr==='string'&&e.display.explanation_tr.trim(),'Missing French explanation '+id);
  assert.equal(e.source.activity_type,e.display.activity_type,'Question type changed '+id);
  if(e.source.activity_type==='matching'){
   assert.equal(e.source.pairs.length,e.display.pairs.length,'Matching pair count '+id);
  }else if(e.source.activity_type==='build_sequence'){
   assert.equal(e.source.items.length,e.display.items.length,'Sequence count '+id);
   const indices=e.source.correct_order.map(w=>e.source.items.indexOf(w));
   assert(indices.every((n,i)=>n>=0&&e.display.items[n]===e.display.correct_order[i]),'Sequence ordering '+id);
  }else if(Array.isArray(e.source.options_tr)){
   assert.equal(e.source.options_tr.length,e.display.options_tr.length,'Answer count '+id);
   const correctIndex=e.source.options_tr.indexOf(e.source.correct_answer);
   assert(correctIndex>=0&&e.display.options_tr[correctIndex]===e.display.correct_answer,'Correct answer drift '+id);
  }
  const list=bank.get(id)||[];list.push(e);bank.set(id,list);count++;
 }
}
assert.equal(count,1704);
assert.equal(baseQuestions.length,1500);
for(const q of baseQuestions){
 const source=getSource(q);
 assert((bank.get(q.id)||[]).some(e=>JSON.stringify(e.source)===JSON.stringify(source)),
  'Missing base-source French translation '+q.id);
}
const names=[
 'ui.staging.json','ui.core-navigation-lesson.staging.json','ui.core-quran.staging.json',
 'ui.core-profile.staging.json','ui.lesson-intro-feedback.staging.json',
 'ui.lesson-results.staging.json','ui.streak-xp.staging.json','ui.premium-shop.staging.json',
 'ui.quran-navigation-game.staging.json','ui.quran-learning-surahs.staging.json',
 'ui.reference-batch-01.staging.json','ui.reference-batch-02.staging.json',
 'ui.real-lesson-extra.staging.json','ui.reference-batch-03.staging.json',
 'ui.reference-batch-04.staging.json','ui.reference-batch-05.staging.json',
 'ui.reference-batch-06.staging.json','ui.reference-batch-07.staging.json',
 'ui.reference-batch-08.staging.json','ui.dynamic-preview.staging.json',
 'ui.browser-observed.staging.json','ui.quran-browser-extra.staging.json',
 'ui.quran-browser-dynamic.staging.json','ui.p10-browser-safe.staging.json',
 'ui.p10-browser-dynamic.staging.json'];
let uiCount=0;const seen=new Set();
for(const name of names){
 const p=read('assets/i18n/fr/'+name);
 assert.equal(p.locale,'fr');assert.equal(p.translation_count,Object.keys(p.translations).length);
 for(const key of Object.keys(p.translations)){
  assert(!seen.has(key),'Duplicate source-keyed French UI label '+key);
  seen.add(key);uiCount++;
 }
}
assert(uiCount>1500,'Missing game UI translations');
console.log('FR_GAME_PACK_AUDIT '+JSON.stringify({
 gameParts:fr.parts.length,gameQuestionRecords:count,baseQuestions:1500,
 activeQuestions:1484,sourceVariants:bank.size,uiLabels:uiCount,
 sourceValidated:true,expertApprovalNotClaimed:true
}));
