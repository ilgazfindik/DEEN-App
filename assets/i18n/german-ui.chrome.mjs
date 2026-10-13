/* German production (release-gated): source-exact, presentation-only hotfix for lesson, review,
 * Quran progress and completion chrome. Never touches source-sensitive question
 * nodes, answer choices, verse meanings or Arabic recitation. */
const EXACT=Object.freeze({
 'Eşleşen çiftleri bul':'Finde die passenden Paare',
 'Doğru kavramları anlamlarıyla eşleştir.':'Ordne die Begriffe den passenden Bedeutungen zu.',
 'Soruyu cevapla':'Beantworte die Frage',
 'Cümleyi tamamla':'Ergänze den Satz',
 'Dinle ve cevapla':'Höre zu und antworte',
 'Bu cümleyi söyle':'Sprich diesen Satz',
 'Doğru sıraya koy':'Bringe die Teile in die richtige Reihenfolge',
 'Doğru mu, yanlış mı?':'Richtig oder falsch?',
 'Doğru cevabı seç':'Wähle die richtige Antwort',
 'Öğreniliyor':'Wird gelernt',
 'ÇALIŞMAYA DEVAM ET':'WEITERLERNEN',
 'Ayet 1 / 7 · Son çalışma: Bugün':'Vers 1 / 7 · Zuletzt geübt: Heute',
 'Son çalışma: Bugün':'Zuletzt geübt: Heute',
 'Son çalışma: Henüz çalışma yok':'Zuletzt geübt: Noch keine Übung',
 'Geçmek için %70 veya üzeri gerekiyor.':'Zum Bestehen sind mindestens 70 % erforderlich.',
 'Bir adım daha — Kartal yanında.':'Noch ein Schritt – dein Adler begleitet dich.',
 'Tekrar ettikçe güçlenir · Odak':'Mit jeder Wiederholung wirst du besser · Fokus',
 'ÖĞREN · AŞAMA 1/5':'LERNEN · ETAPPE 1/5',
 'Bu aşamada ilerliyorsun':'Du machst in dieser Etappe Fortschritte',
 'Aynı aşama tamamlanmadan sonraki düğüm açılmaz.':'Der nächste Lernschritt wird erst nach Abschluss dieser Etappe freigeschaltet.',
 'Çok Kolay Tanışma · öğrenme özeti':'Einfacher Einstieg · Lernübersicht',
 'Çok Kolay Tanışma':'Einfacher Einstieg',
 'öğrenme özeti':'Lernübersicht',
 'AUFGABENTYP':'AUFGABENTYPEN',
 '1 AUFGABENTYP':'1 AUFGABENTYP',
 'HAFIZA PLANI AKTİF':'WIEDERHOLUNGSPLAN AKTIV',
 'TEKRAR ÖNCELİĞİ':'WIEDERHOLUNGSPRIORITÄT',
 'KALICI PLAN':'LANGZEITPLAN',
 'Aynı atanmış soru seti korunur; tekrar denemesi yeni first-pass içeriği tüketmez.':'Das zugewiesene Fragenset bleibt gleich. Ein erneuter Versuch verbraucht keine neuen Fragen für den ersten Durchlauf.',
 'Sonraki seri ödülü: 3 gün':'Nächste Serienbelohnung: in 3 Tagen',
 'DERS ÖDÜLÜ':'LEKTIONSBELOHNUNG',
 'Ritmini koruyorsun':'Du hältst deinen Lernrhythmus',
 'Bu mini ders için akıllı tekrar öneriliyor.':'Für diese Mini-Lektion empfehlen wir eine gezielte Wiederholung.',
 'Geçiş için %70 gerekiyor. Aynı atanmış soru seti korunacak; yeni first-pass içerik tüketilmeyecek.':'Zum Bestehen sind 70 % erforderlich. Das Fragenset bleibt gleich; neue Fragen für den ersten Durchlauf werden nicht verbraucht.',
 'Günlük hayatta ahlak':'Moral im Alltag',
 'Günlük Hayat':'Alltag',
 'Kavramların temel dörtlüsü':'Vier grundlegende Begriffe',
 'Öğüt bütünlük':'Aufrichtigkeit und Integrität',
 'Ödül':'Belohnung',
 'Ödüller':'Belohnungen',
 'Öğrenme özeti':'Lernübersicht',
 'Tekrar önceliği':'Wiederholungspriorität',
 'Kalıcı plan':'Langzeitplan',
 'Ayet':'Vers',
 'Bugün':'Heute'
});

