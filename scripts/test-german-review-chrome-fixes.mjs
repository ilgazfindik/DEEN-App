import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {translateGermanReviewChrome} from '../de-review/assets/i18n/german-review-chrome-fixes.mjs';
const cases=[
 ['Eşleşen çiftleri bul','Finde die passenden Paare'],
 ['Doğru kavramları anlamlarıyla eşleştir.','Ordne die Begriffe den passenden Bedeutungen zu.'],
 ['ADAPTİF TEKRARI BAŞLAT · 7 SORU','ADAPTIVE WIEDERHOLUNG STARTEN · 7 FRAGEN'],
 ['Günlük hayatta ahlak · %45','Moral im Alltag · 45 %'],
 ['Kavramların temel dörtlüsü · %45','Vier grundlegende Begriffe · 45 %'],
 ['Öğreniliyor','Wird gelernt'],
 ['ÇALIŞMAYA DEVAM ET','WEITERLERNEN'],
 ['Ayet 1 / 7 · Son çalışma: Bugün','Vers 1 / 7 · Zuletzt geübt: Heute'],
 ['Ayet 2 / 7 · Son çalışma: Henüz çalışma yok','Vers 2 / 7 · Zuletzt geübt: Noch nicht gelernt'],
 ['Geçmek için %70 veya üzeri gerekiyor.','Zum Bestehen sind mindestens 70 % erforderlich.'],
 ['Bir adım daha — Kartal yanında.','Noch ein Schritt – dein Adler begleitet dich.'],
 ['Tekrar ettikçe güçlenir · Odak','Mit jeder Wiederholung wirst du besser · Fokus'],
 ['ÖĞREN · AŞAMA 1/5','LERNEN · ETAPPE 1/5'],
 ['0/3 mini ders','0/3 Mini-Lektionen'],
 ['Aynı aşama tamamlanmadan sonraki düğüm açılmaz.','Der nächste Lernschritt wird erst nach Abschluss dieser Etappe freigeschaltet.'],
 ['Tägliche Aufgaben 0/3 · Wochenrhythmus 1/5 gün','Tagesaufgaben 0/3 · Wochenrhythmus 1/5 Tage'],
 ['Çok Kolay Tanışma · öğrenme özeti','Einfacher Einstieg · Lernübersicht'],
 ['HAFIZA PLANI AKTİF','WIEDERHOLUNGSPLAN AKTIV'],
 ['2 AUFGABENTYP','2 AUFGABENTYPEN'],
 ['6 TEKRAR ÖNCELİĞİ','6 WIEDERHOLUNGSPRIORITÄTEN'],
 ['11/11 KALICI PLAN','11/11 LANGZEITPLAN'],
 ['1 günlük seri','1-Tage-Serie'],
 ['Sonraki seri ödülü: 3 gün','Nächste Serienbelohnung: nach 3 Tagen'],
 ['DERS ÖDÜLÜ','LEKTIONSBELOHNUNG'],
 ['Ritmini koruyorsun','Du hältst deinen Lernrhythmus'],
 ['Bu mini ders için akıllı tekrar öneriliyor.','Für diese Mini-Lektion empfehlen wir eine gezielte Wiederholung.'],
 ['Aynı atanmış soru seti korunur; tekrar denemesi yeni first-pass içeriği tüketmez.',
  'Das zugewiesene Fragenset bleibt gleich. Ein erneuter Versuch verbraucht keine neuen Fragen für den ersten Durchlauf.']
];
for(const [tr,de] of cases)assert.equal(translateGermanReviewChrome(tr),de,'Wrong German: '+tr);
for(const untouched of [
 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
 'Allah’a teslim olmak İslam’ın temelidir.',
 'İslam, Allah’ın birliğine iman etmektir.',
 'Kuran 2:112',
 'False arbitrary matching option'
])assert.equal(translateGermanReviewChrome(untouched),null,'Source changed: '+untouched);
const renderer=readFileSync('de-review/assets/i18n/german-ui.renderer.staging.mjs','utf8');
const boot=readFileSync('de-review/assets/i18n/german-review-bootstrap.js','utf8');
const manifest=JSON.parse(readFileSync('de-review/assets/i18n/content-support.json','utf8'));
assert.match(renderer,/translateGermanReviewChrome\(value\)/);
assert.match(renderer,/SOURCE_SENSITIVE/);
assert.match(boot,/fixMatchingHeading\(\)/);
assert.match(boot,/replaceChildren\(document.createTextNode\('Finde die '\)\)/);
assert.equal(manifest.languages.de.question_data,'missing');
assert.equal(manifest.languages.de.global_qa,'blocked');
console.log(JSON.stringify({status:'passed',sourceExactCases:cases.length,
 religiousSourceUntouched:true,productionGate:'blocked',splitMatchingHeading:'fixed'},null,2));
