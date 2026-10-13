/* German UI staging completeness and source-key audit. Does not enable German. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const source=read('assets/i18n/english-ui.draft.json').translations;
const stage=read('assets/i18n/german-ui.staging.json');
const manifest=read('assets/i18n/content-support.json');
assert.equal(manifest.languages.de.question_data,'missing','Do not enable German lessons before browser, Quran, expert QA');
assert.equal(manifest.languages.de.global_qa,'blocked','Do not mark German release ready');
assert.equal(manifest.languages.de.parts,undefined);
assert.equal(stage.schema_version,1);
assert.equal(stage.locale,'de');
assert.equal(stage.scope,'ui_staging');
assert.equal(stage.release_ready,false);
assert.equal(stage.global_qa,'blocked');
assert.equal(stage.verified_by_religious_expert,false);
assert.equal(stage.native_reviewer_approved,false);
assert.equal(stage.reference,'assets/i18n/english-ui.draft.json:translations');
const keys=Object.keys(stage.translations||{});
const sourceKeys=Object.keys(source);
assert.equal(stage.translation_count,keys.length);
assert.equal(sourceKeys.length,1087,'Reference changed: re-evaluate German UI coverage baseline');
const expectedGroups={navigation:48,lesson:37,quran_hub:35,quran_lesson:49,profile:42};
const groupIds=new Set(),issues=[];
for(const [name,count]of Object.entries(expectedGroups)){
 const group=stage.groups?.[name];
 assert(Array.isArray(group),name+':missing_group');
 assert.equal(group.length,count,name+':unexpected_count');
 for(const k of group){
  if(groupIds.has(k))issues.push(name+':duplicate_group_key:'+k);
  groupIds.add(k);
  if(!Object.hasOwn(stage.translations,k))issues.push(name+':missing_translation:'+k);
 }
}
assert.deepEqual(Object.keys(stage.groups).sort(),Object.keys(expectedGroups).sort());
assert.equal(groupIds.size,keys.length,'Every UI translation must have one owning surface');
const normalizeToken=s=>(String(s).match(/\{[^{}]+\}|%\d*[$]?[sd]|\d+(?:[.,]\d+)?/g)||[]).sort();
for(const key of keys){
 const value=stage.translations[key];
 if(!Object.hasOwn(source,key))issues.push('not_in_reference:'+key);
 if(typeof value!=='string'||!value.trim()){issues.push('empty:'+key);continue}
 if(/[\u0600-\u06ff]/u.test(value))issues.push('unexpected_arabic_script:'+key);
 if(/[ÇĞİŞçğıış]/.test(value)||/\b(?:yanlış|doğru|sadece|devam|geri|hatırla|cevap|öğren|ayetin|ayetler|öğrendim)\b/i.test(value))issues.push('turkish_residue:'+key);
 const [srcTokens,deTokens]=[normalizeToken(key),normalizeToken(value)];
 if(JSON.stringify(srcTokens)!==JSON.stringify(deTokens))issues.push('number_or_variable_mismatch:'+key+' '+srcTokens+' '+deTokens);
 if(value===key && key!=='Profil')issues.push('untranslated_identity:'+key);
}
const report={
 locale:'de',staging_only:true,source_ui_dictionary_keys:sourceKeys.length,
 translated_ui_dictionary_keys:keys.length,remaining_reference_keys:sourceKeys.length-keys.length,
 coverage_percent:Number((keys.length*100/sourceKeys.length).toFixed(1)),
 groups:Object.fromEntries(Object.entries(stage.groups).map(([g,values])=>[g,values.length])),
 release_ready:false,production_manifest:'blocked',issues
};
console.log(JSON.stringify(report,null,2));
assert.equal(issues.length,0,'German UI staging audit issues:\n'+issues.join('\n'));
