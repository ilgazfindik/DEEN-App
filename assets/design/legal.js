/* Privacy policy and terms of use, in the five languages of the app.
   One source for the in-app sheet (Profile > Privacy and terms) and the public pages legal/privacy.html and legal/terms.html.
   The text describes what the app really does today; when a feature changes (accounts, payments, analytics) it must be updated here. */
(()=>{
 'use strict';
 if(window.DEEN_LEGAL)return;
 const PUBLISHER='ILGAZ FINDIK';
 // Add the contact e-mail here when there is one; until then the public feedback page of the project is shown.
 const CONTACT={email:'',web:'https://github.com/ilgazfindik/DEEN-App/issues'};
 const UPDATED={tr:'9 Kasım 2026',en:'9 November 2026',de:'9. November 2026',fr:'9 novembre 2026',ar:'9 نوفمبر 2026'};
 const UI={
  tr:{row:'Gizlilik ve şartlar',privacy:'Gizlilik Politikası',terms:'Kullanım Şartları',updated:'Son güncelleme',close:'Kapat',contact:'İletişim',email:'E-posta',feedback:'Geri bildirim ve talepler',consent:'Devam ederek Kullanım Şartları ve Gizlilik Politikası’nı kabul etmiş olursun.',lang:'Dil',home:'Uygulamaya dön'},
  en:{row:'Privacy and terms',privacy:'Privacy Policy',terms:'Terms of Use',updated:'Last updated',close:'Close',contact:'Contact',email:'Email',feedback:'Feedback and requests',consent:'By continuing you accept the Terms of Use and the Privacy Policy.',lang:'Language',home:'Back to the app'},
  de:{row:'Datenschutz und Bedingungen',privacy:'Datenschutzerklärung',terms:'Nutzungsbedingungen',updated:'Zuletzt aktualisiert',close:'Schließen',contact:'Kontakt',email:'E-Mail',feedback:'Feedback und Anfragen',consent:'Wenn du fortfährst, akzeptierst du die Nutzungsbedingungen und die Datenschutzerklärung.',lang:'Sprache',home:'Zurück zur App'},
  fr:{row:'Confidentialité et conditions',privacy:'Politique de confidentialité',terms:'Conditions d’utilisation',updated:'Dernière mise à jour',close:'Fermer',contact:'Contact',email:'E-mail',feedback:'Retours et demandes',consent:'En continuant, tu acceptes les conditions d’utilisation et la politique de confidentialité.',lang:'Langue',home:'Retour à l’application'},
  ar:{row:'الخصوصية والشروط',privacy:'سياسة الخصوصية',terms:'شروط الاستخدام',updated:'آخر تحديث',close:'إغلاق',contact:'التواصل',email:'البريد الإلكتروني',feedback:'الملاحظات والطلبات',consent:'بمتابعتك فإنك توافق على شروط الاستخدام وسياسة الخصوصية.',lang:'اللغة',home:'العودة إلى التطبيق'}
 };
 // Each document: sections of [heading, [paragraph or [list items], ...]].
 const DOC={
 tr:{
  privacy:[
   ['Kimiz',['Ilnura uygulamasını '+PUBLISHER+' yayımlar ve işletir. Bu politika, uygulamayı kullanırken hangi verilerin nasıl işlendiğini açıklar.']],
   ['Hangi verileri işleriz',[['Cihazında kalan veriler: girdiğin ad, seçtiğin yoldaş, öğrenme ilerlemen (dersler, cevaplar, yanlışlar, tekrar planı, seri, XP, hedefler), Kur’an yolu ilerlemen ve ayarların (dil, ses, animasyon). Bu veriler tarayıcının yerel depolamasında tutulur; bize gönderilmez ve bizim tarafımızdan görülmez.','Hesap (etkinleştirildiğinde): uygulamaya e-posta, Google veya Apple ile giriş sunulduğunda, hesabı açmak ve doğrulamak için e-posta adresin, adın ve giriş sağlayıcısının verdiği kimlik bilgisi işlenir. Giriş altyapısını Supabase sağlar; şifren yalnızca özetlenmiş (hash) biçimde saklanır. Hesap girişi şu anda uygulamada etkin değildir.','Barındırma kayıtları: uygulama GitHub Pages üzerinden yayımlanır. GitHub, güvenlik ve işletim amacıyla IP adresi gibi bağlantı bilgilerini kendi politikasına göre kaydedebilir. Kendi analiz veya izleme aracımız yoktur.']]],
   ['Tarayıcının bağlandığı üçüncü taraflar',['Uygulamayı kullanırken tarayıcın şu hizmetlere doğrudan bağlanabilir:',['Wikimedia Commons: okuyuş kayıtlarını dinlediğinde ses dosyası oradan yüklenir; IP adresin ve tarayıcı bilgin Wikimedia tarafından görülür.','Google Fonts: yazı tipleri oradan yüklenir; IP adresin Google tarafından görülür.','YouTube (youtube-nocookie.com): yalnızca içindeki gömülü Şehadet videosunu açtığında yüklenir.','jsDelivr: hesap girişi etkinleştirildiğinde giriş kütüphanesi bu dağıtım ağından yüklenir.'],'Bu hizmetlerin kendi gizlilik politikaları vardır; verileri nasıl işlediklerini biz kontrol etmeyiz.']],
   ['Yapmadıklarımız',[['Reklam göstermeyiz ve reklam kimliği toplamayız.','Verilerini satmayız ve pazarlama amacıyla üçüncü kişilerle paylaşmayız.','Davranışını izleyen analiz, profilleme veya çerez tabanlı takip kullanmayız.','Şu anda gerçek ödeme almayız; Premium ve ödül ekranları bir simülasyondur.']]],
   ['Dinî içerik ve hassas veri',['Uygulamayı kullanman dinî inancınla ilgili sonuçlar doğurabilir. Bu tür bilgiler özel nitelikli veri sayılabilir; öğrenme verilerin cihazında kalır ve bizimle paylaşılmaz. İlerleme verisini bir hesaba bağlamayı eklersek bunu önceden bu politikada açıkça belirtir ve onayını isteriz.']],
   ['İşleme amacı ve hukuki dayanak',['Verileri uygulamayı sunmak ve güvenliğini sağlamak için işleriz. Dayanaklarımız hizmetin sunulması (sözleşme), meşru menfaat ve gerektiğinde açık rızandır (6698 sayılı KVKK ve AB Genel Veri Koruma Tüzüğü kapsamında).']],
   ['Saklama ve silme',['Cihazındaki veriler, sen tarayıcı verilerini silene veya uygulamayı kaldırana kadar kalır; silmek için tarayıcı ayarlarından site verilerini temizleyebilirsin. Hesap verileri, hesabını silmemizi isteyene kadar saklanır.']],
   ['Hakların',['Verilerin hakkında bilgi isteme, düzeltme, silme, işlenmesine itiraz etme, taşıma ve şikâyet hakkına sahipsin (KVKK madde 11; GDPR madde 15–22). Şikâyet için Kişisel Verileri Koruma Kurumu’na veya bulunduğun ülkenin veri koruma otoritesine başvurabilirsin. Taleplerini aşağıdaki iletişim bilgisinden iletebilirsin.']],
   ['Çocuklar',['Ilnura 13 yaşın altındaki çocuklara yönelik değildir ve onlardan bilerek kişisel veri toplamaz. 18 yaşından küçük kullanıcıların uygulamayı ebeveyn veya vasi rehberliğinde kullanması önerilir.']],
   ['Güvenlik',['Uygulama HTTPS üzerinden sunulur. Hiçbir sistem tamamen güvenli değildir; yine de verilerini korumak için makul önlemler alırız.']],
   ['Değişiklikler',['Bu politikayı güncelleyebiliriz. Önemli değişiklikleri uygulamada duyururuz; güncel metin her zaman burada yayımlanır.']]
  ],
  terms:[
   ['Kabul',['Ilnura’yı kullanarak bu şartları kabul etmiş olursun. Kabul etmiyorsan uygulamayı kullanma. Uygulamayı '+PUBLISHER+' yayımlar.']],
   ['Hizmet',['Ilnura, İslam’ın temel bilgilerini ve Kur’an okumasını oyunlaştırılmış derslerle öğreten ücretsiz bir eğitim uygulamasıdır.']],
   ['Dinî otorite değildir',['Uygulama bir fetva veya dinî hüküm kaynağı değildir. İçerikler Diyanet İşleri Başkanlığı yayınları, Kur’an ve hadis kaynaklarından hazırlanmıştır; bazı içerikler henüz uzman incelemesindedir ve hata içerebilir. Kişisel dinî sorularında yetkin bir din görevlisine veya âlime danış. Bir hata görürsen bize bildir.']],
   ['İçerik kaynakları ve lisanslar',['Arapça metin Tanzil Projesi’nden (CC BY 3.0), Türkçe meal Elmalılı Hamdi Yazır’dan, İngilizce meal Pickthall’dan (kamu malı) alınmıştır; okuyuş kayıtları Wikimedia Commons’taki lisanslı kayıtlardır. Ayrıntılar uygulamadaki “Kaynaklar ve teşekkürler” bölümündedir. Üçüncü taraf içerikler kendi lisanslarına tabidir.']],
   ['Kullanım kuralları',[['Uygulamayı yasalara ve genel ahlaka uygun kullanırsın.','Uygulamanın korumalarını, sınırlarını veya güvenliğini aşmaya çalışmazsın.','İçeriği otomatik araçlarla toplayıp kopyalamazsın.','Başkalarının haklarını ihlal etmezsin.']]],
   ['Hesap',['Hesap girişi etkinleştirildiğinde bilgilerinin doğru olması ve hesabının güvenliği senin sorumluluğundadır.']],
   ['Premium ve ödüller',['Şu anda Premium ve ödül (enerji) ekranları bir simülasyondur; gerçek ödeme alınmaz. Ücretli bir özellik eklenirse fiyatı ve koşulları satın almadan önce açıkça gösterilir.']],
   ['Fikrî haklar',['Uygulamanın tasarımı, kodu, adı ve özgün içerikleri yayımcıya aittir. Üçüncü taraf içerikler sahiplerinin lisanslarıyla kullanılır.']],
   ['Sorumluluğun sınırı',['Uygulama “olduğu gibi” sunulur; kesintisiz veya hatasız çalışacağı garanti edilmez. İlerlemen cihazında tutulduğundan, tarayıcı verilerini silmen hâlinde kaybolabilir. Kanunun izin verdiği ölçüde, uygulamanın kullanımından doğan dolaylı zararlardan sorumlu değiliz; zorunlu tüketici haklarına dokunulmaz.']],
   ['Değişiklik ve sona erme',['Hizmeti veya bu şartları değiştirebilir ya da hizmeti durdurabiliriz. Önemli değişiklikler uygulamada duyurulur. Değişiklikten sonra kullanmaya devam etmen yeni şartları kabul ettiğin anlamına gelir.']],
   ['Uygulanacak hukuk',['Bu şartlara Türkiye Cumhuriyeti hukuku uygulanır. Zorunlu tüketici koruma hükümleri saklıdır.']]
  ]},
 en:{
  privacy:[
   ['Who we are',['Ilnura is published and operated by '+PUBLISHER+'. This policy explains which data is processed, and how, when you use the app.']],
   ['What data we process',[['Data that stays on your device: the name you enter, the companion you choose, your learning progress (lessons, answers, mistakes, review plan, streak, XP, goals), your Quran path progress and your settings (language, sound, animation). It is kept in your browser’s local storage; it is not sent to us and we cannot see it.','Account (when enabled): if the app offers sign-in with email, Google or Apple, your email address, name and the identifier given by the sign-in provider are processed to create and verify the account. The sign-in infrastructure is provided by Supabase; your password is stored only in hashed form. Sign-in is not active in the app at the moment.','Hosting records: the app is served through GitHub Pages. GitHub may log connection data such as the IP address for security and operation, under its own policy. We run no analytics or tracking tool of our own.']]],
   ['Third parties your browser connects to',['While you use the app, your browser may connect directly to these services:',['Wikimedia Commons: when you listen to a recitation, the audio file is loaded from there; your IP address and browser details are visible to Wikimedia.','Google Fonts: typefaces are loaded from there; your IP address is visible to Google.','YouTube (youtube-nocookie.com): loaded only if you open the embedded Shahada video.','jsDelivr: when sign-in is enabled, the sign-in library is loaded from this delivery network.'],'These services have their own privacy policies; we do not control how they process data.']],
   ['What we do not do',[['We do not show ads and do not collect advertising identifiers.','We do not sell your data or share it with third parties for marketing.','We do not use analytics, profiling or cookie-based tracking of your behaviour.','We do not take real payments at the moment; the Premium and reward screens are a simulation.']]],
   ['Religious content and sensitive data',['Using the app can say something about your religious belief. Such information can count as a special category of data; your learning data stays on your device and is not shared with us. If we ever link progress data to an account, we will say so clearly in this policy beforehand and ask for your consent.']],
   ['Purpose and legal basis',['We process data to provide the app and keep it secure. Our bases are providing the service (contract), legitimate interest and, where required, your explicit consent (under Turkish Law No. 6698 (KVKK) and the EU General Data Protection Regulation).']],
   ['Retention and deletion',['Data on your device stays until you clear your browser data or remove the app; you can delete it by clearing site data in your browser settings. Account data is kept until you ask us to delete your account.']],
   ['Your rights',['You have the right to ask for information about your data, to have it corrected or deleted, to object to its processing, to portability and to lodge a complaint (KVKK Article 11; GDPR Articles 15–22). You can complain to the Turkish Personal Data Protection Authority or to the data protection authority of your country. You can send your requests through the contact details below.']],
   ['Children',['Ilnura is not directed at children under 13 and does not knowingly collect personal data from them. Users under 18 are advised to use the app with the guidance of a parent or guardian.']],
   ['Security',['The app is served over HTTPS. No system is completely secure; we take reasonable measures to protect your data.']],
   ['Changes',['We may update this policy. Important changes are announced in the app; the current text is always published here.']]
  ],
  terms:[
   ['Acceptance',['By using Ilnura you accept these terms. If you do not accept them, do not use the app. The app is published by '+PUBLISHER+'.']],
   ['The service',['Ilnura is a free educational app that teaches the basics of Islam and Quran reading through gamified lessons.']],
   ['Not a religious authority',['The app is not a source of fatwas or religious rulings. Its content is prepared from publications of the Turkish Presidency of Religious Affairs (Diyanet), the Quran and hadith sources; some content is still under expert review and may contain mistakes. For personal religious questions, consult a qualified religious scholar. If you see a mistake, please tell us.']],
   ['Content sources and licences',['The Arabic text comes from the Tanzil Project (CC BY 3.0), the Turkish translation from Elmalılı Hamdi Yazır and the English translation from Pickthall (public domain); the recitations are licensed recordings on Wikimedia Commons. Details are in the “Sources and credits” section of the app. Third-party content is subject to its own licences.']],
   ['Rules of use',[['You use the app in line with the law and public morality.','You do not try to get around the app’s protections, limits or security.','You do not collect or copy the content with automated tools.','You do not infringe the rights of others.']]],
   ['Account',['When sign-in is enabled, you are responsible for giving accurate information and for the security of your account.']],
   ['Premium and rewards',['At the moment the Premium and reward (energy) screens are a simulation; no real payment is taken. If a paid feature is added, its price and conditions will be shown clearly before you buy.']],
   ['Intellectual property',['The design, code, name and original content of the app belong to the publisher. Third-party content is used under its owners’ licences.']],
   ['Limitation of liability',['The app is provided “as is”; uninterrupted or error-free operation is not guaranteed. Because your progress is kept on your device, it can be lost if you clear your browser data. To the extent the law allows, we are not liable for indirect damages arising from use of the app; mandatory consumer rights are not affected.']],
   ['Changes and ending',['We may change the service or these terms, or stop the service. Important changes are announced in the app. Continuing to use the app after a change means you accept the new terms.']],
   ['Governing law',['These terms are governed by the law of the Republic of Türkiye. Mandatory consumer protection provisions remain reserved.']]
  ]},
 de:{
  privacy:[
   ['Wer wir sind',['Ilnura wird von '+PUBLISHER+' herausgegeben und betrieben. Diese Erklärung beschreibt, welche Daten bei der Nutzung der App wie verarbeitet werden.']],
   ['Welche Daten wir verarbeiten',[['Daten, die auf deinem Gerät bleiben: dein eingegebener Name, der gewählte Begleiter, dein Lernfortschritt (Lektionen, Antworten, Fehler, Wiederholungsplan, Serie, XP, Ziele), dein Fortschritt im Koranpfad und deine Einstellungen (Sprache, Ton, Animation). Sie werden im lokalen Speicher deines Browsers gehalten; sie werden nicht an uns gesendet, und wir können sie nicht sehen.','Konto (wenn aktiviert): Wenn die App die Anmeldung mit E-Mail, Google oder Apple anbietet, werden deine E-Mail-Adresse, dein Name und die vom Anmeldeanbieter gelieferte Kennung verarbeitet, um das Konto anzulegen und zu bestätigen. Die Anmelde-Infrastruktur stellt Supabase bereit; dein Passwort wird nur als Hash gespeichert. Die Anmeldung ist in der App derzeit nicht aktiv.','Hosting-Protokolle: Die App wird über GitHub Pages ausgeliefert. GitHub kann Verbindungsdaten wie die IP-Adresse zu Sicherheits- und Betriebszwecken nach eigener Richtlinie protokollieren. Wir betreiben kein eigenes Analyse- oder Tracking-Werkzeug.']]],
   ['Dritte, mit denen sich dein Browser verbindet',['Während du die App nutzt, kann sich dein Browser direkt mit diesen Diensten verbinden:',['Wikimedia Commons: Wenn du eine Rezitation anhörst, wird die Audiodatei von dort geladen; deine IP-Adresse und Browserangaben sind für Wikimedia sichtbar.','Google Fonts: Schriftarten werden von dort geladen; deine IP-Adresse ist für Google sichtbar.','YouTube (youtube-nocookie.com): wird nur geladen, wenn du das eingebettete Schahada-Video öffnest.','jsDelivr: Wenn die Anmeldung aktiviert ist, wird die Anmelde-Bibliothek von diesem Auslieferungsnetzwerk geladen.'],'Diese Dienste haben eigene Datenschutzerklärungen; wir haben keinen Einfluss darauf, wie sie Daten verarbeiten.']],
   ['Was wir nicht tun',[['Wir zeigen keine Werbung und erfassen keine Werbekennungen.','Wir verkaufen deine Daten nicht und geben sie nicht zu Marketingzwecken an Dritte weiter.','Wir nutzen keine Analyse, kein Profiling und kein Cookie-basiertes Tracking deines Verhaltens.','Wir nehmen derzeit keine echten Zahlungen entgegen; die Bildschirme für Premium und Belohnungen sind eine Simulation.']]],
   ['Religiöse Inhalte und sensible Daten',['Die Nutzung der App kann etwas über deinen religiösen Glauben aussagen. Solche Angaben können als besondere Kategorie von Daten gelten; deine Lerndaten bleiben auf deinem Gerät und werden nicht mit uns geteilt. Sollten wir Fortschrittsdaten jemals mit einem Konto verbinden, werden wir das vorher in dieser Erklärung klar nennen und um deine Einwilligung bitten.']],
   ['Zweck und Rechtsgrundlage',['Wir verarbeiten Daten, um die App bereitzustellen und sicher zu halten. Grundlagen sind die Bereitstellung des Dienstes (Vertrag), berechtigtes Interesse und, wo nötig, deine ausdrückliche Einwilligung (nach dem türkischen Gesetz Nr. 6698 (KVKK) und der EU-Datenschutz-Grundverordnung).']],
   ['Speicherung und Löschung',['Daten auf deinem Gerät bleiben, bis du deine Browserdaten löschst oder die App entfernst; zum Löschen kannst du in den Browsereinstellungen die Websitedaten löschen. Kontodaten werden gespeichert, bis du die Löschung deines Kontos verlangst.']],
   ['Deine Rechte',['Du hast das Recht auf Auskunft über deine Daten, auf Berichtigung und Löschung, auf Widerspruch gegen die Verarbeitung, auf Datenübertragbarkeit und auf Beschwerde (KVKK Art. 11; DSGVO Art. 15–22). Du kannst dich bei der türkischen Datenschutzbehörde oder der Datenschutzbehörde deines Landes beschweren. Deine Anfragen kannst du über die Kontaktangaben unten senden.']],
   ['Kinder',['Ilnura richtet sich nicht an Kinder unter 13 Jahren und erhebt von ihnen nicht wissentlich personenbezogene Daten. Nutzern unter 18 Jahren wird empfohlen, die App mit Anleitung eines Elternteils oder Vormunds zu nutzen.']],
   ['Sicherheit',['Die App wird über HTTPS ausgeliefert. Kein System ist völlig sicher; wir treffen angemessene Maßnahmen zum Schutz deiner Daten.']],
   ['Änderungen',['Wir können diese Erklärung aktualisieren. Wichtige Änderungen werden in der App bekannt gegeben; der aktuelle Text wird stets hier veröffentlicht.']]
  ],
  terms:[
   ['Zustimmung',['Mit der Nutzung von Ilnura akzeptierst du diese Bedingungen. Wenn du sie nicht akzeptierst, nutze die App nicht. Die App wird von '+PUBLISHER+' herausgegeben.']],
   ['Der Dienst',['Ilnura ist eine kostenlose Lern-App, die mit spielerischen Lektionen die Grundlagen des Islam und das Lesen des Korans vermittelt.']],
   ['Keine religiöse Autorität',['Die App ist keine Quelle für Fatwas oder religiöse Urteile. Ihre Inhalte beruhen auf Veröffentlichungen des türkischen Präsidiums für Religionsangelegenheiten (Diyanet), dem Koran und Hadith-Quellen; manche Inhalte werden noch von Fachleuten geprüft und können Fehler enthalten. Bei persönlichen religiösen Fragen wende dich an eine kundige religiöse Fachperson. Wenn du einen Fehler siehst, sag es uns bitte.']],
   ['Inhaltsquellen und Lizenzen',['Der arabische Text stammt vom Tanzil-Projekt (CC BY 3.0), die türkische Übersetzung von Elmalılı Hamdi Yazır und die englische Übersetzung von Pickthall (gemeinfrei); die Rezitationen sind lizenzierte Aufnahmen auf Wikimedia Commons. Einzelheiten stehen im Bereich „Quellen und Dank“ der App. Inhalte Dritter unterliegen ihren eigenen Lizenzen.']],
   ['Nutzungsregeln',[['Du nutzt die App im Einklang mit Gesetz und guten Sitten.','Du versuchst nicht, Schutzmechanismen, Grenzen oder die Sicherheit der App zu umgehen.','Du sammelst oder kopierst die Inhalte nicht mit automatisierten Werkzeugen.','Du verletzt keine Rechte anderer.']]],
   ['Konto',['Wenn die Anmeldung aktiviert ist, bist du für richtige Angaben und die Sicherheit deines Kontos verantwortlich.']],
   ['Premium und Belohnungen',['Derzeit sind die Bildschirme für Premium und Belohnungen (Energie) eine Simulation; es wird keine echte Zahlung entgegengenommen. Wird eine kostenpflichtige Funktion hinzugefügt, werden Preis und Bedingungen vor dem Kauf klar angezeigt.']],
   ['Geistiges Eigentum',['Gestaltung, Code, Name und eigene Inhalte der App gehören dem Herausgeber. Inhalte Dritter werden unter den Lizenzen ihrer Inhaber verwendet.']],
   ['Haftungsbeschränkung',['Die App wird „wie besehen“ bereitgestellt; ein unterbrechungs- oder fehlerfreier Betrieb wird nicht garantiert. Da dein Fortschritt auf deinem Gerät gespeichert ist, kann er verloren gehen, wenn du deine Browserdaten löschst. Soweit gesetzlich zulässig, haften wir nicht für mittelbare Schäden aus der Nutzung der App; zwingende Verbraucherrechte bleiben unberührt.']],
   ['Änderungen und Beendigung',['Wir können den Dienst oder diese Bedingungen ändern oder den Dienst einstellen. Wichtige Änderungen werden in der App bekannt gegeben. Wenn du die App nach einer Änderung weiter nutzt, akzeptierst du die neuen Bedingungen.']],
   ['Anwendbares Recht',['Für diese Bedingungen gilt das Recht der Republik Türkei. Zwingende Verbraucherschutzvorschriften bleiben vorbehalten.']]
  ]},
 fr:{
  privacy:[
   ['Qui nous sommes',['Ilnura est publiée et exploitée par '+PUBLISHER+'. Cette politique explique quelles données sont traitées, et comment, lorsque tu utilises l’application.']],
   ['Quelles données nous traitons',[['Données qui restent sur ton appareil : le nom que tu saisis, le compagnon que tu choisis, ta progression d’apprentissage (leçons, réponses, erreurs, plan de révision, série, XP, objectifs), ta progression dans le parcours coranique et tes réglages (langue, son, animation). Elles sont conservées dans le stockage local de ton navigateur ; elles ne nous sont pas envoyées et nous ne pouvons pas les voir.','Compte (lorsqu’il est activé) : si l’application propose la connexion par e-mail, Google ou Apple, ton adresse e-mail, ton nom et l’identifiant fourni par le fournisseur de connexion sont traités pour créer et vérifier le compte. L’infrastructure de connexion est fournie par Supabase ; ton mot de passe n’est conservé que sous forme hachée. La connexion n’est pas active dans l’application pour le moment.','Journaux d’hébergement : l’application est diffusée via GitHub Pages. GitHub peut enregistrer des données de connexion telles que l’adresse IP, pour la sécurité et le fonctionnement, selon sa propre politique. Nous n’utilisons aucun outil d’analyse ou de suivi qui nous soit propre.']]],
   ['Tiers auxquels ton navigateur se connecte',['Pendant que tu utilises l’application, ton navigateur peut se connecter directement à ces services :',['Wikimedia Commons : quand tu écoutes une récitation, le fichier audio y est chargé ; ton adresse IP et les informations de ton navigateur sont visibles par Wikimedia.','Google Fonts : les polices y sont chargées ; ton adresse IP est visible par Google.','YouTube (youtube-nocookie.com) : chargé uniquement si tu ouvres la vidéo intégrée de la chahada.','jsDelivr : lorsque la connexion est activée, la bibliothèque de connexion est chargée depuis ce réseau de diffusion.'],'Ces services ont leurs propres politiques de confidentialité ; nous ne contrôlons pas la façon dont ils traitent les données.']],
   ['Ce que nous ne faisons pas',[['Nous n’affichons pas de publicité et ne collectons pas d’identifiants publicitaires.','Nous ne vendons pas tes données et ne les partageons pas avec des tiers à des fins de marketing.','Nous n’utilisons ni analyse, ni profilage, ni suivi de ton comportement par cookies.','Nous ne prenons actuellement aucun paiement réel ; les écrans Premium et récompenses sont une simulation.']]],
   ['Contenu religieux et données sensibles',['L’utilisation de l’application peut révéler quelque chose de tes convictions religieuses. Ces informations peuvent constituer une catégorie particulière de données ; tes données d’apprentissage restent sur ton appareil et ne sont pas partagées avec nous. Si nous devions un jour lier la progression à un compte, nous l’indiquerions clairement à l’avance dans cette politique et te demanderions ton consentement.']],
   ['Finalité et base juridique',['Nous traitons des données pour fournir l’application et en assurer la sécurité. Nos bases sont la fourniture du service (contrat), l’intérêt légitime et, lorsque c’est requis, ton consentement explicite (au titre de la loi turque n° 6698 (KVKK) et du Règlement général sur la protection des données de l’UE).']],
   ['Conservation et suppression',['Les données sur ton appareil restent jusqu’à ce que tu effaces les données de ton navigateur ou désinstalles l’application ; pour les supprimer, efface les données du site dans les réglages de ton navigateur. Les données de compte sont conservées jusqu’à ce que tu demandes la suppression de ton compte.']],
   ['Tes droits',['Tu as le droit de demander des informations sur tes données, de les faire rectifier ou supprimer, de t’opposer à leur traitement, à la portabilité et d’introduire une réclamation (KVKK art. 11 ; RGPD art. 15 à 22). Tu peux saisir l’autorité turque de protection des données personnelles ou l’autorité de protection des données de ton pays. Tu peux envoyer tes demandes via les coordonnées ci-dessous.']],
   ['Enfants',['Ilnura ne s’adresse pas aux enfants de moins de 13 ans et ne collecte pas sciemment de données personnelles auprès d’eux. Il est conseillé aux utilisateurs de moins de 18 ans d’utiliser l’application avec l’accompagnement d’un parent ou tuteur.']],
   ['Sécurité',['L’application est diffusée en HTTPS. Aucun système n’est totalement sûr ; nous prenons des mesures raisonnables pour protéger tes données.']],
   ['Modifications',['Nous pouvons mettre à jour cette politique. Les changements importants sont annoncés dans l’application ; le texte en vigueur est toujours publié ici.']]
  ],
  terms:[
   ['Acceptation',['En utilisant Ilnura, tu acceptes ces conditions. Si tu ne les acceptes pas, n’utilise pas l’application. L’application est publiée par '+PUBLISHER+'.']],
   ['Le service',['Ilnura est une application éducative gratuite qui enseigne les bases de l’islam et la lecture du Coran au moyen de leçons ludiques.']],
   ['Pas une autorité religieuse',['L’application n’est pas une source de fatwas ni d’avis religieux. Ses contenus sont préparés à partir de publications de la Présidence turque des affaires religieuses (Diyanet), du Coran et de sources de hadiths ; certains contenus sont encore en cours de relecture par des spécialistes et peuvent contenir des erreurs. Pour tes questions religieuses personnelles, consulte un spécialiste religieux compétent. Si tu vois une erreur, signale-la-nous.']],
   ['Sources du contenu et licences',['Le texte arabe provient du projet Tanzil (CC BY 3.0), la traduction turque d’Elmalılı Hamdi Yazır et la traduction anglaise de Pickthall (domaine public) ; les récitations sont des enregistrements sous licence de Wikimedia Commons. Les détails se trouvent dans la section « Sources et remerciements » de l’application. Les contenus de tiers relèvent de leurs propres licences.']],
   ['Règles d’utilisation',[['Tu utilises l’application dans le respect de la loi et des bonnes mœurs.','Tu n’essaies pas de contourner les protections, les limites ou la sécurité de l’application.','Tu ne collectes ni ne copies le contenu avec des outils automatisés.','Tu ne portes pas atteinte aux droits d’autrui.']]],
   ['Compte',['Lorsque la connexion est activée, tu es responsable de l’exactitude des informations fournies et de la sécurité de ton compte.']],
   ['Premium et récompenses',['Pour le moment, les écrans Premium et récompenses (énergie) sont une simulation ; aucun paiement réel n’est pris. Si une fonctionnalité payante est ajoutée, son prix et ses conditions seront clairement affichés avant l’achat.']],
   ['Propriété intellectuelle',['La conception, le code, le nom et les contenus originaux de l’application appartiennent à l’éditeur. Les contenus de tiers sont utilisés selon les licences de leurs titulaires.']],
   ['Limitation de responsabilité',['L’application est fournie « en l’état » ; un fonctionnement ininterrompu ou sans erreur n’est pas garanti. Ta progression étant conservée sur ton appareil, elle peut être perdue si tu effaces les données de ton navigateur. Dans la mesure permise par la loi, nous ne sommes pas responsables des dommages indirects résultant de l’utilisation de l’application ; les droits impératifs des consommateurs ne sont pas affectés.']],
   ['Modification et fin',['Nous pouvons modifier le service ou ces conditions, ou arrêter le service. Les changements importants sont annoncés dans l’application. Continuer à utiliser l’application après un changement signifie que tu acceptes les nouvelles conditions.']],
   ['Droit applicable',['Ces conditions sont régies par le droit de la République de Türkiye. Les dispositions impératives de protection des consommateurs demeurent réservées.']]
  ]},
 ar:{
  privacy:[
   ['من نحن',['يُصدر تطبيق Ilnura ويشغّله '+PUBLISHER+'. توضح هذه السياسة أي البيانات تُعالَج وكيف عند استخدامك التطبيق.']],
   ['البيانات التي نعالجها',[['بيانات تبقى على جهازك: الاسم الذي تدخله، والرفيق الذي تختاره، وتقدمك في التعلّم (الدروس والإجابات والأخطاء وخطة المراجعة والسلسلة ونقاط الخبرة والأهداف)، وتقدمك في مسار القرآن، وإعداداتك (اللغة والصوت والحركة). تُحفظ في التخزين المحلي لمتصفحك، ولا تُرسل إلينا ولا نراها.','الحساب (عند تفعيله): إذا قدّم التطبيق تسجيل الدخول بالبريد الإلكتروني أو Google أو Apple فتُعالَج عنوان بريدك واسمك والمعرّف الذي يقدّمه مزوّد الدخول لإنشاء الحساب والتحقق منه. تقدّم Supabase البنية التحتية لتسجيل الدخول، وتُخزَّن كلمة مرورك في صورة مُجزّأة (hash) فقط. تسجيل الدخول غير مفعّل في التطبيق حاليًا.','سجلات الاستضافة: يُقدَّم التطبيق عبر GitHub Pages. قد يسجّل GitHub بيانات الاتصال كعنوان IP لأغراض الأمان والتشغيل وفق سياسته الخاصة. ولا نستخدم أي أداة تحليل أو تتبع خاصة بنا.']]],
   ['جهات خارجية يتصل بها متصفحك',['أثناء استخدامك التطبيق قد يتصل متصفحك مباشرة بهذه الخدمات:',['ويكيميديا كومنز: عند الاستماع إلى تلاوة يُحمَّل الملف الصوتي من هناك، ويظهر عنوان IP وبيانات متصفحك لويكيميديا.','خطوط Google: تُحمَّل الخطوط من هناك، ويظهر عنوان IP لدى Google.','يوتيوب (youtube-nocookie.com): لا يُحمَّل إلا إذا فتحت فيديو الشهادة المضمَّن.','jsDelivr: عند تفعيل تسجيل الدخول تُحمَّل مكتبة الدخول من شبكة التوزيع هذه.'],'لهذه الخدمات سياسات خصوصية خاصة بها، ولا نتحكم في كيفية معالجتها للبيانات.']],
   ['ما لا نفعله',[['لا نعرض إعلانات ولا نجمع معرّفات إعلانية.','لا نبيع بياناتك ولا نشاركها مع أطراف ثالثة لأغراض التسويق.','لا نستخدم التحليلات أو بناء ملفات التعريف أو التتبع بملفات تعريف الارتباط لسلوكك.','لا نقبل مدفوعات حقيقية حاليًا؛ شاشتا Premium والمكافآت محاكاة.']]],
   ['المحتوى الديني والبيانات الحساسة',['قد يدل استخدامك التطبيق على شيء من معتقدك الديني. وقد تُعد هذه المعلومات فئة خاصة من البيانات؛ وتبقى بيانات تعلّمك على جهازك ولا تُشارَك معنا. وإذا ربطنا يومًا بيانات التقدم بحساب فسنذكر ذلك بوضوح في هذه السياسة مسبقًا ونطلب موافقتك.']],
   ['الغرض والأساس القانوني',['نعالج البيانات لتقديم التطبيق وحفظ أمنه. وأسسنا هي تقديم الخدمة (العقد) والمصلحة المشروعة، وعند اللزوم موافقتك الصريحة (بموجب القانون التركي رقم 6698 (KVKK) واللائحة العامة لحماية البيانات في الاتحاد الأوروبي).']],
   ['الاحتفاظ والحذف',['تبقى البيانات على جهازك حتى تمسح بيانات المتصفح أو تزيل التطبيق؛ ولحذفها امسح بيانات الموقع من إعدادات المتصفح. وتُحفظ بيانات الحساب حتى تطلب حذف حسابك.']],
   ['حقوقك',['لك الحق في طلب معلومات عن بياناتك وتصحيحها وحذفها والاعتراض على معالجتها ونقلها وتقديم شكوى (المادة 11 من KVKK؛ المواد 15–22 من GDPR). ويمكنك التقدم بشكوى إلى هيئة حماية البيانات الشخصية التركية أو إلى هيئة حماية البيانات في بلدك. ويمكنك إرسال طلباتك عبر بيانات التواصل أدناه.']],
   ['الأطفال',['لا يستهدف Ilnura الأطفال دون 13 عامًا ولا يجمع منهم بيانات شخصية عن علم. ويُنصح من هم دون 18 عامًا باستخدام التطبيق بإرشاد أحد الوالدين أو الوصي.']],
   ['الأمان',['يُقدَّم التطبيق عبر HTTPS. لا يوجد نظام آمن تمامًا؛ ونتخذ إجراءات معقولة لحماية بياناتك.']],
   ['التغييرات',['قد نحدّث هذه السياسة. وتُعلَن التغييرات المهمة في التطبيق، ويُنشر النص الحالي هنا دائمًا.']]
  ],
  terms:[
   ['القبول',['باستخدامك Ilnura فإنك توافق على هذه الشروط. وإن لم توافق فلا تستخدم التطبيق. يُصدر التطبيق '+PUBLISHER+'.']],
   ['الخدمة',['Ilnura تطبيق تعليمي مجاني يعلّم أساسيات الإسلام وقراءة القرآن عبر دروس تفاعلية.']],
   ['ليس مرجعًا دينيًا',['التطبيق ليس مصدرًا للفتاوى أو الأحكام الدينية. أُعدّ محتواه من منشورات رئاسة الشؤون الدينية التركية (ديانت) والقرآن ومصادر الحديث؛ وبعض المحتوى ما زال قيد مراجعة المختصين وقد يحتوي أخطاء. وفي أسئلتك الدينية الشخصية استشر عالمًا أو مختصًا دينيًا مؤهلًا. وإن رأيت خطأً فأخبرنا به.']],
   ['مصادر المحتوى والتراخيص',['النص العربي من مشروع تنزيل (CC BY 3.0)، والترجمة التركية من إلماليلي حمدي يازر، والترجمة الإنجليزية من بيكثال (ملك عام)؛ والتلاوات تسجيلات مرخّصة على ويكيميديا كومنز. وتجد التفاصيل في قسم «المصادر والشكر» في التطبيق. ويخضع محتوى الأطراف الثالثة لتراخيصه الخاصة.']],
   ['قواعد الاستخدام',[['تستخدم التطبيق وفق القانون والآداب العامة.','لا تحاول التحايل على حمايات التطبيق أو حدوده أو أمنه.','لا تجمع المحتوى ولا تنسخه بأدوات آلية.','لا تنتهك حقوق الآخرين.']]],
   ['الحساب',['عند تفعيل تسجيل الدخول تكون مسؤولًا عن صحة معلوماتك وعن أمان حسابك.']],
   ['Premium والمكافآت',['شاشتا Premium والمكافآت (الطاقة) محاكاة حاليًا ولا تُقبل مدفوعات حقيقية. وإذا أُضيفت ميزة مدفوعة فسيظهر سعرها وشروطها بوضوح قبل الشراء.']],
   ['الملكية الفكرية',['تصميم التطبيق وشيفرته واسمه ومحتواه الأصلي ملك للناشر. ويُستخدم محتوى الأطراف الثالثة وفق تراخيص أصحابه.']],
   ['حدود المسؤولية',['يُقدَّم التطبيق «كما هو»، ولا يُضمن تشغيله دون انقطاع أو أخطاء. وبما أن تقدمك محفوظ على جهازك فقد يضيع إذا مسحت بيانات المتصفح. وبالقدر الذي يسمح به القانون لا نتحمل المسؤولية عن الأضرار غير المباشرة الناشئة عن استخدام التطبيق، ولا تتأثر حقوق المستهلك الإلزامية.']],
   ['التغيير والإنهاء',['قد نغيّر الخدمة أو هذه الشروط أو نوقف الخدمة. وتُعلَن التغييرات المهمة في التطبيق. واستمرارك في الاستخدام بعد التغيير يعني قبولك الشروط الجديدة.']],
   ['القانون المطبّق',['تخضع هذه الشروط لقانون جمهورية تركيا، مع بقاء أحكام حماية المستهلك الإلزامية محفوظة.']]
  ]}
 };
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const SUPPORTED=['tr','en','de','fr','ar'];
 function lang(){
  try{const a=window.DEEN_APP_LOCALE?.get?.();if(SUPPORTED.includes(a))return a}catch(_){}
  try{const q=new URLSearchParams(location.search).get('lang');if(SUPPORTED.includes(q))return q}catch(_){}
  try{const s=localStorage.getItem('deen_app_language_v1');if(SUPPORTED.includes(s))return s}catch(_){}
  try{const n=(navigator.language||'tr').slice(0,2).toLowerCase();if(SUPPORTED.includes(n))return n}catch(_){}
  return 'tr';
 }
 const ui=l=>UI[l]||UI.tr;
 function contactHtml(l){
  const u=ui(l);
  return '<section class="dlg-sec"><h3>'+esc(u.contact)+'</h3><p>'+(CONTACT.email?esc(u.email)+': <a href="mailto:'+esc(CONTACT.email)+'">'+esc(CONTACT.email)+'</a>':esc(u.feedback)+': <a href="'+esc(CONTACT.web)+'" target="_blank" rel="noopener">'+esc(CONTACT.web.replace(/^https?:\/\//,''))+'</a>')+'</p></section>';
 }
 // The text of one document as HTML (no outer wrapper).
 function body(l,doc){
  const u=ui(l),secs=(DOC[l]||DOC.tr)[doc]||[];
  const num=(i)=>(i+1)+'. ';
  return '<p class="dlg-meta">'+esc(u.updated)+': '+esc(UPDATED[l]||UPDATED.tr)+' · '+esc(PUBLISHER)+'</p>'+secs.map((sec,i)=>'<section class="dlg-sec"><h3>'+esc(num(i)+sec[0])+'</h3>'+sec[1].map(p=>Array.isArray(p)?'<ul>'+p.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<p>'+esc(p)+'</p>').join('')+'</section>').join('')+contactHtml(l);
 }
 const CSS='.dlg{color:#d7ebe6;font:600 14px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif}.dlg-tabs{display:flex;gap:8px;margin:0 0 14px}.dlg-tab{flex:1;padding:10px 8px;border:1px solid rgba(255,255,255,.16);border-radius:14px;background:rgba(255,255,255,.05);color:#d7ebe6;font:800 13px/1.2 inherit;cursor:pointer}.dlg-tab[aria-selected=true]{background:#2fd4b0;border-color:#2fd4b0;color:#06222a}.dlg-meta{margin:0 0 12px;color:#9bb7b0;font-size:12px;font-weight:700}.dlg-sec{margin:0 0 16px}.dlg-sec h3{margin:0 0 6px;font-size:15px;font-weight:900;color:#eaf6f2}.dlg-sec p{margin:0 0 8px}.dlg-sec ul{margin:0 0 8px;padding-inline-start:20px}.dlg-sec li{margin:0 0 6px}.dlg a{color:#65f6da}';
 let styled=false;
 function addStyle(){if(styled||typeof document==='undefined')return;styled=true;const s=document.createElement('style');s.id='deen-legal-style';s.textContent=CSS;document.head.appendChild(s)}
 function sheetHtml(l,doc){
  const u=ui(l);
  return '<div class="dlg" dir="'+(l==='ar'?'rtl':'ltr')+'" lang="'+l+'"><div class="dlg-tabs" role="tablist"><button type="button" class="dlg-tab" role="tab" data-legal-tab="privacy" aria-selected="'+(doc==='privacy')+'">'+esc(u.privacy)+'</button><button type="button" class="dlg-tab" role="tab" data-legal-tab="terms" aria-selected="'+(doc==='terms')+'">'+esc(u.terms)+'</button></div><div class="dlg-body">'+body(l,doc)+'</div></div>';
 }
 // In the app: the legacy bottom sheet shows both documents as two tabs.
 function open(doc){
  const l=lang(),d=doc==='terms'?'terms':'privacy',u=ui(l);
  addStyle();
  try{sheet(u.row,sheetHtml(l,d));return true}catch(_){return false}
 }
 if(typeof document!=='undefined')document.addEventListener('click',e=>{
  const t=e.target.closest?.('[data-legal-tab]');if(!t)return;
  const wrap=t.closest('.dlg');if(!wrap)return;
  const l=lang(),d=t.dataset.legalTab==='terms'?'terms':'privacy';
  wrap.querySelectorAll('[data-legal-tab]').forEach(b=>b.setAttribute('aria-selected',String(b===t)));
  wrap.querySelector('.dlg-body').innerHTML=body(l,d);
  const sc=wrap.closest('#v5SheetBody,.sheet-body,dialog')||wrap.parentElement;try{sc.scrollTop=0}catch(_){}
 });
 // On the public pages (legal/privacy.html, legal/terms.html).
 function page(doc,target){
  const el=target||document.getElementById('doc');if(!el)return;
  const l=lang(),u=ui(l);
  document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';
  document.title=(doc==='terms'?u.terms:u.privacy)+' · Ilnura';
  const links=SUPPORTED.map(x=>'<a href="?lang='+x+'"'+(x===l?' aria-current="true"':'')+'>'+({tr:'Türkçe',en:'English',de:'Deutsch',fr:'Français',ar:'العربية'})[x]+'</a>').join(' · ');
  el.innerHTML='<nav class="dlg-nav"><a href="'+(doc==='terms'?'privacy':'terms')+'.html?lang='+l+'">'+esc(doc==='terms'?u.privacy:u.terms)+'</a><span>'+links+'</span></nav><h1>'+esc(doc==='terms'?u.terms:u.privacy)+'</h1><div class="dlg">'+body(l,doc)+'</div><p class="dlg-back"><a href="../">'+esc((l==='ar'?'→ ':'← ')+u.home)+'</a></p>';
 }
 const label=()=>ui(lang()).row;
 const consent=()=>ui(lang()).consent;
 window.DEEN_LEGAL=Object.freeze({open,page,label,consent,lang,contact:CONTACT,publisher:PUBLISHER,docs:DOC,ui:UI,updated:UPDATED});
})();
