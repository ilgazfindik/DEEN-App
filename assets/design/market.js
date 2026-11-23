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
 const CHESTS=[
  {r:'common',price:60,items:2,odds:[80,18,2,0]},
  {r:'rare',price:150,items:3,odds:[45,45,9,1]},
  {r:'epic',price:300,items:4,odds:[15,45,35,5]},
  {r:'legendary',price:600,items:5,odds:[0,30,50,20]}
 ];
 const ANIMALS=['lion','cat','wolf','owl','turtle','eagle'];

 const T={
  tr:{tab:'Market',title:'Market',deals:'Günün Teklifleri',refresh:'Yenilenme',chests:'Sandıklar',animals:'Yol Arkadaşları',outfits:'Kıyafetler',guide:'Nadirlik',
   free:'ÜCRETSİZ',gift:'Günlük hediye',chest:r=>({common:'Sıradan',rare:'Ender',epic:'Nadir',legendary:'Efsanevi'}[r])+' Sandık',
   rar:{common:'Sıradan',rare:'Ender',epic:'Nadir',legendary:'Efsanevi'},items:n=>n+' eşya',fromChest:'Sandıktan',soon:'Yakında',
   soonToast:'Market çok yakında açılıyor. Pırıltılarını biriktirmeye devam et!',owned:'Sende',
   animalsNote:'Yol arkadaşları yakında sandıklardan çıkacak.',chances:'Bir eşyanın nadirlik olasılığı',inside:'İçinden: kıyafetler ve Pırıltı; Nadir ve üstünde yol arkadaşı da çıkabilir.',
   outfitFor:'Kimin için?',outfitDesc:'Yol arkadaşının giyebileceği kıyafet.',animalDesc:'Yeni bir yol arkadaşı.',giftDesc:'Her gün bir küçük hediye.',
   guideTx:{common:'Kolayca bulunur.',rare:'Daha az çıkar.',epic:'Az bulunur, özel parçalar.',legendary:'En değerli ve en zor bulunan.'},
   honest:'Pırıltı yalnızca öğrenerek kazanılır; gerçek parayla satılmaz. Sandıkların olasılıkları açıkça gösterilir.',
   balance:'Pırıltın',close:'Kapat',buy:'Satın al',discount:'İNDİRİM',animal:{lion:'Aslan',cat:'Kedi',wolf:'Kurt',owl:'Baykuş',turtle:'Kaplumbağa',eagle:'Kartal'}},
  en:{tab:'Shop',title:'Shop',deals:'Daily Deals',refresh:'Refreshes in',chests:'Chests',animals:'Companions',outfits:'Outfits',guide:'Rarity',
   free:'FREE',gift:'Daily gift',chest:r=>({common:'Common',rare:'Rare',epic:'Epic',legendary:'Legendary'}[r])+' Chest',
   rar:{common:'Common',rare:'Rare',epic:'Epic',legendary:'Legendary'},items:n=>n+' items',fromChest:'From chests',soon:'Soon',
   soonToast:'The shop opens very soon. Keep collecting Sparkles!',owned:'Owned',
   animalsNote:'Companions will soon come from chests.',chances:'Rarity chance per item',inside:'Inside: outfits and Sparkles; from Epic up, a companion too.',
   outfitFor:'For whom?',outfitDesc:'An outfit your companion can wear.',animalDesc:'A new companion.',giftDesc:'A small gift every day.',
   guideTx:{common:'Easy to find.',rare:'Turns up less often.',epic:'Hard to find, special pieces.',legendary:'The rarest and most precious.'},
   honest:'Sparkles are earned by learning only and are never sold for real money. Chest chances are shown openly.',
   balance:'Your Sparkles',close:'Close',buy:'Buy',discount:'SALE',animal:{lion:'Lion',cat:'Cat',wolf:'Wolf',owl:'Owl',turtle:'Turtle',eagle:'Eagle'}},
  de:{tab:'Shop',title:'Shop',deals:'Tagesangebote',refresh:'Neu in',chests:'Truhen',animals:'Begleiter',outfits:'Outfits',guide:'Seltenheit',
   free:'GRATIS',gift:'Tagesgeschenk',chest:r=>({common:'Gewöhnliche',rare:'Seltene',epic:'Epische',legendary:'Legendäre'}[r])+' Truhe',
   rar:{common:'Gewöhnlich',rare:'Selten',epic:'Episch',legendary:'Legendär'},items:n=>n+' Teile',fromChest:'Aus Truhen',soon:'Bald',
   soonToast:'Der Shop öffnet sehr bald. Sammle weiter Funkeln!',owned:'Im Besitz',
   animalsNote:'Begleiter kommen bald aus Truhen.',chances:'Seltenheit pro Teil',inside:'Inhalt: Outfits und Funkeln; ab Episch auch ein Begleiter.',
   outfitFor:'Für wen?',outfitDesc:'Ein Outfit für deinen Begleiter.',animalDesc:'Ein neuer Begleiter.',giftDesc:'Jeden Tag ein kleines Geschenk.',
   guideTx:{common:'Leicht zu finden.',rare:'Seltener zu finden.',epic:'Schwer zu finden, besondere Teile.',legendary:'Das Seltenste und Wertvollste.'},
   honest:'Funkeln gibt es nur fürs Lernen, nie für echtes Geld. Die Chancen der Truhen werden offen gezeigt.',
   balance:'Deine Funkeln',close:'Schließen',buy:'Kaufen',discount:'RABATT',animal:{lion:'Löwe',cat:'Katze',wolf:'Wolf',owl:'Eule',turtle:'Schildkröte',eagle:'Adler'}},
  fr:{tab:'Boutique',title:'Boutique',deals:'Offres du jour',refresh:'Nouveau dans',chests:'Coffres',animals:'Compagnons',outfits:'Tenues',guide:'Rareté',
   free:'GRATUIT',gift:'Cadeau du jour',chest:r=>'Coffre '+({common:'commun',rare:'rare',epic:'épique',legendary:'légendaire'}[r]),
   rar:{common:'Commun',rare:'Rare',epic:'Épique',legendary:'Légendaire'},items:n=>n+' objets',fromChest:'Dans les coffres',soon:'Bientôt',
   soonToast:'La boutique ouvre très bientôt. Continue à gagner des Éclats !',owned:'Possédé',
   animalsNote:'Les compagnons viendront bientôt des coffres.',chances:'Chance de rareté par objet',inside:'Contenu : tenues et Éclats ; à partir d’Épique, un compagnon aussi.',
   outfitFor:'Pour qui ?',outfitDesc:'Une tenue pour ton compagnon.',animalDesc:'Un nouveau compagnon.',giftDesc:'Un petit cadeau chaque jour.',
   guideTx:{common:'Facile à trouver.',rare:'Plus rare.',epic:'Difficile à trouver, pièces spéciales.',legendary:'Le plus rare et le plus précieux.'},
   honest:'Les Éclats se gagnent uniquement en apprenant et ne sont jamais vendus contre de l’argent. Les chances des coffres sont affichées.',
   balance:'Tes Éclats',close:'Fermer',buy:'Acheter',discount:'PROMO',animal:{lion:'Lion',cat:'Chat',wolf:'Loup',owl:'Hibou',turtle:'Tortue',eagle:'Aigle'}},
  ar:{tab:'المتجر',title:'المتجر',deals:'عروض اليوم',refresh:'يتجدد بعد',chests:'الصناديق',animals:'الرفاق',outfits:'الملابس',guide:'الندرة',
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
  if(it.kind==='gift')return '<span class="mk-price free">'+esc(L.free)+'</span>';
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
  const odds=it.kind==='chest'?'<div class="mk-odds"><small>'+esc(L.chances)+'</small>'+RARITY.map((k,i)=>'<div class="mk-odd" data-r="'+k+'"><span>'+esc(L.rar[k])+'</span><i><em style="width:'+it.odds[i]+'%"></em></i><b>'+pct(it.odds[i])+'</b></div>').join('')+'</div>':'';
  const price=it.kind==='gift'?esc(L.free):it.kind==='animal'?esc(L.fromChest):GEM+'<b>'+priceOf(it)+'</b>';
  s.innerHTML='<div class="mk-sheet-back"></div><div class="mk-sheet-card" data-r="'+r+'"><button type="button" class="mk-sheet-x" aria-label="'+esc(L.close)+'">×</button>'+
   '<div class="mk-sheet-art" data-r="'+r+'"><span class="mk-sheet-rays"></span>'+big+'</div><span class="mk-rar big" data-r="'+r+'">'+esc(L.rar[r])+'</span>'+
   '<h3>'+esc(nameOf(it))+'</h3><p>'+esc(desc)+'</p>'+odds+
   '<button type="button" class="mk-buy"><span class="mk-buy-in">'+price+'</span><span class="mk-soon">'+esc(L.soon)+'</span></button></div>';
  (document.getElementById('phone')||document.body).append(s);sheet=s;
  requestAnimationFrame(()=>requestAnimationFrame(()=>s.classList.add('in')));
  s.querySelector('.mk-sheet-back').addEventListener('click',closeSheet);s.querySelector('.mk-sheet-x').addEventListener('click',closeSheet);
  s.querySelector('.mk-buy').addEventListener('click',()=>{haptic('tap');const b=s.querySelector('.mk-buy');b.classList.remove('nope');void b.offsetWidth;b.classList.add('nope');toast(L.soonToast)});
  s.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
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
 window.DEEN_MARKET=Object.freeze({version:'market-1',rarities:RARITY.slice(),animalRarity:Object.assign({},ANIMAL_RARITY),chests:CHESTS.map(c=>({...c,odds:c.odds.slice()})),outfitRarity,render,open:()=>{try{navigate('marketScreen')}catch(_){}}});
})();
