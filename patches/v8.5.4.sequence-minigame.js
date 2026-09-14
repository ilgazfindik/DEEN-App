(()=>{
 const VERSION='8.5.4-SEQUENCE-MINIGAME',BUILD='854seq1';
 const addition=`<!-- DEEN v8.5.4 — Sequence Drag Mini-game -->
<style id="deen-v854-sequence-css">
.question-frame.v854-sequence-mode{padding-top:44px}
.question-frame.v854-sequence-mode .qtype{margin-bottom:10px;color:#9fb9bd}
.v854-seq-wrap{display:flex;flex-direction:column;gap:9px;margin-top:3px}
.v854-seq-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border:1px solid rgba(80,137,145,.3);border-radius:14px;background:rgba(6,29,37,.58);font:800 8px/1.2 Inter,system-ui,sans-serif;color:#8fa9ae;letter-spacing:.25px}
.v854-seq-head b{color:#dff3ef;font-size:9px}
.v854-seq-list{display:flex;flex-direction:column;gap:8px;min-height:160px;padding:3px 0;touch-action:none}
.v854-seq-card{position:relative;width:100%;min-height:62px;padding:11px 42px 11px 50px;border-radius:18px;border:1px solid rgba(88,139,151,.48);background:linear-gradient(180deg,rgba(9,38,48,.98),rgba(6,28,36,.99));color:#edf6f4;box-shadow:inset 0 1px rgba(255,255,255,.025),0 8px 17px rgba(0,0,0,.14);font:780 12px/1.26 Inter,system-ui,sans-serif;text-align:left;display:flex;align-items:center;cursor:grab;user-select:none;-webkit-user-select:none;transition:transform 140ms ease,border-color 170ms ease,background 170ms ease,box-shadow 170ms ease,opacity 170ms ease}
.v854-seq-card:active{cursor:grabbing}
.v854-seq-num{position:absolute;left:10px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:10px;display:grid;place-items:center;border:1px solid rgba(101,218,190,.25);background:linear-gradient(180deg,rgba(24,84,78,.75),rgba(10,52,58,.8));color:#a8ead6;font:950 10px/1 Inter,system-ui,sans-serif}
.v854-seq-grip{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#63868b;font:900 18px/1 Inter,system-ui,sans-serif;letter-spacing:-3px}
.v854-seq-card.dragging{opacity:.72;transform:scale(1.02);border-color:#77ddc2;box-shadow:0 13px 27px rgba(0,0,0,.26),0 0 0 2px rgba(119,221,194,.09);z-index:8}
.v854-seq-card.drop-target{border-color:#65cbb4;background:linear-gradient(180deg,rgba(14,63,62,.98),rgba(7,39,45,.99))}
.v854-seq-card.correct-pos{border-color:rgba(111,224,190,.7);background:linear-gradient(180deg,rgba(18,76,64,.98),rgba(8,47,42,.99));box-shadow:0 0 0 2px rgba(111,224,190,.08),0 8px 20px rgba(0,0,0,.15)}
.v854-seq-card.correct-pos .v854-seq-num{background:linear-gradient(180deg,#2d806d,#155b52);color:#eafff8}
.v854-seq-list.wrong{animation:v854Wrong 310ms ease}
.v854-seq-list.correct{animation:v854Correct 520ms cubic-bezier(.2,.75,.25,1)}
.v854-seq-pop{align-self:center;min-width:116px;padding:7px 12px;border-radius:999px;border:1px solid rgba(121,225,194,.3);background:rgba(10,54,50,.96);color:#a7efd8;text-align:center;font:950 8px/1 Inter,system-ui,sans-serif;letter-spacing:.6px;animation:v854Pop 620ms ease both}
.v854-seq-pop.bad{border-color:rgba(219,132,148,.3);background:rgba(67,34,42,.96);color:#efb0bc}
.v854-seq-check{min-height:48px;border:1px solid rgba(101,201,180,.34);border-radius:15px;background:linear-gradient(180deg,#185b57,#104746);color:#eafff8;font:900 11px/1 Inter,system-ui,sans-serif;letter-spacing:.4px;box-shadow:0 9px 18px rgba(0,0,0,.16)}
.v854-seq-check:disabled{opacity:.48}
@keyframes v854Wrong{0%,100%{transform:translateX(0)}28%{transform:translateX(-4px)}62%{transform:translateX(4px)}}
@keyframes v854Correct{0%{transform:scale(.99)}45%{transform:scale(1.012);filter:brightness(1.12)}100%{transform:scale(1);filter:brightness(1)}}
@keyframes v854Pop{0%{opacity:0;transform:translateY(5px) scale(.9)}25%,72%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-4px) scale(.97)}}
@media(max-width:390px){.v854-seq-card{min-height:58px;padding:10px 38px 10px 45px;border-radius:16px;font-size:11px}.v854-seq-num{width:26px;height:26px}.v854-seq-list{gap:7px}}
@media(prefers-reduced-motion:reduce){.v854-seq-card,.v854-seq-list,.v854-seq-pop{animation:none!important;transition:none!important}}
</style>
<script id="deen-v854-sequence-runtime">
(()=>{
 if(window.__deenV854Sequence)return;window.__deenV854Sequence=true;
 const VERSION='8.5.4-SEQUENCE-MINIGAME',BUILD='854seq1';
 const oldSequence=typeof renderSequence==='function'?renderSequence:null;
 let rounds=0,checks=0,misses=0,autoAdvanced=0,advanceTimer=0;
 const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR').replace(/\\s+/g,' ');
 const shuffle=a=>{const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out};
 function haptic(ok){try{if(navigator.vibrate)navigator.vibrate(ok?16:[10,24,10])}catch(_){}}
 function eligible(q){return !!q&&Array.isArray(q.items)&&Array.isArray(q.correct_order)&&q.correct_order.length>1&&(q.activity_type==='build_sequence'||q.type==='sequence'||q.question_type==='sequence')}
 function premiumSequence(q,area){
  if(!eligible(q))return oldSequence?.(q,area);
  clearTimeout(advanceTimer);rounds++;
  const frame=document.querySelector('.question-frame');frame?.classList.add('v854-sequence-mode');
  const hint=document.getElementById('qType');if(hint)hint.textContent='Kartları tutup sürükle · doğru sıraya yerleştir.';
  const expected=q.correct_order.map(String);
  let values=shuffle((q.items||expected).map(String));
  if(values.length===expected.length&&values.every((v,i)=>norm(v)===norm(expected[i]))&&values.length>1)[values[0],values[1]]=[values[1],values[0]];
  const wrap=document.createElement('div');wrap.className='v854-seq-wrap';
  const head=document.createElement('div');head.className='v854-seq-head';
  const list=document.createElement('div');list.className='v854-seq-list';
  const check=document.createElement('button');check.type='button';check.className='v854-seq-check';check.textContent='SIRAYI KONTROL ET';
  head.innerHTML='<span>Sürükleyerek sırala</span><b>'+values.length+' ADIM</b>';
  wrap.append(head,list,check);area.append(wrap);
  let finished=false,errors=0,dragEl=null,pointerId=null,startY=0,lastY=0;
  function current(){return [...list.querySelectorAll('.v854-seq-card')].map(x=>x.dataset.value||'')}
  function updateNums(){[...list.children].forEach((el,i)=>{el.querySelector('.v854-seq-num').textContent=String(i+1);el.classList.toggle('correct-pos',norm(el.dataset.value)===norm(expected[i]))})}
  function make(text){
   const b=document.createElement('button');b.type='button';b.className='v854-seq-card';b.dataset.value=text;b.draggable=true;
   const n=document.createElement('span');n.className='v854-seq-num';
   const t=document.createElement('span');t.textContent=text;
   const g=document.createElement('span');g.className='v854-seq-grip';g.textContent='≡';
   b.append(n,t,g);
   b.addEventListener('dragstart',e=>{if(finished)return e.preventDefault();dragEl=b;b.classList.add('dragging');try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',text)}catch(_){}});
   b.addEventListener('dragend',()=>{b.classList.remove('dragging');dragEl=null;list.querySelectorAll('.drop-target').forEach(x=>x.classList.remove('drop-target'));updateNums()});
   b.addEventListener('dragover',e=>{if(!dragEl||dragEl===b)return;e.preventDefault();b.classList.add('drop-target');const r=b.getBoundingClientRect(),after=e.clientY>r.top+r.height/2;list.insertBefore(dragEl,after?b.nextSibling:b);updateNums()});
   b.addEventListener('dragleave',()=>b.classList.remove('drop-target'));
   b.addEventListener('pointerdown',e=>{if(finished||e.pointerType==='mouse')return;pointerId=e.pointerId;dragEl=b;startY=lastY=e.clientY;b.classList.add('dragging');try{b.setPointerCapture(pointerId)}catch(_){};e.preventDefault()});
   b.addEventListener('pointermove',e=>{if(pointerId!==e.pointerId||dragEl!==b)return;lastY=e.clientY;const over=document.elementFromPoint(e.clientX,e.clientY)?.closest?.('.v854-seq-card');if(over&&over!==b&&over.parentElement===list){const r=over.getBoundingClientRect(),after=e.clientY>r.top+r.height/2;list.insertBefore(b,after?over.nextSibling:over);updateNums()}e.preventDefault()});
   const end=e=>{if(pointerId!==e.pointerId||dragEl!==b)return;try{b.releasePointerCapture(pointerId)}catch(_){};pointerId=null;dragEl=null;b.classList.remove('dragging');updateNums();if(Math.abs(lastY-startY)>6)try{navigator.vibrate?.(7)}catch(_){};e.preventDefault()};
   b.addEventListener('pointerup',end);b.addEventListener('pointercancel',end);
   return b;
  }
  values.forEach(v=>list.append(make(v)));updateNums();
  function pop(text,bad=false){wrap.querySelector('.v854-seq-pop')?.remove();const p=document.createElement('div');p.className='v854-seq-pop'+(bad?' bad':'');p.textContent=text;wrap.insertBefore(p,check);setTimeout(()=>p.remove(),650)}
  function finish(ok){
   if(finished)return;finished=true;list.querySelectorAll('button').forEach(b=>b.disabled=true);check.disabled=true;list.classList.add('correct');haptic(true);pop('✓ SIRA TAMAM');
   setTimeout(()=>{
    try{completeQuestion(ok,q)}catch(err){console.error('DEEN sequence complete',err);return}
    const title=document.getElementById('feedbackTitle');if(title)title.textContent=ok?'✓ SIRALAMA KUSURSUZ':'Sıralama tamamlandı';
    try{document.dispatchEvent(new CustomEvent('deen:sequence:complete',{detail:{version:VERSION,id:q.id||'',correct:ok,errors,steps:expected.length}}))}catch(_){}
    if(ok)advanceTimer=setTimeout(()=>{const btn=document.getElementById('continueBtn');if(btn&&!btn.disabled&&document.getElementById('feedback')?.classList.contains('show')){autoAdvanced++;btn.click()}},1050);
   },430)
  }
  check.onclick=()=>{
   if(finished)return;checks++;
   const got=current(),ok=got.length===expected.length&&expected.every((x,i)=>norm(x)===norm(got[i]));
   if(ok)return finish(errors===0);
   errors++;misses++;haptic(false);list.classList.remove('wrong');void list.offsetWidth;list.classList.add('wrong');pop('SIRA HENÜZ DOĞRU DEĞİL',true);setTimeout(()=>list.classList.remove('wrong'),340);
   try{document.dispatchEvent(new CustomEvent('deen:sequence:miss',{detail:{version:VERSION,id:q.id||'',errors}}))}catch(_){}
  };
  return true;
 }
 try{window.renderSequence=premiumSequence;renderSequence=premiumSequence}catch(_){window.renderSequence=premiumSequence}
 const oldRender=typeof renderQuestion==='function'?renderQuestion:null;
 if(oldRender&&!oldRender.__v854){
  const wrapped=function(...args){clearTimeout(advanceTimer);document.querySelector('.question-frame')?.classList.remove('v854-sequence-mode');return oldRender.apply(this,args)};
  wrapped.__v854=true;try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
 }
 window.DEEN_SEQUENCE_MINIGAME={version:VERSION,build:BUILD,render:premiumSequence,eligible,check:()=>({version:VERSION,build:BUILD,ready:true,rounds,checks,misses,autoAdvanced,active:!!document.querySelector('.v854-seq-wrap')})};
 document.documentElement.dataset.deenSequence='ready';
})();
<\/script>`;
 window.DEEN_PATCH_V854=function(html){let out=String(html);if(out.includes('deen-v854-sequence-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();