(()=>{
 const VERSION='8.6.6-U01-S06-CONTENT-ENRICHMENT',BUILD='866u01s06';
 const addition=`<!-- DEEN v8.6.6 — U01 S06 Content Enrichment -->
<script id="deen-v866-u01-s06-runtime">
(()=>{
 if(window.__deenV866U01S06)return;window.__deenV866U01S06=true;
 const VERSION='8.6.6-U01-S06-CONTENT-ENRICHMENT',BUILD='866u01s06',TARGET='U01-S06';
 const ITEMS=[
  {
   id:'DEEN-U01-S06-013',stage_id:TARGET,unit_id:'U01',type:'fill_blank',question_type:'fill_blank',activity_type:'fill_blank',difficulty:2,
   topic:'İman, ibadet ve ahlak ilişkisi',concept_id:'u01-s06-faith-worship-ethics',
   question_tr:'Bu ünitede iman, ibadet ve ___ birbirinden kopuk değil, ilişkili alanlar olarak ele alınır.',
   options_tr:['ahlak','soy','şehir','meslek'],fill_choices:['ahlak','soy','şehir','meslek'],correct_answer:'ahlak',
   explanation_tr:'Ünitenin temel çerçevesinde iman, ibadet ve ahlak aynı şey değildir; fakat birbirinden tamamen kopuk da düşünülmez.',
   source_reference:'DEEN U01-S06 mevcut içerik',source_evidence_note:'U01-S06-004, U01-S06-006 ve U01-S06-012 içindeki iman-ibadet-ahlak ilişkisini boşluk doldurma biçiminde yeniden ölçer.',source_urls:[],
   terminology_note:'Yeni bir dinî hüküm eklemez; mevcut ünite ilişkisini farklı formatta ölçer.'
  },
  {
   id:'DEEN-U01-S06-014',stage_id:TARGET,unit_id:'U01',type:'card',question_type:'card',activity_type:'card_choice',difficulty:2,
   topic:'İman, ibadet ve ahlak ilişkisi',concept_id:'u01-s06-faith-worship-ethics',
   question_tr:'“İnanç zihinde kalır; ibadet ve ahlakla bağlantısı yoktur.” cümlesini en iyi hangi kart düzeltir?',
   options_tr:[
    'İman, ibadet ve ahlak ilişki kurabilen alanlardır.',
    'İman yalnızca sözden ibarettir.',
    'İbadet sadece başkalarının gördüğü davranışlardır.',
    'Ahlakın inançla hiçbir ilişkisi yoktur.'
   ],
   correct_answer:'İman, ibadet ve ahlak ilişki kurabilen alanlardır.',
   explanation_tr:'Bölümde bu üç alan eşitlenmeden, aralarındaki bağın fark edilmesi hedefleniyor.',
   source_reference:'DEEN U01-S06 mevcut içerik',source_evidence_note:'U01-S06-004 ve U01-S06-006 içindeki aynı kazanımı büyük kart seçimiyle yeniden ölçer.',source_urls:[],
   terminology_note:'Mevcut ünite anlatımını yeniden ifade eder; yeni hüküm eklemez.'
  },
  {
   id:'DEEN-U01-S06-015',stage_id:TARGET,unit_id:'U01',type:'match',question_type:'match',activity_type:'matching',difficulty:2,
   topic:'Temel rehberlik kavramları',concept_id:'u01-s06-guidance-basics',
   question_tr:'Kavramları bu ünitedeki rollerine göre eşleştir.',
   pairs:[
    {left:'Kur’an',right:'Temel rehber'},
    {left:'Hz. Muhammed',right:'Peygamber ve örnek rehber'},
    {left:'İbadet',right:'Kulluk davranışları'},
    {left:'Ahlak',right:'Davranış ve tutumlar'}
   ],
   explanation_tr:'Bu eşleştirme, bölüm boyunca tekrar edilen Kur’an, peygamber, ibadet ve ahlak kavramlarını birlikte hatırlatır.',
   source_reference:'DEEN U01 mevcut kavram çerçevesi',source_evidence_note:'U01-S06-007, U01-S06-009, U01-S06-011 ve önceki U01 aşamalarındaki mevcut kavram açıklamalarını eşleştirme biçiminde toplar.',source_urls:[],
   terminology_note:'Yalnızca mevcut kavram rollerini tekrar eder; yeni dinî ayrıntı eklemez.'
  },
  {
   id:'DEEN-U01-S06-016',stage_id:TARGET,unit_id:'U01',type:'odd_one_out',question_type:'odd_one_out',activity_type:'odd_one_out',difficulty:2,
   topic:'Müslüman kimliği ve rehberlik',concept_id:'u01-s06-guidance-basics',
   question_tr:'Üç ifade bu ünitedeki bilgilerle uyumlu. Hangisi uyumlu değildir?',
   options_tr:[
    'Kur’an Müslümanlar için rehberdir.',
    'Peygamberin hayatı davranışlar için örnek olabilir.',
    'Müslüman olmak belirli bir soydan gelmeyi gerektirir.',
    'İslam günlük hayatla da ilişki kurar.'
   ],
   correct_answer:'Müslüman olmak belirli bir soydan gelmeyi gerektirir.',
   explanation_tr:'Bu ünitede Müslüman kimliğinin belirli bir soy veya millete bağlı olmadığı özellikle vurgulanıyor.',
   source_reference:'DEEN U01-S06 mevcut içerik',source_evidence_note:'U01-S06-002, U01-S06-005, U01-S06-007 ve U01-S06-009 içindeki mevcut bilgileri hata avı formatında karşılaştırır.',source_urls:[],
   terminology_note:'Yeni hüküm eklemez; mevcut bölüm ifadelerinden doğru-yanlış ayrımı yaptırır.'
  },
  {
   id:'DEEN-U01-S06-017',stage_id:TARGET,unit_id:'U01',type:'multiple_choice',question_type:'multiple_choice',activity_type:'multiple_choice',difficulty:2,
   topic:'Kur’an ve günlük rehberlik',concept_id:'u01-s06-guidance-basics',
   question_tr:'“Kur’an yalnızca geçmiş olayları anlatan bir tarih kitabıdır.” ifadesindeki eksikliği en iyi hangi seçenek açıklar?',
   options_tr:[
    'Kur’an aynı zamanda inanç ve yaşam konusunda rehberlik eder.',
    'Kur’an sadece belirli bir millete hitap eder.',
    'Kur’an yalnızca ezberlenmek için vardır.',
    'Kur’an günlük davranışlarla hiçbir bağ kurmaz.'
   ],
   correct_answer:'Kur’an aynı zamanda inanç ve yaşam konusunda rehberlik eder.',
   explanation_tr:'Bölümde Kur’an yalnızca geçmişe ait bilgi olarak değil, Müslümanlar için rehber olarak ele alınıyor.',
   source_reference:'DEEN U01-S06 mevcut içerik',source_evidence_note:'U01-S06-007 içindeki mevcut kazanımı hızlı seçim formatında yeniden ölçer.',source_urls:[],
   terminology_note:'Mevcut bölüm içeriğini yeniden ölçer; yeni dinî hüküm eklemez.'
  }
 ];
 let installed=false,added=0,beforeCount=0,afterCount=0,attempts=0;
 function bank(){let q=[];try{if(Array.isArray(QUESTIONS))q=QUESTIONS}catch(_){};if(!q.length&&Array.isArray(window.QUESTIONS))q=window.QUESTIONS;return Array.isArray(q)?q:null}
 function install(){
  attempts++;const q=bank();if(!q)return false;
  beforeCount=q.filter(x=>String(x?.stage_id||x?.stageId||'')===TARGET).length;
  const ids=new Set(q.map(x=>String(x?.id||'')));
  ITEMS.forEach(item=>{if(!ids.has(item.id)){q.push({...item,options_tr:Array.isArray(item.options_tr)?[...item.options_tr]:item.options_tr,fill_choices:Array.isArray(item.fill_choices)?[...item.fill_choices]:item.fill_choices,pairs:Array.isArray(item.pairs)?item.pairs.map(p=>({...p})):item.pairs,source_urls:Array.isArray(item.source_urls)?[...item.source_urls]:[]});ids.add(item.id);added++}});
  afterCount=q.filter(x=>String(x?.stage_id||x?.stageId||'')===TARGET).length;installed=true;
  document.documentElement.dataset.deenU01S06Enrichment='ready';
  try{document.dispatchEvent(new CustomEvent('deen:content:enriched',{detail:{version:VERSION,build:BUILD,target:TARGET,added,ids:ITEMS.map(x=>x.id)}}))}catch(_){}
  setTimeout(()=>{try{window.DEEN_QUESTION_COVERAGE?.scan?.()}catch(_){}},0);
  return true;
 }
 [0,120,420,1000,2200].forEach(ms=>setTimeout(()=>{if(!installed)install()},ms));
 window.DEEN_CONTENT_ENRICHMENT_V866={
  version:VERSION,build:BUILD,target:TARGET,ids:ITEMS.map(x=>x.id),install,
  check:()=>({version:VERSION,build:BUILD,ready:installed,target:TARGET,attempts,added,beforeCount,afterCount,formats:['fill_blank','card','match','odd_one_out','mcq'],conceptPairs:['u01-s06-faith-worship-ethics','u01-s06-guidance-basics']})
 };
})();
<\/script>`;
 window.DEEN_PATCH_V866=function(html){let out=String(html);if(out.includes('deen-v866-u01-s06-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
