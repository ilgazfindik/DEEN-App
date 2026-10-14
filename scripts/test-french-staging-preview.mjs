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
 ui:1452,dynamicTemplates:9,quranStaticDrafts:54,quranDynamicDrafts:17,p10StaticDrafts:69,p10DynamicDrafts:34,parts:18,sourceVariants:1596});
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

// P09 tests the REAL application translateText() API, not UI preview replacement.
// Only exact source entries belonging to the active question may be translated.
const contextCases=[
 trQuestion,
 baseQuestions.find(q=>q.activity_type==='matching'),
 baseQuestions.find(q=>q.activity_type==='build_sequence'),
 baseQuestions.find(q=>q.activity_type==='fill_blank'),
 baseQuestions.find(q=>Array.isArray(q.options_tr)&&q.options_tr.length>0)
];
assert(contextCases.every(Boolean),'Source bank must cover P09 activity contexts');
let scopedFields=0;
for(const original of contextCases){
 const translated=adapter.translateQuestion(original,'fr');
 assert(translated,'A source-matched French question was missing');
 env.session={questions:[translated],index:0};
 assert.equal(adapter.translateText(original.question_tr,'fr'),translated.question_tr,
  original.id+': question prompt not connected to French engine');
 assert.equal(adapter.translateText(original.explanation_tr,'fr'),translated.explanation_tr,
  original.id+': explanation not connected');
 scopedFields+=2;
 for(const field of ['correct_answer']){
  if(typeof original[field]==='string'&&original[field].trim()){
   assert.equal(adapter.translateText(original[field],'fr'),translated[field],
    original.id+': answer translation not source-scoped');
   scopedFields++;
  }
 }
 for(const field of ['options_tr','items','correct_order']){
  if(!Array.isArray(original[field]))continue;
  for(let i=0;i<original[field].length;i++){
   // When the same Turkish token occurs twice within ONE question, lookup
   // resolves to the first source occurrence, just like the original engine.
   const first=original[field].indexOf(original[field][i]);
   if(first!==i)continue;
   assert.equal(adapter.translateText(original[field][i],'fr'),
    translated[field][i],original.id+': '+field+'['+i+']');
   scopedFields++;
  }
 }
 if(Array.isArray(original.pairs)){
  for(let i=0;i<original.pairs.length;i++)for(const side of ['left','right']){
   const old=original.pairs[i][side];
   // Some source concepts are intentionally identical across pairs; test only
   // unambiguous first occurrences in a source-matched question.
   const all=original.pairs.flatMap(p=>[p.left,p.right]);
   if(all.indexOf(old)!==2*i+(side==='right'?1:0))continue;
   assert.equal(adapter.translateText(old,'fr'),translated.pairs[i][side],
    original.id+': matching '+side+'['+i+']');
   scopedFields++;
  }
 }
 assert.equal(adapter.translateText('unregistered instruction '+original.id,'fr'),
  'unregistered instruction '+original.id,'Unknown helper text must fail closed');
}
env.session=null;
assert.equal(adapter.translateText(trQuestion.question_tr,'fr'),trQuestion.question_tr,
 'A French translation without an active question could leak another source context');
env.session={questions:[{...frQuestion,__deenSourceQuestion:
 {...trQuestion,question_tr:'SOURCE TAMPERED'}}],index:0};
assert.equal(adapter.translateText(trQuestion.question_tr,'fr'),trQuestion.question_tr,
 'Tampered French question source must never pass the per-question guard');
env.session={questions:[frQuestion],index:0};
assert.equal(adapter.translateText(trQuestion.question_tr,'tr'),trQuestion.question_tr,
 'Turkish text must remain unchanged in the Turkish language');
env.session=null;
assert(scopedFields>15,'P09 requires multiple real source-scoped fields to be exercised');

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
 runtimeObservedTranslations:built.observed,
 quranStaticTranslations:built.quranUi,quranDynamicTranslations:built.quranDynamic,
 p10StaticTranslations:built.p10Ui,p10DynamicTranslations:built.p10Dynamic});
assert.equal(result.staticKeys,1452);
assert.equal(result.observedKeys,4);
assert.equal(result.quranStaticDraftKeys,54);
assert.equal(result.quranDynamicDraftKeys,17);
assert.equal(result.p10StaticDraftKeys,69);
assert.equal(result.p10DynamicDraftKeys,34);
assert.equal(ui.translate('İhlâs Yolculuğu','fr'),'Parcours d’Al-Ikhlâs');
assert.equal(ui.translate('2 · OKU','fr'),'2 · LIRE');
assert.equal(ui.translate('SEVİYE 0','fr'),'NIVEAU 0');
assert.equal(ui.translate('0/4 ayet öğrenildi','fr'),'0/4 versets appris');
assert.equal(ui.translate('1/1 ayet öğrenildi','fr'),'1/1 verset appris');
assert.equal(ui.translate('Mevcut günlük görevler: 0/3 tamamlandı · 0 tekrar bekliyor','fr'),
 'Tâches quotidiennes : 0/3 terminées · 0 révisions en attente');
