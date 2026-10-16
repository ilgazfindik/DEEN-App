# DEEN — Arapça harf sesi yayın öncesi inceleme kaydı
**Tarih:** 2026-10-16  
**Kaynak:** PR #91, `main` dalında yayın altyapısı; takip: kullanıcı hak sahipliği beyanı  
**Durum:** 8 MP3 teknik olarak yüklü ve yerel tarayıcıda çalınabilir. **8/8 kayıt için hak sahipliği kullanıcı tarafından 16 Ekim 2026'da beyan edildi; bu, bağımsız lisans incelemesi değildir. 0/8 telaffuz onayı.** Canlıda ses oynatma kilidi devam ediyor.

## Kapsam — harf isimleri, harekeli heceler değil
| ID / dosya | Harf | Türkçe ders etiketi | Çalışılacak Arapça isim | Teknik kontrol | Bağımsız telaffuz | Haklar |
|---|---|---|---|---|---|---|
| `letter-qaf.mp3` | ق | Kaf (ق) | قاف (qāf) | MP3/SHA: geçti | Bekliyor | Kullanıcı beyanı |
| `letter-kaf.mp3` | ك | Kef | كاف (kāf) | MP3/SHA: geçti | Bekliyor | Kullanıcı beyanı |
| `letter-lam.mp3` | ل | Lam | لام (lām) | MP3/SHA: geçti | Bekliyor | Kullanıcı beyanı |
| `letter-mim.mp3` | م | Mim | ميم (mīm) | MP3/SHA: geçti | Bekliyor | Kullanıcı beyanı |
| `letter-nun.mp3` | ن | Nun | نون (nūn) | MP3/SHA: geçti | Bekliyor | Kullanıcı beyanı |
| `letter-ha.mp3` | ه | He | هاء (hāʾ) | MP3/SHA: geçti | Bekliyor | Kullanıcı beyanı |
| `letter-waw.mp3` | و | Vav | واو (wāw) | MP3/SHA: geçti | Bekliyor | Kullanıcı beyanı |
| `letter-ya.mp3` | ي | Ye | ياء (yāʾ) | MP3/SHA: geçti | Bekliyor | Kullanıcı beyanı |

**Dikkat:** `ق` ile `ك` birbirinin yerine geçmez. `ه` ile `ح` (hha, henüz ses kaydı yok) da farklı harflerdir. Ses isimleriyle kısa ses/hece telaffuzları karıştırılmamalıdır. Bu aşamada `بَ`, `بِ`, `بُ` gibi harekeli hecelere ilişkin ses onayı verilmemiştir.

## İnceleme usulü
1. Her dosyayı **Arapça fonetik/kıraat konusunda yetkin, bağımsız** bir gözden geçirene dinlet. Çekim veya ElevenLabs çıktısının metindeki harf **ismini** söylediğini, yanlış hece/ses olmadığını tek tek kontrol ettir.
2. Kaynak sesi dinlenebilirlik açısından denetle: başlangıç/son kesilmesi, hecenin kırpılması, boğukluk, ses çakışması, yapay sesin verdiği yanıltıcı vurgu. Bir kaydı yanlışsa düzelt ve SHA-256, byte sayısı ile QA testini yeniden oluştur.
3. Her dosya için teyit kaydı oluştur: **gözden geçiren**, **inceleme tarihi**, **doğru işitilen Arapça ifade**, **sonuç**, **referans/kayıt bağlantısı**. `pronunciationReviewRef` boş kalırken kodda `approved` yapılmamalı.
4. **Hak sahipliği beyanı kaydı:** Kullanıcı 16 Ekim 2026'da seslerin telifinin kendisine ait olduğunu bildirdi. `rights:'owner-attested'` ve `rightsEvidence:'owner-declaration-2026-10-16'` bu beyanı gösterir; üçüncü tarafça yapılmış lisans incelemesi anlamına gelmez. Ek kanıt gerekirse ayrıca istenir; var olmayan bağımsız doğrulama kaydı üretilmez.
5. Fiziksel iPhone/Safari ve Android/Chrome üzerinde gerçek dokunma, sessiz mod, ekran kilidi/arka plan, düşük bağlantı hızı ve Bluetooth çıkışı davranışını kontrol et. Chrome dokunma simülasyonu cihaz doğrulaması yerine geçmez.
6. Canlıya almadan önce birleştirme onayı ver; `scripts/test-arabic-letter-audio.cjs`, gerçek Chrome QA, bütün release hash ve tam uygulama denetimlerinin tamamı başarılı olmalıdır.

## Test ve yayın ayrımı
- **Yerel önizleme:** Yalnızca `localhost`, `127.0.0.1` ve `[::1]` hostlarında `pending-review` kayıtlar ses verebilir.
- **Üretim:** Hak sahipliği kullanıcı beyanı kaydedilmiştir. Ancak `approved` oynatma durumuna geçmek için bağımsız telaffuz onayı ve referansı gereklidir. Varsayılan davranış **kapalı**.
- **Yayına alma ayrımı:** Kod ve MP3'ler `main` dalındadır; ses düğmelerinin kullanıcılar için aktif olması ayrı telaffuz onayı gerektirir.
- **Kapsam dışı:** Altı adet mevcut dinleme dersi/hece ve Kur’an kıraati seslerinin ayrı onay sistemi bu PR kapsamında değiştirilmez.

## Onay kaydı (her harf için ayrı doldurulmalı)
```text
Harf ID ve MP3:
İnceleyen (ad/uzmanlık):
İnceleme tarihi:
İşitilen Arapça ifade:
Telaffuz kararı (ONAY / DÜZELT / RED):
Telaffuz kanıtı veya inceleme referansı:
Kullanım hakkı/lisans dayanağı:
Hakları kontrol eden ve tarih:
Cihaz QA kanıtı:
```
