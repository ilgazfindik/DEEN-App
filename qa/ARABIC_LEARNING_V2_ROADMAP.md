# DEEN — Arapça Öğren V2: mini öğreticiler → 600 soru → orta düzey Kur'an okuma
**Plan tarihi:** 2026-10-17
**Durum:** 01–08 tamamlandı. 09 Paket C için 100 özgün hareke/hece sorusu kodlandı; QA ve PR entegrasyonu bekleniyor.
**Son doğrulanan uygulama kod dalı:** main (`e7b17f36304737697436de571fe2f708795f5e03`, sürüm `9441arabicpackb100`).
**Komut protokolü:** Kullanıcı "devam" yazdığında, aşağıdaki **ilk tamamlanmamış adımdan** ilerle. Aynı adımı gereksiz yere tekrarlama.

## Mevcut durum ve sınırlar
- Mevcut öğrenme yolu: **27 mini ders**: 7 harf, 3 hareke/hece, 3 okuma (cezim/şedde/med), 3 kelime, 2 dinleme, 3 anlam, 3 ifade, 3 kalıp.
- **28 harf** müfredatı ve **15 kullanıcı tarafından sağlanan harf MP3'ü** var; kalan 13 harf için güvenilir gerçek MP3 bulunmuyor. Eksik kayıt varmış gibi davranma; cihaz TTS'ini kesin ses garantisi/sertifikalı Arapça okuma olarak gösterme.
- Mevcut Kur'an sureleri, ayet metni, kıraat, eski XP/kalp/ilerleme, yaş profilleri, onboarding, premium akışı ve diğer sekmeler değişmeden kalmalı.
- Arayüz dilleri: TR / EN / AR / DE / FR. Kur'an ayetleri orijinal Arapça kalır. RTL (AR) test edilmeli. İspanyolca ekleme.
- "Orta" hedefi **harekeli Arapça/Kur'an okuma ve kısa ifade çözümleme becerisi**; genel dil yetkinliği B1 veya tecvid uzmanlığı iddia etme.
- Öğretici kutular ders başında yalnızca ilk girişte otomatik açılsın; sonraki girişlerde "Ders Notu" ile tekrar açılabilsin. Öğreticiyi atlamak/yeniden açmak dersin tamamlanmış sayılmasına yol açmaz.
- İlk hedef: **6 pakette 100'er adet, toplam 600 yeni ve doğrulanmış soru.** Seçenek karıştırmaları/yalnızca harf sırası değişimleri ayrı soru olarak sayılmamalı. Yeni sorular mevcut sorularla mükerrer olmayacak.

## Her "devam" için uygulama kuralı
1. Önce bu dosyanın ve ilgili PR/CI'nin **en güncel** hâlini, en son merge edilmiş commit'i oku; sıradaki tek paketi seç.
2. Tek paketi gerçekten kodla: içerik + oyun akışı + gereken testleri aynı değişiklikte uygula. Kullanılmayan JSON metinleri "tamamlandı" diye raporlama.
3. Ayrı dal/PR kullan; CI (release hash, Chrome/mobile, i18n, ilerleme/regresyon) çalıştır. Başarısız test varsa düzelt.
4. Çalışılan adımı bu dosyada **[x]** yap, ilgili commit/PR, sayılar, geçen testler, bilinen açıkları ekle. Geçilmediyse **[ ]** bırak.
5. Canlıya yalnız doğrulanan sürümü al; deploy istendiğinde/önceden mutabık olduğumuz yayın ritminde GitHub Pages sonucu ve `main` commit'ini doğrula. Başarılı değilse deploy olmuş gibi söyleme.
6. Yanıt: "Tamamlanan / Kanıt / Kalan / Sonraki devam" şeklinde kısa, somut; token/aşırı süre riskinde işi küçük PR'lara böl, ilerlemeyi belgeye işle.

