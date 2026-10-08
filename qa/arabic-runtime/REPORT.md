# DEEN v9.12.68 — Arapça çalışma zamanı ve kararlılık raporu

Build: `9388centralarabic1`. Başlangıç: `main@0881bde7c3d4c1083159ba8181cec852b7d17e08`.
Testler gerçek 67 release segmentini birleştiren uygulamada, ayrı ve geçici Chromium profillerinde çalıştırıldı. Kullanıcı hesabının kayıtları test amacıyla değiştirilmedi. Bu dosya yayın öncesi test kanıtıdır; canlı Pages doğrulaması ayrıca yapılır.

## Donmanın kanıtlanan nedenleri

1. Eski Arapça DOM tarayıcısı SCRIPT/STYLE düğümlerini de çeviriye sokuyordu. Büyük gömülü kaynak ve görsel verilerine çok sayıda düzenli ifade uygulanıyordu. Eski açılış otomasyon çağrıları tamamlanmadı; SCRIPT/STYLE hariç tutulan kontrollü denemede tarayıcı `CHROME START` → `CHROME END` ve uygulama durumunu döndürdü. Yeni ortak çevirici görünür metinleri işler, kaynak kodunu işlemez; yazarken gözlemciyi durdurur ve değişen kökleri tek animation frame içinde toplar. Tamamlanamayan eski profilden sayısal CPU hızlanma oranı üretilemedi.
2. Tamamlanmış dersleri bulunan bir profilin yeniden açılışında ayrı bir darboğaz yakalandı. Chromium debugger yığını `learnedConceptSet640 → allowed640 → eligible → dueCount → NextAction.evaluate → renderHome → guardedReturnCard → updateUI` gösterdi. Her aday soru, tüm soru bankasını ve tamamlanan aşama kümelerini yeniden tarıyordu. Tek durum anlık görüntüsüne bağlı indeksler bu tekrarları kaldırdı; save/grade/result olayları indeksleri geçersiz kılar. Aynı kayıtla açılış ve yenileme artık tamamlandı. Yığın: [old-stall-stack.json](old-stall-stack.json).
3. Maskot kilidi her render/mascot olayı için kapatılıp yeniden oluşturulan bir gözlemci kullanıyordu. Önceki dayanıklılık koşusunda 8.457 oluşturma kaydedildi; gözlemciler kapatıldığı için bu sayı aktif gözlemci sayısı değildi. Aynı gözlemciyi kullanıp yalnızca soru alanı değiştiğinde hedefini değiştiriyoruz. Son oluşturma/aktif sayıları [runtime-report.json](runtime-report.json) içinde.
4. Rozet metnini sürekli Türkçe yazıp Arapça yerelleştirmeyle yeniden değiştiren geri besleme engellendi. Parser sahipliğindeki typography style taşıması DOMContentLoaded sonrasına ertelendi. Ayrıca kapsam dışında `renderHome` referansı yüzünden duran ekonomi başlangıç betiği düzeltildi. Bu yardımcı sorunlar birinci ve ikinci nedenden ayrı ele alındı.

## Türkçe soruların gerçek kaynağı

Eski iki aşamalık pilot, tam banka API'si ve üç Arapça başlatma wrapper'ı aynı global adları/fonksiyonları değiştiriyordu. Arapça makro başlatma yolu, mevcut beş düğümlü/mini dersli motoru eski yedi teknik aşamaya eşliyordu. Eski ders havuzunda Türkçe olarak yerinde değiştirilmiş U01 kayıtları da saklanıyordu. Varyantı önce seçmek, aynı ID için geçerli temel çeviriyi gölgeliyordu; 42 canlı basitleştirilmiş soru metni de tam kaynak eşleştirmesinden geçmiyordu. Sonradan çalışan sunum süsleyicileri çevrilmiş başlıkları tekrar Türkçe yazabiliyordu.

Alternatif başlatıcılar kaldırıldı. Yerel ders/mini ders/tekrar motoru korundu. Arapça ders havuzu güncel QUESTIONS bankasını kullanır. Render öncesinde yetkili çeviri yolu, canlı → varyant → temel adaylarını tam kaynak parmak iziyle doğrular. Çeviri başarısızsa ders için enerji/progress harcanmadan ID içeren hata gösterilir; Türkçe soruya sessiz dönüş yapılmaz. Türkçe kaynak kayıtları çeviri sırasında değiştirilmez.

## Dosyalar ve mimari

