# DEEN Arapça V2 — 21. aşama ilk 10 dakikalık deneyim

**Durum:** **21. aşamanın ilk 10 dakikalık kullanıcı deneyimi bileşeni tamamlandı ve canlı.** [PR #121](https://github.com/ilgazfindik/DEEN-App/pull/121) merge `012fbbb64ede8c71137183aa197368866d4982b8`; son commit üzerinde [hızlı Chrome #39149828918](https://github.com/ilgazfindik/DEEN-App/actions/runs/39149828918), [kapsamlı QA #39149828919](https://github.com/ilgazfindik/DEEN-App/actions/runs/39149828919), [Companion #39149833755](https://github.com/ilgazfindik/DEEN-App/actions/runs/39149833755) ve [Pages #39150539241](https://github.com/ilgazfindik/DEEN-App/actions/runs/39150539241) başarılı.

## Kodlanan

- Arapça öğrenme yolunda beş dilde küçük, erişilebilir bir **İlk 10 Dakikan** ilerleme paneli.
- İlk girişin başlangıcı, ilk gerçek ders başlangıcı, ilk doğru **yazılı** cevap, ilk bitirilen ders ve ders tamamlanmadan ekrandan ayrılma sayısı; yalnız `deen_arabic_first10_v1` içinde saklanır.
- 600.000 ms sonra yeni olaylar eklenmez. Kullanıcının geçmişte oynadığı derslerden hiçbir "ilk doğru" veya "ilk ders bitişi" verisi uydurulmaz. Mevcut profillerde ölçüm, bu sürümden sonra ilk Arapça girişinde başlar; önceki yaşam boyu ilk giriş anlamına gelmez.
- Ders bitişleri sadece gerçek `saveCompleted()` akışında, doğru cevaplar sadece gerçek soru denetimi geçildiğinde işaretlenir. Öğretici görüntülemek veya ses oynatmak yazılı doğru cevap sayılmaz.
- Yeni kayıt **cihazda kalır**; e-posta, kullanıcı adı, ders metni, soru kimliği, IP, cihaz tanımlayıcısı veya sunucuya gönderilen izleme/analitik olayı barındırmaz.
- Eski XP, para, can, seri, tekrar, sure ilerlemesi, onboarding, Premium kayıtlarına dokunulmaz.

## Doğrulanmış test kapısı

- [x] Gerçek Chrome: ilk Arapça girişi, ilk ders başlama, doğru yazılı yanıt, ders bitirme ve yarıda çıkış.
- [x] Beş dil TR/EN/AR/DE/FR ile 320 px ve RTL.
- [x] 10 dakika sonrasında olayların eklenmemesi; yanlış sesli okuma başarısı iddiası olmaması.
- [x] Hızlı ve kapsamlı regresyon, signed 67 segment + varlık manifesti, merge ve GitHub Pages doğrulaması.

**QA düzeltmeleri:** İlk 10 dakika panelinin eski sınav kartlarının CSS seçicilerini değiştirmemesi için ayrı `.deen-path-first10` sınıfı kullanıldı; testlerde soru kimliği, tekrarlanan yönerge ve hedef Arapça harf birlikte eşleştirildi. İlgili JS/CSS varlıkları SHA-256 ile yeniden imzalandı.

**Sınırlar:** Yerel cihaz geçmişi toplu kullanıcı istatistiği değildir. Ders terk oranı, gerçek öğrenme kazanımı ve dönüşüm iyileşmesi gibi rakamlar, etik ve açık rızaya dayanan gerçek kullanım verisi olmadan ileri sürülemez. Henüz 19 yeni MP3 ve 448 insan uzman onayı sağlanmadı.
