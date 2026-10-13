# DEEN — Français / Çalışma 1: kaynak haritası ve korumalı başlangıç

**Dal:** `codex/french-stage1-20261013` (production için onay değildir).

## Kesinleşen başlangıç
- Fransızca `Français` seçeneği ve giriş/onboarding çevirileri `assets/i18n/locale.js` içinde **önceden mevcut**. Yeniden yazılmadı.
- Mevcut `assets/i18n/content-support.json` içindeki `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false` **değiştirilmedi**. Canlı Türkçe/Arapça/İngilizce ve Almanca QA davranışı değişmedi.
- `assets/i18n/questions/fr/staging/U01-S01.json` içine U01’in 100/100 temel sorusu Fransızca olarak kaydedildi. 9 çoktan seçmeli, 3 doğru/yanlış, 2 boşluk doldurma. Soru ID, Türkçe orijinal, seçenek sayısı, doğru cevap konumu ve boşluk yapısı korunuyor.
- `assets/i18n/fr/ui.staging.json`: 35 temel statik UI çevirisi; yalnız staging. Kaynak anahtarları doğrulanmıştır, prod katmanına bağlanmamıştır.
- `scripts/audit-french-staging.mjs`: kaynak eşleşmesi, cevap/şık/boşluk yapısı, dil sızıntısı örnekleri, onay etiketleri, bozulmamış diğer diller denetimi.
- `scripts/inventory-french-ui.mjs`: 15 ünitenin 1.500 temel sorusunu, Almanca QA sırasında belirlenen 1.452 Türkçe UI kaynak anahtarını (1.087 ortak referans), 12 öncelikli dinamik ekran örneğini listeler. Bu sayı ekranların tamamının kapsandığına dair iddia **değildir**; canlı DOM denetimleriyle genişletilecektir.
- CI: `.github/workflows/french-localization-audit.yml`, eksik UI referanslarını `qa-artifacts/french-ui-inventory.json` olarak saklar.

## Devam sırası
1. **U01-S01…S07:** 100/100 temel soru taslağı ve ayrı kaynak/cevap doğrulaması hazır. Paket kontrolü her gönderimde çalışacak.
2. **U02–U15:** her biri 100 temel soru; 1.500/1.500; ek canlı U01 (84) ve runtime varyantları ayrı korumalı tabloda. İngilizce/Almanca dosyalar Fransızca diye yeniden adlandırılmayacak.
3. **UI çevrimi:** tüm 1.452 bilinen Türkçe ekran kaynağı; ayrıca çalışma sırasında görülen dinamik sayaçlar (`{n} jours`), ödüller, sekmeler, ders başarıları, onboarding sonrası sonuç ekranları ve kullanıcı profili. Tekil/çoğul ve Fransızca noktalama kontrolü.
4. **Kur’an:** Arapça ayet metinleri ve özgün sesler korunur. Fransızca anlamlar ayrıca lisans ve bağımsız dinî kontrol gerektirir; Türkçe/İngilizce mealden görünmez fallback yok.
5. **Tarayıcı:** `fr` seçili gerçek Chromium ile tam soru akışı, dil sızıntısı, cevap indeksi ve mobil taşma kontrolü. İzole `/fr-review/` test yayını, ancak Fransızca tam kaynak paketleri bağlanıp tarayıcı QA olgunlaşınca açılacaktır.
6. **Üretim:** anadili Fransızca olan denetçi, dinî uzman, kaynak/izin onayı ve iOS/Android kabulü tamamlanmadan `fr` üretim yayın bayrakları açılmaz.

**Önemli:** İlk Fransızca çeviriler editoryal taslaktır; insan uzman denetimi yapılmış olarak gösterilmez. Otomatik yapı testi, dilsel ve dinî doğruluğu %100 garanti etmez.

## 2026-10-13 — U01 100/100 taslağı
- S01–S07: 14 + 14 + 14 + 16 + 16 + 12 + 14 = **100/100**.
- Tamamlanan içerik yalnızca staging'de; canlı gösterim veya uzman onayı yok.
- `scripts/audit-french-u01-complete.mjs` tüm U01 soru ID, kaynak, doğru cevap konumu, matching çiftleri, boşluk yapısı, metin sızıntıları ve onay kilitlerini denetler.
- Kalan: U03–U15 **1.300 temel soru**, U01 canlı varyantları, 1.417 UI metni ve dinamik arayüz testleri.