## P0 — Öğretici kutu ve gerçek öğrenme akışı
- [x] **01 — Mikro öğretici motoru + ilk 2 pilot ders.** `lessonTip` veri sözleşmesi: title, oneSentence, examples (2–3), optional audioRef, mistakeTip, reviewFlag, locale; 5 dil/RTL, 9:16 erişilebilir kart; ilk girişte göster, "Anladım" kapat, "Ders Notu" ile yeniden aç. Harf 1–2 gerçek ders akışı ve refresh/localStorage eski kayıt QA'sı.
- [x] **02 — Harf dersleri 1–7 öğretici içerikleri.**** Nokta/şekil ayırt etme, ses adı ve bağlantı sınırları; kısmi kayıt olan harflere yanlış ses atama. Her ders 10–20 sn okumalık en çok bir ana kural, 2–3 örnek. 5 locale.
- [x] **03 — Hareke + okuma 8–13 öğreticileri.** Üstün/esre/ötre, cezim, şedde, med; kısa ve uzun ses ayrı anlatılmalı. Harf adı ile harekeli ses birbirine karışmamalı. 5 locale.
- [x] **04 — Kelime, dinleme ve anlam 14–20 öğreticileri.** Birleştirme, adım adım okuma, anlam bağlamı, desteklenmeyen sesin dürüst gösterimi. 5 locale.
- [x] **05 — İfadeler/kalıplar 21–27 öğreticileri.** Kısa örnek, kavram/ayet ayrımı; dinî ve Arapça anlam gözden geçirmesi; 5 locale.

## P1 — Soru motoru ve 600 yeni soru (her pakette 100)
- [x] **06 — Soru motoru V2 ve kalite şeması.** `id, skill, stage, difficulty, prompt, choices, correctAnswer, explanation, locale, audioRef?, source?, distractorRationale`; veri doğrulayıcı, doğru cevap tekliği, Arapça/diakritik, yinelenen soru denetimi. Mevcut soru tipleri ve kayıt anahtarları geriye uyumlu kalacak. Her oturumda havuzdan **8–12 soru**, yanlışlara uygun dönüt; aynı sorunun art arda gelmemesi. Soru sayısını artırınca müfredat ilerlemesini silme.
- [x] **07 — Paket A: +100 harf tanıma.** 28 harfi ayırt etme, doğru harfi seçme, nokta ve benzer şekiller; ses gerektiren soruları yalnız mevcut 15 MP3 ile sınırla; doğru/yanlış şık kendi sesini oynatır; "Kontrol Et" ile notlandırılır. 100 veri + gerçek oynanış QA.
- [x] **08 — Paket B: +100 harfin kelimedeki biçimleri.** Başta/ortada/sonda, bitişmeyen 6 harf, gerçek bağlantı örnekleri. Aynı harfin döndürülmüş kopyası veya yanlış bitişme önerme.
- [ ] **09 — Paket C: +100 hareke ve hece.** Fetha/kasra/damma ayırma, heceleri çözme, harf adı ≠ okunan hece. Ses gerektiren örnekleri yalnız geçerli yeni ses var ise kullan.
- [ ] **10 — Paket D: +100 cezim/şedde/med/tenvin.** Hatalı olmayan Arapça yazım, kısa/uzun ses farkı, tekrarlı pekiştirme.
- [ ] **11 — Paket E: +100 kelime okuma ve oluşturma.** Harf→hece→kelime; düşük zorluktan orta düzeye; doğrulanmış yazılış ve anlam. Rastgele anlamsız diziler öğretme.
- [ ] **12 — Paket F: +100 kısa ifade/Kur'an kelimesi çözümleme.** Kısa, harekeli örnekler; Arapça özgün kalır, sorular/açıklamalar seçilen dile göre. Ses dosyası yoksa yeni kıraat üretme iddiası yok.

