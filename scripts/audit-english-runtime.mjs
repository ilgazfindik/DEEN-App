/* Runtime guards, grading structure and language residue; no expert-approval claim. */
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const fixture=read('assets/i18n/questions/en/runtime/source-fixture.json');
const w={DEEN_APP_LOCALE:{get:()=> 'en'}};vm.runInNewContext(readFileSync(root+'assets/i18n/content.js','utf8'),{window:w});
const strings=v=>typeof v==='string'?[v]:Array.isArray(v)?v.flatMap(strings):v&&typeof v==='object'?Object.values(v).flatMap(strings):[];
const report={locale:'en',live:0,variants:0,issues:[],religious_expert_approved:0,native_reviewer_approved:0};
for(const [name,file,expected] of [['live','U01.live.json',84],['variants','U01.variants.json',20]]){
 const pack=read('assets/i18n/questions/en/runtime/'+file);
 assert.equal(pack.locale,'en');assert.equal(pack.release_ready,false);assert.equal(pack.expert_approved,false);
 assert.equal(Object.keys(pack.translations).length,expected);assert.equal(fixture[name].length,expected);
 for(const q of fixture[name]){
  const e=pack.translations[q.id],start=report.issues.length;
  if(!w.DEEN_CONTENT_LOCALE.validate(q,e))report.issues.push(q.id+':source_or_grading_guard');
  if(q.options_tr&&new Set(e.display.options_tr).size!==q.options_tr.length)report.issues.push(q.id+':option_uniqueness');
  const blanks=s=>JSON.stringify(String(s).match(/_{2,}|\[\s*\]|\{blank\}/g)||[]);
  if(blanks(q.question_tr)!==blanks(e.display.question_tr))report.issues.push(q.id+':blank_structure');
  for(const s of strings(e.display))if(/[ÇĞİÖŞÜçğıöşü\u0600-\u06ff]/.test(s)||/\b(?:Doğru|Yanlış|ibadet|ahlak|kulluk|Peygamber)\b/i.test(s))report.issues.push(q.id+':language_residue:'+s);
  if(report.issues.length===start)report[name]++;
 }
}
console.log(JSON.stringify(report,null,2));
if(process.env.DEEN_QA_OUTPUT){mkdirSync(process.env.DEEN_QA_OUTPUT,{recursive:true});writeFileSync(process.env.DEEN_QA_OUTPUT+'/english-runtime-audit.json',JSON.stringify(report,null,2));}
assert.deepEqual(report.issues,[]);assert.equal(report.live,84);assert.equal(report.variants,20);
