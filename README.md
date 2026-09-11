# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.7.6
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js`
- **Latest QA:** `qa/v7.7.6_DUNYAM_QA.md`

## Current focus — Dünyam

v7.7.5 canonical avatar state ve karakter oluşturma sonrası donma sorunlarını hedefledi.

v7.7.6 bunun üzerine oda kullanımını sadeleştirir ve etkileşim yarışlarını engeller:

- Gizli ambient hotspot noktaları kullanılmaz.
- Hareket için dört açık kontrol vardır: **Ortaya Gel / Masaya Git / Pencereye Git / Poz Değiştir**.
- Okuma Köşesi ve Bahçe açıldığında kontrol etiketleri alana göre değişir.
- Hızlı art arda dokunmalar sırasında çakışan hareket/obje animasyonları kilitlenir ve otomatik serbest bırakılır.
- Sayfaya geri dönüldüğünde stale `moving/dragging` sınıfları temizlenir.
- `Düzeni Sıfırla` normal hareket çubuğundan kaldırılıp yalnız düzenleme moduna taşınır.
- v7.7.5'te oluşturulan canonical avatar state değiştirilmez.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip küçük runtime patch'lerini sırasıyla uygular. Böylece sonraki Dünyam güncellemeleri büyük HTML'i tekrar manuel yüklemeden yayınlanabilir.
