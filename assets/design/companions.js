/* Companion unlocks + wardrobe ("Hayvan Odası").
   - Only Lion and Cat are available from the start; the other animals unlock with level.
   - Animals already chosen by earlier players stay owned (grandfathered).
   - Wardrobe: backdrops and small badges bought with Sparkles (the free in-game currency). No real-money sales.
   Uses only engine globals (state, level, sheet, closeSheet, toast, saveState, updateUI); never edits engine code. */
(()=>{
 'use strict';
 if(window.DEEN_COMPANIONS)return;
 const ORDER=['lion','cat','wolf','owl','turtle','eagle'];
 const LEVELS={lion:1,cat:1,wolf:2,owl:3,turtle:5,eagle:7};
 const EMOJI={lion:'🦁',cat:'🐈',wolf:'🐺',owl:'🦉',turtle:'🐢',eagle:'🦅'};
 const SV=(body)=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+body+'</svg>';
 const ICON={
  star:SV('<path fill="#ffd45e" stroke="#c8932a" stroke-width="1" stroke-linejoin="round" d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/>'),
  moon:SV('<path fill="#f4e6b0" stroke="#c8a24a" stroke-width="1" d="M16.5 3.2A9 9 0 1 0 20.8 16 7.2 7.2 0 0 1 16.5 3.2z"/><circle cx="17.5" cy="8" r="1.1" fill="#ffd45e"/>'),
  leaf:SV('<path fill="#5fd39a" stroke="#1f8a5b" stroke-width="1" stroke-linejoin="round" d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16z"/><path d="M4 20L14 10" stroke="#1f8a5b" stroke-width="1.4" fill="none" stroke-linecap="round"/>'),
  lamp:SV('<path d="M12 1.8v3" stroke="#b9691a" stroke-width="1.6" stroke-linecap="round"/><path fill="#ffb14a" stroke="#b9691a" stroke-width="1" stroke-linejoin="round" d="M9 5.6h6l2.2 3.2v7L15 19.2H9l-2.2-3.4v-7z"/><circle cx="12" cy="12.6" r="2.5" fill="#fff3b0"/><path d="M8.5 21.2h7" stroke="#b9691a" stroke-width="1.6" stroke-linecap="round"/>'),
  book:SV('<path fill="#2fb88f" stroke="#127a5c" stroke-width="1" stroke-linejoin="round" d="M3 5.5c3-1.3 6-1.3 9 .8 3-2.1 6-2.1 9-.8V19c-3-1.3-6-1.3-9 .8-3-2.1-6-2.1-9-.8z"/><path d="M12 6.3v13.5" stroke="#127a5c" stroke-width="1" fill="none"/>'),
  heart:SV('<path fill="#ff7a8f" stroke="#c44058" stroke-width="1" stroke-linejoin="round" d="M12 20.5S3.5 15 3.5 9.2A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.5 2.2C20.5 15 12 20.5 12 20.5z"/>'),
  fanus:SV('<path d="M12 2v2.4" stroke="#a8691a" stroke-width="1.4" stroke-linecap="round" fill="none"/><path d="M8.3 6.1h7.4l-1 2.1H9.3z" fill="#e8b04a" stroke="#a8691a" stroke-width="1" stroke-linejoin="round"/><path d="M7.7 8.7h8.6l-.9 9.2H8.6z" fill="#2f9d86" stroke="#14624f" stroke-width="1" stroke-linejoin="round"/><path d="M10 10.6h4v5h-4z" fill="#ffe08a"/><path d="M8.1 18.6h7.8l-.8 2.3H8.9z" fill="#e8b04a" stroke="#a8691a" stroke-width="1" stroke-linejoin="round"/>'),
  mosque:SV('<path d="M3.5 21v-7h17v7z" fill="#eef2ee" stroke="#8aa09a" stroke-width="1" stroke-linejoin="round"/><path d="M7.2 14a4.8 4.8 0 0 1 9.6 0z" fill="#3aa58f" stroke="#1d6b5a" stroke-width="1" stroke-linejoin="round"/><path d="M12 6.4v-2" stroke="#a8691a" stroke-width="1.3" stroke-linecap="round"/><circle cx="12" cy="3.7" r="1" fill="#e8b04a"/><path d="M4.4 14V8l1.1-1.7L6.6 8v6M17.4 14V8l1.1-1.7 1.1 1.7v6" fill="#d9e2de" stroke="#8aa09a" stroke-width="1" stroke-linejoin="round"/><path d="M10.6 21v-3.4a1.4 1.4 0 0 1 2.8 0V21z" fill="#3aa58f"/>'),
  candy:SV('<ellipse cx="12" cy="12" rx="5.2" ry="3.9" fill="#ff7aa8" stroke="#c4437a" stroke-width="1"/><path d="M6.9 12L3.4 9v6z" fill="#ffd45e" stroke="#c8932a" stroke-width=".8" stroke-linejoin="round"/><path d="M17.1 12l3.5-3v6z" fill="#ffd45e" stroke="#c8932a" stroke-width=".8" stroke-linejoin="round"/><path d="M9.3 9.6l1.6 4.8M13 9.1l1.6 5.4" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".75"/>'),
  gift:SV('<rect x="4" y="10" width="16" height="10.5" rx="1.6" fill="#7b8cff" stroke="#4553c9" stroke-width="1"/><rect x="3" y="7.2" width="18" height="3.8" rx="1.2" fill="#96a3ff" stroke="#4553c9" stroke-width="1"/><path d="M12 7.2v13.3" stroke="#ffd45e" stroke-width="2.2"/><path d="M12 7.2C9.6 7.2 8 6 8 4.8S9.5 3.2 10.6 4c.9.7 1.4 2 1.4 3.2zM12 7.2c2.4 0 4-1.2 4-2.4s-1.5-1.6-2.6-.8c-.9.7-1.4 2-1.4 3.2z" fill="#ffd45e" stroke="#c8932a" stroke-width=".9" stroke-linejoin="round"/>')
 };
 const svgUri=(w,h,body)=>'url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="xMidYMid slice">'+body+'</svg>')+'")';
 const NIGHT=svgUri(100,130,'<g fill="#fff"><circle cx="14" cy="16" r="1"/><circle cx="34" cy="9" r=".8"/><circle cx="52" cy="22" r="1.1"/><circle cx="71" cy="12" r=".9"/><circle cx="88" cy="30" r="1"/><circle cx="22" cy="40" r=".7"/><circle cx="80" cy="52" r=".8"/></g><path d="M74 10a13 13 0 1 0 14 17 10.5 10.5 0 0 1-14-17z" fill="#f8e7a6"/><path d="M60 24l1.3 2.9 3.1.4-2.3 2.1.6 3.1-2.7-1.6-2.7 1.6.6-3.1-2.3-2.1 3.1-.4z" fill="#f8e7a6"/><g stroke="#e8b04a" stroke-width=".6"><path d="M18 0v28M44 0v18"/></g><path d="M14.6 28h6.8l-.8 12H15.4z" fill="#f2b84b"/><path d="M40.6 18h6.8l-.8 10h-5.2z" fill="#f2b84b"/><path d="M0 104h8V94l3-5 3 5v10h8V84l3-7 3 7v20h10V96a9 9 0 0 1 18 0v8h8V90l3-6 3 6v14h10V92l3-5 3 5v12h12v26H0z" fill="#050a22" opacity=".92"/>');
 const FEAST=svgUri(100,130,'<path d="M0 6l100 0" stroke="#fff" stroke-width=".8" opacity=".5"/><path d="M0 4h14l-7 14zM14 4h14l-7 14zM28 4h14l-7 14zM42 4h14l-7 14zM56 4h14l-7 14zM70 4h14l-7 14zM84 4h16l-8 14z" fill="#ffd45e" opacity=".9"/><path d="M14 4h14l-7 14zM42 4h14l-7 14zM70 4h14l-7 14z" fill="#7be3c4"/><g opacity=".85"><circle cx="16" cy="52" r="2.2" fill="#fff"/><circle cx="76" cy="44" r="2.6" fill="#ffd45e"/><circle cx="48" cy="72" r="2" fill="#7be3c4"/><circle cx="86" cy="86" r="2.4" fill="#fff"/><circle cx="24" cy="98" r="2.6" fill="#ffd45e"/><circle cx="62" cy="108" r="2" fill="#7be3c4"/></g><path d="M50 34l1.5 3.3 3.5.4-2.6 2.4.7 3.5-3.1-1.8-3.1 1.8.7-3.5-2.6-2.4 3.5-.4z" fill="#fff" opacity=".9"/><path d="M82 64l1.1 2.4 2.6.3-1.9 1.7.5 2.6-2.3-1.3-2.3 1.3.5-2.6-1.9-1.7 2.6-.3z" fill="#ffd45e"/>');
 const ITEMS=[
  {id:'bg_dune',kind:'bg',cost:30,css:'linear-gradient(160deg,#e9b26a,#7d3f2b)'},
  {id:'bg_night',kind:'bg',cost:30,css:'radial-gradient(circle at 22% 24%,#fff 0 1px,transparent 2px),radial-gradient(circle at 72% 18%,#fff 0 1.2px,transparent 2.4px),radial-gradient(circle at 82% 62%,rgba(255,255,255,.7) 0 1px,transparent 2px),linear-gradient(160deg,#25316e,#080c24)'},
  {id:'bg_garden',kind:'bg',cost:30,css:'linear-gradient(160deg,#5fbf8a,#124c3a)'},
  {id:'bg_dawn',kind:'bg',cost:40,css:'linear-gradient(180deg,#ffd29a,#f08fa0 55%,#6d5aa8)'},
  {id:'bg_sea',kind:'bg',cost:40,css:'linear-gradient(180deg,#8fe3f0,#1b78a8 58%,#0b3358)'},
  {id:'bg_rose',kind:'bg',cost:40,css:'radial-gradient(circle at 70% 28%,#ffc2d1,#d6587b 55%,#5b1f3f)'},
  {id:'bg_geo',kind:'bg',cost:60,css:'radial-gradient(circle,#f2cf75 0 1.6px,transparent 2.2px) 0 0/16px 16px,repeating-conic-gradient(#0f6a57 0 25%,#137d68 0 50%) 0 0/16px 16px'},
  {id:'bg_gold',kind:'bg',cost:80,reward:{type:'streak',n:14},css:'radial-gradient(circle at 30% 24%,#fff3b8,#e2b04a 46%,#8a5a14)'},
  {id:'fr_gold',kind:'fr',cost:50,css:'0 0 0 3px #f4c95d,0 0 14px rgba(244,201,93,.55)'},
  {id:'fr_emerald',kind:'fr',cost:50,css:'0 0 0 3px #37d6a3,0 0 14px rgba(55,214,163,.5)'},
  {id:'fr_amethyst',kind:'fr',cost:60,css:'0 0 0 3px #a78bfa,0 0 14px rgba(167,139,250,.55)'},
  {id:'fr_nur',kind:'fr',cost:80,reward:{type:'level',n:10},css:'0 0 0 3px #fff,0 0 0 6px #8cebd0,0 0 18px rgba(140,235,208,.6)'},
  {id:'ac_star',kind:'ac',cost:45,svg:'star'},
  {id:'ac_moon',kind:'ac',cost:45,svg:'moon'},
  {id:'ac_leaf',kind:'ac',cost:45,svg:'leaf'},
  {id:'ac_lamp',kind:'ac',cost:55,svg:'lamp'},
  {id:'ac_book',kind:'ac',cost:55,reward:{type:'stages',n:10},svg:'book'},
  {id:'ac_heart',kind:'ac',cost:55,svg:'heart'},
  {id:'bg_ramadan',kind:'bg',cost:50,season:'ramadan',css:NIGHT+' center/cover no-repeat,linear-gradient(180deg,#1d2f78,#0a1030)'},
  {id:'fr_ramadan',kind:'fr',cost:60,season:'ramadan',css:'0 0 0 3px #e8b04a,0 0 0 6px #1f8f78,0 0 18px rgba(232,176,74,.55)'},
  {id:'ac_fanus',kind:'ac',cost:50,season:'ramadan',svg:'fanus'},
  {id:'ac_mosque',kind:'ac',cost:50,season:'ramadan',svg:'mosque'},
  {id:'bg_eid',kind:'bg',cost:50,season:'eid',css:FEAST+' center/cover no-repeat,linear-gradient(160deg,#ff9a6a,#c9407f 55%,#4f2a86)'},
  {id:'fr_eid',kind:'fr',cost:60,season:'eid',css:'0 0 0 3px #ffd45e,0 0 0 6px #ff7aa8,0 0 18px rgba(255,122,168,.55)'},
  {id:'ac_candy',kind:'ac',cost:45,season:'eid',svg:'candy'},
  {id:'ac_gift',kind:'ac',cost:45,season:'eid',svg:'gift'}
 ];
 const IT3={
  tr:{bg_ramadan:'Ramazan Gecesi',fr_ramadan:'Ramazan Işığı',ac_fanus:'Fanus',ac_mosque:'Cami',bg_eid:'Bayram Şenliği',fr_eid:'Bayram Işıltısı',ac_candy:'Bayram Şekeri',ac_gift:'Hediye'},
  en:{bg_ramadan:'Ramadan Night',fr_ramadan:'Ramadan Glow',ac_fanus:'Ramadan Lantern',ac_mosque:'Mosque',bg_eid:'Eid Festival',fr_eid:'Eid Sparkle',ac_candy:'Eid Candy',ac_gift:'Gift'},
  de:{bg_ramadan:'Ramadan-Nacht',fr_ramadan:'Ramadan-Glanz',ac_fanus:'Ramadan-Laterne',ac_mosque:'Moschee',bg_eid:'Eid-Fest',fr_eid:'Eid-Funkeln',ac_candy:'Eid-Bonbon',ac_gift:'Geschenk'},
  fr:{bg_ramadan:'Nuit du Ramadan',fr_ramadan:'Éclat du Ramadan',ac_fanus:'Lanterne',ac_mosque:'Mosquée',bg_eid:'Fête de l’Aïd',fr_eid:'Éclat de l’Aïd',ac_candy:'Bonbon de l’Aïd',ac_gift:'Cadeau'},
  ar:{bg_ramadan:'ليلة رمضان',fr_ramadan:'نور رمضان',ac_fanus:'فانوس',ac_mosque:'مسجد',bg_eid:'فرحة العيد',fr_eid:'بهجة العيد',ac_candy:'حلوى العيد',ac_gift:'هدية'}
 };
 const IT2={
  tr:{bg_dawn:'Fecr',bg_sea:'Deniz',bg_rose:'Gül',bg_geo:'Geometri',bg_gold:'Altın',fr_gold:'Altın',fr_emerald:'Zümrüt',fr_amethyst:'Ametist',fr_nur:'Nur',ac_lamp:'Fener',ac_book:'Kitap',ac_heart:'Kalp'},
  en:{bg_dawn:'Dawn',bg_sea:'Sea',bg_rose:'Rose',bg_geo:'Pattern',bg_gold:'Gold',fr_gold:'Gold',fr_emerald:'Emerald',fr_amethyst:'Amethyst',fr_nur:'Light',ac_lamp:'Lantern',ac_book:'Book',ac_heart:'Heart'},
  de:{bg_dawn:'Morgenrot',bg_sea:'Meer',bg_rose:'Rosé',bg_geo:'Muster',bg_gold:'Gold',fr_gold:'Gold',fr_emerald:'Smaragd',fr_amethyst:'Amethyst',fr_nur:'Licht',ac_lamp:'Laterne',ac_book:'Buch',ac_heart:'Herz'},
  fr:{bg_dawn:'Aube',bg_sea:'Mer',bg_rose:'Rose',bg_geo:'Motif',bg_gold:'Or',fr_gold:'Or',fr_emerald:'Émeraude',fr_amethyst:'Améthyste',fr_nur:'Lumière',ac_lamp:'Lanterne',ac_book:'Livre',ac_heart:'Cœur'},
  ar:{bg_dawn:'الفجر',bg_sea:'البحر',bg_rose:'الورد',bg_geo:'زخرفة',bg_gold:'الذهب',fr_gold:'ذهبي',fr_emerald:'زمردي',fr_amethyst:'جمشتي',fr_nur:'نور',ac_lamp:'فانوس',ac_book:'كتاب',ac_heart:'قلب'}
 };
 const OUTFIT_LABEL={tr:'Kıyafet',en:'Outfit',de:'Outfit',fr:'Tenue',ar:'ملابس'};
 const FR={tr:'Çerçeve',en:'Frame',de:'Rahmen',fr:'Cadre',ar:'إطار'};
 const itName=id=>(T().it[id]||IT2[lang()][id]||IT3[lang()][id]||id);
 /* Layered outfits: full-body art + transparent clothing layers drawn on the same canvas (512x768).
    Layers come from assets/companions/outfits.json so new art needs no code change. */
 const BODY=['cat','lion','wolf','owl','turtle','eagle'];
 const OUT={list:[],groups:{},loaded:false};
 const bodySrc=id=>'assets/companions/'+id+'/'+id+'_body.webp';
 const outItem=id=>OUT.list.find(o=>o.id===id);
 const outName=o=>(o.name&&(o.name[lang()]||o.name.en||o.name.tr))||o.id;
 const outFor=id=>OUT.list.filter(o=>o.art&&o.art[id]);
 // A free "default" outfit (e.g. thobe) is always worn unless another outfit takes its slot, so the plain body is never shown bare.
 const hasDefault=id=>outFor(id).some(o=>o.default===true);
 const fullBody=id=>BODY.includes(id)&&hasDefault(id);
 function wornOutfit(a){
  const m=meta(),w={};
  outFor(a).filter(o=>o.default===true).forEach(o=>{w[o.slot]=o.id});
  const own=(m&&m.outfit&&m.outfit[a])||{};
  Object.keys(own).forEach(slot=>{const o=outItem(own[slot]);if(o&&o.art&&o.art[a]&&o.slot===slot&&has(o.id))w[slot]=o.id});
  return w;
 }
 function loadOutfits(){
  if(OUT.loaded)return;OUT.loaded=true;
  try{fetch('assets/companions/outfits.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(j=>{
   if(!j||!Array.isArray(j.items))return;
   OUT.groups=j.groups&&typeof j.groups==='object'?j.groups:{};
   OUT.list=j.items.filter(o=>o&&/^ot_[a-z0-9_]+$/.test(o.id||'')&&['head','neck','body','hand'].includes(o.slot)&&o.art&&typeof o.art==='object'&&Number.isFinite(Number(o.cost)));
   OUT.list.forEach(o=>{if(!(o.reward&&['streak','level','stages'].includes(o.reward.type)&&Number(o.reward.n)>0))delete o.reward});
   try{refresh()}catch(_){}
  }).catch(()=>{})}catch(_){}
 }
 const S={
  tr:{sg:{ramadan:'🌙 Hayırlı Ramazanlar',eid:'🎉 Bayramınız mübarek olsun'},sleft:n=>n>0?n+' gün kaldı':'Son gün',sopen:'Mevsimlik eşyalar şimdi açık.',sl:{ramadan:'Ramazan’da açılır',eid:'Bayramda açılır'},sltoast:{ramadan:'Bu eşya Ramazan ayında alınabilir.',eid:'Bu eşya bayram günlerinde alınabilir.'},tabCombos:'Kombin',saveLook:'Bunu kaydet',slotEmpty:'Boş yuva',slotN:n=>'Kombin '+n,applyL:'Giy',delL:'Sil',comboSaved:'Kombin kaydedildi',comboNeedOwn:'Önce eşyaları satın al ya da kaydet',comboHint:'Giydiğin görünümü bir yuvaya kaydet; sonra tek dokunuşla giy.',reqToast:r=>'Açmak için: '+r,rewardNew:n=>'Yeni ödül: '+n,rs:{streak:n=>n+' günlük seri',level:n=>'Seviye '+n,stages:n=>n+' ders'},tabShop:'Mağaza',tabCloset:'Gardırobum',save:'Kaydet',saved:'Kaydedildi',unsaved:'Kaydetmeden çıkmak için tekrar dokun',emptyCloset:'Henüz bir şeyin yok. Mağazadan alabilirsin.',undoL:'Geri al',redoL:'İleri al',closeL:'Kapat',pickHint:'Bir eşya seç; satın almadan önce üstünde dene.',ownedL:'Sende',tryOn:'Önizleme',fresh:'Yeni',next:(a,n,x)=>'Sıradaki: '+a+' · Seviye '+n+' (' + x + ' XP kaldı)',all:'Tüm hayvanlar açık!',cele:'Yeni yol arkadaşı!',keep:'Şimdilik kalsın',room:'Hayvan Odası',animals:'Hayvanlar',wardrobe:'Gardırop',lv:n=>'Seviye '+n,locked:n=>'Seviye '+n+' ile açılır',use:'Seç',active:'Seçili',
   unlock:(a,n)=>a+' açıldı! Hayvan Odası’ndan seçebilirsin.',lockedToast:(a,n)=>a+' için seviye '+n+' gerekiyor.',bg:'Arka plan',ac:'Rozet',none:'Yok',
   buy:c=>c+' ◇ ile al',equip:'Tak',off:'Çıkar',on:'Takılı',need:'Yeterli Pırıltı yok',bought:'Gardıroba eklendi',
   hint:'Pırıltıyı günlük ve haftalık sandıklardan, serilerden ve derslerden kazanırsın.',
   it:{bg_dune:'Çöl',bg_night:'Gece',bg_garden:'Bahçe',ac_star:'Yıldız',ac_moon:'Hilal',ac_leaf:'Yaprak'}},
  en:{sg:{ramadan:'🌙 Ramadan Mubarak',eid:'🎉 Eid Mubarak'},sleft:n=>n>0?n+' days left':'Last day',sopen:'Seasonal items are open now.',sl:{ramadan:'Opens in Ramadan',eid:'Opens at Eid'},sltoast:{ramadan:'This item can be bought during Ramadan.',eid:'This item can be bought during Eid.'},tabCombos:'Outfits',saveLook:'Save look',slotEmpty:'Empty slot',slotN:n=>'Outfit '+n,applyL:'Wear',delL:'Delete',comboSaved:'Outfit saved',comboNeedOwn:'Buy or save the items first',comboHint:'Save your current look in a slot, then wear it with one tap.',reqToast:r=>'Unlock with: '+r,rewardNew:n=>'New reward: '+n,rs:{streak:n=>n+'-day streak',level:n=>'Level '+n,stages:n=>n+' lessons'},tabShop:'Shop',tabCloset:'My closet',save:'Save',saved:'Saved',unsaved:'Tap again to leave without saving',emptyCloset:'Nothing here yet. Get items from the shop.',undoL:'Undo',redoL:'Redo',closeL:'Close',pickHint:'Pick an item to try it on before you buy.',ownedL:'Owned',tryOn:'Preview',fresh:'New',next:(a,n,x)=>'Next: '+a+' · Level '+n+' ('+x+' XP to go)',all:'All animals unlocked!',cele:'New companion!',keep:'Maybe later',room:'Animal Room',animals:'Animals',wardrobe:'Wardrobe',lv:n=>'Level '+n,locked:n=>'Unlocks at level '+n,use:'Choose',active:'Chosen',
   unlock:a=>a+' unlocked! You can choose it in the Animal Room.',lockedToast:(a,n)=>a+' unlocks at level '+n+'.',bg:'Backdrop',ac:'Badge',none:'None',
   buy:c=>'Get for '+c+' ◇',equip:'Wear',off:'Remove',on:'Worn',need:'Not enough Sparkles',bought:'Added to your wardrobe',
   hint:'You earn Sparkles from daily and weekly chests, streaks and lessons.',
   it:{bg_dune:'Desert',bg_night:'Night',bg_garden:'Garden',ac_star:'Star',ac_moon:'Crescent',ac_leaf:'Leaf'}},
  de:{sg:{ramadan:'🌙 Ramadan Mubarak',eid:'🎉 Eid Mubarak'},sleft:n=>n>0?'Noch '+n+' Tage':'Letzter Tag',sopen:'Saisonteile sind jetzt freigeschaltet.',sl:{ramadan:'Öffnet im Ramadan',eid:'Öffnet zum Eid'},sltoast:{ramadan:'Dieses Teil gibt es im Ramadan.',eid:'Dieses Teil gibt es zum Eid-Fest.'},tabCombos:'Outfits',saveLook:'Speichern',slotEmpty:'Leerer Platz',slotN:n=>'Outfit '+n,applyL:'Anziehen',delL:'Löschen',comboSaved:'Outfit gespeichert',comboNeedOwn:'Hol oder speichere die Teile zuerst',comboHint:'Speichere deinen Look in einem Platz und zieh ihn mit einem Tipp an.',reqToast:r=>'Freischalten mit: '+r,rewardNew:n=>'Neue Belohnung: '+n,rs:{streak:n=>n+'-Tage-Serie',level:n=>'Stufe '+n,stages:n=>n+' Lektionen'},tabShop:'Shop',tabCloset:'Mein Schrank',save:'Speichern',saved:'Gespeichert',unsaved:'Erneut tippen, um ohne Speichern zu verlassen',emptyCloset:'Noch nichts da. Hol dir Teile im Shop.',undoL:'Rückgängig',redoL:'Wiederholen',closeL:'Schließen',pickHint:'Wähle ein Teil und probiere es vor dem Kauf an.',ownedL:'Im Besitz',tryOn:'Vorschau',fresh:'Neu',next:(a,n,x)=>'Als Nächstes: '+a+' · Stufe '+n+' (noch '+x+' XP)',all:'Alle Tiere freigeschaltet!',cele:'Neuer Begleiter!',keep:'Vielleicht später',room:'Tierzimmer',animals:'Tiere',wardrobe:'Garderobe',lv:n=>'Stufe '+n,locked:n=>'Ab Stufe '+n,use:'Wählen',active:'Gewählt',
   unlock:a=>a+' freigeschaltet! Du kannst es im Tierzimmer wählen.',lockedToast:(a,n)=>a+' wird auf Stufe '+n+' freigeschaltet.',bg:'Hintergrund',ac:'Abzeichen',none:'Keins',
   buy:c=>'Für '+c+' ◇ holen',equip:'Anlegen',off:'Ablegen',on:'Getragen',need:'Nicht genug Funken',bought:'Zur Garderobe hinzugefügt',
   hint:'Funken verdienst du mit täglichen und wöchentlichen Truhen, Serien und Lektionen.',
   it:{bg_dune:'Wüste',bg_night:'Nacht',bg_garden:'Garten',ac_star:'Stern',ac_moon:'Halbmond',ac_leaf:'Blatt'}},
  fr:{sg:{ramadan:'🌙 Ramadan Moubarak',eid:'🎉 Aïd Moubarak'},sleft:n=>n>0?n+' jours restants':'Dernier jour',sopen:'Les articles de saison sont ouverts.',sl:{ramadan:'S’ouvre pendant le Ramadan',eid:'S’ouvre à l’Aïd'},sltoast:{ramadan:'Cet article s’obtient pendant le Ramadan.',eid:'Cet article s’obtient pendant l’Aïd.'},tabCombos:'Tenues',saveLook:'Enregistrer',slotEmpty:'Emplacement vide',slotN:n=>'Tenue '+n,applyL:'Porter',delL:'Supprimer',comboSaved:'Tenue enregistrée',comboNeedOwn:'Prends ou enregistre d’abord les articles',comboHint:'Enregistre ton look dans un emplacement, puis porte-le d’un seul toucher.',reqToast:r=>'Pour débloquer : '+r,rewardNew:n=>'Nouvelle récompense : '+n,rs:{streak:n=>'série de '+n+' jours',level:n=>'niveau '+n,stages:n=>n+' leçons'},tabShop:'Boutique',tabCloset:'Ma garde-robe',save:'Enregistrer',saved:'Enregistré',unsaved:'Touche à nouveau pour quitter sans enregistrer',emptyCloset:'Rien ici pour l’instant. Prends des articles à la boutique.',undoL:'Annuler',redoL:'Rétablir',closeL:'Fermer',pickHint:'Choisis un article et essaie-le avant de l’acheter.',ownedL:'Possédé',tryOn:'Aperçu',fresh:'Nouveau',next:(a,n,x)=>'Prochain : '+a+' · niveau '+n+' ('+x+' XP restants)',all:'Tous les animaux sont débloqués !',cele:'Nouveau compagnon !',keep:'Plus tard',room:'Salle des animaux',animals:'Animaux',wardrobe:'Garde-robe',lv:n=>'Niveau '+n,locked:n=>'Se débloque au niveau '+n,use:'Choisir',active:'Choisi',
   unlock:a=>a+' débloqué ! Tu peux le choisir dans la salle des animaux.',lockedToast:(a,n)=>a+' se débloque au niveau '+n+'.',bg:'Décor',ac:'Badge',none:'Aucun',
   buy:c=>'Obtenir pour '+c+' ◇',equip:'Porter',off:'Retirer',on:'Porté',need:'Pas assez d’étincelles',bought:'Ajouté à la garde-robe',
   hint:'Tu gagnes des étincelles avec les coffres quotidiens et hebdomadaires, les séries et les leçons.',
   it:{bg_dune:'Désert',bg_night:'Nuit',bg_garden:'Jardin',ac_star:'Étoile',ac_moon:'Croissant',ac_leaf:'Feuille'}},
  ar:{sg:{ramadan:'🌙 رمضان مبارك',eid:'🎉 عيد مبارك'},sleft:n=>n>0?'باقٍ '+n+' أيام':'اليوم الأخير',sopen:'القطع الموسمية متاحة الآن.',sl:{ramadan:'يُفتح في رمضان',eid:'يُفتح في العيد'},sltoast:{ramadan:'يمكن الحصول على هذه القطعة في رمضان.',eid:'يمكن الحصول على هذه القطعة في العيد.'},tabCombos:'إطلالات',saveLook:'احفظ',slotEmpty:'خانة فارغة',slotN:n=>'إطلالة '+n,applyL:'ارتداء',delL:'حذف',comboSaved:'تم حفظ الإطلالة',comboNeedOwn:'احصل على القطع أو احفظها أولاً',comboHint:'احفظ إطلالتك في خانة ثم ارتدها بلمسة واحدة.',reqToast:r=>'للفتح: '+r,rewardNew:n=>'مكافأة جديدة: '+n,rs:{streak:n=>'سلسلة من '+n+' يومًا',level:n=>'المستوى '+n,stages:n=>n+' درسًا'},tabShop:'المتجر',tabCloset:'خزانتي',save:'حفظ',saved:'تم الحفظ',unsaved:'اضغط مرة أخرى للخروج دون حفظ',emptyCloset:'لا شيء هنا بعد. احصل على قطع من المتجر.',undoL:'تراجع',redoL:'إعادة',closeL:'إغلاق',pickHint:'اختر قطعة وجرّبها قبل الشراء.',ownedL:'مملوك',tryOn:'معاينة',fresh:'جديد',next:(a,n,x)=>'التالي: '+a+' · المستوى '+n+' (باقي '+x+' نقطة خبرة)',all:'تم فتح جميع الحيوانات!',cele:'رفيق جديد!',keep:'لاحقًا',room:'غرفة الحيوانات',animals:'الحيوانات',wardrobe:'خزانة الملابس',lv:n=>'المستوى '+n,locked:n=>'يُفتح عند المستوى '+n,use:'اختيار',active:'مختار',
   unlock:a=>'تم فتح '+a+'! يمكنك اختياره من غرفة الحيوانات.',lockedToast:(a,n)=>a+' يُفتح عند المستوى '+n+'.',bg:'الخلفية',ac:'شارة',none:'بدون',
   buy:c=>'احصل عليه بـ '+c+' ◇',equip:'ارتداء',off:'إزالة',on:'مرتدى',need:'لا تكفي الشرارات',bought:'أُضيف إلى الخزانة',
   hint:'تكسب الشرارات من الصناديق اليومية والأسبوعية والسلاسل والدروس.',
   it:{bg_dune:'الصحراء',bg_night:'الليل',bg_garden:'الحديقة',ac_star:'نجمة',ac_moon:'هلال',ac_leaf:'ورقة'}}
 };
 const NAMES={
  tr:{lion:'Aslan',cat:'Kedi',wolf:'Kurt',owl:'Baykuş',turtle:'Kaplumbağa',eagle:'Kartal'},
  en:{lion:'Lion',cat:'Cat',wolf:'Wolf',owl:'Owl',turtle:'Turtle',eagle:'Eagle'},
  de:{lion:'Löwe',cat:'Katze',wolf:'Wolf',owl:'Eule',turtle:'Schildkröte',eagle:'Adler'},
  fr:{lion:'Lion',cat:'Chat',wolf:'Loup',owl:'Chouette',turtle:'Tortue',eagle:'Aigle'},
  ar:{lion:'الأسد',cat:'القط',wolf:'الذئب',owl:'البومة',turtle:'السلحفاة',eagle:'النسر'}
 };
 const lang=()=>{const l=window.DEEN_APP_LOCALE?.get?.()||'tr';return S[l]?l:'en'};
 const T=()=>S[lang()],N=id=>NAMES[lang()][id]||id;
 const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const app=()=>{try{return typeof state!=='undefined'&&state&&typeof state==='object'?state:null}catch(_){return null}};
 const lvl=()=>{try{return Math.max(1,Number(level(app().xp||0).n)||1)}catch(_){return 1}};
 function xpFor(n){let b=0,span=300;for(let k=2;k<=n;k++){b+=span;span=300+k*100-100+0}return b}
 function nextLock(){const l=lvl();return ORDER.filter(id=>LEVELS[id]>l&&!unlocked(id)).sort((a,b)=>LEVELS[a]-LEVELS[b])[0]||null}
 function meta(){
  const st=app();if(!st)return null;
  const m=st.companionMeta=st.companionMeta&&typeof st.companionMeta==='object'?st.companionMeta:{};
  if(!Array.isArray(m.seen))m.seen=[];
  if(!Array.isArray(m.owned))m.owned=[];
  if(!Array.isArray(m.items))m.items=[];
  if(!m.eq||typeof m.eq!=='object')m.eq={};
  const cur=String(st.profile?.companion||'');
  if(ORDER.includes(cur)&&!m.owned.includes(cur))m.owned.push(cur); // grandfather earlier choices
  return m;
 }
 // Admin test switch (admin panel): everything counts as unlocked and owned, but nothing is saved as owned.
 const adminAll=()=>{try{return !!window.DEEN_ADMIN_WARDROBE?.()}catch(_){return false}};
 function unlockedReal(id){
  const m=meta();if(!LEVELS[id])return false;
  return LEVELS[id]<=lvl()||!!(m&&m.owned.includes(id));
 }
 function unlocked(id){return !!LEVELS[id]&&(adminAll()||unlockedReal(id))}
 // Owned = bought, a free default outfit, or admin test mode. Worn items that are not owned (admin mode switched off) are ignored.
 /* ---- Seasons: Ramadan and the two Eids, from the device's own Hijri calendar (Umm al-Qura, calculation based: it can differ by a day from the moon-sighting calendar). ---- */
 const HJ=(()=>{try{return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'numeric',year:'numeric'})}catch(_){return null}})();
 function hijri(d){if(!HJ)return null;try{const p=HJ.formatToParts(d),g=t=>Number((p.find(x=>x.type===t)||{}).value);const m=g('month'),dd=g('day');return m&&dd?{m,d:dd}:null}catch(_){return null}}
 const seasonOf=h=>!h?null:(h.m===9?'ramadan':((h.m===10&&h.d<=4)||(h.m===12&&h.d>=10&&h.d<=13))?'eid':null);
 function seasonFor(date){
  const id=seasonOf(hijri(date));if(!id)return null;
  let left=0;for(let i=1;i<=40;i++){if(seasonOf(hijri(new Date(date.getTime()+i*864e5)))!==id)break;left=i}
  return {id,left};
 }
 let seasonCache={k:'',v:null};
 function season(){
  let f='';try{f=window.DEEN_ADMIN_SEASON?.()||''}catch(_){}
  if(f==='ramadan'||f==='eid')return {id:f,left:7};
  const d=new Date(),k=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();
  if(seasonCache.k!==k)seasonCache={k,v:seasonFor(d)};
  return seasonCache.v;
 }
 const seasonOpen=it=>!it.season||adminAll()||(season()&&season().id===it.season);
 /* Rewards: an item with reward:{type,n} cannot be bought; it opens when the player reaches the goal (best streak, level or lessons done). */
 function rewardValue(r){
  const st=app();if(!st||!r)return 0;
  if(r.type==='level')return lvl();
  if(r.type==='stages')return Array.isArray(st.completed)?st.completed.length:0;
  const sm=st.streakMeta||{},m=meta();
  return Math.max(Number(sm.longestStreak)||0,Number(sm.currentStreak)||0,Number(st.streak)||0,Number(m&&m.bestStreak)||0);
 }
 const earned=it=>!!(it&&it.reward&&rewardValue(it.reward)>=Number(it.reward.n));
 const reqText=it=>{const f=T().rs[it.reward.type];return f?f(Number(it.reward.n)):''};
 function has(id){const m=meta(),it=item(id);return !!it&&(adminAll()||it.default===true||!!(m&&m.items.includes(id))||earned(it))}
 const eqItem=(m,kind)=>{const it=item(m?.eq?.[kind]);return it&&has(it.id)?it:null};
 function save(){try{saveState()}catch(_){}}
 function announce(){
  const st=app(),m=meta();if(!st||!m||!st.onboarded)return;
  const fresh=ORDER.filter(id=>unlockedReal(id)&&!m.seen.includes(id));
  if(!fresh.length)return;
  const first=!m.seen.length&&!m.announced;
  fresh.forEach(id=>m.seen.push(id));
  if(first){m.announced=1;save();return} // first run: record what is already open without a toast
  m.announced=1;save();
  const last=fresh[fresh.length-1];
  m.fresh=(Array.isArray(m.fresh)?m.fresh:[]).concat(fresh).filter((x,i,arr)=>arr.indexOf(x)===i);save(); // shown as "new" in the Animal Room; never pops a modal over other screens
  try{toast(T().unlock(N(last)))}catch(_){}
 }
 function announceRewards(){
  const st=app(),m=meta();if(!st||!m||!st.onboarded||!OUT.loaded)return;
  const sm=st.streakMeta||{},cur=Math.max(Number(sm.longestStreak)||0,Number(sm.currentStreak)||0,Number(st.streak)||0);
  if(cur>(Number(m.bestStreak)||0)){m.bestStreak=cur;save()}
  if(!OUT.list.length)return;
  const all=ITEMS.concat(OUT.list).filter(i=>i.reward&&earned(i)).map(i=>i.id);
  if(!Array.isArray(m.rewardSeen)){m.rewardSeen=all.slice();save();return} // first run: what is already earned is recorded without a toast
  const fresh=all.filter(id=>!m.rewardSeen.includes(id));if(!fresh.length)return;
  fresh.forEach(id=>m.rewardSeen.push(id));save();
  const it=item(fresh[fresh.length-1]);try{toast(T().rewardNew(it.slot?outName(it):itName(it.id)))}catch(_){}
 }
 function select(id){
  const st=app();if(!st||!unlocked(id))return false;
  st.profile=st.profile||{};st.profile.companion=id;
  const m=meta();if(m&&!m.owned.includes(id))m.owned.push(id);
  save();try{updateUI()}catch(_){}
  return true;
 }
 /* Wardrobe */
 function item(id){return ITEMS.find(i=>i.id===id)||outItem(id)}
 function buyItem(id){
  const st=app(),m=meta(),it=item(id);if(!st||!m||!it||m.items.includes(id)||it.default===true||(it.reward&&!earned(it)&&!adminAll())||!seasonOpen(it))return false;
  if(adminAll()){if(it.slot)toggleItem(id);else m.eq[it.kind]=id;save();return true} // admin test: free; worn but never saved as bought, so it disappears when the switch is turned off
  if((Number(st.currency)||0)<it.cost)return false;
  st.currency-=it.cost;m.items.push(id);
  if(it.slot)toggleItem(id);else m.eq[it.kind]=id;
  save();try{updateUI()}catch(_){}
  return true;
 }
 function toggleItem(id){
  const m=meta(),it=item(id);if(!m||!it||!has(id))return;
  if(it.slot){ // outfit: worn per animal and slot
   const a=String(app()?.profile?.companion||'');if(!a||!it.art||!it.art[a])return;
   const o=m.outfit=m.outfit&&typeof m.outfit==='object'?m.outfit:{};const w=o[a]=o[a]||{};
   if(it.default===true){delete w[it.slot];save();return} // putting the default back
   if(w[it.slot]===id)delete w[it.slot];else w[it.slot]=id;save();return;
  }
  if(m.eq[it.kind]===id)delete m.eq[it.kind];else m.eq[it.kind]=id;save();
 }
 const avatarSrc=id=>'assets/companions/'+id+'/'+id+'_avatar.png';
 function badgeHtml(ac){return ac?'<i class="dcz-badge" aria-hidden="true">'+ICON[ac.svg]+'</i>':''}
 /* ---------- Animal Room: a full-screen page (not a bottom sheet) ----------
    Left/top: big stage with the animal. Bottom: panel with tabs (Shop / My closet / Animals), category icons and a 3-column grid.
    Tapping an item only PREVIEWS it (a draft); Save buys what is not owned yet and equips everything at once. Undo/redo step through the draft. */
 let tab='shop',cat='ot',catUser=false,freshShown=[],draft={},hist=[],fut=[],leaving=false,warned=false,room=null,onKey=null;
 const svgI=(d,w)=>'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="'+(w||1.8)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';
 const IC={
  hanger:svgI('<path d="M12 7.5a2.2 2.2 0 1 0-2.2-2.2M12 7.5v1.6l8 5.4a1.6 1.6 0 0 1-.9 2.9H4.9a1.6 1.6 0 0 1-.9-2.9l8-5.4"/>'),
  picture:svgI('<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 3.5 3 3-2.5 4.5 4"/>'),
  frame:svgI('<rect x="4" y="4" width="16" height="16" rx="3"/><rect x="8" y="8" width="8" height="8" rx="1.5"/>'),
  star:svgI('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.8z"/>'),
  bag:svgI('<path d="M5 8h14l-1 11.5a1.5 1.5 0 0 1-1.5 1.4h-9A1.5 1.5 0 0 1 6 19.5zM9 8V6.5a3 3 0 0 1 6 0V8"/>'),
  heart:svgI('<path d="M12 20s-7.5-4.7-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10C19.5 15.3 12 20 12 20z"/>'),
  paw:svgI('<circle cx="7.5" cy="10" r="1.8"/><circle cx="12" cy="7.5" r="1.8"/><circle cx="16.5" cy="10" r="1.8"/><path d="M12 12.5c-3 0-5 2.3-5 4.2 0 1.6 1.4 2.3 3 2 .8-.2 1.3-.4 2-.4s1.2.2 2 .4c1.6.3 3-.4 3-2 0-1.9-2-4.2-5-4.2z"/>'),
  undo:svgI('<path d="M9 6L5 10l4 4"/><path d="M5 10h8.5a5 5 0 0 1 0 10H11"/>',2),
  redo:svgI('<path d="M15 6l4 4-4 4"/><path d="M19 10h-8.5a5 5 0 0 0 0 10H13"/>',2),
  close:svgI('<path d="M6 6l12 12M18 6L6 18"/>',2.4)
 };
 const CAT_ICON={ot:'hanger',bg:'picture',fr:'frame',ac:'star'};
 const slotKey=it=>it.slot?'o:'+it.slot:it.kind;
 const curAnimal=()=>{const c=String(app()?.profile?.companion||'');return ORDER.includes(c)?c:'lion'};
 const hasOwn=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
 function wornId(key,a,m){return key.startsWith('o:')?(wornOutfit(a)[key.slice(2)]||''):(eqItem(m,key)?.id||'')}
 function defaultId(key,a){if(!key.startsWith('o:'))return '';const d=outFor(a).find(o=>o.slot===key.slice(2)&&o.default===true);return d?d.id:''}
 const effId=(key,a,m)=>hasOwn(draft,key)?draft[key]:wornId(key,a,m);
 function setDraft(key,id,a,m){ // id '' = take it off
  const before=JSON.stringify(draft);
  if(id===wornId(key,a,m))delete draft[key];else draft[key]=id;
  const now=JSON.stringify(draft);
  if(now!==before){hist.push(before);fut=[]}
 }
 function draftCost(){return Object.values(draft).filter(id=>id&&!has(id)).reduce((n,id)=>n+(Number(item(id)?.cost)||0),0)}
 function catsFor(a){return (fullBody(a)&&outFor(a).length?['ot']:[]).concat(['bg','fr','ac'])}
 function catItems(k,a){return k==='ot'?outFor(a):ITEMS.filter(i=>i.kind===k)}
 function itemName(it){return it.slot?outName(it):itName(it.id)}
 function insetShadow(css){const parts=[];let d=0,cur='';for(const ch of css){if(ch==='(')d++;if(ch===')')d--;if(ch===','&&d===0){parts.push(cur);cur=''}else cur+=ch}parts.push(cur);return parts.map(x=>'inset '+x.trim()).join(',')}
 /* the animal on the stage: what is saved, with the draft laid over it */
 function charHtml(a,m,eff,cls){
  eff=eff||(k=>effId(k,a,m));
  const full=fullBody(a),get=k=>{const id=eff(k);return id?item(id):null};
  const ac=get('ac');let inner;
  if(full){
   const ov={};['head','neck','body','hand'].forEach(sl=>{const o=outItem(eff('o:'+sl));if(o&&o.art&&o.art[a]&&o.slot===sl)ov[sl]=o});
   const fullO=ov.body&&ov.body.full===true?ov.body:null,layers=Object.values(ov).filter(o=>o!==fullO).sort((x,y)=>(Number(x.z)||0)-(Number(y.z)||0));
   inner='<img class="dcz-base" src="'+esc(fullO?fullO.art[a]:bodySrc(a))+'" alt="">'+layers.map(o=>'<img class="dcz-layer" data-slot="'+o.slot+'" style="z-index:'+(Number(o.z)||10)+'" src="'+esc(o.art[a])+'" alt="">').join('');
  }else inner='<img class="dcz-base dcz-av" src="'+avatarSrc(a)+'" alt="">';
  return '<div class="'+(cls||'dcz-char')+'">'+inner+(ac?'<i class="dcz-badge dcz-bdg" aria-hidden="true">'+ICON[ac.svg]+'</i>':'')+'</div>';
 }
 function tileHtml(it,a,m,t){
  const key=slotKey(it),sel=effId(key,a,m)===it.id,saved=wornId(key,a,m)===it.id,own=has(it.id);
  const th=it.slot?'<img src="'+esc(it.art[a])+'" alt="">':it.kind==='ac'?'<span class="dcz-ico">'+ICON[it.svg]+'</span>':it.kind==='bg'?'<span class="dcz-sw" data-dcz-bg="'+it.id+'"></span>':'<span class="dcz-ring" data-dcz-fr="'+it.id+'"></span>';
  return '<button type="button" class="dcz-tile'+(sel?' sel':'')+(saved?' saved':'')+(own?'':' lock')+((it.reward||!seasonOpen(it))&&!own?' rw':'')+'" data-dcz="tile" data-id="'+esc(it.id)+'" aria-pressed="'+sel+'"><span class="dcz-th">'+th+(sel?'<i class="dcz-ck">✓</i>':'')+(own?'':it.reward?'<i class="dcz-pr dcz-rq">🔒 '+esc(reqText(it))+'</i>':!seasonOpen(it)?'<i class="dcz-pr dcz-rq">'+(it.season==='eid'?'🎉 ':'🌙 ')+esc(t.sl[it.season])+'</i>':'<i class="dcz-pr">◇ '+Number(it.cost)+'</i>')+(it.season?'<i class="dcz-sz" aria-hidden="true">'+(it.season==='eid'?'🎉':'🌙')+'</i>':'')+'</span><b>'+esc(itemName(it))+'</b></button>';
 }
 function animalTile(id,t,cur){
  const ok=unlocked(id),on=cur===id;
  return '<button type="button" class="dcz-tile an'+(on?' sel':'')+(ok?'':' lock')+'" data-dcz="'+(ok?'pick':'lock')+'" data-id="'+id+'" aria-disabled="'+(ok?'false':'true')+'"><span class="dcz-th dcz-ath"><img src="'+avatarSrc(id)+'" alt=""'+(ok?'':' class="dcz-dim"')+'>'+(ok?'':'<b class="dcz-lk">🔒</b>')+'</span><b>'+esc(N(id))+'</b><small>'+esc(ok?(on?t.active:t.use):t.locked(LEVELS[id]))+'</small>'+(ok&&freshShown.includes(id)?'<em class="dcz-new">'+esc(t.fresh)+'</em>':'')+'</button>';
 }
 /* ---- Outfit slots: save the current look (per animal) and wear it again with one tap ---- */
 const COMBO_KEYS=['bg','fr','ac','o:body','o:head','o:neck','o:hand'],COMBO_SLOTS=3;
 const combosOf=a=>{const m=meta();m.combos=m.combos&&typeof m.combos==='object'?m.combos:{};const l=m.combos[a]=Array.isArray(m.combos[a])?m.combos[a]:[];while(l.length<COMBO_SLOTS)l.push(null);return l};
 function comboPick(c){return k=>c?(c.k&&c.k[k])||(k==='o:body'?defaultId(k,curAnimal()):''):''}
 function saveCombo(i){
  const a=curAnimal(),m=meta(),k={};let bad=false;
  COMBO_KEYS.forEach(key=>{const id=effId(key,a,m);if(id&&id!==defaultId(key,a)){if(!has(id))bad=true;k[key]=id}});
  if(bad){try{toast(T().comboNeedOwn)}catch(_){}return}
  combosOf(a)[i]={k};save();try{toast(T().comboSaved)}catch(_){}paint();
 }
 function applyCombo(i){
  const a=curAnimal(),m=meta(),c=combosOf(a)[i];if(!c)return;
  const nd={};
  COMBO_KEYS.forEach(key=>{
   let id=(c.k&&c.k[key])||(key==='o:body'?defaultId(key,a):'');
   if(id&&(!has(id)||!selOkFor(id,a)))id=key==='o:body'?defaultId(key,a):'';
   if(id!==wornId(key,a,m))nd[key]=id;
  });
  const before=JSON.stringify(draft);
  if(JSON.stringify(nd)!==before){hist.push(before);fut=[];draft=nd}
  warned=false;tab='shop';paint();
 }
 function selOkFor(id,a){const it=item(id);return !!it&&(!it.slot||!!(it.art&&it.art[a]))}
 function delCombo(i){const a=curAnimal();combosOf(a)[i]=null;save();paint()}
 function combosHtml(a,m,t){
  const list=combosOf(a);
  return '<p class="dcz-next">'+esc(t.comboHint)+'</p>'+list.map((c,i)=>{
   if(!c)return '<div class="dcz-slot empty"><div class="dcz-sm">+</div><b>'+esc(t.slotN(i+1))+'</b><button type="button" class="dcz-sbtn" data-dcz="csave" data-id="'+i+'">'+esc(t.saveLook)+'</button></div>';
   return '<div class="dcz-slot"><div class="dcz-sm">'+charHtml(a,m,comboPick(c),'dcz-char dcz-mini')+'</div><b>'+esc(t.slotN(i+1))+'</b><button type="button" class="dcz-sbtn pri" data-dcz="capply" data-id="'+i+'">'+esc(t.applyL)+'</button><button type="button" class="dcz-sbtn" data-dcz="csave" data-id="'+i+'">'+esc(t.saveLook)+'</button><button type="button" class="dcz-sdel" data-dcz="cdel" data-id="'+i+'" aria-label="'+esc(t.delL)+'">✕</button></div>';
  }).join('');
 }
 function setHtml(el,sig,html){if(!el||el.dataset.sig===sig)return false;el.dataset.sig=sig;el.innerHTML=html;return true}
 function paint(){
  if(!room)return;
  const t=T(),st=app(),m=meta(),a=curAnimal(),$=sel=>room.querySelector(sel);
  room.dir=lang()==='ar'?'rtl':'ltr';
  const cats=catsFor(a);if(!catUser||!cats.includes(cat))cat=cats[0]; // outfits can finish loading after the room opened: until the player picks a category by hand, show the first one
  const cost=draftCost(),dirty=Object.keys(draft).length>0,bal=Number(st.currency)||0;
  // top bar
  setHtml($('.dcz-top'),[bal,lvl(),dirty,cost,lang()].join('|'),
   '<button type="button" class="dcz-x" data-dcz="close" aria-label="'+esc(t.closeL)+'">'+IC.close+'</button>'+
   '<span class="dcz-pill">◇ '+bal+' · '+esc(t.lv(lvl()))+'</span>'+
   '<button type="button" class="dcz-save'+(dirty?'':' off')+'" data-dcz="save"'+(dirty?'':' disabled')+'>'+esc(t.save)+(cost>0?' ◇'+cost:'')+'</button>');
  // stage
  const bg=effId('bg',a,m),fr=effId('fr',a,m),stageSig=JSON.stringify([a,draft,wornId('bg',a,m),wornId('fr',a,m),wornId('ac',a,m),wornId('o:body',a,m),wornId('o:head',a,m),wornId('o:neck',a,m),hist.length,fut.length,OUT.list.length,admin()]);
  const stEl=$('.dcz-st');
  if(setHtml(stEl,stageSig,'<div class="dcz-floor"></div>'+charHtml(a,m)+'<div class="dcz-ur"><button type="button" data-dcz="undo" aria-label="'+esc(t.undoL)+'"'+(hist.length?'':' disabled')+'>'+IC.undo+'</button><button type="button" data-dcz="redo" aria-label="'+esc(t.redoL)+'"'+(fut.length?'':' disabled')+'>'+IC.redo+'</button></div>')||true){
   if(bg&&item(bg))stEl.dataset.dczBg=bg;else delete stEl.dataset.dczBg;
   if(fr&&item(fr))stEl.dataset.dczFr=fr;else delete stEl.dataset.dczFr;
  }
  // tabs + categories
  const tabs=[['shop',IC.bag,t.tabShop],['closet',IC.heart,t.tabCloset],['combos',IC.hanger,t.tabCombos],['animals',IC.paw,t.animals]];
  setHtml($('.dcz-tabs3'),tab+'|'+lang(),tabs.map(([k,ic,l])=>'<button type="button" role="tab" class="dcz-tab'+(tab===k?' on':'')+'" data-dcz="tab" data-id="'+k+'" aria-selected="'+(tab===k)+'">'+ic+'<span>'+esc(l)+'</span></button>').join(''));
  const labels={ot:OUTFIT_LABEL[lang()],bg:t.bg,fr:FR[lang()],ac:t.ac};
  setHtml($('.dcz-cats'),tab+'|'+cat+'|'+cats.join(),(tab==='animals'||tab==='combos')?'':cats.map(k=>'<button type="button" role="tab" class="dcz-cat'+(cat===k?' on':'')+'" data-dcz="cat" data-id="'+k+'" aria-label="'+esc(labels[k])+'" aria-selected="'+(cat===k)+'">'+IC[CAT_ICON[k]]+'</button>').join(''));
  $('.dcz-cats').hidden=tab==='animals'||tab==='combos';
  // grid
  const grid=$('.dcz-grid3'),gk=tab+'|'+cat+'|'+a,keep=grid.dataset.gk===gk?grid.scrollTop:0;
  let html;
  if(tab==='combos'){
   html=combosHtml(a,m,t);
  }else if(tab==='animals'){
   const nx=nextLock();
   html=(nx?'<p class="dcz-next">'+esc(t.next(N(nx),LEVELS[nx],Math.max(0,xpFor(LEVELS[nx])-(Number(st.xp)||0))))+'</p>':'<p class="dcz-next">'+esc(t.all)+'</p>')+ORDER.map(id=>animalTile(id,t,a)).join('');
  }else{
   let list=catItems(cat,a);if(tab==='closet')list=list.filter(i=>has(i.id));
   const sz=tab==='shop'?season():null;
   html=(sz?'<p class="dcz-banner">'+esc(t.sg[sz.id])+' · '+esc(t.sleft(sz.left))+'<small>'+esc(t.sopen)+'</small></p>':'')+(list.length?list.map(i=>tileHtml(i,a,m,t)).join('')+'<p class="dcz-hint">'+esc(t.hint)+'</p>':'<p class="dcz-empty">'+esc(t.emptyCloset)+'</p>');
  }
  if(setHtml(grid,gk+'|'+JSON.stringify(draft)+'|'+JSON.stringify(m.combos||{})+'|'+(season()?season().id:'')+'|'+bal+'|'+freshShown.join()+'|'+OUT.list.length+'|'+admin()+'|'+lang(),html)){grid.dataset.gk=gk;grid.scrollTop=keep}
 }
 const refresh=paint;
 const admin=adminAll;

 /* "Coming soon": until the wardrobe is ready, regular users see a red animated notice and a looping dress-up animation.
    The admin test switch (wardrobe on) and open(x,{force:true}) still reach the real room. */
 const WARDROBE_SOON=true;
 const SOON={
  tr:{tag:'Yakında',t:'Hayvan Odası yakında geliyor',s:'Kıyafetler, arka planlar ve çok daha fazlası çok yakında!'},
  en:{tag:'Coming soon',t:'The Animal Room is coming soon',s:'Outfits, backdrops and much more are on the way!'},
  de:{tag:'Bald da',t:'Das Tierzimmer kommt bald',s:'Outfits, Hintergründe und vieles mehr sind bald da!'},
  fr:{tag:'Bientôt',t:'La salle des animaux arrive bientôt',s:'Tenues, fonds et bien plus arrivent bientôt !'},
  ar:{tag:'قريبًا',t:'غرفة الحيوانات قادمة قريبًا',s:'ملابس وخلفيات والمزيد في الطريق!'}
 };
 const soonTx=()=>SOON[lang()]||SOON.en;
 const soonOn=()=>WARDROBE_SOON&&!adminAll();
 const SOON_ANIMALS=['lion','cat','wolf','owl','turtle','eagle'];
 let soonEl=null,soonTimer=null,soonKey=null,soonIdx=0;
 const reducedMotion=()=>!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 function soonPick(){
  const a=SOON_ANIMALS[soonIdx++%SOON_ANIMALS.length];
  const list=OUT.list.filter(o=>o.slot==='body'&&o.full===true&&o.default!==true&&o.art&&o.art[a]);
  const o=list.length?list[Math.floor(Math.random()*list.length)]:null;
  return {a,out:o?o.art[a]:'assets/companions/outfits/'+a+'/ot_thobe_kufi.webp'};
 }
 function soonStep(){
  const box=soonEl&&soonEl.querySelector('.dcz-sc');if(!box)return;
  const p=soonPick();let n=0;
  const done=()=>{if(++n<2||!soonEl||!box.isConnected)return;
   box.innerHTML='<img class="dcz-sc-base" src="'+esc(bodySrc(p.a))+'" alt=""><img class="dcz-sc-out" src="'+esc(p.out)+'" alt="">'+[1,2,3,4,5].map(i=>'<i class="dcz-sp s'+i+'" aria-hidden="true">✦</i>').join('');
   box.dataset.animal=p.a;
  };
  [bodySrc(p.a),p.out].forEach(u=>{const i=new Image();i.onload=i.onerror=done;i.src=u});
 }
 function closeSoon(fast){
  const el=soonEl;if(!el)return false;
  soonEl=null;if(soonTimer){clearInterval(soonTimer);soonTimer=null}
  if(soonKey){document.removeEventListener('keydown',soonKey);soonKey=null}
  el.classList.remove('in');
  setTimeout(()=>el.remove(),fast||reducedMotion()?0:320);
  return true;
 }
 function openSoon(){
  if(typeof document==='undefined')return false;
  loadOutfits();closeSoon(true);
  const t=soonTx();
  const el=document.createElement('div');el.className='dcz dcz-soon';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label',t.t);el.dir=lang()==='ar'?'rtl':'ltr';
  el.innerHTML='<button type="button" class="dcz-soon-x" data-dcz-soon="close" aria-label="'+esc(T().closeL)+'">✕</button><div class="dcz-soon-st"><span class="dcz-soon-tag">'+esc(t.tag)+'</span><div class="dcz-soon-floor"></div><div class="dcz-sc"></div></div><div class="dcz-soon-txt"><b>'+esc(t.t)+'</b><span>'+esc(t.s)+'</span><button type="button" class="dcz-soon-ok" data-dcz-soon="close">'+esc(T().closeL)+'</button></div>';
  (document.getElementById('phone')||document.body).appendChild(el);soonEl=el;
  el.addEventListener('click',e=>{if(e.target.closest('[data-dcz-soon="close"]'))closeSoon()});
  soonKey=e=>{if(e.key==='Escape'){e.preventDefault();closeSoon()}};document.addEventListener('keydown',soonKey);
  soonStep();if(!reducedMotion())soonTimer=setInterval(soonStep,5200);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{if(soonEl===el)el.classList.add('in')}));
  return true;
 }
 const entryKey=()=>(soonOn()?'s':((meta()?.fresh||[]).length?'f':'n'))+'|'+lang();
 const entryHtml=()=>'🐾 '+esc(T().room)+(soonOn()?'<i class="dcz-soonpill">'+esc(soonTx().tag)+'</i>':((meta()?.fresh||[]).length?' •':''));
 function open(which,opts){
  if(soonOn()&&!(opts&&opts.force===true))return openSoon();
  loadOutfits();
  if(!app()||typeof document==='undefined')return false;
  try{const m=meta();if(m&&Array.isArray(m.fresh)&&m.fresh.length){freshShown=m.fresh.slice();m.fresh=[];save()}else freshShown=[]}catch(_){freshShown=[]}
  tab=which==='animals'?'animals':which?'shop':(freshShown.length?'animals':'shop');
  cat='ot';catUser=false;draft={};hist=[];fut=[];warned=false;leaving=false;
  if(room){room.remove();room=null}
  room=document.createElement('div');room.className='dcz dcz-room';room.setAttribute('role','dialog');room.setAttribute('aria-modal','true');room.setAttribute('aria-label',T().room);
  room.innerHTML='<div class="dcz-top"></div><div class="dcz-st"></div><div class="dcz-panel"><div class="dcz-tabs3" role="tablist"></div><div class="dcz-cats" role="tablist"></div><div class="dcz-grid3"></div></div>';
  (document.getElementById('phone')||document.body).appendChild(room);
  paint();
  onKey=e=>{if(e.key==='Escape'){e.preventDefault();closeRoom(false)}};
  document.addEventListener('keydown',onKey);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{if(room)room.classList.add('in')}));
  return true;
 }
 function closeRoom(force){
  if(!room||leaving)return false;
  if(!force&&Object.keys(draft).length&&!warned){warned=true;try{toast(T().unsaved)}catch(_){}return false}
  leaving=true;const r=room;r.classList.remove('in');r.classList.add('out');
  if(onKey){document.removeEventListener('keydown',onKey);onKey=null}
  const fast=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  setTimeout(()=>{r.remove();if(room===r)room=null;leaving=false},fast?0:360);
  return true;
 }
 function tapTile(id){
  const it=item(id),a=curAnimal(),m=meta();if(!it||!m||!(!it.slot||(it.art&&it.art[a])))return;
  if(it.reward&&!has(id)){try{toast(T().reqToast(reqText(it)))}catch(_){}return}
  if(!has(id)&&!seasonOpen(it)){try{toast(T().sltoast[it.season])}catch(_){}return}
  const key=slotKey(it),eff=effId(key,a,m);
  if(eff===id){const d=defaultId(key,a);if(d===id)return;setDraft(key,d,a,m)} // tap the chosen one again = take it off (the default robe stays)
  else setDraft(key,id,a,m);
  warned=false;paint();
 }
 function undo(){if(!hist.length)return;fut.push(JSON.stringify(draft));draft=JSON.parse(hist.pop());warned=false;paint()}
 function redo(){if(!fut.length)return;hist.push(JSON.stringify(draft));draft=JSON.parse(fut.pop());paint()}
 function saveDraft(){
  const st=app(),m=meta(),a=curAnimal(),keys=Object.keys(draft);if(!st||!m||!keys.length)return false;
  const cost=draftCost(),bal=Number(st.currency)||0;
  if(cost>bal){try{toast(T().need)}catch(_){}return false}
  const buy=keys.map(k=>draft[k]).filter(id=>id&&!has(id));
  st.currency=bal-cost;buy.forEach(id=>{if(!m.items.includes(id))m.items.push(id)});
  keys.forEach(key=>{
   const id=draft[key];
   if(key.startsWith('o:')){const o=m.outfit=m.outfit&&typeof m.outfit==='object'?m.outfit:{},w=o[a]=o[a]||{},slot=key.slice(2);if(!id||id===defaultId(key,a))delete w[slot];else w[slot]=id}
   else if(id)m.eq[key]=id;else delete m.eq[key];
  });
  draft={};hist=[];fut=[];save();try{updateUI()}catch(_){}
  try{toast(cost>0?T().bought:T().saved)}catch(_){}
  closeRoom(true);
  return true;
 }
 function pickAnimal(id){
  if(!select(id))return;
  draft={};hist=[];fut=[];warned=false;tab='shop';cat='ot';catUser=false;paint();
 }
 document.addEventListener('click',ev=>{
  const el=ev.target.closest?.('[data-dcz]');
  if(el){
   const a=el.dataset.dcz,id=el.dataset.id;
   if(a==='tab'){tab=id;paint()}
   else if(a==='cat'){cat=id;catUser=true;paint()}
   else if(a==='tile')tapTile(id);
   else if(a==='csave')saveCombo(Number(id));
   else if(a==='capply')applyCombo(Number(id));
   else if(a==='cdel')delCombo(Number(id));
   else if(a==='undo')undo();
   else if(a==='redo')redo();
   else if(a==='save')saveDraft();
   else if(a==='close')closeRoom(false);
   else if(a==='pick')pickAnimal(id);
   else if(a==='lock'){try{toast(T().lockedToast(N(id),LEVELS[id]))}catch(_){}}
   ev.preventDefault();return;
  }
  /* Lock the existing pickers (onboarding + in-game chooser) for animals that are not unlocked yet. */
  const card=ev.target.closest?.('.v998-animal,.v994-animal-card');
  if(!card)return;
  let id=card.dataset.animal;
  if(!id){const m=/'([a-z]+)'/.exec(card.getAttribute('onclick')||'');id=m&&m[1]}
  if(id&&LEVELS[id]&&!unlocked(id)){
   ev.stopImmediatePropagation();ev.preventDefault();
   try{toast(T().lockedToast(N(id),LEVELS[id]))}catch(_){}
  }
 },true);
 /* ---- Dressed avatar ----
    Where the game shows the player's own animal as a standing avatar (profile, review, path, home), show it wearing what the
    player chose: the outfit layers are composed on a canvas and cropped to head and shoulders. Only when the player has
    customised the outfit (a non-default one is worn): otherwise the original avatar stays. Pose pictures (lesson, correct,
    wrong, celebrate) are different poses and stay as they are. */
 const AV={cache:new Map(),busy:new Set()};
 const customised=a=>Object.values(wornOutfit(a)).some(id=>{const o=outItem(id);return !!o&&o.default!==true});
 const avKey=a=>{const w=wornOutfit(a);return a+'|'+Object.keys(w).sort().map(k=>w[k]).join(',')};
 const loadImg=src=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=src});
 async function buildAvatar(a,key){
  const worn=Object.values(wornOutfit(a)).map(outItem).filter(o=>o&&o.art&&o.art[a]);
  const fullO=worn.find(o=>o.slot==='body'&&o.full===true);
  const layers=worn.filter(o=>o!==fullO).sort((x,y)=>(Number(x.z)||0)-(Number(y.z)||0));
  const imgs=await Promise.all([fullO?fullO.art[a]:bodySrc(a)].concat(layers.map(o=>o.art[a])).map(loadImg));
  const W=512,H=768,c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d');imgs.forEach(i=>x.drawImage(i,0,0,W,H));
  const d=x.getImageData(0,0,W,H).data;let top=H,bot=0;
  for(let y=0;y<H;y+=2)for(let u=0;u<W;u+=2)if(d[(y*W+u)*4+3]>40){if(y<top)top=y;if(y>bot)bot=y}
  if(bot<=top){top=0;bot=H-1}
  const bh=bot-top,S=Math.round(bh*.56);let left=W,right=0;
  for(let y=top;y<top+S&&y<H;y+=2)for(let u=0;u<W;u+=2)if(d[(y*W+u)*4+3]>40){if(u<left)left=u;if(u>right)right=u}
  if(right<=left){left=0;right=W-1}
  const cx=(left+right)/2,sx=Math.max(0,Math.min(W-S,Math.round(cx-S/2))),sy=Math.max(0,top-Math.round(S*.04));
  const o=document.createElement('canvas');o.width=o.height=256;
  o.getContext('2d').drawImage(c,sx,sy,S,S,0,0,256,256);
  let url;try{url=o.toDataURL('image/webp',.9);if(!/^data:image\/webp/.test(url))url=o.toDataURL('image/png')}catch(_){url=''}
  if(url)AV.cache.set(key,url);
  return url;
 }
 function swapAvatars(){
  const st=app();
  document.querySelectorAll('img[data-dcz-av]').forEach(img=>{ // put the original back when nothing is customised any more
   const a=String(st?.profile?.companion||'');
   if(!st||!BODY.includes(a)||!OUT.list.length||!customised(a)){const o=img.dataset.dczOrig;if(o)img.setAttribute('src',o);delete img.dataset.dczAv;delete img.dataset.dczOrig}
  });
  if(!st||!st.onboarded)return;
  const a=String(st.profile?.companion||'');
  if(!BODY.includes(a)||!OUT.list.length||!customised(a))return;
  const key=avKey(a),url=AV.cache.get(key);
  if(!url){
   if(!AV.busy.has(key)&&document.querySelector('img[src*="/'+a+'_avatar.png"],img[data-dcz-av]')){AV.busy.add(key);buildAvatar(a,key).catch(()=>{}).then(()=>{AV.busy.delete(key);try{swapAvatars()}catch(_){}})}
   return;
  }
  document.querySelectorAll('img[src*="/'+a+'_avatar.png"],img[data-dcz-av]').forEach(img=>{
   if(img.getAttribute('src')===url)return;
   const cur=img.getAttribute('src')||'';
   if(!img.dataset.dczOrig&&/_avatar\.png/.test(cur))img.dataset.dczOrig=cur;
   img.setAttribute('src',url);img.dataset.dczAv=key;
   img.style.objectFit='cover';img.style.objectPosition='50% 0';
  });
 }
 function decorate(){
  document.querySelectorAll('.v998-animal,.v994-animal-card').forEach(card=>{
   let id=card.dataset.animal;
   if(!id){const m=/'([a-z]+)'/.exec(card.getAttribute('onclick')||'');id=m&&m[1]}
   if(!id||!LEVELS[id])return;
   const lock=!unlocked(id);
   card.classList.toggle('dcz-locked',lock);
   let tag=card.querySelector('.dcz-tag');
   if(lock){if(!tag){tag=document.createElement('em');tag.className='dcz-tag';card.appendChild(tag)}const tt='🔒 '+T().lv(LEVELS[id]);if(tag.textContent!==tt)tag.textContent=tt}
   else tag?.remove();
  });
  try{swapAvatars()}catch(_){}
  // Entry button in the profile header.
  const top=document.querySelector('#profileScreenBody .dsp-id');
  if(top&&!document.getElementById('dczEntry')){
   const b=document.createElement('button');b.type='button';b.id='dczEntry';b.className='dcz-entry';b.dataset.dczOpen='1';
   b.innerHTML=entryHtml();b.dataset.k=entryKey();top.after(b);
  }else{const e=document.getElementById('dczEntry');if(e&&e.dataset.k!==entryKey()){e.innerHTML=entryHtml();e.dataset.k=entryKey()}}
  // Wardrobe on the profile avatar.
  const slot=document.querySelector('#profileScreenBody .dsp-avatar-slot'),m=meta();
  if(slot&&m){
   const bg=eqItem(m,'bg'),ac=eqItem(m,'ac'),fr=eqItem(m,'fr');
   if(bg)slot.dataset.dczBg=bg.id;else delete slot.dataset.dczBg;
   if(fr)slot.dataset.dczFr=fr.id;else delete slot.dataset.dczFr;
   let badge=slot.querySelector('.dcz-badge');
   if(ac){const h=ICON[ac.svg];if(!badge){badge=document.createElement('i');badge.className='dcz-badge';slot.appendChild(badge)}if(badge.dataset.k!==ac.svg){badge.dataset.k=ac.svg;badge.innerHTML=h}}else badge?.remove();
  }
 }
 document.addEventListener('click',ev=>{if(ev.target.closest?.('[data-dcz-open]')){ev.preventDefault();open()}});
 const css=document.createElement('style');css.id='dcz-style';css.textContent=`
.dcz-badge{position:absolute;right:14%;bottom:10%;width:28%;height:28%;min-width:16px;min-height:16px;display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,.55))}
.dcz-badge svg{display:block;width:100%;height:100%}
.dcz-entry{display:block;width:100%;min-height:44px;margin:10px 0;border-radius:14px;border:1px solid rgba(140,235,208,.4);background:rgba(140,235,208,.12);color:inherit;font:600 15px/1 inherit;cursor:pointer}
.dcz-soonpill{display:inline-block;margin-inline-start:8px;padding:4px 9px;border-radius:999px;background:linear-gradient(180deg,#ff4a3d,#c3141b);color:#fff;font:800 11px/1 inherit;font-style:normal;letter-spacing:.05em;text-transform:uppercase;vertical-align:middle;box-shadow:0 0 0 1.5px rgba(255,255,255,.8),0 3px 10px rgba(230,40,40,.5);animation:dczSoonPulse 1.6s ease-in-out infinite}
.dcz-soon{position:absolute;inset:0;z-index:520;display:flex;flex-direction:column;overflow:hidden;color:#eff6f4;background:#081b22;opacity:0;transform:scale(.97);transition:opacity .3s ease,transform .4s cubic-bezier(.2,.8,.2,1)}
.dcz-soon.in{opacity:1;transform:none}
.dcz-soon-x{position:absolute;top:12px;inset-inline-start:12px;z-index:4;width:44px;height:44px;border-radius:50%;border:0;background:rgba(0,0,0,.38);color:#fff;font-size:18px;cursor:pointer}
.dcz-soon-st{position:relative;flex:1 1 0;min-height:0;background:radial-gradient(ellipse at 50% 34%,#2d6d69 0,#15434a 52%,#0a232b 100%)}
.dcz-soon-floor{position:absolute;left:0;right:0;bottom:0;height:34%;background:radial-gradient(ellipse at 50% 100%,rgba(140,235,208,.22),rgba(140,235,208,0) 62%);pointer-events:none}
.dcz-soon-tag{position:absolute;top:18px;left:50%;transform:translateX(-50%);z-index:3;padding:10px 24px;border-radius:999px;background:linear-gradient(180deg,#ff4a3d,#c3141b);color:#fff;font:800 19px/1 inherit;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;overflow:hidden;box-shadow:0 0 0 2px rgba(255,255,255,.88),0 6px 20px rgba(230,40,40,.55);animation:dczSoonTag 1.7s ease-in-out infinite}
.dcz-soon-tag::after{content:'';position:absolute;top:0;left:-70%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);transform:skewX(-20deg);animation:dczShine 2.6s ease-in-out infinite}
.dcz-sc{position:absolute;inset:72px 0 4%}
.dcz-sc img{position:absolute;left:50%;top:0;height:100%;width:auto;max-width:92%;object-fit:contain;transform:translateX(-50%);filter:drop-shadow(0 10px 14px rgba(0,0,0,.35))}
.dcz-sc-base{animation:dczScBase 5.2s ease both}
.dcz-sc-out{animation:dczScOut 5.2s cubic-bezier(.3,.9,.3,1) both}
.dcz-sp{position:absolute;color:#ffe9a8;font-style:normal;font-size:24px;opacity:0;text-shadow:0 0 10px rgba(255,220,120,.9);animation:dczScSp 5.2s ease-out both}
.dcz-sp.s1{left:18%;top:26%}.dcz-sp.s2{right:16%;top:20%;animation-delay:.08s}.dcz-sp.s3{left:22%;top:56%;animation-delay:.16s}.dcz-sp.s4{right:20%;top:50%;animation-delay:.05s}.dcz-sp.s5{left:46%;top:6%;animation-delay:.12s}
.dcz-soon-txt{display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 20px 20px;text-align:center;background:#0a232b}
.dcz-soon-txt b{font-size:19px}
.dcz-soon-txt span{font-size:14px;opacity:.85}
.dcz-soon-ok{margin-top:10px;min-height:44px;min-width:140px;padding:0 22px;border-radius:14px;border:1px solid rgba(140,235,208,.4);background:rgba(140,235,208,.14);color:inherit;font:600 15px/1 inherit;cursor:pointer}
@keyframes dczSoonPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes dczSoonTag{0%,100%{transform:translateX(-50%) scale(1);box-shadow:0 0 0 2px rgba(255,255,255,.88),0 6px 20px rgba(230,40,40,.5)}50%{transform:translateX(-50%) scale(1.07);box-shadow:0 0 0 2px rgba(255,255,255,.95),0 8px 28px rgba(255,60,50,.8)}}
@keyframes dczShine{0%,55%{left:-70%}100%{left:130%}}
@keyframes dczScBase{0%{opacity:0;transform:translateX(-50%) scale(.94)}10%,88%{opacity:1;transform:translateX(-50%) scale(1)}100%{opacity:0;transform:translateX(-50%) scale(1)}}
@keyframes dczScOut{0%,9%{opacity:0;transform:translate(-50%,-18%) scale(1.06)}24%{opacity:1;transform:translate(-50%,3%) scale(.99)}30%{opacity:1;transform:translate(-50%,-1%) scale(1.015)}35%,86%{opacity:1;transform:translate(-50%,0) scale(1)}100%{opacity:0;transform:translate(-50%,0) scale(1)}}
@keyframes dczScSp{0%,22%{opacity:0;transform:scale(.2) rotate(0)}30%{opacity:1;transform:scale(1.25) rotate(40deg)}48%{opacity:0;transform:scale(.6) rotate(100deg)}100%{opacity:0}}
@media(prefers-reduced-motion:reduce){.dcz-soon,.dcz-soon.in{transition:none!important;transform:none!important}.dcz-soon-tag,.dcz-soon-tag::after,.dcz-soonpill,.dcz-sc img,.dcz-sp{animation:none!important}.dcz-sc-out{opacity:1}.dcz-sp{display:none}.dcz-soon-tag{transform:translateX(-50%)}}

.dcz-locked{opacity:.55;filter:grayscale(.8)}
.dcz-locked small{display:none}
.dcz-tag{position:static;display:block;margin-top:6px;font-style:normal;font-size:12px;font-weight:700;text-align:center;color:#fff}
/* ---- full-screen room ---- */
.dcz-room{position:absolute;inset:0;z-index:500;display:flex;flex-direction:column;overflow:hidden;color:#eff6f4;background:#081b22;opacity:0;transform:translateY(26px) scale(.985);transition:opacity .28s ease,transform .4s cubic-bezier(.2,.8,.2,1)}
.dcz-room.in{opacity:1;transform:none}
.dcz-room.out{opacity:0;transform:translateY(18px) scale(.99);transition:opacity .26s ease,transform .3s ease}
.dcz-st{position:relative;flex:1 1 0;min-height:0;background:radial-gradient(ellipse at 50% 34%,#2d6d69 0,#15434a 52%,#0a232b 100%);transition:background .3s}
.dcz-floor{position:absolute;left:0;right:0;bottom:0;height:34%;background:radial-gradient(ellipse at 50% 100%,rgba(140,235,208,.22),rgba(140,235,208,0) 62%);pointer-events:none}
.dcz-char{position:absolute;inset:62px 0 10px;display:grid;place-items:center;opacity:0;transform:translateY(16px) scale(.96);transition:opacity .4s ease .12s,transform .5s cubic-bezier(.2,.8,.2,1) .12s}
.dcz-room.in .dcz-char{opacity:1;transform:none}
.dcz-char .dcz-base{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 14px 18px rgba(0,0,0,.35));animation:dczFade .24s ease}
.dcz-char .dcz-av{inset:12% 14%;width:72%;height:76%;border-radius:50%}
.dcz-char .dcz-layer{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none;animation:dczFade .24s ease}
.dcz-char .dcz-bdg{left:auto;right:6%;top:auto;bottom:6%;width:52px;height:52px;z-index:99}
@keyframes dczFade{from{opacity:0}to{opacity:1}}
@keyframes dczPop{0%{transform:scale(.94)}60%{transform:scale(1.03)}100%{transform:scale(1)}}
.dcz-top{position:absolute;top:0;left:0;right:0;z-index:4;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:max(12px,env(safe-area-inset-top)) 64px 0 12px;pointer-events:none}
[dir=rtl] .dcz-top{padding:max(12px,env(safe-area-inset-top)) 12px 0 64px}
.dcz-top>*{pointer-events:auto}
.dcz-x{flex:0 0 auto;width:44px;height:44px;border-radius:50%;border:0;background:rgba(0,0,0,.38);color:#fff;display:grid;place-items:center;cursor:pointer;backdrop-filter:blur(6px)}
.dcz-pill{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;text-align:center;padding:9px 12px;border-radius:999px;background:rgba(0,0,0,.34);font:600 13px/1 inherit;backdrop-filter:blur(6px);white-space:nowrap}
.dcz-save{flex:0 0 auto;min-height:44px;padding:0 16px;border-radius:999px;border:0;background:#8cebd0;color:#06232a;font:700 15px/1 inherit;cursor:pointer;white-space:nowrap;transition:opacity .2s,transform .15s}
.dcz-save.off{background:rgba(255,255,255,.22);color:rgba(255,255,255,.7);cursor:default}
.dcz-save:not(.off):active{transform:scale(.96)}
.dcz-ur{position:absolute;left:14px;bottom:14px;z-index:4;display:flex;border-radius:999px;overflow:hidden;background:rgba(0,0,0,.38);backdrop-filter:blur(6px)}
.dcz-ur button{width:48px;height:44px;border:0;background:transparent;color:#fff;display:grid;place-items:center;cursor:pointer}
.dcz-ur button+button{border-left:1px solid rgba(255,255,255,.14)}
.dcz-ur button:disabled{opacity:.35;cursor:default}
[dir=rtl] .dcz-ur{left:auto;right:14px}
[dir=rtl] .dcz-ur button+button{border-left:0;border-right:1px solid rgba(255,255,255,.14)}
.dcz-panel{position:relative;z-index:5;flex:0 0 clamp(300px,47%,450px);display:flex;flex-direction:column;min-height:0;border-radius:26px 26px 0 0;background:rgba(9,32,40,.97);box-shadow:0 -12px 40px rgba(0,0,0,.4);transform:translateY(100%);transition:transform .46s cubic-bezier(.2,.8,.2,1) .05s}
.dcz-room.in .dcz-panel{transform:none}
.dcz-room.out .dcz-panel{transform:translateY(40%);transition:transform .3s ease}
.dcz-tabs3{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid rgba(255,255,255,.08)}
.dcz-tab{display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 4px 9px;border:0;background:transparent;color:rgba(239,246,244,.62);font:600 12.5px/1 inherit;cursor:pointer;border-bottom:3px solid transparent;transition:color .2s,border-color .2s}
.dcz-tab.on{color:#fff;border-bottom-color:#8cebd0}
.dcz-cats{display:flex;justify-content:space-around;padding:4px 8px;border-bottom:1px solid rgba(255,255,255,.08)}
.dcz-cats[hidden]{display:none}
.dcz-cat{flex:1;height:48px;border:0;background:transparent;color:rgba(239,246,244,.55);display:grid;place-items:center;cursor:pointer;border-bottom:3px solid transparent;transition:color .2s,border-color .2s}
.dcz-cat.on{color:#8cebd0;border-bottom-color:#8cebd0}
.dcz-grid3{flex:1 1 0;min-height:0;overflow-y:auto;overscroll-behavior:contain;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:max-content;gap:10px;align-content:start;padding:12px 14px calc(20px + env(safe-area-inset-bottom))}
.dcz-grid3>.dcz-hint,.dcz-grid3>.dcz-empty,.dcz-grid3>.dcz-next{grid-column:1/-1}
.dcz-next{font-size:13px;opacity:.85;margin:0 2px 2px}
.dcz-empty{text-align:center;opacity:.75;margin:24px 8px;font-size:14px}
.dcz-tile{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:6px;padding:7px 6px 8px;height:auto;min-height:0;flex:none;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.06);color:inherit;cursor:pointer;min-width:0}
.dcz-tile b{font:600 11.5px/1.2 inherit;text-align:center;overflow-wrap:anywhere;min-height:2.4em;display:flex;align-items:center}
.dcz-tile small{font-size:11px;opacity:.75}
.dcz-tile.sel{border-color:#9af2d9;background:rgba(140,235,208,.14);animation:dczPop .26s ease}
.dcz-tile.saved:not(.sel){border-color:rgba(255,212,94,.5)}
.dcz-th{position:relative;display:block;width:100%;height:auto;aspect-ratio:3/4;flex:0 0 auto;border-radius:12px;overflow:hidden;background:rgba(255,255,255,.05)}
.dcz-th>img,.dcz-th>.dcz-sw,.dcz-th>.dcz-ring,.dcz-th>.dcz-ico,.dcz-th>.dcz-lk{position:absolute}
.dcz-th>img{inset:0;width:100%;height:100%;object-fit:contain}
.dcz-ath{width:80%;aspect-ratio:1/1;border-radius:50%;margin-top:4px}
.dcz-ath>img{object-fit:cover;border-radius:50%}
.dcz-dim{filter:grayscale(1) brightness(.45)}
.dcz-lk{inset:0;display:grid;place-items:center;font-size:24px}
.dcz-sw{inset:0;display:block}
.dcz-ring{left:21%;right:21%;top:50%;aspect-ratio:1/1;transform:translateY(-50%);display:block;border-radius:50%;background:rgba(255,255,255,.08)}
.dcz-ico{left:24%;right:24%;top:50%;aspect-ratio:1/1;transform:translateY(-50%);display:block}
.dcz-ico svg{display:block;width:100%;height:100%}
.dcz-ck{position:absolute;top:6px;right:6px;width:22px;height:22px;border-radius:50%;background:#8cebd0;color:#06232a;display:grid;place-items:center;font:800 13px/1 inherit;font-style:normal}
.dcz-pr{position:absolute;right:6px;bottom:6px;padding:3px 7px;border-radius:999px;background:rgba(10,30,36,.88);border:1px solid rgba(255,212,94,.55);color:#ffd45e;font:700 11px/1.2 inherit;font-style:normal}
[dir=rtl] .dcz-ck{right:auto;left:6px}
[dir=rtl] .dcz-pr{right:auto;left:6px}
.dcz-new{position:absolute;top:8px;right:8px;padding:2px 8px;border-radius:999px;background:#8cebd0;color:#06232a;font:700 11px/1.4 inherit;font-style:normal}
.dcz-tile.lock.an{opacity:.8}
.dcz-hint{font-size:12px;opacity:.65;margin:6px 2px 0}

.dcz-tabs3{grid-template-columns:repeat(4,1fr)}
.dcz-tab{font-size:11.5px;padding:11px 2px 8px}
.dcz-pr.dcz-rq{left:6px;right:6px;bottom:6px;text-align:center;white-space:normal;font-size:10.5px;line-height:1.15;padding:4px 4px;border-color:rgba(255,255,255,.3);color:#e7eef0}
[dir=rtl] .dcz-pr.dcz-rq{left:6px;right:6px}
.dcz-tile.rw.lock .dcz-th img,.dcz-tile.rw.lock .dcz-sw,.dcz-tile.rw.lock .dcz-ring,.dcz-tile.rw.lock .dcz-ico{filter:grayscale(.85) brightness(.7)}
.dcz-slot{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 6px 10px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.06)}
.dcz-slot.empty{border-style:dashed}
.dcz-sm{position:relative;width:100%;aspect-ratio:3/4;border-radius:12px;overflow:hidden;background:rgba(255,255,255,.05);display:grid;place-items:center;font-size:30px;opacity:.9}
.dcz-sm .dcz-mini{position:absolute;inset:0;display:block;opacity:1;transform:none}
.dcz-sm .dcz-mini .dcz-base,.dcz-sm .dcz-mini .dcz-layer{animation:none;filter:none}
.dcz-sm .dcz-mini .dcz-bdg{width:26%;height:auto;aspect-ratio:1/1;right:4%;bottom:4%}
.dcz-sbtn{min-height:36px;width:100%;border-radius:10px;border:1px solid rgba(140,235,208,.4);background:transparent;color:inherit;font:600 11.5px/1.1 inherit;cursor:pointer;padding:0 4px}
.dcz-sbtn.pri{background:#8cebd0;color:#06232a;border-color:#8cebd0}
.dcz-sdel{position:absolute;top:6px;right:6px;width:30px;height:30px;border-radius:50%;border:0;background:rgba(0,0,0,.45);color:#fff;cursor:pointer;font-size:13px}
[dir=rtl] .dcz-sdel{right:auto;left:6px}

.dcz-banner{grid-column:1/-1;margin:0;padding:10px 12px;border-radius:14px;background:linear-gradient(135deg,rgba(232,176,74,.22),rgba(31,143,120,.22));border:1px solid rgba(232,176,74,.45);font:700 13.5px/1.3 inherit}
.dcz-banner small{display:block;font-weight:500;font-size:11.5px;opacity:.85;margin-top:2px}
.dcz-sz{position:absolute;top:8px;left:8px;z-index:2;font-style:normal;font-size:14px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5))}
[dir=rtl] .dcz-sz{left:auto;right:8px}
@media(max-height:700px){.dcz-panel{flex-basis:clamp(260px,44%,340px)}.dcz-char{inset:56px 0 4px}.dcz-tab{padding:9px 4px 7px}.dcz-cat{height:42px}.dcz-tile b{font-size:11px}}
@media(prefers-reduced-motion:reduce){.dcz-room,.dcz-room.in,.dcz-room.out,.dcz-panel,.dcz-room.in .dcz-panel,.dcz-char,.dcz-room.in .dcz-char{transition:none!important;transform:none!important}.dcz-char .dcz-base,.dcz-char .dcz-layer,.dcz-tile.sel{animation:none!important}.dcz-room.out{opacity:0}}
`;
 // Item looks are generated from the ITEMS table so previews, swatches and the profile avatar always agree.
 const rules=ITEMS.filter(i=>i.kind!=='ac').map(i=>i.kind==='bg'
  ?'.dcz [data-dcz-bg="'+i.id+'"],html body #profileScreenBody .dsp-avatar-slot[data-dcz-bg="'+i.id+'"]{background:'+i.css+'!important}'
  :'.dcz [data-dcz-fr="'+i.id+'"],html body #profileScreenBody .dsp-avatar-slot[data-dcz-fr="'+i.id+'"]{box-shadow:'+i.css+'!important}').join('\n');
 const stageRules=ITEMS.filter(i=>i.kind==='fr').map(i=>'.dcz .dcz-st[data-dcz-fr="'+i.id+'"]{box-shadow:'+insetShadow(i.css)+'!important}').join('\n');
 css.textContent+=rules+'\n'+stageRules;
 document.head.appendChild(css);
 window.DEEN_COMPANIONS=Object.freeze({version:'companions-v13',order:ORDER.slice(),levels:Object.assign({},LEVELS),items:ITEMS.map(i=>i.id),bodyArt:BODY.slice(),outfits:()=>OUT.list.map(o=>o.id),unlocked,select,open,soon:soonOn,closeSoon:()=>closeSoon(true),isSoonOpen:()=>!!soonEl,season,seasonFor,close:()=>closeRoom(true),isOpen:()=>!!room,save:saveDraft,buyItem,toggleItem,isUnlocked:unlocked});
 // Wrap the engine's own chooser so a locked animal can never be selected programmatically.
 function wrap(){
  const c=window.DEEN_COMPANION;
  if(c&&!c.__dcz&&typeof c.select==='function'){const orig=c.select;c.select=function(id){if(LEVELS[id]&&!unlocked(id)){try{toast(T().lockedToast(N(id),LEVELS[id]))}catch(_){}return false}return orig.apply(this,arguments)};c.__dcz=1}
  const o=window.DEEN_PREMIUM_ONBOARDING;
  if(o&&!o.__dcz&&typeof o.animal==='function'){const orig=o.animal;o.animal=function(id){if(LEVELS[id]&&!unlocked(id))return false;return orig.apply(this,arguments)};o.__dcz=1}
 }
 function tick(){try{wrap();announce();loadOutfits();announceRewards();decorate()}catch(_){}}
 const start=()=>{setInterval(tick,1000);new MutationObserver(()=>{try{decorate()}catch(_){}}).observe(document.body,{childList:true,subtree:true})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
