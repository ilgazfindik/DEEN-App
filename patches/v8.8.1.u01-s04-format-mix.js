(()=>{
 const VERSION='8.8.1-U01-S04-FORMAT-MIX',BUILD='881s04mix1';
 function runtime(){
  if(window.__deenV881U01S04FormatMix)return;window.__deenV881U01S04FormatMix=true;
  const VERSION='8.8.1-U01-S04-FORMAT-MIX',BUILD='881s04mix1',TARGET='U01-S04',MAX_SHARE=.25;
  let attempts=0,applied=0,lastAudit=null,changedIds=[];
  function bank(){let q=[];try{if(Array.isArray(QUESTIONS))q=QUESTIONS}catch(_){}if(!q.length&&Array.isArray(window.QUESTIONS))q=window.QUESTIONS;return Array.isArray(q)?q:null}
  function stage(q){return String(q?.stage_id||q?.stageId||'')}
  function classify(q){try{const t=window.DEEN_LESSON_ORCHESTRATOR?.classify?.(q);if(t)return t}catch(_){}const raw=String(q?.type||q?.question_type||q?.activity_type||'').toLowerCase();if(['multiple_choice','mcq','choice'].includes(raw))return'mcq';if(['card','card_choice','card_grid','large_card'].includes(raw))return'card';return raw||'unknown'}
  function baseQuestion(q){const m=String(q?.id||'').match(/^DEEN-U01-S04-(\d{3})$/);return !!m&&Number(m[1])<=16}
  function toCard(q){q.type='card';q.question_type='card';q.activity_type='card_choice';q.format_mix_version=VERSION;q.format_mix_build=BUILD}
  function audit(){
   const qs=(bank()||[]).filter(q=>stage(q)===TARGET),counts={};
   qs.forEach(q=>{const t=classify(q);counts[t]=(counts[t]||0)+1});
   const ordered=typeof window.DEEN_U01_FLOW_BALANCE?.plan==='function'?window.DEEN_U01_FLOW_BALANCE.plan(qs):qs;
   const types=ordered.map(classify);let immediateRepeats=0;for(let i=1;i<types.length;i++)if(types[i]===types[i-1])immediateRepeats++;
   const mcq=counts.mcq||0,total=qs.length,mcqRate=total?mcq/total:0;
   lastAudit={target:TARGET,total,counts,mcq,mcqRate:Number((mcqRate*100).toFixed(1)),maxSharePercent:MAX_SHARE*100,changedIds:[...changedIds],immediateRepeats,types,pass:total>0&&mcqRate<=MAX_SHARE&&immediateRepeats===0};
   return JSON.parse(JSON.stringify(lastAudit));
  }
  function install(){
   attempts++;const all=bank();if(!all)return false;
   const qs=all.filter(q=>stage(q)===TARGET),mcqs=qs.filter(q=>classify(q)==='mcq');
   if(!qs.length)return false;
   const maxClassic=Math.max(1,Math.floor(qs.length*MAX_SHARE));
   const nonBaseClassic=mcqs.filter(q=>!baseQuestion(q)).length;
   const keepBase=Math.max(0,maxClassic-nonBaseClassic);
   const baseClassic=mcqs.filter(baseQuestion).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
   const convert=baseClassic.slice(keepBase);
   convert.forEach(q=>{if(classify(q)==='mcq'){toCard(q);if(!changedIds.includes(String(q.id)))changedIds.push(String(q.id));applied++}});
   lastAudit=audit();document.documentElement.dataset.deenU01S04FormatMix=lastAudit.pass?'ready':'check';
   try{document.dispatchEvent(new CustomEvent('deen:u01-s04-format-mix',{detail:{version:VERSION,build:BUILD,...lastAudit}}))}catch(_){}
   setTimeout(()=>{try{window.DEEN_QUESTION_COVERAGE?.scan?.();window.DEEN_U01_FINAL_QA?.run?.()}catch(_){}},0);
   return lastAudit.pass;
  }
  [0,120,420,1000,2200].forEach(ms=>setTimeout(install,ms));
  window.DEEN_U01_S04_FORMAT_MIX={version:VERSION,build:BUILD,target:TARGET,maxShare:MAX_SHARE,install,audit,check:()=>({version:VERSION,build:BUILD,attempts,applied,changedIds:[...changedIds],audit:audit()})};
 }
 const addition='<!-- DEEN v8.8.1 — U01 S04 Format Mix -->\n<script id="deen-v881-u01-s04-format-mix-runtime">('+runtime.toString()+')();'+'</'+'script>';
 window.DEEN_PATCH_V881=function(html){let out=String(html);if(out.includes('deen-v881-u01-s04-format-mix-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
