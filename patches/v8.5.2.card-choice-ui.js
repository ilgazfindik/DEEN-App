(()=>{
  const VERSION='8.5.2-CARD-CHOICE-UI';
  const BUILD='852card1';
  const addition=`<!-- DEEN v8.5.2 — Premium Card Choice -->
<style id="deen-v852-card-choice-css">
.question-frame.v852-card-mode{padding-top:46px}
.question-frame.v852-card-mode .qtype{margin-bottom:10px;color:#9fb9bd}
.question-frame.v852-card-mode .template-action{display:none!important}
.options.grid.premium-grid.v852-card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;margin-top:4px}
.options.grid.premium-grid.v852-card-grid .option{position:relative;min-height:128px;padding:15px 11px 13px;border-radius:23px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;overflow:hidden;border:1px solid rgba(97,157,159,.38);background:linear-gradient(180deg,rgba(10,43,52,.97),rgba(6,28,36,.99));box-shadow:inset 0 1px rgba(255,255,255,.035),0 12px 22px rgba(0,0,0,.18);transform:translateZ(0);transition:transform 130ms ease,border-color 180ms ease,box-shadow 180ms ease,background 180ms ease}
.options.grid.premium-grid.v852-card-grid .option:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 22%,rgba(83,216,187,.085),transparent 50%);pointer-events:none}
.options.grid.premium-grid.v852-card-grid .option:not(:disabled):active,.options.grid.premium-grid.v852-card-grid .option.v852-tap{transform:scale(.965)}
.options.grid.premium-grid.v852-card-grid .option-badge{display:none}
.options.grid.premium-grid.v852-card-grid .option-icon{position:relative;width:46px;height:46px;border-radius:16px;display:grid;place-items:center;font-size:24px;line-height:1;background:linear-gradient(180deg,rgba(31,93,91,.88),rgba(15,59,66,.9));border:1px solid rgba(108,222,195,.24);color:#b7f2de;box-shadow:inset 0 1px rgba(255,255,255,.04),0 7px 15px rgba(0,0,0,.16);font-family:Inter,system-ui,sans-serif}
.options.grid.premium-grid.v852-card-grid .option-label{position:relative;font-family:Inter,system-ui,sans-serif;font-size:14px;font-weight:850;line-height:1.2;color:#eff8f5;text-align:center;letter-spacing:-.1px}
.options.grid.premium-grid.v852-card-grid .option:after{content:"DOKUN";position:relative;font-family:Inter,system-ui,sans-serif;font-size:6px;font-weight:950;letter-spacing:1.45px;color:#67888d;margin-top:1px}
.options.grid.premium-grid.v852-card-grid .option.correct{border-color:#78dfbf!important;background:linear-gradient(180deg,rgba(19,77,66,.98),rgba(8,48,44,.99))!important;box-shadow:0 0 0 2px rgba(117,225,191,.11),0 12px 28px rgba(42,199,159,.17)!important;animation:v852Correct 420ms cubic-bezier(.2,.75,.25,1)}
.options.grid.premium-grid.v852-card-grid .option.correct .option-icon{border-color:rgba(149,239,211,.62);background:linear-gradient(180deg,#287e6b,#155b52);color:#eafff8}
.options.grid.premium-grid.v852-card-grid .option.correct:after{content:"DOĞRU ✓";color:#96e8cc}
.options.grid.premium-grid.v852-card-grid .option.wrong{border-color:#d98795!important;background:linear-gradient(180deg,rgba(74,40,48,.98),rgba(47,27,34,.99))!important;box-shadow:0 0 0 2px rgba(224,122,141,.08),0 12px 24px rgba(111,28,42,.12)!important;animation:v852Wrong 300ms ease}
.options.grid.premium-grid.v852-card-grid .option.wrong .option-icon{border-color:rgba(227,139,153,.4);background:linear-gradient(180deg,#6d3d49,#492b35);color:#ffe9ed}
.options.grid.premium-grid.v852-card-grid .option.wrong:after{content:"TEKRAR BAK";color:#e9a3af}
.options.grid.premium-grid.v852-card-grid.v852-resolved .option:not(.correct):not(.wrong){opacity:.56;transform:scale(.985)}
.v852-burst{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:inherit;z-index:6}
.v852-burst i{position:absolute;left:50%;top:49%;width:5px;height:5px;border-radius:50%;background:#a6efd6;box-shadow:0 0 8px rgba(166,239,214,.72);animation:v852Spark var(--d,520ms) ease-out both;transform:translate(-50%,-50%) rotate(var(--r,0deg)) translateY(-8px)}
.v852-burst i:nth-child(2){--r:45deg;--d:460ms}.v852-burst i:nth-child(3){--r:90deg;--d:560ms}.v852-burst i:nth-child(4){--r:135deg;--d:490ms}.v852-burst i:nth-child(5){--r:180deg;--d:540ms}.v852-burst i:nth-child(6){--r:225deg;--d:470ms}.v852-burst i:nth-child(7){--r:270deg;--d:570ms}.v852-burst i:nth-child(8){--r:315deg;--d:500ms}
.v852-combo-chip{position:absolute;z-index:18;left:50%;top:92px;transform:translate(-50%,-7px) scale(.92);opacity:0;pointer-events:none;min-width:92px;padding:7px 12px;border-radius:999px;border:1px solid rgba(235,207,124,.3);background:linear-gradient(180deg,rgba(47,42,25,.96),rgba(25,32,31,.96));box-shadow:0 9px 24px rgba(0,0,0,.24);color:#f0d88b;font:950 9px/1 Inter,system-ui,sans-serif;letter-spacing:.7px;text-align:center;animation:v852Combo 760ms ease both}
.question-frame.v852-card-mode .feedback.show .feedback-box:not(.bad){border-color:rgba(104,214,180,.36)}
@keyframes v852Correct{0%{transform:scale(.96)}48%{transform:scale(1.045)}100%{transform:scale(1)}}
@keyframes v852Wrong{0%,100%{transform:translateX(0)}30%{transform:translateX(-4px)}65%{transform:translateX(4px)}}
@keyframes v852Spark{0%{opacity:0;transform:translate(-50%,-50%) rotate(var(--r)) translateY(-7px) scale(.5)}22%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--r)) translateY(-54px) scale(1.15)}}
@keyframes v852Combo{0%{opacity:0;transform:translate(-50%,-8px) scale(.9)}25%,70%{opacity:1;transform:translate(-50%,0) scale(1)}100%{opacity:0;transform:translate(-50%,-4px) scale(.98)}}
@media(max-width:390px){.options.grid.premium-grid.v852-card-grid{gap:9px}.options.grid.premium-grid.v852-card-grid .option{min-height:116px;padding:13px 9px 12px;border-radius:20px}.options.grid.premium-grid.v852-card-grid .option-icon{width:42px;height:42px;border-radius:14px;font-size:21px}.options.grid.premium-grid.v852-card-grid .option-label{font-size:13px}}
@media(prefers-reduced-motion:reduce){.options.grid.premium-grid.v852-card-grid .option,.options.grid.premium-grid.v852-card-grid .option.correct,.options.grid.premium-grid.v852-card-grid .option.wrong,.v852-combo-chip,.v852-burst i{animation:none!important;transition:none!important}}
</style>
<script id="deen-v852-card-choice-runtime">
(()=>{
 if(window.__deenV852CardChoice)return;window.__deenV852CardChoice=true;
 const VERSION='8.5.2-CARD-CHOICE-UI',BUILD='852card1';
 let autoTimer=0,answered=0,autoAdvanced=0;
 const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR').replace(/\\s+/g,' ');
 const oldShould=typeof shouldUseCardGrid==='function'?shouldUseCardGrid:null;
 function explicitCard(q){return !!q&&(q.type==='card'||q.question_type==='card'||q.activity_type==='card_select'||q.activity_type==='card_choice')}
 function eligible(q){
  if(!q||!Array.isArray(q.options_tr)||q.options_tr.length!==4)return false;
  if(explicitCard(q))return true;
  try{return !!oldShould?.(q)}catch(_){return false}
 }
 const patchedShould=function(q){return eligible(q)};
 try{window.shouldUseCardGrid=patchedShould;shouldUseCardGrid=patchedShould}catch(_){window.shouldUseCardGrid=patchedShould}
 function currentQuestion(){try{return session?.questions?.[session.index]||null}catch(_){return null}}
 function burst(card){
  const b=document.createElement('span');b.className='v852-burst';b.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>';card.append(b);setTimeout(()=>b.remove(),650)
 }
 function comboChip(streak){
  if(streak<2)return;const frame=document.querySelector('.question-frame');if(!frame)return;frame.querySelector('.v852-combo-chip')?.remove();const c=document.createElement('div');c.className='v852-combo-chip';c.textContent=streak>=5?'🔥 '+streak+' SERİ · MUHTEŞEM':streak+' SERİ ✦';frame.append(c);setTimeout(()=>c.remove(),820)
 }
 function haptic(correct){try{if(navigator.vibrate)navigator.vibrate(correct?18:[12,28,12])}catch(_){}}
 function decorate(){
  clearTimeout(autoTimer);
  const q=currentQuestion(),frame=document.querySelector('.question-frame'),area=document.getElementById('answerArea');
  frame?.classList.remove('v852-card-mode');
  if(!q||!eligible(q)||!area)return false;
  const grid=area.querySelector('.options.grid.premium-grid');if(!grid)return false;
  frame?.classList.add('v852-card-mode');grid.classList.add('v852-card-grid');grid.dataset.v852='1';
  const hint=document.getElementById('qType');if(hint)hint.textContent='Bir kart seç · cevabın anında değerlendirilsin.';
  const cta=area.querySelector('.template-action');if(cta){cta.classList.add('v852-hidden-confirm');cta.tabIndex=-1;cta.setAttribute('aria-hidden','true')}
  let locked=false;
  [...grid.querySelectorAll('.option')].forEach(card=>{
   card.dataset.v852Bound='1';
   card.setAttribute('aria-describedby','qType');
   card.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    if(locked||document.getElementById('feedback')?.classList.contains('show'))return;
    locked=true;answered++;
    const value=(card.querySelector('.option-label')||card).textContent.trim();
    const correct=norm(value)===norm(q.correct_answer);
    grid.querySelectorAll('.option').forEach(x=>x.classList.remove('selected','v852-tap'));
    card.classList.add('selected','v852-tap');
    haptic(correct);
    setTimeout(()=>{
      try{submitAnswer(value,card)}catch(err){locked=false;console.error('DEEN card submit',err);return}
      grid.classList.add('v852-resolved');
      if(correct){burst(card);let streak=0;try{streak=Number(session?.combo)||0}catch(_){}comboChip(streak);const t=document.getElementById('feedbackTitle');if(t)t.textContent=streak>=3?'🔥 '+streak+' SERİ':'✓ HARİKA!';
        autoTimer=setTimeout(()=>{const btn=document.getElementById('continueBtn');if(btn&&!btn.disabled&&document.getElementById('feedback')?.classList.contains('show')){autoAdvanced++;btn.click()}},1050);
      }else{
        const t=document.getElementById('feedbackTitle');if(t)t.textContent='Birlikte düzeltelim';
      }
      try{document.dispatchEvent(new CustomEvent('deen:card-choice:answered',{detail:{version:VERSION,id:q.id||'',correct,streak:(typeof session!=='undefined'&&session?session.combo:0)}}))}catch(_){}
    },70);
   };
  });
  return true;
 }
 const oldRender=typeof renderQuestion==='function'?renderQuestion:null;
 if(oldRender){
  const wrapped=function(...args){clearTimeout(autoTimer);const out=oldRender.apply(this,args);queueMicrotask(decorate);return out};
  wrapped.__v852=true;
  try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
 }
 window.DEEN_CARD_CHOICE_UI={version:VERSION,build:BUILD,decorate,eligible,check:()=>({version:VERSION,build:BUILD,ready:true,answered,autoAdvanced,active:!!document.querySelector('.v852-card-grid')})};
 document.documentElement.dataset.deenCardChoice='ready';
})();
<\/script>`;
  window.DEEN_PATCH_V852=function(html){
    let out=String(html);
    if(out.includes('deen-v852-card-choice-runtime'))return {html:out,version:VERSION,applied:0};
    out+='\n'+addition+'\n';
    return {html:out,version:VERSION,applied:1};
  };
})();
