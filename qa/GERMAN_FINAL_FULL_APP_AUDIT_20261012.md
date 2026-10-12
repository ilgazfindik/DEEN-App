# DEEN German final full-app locale audit — 2026-10-12

> **Deployment decision: BLOCKED.** This audit is intentionally not a religious, legal or native-language approval. A green staging CI does not mean the German application is ready for production.

## Verified inventory

| Surface | Verified status |
|---|---|
| German entry/onboarding | German copy exists; no evidence of an end-to-end approved production German lesson flow |
| English UI translation reference | 1087 source strings |
| German staged UI dictionaries | 1192 distinct German strings across nine files |
| Source-key overlap with English reference | 837/1087 |
| **English reference keys without German catalog match** | **250** |
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

## Remaining release blockers (priority order)

1. **Translate/verify and wire the remaining GUI reference keys.** The full-app baseline has 850 keys without a match in any of the four German staging catalogs. This is not proof every key appears on the same screen, but each is a possible source of Turkish fallback. Cover every active screen before claiming 'German-only'.
2. **Install a German DOM/runtime UI renderer** equivalent in quality to the English renderer, including dynamic values, result panels, progression, profile, Premium and every Quran control. The current startup injects English and Arabic rendering, not a released German renderer.
3. **Complete independent religious/native German review** of 1,500 base questions, live variants and 90 Quran meaning drafts, maintaining exact right-answer source identity, Qur'an verse identity and unmodified Arabic recitation.
4. **Complete rights/copyright and source attribution review** of Quran meaning publication and any other translated religious content.
5. **Run real mobile and desktop Chrome E2E on a full German release candidate**, including first-run language selection, changing language while logged in, all tabs, multiple question types, wrong/correct feedback, audio, results, Premium, Quran, review and profile.
6. **Only after those gates and explicit QA acceptance**, update release manifest and assets, verify startup hashes, merge to main and inspect the actual GitHub Pages URL.

## Exhaustive unmatched German UI source-key list

Current **250** source labels do not yet have a German staging mapping, after five 120-label packages (600 of the original 850 gaps addressed). English reference meanings below provide context only.

