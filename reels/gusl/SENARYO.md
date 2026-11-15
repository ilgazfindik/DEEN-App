# Gusül Reels (Arapça): Senaryo ve Teslim Paketi

- **Format:** 9:16, 1080×1920, 30 fps, 45,0 sn, sessiz MP4 (`out/gusl-reel-ar.mp4`).
- **Dil:** Fusha (Modern Standart Arapça).
- **Fontlar:** Cairo (başlıklar ve metin), Amiri (yalnızca harekeli «بِسْمِ اللَّهِ»).
- **Palet:** koyu yeşil `#0E2A22` / `#0A1D18`, krem `#F3EAD7`, soluk altın `#D2B373`, su yeşili `#8CC3B4`, uyarı tonu `#D08A68`.
- **Hesap adı:** yer tutucu `@hesap_adi`. `index.html` içinde `handle` değişkeninden ya da `<span data-var-text="handle">` satırından değiştirilir.

---

## 1. Kanca alternatifleri

| # | Kanca (ilk 2 sn) | Neden |
|---|---|---|
| **A, önerilen (videoda kullanılan)** | **بقعةٌ جافّةٌ صغيرة… قد تُفسِدُ غُسلَك كلَّه** | Somut ve görselleştirilebilir: silüette tek bir kuru nokta yanıp söner. Sessiz izleyende de çalışır. Referansın soru kalıbından ("gusül aldın ama hâlâ cünüp müsün?") tamamen farklı. |
| B | هناك مكانٌ في جسدك… قد لا يصلُه الماءُ عند الغُسل | Merak boşluğu açar ("hangi yer?"). Cevap 30. saniyede gelir, izleyiciyi sona kadar tutar. |
| C | ثلاثُ خطوات… وخطأٌ واحد قد يُفسدها كلَّها | Liste vaadi + risk. Kaydetme oranı için iyi, ama A kadar görsel değil. |

---

## 2. Sahne planı ve ekran metni

Ekranda aynı anda en fazla 2 satır var. Metin kelime kelime beliriyor, altın renkli kelime vurgu.

- **Güvenli alan:** hesap adı y≈296 px'te, adım göstergesi y≈330 px'te. Metin bloğu y≈1040–1215 px arasında, yani Instagram'ın alt arayüz bandının üstünde.
- **Alt boşluk:** 1250 px'in altında yalnızca arka plan desenini bıraktım.
- **Geçişler:** her sahne bir öncekiyle 0,3 sn çapraz geçişle birleşiyor.

| Zaman | Sahne | Ekran metni (satır 1 / satır 2) | Görsel |
|---|---|---|---|
| 0,0–3,0 | Kanca | بقعةٌ جافّةٌ صغيرة… / قد **تُفسِدُ** غُسلَك كلَّه | Suyla dolu silüet, koltuk altında kuru nokta nabız gibi atıyor. İlk kare = kapak (1. satır 0. karede ekranda). |
| 3,0–6,0 | Tanım | الغُسلُ ليس صبًّا على عَجَل / بل **تعميمُ** البدنِ بالماء | Damlalar düşüyor, silüetin içi aşağıdan yukarı suyla doluyor. |
| 6,0–9,5 | Yaygın hata | الخطأُ الشائع: **الاستعجال** / فتبقى مواضعُ بلا ماء | × rozeti, üç kuru nokta sırayla beliriyor. |
| 9,5–13,0 | Mezhep notu | المضمضةُ والاستنشاق / **حكمُهما** يختلف بين المذاهب | Sallanan terazi + 4 nokta (dört mezhep). |
| 13,0–15,8 | Adım 1/3 | أولًا: **النيّةُ** بالقلب / وحكمُها يختلف بين المذاهب | Merkezden yayılan halkalar. |
| 15,8–19,0 | Adım 1/3 | ثم اغسلْ **يديك** / وأزِلِ الأذى عن بدنك | Amiri, harekeli «بِسْمِ اللَّهِ» sağdan sola açılıyor. |
| 19,0–23,5 | Adım 2/3 | ثانيًا: **توضّأ** وضوءَ الصلاة / مع المضمضةِ والاستنشاق | İbrik eğiliyor, avuca su akıyor, halka dalgalar. |
| 23,5–27,0 | Adım 3/3 | ثالثًا: أفِضِ الماءَ **ثلاثًا** / على الرأس، فالأيمن، فالأيسر | Silüette 1 (baş), 2 (sağ), 3 (sol) rozetleri ve damlalar. Silüet izleyiciye dönük olduğu için "الأيمن" ekranın solunda, etiketli. |
| 27,0–30,5 | Adım 3/3 | وادلُكْ **جسدَك** بيدك / وحكمُ الدَّلكِ يختلف بين المذاهب | Gövdede dönen ovma halkaları. |
| 30,5–33,2 | Kuru kalan yerler | انتبهْ **لخلفِ** الأذنين / وثقوبِ الأقراط | Kulak arkası ve küpe deliği noktaları. |
| 33,2–36,0 | Kuru kalan yerler | والسُّرّةِ والإبطين / وما **بين** الأصابع | Göbek, koltuk altları ve parmak noktaları. |
| 36,0–39,0 | Oje | طلاءُ الأظافر **يحجبُ** الماء / فأزِلْه قبل الغُسل | Damla ojeye çarpıp kalıyor, oje kalkıyor, ✓ beliriyor. |
| 39,0–41,8 | Müjde | **بُشرى**: صلِّ بغُسلك / ما لم ينتقض وضوؤك | Açılan sekiz köşeli yıldız ve ışınlar. |
| 41,8–45,0 | Paylaşma çağrısı | أرسِلْه **لمن** يحتاجه / لعلّه يُصحِّحُ غُسلَه | Kâğıt uçak ve kesikli iz. |

