# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.9.1
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js` → `patches/v7.7.7.js` → `patches/v7.7.8.js` → `patches/v7.7.9.js` → `patches/v7.8.0.js` → `patches/v7.8.1.js` → `patches/v7.8.2.js` → `patches/v7.8.3.js` → `patches/v7.8.4.js` → `patches/v7.8.5.js` → `patches/v7.8.6.js` → `patches/v7.8.7.js` → `patches/v7.8.8.js` → `patches/v7.8.9.js` → `patches/v7.9.0.js` → `patches/v7.9.1.js`
- **v7.8.8 runtime assets:** `patches/v7.8.8.runtime.js`, `patches/v7.8.8.css`
- **v7.8.9 runtime assets:** `patches/v7.8.9.runtime.js`, `patches/v7.8.9.css`
- **v7.9.0 runtime assets:** `patches/v7.9.0.runtime.js`, `patches/v7.9.0.css`
- **v7.9.1 runtime assets:** `patches/v7.9.1.runtime.js`, `patches/v7.9.1.css`
- **Latest QA:** `qa/v7.9.1_DUNYAM_SHOP_COLLECTION_POLISH_QA.md`

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

NUR yalnızca Dünyam kozmetik ilerleme puanıdır; dinî yeterlilik, ibadet veya maneviyat ölçüsü değildir.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip runtime patch'lerini sırayla uygular. v7.8.8, v7.8.9, v7.9.0 ve v7.9.1 patch loader'ları kendi küçük CSS/runtime dosyalarını son belgeye ekler.