// Source-identified learning-memory metadata. These source labels are rendered
// in .v640-weak-row and .v640-unit-card, never in answer/verse surfaces.
const REVIEW_UNITS=Object.freeze({
 'İslam Nedir?':'Was ist der Islam?',
 "Allah'a İman":'Glaube an Allah',
 'Allah’a İman':'Glaube an Allah',
 'Kelime-i Şehadet':'Schahāda',
 "İslam'ın Beş Şartı":'Die fünf Säulen des Islam',
 'İslam’ın Beş Şartı':'Die fünf Säulen des Islam',
 'İmanın Esaslarına Giriş':'Einführung in die Glaubensgrundlagen',
 'Meleklere İman':'Glaube an die Engel',
 'Kitaplara İman':'Glaube an die offenbarten Bücher',
 'Peygamberlere İman':'Glaube an die Propheten',
 'Ahiret Gününe İman':'Glaube an den Jüngsten Tag',
 'Kader ve Kazaya İman':'Glaube an die Vorherbestimmung',
 'İbadet Bilinci':'Bewusstsein für die Anbetung',
 'Temizlik ve Abdest':'Reinheit und Gebetswaschung',
 'Namaza Hazırlık':'Vorbereitung auf das Gebet',
 'Namazın Yapısı':'Aufbau des Gebets',
 'Oruç ve Ramazan':'Fasten und Ramadan'
});
const PRIORITY=Object.freeze({'Öncelikli':'Hohe Priorität',
 'Gelişiyor':'In Entwicklung','Dengeli':'Ausgeglichen'});
const MEMORY_TOPICS=Object.freeze({
 'Öğüt bütünlük':'Aufrichtigkeit und Integrität',
 'Öğüt bütünlüğü':'Aufrichtigkeit und Integrität',
 'Kavramları eşleştirme':'Begriffe zuordnen',
 'Kavramların eşleşmesi':'Begriffe zuordnen',
 'Temel kavramlar':'Grundbegriffe',
 'Günlük hayatta ahlak':'Moral im Alltag',
 'Kavramların temel dörtlüsü':'Vier grundlegende Begriffe',
 "Allah'a iman tanımı":'Definition des Glaubens an Allah',
 'Allah’a iman tanımı':'Definition des Glaubens an Allah'
});

