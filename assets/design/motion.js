/* M0 — motion system, M1 — the answer moment, M2 — in-lesson flow (behaviour half; the look is motion.css).
   - No vibration anywhere: the product decision is motion and sound only.
   - Marks the combo level on #lesson so the progress bar turns gold from 3 in a row.
   - Makes the mascot hop only when the engine shows its combo-milestone mascot.
   - Pops the check button when it becomes available and shines the progress bar when it moves.
   - At every section end the learner's own companion celebrates, with a burst of confetti.
   Everything reacts to the engine's own DOM; no lesson logic or timing changes. */
(()=>{
 'use strict';
 if(window.DEEN_DS_MOTION)return;
 try{if(navigator.vibrate)Object.defineProperty(navigator,'vibrate',{configurable:true,value:()=>false})}catch(_){}

 const root=document.documentElement;
 const reduced=()=>root.classList.contains('v5-reduce')||matchMedia('(prefers-reduced-motion: reduce)').matches;
 const scale=()=>reduced()?0:1;
 const appState=()=>{try{return state||{}}catch(_){return{}}};
 const lessonSession=()=>{try{return session||null}catch(_){return null}};
 const companion=()=>String(appState().profile?.companion||'owl').replace(/[^a-z]/g,'')||'owl';
 const restart=(el,cls)=>{el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls)};
 // Sounds go through the engine's DEENSound, so the sound setting and its rules apply (sound.js).
 const sfx=kind=>{try{window.DEENSound?.play?.(kind)}catch(_){}};

 // ---- Confetti (canvas, transform-free) ----
 function confetti(host){
  if(!scale())return;
  const cv=document.createElement('canvas');cv.className='ds-confetti';cv.setAttribute('aria-hidden','true');host.append(cv);
  const r=cv.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);cv.width=r.width*d;cv.height=r.height*d;
  const g=cv.getContext('2d');g.scale(d,d);
  const colors=['#3fd7ad','#ffd27a','#f39b8f','#7cc8f2','#ffffff','#e9cf93'],parts=[];
  for(const x of [r.width*.28,r.width*.72])for(let k=0;k<70;k++){const a=-Math.PI/2+(Math.random()-.5)*1.6,v=6+Math.random()*7;
   parts.push({x,y:r.height*.32,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:4+Math.random()*4,c:colors[k%colors.length],rot:Math.random()*6,vr:(Math.random()-.5)*.3,life:90+Math.random()*50})}
  const tick=()=>{g.clearRect(0,0,r.width,r.height);let alive=0;
   for(const p of parts){if((p.life-=1)<=0)continue;alive++;p.vy+=.22;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;
    g.save();g.globalAlpha=Math.min(1,p.life/20);g.translate(p.x,p.y);g.rotate(p.rot);g.fillStyle=p.c;g.fillRect(-p.r,-p.r*.5,p.r*2,p.r);g.restore()}
   if(alive)requestAnimationFrame(tick);else cv.remove()};
  requestAnimationFrame(tick);
 }

 // ---- Section end ----
 let celebrated=null;
 // The companion card ("… seninle kutluyor!") is the mascot's place. Other result layers add it a
 // moment after the view opens, so placement is re-checked on every update; results without the
 // card keep the mascot at the top.
 function placeMascot(view){
  const card=view.querySelector('#v994ResultCompanion'),host=card||view;
  let img=view.querySelector('.ds-end-mascot');
  if(!img){
   img=new Image();img.className='ds-end-mascot';img.alt='';img.decoding='async';img.setAttribute('aria-hidden','true');
   const animal=companion();img.onerror=()=>{img.onerror=null;img.src='assets/companions/owl/owl_celebrate.png'};
   img.src='assets/companions/'+animal+'/'+animal+'_celebrate.png';
  }
  if(img.parentElement!==host){host.prepend(img);restart(img,'ds-end-mascot')}
 }
 function celebrate(view){
  placeMascot(view);
  if(celebrated===view.dataset.dsRun)return;
  view.dataset.dsRun=celebrated=String(Date.now());
  restart(view.querySelector('.ds-end-mascot'),'ds-end-mascot');
  setTimeout(()=>confetti(document.getElementById('lesson')||document.body),420);
  // One pop per stat tile as it lands (motion.css: XP 300 ms, correct 400 ms, combo 500 ms).
  [380,480,580].forEach(ms=>setTimeout(()=>sfx('pop'),scale()?ms:0));
 }

 // ---- Lesson observer ----
 let lastWidth='',lastCombo=-1,queued=false;const popped=new WeakSet();
 function sync(){
  queued=false;
  const lesson=document.getElementById('lesson');if(!lesson)return;
  const combo=Number(lessonSession()?.combo)||0;
  if(combo!==lastCombo){
   lastCombo=combo;if(combo>=3)lesson.setAttribute('data-ds-combo-hot','');else lesson.removeAttribute('data-ds-combo-hot');
   lesson.dataset.dsComboTier=String(combo>=10?3:combo>=5?2:combo>=3?1:0);
  }
  const bar=document.getElementById('v9914MiniProgress'),fill=bar?.firstElementChild;
  if(fill){const w=fill.style.width;if(w!==lastWidth){const grew=parseFloat(w)>parseFloat(lastWidth||'0');lastWidth=w;if(grew)restart(bar,'ds-shine')}}
  // The result sheet is anchored to the frame's bottom edge: keep the frame at the top while it is up.
  const feedback=document.getElementById('feedback'),frame=feedback?.parentElement;
  if(feedback?.classList.contains('show')&&frame){
   if(frame.scrollTop)frame.scrollTop=0;
   if(!frame.dataset.dsPinned){frame.dataset.dsPinned='1';frame.addEventListener('scroll',()=>{if(document.getElementById('feedback')?.classList.contains('show')&&frame.scrollTop)frame.scrollTop=0},{passive:true})}
  }
  const view=document.getElementById('resultView');
  if(view?.classList.contains('show'))celebrate(view);else if(view)delete view.dataset.dsRun;
 }
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(sync)}};

 // ---- Combo milestone (3 and 5 in a row) ----
 const COMBO_SAY={
  tr:{3:'3 doğru üst üste!',5:'5 doğru! Durdurulamazsın!'},
  en:{3:'3 in a row!',5:'5 in a row! Unstoppable!'},
  ar:{3:'3 إجابات صحيحة متتالية!',5:'5 متتالية! لا يمكن إيقافك!'},
  de:{3:'3 richtig in Folge!',5:'5 in Folge! Nicht zu stoppen!'},
  fr:{3:'3 bonnes réponses d’affilée !',5:'5 d’affilée ! Inarrêtable !'}
 };
 function uiLang(){
  let code='';try{code=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}
  code=String(code||root.lang||'tr').slice(0,2).toLowerCase();return COMBO_SAY[code]?code:'tr';
 }
 function sheetHeight(){
  const f=document.getElementById('feedback');
  return f?.classList.contains('show')?Math.round(f.getBoundingClientRect().height):0;
 }
 function comboMoment(rise){
  const combo=Number(lessonSession()?.combo)||3,tier=combo>=5?5:3;
  const frame=rise.parentElement;
  // The sheet slides up and settles its text a moment after the grade; keep measuring while the
  // companion is on screen so it always stands on the sheet edge.
  const place=()=>{const h=sheetHeight();if(h&&frame)frame.style.setProperty('--ds-sheet-h',h+'px')};
  place();for(const ms of [120,260,420,650,900,1300])setTimeout(place,ms);
  if(!rise.querySelector('.ds-combo-say')){
   const say=document.createElement('div');say.className='ds-combo-say';say.textContent=COMBO_SAY[uiLang()][tier];rise.append(say);
  }
  const avatar=document.querySelector('#lesson .deen-character-question-avatar');if(avatar){restart(avatar,'ds-hop');setTimeout(()=>avatar.classList.remove('ds-hop'),700)}
 }

 // M2: the next question (or the first one, when a lesson opens) enters with .ds-q-in, kept for the
 // whole entrance because the engine's own -in class is removed after ~190 ms.
 let enterTimer=0;
 function enter(frame){
  if(!frame)return;restart(frame,'ds-q-in');clearTimeout(enterTimer);
  enterTimer=setTimeout(()=>frame.classList.remove('ds-q-in'),scale()?720:0);
 }
 const gained=(r,cls)=>r.target.classList?.contains(cls)&&!String(r.oldValue||'').split(/\s+/).includes(cls);

 function onMutations(records){
  for(const r of records){
   const t=r.target;
   if(r.type==='attributes'&&r.attributeName==='class'){
    if(t.classList.contains('question-frame')&&(gained(r,'gf520-question-in')||gained(r,'gf-question-in')))enter(t);
    else if(t.id==='lesson'&&gained(r,'active'))setTimeout(()=>enter(document.querySelector('#quizView .question-frame')),scale()?260:0);
   }
   // The engine's combo-milestone mascot appeared: it says the streak out loud, stands on the result
   // sheet, and the question mascot hops with it.
   if(r.type==='childList')for(const n of r.addedNodes){
    const rise=n.nodeType===1&&(n.id==='deenDirectComboRise'?n:n.querySelector?.('#deenDirectComboRise'));
    if(rise)comboMoment(rise);
   }
   // A check button that just became available pops once. Some engine layers re-sync the button
   // on every input, so only a real disabled → enabled change counts, once per button.
   if(r.type==='attributes'&&r.attributeName==='disabled'&&r.oldValue!==null&&!t.disabled&&t.classList?.contains('template-action')&&!popped.has(t)){popped.add(t);restart(t,'ds-ready')}
  }
  schedule();
 }
 function install(){
  const lesson=document.getElementById('lesson');
  if(!lesson){setTimeout(install,300);return}
  new MutationObserver(onMutations).observe(lesson,{childList:true,subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['class','style','disabled']});
  sync();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 // ---- M4: path and header ----
 // Changes made while a lesson covers the path (new current stop, XP, streak, energy) are kept
 // and played once the path is on screen.
 // An offer, streak or reward dialog over the path also hides it.
 const overlayOpen=()=>[...document.querySelectorAll('dialog[open],[aria-modal="true"]')].some(d=>d.getClientRects().length&&getComputedStyle(d).visibility!=='hidden');
 const homeVisible=()=>document.getElementById('learnScreen')?.classList.contains('active')&&!document.getElementById('lesson')?.classList.contains('active')&&!overlayOpen();
 // Boot writes the saved values into the header and path; that is not progress, so the first
 // seconds only record a baseline.
 const bootAt=Date.now(),settling=()=>Date.now()-bootAt<2500;
 let lastStop=null,pendingStop=null,waitTimer=0,visibleSince=0;const pendingCounts=new Map(),lastCounts=new Map(),counting=new Set();
 function syncHome(){
  const cur=document.querySelector('#v5Paths .lp-stop.current');
  if(cur){if(lastStop&&cur.id!==lastStop&&!settling())pendingStop={from:lastStop,to:cur.id};lastStop=cur.id}
  for(const id of ['xpTop','streakTop','energyTop']){
   const el=document.getElementById(id);if(!el||counting.has(id))continue;
   const text=el.textContent.trim();if(!/^\d+$/.test(text))continue;
   const v=Number(text),prev=lastCounts.get(id);lastCounts.set(id,v);
   if(prev!=null&&prev!==v&&!settling()){const p=pendingCounts.get(id);pendingCounts.set(id,{from:p?p.from:prev,to:v})}
  }
  // Dialogs close outside the observed trees, so a pending moment checks back until it can play.
  // The path must also have been on screen for a moment: offer or streak dialogs open ~0.5–1 s
  // after a lesson closes, and the moment should not play underneath them.
  const pending=pendingStop||pendingCounts.size;
  if(!homeVisible()){visibleSince=0;if(pending&&!waitTimer)waitTimer=setTimeout(()=>{waitTimer=0;scheduleHome()},400);return}
  if(pending&&!visibleSince)visibleSince=Date.now();
  if(pending&&Date.now()-visibleSince<700){if(!waitTimer)waitTimer=setTimeout(()=>{waitTimer=0;scheduleHome()},250);return}
  // A longer streak (the day's first lesson) gets its own moment first; the rest waits for it.
  const streak=pendingCounts.get('streakTop');
  if(streak&&streak.to>streak.from&&streakShownFor!==streak.to){streakShownFor=streak.to;streakMoment(streak.from,streak.to);return}
  if(pendingStop){
   const {from,to}=pendingStop;pendingStop=null;
   if(scale()){
    const done=document.getElementById(from),next=document.getElementById(to);
    if(done){restart(done,'ds-stop-done');sfx('stamp')}
    setTimeout(()=>{const n=document.getElementById(to);if(!n)return;restart(n,'ds-stop-unlock');sfx('pathUnlock');try{n.scrollIntoView({block:'center',behavior:'smooth'})}catch(_){}},320);
    setTimeout(()=>{document.getElementById(from)?.classList.remove('ds-stop-done');document.getElementById(to)?.classList.remove('ds-stop-unlock')},2400);
   }
  }
  for(const [id,{from,to}] of pendingCounts){pendingCounts.delete(id);tick(id,from,to)}
 }
 // Header counters tick from the old to the new value; the final text is the engine's own.
 function tick(id,from,to){
  const el=document.getElementById(id),stat=el?.closest('.stat');if(!el||!stat)return;
  const up=to>from;restart(stat,up?'ds-count-up':'ds-count-down');setTimeout(()=>stat.classList.remove('ds-count-up','ds-count-down'),500);
  if(!up||!scale()||id==='energyTop')return;
  const final=el.textContent,dur=Math.min(900,280+(to-from)*12),t0=performance.now();counting.add(id);
  let written=el.textContent=String(from);
  const step=now=>{
   if(!el.isConnected||el.textContent!==written){counting.delete(id);return}
   const k=Math.min(1,(now-t0)/dur),before=written;written=el.textContent=k>=1?final:String(Math.round(from+(to-from)*ease(k)));
   if(written!==before)sfx('tick');
   if(k<1)requestAnimationFrame(step);else counting.delete(id);
  };
  requestAnimationFrame(step);
 }
 const ease=k=>1-Math.pow(1-k,3);
 let homeQueued=false;
 const scheduleHome=()=>{if(!homeQueued){homeQueued=true;requestAnimationFrame(()=>{homeQueued=false;syncHome()})}};
 function installHome(){
  const learn=document.getElementById('learnScreen'),stats=document.querySelector('.app-header .stats');
  if(!learn||!stats){setTimeout(installHome,300);return}
  const watch=new MutationObserver(scheduleHome);
  watch.observe(learn,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  watch.observe(stats,{childList:true,subtree:true,characterData:true});
  const lesson=document.getElementById('lesson');if(lesson)watch.observe(lesson,{attributes:true,attributeFilter:['class']});
  syncHome();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installHome,{once:true});else installHome();

 // ---- Matching, sequence and typed answers ----
 // A finished matching board waves once the last pair has popped; the counter bumps on each pair.
 // A sequence block springs in only when it is new to the answer row (reordering keeps still),
 // and a block sent back pops its bank chip. Each keystroke in a typed answer pulses the field.
 // The engine may redraw the whole row and bank on each tap, so blocks and chips are compared by
 // their text with the previous state of the same question rather than by element.
 let seqKey=null,seqPieces=[],seqOff=[];
 function syncSequence(){
  const area=document.getElementById('answerArea'),zone=area?.querySelector('.v710-builder-zone'),ss=lessonSession();
  const key=zone&&ss?ss.index+':'+(ss.questions?.[ss.index]?.id||''):null;
  const pieces=zone?[...zone.querySelectorAll('.v710-builder-piece')]:[],off=[...(area?.querySelectorAll('.ds-order .v710-word-chip')||[])];
  const pieceTexts=pieces.map(x=>x.textContent),offTexts=off.filter(x=>x.disabled).map(x=>x.textContent);
  if(key&&key===seqKey&&scale()){
   const left=[...seqPieces];for(const piece of pieces){const i=left.indexOf(piece.textContent);if(i>=0)left.splice(i,1);else restart(piece,'ds-piece-in')}
   const was=[...seqOff];for(const chip of off){const i=was.indexOf(chip.textContent);if(i<0)continue;was.splice(i,1);if(!chip.disabled)restart(chip,'ds-chip-back')}
  }
  seqKey=key;seqPieces=pieceTexts;seqOff=offTexts;
 }
 let seqQueued=false;
 function onAnswers(records){
  for(const r of records){
   const el=r.target;
   if(r.type==='characterData'||(r.type==='childList'&&el.classList?.contains('v1017-count'))){
    const c=el.nodeType===3?el.parentElement:el;if(c?.classList.contains('v1017-count')&&scale())restart(c,'ds-bump');continue}
   if(!seqQueued&&(r.type==='childList'||r.attributeName==='disabled')&&el.closest?.('#answerArea')){seqQueued=true;requestAnimationFrame(()=>{seqQueued=false;syncSequence()})}
   if(r.attributeName==='class'&&el.classList.contains('v1017-card')&&el.classList.contains('matched')&&!String(r.oldValue||'').split(/\s+/).includes('matched')){
    const board=el.closest('.v1017-board');
    if(board&&!board.querySelector('.v1017-card:not(.matched)')&&!board.classList.contains('ds-all-matched'))setTimeout(()=>{if(board.isConnected&&scale())restart(board,'ds-all-matched')},420);
   }
  }
 }
 function installAnswers(){
  const lesson=document.getElementById('lesson');if(!lesson){setTimeout(installAnswers,300);return}
  new MutationObserver(onAnswers).observe(lesson,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','disabled'],attributeOldValue:true});
  lesson.addEventListener('input',e=>{const w=e.target.closest?.('.fill-input-wrap');if(w&&scale())restart(w,'ds-key')});
  lesson.addEventListener('animationend',e=>{const t=e.target;if(t.classList?.contains('ds-key'))t.classList.remove('ds-key')});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installAnswers,{once:true});else installAnswers();

 // ---- Lesson start ----
 // A tapped path stop presses in; the stage intro's start button sends a wave of light from where
 // it was tapped, and the lesson zooms in with the start sound. The engine's own flow is untouched.
 let launchAt=0;
 function installStart(){
  const paths=document.getElementById('v5Paths'),lesson=document.getElementById('lesson');
  if(!paths||!lesson){setTimeout(installStart,300);return}
  paths.addEventListener('pointerdown',e=>{const n=e.target.closest?.('.lp-stop .lp-node,.lp-stop .deen-stage-card');if(n&&scale())restart(n,'ds-press')});
  paths.addEventListener('animationend',e=>{if(e.target.classList?.contains('ds-press'))e.target.classList.remove('ds-press')});
  document.addEventListener('click',e=>{
   const b=e.target.closest?.('.deen-intro-dialog .deen-stage-intro .v5-primary');if(!b)return;
   launchAt=Date.now();if(!scale())return;
   const r=b.getBoundingClientRect(),w=document.createElement('div');w.className='ds-launch';w.setAttribute('aria-hidden','true');
   w.style.setProperty('--ds-x',Math.round(r.left+r.width/2)+'px');w.style.setProperty('--ds-y',Math.round(r.top+r.height/2)+'px');
   document.body.append(w);setTimeout(()=>w.remove(),700);
  },{capture:true});
  new MutationObserver(records=>{
   for(const r of records){
    if(!lesson.classList.contains('active')||String(r.oldValue||'').split(/\s+/).includes('active'))continue;
    if(Date.now()-launchAt<2000)sfx('start');
    if(scale()){restart(lesson,'ds-lesson-zoom');setTimeout(()=>lesson.classList.remove('ds-lesson-zoom'),420)}
   }
  }).observe(lesson,{attributes:true,attributeFilter:['class'],attributeOldValue:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installStart,{once:true});else installStart();

 // ---- Living companion ----
 // Tapping the companion (lesson, result, profile, review) makes it jump with a pop.
 document.addEventListener('pointerdown',e=>{
  const img=e.target.closest?.('.dsp-avatar-slot img,.dsr-empty-art img,#lesson .deen-character-question-avatar img,#lesson #resultView.show .ds-end-mascot');
  if(!img||!scale())return;restart(img,'ds-alive-tap');sfx('pop');
  setTimeout(()=>img.classList.remove('ds-alive-tap'),600);
 },{capture:true,passive:true});

 // ---- Streak and chest moments ----
 const STREAK_SAY={
  tr:{title:n=>n+' günlük seri!',first:'Serin başladı! Yarın da gel, alev büyüsün.',more:'Her gün bir adım. Yarın da gel!',cta:'Devam et',locale:'tr-TR'},
  en:{title:n=>n+'-day streak!',first:'Your streak has started! Come back tomorrow to grow the flame.',more:'One step every day. See you tomorrow!',cta:'Continue',locale:'en-GB'},
  ar:{title:n=>'سلسلة '+n+' '+(n===1?'يوم':n<=10?'أيام':'يومًا')+'!',first:'بدأت سلسلتك! عد غدًا ليكبر اللهب.',more:'خطوة كل يوم. نراك غدًا!',cta:'متابعة',locale:'ar'},
  de:{title:n=>n+(n===1?' Tag':' Tage')+' in Folge!',first:'Deine Serie hat begonnen! Komm morgen wieder, damit die Flamme wächst.',more:'Jeden Tag ein Schritt. Bis morgen!',cta:'Weiter',locale:'de-DE'},
  fr:{title:n=>'Série de '+n+(n===1?' jour':' jours')+' !',first:'Ta série commence ! Reviens demain pour faire grandir la flamme.',more:'Un pas chaque jour. À demain !',cta:'Continuer',locale:'fr-FR'}
 };
 let streakShownFor=null;
 const isoDay=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
 const FLAME='<svg class="ds-flame" viewBox="0 0 120 140" aria-hidden="true"><defs><linearGradient id="dsFlameOut" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff5a1f"/><stop offset=".6" stop-color="#ff9a2e"/><stop offset="1" stop-color="#ffc34d"/></linearGradient><linearGradient id="dsFlameIn" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffd166"/><stop offset="1" stop-color="#fff4c2"/></linearGradient></defs>'
  +'<path fill="url(#dsFlameOut)" d="M60 4c6 22 30 34 36 62 7 33-12 66-36 70-24-4-43-37-36-70 3-14 11-22 16-32 2 10 6 16 12 20-2-20 2-36 8-50z"/>'
  +'<path fill="url(#dsFlameIn)" d="M61 60c4 14 18 22 20 40 2 20-9 32-21 34-12-2-23-14-21-34 1-9 6-14 9-20 2 6 4 9 8 11-1-12 1-22 5-31z"/></svg>';
 function streakMoment(from,to){
  const say=STREAK_SAY[uiLang()],meta=appState().streakMeta||{},week=meta.weeklyActivity||{};
  const today=new Date(),first=new Date(today);first.setDate(today.getDate()-(today.getDay()+6)%7);
  let names=null;try{names=new Intl.DateTimeFormat(say.locale,{weekday:'narrow'})}catch(_){}
  const d=document.createElement('dialog');d.className='ds-streak';d.setAttribute('aria-labelledby','dsStreakTitle');
  const card=document.createElement('div');card.className='ds-streak-card';
  card.innerHTML='<div class="ds-flame-wrap">'+FLAME+'</div><div class="ds-count" aria-hidden="true"><span class="old"></span><span class="new"></span></div><h2 id="dsStreakTitle"></h2><p></p><div class="ds-week"></div><button type="button" class="ds-streak-cta"></button>';
  card.querySelector('.old').textContent=String(from);card.querySelector('.new').textContent=String(to);
  card.querySelector('h2').textContent=say.title(to);card.querySelector('p').textContent=to===1?say.first:say.more;
  const row=card.querySelector('.ds-week');
  for(let i=0;i<7;i++){
   const day=new Date(first);day.setDate(first.getDate()+i);const ago=Math.round((today-day)/864e5);
   const on=ago>=0&&(ago<to||!!week[isoDay(day)]);
   const cell=document.createElement('span');cell.className='ds-day'+(on?' on':'')+(ago===0?' today':'');
   const label=document.createElement('b');label.textContent=names?names.format(day):'';cell.append(label,document.createElement('i'));row.append(cell);
  }
  const cta=card.querySelector('.ds-streak-cta');cta.textContent=say.cta;
  d.append(card);(document.getElementById('phone')||document.body).append(d);
  d.addEventListener('close',()=>{d.remove();scheduleHome()},{once:true});
  cta.addEventListener('click',()=>d.close());
  try{d.showModal()}catch(_){d.remove();return}
  cta.focus({preventScroll:true});sfx('streak');
  if(scale())setTimeout(()=>{if(d.open)sfx('pop')},1400);
 }
 // The drawn chest replaces the CSS one (the weekly chest is seen from the other side). A ready
 // chest opens on the third tap, on the chest or its button; the first two shake it harder and
 // let more light out, and the third lets the engine's own open button run.
 const CHEST_ART='assets/design/chest/';
 function dressChest(card){
  const chest=card.querySelector('.v670-chest');if(!chest||chest.classList.contains('ds-art'))return;
  chest.classList.add('ds-art');
  const closed=new Image();closed.className='ds-chest-img closed';closed.alt='';closed.decoding='async';closed.src=CHEST_ART+(card.classList.contains('medium')?'chest-closed-b.webp':'chest-closed.webp');
  const open=new Image();open.className='ds-chest-img open';open.alt='';open.decoding='async';open.src=CHEST_ART+'chest-open.webp';
  const burst=document.createElement('span');burst.className='ds-chest-burst';
  const pips=document.createElement('span');pips.className='ds-chest-pips';pips.setAttribute('aria-hidden','true');pips.append(document.createElement('i'),document.createElement('i'),document.createElement('i'));
  chest.prepend(closed,open);chest.append(pips);
  const stage=card.querySelector('.v670-chest-stage')||chest;stage.append(burst);
  for(let k=0;k<10;k++){const sp=document.createElement('span');sp.className='ds-chest-spark'+(k%3===2?' mint':'');const a=-Math.PI/2+(k-4.5)*.33,d=90+(k%4)*22;
   sp.style.setProperty('--dx',Math.round(Math.cos(a)*d)+'px');sp.style.setProperty('--dy',Math.round(Math.sin(a)*d)+'px');sp.style.setProperty('--d',(440+k*28)+'ms');stage.append(sp)}
  [closed,open].forEach(i=>i.setAttribute('aria-hidden','true'));
 }
 // The engine's chest dialog is written in Turkish only; its text is translated in place for the
 // other app languages (exact lines, then lines with numbers).
 const CHEST_TEXT={
  'KÜÇÜK SANDIK':['SMALL CHEST','الصندوق الصغير','KLEINE TRUHE','PETIT COFFRE'],
  'ORTA SANDIK':['MEDIUM CHEST','الصندوق المتوسط','MITTLERE TRUHE','COFFRE MOYEN'],
  'Günlük sandık açıldı':['Daily chest opened','تم فتح الصندوق اليومي','Tägliche Truhe geöffnet','Coffre du jour ouvert'],
  'Günlük sandığın hazır':['Your daily chest is ready','صندوقك اليومي جاهز','Deine tägliche Truhe ist bereit','Ton coffre du jour est prêt'],
  'Günlük sandık':['Daily chest','الصندوق اليومي','Tägliche Truhe','Coffre du jour'],
  'Bugünün görev ödülü daha önce toplandı.':['Today’s quest reward has already been collected.','تم جمع مكافأة مهام اليوم مسبقًا.','Die heutige Aufgabenbelohnung wurde bereits abgeholt.','La récompense des quêtes du jour a déjà été récupérée.'],
  '3 görev mührü ve Bugünkü Yolculuk tamamlandı.':['3 quest seals and Today’s Journey completed.','اكتملت 3 أختام مهام ورحلة اليوم.','3 Aufgabensiegel und die Heutige Lernreise geschafft.','3 sceaux de quête et le Parcours du jour terminés.'],
  '3 görev mührü + tamamlanmış Bugünkü Yolculuk gerekir.':['Needs 3 quest seals + a completed Today’s Journey.','يتطلب 3 أختام مهام + إكمال رحلة اليوم.','Benötigt 3 Aufgabensiegel + eine abgeschlossene Heutige Lernreise.','Il faut 3 sceaux de quête + le Parcours du jour terminé.'],
  'Haftalık sandık açıldı':['Weekly chest opened','تم فتح الصندوق الأسبوعي','Wochentruhe geöffnet','Coffre de la semaine ouvert'],
  'Haftalık ritim ödülü hazır':['Weekly rhythm reward ready','مكافأة الإيقاع الأسبوعي جاهزة','Wochenrhythmus-Belohnung bereit','Récompense du rythme hebdo prête'],
  'Haftalık ritim sandığı':['Weekly rhythm chest','صندوق الإيقاع الأسبوعي','Wochenrhythmus-Truhe','Coffre du rythme hebdo'],
  'Bu haftanın ödülü daha önce toplandı.':['This week’s reward has already been collected.','تم جمع مكافأة هذا الأسبوع مسبقًا.','Die Belohnung dieser Woche wurde bereits abgeholt.','La récompense de la semaine a déjà été récupérée.'],
  '5 farklı günde Daily Journey tamamlandı.':['Today’s Journey completed on 5 different days.','اكتملت رحلة اليوم في 5 أيام مختلفة.','Heutige Lernreise an 5 verschiedenen Tagen geschafft.','Parcours du jour terminé sur 5 jours différents.'],
  '5 farklı günde Bugünkü Yolculuk tamamla.':['Complete Today’s Journey on 5 different days.','أكمل رحلة اليوم في 5 أيام مختلفة.','Schließe die Heutige Lernreise an 5 verschiedenen Tagen ab.','Termine le Parcours du jour sur 5 jours différents.'],
  'Görev mühürleri':['Quest seals','أختام المهام','Aufgabensiegel','Sceaux de quête'],
  'Tamamlanmış günler':['Completed days','الأيام المكتملة','Abgeschlossene Tage','Jours terminés'],
  'DAHA ÖNCE AÇILDI':['ALREADY OPENED','فُتح مسبقًا','BEREITS GEÖFFNET','DÉJÀ OUVERT'],
  'SANDIĞI AÇ':['OPEN CHEST','افتح الصندوق','TRUHE ÖFFNEN','OUVRIR LE COFFRE'],
  'SANDIK HENÜZ KİLİTLİ':['CHEST STILL LOCKED','الصندوق ما زال مقفلًا','TRUHE NOCH GESPERRT','COFFRE ENCORE VERROUILLÉ'],
  'AÇILIYOR…':['OPENING…','جارٍ الفتح…','WIRD GEÖFFNET…','OUVERTURE…'],
  'TEKRAR DENE':['TRY AGAIN','حاول مجددًا','ERNEUT VERSUCHEN','RÉESSAYER'],
  'HAFTALIK SANDIĞA GEÇ':['GO TO WEEKLY CHEST','انتقل إلى الصندوق الأسبوعي','ZUR WOCHENTRUHE','VERS LE COFFRE HEBDO'],
  'YOLCULUĞA DÖN':['BACK TO THE JOURNEY','العودة إلى الرحلة','ZURÜCK ZUR REISE','RETOUR AU PARCOURS'],
  'PIRILTI':['SPARKLES','بريق','FUNKEN','ÉTINCELLES'],
  'BONUS XP':['BONUS XP','نقاط خبرة إضافية','BONUS-XP','XP BONUS'],
  'SERİ KORUMA':['STREAK PROTECTION','حماية السلسلة','SERIENSCHUTZ','PROTECTION DE SÉRIE'],
  'Haftalık sandığın hazır':['Your weekly chest is ready','صندوقك الأسبوعي جاهز','Deine Wochentruhe ist bereit','Ton coffre de la semaine est prêt'],
  '5 günlük ritim tamamlandı. Orta sandığı şimdi açabilirsin.':['Your 5-day rhythm is complete. You can open the medium chest now.','اكتمل إيقاع الأيام الخمسة. يمكنك فتح الصندوق المتوسط الآن.','Dein 5-Tage-Rhythmus ist geschafft. Du kannst jetzt die mittlere Truhe öffnen.','Ton rythme de 5 jours est complet. Tu peux ouvrir le coffre moyen maintenant.'],
  'Bugünün ödül döngüsü tamam':['Today’s reward cycle is complete','اكتملت دورة مكافآت اليوم','Der heutige Belohnungszyklus ist geschafft','Le cycle de récompenses du jour est terminé'],
  'Yarın yeni Daily Journey ve yeni görev mühürleri açılacak.':['Tomorrow a new Today’s Journey and new quest seals open.','غدًا تُفتح رحلة يوم جديدة وأختام مهام جديدة.','Morgen öffnen sich eine neue Heutige Lernreise und neue Aufgabensiegel.','Demain, un nouveau Parcours du jour et de nouveaux sceaux de quête s’ouvrent.'],
  'Haftalık ritim tamamlandı':['Weekly rhythm complete','اكتمل الإيقاع الأسبوعي','Wochenrhythmus geschafft','Rythme hebdo terminé'],
  'Yeni haftada sayaç yeniden başlar; dini içerik erişimi bu ödül sistemine bağlı değildir.':['The counter restarts next week; access to religious content does not depend on this reward system.','يبدأ العداد من جديد في الأسبوع القادم، ولا يرتبط الوصول إلى المحتوى الديني بنظام المكافآت هذا.','Der Zähler beginnt in der neuen Woche von vorn; der Zugang zu religiösen Inhalten hängt nicht von diesem Belohnungssystem ab.','Le compteur repart la semaine prochaine ; l’accès au contenu religieux ne dépend pas de ce système de récompenses.'],
  'Ödül öğrenme ve hatırlama davranışına aittir; ibadetin kendisi puanlanmaz. Premium dini içeriği kilitlemez.':['Rewards are for learning and remembering; worship itself is never scored. Premium never locks religious content.','المكافأة على التعلّم والتذكّر، أما العبادة نفسها فلا تُقيَّم بالنقاط. ولا يقفل الاشتراك المميز المحتوى الديني.','Belohnt wird Lernen und Erinnern; die Anbetung selbst wird nie bewertet. Premium sperrt keine religiösen Inhalte.','La récompense porte sur l’apprentissage et la mémorisation ; l’adoration elle-même n’est jamais notée. Premium ne verrouille aucun contenu religieux.'],
  'Kapat':['Close','إغلاق','Schließen','Fermer']
 };
 const CHEST_PATTERNS=[
  [/^(\d+)\/3 mühür$/,n=>[n+'/3 seals',n+'/3 أختام',n+'/3 Siegel',n+'/3 sceaux']],
  [/^(\d+)\/5 gün$/,n=>[n+'/5 days',n+'/5 أيام',n+'/5 Tage',n+'/5 jours']],
  [/^Haftalık ritim · (\d+)\/5$/,n=>['Weekly rhythm · '+n+'/5','الإيقاع الأسبوعي · '+n+'/5','Wochenrhythmus · '+n+'/5','Rythme hebdo · '+n+'/5']],
  [/^Orta sandığa (\d+) tamamlanmış günlük yolculuk kaldı\.$/,n=>{const one=n==='1';return [n+' more completed '+(one?'Today’s Journey':'Today’s Journeys')+' to the medium chest.','تبقّى '+n+' من رحلات اليوم المكتملة للصندوق المتوسط.','Noch '+n+' abgeschlossene '+(one?'Tagesreise':'Tagesreisen')+' bis zur mittleren Truhe.','Encore '+n+' Parcours du jour '+(one?'terminé':'terminés')+' avant le coffre moyen.']}],
  [/^Sıradaki seri kilometre taşı · (\d+) gün$/,n=>['Next streak milestone · '+n+(n==='1'?' day':' days'),'المحطة التالية للسلسلة · '+n+' يوم','Nächster Serien-Meilenstein · '+n+(n==='1'?' Tag':' Tage'),'Prochain palier de série · '+n+(n==='1'?' jour':' jours')]],
  [/^Mevcut seri (\d+) gün\. Öğrenme ritmini kendi temponda sürdür\.$/,n=>['Current streak: '+n+(n==='1'?' day':' days')+'. Keep your learning rhythm at your own pace.','السلسلة الحالية '+n+' يوم. واصل إيقاع تعلّمك بوتيرتك.','Aktuelle Serie: '+n+(n==='1'?' Tag':' Tage')+'. Behalte deinen Lernrhythmus in deinem Tempo bei.','Série actuelle : '+n+(n==='1'?' jour':' jours')+'. Garde ton rythme d’apprentissage à ton propre tempo.']]
 ];
 const CHEST_LANGS={en:0,ar:1,de:2,fr:3};
 function chestLine(text,i){
  const hit=CHEST_TEXT[text];if(hit)return hit[i];
  for(const [re,fn] of CHEST_PATTERNS){const m=re.exec(text);if(m)return fn(m[1])[i]}
  return null;
 }
 // Writes only when a line changes, so the dialog's own observer settles at once.
 function localizeChest(d){
  const i=CHEST_LANGS[uiLang()];if(i==null)return;
  const walk=document.createTreeWalker(d,NodeFilter.SHOW_TEXT);
  for(let n=walk.nextNode();n;n=walk.nextNode()){
   const raw=n.data,text=raw.trim();if(!text)continue;const to=chestLine(text,i);
   if(to!=null&&to!==text)n.data=raw.replace(text,to);
  }
  for(const el of d.querySelectorAll('[aria-label]')){const to=chestLine(el.getAttribute('aria-label').trim(),i);if(to!=null&&to!==el.getAttribute('aria-label'))el.setAttribute('aria-label',to)}
 }
 const chestTaps=new WeakMap();let chestPass=false;
 document.addEventListener('click',e=>{
  if(chestPass)return;
  const card=e.target.closest?.('dialog.v670-reward .v670-card');if(!card||card.classList.contains('opened'))return;
  const btn=card.querySelector('.v670-open'),onChestArt=e.target.closest('.v670-chest-stage'),onBtn=e.target.closest('.v670-open');
  if(!btn||btn.disabled||(!onChestArt&&!onBtn))return;
  const n=(chestTaps.get(card)||0)+1;
  if(n>=3){chestTaps.set(card,0);if(onChestArt){chestPass=true;try{btn.click()}finally{chestPass=false}}return}
  chestTaps.set(card,n);if(onBtn){e.preventDefault();e.stopImmediatePropagation()}
  const chest=card.querySelector('.v670-chest');chest?.style.setProperty('--ds-charge',String(n));
  card.querySelectorAll('.ds-chest-pips i').forEach((p,i)=>p.classList.toggle('on',i<n));
  if(chest&&scale()){chest.classList.remove('ds-tap1','ds-tap2');void chest.offsetWidth;chest.classList.add('ds-tap'+n)}
  sfx('chestTap'+n);
 },{capture:true});
 // A chest that opens bursts into confetti as its loot appears, with the reward sound.
 function onChest(records){
  for(const r of records){
   if(r.type==='childList'){for(const n of r.addedNodes){const c=n.matches?.('dialog.v670-reward')&&n.querySelector('.v670-card');if(c){dressChest(c);localizeChest(n);new MutationObserver(()=>localizeChest(n)).observe(n,{subtree:true,childList:true,characterData:true});chestWatch.observe(c,{attributes:true,attributeFilter:['class'],attributeOldValue:true})}}continue}
   const c=r.target;if(!c.classList.contains('opened')||String(r.oldValue||'').split(/\s+/).includes('opened'))continue;
   c.querySelectorAll('.ds-chest-pips i').forEach(p=>p.classList.add('on'));
   const d=c.closest('dialog');setTimeout(()=>{if(!d?.open)return;confetti(d);sfx('reward')},scale()?900:0);
  }
 }
 const chestWatch=new MutationObserver(onChest);
 function installChest(){
  const phone=document.getElementById('phone');if(!phone){setTimeout(installChest,300);return}
  chestWatch.observe(phone,{childList:true});chestWatch.observe(document.body,{childList:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installChest,{once:true});else installChest();

 // ---- M5: tab changes ----
 // A screen that becomes active slides in from the side of the chosen tab (tab order decides,
 // mirrored right-to-left) and its tab icon hops. Navigation itself is untouched.
 const tabOrder=()=>[...document.querySelectorAll('.navbtn[data-screen]')].map(b=>b.dataset.screen);
 let activeScreen=null,screenTimer=0;
 function onScreens(records){
  for(const r of records){
   const s=r.target;if(!s.classList.contains('screen')||!s.classList.contains('active')||String(r.oldValue||'').split(/\s+/).includes('active'))continue;
   const order=tabOrder(),from=order.indexOf(activeScreen),to=order.indexOf(s.id);activeScreen=s.id;
   if(settling()||!scale()||from<0||to<0||from===to)continue;
   const dir=(to>from?1:-1)*(root.getAttribute('dir')==='rtl'?-1:1);
   s.style.setProperty('--ds-from',(28*dir)+'px');restart(s,'ds-screen-in');
   const tab=document.querySelector('.navbtn[data-screen="'+s.id+'"]');if(tab)restart(tab,'ds-nav-hop');
   clearTimeout(screenTimer);screenTimer=setTimeout(()=>{s.classList.remove('ds-screen-in');tab?.classList.remove('ds-nav-hop')},700);
  }
 }
 function installScreens(){
  const screens=document.querySelectorAll('.screen');
  if(!screens.length){setTimeout(installScreens,300);return}
  activeScreen=document.querySelector('.screen.active')?.id||null;
  const watch=new MutationObserver(onScreens);
  for(const s of screens)watch.observe(s,{attributes:true,attributeFilter:['class'],attributeOldValue:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installScreens,{once:true});else installScreens();
 window.DEEN_DS_MOTION=Object.freeze({version:'ds-motion-m11',celebrate,confetti,reduced,streakMoment});
})();
