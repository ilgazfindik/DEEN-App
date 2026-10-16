/* DEEN Arabic letter-name audio, staging registry.
   Isolated letter names are distinct from harakat, syllables and Qur'an recitation.
   A clip stays disabled until usage rights and pronunciation review are approved. */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_LETTER_AUDIO)return;
 const dir='assets/quran/audio/arabic-learning/';
 const source=[
  ['qaf','ق','f5e323cd23f6c1725de0b694c0d061003c0569b057bf8086efb33dd024d1063e'],
  ['ya','ي','b98cfe25d3d6ddd3cb525fd1eda06e8a5e5eb06764ece412371e164cc59fb30c'],
  ['waw','و','47cbf2d10c24ea1c03f55607d592a0e0777dbacd731936fb284ef16984c0aa50'],
  ['ha','ه','42bbc55bac3a7dce004102ab4368195c4ef6767bdc07818e3985292bb78351c3'],
  ['nun','ن','38ed887bb98a24b6d9a1e4ae58dee7c4c7c1fc6843cc0423ee8cc72731f83bb3'],
  ['mim','م','2f3b88ebfd5341a7a8de8024679aa6d9fac0ff8ad2bb89a6b8bf5c774fae9451'],
  ['lam','ل','3534dc61d69e0fc9fca10866136bcefe0053e2a56b754af80818ab2e77812a17'],
  ['kaf','ك','da2a7ef224becaaa526bccb8e9f7e56f69ecdff62a143ccba3fda774dc81fc5a']
 ];
 const records=Object.freeze(Object.fromEntries(source.map(([id,glyph,sha256])=>[id,Object.freeze({
  id,glyph,file:dir+'letter-'+id+'.mp3',sha256,
  origin:'user-supplied ElevenLabs',rights:'pending',pronunciation:'pending'
 })])));
 const labels=Object.freeze({
  tr:['Dinle','Ses doğrulaması bekleniyor'],
  en:['Listen','Audio awaiting review'],
  ar:['استمع','الصوت قيد المراجعة'],
  de:['Anhören','Audio wird geprüft'],
  fr:['Écouter','Audio en cours de vérification']
 });
 const label=(locale,ready)=>(labels[locale]||labels.tr)[ready?0:1];
 const hasClip=id=>Object.prototype.hasOwnProperty.call(records,id);
 const available=id=>{
  const r=records[id],letter=window.DEEN_ARABIC_LETTERS?.get?.(id);
  return !!r&&r.rights==='approved'&&r.pronunciation==='approved'&&
   letter?.glyph===r.glyph&&/^[a-f0-9]{64}$/.test(r.sha256);
 };
 let current=null;
 function stop(){
  if(!current)return;
  const a=current;current=null;
  a.pause();a.removeAttribute('src');a.load();
 }
 function play(id){
  if(!available(id)||typeof Audio!=='function')return false;
  stop();
  const r=records[id];
  const url=new URL('./'+r.file,document.baseURI);
  if(url.origin!==location.origin||!url.pathname.startsWith(new URL('./'+dir,document.baseURI).pathname))return false;
  const sound=new Audio(url.href);sound.preload='none';sound.volume=1;
  current=sound;
  sound.addEventListener('ended',()=>{if(current===sound)stop()},{once:true});
  sound.addEventListener('error',()=>{if(current===sound)stop()},{once:true});
  const pending=sound.play();
  if(pending?.catch)pending.catch(()=>{if(current===sound)stop()});
  return true;
 }
 window.addEventListener?.('pagehide',stop);
 window.DEEN_ARABIC_LETTER_AUDIO=Object.freeze({
  version:1,records,hasClip,available,label,play,stop,
  pendingCount:()=>Object.keys(records).filter(id=>!available(id)).length
 });
})();
