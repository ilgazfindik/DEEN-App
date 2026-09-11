# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.7.8
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js` → `patches/v7.7.7.js` → `patches/v7.7.8.js`
- **Latest QA:** `qa/v7.7.8_DUNYAM_VISUAL_QA.md`

## Current focus — Dünyam

v7.7.5 canonical avatar state ve karakter oluşturma sonrası donma sorunlarını hedefledi.

v7.7.6 oda hareketlerini açık kontrollere taşıdı ve hızlı art arda tıklamalardaki interaction race durumlarını sınırlandırdı.

v7.7.7 oda objelerini gerçek ve stabil etkileşimlere dönüştürdü; canonical avatar snapshot korumasını güçlendirdi.

v7.7.8 görsel hiyerarşi ve oda kompozisyonunu yeniler:

- Başlık **Benim Köşem** olarak sadeleştirildi.
- Dünyam / Gardırop / Mağaza / Avatar / Koleksiyon navigasyonu tek düzenli segmented bar haline getirildi.
- Çalışma Köşesi / Okuma Köşesi / Bahçe seçimleri üç eşit alan kartına dönüştürüldü.
- Oda sahnesinin duvar, zemin ve pencere derinliği güçlendirildi.
- Karakter odanın ana odak noktası olacak şekilde büyütüldü ve gölge/katman dengesi düzeltildi.
- Hareket kontrolleri aynı işlevi korurken daha dengeli tap-target ve görsel hiyerarşiye kavuştu.
- Tekrarlayan yardım metinleri azaltıldı; oda daha temiz hale getirildi.
- v7.7.8 hareket veya obje motorunu yeniden yazmaz; v7.7.5–v7.7.7 stabilite katmanlarını aynen korur.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip küçük runtime patch'lerini sırasıyla uygular. Böylece sonraki Dünyam güncellemeleri büyük HTML'i tekrar manuel yüklemeden yayınlanabilir.
