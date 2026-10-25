# DEEN Arapça V2 — 17. adım: Ses kayıt teslim ve kabul listesi

**Durum:** Yeni ses kaydı eklenmedi. Bu iş, eksik **13 harf adı** ve **6 bağımsız dinleme klibi** için teknik kabul/inceleme kapısını hazırlar. Kullanıcıya dinleme dersi açılmaz; mevcut 15 harf MP3'ü korunur.

## A. Harf adı sesleri — 13 MP3

Bu dosyalarda **harf adı** net okunmalı; harekeli hece sesi veya Kur'an'dan bir kelime kaydı ile değiştirilmemeli. Dosya adları birebir aşağıdaki gibi olmalı.

| Harf | Okunacak harf adı | Dosya adı |
| --- | --- | --- |
| د | دَال | `letter-dal.mp3` |
| ذ | ذَال | `letter-dhal.mp3` |
| ر | رَاء | `letter-ra.mp3` |
| ز | زَاي | `letter-zay.mp3` |
| س | سِين | `letter-sin.mp3` |
| ش | شِين | `letter-shin.mp3` |
| ص | صَاد | `letter-sad.mp3` |
| ض | ضَاد | `letter-dad.mp3` |
| ط | طَاء | `letter-tta.mp3` |
| ظ | ظَاء | `letter-zza.mp3` |
| ع | عَيْن | `letter-ayn.mp3` |
| غ | غَيْن | `letter-ghayn.mp3` |
| ف | فَاء | `letter-fa.mp3` |

## B. 17. ve 18. ders sesleri — 6 ayrı MP3

Bu altı dosya **harf adı değil**, ayırt edici tek başına okunmuş harekeli ses veya kelimedir. Özellikle `بَ`, `بِ`, `بُ` birbirine karıştırılmamalı. `قُلْ`, `هُوَ`, `لَمْ` için doğrulanmış metin/telaffuz ve kullanım izni gerekir. Var olan sure kaydından telif incelemesi olmadan kesit alınmaz.

| Ders | Tam hedef metin | Dosya adı |
| --- | --- | --- |
| 17 | بَ | `syllable-ba-fatha.mp3` |
| 17 | بِ | `syllable-ba-kasra.mp3` |
| 17 | بُ | `syllable-ba-damma.mp3` |
| 18 | قُلْ | `word-qul.mp3` |
| 18 | هُوَ | `word-huwa.mp3` |
| 18 | لَمْ | `word-lam.mp3` |

## Teslim ve QA prosedürü

1. ElevenLabs veya kayıt yazılımından her hedef için **ayrı MP3** ver. Kaydın gerçekten belirtilen hedefi okuduğunu dinleyerek kontrol et. Aynı sesi farklı dosya adlarıyla çoğaltma.
2. Dosyaları çalışma ortamında `qa/audio-intake/` altına geçici yerleştir (bu klasördeki ham kayıtları inceleme olmadan uygulamanın yayın klasörüne koyma).
3. `node scripts/audit-arabic-audio-intake.cjs --report=qa/audio-intake-report.json` komutunu çalıştır. Araç 19 hedefi kaynak koddaki müfredattan üretir; mevcut 15 MP3'ün SHA-256 bütünlüğünü de kontrol eder.
4. Her yeni dosyada uzantı/ad, boyut, temel MP3 başlığı, SHA-256 ve **tam aynı byte içeriğinin** tekrar edip etmediği denetlenir. Sadece bu denetimden geçenler `awaiting-human-review` statüsü alır.
5. Sahibi/lisans hakları için kaynak ve delil; Arapça telaffuz/Kur'an ifadeleri için bağımsız incelemeci ve doğrulama referansı kaydedilmeden `DEEN_ARABIC_LISTENING.records` içindeki `pending-review` değerleri `approved` yapılmaz.
6. Ancak gerçek ses dosyaları sağlandıktan, SHA doğrulandıktan, haklar ve telaffuz onaylandıktan sonra sesleri uygulamanın manifestine, cache politikasına ve gerçek Chrome oynatma testlerine bağlayan **ayrı PR** açılır.

### Yayın güvenliği

- Bu envanter kontrolü tek başına sesin doğru telaffuz edildiğini, lisansını veya ses codec'inin uçtan uca çalıştığını kanıtlamaz.
- Kendi verdiğin 15 harf MP3'ü hâlâ yalnızca **sahip tarafından doğrulanmış önizlemedir**; bağımsız telaffuz onayının yerini tutmaz.
- Yeni sesler gelmeden 17/18 numaralı derslere tamamlanma/XP ödülü verilmez. Mevcut sure ve eski öğrenci kayıtları değişmez.
- `scripts/test-arabic-audio-intake.cjs` hiç dosya gelmediği, mevcut sesin yanlış isim altında kopyalandığı, hatalı MP3 başlığı veya beklenmeyen dosya adı durumlarını test eder.

**Sonraki devam:** Önce CI kanıtını ve kabul kuyruğunu teyit et. Ses dosyaları gelmediyse dinleme dersini sahte biçimde açma; mevcut kayıtlarla kullanılabilecek okuma becerisi ölçümünü tasarlamaya geç.
