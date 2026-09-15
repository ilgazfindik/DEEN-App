(()=>{
 const VERSION='8.7.6-U01-S01-FORMAT-MIX',BUILD='876s01mix1';
 function runtime(){
  if(window.__deenV876U01S01FormatMix)return;window.__deenV876U01S01FormatMix=true;
  const VERSION='8.7.6-U01-S01-FORMAT-MIX',BUILD='876s01mix1',TARGET='U01-S01';
  const CHANGES={
   'DEEN-U01-S01-001':{
    type:'card',question_type:'card',activity_type:'card_choice',
    question_tr:'İslam’ın temelindeki fikri en iyi hangi kart anlatır?',
    options_tr:['Allah’a teslimiyeti ve O’nun rehberliğini benimsemek','Yalnızca belirli ibadetlerin adını öğrenmek','Sadece belirli bir kültüre ait olmak'],
    correct_answer:'Allah’a teslimiyeti ve O’nun rehberliğini benimsemek'
   },
   'DEEN-U01-S01-003':{
    type:'match',question_type:'match',activity_type:'matching',
    question_tr:'İman, ibadet ve ahlakı doğru açıklamalarla eşleştir.',
    pairs:[
     {left:'İman',right:'İnanç ve kabul'},
     {left:'İbadet',right:'Allah’a kulluk'},
     {left:'Ahlak',right:'Davranış ve tutumlar'}
    ]
   },
   'DEEN-U01-S01-004':{
    type:'card',question_type:'card',activity_type:'card_choice',
    question_tr:'“Müslüman” denince hangi kart doğru tanımı verir?',
    options_tr:['Allah’a inanan ve İslam’ın öğretilerini benimseyen kişi','Sadece belirli bir ülkede doğan kişi','Sadece Arapça konuşan kişi'],
    correct_answer:'Allah’a inanan ve İslam’ın öğretilerini benimseyen kişi'
   },
   'DEEN-U01-S01-007':{
    type:'scenario',question_type:'scenario',activity_type:'scenario',
    question_tr:'Bir arkadaşın “İman, ibadet ve ahlak birbirinden tamamen ayrı şeylerdir.” diyor. Bu bölüme göre en uygun cevap hangisi?',
    options_tr:['Bu üç alan birbiriyle bağlantılı bir yaşam anlayışı oluşturur.','Evet; aralarında hiçbir bağlantı yoktur.','Yalnızca ahlak önemlidir; diğer ikisi ayrı kalır.'],
    correct_answer:'Bu üç alan birbiriyle bağlantılı bir yaşam anlayışı oluşturur.'
   },
   'DEEN-U01-S01-008':{
    type:'fill_blank',question_type:'fill_blank',activity_type:'fill_blank',
    question_tr:'Boşluğu tamamla: Kalben inanma ve kabul etme, bu bölümde ___ kavramını anlatır.',
    options_tr:['iman','ibadet','ahlak','rehberlik'],
    correct_answer:'iman'
   },
   'DEEN-U01-S01-012':{
    type:'card',question_type:'card',activity_type:'card_choice',
    question_tr:'Kur’an’ın Müslümanlar için yerini doğru anlatan kartı seç.',
    options_tr:['Müslümanların temel kutsal kitabı','Yalnızca tarih olaylarını anlatan bir kitap','Sadece ibadet adımlarını sıralayan bir el kitabı'],
    correct_answer:'Müslümanların temel kutsal kitabı'
   }
  };
  let attempts=0,applied=0,lastAudit=null;
  function bank(){let q=[];try{if(Array.isArray(QUESTIONS))q=QUESTIONS}catch(_){}if(!q.length&&Array.isArray(window.QUESTIONS))q=window.QUESTIONS;return Array.isArray(q)?q:null}
  function classify(q){try{return window.DEEN_LESSON_ORCHESTRATOR?.classify?.(q)||String(q?.type||q?.question_type||q?.activity_type||'unknown')}catch(_){return String(q?.type||q?.question_type||q?.activity_type||'unknown')}}
  function clone(v){return JSON.parse(JSON.stringify(v))}
  function applyOne(q,change){
   Object.assign(q,clone(change));
   if(change.pairs){delete q.options_tr;delete q.options;delete q.correct_answer;delete q.answer}
   q.format_mix_version=VERSION;q.format_mix_build=BUILD;
  }
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
   document.documentElement.dataset.deenU01S01FormatMix=lastAudit.pass?'ready':'check';
   try{document.dispatchEvent(new CustomEvent('deen:u01-s01-format-mix',{detail:{version:VERSION,build:BUILD,...lastAudit}}))}catch(_){}
   return n===Object.keys(CHANGES).length;
  }
  [0,120,420,1000,2200].forEach(ms=>setTimeout(install,ms));
  window.DEEN_U01_S01_FORMAT_MIX={version:VERSION,build:BUILD,target:TARGET,changedIds:Object.keys(CHANGES),install,audit,check:()=>({version:VERSION,build:BUILD,attempts,applied,audit:audit()})};
 }
 const addition='<!-- DEEN v8.7.6 — U01 S01 Format Mix -->\n<script id="deen-v876-u01-s01-format-mix-runtime">('+runtime.toString()+')();<\\/script>';
 window.DEEN_PATCH_V876=function(html){let out=String(html);if(out.includes('deen-v876-u01-s01-format-mix-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
