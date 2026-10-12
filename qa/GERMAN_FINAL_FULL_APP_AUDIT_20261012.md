# DEEN German final full-app locale audit — 2026-10-12

> **Deployment decision: BLOCKED.** This audit is intentionally not a religious, legal or native-language approval. A green staging CI does not mean the German application is ready for production.

## Verified inventory

| Surface | Verified status |
|---|---|
| German entry/onboarding | German copy exists; no evidence of an end-to-end approved production German lesson flow |
| English UI translation reference | 1087 source strings |
| German staged UI dictionaries | 712 distinct German strings across five files |
| Source-key overlap with English reference | 357/1087 |
| **English reference keys without German catalog match** | **730** |
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
- `scripts/test-german-ui-reference-batch-01.mjs` checks all 120 exact source keys, English reference meanings, duplication, approval flags and fail-closed German release. `scripts/audit-german-full-release-readiness.mjs` inventories the 730 remaining keys.

## Remaining release blockers (priority order)

1. **Translate/verify and wire the remaining GUI reference keys.** The full-app baseline has 850 keys without a match in any of the four German staging catalogs. This is not proof every key appears on the same screen, but each is a possible source of Turkish fallback. Cover every active screen before claiming 'German-only'.
2. **Install a German DOM/runtime UI renderer** equivalent in quality to the English renderer, including dynamic values, result panels, progression, profile, Premium and every Quran control. The current startup injects English and Arabic rendering, not a released German renderer.
3. **Complete independent religious/native German review** of 1,500 base questions, live variants and 90 Quran meaning drafts, maintaining exact right-answer source identity, Qur'an verse identity and unmodified Arabic recitation.
4. **Complete rights/copyright and source attribution review** of Quran meaning publication and any other translated religious content.
5. **Run real mobile and desktop Chrome E2E on a full German release candidate**, including first-run language selection, changing language while logged in, all tabs, multiple question types, wrong/correct feedback, audio, results, Premium, Quran, review and profile.
6. **Only after those gates and explicit QA acceptance**, update release manifest and assets, verify startup hashes, merge to main and inspect the actual GitHub Pages URL.

## Exhaustive unmatched German UI source-key list

This section contains the **730 currently unmatched** UI reference keys following the first 120 German staging translations. The original audit found 850 unmatched keys; batch 01 closed 120 catalog gaps. These are UI catalog matches, not proof of browser visibility or approved religious meaning.

