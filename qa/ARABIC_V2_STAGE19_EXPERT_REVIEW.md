# DEEN Arapça V2 — 19. aşama uzman inceleme devri

**Durum:** Uzmanlar için çıkarılabilir otomatik inceleme kuyruğu hazırlanıyor. **Hiçbir dinî/fonetik/ses içeriği otomatik olarak onaylanmaz.**

## Kaynak ve çıktı

Kaynak: `scripts/audit-arabic-v2-locale-content.cjs` dosyasının **448 insan inceleme işareti**. Aynı soru birden çok nedenle incelenebileceği için **448 ayrı soru** anlamına gelmez. Her işaret için soru kimliği ve değerlendirme nedeni birleşimi bir inceleme görevi oluşturur.

`node scripts/test-arabic-v2-human-review.cjs` — kapsam, tutarlılık ve güvenli CSV kontrolleri.

`node scripts/export-arabic-v2-human-review.cjs --out-dir=qa/review-output` — geçici yerel çıktı üretir. GitHub Actions bu raporu koşu artefaktı olarak saklar; eğitim içeriğini veya kayıtları değiştirmez.

Çıktı klasörü:

- `review-summary.json`: neden kategorileri, sayılar ve açık inceleme durumu
- `review-queue.json`: bütün kaynak bağlamlarıyla 448 kayıt
- `quran-meaning-grammar.csv`: Kur'an kelimesi/anlam/gramer bağlamı
- `phonetics-and-harakat.csv`: hareke, harf, işaret, okuma bilgisi
- `audio-rights-pronunciation.csv`: ses kullanım izni ve telaffuz

Her satır: `reviewId`, `questionId`, `stage`, `skill`, `reason`, `source`, `target`, `correctAnswerGlyph`, `contentSha256`, TR/EN/AR/DE/FR soru ve açıklama, `decision`, `reviewer`, `evidenceRef`, `reviewedAt`, `reviewNotes`. JSON'da yanlış seçenekler ve gerekçeleri de bulunur.

## İncelemeciye talimat

1. Kaynak ayeti ve harekeleri özgün Kur'an metniyle karşılaştırın; otomatik metin eşleşmesi dinî anlam onayı değildir.
2. Her `reviewId` için karar verin: `approved`, `needs-correction` veya `rejected`. Gerekçe, kanıt ve incelemeci referansı olmadan `approved` saymayın.
3. Fonetik ve kıraat incelemesini dinî anlam/gramer denetiminden ayrı ele alın; gerçek ses yoksa ses kaydını onaylamayın.
4. İncelemeden sonra kaynağa düzeltme açılması gerekiyorsa PR içinde sorunun `contentSha256` değerini yeniden karşılaştırın. İçerik değişmişse eski onayı geçersiz sayın.
5. Bu CSV dosyalarının doldurulması otomatik olarak uygulama içeriğini güncellemez. Onayların doğrulanması için ayrı kontrollü entegrasyon geliştirilmelidir.

## Yayın güvenliği

- Otomatik testten geçen 600/600 V2 soru kendi başına Kur'an/tecvid uzmanı tarafından doğrulanmış sayılmaz.
- Ses yokken 17 ve 18. derslerin kilitleri kaldırılmaz.
- Veriler test/CI çıktısıdır; kullanıcının kişisel öğrenme geçmişi veya kimlik bilgileri bu dışa aktarmaya dahil değildir.
- Bekleyen 448 inceleme görevinin **onay sayısı sıfırdır**.
