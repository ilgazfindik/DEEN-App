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
copies[11].translations['Fâtiha']='Another rendering';
assert.throws(()=>createGermanUIStagingRenderer({packs:copies,englishReference:english}),/DE_STAGING_DICTIONARY_DRIFT|DE_STAGING_CONFLICT/);

const parent=excluded=>({closest:()=>excluded?{}:null});
const nodes=[
 {nodeValue:'  Devam Et  ',parentElement:parent(false)},
 {nodeValue:'3 soru',parentElement:parent(false)},
 {nodeValue:'KISIM 1 FİNALİ',parentElement:parent(false)},
 {nodeValue:'Namaza Hazırlık',parentElement:parent(false)},
 {nodeValue:'Bilinmeyen aşama metni',parentElement:parent(false)},
 {nodeValue:'بِسْمِ اللَّهِ',parentElement:parent(true)},
 {nodeValue:'Geri',parentElement:parent(true)}
];
function element(attrs,excluded=false){
 const a=new Map(Object.entries(attrs));
 return {closest:parent(excluded).closest,hasAttribute:k=>a.has(k),
  getAttribute:k=>a.get(k),setAttribute:(k,v)=>a.set(k,v)};
}
const button=element({'aria-label':' Geri ','title':'Namaza Hazırlık'});
const skip=element({'alt':'Geri'},true);
const fixture={
 querySelectorAll:()=>[button,skip],
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
assert(first.unresolved.includes('Bilinmeyen aşama metni'));
assert.equal(first.writes,6);
const again=renderer.render(fixture,{locale:'de',qaMode:true,documentRef:doc});
assert.equal(again.writes,0,'Repeated DOM application must be idempotent');
nodes[0].nodeValue='Namaza Hazırlık';
button.setAttribute('aria-label','Devam Et');
const changed=renderer.render(fixture,{locale:'de',qaMode:true,documentRef:doc});
assert.equal(changed.writes,2,'Newly re-rendered Turkish labels must be processed');
assert.equal(nodes[0].nodeValue,'Vorbereitung auf das Gebet');
assert.equal(button.getAttribute('aria-label'),'Weiter');
assert.equal(renderer.stats().passes,3);
assert.equal(renderer.stats().writes,8);
console.log(JSON.stringify({status:'passed',locale:'de',staging_only:true,preview_required:true,
 dictionary_keys:renderer.stats().entries,english_reference_keys:renderer.stats().matchedReference,
 exact_translation:true,dynamic_counts:true,dom_text:true,dom_attributes:true,whitespace:true,
 quran_arabic_untouched:true,unknown_strings_reported:true,repeat_render_idempotent:true,
 live_de_manifest:'blocked',browser_e2e:'not_claimed'},null,2));
