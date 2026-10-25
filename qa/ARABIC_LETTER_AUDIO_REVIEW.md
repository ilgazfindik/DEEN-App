# DEEN — Arapça harf sesi yayın öncesi inceleme kaydı
**Tarih:** 2026-10-16  
**Kaynak:** PR #91, `main` dalında yayın altyapısı; takip: kullanıcı hak sahipliği beyanı  
**Durum:** 8 MP3 teknik olarak yüklü. **Kullanıcı 16 Ekim 2026'da 8/8 kaydın hak sahipliğini ve telaffuzlarını onayladı.** Uygulamada **ses sahibi onaylı önizleme** olarak dinlemeye açıldı. **Bağımsız uzman telaffuz incelemesi 0/8**; kullanıcı onayı bağımsız denetim olarak gösterilmemelidir.

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
3. Her dosya için bağımsız uzman teyidi oluştur: **gözden geçiren**, **inceleme tarihi**, **işitilen ifade**, **sonuç**, **referans**. Kullanıcının 16 Ekim beyanı `creator-confirmed` olarak kaydedilir; `pronunciationReviewRef` boşken `approved` denilmez. Buna rağmen kullanıcı talebi doğrultusunda **önizleme oynatılabilir**.
4. **Hak sahipliği beyanı kaydı:** Kullanıcı 16 Ekim 2026'da seslerin telifinin kendisine ait olduğunu bildirdi. `rights:'owner-attested'` ve `rightsEvidence:'owner-declaration-2026-10-16'` bu beyanı gösterir; üçüncü tarafça yapılmış lisans incelemesi anlamına gelmez. Ek kanıt gerekirse ayrıca istenir; var olmayan bağımsız doğrulama kaydı üretilmez.
5. Fiziksel iPhone/Safari ve Android/Chrome üzerinde gerçek dokunma, sessiz mod, ekran kilidi/arka plan, düşük bağlantı hızı ve Bluetooth çıkışı davranışını kontrol et. Chrome dokunma simülasyonu cihaz doğrulaması yerine geçmez.
6. Canlıya almadan önce birleştirme onayı ver; `scripts/test-arabic-letter-audio.cjs`, gerçek Chrome QA, bütün release hash ve tam uygulama denetimlerinin tamamı başarılı olmalıdır.

## Test ve yayın ayrımı
- **Yerel önizleme:** `localhost`, `127.0.0.1` ve `[::1]` üzerinde onay bekleyen kayıtlar teknik QA amacıyla dinlenebilir.
- **Üretim:** Hak sahibi 8 kaydı telaffuz açısından da onayladı. Yalnızca bu sekiz dosya `creator-confirmed` etiketiyle canlı önizlemeye açılır. **Bağımsız onay yoktur**; `approved` API'si bağımsız uzman incelemesi tamamlanana kadar false döner. Kaydı olmayan diğer 20 harfte oynatma açılmaz.
- **Yayın:** Kod ve MP3'ler `main` dalındadır; 8 sesin canlı önizleme izni sahibi onayıyla verilmiştir. Bağımsız dil uzmanı incelemesi ayrı çalışmadır.
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
