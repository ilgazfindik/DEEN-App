# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.8.5
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js` → `patches/v7.7.7.js` → `patches/v7.7.8.js` → `patches/v7.7.9.js` → `patches/v7.8.0.js` → `patches/v7.8.1.js` → `patches/v7.8.2.js` → `patches/v7.8.3.js` → `patches/v7.8.4.js` → `patches/v7.8.5.js`
- **Latest QA:** `qa/v7.8.5_DUNYAM_LEVELUP_QA.md`

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

v7.8.5 seviye atlama anını görünür ve ödüllendirici hale getirir:

- Yeni oda seviyesinde tek seferlik premium level-up overlay gösterilir.
- Açılan dekor gerçek ürün adıyla reveal kartında gösterilir.
- Odadaki ilgili mevcut obje kısa glow/reveal efekti alır.
- Yeni dekor otomatik satın alınmaz; yalnızca mağazada satın alınabilir hale geldiği açıkça belirtilir.
- `Mağazada Gör` düğmesi kullanıcıyı doğrudan Dünyam mağazasına götürür.
- Aynı seviye için kutlama ikinci kez gösterilmez; görülen seviyeler progression celebration state'inde tutulur.
- Önceki sürümlerden gelen mevcut seviyeler ilk açılışta görülmüş sayılır; migration sonrası yanlış/stale kutlama çıkmaz.
- Reduced-motion tercihinde confetti ve ağır hareketler devre dışı kalır.

NUR yalnızca Dünyam kozmetik ilerleme puanıdır; dinî yeterlilik, ibadet veya maneviyat ölçüsü değildir.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip küçük runtime patch'lerini sırasıyla uygular. Böylece sonraki Dünyam güncellemeleri büyük HTML'i tekrar manuel yüklemeden yayınlanabilir.
