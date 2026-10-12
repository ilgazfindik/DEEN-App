# DEEN German final full-app locale audit — 2026-10-12

> **Deployment decision: BLOCKED.** This audit is intentionally not a religious, legal or native-language approval. A green staging CI does not mean the German application is ready for production.

## Verified inventory

| Surface | Verified status |
|---|---|
| German entry/onboarding | German copy exists; no evidence of an end-to-end approved production German lesson flow |
| English UI translation reference | 1087 source strings |
| German staged UI dictionaries | 1072 distinct German strings across eight files |
| Source-key overlap with English reference | 717/1087 |
| **English reference keys without German catalog match** | **370** |
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

## Remaining release blockers (priority order)

1. **Translate/verify and wire the remaining GUI reference keys.** The full-app baseline has 850 keys without a match in any of the four German staging catalogs. This is not proof every key appears on the same screen, but each is a possible source of Turkish fallback. Cover every active screen before claiming 'German-only'.
2. **Install a German DOM/runtime UI renderer** equivalent in quality to the English renderer, including dynamic values, result panels, progression, profile, Premium and every Quran control. The current startup injects English and Arabic rendering, not a released German renderer.
3. **Complete independent religious/native German review** of 1,500 base questions, live variants and 90 Quran meaning drafts, maintaining exact right-answer source identity, Qur'an verse identity and unmodified Arabic recitation.
4. **Complete rights/copyright and source attribution review** of Quran meaning publication and any other translated religious content.
5. **Run real mobile and desktop Chrome E2E on a full German release candidate**, including first-run language selection, changing language while logged in, all tabs, multiple question types, wrong/correct feedback, audio, results, Premium, Quran, review and profile.
6. **Only after those gates and explicit QA acceptance**, update release manifest and assets, verify startup hashes, merge to main and inspect the actual GitHub Pages URL.

## Exhaustive unmatched German UI source-key list

Current **370** unmatched UI reference keys after four batches of 120 translations (480 of the original 850 mapped). English meanings below are context aids, not the German UI values.

