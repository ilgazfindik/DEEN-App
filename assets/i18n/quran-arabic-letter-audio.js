/* DEEN Arabic letter-name audio preview (8 user-provided clips).
   Names are distinct from harakat / syllables / Quran recitation.
   The creator declares ownership and confirms the pronunciations (2026-10-16).
   These recordings are exposed as owner-confirmed previews, NOT independently
   audited Arabic pronunciation. Harakat and Quran recitation are out of scope. */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_LETTER_AUDIO)return;
 const dir='assets/quran/audio/arabic-learning/';
 const raw=[["qaf","ق","33b3a9704a87d7075248f77822fff216b1bb74ee51e6ac80f1587c806385a624",6140],["ya","ي","f4cd5b95fa6207aef0fd73a4cb61e9c3016639d4e6744dcc11b5487b2a59b0d4",6572],["waw","و","cc81783771746bde4a86ba25f8379c1346791c4995bde11c9ee0a399d920977f",6572],["ha","ه","859d7fd8c616a0a7adbd6df4ffd5cea3a15846a74148b9eee4fa9a1a630dd79f",6140],["nun","ن","ffcccfc871f0f34877b7250f2a8ac97724f8aae38d2479d5fade2167c7a47877",5564],["mim","م","9380acdb41fb3e5080fba3aacbfe0ecc6a8c7e92565e23a055dfc61161c24802",6572],["lam","ل","942a2b70d856186b732bea06bcc0a7874eb95b2f09beec947082f0e7f56cceab",6140],["kaf","ك","6c772446c6af3542f7b72dbd03f813eac4c6eaaf9fb6759783a23cff6f036abc",5564]];
 const records=Object.freeze(Object.fromEntries(raw.map(([id,glyph,sha256,size])=>[id,Object.freeze({
  id,glyph,file:dir+'letter-'+id+'.mp3',sha256,size,
  origin:'user-provided ElevenLabs export',
  rights:'owner-attested',
  pronunciation:'creator-confirmed',
  rightsEvidence:'owner-declaration-2026-10-16',
  creatorConfirmation:'creator-pronunciation-confirmation-2026-10-16',
  pronunciationReviewRef:null
 })])));
 const labels=Object.freeze({
  tr:['Dinle · Önizleme','Telaffuz onayı bekleniyor'],
  en:['Listen · Preview','Awaiting pronunciation review'],
  ar:['استمع · معاينة','بانتظار مراجعة النطق'],
  de:['Anhören · Vorschau','Ausspracheprüfung ausstehend'],
  fr:['Écouter · Aperçu','Prononciation à vérifier']
 });
 const label=(locale,ready)=>(labels[locale]||labels.tr)[ready?0:1];
 const hasClip=id=>Object.prototype.hasOwnProperty.call(records,id);
 const approved=id=>{
  const r=records[id];
  return !!r&&r.pronunciation==='approved'&&r.rights==='owner-attested'&&
   typeof r.rightsEvidence==='string'&&r.rightsEvidence.trim().length>=12&&
   typeof r.pronunciationReviewRef==='string'&&r.pronunciationReviewRef.trim().length>=12;
 };
 // User-authorized previews are permitted in production; this must not
 // be mistaken for independent phonetic approval. Local QA can additionally
 // preview as-yet-unreviewed clips, but their state is recorded explicitly.
 const previewHost=['localhost','127.0.0.1','[::1]'].includes(String(location.hostname||'').toLowerCase());
 const available=id=>{
  const r=records[id],letter=window.DEEN_ARABIC_LETTERS?.get?.(id);
  const creatorPreview=!!r&&r.rights==='owner-attested'&&r.pronunciation==='creator-confirmed'&&
   r.rightsEvidence==='owner-declaration-2026-10-16'&&
   r.creatorConfirmation==='creator-pronunciation-confirmation-2026-10-16';
  return !!r&&(approved(id)||creatorPreview||(previewHost&&r.rights==='owner-attested'&&r.pronunciation==='pending-review'))&&
   letter?.glyph===r.glyph&&r.size>512&&r.size<300000&&
   /^[a-f0-9]{64}$/.test(r.sha256)&&/^assets\/quran\/audio\/arabic-learning\/letter-[a-z]+\.mp3$/.test(r.file);
 };
 let current=null;
 function stop(){
  if(!current)return;
  const sound=current;current=null;
  try{sound.pause();sound.removeAttribute('src');sound.load()}catch(_){}
 }
 function play(id){
  if(!available(id)||typeof Audio!=='function')return false;
  const record=records[id];
  let url,folder;
  try{
   url=new URL('./'+record.file,document.baseURI);
   folder=new URL('./'+dir,document.baseURI);
   if(url.origin!==location.origin||!url.pathname.startsWith(folder.pathname))return false;
  }catch(_){return false}
  stop();
  try{
   // play() runs directly in a user click handler, preserving mobile autoplay permission.
   const sound=new Audio(url.href);
   sound.preload='auto';sound.volume=1;current=sound;
   sound.addEventListener('ended',()=>{if(current===sound)stop()},{once:true});
   sound.addEventListener('error',()=>{if(current===sound)stop()},{once:true});
   const playing=sound.play();
   if(playing?.catch)playing.catch(()=>{if(current===sound)stop()});
   return true;
  }catch(_){stop();return false}
 }
 // Stop isolated letter previews when a phone locks or the web app backgrounds.
 // This does not interrupt the independent surah recitation player.
 document.addEventListener?.('visibilitychange',()=>{if(document.hidden)stop()});
 window.addEventListener?.('pagehide',stop);
 window.DEEN_ARABIC_LETTER_AUDIO=Object.freeze({
  version:2,records,hasClip,available,approved,label,play,stop,
  pendingCount:()=>Object.keys(records).filter(id=>!approved(id)).length,
  creatorConfirmedCount:()=>Object.keys(records).filter(id=>records[id].pronunciation==='creator-confirmed').length,
  previewCount:()=>Object.keys(records).filter(available).length,
  releaseStatus:'owner-confirmed-preview;independent-review-pending'
 });
})();
