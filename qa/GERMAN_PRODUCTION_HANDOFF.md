# DEEN — Almanca üretim entegrasyonu / yayın devri

**Entegrasyon PR'ı:** [#55](https://github.com/ilgazfindik/DEEN-App/pull/55)
**Durum:** Kod bağlantısı oluşturuldu; `main` veya canlıya dağıtım YOK. İnsan onayı kilitleri kapalı.

## Uygulanan bağlantılar
- `assets/i18n/boot.js`: Gerçek DEEN başlatma akışında de için zorunlu onay kontrolü, SHA-256 doğrulanmış dinamik üretim köprüsü. İzole localhost sentetik QA, mevcut gerçek tarayıcı testini etkilemeden ayrı tutulur.
- `assets/i18n/german-ui.production.mjs`: 13 kaynak eşleşmeli Alman arayüz paketini ve İngilizce anahtar referansını SHA-256 ile doğrular, metin arayüzü ve soru sonrası geri bildirimini yalnız doğrulanmış soru kaynağına göre oluşturur. Cevap şıkları ve Arapça metin genel arayüz çevirisinin dışındadır.
- Aynı üretim köprüsü, 90 kaydı kaynak Arapça metin/ayet/ses kimliğiyle doğrulanan ve tüm uzman/hak alanları onaylanmış Almanca anlam paketini bağlar. `release/v9.9.3-direct/segment-49.txt` anlam testlerini bu kaynağa yönlendirir; onaysız durumda Almanca anlama/finale geçilmez, Türkçe meal gösterilmez.
- `scripts/prepare-german-production-config.mjs`: 114 soruluk paket (1.704 varyant), 13 UI paketi, 90 ayet ve SHA-256 aday manifestini hazırlar. Varsayılan çalıştırma **yalnız kilitli taslak JSON** üretir. `--apply` için bağımsız uzman onayı kanıtları gerekir.
- `scripts/test-german-production-bridge.mjs`: kapalı üretim bayrakları, hash'ler ve kaynak eşleşmesini denetler.
- `scripts/test-german-approved-bridge-simulation.mjs`: **yalnız geçici test ortamında** onay simüle ederek asıl üretim köprüsünü ve 90 ayet + cevap geri bildirimi bağlantısını sınar. Gerçek onay kaydı değildir.

## Yayını tamamlamak için sizin sorumluluğunuzdaki işlemler
1. Anadili Almanca olan gözden geçiren, dinî içerik uzmanı ve kaynak/hak yetkilisi; **1.704 soru varyantı**, **1.452 UI anahtarı**, **90/90 ayet anlamı** için gereken incelemeyi bitirip kimlik/tarih/kanıt kayıtlarını oluşturmalı. Mobil iOS/Android kabul testi ayrı kaydedilmeli.
2. Onay JSON dosyasını dış kaynak belgelerle oluşturun. Gerekli kök alanlar:
   - `native_german`, `islamic_subject_expert`, `rights_clearance`, `mobile_acceptance`: her biri `{ "approved": true, "reviewer": "<gerçek denetçi>", "date": "YYYY-MM-DD" }`
   - `reviewed_question_versions: 1704`
   - `reviewed_ui_keys: 1452`
   - `reviewed_ayah_keys`: Gerçekten incelenmiş **90/90** `surah:ayah` anahtarı (liste `assets/i18n/quran/de/ayah-meanings.staging.json` içindeki `translations` anahtarlarıyla birebir aynı).
   - `reviewed_bridge_sha256`: güncel `content-support.json` içindeki `languages.de.production_bridge_sha256` değeri.
3. Önce `node scripts/prepare-german-production-config.mjs` çalıştırın. Taslak `qa/GERMAN_PRODUCTION_CONFIG_CANDIDATE.json` dosyasını kontrol edin. **Eksik onay varken `--apply` çalıştırmayın.**
4. Tüm onaylar gerçek ve kayıtlıysa `node scripts/prepare-german-production-config.mjs --apply --approval-file <onay-dosyası.json>` çalıştırın. Bu işlem 90 onaylı anlamın ayrı sürümünü ve release manifestini üretir. Onayları kendi kendine vermez; operatörün sağladığı kanıtı ön koşul olarak kullanır.
5. `node scripts/build-release-manifest.mjs` ile `index.html` başlangıç hash'lerini yeniden üretin; `node scripts/build-release-manifest.mjs --check` çalıştırın. Yeni dağıtımda BUILD/service worker sürümünü yükseltin, tüm regresyonları ve gerçek telefon testlerini doğrulayın.
6. PR #55'in yığılı hedef dallarını `main` ile uzlaştırın. Kaynak onayı ve tüm CI yeşil olmadan birleştirmeyin. GitHub Pages deploy sonrasında Almanca baştan sona tıklama ve çevrimdışı ses testlerini yeniden yapın.

### Değişmeyen güvenlik koşulları
- İlk sürümde `de.question_data=missing`, `de.global_qa=blocked`, `de.religious_expert_approved=false`.
- Almanca kaynak verisi Türkçe/İngilizce soru veya meal ile sessizce tamamlanmaz.
- Kur'an Arapça ayetleri ve 90 özgün ses kimliği değiştirilmedi.
- PR çalışma dalında olması **canlı deploy yapıldığı anlamına gelmez**.