| Dosya/grup | Değişiklik |
|---|---|
| `index.html`, `assets/i18n/boot.js`, `boot.css` | Girişten önce altı dil; onboarding → preparing/error → ready state machine; gerçek paket ilerlemesi; retry; 67 segment için SHA-256 doğrulaması ve build'e ait cache |
| segment 09/11/13/23/24 | Temel bankanın bağımsız anlık görüntüsü; yerel ders/makro/tekrar başlangıcında doğrulama; render arbiter ve ilerleme kayıtlarının korunması; uygunluk indeksleri; maskot gözlemcisi tekrar kullanımı |
| segment 48/66 | Tek locale durumu; ortak, geri döndürülebilir UI çeviricisi; çakışan pilot/başlatıcıların kaldırılması; kaynak uyumsuzluğunda kapalı davranış; canlı soru varyantları |
| segment 14/15/21/34/36/52/53/56 | Başlangıç ReferenceError onarımı; Türkçe metin tekrar yazımlarının engellenmesi; görünür escape kalıntılarının silinmesi; Kur'an dinleme adımına metinden bağımsız semantic işaret; Arapça meal eksikliğinde açık uyarı |
| `assets/i18n/questions/ar/units/U01..U15.json`, `runtime/U01.live.json` | Kaynak parmak izleri, kaynak notları, açık prompt varyantları; üç yinelenmiş doğru seçenek düzeltilmesi; U03'te bir belgelenmiş Arapça gramer sıralaması |
| `scripts/audit-*`, `scripts/test-arabic-*.cjs`, CI workflow | Tam banka yapısal kontrolü, derleme/hash denetimi, gerçek tarayıcı testleri ve kanıt yükleme |

Tüm sayfanın yönü körlemesine ters çevrilmedi. Arapça metin ve girişler RTL; navigasyon, ilerleme ve Latin/ID bağlamları uygun yönlerini korur. Mevcut giriş ekranındaki simülasyon açıklaması korunmuştur; gerçek Apple/Google/e-posta backend'i eklenmedi.

## Kapsam ve sonuçlar

| Kontrol | Sonuç |
|---|---|
| Temel bankanın Türkçe kaynakla ID eşleşmesi | 1.500 benzersiz kayıt; 15 × 100; 105 teknik aşama |
| Tam yapısal çeviri denetimi | 1.500; 1.222 seçenekli, 139 matching, 38 sequence, 282 boşluk içeren kayıt; yanlış doğru-seçenek konumu 0 |
| Kaynak uyumsuzluğu enjeksiyonu | 1.500 değiştirilmiş kaynak reddedildi |
| Güncel U01 canlı banka / ek varyant paketi | 84 canlı kayıt / 20 uyumluluk varyantı; 42 açık prompt alias |
| Gerçek teknik ders başlangıcı | 105/105; her birinde Arapça soru render edildi |
| Mevcut görünür makro düğümler | 75/75; mini ders metadata'sı korunarak açıldı |
| Kanonik renderer ile tüm kayıtlar | 1.584 benzersiz ID: 1.500 temel + 84 canlı; güncel aktif banka 1.484'tür, çünkü eski U01 100 kaydının yerini 84 canlı kayıt alır |
| Gerçek buton/input etkileşimi | Kullanılan 15 soru tipi ayrı ayrı doğru cevap/feedback ile geçti |
| Tekrar | smart, quick, mistakes, weak, due yolları Arapça oturum açtı |
| Tam ders ve ödül | 12 gerçek cevap; Arapça sonuç; XP 777 → 817; currency 10; U01-S01 completion; yenilemede korundu |
| Cache ve hata | U07 için HTTP 503: %100 yok, onboarding tamamlanmadı; retry başarılı. Bozuk segment cache'i yeniden indirildi, eski release cache silindi; XP 321 ve tamamlanan aşama korundu |
| Dil ve eski profil | Arapça yenilemede korundu; eski tamamlanmış profil yeniden onboarding istemedi; ardından gerçek Türkçe makro sorusu açıldı |
| Mobil/masaüstü | 320, 390, 1440 px; yatay taşma kontrolleri ve ekran görüntüleri |
| Maskot/rozet/admin | Altı maskot seçeneği; kaydedilen maskot korundu; profilde 10 rozet/görsel; yetkili admin paneli aç/kapat ve snapshot; enerji ödülü 10 → 20 |
| JavaScript/release | 193 inline script + boot.js derlendi; 67 segment hash'i tutarlı; test profillerinde pageerror yok |

