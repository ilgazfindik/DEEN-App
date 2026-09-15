(()=>{
 const VERSION='8.7.8-U01-S03-FORMAT-MIX',BUILD='878s03mix1';
 function runtime(){
  if(window.__deenV878U01S03FormatMix)return;window.__deenV878U01S03FormatMix=true;
  const VERSION='8.7.8-U01-S03-FORMAT-MIX',BUILD='878s03mix1',TARGET='U01-S03';
  const CHANGES={
   'DEEN-U01-S03-004':{
    type:'card',question_type:'card',activity_type:'card_choice',
    question_tr:'İman ile ibadet arasındaki farkı doğru anlatan kartı seç.',
    options_tr:['İman inanç ve kabulle, ibadet ise Allah’a kulluk amacı taşıyan davranışlarla ilgilidir.','İman ve ibadet her durumda aynı kavramdır.','İman yalnızca bedensel hareketlerden oluşur.'],
    correct_answer:'İman inanç ve kabulle, ibadet ise Allah’a kulluk amacı taşıyan davranışlarla ilgilidir.'
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
   lastAudit={target:TARGET,total,counts,mcq,mcqRate:Number((mcqRate*100).toFixed(1)),immediateRepeats,types,pass:total>=19&&mcqRate<=.2&&immediateRepeats===0};
   return clone(lastAudit);
  }
  function install(){
   attempts++;const qs=bank();if(!qs)return false;let n=0;
   Object.entries(CHANGES).forEach(([id,change])=>{const q=qs.find(x=>String(x?.id||'')===id);if(q){applyOne(q,change);n++}});
   applied=Math.max(applied,n);lastAudit=audit();
   document.documentElement.dataset.deenU01S03FormatMix=lastAudit.pass?'ready':'check';
   try{document.dispatchEvent(new CustomEvent('deen:u01-s03-format-mix',{detail:{version:VERSION,build:BUILD,...lastAudit}}))}catch(_){}
   return n===Object.keys(CHANGES).length;
  }
  [0,120,420,1000,2200].forEach(ms=>setTimeout(install,ms));
  window.DEEN_U01_S03_FORMAT_MIX={version:VERSION,build:BUILD,target:TARGET,changedIds:Object.keys(CHANGES),install,audit,check:()=>({version:VERSION,build:BUILD,attempts,applied,audit:audit()})};
 }
 const addition='<!-- DEEN v8.7.8 — U01 S03 Format Mix -->\n<script id="deen-v878-u01-s03-format-mix-runtime">('+runtime.toString()+')();<\\/script>';
 window.DEEN_PATCH_V878=function(html){let out=String(html);if(out.includes('deen-v878-u01-s03-format-mix-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
