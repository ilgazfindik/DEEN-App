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

## 2026-10-14 — U14 100/100 Fransızca taslağı
- **Kaynak düzeltmesi:** U14, “Oruç” değil **Namazın Kılınışı / Rükünleri** konularını kapsıyor. İngilizce/Türkçe kaynak ID'leri ve soru anlamları doğrulandı; içerik uydurularak “Oruç”a dönüştürülmedi.
- S01–S07: **14+14+14+16+16+12+14 = 100/100**. Genel temel soru taslağı: **1.400/1.500**, U15'te **100 soru** kaldı.
- Kapsam: iftitah tekbiri, kıyam, kıraat, rükû, secde, rekât, secdeler arası oturuş, son oturuş, hasta/engelli için kolaylıklar, Fâtiha hükmündeki mezhep farklılıkları.
- İlk yapısal tarama: **100 soru, 84 seçenekli, 36 eşleştirme çifti, 14 fill_blank, 0 ön-tarama hatası**. U14 kaynak eşleştirmelerinde tekrar eden sağ taraf saptanmadı.
- `qa/FRENCH_U14_TRANSLATION_GLOSSARY.json` kaynaklara bağlı Fransızca terminolojiyi tutar; `scripts/audit-french-u14-complete.mjs` ayrı otomatik testtir.
- **Staging-only**: `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false`, onay bayrakları false. İnsan dil/din denetimi ve üretim QA yapılmadan merge veya deploy yapılmaz.

## 2026-10-14 — U15 100/100 ve temel soru bankası 1500/1500
- Kaynakla doğrulanan **U15 konusu: Ramazan ve Oruç**. 7 aşama: 14+14+14+16+16+12+14 = **100/100**.
- Ana Fransızca temel soru bankası: **1.500/1.500 U01–U15** kaynak-bağlı **taslak**. Bu durum üretime hazır olduğu anlamına gelmez.
- U15 konuları: sahur/imsak/iftar, unutarak yeme-içme ile kasıtlı bozma arasındaki fark, Ramazan ve Kur’an, takva, kefaretle ilgili mezhep farklılıkları, hastalık/yolculuk, kaza, güzel ahlak.
- İlk yapısal kontrol: **100 soru; 84 seçenekli, 36 eşleştirme çifti, 14 boşluk doldurma; 0 soru/cevap/boşluk şema hatası**.
- U15 `DEEN-U15-S07-013` seçenek çakışması, `abstinence` isim ve `s’abstenir` fiil ayrımıyla çeviri taslağında giderildi. `qa/FRENCH_U15_TRANSLATION_GLOSSARY.json` çeviri sözlüğü korunur.
- `scripts/audit-french-u15-complete.mjs` CI'da kaynak, seçenek indeksi, eşleştirme, boşluk ve release bayraklarını kontrol eder.
- **Engeller hâlâ açık:** Fransızca statik UI kaynakları eksik (önceki envanterde 35/1452), aktif U01 çalışma zamanı varyantları, dinamik UI, sayfa/menü gezinme, locale-switch senaryosu, mobil/Chromium QA, bağımsız anadili Fransızca ve İslami uzman incelemesi. Ayrıca U13 eşleştirmelerindeki kaynak çoğulluk sorunları ayrı çözüm bekler.
- `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false` üretim kilitleri KORUNUR; bu PR draft olup main/Pages'e merge edilmemelidir.

