/* Ilnura Premium: real subscriptions through Apple (StoreKit 2, the DeenStore native plugin).
   - Two plans in one subscription group: yearly (7-day free trial) and monthly. Prices are the App Store's, shown in the
     learner's own currency (TRY, EUR, GBP, USD, SAR, ...); the yearly card also shows its price per month.
   - A parental gate (a small sum) comes before every purchase, as Apple asks of apps used by children.
   - The paywall carries what Apple requires: price and period, trial and renewal terms, how to cancel, Terms of Use and
     Privacy Policy links, and Restore purchases.
   - Premium (state.premium) follows the App Store entitlement: checked at start, after a purchase or restore, and when
     StoreKit reports a renewal or refund. The last answer is kept for offline use until its expiry date.
   - The old previews (premiumPanel, DEEN_PREMIUM_OFFER) open this paywall in the app. Outside the iPhone app the paywall
     says Premium is bought in the app. */
(()=>{
 'use strict';
 if(window.DEEN_SUBSCRIBE)return;
 const IDS={yearly:'com.ilgazfindik.ilnura.premium.yearly',monthly:'com.ilgazfindik.ilnura.premium.monthly'};
 const CACHE='deen_premium_entitlement_v1';
 const TERMS='https://ilgazfindik.github.io/DEEN-App/legal/terms.html',PRIVACY='https://ilgazfindik.github.io/DEEN-App/legal/privacy.html',EULA='https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
 const LANGS=['tr','en','de','fr','ar'];
 const lang=()=>{let l='tr';try{l=window.DEEN_APP_LOCALE?.get?.()||localStorage.getItem('deen_app_language_v1')||'tr'}catch(_){}return LANGS.includes(l)?l:'tr'};
 const T={
  tr:{brand:'ILNURA PREMIUM',title:'Öğrenmenin en rahat hâli',perks:['Sınırsız enerji: dersler hiç durmaz','Kopan serini haftada bir ücretsiz kurtar','Ilnura’nın gelişmesine ve daha çok kişiye ulaşmasına destek'],
   yearly:'Yıllık',monthly:'Aylık',best:'EN AVANTAJLI',save:p=>'%'+p+' tasarruf',perMonth:p=>p+' / ay',trial:'7 gün ücretsiz',then:(p,per)=>'sonra '+p+' / '+per,year:'yıl',month:'ay',
   cta:'7 gün ücretsiz başla',ctaPlain:'Premium’a geç',restore:'Satın alımları geri yükle',terms:'Kullanım Şartları',privacy:'Gizlilik',later:'Şimdi değil',
   fine:'Ödeme, satın almayı onayladığında Apple hesabından alınır. Abonelik, dönem bitmeden en az 24 saat önce iptal edilmezse aynı fiyattan otomatik yenilenir. Ücretsiz deneme bitmeden iptal edersen ücret alınmaz. Aboneliğini iPhone Ayarları › Apple hesabın › Abonelikler’den yönetebilir ve iptal edebilirsin.',
   gateT:'Ebeveyn onayı',gateQ:(a,b)=>a+' + '+b+' kaç eder?',gateOk:'Devam',gateWrong:'Yanlış cevap. Lütfen bir yetişkinden yardım iste.',
   loading:'Fiyatlar yükleniyor…',noProducts:'Abonelikler şu an yüklenemedi. Biraz sonra tekrar dene.',active:'Premium etkin',activeUntil:d=>d+' tarihine kadar',inTrial:'Ücretsiz deneme sürüyor',manage:'Aboneliği yönet',
   done:'Premium etkin! Hayırlı olsun 🎉',pending:'Satın alma onay bekliyor.',restored:'Premium geri yüklendi.',nothing:'Geri yüklenecek bir abonelik bulunamadı.',err:'Bir sorun oluştu. Lütfen tekrar dene.',web:'Premium, iPhone uygulamasındaki App Store aboneliği ile alınır.',close:'Kapat'},
  en:{brand:'ILNURA PREMIUM',title:'Learning at its most comfortable',perks:['Unlimited energy: lessons never stop','Repair a broken streak for free once a week','Support Ilnura as it grows and reaches more learners'],
   yearly:'Yearly',monthly:'Monthly',best:'BEST VALUE',save:p=>'Save '+p+'%',perMonth:p=>p+' / month',trial:'7 days free',then:(p,per)=>'then '+p+' / '+per,year:'year',month:'month',
   cta:'Start 7 days free',ctaPlain:'Get Premium',restore:'Restore purchases',terms:'Terms of Use',privacy:'Privacy',later:'Not now',
   fine:'Payment is charged to your Apple Account when you confirm the purchase. The subscription renews automatically at the same price unless cancelled at least 24 hours before the end of the period. Cancel before the free trial ends and you will not be charged. Manage or cancel in iPhone Settings › your Apple Account › Subscriptions.',
   gateT:'Ask a parent',gateQ:(a,b)=>'What is '+a+' + '+b+'?',gateOk:'Continue',gateWrong:'Wrong answer. Please ask an adult for help.',
   loading:'Loading prices…',noProducts:'Subscriptions could not be loaded right now. Please try again later.',active:'Premium is active',activeUntil:d=>'until '+d,inTrial:'Free trial in progress',manage:'Manage subscription',
   done:'Premium is active! 🎉',pending:'The purchase is waiting for approval.',restored:'Premium restored.',nothing:'No subscription to restore was found.',err:'Something went wrong. Please try again.',web:'Premium is bought with an App Store subscription in the iPhone app.',close:'Close'},
  de:{brand:'ILNURA PREMIUM',title:'Lernen in seiner bequemsten Form',perks:['Unbegrenzte Energie: Lektionen ohne Pause','Einmal pro Woche eine verlorene Serie gratis retten','Unterstütze Ilnura dabei, mehr Lernende zu erreichen'],
   yearly:'Jährlich',monthly:'Monatlich',best:'BESTER PREIS',save:p=>p+' % sparen',perMonth:p=>p+' / Monat',trial:'7 Tage gratis',then:(p,per)=>'danach '+p+' / '+per,year:'Jahr',month:'Monat',
   cta:'7 Tage gratis starten',ctaPlain:'Premium holen',restore:'Käufe wiederherstellen',terms:'Nutzungsbedingungen',privacy:'Datenschutz',later:'Nicht jetzt',
   fine:'Die Zahlung wird bei Bestätigung des Kaufs deinem Apple Account belastet. Das Abo verlängert sich automatisch zum selben Preis, wenn es nicht mindestens 24 Stunden vor Ende des Zeitraums gekündigt wird. Kündigst du vor Ende der Testphase, wird nichts berechnet. Verwalten oder kündigen in den iPhone-Einstellungen › dein Apple Account › Abonnements.',
   gateT:'Frag deine Eltern',gateQ:(a,b)=>'Was ist '+a+' + '+b+'?',gateOk:'Weiter',gateWrong:'Falsche Antwort. Bitte frag einen Erwachsenen.',
   loading:'Preise werden geladen…',noProducts:'Abos konnten gerade nicht geladen werden. Bitte später erneut versuchen.',active:'Premium ist aktiv',activeUntil:d=>'bis '+d,inTrial:'Gratis-Testphase läuft',manage:'Abo verwalten',
   done:'Premium ist aktiv! 🎉',pending:'Der Kauf wartet auf Freigabe.',restored:'Premium wiederhergestellt.',nothing:'Kein Abo zum Wiederherstellen gefunden.',err:'Etwas ist schiefgelaufen. Bitte erneut versuchen.',web:'Premium gibt es als App-Store-Abo in der iPhone-App.',close:'Schließen'},
  fr:{brand:'ILNURA PREMIUM',title:'Apprendre en toute sérénité',perks:['Énergie illimitée : les leçons ne s’arrêtent jamais','Répare gratuitement une série perdue une fois par semaine','Soutiens Ilnura pour qu’il aide plus de personnes'],
   yearly:'Annuel',monthly:'Mensuel',best:'MEILLEURE OFFRE',save:p=>'−'+p+' %',perMonth:p=>p+' / mois',trial:'7 jours gratuits',then:(p,per)=>'puis '+p+' / '+per,year:'an',month:'mois',
   cta:'Essayer 7 jours gratuits',ctaPlain:'Passer à Premium',restore:'Restaurer les achats',terms:'Conditions d’utilisation',privacy:'Confidentialité',later:'Pas maintenant',
   fine:'Le paiement est débité de ton compte Apple à la confirmation de l’achat. L’abonnement se renouvelle automatiquement au même prix sauf s’il est annulé au moins 24 heures avant la fin de la période. Si tu annules avant la fin de l’essai gratuit, rien n’est facturé. Gère ou annule dans Réglages de l’iPhone › ton compte Apple › Abonnements.',
   gateT:'Demande à un parent',gateQ:(a,b)=>'Combien font '+a+' + '+b+' ?',gateOk:'Continuer',gateWrong:'Mauvaise réponse. Demande de l’aide à un adulte.',
   loading:'Chargement des prix…',noProducts:'Impossible de charger les abonnements pour le moment. Réessaie plus tard.',active:'Premium est actif',activeUntil:d=>'jusqu’au '+d,inTrial:'Essai gratuit en cours',manage:'Gérer l’abonnement',
   done:'Premium est actif ! 🎉',pending:'L’achat attend une validation.',restored:'Premium restauré.',nothing:'Aucun abonnement à restaurer.',err:'Un problème est survenu. Réessaie.',web:'Premium s’obtient avec un abonnement App Store dans l’app iPhone.',close:'Fermer'},
  ar:{brand:'ILNURA PREMIUM',title:'التعلّم بأريح طريقة',perks:['طاقة غير محدودة: الدروس لا تتوقف','أصلح سلسلتك المنقطعة مجانًا مرة كل أسبوع','ادعم Ilnura ليصل إلى مزيد من المتعلمين'],
   yearly:'سنوي',monthly:'شهري',best:'الأفضل قيمة',save:p=>'وفّر '+p+'٪',perMonth:p=>p+' / شهر',trial:'٧ أيام مجانًا',then:(p,per)=>'ثم '+p+' / '+per,year:'سنة',month:'شهر',
   cta:'ابدأ ٧ أيام مجانًا',ctaPlain:'احصل على Premium',restore:'استعادة المشتريات',terms:'شروط الاستخدام',privacy:'الخصوصية',later:'ليس الآن',
   fine:'يُخصم المبلغ من حساب Apple عند تأكيد الشراء. يتجدد الاشتراك تلقائيًا بالسعر نفسه ما لم يُلغَ قبل ٢٤ ساعة على الأقل من نهاية الفترة. إذا ألغيت قبل انتهاء التجربة المجانية فلن يُخصم شيء. يمكنك الإدارة أو الإلغاء من إعدادات iPhone › حساب Apple › الاشتراكات.',
   gateT:'اطلب من أحد الوالدين',gateQ:(a,b)=>'كم يساوي '+a+' + '+b+'؟',gateOk:'متابعة',gateWrong:'إجابة خاطئة. اطلب المساعدة من شخص بالغ.',
   loading:'جارٍ تحميل الأسعار…',noProducts:'تعذّر تحميل الاشتراكات الآن. حاول لاحقًا.',active:'Premium مفعّل',activeUntil:d=>'حتى '+d,inTrial:'التجربة المجانية جارية',manage:'إدارة الاشتراك',
   done:'تم تفعيل Premium! 🎉',pending:'الشراء بانتظار الموافقة.',restored:'تمت استعادة Premium.',nothing:'لم يُعثر على اشتراك للاستعادة.',err:'حدث خطأ. حاول مرة أخرى.',web:'يُشترى Premium باشتراك App Store في تطبيق iPhone.',close:'إغلاق'}
 };
 const L=()=>T[lang()];
 const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const app=()=>{try{return typeof state==='object'&&state?state:null}catch(_){return null}};
 const native=()=>{try{const C=window.Capacitor;return !!(C&&C.isNativePlatform&&C.isNativePlatform())}catch(_){return false}};
 const store=()=>{try{return native()&&window.DEEN_NATIVE_PLUGIN?window.DEEN_NATIVE_PLUGIN('DeenStore'):null}catch(_){return null}};
 const toastMsg=m=>{try{toast(m)}catch(_){}};

 // ---- Entitlement ----
 const readCache=()=>{try{const c=JSON.parse(localStorage.getItem(CACHE)||'null');return c&&typeof c==='object'?c:null}catch(_){return null}};
 const writeCache=e=>{try{localStorage.setItem(CACHE,JSON.stringify({active:!!e.active,productId:e.productId||null,expires:Number(e.expires)||null,inTrial:!!e.inTrial,willRenew:e.willRenew!==false,checkedAt:Date.now()}))}catch(_){}};
 const cacheActive=()=>{const c=readCache();return !!(c&&c.active&&(!c.expires||c.expires>Date.now()))};
 const entitlement={source:'app-store',get active(){return native()&&cacheActive()},get info(){return readCache()}};
 // In the iPhone app the App Store decides; on the web the developer preview keeps its own local trial object.
 if(native()||!window.DEEN_PREMIUM_ENTITLEMENT)window.DEEN_PREMIUM_ENTITLEMENT=entitlement;
 function applyPremium(){
  const s=app();if(!s||!native())return;
  const on=cacheActive();
  if(!!s.premium!==on){s.premium=on;try{saveState()}catch(_){}try{updateUI()}catch(_){}}
 }
 function takeEntitlement(e){if(!e)return;writeCache(e);applyPremium();if(sheet)paint()}
 async function refresh(){const p=store();if(!p)return null;try{const e=await p.entitlement();takeEntitlement(e);return e}catch(_){return null}}

 // ---- Products ----
 let products=null,loading=null;
 async function loadProducts(){
  const p=store();if(!p)return null;if(products)return products;
  if(!loading)loading=p.products({ids:[IDS.yearly,IDS.monthly]}).then(r=>{const m={};(r&&r.products||[]).forEach(x=>{m[x.id]=x});products=(m[IDS.yearly]||m[IDS.monthly])?m:null;return products}).catch(()=>null).finally(()=>{loading=null});
  return loading;
 }
 // A price written like the store writes it: the store's own text with the number replaced ("49,99 €" -> "4,17 €").
 function like(display,v){
  const m=String(display||'').match(/\d[\d.,\s\u00a0\u202f\u066b\u066c]*/);if(!m)return String(Math.round(v*100)/100);
  const num=m[0].trim(),dec=(num.match(/[.,\u066b](\d{1,2})$/)||[])[0];const sep=dec?dec[0]:'.';const digits=dec?dec.length-1:0;
  let out=v.toFixed(digits);if(sep!=='.')out=out.replace('.',sep);
  return display.replace(num,out);
 }

 // ---- Paywall ----
 let sheet=null,plan='yearly',busy=false;
 function paint(){
  if(!sheet)return;const t=L(),body=sheet.querySelector('.sub-body'),info=readCache(),on=native()&&cacheActive();
  sheet.dir=lang()==='ar'?'rtl':'ltr';
  let h='<div class="sub-hero"><span class="sub-brand">'+esc(t.brand)+'</span><h2>'+esc(t.title)+'</h2></div><ul class="sub-perks">'+t.perks.map(x=>'<li><i aria-hidden="true">✦</i>'+esc(x)+'</li>').join('')+'</ul>';
  if(!native()){h+='<p class="sub-note">'+esc(t.web)+'</p>'}
  else if(on){
   let d='';try{d=info&&info.expires?new Date(info.expires).toLocaleDateString(lang()):''}catch(_){}
   h+='<div class="sub-active"><b>✓ '+esc(t.active)+'</b>'+(info&&info.inTrial?'<span>'+esc(t.inTrial)+'</span>':'')+(d?'<span>'+esc(t.activeUntil(d))+'</span>':'')+'</div><button type="button" class="sub-cta" data-sub="manage">'+esc(t.manage)+'</button>';
  }else if(!products){
   h+='<p class="sub-note" aria-live="polite">'+esc(loading?t.loading:t.noProducts)+'</p>';
  }else{
   const y=products[IDS.yearly],m=products[IDS.monthly];
   const save=y&&m&&m.price>0?Math.round((1-y.price/(m.price*12))*100):0;
   const trial=y&&y.trial&&y.eligibleForTrial;
   h+='<div class="sub-plans" role="radiogroup">';
   if(y)h+='<button type="button" role="radio" class="sub-plan'+(plan==='yearly'?' on':'')+'" aria-checked="'+(plan==='yearly')+'" data-sub="plan" data-id="yearly"><span class="sub-tag">'+esc(t.best)+'</span><b>'+esc(t.yearly)+'</b><strong>'+esc(y.displayPrice)+'<small> / '+esc(t.year)+'</small></strong><span class="sub-sub">'+esc(t.perMonth(like(y.displayPrice,Math.round(y.price/12*100)/100)))+(save>0?' · '+esc(t.save(save)):'')+'</span>'+(trial?'<em>'+esc(t.trial)+'</em>':'')+'</button>';
   if(m)h+='<button type="button" role="radio" class="sub-plan'+(plan==='monthly'?' on':'')+'" aria-checked="'+(plan==='monthly')+'" data-sub="plan" data-id="monthly"><b>'+esc(t.monthly)+'</b><strong>'+esc(m.displayPrice)+'<small> / '+esc(t.month)+'</small></strong></button>';
   h+='</div>';
   const sel=plan==='yearly'?y:m,isTrial=plan==='yearly'&&trial;
   h+='<button type="button" class="sub-cta" data-sub="buy"'+(busy?' disabled':'')+'>'+esc(isTrial?t.cta:t.ctaPlain)+'</button>';
   if(sel)h+='<p class="sub-price">'+esc(isTrial?t.trial+', '+t.then(sel.displayPrice,t.year):sel.displayPrice+' / '+(plan==='yearly'?t.year:t.month))+'</p>';
  }
  if(native())h+='<button type="button" class="sub-link" data-sub="restore">'+esc(t.restore)+'</button>';
  h+='<p class="sub-fine">'+esc(t.fine)+'</p><p class="sub-legal"><a href="'+EULA+'" target="_blank" rel="noopener">'+'Apple EULA</a> · <a href="'+TERMS+'" target="_blank" rel="noopener">'+esc(t.terms)+'</a> · <a href="'+PRIVACY+'" target="_blank" rel="noopener">'+esc(t.privacy)+'</a></p>';
  body.innerHTML=h;
 }
 function open(){
  if(sheet)return;const t=L();
  sheet=document.createElement('div');sheet.className='sub-sheet';sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');sheet.setAttribute('aria-label',t.brand);
  sheet.innerHTML='<div class="sub-card"><button type="button" class="sub-x" data-sub="close" aria-label="'+esc(t.close)+'">×</button><div class="sub-body"></div><button type="button" class="sub-later" data-sub="close">'+esc(t.later)+'</button></div>';
  (document.getElementById('phone')||document.body).append(sheet);requestAnimationFrame(()=>sheet&&sheet.classList.add('in'));
  paint();
  if(native()){refresh();if(!products){loadProducts().then(()=>paint());paint()}}
 }
 function close(){if(!sheet)return;const s=sheet;sheet=null;s.classList.remove('in');setTimeout(()=>s.remove(),250)}
 // A small sum a young child is unlikely to solve, asked before any purchase.
 function gate(){
  return new Promise(res=>{
   const t=L(),a=12+Math.floor(Math.random()*20),b=11+Math.floor(Math.random()*20);
   const g=document.createElement('div');g.className='sub-gate';g.setAttribute('role','dialog');g.setAttribute('aria-modal','true');g.dir=lang()==='ar'?'rtl':'ltr';
   g.innerHTML='<div class="sub-gate-card"><h3>'+esc(t.gateT)+'</h3><p>'+esc(t.gateQ(a,b))+'</p><input inputmode="numeric" pattern="[0-9]*" autocomplete="off" aria-label="'+esc(t.gateQ(a,b))+'"><p class="sub-gate-err" hidden>'+esc(t.gateWrong)+'</p><div><button type="button" class="sub-gate-no">'+esc(t.close)+'</button><button type="button" class="sub-gate-ok">'+esc(t.gateOk)+'</button></div></div>';
   (sheet||document.body).append(g);const inp=g.querySelector('input');setTimeout(()=>inp.focus(),60);
   const done=v=>{g.remove();res(v)};
   g.querySelector('.sub-gate-no').onclick=()=>done(false);
   g.querySelector('.sub-gate-ok').onclick=()=>{if(Number(inp.value)===a+b)done(true);else{g.querySelector('.sub-gate-err').hidden=false;inp.value=''}};
   inp.addEventListener('keydown',e=>{if(e.key==='Enter')g.querySelector('.sub-gate-ok').click()});
  });
 }
 async function buy(){
  const p=store(),t=L();if(!p||busy||!products)return;
  const id=IDS[plan];if(!products[id])return;
  if(!(await gate()))return;
  busy=true;paint();
  try{
   const r=await p.purchase({id});
   if(r&&r.status==='purchased'){takeEntitlement(r.entitlement||{active:true,productId:id});toastMsg(t.done);close()}
   else if(r&&r.status==='pending')toastMsg(t.pending);
  }catch(_){toastMsg(t.err)}
  finally{busy=false;paint()}
 }
 async function restore(){
  const p=store(),t=L();if(!p||busy)return;busy=true;paint();
  try{const e=await p.restore();takeEntitlement(e);toastMsg(e&&e.active?t.restored:t.nothing);if(e&&e.active)close()}catch(_){toastMsg(t.err)}
  finally{busy=false;paint()}
 }
 async function manage(){const p=store();if(!p)return;try{await p.manage()}catch(_){}setTimeout(refresh,1500)}
 document.addEventListener('click',e=>{
  const b=e.target.closest&&e.target.closest('.sub-sheet [data-sub]');if(!b)return;
  const a=b.dataset.sub;
  if(a==='close')close();else if(a==='plan'){plan=b.dataset.id;paint()}else if(a==='buy')buy();else if(a==='restore')restore();else if(a==='manage')manage();
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sheet&&!document.querySelector('.sub-gate'))close()});

 // ---- Wiring ----
 function install(){
  // Every Premium entry point opens the real paywall.
  window.premiumPanel=open;try{premiumPanel=open}catch(_){}
  if(!native())return;
  applyPremium();
  const p=store();
  try{p&&p.addListener&&p.addListener('entitlement',takeEntitlement)}catch(_){}
  setTimeout(refresh,1200);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 window.DEEN_SUBSCRIBE=Object.freeze({version:'subscribe-1',ids:Object.assign({},IDS),open,close,refresh,isActive:()=>native()&&cacheActive(),entitlement:()=>readCache()});
})();
