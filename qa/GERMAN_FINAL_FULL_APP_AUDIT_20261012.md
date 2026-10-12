# DEEN German final full-app locale audit — 2026-10-12

> **Deployment decision: BLOCKED.** This audit is intentionally not a religious, legal or native-language approval. A green staging CI does not mean the German application is ready for production.

## Verified inventory

| Surface | Verified status |
|---|---|
| German entry/onboarding | German copy exists; no evidence of an end-to-end approved production German lesson flow |
| English UI translation reference | 1087 source strings |
| German staged UI dictionaries | 832 distinct German strings across six files |
| Source-key overlap with English reference | 477/1087 |
| **English reference keys without German catalog match** | **610** |
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

## Remaining release blockers (priority order)

1. **Translate/verify and wire the remaining GUI reference keys.** The full-app baseline has 850 keys without a match in any of the four German staging catalogs. This is not proof every key appears on the same screen, but each is a possible source of Turkish fallback. Cover every active screen before claiming 'German-only'.
2. **Install a German DOM/runtime UI renderer** equivalent in quality to the English renderer, including dynamic values, result panels, progression, profile, Premium and every Quran control. The current startup injects English and Arabic rendering, not a released German renderer.
3. **Complete independent religious/native German review** of 1,500 base questions, live variants and 90 Quran meaning drafts, maintaining exact right-answer source identity, Qur'an verse identity and unmodified Arabic recitation.
4. **Complete rights/copyright and source attribution review** of Quran meaning publication and any other translated religious content.
5. **Run real mobile and desktop Chrome E2E on a full German release candidate**, including first-run language selection, changing language while logged in, all tabs, multiple question types, wrong/correct feedback, audio, results, Premium, Quran, review and profile.
6. **Only after those gates and explicit QA acceptance**, update release manifest and assets, verify startup hashes, merge to main and inspect the actual GitHub Pages URL.

## Exhaustive unmatched German UI source-key list

The original audit identified 850 missing reference keys; batch 01 translated 120 and batch 02 translated 120. This is the updated list of **610 source keys with no matching German staging dictionary entry**. English reference meanings are context only, not substitute translations.

