# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.8.0
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js` → `patches/v7.7.7.js` → `patches/v7.7.8.js` → `patches/v7.7.9.js` → `patches/v7.8.0.js`
- **Latest QA:** `qa/v7.8.0_DUNYAM_SIMPLIFIED_QA.md`

## Current focus — Dünyam

v7.7.5 canonical avatar state ve karakter oluşturma sonrası donma sorunlarını hedefledi.

v7.7.6 oda hareketlerini açık kontrollere taşıdı ve hızlı art arda tıklamalardaki interaction race durumlarını sınırlandırdı.

v7.7.7 oda objelerini gerçek ve stabil etkileşimlere dönüştürdü; canonical avatar snapshot korumasını güçlendirdi.

v7.7.8 görsel hiyerarşi ve oda kompozisyonunu yeniledi.

v7.7.9 oda asset kalitesini yükseltti.

v7.8.0 Dünyam navigasyonunu sadeleştirir:

- Eski 5 büyük üst sekme kullanıcı arayüzünden kaldırıldı; uyumluluk için DOM'da gizli tutulur.
- Çalışma / Okuma / Bahçe kartları yerine tek bir kompakt alan seçici kullanılır.
- Sürekli görünen 4 hareket butonu kaldırıldı; **Hareket** butonu kısa bir bottom sheet açar.
- Ana odada yalnızca **Hareket** ve **Düzenle** ana aksiyonları görünür.
- **Dünyam Menüsü** Gardırop, Mağaza, Avatar, Koleksiyon, Alanlar ve Oda Düzeni için tek giriş noktasıdır.
- Gardırop ve Mağaza gibi alt sayfalarda **Odaya Dön** kontrolü gösterilir.
- Yürüyüş geçişi, kısa bob animasyonu, poz pop ve masa/pencere varış vurguları eklendi.
- v7.8.0 mevcut canonical avatar, reward, room layout ve object interaction motorlarını değiştirmez.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip küçük runtime patch'lerini sırasıyla uygular. Böylece sonraki Dünyam güncellemeleri büyük HTML'i tekrar manuel yüklemeden yayınlanabilir.
