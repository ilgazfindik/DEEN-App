/* Streak protection layer.
   The engine already earns/sells streak freezes (auto-used for exactly one missed day). This layer adds what was missing:
   - a visible "your streak is waiting" card on Home (with the freeze count and a one-tap shop shortcut);
   - streak repair: after a streak breaks (1–3 missed days) the learner may restore it for Sparkles (Premium: one free repair per week).
   Only uses the engine's public globals (state, sheet, toast, buy, saveState, updateUI); never touches engine code. */
(()=>{
 'use strict';
 if(window.DEEN_STREAK)return;
 const GUARD='deen_streak_guard',OFFER='deen_streak_offer_day',FREE='deen_streak_free_repair';
 const COST=25,FREEZE_COST=20,MIN_STREAK=3,MAX_GAP=4;
 const S={
  tr:{wait:n=>n+' günlük serin bugün seni bekliyor',wait0:'Serini korumak için bugün bir ders çöz',have:n=>'❄ '+n+' koruman hazır: bir günü kaçırsan serin bozulmaz',none:'❄ Seri korumanın yok',buy:'Koruma al · '+FREEZE_COST+' ◇',
   title:'Serin koptu',body:(v,k)=>v+' günlük serin '+k+' gün ara verdiğin için koptu. İstersen şimdi geri getirebilirsin; kaybettiğin ilerleme olmaz.',fix:c=>'Geri getir · '+c+' ◇',free:'Ücretsiz geri getir (Premium)',skip:'Yeni seriye başla',need:(h,c)=>'Yeterli Pırıltı yok ('+h+'/'+c+'). Günlük görevlerle kazanabilirsin.',done:v=>v+' günlük serin geri geldi!'},
  en:{wait:n=>'Your '+n+'-day streak is waiting for you today',wait0:'Do one lesson today to protect your streak',have:n=>'❄ '+n+' freeze ready: miss a day and your streak survives',none:'❄ No streak freeze',buy:'Get a freeze · '+FREEZE_COST+' ◇',
   title:'Your streak broke',body:(v,k)=>'Your '+v+'-day streak broke after '+k+' days away. You can restore it now; you lose no progress.',fix:c=>'Restore · '+c+' ◇',free:'Restore for free (Premium)',skip:'Start a new streak',need:(h,c)=>'Not enough Sparkles ('+h+'/'+c+'). Earn them with daily quests.',done:v=>'Your '+v+'-day streak is back!'},
  de:{wait:n=>'Deine '+n+'-Tage-Serie wartet heute auf dich',wait0:'Löse heute eine Lektion, um deine Serie zu schützen',have:n=>'❄ '+n+' Schutz bereit: Verpasst du einen Tag, bleibt die Serie',none:'❄ Kein Serienschutz',buy:'Schutz holen · '+FREEZE_COST+' ◇',
   title:'Deine Serie ist gerissen',body:(v,k)=>'Deine '+v+'-Tage-Serie ist nach '+k+' Tagen Pause gerissen. Du kannst sie jetzt wiederherstellen; es geht kein Fortschritt verloren.',fix:c=>'Wiederherstellen · '+c+' ◇',free:'Kostenlos wiederherstellen (Premium)',skip:'Neue Serie starten',need:(h,c)=>'Nicht genug Funken ('+h+'/'+c+'). Verdiene sie mit Tagesaufgaben.',done:v=>'Deine '+v+'-Tage-Serie ist zurück!'},
  fr:{wait:n=>'Ta série de '+n+' jours t’attend aujourd’hui',wait0:'Fais une leçon aujourd’hui pour protéger ta série',have:n=>'❄ '+n+' protection prête : si tu manques un jour, ta série survit',none:'❄ Aucune protection de série',buy:'Prendre une protection · '+FREEZE_COST+' ◇',
   title:'Ta série est interrompue',body:(v,k)=>'Ta série de '+v+' jours s’est interrompue après '+k+' jours d’absence. Tu peux la rétablir maintenant ; tu ne perds aucune progression.',fix:c=>'Rétablir · '+c+' ◇',free:'Rétablir gratuitement (Premium)',skip:'Commencer une nouvelle série',need:(h,c)=>'Pas assez d’étincelles ('+h+'/'+c+'). Gagne-en avec les défis du jour.',done:v=>'Ta série de '+v+' jours est de retour !'},
  ar:{wait:n=>'سلسلتك من '+n+' يومًا تنتظرك اليوم',wait0:'حُلّ درسًا واحدًا اليوم لحماية سلسلتك',have:n=>'❄ لديك '+n+' حماية جاهزة: إن فاتك يوم تبقى سلسلتك',none:'❄ لا توجد حماية للسلسلة',buy:'احصل على حماية · '+FREEZE_COST+' ◇',
   title:'انقطعت سلسلتك',body:(v,k)=>'انقطعت سلسلتك من '+v+' يومًا بعد غياب '+k+' أيام. يمكنك استعادتها الآن دون خسارة أي تقدّم.',fix:c=>'استعادة · '+c+' ◇',free:'استعادة مجانية (بريميوم)',skip:'ابدأ سلسلة جديدة',need:(h,c)=>'لا تكفي الشرارات ('+h+'/'+c+'). اكسبها من المهام اليومية.',done:v=>'عادت سلسلتك من '+v+' يومًا!'}
 };
 const lang=()=>window.DEEN_APP_LOCALE?.get?.()||'tr';
 const T=()=>S[lang()]||S.en;
 const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const ls={get(k){try{return localStorage.getItem(k)}catch(_){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(_){}}};
 const pad=n=>String(n).padStart(2,'0');
 const key=(d=new Date())=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
 const dn=s=>Math.floor(Date.parse(s+'T12:00:00Z')/864e5);
 const shift=(s,n)=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return key(d)};
 const app=()=>{try{return typeof state!=='undefined'&&state&&state.streakMeta?state:null}catch(_){return null}};
 const guard=()=>{try{return JSON.parse(ls.get(GUARD)||'null')}catch(_){return null}};

 // Remember the last healthy streak so a break can be recognised (and undone) later.
 function remember(){
  const st=app();if(!st)return;const m=st.streakMeta;
  if(m.currentStreak>0&&m.lastStudyDate){const v=JSON.stringify({v:m.currentStreak,last:m.lastStudyDate});if(ls.get(GUARD)!==v)ls.set(GUARD,v)}
 }
 function lost(){
  const st=app(),g=guard();if(!st||!g||!st.onboarded)return null;const m=st.streakMeta;
  if(m.currentStreak>0||g.v<MIN_STREAK||g.last!==m.lastStudyDate)return null;
  const gap=dn(key())-dn(g.last);
  return gap>=2&&gap<=MAX_GAP?{value:g.v,gap:gap-1,last:g.last}:null;
 }
 const freeAvailable=()=>{const st=app();if(!st?.premium)return false;const t=ls.get(FREE);return !t||dn(key())-dn(t)>=7};

 function repair(info){
  const st=app();if(!st)return false;const m=st.streakMeta,free=freeAvailable();
  if(!free){if((Number(st.currency)||0)<COST)return false;st.currency-=COST}
  const yest=shift(key(),-1);
  for(let d=shift(info.last,1);dn(d)<=dn(yest);d=shift(d,1))if(!m.freezeDates.includes(d))m.freezeDates.push(d);
  m.freezeDates=m.freezeDates.slice(-30);
  m.currentStreak=info.value;m.lastStudyDate=yest;st.streak=info.value;
  if(free)ls.set(FREE,key());
  ls.set(GUARD,JSON.stringify({v:info.value,last:yest}));
  try{saveState()}catch(_){}try{updateUI()}catch(_){}
  return true;
 }
 function offer(){
  const info=lost();if(!info||ls.get(OFFER)===key())return false;
  ls.set(OFFER,key());const t=T(),st=app(),free=freeAvailable(),have=Number(st.currency)||0,can=free||have>=COST;
  const html='<p>'+esc(t.body(info.value,info.gap))+'</p>'+(can?'':'<p class="dsg-need">'+esc(t.need(have,COST))+'</p>')+
   '<div class="dsg-actions"><button type="button" class="dsg-btn" data-dsg="repair"'+(can?'':' disabled')+'>'+esc(free?t.free:t.fix(COST))+'</button><button type="button" class="dsg-btn dsg-alt" data-dsg="skip">'+esc(t.skip)+'</button></div>';
  try{window.sheet(t.title,html)}catch(_){return false}
  return true;
 }

 /* Home card */
 function card(){
  const st=app(),scroll=document.getElementById('learnScroll');let el=document.getElementById('dsStreakGuard');
  const m=st?.streakMeta,show=!!(st&&scroll&&st.onboarded&&m.currentStreak>0&&m.lastStudyDate!==key());
  if(!show){el?.remove();return}
  const t=T(),fr=Number(m.streakFreeze)||0,can=fr<2&&(Number(st.currency)||0)>=FREEZE_COST;
  const html='<div class="dsg-line"><b>'+esc(t.wait(m.currentStreak))+'</b><span>'+esc(fr>0?t.have(fr):t.none)+'</span></div>'+(fr<2?'<button type="button" class="dsg-mini" data-dsg="buy"'+(can?'':' disabled')+'>'+esc(t.buy)+'</button>':'');
  if(!el){el=document.createElement('div');el.id='dsStreakGuard';el.setAttribute('role','status');scroll.prepend(el)}
  else if(el.parentNode!==scroll)scroll.prepend(el);
  if(el.dataset.sig!==html){el.dataset.sig=html;el.innerHTML=html}
  el.dir=lang()==='ar'?'rtl':'ltr';
 }

 document.addEventListener('click',ev=>{
  const b=ev.target.closest?.('[data-dsg]');if(!b||b.disabled)return;const a=b.dataset.dsg,t=T();
  if(a==='repair'){const info=lost();if(info&&repair(info)){closeSheet();try{toast(t.done(info.value))}catch(_){}card()}}
  else if(a==='skip'){closeSheet()}
  else if(a==='buy'){try{buy('freeze')}catch(_){}setTimeout(card,50)}
 });

 // The engine resets a broken streak when it reconciles; keep our memory fresh around every reconcile and tick.
 let tries=0;
 function tick(){
  remember();card();
  const st=app();
  if(tries<40&&st&&st.onboarded&&!document.getElementById('v998Onboarding')&&!document.getElementById('deenAccountGate')&&!document.querySelector('#lesson.active')){
   tries=99;try{offer()}catch(_){}
  }else if(tries<40)tries++;
 }
 const start=()=>{setInterval(()=>{try{tick()}catch(_){}},1500);document.addEventListener('visibilitychange',()=>{if(!document.hidden){tries=0;try{tick()}catch(_){}}})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();

 const st=document.createElement('style');
 st.textContent='#dsStreakGuard{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:10px 14px;padding:12px 14px;border-radius:16px;background:rgba(255,150,0,.14);border:1.5px solid rgba(255,150,0,.45);font-size:.9rem}#dsStreakGuard .dsg-line{display:grid;gap:3px}#dsStreakGuard span{opacity:.8;font-size:.85em}.dsg-mini{flex:none;min-height:36px;border-radius:12px;border:0;padding:0 12px;font:inherit;font-weight:800;background:#ff9600;color:#fff;cursor:pointer}.dsg-mini:disabled,.dsg-btn:disabled{opacity:.45;cursor:default}.dsg-actions{display:grid;gap:10px;margin-top:14px}.dsg-btn{min-height:48px;border-radius:14px;border:0;padding:0 16px;font:inherit;font-weight:800;background:#ff9600;color:#fff;cursor:pointer}.dsg-alt{background:transparent;border:2px solid currentColor;color:inherit;opacity:.85}.dsg-need{font-weight:700;opacity:.85}';
 document.head.appendChild(st);
 window.DEEN_STREAK=Object.freeze({lost,repair:()=>{const i=lost();return !!i&&repair(i)},card,version:'streak-v1'});
})();
