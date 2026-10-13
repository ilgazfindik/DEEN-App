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
