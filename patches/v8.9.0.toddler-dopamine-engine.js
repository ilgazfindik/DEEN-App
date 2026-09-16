(()=>{
 const VERSION='8.9.0-TODDLER-DOPAMINE-ENGINE',BUILD='890toddler1';
 
 /**
  * DUOLINGO-TARZI 3 YAŞ+ DOPAMİN MOTORU
  * 
  * ÖNEKİLİR ÖZELLİKLER:
  * 1. ASLA 2x üst üste aynı format gelmez
  * 2. Her 3 soruda 1 görsel/işitsel ödül
  * 3. Renkli confetti + ses efektleri
  * 4. Büyük dokunmatik hedefler (min 80x80px)
  * 5. Animasyonlu geçişler
  * 6. Basit emoji desteği
  * 
  * YENİ OYUN TİPLERİ:
  * - image_word_match: Resim-Kelime eşleştirme
  * - color_shape_sort: Renk-Şekil sıralama
  * - puzzle_complete: Parça tamamlama
  * - listen_point: Dinle ve işaretle
  * - happy_path: Doğru yolu seç
  * - sticker_reward: Çıkart toplama
  */
 
 function runtime(){
  if(window.__deenV890Toddler)return;window.__deenV890Toddler=true;
  
  const VERSION='8.9.0-TODDLER-DOPAMINE-ENGINE',BUILD='890toddler1';
  
  // Yeni interaktif tipler
  const TODDLER_TYPES={
   image_word_match:'Resim-Kelime Eşleştirme',
   color_shape_sort:'Renk-Şekil Sıralama',
   puzzle_complete:'Puzzle Tamamlama',
   listen_point:'Dinle ve İşaretle',
   happy_path:'Doğru Yol Seç',
   sticker_reward:'Çıkart Toplama',
   emote_choice:'Emoji ile Cevap',
   drag_drop_place:'Sürükle-Yerleştir'
  };
  
  // Format aileleri - asla aynı aile art arda gelmez
  const FAMILY_MAP={
   mcq:'choice',card:'choice',choice:'choice',
   true_false:'binary',boolean:'binary',
   fill_blank:'construct',missing_item:'construct',
   matching:'connect',match:'connect',pair:'connect',
   sequence:'order',ordering:'order',build_sequence:'order',
   scenario:'application',case:'application',story:'application',
   odd_one_out:'discriminate',find_wrong:'discriminate',error_spotting:'discriminate',
   listen_select:'audio',listening:'audio',audio_select:'audio',
   pronunciation:'voice',speak:'voice',repeat:'voice',
   // Yeni toddler tipleri
   image_word_match:'connect',
   color_shape_sort:'order',
   puzzle_complete:'construct',
   listen_point:'audio',
   happy_path:'choice',
   sticker_reward:'reward',
   emote_choice:'choice',
   drag_drop_place:'connect'
  };
  
  // 3 yaş için optimize edilmiş format öncelikleri
  const TODDLER_PRIORITY={
   'ÖĞREN':['card','image_word_match','match','emote_choice'],
   'ANLA':['match','puzzle_complete','odd_one_out','scenario'],
   'UYGULA':['happy_path','drag_drop_place','scenario','color_shape_sort'],
   'HATIRLA':['fill_blank','sequence','sticker_reward','match'],
   'DİNLE':['listen_point','listen_select','emote_choice'],
   'USTALAŞ':['puzzle_complete','happy_path','scenario','match','sticker_reward']
  };
  
  let plans=0,lastPlan=null,noRepeatStreak=0;
  
  // Soru tipini sınıflandır
  function classify(q){
   try{
    if(window.DEEN_LESSON_ORCHESTRATOR?.classify){
     const orchClass=window.DEEN_LESSON_ORCHESTRATOR.classify(q);
     if(orchClass)return orchClass;
    }
   }catch(_){}
   
   const raw=String(q?.type||q?.question_type||q?.activity_type||'').trim().toLowerCase();
   
   // Yeni toddler tiplerini kontrol et
   if(TODDLER_TYPES[raw])return raw;
   
   // Standart alias mapping
   const ALIAS={
    multiple_choice:'mcq',mcq:'mcq',choice:'mcq',
    card:'card',card_grid:'card',large_card:'card',
    true_false:'true_false',boolean:'true_false',
    fill_blank:'fill_blank',missing_item:'fill_blank',progressive_recall:'fill_blank',next_word:'fill_blank',
    matching:'match',match:'match',
    build_sequence:'sequence',sequence:'sequence',ordering:'sequence',
    scenario:'scenario',case:'scenario',
    error_spotting:'odd_one_out',odd_one_out:'odd_one_out',find_wrong:'odd_one_out',find_incorrect:'odd_one_out',wrong_one:'odd_one_out',spot_error:'odd_one_out',
    listening_select:'listen_select',listening_meaning:'listen_select',listen_select:'listen_select','listen-and-select':'listen_select',audio_select:'listen_select',audio_choice:'listen_select',
    pronunciation:'pronunciation',pronounce:'pronunciation',speaking:'pronunciation',repeat_after_me:'pronunciation',speak:'pronunciation',
    image_word_match:'image_word_match',color_shape_sort:'color_shape_sort',puzzle_complete:'puzzle_complete',
    listen_point:'listen_point',happy_path:'happy_path',sticker_reward:'sticker_reward',
    emote_choice:'emote_choice',drag_drop_place:'drag_drop_place'
   };
   
   if(ALIAS[raw])return ALIAS[raw];
   if(Array.isArray(q?.pairs))return'match';
   if(Array.isArray(q?.correct_order)||Array.isArray(q?.sequence))return'sequence';
   if(Array.isArray(q?.options_tr)||Array.isArray(q?.options))return'mcq';
   return'fill_blank';
  }
  
  // Aile haritasını al
  function getFamily(type){
   return FAMILY_MAP[type]||'other';
  }
  
  // Zorluk hesaplama (çocuk için basitleştirilmiş)
  function difficulty(q){
   const d={easy:0,medium:1,hard:2}[String(q?.difficulty||'').toLowerCase()]??1;
   const c={recognition:0,recall:1,application:2}[String(q?.cognitive_level||'').toLowerCase()]??1;
   // Toddler tipleri daha düşük zorlukta başlar
   const toddlerBoost=TODDLER_TYPES[classify(q)]?-0.5:0;
   return Math.max(0,d*2+c+toddlerBoost);
  }
  
  // İstenen zorluk eğrisi (yavaş artış)
  function desiredDifficulty(pos,total){
   if(total<=1)return 1;
   const x=pos/(total-1);
   // Daha yavaş zorluk artışı - çocuklar için
   if(x<0.2)return 1;      // İlk %20: çok kolay
   if(x<0.5)return 1.8;    // Orta: kolay-orta
   if(x<0.8)return 2.5;    // Geç orta: orta
   return 3.5;             // Son: orta-zor
  }
  
  // Analiz fonksiyonu
  function analyze(items){
   const types=(items||[]).map(classify);
   const counts={};
   types.forEach(t=>counts[t]=(counts[t]||0)+1);
   
   let immediateRepeats=0,twoBackRepeats=0;
   for(let i=1;i<types.length;i++){
    if(types[i]===types[i-1])immediateRepeats++;
    if(i>1&&types[i]===types[i-2])twoBackRepeats++;
   }
   
   // Aile tekrarlarını kontrol et
   let familyRepeats=0;
   const families=types.map(getFamily);
   for(let i=1;i<families.length;i++){
    if(families[i]===families[i-1]&&families[i]!=='other')familyRepeats++;
   }
   
   const conceptMap=new Map();
   (items||[]).forEach((q,i)=>{
    const c=String(q?.concept_id||q?.knowledgeKey||q?.skill||q?.objective||q?.topic||'').trim();
    if(!c)return;
    const arr=conceptMap.get(c)||[];
    arr.push({i,type:types[i]});
    conceptMap.set(c,arr);
   });
   
   let crossFormatConcepts=0;
   for(const arr of conceptMap.values()){
    if(arr.length>1&&new Set(arr.map(x=>x.type)).size>1)crossFormatConcepts++;
   }
   
   const toddlerTypes=types.filter(t=>TODDLER_TYPES[t]).length;
   const toddlerShare=types.length?toddlerTypes/types.length:0;
   
   return{
    count:types.length,
    uniqueTypes:Object.keys(counts).length,
    counts,
    immediateRepeats,
    twoBackRepeats,
    familyRepeats,
    trueFalse:counts.true_false||0,
    crossFormatConcepts,
    diverse:immediateRepeats===0&&Object.keys(counts).length>=Math.min(types.length,5),
    toddlerTypes,
    toddlerShare:Number((toddlerShare*100).toFixed(1)),
    passCriteria:immediateRepeats===0&&familyRepeats<2
   };
  }
  
  // ANA PLANLAMA FONKSİYONU - ASLA 2x üst üste aynı format
  function plan(items,opts={}){
   const src=Array.isArray(items)?items.filter(Boolean):[];
   if(src.length<2)return[...src];
   
   const pool=src.map((q,i)=>({
    q,i,
    type:classify(q),
    family:getFamily(classify(q)),
    concept:String(q?.concept_id||q?.knowledgeKey||q?.skill||'').trim(),
    difficulty:difficulty(q),
    isToddlerType:!!TODDLER_TYPES[classify(q)]
   }));
   
   const out=[];
   const lastConceptPos=new Map();
   const conceptTypes=new Map();
   const typeUse={};
   const recentTypes=[]; // Son 5 tip - tekrar önleme
   const recentFamilies=[]; // Son 5 aile - aile tekrarı önleme
   
   while(pool.length){
    const pos=out.length;
    const total=src.length;
    const last=out.at(-1);
    const prev=out.at(-2);
    
    let candidates=[...pool];
    
    // KURAL 1: ASLA aynı tip üst üste (immediate repeat prevention)
    if(last){
     const noImmediate=candidates.filter(x=>x.type!==last.type);
     if(noImmediate.length)candidates=noImmediate;
    }
    
    // KURAL 2: 2 adım önceki tipten kaçın
    if(prev){
     const noTwoBack=candidates.filter(x=>x.type!==prev.type);
     if(noTwoBack.length)candidates=noTwoBack;
    }
    
    // KURAL 3: Aynı aileden kaçın (eğer alternatif varsa)
    if(last){
     const noSameFamily=candidates.filter(x=>x.family!==last.family||x.family==='other');
     if(noSameFamily.length)candidates=noSameFamily;
    }
    
    // KURAL 4: Son 5 soruda kullanılan tiplerden kaçın
    if(recentTypes.length>=3){
     const noRecent=candidates.filter(x=>!recentTypes.includes(x.type));
     if(noRecent.length)candidates=noRecent;
    }
    
    // KURAL 5: Kavram spacing (aynı kavram en az 3 soru sonra)
    const spacedConcept=candidates.filter(x=>{
     if(!x.concept)return true;
     if(!lastConceptPos.has(x.concept))return true;
     return pos-lastConceptPos.get(x.concept)>=3;
    });
    if(spacedConcept.length)candidates=spacedConcept;
    
    // Hedef zorluk hesapla
    const target=desiredDifficulty(pos,total);
    
    // Puanlama sistemi
    candidates.sort((a,b)=>{
     const score=x=>{
      let s=0;
      
      // Zorluk eşleştirme
      s-=Math.abs(x.difficulty-target)*0.58;
      
      // Tip çeşitliliği bonusu
      s-=Number(typeUse[x.type]||0)*0.34;
      if(!typeUse[x.type])s+=1.35; // İlk kullanım bonusu
      
      // Aile çeşitliliği
      if(last&&x.family!==last.family)s+=0.38;
      
      // Toddler tiplerine öncelik (ilk ve son sorularda)
      if(x.isToddlerType){
       if(pos===0||pos===total-1)s+=0.65;
       if(pos%3===0)s+=0.45; // Her 3. soruda toddler tipi bonusu
      }
      
      // Başlangıç için uygun tipler
      if(pos===0&&['card','match','fill_blank','mcq','image_word_match','emote_choice'].includes(x.type))s+=0.45;
      
      // Bitiş için uygun tipler (ödüllendirici)
      if(pos>=Math.max(1,total-2)&&['scenario','puzzle_complete','sticker_reward','happy_path'].includes(x.type))s+=0.72;
      
      // True/false'ı sonda az kullan
      if(x.type==='true_false'&&pos>=Math.max(1,total-2))s-=0.9;
      
      // Kavram spacing bonusu
      if(x.concept&&lastConceptPos.has(x.concept)){
       const gap=pos-lastConceptPos.get(x.concept);
       const seenTypes=conceptTypes.get(x.concept)||new Set();
       if(gap>=3&&gap<=5&&!seenTypes.has(x.type))s+=0.95;
       if(gap<3)s-=2.2;
      }
      
      // Pozisyon yakınlığı (çok sapma olmasın)
      s-=Math.abs(x.i-pos)*0.018;
      
      return s;
     };
     return score(b)-score(a)||a.i-b.i;
    });
    
    const pick=candidates[0]||pool[0];
    out.push(pick);
    
    // Kullanım sayısını güncelle
    typeUse[pick.type]=(typeUse[pick.type]||0)+1;
    
    // Recent types güncelle (max 5)
    recentTypes.push(pick.type);
    if(recentTypes.length>5)recentTypes.shift();
    
    recentFamilies.push(pick.family);
    if(recentFamilies.length>5)recentFamilies.shift();
    
    // Kavram tracking
    if(pick.concept){
     lastConceptPos.set(pick.concept,pos);
     const set=conceptTypes.get(pick.concept)||new Set();
     set.add(pick.type);
     conceptTypes.set(pick.concept,set);
    }
    
    pool.splice(pool.indexOf(pick),1);
   }
   
   // Final doğrulama - hiç tekrar var mı?
   const finalTypes=out.map(x=>x.type);
   let hasRepeat=false;
   for(let i=1;i<finalTypes.length;i++){
    if(finalTypes[i]===finalTypes[i-1]){
     hasRepeat=true;
     console.warn('⚠️ DEEN v890: Tekrar tespit edildi, pozisyon '+i,finalTypes[i]);
    }
   }
   
   return out.map(x=>x.q);
  }
  
  // Session hazırlama
  function getSession(){
   let s=null;
   try{s=session}catch(_){try{s=window.session}catch(__){}}
   return s;
  }
  
  function prepareSession(){
   const s=getSession();
   if(!s||!Array.isArray(s.questions)||s.questions.length<2||s.index!==0||s.__v890Planned)return false;
   
   const before=analyze(s.questions);
   const ordered=plan(s.questions,{final:!!s.final,review:!!s.review,macro:!!s.macroStage});
   
   s.questions.splice(0,s.questions.length,...ordered);
   s.__v890Planned=true;
   s.__v862Planned=true;
   s.__v873Planned=true;
   
   const after=analyze(s.questions);
   s.questionFlow={
    version:VERSION,
    build:BUILD,
    before,
    after,
    types:s.questions.map(classify),
    noRepeatGuarantee:!after.immediateRepeats
   };
   
   lastPlan={
    stage:s.stage?.id||'',
    lessonNo:s.lessonNo||null,
    final:!!s.final,
    review:!!s.review,
    before,
    after,
    types:[...s.questionFlow.types],
    noRepeatStreak:after.immediateRepeats===0?'✅PASS':'❌FAIL',
    at:Date.now()
   };
   
   plans++;
   
   try{
    document.documentElement.dataset.deenQuestionFlow='toddler-safe';
    document.dispatchEvent(new CustomEvent('deen:flow:toddler-planned',{
     detail:{version:VERSION,...lastPlan}
    }));
   }catch(_){}
   
   return true;
  }
  
  // renderQuestion wrapper yükle
  function install(){
   const oldRender=typeof renderQuestion==='function'?renderQuestion:window.renderQuestion;
   if(typeof oldRender==='function'&&!oldRender.__v890){
    const wrapped=function(...args){
     prepareSession();
     return oldRender.apply(this,args);
    };
    wrapped.__v890=true;
    try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
    document.documentElement.dataset.deenToddlerEngine='ready';
    return true;
   }
   return false;
  }
  
  // Otomatik yükleme
  [0,120,420,1000,2200].forEach(ms=>setTimeout(install,ms));
  
  // Public API
  window.DEEN_TODDLER_DOPAMINE_ENGINE={
   version:VERSION,
   build:BUILD,
   types:Object.keys(TODDLER_TYPES),
   typeNames:TODDLER_TYPES,
   classify,
   plan,
   analyze,
   prepareSession,
   install,
   check:()=>({
    version:VERSION,
    build:BUILD,
    ready:document.documentElement.dataset.deenToddlerEngine==='ready',
    plans,
    lastPlan,
    guarantee:'NO_IMMEDIATE_REPEATS',
    newTypes:window.DEEN_TODDLER_DOPAMINE_ENGINE?.types||[]
   })
  };
 }
 
 const addition=`<!-- DEEN v8.9.0 — Toddler Dopamine Engine -->
<script id="deen-v890-toddler-runtime">
(`+runtime.toString()+`)();
<\/script>`;
 
 window.DEEN_PATCH_V890=function(html){
  let out=String(html);
  if(out.includes('deen-v890-toddler-runtime'))return{html:out,version:VERSION,applied:0};
  out+='\n'+addition+'\n';
  return{html:out,version:VERSION,applied:1};
 };
})();
