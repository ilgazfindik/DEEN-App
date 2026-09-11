# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.8.9
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js` → `patches/v7.7.7.js` → `patches/v7.7.8.js` → `patches/v7.7.9.js` → `patches/v7.8.0.js` → `patches/v7.8.1.js` → `patches/v7.8.2.js` → `patches/v7.8.3.js` → `patches/v7.8.4.js` → `patches/v7.8.5.js` → `patches/v7.8.6.js` → `patches/v7.8.7.js` → `patches/v7.8.8.js` → `patches/v7.8.9.js`
- **v7.8.8 runtime assets:** `patches/v7.8.8.runtime.js`, `patches/v7.8.8.css`
- **v7.8.9 runtime assets:** `patches/v7.8.9.runtime.js`, `patches/v7.8.9.css`
- **Latest QA:** `qa/v7.8.9_DUNYAM_TRY_BEFORE_BUY_QA.md`

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

NUR yalnızca Dünyam kozmetik ilerleme puanıdır; dinî yeterlilik, ibadet veya maneviyat ölçüsü değildir.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip runtime patch'lerini sırayla uygular. v7.8.8 ve v7.8.9 patch loader'ları kendi küçük CSS/runtime dosyalarını son belgeye ekler.
