/* Notifications (iPhone app; local notifications, no server). One scheduler for every reminder, in the companion's
   voice and the learner's language:
   - daily reminder at the chosen hour, or at the learner's usual study time ("smart time"); not on a day already studied;
   - streak rescue at 21:00 when a streak of 2+ days would end tonight;
   - daily gift (the shop's free chest) in the morning;
   - energy full (when it will be 30/30);
   - weekly summary on Sunday evening.
   Rules: at most 2 a day, nothing 22:00–08:00, and when the app is not opened the reminders thin out (days 3 and 5 only,
   then one gentle note after a week and after two). Everything is planned from the app's own state each time it opens,
   goes to the background or finishes a lesson, so a lesson done today removes today's reminders. A soft question asks
   for permission after the second lesson (twice at most), and Settings has a Notifications group. A tap opens the
   matching screen. */
(()=>{
 'use strict';
 if(window.DEEN_NOTIFY)return;
 const KEY='deen_native_reminder',BASE=4000,SPAN=100,LEGACY=[3100,3101,3102,3103,3104,3105,3106,3107];
 const QUIET_FROM=22,QUIET_TO=8,RESCUE_H=21,GIFT_H=9,WEEKLY_H=19,WEEKLY_M=30,DAY=864e5;
 const LANGS=['tr','en','de','fr','ar'];
 const lang=()=>{try{const l=localStorage.getItem('deen_app_language_v1');return LANGS.includes(l)?l:'tr'}catch(_){return 'tr'}};
 const app=()=>{try{return state||null}catch(_){return null}};
 const ls={get:k=>{try{return localStorage.getItem(k)}catch(_){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(_){}}};
 const native=()=>{try{const C=window.Capacitor;return !!(C&&(C.isNativePlatform?C.isNativePlatform():C.getPlatform&&C.getPlatform()!=='web'))}catch(_){return false}};
 const plugin=()=>{try{return native()&&window.DEEN_NATIVE_PLUGIN?window.DEEN_NATIVE_PLUGIN('LocalNotifications'):null}catch(_){return null}};
 const EMOJI={lion:'🦁',cat:'🐱',wolf:'🐺',owl:'🦉',turtle:'🐢',eagle:'🦅'};
 const NAMES={tr:{lion:'Aslan',cat:'Kedi',wolf:'Kurt',owl:'Baykuş',turtle:'Kaplumbağa',eagle:'Kartal'},en:{lion:'Lion',cat:'Cat',wolf:'Wolf',owl:'Owl',turtle:'Turtle',eagle:'Eagle'},de:{lion:'Löwe',cat:'Katze',wolf:'Wolf',owl:'Eule',turtle:'Schildkröte',eagle:'Adler'},fr:{lion:'Lion',cat:'Chat',wolf:'Loup',owl:'Hibou',turtle:'Tortue',eagle:'Aigle'},ar:{lion:'الأسد',cat:'القطة',wolf:'الذئب',owl:'البومة',turtle:'السلحفاة',eagle:'النسر'}};
 // Messages: [title, body]; {a} companion, {e} its emoji, {n} streak days, {d} days studied, {x} XP.
 const M={
  tr:{daily:[['{a} seni bekliyor {e}','Bugünkü mini dersin sadece birkaç dakika sürüyor.'],['Küçük bir adım zamanı {e}','{a} bugünkü dersini hazırladı.'],['Bugün ne öğreneceğiz? {e}','Tek bir mini ders günü güzelleştirir.']],
   rescue:[['{n} günlük serin bu gece bitiyor 🔥','Tek bir mini ders serini korur. {a} seninle!']],
   gift:[['Günlük hediyen hazır 🎁','Markette bugünkü ücretsiz sandığın seni bekliyor.']],
   energy:[['Enerjin doldu ⚡','Kaldığın yerden devam etmeye hazırsın.']],
   weekly:[['Haftanın özeti 🌙','Bu hafta {d} gün çalıştın ve {x} XP kazandın. Harika gidiyorsun!']],
   weekly0:[['Yeni bir hafta 🌙','{a} seninle yeniden başlamak için hazır {e}']],
   miss:[['{a} seni bekliyor {e}','Kaldığın yerden devam etmek için bir dakikan yeter.']],
   ui:{head:'BİLDİRİMLER',on:'Hatırlatmalar',time:'Hatırlatma saati',smart:'Akıllı saat (genelde çalıştığın saat)',types:'Ne zaman haber verelim?',daily:'Günlük hatırlatma',rescue:'Seri bitmek üzereyken',gift:'Günlük hediye hazır olunca',energy:'Enerjin dolunca',weekly:'Haftalık özet (Pazar)',denied:'Bildirim izni kapalı. iPhone Ayarları › Ilnura › Bildirimler’den açabilirsin.',note:'Günde en fazla 2 bildirim; 22:00–08:00 arası sessiz.',askT:'Seni hatırlatayım mı?',askB:'Her gün senin saatinde nazik bir hatırlatma, serin bitmek üzereyken de küçük bir haber. Günde en fazla 2 bildirim.',yes:'Evet, hatırlat',later:'Şimdi değil'}},
  en:{daily:[['{a} is waiting for you {e}','Today’s mini lesson takes just a few minutes.'],['Time for a small step {e}','{a} has today’s lesson ready.'],['What shall we learn today? {e}','One mini lesson makes the day better.']],
   rescue:[['Your {n}-day streak ends tonight 🔥','One mini lesson keeps it going. {a} is with you!']],
   gift:[['Your daily gift is ready 🎁','Today’s free chest is waiting in the shop.']],
   energy:[['Your energy is full ⚡','You’re ready to pick up where you left off.']],
   weekly:[['Your week 🌙','You studied on {d} days this week and earned {x} XP. Great going!']],
   weekly0:[['A new week 🌙','{a} is ready to start again with you {e}']],
   miss:[['{a} is waiting for you {e}','One minute is enough to pick up where you left off.']],
   ui:{head:'NOTIFICATIONS',on:'Reminders',time:'Reminder time',smart:'Smart time (when you usually study)',types:'When should we let you know?',daily:'Daily reminder',rescue:'When a streak is about to end',gift:'When the daily gift is ready',energy:'When your energy is full',weekly:'Weekly summary (Sunday)',denied:'Notifications are off. Turn them on in iPhone Settings › Ilnura › Notifications.',note:'At most 2 a day; quiet from 22:00 to 08:00.',askT:'Shall I remind you?',askB:'A gentle reminder at your time each day, and a heads-up when your streak is about to end. At most 2 a day.',yes:'Yes, remind me',later:'Not now'}},
  de:{daily:[['{a} wartet auf dich {e}','Deine Mini-Lektion für heute dauert nur ein paar Minuten.'],['Zeit für einen kleinen Schritt {e}','{a} hat deine heutige Lektion bereit.'],['Was lernen wir heute? {e}','Eine Mini-Lektion macht den Tag schöner.']],
   rescue:[['Deine {n}-Tage-Serie endet heute Nacht 🔥','Eine Mini-Lektion rettet sie. {a} ist bei dir!']],
   gift:[['Dein Tagesgeschenk ist bereit 🎁','Deine kostenlose Truhe wartet im Shop.']],
   energy:[['Deine Energie ist voll ⚡','Du kannst da weitermachen, wo du aufgehört hast.']],
   weekly:[['Deine Woche 🌙','Du hast diese Woche an {d} Tagen gelernt und {x} XP gesammelt. Super!']],
   weekly0:[['Eine neue Woche 🌙','{a} ist bereit, mit dir neu zu starten {e}']],
   miss:[['{a} wartet auf dich {e}','Eine Minute reicht, um weiterzumachen.']],
   ui:{head:'BENACHRICHTIGUNGEN',on:'Erinnerungen',time:'Uhrzeit',smart:'Schlaue Uhrzeit (wann du meist lernst)',types:'Wann sollen wir uns melden?',daily:'Tägliche Erinnerung',rescue:'Wenn die Serie bald endet',gift:'Wenn das Tagesgeschenk bereit ist',energy:'Wenn die Energie voll ist',weekly:'Wochenrückblick (Sonntag)',denied:'Benachrichtigungen sind aus. Schalte sie in den iPhone-Einstellungen › Ilnura › Mitteilungen ein.',note:'Höchstens 2 pro Tag; Ruhe von 22:00 bis 08:00.',askT:'Soll ich dich erinnern?',askB:'Jeden Tag eine sanfte Erinnerung zu deiner Zeit und ein Hinweis, wenn deine Serie bald endet. Höchstens 2 pro Tag.',yes:'Ja, erinnern',later:'Jetzt nicht'}},
  fr:{daily:[['{a} t’attend {e}','Ta mini-leçon du jour ne prend que quelques minutes.'],['C’est l’heure d’un petit pas {e}','{a} a préparé ta leçon du jour.'],['On apprend quoi aujourd’hui ? {e}','Une mini-leçon rend la journée plus belle.']],
   rescue:[['Ta série de {n} jours se termine ce soir 🔥','Une mini-leçon suffit à la garder. {a} est avec toi !']],
   gift:[['Ton cadeau du jour est prêt 🎁','Ton coffre gratuit t’attend dans la boutique.']],
   energy:[['Ton énergie est pleine ⚡','Tu peux reprendre là où tu t’es arrêté.']],
   weekly:[['Ta semaine 🌙','Tu as appris {d} jours cette semaine et gagné {x} XP. Bravo !']],
   weekly0:[['Une nouvelle semaine 🌙','{a} est prêt à recommencer avec toi {e}']],
   miss:[['{a} t’attend {e}','Une minute suffit pour reprendre.']],
   ui:{head:'NOTIFICATIONS',on:'Rappels',time:'Heure du rappel',smart:'Heure intelligente (quand tu apprends d’habitude)',types:'Quand te prévenir ?',daily:'Rappel quotidien',rescue:'Quand une série va se terminer',gift:'Quand le cadeau du jour est prêt',energy:'Quand ton énergie est pleine',weekly:'Bilan de la semaine (dimanche)',denied:'Les notifications sont désactivées. Active-les dans Réglages › Ilnura › Notifications.',note:'2 par jour au maximum ; silence de 22 h à 8 h.',askT:'Je te le rappelle ?',askB:'Un rappel doux chaque jour à ton heure, et un mot quand ta série va se terminer. 2 par jour au maximum.',yes:'Oui, rappelle-moi',later:'Pas maintenant'}},
  ar:{daily:[['{a} ينتظرك {e}','درس اليوم القصير يستغرق دقائق قليلة فقط.'],['حان وقت خطوة صغيرة {e}','{a} جهّز لك درس اليوم.'],['ماذا نتعلّم اليوم؟ {e}','درس قصير واحد يجعل يومك أجمل.']],
   rescue:[['سلسلتك من {n} أيام تنتهي الليلة 🔥','درس قصير واحد يحافظ عليها. {a} معك!']],
   gift:[['هديتك اليومية جاهزة 🎁','صندوقك المجاني ينتظرك في المتجر.']],
   energy:[['طاقتك ممتلئة ⚡','أنت جاهز لتكمل من حيث توقفت.']],
   weekly:[['أسبوعك 🌙','تعلّمت هذا الأسبوع {d} أيام وكسبت {x} نقطة خبرة. رائع!']],
   weekly0:[['أسبوع جديد 🌙','{a} مستعد ليبدأ معك من جديد {e}']],
   miss:[['{a} ينتظرك {e}','دقيقة واحدة تكفي لتكمل.']],
   ui:{head:'الإشعارات',on:'التذكيرات',time:'وقت التذكير',smart:'وقت ذكي (حين تتعلّم عادةً)',types:'متى نخبرك؟',daily:'تذكير يومي',rescue:'حين تقترب السلسلة من نهايتها',gift:'حين تجهز الهدية اليومية',energy:'حين تمتلئ الطاقة',weekly:'ملخص الأسبوع (الأحد)',denied:'الإشعارات مغلقة. فعّلها من إعدادات iPhone › Ilnura › الإشعارات.',note:'إشعاران في اليوم كحد أقصى؛ هدوء من 22:00 إلى 08:00.',askT:'هل أذكّرك؟',askB:'تذكير لطيف كل يوم في وقتك، وتنبيه صغير حين تقترب سلسلتك من نهايتها. إشعاران في اليوم كحد أقصى.',yes:'نعم، ذكّرني',later:'ليس الآن'}}
 };
 const TYPES=['daily','rescue','gift','energy','weekly'];
 function cfg(){
  let j={};try{j=JSON.parse(ls.get(KEY)||'{}')||{}}catch(_){}
  const types={};TYPES.forEach(k=>{types[k]=!(j.types&&j.types[k]===false)});
  return {on:j.on===true,hour:Number.isInteger(j.hour)&&j.hour>=0&&j.hour<24?j.hour:19,smart:j.smart!==false,types,asks:Array.isArray(j.asks)?j.asks.slice(-5):[]};
 }
 function save(c){ls.set(KEY,JSON.stringify(c))}
 const dkey=t=>{const d=new Date(t),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())};
 const at=(base,days,h,m)=>{const d=new Date(base);return new Date(d.getFullYear(),d.getMonth(),d.getDate()+days,h,m||0,0,0).getTime()};
 const quiet=t=>{const h=new Date(t).getHours();return h>=QUIET_FROM||h<QUIET_TO};
 // The learner's usual study time: the median start of the lessons of the last 14 days (3 at least), on the half hour.
 function usualTime(st,now){
  const h=(st&&Array.isArray(st.history)?st.history:[]).filter(x=>x&&Number(x.at)>now-14*DAY&&Number(x.at)<=now).map(x=>{const d=new Date(Number(x.at));return d.getHours()+d.getMinutes()/60}).sort((a,b)=>a-b);
  if(h.length<3)return null;
  const mid=h[Math.floor(h.length/2)],r=Math.round(mid*2)/2;
  const v=Math.max(QUIET_TO,Math.min(QUIET_FROM-1,r));return {h:Math.floor(v),m:v%1?30:0};
 }
 function liveStreak(st,today){
  const m=st&&st.streakMeta||{},n=Number(m.currentStreak!=null?m.currentStreak:st&&st.streak)||0,last=m.lastStudyDate;if(!n||!last)return 0;
  const gap=Math.round((new Date(today+'T00:00:00')-new Date(last+'T00:00:00'))/DAY);return gap<=1?n:0;
 }
 function weekStats(st,now){
  const h=(st&&Array.isArray(st.history)?st.history:[]).filter(x=>x&&Number(x.at)>now-7*DAY);
  return {d:new Set(h.map(x=>dkey(Number(x.at)))).size,x:h.reduce((a,x)=>a+(Number(x.xp)||0),0)};
 }
 function fill(s,v){return String(s).replace(/\{(\w)\}/g,(_,k)=>v[k]!=null?String(v[k]):'')}
 // The plan: a pure function of the time, the app state and the settings (tests call it directly).
 function plan(now,st,c,l){
  c=c||cfg();l=l||lang();if(!c.on)return [];
  const L=M[l]||M.tr,today=dkey(now),studied=!!(st&&st.streakMeta&&st.streakMeta.lastStudyDate===today);
  const a=String(st&&st.profile&&st.profile.companion||'owl').replace(/[^a-z]/g,'')||'owl',vars={a:(NAMES[l]||NAMES.tr)[a]||(NAMES[l]||NAMES.tr).owl,e:EMOJI[a]||'🦉'};
  const streak=liveStreak(st,today),usual=c.smart?usualTime(st,now):null,H=usual?usual.h:c.hour,Mi=usual?usual.m:0;
  const ws=weekStats(st,now);vars.d=ws.d;vars.x=ws.x;const giftToday=!!(st&&st.marketMeta&&st.marketMeta.gift===today),out=[];
  const pick=(list,i)=>list[((i%list.length)+list.length)%list.length];
  for(let d=0;d<14;d++){
   const day=[],add=(kind,t,msg,extra)=>{if(t<=now+60000||quiet(t))return;day.push({kind,at:t,title:fill(msg[0],vars),body:fill(msg[1],vars),extra})};
   const away=d>=3; // the app has not been opened since: thin out
   if(away){
    if(d===3||d===5){if(c.types.daily)add('daily',at(now,d,H,Mi),pick(L.daily,d),{screen:'learnScreen'})}
    else if(d===7||d===13)add('miss',at(now,d,H,Mi),L.miss[0],{screen:'learnScreen'});
   }else{
    // streak rescue: tonight when today is not done yet; tomorrow when today is done (the streak is at stake again)
    if(c.types.rescue&&((d===0&&!studied&&streak>=2)||(d===1&&studied&&streak>=2)))add('rescue',at(now,d,RESCUE_H),[L.rescue[0][0].replace('{n}',streak),L.rescue[0][1]],{screen:'learnScreen'});
    if(c.types.daily&&!(d===0&&studied)){const t=at(now,d,H,Mi);if(!day.some(x=>x.kind==='rescue'&&Math.abs(x.at-t)<90*60000))add('daily',t,pick(L.daily,d+new Date(now).getDate()),{screen:'learnScreen'})}
    if(c.types.gift&&!(d===0&&giftToday))add('gift',at(now,d,GIFT_H),L.gift[0],{screen:'marketScreen'});
   }
   const t=at(now,d,WEEKLY_H,WEEKLY_M);
   if(c.types.weekly&&d<7&&new Date(t).getDay()===0)add('weekly',t,ws.d?L.weekly[0]:pick(L.weekly0,0),{screen:'learnScreen'});
   // at most 2 a day, by importance
   const rank={rescue:0,daily:1,miss:1,gift:2,weekly:3};
   day.sort((x,y)=>rank[x.kind]-rank[y.kind]).slice(0,2).forEach(x=>out.push(x));
  }
  // energy full: once, within two days, outside quiet hours, on a day that still has room
  if(c.types.energy&&st&&!st.premium&&Number(st.energy)<30){
   const last=Number.isFinite(st.lastEnergyAt)?st.lastEnergyAt:now;let t=last+(30-Number(st.energy))*300000;
   if(quiet(t)){const d=new Date(t);t=new Date(d.getFullYear(),d.getMonth(),d.getDate()+(d.getHours()>=QUIET_FROM?1:0),QUIET_TO,0,0,0).getTime()}
   if(t>now+15*60000&&t<now+2*DAY&&out.filter(x=>dkey(x.at)===dkey(t)).length<2)out.push({kind:'energy',at:t,title:fill(L.energy[0][0],vars),body:fill(L.energy[0][1],vars),extra:{screen:'learnScreen'}});
  }
  return out.sort((x,y)=>x.at-y.at).map((x,i)=>({...x,id:BASE+i}));
 }
 // ---- Native scheduling ----
 let busy=null,lastPlan=[];
 async function permission(){const p=plugin();if(!p)return 'unsupported';try{const r=await p.checkPermissions();return r&&r.display||'prompt'}catch(_){return 'prompt'}}
 async function cancelAll(p){
  const ids=[];for(let i=0;i<SPAN;i++)ids.push({id:BASE+i});LEGACY.forEach(id=>ids.push({id}));
  try{await p.cancel({notifications:ids})}catch(_){}
 }
 async function reschedule(){
  const p=plugin();if(!p)return [];
  if(busy)return busy;
  busy=(async()=>{
   try{
    const c=cfg();await cancelAll(p);
    if(!c.on||(await permission())!=='granted'){lastPlan=[];return []}
    const list=plan(Date.now(),app(),c);lastPlan=list;
    if(list.length)await p.schedule({notifications:list.map(x=>({id:x.id,title:x.title,body:x.body,schedule:{at:new Date(x.at),allowWhileIdle:true},extra:x.extra||{}}))});
    return list;
   }catch(_){return []}finally{setTimeout(()=>{busy=null},0)}
  })();
  return busy;
 }
 async function enable(hour){
  const p=plugin();if(!p)return {ok:false,reason:'unsupported'};
  let perm=await permission();
  if(perm!=='granted'){try{const r=await p.requestPermissions();perm=r&&r.display||'denied'}catch(_){perm='denied'}}
  const c=cfg();if(Number.isInteger(hour))c.hour=hour;
  if(perm!=='granted'){c.on=false;save(c);return {ok:false,reason:'denied'}}
  c.on=true;save(c);await reschedule();return {ok:true};
 }
 async function disable(){const c=cfg();c.on=false;save(c);const p=plugin();if(p)await cancelAll(p);lastPlan=[]}
 async function setHour(h){const c=cfg();c.hour=h;save(c);await reschedule()}
 function set(k,v){const c=cfg();if(TYPES.includes(k))c.types[k]=!!v;else c[k]=v;save(c);reschedule()}
 // ---- Soft permission question (after the second lesson, twice at most, a week apart) ----
 async function maybeAsk(){
  if(!plugin()||document.querySelector('.ds-ntf-ask'))return;
  const st=app(),c=cfg();if(!st||c.on||(st.history||[]).length<2||c.asks.length>=2)return;
  if(c.asks.length&&Date.now()-c.asks[c.asks.length-1]<7*DAY)return;
  if((await permission())==='denied')return;
  if(document.getElementById('lesson')?.classList.contains('active')||document.querySelector('dialog[open],.mko,.mk-sheet,#energyModal.show'))return;
  c.asks.push(Date.now());save(c);
  const L=(M[lang()]||M.tr).ui,a=String(st.profile&&st.profile.companion||'owl').replace(/[^a-z]/g,'')||'owl';
  const el=document.createElement('div');el.className='ds-ntf-ask';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label',L.askT);if(lang()==='ar')el.dir='rtl';
  el.innerHTML='<div class="ds-ntf-card"><img src="assets/companions/'+a+'/'+a+'_avatar.png" alt=""><span class="ds-ntf-bell" aria-hidden="true">🔔</span><h3></h3><p></p><button type="button" class="ds-ntf-yes"></button><button type="button" class="ds-ntf-later"></button></div>';
  el.querySelector('h3').textContent=L.askT;el.querySelector('p').textContent=L.askB;el.querySelector('.ds-ntf-yes').textContent=L.yes;el.querySelector('.ds-ntf-later').textContent=L.later;
  (document.getElementById('phone')||document.body).append(el);requestAnimationFrame(()=>el.classList.add('in'));
  const close=()=>{el.classList.remove('in');setTimeout(()=>el.remove(),250)};
  el.querySelector('.ds-ntf-later').onclick=close;
  el.querySelector('.ds-ntf-yes').onclick=async()=>{close();const u=usualTime(app(),Date.now());await enable(u?u.h:cfg().hour)};
 }
 // ---- Settings group ----
 function settingsGroup(){
  const body=document.getElementById('v5SheetBody');if(!body||!plugin()||body.querySelector('.ds-ntf-settings'))return;
  const L=(M[lang()]||M.tr).ui,c=cfg();
  const g=document.createElement('div');g.className='v690-setting-group ds-ntf-settings';
  const opts=Array.from({length:QUIET_FROM-QUIET_TO},(_,i)=>QUIET_TO+i).map(h=>'<option value="'+h+'"'+(h===c.hour?' selected':'')+'>'+String(h).padStart(2,'0')+':00</option>').join('');
  g.innerHTML='<small>'+L.head+'</small><label class="v5-toggle"><span>'+L.on+'</span><input type="checkbox" data-n="on"'+(c.on?' checked':'')+'></label>'+
   '<p class="ds-ntf-msg" hidden></p><div class="ds-ntf-more"'+(c.on?'':' hidden')+'><label class="v5-toggle"><span>'+L.smart+'</span><input type="checkbox" data-n="smart"'+(c.smart?' checked':'')+'></label>'+
   '<label class="v5-toggle ds-ntf-time"><span>'+L.time+'</span><select data-n="hour" dir="ltr">'+opts+'</select></label><p class="ds-ntf-sub">'+L.types+'</p>'+
   TYPES.map(k=>'<label class="v5-toggle"><span>'+L[k]+'</span><input type="checkbox" data-n="t:'+k+'"'+(c.types[k]?' checked':'')+'></label>').join('')+'<p class="ds-ntf-sub">'+L.note+'</p></div>';
  const msg=g.querySelector('.ds-ntf-msg'),more=g.querySelector('.ds-ntf-more');
  const sync=()=>{const s=cfg();g.querySelector('[data-n="hour"]').disabled=s.smart&&!!usualTime(app(),Date.now())};sync();
  g.querySelector('[data-n="on"]').onchange=async e=>{
   if(e.target.checked){const r=await enable(cfg().hour);if(!r.ok){e.target.checked=false;msg.textContent=L.denied;msg.hidden=false}else{msg.hidden=true;more.hidden=false}}
   else{await disable();more.hidden=true;msg.hidden=true}
  };
  g.querySelector('[data-n="smart"]').onchange=e=>{set('smart',e.target.checked);sync()};
  g.querySelector('[data-n="hour"]').onchange=e=>setHour(Number(e.target.value));
  g.querySelectorAll('[data-n^="t:"]').forEach(i=>i.onchange=()=>set(i.dataset.n.slice(2),i.checked));
  const first=body.querySelector('.v690-setting-group');first?first.after(g):body.prepend(g);
 }
 // ---- Wiring ----
 function install(){
  if(!plugin())return;
  document.addEventListener('deen:settings-rendered',()=>{try{settingsGroup()}catch(_){}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)reschedule()});
  window.addEventListener('pagehide',()=>reschedule());
  // After a lesson (the result screen), plan again (today's reminders go away) and, back home, maybe ask.
  const rv=document.getElementById('resultView');
  if(rv){let was=rv.classList.contains('show');new MutationObserver(()=>{const on=rv.classList.contains('show');if(on&&!was)setTimeout(reschedule,400);if(!on&&was)setTimeout(maybeAsk,1200);was=on}).observe(rv,{attributes:true,attributeFilter:['class']})}
  // A tap on a notification opens its screen.
  try{plugin().addListener('localNotificationActionPerformed',e=>{const s=e&&e.notification&&e.notification.extra&&e.notification.extra.screen;if(s)setTimeout(()=>{try{navigate(s)}catch(_){}},300)})}catch(_){}
  setTimeout(reschedule,1500);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 window.DEEN_NOTIFY=Object.freeze({version:'notify-1',plan,usualTime,cfg,reschedule,enable,disable,setHour,set,permission,maybeAsk,last:()=>lastPlan.slice(),supported:()=>!!plugin()});
})();
