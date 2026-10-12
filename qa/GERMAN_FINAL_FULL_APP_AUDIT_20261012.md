# DEEN German final full-app locale audit — 2026-10-12

> **Deployment decision: BLOCKED.** This audit is intentionally not a religious, legal or native-language approval. A green staging CI does not mean the German application is ready for production.

## Verified inventory

| Surface | Verified status |
|---|---|
| German entry/onboarding | German copy exists; no evidence of an end-to-end approved production German lesson flow |
| English UI translation reference | 1087 source strings |
| German staged UI dictionaries | 952 distinct German strings across seven files |
| Source-key overlap with English reference | 597/1087 |
| **English reference keys without German catalog match** | **490** |
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

## Remaining release blockers (priority order)

1. **Translate/verify and wire the remaining GUI reference keys.** The full-app baseline has 850 keys without a match in any of the four German staging catalogs. This is not proof every key appears on the same screen, but each is a possible source of Turkish fallback. Cover every active screen before claiming 'German-only'.
2. **Install a German DOM/runtime UI renderer** equivalent in quality to the English renderer, including dynamic values, result panels, progression, profile, Premium and every Quran control. The current startup injects English and Arabic rendering, not a released German renderer.
3. **Complete independent religious/native German review** of 1,500 base questions, live variants and 90 Quran meaning drafts, maintaining exact right-answer source identity, Qur'an verse identity and unmodified Arabic recitation.
4. **Complete rights/copyright and source attribution review** of Quran meaning publication and any other translated religious content.
5. **Run real mobile and desktop Chrome E2E on a full German release candidate**, including first-run language selection, changing language while logged in, all tabs, multiple question types, wrong/correct feedback, audio, results, Premium, Quran, review and profile.
6. **Only after those gates and explicit QA acceptance**, update release manifest and assets, verify startup hashes, merge to main and inspect the actual GitHub Pages URL.

## Exhaustive unmatched German UI source-key list

Current **490** unmatched UI reference keys after the first three 120-key German drafting batches (360 newly mapped out of an original 850). The English reference glosses below are context aids, not imported German translations.

