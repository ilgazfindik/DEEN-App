/* "What's waiting tomorrow" teaser.
   When today's Daily Journey is complete, the Home next-step card says what tomorrow opens (the next lesson,
   and a streak reward if tomorrow reaches a milestone), so closing the app feels like an unfinished story, not an end.
   Read-only: uses DEEN_DAILY_JOURNEY.status() and the already-localised path DOM; never writes learner state. */
(()=>{
 'use strict';
 if(window.DEEN_TOMORROW)return;
 const MILESTONES=[3,7,14,30,50,100,365];
 const S={
  tr:{k:'YARIN SENİ BEKLİYOR',streak:n=>'Yarın serin '+n+'. güne ulaşacak',gift:n=>'🎁 '+n+'. gün ödülün yarın seni bekliyor!',cont:'Bugünlük bu kadar. Yarın kaldığın yerden devam edeceksin.'},
  en:{k:'WAITING FOR YOU TOMORROW',streak:n=>'Tomorrow your streak reaches day '+n,gift:n=>'🎁 Your day-'+n+' reward is waiting tomorrow!',cont:'That is it for today. Tomorrow you pick up right where you stopped.'},
  de:{k:'MORGEN WARTET AUF DICH',streak:n=>'Morgen erreicht deine Serie Tag '+n,gift:n=>'🎁 Deine Belohnung für Tag '+n+' wartet morgen auf dich!',cont:'Das war’s für heute. Morgen machst du genau da weiter, wo du aufgehört hast.'},
  fr:{k:'DEMAIN T’ATTEND',streak:n=>'Demain, ta série atteindra le jour '+n,gift:n=>'🎁 Ta récompense du jour '+n+' t’attend demain !',cont:'C’est tout pour aujourd’hui. Demain, tu reprends exactement où tu t’es arrêté.'},
  ar:{k:'ينتظرك غدًا',streak:n=>'غدًا تبلغ سلسلتك اليوم '+n,gift:n=>'🎁 مكافأة اليوم '+n+' تنتظرك غدًا!',cont:'هذا كل شيء لهذا اليوم. غدًا تكمل من حيث توقفت.'}
 };
 const lang=()=>window.DEEN_APP_LOCALE?.get?.()||'tr';
 const T=()=>S[lang()]||S.en;
 const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const app=()=>{try{return typeof state!=='undefined'&&state&&state.streakMeta?state:null}catch(_){return null}};
 const journey=()=>{try{return window.DEEN_DAILY_JOURNEY?.status?.()||null}catch(_){return null}};

 // The path already shows the next stage in the learner's language; reuse that text instead of re-translating.
 function nextStageText(next){
  const id=next?.macroId;if(!id)return null;
  const node=document.getElementById('slot-'+id)?.getAttribute('aria-label')||'';
  const parts=node.split(' · ');
  if(parts[0]&&parts.length>=2)return {title:parts[0].trim(),role:(parts[1]||'').trim()};
  return lang()==='tr'&&next.title?{title:next.title,role:next.role||''}:null;
 }
 function inject(){
  const card=document.querySelector('#v5Return .v680-nba'),st=journey(),app_=app();
  const old=card?.querySelector(':scope>.dst');
  if(!card||!st||!st.complete||!st.nextLearning||!app_){old?.remove();return}
  const info=nextStageText(st.nextLearning);if(!info){old?.remove();return}
  const t=T(),n=(Number(app_.streakMeta.currentStreak)||0)+1;
  const hook=MILESTONES.includes(n)?t.gift(n):(n>=2?t.streak(n):t.cont);
  const sig=info.title+'|'+info.role+'|'+hook+'|'+lang();
  if(old&&old.dataset.sig===sig)return;
  old?.remove();
  const box=document.createElement('div');box.className='dst';box.dataset.sig=sig;box.dir=lang()==='ar'?'rtl':'ltr';
  box.innerHTML='<div class="dst-k">'+esc(t.k)+'</div><div class="dst-t">'+esc(info.title)+(info.role?' <span>'+esc(info.role)+'</span>':'')+'</div><div class="dst-h">'+esc(hook)+'</div>';
  const cta=card.querySelector('.v680-main');
  if(cta)cta.before(box);else card.append(box);
 }
 let queued=false,obs=null;
 const schedule=()=>{if(queued)return;queued=true;setTimeout(()=>{queued=false;try{inject()}catch(_){}},0)};
 function watch(){
  const host=document.getElementById('v5Return');
  if(host&&!obs){obs=new MutationObserver(schedule);obs.observe(host,{childList:true,subtree:true})}
  try{inject()}catch(_){}
 }
 const start=()=>setInterval(watch,1500);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 const st=document.createElement('style');
 st.textContent='#v5Return .dst{margin:2px 0 12px;padding:11px 13px;border-radius:14px;background:rgba(238,210,143,.10);border:1px solid rgba(238,210,143,.32);display:grid;gap:3px}#v5Return .dst-k{font-size:9px;letter-spacing:1.2px;font-weight:900;color:#e5cf96}#v5Return .dst-t{font-size:16px;font-weight:850;line-height:1.25}#v5Return .dst-t span{font-size:10px;font-weight:800;opacity:.7;margin-inline-start:6px;letter-spacing:.8px}#v5Return .dst-h{font-size:12px;opacity:.85;line-height:1.4}';
 document.head.appendChild(st);
 window.DEEN_TOMORROW=Object.freeze({refresh:inject,version:'tomorrow-v1'});
})();
