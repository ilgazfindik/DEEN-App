# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.8.8
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js` → `patches/v7.7.7.js` → `patches/v7.7.8.js` → `patches/v7.7.9.js` → `patches/v7.8.0.js` → `patches/v7.8.1.js` → `patches/v7.8.2.js` → `patches/v7.8.3.js` → `patches/v7.8.4.js` → `patches/v7.8.5.js` → `patches/v7.8.6.js` → `patches/v7.8.7.js` → `patches/v7.8.8.js`
- **v7.8.8 runtime assets:** `patches/v7.8.8.runtime.js`, `patches/v7.8.8.css`
- **Latest QA:** `qa/v7.8.8_DUNYAM_DECOR_COLLECTION_QA.md`

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

v7.8.7 satın alma ile odada kullanmayı ayıran kalıcı `equipped` dekor state'ini ekledi.

v7.8.8 dekor koleksiyonunu ve mağazayı genişletir:

- Masa, halı, bitki, kitaplık, pencere ve NUR kategorilerinin her birine **3 yeni dekor** eklenmiştir; toplam **18 yeni kozmetik** vardır.
- Mevcut seviye dekorlarıyla birlikte yeni mağazada **24 satın alınabilir oda dekoru** bulunur.
- Mağaza `Tüm / Masa / Halı / Bitki / Kitaplık / Pencere / NUR` filtreleriyle daha pratik hale getirilmiştir.
- Dekorlar **Common / Rare / Epic** kozmetik nadirlik etiketi taşır.
- Nadirlik herhangi bir ders, enerji, Altın, NUR, dinî içerik veya öğrenme avantajı sağlamaz.
- Yeni dekorlar mevcut Oda Seviyesi progression'ına uygun seviyelerde açılır.
- `Oda Düzeni` içindeki eski kompakt seçici, sahip olunan tüm dekorları kategori bazlı yatay koleksiyon seçicisine dönüştürür.
- Yeni dekorlar mevcut `state.myWorld.equipped` state'ini kullanır; ikinci bir equip sistemi oluşturulmaz.
- Satın alma Altın bakiyesini ve `owned` koleksiyonunu günceller; equip işlemi tek başına bakiye veya NUR değiştirmez.

NUR yalnızca Dünyam kozmetik ilerleme puanıdır; dinî yeterlilik, ibadet veya maneviyat ölçüsü değildir.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip runtime patch'lerini sırasıyla uygular. v7.8.8 küçük patch loader üzerinden kendi CSS/runtime dosyalarını son belgeye ekler.