assert.equal(ui.translate('Mevcut günlük görevler: 0/1 tamamlandı · 1 tekrar bekliyor','fr'),
 'Tâches quotidiennes : 0/1 terminée · 1 révision en attente');
assert.equal(ui.translate('3 sn','fr'),'3 s');
assert.equal(ui.translate('ANLATIM PROFİLİ','fr'),'PROFIL PÉDAGOGIQUE');
assert.equal(ui.translate('VERİ & İLERLEME','fr'),'DONNÉES ET PROGRESSION');
assert.equal(ui.translate('İlerlemeyi yedekle','fr'),'Sauvegarder la progression');
assert.equal(ui.translate('Ders 1/4 · Sesi Tanı','fr'),'Leçon 1/4 · Reconnaître à l’écoute');
assert.equal(ui.translate('Bugünkü Yolculuk · 0/3','fr'),'Parcours du jour · 0/3');
assert.equal(ui.translate('%80 GEÇİŞ','fr'),'SEUIL DE RÉUSSITE : 80 %');
assert.equal(ui.translate('Günlük hedef · 2 mini ders','fr'),'Objectif quotidien · 2 mini-leçons');
assert.equal(ui.translate('Günlük hedef · 1 mini ders','fr'),'Objectif quotidien · 1 mini-leçon');
assert.equal(ui.translate('1 enerji','fr'),'1 point d’énergie');
assert.equal(ui.translate('30 enerji','fr'),'30 points d’énergie');
assert.equal(ui.translate('DEEN önce mezheplerin ortak çekirdeğini öğretir. Mezhep-hassas içerikler başka geçerli bir görüşü yanlış diye puanlamaz ve uzman incelemesi önceliğini korur.','fr'),
 'DEEN önce mezheplerin ortak çekirdeğini öğretir. Mezhep-hassas içerikler başka geçerli bir görüşü yanlış diye puanlamaz ve uzman incelemesi önceliğini korur.');
assert.equal(ui.translate('Ders 1','fr'),'Leçon 1');
assert.equal(ui.translate('1 soru','fr'),'1 question');
assert.equal(ui.translate('5 soru','fr'),'5 questions');
assert.equal(ui.translate('1 Seri','fr'),'1 jour de suite');
assert.equal(ui.translate('7 Seri','fr'),'7 jours de suite');
assert.equal(ui.translate('1 Enerji','fr'),'1 point d’énergie');
assert.equal(ui.translate('30 Enerji','fr'),'30 points d’énergie');
assert.equal(ui.translate('1. KISIM · 1. ÜNİTE','fr'),'PARTIE 1 · UNITÉ 1');
assert.equal(ui.translate('Müslüman Kimdir? — Önceki aşamayı tamamla','fr'),
 'Qui est musulman ? — termine d’abord l’étape précédente');
assert.equal(ui.translate('Müslüman Kimdir? · ANLA · Aşama 2/5','fr'),
 'Qui est musulman ? · COMPRENDRE · étape 2/5');
assert.equal(ui.translate('İslam Nedir? · 5 aşamalı öğrenme yolu','fr'),
 'Qu’est-ce que l’islam ? · parcours d’apprentissage en 5 étapes');
assert.equal(ui.translate('Kaynakta Bulunmayan U999 — Önceki aşamayı tamamla','fr'),
 'Kaynakta Bulunmayan U999 — Önceki aşamayı tamamla',
 'Missing theological source translation must fail closed');
assert.equal(ui.translate('Müslüman Kimdir? — Önceki aşamayı tamamla','tr'),
 'Müslüman Kimdir? — Önceki aşamayı tamamla');
assert.equal(ui.translate('Sonraki seviyeye 300 XP','fr'),'Encore 300 XP avant le prochain niveau');
assert.equal(ui.translate('1 mini ders · yaklaşık 5 dakika','fr'),'1 mini-leçon · environ 5 minutes');
assert.equal(ui.translate('3 mini ders · yaklaşık 15 dakika','fr'),'3 mini-leçons · environ 15 minutes');
assert.equal(ui.translate('1 HAZIR','fr'),'1 PRÊT');
assert.equal(ui.translate('2 HAZIR','fr'),'2 PRÊTS');
assert.equal(ui.translate('1 doğru cevap','fr'),'1 bonne réponse');
assert.equal(ui.translate('10 doğru cevap','fr'),'10 bonnes réponses');
assert.equal(ui.translate('Arapça: Quran.com · Meal: Muhammed Hamdi Yazır, 1938','fr'),
 'Arapça: Quran.com · Meal: Muhammed Hamdi Yazır, 1938');
