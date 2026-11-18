# Ilnura iOS uygulaması: TestFlight ile kendi iPhone'unda deneme

Uygulama, web oyununun (bu depo) bir iOS kabuğu (Capacitor) içine paketlenmiş hâlidir. Bundle ID: `com.ilgazfindik.ilnura`. Bu aşamada yalnızca **TestFlight iç testi** hedeflenir: Apple incelemesi gerekmez, uygulamayı yalnızca App Store Connect hesabındaki kişiler görür.

## Bir kez yapılacaklar (Apple tarafı)

1. **App Store Connect → Uygulamalar → ➕ → Yeni uygulama**
   - Platform: iOS · Ad: Ilnura (alınmışsa "Ilnura: İslam Öğren" gibi bir ad) · Birincil dil: Türkçe
   - Bundle ID: `com.ilgazfindik.ilnura` (listede yoksa önce developer.apple.com → Certificates, IDs & Profiles → Identifiers → ➕ → App IDs → App ile kaydet)
   - SKU: `ilnura-ios-1`
2. **API anahtarı:** App Store Connect → Kullanıcılar ve Erişim → Entegrasyonlar → App Store Connect API → **Takım Anahtarları → ➕**. Ad: `github-ci`, erişim: **Admin**. Oluşunca şunları not al:
   - **Key ID**
   - **Issuer ID** (sayfanın üstünde)
   - `.p8` dosyasını **bir kez** indirebilirsin, kaybolursa yeni anahtar üretmen gerekir.
3. **Team ID:** developer.apple.com → Hesap → Üyelik ayrıntıları → Team ID (10 karakter).

## GitHub'a eklenecek gizli değerler

Depo → Settings → Secrets and variables → Actions → **New repository secret**. **Bu değerleri sohbete ya da koda yapıştırma**, yalnızca bu sayfaya gir.

| Ad | Değer |
|---|---|
| `APPSTORE_KEY_ID` | API anahtarının Key ID'si |
| `APPSTORE_ISSUER_ID` | Issuer ID |
| `APPSTORE_API_KEY_P8` | `.p8` dosyasının **tüm içeriği** (`-----BEGIN PRIVATE KEY-----` satırları dahil) |
| `APPLE_TEAM_ID` | Team ID |

## İmzalama nasıl çalışıyor (cihaz kaydı gerekmez)
İş akışı, aynı API anahtarıyla Apple'dan **kısa ömürlü bir "Apple Distribution" sertifikası** ve bir **"App Store" dağıtım profili** ister (`scripts/ios-signing.mjs`). Bu profil için **kayıtlı iPhone ya da Development profili gerekmez**. Release yapılandırması bunlarla elle imzalanır, TestFlight'a yüklenir, sonra sertifika ve profil iptal edilir, böylece Apple'ın "en fazla 3 dağıtım sertifikası" sınırı dolmaz. API anahtarının erişimi **Admin** olmalı. "Takımda zaten 3 Apple Distribution sertifikası var" hatası alırsan kullanmadığın birini developer.apple.com → Certificates bölümünden iptal et.

## Derlemeyi gönderme

GitHub → **Actions → iOS App → Run workflow** → `upload` kutusunu işaretle → Çalıştır. Bulutta macOS makinesi uygulamayı derler, imzalar ve App Store Connect'e yükler (yaklaşık 15–25 dakika). Her çalıştırma yeni bir derleme numarası alır.

## iPhone'da kurma

1. App Store Connect → uygulamanın **TestFlight** sekmesi → Dahili Test → ➕ → bir grup oluştur → kendini ekle.
2. Derleme işlendikten sonra (birkaç dakika) gruba ekle.
3. iPhone'una **TestFlight** uygulamasını indir, aynı Apple kimliğiyle gir, Ilnura'yı kur.

## Önemli notlar

- **Yönetici "P" düğmesi** şu an uygulamanın içinde. TestFlight iç testi için sorun değil. **App Store'a gönderilmeden önce kaldırılmalı**, Apple incelemesinde gözükmemeli.
- **Apple Kılavuz 4.2 (en az işlevsellik):** Yalnızca web sitesi gibi görünen uygulamalar reddedilebilir. Gönderim öncesi en az bir yerel özellik (günlük hatırlatma bildirimi, haptik vb.) eklenecek.
- Uygulama **yalnızca iPhone ve dikey** yönlendirmedir. iPad desteği yok (iPad ekran görüntüsü gereksinimi doğmaz).
- Mağaza için ayrıca gerekir: gizlilik politikası adresi (alan adı alınınca), yaş sınırı anketi, ekran görüntüleri, destek e-postası.