**Adım göstergesi:** 1/3 (13,0–19,0), 2/3 (19,0–23,5), 3/3 (23,5–30,5). Üstte üç çubuk var; sağdan sola dolar.

---

## 3. Seslendirme metni

Ayrı dosya: `seslendirme.txt`. Altyazı: `gusl-ar.srt`.

Seslendirme ekran metniyle aynı içerikte ama biraz daha akıcı. Toplam yaklaşık 105 kelime, 45 sn için rahat bir tempo.

```
بقعةٌ جافّةٌ صغيرة… قد تُفسِدُ غُسلَك كلَّه.
فالغُسلُ ليس صبًّا للماءِ على عَجَل، بل تعميمُ البدنِ كلِّه بالماء.
والخطأُ الشائع: الاستعجال، فتبقى مواضعُ لا يصلُها الماء.
أمّا المضمضةُ والاستنشاق، فحكمُهما يختلفُ بين المذاهب.
أولًا: انوِ بقلبك، وحكمُ النيّةِ يختلفُ بين المذاهب.
ثم قل: بسمِ الله، واغسلْ يديك، وأزِلِ الأذى عن بدنك.
ثانيًا: توضّأ وضوءَك للصلاة، مع المضمضةِ والاستنشاق.
ثالثًا: أفِضِ الماءَ ثلاثًا على رأسك، ثم على جانبِك الأيمن، ثم الأيسر.
وادلُكْ جسدَك بيدك، وحكمُ الدَّلكِ يختلفُ بين المذاهب.
وانتبهْ لخلفِ الأذنين، وثقوبِ الأقراط،
والسُّرّةِ، والإبطين، وما بين الأصابع.
وطلاءُ الأظافر يحجبُ الماء، فأزِلْه قبل الغُسل.
وبُشرى: صلِّ بغُسلك، ما لم ينتقضْ وضوؤك.
أرسِلْه لمن يحتاجه… لعلّه يُصحِّحُ غُسلَه.
```

`.srt` dosyasındaki her satır yukarıdaki sahne aralıklarına oturuyor. Seslendirmeyi kaydederken satır başlarını bu zamanlara denk getirin. Kayıt farklı uzunlukta çıkarsa sahne sürelerini `tools/build-scenes.mjs` içindeki `dur` değerlerinden değiştirip yeniden üretebilirsiniz (bkz. Bölüm 6).

---

## 4. Instagram açıklaması

```
بقعةٌ جافّةٌ واحدة قد تكون سببًا في عدم صحّة الغُسل 💧

في هذا المقطع:
• الخطأ الشائع عند الاغتسال
• طريقة الغُسل في ٣ خطوات
• مواضع تبقى جافّة غالبًا

تنبيه: بعض المسائل (كالمضمضة والاستنشاق، والنيّة، والدَّلك) يختلف حكمُها بين المذاهب، فارجع إلى مذهبك أو اسأل أهل العلم.

احفظ المقطع، وأرسِله لمن يحتاجه 🤍

#الغسل #الطهارة #فقه_العبادات #تعلم_دينك #معلومات_إسلامية
```

---

## 5. Doğrulatılacaklar

Fıkıh maddelerini bir hocaya veya fetva kaynağına, dil maddelerini anadili Arapça olan birine kontrol ettirin.

