# DEEN German final full-app locale audit — 2026-10-12

> **Deployment decision: BLOCKED.** This audit is intentionally not a religious, legal or native-language approval. A green staging CI does not mean the German application is ready for production.

## Verified inventory

| Surface | Verified status |
|---|---|
| German entry/onboarding | German copy exists; no evidence of an end-to-end approved production German lesson flow |
| English UI translation reference | 1087 source strings |
| German staged UI dictionaries | 1312 distinct German strings across ten files |
| Source-key overlap with English reference | 957/1087 |
| **English reference keys without German catalog match** | **130** |
| German strings outside English reference | 355 (dynamic, lesson, Quran controls and Premium screens) |
| German base question staging | 1,500 questions (not live/approved) |
| German active lesson questions | 1,484 source questions, source-matched in staging only |
| German stored runtime variants | 20, plus 100 legacy renderer records in staging |
| Quran Arabic and original audio | Unchanged; 90 canonical original ayahs |
| Quran German meaning drafts | 90/90, all without religious/native/rights approval |
| German production manifest | question_data=missing; global_qa=blocked; religious_expert_approved=false |
| German production DOM translation engine | Not wired to startup; only English and Arabic live renderers are invoked |
| German full-browser E2E QA | Not completed |

## Fixes implemented in staging during this audit

- Language-change rejection now uses **the target language** for its explanation, so selecting German from an existing Turkish profile does not show a Turkish-only blocked-language sheet.
- German not-ready message explains pending review and lists all available alternatives including English.
- Embedded SHA-256 startup asset hashes in `index.html` rebuilt for these changes; existing 67 versioned release-segment hashes were not touched.
- `scripts/audit-german-full-release-readiness.mjs` added to German CI: counts live-UI reference gaps, verifies the production blocker, and asserts all 90 Quran meaning drafts remain unapproved.


## Progress since initial audit

- **Batch 01 — 2026-10-12:** added 120 verified source-keyed German UI wording **drafts** for religious vocabulary, ablution/prayer/fasting labels, and first learning-unit headings to `assets/i18n/german-ui.reference-batch-01.staging.json`.
- 850 → **730** English UI reference keys without a German catalog mapping. Exact overlap is now **357/1,087**, with **712** distinct German staging labels across five dictionaries.
- These translations are not wired into a production German UI renderer, and religious/native German approval is still outstanding. The batch remains **staging-only** and cannot be deployed as a fully translated UI.
- `scripts/test-german-ui-reference-batch-01.mjs` checks all 120 exact source keys, English reference meanings, duplication, approval flags and fail-closed German release. `scripts/audit-german-full-release-readiness.mjs` inventories the 610 remaining keys.

- **Batch 02 — 2026-10-12:** added another **120 source-matched German UI drafts** for learning paths, review actions, faith and tawhid lesson titles to `assets/i18n/german-ui.reference-batch-02.staging.json`. Another 20 interpretation-sensitive headings were flagged for native German and subject-matter review. Reference coverage **357 → 477 / 1,087** and unmatched UI reference keys **730 → 610**. Total staged German UI labels **832** in six dictionaries. New `scripts/test-german-ui-reference-batch-02.mjs` checks both batches, no collisions, exact source keys and blocked release.

- **Batch 03 — 2026-10-12:** added **120 German UI reference drafts** for the Shahada, listening and sequencing exercises, tawhid, and introduction to Islam's five pillars. The first **360/850 missing baseline references** are covered; **490 are still unmatched**. German staging has **952 unique UI labels** across seven catalogs, of which **597/1,087** match the English baseline. Flagged **21** religious/context-dependent terms and **two inconsistent source references**: the Turkish key says 'Türkçe' while its English gloss says 'English'. Staging only; expert, native and rights gates remain blocked.

