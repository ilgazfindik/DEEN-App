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
  if(pendingStop){
   const {from,to}=pendingStop;pendingStop=null;
   if(scale()){
    const done=document.getElementById(from),next=document.getElementById(to);
    if(done)restart(done,'ds-stop-done');
    setTimeout(()=>{const n=document.getElementById(to);if(!n)return;restart(n,'ds-stop-unlock');try{n.scrollIntoView({block:'center',behavior:'smooth'})}catch(_){}},320);
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
   const k=Math.min(1,(now-t0)/dur);written=el.textContent=k>=1?final:String(Math.round(from+(to-from)*ease(k)));
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
 window.DEEN_DS_MOTION=Object.freeze({version:'ds-motion-m5',celebrate,confetti,reduced});
})();
