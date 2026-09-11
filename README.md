# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.7.7
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patches:** `patches/v7.7.5.js` → `patches/v7.7.6.js` → `patches/v7.7.7.js`
- **Latest QA:** `qa/v7.7.7_DUNYAM_OBJECT_QA.md`

## Current focus — Dünyam

v7.7.5 canonical avatar state ve karakter oluşturma sonrası donma sorunlarını hedefledi.

v7.7.6 oda hareketlerini açık kontrollere taşıdı ve hızlı art arda tıklamalardaki interaction race durumlarını sınırlandırdı.

v7.7.7 oda objelerini daha anlaşılır ve stabil hale getirir:

- Masa, lamba, halı, bitki, kitaplık, NUR ve ünite hatırası erişilebilir etkileşim hedefleri olarak işaretlenir.
- Objeye dokunulduğunda kısa glow ve feedback kartı gösterilir.
- Lamba state'i gerçek aç/kapa durumuna göre görsel ve metinsel olarak senkronize edilir.
- Masa, halı, bitki ve hatıra için hafif kozmetik reaksiyonlar bulunur.
- Her etkileşimde canonical avatar snapshot korunur; legacy renderer saç/sakal/kıyafet gibi seçimleri ezmeye çalışırsa geri yüklenir.
- Watchdog, herhangi bir interaction kilidinin ekranda kalıcı kalmasını engeller.
- Dünyam toolbar ve oda görsel hiyerarşisi daha sade hale getirilmiştir.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, büyük v7.7.4 base HTML'i yükleyip küçük runtime patch'lerini sırasıyla uygular. Böylece sonraki Dünyam güncellemeleri büyük HTML'i tekrar manuel yüklemeden yayınlanabilir.
