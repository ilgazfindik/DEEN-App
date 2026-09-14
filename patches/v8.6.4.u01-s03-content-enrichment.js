(()=>{
 const VERSION='8.6.4-U01-S03-CONTENT-ENRICHMENT',BUILD='864u01s03';
 const addition=`<!-- DEEN v8.6.4 — U01 S03 Content Enrichment -->
<script id="deen-v864-u01-s03-runtime">
(()=>{
 if(window.__deenV864U01S03)return;window.__deenV864U01S03=true;
 const VERSION='8.6.4-U01-S03-CONTENT-ENRICHMENT',BUILD='864u01s03',TARGET='U01-S03';
 const ITEMS=[
  {
   id:'DEEN-U01-S03-015',stage_id:TARGET,unit_id:'U01',type:'fill_blank',question_type:'fill_blank',activity_type:'fill_blank',difficulty:2,
   topic:'İman, ibadet ve ahlak ilişkisi',concept_id:'u01-triad-relation',
   question_tr:'İman, ibadet ve ___ birlikte ele alındığında inanç, kulluk ve davranış arasındaki bağ daha açık görülür.',
   options_tr:['ahlak','soy','şehir','meslek'],fill_choices:['ahlak','soy','şehir','meslek'],correct_answer:'ahlak',
   explanation_tr:'Bu ünitede iman, ibadet ve ahlak farklı fakat birbiriyle ilişkili alanlar olarak ele alınıyor.',
   source_reference:'DEEN U01 mevcut kavram çerçevesi',source_evidence_note:'Mevcut U01 soru havuzundaki iman, ibadet ve ahlak ilişkisini farklı bir etkileşim biçimiyle yeniden ölçer.',source_urls:[],
   terminology_note:'Yeni bir dinî hüküm eklemez; mevcut ünite kavramlarını yeniden ölçer.'
  },
  {
   id:'DEEN-U01-S03-016',stage_id:TARGET,unit_id:'U01',type:'scenario',question_type:'scenario',activity_type:'scenario',difficulty:2,
   topic:'İman, ibadet ve ahlak ilişkisi',concept_id:'u01-triad-relation',actor_tr:'Mert',
   question_tr:'Bu düşünceyi en iyi hangi cevap düzeltir?',decision_prompt_tr:'Mert’in düşüncesini en iyi hangi cevap düzeltir?',
   scenario_tr:'Mert, “İnanç benim içimde; ibadet ve davranışlarımla hiçbir ilgisi yok.” diyor.',
   options_tr:[
    'İman, ibadet ve ahlak farklı alanlardır ama birbirleriyle ilişkilidir.',
    'Sadece davranışlar önemlidir; inanç önemli değildir.',
    'İbadet yalnızca başkalarının gördüğü davranışlardan oluşur.',
    'Ahlakın dinî öğrenmeyle hiçbir ilişkisi yoktur.'
   ],
   correct_answer:'İman, ibadet ve ahlak farklı alanlardır ama birbirleriyle ilişkilidir.',
   explanation_tr:'Ünite, iman, ibadet ve ahlakı aynı şey saymadan aralarındaki ilişkiyi kurmayı hedefliyor.',
   source_reference:'DEEN U01 mevcut kavram çerçevesi',source_evidence_note:'U01-S03 ve U01-S06 içindeki mevcut kavram ilişkilerinin senaryo biçiminde yeniden ölçümüdür.',source_urls:[],
   terminology_note:'Yeni bir dinî hüküm eklemez; mevcut ünite kavramlarını yeniden ölçer.'
  },
  {
   id:'DEEN-U01-S03-017',stage_id:TARGET,unit_id:'U01',type:'odd_one_out',question_type:'odd_one_out',activity_type:'odd_one_out',difficulty:2,
   topic:'İslam ve Müslüman kavramları',concept_id:'u01-islam-muslim-relation',
   question_tr:'Üç ifade bu ünitedeki kavramlarla uyumlu. Hangisi hatalı?',
   options_tr:[
    'Kur’an Müslümanlar için temel bir rehberdir.',
    'Hz. Muhammed Müslümanlar için rehberlik eden peygamberdir.',
    'Ahlak insanın davranışlarıyla ilgilidir.',
    'Müslüman olmak belirli bir millete mensup olmayı gerektirir.'
   ],
   correct_answer:'Müslüman olmak belirli bir millete mensup olmayı gerektirir.',
   explanation_tr:'Bu ünitedeki anlatıma göre Müslüman kimliği belirli bir ülke, soy veya millete bağlı değildir.',
   source_reference:'DEEN U01 mevcut kavram çerçevesi',source_evidence_note:'U01-S01 ve U01-S06 içindeki mevcut Müslüman kimliği anlatımını hata bulma formatında yeniden ölçer.',source_urls:[],
   terminology_note:'Yeni bir dinî hüküm eklemez; mevcut ünite kavramlarını yeniden ölçer.'
  },
  {
   id:'DEEN-U01-S03-018',stage_id:TARGET,unit_id:'U01',type:'multiple_choice',question_type:'multiple_choice',activity_type:'multiple_choice',difficulty:2,
   topic:'İslam ve Müslüman kavramları',concept_id:'u01-islam-muslim-relation',
   question_tr:'İslam ile Müslüman arasındaki ilişkiyi en doğru hangi ifade kurar?',
   options_tr:[
    'İslam dinin adıdır; Müslüman İslam’ı benimseyen kişidir.',
    'İslam bir milletin adıdır; Müslüman o milletten doğan kişidir.',
    'İslam yalnızca ibadetlerin adıdır; Müslüman yalnızca ibadet sırasında kullanılan bir addır.',
    'İslam ve Müslüman tamamen aynı kavramdır.'
   ],
   correct_answer:'İslam dinin adıdır; Müslüman İslam’ı benimseyen kişidir.',
   explanation_tr:'Kavramlar bağlantılıdır fakat aynı şeyi ifade etmez: İslam dinin adıdır; Müslüman ise İslam’ı benimseyen kişidir.',
   source_reference:'DEEN U01 mevcut kavram çerçevesi',source_evidence_note:'U01-S03 içindeki mevcut “İslam ile Müslüman arasındaki bağ” kazanımını ikinci bir formatla yeniden ölçer.',source_urls:[],
   terminology_note:'Yeni bir dinî hüküm eklemez; mevcut ünite kavramlarını yeniden ölçer.'
  }
 ];
 let installed=false,added=0,beforeCount=0,afterCount=0,attempts=0;
 function bank(){let q=[];try{if(Array.isArray(QUESTIONS))q=QUESTIONS}catch(_){};if(!q.length&&Array.isArray(window.QUESTIONS))q=window.QUESTIONS;return Array.isArray(q)?q:null}
 function install(){
  attempts++;const q=bank();if(!q)return false;
  const targetBefore=q.filter(x=>String(x?.stage_id||x?.stageId||'')===TARGET);beforeCount=targetBefore.length;
  const ids=new Set(q.map(x=>String(x?.id||'')));
  ITEMS.forEach(item=>{if(!ids.has(item.id)){q.push({...item,options_tr:Array.isArray(item.options_tr)?[...item.options_tr]:item.options_tr,fill_choices:Array.isArray(item.fill_choices)?[...item.fill_choices]:item.fill_choices,source_urls:Array.isArray(item.source_urls)?[...item.source_urls]:[]});ids.add(item.id);added++}});
  afterCount=q.filter(x=>String(x?.stage_id||x?.stageId||'')===TARGET).length;installed=true;
  document.documentElement.dataset.deenU01S03Enrichment='ready';
  try{document.dispatchEvent(new CustomEvent('deen:content:enriched',{detail:{version:VERSION,build:BUILD,target:TARGET,added,ids:ITEMS.map(x=>x.id)}}))}catch(_){}
  setTimeout(()=>{try{window.DEEN_QUESTION_COVERAGE?.scan?.()}catch(_){}},0);
  return true;
 }
 [0,120,420,1000,2200].forEach(ms=>setTimeout(()=>{if(!installed)install()},ms));
 window.DEEN_CONTENT_ENRICHMENT_V864={
  version:VERSION,build:BUILD,target:TARGET,ids:ITEMS.map(x=>x.id),install,
  check:()=>({version:VERSION,build:BUILD,ready:installed,target:TARGET,attempts,added,beforeCount,afterCount,formats:['fill_blank','scenario','odd_one_out','mcq'],conceptPairs:['u01-triad-relation','u01-islam-muslim-relation']})
 };
})();
<\/script>`;
 window.DEEN_PATCH_V864=function(html){let out=String(html);if(out.includes('deen-v864-u01-s03-runtime'))return{html:out,version:VERSION,applied:0};out+='\n'+addition+'\n';return{html:out,version:VERSION,applied:1}};
})();
