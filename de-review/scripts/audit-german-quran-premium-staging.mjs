/* Staging-only German Quran and Premium UI audit.
 * Verifies exact source keys from English presentation; does not release content.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const manifest=read('assets/i18n/content-support.json');
assert.equal(manifest.languages.de.question_data,'missing');
assert.equal(manifest.languages.de.global_qa,'blocked');
assert.equal(manifest.languages.de.religious_expert_approved,false);
assert(!manifest.languages.de.parts?.length&&!manifest.languages.de.bank);
const sourceDraft=read('assets/i18n/english-ui.draft.json').translations;
const englishCode=readFileSync(root+'assets/i18n/english-ui.js','utf8');
const boundary='const SCREENSHOT_PRIORITY=';
assert(englishCode.includes(boundary));
const englishDict=vm.runInNewContext(englishCode.slice(0,englishCode.indexOf(boundary))+'return D;\n})()',{}, {timeout:2500});
const primary=read('assets/i18n/german-ui.staging.json');
const lesson=read('assets/i18n/german-ui.lesson-flow.staging.json');
const quran=read('assets/i18n/german-ui.quran-controls.staging.json');
const premium=read('assets/i18n/german-ui.premium-shop.staging.json');
const previous=[primary,lesson];
const totalPrevious=previous.reduce((n,x)=>n+Object.keys(x.translations).length,0);
assert.equal(totalPrevious,408);
const expected=[
 {pack:quran,count:143,scope:'quran_controls_ui_staging',
  groups:{quran_navigation:46,memorization_game:16,learning_memorization:49,surah_names:32}},
 {pack:premium,count:41,scope:'premium_shop_ui_staging',
  groups:{premium_options:25,shop_rewards:10,content_safeguards:6}}
];
const issues=[],sourceKeys=new Set(),groups={},numbers=str=>(String(str).match(/\d+(?:[.,]\d+)?/g)||[]).sort();
let validated=0;
for(const oldPack of previous)for(const k of Object.keys(oldPack.translations))sourceKeys.add(k);
for(const {pack,count,scope,groups:expectedGroups}of expected){
 assert.equal(pack.schema_version,1);
 assert.equal(pack.locale,'de');
 assert.equal(pack.scope,scope);
 assert.equal(pack.release_ready,false);
 assert.equal(pack.global_qa,'blocked');
 assert.equal(pack.verified_by_religious_expert,false);
 assert.equal(pack.native_reviewer_approved,false);
 const entries=Object.entries(pack.translations);
 assert.equal(entries.length,count);
 assert.equal(pack.translation_count,count);
 assert.deepEqual(Object.keys(pack.groups).sort(),Object.keys(expectedGroups).sort());
 const groupedKeys=new Set();
 for(const [g,n]of Object.entries(expectedGroups)){
  assert.equal(pack.groups[g].length,n,g+':count');
  groups[g]=n;
  for(const k of pack.groups[g]){
   if(groupedKeys.has(k))issues.push('duplicate_surface:'+k);
   groupedKeys.add(k);
  }
 }
 assert.equal(groupedKeys.size,count);
 for(const [key,value]of entries){
  if(sourceKeys.has(key))issues.push('cross_pack_collision:'+key);
  sourceKeys.add(key);
  if(!groupedKeys.has(key))issues.push('missing_surface:'+key);
  if(typeof value!=='string'||!value.trim()){issues.push('blank_german:'+key);continue}
  if(/[ÇĞİŞçğıış\u0600-\u06ff]/.test(value)||/\b(?:öğren|doğru|yanlış|ayarlar|devam|ezber|görev|mağaza|ayet|sureyi)\b/i.test(value))issues.push('Turkish_or_Arabic_leak:'+key);
  if(value===key&&!['Normal','Temel'].includes(key))issues.push('untranslated_key:'+key);
  if(JSON.stringify(numbers(key))!==JSON.stringify(numbers(value)))issues.push('number_mismatch:'+key+' -> '+value);
  if(/\\{[^}]+\\}/.test(key)&&!value.includes(key.match(/\\{[^}]+\\}/)[0]))issues.push('placeholder_missing:'+key);
  const expectedSource=scope==='premium_shop_ui_staging'?pack.sources[key]:pack.reference;
  if(scope==='premium_shop_ui_staging'&&!['assets/i18n/english-ui.js','assets/i18n/english-ui.draft.json'].includes(expectedSource))issues.push('source_ref_missing:'+key);
  if(expectedSource==='assets/i18n/english-ui.js'){
   if(!Object.hasOwn(englishDict,key))issues.push('runtime_source_not_found:'+key);
  }else if(expectedSource==='assets/i18n/english-ui.draft.json'){
   if(!Object.hasOwn(sourceDraft,key))issues.push('draft_source_not_found:'+key);
  }else issues.push('unknown_source_ref:'+key);
  validated++;
 }
}
assert.equal(quran.arabic_ayah_text_modified,false,'Arabic ayah text must not be modified');
assert.equal(quran.german_ayah_meanings_present,false,'German verse translation is NOT released');
assert.equal(premium.real_payments_integrated,false,'This project has no real Premium checkout integration in the staged translation');
assert.equal(sourceKeys.size,totalPrevious+143+41,'Must not double-count German UI translations');
const report={locale:'de',status:issues.length?'failed':'passed',staging_only:true,
 quran_ui_strings:143,premium_shop_ui_strings:41,new_ui_strings:184,
 total_staged_ui_strings:sourceKeys.size,
 groups,actual_source_keys_matched:validated,source_language_ui_reference:'en / original Turkish keys',
 arabic_ayah_text_modified:false,german_ayah_meanings_present:false,
 real_payments_integrated:false,release_ready:false,production_manifest:'blocked',issues};
console.log(JSON.stringify(report,null,2));
assert.deepEqual(issues,[]);
