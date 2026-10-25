/* DEEN premium hub — consistent profile hero + ethical Free/Premium comparison.
   This is a device-local preview. No StoreKit/Google Play payment is initiated. */
(()=>{
 'use strict';
 if(window.DEEN_PREMIUM_HUB)return;
 const text={
  tr:{brand:'DEEN PREMIUM',name:'Premium ayrıcalıkları',headline:'Öğrenmenin daha zarif yolu.',summary:'Daha konforlu öğren, tekrarlarını izle. Dinî içerikler herkes için açık.',free:'ÜCRETSİZ',paid:'PREMIUM',comparison:'Avantajları karşılaştır',trial:'3 Gün Ücretsiz Başlat',discover:'Premium’u Keşfet',later:'Şimdilik Devam Et',active:'PREMIUM AKTİF',activeDesc:'Sınırsız enerji ve gelişmiş öğrenme konforu etkin.',used:'Ücretsiz deneme kullanıldı',coming:'Abonelik yakında',eyebrow:'BİLGİ HERKESE AÇIK',compareTitle:'Bilgi ortak. Deneyim ayrıcalıklı.',compareDesc:'Üniteler, dersler ve Kur’an öğrenimi ödeme duvarının arkasında değildir. Premium öğrenme konforunu artırır.',feature:'ÖZELLİK',rows:[['15 ünite ve ana dersler','✓','✓'],['Kısım finalleri','✓','✓'],['Akıllı tekrar','✓','✓'],['Öğrenme enerjisi','30','∞'],['Tekrar geçmişi','Temel','Detaylı']],trust:'Her iki planda da dinî öğrenme içeriği erişilebilir.',disclaimer:'İlk 3 gün yalnızca bu cihazda ücretsizdir. Henüz gerçek abonelik, satın alma veya otomatik ödeme bulunmuyor.',support:'DEEN’in daha fazla kişiye ulaşmasına destek ol.',close:'Kapat',perks:'Sınırsız enerji · detaylı tekrar · ilerleme analizi'},
  en:{brand:'DEEN PREMIUM',name:'Premium benefits',headline:'A more refined way to learn.',summary:'Learn in comfort and review your progress. Religious lessons remain open to everyone.',free:'FREE',paid:'PREMIUM',comparison:'Compare benefits',trial:'Start 3 Free Days',discover:'Explore Premium',later:'Continue for now',active:'PREMIUM ACTIVE',activeDesc:'Unlimited energy and more comfortable learning are active.',used:'Free trial already used',coming:'Subscription coming soon',eyebrow:'KNOWLEDGE FOR EVERYONE',compareTitle:'Shared knowledge. More comfort.',compareDesc:'Units, lessons and Quran learning are never locked behind a payment wall. Premium enhances the experience.',feature:'BENEFIT',rows:[['15 units and lessons','✓','✓'],['Section finals','✓','✓'],['Smart review','✓','✓'],['Learning energy','30','∞'],['Review history','Basic','Detailed']],trust:'Religious educational content is accessible on both plans.',disclaimer:'The first 3 days are free on this device only. Real subscriptions, payments and auto-renewal are not available yet.',support:'Help DEEN reach more learners.',close:'Close',perks:'Unlimited energy · review history · progress insights'},
  ar:{brand:'DEEN PREMIUM',name:'مزايا Premium',headline:'تعلّم براحة أكثر.',summary:'استمتع بالتعلّم وتابع تقدّمك. المحتوى الديني متاح للجميع.',free:'مجاني',paid:'PREMIUM',comparison:'قارن المزايا',trial:'ابدأ ٣ أيام مجانًا',discover:'اكتشف Premium',later:'المتابعة الآن',active:'PREMIUM مفعّل',activeDesc:'طاقة غير محدودة وتجربة تعلم أفضل.',used:'اُستخدمت التجربة المجانية',coming:'الاشتراك قريبًا',eyebrow:'العلم للجميع',compareTitle:'المعرفة للجميع. تجربة أكثر راحة.',compareDesc:'الوحدات والدروس وتعلّم القرآن متاحة للجميع. Premium يضيف مزايا للراحة فقط.',feature:'الميزة',rows:[['١٥ وحدة ودروسها','✓','✓'],['اختبارات ختام الأقسام','✓','✓'],['المراجعة الذكية','✓','✓'],['طاقة التعلّم','٣٠','∞'],['سجل المراجعة','أساسي','مفصّل']],trust:'المحتوى التعليمي الديني متاح في كلتا الخطتين.',disclaimer:'أول ٣ أيام مجانًا على هذا الجهاز فقط. لا تتوفر بعد اشتراكات أو مدفوعات أو رسوم تلقائية.',support:'ساهم في وصول DEEN إلى مزيد من المتعلمين.',close:'إغلاق',perks:'طاقة غير محدودة · سجل مراجعة · متابعة التقدم'},
  de:{brand:'DEEN PREMIUM',name:'Premium-Vorteile',headline:'Lernen mit mehr Komfort.',summary:'Lerne entspannter und verfolge deinen Fortschritt. Religiöse Inhalte bleiben für alle offen.',free:'KOSTENLOS',paid:'PREMIUM',comparison:'Vorteile vergleichen',trial:'3 Gratistage starten',discover:'Premium entdecken',later:'Vorerst fortfahren',active:'PREMIUM AKTIV',activeDesc:'Unbegrenzte Energie und mehr Lernkomfort sind aktiv.',used:'Testphase bereits genutzt',coming:'Abo bald verfügbar',eyebrow:'WISSEN FÜR ALLE',compareTitle:'Wissen für alle. Mehr Lernkomfort.',compareDesc:'Einheiten, Lektionen und Koranlernen bleiben kostenlos zugänglich. Premium verbessert den Komfort.',feature:'VORTEIL',rows:[['15 Einheiten und Lektionen','✓','✓'],['Abschnittsprüfungen','✓','✓'],['Intelligente Wiederholung','✓','✓'],['Lernenergie','30','∞'],['Wiederholungsverlauf','Basis','Detailliert']],trust:'Religiöse Lerninhalte sind in beiden Tarifen verfügbar.',disclaimer:'Die ersten 3 Tage sind nur auf diesem Gerät kostenlos. Echte Abos, Zahlungen oder automatische Verlängerungen sind noch nicht verfügbar.',support:'Unterstütze DEEN dabei, mehr Menschen zu erreichen.',close:'Schließen',perks:'Unbegrenzte Energie · Lernverlauf · Fortschritt'},
  fr:{brand:'DEEN PREMIUM',name:'Avantages Premium',headline:'Apprendre plus sereinement.',summary:'Apprends confortablement et suis tes progrès. Les contenus religieux restent accessibles à tous.',free:'GRATUIT',paid:'PREMIUM',comparison:'Comparer les avantages',trial:'Activer 3 jours gratuits',discover:'Découvrir Premium',later:'Continuer',active:'PREMIUM ACTIF',activeDesc:'Énergie illimitée et apprentissage confortable sont actifs.',used:'Essai gratuit déjà utilisé',coming:'Abonnement bientôt disponible',eyebrow:'LE SAVOIR POUR TOUS',compareTitle:'Le savoir pour tous. Plus de confort.',compareDesc:'Les unités, les leçons et l’apprentissage du Coran sont accessibles gratuitement. Premium améliore le confort.',feature:'AVANTAGE',rows:[['15 unités et leçons','✓','✓'],['Évaluations de fin de partie','✓','✓'],['Révisions intelligentes','✓','✓'],['Énergie d’apprentissage','30','∞'],['Historique des révisions','Simple','Détaillé']],trust:'Les contenus religieux restent accessibles avec les deux offres.',disclaimer:'Les 3 premiers jours sont gratuits uniquement sur cet appareil. Aucun abonnement, paiement ni renouvellement automatique n’est encore disponible.',support:'Aide DEEN à toucher davantage de personnes.',close:'Fermer',perks:'Énergie illimitée · révisions · progression'}
 };
 const language=()=>window.DEEN_APP_LOCALE?.get?.()||document.documentElement.lang||'tr';
 const t=()=>text[language()]||text.tr;
 // Prices are display-only USD plan concepts. No payment period, receipts or ad SDK yet.
 const PLANS=Object.freeze({
  full:Object.freeze({id:'full',priceUSD:10,adsEnabled:false,unlimitedEnergy:true,advancedHistory:true,progressInsights:true,plannedUnlimitedPotions:true,plannedBadges:true}),
  supported:Object.freeze({id:'supported',priceUSD:5,adsEnabled:true,unlimitedEnergy:true,advancedHistory:true,progressInsights:true,plannedUnlimitedPotions:true,plannedBadges:true})
 });
 const planCopy={
  tr:{title:'İki Premium seçeneği',sub:'İki pakette de aynı Premium özellikleri var. Tek fark reklam deneyimi.',full:'Tam Paket',supported:'Reklamlı Premium',tag:'REKLAMSIZ',popular:'TAM DENEYİM',shared:['Sınırsız enerji ve öğrenme hakkı','Detaylı tekrar geçmişi','Gelişmiş ilerleme analizleri'],future:'İksir sistemi ve özel rozetler henüz geliştirme aşamasında.',noAds:'Reklam gösterilmez (entegrasyondan sonra)',withAds:'Reklamlar gösterilmeye devam eder (entegrasyondan sonra)',select:'Paketi seç',selected:'Seçildi',selection:'Seçtiğin paket',notCheckout:'Paket tercihin gösteriliyor; henüz satın alma veya ödeme yapılmıyor.',priceFoot:'Fiyatlar USD cinsinden taslaktır. Abonelik dönemi ve gerçek ödeme akışı daha sonra belirlenecek.',trialTitle:'İlk 3 gün ücretsiz dene',trialFoot:'Bu deneme yalnızca cihazda çalışır; bir $5/$10 aboneliği oluşturmaz.'},
  en:{title:'Choose your Premium plan',sub:'Both plans have the same Premium benefits. Only the advertising experience differs.',full:'Full Plan',supported:'Premium with Ads',tag:'NO ADS',popular:'FULL EXPERIENCE',shared:['Unlimited learning energy','Detailed review history','Advanced progress insights'],future:'Potion features and exclusive badges are still in development.',noAds:'No ads (once integrated)',withAds:'Ads remain visible (once integrated)',select:'Select plan',selected:'Selected',selection:'Selected plan',notCheckout:'This is a plan preference only; no purchase or payment is made.',priceFoot:'Prices are draft USD amounts. Billing period and checkout will be confirmed later.',trialTitle:'Try 3 days free',trialFoot:'The trial works only on this device; it does not start a $5/$10 subscription.'},
  ar:{title:'اختر خطة Premium',sub:'كلتا الخطتين تتمتعان بالمزايا نفسها؛ الاختلاف الوحيد هو الإعلانات.',full:'الباقة الكاملة',supported:'Premium مع الإعلانات',tag:'بلا إعلانات',popular:'تجربة كاملة',shared:['طاقة تعلم غير محدودة','سجل مراجعة مفصّل','تحليلات متقدمة للتقدّم'],future:'نظام الجرعات والشارات الخاصة قيد التطوير.',noAds:'بدون إعلانات عند تفعيلها',withAds:'ستبقى الإعلانات ظاهرة عند تفعيلها',select:'اختر الباقة',selected:'تم الاختيار',selection:'الباقة المختارة',notCheckout:'هذه مجرد معاينة لاختيار الباقة؛ لا تتم أي عملية شراء أو دفع.',priceFoot:'الأسعار المعروضة بالدولار هي مسودة. ستُحدّد مدة الاشتراك والدفع لاحقًا.',trialTitle:'جرّب ٣ أيام مجانًا',trialFoot:'التجربة متاحة على هذا الجهاز فقط ولا تنشئ اشتراكًا بقيمة ٥ أو ١٠ دولارات.'},
  de:{title:'Wähle deinen Premium-Tarif',sub:'Beide Tarife bieten dieselben Premium-Vorteile. Nur die Werbung unterscheidet sich.',full:'Komplettpaket',supported:'Premium mit Werbung',tag:'WERBEFREI',popular:'VOLLE ERFAHRUNG',shared:['Unbegrenzte Lernenergie','Detaillierter Wiederholungsverlauf','Erweiterte Fortschrittsanalysen'],future:'Trank-Funktion und besondere Abzeichen sind noch in Entwicklung.',noAds:'Werbefrei (nach Integration)',withAds:'Werbung bleibt sichtbar (nach Integration)',select:'Tarif auswählen',selected:'Ausgewählt',selection:'Gewählter Tarif',notCheckout:'Nur eine Tarifauswahl; es wird nichts gekauft oder bezahlt.',priceFoot:'USD-Preise sind vorläufig. Abrechnungszeitraum und Zahlung folgen später.',trialTitle:'3 Tage kostenlos testen',trialFoot:'Die Testphase gilt nur auf diesem Gerät und startet kein $5/$10-Abo.'},
  fr:{title:'Choisis ton offre Premium',sub:'Les deux offres ont les mêmes avantages. Seule la publicité change.',full:'Offre complète',supported:'Premium avec publicités',tag:'SANS PUBLICITÉ',popular:'EXPÉRIENCE COMPLÈTE',shared:['Énergie d’apprentissage illimitée','Historique détaillé des révisions','Analyses avancées des progrès'],future:'Le système de potions et les badges spéciaux sont encore en développement.',noAds:'Sans publicité (après intégration)',withAds:'Publicités maintenues (après intégration)',select:'Choisir cette offre',selected:'Sélectionné',selection:'Offre choisie',notCheckout:'Ce choix est un aperçu : aucun achat ni paiement n’est effectué.',priceFoot:'Les prix en USD sont provisoires. La période de facturation et le paiement seront définis ensuite.',trialTitle:'Essayer 3 jours gratuits',trialFoot:'Cet essai ne fonctionne que sur cet appareil et ne crée pas d’abonnement à 5 $ ou 10 $.'}
 };
 const pc=()=>planCopy[language()]||planCopy.tr;
 let selectedPlanId='full';

 const session=()=>{try{return typeof state==='object'?state:window.state||null}catch(_){return window.state||null}};
 const trial=()=>!!window.DEEN_PREMIUM_OFFER?.isTrialActive?.();
 const active=()=>!!session()?.premium||trial()||!!window.DEEN_PREMIUM_ENTITLEMENT?.active;
 const used=()=>!!window.DEEN_PREMIUM_OFFER?.isTrialUsed?.();
 function badgeContent(activeStatus){
  const c=t();
  return activeStatus?c.active:used()?c.used:c.brand;
 }
 function profileCard(){
  const root=document.getElementById('profileScreenBody');
  if(!root||!root.querySelector('.v5-profilehead'))return false;
  // Original profileView builds an obsolete Premium block near the page footer.
  // Keep exactly one entry point, above progression, badges, and settings.
  root.querySelectorAll('.deen-hub-profile,.v5-premium').forEach(node=>node.remove());
  const c=t(),enabled=active(),spent=used();
  const card=document.createElement('section');card.className='deen-hub-profile';
  card.lang=language();card.dir=language()==='ar'?'rtl':'ltr';
  card.setAttribute('aria-label',c.name);
  card.innerHTML=
   '<div class="dh-halo" aria-hidden="true">✦</div>'+
   '<div class="dh-topline"><span class="dh-crown" aria-hidden="true">✧</span><span class="dh-brand"></span><span class="dh-status"></span></div>'+
   '<h2 class="dh-headline"></h2><p class="dh-summary"></p>'+
   '<p class="dh-perks"></p>'+
   '<div class="dh-profile-actions"><button type="button" class="dh-main" data-deen-hub-action="compare"><span class="dh-main-label"></span><span aria-hidden="true">→</span></button>'+
   (!enabled&&!spent?'<button type="button" class="dh-compare" data-deen-hub-action="start"></button>':'')+'</div>';
  card.querySelector('.dh-brand').textContent=c.brand;
  card.querySelector('.dh-status').textContent=badgeContent(enabled);
  card.querySelector('.dh-headline').textContent=enabled?c.activeDesc:c.headline;
  card.querySelector('.dh-summary').textContent=c.summary;
  card.querySelector('.dh-perks').textContent=c.perks;
  card.querySelector('.dh-main-label').textContent=c.comparison;
  if(!enabled&&!spent)card.querySelector('.dh-compare').textContent=c.trial;
  if(enabled)card.classList.add('dh-is-active');
  root.querySelector('.v5-profilehead').after(card);
  return true;
 }
 function compareMarkup(){
  const c=t(),p=pc(),enabled=active(),spent=used();
  const shared=p.shared.map(item=>'<li><span aria-hidden="true">✓</span>'+item+'</li>').join('');
  function packageCard(plan){
   const isFull=plan.id==='full',picked=selectedPlanId===plan.id;
   const name=isFull?p.full:p.supported,ads=isFull?p.noAds:p.withAds;
   return '<article class="dh-tier '+(isFull?'dh-tier-full':'dh-tier-ads')+(picked?' dh-tier-selected':'')+'" data-tier="'+plan.id+'">'+
    '<div class="dh-tier-top"><span class="dh-tier-name">'+name+'</span>'+(isFull?'<span class="dh-tier-tag">'+p.popular+'</span>':'')+'</div>'+
    '<div class="dh-tier-price"><span class="dh-currency">$</span><strong>'+plan.priceUSD+'</strong><span class="dh-usd">USD</span></div>'+
    '<ul class="dh-tier-features">'+shared+'<li class="'+(isFull?'dh-tier-ad-free':'dh-tier-ad-on')+'"><span aria-hidden="true">'+(isFull?'✦':'◉')+'</span>'+ads+'</li></ul>'+
    '<button type="button" data-deen-hub-action="select-plan" data-deen-plan="'+plan.id+'" aria-pressed="'+(picked?'true':'false')+'">'+(picked?p.selected:p.select)+'</button>'+
   '</article>';
  }
  return '<div class="deen-hub-compare deen-hub-tiers" lang="'+language()+'" dir="'+(language()==='ar'?'rtl':'ltr')+'">'+
   '<div class="dh-comp-orb" aria-hidden="true">✦</div>'+
   '<p class="dh-comp-eyebrow">'+c.brand+'</p>'+
   '<h3 class="dh-comp-title">'+p.title+'</h3>'+
   '<p class="dh-comp-desc">'+p.sub+'</p>'+
   '<div class="dh-tier-grid">'+packageCard(PLANS.full)+packageCard(PLANS.supported)+'</div>'+
   '<p class="dh-tier-future">'+p.future+'</p>'+
   '<p class="dh-tier-choice" role="status">'+p.selection+': <strong data-deen-plan-chosen>'+(selectedPlanId==='full'?p.full:p.supported)+'</strong>. '+p.notCheckout+'</p>'+
   '<p class="dh-tier-price-note">'+p.priceFoot+'</p>'+
   '<p class="dh-comp-trust">✓ '+c.trust+'</p>'+
   '<div class="dh-comp-actions">'+
   (enabled?'<div class="dh-comp-active">'+c.active+'</div>':spent?'<div class="dh-comp-unavailable">'+c.coming+'</div>':
   '<button type="button" class="dh-comp-primary" data-deen-hub-action="start"><span>✦</span>'+p.trialTitle+'<span aria-hidden="true">→</span></button>')+
   '<button type="button" class="dh-comp-dismiss" data-deen-hub-action="dismiss">'+c.later+'</button></div>'+
   '<p class="dh-comp-disclaimer">'+p.trialFoot+' '+c.disclaimer+'</p>'+
   '</div>';
 }
 function comparison(){
  const c=t();
  if(typeof window.sheet==='function')window.sheet(c.name,compareMarkup());
  else{
   const sheet= document.getElementById('v5Sheet'),body=document.getElementById('v5SheetBody');
   if(sheet&&body){body.innerHTML=compareMarkup();if(!sheet.open)sheet.showModal();}
  }
  return true;
 }
 function startTrial(){
  if(active()||used()){comparison();return;}
  // Existing DEEN offer remains the only trial-start confirmation screen.
  try{if(document.getElementById('v5Sheet')?.open)window.closeSheet?.()}catch(_){}
  setTimeout(()=>window.DEEN_PREMIUM_OFFER?.open?.(),100);
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-deen-hub-action]');
  if(!button)return;
  const action=button.dataset.deenHubAction;
  if(action==='compare')comparison();
  else if(action==='start')startTrial();
  else if(action==='select-plan'){
   const value=button.dataset.deenPlan;
   if(!Object.prototype.hasOwnProperty.call(PLANS,value))return;
   selectedPlanId=value;
   const root=button.closest('.deen-hub-tiers');
   if(root){
    const html=compareMarkup(),fresh=document.createElement('div');fresh.innerHTML=html;
    root.replaceWith(fresh.firstElementChild);
   }
  }
  else if(action==='dismiss')window.closeSheet?.();
 });
 document.addEventListener('deen:profile-rendered',profileCard);
 document.addEventListener('deen:navigated',e=>{
  if(e.detail?.id==='profileScreen'||e.detail?.activeScreen==='profileScreen')queueMicrotask(profileCard);
 });
 // The old v6.9.0 Premium panel is a non-purchasable "simulation" button.
 // Replace only its presentation; do not bypass subscription entitlement guards.
 window.premiumPanel=comparison;
 try{premiumPanel=comparison}catch(_){}
 if(document.querySelector('#profileScreen.active'))queueMicrotask(profileCard);
 window.DEEN_PREMIUM_HUB=Object.freeze({comparison,renderProfile:profileCard,getSelectedPlan:()=>selectedPlanId,plans:PLANS,version:'premium-profile-hub-v2'});
})();