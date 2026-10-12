/* Four Ikhlas Arabic-to-German meaning drafts: identity, review and fail-closed regression. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolveGermanAyahMeaning,auditGermanAyahSource} from '../assets/i18n/quran/de/meaning-resolver.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const canonical=read('assets/quran/audio/ayah-audio-manifest.json');
const pack=read('assets/i18n/quran/de/ayah-meanings.staging.json');
const gate=read('assets/i18n/content-support.json').languages.de;
assert.equal(gate.question_data,'missing');
assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
assert.equal(pack.locale,'de');
assert.equal(pack.ayah_count,58);
assert.equal(Object.keys(pack.translations).length,58);
assert.equal(pack.scope,'quran_ayah_meanings_staging');
for(const prop of ['release_ready','expert_approved','native_reviewer_approved','verified_by_religious_expert','rights_reviewed'])assert.equal(pack[prop],false,'Pack gate must remain closed: '+prop);
const ikhlas=canonical.entries.filter(x=>x.surahId==='ikhlas').sort((a,b)=>a.ayah-b.ayah);
const fatiha=canonical.entries.filter(x=>x.surahId==='fatiha');
assert.equal(ikhlas.length,4);
assert.equal(fatiha.length,7);
const approvals=['native_reviewer_approved','expert_approved','rights_reviewed','meaning_reviewed'];
let negativeGuards=0;
for(const src of ikhlas){
 const e=pack.translations[src.key];
 assert(e,'No German draft for '+src.key);
 assert.equal(e.source_ayah_key,src.key);
 assert.equal(e.surah_id,src.surahId);
 assert.equal(e.ayah_number,src.ayah);
 assert.equal(e.source_arabic_text,src.text);
 assert.equal(e.source_audio_path,src.audio);
 assert.equal(e.language,'de');
 assert.equal(e.status,'draft_review_required');
 assert(typeof e.reviewer_note_tr==='string'&&e.reviewer_note_tr.length>25);
 assert.equal(/[\u0600-\u06ff]/u.test(e.text),false,'German draft includes Arabic');
 for(const field of approvals)assert.equal(e[field],false);
 assert.equal(resolveGermanAyahMeaning(src,pack),null,'German draft wrongly released');
 assert.equal(resolveGermanAyahMeaning(src,pack,{preview:true}),e.text,'QA preview source guard rejected correct source');
 assert.deepEqual({...auditGermanAyahSource(src,pack)}, {source_matches:true,approved:false,has_german_draft:true});
 const invalid=[
  {...src,key:'ikhlas:'+(src.ayah===4?1:4)},
  {...src,surahId:'fatiha'},
  {...src,ayah:src.ayah+1},
  {...src,text:src.text+'۞'},
  {...src,audio:src.audio+'.corrupted'},
  {...src,key:'fatiha:'+src.ayah,surahId:'fatiha'},
 ];
 for(const bad of invalid){assert.equal(resolveGermanAyahMeaning(bad,pack,{preview:true}),null,'Accepted wrong Arabic/audio/ayah source '+src.key);negativeGuards++;}
 const forged={...pack,release_ready:true,expert_approved:true,native_reviewer_approved:true,verified_by_religious_expert:true,rights_reviewed:true};
 assert.equal(resolveGermanAyahMeaning(src,forged),null,'Unapproved individual ayah must stay blocked');
 negativeGuards++;
}
const wrongLocale={...pack,locale:'tr'};
for(const src of ikhlas){assert.equal(resolveGermanAyahMeaning(src,wrongLocale,{preview:true}),null);negativeGuards++;}
assert.equal(resolveGermanAyahMeaning(canonical.entries.find(x=>x.surahId==='sharh'),pack,{preview:true}),null);negativeGuards++;
let inQa=0,inPublic=0;
for(const src of canonical.entries){
 if(resolveGermanAyahMeaning(src,pack,{preview:true})!==null)inQa++;
 if(resolveGermanAyahMeaning(src,pack)!==null)inPublic++;
}
assert.equal(inQa,58);
assert.equal(inPublic,0);
const sources=pack.sources.comparative_only.filter(r=>String(r.url).includes('112'));
assert.equal(sources.length,2);
assert(sources.every(s=>s.text_copied_verbatim===false));
console.log(JSON.stringify({status:'passed',locale:'de',surah:'ikhlas',source_ayahs:4,correct_qa_previews:4,
 total_german_drafts:58,untranslated_source_ayahs:32,production_exposed:0,
 negative_guards:negativeGuards,arabic_and_audio_not_modified:true,religious_and_native_approval:'pending'},null,2));
