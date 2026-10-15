/* DEEN Arabic Learning Phase 6: review-gated listening curriculum.
   No audio becomes playable without explicit rights, recitation review and SHA-256.
   Existing surah audio is NOT implicitly approved for isolated pronunciation. */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_LISTENING)return;
 const item=(id,glyph,clipId)=>Object.freeze({id,glyph,clipId});
 const lessons=Object.freeze([
  Object.freeze({id:'arabic-listen-syllables-01',index:16,kind:'listen-syllable',items:Object.freeze([
   item('listen-ba-fatha','بَ','syllable-ba-fatha'),
   item('listen-ba-kasra','بِ','syllable-ba-kasra'),
   item('listen-ba-damma','بُ','syllable-ba-damma')
  ])}),
  Object.freeze({id:'arabic-listen-words-01',index:17,kind:'listen-word',items:Object.freeze([
   item('listen-qul','قُلْ','word-qul'),
   item('listen-huwa','هُوَ','word-huwa'),
   item('listen-lam','لَمْ','word-lam')
  ])})
 ]);
 const ids=lessons.flatMap(x=>x.items.map(y=>y.clipId));
 // Deliberately fail-closed. Update entries only after independent checks,
 // and store review evidence alongside each reviewed recording.
 const records=Object.freeze(Object.fromEntries(ids.map(id=>[id,Object.freeze({
  state:'pending-review',file:null,sha256:null,reciter:null,
  rights:{state:'unverified',evidence:null},
  pronunciation:{state:'pending',reviewRef:null}
 })])));
 const safe=(record)=>{
  if(!record||record.state!=='approved'||typeof record.file!=='string')return false;
  if(!/^assets\/quran\/audio\/arabic-learning\/[a-z0-9][a-z0-9/_-]*\.mp3$/.test(record.file))return false;
  if(!/^[a-f0-9]{64}$/.test(String(record.sha256||'')))return false;
  if(typeof record.reciter!=='string'||record.reciter.trim().length<3)return false;
  if(record.rights?.state!=='approved'||typeof record.rights.evidence!=='string'||record.rights.evidence.trim().length<8)return false;
  if(record.pronunciation?.state!=='approved'||typeof record.pronunciation.reviewRef!=='string'||record.pronunciation.reviewRef.trim().length<8)return false;
  return true;
 };
 const clipReady=id=>ids.includes(id)&&safe(records[id]);
 const lessonReady=id=>{
  const lesson=lessons.find(x=>x.id===id);
  return !!lesson&&lesson.items.every(x=>clipReady(x.clipId));
 };
 let audio=null,blobUrl=null,controller=null,seq=0;
 function stop(){
  seq++;
  if(controller){controller.abort();controller=null}
  if(audio){audio.pause();audio.removeAttribute('src');audio.load();audio=null}
  if(blobUrl){URL.revokeObjectURL(blobUrl);blobUrl=null}
 }
 async function play(id){
  stop();
  if(!clipReady(id)||!window.crypto?.subtle)return false;
  const record=records[id],turn=seq;
  try{
   const url=new URL('./'+record.file,document.baseURI);
   const folder=new URL('./assets/quran/audio/arabic-learning/',document.baseURI);
   if(url.origin!==location.origin||!url.pathname.startsWith(folder.pathname))return false;
   controller=new AbortController();
   const requestController=controller;
   const response=await fetch(url.href,{credentials:'same-origin',cache:'no-store',signal:requestController.signal});
   if(!response.ok||turn!==seq)return false;
   const data=await response.arrayBuffer();
   if(data.byteLength<128||data.byteLength>2000000||turn!==seq)return false;
   const digest=await crypto.subtle.digest('SHA-256',data);
   const hash=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
   if(hash!==record.sha256||turn!==seq)return false;
   const objectUrl=URL.createObjectURL(new Blob([data],{type:'audio/mpeg'}));
   if(turn!==seq){URL.revokeObjectURL(objectUrl);return false}
   blobUrl=objectUrl;
   audio=new Audio(objectUrl);audio.preload='none';audio.volume=1;
   audio.addEventListener('ended',()=>{if(turn===seq)stop()},{once:true});
   await audio.play();
   if(turn!==seq){stop();return false}
   return true;
  }catch(_){if(turn===seq)stop();return false}
  finally{if(turn===seq)controller=null}
 }
 window.DEEN_ARABIC_LISTENING=Object.freeze({
  version:1,startIndex:16,lessonCount:2,lessons,records,
  approvedCount:()=>ids.filter(clipReady).length,
  requiredCount:ids.length,isRecordApproved:safe,clipReady,lessonReady,play,stop,
  audioStatus:'pending-independent-rights-and-recitation-review'
 });
})();
