UNIT = 'U04'
SLUG = 'islamin_bes_sarti'
TITLES = {1: 'Beş Şartı Tanı', 2: 'Şehadet ve Namaz', 3: 'Oruç, Zekât ve Hac', 4: 'Kavramları Eşleştir', 5: 'Hangisi Hangi Şart?', 6: 'Akıllı Tekrar', 7: 'Beş Şart Challenge'}

Q = [
 # --- Selected from the supplied question pool
 ('mc', 1, 'p4_mali', 'İslam’ın beş şartı', 'e', 'İslam’ın beş şartından hangisi mali ibadettir?', 'Zekât vermek', ['Oruç tutmak', 'Kelime-i şehadet getirmek', 'Namaz kılmak'], 'Zekât, mala bağlı olduğu için mali ibadettir.'),
 ('mc', 2, 'p4_hac_omur', 'İslam’ın beş şartı', 'e', 'İslam’ın beş şartından hangisi imkânı olanların ömründe bir kez yerine getirmesi gereken ibadettir?', 'Hac', ['Her yıl umre', 'Her gün cuma namazı', 'Her ay itikâf'], 'Hac, gücü yetenlere ömürde bir kez farzdır.'),
 ('mc', 1, 'p4_iman_ikrar', 'İslam’ın beş şartı', 'e', 'İslam’ın beş şartı arasında yer alan iman ikrarı hangisidir?', 'Kelime-i şehadet', ['İstiğfar', 'Tekbir', 'Salavat'], 'İman ikrarı, kelime-i şehadettir.'),
 ('mc', 1, 'p4_gunde_bes', 'İslam’ın beş şartı', 'e', 'Günde beş vakit farz olan ibadet hangisidir?', 'Namaz', ['Zekât', 'Hac', 'Kurban'], 'Namaz günde beş vakit farzdır.'),
 ('mc', 3, 'p4_zekat_amac', 'İslam’ın beş şartı', 'm', 'Zekâtın temel amaçlarından biri hangisidir?', 'Malı arındırmak ve ihtiyaç sahiplerine destek olmak', ['Zenginliği gösteriş için artırmak', 'Ticarette tekel oluşturmak', 'Borçluyu küçük düşürmek'], 'Zekât malı arındırır ve ihtiyaç sahiplerine destek sağlar.'),
 ('mc', 2, 'p4_oruc_vakit', 'İslam’ın beş şartı', 'm', 'Oruç ibadeti hangi zaman diliminde tutulur?', 'Fecrin doğuşundan güneşin batışına kadar', ['Yalnızca gece yarısı', 'Güneş doğduktan öğlene kadar', 'İkindi ile yatsı arasında'], 'Oruç, fecrin doğuşundan güneş batıncaya kadar tutulur.'),
 ('mc', 2, 'p4_hac_sehir', 'İslam’ın beş şartı', 'e', 'Hac ibadeti hangi kutsal şehirde yerine getirilir?', 'Mekke', ['Kudüs', 'Medine', 'Taif'], 'Hac, Mekke ve çevresinde yerine getirilir.'),
 ('mc', 5, 'p4_hadis', 'İslam’ın beş şartı', 'm', 'İslam’ın beş şartı hangi kaynağa dayanan meşhur hadisle açıklanır?', 'İslam’ın beş esas üzerine kurulduğunu bildiren hadis', ['Sadece savaş hukukunu anlatan hadis', 'Yalnızca mirası anlatan hadis', 'Sadece ticareti anlatan hadis'], 'Beş esas, “İslam beş şey üzerine kurulmuştur” hadisiyle açıklanır (Buhârî, Müslim).'),
 ('mc', 6, 'p4_zekat_sure', 'İslam’ın beş şartı', 'm', 'Zekâtın verileceği grupları açıklayan âyet hangi surede yer alır?', 'Tevbe Suresi', ['Kureyş Suresi', 'Felak Suresi', 'Kevser Suresi'], 'Zekâtın verileceği sekiz grup Tevbe 60’ta sayılır.'),
 ('mc', 3, 'p4_hac_kimlere', 'İslam’ın beş şartı', 'e', 'Hac ibadeti kimlere farzdır?', 'Gücü yeten Müslümanlara', ['Her yaştaki bütün insanlara', 'Sadece Mekke’de yaşayanlara', 'Yalnızca din görevlilerine'], 'Hac, bedenen ve malen gücü yeten Müslümanlara farzdır.'),
 ('mc', 4, 'p4_imsak', 'İslam’ın beş şartı', 'e', 'Oruçta imsak neyi ifade eder?', 'Oruca başlama vaktini', ['Bayram namazı vaktini', 'Hac ihramından çıkmayı', 'Orucu açma vaktini'], 'İmsak, orucun başladığı vakittir.'),
 ('mc', 4, 'p4_iftar', 'İslam’ın beş şartı', 'e', 'İftar ne zaman yapılır?', 'Güneş battığında', ['Güneş doğduğunda', 'Öğle ezanında', 'İmsak vaktinde'], 'Oruç güneşin batmasıyla açılır.'),
 ('mc', 5, 'p4_tavaf', 'İslam’ın beş şartı', 'e', 'Hacda Kâbe’nin etrafında dönmeye ne denir?', 'Tavaf', ['Vakfe', 'Sa’y', 'Telbiye'], 'Kâbe’nin etrafında yedi defa dönmeye tavaf denir.'),
 ('mc', 5, 'p4_sai', 'İslam’ın beş şartı', 'e', 'Safa ile Merve arasında gidip gelmeye ne denir?', 'Sa’y', ['İhram', 'Tavaf', 'Arafat vakfesi'], 'Safa ile Merve arasında yedi defa gidip gelmeye sa’y denir.'),
 ('mc', 6, 'p4_vakfe', 'İslam’ın beş şartı', 'm', 'Hacda Arafat’ta belirli zamanda bulunmanın adı nedir?', 'Vakfe', ['Tavaf', 'Şeytan taşlama', 'Sa’y'], 'Arafat’ta belirli zamanda bulunmaya vakfe denir; hacın en önemli rüknüdür.'),
 ('mc', 7, 'p4_bedeni', 'İslam’ın beş şartı', 'm', 'İslam’ın beş şartından hangisi bedenî ibadettir?', 'Namaz', ['Sadaka-i fıtır', 'Mali kefaret', 'Zekât'], 'Namaz, beden ile yapılan ibadettir.'),
 ('mc', 6, 'p4_zekat_toplum', 'İslam’ın beş şartı', 'm', 'Zekâtın toplumsal işlevlerinden biri hangisidir?', 'Dayanışmayı güçlendirmek', ['İhtiyaç sahiplerini dışlamak', 'İsrafı teşvik etmek', 'Gelir adaletsizliğini kutsamak'], 'Zekât, toplumda dayanışmayı ve paylaşmayı güçlendirir.'),
 ('mc', 7, 'p4_oruc_ahlak', 'İslam’ın beş şartı', 'm', 'Oruç ibadetinin ahlaki kazanımlarından biri hangisidir?', 'Sabır ve öz denetim', ['Kibir', 'İsraf', 'Öfkeyi artırmak'], 'Oruç, sabır ve nefsi denetleme alışkanlığı kazandırır.'),
 ('mc', 7, 'p4_hac_umum', 'İslam’ın beş şartı', 'm', 'Hac ibadeti Müslümanlara hangi ortaklığı hatırlatır?', 'Ümmet bilinci ve eşitlik', ['Maddi zenginlik', 'Soyla ayrıcalık', 'Irk üstünlüğü'], 'Hacda herkes aynı ihramla aynı yerde bulunur; bu ümmet bilincini ve eşitliği hatırlatır.'),
]
