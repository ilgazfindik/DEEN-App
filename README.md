# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.8.6
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js` → `patches/v7.7.7.js` → `patches/v7.7.8.js` → `patches/v7.7.9.js` → `patches/v7.8.0.js` → `patches/v7.8.1.js` → `patches/v7.8.2.js` → `patches/v7.8.3.js` → `patches/v7.8.4.js` → `patches/v7.8.5.js` → `patches/v7.8.6.js`
- **Latest QA:** `qa/v7.8.6_DUNYAM_ROOM_EVOLUTION_QA.md`

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

v7.8.6 oda seviyesini doğrudan görsel evrime bağlar:

- Lv1 oda temel ve sade görünür.
- Lv2 duvar çerçevesi / küçük mimari detay kazanır.
- Lv3 duvar hattı ve katman hissi eklenir.
- Lv4 zemin inlay detayı ile oda daha tamamlanmış görünür.
- Lv5 odak/çalışma bölgesinde kontrollü ambient ışık artar.
- Lv6 pencere/gece atmosferi, küçük yıldız detayları ve çevresel derinlik gelişir.
- Lv7 NUR ve tavan çevresinde premium ambient glow kullanılır.
- Çalışma, Okuma ve Bahçe alanlarında detayların tonu mevcut alan temasına uyarlanır.
- Görsel evrim yeni buton eklemez; mevcut sade Dünyam navigasyonu korunur.
- Oda seviyesi mevcut v7.8.4 progression state'inden okunur; v7.8.6 ödül, satın alma, görev veya avatar state'ini değiştirmez.
- Reduced-motion tercihinde seviye geçiş animasyonu devre dışıdır.

NUR yalnızca Dünyam kozmetik ilerleme puanıdır; dinî yeterlilik, ibadet veya maneviyat ölçüsü değildir.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip küçük runtime patch'lerini sırasıyla uygular. Böylece sonraki Dünyam güncellemeleri büyük HTML'i tekrar manuel yüklemeden yayınlanabilir.
