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
   // The engine's combo-milestone mascot appeared: the question mascot hops with it.
   if(r.type==='childList')for(const n of r.addedNodes){if(n.nodeType===1&&(n.id==='deenDirectComboRise'||n.querySelector?.('#deenDirectComboRise'))){
    const avatar=document.querySelector('#lesson .deen-character-question-avatar');if(avatar){restart(avatar,'ds-hop');setTimeout(()=>avatar.classList.remove('ds-hop'),700)}}}
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
 window.DEEN_DS_MOTION=Object.freeze({version:'ds-motion-m2',celebrate,confetti,reduced});
})();
