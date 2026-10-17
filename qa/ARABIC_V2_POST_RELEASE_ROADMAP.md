# DEEN Arapça V2 — Yayın sonrası kalite planı

**Başlangıç:** 2026-10-17. Önceki [16 aşamalı yol haritası](ARABIC_LEARNING_V2_ROADMAP.md) tamamlandı; bu belge yeni bağımsız takip akışıdır.

**Devam protokolü:** Kullanıcı `devam` dediğinde ilk açık aşamayı al. Ses bulunmayan aşamada ses varmış gibi ilerleme verilmez; o anda tamamlanabilir QA/pedagoji işine geçilir. Her işlem PR, commit, gerçek CI ve yayın kanıtıyla kapatılır.

## Öncelik sırası

- [x] **17 — Eksik 19 ses için teslim ve teknik QA.** [PR #118](https://github.com/ilgazfindik/DEEN-App/pull/118). 13 harf adı ve 6 dinleme klibinin birebir hedef/isim listesini yayınla. SHA-256, dosya formatı, aynı dosyanın kopyalanması, eski 15 sesin korunması ve onaysız içeriğin açılmaması testleri. Yeni gerçek MP3 geldiği iddia edilmeyecek. [Kayıt listesi](ARABIC_V2_STAGE17_AUDIO_INTAKE.md).
- [ ] **18 — Gerçek ses kaydı kabulü (harici dosyalara bağlı).** Kullanıcı eksik MP3'leri sağladığında ses başına hak ve telaffuz kanıtı topla; bağımsız Arapça öğreticisi kontrolü, gerçek cihaz Chrome oynatması, hash/cache/manifest yayın katmanını doğrula. Gelmeyen sesi atla, dinleme derslerini sahte şekilde açma. Altyapı hazır olsa bile bağımlılık karşılanmadan [x] yapma.
- [ ] **19 — 448 uzman inceleme kalemi.** 14. aşamanın mevcut otomatik sınıflandırmasından insan için çıkarılabilir inceleme envanteri oluştur; dinî/ayet anlam, fonetik ve ses hakları ayrı tablolar; gerekçeli kabul/düzeltme/reddetme alanları. Otomatik geçiş bağımsız dinî onay değildir. [Uzman devri yönergesi](ARABIC_V2_STAGE19_EXPERT_REVIEW.md). PR #119 kapsamında otomatik 448 görev dışa aktarıcı ve CI kontrolleri eklendi; son QA ve merge kanıtı bekleniyor.
- [ ] **20 — Okuma becerisi ölçümü.** Ses dosyası gerektirmeyen bir ön test–son test tasarla; yeni soru üretimine dayanmadan 600 soruluk havuzda saklı tekrar sorularıyla harf, hareke, kelime, ifade becerisini ayrı ölç. XP/kalp/ilerleme kaydını bozmadan özgün öğrenme kazanımı ve tekrar ölçümü; beş dil/RTL/320px ve düşük ağ senaryoları.
- [ ] **21 — Kullanıcı akışı iyileştirme.** İlk 10 dakika, ilk doğru okuma, öğrenilen beceriler ve terk noktalarını gizliliği koruyan ölçüm planına bağla. Gerçek kullanım verisi gelmeden artış rakamı veya öğrenme verimliliği iddia etme.

## Son ilerleme\n\n- **17 — Yayında:** [PR #118](https://github.com/ilgazfindik/DEEN-App/pull/118) → `854ae61963284610bde0b2282415431cfe09b0de`. [GitHub Pages #39043123659](https://github.com/ilgazfindik/DEEN-App/actions/runs/39043123659) başarılı. 19 hedeften 0 kayıt ulaştı, hiçbir otomatik ses onayı verilmedi.\n- **19 — QA adayı:** 448 mevcut insan inceleme işaretinden üç kategori CSV + tam JSON oluşturuluyor; hiçbiri insan tarafından onaylanmış değildir.\n\n## Yayın sınırları

- 28 harften yalnız **15 orijinal harf MP3** mevcut; yaratıcı tarafından onaylanmış önizleme, bağımsız fonetik tasdik değil.
- 17. ve 18. dersin altı bağımsız klibi kayıt/izin/telaffuz incelemesine bağlıdır; hazır değildir.
- **448 uzman inceleme işareti** uzman tarafından onaylandı demek değildir.
- Uygulamanın 27 öğretici, 600 canlı soru ve beş dil altyapısı korunur; Kur'an ayetleri özgün Arapça kalır.
- 17. aşamanın hızlı + kapsamlı CI'si geçmeden main'e merge veya canlı yayın yapma. Yalnızca uzman tarafından sağlanmış örnekler bir sonraki gerçek ses entegrasyonu PR'sına girer.
