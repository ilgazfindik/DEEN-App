(()=>{
 const VERSION='8.5.8-ODD-ONE-OUT-MINIGAME',BUILD='858odd1';
 const addition=`<!-- DEEN v8.5.8 — Odd One Out Mini-game -->
<style id="deen-v858-odd-css">
.question-frame.v858-odd-mode{padding-top:44px}
.question-frame.v858-odd-mode .qtype{margin-bottom:10px;color:#9fb9bd}
.v858-odd-wrap{display:flex;flex-direction:column;gap:10px;margin-top:3px}
.v858-odd-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 11px;border:1px solid rgba(80,137,145,.32);border-radius:15px;background:rgba(6,29,37,.62);color:#91adb1;font:800 8px/1.25 Inter,system-ui,sans-serif;letter-spacing:.24px}
.v858-odd-head b{color:#dff4ef;font-size:9px}
.v858-odd-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.v858-odd-card{position:relative;min-height:105px;padding:16px 12px 14px;border-radius:20px;border:1px solid rgba(88,139,151,.48);background:linear-gradient(180deg,rgba(9,38,48,.98),rgba(6,28,36,.99));color:#edf7f4;box-shadow:inset 0 1px rgba(255,255,255,.025),0 9px 19px rgba(0,0,0,.15);font:800 12px/1.3 Inter,system-ui,sans-serif;text-align:center;display:flex;align-items:center;justify-content:center;overflow:hidden;transition:transform 130ms ease,border-color 170ms ease,background 170ms ease,box-shadow 170ms ease,opacity 170ms ease}
.v858-odd-card:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 12%,rgba(92,216,190,.065),transparent 57%);pointer-events:none}
.v858-odd-card:not(:disabled):active{transform:scale(.965)}
.v858-odd-card:after{content:"DOKUN";position:absolute;left:0;right:0;bottom:8px;color:#63868b;font:950 6px/1 Inter,system-ui,sans-serif;letter-spacing:1.15px}
.v858-odd-card.wrong-pick{border-color:#d88393;background:linear-gradient(180deg,rgba(75,39,48,.98),rgba(45,27,34,.99));animation:v858Miss 300ms ease}
.v858-odd-card.wrong-pick:after{content:"BU DEĞİL";color:#e8a3af}
.v858-odd-card.target{border-color:#78dfbf;background:linear-gradient(180deg,rgba(19,77,66,.98),rgba(8,48,44,.99));box-shadow:0 0 0 2px rgba(117,225,191,.1),0 12px 28px rgba(42,199,159,.17);animation:v858Hit 430ms cubic-bezier(.2,.75,.25,1)}
.v858-odd-card.target:after{content:"YAKALANDI ✓";color:#9ae8d2}
.v858-odd-card.dim{opacity:.45;transform:scale(.985)}
.v858-odd-pop{align-self:center;min-width:120px;padding:7px 12px;border-radius:999px;border:1px solid rgba(121,225,194,.3);background:rgba(10,54,50,.96);color:#a7efd8;text-align:center;font:950 8px/1 Inter,system-ui,sans-serif;letter-spacing:.65px;animation:v858Pop 620ms ease both}
.v858-odd-pop.bad{border-color:rgba(219,132,148,.3);background:rgba(67,34,42,.96);color:#efb0bc}
@keyframes v858Miss{0%,100%{transform:translateX(0)}28%{transform:translateX(-4px)}62%{transform:translateX(4px)}}
@keyframes v858Hit{0%{transform:scale(.95)}48%{transform:scale(1.04)}100%{transform:scale(1)}}
@keyframes v858Pop{0%{opacity:0;transform:translateY(5px) scale(.9)}25%,72%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-4px) scale(.97)}}
@media(max-width:390px){.v858-odd-grid{gap:8px}.v858-odd-card{min-height:96px;padding:14px 9px 13px;border-radius:18px;font-size:11px}}
@media(prefers-reduced-motion:reduce){.v858-odd-card,.v858-odd-pop{animation:none!important;transition:none!important}}
</style>
<script id="deen-v858-odd-runtime">
(()=>{
 if(window.__deenV858Odd)return;window.__deenV858Odd=true;
 const VERSION='8.5.8-ODD-ONE-OUT-MINIGAME',BUILD='858odd1';
 let rounds=0,perfect=0,misses=0,autoAdvanced=0,advanceTimer=0;
 const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR').replace(/\\s+/g,' ');
 const value=o=>o&&typeof o==='object'?String(o.text??o.label??o.value??o.id??''):String(o??'');
 function eligible(q){
  const t=String(q?.type||q?.question_type||'').toLowerCase(),a=String(q?.activity_type||'').toLowerCase();
  return t==='odd_one_out'||['odd_one_out','find_wrong','find_incorrect','wrong_one','spot_error'].includes(a);
 }
 function options(q){const a=Array.isArray(q?.options_tr)?q.options_tr:(Array.isArray(q?.options)?q.options:[]);return a.map(value).filter(Boolean)}
 function correctValue(q,opts){
  let a=q?.correct_answer??q?.answer??q?.correctAnswer??q?.odd_answer??q?.wrong_answer;
  if(typeof a==='number'){
   if(opts[a]!==undefined)return opts[a];
   if(a>0&&opts[a-1]!==undefined)return opts[a-1];
  }
  return value(a);
 }
 function haptic(ok){try{navigator.vibrate?.(ok?18:[10,22,10])}catch(_){}}
 function pop(wrap,text,bad=false){wrap.querySelector('.v858-odd-pop')?.remove();const p=document.createElement('div');p.className='v858-odd-pop'+(bad?' bad':'');p.textContent=text;wrap.append(p);setTimeout(()=>p.remove(),650)}
 function currentQuestion(){try{return session?.questions?.[session.index]||null}catch(_){return null}}
 function decorate(){
  clearTimeout(advanceTimer);
  const q=currentQuestion(),area=document.getElementById('answerArea'),frame=document.querySelector('.question-frame');
  frame?.classList.remove('v858-odd-mode');
  if(!q||!eligible(q)||!area)return false;
  const opts=options(q),answer=correctValue(q,opts);if(opts.length<3||!answer)return false;
  rounds++;frame?.classList.add('v858-odd-mode');
  const hint=document.getElementById('qType');if(hint)hint.textContent='Aykırı veya hatalı olan ifadeyi yakala.';
  area.innerHTML='';
  const wrap=document.createElement('div');wrap.className='v858-odd-wrap';
  const head=document.createElement('div');head.className='v858-odd-head';head.innerHTML='<span>Yanlışı bul</span><b>1 HEDEF</b>';
  const grid=document.createElement('div');grid.className='v858-odd-grid';wrap.append(head,grid);area.append(wrap);
  let errors=0,finished=false;
  opts.forEach((text,i)=>{
   const b=document.createElement('button');b.type='button';b.className='v858-odd-card';b.textContent=text;b.dataset.value=text;b.setAttribute('aria-label','İfade '+(i+1)+': '+text);
   b.onclick=()=>{
    if(finished||b.disabled||document.getElementById('feedback')?.classList.contains('show'))return;
    const ok=norm(text)===norm(answer);
    if(!ok){errors++;misses++;haptic(false);b.classList.remove('wrong-pick');void b.offsetWidth;b.classList.add('wrong-pick');pop(wrap,'BU İFADE DOĞRU · DEVAM ET',true);setTimeout(()=>b.classList.remove('wrong-pick'),360);try{document.dispatchEvent(new CustomEvent('deen:odd-one-out:miss',{detail:{version:VERSION,id:q.id||'',errors}}))}catch(_){};return}
    finished=true;haptic(true);b.classList.add('target');grid.querySelectorAll('.v858-odd-card').forEach(x=>{x.disabled=true;if(x!==b)x.classList.add('dim')});pop(wrap,errors===0?'✓ İLK SEFERDE YAKALADIN':'✓ HEDEFİ BULDUN');
    const clean=errors===0;if(clean)perfect++;
    setTimeout(()=>{
     try{completeQuestion(clean,q)}catch(err){console.error('DEEN odd-one-out complete',err);return}
     const title=document.getElementById('feedbackTitle');if(title)title.textContent=clean?'✓ YAKALADIN!':'Doğru ifadeyi ayırt ettik';
     try{document.dispatchEvent(new CustomEvent('deen:odd-one-out:complete',{detail:{version:VERSION,id:q.id||'',correct:clean,errors}}))}catch(_){}
     if(clean)advanceTimer=setTimeout(()=>{const btn=document.getElementById('continueBtn');if(btn&&!btn.disabled&&document.getElementById('feedback')?.classList.contains('show')){autoAdvanced++;btn.click()}},1100);
    },430);
   };
   grid.append(b);
  });
  return true;
 }
 const oldRender=typeof renderQuestion==='function'?renderQuestion:null;
 if(oldRender&&!oldRender.__v858){
  const wrapped=function(...args){clearTimeout(advanceTimer);document.querySelector('.question-frame')?.classList.remove('v858-odd-mode');const out=oldRender.apply(this,args);queueMicrotask(decorate);return out};
  wrapped.__v858=true;try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
 }
 window.DEEN_ODD_ONE_OUT_MINIGAME={version:VERSION,build:BUILD,eligible,decorate,check:()=>({version:VERSION,build:BUILD,ready:true,rounds,perfect,misses,autoAdvanced,active:!!document.querySelector('.v858-odd-wrap')})};
 document.documentElement.dataset.deenOddOneOut='ready';
})();
<\/script>`;
 window.DEEN_PATCH_V858=function(html){let out=String(html);if(out.includes('deen-v858-odd-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
