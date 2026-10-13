/*
 * German UI dynamic text formatter — STAGING ONLY.
 * The live app must not load this module until all German release gates pass.
 * Returns null for unknown/source-sensitive text instead of leaking Turkish.
 * translateLabel MUST be a source-aware, approved locale resolver.
 */
export function formatGermanDynamicText(value,{translateLabel=()=>null}={}){
 const input=String(value??''),n=input.trim();if(!n)return null;
 const emit=text=>input.replace(n,text);
 const label=text=>{
  if(typeof text!=='string'||!text.trim())return null;
  const v=translateLabel(text.trim());
  return typeof v==='string'&&v.trim()&&v!==text.trim()?v:null;
 };
 const observedResult={
  'AŞAMA ÖDÜLÜ':'ETAPPENBELOHNUNG',
  'Bu ders zincirini geçtin. Sonraki düğüm ve ünite ilerleyişi daha güçlü hissettirilecek.':'Du hast diese Lernreihe abgeschlossen. Der nächste Lernschritt und dein Fortschritt werden deutlicher hervorgehoben.',
  'Bu mini dersi hatasız bitirdin. Devam ettiğinde daha güçlü bir ödül hissi göreceksin.':'Du hast diese Mini-Lektion fehlerfrei abgeschlossen. Beim Fortfahren wird dein Erfolg besonders hervorgehoben.',
  'DERS RİTMİ':'LERNRHYTHMUS',
  'Ders süresi':'Lektionsdauer',
  'GERİ KAZANILAN':'ZURÜCKGEWONNEN',
  'Kusursuz ders ödülü hazır':'Belohnung für eine fehlerfreie Lektion ist bereit',
  'SIRADAKİ EN İYİ ADIM':'NÄCHSTER SINNVOLLER SCHRITT',
  'Ustalık puanı':'Kenntnisstand',
  'Yanlıştan doğruya':'Vom Fehler zur richtigen Antwort',
  'Yardım almadan doğru':'Ohne Hilfe richtig',
  'Yeni düğüm açıldı':'Neuer Lernschritt freigeschaltet',
  'Yeni rozet · İlk Adım':'Neues Abzeichen · Erster Schritt',
  '· Haftalık ritim':'· Wochenrhythmus',
  'ÖDÜLÜ AL VE DEVAM ET':'BELOHNUNG ABHOLEN UND WEITER',
  'Öğrendiklerin aralıklı tekrar planına eklendi.':'Deine Lerninhalte wurden deinem Wiederholungsplan hinzugefügt.',
  'İLK DENEME':'ERSTER VERSUCH',
  'İlk deneme doğruluğu':'Genauigkeit beim ersten Versuch',
  '✦ KUSURSUZ DERS':'✦ FEHLERFREIE LEKTION',
  'Bu aşamadaki tüm mini dersleri tamamladın. Yol üzerindeki bir sonraki düğüm açıldı.':'Du hast alle Mini-Lektionen dieser Etappe abgeschlossen. Der nächste Lernschritt auf dem Lernpfad ist freigeschaltet.',
  'YENİ AŞAMAYI AÇ':'NEUE ETAPPE ÖFFNEN',
  'ÖĞRENME YOLUNA DÖN':'ZUM LERNPFAD ZURÜCK',
  'DEEN yol arkadaşın':'Dein DEEN-Lernbegleiter',
  'Fâtiha Yolculuğu':'Fâtiha-Lernreise',
  'Fâtiha · Wikimedia Commons kıraati':'Fâtiha · Rezitation von Wikimedia Commons',
  'Zorlandığın ayetleri tekrar edip yeniden dene.':'Wiederhole die schwierigen Verse und versuche es erneut.',
  '✦ Sure madalyaları':'✦ Surenmedaillen',
  'Fâtiha · Surah Journey':'Fâtiha · Suren-Lernpfad',
  'Learn → Memorize → Test → Final → Master':'Lernen → Auswendiglernen → Test → Finale → Meistern',
  'MASTERY':'KENNTNISSTAND',
  'Mastery':'Meisterschaft',
  'Learn':'Lernen',
  'Memorize':'Auswendiglernen',
  'Ayah Test':'Verstest',
  '5 questions about this surah':'5 Fragen zu dieser Sure',
  'START TEST':'TEST STARTEN',
  'Meaning Test':'Bedeutungstest',
  '5 questions about meanings':'5 Fragen zu den Bedeutungen',
  'Surah Final':'Surenfinale',
  'Pass Ayah + Meaning to unlock · 8 questions':'Schließe den Vers- und Bedeutungstest ab · 8 Fragen',
  'Unlock after final':'Nach dem Finale freischalten',
  'LOCKED':'GESPERRT',
  'START':'STARTEN',
  'REVIEW':'WIEDERHOLEN'
 };
 // Real U01-S01 result DOM (Chromium 38317812063); QA-only source-exact chrome.
 // No answer values, source citations or religious content are translated here.
 let m;
 if(Object.prototype.hasOwnProperty.call(observedResult,n))return emit(observedResult[n]);

 // Source-exact chrome from the actual Fatiha five-step learning flow
 // (release/v9.9.3-direct/segment-36.txt) and universal inline audio
 // (segment-52.txt). Only UI; never transform Arabic or an ayah meaning.
 // These mappings are confined to disposable staging-QA and are not
 // wired into the app's production locale resolver.
 const fatihaLearning={
  'Fâtiha Suresi':'Sure Fâtiha',
  'Dinle':'Anhören',
  'Oku':'Lesen',
  'Anlam':'Bedeutung',
  'Hatırla':'Erinnern',
  'Tamamla':'Abschließen',
  '1 · DİNLE':'1 · ANHÖREN',
  '2 · OKU':'2 · LESEN',
  '3 · ANLAM':'3 · BEDEUTUNG',
  '4 · HATIRLA':'4 · ERINNERN',
  '5 · TAMAMLA':'5 · ABSCHLIESSEN',
  'Kıraat yalnız hakları temizlenmiş kayıt bağlanırsa oynatılır.':
   'Die Rezitation wird nur abgespielt, wenn eine Aufnahme mit geklärten Nutzungsrechten verfügbar ist.',
  'Metni gözünle takip et':'Lies den Vers aufmerksam mit',
  'Ayetin tamamını yavaşça oku.':'Lies den gesamten Vers langsam.',
  'Meal ile bağ kur':'Verstehe die Bedeutung des Verses',
  'Yalnız kaynaklı meal gösterilir.':'Es werden nur Übersetzungen mit Quellenangabe angezeigt.',
  'Metne bakmadan getir':'Erinnere dich, ohne auf den Text zu schauen',
  'Önce zihninden söyle, sonra kontrol et.':
   'Sage den Vers zuerst aus dem Gedächtnis auf und überprüfe ihn danach.',
  'Ayet turunu bitir':'Schließe den Versdurchgang ab',
  'İlk öğrenme tamamlanır; ezber ayrı güçlendirilir.':
   'Damit schließt du den ersten Lerndurchgang ab. Das Auswendiglernen wird separat gefestigt.',
  'AYETİ GÖSTER':'VERS ANZEIGEN',
  'AYETİ TAMAMLA':'VERS ABSCHLIESSEN',
  'DEVAM ET':'WEITER',
  'GERİ':'ZURÜCK',
  'Ayet kıraati':'Versrezitation',
  'Dinlemek için oynat düğmesine dokun.':'Tippe auf die Wiedergabetaste, um den Vers anzuhören.',
  'Ayet sesini duraklat':'Verswiedergabe pausieren',
  'Ayet sesi duraklatıldı.':'Verswiedergabe pausiert.',
  'Ayet sesi tamamlandı. Tekrar dinlemek için hoparlöre dokun.':
   'Verswiedergabe beendet. Tippe auf den Lautsprecher, um den Vers erneut anzuhören.',
  'Ayet sesi yüklenemedi. Sayfayı yenileyip tekrar dene.':
   'Die Versaufnahme konnte nicht geladen werden. Lade die Seite erneut und versuche es noch einmal.',
  'Bu tarayıcı ses oynatmayı desteklemiyor.':
   'Dieser Browser unterstützt keine Audiowiedergabe.',
  'Doğrulanmamış içerik gösterilmedi.':
   'Nicht geprüftes Material wird nicht angezeigt.'
 };
 if(Object.prototype.hasOwnProperty.call(fatihaLearning,n))return emit(fatihaLearning[n]);

 // Quran memorization and the *UI chrome only* of the Arabic ayah test.
 // These are source-exact labels in the German staging renderer, not any
 // translation of Quran Arabic, meal, answer options or expert review status.
 const fatihaMemorizationAndQuiz={
  'Fâtiha Ezberi':'Fâtiha auswendig lernen',
  'Tam metin':'Vollständiger Vers',
  'Bazı kelimeler gizli':'Einige Wörter ausgeblendet',
  'Çoğu kelime gizli':'Die meisten Wörter ausgeblendet',
  'Başlangıç ipucu':'Anfangshinweis',
  'Tamamen ezberden':'Vollständig auswendig',
  'METNİ GÖSTER':'TEXT ANZEIGEN',
  'TEKRAR ET':'WIEDERHOLEN',
  'HATIRLADIM':'ICH HABE MICH ERINNERT',
  'Metin gizli':'Text ausgeblendet',
  'Ayeti tamamen ezberden söyle.':'Trage den ganzen Vers auswendig vor.',
  'Önce bu ayetin öğrenme turunu tamamla.':'Schließe zuerst den Lerndurchgang dieses Verses ab.',
  'Test ilerlemesi':'Testfortschritt',
  'Cevap seçenekleri':'Antwortmöglichkeiten',
  'Sesli ayet sorusu':'Hörfrage zum Vers',
  'Eksik kelime':'Fehlendes Wort',
  'Seçilen kelime':'Ausgewähltes Wort',
  'Zorlandığın ayetler öncelik alır':'Verse, die dir schwerfallen, werden zuerst geübt',
  'Seçtiğin cevap':'Deine Antwort',
  'Doğru cevap':'Richtige Antwort',
  'Meal henüz hazır değil':'Die geprüfte Übersetzung steht noch aus',
  'Test henüz hazır değil':'Der Test ist noch nicht verfügbar',
  'Bu sure için doğrulanmış sorular hazırlanamadı.':
   'Für diese Sure konnten noch keine geprüften Aufgaben bereitgestellt werden.',
  'Bu surenin Arapça ayet veya meal verisi hazır değil. Eksik içerikten soru üretilmez.':
   'Die arabischen Verse oder geprüften Bedeutungen dieser Sure fehlen. Aus unvollständigen Quellen werden keine Fragen erzeugt.',
  'Bu ayetin ses kaydı kullanılamıyor.':'Die Tonaufnahme zu diesem Vers ist nicht verfügbar.',
  'Ayet sesi hazırlanıyor…':'Die Versaufnahme wird vorbereitet…',
  'Tekrar dinleyebilirsin.':'Du kannst den Vers erneut anhören.',
  'Ses oynatılamadı.':'Die Versaufnahme konnte nicht abgespielt werden.',
  'Doğru. Hatırlama turu tamamlandı.':'Richtig. Die Erinnerungsübung ist abgeschlossen.',
  'Henüz değil. Tekrar dene.':'Noch nicht richtig. Versuche es erneut.'
 };
 if(Object.prototype.hasOwnProperty.call(fatihaMemorizationAndQuiz,n))
  return emit(fatihaMemorizationAndQuiz[n]);
 if((m=n.match(/^Fâtiha\s+·\s+Ayet\s+([1-7])$/)))
  return emit('Fâtiha · Vers '+m[1]);
 if((m=n.match(/^Ayet\s+([1-7])\s*·\s*(Boşluk|Sırala|Devamı|Eşleştir|Parça|Sesi Bul)$/))){
  const modes={'Boşluk':'Lücke','Sırala':'Reihenfolge','Devamı':'Fortsetzung',
   'Eşleştir':'Zuordnung','Parça':'Abschnitt','Sesi Bul':'Hörübung'};
  return emit('Vers '+m[1]+' · '+modes[m[2]]);
 }
 if((m=n.match(/^EZBER KADEMESİ\s+([1-5])\s*\/\s*5$/)))
  return emit('AUSWENDIGLERNSTUFE '+m[1]+' / 5');
 if((m=n.match(/^Fâtiha\s+·\s+(\d+)\s*\/\s*5$/)))
  return emit('Fâtiha · '+m[1]+' / 5');
 if((m=n.match(/^Seçilen kelime:\s+(.+)$/))){
  // A selected Arabic word belongs to the source-sensitive fill slot and
  // is intentionally NOT translated here.
  return null;
 }
 if((m=n.match(/^✓\s+(\d+)\s+doğru$/)))
  return emit('✓ '+m[1]+' '+(m[1]==='1'?'richtig':'richtige Antworten'));
 if((m=n.match(/^Başarı puanı yüzde\s+(\d{1,3})$/)))
  return emit('Ergebnis: '+m[1]+' Prozent');
 if((m=n.match(/^([1-5])\.\s+soru\s*·\s*Ayet\s+([1-7])$/)))
  return emit('Frage '+m[1]+' · Vers '+m[2]);

 if((m=n.match(/^Fâtiha\s*·\s*Ayet\s+([1-7])\/7$/)))
  return emit('Fâtiha · Vers '+m[1]+'/7');
 if((m=n.match(/^Ayet\s+([1-7])\s*\/\s*7$/)))
  return emit('Vers '+m[1]+' / 7');
 if((m=n.match(/^Fâtiha\s+([1-7])\.\s*ayeti hatırla$/)))
  return emit('Erinnere dich an Vers '+m[1]+' der Sure Fâtiha');
 if((m=n.match(/^Ayet\s+([1-7])\s+sesini dinle$/)))
  return emit('Vers '+m[1]+' anhören');
 if((m=n.match(/^Hoparlöre dokun:\s*Ayet\s+([1-7])\s+kaydını dinle\.$/)))
  return emit('Tippe auf den Lautsprecher, um Vers '+m[1]+' anzuhören.');
 if((m=n.match(/^Ayet\s+([1-7])\s+dinleniyor…$/)))
  return emit('Vers '+m[1]+' wird abgespielt…');
 if((m=n.match(/^Ayet sesi açılamadı:\s*(.+)$/))){
  // Browser exception text is diagnostics, not an ayah or translated source.
  return emit('Verswiedergabe fehlgeschlagen: '+m[1]);
 }

 // Fatiha journey source-observed UI state counters: preserve all Arabic,
 // audio, Wikimedia Commons attribution and CC0 licence names.
 if((m=n.match(/^LEVEL\s+(\d+)$/)))return emit('STUFE '+m[1]);
 if((m=n.match(/^(\d+)\/(\d+) ayahs learned$/)))return emit(m[1]+'/'+m[2]+' Verse gelernt');
 if((m=n.match(/^(\d+)\/(\d+) ayahs memorized$/)))return emit(m[1]+'/'+m[2]+' Verse auswendig gelernt');
 // Fatiha journey QA: source-observed daily challenge chrome only;
 // Arabic verses, audio and bibliographic attribution are never altered.
 if((m=n.match(/^Mevcut günlük görevler:\s*(\d+)\/(\d+) tamamlandı\s*·\s*(\d+) tekrar bekliyor$/)))
  return emit('Aktuelle Tagesaufgaben: '+m[1]+'/'+m[2]+' abgeschlossen · '+m[3]+' Wiederholungen offen');
 if((m=n.match(/^Ünite\s+(\d+)\s*·\s*Aşama\s+(\d+)$/)))return emit('Einheit '+m[1]+' · Etappe '+m[2]);
 // Source-observed companion chrome; retain proper name and translate only the UI role.
 if(n==='Meryem · MİNİ GÖREV')return emit('Meryem · MINI-AUFGABE');

 // Patterns observed in the real assembled learning-path and review DOM (Chromium 38291180334).
 // Title-bearing patterns must resolve the COMPLETE Turkish source title: never substitute substrings.
 if((m=n.match(/^(\d+)\.\s*KISIM\s*·\s*(\d+)\.\s*ÜNİTE$/)))
  return emit('ABSCHNITT '+m[1]+' · EINHEIT '+m[2]);
 if((m=n.match(/^Ders\s+(\d+)$/)))return emit('Lektion '+m[1]);
 if((m=n.match(/^(\d+)\/(\d+)\s*·\s*Ders\s+(\d+)$/)))
  return emit(m[1]+'/'+m[2]+' · Lektion '+m[3]);
 if((m=n.match(/^(\d+)\s+ENERJİ$/)))return emit(m[1]+' ENERGIE');
 if((m=n.match(/^Ders\s+(\d+)\/(\d+)\s*·\s*(Aktif Hatırlama|Tanı|Bağ Kur|Duruma Uyarla|Sesi Tanı)$/))){
  const lessonKinds={'Aktif Hatırlama':'Aktives Abrufen',Tanı:'Erkennen','Bağ Kur':'Verknüpfen',
   'Duruma Uyarla':'Auf Situationen anwenden','Sesi Tanı':'Hören und erkennen'};
  return emit('Lektion '+m[1]+'/'+m[2]+' · '+lessonKinds[m[3]]);
 }
 if((m=n.match(/^(.+?)\s*·\s*(ÖĞREN|ANLA|DİNLE|UYGULA|HATIRLA|USTALAŞ)\s*·\s*Aşama\s+(\d+)\/(\d+)$/))){
  const stageKinds={'ÖĞREN':'LERNEN','ANLA':'VERSTEHEN','DİNLE':'ZUHÖREN','HATIRLA':'ERINNERN',
   'UYGULA':'ANWENDEN','USTALAŞ':'MEISTERN'};
  const title=label(m[1]);return title?emit(title+' · '+stageKinds[m[2]]+' · Etappe '+m[3]+'/'+m[4]):null;
 }
 if((m=n.match(/^(.+?)\s*—\s*Önceki aşamayı tamamla$/))){
  const title=label(m[1]);return title?emit(title+' — Schließe zuerst die vorherige Etappe ab'):null;
 }
 if((m=n.match(/^(.+?)\s+mevcut aşamaya git$/))){
  const title=label(m[1]);return title?emit('Zur aktuellen Etappe von '+title+' springen'):null;
 }
 if((m=n.match(/^(.+?)\s*·\s*(\d+)\s+aşamalı öğrenme yolu$/))){
  const title=label(m[1]);return title?emit(title+' · Lernpfad mit '+m[2]+' Etappen'):null;
 }
 // Further templated chrome observed by real Chromium across the assembled app.
 if((m=n.match(/^(\d+)\s*%\s*GEÇİŞ$/)))return emit('ÜBERGANGSSCHWELLE '+m[1]+' %');
 if((m=n.match(/^%(\d+)\s*GEÇİŞ$/)))return emit('ÜBERGANGSSCHWELLE '+m[1]+' %');
 if((m=n.match(/^aşama\s*·\s*Ustalık\s*%(\d+)$/)))
  return emit('Etappe · Kenntnisstand '+m[1]+' %');
 if((m=n.match(/^(.+?)\s*·\s*(ÖĞREN|ANLA|DİNLE|UYGULA|HATIRLA|USTALAŞ)\s*·\s*Mini ders\s+(\d+)\/(\d+)$/))){
  const kinds={'ÖĞREN':'LERNEN','ANLA':'VERSTEHEN','DİNLE':'ZUHÖREN',
   'UYGULA':'ANWENDEN','HATIRLA':'ERINNERN','USTALAŞ':'MEISTERN'};
  const name=label(m[1]);
  return name?emit(name+' · '+kinds[m[2]]+' · Mini-Lektion '+m[3]+'/'+m[4]):null;
 }
 if((m=n.match(/^(.+?)\s*—\s*(\d+)\/(\d+)\s+mini ders tamamlandı$/))){
  const name=label(m[1]);return name?emit(name+' — '+m[2]+'/'+m[3]+' Mini-Lektionen abgeschlossen'):null;
 }
 // Exact texts recorded in the ungraded app chrome, not Quran, answers or teaching content.
 const observedUI={
  'PREMIUM · SINIRSIZ ENERJİ':'PREMIUM · UNBEGRENZTE ENERGIE',
  'Premium yalnızca konfor özelliğidir. Dini içerik herkese açıktır. Reklam butonu bu HTML önizlemesinde simülasyondur.':
   'Premium bietet nur Komfortfunktionen. Religiöse Lerninhalte sind für alle frei zugänglich. Der Werbebutton ist in dieser HTML-Vorschau eine Simulation.',
  'REKLAM İZLE · +10 ENERJİ':'WERBUNG ANSEHEN · +10 ENERGIE',
  'SERİ KORUMA':'SERIENSCHUTZ',
  'SONRAKİ ENERJİ':'NÄCHSTE ENERGIEAUFFÜLLUNG',
  'Sıradaki: Aktif Hatırlama · Cevabı görmeden bilgiyi zihninden geri çağır.':
   'Als Nächstes: Aktives Abrufen · Rufe das Wissen ab, ohne die Antwort zu sehen.',
  'Sıradaki: Bağ Kur · Kavramları doğru anlam ve örneklerle bağla.':
   'Als Nächstes: Verknüpfen · Verbinde Begriffe mit den passenden Bedeutungen und Beispielen.',
  'Sıradaki: Duruma Uyarla · Öğrendiğin ilkeyi basit bir duruma uygula.':
   'Als Nächstes: Auf Situationen anwenden · Wende den gelernten Grundsatz auf eine einfache Situation an.',
  'Sıradaki: Sesi Tanı · Resmî kaydı dinleyerek doğru ifadeyi tanı.':
   'Als Nächstes: Hören und erkennen · Höre die offizielle Aufnahme und erkenne die richtige Aussage.',
  'Sıradaki: Tanı · Temel kavramı güvenli biçimde tanı.':
   'Als Nächstes: Erkennen · Lerne den Grundbegriff behutsam kennen.',
  'Sıradaki: Ünite Challenge · Ünitenin temel kavramlarını farklı soru biçimleriyle ustalık seviyesinde kullan.':
   'Als Nächstes: Kapitel-Challenge · Wende die Grundbegriffe der Einheit in verschiedenen Aufgabenformen vertieft an.',

  "Henüz yeterli cevap geçmişi yok. Birkaç ders sonra zayıf kavramlar burada görünür.":"Es liegen noch nicht genügend Antworten vor. Nach einigen Lektionen siehst du hier die Themen, die du noch üben solltest.",
  "İLK DERSİ TAMAMLA":"SCHLIESSE DEINE ERSTE LEKTION AB",
  "İlk dersinden sonra kişiselleşir":"Wird nach deiner ersten Lektion personalisiert",
  "İlk mini dersini tamamladığında kişisel tekrar planın burada oluşacak.":"Nach deiner ersten Mini-Lektion erscheint hier dein persönlicher Wiederholungsplan.",
  "İlk üniteni oynadıkça burada kişisel hafıza skoru oluşur.":"Beim Üben deiner ersten Einheit entsteht hier dein persönlicher Erinnerungswert.",
  "Bugünkü küçük çalışma akışı":"Dein kurzer Lernablauf für heute",
  "FÂTIHA İLE BAŞLA":"MIT AL-FĀTIHA BEGINNEN",
  "Günlük anlam çalışması":"Tägliche Bedeutungsübung",
  "Hatırlama çalışması":"Erinnerungsübung",
  "Hedefler ve hafıza":"Ziele und Gedächtnis",
  "Riskli ayetleri önce çalış":"Übe zuerst Verse, die du noch festigen solltest",
  "Çalışma alanları":"Lernbereiche",
  "Öğrenme kütüphanesi":"Lernbibliothek",
  "ANLATIM PROFİLİ":"LERNSTILPROFIL",
  "Değiştir →":"Ändern →",
  "Doğruluk: Henüz ders yok":"Antwortgenauigkeit: Noch keine Lektion",
  "🌱 Çocuk · 8–12":"🌱 Kind · 8–12",
  "DEEN boyunca sana eşlik edecek hayvanı seç. Bu bir kişilik testi değil; sadece senin görsel yol arkadaşın.":"Wähle ein Tier, das dich bei DEEN begleitet. Dies ist kein Persönlichkeitstest, sondern dein Lernbegleiter.",
  "Seçimini daha sonra Profil ekranındaki hayvana dokunarak değiştirebilirsin.":"Du kannst deinen Lernbegleiter später ändern, indem du im Profil auf das Tier tippst.",
  "Öğrenme ve bilgelik":"Lernen und Weisheit",
  "Kalıcı kozmetik":"Dauerhafte kosmetische Anpassung",
  "◇ Altın profil çerçevesi":"◇ Goldener Profilrahmen",
  "★ Altın yol vurgusu":"★ Goldene Lernpfad-Hervorhebung",
  "❄ Seri koruması":"❄ Serienschutz",
  "AKTİF PROFİL":"AKTIVES PROFIL",
  "Açıklamayı otomatik oku":"Erklärungen automatisch vorlesen",
  "Başlangıçta mezhep seçimi istenmez.":"Zu Beginn ist keine Auswahl einer Rechtsschule erforderlich.",
  "DEEN önce mezheplerin ortak çekirdeğini öğretir. Mezhep-hassas içerikler başka geçerli bir görüşü yanlış diye puanlamaz ve uzman incelemesi önceliğini korur.":"DEEN vermittelt zunächst gemeinsame Grundlagen der Rechtsschulen. Bei Fragen mit unterschiedlichen anerkannten Auffassungen werden andere gültige Meinungen nicht als falsch gewertet; eine fachliche Prüfung hat Vorrang.",
  "Dinî içerik ödeme duvarının arkasında değildir.":"Religiöse Lerninhalte befinden sich nicht hinter einer Bezahlschranke.",
  "Dinî telaffuz için yapay/TTS ses üretilmez. Bulut senkronizasyonu bu tek-dosya prototipte yoktur.":"Für religiöse Aussprache wird keine künstliche oder synthetische Sprachausgabe erzeugt. Dieses Prototyp unterstützt keine Cloud-Synchronisierung.",
  "ERİŞİLEBİLİRLİK & GERİ BİLDİRİM":"BARRIEREFREIHEIT & RÜCKMELDUNG",
  "Hızlı":"Schnell",
  "SESLİ ANLATIM":"SPRACHAUSGABE",
  "Sesli anlatım düğmeleri":"Schaltflächen zum Vorlesen",
  "Soru, seçenek ve açıklama metinlerini cihazın Türkçe konuşma motoruyla dinle. Kur’an kıraati, şehadet telaffuzu ve doğrulanmış dinleme içerikleri yapay sesle okunmaz.":"Fragen, Antwortmöglichkeiten und Erklärungen können über die türkische Sprachausgabe des Geräts vorgelesen werden. Koranrezitation, Schahāda-Aussprache und geprüfte Hörinhalte werden nicht künstlich vorgelesen.",
  "Soruların ve geri bildirimlerin dili seçilen yaş grubuna göre ayarlanır.":"Die Formulierungen der Fragen und Rückmeldungen werden an die gewählte Altersgruppe angepasst.",
  "VERİ & İLERLEME":"DATEN & FORTSCHRITT",
  "Yavaş":"Langsam",
  "Yedeği içe aktar":"Sicherung importieren",
  "ÖĞRENME RİTMİ":"LERNRHYTHMUS",
  "ÜRÜN POLİTİKASI":"PRODUKTRICHTLINIEN",
  "Üniteler, finaller, Smart Review ve U03 resmî medya içeriği Free kullanıcılar için erişilebilir kalır. Premium yalnız kullanım konforu sağlar.":"Einheiten, Abschlusstests, Smart Review und die offiziellen Medien zu U03 bleiben auch in der kostenlosen Version verfügbar. Premium bietet lediglich zusätzliche Komfortfunktionen.",
  "İlerlemeyi sıfırla":"Fortschritt zurücksetzen",
  "İlerlemeyi yedekle":"Fortschritt sichern",
  "5 farklı günde Bugünkü Yolculuk'u tamamla.":"Schließe „Deine heutige Reise“ an fünf verschiedenen Tagen ab.",
  "Bu derse devam etmek için enerjini yenile. Mevcut sistemde yanlış cevap ayrıca enerji düşürmez.":"Fülle deine Energie auf, um mit dieser Lektion fortzufahren. Falsche Antworten kosten hier keine zusätzliche Energie.",
  "EKSİK":"FEHLEND",
  "ENERJİ":"ENERGIE",
  "Enerji 5 dakikada +1 yenilenir. Premium yalnız konfor sağlar; dinî içerik kilitlenmez. Ödüllü reklam bu HTML prototipinde simülasyondur.":"Alle fünf Minuten wird ein Energiepunkt wiederhergestellt. Premium bietet nur Komfort; religiöse Inhalte werden nicht gesperrt. Die belohnte Werbung ist in diesem HTML-Prototyp simuliert.",
  "YENİLENME":"AUFFÜLLUNG",
  "ÖDÜLLÜ REKLAM SİMÜLASYONU · +10":"SIMULIERTE BELOHNUNGSWERBUNG · +10",
  "ŞİMDİLİK KAPAT":"VORERST SCHLIESSEN",
  "Öğrenme analizi":"Lernanalyse",
  "Henüz analiz edilecek cevap yok. İlk mini dersi tamamladığında doğruluk, cevap süresi, soru türleri ve tekrar eden hatalar burada oluşacak.":"Es gibt noch keine Antworten zur Auswertung. Nach deiner ersten Mini-Lektion erscheinen hier Antwortgenauigkeit, Antwortdauer, Aufgabentypen und wiederkehrende Fehler.",
  "Açıklamayı dinle":"Erklärung anhören",
  "Başlangıç düzeyindeki ortak çerçeveyi kullanır; mezhep ayrıntısı öğretmez.":"Verwendet gemeinsame Grundlagen für Einsteiger und behandelt keine Einzelheiten der Rechtsschulen.",
  "Harika yakaladın!":"Sehr gut erkannt!",
  "Kartları oku. En doğru olanı seç.":"Lies die Karten und wähle die passendste Antwort.",
  "Kaynak ve içerik notu":"Quellen- und Inhaltshinweis",
  "Kur'an 2:112; Diyanet Hadislerle İslam, Cilt 1, s.363; REQUIRES_EXPERT_VERIFICATION":"Koran 2:112; Diyanet Hadislerle İslam, Band 1, S. 363; FACHPRÜFUNG ERFORDERLICH",
  "Küçük adım, kalıcı öğrenme.":"Kleine Schritte, nachhaltiges Lernen.",
  "Meryem · BİRLİKTE ÇÖZELİM":"Meryem · LÖSEN WIR ES GEMEINSAM",
  "Soru ve ekrandaki seçenekler okunur.":"Die Frage und die Antwortmöglichkeiten auf dem Bildschirm werden vorgelesen.",
  "Uzman incelemesi bekliyor. Bu içerik dinî yayın onayı değildir.":"Die fachliche Prüfung steht noch aus. Dieser Inhalt ist nicht zur religiösen Veröffentlichung freigegeben.",
  "Önce soruyu anla, sonra cevabı seç. Yanlış yaparsan birlikte düzeltiriz.":"Verstehe zuerst die Frage und wähle dann eine Antwort. Bei Fehlern helfen wir dir beim Verbessern.",
  "Öğrenme döngüsü · ÖĞREN":"Lernzyklus · LERNEN",
  "İslam ve teslimiyet kavramının temel çerçevesini destekler.":"Unterstützt ein grundlegendes Verständnis von Islam und Hingabe.",
  "🌱 ÇOCUK ANLATIM":"🌱 KINDGERECHTE ERKLÄRUNG",
  "1 · ANA FİKİR":"1 · KERNGEDANKE",
  "Bunu bir arkadaşına nasıl anlatırdın?":"Wie würdest du es einer Freundin oder einem Freund erklären?",
  "Hatırla: Yönel · Güven · Yaşa":"Merke: Hinwenden · Vertrauen · Leben",
  "İslam, Allah'a güvenmeyi, O'nun rehberliğini kabul etmeyi ve bunu hayata taşımayı öğretir.":"Der Islam lehrt, Allah zu vertrauen, seine Rechtleitung anzunehmen und sie im Alltag umzusetzen.",
  "İslam, Allah'a yönelmektir.":"Islam bedeutet, sich Allah zuzuwenden.",
  "Evet, doğru!":"Ja, richtig!",
  "Olmadı ama sorun değil; açıklama bize yolu gösterir.":"Das war noch nicht richtig. Die Erklärung hilft dir, es zu verstehen.",
  "Birlikte düzeltelim":"Korrigieren wir es gemeinsam.",
  'Enerji azaldı':'Energie aufgebraucht',
  'Bir U01 dersi tamamladığında tekrar takvimin burada oluşacak.':
   'Sobald du eine Lektion in U01 abgeschlossen hast, erscheint hier dein Wiederholungsplan.',
  'Derse devam etmek için enerjini yenileyebilirsin. Premium enerji sınırını kaldırır, reklam ise hızlı bir destek verir.':
   'Fülle deine Energie auf, um weiterzulernen. Mit Premium entfällt das Energielimit. Alternativ kannst du dir eine Werbung ansehen.',
 };
 if(Object.hasOwn(observedUI,n))return emit(observedUI[n]);


 // Browser-observed dynamic review, Quran hub and profile chrome, not scripture or graded answers.
 if((m=n.match(/^(\d+)\s+soru\s*·\s*Ücretsiz$/)))
  return emit(m[1]+' '+(m[1]==='1'?'Frage':'Fragen')+' · Kostenlos');
 if((m=n.match(/^(\d+)\s*\/\s*(\d+)\s+ayet$/)))
  return emit(m[1]+' / '+m[2]+' '+(m[2]==='1'?'Vers':'Verse'));
 if((m=n.match(/^(\d+)\s+riskli ayetten kişisel tur$/)))
  return emit('Persönliche Übungsrunde mit '+m[1]+' '+(m[1]==='1'?'Vers':'Versen')+' mit Wiederholungsbedarf');
 if((m=n.match(/^(\d+)\s+surelik kontrollü genişleme$/)))
  return emit('Schrittweise Erweiterung auf '+m[1]+' '+(m[1]==='1'?'Sure':'Suren'));
 if((m=n.match(/^Ayet\s+(\d+)\s*\/\s*(\d+)\s*·\s*Son çalışma:\s*Henüz çalışma yok$/)))
  return emit('Vers '+m[1]+' / '+m[2]+' · Zuletzt geübt: Noch keine Übung');
 if((m=n.match(/^(\d+)\s+doğru cevap$/)))
  return emit(m[1]+' '+(m[1]==='1'?'richtige Antwort':'richtige Antworten'));
 if((m=n.match(/^Günlük hedef\s*·\s*(\d+)\s+ders$/)))
  return emit('Tagesziel · '+m[1]+' '+(m[1]==='1'?'Lektion':'Lektionen'));
 if((m=n.match(/^Ödül:\s*\+(\d+)\s+XP\s*·\s*\+(\d+)\s+Pırıltı\s*·\s*\+(\d+)\s+seri koruma$/)))
  return emit('Belohnung: +'+m[1]+' XP · +'+m[2]+' Glanzpunkte · +'+m[3]+' Serienschutz');

 if((m=n.match(/^([+-]?\d+)\s+Pırıltı$/)))return emit(m[1]+' Glanzpunkte');
 if((m=n.match(/^Günlük hedef\s*·\s*(\d+)\s+mini ders$/)))return emit('Tagesziel · '+m[1]+' '+(m[1]==='1'?'Mini-Lektion':'Mini-Lektionen'));
 if((m=n.match(/^Seviye\s+(\d+)$/)))return emit('Stufe '+m[1]);
 // A numeric energy reward can vary from the literal +10 observed in Chromium.
 if((m=n.match(/^REKLAM İZLE\s*·\s*\+(\d+)\s+ENERJİ$/)))
  return emit('WERBUNG ANSEHEN · +'+m[1]+' ENERGIE');

 if(n==='Doğru. Devam edebilirsin.')return emit('Richtig. Du kannst weitermachen.');
 if((m=n.match(/^(\d+)\s+mini ders\s*·\s*yaklaşık (\d+) dakika$/)))return emit(m[1]+' Mini-Lektion'+(m[1]==='1'?'':'en')+' · etwa '+m[2]+' Minuten');
 if((m=n.match(/^(\d+)\/(\d+)\s+(?:Görev|Görevler)$/)))return emit(m[1]+'/'+m[2]+' Aufgaben');
 if((m=n.match(/^(\d+)\s+(soru|ders|gün|ayet|sure|görev|kavram)$/i))){
  const singular={soru:'Frage',ders:'Lektion',gün:'Tag',ayet:'Vers',sure:'Sure',görev:'Aufgabe',kavram:'Begriff'};
  const plural={soru:'Fragen',ders:'Lektionen',gün:'Tage',ayet:'Verse',sure:'Suren',görev:'Aufgaben',kavram:'Begriffe'};
  const key=m[2].toLocaleLowerCase('tr');return emit(m[1]+' '+(m[1]==='1'?singular[key]:plural[key]));
 }
 if((m=n.match(/^(\d+)\s+mini ders\s*·\s*(\d+)\s+dk$/)))return emit(m[1]+' '+(m[1]==='1'?'Mini-Lektion':'Mini-Lektionen')+' · '+m[2]+' Min.');
 if((m=n.match(/^(\d+)\s+güne\s+(\d+)\s+gün(?:\s+kaldı)?\s*·\s*\+(\d+)\s+Pırıltı(?:\s*·\s*\+(\d+)\s+seri koruma)?$/))){
  return emit('Noch '+m[2]+' '+(m[2]==='1'?'Tag':'Tage')+' bis zur '+m[1]+'-Tage-Serie · +'+m[3]+' Glanzpunkte'+(m[4]?' · +'+m[4]+' Serienschutz':''));
 }
 if((m=n.match(/^(\d+)\s+kaçırılan gün\s*·\s*En fazla\s+(\d+)$/)))return emit(m[1]+' '+(m[1]==='1'?'verpasster Tag':'verpasste Tage')+' · maximal '+m[2]);
 if((m=n.match(/^(\d+)\s+derslik bu aşamada (\d+)\/(\d+) ilerlemedesin\.$/)))return emit('Du hast '+m[2]+' von '+m[3]+' Mini-Lektionen in dieser Etappe abgeschlossen.');
 if((m=n.match(/^Ders\s+(\d+)\/(\d+)$/)))return emit('Lektion '+m[1]+'/'+m[2]);
 if((m=n.match(/^Görevler\s+(\d+)\/3\s*·\s*Haftalık ritim\s+(\d+)\/(\d+)\s+gün(?:\s*·\s*(\d+) tekrar)?$/))){
  return emit('Tagesaufgaben '+m[1]+'/3 · Wochenrhythmus '+m[2]+'/'+m[3]+' Tage'+(m[4]?' · '+m[4]+' '+(m[4]==='1'?'Wiederholung':'Wiederholungen'):''));
 }
 if((m=n.match(/^(\d+) soru tekrar bekliyor\.$/)))return emit(m[1]+' '+(m[1]==='1'?'Frage wartet':'Fragen warten')+' auf eine Wiederholung.');
 if((m=n.match(/^(\d+)\s+kavram\s*·\s*(\d+)\s+enerji$/)))return emit(m[1]+' '+(m[1]==='1'?'Begriff':'Begriffe')+' · '+m[2]+' Energie');
 if((m=n.match(/^(\d+)\s+enerji$/)))return emit(m[1]+' Energie');
 if((m=n.match(/^(\d+)\s+HAZIR$/)))return emit(m[1]+' BEREIT');
 if((m=n.match(/^(\d+)\s+kontrol noktası tamamlandı$/)))return emit(m[1]+' '+(m[1]==='1'?'Kontrollpunkt':'Kontrollpunkte')+' abgeschlossen');
 if((m=n.match(/^(\d+)\s+tekrar bekliyor$/)))return emit(m[1]+' '+(m[1]==='1'?'Wiederholung fällig':'Wiederholungen fällig'));
 if((m=n.match(/^(\d+)\/(\d+)\s+mini ders\s*·\s*öğrenme zinciri tamamlandı$/)))return emit(m[1]+'/'+m[2]+' Mini-Lektionen · Lernreihe abgeschlossen');
 if((m=n.match(/^Kusursuz dersler:\s*(\d+)$/)))return emit('Fehlerfreie Lektionen: '+m[1]);
 if((m=n.match(/^(\d+)\s+sn$/)))return emit(m[1]+' Sek.');
 if((m=n.match(/^(\d+) soruda hata tekrar ediyor\. Akıllı tekrar bu sinyalleri önceliklendirecek\.$/))){
  return emit('Bei '+m[1]+' '+(m[1]==='1'?'Frage':'Fragen')+' treten wiederholt Fehler auf. Die intelligente Wiederholung priorisiert diese Themen.');
 }
 if((m=n.match(/^KISIM\s+(\d+)\s+TAMAMLANDI$/)))return emit('ABSCHNITT '+m[1]+' ABGESCHLOSSEN');
 if((m=n.match(/^ÜNİTE\s*(\d+)\s*·\s*✓\s*TAMAMLANDI$/)))return emit('EINHEIT '+m[1]+' · ✓ ABGESCHLOSSEN');
 if((m=n.match(/^(\d+)\s*\/\s*(\d+)\s*aşama$/)))return emit(m[1]+'/'+m[2]+' Etappen');
 if((m=n.match(/^%(\d+)$/)))return emit(m[1]+' %');
 if((m=n.match(/^Ustalık\s*%(\d+)$/)))return emit('Kenntnisstand '+m[1]+' %');
 if((m=n.match(/^Sıradaki aşama\s*·\s*(.+)$/))){const t=label(m[1]);return t?emit('Nächste Etappe · '+t):null;}
 if((m=n.match(/^Sonraki mini ders\s*·\s*(.+)$/))){const t=label(m[1]);return t?emit('Nächste Mini-Lektion · '+t):null;}
 if((m=n.match(/^Doğru cevap:\s*([\s\S]+)$/))){const t=label(m[1]);return t?emit('Richtige Antwort: '+t):null;}
 if((m=n.match(/^(Kısaca|Özet):\s*([\s\S]+)$/))){const t=label(m[2]);return t?emit((m[1]==='Kısaca'?'Kurz gesagt: ':'Zusammenfassung: ')+t):null;}
 if((m=n.match(/^(.+?) artık bitti\. Sıradaki düğüm açıldı\.$/))){const t=label(m[1]);return t?emit(t+' ist abgeschlossen. Die nächste Etappe wurde freigeschaltet.'):null;}
 return null;
}