| # | Turkish source key | English reference meaning |
|---:|---|---|
| 1 | Şartlar ve İnançlar | Pillars and beliefs |
| 2 | Şehadet ve Namaz | The Shahada and Prayer |
| 3 | Şehadetin Anlamı | The meaning of the Shahada |
| 4 | Düzenli İbadet Namaz | Prayer as regular worship |
| 5 | İlk Şartın Yeri | The place of the first pillar |
| 6 | Namazın Kapsamı | The scope of prayer |
| 7 | Şehadet ve Namaz İlişkisi | The connection between the Shahada and prayer |
| 8 | Şehadetin Yeri | The place of the Shahada |
| 9 | Namazın Önemi | The importance of prayer |
| 10 | İnanç Beyanı | Declaration of faith |
| 11 | Düzenli İbadet | Regular worship |
| 12 | Şehadet ve Namazın Kapsamı | The scope of the Shahada and prayer |
| 13 | Kelime-i Şehadet'in Yeri | The place of the Shahada |
| 14 | İlk İki Şart | The first two pillars |
| 15 | Namaz Kavramı | The concept of prayer |
| 16 | Oruç, Zekât ve Hac | Fasting, Zakat and Hajj |
| 17 | Malî İbadet Zekât | Zakat as worship involving wealth |
| 18 | Mekke'ye Yolculuk | Journey to Mecca |
| 19 | Zekât Kavramı | The concept of zakat |
| 20 | Oruç Kavramı | The concept of fasting |
| 21 | Son Üç Şartın Özellikleri | Features of the last three pillars |
| 22 | Hac Kavramı | The concept of Hajj |
| 23 | Zekâtın Doğası | The nature of zakat |
| 24 | Oruç ve İbadet | Fasting and worship |
| 25 | Hac Şartı | The pillar of Hajj |
| 26 | Zekât Uygulaması | Practising zakat |
| 27 | Oruç, Zekât, Hac Eşleştirme | Matching fasting, zakat and Hajj |
| 28 | Hac İbadeti | Hajj as worship |
| 29 | İbadet ve Tanım Eşleştirme | Matching worship to definitions |
| 30 | Şehadet ve Hac Eşleştirme | Matching the Shahada and Hajj |
| 31 | Hatalı Eşleştirme Bulma | Finding an incorrect match |
| 32 | Doğru Eşleştirme Seçimi | Choosing the correct match |
| 33 | Kavram Eşleştirme | Concept matching |
| 34 | Hatalı Eşleştirme Bulma 2 | Finding an incorrect match 2 |
| 35 | Şartlar ve Esaslar Ayrımı | Distinguishing pillars and articles of faith |
| 36 | Hatalı İfadeyi Bul | Find the incorrect statement |
| 37 | İbadet Eşleştirme | Matching acts of worship |
| 38 | Kavram Karşılaştırma | Comparing concepts |
| 39 | Hatalı Kavramı Bulma | Finding the incorrect concept |
| 40 | Geniş Eşleştirme | Extended matching |
| 41 | Hac ve Oruç Eşleştirme | Matching Hajj and fasting |
| 42 | Kavram Testi | Concept check |
| 43 | Son Eşleştirme | Final matching |
| 44 | Temel Kavram Seçimi | Choosing a main concept |
| 45 | Hangisi Hangi Şart? | Which Pillar Is It? |
| 46 | Günlük Hayatta Oruç | Fasting in daily life |
| 47 | Günlük Hayatta Zekât | Zakat in daily life |
| 48 | Günlük Hayatta Namaz | Prayer in daily life |
| 49 | Uygulama Hatası | A mistake in practice |
| 50 | Hac İbadeti Uygulaması | Practising Hajj |
| 51 | Şehadet Uygulaması | Practising the Shahada |
| 52 | Hatalı Düşünce Tespiti | Finding a mistaken idea |
| 53 | Senaryo: Yardım Kuruluşu | Scenario: a charity |
| 54 | Senaryo: Seyahat | Scenario: travelling |
| 55 | Hata Bulma: Şart ve İman Karışımı | Find the mistake: confusing pillars and faith |
| 56 | Senaryo: Arkadaşın Sorusu | Scenario: a friend's question |
| 57 | Senaryo: Aile Sohbeti | Scenario: family conversation |
| 58 | Senaryo: Televizyon Programı | Scenario: television programme |
| 59 | Hata Bulma: Eksik Şart | Find the mistake: a missing pillar |
| 60 | Senaryo: İftar Vakti | Scenario: breaking the fast |
| 61 | Senaryo: İşçi ve İşveren | Scenario: employee and employer |
| 62 | Şartların Temeli | The foundation of the pillars |
| 63 | Esaslar Ayrımı | Distinguishing the articles |
| 64 | Namaz Kavramı Tekrarı | Reviewing prayer |
| 65 | Zekât Kavramı Tekrarı | Reviewing zakat |
| 66 | Şehadet Hatırlama | Recalling the Shahada |
| 67 | Oruç Hatırlama | Recalling fasting |
| 68 | Hac İbadeti Hatırlama | Recalling Hajj |
| 69 | Namaz ve Vakit | Prayer and time |
| 70 | Zekât Eksik Bilgi | Incomplete understanding of zakat |
| 71 | İmanın Şartı mı İslam'ın Şartı mı? | Article of faith or pillar of Islam? |
| 72 | Genel Tekrar | General review |
| 73 | Beş Şart Challenge | Five Pillars Challenge |
| 74 | Challenge: Tüm Şartlar | Challenge: all the pillars |
| 75 | Challenge: Hata Bulma | Challenge: find the mistake |
| 76 | Challenge: İlişkiler | Challenge: connections |
| 77 | Challenge: Oruç Senaryosu | Challenge: fasting scenario |
| 78 | Challenge: Esas ve Şart Ayrımı | Challenge: articles of faith and pillars |
| 79 | Challenge: Şehadet | Challenge: the Shahada |
| 80 | Challenge: Namaz | Challenge: prayer |
| 81 | Challenge: Hac Mekânı | Challenge: the place of Hajj |
| 82 | Challenge: Karmaşık Senaryo | Challenge: complex scenario |
| 83 | Challenge: Kavram Hatası 2 | Challenge: conceptual mistake 2 |
| 84 | Challenge: Şartları Sayma | Challenge: listing the pillars |
| 85 | Challenge: Günlük Kullanım | Challenge: daily practice |
| 86 | Challenge: Hatırlama | Challenge: recall |
| 87 | Challenge: Kapsayıcı Senaryo | Challenge: comprehensive scenario |
| 88 | İman Ne Demektir? | What Does Faith Mean? |
| 89 | İman Kavramı | The concept of faith |
| 90 | İman Esasları | The articles of faith |
| 91 | İmanın Temeli | The foundation of faith |
| 92 | İmanın Kapsamı | The scope of faith |
| 93 | Allah'a İman | Belief in Allah |
| 94 | İman Esasları Sayısı | The number of articles of faith |
| 95 | İman ve İnanç | Faith and belief |
| 96 | İman Kavramı Özeti | Reviewing the concept of faith |
| 97 | Altı Esası Tanı | Meet the Six Articles |
| 98 | İmanın 6 Esası | The six articles of faith |
| 99 | Kader ve Kaza | Divine decree and its fulfilment |
| 100 | Meleklere İman | Belief in angels |
| 101 | İmanın 6 Esası Eşleştirme | Matching the six articles of faith |
| 102 | Ahirete İman | Belief in the Hereafter |
| 103 | İmanın 6 Esası Liste | List of the six articles of faith |
| 104 | Hızlı Liste Eşleştirme | Quick list matching |
| 105 | Peygamberlere İman | Belief in the prophets |
| 106 | İmanın 6 Esası Toplu | The six articles together |
| 107 | Kitaplara İman | Belief in the books |
| 108 | Kavram Ayrımı | Distinguishing concepts |
| 109 | İmanın 6 Esası Eşleştirme 2 | Matching the six articles of faith 2 |
| 110 | Kavramları Ayır | Distinguish the Concepts |
| 111 | Ahirete İman Tanımı | Defining belief in the Hereafter |
| 112 | Meleklere İman Tanımı | Defining belief in angels |
| 113 | İman Esasları Anlamları | Meanings of the articles of faith |
| 114 | Kitaplara İman Tanımı | Defining belief in the books |
| 115 | Kadere İman Tanımı | Defining belief in divine decree |
| 116 | İman Esaslarını Eşleştirme 3 | Matching articles of faith 3 |
| 117 | Kadere İman Özelliği | A feature of belief in divine decree |
| 118 | İman Esaslarını Eşleştirme 4 | Matching articles of faith 4 |
| 119 | İman Esaslarını Eşleştirme 5 | Matching articles of faith 5 |
| 120 | Ahirete İman Vurgusu | Emphasising belief in the Hereafter |
| 121 | Kavramları Ayırma Özeti | Review: distinguishing concepts |
| 122 | Şart mı, İman Esası mı? | Pillar or Article of Faith? |
| 123 | Namaz ve Melekler | Prayer and angels |
| 124 | Sınıflandırma | Classification |
| 125 | Kategori Eşleştirme | Category matching |
| 126 | Öğrenci Hatası | A learner's mistake |
| 127 | Hac vs Kitaplar | Hajj and the books |
| 128 | Senaryo - Sınıflandırma | Scenario: classification |
| 129 | Ortak Kategori | A shared category |
| 130 | Hata Bulma 2 | Finding the mistake 2 |
| 131 | Eşleştirme | Matching |
| 132 | Kategori Ayrımı | Distinguishing categories |
| 133 | Hata Bulma 3 | Finding the mistake 3 |
| 134 | Kategori Farkı | Category difference |
| 135 | Sınıflandırma Eşleştirme | Classification matching |
| 136 | Sınıflandırma Özeti | Classification review |
| 137 | Senaryo Analizi | Scenario analysis |
| 138 | Karışık Liste | Mixed list |
| 139 | Günlük Hayatta Kavramlar | Concepts in Daily Life |
| 140 | Ölüm Sonrası Hayat | Life after death |
| 141 | Vahiy ve Kitaplar | Revelation and the books |
| 142 | Allah'ın Bilgisi | Allah's knowledge |
| 143 | Yanlış Bağlam | Incorrect context |
| 144 | Hata Bulma 4 | Finding the mistake 4 |
| 145 | Senaryo Tanıma | Recognising a scenario |
| 146 | Senaryo Tanıma 2 | Recognising a scenario 2 |
| 147 | Genel Soru | General question |
| 148 | Hata Bulma 5 | Finding the mistake 5 |
| 149 | Senaryo | Scenario |
| 150 | Kavram Genelleme | Generalising concepts |
| 151 | Senaryo Çoktan Seçmeli | Multiple-choice scenario |
| 152 | Kavram Çoktan Seçmeli | Multiple-choice concept question |
| 153 | Senaryo Özeti | Scenario summary |
| 154 | Kısım Öncesi Akıllı Tekrar | Smart Review Before the Next Section |
| 155 | U1-U5 Tekrar | U01-U05 review |
| 156 | Kelime-i Şehadet ve İman | The Shahada and faith |
| 157 | Şartlar ve Esaslar Sayısı | The number of pillars and articles |
| 158 | Hata Bulma | Finding the mistake |
| 159 | Senaryo Tekrarı | Scenario review |
| 160 | Temel Kavramlar | Main concepts |
| 161 | Hac ve Kader | Hajj and divine decree |
| 162 | Genel Bilgi | General knowledge |
| 163 | Hata Bulma Kısım Özeti | Section review: finding mistakes |
| 164 | Senaryo Özeti 2 | Scenario summary 2 |
| 165 | İman Esasları Challenge | Articles of Faith Challenge |
| 166 | Kadere İman Senaryo | Scenario: belief in divine decree |
| 167 | Eşleştirme Challenge | Matching challenge |
| 168 | Kategori Farkı 2 | Category difference 2 |
| 169 | Eşleştirme Challenge 2 | Matching challenge 2 |
| 170 | Temel Kural | Main principle |
| 171 | Kadere İman Kapsamı | The scope of belief in divine decree |
| 172 | Peygamberlere İman Kapsamı | The scope of belief in the prophets |
| 173 | Kavram Geneli | Concept overview |
| 174 | Final Sorusu | Final question |
| 175 | Melekler Kimdir? | Who Are Angels? |
| 176 | İman Esası | An article of faith |
| 177 | Kaynak Bilinci | Awareness of sources |
| 178 | Tevhid Sınırı | The bounds of tawhid |
| 179 | Temel Ayrımlar | Main distinctions |
| 180 | Elçilik | Messengership |
| 181 | Kaynak Sınırı | The limits of sources |
| 182 | İmanın Anlamı | The meaning of faith |
| 183 | Kaynak Okuryazarlığı | Understanding sources |
| 184 | Meleklerin Özellikleri | The Qualities of Angels |
| 185 | İtaat | Obedience |
| 186 | Ayetlerle Özellikler | Qualities described in verses |
| 187 | Kanatlar | Wings |
| 188 | Tesbih | Glorifying Allah |
| 189 | Kulluk Özeti | Summarising servanthood |
| 190 | Cebrâil ve Vahiy | Gabriel and Revelation |
| 191 | Vahiy Rolleri | Roles in revelation |
| 192 | Meleklere Saygı | Respect for angels |
| 193 | Vahiy Akışı | The conveyance of revelation |
| 194 | Kur'an'da Meleklerin Görevleri | The Duties of Angels in the Quran |
| 195 | Amellerin Kaydı | Recording deeds |
| 196 | Kayıt ve İlahi Bilgi | Recording and divine knowledge |
| 197 | Görevler | Duties |
| 198 | Ölüm Meleği | The angel of death |
| 199 | Görev Çeşitliliği | Different duties |
| 200 | Bilginin Sınırı | The limits of knowledge |
| 201 | Müminler İçin Dua | Supplication for believers |
| 202 | Tevhid ve Dua | Tawhid and supplication |
| 203 | Meleklere İmanın Anlamı | The Meaning of Belief in Angels |
| 204 | İman ve Hayat | Faith and life |
| 205 | Gayba İman | Belief in the unseen |
| 206 | Öğrenme Yöntemi | Learning method |
| 207 | Yanlış Anlamaları Düzelt | Correct Misunderstandings |
| 208 | İblîs ve Melekler | Iblis and angels |
| 209 | Yanlış Bilgiyi Düzeltme | Correcting misinformation |
| 210 | Melekler Ustalığı | Mastering Angels |
| 211 | Ustalık | Mastery |
| 212 | Kitaplara İman Nedir? | What Is Belief in the Books? |
| 213 | Önceki Vahiyler | Earlier revelations |
| 214 | Vahyin Kaynağı | The source of revelation |
| 215 | Tevrat, İncil, Zebur ve Sahifeler | The Torah, the Gospel, the Zabur and the Scrolls |
| 216 | Kitap ve Peygamber | Book and prophet |
| 217 | Sahifeler | The scrolls |
| 218 | Kitapların İsimleri | The names of the books |
| 219 | Kur'an'ın Konumu | The Quran's position |
| 220 | Vahiy ve Yorum | Revelation and interpretation |
| 221 | Kur'an'ın Ölçüsü | The Quran's standard |
| 222 | İlahi Kitapların Ortak Kaynağı | The Shared Source of Divine Books |
| 223 | Kaynak Birliği | A shared source |
| 224 | Kitapların Nitelikleri | The qualities of the books |
| 225 | Hidayet ve Nur | Guidance and light |
| 226 | Vahyin İşlevi | The purpose of revelation |
| 227 | Kaynak ve Rehberlik | Source and guidance |
| 228 | Kur'an ve Önceki Vahiy | The Quran and earlier revelation |
| 229 | Vahyin Akışı | The conveyance of revelation |
| 230 | Vahiy Sürekliliği | Continuity of revelation |
| 231 | Kur'an'ın Rehberliği ve Korunması | The Quran's Guidance and Preservation |
| 232 | Kur'an'ın Rehberliği | The Quran's guidance |
| 233 | Kur'an'ın Korunması | The Quran's preservation |
| 234 | Kur'an'ın Nitelikleri | The Quran's qualities |
| 235 | Kur'an'la İlişki | Engaging with the Quran |
| 236 | Kur'an'ın Kimliği | The Quran's identity |
| 237 | Vahiy ve İnsan Sözü | Revelation and human speech |
| 238 | Kaynak Ahlakı | Ethical use of sources |
| 239 | Kitaplara İman Ustalığı | Mastering Belief in the Books |
| 240 | Peygamberlere İman Nedir? | What Is Belief in the Prophets? |
| 241 | İman Bütünlüğü | Complete faith |
| 242 | Peygamberlerin Bilgisi | The knowledge of prophets |
| 243 | İman ve Derece | Faith and rank |
| 244 | Peygamberlerin İnsan Oluşu ve Vahiy | The Humanity of Prophets and Revelation |
| 245 | İnsan ve Vahiy | Humanity and revelation |
| 246 | Peygamberlerin İnsan Oluşu | The humanity of prophets |
| 247 | Örneklik | Example |
| 248 | Tebliğ, Müjde ve Uyarı | Conveyance, Good News and Warnings |
| 249 | Peygamberlerin Görevi | The duties of prophets |
| 250 | İnsan Sorumluluğu | Human responsibility |
| 251 | Ortak Çağrı ve İman Birliği | The Shared Call and Unity of Faith |
| 252 | Tevhid Çağrısı | The call to tawhid |
| 253 | Ortak Mesaj | The shared message |
| 254 | Ayetlerle Peygamberlik | Prophethood in the verses |
| 255 | Gönderiliş Gayesi | The purpose of sending prophets |
| 256 | Hz. Muhammed ve Risalet | Muhammad and Messengership |
| 257 | Evrensel Risalet | Universal messengership |
| 258 | Örneklik ve Tevhid | Example and tawhid |
| 259 | Tevhid ve Risalet | Tawhid and messengership |
| 260 | Peygamberlere İman Ustalığı | Mastering Belief in the Prophets |
| 261 | Vahiy ve Tebliğ | Revelation and conveyance |
| 262 | Ahiret Gününe İman Nedir? | What Is Belief in the Last Day? |
| 263 | Ahiret Kavramı | The concept of the Hereafter |
| 264 | İman ve İyilik | Faith and goodness |
| 265 | Karşılık | Recompense |
| 266 | Ahiret Akışı | The sequence of the Hereafter |
| 267 | Kıyametin Vakti | The time of the Hour |
| 268 | Ölüm ve Dünya Hayatının Sonu | Death and the End of Worldly Life |
| 269 | Ölüm Bilinci | Awareness of death |
| 270 | Ölüm Sonrası | After death |
| 271 | Pişmanlık | Regret |
| 272 | Yanlış Anlamayı Düzeltme | Correcting a misunderstanding |
| 273 | Ölüm ve Ahiret | Death and the Hereafter |
| 274 | Kıyamet ve Yeniden Diriliş | The Hour and Resurrection |
| 275 | Yeniden Diriliş | Resurrection |
| 276 | Hesap, Amel Defteri ve İlahi Adalet | Reckoning, the Record of Deeds and Divine Justice |
| 277 | İlahi Adalet | Divine justice |
| 278 | Amel Defteri | The record of deeds |
| 279 | İyilik | Goodness |
| 280 | Ahiret Bilincinin Hayata Etkisi | How Awareness of the Hereafter Affects Life |
| 281 | Ahiret ve Ahlak | The Hereafter and good character |
| 282 | Dünya ve Ahiret | This world and the Hereafter |
| 283 | Umut ve Adalet | Hope and justice |
| 284 | Dengeli Öğrenme | Balanced learning |
| 285 | Dengeli Ahiret Bilinci | Balanced awareness of the Hereafter |
| 286 | Ahiret İmanı Ustalığı | Mastering Belief in the Hereafter |
| 287 | Kader ve Kazaya İman Nedir? | What Is Belief in Divine Decree and Its Fulfilment? |
| 288 | Kader ve Kazaya İman | Belief in divine decree and its fulfilment |
| 289 | Allah'ın İlmi, Ölçüsü ve Takdiri | Allah's Knowledge, Measure and Decree |
| 290 | İnsan İradesi ve Sorumluluk | Human Will and Responsibility |
| 291 | Çaba, Tedbir ve Tevekkül | Effort, Precautions and Trust in Allah |
| 292 | Musibet, Sabır ve Denge | Hardship, Patience and Balance |
| 293 | Kader İnancı Ustalığı | Mastering Belief in Divine Decree |
| 294 | İbadet Nedir? | What Is Worship? |
| 295 | Niyet ve İhlas | Intention and Sincerity |
| 296 | İbadetin Hayata Etkisi | How Worship Affects Life |
| 297 | Temizlik ve Taharet | Cleanliness and Ritual Purification |
| 298 | Abdestin Temeli | The Foundations of Ablution |
| 299 | Abdest Adımlarını Tanı | Learn the Steps of Ablution |
| 300 | Teyemmüm ve Kolaylık | Dry Ablution and Ease |
| 301 | Ortak Temel ve Farklar | Shared Foundations and Differences |
| 302 | Namaza Hazırlık | Preparing for Prayer |
| 303 | Yatsı namazı | Night prayer |
| 304 | Öğle namazı | Midday prayer |
| 305 | Vakit ve Kıble | Prayer Time and Direction |
| 306 | Sabah namazı | Dawn prayer |
| 307 | Akşam namazı | Sunset prayer |
| 308 | Şartları Eşleştir | Match the Conditions |
| 309 | İkindi namazı | Afternoon prayer |
| 310 | Hazırlık Senaryoları | Preparation Scenarios |
| 311 | Beş Vakit | The Five Daily Prayers |
| 312 | Namazın Yapısı | The Structure of Prayer |
| 313 | Kıyam, Kıraat, Rükû, Secde | Standing, Recitation, Bowing and Prostration |
| 314 | Rekâtı Kur | Build a Prayer Unit |
| 315 | Namaz İçinde Akış | The Sequence Within Prayer |
| 316 | Mazerette Kolaylık | Ease in Cases of Difficulty |
| 317 | Oruç Nedir? | What Is Fasting? |
| 318 | Bilerek yemek | Eating deliberately |
| 319 | Yeme | Eating |
| 320 | Ramazan ve Takva | Ramadan and Mindfulness of Allah |
| 321 | Unutarak yemek | Eating forgetfully |
| 322 | Cinsel ilişki | Sexual intercourse |
| 323 | İmsak ve İftar | Beginning and Breaking the Fast |
| 324 | İçme | Drinking |
| 325 | Oruçlu Günlük Hayat | Daily Life While Fasting |
| 326 | Mazeret ve Kaza | Concessions and Making Up Missed Fasts |
| 327 | DEEN’e hoş geldin | Welcome to DEEN |
| 328 | İslam’ı adım adım, sakin ve düzenli şekilde öğren. | Learn about Islam step by step, calmly and consistently. |
| 329 | Sana nasıl hitap edelim? | What should we call you? |
| 330 | Adın veya kullanıcı adın | Your name or username |
| 331 | Bu isim profilinde görünecek. | This name will appear on your profile. |
| 332 | Yolcu | Traveller |
| 333 | Yaşını yazmana gerek yok; sana en rahat gelen öğrenme stilini seç. | You do not need to enter your age. Choose the style that suits you best. |
| 334 | Çocuk | Child |
| 335 | Genç | Teen |
| 336 | Yetişkin | Adult |
| 337 | Kısa, sade ve görsel ağırlıklı anlatım | Short, simple explanations with visual support |
| 338 | Açık, akıcı ve günlük hayata yakın örnekler | Clear, fluent explanations with everyday examples |
| 339 | Daha derin, dengeli ve düzenli açıklamalar | Deeper, balanced and structured explanations |
| 340 | Yol arkadaşını seç | Choose your companion |
| 341 | Seçtiğin hayvan profilinde, serilerinde ve ders sonunda sana eşlik edecek. | Your animal will accompany you on your profile, streaks and lesson results. |
| 342 | Aslan | Lion |
| 343 | Kurt | Wolf |
| 344 | Baykuş | Owl |
| 345 | Kaplumbağa | Turtle |
| 346 | Kartal | Eagle |
| 347 | Kedi | Cat |
| 348 | Cesaret | Courage |
| 349 | Kararlılık | Determination |
| 350 | Odak | Focus |
| 351 | Sakinlik | Calm |
| 352 | Önce bir hayvan seç | Choose an animal first |
| 353 | Günde ne kadar zaman ayırabilirsin? | How much time can you spend each day? |
| 354 | Kısa ama düzenli ilerlemek daha iyi sonuç verir. | Short, regular practice leads to better results. |
| 355 | Hızlı ve hafif tempo · 1 mini ders | Quick and light · 1 short lesson |
| 356 | Dengeli günlük ritim · 2 mini ders | A balanced daily pace · 2 short lessons |
| 357 | Daha yoğun öğrenme · 3 mini ders | More intensive learning · 3 short lessons |
| 358 | Hazırsın | You are ready |
| 359 | İslam Nedir? | What Is Islam? |
| 360 | Temel kavramlarla tanış. İnanç, ibadet ve ahlak arasındaki bağı keşfet. | Meet the main concepts. Discover the connection between faith, worship and good character. |
| 361 | Allah’a İman | Belief in Allah |
| 362 | Tevhidi ve imanın hayata yansımalarını öğren. | Learn about Allah's oneness and how faith is reflected in life. |
| 363 | Şehadetin anlamını tanı; parçaları arasında bağ kur. | Learn the meaning of the testimony of faith and connect its parts. |
| 364 | İslam’ın Beş Şartı | The Five Pillars of Islam |
| 365 | Beş şartı tanı, doğru bağlamlarıyla eşleştir. | Recognise the five pillars and match them with their correct contexts. |
| 366 | İmanın Esaslarına Giriş | Introduction to the Articles of Faith |
| 367 | Altı iman esasını öğren ve birbirinden ayırt et. | Learn the six articles of faith and distinguish between them. |
| 368 | İlk 5 ünitedeki bilgini tek bir ustalık sınavında bir araya getir. | Bring together what you learned in the first five units in one mastery test. |
| 369 | KISIM 2 · İMAN | SECTION 2 · FAITH |
| 370 | Meleklere iman konusunu adım adım pekiştir. | Reinforce belief in angels step by step. |
| 371 | Kitaplara imanla ilgili temel kavramları keşfet. | Discover the main concepts of belief in the revealed books. |
| 372 | Peygamberlere iman konusundaki bilgini güçlendir. | Strengthen your knowledge of belief in the prophets. |
| 373 | Ahiret Gününe İman | Belief in the Last Day |
| 374 | Ahiret inancını tanı, hatırla ve pekiştir. | Recognise, recall and reinforce belief in the Hereafter. |
| 375 | Kader ve kaza kavramlarını kaynak notlarıyla öğren. | Learn the concepts of divine decree and its fulfilment with source notes. |
| 376 | KISIM 2 FİNALİ | SECTION 2 FINAL |
| 377 | İman Ustalığı | Faith Mastery |
| 378 | İman bölümündeki 5 ünitenin bilgisini bir araya getir. | Bring together your knowledge from the five units on faith. |
| 379 | KISIM 3 · İBADET | SECTION 3 · WORSHIP |
| 380 | Fıkıh kapsamı · Ortak temel | Scope of Islamic jurisprudence · Shared foundation |
| 381 | Bu sürüm mezheplerin ortak çekirdeğini öğretir. | This version teaches the shared core of the schools of law. |
| 382 | İbadet Bilinci | Awareness of Worship |
| 383 | İbadetin anlamını, niyet ve ihlası; ibadet bilgisinin nasıl öğrenildiğini kavra. | Understand the meaning of worship, intention and sincerity, and how to learn about worship. |
| 384 | Temizlik ve Abdest | Cleanliness and Ablution |
| 385 | Taharetin anlamını, abdestin Kur’an’daki ortak temelini ve teyemmümdeki kolaylığı öğren. | Learn the meaning of ritual purification, ablution's shared foundation in the Quran, and the ease offered by dry ablution. |
| 386 | Namaz vakti, kıble, temizlik, niyet ve beş vakit farz rekâtların temelini öğren. | Learn the foundations of prayer time, direction, purification, intention and obligatory units in the five daily prayers. |
| 387 | Namazın temel rükünlerini, bir rekâtın akışını ve mazeretteki kolaylık ilkesini öğren. | Learn the main pillars of prayer, the sequence of a unit, and the principle of ease when difficulties arise. |
| 388 | Oruç ve Ramazan | Fasting and Ramadan |
| 389 | Ramazan orucunun anlamını, imsak-iftar sınırını, takva amacını ve temel mazeretleri öğren. | Learn the meaning of fasting in Ramadan, its dawn-to-sunset limits, its aim of mindfulness of Allah, and the main concessions. |
| 390 | KISIM 3 FİNALİ | SECTION 3 FINAL |
| 391 | İbadet Temelleri Ustalığı | Foundations of Worship Mastery |
| 392 | İbadet bölümündeki ortak-temel bilgileri bir araya getir. | Bring together the shared foundations from the units on worship. |
| 393 | Seri detayları | Streak details |
| 394 | Neden şimdi? | Why now? |
| 395 | Yeni ilerleme | New progress |
| 396 | HAFTALIK RİTİM | WEEKLY RHYTHM |
| 397 | USTALIK SINAVINI BAŞLAT | START THE MASTERY TEST |
| 398 | ADAPTIVE MEMORY ENGINE · v6.4 | ADAPTIVE MEMORY ENGINE · v6.4 |
| 399 | Ünite bazında | By unit |
| 400 | Bu skor yalnız öğrenme ve hatırlama performansını yönetir; dinî yeterlilik veya ibadet değeri değildir. | This score manages learning and recall performance only; it does not measure religious competence or the value of worship. |
| 401 | 1. gün + 7. gün | Day 1 + day 7 |
| 402 | Dersi bitirdiğin gün değil, unutma başlamadan hemen önce hatırla. | Recall just before forgetting begins, rather than only on the day you finish a lesson. |
| 403 | Yarın | Tomorrow |
| 404 | 5 farklı günde Bugünkü Yolculuk'u tamamla | Complete Today's Journey on 5 different days |
| 405 | İlk Adım | First Step |
| 406 | İlk dersini tamamla | Complete your first lesson |
| 407 | İstikrar | Consistency |
| 408 | Bilgi Yolcusu | Knowledge Traveller |
| 409 | 25 ders tamamla | Complete 25 lessons |
| 410 | Usta Öğrenci | Master Learner |
| 411 | Bir ünitede %100 ustalık | Reach 100% mastery in one unit |
| 412 | Kısım Ustası | Section Master |
| 413 | Bir kısım finalini geç | Pass a section final |
| 414 | Öğrenerek 1000 XP kazan | Earn 1000 XP through learning |
| 415 | Keskin Odak | Sharp Focus |
| 416 | 10 kusursuz ders tamamla | Complete 10 perfect lessons |
| 417 | Hatırlama Ritmi | Recall Rhythm |
| 418 | 10 tekrar dersi tamamla | Complete 10 review lessons |
| 419 | Uzun Yol | Long Journey |
| 420 | 50 ders tamamla | Complete 50 lessons |
| 421 | Bilgi Birikimi | Knowledge Gained |
| 422 | Öğrenerek 5000 XP kazan | Earn 5000 XP through learning |
| 423 | Öğrenme oyunlaştırılır; ibadet puanlanmaz. Dinî içerikler uzman incelemesi bekler. | Learning uses game elements; worship is not scored. Religious content awaits expert review. |
| 424 | DEEN ADMIN | DEEN ADMIN |
| 425 | P · DEVELOPER CONTROL CENTER | P · DEVELOPER CONTROL CENTRE |
| 426 | HIZLI İLERLEME | QUICK PROGRESS |
| 427 | TÜM BÖLÜMLERİ GEÇ | COMPLETE ALL SECTIONS |
| 428 | TÜM BÖLÜMLERİ SIFIRLA | RESET ALL SECTIONS |
| 429 | KISIM 1’İ GEÇ | COMPLETE SECTION 1 |
| 430 | KISIM 1’İ SIFIRLA | RESET SECTION 1 |
| 431 | KISIM 2’Yİ GEÇ | COMPLETE SECTION 2 |
| 432 | KISIM 2’Yİ SIFIRLA | RESET SECTION 2 |
| 433 | KISIM 3’Ü GEÇ | COMPLETE SECTION 3 |
| 434 | KISIM 3’Ü SIFIRLA | RESET SECTION 3 |
| 435 | TÜM ROZETLERİ AÇ | UNLOCK ALL BADGES |
| 436 | TÜM KİLİTLERİ AÇ | UNLOCK EVERYTHING |
| 437 | TEK AŞAMA KONTROLÜ | INDIVIDUAL STAGE CONTROL |
| 438 | SEÇİLİ AŞAMAYI GEÇ | COMPLETE SELECTED STAGE |
| 439 | AŞAMAYI GERİ AL | UNDO STAGE |
| 440 | ÖĞREN EKRANINA DÖN | RETURN TO LEARN |
| 441 | ÜNİTE KONTROLÜ | UNIT CONTROL |
| 442 | SEÇİLİ ÜNİTEYİ GEÇ | COMPLETE SELECTED UNIT |
| 443 | ÜNİTEYİ GERİ AL | UNDO UNIT |
| 444 | KISIM 1 FİNALİNİ GEÇ | COMPLETE SECTION 1 FINAL |
| 445 | KISIM 2 FİNALİNİ GEÇ | COMPLETE SECTION 2 FINAL |
| 446 | KISIM 3 FİNALİNİ GEÇ | COMPLETE SECTION 3 FINAL |
| 447 | SINIRSIZ ENERJİ | UNLIMITED ENERGY |
| 448 | 100 GÜN SERİ | 100-DAY STREAK |
| 449 | NORMAL ENERJİ | NORMAL ENERGY |
| 450 | ROZETLERİ KİLİTLE | LOCK BADGES |
| 451 | GİRİŞ EKRANINA DÖN | RETURN TO ENTRY |
| 452 | ONBOARDING’İ BAŞTAN AÇ | RESTART ONBOARDING |
| 453 | PROFİLE GİT | GO TO PROFILE |
| 454 | ÖĞREN EKRANINA GİT | GO TO LEARN |
| 455 | “Giriş ekranına dön” mevcut progress’i silmez. “Onboarding’i baştan aç” sadece onboarding tamamlandı bayrağını sıfırlar. | 'Return to entry' preserves progress. 'Restart onboarding' resets only the onboarding completion flag. |
| 456 | ROZET + RUNTIME AUDIT | BADGE + RUNTIME AUDIT |
| 457 | STATE JSON KOPYALA | COPY STATE JSON |
| 458 | İLERLEMEYİ SIFIRLA | RESET PROGRESS |
| 459 | TAM SIFIRLAMA | FULL RESET |
| 460 | KUR’AN · PRODUCT ANALYTICS | QURAN · PRODUCT ANALYTICS |
| 461 | KUR’AN · UZMAN DOĞRULAMA | QURAN · EXPERT VERIFICATION |
| 462 | KAYNAK GÖRÜNÜR | SOURCE VISIBLE |
| 463 | SES KAYDI HAZIR | AUDIO RECORDING READY |
| 464 | UZMAN ONAYLI | EXPERT APPROVED |
| 465 | İNCELEMEDE | UNDER REVIEW |
| 466 | TÜRKÇE MEAL | TURKISH TRANSLATION |
| 467 | ÖĞRENME NOTU | LEARNING NOTE |
| 468 | Tanımlı değil | Not defined |
| 469 | TASLAĞI KAYDET | SAVE DRAFT |
| 470 | YAYINA ONAYLA | APPROVE FOR PUBLICATION |
| 471 | İNCELEMEYE GERİ AL | RETURN TO REVIEW |
| 472 | SONRAKİ BEKLEYEN | NEXT PENDING ITEM |
| 473 | Henüz uzman işlemi yok. | No expert action yet. |
| 474 | Admin panelini kapat | Close admin panel |
| 475 | Pencereyi kapat | Close window |
| 476 | Belirgin tekrar eden hata yok. Sistem yeni cevaplarla öğrenme profilini güncellemeye devam edecek. | No clear repeated mistakes. The system will keep updating your learning profile with new answers. |
| 477 | Biriktirilebilir ilerleme madalyaları. Ek XP verilmez. | Collectible progress medals. No extra XP is awarded. |
| 478 | Kaynaklı Arapça metin ve kayıtlı meal verisinden otomatik oluşturuldu. | Generated from sourced Arabic text and recorded translation data. |
| 479 | Beyyine | Al-Bayyinah |
| 480 | SON ÜNİTE | LAST UNIT |
| 481 | KISIM 1 FİNALİ | SECTION 1 FINAL |
| 482 | KİLİTLİ · USTALIK SINAVI | LOCKED · MASTERY TEST |
| 483 | Temeller Ustalığı | Foundations Mastery |
| 484 | Geçerli mezhep farklılıkları yanlış cevap olarak puanlanmaz; bütün yeni içerikler uzman incelemesi bekler. | Valid differences between schools of law are not graded as incorrect; all new content awaits expert review. |
| 485 | Fâtiha | Al-Fatihah |
| 486 | Felak | Al-Falaq |
| 487 | Nâs | An-Nas |
| 488 | Mâûn | Al-Ma'un |
| 489 | İnşirah | Ash-Sharh |
| 490 | Zilzâl | Az-Zalzalah |

## Audit scope limitation

The catalog comparison uses the English reference file, which is not itself a complete enumeration of every dynamically assembled Turkish screen string. Runtime/browser QA may reveal **additional** Turkish strings. The count above is therefore **not a certified ceiling** on remaining German work.

**Do not merge or deploy the German release until all blocker conditions are cleared.**
