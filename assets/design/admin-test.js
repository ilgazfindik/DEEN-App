/* Admin test mode. A section in the admin panel (the P button, which is on the live site too) with one switch that opens every
   section for trying: the Learn path's locks (the panel's own "preview" switch), the Arabic path (letters, vowels,
   reading, words, meaning, ...), the reading-signs and letter-form units, the unit reviews and the surah path, with
   unlimited energy. Nothing is completed or erased: the switch only lifts the locks, and turns off again.
   Under it, one tap goes into each section, including the arena, the review and the progress screen.
   The locks ask window.DEEN_ADMIN_UNLOCK(); it answers true once the switch has been turned on in the panel. Like the
   panel's other switches (pass everything, open every lock) it only changes this device's own progress view. */
(()=>{
 'use strict';
 if(window.DEEN_ADMIN_TEST)return;
 // Not 'deen_admin_unlock_all': the production guard purges that name, and resets the Learn path's preview switch and
 // the premium flag on every load for about 6.5 s, so the mode is applied again after it has finished.
 const KEY='deen_admin_test_unlock',PREM='deen_admin_test_prev_premium';
 const stored=()=>{try{return localStorage.getItem(KEY)==='1'}catch(_){return false}};
 const on=()=>stored();
 window.DEEN_ADMIN_UNLOCK=on;

 function refresh(){
  try{window.DEEN_QURAN_PATHS?.refresh?.()}catch(_){}
  try{window.DEEN_QURAN_PATH?.remount?.()}catch(_){}
  try{renderPaths?.()}catch(_){}
  try{updateUI?.()}catch(_){}
 }
 // The Learn path's own preview switch and unlimited energy, set the way the panel sets them.
 function legacy(v){
  try{previewMode=!!v}catch(_){}
  try{
   if(v){
    try{if(localStorage.getItem(PREM)==null)localStorage.setItem(PREM,state.premium?'1':'0')}catch(_){}
    state.premium=true;state.energy=30;state.lastEnergyAt=Date.now();
   }else{
    let was='0';try{was=localStorage.getItem(PREM)||'0';localStorage.removeItem(PREM)}catch(_){}
    state.premium=was==='1'||!!window.DEEN_PREMIUM_ENTITLEMENT?.active;
   }
   saveState?.();
  }catch(_){}
 }
 function set(v){
  try{v?localStorage.setItem(KEY,'1'):localStorage.removeItem(KEY)}catch(_){}
  legacy(v);refresh();
  try{window.DEEN_ADMIN?.render?.()}catch(_){}
  note(v?'Test modu açık: tüm bölümlerin kilidi kalktı.':'Test modu kapalı: normal kilitler geri geldi.');
 }
 function note(text){
  const el=document.getElementById('deenAdminMessage');
  if(el){el.textContent=text;el.classList.add('show');clearTimeout(note.t);note.t=setTimeout(()=>el.classList.remove('show'),2600)}
 }

 const GO=[
  ['learn','ÖĞREN'],['review','TEKRAR'],['quran',"KUR’AN ANA SAYFA"],
  ['arabic','ARAPÇA YOLU'],['surah','SURE YOLU'],['arena','SORU ARENASI'],
  ['sreview','SURE TEKRARI'],['progress','İLERLEME'],['profile','PROFİL']
 ];
 const later=(fn,ms)=>setTimeout(()=>{try{fn()}catch(e){console.warn('admin test go',e)}},ms);
 function go(where){
  try{window.DEEN_ADMIN?.close?.()}catch(_){}
  const nav=id=>{try{navigate(id)}catch(_){}};
  if(where==='learn')nav('learnScreen');
  else if(where==='review')nav('reviewScreen');
  else if(where==='profile')nav('profileScreen');
  else if(where==='quran'){nav('leagueScreen');later(()=>window.DEEN_QURAN_PATHS?.home?.(),500)}
  else if(where==='arabic'){nav('leagueScreen');later(()=>window.DEEN_QURAN_PATHS?.enterArabic?.(),600)}
  else if(where==='surah'){nav('leagueScreen');later(()=>window.DEEN_QURAN_PATHS?.openSurahs?.(),600)}
  else if(where==='arena'){nav('leagueScreen');later(()=>window.DEEN_QURAN_PATH?.arena?.(),500)}
  else if(where==='sreview'){nav('leagueScreen');later(()=>window.DEEN_QURAN_PATH?.review?.(),500)}
  else if(where==='progress'){nav('leagueScreen');later(()=>window.DEEN_QURAN_PATH?.progress?.(),500)}
 }

 function build(){
  const isOn=on(),sec=document.createElement('section');
  sec.id='deenAdminTestMode';sec.className='deen-admin-section';sec.dataset.on=String(isOn);
  sec.innerHTML='<h3>TEST MODU · TÜM BÖLÜMLER</h3>'+
   '<div class="deen-admin-grid"><button class="deen-admin-btn '+(isOn?'gold':'primary')+'" data-adm2="toggle" style="grid-column:1/-1">'+
   (isOn?'TEST MODU AÇIK · KİLİTLERİ NORMALLEŞTİR':'TÜM BÖLÜMLERİ AÇ · TEST MODU')+'</button></div>'+
   '<p class="deen-admin-note">Açıkken Öğren, Arapça yolu (harfler, harekeler, okuma, kelimeler, anlam…), okuma işaretleri, harf biçimleri, ünite tekrarları ve Sure Yolu’nun tüm kilitleri kalkar ve enerji sınırsız olur. Hiçbir ders tamamlanmış sayılmaz, ilerlemen silinmez; kapatınca kilitler geri gelir.</p>'+
   '<h4 style="margin:12px 0 6px;font-size:11px;letter-spacing:.12em;opacity:.7">BÖLÜME GİT</h4>'+
   '<div class="deen-admin-grid">'+GO.map(([k,l])=>'<button class="deen-admin-btn" data-adm2="go" data-arg="'+k+'">'+l+'</button>').join('')+'</div>';
  return sec;
 }
 function inject(){
  const body=document.getElementById('deenAdminBody');if(!body)return;
  const old=document.getElementById('deenAdminTestMode');
  if(old&&old.dataset.on===String(on()))return;
  old?.remove();
  const sec=build(),status=body.querySelector('.deen-admin-status');
  if(status&&status.nextSibling)body.insertBefore(sec,status.nextSibling);else body.append(sec);
 }
 document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-adm2]');if(!b)return;
  e.preventDefault();e.stopPropagation();
  if(b.dataset.adm2==='toggle')set(!on());
  else if(b.dataset.adm2==='go')go(b.dataset.arg);
 },true);
 // The panel draws itself again after most actions; put the section back each time.
 if(typeof MutationObserver!=='undefined')new MutationObserver(()=>{if(document.getElementById('deenAdminBody'))setTimeout(inject,0)}).observe(document.body,{childList:true,subtree:true});
 // A reload keeps the mode: lift the Learn path's locks again after each run of the production guard (100 ... 6500 ms).
 if(on())[1800,3800,5300,6800,8000].forEach(ms=>setTimeout(()=>{if(on()){legacy(true);refresh()}},ms));
 window.DEEN_ADMIN_TEST=Object.freeze({on,set,go,inject});
})();
