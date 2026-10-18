# DEEN Arapça V2 — 20. aşama: Yazılı beceri ön test / son test

**Durum:** **Yayında ve doğrulandı.** [PR #120](https://github.com/ilgazfindik/DEEN-App/pull/120) squash merge `cbba42cd83157589ff9a3d2316488e3a202db4fa`. Son PR hızlı Chrome [#39147789693](https://github.com/ilgazfindik/DEEN-App/actions/runs/39147789693), kapsamlı Chrome [#39147787120](https://github.com/ilgazfindik/DEEN-App/actions/runs/39147787120), merge sonrası Pages [#39148612567](https://github.com/ilgazfindik/DEEN-App/actions/runs/39148612567) başarılı.

## Ürün kapsamı

- Arapça öğrenme ana ekranına **Arapça Öğrenme Ölçümü** kartı eklendi.
- İki ayrı 8 soruluk değerlendirme: **ön test** ve **son test**. Dört yazılı beceri grubunun her birinden ikişer soru alınır: harf, hareke, kelime, kısa ifade.
- Sorular yeni yazılmadı. Canlı 600 soruluk V2 havuzundaki 8 farklı kaynak dersten, seviyeleri eşleşen fakat iki testte **aynı soru ID'si kullanılmayan** çiftler seçilir.
- Türkçe, İngilizce, Arapça, Almanca, Fransızca yönergeleri kaynak sorulardan gelir. Puan ve arayüz metinleri beş dilde işlendi; Arapça hedef metin korunur.
- Son test yalnızca **ön testten sonra en az bir yazılı ders tamamlandığında** veya **24 saat geçtiğinde** açılır. Aynı oturumda arka arkaya iki test açılıp sahte gelişim iddiası yapılmaz.
- Sonuçlar toplam 8 sorudan doğru sayısı, dört beceriden 2'şer doğru ve **son test - ön test puan farkı** olarak gösterilir. Farkın pozitif olması tek başına öğrenmenin nedeninin uygulama olduğunu kanıtlamaz.
- Testte doğru cevap geri bildirimi gösterilmez; sonuçlar bütün sorular bitince görünür. Test sırasında ses dosyası çalınmaz ve Arapça konuşma/kıraat becerisi ölçüldüğü iddia edilmez.

## Veri bütünlüğü

Yalnız yeni `deen_arabic_v2_assessment_v1` yerel anahtarına `{schema,pre,post}` yazılır. Cevaplar V2 motorundaki soru ve seçenek kimlikleri ile tekrar doğrulanır. Kaynak sorular değişirse saklanan cevap sözleşmesi artık geçerli değilse okunmaz.

Aşağıdaki eski kayıtlar değişmez:

- XP, can/kalp, enerji, para, premium, seri
- `deen_arabic_foundations_v2` ve diğer yazılı ders tamamlama anahtarları
- `deen_arabic_v2_spaced_v1` V2 tekrar programı
- Kur'an sure/ayet öğrenme kayıtları

İçerik/dil ve soru bankası dosyaları değişirken `index.html` SHA-256 varlık imzaları ve çevrimdışı `BUILD` güncellendi: `9448arabicprepost20`.

## Test beklentileri

- `node scripts/test-arabic-v2-prepost.cjs`: 8/8 gerçek havuz ve 8/8 farklı post ID'si, aynı ders/difficulty, beş dil, doğru/yanlış puan, kayıt bütünlüğü, son test kilidi ve ödül bağımsızlığı.
- `node scripts/test-arabic-v2-prepost-chrome.cjs`: gerçek tarayıcıda oyun kartı, 8+8 soru, TR/EN/AR/DE/FR, RTL/320px, yalnız yerel ayrı kayıt, yeniden açılınca sonuç, XP/kalp/ilerleme korunması.
- Önce hızlı ve kapsamlı CI, sonra merge, `main` ve GitHub Pages doğrulaması.

**Sınır:** Kullanıcının okuduğu ses veya tecvid puanlanmaz. Dinleme derslerinin eksik altı özgün klibi ve insan onayı bekleyen 448 içerik değerlendirmesi bağımsız iş olarak kalır.