Dayanıklılık ölçümü dersler arası geçiş, 1.584 render, farklı cevap türleri, tekrar ve yenileme içerir. Global event listener kaydı öncesi/sonrası 423/423'tür. CDP CPU TaskDuration, heap, uzun görevler ve observer callback/mutation sayıları [runtime-report.json](runtime-report.json) ve [idle.cpuprofile](idle.cpuprofile) içindedir. Açılışta halen 50 ms'yi aşan işler vardır; donmanın tekrarlanmaması bütün uzun görevlerin kaldırıldığı anlamına gelmez. Headless, ortak çalışma ortamındaki ölçüm fiziksel cihaz için performans garantisi değildir; zorunlu GC sonrası heap ile kısa vadeli retained-memory kontrolü yapılmıştır, saatlerce kullanım sertifikası verilmemiştir.

## Kur'an ve içerik sınırları

16 surede gerçek ilk ayet sesi oynadı; 90 yerel ses kaydı denetimi geçti. Öğren, Ezber, 16 surede Ayet Testi, beş eski pratik türü ve altı arena türü açıldı. 90 ayet kaydının içerik verisi dinleme/render öncesi ve sonrası aynı kaldı. Fatiha kelime vurgusu gerçek oynayan seste kontrol edildi. Kesin kelime zaman damgası bulunan ayet sayısı **0**; mevcut ağırlıklı senkronizasyon çalışır, hassas kelime hizalaması doğrulanmış değildir.

Depoda kaynakla doğrulanmış Arapça meal bulunmuyor. Arapça meal/meal testi ve ona bağlı final için açık Arapça eksiklik uyarısı gösterilir; Türkçe meal sessizce gösterilmez ve yeni meal uydurulmaz. Var olan ayet metinleri ve diğer dillerdeki kaynaklı mealler korunur. Bu, tüm Arapça meal içeriğinin tamamlandığı anlamına gelmez.

**1.500 temel çeviride uzman onayı 0.** `release_ready`, `verified_by_religious_expert` ve ilgili uzman onay alanları gerçek onay olmadan true yapılmadı. Otomatik denetim dilsel anlamın, her yanlış seçeneğin semantiğinin veya dinî/mezhebî doğruluğun insan uzman tarafından onaylandığı anlamına gelmez. Bunlar uzman incelemesi bekleyen taslaklardır. Seslerin kaynaktaki sahip tarafından sağlanan/üretilen kayıtları da bu çalışma ile yeni dinî sertifika kazanmadı.

Fiziksel Android/iOS cihazı, Safari, gerçek hesap sağlayıcı backend'i, insan Arapça/dinî uzman incelemesi ve uzun süreli saha kullanımı bu testin kapsamı dışındadır.

## Yeniden çalıştırma

Node 22, Playwright 1.62.1 ve Chromium gerekir. `DEEN_CHROMIUM` alternatif Chromium executable'ı; `DEEN_QA_OUTPUT` çıktı klasörü için kullanılabilir. Testler kendi yerel HTTP sunucularını ve ayrı profillerini oluşturur.

```sh
node scripts/build-release-manifest.mjs --check
node scripts/audit-release.mjs
node scripts/audit-arabic-questions.mjs
node scripts/audit-arabic-fullbank.mjs
node scripts/test-arabic-startup.cjs
node scripts/test-arabic-interactions.cjs
node scripts/test-arabic-quran.cjs
node scripts/test-arabic-regression.cjs
node scripts/test-arabic-runtime.cjs
```

Segment değişirse `node scripts/build-release-manifest.mjs` ile index manifesti yeniden üretilmelidir. Testlerdeki unlock/energy/veri enjeksiyonu sadece geçici test profiline yapılır; uygulama başlangıcında kullanıcı ilerlemesini açan/sıfırlayan bir mekanizma değildir.

Soru, seçenek ve açıklama kanıtları: [arabic-question.png](arabic-question.png), [arabic-feedback.png](arabic-feedback.png), [arabic-result.png](arabic-result.png). Diğer kayıtlar: [startup-report.json](startup-report.json), [interaction-report.json](interaction-report.json), [surface-scan.json](surface-scan.json), [regression-report.json](regression-report.json).

## Son sayısal ölçüm

Beş saniye boşta CDP TaskDuration: 0.900 s; uzun görev: 0. Heap: 15,978,164 → 16,490,532 byte; 1.584 render sonrasında GC ile 18,190,748 byte. İlk 12 saniyede 54 uzun görev, en uzunu 942 ms. Gözlemci oluşturma sayısı render taramasının öncesi/sonrası 29/29, aktif 26. Global listener kaydı 423/423. Bu sayılar aynı headless çalışma ortamındaki ölçümlerdir.
