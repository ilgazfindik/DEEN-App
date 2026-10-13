import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {formatGermanDynamicText as fmt} from '../assets/i18n/german-ui.dynamic.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const manifest=JSON.parse(readFileSync(root+'assets/i18n/content-support.json','utf8'));
assert.equal(manifest.languages.de.question_data,'missing','German lessons must remain blocked');
assert.equal(manifest.languages.de.global_qa,'blocked','German release must remain blocked');
const fatihaLearningCases=[
 ['Fâtiha Suresi','Sure Fâtiha'],
 ['Fâtiha · Ayet 1/7','Fâtiha · Vers 1/7'],
 ['Fâtiha · Ayet 7/7','Fâtiha · Vers 7/7'],
 ['Ayet 1 / 7','Vers 1 / 7'],
 ['Ayet 7 / 7','Vers 7 / 7'],
 ['1 · DİNLE','1 · ANHÖREN'],
 ['2 · OKU','2 · LESEN'],
 ['3 · ANLAM','3 · BEDEUTUNG'],
 ['4 · HATIRLA','4 · ERINNERN'],
 ['5 · TAMAMLA','5 · ABSCHLIESSEN'],
 ['Metni gözünle takip et','Lies den Vers aufmerksam mit'],
 ['Yalnız kaynaklı meal gösterilir.','Es werden nur Übersetzungen mit Quellenangabe angezeigt.'],
 ['Önce zihninden söyle, sonra kontrol et.','Sage den Vers zuerst aus dem Gedächtnis auf und überprüfe ihn danach.'],
 ['Kıraat yalnız hakları temizlenmiş kayıt bağlanırsa oynatılır.','Die Rezitation wird nur abgespielt, wenn eine Aufnahme mit geklärten Nutzungsrechten verfügbar ist.'],
 ['Fâtiha 1. ayeti hatırla','Erinnere dich an Vers 1 der Sure Fâtiha'],
 ['AYETİ GÖSTER','VERS ANZEIGEN'],
 ['AYETİ TAMAMLA','VERS ABSCHLIESSEN'],
 ['Ayet 1 sesini dinle','Vers 1 anhören'],
 ['Ayet sesini duraklat','Verswiedergabe pausieren'],
 ['Hoparlöre dokun: Ayet 2 kaydını dinle.','Tippe auf den Lautsprecher, um Vers 2 anzuhören.'],
 ['Ayet 2 dinleniyor…','Vers 2 wird abgespielt…'],
 ['Ayet sesi duraklatıldı.','Verswiedergabe pausiert.']
];
for(const [source,german] of fatihaLearningCases){
 assert.equal(fmt(source),german,'Fatiha UI: '+source);
 assert.equal(fmt('  '+source+'  '),'  '+german+'  ','Fatiha whitespace: '+source);
}
for(const source of ['Fâtiha · Ayet 8/7','Fâtiha 8. ayeti hatırla',
 'Hoparlöre dokun: Ayet 9 kaydını dinle.','Ayet 88 sesini dinle']){
 assert.equal(fmt(source),null,'Unverified Quran UI interpolation must fail closed: '+source);
}

