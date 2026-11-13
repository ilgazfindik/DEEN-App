# Kıyafet katmanları (gardırop)

Her kıyafet, hayvanın tam boy görseliyle **aynı tuvalde** çizilmiş saydam bir görsel olmalıdır.

- Tam boy taban görseller: `assets/companions/<hayvan>/<hayvan>_body.webp` (512×768, saydam). Şu an: `cat`, `lion`.
- Kıyafet katmanı: aynı **512×768** tuval, saydam arka plan, **yalnızca kıyafet** (hayvan yok), WebP ya da PNG. Konum, taban görselle birebir hizalı olmalı.
- Dosya yolu: `assets/companions/outfits/<hayvan>/<id>.webp`
- Kayıt: `assets/companions/outfits.json` içine ekleyin; koda dokunmak gerekmez.

```json
{"items":[
 {"id":"ot_cap","slot":"head","z":30,"cost":60,
  "name":{"tr":"Şapka","en":"Cap","de":"Mütze","fr":"Bonnet","ar":"قبعة"},
  "art":{"cat":"assets/companions/outfits/cat/ot_cap.webp","lion":"assets/companions/outfits/lion/ot_cap.webp"}}
]}
```

- `id`: `ot_` ile başlar, yalnızca küçük harf, rakam, alt çizgi.
- `slot`: `head`, `neck`, `body` ya da `hand`. Aynı yuvada aynı anda tek kıyafet takılır.
- `z`: üst üste sırası (büyük olan üstte). Öneri: body 10, neck 20, head 30, hand 40.
- `cost`: Pırıltı fiyatı (gerçek para yok).
- `art`: yalnızca görseli olan hayvanlar yazılır; görseli olmayan hayvanda eşya görünmez.

## Kıyafet katmanını hazırlama (önerilen yol)

AI araçlarının "yalnızca kıyafet, saydam arka plan" üretmesi zordur. Daha kolay yol:

1. Hayvanın düz tam boy görselini (`<hayvan>_body.webp`) bir görsel düzenleme aracına ver ve **aynı pozda, aynı çerçevede** kıyafetli halini iste (örnek istek: "Aynı karakteri, aynı poz ve boyutta bırak; sadece kafasına kırmızı bir kep ekle. Arka planı ve karakterin geri kalanını değiştirme.").
2. Çıkan görseli 2:3 oranında kırp, sonra katmanı çıkar:

```bash
python3 scripts/extract-outfit-layer.py \
  --base assets/companions/cat/cat_body.webp \
  --dressed cat_kep.png \
  --out assets/companions/outfits/cat/ot_cap.webp \
  --preview onizleme.png
```

3. `onizleme.png`'ye bak: solda yalnızca kıyafet katmanı, sağda hayvanın üstünde. Tüyler veya yüz de kesilmişse araç hayvanı da değiştirmiştir; daha az değiştiren bir istekle yeniden dene ya da `--threshold` değerini yükselt (örn. 40).
4. Katmanı `outfits.json`'a ekle (yukarıdaki biçim).

Not: Araç yalnızca iki görsel arasında **değişen pikselleri** alır. Düzenleme aracı hayvanın kendisini de biraz değiştirirse (renk, poz, yüz) o kısımlar da katmana sızar.

## Gövde kıyafetleri (cübbe, yelek...) için `--full`

Gövdeyi kaplayan kıyafetlerde kesilmiş katman, hayvanın altta kalan tüylerinin kenarlardan görünmesine yol açabilir. Bunun yerine kıyafetli **bütün karakteri** düz arka plandan ayırıp tam boy görsel olarak kullanın:

```bash
python3 scripts/extract-outfit-layer.py --full \
  --dressed kedi_cubbe.png \
  --out assets/companions/outfits/cat/ot_thobe.webp \
  --preview onizleme.png
```

`outfits.json` kaydında `"slot":"body"` ve `"full":true` yazın. Bu görsel o hayvanın düz gövde resminin **yerine** geçer; şapka, atkı gibi diğer katmanlar (`head`, `neck`) üstüne binmeye devam eder. `"default":true` ve `"cost":0` olan gövde kıyafeti ücretsiz varsayılandır, çıkarılamaz.

## Kurt, baykuş, kaplumbağa, kartal için (2:3 olmayan görseller)

Bu dört hayvanın düz görselleri 2:3 değil, daha dar. `normalize-companion-body.py` bunları aynı 512×768 tuvale, aynı taban çizgisiyle yerleştirir ve nasıl ölçeklendiğini `assets/companions/body-frames.json`'a yazar (düz hali zaten yerleştirildi: `<hayvan>_body.webp`).

Kıyafetli görseli bu düz görselle **aynı tuval boyutunda** (örn. baykuş 377×1024) üretin; sonra `--animal` ile çalıştırın, katman aynı yere oturur:

```bash
python3 scripts/extract-outfit-layer.py --full --animal wolf \
  --dressed kurt_cubbe.png --out assets/companions/outfits/wolf/ot_thobe.webp --preview onizleme.png
# şapka/atkı katmanı için (taban = cübbeli tam karakter):
python3 scripts/extract-outfit-layer.py --animal wolf --base assets/companions/outfits/wolf/ot_thobe.webp \
  --dressed kurt_cubbe_takke.png --out assets/companions/outfits/wolf/ot_kufi_white.webp
```

Görsel aracı tuvali değiştirirse (farklı oran) araç hata verir; aynı boyutta isteyin ya da aynı çerçeveye kırpın.