## 2026-10-13 — U02 100/100 taslağı
- U02-S01..S07: 14 + 14 + 14 + 16 + 16 + 12 + 14 = **100/100**.
- İşlenen kavramlar: Allah’a iman, tevhid, yaratıcı–yaratılan farkı, şükür, Allah’a güven ve sorumluluk.
- U01 + U02 temel soru toplamı **200/1.500**, kalan **1.300** (U03–U15).
- `scripts/audit-french-u02-complete.mjs` kaynak, cevap indeksleri, eşleştirme, boşluk ve release-kilidi testlerini çalıştırır.
- Kalan arayüz envanteri 1.417 Türkçe kaynak anahtarıdır; gerçek tarayıcıdaki ek dinamik metinler ayrıca kontrol edilecektir.
- FR dinî uzman/anadili Fransızca onayı **verilmedi**, üretim `fr.question_data=missing`, `fr.global_qa=blocked` korunur.

## 2026-10-13 — U03 100/100 Fransızca taslak
- U03-S01–S07 paketleri: **14 + 14 + 14 + 16 + 16 + 12 + 14 = 100/100**.
- Şehadet metni: iki inanç beyanının anlamı, özgün telaffuz/kelime sıralaması, sesli soru ve eşleştirme tipleri kaynakla bağlandı.
- Toplam **300/1500 temel soru**; kalan **1200 (U04–U15)**. U01 aktif varyantları ve UI ayrı görevler olarak devam ediyor.
- Dinî anlamlara ilişkin Fransızca metinler uzman incelemesi için staging'dedir; orijinal Arapça kıraat veya ses dosyası değiştirilmedi.
- `scripts/audit-french-u03-complete.mjs` eşleştirme, doğru cevap indeksi, boşluk, dizi sırası ve kaynak kimliği denetler; Fransızca anadili/dinî onay bu teknik kontrolden çıkarsanmaz.

## 2026-10-13 — U04 100/100 Fransızca taslak
- U04-S01–S07 paketleri: **14 + 14 + 14 + 16 + 16 + 12 + 14 = 100/100**.
- Beş şart: şehadet, namaz, oruç, zekât ve hac; kavram eşleştirmeleri, günlük yaşam senaryoları, açıklamalar, tüm seçenekler Fransızcaya çevrildi.
- Toplam **400/1500** temel soru; **1100** soru U05–U15'te kaldı. U01 canlı varyantları, 1417 bilinen UI anahtarı ve dinamik ekranlar ayrıca eksik.
- `scripts/audit-french-u04-complete.mjs`: soru kaynak eşleşmesi, cevap konumu, eşleştirme çiftleri, boşluk adedi, dinî metnin kaynak kimliği ve üretim kilitleri kontrolü.
- Dini/Fransızca uzman onayları henüz verilmedi; yalnız staging.

## 2026-10-13 — U05 100/100 Fransızca taslak
- U05-S01–S07: **14 + 14 + 14 + 16 + 16 + 12 + 14 = 100/100**.
- İçerik: imanın tanımı, altı iman esası, Allah, melekler, kitaplar, peygamberler, ahiret ve kader/kaza; İslam'ın beş şartından ayrımları, tekrar ve senaryolar.
- Genel durum: **500/1500 temel soru taslağı**, **1000 kalan** (U06–U15); 35/1452 statik UI taslağı değişmedi.
- 100 U05 soru, 88 cevap seçenekli soru, 36 matching çifti, 7 fill_blank yapısı kaynakla karşılaştırıldı.
- `scripts/audit-french-u05-complete.mjs` yapısal kontrolü, kaynak kimliği, şık indeksi, boşluk adedi ve kelime sızıntısı kontrolü sağlar. Uzman onayı anlamına gelmez.
- Üretim `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false` olarak kilitlidir.

## 2026-10-13 — U06 100/100 Fransızca taslağı
- U06-S01–S07: **14 + 14 + 14 + 16 + 16 + 12 + 14 = 100/100**.
- İçerik: meleklere iman, ayetlerde özellikleri, Cebrâil ve vahiy, amel yazıcıları, ölüm meleği, kaynak disiplini ve İblîs-cin ayrımı.
- Genel Fransızca temel soru taslağı: **600 / 1.500**; kalan **900 (U07–U15)**.
- Soru ID/cevap pozisyonu kontrolü: 100 soru, 78 seçenekli, 24 matching çifti, 8 fill_blank ve 6 sıralama. Ön kaynak taramasında 0 hata.
- `scripts/audit-french-u06-complete.mjs` kaynak, cevap konumu, matching, boşluk, sequence sırası, güvenlik bayrakları ve temel dil sızıntısı denetimini gerçekleştirir.
- Kur'an atıflarının çevirileri kaynak anlamına uygun hazırlanmış taslaklardır; **dinî uzman ve anadili Fransızca denetimi yapılmadı**. Arapça ayet metni ve kıraat değiştirilmedi.
- `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false` açıkça korunuyor. Hiçbir `main` veya canlı deploy değişikliği yok.

