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
 let m;
 if((m=n.match(/^Ünite\s+(\d+)\s*·\s*Aşama\s+(\d+)$/)))return emit('Einheit '+m[1]+' · Etappe '+m[2]);

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
 if((m=n.match(/^(.+?)\s*·\s*ÖĞREN\s*·\s*Mini ders\s+(\d+)\/(\d+)$/))){
  const name=label(m[1]);return name?emit(name+' · LERNEN · Mini-Lektion '+m[2]+'/'+m[3]):null;
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

  'Enerji azaldı':'Energie aufgebraucht',
  'Bir U01 dersi tamamladığında tekrar takvimin burada oluşacak.':
   'Sobald du eine Lektion in U01 abgeschlossen hast, erscheint hier dein Wiederholungsplan.',
  'Derse devam etmek için enerjini yenileyebilirsin. Premium enerji sınırını kaldırır, reklam ise hızlı bir destek verir.':
   'Fülle deine Energie auf, um weiterzulernen. Mit Premium entfällt das Energielimit. Alternativ kannst du dir eine Werbung ansehen.',
 };
 if(Object.hasOwn(observedUI,n))return emit(observedUI[n]);

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
