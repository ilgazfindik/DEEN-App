# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.8.4
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js` → `patches/v7.7.7.js` → `patches/v7.7.8.js` → `patches/v7.7.9.js` → `patches/v7.8.0.js` → `patches/v7.8.1.js` → `patches/v7.8.2.js` → `patches/v7.8.3.js` → `patches/v7.8.4.js`
- **Latest QA:** `qa/v7.8.4_DUNYAM_PROGRESSION_QA.md`

## Current focus — Dünyam

v7.7.5 canonical avatar state ve karakter oluşturma sonrası donma sorunlarını hedefledi.

v7.7.6 oda hareketlerini açık kontrollere taşıdı ve hızlı art arda tıklamalardaki interaction race durumlarını sınırlandırdı.

v7.7.7 oda objelerini gerçek ve stabil etkileşimlere dönüştürdü; canonical avatar snapshot korumasını güçlendirdi.

v7.7.8 görsel hiyerarşi ve oda kompozisyonunu yeniledi.

v7.7.9 oda asset kalitesini yükseltti.

v7.8.0 Dünyam navigasyonunu sadeleştirdi.

v7.8.1 odanın kendisini ana kontrol yüzeyine dönüştürdü.

v7.8.2 doğrudan etkileşimleri kısa bağlamsal karakter aksiyonlarına dönüştürdü.

v7.8.3 karaktere boşta yaşayan ambient davranışlar ekledi.

v7.8.4 Dünyam'a sade bir progression loop ekler:

- Ana oda ekranında yalnızca kompakt **Oda Seviyesi / NUR / günlük görev** şeridi görünür; ekran yeniden kalabalıklaştırılmaz.
- Günlük 3 görev: Dünyam'a uğra, 3 farklı eşyayla etkileş, 1 ders tamamla.
- Günlük görevlerin toplam ödülü **30 NUR + 10 Altın**dır.
- NUR yalnızca Dünyam kozmetik seviye puanıdır.
- Oda seviyeleri yeni dekorların mağazada satın alınabilir hale gelmesini sağlar.
- Seviye 2–7 arasında Zeytin Saksısı, Meşe Kitaplık, Gün Doğumu Halısı, Kum Çalışma Masası, Gece Penceresi ve NUR · Yıldız Işığı sırayla açılır.
- Her yeni seviyede bir defalık Altın bonusu vardır; aynı bonus ikinci kez alınamaz.
- Günlük görev ödülleri de idempotenttir; aynı ödül aynı gün ikinci kez alınamaz.
- Daha önce sahip olunan dekorlar kilitlenmez.
- Mevcut Dünyam kullanıcılarına sahip olunan dekor/alanlara göre sınırlı tek seferlik NUR migration seed uygulanır.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip küçük runtime patch'lerini sırasıyla uygular. Böylece sonraki Dünyam güncellemeleri büyük HTML'i tekrar manuel yüklemeden yayınlanabilir.
