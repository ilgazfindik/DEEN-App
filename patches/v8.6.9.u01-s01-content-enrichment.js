(()=>{
 const VERSION='8.6.9-U01-S01-CONTENT-ENRICHMENT',BUILD='869u01s01';
 const addition=`<!-- DEEN v8.6.9 — U01 S01 Content Enrichment -->
<script id="deen-v869-u01-s01-runtime">
(()=>{
 if(window.__deenV869U01S01)return;window.__deenV869U01S01=true;
 const VERSION='8.6.9-U01-S01-CONTENT-ENRICHMENT',BUILD='869u01s01',TARGET='U01-S01';
 const ITEMS=[
  {
   id:'DEEN-U01-S01-015',stage_id:TARGET,unit_id:'U01',type:'match',question_type:'match',activity_type:'matching',difficulty:1,
   topic:'Temel İslam kavramları',concept_id:'u01-s01-core-concepts',
   question_tr:'İlk kavram haritasını tamamla: kavramları doğru açıklamalarla eşleştir.',
   pairs:[
    {left:'İslam',right:'Allah’a teslimiyet ve kulluk merkezli yaşam anlayışı'},
    {left:'Müslüman',right:'İslam’ı benimseyen kişi'},
    {left:'İman',right:'Kalben inanma ve kabul etme'},
    {left:'Ahlak',right:'Davranış ve tutumlarla ilgili alan'}
   ],
   explanation_tr:'Bu dört kavram ünitenin girişinde birbirinden ayrılarak tanıtılıyor; amaç kavramları karıştırmadan temel anlamlarını eşleştirmek.',
   source_reference:'DEEN U01-S01 mevcut içerik',source_evidence_note:'U01-S01-001, U01-S01-004, U01-S01-008 ve U01-S01-007/014 içindeki temel kavramları eşleştirme formatında toplar.',source_urls:[],
   terminology_note:'Yeni dinî hüküm eklemez; mevcut giriş kavramlarını farklı formatta ölçer.'
  },
  {
   id:'DEEN-U01-S01-016',stage_id:TARGET,unit_id:'U01',type:'card',question_type:'card',activity_type:'card_choice',difficulty:1,
   topic:'İslam’ın merkezindeki fikir',concept_id:'u01-s01-islam-meaning',
   question_tr:'İslam’ın temelindeki fikri en iyi hangi kart anlatır?',
   options_tr:[
    'Allah’a teslimiyet ve kulluk',
    'Belirli bir millete ait olmak',
    'Sadece tarih bilgisi öğrenmek',
    'Yalnızca tek bir ibadeti yapmak'
   ],
   correct_answer:'Allah’a teslimiyet ve kulluk',
   explanation_tr:'Ünite girişinde İslam’ın temelinde Allah’a teslimiyet ve kulluk düşüncesi vurgulanıyor.',
   source_reference:'DEEN U01-S01 mevcut içerik',source_evidence_note:'U01-S01-001 ve U01-S01-006 içindeki teslimiyet/kulluk kazanımını kart seçimiyle yeniden ölçer.',source_urls:[],
   terminology_note:'Mevcut ünite ifadesini kullanır; yeni dinî ayrıntı eklemez.'
  },
  {
   id:'DEEN-U01-S01-017',stage_id:TARGET,unit_id:'U01',type:'scenario',question_type:'scenario',activity_type:'scenario',difficulty:2,
   topic:'Müslüman kimliği',concept_id:'u01-s01-muslim-identity',
   question_tr:'Yeni tanıştığın biri “Müslüman olmak belirli bir ülke veya millete bağlı mı?” diye soruyor. En uygun cevap hangisi?',
   options_tr:[
    'Hayır; İslam’ı benimsemek belirli bir ülke veya millete bağlı değildir.',
    'Evet; yalnızca belirli bir ülkede doğanlar Müslüman olabilir.',
    'Sadece aynı dili konuşanlar Müslüman olabilir.',
    'Müslümanlık yalnızca kültürel kökene göre belirlenir.'
   ],
   correct_answer:'Hayır; İslam’ı benimsemek belirli bir ülke veya millete bağlı değildir.',
   explanation_tr:'Bu bölüm Müslüman kimliğini belirli bir ülke, millet veya kültüre değil İslam’ı benimsemeye bağlar.',
   source_reference:'DEEN U01-S01 mevcut içerik',source_evidence_note:'U01-S01-004, U01-S01-005 ve U01-S01-014 içindeki Müslüman kimliği/evrensellik vurgusunu senaryoya dönüştürür.',source_urls:[],
   terminology_note:'Mevcut U01-S01 kazanımını uygular; yeni hüküm eklemez.'
  },
  {
   id:'DEEN-U01-S01-018',stage_id:TARGET,unit_id:'U01',type:'odd_one_out',question_type:'odd_one_out',activity_type:'odd_one_out',difficulty:2,
   topic:'İbadet kavramı',concept_id:'u01-s01-worship',
   question_tr:'Üç ifade bu bölümdeki ibadet anlayışıyla uyumlu. Hangisi uyumlu değildir?',
   options_tr:[
    'İbadet Allah’a kullukla ilgilidir.',
    'İbadet yalnızca namazdan ibaret değildir.',
    'Farklı kulluk davranışları ibadet kapsamında ele alınabilir.',
    'İbadet sadece başkalarına iyi görünmek için yapılır.'
   ],
   correct_answer:'İbadet sadece başkalarına iyi görünmek için yapılır.',
   explanation_tr:'Bölümde ibadet yalnızca namazla sınırlandırılmıyor ve kulluk yönüyle anlatılıyor; gösteriş amacı bu çerçeveyle uyumlu değildir.',
   source_reference:'DEEN U01-S01 mevcut içerik',source_evidence_note:'U01-S01-009 ve U01-S01-010 içindeki ibadet kapsamını hata avı formatında yeniden ölçer.',source_urls:[],
   terminology_note:'Yeni bir hüküm eklemez; mevcut ibadet çerçevesini karşılaştırır.'
  },
  {
   id:'DEEN-U01-S01-019',stage_id:TARGET,unit_id:'U01',type:'true_false',question_type:'true_false',activity_type:'true_false',difficulty:1,
   topic:'Kur’an ve rehberlik',concept_id:'u01-s01-guidance',
   question_tr:'Kur’an Müslümanlar için temel bir rehberdir.',
   options_tr:['Doğru','Yanlış'],correct_answer:'Doğru',
   explanation_tr:'Ünite girişinde Kur’an’ın Müslümanlar için temel rehber olduğu özellikle vurgulanıyor.',
   source_reference:'DEEN U01-S01 mevcut içerik',source_evidence_note:'U01-S01-012 içindeki Kur’an’ın önemi kazanımını tek bir düşük frekanslı doğru/yanlış etkileşimiyle ölçer.',source_urls:[],
   terminology_note:'Mevcut bölüm bilgisini tekrar eder; yeni dinî hüküm eklemez.'
  },
  {
   id:'DEEN-U01-S01-020',stage_id:TARGET,unit_id:'U01',type:'card',question_type:'card',activity_type:'card_choice',difficulty:2,
   topic:'Kur’an ve peygamber rehberliği',concept_id:'u01-s01-guidance',
   question_tr:'Kur’an ve Hz. Muhammed’in bu ünitedeki rehberlik rolünü en iyi hangi kart özetler?',
   options_tr:[
    'Kur’an temel rehberdir; Hz. Muhammed peygamber ve örnek rehberdir.',
    'İkisi de yalnızca geçmiş olayları öğrenmek içindir.',
    'Kur’an günlük hayatla ilgisizdir; peygamberin örnekliği de yalnızca geçmiştedir.',
    'Rehberlik yalnızca kültürel geleneklerden gelir.'
   ],
   correct_answer:'Kur’an temel rehberdir; Hz. Muhammed peygamber ve örnek rehberdir.',
   explanation_tr:'Bölüm Kur’an’ı temel rehber, Hz. Muhammed’i ise peygamber ve örnek rehber olarak tanıtıyor.',
   source_reference:'DEEN U01-S01 mevcut içerik',source_evidence_note:'U01-S01-012 ve U01-S01-013 içindeki Kur’an ve peygamber rehberliğini tek kart sorusunda birleştirir.',source_urls:[],
   terminology_note:'Mevcut giriş içeriğini özetler; yeni dinî ayrıntı eklemez.'
  }
 ];
 let installed=false,added=0,beforeCount=0,afterCount=0,attempts=0;
 function bank(){let q=[];try{if(Array.isArray(QUESTIONS))q=QUESTIONS}catch(_){};if(!q.length&&Array.isArray(window.QUESTIONS))q=window.QUESTIONS;return Array.isArray(q)?q:null}
 function install(){
  attempts++;const q=bank();if(!q)return false;
  beforeCount=q.filter(x=>String(x?.stage_id||x?.stageId||'')===TARGET).length;
  const ids=new Set(q.map(x=>String(x?.id||'')));
  ITEMS.forEach(item=>{if(!ids.has(item.id)){q.push({...item,options_tr:Array.isArray(item.options_tr)?[...item.options_tr]:item.options_tr,pairs:Array.isArray(item.pairs)?item.pairs.map(p=>({...p})):item.pairs,source_urls:Array.isArray(item.source_urls)?[...item.source_urls]:[]});ids.add(item.id);added++}});
  afterCount=q.filter(x=>String(x?.stage_id||x?.stageId||'')===TARGET).length;installed=true;
  document.documentElement.dataset.deenU01S01Enrichment='ready';
  try{document.dispatchEvent(new CustomEvent('deen:content:enriched',{detail:{version:VERSION,build:BUILD,target:TARGET,added,ids:ITEMS.map(x=>x.id)}}))}catch(_){}
  setTimeout(()=>{try{window.DEEN_QUESTION_COVERAGE?.scan?.()}catch(_){}},0);
  return true;
 }
 [0,120,420,1000,2200].forEach(ms=>setTimeout(()=>{if(!installed)install()},ms));
 window.DEEN_CONTENT_ENRICHMENT_V869={
  version:VERSION,build:BUILD,target:TARGET,ids:ITEMS.map(x=>x.id),install,
  check:()=>({version:VERSION,build:BUILD,ready:installed,target:TARGET,attempts,added,beforeCount,afterCount,formats:['match','card','scenario','odd_one_out','true_false'],conceptPairs:['u01-s01-core-concepts','u01-s01-islam-meaning','u01-s01-muslim-identity','u01-s01-worship','u01-s01-guidance']})
 };
})();
<\/script>`;
 window.DEEN_PATCH_V869=function(html){let out=String(html);if(out.includes('deen-v869-u01-s01-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
