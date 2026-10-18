# DEEN Arapça V2 — mobil oyun kalitesi ve soru dağılımı

**Sürüm adayı:** \`9451arabicquizbalance\` — PR ve QA tamamlanmadan yayımlandı sayılmaz.

## Düzeltilen oyun kalitesi

- Arapça iki harfli **birleştirme** sorularında, doğru parçalar artık her soruda sabit 2. ve 4. konumda değildir. Dört benzersiz gerçek Arapça harf karıştırılır. Karıştırma aynı soru ekranı yeniden çizildiğinde ve dil değiştirildiğinde **kararlı** kalır.
- Dört çiftli **eşleştirme** sorularında sol harf sırası soru başına çeşitlenir; sağdaki isimler sıfır olmayan döngüsel kaydırmayla yerleştirilir. Aynı satırda cevap eşleşmesi önceden gösterilmez.
- Eşleştirmede yanlış seçim, doğru seçenek kimliğiyle yanlışlıkla yazılmamalı: önceki yanlış cevap kimliğinin cevap anahtarındaki doğrula eşit çıkması engellenir. Ustalık ve aralıklı tekrar kanıtı korunur.
- Oturumun ilk üç sorusunun (özellikle vadesi gelmiş tekrarların) sırası sabit kalır. Sonraki sorular, mevcut seçili soruların **kimliklerini, doğru seçeneklerini ve zorluk sayısını değiştirmeden**, aynı türün art arda gereksiz gelmesini azaltacak şekilde sıraya dizilir.
- İlk soruda o oturumdaki **A–B–C–D / eşleştirme / birleştirme** gerçek soru adetleri beş dilde gösterilir. Bir tür olmayan derslere o türün var olduğu iddia edilmez.
- 320, 360 ve 390px'lik ekranlarda tüm seçeneklerin 44px asgari dokunma alanına ve kutu içine sığmasına yönelik CSS düzeltildi.

## Denetim

- \`scripts/test-arabic-v2-quiz-diversity.cjs\`: 600 mevcut soru, ilk 7 harf dersinin 200 sorusunda gerçek tür dağılımı, 22 birleştirme öğesi, sabit cevap konumunun kırılması, çoklu karıştırma, aynı satıra denk gelmeyen eşleşmeler ve oturum örnekleri.
- \`scripts/test-arabic-pack-b-chrome.cjs\`: tarayıcıda 320/360/390px, 5 dil, gerçek seçim/tap, eşleştirmenin satırdan okunamaması, cevap bankası parçaları, içerik ve ilerleme kayıtlarının korunması.
- Önce **son commit** hızlı/kapsamlı Actions QA; sonra PR merge; sonra main/Pages QA.

**Sınırlar:** Yeni ses üretilmez, Arapça/Kur'an ayetleri veya 600 soruluk bankanın cevabı değişmez. Öğrenme kazanımı, kıraat yeterliliği veya 448 insan inceleme kaydının uzman onayı elde edilmiş sayılmaz.