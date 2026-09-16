(()=>{
 const VERSION='8.8.4-REVIEW-PHASE-UX',BUILD='884reviewux1';
 const addition=`<!-- DEEN v8.8.4 — Wrong Review Phase UX -->
<style id="deen-v884-review-ux-css">
.v884-review-banner{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 12px;padding:10px 12px;border:1px solid rgba(235,199,105,.25);border-radius:16px;background:linear-gradient(180deg,rgba(47,43,25,.76),rgba(20,34,34,.84));box-shadow:inset 0 1px rgba(255,255,255,.025),0 8px 20px rgba(0,0,0,.12);color:#eef7f4}
.v884-review-copy{min-width:0}.v884-review-kicker{font:950 7px/1 Inter,system-ui,sans-serif;letter-spacing:1.1px;color:#d9bd68;text-transform:uppercase}.v884-review-title{margin-top:4px;font:850 12px/1.25 Inter,system-ui,sans-serif;color:#f4f7ee}.v884-review-count{flex:0 0 auto;min-width:58px;padding:7px 9px;border-radius:999px;border:1px solid rgba(119,218,190,.22);background:rgba(14,60,57,.72);color:#a5e7d3;font:900 8px/1 Inter,system-ui,sans-serif;text-align:center;letter-spacing:.3px}
.v884-review-toast{position:absolute;z-index:40;left:50%;top:88px;transform:translate(-50%,-8px) scale(.96);width:min(86%,330px);padding:12px 14px;border:1px solid rgba(235,199,105,.29);border-radius:18px;background:linear-gradient(180deg,rgba(47,42,24,.98),rgba(12,35,37,.98));box-shadow:0 16px 38px rgba(0,0,0,.34);text-align:center;pointer-events:none;opacity:0;animation:v884ReviewToast 1550ms ease both}
.v884-review-toast b{display:block;color:#f0d982;font:950 11px/1.15 Inter,system-ui,sans-serif;letter-spacing:.2px}.v884-review-toast span{display:block;margin-top:5px;color:#b9cfca;font:750 9px/1.35 Inter,system-ui,sans-serif}
@keyframes v884ReviewToast{0%{opacity:0;transform:translate(-50%,-10px) scale(.95)}18%,72%{opacity:1;transform:translate(-50%,0) scale(1)}100%{opacity:0;transform:translate(-50%,-4px) scale(.98)}}
@media(max-width:390px){.v884-review-banner{padding:9px 10px;border-radius:14px}.v884-review-title{font-size:11px}.v884-review-count{min-width:52px;padding:6px 8px}}
@media(prefers-reduced-motion:reduce){.v884-review-toast{animation:none!important;opacity:1}}
</style>
<script id="deen-v884-review-ux-runtime">
(()=>{
 if(window.__deenV884ReviewUX)return;window.__deenV884ReviewUX=true;
 const VERSION='8.8.4-REVIEW-PHASE-UX',BUILD='884reviewux1',RETRY='__deenReviewRetry';
 let entries=0,announcements=0,last=null;
 function getSession(){let s=null;try{s=session}catch(_){try{s=window.session}catch(__){}}return s}
 function current(){const s=getSession();return s?.questions?.[Number(s?.index)||0]||null}
 function masteryState(){try{return window.DEEN_WRONG_REVIEW_MASTERY?.state?.()||null}catch(_){return null}}
 function remove(){document.querySelectorAll('.v884-review-banner,.v884-review-toast').forEach(x=>x.remove());document.querySelector('.question-frame')?.classList.remove('v884-review-mode')}
 function toast(frame,pending){
   if(!frame)return;frame.querySelector('.v884-review-toast')?.remove();
   const el=document.createElement('div');el.className='v884-review-toast';
   el.innerHTML='<b>Yanlışlarını pekiştiriyoruz</b><span>Dersi baştan almıyorsun · sadece kaçırdığın '+pending+' soru tekrar geliyor.</span>';
   frame.append(el);announcements++;setTimeout(()=>el.remove(),1650)
 }
 function decorate(){
   const s=getSession(),q=current(),frame=document.querySelector('.question-frame');
   document.querySelectorAll('.v884-review-banner').forEach(x=>x.remove());
   if(!s||!q||!q[RETRY]||!frame){frame?.classList.remove('v884-review-mode');return false}
   frame.classList.add('v884-review-mode');entries++;
   const st=masteryState(),pending=Math.max(1,Number(st?.pending)||1);
   const banner=document.createElement('div');banner.className='v884-review-banner';
   banner.innerHTML='<div class="v884-review-copy"><div class="v884-review-kicker">PEKİŞTİRME TURU</div><div class="v884-review-title">Yanlış yaptığın soruları tamamlıyoruz.</div></div><div class="v884-review-count">'+pending+' KALDI</div>';
   const anchor=frame.querySelector('.qtype')||document.getElementById('qType')||frame.firstElementChild;
   if(anchor?.parentNode===frame)frame.insertBefore(banner,anchor);else frame.prepend(banner);
   if(!s.__v884ReviewAnnounced){s.__v884ReviewAnnounced=true;toast(frame,pending)}
   last={at:Date.now(),pending,id:String(q?.id||q?.question_id||'')};
   try{document.dispatchEvent(new CustomEvent('deen:review-ux:shown',{detail:{version:VERSION,build:BUILD,...last}}))}catch(_){}
   return true
 }
 function wrapRender(){
   const old=typeof renderQuestion==='function'?renderQuestion:window.renderQuestion;
   if(typeof old!=='function'||old.__v884ReviewUX)return false;
   const wrapped=function(...args){const out=old.apply(this,args);queueMicrotask(decorate);return out};
   wrapped.__v884ReviewUX=true;wrapped.__v884Original=old;
   try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
   return true
 }
 function install(){
   const ok=wrapRender();
   if(!ok){let tries=0;const timer=setInterval(()=>{tries++;if(wrapRender()||window.renderQuestion?.__v884ReviewUX||tries>20)clearInterval(timer)},120)}
   document.addEventListener('deen:wrong-review:mastered',()=>remove());
   document.documentElement.dataset.deenReviewUX='ready';
 }
 window.DEEN_REVIEW_PHASE_UX={version:VERSION,build:BUILD,decorate,check:()=>({version:VERSION,build:BUILD,ready:true,entries,announcements,last,active:!!document.querySelector('.v884-review-banner'),renderWrapped:!!window.renderQuestion?.__v884ReviewUX})};
 install();
})();
<\/script>`;
 window.DEEN_PATCH_V884=function(html){let out=String(html);if(out.includes('deen-v884-review-ux-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
