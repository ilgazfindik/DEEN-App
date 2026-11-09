/* DEEN account + cloud progress sync.
   Guests never load the Supabase SDK and never contact the server: the SDK is only loaded when a stored
   sign-in exists or the learner opens the sign-in screen. Progress = the learner's own `deen_*` local keys. */
(()=>{
 'use strict';
 if(window.DEEN_ACCOUNT)return;
 const TABLE='progress',META='deen_cloud_meta',BACKUP='deen_cloud_backup',AUTH_KEY='deen-auth-v1',MAX=2900000;
 const SKIP=/^(deen_cloud_meta|deen_cloud_backup|deen_v57_last_good_state|deen_v5_migration_backup|deen_app_language_v1|deen_admin_|deen_dev)/;
 const S={
  tr:{label:'Hesap ve yedek',title:'Hesap',intro:'Hesap açarsan ilerlemen güvenle yedeklenir ve başka bir cihazda da devam edebilirsin. Hesap açmak zorunlu değil.',signin:'Giriş yap veya kayıt ol',as:'Giriş yapıldı:',sync:'Şimdi eşitle',syncing:'Eşitleniyor…',synced:'Yedeklendi',last:'Son eşitleme:',never:'henüz yok',out:'Çıkış yap',exp:'Verilerimi indir',del:'Hesabımı sil',sure:'Hesabın ve buluttaki ilerlemen kalıcı olarak silinecek. Bu cihazdaki ilerleme kalır. Emin misin?',yes:'Evet, kalıcı olarak sil',no:'Vazgeç',deleted:'Hesabın silindi.',err:'Bağlantı kurulamadı. Biraz sonra tekrar dene.',cTitle:'İlerleme bulundu',cBody:'Bu cihazdaki ilerleme ile hesabındaki ilerleme farklı. Hangisiyle devam edelim? Seçmediğin taraf silinmez: bu cihazın kopyası yedek olarak saklanır.',cloud:'Hesaptakini kullan',local:'Bu cihazdakini kullan'},
  en:{label:'Account & backup',title:'Account',intro:'With an account your progress is backed up safely and you can continue on another device. An account is optional.',signin:'Sign in or create account',as:'Signed in as',sync:'Sync now',syncing:'Syncing…',synced:'Backed up',last:'Last sync:',never:'not yet',out:'Sign out',exp:'Download my data',del:'Delete my account',sure:'Your account and the progress stored online will be deleted permanently. Progress on this device stays. Are you sure?',yes:'Yes, delete permanently',no:'Cancel',deleted:'Your account was deleted.',err:'Could not connect. Please try again later.',cTitle:'Progress found',cBody:'The progress on this device differs from the progress in your account. Which one should we continue with? Nothing is thrown away: this device\'s copy is kept as a backup.',cloud:'Use my account\'s progress',local:'Use this device\'s progress'},
  de:{label:'Konto & Sicherung',title:'Konto',intro:'Mit einem Konto wird dein Fortschritt sicher gesichert und du kannst auf einem anderen Gerät weitermachen. Ein Konto ist freiwillig.',signin:'Anmelden oder Konto erstellen',as:'Angemeldet als',sync:'Jetzt abgleichen',syncing:'Wird abgeglichen…',synced:'Gesichert',last:'Letzter Abgleich:',never:'noch nicht',out:'Abmelden',exp:'Meine Daten herunterladen',del:'Mein Konto löschen',sure:'Dein Konto und der online gespeicherte Fortschritt werden endgültig gelöscht. Der Fortschritt auf diesem Gerät bleibt. Bist du sicher?',yes:'Ja, endgültig löschen',no:'Abbrechen',deleted:'Dein Konto wurde gelöscht.',err:'Verbindung fehlgeschlagen. Bitte versuche es später erneut.',cTitle:'Fortschritt gefunden',cBody:'Der Fortschritt auf diesem Gerät unterscheidet sich vom Fortschritt in deinem Konto. Womit sollen wir weitermachen? Nichts geht verloren: Die Kopie dieses Geräts wird als Sicherung aufbewahrt.',cloud:'Fortschritt aus dem Konto nutzen',local:'Fortschritt dieses Geräts nutzen'},
  fr:{label:'Compte et sauvegarde',title:'Compte',intro:'Avec un compte, ta progression est sauvegardée en sécurité et tu peux continuer sur un autre appareil. Le compte est facultatif.',signin:'Se connecter ou créer un compte',as:'Connecté en tant que',sync:'Synchroniser',syncing:'Synchronisation…',synced:'Sauvegardé',last:'Dernière synchronisation :',never:'pas encore',out:'Se déconnecter',exp:'Télécharger mes données',del:'Supprimer mon compte',sure:'Ton compte et la progression stockée en ligne seront supprimés définitivement. La progression de cet appareil reste. Es-tu sûr ?',yes:'Oui, supprimer définitivement',no:'Annuler',deleted:'Ton compte a été supprimé.',err:'Connexion impossible. Réessaie plus tard.',cTitle:'Progression trouvée',cBody:'La progression de cet appareil diffère de celle de ton compte. Avec laquelle continuer ? Rien n\'est perdu : la copie de cet appareil est conservée comme sauvegarde.',cloud:'Utiliser la progression du compte',local:'Utiliser celle de cet appareil'},
  ar:{label:'الحساب والنسخ الاحتياطي',title:'الحساب',intro:'بإنشاء حساب يُحفظ تقدّمك بأمان ويمكنك المتابعة على جهاز آخر. إنشاء الحساب اختياري.',signin:'تسجيل الدخول أو إنشاء حساب',as:'تم تسجيل الدخول باسم',sync:'مزامنة الآن',syncing:'جارٍ المزامنة…',synced:'تم الحفظ',last:'آخر مزامنة:',never:'لم تتم بعد',out:'تسجيل الخروج',exp:'تنزيل بياناتي',del:'حذف حسابي',sure:'سيتم حذف حسابك والتقدّم المخزّن عبر الإنترنت نهائيًا. يبقى التقدّم على هذا الجهاز. هل أنت متأكد؟',yes:'نعم، احذف نهائيًا',no:'إلغاء',deleted:'تم حذف حسابك.',err:'تعذّر الاتصال. حاول لاحقًا.',cTitle:'تم العثور على تقدّم',cBody:'التقدّم على هذا الجهاز يختلف عن التقدّم في حسابك. بأيّهما نتابع؟ لن يُفقد شيء: تُحفظ نسخة هذا الجهاز احتياطيًا.',cloud:'استخدام تقدّم الحساب',local:'استخدام تقدّم هذا الجهاز'}
 };
 const lang=()=>window.DEEN_APP_LOCALE?.get?.()||'tr';
 const T=()=>S[lang()]||S.en;
 const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const ls={get(k){try{return localStorage.getItem(k)}catch(_){return null}},set(k,v){try{localStorage.setItem(k,v);return true}catch(_){return false}},del(k){try{localStorage.removeItem(k)}catch(_){}}};
 let client=null,user=null,busy=false,timer=null,lastHash='',conflictOpen=false,status='';

 function keys(){const out=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&/^deen_/.test(k)&&!SKIP.test(k))out.push(k)}}catch(_){}return out.sort()}
 function snapshot(){const o={};for(const k of keys()){const v=ls.get(k);if(v!=null)o[k]=v}return o}
 const hashOf=o=>{const s=JSON.stringify(o);let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return s.length+':'+h};
 function xpOf(o){try{const st=JSON.parse(o?.deen_v4_1_state||'{}');return {xp:Number(st.xp)||0,onboarded:!!st.onboarded}}catch(_){return {xp:0,onboarded:false}}}
 const meta=()=>{try{return JSON.parse(ls.get(META)||'{}')||{}}catch(_){return {}}};
 const setMeta=m=>ls.set(META,JSON.stringify(m));
 function applyCloud(data){
  const cur=snapshot();
  try{ls.set(BACKUP,JSON.stringify({at:Date.now(),data:cur}))}catch(_){}
  for(const k of keys())ls.del(k);
  for(const [k,v] of Object.entries(data||{}))if(/^deen_/.test(k)&&!SKIP.test(k)&&typeof v==='string')ls.set(k,v);
  // The engine keeps a 'last good' mirror of its state and restores from it if the main copy looks off: keep both aligned.
  if(data&&typeof data.deen_v4_1_state==='string')ls.set('deen_v57_last_good_state',data.deen_v4_1_state);
 }
 // The running engine keeps its state in memory and saves it again on its own; after the cloud copy is written,
 // freeze its writes to deen_* keys so that stale in-memory state cannot overwrite it before the reload.
 function freezeWrites(){
  try{const st=Storage.prototype,keep=st.setItem,keepRm=st.removeItem;
   st.setItem=function(k,v){if(this===localStorage&&/^deen_/.test(String(k)))return;return keep.call(this,k,v)};
   st.removeItem=function(k){if(this===localStorage&&/^deen_/.test(String(k)))return;return keepRm.call(this,k)};}catch(_){}
 }
 function reloadSoon(){status='reload';freezeWrites();setTimeout(()=>location.reload(),150)}

 async function ensureClient(){
  if(client)return client;
  const gate=window.DEEN_AUTH_GATE;if(!gate?.configured?.())throw Error('AUTH_NOT_CONFIGURED');
  client=await gate.sdk();
  client.auth.onAuthStateChange((ev,session)=>{
   user=session?.user||null;
   if(ev==='SIGNED_OUT'){stopTimer();lastHash='';render()}
   else if(session&&(ev==='SIGNED_IN'||ev==='INITIAL_SESSION'))setTimeout(()=>reconcile().catch(()=>{}),0);
  });
  return client;
 }
 function stopTimer(){if(timer){clearInterval(timer);timer=null}}
 function startTimer(){stopTimer();timer=setInterval(()=>{if(!document.hidden)push().catch(()=>{})},20000);}

 async function fetchRow(){
  const {data,error}=await client.from(TABLE).select('data,revision,updated_at').eq('user_id',user.id).maybeSingle();
  if(error)throw error;return data;
 }
 async function upload(row){
  const snap=snapshot();const size=JSON.stringify(snap).length;if(size>MAX)throw Error('TOO_LARGE');
  const device=(ls.get('deen_cloud_device')||(()=>{const d=(crypto.randomUUID?.()||String(Date.now())).slice(0,36);ls.set('deen_cloud_device',d);return d})());
  let res;
  if(!row)res=await client.from(TABLE).insert({user_id:user.id,data:snap,device_id:device}).select('revision,updated_at').single();
  else{
   res=await client.from(TABLE).update({data:snap,device_id:device}).eq('user_id',user.id).eq('revision',row.revision).select('revision,updated_at').maybeSingle();
   if(!res.error&&!res.data)return 'conflict';
  }
  if(res.error)throw res.error;
  setMeta({uid:user.id,revision:res.data.revision,at:Date.now()});lastHash=hashOf(snap);return 'ok';
 }
 // First contact on a device, or another device changed the cloud copy.
 async function reconcile(){
  if(busy||!user)return;busy=true;status='syncing';render();
  try{
   const row=await fetchRow(),m=meta(),local=snapshot(),lx=xpOf(local);
   if(!row){if(lx.onboarded||lx.xp>0)await upload(null);else setMeta({uid:user.id,revision:0,at:Date.now()});}
   else if(m.uid===user.id&&m.revision===row.revision){
    const res=await upload(row);if(res==='conflict')await ask(row);
   }else{
    const cx=xpOf(row.data);
    if(!lx.onboarded&&lx.xp===0){applyCloud(row.data);setMeta({uid:user.id,revision:row.revision,at:Date.now()});reloadSoon();return}
    if(hashOf(row.data)===hashOf(local)){setMeta({uid:user.id,revision:row.revision,at:Date.now()})}
    else if(!cx.onboarded&&cx.xp===0){await upload(row)}
    else await ask(row);
   }
   lastHash=hashOf(snapshot());status='ok';startTimer();
  }catch(e){status='err'}
  finally{busy=false;render()}
 }
 function ask(row){
  if(conflictOpen)return;conflictOpen=true;const t=T();
  const html='<p>'+esc(t.cBody)+'</p><div class="dacc-actions"><button type="button" class="dacc-btn" data-acc="useCloud">'+esc(t.cloud)+'</button><button type="button" class="dacc-btn dacc-alt" data-acc="useLocal">'+esc(t.local)+'</button></div>';
  window.__deenAccRow=row;
  try{window.sheet?.(t.cTitle,html)}catch(_){}
 }
 async function push(){
  if(busy||!user||!client||conflictOpen)return;
  const snap=snapshot();if(hashOf(snap)===lastHash)return;
  busy=true;
  try{const row=await fetchRow();const m=meta();
   if(row&&m.revision!==row.revision){busy=false;await reconcile();return}
   const r=await upload(row);if(r==='conflict'){busy=false;await reconcile();return}
   status='ok'}
  catch(_){status='err'}
  finally{busy=false}
 }
 async function chooseCloud(){const row=window.__deenAccRow;conflictOpen=false;if(!row)return;applyCloud(row.data);setMeta({uid:user.id,revision:row.revision,at:Date.now()});reloadSoon()}
 async function chooseLocal(){
  const row=window.__deenAccRow;conflictOpen=false;if(!row)return;
  try{ls.set(BACKUP,JSON.stringify({at:Date.now(),data:row.data}));const r=await upload(row);if(r==='conflict')throw Error('conflict');status='ok'}catch(_){status='err'}
  render();
 }

 /* ---------- UI ---------- */
 function fmt(ts){try{return new Date(ts).toLocaleString(lang())}catch(_){return ''}}
 function body(){
  const t=T(),m=meta();
  if(!user)return '<p>'+esc(t.intro)+'</p><div class="dacc-actions"><button type="button" class="dacc-btn" data-acc="signin">'+esc(t.signin)+'</button></div>';
  const msg=status==='syncing'?t.syncing:status==='err'?t.err:status==='ok'?t.synced:'';
  return '<p>'+esc(t.as)+' <b dir="ltr">'+esc(user.email||'')+'</b></p><p class="dacc-small">'+esc(t.last)+' '+esc(m.at?fmt(m.at):t.never)+'</p><p class="dacc-status" role="status" aria-live="polite">'+esc(msg)+'</p>'+
   '<div class="dacc-actions"><button type="button" class="dacc-btn" data-acc="sync">'+esc(t.sync)+'</button><button type="button" class="dacc-btn dacc-alt" data-acc="export">'+esc(t.exp)+'</button><button type="button" class="dacc-btn dacc-alt" data-acc="out">'+esc(t.out)+'</button><button type="button" class="dacc-btn dacc-danger" data-acc="del">'+esc(t.del)+'</button></div>';
 }
 function open(){
  const t=T();
  try{window.sheet?.(t.title,'<div id="daccBody">'+body()+'</div>')}catch(_){}
  hydrate();
 }
 function render(){const n=document.getElementById('daccBody');if(n)n.innerHTML=body();window.dispatchEvent(new Event('deen-account-changed'))}
 async function hydrate(){
  if(!window.DEEN_AUTH_GATE?.configured?.())return;
  if(!client&&!hasStoredSession())return;
  try{await ensureClient();const {data}=await client.auth.getSession();user=data?.session?.user||null;render()}catch(_){}
 }
 const hasStoredSession=()=>!!ls.get(AUTH_KEY)||/[?&#](code|access_token)=/.test(location.search+location.hash);
 function download(){
  const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),email:user?.email||null,progress:snapshot()},null,1)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='deen-data.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000);
 }
 document.addEventListener('click',async ev=>{
  const b=ev.target.closest?.('[data-acc]');if(!b)return;const a=b.dataset.acc,t=T();
  if(a==='signin'){document.querySelector('.sheet-close,[data-sheet-close]')?.click();window.DEEN_AUTH_GATE?.show?.();ensureClient().catch(()=>{})}
  else if(a==='sync'){status='syncing';render();try{await ensureClient();if(!user){const {data}=await client.auth.getSession();user=data?.session?.user||null}lastHash='';await reconcile()}catch(_){status='err';render()}}
  else if(a==='export')download();
  else if(a==='out'){try{await client.auth.signOut()}catch(_){}user=null;stopTimer();status='';render()}
  else if(a==='del'){const n=document.getElementById('daccBody');if(n)n.innerHTML='<p>'+esc(t.sure)+'</p><div class="dacc-actions"><button type="button" class="dacc-btn dacc-danger" data-acc="delYes">'+esc(t.yes)+'</button><button type="button" class="dacc-btn dacc-alt" data-acc="delNo">'+esc(t.no)+'</button></div>'}
  else if(a==='delNo')render();
  else if(a==='delYes'){
   try{const {error}=await client.rpc('delete_my_account');if(error)throw error;
    try{await client.auth.signOut()}catch(_){}
    user=null;stopTimer();ls.del(META);status='';const n=document.getElementById('daccBody');if(n)n.innerHTML='<p>'+esc(t.deleted)+'</p>';}
   catch(_){status='err';render()}
  }
  else if(a==='useCloud')chooseCloud();
  else if(a==='useLocal')chooseLocal();
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)push().catch(()=>{})});
 window.addEventListener('pagehide',()=>{push().catch(()=>{})});

 // Returning learner with a stored sign-in (or coming back from Google/Apple): resume quietly.
 function boot(){if(window.DEEN_AUTH_GATE?.configured?.()&&hasStoredSession())ensureClient().then(()=>client.auth.getSession()).then(({data})=>{user=data?.session?.user||null;if(user)reconcile()}).catch(()=>{})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1500));else setTimeout(boot,1500);

 window.DEEN_ACCOUNT=Object.freeze({
  open,label:()=>T().label,signedIn:()=>!!user,email:()=>user?.email||'',
  onSignedIn:()=>{ensureClient().then(()=>client.auth.getSession()).then(({data})=>{user=data?.session?.user||null;if(user)reconcile()}).catch(()=>{})},
  _keys:keys,_snapshot:snapshot,version:'account-v1'
 });
 // Small, self-contained styling for the sheet content.
 const st=document.createElement('style');st.textContent='.dacc-actions{display:grid;gap:10px;margin-top:14px}.dacc-btn{min-height:48px;border-radius:14px;border:0;padding:0 16px;font:inherit;font-weight:800;background:var(--ds-green,#58cc02);color:#fff;cursor:pointer}.dacc-alt{background:transparent;border:2px solid currentColor;color:inherit;opacity:.85}.dacc-danger{background:#d93f3f}.dacc-small{opacity:.7;font-size:.9em}.dacc-status{min-height:1.2em;font-weight:700}';
 document.head.appendChild(st);
})();
