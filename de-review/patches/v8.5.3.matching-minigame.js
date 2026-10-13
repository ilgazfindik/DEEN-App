(()=>{
  const VERSION='8.5.3-MATCHING-MINIGAME';
  const BUILD='853match1';
  const addition=`<!-- DEEN v8.5.3 — Premium Matching Mini-game -->
<style id="deen-v853-matching-css">
.question-frame.v853-match-mode{padding-top:44px}
.question-frame.v853-match-mode .qtype{margin-bottom:10px;color:#9fb9bd}
.v853-match-wrap{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 24px minmax(0,1fr);gap:7px;align-items:stretch;margin-top:3px}
.v853-match-col{display:flex;flex-direction:column;gap:8px;min-width:0}
.v853-match-rail{position:relative;display:flex;align-items:center;justify-content:center}
.v853-match-rail:before{content:"";position:absolute;top:12px;bottom:12px;width:1px;background:linear-gradient(180deg,transparent,rgba(91,196,177,.28) 18%,rgba(91,196,177,.28) 82%,transparent)}
.v853-match-rail i{position:relative;width:8px;height:8px;border-radius:50%;background:#28565b;border:1px solid rgba(125,226,202,.32);box-shadow:0 0 0 4px rgba(87,197,174,.035)}
.v853-match-card{position:relative;width:100%;min-height:72px;padding:11px 9px;border-radius:18px;border:1px solid rgba(87,137,150,.48);background:linear-gradient(180deg,rgba(9,38,48,.98),rgba(6,28,36,.99));color:#edf7f4;box-shadow:inset 0 1px rgba(255,255,255,.025),0 8px 17px rgba(0,0,0,.14);font:750 12px/1.25 Inter,system-ui,sans-serif;text-align:center;display:grid;place-items:center;cursor:pointer;transition:transform 130ms ease,border-color 170ms ease,background 170ms ease,opacity 220ms ease,box-shadow 170ms ease;overflow:hidden}
.v853-match-card:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 10%,rgba(94,218,190,.06),transparent 58%);pointer-events:none}
.v853-match-card:not(:disabled):active{transform:scale(.97)}
.v853-match-card.selected{border-color:#70d9bf;background:linear-gradient(180deg,rgba(17,67,67,.99),rgba(8,42,47,.99));box-shadow:0 0 0 2px rgba(112,217,191,.10),0 9px 19px rgba(0,0,0,.17);transform:translateY(-1px)}
.v853-match-card.selected:after{content:"SEÇİLDİ";position:absolute;right:7px;top:6px;font:950 5px/1 Inter,system-ui,sans-serif;letter-spacing:.8px;color:#9ae8d2}
.v853-match-card.matched{border-color:rgba(111,224,190,.78);background:linear-gradient(180deg,rgba(18,78,64,.98),rgba(8,48,42,.99));color:#dffff4;animation:v853Pair 430ms cubic-bezier(.2,.75,.25,1)}
.v853-match-card.matched:after{content:"✓";position:absolute;right:8px;top:7px;color:#a8efd9;font:950 11px/1 Inter,system-ui,sans-serif}
.v853-match-card.settled{opacity:.34;transform:scale(.965);filter:saturate(.65)}
.v853-match-card.wrong{border-color:#d68091;background:linear-gradient(180deg,rgba(77,39,49,.98),rgba(45,27,34,.99));animation:v853Wrong 300ms ease}
.v853-match-status{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:2px;padding:8px 10px;border:1px solid rgba(75,132,141,.32);border-radius:14px;background:rgba(6,29,37,.62);color:#91adb1;font:800 8px/1.2 Inter,system-ui,sans-serif;letter-spacing:.25px}
.v853-match-status b{color:#dff4ef;font-size:9px}
.v853-match-pop{position:absolute;z-index:8;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none;padding:7px 11px;border-radius:999px;border:1px solid rgba(122,225,195,.3);background:rgba(11,55,51,.96);box-shadow:0 9px 25px rgba(0,0,0,.25);color:#a8efd8;font:950 8px/1 Inter,system-ui,sans-serif;letter-spacing:.7px;animation:v853Pop 650ms ease both}
.v853-match-pop.bad{border-color:rgba(220,132,148,.3);background:rgba(68,34,42,.96);color:#efb0bb}
.v853-match-finish{animation:v853Finish 520ms ease both}
@keyframes v853Pair{0%{transform:scale(.94)}48%{transform:scale(1.035)}100%{transform:scale(1)}}
@keyframes v853Wrong{0%,100%{transform:translateX(0)}28%{transform:translateX(-4px)}62%{transform:translateX(4px)}}
@keyframes v853Pop{0%{opacity:0;transform:translate(-50%,-38%) scale(.88)}24%,68%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-62%) scale(.96)}}
@keyframes v853Finish{0%{filter:brightness(1)}45%{filter:brightness(1.16)}100%{filter:brightness(1)}}
@media(max-width:390px){.v853-match-wrap{grid-template-columns:minmax(0,1fr) 18px minmax(0,1fr);gap:6px}.v853-match-card{min-height:66px;padding:9px 7px;border-radius:16px;font-size:11px}.v853-match-col{gap:7px}}
@media(prefers-reduced-motion:reduce){.v853-match-card,.v853-match-card.matched,.v853-match-card.wrong,.v853-match-pop,.v853-match-finish{animation:none!important;transition:none!important}}
</style>
<script id="deen-v853-matching-runtime">
(()=>{
 if(window.__deenV853Matching)return;window.__deenV853Matching=true;
 const VERSION='8.5.3-MATCHING-MINIGAME',BUILD='853match1';
 const oldMatching=typeof renderMatching==='function'?renderMatching:null;
 let rounds=0,pairHits=0,pairMisses=0,autoAdvanced=0,advanceTimer=0;
 const shuffle=a=>{const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out};
 function haptic(ok){try{if(navigator.vibrate)navigator.vibrate(ok?14:[10,22,10])}catch(_){}}
 function pop(host,text,bad=false){const p=document.createElement('div');p.className='v853-match-pop'+(bad?' bad':'');p.textContent=text;host.append(p);setTimeout(()=>p.remove(),690)}
 function premiumMatching(q,area){
  if(!q||!Array.isArray(q.pairs)||q.pairs.length<2){return oldMatching?.(q,area)}
  clearTimeout(advanceTimer);rounds++;
  const frame=document.querySelector('.question-frame');frame?.classList.add('v853-match-mode');
  const hint=document.getElementById('qType');if(hint)hint.textContent='Soldan bir kart seç · sağdaki doğru eşini bul.';
  const pairs=q.pairs.map((p,i)=>({id:i,left:String(p?.left??''),right:String(p?.right??'')}));
  const left=shuffle(pairs.map(p=>({pair:p.id,text:p.left}))),right=shuffle(pairs.map(p=>({pair:p.id,text:p.right})));
  const wrap=document.createElement('div');wrap.className='v853-match-wrap';
  const lcol=document.createElement('div');lcol.className='v853-match-col';
  const rail=document.createElement('div');rail.className='v853-match-rail';rail.innerHTML='<i></i>';
  const rcol=document.createElement('div');rcol.className='v853-match-col';
  const status=document.createElement('div');status.className='v853-match-status';
  wrap.append(lcol,rail,rcol,status);area.append(wrap);
  let selected=null,matched=0,errors=0,resolving=false,finished=false;
  try{matchState={left:null,matched:new Set(),errors:0}}catch(_){}
  const update=()=>{status.innerHTML='<span>Bağlantıları tamamla</span><b>'+matched+' / '+pairs.length+' EŞLEŞME</b>'};
  const buttons=[];
  function make(side,item){
   const b=document.createElement('button');b.type='button';b.className='v853-match-card';b.textContent=item.text;b.dataset.pair=String(item.pair);b.dataset.side=side;b.setAttribute('aria-label',(side==='left'?'Kavram: ':'Eş: ')+item.text);
   b.onclick=()=>pick(b);buttons.push(b);return b;
  }
  left.forEach(x=>lcol.append(make('left',x)));right.forEach(x=>rcol.append(make('right',x)));update();
  function finish(){
   if(finished)return;finished=true;wrap.classList.add('v853-match-finish');
   const ok=errors===0;
   setTimeout(()=>{
    try{completeQuestion(ok,q)}catch(err){console.error('DEEN matching complete',err);return}
    const title=document.getElementById('feedbackTitle');
    if(title)title.textContent=ok?'✓ TÜM EŞLEŞMELER DOĞRU':'Eşleştirme tamamlandı';
    try{document.dispatchEvent(new CustomEvent('deen:matching:complete',{detail:{version:VERSION,id:q.id||'',correct:ok,errors,pairs:pairs.length}}))}catch(_){}
    if(ok){advanceTimer=setTimeout(()=>{const btn=document.getElementById('continueBtn');if(btn&&!btn.disabled&&document.getElementById('feedback')?.classList.contains('show')){autoAdvanced++;btn.click()}},1100)}
   },430);
  }
  function good(a,b){
   resolving=true;pairHits++;matched++;haptic(true);
   a.classList.remove('selected');b.classList.remove('selected');a.classList.add('matched');b.classList.add('matched');
   a.disabled=true;b.disabled=true;pop(wrap,'✓ EŞLEŞTİ');
   try{matchState?.matched?.add?.(Number(a.dataset.pair));if(matchState)matchState.left=null}catch(_){}
   selected=null;update();
   setTimeout(()=>{a.classList.add('settled');b.classList.add('settled');resolving=false;if(matched>=pairs.length)finish()},330);
  }
  function bad(a,b){
   resolving=true;errors++;pairMisses++;haptic(false);a.classList.add('wrong');b.classList.add('wrong');pop(wrap,'BİR DAHA DENE',true);
   try{if(matchState)matchState.errors=errors}catch(_){}
   setTimeout(()=>{a.classList.remove('wrong','selected');b.classList.remove('wrong','selected');selected=null;resolving=false;try{if(matchState)matchState.left=null}catch(_){ }},310);
  }
  function pick(b){
   if(finished||resolving||b.disabled)return;
   if(!selected){selected=b;b.classList.add('selected');try{if(matchState)matchState.left=b}catch(_){};return}
   if(selected===b){b.classList.remove('selected');selected=null;try{if(matchState)matchState.left=null}catch(_){};return}
   if(selected.dataset.side===b.dataset.side){selected.classList.remove('selected');selected=b;b.classList.add('selected');try{if(matchState)matchState.left=b}catch(_){};return}
   b.classList.add('selected');
   const a=selected;Number(a.dataset.pair)===Number(b.dataset.pair)?good(a,b):bad(a,b);
  }
  return true;
 }
 try{window.renderMatching=premiumMatching;renderMatching=premiumMatching}catch(_){window.renderMatching=premiumMatching}
 const oldRender=typeof renderQuestion==='function'?renderQuestion:null;
 if(oldRender&&!oldRender.__v853){
  const wrapped=function(...args){clearTimeout(advanceTimer);document.querySelector('.question-frame')?.classList.remove('v853-match-mode');return oldRender.apply(this,args)};
  wrapped.__v853=true;try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
 }
 window.DEEN_MATCHING_MINIGAME={version:VERSION,build:BUILD,render:premiumMatching,check:()=>({version:VERSION,build:BUILD,ready:true,rounds,pairHits,pairMisses,autoAdvanced,active:!!document.querySelector('.v853-match-wrap')})};
 document.documentElement.dataset.deenMatching='ready';
})();
<\/script>`;
  window.DEEN_PATCH_V853=function(html){
    let out=String(html);
    if(out.includes('deen-v853-matching-runtime'))return {html:out,version:VERSION,applied:0};
    out+='\n'+addition+'\n';
    return {html:out,version:VERSION,applied:1};
  };
})();
