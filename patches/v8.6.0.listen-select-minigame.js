(()=>{
 const VERSION='8.6.0-LISTEN-SELECT-MINIGAME',BUILD='860listen1';
 const addition=`<!-- DEEN v8.6.0 — Listen & Select Mini-game -->
<style id="deen-v860-listen-css">
.question-frame.v860-listen-mode{padding-top:42px}
.question-frame.v860-listen-mode .qtype{margin-bottom:10px;color:#9fb9bd}
.question-frame.v860-listen-mode .template-action{display:none!important}
.v860-audio-card{position:relative;margin:3px 0 13px;padding:16px 14px 14px;border:1px solid rgba(92,164,161,.34);border-radius:23px;background:linear-gradient(150deg,rgba(10,47,56,.99),rgba(6,29,38,.99));box-shadow:inset 0 1px rgba(255,255,255,.03),0 12px 25px rgba(0,0,0,.17);overflow:hidden}
.v860-audio-card:before{content:"";position:absolute;right:-32px;top:-40px;width:126px;height:126px;border-radius:50%;border:1px solid rgba(222,195,111,.11);box-shadow:0 0 45px rgba(222,195,111,.035)}
.v860-audio-top{position:relative;display:flex;align-items:center;gap:12px}
.v860-play{flex:0 0 58px;width:58px;height:58px;border-radius:19px;border:1px solid rgba(125,227,201,.38);background:linear-gradient(180deg,rgba(37,112,99,.96),rgba(18,72,72,.98));color:#eafff8;box-shadow:0 10px 22px rgba(0,0,0,.2),inset 0 1px rgba(255,255,255,.06);display:grid;place-items:center;font:950 21px/1 Inter,system-ui,sans-serif;transition:transform 130ms ease,box-shadow 180ms ease,border-color 180ms ease}
.v860-play:not(:disabled):active{transform:scale(.95)}
.v860-play.playing{border-color:#92ead2;box-shadow:0 0 0 3px rgba(128,229,202,.09),0 12px 25px rgba(0,0,0,.2)}
.v860-play:disabled{opacity:.42}
.v860-audio-info{min-width:0;flex:1}.v860-audio-info b{display:block;color:#eef8f5;font:900 12px/1.2 Inter,system-ui,sans-serif}.v860-audio-info span{display:block;margin-top:5px;color:#88a8ac;font:720 8px/1.35 Inter,system-ui,sans-serif;letter-spacing:.2px}
.v860-wave{position:relative;height:42px;margin-top:13px;display:flex;align-items:center;justify-content:center;gap:4px;padding:0 8px;border-radius:15px;border:1px solid rgba(76,129,139,.26);background:rgba(5,27,35,.48);overflow:hidden}
.v860-wave i{display:block;width:3px;height:11px;border-radius:999px;background:#477f82;opacity:.72;transform-origin:center;transition:height 180ms ease,background 180ms ease,opacity 180ms ease}
.v860-wave.playing i{background:#7bdec5;opacity:1;animation:v860Wave 740ms ease-in-out infinite alternate}
.v860-wave.playing i:nth-child(2n){animation-delay:-180ms}.v860-wave.playing i:nth-child(3n){animation-delay:-360ms}.v860-wave.playing i:nth-child(5n){animation-delay:-520ms}
.v860-audio-state{position:relative;display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:9px;color:#718f94;font:800 7px/1.25 Inter,system-ui,sans-serif;letter-spacing:.45px}.v860-audio-state b{color:#b8ddd4;font-size:8px}.v860-audio-state.ready b{color:#8be2c9}.v860-audio-state.error b{color:#e7a8b3}
.v860-list{display:flex;flex-direction:column;gap:9px}.v860-list.locked{opacity:.62}.v860-list.locked .v860-choice{cursor:not-allowed}
.v860-choice.option{position:relative;min-height:61px;padding:11px 42px 11px 50px;border-radius:18px;border:1px solid rgba(86,137,149,.45);background:linear-gradient(180deg,rgba(9,38,48,.98),rgba(6,28,36,.99));color:#edf6f3;box-shadow:inset 0 1px rgba(255,255,255,.025),0 8px 17px rgba(0,0,0,.14);text-align:left;font:770 12px/1.3 Inter,system-ui,sans-serif;display:flex;align-items:center;transition:transform 130ms ease,border-color 180ms ease,background 180ms ease,box-shadow 180ms ease,opacity 180ms ease}
.v860-choice.option:not(:disabled):active{transform:scale(.985)}
.v860-choice-num{position:absolute;left:11px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:10px;display:grid;place-items:center;border:1px solid rgba(98,207,183,.24);background:rgba(18,67,68,.76);color:#a8ead6;font:950 9px/1 Inter,system-ui,sans-serif}
.v860-choice-arrow{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:#587d83;font:900 15px/1 Inter,system-ui,sans-serif}
.v860-choice.option.correct{border-color:#79dfc0!important;background:linear-gradient(180deg,rgba(18,77,65,.98),rgba(8,48,43,.99))!important;animation:v860Good 420ms cubic-bezier(.2,.75,.25,1)}
.v860-choice.option.wrong{border-color:#d88695!important;background:linear-gradient(180deg,rgba(76,40,49,.98),rgba(46,27,34,.99))!important;animation:v860Wrong 300ms ease}
.v860-list.resolved .v860-choice.option:not(.correct):not(.wrong){opacity:.5}
.v860-hear-first{margin:8px 0 2px;text-align:center;color:#6e8c91;font:850 7px/1 Inter,system-ui,sans-serif;letter-spacing:.6px}
@keyframes v860Wave{0%{height:8px}50%{height:28px}100%{height:14px}}
@keyframes v860Good{0%{transform:scale(.985)}48%{transform:scale(1.018)}100%{transform:scale(1)}}
@keyframes v860Wrong{0%,100%{transform:translateX(0)}28%{transform:translateX(-4px)}62%{transform:translateX(4px)}}
@media(max-width:390px){.v860-audio-card{padding:14px 12px 12px;border-radius:20px}.v860-play{width:54px;height:54px;flex-basis:54px;border-radius:17px}.v860-choice.option{min-height:57px;padding:10px 38px 10px 46px;border-radius:16px;font-size:11px}.v860-choice-num{width:26px;height:26px}.v860-wave{height:38px}}
@media(prefers-reduced-motion:reduce){.v860-wave.playing i,.v860-choice.option,.v860-choice.option.correct,.v860-choice.option.wrong{animation:none!important;transition:none!important}}
</style>
<script id="deen-v860-listen-runtime">
(()=>{
 if(window.__deenV860Listen)return;window.__deenV860Listen=true;
 const VERSION='8.6.0-LISTEN-SELECT-MINIGAME',BUILD='860listen1';
 let rounds=0,plays=0,answers=0,correctAnswers=0,autoAdvanced=0,advanceTimer=0,audio=null,unlockTimer=0;
 const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR').replace(/\\s+/g,' ');
 function kind(q){return String(q?.type||q?.question_type||q?.activity_type||'').toLowerCase()}
 function eligible(q){return !!q&&['listen_select','listen-and-select','audio_select','audio_choice'].includes(kind(q))&&Array.isArray(q.options_tr)&&q.options_tr.length>=2&&q.options_tr.length<=4}
 function currentQuestion(){try{return session?.questions?.[session.index]||null}catch(_){return null}}
 function audioSource(q){return String(q?.audio_url||q?.audio_src||q?.audio_source||q?.voice_url||q?.media_url||q?.audio||'').trim()}
 function stopAudio(){clearTimeout(unlockTimer);if(audio){try{audio.pause();audio.currentTime=0}catch(_){}audio=null}}
 function haptic(ok){try{navigator.vibrate?.(ok?16:[10,22,10])}catch(_){}}
 function decorate(){
  clearTimeout(advanceTimer);stopAudio();
  const q=currentQuestion(),area=document.getElementById('answerArea'),frame=document.querySelector('.question-frame');
  frame?.classList.remove('v860-listen-mode');
  if(!eligible(q)||!area)return false;
  rounds++;frame?.classList.remove('v852-card-mode','v859-mcq-mode');frame?.classList.add('v860-listen-mode');
  const hint=document.getElementById('qType');if(hint)hint.textContent='Önce dinle · sonra doğru cevabı seç.';
  const src=audioSource(q);area.innerHTML='';
  const card=document.createElement('div');card.className='v860-audio-card';
  const top=document.createElement('div');top.className='v860-audio-top';
  const play=document.createElement('button');play.type='button';play.className='v860-play';play.setAttribute('aria-label','Ses kaydını oynat');play.textContent='▶';
  const info=document.createElement('div');info.className='v860-audio-info';
  const title=document.createElement('b');title.textContent=String(q.audio_title_tr||q.audio_label_tr||'Ses kaydını dinle');
  const sub=document.createElement('span');sub.textContent=String(q.audio_hint_tr||'Kaydı istediğin kadar tekrar dinleyebilirsin.');info.append(title,sub);top.append(play,info);
  const wave=document.createElement('div');wave.className='v860-wave';wave.setAttribute('aria-hidden','true');for(let i=0;i<18;i++)wave.append(document.createElement('i'));
  const state=document.createElement('div');state.className='v860-audio-state';state.innerHTML='<span>DİNLEME DURUMU</span><b>ÖNCE SESİ DİNLE</b>';
  card.append(top,wave,state);
  const hear=document.createElement('div');hear.className='v860-hear-first';hear.textContent='SEÇENEKLER DİNLEDİKTEN SONRA AÇILIR';
  const list=document.createElement('div');list.className='v860-list locked';
  area.append(card,hear,list);
  let heard=false,locked=false;
  const setPlaying=on=>{play.classList.toggle('playing',on);wave.classList.toggle('playing',on);play.textContent=on?'Ⅱ':'▶';play.setAttribute('aria-label',on?'Ses kaydını duraklat':'Ses kaydını oynat')};
  const unlock=()=>{if(heard)return;heard=true;list.classList.remove('locked');list.querySelectorAll('button').forEach(b=>b.disabled=false);state.classList.add('ready');state.querySelector('b').textContent='DİNLENDİ · SEÇEBİLİRSİN';hear.textContent='ŞİMDİ DOĞRU CEVABI SEÇ';try{document.dispatchEvent(new CustomEvent('deen:listen:unlocked',{detail:{version:VERSION,id:q.id||''}}))}catch(_){}};
  if(!src){play.disabled=true;state.classList.add('error');state.querySelector('b').textContent='SES KAYDI BAĞLI DEĞİL';sub.textContent='Bu soru yayınlanmadan önce onaylı bir ses dosyası bağlanmalı.'}
  else{
   audio=new Audio();audio.preload='metadata';audio.src=src;
   audio.addEventListener('playing',()=>{setPlaying(true);plays++;clearTimeout(unlockTimer);unlockTimer=setTimeout(unlock,550);try{document.dispatchEvent(new CustomEvent('deen:listen:play',{detail:{version:VERSION,id:q.id||'',plays}}))}catch(_){}});
   audio.addEventListener('pause',()=>setPlaying(false));audio.addEventListener('ended',()=>{setPlaying(false);unlock()});
   audio.addEventListener('error',()=>{setPlaying(false);play.disabled=true;state.classList.add('error');state.querySelector('b').textContent='SES YÜKLENEMEDİ';sub.textContent='Ses kaynağını kontrol et.'});
   play.onclick=async()=>{if(!audio)return;if(!audio.paused){audio.pause();return}try{await audio.play()}catch(err){state.classList.add('error');state.querySelector('b').textContent='OYNATMA BAŞLATILAMADI';console.error('DEEN listen audio',err)}};
  }
  q.options_tr.forEach((opt,idx)=>{
   const b=document.createElement('button');b.type='button';b.className='option v860-choice';b.disabled=!heard;
   const num=document.createElement('span');num.className='v860-choice-num';num.textContent=String(idx+1);
   const label=document.createElement('span');label.className='option-label';label.textContent=String(opt);
   const arrow=document.createElement('span');arrow.className='v860-choice-arrow';arrow.textContent='›';b.append(num,label,arrow);list.append(b);
   b.onclick=e=>{
    e.preventDefault();e.stopPropagation();if(!heard||locked||document.getElementById('feedback')?.classList.contains('show'))return;locked=true;answers++;stopAudio();
    const value=String(opt),correct=norm(value)===norm(q.correct_answer);if(correct)correctAnswers++;haptic(correct);
    try{submitAnswer(value,b)}catch(err){locked=false;console.error('DEEN listen submit',err);return}
    list.classList.add('resolved');const ft=document.getElementById('feedbackTitle');
    if(correct){if(ft)ft.textContent='✓ DOĞRU DUYDUN';advanceTimer=setTimeout(()=>{const btn=document.getElementById('continueBtn');if(btn&&!btn.disabled&&document.getElementById('feedback')?.classList.contains('show')){autoAdvanced++;btn.click()}},1100)}
    else if(ft)ft.textContent='Bir kez daha dinleyelim';
    try{document.dispatchEvent(new CustomEvent('deen:listen:answered',{detail:{version:VERSION,id:q.id||'',correct,choice:value,plays}}))}catch(_){}
   };
  });
  return true;
 }
 const oldRender=typeof renderQuestion==='function'?renderQuestion:null;
 if(oldRender&&!oldRender.__v860){
  const wrapped=function(...args){clearTimeout(advanceTimer);stopAudio();document.querySelector('.question-frame')?.classList.remove('v860-listen-mode');const out=oldRender.apply(this,args);queueMicrotask(decorate);return out};
  wrapped.__v860=true;try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
 }
 window.addEventListener('beforeunload',stopAudio);
 window.DEEN_LISTEN_SELECT_MINIGAME={version:VERSION,build:BUILD,eligible,decorate,requiresApprovedAudio:true,check:()=>({version:VERSION,build:BUILD,ready:true,rounds,plays,answers,correctAnswers,autoAdvanced,active:!!document.querySelector('.v860-listen-mode')})};
 document.documentElement.dataset.deenListenSelect='ready';
})();
<\/script>`;
 window.DEEN_PATCH_V860=function(html){let out=String(html);if(out.includes('deen-v860-listen-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();