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
  heart:SV('<path fill="#ff7a8f" stroke="#c44058" stroke-width="1" stroke-linejoin="round" d="M12 20.5S3.5 15 3.5 9.2A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.5 2.2C20.5 15 12 20.5 12 20.5z"/>')
 };
 const ITEMS=[
  {id:'bg_dune',kind:'bg',cost:30,css:'linear-gradient(160deg,#e9b26a,#7d3f2b)'},
  {id:'bg_night',kind:'bg',cost:30,css:'radial-gradient(circle at 22% 24%,#fff 0 1px,transparent 2px),radial-gradient(circle at 72% 18%,#fff 0 1.2px,transparent 2.4px),radial-gradient(circle at 82% 62%,rgba(255,255,255,.7) 0 1px,transparent 2px),linear-gradient(160deg,#25316e,#080c24)'},
  {id:'bg_garden',kind:'bg',cost:30,css:'linear-gradient(160deg,#5fbf8a,#124c3a)'},
  {id:'bg_dawn',kind:'bg',cost:40,css:'linear-gradient(180deg,#ffd29a,#f08fa0 55%,#6d5aa8)'},
  {id:'bg_sea',kind:'bg',cost:40,css:'linear-gradient(180deg,#8fe3f0,#1b78a8 58%,#0b3358)'},
  {id:'bg_rose',kind:'bg',cost:40,css:'radial-gradient(circle at 70% 28%,#ffc2d1,#d6587b 55%,#5b1f3f)'},
  {id:'bg_geo',kind:'bg',cost:60,css:'radial-gradient(circle,#f2cf75 0 1.6px,transparent 2.2px) 0 0/16px 16px,repeating-conic-gradient(#0f6a57 0 25%,#137d68 0 50%) 0 0/16px 16px'},
  {id:'bg_gold',kind:'bg',cost:80,css:'radial-gradient(circle at 30% 24%,#fff3b8,#e2b04a 46%,#8a5a14)'},
  {id:'fr_gold',kind:'fr',cost:50,css:'0 0 0 3px #f4c95d,0 0 14px rgba(244,201,93,.55)'},
  {id:'fr_emerald',kind:'fr',cost:50,css:'0 0 0 3px #37d6a3,0 0 14px rgba(55,214,163,.5)'},
  {id:'fr_amethyst',kind:'fr',cost:60,css:'0 0 0 3px #a78bfa,0 0 14px rgba(167,139,250,.55)'},
  {id:'fr_nur',kind:'fr',cost:80,css:'0 0 0 3px #fff,0 0 0 6px #8cebd0,0 0 18px rgba(140,235,208,.6)'},
  {id:'ac_star',kind:'ac',cost:45,svg:'star'},
  {id:'ac_moon',kind:'ac',cost:45,svg:'moon'},
  {id:'ac_leaf',kind:'ac',cost:45,svg:'leaf'},
  {id:'ac_lamp',kind:'ac',cost:55,svg:'lamp'},
  {id:'ac_book',kind:'ac',cost:55,svg:'book'},
  {id:'ac_heart',kind:'ac',cost:55,svg:'heart'}
 ];
 const IT2={
  tr:{bg_dawn:'Fecr',bg_sea:'Deniz',bg_rose:'Gül',bg_geo:'Geometri',bg_gold:'Altın',fr_gold:'Altın',fr_emerald:'Zümrüt',fr_amethyst:'Ametist',fr_nur:'Nur',ac_lamp:'Fener',ac_book:'Kitap',ac_heart:'Kalp'},
  en:{bg_dawn:'Dawn',bg_sea:'Sea',bg_rose:'Rose',bg_geo:'Pattern',bg_gold:'Gold',fr_gold:'Gold',fr_emerald:'Emerald',fr_amethyst:'Amethyst',fr_nur:'Light',ac_lamp:'Lantern',ac_book:'Book',ac_heart:'Heart'},
  de:{bg_dawn:'Morgenrot',bg_sea:'Meer',bg_rose:'Rosé',bg_geo:'Muster',bg_gold:'Gold',fr_gold:'Gold',fr_emerald:'Smaragd',fr_amethyst:'Amethyst',fr_nur:'Licht',ac_lamp:'Laterne',ac_book:'Buch',ac_heart:'Herz'},
  fr:{bg_dawn:'Aube',bg_sea:'Mer',bg_rose:'Rose',bg_geo:'Motif',bg_gold:'Or',fr_gold:'Or',fr_emerald:'Émeraude',fr_amethyst:'Améthyste',fr_nur:'Lumière',ac_lamp:'Lanterne',ac_book:'Livre',ac_heart:'Cœur'},
  ar:{bg_dawn:'الفجر',bg_sea:'البحر',bg_rose:'الورد',bg_geo:'زخرفة',bg_gold:'الذهب',fr_gold:'ذهبي',fr_emerald:'زمردي',fr_amethyst:'جمشتي',fr_nur:'نور',ac_lamp:'فانوس',ac_book:'كتاب',ac_heart:'قلب'}
 };
 const OUTFIT_LABEL={tr:'Kıyafet',en:'Outfit',de:'Outfit',fr:'Tenue',ar:'ملابس'};
 const FR={tr:'Çerçeve',en:'Frame',de:'Rahmen',fr:'Cadre',ar:'إطار'};
 const itName=id=>(T().it[id]||IT2[lang()][id]||id);
 /* Layered outfits: full-body art + transparent clothing layers drawn on the same canvas (512x768).
    Layers come from assets/companions/outfits.json so new art needs no code change. */
 const BODY=['cat','lion'];
 const OUT={list:[],loaded:false};
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
  Object.keys(own).forEach(slot=>{const o=outItem(own[slot]);if(o&&o.art&&o.art[a]&&o.slot===slot)w[slot]=o.id});
  return w;
 }
 function loadOutfits(){
  if(OUT.loaded)return;OUT.loaded=true;
  try{fetch('assets/companions/outfits.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(j=>{
   if(!j||!Array.isArray(j.items))return;
   OUT.list=j.items.filter(o=>o&&/^ot_[a-z0-9_]+$/.test(o.id||'')&&['head','neck','body','hand'].includes(o.slot)&&o.art&&typeof o.art==='object'&&Number.isFinite(Number(o.cost)));
   try{refresh()}catch(_){}
  }).catch(()=>{})}catch(_){}
 }
 const S={
  tr:{next:(a,n,x)=>'Sıradaki: '+a+' · Seviye '+n+' (' + x + ' XP kaldı)',all:'Tüm hayvanlar açık!',cele:'Yeni yol arkadaşı!',keep:'Şimdilik kalsın',room:'Hayvan Odası',animals:'Hayvanlar',wardrobe:'Gardırop',lv:n=>'Seviye '+n,locked:n=>'Seviye '+n+' ile açılır',use:'Seç',active:'Seçili',
   unlock:(a,n)=>a+' açıldı! Hayvan Odası’ndan seçebilirsin.',lockedToast:(a,n)=>a+' için seviye '+n+' gerekiyor.',bg:'Arka plan',ac:'Rozet',none:'Yok',
   buy:c=>c+' ◇ ile al',equip:'Tak',off:'Çıkar',on:'Takılı',need:'Yeterli Pırıltı yok',bought:'Gardıroba eklendi',
   hint:'Pırıltıyı günlük ve haftalık sandıklardan, serilerden ve derslerden kazanırsın.',
   it:{bg_dune:'Çöl',bg_night:'Gece',bg_garden:'Bahçe',ac_star:'Yıldız',ac_moon:'Hilal',ac_leaf:'Yaprak'}},
  en:{next:(a,n,x)=>'Next: '+a+' · Level '+n+' ('+x+' XP to go)',all:'All animals unlocked!',cele:'New companion!',keep:'Maybe later',room:'Animal Room',animals:'Animals',wardrobe:'Wardrobe',lv:n=>'Level '+n,locked:n=>'Unlocks at level '+n,use:'Choose',active:'Chosen',
   unlock:a=>a+' unlocked! You can choose it in the Animal Room.',lockedToast:(a,n)=>a+' unlocks at level '+n+'.',bg:'Backdrop',ac:'Badge',none:'None',
   buy:c=>'Get for '+c+' ◇',equip:'Wear',off:'Remove',on:'Worn',need:'Not enough Sparkles',bought:'Added to your wardrobe',
   hint:'You earn Sparkles from daily and weekly chests, streaks and lessons.',
   it:{bg_dune:'Desert',bg_night:'Night',bg_garden:'Garden',ac_star:'Star',ac_moon:'Crescent',ac_leaf:'Leaf'}},
  de:{next:(a,n,x)=>'Als Nächstes: '+a+' · Stufe '+n+' (noch '+x+' XP)',all:'Alle Tiere freigeschaltet!',cele:'Neuer Begleiter!',keep:'Vielleicht später',room:'Tierzimmer',animals:'Tiere',wardrobe:'Garderobe',lv:n=>'Stufe '+n,locked:n=>'Ab Stufe '+n,use:'Wählen',active:'Gewählt',
   unlock:a=>a+' freigeschaltet! Du kannst es im Tierzimmer wählen.',lockedToast:(a,n)=>a+' wird auf Stufe '+n+' freigeschaltet.',bg:'Hintergrund',ac:'Abzeichen',none:'Keins',
   buy:c=>'Für '+c+' ◇ holen',equip:'Anlegen',off:'Ablegen',on:'Getragen',need:'Nicht genug Funken',bought:'Zur Garderobe hinzugefügt',
   hint:'Funken verdienst du mit täglichen und wöchentlichen Truhen, Serien und Lektionen.',
   it:{bg_dune:'Wüste',bg_night:'Nacht',bg_garden:'Garten',ac_star:'Stern',ac_moon:'Halbmond',ac_leaf:'Blatt'}},
  fr:{next:(a,n,x)=>'Prochain : '+a+' · niveau '+n+' ('+x+' XP restants)',all:'Tous les animaux sont débloqués !',cele:'Nouveau compagnon !',keep:'Plus tard',room:'Salle des animaux',animals:'Animaux',wardrobe:'Garde-robe',lv:n=>'Niveau '+n,locked:n=>'Se débloque au niveau '+n,use:'Choisir',active:'Choisi',
   unlock:a=>a+' débloqué ! Tu peux le choisir dans la salle des animaux.',lockedToast:(a,n)=>a+' se débloque au niveau '+n+'.',bg:'Décor',ac:'Badge',none:'Aucun',
   buy:c=>'Obtenir pour '+c+' ◇',equip:'Porter',off:'Retirer',on:'Porté',need:'Pas assez d’étincelles',bought:'Ajouté à la garde-robe',
   hint:'Tu gagnes des étincelles avec les coffres quotidiens et hebdomadaires, les séries et les leçons.',
   it:{bg_dune:'Désert',bg_night:'Nuit',bg_garden:'Jardin',ac_star:'Étoile',ac_moon:'Croissant',ac_leaf:'Feuille'}},
  ar:{next:(a,n,x)=>'التالي: '+a+' · المستوى '+n+' (باقي '+x+' نقطة خبرة)',all:'تم فتح جميع الحيوانات!',cele:'رفيق جديد!',keep:'لاحقًا',room:'غرفة الحيوانات',animals:'الحيوانات',wardrobe:'خزانة الملابس',lv:n=>'المستوى '+n,locked:n=>'يُفتح عند المستوى '+n,use:'اختيار',active:'مختار',
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
 function unlocked(id){
  const m=meta();if(!LEVELS[id])return false;
  return LEVELS[id]<=lvl()||!!(m&&m.owned.includes(id));
 }
 function save(){try{saveState()}catch(_){}}
 function announce(){
  const st=app(),m=meta();if(!st||!m||!st.onboarded)return;
  const fresh=ORDER.filter(id=>unlocked(id)&&!m.seen.includes(id));
  if(!fresh.length)return;
  const first=!m.seen.length&&!m.announced;
  fresh.forEach(id=>m.seen.push(id));
  if(first){m.announced=1;save();return} // first run: record what is already open without a toast
  m.announced=1;save();
  const last=fresh[fresh.length-1];
  const busy=document.querySelector('#v5Sheet[open],#lesson.active,#v998Onboarding');
  if(!busy&&typeof window.sheet==='function'){
   const t=T();
   try{window.sheet(t.cele,'<div class="dcz" dir="'+(lang()==='ar'?'rtl':'ltr')+'" style="text-align:center">'+stage(last,120)+'<p><b>'+esc(N(last))+'</b></p><p>'+esc(t.unlock(N(last)))+'</p><div class="dcz-tabs"><button type="button" class="on" data-dcz="pick" data-id="'+last+'">'+esc(t.use)+'</button><button type="button" data-dcz="open" data-id="animals">'+esc(t.keep)+'</button></div></div>');return}catch(_){}
  }
  try{toast(T().unlock(N(last)))}catch(_){}
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
  const st=app(),m=meta(),it=item(id);if(!st||!m||!it||m.items.includes(id))return false;
  if((Number(st.currency)||0)<it.cost)return false;
  st.currency-=it.cost;m.items.push(id);
  if(it.slot)toggleItem(id);else m.eq[it.kind]=id;
  save();try{updateUI()}catch(_){}
  return true;
 }
 function toggleItem(id){
  const m=meta(),it=item(id);if(!m||!it||!(m.items.includes(id)||it.default===true))return;
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
 function stage(id,size){
  const m=meta(),bg=item(m?.eq?.bg),ac=item(m?.eq?.ac),fr=item(m?.eq?.fr);
  return '<span class="dcz-stage" style="width:'+size+'px;height:'+size+'px"'+(bg?' data-dcz-bg="'+bg.id+'"':'')+(fr?' data-dcz-fr="'+fr.id+'"':'')+'><img src="'+avatarSrc(id)+'" alt="" loading="lazy" onerror="this.replaceWith(document.createTextNode(\''+EMOJI[id]+'\'))">'+badgeHtml(ac)+'</span>';
 }
 function bodyStage(id){
  const m=meta(),bg=item(m?.eq?.bg),fr=item(m?.eq?.fr),ac=item(m?.eq?.ac),w=wornOutfit(id);
  const worn=Object.values(w).map(oid=>outItem(oid)).filter(o=>o&&o.art&&o.art[id]);
  // A body outfit marked "full" is the whole dressed character (background removed): it replaces the plain body picture.
  const fullO=worn.find(o=>o.slot==='body'&&o.full===true),baseSrc=fullO?fullO.art[id]:bodySrc(id);
  const layers=worn.filter(o=>o!==fullO).sort((a,b)=>(Number(a.z)||0)-(Number(b.z)||0));
  return '<span class="dcz-body"'+(bg?' data-dcz-bg="'+bg.id+'"':'')+(fr?' data-dcz-fr="'+fr.id+'"':'')+'><img class="dcz-base" src="'+esc(baseSrc)+'" alt="">'+layers.map(o=>'<img class="dcz-layer" data-slot="'+o.slot+'" style="z-index:'+(Number(o.z)||10)+'" src="'+esc(o.art[id])+'" alt="">').join('')+badgeHtml(ac)+'</span>';
 }
 let tab='animals';
 function outfitHtml(pv,m,t){
  const list=outFor(pv);if(!list.length||!fullBody(pv))return '';
  const w=wornOutfit(pv);
  return '<h4>'+esc(OUTFIT_LABEL[lang()])+'</h4><div class="dcz-items">'+list.map(o=>{
   const dflt=o.default===true,own=dflt||m.items.includes(o.id),worn=w[o.slot]===o.id;
   const label=own?(worn?(dflt?t.on:t.off):t.equip):t.buy(Number(o.cost));
   return '<button type="button" class="dcz-item'+(worn?' on':'')+(own?' own':'')+'" data-dcz="item" data-id="'+esc(o.id)+'"><span class="dcz-ic dcz-ic-ot"><img src="'+esc(o.art[pv])+'" alt=""></span><b>'+esc(outName(o))+'</b><small>'+esc(worn&&dflt?t.on:label)+'</small></button>';
  }).join('')+'</div>';
 }
 function html(){
  const t=T(),st=app(),m=meta(),cur=String(st.profile?.companion||'');
  let body;
  if(tab==='animals'){
   const nx=nextLock();
   body=(nx?'<p class="dcz-next">'+esc(t.next(N(nx),LEVELS[nx],Math.max(0,xpFor(LEVELS[nx])-(Number(st.xp)||0))))+'</p>':'<p class="dcz-next">'+esc(t.all)+'</p>')+'<div class="dcz-grid">'+ORDER.map(id=>{
    const ok=unlocked(id),on=cur===id;
    return '<button type="button" class="dcz-card'+(ok?'':' locked')+(on?' on':'')+'" data-dcz="'+(ok?'pick':'lock')+'" data-id="'+id+'" aria-disabled="'+(ok?'false':'true')+'">'+
     (ok?stage(id,76):'<span class="dcz-stage dcz-dim" style="width:76px;height:76px"><img src="'+avatarSrc(id)+'" alt="" loading="lazy"><b class="dcz-lock">🔒</b></span>')+
     '<b>'+esc(N(id))+'</b><small>'+esc(ok?(on?t.active:t.use):t.locked(LEVELS[id]))+'</small></button>';
   }).join('')+'</div>';
  }else{
   const kinds=['bg','fr','ac'],owned=m.items.length;
   const pv=cur&&ORDER.includes(cur)?cur:'lion',full=fullBody(pv);
   body='<div class="dcz-prev'+(full?' dcz-prev-body':'')+'">'+(full?bodyStage(pv):stage(pv,104))+'<b>'+esc(N(cur&&ORDER.includes(cur)?cur:'lion'))+'</b><small>'+esc(owned+' / '+ITEMS.length)+'</small></div>'+kinds.map(k=>
    '<h4>'+esc(k==='fr'?FR[lang()]:t[k])+'</h4><div class="dcz-items">'+ITEMS.filter(i=>i.kind===k).map(i=>{
     const own=m.items.includes(i.id),worn=m.eq[k]===i.id;
     const label=own?(worn?t.off:t.equip):t.buy(i.cost);
     const sw=k==='ac'?ICON[i.svg]:'';
     return '<button type="button" class="dcz-item'+(worn?' on':'')+(own?' own':'')+'" data-dcz="item" data-id="'+i.id+'"><span class="dcz-ic"'+(k==='bg'?' data-dcz-bg="'+i.id+'"':k==='fr'?' data-dcz-fr="'+i.id+'"':'')+'>'+sw+'</span><b>'+esc(itName(i.id))+'</b><small>'+esc(worn?t.on:label)+'</small></button>';
    }).join('')+'</div>').join('')+outfitHtml(pv,m,t)+'<p class="dcz-hint">'+esc(t.hint)+'</p>';
  }
  return '<div class="dcz" dir="'+(lang()==='ar'?'rtl':'ltr')+'"><div class="dcz-tabs" role="tablist"><button type="button" role="tab" class="'+(tab==='animals'?'on':'')+'" data-dcz="tab" data-id="animals">'+esc(t.animals)+'</button><button type="button" role="tab" class="'+(tab==='wardrobe'?'on':'')+'" data-dcz="tab" data-id="wardrobe">'+esc(t.wardrobe)+'</button></div>'+
   '<div class="dcz-cur">◇ '+(Number(st.currency)||0)+' · '+esc(t.lv(lvl()))+'</div>'+body+'</div>';
 }
 function open(which){
  loadOutfits();
  if(!app()||typeof window.sheet!=='function')return false;
  if(which)tab=which;
  window.sheet(T().room,html());
  return true;
 }
 function refresh(){
  const box=document.querySelector('.dcz');if(!box)return;
  const y=box.closest('.sheet,#v5Sheet,[role=dialog]')?.scrollTop;
  const tmp=document.createElement('div');tmp.innerHTML=html();box.replaceWith(tmp.firstChild);
  if(y!=null){const p=document.querySelector('.dcz')?.closest('.sheet,#v5Sheet,[role=dialog]');if(p)p.scrollTop=y}
 }
 document.addEventListener('click',ev=>{
  const el=ev.target.closest?.('[data-dcz]');
  if(el){
   const a=el.dataset.dcz,id=el.dataset.id;
   if(a==='tab'){tab=id;refresh()}
   else if(a==='open'){open('animals');ev.preventDefault();return}
   else if(a==='pick'){if(select(id)){try{closeSheet()}catch(_){}}}
   else if(a==='lock'){try{toast(T().lockedToast(N(id),LEVELS[id]))}catch(_){}}
   else if(a==='item'){
    const m=meta();
    if(m.items.includes(id)||item(id)?.default===true)toggleItem(id);
    else if(buyItem(id)){try{toast(T().bought)}catch(_){}}
    else{try{toast(T().need)}catch(_){}}
    refresh();
   }
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
  // Entry button in the profile header.
  const top=document.querySelector('#profileScreenBody .dsp-id');
  if(top&&!document.getElementById('dczEntry')){
   const b=document.createElement('button');b.type='button';b.id='dczEntry';b.className='dcz-entry';b.dataset.dczOpen='1';
   b.textContent='🐾 '+T().room;top.after(b);
  }else{const e=document.getElementById('dczEntry'),tx='🐾 '+T().room;if(e&&e.textContent!==tx)e.textContent=tx}
  // Wardrobe on the profile avatar.
  const slot=document.querySelector('#profileScreenBody .dsp-avatar-slot'),m=meta();
  if(slot&&m){
   const bg=item(m.eq.bg),ac=item(m.eq.ac),fr=item(m.eq.fr);
   if(bg)slot.dataset.dczBg=bg.id;else delete slot.dataset.dczBg;
   if(fr)slot.dataset.dczFr=fr.id;else delete slot.dataset.dczFr;
   let badge=slot.querySelector('.dcz-badge');
   if(ac){const h=ICON[ac.svg];if(!badge){badge=document.createElement('i');badge.className='dcz-badge';slot.appendChild(badge)}if(badge.dataset.k!==ac.svg){badge.dataset.k=ac.svg;badge.innerHTML=h}}else badge?.remove();
  }
 }
 document.addEventListener('click',ev=>{if(ev.target.closest?.('[data-dcz-open]')){ev.preventDefault();open('animals')}});
 const css=document.createElement('style');css.id='dcz-style';css.textContent=`
.dcz{display:block;color:inherit}
.dcz-tabs{display:flex;gap:8px;margin:2px 0 10px}
.dcz-tabs button{flex:1;min-height:44px;border-radius:12px;border:1px solid rgba(140,235,208,.35);background:rgba(255,255,255,.06);color:inherit;font:600 14px/1 inherit;cursor:pointer}
.dcz-tabs button.on{background:#8cebd0;color:#06232a}
.dcz-cur{font:600 13px/1 inherit;opacity:.85;margin:0 2px 10px}
.dcz-next{font-size:13px;opacity:.85;margin:0 2px 10px}
.dcz-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.dcz-card{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px;min-height:150px;border-radius:16px;border:1px solid rgba(140,235,208,.3);background:rgba(255,255,255,.05);color:inherit;cursor:pointer}
.dcz-card.on{border-color:#9af2d9;box-shadow:0 0 0 2px rgba(154,242,217,.35)}
.dcz-card.locked{opacity:.8}
.dcz-card small{opacity:.8}
.dcz-stage{position:relative;display:inline-grid;place-items:center;border-radius:50%;overflow:hidden;background:linear-gradient(145deg,#173b3e,#0c252d);box-shadow:0 4px 14px rgba(0,0,0,.35)}
.dcz-stage img{width:100%;height:100%;object-fit:cover;border-radius:50%}
.dcz-dim img{filter:grayscale(1) brightness(.45)}
.dcz-lock{position:absolute;font-size:26px}
.dcz-badge{position:absolute;right:14%;bottom:10%;width:28%;height:28%;min-width:16px;min-height:16px;display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,.55))}
.dcz-badge svg,.dcz-ic svg{display:block;width:100%;height:100%}
.dcz-prev{display:grid;place-items:center;gap:4px;margin:4px 0 6px;padding:14px 0 10px;border-radius:18px;background:radial-gradient(circle at 50% 30%,rgba(140,235,208,.16),rgba(255,255,255,.03))}
.dcz-prev small{opacity:.75;font-size:12px}
.dcz-prev .dcz-stage{margin:6px 0}
.dcz h4{margin:12px 2px 6px;font-size:14px}
.dcz-items{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.dcz-item{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;min-height:96px;border-radius:14px;border:1px solid rgba(140,235,208,.3);background:rgba(255,255,255,.05);color:inherit;cursor:pointer}
.dcz-item.on{border-color:#9af2d9;box-shadow:0 0 0 2px rgba(154,242,217,.35)}
.dcz-item small{font-size:11px;opacity:.85}
.dcz-ic{display:grid;place-items:center;width:44px;height:44px;padding:0;border-radius:50%;background:rgba(255,255,255,.1)}
.dcz-ic:not([data-dcz-bg]):not([data-dcz-fr]){padding:8px;box-sizing:border-box}
.dcz-item.own:not(.on) small{color:#8cebd0}
.dcz-item{transition:transform .15s}
.dcz-item:active,.dcz-card:active{transform:scale(.97)}
@media(prefers-reduced-motion:no-preference){.dcz-prev .dcz-stage{animation:dczFloat 3.6s ease-in-out infinite}@keyframes dczFloat{50%{transform:translateY(-3px)}}}
.dcz-prev-body{padding:12px 0 8px}
.dcz-body{position:relative;display:block;width:min(62vw,230px);aspect-ratio:2/3;border-radius:22px;overflow:hidden;background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.02));box-shadow:0 6px 18px rgba(0,0,0,.35)}
.dcz-body img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none}
.dcz-body .dcz-badge{width:17%;height:auto;aspect-ratio:1;right:6%;bottom:4%;z-index:99}
.dcz-ic-ot img{width:100%;height:100%;object-fit:contain}
.dcz-ic-ot{width:48px;height:56px;border-radius:14px;padding:3px!important;overflow:hidden}
.dcz-hint{font-size:12px;opacity:.7;margin:12px 2px 0}
.dcz-entry{display:block;width:100%;min-height:44px;margin:10px 0;border-radius:14px;border:1px solid rgba(140,235,208,.4);background:rgba(140,235,208,.12);color:inherit;font:600 15px/1 inherit;cursor:pointer}
.dcz-locked{opacity:.55;filter:grayscale(.8)}
.dcz-locked small{display:none}
.dcz-tag{position:static;display:block;margin-top:6px;font-style:normal;font-size:12px;font-weight:700;text-align:center;color:#fff}
`;
 // Item looks are generated from the ITEMS table so previews, swatches and the profile avatar always agree.
 const rules=ITEMS.filter(i=>i.kind!=='ac').map(i=>i.kind==='bg'
  ?'.dcz [data-dcz-bg="'+i.id+'"],html body #profileScreenBody .dsp-avatar-slot[data-dcz-bg="'+i.id+'"]{background:'+i.css+'!important}'
  :'.dcz [data-dcz-fr="'+i.id+'"],html body #profileScreenBody .dsp-avatar-slot[data-dcz-fr="'+i.id+'"]{box-shadow:'+i.css+'!important}').join('\n');
 css.textContent+=rules;
 document.head.appendChild(css);
 window.DEEN_COMPANIONS=Object.freeze({version:'companions-v5',order:ORDER.slice(),levels:Object.assign({},LEVELS),items:ITEMS.map(i=>i.id),bodyArt:BODY.slice(),outfits:()=>OUT.list.map(o=>o.id),unlocked,select,open,buyItem,toggleItem,isUnlocked:unlocked});
 // Wrap the engine's own chooser so a locked animal can never be selected programmatically.
 function wrap(){
  const c=window.DEEN_COMPANION;
  if(c&&!c.__dcz&&typeof c.select==='function'){const orig=c.select;c.select=function(id){if(LEVELS[id]&&!unlocked(id)){try{toast(T().lockedToast(N(id),LEVELS[id]))}catch(_){}return false}return orig.apply(this,arguments)};c.__dcz=1}
  const o=window.DEEN_PREMIUM_ONBOARDING;
  if(o&&!o.__dcz&&typeof o.animal==='function'){const orig=o.animal;o.animal=function(id){if(LEVELS[id]&&!unlocked(id))return false;return orig.apply(this,arguments)};o.__dcz=1}
 }
 function tick(){try{wrap();announce();decorate()}catch(_){}}
 const start=()=>{setInterval(tick,1000);new MutationObserver(()=>{try{decorate()}catch(_){}}).observe(document.body,{childList:true,subtree:true})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