// Source-exact Fatiha memorization and Arabic-only ayah-test UI chrome.
// Religious meaning/answer translation remains prohibited and gated.
const quranStage4Cases=[
 ['Fâtiha Ezberi','Fâtiha auswendig lernen'],
 ['EZBER KADEMESİ 2 / 5','AUSWENDIGLERNSTUFE 2 / 5'],
 ['Tam metin','Vollständiger Vers'],
 ['Bazı kelimeler gizli','Einige Wörter ausgeblendet'],
 ['Çoğu kelime gizli','Die meisten Wörter ausgeblendet'],
 ['Başlangıç ipucu','Anfangshinweis'],
 ['Tamamen ezberden','Vollständig auswendig'],
 ['METNİ GÖSTER','TEXT ANZEIGEN'],
 ['HATIRLADIM','ICH HABE MICH ERINNERT'],
 ['Fâtiha · Ayet 1','Fâtiha · Vers 1'],
 ['Ayet 7 · Boşluk','Vers 7 · Lücke'],
 ['Ayet 1 · Sesi Bul','Vers 1 · Hörübung'],
 ['✓ 0 doğru','✓ 0 richtige Antworten'],
 ['✓ 1 doğru','✓ 1 richtig'],
 ['Test ilerlemesi','Testfortschritt'],
 ['Cevap seçenekleri','Antwortmöglichkeiten'],
 ['Sesli ayet sorusu','Hörfrage zum Vers'],
 ['Zorlandığın ayetler öncelik alır','Verse, die dir schwerfallen, werden zuerst geübt'],
 ['Meal henüz hazır değil','Die geprüfte Übersetzung steht noch aus'],
 ['Başarı puanı yüzde 80','Ergebnis: 80 Prozent'],
 ['1. soru · Ayet 3','Frage 1 · Vers 3']
];
for(const [src,de]of quranStage4Cases){
 assert.equal(fmt(src),de,'Fatiha stage 4 '+src);
 assert.equal(fmt('  '+src+'  '),'  '+de+'  ','Fatiha UI padding');
}
for(const src of ['EZBER KADEMESİ 6 / 5','Fâtiha · Ayet 8','8. soru · Ayet 1',
 'Ayet 8 · Boşluk','Anlamsal soru metni kaynak doğrulaması yok']){
 assert.equal(fmt(src),null,'Quran out of-range/meaning text must fail closed: '+src);
}


const fatihaResultCases=[
 ['YANLIŞLARI REVIEW ET · 4','FEHLER WIEDERHOLEN · 4'],
 ['You need at least %80 to pass. Review your mistakes and retry.',
  'Zum Bestehen sind mindestens 80 % nötig. Übe deine Fehler und versuche es erneut.'],
 ['Fâtiha · Ayah Test','Fâtiha · Verstest'],
 ['Keep practicing ✦ New best','Übe weiter ✦ Neuer Bestwert'],
 ['Well done! ✦ New best','Geschafft! ✦ Neuer Bestwert'],
 ['Hatalı Sorular · Tekrar','Fehler · Wiederholung'],
 ['Question breakdown','Fragenanalyse'],
 ['Personal best','Bestes Ergebnis'],
 ['REVIEW MISTAKES · 2','FEHLER WIEDERHOLEN · 2']
];
for(const [src,dst] of fatihaResultCases)
 assert.equal(fmt(src),dst,'German Fatiha quiz result: '+src);


const nonFatihaQuranCases=[
 ['Nasr Ezberi','Nasr auswendig lernen'],
 ['Felak Ezberi','Felak auswendig lernen'],
 ['Beyyine Ezberi','Beyyine auswendig lernen'],
 ['Ayet 3 / 3','Vers 3 / 3'],
 ['Ayet 1 / 5','Vers 1 / 5'],
 ['Ayet 8 / 8','Vers 8 / 8']
];
for(const [src,de] of nonFatihaQuranCases)
 assert.equal(fmt(src),de,'source-exact shared-engine Quran UI '+src);
for(const src of ['Ayet 8 / 3','Ayet 9 / 8','Ayet 1 / 9'])
 assert.equal(fmt(src),null,'out-of-range Quran counter must fail closed');


const ikhlasNativeCases=[
 ['İhlâs Suresi','Sure İhlâs'],
 ['İhlâs Ezberi','İhlâs auswendig lernen'],
 ['İhlâs Ezber Motoru','İhlâs · Auswendiglernen'],
 ['İhlâs · Ayet 1/4','İhlâs · Vers 1/4'],
 ['İhlâs · Ayet 4/4','İhlâs · Vers 4/4'],
 ['İhlâs 4. ayeti hatırla','Erinnere dich an Vers 4 der Sure İhlâs'],
 ['Ayet 4 / 4 · Bazı kelimeler gizli','Vers 4 / 4 · Einige Wörter ausgeblendet'],
 ['0/4 SAĞLAM','0/4 GEFESTIGT'],
 ['2/4 SAĞLAM','2/4 GEFESTIGT'],
 ['AYET 3','VERS 3'],
 ['İlk öğrenme turu tamamlandı','Erster Lerndurchgang abgeschlossen'],
 ['BAŞTAN GÖZDEN GEÇİR','VON VORN WIEDERHOLEN'],
 ['İhlâs ezberi tamamlandı','İhlâs auswendig gelernt'],
 ['Ayetin tamamını ezberden söyle. Kontrol etmek istersen “Metni göster”e dokun.',
  'Sage den Vers vollständig auswendig auf. Tippe zur Kontrolle auf „Text anzeigen“.'],
 ['Self-check toplamı: 2 başarılı hatırlama · 1 tekrar isteği',
  'Selbstkontrolle: 2 erfolgreiche Erinnerungen · 1 Wiederholungen']
];
for(const [source,german] of ikhlasNativeCases)
 assert.equal(fmt(source),german,'native İhlâs UI '+source);