const trim=v=>String(v??'').trim();
export function translateGermanChrome(input){
 if(typeof input!=='string')return null;
 const text=trim(input);
 if(!text||/[\u0600-\u06ff]/u.test(text))return null;
 const emit=replacement=>input.replace(text,replacement);
 if(Object.hasOwn(EXACT,text)&&text!=='Sonraki seri ödülü: 3 gün')return emit(EXACT[text]);
 let m;

 // The v6.4 unit mastery widget emits all three counters in one text node.
 // Preserve counts verbatim and inflect "Begriff" only for the learned count.
 if((m=/^(\d+)\s+öğrenilmiş kavram\s*·\s*(\d+)\s+güçlendirilecek\s*·\s*(\d+)\s+vadesi gelen$/.exec(text)))
  return emit(m[1]+' '+(m[1]==='1'?'Begriff':'Begriffe')+' gelernt · '+
   m[2]+' zu festigen · '+m[3]+' fällige Wiederholungen');
 // Only named learning units and known urgency states can enter this branch.
 if((m=/^(.+?)\s*·\s*(Öncelikli|Gelişiyor|Dengeli)(?:\s*·\s*(\d+)\s+tekrar bekliyor)?$/.exec(text))){
  const unit=REVIEW_UNITS[m[1]];
  if(!unit)return null;
  return emit(unit+' · '+PRIORITY[m[2]]+(m[3]?' · '+m[3]+' Wiederholungen fällig':''));
 }
 // Topic chips are app metadata (not answer content); percent 0..100 only.
 if((m=/^(.+?)\s*·\s*%?\s*(\d{1,3})\s*%?$/.exec(text))){
  const title=MEMORY_TOPICS[m[1]];
  if(title&&Number(m[2])<=100)return emit(title+' · '+Number(m[2])+' %');
 }
 // UI metadata only. Do not infer or translate question bodies or options.
 // All patterns anchor the ENTIRE rendered label and preserve all counts.
 if((m=/^(Allah['’]a iman tanımı|Günlük hayatta ahlak|Öğüt bütünlük|Kavramların temel dörtlüsü)\s*[·:]\s*%?\s*(\d{1,3})\s*%?$/.exec(text))){
  const topics={"Allah'a iman tanımı":"Definition des Glaubens an Allah",
   "Allah’a iman tanımı":"Definition des Glaubens an Allah",
   "Günlük hayatta ahlak":"Moral im Alltag",
   "Öğüt bütünlük":"Aufrichtigkeit und Integrität",
   "Kavramların temel dörtlüsü":"Vier grundlegende Begriffe"};
  const rate=Number(m[2]);
  return rate<=100?emit(topics[m[1]]+' · '+rate+' %'):null;
 }
 if((m=/^(\d{1,2})\.\s*KISIM\s*·\s*(\d{1,2})\.\s*ÜNİTE(\s*·\s*✓\s*TAMAMLANDI)?$/.exec(text)))
  return emit('ABSCHNITT '+m[1]+' · EINHEIT '+m[2]+(m[3]?' · ✓ ABGESCHLOSSEN':''));
 // On the result card, the fire icon can live in the same text node.
 if((m=/^(🔥\s*)?(\d+)\s+günlük\s+seri$/u.exec(text))){
  const days=Number(m[2]);
  return emit((m[1]||'')+days+' '+(days===1?'Tag':'Tage')+' in Folge');
 }
 // A previous preview rendered the grammatically incorrect "1-Tage-Serie".
 if((m=/^(\d+)-Tage-Serie$/.exec(text))){
  const days=Number(m[1]);
  return emit(days+' '+(days===1?'Tag':'Tage')+' in Folge');
 }
 if((m=/^Sonraki ödül\s*:?\s*(\d+)\s+gün$/.exec(text)))
  return emit('Nächste Belohnung: in '+m[1]+' '+(m[1]==='1'?'Tag':'Tagen'));
 if((m=/^Sonraki seri ödülü:\s*(\d+)\s+gün$/.exec(text)))
  return emit('Nächste Serienbelohnung: in '+m[1]+' '+(m[1]==='1'?'Tag':'Tagen'));
 if((m=/^ADAPTİF TEKRARI BAŞLAT\s*·\s*(\d+)\s*SORU$/.exec(text)))
  return emit('ADAPTIVE WIEDERHOLUNG STARTEN · '+m[1]+' FRAGEN');
 if((m=/^Ayet\s+(\d+)\s*\/\s*(\d+)\s*·\s*Son çalışma:\s*(Bugün|Henüz çalışma yok)$/.exec(text)))
  return emit('Vers '+m[1]+' / '+m[2]+' · Zuletzt geübt: '+(m[3]==='Bugün'?'Heute':'Noch keine Übung'));
 if((m=/^Geçmek için\s*%(\d{1,3})\s*veya üzeri gerekiyor\.$/.exec(text)))
  return emit('Zum Bestehen sind mindestens '+m[1]+' % erforderlich.');
 if((m=/^ÖĞREN\s*·\s*AŞAMA\s*(\d+)\s*\/\s*(\d+)$/.exec(text)))
  return emit('LERNEN · ETAPPE '+m[1]+'/'+m[2]);
 if((m=/^(\d+)\/(\d+)\s+mini ders$/.exec(text)))
  return emit(m[1]+'/'+m[2]+' Mini-Lektionen');
 if((m=/^Tägliche Aufgaben\s*(\d+)\/(\d+)\s*·\s*Wochenrhythmus\s*(\d+)\/(\d+)\s+gün$/.exec(text)))
  return emit('Tagesaufgaben '+m[1]+'/'+m[2]+' · Wochenrhythmus '+m[3]+'/'+m[4]+' Tage');
 if((m=/^Görevler\s*(\d+)\/(\d+)\s*·\s*Haftalık ritim\s*(\d+)\/(\d+)\s+gün$/.exec(text)))
  return emit('Tagesaufgaben '+m[1]+'/'+m[2]+' · Wochenrhythmus '+m[3]+'/'+m[4]+' Tage');

 if((m=/^Sonraki seri ödülü:\s*(\d+)\s*gün$/.exec(text)))
  return emit('Nächste Serienbelohnung: nach '+m[1]+' Tagen');
 if((m=/^(\d+)\s+AUFGABENTYP$/.exec(text)))
  return emit(m[1]+' '+(m[1]==='1'?'AUFGABENTYP':'AUFGABENTYPEN'));
 if((m=/^(\d+)\s+TEKRAR ÖNCELİĞİ$/.exec(text)))
  return emit(m[1]+' WIEDERHOLUNGSPRIORITÄTEN');
 if((m=/^(\d+)\/([\d]+)\s+KALICI PLAN$/.exec(text)))
  return emit(m[1]+'/'+m[2]+' LANGZEITPLAN');
 if((m=/^Bir adım daha\s*—\s*(Aslan|Kurt|Baykuş|Kaplumbağa|Kartal|Kedi)\s+yanında\.$/.exec(text))){
  const animals={Aslan:'dein Löwe',Kurt:'dein Wolf',Baykuş:'deine Eule',
   Kaplumbağa:'deine Schildkröte',Kartal:'dein Adler',Kedi:'deine Katze'};
  return emit('Noch ein Schritt – '+animals[m[1]]+' begleitet dich.');
 }
 if((m=/^Tekrar ettikçe güçlenir\s*·\s*(Odak|Sabır|Bilgelik|Cesaret|Kararlılık|Sakinlik)$/.exec(text))){
  const traits={Odak:'Fokus',Sabır:'Geduld',Bilgelik:'Weisheit',
   Cesaret:'Mut',Kararlılık:'Entschlossenheit',Sakinlik:'Gelassenheit'};
  return emit('Mit jeder Wiederholung wirst du besser · '+traits[m[1]]);
 }
 if((m=/^Çok Kolay Tanışma\s*·\s*(öğrenme özeti|Öğrenme özeti)$/.exec(text)))
  return emit('Einfacher Einstieg · Lernübersicht');
 if((m=/^(Günlük hayatta ahlak|Kavramların temel dörtlüsü|Öğüt bütünlük)\s*·\s*%(\d{1,3})$/.exec(text))){
  const topics={'Günlük hayatta ahlak':'Moral im Alltag',
   'Kavramların temel dörtlüsü':'Vier grundlegende Begriffe',
   'Öğüt bütünlük':'Aufrichtigkeit und Integrität'};
  return emit(topics[m[1]]+' · '+m[2]+' %');
 }
 // Some result markup concatenates partially translated German counters with
 // Turkish suffixes; preserve all numeric values and the surrounding context.
 if((m=/^(\d+)\/([\d]+)\s+(?:gün|Tag)\b/.exec(text))&&m[0]===text)
  return emit(m[1]+'/'+m[2]+' Tage');
 return null;
}