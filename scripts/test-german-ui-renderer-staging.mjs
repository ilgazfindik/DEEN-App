import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createGermanUIStagingRenderer} from '../assets/i18n/german-ui.renderer.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=path=>JSON.parse(readFileSync(root+path,'utf8'));
const english=read('assets/i18n/english-ui.draft.json').translations;
const packPaths=[
 'assets/i18n/german-ui.staging.json',
 'assets/i18n/german-ui.lesson-flow.staging.json',
 'assets/i18n/german-ui.premium-shop.staging.json',
 'assets/i18n/german-ui.quran-controls.staging.json',
 ...Array.from({length:8},(_,i)=>'assets/i18n/german-ui.reference-batch-'+String(i+1).padStart(2,'0')+'.staging.json')
];
const packs=packPaths.map(read);
const application=readFileSync(root+'index.html','utf8');
const boot=readFileSync(root+'assets/i18n/boot.js','utf8');
const preview=readFileSync(root+'qa/german-ui-staging-preview.html','utf8');
assert(!application.includes('german-ui.renderer.staging.mjs'),'Staging renderer must not load in the production app');
assert(!boot.includes('german-ui.renderer.staging.mjs'),'Production startup must not invoke staging preview');
assert(preview.includes("import {createGermanUIStagingRenderer}"),'QA preview must import the tested adapter');
assert(preview.includes("qaMode:true"),'QA preview must explicitly opt in');
assert(preview.includes('lang="ar" dir="rtl"'),'Quran Arabic fixture missing');
assert(preview.includes('Bilinmeyen aşama metni'),'Unknown-label visibility check missing');
// Assert against the actual shipping lesson DOM, not only a handcrafted preview.
const lessonSegment=readFileSync(root+'release/v9.9.3-direct/segment-01.txt','utf8');
for(const id of ['lesson','quizView','qStage','qMeta','qType','questionText',
 'answerArea','feedbackTitle','feedbackText','resultView','finalStrengths','finalReview']){
 assert(lessonSegment.includes('id="'+id+'"'),'Production lesson DOM selector changed: #'+id);
}
assert(lessonSegment.includes('<div class="question" id="questionText">'),
 'Source-dependent prompt container has changed');
assert(lessonSegment.includes('<div id="answerArea">'),
 'Source-dependent options container has changed');
const manifest=read('assets/i18n/content-support.json').languages.de;
assert.equal(manifest.question_data,'missing');
assert.equal(manifest.global_qa,'blocked');
assert.equal(manifest.religious_expert_approved,false);
const renderer=createGermanUIStagingRenderer({packs,englishReference:english});
assert.deepEqual(renderer.stats(),{entries:1442,matchedReference:1087,passes:0,writes:0});
assert.equal(renderer.translate('  Devam Et  '),'  Weiter  ');
assert.equal(renderer.translate('Namaza Hazırlık'),'Vorbereitung auf das Gebet');
assert.equal(renderer.translate('KISIM 1 FİNALİ'),'FINALE VON ABSCHNITT 1');
assert.equal(renderer.translate('3 soru'),'3 Fragen');
assert.equal(renderer.translate('1 soru'),'1 Frage');
assert.equal(renderer.translate('9 ayet'),'9 Verse');
assert.equal(renderer.translate('Sıradaki aşama · Namaza Hazırlık'),'Nächste Etappe · Vorbereitung auf das Gebet');
assert.equal(renderer.translate('Sıradaki aşama · Bu bilinmeyen bölüm'),null,
 'A dynamic mixed-language fallback must not be fabricated');
assert.equal(renderer.translate('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'),null);
assert.equal(renderer.translate('İçeriği bilinmeyen soru cevabı'),null);
assert.equal(renderer.translate('Nonexistent UI text'),null);
assert.throws(()=>createGermanUIStagingRenderer({packs:packs.slice(0,11),englishReference:english}),/PACKS_INCOMPLETE/);
assert.throws(()=>createGermanUIStagingRenderer({packs:packs.map((p,i)=>i===11?{...p,release_ready:true}:p),englishReference:english}),/RELEASE_GUARD/);
assert.throws(()=>createGermanUIStagingRenderer({packs:packs.map((p,i)=>i===11?{...p,global_qa:'passed'}:p),englishReference:english}),/RELEASE_GUARD/);
const humanApproved=packs.map((p,i)=>i===11?{...p,verified_by_religious_expert:true}:p);
assert.throws(()=>createGermanUIStagingRenderer({packs:humanApproved,englishReference:english}),/RELEASE_GUARD/);
const copies=packs.map(p=>structuredClone(p));
delete copies[11].translations['Fâtiha'];
copies[11].translations['Geri']='Falsch';
assert.throws(()=>createGermanUIStagingRenderer({packs:copies,englishReference:english}),/DE_STAGING_DICTIONARY_DRIFT|DE_STAGING_CONFLICT/);

const parent=excluded=>({closest:selector=>
 excluded===true?{}:typeof excluded==='string'&&selector.split(',').map(x=>x.trim()).includes(excluded)?{}:null});
