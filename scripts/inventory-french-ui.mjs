/* Build a *source* inventory for French — never carry German translations across. */
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {baseQuestions} from './english-source.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const base=read('assets/i18n/english-ui.draft.json');
assert.equal(Object.keys(base.translations).length,1087,'English reference source drift');
const sources=['german-ui.staging.json','german-ui.lesson-flow.staging.json',
 'german-ui.premium-shop.staging.json','german-ui.quran-controls.staging.json',
 ...Array.from({length:8},(_,i)=>'german-ui.reference-batch-'+String(i+1).padStart(2,'0')+'.staging.json'),
 'german-ui.real-lesson.staging.json'];
const map=new Map();
for(const filename of sources){
 const pack=read('de-review/assets/i18n/'+filename);
 assert.equal(pack.locale,'de');
 for(const key of Object.keys(pack.translations)){
  if(!map.has(key))map.set(key,{source_tr:key,first_seen_in:filename,
   review_priority:'normal'});
 }
}
assert.equal(map.size,1452,'German review baseline changed: update source inventory deliberately');
for(const key of Object.keys(base.translations))assert(map.has(key),'Source not in full UI reference: '+key);
const frenchPaths=[
 'ui.staging.json',
 'ui.core-navigation-lesson.staging.json',
 'ui.core-quran.staging.json',
 'ui.core-profile.staging.json',
 'ui.lesson-intro-feedback.staging.json',
 'ui.lesson-results.staging.json',
 'ui.streak-xp.staging.json',
 'ui.premium-shop.staging.json',
 'ui.quran-navigation-game.staging.json',
 'ui.quran-learning-surahs.staging.json'
];
const frenchKeys=new Set();
const frenchPackCounts={};
for(const filename of frenchPaths){
 const pack=read('assets/i18n/fr/'+filename);
 assert.equal(pack.locale,'fr','French locale drift in '+filename);
 assert.equal(pack.release_ready,false,'French UI must remain staging-only: '+filename);
 assert.equal(pack.native_reviewer_approved,false,'Native review must remain pending');
 for(const [key,value] of Object.entries(pack.translations)){
  assert(map.has(key),'French UI key not in source inventory: '+key);
  assert(!frenchKeys.has(key),'Duplicate French UI key across packs: '+key);
  assert.equal(typeof value,'string','French translation must be text: '+key);
  assert(value.trim(),'Empty French UI string: '+key);
  frenchKeys.add(key);
 }
 frenchPackCounts[filename]=Object.keys(pack.translations).length;
}
const count=frenchKeys.size;
const highRisk=[
 {screen:'lesson_matching',source:'Eşleşen çiftleri bul',dynamic:true},
 {screen:'lesson_grading',source:'Doğru cevabı seç',dynamic:true},
 {screen:'review_memory',source:'{n} öğrenilmiş kavram · {n} güçlendirilecek · {n} vadesi gelen',dynamic:true},
 {screen:'review_memory',source:'{unit} · Öncelikli',dynamic:true},
 {screen:'review_topic_chip',source:'{topic} · %{n}',dynamic:true},
 {screen:'results',source:'{n} günlük seri',dynamic:true},
 {screen:'results',source:'Sonraki seri ödülü: {n} gün',dynamic:true},
 {screen:'unit_completion',source:'{n}. KISIM · {n}. ÜNİTE · ✓ TAMAMLANDI',dynamic:true},
 {screen:'quran_learning',source:'Ayet {n} / {n} · Son çalışma: Bugün',dynamic:true},
 {screen:'quran_learning',source:'ÇALIŞMAYA DEVAM ET',dynamic:true},
 {screen:'review',source:'ADAPTİF TEKRARI BAŞLAT · {n} SORU',dynamic:true},
 {screen:'quran_meaning',source:'Arabic ayat/recitation immutable; French meaning independently reviewed',dynamic:true}
];
const sourceQuestions={};
for(let i=1;i<=15;i++){
 const unit='U'+String(i).padStart(2,'0');
 const rows=baseQuestions.filter(q=>q.id.startsWith('DEEN-'+unit+'-'));
 assert.equal(rows.length,100,'Expected 100 source questions in '+unit);
 sourceQuestions[unit]={source_count:rows.length,
  staged_count:Array.from({length:7},(_,i)=>
    Object.keys(read('assets/i18n/questions/fr/staging/'+unit+'-S'+String(i+1).padStart(2,'0')+'.json').translations).length
   ).reduce((a,b)=>a+b,0)};
}
const report={locale:'fr',production_ready:false,release_locked:true,
 question_total:1500,question_staged:Object.values(sourceQuestions).reduce((sum,u)=>sum+u.staged_count,0),
 unit_breakdown:sourceQuestions,ui_source_total:map.size,ui_staged:count,ui_staging_packs:frenchPackCounts,
 ui_remaining:map.size-count,ui_reference_base:Object.keys(base.translations).length,
 high_risk_dynamic_cases:highRisk,reference_source:'Turkish keys from German QA packs; no German display strings reused',
 review_caveat:'Inventory is a baseline, not proof every runtime DOM string is accounted for',
 ui_missing:[...map.keys()].filter(key=>!frenchKeys.has(key))
  .map(key=>({source_tr:key,first_seen_in:map.get(key).first_seen_in}))};
assert(report.ui_missing.length===report.ui_remaining);
assert.equal(report.question_staged,1500,'French source bank must include U01–U15');
assert.equal(report.ui_staged,605,'Expected 421 previous + 41 premium + 143 Quran UI strings');
assert.equal(report.ui_remaining,847);
mkdirSync('qa-artifacts',{recursive:true});
writeFileSync('qa-artifacts/french-ui-inventory.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({locale:report.locale,status:'passed',questions:report.question_staged+'/'+report.question_total,
 ui:report.ui_staged+'/'+report.ui_source_total,missingUI:report.ui_remaining,
 highRiskCases:highRisk.length,output:'qa-artifacts/french-ui-inventory.json',
 releaseReady:false},null,2));
