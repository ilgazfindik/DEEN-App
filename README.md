# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v8.0.0
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js` → `patches/v7.7.7.js` → `patches/v7.7.8.js` → `patches/v7.7.9.js` → `patches/v7.8.0.js` → `patches/v7.8.1.js` → `patches/v7.8.2.js` → `patches/v7.8.3.js` → `patches/v7.8.4.js` → `patches/v7.8.5.js` → `patches/v7.8.6.js` → `patches/v7.8.7.js` → `patches/v7.8.8.js` → `patches/v7.8.9.js` → `patches/v7.9.0.js` → `patches/v7.9.1.js` → `patches/v7.9.2.js` → `patches/v8.0.0.js`
- **v7.8.8 runtime assets:** `patches/v7.8.8.runtime.js`, `patches/v7.8.8.css`
- **v7.8.9 runtime assets:** `patches/v7.8.9.runtime.js`, `patches/v7.8.9.css`
- **v7.9.0 runtime assets:** `patches/v7.9.0.runtime.js`, `patches/v7.9.0.css`
- **v7.9.1 runtime assets:** `patches/v7.9.1.runtime.js`, `patches/v7.9.1.css`
- **v7.9.2 runtime assets:** `patches/v7.9.2.runtime.js`, `patches/v7.9.2.css`
- **v8.0.0 runtime assets:** `patches/v8.0.0.runtime.js`, `patches/v8.0.0.css`
- **Latest QA:** `qa/v8.0.0_DUNYAM_FINAL_QA.md`

## Current focus — Dünyam

v7.7.5–v7.7.9 canonical avatar stabilitesi, oda etkileşimi, görsel hiyerarşi ve asset polish temelini oluşturdu.

v7.8.0–v7.8.3 Dünyam navigasyonunu sadeleştirdi; doğrudan obje etkileşimi, bağlamsal karakter aksiyonları ve idle life davranışları ekledi.

v7.8.4–v7.8.6 Oda Seviyesi / NUR progression, level-up reveal ve seviyeye göre oda görsel evrimini ekledi.

v7.8.7 satın alma (`owned`) ile odada kullanmayı (`equipped`) ayıran gerçek dekor equip sistemini ekledi.

v7.8.8 mağazayı 24 satın alınabilir oda dekoruna genişletti; kategori filtreleri ve yalnızca kozmetik Common / Rare / Epic nadirlik sistemi ekledi.

v7.8.9 satın alma öncesi oda önizlemesi ekler:

- Mağaza kartlarında `ODADA DENE` / `ÖNİZLE` aksiyonu bulunur.
- Dekor, kullanıcının mevcut odasının etkileşimsiz clone'u üzerinde canlı gösterilir.
- Önizleme sırasında Altın, `owned` ve `equipped` state'i değiştirilmez.
- `Vazgeç` ile mevcut oda hiçbir değişiklik olmadan korunur.
- Sahip olunan dekor preview içinden doğrudan `ODADA KULLAN` ile aktif edilebilir.
- Satın alınabilir dekor preview içinden mevcut güvenli `WORLD.buy()` akışıyla satın alınır; başarılı satın almada gerçek odaya uygulanır.
- Oda Seviyesi kilitli dekorlar önizlenebilir fakat satın alma butonu gerekli seviyeyi göstererek disabled kalır.
- Preview DOM'u ana oda ID'lerini kopyalamaz; clone içindeki ID'ler temizlenir.
- Preview sistemi avatar, NUR veya progression state'ine yazmaz.

v7.9.0 oda kombinasyonlarını preset olarak saklar:

- `Oda Düzeni` içinde **Çalışma / Gece / Doğa** olmak üzere 3 sabit preset slotu bulunur.
- Her preset masa, halı, bitki, kitaplık, pencere ve NUR için mevcut `state.myWorld.equipped` kombinasyonunun anlık görüntüsünü saklar.
- Boş slota `Bu Odayı Kaydet`, kayıtlı slota `Uygula` veya `Güncelle` işlemleri yapılabilir.
- Preset uygulamak Altın, NUR, owned koleksiyonu veya avatar state'ini değiştirmez.
- Uygulama mevcut v7.8.7/v7.8.8 equip sistemi üzerinden görsel state'i yeniler; ikinci bir dekor state'i oluşturmaz.
- Artık sahip olunmayan/geçersiz bir dekor preset içinde kalırsa mevcut oda parçası korunur.
- Oda yeniden render edilse bile preset bölümü tek kopya olarak geri kurulur ve kayıtlar korunur.
- Ana Dünyam ekranına yeni kalıcı kontrol eklenmez; presetler yalnızca Oda Düzeni içinde görünür.

v7.9.1 mağaza ve koleksiyon akışını son polish turuna taşır:

- Mağaza başlığının altına koleksiyon ilerlemesi, Oda Seviyesi ve güncel Altın bakiyesini tek yerde gösteren kompakt özet eklenir.
- `Tümü / Alınabilir / Sahip / Odada` durum filtreleri kategori filtreleriyle birlikte çalışır.
- Kategori chip'leri kendi dekor adetlerini gösterir.
- Her dekor kartı açık `ODADA / SAHİPSİN / ALINABİLİR / KİLİTLİ` durum etiketi taşır.
- Satın alma ve kullanma metinleri standartlaştırılır; `ODADA DENE` önizleme aksiyonu korunur.
- Kartın boş alanına dokunmak da güvenli şekilde mevcut v7.8.9 önizlemesini açar; buton tıklamaları kart önizlemesini yanlışlıkla tetiklemez.
- Durum filtresinde sonuç yoksa sade boş durum mesajı gösterilir.
- Mağaza DOM'u yeniden render edildiğinde polish katmanı tek kopya halinde geri kurulur; observer kendi eklediği node'larla döngü oluşturmaz.
- v7.9.1 satın alma fiyatlarına, NUR'a, preset kayıtlarına, avatar state'ine veya dekor ownership kurallarına yeni ekonomi mantığı eklemez.

v7.9.2 Dünyam ekonomisini ve progression hızını dengeler:

- Günlük 3 görevin toplam ödülü **25 NUR + 18 Altın** olarak standardize edilir: ziyaret `+5/+4`, üç farklı eşya `+8/+6`, bir ders `+12/+8`.
- Oda seviye eşikleri `0 / 25 / 70 / 130 / 205 / 295 / 400 NUR` olarak ayarlanır; üç görevin her gün tamamlandığı senaryoda Lv7 yaklaşık **16 aktif gün** sürer.
- Seviye Altın bonusları `6 / 10 / 15 / 20 / 25 / 30` olarak dengelenir ve her seviye için yalnızca bir kez alınabilir.
- Mevcut kullanıcıların NUR'u, alınmış görevleri, seviye claim'leri, owned/equipped dekorları ve presetleri sıfırlanmaz; yeni denge yalnızca sonraki claim'lerde uygulanır.
- Common / Rare / Epic dekor fiyat aralıkları mevcut katalog için sırasıyla `35–75 / 55–120 / 130–170 Altın` hedef ritmine göre audit edilmiştir; v7.9.2 mevcut satın alma fiyatlarını yeniden yazmaz.
- Progression paneli yeni günlük toplamı, yeni seviye eşiklerini ve fiyat ritmini gösterir.
- v7.9.2 NUR'un yalnızca Dünyam kozmetik ilerleme puanı olduğu kuralını korur.

NUR yalnızca Dünyam kozmetik ilerleme puanıdır; dinî yeterlilik, ibadet veya maneviyat ölçüsü değildir.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip runtime patch'lerini sırayla uygular. v7.8.8, v7.8.9, v7.9.0, v7.9.1 ve v7.9.2 patch loader'ları kendi küçük CSS/runtime dosyalarını son belgeye ekler.

v8.0.0 Dünyam final stabilizasyon turudur:

- Yeni özellik eklemek yerine mevcut Dünyam sistemleri tek stabilite katmanında birleştirilir.
- `equipped`, progression, günlük claim ve preset snapshot state'leri eksik/bozuk anahtarlar için normalize edilir; mevcut kullanıcı değerleri sıfırlanmaz.
- Pageshow, focus ve visibility dönüşlerinde stale hareket/busy sınıfları temizlenir ve idle sisteminin güvenli yeniden planlanması sağlanır.
- Preview, preset, mağaza polish ve shop node'larının yanlışlıkla çoğalmasına karşı duplicate guard eklenir.
- Mağaza sekmesinde oda DOM'u bulunmadığında `ODADA DENE` artık güvenli biçimde geçici olarak oda görünümünü kurup preview açar; preview kapanınca kullanıcı mağazaya geri döner.
- `DEEN_WORLD_FINAL.check()` ile API bütünlüğü, duplicate DOM id, yatay taşma, preview/preset/shop node sayıları ve temel progression özeti denetlenebilir.
- v8.0.0 ekonomi, NUR anlamı, dekor fiyatları, ownership veya dini içerik kurallarını değiştirmez.

Bu sürümle **Dünyam modülünün planlanan ana geliştirme hattı tamamlanmıştır**; sonraki Dünyam değişiklikleri yeni özellik turundan çok bugfix/ürün geri bildirimi odaklı ilerlemelidir.
