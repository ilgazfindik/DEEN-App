# DEEN Arapça Öğren V2 — Aşama 14: Beş Dil, Arapça Yazım ve İçerik Güvencesi

**Durum:** Otomatik 600 soru / 5 dil QA başarılı. Son geniş Chrome/CI ve PR entegrasyonu doğrulaması sürüyor. **Dinî, fonetik veya kıraat uzmanı onayı verilmedi.**

## Kapsam ve kanıt

- 6 V2 paket × 100 soru = **600/600** gerçek ürün sorusu. 25 oynanabilir V2 havuz, 27 öğretici ders (iki dinleme dersi veri eksikliği nedeniyle kasten kilitli).
- TR, EN, AR, DE, FR: soru, doğru seçenek, yanlış seçenek gerekçesi, açıklama ve varsa seçenek etiketi.
- Soru ID benzersizliği, cevap anahtarı tekliği, 3–4 seçenek, mükerrer içerik, ses referansı onayı, kaynak ayet referansı.
- Unicode bidi override/isolate, kaynak metinde yürütülebilir HTML, boş alan, belirgin sahte çeviri, 320px RTL ve gerçek Chrome müfredat regresyonu.
- Kaynak Arapça metnin/Uthmanî yazımın **otomatik NFC normalizasyonuyla değiştirilmemesi**; fonetik işaretlerin denetim amaçlı tutulması.

Çalıştırılabilir kaynak: `scripts/audit-arabic-v2-locale-content.cjs`.

Yapısal Node QA sonuçları (düzeltilmiş hızlı QA [39030322237](https://github.com/ilgazfindik/DEEN-App/actions/runs/39030322237)):

| Ölçüm | İlk sonuç |
|---|---:|
| Soru / paket / V2 ders | 600 / 6 / 25 |
| TR / EN / AR / DE / FR dolu soru+açıklama | 600 / 600 / 600 / 600 / 600 |
| Yapısal hata | 0 |
| Güncel otomatik uyarı | 0 |
| İnsan incelemesi etiketleri | 448 |
| Ses referansı/telaffuz hakları | 48 |
| Hareke/fonetik/okuma | 300 |
| Dinî anlam/gramer bağlamı | 100 |

İlk taramanın 3.856 adet normalizasyon uyarısı Arapça hareke dizilimlerinin Unicode NFC farklarını tekrarlı biçimde sayıyordu; bu uyarılar **yayın hatası olarak kabul edilmedi**. Geliştirilmiş tarayıcı, yalnız gerçek fazladan boşluk/satır sonu uyarısı verir ve aynı şık Arapça metnini her dilde beş kere saymaz. Güncel Node çalışmasında **0 otomatik uyarı** ve **0 yapısal hata** doğrulandı. Bu, uzman inceleme kuyruğunun bittiğini göstermez.

## İnsan onayı gerektiren sınırlar

Bu 448 işaretli **soru öğesi**, 448 kanıtlanmış yanlış anlam veya telaffuz olduğu anlamına gelmez. Dinî anlam ve kelime kökü/bağlam değerlendirmesi, kıraat/telaffuz, harf sesleri, ayet bağlamı ve ses lisansları için ilgili uzman/doğrulanmış hak kaydı gereklidir. Sistem bunları otomatik olarak “uzman onaylı”, “tecvid yeterliği” veya “tam meal” şeklinde göstermemelidir.

Kullanıcıdan sağlanan 15 harf MP3'ü dışındaki 13 harf için gerçek onaylı MP3 yoktur; cihaz TTS'i, tecvid veya sahih tilavet yerine geçmez. İlkelerin ihlal edildiği yer tespit edilirse güvenli davranış dersi/sesi kilitli tutmaktır.

## Rapor ve regresyon

`Arabic question bank audit` iş akışı şu dosyayı kanıt artefaktına ekler:

`deen-qa/arabic-v2-stage14-report.json`

Bu rapor tüm yapısal hataları, uyarıları ve **448 işaretlenmiş soru kimliğini** içermelidir. Ayrıca 600 soru ve mobil RTL testleri için `Quran Arabic Words Fast QA` kullanılmaktadır. PR #115'in son commit'i üzerindeki CI başarıları ve veri dosyasının varlığı doğrulanmadan aşama tamamlandı sayılmaz.

**Yayın önkoşulu:** Son PR sürümünün hızlı QA'sı, geniş uygulama QA'sı ve yayın manifesti başarılı. Manuel onay gerektiren maddelerin statüsü açıkça `pending human review` olarak korunur.