for(const source of ['İhlâs · Ayet 5/4','İhlâs 5. ayeti hatırla',
 'Ayet 5 / 4 · Bazı kelimeler gizli','5/4 SAĞLAM','AYET 5'])
 assert.equal(fmt(source),null,'outside Ikhlas bounds must fail closed: '+source);


const ikhlasRecitationCases=[
 ['AYET ARASI BEKLEME','PAUSE ZWISCHEN VERSEN'],
 ['Kıraat hazır','Rezitation bereit'],
 ['SEÇİLİ AYETİ LOOP KAPALI','WIEDERHOLUNG DES GEWÄHLTEN VERSES AUS'],
 ['SEÇİLİ AYETİ LOOP AÇIK','WIEDERHOLUNG DES GEWÄHLTEN VERSES AN']
];
for(const [src,de] of ikhlasRecitationCases)
 assert.equal(fmt(src),de,'German Quran recitation controls '+src);


// Eleven source-verified surah identities and bounded native learning labels.
const remainingQuranSurahs=[
 ['Nâs','An-Nās',6],['Kâfirûn','Al-Kāfirūn',6],
 ['Tebbet','Al-Masad',5],['Fîl','Al-Fīl',5],
 ['Kureyş','Quraisch',4],['Mâûn','Al-Māʿūn',7],
 ['İnşirah','Asch-Scharh',8],['Tîn','At-Tīn',8],
 ['Zilzâl','Az-Zalzala',8],['Kevser','Al-Kauthar',3],
 ['Asr','Al-ʿAsr',3]
];
for(const [turkish,german,count] of remainingQuranSurahs){
 assert.equal(fmt(turkish+' Suresi'),'Sure '+german,
  'Source-safe remaining surah title '+turkish);
 assert.equal(fmt(turkish+' Ezberi'),german+' auswendig lernen',
  'Source-safe memorize title '+turkish);
 assert.equal(fmt(turkish+' · Ayah Test'),german+' · Verstest',
  'Stage 9 Quran outcome title '+turkish);
 assert.equal(fmt(turkish+' · Ayah Test · Review'),german+' · Verstest · Wiederholung',
  'Stage 9 Quran practice title '+turkish);
 assert.equal(fmt(turkish+' · Ayet Testi'),german+' · Verstest',
  'Stage 9 native Turkish fallback title '+turkish);
 assert.equal(fmt(turkish+' · 1 / 5'),german+' · 1 / 5',
  'Source-safe quiz question progress '+turkish);
 for(let total=1;total<=5;total++)for(let n=1;n<=total;n++)
  assert.equal(fmt(turkish+' · '+n+' / '+total),
    german+' · '+n+' / '+total,
    'Quran dynamic wrong-answer review counter '+turkish+' '+n+'/'+total);
 assert.equal(fmt(turkish+' · 2 / 1'),null,
  'Review question index cannot exceed session length');
 assert.equal(fmt(turkish+' · 5 / 5'),german+' · 5 / 5',
  'Source-safe final question counter '+turkish);
 assert.equal(fmt(turkish+' · 6 / 5'),null,'Reject invalid question progress');
 for(const verse of [1,count]){
  assert.equal(fmt(turkish+' · Ayet '+verse+'/'+count),
   german+' · Vers '+verse+'/'+count,
   'Bounded progress for '+turkish+' verse '+verse);
  assert.equal(fmt(turkish+' '+verse+'. ayeti hatırla'),
   'Erinnere dich an Vers '+verse+' der Sure '+german);
 }
 assert.equal(fmt(turkish+' · Ayet '+(count+1)+'/'+count),null,
  'Surah progress outside known verse count');
 assert.equal(fmt(turkish+' · Ayet 1/'+(count+1)),null,
  'Wrong source surah length must fail closed');
 assert.equal(fmt(turkish+' '+(count+1)+'. ayeti hatırla'),null,
  'Out-of-range Arabic source must not be reformatted');
}

