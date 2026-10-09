/* DOM/logic tests; these do not claim to be Chrome integration tests.
   Install jsdom separately; set DEEN_JSDOM_MODULE to its package entry if needed. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {JSDOM}=require(process.env.DEEN_JSDOM_MODULE||'jsdom');
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFileSync(root+p,'utf8');
const seg=n=>read('release/v9.9.3-direct/segment-'+String(n).padStart(2,'0')+'.txt');
const base=JSON.parse(Array.from({length:7},(_,i)=>seg(i+2)).join('').replace(/^const QUESTIONS=/,'').trim().replace(/;$/,''));
const live=JSON.parse(read('assets/i18n/questions/ar/runtime/U01.live.json'));
const liveSources=Object.entries(live.translations).map(([id,t])=>({id,stage_id:'U01-S01',question_tr:t.source_question_tr,activity_type:t.activity_type,options_tr:t.source_options_tr,correct_answer:t.source_correct_answer_tr,pairs:t.source_pairs_tr,items:t.source_items_tr,correct_order:t.source_correct_order_tr}));
// Runtime-source fixtures from the source guards; actual game rendering still needs Chrome QA.
const active=base.filter(q=>!q.id.startsWith('DEEN-U01-')).concat(liveSources);
assert.equal(active.length,1484);
const premium=seg(24).match(/<script id="deen-v998-premium-onboarding-js">([\s\S]*?)<\/script>/)[1];
function fixture(stored={}){
 const dom=new JSDOM('<!doctype html><html><head></head><body><div class="phone"></div><div id="lesson"></div><div id="v5SheetTitle">Ayarlar</div><div id="v5SheetBody"></div></body></html>',{url:'https://deen.test/',runScripts:'dangerously',pretendToBeVisual:true});
 const w=dom.window;for(const [k,v]of Object.entries(stored))w.localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v));
 w.state={onboarded:false,profile:{name:'Yolcu',companion:null},settings:{},xp:321,completed:['U02-S03'],badges:['retained'],mistakes:[],learningProfile:'teen',minutes:10,dailyGoal:2,quranJourney:{quizLocale:'tr'}};
 w.saveState=()=>w.localStorage.setItem('deen_v4_1_state',JSON.stringify(w.state));w.updateUI=()=>{};w.scrollToCurrent=()=>{};w.toast=()=>{};w.sheet=()=>{};
 w.QUESTIONS=active;w.DEEN_BASE_QUESTIONS=base;w.__DEEN_CONTENT_MANIFEST__=JSON.parse(read('assets/i18n/content-support.json'));
 w.fetch=async url=>({ok:true,json:async()=>JSON.parse(read(String(url).split('?')[0].replace(/^\.\//,'')))});
 w.eval(read('assets/i18n/locale.js'));w.eval(read('assets/i18n/content.js'));
 w.eval(seg(66).match(/<script id="deen-v91223-arabic-fullbank-js">([\s\S]*?)<\/script>/)[1]);
 w.eval(read('assets/i18n/boot.js'));w.eval(premium);return dom;
}
const report={kind:'DOM and logic; not Chrome',languages:{},migration:[],guards:[]};
for(const lang of ['tr','ar','en','de','es','fr']){
 const d=fixture(),w=d.window;
 let chosen=null;w.DEEN_I18N.showGate(id=>{chosen=id;w.DEEN_APP_LOCALE.commit(id);});
 assert.equal(w.document.querySelectorAll('[data-locale]').length,6);assert(w.document.querySelector('.deen-language-continue').disabled);
 assert.equal(w.document.querySelectorAll('.v9912-authbtn').length,0);
 w.document.querySelector('[data-locale="'+lang+'"]').click();
 assert.equal(w.document.querySelector('#deenLanguageGate').lang,lang);assert.equal(w.document.querySelector('#deenLanguageGate').dir,lang==='ar'?'rtl':'ltr');
 assert.equal(w.document.querySelector('#deenLanguageGate h1').textContent,w.DEEN_I18N.t('languageTitle',{},lang));
 assert.equal(w.document.querySelector('.deen-language-continue').textContent,w.DEEN_I18N.t('next',{},lang));
 w.document.querySelector('.deen-language-continue').click();assert.equal(chosen,lang);
 assert.equal(w.localStorage.getItem('deen_app_language_v1'),lang);assert.equal(w.document.documentElement.lang,lang);
 for(const key of w.DEEN_I18N.keys())assert(w.DEEN_I18N.t(key,{n:2},lang).length>0);
 w.state.settings.onboardingLanguageConfirmed=true;
 const screens=[];
 for(let step=0;step<=5;step++){
  w.DEEN_PREMIUM_ONBOARDING.render(step);const el=w.document.getElementById('v998Onboarding');assert.equal(el.lang,lang);assert(w.document.querySelector('.phone').inert);
  const visible=el.textContent;assert(!/Google ile|Apple ile|E-posta ile/.test(visible));
  if(lang!=='tr')assert(!/Yol arkadaşını|Kaplumbağa|Günlük hedef|Sana nasıl|Kısa, sade/.test(visible),lang+':'+step);
  if(step===3){assert.equal(el.querySelectorAll('[data-animal]').length,6);for(const card of el.querySelectorAll('[data-animal]'))assert.equal(card.querySelector('b').textContent,w.DEEN_I18N.t(card.dataset.animal));}
  screens.push({step,title:el.querySelector('h1').textContent,text:visible});
 }
 const progressBefore=JSON.stringify({xp:w.state.xp,completed:w.state.completed,badges:w.state.badges});
 w.state.profile.companion='cat';w.DEEN_PREMIUM_ONBOARDING.finish();
 // finish() is intentionally asynchronous; explicitly await the same in-flight validation.
 const ready=await w.DEEN_BOOT.prepare();
 if(['tr','ar'].includes(lang)){assert(ready);assert(w.state.onboarded);assert(!w.document.getElementById('v998Onboarding'));assert(!w.document.querySelector('.phone').inert);}
 else{assert(!ready);assert(!w.state.onboarded);assert.equal(w.DEEN_BOOT.status().phase,'blocked');assert(w.document.getElementById('deenPreparation').textContent.includes(w.DEEN_I18N.t('unavailableTitle')));assert.equal(w.DEEN_CONTENT_LOCALE.translateQuestion(base[0],lang),null);}
 assert.equal(JSON.stringify({xp:w.state.xp,completed:w.state.completed,badges:w.state.badges}),progressBefore);
 report.languages[lang]={entry:'PASS DOM',onboarding:'PASS DOM',preparation:ready?'PASS data verification':'BLOCKED missing question pack',screens};d.window.close();
}
for(const key of ['deen_v4_1_state','deen_v57_last_good_state']){
 const saved={onboarded:true,settings:{language:'ar'},xp:777,completed:['U15-S07'],profile:{companion:'owl'}};
 const d=fixture({[key]:saved});assert.equal(d.window.DEEN_APP_LOCALE.get(),'ar');assert(d.window.DEEN_I18N.hasPreference());assert.equal(d.window.localStorage.getItem(key),JSON.stringify(saved));report.migration.push({key,result:'PASS no storage overwrite on import'});d.window.close();
}
{
 const d=fixture(),w=d.window;w.DEEN_APP_LOCALE.commit('tr');w.state.onboarded=true;
 w.document.getElementById('lesson').classList.add('active');assert.equal(await w.DEEN_APP_LOCALE.set('ar'),false);assert.equal(w.DEEN_APP_LOCALE.get(),'tr');
 w.document.getElementById('lesson').classList.remove('active');assert.equal(await w.DEEN_APP_LOCALE.set('de'),false);assert.equal(w.DEEN_APP_LOCALE.get(),'tr');
 assert.equal(await w.DEEN_APP_LOCALE.set('ar'),true);assert.equal(w.state.quranJourney.quizLocale,'ar');assert.equal(await w.DEEN_APP_LOCALE.set('tr'),true);assert.equal(w.state.quranJourney.quizLocale,'tr');
 const saved=JSON.parse(w.localStorage.getItem('deen_v4_1_state'));assert.equal(saved.xp,321);assert.deepEqual(saved.completed,['U02-S03']);assert.deepEqual(saved.badges,['retained']);
 report.guards.push('PASS active lesson rejects changes without closing','PASS missing language retains previous locale','PASS ar/tr switch preserves progress and Quran locale');d.window.close();
}
{
 const d=fixture(),w=d.window;
 const source={id:'sample',activity_type:'multiple_choice',question_tr:'Soru',explanation_tr:'Açıklama',options_tr:['bir','iki'],correct_answer:'iki'};
 const entry={source:structuredClone(source),display:{question_tr:'Question',explanation_tr:'Explanation',options_tr:['one','two'],correct_answer:'two'}};
 assert(w.DEEN_CONTENT_LOCALE.validate(source,entry));assert(!w.DEEN_CONTENT_LOCALE.validate(source,{...entry,display:{...entry.display,correct_answer:'one'}}));assert(!w.DEEN_CONTENT_LOCALE.validate({...source,explanation_tr:'changed'},entry));
 report.guards.push('PASS changed source rejected','PASS wrong answer position rejected');d.window.close();
}
if(process.env.DEEN_QA_OUTPUT){mkdirSync(process.env.DEEN_QA_OUTPUT,{recursive:true});writeFileSync(process.env.DEEN_QA_OUTPUT+'/global-locale-dom.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({...report,languages:Object.fromEntries(Object.entries(report.languages).map(([k,v])=>[k,{...v,screens:v.screens.length}]))},null,2));
