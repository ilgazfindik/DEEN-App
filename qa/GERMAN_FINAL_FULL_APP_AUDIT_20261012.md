# DEEN German final full-app locale audit — 2026-10-12

> **Deployment decision: BLOCKED.** This audit is intentionally not a religious, legal or native-language approval. A green staging CI does not mean the German application is ready for production.

## Verified inventory

| Surface | Verified status |
|---|---|
| German entry/onboarding | German copy exists; no evidence of an end-to-end approved production German lesson flow |
| English UI translation reference | 1087 source strings |
| German staged UI dictionaries | 592 distinct German strings across four files |
| Source-key overlap with English reference | 237/1087 |
| **English reference keys without German catalog match** | **850** |
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

## Remaining release blockers (priority order)

1. **Translate/verify and wire the remaining GUI reference keys.** The full-app baseline has 850 keys without a match in any of the four German staging catalogs. This is not proof every key appears on the same screen, but each is a possible source of Turkish fallback. Cover every active screen before claiming 'German-only'.
2. **Install a German DOM/runtime UI renderer** equivalent in quality to the English renderer, including dynamic values, result panels, progression, profile, Premium and every Quran control. The current startup injects English and Arabic rendering, not a released German renderer.
3. **Complete independent religious/native German review** of 1,500 base questions, live variants and 90 Quran meaning drafts, maintaining exact right-answer source identity, Qur'an verse identity and unmodified Arabic recitation.
4. **Complete rights/copyright and source attribution review** of Quran meaning publication and any other translated religious content.
5. **Run real mobile and desktop Chrome E2E on a full German release candidate**, including first-run language selection, changing language while logged in, all tabs, multiple question types, wrong/correct feedback, audio, results, Premium, Quran, review and profile.
6. **Only after those gates and explicit QA acceptance**, update release manifest and assets, verify startup hashes, merge to main and inspect the actual GitHub Pages URL.

## Exhaustive unmatched German UI source-key list

This section enumerates the **850 exact source keys** in `assets/i18n/english-ui.draft.json` not present in the union of the four German staging UI catalogs. Some keys are religious terminology and require expert signoff. Current English reference values are included as context; **they are not proposed German translations**.

