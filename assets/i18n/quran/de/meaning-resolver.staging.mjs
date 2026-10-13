/*
 * German Quran ayah meaning selector — staging module ONLY.
 * No import from the shipped application. Explicit source guards prevent
 * accidental Turkish/English fallback or wrong-ayah German display.
 *
 * Default behavior is fail-closed. Preview requires explicit preview=true and
 * is ONLY intended for local QA; production release requires all approvals.
 */
function sourceMatches(source,entry){
 if(!source||!entry||typeof source!=='object'||typeof entry!=='object')return false;
 const id=String(source.surahId||'')+':'+String(source.ayah||'');
 return source.key===id
  &&source.key===entry.source_ayah_key
  &&source.surahId===entry.surah_id
  &&source.ayah===entry.ayah_number
  &&typeof source.text==='string'
  &&source.text===entry.source_arabic_text
  &&typeof source.audio==='string'
  &&source.audio===entry.source_audio_path
  &&entry.language==='de'
  &&typeof entry.text==='string'
  &&!!entry.text.trim()
  &&!/[\u0600-\u06ff]/u.test(entry.text);
}
function releaseApproved(pack,entry){
 return pack.release_ready===true
  &&pack.expert_approved===true
  &&pack.native_reviewer_approved===true
  &&pack.verified_by_religious_expert===true
  &&pack.rights_reviewed===true
  &&entry.expert_approved===true
  &&entry.native_reviewer_approved===true
  &&entry.rights_reviewed===true
  &&entry.meaning_reviewed===true;
}
export function resolveGermanAyahMeaning(source,pack,{preview=false}={}){
 if(!pack||pack.schema_version!==1||pack.locale!=='de'||pack.scope!=='quran_ayah_meanings_staging')return null;
 if(!source||typeof source!=='object'||typeof source.key!=='string')return null;
 const entry=pack.translations?.[source.key];
 if(!sourceMatches(source,entry))return null;
 if(preview!==true&&!releaseApproved(pack,entry))return null;
 return entry.text;
}
export function auditGermanAyahSource(source,pack){
 const entry=pack?.translations?.[source?.key];
 return Object.freeze({
  source_matches:sourceMatches(source,entry),
  approved:!!entry&&!!pack&&releaseApproved(pack,entry),
  has_german_draft:typeof entry?.text==='string'&&!!entry.text.trim()
 });
}
