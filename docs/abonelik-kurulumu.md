# Ilnura Premium — App Store Connect kurulumu

Uygulama tarafı hazır: ödeme ekranı, ebeveyn onayı, satın alma, geri yükleme ve Premium'un açılıp kapanması
(`assets/design/subscribe.js`, `ios/App/App/Subscriptions.swift`). Fiyatlar uygulamaya yazılmaz; **App Store'dan,
kullanıcının ülkesinin para birimiyle** gelir. Aşağıdaki adımlar App Store Connect'te bir kez yapılır.

## 1. Sözleşme, banka, vergi (bir kez)

App Store Connect › **Business** (İş) bölümünde:

1. **Paid Apps Agreement** (Ücretli Uygulamalar Sözleşmesi) › kabul et.
2. **Bank account** › Türk bankasındaki IBAN'ını gir (20/B istisnası kullanacaksan o işe özel açtığın hesap).
3. **Tax forms** › **W-8BEN** formunu doldur (ABD dışı kişi). Türkiye–ABD vergi anlaşması nedeniyle stopaj oranı düşük olur.

Durum "Active" olana kadar (birkaç gün sürebilir) abonelikler TestFlight'ta da görünmez.

## 2. Abonelik grubu ve ürünler

App Store Connect › Uygulaman (Ilnura) › **Monetization › Subscriptions**:

1. **Subscription Group** oluştur: ad `Ilnura Premium`.
2. Grubun içine iki abonelik ekle. **Product ID'ler birebir aynı olmalı** (uygulama bunlarla arar):

| Reference name | Product ID | Süre | Grup içi sıra |
|---|---|---|---|
| Premium Yearly | `com.ilgazfindik.ilnura.premium.yearly` | 1 Year | 1 (en üst) |
| Premium Monthly | `com.ilgazfindik.ilnura.premium.monthly` | 1 Month | 2 |

3. Her ürün için **Localization** (en az Türkçe ve İngilizce, istersen 5 dil):
   - Display name: `Premium (Yıllık)` / `Premium (Aylık)` — `Premium (Yearly)` / `Premium (Monthly)`
   - Description: `Sınırsız enerji ve haftalık ücretsiz seri kurtarma.` — `Unlimited energy and a free streak repair every week.`
4. **Introductory Offer** (yalnızca yıllık): *Free Trial*, *1 Week*, tüm ülkeler.
5. **Review Information**: ödeme ekranının bir ekran görüntüsü (TestFlight'tan alırsın) ve kısa not:
   `Premium adds unlimited energy and a weekly free streak repair. Religious lessons are free for everyone.`
6. Grubun **App Store Localization**'ında grup adı: `Ilnura Premium`.

## 3. Fiyatlar (ülke ve para birimine göre)

Apple'da bir **ana ülke** fiyatı seçersin, diğer 174 ülkeyi Apple döviz kuru ve vergilere göre **otomatik** ayarlar.
Sonra istediğin ülkeleri elle değiştirirsin. Önerilen:

- **Ana ülke: ABD (USD)** → aylık **9,99 $**, yıllık **49,99 $**.
- Aşağıdaki ülkeleri **elle** ayarla (diğerleri otomatik kalsın):

| Ülke / bölge (uygulama dili) | Para birimi | Aylık | Yıllık (7 gün ücretsiz) |
|---|---|---|---|
| **Türkiye** (tr) | TRY | **99,99 ₺** | **599,99 ₺** |
| ABD (en) | USD | 9,99 $ | 49,99 $ |
| Birleşik Krallık (en) | GBP | 8,99 £ | 44,99 £ |
| Kanada (en, fr) | CAD | 12,99 CA$ | 69,99 CA$ |
| Avustralya (en) | AUD | 14,99 A$ | 79,99 A$ |
| İrlanda (en) | EUR | 9,99 € | 49,99 € |
| Almanya, Avusturya (de) | EUR | 9,99 € | 49,99 € |
| İsviçre (de, fr) | CHF | 9,00 CHF | 45,00 CHF |
| Fransa, Belçika, Lüksemburg (fr) | EUR | 9,99 € | 49,99 € |
| Hollanda (en/tr kullanıcıları) | EUR | 9,99 € | 49,99 € |
| Suudi Arabistan (ar) | SAR | 36,99 ر.س | 189,99 ر.س |
| BAE (ar) | AED | 36,99 د.إ | 184,99 د.إ |
| Katar (ar) | QAR | 36,99 ر.ق | 184,99 ر.ق |
| Kuveyt (ar) | USD | 9,99 $ | 49,99 $ |
| Mısır (ar) | EGP | 199,99 ج.م | 999,99 ج.م |
| Fas (ar, fr) | USD | 4,99 $ | 24,99 $ |
| Cezayir, Tunus (ar, fr) | USD | 4,99 $ | 24,99 $ |
| Ürdün, Irak (ar) | USD | 6,99 $ | 34,99 $ |

Notlar:
- Avrupa ve İngiltere fiyatları **KDV dahildir** (Apple öyle gösterir); Apple vergiyi kendisi öder.
- Mısır, Fas, Cezayir, Tunus, Ürdün ve Irak'ta alım gücü düşük olduğu için fiyatlar bilinçli olarak daha düşük.
  İstersen bunları da otomatik bırakabilirsin.
- Apple yalnızca kendi fiyat basamaklarına izin verir; tam bu rakam yoksa **en yakın basamağı** seç
  (ör. 36,99 yoksa 37,99).
- Fiyatı sonradan değiştirebilirsin; mevcut aboneleri eski fiyatta tutma seçeneği vardır.

## 4. TestFlight'ta deneme (gerçek para çekilmez)

1. App Store Connect › **Users and Access › Sandbox › Test Accounts** › bir sandbox test hesabı oluştur
   (gerçek olmayan bir e-posta olabilir).
2. iPhone'da **Ayarlar › App Store › Sandbox Account** bölümünden bu hesapla giriş yap.
3. TestFlight'taki Ilnura'da Profil › Premium'u aç: fiyatlar kendi para biriminde görünmeli.
   Satın al → ebeveyn sorusu → Apple onayı → "Premium etkin".
   Sandbox'ta 1 yıl ≈ 1 saat, 1 ay ≈ 5 dakika sürer; yenileme ve bitişi hızlıca görebilirsin.
4. "Satın alımları geri yükle" ve "Aboneliği yönet" düğmelerini dene.

## 5. Yayından önce kontrol

- [ ] Sözleşme, banka ve vergi "Active"
- [ ] İki ürün "Ready to Submit", yıllıkta 7 günlük ücretsiz deneme
- [ ] Fiyatlar (tablo)
- [ ] Uygulama sürümünü incelemeye gönderirken iki aboneliği de **aynı gönderime ekle**
  (ilk abonelikler uygulama sürümüyle birlikte incelenir)
- [ ] App Store açıklamasında: abonelik süresi, fiyat, otomatik yenileme ve
  Kullanım Şartları ile Gizlilik Politikası bağlantıları
  (`https://ilgazfindik.github.io/DEEN-App/legal/terms.html`, `.../legal/privacy.html`)