| # | Turkish source key | English reference meaning |
|---:|---|---|
| 1 | Kavramları Ayırma Özeti | Review: distinguishing concepts |
| 2 | Şart mı, İman Esası mı? | Pillar or Article of Faith? |
| 3 | Namaz ve Melekler | Prayer and angels |
| 4 | Sınıflandırma | Classification |
| 5 | Kategori Eşleştirme | Category matching |
| 6 | Öğrenci Hatası | A learner's mistake |
| 7 | Hac vs Kitaplar | Hajj and the books |
| 8 | Senaryo - Sınıflandırma | Scenario: classification |
| 9 | Ortak Kategori | A shared category |
| 10 | Hata Bulma 2 | Finding the mistake 2 |
| 11 | Eşleştirme | Matching |
| 12 | Kategori Ayrımı | Distinguishing categories |
| 13 | Hata Bulma 3 | Finding the mistake 3 |
| 14 | Kategori Farkı | Category difference |
| 15 | Sınıflandırma Eşleştirme | Classification matching |
| 16 | Sınıflandırma Özeti | Classification review |
| 17 | Senaryo Analizi | Scenario analysis |
| 18 | Karışık Liste | Mixed list |
| 19 | Günlük Hayatta Kavramlar | Concepts in Daily Life |
| 20 | Ölüm Sonrası Hayat | Life after death |
| 21 | Vahiy ve Kitaplar | Revelation and the books |
| 22 | Allah'ın Bilgisi | Allah's knowledge |
| 23 | Yanlış Bağlam | Incorrect context |
| 24 | Hata Bulma 4 | Finding the mistake 4 |
| 25 | Senaryo Tanıma | Recognising a scenario |
| 26 | Senaryo Tanıma 2 | Recognising a scenario 2 |
| 27 | Genel Soru | General question |
| 28 | Hata Bulma 5 | Finding the mistake 5 |
| 29 | Senaryo | Scenario |
| 30 | Kavram Genelleme | Generalising concepts |
| 31 | Senaryo Çoktan Seçmeli | Multiple-choice scenario |
| 32 | Kavram Çoktan Seçmeli | Multiple-choice concept question |
| 33 | Senaryo Özeti | Scenario summary |
| 34 | Kısım Öncesi Akıllı Tekrar | Smart Review Before the Next Section |
| 35 | U1-U5 Tekrar | U01-U05 review |
| 36 | Kelime-i Şehadet ve İman | The Shahada and faith |
| 37 | Şartlar ve Esaslar Sayısı | The number of pillars and articles |
| 38 | Hata Bulma | Finding the mistake |
| 39 | Senaryo Tekrarı | Scenario review |
| 40 | Temel Kavramlar | Main concepts |
| 41 | Hac ve Kader | Hajj and divine decree |
| 42 | Genel Bilgi | General knowledge |
| 43 | Hata Bulma Kısım Özeti | Section review: finding mistakes |
| 44 | Senaryo Özeti 2 | Scenario summary 2 |
| 45 | İman Esasları Challenge | Articles of Faith Challenge |
| 46 | Kadere İman Senaryo | Scenario: belief in divine decree |
| 47 | Eşleştirme Challenge | Matching challenge |
| 48 | Kategori Farkı 2 | Category difference 2 |
| 49 | Eşleştirme Challenge 2 | Matching challenge 2 |
| 50 | Temel Kural | Main principle |
| 51 | Kadere İman Kapsamı | The scope of belief in divine decree |
| 52 | Peygamberlere İman Kapsamı | The scope of belief in the prophets |
| 53 | Kavram Geneli | Concept overview |
| 54 | Final Sorusu | Final question |
| 55 | Melekler Kimdir? | Who Are Angels? |
| 56 | İman Esası | An article of faith |
| 57 | Kaynak Bilinci | Awareness of sources |
| 58 | Tevhid Sınırı | The bounds of tawhid |
| 59 | Temel Ayrımlar | Main distinctions |
| 60 | Elçilik | Messengership |
| 61 | Kaynak Sınırı | The limits of sources |
| 62 | İmanın Anlamı | The meaning of faith |
| 63 | Kaynak Okuryazarlığı | Understanding sources |
| 64 | Meleklerin Özellikleri | The Qualities of Angels |
| 65 | İtaat | Obedience |
| 66 | Ayetlerle Özellikler | Qualities described in verses |
| 67 | Kanatlar | Wings |
| 68 | Tesbih | Glorifying Allah |
| 69 | Kulluk Özeti | Summarising servanthood |
| 70 | Cebrâil ve Vahiy | Gabriel and Revelation |
| 71 | Vahiy Rolleri | Roles in revelation |
| 72 | Meleklere Saygı | Respect for angels |
| 73 | Vahiy Akışı | The conveyance of revelation |
| 74 | Kur'an'da Meleklerin Görevleri | The Duties of Angels in the Quran |
| 75 | Amellerin Kaydı | Recording deeds |
| 76 | Kayıt ve İlahi Bilgi | Recording and divine knowledge |
| 77 | Görevler | Duties |
| 78 | Ölüm Meleği | The angel of death |
| 79 | Görev Çeşitliliği | Different duties |
| 80 | Bilginin Sınırı | The limits of knowledge |
| 81 | Müminler İçin Dua | Supplication for believers |
| 82 | Tevhid ve Dua | Tawhid and supplication |
| 83 | Meleklere İmanın Anlamı | The Meaning of Belief in Angels |
| 84 | İman ve Hayat | Faith and life |
| 85 | Gayba İman | Belief in the unseen |
| 86 | Öğrenme Yöntemi | Learning method |
| 87 | Yanlış Anlamaları Düzelt | Correct Misunderstandings |
| 88 | İblîs ve Melekler | Iblis and angels |
| 89 | Yanlış Bilgiyi Düzeltme | Correcting misinformation |
| 90 | Melekler Ustalığı | Mastering Angels |
| 91 | Ustalık | Mastery |
| 92 | Kitaplara İman Nedir? | What Is Belief in the Books? |
| 93 | Önceki Vahiyler | Earlier revelations |
| 94 | Vahyin Kaynağı | The source of revelation |
| 95 | Tevrat, İncil, Zebur ve Sahifeler | The Torah, the Gospel, the Zabur and the Scrolls |
| 96 | Kitap ve Peygamber | Book and prophet |
| 97 | Sahifeler | The scrolls |
| 98 | Kitapların İsimleri | The names of the books |
| 99 | Kur'an'ın Konumu | The Quran's position |
| 100 | Vahiy ve Yorum | Revelation and interpretation |
| 101 | Kur'an'ın Ölçüsü | The Quran's standard |
| 102 | İlahi Kitapların Ortak Kaynağı | The Shared Source of Divine Books |
| 103 | Kaynak Birliği | A shared source |
| 104 | Kitapların Nitelikleri | The qualities of the books |
| 105 | Hidayet ve Nur | Guidance and light |
| 106 | Vahyin İşlevi | The purpose of revelation |
| 107 | Kaynak ve Rehberlik | Source and guidance |
| 108 | Kur'an ve Önceki Vahiy | The Quran and earlier revelation |
| 109 | Vahyin Akışı | The conveyance of revelation |
| 110 | Vahiy Sürekliliği | Continuity of revelation |
| 111 | Kur'an'ın Rehberliği ve Korunması | The Quran's Guidance and Preservation |
| 112 | Kur'an'ın Rehberliği | The Quran's guidance |
| 113 | Kur'an'ın Korunması | The Quran's preservation |
| 114 | Kur'an'ın Nitelikleri | The Quran's qualities |
| 115 | Kur'an'la İlişki | Engaging with the Quran |
| 116 | Kur'an'ın Kimliği | The Quran's identity |
| 117 | Vahiy ve İnsan Sözü | Revelation and human speech |
| 118 | Kaynak Ahlakı | Ethical use of sources |
| 119 | Kitaplara İman Ustalığı | Mastering Belief in the Books |
| 120 | Peygamberlere İman Nedir? | What Is Belief in the Prophets? |
| 121 | İman Bütünlüğü | Complete faith |
| 122 | Peygamberlerin Bilgisi | The knowledge of prophets |
| 123 | İman ve Derece | Faith and rank |
| 124 | Peygamberlerin İnsan Oluşu ve Vahiy | The Humanity of Prophets and Revelation |
| 125 | İnsan ve Vahiy | Humanity and revelation |
| 126 | Peygamberlerin İnsan Oluşu | The humanity of prophets |
| 127 | Örneklik | Example |
| 128 | Tebliğ, Müjde ve Uyarı | Conveyance, Good News and Warnings |
| 129 | Peygamberlerin Görevi | The duties of prophets |
| 130 | İnsan Sorumluluğu | Human responsibility |
| 131 | Ortak Çağrı ve İman Birliği | The Shared Call and Unity of Faith |
| 132 | Tevhid Çağrısı | The call to tawhid |
| 133 | Ortak Mesaj | The shared message |
| 134 | Ayetlerle Peygamberlik | Prophethood in the verses |
| 135 | Gönderiliş Gayesi | The purpose of sending prophets |
| 136 | Hz. Muhammed ve Risalet | Muhammad and Messengership |
| 137 | Evrensel Risalet | Universal messengership |
| 138 | Örneklik ve Tevhid | Example and tawhid |
| 139 | Tevhid ve Risalet | Tawhid and messengership |
| 140 | Peygamberlere İman Ustalığı | Mastering Belief in the Prophets |
| 141 | Vahiy ve Tebliğ | Revelation and conveyance |
| 142 | Ahiret Gününe İman Nedir? | What Is Belief in the Last Day? |
| 143 | Ahiret Kavramı | The concept of the Hereafter |
| 144 | İman ve İyilik | Faith and goodness |
| 145 | Karşılık | Recompense |
| 146 | Ahiret Akışı | The sequence of the Hereafter |
| 147 | Kıyametin Vakti | The time of the Hour |
| 148 | Ölüm ve Dünya Hayatının Sonu | Death and the End of Worldly Life |
| 149 | Ölüm Bilinci | Awareness of death |
| 150 | Ölüm Sonrası | After death |
| 151 | Pişmanlık | Regret |
| 152 | Yanlış Anlamayı Düzeltme | Correcting a misunderstanding |
| 153 | Ölüm ve Ahiret | Death and the Hereafter |
| 154 | Kıyamet ve Yeniden Diriliş | The Hour and Resurrection |
| 155 | Yeniden Diriliş | Resurrection |
| 156 | Hesap, Amel Defteri ve İlahi Adalet | Reckoning, the Record of Deeds and Divine Justice |
| 157 | İlahi Adalet | Divine justice |
| 158 | Amel Defteri | The record of deeds |
| 159 | İyilik | Goodness |
| 160 | Ahiret Bilincinin Hayata Etkisi | How Awareness of the Hereafter Affects Life |
| 161 | Ahiret ve Ahlak | The Hereafter and good character |
| 162 | Dünya ve Ahiret | This world and the Hereafter |
| 163 | Umut ve Adalet | Hope and justice |
| 164 | Dengeli Öğrenme | Balanced learning |
| 165 | Dengeli Ahiret Bilinci | Balanced awareness of the Hereafter |
| 166 | Ahiret İmanı Ustalığı | Mastering Belief in the Hereafter |
| 167 | Kader ve Kazaya İman Nedir? | What Is Belief in Divine Decree and Its Fulfilment? |
| 168 | Kader ve Kazaya İman | Belief in divine decree and its fulfilment |
| 169 | Allah'ın İlmi, Ölçüsü ve Takdiri | Allah's Knowledge, Measure and Decree |
| 170 | İnsan İradesi ve Sorumluluk | Human Will and Responsibility |
| 171 | Çaba, Tedbir ve Tevekkül | Effort, Precautions and Trust in Allah |
| 172 | Musibet, Sabır ve Denge | Hardship, Patience and Balance |
| 173 | Kader İnancı Ustalığı | Mastering Belief in Divine Decree |
| 174 | İbadet Nedir? | What Is Worship? |
| 175 | Niyet ve İhlas | Intention and Sincerity |
| 176 | İbadetin Hayata Etkisi | How Worship Affects Life |
| 177 | Temizlik ve Taharet | Cleanliness and Ritual Purification |
| 178 | Abdestin Temeli | The Foundations of Ablution |
| 179 | Abdest Adımlarını Tanı | Learn the Steps of Ablution |
| 180 | Teyemmüm ve Kolaylık | Dry Ablution and Ease |
| 181 | Ortak Temel ve Farklar | Shared Foundations and Differences |
| 182 | Namaza Hazırlık | Preparing for Prayer |
| 183 | Yatsı namazı | Night prayer |
| 184 | Öğle namazı | Midday prayer |
| 185 | Vakit ve Kıble | Prayer Time and Direction |
| 186 | Sabah namazı | Dawn prayer |
| 187 | Akşam namazı | Sunset prayer |
| 188 | Şartları Eşleştir | Match the Conditions |
| 189 | İkindi namazı | Afternoon prayer |
| 190 | Hazırlık Senaryoları | Preparation Scenarios |
| 191 | Beş Vakit | The Five Daily Prayers |
| 192 | Namazın Yapısı | The Structure of Prayer |
| 193 | Kıyam, Kıraat, Rükû, Secde | Standing, Recitation, Bowing and Prostration |
| 194 | Rekâtı Kur | Build a Prayer Unit |
| 195 | Namaz İçinde Akış | The Sequence Within Prayer |
| 196 | Mazerette Kolaylık | Ease in Cases of Difficulty |
| 197 | Oruç Nedir? | What Is Fasting? |
| 198 | Bilerek yemek | Eating deliberately |
| 199 | Yeme | Eating |
| 200 | Ramazan ve Takva | Ramadan and Mindfulness of Allah |
| 201 | Unutarak yemek | Eating forgetfully |
| 202 | Cinsel ilişki | Sexual intercourse |
| 203 | İmsak ve İftar | Beginning and Breaking the Fast |
| 204 | İçme | Drinking |
| 205 | Oruçlu Günlük Hayat | Daily Life While Fasting |
| 206 | Mazeret ve Kaza | Concessions and Making Up Missed Fasts |
| 207 | DEEN’e hoş geldin | Welcome to DEEN |
| 208 | İslam’ı adım adım, sakin ve düzenli şekilde öğren. | Learn about Islam step by step, calmly and consistently. |
| 209 | Sana nasıl hitap edelim? | What should we call you? |
| 210 | Adın veya kullanıcı adın | Your name or username |
| 211 | Bu isim profilinde görünecek. | This name will appear on your profile. |
| 212 | Yolcu | Traveller |
| 213 | Yaşını yazmana gerek yok; sana en rahat gelen öğrenme stilini seç. | You do not need to enter your age. Choose the style that suits you best. |
| 214 | Çocuk | Child |
| 215 | Genç | Teen |
| 216 | Yetişkin | Adult |
| 217 | Kısa, sade ve görsel ağırlıklı anlatım | Short, simple explanations with visual support |
| 218 | Açık, akıcı ve günlük hayata yakın örnekler | Clear, fluent explanations with everyday examples |
| 219 | Daha derin, dengeli ve düzenli açıklamalar | Deeper, balanced and structured explanations |
| 220 | Yol arkadaşını seç | Choose your companion |
| 221 | Seçtiğin hayvan profilinde, serilerinde ve ders sonunda sana eşlik edecek. | Your animal will accompany you on your profile, streaks and lesson results. |
| 222 | Aslan | Lion |
| 223 | Kurt | Wolf |
| 224 | Baykuş | Owl |
| 225 | Kaplumbağa | Turtle |
| 226 | Kartal | Eagle |
| 227 | Kedi | Cat |
| 228 | Cesaret | Courage |
| 229 | Kararlılık | Determination |
| 230 | Odak | Focus |
| 231 | Sakinlik | Calm |
| 232 | Önce bir hayvan seç | Choose an animal first |
| 233 | Günde ne kadar zaman ayırabilirsin? | How much time can you spend each day? |
| 234 | Kısa ama düzenli ilerlemek daha iyi sonuç verir. | Short, regular practice leads to better results. |
| 235 | Hızlı ve hafif tempo · 1 mini ders | Quick and light · 1 short lesson |
| 236 | Dengeli günlük ritim · 2 mini ders | A balanced daily pace · 2 short lessons |
| 237 | Daha yoğun öğrenme · 3 mini ders | More intensive learning · 3 short lessons |
| 238 | Hazırsın | You are ready |
| 239 | İslam Nedir? | What Is Islam? |
| 240 | Temel kavramlarla tanış. İnanç, ibadet ve ahlak arasındaki bağı keşfet. | Meet the main concepts. Discover the connection between faith, worship and good character. |
| 241 | Allah’a İman | Belief in Allah |
| 242 | Tevhidi ve imanın hayata yansımalarını öğren. | Learn about Allah's oneness and how faith is reflected in life. |
| 243 | Şehadetin anlamını tanı; parçaları arasında bağ kur. | Learn the meaning of the testimony of faith and connect its parts. |
| 244 | İslam’ın Beş Şartı | The Five Pillars of Islam |
| 245 | Beş şartı tanı, doğru bağlamlarıyla eşleştir. | Recognise the five pillars and match them with their correct contexts. |
| 246 | İmanın Esaslarına Giriş | Introduction to the Articles of Faith |
| 247 | Altı iman esasını öğren ve birbirinden ayırt et. | Learn the six articles of faith and distinguish between them. |
| 248 | İlk 5 ünitedeki bilgini tek bir ustalık sınavında bir araya getir. | Bring together what you learned in the first five units in one mastery test. |
| 249 | KISIM 2 · İMAN | SECTION 2 · FAITH |
| 250 | Meleklere iman konusunu adım adım pekiştir. | Reinforce belief in angels step by step. |
| 251 | Kitaplara imanla ilgili temel kavramları keşfet. | Discover the main concepts of belief in the revealed books. |
| 252 | Peygamberlere iman konusundaki bilgini güçlendir. | Strengthen your knowledge of belief in the prophets. |
| 253 | Ahiret Gününe İman | Belief in the Last Day |
| 254 | Ahiret inancını tanı, hatırla ve pekiştir. | Recognise, recall and reinforce belief in the Hereafter. |
| 255 | Kader ve kaza kavramlarını kaynak notlarıyla öğren. | Learn the concepts of divine decree and its fulfilment with source notes. |
| 256 | KISIM 2 FİNALİ | SECTION 2 FINAL |
| 257 | İman Ustalığı | Faith Mastery |
| 258 | İman bölümündeki 5 ünitenin bilgisini bir araya getir. | Bring together your knowledge from the five units on faith. |
| 259 | KISIM 3 · İBADET | SECTION 3 · WORSHIP |
| 260 | Fıkıh kapsamı · Ortak temel | Scope of Islamic jurisprudence · Shared foundation |
| 261 | Bu sürüm mezheplerin ortak çekirdeğini öğretir. | This version teaches the shared core of the schools of law. |
| 262 | İbadet Bilinci | Awareness of Worship |
| 263 | İbadetin anlamını, niyet ve ihlası; ibadet bilgisinin nasıl öğrenildiğini kavra. | Understand the meaning of worship, intention and sincerity, and how to learn about worship. |
| 264 | Temizlik ve Abdest | Cleanliness and Ablution |
| 265 | Taharetin anlamını, abdestin Kur’an’daki ortak temelini ve teyemmümdeki kolaylığı öğren. | Learn the meaning of ritual purification, ablution's shared foundation in the Quran, and the ease offered by dry ablution. |
| 266 | Namaz vakti, kıble, temizlik, niyet ve beş vakit farz rekâtların temelini öğren. | Learn the foundations of prayer time, direction, purification, intention and obligatory units in the five daily prayers. |
| 267 | Namazın temel rükünlerini, bir rekâtın akışını ve mazeretteki kolaylık ilkesini öğren. | Learn the main pillars of prayer, the sequence of a unit, and the principle of ease when difficulties arise. |
| 268 | Oruç ve Ramazan | Fasting and Ramadan |
| 269 | Ramazan orucunun anlamını, imsak-iftar sınırını, takva amacını ve temel mazeretleri öğren. | Learn the meaning of fasting in Ramadan, its dawn-to-sunset limits, its aim of mindfulness of Allah, and the main concessions. |
| 270 | KISIM 3 FİNALİ | SECTION 3 FINAL |
| 271 | İbadet Temelleri Ustalığı | Foundations of Worship Mastery |
| 272 | İbadet bölümündeki ortak-temel bilgileri bir araya getir. | Bring together the shared foundations from the units on worship. |
| 273 | Seri detayları | Streak details |
| 274 | Neden şimdi? | Why now? |
| 275 | Yeni ilerleme | New progress |
| 276 | HAFTALIK RİTİM | WEEKLY RHYTHM |
| 277 | USTALIK SINAVINI BAŞLAT | START THE MASTERY TEST |
| 278 | ADAPTIVE MEMORY ENGINE · v6.4 | ADAPTIVE MEMORY ENGINE · v6.4 |
| 279 | Ünite bazında | By unit |
| 280 | Bu skor yalnız öğrenme ve hatırlama performansını yönetir; dinî yeterlilik veya ibadet değeri değildir. | This score manages learning and recall performance only; it does not measure religious competence or the value of worship. |
| 281 | 1. gün + 7. gün | Day 1 + day 7 |
| 282 | Dersi bitirdiğin gün değil, unutma başlamadan hemen önce hatırla. | Recall just before forgetting begins, rather than only on the day you finish a lesson. |
| 283 | Yarın | Tomorrow |
| 284 | 5 farklı günde Bugünkü Yolculuk'u tamamla | Complete Today's Journey on 5 different days |
| 285 | İlk Adım | First Step |
| 286 | İlk dersini tamamla | Complete your first lesson |
| 287 | İstikrar | Consistency |
| 288 | Bilgi Yolcusu | Knowledge Traveller |
| 289 | 25 ders tamamla | Complete 25 lessons |
| 290 | Usta Öğrenci | Master Learner |
| 291 | Bir ünitede %100 ustalık | Reach 100% mastery in one unit |
| 292 | Kısım Ustası | Section Master |
| 293 | Bir kısım finalini geç | Pass a section final |
| 294 | Öğrenerek 1000 XP kazan | Earn 1000 XP through learning |
| 295 | Keskin Odak | Sharp Focus |
| 296 | 10 kusursuz ders tamamla | Complete 10 perfect lessons |
| 297 | Hatırlama Ritmi | Recall Rhythm |
| 298 | 10 tekrar dersi tamamla | Complete 10 review lessons |
| 299 | Uzun Yol | Long Journey |
| 300 | 50 ders tamamla | Complete 50 lessons |
| 301 | Bilgi Birikimi | Knowledge Gained |
| 302 | Öğrenerek 5000 XP kazan | Earn 5000 XP through learning |
| 303 | Öğrenme oyunlaştırılır; ibadet puanlanmaz. Dinî içerikler uzman incelemesi bekler. | Learning uses game elements; worship is not scored. Religious content awaits expert review. |
| 304 | DEEN ADMIN | DEEN ADMIN |
| 305 | P · DEVELOPER CONTROL CENTER | P · DEVELOPER CONTROL CENTRE |
| 306 | HIZLI İLERLEME | QUICK PROGRESS |
| 307 | TÜM BÖLÜMLERİ GEÇ | COMPLETE ALL SECTIONS |
| 308 | TÜM BÖLÜMLERİ SIFIRLA | RESET ALL SECTIONS |
| 309 | KISIM 1’İ GEÇ | COMPLETE SECTION 1 |
| 310 | KISIM 1’İ SIFIRLA | RESET SECTION 1 |
| 311 | KISIM 2’Yİ GEÇ | COMPLETE SECTION 2 |
| 312 | KISIM 2’Yİ SIFIRLA | RESET SECTION 2 |
| 313 | KISIM 3’Ü GEÇ | COMPLETE SECTION 3 |
| 314 | KISIM 3’Ü SIFIRLA | RESET SECTION 3 |
| 315 | TÜM ROZETLERİ AÇ | UNLOCK ALL BADGES |
| 316 | TÜM KİLİTLERİ AÇ | UNLOCK EVERYTHING |
| 317 | TEK AŞAMA KONTROLÜ | INDIVIDUAL STAGE CONTROL |
| 318 | SEÇİLİ AŞAMAYI GEÇ | COMPLETE SELECTED STAGE |
| 319 | AŞAMAYI GERİ AL | UNDO STAGE |
| 320 | ÖĞREN EKRANINA DÖN | RETURN TO LEARN |
| 321 | ÜNİTE KONTROLÜ | UNIT CONTROL |
| 322 | SEÇİLİ ÜNİTEYİ GEÇ | COMPLETE SELECTED UNIT |
| 323 | ÜNİTEYİ GERİ AL | UNDO UNIT |
| 324 | KISIM 1 FİNALİNİ GEÇ | COMPLETE SECTION 1 FINAL |
| 325 | KISIM 2 FİNALİNİ GEÇ | COMPLETE SECTION 2 FINAL |
| 326 | KISIM 3 FİNALİNİ GEÇ | COMPLETE SECTION 3 FINAL |
| 327 | SINIRSIZ ENERJİ | UNLIMITED ENERGY |
| 328 | 100 GÜN SERİ | 100-DAY STREAK |
| 329 | NORMAL ENERJİ | NORMAL ENERGY |
| 330 | ROZETLERİ KİLİTLE | LOCK BADGES |
| 331 | GİRİŞ EKRANINA DÖN | RETURN TO ENTRY |
| 332 | ONBOARDING’İ BAŞTAN AÇ | RESTART ONBOARDING |
| 333 | PROFİLE GİT | GO TO PROFILE |
| 334 | ÖĞREN EKRANINA GİT | GO TO LEARN |
| 335 | “Giriş ekranına dön” mevcut progress’i silmez. “Onboarding’i baştan aç” sadece onboarding tamamlandı bayrağını sıfırlar. | 'Return to entry' preserves progress. 'Restart onboarding' resets only the onboarding completion flag. |
| 336 | ROZET + RUNTIME AUDIT | BADGE + RUNTIME AUDIT |
| 337 | STATE JSON KOPYALA | COPY STATE JSON |
| 338 | İLERLEMEYİ SIFIRLA | RESET PROGRESS |
| 339 | TAM SIFIRLAMA | FULL RESET |
| 340 | KUR’AN · PRODUCT ANALYTICS | QURAN · PRODUCT ANALYTICS |
| 341 | KUR’AN · UZMAN DOĞRULAMA | QURAN · EXPERT VERIFICATION |
| 342 | KAYNAK GÖRÜNÜR | SOURCE VISIBLE |
| 343 | SES KAYDI HAZIR | AUDIO RECORDING READY |
| 344 | UZMAN ONAYLI | EXPERT APPROVED |
| 345 | İNCELEMEDE | UNDER REVIEW |
| 346 | TÜRKÇE MEAL | TURKISH TRANSLATION |
| 347 | ÖĞRENME NOTU | LEARNING NOTE |
| 348 | Tanımlı değil | Not defined |
| 349 | TASLAĞI KAYDET | SAVE DRAFT |
| 350 | YAYINA ONAYLA | APPROVE FOR PUBLICATION |
| 351 | İNCELEMEYE GERİ AL | RETURN TO REVIEW |
| 352 | SONRAKİ BEKLEYEN | NEXT PENDING ITEM |
| 353 | Henüz uzman işlemi yok. | No expert action yet. |
| 354 | Admin panelini kapat | Close admin panel |
| 355 | Pencereyi kapat | Close window |
| 356 | Belirgin tekrar eden hata yok. Sistem yeni cevaplarla öğrenme profilini güncellemeye devam edecek. | No clear repeated mistakes. The system will keep updating your learning profile with new answers. |
| 357 | Biriktirilebilir ilerleme madalyaları. Ek XP verilmez. | Collectible progress medals. No extra XP is awarded. |
| 358 | Kaynaklı Arapça metin ve kayıtlı meal verisinden otomatik oluşturuldu. | Generated from sourced Arabic text and recorded translation data. |
| 359 | Beyyine | Al-Bayyinah |
| 360 | SON ÜNİTE | LAST UNIT |
| 361 | KISIM 1 FİNALİ | SECTION 1 FINAL |
| 362 | KİLİTLİ · USTALIK SINAVI | LOCKED · MASTERY TEST |
| 363 | Temeller Ustalığı | Foundations Mastery |
| 364 | Geçerli mezhep farklılıkları yanlış cevap olarak puanlanmaz; bütün yeni içerikler uzman incelemesi bekler. | Valid differences between schools of law are not graded as incorrect; all new content awaits expert review. |
| 365 | Fâtiha | Al-Fatihah |
| 366 | Felak | Al-Falaq |
| 367 | Nâs | An-Nas |
| 368 | Mâûn | Al-Ma'un |
| 369 | İnşirah | Ash-Sharh |
| 370 | Zilzâl | Az-Zalzalah |

## Audit scope limitation

The catalog comparison uses the English reference file, which is not itself a complete enumeration of every dynamically assembled Turkish screen string. Runtime/browser QA may reveal **additional** Turkish strings. The count above is therefore **not a certified ceiling** on remaining German work.

**Do not merge or deploy the German release until all blocker conditions are cleared.**
