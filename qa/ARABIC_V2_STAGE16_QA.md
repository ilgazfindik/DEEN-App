# DEEN Arapça V2 — 16. aşama: son kapsam ve yayın kapısı

**Durum (2026-10-17):** [PR #117](https://github.com/ilgazfindik/DEEN-App/pull/117) aday. Otomatik kapsam kapısı kodlandı. Yeşil son PR CI + GitHub Pages dağıtımı doğrulanmadan **tamamlandı/yayında** denemez.

## Gerçek kapsam

- **27 mini ders:** 7 harf + 3 hareke + 3 okuma + 3 kelime + 2 bağımsız dinleme + 3 anlam + 3 ifade + 3 kalıp.
- **27 öğretici × 5 dil:** Her dersin gerçek oynanışta kullanılan `lessonTips` anahtarı ile veri kaynağı eşleşir. Beş dil: Türkçe, İngilizce, Arapça, Almanca, Fransızca. 135 ayrı yerel öğretici girişi kontrol edilir.
- **25 yazılı V2 havuzu:** Dinleme dersleri 17–18, yeterli bağımsız ve onaylı ses kaydı gelmediği için eksik sesle açılmış gibi gösterilmez.
- **600 benzersiz soru:** A–F paketlerinde 100’er, tamamı gerçek V2 `poolFor` ve `get` API üzerinden ulaşılabilir.
- **8/10/12 soruluk örnek oturumlar:** Her canlı havuzda deterministik oturum seçimi ve oturum içinde tekrar etmeme koşulları.
- **Cevap/lokalizasyon:** Tek doğru seçenek, diğer seçeneklerin beş dilde hata açıklamaları, soru yönergeleri ve doğru cevap açıklamaları.

## Yayına giden doğrulama

1. `node scripts/audit-arabic-v2-release-gate.cjs`: yeni deterministik kapsam kontrolü.
2. `Arabic question bank audit`: tam içerik + sürüm imzası + gerçek Chrome regresyonu. `deen-qa/arabic-v2-stage16-gate.json` çıktısı.
3. `Quran Arabic Words Fast QA`: yeni kapıyla beraber oyun/ses/RTL/yeniden açılış regresyonları.
4. PR merge sonrasında **aynı main commit** için GitHub Pages deployment success kaydı, hızlı QA ve kapsamlı CI yeniden doğrulanır.

## Sınırlar ve blokajlar

- Dinleme oyunları 17–18 için özgün bağımsız ses kayıtları yok. Toplam **15 kayıtlı harf sesi** mevcut, 13 harfin kaydı eksik.
- 14. aşamada işaretlenen **448 dinî/fonetik/ses insan inceleme kaydı** uzman onayı değildir. Otomatik yapı kontrollerinin geçmesi bu maddeleri dinî olarak sertifikalamaz.
- Çevrimdışı kullanım yalnız tanımlanmış Arapça V2 cache kapsamı için Chrome'da sınanır; tüm sesler, tüm dillerin 1.500 sorusu ve cihazların sonsuz cache kapasitesi garanti edilmez.
- 600 soru hedefi tamamlandığında dersler orta düzey **harekeli okuma ve kısa ifade çözümleme** için hazırlanır; genel Arapça B1 veya tecvid yeterliliği iddiası yoktur.

**Kaynaklar:** [15. aşama PR #116](https://github.com/ilgazfindik/DEEN-App/pull/116), [15. aşama Pages](https://github.com/ilgazfindik/DEEN-App/actions/runs/39036846642), [16. aşama PR #117](https://github.com/ilgazfindik/DEEN-App/pull/117).
