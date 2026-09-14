(()=>{
 const VERSION='8.5.6-TRUE-FALSE-SWIPE',BUILD='856tf1';
 const addition=`<!-- DEEN v8.5.6 — True / False Swipe Mini-game -->
<style id="deen-v856-true-false-css">
.question-frame.v856-tf-mode{padding-top:44px}
.question-frame.v856-tf-mode #questionText{display:none}
.question-frame.v856-tf-mode .qtype{margin:0 auto 11px;color:#96b2b7}
.question-frame.v856-tf-mode .tf-options,.question-frame.v856-tf-mode .template-action{display:none!important}
.v856-tf-wrap{display:flex;flex-direction:column;gap:12px;margin-top:2px}
.v856-swipe-stage{position:relative;min-height:240px;display:grid;place-items:center;perspective:900px;touch-action:pan-y}
.v856-swipe-card{position:relative;width:min(100%,330px);min-height:205px;padding:28px 24px;border-radius:28px;border:1px solid rgba(96,155,164,.46);background:radial-gradient(circle at 50% 12%,rgba(67,198,176,.10),transparent 44%),linear-gradient(180deg,rgba(10,43,53,.99),rgba(5,27,36,.99));box-shadow:inset 0 1px rgba(255,255,255,.04),0 18px 38px rgba(0,0,0,.28);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;cursor:grab;user-select:none;-webkit-user-select:none;will-change:transform,opacity;transition:transform 210ms cubic-bezier(.2,.75,.25,1),border-color 180ms ease,box-shadow 180ms ease,background 180ms ease,opacity 180ms ease}
.v856-swipe-card:active{cursor:grabbing}
.v856-swipe-mark{width:44px;height:44px;border-radius:16px;border:1px solid rgba(108,220,196,.26);background:linear-gradient(180deg,rgba(25,84,80,.82),rgba(9,51,59,.86));display:grid;place-items:center;color:#a6ead7;font:950 18px/1 Inter,system-ui,sans-serif;margin-bottom:16px;box-shadow:inset 0 1px rgba(255,255,255,.035)}
.v856-swipe-text{font:800 clamp(18px,4.8vw,24px)/1.24 Georgia,serif;color:#f3efe6;letter-spacing:-.25px;max-width:96%}
.v856-swipe-sub{margin-top:16px;color:#66898f;font:850 7px/1 Inter,system-ui,sans-serif;letter-spacing:1.3px;text-transform:uppercase}
.v856-swipe-label{position:absolute;top:18px;z-index:4;padding:8px 11px;border-radius:11px;border:1px solid;font:950 9px/1 Inter,system-ui,sans-serif;letter-spacing:.8px;opacity:0;transition:opacity 90ms ease,transform 90ms ease;pointer-events:none}
.v856-swipe-label.yes{left:18px;color:#a3efd7;border-color:rgba(111,226,191,.45);background:rgba(12,71,59,.88);transform:rotate(-7deg) scale(.9)}
.v856-swipe-label.no{right:18px;color:#efb0bc;border-color:rgba(224,128,146,.45);background:rgba(74,35,44,.9);transform:rotate(7deg) scale(.9)}
.v856-swipe-card.toward-yes .v856-swipe-label.yes,.v856-swipe-card.toward-no .v856-swipe-label.no{opacity:1;transform:rotate(0) scale(1)}
.v856-swipe-card.toward-yes{border-color:rgba(106,222,188,.66);box-shadow:0 18px 38px rgba(0,0,0,.26),0 0 0 2px rgba(106,222,188,.08)}
.v856-swipe-card.toward-no{border-color:rgba(220,127,145,.65);box-shadow:0 18px 38px rgba(0,0,0,.26),0 0 0 2px rgba(220,127,145,.07)}
.v856-swipe-card.resolved-correct{border-color:#79dfbf;background:radial-gradient(circle at 50% 12%,rgba(103,229,194,.16),transparent 48%),linear-gradient(180deg,rgba(17,74,64,.99),rgba(7,44,41,.99));box-shadow:0 0 0 2px rgba(121,223,191,.10),0 18px 40px rgba(26,147,118,.15)}
.v856-swipe-card.resolved-wrong{border-color:#d98798;background:radial-gradient(circle at 50% 12%,rgba(222,128,147,.11),transparent 48%),linear-gradient(180deg,rgba(73,38,47,.99),rgba(43,26,33,.99));animation:v856Wrong 300ms ease}
.v856-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.v856-action{min-height:58px;border-radius:18px;border:1px solid rgba(91,140,151,.42);background:linear-gradient(180deg,rgba(9,38,48,.98),rgba(6,28,36,.99));color:#edf6f4;font:900 12px/1 Inter,system-ui,sans-serif;letter-spacing:.25px;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:inset 0 1px rgba(255,255,255,.025),0 8px 18px rgba(0,0,0,.15);transition:transform 120ms ease,border-color 160ms ease,background 160ms ease}
.v856-action:not(:disabled):active{transform:scale(.97)}
.v856-action.true{border-color:rgba(93,197,170,.42);color:#baf1df}.v856-action.false{border-color:rgba(190,109,127,.36);color:#efbdc6}
.v856-action span{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;background:rgba(255,255,255,.035);font-size:13px}
.v856-action:disabled{opacity:.45}
.v856-tf-tip{text-align:center;color:#698a90;font:800 7px/1.2 Inter,system-ui,sans-serif;letter-spacing:.7px}
.v856-combo{align-self:center;margin-top:-2px;padding:7px 12px;border-radius:999px;border:1px solid rgba(232,203,118,.30);background:linear-gradient(180deg,rgba(48,42,24,.95),rgba(27,31,29,.96));color:#ead58d;font:950 8px/1 Inter,system-ui,sans-serif;letter-spacing:.65px;animation:v856Pop 760ms ease both}
@keyframes v856Wrong{0%,100%{transform:translateX(0)}28%{transform:translateX(-4px)}62%{transform:translateX(4px)}}
@keyframes v856Pop{0%{opacity:0;transform:translateY(5px) scale(.9)}25%,72%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-4px) scale(.98)}}
@media(max-width:390px){.v856-swipe-stage{min-height:220px}.v856-swipe-card{min-height:188px;padding:24px 18px;border-radius:24px}.v856-action{min-height:54px;border-radius:16px}}
@media(prefers-reduced-motion:reduce){.v856-swipe-card,.v856-action,.v856-combo{animation:none!important;transition:none!important}}
</style>
<script id="deen-v856-true-false-runtime">
(()=>{
 if(window.__deenV856TrueFalse)return;window.__deenV856TrueFalse=true;
 const VERSION='8.5.6-TRUE-FALSE-SWIPE',BUILD='856tf1';
 let rounds=0,swipes=0,taps=0,correctAnswers=0,wrongAnswers=0,autoAdvanced=0,advanceTimer=0;
 const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR').replace(/\\s+/g,' ');
 const truthy=v=>/^(doğru|dogru|true|evet|yes)$/.test(norm(v));
 const falsy=v=>/^(yanlış|yanlis|false|hayır|hayir|no)$/.test(norm(v));
 function currentQuestion(){try{return session?.questions?.[session.index]||null}catch(_){return null}}
 function isTF(q){
  if(!q||!Array.isArray(q.options_tr)||q.options_tr.length!==2)return false;
  let old=false;try{old=typeof shouldUseTrueFalseTemplate==='function'&&shouldUseTrueFalseTemplate(q)}catch(_){}
  if(!(old||q.type==='true_false'||q.question_type==='true_false'||q.activity_type==='true_false'))return false;
  const vals=q.options_tr.map(String);return vals.some(truthy)&&vals.some(falsy);
 }
 function haptic(ok){try{navigator.vibrate?.(ok?16:[10,24,10])}catch(_){}}
 function decorate(){
  clearTimeout(advanceTimer);
  const q=currentQuestion(),frame=document.querySelector('.question-frame'),area=document.getElementById('answerArea');
  frame?.classList.remove('v856-tf-mode');
  if(!q||!area||!isTF(q))return false;
  const oldWrap=area.querySelector('.tf-options');if(!oldWrap)return false;
  const oldButtons=[...oldWrap.querySelectorAll('.option')];
  const trueBtn=oldButtons.find(b=>truthy((b.querySelector('.option-label')||b).textContent));
  const falseBtn=oldButtons.find(b=>falsy((b.querySelector('.option-label')||b).textContent));
  if(!trueBtn||!falseBtn)return false;
  rounds++;frame?.classList.add('v856-tf-mode');
  const hint=document.getElementById('qType');if(hint)hint.textContent='Sağa kaydır: Doğru · Sola kaydır: Yanlış';
  const wrap=document.createElement('div');wrap.className='v856-tf-wrap';
  const stage=document.createElement('div');stage.className='v856-swipe-stage';
  const card=document.createElement('div');card.className='v856-swipe-card';card.tabIndex=0;card.setAttribute('role','group');card.setAttribute('aria-label','Doğru veya yanlış karar kartı');
  const mark=document.createElement('div');mark.className='v856-swipe-mark';mark.textContent='?';
  const text=document.createElement('div');text.className='v856-swipe-text';text.textContent=document.getElementById('questionText')?.textContent||q.question_tr||q.prompt||q.question||'';
  const sub=document.createElement('div');sub.className='v856-swipe-sub';sub.textContent='KARTI KAYDIR VEYA AŞAĞIDAN SEÇ';
  const yes=document.createElement('div');yes.className='v856-swipe-label yes';yes.textContent='DOĞRU ✓';
  const no=document.createElement('div');no.className='v856-swipe-label no';no.textContent='YANLIŞ ×';
  card.append(yes,no,mark,text,sub);stage.append(card);
  const actions=document.createElement('div');actions.className='v856-actions';
  const yesBtn=document.createElement('button');yesBtn.type='button';yesBtn.className='v856-action true';yesBtn.innerHTML='<span>✓</span> DOĞRU';
  const noBtn=document.createElement('button');noBtn.type='button';noBtn.className='v856-action false';noBtn.innerHTML='<span>×</span> YANLIŞ';
  actions.append(noBtn,yesBtn);
  const tip=document.createElement('div');tip.className='v856-tf-tip';tip.textContent='Kaydırma eşiği kısa tutuldu; tek elle rahat kullanılabilir.';
  wrap.append(stage,actions,tip);area.append(wrap);
  const cta=area.querySelector('.template-action');if(cta){cta.style.display='none';cta.tabIndex=-1;cta.setAttribute('aria-hidden','true')}
  let locked=false,pointerId=null,startX=0,currentX=0;
  function answer(value,source){
   if(locked||document.getElementById('feedback')?.classList.contains('show'))return;locked=true;
   if(source==='swipe')swipes++;else taps++;
   yesBtn.disabled=noBtn.disabled=true;card.style.pointerEvents='none';
   const hidden=truthy(value)?trueBtn:falseBtn;
   const correct=norm(value)===norm(q.correct_answer);correct?correctAnswers++:wrongAnswers++;haptic(correct);
   const dir=truthy(value)?1:-1;
   if(correct){card.classList.add('resolved-correct');card.style.transform='translateX('+(dir*38)+'px) rotate('+(dir*4)+'deg) scale(1.015)'}
   else{card.classList.add('resolved-wrong');card.style.transform='translateX('+(dir*18)+'px) rotate('+(dir*2)+'deg)'}
   setTimeout(()=>{
    try{submitAnswer(value,hidden)}catch(err){console.error('DEEN true/false submit',err);return}
    let streak=0;try{streak=Number(session?.combo)||0}catch(_){}
    const title=document.getElementById('feedbackTitle');if(title)title.textContent=correct?(streak>=3?'🔥 '+streak+' SERİ':'✓ DOĞRU KARAR'):'Birlikte düzeltelim';
    if(correct&&streak>=2){const c=document.createElement('div');c.className='v856-combo';c.textContent=streak+' SERİ ✦';wrap.append(c);setTimeout(()=>c.remove(),800)}
    try{document.dispatchEvent(new CustomEvent('deen:true-false:answered',{detail:{version:VERSION,id:q.id||'',correct,value,source,streak}}))}catch(_){}
    if(correct)advanceTimer=setTimeout(()=>{const b=document.getElementById('continueBtn');if(b&&!b.disabled&&document.getElementById('feedback')?.classList.contains('show')){autoAdvanced++;b.click()}},980);
   },210);
  }
  yesBtn.onclick=()=>answer((trueBtn.querySelector('.option-label')||trueBtn).textContent.trim(),'tap');
  noBtn.onclick=()=>answer((falseBtn.querySelector('.option-label')||falseBtn).textContent.trim(),'tap');
  card.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();yesBtn.click()}else if(e.key==='ArrowLeft'){e.preventDefault();noBtn.click()}});
  card.addEventListener('pointerdown',e=>{if(locked)return;pointerId=e.pointerId;startX=currentX=e.clientX;card.style.transition='none';try{card.setPointerCapture(pointerId)}catch(_){};e.preventDefault()});
  card.addEventListener('pointermove',e=>{if(pointerId!==e.pointerId||locked)return;currentX=e.clientX;const dx=Math.max(-125,Math.min(125,currentX-startX)),rot=dx/18;card.style.transform='translateX('+dx+'px) rotate('+rot+'deg)';card.classList.toggle('toward-yes',dx>24);card.classList.toggle('toward-no',dx<-24);e.preventDefault()});
  function release(e){if(pointerId!==e.pointerId||locked)return;const dx=currentX-startX;try{card.releasePointerCapture(pointerId)}catch(_){};pointerId=null;card.style.transition='';card.classList.remove('toward-yes','toward-no');if(dx>68)return yesBtn.click();if(dx<-68)return noBtn.click();card.style.transform='';e.preventDefault()}
  card.addEventListener('pointerup',release);card.addEventListener('pointercancel',e=>{if(pointerId===e.pointerId){pointerId=null;card.style.transition='';card.classList.remove('toward-yes','toward-no');card.style.transform=''}});
  return true;
 }
 const oldRender=typeof renderQuestion==='function'?renderQuestion:null;
 if(oldRender&&!oldRender.__v856){
  const wrapped=function(...args){clearTimeout(advanceTimer);const out=oldRender.apply(this,args);queueMicrotask(decorate);return out};
  wrapped.__v856=true;try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
 }
 window.DEEN_TRUE_FALSE_SWIPE={version:VERSION,build:BUILD,decorate,isTF,check:()=>({version:VERSION,build:BUILD,ready:true,rounds,swipes,taps,correctAnswers,wrongAnswers,autoAdvanced,active:!!document.querySelector('.v856-tf-wrap')})};
 document.documentElement.dataset.deenTrueFalse='ready';
})();
<\/script>`;
 window.DEEN_PATCH_V856=function(html){let out=String(html);if(out.includes('deen-v856-true-false-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();