const nodes=[
 {nodeValue:'  Devam Et  ',parentElement:parent(false)},
 {nodeValue:'3 soru',parentElement:parent(false)},
 {nodeValue:'KISIM 1 FİNALİ',parentElement:parent(false)},
 {nodeValue:'Namaza Hazırlık',parentElement:parent(false)},
 {nodeValue:'Bilinmeyen aşama metni',parentElement:parent(false)},
 {nodeValue:'بِسْمِ اللَّهِ',parentElement:parent(true)},
 {nodeValue:'Geri',parentElement:parent(true)},
 // Real DOM selectors: generic UI replacement must never touch graded answer data.
 {nodeValue:'Namaza Hazırlık',parentElement:parent('#questionText')},
 {nodeValue:'Geri',parentElement:parent('#answerArea')},
 {nodeValue:'Namaza Hazırlık',parentElement:parent('#feedbackText')},
 {nodeValue:'Geri',parentElement:parent('.deen-qarena-option')},
 {nodeValue:'Fâtiha',parentElement:parent('[data-deen-quran-meaning]')},
 {nodeValue:'Geri',parentElement:parent('[data-qj2-fill-slot]')},
 {nodeValue:'Namaza Hazırlık',parentElement:parent('[lang="ar"]')},
 // Nearby header chrome remains translatable.
 {nodeValue:'Kontrol Et',parentElement:parent(false)}
];
function element(attrs,excluded=false){
 const a=new Map(Object.entries(attrs));
 return {closest:parent(excluded).closest,hasAttribute:k=>a.has(k),
  getAttribute:k=>a.get(k),setAttribute:(k,v)=>a.set(k,v)};
}
const button=element({'aria-label':' Geri ','title':'Namaza Hazırlık'});
const skip=element({'alt':'Geri'},true);
const questionChoice=element({'aria-label':'Geri','title':'Namaza Hazırlık'},'#answerArea');
const arabicAyah=element({'alt':'Geri'},'[lang="ar"]');
const fixture={
 querySelectorAll:()=>[button,skip,questionChoice,arabicAyah],
 nodes
};
const doc={defaultView:{NodeFilter:{SHOW_TEXT:4}},createTreeWalker:root=>{
 let i=0;return {nextNode:()=>root.nodes[i++]||null};
}};
assert.throws(()=>renderer.render(fixture,{locale:'de',documentRef:doc}),/PREVIEW_ONLY/);
assert.throws(()=>renderer.render(fixture,{locale:'tr',qaMode:true,documentRef:doc}),/PREVIEW_ONLY/);
const first=renderer.render(fixture,{locale:'de',qaMode:true,documentRef:doc});
assert.equal(first.mode,'staging-only');
assert.equal(nodes[0].nodeValue,'  Weiter  ');
assert.equal(nodes[1].nodeValue,'3 Fragen');
assert.equal(nodes[2].nodeValue,'FINALE VON ABSCHNITT 1');
assert.equal(nodes[3].nodeValue,'Vorbereitung auf das Gebet');
assert.equal(nodes[4].nodeValue,'Bilinmeyen aşama metni');
assert.equal(nodes[5].nodeValue,'بِسْمِ اللَّهِ');
assert.equal(nodes[6].nodeValue,'Geri');
assert.equal(button.getAttribute('aria-label'),' Zurück ');
assert.equal(button.getAttribute('title'),'Vorbereitung auf das Gebet');
assert.equal(skip.getAttribute('alt'),'Geri');
assert.equal(questionChoice.getAttribute('aria-label'),'Geri');
assert.equal(questionChoice.getAttribute('title'),'Namaza Hazırlık');
assert.equal(arabicAyah.getAttribute('alt'),'Geri');
for(let i=7;i<=13;i++){
 const before=['Namaza Hazırlık','Geri','Namaza Hazırlık','Geri','Fâtiha','Geri','Namaza Hazırlık'][i-7];
 assert.equal(nodes[i].nodeValue,before,'Protected question/Quran node was modified at '+i);
}
assert.equal(nodes[14].nodeValue,'Prüfen','Ordinary lesson CTA should be localized');
assert(first.skipped>=9,'Graded answer/Quran guards were not exercised');
assert(first.unresolved.includes('Bilinmeyen aşama metni'));
assert.equal(first.writes,7);
const again=renderer.render(fixture,{locale:'de',qaMode:true,documentRef:doc});
assert.equal(again.writes,0,'Repeated DOM application must be idempotent');
nodes[0].nodeValue='Namaza Hazırlık';
button.setAttribute('aria-label','Devam Et');
const changed=renderer.render(fixture,{locale:'de',qaMode:true,documentRef:doc});
assert.equal(changed.writes,2,'Newly re-rendered Turkish labels must be processed');
assert.equal(nodes[0].nodeValue,'Vorbereitung auf das Gebet');
assert.equal(button.getAttribute('aria-label'),'Weiter');
assert.equal(renderer.stats().passes,3);
assert.equal(renderer.stats().writes,9);
console.log(JSON.stringify({status:'passed',locale:'de',staging_only:true,preview_required:true,
 dictionary_keys:renderer.stats().entries,english_reference_keys:renderer.stats().matchedReference,
 exact_translation:true,dynamic_counts:true,dom_text:true,dom_attributes:true,whitespace:true,
 quran_arabic_untouched:true,question_answers_protected:true,actual_lesson_dom_selectors_verified:12,
 unknown_strings_reported:true,repeat_render_idempotent:true,
 live_de_manifest:'blocked',browser_e2e:'not_claimed'},null,2));
