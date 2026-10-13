/* Assemble an EPHEMERAL French QA manifest from reviewed-pending staging JSON.
 * This module has no writes. It never alters production content-support.json. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {root,baseQuestions,getSource} from './english-source.mjs';

const read=path=>JSON.parse(readFileSync(root+path,'utf8'));
const same=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const uiFiles=[
 'ui.staging.json','ui.core-navigation-lesson.staging.json','ui.core-quran.staging.json',
 'ui.core-profile.staging.json','ui.lesson-intro-feedback.staging.json',
 'ui.lesson-results.staging.json','ui.streak-xp.staging.json',
 'ui.premium-shop.staging.json','ui.quran-navigation-game.staging.json',
 'ui.quran-learning-surahs.staging.json','ui.reference-batch-01.staging.json',
 'ui.reference-batch-02.staging.json','ui.real-lesson-extra.staging.json',
 'ui.reference-batch-03.staging.json','ui.reference-batch-04.staging.json',
 'ui.reference-batch-05.staging.json','ui.reference-batch-06.staging.json',
 'ui.reference-batch-07.staging.json','ui.reference-batch-08.staging.json'
];
const protectedKeys=['question_tr','explanation_tr','activity_type','options_tr',
 'correct_answer','pairs','items','correct_order'];
const expectedStages=[14,14,14,16,16,12,14];

export function buildFrenchPreview(){
 const prod=read('assets/i18n/content-support.json');
 assert.equal(prod.languages.fr.question_data,'missing','Prod French unexpectedly live');
 assert.equal(prod.languages.fr.global_qa,'blocked','Prod QA gate must remain blocked');
 assert.equal(prod.languages.fr.religious_expert_approved,false);
 assert(!prod.languages.fr.bank&&!prod.languages.fr.parts?.length);
 assert.equal(baseQuestions.length,1500);
 const byId=new Map(baseQuestions.map(q=>[q.id,q]));
 assert.equal(byId.size,1500);
 const packs=[],content=new Map(),sourceMap=new Map();
 function add(label,entries,expected){
  assert.equal(Object.keys(entries).length,expected,label+': coverage');
  const translations={};
  for(const [id,entry] of Object.entries(entries)){
   assert.equal(entry.expert_approved,false,id+': expert approval');
   assert.equal(entry.native_reviewer_approved,false,id+': native approval');
   assert.equal(entry.status,'traduction_provisoire_relecture_francophone_et_religieuse_requise',id+': stage gate');
   assert(entry.source&&entry.display,id+': missing staging');
   translations[id]={source:entry.source,display:entry.display};
   const candidates=sourceMap.get(id)||[];
   const signature=JSON.stringify(entry.source);
   const matching=candidates.find(x=>x.signature===signature);
   // The runtime adapter can disambiguate same IDs only when source payload differs.
   if(matching)assert(same(matching.display,entry.display),'Ambiguous same-ID/same-source translation '+id);
   else candidates.push({signature,display:entry.display,label});
   sourceMap.set(id,candidates);
  }
  const pack={schema_version:1,locale:'fr',expert_approved:false,
    verified_by_religious_expert:false,translations};
  const path='./__fr_staging_qa__/'+label+'.json';
  const body=JSON.stringify(pack);
  content.set(path,body);
  packs.push({path,count:expected,sha256:createHash('sha256').update(body).digest('hex')});
 }
 const stages=[];
 for(let n=1;n<=15;n++){
  const unit='U'+String(n).padStart(2,'0'),entries={};
  let total=0;
  for(let stageNum=1;stageNum<=7;stageNum++){
   const stage=unit+'-S'+String(stageNum).padStart(2,'0');
   const file=read('assets/i18n/questions/fr/staging/'+stage+'.json');
   assert.equal(file.locale,'fr');assert.equal(file.release_ready,false);
   assert.equal(file.verified_by_religious_expert,false);
   assert.equal(file.native_reviewer_approved,false);
   assert.equal(file.stage,stage);
   assert.equal(file.question_count,expectedStages[stageNum-1]);
   for(const [id,entry] of Object.entries(file.translations)){
    assert(!Object.hasOwn(entries,id),'Stage duplicate '+id);
    const original=byId.get(id);
    assert(original,'Unknown Turkish base '+id);
    assert(same(entry.source,getSource(original)),'Original source changed: '+id);
    entries[id]=entry;
    total++;
   }
  }
  assert.equal(total,100,unit+' base count');
  add('base-'+unit,entries,100);
 }
 const enLive=read('assets/i18n/questions/en/runtime/U01.live.json');
 const enVariants=read('assets/i18n/questions/en/runtime/U01.variants.json');
 const enLegacy=read('assets/i18n/questions/en/runtime/U01.legacy-renderer.json');
 const liveEntries={};
 for(let i=1;i<=7;i++){
  const name='U01-S'+String(i).padStart(2,'0');
  const p=read('assets/i18n/questions/fr/runtime/staging/'+name+'.live.json');
  assert.equal(p.release_ready,false);
  assert.equal(p.verified_by_religious_expert,false);
  assert.equal(p.question_count,12);
  for(const [id,row] of Object.entries(p.translations)){
   assert(!Object.hasOwn(liveEntries,id),'Duplicate live '+id);
   assert(same(row.source,enLive.translations[id]?.source),'Live source changed '+id);
   liveEntries[id]=row;
  }
 }
 add('live-U01',liveEntries,84);
 const variantPack=read('assets/i18n/questions/fr/runtime/staging/U01.variants.json');
 const legacyPack=read('assets/i18n/questions/fr/runtime/staging/U01.legacy-renderer.json');
 for(const [label,source,pack,want] of [
  ['variants-U01',enVariants,variantPack,20],
  ['legacy-U01',enLegacy,legacyPack,100]
 ]){
  assert.equal(pack.release_ready,false);
  assert.equal(pack.verified_by_religious_expert,false);
  assert.equal(pack.question_count,want);
  for(const [id,row] of Object.entries(pack.translations))
   assert(same(row.source,source.translations[id]?.source),'Runtime source drift '+label+':'+id);
  add(label,pack.translations,want);
 }
 const uiPacks=uiFiles.map(file=>{
  const p=read('assets/i18n/fr/'+file);
  assert.equal(p.locale,'fr');assert.equal(p.release_ready,false);
  assert.equal(p.global_qa,'blocked');
  assert.equal(p.native_reviewer_approved,false);
  assert.equal(p.verified_by_religious_expert,false);
  assert.equal(p.translation_count,Object.keys(p.translations).length);
  return p;
 });
 const ui=new Map();
 for(const p of uiPacks)for(const [key,value] of Object.entries(p.translations)){
  assert(!ui.has(key),'Duplicate Turkish UI source key '+key);
  assert(key.trim()&&typeof value==='string'&&value.trim(),'Empty UI string '+key);
  ui.set(key,value);
 }
 assert.equal(ui.size,1452,'Known baseline UI staging is incomplete');
 const dynamic=read('assets/i18n/fr/ui.dynamic-preview.staging.json');
 assert.equal(dynamic.runtime_integrated,false);
 assert.equal(dynamic.release_ready,false);
 assert.equal(dynamic.translation_count,9);
 const active=[
  ...baseQuestions.filter(q=>!q.id.startsWith('DEEN-U01-')),
  ...Object.entries(liveEntries).map(([id,row])=>({id,...row.source}))
 ];
 assert.equal(active.length,1484);
 const manifest=structuredClone(prod);
 // Only the ephemeral local test VM receives this mutated COPY of the manifest.
 manifest.languages.fr={
  ...manifest.languages.fr,
  question_data:'complete',global_qa:'passed',qa_preview_only:true,
  parts:packs
 };
 assert.equal(prod.languages.fr.question_data,'missing','Must not mutate disk manifest');
 return {manifest,content,base:baseQuestions,active,ui:Object.fromEntries(ui),
  dynamic:dynamic.translations,stats:{
   base:1500,active:1484,live:84,storedVariants:20,legacy:100,
   ui:1452,dynamicTemplates:9,parts:packs.length,sourceVariants:sourceMap.size
  }};
}
