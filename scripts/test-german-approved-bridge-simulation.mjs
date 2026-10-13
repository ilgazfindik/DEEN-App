/* Production German bridge acceptance in disposable, simulated approval state.
 * Does NOT write signed releases, mark any real approvals, or expose drafts. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash,webcrypto} from 'node:crypto';
import {installGermanProductionUI,germanReleaseAuthorized}
 from '../assets/i18n/german-ui.production.mjs';
const txt=p=>readFileSync(p,'utf8');
const json=p=>JSON.parse(txt(p));
const hash=v=>createHash('sha256').update(v).digest('hex');
const m=json('assets/i18n/content-support.json');
assert.equal(m.languages.de.question_data,'missing');
assert.equal(m.languages.de.global_qa,'blocked');
const paths=['german-ui.staging.json','german-ui.lesson-flow.staging.json',
 'german-ui.premium-shop.staging.json','german-ui.quran-controls.staging.json',
 ...Array.from({length:8},(_,i)=>'german-ui.reference-batch-'+String(i+1).padStart(2,'0')+'.staging.json'),
 'german-ui.real-lesson.staging.json'];
const rawQuran=json('assets/i18n/quran/de/ayah-meanings.staging.json');
const quran=structuredClone(rawQuran);
Object.assign(quran,{release_ready:true,expert_approved:true,
 native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true});
for(const item of Object.values(quran.translations))
 Object.assign(item,{expert_approved:true,native_reviewer_approved:true,
  meaning_reviewed:true,rights_reviewed:true});
const approvedPath='./assets/i18n/quran/de/ayah-meanings.approved.json';
const approvedText=JSON.stringify(quran,null,2)+'\n';
const quranAudioPath='./assets/quran/audio/ayah-audio-manifest.json';
const audioManifest=json('assets/quran/audio/ayah-audio-manifest.json');
const audioByKey=new Map(audioManifest.entries.map(r=>[r.key,r]));
assert.equal(audioByKey.size,90);
const approved={...m,languages:{...m.languages,de:{...m.languages.de,
 entry:'complete',question_data:'complete',global_qa:'passed',
 religious_expert_approved:true,native_reviewer_approved:true,rights_reviewed:true,
 ui_release_ready:true,quran_meanings_approved:true,production_bridge_ready:true,
 parts:Array.from({length:114},(_,i)=>({path:'./approved/'+i+'.json',count:1,
  sha256:'a'.repeat(64)})),
 ui_parts:paths.map(p=>({path:'./assets/i18n/'+p,
  sha256:hash(txt('assets/i18n/'+p))})),
 ui_reference_sha256:hash(txt('assets/i18n/english-ui.draft.json')),
 quran_meanings_sha256:hash(approvedText),
 quran_meanings_path:approvedPath,
 quran_audio_manifest_sha256:hash(txt('assets/quran/audio/ayah-audio-manifest.json'))
}}};
assert.equal(germanReleaseAuthorized(approved),true);
const fixtures=new Map([
 ...paths.map(p=>['./assets/i18n/'+p,txt('assets/i18n/'+p)]),
 ['./assets/i18n/english-ui.draft.json',txt('assets/i18n/english-ui.draft.json')],
 [approvedPath,approvedText],
 [quranAudioPath,txt('assets/quran/audio/ayah-audio-manifest.json')]
]);
const originalFetch=globalThis.fetch,originalCrypto=globalThis.crypto;
globalThis.fetch=async url=>{
 const source=String(url).split('?')[0],body=fixtures.get(source);
 return body===undefined?{ok:false,status:404,text:async()=>''}:
  {ok:true,status:200,text:async()=>body};
};
Object.defineProperty(globalThis,'crypto',{value:webcrypto,configurable:true});
const listeners=new Map();
const feedbackTitle={textContent:''},feedbackText={textContent:''};
const doc={
 documentElement:{lang:'de'},
 defaultView:{NodeFilter:{SHOW_TEXT:4}},
 body:{querySelectorAll:()=>[]},
 createTreeWalker:()=>({nextNode:()=>null}),
 getElementById:id=>id==='feedbackTitle'?feedbackTitle:id==='feedbackText'?feedbackText:null,
 addEventListener:(name,fn)=>listeners.set(name,fn)
};
const source={id:'DEEN-U01-S01-001',question_tr:'Kaynak soru',
 explanation_tr:'Kaynak açıklama'};
const germanQuestion={...source,question_tr:'Geprüfte Frage',
 explanation_tr:'Geprüfte Erklärung',options_tr:['ja','nein'],
 correct_answer:'ja',__deenContentLocale:'de',__deenSourceQuestion:source};
const win={
 __DEEN_DEPLOY_ID__:'synthetic-approved-qa',DEEN_APP_LOCALE:{get:()=> 'de'},
 DEEN_CONTENT_LOCALE:{translateQuestion:q=>q?.id===source.id?germanQuestion:null},
 DEEN_QURAN_CONTENT:{getAyah:(id,ayah)=>{
  const v=audioByKey.get(String(id)+':'+String(ayah));
  return !v?null:{surah_id:v.surahId,ayah_number:v.ayah,
   arabic:{text:v.text,source:{provider:'Quran.com'}}};
 }},
 DEEN_QURAN_LEARNING_TRANSLATION:{
  get:()=>null,html:()=>'<p>Original meaning</p>',sourceLine:()=> 'Original source'
 },
 state:{learningProfile:'teen'},
 MutationObserver:class{observe(){}disconnect(){}}
};
try{
 const api=await installGermanProductionUI({manifest:approved,documentRef:doc,win});
 assert.equal(api.scope,'review-gated-production');
 assert.equal(api.stats().entries,1452);
 const first=win.DEEN_GERMAN_QURAN_MEANINGS.get('fatiha',1);
 assert.equal(first?.text,quran.translations['fatiha:1'].text);
 assert.equal(first.language,'de');
 assert.match(win.DEEN_QURAN_LEARNING_TRANSLATION.html(
  win.DEEN_QURAN_CONTENT.getAyah('fatiha',1)),/DEUTSCHE BEDEUTUNG/);
 for(const row of audioManifest.entries)
  assert.equal(win.DEEN_GERMAN_QURAN_MEANINGS.get(row.surahId,row.ayah)?.text,
   quran.translations[row.key].text,'Wrong Quran identity: '+row.key);
 assert.equal(win.DEEN_GERMAN_QURAN_MEANINGS.get('fatiha',999),null);
 assert.equal(win.DEEN_GERMAN_QURAN_MEANINGS.get('not-a-surah',1),null);
 assert.equal(listeners.has('deen:question-graded'),true);
 listeners.get('deen:question-graded')({detail:{question:source,correct:false}});
 assert.equal(feedbackTitle.textContent,'Gemeinsam verbessern');
 assert.match(feedbackText.textContent,/Richtige Antwort: ja/);
 assert.match(feedbackText.textContent,/Geprüfte Erklärung/);
 assert.equal(m.languages.de.question_data,'missing');
 console.log(JSON.stringify({result:'passed',scope:'synthetic-reviewed-manifest-in-memory',
  released:false,quranSources:audioByKey.size,uiKeys:api.stats().entries,
  feedback:'correct_answer_source_matched',other_languages_unchanged:true},null,2));
}finally{
 globalThis.fetch=originalFetch;
 Object.defineProperty(globalThis,'crypto',{value:originalCrypto,configurable:true});
}
