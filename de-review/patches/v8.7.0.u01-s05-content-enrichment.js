(()=>{
 const VERSION='8.7.0-U01-S05-CONTENT-ENRICHMENT',BUILD='870u01s05';
 const addition=`<!-- DEEN v8.7.0 — U01 S05 Content Enrichment -->
<script id="deen-v870-u01-s05-runtime">
(()=>{
 if(window.__deenV870U01S05)return;window.__deenV870U01S05=true;
 const VERSION='8.7.0-U01-S05-CONTENT-ENRICHMENT',BUILD='870u01s05',TARGET='U01-S05';
 const ITEMS=[
  {
   id:'DEEN-U01-S05-017',stage_id:TARGET,unit_id:'U01',type:'card',question_type:'card',activity_type:'card_choice',difficulty:2,
   topic:'İslam ve yaşam anlayışı',concept_id:'u01-s05-life-framework',
   question_tr:'İslam’ın bu ünitede anlatılan yaşam anlayışını en iyi hangi kart özetler?',
   options_tr:[
    'İman, ibadet ve ahlakı birlikte ele alan bir yaşam anlayışı',
    'Sadece belirli ibadetlerden oluşan dar bir alan',
    'Yalnızca belirli bir kültüre ait gelenek',
    'Günlük hayatla ilgisi olmayan tarih bilgisi'
   ],
   correct_answer:'İman, ibadet ve ahlakı birlikte ele alan bir yaşam anlayışı',
   explanation_tr:'Bu aşamada İslam; iman, ibadet ve ahlak arasında bağ kuran ve günlük hayata da yansıyan bir çerçevede ele alınıyor.',
   source_reference:'DEEN U01-S05 mevcut içerik',source_evidence_note:'U01-S05-001, U01-S05-005, U01-S05-011 ve U01-S05-013 içindeki mevcut kazanımları kart seçimiyle birlikte ölçer.',source_urls:[],
   terminology_note:'Yeni dinî hüküm eklemez; mevcut S05 kazanımlarını özetler.'
  },
  {
   id:'DEEN-U01-S05-018',stage_id:TARGET,unit_id:'U01',type:'odd_one_out',question_type:'odd_one_out',activity_type:'odd_one_out',difficulty:2,
   topic:'İman ve davranış ilişkisi',concept_id:'u01-s05-faith-action',
   question_tr:'Üç ifade bu bölümdeki iman ve davranış anlayışıyla uyumlu. Hangisi uyumlu değildir?',
   options_tr:[
    'İman yalnızca dışarıdan görülen davranışlarla ölçülemez.',
    'İman kalben inanmayla da ilgilidir.',
    'Davranışlar inancın hayata yansımasına yardım edebilir.',
    'İman sadece insanların dışarıdan gördüğü davranışlardan ibarettir.'
   ],
   correct_answer:'İman sadece insanların dışarıdan gördüğü davranışlardan ibarettir.',
   explanation_tr:'Bölümde iman yalnızca dışarıdan görülen davranışlara indirgenmiyor; kalpte inanma ve bunun hayata yansıması birlikte ele alınıyor.',
   source_reference:'DEEN U01-S05 mevcut içerik',source_evidence_note:'U01-S05-003 ve U01-S05-013 içindeki iman-davranış ilişkisinin hata avı formatında yeniden ölçümüdür.',source_urls:[],
   terminology_note:'Mevcut bölüm anlatımını karşılaştırır; yeni hüküm eklemez.'
  },
  {
   id:'DEEN-U01-S05-019',stage_id:TARGET,unit_id:'U01',type:'scenario',question_type:'scenario',activity_type:'scenario',difficulty:3,
   topic:'İbadet ve günlük sorumluluk',concept_id:'u01-s05-worship-ethics',
   question_tr:'Bir arkadaşın “İbadetlerimi yapıyorum; insanlara karşı nasıl davrandığımın pek önemi yok.” diyor. Bu ünitedeki anlayışa göre en uygun cevap hangisi?',
   options_tr:[
    'İbadet önemlidir; güzel ahlak ve insanlara karşı sorumluluk da önemlidir.',
    'İbadet varsa davranışların hiçbir önemi yoktur.',
    'Ahlak yalnızca ibadet etmeyenler için gereklidir.',
    'İnsanlara karşı davranışlar dinî hayatla tamamen ilgisizdir.'
   ],
   correct_answer:'İbadet önemlidir; güzel ahlak ve insanlara karşı sorumluluk da önemlidir.',
   explanation_tr:'Bu bölüm ibadet ile ahlakı aynı şey saymıyor; ancak insanlara karşı sorumlulukları dinî yaşamdan tamamen kopuk da görmüyor.',
   source_reference:'DEEN U01-S05 mevcut içerik',source_evidence_note:'U01-S05-014 ve U01-S05-016 içindeki ibadet-ahlak bağlantısını günlük konuşma senaryosunda yeniden ölçer.',source_urls:[],
   terminology_note:'Mevcut S05 çerçevesini uygular; yeni dinî hüküm eklemez.'
  },
  {
   id:'DEEN-U01-S05-020',stage_id:TARGET,unit_id:'U01',type:'true_false',question_type:'true_false',activity_type:'true_false',difficulty:2,
   topic:'Kur’an ve günlük yaşam',concept_id:'u01-s05-guidance',
   question_tr:'Kur’an’ın rehberliği günlük yaşam ve davranışlarla da ilişkilidir.',
   options_tr:['Doğru','Yanlış'],correct_answer:'Doğru',
   explanation_tr:'Bu aşamada Kur’an yalnızca geçmişe ait bilgi olarak değil, günlük yaşamda da rehberlik eden temel kaynak olarak ele alınıyor.',
   source_reference:'DEEN U01-S05 mevcut içerik',source_evidence_note:'U01-S05-011 içindeki mevcut kazanımı düşük frekanslı doğru/yanlış formatında yeniden ölçer.',source_urls:[],
   terminology_note:'Mevcut bölüm bilgisini tekrar eder; yeni hüküm eklemez.'
  },
  {
   id:'DEEN-U01-S05-021',stage_id:TARGET,unit_id:'U01',type:'card',question_type:'card',activity_type:'card_choice',difficulty:3,
   topic:'Kur’an ve peygamber rehberliği',concept_id:'u01-s05-guidance',
   question_tr:'Kur’an ve Hz. Muhammed’in bu ünitedeki rolünü en dengeli hangi kart anlatır?',
   options_tr:[
    'Kur’an temel rehberdir; Hz. Muhammed peygamber ve örnek rehberdir.',
    'İkisi de yalnızca tarih öğrenmek için önemlidir.',
    'Kur’an günlük yaşama yön vermez; peygamberin örnekliği de geçmişte kalmıştır.',
    'Rehberlik yalnızca kişisel tercihlerden oluşur.'
   ],
   correct_answer:'Kur’an temel rehberdir; Hz. Muhammed peygamber ve örnek rehberdir.',
   explanation_tr:'Bölüm Kur’an’ın rehberliğini ve Hz. Muhammed’in örnekliğini birlikte hatırlatıyor.',
   source_reference:'DEEN U01-S05 mevcut içerik',source_evidence_note:'U01-S05-010, U01-S05-011 ve U01-S05-015 içindeki mevcut rehberlik kazanımlarını kart formatında birleştirir.',source_urls:[],
   terminology_note:'Yalnızca mevcut U01 kavramlarını yeniden ölçer; yeni dinî ayrıntı eklemez.'
  }
 ];
 let installed=false,added=0,beforeCount=0,afterCount=0,attempts=0;
 function bank(){let q=[];try{if(Array.isArray(QUESTIONS))q=QUESTIONS}catch(_){};if(!q.length&&Array.isArray(window.QUESTIONS))q=window.QUESTIONS;return Array.isArray(q)?q:null}
 function install(){
  attempts++;const q=bank();if(!q)return false;
  beforeCount=q.filter(x=>String(x?.stage_id||x?.stageId||'')===TARGET).length;
  const ids=new Set(q.map(x=>String(x?.id||'')));
  ITEMS.forEach(item=>{if(!ids.has(item.id)){q.push({...item,options_tr:Array.isArray(item.options_tr)?[...item.options_tr]:item.options_tr,source_urls:Array.isArray(item.source_urls)?[...item.source_urls]:[]});ids.add(item.id);added++}});
  afterCount=q.filter(x=>String(x?.stage_id||x?.stageId||'')===TARGET).length;installed=true;
  document.documentElement.dataset.deenU01S05Enrichment='ready';
  try{document.dispatchEvent(new CustomEvent('deen:content:enriched',{detail:{version:VERSION,build:BUILD,target:TARGET,added,ids:ITEMS.map(x=>x.id)}}))}catch(_){}
  setTimeout(()=>{try{window.DEEN_QUESTION_COVERAGE?.scan?.()}catch(_){}},0);
  return true;
 }
 [0,120,420,1000,2200].forEach(ms=>setTimeout(()=>{if(!installed)install()},ms));
 window.DEEN_CONTENT_ENRICHMENT_V870={
  version:VERSION,build:BUILD,target:TARGET,ids:ITEMS.map(x=>x.id),install,
  check:()=>({version:VERSION,build:BUILD,ready:installed,target:TARGET,attempts,added,beforeCount,afterCount,formats:['card','odd_one_out','scenario','true_false'],conceptPairs:['u01-s05-life-framework','u01-s05-faith-action','u01-s05-worship-ethics','u01-s05-guidance']})
 };
})();
<\/script>`;
 window.DEEN_PATCH_V870=function(html){let out=String(html);if(out.includes('deen-v870-u01-s05-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