## 2026-10-14 — Fransızca UI P01: temel akışlar (197 yeni anahtar)
- Kaynak: daha önce Almanca QA sırasında çıkarılmış **1.452 benzersiz Türkçe UI kaynağı**. Almanca görüntü metinleri Fransızcaya kopyalanmadı.
- Önceki **35/1.452** UI taslağı üzerine eklenen üç bağımsız paket: `assets/i18n/fr/ui.core-navigation-lesson.staging.json` **71** (gezinme 41 + ders kontrolleri 30); `assets/i18n/fr/ui.core-quran.staging.json` **84** (Kur’an merkezi 35 + sure/ders ekranları 49); `assets/i18n/fr/ui.core-profile.staging.json` **42** (profil, seri, rozet, görev ve öğrenme analitiği).
- Güncel doğrulanmış UI kapsamı **232/1452**, kalan **1220**. Yalnız kaynak envanterindeki statik metinler sayılır; dinamik tarayıcı metinleri ayrıca denetlenmelidir.
- `scripts/inventory-french-ui.mjs` düzeltildi. Eskiden U11–U15'i saymadığından temel soru ilerlemesini eski gösteriyordu; artık **15/15 ünite, 1500/1500 soru**, dört UI dosyası ve tekilleştirilmiş UI anahtarları hesaplanır.
- `scripts/audit-french-ui-core.mjs`: 197 anahtarın özgün Türkçe source-key eşleşmesi, grup sırası, çevirilerin doluluğu, tekrar eden ID, varsa `{token}` koruması ve tüm release-gate bayrakları üzerinde çalışır.
- CI **[GitHub Actions #38476076513 — success](https://github.com/ilgazfindik/DEEN-App/actions/runs/38476076513)**, commit `8614c4c8`: **1500/1500 temel soru**, **232/1452 UI**, **1220 eksik UI**, 12 dinamik risk senaryosu.
- **Kur’an güvenliği:** Bu pakette yalnızca menü, test ve sure çalışma kontrol metinleri çevrildi. Arapça ayetler, kıraat kayıtları ve Türkçe mealler değişmedi; Fransızca meal, lisans ve dinî uzman kontrolü olmadan canlıya bağlanmaz.
- **Sonraki UI alanları:** ders giriş/sonuç/seri/XP geçişleri; premium-mağaza; detaylı Kur’an ezber/review; diğer 1.220 bilinen kaynak; gerçek Chromium dil sızıntısı ve taşma taraması.
- **Yayın engeli sürüyor:** `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false`; bütün yeni UI paketlerinde `release_ready=false`. Bu bir üretim deploy'u değildir. Ayrıca U13 kaynak matching çakışmaları açık.

## 2026-10-14 — Fransızca UI P02 — ders döngüsü (189 yeni metin)
- **197 yeni önceki UI P01** paketi üzerine **189 yeni** kaynak-bağlı Fransızca staging çevirisi eklendi.
- `assets/i18n/fr/ui.lesson-intro-feedback.staging.json`: **66** (35 aşama tanıtımı + 31 cevap geri bildirimi, sıralama, ipucu, kısa hafıza testi).
- `assets/i18n/fr/ui.lesson-results.staging.json`: **94** (başarı/sonuç, XP, bölüm, mini ders, ünite finali, ödül sandığı, adaptif tekrar ve sonraki adım).
- `assets/i18n/fr/ui.streak-xp.staging.json`: **29** (seri/XP kuralları, seri koruması, hafta günleri, hareketi azaltma ve dokunsal geri bildirim).
- Böylece ilk **35**, P01 **197** ve P02 **189** olmak üzere **421/1452** bilinen UI anahtarı taslak olarak çevrildi; **1031** statik anahtar kaldı.
- `scripts/inventory-french-ui.mjs` üç yeni staging paketini sayar ve `421/1452` kontrol eder; `scripts/audit-french-ui-lesson-flow.mjs` 189 metin için kaynak sırası, benzersiz anahtarlar, doldurulmuş metin, `{token}` yer tutucularının korunması ve üretim bayraklarını test eder.
- CI referansı: [GitHub Actions #38476661279](https://github.com/ilgazfindik/DEEN-App/actions/runs/38476661279) (sonuç ayrı doğrulanır).
- Bu değişiklikler **yalnız staging**: Kur’an'ın Arapça metni, kıraat ve meal verileri; eski dillerin runtime'ı; release bayrakları; canlı GitHub Pages değiştirilmedi. Önceki U13 eşleştirme kaynak hataları ve uzman incelemeleri beklemektedir.
- Sonraki UI paketleri: premium/mağaza, ayrıntılı Kur’an ezber kontrolleri, genişletilmiş ünitelere ait kavram/başlıklar ve kalan ekranlar. Mobil/Chromium dil değiştirme ve taşma kontrolleri release öncesi zorunludur.

## 2026-10-14 — Fransızca UI P03 — Premium, Kur’an kontrolleri ve sure adları
- Bu tur, mevcut **421/1452** UI taslağına **184 benzersiz yeni Türkçe UI kaynak anahtarı** ekledi. Güncel staging: **605/1452 (%41,67)**, eksik **847**. Tamamlanan 1500/1500 temel soru taslağı korunur.
- `assets/i18n/fr/ui.premium-shop.staging.json`: **41** (25 hedef/Premium özelliği + 10 mağaza/ödül + 6 içerik ve ödeme sınırı açıklaması). Gerçek ödeme veya abonelik eklenmedi; dinî öğrenme içeriğine paywall tanımlanmadı.
- `assets/i18n/fr/ui.quran-navigation-game.staging.json`: **62** (46 Kur’an gezinmesi/araçları + 16 ezber oyunu/self-check uyarısı).
- `assets/i18n/fr/ui.quran-learning-surahs.staging.json`: **81** (49 ayet öğrenme/ezber akışı ve doğrulanmamış içerik güvenlik mesajı + 32 sure adının Fransızca Latin harfli **inceleme bekleyen gösterimi**). Sure adları dinî uzman/transliterasyon editörü tarafından teyit edilmeden canlıya alınmaz.
- Kur’an ayetlerinin Arapça aslı, kıraat sesleri, word-by-word kayıtları, mevcut Türkçe meal ve kaynak verileri **değiştirilmedi**. Fransızca meal veya telaffuz hükmü üretilmedi. Yeni metinlerin tümü staging ve hak/uzman onayı bekliyor.
- `scripts/inventory-french-ui.mjs` artık 10 UI dosyasından benzersiz anahtar sayar, 605/1452 ve 847 eksik bekler. `scripts/audit-french-ui-premium-quran.mjs` kaynak anahtar sırası, grup sayısı, boş metin, tekrar, varsa `{token}` şablonları, sure adları onay bayrakları ve üretim korumalarını test eder.
- CI referansı: [French localization GitHub Actions #38477167503](https://github.com/ilgazfindik/DEEN-App/actions/runs/38477167503) (sonuç ayrıca doğrulanır).
- **Üretim kilitleri korunur:** `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false`. PR #57 taslaktır, `main` ve Pages deploy değişmedi. U13 matching kaynak hataları, U01 runtime varyantları, dinamik UI, gerçek Chromium/mobil QA, Fransızca editör, dinî uzman ve lisans kontrolleri ayrıca kapanmalıdır.
- Sonraki öncelik: 847 kalan statik UI kaynağı içinde genişletilmiş ünite başlıkları ve tekrarlama/gerçek ders ekranları; dinamik sayılar, çoğul ve mobil metin sızıntısı taraması.

## 2026-10-14 — Fransızca UI P04 — 238 ünite/konu etiketi + 9 dinamik şablon
- İlk üç UI paketi **605/1452** üzerine, **238 benzersiz statik UI Türkçe kaynak anahtarı** için Fransızca taslak eklendi. Genel **843/1452 (%58,06)**, **609 statik kaynak anahtarı kaldı**.
- `assets/i18n/fr/ui.reference-batch-01.staging.json`: **112** dinî kavram, ibadet, namaz, abdest, oruç ve ünite/konu başlığı; var olan 8 çeviri tekrar yazılmadı.
- `assets/i18n/fr/ui.reference-batch-02.staging.json`: **120** U01–U02 iman, tevhid, ahlak, yaratıcı–yaratılan ve günlük yaşam konu başlığı.
- `assets/i18n/fr/ui.real-lesson-extra.staging.json`: **6** daha önce eksik olan gerçek ders başlıkları/etiketleri.
- `assets/i18n/fr/ui.dynamic-preview.staging.json`: **9** tekrarlanan `{n}`, `{unit}`, `{topic}` gibi parametreleri koruyan **henüz çalışma zamanına bağlanmamış** dinamik çeviri önerisi. Bunlar **843/1452 statik envanterine sayılmadı**. Uygulamada gerçekten çalıştıklarını söylemek için uygun locale adapter, tekil/çoğul testleri ve DOM taraması gerekir.
- Terminoloji riskleri `doğru`, `Vakit`, `İhlâs` (sure), `İhlas` (samimiyet), mesh ve Fâtiha hükmü alanlarında işaretlendi. Çeviri **dinî uzman/anadili Fransızca onayı** değildir. Önce kaynak-soru bağlamına göre teyit edilecek.
- `scripts/inventory-french-ui.mjs` 13 statik staging paketini sayacak biçimde genişletildi. `scripts/audit-french-ui-topic-batches.mjs`: kaynak ID/sıralama, çakışma, yer tutucu çokluğu, Türkçe karakter kalıntısı, üç paket 112+120+6 ve bağımsız dinamik 9 şablonun üretim kilidini kontrol eder.
- CI: [French localization staging workflow #38477794557](https://github.com/ilgazfindik/DEEN-App/actions/runs/38477794557); bağımsız başarı doğrulaması rapora göre yapılmalıdır.
- **Üretim kapısı kapalı:** `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false`. `main`/GitHub Pages değişmedi; Arapça ayetler, kıraat ve meal kaynakları dokunulmaz. U13 eşleştirme kaynak hataları, aktif U01 varyantları, dil sızıntısı, mobil ve uzman QA hâlâ bekliyor.
- Sıradaki UI: referans-batch-03–08, gerçek ders/sure/dinamik DOM ve sonrasında uzman değerlendirmesi.

## 2026-10-14 — Fransızca UI P05 — 240 U03–U05 konu başlığı
- Önceki **843/1452** statik UI referansı üzerine **240** yeni kaynak-bağlı Fransızca konu etiketi eklendi: toplam **1083/1452** (%74,59), **369** statik kaynak kaldı.
- `assets/i18n/fr/ui.reference-batch-03.staging.json`: **120** Şehadet, tevhid ve risalet, dinleme/kelime sıralama etkinliği, günlük hayat örnekleri ve beş şartın giriş başlıkları.
- `assets/i18n/fr/ui.reference-batch-04.staging.json`: **120** İslam'ın beş şartı (şehadet, namaz, oruç, zekât, hac), altı iman esası, karşılaştırma/tekrar ve mini challenge başlıkları.
- Sözlükten otomatik bir başka dilin görüntü metinleri kopyalanmadı; özgün Türkçe kaynak ID'lerinden bağımsız Fransızca taslak üretildi. Fıkıh/kelâm açısından `Lâ ilâhe illallah`, şehadetin anlamı, kader/kaza, hac yükümlülüğü ve iman esasları **insan dinî/dilsel incelemesi bekler**.
- `scripts/inventory-french-ui.mjs` 15 ayrı statik UI taslak dosyasını sayar: **1083/1452**, kalan **369**. Önceki **9 dinamik şablon** ayrı ve hâlâ runtime’a bağlı değil; statik sayıya eklenmez.
- `scripts/audit-french-ui-reference-batches-03-04.mjs` kaynak ID sırasını, çakışmaları, boşlukları, `{token}` interpolasyonunu, anlam açısından riskli konu anahtarlarının review bayrağını ve üretim kilitlerini kontrol eder.
- CI: [GitHub Actions #38478173600](https://github.com/ilgazfindik/DEEN-App/actions/runs/38478173600) (başarı sonucu ayrıca doğrulanır).
- Üretim hâlâ kapalı: `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false`. Arapça ayet, orijinal kıraat, Kur’an meal kaynakları ve diğer dillerin üretim altyapısı değiştirilmedi. Canlı Pages'e aktarım yok.
- Kalan: batch 05–08 ve diğer UI kaynakları, U01 aktif varyantları, U13 eşleştirme kaynak problemi, dinamik tekil/çoğul ve gerçek Chromium/mobil denetimleri, Fransızca/dinî uzman onayları.

## 2026-10-14 — Fransızca UI P06 — 240 U05-U15 ve onboarding
- Önceki statik UI taslakları **1083/1452**; iki yeni referans paketinde **120+120 = 240** anahtar çevrildi. Güncel envanter: **1323/1452 (%91,12)**, **129 anahtar kaldı**. Temel soru taslakları 1500/1500 değişmedi.
- `assets/i18n/fr/ui.reference-batch-05.staging.json`: **120** konu ve etkinlik etiketi. U05 iman/ibadet ayrımları, U06 melekler, vahiy ve Iblîs ayrımı, U07 ilahi kitaplar, Kur’an’ın rehberliği/korunması; uzman incelemesi bekleyen dinî iddialar ayrı `review_required_keys` ile işaretli.
- `assets/i18n/fr/ui.reference-batch-06.staging.json`: **120** başlık. Peygamberlik, ahiret, kader-kaza, ibadet, abdest, namaz, oruç; ayrıca 34 onboarding/mascot/günlük süre ve tanıtım metni. İlk taslakta 1 satır eksik olduğu tespit edilip kayıt öncesi “Namaza hazırlık senaryoları” çevirisi eklendi; 120/120 tamamlandı.
- **Bağlam düzeltmesi:** `assets/i18n/fr/ui.reference-batch-01.staging.json` içinde Türkçe `doğru` anahtarının İngilizce referansı “upright” olduğu için önceki Fransızca `debout` ifadesi **`droit`** olarak düzeltildi. Anahtar dinî/dilsel inceleme bayrağında kaldı; başka bağlamlarda `correct` anlamıyla karıştırılmamalı.
- `scripts/inventory-french-ui.mjs` artık 17 statik FR paketini denetliyor: 1323/1452, kalan 129. `scripts/audit-french-ui-reference-batches-05-06.mjs` özgün Türkçe anahtarlar, dizi sırası, çakışma, interpolasyon, boş değerler, kritik `doğru` düzeltmesi ve release kilitlerini denetliyor.
- CI bağlantısı: [French localization staging workflow #38478876522](https://github.com/ilgazfindik/DEEN-App/actions/runs/38478876522); tamamlandığında gerçek sonuç teyit edilir.
- Tüm yeni çeviriler **staging-only**. `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false` sabit. Canlı Pages, ana dal, Arapça ayetler/sesler/meal verileri değişmedi.
- Sıradaki P07: referans-batch-07'deki 119 benzersiz anahtar + batch-08'deki 10 anahtar ile **129 statik kalan**. Dinamik UI, U01 runtime varyantları, U13 matching kaynak hataları, gerçek Chromium/mobil dil QA, Fransızca editör ve dinî/izin onayları üretim için hâlâ gerekli.

## 2026-10-14 — Fransızca UI P07: 1452/1452 bilinen statik kaynak anahtarı için çeviri taslağı
- Önceki staging **1323/1452** üzerine **119** benzersiz `ui.reference-batch-07.staging.json` + **10** `ui.reference-batch-08.staging.json` kaynağı çevrildi. Böylece **1452/1452 bilinen statik UI kaynak anahtarı için Fransızca taslak mevcut**; bu, ekranlarda yüzde yüz Fransızca bulunduğu veya yayın kalitesi/onayı anlamına gelmez.
- Batch 07: kısım/ünite özeti, dinî öğrenme sınırlamaları, seri/rozet/XP, P yönetici panelindeki geçme-sıfırlama komutları, Kur’an yönetici onayı/kaynak/meal etiketleri, son ünite. Kaynakta `Ünite bazında` daha önce çevrildiğinden yinelenmedi (**120 kaynak, 119 yeni**).
- Batch 08: ilk kısım finali, sınav kilidi, geçerli mezhep farklılıklarını yanlış puanlamama mesajı ve **6 Latin harfli sure adı** (Al-Fâtiha, Al-Falaq, An-Nâs, Al-Mâ‘ûn, Ash-Sharh, Az-Zalzala); sure adlarının yazımı/transliterasyonu **dinî ve Fransızca uzman incelemesi** bekliyor.
- `scripts/inventory-french-ui.mjs` bilinen 1452 benzersiz statik Türkçe anahtar üzerinden eksik sayısını **0** doğrular. `scripts/audit-french-ui-final-static.mjs` son iki batch'in kaynak anahtar/sıra, yineleme, interpolasyon, terminoloji onay bayrakları, Arapça ayet koruma notları ve üretim kilitlerini ayrıca sınar.
- Üretim runtime'ı **çalıştırılmadı / etkinleştirilmedi**. Ayrı `ui.dynamic-preview.staging.json` içindeki 9 dinamik şablon hâlâ runtime'a bağlı değildir. Kullanıcıya görünen değişkenler/çoğullar, U01 aktif runtime varyantları, U13 kaynak eşleştirme kusurları, Türkçe sızan gerçek DOM, mobil taşmalar, bağlantı, ses, Kur’an mealleri, uzman onayı ve içerik lisansları kontrolü üretimden önce zorunludur.
- CI denetimi: [GitHub Actions #38479249924](https://github.com/ilgazfindik/DEEN-App/actions/runs/38479249924) (sonuç koşum tamamlandığında doğrulanır).
- Yayın kilitleri: `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false`. PR #57 draft, `main` ve GitHub Pages'e aktarılmadı. Arapça ayetlerin özgün metinlerine ve kıraat kayıtlarına müdahale edilmedi.

## 2026-10-14 — U01 Fransızca canlı runtime: 84/84 + kayıtlı varyantlar 20/20
- Özgün Türkçe kaynakla eşleştirilen **84 canlı U01 soru** `assets/i18n/questions/fr/runtime/staging/U01-S01.live.json`…`U01-S07.live.json` içinde **7 × 12 soru** olarak yazıldı; seçim, eşleştirme, doğru-yanlış, boşluk doldurma, senaryo, aykırı seçeneği bulma türlerinin her birinden **14** soru içerir.
- Ders öğretim kartlarının (`teaching_card` içindeki eyebrow/title/body/memory alanlarının) **24/24** Fransızca metni taslak olarak kaydedildi.
- Kaynak bankasındaki **20 kayıtlı runtime varyantı** `assets/i18n/questions/fr/runtime/staging/U01.variants.json` dosyasında ayrı tutuldu. Bunların **8'i temel sorularla aynı ID'yi** kullanır; ID aynı olsa dahi kaynağın soru metni ve cevap bankası farklı olabildiği için birleştirilmediler.
- `scripts/audit-french-u01-live-runtime.mjs` her canlı soru için kaynak/ID, sıralama, aktivite tipi, doğru cevap indeksi, matching çiftleri, boşluk işaretleri, öğretim kartı alanları, çeviri kalıntısı ve release bayraklarını denetler.
- `scripts/audit-french-u01-stored-variants.mjs` 20 varyantta kaynak/cevap bire bir eşleşmesini, kaynak bankasıyla ID çakışan 8 öğenin *ayrı varyant kaydı* olduğunu ve doğru seçenek indeksinin korunmasını denetler.
- CI: [French staging workflow #38480464983](https://github.com/ilgazfindik/DEEN-App/actions/runs/38480464983) (sonuç doğrulaması ayrıca).
- **Kalan U01 çalışma zamanı katmanı:** `assets/i18n/questions/en/runtime/U01.legacy-renderer.json` içindeki **100 eski gösterici kaydı** Fransızca staging'e henüz aktarılmadı. Bunların 100'ü de temel soru ID'leriyle çakışır; bazı soru metinleri ve 7 seçenek bankası değişmiştir. Yalnız ID'ye göre yer değiştirilmemeli.
- Önceki statik `1452/1452` ve temel soru `1500/1500` **taslak kapsamı** korunur. Buradaki 84+20 kaydı 1500 baz soruya ekleyip benzersiz soru sayısıymış gibi göstermek yanlıştır.
- Bütün yeni runtime kayıtları `release_ready:false`, `verified_by_religious_expert:false`, `native_reviewer_approved:false`; üretim `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false`. **Tarayıcıda Fransızca oynatım henüz test edilmedi ve `main`/Pages deploy edilmedi.**
- Sonraki adımlar: 100 legacy gösterici varyantı ile kaynak/cevap/fill farklarını çevir; U13'teki iki eşleştirme kusurunu dinî uzman onaylı kaynakla düzelt; Fransızca dinamik/premium/Kur'an arayüz entegrasyonu, mobil/Chromium QA, anadili ve uzman/hak kontrolleri.

## 2026-10-14 — U01 Fransızca legacy gösterici katmanı: 100/100 kaynak-bağlı taslak
- `assets/i18n/questions/en/runtime/U01.legacy-renderer.json` ile temel bankanın **100/100 soru ID'si çakışıyor**, ancak soruların **100/100 görünür soru metni farklı**; **7/100** kayıtta ayrıca `options_tr` seçeneği değişmiş, **1/100** kayıtta kaynak boşluk gösterimi temel bankadan farklı. Kaynak açıklaması, soru türü, `correct_answer`, eşleştirmeler ve sequence alanları değiştirilmedi.
- `assets/i18n/questions/fr/runtime/staging/U01.legacy-renderer.json` içine **100 Fransızca legacy soru cümlesi** çevrilip yazıldı; 7 farklı seçenek bankası ayrıca çevrildi. Geri kalan açıklama, topic, stage_title, seçenek, doğru cevap ve matching çevirileri **aynı Türkçe kaynak alanlarına sahip onay bekleyen Fransızca temel staging taslağından** yeniden kullanıldı. Dolayısıyla aynı ID'li paketler çalışma zamanı scope'una göre ayrılmalı.
- Bağımsız `scripts/audit-french-u01-legacy-renderer.mjs` testi: Türkçe kaynak alanlarının birebir eşitliği, ID ve soru sırası, **100 farklı soru**, **7 farklı seçenek bankası**, **1 farklı blank yapısı**, **87 seçenekli kayıt**, **45 eşleştirme çifti**, **8 fill-blank**, doğru cevap indeksi, tekrar seçenekleri, gerçek kaynak tipi, release gate ve başka alanların değişmemesi; 0 yapısal hata.
- İlk CI çalışması bir **yanlış pozitif** verdi: soru içindeki özgün **Ayşe özel adını** çevrilmemiş Türkçe UI metni olarak işaretliyordu. Test yalnız `Ayşe` özel adını istisna tutacak şekilde onarıldı. Ayrıca `se « soumis »` gramer hatası, kaynak cevabı koruyan `être « soumis »` ile düzeltildi.
- [**GitHub Actions #38480945934 — SUCCESS**](https://github.com/ilgazfindik/DEEN-App/actions/runs/38480945934), commit `b0da0906cfddb0be5ee738dafa03aa76c6a8236a`: legacy 100/100, aktif U01 84/84, kayıtlı varyantlar 20/20, statik UI 1452/1452, temel sorular 1500/1500 — yapı denetimleri geçti.
- **Üretim yayını yapılmadı:** tüm U01 runtime Fransızca kayıtları `release_ready:false`, dinî ve anadili Fransızca review bayrakları false; `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false`.
- **Sıradaki blokajlar:** U13'teki iki kaynak matching çakışması, dinamik `{n}`/tekil/çoğul runtime entegrasyonu, Fransızca UI ve soru katmanlarının izole test ortamında bağlanması, gerçek tarayıcı/mobil dil değişimi ve doğru cevap/locale sızıntısı testleri, sure transliterasyon/veri lisansı, dinî ve anadili Fransızca uzman onayı. Yapısal başarı **oyun içi %100 Fransızca veya yayın hazır** anlamına gelmez.

## 2026-10-14 — U13 kaynak tekrarı / Fransızca eşleştirme belirsizliği (taslak düzeltmesi)
- Kök neden: `DEEN-U13-S03-006` ve `DEEN-U13-S06-012` kaynak matching sorularının her birinde **4 kart / sadece 3 ayrı sağ taraf tanımı** vardır; öğle ve yatsı farzı için iki kez `4 rekât` geçmektedir. Bu iki ibadetin farz rekât sayısını birbirinden farklı göstermek yanlış olur. Mevcut İngilizce tarayıcı testinin eşdeğer metinleri desteklediği kaydedildi; bu müdahale ispatlanmış bir runtime donması değil, **pedagojik ayırt edilebilirlik** düzeltmesidir.
- `assets/i18n/questions/fr/staging/U13-S03.json`, `U13-S06.json` içinde yalnızca ilgili soruların **Fransızca görünür** eşleştirme yanıtları, 4 rakʿât bilgisi korunarak `... midi (dhohr)` ve `... soir (‘ichâ)` ile farklılaştırıldı. S03'ün tayammum üzerine yanlış bağlamdaki gösterim açıklaması, sorunun namaz vakitleri/rekât içeriklerine uygun geçici Fransızca açıklamayla değiştirildi. **İki sorunun `source` Türkçe alanları ve soru ID'leri değiştirilmedi**; Fransızca `expert_approved=false`, `native_reviewer_approved=false`, `release_ready=false`.
- `scripts/audit-french-u13-complete.mjs` içinde yalnızca bu **iki ID için**, **Türkçe 3 benzersiz kaynak tanımına karşı Fransızca 4 benzersiz görünür tanıma** izin verilip **tam bu sayı zorunlu kılındı**; diğer tüm matching sorularında kaynak kardinalite denetimi aynen sürüyor.
- Bağımsız `scripts/audit-french-u13-unique-matching.mjs` 100 soru içinde U13'ün **9 matching sorusu / 36 çiftini** tarayıp Fransızca **0 tekrar**, Türkçe **2 tekrar** koşulunu doğrular. CI: [GitHub Actions #38481534259 — SUCCESS](https://github.com/ilgazfindik/DEEN-App/actions/runs/38481534259).
- `qa/FRENCH_U13_MATCHING_SOURCE_REPAIR_PROPOSAL.json` Türkçe özgün kaynak, İngilizce/Arapça/Almanca uyarlamalar için yayın öncesi onaylanacak ayrı düzeltme önerisini içerir. Bu kaynak/dil dosyalarına müdahale edilmedi.
- **Açık kapılar:** Dinî uzman doğrulaması, anadili Fransızca editörü, bütün dillerin kaynakla eşzamanlı onarımı, gerçek browser matching/locale-switch mobil testi, U01 runtime ekran entegrasyonu ve dinamik UI; buna kadar PR taslak, `fr.global_qa=blocked` ve `fr.question_data=missing` korunuyor. Yapısal test başarısı **canlıda görünür düzeltme demek değildir**.
