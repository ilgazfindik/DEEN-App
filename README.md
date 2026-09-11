# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.7.9
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js` → `patches/v7.7.7.js` → `patches/v7.7.8.js` → `patches/v7.7.9.js`
- **Latest QA:** `qa/v7.7.9_DUNYAM_ASSET_QA.md`

## Current focus — Dünyam

v7.7.5 canonical avatar state ve karakter oluşturma sonrası donma sorunlarını hedefledi.

v7.7.6 oda hareketlerini açık kontrollere taşıdı ve hızlı art arda tıklamalardaki interaction race durumlarını sınırlandırdı.

v7.7.7 oda objelerini gerçek ve stabil etkileşimlere dönüştürdü; canonical avatar snapshot korumasını güçlendirdi.

v7.7.8 görsel hiyerarşi ve oda kompozisyonunu yeniledi.

v7.7.9 oda asset kalitesini yükseltir:

- Masa katmanlı ahşap materyal, çekmece ve kitap detayı aldı.
- Lamba daha sıcak metal/ışık görünümüne ve living-state ile senkron glow'a kavuştu.
- Halı merkez madalyon ve tekstil katmanlarıyla daha oyun asset'i gibi görünür.
- Bitki ek gövde/yapraklar ve daha hacimli bir saksı aldı.
- Kitaplık artık sembol yerine gerçek raf ve kitap sırtları gösterir.
- Pencere iç sahnesi, bölmeleri, ay/ışık detayı ve pencere eşiğiyle derinleştirildi.
- NUR ve koleksiyon hatırası daha kontrollü premium glow/material katmanına sahip.
- v7.7.9 görsel-only patch'tir; avatar, hareket ve obje interaction motorlarını override etmez.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip küçük runtime patch'lerini sırasıyla uygular. Böylece sonraki Dünyam güncellemeleri büyük HTML'i tekrar manuel yüklemeden yayınlanabilir.