- **Batch 04 — 2026-10-12:** added **120 German staging labels** for pillars of Islam, prayer, zakāt, fasting, Hadsch and six articles of faith, including match/review/Challenge titles. All four remediation batches now cover **480/850** originally unmapped reference keys, leaving **370** missing. There are **1,072 staged German UI keys** across eight catalogs, **717/1,087** matching the English baseline. **20 religiously sensitive expressions** require native-language and Islamic scholarly review, especially Qadar/Qadāʾ and the distinction between faith principles and pillars. CI checks remain fail-closed; no runtime/deploy.

- **Batch 05 — 2026-10-12:** added **120 German staging labels** for classifying pillars vs faith articles, angels, divine knowledge, revelation, and holy scriptures. **600/850** originally missing reference keys now have German drafts; **250 remain**. German UI staging now has **1,192 distinct labels across nine catalogs**, with **837/1,087** source-reference key matches. **25 sensitive religious expressions** await native German and Islamic expert reviews; production is still blocked.

- **Batch 06 — 2026-10-12:** added another **120 German UI wording drafts**, covering prophets, the Hereafter, divine decree, prayer, ritual purity, fasting and first-run onboarding. Cumulative reference remediation: **720/850 source keys**, leaving **130** unmatched. Total: **1,312 unique staged UI translations** across ten catalogs, **957/1,087** English reference key matches and 355 other dynamically used strings. **20** religious terms require expert/native review. The batch's onboarding labels are staged only; runtime is NOT German enabled. CI validates all six batches and unchanged release gates.

## Remaining release blockers (priority order)

1. **Translate/verify and wire the remaining GUI reference keys.** The full-app baseline has 850 keys without a match in any of the four German staging catalogs. This is not proof every key appears on the same screen, but each is a possible source of Turkish fallback. Cover every active screen before claiming 'German-only'.
2. **Install a German DOM/runtime UI renderer** equivalent in quality to the English renderer, including dynamic values, result panels, progression, profile, Premium and every Quran control. The current startup injects English and Arabic rendering, not a released German renderer.
3. **Complete independent religious/native German review** of 1,500 base questions, live variants and 90 Quran meaning drafts, maintaining exact right-answer source identity, Qur'an verse identity and unmodified Arabic recitation.
4. **Complete rights/copyright and source attribution review** of Quran meaning publication and any other translated religious content.
5. **Run real mobile and desktop Chrome E2E on a full German release candidate**, including first-run language selection, changing language while logged in, all tabs, multiple question types, wrong/correct feedback, audio, results, Premium, Quran, review and profile.
6. **Only after those gates and explicit QA acceptance**, update release manifest and assets, verify startup hashes, merge to main and inspect the actual GitHub Pages URL.

## Exhaustive unmatched German UI source-key list

The current **130** unmatched source keys after 6 batches covering 720 of 850 originally unmapped reference keys. English comparison entries below are context only, not approved German text.

