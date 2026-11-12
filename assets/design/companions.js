/* Companion unlocks + wardrobe ("Hayvan Odası").
   - Only Lion and Cat are available from the start; the other animals unlock with level.
   - Animals already chosen by earlier players stay owned (grandfathered).
   - Wardrobe: backdrops and small badges bought with Sparkles (the free in-game currency). No real-money sales.
   Uses only engine globals (state, level, sheet, closeSheet, toast, saveState, updateUI); never edits engine code. */
(()=>{
 'use strict';
 if(window.DEEN_COMPANIONS)return;
 const ORDER=['lion','cat','wolf','owl','turtle','eagle'];
 const LEVELS={lion:1,cat:1,wolf:2,owl:4,turtle:6,eagle:9};
 const EMOJI={lion:'🦁',cat:'🐈',wolf:'🐺',owl:'🦉',turtle:'🐢',eagle:'🦅'};
 const ITEMS=[
  {id:'bg_dune',kind:'bg',cost:30,icon:'🏜️',css:'linear-gradient(160deg,#e9b26a,#7d3f2b)'},
  {id:'bg_night',kind:'bg',cost:30,icon:'🌌',css:'linear-gradient(160deg,#25316e,#080c24)'},
  {id:'bg_garden',kind:'bg',cost:30,icon:'🌿',css:'linear-gradient(160deg,#5fbf8a,#124c3a)'},
  {id:'ac_star',kind:'ac',cost:45,icon:'⭐'},
  {id:'ac_moon',kind:'ac',cost:45,icon:'🌙'},
  {id:'ac_leaf',kind:'ac',cost:45,icon:'🍃'}
 ];
 const S={
  tr:{room:'Hayvan Odası',animals:'Hayvanlar',wardrobe:'Gardırop',lv:n=>'Seviye '+n,locked:n=>'Seviye '+n+' ile açılır',use:'Seç',active:'Seçili',
   unlock:(a,n)=>a+' açıldı! Hayvan Odası’ndan seçebilirsin.',lockedToast:(a,n)=>a+' için seviye '+n+' gerekiyor.',bg:'Arka plan',ac:'Rozet',none:'Yok',
   buy:c=>c+' ◇ ile al',equip:'Tak',off:'Çıkar',on:'Takılı',need:'Yeterli Pırıltı yok',bought:'Gardıroba eklendi',
   hint:'Pırıltıyı günlük ve haftalık sandıklardan, serilerden ve derslerden kazanırsın.',
   it:{bg_dune:'Çöl',bg_night:'Gece',bg_garden:'Bahçe',ac_star:'Yıldız',ac_moon:'Hilal',ac_leaf:'Yaprak'}},
  en:{room:'Animal Room',animals:'Animals',wardrobe:'Wardrobe',lv:n=>'Level '+n,locked:n=>'Unlocks at level '+n,use:'Choose',active:'Chosen',
   unlock:a=>a+' unlocked! You can choose it in the Animal Room.',lockedToast:(a,n)=>a+' unlocks at level '+n+'.',bg:'Backdrop',ac:'Badge',none:'None',
   buy:c=>'Get for '+c+' ◇',equip:'Wear',off:'Remove',on:'Worn',need:'Not enough Sparkles',bought:'Added to your wardrobe',
   hint:'You earn Sparkles from daily and weekly chests, streaks and lessons.',
   it:{bg_dune:'Desert',bg_night:'Night',bg_garden:'Garden',ac_star:'Star',ac_moon:'Crescent',ac_leaf:'Leaf'}},
  de:{room:'Tierzimmer',animals:'Tiere',wardrobe:'Garderobe',lv:n=>'Stufe '+n,locked:n=>'Ab Stufe '+n,use:'Wählen',active:'Gewählt',
   unlock:a=>a+' freigeschaltet! Du kannst es im Tierzimmer wählen.',lockedToast:(a,n)=>a+' wird auf Stufe '+n+' freigeschaltet.',bg:'Hintergrund',ac:'Abzeichen',none:'Keins',
   buy:c=>'Für '+c+' ◇ holen',equip:'Anlegen',off:'Ablegen',on:'Getragen',need:'Nicht genug Funken',bought:'Zur Garderobe hinzugefügt',
   hint:'Funken verdienst du mit täglichen und wöchentlichen Truhen, Serien und Lektionen.',
   it:{bg_dune:'Wüste',bg_night:'Nacht',bg_garden:'Garten',ac_star:'Stern',ac_moon:'Halbmond',ac_leaf:'Blatt'}},
  fr:{room:'Salle des animaux',animals:'Animaux',wardrobe:'Garde-robe',lv:n=>'Niveau '+n,locked:n=>'Se débloque au niveau '+n,use:'Choisir',active:'Choisi',
   unlock:a=>a+' débloqué ! Tu peux le choisir dans la salle des animaux.',lockedToast:(a,n)=>a+' se débloque au niveau '+n+'.',bg:'Décor',ac:'Badge',none:'Aucun',
   buy:c=>'Obtenir pour '+c+' ◇',equip:'Porter',off:'Retirer',on:'Porté',need:'Pas assez d’étincelles',bought:'Ajouté à la garde-robe',
   hint:'Tu gagnes des étincelles avec les coffres quotidiens et hebdomadaires, les séries et les leçons.',
   it:{bg_dune:'Désert',bg_night:'Nuit',bg_garden:'Jardin',ac_star:'Étoile',ac_moon:'Croissant',ac_leaf:'Feuille'}},
  ar:{room:'غرفة الحيوانات',animals:'الحيوانات',wardrobe:'خزانة الملابس',lv:n=>'المستوى '+n,locked:n=>'يُفتح عند المستوى '+n,use:'اختيار',active:'مختار',
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
  try{toast(T().unlock(N(fresh[fresh.length-1])))}catch(_){}
 }
 function select(id){
  const st=app();if(!st||!unlocked(id))return false;
  st.profile=st.profile||{};st.profile.companion=id;
  const m=meta();if(m&&!m.owned.includes(id))m.owned.push(id);
  save();try{updateUI()}catch(_){}
  return true;
 }
 /* Wardrobe */
 function item(id){return ITEMS.find(i=>i.id===id)}
 function buyItem(id){
  const st=app(),m=meta(),it=item(id);if(!st||!m||!it||m.items.includes(id))return false;
  if((Number(st.currency)||0)<it.cost)return false;
  st.currency-=it.cost;m.items.push(id);m.eq[it.kind]=id;save();try{updateUI()}catch(_){}
  return true;
 }
 function toggleItem(id){
  const m=meta(),it=item(id);if(!m||!it||!m.items.includes(id))return;
  if(m.eq[it.kind]===id)delete m.eq[it.kind];else m.eq[it.kind]=id;save();
 }
 const avatarSrc=id=>'assets/companions/'+id+'/'+id+'_avatar.png';
 function stage(id,size){
  const m=meta(),bg=item(m?.eq?.bg),ac=item(m?.eq?.ac);
  return '<span class="dcz-stage" style="width:'+size+'px;height:'+size+'px'+(bg?';background:'+bg.css:'')+'"><img src="'+avatarSrc(id)+'" alt="" loading="lazy" onerror="this.replaceWith(document.createTextNode(\''+EMOJI[id]+'\'))">'+(ac?'<i class="dcz-badge" aria-hidden="true">'+ac.icon+'</i>':'')+'</span>';
 }
 let tab='animals';
 function html(){
  const t=T(),st=app(),m=meta(),cur=String(st.profile?.companion||'');
  let body;
  if(tab==='animals'){
   body='<div class="dcz-grid">'+ORDER.map(id=>{
    const ok=unlocked(id),on=cur===id;
    return '<button type="button" class="dcz-card'+(ok?'':' locked')+(on?' on':'')+'" data-dcz="'+(ok?'pick':'lock')+'" data-id="'+id+'" aria-disabled="'+(ok?'false':'true')+'">'+
     (ok?stage(id,76):'<span class="dcz-stage dcz-dim" style="width:76px;height:76px"><img src="'+avatarSrc(id)+'" alt="" loading="lazy"><b class="dcz-lock">🔒</b></span>')+
     '<b>'+esc(N(id))+'</b><small>'+esc(ok?(on?t.active:t.use):t.locked(LEVELS[id]))+'</small></button>';
   }).join('')+'</div>';
  }else{
   const kinds=['bg','ac'];
   body='<div class="dcz-prev">'+stage(cur&&ORDER.includes(cur)?cur:'lion',96)+'</div>'+kinds.map(k=>
    '<h4>'+esc(t[k])+'</h4><div class="dcz-items">'+ITEMS.filter(i=>i.kind===k).map(i=>{
     const own=m.items.includes(i.id),worn=m.eq[k]===i.id;
     const label=own?(worn?t.off:t.equip):t.buy(i.cost);
     return '<button type="button" class="dcz-item'+(worn?' on':'')+'" data-dcz="item" data-id="'+i.id+'"><span class="dcz-ic" style="'+(i.css?'background:'+i.css:'')+'">'+i.icon+'</span><b>'+esc(t.it[i.id])+'</b><small>'+esc(worn?t.on:label)+'</small></button>';
    }).join('')+'</div>').join('')+'<p class="dcz-hint">'+esc(t.hint)+'</p>';
  }
  return '<div class="dcz" dir="'+(lang()==='ar'?'rtl':'ltr')+'"><div class="dcz-tabs" role="tablist"><button type="button" role="tab" class="'+(tab==='animals'?'on':'')+'" data-dcz="tab" data-id="animals">'+esc(t.animals)+'</button><button type="button" role="tab" class="'+(tab==='wardrobe'?'on':'')+'" data-dcz="tab" data-id="wardrobe">'+esc(t.wardrobe)+'</button></div>'+
   '<div class="dcz-cur">◇ '+(Number(st.currency)||0)+' · '+esc(t.lv(lvl()))+'</div>'+body+'</div>';
 }
 function open(which){
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
   else if(a==='pick'){if(select(id)){try{closeSheet()}catch(_){}}}
   else if(a==='lock'){try{toast(T().lockedToast(N(id),LEVELS[id]))}catch(_){}}
   else if(a==='item'){
    const m=meta();
    if(m.items.includes(id))toggleItem(id);
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
   const bg=item(m.eq.bg),ac=item(m.eq.ac);
   slot.style.background=bg?bg.css:'';
   let badge=slot.querySelector('.dcz-badge');
   if(ac){if(!badge){badge=document.createElement('i');badge.className='dcz-badge';slot.appendChild(badge)}if(badge.textContent!==ac.icon)badge.textContent=ac.icon}else badge?.remove();
  }
 }
 document.addEventListener('click',ev=>{if(ev.target.closest?.('[data-dcz-open]')){ev.preventDefault();open('animals')}});
 const css=document.createElement('style');css.id='dcz-style';css.textContent=`
.dcz{display:block;color:inherit}
.dcz-tabs{display:flex;gap:8px;margin:2px 0 10px}
.dcz-tabs button{flex:1;min-height:44px;border-radius:12px;border:1px solid rgba(140,235,208,.35);background:rgba(255,255,255,.06);color:inherit;font:600 14px/1 inherit;cursor:pointer}
.dcz-tabs button.on{background:#8cebd0;color:#06232a}
.dcz-cur{font:600 13px/1 inherit;opacity:.85;margin:0 2px 10px}
.dcz-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.dcz-card{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px;min-height:150px;border-radius:16px;border:1px solid rgba(140,235,208,.3);background:rgba(255,255,255,.05);color:inherit;cursor:pointer}
.dcz-card.on{border-color:#9af2d9;box-shadow:0 0 0 2px rgba(154,242,217,.35)}
.dcz-card.locked{opacity:.8}
.dcz-card small{opacity:.8}
.dcz-stage{position:relative;display:inline-grid;place-items:center;border-radius:50%;overflow:hidden;background:linear-gradient(145deg,#173b3e,#0c252d)}
.dcz-stage img{width:100%;height:100%;object-fit:cover;border-radius:50%}
.dcz-dim img{filter:grayscale(1) brightness(.45)}
.dcz-lock{position:absolute;font-size:26px}
.dcz-badge{position:absolute;right:16%;bottom:12%;font-style:normal;font-size:22px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))}
.dcz-prev{display:grid;place-items:center;margin:4px 0 8px}
.dcz h4{margin:12px 2px 6px;font-size:14px}
.dcz-items{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.dcz-item{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;min-height:96px;border-radius:14px;border:1px solid rgba(140,235,208,.3);background:rgba(255,255,255,.05);color:inherit;cursor:pointer}
.dcz-item.on{border-color:#9af2d9;box-shadow:0 0 0 2px rgba(154,242,217,.35)}
.dcz-item small{font-size:11px;opacity:.85}
.dcz-ic{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;font-size:22px;background:rgba(255,255,255,.1)}
.dcz-hint{font-size:12px;opacity:.7;margin:12px 2px 0}
.dcz-entry{display:block;width:100%;min-height:44px;margin:10px 0;border-radius:14px;border:1px solid rgba(140,235,208,.4);background:rgba(140,235,208,.12);color:inherit;font:600 15px/1 inherit;cursor:pointer}
.dcz-locked{opacity:.55;filter:grayscale(.8)}
.dcz-locked small{display:none}
.dcz-tag{position:static;display:block;margin-top:6px;font-style:normal;font-size:12px;font-weight:700;text-align:center;color:#fff}
#profileScreenBody .dsp-avatar-slot .dcz-badge{font-size:20px}
`;
 document.head.appendChild(css);
 window.DEEN_COMPANIONS=Object.freeze({version:'companions-v1',order:ORDER.slice(),levels:Object.assign({},LEVELS),items:ITEMS.map(i=>i.id),unlocked,select,open,buyItem,toggleItem,isUnlocked:unlocked});
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
