UNIT = 'U06'
SLUG = 'meleklere_iman'
TITLES = {1: 'Melekler Kimdir?', 2: 'Meleklerin Özellikleri', 3: 'Cebrâil ve Vahiy', 4: "Kur'an'da Meleklerin Görevleri", 5: 'Meleklere İmanın Anlamı', 6: 'Yanlış Anlamaları Düzelt', 7: 'Melekler Ustalığı'}

Q = [
 # --- Selected from the supplied question pool
 ('mc', 1, 'p6_nur', 'Meleklere iman', 'e', 'Meleklerin yaratıldığı unsur İslamî kaynaklarda nasıl bildirilir?', 'Nur', ['Ateş', 'Toprak', 'Su'], 'Hadise göre melekler nurdan yaratılmıştır.'),
 ('mc', 1, 'p6_itaat', 'Meleklere iman', 'e', 'Melekler Allah’ın emirlerine karşı nasıl davranır?', 'İsyan etmez, emredileni yerine getirirler', ['İnsanlar gibi günah işlemekte serbesttirler', 'Kendi ilahlarını seçerler', 'Allah’ın emirlerini reddederler'], 'Melekler Allah’a isyan etmez, kendilerine emredileni yaparlar (Tahrîm 6).'),
 ('mc', 2, 'p6_cebrail', 'Meleklere iman', 'e', 'Vahiy getirmekle görevli melek kimdir?', 'Cebrâil', ['Mikâil', 'Azrâil', 'İsrâfil'], 'Cebrâil, Allah’ın vahyini peygamberlere ulaştıran melektir.'),
 ('mc', 2, 'p6_mikail', 'Meleklere iman', 'm', 'Tabiat olayları ve rızıkla ilgili görevlerle anılan melek kimdir?', 'Mikâil', ['Cebrâil', 'Mâlik', 'İsrâfil'], 'Mikâil, yağmur ve rızık gibi görevlerle anılır.'),
 ('mc', 2, 'p6_israfil', 'Meleklere iman', 'm', 'Sûra üflemekle görevli melek kimdir?', 'İsrâfil', ['Cebrâil', 'Mikâil', 'Kirâmen Kâtibîn'], 'İsrâfil, kıyametin kopması için sûra üfleyecek melektir.'),
 ('mc', 3, 'p6_azrail', 'Meleklere iman', 'm', 'Can almakla görevli melek hangi adla bilinir?', 'Melekü’l-mevt', ['Cebrâil', 'İsrâfil', 'Mikâil'], 'Can almakla görevli melek, Kur’an’da “Melekü’l-mevt” (ölüm meleği) diye anılır; halk arasında Azrâil denir.'),
 ('mc', 3, 'p6_kiramen', 'Meleklere iman', 'm', 'İnsanların iyi ve kötü davranışlarını yazmakla görevli melekler nasıl adlandırılır?', 'Kirâmen Kâtibîn', ['Zebânîler', 'Mukarrebûn', 'Hamele-i Arş'], 'Kirâmen Kâtibîn, insanların davranışlarını kaydeden değerli yazıcı meleklerdir (İnfitâr 10-12).'),
 ('mc', 4, 'p6_munker', 'Meleklere iman', 'm', 'Kabir sorgusuyla ilişkilendirilen melekler hangileridir?', 'Münker ve Nekir', ['Cebrâil ve Mikâil', 'İsrâfil ve Azrâil', 'Hârût ve Mârût'], 'Hadislerde kabirde sorgu yapan melekler Münker ve Nekir olarak anılır.'),
 ('mc', 4, 'p6_ridvan', 'Meleklere iman', 'm', 'Cennet bekçisi olarak anılan meleğin adı hangisidir?', 'Rıdvan', ['Cebrâil', 'Mâlik', 'Mikâil'], 'Cennet görevlisi melek Rıdvan adıyla anılır.'),
 ('mc', 5, 'p6_malik', 'Meleklere iman', 'm', 'Cehennem görevlisi olarak Kur’an’da adı geçen melek hangisidir?', 'Mâlik', ['Rıdvan', 'Mikâil', 'İsrâfil'], 'Zuhruf 77’de cehennem bekçisi olarak Mâlik’in adı geçer.'),
 ('mc', 5, 'p6_cinsiyet', 'Meleklere iman', 'h', 'Meleklerin cinsiyetleri hakkında İslamî yaklaşım hangisidir?', 'İnsanların cinsiyet kategorileriyle tanımlanmazlar', ['Hepsi erkektir', 'Hepsi kadındır', 'İnsanlarla aynı biyolojik yapıya sahiptirler'], 'Melekler, insanın cinsiyet kategorileriyle tanımlanmaz; Kur’an onlara dişi demeyi eleştirir (Zuhruf 19).'),
 ('mc', 6, 'p6_gayb', 'Meleklere iman', 'e', 'İslam inancına göre melekler hangi özelliğe sahiptir?', 'Gaybî varlıklardır', ['Her zaman insan gözüyle görülürler', 'Allah’a ortaktırlar', 'Yaratıcıdırlar'], 'Melekler, duyularla doğrudan algılanmayan gaybî varlıklardır.'),
 ('mc', 6, 'p6_dort_buyuk', 'Meleklere iman', 'm', 'Dört büyük melekten biri olmayan hangisidir?', 'Münker', ['Cebrâil', 'Mikâil', 'İsrâfil'], 'Dört büyük melek Cebrâil, Mikâil, İsrâfil ve Azrâil’dir.'),
 ('mc', 7, 'p6_izin', 'Meleklere iman', 'h', 'Meleklerin Allah’ın izni olmadan bağımsız güç kullanabildiğine inanmak doğru mudur?', 'Hayır; görevlerini Allah’ın emri ve izniyle yerine getirirler', ['Evet; yaratma gücüne sahiptirler', 'Evet; Allah’tan bağımsızdırlar', 'Hayır; çünkü melekler yoktur'], 'Melekler görevlerini Allah’ın emri ve izniyle yerine getirirler; bağımsız güç sahibi değildirler.'),
 ('mc', 7, 'p6_bilinc', 'Meleklere iman', 'm', 'Meleklere iman insanda hangi bilinci güçlendirebilir?', 'Davranışların kaydedildiği ve sorumluluk taşıdığı bilincini', ['İnsanların ilah olduğu inancını', 'Haksızlığın serbest olduğu fikrini', 'Hiçbir davranışın önemli olmadığı düşüncesini'], 'Meleklere iman, davranışların kaydedildiği bilincini ve sorumluluk duygusunu güçlendirir.'),
]