**Fıkıh**

1. **Kanca ve tanım iddiası** («قد تُفسِدُ غُسلَك كلَّه», «تعميمُ البدنِ بالماء»): Referanstaki "iğne ucu kadar kuru yer kalırsa gusül olmaz" bilgisine dayanıyor. Dört mezhepte de bütün bedenin yıkanmasının şart olduğu ifadesi için **[KAYNAK GEREKLİ]**. Videoda "bütün mezhepler" demedim.
2. **Guslün farzları:** Referans Hanefi sayımını veriyor (ağız, burun, beden = 3 farz). Bu sayımı videoda kullanmadım.
3. **Mazmaza ve istinşak:** Videoda yalnızca «حكمُهما يختلف بين المذاهب» deniyor. Hangi mezhebin farz/vacip, hangisinin sünnet saydığı referansta yok, o yüzden yazmadım. **[KAYNAK GEREKLİ]**
4. **Niyet:** Referans yalnızca Hanefi (sünnet) ve Şafii (farz) görüşünü veriyor. Maliki ve Hanbeli hükmü referansta yok, bu yüzden videoda sadece "mezhebe göre değişir" dedim. **[KAYNAK GEREKLİ]**
5. **Ovma (delk):** Referans ovmayı sünnete uygun alınışın bir parçası olarak anıyor. Hükmünün mezhepler arasında farklı olduğu bilgisi referansta yok; brifteki "ovma farklı olabilir" uyarısına dayanarak not koydum. **[KAYNAK GEREKLİ]**
6. **Su dökme sırası** (baş → sağ → sol, üçer kez): Referanstan alındı, delili belirtilmedi. **[KAYNAK GEREKLİ]**
7. **Besmele, el yıkama, kiri ve necaseti giderme, namaz abdesti gibi abdest:** Referanstan alındı. Her birinin sünnet mi müstehap mı olduğu ve mezhep farkları **[KAYNAK GEREKLİ]**.
8. **«وأزِلِ الأذى عن بدنك»:** Referanstaki "özel bölgeni ve bedenindeki kiri temizle" ifadesinin edepli karşılığı olarak seçildi. Yeterince açık mı, kontrol edin.
9. **Oje:** "Suyu geçirmeyen tabaka varsa önce çıkar" bilgisi referanstan alındı. **[KAYNAK GEREKLİ]**
10. **Diş dolgusu ve kaplama:** Referans "gusle engel değil" diyor. Mezhep farkı ihtimali ve süre nedeniyle videoya koymadım. Eklenecekse **[KAYNAK GEREKLİ]**.
11. **Müjde** («صلِّ بغُسلك ما لم ينتقض وضوؤك»): Referanstan alındı, delili verilmedi. **[KAYNAK GEREKLİ]**
12. **Kuru kalan yerler listesi** (kulak arkası, küpe deliği, göbek, koltuk altı, parmak araları): Referanstan alındı.

**Dil ve görsel**

13. Fusha ifadeleri anadili Arapça biri kontrol etmeli. Özellikle şunlar: «انتبهْ لخلفِ الأذنين», «صلِّ بغُسلك», «يحجبُ الماء», «فالأيمن، فالأيسر».
14. **Silüet yönü:** Figür izleyiciye dönük, bu yüzden kişinin sağı ekranın solunda. "الأيمن / الأيسر" etiketleri bu yüzden konuldu. Yine de kafa karıştırıyor mu, test edin.
15. **Hashtag'ler:** Mevcut popülerlikleri ve uygunlukları hesap stratejinize göre kontrol edilmeli.
16. **Hesap adı:** `@hesap_adi` yer tutucusunu gerçek adla değiştirin.

---

## 6. Projeyi düzenleme ve yeniden render

```bash
npm install -g hyperframes@0.9.52     # Node 22+ ve ffmpeg gerekir
cd reels/gusl
# metin veya süre değişikliği: tools/build-scenes.mjs içindeki BEATS tablosu
node tools/build-scenes.mjs           # compositions/*.html üretir
# süreler değiştiyse tools/hosts.generated.html içeriğini index.html'deki sahne host'larının yerine koyun
npx hyperframes check                 # doğrulama
npx hyperframes preview               # tarayıcıda önizleme
npx hyperframes render --fps 30 -o out/gusl-reel-ar.mp4
```

Ses eklemek için MP4'ü olduğu gibi kurgu programına alıp seslendirmeyi `gusl-ar.srt` zamanlarına göre yerleştirmeniz yeterli.