## 2026-10-14 — U07 100/100 Fransızca taslak
- U07-S01–S07 toplam: **14 + 14 + 14 + 16 + 16 + 12 + 14 = 100/100**.
- İçerik: kitaplara iman, Tevrat/İncil/Zebur/sahifeler, Kur'an'ın önceki vahiylerle ilişkisi, hidayeti, korunması ve kaynak disiplini.
- Fransızca temel soru ilerlemesi **700/1.500**; **800 soru U08–U15'te** kaldı.
- İlk yapısal karşılaştırma: 100 soru, 78 seçenekli soru, 24 eşleştirme çifti, 8 fill_blank ve 6 sıralama; sıfır yapısal hata. CI'de aynı denetim ayrıca tekrarlanacak.
- `scripts/audit-french-u07-complete.mjs`: kaynak eşitliği, doğru cevap konumu, eşleştirme, boşluk, sıralama ve üretim kilidi denetimi.
- Kur'an ayetlerine dayalı dinî açıklamalar **taslaktır**; bağımsız dinî uzman ve anadili Fransızca doğrulaması yapılmadı, üretime açık değil.
- `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false` kilitleri korunur; `main` ve mevcut diller değişmez.

## 2026-10-14 — U08 100/100 Fransızca taslak
- U08-S01–S07: **14+14+14+16+16+12+14 = 100/100**.
- Konular: peygamberlere iman, peygamberlerin insan oluşu, vahyin tebliği, ortak tevhid çağrısı, Hz. Muhammed'in bütün insanlara gönderilmesi ve son peygamber oluşu, tekrar ve kaynak disiplini.
- Genel toplam **800/1.500**; **700 soru U09–U15'te** bekliyor.
- İlk kaynak/şema karşılaştırması: **100 soru, 78 seçenekli soru, 24 eşleştirme çifti, 8 fill_blank ve 6 sıralama; sıfır yapısal hata**.
- `scripts/audit-french-u08-complete.mjs` yeni bağımsız kaynak/cevap/boşluk/eşleştirme/sıralama denetimidir; CI'ye eklendi.
- Teknik doğrulama dinî anlamın ve anadili Fransızca doğruluğun uzman onayı değildir. Dinî/Fransızca uzman onayı verilmedi. `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false` üretim kilitleri değişmedi.

## 2026-10-14 — U09 100/100 Fransızca taslak
- U09-S01–S07 toplam: **14 + 14 + 14 + 16 + 16 + 12 + 14 = 100/100**.
- Konular: ahirete iman, ölüm/berzah, yeniden diriliş, hesap günü, ilahî adalet, küçük iyiliklerin ve kötülüklerin karşılığı, sorumluluk, umut ve kaynak disiplini.
- Genel toplam **900/1.500**; **600 soru U10–U15'te** bekliyor.
- İlk kaynak/şema karşılaştırması: **100 soru, 80 seçenekli soru, 21 eşleştirme çifti, 8 fill_blank ve 6 sıralama; 0 yapısal hata**.
- `scripts/audit-french-u09-complete.mjs`: kaynak eşitliği, cevap pozisyonları, matching, boşluklar, sıralama ve üretim kilitlerini denetler. CI'ye eklendi.
- Kur'an ayetlerine dayalı anlamlar **taslaktır**; bağımsız dinî uzman ve anadili Fransızca incelemesi yapılmadı. Arapça ayet ve kıraat değişmedi.
- `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false` kilitleri korunur. Main'e merge veya canlı deploy yapılmaz.

## 2026-10-14 — U10 100/100 Fransızca taslağı
- U10-S01–S07: **14+14+14+16+16+12+14 = 100/100**.
- Konular: kader/kaza, ilahî bilgi/ölçü, irade ve sorumluluk, tevekkül, musibet ve sabır; Mâtürîdî–Eş'arî terim farkı korunmuştur.
- Temel soru toplamı **1.000/1.500**; U11–U15'te **500 soru** kaldı.
- İlk kaynak taraması: **100 soru, 80 seçenekli, 21 eşleştirme çifti, 8 fill_blank, 6 sıralama; sıfır yapısal hata**.
- `scripts/audit-french-u10-complete.mjs` kimlik, değişmemiş Türkçe kaynak, cevap indeksleri, boşluk/sıralama/eşleştirme, Fransızca metin varlığı ve üretim kilitlerini CI'de denetler.
- Yanlış pozitif uyarısı: Fransızca **élève** sözcüğünün sonundaki **ve**, ASCII sözcük sınırıyla yazılmış Türkçe `ve` taramasında eşleşebilir; bu Türkçe sızıntısı değildir.
- Dilsel ve dinî uzman onayları henüz verilmedi; açıklamalar dinî yönden ayrıca incelenecek. Kur'an Arapçası ve sesler değişmedi.
- `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false` kilitleri korunur. Main/Pages değişmez.

