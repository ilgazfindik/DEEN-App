(()=>{
 const VERSION='8.5.7-SCENARIO-MINIGAME',BUILD='857scenario1';
 const addition=`<!-- DEEN v8.5.7 — Scenario Decision Mini-game -->
<style id="deen-v857-scenario-css">
.question-frame.v857-scenario-mode{padding-top:42px}
.question-frame.v857-scenario-mode .qtype{margin-bottom:10px;color:#9fb9bd}
.question-frame.v857-scenario-mode .template-action{display:none!important}
.v857-scene{position:relative;padding:15px 15px 14px;margin:3px 0 12px;border:1px solid rgba(103,174,166,.34);border-radius:22px;background:linear-gradient(145deg,rgba(11,49,56,.98),rgba(7,31,40,.99));box-shadow:inset 0 1px rgba(255,255,255,.03),0 12px 25px rgba(0,0,0,.16);overflow:hidden}
.v857-scene:before{content:"";position:absolute;right:-36px;top:-42px;width:130px;height:130px;border-radius:50%;border:1px solid rgba(221,193,109,.12);box-shadow:0 0 42px rgba(221,193,109,.03)}
.v857-scene-top{position:relative;display:flex;align-items:center;gap:9px;margin-bottom:10px}
.v857-scene-mark{width:34px;height:34px;border-radius:12px;display:grid;place-items:center;border:1px solid rgba(213,188,108,.28);background:linear-gradient(180deg,rgba(80,69,36,.66),rgba(35,47,43,.72));color:#e5cf8a;font:900 16px/1 Inter,system-ui,sans-serif}
.v857-scene-meta{min-width:0}.v857-scene-meta b{display:block;color:#f0d993;font:950 8px/1 Inter,system-ui,sans-serif;letter-spacing:1.1px}.v857-scene-meta span{display:block;color:#82a8aa;font:700 8px/1.25 Inter,system-ui,sans-serif;margin-top:4px}
.v857-scene-body{position:relative;color:#eef5f2;font:720 13px/1.48 Inter,system-ui,sans-serif;letter-spacing:-.05px}
.v857-decisions{display:flex;flex-direction:column;gap:9px}
.v857-scenario-choice.option{position:relative;min-height:64px;padding:11px 40px 11px 50px;border-radius:18px;border:1px solid rgba(86,137,149,.46);background:linear-gradient(180deg,rgba(9,38,48,.98),rgba(6,28,36,.99));color:#edf6f3;box-shadow:inset 0 1px rgba(255,255,255,.025),0 8px 17px rgba(0,0,0,.14);text-align:left;font:760 12px/1.3 Inter,system-ui,sans-serif;transition:transform 130ms ease,border-color 180ms ease,background 180ms ease,box-shadow 180ms ease,opacity 180ms ease}
.v857-scenario-choice.option:not(:disabled):active{transform:scale(.985)}
.v857-choice-num{position:absolute;left:11px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:10px;display:grid;place-items:center;border:1px solid rgba(96,208,183,.25);background:rgba(17,65,67,.72);color:#a7e8d5;font:950 9px/1 Inter,system-ui,sans-serif}
.v857-choice-arrow{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:#587d83;font:900 15px/1 Inter,system-ui,sans-serif}
.v857-scenario-choice.option.v857-picked{border-color:#73d8bd;box-shadow:0 0 0 2px rgba(115,216,189,.08),0 10px 22px rgba(0,0,0,.17);transform:translateY(-1px)}
.v857-scenario-choice.option.correct{border-color:#79dfc0!important;background:linear-gradient(180deg,rgba(18,77,65,.98),rgba(8,48,43,.99))!important;animation:v857Good 420ms cubic-bezier(.2,.75,.25,1)}
.v857-scenario-choice.option.wrong{border-color:#d88695!important;background:linear-gradient(180deg,rgba(76,40,49,.98),rgba(46,27,34,.99))!important;animation:v857Wrong 300ms ease}
.v857-decisions.v857-resolved .v857-scenario-choice.option:not(.correct):not(.wrong){opacity:.52}
.v857-decision-tag{display:flex;align-items:center;justify-content:center;gap:6px;margin:9px 0 2px;color:#708e93;font:800 7px/1 Inter,system-ui,sans-serif;letter-spacing:.55px}
.v857-decision-tag:before,.v857-decision-tag:after{content:"";height:1px;flex:1;background:linear-gradient(90deg,transparent,rgba(91,139,145,.28))}.v857-decision-tag:after{background:linear-gradient(90deg,rgba(91,139,145,.28),transparent)}
.v857-scenario-mode #feedbackBox{border-color:rgba(102,179,166,.3)}
.v857-scenario-mode #feedbackText{line-height:1.45}
.v857-burst{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:inherit}.v857-burst i{position:absolute;left:50%;top:50%;width:4px;height:4px;border-radius:50%;background:#a9efd9;box-shadow:0 0 7px rgba(169,239,217,.7);animation:v857Spark 520ms ease-out both}.v857-burst i:nth-child(2){transform:rotate(60deg)}.v857-burst i:nth-child(3){transform:rotate(120deg)}.v857-burst i:nth-child(4){transform:rotate(180deg)}.v857-burst i:nth-child(5){transform:rotate(240deg)}.v857-burst i:nth-child(6){transform:rotate(300deg)}
@keyframes v857Good{0%{transform:scale(.98)}48%{transform:scale(1.02)}100%{transform:scale(1)}}
@keyframes v857Wrong{0%,100%{transform:translateX(0)}28%{transform:translateX(-4px)}62%{transform:translateX(4px)}}
@keyframes v857Spark{0%{opacity:0;translate:0 0}20%{opacity:1}100%{opacity:0;translate:0 -42px}}
@media(max-width:390px){.v857-scene{padding:13px 13px 12px;border-radius:19px}.v857-scene-body{font-size:12px}.v857-scenario-choice.option{min-height:60px;padding:10px 36px 10px 46px;border-radius:16px;font-size:11px}.v857-choice-num{width:26px;height:26px}}
@media(prefers-reduced-motion:reduce){.v857-scenario-choice.option,.v857-scenario-choice.option.correct,.v857-scenario-choice.option.wrong,.v857-burst i{animation:none!important;transition:none!important}}
</style>
<script id="deen-v857-scenario-runtime">
(()=>{
 if(window.__deenV857Scenario)return;window.__deenV857Scenario=true;
 const VERSION='8.5.7-SCENARIO-MINIGAME',BUILD='857scenario1';
 let rounds=0,decisions=0,correctDecisions=0;
 const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR').replace(/\\s+/g,' ');
 function eligible(q){return !!q&&Array.isArray(q.options_tr)&&q.options_tr.length>=2&&(q.activity_type==='scenario'||q.type==='scenario'||q.question_type==='scenario')}
 function currentQuestion(){try{return session?.questions?.[session.index]||null}catch(_){return null}}
 function haptic(ok){try{navigator.vibrate?.(ok?18:[10,24,10])}catch(_){}}
 function burst(card){const b=document.createElement('span');b.className='v857-burst';b.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i>';card.append(b);setTimeout(()=>b.remove(),600)}
 function decorate(){
  const q=currentQuestion(),area=document.getElementById('answerArea'),frame=document.querySelector('.question-frame');
  frame?.classList.remove('v857-scenario-mode');
  if(!eligible(q)||!area)return false;
  rounds++;
  frame?.classList.remove('v852-card-mode');frame?.classList.add('v857-scenario-mode');
  const questionEl=document.getElementById('questionText'),hint=document.getElementById('qType');
  const original=String(questionEl?.textContent||q.question_tr||q.prompt_tr||q.question||'').trim();
  const story=String(q.scenario_tr||q.context_tr||q.story_tr||q.case_tr||original).trim();
  const decisionPrompt=String(q.decision_prompt_tr||q.prompt_after_scenario_tr||(story!==original?original:'Bu durumda en doğru karar hangisi?')).trim();
  if(questionEl)questionEl.textContent=decisionPrompt;
  if(hint)hint.textContent='Durumu değerlendir · en doğru davranışı seç.';
  area.innerHTML='';
  const scene=document.createElement('div');scene.className='v857-scene';
  const actor=String(q.actor_tr||q.character_tr||q.person_tr||'Günlük hayat').trim();
  scene.innerHTML='<div class="v857-scene-top"><div class="v857-scene-mark">✦</div><div class="v857-scene-meta"><b>GÜNLÜK KARAR</b><span></span></div></div><div class="v857-scene-body"></div>';
  scene.querySelector('.v857-scene-meta span').textContent=actor;
  scene.querySelector('.v857-scene-body').textContent=story;
  const tag=document.createElement('div');tag.className='v857-decision-tag';tag.textContent='NASIL DAVRANIRSIN?';
  const decisionsEl=document.createElement('div');decisionsEl.className='v857-decisions';
  area.append(scene,tag,decisionsEl);
  let locked=false;
  q.options_tr.forEach((opt,idx)=>{
   const b=document.createElement('button');b.type='button';b.className='option v857-scenario-choice';
   const num=document.createElement('span');num.className='v857-choice-num';num.textContent=String(idx+1);
   const label=document.createElement('span');label.className='option-label';label.textContent=opt;
   const arrow=document.createElement('span');arrow.className='v857-choice-arrow';arrow.textContent='›';
   b.append(num,label,arrow);decisionsEl.append(b);
   b.onclick=e=>{
    e.preventDefault();e.stopPropagation();if(locked||document.getElementById('feedback')?.classList.contains('show'))return;locked=true;decisions++;
    const correct=norm(opt)===norm(q.correct_answer);if(correct)correctDecisions++;
    b.classList.add('v857-picked');haptic(correct);
    try{submitAnswer(opt,b)}catch(err){locked=false;console.error('DEEN scenario submit',err);return}
    decisionsEl.classList.add('v857-resolved');if(correct)burst(b);
    const title=document.getElementById('feedbackTitle'),text=document.getElementById('feedbackText');
    if(title)title.textContent=correct?'✓ İYİ KARAR':'BU SEÇİMİ BİRLİKTE DÜŞÜNELİM';
    const why=String(q.explanation_tr||q.feedback_tr||'Bu kararın dayandığı bilgiyi tekrar gözden geçir.').trim();
    if(text)text.textContent=correct?('Neden? '+why):('En doğru seçenek: '+String(q.correct_answer||'')+'. Neden? '+why);
    try{document.dispatchEvent(new CustomEvent('deen:scenario:decision',{detail:{version:VERSION,id:q.id||'',correct,choice:String(opt)}}))}catch(_){}
   };
  });
  return true;
 }
 const oldRender=typeof renderQuestion==='function'?renderQuestion:null;
 if(oldRender&&!oldRender.__v857){
  const wrapped=function(...args){document.querySelector('.question-frame')?.classList.remove('v857-scenario-mode');const out=oldRender.apply(this,args);queueMicrotask(decorate);return out};
  wrapped.__v857=true;try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
 }
 window.DEEN_SCENARIO_MINIGAME={version:VERSION,build:BUILD,eligible,decorate,check:()=>({version:VERSION,build:BUILD,ready:true,rounds,decisions,correctDecisions,active:!!document.querySelector('.v857-scenario-mode')})};
 document.documentElement.dataset.deenScenario='ready';
})();
<\/script>`;
 window.DEEN_PATCH_V857=function(html){let out=String(html);if(out.includes('deen-v857-scenario-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();