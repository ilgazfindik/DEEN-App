# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.8.7
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js` → `patches/v7.7.7.js` → `patches/v7.7.8.js` → `patches/v7.7.9.js` → `patches/v7.8.0.js` → `patches/v7.8.1.js` → `patches/v7.8.2.js` → `patches/v7.8.3.js` → `patches/v7.8.4.js` → `patches/v7.8.5.js` → `patches/v7.8.6.js` → `patches/v7.8.7.js`
- **Latest QA:** `qa/v7.8.7_DUNYAM_ROOM_PERSONALIZATION_QA.md`

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

v7.8.4 sade progression loop ekledi: Oda Seviyesi, NUR, günlük 3 görev, tek seferlik seviye Altın ödülleri ve seviye bazlı dekor kilitleri.

v7.8.5 seviye atlama anını premium level-up overlay, dekor reveal ve mağaza yönlendirmesiyle görünür hale getirdi.

v7.8.6 oda seviyesini görsel evrime bağladı: duvar, zemin, ışık, pencere atmosferi ve NUR glow seviyeyle birlikte gelişir.

v7.8.7 oda kişiselleştirmesini gerçek equip sistemine dönüştürür:

- `Oda Düzeni` modunda kompakt **Dekor Stili** seçicisi gösterilir.
- Sahip olunan masa, halı, bitki, kitaplık, pencere ve NUR varyantları tek dokunuşla aktif edilir.
- Satın alma (`owned`) ile odada kullanma (`equipped`) artık ayrı state'lerdir.
- Masa için Standart / Kum Çalışma Masası, halı için Teal / Gün Doğumu, pencere için Standart / Gece, NUR için Standart / Yıldız Işığı seçimleri desteklenir.
- Bitki ve kitaplık istenirse tamamen kaldırılabilir ve daha sonra tekrar yerleştirilebilir.
- Seçim anında odada uygulanır, otomatik kaydolur ve küçük equip feedback animasyonu oynar.
- `Mağaza` kısayolu Oda Düzeni içinden erişilebilir; ana Dünyam ekranına yeni kalıcı buton eklenmez.
- Equip işlemleri avatar state'ine, NUR miktarına veya Altın bakiyesine dokunmaz.

NUR yalnızca Dünyam kozmetik ilerleme puanıdır; dinî yeterlilik, ibadet veya maneviyat ölçüsü değildir.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip küçük runtime patch'lerini sırasıyla uygular. Böylece sonraki Dünyam güncellemeleri büyük HTML'i tekrar manuel yüklemeden yayınlanabilir.
