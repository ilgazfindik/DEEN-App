(()=>{
 const VERSION='8.6.5-U01-S04-CONTENT-ENRICHMENT',BUILD='865u01s04';
 const addition=`<!-- DEEN v8.6.5 — U01 S04 Content Enrichment -->
<script id="deen-v865-u01-s04-runtime">
(()=>{
 if(window.__deenV865U01S04)return;window.__deenV865U01S04=true;
 const VERSION='8.6.5-U01-S04-CONTENT-ENRICHMENT',BUILD='865u01s04',TARGET='U01-S04';
 const ITEMS=[
  {
   id:'DEEN-U01-S04-017',stage_id:TARGET,unit_id:'U01',type:'fill_blank',question_type:'fill_blank',activity_type:'fill_blank',difficulty:2,
   topic:'Dürüstlük ve günlük hayat',concept_id:'u01-daily-honesty',
   question_tr:'Kasada sana yanlışlıkla fazla para üstü verildi. Onu geri vermek ___ değerine güçlü bir örnektir.',
   options_tr:['dürüstlük','kabalık','umursamazlık','acelecilik'],fill_choices:['dürüstlük','kabalık','umursamazlık','acelecilik'],correct_answer:'dürüstlük',
   explanation_tr:'Ünitedeki örnekte fazla para üstünü geri vermek dürüst davranışın günlük hayattaki karşılığı olarak ele alınıyor.',
   source_reference:'DEEN U01-S04 mevcut içerik',source_evidence_note:'U01-S04-012 içindeki fazla para üstünü geri verme örneğini boşluk doldurma formatında yeniden ölçer.',source_urls:[],
   terminology_note:'Yeni bir dinî hüküm eklemez; mevcut ünitedeki davranış örneğini farklı formatta ölçer.'
  },
  {
   id:'DEEN-U01-S04-018',stage_id:TARGET,unit_id:'U01',type:'match',question_type:'match',activity_type:'matching',difficulty:2,
   topic:'Günlük davranış ve değer eşleştirme',concept_id:'u01-values-in-action',
   question_tr:'Davranışları öne çıkan değerlerle eşleştir.',
   pairs:[
    {left:'Fazla para üstünü geri vermek',right:'Dürüstlük'},
    {left:'Haksız suçlamada sakin ve adil konuşmak',right:'Adalet'},
    {left:'Yanlış bilgiyi küçümsemeden düzeltmek',right:'Saygı'}
   ],
   explanation_tr:'Aynı değer farklı durumlarda davranışa dönüşebilir; burada ünitedeki üç günlük hayat örneği eşleştiriliyor.',
   source_reference:'DEEN U01-S04 mevcut içerik',source_evidence_note:'U01-S04-012, U01-S04-014 ve U01-S04-016 içindeki örnekleri eşleştirme formatında yeniden ölçer.',source_urls:[],
   terminology_note:'Değer adları mevcut soru ifadelerinden türetilmiştir; yeni hüküm içermez.'
  },
  {
   id:'DEEN-U01-S04-019',stage_id:TARGET,unit_id:'U01',type:'odd_one_out',question_type:'odd_one_out',activity_type:'odd_one_out',difficulty:2,
   topic:'Ahlaki sorumluluk',concept_id:'u01-daily-ethics',
   question_tr:'Üç davranış bu bölümdeki ahlaki sorumluluk anlayışıyla uyumlu. Hangisi uyumlu değildir?',
   options_tr:[
    'Hata yaptıktan sonra özür dilemek',
    'Dedikoduya katılmamak',
    'Fazla para üstünü geri vermek',
    'Kimse görmüyorsa yalan söylemenin sorun olmadığını düşünmek'
   ],
   correct_answer:'Kimse görmüyorsa yalan söylemenin sorun olmadığını düşünmek',
   explanation_tr:'Bu bölüm dürüstlük, özür, saygı ve sorumluluk gibi değerlerin yalnızca başkaları görürken değil günlük davranışlarda da önemli olduğunu vurguluyor.',
   source_reference:'DEEN U01-S04 mevcut içerik',source_evidence_note:'U01-S04-006, U01-S04-010 ve U01-S04-012 içindeki günlük davranış örneklerinden türetilmiş hata bulma etkinliğidir.',source_urls:[],
   terminology_note:'Yeni bir dinî hüküm eklemez; mevcut ahlak örneklerini karşılaştırır.'
  },
  {
   id:'DEEN-U01-S04-020',stage_id:TARGET,unit_id:'U01',type:'card',question_type:'card',activity_type:'card_choice',difficulty:2,
   topic:'İbadet ve ahlak ilişkisi',concept_id:'u01-worship-ethics-link',
   question_tr:'İbadetlerine önem veren biri çevresine karşı da dürüst ve saygılı davranıyor. Bu tablo en iyi neyi gösterir?',
   options_tr:[
    'İbadet ile ahlakın günlük hayatta ilişki kurabildiğini',
    'Ahlakın ibadetle hiçbir ilgisinin olmadığını',
    'Sadece dışarıdan görünen davranışların önemli olduğunu',
    'İyi davranışların yalnızca belirli ortamlarda gerekli olduğunu'
   ],
   correct_answer:'İbadet ile ahlakın günlük hayatta ilişki kurabildiğini',
   explanation_tr:'Ünitede ibadet ve ahlak aynı şey sayılmıyor; ancak birbirinden tamamen kopuk da ele alınmıyor.',
   source_reference:'DEEN U01-S04 mevcut içerik',source_evidence_note:'U01-S04-003, U01-S04-013 ve U01-S04-015 içindeki ibadet-ahlak bağlantısını kart seçim formatında yeniden ölçer.',source_urls:[],
   terminology_note:'Mevcut ünite çerçevesini yeniden ifade eder; yeni hüküm eklemez.'
  },
  {
   id:'DEEN-U01-S04-021',stage_id:TARGET,unit_id:'U01',type:'multiple_choice',question_type:'multiple_choice',activity_type:'multiple_choice',difficulty:2,
   topic:'Günlük hayatta ahlak',concept_id:'u01-values-in-action',
   question_tr:'Bir kişi haksız yere suçlandığında bağırmak yerine sakin ve adil konuşuyor. Burada hangi iki özellik birlikte öne çıkıyor?',
   options_tr:['Sakinlik ve adalet','Öfke ve acelecilik','Gösteriş ve rekabet','Umursamazlık ve kabalık'],
   correct_answer:'Sakinlik ve adalet',
   explanation_tr:'Bölümde aynı durum, tepkiyi kontrol etme ve adil davranma örneği olarak kullanılıyor.',
   source_reference:'DEEN U01-S04 mevcut içerik',source_evidence_note:'U01-S04-016 içindeki örneği hızlı seçim formatında yeniden ölçer.',source_urls:[],
   terminology_note:'Mevcut davranış örneğini farklı biçimde ölçer; yeni hüküm eklemez.'
  },
  {
   id:'DEEN-U01-S04-022',stage_id:TARGET,unit_id:'U01',type:'fill_blank',question_type:'fill_blank',activity_type:'fill_blank',difficulty:2,
   topic:'Saygılı iletişim',concept_id:'u01-values-in-action',
   question_tr:'Yanlış bir bilgiyi karşıdaki kişiyi küçümsemeden düzeltmek, iletişimde ___ değerini öne çıkarır.',
   options_tr:['saygı','kabalık','alay','umursamazlık'],fill_choices:['saygı','kabalık','alay','umursamazlık'],correct_answer:'saygı',
   explanation_tr:'Ünitedeki Selin örneğinde yanlış bilgiyi düzeltirken küçümsememek saygılı bir tutum olarak ele alınıyor.',
   source_reference:'DEEN U01-S04 mevcut içerik',source_evidence_note:'U01-S04-014 içindeki örneği boşluk doldurma formatında yeniden ölçer.',source_urls:[],
   terminology_note:'Yeni bir dinî hüküm eklemez; mevcut davranış örneğini farklı formatta ölçer.'
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
  document.documentElement.dataset.deenU01S04Enrichment='ready';
  try{document.dispatchEvent(new CustomEvent('deen:content:enriched',{detail:{version:VERSION,build:BUILD,target:TARGET,added,ids:ITEMS.map(x=>x.id)}}))}catch(_){}
  setTimeout(()=>{try{window.DEEN_QUESTION_COVERAGE?.scan?.()}catch(_){}},0);
  return true;
 }
 [0,120,420,1000,2200].forEach(ms=>setTimeout(()=>{if(!installed)install()},ms));
 window.DEEN_CONTENT_ENRICHMENT_V865={
  version:VERSION,build:BUILD,target:TARGET,ids:ITEMS.map(x=>x.id),install,
  check:()=>({version:VERSION,build:BUILD,ready:installed,target:TARGET,attempts,added,beforeCount,afterCount,formats:['fill_blank','match','odd_one_out','card','mcq'],concepts:['u01-daily-honesty','u01-values-in-action','u01-daily-ethics','u01-worship-ethics-link']})
 };
})();
<\/script>`;
 window.DEEN_PATCH_V865=function(html){let out=String(html);if(out.includes('deen-v865-u01-s04-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
