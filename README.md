# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.8.1
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js` → `patches/v7.7.7.js` → `patches/v7.7.8.js` → `patches/v7.7.9.js` → `patches/v7.8.0.js` → `patches/v7.8.1.js`
- **Latest QA:** `qa/v7.8.1_DUNYAM_DIRECT_OBJECT_QA.md`

## Current focus — Dünyam

v7.7.5 canonical avatar state ve karakter oluşturma sonrası donma sorunlarını hedefledi.

v7.7.6 oda hareketlerini açık kontrollere taşıdı ve hızlı art arda tıklamalardaki interaction race durumlarını sınırlandırdı.

v7.7.7 oda objelerini gerçek ve stabil etkileşimlere dönüştürdü; canonical avatar snapshot korumasını güçlendirdi.

v7.7.8 görsel hiyerarşi ve oda kompozisyonunu yeniledi.

v7.7.9 oda asset kalitesini yükseltti.

v7.8.0 Dünyam navigasyonunu sadeleştirdi: büyük üst sekmeler, üç alan kartı ve sürekli hareket kontrolleri ana ekrandan kaldırıldı; bunların yerine kompakt alan seçici ve tek Dünyam Menüsü getirildi.

v7.8.1 odanın kendisini ana kontrol yüzeyine dönüştürür:

- Ana ekrandaki sürekli **HAREKET** butonu kaldırıldı.
- Kalıcı ana aksiyon olarak yalnızca **ODA DÜZENİ** bırakıldı.
- Masa, halı, lamba, bitki, kitaplık, NUR ve hatıra doğrudan dokunulabilir etkileşim hedefleridir.
- Objeye dokununca mevcut Living World motoru karakteri objenin yanına yürütür ve ilgili tepkiyi oynatır.
- Pencere ayrı erişilebilir dokunma alanına sahiptir; dokununca karakter pencereye gider.
- Manuel **Hareket** seçeneği yedek kontrol olarak `Dünyam Menüsü` içine taşındı.
- İlk kullanımda kısa `Eşyalara dokun` ipucu gösterilir ve ilk etkileşimden sonra kaybolur.
- Direct interaction katmanı avatar canonical state veya reward sistemlerini değiştirmez.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip küçük runtime patch'lerini sırasıyla uygular. Böylece sonraki Dünyam güncellemeleri büyük HTML'i tekrar manuel yüklemeden yayınlanabilir.