## P2 — Kalıcılık, kalite ve yayın
- [ ] **13 — Uyarlanabilir tekrar.** Harf/işaret bazında hata geçmişi, benzer-harf zayıflığı, hatırlama aralıkları; yeni başlayanlara aşırı yük yok. Başarı ölçümü örn. iki farklı günde %80+ (ürün eşiği, test ederek ayarla); eski ilerleme kayıtları korunur.
- [ ] **14 — 5 dil + dini/fonetik içerik QA.** Eksik çeviri/Türkçe sızıntısı, Arapça RTL, harf şekli, diakritikler, cevap indeksi, dinî anlam ve ses eşleştirme; uzman kontrolü gerektiren maddeler etiketlenir, onay sahteciliği yok.
- [ ] **15 — Kullanıcı akışı ve mobil performans QA.** İlk kez/tekrar giriş, yavaş ağ, 320/375px, ses izinleri/MP3, puan-enerji-ilerleme, offline/pwa, yanlış/tekrar dinleme, bölüm geçişi; 600 yeni soruyu en az otomatik örneklem + tümü yapısal/semantik validasyondan geçir.
- [ ] **16 — Kapsam doğrulaması ve yayın.** 27/27 öğretici, 600/600 yeni benzersiz soru, uygun havuzlardan 8–12 soru, 5 dilde test ve gereken CI kontrolü; başarısızsa deploy etme. Başarılı `main` merge ve GitHub Pages dağıtım kaydını doğrula; sürüm/QA raporu yaz.

## Başarı metrikleri
- 27/27 dersin girişinde öğretici (ilk girişte; sonra isteğe bağlı tekrar).
- 600/600 yeni benzersiz, doğrulanmış ve oyun içinde erişilebilir soru; her 100'lük paket kendi QA kanıtını içerir.
- 5/5 dilde yönergeler ve açıklamalar tutarlı, Kur'an metni değişmemiş.
- 28 harfin 15'inde gerçek MP3 var (13 eksik; kullanıcı yeni kayıt göndermedikçe otomatik tamamlandı sayılmaz).
- Bir ders oturumunda 8–12 soru; tekrar çeşitliliği, bilgi geri çağırma ve hata odaklı yeniden çalışma.
- Kritik regresyon: 0; yanlış ilerleme sıfırlaması: 0; sessiz sesi "başarılı" gösterme: 0.

## Bir sonraki "devam" komutunun kesin görevi
**Adım 09 — Paket C QA/main entegrasyonu:** Üstün/esre/ötre için 28 biçim, 6 farklı harf üstünde eşleştirme, Be/Te hecelerinde 33+33 soruyu (34/33/33 =100) bağımsız denetle. 8–10. derslerde >=8 V2 soru ve 5 dil/RTL/ilerleme/kalp güvenliği testleri başarılıysa [x] ve main merge. Cezim/şedde/med/tenvin öğretimi sonraki 10. aşama Paket D'ye aittir.

