(()=>{
 const VERSION='8.7.2-U01-MOBILE-READABILITY-QA',BUILD='872mobile1';
 const addition=`<!-- DEEN v8.7.2 — U01 Mobile Readability QA -->
<script id="deen-v872-u01-mobile-readability-runtime">
(()=>{
 if(window.__deenV872U01MobileReadability)return;window.__deenV872U01MobileReadability=true;
 const VERSION='8.7.2-U01-MOBILE-READABILITY-QA',BUILD='872mobile1';
 const REPAIRS={
  'DEEN-U01-S04-007':{
   options_tr:[
    'Tek bir davranıştan kişinin bütün ahlakı hakkında kesin hüküm veriyor.',
    'İbadetin ahlakla hiçbir ilişkisi olmadığını söylüyor.',
    'Ahlakın yalnızca ibadet sırasında önemli olduğunu savunuyor.',
    'İbadetin kişisel bir tercih olduğunu düşündüğü için yanılıyor.'
   ],
   correct_answer:'Tek bir davranıştan kişinin bütün ahlakı hakkında kesin hüküm veriyor.'
  },
  'DEEN-U01-S06-001':{
   options_tr:[
    'İslam; iman, ibadet ve ahlakı birlikte ele alan bir yaşam anlayışıdır.',
    'İslam yalnızca belirli ibadetlerden oluşan bir uygulama alanıdır.',
    'İslam daha çok tarih ve kültür bilgisini öğrenmekle ilgilidir.',
    'İslam sadece ibadet mekânlarında yaşanan kişisel bir gelenektir.'
   ],
   correct_answer:'İslam; iman, ibadet ve ahlakı birlikte ele alan bir yaşam anlayışıdır.'
  },
  'DEEN-U01-S06-005':{
   options_tr:[
    'Din; ibadet kadar dürüstlük ve saygı gibi günlük davranışlara da yansır.',
    'Din yalnızca cami ve diğer ibadet mekânlarında yaşanır.',
    'Günlük davranışların dinî hayatla doğrudan bir ilişkisi yoktur.',
    'Dinin günlük hayattaki tek karşılığı belirli ibadetleri yapmaktır.'
   ],
   correct_answer:'Din; ibadet kadar dürüstlük ve saygı gibi günlük davranışlara da yansır.'
  },
  'DEEN-U01-S06-008':{
   options_tr:[
    'İman kalpteki inanç ve kabulle ilgilidir; söz bunun dışa vurumlarından biridir.',
    'İman yalnızca doğru cümleleri söylemekle tamamlanan sözlü bir ifadedir.',
    'İmanın kalple ilgisi yoktur; önemli olan yalnızca insanların duyduğu sözlerdir.',
    'İman sadece belirli zamanlarda tekrar edilen sözlerden oluşan bir alışkanlıktır.'
   ],
   correct_answer:'İman kalpteki inanç ve kabulle ilgilidir; söz bunun dışa vurumlarından biridir.'
  },
  'DEEN-U01-S06-011':{
   options_tr:[
    'Allah’a bilinçli kulluk amacı taşıyan davranışlar.',
    'Toplumda kabul görmek için yapılan geleneksel davranışlar.',
    'Kişinin yalnızca alışkanlık olarak tekrarladığı hareketler.',
    'Sadece belirli zamanlarda uygulanan toplumsal kurallar.'
   ],
   correct_answer:'Allah’a bilinçli kulluk amacı taşıyan davranışlar.'
  },
  'DEEN-U01-S07-007':{
   options_tr:[
    'Allah’ın mesajını ileten ve yaşamıyla insanlara örnek olan peygamber.',
    'Sadece geçmiş olayları anlatan tarihî bir kişi.',
    'Yalnızca toplumsal kurallar koyan siyasi bir lider.',
    'Sadece kendi dönemindeki insanlara bilgi veren bir öğretici.'
   ],
   correct_answer:'Allah’ın mesajını ileten ve yaşamıyla insanlara örnek olan peygamber.'
  }
 };
 let ready=false,attempts=0,changed=0,found=0;
 function bank(){let q=[];try{if(Array.isArray(QUESTIONS))q=QUESTIONS}catch(_){};if(!q.length&&Array.isArray(window.QUESTIONS))q=window.QUESTIONS;return Array.isArray(q)?q:null}
 function apply(){
  attempts++;const q=bank();if(!q)return false;
  found=0;changed=0;
  Object.entries(REPAIRS).forEach(([id,fix])=>{
   const item=q.find(x=>String(x?.id||'')===id);if(!item)return;found++;
   const sameAnswer=String(item.correct_answer||'')===fix.correct_answer;
   const sameOptions=Array.isArray(item.options_tr)&&item.options_tr.length===fix.options_tr.length&&item.options_tr.every((v,i)=>String(v)===fix.options_tr[i]);
   if(!sameAnswer||!sameOptions)changed++;
   item.options_tr=[...fix.options_tr];item.correct_answer=fix.correct_answer;
  });
  ready=found===Object.keys(REPAIRS).length;
  document.documentElement.dataset.deenU01MobileReadability=ready?'ready':'partial';
  try{document.dispatchEvent(new CustomEvent('deen:u01:mobile-readability',{detail:{version:VERSION,build:BUILD,ready,found,changed}}))}catch(_){}
  setTimeout(()=>{try{window.DEEN_QUESTION_COVERAGE?.scan?.()}catch(_){};try{window.DEEN_U01_FINAL_QA?.run?.()}catch(_){}},0);
  return ready;
 }
 [0,120,420,1000,2200].forEach(ms=>setTimeout(()=>{if(!ready)apply()},ms));
 window.DEEN_U01_MOBILE_READABILITY_QA={version:VERSION,build:BUILD,ids:Object.keys(REPAIRS),apply,check:()=>({version:VERSION,build:BUILD,ready,attempts,found,changed,repairCount:Object.keys(REPAIRS).length})};
})();
<\/script>`;
 window.DEEN_PATCH_V872=function(html){let out=String(html);if(out.includes('deen-v872-u01-mobile-readability-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
