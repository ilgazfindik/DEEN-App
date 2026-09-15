(()=>{
 const VERSION='8.7.2-U01-NEAR-DUPLICATE-FIX',BUILD='872dup1';
 const addition=`<!-- DEEN v8.7.2 — U01 Near-Duplicate Fix -->
<script id="deen-v872-u01-near-duplicate-fix-runtime">
(()=>{
 if(window.__deenV872U01NearDuplicateFix)return;window.__deenV872U01NearDuplicateFix=true;
 const VERSION='8.7.2-U01-NEAR-DUPLICATE-FIX',BUILD='872dup1',TARGET='DEEN-U01-S07-019';
 const PROMPT='Kur’an’ın ahlaki rehberliğinin günlük hayata yansımasını en iyi hangi kart anlatır?';
 const OPTIONS=[
  'Rehberlik, davranış ve tutumlara da yön verebilir.',
  'Kur’an ahlakla ilgili hiçbir rehberlik sunmaz.',
  'Rehberlik yalnızca geçmiş olayları öğrenmek içindir.',
  'Ahlakın günlük davranışlarla hiçbir ilişkisi yoktur.'
 ];
 const ANSWER=OPTIONS[0];
 let ready=false,attempts=0,changed=0,before=null,after=null;
 function bank(){let q=[];try{if(Array.isArray(QUESTIONS))q=QUESTIONS}catch(_){};if(!q.length&&Array.isArray(window.QUESTIONS))q=window.QUESTIONS;return Array.isArray(q)?q:null}
 function apply(){
  attempts++;const q=bank();if(!q)return false;
  const item=q.find(x=>String(x?.id||'')===TARGET);if(!item)return false;
  before=before||{type:String(item.type||item.question_type||item.activity_type||''),question_tr:String(item.question_tr||''),options_tr:Array.isArray(item.options_tr)?[...item.options_tr]:[],correct_answer:item.correct_answer};
  const already=String(item.type||'')==='card'&&String(item.question_tr||'')===PROMPT;
  item.type='card';item.question_type='card';item.activity_type='card_choice';
  item.question_tr=PROMPT;item.options_tr=[...OPTIONS];item.correct_answer=ANSWER;
  item.explanation_tr='Kur’an’ın rehberliği yalnızca bilgi düzeyinde değil, ahlaki davranış ve tutumları anlamada da yol gösterici bir çerçevede ele alınır.';
  item.source_evidence_note='U01-S07-011 ile near-duplicate oluşturan eski doğru/yanlış ifadesi, aynı kazanımı farklı ve uygulamalı bir kart formatında ölçmek için ayrıştırıldı.';
  item.terminology_note='Yeni dinî hüküm eklemez; mevcut U01 rehberlik kazanımını farklı formatta ölçer.';
  if(!already)changed++;
  after={type:item.type,question_tr:item.question_tr,options_tr:[...item.options_tr],correct_answer:item.correct_answer};
  ready=true;document.documentElement.dataset.deenU01NearDuplicateFix='ready';
  try{document.dispatchEvent(new CustomEvent('deen:content:qa-fix',{detail:{version:VERSION,build:BUILD,target:TARGET,changed}}))}catch(_){}
  setTimeout(()=>{try{window.DEEN_QUESTION_COVERAGE?.scan?.()}catch(_){};try{window.DEEN_U01_FINAL_QA?.run?.()}catch(_){}},0);
  return true;
 }
 [0,120,420,1000,2200].forEach(ms=>setTimeout(()=>{if(!ready)apply()},ms));
 window.DEEN_U01_NEAR_DUPLICATE_FIX={version:VERSION,build:BUILD,target:TARGET,apply,check:()=>({version:VERSION,build:BUILD,ready,target:TARGET,attempts,changed,before,after})};
})();
<\/script>`;
 window.DEEN_PATCH_V872=function(html){let out=String(html);if(out.includes('deen-v872-u01-near-duplicate-fix-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
