/*
 * Local-only accessibility adapter for source-guarded German activity cards.
 * It changes labels, never answer values, matching pairs, Arabic verses or grades.
 * Not imported by the shipping application.
 */
export function localizeGermanActivityA11y(question,root,{qaMode=false,locale='de',
 verifySource}={}){
 if(qaMode!==true||locale!=='de'||!root||typeof verifySource!=='function')
  throw Error('DE_ACTIVITY_STAGING_QA_ONLY');
 if(question?.__deenContentLocale!=='de'||!question.__deenSourceQuestion)
  throw Error('DE_ACTIVITY_SOURCE_NOT_VERIFIED');
 const verified=verifySource(question.__deenSourceQuestion);
 if(!verified||verified.question_tr!==question.question_tr||
    verified.activity_type!==question.activity_type||
    verified.correct_answer!==question.correct_answer)
  throw Error('DE_ACTIVITY_CONTENT_SIGNATURE_DRIFT');
 let changes=0;
 const label=(node,value)=>{
  if(node.getAttribute('aria-label')!==value){node.setAttribute('aria-label',value);changes++}
 };
 if(question.activity_type==='matching'){
  if(!Array.isArray(question.pairs))throw Error('DE_MATCHING_PAIR_MISSING');
  // Matching chrome is recreated after each question render, *after* the
  // general QA UI pass. Translate only exact, source-observed UI phrases,
  // and only for a verified German matching question. Never edit answer cards,
  // #questionText, #feedbackText, Arabic, or religious/source citations.
  const textIfExact=(selector,source,german)=>{
   for(const node of root.querySelectorAll(selector)){
    if(node.textContent?.trim()===source){
     node.textContent=german;changes++;
    }
   }
  };
  textIfExact('.v1017-subtitle,.v1013-match-subtitle',
   'Doğru kavramları anlamlarıyla eşleştir.',
   'Ordne die Begriffe ihren Bedeutungen zu.');
  textIfExact('#qType',
   'Kavramı doğru açıklamayla eşleştir.',
   'Ordne jedem Begriff die passende Erklärung zu.');
  for(const title of root.querySelectorAll('.v1017-title,.v9916-task-title')){
   if(title.textContent?.replace(/\s+/g,' ').trim()!=='Eşleşen çiftleri bul')continue;
   const klass=title.classList.contains('v9916-task-title')?' class="v1013-mint"':'';
   title.innerHTML='Finde <span'+klass+'>passende Paare</span>';changes++;
  }
  root.querySelectorAll('.v1017-card[data-side][data-pair]').forEach(card=>{
   const side=card.dataset.side,index=Number(card.dataset.pair);
   if(!Number.isInteger(index)||index<0||index>=question.pairs.length||
      !['left','right'].includes(side))throw Error('DE_MATCHING_CARD_SOURCE');
   const text=question.pairs[index][side];
   if(card.querySelector('.v1017-card-label')?.textContent?.trim()!==text)
    throw Error('DE_MATCHING_CARD_LABEL_DRIFT');
   label(card,(side==='left'?'Begriff: ':'Zuordnung: ')+text);
  });
 }else if(question.activity_type==='fill_blank'){
  const options=new Set(question.options_tr||[]);
  const activeBank=root.querySelector('#answerArea');
  if(!activeBank)throw Error('DE_FILL_BANK_MISSING');
  activeBank.querySelectorAll('.fill-choice[data-value]').forEach(card=>{
   const word=card.dataset.value;
   const visibleLabel=card.querySelector('.v1040-fill-chip-label');
   // Runtime may replace the chip's visible label after a selection. The
   // canonical data-value must still equal an approved question option.
   if(!options.has(word)||(visibleLabel&&visibleLabel.textContent?.trim()!==word))
    throw Error('DE_FILL_WORD_SOURCE_DRIFT:'+JSON.stringify({word,options:[...options],label:visibleLabel?.textContent}));
   label(card,word+' in die Lücke einsetzen');
  });
  root.querySelectorAll('.v1040-fill-slot').forEach(slot=>{
   const word=slot.querySelector('.v1040-fill-slot-word')?.textContent?.trim();
   if(word&&!options.has(word))throw Error('DE_FILL_SELECTED_WORD_DRIFT');
   label(slot,word?'Ausgewähltes Wort: '+word:'Leerstelle');
  });
 }
 return {changes,activity:question.activity_type,source_verified:true,production_release:false};
}
