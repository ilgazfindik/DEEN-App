UNIT = 'U07'
SLUG = 'kitaplara_iman'
TITLES = {1: 'Kitaplara İman Nedir?', 2: 'Tevrat, İncil, Zebur ve Sahifeler', 3: "Kur'an'ın Konumu", 4: 'İlahi Kitapların Ortak Kaynağı', 5: "Kur'an'ın Rehberliği ve Korunması", 6: 'Yanlış Anlamaları Düzelt', 7: 'Kitaplara İman Ustalığı'}

Q = [
 # --- Selected from the supplied question pool
 ('mc', 1, 'p7_ilk_sure', 'Kur’an ve kitaplar', 'e', 'Kur’an’ın ilk suresi hangisidir?', 'Fâtiha', ['Bakara', 'İhlâs', 'Nas'], 'Mushaftaki ilk sure Fâtiha Suresi’dir.'),
 ('mc', 1, 'p7_son_sure', 'Kur’an ve kitaplar', 'e', 'Kur’an’ın son suresi hangisidir?', 'Nas', ['Felak', 'Kevser', 'Fâtiha'], 'Mushaftaki son sure Nas Suresi’dir.'),
 ('mc', 2, 'p7_sure_bolum', 'Kur’an ve kitaplar', 'e', 'Kur’an’da âyetlerin bir araya gelerek oluşturduğu bölüm nedir?', 'Sure', ['Hizip', 'Rükû', 'Cüz'], 'Âyetlerden oluşan bölümlere sure denir.'),
 ('mc', 2, 'p7_cuz', 'Kur’an ve kitaplar', 'e', 'Kur’an’ın 30 eşit bölüme ayrılmış kısımlarına ne denir?', 'Cüz', ['Hizip', 'Sure', 'Âyet'], 'Kur’an otuz cüze ayrılmıştır.'),
 ('mc', 3, 'p7_23yil', 'Kur’an ve kitaplar', 'm', 'Kur’an’ın indirilişi yaklaşık kaç yıl sürmüştür?', '23 yıl', ['63 yıl', '10 yıl', '40 yıl'], 'Vahiy, peygamberliğin başından vefata kadar yaklaşık 23 yıl sürmüştür.'),
 ('mc', 3, 'p7_koruma', 'Kur’an ve kitaplar', 'h', 'Kur’an’ın korunmuşluğu inancı hangi temel düşünceyi ifade eder?', 'Allah’ın vahyini koruyacağını bildirmesi', ['Kur’an’ın yalnızca sözlü aktarılması', 'Her kişinin yeni sure ekleyebilmesi', 'Metnin her dönemde değişmesi'], 'Hicr 9’da Allah’ın Kur’an’ı koruyacağı bildirilir.'),
 ('mc', 3, 'p7_mushaf', 'Kur’an ve kitaplar', 'm', 'Mushaf ne demektir?', 'Kur’an âyetlerinin kitap hâlinde toplanmış şekli', ['Vahiy meleğinin görevi', 'Bir melek adı', 'Namazın bir rüknü'], 'Mushaf, Kur’an’ın kitap hâlinde bir araya getirilmiş şeklidir.'),
 ('mc', 4, 'p7_olmayan_kitap', 'Kur’an ve kitaplar', 'm', 'Kur’an’da adı geçen büyük kitaplardan biri olmayan hangisidir?', 'Veda', ['Zebur', 'İncil', 'Tevrat'], 'Kur’an’da Tevrat, Zebur, İncil ve Kur’an anılır; “Veda” bir kitap adı değildir.'),
 ('mc', 4, 'p7_konular', 'Kur’an ve kitaplar', 'm', 'Kur’an’ın temel konularından biri hangisidir?', 'İnanç, ibadet, ahlak ve hayat ilkeleri', ['Yalnızca şiir ölçüleri', 'Sadece savaş tarihleri', 'Yalnızca matematik formülleri'], 'Kur’an, inanç, ibadet, ahlak ve hayat ilkelerini bildirir.'),
 ('mc', 5, 'p7_vahiy', 'Kur’an ve kitaplar', 'm', 'Kur’an âyetlerinin Hz. Muhammed’e bildirilmesine ne denir?', 'Vahiy', ['İlham', 'Rüya tabiri', 'Kıyas'], 'Allah’ın peygamberlerine bildirdiği mesaja vahiy denir.'),
 ('mc', 5, 'p7_anlamak', 'Kur’an ve kitaplar', 'm', 'Kur’an’ı doğru anlamak için hangi yaklaşım uygundur?', 'Ayetleri bağlamı ve güvenilir açıklamalarıyla değerlendirmek', ['Kişisel çıkarı tek ölçü yapmak', 'Bir ayeti bağlamından koparmak', 'Kaynakları tamamen dışlamak'], 'Kur’an, bağlamı ve güvenilir açıklamaları gözetilerek anlaşılır.'),
 ('mc', 5, 'p7_hidayet', 'Kur’an ve kitaplar', 'm', 'Kur’an’ın indiriliş amacı için hangisi uygundur?', 'İnsanlara hidayet ve rehberlik etmek', ['Sadece belirli bir kavme hitap etmek', 'İnsanları bilgiden uzaklaştırmak', 'Yalnızca tarihî olayları listelemek'], 'Kur’an, insanlara hidayet ve rehberlik için indirilmiştir.'),
 ('mc', 6, 'p7_kitap_peygamber', 'Kur’an ve kitaplar', 'm', 'İlahi kitaplara iman ile peygamberlere iman arasındaki bağ hangisidir?', 'Kitaplar peygamberlere vahyedilmiştir', ['İkisi arasında ilişki yoktur', 'Kitaplar melekler tarafından yazılmıştır', 'Peygamberler kitapları kendileri ilah olarak üretmiştir'], 'İlahi kitaplar, Allah tarafından peygamberlere vahyedilmiştir.'),
 ('mc', 7, 'p7_hifz', 'Kur’an ve kitaplar', 'e', 'Kur’an’ın ezberlenmesi ve okunmasıyla ilgili kavram hangisidir?', 'Hıfz', ['Sa’y', 'Tavaf', 'Vakfe'], 'Kur’an’ı ezberlemeye hıfz denir; ezberleyene hâfız denir.'),
 ('mc', 7, 'p7_tecvid', 'Kur’an ve kitaplar', 'm', 'Kur’an’ı güzel ve kurallarına uygun okumayı inceleyen ilim hangisidir?', 'Tecvid', ['Kelam', 'Siyer', 'Fıkıh'], 'Tecvid, Kur’an’ın harf ve kurallarına uygun okunmasını inceleyen ilimdir.'),
 ('mc', 7, 'p7_tefsir', 'Kur’an ve kitaplar', 'm', 'Kur’an’ın açıklanması ve yorumlanmasıyla ilgilenen ilim hangisidir?', 'Tefsir', ['Sarf', 'Aruz', 'Hadis usulü'], 'Tefsir, Kur’an’ın açıklanması ve yorumlanmasıyla ilgilenen ilimdir.'),
]