assert.equal(ui.translate('İlerlemeyi yedekle','tr'),'İlerlemeyi yedekle');
assert.equal(ui.translate('14 Eki','fr'),'14 oct.');
assert.equal(ui.translate('1 Oca','fr'),'1 janv.');
assert.equal(ui.translate('31 Ara','fr'),'31 déc.');
assert.equal(ui.translate('14 Eki','tr'),'14 Eki','Turkish date must remain unchanged');
assert.equal(ui.translate('Ustalık %50','fr'),'Maîtrise : 50 %');
assert.equal(ui.translate('0/4 ayet 5/5 + Solid','fr'),'0/4 versets · 5/5 + solide');
assert.equal(ui.translate('0/1 ayet 5/5 + Solid','fr'),'0/1 verset · 5/5 + solide');
assert.equal(ui.translate('De, o: Allah tek bir tektir.','fr'),'De, o: Allah tek bir tektir.');
assert.equal(ui.translate('Muhammed Hamdi Yazır, 1938 ·','fr'),'Muhammed Hamdi Yazır, 1938 ·');
assert.equal(ui.translate('İhlâs 1. ayeti hatırla','fr'),'Rappelle-toi le verset 1 d’Al-Ikhlâs');
assert.equal(ui.translate('Fâtiha Suresi','fr'),'Sourate Al-Fâtiha');
assert.equal(ui.translate('Sure Kütüphanesi','fr'),'Bibliothèque des sourates');
assert.equal(ui.translate('Ayet 1 / 7 · Son çalışma: Henüz çalışma yok','fr'),
 'Verset 1 / 7 · Dernière séance : pas encore étudié');
assert.equal(ui.translate('0 / 1 ayet','fr'),'0 / 1 verset');
assert.equal(ui.translate('2 / 7 ayet','fr'),'2 / 7 versets');
assert.equal(ui.translate('24 riskli ayetten kişisel tur','fr'),
 'Parcours personnalisé parmi 24 versets à revoir');
assert.equal(ui.translate('İhlâs Suresi','fr'),'Sourate Al-Ikhlâs');
assert.equal(ui.translate('BAŞLANMADI','fr'),'NON COMMENCÉE');
assert.equal(ui.translate('1. sure · 7 ayet · Şu an buradasın','fr'),
 'Sourate n° 1 · 7 versets · Vous êtes ici');
assert.equal(ui.translate('112. sure · 4 ayet','fr'),'Sourate n° 112 · 4 versets');
assert.equal(ui.translate('0 / 7 ayet tamamlandı','fr'),'0 / 7 versets étudiés');
assert.equal(ui.translate('0 / 1 ayet tamamlandı','fr'),'0 / 1 verset étudié');
assert.equal(ui.translate('Tebbet Suresi','fr'),'Sourate Al-Masad (Tebbet)');
assert.equal(ui.translate('Beyyine Suresi','fr'),'Sourate Al-Bayyina');
assert.equal(ui.translate('TEKRAR SAYISI','fr'),'NOMBRE DE RÉPÉTITIONS');
assert.equal(ui.translate('İhlâs · Ayet 1/4','fr'),'Al-Ikhlâs · verset 1/4');
assert.equal(ui.translate('Ayet 1 / 4','fr'),'Verset 1 / 4');
assert.equal(ui.translate('Hoparlöre dokun: Ayet 1 kaydını dinle.','fr'),
 'Appuie sur le haut-parleur pour écouter la récitation du verset 1.');
assert.equal(ui.translate('Öğrenme analizi','fr'),'Analyse de l’apprentissage');
assert.equal(ui.translate('Seviye 1','fr'),'Niveau 1');
assert.equal(ui.translate('Seviye 8','fr'),'Niveau 8');
assert.equal(ui.translate('Günlük hedef · 1 ders','fr'),'Objectif quotidien · 1 leçon');
assert.equal(ui.translate('Günlük hedef · 2 ders','fr'),'Objectif quotidien · 2 leçons');
assert(ui.translate('Soruda belirtilen terminoloji çerçevesini dikkate al. Geçerli Mâtürîdî / Eş’arî kullanım farkları inanç hatası değildir.','fr')
 .startsWith('Respecte le cadre terminologique'));
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