| # | Turkish source key | English reference meaning |
|---:|---|---|
| 1 | Güven özeti | Summary of trust |
| 2 | Dürüstlük uygulaması | Practising honesty |
| 3 | Şükür uygulaması | Practising gratitude |
| 4 | Güven uygulaması | Putting trust into practice |
| 5 | Yaratıcı-yaratılan hatası | An error about Creator and creation |
| 6 | Tevhid hatası | An error about tawhid |
| 7 | Bütüncül uygulama | Putting the concepts together |
| 8 | Şehadet Nedir? | What Is the Shahada? |
| 9 | Kelime-i Şehadet'e giriş | Introduction to the Shahada |
| 10 | Şehadetin bölümleri | The parts of the Shahada |
| 11 | Şehadetin anlamı | The meaning of the Shahada |
| 12 | Şehadetin Türkçe anlamı | The English meaning of the Shahada |
| 13 | Şehadetin içeriği | The content of the Shahada |
| 14 | Şehadet'in şartı | A condition of the Shahada |
| 15 | Şahitlik kavramı | The concept of testimony |
| 16 | İlk kelime tanıma | Recognising the first word |
| 17 | İki beyan | Two declarations |
| 18 | İmanın kapsayıcılığı | The scope of faith |
| 19 | Resûlullah kelime anlamı | The meaning of Rasulullah |
| 20 | Genel Anlam | Overall meaning |
| 21 | Sözlü beyan | Spoken declaration |
| 22 | Anlamını Öğren | Learn Its Meaning |
| 23 | Tevhid kavramı eşleşmesi | Matching the concept of tawhid |
| 24 | Peygamberlik kavramı eşleşmesi | Matching the concept of prophethood |
| 25 | Bölüm-Anlam Eşleştirme | Matching parts to meanings |
| 26 | İlah kavramı | The concept of a deity |
| 27 | Anlam tamamlama | Completing the meaning |
| 28 | Peygamberliğin kabulü | Accepting prophethood |
| 29 | Şehadet metni inceleme | Examining the Shahada text |
| 30 | Lâ ilâhe illallah eşleşmesi | Matching La ilaha illallah |
| 31 | Tevhid ve Risalet dengesi | The balance between tawhid and messengership |
| 32 | İlah kelimesinin reddi | The negation of other deities |
| 33 | Şahitlik pratik anlamı | The practical meaning of testimony |
| 34 | Resûl ve elçi ilişkisi | The connection between rasul and messenger |
| 35 | Eksik parça tespiti | Finding the missing part |
| 36 | İlahiyet Kavramı | The concept of divinity |
| 37 | Dinle ve Tanı | Listen and Recognise |
| 38 | Tam metin tanıma | Recognising the complete text |
| 39 | Ses-Anlam eşleşmesi | Matching audio to meaning |
| 40 | İlk kısım tanıma | Recognising the first part |
| 41 | Ses içeriği | Audio content |
| 42 | İşiterek boşluk doldurma | Filling a blank by listening |
| 43 | Eşhedü tekrarı duyma | Hearing the repeated word Ashhadu |
| 44 | İşitsel hata tespiti bağlamı | Finding a mistake in audio context |
| 45 | Son kelime tanıma | Recognising the last word |
| 46 | Kavram eşleme işitsel | Matching concepts by listening |
| 47 | İki parça birleştirici | Joining the two parts |
| 48 | Peygamber ismi tanıma | Recognising the prophet's name |
| 49 | Peygamberliğin işitsel karşılığı | Hearing the prophethood declaration |
| 50 | İlk şahitlik vurgusu | The first testimony |
| 51 | Kavram tanıma tekrar | Reviewing concept recognition |
| 52 | Şehadeti Oluştur | Build the Shahada |
| 53 | Tüm ifade sıralaması | Ordering the complete statement |
| 54 | Son kelime | Last word |
| 55 | İlk kısım tamamlama | Completing the first part |
| 56 | Detaylı kelime sıralama | Detailed word ordering |
| 57 | Bağlaç bilgisi | Understanding conjunctions |
| 58 | Türkçe anlam sıralama | Ordering the English meaning |
| 59 | Başlangıç kelimesi | Opening word |
| 60 | İkinci kısım sıralama | Ordering the second part |
| 61 | Orta kelime | Middle word |
| 62 | Anlam eksikliği | Incomplete meaning |
| 63 | Tüm cümle parçaları sıralama | Ordering all sentence parts |
| 64 | Negatif ifade tanıma | Recognising a negative statement |
| 65 | Kelime kontrolü | Word check |
| 66 | Bütünleyici anlam | Combined meaning |
| 67 | Çeviri parça eşleşmesi | Matching translated parts |
| 68 | Hızlı kelime kontrolü | Quick word check |
| 69 | Ne Söylediğini Anla | Understand What You Say |
| 70 | Senaryo - Eksik anlayış | Scenario: incomplete understanding |
| 71 | Senaryo - Özümseme | Scenario: internalising the meaning |
| 72 | Doğru kavrama | Correct understanding |
| 73 | Senaryo - Elçi konumu | Scenario: the messenger's position |
| 74 | Tevhid Hata Tespiti | Finding a tawhid mistake |
| 75 | Bütünlük ilkesi | Completeness |
| 76 | Şahitlik bilinci | Awareness of testimony |
| 77 | Parçalar arası anlam | Meaning across the parts |
| 78 | Pratik inanç eşleşmesi | Matching belief in practice |
| 79 | Senaryo - Söz ve Öz | Scenario: words and sincerity |
| 80 | İlah kelimesinin kapsayıcılığı | The scope of the word deity |
| 81 | Hata tespiti - Resulullah konumu | Finding a mistake: the position of Allah's Messenger |
| 82 | Boşluk doldurma uygulama | Fill-in-the-blank practice |
| 83 | Sürekli bilinç | Continuing awareness |
| 84 | Şahitlik hissi | A sense of bearing witness |
| 85 | Bağlamsal bağlantı | Contextual connection |
| 86 | Kavramsal Geri Çağırma 1 | Concept recall 1 |
| 87 | İlah reddi zihinsel model | Understanding the negation of other deities |
| 88 | Anlam eksikliği pratik | Practising complete understanding |
| 89 | İşitsel Hafıza | Auditory memory |
| 90 | Şahitlik Pratiği | Testimony practice |
| 91 | Çeviri yapı bozumu | Breaking down the translation |
| 92 | Kavramları Hızlı Eşleştirme | Quick concept matching |
| 93 | Elçi reddi senaryosu | Scenario: denying the messenger |
| 94 | Kelime tamamlama | Completing a word |
| 95 | Tevhid Kavramı Tekrar | Reviewing tawhid |
| 96 | Dil ve Kalp | Tongue and heart |
| 97 | Odaklanma - Eşhedü | Focus: Ashhadu |
| 98 | Şehadet Challenge | Shahada Challenge |
| 99 | Kapsamlı Senaryo | Comprehensive scenario |
| 100 | Tam metin hız testi | Full-text speed check |
| 101 | Odaklı dinleme hata tespiti | Finding mistakes through focused listening |
| 102 | Tevhid özü | The essence of tawhid |
| 103 | Kelimeler arası geçiş | Transitions between words |
| 104 | Şehadet ve İman bağlantısı | The connection between the Shahada and faith |
| 105 | Ünite temel kavramları | Key concepts in the unit |
| 106 | Hata Bulmaca | Find the mistake |
| 107 | Boşluk doldurma (Bütünleşik) | Integrated fill-in-the-blank |
| 108 | Tevhid ve Pratik Yaşam | Tawhid in daily life |
| 109 | Son kelime doğruluk testi | Checking the last word |
| 110 | Sesli tamamlama analizi | Analysing audio completion |
| 111 | Gerçek inanç vurgusu | Sincere belief |
| 112 | Final kelime dizilimi | Final word order |
| 113 | Beş Şartı Tanı | Meet the Five Pillars |
| 114 | İslam'ın Şartları Nelerdir? | What are the pillars of Islam? |
| 115 | Şehadet'in Yeri | The place of the Shahada |
| 116 | İbadet Olarak Namaz | Prayer as worship |
| 117 | Mekke ve İbadet | Mecca and worship |
| 118 | Şartların Sayısı | The number of pillars |
| 119 | Ramazan ve Oruç | Ramadan and fasting |
| 120 | İslam'ın Şartları Listesi | List of the pillars of Islam |
| 121 | Şartlar ve İnançlar | Pillars and beliefs |
| 122 | Şehadet ve Namaz | The Shahada and Prayer |
| 123 | Şehadetin Anlamı | The meaning of the Shahada |
| 124 | Düzenli İbadet Namaz | Prayer as regular worship |
| 125 | İlk Şartın Yeri | The place of the first pillar |
| 126 | Namazın Kapsamı | The scope of prayer |
| 127 | Şehadet ve Namaz İlişkisi | The connection between the Shahada and prayer |
| 128 | Şehadetin Yeri | The place of the Shahada |
| 129 | Namazın Önemi | The importance of prayer |
| 130 | İnanç Beyanı | Declaration of faith |
| 131 | Düzenli İbadet | Regular worship |
| 132 | Şehadet ve Namazın Kapsamı | The scope of the Shahada and prayer |
| 133 | Kelime-i Şehadet'in Yeri | The place of the Shahada |
| 134 | İlk İki Şart | The first two pillars |
| 135 | Namaz Kavramı | The concept of prayer |
| 136 | Oruç, Zekât ve Hac | Fasting, Zakat and Hajj |
| 137 | Malî İbadet Zekât | Zakat as worship involving wealth |
| 138 | Mekke'ye Yolculuk | Journey to Mecca |
| 139 | Zekât Kavramı | The concept of zakat |
| 140 | Oruç Kavramı | The concept of fasting |
| 141 | Son Üç Şartın Özellikleri | Features of the last three pillars |
| 142 | Hac Kavramı | The concept of Hajj |
| 143 | Zekâtın Doğası | The nature of zakat |
| 144 | Oruç ve İbadet | Fasting and worship |
| 145 | Hac Şartı | The pillar of Hajj |
| 146 | Zekât Uygulaması | Practising zakat |
| 147 | Oruç, Zekât, Hac Eşleştirme | Matching fasting, zakat and Hajj |
| 148 | Hac İbadeti | Hajj as worship |
| 149 | İbadet ve Tanım Eşleştirme | Matching worship to definitions |
| 150 | Şehadet ve Hac Eşleştirme | Matching the Shahada and Hajj |
| 151 | Hatalı Eşleştirme Bulma | Finding an incorrect match |
| 152 | Doğru Eşleştirme Seçimi | Choosing the correct match |
| 153 | Kavram Eşleştirme | Concept matching |
| 154 | Hatalı Eşleştirme Bulma 2 | Finding an incorrect match 2 |
| 155 | Şartlar ve Esaslar Ayrımı | Distinguishing pillars and articles of faith |
| 156 | Hatalı İfadeyi Bul | Find the incorrect statement |
| 157 | İbadet Eşleştirme | Matching acts of worship |
| 158 | Kavram Karşılaştırma | Comparing concepts |
| 159 | Hatalı Kavramı Bulma | Finding the incorrect concept |
| 160 | Geniş Eşleştirme | Extended matching |
| 161 | Hac ve Oruç Eşleştirme | Matching Hajj and fasting |
| 162 | Kavram Testi | Concept check |
| 163 | Son Eşleştirme | Final matching |
| 164 | Temel Kavram Seçimi | Choosing a main concept |
| 165 | Hangisi Hangi Şart? | Which Pillar Is It? |
| 166 | Günlük Hayatta Oruç | Fasting in daily life |
| 167 | Günlük Hayatta Zekât | Zakat in daily life |
| 168 | Günlük Hayatta Namaz | Prayer in daily life |
| 169 | Uygulama Hatası | A mistake in practice |
| 170 | Hac İbadeti Uygulaması | Practising Hajj |
| 171 | Şehadet Uygulaması | Practising the Shahada |
| 172 | Hatalı Düşünce Tespiti | Finding a mistaken idea |
| 173 | Senaryo: Yardım Kuruluşu | Scenario: a charity |
| 174 | Senaryo: Seyahat | Scenario: travelling |
| 175 | Hata Bulma: Şart ve İman Karışımı | Find the mistake: confusing pillars and faith |
| 176 | Senaryo: Arkadaşın Sorusu | Scenario: a friend's question |
| 177 | Senaryo: Aile Sohbeti | Scenario: family conversation |
| 178 | Senaryo: Televizyon Programı | Scenario: television programme |
| 179 | Hata Bulma: Eksik Şart | Find the mistake: a missing pillar |
| 180 | Senaryo: İftar Vakti | Scenario: breaking the fast |
| 181 | Senaryo: İşçi ve İşveren | Scenario: employee and employer |
| 182 | Şartların Temeli | The foundation of the pillars |
| 183 | Esaslar Ayrımı | Distinguishing the articles |
| 184 | Namaz Kavramı Tekrarı | Reviewing prayer |
| 185 | Zekât Kavramı Tekrarı | Reviewing zakat |
| 186 | Şehadet Hatırlama | Recalling the Shahada |
| 187 | Oruç Hatırlama | Recalling fasting |
| 188 | Hac İbadeti Hatırlama | Recalling Hajj |
| 189 | Namaz ve Vakit | Prayer and time |
| 190 | Zekât Eksik Bilgi | Incomplete understanding of zakat |
| 191 | İmanın Şartı mı İslam'ın Şartı mı? | Article of faith or pillar of Islam? |
| 192 | Genel Tekrar | General review |
| 193 | Beş Şart Challenge | Five Pillars Challenge |
| 194 | Challenge: Tüm Şartlar | Challenge: all the pillars |
| 195 | Challenge: Hata Bulma | Challenge: find the mistake |
| 196 | Challenge: İlişkiler | Challenge: connections |
| 197 | Challenge: Oruç Senaryosu | Challenge: fasting scenario |
| 198 | Challenge: Esas ve Şart Ayrımı | Challenge: articles of faith and pillars |
| 199 | Challenge: Şehadet | Challenge: the Shahada |
| 200 | Challenge: Namaz | Challenge: prayer |
| 201 | Challenge: Hac Mekânı | Challenge: the place of Hajj |
| 202 | Challenge: Karmaşık Senaryo | Challenge: complex scenario |
| 203 | Challenge: Kavram Hatası 2 | Challenge: conceptual mistake 2 |
| 204 | Challenge: Şartları Sayma | Challenge: listing the pillars |
| 205 | Challenge: Günlük Kullanım | Challenge: daily practice |
| 206 | Challenge: Hatırlama | Challenge: recall |
| 207 | Challenge: Kapsayıcı Senaryo | Challenge: comprehensive scenario |
| 208 | İman Ne Demektir? | What Does Faith Mean? |
| 209 | İman Kavramı | The concept of faith |
| 210 | İman Esasları | The articles of faith |
| 211 | İmanın Temeli | The foundation of faith |
| 212 | İmanın Kapsamı | The scope of faith |
| 213 | Allah'a İman | Belief in Allah |
| 214 | İman Esasları Sayısı | The number of articles of faith |
| 215 | İman ve İnanç | Faith and belief |
| 216 | İman Kavramı Özeti | Reviewing the concept of faith |
| 217 | Altı Esası Tanı | Meet the Six Articles |
| 218 | İmanın 6 Esası | The six articles of faith |
| 219 | Kader ve Kaza | Divine decree and its fulfilment |
| 220 | Meleklere İman | Belief in angels |
| 221 | İmanın 6 Esası Eşleştirme | Matching the six articles of faith |
| 222 | Ahirete İman | Belief in the Hereafter |
| 223 | İmanın 6 Esası Liste | List of the six articles of faith |
| 224 | Hızlı Liste Eşleştirme | Quick list matching |
| 225 | Peygamberlere İman | Belief in the prophets |
| 226 | İmanın 6 Esası Toplu | The six articles together |
| 227 | Kitaplara İman | Belief in the books |
| 228 | Kavram Ayrımı | Distinguishing concepts |
| 229 | İmanın 6 Esası Eşleştirme 2 | Matching the six articles of faith 2 |
| 230 | Kavramları Ayır | Distinguish the Concepts |
| 231 | Ahirete İman Tanımı | Defining belief in the Hereafter |
| 232 | Meleklere İman Tanımı | Defining belief in angels |
| 233 | İman Esasları Anlamları | Meanings of the articles of faith |
| 234 | Kitaplara İman Tanımı | Defining belief in the books |
| 235 | Kadere İman Tanımı | Defining belief in divine decree |
| 236 | İman Esaslarını Eşleştirme 3 | Matching articles of faith 3 |
| 237 | Kadere İman Özelliği | A feature of belief in divine decree |
| 238 | İman Esaslarını Eşleştirme 4 | Matching articles of faith 4 |
| 239 | İman Esaslarını Eşleştirme 5 | Matching articles of faith 5 |
| 240 | Ahirete İman Vurgusu | Emphasising belief in the Hereafter |
| 241 | Kavramları Ayırma Özeti | Review: distinguishing concepts |
| 242 | Şart mı, İman Esası mı? | Pillar or Article of Faith? |
| 243 | Namaz ve Melekler | Prayer and angels |
| 244 | Sınıflandırma | Classification |
| 245 | Kategori Eşleştirme | Category matching |
| 246 | Öğrenci Hatası | A learner's mistake |
| 247 | Hac vs Kitaplar | Hajj and the books |
| 248 | Senaryo - Sınıflandırma | Scenario: classification |
| 249 | Ortak Kategori | A shared category |
| 250 | Hata Bulma 2 | Finding the mistake 2 |
| 251 | Eşleştirme | Matching |
| 252 | Kategori Ayrımı | Distinguishing categories |
| 253 | Hata Bulma 3 | Finding the mistake 3 |
| 254 | Kategori Farkı | Category difference |
| 255 | Sınıflandırma Eşleştirme | Classification matching |
| 256 | Sınıflandırma Özeti | Classification review |
| 257 | Senaryo Analizi | Scenario analysis |
| 258 | Karışık Liste | Mixed list |
| 259 | Günlük Hayatta Kavramlar | Concepts in Daily Life |
| 260 | Ölüm Sonrası Hayat | Life after death |
| 261 | Vahiy ve Kitaplar | Revelation and the books |
| 262 | Allah'ın Bilgisi | Allah's knowledge |
| 263 | Yanlış Bağlam | Incorrect context |
| 264 | Hata Bulma 4 | Finding the mistake 4 |
| 265 | Senaryo Tanıma | Recognising a scenario |
| 266 | Senaryo Tanıma 2 | Recognising a scenario 2 |
| 267 | Genel Soru | General question |
| 268 | Hata Bulma 5 | Finding the mistake 5 |
| 269 | Senaryo | Scenario |
| 270 | Kavram Genelleme | Generalising concepts |
| 271 | Senaryo Çoktan Seçmeli | Multiple-choice scenario |
| 272 | Kavram Çoktan Seçmeli | Multiple-choice concept question |
| 273 | Senaryo Özeti | Scenario summary |
| 274 | Kısım Öncesi Akıllı Tekrar | Smart Review Before the Next Section |
| 275 | U1-U5 Tekrar | U01-U05 review |
| 276 | Kelime-i Şehadet ve İman | The Shahada and faith |
| 277 | Şartlar ve Esaslar Sayısı | The number of pillars and articles |
| 278 | Hata Bulma | Finding the mistake |
| 279 | Senaryo Tekrarı | Scenario review |
| 280 | Temel Kavramlar | Main concepts |
| 281 | Hac ve Kader | Hajj and divine decree |
| 282 | Genel Bilgi | General knowledge |
| 283 | Hata Bulma Kısım Özeti | Section review: finding mistakes |
| 284 | Senaryo Özeti 2 | Scenario summary 2 |
| 285 | İman Esasları Challenge | Articles of Faith Challenge |
| 286 | Kadere İman Senaryo | Scenario: belief in divine decree |
| 287 | Eşleştirme Challenge | Matching challenge |
| 288 | Kategori Farkı 2 | Category difference 2 |
| 289 | Eşleştirme Challenge 2 | Matching challenge 2 |
| 290 | Temel Kural | Main principle |
| 291 | Kadere İman Kapsamı | The scope of belief in divine decree |
| 292 | Peygamberlere İman Kapsamı | The scope of belief in the prophets |
| 293 | Kavram Geneli | Concept overview |
| 294 | Final Sorusu | Final question |
| 295 | Melekler Kimdir? | Who Are Angels? |
| 296 | İman Esası | An article of faith |
| 297 | Kaynak Bilinci | Awareness of sources |
| 298 | Tevhid Sınırı | The bounds of tawhid |
| 299 | Temel Ayrımlar | Main distinctions |
| 300 | Elçilik | Messengership |
| 301 | Kaynak Sınırı | The limits of sources |
| 302 | İmanın Anlamı | The meaning of faith |
| 303 | Kaynak Okuryazarlığı | Understanding sources |
| 304 | Meleklerin Özellikleri | The Qualities of Angels |
| 305 | İtaat | Obedience |
| 306 | Ayetlerle Özellikler | Qualities described in verses |
| 307 | Kanatlar | Wings |
| 308 | Tesbih | Glorifying Allah |
| 309 | Kulluk Özeti | Summarising servanthood |
| 310 | Cebrâil ve Vahiy | Gabriel and Revelation |
| 311 | Vahiy Rolleri | Roles in revelation |
| 312 | Meleklere Saygı | Respect for angels |
| 313 | Vahiy Akışı | The conveyance of revelation |
| 314 | Kur'an'da Meleklerin Görevleri | The Duties of Angels in the Quran |
| 315 | Amellerin Kaydı | Recording deeds |
| 316 | Kayıt ve İlahi Bilgi | Recording and divine knowledge |
| 317 | Görevler | Duties |
| 318 | Ölüm Meleği | The angel of death |
| 319 | Görev Çeşitliliği | Different duties |
| 320 | Bilginin Sınırı | The limits of knowledge |
| 321 | Müminler İçin Dua | Supplication for believers |
| 322 | Tevhid ve Dua | Tawhid and supplication |
| 323 | Meleklere İmanın Anlamı | The Meaning of Belief in Angels |
| 324 | İman ve Hayat | Faith and life |
| 325 | Gayba İman | Belief in the unseen |
| 326 | Öğrenme Yöntemi | Learning method |
| 327 | Yanlış Anlamaları Düzelt | Correct Misunderstandings |
| 328 | İblîs ve Melekler | Iblis and angels |
| 329 | Yanlış Bilgiyi Düzeltme | Correcting misinformation |
| 330 | Melekler Ustalığı | Mastering Angels |
| 331 | Ustalık | Mastery |
| 332 | Kitaplara İman Nedir? | What Is Belief in the Books? |
| 333 | Önceki Vahiyler | Earlier revelations |
| 334 | Vahyin Kaynağı | The source of revelation |
| 335 | Tevrat, İncil, Zebur ve Sahifeler | The Torah, the Gospel, the Zabur and the Scrolls |
| 336 | Kitap ve Peygamber | Book and prophet |
| 337 | Sahifeler | The scrolls |
| 338 | Kitapların İsimleri | The names of the books |
| 339 | Kur'an'ın Konumu | The Quran's position |
| 340 | Vahiy ve Yorum | Revelation and interpretation |
| 341 | Kur'an'ın Ölçüsü | The Quran's standard |
| 342 | İlahi Kitapların Ortak Kaynağı | The Shared Source of Divine Books |
| 343 | Kaynak Birliği | A shared source |
| 344 | Kitapların Nitelikleri | The qualities of the books |
| 345 | Hidayet ve Nur | Guidance and light |
| 346 | Vahyin İşlevi | The purpose of revelation |
| 347 | Kaynak ve Rehberlik | Source and guidance |
| 348 | Kur'an ve Önceki Vahiy | The Quran and earlier revelation |
| 349 | Vahyin Akışı | The conveyance of revelation |
| 350 | Vahiy Sürekliliği | Continuity of revelation |
| 351 | Kur'an'ın Rehberliği ve Korunması | The Quran's Guidance and Preservation |
| 352 | Kur'an'ın Rehberliği | The Quran's guidance |
| 353 | Kur'an'ın Korunması | The Quran's preservation |
| 354 | Kur'an'ın Nitelikleri | The Quran's qualities |
| 355 | Kur'an'la İlişki | Engaging with the Quran |
| 356 | Kur'an'ın Kimliği | The Quran's identity |
| 357 | Vahiy ve İnsan Sözü | Revelation and human speech |
| 358 | Kaynak Ahlakı | Ethical use of sources |
| 359 | Kitaplara İman Ustalığı | Mastering Belief in the Books |
| 360 | Peygamberlere İman Nedir? | What Is Belief in the Prophets? |
| 361 | İman Bütünlüğü | Complete faith |
| 362 | Peygamberlerin Bilgisi | The knowledge of prophets |
| 363 | İman ve Derece | Faith and rank |
| 364 | Peygamberlerin İnsan Oluşu ve Vahiy | The Humanity of Prophets and Revelation |
| 365 | İnsan ve Vahiy | Humanity and revelation |
| 366 | Peygamberlerin İnsan Oluşu | The humanity of prophets |
| 367 | Örneklik | Example |
| 368 | Tebliğ, Müjde ve Uyarı | Conveyance, Good News and Warnings |
| 369 | Peygamberlerin Görevi | The duties of prophets |
| 370 | İnsan Sorumluluğu | Human responsibility |
| 371 | Ortak Çağrı ve İman Birliği | The Shared Call and Unity of Faith |
| 372 | Tevhid Çağrısı | The call to tawhid |
| 373 | Ortak Mesaj | The shared message |
| 374 | Ayetlerle Peygamberlik | Prophethood in the verses |
| 375 | Gönderiliş Gayesi | The purpose of sending prophets |
| 376 | Hz. Muhammed ve Risalet | Muhammad and Messengership |
| 377 | Evrensel Risalet | Universal messengership |
| 378 | Örneklik ve Tevhid | Example and tawhid |
| 379 | Tevhid ve Risalet | Tawhid and messengership |
| 380 | Peygamberlere İman Ustalığı | Mastering Belief in the Prophets |
| 381 | Vahiy ve Tebliğ | Revelation and conveyance |
| 382 | Ahiret Gününe İman Nedir? | What Is Belief in the Last Day? |
| 383 | Ahiret Kavramı | The concept of the Hereafter |
| 384 | İman ve İyilik | Faith and goodness |
| 385 | Karşılık | Recompense |
| 386 | Ahiret Akışı | The sequence of the Hereafter |
| 387 | Kıyametin Vakti | The time of the Hour |
| 388 | Ölüm ve Dünya Hayatının Sonu | Death and the End of Worldly Life |
| 389 | Ölüm Bilinci | Awareness of death |
| 390 | Ölüm Sonrası | After death |
| 391 | Pişmanlık | Regret |
| 392 | Yanlış Anlamayı Düzeltme | Correcting a misunderstanding |
| 393 | Ölüm ve Ahiret | Death and the Hereafter |
| 394 | Kıyamet ve Yeniden Diriliş | The Hour and Resurrection |
| 395 | Yeniden Diriliş | Resurrection |
| 396 | Hesap, Amel Defteri ve İlahi Adalet | Reckoning, the Record of Deeds and Divine Justice |
| 397 | İlahi Adalet | Divine justice |
| 398 | Amel Defteri | The record of deeds |
| 399 | İyilik | Goodness |
| 400 | Ahiret Bilincinin Hayata Etkisi | How Awareness of the Hereafter Affects Life |
| 401 | Ahiret ve Ahlak | The Hereafter and good character |
| 402 | Dünya ve Ahiret | This world and the Hereafter |
| 403 | Umut ve Adalet | Hope and justice |
| 404 | Dengeli Öğrenme | Balanced learning |
| 405 | Dengeli Ahiret Bilinci | Balanced awareness of the Hereafter |
| 406 | Ahiret İmanı Ustalığı | Mastering Belief in the Hereafter |
| 407 | Kader ve Kazaya İman Nedir? | What Is Belief in Divine Decree and Its Fulfilment? |
| 408 | Kader ve Kazaya İman | Belief in divine decree and its fulfilment |
| 409 | Allah'ın İlmi, Ölçüsü ve Takdiri | Allah's Knowledge, Measure and Decree |
| 410 | İnsan İradesi ve Sorumluluk | Human Will and Responsibility |
| 411 | Çaba, Tedbir ve Tevekkül | Effort, Precautions and Trust in Allah |
| 412 | Musibet, Sabır ve Denge | Hardship, Patience and Balance |
| 413 | Kader İnancı Ustalığı | Mastering Belief in Divine Decree |
| 414 | İbadet Nedir? | What Is Worship? |
| 415 | Niyet ve İhlas | Intention and Sincerity |
| 416 | İbadetin Hayata Etkisi | How Worship Affects Life |
| 417 | Temizlik ve Taharet | Cleanliness and Ritual Purification |
| 418 | Abdestin Temeli | The Foundations of Ablution |
| 419 | Abdest Adımlarını Tanı | Learn the Steps of Ablution |
| 420 | Teyemmüm ve Kolaylık | Dry Ablution and Ease |
| 421 | Ortak Temel ve Farklar | Shared Foundations and Differences |
| 422 | Namaza Hazırlık | Preparing for Prayer |
| 423 | Yatsı namazı | Night prayer |
| 424 | Öğle namazı | Midday prayer |
| 425 | Vakit ve Kıble | Prayer Time and Direction |
| 426 | Sabah namazı | Dawn prayer |
| 427 | Akşam namazı | Sunset prayer |
| 428 | Şartları Eşleştir | Match the Conditions |
| 429 | İkindi namazı | Afternoon prayer |
| 430 | Hazırlık Senaryoları | Preparation Scenarios |
| 431 | Beş Vakit | The Five Daily Prayers |
| 432 | Namazın Yapısı | The Structure of Prayer |
| 433 | Kıyam, Kıraat, Rükû, Secde | Standing, Recitation, Bowing and Prostration |
| 434 | Rekâtı Kur | Build a Prayer Unit |
| 435 | Namaz İçinde Akış | The Sequence Within Prayer |
| 436 | Mazerette Kolaylık | Ease in Cases of Difficulty |
| 437 | Oruç Nedir? | What Is Fasting? |
| 438 | Bilerek yemek | Eating deliberately |
| 439 | Yeme | Eating |
| 440 | Ramazan ve Takva | Ramadan and Mindfulness of Allah |
| 441 | Unutarak yemek | Eating forgetfully |
| 442 | Cinsel ilişki | Sexual intercourse |
| 443 | İmsak ve İftar | Beginning and Breaking the Fast |
| 444 | İçme | Drinking |
| 445 | Oruçlu Günlük Hayat | Daily Life While Fasting |
| 446 | Mazeret ve Kaza | Concessions and Making Up Missed Fasts |
| 447 | DEEN’e hoş geldin | Welcome to DEEN |
| 448 | İslam’ı adım adım, sakin ve düzenli şekilde öğren. | Learn about Islam step by step, calmly and consistently. |
| 449 | Sana nasıl hitap edelim? | What should we call you? |
| 450 | Adın veya kullanıcı adın | Your name or username |
| 451 | Bu isim profilinde görünecek. | This name will appear on your profile. |
| 452 | Yolcu | Traveller |
| 453 | Yaşını yazmana gerek yok; sana en rahat gelen öğrenme stilini seç. | You do not need to enter your age. Choose the style that suits you best. |
| 454 | Çocuk | Child |
| 455 | Genç | Teen |
| 456 | Yetişkin | Adult |
| 457 | Kısa, sade ve görsel ağırlıklı anlatım | Short, simple explanations with visual support |
| 458 | Açık, akıcı ve günlük hayata yakın örnekler | Clear, fluent explanations with everyday examples |
| 459 | Daha derin, dengeli ve düzenli açıklamalar | Deeper, balanced and structured explanations |
| 460 | Yol arkadaşını seç | Choose your companion |
| 461 | Seçtiğin hayvan profilinde, serilerinde ve ders sonunda sana eşlik edecek. | Your animal will accompany you on your profile, streaks and lesson results. |
| 462 | Aslan | Lion |
| 463 | Kurt | Wolf |
| 464 | Baykuş | Owl |
| 465 | Kaplumbağa | Turtle |
| 466 | Kartal | Eagle |
| 467 | Kedi | Cat |
| 468 | Cesaret | Courage |
| 469 | Kararlılık | Determination |
| 470 | Odak | Focus |
| 471 | Sakinlik | Calm |
| 472 | Önce bir hayvan seç | Choose an animal first |
| 473 | Günde ne kadar zaman ayırabilirsin? | How much time can you spend each day? |
| 474 | Kısa ama düzenli ilerlemek daha iyi sonuç verir. | Short, regular practice leads to better results. |
| 475 | Hızlı ve hafif tempo · 1 mini ders | Quick and light · 1 short lesson |
| 476 | Dengeli günlük ritim · 2 mini ders | A balanced daily pace · 2 short lessons |
| 477 | Daha yoğun öğrenme · 3 mini ders | More intensive learning · 3 short lessons |
| 478 | Hazırsın | You are ready |
| 479 | İslam Nedir? | What Is Islam? |
| 480 | Temel kavramlarla tanış. İnanç, ibadet ve ahlak arasındaki bağı keşfet. | Meet the main concepts. Discover the connection between faith, worship and good character. |
| 481 | Allah’a İman | Belief in Allah |
| 482 | Tevhidi ve imanın hayata yansımalarını öğren. | Learn about Allah's oneness and how faith is reflected in life. |
| 483 | Şehadetin anlamını tanı; parçaları arasında bağ kur. | Learn the meaning of the testimony of faith and connect its parts. |
| 484 | İslam’ın Beş Şartı | The Five Pillars of Islam |
| 485 | Beş şartı tanı, doğru bağlamlarıyla eşleştir. | Recognise the five pillars and match them with their correct contexts. |
| 486 | İmanın Esaslarına Giriş | Introduction to the Articles of Faith |
| 487 | Altı iman esasını öğren ve birbirinden ayırt et. | Learn the six articles of faith and distinguish between them. |
| 488 | İlk 5 ünitedeki bilgini tek bir ustalık sınavında bir araya getir. | Bring together what you learned in the first five units in one mastery test. |
| 489 | KISIM 2 · İMAN | SECTION 2 · FAITH |
| 490 | Meleklere iman konusunu adım adım pekiştir. | Reinforce belief in angels step by step. |
| 491 | Kitaplara imanla ilgili temel kavramları keşfet. | Discover the main concepts of belief in the revealed books. |
| 492 | Peygamberlere iman konusundaki bilgini güçlendir. | Strengthen your knowledge of belief in the prophets. |
| 493 | Ahiret Gününe İman | Belief in the Last Day |
| 494 | Ahiret inancını tanı, hatırla ve pekiştir. | Recognise, recall and reinforce belief in the Hereafter. |
| 495 | Kader ve kaza kavramlarını kaynak notlarıyla öğren. | Learn the concepts of divine decree and its fulfilment with source notes. |
| 496 | KISIM 2 FİNALİ | SECTION 2 FINAL |
| 497 | İman Ustalığı | Faith Mastery |
| 498 | İman bölümündeki 5 ünitenin bilgisini bir araya getir. | Bring together your knowledge from the five units on faith. |
| 499 | KISIM 3 · İBADET | SECTION 3 · WORSHIP |
| 500 | Fıkıh kapsamı · Ortak temel | Scope of Islamic jurisprudence · Shared foundation |
| 501 | Bu sürüm mezheplerin ortak çekirdeğini öğretir. | This version teaches the shared core of the schools of law. |
| 502 | İbadet Bilinci | Awareness of Worship |
| 503 | İbadetin anlamını, niyet ve ihlası; ibadet bilgisinin nasıl öğrenildiğini kavra. | Understand the meaning of worship, intention and sincerity, and how to learn about worship. |
| 504 | Temizlik ve Abdest | Cleanliness and Ablution |
| 505 | Taharetin anlamını, abdestin Kur’an’daki ortak temelini ve teyemmümdeki kolaylığı öğren. | Learn the meaning of ritual purification, ablution's shared foundation in the Quran, and the ease offered by dry ablution. |
| 506 | Namaz vakti, kıble, temizlik, niyet ve beş vakit farz rekâtların temelini öğren. | Learn the foundations of prayer time, direction, purification, intention and obligatory units in the five daily prayers. |
| 507 | Namazın temel rükünlerini, bir rekâtın akışını ve mazeretteki kolaylık ilkesini öğren. | Learn the main pillars of prayer, the sequence of a unit, and the principle of ease when difficulties arise. |
| 508 | Oruç ve Ramazan | Fasting and Ramadan |
| 509 | Ramazan orucunun anlamını, imsak-iftar sınırını, takva amacını ve temel mazeretleri öğren. | Learn the meaning of fasting in Ramadan, its dawn-to-sunset limits, its aim of mindfulness of Allah, and the main concessions. |
| 510 | KISIM 3 FİNALİ | SECTION 3 FINAL |
| 511 | İbadet Temelleri Ustalığı | Foundations of Worship Mastery |
| 512 | İbadet bölümündeki ortak-temel bilgileri bir araya getir. | Bring together the shared foundations from the units on worship. |
| 513 | Seri detayları | Streak details |
| 514 | Neden şimdi? | Why now? |
| 515 | Yeni ilerleme | New progress |
| 516 | HAFTALIK RİTİM | WEEKLY RHYTHM |
| 517 | USTALIK SINAVINI BAŞLAT | START THE MASTERY TEST |
| 518 | ADAPTIVE MEMORY ENGINE · v6.4 | ADAPTIVE MEMORY ENGINE · v6.4 |
| 519 | Ünite bazında | By unit |
| 520 | Bu skor yalnız öğrenme ve hatırlama performansını yönetir; dinî yeterlilik veya ibadet değeri değildir. | This score manages learning and recall performance only; it does not measure religious competence or the value of worship. |
| 521 | 1. gün + 7. gün | Day 1 + day 7 |
| 522 | Dersi bitirdiğin gün değil, unutma başlamadan hemen önce hatırla. | Recall just before forgetting begins, rather than only on the day you finish a lesson. |
| 523 | Yarın | Tomorrow |
| 524 | 5 farklı günde Bugünkü Yolculuk'u tamamla | Complete Today's Journey on 5 different days |
| 525 | İlk Adım | First Step |
| 526 | İlk dersini tamamla | Complete your first lesson |
| 527 | İstikrar | Consistency |
| 528 | Bilgi Yolcusu | Knowledge Traveller |
| 529 | 25 ders tamamla | Complete 25 lessons |
| 530 | Usta Öğrenci | Master Learner |
| 531 | Bir ünitede %100 ustalık | Reach 100% mastery in one unit |
| 532 | Kısım Ustası | Section Master |
| 533 | Bir kısım finalini geç | Pass a section final |
| 534 | Öğrenerek 1000 XP kazan | Earn 1000 XP through learning |
| 535 | Keskin Odak | Sharp Focus |
| 536 | 10 kusursuz ders tamamla | Complete 10 perfect lessons |
| 537 | Hatırlama Ritmi | Recall Rhythm |
| 538 | 10 tekrar dersi tamamla | Complete 10 review lessons |
| 539 | Uzun Yol | Long Journey |
| 540 | 50 ders tamamla | Complete 50 lessons |
| 541 | Bilgi Birikimi | Knowledge Gained |
| 542 | Öğrenerek 5000 XP kazan | Earn 5000 XP through learning |
| 543 | Öğrenme oyunlaştırılır; ibadet puanlanmaz. Dinî içerikler uzman incelemesi bekler. | Learning uses game elements; worship is not scored. Religious content awaits expert review. |
| 544 | DEEN ADMIN | DEEN ADMIN |
| 545 | P · DEVELOPER CONTROL CENTER | P · DEVELOPER CONTROL CENTRE |
| 546 | HIZLI İLERLEME | QUICK PROGRESS |
| 547 | TÜM BÖLÜMLERİ GEÇ | COMPLETE ALL SECTIONS |
| 548 | TÜM BÖLÜMLERİ SIFIRLA | RESET ALL SECTIONS |
| 549 | KISIM 1’İ GEÇ | COMPLETE SECTION 1 |
| 550 | KISIM 1’İ SIFIRLA | RESET SECTION 1 |
| 551 | KISIM 2’Yİ GEÇ | COMPLETE SECTION 2 |
| 552 | KISIM 2’Yİ SIFIRLA | RESET SECTION 2 |
| 553 | KISIM 3’Ü GEÇ | COMPLETE SECTION 3 |
| 554 | KISIM 3’Ü SIFIRLA | RESET SECTION 3 |
| 555 | TÜM ROZETLERİ AÇ | UNLOCK ALL BADGES |
| 556 | TÜM KİLİTLERİ AÇ | UNLOCK EVERYTHING |
| 557 | TEK AŞAMA KONTROLÜ | INDIVIDUAL STAGE CONTROL |
| 558 | SEÇİLİ AŞAMAYI GEÇ | COMPLETE SELECTED STAGE |
| 559 | AŞAMAYI GERİ AL | UNDO STAGE |
| 560 | ÖĞREN EKRANINA DÖN | RETURN TO LEARN |
| 561 | ÜNİTE KONTROLÜ | UNIT CONTROL |
| 562 | SEÇİLİ ÜNİTEYİ GEÇ | COMPLETE SELECTED UNIT |
| 563 | ÜNİTEYİ GERİ AL | UNDO UNIT |
| 564 | KISIM 1 FİNALİNİ GEÇ | COMPLETE SECTION 1 FINAL |
| 565 | KISIM 2 FİNALİNİ GEÇ | COMPLETE SECTION 2 FINAL |
| 566 | KISIM 3 FİNALİNİ GEÇ | COMPLETE SECTION 3 FINAL |
| 567 | SINIRSIZ ENERJİ | UNLIMITED ENERGY |
| 568 | 100 GÜN SERİ | 100-DAY STREAK |
| 569 | NORMAL ENERJİ | NORMAL ENERGY |
| 570 | ROZETLERİ KİLİTLE | LOCK BADGES |
| 571 | GİRİŞ EKRANINA DÖN | RETURN TO ENTRY |
| 572 | ONBOARDING’İ BAŞTAN AÇ | RESTART ONBOARDING |
| 573 | PROFİLE GİT | GO TO PROFILE |
| 574 | ÖĞREN EKRANINA GİT | GO TO LEARN |
| 575 | “Giriş ekranına dön” mevcut progress’i silmez. “Onboarding’i baştan aç” sadece onboarding tamamlandı bayrağını sıfırlar. | 'Return to entry' preserves progress. 'Restart onboarding' resets only the onboarding completion flag. |
| 576 | ROZET + RUNTIME AUDIT | BADGE + RUNTIME AUDIT |
| 577 | STATE JSON KOPYALA | COPY STATE JSON |
| 578 | İLERLEMEYİ SIFIRLA | RESET PROGRESS |
| 579 | TAM SIFIRLAMA | FULL RESET |
| 580 | KUR’AN · PRODUCT ANALYTICS | QURAN · PRODUCT ANALYTICS |
| 581 | KUR’AN · UZMAN DOĞRULAMA | QURAN · EXPERT VERIFICATION |
| 582 | KAYNAK GÖRÜNÜR | SOURCE VISIBLE |
| 583 | SES KAYDI HAZIR | AUDIO RECORDING READY |
| 584 | UZMAN ONAYLI | EXPERT APPROVED |
| 585 | İNCELEMEDE | UNDER REVIEW |
| 586 | TÜRKÇE MEAL | TURKISH TRANSLATION |
| 587 | ÖĞRENME NOTU | LEARNING NOTE |
| 588 | Tanımlı değil | Not defined |
| 589 | TASLAĞI KAYDET | SAVE DRAFT |
| 590 | YAYINA ONAYLA | APPROVE FOR PUBLICATION |
| 591 | İNCELEMEYE GERİ AL | RETURN TO REVIEW |
| 592 | SONRAKİ BEKLEYEN | NEXT PENDING ITEM |
| 593 | Henüz uzman işlemi yok. | No expert action yet. |
| 594 | Admin panelini kapat | Close admin panel |
| 595 | Pencereyi kapat | Close window |
| 596 | Belirgin tekrar eden hata yok. Sistem yeni cevaplarla öğrenme profilini güncellemeye devam edecek. | No clear repeated mistakes. The system will keep updating your learning profile with new answers. |
| 597 | Biriktirilebilir ilerleme madalyaları. Ek XP verilmez. | Collectible progress medals. No extra XP is awarded. |
| 598 | Kaynaklı Arapça metin ve kayıtlı meal verisinden otomatik oluşturuldu. | Generated from sourced Arabic text and recorded translation data. |
| 599 | Beyyine | Al-Bayyinah |
| 600 | SON ÜNİTE | LAST UNIT |
| 601 | KISIM 1 FİNALİ | SECTION 1 FINAL |
| 602 | KİLİTLİ · USTALIK SINAVI | LOCKED · MASTERY TEST |
| 603 | Temeller Ustalığı | Foundations Mastery |
| 604 | Geçerli mezhep farklılıkları yanlış cevap olarak puanlanmaz; bütün yeni içerikler uzman incelemesi bekler. | Valid differences between schools of law are not graded as incorrect; all new content awaits expert review. |
| 605 | Fâtiha | Al-Fatihah |
| 606 | Felak | Al-Falaq |
| 607 | Nâs | An-Nas |
| 608 | Mâûn | Al-Ma'un |
| 609 | İnşirah | Ash-Sharh |
| 610 | Zilzâl | Az-Zalzalah |

## Audit scope limitation

The catalog comparison uses the English reference file, which is not itself a complete enumeration of every dynamically assembled Turkish screen string. Runtime/browser QA may reveal **additional** Turkish strings. The count above is therefore **not a certified ceiling** on remaining German work.

**Do not merge or deploy the German release until all blocker conditions are cleared.**
