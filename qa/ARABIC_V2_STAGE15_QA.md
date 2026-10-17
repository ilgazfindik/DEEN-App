# DEEN Arapça V2 — 15. aşama: mobil, ağ, çevrimdışı ve kalıcı ilerleme

**Durum:** Gerçek Chrome mobil/çevrimdışı açılış testi başarılı; son kapsamlı CI ve yayın doğrulaması sürüyor.

## Otomatik test
`scripts/test-arabic-v2-mobile-lifecycle-chrome.cjs` gerçek, 67 segmentli uygulamayı ayrı Chrome profilinde açar.

- 450 ms geciktirilmiş bir sürüm segmentiyle gerçek yükleme yolunu sınar; süre ölçümü yalnızca test cihazına özgüdür, genel performans SLA değildir.
- 320 ve 375 pikselde Arapça RTL V2 dersinin yatay taşmamasını denetler.
- 600 soruluk soru motorunun açılmasını, ilk yanlışın açıklamasını, yarım bırakılan dersin doğru cevap istatistiği olarak kaydedilmemesini sınar.
- Aynı kullanıcı profilinde yeniden yükleme sonrasında XP, enerji, kalp ve mevcut ders ilerlemesinin korunmasını doğrular.
- Ağ bağlantısını uygulama açıkken keserek yüklü dersin kullanılabildiğini; ardından **yeni çevrimdışı gezinmeyi** ayrı deney olarak sınar.
- İşlenemeyen ses için sahte ses/oynanmış kayıt veya hatalı ilerleme üretmemeli; ilgili ses ve dinleme testleri mevcut CI paketiyle birlikte korunur.

İlgili GitHub Actions iş akışları: `Quran Arabic Words Fast QA` ve `Arabic question bank audit`. CI raporu `deen-qa/arabic-v2-stage15-mobile.json` içinde ölçümleri saklar.

## Çözülen ürün boşluğu — offline başlatma

İlk gerçek testte önbellekli segmentler olmasına rağmen **offline yeni sekme başarısızdı** (`CONTENT_LOAD_FAILED:ar`). Arapça bankanın ihtiyaç duyduğu `assets/i18n/questions.ar.draft.json` dosyası eski loader listesinde yoktu. PR #116'da çözüldü:

- `sw.js?v=9447arabicoffline15` kurulumdan önce 67 segmentin ve tüm gereken JS/CSS assetlerinin SHA-256 hash'lerini doğrular; yanlış/eksik kaynakta install reddedilir.
- 15 Arapça ünite JSON'u, Arapça çalışma verisi, İngilizce temel üniteler, Fransızca runtime JS ve küçük görsel atlaslar uygun byte bütünlüğüyle saklanır.
- Aynı sekmede çevrimdışı ders, **yeni sekmede 600 V2 soruyla tamamen hazır offline boot** ve geri gelen kullanıcıya ait XP/enerji/kalpler başarılı.
- SW, ses kaydı/telif veya 1.500 soruluk bütün başka dil bankaları için otomatik offline garanti vermez. Cache doluluk/kapasite sınırları cihaz bazında değişir.

[39031804178 numaralı hızlı Chrome QA](https://github.com/ilgazfindik/DEEN-App/actions/runs/39031804178): başarılı. İzole localhost denemesinde hazır olma süresi **5657 ms** (450 ms yapay segment gecikmesiyle); bu **genel cihaz performansı SLA'sı değildir**. 320/375px RTL taşma=0, konsol hatası=0. `offline.freshNavigation=true`, `offline.cacheReady.cachedSegments=67`.

Kapsamlı regresyon ve son PR/Pages doğrulaması yayın önkoşuludur.

## Yayın kapısı

Paketler 600/600, beş dilde içerik ve Arapça RTL testleri sağlam; bunun yanında 15. aşamanın son Chrome testi ve geniş uygulama regresyonu da başarılı olmalı. Test zamanlamaları veya çevrimdışı yeni navigasyon eksikleri ölçülmeden hız/çevrimdışı garantisi verilmez.
