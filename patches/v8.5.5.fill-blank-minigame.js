(()=>{
 const VERSION='8.5.5-FILL-BLANK-MINIGAME',BUILD='855fill1';
 const addition=`<!-- DEEN v8.5.5 — Fill Blank Chip Mini-game -->
<style id="deen-v855-fill-css">
.question-frame.v855-fill-mode{padding-top:44px}
.question-frame.v855-fill-mode .qtype{margin-bottom:10px;color:#9fb9bd}
.v855-fill-wrap{display:flex;flex-direction:column;gap:11px;margin-top:3px}
.v855-fill-slot{position:relative;min-height:78px;border:1.5px dashed rgba(105,197,180,.45);border-radius:20px;background:linear-gradient(180deg,rgba(8,38,47,.86),rgba(5,27,35,.94));display:flex;align-items:center;justify-content:center;padding:13px 16px;color:#76969b;font:850 11px/1.25 Inter,system-ui,sans-serif;letter-spacing:.25px;transition:border-color 170ms ease,background 170ms ease,box-shadow 170ms ease,transform 170ms ease}
.v855-fill-slot:before{content:"BOŞLUĞA YERLEŞTİR";position:absolute;top:8px;left:50%;transform:translateX(-50%);font:950 5px/1 Inter,system-ui,sans-serif;letter-spacing:1.2px;color:#597b80}
.v855-fill-slot.drag-over{border-style:solid;border-color:#73ddc1;background:linear-gradient(180deg,rgba(13,64,62,.92),rgba(6,38,44,.96));box-shadow:0 0 0 3px rgba(115,221,193,.08);transform:scale(1.01)}
.v855-fill-slot.correct{border-style:solid;border-color:#76dfc0;background:linear-gradient(180deg,rgba(18,78,65,.98),rgba(8,48,42,.99));box-shadow:0 0 0 2px rgba(118,223,192,.09),0 12px 26px rgba(28,145,118,.13);animation:v855Correct 460ms cubic-bezier(.2,.75,.25,1)}
.v855-fill-answer{margin-top:8px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:9px 14px;border-radius:14px;background:rgba(18,84,69,.66);border:1px solid rgba(143,233,205,.27);color:#eafff7;font:900 14px/1.1 Inter,system-ui,sans-serif}
.v855-fill-answer:before{content:"✓";color:#9ce8cf}
.v855-fill-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;padding:3px 0}
.v855-fill-chip{min-height:45px;padding:10px 14px;border-radius:15px;border:1px solid rgba(88,142,151,.5);background:linear-gradient(180deg,rgba(10,42,51,.98),rgba(6,29,37,.99));color:#edf7f4;box-shadow:inset 0 1px rgba(255,255,255,.025),0 7px 15px rgba(0,0,0,.13);font:820 12px/1.1 Inter,system-ui,sans-serif;cursor:grab;user-select:none;-webkit-user-select:none;touch-action:none;transition:transform 130ms ease,border-color 170ms ease,background 170ms ease,opacity 170ms ease,box-shadow 170ms ease}
.v855-fill-chip:not(:disabled):active{transform:scale(.96);cursor:grabbing}
.v855-fill-chip.dragging{opacity:.68;transform:scale(1.035);border-color:#75dec2;box-shadow:0 11px 22px rgba(0,0,0,.22),0 0 0 2px rgba(117,222,194,.08)}
.v855-fill-chip.wrong{border-color:#d98292;background:linear-gradient(180deg,rgba(76,39,48,.98),rgba(46,27,34,.99));animation:v855Wrong 300ms ease;color:#ffeef1}
.v855-fill-chip.correct-chip{border-color:#78dfbf;background:linear-gradient(180deg,rgba(20,79,66,.98),rgba(9,48,42,.99));color:#eafff7}
.v855-fill-help{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border:1px solid rgba(78,133,142,.3);border-radius:14px;background:rgba(6,29,37,.58);font:800 8px/1.2 Inter,system-ui,sans-serif;color:#8fa9ae}
.v855-fill-help b{color:#dcefeb;font-size:8px}
.v855-fill-pop{align-self:center;min-width:112px;padding:7px 12px;border-radius:999px;border:1px solid rgba(121,225,194,.3);background:rgba(10,54,50,.96);color:#a7efd8;text-align:center;font:950 8px/1 Inter,system-ui,sans-serif;letter-spacing:.6px;animation:v855Pop 620ms ease both}
.v855-fill-pop.bad{border-color:rgba(219,132,148,.3);background:rgba(67,34,42,.96);color:#efb0bc}
@keyframes v855Correct{0%{transform:scale(.985)}45%{transform:scale(1.02);filter:brightness(1.13)}100%{transform:scale(1);filter:brightness(1)}}
@keyframes v855Wrong{0%,100%{transform:translateX(0)}28%{transform:translateX(-4px)}62%{transform:translateX(4px)}}
@keyframes v855Pop{0%{opacity:0;transform:translateY(5px) scale(.9)}25%,72%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-4px) scale(.97)}}
@media(max-width:390px){.v855-fill-slot{min-height:72px;border-radius:18px}.v855-fill-chip{min-height:42px;padding:9px 12px;border-radius:14px;font-size:11px}.v855-fill-bank{gap:7px}}
@media(prefers-reduced-motion:reduce){.v855-fill-slot,.v855-fill-chip,.v855-fill-pop{animation:none!important;transition:none!important}}
</style>
<script id="deen-v855-fill-runtime">
(()=>{
 if(window.__deenV855Fill)return;window.__deenV855Fill=true;
 const VERSION='8.5.5-FILL-BLANK-MINIGAME',BUILD='855fill1';
 const oldFill=typeof renderFillBlank==='function'?renderFillBlank:null;
 let rounds=0,attempts=0,misses=0,autoAdvanced=0,advanceTimer=0;
 const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR').replace(/\\s+/g,' ');
 function eligible(q){
  if(!q||!Array.isArray(q.options_tr)||q.options_tr.length<2)return false;
  try{if(typeof isFillBlankQuestion==='function'&&isFillBlankQuestion(q))return true}catch(_){}
  return q.type==='fill_blank'||q.question_type==='fill_blank'||['fill_blank','missing_word','cloze','gap_fill'].includes(q.activity_type);
 }
 function answers(q){const raw=q.correct_answer??q.answer??q.correct;return (Array.isArray(raw)?raw:[raw]).filter(x=>x!==undefined&&x!==null).map(String)}
 function isCorrect(q,value){const a=answers(q);return a.some(x=>norm(x)===norm(value))}
 function haptic(ok){try{if(navigator.vibrate)navigator.vibrate(ok?16:[10,22,10])}catch(_){}}
 function premiumFill(q,area){
  if(!eligible(q))return oldFill?.(q,area);
  clearTimeout(advanceTimer);rounds++;
  const frame=document.querySelector('.question-frame');frame?.classList.add('v855-fill-mode');
  const hint=document.getElementById('qType');if(hint)hint.textContent='Kelimeyi boşluğa sürükle ya da dokun.';
  const wrap=document.createElement('div');wrap.className='v855-fill-wrap';
  const slot=document.createElement('div');slot.className='v855-fill-slot';slot.setAttribute('role','button');slot.setAttribute('aria-label','Cevap boşluğu');slot.textContent='Doğru kelimeyi buraya getir';
  const bank=document.createElement('div');bank.className='v855-fill-bank';
  const help=document.createElement('div');help.className='v855-fill-help';help.innerHTML='<span>Dokun veya sürükle</span><b>'+q.options_tr.length+' SEÇENEK</b>';
  wrap.append(slot,bank,help);area.append(wrap);
  let finished=false,errors=0,dragChip=null,pointerChip=null;
  function pop(text,bad=false){wrap.querySelector('.v855-fill-pop')?.remove();const p=document.createElement('div');p.className='v855-fill-pop'+(bad?' bad':'');p.textContent=text;wrap.insertBefore(p,help);setTimeout(()=>p.remove(),650)}
  function finish(chip,value){
   if(finished)return;finished=true;chip.classList.add('correct-chip');slot.classList.add('correct');slot.textContent='';const a=document.createElement('span');a.className='v855-fill-answer';a.textContent=value;slot.append(a);bank.querySelectorAll('button').forEach(b=>b.disabled=true);haptic(true);pop('✓ BOŞLUK TAMAMLANDI');
   const perfect=errors===0;
   setTimeout(()=>{
    try{completeQuestion(perfect,q)}catch(err){console.error('DEEN fill complete',err);return}
    const title=document.getElementById('feedbackTitle');if(title)title.textContent=perfect?'✓ TEK SEFERDE DOĞRU':'Doğru kelimeyi buldun';
    try{document.dispatchEvent(new CustomEvent('deen:fill-blank:complete',{detail:{version:VERSION,id:q.id||'',correct:perfect,errors,answer:value}}))}catch(_){}
    if(perfect)advanceTimer=setTimeout(()=>{const btn=document.getElementById('continueBtn');if(btn&&!btn.disabled&&document.getElementById('feedback')?.classList.contains('show')){autoAdvanced++;btn.click()}},1050);
   },430);
  }
  function tryValue(chip){
   if(finished||!chip||chip.disabled)return;attempts++;const value=chip.dataset.value||chip.textContent.trim();
   if(isCorrect(q,value))return finish(chip,value);
   errors++;misses++;haptic(false);chip.classList.remove('wrong');void chip.offsetWidth;chip.classList.add('wrong');slot.classList.remove('drag-over');pop('BİR DAHA DENE',true);setTimeout(()=>chip.classList.remove('wrong'),330);
   try{document.dispatchEvent(new CustomEvent('deen:fill-blank:miss',{detail:{version:VERSION,id:q.id||'',errors,value}}))}catch(_){}
  }
  q.options_tr.forEach((value,idx)=>{
   const chip=document.createElement('button');chip.type='button';chip.className='v855-fill-chip';chip.textContent=String(value);chip.dataset.value=String(value);chip.draggable=true;chip.setAttribute('aria-label','Seçenek: '+String(value));
   chip.onclick=()=>tryValue(chip);
   chip.addEventListener('dragstart',e=>{if(finished)return e.preventDefault();dragChip=chip;chip.classList.add('dragging');try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(idx))}catch(_){}});
   chip.addEventListener('dragend',()=>{chip.classList.remove('dragging');slot.classList.remove('drag-over');dragChip=null});
   chip.addEventListener('pointerdown',e=>{if(finished||e.pointerType==='mouse')return;pointerChip=chip;chip.classList.add('dragging');try{chip.setPointerCapture(e.pointerId)}catch(_){};e.preventDefault()});
   chip.addEventListener('pointermove',e=>{if(pointerChip!==chip)return;const r=slot.getBoundingClientRect(),inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;slot.classList.toggle('drag-over',inside);e.preventDefault()});
   const end=e=>{if(pointerChip!==chip)return;const r=slot.getBoundingClientRect(),inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;try{chip.releasePointerCapture(e.pointerId)}catch(_){};pointerChip=null;chip.classList.remove('dragging');slot.classList.remove('drag-over');if(inside)tryValue(chip);e.preventDefault()};
   chip.addEventListener('pointerup',end);chip.addEventListener('pointercancel',e=>{if(pointerChip===chip){pointerChip=null;chip.classList.remove('dragging');slot.classList.remove('drag-over')}});
   bank.append(chip);
  });
  slot.addEventListener('dragover',e=>{if(!dragChip||finished)return;e.preventDefault();slot.classList.add('drag-over')});
  slot.addEventListener('dragleave',()=>slot.classList.remove('drag-over'));
  slot.addEventListener('drop',e=>{e.preventDefault();slot.classList.remove('drag-over');if(dragChip)tryValue(dragChip)});
  return true;
 }
 try{window.renderFillBlank=premiumFill;renderFillBlank=premiumFill}catch(_){window.renderFillBlank=premiumFill}
 const oldRender=typeof renderQuestion==='function'?renderQuestion:null;
 if(oldRender&&!oldRender.__v855){
  const wrapped=function(...args){clearTimeout(advanceTimer);document.querySelector('.question-frame')?.classList.remove('v855-fill-mode');return oldRender.apply(this,args)};
  wrapped.__v855=true;try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
 }
 window.DEEN_FILL_BLANK_MINIGAME={version:VERSION,build:BUILD,render:premiumFill,eligible,check:()=>({version:VERSION,build:BUILD,ready:true,rounds,attempts,misses,autoAdvanced,active:!!document.querySelector('.v855-fill-wrap')})};
 document.documentElement.dataset.deenFillBlank='ready';
})();
<\/script>`;
 window.DEEN_PATCH_V855=function(html){let out=String(html);if(out.includes('deen-v855-fill-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();