## 2026-10-14 — U11 100/100 Fransızca taslağı
- U11-S01–S07: **14+14+14+16+16+12+14 = 100/100**.
- Konular: ibadet kaynakları ve anlamı, namaz/salât ve dua/du‘â ayrımı, niyet, ihlas, gösteriş, temizlik, hac, zekât, oruç, davranış ve kaynak disiplini.
- Genel temel soru taslağı: **1.100/1.500**, U12–U15 için **400 soru** kaldı.
- İlk oluşturma kontrolünde **84 seçenekli soru, 36 eşleştirme çifti**; seçenek cevap pozisyonları, eşleştirme tekilliği ve boşluk sayıları eşleşti.
- `scripts/audit-french-u11-complete.mjs` için bağımsız kaynak, ID, cevap konumu, matching, blank ve üretim kilit denetimi eklendi. GitHub Actions sonuçları ayrıca doğrulanır.
- Dinî ve anadili Fransızca uzman onayı yapılmadı. `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false` korunur; canlı `main` veya Pages deploy'u yoktur.

## 2026-10-14 — U12 100/100 Fransızca taslağı
- U12-S01–S07: **14+14+14+16+16+12+14 = 100/100**.
- İçerik: abdest (wudû), teyemmüm (tayammum), boy abdesti (ghusl), su yokluğu ve kullanılamaması, yüz/kol/baş/ayak uygulamaları, ayet Al-Mâ’ida 5:6, mezhepler arası niyet, başı mesh miktarı ve işlem sırası farklılıkları.
- Toplam temel soru taslağı: **1.200 / 1.500**; U13–U15 için **300** kaldı. Bu üretim onayı değildir.
- U12 teknik ön taraması: **100 soru, 84 seçenekli soru, 36 eşleştirme çifti, 14 fill_blank; 0 ön-tarama yapısal hata**.
- `qa/FRENCH_U12_TRANSLATION_GLOSSARY.json` Fransızca terminoloji eşlemelerini dil ve dinî uzman incelemesi için saklar; alanlara göre ayrı eşlemeler kullanılarak seçenek/kavram çakışmaları önlendi.
- `scripts/audit-french-u12-complete.mjs` ayrı kaynak, ID, cevap pozisyonu, eşleştirme, boşluk ve release kilit kontrollerini CI'de çalıştırır.
- Fransızca anadili ve dinî uzman onayı yoktur; `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false` korunur. main ve canlı Pages değişmedi.

## 2026-10-14 — U13 100/100 Fransızca taslağı
- U13-S01–S07: **14+14+14+16+16+12+14 = 100/100**.
- İçerik: namaz öncesi temizlik, niyet, kıble, ezan, namaz vakitleri, beş farz namazın rekât sayıları, örtünme şartı, abdest/teyemmüm ve sünnet kaynakları.
- Genel Fransızca temel soru taslağı: **1.300/1.500**; U14 ve U15'te **200** soru kaldı.
- İlk denetim: **100 soru, 84 seçenekli, 36 matching çifti, 14 fill_blank, sıfır kaynak/cevap/boşluk şema sapması**.
- **Kaynak içerik riski:** `DEEN-U13-S03-006` ve `DEEN-U13-S06-012` matching sorularında Türkçe/İngilizce kaynakta 4 eşleştirmenin sağ tarafında yalnız 3 benzersiz tanım bulunur. Fransızca çeviride aynı çoğulluk korunmuştur; bu bir çeviri hatası değil ancak eşleştirme motoru ve pedagojik ayırt edilebilirlik için ayrı düzeltme gerektirir. Üretimde oynatılmadan önce kaynak onaylı varyantla onarılmalıdır.
- `qa/FRENCH_U13_TRANSLATION_GLOSSARY.json` terim eşlemelerini ayrı review kaydı olarak tutar, `scripts/audit-french-u13-complete.mjs` CI'da yapısal doğrulamayı çalıştırır.
- Dinî uzman/Fransızca anadili onayı verilmedi, `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false` kilitleri korunur. main/Pages değişmez.
