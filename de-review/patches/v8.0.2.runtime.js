(()=>{
 if(window.__deenV802Applied)return;window.__deenV802Applied=true;
 const VERSION='8.0.2',STATE_VERSION=68;
 window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.0.2 — Stable Progress Card Hotfix';
 const PROG=window.DEEN_WORLD_PROGRESSION;
 if(!PROG)return;
 let lastSig='',timer=0;
 function worldHome(){return !!document.querySelector('#worldScreenBody .v750-world')}
 function snap(){try{return PROG.snapshot?.()||{}}catch(e){return{}}}
 function levelTitle(){try{return PROG.level?.()?.title||'Başlangıç'}catch(e){return'Başlangıç'}}
 function nextMin(s){const next=Number(s?.next)||0;if(!next)return null;const levels=s?.balance?.levels||[];return Number(levels.find(x=>Number(x.n)===next)?.min)||null}
 function data(){
   const s=snap(),tasks=Array.isArray(s.tasks)?s.tasks:[],done=tasks.filter(x=>x?.done).length,pending=Math.max(0,Number(s.pending)||0),nur=Math.max(0,Number(s.nur)||0),level=Math.max(1,Number(s.level)||1),next=nextMin(s);
   const levels=s?.balance?.levels||[],curMin=Number(levels.find(x=>Number(x.n)===level)?.min)||0;
   const pct=next==null?100:Math.max(0,Math.min(100,((nur-curMin)/Math.max(1,next-curMin))*100));
   return{nur,level,next,done,pending,pct,title:levelTitle()};
 }
 function mount(){
   const body=document.getElementById('worldScreenBody');if(!body||!worldHome())return null;
   let el=body.querySelector('.v802-progress-strip');
   if(el)return el;
   el=document.createElement('button');el.type='button';el.className='v802-progress-strip';el.setAttribute('aria-label','Oda Yolculuğu detayları');
   el.innerHTML='<span class="v802-level-badge">ODA<br><b>LV 1</b></span><span class="v802-progress-copy"><b class="v802-title">Başlangıç</b><small class="v802-meta">✦ 0 NUR · 0/3 günlük görev</small></span><span class="v802-progress-side">DETAY ›</span><span class="v802-progress-bar"><i></i></span>';
   el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();try{PROG.open?.()}catch(err){}});
   const q=body.querySelector('.v780-quickbar'),legacy=body.querySelector('.v784-progress-strip');
   if(legacy)legacy.insertAdjacentElement('afterend',el);else if(q)q.insertAdjacentElement('afterend',el);else body.querySelector('.v750-world')?.prepend(el);
   return el;
 }
 function render(force=false){
   const el=mount();if(!el)return false;
   const d=data(),sig=JSON.stringify([d.level,d.nur,d.next,d.done,d.pending,Math.round(d.pct*10),d.title]);
   if(!force&&sig===lastSig)return true;lastSig=sig;
   const badge=el.querySelector('.v802-level-badge b'),title=el.querySelector('.v802-title'),meta=el.querySelector('.v802-meta'),side=el.querySelector('.v802-progress-side'),bar=el.querySelector('.v802-progress-bar i');
   if(badge&&badge.textContent!=='LV '+d.level)badge.textContent='LV '+d.level;
   if(title&&title.textContent!==d.title)title.textContent=d.title;
   const metaText='✦ '+d.nur+(d.next!=null?' / '+d.next:'')+' NUR · '+d.done+'/3 günlük görev';if(meta&&meta.textContent!==metaText)meta.textContent=metaText;
   const sideText=d.pending?d.pending+' ÖDÜL':'DETAY ›';if(side&&side.textContent!==sideText)side.textContent=sideText;side?.classList.toggle('reward',!!d.pending);
   const w=d.pct.toFixed(1)+'%';if(bar&&bar.style.width!==w)bar.style.width=w;
   el.dataset.v802Sig=sig;return true;
 }
 function schedule(ms=80){clearTimeout(timer);timer=setTimeout(()=>render(false),ms)}
 document.addEventListener('click',e=>{if(e.target.closest?.('.navbtn[data-screen="worldScreen"],#worldScreenBody [data-v792-daily],#worldScreenBody [data-v792-level],#worldScreenBody [data-v788-buy],#worldScreenBody [data-v790-apply]'))schedule(180)},true);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(120)});window.addEventListener('pageshow',()=>schedule(140));window.addEventListener('focus',()=>schedule(160));
 const obs=new MutationObserver(ms=>{if(!worldHome())return;const el=document.querySelector('#worldScreenBody .v802-progress-strip');if(!el){schedule(40);return}for(const m of ms){if(m.target===el||m.target?.closest?.('.v802-progress-strip'))continue;if(m.type==='childList'&&m.target?.closest?.('#worldScreenBody')){schedule(90);break}}});
 obs.observe(document.body,{childList:true,subtree:true});
 const interval=setInterval(()=>{if(worldHome())render(false)},700);
 state.stateVersion=Math.max(STATE_VERSION,Number(state.stateVersion)||0);try{saveState?.()}catch(e){}
 window.DEEN_WORLD_PROGRESS_STABLE={version:VERSION,stateVersion:STATE_VERSION,render:()=>render(true),snapshot:()=>({version:VERSION,...data(),mounted:!!document.querySelector('#worldScreenBody .v802-progress-strip'),legacyHidden:!!document.querySelector('#worldScreenBody .v784-progress-strip')}),stop:()=>clearInterval(interval)};
 setTimeout(()=>render(true),900);
})();