| # | Turkish source key | English reference meaning |
|---:|---|---|
| 1 | Ahlak | Good character |
| 2 | İbadet | Worship |
| 3 | Kur'an | Quran |
| 4 | Tevhid | Tawhid |
| 5 | Sorumluluk | Responsibility |
| 6 | Kelime-i Şehadet | The Shahada |
| 7 | Hac | Hajj |
| 8 | Namaz | Prayer |
| 9 | Zekât | Zakat |
| 10 | Zebur | The Zabur |
| 11 | Oruç | Fasting |
| 12 | İman | Faith |
| 13 | Elçiler | Messengers |
| 14 | Cebrâil | Gabriel |
| 15 | Mîkâil | Michael |
| 16 | Tevrat ve İncil | The Torah and the Gospel |
| 17 | İncil | The Gospel |
| 18 | doğru | upright |
| 19 | Teyemmüm | Dry ablution |
| 20 | Beş vakit | Five daily prayers |
| 21 | İftitah tekbiri | Opening takbir |
| 22 | Kulluk | Servanthood |
| 23 | Allah'ın birliği | Allah's oneness |
| 24 | Allah'a iman | Belief in Allah |
| 25 | Yaratılmış olmak | Being created |
| 26 | Birlik kavramı | The concept of oneness |
| 27 | Gösteriş | Showing off |
| 28 | Şükür kavramı | The concept of gratitude |
| 29 | Peygamberlik | Prophethood |
| 30 | Ezan | The call to prayer |
| 31 | Ödül | a reward |
| 32 | Hz. Muhammed | Muhammad |
| 33 | Ramazan | Ramadan |
| 34 | Dua | Supplication |
| 35 | İslam'ın Beş Şartı | The five pillars of Islam |
| 36 | Kıyamet | The Hour |
| 37 | İhlâs | Al-Ikhlas |
| 38 | Melekler | Angels |
| 39 | Vahiy | Revelation |
| 40 | Tevrat | The Torah |
| 41 | Hidayet | Guidance |
| 42 | Tebliğ | Conveyance |
| 43 | Hesap | Reckoning |
| 44 | Ölüm | Death |
| 45 | Berzah | Barzakh |
| 46 | Sabır | Patience |
| 47 | Temizlik | Cleanliness |
| 48 | Düzen | Order |
| 49 | Şekil ve ruh | Form and spirit |
| 50 | İbadet ve ahlak | Worship and good character |
| 51 | Doğru bilgi | Accurate knowledge |
| 52 | İhlas | Sincerity |
| 53 | İbadetin kaynağı | The source of worship |
| 54 | İbadetin anlamı | The meaning of worship |
| 55 | Niyet | Intention |
| 56 | Ortak temel | Shared foundation |
| 57 | Gusül | Full ritual bath |
| 58 | Mezhep farkı: mesh | School differences: wiping |
| 59 | Fıkıh yaklaşımı | The approach to Islamic jurisprudence |
| 60 | Teyemmüm malzemesi | Material for dry ablution |
| 61 | Mezhep farkı: tertip | School differences: order |
| 62 | Namaza hazırlık | Preparation for prayer |
| 63 | Abdestte yüz | The face in ablution |
| 64 | Mezhep farkı: niyet | School differences: intention |
| 65 | Su kullanamama | Inability to use water |
| 66 | Abdest | Ablution |
| 67 | Başı mesh | Wiping the head |
| 68 | Abdestte kollar | The arms in ablution |
| 69 | Abdestte ayaklar | The feet in ablution |
| 70 | Hükmî temizlik | Ritual purification |
| 71 | Namaz niyeti | Intention for prayer |
| 72 | Rekâtların kaynağı | The source of prayer units |
| 73 | Kıble | Direction of prayer |
| 74 | Örtünme | Covering the body |
| 75 | Teyemmümle hazırlık | Preparation through dry ablution |
| 76 | Necasetten temizlik | Purification from physical impurities |
| 77 | Vakit | Fasting time |
| 78 | Son oturuş | Final sitting |
| 79 | Namazın öğrenilmesi | Learning prayer |
| 80 | Mazerette kıyam | Standing when unable to perform it |
| 81 | İki secde | Two prostrations |
| 82 | Secdeler arası oturuş | Sitting between prostrations |
| 83 | Fâtiha hükmü | The ruling on Al-Fatihah |
| 84 | Kıyam | Standing |
| 85 | Sükûnet | Calmness |
| 86 | Mazerette secde | Prostration when unable to perform it |
| 87 | Rükû | Bowing |
| 88 | Kıraat | Recitation |
| 89 | Secde | Prostration |
| 90 | Rekât | Prayer unit |
| 91 | Kur'an ayı | The month of the Quran |
| 92 | Kefaret ayrıntısı | Details of expiation |
| 93 | Hastalık ve yolculuk | Illness and travel |
| 94 | İftar | Breaking the fast |
| 95 | Oruç ahlakı | Good character in fasting |
| 96 | Sahur | Pre-dawn meal |
| 97 | Takva | Mindfulness of Allah |
| 98 | İslam'la Tanış | Meet Islam |
| 99 | İslam'a giriş | Introduction to Islam |
| 100 | Müslüman kimdir | Who is a Muslim? |
| 101 | Temel kavramlara giriş | Introduction to the basic concepts |
| 102 | İman nedir | What is faith? |
| 103 | İbadet nedir | What is worship? |
| 104 | Kur'an nedir | What is the Quran? |
| 105 | Peygamber nedir | What is a prophet? |
| 106 | Müslüman Kimdir? | Who Is a Muslim? |
| 107 | Müslüman olmanın temeli | The basis of being Muslim |
| 108 | İman ve ibadet ilişkisi | Faith and worship |
| 109 | İbadetin amacı | The purpose of worship |
| 110 | Kavramları eşleştirme | Matching concepts |
| 111 | Kur'an'ın önemi | The importance of the Quran |
| 112 | Peygamberin rolü | The Prophet's role |
| 113 | Üçlü ilişki | Relationships between three concepts |
| 114 | Ahlak nedir | What is good character? |
| 115 | Kavramları Eşleştir | Match the Concepts |
| 116 | Temel kavramlar | Basic concepts |
| 117 | İman ve ibadet farkı | The difference between faith and worship |
| 118 | Üçlü bütünlük | Three concepts forming a whole |
| 119 | Kavramların köprüsü | Connections between concepts |
| 120 | Peygamberin bağlantısı | The Prophet and the basic concepts |
| 121 | İslam-Müslüman ilişkisi | The relationship between Islam and Muslim |
| 122 | Kavram sınıflandırma | Classifying concepts |
| 123 | Kavramların temel dörtlüsü | Four basic concepts |
| 124 | Günlük Hayat | Everyday Life |
| 125 | Günlük hayatta ahlak | Good character in everyday life |
| 126 | İman-ahlak ilişkisi | Faith and good character |
| 127 | İbadet-ahlak bütünlüğü | Worship and good character together |
| 128 | Müslümanlığın ölçütü | What defines being Muslim? |
| 129 | İbadetin kapsamı | The scope of worship |
| 130 | İslam'ın kapsamı | The scope of Islam |
| 131 | İbadet-yardım ilişkisi | Worship and helping others |
| 132 | Bildiklerini Kullan | Use What You Know |
| 133 | Ahlakın yeri | The place of good character |
| 134 | Kavramların bütünlüğü | How the concepts form a whole |
| 135 | Kavramların ilişkisi | Relationships between concepts |
| 136 | Peygamberin bugünkü önemi | The Prophet's relevance today |
| 137 | Kur'an'ın kapsamı | The scope of the Quran |
| 138 | Kaynak-uygulama ilişkisi | The relationship between sources and practice |
| 139 | İslam'ı bütünsel anlama | Understanding Islam as a whole |
| 140 | Akıllı Tekrar | Smart Review |
| 141 | İslam'ın bütünlüğü | Islam as a whole |
| 142 | İbadetin özü | The essence of worship |
| 143 | Üçlünün bütünlüğü | The three concepts as a whole |
| 144 | Üçlü ilişki özeti | Summary of the three-way relationship |
| 145 | Kur'an'ın rehberlik yönü | The Quran as guidance |
| 146 | İmanın kalple ilgisi | Faith and the heart |
| 147 | Peygamberin rehberliği | The Prophet's guidance |
| 148 | Ahlaki öz farkındalık | Moral self-awareness |
| 149 | Üçlünün somut örneği | A practical example of the three concepts |
| 150 | Ünite Challenge | Unit Challenge |
| 151 | İslam'ın özeti | Summary of Islam |
| 152 | Görülmeden dürüstlük | Honesty when nobody is watching |
| 153 | İmanın özü | The essence of faith |
| 154 | Temel kavramlar özeti | Summary of the basic concepts |
| 155 | Evrensel kimlik | A universal identity |
| 156 | Peygamberin rolü özeti | Summary of the Prophet's role |
| 157 | Temel çerçeve özeti | Summary of the basic framework |
| 158 | Ünite özeti | Unit summary |
| 159 | Müslüman kimliği | Muslim identity |
| 160 | Kur'an ve rehberlik | The Quran and guidance |
| 161 | Kur’an | The Quran |
| 162 | Kavram haritası | Concept map |
| 163 | Günlük hayat | Everyday life |
| 164 | Ders özeti | Lesson summary |
| 165 | Dürüstlük | Honesty |
| 166 | Allah'a İman Nedir? | What Is Faith in Allah? |
| 167 | Allah'a iman tanımı | Defining faith in Allah |
| 168 | Allah'a imanın yeri | The place of faith in Allah |
| 169 | İman ve ibadet ayrımı | The distinction between faith and worship |
| 170 | İmanın anlamı | The meaning of faith |
| 171 | İmanın kapsamı | The scope of faith |
| 172 | Temel kavram ayrımı | Distinguishing basic concepts |
| 173 | Temel ifade | A basic statement |
| 174 | İnanç ve davranış ilişkisi | The relationship between belief and behaviour |
| 175 | İnanç ve davranış | Belief and behaviour |
| 176 | Tanımın tamamlanması | Completing a definition |
| 177 | Aktif hatırlama | Active recall |
| 178 | Hızlı tekrar | Quick review |
| 179 | Kavramı doğru çerçeveleme | Framing the concept accurately |
| 180 | Allah Birdir | Allah Is One |
| 181 | Tevhid kavramı | The concept of tawhid |
| 182 | Kulluk ve tevhid | Devotion and tawhid |
| 183 | Tevhid ve çokluk | Tawhid and multiple deities |
| 184 | Tevhid ilişkileri | Connections with tawhid |
| 185 | Tanımı tamamlama | Completing the definition |
| 186 | Tevhidi açıklama | Explaining tawhid |
| 187 | Kulluk yönü | The dimension of devotion |
| 188 | Kavram yanılgısı | A misconception about a concept |
| 189 | Yaratıcı ve Yaratılan | Creator and Creation |
| 190 | Allah yaratıcıdır | Allah is the Creator |
| 191 | Yaratıcı-yaratılan ayrımı | The distinction between Creator and creation |
| 192 | Yaratıcı kavramı | The concept of Creator |
| 193 | Yaratıcılık kavramı | The concept of creation |
| 194 | Ayrımı tamamlama | Completing the distinction |
| 195 | Kavram ilişkileri | Relationships between concepts |
| 196 | Kavramı tamamlama | Completing the concept |
| 197 | Benzerlik yanılgısı | A misconception about resemblance |
| 198 | Yaratma kavramını ayırt etme | Distinguishing the concept of creation |
| 199 | Kavram özeti | Concept summary |
| 200 | Kavramları Bağla | Connect the Concepts |
| 201 | İnanç ve davranış bağlantısı | The connection between belief and behaviour |
| 202 | Yaratıcı-yaratılan ilişkisi | The relationship between Creator and creation |
| 203 | Kavram ayrımı | Distinguishing concepts |
| 204 | Kavramların işlevi | The roles of the concepts |
| 205 | Kavram karışıklığı | Confusing concepts |
| 206 | Kavram çiftleri | Pairs of concepts |
| 207 | Güven kavramı | The concept of trust |
| 208 | İlişkiyi yorumlama | Interpreting the relationship |
| 209 | Tanımdan kavrama | From definition to concept |
| 210 | Kulluk kavramı | The concept of devotion |
| 211 | İnançtan günlük tutuma | From belief to everyday attitudes |
| 212 | Güven-sorumluluk ayrımı | Distinguishing trust and responsibility |
| 213 | İman Hayata Nasıl Yansır? | How Does Faith Shape Life? |
| 214 | Başarı ve şükür | Success and gratitude |
| 215 | Görev sorumluluğu | Responsibility for a task |
| 216 | Çaba ve güven | Effort and trust |
| 217 | Günlük nimet | Everyday blessings |
| 218 | Sosyal medya | Social media |
| 219 | Nimeti kullanma | Using a blessing |
| 220 | Belirsizlikle karşılaşma | Facing uncertainty |
| 221 | Aile içi davranış | Behaviour within the family |
| 222 | Zorluk içinde şükür | Gratitude in difficulty |
| 223 | Çevreye özen | Care for the environment |
| 224 | Yardımlaşma | Helping one another |
| 225 | Plan değişikliği | A change of plans |
| 226 | Takdir edilme | Receiving praise |
| 227 | Güven yanılgısı | A misconception about trust |
| 228 | İman-davranış ilişkisi | The relationship between faith and behaviour |
| 229 | Tevhidi uygulayarak hatırlama | Recalling tawhid through practice |
| 230 | Şükür yanılgısı | A misconception about gratitude |
| 231 | İman tanımı yanılgısı | A misconception about the definition of faith |
| 232 | Hızlı uygulama | Quick practice |
| 233 | Güven tanımı | Defining trust |
| 234 | Allah'a İman Challenge | Faith in Allah Challenge |
| 235 | Allah'a iman özeti | Summary of faith in Allah |
| 236 | Tevhid özeti | Summary of tawhid |
| 237 | Yaratıcı-yaratılan özeti | Summary of Creator and creation |
| 238 | Hızlı final | Quick final |
| 239 | İman ve hayat | Faith and life |
| 240 | Şükür özeti | Summary of gratitude |
| 241 | Güven özeti | Summary of trust |
| 242 | Dürüstlük uygulaması | Practising honesty |
| 243 | Şükür uygulaması | Practising gratitude |
| 244 | Güven uygulaması | Putting trust into practice |
| 245 | Yaratıcı-yaratılan hatası | An error about Creator and creation |
| 246 | Tevhid hatası | An error about tawhid |
| 247 | Bütüncül uygulama | Putting the concepts together |
| 248 | Şehadet Nedir? | What Is the Shahada? |
| 249 | Kelime-i Şehadet'e giriş | Introduction to the Shahada |
| 250 | Şehadetin bölümleri | The parts of the Shahada |
| 251 | Şehadetin anlamı | The meaning of the Shahada |
| 252 | Şehadetin Türkçe anlamı | The English meaning of the Shahada |
| 253 | Şehadetin içeriği | The content of the Shahada |
| 254 | Şehadet'in şartı | A condition of the Shahada |
| 255 | Şahitlik kavramı | The concept of testimony |
| 256 | İlk kelime tanıma | Recognising the first word |
| 257 | İki beyan | Two declarations |
| 258 | İmanın kapsayıcılığı | The scope of faith |
| 259 | Resûlullah kelime anlamı | The meaning of Rasulullah |
| 260 | Genel Anlam | Overall meaning |
| 261 | Sözlü beyan | Spoken declaration |
| 262 | Anlamını Öğren | Learn Its Meaning |
| 263 | Tevhid kavramı eşleşmesi | Matching the concept of tawhid |
| 264 | Peygamberlik kavramı eşleşmesi | Matching the concept of prophethood |
| 265 | Bölüm-Anlam Eşleştirme | Matching parts to meanings |
| 266 | İlah kavramı | The concept of a deity |
| 267 | Anlam tamamlama | Completing the meaning |
| 268 | Peygamberliğin kabulü | Accepting prophethood |
| 269 | Şehadet metni inceleme | Examining the Shahada text |
| 270 | Lâ ilâhe illallah eşleşmesi | Matching La ilaha illallah |
| 271 | Tevhid ve Risalet dengesi | The balance between tawhid and messengership |
| 272 | İlah kelimesinin reddi | The negation of other deities |
| 273 | Şahitlik pratik anlamı | The practical meaning of testimony |
| 274 | Resûl ve elçi ilişkisi | The connection between rasul and messenger |
| 275 | Eksik parça tespiti | Finding the missing part |
| 276 | İlahiyet Kavramı | The concept of divinity |
| 277 | Dinle ve Tanı | Listen and Recognise |
| 278 | Tam metin tanıma | Recognising the complete text |
| 279 | Ses-Anlam eşleşmesi | Matching audio to meaning |
| 280 | İlk kısım tanıma | Recognising the first part |
| 281 | Ses içeriği | Audio content |
| 282 | İşiterek boşluk doldurma | Filling a blank by listening |
| 283 | Eşhedü tekrarı duyma | Hearing the repeated word Ashhadu |
| 284 | İşitsel hata tespiti bağlamı | Finding a mistake in audio context |
| 285 | Son kelime tanıma | Recognising the last word |
| 286 | Kavram eşleme işitsel | Matching concepts by listening |
| 287 | İki parça birleştirici | Joining the two parts |
| 288 | Peygamber ismi tanıma | Recognising the prophet's name |
| 289 | Peygamberliğin işitsel karşılığı | Hearing the prophethood declaration |
| 290 | İlk şahitlik vurgusu | The first testimony |
| 291 | Kavram tanıma tekrar | Reviewing concept recognition |
| 292 | Şehadeti Oluştur | Build the Shahada |
| 293 | Tüm ifade sıralaması | Ordering the complete statement |
| 294 | Son kelime | Last word |
| 295 | İlk kısım tamamlama | Completing the first part |
| 296 | Detaylı kelime sıralama | Detailed word ordering |
| 297 | Bağlaç bilgisi | Understanding conjunctions |
| 298 | Türkçe anlam sıralama | Ordering the English meaning |
| 299 | Başlangıç kelimesi | Opening word |
| 300 | İkinci kısım sıralama | Ordering the second part |
| 301 | Orta kelime | Middle word |
| 302 | Anlam eksikliği | Incomplete meaning |
| 303 | Tüm cümle parçaları sıralama | Ordering all sentence parts |
| 304 | Negatif ifade tanıma | Recognising a negative statement |
| 305 | Kelime kontrolü | Word check |
| 306 | Bütünleyici anlam | Combined meaning |
| 307 | Çeviri parça eşleşmesi | Matching translated parts |
| 308 | Hızlı kelime kontrolü | Quick word check |
| 309 | Ne Söylediğini Anla | Understand What You Say |
| 310 | Senaryo - Eksik anlayış | Scenario: incomplete understanding |
| 311 | Senaryo - Özümseme | Scenario: internalising the meaning |
| 312 | Doğru kavrama | Correct understanding |
| 313 | Senaryo - Elçi konumu | Scenario: the messenger's position |
| 314 | Tevhid Hata Tespiti | Finding a tawhid mistake |
| 315 | Bütünlük ilkesi | Completeness |
| 316 | Şahitlik bilinci | Awareness of testimony |
| 317 | Parçalar arası anlam | Meaning across the parts |
| 318 | Pratik inanç eşleşmesi | Matching belief in practice |
| 319 | Senaryo - Söz ve Öz | Scenario: words and sincerity |
| 320 | İlah kelimesinin kapsayıcılığı | The scope of the word deity |
| 321 | Hata tespiti - Resulullah konumu | Finding a mistake: the position of Allah's Messenger |
| 322 | Boşluk doldurma uygulama | Fill-in-the-blank practice |
| 323 | Sürekli bilinç | Continuing awareness |
| 324 | Şahitlik hissi | A sense of bearing witness |
| 325 | Bağlamsal bağlantı | Contextual connection |
| 326 | Kavramsal Geri Çağırma 1 | Concept recall 1 |
| 327 | İlah reddi zihinsel model | Understanding the negation of other deities |
| 328 | Anlam eksikliği pratik | Practising complete understanding |
| 329 | İşitsel Hafıza | Auditory memory |
| 330 | Şahitlik Pratiği | Testimony practice |
| 331 | Çeviri yapı bozumu | Breaking down the translation |
| 332 | Kavramları Hızlı Eşleştirme | Quick concept matching |
| 333 | Elçi reddi senaryosu | Scenario: denying the messenger |
| 334 | Kelime tamamlama | Completing a word |
| 335 | Tevhid Kavramı Tekrar | Reviewing tawhid |
| 336 | Dil ve Kalp | Tongue and heart |
| 337 | Odaklanma - Eşhedü | Focus: Ashhadu |
| 338 | Şehadet Challenge | Shahada Challenge |
| 339 | Kapsamlı Senaryo | Comprehensive scenario |
| 340 | Tam metin hız testi | Full-text speed check |
| 341 | Odaklı dinleme hata tespiti | Finding mistakes through focused listening |
| 342 | Tevhid özü | The essence of tawhid |
| 343 | Kelimeler arası geçiş | Transitions between words |
| 344 | Şehadet ve İman bağlantısı | The connection between the Shahada and faith |
| 345 | Ünite temel kavramları | Key concepts in the unit |
| 346 | Hata Bulmaca | Find the mistake |
| 347 | Boşluk doldurma (Bütünleşik) | Integrated fill-in-the-blank |
| 348 | Tevhid ve Pratik Yaşam | Tawhid in daily life |
| 349 | Son kelime doğruluk testi | Checking the last word |
| 350 | Sesli tamamlama analizi | Analysing audio completion |
| 351 | Gerçek inanç vurgusu | Sincere belief |
| 352 | Final kelime dizilimi | Final word order |
| 353 | Beş Şartı Tanı | Meet the Five Pillars |
| 354 | İslam'ın Şartları Nelerdir? | What are the pillars of Islam? |
| 355 | Şehadet'in Yeri | The place of the Shahada |
| 356 | İbadet Olarak Namaz | Prayer as worship |
| 357 | Mekke ve İbadet | Mecca and worship |
| 358 | Şartların Sayısı | The number of pillars |
| 359 | Ramazan ve Oruç | Ramadan and fasting |
| 360 | İslam'ın Şartları Listesi | List of the pillars of Islam |
| 361 | Şartlar ve İnançlar | Pillars and beliefs |
| 362 | Şehadet ve Namaz | The Shahada and Prayer |
| 363 | Şehadetin Anlamı | The meaning of the Shahada |
| 364 | Düzenli İbadet Namaz | Prayer as regular worship |
| 365 | İlk Şartın Yeri | The place of the first pillar |
| 366 | Namazın Kapsamı | The scope of prayer |
| 367 | Şehadet ve Namaz İlişkisi | The connection between the Shahada and prayer |
| 368 | Şehadetin Yeri | The place of the Shahada |
| 369 | Namazın Önemi | The importance of prayer |
| 370 | İnanç Beyanı | Declaration of faith |
| 371 | Düzenli İbadet | Regular worship |
| 372 | Şehadet ve Namazın Kapsamı | The scope of the Shahada and prayer |
| 373 | Kelime-i Şehadet'in Yeri | The place of the Shahada |
| 374 | İlk İki Şart | The first two pillars |
| 375 | Namaz Kavramı | The concept of prayer |
| 376 | Oruç, Zekât ve Hac | Fasting, Zakat and Hajj |
| 377 | Malî İbadet Zekât | Zakat as worship involving wealth |
| 378 | Mekke'ye Yolculuk | Journey to Mecca |
| 379 | Zekât Kavramı | The concept of zakat |
| 380 | Oruç Kavramı | The concept of fasting |
| 381 | Son Üç Şartın Özellikleri | Features of the last three pillars |
| 382 | Hac Kavramı | The concept of Hajj |
| 383 | Zekâtın Doğası | The nature of zakat |
| 384 | Oruç ve İbadet | Fasting and worship |
| 385 | Hac Şartı | The pillar of Hajj |
| 386 | Zekât Uygulaması | Practising zakat |
| 387 | Oruç, Zekât, Hac Eşleştirme | Matching fasting, zakat and Hajj |
| 388 | Hac İbadeti | Hajj as worship |
| 389 | İbadet ve Tanım Eşleştirme | Matching worship to definitions |
| 390 | Şehadet ve Hac Eşleştirme | Matching the Shahada and Hajj |
| 391 | Hatalı Eşleştirme Bulma | Finding an incorrect match |
| 392 | Doğru Eşleştirme Seçimi | Choosing the correct match |
| 393 | Kavram Eşleştirme | Concept matching |
| 394 | Hatalı Eşleştirme Bulma 2 | Finding an incorrect match 2 |
| 395 | Şartlar ve Esaslar Ayrımı | Distinguishing pillars and articles of faith |
| 396 | Hatalı İfadeyi Bul | Find the incorrect statement |
| 397 | İbadet Eşleştirme | Matching acts of worship |
| 398 | Kavram Karşılaştırma | Comparing concepts |
| 399 | Hatalı Kavramı Bulma | Finding the incorrect concept |
| 400 | Geniş Eşleştirme | Extended matching |
| 401 | Hac ve Oruç Eşleştirme | Matching Hajj and fasting |
| 402 | Kavram Testi | Concept check |
| 403 | Son Eşleştirme | Final matching |
| 404 | Temel Kavram Seçimi | Choosing a main concept |
| 405 | Hangisi Hangi Şart? | Which Pillar Is It? |
| 406 | Günlük Hayatta Oruç | Fasting in daily life |
| 407 | Günlük Hayatta Zekât | Zakat in daily life |
| 408 | Günlük Hayatta Namaz | Prayer in daily life |
| 409 | Uygulama Hatası | A mistake in practice |
| 410 | Hac İbadeti Uygulaması | Practising Hajj |
| 411 | Şehadet Uygulaması | Practising the Shahada |
| 412 | Hatalı Düşünce Tespiti | Finding a mistaken idea |
| 413 | Senaryo: Yardım Kuruluşu | Scenario: a charity |
| 414 | Senaryo: Seyahat | Scenario: travelling |
| 415 | Hata Bulma: Şart ve İman Karışımı | Find the mistake: confusing pillars and faith |
| 416 | Senaryo: Arkadaşın Sorusu | Scenario: a friend's question |
| 417 | Senaryo: Aile Sohbeti | Scenario: family conversation |
| 418 | Senaryo: Televizyon Programı | Scenario: television programme |
| 419 | Hata Bulma: Eksik Şart | Find the mistake: a missing pillar |
| 420 | Senaryo: İftar Vakti | Scenario: breaking the fast |
| 421 | Senaryo: İşçi ve İşveren | Scenario: employee and employer |
| 422 | Şartların Temeli | The foundation of the pillars |
| 423 | Esaslar Ayrımı | Distinguishing the articles |
| 424 | Namaz Kavramı Tekrarı | Reviewing prayer |
| 425 | Zekât Kavramı Tekrarı | Reviewing zakat |
| 426 | Şehadet Hatırlama | Recalling the Shahada |
| 427 | Oruç Hatırlama | Recalling fasting |
| 428 | Hac İbadeti Hatırlama | Recalling Hajj |
| 429 | Namaz ve Vakit | Prayer and time |
| 430 | Zekât Eksik Bilgi | Incomplete understanding of zakat |
| 431 | İmanın Şartı mı İslam'ın Şartı mı? | Article of faith or pillar of Islam? |
| 432 | Genel Tekrar | General review |
| 433 | Beş Şart Challenge | Five Pillars Challenge |
| 434 | Challenge: Tüm Şartlar | Challenge: all the pillars |
| 435 | Challenge: Hata Bulma | Challenge: find the mistake |
| 436 | Challenge: İlişkiler | Challenge: connections |
| 437 | Challenge: Oruç Senaryosu | Challenge: fasting scenario |
| 438 | Challenge: Esas ve Şart Ayrımı | Challenge: articles of faith and pillars |
| 439 | Challenge: Şehadet | Challenge: the Shahada |
| 440 | Challenge: Namaz | Challenge: prayer |
| 441 | Challenge: Hac Mekânı | Challenge: the place of Hajj |
| 442 | Challenge: Karmaşık Senaryo | Challenge: complex scenario |
| 443 | Challenge: Kavram Hatası 2 | Challenge: conceptual mistake 2 |
| 444 | Challenge: Şartları Sayma | Challenge: listing the pillars |
| 445 | Challenge: Günlük Kullanım | Challenge: daily practice |
| 446 | Challenge: Hatırlama | Challenge: recall |
| 447 | Challenge: Kapsayıcı Senaryo | Challenge: comprehensive scenario |
| 448 | İman Ne Demektir? | What Does Faith Mean? |
| 449 | İman Kavramı | The concept of faith |
| 450 | İman Esasları | The articles of faith |
| 451 | İmanın Temeli | The foundation of faith |
| 452 | İmanın Kapsamı | The scope of faith |
| 453 | Allah'a İman | Belief in Allah |
| 454 | İman Esasları Sayısı | The number of articles of faith |
| 455 | İman ve İnanç | Faith and belief |
| 456 | İman Kavramı Özeti | Reviewing the concept of faith |
| 457 | Altı Esası Tanı | Meet the Six Articles |
| 458 | İmanın 6 Esası | The six articles of faith |
| 459 | Kader ve Kaza | Divine decree and its fulfilment |
| 460 | Meleklere İman | Belief in angels |
| 461 | İmanın 6 Esası Eşleştirme | Matching the six articles of faith |
| 462 | Ahirete İman | Belief in the Hereafter |
| 463 | İmanın 6 Esası Liste | List of the six articles of faith |
| 464 | Hızlı Liste Eşleştirme | Quick list matching |
| 465 | Peygamberlere İman | Belief in the prophets |
| 466 | İmanın 6 Esası Toplu | The six articles together |
| 467 | Kitaplara İman | Belief in the books |
| 468 | Kavram Ayrımı | Distinguishing concepts |
| 469 | İmanın 6 Esası Eşleştirme 2 | Matching the six articles of faith 2 |
| 470 | Kavramları Ayır | Distinguish the Concepts |
| 471 | Ahirete İman Tanımı | Defining belief in the Hereafter |
| 472 | Meleklere İman Tanımı | Defining belief in angels |
| 473 | İman Esasları Anlamları | Meanings of the articles of faith |
| 474 | Kitaplara İman Tanımı | Defining belief in the books |
| 475 | Kadere İman Tanımı | Defining belief in divine decree |
| 476 | İman Esaslarını Eşleştirme 3 | Matching articles of faith 3 |
| 477 | Kadere İman Özelliği | A feature of belief in divine decree |
| 478 | İman Esaslarını Eşleştirme 4 | Matching articles of faith 4 |
| 479 | İman Esaslarını Eşleştirme 5 | Matching articles of faith 5 |
| 480 | Ahirete İman Vurgusu | Emphasising belief in the Hereafter |
| 481 | Kavramları Ayırma Özeti | Review: distinguishing concepts |
| 482 | Şart mı, İman Esası mı? | Pillar or Article of Faith? |
| 483 | Namaz ve Melekler | Prayer and angels |
| 484 | Sınıflandırma | Classification |
| 485 | Kategori Eşleştirme | Category matching |
| 486 | Öğrenci Hatası | A learner's mistake |
| 487 | Hac vs Kitaplar | Hajj and the books |
| 488 | Senaryo - Sınıflandırma | Scenario: classification |
| 489 | Ortak Kategori | A shared category |
| 490 | Hata Bulma 2 | Finding the mistake 2 |
| 491 | Eşleştirme | Matching |
| 492 | Kategori Ayrımı | Distinguishing categories |
| 493 | Hata Bulma 3 | Finding the mistake 3 |
| 494 | Kategori Farkı | Category difference |
| 495 | Sınıflandırma Eşleştirme | Classification matching |
| 496 | Sınıflandırma Özeti | Classification review |
| 497 | Senaryo Analizi | Scenario analysis |
| 498 | Karışık Liste | Mixed list |
| 499 | Günlük Hayatta Kavramlar | Concepts in Daily Life |
| 500 | Ölüm Sonrası Hayat | Life after death |
| 501 | Vahiy ve Kitaplar | Revelation and the books |
| 502 | Allah'ın Bilgisi | Allah's knowledge |
| 503 | Yanlış Bağlam | Incorrect context |
| 504 | Hata Bulma 4 | Finding the mistake 4 |
| 505 | Senaryo Tanıma | Recognising a scenario |
| 506 | Senaryo Tanıma 2 | Recognising a scenario 2 |
| 507 | Genel Soru | General question |
| 508 | Hata Bulma 5 | Finding the mistake 5 |
| 509 | Senaryo | Scenario |
| 510 | Kavram Genelleme | Generalising concepts |
| 511 | Senaryo Çoktan Seçmeli | Multiple-choice scenario |
| 512 | Kavram Çoktan Seçmeli | Multiple-choice concept question |
| 513 | Senaryo Özeti | Scenario summary |
| 514 | Kısım Öncesi Akıllı Tekrar | Smart Review Before the Next Section |
| 515 | U1-U5 Tekrar | U01-U05 review |
| 516 | Kelime-i Şehadet ve İman | The Shahada and faith |
| 517 | Şartlar ve Esaslar Sayısı | The number of pillars and articles |
| 518 | Hata Bulma | Finding the mistake |
| 519 | Senaryo Tekrarı | Scenario review |
| 520 | Temel Kavramlar | Main concepts |
| 521 | Hac ve Kader | Hajj and divine decree |
| 522 | Genel Bilgi | General knowledge |
| 523 | Hata Bulma Kısım Özeti | Section review: finding mistakes |
| 524 | Senaryo Özeti 2 | Scenario summary 2 |
| 525 | İman Esasları Challenge | Articles of Faith Challenge |
| 526 | Kadere İman Senaryo | Scenario: belief in divine decree |
| 527 | Eşleştirme Challenge | Matching challenge |
| 528 | Kategori Farkı 2 | Category difference 2 |
| 529 | Eşleştirme Challenge 2 | Matching challenge 2 |
| 530 | Temel Kural | Main principle |
| 531 | Kadere İman Kapsamı | The scope of belief in divine decree |
| 532 | Peygamberlere İman Kapsamı | The scope of belief in the prophets |
| 533 | Kavram Geneli | Concept overview |
| 534 | Final Sorusu | Final question |
| 535 | Melekler Kimdir? | Who Are Angels? |
| 536 | İman Esası | An article of faith |
| 537 | Kaynak Bilinci | Awareness of sources |
| 538 | Tevhid Sınırı | The bounds of tawhid |
| 539 | Temel Ayrımlar | Main distinctions |
| 540 | Elçilik | Messengership |
| 541 | Kaynak Sınırı | The limits of sources |
| 542 | İmanın Anlamı | The meaning of faith |
| 543 | Kaynak Okuryazarlığı | Understanding sources |
| 544 | Meleklerin Özellikleri | The Qualities of Angels |
| 545 | İtaat | Obedience |
| 546 | Ayetlerle Özellikler | Qualities described in verses |
| 547 | Kanatlar | Wings |
| 548 | Tesbih | Glorifying Allah |
| 549 | Kulluk Özeti | Summarising servanthood |
| 550 | Cebrâil ve Vahiy | Gabriel and Revelation |
| 551 | Vahiy Rolleri | Roles in revelation |
| 552 | Meleklere Saygı | Respect for angels |
| 553 | Vahiy Akışı | The conveyance of revelation |
| 554 | Kur'an'da Meleklerin Görevleri | The Duties of Angels in the Quran |
| 555 | Amellerin Kaydı | Recording deeds |
| 556 | Kayıt ve İlahi Bilgi | Recording and divine knowledge |
| 557 | Görevler | Duties |
| 558 | Ölüm Meleği | The angel of death |
| 559 | Görev Çeşitliliği | Different duties |
| 560 | Bilginin Sınırı | The limits of knowledge |
| 561 | Müminler İçin Dua | Supplication for believers |
| 562 | Tevhid ve Dua | Tawhid and supplication |
| 563 | Meleklere İmanın Anlamı | The Meaning of Belief in Angels |
| 564 | İman ve Hayat | Faith and life |
| 565 | Gayba İman | Belief in the unseen |
| 566 | Öğrenme Yöntemi | Learning method |
| 567 | Yanlış Anlamaları Düzelt | Correct Misunderstandings |
| 568 | İblîs ve Melekler | Iblis and angels |
| 569 | Yanlış Bilgiyi Düzeltme | Correcting misinformation |
| 570 | Melekler Ustalığı | Mastering Angels |
| 571 | Ustalık | Mastery |
| 572 | Kitaplara İman Nedir? | What Is Belief in the Books? |
| 573 | Önceki Vahiyler | Earlier revelations |
| 574 | Vahyin Kaynağı | The source of revelation |
| 575 | Tevrat, İncil, Zebur ve Sahifeler | The Torah, the Gospel, the Zabur and the Scrolls |
| 576 | Kitap ve Peygamber | Book and prophet |
| 577 | Sahifeler | The scrolls |
| 578 | Kitapların İsimleri | The names of the books |
| 579 | Kur'an'ın Konumu | The Quran's position |
| 580 | Vahiy ve Yorum | Revelation and interpretation |
| 581 | Kur'an'ın Ölçüsü | The Quran's standard |
| 582 | İlahi Kitapların Ortak Kaynağı | The Shared Source of Divine Books |
| 583 | Kaynak Birliği | A shared source |
| 584 | Kitapların Nitelikleri | The qualities of the books |
| 585 | Hidayet ve Nur | Guidance and light |
| 586 | Vahyin İşlevi | The purpose of revelation |
| 587 | Kaynak ve Rehberlik | Source and guidance |
| 588 | Kur'an ve Önceki Vahiy | The Quran and earlier revelation |
| 589 | Vahyin Akışı | The conveyance of revelation |
| 590 | Vahiy Sürekliliği | Continuity of revelation |
| 591 | Kur'an'ın Rehberliği ve Korunması | The Quran's Guidance and Preservation |
| 592 | Kur'an'ın Rehberliği | The Quran's guidance |
| 593 | Kur'an'ın Korunması | The Quran's preservation |
| 594 | Kur'an'ın Nitelikleri | The Quran's qualities |
| 595 | Kur'an'la İlişki | Engaging with the Quran |
| 596 | Kur'an'ın Kimliği | The Quran's identity |
| 597 | Vahiy ve İnsan Sözü | Revelation and human speech |
| 598 | Kaynak Ahlakı | Ethical use of sources |
| 599 | Kitaplara İman Ustalığı | Mastering Belief in the Books |
| 600 | Peygamberlere İman Nedir? | What Is Belief in the Prophets? |
| 601 | İman Bütünlüğü | Complete faith |
| 602 | Peygamberlerin Bilgisi | The knowledge of prophets |
| 603 | İman ve Derece | Faith and rank |
| 604 | Peygamberlerin İnsan Oluşu ve Vahiy | The Humanity of Prophets and Revelation |
| 605 | İnsan ve Vahiy | Humanity and revelation |
| 606 | Peygamberlerin İnsan Oluşu | The humanity of prophets |
| 607 | Örneklik | Example |
| 608 | Tebliğ, Müjde ve Uyarı | Conveyance, Good News and Warnings |
| 609 | Peygamberlerin Görevi | The duties of prophets |
| 610 | İnsan Sorumluluğu | Human responsibility |
| 611 | Ortak Çağrı ve İman Birliği | The Shared Call and Unity of Faith |
| 612 | Tevhid Çağrısı | The call to tawhid |
| 613 | Ortak Mesaj | The shared message |
| 614 | Ayetlerle Peygamberlik | Prophethood in the verses |
| 615 | Gönderiliş Gayesi | The purpose of sending prophets |
| 616 | Hz. Muhammed ve Risalet | Muhammad and Messengership |
| 617 | Evrensel Risalet | Universal messengership |
| 618 | Örneklik ve Tevhid | Example and tawhid |
| 619 | Tevhid ve Risalet | Tawhid and messengership |
| 620 | Peygamberlere İman Ustalığı | Mastering Belief in the Prophets |
| 621 | Vahiy ve Tebliğ | Revelation and conveyance |
| 622 | Ahiret Gününe İman Nedir? | What Is Belief in the Last Day? |
| 623 | Ahiret Kavramı | The concept of the Hereafter |
| 624 | İman ve İyilik | Faith and goodness |
| 625 | Karşılık | Recompense |
| 626 | Ahiret Akışı | The sequence of the Hereafter |
| 627 | Kıyametin Vakti | The time of the Hour |
| 628 | Ölüm ve Dünya Hayatının Sonu | Death and the End of Worldly Life |
| 629 | Ölüm Bilinci | Awareness of death |
| 630 | Ölüm Sonrası | After death |
| 631 | Pişmanlık | Regret |
| 632 | Yanlış Anlamayı Düzeltme | Correcting a misunderstanding |
| 633 | Ölüm ve Ahiret | Death and the Hereafter |
| 634 | Kıyamet ve Yeniden Diriliş | The Hour and Resurrection |
| 635 | Yeniden Diriliş | Resurrection |
| 636 | Hesap, Amel Defteri ve İlahi Adalet | Reckoning, the Record of Deeds and Divine Justice |
| 637 | İlahi Adalet | Divine justice |
| 638 | Amel Defteri | The record of deeds |
| 639 | İyilik | Goodness |
| 640 | Ahiret Bilincinin Hayata Etkisi | How Awareness of the Hereafter Affects Life |
| 641 | Ahiret ve Ahlak | The Hereafter and good character |
| 642 | Dünya ve Ahiret | This world and the Hereafter |
| 643 | Umut ve Adalet | Hope and justice |
| 644 | Dengeli Öğrenme | Balanced learning |
| 645 | Dengeli Ahiret Bilinci | Balanced awareness of the Hereafter |
| 646 | Ahiret İmanı Ustalığı | Mastering Belief in the Hereafter |
| 647 | Kader ve Kazaya İman Nedir? | What Is Belief in Divine Decree and Its Fulfilment? |
| 648 | Kader ve Kazaya İman | Belief in divine decree and its fulfilment |
| 649 | Allah'ın İlmi, Ölçüsü ve Takdiri | Allah's Knowledge, Measure and Decree |
| 650 | İnsan İradesi ve Sorumluluk | Human Will and Responsibility |
| 651 | Çaba, Tedbir ve Tevekkül | Effort, Precautions and Trust in Allah |
| 652 | Musibet, Sabır ve Denge | Hardship, Patience and Balance |
| 653 | Kader İnancı Ustalığı | Mastering Belief in Divine Decree |
| 654 | İbadet Nedir? | What Is Worship? |
| 655 | Niyet ve İhlas | Intention and Sincerity |
| 656 | İbadetin Hayata Etkisi | How Worship Affects Life |
| 657 | Temizlik ve Taharet | Cleanliness and Ritual Purification |
| 658 | Abdestin Temeli | The Foundations of Ablution |
| 659 | Abdest Adımlarını Tanı | Learn the Steps of Ablution |
| 660 | Teyemmüm ve Kolaylık | Dry Ablution and Ease |
| 661 | Ortak Temel ve Farklar | Shared Foundations and Differences |
| 662 | Namaza Hazırlık | Preparing for Prayer |
| 663 | Yatsı namazı | Night prayer |
| 664 | Öğle namazı | Midday prayer |
| 665 | Vakit ve Kıble | Prayer Time and Direction |
| 666 | Sabah namazı | Dawn prayer |
| 667 | Akşam namazı | Sunset prayer |
| 668 | Şartları Eşleştir | Match the Conditions |
| 669 | İkindi namazı | Afternoon prayer |
| 670 | Hazırlık Senaryoları | Preparation Scenarios |
| 671 | Beş Vakit | The Five Daily Prayers |
| 672 | Namazın Yapısı | The Structure of Prayer |
| 673 | Kıyam, Kıraat, Rükû, Secde | Standing, Recitation, Bowing and Prostration |
| 674 | Rekâtı Kur | Build a Prayer Unit |
| 675 | Namaz İçinde Akış | The Sequence Within Prayer |
| 676 | Mazerette Kolaylık | Ease in Cases of Difficulty |
| 677 | Oruç Nedir? | What Is Fasting? |
| 678 | Bilerek yemek | Eating deliberately |
| 679 | Yeme | Eating |
| 680 | Ramazan ve Takva | Ramadan and Mindfulness of Allah |
| 681 | Unutarak yemek | Eating forgetfully |
| 682 | Cinsel ilişki | Sexual intercourse |
| 683 | İmsak ve İftar | Beginning and Breaking the Fast |
| 684 | İçme | Drinking |
| 685 | Oruçlu Günlük Hayat | Daily Life While Fasting |
| 686 | Mazeret ve Kaza | Concessions and Making Up Missed Fasts |
| 687 | DEEN’e hoş geldin | Welcome to DEEN |
| 688 | İslam’ı adım adım, sakin ve düzenli şekilde öğren. | Learn about Islam step by step, calmly and consistently. |
| 689 | Sana nasıl hitap edelim? | What should we call you? |
| 690 | Adın veya kullanıcı adın | Your name or username |
| 691 | Bu isim profilinde görünecek. | This name will appear on your profile. |
| 692 | Yolcu | Traveller |
| 693 | Yaşını yazmana gerek yok; sana en rahat gelen öğrenme stilini seç. | You do not need to enter your age. Choose the style that suits you best. |
| 694 | Çocuk | Child |
| 695 | Genç | Teen |
| 696 | Yetişkin | Adult |
| 697 | Kısa, sade ve görsel ağırlıklı anlatım | Short, simple explanations with visual support |
| 698 | Açık, akıcı ve günlük hayata yakın örnekler | Clear, fluent explanations with everyday examples |
| 699 | Daha derin, dengeli ve düzenli açıklamalar | Deeper, balanced and structured explanations |
| 700 | Yol arkadaşını seç | Choose your companion |
| 701 | Seçtiğin hayvan profilinde, serilerinde ve ders sonunda sana eşlik edecek. | Your animal will accompany you on your profile, streaks and lesson results. |
| 702 | Aslan | Lion |
| 703 | Kurt | Wolf |
| 704 | Baykuş | Owl |
| 705 | Kaplumbağa | Turtle |
| 706 | Kartal | Eagle |
| 707 | Kedi | Cat |
| 708 | Cesaret | Courage |
| 709 | Kararlılık | Determination |
| 710 | Odak | Focus |
| 711 | Sakinlik | Calm |
| 712 | Önce bir hayvan seç | Choose an animal first |
| 713 | Günde ne kadar zaman ayırabilirsin? | How much time can you spend each day? |
| 714 | Kısa ama düzenli ilerlemek daha iyi sonuç verir. | Short, regular practice leads to better results. |
| 715 | Hızlı ve hafif tempo · 1 mini ders | Quick and light · 1 short lesson |
| 716 | Dengeli günlük ritim · 2 mini ders | A balanced daily pace · 2 short lessons |
| 717 | Daha yoğun öğrenme · 3 mini ders | More intensive learning · 3 short lessons |
| 718 | Hazırsın | You are ready |
| 719 | İslam Nedir? | What Is Islam? |
| 720 | Temel kavramlarla tanış. İnanç, ibadet ve ahlak arasındaki bağı keşfet. | Meet the main concepts. Discover the connection between faith, worship and good character. |
| 721 | Allah’a İman | Belief in Allah |
| 722 | Tevhidi ve imanın hayata yansımalarını öğren. | Learn about Allah's oneness and how faith is reflected in life. |
| 723 | Şehadetin anlamını tanı; parçaları arasında bağ kur. | Learn the meaning of the testimony of faith and connect its parts. |
| 724 | İslam’ın Beş Şartı | The Five Pillars of Islam |
| 725 | Beş şartı tanı, doğru bağlamlarıyla eşleştir. | Recognise the five pillars and match them with their correct contexts. |
| 726 | İmanın Esaslarına Giriş | Introduction to the Articles of Faith |
| 727 | Altı iman esasını öğren ve birbirinden ayırt et. | Learn the six articles of faith and distinguish between them. |
| 728 | İlk 5 ünitedeki bilgini tek bir ustalık sınavında bir araya getir. | Bring together what you learned in the first five units in one mastery test. |
| 729 | KISIM 2 · İMAN | SECTION 2 · FAITH |
| 730 | Meleklere iman konusunu adım adım pekiştir. | Reinforce belief in angels step by step. |
| 731 | Kitaplara imanla ilgili temel kavramları keşfet. | Discover the main concepts of belief in the revealed books. |
| 732 | Peygamberlere iman konusundaki bilgini güçlendir. | Strengthen your knowledge of belief in the prophets. |
| 733 | Ahiret Gününe İman | Belief in the Last Day |
| 734 | Ahiret inancını tanı, hatırla ve pekiştir. | Recognise, recall and reinforce belief in the Hereafter. |
| 735 | Kader ve kaza kavramlarını kaynak notlarıyla öğren. | Learn the concepts of divine decree and its fulfilment with source notes. |
| 736 | KISIM 2 FİNALİ | SECTION 2 FINAL |
| 737 | İman Ustalığı | Faith Mastery |
| 738 | İman bölümündeki 5 ünitenin bilgisini bir araya getir. | Bring together your knowledge from the five units on faith. |
| 739 | KISIM 3 · İBADET | SECTION 3 · WORSHIP |
| 740 | Fıkıh kapsamı · Ortak temel | Scope of Islamic jurisprudence · Shared foundation |
| 741 | Bu sürüm mezheplerin ortak çekirdeğini öğretir. | This version teaches the shared core of the schools of law. |
| 742 | İbadet Bilinci | Awareness of Worship |
| 743 | İbadetin anlamını, niyet ve ihlası; ibadet bilgisinin nasıl öğrenildiğini kavra. | Understand the meaning of worship, intention and sincerity, and how to learn about worship. |
| 744 | Temizlik ve Abdest | Cleanliness and Ablution |
| 745 | Taharetin anlamını, abdestin Kur’an’daki ortak temelini ve teyemmümdeki kolaylığı öğren. | Learn the meaning of ritual purification, ablution's shared foundation in the Quran, and the ease offered by dry ablution. |
| 746 | Namaz vakti, kıble, temizlik, niyet ve beş vakit farz rekâtların temelini öğren. | Learn the foundations of prayer time, direction, purification, intention and obligatory units in the five daily prayers. |
| 747 | Namazın temel rükünlerini, bir rekâtın akışını ve mazeretteki kolaylık ilkesini öğren. | Learn the main pillars of prayer, the sequence of a unit, and the principle of ease when difficulties arise. |
| 748 | Oruç ve Ramazan | Fasting and Ramadan |
| 749 | Ramazan orucunun anlamını, imsak-iftar sınırını, takva amacını ve temel mazeretleri öğren. | Learn the meaning of fasting in Ramadan, its dawn-to-sunset limits, its aim of mindfulness of Allah, and the main concessions. |
| 750 | KISIM 3 FİNALİ | SECTION 3 FINAL |
| 751 | İbadet Temelleri Ustalığı | Foundations of Worship Mastery |
| 752 | İbadet bölümündeki ortak-temel bilgileri bir araya getir. | Bring together the shared foundations from the units on worship. |
| 753 | Seri detayları | Streak details |
| 754 | Neden şimdi? | Why now? |
| 755 | Yeni ilerleme | New progress |
| 756 | HAFTALIK RİTİM | WEEKLY RHYTHM |
| 757 | USTALIK SINAVINI BAŞLAT | START THE MASTERY TEST |
| 758 | ADAPTIVE MEMORY ENGINE · v6.4 | ADAPTIVE MEMORY ENGINE · v6.4 |
| 759 | Ünite bazında | By unit |
| 760 | Bu skor yalnız öğrenme ve hatırlama performansını yönetir; dinî yeterlilik veya ibadet değeri değildir. | This score manages learning and recall performance only; it does not measure religious competence or the value of worship. |
| 761 | 1. gün + 7. gün | Day 1 + day 7 |
| 762 | Dersi bitirdiğin gün değil, unutma başlamadan hemen önce hatırla. | Recall just before forgetting begins, rather than only on the day you finish a lesson. |
| 763 | Yarın | Tomorrow |
| 764 | 5 farklı günde Bugünkü Yolculuk'u tamamla | Complete Today's Journey on 5 different days |
| 765 | İlk Adım | First Step |
| 766 | İlk dersini tamamla | Complete your first lesson |
| 767 | İstikrar | Consistency |
| 768 | Bilgi Yolcusu | Knowledge Traveller |
| 769 | 25 ders tamamla | Complete 25 lessons |
| 770 | Usta Öğrenci | Master Learner |
| 771 | Bir ünitede %100 ustalık | Reach 100% mastery in one unit |
| 772 | Kısım Ustası | Section Master |
| 773 | Bir kısım finalini geç | Pass a section final |
| 774 | Öğrenerek 1000 XP kazan | Earn 1000 XP through learning |
| 775 | Keskin Odak | Sharp Focus |
| 776 | 10 kusursuz ders tamamla | Complete 10 perfect lessons |
| 777 | Hatırlama Ritmi | Recall Rhythm |
| 778 | 10 tekrar dersi tamamla | Complete 10 review lessons |
| 779 | Uzun Yol | Long Journey |
| 780 | 50 ders tamamla | Complete 50 lessons |
| 781 | Bilgi Birikimi | Knowledge Gained |
| 782 | Öğrenerek 5000 XP kazan | Earn 5000 XP through learning |
| 783 | Öğrenme oyunlaştırılır; ibadet puanlanmaz. Dinî içerikler uzman incelemesi bekler. | Learning uses game elements; worship is not scored. Religious content awaits expert review. |
| 784 | DEEN ADMIN | DEEN ADMIN |
| 785 | P · DEVELOPER CONTROL CENTER | P · DEVELOPER CONTROL CENTRE |
| 786 | HIZLI İLERLEME | QUICK PROGRESS |
| 787 | TÜM BÖLÜMLERİ GEÇ | COMPLETE ALL SECTIONS |
| 788 | TÜM BÖLÜMLERİ SIFIRLA | RESET ALL SECTIONS |
| 789 | KISIM 1’İ GEÇ | COMPLETE SECTION 1 |
| 790 | KISIM 1’İ SIFIRLA | RESET SECTION 1 |
| 791 | KISIM 2’Yİ GEÇ | COMPLETE SECTION 2 |
| 792 | KISIM 2’Yİ SIFIRLA | RESET SECTION 2 |
| 793 | KISIM 3’Ü GEÇ | COMPLETE SECTION 3 |
| 794 | KISIM 3’Ü SIFIRLA | RESET SECTION 3 |
| 795 | TÜM ROZETLERİ AÇ | UNLOCK ALL BADGES |
| 796 | TÜM KİLİTLERİ AÇ | UNLOCK EVERYTHING |
| 797 | TEK AŞAMA KONTROLÜ | INDIVIDUAL STAGE CONTROL |
| 798 | SEÇİLİ AŞAMAYI GEÇ | COMPLETE SELECTED STAGE |
| 799 | AŞAMAYI GERİ AL | UNDO STAGE |
| 800 | ÖĞREN EKRANINA DÖN | RETURN TO LEARN |
| 801 | ÜNİTE KONTROLÜ | UNIT CONTROL |
| 802 | SEÇİLİ ÜNİTEYİ GEÇ | COMPLETE SELECTED UNIT |
| 803 | ÜNİTEYİ GERİ AL | UNDO UNIT |
| 804 | KISIM 1 FİNALİNİ GEÇ | COMPLETE SECTION 1 FINAL |
| 805 | KISIM 2 FİNALİNİ GEÇ | COMPLETE SECTION 2 FINAL |
| 806 | KISIM 3 FİNALİNİ GEÇ | COMPLETE SECTION 3 FINAL |
| 807 | SINIRSIZ ENERJİ | UNLIMITED ENERGY |
| 808 | 100 GÜN SERİ | 100-DAY STREAK |
| 809 | NORMAL ENERJİ | NORMAL ENERGY |
| 810 | ROZETLERİ KİLİTLE | LOCK BADGES |
| 811 | GİRİŞ EKRANINA DÖN | RETURN TO ENTRY |
| 812 | ONBOARDING’İ BAŞTAN AÇ | RESTART ONBOARDING |
| 813 | PROFİLE GİT | GO TO PROFILE |
| 814 | ÖĞREN EKRANINA GİT | GO TO LEARN |
| 815 | “Giriş ekranına dön” mevcut progress’i silmez. “Onboarding’i baştan aç” sadece onboarding tamamlandı bayrağını sıfırlar. | 'Return to entry' preserves progress. 'Restart onboarding' resets only the onboarding completion flag. |
| 816 | ROZET + RUNTIME AUDIT | BADGE + RUNTIME AUDIT |
| 817 | STATE JSON KOPYALA | COPY STATE JSON |
| 818 | İLERLEMEYİ SIFIRLA | RESET PROGRESS |
| 819 | TAM SIFIRLAMA | FULL RESET |
| 820 | KUR’AN · PRODUCT ANALYTICS | QURAN · PRODUCT ANALYTICS |
| 821 | KUR’AN · UZMAN DOĞRULAMA | QURAN · EXPERT VERIFICATION |
| 822 | KAYNAK GÖRÜNÜR | SOURCE VISIBLE |
| 823 | SES KAYDI HAZIR | AUDIO RECORDING READY |
| 824 | UZMAN ONAYLI | EXPERT APPROVED |
| 825 | İNCELEMEDE | UNDER REVIEW |
| 826 | TÜRKÇE MEAL | TURKISH TRANSLATION |
| 827 | ÖĞRENME NOTU | LEARNING NOTE |
| 828 | Tanımlı değil | Not defined |
| 829 | TASLAĞI KAYDET | SAVE DRAFT |
| 830 | YAYINA ONAYLA | APPROVE FOR PUBLICATION |
| 831 | İNCELEMEYE GERİ AL | RETURN TO REVIEW |
| 832 | SONRAKİ BEKLEYEN | NEXT PENDING ITEM |
| 833 | Henüz uzman işlemi yok. | No expert action yet. |
| 834 | Admin panelini kapat | Close admin panel |
| 835 | Pencereyi kapat | Close window |
| 836 | Belirgin tekrar eden hata yok. Sistem yeni cevaplarla öğrenme profilini güncellemeye devam edecek. | No clear repeated mistakes. The system will keep updating your learning profile with new answers. |
| 837 | Biriktirilebilir ilerleme madalyaları. Ek XP verilmez. | Collectible progress medals. No extra XP is awarded. |
| 838 | Kaynaklı Arapça metin ve kayıtlı meal verisinden otomatik oluşturuldu. | Generated from sourced Arabic text and recorded translation data. |
| 839 | Beyyine | Al-Bayyinah |
| 840 | SON ÜNİTE | LAST UNIT |
| 841 | KISIM 1 FİNALİ | SECTION 1 FINAL |
| 842 | KİLİTLİ · USTALIK SINAVI | LOCKED · MASTERY TEST |
| 843 | Temeller Ustalığı | Foundations Mastery |
| 844 | Geçerli mezhep farklılıkları yanlış cevap olarak puanlanmaz; bütün yeni içerikler uzman incelemesi bekler. | Valid differences between schools of law are not graded as incorrect; all new content awaits expert review. |
| 845 | Fâtiha | Al-Fatihah |
| 846 | Felak | Al-Falaq |
| 847 | Nâs | An-Nas |
| 848 | Mâûn | Al-Ma'un |
| 849 | İnşirah | Ash-Sharh |
| 850 | Zilzâl | Az-Zalzalah |

## Audit scope limitation

The catalog comparison uses the English reference file, which is not itself a complete enumeration of every dynamically assembled Turkish screen string. Runtime/browser QA may reveal **additional** Turkish strings. The count above is therefore **not a certified ceiling** on remaining German work.

**Do not merge or deploy the German release until all blocker conditions are cleared.**
