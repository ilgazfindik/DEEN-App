# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.8.2
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js` → `patches/v7.7.7.js` → `patches/v7.7.8.js` → `patches/v7.7.9.js` → `patches/v7.8.0.js` → `patches/v7.8.1.js` → `patches/v7.8.2.js`
- **Latest QA:** `qa/v7.8.2_DUNYAM_CONTEXT_ACTIONS_QA.md`

## Current focus — Dünyam

v7.7.5 canonical avatar state ve karakter oluşturma sonrası donma sorunlarını hedefledi.

v7.7.6 oda hareketlerini açık kontrollere taşıdı ve hızlı art arda tıklamalardaki interaction race durumlarını sınırlandırdı.

v7.7.7 oda objelerini gerçek ve stabil etkileşimlere dönüştürdü; canonical avatar snapshot korumasını güçlendirdi.

v7.7.8 görsel hiyerarşi ve oda kompozisyonunu yeniledi.

v7.7.9 oda asset kalitesini yükseltti.

v7.8.0 Dünyam navigasyonunu sadeleştirdi: büyük üst sekmeler, üç alan kartı ve sürekli hareket kontrolleri ana ekrandan kaldırıldı; bunların yerine kompakt alan seçici ve tek Dünyam Menüsü getirildi.

v7.8.1 odanın kendisini ana kontrol yüzeyine dönüştürdü: ana Hareket butonu kaldırıldı, objeler ve pencere doğrudan dokunulabilir hale geldi.

v7.8.2 bu doğrudan etkileşimleri kısa karakter aksiyonlarına dönüştürür:

- Masa: karakter çalışma/düşünme hareketi yapar.
- Lamba: ışığı ayarlama tepkisi oynar.
- Halı: karakter kısa mola/oturma hareketi yapar.
- Bitki: eğilip bitkiyle ilgilenir; yapraklar tepki verir.
- Kitaplık: karakter kitaba uzanır / kitap seçer.
- NUR: kısa yükselme ve glow tepkisi gösterir.
- Hatıra: karakter objeyi inceleme tepkisi verir.
- Pencere: karakter daha uzun bir dışarı bakma pozu yapar.
- Aksiyonlar tekil ve geçicidir; yeni aksiyon, düzenleme modu veya ekran değişimi eski aksiyonu temizler.
- Aksiyon bitince canonical avatar görünümü ve mevcut dünya pozu geri yüklenir.
- Reduced-motion tercihi desteklenir.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip küçük runtime patch'lerini sırasıyla uygular. Böylece sonraki Dünyam güncellemeleri büyük HTML'i tekrar manuel yüklemeden yayınlanabilir.
