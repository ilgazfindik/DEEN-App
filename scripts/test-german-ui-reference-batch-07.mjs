/* German UI remediation batch 07: verify 840/850 original missing
 * source keys, cross-layer uniqueness, meaning labels and closed release gates.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const reference=read('assets/i18n/english-ui.draft.json').translations;
const main=[
 'assets/i18n/german-ui.staging.json',
 'assets/i18n/german-ui.lesson-flow.staging.json',
 'assets/i18n/german-ui.premium-shop.staging.json',
 'assets/i18n/german-ui.quran-controls.staging.json'
];
const all=new Map();
for(const path of main){
 const pack=read(path);
 assert.equal(pack.locale,'de');
 for(const [key,value] of Object.entries(pack.translations)){
  if(all.has(key))assert.equal(all.get(key),value,'Conflicting original key: '+key);
  all.set(key,value);
 }
}
assert.equal(all.size,592);
const baseline=Object.keys(reference);
assert.equal(baseline.length,1087);
const originalMissing=baseline.filter(key=>!all.has(key));
assert.equal(originalMissing.length,850);
const batches=[...Array(7)].map((_,i)=>read('assets/i18n/german-ui.reference-batch-'+String(i+1).padStart(2,'0')+'.staging.json'));
for(const [index,pack] of batches.entries()){
 const code=String(index+1).padStart(2,'0');
 assert.equal(pack.schema_version,1);
 assert.equal(pack.batch,code);
 assert.equal(pack.locale,'de');
 assert.equal(pack.scope,'ui_reference_remediation_staging');
 assert.equal(pack.status,'translation_draft_requires_native_and_subject_expert_review');
 assert.equal(pack.translation_count,120);
 assert.equal(pack.release_ready,false);
 assert.equal(pack.global_qa,'blocked');
 assert.equal(pack.verified_by_religious_expert,false);
 assert.equal(pack.native_reviewer_approved,false);
 assert.equal(pack.rights_reviewed,false);
 assert.deepEqual(Object.keys(pack.translations),originalMissing.slice(index*120,(index+1)*120),
  'Reference ordering/source keys changed in pack '+code);
 assert.deepEqual(Object.keys(pack.reference_english),Object.keys(pack.translations));
 for(const [key,value] of Object.entries(pack.translations)){
  assert(!all.has(key),'Overlapping key from previous UI catalog: '+key);
  assert.equal(pack.reference_english[key],reference[key],'Changed reference gloss: '+key);
  assert(typeof value==='string'&&value.trim().length>0&&value!==key,'Missing German text: '+key);
  assert(!/[\u0600-\u06ff]/u.test(value),'Unexpected Arabic UI translation: '+key);
  all.set(key,value);
 }
 for(const key of pack.review_required_keys){
  assert(Object.hasOwn(pack.translations,key),'Unmapped review-required key: '+key);
 }
}
const b7=batches[6];
assert.equal(b7.review_required_keys.length,38);
assert.equal(b7.translations['Allah’a İman'],'Glaube an Allah');
assert.equal(b7.translations['İslam’ın Beş Şartı'],'Die fünf Säulen des Islam');
assert.equal(b7.translations['TÜRKÇE MEAL'],'TÜRKISCHE SINNÜBERSETZUNG');
assert.equal(b7.translations['Beyyine'],'Al-Bayyina');
assert.equal(b7.translations['SON ÜNİTE'],'LETZTE EINHEIT');
assert(/nicht bewertet/.test(b7.translations['Öğrenme oyunlaştırılır; ibadet puanlanmaz. Dinî içerikler uzman incelemesi bekler.']));
for(const [key,value] of Object.entries(b7.translations)){
 const expected=(reference[key].match(/\d+(?:[.,]\d+)*/g)||[]).join(',');
 const actual=(value.match(/\d+(?:[.,]\d+)*/g)||[]).join(',');
 assert.equal(actual,expected,'Numeric integrity: '+key);
 assert(!/[ıİğĞşŞ]/u.test(value),'Turkish-only diacritic in German draft: '+key);
}
assert.equal(all.size,1432);
assert.equal(baseline.filter(key=>all.has(key)).length,1077);
const remaining=baseline.filter(key=>!all.has(key));
assert.deepEqual(remaining,originalMissing.slice(840));
assert.equal(remaining.length,10);
assert.deepEqual(remaining,[
 'KISIM 1 FİNALİ','KİLİTLİ · USTALIK SINAVI','Temeller Ustalığı',
 'Geçerli mezhep farklılıkları yanlış cevap olarak puanlanmaz; bütün yeni içerikler uzman incelemesi bekler.',
 'Fâtiha','Felak','Nâs','Mâûn','İnşirah','Zilzâl'
]);
const g=read('assets/i18n/content-support.json').languages.de;
assert.equal(g.question_data,'missing');
assert.equal(g.global_qa,'blocked');
assert.equal(g.religious_expert_approved,false);
const quran=read('assets/i18n/quran/de/ayah-meanings.staging.json');
assert.equal(quran.ayah_count,90);
assert.equal(quran.release_ready,false);
assert.equal(quran.expert_approved,false);
assert.equal(quran.native_reviewer_approved,false);
assert.equal(quran.rights_reviewed,false);
console.log(JSON.stringify({status:'passed',batch:'07',new_keys:120,cumulative_remediated:840,
 remaining:10,staged_ui_labels:1432,reference_coverage:'1077/1087',
 religious_or_sensitive_review_keys:38,german_release:'blocked'},null,2));
