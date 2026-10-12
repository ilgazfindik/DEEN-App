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
};
const resolve=s=>approved[s]??null;
for(const [input,expected]of [
 ['Sıradaki aşama · İslam Nedir?','Nächste Etappe · Was ist der Islam?'],
 ["Sonraki mini ders · Allah'a iman",'Nächste Mini-Lektion · Glaube an Allah'],
 ["Doğru cevap: Allah'a iman",'Richtige Antwort: Glaube an Allah'],
 ['Kısaca: Temel Kavramlar','Kurz gesagt: Grundbegriffe'],
 ['Özet: Temel Kavramlar','Zusammenfassung: Grundbegriffe'],
 ['İslam Nedir? artık bitti. Sıradaki düğüm açıldı.','Was ist der Islam? ist abgeschlossen. Die nächste Etappe wurde freigeschaltet.']
])assert.equal(fmt(input,{translateLabel:resolve}),expected,input);
for(const input of [
 'Bilinmeyen kaynak','Doğru cevap: Bilinmeyen yanıt',
 'Sıradaki aşama · Türkçe kaynak bilinmiyor',
 'Özet: Henüz çevrilmemiş açıklama',
 "Allah'a iman artık bitti. Sıradaki düğüm açıldı.",
 '0/3 Görev: Türkçe metin',
 '7 güne ? gün kaldı · +5 Pırıltı',
 '',
 null
]){
 const got=fmt(input);
 assert.equal(got,null,'Unknown text must fail closed: '+input);
}
const report={locale:'de',status:'passed',staging_only:true,positive_cases:cases.length+6,
 whitespace_cases:cases.length,negative_cases:9,
 release_ready:false,production_manifest:'blocked'};
console.log(JSON.stringify(report,null,2));