| # | Turkish source key | English reference meaning |
|---:|---|---|
| 1 | Allah’a İman | Belief in Allah |
| 2 | Tevhidi ve imanın hayata yansımalarını öğren. | Learn about Allah's oneness and how faith is reflected in life. |
| 3 | Şehadetin anlamını tanı; parçaları arasında bağ kur. | Learn the meaning of the testimony of faith and connect its parts. |
| 4 | İslam’ın Beş Şartı | The Five Pillars of Islam |
| 5 | Beş şartı tanı, doğru bağlamlarıyla eşleştir. | Recognise the five pillars and match them with their correct contexts. |
| 6 | İmanın Esaslarına Giriş | Introduction to the Articles of Faith |
| 7 | Altı iman esasını öğren ve birbirinden ayırt et. | Learn the six articles of faith and distinguish between them. |
| 8 | İlk 5 ünitedeki bilgini tek bir ustalık sınavında bir araya getir. | Bring together what you learned in the first five units in one mastery test. |
| 9 | KISIM 2 · İMAN | SECTION 2 · FAITH |
| 10 | Meleklere iman konusunu adım adım pekiştir. | Reinforce belief in angels step by step. |
| 11 | Kitaplara imanla ilgili temel kavramları keşfet. | Discover the main concepts of belief in the revealed books. |
| 12 | Peygamberlere iman konusundaki bilgini güçlendir. | Strengthen your knowledge of belief in the prophets. |
| 13 | Ahiret Gününe İman | Belief in the Last Day |
| 14 | Ahiret inancını tanı, hatırla ve pekiştir. | Recognise, recall and reinforce belief in the Hereafter. |
| 15 | Kader ve kaza kavramlarını kaynak notlarıyla öğren. | Learn the concepts of divine decree and its fulfilment with source notes. |
| 16 | KISIM 2 FİNALİ | SECTION 2 FINAL |
| 17 | İman Ustalığı | Faith Mastery |
| 18 | İman bölümündeki 5 ünitenin bilgisini bir araya getir. | Bring together your knowledge from the five units on faith. |
| 19 | KISIM 3 · İBADET | SECTION 3 · WORSHIP |
| 20 | Fıkıh kapsamı · Ortak temel | Scope of Islamic jurisprudence · Shared foundation |
| 21 | Bu sürüm mezheplerin ortak çekirdeğini öğretir. | This version teaches the shared core of the schools of law. |
| 22 | İbadet Bilinci | Awareness of Worship |
| 23 | İbadetin anlamını, niyet ve ihlası; ibadet bilgisinin nasıl öğrenildiğini kavra. | Understand the meaning of worship, intention and sincerity, and how to learn about worship. |
| 24 | Temizlik ve Abdest | Cleanliness and Ablution |
| 25 | Taharetin anlamını, abdestin Kur’an’daki ortak temelini ve teyemmümdeki kolaylığı öğren. | Learn the meaning of ritual purification, ablution's shared foundation in the Quran, and the ease offered by dry ablution. |
| 26 | Namaz vakti, kıble, temizlik, niyet ve beş vakit farz rekâtların temelini öğren. | Learn the foundations of prayer time, direction, purification, intention and obligatory units in the five daily prayers. |
| 27 | Namazın temel rükünlerini, bir rekâtın akışını ve mazeretteki kolaylık ilkesini öğren. | Learn the main pillars of prayer, the sequence of a unit, and the principle of ease when difficulties arise. |
| 28 | Oruç ve Ramazan | Fasting and Ramadan |
| 29 | Ramazan orucunun anlamını, imsak-iftar sınırını, takva amacını ve temel mazeretleri öğren. | Learn the meaning of fasting in Ramadan, its dawn-to-sunset limits, its aim of mindfulness of Allah, and the main concessions. |
| 30 | KISIM 3 FİNALİ | SECTION 3 FINAL |
| 31 | İbadet Temelleri Ustalığı | Foundations of Worship Mastery |
| 32 | İbadet bölümündeki ortak-temel bilgileri bir araya getir. | Bring together the shared foundations from the units on worship. |
| 33 | Seri detayları | Streak details |
| 34 | Neden şimdi? | Why now? |
| 35 | Yeni ilerleme | New progress |
| 36 | HAFTALIK RİTİM | WEEKLY RHYTHM |
| 37 | USTALIK SINAVINI BAŞLAT | START THE MASTERY TEST |
| 38 | ADAPTIVE MEMORY ENGINE · v6.4 | ADAPTIVE MEMORY ENGINE · v6.4 |
| 39 | Ünite bazında | By unit |
| 40 | Bu skor yalnız öğrenme ve hatırlama performansını yönetir; dinî yeterlilik veya ibadet değeri değildir. | This score manages learning and recall performance only; it does not measure religious competence or the value of worship. |
| 41 | 1. gün + 7. gün | Day 1 + day 7 |
| 42 | Dersi bitirdiğin gün değil, unutma başlamadan hemen önce hatırla. | Recall just before forgetting begins, rather than only on the day you finish a lesson. |
| 43 | Yarın | Tomorrow |
| 44 | 5 farklı günde Bugünkü Yolculuk'u tamamla | Complete Today's Journey on 5 different days |
| 45 | İlk Adım | First Step |
| 46 | İlk dersini tamamla | Complete your first lesson |
| 47 | İstikrar | Consistency |
| 48 | Bilgi Yolcusu | Knowledge Traveller |
| 49 | 25 ders tamamla | Complete 25 lessons |
| 50 | Usta Öğrenci | Master Learner |
| 51 | Bir ünitede %100 ustalık | Reach 100% mastery in one unit |
| 52 | Kısım Ustası | Section Master |
| 53 | Bir kısım finalini geç | Pass a section final |
| 54 | Öğrenerek 1000 XP kazan | Earn 1000 XP through learning |
| 55 | Keskin Odak | Sharp Focus |
| 56 | 10 kusursuz ders tamamla | Complete 10 perfect lessons |
| 57 | Hatırlama Ritmi | Recall Rhythm |
| 58 | 10 tekrar dersi tamamla | Complete 10 review lessons |
| 59 | Uzun Yol | Long Journey |
| 60 | 50 ders tamamla | Complete 50 lessons |
| 61 | Bilgi Birikimi | Knowledge Gained |
| 62 | Öğrenerek 5000 XP kazan | Earn 5000 XP through learning |
| 63 | Öğrenme oyunlaştırılır; ibadet puanlanmaz. Dinî içerikler uzman incelemesi bekler. | Learning uses game elements; worship is not scored. Religious content awaits expert review. |
| 64 | DEEN ADMIN | DEEN ADMIN |
| 65 | P · DEVELOPER CONTROL CENTER | P · DEVELOPER CONTROL CENTRE |
| 66 | HIZLI İLERLEME | QUICK PROGRESS |
| 67 | TÜM BÖLÜMLERİ GEÇ | COMPLETE ALL SECTIONS |
| 68 | TÜM BÖLÜMLERİ SIFIRLA | RESET ALL SECTIONS |
| 69 | KISIM 1’İ GEÇ | COMPLETE SECTION 1 |
| 70 | KISIM 1’İ SIFIRLA | RESET SECTION 1 |
| 71 | KISIM 2’Yİ GEÇ | COMPLETE SECTION 2 |
| 72 | KISIM 2’Yİ SIFIRLA | RESET SECTION 2 |
| 73 | KISIM 3’Ü GEÇ | COMPLETE SECTION 3 |
| 74 | KISIM 3’Ü SIFIRLA | RESET SECTION 3 |
| 75 | TÜM ROZETLERİ AÇ | UNLOCK ALL BADGES |
| 76 | TÜM KİLİTLERİ AÇ | UNLOCK EVERYTHING |
| 77 | TEK AŞAMA KONTROLÜ | INDIVIDUAL STAGE CONTROL |
| 78 | SEÇİLİ AŞAMAYI GEÇ | COMPLETE SELECTED STAGE |
| 79 | AŞAMAYI GERİ AL | UNDO STAGE |
| 80 | ÖĞREN EKRANINA DÖN | RETURN TO LEARN |
| 81 | ÜNİTE KONTROLÜ | UNIT CONTROL |
| 82 | SEÇİLİ ÜNİTEYİ GEÇ | COMPLETE SELECTED UNIT |
| 83 | ÜNİTEYİ GERİ AL | UNDO UNIT |
| 84 | KISIM 1 FİNALİNİ GEÇ | COMPLETE SECTION 1 FINAL |
| 85 | KISIM 2 FİNALİNİ GEÇ | COMPLETE SECTION 2 FINAL |
| 86 | KISIM 3 FİNALİNİ GEÇ | COMPLETE SECTION 3 FINAL |
| 87 | SINIRSIZ ENERJİ | UNLIMITED ENERGY |
| 88 | 100 GÜN SERİ | 100-DAY STREAK |
| 89 | NORMAL ENERJİ | NORMAL ENERGY |
| 90 | ROZETLERİ KİLİTLE | LOCK BADGES |
| 91 | GİRİŞ EKRANINA DÖN | RETURN TO ENTRY |
| 92 | ONBOARDING’İ BAŞTAN AÇ | RESTART ONBOARDING |
| 93 | PROFİLE GİT | GO TO PROFILE |
| 94 | ÖĞREN EKRANINA GİT | GO TO LEARN |
| 95 | “Giriş ekranına dön” mevcut progress’i silmez. “Onboarding’i baştan aç” sadece onboarding tamamlandı bayrağını sıfırlar. | 'Return to entry' preserves progress. 'Restart onboarding' resets only the onboarding completion flag. |
| 96 | ROZET + RUNTIME AUDIT | BADGE + RUNTIME AUDIT |
| 97 | STATE JSON KOPYALA | COPY STATE JSON |
| 98 | İLERLEMEYİ SIFIRLA | RESET PROGRESS |
| 99 | TAM SIFIRLAMA | FULL RESET |
| 100 | KUR’AN · PRODUCT ANALYTICS | QURAN · PRODUCT ANALYTICS |
| 101 | KUR’AN · UZMAN DOĞRULAMA | QURAN · EXPERT VERIFICATION |
| 102 | KAYNAK GÖRÜNÜR | SOURCE VISIBLE |
| 103 | SES KAYDI HAZIR | AUDIO RECORDING READY |
| 104 | UZMAN ONAYLI | EXPERT APPROVED |
| 105 | İNCELEMEDE | UNDER REVIEW |
| 106 | TÜRKÇE MEAL | TURKISH TRANSLATION |
| 107 | ÖĞRENME NOTU | LEARNING NOTE |
| 108 | Tanımlı değil | Not defined |
| 109 | TASLAĞI KAYDET | SAVE DRAFT |
| 110 | YAYINA ONAYLA | APPROVE FOR PUBLICATION |
| 111 | İNCELEMEYE GERİ AL | RETURN TO REVIEW |
| 112 | SONRAKİ BEKLEYEN | NEXT PENDING ITEM |
| 113 | Henüz uzman işlemi yok. | No expert action yet. |
| 114 | Admin panelini kapat | Close admin panel |
| 115 | Pencereyi kapat | Close window |
| 116 | Belirgin tekrar eden hata yok. Sistem yeni cevaplarla öğrenme profilini güncellemeye devam edecek. | No clear repeated mistakes. The system will keep updating your learning profile with new answers. |
| 117 | Biriktirilebilir ilerleme madalyaları. Ek XP verilmez. | Collectible progress medals. No extra XP is awarded. |
| 118 | Kaynaklı Arapça metin ve kayıtlı meal verisinden otomatik oluşturuldu. | Generated from sourced Arabic text and recorded translation data. |
| 119 | Beyyine | Al-Bayyinah |
| 120 | SON ÜNİTE | LAST UNIT |
| 121 | KISIM 1 FİNALİ | SECTION 1 FINAL |
| 122 | KİLİTLİ · USTALIK SINAVI | LOCKED · MASTERY TEST |
| 123 | Temeller Ustalığı | Foundations Mastery |
| 124 | Geçerli mezhep farklılıkları yanlış cevap olarak puanlanmaz; bütün yeni içerikler uzman incelemesi bekler. | Valid differences between schools of law are not graded as incorrect; all new content awaits expert review. |
| 125 | Fâtiha | Al-Fatihah |
| 126 | Felak | Al-Falaq |
| 127 | Nâs | An-Nas |
| 128 | Mâûn | Al-Ma'un |
| 129 | İnşirah | Ash-Sharh |
| 130 | Zilzâl | Az-Zalzalah |

## Audit scope limitation

The catalog comparison uses the English reference file, which is not itself a complete enumeration of every dynamically assembled Turkish screen string. Runtime/browser QA may reveal **additional** Turkish strings. The count above is therefore **not a certified ceiling** on remaining German work.

**Do not merge or deploy the German release until all blocker conditions are cleared.**
