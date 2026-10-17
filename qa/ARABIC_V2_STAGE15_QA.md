# DEEN Arapça V2 — 15. aşama: mobil, ağ, çevrimdışı ve kalıcı ilerleme

**Durum:** Regresyon testi eklendi; CI doğrulaması tamamlanmadan aşama **tamamlandı** sayılmayacak.

## Otomatik test
`scripts/test-arabic-v2-mobile-lifecycle-chrome.cjs` gerçek, 67 segmentli uygulamayı ayrı Chrome profilinde açar.

- 450 ms geciktirilmiş bir sürüm segmentiyle gerçek yükleme yolunu sınar; süre ölçümü yalnızca test cihazına özgüdür, genel performans SLA değildir.
- 320 ve 375 pikselde Arapça RTL V2 dersinin yatay taşmamasını denetler.
- 600 soruluk soru motorunun açılmasını, ilk yanlışın açıklamasını, yarım bırakılan dersin doğru cevap istatistiği olarak kaydedilmemesini sınar.
- Aynı kullanıcı profilinde yeniden yükleme sonrasında XP, enerji, kalp ve mevcut ders ilerlemesinin korunmasını doğrular.
- Ağ bağlantısını uygulama açıkken keserek yüklü dersin kullanılabildiğini; ardından **yeni çevrimdışı gezinmeyi** ayrı deney olarak sınar.
- İşlenemeyen ses için sahte ses/oynanmış kayıt veya hatalı ilerleme üretmemeli; ilgili ses ve dinleme testleri mevcut CI paketiyle birlikte korunur.

İlgili GitHub Actions iş akışları: `Quran Arabic Words Fast QA` ve `Arabic question bank audit`. CI raporu `deen-qa/arabic-v2-stage15-mobile.json` içinde ölçümleri saklar.

## Bilinen ürün boşluğu — offline başlatma

Şu an `index.html` sürüm segmentlerini `CacheStorage` içerisine alıyor. Ancak repository kökünde bir `sw.js` görünmüyor ve uygulama çevrimdışı ilk açılış için bir offline gezinme garantisi vermiyor. Önceden açılmış dersin aynı sekmede çevrimdışı etkileşimi, **yeni sekmede internetsiz açılışla aynı şey değildir**.

Gerçek browser deneyinde çevrimdışı yeni navigasyon başarısızsa `OFFLINE_FRESH_NAVIGATION_NOT_SUPPORTED` uyarısı kaydedilecek; test bu işlevi varmış gibi sunmayacak. Tam PWA çevrimdışı desteği hedefleniyorsa ayrıca version pinning, tam önbellekleme, sıfır hasarlı geri dönüş (rollback), yeni/eski iki sekme ve beş dil/asset kapsama testleri gerekecek.

## Yayın kapısı

Paketler 600/600, beş dilde içerik ve Arapça RTL testleri sağlam; bunun yanında 15. aşamanın son Chrome testi ve geniş uygulama regresyonu da başarılı olmalı. Test zamanlamaları veya çevrimdışı yeni navigasyon eksikleri ölçülmeden hız/çevrimdışı garantisi verilmez.
