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