const cases=[
 ['Doğru. Devam edebilirsin.','Richtig. Du kannst weitermachen.'],
 ["Olmadı ama sorun değil; açıklama bize yolu gösterir.","Das war noch nicht richtig. Die Erklärung hilft dir, es zu verstehen."],
 ["Birlikte düzeltelim","Korrigieren wir es gemeinsam."],
 ["Evet, doğru!","Ja, richtig!"],
 ["1 · ANA FİKİR","1 · KERNGEDANKE"],
 ["Bunu bir arkadaşına nasıl anlatırdın?","Wie würdest du es einer Freundin oder einem Freund erklären?"],
 ["Hatırla: Yönel · Güven · Yaşa","Merke: Hinwenden · Vertrauen · Leben"],
 ["İslam, Allah'a güvenmeyi, O'nun rehberliğini kabul etmeyi ve bunu hayata taşımayı öğretir.","Der Islam lehrt, Allah zu vertrauen, seine Rechtleitung anzunehmen und sie im Alltag umzusetzen."],
 ["İslam, Allah'a yönelmektir.","Islam bedeutet, sich Allah zuzuwenden."],
 ["Öğrenme analizi","Lernanalyse"],
 ["Henüz analiz edilecek cevap yok. İlk mini dersi tamamladığında doğruluk, cevap süresi, soru türleri ve tekrar eden hatalar burada oluşacak.","Es gibt noch keine Antworten zur Auswertung. Nach deiner ersten Mini-Lektion erscheinen hier Antwortgenauigkeit, Antwortdauer, Aufgabentypen und wiederkehrende Fehler."],
 ["Seviye 1","Stufe 1"],
 ["Seviye 12","Stufe 12"],
 ["Kalıcı kozmetik","Dauerhafte kosmetische Anpassung"],
 ["◇ Altın profil çerçevesi","◇ Goldener Profilrahmen"],
 ["★ Altın yol vurgusu","★ Goldene Lernpfad-Hervorhebung"],
 ["❄ Seri koruması","❄ Serienschutz"],
 ["AKTİF PROFİL","AKTIVES PROFIL"],
 ["Başlangıçta mezhep seçimi istenmez.","Zu Beginn ist keine Auswahl einer Rechtsschule erforderlich."],
 ["Dinî içerik ödeme duvarının arkasında değildir.","Religiöse Lerninhalte befinden sich nicht hinter einer Bezahlschranke."],
 ["ERİŞİLEBİLİRLİK & GERİ BİLDİRİM","BARRIEREFREIHEIT & RÜCKMELDUNG"],
 ["SESLİ ANLATIM","SPRACHAUSGABE"],
 ["VERİ & İLERLEME","DATEN & FORTSCHRITT"],
 ["ÜRÜN POLİTİKASI","PRODUKTRICHTLINIEN"],
 ["İlerlemeyi sıfırla","Fortschritt zurücksetzen"],
 ["İlerlemeyi yedekle","Fortschritt sichern"],
 ["ŞİMDİLİK KAPAT","VORERST SCHLIESSEN"],
 ["+5 Pırıltı","+5 Glanzpunkte"],
 ["Günlük hedef · 2 mini ders","Tagesziel · 2 Mini-Lektionen"],
 ["DEEN boyunca sana eşlik edecek hayvanı seç. Bu bir kişilik testi değil; sadece senin görsel yol arkadaşın.","Wähle ein Tier, das dich bei DEEN begleitet. Dies ist kein Persönlichkeitstest, sondern dein Lernbegleiter."],
 ["Seçimini daha sonra Profil ekranındaki hayvana dokunarak değiştirebilirsin.","Du kannst deinen Lernbegleiter später ändern, indem du im Profil auf das Tier tippst."],
 ["Öğrenme ve bilgelik","Lernen und Weisheit"],
 ["5 soru · Ücretsiz","5 Fragen · Kostenlos"],
 ["1 soru · Ücretsiz","1 Frage · Kostenlos"],
 ["0 / 1 ayet","0 / 1 Vers"],
 ["3 / 7 ayet","3 / 7 Verse"],
 ["24 riskli ayetten kişisel tur","Persönliche Übungsrunde mit 24 Versen mit Wiederholungsbedarf"],
 ["37 surelik kontrollü genişleme","Schrittweise Erweiterung auf 37 Suren"],
 ["Ayet 1 / 7 · Son çalışma: Henüz çalışma yok","Vers 1 / 7 · Zuletzt geübt: Noch keine Übung"],
 ["10 doğru cevap","10 richtige Antworten"],
 ["Günlük hedef · 2 ders","Tagesziel · 2 Lektionen"],
 ["Ödül: +25 XP · +12 Pırıltı · +1 seri koruma","Belohnung: +25 XP · +12 Glanzpunkte · +1 Serienschutz"],
 ["Henüz yeterli cevap geçmişi yok. Birkaç ders sonra zayıf kavramlar burada görünür.","Es liegen noch nicht genügend Antworten vor. Nach einigen Lektionen siehst du hier die Themen, die du noch üben solltest."],
 ["İLK DERSİ TAMAMLA","SCHLIESSE DEINE ERSTE LEKTION AB"],
 ["İlk dersinden sonra kişiselleşir","Wird nach deiner ersten Lektion personalisiert"],
 ["İlk mini dersini tamamladığında kişisel tekrar planın burada oluşacak.","Nach deiner ersten Mini-Lektion erscheint hier dein persönlicher Wiederholungsplan."],
 ["İlk üniteni oynadıkça burada kişisel hafıza skoru oluşur.","Beim Üben deiner ersten Einheit entsteht hier dein persönlicher Erinnerungswert."],
 ["Bugünkü küçük çalışma akışı","Dein kurzer Lernablauf für heute"],
 ["FÂTIHA İLE BAŞLA","MIT AL-FĀTIHA BEGINNEN"],
 ["Günlük anlam çalışması","Tägliche Bedeutungsübung"],
 ["Hatırlama çalışması","Erinnerungsübung"],
 ["Hedefler ve hafıza","Ziele und Gedächtnis"],
 ["Riskli ayetleri önce çalış","Übe zuerst Verse, die du noch festigen solltest"],
 ["Çalışma alanları","Lernbereiche"],
 ["Öğrenme kütüphanesi","Lernbibliothek"],
 ["ANLATIM PROFİLİ","LERNSTILPROFIL"],
 ["Değiştir →","Ändern →"],
 ["Doğruluk: Henüz ders yok","Antwortgenauigkeit: Noch keine Lektion"],
 ["🌱 Çocuk · 8–12","🌱 Kind · 8–12"],
 ['%80 GEÇİŞ','ÜBERGANGSSCHWELLE 80 %'],
 ['PREMIUM · SINIRSIZ ENERJİ','PREMIUM · UNBEGRENZTE ENERGIE'],
 ['Premium yalnızca konfor özelliğidir. Dini içerik herkese açıktır. Reklam butonu bu HTML önizlemesinde simülasyondur.','Premium bietet nur Komfortfunktionen. Religiöse Lerninhalte sind für alle frei zugänglich. Der Werbebutton ist in dieser HTML-Vorschau eine Simulation.'],
 ['REKLAM İZLE · +10 ENERJİ','WERBUNG ANSEHEN · +10 ENERGIE'],
 ['SERİ KORUMA','SERIENSCHUTZ'],
 ['SONRAKİ ENERJİ','NÄCHSTE ENERGIEAUFFÜLLUNG'],
 ['Sıradaki: Aktif Hatırlama · Cevabı görmeden bilgiyi zihninden geri çağır.','Als Nächstes: Aktives Abrufen · Rufe das Wissen ab, ohne die Antwort zu sehen.'],
 ['Sıradaki: Bağ Kur · Kavramları doğru anlam ve örneklerle bağla.','Als Nächstes: Verknüpfen · Verbinde Begriffe mit den passenden Bedeutungen und Beispielen.'],
 ['Sıradaki: Duruma Uyarla · Öğrendiğin ilkeyi basit bir duruma uygula.','Als Nächstes: Auf Situationen anwenden · Wende den gelernten Grundsatz auf eine einfache Situation an.'],
 ['Sıradaki: Sesi Tanı · Resmî kaydı dinleyerek doğru ifadeyi tanı.','Als Nächstes: Hören und erkennen · Höre die offizielle Aufnahme und erkenne die richtige Aussage.'],
 ['Sıradaki: Tanı · Temel kavramı güvenli biçimde tanı.','Als Nächstes: Erkennen · Lerne den Grundbegriff behutsam kennen.'],
 ['Sıradaki: Ünite Challenge · Ünitenin temel kavramlarını farklı soru biçimleriyle ustalık seviyesinde kullan.','Als Nächstes: Kapitel-Challenge · Wende die Grundbegriffe der Einheit in verschiedenen Aufgabenformen vertieft an.'],
 ['aşama · Ustalık %0','Etappe · Kenntnisstand 0 %'],


 ['1. KISIM · 1. ÜNİTE','ABSCHNITT 1 · EINHEIT 1'],
 ['3. KISIM · 15. ÜNİTE','ABSCHNITT 3 · EINHEIT 15'],
 ['Ders 1','Lektion 1'],['Ders 2','Lektion 2'],
 ['0/3 · Ders 1','0/3 · Lektion 1'],['2/4 · Ders 3','2/4 · Lektion 3'],
 ['0 ENERJİ','0 ENERGIE'],
 ['Ders 1/3 · Aktif Hatırlama','Lektion 1/3 · Aktives Abrufen'],
 ['Ders 1/3 · Tanı','Lektion 1/3 · Erkennen'],
 ['Ders 1/4 · Bağ Kur','Lektion 1/4 · Verknüpfen'],
 ['Ders 1/4 · Duruma Uyarla','Lektion 1/4 · Auf Situationen anwenden'],
 ['Ders 1/4 · Sesi Tanı','Lektion 1/4 · Hören und erkennen'],
 ['Enerji azaldı','Energie aufgebraucht'],

 ['Bir U01 dersi tamamladığında tekrar takvimin burada oluşacak.','Sobald du eine Lektion in U01 abgeschlossen hast, erscheint hier dein Wiederholungsplan.'],
 ['Derse devam etmek için enerjini yenileyebilirsin. Premium enerji sınırını kaldırır, reklam ise hızlı bir destek verir.','Fülle deine Energie auf, um weiterzulernen. Mit Premium entfällt das Energielimit. Alternativ kannst du dir eine Werbung ansehen.'],

 ['Ünite 1 · Aşama 1','Einheit 1 · Etappe 1'],
 ['Ünite 15 · Aşama 3','Einheit 15 · Etappe 3'],
 ['1 mini ders · yaklaşık 5 dakika','1 Mini-Lektion · etwa 5 Minuten'],
 ['3 mini ders · yaklaşık 15 dakika','3 Mini-Lektionen · etwa 15 Minuten'],
 ['0/3 Görev','0/3 Aufgaben'],
 ['1/3 Görevler','1/3 Aufgaben'],
 ['1 soru','1 Frage'],['2 soru','2 Fragen'],
 ['1 ders','1 Lektion'],['9 ders','9 Lektionen'],
 ['1 gün','1 Tag'],['7 gün','7 Tage'],
 ['1 ayet','1 Vers'],['3 ayet','3 Verse'],
 ['1 sure','1 Sure'],['16 sure','16 Suren'],
 ['1 görev','1 Aufgabe'],['4 görev','4 Aufgaben'],
 ['1 kavram','1 Begriff'],['8 kavram','8 Begriffe'],
 ['1 mini ders · 5 dk','1 Mini-Lektion · 5 Min.'],
 ['3 mini ders · 15 dk','3 Mini-Lektionen · 15 Min.'],
 ['7 güne 1 gün kaldı · +5 Pırıltı','Noch 1 Tag bis zur 7-Tage-Serie · +5 Glanzpunkte'],
 ['30 güne 12 gün kaldı · +15 Pırıltı · +1 seri koruma','Noch 12 Tage bis zur 30-Tage-Serie · +15 Glanzpunkte · +1 Serienschutz'],
 ['1 kaçırılan gün · En fazla 2','1 verpasster Tag · maximal 2'],
 ['2 kaçırılan gün · En fazla 2','2 verpasste Tage · maximal 2'],
 ['5 derslik bu aşamada 3/5 ilerlemedesin.','Du hast 3 von 5 Mini-Lektionen in dieser Etappe abgeschlossen.'],
 ['Ders 2/5','Lektion 2/5'],
 ['Görevler 1/3 · Haftalık ritim 2/7 gün','Tagesaufgaben 1/3 · Wochenrhythmus 2/7 Tage'],
 ['Görevler 2/3 · Haftalık ritim 4/7 gün · 1 tekrar','Tagesaufgaben 2/3 · Wochenrhythmus 4/7 Tage · 1 Wiederholung'],
 ['Görevler 3/3 · Haftalık ritim 5/7 gün · 2 tekrar','Tagesaufgaben 3/3 · Wochenrhythmus 5/7 Tage · 2 Wiederholungen'],
 ['1 soru tekrar bekliyor.','1 Frage wartet auf eine Wiederholung.'],
 ['4 soru tekrar bekliyor.','4 Fragen warten auf eine Wiederholung.'],
 ['1 kavram · 2 enerji','1 Begriff · 2 Energie'],
 ['6 kavram · 3 enerji','6 Begriffe · 3 Energie'],
 ['4 enerji','4 Energie'],['2 HAZIR','2 BEREIT'],
 ['1 kontrol noktası tamamlandı','1 Kontrollpunkt abgeschlossen'],
 ['5 kontrol noktası tamamlandı','5 Kontrollpunkte abgeschlossen'],
 ['1 tekrar bekliyor','1 Wiederholung fällig'],
 ['8 tekrar bekliyor','8 Wiederholungen fällig'],
 ['5/5 mini ders · öğrenme zinciri tamamlandı','5/5 Mini-Lektionen · Lernreihe abgeschlossen'],
 ['Kusursuz dersler: 10','Fehlerfreie Lektionen: 10'],
 ['20 sn','20 Sek.'],
 ['1 soruda hata tekrar ediyor. Akıllı tekrar bu sinyalleri önceliklendirecek.','Bei 1 Frage treten wiederholt Fehler auf. Die intelligente Wiederholung priorisiert diese Themen.'],
 ['8 soruda hata tekrar ediyor. Akıllı tekrar bu sinyalleri önceliklendirecek.','Bei 8 Fragen treten wiederholt Fehler auf. Die intelligente Wiederholung priorisiert diese Themen.'],
 ['KISIM 3 TAMAMLANDI','ABSCHNITT 3 ABGESCHLOSSEN'],
 ['ÜNİTE 12 · ✓ TAMAMLANDI','EINHEIT 12 · ✓ ABGESCHLOSSEN'],
 ['4/5 aşama','4/5 Etappen'],
 ['%75','75 %'],['Ustalık %100','Kenntnisstand 100 %'],
];
for(const [input,expected]of cases){
 assert.equal(fmt(input),expected,input);
 assert.equal(fmt('  '+input+'  '),'  '+expected+'  ',input+':whitespace');
}
const approved={
 'İslam Nedir?':'Was ist der Islam?',
 "Allah'a iman":'Glaube an Allah',
 'Temel Kavramlar':'Grundbegriffe',
 'Namaza Hazırlık':'Vorbereitung auf das Gebet',
 'Melekler Kimdir?':'Wer sind die Engel?',
 'Meleklere İman':'Glaube an die Engel',
 'Pekiştir ve Hatırla':'Festigen und Erinnern',
 "İslam'la Tanış":'Den Islam kennenlernen',
 'Pekiştir ve Hatırla':'Festigen und Erinnern',
 "İslam'la Tanış":'Den Islam kennenlernen',
};
const resolve=s=>approved[s]??null;
for(const [input,expected]of [
 ['Sıradaki aşama · İslam Nedir?','Nächste Etappe · Was ist der Islam?'],
 ["Sonraki mini ders · Allah'a iman",'Nächste Mini-Lektion · Glaube an Allah'],
 ["Doğru cevap: Allah'a iman",'Richtige Antwort: Glaube an Allah'],
 ['Kısaca: Temel Kavramlar','Kurz gesagt: Grundbegriffe'],
 ['Özet: Temel Kavramlar','Zusammenfassung: Grundbegriffe'],
 ['Namaza Hazırlık · ÖĞREN · Aşama 1/5','Vorbereitung auf das Gebet · LERNEN · Etappe 1/5'],
 ['Pekiştir ve Hatırla · HATIRLA · Aşama 4/5','Festigen und Erinnern · ERINNERN · Etappe 4/5'],
 ["İslam'la Tanış · ÖĞREN · Mini ders 1/3",'Den Islam kennenlernen · LERNEN · Mini-Lektion 1/3'],
 ["İslam'la Tanış — 0/3 mini ders tamamlandı",'Den Islam kennenlernen — 0/3 Mini-Lektionen abgeschlossen'],
 ['Melekler Kimdir? · ANLA · Aşama 2/5','Wer sind die Engel? · VERSTEHEN · Etappe 2/5'],
 ['Melekler Kimdir? — Önceki aşamayı tamamla','Wer sind die Engel? — Schließe zuerst die vorherige Etappe ab'],
 ['Meleklere İman mevcut aşamaya git','Zur aktuellen Etappe von Glaube an die Engel springen'],
 ['Meleklere İman · 5 aşamalı öğrenme yolu','Glaube an die Engel · Lernpfad mit 5 Etappen'],
 ['Pekiştir ve Hatırla · HATIRLA · Aşama 4/5','Festigen und Erinnern · ERINNERN · Etappe 4/5'],
 ["İslam'la Tanış · ÖĞREN · Mini ders 1/3",'Den Islam kennenlernen · LERNEN · Mini-Lektion 1/3'],
 ["İslam'la Tanış — 0/3 mini ders tamamlandı",'Den Islam kennenlernen — 0/3 Mini-Lektionen abgeschlossen'],
 ['İslam Nedir? artık bitti. Sıradaki düğüm açıldı.','Was ist der Islam? ist abgeschlossen. Die nächste Etappe wurde freigeschaltet.']
])assert.equal(fmt(input,{translateLabel:resolve}),expected,input);
for(const input of [
 'Bilinmeyen kaynak','Doğru cevap: Bilinmeyen yanıt',
 'Sıradaki aşama · Türkçe kaynak bilinmiyor',
 'Özet: Henüz çevrilmemiş açıklama',
 "Allah'a iman artık bitti. Sıradaki düğüm açıldı.",
 '0/3 Görev: Türkçe metin',
 'Bilinmeyen ders adı · ÖĞREN · Aşama 1/5',
 'Bilinmeyen ders adı — Önceki aşamayı tamamla',
 'Bilinmeyen ünite mevcut aşamaya git',
 '7 güne ? gün kaldı · +5 Pırıltı',
 '',
 null
]){
 const got=fmt(input);
 assert.equal(got,null,'Unknown text must fail closed: '+input);
}
const report={locale:'de',status:'passed',staging_only:true,positive_cases:cases.length+14,
 whitespace_cases:cases.length,negative_cases:12,
 release_ready:false,production_manifest:'blocked'};
console.log(JSON.stringify(report,null,2));
