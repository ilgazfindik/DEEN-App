/* Source-guarded question adapter. Missing packs never return Turkish questions. */
(()=>{
 if(window.DEEN_CONTENT_LOCALE)return;
 const loaded=new Map(),loading=new Map();
 const manifest=()=>window.__DEEN_CONTENT_MANIFEST__;
 const same=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
 const blanks=s=>(String(s||'').match(/_{2,}|\[\s*\]|\{blank\}/g)||[]).length;
 function raw(question){return question?.__deenSourceQuestion||question}
 function validate(source,entry){
  if(!source||!entry||!entry.source||!entry.display)return false;
  for(const field of ['question_tr','explanation_tr','activity_type','options_tr','correct_answer','pairs','items','correct_order'])if(!same(source[field],entry.source[field]))return false;
  const d=entry.display;
  if(typeof d.question_tr!=='string'||!d.question_tr.trim()||typeof d.explanation_tr!=='string'||!d.explanation_tr.trim())return false;
  if(blanks(source.question_tr)!==blanks(d.question_tr))return false;
  if(source.activity_type==='matching'){
   if(!Array.isArray(d.pairs)||d.pairs.length!==source.pairs?.length||d.pairs.some(p=>!p?.left?.trim()||!p?.right?.trim()))return false;
  }else if(source.activity_type==='build_sequence'){
   if(!Array.isArray(d.items)||d.items.length!==source.items?.length||new Set(d.items).size!==d.items.length)return false;
   if(!Array.isArray(d.correct_order)||d.correct_order.length!==source.correct_order?.length)return false;
   const indices=source.correct_order.map(item=>source.items.indexOf(item));
   if(indices.some((index,i)=>index<0||d.items[index]!==d.correct_order[i]))return false;
  }else if(Array.isArray(source.options_tr)){
   if(!Array.isArray(d.options_tr)||d.options_tr.length!==source.options_tr.length)return false;
   const index=source.options_tr.indexOf(source.correct_answer);
   if(index<0||d.options_tr[index]!==d.correct_answer||d.options_tr.filter(x=>x===d.correct_answer).length!==1)return false;
  }else if(typeof d.correct_answer!=='string'||!d.correct_answer.trim())return false;
  return true;
 }
 function translateQuestion(question,lang=window.DEEN_APP_LOCALE.get()){
  const source=raw(question);if(lang==='tr')return source;
  if(lang==='ar')return window.DEEN_ARABIC_PILOT?.translateQuestion?.(source)||null;
  const entry=loaded.get(lang)?.questions?.[source?.id];if(!validate(source,entry))return null;
  return {...source,...entry.display,__deenContentLocale:lang,__deenSourceQuestion:source};
 }
 function inspectBank(rows,lang=window.DEEN_APP_LOCALE.get()){
  const failedIds=rows.filter(q=>!translateQuestion(q,lang)).map(q=>q.id);return {sourceCount:rows.length,translated:rows.length-failedIds.length,failedIds};
 }
 async function preload(lang){
  if(lang==='tr')return true;
  if(lang==='ar')return !!await window.DEEN_ARABIC_PILOT?.preload?.();
  const config=manifest()?.languages?.[lang];
  if(config?.question_data!=='complete'||config.global_qa!=='passed'||!config.bank)return false;
  if(loaded.has(lang))return true;if(loading.has(lang))return loading.get(lang);
  const job=(async()=>{
   try{
    const response=await fetch(config.bank+'?build='+encodeURIComponent(window.__DEEN_DEPLOY_ID__||''),{cache:'no-store'});
    if(!response.ok)return false;const pack=await response.json();
    if(pack.locale!==lang||pack.schema_version!==1||pack.expert_approved!==false||!pack.questions)return false;
    loaded.set(lang,pack);
    const base=inspectBank(window.DEEN_BASE_QUESTIONS||[],lang),active=inspectBank(QUESTIONS,lang);
    if(base.sourceCount!==manifest().required_base_questions||active.sourceCount!==manifest().required_active_questions||base.failedIds.length||active.failedIds.length){loaded.delete(lang);return false;}
    return true;
   }catch(_){return false;}finally{loading.delete(lang);}
  })();loading.set(lang,job);return job;
 }
 function available(lang){return ['tr','ar'].includes(lang)||manifest()?.languages?.[lang]?.question_data==='complete'&&manifest()?.languages?.[lang]?.global_qa==='passed'}
 window.DEEN_CONTENT_LOCALE=Object.freeze({preload,translateQuestion,inspectBank,validate,available,manifest,version:'global-content-guard-v1'});
})();
