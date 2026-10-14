/* DEEN auth entry. Only a PUBLIC Supabase URL and publishable key belong here.
   Never add a service_role key or OAuth client secret to browser code. */
(()=>{
 'use strict';
 if(window.DEEN_AUTH_GATE)return;
 const CONFIG={url:'',publishableKey:''}; // Dedicated DEEN Supabase project required.
 const strings={
  tr:['Hesabınla öğrenmeye devam et','Kayıt ol veya hesabına giriş yap.','Google ile devam et','Apple ile devam et','E-posta ile devam et','Kayıt ol','Giriş yap','Şifremi unuttum','E-posta adresi','Şifre (en az 8 karakter)','E-posta ile kayıt ol','Giriş yap','Şifre yenileme bağlantısı gönder','Misafir olarak devam et','Misafir ilerlemesi bu cihazda saklanır. Bulut eşitleme henüz etkin değil.','Hesap sistemi henüz etkinleştirilmedi. Misafir olarak devam edebilirsin.','Doğrulama bağlantısı için e-postanı kontrol et.','Varsa şifre yenileme bağlantısı e-postana gönderildi.','Geçerli bir e-posta ve en az 8 karakterli şifre gir.','İşlem tamamlanamadı. Tekrar dene.','Bağlanılıyor…','Geri','13 yaşından küçüksen hesabı ebeveynin veya yasal vasin açmalıdır.'],
  ar:['تابع التعلّم بحسابك','أنشئ حسابًا أو سجّل الدخول.','المتابعة باستخدام Google','المتابعة باستخدام Apple','المتابعة بالبريد الإلكتروني','إنشاء حساب','تسجيل الدخول','نسيت كلمة المرور','البريد الإلكتروني','كلمة المرور (8 أحرف على الأقل)','التسجيل بالبريد الإلكتروني','تسجيل الدخول','إرسال رابط إعادة التعيين','المتابعة كضيف','يُحفظ تقدّم الضيف على هذا الجهاز فقط. المزامنة السحابية لم تُفعّل بعد.','خدمة الحسابات غير مفعّلة بعد. يمكنك المتابعة كضيف.','تحقق من بريدك الإلكتروني وأكّد التسجيل.','تحقق من بريدك الإلكتروني للحصول على رابط إعادة التعيين.','أدخل بريدًا صحيحًا وكلمة مرور من 8 أحرف على الأقل.','تعذّر إكمال العملية. حاول مجددًا.','جارٍ الاتصال…','رجوع','إذا كان عمرك أقل من 13 عامًا، يجب على أحد والديك أو وصيك إنشاء الحساب.'],
  en:['Continue learning with an account','Create an account or sign in to DEEN.','Continue with Google','Continue with Apple','Continue with email','Create account','Sign in','Forgot password?','Email address','Password (at least 8 characters)','Sign up with email','Sign in','Send password reset link','Continue as guest','Guest progress stays on this device. Cloud sync is not enabled yet.','Account sign-in is not configured yet. You can continue as a guest.','Check your inbox and confirm your email to finish signing up.','Check your inbox for a reset link, if one was sent.','Enter a valid email and password of at least 8 characters.','Could not complete the request. Please try again.','Connecting…','Back','If you are under 13, a parent or legal guardian must create the account.'],
  de:['Lerne mit deinem Konto weiter','Erstelle ein Konto oder melde dich an.','Mit Google fortfahren','Mit Apple fortfahren','Mit E-Mail fortfahren','Konto erstellen','Anmelden','Passwort vergessen?','E-Mail-Adresse','Passwort (mindestens 8 Zeichen)','Mit E-Mail registrieren','Anmelden','Link zum Zurücksetzen senden','Als Gast fortfahren','Der Gastfortschritt bleibt auf diesem Gerät. Die Cloud-Synchronisierung ist noch nicht aktiv.','Die Kontoanmeldung ist noch nicht eingerichtet. Du kannst als Gast fortfahren.','Bitte bestätige deine E-Mail-Adresse, um die Registrierung abzuschließen.','Prüfe dein E-Mail-Postfach auf einen Link zum Zurücksetzen.','Gib eine gültige E-Mail-Adresse und ein Passwort mit mindestens 8 Zeichen ein.','Der Vorgang konnte nicht abgeschlossen werden. Versuche es erneut.','Verbindung wird hergestellt…','Zurück','Unter 13 Jahren muss ein Elternteil oder Erziehungsberechtigter das Konto erstellen.'],
  fr:['Apprends avec ton compte','Crée un compte ou connecte-toi à DEEN.','Continuer avec Google','Continuer avec Apple','Continuer avec une adresse e-mail','Créer un compte','Se connecter','Mot de passe oublié ?','Adresse e-mail','Mot de passe (8 caractères minimum)','Créer un compte par e-mail','Se connecter','Envoyer un lien de réinitialisation','Continuer en tant qu’invité','La progression en mode invité reste sur cet appareil. La synchronisation cloud n’est pas encore active.','La connexion aux comptes n’est pas encore configurée. Tu peux continuer en tant qu’invité.','Consulte ta boîte mail et confirme ton adresse pour terminer ton inscription.','Consulte tes e-mails pour un lien de réinitialisation, s’il a été envoyé.','Saisis une adresse valide et un mot de passe de 8 caractères minimum.','Impossible de terminer la demande. Réessaie.','Connexion en cours…','Retour','Si tu as moins de 13 ans, un parent ou responsable légal doit créer le compte.']
 };
 const lang=()=>window.DEEN_APP_LOCALE?.get?.()||'tr';
 const T=i=>(strings[lang()]||strings.en)[i];
 const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const configured=()=>/^https:\/\/[a-z0-9.-]+\.supabase\.co\/?$/.test(CONFIG.url)&&/^(sb_publishable_|eyJ)/.test(CONFIG.publishableKey);
 // Inline vectors keep provider marks crisp without external assets or SDK dependencies.
 // Decorative to assistive technology: button labels already announce the action.
 const authIcons=Object.freeze({
  google:'<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="#4285F4" d="M21.35 12.25c0-.76-.07-1.48-.19-2.18H12v4.12h5.23a4.47 4.47 0 0 1-1.95 2.93v2.43h3.16c1.85-1.7 2.91-4.21 2.91-7.3z"/><path fill="#34A853" d="M12 21.5c2.64 0 4.86-.88 6.48-2.38l-3.16-2.44a5.89 5.89 0 0 1-8.77-3.09H3.29v2.5A9.79 9.79 0 0 0 12 21.5z"/><path fill="#FBBC05" d="M6.55 13.59A5.84 5.84 0 0 1 6.25 12c0-.55.1-1.09.3-1.59v-2.5H3.29a9.55 9.55 0 0 0 0 8.18l3.26-2.5z"/><path fill="#EA4335" d="M12 6.11c1.44 0 2.73.49 3.74 1.46l2.8-2.8A9.36 9.36 0 0 0 12 2.5a9.79 9.79 0 0 0-8.71 5.41l3.26 2.5a5.82 5.82 0 0 1 5.45-4.3z"/></svg>',
  apple:'<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.6 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.5-2.6-1.7-3.1-1.7-1.3-.1-2.6.8-3.2.8s-1.6-.8-2.6-.8c-1.4 0-2.7.8-3.4 2-1.5 2.5-.4 6.2 1 8.2.7 1 1.5 2.1 2.5 2.1s1.3-.7 2.6-.7 1.6.7 2.7.7 1.8-1 2.5-2.1a9.1 9.1 0 0 0 1.1-2.1c-.1 0-2.8-1.1-2.8-4.2zM15.7 6.3c.6-.7 1.1-1.8 1-2.8-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.7-1 2.7 1 .1 2.1-.5 2.7-1.3z"/></svg>',
  email:'<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>'
 });
 const socialButton=(provider,label)=>'<button type="button" class="da-provider da-'+provider+'" data-social="'+provider+'"><span class="da-provider-icon">'+authIcons[provider]+'</span><span class="da-provider-label">'+escape(label)+'</span><span class="da-provider-spacer" aria-hidden="true"></span></button>';
 let root=null,client=null,loading=null,busy=false;
 async function sdk(){
  if(!configured())throw Error('AUTH_NOT_CONFIGURED');
  if(client)return client;
  if(loading)return loading;
  loading=new Promise((resolve,reject)=>{
   const init=()=>{
    try{client=window.supabase.createClient(CONFIG.url,CONFIG.publishableKey,{auth:{flowType:'pkce',detectSessionInUrl:true,persistSession:true,autoRefreshToken:true,storageKey:'deen-auth-v1'}});resolve(client);}
    catch(e){reject(e)}
   };
   if(window.supabase?.createClient)return init();
   const script=document.createElement('script');
   script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.81.1/dist/umd/supabase.js';
   script.crossOrigin='anonymous';script.onload=init;script.onerror=()=>reject(Error('AUTH_SDK_LOAD_FAILED'));
   document.head.appendChild(script);
  }).catch(e=>{loading=null;throw e});
  return loading;
 }
 function close(){root?.remove();root=null;busy=false;const phone=document.querySelector('.phone');if(phone)phone.inert=!!document.getElementById('v998Onboarding');}
 function show(){
  close();let mode='choice',completed=false;
  const pane=document.createElement('section');root=pane;
  pane.id='deenAccountGate';pane.setAttribute('role','dialog');pane.setAttribute('aria-modal','true');pane.lang=lang();pane.dir=lang()==='ar'?'rtl':'ltr';pane.setAttribute('aria-label',T(0));
  const phone=document.querySelector('.phone');if(phone)phone.inert=true;
  const onward=()=>{
   if(completed)return;completed=true;close();
   const onboarding=window.DEEN_PREMIUM_ONBOARDING;
   if(!state.onboarded&&onboarding?.render){document.getElementById('v998Onboarding')?.remove();onboarding.render(0);}
  };
  const say=message=>{const node=pane.querySelector('.da-status');if(node)node.textContent=message||''};
  const lock=value=>{busy=value;pane.querySelectorAll('button,input').forEach(el=>{if(!el.classList.contains('da-guest'))el.disabled=value})};
  function render(){
   pane.innerHTML='<div class="da-panel"><div class="da-brand">DEEN</div><h1>'+escape(T(0))+'</h1><p>'+escape(T(1))+'</p>'+
    (mode==='choice'?'<div class="da-actions">'+socialButton('google',T(2))+socialButton('apple',T(3))+'<button type="button" class="da-provider da-email"><span class="da-provider-icon">'+authIcons.email+'</span><span class="da-provider-label">'+escape(T(4))+'</span><span class="da-provider-spacer" aria-hidden="true"></span></button></div>':
     '<button class="da-back" type="button">'+escape(T(21))+'</button><div class="da-tabs"><button type="button" data-mode="signup" aria-pressed="'+(mode==='signup')+'">'+escape(T(5))+'</button><button type="button" data-mode="signin" aria-pressed="'+(mode==='signin')+'">'+escape(T(6))+'</button></div><form novalidate><label>'+escape(T(8))+'<input type="email" name="email" inputmode="email" autocomplete="email" maxlength="254" required></label>'+
     (mode==='reset'?'':'<label>'+escape(T(9))+'<input type="password" name="password" minlength="8" autocomplete="'+(mode==='signup'?'new-password':'current-password')+'" required></label>')+
     '<button type="submit" class="da-submit">'+escape(T(mode==='signup'?10:mode==='reset'?12:11))+'</button></form><button type="button" class="da-reset">'+escape(T(7))+'</button>')+
     '<div class="da-status" role="status" aria-live="polite"></div><button class="da-guest" type="button">'+escape(T(13))+'</button><p class="da-note">'+escape(T(14))+'</p><p class="da-note">'+escape(T(22))+'</p></div>';
   pane.querySelector('.da-guest').onclick=onward;
   pane.querySelector('.da-email')?.addEventListener('click',()=>{mode='signup';render()});
   pane.querySelector('.da-back')?.addEventListener('click',()=>{mode='choice';render()});
   pane.querySelector('.da-reset')?.addEventListener('click',()=>{mode='reset';render()});
   pane.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;render()});
   pane.querySelectorAll('[data-social]').forEach(b=>b.onclick=async()=>{
    if(busy)return;
    if(!configured()){say(T(15));return}
    lock(true);say(T(20));
    try{const api=await sdk();const {error}=await api.auth.signInWithOAuth({provider:b.dataset.social,options:{redirectTo:location.origin+location.pathname}});if(error)throw error}
    catch(_){say(T(19));lock(false)}
   });
   pane.querySelector('form')?.addEventListener('submit',async event=>{
    event.preventDefault();if(busy)return;
    if(!configured()){say(T(15));return}
    const form=event.currentTarget;
    const email=form.querySelector('[name="email"]').value.trim(),password=form.querySelector('[name="password"]')?.value||'';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||(mode!=='reset'&&password.length<8)){say(T(18));return}
    lock(true);say(T(20));
    try{
     const api=await sdk(),returnTo=location.origin+location.pathname;
     const result=mode==='signup'?await api.auth.signUp({email,password,options:{emailRedirectTo:returnTo}}):mode==='reset'?await api.auth.resetPasswordForEmail(email,{redirectTo:returnTo}):await api.auth.signInWithPassword({email,password});
     if(result.error)throw result.error;
     if(mode==='reset'){say(T(17));return}
     if(result.data?.session){onward();return}
     say(T(16));
    }catch(_){say(T(19))}finally{if(pane.isConnected)lock(false)}
   });
   if(!configured())say(T(15));
  }
  document.body.appendChild(pane);render();pane.tabIndex=-1;pane.focus();
  if(configured())sdk().then(api=>api.auth.getSession()).then(({data})=>{if(data?.session&&pane.isConnected)onward()}).catch(()=>{});
  return pane;
 }
 window.DEEN_AUTH_GATE=Object.freeze({show,close,configured,version:'auth-gate-v1'});
})();
