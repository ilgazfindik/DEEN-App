UNIT = 'U05'
SLUG = 'imanin_esaslarina_giris'
TITLES = {1: 'İman Ne Demektir?', 2: 'Altı Esası Tanı', 3: 'Kavramları Ayır', 4: 'Şart mı, İman Esası mı?', 5: 'Günlük Hayatta Kavramlar', 6: 'Kısım Öncesi Akıllı Tekrar', 7: 'İman Esasları Challenge'}

Q = [
 # --- Added with the duplicate clean-up: new facts for the unit
 ('tf', 1, 'amentu', 'Amentü', 'e', 'Âmentü, imanın altı esasını sıralayan iman ifadesidir.', True, 'Âmentü, Allah’a, meleklere, kitaplara, peygamberlere, ahiret gününe ve kadere imanı dile getirir.'),
 ('mc', 2, 'cibril_uc', 'Cibril hadisi', 'm', 'Cibril hadisinde Hz. Peygamber hangi üç kavramı açıklamıştır?', 'İman, İslam ve ihsan', ['Namaz, oruç ve hac', 'Tevhid, nübüvvet ve ahiret', 'Farz, vacip ve sünnet'], 'Cibril hadisinde Hz. Peygamber, Cebrail’in sorularına cevap olarak iman, İslam ve ihsanı açıklamıştır.'),
 ('mc', 3, 'ihsan', 'İhsan', 'm', 'Hadiste ihsan nasıl tarif edilir?', 'Allah’ı görüyormuşçasına ibadet etmek', ['İbadeti kısa tutmak', 'Yalnızca farzları yapmak', 'Yalnızca yardım etmek'], 'İhsan, “Allah’ı görüyormuşçasına ibadet etmendir; sen O’nu görmesen de O seni görmektedir” şeklinde tarif edilir.'),
 ('mc', 4, 'iman_tarif', 'İmanın tarifi', 'm', 'İmanın tarifinde dille ikrarın yanında hangisi yer alır?', 'Kalple tasdik', ['Yalnızca bilmek', 'Yalnızca ezberlemek', 'Yalnızca duymak'], 'İman, kalple tasdik ve dille ikrardan oluşur.'),
 ('tf', 5, 'sirk', 'Şirk', 'e', 'Şirk, Allah’a ortak koşmaktır.', True, 'Şirk, Allah’ın zâtında, sıfatlarında veya ibadet edilmeye layık oluşunda O’na ortak koşmaktır.'),
 ('mc', 6, 'munafik', 'Münafık', 'm', 'Kalbiyle inanmadığı hâlde dilde Müslüman görünen kişiye ne denir?', 'Münafık', ['Müşrik', 'Mümin', 'Muhsin'], 'Münafık, içinde inkâr taşıyıp dışarıdan inanıyor gibi görünen kimsedir.'),
 ('mc', 2, 'tevhid', 'Tevhid', 'e', 'Allah’ın bir ve eşsiz olduğuna inanmaya ne ad verilir?', 'Tevhid', ['Tevekkül', 'Teravih', 'Teyemmüm'], 'Allah’ın birliğine, ortağı ve benzeri olmadığına inanmaya tevhid denir.'),
 ('mc', 5, 'kufur', 'Küfür', 'm', 'Allah’ı ve iman esaslarını inkâr etmeye ne denir?', 'Küfür', ['Takva', 'İhsan', 'Tevekkül'], 'Küfür, Allah’ı ve iman esaslarını inkâr etmek anlamına gelir.'),
 ('tf', 3, 'iman_tasdik', 'İmanın niteliği', 'm', 'İman, yalnızca bilgi sahibi olmak değil, kalpten benimseyip kabul etmektir.', True, 'İman, bilmenin ötesinde kalbin tasdik etmesi ve teslimiyet göstermesidir.'),
 ('tf', 7, 'mumin', 'Mümin', 'e', 'Mümin, Allah’a ve Hz. Peygamber’in getirdiklerine inanan kimsedir.', True, 'Mümin, iman esaslarına inanıp Hz. Peygamber’in Allah’tan getirdiklerini kabul eden kişidir.'),
 ('mc', 1, 'amentu_anlam', 'Âmentü billâh', 'e', '“Âmentü billâh” ifadesi ne anlama gelir?', 'Allah’a iman ettim', ['Allah’a şükrettim', 'Allah’tan korktum', 'Allah’ı andım'], '“Âmentü billâh”, “Allah’a iman ettim” demektir.'),
]
