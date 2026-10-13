(()=>{
 const VERSION='8.5.9-RAPID-CHOICE-MCQ',BUILD='859mcq1';
 const addition=`<!-- DEEN v8.5.9 — Rapid Choice MCQ -->
<style id="deen-v859-mcq-css">
.question-frame.v859-mcq-mode{padding-top:42px}
.question-frame.v859-mcq-mode .qtype{margin-bottom:10px;color:#9fb9bd}
.question-frame.v859-mcq-mode .template-action{display:none!important}
.v859-choice-list{display:flex!important;flex-direction:column!important;gap:9px!important;margin-top:4px!important}
.v859-choice-list .option{position:relative!important;min-height:62px!important;padding:11px 42px 11px 52px!important;border-radius:18px!important;border:1px solid rgba(86,137,149,.46)!important;background:linear-gradient(180deg,rgba(9,38,48,.98),rgba(6,28,36,.99))!important;color:#edf7f4!important;box-shadow:inset 0 1px rgba(255,255,255,.025),0 8px 17px rgba(0,0,0,.14)!important;text-align:left!important;display:flex!important;align-items:center!important;transition:transform 130ms ease,border-color 180ms ease,background 180ms ease,box-shadow 180ms ease,opacity 180ms ease!important;overflow:hidden!important}
.v859-choice-list .option:not(:disabled):active,.v859-choice-list .option.v859-tap{transform:scale(.985)!important}
.v859-choice-list .option-badge{display:none!important}
.v859-choice-list .option-icon{display:none!important}
.v859-choice-list .option-label{font:780 12px/1.3 Inter,system-ui,sans-serif!important;color:#eef7f4!important;letter-spacing:-.05px!important}
.v859-choice-num{position:absolute;left:11px;top:50%;transform:translateY(-50%);width:29px;height:29px;border-radius:10px;display:grid;place-items:center;border:1px solid rgba(98,207,183,.24);background:linear-gradient(180deg,rgba(23,81,77,.78),rgba(11,53,59,.82));color:#a8ead6;font:950 9px/1 Inter,system-ui,sans-serif}
.v859-choice-arrow{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:#587d83;font:900 15px/1 Inter,system-ui,sans-serif}
.v859-choice-list .option.v859-picked{border-color:#71d8bd!important;box-shadow:0 0 0 2px rgba(113,216,189,.08),0 10px 22px rgba(0,0,0,.17)!important;transform:translateY(-1px)}
.v859-choice-list .option.correct{border-color:#79dfc0!important;background:linear-gradient(180deg,rgba(18,77,65,.98),rgba(8,48,43,.99))!important;box-shadow:0 0 0 2px rgba(121,223,192,.09),0 11px 25px rgba(26,152,119,.13)!important;animation:v859Good 420ms cubic-bezier(.2,.75,.25,1)!important}
.v859-choice-list .option.correct .v859-choice-num{background:linear-gradient(180deg,#2d806d,#155b52);color:#eafff8;border-color:rgba(157,238,214,.55)}
.v859-choice-list .option.wrong{border-color:#d88695!important;background:linear-gradient(180deg,rgba(76,40,49,.98),rgba(46,27,34,.99))!important;animation:v859Wrong 300ms ease!important}
.v859-choice-list .option.wrong .v859-choice-num{background:linear-gradient(180deg,#6d3d49,#492b35);color:#ffe9ed;border-color:rgba(227,139,153,.38)}
.v859-choice-list.v859-resolved .option:not(.correct):not(.wrong){opacity:.5!important;transform:scale(.992)!important}
.v859-speed-tag{display:flex;align-items:center;justify-content:center;gap:7px;margin:8px 0 2px;color:#718f93;font:850 7px/1 Inter,system-ui,sans-serif;letter-spacing:.6px}
.v859-speed-tag:before,.v859-speed-tag:after{content:"";height:1px;flex:1;background:linear-gradient(90deg,transparent,rgba(91,139,145,.28))}.v859-speed-tag:after{background:linear-gradient(90deg,rgba(91,139,145,.28),transparent)}
.v859-pop{position:absolute;z-index:18;left:50%;top:91px;transform:translate(-50%,-6px);pointer-events:none;min-width:96px;padding:7px 12px;border-radius:999px;border:1px solid rgba(124,225,196,.3);background:rgba(10,55,51,.96);box-shadow:0 9px 24px rgba(0,0,0,.23);color:#a8efd8;font:950 8px/1 Inter,system-ui,sans-serif;letter-spacing:.55px;text-align:center;animation:v859Pop 760ms ease both}
.v859-pop.gold{border-color:rgba(230,200,112,.3);background:rgba(49,43,25,.96);color:#f0d88b}
@keyframes v859Good{0%{transform:scale(.985)}48%{transform:scale(1.018)}100%{transform:scale(1)}}
@keyframes v859Wrong{0%,100%{transform:translateX(0)}28%{transform:translateX(-4px)}62%{transform:translateX(4px)}}
@keyframes v859Pop{0%{opacity:0;transform:translate(-50%,-7px) scale(.9)}25%,72%{opacity:1;transform:translate(-50%,0) scale(1)}100%{opacity:0;transform:translate(-50%,-4px) scale(.97)}}
@media(max-width:390px){.v859-choice-list{gap:8px!important}.v859-choice-list .option{min-height:58px!important;padding:10px 38px 10px 47px!important;border-radius:16px!important}.v859-choice-list .option-label{font-size:11px!important}.v859-choice-num{width:27px;height:27px}}
@media(prefers-reduced-motion:reduce){.v859-choice-list .option,.v859-choice-list .option.correct,.v859-choice-list .option.wrong,.v859-pop{animation:none!important;transition:none!important}}
</style>
<script id="deen-v859-mcq-runtime">
(()=>{
 if(window.__deenV859MCQ)return;window.__deenV859MCQ=true;
 const VERSION='8.5.9-RAPID-CHOICE-MCQ',BUILD='859mcq1';
 let rounds=0,answers=0,correctAnswers=0,autoAdvanced=0,advanceTimer=0;
 const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR').replace(/\\s+/g,' ');
 const excluded=new Set(['card','scenario','odd_one_out','listen_select','pronunciation','true_false','fill_blank','match','sequence']);
 function eligible(q){
  if(!q||!Array.isArray(q.options_tr)||q.options_tr.length!==4)return false;
  const kind=String(q.type||q.question_type||q.activity_type||'').toLowerCase();
  if(excluded.has(kind))return false;
  if(q.pairs||q.correct_order||q.items&&kind==='sequence')return false;
  return true;
 }
 function currentQuestion(){try{return session?.questions?.[session.index]||null}catch(_){return null}}
 function haptic(ok){try{navigator.vibrate?.(ok?16:[10,22,10])}catch(_){}}
 function pop(text,gold=false){const frame=document.querySelector('.question-frame');if(!frame)return;frame.querySelector('.v859-pop')?.remove();const p=document.createElement('div');p.className='v859-pop'+(gold?' gold':'');p.textContent=text;frame.append(p);setTimeout(()=>p.remove(),800)}
 const previousGrid=typeof shouldUseCardGrid==='function'?shouldUseCardGrid:null;
 const gridGuard=function(q){if(eligible(q))return false;try{return previousGrid?previousGrid(q):false}catch(_){return false}};
 try{window.shouldUseCardGrid=gridGuard;shouldUseCardGrid=gridGuard}catch(_){window.shouldUseCardGrid=gridGuard}
 function decorate(){
  clearTimeout(advanceTimer);
  const q=currentQuestion(),area=document.getElementById('answerArea'),frame=document.querySelector('.question-frame');
  frame?.classList.remove('v859-mcq-mode');
  if(!eligible(q)||!area)return false;
  const optionsHost=area.querySelector('.options');if(!optionsHost)return false;
  rounds++;frame?.classList.remove('v852-card-mode');frame?.classList.add('v859-mcq-mode');
  optionsHost.classList.remove('grid','premium-grid','v852-card-grid');optionsHost.classList.add('v859-choice-list');
  const hint=document.getElementById('qType');if(hint)hint.textContent='Hızlı karar · doğru olduğunu düşündüğün seçeneğe dokun.';
  const cta=area.querySelector('.template-action');if(cta){cta.style.display='none';cta.tabIndex=-1;cta.setAttribute('aria-hidden','true')}
  if(!area.querySelector('.v859-speed-tag')){const tag=document.createElement('div');tag.className='v859-speed-tag';tag.textContent='TEK DOKUNUŞTA CEVAPLA';optionsHost.before(tag)}
  let locked=false;
  [...optionsHost.querySelectorAll('.option')].forEach((b,idx)=>{
   b.querySelector('.v859-choice-num')?.remove();b.querySelector('.v859-choice-arrow')?.remove();
   const num=document.createElement('span');num.className='v859-choice-num';num.textContent=String(idx+1);
   const arrow=document.createElement('span');arrow.className='v859-choice-arrow';arrow.textContent='›';
   b.prepend(num);b.append(arrow);b.dataset.v859='1';
   b.onclick=e=>{
    e.preventDefault();e.stopPropagation();if(locked||document.getElementById('feedback')?.classList.contains('show'))return;
    locked=true;answers++;
    const label=b.querySelector('.option-label');const value=String(label?.textContent||q.options_tr[idx]||'').trim();
    const correct=norm(value)===norm(q.correct_answer);if(correct)correctAnswers++;
    optionsHost.querySelectorAll('.option').forEach(x=>x.classList.remove('selected','v859-picked'));b.classList.add('selected','v859-picked');haptic(correct);
    setTimeout(()=>{
      try{submitAnswer(value,b)}catch(err){locked=false;console.error('DEEN mcq submit',err);return}
      optionsHost.classList.add('v859-resolved');
      let streak=0;try{streak=Number(session?.combo)||0}catch(_){}
      const title=document.getElementById('feedbackTitle');
      if(correct){
       if(title)title.textContent=streak>=3?'🔥 '+streak+' SERİ':'✓ DOĞRU!';
       pop(streak>=5?'🔥 '+streak+' SERİ · DEVAM!':streak>=3?streak+' SERİ ✦':['GÜZEL!','TAM İSABET!','DEVAM!'][correctAnswers%3],streak>=3);
       advanceTimer=setTimeout(()=>{const btn=document.getElementById('continueBtn');if(btn&&!btn.disabled&&document.getElementById('feedback')?.classList.contains('show')){autoAdvanced++;btn.click()}},1000);
      }else if(title)title.textContent='Birlikte düzeltelim';
      try{document.dispatchEvent(new CustomEvent('deen:mcq:answered',{detail:{version:VERSION,id:q.id||'',correct,choice:value,streak}}))}catch(_){}
    },65);
   };
  });
  return true;
 }
 const oldRender=typeof renderQuestion==='function'?renderQuestion:null;
 if(oldRender&&!oldRender.__v859){
  const wrapped=function(...args){clearTimeout(advanceTimer);document.querySelector('.question-frame')?.classList.remove('v859-mcq-mode');const out=oldRender.apply(this,args);queueMicrotask(decorate);return out};
  wrapped.__v859=true;try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
 }
 window.DEEN_RAPID_CHOICE_MCQ={version:VERSION,build:BUILD,eligible,decorate,check:()=>({version:VERSION,build:BUILD,ready:true,rounds,answers,correctAnswers,autoAdvanced,active:!!document.querySelector('.v859-mcq-mode')})};
 document.documentElement.dataset.deenRapidChoice='ready';
})();
<\/script>`;
 window.DEEN_PATCH_V859=function(html){let out=String(html);if(out.includes('deen-v859-mcq-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();