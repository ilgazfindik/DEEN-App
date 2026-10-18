# DEEN — Arapça V2 etkileşimli soru ekranları

**Sürüm adayı:** `9450arabicquizmodes` · **Durum:** QA tamamlanmadan merge/deploy yapılmaz.

## Üç gerçek cevap türü

- **A–B–C–D çoktan seçmeli:** Kalan tüm mevcut V2 soru türleri. Dört seçenek 2×2 sıkışık 53px kutular yerine tam genişlikte, harf etiketi ve metin ayrı bölümlerle gelir. Elif/Be/Te gibi adlar ortadan kırılmaz; küçük ekran ve ekran okuyucu desteği vardır.
- **Eşleştirme:** Mevcut `letter-glyph-to-name` havuzundan belirlenmiş soruların yaklaşık dörtte biri; dört gerçek harfin Arapça şekli ve dört doğru adının tümünü eşleştirir. Rastgele uydurulmuş cevap/ayet yoktur. Kalan harf-adı soruları A–B–C–D kalır. Eşleştirmede yanlış denemeler açıkça işaretlenir, doğru dört çift bitmeden soru geçilmez.
- **Birleştirme:** `joining-two-letters` becerisinin **22 mevcut** sorusu. İki harfi Arapça okuma sırasıyla bankadan seçer, kontrol eder, yanlışsa yeniden dener; doğruysa soru bankasındaki gerçek birleşik yazım sonucu gösterilir. Harf parçaları ve dikkat dağıtıcılar mevcut harf müfredatından gelir.

## Korunanlar

Soru havuzunun 600 özgün ID'si, doğru cevap indeksleri, 5 dilde soru/açıklama/yanlış gerekçeleri, mini öğretici, kalp/XP, doğru seri, tekrar planı, sure/ayet Arapça metni değişmez. Değişen yalnızca görsel etkileşim ve tek soru içindeki doğrulama sürecidir. Yanlış eşleştirme veya sıralama ilk deneme hatası olarak kaydedilir; sonraki doğru deneme ilk deneme olarak sayılmaz.

## Test planı

- A, B, C, D seçenekleri dört ayrı, dikey satır; mobil 320px yatay kayma ve kesilmiş etiket yok.
- Gerçek Chrome'da ilk ders 10 soruda üç sunum modu: A–D seçmeli / 4 çift eşleştirme / 2 harf birleştirme.
- Yanlış cevaptan sonraki tekrar, aynı soru, doğru/yanlış sayımı ve ders tamamlanma korunur.
- TR/EN/AR/DE/FR; Arapça hedefin RTL kalması; onaysız sesin asla üretilmemesi.
- GitHub Actions hızlı+kapsamlı QA, SHA-256 imza kontrolü, `main` merge ve Pages yayın doğrulaması.
