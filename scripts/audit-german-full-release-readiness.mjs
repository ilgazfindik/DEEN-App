/* Full German rollout inventory. This is a readiness AUDIT, not release approval.
 * Green CI means safety gates hold; "deploy_allowed" is independently false.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const text=p=>readFileSync(root+p,'utf8');
const english=read('assets/i18n/english-ui.draft.json').translations;
const layerPaths=[
 'assets/i18n/german-ui.staging.json',
 'assets/i18n/german-ui.lesson-flow.staging.json',
 'assets/i18n/german-ui.premium-shop.staging.json',
 'assets/i18n/german-ui.quran-controls.staging.json',
 'assets/i18n/german-ui.reference-batch-01.staging.json'
];
const dictionaries=layerPaths.map(p=>read(p));
const merged=new Map(),conflicts=[],byLayer=[];
for(let i=0;i<dictionaries.length;i++){
 const layer=dictionaries[i];
 assert.equal(layer.locale,'de');
 assert.equal(layer.translation_count,Object.keys(layer.translations).length);
 assert.equal(layer.release_ready,false,'Translation layer needs explicit expert and native review: '+layerPaths[i]);
 for(const [key,value] of Object.entries(layer.translations)){
  assert(typeof key==='string'&&key.trim()&&typeof value==='string'&&value.trim(),'Empty German UI entry: '+key);
  if(merged.has(key)&&merged.get(key)!==value)conflicts.push({key,previous:merged.get(key),next:value});
  merged.set(key,value);
 }
 byLayer.push({path:layerPaths[i],entries:layer.translation_count});
}
assert.equal(conflicts.length,0,'Conflicting German translations for the same Turkish source label');
const baseline=Object.keys(english);
const overlap=baseline.filter(key=>merged.has(key)),notCovered=baseline.filter(key=>!merged.has(key));
assert.equal(notCovered.length,730,'The first 120 explicitly reviewed German UI reference keys must remain present; unexpected source/catalog drift');
const stagedOnly=[...merged.keys()].filter(key=>!Object.hasOwn(english,key));
const manifest=read('assets/i18n/content-support.json'),german=manifest.languages.de;
const quran=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const originals=read('assets/quran/audio/ayah-audio-manifest.json');
const boot=text('assets/i18n/boot.js'),locale=text('assets/i18n/locale.js'),englishPresenter=text('assets/i18n/english-ui.js');
assert.equal(manifest.required_base_questions,1500);
assert.equal(manifest.required_live_u01_questions,84);
assert.equal(manifest.required_runtime_variants,20);
assert.equal(german.question_data,'missing','Incomplete German may not be activated');
assert.equal(german.global_qa,'blocked','German rollout QA cannot be approved without full UI and religious reviews');
assert.equal(german.religious_expert_approved,false);
assert.equal(german.parts,undefined,'The staged German questions must not be included in the live manifest');
assert.equal(quran.ayah_count,90);
assert.equal(Object.keys(quran.translations).length,90);
assert.equal(originals.ayahCount,90);
assert.equal(quran.release_ready,false);
assert.equal(quran.expert_approved,false);
assert.equal(quran.native_reviewer_approved,false);
assert.equal(quran.rights_reviewed,false);
assert(boot.includes("window.DEEN_I18N.t('unavailableTitle',{},next)"),'Changing to German must show German, not Turkish, blocked-language message');
assert(locale.includes("Die deutschen Lerninhalte werden noch geprüft."),'German block explanation must be accurate');
assert(!englishPresenter.includes('window.DEEN_GERMAN_UI'),'English renderer must not implicitly load staging German into production');
const issues=[
 {code:'DE_UI_BASELINE_GAPS',severity:'blocking',count:notCovered.length,details:'English UI reference keys not found in the four staged German dictionaries'},
 {code:'DE_UI_RENDERER_NOT_CONNECTED',severity:'blocking',details:'The app calls the English/Arabic UI renderers; staged German UI maps are not a production renderer'},
 {code:'DE_QUESTIONS_UNRELEASED',severity:'blocking',details:'All German question content and runtime variants are staging only, with pending religious and native review'},
 {code:'DE_QURAN_MEANINGS_UNAPPROVED',severity:'blocking',details:'90 German Quran meanings have source matching but no religious, native-language or rights approval'},
 {code:'DE_BROWSER_E2E_UNVERIFIED',severity:'blocking',details:'No completed German-language live Chrome onboarding/home/lesson/Quran/profile regression on the current release'}
];
console.log(JSON.stringify({
 status:'blocked_pending_review',locale:'de',safe_to_deploy_full_german:false,
 baseline_english_ui_reference:baseline.length,staged_german_ui_translations:merged.size,
 covered_english_reference_keys:overlap.length,missing_reference_keys:notCovered.length,
 additional_german_ui_keys_outside_reference:stagedOnly.length,
 layers:byLayer,missing_key_examples:notCovered.slice(0,80),
 content:{base_question_drafts:1500,active_question_source_count:1484,other_runtime_variants:20,original_quran_ayahs:originals.ayahCount,german_meaning_drafts:quran.ayah_count},
 regression:{untranslated_content_fallback_prevented:true,german_failure_message_localized:true,approved_quran_meanings:0},
 issues
},null,2));
