# DEEN App

DEEN — oyunlaştırılmış İslami öğrenme uygulaması prototipi.

## Current build

- **Version:** v7.7.5
- **Entry point:** `index.html`
- **Base artifact:** `DEEN_v7_7_4_AVATAR_PERSIST_WORLD_STABILITY.html`
- **Runtime patch:** `patches/v7.7.5.js`
- **QA notes:** `qa/v7.7.5_DUNYAM_QA.md`

## v7.7.5 odak

Bu sürüm tamamen **Dünyam** stabilitesine odaklanır:

- Karakter oluşturucuda seçilen özellikler tek bir canonical avatar state'ine kaydedilir.
- Eski avatar renderer'larının yeni saç, sakal, kıyafet, gözlük ve ekstra seçimlerini ezmesi engellenir.
- İlk karakter oluşturma sonrasında oluşan çift/global render döngüsü kaldırılır.
- Dünyam hareketlerinde her dokunuşta tüm sahneyi yeniden render eden ağır akış kaldırılır.
- Çakışan ambient hotspot noktaları devre dışı bırakılır; mobilyalar ve açık kontroller etkileşimli kalır.

GitHub Pages `main` branch `/root` üzerinden yayınlanır. `index.html`, mevcut büyük base HTML'i yükleyip v7.7.5 patch'ini uygulayarak güncel build'i açar. Böylece sonraki Dünyam hotfix'leri büyük HTML'i her seferinde manuel yüklemeden yayınlanabilir.
