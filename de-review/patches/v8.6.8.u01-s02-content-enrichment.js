(()=>{
 const VERSION='8.6.8-U01-S02-CONTENT-ENRICHMENT',BUILD='868u01s02';
 const addition=`<!-- DEEN v8.6.8 — U01 S02 Content Enrichment -->
<script id="deen-v868-u01-s02-runtime">
(()=>{
 if(window.__deenV868U01S02)return;window.__deenV868U01S02=true;
 const VERSION='8.6.8-U01-S02-CONTENT-ENRICHMENT',BUILD='868u01s02',TARGET='U01-S02';
 const BASE_FIX={
  id:'DEEN-U01-S02-006',
  question_tr:'Boşluğu tamamla: İbadetin amacı Allah’a ___ ve O’nun rızasını kazanmaktır.',
  options_tr:['yakınlaşmak','uzaklaşmak','gösteriş yapmak','başkalarını etkilemek'],
  correct_answer:'yakınlaşmak'
 };
 const ITEMS=[
  {
   id:'DEEN-U01-S02-015',stage_id:TARGET,unit_id:'U01',type:'card',question_type:'card',activity_type:'card_choice',difficulty:2,
   topic:'Müslüman kimliği',concept_id:'u01-s02-muslim-identity',
   question_tr:'“Müslüman” kelimesini en doğru anlatan kart hangisi?',
   options_tr:[
    'İslam’ı benimseyen kişi',
    'Belirli bir ülkede doğan kişi',
    'Sadece Arapça konuşan kişi',
    'Yalnızca belirli bir kültüre ait kişi'
   ],
   correct_answer:'İslam’ı benimseyen kişi',
   explanation_tr:'Bu ünitede Müslüman kimliği bir ülke, dil veya millete değil İslam’ı benimsemeye bağlanıyor.',
   source_reference:'DEEN U01-S02 mevcut içerik',source_evidence_note:'U01-S02-001 ve U01-S02-005 içindeki Müslüman kavramını kart seçim formatında yeniden ölçer.',source_urls:[],
   terminology_note:'Yeni bir dinî hüküm eklemez; mevcut kavram tanımını farklı formatta ölçer.'
  },
  {
   id:'DEEN-U01-S02-016',stage_id:TARGET,unit_id:'U01',type:'scenario',question_type:'scenario',activity_type:'scenario',difficulty:2,
   topic:'Müslüman kimliği',concept_id:'u01-s02-muslim-identity',
   question_tr:'Bir arkadaşın “Müslüman olmak için belli bir milletten gelmek gerekir.” diyor. Bu ünitedeki bilgiye göre en uygun cevap hangisi?',
   options_tr:[
    'Hayır; İslam’ı benimsemek belirli bir millete bağlı değildir.',
    'Evet; Müslümanlık yalnızca tek bir millete aittir.',
    'Sadece aynı dili konuşanlar Müslüman olabilir.',
    'Müslümanlık yalnızca doğum yerine göre belirlenir.'
   ],
   correct_answer:'Hayır; İslam’ı benimsemek belirli bir millete bağlı değildir.',
   explanation_tr:'Ünitenin temel çerçevesinde Müslüman kimliği belirli bir soy, ülke veya millet şartına bağlanmıyor.',
   source_reference:'DEEN U01 mevcut içerik',source_evidence_note:'U01-S02-001 ve U01-S02-005 kavramını U01 içindeki evrensellik vurgusuyla günlük konuşma senaryosunda tekrar ölçer.',source_urls:[],
   terminology_note:'Mevcut U01 kazanımını uygular; yeni dinî ayrıntı eklemez.'
  },
  {
   id:'DEEN-U01-S02-017',stage_id:TARGET,unit_id:'U01',type:'odd_one_out',question_type:'odd_one_out',activity_type:'odd_one_out',difficulty:2,
   topic:'İman, ibadet ve ahlak kavramları',concept_id:'u01-s02-core-concepts',
   question_tr:'Üç açıklama bu ünitedeki kavramlarla uyumlu. Hangisi uyumlu değildir?',
   options_tr:[
    'İman: kalben inanma ve kabul etme ile ilgilidir.',
    'İbadet: Allah’a kulluk yönü taşıyan davranışlarla ilgilidir.',
    'Ahlak: davranış ve tutumlarla ilgilidir.',
    'Müslümanlık: yalnızca belirli bir millete ait olmaktır.'
   ],
   correct_answer:'Müslümanlık: yalnızca belirli bir millete ait olmaktır.',
   explanation_tr:'İlk üç ifade bölümdeki iman, ibadet ve ahlak ayrımına uygundur; Müslüman kimliği ise belirli bir millete bağlanmaz.',
   source_reference:'DEEN U01-S02 mevcut içerik',source_evidence_note:'U01-S02-002, U01-S02-004, U01-S02-014 ve Müslüman kavramını tek hata avı etkinliğinde karşılaştırır.',source_urls:[],
   terminology_note:'Mevcut kavram açıklamalarını karşılaştırır; yeni hüküm eklemez.'
  },
  {
   id:'DEEN-U01-S02-018',stage_id:TARGET,unit_id:'U01',type:'card',question_type:'card',activity_type:'card_choice',difficulty:2,
   topic:'İman, ibadet ve ahlak ilişkisi',concept_id:'u01-s02-core-concepts',
   question_tr:'İman, ibadet ve ahlak arasındaki ilişkiyi en iyi hangi kart anlatır?',
   options_tr:[
    'Farklı kavramlardır ama birbirinden tamamen kopuk değildir.',
    'Üçü tam olarak aynı kavramdır.',
    'Birbirleriyle hiçbir ilişkileri yoktur.',
    'Sadece ahlak önemlidir; diğer ikisi gereksizdir.'
   ],
   correct_answer:'Farklı kavramlardır ama birbirinden tamamen kopuk değildir.',
   explanation_tr:'Bölümde iman, ibadet ve ahlak birbirine eşitlenmeden aralarındaki bağın fark edilmesi hedefleniyor.',
   source_reference:'DEEN U01-S02 mevcut içerik',source_evidence_note:'U01-S02-011 ve U01-S02-012 içindeki ilişki kazanımını büyük kart formatında yeniden ölçer.',source_urls:[],
   terminology_note:'Mevcut ünite ilişkisini yeniden ifade eder; yeni dinî hüküm eklemez.'
  },
  {
   id:'DEEN-U01-S02-019',stage_id:TARGET,unit_id:'U01',type:'scenario',question_type:'scenario',activity_type:'scenario',difficulty:2,
   topic:'Kur’an ve peygamber rehberliği',concept_id:'u01-s02-guidance',
   question_tr:'Bir arkadaşın “Kur’an ve peygamber bu ünitede neden birlikte anlatılıyor?” diye soruyor. En uygun cevap hangisi?',
   options_tr:[
    'Kur’an temel rehberdir; Hz. Muhammed de peygamber ve örnek rehberdir.',
    'İkisi de yalnızca tarih öğrenmek içindir.',
    'Kur’an günlük hayatla ilgili değildir.',
    'Peygamberin rehberliği sadece yaşadığı dönemle sınırlıdır.'
   ],
   correct_answer:'Kur’an temel rehberdir; Hz. Muhammed de peygamber ve örnek rehberdir.',
   explanation_tr:'Ünitede Kur’an temel rehber, Hz. Muhammed ise peygamber ve örnek rehber olarak ele alınıyor.',
   source_reference:'DEEN U01-S02 mevcut içerik',source_evidence_note:'U01-S02-009 ve U01-S02-010 içindeki Kur’an ve peygamber rollerini senaryo formatında birlikte ölçer.',source_urls:[],
   terminology_note:'Mevcut bölümdeki rehberlik rollerini birleştirir; yeni dinî ayrıntı eklemez.'
  },
  {
   id:'DEEN-U01-S02-020',stage_id:TARGET,unit_id:'U01',type:'odd_one_out',question_type:'odd_one_out',activity_type:'odd_one_out',difficulty:3,
   topic:'Kur’an ve peygamber rehberliği',concept_id:'u01-s02-guidance',
   question_tr:'Üç ifade bölümdeki rehberlik anlayışıyla uyumlu. Hangisi uyumlu değildir?',
   options_tr:[
    'Kur’an Müslümanlar için temel rehberdir.',
    'Hz. Muhammed peygamber ve örnek rehberdir.',
    'Kur’an ve peygamber bilgisi davranışları anlamaya da yardım eder.',
    'Kur’an yalnızca geçmiş olayları anlatan bir tarih kitabıdır.'
   ],
   correct_answer:'Kur’an yalnızca geçmiş olayları anlatan bir tarih kitabıdır.',
   explanation_tr:'Ünitede Kur’an yalnızca geçmiş bilgisi veren bir metin olarak değil, Müslümanlar için rehber olarak ele alınıyor.',
   source_reference:'DEEN U01 mevcut içerik',source_evidence_note:'U01-S02-009 ve U01-S02-010 içindeki rehberlik kazanımını U01’deki Kur’an vurgusuyla hata avı formatında tekrar ölçer.',source_urls:[],
   terminology_note:'Mevcut U01 içeriğini karşılaştırır; yeni dinî hüküm eklemez.'
  }
 ];
 let installed=false,added=0,beforeCount=0,afterCount=0,attempts=0,baseFixed=0;
 function bank(){let q=[];try{if(Array.isArray(QUESTIONS))q=QUESTIONS}catch(_){};if(!q.length&&Array.isArray(window.QUESTIONS))q=window.QUESTIONS;return Array.isArray(q)?q:null}
 function repairBase(q){
  const item=q.find(x=>String(x?.id||'')===BASE_FIX.id);if(!item)return false;
  const changed=String(item.question_tr||'')!==BASE_FIX.question_tr||String(item.correct_answer||'')!==BASE_FIX.correct_answer||!Array.isArray(item.options_tr)||item.options_tr.length!==BASE_FIX.options_tr.length||item.options_tr.some((v,i)=>String(v)!==BASE_FIX.options_tr[i]);
  item.question_tr=BASE_FIX.question_tr;item.options_tr=[...BASE_FIX.options_tr];item.correct_answer=BASE_FIX.correct_answer;
  if(changed)baseFixed++;
  return true;
 }
 function install(){
  attempts++;const q=bank();if(!q)return false;
  repairBase(q);
  beforeCount=q.filter(x=>String(x?.stage_id||x?.stageId||'')===TARGET).length;
  const ids=new Set(q.map(x=>String(x?.id||'')));
  ITEMS.forEach(item=>{if(!ids.has(item.id)){q.push({...item,options_tr:Array.isArray(item.options_tr)?[...item.options_tr]:item.options_tr,source_urls:Array.isArray(item.source_urls)?[...item.source_urls]:[]});ids.add(item.id);added++}});
  afterCount=q.filter(x=>String(x?.stage_id||x?.stageId||'')===TARGET).length;installed=true;
  document.documentElement.dataset.deenU01S02Enrichment='ready';
  try{document.dispatchEvent(new CustomEvent('deen:content:enriched',{detail:{version:VERSION,build:BUILD,target:TARGET,added,baseFixed,ids:ITEMS.map(x=>x.id)}}))}catch(_){}
  setTimeout(()=>{try{window.DEEN_QUESTION_COVERAGE?.scan?.()}catch(_){}},0);
  return true;
 }
 [0,120,420,1000,2200].forEach(ms=>setTimeout(()=>{if(!installed)install()},ms));
 window.DEEN_CONTENT_ENRICHMENT_V868={
  version:VERSION,build:BUILD,target:TARGET,ids:ITEMS.map(x=>x.id),install,
  check:()=>({version:VERSION,build:BUILD,ready:installed,target:TARGET,attempts,added,baseFixed,beforeCount,afterCount,formats:['card','scenario','odd_one_out'],conceptPairs:['u01-s02-muslim-identity','u01-s02-core-concepts','u01-s02-guidance']})
 };
})();
<\/script>`;
 window.DEEN_PATCH_V868=function(html){let out=String(html);if(out.includes('deen-v868-u01-s02-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
