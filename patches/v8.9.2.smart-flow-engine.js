(()=>{
 const VERSION='8.9.2-SMART-FOCUS-ENGINE',BUILD='892flow1';
 const addition=`<!-- DEEN v8.9.2 — Smart Flow & Focus Engine -->
<script id="deen-v892-focus-runtime">
(()=>{
 if(window.__deenV892Focus)return;window.__deenV892Focus=true;
 
 // --- YAPILANDIRMA ---
 const FORMAT_FAMILIES={
  multiple_choice:['mcq','abcd_classic','abcd_image','true_false'],
  interaction:['drag_drop','puzzle','match_pair','matching'],
  audio_visual:['listen_select','point_object','color_match','pronunciation']
 };
 
 let lastFormat=null,lastQuestionId=null,formatHistory=[];
 let focusMode={active:false,targetQuestion:null,attempts:0};
 
 // --- YARDIMCI FONKSIYONLAR ---
 function getRawType(q){return String(q?.type||q?.question_type||q?.activity_type||'').trim().toLowerCase();}
 
 function classifyFormat(q){
  const raw=getRawType(q);
  if(raw.includes('mcq')||raw.includes('choice')) return 'mcq';
  if(raw.includes('match')) return 'match';
  if(raw.includes('sequence')||raw.includes('order')) return 'sequence';
  if(raw.includes('fill')||raw.includes('blank')) return 'fill_blank';
  if(raw.includes('listen')||raw.includes('audio')) return 'listen_select';
  if(raw.includes('true')||raw.includes('false')) return 'true_false';
  if(raw.includes('scenario')) return 'scenario';
  if(raw.includes('odd')||raw.includes('spot')) return 'odd_one_out';
  return 'mcq'; // Varsayılan
 }
 
 function isFormatAllowed(newFormat){
  if(!lastFormat) return true;
  
  // KESIN KURAL: ABCD türü sorular asla arka arkaya gelmez
  const isLastABCD=FORMAT_FAMILIES.multiple_choice.some(f=>lastFormat.includes(f));
  const isNewABCD=FORMAT_FAMILIES.multiple_choice.some(f=>newFormat.includes(f));
  
  if(isLastABCD&&isNewABCD) return false;
  
  // Son 3 soruda aynı format var mı?
  const recentFormats=formatHistory.slice(-3);
  if(recentFormats.some(f=>f===newFormat)) return false;
  
  return true;
 }
 
 function forceFormatChange(lastType){
  const alternatives=['match','sequence','fill_blank','listen_select','scenario'];
  const allowed=alternatives.filter(f=>!lastType.includes(f));
  return allowed.length>0?allowed[Math.floor(Math.random()*allowed.length)]:'match';
 }
 
 // --- ANA SORU SEÇME MOTORU ---
 function selectNextQuestion(availableQuestions,completedIds){
  // 1. ÖNCE: Odaklanma Modu Kontrolü
  if(focusMode.active&&focusMode.targetQuestion){
   console.log("🎯 ODAKLANMA MODU: Hedef soru tekrar sunuluyor.");
   return transformQuestionForRetry(focusMode.targetQuestion);
  }
  
  // 2. FİLTRELEME: Tamamlananları çıkar
  const pendingQuestions=(availableQuestions||[]).filter(q=>!completedIds.includes(q.id||q.qid));
  
  if(pendingQuestions.length===0) return null; // Bölüm bitti
  
  // 3. AKILLI SEÇİM: Format Çeşitliliği
  let selectedQuestion=null,bestFormat=null;
  let attempts=0;
  const maxAttempts=pendingQuestions.length*2;
  
  while(attempts<maxAttempts){
   const randomIndex=Math.floor(Math.random()*pendingQuestions.length);
   const candidate=pendingQuestions[randomIndex];
   const candidateFormat=classifyFormat(candidate);
   
   // Aynı soru ID'si üst üste gelmesin
   if(candidate.id===lastQuestionId||candidate.qid===lastQuestionId){
    attempts++;
    continue;
   }
   
   // Format kontrolü
   if(isFormatAllowed(candidateFormat)){
    selectedQuestion=candidate;
    bestFormat=candidateFormat;
    break;
   }
   attempts++;
  }
  
  // Havuz daraldığında kuralı esnet ama format değiştir
  if(!selectedQuestion&&pendingQuestions.length>0){
   selectedQuestion=pendingQuestions[0];
   bestFormat=forceFormatChange(lastFormat||'');
   console.warn("⚠️ Havuz dar, format değiştirildi:",bestFormat);
  }
  
  if(selectedQuestion){
   lastFormat=bestFormat;
   lastQuestionId=selectedQuestion.id||selectedQuestion.qid;
   formatHistory.push(bestFormat);
   if(formatHistory.length>5) formatHistory.shift();
   
   return {...selectedQuestion,activeFormat:bestFormat,timestamp:Date.now()};
  }
  
  return null;
 }
 
 // --- ODAKLANMA MODU FONKSIYONLARI ---
 function handleWrongAnswer(question,allQuestions,completedIds){
  console.warn("❌ Yanlış Cevap! Odaklanma Modu devrede.");
  
  focusMode={
   active:true,
   targetQuestion:question,
   attempts:0
  };
  
  // UI'a bildirim gönder
  triggerFocusUI();
  
  // Hemen aynı soruyu (dönüştürülmüş haliyle) geri döndür
  return transformQuestionForRetry(question);
 }
 
 function transformQuestionForRetry(question){
  focusMode.attempts++;
  
  let newFormat='match'; // Varsayılan olarak daha interaktif
  if(focusMode.attempts%2===0) newFormat='sequence';
  else if(focusMode.attempts%3===0) newFormat='listen_select';
  
  console.log(\`🔄 Tekrar Deneme #\${focusMode.attempts} | Format: \${newFormat}\`);
  
  return{
   ...question,
   activeFormat:newFormat,
   isRetry:true,
   retryCount:focusMode.attempts
  };
 }
 
 function handleCorrectAnswer(questionId){
  if(focusMode.active){
   console.log("✅ Odaklanma Modu Başarılı! Kilit açıldı.");
   
   focusMode={active:false,targetQuestion:null,attempts:0};
   
   triggerSuccessUI(true);
   return'FOCUS_CLEARED';
  }
  
  triggerSuccessUI(false);
  return'NORMAL_PROGRESS';
 }
 
 // --- UI TETİKLEYİCİLERİ ---
 function triggerFocusUI(){
  console.log("📢 UI: Odaklanma Modalı Açıldı");
  if(window.DEEN_UI&&window.DEEN_UI.showFocusModal){
   window.DEEN_UI.showFocusModal();
  }
  // Fallback: Basit alert (geliştirme aşamasında)
  // alert("Biraz zorlandık, hadi bunu birlikte öğrenelim!");
 }
 
 function triggerSuccessUI(isFocusClear){
  if(isFocusClear){
   console.log("🎉 UI: Harika! Öğrendin ve devam ediyoruz.");
   if(window.DEEN_UI&&window.DEEN_UI.showFocusSuccess){
    window.DEEN_UI.showFocusSuccess();
   }
  }else{
   console.log("✨ UI: Doğru!");
   if(window.DEEN_UI&&window.DEEN_UI.showNormalSuccess){
    window.DEEN_UI.showNormalSuccess();
   }
  }
 }
 
 // --- ENTGRASYON NOKTALARI ---
 
 // renderQuestion fonksiyonunu wrap et
 const oldRender=typeof renderQuestion==='function'?renderQuestion:null;
 if(oldRender&&!oldRender.__v892){
  const wrapped=function(...args){
   // Eğer odaklanma modundaysak, mevcut soruyu tekrar göster
   if(focusMode.active&&focusMode.targetQuestion){
    const retryQ=transformQuestionForRetry(focusMode.targetQuestion);
    return oldRender.call(this,retryQ,...args.slice(1));
   }
   return oldRender.apply(this,args);
  };
  wrapped.__v892=true;
  try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
 }
 
 // checkAnswer fonksiyonunu wrap et
 const oldCheck=typeof checkAnswer==='function'?checkAnswer:null;
 if(oldCheck&&!oldCheck.__v892){
  const wrapped=function(question,isCorrect,...args){
   if(isCorrect){
    const result=handleCorrectAnswer(question.id||question.qid);
    if(result==='FOCUS_CLEARED'){
     // Odaklanma modu bitti, bir sonraki soruya geç
     setTimeout(()=>{
      if(typeof loadNextQuestion==='function') loadNextQuestion();
     },1500);
     return true;
    }
   }else{
    // Yanlış cevap - odaklanma modunu başlat
    const allQuestions=window.__DEEN_CURRENT_QUESTIONS||[];
    const completedIds=window.__DEEN_COMPLETED_IDS||[];
    const nextQ=handleWrongAnswer(question,allQuestions,completedIds);
    // Soruyu hemen tekrar yükle
    setTimeout(()=>{
     if(typeof renderQuestion==='function') renderQuestion(nextQ);
    },1000);
    return false;
   }
   return oldCheck?oldCheck.call(this,question,isCorrect,...args):isCorrect;
  };
  wrapped.__v892=true;
  try{window.checkAnswer=wrapped;checkAnswer=wrapped}catch(_){window.checkAnswer=wrapped}
 }
 
 // Global API
 window.DEEN_SMART_FOCUS={
  version:VERSION,
  build:BUILD,
  selectNextQuestion,
  handleWrongAnswer,
  handleCorrectAnswer,
  isFocusActive:()=>focusMode.active,
  getFocusTarget:()=>focusMode.targetQuestion,
  reset:()=>{focusMode={active:false,targetQuestion:null,attempts:0};lastFormat=null;lastQuestionId=null;formatHistory=[];}
 };
 
 document.documentElement.dataset.deenSmartFocus='ready';
 console.log("🚀 DEEN v8.9.2 Smart Flow & Focus Engine Yüklendi");
})();
<\/script>`;
 
 if(typeof document!=='undefined'){
  const script=document.createElement('script');
  script.type='text/html';
  script.innerHTML=addition;
  document.head.appendChild(script);
 }
 
 window.DEEN_V892_FOCUS_ENGINE={version:VERSION,build:BUILD,addition};
})();
