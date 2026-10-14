/* Execute the real guarded browser question adapter against ephemeral French QA packs.
 * No mock translation logic, no committed manifest override and no production UI load. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import {createContext,runInContext} from 'node:vm';
import {root,baseQuestions} from './english-source.mjs';
import {buildFrenchPreview} from './fr-preview-pack-builder.mjs';
const read=p=>readFileSync(root+p,'utf8'),eq=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const built=buildFrenchPreview();
assert.deepEqual(built.stats,{base:1500,active:1484,live:84,storedVariants:20,legacy:100,
 ui:1452,dynamicTemplates:9,parts:18,sourceVariants:1596});
const production=JSON.parse(read('assets/i18n/content-support.json'));
assert.equal(production.languages.fr.question_data,'missing');
assert.equal(production.languages.fr.global_qa,'blocked');
assert(!production.languages.fr.parts);
const originalManifestHash=read('assets/i18n/content-support.json');
let current='tr',fetchCalls=0;
const window={
 __DEEN_CONTENT_MANIFEST__:built.manifest,__DEEN_DEPLOY_ID__:'fr-staging-vm-only',
 DEEN_BASE_QUESTIONS:baseQuestions,DEEN_APP_LOCALE:{get:()=>current},
 DEEN_BOOT:{progress:()=>{}}
};
const fetch=async url=>{
 const path=String(url).split('?')[0],body=built.content.get(path);
 fetchCalls++;
 return {ok:!!body,status:body?200:404,text:async()=>body??''};
};
const env={window,QUESTIONS:built.active,fetch,crypto:webcrypto,TextEncoder,console};
createContext(env);
runInContext(read('assets/i18n/content.js'),env,{filename:'real-deen-content-adapter.js'});
const adapter=window.DEEN_CONTENT_LOCALE;
assert(adapter&&typeof adapter.preload==='function','The real DEEN adapter was not executed');
assert.equal(adapter.available('tr'),true);
assert.equal(adapter.available('fr'),true,'QA-only cloned manifest should permit preloading');
const ready=await adapter.preload('fr');
assert.equal(ready,true,'Real adapter must source-validate all French staging questions');
assert.equal(fetchCalls,18);
assert.deepEqual(JSON.parse(JSON.stringify(adapter.inspectBank(baseQuestions,'fr'))),
 {sourceCount:1500,translated:1500,failedIds:[]});
assert.deepEqual(JSON.parse(JSON.stringify(adapter.inspectBank(built.active,'fr'))),
 {sourceCount:1484,translated:1484,failedIds:[]});
const trQuestion=baseQuestions.find(x=>x.id==='DEEN-U01-S01-001');
assert(trQuestion);
current='fr';
const frQuestion=adapter.translateQuestion(trQuestion);
assert.equal(frQuestion.__deenContentLocale,'fr');
assert.notEqual(frQuestion.question_tr,trQuestion.question_tr);
assert.equal(frQuestion.__deenSourceQuestion,trQuestion);
current='tr';assert.equal(adapter.translateQuestion(trQuestion),trQuestion,'TR must round trip without mutating question');
current='fr';assert.equal(adapter.translateQuestion(trQuestion,'fr').question_tr,frQuestion.question_tr);
let grading=0,special=0;
for(const [name,path] of [
 ['live','assets/i18n/questions/fr/runtime/staging/U01-S01.live.json'],
 ['stored','assets/i18n/questions/fr/runtime/staging/U01.variants.json'],
 ['legacy','assets/i18n/questions/fr/runtime/staging/U01.legacy-renderer.json']
]){
 const pack=JSON.parse(read(path));
 for(const [id,item] of Object.entries(pack.translations)){
  const selected=adapter.translateQuestion({id,...item.source},'fr');
  assert(selected,id+': adapter returned no translation in '+name);
  assert.equal(selected.question_tr,item.display.question_tr,id+': wrong source-scoped question in '+name);
  if(item.source.options_tr){
   const correct=item.source.options_tr.indexOf(item.source.correct_answer);
   assert.equal(selected.options_tr.indexOf(selected.correct_answer),correct,id+': incorrect answer grading');
   grading++;
  }
  special++;
 }
}
assert.equal(special,132,'1 live stage + 20 stored + 100 legacy source matches');
assert(grading>=100);
const u13=JSON.parse(read('assets/i18n/questions/fr/staging/U13-S03.json')).translations['DEEN-U13-S03-006'];
const q=adapter.translateQuestion({id:'DEEN-U13-S03-006',...u13.source},'fr');
assert.equal(q.pairs.length,4);assert.equal(new Set(q.pairs.map(x=>x.right)).size,4);
const unknown={id:'DEEN-U00-S00-000',question_tr:'untranslated'};
assert.equal(adapter.translateQuestion(unknown,'fr'),null,'Unknown French sources must fail closed');
assert.equal(read('assets/i18n/content-support.json'),originalManifestHash,
 'No production manifest file should ever change');

// Negative-path checks: a normal manifest MUST still block French, and modified
// QA fixture bytes MUST be rejected by the real content hash checker.
function freshAdapter(manifest,overrideFetch){
 const w={__DEEN_CONTENT_MANIFEST__:manifest,__DEEN_DEPLOY_ID__:'isolated-fr-qa',
  DEEN_BASE_QUESTIONS:baseQuestions,DEEN_APP_LOCALE:{get:()=> 'fr'},DEEN_BOOT:{progress:()=>{}}};
 const context={window:w,QUESTIONS:built.active,fetch:overrideFetch,
  crypto:webcrypto,TextEncoder,console:{log(){},error(){}}};
 createContext(context);
 runInContext(read('assets/i18n/content.js'),context);
 return w.DEEN_CONTENT_LOCALE;
}
const blockedAdapter=freshAdapter(production,async()=>{throw Error('Blocked language tried fetching files');});
assert.equal(blockedAdapter.available('fr'),false,'Production French release gate was bypassed');
assert.equal(await blockedAdapter.preload('fr'),false,'Production French packs must stay unavailable');
let tampered=false;
const invalidAdapter=freshAdapter(built.manifest,async url=>{
 const path=String(url).split('?')[0],body=built.content.get(path);
 if(!tampered){tampered=true;return {ok:true,text:async()=>body+' '};}
 return {ok:!!body,text:async()=>body??''};
});
assert.equal(await invalidAdapter.preload('fr'),false,'Changed QA pack must fail checksum');
assert(tampered);
assert.equal(read('assets/i18n/content-support.json'),originalManifestHash);

function uiVm(hostname,flag){
 const rootNode={nodes:[],elements:[],querySelectorAll(){return this.elements;}};
 const document={body:rootNode,createTreeWalker(node){let i=0;return {nextNode:()=>node.nodes[i++]||null};}};
 const uiWindow={location:{hostname},__DEEN_FRENCH_QA__:flag,document,NodeFilter:{SHOW_TEXT:4}};
 const context=createContext({window:uiWindow});
 runInContext(read('assets/i18n/fr/staging-preview.js'),context,{filename:'fr-staging-ui-preview.js'});
 return {ui:uiWindow.DEEN_FRENCH_STAGE_UI,rootNode};
}
assert.equal(uiVm('ilgazfindik.github.io',true).ui,undefined,'Pages hostname must not activate QA');
assert.equal(uiVm('127.0.0.1',false).ui,undefined,'QA explicit consent guard');
const {ui,rootNode}=uiVm('127.0.0.1',true);
assert(ui,'Expected loopback UI preview bridge');
const result=ui.init({staticTranslations:built.ui,dynamicTranslations:built.dynamic,
 runtimeObservedTranslations:built.observed});
assert.equal(result.staticKeys,1452);
assert.equal(result.observedKeys,3);
assert.equal(ui.translate('Öğrenme analizi','fr'),'Analyse de l’apprentissage');
assert.equal(ui.translate('Seviye 1','fr'),'Niveau 1');
assert.equal(ui.translate('Seviye 8','fr'),'Niveau 8');
assert.equal(ui.translate('Günlük hedef · 1 ders','fr'),'Objectif quotidien · 1 leçon');
assert.equal(ui.translate('Günlük hedef · 2 ders','fr'),'Objectif quotidien · 2 leçons');
assert.equal(ui.translate('ÖĞRENDİM · SORUYA GEÇ','fr'),'J’AI COMPRIS · PASSER À LA QUESTION');
assert.equal(result.previewOnly,true);
const cases=[
 ['Geri','Retour'],
 ['1 günlük seri','1 jour de suite'],
 ['7 günlük seri','7 jours de suite'],
 ['Sonraki seri ödülü: 1 gün','Prochaine récompense de série : 1 jour'],
 ['ADAPTİF TEKRARI BAŞLAT · 1 SORU','COMMENCER LA RÉVISION ADAPTATIVE · 1 QUESTION'],
 ['ADAPTİF TEKRARI BAŞLAT · 5 SORU','COMMENCER LA RÉVISION ADAPTATIVE · 5 QUESTIONS'],
 ['1 öğrenilmiş kavram · 2 güçlendirilecek · 3 vadesi gelen','1 notion apprise · 2 à renforcer · 3 à réviser'],
 ['2. KISIM · 3. ÜNİTE · ✓ TAMAMLANDI','SECTION 2 · UNITÉ 3 · ✓ TERMINÉE'],
 ['Ayet 1 / 4 · Son çalışma: Bugün','Verset 1 / 4 · Dernière séance : aujourd’hui'],
 ['Fâtiha','Al-Fâtiha']
];
for(const [source,expected]of cases)
 assert.equal(ui.translate(source,'fr'),expected,'French UI or plural preview mismatch '+source);
const textNode=(source,protectedFlag=false)=>({nodeValue:source,
 parentElement:{closest:()=>protectedFlag?{}:null}});
const arabic='بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
rootNode.nodes=[textNode('Geri'),textNode('1 günlük seri'),textNode(arabic),textNode('İbadet',true)];
const attrs={'aria-label':'Devam Et'},elem={closest:()=>null,
 hasAttribute:key=>Object.hasOwn(attrs,key),getAttribute:key=>attrs[key],
 setAttribute:(key,value)=>{attrs[key]=value}};
rootNode.elements=[elem];
const count=ui.setLocale('fr',rootNode);
assert.equal(count,3,'Only two Turkish nodes and one attribute should change');
assert.deepEqual(rootNode.nodes.map(x=>x.nodeValue),['Retour','1 jour de suite',arabic,'İbadet']);
assert.equal(attrs['aria-label'],'Continuer');
assert.equal(ui.setLocale('tr',rootNode),3,'All preview changes must revert');
assert.equal(rootNode.nodes[0].nodeValue,'Geri');
assert.equal(rootNode.nodes[1].nodeValue,'1 günlük seri');
assert.equal(attrs['aria-label'],'Devam Et');
assert.equal(production.languages.fr.question_data,'missing');
console.log(JSON.stringify({
 locale:'fr',scope:'ephemeral_node_vm_real_content_adapter',status:'test_preview_only',
 questionSourceGuards:'passed',manifestOnDisk:'unchanged_blocked',
 baseQuestions:1500,activeQuestions:1484,unitPacks:15,runtimePacks:3,
 liveQuestions:84,storedVariants:20,legacy:100,
 sourceScopedRuntimeCases:special,sourceScopedAnswerCases:grading,
 stagedStaticUI:1452,dynamicPatternInputs:9,pluralAndStaticCases:cases.length,
 uiDomRoundTrip:true,quranArabicOriginalProtected:true,
 u13DistinctVisibleMatching:true,productionUnlocked:false,
 actualBrowserGameplayTested:false,productionGateNegativeTest:true,tamperedPackRejected:true
},null,2));