| # | Turkish source key | English reference meaning |
|---:|---|---|
| 1 | İslam-Müslüman ilişkisi | The relationship between Islam and Muslim |
| 2 | Kavram sınıflandırma | Classifying concepts |
| 3 | Kavramların temel dörtlüsü | Four basic concepts |
| 4 | Günlük Hayat | Everyday Life |
| 5 | Günlük hayatta ahlak | Good character in everyday life |
| 6 | İman-ahlak ilişkisi | Faith and good character |
| 7 | İbadet-ahlak bütünlüğü | Worship and good character together |
| 8 | Müslümanlığın ölçütü | What defines being Muslim? |
| 9 | İbadetin kapsamı | The scope of worship |
| 10 | İslam'ın kapsamı | The scope of Islam |
| 11 | İbadet-yardım ilişkisi | Worship and helping others |
| 12 | Bildiklerini Kullan | Use What You Know |
| 13 | Ahlakın yeri | The place of good character |
| 14 | Kavramların bütünlüğü | How the concepts form a whole |
| 15 | Kavramların ilişkisi | Relationships between concepts |
| 16 | Peygamberin bugünkü önemi | The Prophet's relevance today |
| 17 | Kur'an'ın kapsamı | The scope of the Quran |
| 18 | Kaynak-uygulama ilişkisi | The relationship between sources and practice |
| 19 | İslam'ı bütünsel anlama | Understanding Islam as a whole |
| 20 | Akıllı Tekrar | Smart Review |
| 21 | İslam'ın bütünlüğü | Islam as a whole |
| 22 | İbadetin özü | The essence of worship |
| 23 | Üçlünün bütünlüğü | The three concepts as a whole |
| 24 | Üçlü ilişki özeti | Summary of the three-way relationship |
| 25 | Kur'an'ın rehberlik yönü | The Quran as guidance |
| 26 | İmanın kalple ilgisi | Faith and the heart |
| 27 | Peygamberin rehberliği | The Prophet's guidance |
| 28 | Ahlaki öz farkındalık | Moral self-awareness |
| 29 | Üçlünün somut örneği | A practical example of the three concepts |
| 30 | Ünite Challenge | Unit Challenge |
| 31 | İslam'ın özeti | Summary of Islam |
| 32 | Görülmeden dürüstlük | Honesty when nobody is watching |
| 33 | İmanın özü | The essence of faith |
| 34 | Temel kavramlar özeti | Summary of the basic concepts |
| 35 | Evrensel kimlik | A universal identity |
| 36 | Peygamberin rolü özeti | Summary of the Prophet's role |
| 37 | Temel çerçeve özeti | Summary of the basic framework |
| 38 | Ünite özeti | Unit summary |
| 39 | Müslüman kimliği | Muslim identity |
| 40 | Kur'an ve rehberlik | The Quran and guidance |
| 41 | Kur’an | The Quran |
| 42 | Kavram haritası | Concept map |
| 43 | Günlük hayat | Everyday life |
| 44 | Ders özeti | Lesson summary |
| 45 | Dürüstlük | Honesty |
| 46 | Allah'a İman Nedir? | What Is Faith in Allah? |
| 47 | Allah'a iman tanımı | Defining faith in Allah |
| 48 | Allah'a imanın yeri | The place of faith in Allah |
| 49 | İman ve ibadet ayrımı | The distinction between faith and worship |
| 50 | İmanın anlamı | The meaning of faith |
| 51 | İmanın kapsamı | The scope of faith |
| 52 | Temel kavram ayrımı | Distinguishing basic concepts |
| 53 | Temel ifade | A basic statement |
| 54 | İnanç ve davranış ilişkisi | The relationship between belief and behaviour |
| 55 | İnanç ve davranış | Belief and behaviour |
| 56 | Tanımın tamamlanması | Completing a definition |
| 57 | Aktif hatırlama | Active recall |
| 58 | Hızlı tekrar | Quick review |
| 59 | Kavramı doğru çerçeveleme | Framing the concept accurately |
| 60 | Allah Birdir | Allah Is One |
| 61 | Tevhid kavramı | The concept of tawhid |
| 62 | Kulluk ve tevhid | Devotion and tawhid |
| 63 | Tevhid ve çokluk | Tawhid and multiple deities |
| 64 | Tevhid ilişkileri | Connections with tawhid |
| 65 | Tanımı tamamlama | Completing the definition |
| 66 | Tevhidi açıklama | Explaining tawhid |
| 67 | Kulluk yönü | The dimension of devotion |
| 68 | Kavram yanılgısı | A misconception about a concept |
| 69 | Yaratıcı ve Yaratılan | Creator and Creation |
| 70 | Allah yaratıcıdır | Allah is the Creator |
| 71 | Yaratıcı-yaratılan ayrımı | The distinction between Creator and creation |
| 72 | Yaratıcı kavramı | The concept of Creator |
| 73 | Yaratıcılık kavramı | The concept of creation |
| 74 | Ayrımı tamamlama | Completing the distinction |
| 75 | Kavram ilişkileri | Relationships between concepts |
| 76 | Kavramı tamamlama | Completing the concept |
| 77 | Benzerlik yanılgısı | A misconception about resemblance |
| 78 | Yaratma kavramını ayırt etme | Distinguishing the concept of creation |
| 79 | Kavram özeti | Concept summary |
| 80 | Kavramları Bağla | Connect the Concepts |
| 81 | İnanç ve davranış bağlantısı | The connection between belief and behaviour |
| 82 | Yaratıcı-yaratılan ilişkisi | The relationship between Creator and creation |
| 83 | Kavram ayrımı | Distinguishing concepts |
| 84 | Kavramların işlevi | The roles of the concepts |
| 85 | Kavram karışıklığı | Confusing concepts |
| 86 | Kavram çiftleri | Pairs of concepts |
| 87 | Güven kavramı | The concept of trust |
| 88 | İlişkiyi yorumlama | Interpreting the relationship |
| 89 | Tanımdan kavrama | From definition to concept |
| 90 | Kulluk kavramı | The concept of devotion |
| 91 | İnançtan günlük tutuma | From belief to everyday attitudes |
| 92 | Güven-sorumluluk ayrımı | Distinguishing trust and responsibility |
| 93 | İman Hayata Nasıl Yansır? | How Does Faith Shape Life? |
| 94 | Başarı ve şükür | Success and gratitude |
| 95 | Görev sorumluluğu | Responsibility for a task |
| 96 | Çaba ve güven | Effort and trust |
| 97 | Günlük nimet | Everyday blessings |
| 98 | Sosyal medya | Social media |
| 99 | Nimeti kullanma | Using a blessing |
| 100 | Belirsizlikle karşılaşma | Facing uncertainty |
| 101 | Aile içi davranış | Behaviour within the family |
| 102 | Zorluk içinde şükür | Gratitude in difficulty |
| 103 | Çevreye özen | Care for the environment |
| 104 | Yardımlaşma | Helping one another |
| 105 | Plan değişikliği | A change of plans |
| 106 | Takdir edilme | Receiving praise |
| 107 | Güven yanılgısı | A misconception about trust |
| 108 | İman-davranış ilişkisi | The relationship between faith and behaviour |
| 109 | Tevhidi uygulayarak hatırlama | Recalling tawhid through practice |
| 110 | Şükür yanılgısı | A misconception about gratitude |
| 111 | İman tanımı yanılgısı | A misconception about the definition of faith |
| 112 | Hızlı uygulama | Quick practice |
| 113 | Güven tanımı | Defining trust |
| 114 | Allah'a İman Challenge | Faith in Allah Challenge |
| 115 | Allah'a iman özeti | Summary of faith in Allah |
| 116 | Tevhid özeti | Summary of tawhid |
| 117 | Yaratıcı-yaratılan özeti | Summary of Creator and creation |
| 118 | Hızlı final | Quick final |
| 119 | İman ve hayat | Faith and life |
| 120 | Şükür özeti | Summary of gratitude |
| 121 | Güven özeti | Summary of trust |
| 122 | Dürüstlük uygulaması | Practising honesty |
| 123 | Şükür uygulaması | Practising gratitude |
| 124 | Güven uygulaması | Putting trust into practice |
| 125 | Yaratıcı-yaratılan hatası | An error about Creator and creation |
| 126 | Tevhid hatası | An error about tawhid |
| 127 | Bütüncül uygulama | Putting the concepts together |
| 128 | Şehadet Nedir? | What Is the Shahada? |
| 129 | Kelime-i Şehadet'e giriş | Introduction to the Shahada |
| 130 | Şehadetin bölümleri | The parts of the Shahada |
| 131 | Şehadetin anlamı | The meaning of the Shahada |
| 132 | Şehadetin Türkçe anlamı | The English meaning of the Shahada |
| 133 | Şehadetin içeriği | The content of the Shahada |
| 134 | Şehadet'in şartı | A condition of the Shahada |
| 135 | Şahitlik kavramı | The concept of testimony |
| 136 | İlk kelime tanıma | Recognising the first word |
| 137 | İki beyan | Two declarations |
| 138 | İmanın kapsayıcılığı | The scope of faith |
| 139 | Resûlullah kelime anlamı | The meaning of Rasulullah |
| 140 | Genel Anlam | Overall meaning |
| 141 | Sözlü beyan | Spoken declaration |
| 142 | Anlamını Öğren | Learn Its Meaning |
| 143 | Tevhid kavramı eşleşmesi | Matching the concept of tawhid |
| 144 | Peygamberlik kavramı eşleşmesi | Matching the concept of prophethood |
| 145 | Bölüm-Anlam Eşleştirme | Matching parts to meanings |
| 146 | İlah kavramı | The concept of a deity |
| 147 | Anlam tamamlama | Completing the meaning |
| 148 | Peygamberliğin kabulü | Accepting prophethood |
| 149 | Şehadet metni inceleme | Examining the Shahada text |
| 150 | Lâ ilâhe illallah eşleşmesi | Matching La ilaha illallah |
| 151 | Tevhid ve Risalet dengesi | The balance between tawhid and messengership |
| 152 | İlah kelimesinin reddi | The negation of other deities |
| 153 | Şahitlik pratik anlamı | The practical meaning of testimony |
| 154 | Resûl ve elçi ilişkisi | The connection between rasul and messenger |
| 155 | Eksik parça tespiti | Finding the missing part |
| 156 | İlahiyet Kavramı | The concept of divinity |
| 157 | Dinle ve Tanı | Listen and Recognise |
| 158 | Tam metin tanıma | Recognising the complete text |
| 159 | Ses-Anlam eşleşmesi | Matching audio to meaning |
| 160 | İlk kısım tanıma | Recognising the first part |
| 161 | Ses içeriği | Audio content |
| 162 | İşiterek boşluk doldurma | Filling a blank by listening |
| 163 | Eşhedü tekrarı duyma | Hearing the repeated word Ashhadu |
| 164 | İşitsel hata tespiti bağlamı | Finding a mistake in audio context |
| 165 | Son kelime tanıma | Recognising the last word |
| 166 | Kavram eşleme işitsel | Matching concepts by listening |
| 167 | İki parça birleştirici | Joining the two parts |
| 168 | Peygamber ismi tanıma | Recognising the prophet's name |
| 169 | Peygamberliğin işitsel karşılığı | Hearing the prophethood declaration |
| 170 | İlk şahitlik vurgusu | The first testimony |
| 171 | Kavram tanıma tekrar | Reviewing concept recognition |
| 172 | Şehadeti Oluştur | Build the Shahada |
| 173 | Tüm ifade sıralaması | Ordering the complete statement |
| 174 | Son kelime | Last word |
| 175 | İlk kısım tamamlama | Completing the first part |
| 176 | Detaylı kelime sıralama | Detailed word ordering |
| 177 | Bağlaç bilgisi | Understanding conjunctions |
| 178 | Türkçe anlam sıralama | Ordering the English meaning |
| 179 | Başlangıç kelimesi | Opening word |
| 180 | İkinci kısım sıralama | Ordering the second part |
| 181 | Orta kelime | Middle word |
| 182 | Anlam eksikliği | Incomplete meaning |
| 183 | Tüm cümle parçaları sıralama | Ordering all sentence parts |
| 184 | Negatif ifade tanıma | Recognising a negative statement |
| 185 | Kelime kontrolü | Word check |
| 186 | Bütünleyici anlam | Combined meaning |
| 187 | Çeviri parça eşleşmesi | Matching translated parts |
| 188 | Hızlı kelime kontrolü | Quick word check |
| 189 | Ne Söylediğini Anla | Understand What You Say |
| 190 | Senaryo - Eksik anlayış | Scenario: incomplete understanding |
| 191 | Senaryo - Özümseme | Scenario: internalising the meaning |
| 192 | Doğru kavrama | Correct understanding |
| 193 | Senaryo - Elçi konumu | Scenario: the messenger's position |
| 194 | Tevhid Hata Tespiti | Finding a tawhid mistake |
| 195 | Bütünlük ilkesi | Completeness |
| 196 | Şahitlik bilinci | Awareness of testimony |
| 197 | Parçalar arası anlam | Meaning across the parts |
| 198 | Pratik inanç eşleşmesi | Matching belief in practice |
| 199 | Senaryo - Söz ve Öz | Scenario: words and sincerity |
| 200 | İlah kelimesinin kapsayıcılığı | The scope of the word deity |
| 201 | Hata tespiti - Resulullah konumu | Finding a mistake: the position of Allah's Messenger |
| 202 | Boşluk doldurma uygulama | Fill-in-the-blank practice |
| 203 | Sürekli bilinç | Continuing awareness |
| 204 | Şahitlik hissi | A sense of bearing witness |
| 205 | Bağlamsal bağlantı | Contextual connection |
| 206 | Kavramsal Geri Çağırma 1 | Concept recall 1 |
| 207 | İlah reddi zihinsel model | Understanding the negation of other deities |
| 208 | Anlam eksikliği pratik | Practising complete understanding |
| 209 | İşitsel Hafıza | Auditory memory |
| 210 | Şahitlik Pratiği | Testimony practice |
| 211 | Çeviri yapı bozumu | Breaking down the translation |
| 212 | Kavramları Hızlı Eşleştirme | Quick concept matching |
| 213 | Elçi reddi senaryosu | Scenario: denying the messenger |
| 214 | Kelime tamamlama | Completing a word |
| 215 | Tevhid Kavramı Tekrar | Reviewing tawhid |
| 216 | Dil ve Kalp | Tongue and heart |
| 217 | Odaklanma - Eşhedü | Focus: Ashhadu |
| 218 | Şehadet Challenge | Shahada Challenge |
| 219 | Kapsamlı Senaryo | Comprehensive scenario |
| 220 | Tam metin hız testi | Full-text speed check |
| 221 | Odaklı dinleme hata tespiti | Finding mistakes through focused listening |
| 222 | Tevhid özü | The essence of tawhid |
| 223 | Kelimeler arası geçiş | Transitions between words |
| 224 | Şehadet ve İman bağlantısı | The connection between the Shahada and faith |
| 225 | Ünite temel kavramları | Key concepts in the unit |
| 226 | Hata Bulmaca | Find the mistake |
| 227 | Boşluk doldurma (Bütünleşik) | Integrated fill-in-the-blank |
| 228 | Tevhid ve Pratik Yaşam | Tawhid in daily life |
| 229 | Son kelime doğruluk testi | Checking the last word |
| 230 | Sesli tamamlama analizi | Analysing audio completion |
| 231 | Gerçek inanç vurgusu | Sincere belief |
| 232 | Final kelime dizilimi | Final word order |
| 233 | Beş Şartı Tanı | Meet the Five Pillars |
| 234 | İslam'ın Şartları Nelerdir? | What are the pillars of Islam? |
| 235 | Şehadet'in Yeri | The place of the Shahada |
| 236 | İbadet Olarak Namaz | Prayer as worship |
| 237 | Mekke ve İbadet | Mecca and worship |
| 238 | Şartların Sayısı | The number of pillars |
| 239 | Ramazan ve Oruç | Ramadan and fasting |
| 240 | İslam'ın Şartları Listesi | List of the pillars of Islam |
| 241 | Şartlar ve İnançlar | Pillars and beliefs |
| 242 | Şehadet ve Namaz | The Shahada and Prayer |
| 243 | Şehadetin Anlamı | The meaning of the Shahada |
| 244 | Düzenli İbadet Namaz | Prayer as regular worship |
| 245 | İlk Şartın Yeri | The place of the first pillar |
| 246 | Namazın Kapsamı | The scope of prayer |
| 247 | Şehadet ve Namaz İlişkisi | The connection between the Shahada and prayer |
| 248 | Şehadetin Yeri | The place of the Shahada |
| 249 | Namazın Önemi | The importance of prayer |
| 250 | İnanç Beyanı | Declaration of faith |
| 251 | Düzenli İbadet | Regular worship |
| 252 | Şehadet ve Namazın Kapsamı | The scope of the Shahada and prayer |
| 253 | Kelime-i Şehadet'in Yeri | The place of the Shahada |
| 254 | İlk İki Şart | The first two pillars |
| 255 | Namaz Kavramı | The concept of prayer |
| 256 | Oruç, Zekât ve Hac | Fasting, Zakat and Hajj |
| 257 | Malî İbadet Zekât | Zakat as worship involving wealth |
| 258 | Mekke'ye Yolculuk | Journey to Mecca |
| 259 | Zekât Kavramı | The concept of zakat |
| 260 | Oruç Kavramı | The concept of fasting |
| 261 | Son Üç Şartın Özellikleri | Features of the last three pillars |
| 262 | Hac Kavramı | The concept of Hajj |
| 263 | Zekâtın Doğası | The nature of zakat |
| 264 | Oruç ve İbadet | Fasting and worship |
| 265 | Hac Şartı | The pillar of Hajj |
| 266 | Zekât Uygulaması | Practising zakat |
| 267 | Oruç, Zekât, Hac Eşleştirme | Matching fasting, zakat and Hajj |
| 268 | Hac İbadeti | Hajj as worship |
| 269 | İbadet ve Tanım Eşleştirme | Matching worship to definitions |
| 270 | Şehadet ve Hac Eşleştirme | Matching the Shahada and Hajj |
| 271 | Hatalı Eşleştirme Bulma | Finding an incorrect match |
| 272 | Doğru Eşleştirme Seçimi | Choosing the correct match |
| 273 | Kavram Eşleştirme | Concept matching |
| 274 | Hatalı Eşleştirme Bulma 2 | Finding an incorrect match 2 |
| 275 | Şartlar ve Esaslar Ayrımı | Distinguishing pillars and articles of faith |
| 276 | Hatalı İfadeyi Bul | Find the incorrect statement |
| 277 | İbadet Eşleştirme | Matching acts of worship |
| 278 | Kavram Karşılaştırma | Comparing concepts |
| 279 | Hatalı Kavramı Bulma | Finding the incorrect concept |
| 280 | Geniş Eşleştirme | Extended matching |
| 281 | Hac ve Oruç Eşleştirme | Matching Hajj and fasting |
| 282 | Kavram Testi | Concept check |
| 283 | Son Eşleştirme | Final matching |
| 284 | Temel Kavram Seçimi | Choosing a main concept |
| 285 | Hangisi Hangi Şart? | Which Pillar Is It? |
| 286 | Günlük Hayatta Oruç | Fasting in daily life |
| 287 | Günlük Hayatta Zekât | Zakat in daily life |
| 288 | Günlük Hayatta Namaz | Prayer in daily life |
| 289 | Uygulama Hatası | A mistake in practice |
| 290 | Hac İbadeti Uygulaması | Practising Hajj |
| 291 | Şehadet Uygulaması | Practising the Shahada |
| 292 | Hatalı Düşünce Tespiti | Finding a mistaken idea |
| 293 | Senaryo: Yardım Kuruluşu | Scenario: a charity |
| 294 | Senaryo: Seyahat | Scenario: travelling |
| 295 | Hata Bulma: Şart ve İman Karışımı | Find the mistake: confusing pillars and faith |
| 296 | Senaryo: Arkadaşın Sorusu | Scenario: a friend's question |
| 297 | Senaryo: Aile Sohbeti | Scenario: family conversation |
| 298 | Senaryo: Televizyon Programı | Scenario: television programme |
| 299 | Hata Bulma: Eksik Şart | Find the mistake: a missing pillar |
| 300 | Senaryo: İftar Vakti | Scenario: breaking the fast |
| 301 | Senaryo: İşçi ve İşveren | Scenario: employee and employer |
| 302 | Şartların Temeli | The foundation of the pillars |
| 303 | Esaslar Ayrımı | Distinguishing the articles |
| 304 | Namaz Kavramı Tekrarı | Reviewing prayer |
| 305 | Zekât Kavramı Tekrarı | Reviewing zakat |
| 306 | Şehadet Hatırlama | Recalling the Shahada |
| 307 | Oruç Hatırlama | Recalling fasting |
| 308 | Hac İbadeti Hatırlama | Recalling Hajj |
| 309 | Namaz ve Vakit | Prayer and time |
| 310 | Zekât Eksik Bilgi | Incomplete understanding of zakat |
| 311 | İmanın Şartı mı İslam'ın Şartı mı? | Article of faith or pillar of Islam? |
| 312 | Genel Tekrar | General review |
| 313 | Beş Şart Challenge | Five Pillars Challenge |
| 314 | Challenge: Tüm Şartlar | Challenge: all the pillars |
| 315 | Challenge: Hata Bulma | Challenge: find the mistake |
| 316 | Challenge: İlişkiler | Challenge: connections |
| 317 | Challenge: Oruç Senaryosu | Challenge: fasting scenario |
| 318 | Challenge: Esas ve Şart Ayrımı | Challenge: articles of faith and pillars |
| 319 | Challenge: Şehadet | Challenge: the Shahada |
| 320 | Challenge: Namaz | Challenge: prayer |
| 321 | Challenge: Hac Mekânı | Challenge: the place of Hajj |
| 322 | Challenge: Karmaşık Senaryo | Challenge: complex scenario |
| 323 | Challenge: Kavram Hatası 2 | Challenge: conceptual mistake 2 |
| 324 | Challenge: Şartları Sayma | Challenge: listing the pillars |
| 325 | Challenge: Günlük Kullanım | Challenge: daily practice |
| 326 | Challenge: Hatırlama | Challenge: recall |
| 327 | Challenge: Kapsayıcı Senaryo | Challenge: comprehensive scenario |
| 328 | İman Ne Demektir? | What Does Faith Mean? |
| 329 | İman Kavramı | The concept of faith |
| 330 | İman Esasları | The articles of faith |
| 331 | İmanın Temeli | The foundation of faith |
| 332 | İmanın Kapsamı | The scope of faith |
| 333 | Allah'a İman | Belief in Allah |
| 334 | İman Esasları Sayısı | The number of articles of faith |
| 335 | İman ve İnanç | Faith and belief |
| 336 | İman Kavramı Özeti | Reviewing the concept of faith |
| 337 | Altı Esası Tanı | Meet the Six Articles |
| 338 | İmanın 6 Esası | The six articles of faith |
| 339 | Kader ve Kaza | Divine decree and its fulfilment |
| 340 | Meleklere İman | Belief in angels |
| 341 | İmanın 6 Esası Eşleştirme | Matching the six articles of faith |
| 342 | Ahirete İman | Belief in the Hereafter |
| 343 | İmanın 6 Esası Liste | List of the six articles of faith |
| 344 | Hızlı Liste Eşleştirme | Quick list matching |
| 345 | Peygamberlere İman | Belief in the prophets |
| 346 | İmanın 6 Esası Toplu | The six articles together |
| 347 | Kitaplara İman | Belief in the books |
| 348 | Kavram Ayrımı | Distinguishing concepts |
| 349 | İmanın 6 Esası Eşleştirme 2 | Matching the six articles of faith 2 |
| 350 | Kavramları Ayır | Distinguish the Concepts |
| 351 | Ahirete İman Tanımı | Defining belief in the Hereafter |
| 352 | Meleklere İman Tanımı | Defining belief in angels |
| 353 | İman Esasları Anlamları | Meanings of the articles of faith |
| 354 | Kitaplara İman Tanımı | Defining belief in the books |
| 355 | Kadere İman Tanımı | Defining belief in divine decree |
| 356 | İman Esaslarını Eşleştirme 3 | Matching articles of faith 3 |
| 357 | Kadere İman Özelliği | A feature of belief in divine decree |
| 358 | İman Esaslarını Eşleştirme 4 | Matching articles of faith 4 |
| 359 | İman Esaslarını Eşleştirme 5 | Matching articles of faith 5 |
| 360 | Ahirete İman Vurgusu | Emphasising belief in the Hereafter |
| 361 | Kavramları Ayırma Özeti | Review: distinguishing concepts |
| 362 | Şart mı, İman Esası mı? | Pillar or Article of Faith? |
| 363 | Namaz ve Melekler | Prayer and angels |
| 364 | Sınıflandırma | Classification |
| 365 | Kategori Eşleştirme | Category matching |
| 366 | Öğrenci Hatası | A learner's mistake |
| 367 | Hac vs Kitaplar | Hajj and the books |
| 368 | Senaryo - Sınıflandırma | Scenario: classification |
| 369 | Ortak Kategori | A shared category |
| 370 | Hata Bulma 2 | Finding the mistake 2 |
| 371 | Eşleştirme | Matching |
| 372 | Kategori Ayrımı | Distinguishing categories |
| 373 | Hata Bulma 3 | Finding the mistake 3 |
| 374 | Kategori Farkı | Category difference |
| 375 | Sınıflandırma Eşleştirme | Classification matching |
| 376 | Sınıflandırma Özeti | Classification review |
| 377 | Senaryo Analizi | Scenario analysis |
| 378 | Karışık Liste | Mixed list |
| 379 | Günlük Hayatta Kavramlar | Concepts in Daily Life |
| 380 | Ölüm Sonrası Hayat | Life after death |
| 381 | Vahiy ve Kitaplar | Revelation and the books |
| 382 | Allah'ın Bilgisi | Allah's knowledge |
| 383 | Yanlış Bağlam | Incorrect context |
| 384 | Hata Bulma 4 | Finding the mistake 4 |
| 385 | Senaryo Tanıma | Recognising a scenario |
| 386 | Senaryo Tanıma 2 | Recognising a scenario 2 |
| 387 | Genel Soru | General question |
| 388 | Hata Bulma 5 | Finding the mistake 5 |
| 389 | Senaryo | Scenario |
| 390 | Kavram Genelleme | Generalising concepts |
| 391 | Senaryo Çoktan Seçmeli | Multiple-choice scenario |
| 392 | Kavram Çoktan Seçmeli | Multiple-choice concept question |
| 393 | Senaryo Özeti | Scenario summary |
| 394 | Kısım Öncesi Akıllı Tekrar | Smart Review Before the Next Section |
| 395 | U1-U5 Tekrar | U01-U05 review |
| 396 | Kelime-i Şehadet ve İman | The Shahada and faith |
| 397 | Şartlar ve Esaslar Sayısı | The number of pillars and articles |
| 398 | Hata Bulma | Finding the mistake |
| 399 | Senaryo Tekrarı | Scenario review |
| 400 | Temel Kavramlar | Main concepts |
| 401 | Hac ve Kader | Hajj and divine decree |
| 402 | Genel Bilgi | General knowledge |
| 403 | Hata Bulma Kısım Özeti | Section review: finding mistakes |
| 404 | Senaryo Özeti 2 | Scenario summary 2 |
| 405 | İman Esasları Challenge | Articles of Faith Challenge |
| 406 | Kadere İman Senaryo | Scenario: belief in divine decree |
| 407 | Eşleştirme Challenge | Matching challenge |
| 408 | Kategori Farkı 2 | Category difference 2 |
| 409 | Eşleştirme Challenge 2 | Matching challenge 2 |
| 410 | Temel Kural | Main principle |
| 411 | Kadere İman Kapsamı | The scope of belief in divine decree |
| 412 | Peygamberlere İman Kapsamı | The scope of belief in the prophets |
| 413 | Kavram Geneli | Concept overview |
| 414 | Final Sorusu | Final question |
| 415 | Melekler Kimdir? | Who Are Angels? |
| 416 | İman Esası | An article of faith |
| 417 | Kaynak Bilinci | Awareness of sources |
| 418 | Tevhid Sınırı | The bounds of tawhid |
| 419 | Temel Ayrımlar | Main distinctions |
| 420 | Elçilik | Messengership |
| 421 | Kaynak Sınırı | The limits of sources |
| 422 | İmanın Anlamı | The meaning of faith |
| 423 | Kaynak Okuryazarlığı | Understanding sources |
| 424 | Meleklerin Özellikleri | The Qualities of Angels |
| 425 | İtaat | Obedience |
| 426 | Ayetlerle Özellikler | Qualities described in verses |
| 427 | Kanatlar | Wings |
| 428 | Tesbih | Glorifying Allah |
| 429 | Kulluk Özeti | Summarising servanthood |
| 430 | Cebrâil ve Vahiy | Gabriel and Revelation |
| 431 | Vahiy Rolleri | Roles in revelation |
| 432 | Meleklere Saygı | Respect for angels |
| 433 | Vahiy Akışı | The conveyance of revelation |
| 434 | Kur'an'da Meleklerin Görevleri | The Duties of Angels in the Quran |
| 435 | Amellerin Kaydı | Recording deeds |
| 436 | Kayıt ve İlahi Bilgi | Recording and divine knowledge |
| 437 | Görevler | Duties |
| 438 | Ölüm Meleği | The angel of death |
| 439 | Görev Çeşitliliği | Different duties |
| 440 | Bilginin Sınırı | The limits of knowledge |
| 441 | Müminler İçin Dua | Supplication for believers |
| 442 | Tevhid ve Dua | Tawhid and supplication |
| 443 | Meleklere İmanın Anlamı | The Meaning of Belief in Angels |
| 444 | İman ve Hayat | Faith and life |
| 445 | Gayba İman | Belief in the unseen |
| 446 | Öğrenme Yöntemi | Learning method |
| 447 | Yanlış Anlamaları Düzelt | Correct Misunderstandings |
| 448 | İblîs ve Melekler | Iblis and angels |
| 449 | Yanlış Bilgiyi Düzeltme | Correcting misinformation |
| 450 | Melekler Ustalığı | Mastering Angels |
| 451 | Ustalık | Mastery |
| 452 | Kitaplara İman Nedir? | What Is Belief in the Books? |
| 453 | Önceki Vahiyler | Earlier revelations |
| 454 | Vahyin Kaynağı | The source of revelation |
| 455 | Tevrat, İncil, Zebur ve Sahifeler | The Torah, the Gospel, the Zabur and the Scrolls |
| 456 | Kitap ve Peygamber | Book and prophet |
| 457 | Sahifeler | The scrolls |
| 458 | Kitapların İsimleri | The names of the books |
| 459 | Kur'an'ın Konumu | The Quran's position |
| 460 | Vahiy ve Yorum | Revelation and interpretation |
| 461 | Kur'an'ın Ölçüsü | The Quran's standard |
| 462 | İlahi Kitapların Ortak Kaynağı | The Shared Source of Divine Books |
| 463 | Kaynak Birliği | A shared source |
| 464 | Kitapların Nitelikleri | The qualities of the books |
| 465 | Hidayet ve Nur | Guidance and light |
| 466 | Vahyin İşlevi | The purpose of revelation |
| 467 | Kaynak ve Rehberlik | Source and guidance |
| 468 | Kur'an ve Önceki Vahiy | The Quran and earlier revelation |
| 469 | Vahyin Akışı | The conveyance of revelation |
| 470 | Vahiy Sürekliliği | Continuity of revelation |
| 471 | Kur'an'ın Rehberliği ve Korunması | The Quran's Guidance and Preservation |
| 472 | Kur'an'ın Rehberliği | The Quran's guidance |
| 473 | Kur'an'ın Korunması | The Quran's preservation |
| 474 | Kur'an'ın Nitelikleri | The Quran's qualities |
| 475 | Kur'an'la İlişki | Engaging with the Quran |
| 476 | Kur'an'ın Kimliği | The Quran's identity |
| 477 | Vahiy ve İnsan Sözü | Revelation and human speech |
| 478 | Kaynak Ahlakı | Ethical use of sources |
| 479 | Kitaplara İman Ustalığı | Mastering Belief in the Books |
| 480 | Peygamberlere İman Nedir? | What Is Belief in the Prophets? |
| 481 | İman Bütünlüğü | Complete faith |
| 482 | Peygamberlerin Bilgisi | The knowledge of prophets |
| 483 | İman ve Derece | Faith and rank |
| 484 | Peygamberlerin İnsan Oluşu ve Vahiy | The Humanity of Prophets and Revelation |
| 485 | İnsan ve Vahiy | Humanity and revelation |
| 486 | Peygamberlerin İnsan Oluşu | The humanity of prophets |
| 487 | Örneklik | Example |
| 488 | Tebliğ, Müjde ve Uyarı | Conveyance, Good News and Warnings |
| 489 | Peygamberlerin Görevi | The duties of prophets |
| 490 | İnsan Sorumluluğu | Human responsibility |
| 491 | Ortak Çağrı ve İman Birliği | The Shared Call and Unity of Faith |
| 492 | Tevhid Çağrısı | The call to tawhid |
| 493 | Ortak Mesaj | The shared message |
| 494 | Ayetlerle Peygamberlik | Prophethood in the verses |
| 495 | Gönderiliş Gayesi | The purpose of sending prophets |
| 496 | Hz. Muhammed ve Risalet | Muhammad and Messengership |
| 497 | Evrensel Risalet | Universal messengership |
| 498 | Örneklik ve Tevhid | Example and tawhid |
| 499 | Tevhid ve Risalet | Tawhid and messengership |
| 500 | Peygamberlere İman Ustalığı | Mastering Belief in the Prophets |
| 501 | Vahiy ve Tebliğ | Revelation and conveyance |
| 502 | Ahiret Gününe İman Nedir? | What Is Belief in the Last Day? |
| 503 | Ahiret Kavramı | The concept of the Hereafter |
| 504 | İman ve İyilik | Faith and goodness |
| 505 | Karşılık | Recompense |
| 506 | Ahiret Akışı | The sequence of the Hereafter |
| 507 | Kıyametin Vakti | The time of the Hour |
| 508 | Ölüm ve Dünya Hayatının Sonu | Death and the End of Worldly Life |
| 509 | Ölüm Bilinci | Awareness of death |
| 510 | Ölüm Sonrası | After death |
| 511 | Pişmanlık | Regret |
| 512 | Yanlış Anlamayı Düzeltme | Correcting a misunderstanding |
| 513 | Ölüm ve Ahiret | Death and the Hereafter |
| 514 | Kıyamet ve Yeniden Diriliş | The Hour and Resurrection |
| 515 | Yeniden Diriliş | Resurrection |
| 516 | Hesap, Amel Defteri ve İlahi Adalet | Reckoning, the Record of Deeds and Divine Justice |
| 517 | İlahi Adalet | Divine justice |
| 518 | Amel Defteri | The record of deeds |
| 519 | İyilik | Goodness |
| 520 | Ahiret Bilincinin Hayata Etkisi | How Awareness of the Hereafter Affects Life |
| 521 | Ahiret ve Ahlak | The Hereafter and good character |
| 522 | Dünya ve Ahiret | This world and the Hereafter |
| 523 | Umut ve Adalet | Hope and justice |
| 524 | Dengeli Öğrenme | Balanced learning |
| 525 | Dengeli Ahiret Bilinci | Balanced awareness of the Hereafter |
| 526 | Ahiret İmanı Ustalığı | Mastering Belief in the Hereafter |
| 527 | Kader ve Kazaya İman Nedir? | What Is Belief in Divine Decree and Its Fulfilment? |
| 528 | Kader ve Kazaya İman | Belief in divine decree and its fulfilment |
| 529 | Allah'ın İlmi, Ölçüsü ve Takdiri | Allah's Knowledge, Measure and Decree |
| 530 | İnsan İradesi ve Sorumluluk | Human Will and Responsibility |
| 531 | Çaba, Tedbir ve Tevekkül | Effort, Precautions and Trust in Allah |
| 532 | Musibet, Sabır ve Denge | Hardship, Patience and Balance |
| 533 | Kader İnancı Ustalığı | Mastering Belief in Divine Decree |
| 534 | İbadet Nedir? | What Is Worship? |
| 535 | Niyet ve İhlas | Intention and Sincerity |
| 536 | İbadetin Hayata Etkisi | How Worship Affects Life |
| 537 | Temizlik ve Taharet | Cleanliness and Ritual Purification |
| 538 | Abdestin Temeli | The Foundations of Ablution |
| 539 | Abdest Adımlarını Tanı | Learn the Steps of Ablution |
| 540 | Teyemmüm ve Kolaylık | Dry Ablution and Ease |
| 541 | Ortak Temel ve Farklar | Shared Foundations and Differences |
| 542 | Namaza Hazırlık | Preparing for Prayer |
| 543 | Yatsı namazı | Night prayer |
| 544 | Öğle namazı | Midday prayer |
| 545 | Vakit ve Kıble | Prayer Time and Direction |
| 546 | Sabah namazı | Dawn prayer |
| 547 | Akşam namazı | Sunset prayer |
| 548 | Şartları Eşleştir | Match the Conditions |
| 549 | İkindi namazı | Afternoon prayer |
| 550 | Hazırlık Senaryoları | Preparation Scenarios |
| 551 | Beş Vakit | The Five Daily Prayers |
| 552 | Namazın Yapısı | The Structure of Prayer |
| 553 | Kıyam, Kıraat, Rükû, Secde | Standing, Recitation, Bowing and Prostration |
| 554 | Rekâtı Kur | Build a Prayer Unit |
| 555 | Namaz İçinde Akış | The Sequence Within Prayer |
| 556 | Mazerette Kolaylık | Ease in Cases of Difficulty |
| 557 | Oruç Nedir? | What Is Fasting? |
| 558 | Bilerek yemek | Eating deliberately |
| 559 | Yeme | Eating |
| 560 | Ramazan ve Takva | Ramadan and Mindfulness of Allah |
| 561 | Unutarak yemek | Eating forgetfully |
| 562 | Cinsel ilişki | Sexual intercourse |
| 563 | İmsak ve İftar | Beginning and Breaking the Fast |
| 564 | İçme | Drinking |
| 565 | Oruçlu Günlük Hayat | Daily Life While Fasting |
| 566 | Mazeret ve Kaza | Concessions and Making Up Missed Fasts |
| 567 | DEEN’e hoş geldin | Welcome to DEEN |
| 568 | İslam’ı adım adım, sakin ve düzenli şekilde öğren. | Learn about Islam step by step, calmly and consistently. |
| 569 | Sana nasıl hitap edelim? | What should we call you? |
| 570 | Adın veya kullanıcı adın | Your name or username |
| 571 | Bu isim profilinde görünecek. | This name will appear on your profile. |
| 572 | Yolcu | Traveller |
| 573 | Yaşını yazmana gerek yok; sana en rahat gelen öğrenme stilini seç. | You do not need to enter your age. Choose the style that suits you best. |
| 574 | Çocuk | Child |
| 575 | Genç | Teen |
| 576 | Yetişkin | Adult |
| 577 | Kısa, sade ve görsel ağırlıklı anlatım | Short, simple explanations with visual support |
| 578 | Açık, akıcı ve günlük hayata yakın örnekler | Clear, fluent explanations with everyday examples |
| 579 | Daha derin, dengeli ve düzenli açıklamalar | Deeper, balanced and structured explanations |
| 580 | Yol arkadaşını seç | Choose your companion |
| 581 | Seçtiğin hayvan profilinde, serilerinde ve ders sonunda sana eşlik edecek. | Your animal will accompany you on your profile, streaks and lesson results. |
| 582 | Aslan | Lion |
| 583 | Kurt | Wolf |
| 584 | Baykuş | Owl |
| 585 | Kaplumbağa | Turtle |
| 586 | Kartal | Eagle |
| 587 | Kedi | Cat |
| 588 | Cesaret | Courage |
| 589 | Kararlılık | Determination |
| 590 | Odak | Focus |
| 591 | Sakinlik | Calm |
| 592 | Önce bir hayvan seç | Choose an animal first |
| 593 | Günde ne kadar zaman ayırabilirsin? | How much time can you spend each day? |
| 594 | Kısa ama düzenli ilerlemek daha iyi sonuç verir. | Short, regular practice leads to better results. |
| 595 | Hızlı ve hafif tempo · 1 mini ders | Quick and light · 1 short lesson |
| 596 | Dengeli günlük ritim · 2 mini ders | A balanced daily pace · 2 short lessons |
| 597 | Daha yoğun öğrenme · 3 mini ders | More intensive learning · 3 short lessons |
| 598 | Hazırsın | You are ready |
| 599 | İslam Nedir? | What Is Islam? |
| 600 | Temel kavramlarla tanış. İnanç, ibadet ve ahlak arasındaki bağı keşfet. | Meet the main concepts. Discover the connection between faith, worship and good character. |
| 601 | Allah’a İman | Belief in Allah |
| 602 | Tevhidi ve imanın hayata yansımalarını öğren. | Learn about Allah's oneness and how faith is reflected in life. |
| 603 | Şehadetin anlamını tanı; parçaları arasında bağ kur. | Learn the meaning of the testimony of faith and connect its parts. |
| 604 | İslam’ın Beş Şartı | The Five Pillars of Islam |
| 605 | Beş şartı tanı, doğru bağlamlarıyla eşleştir. | Recognise the five pillars and match them with their correct contexts. |
| 606 | İmanın Esaslarına Giriş | Introduction to the Articles of Faith |
| 607 | Altı iman esasını öğren ve birbirinden ayırt et. | Learn the six articles of faith and distinguish between them. |
| 608 | İlk 5 ünitedeki bilgini tek bir ustalık sınavında bir araya getir. | Bring together what you learned in the first five units in one mastery test. |
| 609 | KISIM 2 · İMAN | SECTION 2 · FAITH |
| 610 | Meleklere iman konusunu adım adım pekiştir. | Reinforce belief in angels step by step. |
| 611 | Kitaplara imanla ilgili temel kavramları keşfet. | Discover the main concepts of belief in the revealed books. |
| 612 | Peygamberlere iman konusundaki bilgini güçlendir. | Strengthen your knowledge of belief in the prophets. |
| 613 | Ahiret Gününe İman | Belief in the Last Day |
| 614 | Ahiret inancını tanı, hatırla ve pekiştir. | Recognise, recall and reinforce belief in the Hereafter. |
| 615 | Kader ve kaza kavramlarını kaynak notlarıyla öğren. | Learn the concepts of divine decree and its fulfilment with source notes. |
| 616 | KISIM 2 FİNALİ | SECTION 2 FINAL |
| 617 | İman Ustalığı | Faith Mastery |
| 618 | İman bölümündeki 5 ünitenin bilgisini bir araya getir. | Bring together your knowledge from the five units on faith. |
| 619 | KISIM 3 · İBADET | SECTION 3 · WORSHIP |
| 620 | Fıkıh kapsamı · Ortak temel | Scope of Islamic jurisprudence · Shared foundation |
| 621 | Bu sürüm mezheplerin ortak çekirdeğini öğretir. | This version teaches the shared core of the schools of law. |
| 622 | İbadet Bilinci | Awareness of Worship |
| 623 | İbadetin anlamını, niyet ve ihlası; ibadet bilgisinin nasıl öğrenildiğini kavra. | Understand the meaning of worship, intention and sincerity, and how to learn about worship. |
| 624 | Temizlik ve Abdest | Cleanliness and Ablution |
| 625 | Taharetin anlamını, abdestin Kur’an’daki ortak temelini ve teyemmümdeki kolaylığı öğren. | Learn the meaning of ritual purification, ablution's shared foundation in the Quran, and the ease offered by dry ablution. |
| 626 | Namaz vakti, kıble, temizlik, niyet ve beş vakit farz rekâtların temelini öğren. | Learn the foundations of prayer time, direction, purification, intention and obligatory units in the five daily prayers. |
| 627 | Namazın temel rükünlerini, bir rekâtın akışını ve mazeretteki kolaylık ilkesini öğren. | Learn the main pillars of prayer, the sequence of a unit, and the principle of ease when difficulties arise. |
| 628 | Oruç ve Ramazan | Fasting and Ramadan |
| 629 | Ramazan orucunun anlamını, imsak-iftar sınırını, takva amacını ve temel mazeretleri öğren. | Learn the meaning of fasting in Ramadan, its dawn-to-sunset limits, its aim of mindfulness of Allah, and the main concessions. |
| 630 | KISIM 3 FİNALİ | SECTION 3 FINAL |
| 631 | İbadet Temelleri Ustalığı | Foundations of Worship Mastery |
| 632 | İbadet bölümündeki ortak-temel bilgileri bir araya getir. | Bring together the shared foundations from the units on worship. |
| 633 | Seri detayları | Streak details |
| 634 | Neden şimdi? | Why now? |
| 635 | Yeni ilerleme | New progress |
| 636 | HAFTALIK RİTİM | WEEKLY RHYTHM |
| 637 | USTALIK SINAVINI BAŞLAT | START THE MASTERY TEST |
| 638 | ADAPTIVE MEMORY ENGINE · v6.4 | ADAPTIVE MEMORY ENGINE · v6.4 |
| 639 | Ünite bazında | By unit |
| 640 | Bu skor yalnız öğrenme ve hatırlama performansını yönetir; dinî yeterlilik veya ibadet değeri değildir. | This score manages learning and recall performance only; it does not measure religious competence or the value of worship. |
| 641 | 1. gün + 7. gün | Day 1 + day 7 |
| 642 | Dersi bitirdiğin gün değil, unutma başlamadan hemen önce hatırla. | Recall just before forgetting begins, rather than only on the day you finish a lesson. |
| 643 | Yarın | Tomorrow |
| 644 | 5 farklı günde Bugünkü Yolculuk'u tamamla | Complete Today's Journey on 5 different days |
| 645 | İlk Adım | First Step |
| 646 | İlk dersini tamamla | Complete your first lesson |
| 647 | İstikrar | Consistency |
| 648 | Bilgi Yolcusu | Knowledge Traveller |
| 649 | 25 ders tamamla | Complete 25 lessons |
| 650 | Usta Öğrenci | Master Learner |
| 651 | Bir ünitede %100 ustalık | Reach 100% mastery in one unit |
| 652 | Kısım Ustası | Section Master |
| 653 | Bir kısım finalini geç | Pass a section final |
| 654 | Öğrenerek 1000 XP kazan | Earn 1000 XP through learning |
| 655 | Keskin Odak | Sharp Focus |
| 656 | 10 kusursuz ders tamamla | Complete 10 perfect lessons |
| 657 | Hatırlama Ritmi | Recall Rhythm |
| 658 | 10 tekrar dersi tamamla | Complete 10 review lessons |
| 659 | Uzun Yol | Long Journey |
| 660 | 50 ders tamamla | Complete 50 lessons |
| 661 | Bilgi Birikimi | Knowledge Gained |
| 662 | Öğrenerek 5000 XP kazan | Earn 5000 XP through learning |
| 663 | Öğrenme oyunlaştırılır; ibadet puanlanmaz. Dinî içerikler uzman incelemesi bekler. | Learning uses game elements; worship is not scored. Religious content awaits expert review. |
| 664 | DEEN ADMIN | DEEN ADMIN |
| 665 | P · DEVELOPER CONTROL CENTER | P · DEVELOPER CONTROL CENTRE |
| 666 | HIZLI İLERLEME | QUICK PROGRESS |
| 667 | TÜM BÖLÜMLERİ GEÇ | COMPLETE ALL SECTIONS |
| 668 | TÜM BÖLÜMLERİ SIFIRLA | RESET ALL SECTIONS |
| 669 | KISIM 1’İ GEÇ | COMPLETE SECTION 1 |
| 670 | KISIM 1’İ SIFIRLA | RESET SECTION 1 |
| 671 | KISIM 2’Yİ GEÇ | COMPLETE SECTION 2 |
| 672 | KISIM 2’Yİ SIFIRLA | RESET SECTION 2 |
| 673 | KISIM 3’Ü GEÇ | COMPLETE SECTION 3 |
| 674 | KISIM 3’Ü SIFIRLA | RESET SECTION 3 |
| 675 | TÜM ROZETLERİ AÇ | UNLOCK ALL BADGES |
| 676 | TÜM KİLİTLERİ AÇ | UNLOCK EVERYTHING |
| 677 | TEK AŞAMA KONTROLÜ | INDIVIDUAL STAGE CONTROL |
| 678 | SEÇİLİ AŞAMAYI GEÇ | COMPLETE SELECTED STAGE |
| 679 | AŞAMAYI GERİ AL | UNDO STAGE |
| 680 | ÖĞREN EKRANINA DÖN | RETURN TO LEARN |
| 681 | ÜNİTE KONTROLÜ | UNIT CONTROL |
| 682 | SEÇİLİ ÜNİTEYİ GEÇ | COMPLETE SELECTED UNIT |
| 683 | ÜNİTEYİ GERİ AL | UNDO UNIT |
| 684 | KISIM 1 FİNALİNİ GEÇ | COMPLETE SECTION 1 FINAL |
| 685 | KISIM 2 FİNALİNİ GEÇ | COMPLETE SECTION 2 FINAL |
| 686 | KISIM 3 FİNALİNİ GEÇ | COMPLETE SECTION 3 FINAL |
| 687 | SINIRSIZ ENERJİ | UNLIMITED ENERGY |
| 688 | 100 GÜN SERİ | 100-DAY STREAK |
| 689 | NORMAL ENERJİ | NORMAL ENERGY |
| 690 | ROZETLERİ KİLİTLE | LOCK BADGES |
| 691 | GİRİŞ EKRANINA DÖN | RETURN TO ENTRY |
| 692 | ONBOARDING’İ BAŞTAN AÇ | RESTART ONBOARDING |
| 693 | PROFİLE GİT | GO TO PROFILE |
| 694 | ÖĞREN EKRANINA GİT | GO TO LEARN |
| 695 | “Giriş ekranına dön” mevcut progress’i silmez. “Onboarding’i baştan aç” sadece onboarding tamamlandı bayrağını sıfırlar. | 'Return to entry' preserves progress. 'Restart onboarding' resets only the onboarding completion flag. |
| 696 | ROZET + RUNTIME AUDIT | BADGE + RUNTIME AUDIT |
| 697 | STATE JSON KOPYALA | COPY STATE JSON |
| 698 | İLERLEMEYİ SIFIRLA | RESET PROGRESS |
| 699 | TAM SIFIRLAMA | FULL RESET |
| 700 | KUR’AN · PRODUCT ANALYTICS | QURAN · PRODUCT ANALYTICS |
| 701 | KUR’AN · UZMAN DOĞRULAMA | QURAN · EXPERT VERIFICATION |
| 702 | KAYNAK GÖRÜNÜR | SOURCE VISIBLE |
| 703 | SES KAYDI HAZIR | AUDIO RECORDING READY |
| 704 | UZMAN ONAYLI | EXPERT APPROVED |
| 705 | İNCELEMEDE | UNDER REVIEW |
| 706 | TÜRKÇE MEAL | TURKISH TRANSLATION |
| 707 | ÖĞRENME NOTU | LEARNING NOTE |
| 708 | Tanımlı değil | Not defined |
| 709 | TASLAĞI KAYDET | SAVE DRAFT |
| 710 | YAYINA ONAYLA | APPROVE FOR PUBLICATION |
| 711 | İNCELEMEYE GERİ AL | RETURN TO REVIEW |
| 712 | SONRAKİ BEKLEYEN | NEXT PENDING ITEM |
| 713 | Henüz uzman işlemi yok. | No expert action yet. |
| 714 | Admin panelini kapat | Close admin panel |
| 715 | Pencereyi kapat | Close window |
| 716 | Belirgin tekrar eden hata yok. Sistem yeni cevaplarla öğrenme profilini güncellemeye devam edecek. | No clear repeated mistakes. The system will keep updating your learning profile with new answers. |
| 717 | Biriktirilebilir ilerleme madalyaları. Ek XP verilmez. | Collectible progress medals. No extra XP is awarded. |
| 718 | Kaynaklı Arapça metin ve kayıtlı meal verisinden otomatik oluşturuldu. | Generated from sourced Arabic text and recorded translation data. |
| 719 | Beyyine | Al-Bayyinah |
| 720 | SON ÜNİTE | LAST UNIT |
| 721 | KISIM 1 FİNALİ | SECTION 1 FINAL |
| 722 | KİLİTLİ · USTALIK SINAVI | LOCKED · MASTERY TEST |
| 723 | Temeller Ustalığı | Foundations Mastery |
| 724 | Geçerli mezhep farklılıkları yanlış cevap olarak puanlanmaz; bütün yeni içerikler uzman incelemesi bekler. | Valid differences between schools of law are not graded as incorrect; all new content awaits expert review. |
| 725 | Fâtiha | Al-Fatihah |
| 726 | Felak | Al-Falaq |
| 727 | Nâs | An-Nas |
| 728 | Mâûn | Al-Ma'un |
| 729 | İnşirah | Ash-Sharh |
| 730 | Zilzâl | Az-Zalzalah |

## Audit scope limitation

The catalog comparison uses the English reference file, which is not itself a complete enumeration of every dynamically assembled Turkish screen string. Runtime/browser QA may reveal **additional** Turkish strings. The count above is therefore **not a certified ceiling** on remaining German work.

**Do not merge or deploy the German release until all blocker conditions are cleared.**
