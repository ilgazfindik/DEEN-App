/* French staging UI bridge. NOT referenced by the production entrypoint.
 * Runs only with explicit QA opt-in on loopback; does not store user state. */
(()=>{
 'use strict';
 const local=/^(localhost|127(?:\.\d{1,3}){3}|\[::1\])$/i.test(window.location?.hostname||'');
 if(window.__DEEN_FRENCH_QA__!==true||!local)return;
 if(window.DEEN_FRENCH_STAGE_UI)return;
 const excluded='script,style,noscript,code,textarea,[contenteditable="true"],[data-deen-no-translate],[lang="ar"],.deen-ikhlas-arabic,.deen-mem-arabic,.deen-qj2-ar,.deen-qj2-option.ar';
 const escape=s=>s.replace(/[\^$.*+?()[\]{}|\\]/g,'\\$&');
 const tokenRe=/\{(n|unit|topic)\}/g;
 function template(pattern,translation){
  let cursor=0,match,regex='^',fields=[];
  tokenRe.lastIndex=0;
  while((match=tokenRe.exec(pattern))){
   regex+=escape(pattern.slice(cursor,match.index));
   regex+=match[1]==='n'?'(\\d+)':'(.+?)';
   fields.push(match[1]);cursor=match.index+match[0].length;
  }
  regex+=escape(pattern.slice(cursor))+'$';
  return fields.length?{source:pattern,translation,fields,re:new RegExp(regex,'u')}:null;
 }
 const state={ready:false,locale:'tr',table:new Map(),patterns:[],originals:new WeakMap(),
  attributes:new WeakMap(),writes:0,missing:new Set()};
 function agree(text,fields,values,source=''){
  if(text.startsWith('Tâches quotidiennes : ')&&fields.length===3){
   // First value is progress, second is tasks total, third is pending revisions.
   if(Number(values[1])===1)text=text.replace('terminées','terminée');
   if(Number(values[2])===1)text=text.replace('révisions','révision');
   return text;
  }
  // Quran progress fractions use the *denominator* for verse-count agreement:
  // 0 / 1 verset, but 1 / 7 versets. This is QA-only presentation logic.
  if(text.includes('versets')&&fields.length>=2){
   const total=source==='{n}/{n} ayet {n}/{n} + Solid'?values[1]:values[fields.length-1];
   // For chapter numbers and progress fractions, the second token is the
   // total verse count. The first token can be 1 even when there are 7 verses.
   return Number(total)===1
    ?text.replace('versets','verset').replace('étudiés','étudié'):text;
  }
  const index=fields.indexOf('n'),n=index<0?NaN:Number(values[index]);
  if(n===1)return text.replace('notions apprises','notion apprise')
    .replace(/\bjours\b/gu,'jour').replace(/\bleçons\b/gu,'leçon').replace(/\bversets\b/gu,'verset')
    .replace(/\bQUESTIONS\b/gu,'QUESTION').replace(/\bquestions\b/gu,'question')
    .replace(/\bbonnes réponses\b/gu,'bonne réponse')
    .replace(/\bpoints d’énergie\b/gu,'point d’énergie')
    .replace(/\bpoints de contrôle\b/gu,'point de contrôle')
    .replace(/\bÉCLATS\b/gu,'ÉCLAT').replace(/\bPRÊTS\b/gu,'PRÊT')
    .replace(/\bminutes\b/gu,'minute');
  return text;
 }
 const dateMonths=Object.freeze({
  Oca:'janv.',Şub:'févr.',Mar:'mars',Nis:'avr.',May:'mai',Haz:'juin',
  Tem:'juil.',Ağu:'août',Eyl:'sept.',Eki:'oct.',Kas:'nov.',Ara:'déc.'
 });
 function translatedTurkishDate(source){
  const match=/^([1-9]|[12]\d|3[01]) (Oca|Şub|Mar|Nis|May|Haz|Tem|Ağu|Eyl|Eki|Kas|Ara)$/u.exec(source);
  return match?match[1]+' '+dateMonths[match[2]]:null;
 }
 function translate(raw,lang=state.locale){
  const source=String(raw);
  if(lang!=='fr'||!state.ready)return source;
  const lead=source.match(/^\s*/u)?.[0]||'',tail=source.match(/\s*$/u)?.[0]||'',key=source.trim();
  let text=state.table.get(key);
  if(text==null)text=translatedTurkishDate(key);
  if(text==null){
   for(const pattern of state.patterns){
    const found=pattern.re.exec(key);
    if(!found)continue;
    const values=found.slice(1);let i=0;
    text=pattern.translation.replace(tokenRe,()=>values[i++]);
    text=agree(text,pattern.fields,values,pattern.source);break;
   }
  }
  if(text==null){if(key)state.missing.add(key);return source;}
  return lead+text+tail;
 }
 function remember(node,attribute){
  const storage=attribute?state.attributes:state.originals;
  if(attribute){
   const saved=storage.get(node)||{},now=node.getAttribute(attribute);
   if(!saved[attribute]||saved[attribute].output!==now)saved[attribute]={source:now,output:now};
   storage.set(node,saved);return saved[attribute];
  }
  const now=node.nodeValue;let saved=storage.get(node);
  if(!saved||saved.output!==now){saved={source:now,output:now};storage.set(node,saved);}
  return saved;
 }
 function localize(root=window.document?.body,lang=state.locale){
  if(!root||!state.ready)return 0;
  let changed=0,node;const walker=window.document.createTreeWalker(root,window.NodeFilter.SHOW_TEXT);
  while((node=walker.nextNode())){
   if(node.parentElement?.closest?.(excluded)||/[\u0600-\u06ff]/u.test(node.nodeValue))continue;
   const row=remember(node),value=translate(row.source,lang);
   if(node.nodeValue!==value){node.nodeValue=value;changed++;}
   row.output=value;
  }
  for(const element of root.querySelectorAll?.('[aria-label],[title],[placeholder],[alt]')||[]){
   if(element.closest?.(excluded))continue;
   for(const attr of ['aria-label','title','placeholder','alt']){
    if(!element.hasAttribute(attr))continue;
    const row=remember(element,attr),value=translate(row.source,lang);
    if(element.getAttribute(attr)!==value){element.setAttribute(attr,value);changed++;}
    row.output=value;
   }
  }
  state.writes+=changed;return changed;
 }
 function init({staticTranslations,dynamicTranslations,runtimeObservedTranslations={},
  quranStaticTranslations={},quranDynamicTranslations={},
  p10StaticTranslations={},p10DynamicTranslations={}}){
  if(state.ready)throw Error('FR_PREVIEW_ALREADY_READY');
  if(!staticTranslations||Object.keys(staticTranslations).length!==1452)throw Error('FR_PREVIEW_STATIC_COVERAGE');
  if(!dynamicTranslations||Object.keys(dynamicTranslations).length!==9)throw Error('FR_PREVIEW_DYNAMIC_COVERAGE');
  for(const [key,value] of Object.entries(staticTranslations))
   if(!key.trim()||typeof value!=='string'||!value.trim())throw Error('FR_PREVIEW_EMPTY_UI');
  if(Object.keys(runtimeObservedTranslations).length!==4)throw Error('FR_PREVIEW_OBSERVED_COVERAGE');
  for(const [key,value] of Object.entries(runtimeObservedTranslations)){
   if(!key.trim()||typeof value!=='string'||!value.trim()||Object.hasOwn(staticTranslations,key))
    throw Error('FR_PREVIEW_INVALID_OBSERVED_KEY:'+key);
  }
  if(Object.keys(quranStaticTranslations).length!==54||
     Object.keys(quranDynamicTranslations).length!==17)
   throw Error('FR_PREVIEW_QURAN_COVERAGE');
  for(const [key,value] of Object.entries({...quranStaticTranslations,...quranDynamicTranslations})){
   if(!key.trim()||typeof value!=='string'||!value.trim()||
      Object.hasOwn(staticTranslations,key)||Object.hasOwn(runtimeObservedTranslations,key))
    throw Error('FR_PREVIEW_INVALID_QURAN_KEY:'+key);
  }
  // P10 runs only when the caller explicitly passes staging packs.
  // Quran-only QA keeps its previous opt-in scope without P10 assertions.
  const p10StaticCount=Object.keys(p10StaticTranslations).length;
  const p10DynamicCount=Object.keys(p10DynamicTranslations).length;
  if((p10StaticCount!==0||p10DynamicCount!==0)&&
     (p10StaticCount!==54||p10DynamicCount!==18))
   throw Error('FR_PREVIEW_P10_COVERAGE');
  const existing=new Set([...Object.keys(staticTranslations),
   ...Object.keys(runtimeObservedTranslations),...Object.keys(quranStaticTranslations),
   ...Object.keys(quranDynamicTranslations)]);
  for(const [source,value] of Object.entries({...p10StaticTranslations,...p10DynamicTranslations})){
   if(!source.trim()||typeof value!=='string'||!value.trim()||
      existing.has(source))throw Error('FR_PREVIEW_P10_SOURCE_COLLISION:'+source);
  }
  state.table=new Map([...Object.entries(staticTranslations),...Object.entries(quranStaticTranslations),...Object.entries(p10StaticTranslations)]);
  for(const [key,value] of Object.entries({...dynamicTranslations,...runtimeObservedTranslations,...quranDynamicTranslations,...p10DynamicTranslations})){
   const pattern=template(key,value);
   if(pattern)state.patterns.push(pattern);
   else if(!state.table.has(key))state.table.set(key,value);
  }
  state.ready=true;
  return {staticKeys:Object.keys(staticTranslations).length,observedKeys:Object.keys(runtimeObservedTranslations).length,
   quranStaticDraftKeys:Object.keys(quranStaticTranslations).length,
   quranDynamicDraftKeys:Object.keys(quranDynamicTranslations).length,
   p10StaticDraftKeys:p10StaticCount,p10DynamicDraftKeys:p10DynamicCount,
   dynamicPatterns:state.patterns.length,
   previewOnly:true,productionActivated:false};
 }
 function setLocale(lang,root=window.document?.body){
  if(!['tr','fr'].includes(lang))throw Error('FR_PREVIEW_BAD_LOCALE');
  state.locale=lang;return localize(root,lang);
 }
 // The real DEEN game wraps some question prompts with an unlocalized Turkish
 // learning hint and strips French typographic spacing. Rewrite only when the
 // remaining text matches the source-validated French question exactly.
 // QA-only, not a general DOM rewrite and never touches the underlying answer.
 function localizeQuestionPrompt(visible,validatedFrench){
  if(!state.ready||state.locale!=='fr')return null;
  if(typeof visible!=='string'||typeof validatedFrench!=='string')return null;
  const marker='Birlikte düşün:';
  if(!visible.startsWith(marker))return null;
  const body=visible.slice(marker.length).trim();
  const norm=text=>text.normalize('NFC').replace(/\s+(?=[?!;:])/gu,'')
   .replace(/\s+/gu,' ').trim();
  if(norm(body)!==norm(validatedFrench))return null;
  return 'Réfléchissons ensemble : '+validatedFrench.trim();
 }
 // Grade feedback is generated AFTER the question UI pass. Adapt the exact
 // source-verified French explanation and known Turkish chrome in QA only.
 // Never mutate answer state, grading input, Arabic text or source packs.
 function localizeGradedFeedback(question,root=window.document){
  if(!state.ready||state.locale!=='fr'||question?.__deenContentLocale!=='fr')return null;
  if(!question.__deenSourceQuestion||!question.explanation_tr?.trim())return null;
  const feedback=root.querySelector('#feedback'),title=root.querySelector('#feedbackTitle'),
   body=root.querySelector('#feedbackText'),continueBtn=root.querySelector('#continueBtn');
  if(!feedback?.classList.contains('show'))return null;
  let writes=0;
  if(title&&title.textContent.trim()==='Harika!'){
   title.textContent=translate('Harika!','fr');writes++;
  }
  const full=body?.textContent.trim()||'';
  const expected=question.explanation_tr.trim();
  for(const [prefix,replacement] of [['Kısaca: ','En bref : '],['Özet: ','Résumé : ']]){
   if(body&&full===prefix+expected){
    body.textContent=replacement+expected;writes++;break;
   }
  }
  if(continueBtn&&continueBtn.textContent.trim()==='Devam et'){
   continueBtn.textContent=translate('Devam et','fr');writes++;
  }
  const voiceNames=new Map([['Soruyu dinle','Écouter la question'],
   ['Açıklamayı dinle','Écouter l’explication']]);
  for(const button of root.querySelectorAll('#lesson .v960-speak')){
   const walker=window.document.createTreeWalker(button,window.NodeFilter.SHOW_TEXT);
   let textNode;
   while((textNode=walker.nextNode())){
    const val=textNode.nodeValue,translation=voiceNames.get(val.trim());
    if(translation){textNode.nodeValue=val.replace(val.trim(),translation);writes++;}
   }
  }
  state.writes+=writes;
  return {writes,feedbackVisible:true,sourceGuarded:true,productionActivated:false};
 }
 function audit(){return {ready:state.ready,locale:state.locale,staticKeys:state.table.size,
  dynamicPatterns:state.patterns.length,writes:state.writes,
  unrecognized:[...state.missing],productionActivated:false};}
 window.DEEN_FRENCH_STAGE_UI=Object.freeze({init,translate,localize,setLocale,localizeQuestionPrompt,localizeGradedFeedback,audit,
  version:'fr-staging-preview-v1'});
})();
