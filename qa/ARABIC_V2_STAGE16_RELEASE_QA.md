# DEEN Arapça Öğren V2 — 16. aşama / son yayın kapısı

**Durum:** Kod ve otomatik kapsam kapısı hazır; stage15'ten gelen son regresyonların, PR birleşiminin ve canlı Pages dağıtımının sonucu doğrulanmadan **yayında** sayılamaz.

## Son otomatik kapsam şartları

| Ölçüt | Zorunlu kabul |
|---|---|
| Öğretici kartı | 27/27 ders × 5 arayüz dili = 135 yerelleştirilmiş öğretici |
| Benzersiz V2 soru | 600/600; 6 paket × 100 |
| Aktif soru havuzuna sahip ders | 25 |
| Ses onayı bekleyen dinleme dersi | 2, kilitli |
| Her ders oturumu | 8, 10 ve 12 soruluk örneklem; 75 oturum kombinasyonu |
| Cevap, açıklama, yanlış çeldirici gerekçesi | TR/EN/AR/DE/FR; boş alan veya yanlış anahtar yok |
| Öğreticide ses referansı | Sadece 28 tanımlı harfe yönlendirilebilir; **15 gerçek MP3**, 13 kayıt bekliyor |
| Soru tekrarı | Oturum başına yinelenen ID 0 |
| İlerleme güvenliği | Eski XP, kalp, enerji, ders kayıtları değişmeyecek |
| Mobil/PWA | 320/375px RTL; 67 segment bütünlüğü; internetsiz yeni sekmede yeniden açılış |

Otomatik paket: `scripts/audit-arabic-v2-release-gate.cjs`. Birleştirme öncesi `Quran Arabic Words Fast QA`, `Arabic question bank audit` ve `Companion picker runtime QA` son HEAD üzerinde başarılı olmalıdır. Final `main` Pages deployment ve build kimliği ayrıca teyit edilmelidir.

## Açık insan incelemesi ve dürüst sınırlamalar

14. aşama denetimi otomatik olarak **448 inceleme etiketi** üretti: 100 dinî anlam/gramer, 300 hareke/okuma ve 48 ses hakları/telaffuz maddesi. Bu etiketlerin hiçbiri otomatik yöntemle uzman onayına çevrilemez. Sadece geçerli dosya var diye kıraat, dinî yorum veya ses lisansı teyit edilmez.

Arapça V2'nin hedefi **harekeli Arapça/Kur'an okuma ve kısa yazılı ifade çözümleme**, genel Arapça B1 veya tecvid uzmanlığı değildir. Ayetler orijinal Arapça kalır. Onaysız altı dinleme klibi (iki ders) açık kalamaz. Çevrimdışı destek, tüm evrensel medya/başka dil bankaları için otomatik garanti anlamına gelmez.

## Yayın sonrasında raporlanacak

Tam `main` SHA, PR numarası, başarılı CI run ID'leri, başarılı Pages dağıtımı, yayınlanan build etiketi ve 16. aşama kapı çıktısı. Son CI başarısız olursa mevcut canlı uygulama değiştirilmez.
