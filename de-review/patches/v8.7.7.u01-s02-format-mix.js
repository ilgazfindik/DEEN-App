(()=>{
 const VERSION='8.7.7-U01-S02-FORMAT-MIX',BUILD='877s02mix1';
 function runtime(){
  if(window.__deenV877U01S02FormatMix)return;window.__deenV877U01S02FormatMix=true;
  const VERSION='8.7.7-U01-S02-FORMAT-MIX',BUILD='877s02mix1',TARGET='U01-S02';
  const CHANGES={
   'DEEN-U01-S02-002':{
    type:'card',question_type:'card',activity_type:'card_choice',
    question_tr:'İman kavramını en iyi anlatan kartı seç.',
    options_tr:['Kalben inanmak ve kabul etmek','Yalnızca bir ibadeti düzenli yapmak','Sadece dinî bilgi okumak'],
    correct_answer:'Kalben inanmak ve kabul etmek'
   },
   'DEEN-U01-S02-004':{
    type:'scenario',question_type:'scenario',activity_type:'scenario',
    question_tr:'Bir arkadaşın “İbadetin amacı yalnızca toplumda saygı görmek midir?” diye soruyor. Bu bölüme göre en uygun cevap hangisi?',
    options_tr:['Hayır; ibadetin amacı Allah’a yakınlaşmak ve O’nun rızasını kazanmaya çalışmaktır.','Evet; temel amaç insanların takdirini kazanmaktır.','İbadetin belirli bir amacı yoktur.'],
    correct_answer:'Hayır; ibadetin amacı Allah’a yakınlaşmak ve O’nun rızasını kazanmaya çalışmaktır.'
   }
  };
  let attempts=0,applied=0,lastAudit=null;
  function bank(){let q=[];try{if(Array.isArray(QUESTIONS))q=QUESTIONS}catch(_){}if(!q.length&&Array.isArray(window.QUESTIONS))q=window.QUESTIONS;return Array.isArray(q)?q:null}
  function classify(q){try{return window.DEEN_LESSON_ORCHESTRATOR?.classify?.(q)||String(q?.type||q?.question_type||q?.activity_type||'unknown')}catch(_){return String(q?.type||q?.question_type||q?.activity_type||'unknown')}}
  function clone(v){return JSON.parse(JSON.stringify(v))}
  function applyOne(q,change){Object.assign(q,clone(change));delete q.pairs;delete q.correct_order;delete q.sequence;q.format_mix_version=VERSION;q.format_mix_build=BUILD}
  function audit(){
   const qs=(bank()||[]).filter(q=>String(q?.stage_id||q?.stageId||'')===TARGET),counts={};
   qs.forEach(q=>{const t=classify(q);counts[t]=(counts[t]||0)+1});
   const ordered=typeof window.DEEN_U01_FLOW_BALANCE?.plan==='function'?window.DEEN_U01_FLOW_BALANCE.plan(qs):qs;
   const types=ordered.map(classify);let immediateRepeats=0;
   for(let i=1;i<types.length;i++)if(types[i]===types[i-1])immediateRepeats++;
   const mcq=counts.mcq||0,total=qs.length,mcqRate=total?mcq/total:0;
   lastAudit={target:TARGET,total,counts,mcq,mcqRate:Number((mcqRate*100).toFixed(1)),immediateRepeats,types,pass:total>=20&&mcq<=4&&immediateRepeats===0};
   return clone(lastAudit);
  }
  function install(){
   attempts++;const qs=bank();if(!qs)return false;let n=0;
   Object.entries(CHANGES).forEach(([id,change])=>{const q=qs.find(x=>String(x?.id||'')===id);if(q){applyOne(q,change);n++}});
   applied=Math.max(applied,n);lastAudit=audit();
   document.documentElement.dataset.deenU01S02FormatMix=lastAudit.pass?'ready':'check';
   try{document.dispatchEvent(new CustomEvent('deen:u01-s02-format-mix',{detail:{version:VERSION,build:BUILD,...lastAudit}}))}catch(_){}
   return n===Object.keys(CHANGES).length;
  }
  [0,120,420,1000,2200].forEach(ms=>setTimeout(install,ms));
  window.DEEN_U01_S02_FORMAT_MIX={version:VERSION,build:BUILD,target:TARGET,changedIds:Object.keys(CHANGES),install,audit,check:()=>({version:VERSION,build:BUILD,attempts,applied,audit:audit()})};
 }
 const addition='<!-- DEEN v8.7.7 — U01 S02 Format Mix -->\n<script id="deen-v877-u01-s02-format-mix-runtime">('+runtime.toString()+')();<\\/script>';
 window.DEEN_PATCH_V877=function(html){let out=String(html);if(out.includes('deen-v877-u01-s02-format-mix-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
