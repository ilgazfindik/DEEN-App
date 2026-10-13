(()=>{
 const VERSION='8.6.1-PRONUNCIATION-PRACTICE',BUILD='861speak1';
 const addition=`<!-- DEEN v8.6.1 — Pronunciation Practice -->
<style id="deen-v861-pronunciation-css">
.question-frame.v861-pron-mode{padding-top:42px}
.question-frame.v861-pron-mode .qtype{margin-bottom:10px;color:#9fb9bd}
.question-frame.v861-pron-mode .template-action{display:none!important}
.v861-pron-wrap{display:flex;flex-direction:column;gap:11px;margin-top:3px}
.v861-target{position:relative;padding:15px 14px;border:1px solid rgba(96,164,158,.34);border-radius:22px;background:linear-gradient(150deg,rgba(10,47,56,.99),rgba(6,29,38,.99));box-shadow:inset 0 1px rgba(255,255,255,.03),0 12px 25px rgba(0,0,0,.16);overflow:hidden}
.v861-target:before{content:"";position:absolute;right:-36px;top:-42px;width:126px;height:126px;border-radius:50%;border:1px solid rgba(224,196,111,.11)}
.v861-target-label{position:relative;color:#7ea5a7;font:900 7px/1 Inter,system-ui,sans-serif;letter-spacing:1px}.v861-target-text{position:relative;margin-top:9px;color:#f1f8f5;font:850 17px/1.45 Inter,system-ui,sans-serif;text-align:center}.v861-target-hint{position:relative;margin-top:8px;color:#78989d;font:700 8px/1.35 Inter,system-ui,sans-serif;text-align:center}
.v861-reference{display:grid;grid-template-columns:54px 1fr;gap:11px;align-items:center;padding:11px;border:1px solid rgba(78,132,141,.3);border-radius:18px;background:rgba(6,29,37,.58)}
.v861-ref-play{width:54px;height:54px;border-radius:17px;border:1px solid rgba(125,227,201,.35);background:linear-gradient(180deg,rgba(35,109,97,.96),rgba(18,71,71,.98));color:#eafff8;font:950 19px/1 Inter,system-ui,sans-serif;box-shadow:0 8px 18px rgba(0,0,0,.18)}.v861-ref-play:disabled{opacity:.38}.v861-ref-play.playing{border-color:#90e9d0;box-shadow:0 0 0 3px rgba(128,229,202,.08),0 8px 18px rgba(0,0,0,.18)}
.v861-ref-copy b{display:block;color:#e9f5f1;font:900 10px/1.2 Inter,system-ui,sans-serif}.v861-ref-copy span{display:block;margin-top:5px;color:#7f9da2;font:700 8px/1.35 Inter,system-ui,sans-serif}
.v861-mic-card{padding:14px 12px;border:1px solid rgba(82,139,148,.34);border-radius:22px;background:linear-gradient(180deg,rgba(8,37,47,.96),rgba(5,27,35,.99));text-align:center;overflow:hidden}
.v861-wave{height:38px;display:flex;align-items:center;justify-content:center;gap:4px;margin-bottom:10px}.v861-wave i{width:3px;height:8px;border-radius:999px;background:#476f76;opacity:.64}.v861-mic-card.recording .v861-wave i{background:#83e2c9;opacity:1;animation:v861Wave 620ms ease-in-out infinite alternate}.v861-mic-card.recording .v861-wave i:nth-child(2n){animation-delay:-150ms}.v861-mic-card.recording .v861-wave i:nth-child(3n){animation-delay:-300ms}.v861-mic-card.recording .v861-wave i:nth-child(5n){animation-delay:-430ms}
.v861-mic{width:72px;height:72px;border-radius:24px;border:1px solid rgba(119,221,194,.38);background:linear-gradient(180deg,#267a6d,#155a59);color:#effff9;box-shadow:0 12px 25px rgba(0,0,0,.22),inset 0 1px rgba(255,255,255,.06);font:950 24px/1 Inter,system-ui,sans-serif;transition:transform 130ms ease,box-shadow 180ms ease}.v861-mic:active{transform:scale(.95)}.v861-mic-card.recording .v861-mic{background:linear-gradient(180deg,#8b4655,#61343e);border-color:rgba(235,155,169,.5);box-shadow:0 0 0 5px rgba(220,113,134,.08),0 12px 25px rgba(0,0,0,.22)}
.v861-mic-title{margin-top:9px;color:#eaf6f2;font:900 10px/1.2 Inter,system-ui,sans-serif}.v861-mic-sub{margin-top:5px;color:#7f9ea3;font:700 8px/1.35 Inter,system-ui,sans-serif}
.v861-heard{display:none;padding:10px 11px;border:1px solid rgba(87,147,150,.3);border-radius:16px;background:rgba(8,35,42,.66);text-align:left}.v861-heard.show{display:block}.v861-heard small{display:block;color:#6f9296;font:850 7px/1 Inter,system-ui,sans-serif;letter-spacing:.7px}.v861-heard b{display:block;margin-top:6px;color:#dff3ed;font:800 11px/1.35 Inter,system-ui,sans-serif}.v861-heard em{display:block;margin-top:7px;color:#88adad;font:750 8px/1.35 Inter,system-ui,sans-serif;font-style:normal}.v861-heard.good{border-color:rgba(110,219,189,.38)}.v861-heard.good em{color:#95e3cd}.v861-heard.warn{border-color:rgba(220,183,105,.3)}.v861-heard.warn em{color:#dbc989}
.v861-self-audio{display:none;width:100%;height:34px;margin-top:8px}.v861-self-audio.show{display:block}
.v861-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v861-retry,.v861-finish{min-height:48px;border-radius:15px;font:900 10px/1 Inter,system-ui,sans-serif;letter-spacing:.3px}.v861-retry{border:1px solid rgba(89,145,153,.4);background:rgba(9,39,48,.9);color:#b9d0d0}.v861-finish{border:1px solid rgba(112,215,189,.36);background:linear-gradient(180deg,#195d58,#104846);color:#eafff8}.v861-actions button:disabled{opacity:.4}
.v861-note{color:#6d8b90;font:700 7px/1.4 Inter,system-ui,sans-serif;text-align:center;padding:0 8px}
@keyframes v861Wave{0%{height:7px}50%{height:29px}100%{height:13px}}
@media(max-width:390px){.v861-target{padding:13px 12px;border-radius:19px}.v861-target-text{font-size:15px}.v861-reference{grid-template-columns:50px 1fr}.v861-ref-play{width:50px;height:50px;border-radius:16px}.v861-mic{width:68px;height:68px;border-radius:22px}}
@media(prefers-reduced-motion:reduce){.v861-mic-card.recording .v861-wave i,.v861-mic{animation:none!important;transition:none!important}}
</style>
<script id="deen-v861-pronunciation-runtime">
(()=>{
 if(window.__deenV861Pronunciation)return;window.__deenV861Pronunciation=true;
 const VERSION='8.6.1-PRONUNCIATION-PRACTICE',BUILD='861speak1';
 let rounds=0,attempts=0,recognitions=0,completed=0,refPlays=0;
 let refAudio=null,recognizer=null,stream=null,recorder=null,chunks=[],stopTimer=0,userUrl='';
 function kind(q){return String(q?.type||q?.question_type||q?.activity_type||'').toLowerCase()}
 function eligible(q){return !!q&&['pronunciation','pronounce','speaking','repeat_after_me','speak'].includes(kind(q))}
 function currentQuestion(){try{return session?.questions?.[session.index]||null}catch(_){return null}}
 function target(q){return String(q?.target_text_tr||q?.target_text||q?.targetText||q?.phrase_tr||q?.phrase||q?.text_to_repeat||q?.correct_answer||q?.answer||'').trim()}
 function audioSource(q){return String(q?.audio_url||q?.audio_src||q?.reference_audio_url||q?.voice_url||q?.media_url||q?.audio||'').trim()}
 function norm(v){return String(v??'').normalize('NFKD').toLocaleLowerCase('tr-TR').replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,'').replace(/\u0640/g,'').replace(/[إأآٱ]/g,'ا').replace(/ى/g,'ي').replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim()}
 function similarity(a,b){a=norm(a);b=norm(b);if(!a&&!b)return 1;if(!a||!b)return 0;const m=a.length,n=b.length,dp=new Array(n+1);for(let j=0;j<=n;j++)dp[j]=j;for(let i=1;i<=m;i++){let prev=dp[0];dp[0]=i;for(let j=1;j<=n;j++){const tmp=dp[j],cost=a[i-1]===b[j-1]?0:1;dp[j]=Math.min(dp[j]+1,dp[j-1]+1,prev+cost);prev=tmp}}return Math.max(0,1-dp[n]/Math.max(m,n))}
 function stopRef(){if(refAudio){try{refAudio.pause();refAudio.currentTime=0}catch(_){}refAudio=null}}
 function cleanupMic(){clearTimeout(stopTimer);try{recognizer?.abort?.()}catch(_){}recognizer=null;try{if(recorder&&recorder.state!=='inactive')recorder.stop()}catch(_){}recorder=null;try{stream?.getTracks?.().forEach(t=>t.stop())}catch(_){}stream=null;chunks=[]}
 function cleanup(){stopRef();cleanupMic();if(userUrl){try{URL.revokeObjectURL(userUrl)}catch(_){}userUrl=''}}
 function haptic(){try{navigator.vibrate?.(14)}catch(_){}}
 function decorate(){
  cleanup();
  const q=currentQuestion(),area=document.getElementById('answerArea'),frame=document.querySelector('.question-frame');
  frame?.classList.remove('v861-pron-mode');
  if(!eligible(q)||!area)return false;
  const phrase=target(q);if(!phrase)return false;
  rounds++;frame?.classList.remove('v852-card-mode','v859-mcq-mode','v860-listen-mode');frame?.classList.add('v861-pron-mode');
  const hint=document.getElementById('qType');if(hint)hint.textContent='Dinle · mikrofona bas · tekrar et.';
  const question=document.getElementById('questionText');if(question)question.textContent=String(q.instruction_tr||q.question_tr||q.prompt_tr||'Aşağıdaki ifadeyi sesli tekrar et.');
  area.innerHTML='';
  const wrap=document.createElement('div');wrap.className='v861-pron-wrap';
  const targetCard=document.createElement('div');targetCard.className='v861-target';targetCard.innerHTML='<div class="v861-target-label">TEKRAR EDECEĞİN İFADE</div><div class="v861-target-text"></div><div class="v861-target-hint">Önce örneği dinle, sonra kendi sesinle tekrar et.</div>';targetCard.querySelector('.v861-target-text').textContent=phrase;
  const reference=document.createElement('div');reference.className='v861-reference';
  const refBtn=document.createElement('button');refBtn.type='button';refBtn.className='v861-ref-play';refBtn.textContent='▶';refBtn.setAttribute('aria-label','Örnek telaffuzu dinle');
  const refCopy=document.createElement('div');refCopy.className='v861-ref-copy';refCopy.innerHTML='<b>Örnek telaffuz</b><span></span>';reference.append(refBtn,refCopy);
  const src=audioSource(q);refCopy.querySelector('span').textContent=src?'Onaylı ses kaydını istediğin kadar dinleyebilirsin.':'Bu içerik için henüz onaylı örnek ses bağlanmadı.';
  if(!src)refBtn.disabled=true;else{refAudio=new Audio();refAudio.preload='metadata';refAudio.src=src;refAudio.addEventListener('playing',()=>{refBtn.classList.add('playing');refBtn.textContent='Ⅱ';refPlays++});refAudio.addEventListener('pause',()=>{refBtn.classList.remove('playing');refBtn.textContent='▶'});refAudio.addEventListener('ended',()=>{refBtn.classList.remove('playing');refBtn.textContent='▶'});refAudio.addEventListener('error',()=>{refBtn.disabled=true;refCopy.querySelector('span').textContent='Örnek ses yüklenemedi; kaynak kontrol edilmeli.'});refBtn.onclick=async()=>{if(!refAudio)return;if(!refAudio.paused){refAudio.pause();return}try{await refAudio.play()}catch(err){console.error('DEEN pronunciation reference',err)}}}
  const micCard=document.createElement('div');micCard.className='v861-mic-card';
  const wave=document.createElement('div');wave.className='v861-wave';for(let i=0;i<18;i++)wave.append(document.createElement('i'));
  const mic=document.createElement('button');mic.type='button';mic.className='v861-mic';mic.textContent='●';mic.setAttribute('aria-label','Telaffuz kaydını başlat');
  const micTitle=document.createElement('div');micTitle.className='v861-mic-title';micTitle.textContent='Mikrofona bas ve tekrar et';
  const micSub=document.createElement('div');micSub.className='v861-mic-sub';micSub.textContent='İlk denemede mükemmel olmak zorunda değil.';
  micCard.append(wave,mic,micTitle,micSub);
  const heard=document.createElement('div');heard.className='v861-heard';heard.innerHTML='<small>SİSTEMİN DUYDUĞU</small><b></b><em></em>';
  const selfAudio=document.createElement('audio');selfAudio.className='v861-self-audio';selfAudio.controls=true;heard.append(selfAudio);
  const actions=document.createElement('div');actions.className='v861-actions';
  const retry=document.createElement('button');retry.type='button';retry.className='v861-retry';retry.textContent='TEKRAR DENE';retry.disabled=true;
  const finish=document.createElement('button');finish.type='button';finish.className='v861-finish';finish.textContent='PRATİĞİ TAMAMLA';finish.disabled=true;actions.append(retry,finish);
  const note=document.createElement('div');note.className='v861-note';note.textContent='Bu sürüm yaklaşık konuşma eşleşmesi verir; düşük eşleşme can veya enerji götürmez ve dinî telaffuz için kesin hüküm sayılmaz.';
  wrap.append(targetCard,reference,micCard,heard,actions,note);area.append(wrap);
  let recording=false,attempted=false,transcript='',finalized=false;
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition||null;
  const lang=String(q.speech_lang||q.audio_lang||(/[\u0600-\u06FF]/.test(phrase)?'ar-SA':'tr-TR'));
  function showResult(text){
   transcript=String(text||'').trim();heard.classList.add('show');heard.classList.remove('good','warn');const b=heard.querySelector('b'),em=heard.querySelector('em');
   b.textContent=transcript||'Metin güvenilir biçimde çözümlenemedi.';
   if(transcript){recognitions++;const s=similarity(phrase,transcript);if(s>=.72){heard.classList.add('good');em.textContent='Çok yakın · güzel tekrar.'}else if(s>=.5){heard.classList.add('warn');em.textContent='İyi başlangıç · istersen bir kez daha dene.'}else{heard.classList.add('warn');em.textContent='Bir kez daha yavaş ve net tekrar etmeyi dene.'}}
   else em.textContent='Kaydını dinleyebilir veya tekrar deneyebilirsin.';
   retry.disabled=false;finish.disabled=false;
  }
  function finalize(){
   if(finalized)return;finalized=true;recording=false;micCard.classList.remove('recording');mic.textContent='●';mic.setAttribute('aria-label','Telaffuz kaydını başlat');micTitle.textContent='Denemen kaydedildi';attempted=true;haptic();
   try{if(recorder&&recorder.state!=='inactive')recorder.stop()}catch(_){}
   try{stream?.getTracks?.().forEach(t=>t.stop())}catch(_){}stream=null;
   setTimeout(()=>{if(!transcript)showResult('')},180);
  }
  async function start(){
   if(recording)return finalize();
   stopRef();finalized=false;transcript='';attempts++;heard.classList.remove('show','good','warn');retry.disabled=true;finish.disabled=true;if(userUrl){try{URL.revokeObjectURL(userUrl)}catch(_){}userUrl='';selfAudio.removeAttribute('src');selfAudio.classList.remove('show')}
   if(!navigator.mediaDevices?.getUserMedia){heard.classList.add('show','warn');heard.querySelector('b').textContent='Bu tarayıcı mikrofon kaydını desteklemiyor.';heard.querySelector('em').textContent='Başka bir güncel tarayıcıyla tekrar deneyebilirsin.';return}
   try{stream=await navigator.mediaDevices.getUserMedia({audio:true})}catch(err){heard.classList.add('show','warn');heard.querySelector('b').textContent='Mikrofon izni alınamadı.';heard.querySelector('em').textContent='Mikrofon iznini açıp tekrar deneyebilirsin.';console.error('DEEN pronunciation mic',err);return}
   recording=true;micCard.classList.add('recording');mic.textContent='■';mic.setAttribute('aria-label','Kaydı durdur');micTitle.textContent='Dinliyorum…';micSub.textContent='Bitirince mikrofona tekrar dokun.';
   if(window.MediaRecorder){try{chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data)};recorder.onstop=()=>{if(chunks.length){const blob=new Blob(chunks,{type:recorder?.mimeType||'audio/webm'});userUrl=URL.createObjectURL(blob);selfAudio.src=userUrl;selfAudio.classList.add('show')}};recorder.start()}catch(err){console.warn('DEEN pronunciation recorder',err)}}
   if(SR){try{recognizer=new SR();recognizer.lang=lang;recognizer.interimResults=true;recognizer.continuous=false;recognizer.maxAlternatives=1;recognizer.onresult=e=>{let txt='';for(let i=0;i<e.results.length;i++)txt+=e.results[i][0]?.transcript||'';transcript=txt.trim();if(transcript){heard.classList.add('show');heard.querySelector('b').textContent=transcript;heard.querySelector('em').textContent='Dinliyorum…'}};recognizer.onerror=e=>{console.warn('DEEN pronunciation recognition',e.error)};recognizer.onend=()=>{if(recording)finalize();if(transcript)showResult(transcript)};recognizer.start()}catch(err){console.warn('DEEN pronunciation recognition start',err)}}
   stopTimer=setTimeout(finalize,8000);
  }
  mic.onclick=start;retry.onclick=start;
  finish.onclick=()=>{
   if(!attempted)return;cleanupMic();completed++;finish.disabled=true;retry.disabled=true;
   try{completeQuestion(true,q)}catch(err){finish.disabled=false;retry.disabled=false;console.error('DEEN pronunciation complete',err);return}
   const ft=document.getElementById('feedbackTitle'),fb=document.getElementById('feedbackText');if(ft)ft.textContent='✓ TELAFFUZ PRATİĞİ TAMAMLANDI';if(fb)fb.textContent=transcript?'Sistem yaklaşık olarak “'+transcript+'” duydu. Bu geri bildirim pratik içindir; kesin telaffuz hükmü değildir.':'Sesli tekrarını yaptın. İstersen ileride bu ifadeyi yeniden çalışabilirsin.';
   try{document.dispatchEvent(new CustomEvent('deen:pronunciation:complete',{detail:{version:VERSION,id:q.id||'',attempts,recognized:!!transcript,language:lang}}))}catch(_){}
  };
  return true;
 }
 const oldRender=typeof renderQuestion==='function'?renderQuestion:null;
 if(oldRender&&!oldRender.__v861){const wrapped=function(...args){cleanup();document.querySelector('.question-frame')?.classList.remove('v861-pron-mode');const out=oldRender.apply(this,args);queueMicrotask(decorate);return out};wrapped.__v861=true;try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}}
 window.addEventListener('beforeunload',cleanup);
 window.DEEN_PRONUNCIATION_PRACTICE={version:VERSION,build:BUILD,eligible,decorate,practiceFirst:true,noPenalty:true,requiresApprovedReferenceAudio:true,check:()=>({version:VERSION,build:BUILD,ready:true,rounds,attempts,recognitions,completed,refPlays,speechRecognition:!!(window.SpeechRecognition||window.webkitSpeechRecognition),mediaRecorder:!!window.MediaRecorder,active:!!document.querySelector('.v861-pron-mode')})};
 document.documentElement.dataset.deenPronunciation='ready';
})();
<\/script>`;
 window.DEEN_PATCH_V861=function(html){let out=String(html);if(out.includes('deen-v861-pronunciation-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();