## Son doğrulanmış ilerleme
- **01:** PR [#101](https://github.com/ilgazfindik/DEEN-App/pull/101), `f07c7d726f0b65103d4135a8c1bb85f134b93c74` main merge; beş dil, RTL, 15 ses, refresh/progress Chrome testi başarılı. Tam uygulama denetimi: [38973328259](https://github.com/ilgazfindik/DEEN-App/actions/runs/38973328259), başarılı.
- **02:** PR [#102](https://github.com/ilgazfindik/DEEN-App/pull/102) üzerinde 3–7. dersler, beş dilde toplam 25 yeni mikro öğretici çevirisi, her biri üç örnek; uyumlu ses kısmi. Hızlı ses/oynanış QA [38975545869](https://github.com/ilgazfindik/DEEN-App/actions/runs/38975545869) başarılı. Geniş denetim [38975541778](https://github.com/ilgazfindik/DEEN-App/actions/runs/38975541778) **başarılı**; son kaynak değişikliği yalnızca bu kanıtı kaydeden dokümantasyondur.
- **03:** PR [#104](https://github.com/ilgazfindik/DEEN-App/pull/104) ile üstün/esre/ötre, ba/ta heceleri, cezim, şedde ve med için 6 yeni öğretici × 5 dil hazır. Harf adı MP3'ü harekeli hece sesi yerine kullanılmıyor. Eski oyun testleri ilk giriş kartlarından ayrıştırıldı; [hızlı QA](https://github.com/ilgazfindik/DEEN-App/actions/runs/38977946893) ve [kapsamlı QA](https://github.com/ilgazfindik/DEEN-App/actions/runs/38977942610) başarılı.
- **04:** PR [#105](https://github.com/ilgazfindik/DEEN-App/pull/105), 14–20 için yedi kart × 5 dil (35 yerel içerik); 14–16 ve 19–20 derslerinin oynanış ekranı bağlandı. 17–18 için altı bağımsız onaylı ses kaydı bulunmadığından dinleme oyunları kasten kilitli. İlk açılış/Ders Notu, 320px RTL, ilerleme ve reload Chrome kontrolü ile [hızlı QA](https://github.com/ilgazfindik/DEEN-App/actions/runs/38979882019) ve [kapsamlı QA](https://github.com/ilgazfindik/DEEN-App/actions/runs/38979882018) başarılı.
- **05:** PR [#106](https://github.com/ilgazfindik/DEEN-App/pull/106), 21–27 için 7 yeni kart × 5 dil. Anlam sıralaması, ifade ve kalıp oyun ekranlarına bağlandı; toplam 27/27 öğretici. İlk giriş/Ders Notu/RTL/320px ve kayıt koruma Chrome QA, eski 20 öğretici regresyonu başarılı. [Hızlı QA](https://github.com/ilgazfindik/DEEN-App/actions/runs/38981342819) ve [kapsamlı QA](https://github.com/ilgazfindik/DEEN-App/actions/runs/38981342925) başarılı.
- **06:** PR [#107](https://github.com/ilgazfindik/DEEN-App/pull/107), `quran-arabic-questions-v2.js` 5 dil veri şeması, atomik paket/benzer soru engeli, denetlenmemiş sesin reddi, 8–12 soru, yanlış gerekçesi ve kayıt korumalı V2. Yazılı havuzu olmayan eski 27 ders yerinde kalır. [Hızlı QA](https://github.com/ilgazfindik/DEEN-App/actions/runs/38982988798) ve [kapsamlı QA](https://github.com/ilgazfindik/DEEN-App/actions/runs/38982988784) başarılı. Otomatik testte 12 test-fikstür sorusu vardır, ürün soru bankasına eklenmemiştir; yeni içerik 0/600.
- **07:** PR [#108](https://github.com/ilgazfindik/DEEN-App/pull/108) ile 100 gerçek V2 sorusu (28 isim→harf, 28 harf→isim, 28 nokta konumu, 16 benzer-gövde) eklendi ve 7/7 harf dersine bağlandı. Her oturum 10 soru. 5/5 locale, doğru cevap, nokta/şekil ailesi, bağımsız 15 MP3 önizleme sınırı ve kayıt bütünlüğü doğrulandı. [Hızlı QA](https://github.com/ilgazfindik/DEEN-App/actions/runs/38984368900) ve [kapsamlı QA](https://github.com/ilgazfindik/DEEN-App/actions/runs/38984368935) başarılı.
- **08:** PR [#109](https://github.com/ilgazfindik/DEEN-App/pull/109), Paket B için 28 ilk + 22 gerçek orta + 28 son + 22 harf bağlantısı: 100 benzersiz V2 soru. Paket A ile toplam 200; 7/7 harf dersi, 5 locale, nokta ve bağlantı kuralı, 6 birleşmeyen harfte sahte orta biçim olmaması, harf-adı MP3'lerini yanlış tekrar kullanmama, mobil RTL/320px, XP-kayıt regresyonu. [Hızlı QA](https://github.com/ilgazfindik/DEEN-App/actions/runs/38985862212) ve [kapsamlı QA](https://github.com/ilgazfindik/DEEN-App/actions/runs/38985862224) başarılı.
- **09 (PR/QA bekliyor):** 28 özgün kısa-hareke biçimini bulma + 6 harfler arası hareke eşleştirme + 33 Be + 33 Te hece eşleştirme, toplam 100 özgün V2 sorusu. 3 dersin (8,9,10) tamamına kayıtlı, beş dil, yanlış seçenek gerekçesi; onaysız hece sesi yok.
- **Kalan:** 09–16. adımlar; 300/600 soru kodlandı, Paket C QA/merge bekliyor. 'Devam' 10 Paket D cezim, şedde, med ve tenvin.
