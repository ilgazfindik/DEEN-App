# DEEN Kur’an Arapçası — sesli ders yayın kapısı (aşama 6)

## Şu anki gerçek durum

* **0/6 ses onaylı.** Dinleme dersleri 17–18 müfredat olarak tanımlanmıştır; **dinlenebilir / tamamlanabilir değildir.**
* Önceki 16 ücretsiz ders, geçmiş ilerleme kayıtları ve mevcut sure öğrenme yolu değişmez.
* `assets/quran/audio/ayah-audio-manifest.json` içindeki ayet MP3’leri otomatik olarak harf, hece veya izole kelime telaffuz kaynağı değildir. `fr-rights-evidence.staging.json` içindeki hak ve kıraat onayları beklemededir.
* Üretilmiş TTS, tarayıcı `speechSynthesis`, sahte ses veya yer tutucu dosya oynatılmaz.

## Üretime ses ekleme kontrol listesi

1. Altı ayrı hedef için onaylı telaffuz kaydı oluşturun: `بَ`, `بِ`, `بُ`, `قُلْ`, `هُوَ`, `لَمْ`. Uzunluk, mahreç ve hareke telaffuzunu eğitim uzmanı dinleyerek değerlendirmeli.
2. Kayıt sahibini/kıraati ve mobil uygulama kullanım hakkını yazılı delille doğrulayın. Dağıtım, abonelik/reklam içeren uygulama ve uygun pazarlar kapsamı net olsun.
3. Tam ses dosyalarını `assets/quran/audio/arabic-learning/` altına `.mp3` olarak ekleyin. Kur’an’daki kelimeleri bağlamından keserek yeni bir kıraat izlenimi vermeyin.
4. Her dosya için SHA-256 hesaplayın; örneğin `sha256sum assets/quran/audio/arabic-learning/word-qul.mp3`.
5. `assets/i18n/quran-arabic-listening.js` içindeki **yalnızca** ilgili `records` kaydını `state:'approved'`, `file`, `sha256`, `reciter`, **`auditedText` (onaylanan Arapça yazılış ile birebir eşleşmeli)**, `rights:{state:'approved',evidence:'...'}` ve `pronunciation:{state:'approved',reviewRef:'...'}` alanlarıyla doldurun. Diğer altı kayda varsayılan onay uygulamayın.
6. `node scripts/build-release-manifest.mjs` çalıştırın; sonrasında audit ve Chromium testlerini geçmeden `main` ile birleştirmeyin.

## Zorunlu kapılar

- Hak izni, uzman telaffuz değerlendirmesi, aynı-origin ses yolu, geçerli SHA-256 ve tüm ders klipleri onayı olmadan ilgili ders açılamaz.
- Ses bir kullanıcı tıklaması üzerine yüklenir; ses verisi SHA-256 ile doğrulanır, yalnızca sesin **tamamı başarıyla çalındıktan sonra** seçenekler açılır.
- Ağ hatası, çözümlenemeyen MP3, hash tutarsızlığı veya oynatma engeli durumunda ilerleme yazılmaz.
- Daha eski yerel kayıtlar `deen_arabic_foundations_v2`, `deen_arabic_harakat_v1`, `deen_arabic_reading_v1` ve `deen_arabic_words_v1` olarak korunur. Yeni dinleme tamamlanması `deen_arabic_listening_v1` anahtarında ayrı tutulur.

**Sınır:** Bu altyapı bir ses lisansı veya telaffuz incelemesi yerine geçmez. Kayıtlar onaylanmadan `0/6` göstermek bilinçli ürün davranışıdır.
