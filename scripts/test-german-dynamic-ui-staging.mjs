import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {formatGermanDynamicText as fmt} from '../assets/i18n/german-ui.dynamic.staging.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const manifest=JSON.parse(readFileSync(root+'assets/i18n/content-support.json','utf8'));
assert.equal(manifest.languages.de.question_data,'missing','German lessons must remain blocked');
assert.equal(manifest.languages.de.global_qa,'blocked','German release must remain blocked');
const cases=[
 ['Doğru. Devam edebilirsin.','Richtig. Du kannst weitermachen.'],
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

 ['%80 GEÇİŞ','80 % BESTEHENSGRENZE'],
 ['PREMIUM · SINIRSIZ ENERJİ','PREMIUM · UNBEGRENZTE ENERGIE'],
 ['SERİ KORUMA','SERIENSCHUTZ'],
 ['SONRAKİ ENERJİ','NÄCHSTE ENERGIEAUFLADUNG'],
 ['REKLAM İZLE · +10 ENERJİ','WERBUNG ANSEHEN · +10 ENERGIE'],
 ['aşama · Ustalık %0','Etappe · Kenntnisstand 0 %'],
 ['Premium yalnızca konfor özelliğidir. Dini içerik herkese açıktır. Reklam butonu bu HTML önizlemesinde simülasyondur.','Premium bietet nur Komfortfunktionen. Religiöse Inhalte sind für alle zugänglich. Die Werbeschaltfläche ist in dieser HTML-Vorschau simuliert.'],
 ['Sıradaki: Aktif Hatırlama · Cevabı görmeden bilgiyi zihninden geri çağır.','Als Nächstes: Aktives Abrufen · Rufe das Gelernte aus dem Gedächtnis ab, ohne die Antwort anzusehen.'],
 ['Sıradaki: Bağ Kur · Kavramları doğru anlam ve örneklerle bağla.','Als Nächstes: Verknüpfen · Verbinde Begriffe mit passenden Bedeutungen und Beispielen.'],
 ['Sıradaki: Duruma Uyarla · Öğrendiğin ilkeyi basit bir duruma uygula.','Als Nächstes: Auf Situationen anwenden · Wende das Gelernte auf eine einfache Situation an.'],
 ['Sıradaki: Sesi Tanı · Resmî kaydı dinleyerek doğru ifadeyi tanı.','Als Nächstes: Hören und erkennen · Höre die offizielle Aufnahme und erkenne die richtige Formulierung.'],
 ['Sıradaki: Tanı · Temel kavramı güvenli biçimde tanı.','Als Nächstes: Erkennen · Lerne den Grundbegriff auf verlässliche Weise kennen.'],
 ['Sıradaki: Ünite Challenge · Ünitenin temel kavramlarını farklı soru biçimleriyle ustalık seviyesinde kullan.','Als Nächstes: Kapitel-Challenge · Wende die Grundbegriffe der Einheit in verschiedenen Aufgabenformaten sicher an.'],

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
