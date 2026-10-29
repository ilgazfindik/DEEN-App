/* Sound design for the motion system. The engine's DEENSound keeps every call site, the sound
   setting (state.settings.sound) and its rules; only the sounds themselves are replaced: layered
   bell / pluck / thud voices with a short room and a compressor, synthesised in the browser (no
   audio files). Kinds the engine plays: click, correct (+2/+3), combo, combo3/5/7, wrong, review,
   complete, perfect, unlock, unit, section, gold, level, reward. Kinds the motion layer adds:
   select, pop, tick, stamp, pathUnlock. */
(()=>{
 'use strict';
 if(window.DEEN_DS_SOUND)return;
 const appState=()=>{try{return state||{}}catch(_){return{}}};

 // One audible engine. The app grew several legacy synth engines (the original DEENSound, the
 // v6.2.1 game-feel layer, v7.3.3 SFX, the toddler playSound) that each open their own
 // AudioContext and would play over these sounds. Every AudioContext created after this point,
 // except ours, keeps working but outputs to a muted node. Recitation and letter audio use <audio>
 // elements and speech uses speechSynthesis, so they are not affected.
 const NativeAC=window.AudioContext||window.webkitAudioContext;
 if(NativeAC&&!NativeAC.__dsMuted){
  class LegacyAC extends NativeAC{
   constructor(...args){
    super(...args);
    try{const mute=super.createGain();mute.gain.value=0;mute.connect(super.destination);Object.defineProperty(this,'destination',{value:mute,configurable:true})}catch(_){}
   }
  }
  LegacyAC.__dsMuted=true;
  try{if(window.AudioContext)window.AudioContext=LegacyAC;if(window.webkitAudioContext)window.webkitAudioContext=LegacyAC}catch(_){}
 }
 const enabled=()=>!!appState().settings?.sound&&!document.hidden;

 // ---- Audio graph: voices → bus → (dry + room) → compressor → master ----
 let ctx=null,bus=null,master=null,room=null;
 function ensure(){
  if(ctx)return ctx;
  if(!NativeAC)return null;
  ctx=new NativeAC();
  master=ctx.createGain();master.gain.value=.6;
  const comp=ctx.createDynamicsCompressor();comp.threshold.value=-20;comp.knee.value=12;comp.ratio.value=4;comp.attack.value=.003;comp.release.value=.18;
  comp.connect(master);master.connect(ctx.destination);
  bus=ctx.createGain();bus.connect(comp);
  // A short generated room: decaying noise, mixed in softly for depth.
  room=ctx.createConvolver();
  const len=Math.floor(ctx.sampleRate*1.1),ir=ctx.createBuffer(2,len,ctx.sampleRate);
  for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)}
  room.buffer=ir;const wet=ctx.createGain();wet.gain.value=.16;bus.connect(room);room.connect(wet);wet.connect(comp);
  return ctx;
 }
 function resume(){try{const c=ensure();if(c&&c.state==='suspended')c.resume().catch(()=>{})}catch(_){}}
 // Browsers only start audio after a gesture.
 for(const type of ['pointerdown','keydown','touchstart'])document.addEventListener(type,()=>{if(enabled())resume()},{capture:true,passive:true});

 const env=(g,t,peak,attack,dur)=>{g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+dur)};
 const osc=(type,f,t,dur)=>{const o=ctx.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);o.start(t);o.stop(t+dur+.05);return o};
 // Bell: fundamental, octave and a faint inharmonic shimmer — the "ding" of a correct answer.
 function bell(f,at,dur=.45,vol=.22){
  const t=ctx.currentTime+at,out=ctx.createGain();out.connect(bus);env(out,t,vol,.004,dur);
  for(const [ratio,amp,type] of [[1,1,'sine'],[2,.32,'sine'],[3.01,.1,'triangle']]){
   const g=ctx.createGain();g.gain.value=amp;osc(type,f*ratio,t,dur).connect(g);g.connect(out);
  }
 }
 // Pluck: a soft triangle with a closing low-pass — taps, picks, pops.
 function pluck(f,at,dur=.12,vol=.14){
  const t=ctx.currentTime+at,g=ctx.createGain(),lp=ctx.createBiquadFilter();lp.type='lowpass';
  lp.frequency.setValueAtTime(4200,t);lp.frequency.exponentialRampToValueAtTime(900,t+dur);
  osc('triangle',f,t,dur).connect(lp);lp.connect(g);g.connect(bus);env(g,t,vol,.003,dur);
 }
 // Thud: a falling, muffled sine — a gentle "not quite", never harsh.
 function thud(f,at,dur=.22,vol=.26){
  const t=ctx.currentTime+at,g=ctx.createGain(),lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=900;
  const o=osc('sine',f,t,dur);o.frequency.exponentialRampToValueAtTime(f*.72,t+dur);o.connect(lp);lp.connect(g);g.connect(bus);env(g,t,vol,.006,dur);
 }
 // Whoosh: filtered noise sweeping up — unlocks and big moments.
 let noise=null;
 function whoosh(at,dur=.32,vol=.09,from=500,to=3200){
  if(!noise){noise=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const d=noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  const t=ctx.currentTime+at,src=ctx.createBufferSource(),bp=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=noise;
  bp.type='bandpass';bp.Q.value=1.4;bp.frequency.setValueAtTime(from,t);bp.frequency.exponentialRampToValueAtTime(to,t+dur);
  src.connect(bp);bp.connect(g);g.connect(bus);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+dur*.45);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  src.start(t);src.stop(t+dur+.05);
 }
 // Sparkle: a few tiny, quick high bells.
 function sparkle(at,n=5,vol=.05){for(let i=0;i<n;i++)bell(1800+Math.random()*2200,at+i*.045,.22,vol)}

 // Note helpers (Hz).
 const N={C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99,A5:880,B5:987.77,C6:1046.5,D6:1174.66,E6:1318.51,G6:1567.98,A6:1760,C7:2093};
 const up=(f,semis)=>f*Math.pow(2,semis/12);
 let streak=0,streakAt=0;
 const SOUNDS={
  click:()=>pluck(1250,0,.04,.07),
  select:()=>pluck(N.A5,0,.09,.11),
  pop:()=>{pluck(N.E6,0,.08,.12);pluck(N.A6,.03,.08,.06)},
  tick:()=>pluck(up(N.C7,Math.random()*2),0,.035,.035),
  // Correct answers climb a little with each consecutive one (reset after a pause or a miss).
  correct:()=>{const now=Date.now();streak=now-streakAt<9000?Math.min(streak+1,4):0;streakAt=now;const s=[0,2,4,5,7][streak];
   bell(up(N.C6,s),0,.42,.2);bell(up(N.E6,s),.075,.55,.2);sparkle(.12,3,.03)},
  wrong:()=>{streak=0;thud(311.13,0,.2,.24);thud(233.08,.11,.26,.22)},
  review:()=>{bell(N.G5,0,.4,.12);bell(N.E5,.1,.5,.12)},
  combo3:()=>{SOUNDS.correct();[N.G6,N.C7].forEach((f,i)=>bell(f,.2+i*.07,.4,.1));sparkle(.32,5,.04)},
  combo5:()=>{SOUNDS.correct();[N.E6,N.G6,N.C7].forEach((f,i)=>bell(f,.18+i*.06,.45,.11));whoosh(.15,.35,.05);sparkle(.36,7,.045)},
  combo7:()=>{SOUNDS.correct();[N.E6,N.G6,N.A6,N.C7].forEach((f,i)=>bell(f,.16+i*.055,.5,.12));whoosh(.12,.4,.07);sparkle(.38,9,.05)},
  complete:()=>{[N.C5,N.E5,N.G5].forEach((f,i)=>bell(f,i*.09,.5,.16));[N.C6,N.E6,N.G6].forEach(f=>bell(f,.3,1.1,.1));sparkle(.42,6,.04)},
  perfect:()=>{[N.C5,N.E5,N.G5,N.C6].forEach((f,i)=>bell(f,i*.085,.5,.16));[N.E6,N.G6,N.C7].forEach(f=>bell(f,.38,1.3,.1));whoosh(.3,.45,.06);sparkle(.5,10,.045)},
  unlock:()=>{whoosh(0,.36,.08);[N.G5,N.C6,N.E6,N.G6].forEach((f,i)=>bell(f,.08+i*.06,.45,.13));sparkle(.34,6,.04)},
  pathUnlock:()=>{whoosh(0,.3,.05);[N.C6,N.E6,N.G6].forEach((f,i)=>bell(f,.06+i*.07,.5,.11));sparkle(.3,4,.035)},
  stamp:()=>{thud(196,0,.12,.18);pluck(N.G5,.03,.1,.1)},
  reward:()=>{bell(N.B5,0,.3,.14);bell(up(N.E6,2),.08,.5,.14);sparkle(.14,5,.045)},
  snap:()=>{pluck(N.E6,0,.07,.13);bell(N.A6,.04,.3,.08)},
  softWrong:()=>thud(277.18,0,.16,.16),
  chest:()=>{thud(130.81,0,.26,.3);whoosh(.06,.4,.07,300,2400);[N.C6,N.E6,N.G6,N.C7].forEach((f,i)=>bell(f,.2+i*.06,.45,.1));sparkle(.42,9,.05)},
  level:()=>{[N.C5,N.G5,N.C6,N.E6].forEach((f,i)=>bell(f,i*.1,.6,.15));sparkle(.45,8,.045)},
  unit:()=>{[N.G5,N.B5,N.D6,N.G6].forEach((f,i)=>bell(f,i*.11,.7,.16));[N.G5,N.D6,N.G6].forEach(f=>bell(f,.48,1.5,.09));whoosh(.4,.5,.06);sparkle(.6,10,.045)},
  section:()=>{[N.C5,N.E5,N.G5,N.C6,N.E6].forEach((f,i)=>bell(f,i*.12,.7,.16));[N.C6,N.E6,N.G6,N.C7].forEach(f=>bell(f,.62,1.7,.08));whoosh(.5,.6,.07);sparkle(.75,12,.05)},
  gold:()=>{[N.A5,up(N.C6,1),N.E6,N.A6].forEach((f,i)=>bell(f,i*.1,.7,.16));[N.A5,N.E6,N.A6].forEach(f=>bell(f,.45,1.6,.09));sparkle(.55,12,.05)}
 };
 SOUNDS.combo=SOUNDS.combo3;SOUNDS.correct2=SOUNDS.correct;SOUNDS.correct3=SOUNDS.correct;

 // Same rules as the engine: no sound when the setting is off or the app is hidden, and a click
 // or repeat right after another sound is dropped.
 let lastAt=-Infinity,lastKind='';
 function play(kind='click'){
  if(!enabled())return false;
  const now=Date.now();
  if(now-lastAt<65&&(kind==='click'||kind==='tick'||kind===lastKind))return false;
  if(kind==='click'&&now-lastAt<160)return false;
  lastAt=now;lastKind=kind;
  const fn=SOUNDS[kind]||SOUNDS.reward;
  try{const c=ensure();if(!c)return false;
   if(c.state==='suspended'){c.resume().then(()=>{try{fn()}catch(_){}}).catch(()=>{});return true}
   fn();return true}catch(_){return false}
 }
 function stop(){try{if(master&&ctx){const t=ctx.currentTime;master.gain.cancelScheduledValues(t);master.gain.setTargetAtTime(.0001,t,.03);setTimeout(()=>{if(master)master.gain.setTargetAtTime(.6,ctx.currentTime,.05)},400)}}catch(_){}}

 function install(){
  const S=window.DEENSound;
  if(!S){setTimeout(install,300);return}
  if(S.__dsSound)return;
  const base={play:S.play,stop:S.stop};
  S.play=play;
  S.stop=()=>{stop();try{base.stop?.()}catch(_){}};
  S.settingsChanged=()=>{if(!enabled())S.stop()};
  S.__dsSound=true;
 }
 install();

 // The micro sounds the v7.3.3 layer played from its own (now muted) engine, on the same events:
 // choosing an answer, a matched / mismatched pair, dropping a sequence block, opening a chest.
 const sfx=kind=>{try{window.DEENSound?.play?.(kind)}catch(_){}};
 document.addEventListener('click',e=>{
  const el=e.target.closest?.('#answerArea .v710-word-chip,#answerArea .v710-decision,#answerArea .v710-clue,#answerArea .v710-listen-option,#answerArea .v710-binary button,#answerArea .fill-choice,#answerArea .option,#answerArea .v858-odd-card');
  if(el&&!el.disabled)sfx('select');
  const chest=e.target.closest?.('[data-v670-open],.v670-open-btn,.v670-chest-card button,#v670ChestOpen');
  if(chest&&!chest.disabled)sfx('chest');
 },{capture:true});
 document.addEventListener('drop',e=>{if(e.target.closest?.('.v710-builder-piece,.v710-builder-zone'))sfx('snap')},{capture:true});
 const watchMatches=()=>{
  const lesson=document.getElementById('lesson');if(!lesson){setTimeout(watchMatches,300);return}
  new MutationObserver(records=>{
   for(const r of records){
    const el=r.target;if(!el.classList?.contains('v710-match-card'))continue;
    const had=String(r.oldValue||'').split(/\s+/);
    if(el.classList.contains('matched')&&!had.includes('matched'))sfx('snap');
    else if(el.classList.contains('error')&&!had.includes('error'))sfx('softWrong');
   }
  }).observe(lesson,{subtree:true,attributes:true,attributeFilter:['class'],attributeOldValue:true});
 };
 watchMatches();
 window.DEEN_DS_SOUND=Object.freeze({version:'ds-sound-1',play,kinds:Object.keys(SOUNDS)});
})();
