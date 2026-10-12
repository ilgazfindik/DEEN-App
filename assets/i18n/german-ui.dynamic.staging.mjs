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
  '✦ KUSURSUZ DERS':'✦ FEHLERFREIE LEKTION'
 };
 // Real U01-S01 result DOM (Chromium 38317812063); QA-only source-exact chrome.
 // No answer values, source citations or religious content are translated here.
 if(Object.prototype.hasOwnProperty.call(observedResult,n))return emit(observedResult[n]);
 let m;
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
