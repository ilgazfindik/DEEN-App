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
