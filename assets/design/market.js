/* Market (bottom tab "Market"): a shop in the style of mobile card games — daily deals, chests by rarity, companions and
   companion outfits, a rarity guide. For now it is the shop window only: prices show, a tap opens a large preview, and
   buying says "coming soon". Rarities (common, rare, epic, legendary) live in one place below so the later drop tables,
   companion rarities and chest contents can be set there. Prices are in Sparkles (◇), which are earned by learning only. */
(()=>{
 'use strict';
 if(window.DEEN_MARKET)return;
 const LANGS=['tr','en','de','fr','ar'];
 const lang=()=>{try{const l=localStorage.getItem('deen_app_language_v1');return LANGS.includes(l)?l:'tr'}catch(_){return'tr'}};
 const app=()=>{try{return state||{}}catch(_){return{}}};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const haptic=k=>{try{window.DEEN_DS_HAPTIC&&DEEN_DS_HAPTIC[k]&&DEEN_DS_HAPTIC[k]()}catch(_){}};

 // ---- Rarities (one place to change) ----
 const RARITY=['common','rare','epic','legendary'];
 // Companion rarities are a draft until the companions move into chests.
 const ANIMAL_RARITY={lion:'common',cat:'common',wolf:'rare',owl:'rare',turtle:'epic',eagle:'legendary'};
 const outfitRarity=cost=>cost<=60?'common':cost<=110?'rare':cost<=160?'epic':'legendary';
 // Chests: price in Sparkles, number of items, and the chance (%) of each rarity per item.
 // Every chest gives Sparkles first (sp: min–max), then its items; epic and legendary chests can hold a new companion
 // (animal: the chance that one of their items is a companion the learner does not have yet).
 const CHESTS=[
  {r:'common',price:60,items:2,odds:[80,18,2,0],sp:[10,20],animal:0},
  {r:'rare',price:150,items:3,odds:[45,45,9,1],sp:[25,45],animal:0},
  {r:'epic',price:300,items:4,odds:[15,45,35,5],sp:[60,100],animal:.12},
  {r:'legendary',price:600,items:5,odds:[0,30,50,20],sp:[150,250],animal:.3}
 ];
 // The daily gift is a small free chest, once a day.
 const GIFT={r:'common',price:0,items:1,odds:[85,15,0,0],sp:[5,10],animal:0,gift:true};
 // A reward the learner already has turns into Sparkles: a quarter of an outfit's price, 100 for a companion.
 const DUPE_OUTFIT=.25,DUPE_ANIMAL=100;
 const ANIMALS=['lion','cat','wolf','owl','turtle','eagle'];

 const T={
  tr:{open:'AÇ',need:'Yeterli Pırıltı yok',newL:'YENİ!',dupe:n=>'Zaten sende · +'+n+' Pırıltı',left:n=>n+' kaldı',spName:'Pırıltı',done:'Tamam',got:'Kazandıkların',wardrobeSoon:'Kıyafetler Hayvan Odası’na eklendi; oda açılınca giyebilirsin.',wardrobeAdded:'Kıyafetler gardırobuna eklendi.',newAnimal:'Yeni yol arkadaşı!',animalChance:'Yol arkadaşı şansı',giftDone:'Bugünkü hediyeni aldın. Yarın yine gel!',tomorrow:'YARIN',tapNext:'Devam etmek için dokun',tab:'Market',title:'Market',deals:'Günün Teklifleri',refresh:'Yenilenme',chests:'Sandıklar',animals:'Yol Arkadaşları',outfits:'Kıyafetler',guide:'Nadirlik',
   free:'ÜCRETSİZ',gift:'Günlük hediye',chest:r=>({common:'Sıradan',rare:'Ender',epic:'Nadir',legendary:'Efsanevi'}[r])+' Sandık',
   rar:{common:'Sıradan',rare:'Ender',epic:'Nadir',legendary:'Efsanevi'},items:n=>n+' eşya',fromChest:'Sandıktan',soon:'Yakında',
   soonToast:'Market çok yakında açılıyor. Pırıltılarını biriktirmeye devam et!',owned:'Sende',
   animalsNote:'Yol arkadaşları yakında sandıklardan çıkacak.',chances:'Bir eşyanın nadirlik olasılığı',inside:'İçinden: kıyafetler ve Pırıltı; Nadir ve üstünde yol arkadaşı da çıkabilir.',
   outfitFor:'Kimin için?',outfitDesc:'Yol arkadaşının giyebileceği kıyafet.',animalDesc:'Yeni bir yol arkadaşı.',giftDesc:'Her gün bir küçük hediye.',
   guideTx:{common:'Kolayca bulunur.',rare:'Daha az çıkar.',epic:'Az bulunur, özel parçalar.',legendary:'En değerli ve en zor bulunan.'},
   honest:'Pırıltı yalnızca öğrenerek kazanılır; gerçek parayla satılmaz. Sandıkların olasılıkları açıkça gösterilir.',
   balance:'Pırıltın',close:'Kapat',buy:'Satın al',discount:'İNDİRİM',animal:{lion:'Aslan',cat:'Kedi',wolf:'Kurt',owl:'Baykuş',turtle:'Kaplumbağa',eagle:'Kartal'}},
  en:{open:'OPEN',need:'Not enough Sparkles',newL:'NEW!',dupe:n=>'Already yours · +'+n+' Sparkles',left:n=>n+' left',spName:'Sparkles',done:'Done',got:'Your rewards',wardrobeSoon:'Outfits were added to the Animal Room; wear them once it opens.',wardrobeAdded:'Outfits were added to your wardrobe.',newAnimal:'New companion!',animalChance:'Companion chance',giftDone:'You took today’s gift. Come back tomorrow!',tomorrow:'TOMORROW',tapNext:'Tap to continue',tab:'Shop',title:'Shop',deals:'Daily Deals',refresh:'Refreshes in',chests:'Chests',animals:'Companions',outfits:'Outfits',guide:'Rarity',
   free:'FREE',gift:'Daily gift',chest:r=>({common:'Common',rare:'Rare',epic:'Epic',legendary:'Legendary'}[r])+' Chest',
   rar:{common:'Common',rare:'Rare',epic:'Epic',legendary:'Legendary'},items:n=>n+' items',fromChest:'From chests',soon:'Soon',
   soonToast:'The shop opens very soon. Keep collecting Sparkles!',owned:'Owned',
   animalsNote:'Companions will soon come from chests.',chances:'Rarity chance per item',inside:'Inside: outfits and Sparkles; from Epic up, a companion too.',
   outfitFor:'For whom?',outfitDesc:'An outfit your companion can wear.',animalDesc:'A new companion.',giftDesc:'A small gift every day.',
   guideTx:{common:'Easy to find.',rare:'Turns up less often.',epic:'Hard to find, special pieces.',legendary:'The rarest and most precious.'},
   honest:'Sparkles are earned by learning only and are never sold for real money. Chest chances are shown openly.',
   balance:'Your Sparkles',close:'Close',buy:'Buy',discount:'SALE',animal:{lion:'Lion',cat:'Cat',wolf:'Wolf',owl:'Owl',turtle:'Turtle',eagle:'Eagle'}},
  de:{open:'ÖFFNEN',need:'Nicht genug Funkeln',newL:'NEU!',dupe:n=>'Schon deins · +'+n+' Funkeln',left:n=>'noch '+n,spName:'Funkeln',done:'Fertig',got:'Deine Belohnungen',wardrobeSoon:'Die Outfits liegen im Tierzimmer; sobald es öffnet, kannst du sie tragen.',wardrobeAdded:'Die Outfits sind in deiner Garderobe.',newAnimal:'Neuer Begleiter!',animalChance:'Begleiter-Chance',giftDone:'Dein Geschenk für heute hast du. Komm morgen wieder!',tomorrow:'MORGEN',tapNext:'Tippen zum Weitermachen',tab:'Shop',title:'Shop',deals:'Tagesangebote',refresh:'Neu in',chests:'Truhen',animals:'Begleiter',outfits:'Outfits',guide:'Seltenheit',
   free:'GRATIS',gift:'Tagesgeschenk',chest:r=>({common:'Gewöhnliche',rare:'Seltene',epic:'Epische',legendary:'Legendäre'}[r])+' Truhe',
   rar:{common:'Gewöhnlich',rare:'Selten',epic:'Episch',legendary:'Legendär'},items:n=>n+' Teile',fromChest:'Aus Truhen',soon:'Bald',
   soonToast:'Der Shop öffnet sehr bald. Sammle weiter Funkeln!',owned:'Im Besitz',
   animalsNote:'Begleiter kommen bald aus Truhen.',chances:'Seltenheit pro Teil',inside:'Inhalt: Outfits und Funkeln; ab Episch auch ein Begleiter.',
   outfitFor:'Für wen?',outfitDesc:'Ein Outfit für deinen Begleiter.',animalDesc:'Ein neuer Begleiter.',giftDesc:'Jeden Tag ein kleines Geschenk.',
   guideTx:{common:'Leicht zu finden.',rare:'Seltener zu finden.',epic:'Schwer zu finden, besondere Teile.',legendary:'Das Seltenste und Wertvollste.'},
   honest:'Funkeln gibt es nur fürs Lernen, nie für echtes Geld. Die Chancen der Truhen werden offen gezeigt.',
   balance:'Deine Funkeln',close:'Schließen',buy:'Kaufen',discount:'RABATT',animal:{lion:'Löwe',cat:'Katze',wolf:'Wolf',owl:'Eule',turtle:'Schildkröte',eagle:'Adler'}},
  fr:{open:'OUVRIR',need:'Pas assez d’Éclats',newL:'NOUVEAU !',dupe:n=>'Déjà à toi · +'+n+' Éclats',left:n=>'encore '+n,spName:'Éclats',done:'OK',got:'Tes récompenses',wardrobeSoon:'Les tenues sont dans la salle des animaux ; tu pourras les porter à son ouverture.',wardrobeAdded:'Les tenues sont dans ta garde-robe.',newAnimal:'Nouveau compagnon !',animalChance:'Chance de compagnon',giftDone:'Tu as pris le cadeau du jour. Reviens demain !',tomorrow:'DEMAIN',tapNext:'Touche pour continuer',tab:'Boutique',title:'Boutique',deals:'Offres du jour',refresh:'Nouveau dans',chests:'Coffres',animals:'Compagnons',outfits:'Tenues',guide:'Rareté',
   free:'GRATUIT',gift:'Cadeau du jour',chest:r=>'Coffre '+({common:'commun',rare:'rare',epic:'épique',legendary:'légendaire'}[r]),
   rar:{common:'Commun',rare:'Rare',epic:'Épique',legendary:'Légendaire'},items:n=>n+' objets',fromChest:'Dans les coffres',soon:'Bientôt',
   soonToast:'La boutique ouvre très bientôt. Continue à gagner des Éclats !',owned:'Possédé',
   animalsNote:'Les compagnons viendront bientôt des coffres.',chances:'Chance de rareté par objet',inside:'Contenu : tenues et Éclats ; à partir d’Épique, un compagnon aussi.',
   outfitFor:'Pour qui ?',outfitDesc:'Une tenue pour ton compagnon.',animalDesc:'Un nouveau compagnon.',giftDesc:'Un petit cadeau chaque jour.',
   guideTx:{common:'Facile à trouver.',rare:'Plus rare.',epic:'Difficile à trouver, pièces spéciales.',legendary:'Le plus rare et le plus précieux.'},
   honest:'Les Éclats se gagnent uniquement en apprenant et ne sont jamais vendus contre de l’argent. Les chances des coffres sont affichées.',
   balance:'Tes Éclats',close:'Fermer',buy:'Acheter',discount:'PROMO',animal:{lion:'Lion',cat:'Chat',wolf:'Loup',owl:'Hibou',turtle:'Tortue',eagle:'Aigle'}},
  ar:{open:'افتح',need:'لا تكفي اللمعات',newL:'جديد!',dupe:n=>'لديك بالفعل · +'+n+' لمعة',left:n=>'باقٍ '+n,spName:'لمعات',done:'تم',got:'مكافآتك',wardrobeSoon:'أُضيفت الملابس إلى غرفة الحيوانات؛ يمكنك ارتداؤها عند افتتاحها.',wardrobeAdded:'أُضيفت الملابس إلى خزانتك.',newAnimal:'رفيق جديد!',animalChance:'فرصة الرفيق',giftDone:'أخذت هدية اليوم. عد غدًا!',tomorrow:'غدًا',tapNext:'اضغط للمتابعة',tab:'المتجر',title:'المتجر',deals:'عروض اليوم',refresh:'يتجدد بعد',chests:'الصناديق',animals:'الرفاق',outfits:'الملابس',guide:'الندرة',
   free:'مجاني',gift:'هدية اليوم',chest:r=>'صندوق '+({common:'عادي',rare:'نادر',epic:'ملحمي',legendary:'أسطوري'}[r]),
   rar:{common:'عادي',rare:'نادر',epic:'ملحمي',legendary:'أسطوري'},items:n=>n+' قطع',fromChest:'من الصناديق',soon:'قريبًا',
   soonToast:'المتجر يفتح قريبًا جدًا. واصل جمع اللمعات!',owned:'لديك',
   animalsNote:'سيخرج الرفاق قريبًا من الصناديق.',chances:'احتمال الندرة لكل قطعة',inside:'بداخله: ملابس ولمعات؛ ومن الملحمي فأعلى قد يخرج رفيق.',
   outfitFor:'لمن؟',outfitDesc:'ملابس يرتديها رفيقك.',animalDesc:'رفيق جديد.',giftDesc:'هدية صغيرة كل يوم.',
   guideTx:{common:'سهل الإيجاد.',rare:'يظهر أقل.',epic:'صعب الإيجاد، قطع مميزة.',legendary:'الأندر والأثمن.'},
   honest:'تُكسب اللمعات بالتعلّم فقط ولا تُباع بمال حقيقي. احتمالات الصناديق معروضة بوضوح.',
   balance:'لمعاتك',close:'إغلاق',buy:'شراء',discount:'خصم',animal:{lion:'أسد',cat:'قطة',wolf:'ذئب',owl:'بومة',turtle:'سلحفاة',eagle:'نسر'}}
 };
 const t=()=>T[lang()];
 const pct=n=>lang()==='tr'?'%'+n:n+'%';

 const GEM='<svg class="mk-gem" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l7.5 6-7.5 13-7.5-13z" fill="#ffd978"/><path d="M12 2.5l7.5 6H4.5z" fill="#fff1bf"/><path d="M12 21.5l-3-13h6z" fill="#f1b844"/><path d="M12 2.5l7.5 6-7.5 13-7.5-13z" fill="none" stroke="#a8711c" stroke-width="1.2" stroke-linejoin="round"/></svg>';
 const BAG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.1 11.6a1.6 1.6 0 0 1-1.6 1.4H7.7a1.6 1.6 0 0 1-1.6-1.4z"/><path d="M9 8V6.6a3 3 0 0 1 6 0V8"/></svg>';
 const CLOCK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';

 // ---- Outfits (same list as the wardrobe) ----
 let OUTFITS=[];let outfitsLoading=null;
 function loadOutfits(){
  if(outfitsLoading)return outfitsLoading;
  outfitsLoading=fetch('assets/companions/outfits.json').then(r=>r.ok?r.json():null).then(j=>{OUTFITS=(j&&Array.isArray(j.items)?j.items:[]).filter(o=>o&&o.art&&Number(o.cost)>0);if(isActive())render()}).catch(()=>{});
  return outfitsLoading;
 }
 const outName=o=>(o.name&&(o.name[lang()]||o.name.tr))||o.id;
 const body=a=>'assets/companions/'+a+'/'+a+'_body.webp';
 const curAnimal=()=>{const c=String(app().profile?.companion||'');return ANIMALS.includes(c)?c:'lion'};
 let outfitAnimal=null;
 const unlocked=a=>{try{return !!(window.DEEN_COMPANIONS&&DEEN_COMPANIONS.isUnlocked&&DEEN_COMPANIONS.isUnlocked(a))}catch(_){return false}};

 // Daily deals: a free gift and five outfits for the current companion, chosen by the date (the same all day).
 const dayKey=()=>{const d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate()};
 function seeded(n){let x=n;return()=>{x=(x*1103515245+12345)%2147483648;return x/2147483648}}
 function deals(){
  const a=curAnimal(),pool=OUTFITS.filter(o=>o.art[a]);const rnd=seeded(dayKey()+ANIMALS.indexOf(a)*7919);
  const picked=[];const copy=pool.slice();while(copy.length&&picked.length<5)picked.push(copy.splice(Math.floor(rnd()*copy.length),1)[0]);
  return picked.map((o,i)=>({kind:'outfit',o,a,sale:i===1?20:0}));
 }
 function countdown(){const n=new Date(),m=new Date(n);m.setHours(24,0,0,0);let s=Math.max(0,Math.floor((m-n)/1000));const h=Math.floor(s/3600);s-=h*3600;const mm=Math.floor(s/60);s-=mm*60;return [h,mm,s].map(x=>String(x).padStart(2,'0')).join(':')}

 // ---- Markup ----
 const art=it=>{
  if(it.kind==='outfit')return '<span class="mk-art mk-skin"><img src="'+body(it.a)+'" alt="" loading="lazy" decoding="async"><img src="'+esc(it.o.art[it.a])+'" alt="" loading="lazy" decoding="async"></span>';
  // The companions row scrolls sideways, where lazy images can stay unloaded (RTL): they load at once.
  if(it.kind==='animal')return '<span class="mk-art mk-skin"><img src="'+body(it.a)+'" alt="" decoding="async"><img src="assets/companions/outfits/'+it.a+'/ot_thobe.webp" alt="" decoding="async"></span>';
  return '<span class="mk-art mk-chestart"><img src="assets/design/market/chest-'+it.r+'.webp" alt="" loading="lazy" decoding="async"></span>';
 };
 const priceBtn=(it)=>{
  const L=t();
  if(it.kind==='gift')return '<span class="mk-price free'+(giftClaimed()?' done':'')+'">'+esc(giftClaimed()?L.tomorrow:L.free)+'</span>';
  if(it.kind==='animal')return '<span class="mk-price chestonly">'+esc(L.fromChest)+'</span>';
  const p=priceOf(it),old=it.sale?Math.round(p/(1-it.sale/100)/5)*5:0;
  return '<span class="mk-price">'+(old?'<s>'+old+'</s>':'')+GEM+'<b>'+p+'</b></span>';
 };
 const priceOf=it=>it.kind==='chest'?it.price:it.kind==='outfit'?Math.round(Number(it.o.cost)*(1-(it.sale||0)/100)):0;
 const rarOf=it=>it.kind==='outfit'?outfitRarity(Number(it.o.cost)):it.kind==='animal'?ANIMAL_RARITY[it.a]:it.r;
 const nameOf=it=>{const L=t();return it.kind==='outfit'?outName(it.o):it.kind==='animal'?L.animal[it.a]:it.kind==='gift'?L.gift:L.chest(it.r)};
 let ITEMS=[];
 const card=(it,extra)=>{const i=ITEMS.push(it)-1,r=rarOf(it),L=t();
  return '<button type="button" class="mk-card'+(extra||'')+'" data-r="'+r+'" data-i="'+i+'" aria-label="'+esc(nameOf(it)+' · '+L.rar[r])+'">'+
   (it.sale?'<span class="mk-sale">-'+pct(it.sale)+'</span>':'')+
   (it.kind==='animal'&&unlocked(it.a)?'<span class="mk-owned">✓ '+esc(L.owned)+'</span>':'')+
   '<span class="mk-card-in">'+art(it)+'<span class="mk-rar">'+esc(L.rar[r])+'</span></span>'+
   '<span class="mk-name">'+esc(nameOf(it))+'</span>'+priceBtn(it)+'</button>'};
 const banner=(title,side)=>'<div class="mk-banner"><h2>'+esc(title)+'</h2>'+(side||'')+'</div>';

 function render(){
  const host=document.getElementById('marketScreen');if(!host)return;
  const L=t(),l=lang();ITEMS=[];
  host.setAttribute('dir',l==='ar'?'rtl':'ltr');host.setAttribute('lang',l);
  const bal=Math.max(0,Math.round(Number(app().currency)||0));
  if(!outfitAnimal)outfitAnimal=curAnimal();
  const gift={kind:'gift',r:'common'};
  let h='<div class="scroll mk-scroll"><header class="mk-top"><div class="mk-title">'+BAG+'<span>'+esc(L.title)+'</span></div>'+
   '<div class="mk-bal" aria-label="'+esc(L.balance+': '+bal)+'">'+GEM+'<b>'+bal+'</b></div></header>';
  // Daily deals
  h+='<section class="mk-sec">'+banner(L.deals,'<span class="mk-timer">'+CLOCK+'<span>'+esc(L.refresh)+' </span><b id="mkTimer">'+countdown()+'</b></span>')+
   '<div class="mk-grid">'+card({...gift,kind:'gift'},' mk-gift')+deals().map(d=>card(d)).join('')+'</div></section>';
  // Chests
  h+='<section class="mk-sec">'+banner(L.chests)+'<div class="mk-chests">'+CHESTS.map(c=>{const it={kind:'chest',...c};const i=ITEMS.push(it)-1;
   return '<button type="button" class="mk-chest" data-r="'+c.r+'" data-i="'+i+'" aria-label="'+esc(L.chest(c.r))+'"><span class="mk-chest-glow"></span>'+
    '<img src="assets/design/market/chest-'+c.r+'.webp" alt="" loading="lazy" decoding="async"><span class="mk-chest-name">'+esc(L.chest(c.r))+'</span>'+
    '<span class="mk-chest-items">'+esc(L.items(c.items))+'</span><span class="mk-price">'+GEM+'<b>'+c.price+'</b></span></button>'}).join('')+'</div></section>';
  // Companions
  h+='<section class="mk-sec">'+banner(L.animals)+'<p class="mk-note">'+esc(L.animalsNote)+'</p><div class="mk-row">'+ANIMALS.map(a=>card({kind:'animal',a},' mk-tall')).join('')+'</div></section>';
  // Outfits
  const list=OUTFITS.filter(o=>o.art[outfitAnimal]).sort((x,y)=>x.cost-y.cost);
  h+='<section class="mk-sec">'+banner(L.outfits)+'<div class="mk-pick" role="tablist" aria-label="'+esc(L.outfitFor)+'">'+ANIMALS.map(a=>
   '<button type="button" role="tab" class="mk-pet'+(a===outfitAnimal?' on':'')+'" data-pet="'+a+'" aria-selected="'+(a===outfitAnimal)+'" aria-label="'+esc(L.animal[a])+'"><img src="assets/companions/'+a+'/'+a+'_avatar.png" alt="" loading="lazy"></button>').join('')+
   '</div><div class="mk-grid">'+list.map(o=>card({kind:'outfit',o,a:outfitAnimal})).join('')+'</div></section>';
  // Rarity guide
  h+='<section class="mk-sec">'+banner(L.guide)+'<div class="mk-guide">'+RARITY.map(r=>'<div class="mk-guide-row" data-r="'+r+'"><span class="mk-dia"></span><b>'+esc(L.rar[r])+'</b><small>'+esc(L.guideTx[r])+'</small></div>').join('')+'</div>'+
   '<p class="mk-honest">'+esc(L.honest)+'</p></section></div>';
  host.innerHTML=h;
 }

 // ---- Preview sheet ----
 let sheet=null;
 function closeSheet(){if(!sheet)return;const s=sheet;sheet=null;s.classList.remove('in');setTimeout(()=>s.remove(),220)}
 function openSheet(it){
  closeSheet();const L=t(),r=rarOf(it);
  const s=document.createElement('div');s.className='mk-sheet';s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');s.setAttribute('aria-label',nameOf(it));if(lang()==='ar')s.dir='rtl';
  const big=it.kind==='chest'||it.kind==='gift'?'<img class="mk-sheet-chest" src="assets/design/market/chest-'+(it.r||'common')+'.webp" alt="">':art(it);
  const desc=it.kind==='outfit'?L.outfitDesc:it.kind==='animal'?L.animalDesc:it.kind==='gift'?L.giftDesc:L.inside;
  const odds=it.kind==='chest'?'<div class="mk-odds"><small>'+esc(L.chances)+'</small>'+RARITY.map((k,i)=>'<div class="mk-odd" data-r="'+k+'"><span>'+esc(L.rar[k])+'</span><i><em style="width:'+it.odds[i]+'%"></em></i><b>'+pct(it.odds[i])+'</b></div>').join('')+'@@PET@@</div>':'';
  const opens=it.kind==='chest'||it.kind==='gift',giftTaken=it.kind==='gift'&&giftClaimed();
  const price=it.kind==='gift'?esc(giftTaken?L.tomorrow:L.free):it.kind==='animal'?esc(L.fromChest):GEM+'<b>'+priceOf(it)+'</b>';
  const animalOdds=it.kind==='chest'&&it.animal?'<div class="mk-odd mk-odd-pet"><span>'+esc(L.animalChance)+'</span><i><em style="width:'+Math.round(it.animal*100)+'%"></em></i><b>'+pct(Math.round(it.animal*100))+'</b></div>':'';
  s.innerHTML=('<div class="mk-sheet-back"></div><div class="mk-sheet-card" data-r="'+r+'"><button type="button" class="mk-sheet-x" aria-label="'+esc(L.close)+'">×</button>'+
   '<div class="mk-sheet-art" data-r="'+r+'"><span class="mk-sheet-rays"></span>'+big+'</div><span class="mk-rar big" data-r="'+r+'">'+esc(L.rar[r])+'</span>'+
   '<h3>'+esc(nameOf(it))+'</h3><p>'+esc(desc)+'</p>'+odds+
   '<button type="button" class="mk-buy'+(opens?' live':'')+(giftTaken?' done':'')+'"><span class="mk-buy-in">'+price+'</span>'+(opens?'':'<span class="mk-soon">'+esc(L.soon)+'</span>')+'</button></div>').replace('@@PET@@',animalOdds);
  (document.getElementById('phone')||document.body).append(s);sheet=s;
  requestAnimationFrame(()=>requestAnimationFrame(()=>s.classList.add('in')));
  s.querySelector('.mk-sheet-back').addEventListener('click',closeSheet);s.querySelector('.mk-sheet-x').addEventListener('click',closeSheet);
  s.querySelector('.mk-buy').addEventListener('click',()=>{
   haptic('tap');const b=s.querySelector('.mk-buy');const nope=msg=>{b.classList.remove('nope');void b.offsetWidth;b.classList.add('nope');toast(msg)};
   if(!opens)return nope(L.soonToast);
   if(giftTaken)return nope(L.giftDone);
   buyChest(it.kind==='gift'?GIFT:it).then(res=>{if(!res)return;if(res.error)return nope(res.error);closeSheet();setTimeout(()=>openChest(res),180)});
  });
  s.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
 }
 // ---- Buying and opening chests ----
 const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
 function mmeta(){const st=app();const m=st.marketMeta=st.marketMeta&&typeof st.marketMeta==='object'?st.marketMeta:{};if(!Array.isArray(m.history))m.history=[];return m}
 const giftClaimed=()=>{try{return mmeta().gift===today()}catch(_){return false}};
 function cmeta(){const st=app();const m=st.companionMeta=st.companionMeta&&typeof st.companionMeta==='object'?st.companionMeta:{};if(!Array.isArray(m.items))m.items=[];if(!Array.isArray(m.owned))m.owned=[];if(!Array.isArray(m.seen))m.seen=[];if(!m.eq||typeof m.eq!=='object')m.eq={};return m}
 const rand=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
 const pick=l=>l[Math.floor(Math.random()*l.length)];
 function pickRarity(odds){let x=Math.random()*odds.reduce((a,b)=>a+b,0);for(let i=0;i<RARITY.length;i++){x-=odds[i];if(x<0)return RARITY[i]}return RARITY[0]}
 // The animal shown wearing an outfit: the learner's companion when the outfit is drawn for it, else the first one it is.
 const artAnimal=o=>o.art[curAnimal()]?curAnimal():ANIMALS.find(a=>o.art[a])||'lion';
 function roll(c){
  const owned=new Set(cmeta().items),out=[{kind:'sp',n:rand(c.sp[0],c.sp[1]),r:c.r}];
  const petSlot=Math.random()<(c.animal||0)?Math.floor(Math.random()*c.items):-1;
  for(let k=0;k<c.items;k++){
   const r=pickRarity(c.odds);
   if(k===petSlot){const locked=ANIMALS.filter(a=>!unlocked(a)&&!out.some(x=>x.a===a&&x.kind==='animal'));
    if(locked.length){const same=locked.filter(a=>ANIMAL_RARITY[a]===r);const a=pick(same.length?same:locked);out.push({kind:'animal',a,r:ANIMAL_RARITY[a],fresh:true});continue}}
   let tier=RARITY.indexOf(r),pool=[];
   // A new outfit of the rolled rarity; when there is none left, the nearest rarity below, then above.
   for(const i of [tier,...[1,2,3].flatMap(d=>[tier-d,tier+d])]){if(i<0||i>3)continue;pool=OUTFITS.filter(o=>outfitRarity(Number(o.cost))===RARITY[i]&&!owned.has(o.id)&&!out.some(x=>x.o&&x.o.id===o.id));if(pool.length)break}
   if(pool.length){const o=pick(pool);out.push({kind:'outfit',o,a:artAnimal(o),r:outfitRarity(Number(o.cost)),fresh:true})}
   else{const any=OUTFITS.filter(o=>outfitRarity(Number(o.cost))===r);const o=pick(any.length?any:OUTFITS);out.push({kind:'outfit',o,a:artAnimal(o),r:outfitRarity(Number(o.cost)),fresh:false,dupe:Math.max(5,Math.round(Number(o.cost)*DUPE_OUTFIT))})}
  }
  return out;
 }
 // Pays, rolls and saves at once (before any animation), so leaving or reloading during the opening loses nothing.
 async function buyChest(c){
  const L=t(),st=app();
  if(!OUTFITS.length){await loadOutfits();if(!OUTFITS.length)return {error:L.soonToast}}
  if(c.gift){if(giftClaimed())return {error:L.giftDone}}
  else if((Number(st.currency)||0)<c.price)return {error:L.need};
  const rewards=roll(c),cm=cmeta();let gain=0;
  for(const x of rewards){
   if(x.kind==='sp')gain+=x.n;
   else if(x.kind==='animal'){if(!cm.owned.includes(x.a))cm.owned.push(x.a);else{x.fresh=false;x.dupe=DUPE_ANIMAL;gain+=DUPE_ANIMAL}}
   else if(x.fresh)cm.items.push(x.o.id);else gain+=x.dupe;
  }
  st.currency=Math.max(0,Math.round((Number(st.currency)||0)-(c.gift?0:c.price)+gain));
  const mm=mmeta();if(c.gift)mm.gift=today();
  mm.history.push({at:Date.now(),chest:c.gift?'gift':c.r,price:c.gift?0:c.price,got:rewards.map(x=>x.kind==='sp'?'sp:'+x.n:x.kind==='animal'?'animal:'+x.a+(x.fresh?'':':dupe'):'outfit:'+x.o.id+(x.fresh?'':':dupe'))});mm.history=mm.history.slice(-60);
  try{saveState()}catch(_){}try{updateUI()}catch(_){}
  return {chest:c,rewards};
 }
 const snd=k=>{try{window.DEENSound&&DEENSound.play&&DEENSound.play(k)}catch(_){}};
 const reduced=()=>document.documentElement.classList.contains('v5-reduce')||matchMedia('(prefers-reduced-motion: reduce)').matches;
 function rewardCard(x,big){
  const L=t();
  if(x.kind==='sp')return '<div class="mko-card'+(big?' big':'')+' sp" data-r="'+x.r+'"><div class="mko-card-art sp">'+GEM+GEM+GEM+'</div><b class="mko-card-n">+'+x.n+'</b><span class="mko-card-name">'+esc(L.spName)+'</span></div>';
  const it={kind:x.kind,o:x.o,a:x.a},name=x.kind==='animal'?L.animal[x.a]:outName(x.o);
  return '<div class="mko-card'+(big?' big':'')+'" data-r="'+x.r+'">'+(x.fresh?'<span class="mko-new">'+esc(x.kind==='animal'?L.newAnimal:L.newL)+'</span>':'')+
   '<div class="mko-card-art">'+art(it)+'</div><span class="mk-rar big" data-r="'+x.r+'">'+esc(L.rar[x.r])+'</span><span class="mko-card-name">'+esc(name)+'</span>'+
   (x.fresh?'':'<span class="mko-dupe">'+esc(L.dupe(x.dupe))+'</span>')+'</div>';
 }
 let opening=null;
 function openChest(res){
  if(opening)return;const L=t(),c=res.chest,r=c.r,items=res.rewards;
  const o=document.createElement('div');o.className='mko';o.dataset.r=r;o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label',c.gift?L.gift:L.chest(r));if(lang()==='ar')o.dir='rtl';
  let shards='';for(let k=0;k<18;k++){const a=(k/18)*Math.PI*2+(k%3)*.2,d=150+(k%5)*38;shards+='<i class="mko-shard" style="--dx:'+Math.round(Math.cos(a)*d)+'px;--dy:'+Math.round(Math.sin(a)*d*.85-60)+'px;--rx:'+(200+k*37)%540+'deg;--ry:'+(120+k*53)%540+'deg;--sz:'+(9+(k*7)%16)+'px;--d:'+(k%4)*25+'ms"></i>'}
  o.innerHTML='<div class="mko-flash"></div><div class="mko-stage"><span class="mko-rays"></span><span class="mko-beam"></span><span class="mko-shock"></span>'+shards+
   '<div class="mko-chest"><img class="mko-img closed" src="assets/design/market/chest-'+r+'.webp" alt=""><img class="mko-img lid" src="assets/design/market/chest-'+r+'.webp" alt=""><img class="mko-img open" src="assets/design/market/chest-open-'+r+'.webp" alt=""></div>'+
   '<span class="mko-count" hidden></span></div><div class="mko-show" aria-live="polite"></div><p class="mko-hint"></p>';
  (document.getElementById('phone')||document.body).append(o);opening=o;
  requestAnimationFrame(()=>o.classList.add('in'));
  const chest=o.querySelector('.mko-chest'),show=o.querySelector('.mko-show'),count=o.querySelector('.mko-count'),hint=o.querySelector('.mko-hint');
  let taps=0,phase='closed',idx=-1,busy=false;
  const later=(fn,ms)=>setTimeout(fn,reduced()?0:ms);
  function next(){
   idx++;
   if(idx>=items.length){return summary()}
   const x=items[idx],left=items.length-idx-1;count.hidden=left<=0;count.textContent=String(left);
   show.innerHTML=rewardCard(x,true);const card=show.firstElementChild;
   o.dataset.cr=x.r;o.classList.remove('pop');void o.offsetWidth;o.classList.add('pop');
   snd(x.kind==='animal'||x.r==='legendary'?'reward':'pop');haptic(x.kind==='animal'||x.r==='legendary'||x.r==='epic'?'tap':'select');
   hint.textContent=L.tapNext;busy=true;later(()=>{busy=false},420);
   card.focus?.();
  }
  function summary(){
   phase='summary';o.classList.add('summary');count.hidden=true;hint.textContent='';
   const outfits=items.some(x=>x.kind==='outfit'&&x.fresh);let soon=false;try{soon=!!(window.DEEN_COMPANIONS&&DEEN_COMPANIONS.soon&&DEEN_COMPANIONS.soon())}catch(_){}
   show.innerHTML='<div class="mko-sum"><h3>'+esc(L.got)+'</h3><div class="mko-grid">'+items.map(x=>rewardCard(x,false)).join('')+'</div>'+
    (outfits?'<p class="mko-note">'+esc(soon?L.wardrobeSoon:L.wardrobeAdded)+'</p>':'')+'<button type="button" class="mko-done">'+esc(L.done)+'</button></div>';
   show.querySelector('.mko-done').addEventListener('click',e=>{e.stopPropagation();close()});
   show.querySelector('.mko-done').focus?.();
  }
  function close(){if(!opening)return;opening=null;o.classList.remove('in');setTimeout(()=>o.remove(),260);if(isActive())render()}
  o.addEventListener('click',()=>{
   if(busy||phase==='summary')return;
   if(phase==='closed'){
    taps++;
    if(taps<3){chest.classList.remove('tl','tr');void chest.offsetWidth;chest.classList.add(taps===1?'tr':'tl','hop');later(()=>chest.classList.remove('hop'),460);snd('chestTap'+taps);haptic('select');return}
    phase='breaking';busy=true;chest.classList.remove('tl','tr');chest.classList.add('build');snd('chestTap3');haptic('tap');
    later(()=>{o.classList.add('opened');snd('reward');haptic('tap');later(()=>{phase='reveal';o.classList.add('reveal');busy=false;next()},900)},620);
    return;
   }
   if(phase==='reveal')next();
  });
  o.addEventListener('keydown',e=>{if(e.key==='Escape'&&phase==='summary')close()});
 }
 function toast(msg){try{if(typeof window.toast==='function'){window.toast(msg);return}}catch(_){}
  const el=document.createElement('div');el.className='mk-toast';el.textContent=msg;(document.getElementById('phone')||document.body).append(el);setTimeout(()=>el.remove(),2600)}

 // ---- Screen, tab and events ----
 const isActive=()=>!!document.getElementById('marketScreen')?.classList.contains('active');
 function ensure(){
  const nav=document.querySelector('nav.bottomnav');if(!nav)return false;
  if(!document.getElementById('marketScreen')){
   const sec=document.createElement('section');sec.className='screen';sec.id='marketScreen';nav.before(sec);
   sec.addEventListener('click',e=>{
    const pet=e.target.closest('.mk-pet');if(pet){outfitAnimal=pet.dataset.pet;haptic('select');render();return}
    const c=e.target.closest('[data-i]');if(c){haptic('tap');openSheet(ITEMS[+c.dataset.i])}
   });
  }
  let btn=nav.querySelector('button.navbtn[data-screen="marketScreen"]');
  if(!btn){btn=document.createElement('button');btn.type='button';btn.className='navbtn';btn.dataset.screen='marketScreen';btn.innerHTML=BAG+'<span></span>';
   btn.addEventListener('click',()=>{try{navigate('marketScreen')}catch(_){}});
   const prof=nav.querySelector('button.navbtn[data-screen="profileScreen"]');prof?nav.insertBefore(btn,prof):nav.append(btn)}
  const label=t().tab,span=btn.querySelector('span');if(span&&span.textContent!==label)span.textContent=label;
  if(btn.getAttribute('aria-label')!==label)btn.setAttribute('aria-label',label);
  return true;
 }
 let timer=0,lastLang='';
 function tick(){
  if(!ensure())return;
  const on=isActive();
  if(on&&!timer){loadOutfits();render();lastLang=lang();timer=setInterval(()=>{if(!isActive()){clearInterval(timer);timer=0;closeSheet();return}
   const el=document.getElementById('mkTimer');if(el)el.textContent=countdown();if(lang()!==lastLang){lastLang=lang();render()}},1000)}
 }
 function install(){
  if(!document.body){setTimeout(install,50);return}
  tick();loadOutfits();
  new MutationObserver(()=>tick()).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class','lang'],childList:true});
  setInterval(()=>{ensure()},1500);
 }
 // The tab goes into the bar at once (the bar is already in the page when this script runs), before the native iOS tab
 // bar is first drawn, so it is drawn once with all five tabs.
 try{ensure()}catch(_){}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 window.DEEN_MARKET=Object.freeze({version:'market-2',gift:Object.assign({},GIFT),roll:c=>roll(c),buyChest,openChest,isOpening:()=>!!opening,rarities:RARITY.slice(),animalRarity:Object.assign({},ANIMAL_RARITY),chests:CHESTS.map(c=>({...c,odds:c.odds.slice()})),outfitRarity,render,open:()=>{try{navigate('marketScreen')}catch(_){}}});
})();
