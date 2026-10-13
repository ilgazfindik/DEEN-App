(()=>{
 const VERSION='8.6.7-U01-S07-FINAL-MASTERY',BUILD='867u01s07';
 const addition=`<!-- DEEN v8.6.7 — U01 S07 Final Mastery Enrichment -->
<script id="deen-v867-u01-s07-runtime">
(()=>{
 if(window.__deenV867U01S07)return;window.__deenV867U01S07=true;
 const VERSION='8.6.7-U01-S07-FINAL-MASTERY',BUILD='867u01s07',TARGET='U01-S07';
 const ITEMS=[
  {
   id:'DEEN-U01-S07-015',stage_id:TARGET,unit_id:'U01',type:'fill_blank',question_type:'fill_blank',activity_type:'fill_blank',difficulty:2,
   topic:'Dürüstlük ve ahlak',concept_id:'u01-final-ethics',
   question_tr:'Kimse görmese bile doğruyu söylemek ve emanete sahip çıkmak ___ değerini gösterir.',
   options_tr:['dürüstlük','kabalık','gösteriş','umursamazlık'],fill_choices:['dürüstlük','kabalık','gösteriş','umursamazlık'],correct_answer:'dürüstlük',
   explanation_tr:'Final bölümündeki “kimse görmese bile dürüst davranmak” vurgusu, ahlakın yalnızca başkaları görürken değil her durumda önemli olduğunu hatırlatır.',
   source_reference:'DEEN U01-S07 mevcut içerik',source_evidence_note:'U01-S07-002 içindeki görünmeyen durumda dürüstlük kazanımını boşluk doldurma formatında yeniden ölçer.',source_urls:[],
   terminology_note:'Yeni dinî hüküm eklemez; mevcut ahlak örneğini farklı formatta ölçer.'
  },
  {
   id:'DEEN-U01-S07-016',stage_id:TARGET,unit_id:'U01',type:'match',question_type:'match',activity_type:'matching',difficulty:2,
   topic:'Ünite temel kavramları',concept_id:'u01-final-core-map',
   question_tr:'Final kavram haritasını tamamla: kavramları doğru açıklamalarla eşleştir.',
   pairs:[
    {left:'İslam',right:'Allah’a teslimiyet ve kulluk merkezli yaşam anlayışı'},
    {left:'Müslüman',right:'İslam’ı benimseyen kişi'},
    {left:'Kur’an',right:'Temel rehber'},
    {left:'Hz. Muhammed',right:'Peygamber ve örnek rehber'}
   ],
   explanation_tr:'Bu eşleştirme, ünitenin başından finale kadar tekrar edilen dört temel kavram arasındaki bağı birlikte hatırlatır.',
   source_reference:'DEEN U01 mevcut kavram çerçevesi',source_evidence_note:'U01-S01, U01-S06 ve U01-S07 içindeki İslam, Müslüman, Kur’an ve peygamber kavramlarını final eşleştirmesinde toplar.',source_urls:[],
   terminology_note:'Mevcut ünite tanımlarını yeniden düzenler; yeni dinî ayrıntı eklemez.'
  },
  {
   id:'DEEN-U01-S07-017',stage_id:TARGET,unit_id:'U01',type:'scenario',question_type:'scenario',activity_type:'scenario',difficulty:3,
   topic:'Günlük hayatta dürüstlük',concept_id:'u01-final-ethics',
   question_tr:'Bir arkadaşın “Kimse görmüyorsa küçük bir yalanın önemi yok.” diyor. Bu ünitedeki anlayışa göre en uygun tepki hangisi?',
   options_tr:[
    'Kimse görmese de dürüst davranmaya çalışırım.',
    'Yakalanmayacaksam yalan söyleyebilirim.',
    'Sadece büyük yalanlardan kaçınırım.',
    'Doğruyu söylemek yalnızca kalabalıkta önemlidir.'
   ],
   correct_answer:'Kimse görmese de dürüst davranmaya çalışırım.',
   explanation_tr:'Ünitede dürüstlük, başkalarının görüp görmemesine bağlı bir davranış olarak değil ahlaki bir tutum olarak ele alınıyor.',
   source_reference:'DEEN U01-S07 mevcut içerik',source_evidence_note:'U01-S07-002 içindeki dürüstlük kazanımını günlük hayat senaryosuna dönüştürür.',source_urls:[],
   terminology_note:'Yeni dinî hüküm eklemez; mevcut ahlak kazanımını uygulama düzeyinde ölçer.'
  },
  {
   id:'DEEN-U01-S07-018',stage_id:TARGET,unit_id:'U01',type:'odd_one_out',question_type:'odd_one_out',activity_type:'odd_one_out',difficulty:3,
   topic:'İman, ibadet ve ahlak ilişkisi',concept_id:'u01-final-faith-worship-ethics',
   question_tr:'Üç ifade bu ünitenin ana fikriyle uyumlu. Hangisi uyumlu değildir?',
   options_tr:[
    'İman kalple inanmayı da içerir.',
    'İbadet kulluk davranışlarıyla ilgilidir.',
    'Ahlak günlük davranış ve tutumlarla ilgilidir.',
    'İman, ibadet ve ahlak tamamen kopuk üç ayrı alandır.'
   ],
   correct_answer:'İman, ibadet ve ahlak tamamen kopuk üç ayrı alandır.',
   explanation_tr:'Ünitede bu alanlar aynı şey sayılmıyor; ancak birbirinden tamamen kopuk da ele alınmıyor.',
   source_reference:'DEEN U01-S07 mevcut içerik',source_evidence_note:'U01-S07-003, U01-S07-005 ve U01-S07-013 içindeki temel ilişkiyi hata avı formatında ölçer.',source_urls:[],
   terminology_note:'Mevcut ünite ilişkisini karşılaştırır; yeni hüküm eklemez.'
  },
  {
   id:'DEEN-U01-S07-019',stage_id:TARGET,unit_id:'U01',type:'card',question_type:'card',activity_type:'card_choice',difficulty:2,
   topic:'Kur’an ve ahlak',concept_id:'u01-final-guidance',
   question_tr:'Kur’an’ın ahlaki rehberliğinin günlük hayata yansımasını en iyi hangi kart anlatır?',
   options_tr:[
    'Rehberlik, davranış ve tutumlara da yön verebilir.',
    'Kur’an ahlakla ilgili hiçbir rehberlik sunmaz.',
    'Rehberlik yalnızca geçmiş olayları öğrenmek içindir.',
    'Ahlakın günlük davranışlarla hiçbir ilişkisi yoktur.'
   ],
   correct_answer:'Rehberlik, davranış ve tutumlara da yön verebilir.',
   explanation_tr:'Kur’an’ın rehberliği yalnızca bilgi düzeyinde değil, ahlaki davranış ve tutumları anlamada da yol gösterici bir çerçevede ele alınır.',
   source_reference:'DEEN U01-S07 mevcut içerik',source_evidence_note:'U01-S07-011 ile near-duplicate oluşturan eski doğru/yanlış ifadesi, aynı kazanımı farklı ve uygulamalı bir kart formatında ölçmek için ayrıştırıldı.',source_urls:[],
   terminology_note:'Yeni dinî hüküm eklemez; mevcut U01 rehberlik kazanımını farklı formatta ölçer.'
  },
  {
   id:'DEEN-U01-S07-020',stage_id:TARGET,unit_id:'U01',type:'card',question_type:'card',activity_type:'card_choice',difficulty:3,
   topic:'Ünite genel özeti',concept_id:'u01-final-summary',
   question_tr:'Üniteyi tek kartla kapat: İslam’ı bu bölümün anlattığı çerçevede en iyi hangi ifade özetler?',
   options_tr:[
    'İman, ibadet ve ahlakı birlikte ele alan; Kur’an ve peygamber rehberliğiyle şekillenen bir yaşam anlayışı.',
    'Sadece belirli ibadetlerden oluşan ve günlük hayatla ilgisi olmayan bir yapı.',
    'Yalnızca belirli bir millet veya kültüre ait bir gelenek.',
    'Sadece geçmiş olayları öğrenmeye dayanan bir bilgi alanı.'
   ],
   correct_answer:'İman, ibadet ve ahlakı birlikte ele alan; Kur’an ve peygamber rehberliğiyle şekillenen bir yaşam anlayışı.',
   explanation_tr:'Ünite boyunca İslam; iman, kulluk, ahlak, Kur’an rehberliği ve peygamber örnekliği arasında bağ kuran bütüncül bir çerçevede anlatılıyor.',
   source_reference:'DEEN U01-S07 mevcut içerik',source_evidence_note:'U01-S07-001, U01-S07-004, U01-S07-007, U01-S07-012, U01-S07-013 ve U01-S07-014 içindeki final özetini tek kart seçiminde birleştirir.',source_urls:[],
   terminology_note:'Yalnızca mevcut U01 kazanımlarını özetler; yeni dinî hüküm eklemez.'
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
  document.documentElement.dataset.deenU01S07Enrichment='ready';
  try{document.dispatchEvent(new CustomEvent('deen:content:enriched',{detail:{version:VERSION,build:BUILD,target:TARGET,added,ids:ITEMS.map(x=>x.id)}}))}catch(_){}
  setTimeout(()=>{try{window.DEEN_QUESTION_COVERAGE?.scan?.()}catch(_){}},0);
  return true;
 }
 [0,120,420,1000,2200].forEach(ms=>setTimeout(()=>{if(!installed)install()},ms));
 window.DEEN_CONTENT_ENRICHMENT_V867={
  version:VERSION,build:BUILD,target:TARGET,ids:ITEMS.map(x=>x.id),install,
  check:()=>({version:VERSION,build:BUILD,ready:installed,target:TARGET,attempts,added,beforeCount,afterCount,formats:['fill_blank','match','scenario','odd_one_out','card'],concepts:['u01-final-ethics','u01-final-core-map','u01-final-faith-worship-ethics','u01-final-guidance','u01-final-summary']})
 };
})();
<\/script>`;
 window.DEEN_PATCH_V867=function(html){let out=String(html);if(out.includes('deen-v867-u01-s07-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