| # | Turkish source key | English reference meaning |
|---:|---|---|
| 1 | İman Bütünlüğü | Complete faith |
| 2 | Peygamberlerin Bilgisi | The knowledge of prophets |
| 3 | İman ve Derece | Faith and rank |
| 4 | Peygamberlerin İnsan Oluşu ve Vahiy | The Humanity of Prophets and Revelation |
| 5 | İnsan ve Vahiy | Humanity and revelation |
| 6 | Peygamberlerin İnsan Oluşu | The humanity of prophets |
| 7 | Örneklik | Example |
| 8 | Tebliğ, Müjde ve Uyarı | Conveyance, Good News and Warnings |
| 9 | Peygamberlerin Görevi | The duties of prophets |
| 10 | İnsan Sorumluluğu | Human responsibility |
| 11 | Ortak Çağrı ve İman Birliği | The Shared Call and Unity of Faith |
| 12 | Tevhid Çağrısı | The call to tawhid |
| 13 | Ortak Mesaj | The shared message |
| 14 | Ayetlerle Peygamberlik | Prophethood in the verses |
| 15 | Gönderiliş Gayesi | The purpose of sending prophets |
| 16 | Hz. Muhammed ve Risalet | Muhammad and Messengership |
| 17 | Evrensel Risalet | Universal messengership |
| 18 | Örneklik ve Tevhid | Example and tawhid |
| 19 | Tevhid ve Risalet | Tawhid and messengership |
| 20 | Peygamberlere İman Ustalığı | Mastering Belief in the Prophets |
| 21 | Vahiy ve Tebliğ | Revelation and conveyance |
| 22 | Ahiret Gününe İman Nedir? | What Is Belief in the Last Day? |
| 23 | Ahiret Kavramı | The concept of the Hereafter |
| 24 | İman ve İyilik | Faith and goodness |
| 25 | Karşılık | Recompense |
| 26 | Ahiret Akışı | The sequence of the Hereafter |
| 27 | Kıyametin Vakti | The time of the Hour |
| 28 | Ölüm ve Dünya Hayatının Sonu | Death and the End of Worldly Life |
| 29 | Ölüm Bilinci | Awareness of death |
| 30 | Ölüm Sonrası | After death |
| 31 | Pişmanlık | Regret |
| 32 | Yanlış Anlamayı Düzeltme | Correcting a misunderstanding |
| 33 | Ölüm ve Ahiret | Death and the Hereafter |
| 34 | Kıyamet ve Yeniden Diriliş | The Hour and Resurrection |
| 35 | Yeniden Diriliş | Resurrection |
| 36 | Hesap, Amel Defteri ve İlahi Adalet | Reckoning, the Record of Deeds and Divine Justice |
| 37 | İlahi Adalet | Divine justice |
| 38 | Amel Defteri | The record of deeds |
| 39 | İyilik | Goodness |
| 40 | Ahiret Bilincinin Hayata Etkisi | How Awareness of the Hereafter Affects Life |
| 41 | Ahiret ve Ahlak | The Hereafter and good character |
| 42 | Dünya ve Ahiret | This world and the Hereafter |
| 43 | Umut ve Adalet | Hope and justice |
| 44 | Dengeli Öğrenme | Balanced learning |
| 45 | Dengeli Ahiret Bilinci | Balanced awareness of the Hereafter |
| 46 | Ahiret İmanı Ustalığı | Mastering Belief in the Hereafter |
| 47 | Kader ve Kazaya İman Nedir? | What Is Belief in Divine Decree and Its Fulfilment? |
| 48 | Kader ve Kazaya İman | Belief in divine decree and its fulfilment |
| 49 | Allah'ın İlmi, Ölçüsü ve Takdiri | Allah's Knowledge, Measure and Decree |
| 50 | İnsan İradesi ve Sorumluluk | Human Will and Responsibility |
| 51 | Çaba, Tedbir ve Tevekkül | Effort, Precautions and Trust in Allah |
| 52 | Musibet, Sabır ve Denge | Hardship, Patience and Balance |
| 53 | Kader İnancı Ustalığı | Mastering Belief in Divine Decree |
| 54 | İbadet Nedir? | What Is Worship? |
| 55 | Niyet ve İhlas | Intention and Sincerity |
| 56 | İbadetin Hayata Etkisi | How Worship Affects Life |
| 57 | Temizlik ve Taharet | Cleanliness and Ritual Purification |
| 58 | Abdestin Temeli | The Foundations of Ablution |
| 59 | Abdest Adımlarını Tanı | Learn the Steps of Ablution |
| 60 | Teyemmüm ve Kolaylık | Dry Ablution and Ease |
| 61 | Ortak Temel ve Farklar | Shared Foundations and Differences |
| 62 | Namaza Hazırlık | Preparing for Prayer |
| 63 | Yatsı namazı | Night prayer |
| 64 | Öğle namazı | Midday prayer |
| 65 | Vakit ve Kıble | Prayer Time and Direction |
| 66 | Sabah namazı | Dawn prayer |
| 67 | Akşam namazı | Sunset prayer |
| 68 | Şartları Eşleştir | Match the Conditions |
| 69 | İkindi namazı | Afternoon prayer |
| 70 | Hazırlık Senaryoları | Preparation Scenarios |
| 71 | Beş Vakit | The Five Daily Prayers |
| 72 | Namazın Yapısı | The Structure of Prayer |
| 73 | Kıyam, Kıraat, Rükû, Secde | Standing, Recitation, Bowing and Prostration |
| 74 | Rekâtı Kur | Build a Prayer Unit |
| 75 | Namaz İçinde Akış | The Sequence Within Prayer |
| 76 | Mazerette Kolaylık | Ease in Cases of Difficulty |
| 77 | Oruç Nedir? | What Is Fasting? |
| 78 | Bilerek yemek | Eating deliberately |
| 79 | Yeme | Eating |
| 80 | Ramazan ve Takva | Ramadan and Mindfulness of Allah |
| 81 | Unutarak yemek | Eating forgetfully |
| 82 | Cinsel ilişki | Sexual intercourse |
| 83 | İmsak ve İftar | Beginning and Breaking the Fast |
| 84 | İçme | Drinking |
| 85 | Oruçlu Günlük Hayat | Daily Life While Fasting |
| 86 | Mazeret ve Kaza | Concessions and Making Up Missed Fasts |
| 87 | DEEN’e hoş geldin | Welcome to DEEN |
| 88 | İslam’ı adım adım, sakin ve düzenli şekilde öğren. | Learn about Islam step by step, calmly and consistently. |
| 89 | Sana nasıl hitap edelim? | What should we call you? |
| 90 | Adın veya kullanıcı adın | Your name or username |
| 91 | Bu isim profilinde görünecek. | This name will appear on your profile. |
| 92 | Yolcu | Traveller |
| 93 | Yaşını yazmana gerek yok; sana en rahat gelen öğrenme stilini seç. | You do not need to enter your age. Choose the style that suits you best. |
| 94 | Çocuk | Child |
| 95 | Genç | Teen |
| 96 | Yetişkin | Adult |
| 97 | Kısa, sade ve görsel ağırlıklı anlatım | Short, simple explanations with visual support |
| 98 | Açık, akıcı ve günlük hayata yakın örnekler | Clear, fluent explanations with everyday examples |
| 99 | Daha derin, dengeli ve düzenli açıklamalar | Deeper, balanced and structured explanations |
| 100 | Yol arkadaşını seç | Choose your companion |
| 101 | Seçtiğin hayvan profilinde, serilerinde ve ders sonunda sana eşlik edecek. | Your animal will accompany you on your profile, streaks and lesson results. |
| 102 | Aslan | Lion |
| 103 | Kurt | Wolf |
| 104 | Baykuş | Owl |
| 105 | Kaplumbağa | Turtle |
| 106 | Kartal | Eagle |
| 107 | Kedi | Cat |
| 108 | Cesaret | Courage |
| 109 | Kararlılık | Determination |
| 110 | Odak | Focus |
| 111 | Sakinlik | Calm |
| 112 | Önce bir hayvan seç | Choose an animal first |
| 113 | Günde ne kadar zaman ayırabilirsin? | How much time can you spend each day? |
| 114 | Kısa ama düzenli ilerlemek daha iyi sonuç verir. | Short, regular practice leads to better results. |
| 115 | Hızlı ve hafif tempo · 1 mini ders | Quick and light · 1 short lesson |
| 116 | Dengeli günlük ritim · 2 mini ders | A balanced daily pace · 2 short lessons |
| 117 | Daha yoğun öğrenme · 3 mini ders | More intensive learning · 3 short lessons |
| 118 | Hazırsın | You are ready |
| 119 | İslam Nedir? | What Is Islam? |
| 120 | Temel kavramlarla tanış. İnanç, ibadet ve ahlak arasındaki bağı keşfet. | Meet the main concepts. Discover the connection between faith, worship and good character. |
| 121 | Allah’a İman | Belief in Allah |
| 122 | Tevhidi ve imanın hayata yansımalarını öğren. | Learn about Allah's oneness and how faith is reflected in life. |
| 123 | Şehadetin anlamını tanı; parçaları arasında bağ kur. | Learn the meaning of the testimony of faith and connect its parts. |
| 124 | İslam’ın Beş Şartı | The Five Pillars of Islam |
| 125 | Beş şartı tanı, doğru bağlamlarıyla eşleştir. | Recognise the five pillars and match them with their correct contexts. |
| 126 | İmanın Esaslarına Giriş | Introduction to the Articles of Faith |
| 127 | Altı iman esasını öğren ve birbirinden ayırt et. | Learn the six articles of faith and distinguish between them. |
| 128 | İlk 5 ünitedeki bilgini tek bir ustalık sınavında bir araya getir. | Bring together what you learned in the first five units in one mastery test. |
| 129 | KISIM 2 · İMAN | SECTION 2 · FAITH |
| 130 | Meleklere iman konusunu adım adım pekiştir. | Reinforce belief in angels step by step. |
| 131 | Kitaplara imanla ilgili temel kavramları keşfet. | Discover the main concepts of belief in the revealed books. |
| 132 | Peygamberlere iman konusundaki bilgini güçlendir. | Strengthen your knowledge of belief in the prophets. |
| 133 | Ahiret Gününe İman | Belief in the Last Day |
| 134 | Ahiret inancını tanı, hatırla ve pekiştir. | Recognise, recall and reinforce belief in the Hereafter. |
| 135 | Kader ve kaza kavramlarını kaynak notlarıyla öğren. | Learn the concepts of divine decree and its fulfilment with source notes. |
| 136 | KISIM 2 FİNALİ | SECTION 2 FINAL |
| 137 | İman Ustalığı | Faith Mastery |
| 138 | İman bölümündeki 5 ünitenin bilgisini bir araya getir. | Bring together your knowledge from the five units on faith. |
| 139 | KISIM 3 · İBADET | SECTION 3 · WORSHIP |
| 140 | Fıkıh kapsamı · Ortak temel | Scope of Islamic jurisprudence · Shared foundation |
| 141 | Bu sürüm mezheplerin ortak çekirdeğini öğretir. | This version teaches the shared core of the schools of law. |
| 142 | İbadet Bilinci | Awareness of Worship |
| 143 | İbadetin anlamını, niyet ve ihlası; ibadet bilgisinin nasıl öğrenildiğini kavra. | Understand the meaning of worship, intention and sincerity, and how to learn about worship. |
| 144 | Temizlik ve Abdest | Cleanliness and Ablution |
| 145 | Taharetin anlamını, abdestin Kur’an’daki ortak temelini ve teyemmümdeki kolaylığı öğren. | Learn the meaning of ritual purification, ablution's shared foundation in the Quran, and the ease offered by dry ablution. |
| 146 | Namaz vakti, kıble, temizlik, niyet ve beş vakit farz rekâtların temelini öğren. | Learn the foundations of prayer time, direction, purification, intention and obligatory units in the five daily prayers. |
| 147 | Namazın temel rükünlerini, bir rekâtın akışını ve mazeretteki kolaylık ilkesini öğren. | Learn the main pillars of prayer, the sequence of a unit, and the principle of ease when difficulties arise. |
| 148 | Oruç ve Ramazan | Fasting and Ramadan |
| 149 | Ramazan orucunun anlamını, imsak-iftar sınırını, takva amacını ve temel mazeretleri öğren. | Learn the meaning of fasting in Ramadan, its dawn-to-sunset limits, its aim of mindfulness of Allah, and the main concessions. |
| 150 | KISIM 3 FİNALİ | SECTION 3 FINAL |
| 151 | İbadet Temelleri Ustalığı | Foundations of Worship Mastery |
| 152 | İbadet bölümündeki ortak-temel bilgileri bir araya getir. | Bring together the shared foundations from the units on worship. |
| 153 | Seri detayları | Streak details |
| 154 | Neden şimdi? | Why now? |
| 155 | Yeni ilerleme | New progress |
| 156 | HAFTALIK RİTİM | WEEKLY RHYTHM |
| 157 | USTALIK SINAVINI BAŞLAT | START THE MASTERY TEST |
| 158 | ADAPTIVE MEMORY ENGINE · v6.4 | ADAPTIVE MEMORY ENGINE · v6.4 |
| 159 | Ünite bazında | By unit |
| 160 | Bu skor yalnız öğrenme ve hatırlama performansını yönetir; dinî yeterlilik veya ibadet değeri değildir. | This score manages learning and recall performance only; it does not measure religious competence or the value of worship. |
| 161 | 1. gün + 7. gün | Day 1 + day 7 |
| 162 | Dersi bitirdiğin gün değil, unutma başlamadan hemen önce hatırla. | Recall just before forgetting begins, rather than only on the day you finish a lesson. |
| 163 | Yarın | Tomorrow |
| 164 | 5 farklı günde Bugünkü Yolculuk'u tamamla | Complete Today's Journey on 5 different days |
| 165 | İlk Adım | First Step |
| 166 | İlk dersini tamamla | Complete your first lesson |
| 167 | İstikrar | Consistency |
| 168 | Bilgi Yolcusu | Knowledge Traveller |
| 169 | 25 ders tamamla | Complete 25 lessons |
| 170 | Usta Öğrenci | Master Learner |
| 171 | Bir ünitede %100 ustalık | Reach 100% mastery in one unit |
| 172 | Kısım Ustası | Section Master |
| 173 | Bir kısım finalini geç | Pass a section final |
| 174 | Öğrenerek 1000 XP kazan | Earn 1000 XP through learning |
| 175 | Keskin Odak | Sharp Focus |
| 176 | 10 kusursuz ders tamamla | Complete 10 perfect lessons |
| 177 | Hatırlama Ritmi | Recall Rhythm |
| 178 | 10 tekrar dersi tamamla | Complete 10 review lessons |
| 179 | Uzun Yol | Long Journey |
| 180 | 50 ders tamamla | Complete 50 lessons |
| 181 | Bilgi Birikimi | Knowledge Gained |
| 182 | Öğrenerek 5000 XP kazan | Earn 5000 XP through learning |
| 183 | Öğrenme oyunlaştırılır; ibadet puanlanmaz. Dinî içerikler uzman incelemesi bekler. | Learning uses game elements; worship is not scored. Religious content awaits expert review. |
| 184 | DEEN ADMIN | DEEN ADMIN |
| 185 | P · DEVELOPER CONTROL CENTER | P · DEVELOPER CONTROL CENTRE |
| 186 | HIZLI İLERLEME | QUICK PROGRESS |
| 187 | TÜM BÖLÜMLERİ GEÇ | COMPLETE ALL SECTIONS |
| 188 | TÜM BÖLÜMLERİ SIFIRLA | RESET ALL SECTIONS |
| 189 | KISIM 1’İ GEÇ | COMPLETE SECTION 1 |
| 190 | KISIM 1’İ SIFIRLA | RESET SECTION 1 |
| 191 | KISIM 2’Yİ GEÇ | COMPLETE SECTION 2 |
| 192 | KISIM 2’Yİ SIFIRLA | RESET SECTION 2 |
| 193 | KISIM 3’Ü GEÇ | COMPLETE SECTION 3 |
| 194 | KISIM 3’Ü SIFIRLA | RESET SECTION 3 |
| 195 | TÜM ROZETLERİ AÇ | UNLOCK ALL BADGES |
| 196 | TÜM KİLİTLERİ AÇ | UNLOCK EVERYTHING |
| 197 | TEK AŞAMA KONTROLÜ | INDIVIDUAL STAGE CONTROL |
| 198 | SEÇİLİ AŞAMAYI GEÇ | COMPLETE SELECTED STAGE |
| 199 | AŞAMAYI GERİ AL | UNDO STAGE |
| 200 | ÖĞREN EKRANINA DÖN | RETURN TO LEARN |
| 201 | ÜNİTE KONTROLÜ | UNIT CONTROL |
| 202 | SEÇİLİ ÜNİTEYİ GEÇ | COMPLETE SELECTED UNIT |
| 203 | ÜNİTEYİ GERİ AL | UNDO UNIT |
| 204 | KISIM 1 FİNALİNİ GEÇ | COMPLETE SECTION 1 FINAL |
| 205 | KISIM 2 FİNALİNİ GEÇ | COMPLETE SECTION 2 FINAL |
| 206 | KISIM 3 FİNALİNİ GEÇ | COMPLETE SECTION 3 FINAL |
| 207 | SINIRSIZ ENERJİ | UNLIMITED ENERGY |
| 208 | 100 GÜN SERİ | 100-DAY STREAK |
| 209 | NORMAL ENERJİ | NORMAL ENERGY |
| 210 | ROZETLERİ KİLİTLE | LOCK BADGES |
| 211 | GİRİŞ EKRANINA DÖN | RETURN TO ENTRY |
| 212 | ONBOARDING’İ BAŞTAN AÇ | RESTART ONBOARDING |
| 213 | PROFİLE GİT | GO TO PROFILE |
| 214 | ÖĞREN EKRANINA GİT | GO TO LEARN |
| 215 | “Giriş ekranına dön” mevcut progress’i silmez. “Onboarding’i baştan aç” sadece onboarding tamamlandı bayrağını sıfırlar. | 'Return to entry' preserves progress. 'Restart onboarding' resets only the onboarding completion flag. |
| 216 | ROZET + RUNTIME AUDIT | BADGE + RUNTIME AUDIT |
| 217 | STATE JSON KOPYALA | COPY STATE JSON |
| 218 | İLERLEMEYİ SIFIRLA | RESET PROGRESS |
| 219 | TAM SIFIRLAMA | FULL RESET |
| 220 | KUR’AN · PRODUCT ANALYTICS | QURAN · PRODUCT ANALYTICS |
| 221 | KUR’AN · UZMAN DOĞRULAMA | QURAN · EXPERT VERIFICATION |
| 222 | KAYNAK GÖRÜNÜR | SOURCE VISIBLE |
| 223 | SES KAYDI HAZIR | AUDIO RECORDING READY |
| 224 | UZMAN ONAYLI | EXPERT APPROVED |
| 225 | İNCELEMEDE | UNDER REVIEW |
| 226 | TÜRKÇE MEAL | TURKISH TRANSLATION |
| 227 | ÖĞRENME NOTU | LEARNING NOTE |
| 228 | Tanımlı değil | Not defined |
| 229 | TASLAĞI KAYDET | SAVE DRAFT |
| 230 | YAYINA ONAYLA | APPROVE FOR PUBLICATION |
| 231 | İNCELEMEYE GERİ AL | RETURN TO REVIEW |
| 232 | SONRAKİ BEKLEYEN | NEXT PENDING ITEM |
| 233 | Henüz uzman işlemi yok. | No expert action yet. |
| 234 | Admin panelini kapat | Close admin panel |
| 235 | Pencereyi kapat | Close window |
| 236 | Belirgin tekrar eden hata yok. Sistem yeni cevaplarla öğrenme profilini güncellemeye devam edecek. | No clear repeated mistakes. The system will keep updating your learning profile with new answers. |
| 237 | Biriktirilebilir ilerleme madalyaları. Ek XP verilmez. | Collectible progress medals. No extra XP is awarded. |
| 238 | Kaynaklı Arapça metin ve kayıtlı meal verisinden otomatik oluşturuldu. | Generated from sourced Arabic text and recorded translation data. |
| 239 | Beyyine | Al-Bayyinah |
| 240 | SON ÜNİTE | LAST UNIT |
| 241 | KISIM 1 FİNALİ | SECTION 1 FINAL |
| 242 | KİLİTLİ · USTALIK SINAVI | LOCKED · MASTERY TEST |
| 243 | Temeller Ustalığı | Foundations Mastery |
| 244 | Geçerli mezhep farklılıkları yanlış cevap olarak puanlanmaz; bütün yeni içerikler uzman incelemesi bekler. | Valid differences between schools of law are not graded as incorrect; all new content awaits expert review. |
| 245 | Fâtiha | Al-Fatihah |
| 246 | Felak | Al-Falaq |
| 247 | Nâs | An-Nas |
| 248 | Mâûn | Al-Ma'un |
| 249 | İnşirah | Ash-Sharh |
| 250 | Zilzâl | Az-Zalzalah |

## Audit scope limitation

The catalog comparison uses the English reference file, which is not itself a complete enumeration of every dynamically assembled Turkish screen string. Runtime/browser QA may reveal **additional** Turkish strings. The count above is therefore **not a certified ceiling** on remaining German work.

**Do not merge or deploy the German release until all blocker conditions are cleared.**
