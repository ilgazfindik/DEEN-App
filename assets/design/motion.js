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
 // A chest that opens bursts into confetti as its loot appears, with the reward sound.
 function onChest(records){
  for(const r of records){
   if(r.type==='childList'){for(const n of r.addedNodes){const c=n.matches?.('dialog.v670-reward')&&n.querySelector('.v670-card');if(c)chestWatch.observe(c,{attributes:true,attributeFilter:['class'],attributeOldValue:true})}continue}
   const c=r.target;if(!c.classList.contains('opened')||String(r.oldValue||'').split(/\s+/).includes('opened'))continue;
   const d=c.closest('dialog');setTimeout(()=>{if(!d?.open)return;confetti(d);sfx('reward')},scale()?820:0);
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
 window.DEEN_DS_MOTION=Object.freeze({version:'ds-motion-m8',celebrate,confetti,reduced,streakMoment});
})();
